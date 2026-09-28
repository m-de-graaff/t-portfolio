import { profile, bagItems, career, brewNotes, tools } from './content.ts'

const chars = (text: string, cls = '') =>
  [...text]
    .map((c) =>
      c === ' '
        ? '<span class="inline-block w-[0.22em]"></span>'
        : `<span class="char-outer inline-block"><span class="char inline-block ${cls}">${c}</span></span>`,
    )
    .join('')

const hero = () => `
<section id="hero" class="scene bg-cocoa grain" aria-labelledby="hero-title">
  <h1 id="hero-title" class="sr-only">hi, I'm ${profile.name} — ${profile.role}</h1>
  <div class="hero-par absolute inset-x-0 top-[9svh] md:top-[6svh] flex justify-center" aria-hidden="true">
    <div class="hero-title headline text-milk text-center text-[25vw] md:text-[17.5vw] leading-[0.82]">
      <span class="whitespace-nowrap">${chars('hi I’m')}</span><br class="md:hidden" />
      <span class="hidden md:inline-block w-[0.22em]"></span><span class="whitespace-nowrap">${chars(profile.name)}</span>
    </div>
  </div>
  <div class="hero-person-wrap hero-par absolute left-1/2 bottom-0 -translate-x-1/2 z-10">
    <img class="hero-person block h-[62svh] md:h-[74svh] w-auto max-w-none drop" src="${profile.heroImage}" alt="${profile.heroAlt}" fetchpriority="high" />
  </div>
  <p class="hero-role absolute left-5 md:left-10 bottom-6 md:bottom-10 z-20 font-display font-bold text-milk/85 text-sm md:text-base tracking-tight">
    ${profile.role}
  </p>
  <p class="hero-hint absolute right-5 md:right-10 bottom-6 md:bottom-10 z-20 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-milk/70">
    Scroll <span class="relative block h-8 w-px overflow-hidden bg-milk/25"><span class="hint-dot absolute inset-x-0 top-0 h-3 bg-milk"></span></span>
  </p>
</section>`

const bag = () => `
<section id="bag" class="scene bg-cream" aria-labelledby="bag-title">
  <div class="bag-title absolute left-6 top-[12svh] md:left-auto md:right-[22vw] md:top-[22svh] z-20 md:text-right">
    <p class="font-script text-ink text-[13vw] md:text-[4.4vw] leading-[0.7] md:mr-[-1.5vw]" aria-hidden="true">Here’s</p>
    <h2 id="bag-title" class="headline text-ink text-[10vw] md:text-[3.4vw] leading-[0.95]">What’s in My Bag</h2>
  </div>
  <div class="bag-items absolute inset-0 z-10">
    ${bagItems
      .map(
        (it) => `
    <figure class="bag-item group absolute -translate-x-1/2 -translate-y-1/2 outline-none" tabindex="0"
      data-id="${it.id}" style="left:${it.x}%;top:${it.y}%;--w:${it.w}vw">
      <div class="item-inner w-[calc(var(--w)*2.1)] md:w-(--w)" style="rotate:${it.rot}deg">
        <img class="block w-full h-auto drop transition-transform duration-500 ease-out-expo group-hover:scale-110 group-focus-visible:scale-110" src="${it.src}" alt="${it.alt}" loading="lazy" />
      </div>
      <figcaption class="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1 font-sans text-[11px] md:text-xs text-milk opacity-0 translate-y-1 transition duration-300 ease-out-expo group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">${it.note}</figcaption>
    </figure>`,
      )
      .join('')}
  </div>
  <img class="the-bag absolute left-1/2 bottom-[-3svh] z-20 -translate-x-1/2 w-[62vw] md:w-[23vw] drop" src="/assets/bag.webp" alt="Cognac leather tote bag" />
</section>`

const receiptRow = (o: (typeof career)[number]) => `
  <li class="r-row grid grid-cols-[1fr_auto] gap-x-4 border-b border-dashed border-ink/20 py-[0.9em]">
    <span><strong class="font-display font-bold text-[1.08em] tracking-tight">${o.place}</strong> <span class="text-ink/60">— ${o.role}</span></span>
    <span class="font-mono text-[0.85em] text-ink/60 text-right">${o.qty}</span>
    <em class="col-span-2 font-sans not-italic text-ink/75">${o.line}</em>
  </li>`

