# thinking-orbs-colorized

[![npm version](https://img.shields.io/npm/v/thinking-orbs-colorized?style=flat-square)](https://www.npmjs.com/package/thinking-orbs-colorized)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

Dotted thought-orb loading indicators for AI & agent UIs. Six hand-tuned animated states at two purpose-tuned sizes, auto dark/light, **22 curated color palettes** — rendered on a plain 2D canvas, no WebGL, no filters, identical in Chrome, Safari and Firefox.

> **A colorized fork of [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) by Jakub Antalik** — the original dotted thought-orb library this project builds upon. All engine credit goes to the original work; this fork adds color palettes, a product site, and bilingual docs on top of it.

[Live demo](https://bardolog1.github.io/thinking-orbs-colorized/) · [Repository](https://github.com/Bardolog1/thinking-orbs-colorized) · [Report an issue](https://github.com/Bardolog1/thinking-orbs-colorized/issues) · [Español](README.es.md)

![Thinking orbs hero — states and palettes preview](assets/readme/hero.png)

## Features

- **Six states** — `working`, `searching`, `solving`, `listening`, `composing`, `shaping`; each a distinct, hand-tuned animation.
- **Two tuned sizes** — `64` for chat-avatar scale, `20` for inline text. Separate designs, not a scale factor.
- **Auto dark/light** — resolves from your project's theme (Tailwind/shadcn `dark` class or `data-theme`) or the OS, live-updating.
- **22 curated palettes** — or pass any CSS color and get derived ramps; register your own with `registerPalette`.
- **Accessible** — `role="img"` with per-state `aria-label`, `prefers-reduced-motion` support.
- **Performant** — pauses offscreen & in hidden tabs, shares one clock, DPR capped at 2, zero dependencies.
- **SSR-safe** — the canvas only paints on the client.

## Install

```bash
npm install thinking-orbs-colorized
```

## Quick start

```tsx
import { ThinkingOrb } from 'thinking-orbs-colorized';

function Status() {
  return <ThinkingOrb state="searching" size={64} palette="ocean" />;
}
```

## States

Six verbs an agent can be doing, each a distinct animation:

```tsx
<ThinkingOrb state="working" />    {/* particles on tilted orbits */}
<ThinkingOrb state="searching" />  {/* a scan meridian sweeps a dotted globe */}
<ThinkingOrb state="solving" />    {/* bands scramble, then click back solved */}
<ThinkingOrb state="listening" />  {/* a waveform rolls through the rings */}
<ThinkingOrb state="composing" />  {/* an undulating multi-band sash */}
<ThinkingOrb state="shaping" />    {/* dotted outline: circle → triangle → square */}
```

## Sizes

Two tuned presets — separate designs, not a scale factor. `64` for chat-avatar scale, `20` for inline-text scale. Each carries its own dot count, dot size and speed tuning:

```tsx
<ThinkingOrb state="working" size={64} />
<ThinkingOrb state="working" size={20} />
```

## Theme

`auto` (default) picks the mode from the host project and updates live — dark renders light ink (for dark backgrounds), light renders dark ink:

```tsx
<ThinkingOrb theme="auto" />   {/* default — detects from the project */}
<ThinkingOrb theme="dark" />   {/* pin: light dots for dark backgrounds */}
<ThinkingOrb theme="light" />  {/* pin: dark dots for light backgrounds */}
```

`auto` resolves in three layers:

1. an ancestor `data-theme="dark|light"` attribute or `dark`/`light` class (the Tailwind / shadcn convention), watched via `MutationObserver`;
2. otherwise `prefers-color-scheme`, subscribed for live OS theme switches;
3. SSR-safe — the canvas paints only on the client, after the theme has resolved.

## Colors & palettes

Omit `palette` for the classic monochrome orb. Pass any of the 22 curated palette ids, a CSS-color shorthand (dual light/dark ramps are auto-derived), or an inline palette object:

```tsx
<ThinkingOrb palette="ember" />
<ThinkingOrb palette="#0ea5e9" />                     {/* shorthand → derived ramps */}
<ThinkingOrb palette={{ id: 'brand', light: { ink: '#7c3aed', fade: '#ede9fe' }, dark: { ink: '#c4b5fd', fade: '#1e1b4b' } }} />
```

![Palette gallery — all 22 curated palettes, light and dark](assets/readme/palette-gallery.png)

### The 22 curated palettes

Every palette is a same-hue **ink → fade** ramp per theme: light substrate gets dark ink on a pale fade, dark substrate gets light ink on a deep fade. Palettes marked **Accents** also paint `active`/`particle` (and sometimes `band`/`outline`) dots at a second hue — the fade stop always stays the base ramp's. Full accent values live in [`src/palette-data.ts`](src/palette-data.ts).

| Palette | id | Light (ink · fade) | Dark (ink · fade) | Accents |
| --- | --- | --- | --- | --- |
| Mono | `mono` | ![#000000](https://img.shields.io/badge/%23000000-000000?style=flat-square) ![#ffffff](https://img.shields.io/badge/%23ffffff-ffffff?style=flat-square) | ![#ffffff](https://img.shields.io/badge/%23ffffff-ffffff?style=flat-square) ![#000000](https://img.shields.io/badge/%23000000-000000?style=flat-square) | — |
| Graphite | `graphite` | ![#454a54](https://img.shields.io/badge/%23454a54-454a54?style=flat-square) ![#eaeaeb](https://img.shields.io/badge/%23eaeaeb-eaeaeb?style=flat-square) | ![#afb5c0](https://img.shields.io/badge/%23afb5c0-afb5c0?style=flat-square) ![#1f2023](https://img.shields.io/badge/%231f2023-1f2023?style=flat-square) | — |
| Slate | `slate` | ![#385275](https://img.shields.io/badge/%23385275-385275?style=flat-square) ![#e8eaee](https://img.shields.io/badge/%23e8eaee-e8eaee?style=flat-square) | ![#97b2d8](https://img.shields.io/badge/%2397b2d8-97b2d8?style=flat-square) ![#1a2028](https://img.shields.io/badge/%231a2028-1a2028?style=flat-square) | — |
| Paper | `paper` | ![#725b3b](https://img.shields.io/badge/%23725b3b-725b3b?style=flat-square) ![#f6f5f4](https://img.shields.io/badge/%23f6f5f4-f6f5f4?style=flat-square) | ![#ebe2d6](https://img.shields.io/badge/%23ebe2d6-ebe2d6?style=flat-square) ![#2d251b](https://img.shields.io/badge/%232d251b-2d251b?style=flat-square) | — |
| Ember | `ember` | ![#8b3d23](https://img.shields.io/badge/%238b3d23-8b3d23?style=flat-square) ![#f0e8e6](https://img.shields.io/badge/%23f0e8e6-f0e8e6?style=flat-square) | ![#f4997b](https://img.shields.io/badge/%23f4997b-f4997b?style=flat-square) ![#2e1b14](https://img.shields.io/badge/%232e1b14-2e1b14?style=flat-square) | ✓ |
| Sunset | `sunset` | ![#8b5323](https://img.shields.io/badge/%238b5323-8b5323?style=flat-square) ![#f0eae6](https://img.shields.io/badge/%23f0eae6-f0eae6?style=flat-square) | ![#f4b47b](https://img.shields.io/badge/%23f4b47b-f4b47b?style=flat-square) ![#2e2014](https://img.shields.io/badge/%232e2014-2e2014?style=flat-square) | ✓ |
| Aurora | `aurora` | ![#238b68](https://img.shields.io/badge/%23238b68-238b68?style=flat-square) ![#e6f0ec](https://img.shields.io/badge/%23e6f0ec-e6f0ec?style=flat-square) | ![#7bf4cc](https://img.shields.io/badge/%237bf4cc-7bf4cc?style=flat-square) ![#142e26](https://img.shields.io/badge/%23142e26-142e26?style=flat-square) | ✓ |
| Ocean | `ocean` | ![#23578b](https://img.shields.io/badge/%2323578b-23578b?style=flat-square) ![#e6ebf0](https://img.shields.io/badge/%23e6ebf0-e6ebf0?style=flat-square) | ![#7bb8f4](https://img.shields.io/badge/%237bb8f4-7bb8f4?style=flat-square) ![#14212e](https://img.shields.io/badge/%2314212e-14212e?style=flat-square) | ✓ |
| Arctic | `arctic` | ![#297ea3](https://img.shields.io/badge/%23297ea3-297ea3?style=flat-square) ![#e6edf0](https://img.shields.io/badge/%23e6edf0-e6edf0?style=flat-square) | ![#7bd0f4](https://img.shields.io/badge/%237bd0f4-7bd0f4?style=flat-square) ![#14262e](https://img.shields.io/badge/%2314262e-14262e?style=flat-square) | ✓ |
| Nebula | `nebula` | ![#49238b](https://img.shields.io/badge/%2349238b-49238b?style=flat-square) ![#e9e6f0](https://img.shields.io/badge/%23e9e6f0-e9e6f0?style=flat-square) | ![#a77bf4](https://img.shields.io/badge/%23a77bf4-a77bf4?style=flat-square) ![#1e142e](https://img.shields.io/badge/%231e142e-1e142e?style=flat-square) | ✓ |
| AI Gradient | `ai-gradient` | ![#53238b](https://img.shields.io/badge/%2353238b-53238b?style=flat-square) ![#eae6f0](https://img.shields.io/badge/%23eae6f0-eae6f0?style=flat-square) | ![#b47bf4](https://img.shields.io/badge/%23b47bf4-b47bf4?style=flat-square) ![#20142e](https://img.shields.io/badge/%2320142e-20142e?style=flat-square) | ✓ |
| Mint | `mint` | ![#238b5a](https://img.shields.io/badge/%23238b5a-238b5a?style=flat-square) ![#e6f0eb](https://img.shields.io/badge/%23e6f0eb-e6f0eb?style=flat-square) | ![#7bf4bc](https://img.shields.io/badge/%237bf4bc-7bf4bc?style=flat-square) ![#142e22](https://img.shields.io/badge/%23142e22-142e22?style=flat-square) | ✓ |
| Synthwave | `synthwave` | ![#8b2376](https://img.shields.io/badge/%238b2376-8b2376?style=flat-square) ![#f0e6ee](https://img.shields.io/badge/%23f0e6ee-f0e6ee?style=flat-square) | ![#f47bdc](https://img.shields.io/badge/%23f47bdc-f47bdc?style=flat-square) ![#2e1429](https://img.shields.io/badge/%232e1429-2e1429?style=flat-square) | ✓ |
| Cyberpunk | `cyberpunk` | ![#8b238b](https://img.shields.io/badge/%238b238b-8b238b?style=flat-square) ![#f0e6f0](https://img.shields.io/badge/%23f0e6f0-f0e6f0?style=flat-square) | ![#f47bf4](https://img.shields.io/badge/%23f47bf4-f47bf4?style=flat-square) ![#2e142e](https://img.shields.io/badge/%232e142e-2e142e?style=flat-square) | ✓ |
| Matrix | `matrix` | ![#238b23](https://img.shields.io/badge/%23238b23-238b23?style=flat-square) ![#e6f0e6](https://img.shields.io/badge/%23e6f0e6-e6f0e6?style=flat-square) | ![#7bf47b](https://img.shields.io/badge/%237bf47b-7bf47b?style=flat-square) ![#142e14](https://img.shields.io/badge/%23142e14-142e14?style=flat-square) | ✓ |
| Macaron | `macaron` | ![#7b324b](https://img.shields.io/badge/%237b324b-7b324b?style=flat-square) ![#f5f0f1](https://img.shields.io/badge/%23f5f0f1-f5f0f1?style=flat-square) | ![#df90ab](https://img.shields.io/badge/%23df90ab-df90ab?style=flat-square) ![#2a181e](https://img.shields.io/badge/%232a181e-2a181e?style=flat-square) | ✓ |
| Fog | `fog` | ![#546978](https://img.shields.io/badge/%23546978-546978?style=flat-square) ![#eef0f1](https://img.shields.io/badge/%23eef0f1-eef0f1?style=flat-square) | ![#a8bac7](https://img.shields.io/badge/%23a8bac7-a8bac7?style=flat-square) ![#242a2e](https://img.shields.io/badge/%23242a2e-242a2e?style=flat-square) | ✓ |
| Forest | `forest` | ![#238b3d](https://img.shields.io/badge/%23238b3d-238b3d?style=flat-square) ![#e6f0e8](https://img.shields.io/badge/%23e6f0e8-e6f0e8?style=flat-square) | ![#7bf499](https://img.shields.io/badge/%237bf499-7bf499?style=flat-square) ![#142e1b](https://img.shields.io/badge/%23142e1b-142e1b?style=flat-square) | ✓ |
| Moss | `moss` | ![#5f8b23](https://img.shields.io/badge/%235f8b23-5f8b23?style=flat-square) ![#ebf0e6](https://img.shields.io/badge/%23ebf0e6-ebf0e6?style=flat-square) | ![#c2f47b](https://img.shields.io/badge/%23c2f47b-c2f47b?style=flat-square) ![#232e14](https://img.shields.io/badge/%23232e14-232e14?style=flat-square) | ✓ |
| Desert | `desert` | ![#8b6523](https://img.shields.io/badge/%238b6523-8b6523?style=flat-square) ![#f0ece6](https://img.shields.io/badge/%23f0ece6-f0ece6?style=flat-square) | ![#f4c87b](https://img.shields.io/badge/%23f4c87b-f4c87b?style=flat-square) ![#2e2514](https://img.shields.io/badge/%232e2514-2e2514?style=flat-square) | ✓ |
| Holiday | `holiday` | ![#8b2331](https://img.shields.io/badge/%238b2331-8b2331?style=flat-square) ![#f0e6e7](https://img.shields.io/badge/%23f0e6e7-f0e6e7?style=flat-square) | ![#f47b8b](https://img.shields.io/badge/%23f47b8b-f47b8b?style=flat-square) ![#2e1417](https://img.shields.io/badge/%232e1417-2e1417?style=flat-square) | ✓ |
| Midnight | `midnight` | ![#23238b](https://img.shields.io/badge/%2323238b-23238b?style=flat-square) ![#e6e6f0](https://img.shields.io/badge/%23e6e6f0-e6e6f0?style=flat-square) | ![#9797f7](https://img.shields.io/badge/%239797f7-9797f7?style=flat-square) ![#14142e](https://img.shields.io/badge/%2314142e-14142e?style=flat-square) | ✓ |

### Per-role `colors` overlay

Override individual dot roles — wins over `palette` accents for the listed roles, and the depth (fade) stop stays the base ramp's:

```tsx
<ThinkingOrb palette="ocean" colors={{ active: '#ef4444', particle: '#f59e0b' }} />
```

Roles: `ghost`, `particle`, `field`, `active`, `band`, `outline`.

### Custom palettes with `registerPalette`

```ts
import { registerPalette } from 'thinking-orbs-colorized';

registerPalette({
  id: 'brand',
  name: 'Brand',
  light: { ink: '#7c3aed', fade: '#ede9fe' },
  dark: { ink: '#c4b5fd', fade: '#1e1b4b' }
});
// now usable: <ThinkingOrb palette="brand" />
```

Invalid palettes are rejected with a dev-only warning; `mono` is reserved and cannot be overridden. Unknown ids and unresolvable colors always fall back to `mono` with a dev warning — resolution never throws. See `docs/COLOR_PALETTEGuide.md` for the full API.

![Custom palettes — register, inline object, CSS shorthand, colors overlay](assets/readme/custom-palettes.png)

## Props

```tsx
<ThinkingOrb
  state="solving"       // 'working' | 'searching' | 'solving' | 'listening' | 'composing' | 'shaping'
  size={64}             // 64 | 20
  theme="auto"          // 'auto' | 'dark' | 'light'
  speed={1.5}           // multiplier on the preset's baked speed
  paused={false}        // freeze on the current frame
  palette="ocean"       // palette id, CSS color shorthand, or OrbPalette object
  colors={{ active: '#ef4444' }}  // per-role ink overlay
  aria-label="Analysing repository…"  // overrides the per-state default
/>
```

All other `<canvas>` props (`className`, `style`, `data-*`, …) pass through.

## Local Storybook

Explore every state, size, palette and control:

```bash
npm run storybook
```

Runs on `http://localhost:6006` — gallery, theme and Playground stories with live controls.

## Accessibility & performance

- `role="img"` with a sensible per-state `aria-label` out of the box.
- `prefers-reduced-motion: reduce` renders a static representative frame — no animation — and still follows the live theme.
- Every instance pauses automatically when scrolled offscreen (`IntersectionObserver`) or when the tab is hidden, and resumes in phase — all instances share one clock.
- Plain 2D canvas arcs only: no `ctx.filter`, no SVG filters, no WebGL — the same pixels everywhere, cheap on low-end devices. Device-pixel-ratio capped at 2.
- Palette resolution happens once per mount and degrades gracefully; the monochrome default keeps its byte-identical fast path.

## Author

Made by **Libardo Lozano** ([@Bardolog_1](https://x.com/Bardolog_1)) — a colorized fork of [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) by Jakub Antalik & Alex Brinza.

## License

MIT © Jakub Antalik — the original author and the work this fork is based on.

Copyright (c) 2026 Libardo Lozano (Bardolog1) — modifications, color palettes, site and docs.
