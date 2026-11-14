import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Bubblegum Fizz: strawberry-milk paper by day, a berry soda glowing at night.
const { theme, problems } = makeColors({
  label: 'Bubblegum Fizz',
  roles: { accent: '#e0408a', danger: '#d1343f', success: '#3f9a6a', warning: '#c8841c', pro: '#8a5cd6' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f9e1ea',
        'surface-1': '#fcebf1',
        'surface-2': '#fff4f8',
        'text-primary': '#3a1a29',
        'text-secondary': '#5e3347',
        'text-muted': '#7a4a60',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#22101b',
        'surface-1': '#2b1522',
        'surface-2': '#341a29',
        'surface-3': '#3b1f2f',
        'text-primary': '#fbe9f1',
        'text-secondary': '#e5c6d4',
        'text-muted': '#c4a0b2',
      },
    },
  },
})

// Deterministic sprinkle of bubbles so the scene is the same every load.
let seed = 7
const rand = () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

const W = 1600
const H = 1000
const bubbles: string[] = []

for (let i = 0; i < 26; i++) {
  // Favour the left and right thirds so the words in the middle stay clear.
  const side = rand() < 0.5 ? rand() * 0.32 : 0.68 + rand() * 0.32
  const x = Math.round(side * W)
  const r = Math.round(10 + Math.pow(rand(), 2) * 62)
  const dur = (18 + rand() * 22).toFixed(1)
  const delay = (-rand() * 40).toFixed(1)
  const wob = (3 + rand() * 4).toFixed(1)
  const hue = Math.floor(rand() * 3)
  bubbles.push(
    `<g class="rise" style="animation-duration:${dur}s;animation-delay:${delay}s">` +
      `<g class="wob" style="animation-duration:${wob}s;animation-delay:${delay}s">` +
      `<circle cx="${x}" cy="${H + 80}" r="${r}" fill="url(#film${hue})" class="b"/>` +
      `<ellipse cx="${x - r * 0.38}" cy="${H + 80 - r * 0.42}" rx="${(r * 0.28).toFixed(1)}" ry="${(r * 0.16).toFixed(1)}" transform="rotate(-35 ${x - r * 0.38} ${H + 80 - r * 0.42})" class="shine"/>` +
      `<circle cx="${x + r * 0.42}" cy="${H + 80 + r * 0.4}" r="${Math.max(2, r * 0.07).toFixed(1)}" class="shine dot"/>` +
      `</g></g>`,
  )
}

// A few tiny fizz specks drifting faster.
for (let i = 0; i < 30; i++) {
  const x = Math.round(rand() * W)
  const r = (1.5 + rand() * 3).toFixed(1)
  const dur = (8 + rand() * 10).toFixed(1)
  const delay = (-rand() * 18).toFixed(1)
  bubbles.push(
    `<g class="rise" style="animation-duration:${dur}s;animation-delay:${delay}s"><circle cx="${x}" cy="${H + 20}" r="${r}" class="fizz"/></g>`,
  )
}

const film = (id: number, a: string, b: string, c: string) =>
  `<radialGradient id="film${id}" cx="40%" cy="35%" r="65%">` +
  `<stop offset="0%" stop-color="#ffffff" stop-opacity="0.05"/>` +
  `<stop offset="62%" stop-color="${a}" stop-opacity="0.10"/>` +
  `<stop offset="82%" stop-color="${b}" stop-opacity="0.38"/>` +
  `<stop offset="94%" stop-color="${c}" stop-opacity="0.65"/>` +
  `<stop offset="100%" stop-color="#ffffff" stop-opacity="0.85"/>` +
  `</radialGradient>`

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" class="s0"/><stop offset="55%" class="s1"/><stop offset="100%" class="s2"/>
</linearGradient>
<radialGradient id="glow" cx="85%" cy="12%" r="45%">
<stop offset="0%" class="g0"/><stop offset="100%" class="g0" stop-opacity="0"/>
</radialGradient>
<radialGradient id="glow2" cx="10%" cy="95%" r="50%">
<stop offset="0%" class="g1"/><stop offset="100%" class="g1" stop-opacity="0"/>
</radialGradient>
${film(0, '#ff8fc4', '#b58cff', '#7fe3ff')}
${film(1, '#ffc1dc', '#ff7fb2', '#ffd98a')}
${film(2, '#e0a8ff', '#7fd0ff', '#ff9ad0')}
</defs>
<style>
.s0{stop-color:#fde6ef}.s1{stop-color:#f9d6e5}.s2{stop-color:#f4c4da}
.g0{stop-color:#ffffff;stop-opacity:.7}.g1{stop-color:#ffb3d4;stop-opacity:.55}
.b{stroke:#ffffff;stroke-opacity:.55;stroke-width:1.2}
.shine{fill:#ffffff;opacity:.8}.dot{opacity:.6}
.fizz{fill:#ffffff;opacity:.7}
@media (prefers-color-scheme: dark){
.s0{stop-color:#1c0b16}.s1{stop-color:#260f1e}.s2{stop-color:#3a1630}
.g0{stop-color:#ff5fa8;stop-opacity:.22}.g1{stop-color:#9b5cff;stop-opacity:.2}
.b{stroke:#ffc4e0;stroke-opacity:.35}
.shine{fill:#ffe3f0;opacity:.55}.dot{opacity:.4}
.fizz{fill:#ff9cc9;opacity:.5}
}
.rise{animation-name:rise;animation-timing-function:linear;animation-iteration-count:infinite}
.wob{animation-name:wob;animation-timing-function:ease-in-out;animation-iteration-count:infinite;animation-direction:alternate}
@keyframes rise{from{transform:translateY(0)}to{transform:translateY(-${H + 240}px)}}
@keyframes wob{from{transform:translateX(-14px)}to{transform:translateX(14px)}}
@media (prefers-reduced-motion: reduce){.rise,.wob{animation:none}}
</style>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<rect width="${W}" height="${H}" fill="url(#glow2)"/>
${bubbles.join('\n')}
</svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'bubbles', glass: { blur: 18, opacity: 0.6 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Iridescent bubbles drifting up through a soft pink sky" isInteractive />
  })
}