const brew = () => `
<section id="brew" class="scene bg-cream" aria-labelledby="brew-title">
  <h2 id="brew-title" class="brew-head headline text-ink absolute left-6 md:left-[5vw] top-[8svh] md:top-[9svh] text-[14vw] md:text-[5.6vw] leading-[0.9]">
    ${chars('My Career')}
  </h2>
  <p class="brew-script absolute hidden md:block left-[17vw] top-[33svh] font-script text-ink text-[14vw] md:text-[5.2vw]" aria-hidden="true">Brew</p>
  <svg class="brew-arrow absolute hidden md:block left-[24vw] top-[28svh] w-[12vw] h-auto text-ink" viewBox="0 0 160 110" fill="none" aria-hidden="true">
    <path class="draw" d="M8 70 C 50 5, 120 10, 148 92" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    <path class="draw" d="M134 84 L148 94 L152 76" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <img class="brew-cup absolute z-20 right-[3vw] md:right-auto md:left-[30vw] bottom-[1svh] md:bottom-[3svh] w-[30vw] md:w-[19vw] drop" src="/assets/coffee.webp" alt="Iced latte" />
  <ul class="brew-notes absolute hidden md:block left-[5vw] bottom-[9svh] space-y-1 font-sans text-[0.95vw] text-ink/70">
    ${brewNotes.map((n) => `<li class="brew-note flex items-center gap-2"><span class="size-1.5 rounded-full bg-latte"></span>${n}</li>`).join('')}
  </ul>
  <div class="receipt absolute left-5 right-[14vw] top-[20svh] md:left-auto md:right-[6vw] md:top-[7svh] md:w-[34vw] text-ink text-[3vw] md:text-[0.95vw]">
    <div class="receipt-paper receipt-edge bg-milk px-[1.6em] pt-[1.6em] pb-[2.4em] shadow-[0_30px_60px_-25px_rgb(46_26_18/0.35)]">
      <div class="flex items-baseline justify-between">
        <h3 class="headline text-[2.4em] leading-none">Order Details</h3>
        <span class="font-mono text-[0.85em] text-ink/50">#0${career.length}</span>
      </div>
      <p class="mt-1 font-script text-[1.6em] text-ink/70">a quick look at my professional path</p>
      <ul class="mt-3">${career.map(receiptRow).join('')}</ul>
      <div class="r-row mt-4 flex justify-between font-mono text-[0.9em]"><span>Total experience</span><span>${career.length} roles</span></div>
      <div class="r-row mt-1 flex justify-between font-mono text-[0.9em] text-ink/60"><span>Served</span><span>with extra foam</span></div>
      <div class="r-row mt-5 flex flex-col items-end gap-1">
        <div class="h-[3.2em] w-[62%] bg-[repeating-linear-gradient(90deg,var(--color-ink)_0_2px,transparent_2px_4px,var(--color-ink)_4px_5px,transparent_5px_8px,var(--color-ink)_8px_11px,transparent_11px_12px)]" aria-hidden="true"></div>
        <span class="font-mono text-[0.75em] tracking-[0.3em] text-ink/60">4 0 2 2 0 2 5 1</span>
      </div>
    </div>
  </div>
</section>`

const toolCell = (t: (typeof tools)[number]) =>
  t.kind === 'word'
    ? `<li class="tool flex items-center justify-center text-ink ${t.font} text-[3.9cqw] leading-none whitespace-nowrap">${t.name}</li>`
    : `<li class="tool flex flex-col items-center gap-[0.6cqw]"><span class="grid place-items-center size-[7.4cqw] rounded-[1.8cqw] bg-ink text-milk font-display font-bold text-[2.6cqw] leading-none">${t.glyph}</span><span class="sr-only">${t.name}</span></li>`

