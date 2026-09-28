import * as THREE from 'three'

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`

// Slow domain-warped noise: reads like milk folding into coffee.
const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uVel;
uniform vec3 uBase;
uniform vec3 uSwirl;
uniform float uAmount;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p) {
  float f = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { f += a * snoise(p); p *= 2.02; a *= 0.5; }
  return f;
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 1.6;
  float t = uTime * 0.045;

  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 1.6;
  float md = exp(-dot(p - m, p - m) * 3.0);

  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.4 + md * 0.35),
                fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 1.2));
  float f = fbm(p + (2.6 + uVel * 1.5) * r);

  float swirl = smoothstep(-0.7, 1.1, f) * uAmount;
  vec3 col = mix(uBase, uSwirl, swirl);
  col += md * 0.025 * uAmount;

  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  col *= mix(0.9, 1.0, vig);
  col += (hash(uv * uRes + fract(uTime)) - 0.5) * 0.035;

  gl_FragColor = vec4(col, 1.0);
}`

type RGB = { r: number; g: number; b: number }

export type Backdrop = {
  setVelocity: (v: number) => void
  destroy: () => void
}

export function createBackdrop(canvas: HTMLCanvasElement, colors: { base: RGB; swirl: RGB }): Backdrop | null {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'low-power' })
  } catch {
    return null
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  // Keep colour values in sRGB so shader colours match the CSS tokens exactly
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.Camera()
  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uVel: { value: 0 },
    uBase: { value: new THREE.Color() },
    uSwirl: { value: new THREE.Color() },
    uAmount: { value: 1 },
  }
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms }),
  )
  scene.add(mesh)

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    renderer.setSize(w, h, false)
    uniforms.uRes.value.set(w, h)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  const mouseTarget = new THREE.Vector2(0.5, 0.5)
  const onMove = (e: PointerEvent) => {
    mouseTarget.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
  }
  window.addEventListener('pointermove', onMove, { passive: true })

  let velTarget = 0
  let raf = 0
  const clock = new THREE.Clock()
  const tick = () => {
    raf = requestAnimationFrame(tick)
    if (document.hidden) return
    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uBase.value.setRGB(colors.base.r, colors.base.g, colors.base.b, THREE.LinearSRGBColorSpace)
    uniforms.uSwirl.value.setRGB(colors.swirl.r, colors.swirl.g, colors.swirl.b, THREE.LinearSRGBColorSpace)
    uniforms.uMouse.value.lerp(mouseTarget, 0.05)
    uniforms.uVel.value += (velTarget - uniforms.uVel.value) * 0.06
    velTarget *= 0.92
    renderer.render(scene, camera)
  }
  tick()

  return {
    setVelocity: (v) => {
      velTarget = Math.min(Math.abs(v) / 40, 1)
    },
    destroy: () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      renderer.dispose()
    },
  }
}
