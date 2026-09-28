// All copy lives here — edit this file to make the portfolio yours.

export const profile = {
  name: 'Mark',
  role: 'Marketing & Brand Content',
  heroImage: '/assets/hero.webp',
  heroAlt: 'Portrait with both arms raised, holding up the headline',
}

export type BagItem = {
  id: string
  src: string
  alt: string
  note: string
  // final resting position, as % of the stage, plus rotation in degrees
  x: number
  y: number
  w: number
  rot: number
}

export const bagItems: BagItem[] = [
  { id: 'ereader', src: '/assets/ereader.webp', alt: 'E-reader', note: 'Always two chapters into something', x: 22, y: 50, w: 15, rot: -14 },
  { id: 'passport', src: '/assets/passport.webp', alt: 'Passport', note: 'Ready for the next brief abroad', x: 36, y: 24, w: 11, rot: -4 },
  { id: 'glasses', src: '/assets/glasses.webp', alt: 'Glasses', note: 'For the fine print in every contract', x: 52, y: 38, w: 12, rot: 28 },
  { id: 'phone', src: '/assets/phone.webp', alt: 'Phone with a colour-coded calendar', note: 'Colour-coded down to the minute', x: 69, y: 30, w: 8.5, rot: 12 },
  { id: 'earbuds', src: '/assets/earbuds.webp', alt: 'Earbuds case', note: 'Podcasts on marketing, mostly', x: 33, y: 72, w: 6.5, rot: -10 },
  { id: 'cookie', src: '/assets/cookie.webp', alt: 'Chocolate chip cookie', note: 'Non-negotiable', x: 61, y: 70, w: 9, rot: 8 },
]

export type Order = { place: string; role: string; line: string; qty: string }

export const career: Order[] = [
  { place: 'Northwind Studio', role: 'Branding Agency', line: '+900% social growth in 30 days', qty: '2025 — now' },
  { place: 'Harbor & Co.', role: 'Content Marketing', line: '22.4K views on a single video', qty: '2024' },
  { place: 'Maison Lumen', role: 'Hospitality', line: 'Guest experience, fine dining', qty: '2023' },
  { place: 'Atelier Verre', role: 'Retail', line: 'Top sale of the season: €1,000', qty: '2022' },
]

export const brewNotes = ['Marketing & Hospitality', 'Content, strategy & social', 'Brand identity & design']

export type Tool = { name: string; kind: 'word' | 'icon'; glyph?: string; font?: string }

export const tools: Tool[] = [
  { name: 'Canva', kind: 'word', font: 'font-script text-[1.25em]' },
  { name: 'CapCut', kind: 'word', font: 'font-display font-extrabold' },
  { name: 'Figma', kind: 'word', font: 'font-display font-bold' },
  { name: 'Instagram', kind: 'word', font: 'font-script text-[1.2em]' },
  { name: 'Notion', kind: 'word', font: 'font-display font-extrabold tracking-tight' },
  { name: 'Beacons', kind: 'word', font: 'font-display font-bold' },
  { name: 'TikTok', kind: 'icon', glyph: '♪' },
  { name: 'Facebook', kind: 'icon', glyph: 'f' },
  { name: 'BeReal', kind: 'icon', glyph: 'BR' },
  { name: 'LinkedIn', kind: 'icon', glyph: 'in' },
  { name: 'WhatsApp', kind: 'icon', glyph: 'W' },
  { name: 'Outlook', kind: 'icon', glyph: 'O' },
  { name: 'Zoom', kind: 'icon', glyph: 'zoom' },
  { name: 'Meet', kind: 'icon', glyph: '▶' },
]