const lens = () => {
  const words = tools.filter((t) => t.kind === 'word')
  const icons = tools.filter((t) => t.kind === 'icon')
  return `
<section id="lens" class="scene bg-cream" aria-labelledby="lens-title">
  <div class="lens-title absolute inset-x-0 top-[12svh] md:top-[10svh] text-center">
    <h2 id="lens-title" class="headline text-ink text-[12vw] md:text-[5.4vw]">Through my lens</h2>
    <p class="font-script text-ink/85 text-[9vw] md:text-[3.2vw] leading-[0.8] ml-[20vw] md:ml-[12vw]">The tools I master</p>
  </div>
  <div class="camera @container absolute left-1/2 top-[38svh] md:top-[33svh] -translate-x-1/2 w-[92vw] md:w-[44vw]">
    <img class="block w-full h-auto drop" src="/assets/camera.webp" alt="Silver digital camera" />
    <div class="cam-screen absolute left-[8.6%] top-[22.3%] w-[54.2%] h-[66.5%] rounded-[1cqw] bg-[#f4f2ee] shadow-[inset_0_0_2.5cqw_rgb(0_0_0/0.35)] overflow-hidden px-[3cqw] py-[2.6cqw] flex flex-col justify-between">
      <ul class="grid grid-cols-3 gap-y-[1.6cqw]" aria-label="Tools">${words.map(toolCell).join('')}</ul>
      <ul class="grid grid-cols-4 gap-y-[1.8cqw] justify-items-center" aria-label="Apps">${icons.map(toolCell).join('')}</ul>
      <span class="cam-glare pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.55)_48%,transparent_60%)]"></span>
    </div>
  </div>
</section>`
}

const label = (t: string) => `<h3 class="font-display font-bold tracking-tight text-milk/90 text-[3.6vw] md:text-[0.95vw] mb-[0.6em]">${t}</h3>`

