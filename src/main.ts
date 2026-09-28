import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { render } from './markup.ts'
import type { Backdrop } from './webgl.ts'

gsap.registerPlugin(ScrollTrigger)

document.querySelector<HTMLDivElement>('#app')!.innerHTML = render()

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s)!
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)]

const palette = {
  cocoa: { base: '#5a3426', swirl: '#673c2c' },
  cream: { base: '#f2eee8', swirl: '#f9f6f2' },
  board: { base: '#4a2a1d', swirl: '#583325' },
}
// The shader works in plain sRGB, so channels are just hex / 255
const toRGB = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  return { r: (n >> 16) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }
}

if (reduced) {
  // Static page: every scene is a normal full-height section, nav links jump natively.
  document.documentElement.classList.add('static')
} else {
  document.documentElement.classList.add('motion')
  initMotion()
}

function initMotion() {
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)

  // The timeline tweens these plain colour objects; the WebGL backdrop (loaded lazily,
  // so three.js stays off the critical path) reads them every frame.
  const colors = { base: toRGB(palette.cocoa.base), swirl: toRGB(palette.cocoa.swirl) }
  // CSS fallback until WebGL is up (or if it never is)
  $('.stage').style.background = 'var(--color-cocoa)'
  const syncFallback = () => {
    const { r, g, b } = colors.base
    $('.stage').style.background = `rgb(${r * 255} ${g * 255} ${b * 255})`
  }
  let backdrop: Backdrop | null = null
  import('./webgl.ts').then(({ createBackdrop }) => {
    backdrop = createBackdrop($<HTMLCanvasElement>('.webgl'), colors)
    if (!backdrop) return
    lenis.on('scroll', ({ velocity }: { velocity: number }) => backdrop?.setVelocity(velocity))
    gsap.to('.webgl', { autoAlpha: 1, duration: 0.8 })
  })

  const setPalette = (tl: gsap.core.Timeline, name: keyof typeof palette, at: number | string, duration = 0.8) => {
    const p = palette[name]
    tl.to(colors.base, { ...toRGB(p.base), duration, ease: 'none', onUpdate: syncFallback }, at)
    tl.to(colors.swirl, { ...toRGB(p.swirl), duration, ease: 'none' }, at)
  }

  const hero = $('#hero')
  const bag = $('#bag')
  const brew = $('#brew')
  const lens = $('#lens')
  const board = $('#board')

  // ── Intro (plays once on load, independent of scroll) ────────────────
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } })
  intro
    .from($$('.char', hero), { yPercent: 115, rotate: 8, duration: 1.3, stagger: 0.045 }, 0.15)
    .from('.hero-person', { yPercent: 45, duration: 1.5, ease: 'expo.out' }, 0.35)
    .from(['.hero-role', '.hero-hint'], { autoAlpha: 0, y: 12, duration: 1, stagger: 0.1 }, 0.9)
    .from('.scene-nav', { autoAlpha: 0, x: 10, duration: 1 }, 1.1)
  gsap.to('.hint-dot', { yPercent: 230, duration: 1.4, repeat: -1, ease: 'power2.inOut' })

  // Pointer parallax on the hero layers
  const par = $$('.hero-par', hero).map((el, i) => ({
    x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
    depth: i === 0 ? -14 : 22,
  }))
  window.addEventListener(
    'pointermove',
    (e) => {
      const nx = e.clientX / window.innerWidth - 0.5
      par.forEach((p) => p.x(nx * p.depth))
    },
    { passive: true },
  )

  // ── Scroll choreography ──────────────────────────────────────────────
  gsap.set([bag, brew, lens, board], { autoAlpha: 0 })

  const bagEl = $('.the-bag', bag)
  const items = $$('.bag-item', bag)
  const itemInners = $$('.item-inner', bag)

  // Offset from an item's resting spot back to the mouth of the bag.
  // offset* ignores transforms, so this stays correct mid-animation and on resize.
  const mouth = (el: HTMLElement, axis: 'x' | 'y') =>
    axis === 'x'
      ? bagEl.offsetLeft - el.offsetLeft
      : bagEl.offsetTop + bagEl.offsetHeight * 0.3 - el.offsetTop

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut', duration: 1 },
    scrollTrigger: {
      trigger: '.stage',
      start: 'top top',
      end: () => '+=' + window.innerHeight * 9,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      snap: { snapTo: 'labelsDirectional', duration: { min: 0.3, max: 1 }, delay: 0.12, ease: 'power2.inOut' },
      onUpdate: (self) => updateNav(self.progress),
    },
  })

  tl.addLabel('hero', 0)

  // hero → bag
  tl.to($$('.char-outer', hero), { yPercent: -70, autoAlpha: 0, stagger: 0.03, duration: 0.7, ease: 'power2.in' }, 0.2)
    .to('.hero-person-wrap', { yPercent: 35, autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, 0.25)
    .to(['.hero-role', '.hero-hint'], { autoAlpha: 0, duration: 0.3 }, 0.2)
    .set(hero, { autoAlpha: 0 }, 1.1)
  setPalette(tl, 'cream', 0.5, 0.7)

  tl.set(bag, { autoAlpha: 1 }, 0.9)
    .from(bagEl, { yPercent: 70, duration: 0.8, ease: 'power3.out' }, 0.9)
    .from($$('.bag-title > *', bag), { y: 40, autoAlpha: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out' }, 1.05)

  // items burst out of the bag and settle
  items.forEach((el, i) => {
    const at = 1.8 + i * 0.12
    tl.from(el, { x: () => mouth(el, 'x'), duration: 1, ease: 'power1.out' }, at)
      .from(el, { y: () => mouth(el, 'y'), duration: 1, ease: 'back.out(1.3)' }, at)
      .from(el, { scale: 0.25, autoAlpha: 0, duration: 0.35, ease: 'power1.out' }, at)
      .from(itemInners[i], { rotate: gsap.utils.random(-60, 60, 1), duration: 1, ease: 'power2.out' }, at)
  })
  tl.to('.bag-title', { autoAlpha: 0, y: -20, duration: 0.5 }, 2.5)
  tl.addLabel('bag', 3.3)

  // bag → brew
  tl.to(items, { y: () => -window.innerHeight * 0.6, autoAlpha: 0, stagger: 0.05, duration: 0.8, ease: 'power2.in' }, 3.6)
    .to(bagEl, { yPercent: 80, duration: 0.7, ease: 'power2.in' }, 3.65)
    .set(bag, { autoAlpha: 0 }, 4.7)
    .set(brew, { autoAlpha: 1 }, 4.2)
    .from($$('.char-outer', brew), { yPercent: 100, autoAlpha: 0, stagger: 0.03, duration: 0.6, ease: 'power3.out' }, 4.3)
    .from('.brew-cup', { yPercent: 90, rotate: -8, duration: 0.9, ease: 'power3.out' }, 4.5)
    .from('.brew-script', { autoAlpha: 0, x: -30, duration: 0.5, ease: 'power2.out' }, 4.9)
    .fromTo('.brew-arrow .draw', { strokeDasharray: 240, strokeDashoffset: 240 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.25, ease: 'power1.inOut' }, 5.0)
    .from('.brew-note', { autoAlpha: 0, y: 10, stagger: 0.08, duration: 0.4 }, 5.1)
    .fromTo('.receipt-paper', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power1.inOut' }, 4.5)
    .from('.receipt', { yPercent: -8, duration: 1.1, ease: 'power1.inOut' }, 4.5)
    .from($$('.r-row', brew), { autoAlpha: 0, x: 14, stagger: 0.06, duration: 0.35 }, 4.8)
  tl.addLabel('brew', 5.9)

  // brew → lens
  tl.to(['.brew-head', '.brew-script', '.brew-arrow', '.brew-notes', '.brew-cup'], { x: () => -window.innerWidth * 0.5, autoAlpha: 0, stagger: 0.04, duration: 0.8, ease: 'power2.in' }, 6.2)
    .to('.receipt', { x: () => window.innerWidth * 0.5, autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, 6.25)
    .set(brew, { autoAlpha: 0 }, 7.1)
    .set(lens, { autoAlpha: 1 }, 6.8)
    .from('.lens-title > *', { y: 50, autoAlpha: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out' }, 6.85)
    .from('.camera', { yPercent: 25, scale: 0.9, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 7.0)
    .from($$('.tool', lens), { scale: 0, autoAlpha: 0, stagger: 0.035, duration: 0.35, ease: 'back.out(2)' }, 7.5)
    .fromTo('.cam-glare', { xPercent: -100 }, { xPercent: 100, duration: 0.8, ease: 'power1.inOut' }, 7.9)
  tl.addLabel('lens', 8.4)

  // lens → board: the lens closes like an aperture onto the content board
  const iris = (r: string) => `circle(${r} at 50% 55%)`
  tl.set(lens, { backgroundColor: 'var(--color-cream)', clipPath: iris('80%') }, 8.6)
  setPalette(tl, 'board', 8.6, 0.01)
  tl.set(board, { autoAlpha: 1 }, 8.6)
    .to(lens, { clipPath: iris('0%'), duration: 1.2, ease: 'power1.inOut' }, 8.65)
    .to('.camera', { scale: 1.15, duration: 1.2, ease: 'power1.in' }, 8.65)
    .set(lens, { autoAlpha: 0 }, 9.86)
    .from($$('.bc', board), { y: 40, scale: 0.9, autoAlpha: 0, stagger: 0.03, duration: 0.6, ease: 'power3.out' }, 9.1)
  tl.addLabel('board', 10.4).to({}, { duration: 0.01 }, 10.4)

  // Dev-only: lets tooling seek scenes directly (e.g. __tl.seek('brew'))
  if (import.meta.env.DEV) Object.assign(window, { __tl: tl })

  // ── Section nav ──────────────────────────────────────────────────────
  const labels = ['hero', 'bag', 'brew', 'lens', 'board'] as const
  const links = $$<HTMLAnchorElement>('.scene-nav a')
  const labelProgress = (name: string) => tl.labels[name] / tl.duration()
  function updateNav(progress: number) {
    let active = 0
    labels.forEach((l, i) => {
      if (progress >= labelProgress(l) - 0.06) active = i
    })
    links.forEach((a, i) => {
      a.querySelector('.dot')!.classList.toggle('bg-white', i === active)
      if (i === active) a.setAttribute('aria-current', 'true')
      else a.removeAttribute('aria-current')
    })
  }
  updateNav(0)
  links.forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault()
      const st = tl.scrollTrigger!
      const target = st.start + (st.end - st.start) * labelProgress(a.dataset.scene!)
      lenis.scrollTo(target, { duration: 1.6 })
    }),
  )

  // ── Board: cards tilt toward the pointer ─────────────────────────────
  $$('.card', board).forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' })
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' })
    const z = gsap.quickTo(card, 'z', { duration: 0.5, ease: 'power3.out' })
    gsap.set(card, { transformPerspective: 700 })
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 14)
      rx(-((e.clientY - r.top) / r.height - 0.5) * 14)
      z(30)
    })
    card.addEventListener('pointerleave', () => {
      rx(0)
      ry(0)
      z(0)
    })
  })

  // Assets decode after first layout — re-measure once everything has loaded
  window.addEventListener('load', () => ScrollTrigger.refresh())
}