const board = () => `
<section id="board" class="scene bg-cocoa text-milk" aria-labelledby="board-title" data-lenis-prevent>
  <div class="board-inner mx-auto grid h-full max-w-[1800px] grid-cols-2 gap-x-4 gap-y-7 px-5 py-10 md:grid-cols-[1fr_2.05fr_1fr] md:gap-x-[2.4vw] md:gap-y-0 md:px-[3vw] md:py-[4svh]">

    <div class="order-1 col-span-2 text-center md:order-2 md:col-span-1 md:row-start-1 md:col-start-2">
      <h2 id="board-title" class="bc headline text-milk text-[15vw] md:text-[4.6vw]">My content</h2>
      <p class="bc font-script text-milk text-[11vw] md:text-[3.4vw] leading-[0.6] ml-[18vw] md:ml-[9vw]" aria-hidden="true">&amp;expertise</p>
    </div>

    <!-- left column -->
    <div class="order-2 col-span-2 md:order-1 md:col-span-1 md:row-span-2 md:row-start-1 flex flex-col gap-7 md:gap-[3.2svh]">
      <div>
        ${label('Carousels')}
        <div class="flex gap-3 md:gap-[0.8vw]">
          <article class="bc card aspect-[4/5] w-1/2 md:w-auto md:h-[21svh] bg-violet p-[0.9em] text-[3.6vw] md:text-[1.05vw] font-display font-black leading-[0.95] tracking-tight">3 Branding <span class="text-[#8f7bff]">Mistakes</span> That Kill Sales</article>
          <article class="bc card aspect-[4/5] w-1/2 md:w-auto md:h-[21svh] bg-milk p-[0.9em] text-[3.2vw] md:text-[0.95vw] font-display font-black leading-[0.95] tracking-tight text-violet flex items-center">BEST CONTENT FORMULA</article>
        </div>
      </div>
      <div>
        ${label('Designs for clients')}
        <div class="bc card flex gap-[0.4em] bg-milk p-[0.5em] text-[2.4vw] md:text-[0.62vw] text-ink">
          ${['Bronze', 'Silver', 'Gold']
            .map(
              (t, i) => `<div class="flex-1 rounded-[0.4em] border border-ink/15 bg-white p-[0.5em]">
              <p class="rounded-[0.3em] bg-ink py-[0.2em] text-center font-display font-bold uppercase tracking-wider text-milk">${t}</p>
              <p class="mt-[0.5em] font-display font-black text-[1.6em] leading-none">€${(i + 1) * 290}</p>
              <ul class="mt-[0.4em] space-y-[0.3em] text-ink/70">${['Strategy', 'Content', i ? 'Ads' : 'Audit', i > 1 ? 'Shoots' : 'Report'].map((l) => `<li>✓ ${l}</li>`).join('')}</ul>
            </div>`,
            )
            .join('')}
        </div>
      </div>
      <div>
        ${label('My TikTok account')}
        <div class="bc card flex justify-around rounded-full bg-milk px-[1.2em] py-[0.7em] text-ink text-[3.2vw] md:text-[0.8vw]">
          ${[['707', 'Following'], ['105.4K', 'Followers'], ['3.4M', 'Likes']]
            .map(([n, l]) => `<div class="text-center"><p class="font-display font-black text-[1.35em] leading-none">${n}</p><p class="text-ink/55 text-[0.85em]">${l}</p></div>`)
            .join('')}
        </div>
      </div>
    </div>

    <!-- middle column -->
    <div class="order-3 col-span-2 md:col-span-1 md:col-start-2 md:row-start-2 flex flex-col gap-7 md:gap-[3svh] md:pt-[2svh]">
      <div class="grid grid-cols-[1.4fr_1fr] gap-4 md:flex md:gap-[1.6vw]">
        <div>
          ${label('LinkedIn banners')}
          <div class="flex flex-col gap-[0.9vw]">
            <div class="bc card aspect-[4/1] md:h-[9svh] overflow-hidden bg-[linear-gradient(100deg,#7fd1e3,#e9f2ff_55%,#c9d6ff)] p-[0.6em] text-ink text-[2vw] md:text-[0.55vw] font-display font-bold flex items-center justify-between"><span class="rounded bg-ink px-[0.6em] py-[0.25em] text-milk">Branding · Content · Social</span><span class="font-script text-[2.4em] font-normal">${profile.name}</span></div>
            <div class="bc card aspect-[4/1] md:h-[9svh] overflow-hidden bg-milk p-[0.6em] text-ink text-[2vw] md:text-[0.55vw] flex flex-col justify-center"><span class="font-display font-black text-[1.6em] leading-none">Helping brands brew better stories</span><span class="mt-[0.3em] text-ink/60">Strategy · Design · Growth</span></div>
          </div>
        </div>
        <div>
          ${label('Business cards')}
          <div class="flex flex-col gap-[0.9vw]">
            <div class="bc card aspect-[1.75] md:h-[11svh] grid place-items-center bg-[linear-gradient(135deg,#b59a6a,#8e7547)] text-[#fbf3df] text-[2.4vw] md:text-[0.62vw]"><span class="font-display font-black tracking-[0.3em] uppercase text-[1.6em]">${profile.name}</span></div>
            <div class="bc card aspect-[1.75] md:h-[11svh] flex items-center gap-[0.6em] bg-milk p-[0.6em] text-ink text-[2vw] md:text-[0.5vw]"><span class="size-[4.2em] shrink-0 bg-[conic-gradient(var(--color-ink)_25%,transparent_0_50%,var(--color-ink)_0_75%,transparent_0)] bg-[length:0.6em_0.6em]" aria-hidden="true"></span><span><b class="font-display text-[1.3em]">${profile.name}</b><br/>hello@example.com</span></div>
          </div>
        </div>
      </div>
      <div>
        ${label('School projects')}
        <div class="grid grid-cols-3 gap-3 md:flex md:gap-[1vw] text-[2.4vw] md:text-[0.6vw]">
          <article class="bc card aspect-[3/4] md:h-[26svh] bg-[#8fd6cf] p-[0.8em] text-ink"><p class="font-script text-[2.6em] leading-none">Tiffany &amp; Co</p><p class="mt-[0.6em] font-display font-bold uppercase tracking-widest text-[0.9em]">Campaign study</p><div class="mt-[0.8em] h-[45%] rounded bg-white/60"></div></article>
          <article class="bc card aspect-[3/4] md:h-[26svh] bg-milk p-[0.8em] text-ink"><p class="font-display font-black text-[1.6em] leading-none">Social audit</p><div class="mt-[0.8em] space-y-[0.5em]">${[80, 55, 70, 40].map((w) => `<div class="h-[0.9em] rounded-full bg-[#9ad49a]" style="width:${w}%"></div>`).join('')}</div></article>
          <article class="bc card aspect-[3/4] md:h-[26svh] overflow-hidden bg-[#1b1b1b] p-[0.8em] text-[#ffd400]"><p class="font-display font-black italic uppercase text-[2em] leading-[0.9]">Charity Race</p><div class="mt-[0.6em] h-[50%] rounded bg-[radial-gradient(circle_at_40%_60%,#d7261e,#5b0b08_70%)]"></div></article>
        </div>
      </div>
    </div>

    <!-- right column -->
    <div class="order-4 col-span-2 md:col-span-1 md:col-start-3 md:row-span-2 md:row-start-1 grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-[3.2svh]">
      <div>
        ${label('My online shop')}
        <div class="bc card mx-auto md:mx-0 aspect-[9/17] w-full md:w-auto md:h-[44svh] rounded-[1.4em] border-[0.35em] border-ink bg-milk p-[0.6em] text-ink text-[2.4vw] md:text-[0.55vw]">
          <div class="mx-auto mb-[0.8em] h-[0.8em] w-[35%] rounded-full bg-ink"></div>
          <p class="text-center font-display font-black text-[1.4em]">${profile.name}’s shop</p>
          <div class="mt-[0.8em] grid grid-cols-2 gap-[0.5em]">${['Canva kit', 'Presets', 'Guide', '1:1 call'].map((p) => `<div class="rounded-[0.5em] bg-cream p-[0.5em]"><div class="aspect-square rounded-[0.4em] bg-latte/60"></div><p class="mt-[0.3em] font-semibold">${p}</p></div>`).join('')}</div>
        </div>
      </div>
      <div>
        ${label('Flyers for events')}
        <div class="grid grid-cols-2 gap-3 md:flex md:gap-[0.8vw] text-[2.4vw] md:text-[0.55vw]">
          <article class="bc card aspect-[9/14] md:h-[27svh] overflow-hidden bg-[linear-gradient(180deg,#3a2a14,#0f0b06)] p-[0.8em] text-[#f1c86b]"><p class="font-display font-black uppercase text-[1.9em] leading-[0.9]">Rose Soirée</p><div class="mx-auto mt-[0.8em] size-[5em] rounded-full bg-[radial-gradient(circle,#f1c86b,#7a4f14)]"></div><p class="mt-[0.8em] text-center tracking-[0.2em] uppercase">Sat · 21:00</p></article>
          <article class="bc card aspect-[9/14] md:h-[27svh] overflow-hidden bg-[linear-gradient(180deg,#0f1c2e,#060a12)] p-[0.8em] text-[#e9e3d4]"><p class="font-script text-[2.6em] leading-none">Gala Night</p><div class="mt-[0.8em] space-y-[0.4em]">${[1, 2, 3].map(() => `<div class="h-[0.5em] rounded-full bg-[#e9e3d4]/30"></div>`).join('')}</div><p class="mt-[1em] font-display font-bold uppercase tracking-widest text-[#f1c86b]">Tickets →</p></article>
        </div>
      </div>
    </div>
  </div>
</section>`

const nav = () => `
<nav class="scene-nav fixed right-4 md:right-7 top-1/2 z-50 -translate-y-1/2 mix-blend-difference" aria-label="Sections">
  <ol class="flex flex-col gap-3">
    ${[
      ['hero', 'Hello'],
      ['bag', 'In my bag'],
      ['brew', 'Career'],
      ['lens', 'Tools'],
      ['board', 'Work'],
    ]
      .map(
        ([id, t]) =>
          `<li><a href="#${id}" data-scene="${id}" class="group flex items-center justify-end gap-3 text-white"><span class="font-mono text-[10px] uppercase tracking-[0.2em] opacity-0 -translate-x-1 transition duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100">${t}</span><span class="dot block size-2 rounded-full border border-white transition-colors duration-300"></span></a></li>`,
      )
      .join('')}
  </ol>
</nav>`

export const render = () => `
<main>
  <div class="stage relative">
    <canvas class="webgl pointer-events-none absolute inset-0 invisible opacity-0 size-full" aria-hidden="true"></canvas>
    ${hero()}
    ${bag()}
    ${brew()}
    ${lens()}
    ${board()}
  </div>
</main>
${nav()}`
