# Design: Orb Color Palettes

## Technical Approach

Ship a palette data + resolution module (`src/palettes.ts`, data in `src/palette-data.ts`) exposing 22 curated `OrbPalette`s, `registerPalette`, and CSS-color shorthand with auto-derived dual light/dark ramps. Thread colors through the engine **non-breakingly**: optional trailing `colors?` on `ModeDraw`/`paint`, optional `Dot.role?`, per-role ink-stop accents over a depth-preserving `lerp(ink, fade, w)`. Resolution happens **once per mount** in `ThinkingOrb` (useMemo keyed on palette/colors/dark) into numeric RGB ramps. When colors are absent the mono path reproduces current output byte-identically. Alongside: local Storybook, product site `site/` (Playground migrated), bilingual README, package rename to `thinking-orbs-colorized@0.2.0`.

## CRITICAL — Verified Role→Mode Mapping (overrides spec)

The spec's "Dot role tagging" requirement (`lattice→ghost|active`, `orbits→particle|field`, `ribbon→band|outline`, `morph→active|outline`) was written without reading the code. I read all four mode files. **The canonical mapping is:**

| Mode file | Mode(s) | Roles emitted | Evidence (file:line) |
|---|---|---|---|
| `src/engine/lattice.ts` | globe | **field + active** | all dots are the lat/long field (`dots.push` l.116–124); the scan meridian (`boost` l.113–115, "the scan: a moving meridian"; l.123 "dimBase < 1 fades un-scanned dots so the meridian reads clearly") → `active` |
| `src/engine/lattice.ts` | rubik | **field + active** | field l.156–162; the turning band (`inActive` l.55, l.160–161; comment l.155 "the band being turned inks a touch darker — the 'hand'") → `active` |
| `src/engine/lattice.ts` | wave | **field + active** | field l.195–201; the wave crest (`crest` l.194, bigger/brighter l.199–200) → `active` |
| `src/engine/orbits.ts` | orbits | **ghost + particle** | ghost path l.44–60 (comment l.43 "ghost path"); particles l.62–77 (comment l.61 "the particles doing the work") |
| `src/engine/ribbon.ts` | ribbon | **ghost + band** | faint Fibonacci sphere l.20–25 (`white: 0.78, a: 0.1+0.22*depth`) → `ghost`; band strands l.44–68 (`edge` l.46, l.65) → `band` |
| `src/engine/morph.ts` | morph | **outline** | single dot loop l.121–127; every dot lies on the blended outline (file header l.1–7 "a dotted outline"); no sub-population |

**Where the spec diverges (4/4 files):**
- lattice: spec said `ghost|active` — **no ghost population exists** in lattice.ts (no `ghostN`); the base population is the sphere *field*.
- orbits: spec said `particle|field` — orbits has **ghost+particle** (l.43, l.61); there is no *field*.
- ribbon: spec said `band|outline` — ribbon has **ghost+band** (l.24, l.44–68); no *outline*.
- morph: spec said `active|outline` — morph emits **outline only**; there is no *active* sub-population (all dots equivalent, l.121–127).

**Also corrected:** spec/proposal reference `src/modes/*.ts (6)` — the six draws live in **4 files under `src/engine/`** (`lattice.ts`×3, `orbits.ts`, `ribbon.ts`, `morph.ts`) plus `registry.ts` (mode→draw map). `Dot`/`ModeDraw` are in `src/engine/types.ts`/`core.ts`; mode opts in `src/engine/profiles.ts`.

**Recommended action:** patch spec.md's "Dot role tagging" requirement to the canonical mapping before sdd-tasks (design is the implementation contract and overrides the spec regardless).

## Architecture Decisions

| Decision | Options | Tradeoff | Choice |
|---|---|---|---|
| `DotRole` home | engine vs palettes | palettes is pure (no imports); engine defines the contract paint consumes | Define `DotRole`, `RoleRamp`, `ResolvedRoleColors` in `src/engine/types.ts`; `palettes.ts` imports them and re-exports publicly |
| paint signature | `(ctx,dots,dark,colors?,rMin)` (proposal shorthand) vs `(ctx,dots,dark,rMin=0.3,colors?)` | spec says *trailing* `colors?`; keeping `rMin` 4th means the 6 call sites `paint(ctx,dots,dark,o.rMin)` are untouched when colors absent (minimal diff) | `paint(ctx, dots, dark, rMin = 0.3, colors?)` — colors genuinely trailing; proposal shorthand superseded by spec wording |
| What `colors?` carries | CSS strings vs numeric ramps | parsing per frame is wasteful; spec demands precomputed numeric ramps once per mount | `ResolvedRoleColors` — numeric `[r,g,b]` ramps, resolved in ThinkingOrb, threaded through draw→paint |
| Mono fast path | always build role map vs skip | byte-identical guarantee + zero cost | `colors === undefined` → existing grayscale branch untouched; palette/colors resolution returns `undefined` for the mono default |
| Palette data vs logic | one file vs two | biome `noExcessiveLinesPerFile` (250) | data-only `src/palette-data.ts` (22 compact entries) + logic `src/palettes.ts` |
| Site styling | fresh Tailwind config vs reuse demo tailwind.css | demo tailwind.css is upstream styling; site is a fresh product page | new `site/src/styles.css` (Tailwind 4 `@import "tailwindcss"`), per proposal "not a port of the old playground" |
| CNAME | keep `orbs.jakubantalik.com` | that domain is the upstream repo's Pages domain; fork cannot serve it | drop CNAME; fork Pages at `https://bardolog1.github.io/thinking-orbs-colorized/` |
| Storybook config vs biome | `.storybook/*.ts` default exports | biome `noDefaultExport` flags them | add `.storybook` to biome.json `files.excludes` (site/dist already covered by `dist`) |

## 1. Palette Data Architecture

### Types (`src/palettes.ts`; `DotRole`/`RoleRamp`/`ResolvedRoleColors` re-exported from `src/engine/types.ts`)

```ts
export interface ThemeRamp { ink: string; fade: string; }              // CSS colors
export interface OrbPalette {
  id: string;
  name: string;
  light: ThemeRamp;
  dark: ThemeRamp;
  accents?: { light?: Partial<Record<DotRole, string>>; dark?: Partial<Record<DotRole, string>>; };
}
export const PALETTES: readonly OrbPalette[];   // frozen snapshot, 22 entries
export const DEFAULT_PALETTE: OrbPalette;       // mono
export function registerPalette(p: OrbPalette): void;                  // validate; overwrite dup id + dev warn; reject invalid + dev warn
export function resolvePalette(input: string | OrbPalette, dark: boolean): OrbPalette; // id | CSS shorthand | inline object → mono fallback + dev warn
export function resolveColorSet(palette: string | OrbPalette | undefined, colors: Partial<Record<DotRole, string>> | undefined, dark: boolean): ResolvedRoleColors | undefined;
```

### The 22 curated ramps (same-hue ink→fade stops per theme; generated from hue + per-theme S/L, so `ink`/`fade` never cross hues)

`light.fade` is a pale tint (near-invisible far dots on light substrate), `dark.fade` a deep shade; `ink` carries the contrast. **mono = byte-identity**: light `{#000,#fff}`, dark `{#fff,#000}`.

| id | light ink | light fade | dark ink | dark fade | accents (light / dark) |
|---|---|---|---|---|---|
| mono | `#000000` | `#ffffff` | `#ffffff` | `#000000` | — |
| graphite | `#454a54` | `#eaeaeb` | `#afb5c0` | `#1f2023` | — |
| slate | `#385275` | `#e8eaee` | `#97b2d8` | `#1a2028` | — |
| paper | `#725b3b` | `#f6f5f4` | `#ebe2d6` | `#2d251b` | — |
| ember | `#8b3d23` | `#f0e8e6` | `#f4997b` | `#2e1b14` | active/particle/outline `#b4222e` / `#f9868f` |
| sunset | `#8b5323` | `#f0eae6` | `#f4b47b` | `#2e2014` | active/particle/band/outline `#b4225f` / `#f986b6` |
| aurora | `#238b68` | `#e6f0ec` | `#7bf4cc` | `#142e26` | active/particle/band `#22a1b4` / `#86e9f9` |
| ocean | `#23578b` | `#e6ebf0` | `#7bb8f4` | `#14212e` | active/particle/band `#22a5b4` / `#86edf9` |
| arctic | `#297ea3` | `#e6edf0` | `#7bd0f4` | `#14262e` | active/particle `#2283b4` / `#86d2f9` |
| nebula | `#49238b` | `#e9e6f0` | `#a77bf4` | `#1e142e` | active/particle/outline `#b42288` / `#f986d6` |
| ai-gradient | `#53238b` | `#eae6f0` | `#b47bf4` | `#20142e` | active/particle/band/outline `#b4227f` / `#f986cf` |
| mint | `#238b5a` | `#e6f0eb` | `#7bf4bc` | `#142e22` | active/particle `#66b422` / `#bbf986` |
| synthwave | `#8b2376` | `#f0e6ee` | `#f47bdc` | `#2e1429` | active/particle/band/outline `#22a3b4` / `#86ebf9` |
| cyberpunk | `#8b238b` | `#f0e6f0` | `#f47bf4` | `#2e142e` | active/particle/band/outline `#22afb4` / `#86f5f9` |
| matrix | `#238b23` | `#e6f0e6` | `#7bf47b` | `#142e14` | active/particle/band `#83b422` / `#d2f986` |
| macaron | `#7b324b` | `#f5f0f1` | `#df90ab` | `#2a181e` | active/particle `#5822b4` / `#b086f9` |
| fog | `#546978` | `#eef0f1` | `#a8bac7` | `#242a2e` | active/particle `#225fb4` / `#86b6f9` |
| forest | `#238b3d` | `#e6f0e8` | `#7bf499` | `#142e1b` | active/particle `#53b422` / `#acf986` |
| moss | `#5f8b23` | `#ebf0e6` | `#c2f47b` | `#232e14` | active/particle `#a8b422` / `#eff986` |
| desert | `#8b6523` | `#f0ece6` | `#f4c87b` | `#2e2514` | active/particle/band `#b43f22` / `#f99d86` |
| holiday | `#8b2331` | `#f0e6e7` | `#f47b8b` | `#2e1417` | active/particle/band/outline `#22b453` / `#86f9ac` |
| midnight | `#23238b` | `#e6e6f0` | `#9797f7` | `#14142e` | active/particle/outline `#2277b4` / `#86c9f9` |

### lerp, mono identity, CSS parse, registry

```ts
// per-channel, 0–255 ints; result rounded at paint time:
//   c = Math.round(ink + (fade - ink) * w)   with w = clamp(d.white, 0, 1)
// mono light: ink=0, fade=255 → Math.round(255·w)        ≡ current Math.round(w·255)
// mono dark:  ink=255, fade=0 → Math.round(255·(1−w))    ≡ current Math.round((1−w)·255)
export function lerpRGB(a: RGB, b: RGB, t: number): RGB;  // a + (b − a)·t per channel
```
Mono identity is **verified byte-identical** against `src/engine/core.ts:65` (`const g = Math.round((dark ? 1 - w : w) * 255)`); clamp (`core.ts:64`) and `alpha < 0.02` skip (`core.ts:63`) are preserved, and the fill string stays `rgba(r,g,b,alpha)` — identical for r=g=b.

- `cssToRgb(color): RGB | null` — parses `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()/rgba()` (numbers and %), `hsl()/hsla()`; named colors via a **minimal built-in table** (CSS basic 17 + ~6 common) for SSR, plus a **one-time 1×1 canvas probe** (`getImageData`) when `document` exists, **cached in a module `Map`**. SSR-safe: no `document` → table only → unknown name → `null` → default + dev warning. (Spec: probe cached, single probe total.)
- **CSS shorthand auto-derive** (`palette="#0ea5e9"`): `light = { ink: c, fade: mix(c, white, 0.88) }`, `dark = { ink: mix(c, white, 0.38), fade: mix(c, black, 0.85) }` — mixing with white/black keeps the hue family (same-hue doctrine).
- `resolvePalette` precedence: **registry id → CSS color parse → mono + dev warning** (ids are authoritative; none of the 22 collide with CSS names). Inline object: validate `light/dark.ink/fade` parse; invalid → mono + warning (spec: malformed entry falls back; MUST NOT throw).
- `registerPalette`: validate (id string, both ramps parse); **duplicate id overwrites + dev warning** (spec scenario); invalid → rejected (no mutation) + dev warning. Internal `Map` seeded from the 22 at module load; `PALETTES` export is a frozen snapshot.

## 2. Engine Threading Design

```ts
// src/engine/types.ts
export type DotRole = 'ghost' | 'particle' | 'field' | 'active' | 'band' | 'outline';
export type RGB = readonly [number, number, number];
export interface RoleRamp { ink: RGB; fade: RGB; }
export type ResolvedRoleColors = { default: RoleRamp } & Partial<Record<DotRole, RoleRamp>>;

export type ModeDraw = (ctx, size, t, dark, opts, colors?: ResolvedRoleColors) => void;
// TS: existing 5-arg impls (all six draws) remain assignable; ThinkingOrb's 5-arg call is unaffected.

// src/engine/core.ts
export interface Dot { x; y; z; r; white; a?; role?: DotRole; }          // additive, optional
export function paint(ctx, dots, dark, rMin = 0.3, colors?: ResolvedRoleColors): void;
// colors absent → existing grayscale branch (byte-identical); colors present →
//   const ramp = colors[d.role] ?? colors.default;
//   c = lerpRGB(ramp.ink, ramp.fade, w); fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`
```

**Per-mode tagging points** (role computed once per pushed dot; `colors` forwarded as trailing arg to `paint`):

| File | Line (push) | Tag rule |
|---|---|---|
| `lattice.ts` globe | l.116 | `role: boost > 0.01 ? 'active' : 'field'` |
| `lattice.ts` rubik | l.156 | `role: inActive ? 'active' : 'field'` |
| `lattice.ts` wave | l.195 | `role: crest > 0.01 ? 'active' : 'field'` |
| `orbits.ts` ghost | l.52 | `role: 'ghost'` |
| `orbits.ts` particle | l.70 | `role: 'particle'` |
| `ribbon.ts` ghost | l.24 | `role: 'ghost'` |
| `ribbon.ts` band | l.60 | `role: 'band'` |
| `morph.ts` outline | l.121 | `role: 'outline'` |

**Color flow:** `ThinkingOrb` → `resolveColorSet(palette, colors, dark)` (useMemo) → `draw(ctx, size, t, dark, opts, colors)` → each mode pushes tagged dots and calls `paint(ctx, dots, dark, o.rMin, colors)`. When `colors` is `undefined` (no palette, no colors overlay) the mono path is untouched. The reduced-motion static frame (`ThinkingOrb.tsx:56–58`, `frame(0.6)`) flows through the same `draw` → colors applied. `colors` never enters numeric `ModeOpts` (spec).

**Accent resolution** (`resolveColorSet`): base ramp from `palette[theme]`; `palette.accents[theme]?.[role]` → `{ ink: accentRGB, fade: base.fade }`; `colors?.[role]` (the prop overlay) overwrites the accent for that role — precedence `colors > palette > default` (spec). All RGB precomputed once per mount; per-dot cost = role lookup + 3-channel lerp (2 mult + 1 add + round each) — negligible at 100–600 dots.

## 3. API Surface Design

```ts
// src/types.ts — new props (JSDoc'd for Storybook autodocs)
import type { OrbPalette } from './palettes';
import type { DotRole } from './engine/types';
export interface ThinkingOrbProps extends Omit<CanvasHTMLAttributes<HTMLCanvasElement>, 'style'> {
  // ...existing state/size/theme/speed/paused...
  /** Palette id, CSS-color shorthand (auto-derives dual ramps), or inline OrbPalette. @default mono */
  palette?: string | OrbPalette;
  /** Per-role ink-stop overlays; wins over palette accents. @default undefined */
  colors?: Partial<Record<DotRole, string>>;
  style?: CSSProperties;
}
```

Resolution in `ThinkingOrb` (per mount):
```ts
const colorSet = useMemo(() => resolveColorSet(palette, colors, dark), [palette, colors, dark]);
// effect deps add colorSet: [state, size, dark, speed, paused, reduced, colorSet]  (ThinkingOrb.tsx:103)
// frame(): draw(ctx, size, tSec, dark, opts, colorSet ?? undefined)
```
- **Precedence:** `colors` (per-role overlay) > `palette` (id/CSS/object) > default mono. Theme selects the ramp inside `resolveColorSet` via `dark` (`useResolvedDark`, `src/theme.ts`), live-updating because `dark` is state.
- **`src/index.ts` new exports** (explicit named, per biome `noBarrelFile`): `OrbPalette`, `ThemeRamp`, `DotRole`, `PALETTES`, `DEFAULT_PALETTE`, `registerPalette`, `resolvePalette`. (`resolvePalette` exported for power users + the site's gallery swatches. `cssToRgb`/`lerpRGB` stay internal.) Existing exports unchanged.

## 4. Storybook Design (local only)

- **devDeps:** `storybook@^8`, `@storybook/react-vite@^8`, `@storybook/addon-essentials@^8`. No deploy surface — pages.yml/publish.yml untouched by it (grep-verified in apply).
- **`.storybook/main.ts`:** `stories: ['../src/stories/**/*.stories.tsx']`, framework `@storybook/react-vite`, addons `['@storybook/addon-essentials']`, `docs: { autodocs: true }`. **`.storybook/preview.ts`:** toolbar globals `theme` (auto/dark/light) driving a background grid.
- **Stories** (`src/stories/`):
  1. `ThinkingOrb.stories.tsx` — default "Playground" story: args/controls for `state` (6), `size` (64|20), `theme`, `speed` (0–3), `paused`, `palette` (select: 22 ids + `#0ea5e9` + `red`), `colors` (per-role object).
  2. `PaletteGallery.stories.tsx` — all 22 palettes × representative states, light/dark toggle via the theme global; swatches show id + name.
  3. `Theme.stories.tsx` — light vs dark themed examples on matching backgrounds.
- **npm scripts:** `"storybook": "storybook dev -p 6006"`, `"build:storybook": "storybook build"` (local verification only; never invoked in CI).
- biome: exclude `.storybook` (default exports) and `site` (its own tailwind app) as needed.

## 5. Product Site (`site/`)

```
site/
  index.html
  vite.config.ts            // root: site; plugins react+tailwindcss; alias 'thinking-orbs-colorized' → ../src/index.ts
                            //   (dogfoods the public API, as vite.config.demo.ts did); outDir: site/dist
  src/
    main.tsx  App.tsx  styles.css          // fresh Tailwind 4 styling
    sections/  Hero.tsx  LiveDemo.tsx  PaletteGallery.tsx  ApiDocs.tsx  QuickStart.tsx
    components/ Playground.tsx  PlayPauseToggle.tsx  CopyButton.tsx  PaletteSwatch.tsx
    hooks/useTheme.ts                      // migrated from demo/hooks/useTheme.ts
    lib/cn.ts                              // migrated from demo/lib/utils.ts
  public/ favicon.svg                      // fresh; upstream header.png/CNAME dropped
```
- **Sections (fixed v1):** hero (with two orb pills — the `Examples` hero concept absorbed); **live demo** (migrated Playground); 22-palette gallery with light/dark toggle (clickable swatches); API docs (props incl. `palette`/`colors`/`registerPalette`, rendered from `resolvePalette`); install + quick start; Storybook link.
- **Playground migration:** `demo/components/Playground.tsx` moves to `site/src/components/Playground.tsx` — **retains state/size/speed slider/paused controls** (spec: MUST retain) and **gains palette select (22), colors (per-role pickers, collapsible "advanced"), theme (auto/dark/light)**; snippet generator extended to emit `palette`/`colors`/`theme` and the renamed import. `PlayPauseToggle`, `CopyButton`, `cn` move with it.
- **Absorbed:** `Examples.tsx` hero pills → site hero; `Header`/`Footer` → site chrome; `useTheme` → site hook. **Dropped:** `SimpleApp`/`simple.html`/`simple-main.tsx`/`simple.css` (superseded by Storybook docs), dev-only `debug`/`bigChips`/`smallAll` toggles, `demo/tailwind.css`, upstream `CNAME`/`header.png`, `vite.config.demo.ts`.
- **pages.yml repoint:** triggers `['site/**', 'src/**', 'package.json', '.github/workflows/pages.yml']`; steps `npm ci` → `npm run build:site` → upload `site/dist`. Library build (`vite.config.ts`) untouched. `dist-demo`/`dist-playground` removed from .gitignore.

## 6. Bilingual Docs

- `README.md` (EN, rewritten) + `README.es.md` (ES neutral/professional, no slang), **linked from README top** (`**Español** — [README.es.md](./README.es.md)`), written in the same change and kept structurally mirrored (sync checklist: every EN `##` has an ES equivalent).
- Coverage both: install/quick start (`thinking-orbs-colorized`), states, sizes, theme, **colors/palettes (new section: 22 palettes, `palette` id/CSS/object, `colors` overlay, `registerPalette`)**, other props, accessibility & performance, **Storybook workflow** (local), new site URL, license.

## 7. Rename + Release

`package.json`: `name: "thinking-orbs-colorized"`, `version: "0.2.0"`, `description` + `keywords` (+palette, +color, +theme), `homepage: "https://bardolog1.github.io/thinking-orbs-colorized/"`, `repository`/`bugs` → fork URLs, `author` unchanged. Scripts: drop `dev`/`build:demo`, add `build:site`, `preview:site`, `storybook`, `build:storybook`, optional `check:lerp`. Internal references: README install snippet, Playground snippet builder (`thinking-orbs` → `thinking-orbs-colorized`), site alias. `publish.yml` unchanged (tag-triggered; publishes the renamed package — verify npm name availability).

## Data Flow

```
ThinkingOrb ──useResolvedDark──▶ dark ──┐
   palette/colors props ──useMemo──▶ resolveColorSet(palette, colors, dark)
                                       └──▶ ResolvedRoleColors? (numeric ramps, once per mount)
                                                   │
draw(ctx, size, t, dark, opts, colors?)  [ModeDraw ×6 — tag d.role, forward colors]
                                                   ▼
paint(ctx, dots, dark, o.rMin, colors?)
   │ colors? ──▶ per-dot ramp = colors[d.role] ?? colors.default
   │ no colors ──▶ mono ramp(dark)  [byte-identical legacy path]
   ▼
fillStyle = rgba(lerpRGB(ramp.ink, ramp.fade, w), alpha)   // per dot
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/palette-data.ts` | Create | 22 `OrbPalette` entries (compact; respects 250-line rule) |
| `src/palettes.ts` | Create | types, registry, `resolvePalette`, `resolveColorSet`, `cssToRgb` (canvas probe + table), `lerpRGB` |
| `src/engine/types.ts` | Modify | `DotRole`, `RGB`, `RoleRamp`, `ResolvedRoleColors`; `ModeDraw` + trailing `colors?` |
| `src/engine/core.ts` | Modify | `Dot.role?`; `paint(ctx,dots,dark,rMin=0.3,colors?)` with mono fast path |
| `src/engine/lattice.ts` | Modify | tag field/active (3 draws), forward colors |
| `src/engine/orbits.ts` | Modify | tag ghost/particle, forward colors |
| `src/engine/ribbon.ts` | Modify | tag ghost/band, forward colors |
| `src/engine/morph.ts` | Modify | tag outline, forward colors |
| `src/types.ts` | Modify | `palette?`, `colors?` props |
| `src/ThinkingOrb.tsx` | Modify | `resolveColorSet` memo; pass to `draw`; deps |
| `src/index.ts` | Modify | new explicit exports |
| `src/stories/` | Create | 3 story files |
| `.storybook/` | Create | main.ts + preview.ts |
| `site/` | Create | product site (above) |
| `vite.config.demo.ts` | Delete | replaced by `site/vite.config.ts` |
| `demo/` | Delete | Playground/useTheme/`cn` migrated first |
| `.github/workflows/pages.yml` | Modify | build+deploy `site/dist` |
| `package.json` | Modify | rename, 0.2.0, scripts, devDeps (storybook) |
| `README.md` / `README.es.md` | Modify / Create | bilingual, linked, in sync |
| `.gitignore` | Modify | drop `dist-demo`/`dist-playground` (site/dist covered by `dist`) |
| `biome.json` | Modify | exclude `.storybook` (and `site` if needed) |
| `openspec/changes/orb-color-palettes/spec.md` | Modify (recommended) | correct role-tagging mapping + mode file paths |

## Interfaces / Contracts

Covered inline above (palette types §1, engine contracts §2, props §3). All new modules follow the repo conventions: explicit named exports, `useImportType`, no `any`, 250-line cap, 2-space/120-col formatting (biome.json).

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit (optional, per proposal) | lerp identity properties | `scripts/lerp-check.mjs` — `node:assert`, zero deps: `lerp(a,b,0)=a`, `lerp(a,b,1)=b`, `lerp(x,x,w)=x`; mono light == `Math.round(w·255)`, mono dark == `Math.round((1−w)·255)`; `npm run check:lerp` |
| Manual (Storybook) | 22 palettes × light/dark render; role accents visible (e.g. rubik's turning band, orbits particles) | gallery + playground stories, visual smoke |
| CI | typecheck + library build + site build | existing `npm run build`/`typecheck`; pages.yml runs `build:site` (stays green) |
| Snapshot | mono byte-identity | one-time manual pixel diff during apply/verify (proposal success criterion; no snapshot infra) |

## Migration / Rollout

No data migration. One atomic PR; revert restores `demo/`, `vite.config.demo.ts`, old pages.yml. Engine change purely additive (optional params). Rename revert = package.json metadata only. Storybook local-only → no deploy surface. Site revert = remove `site/` + restore pages.yml.

## Constraints & Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| RGB lerp muddies cross-hue pairs | Med | curated ramps use same-hue tint/shade stops (verified in §1 data); accents introduce a 2nd hue only at the ink stop; OKLCH later |
| Neon palettes weak on light bg | Med | per-theme sober light ramps (lower S, L 0.32–0.42); contrast QA at 20px dot scale |
| Plain-fills doctrine broken | Low | paint keeps one solid `rgba` fillStyle per dot; ramps are numeric lerps, **no** canvas gradients/filters |
| No test infra | Known | zero tests today; one optional zero-dep lerp identity check; byte-identity proven analytically + one-time diff |
| Bundle growth (~2–3KB) | Low | single tree-shakeable module; `sideEffects:false` preserved |
| Spec role-mapping conflict | Certain | design overrides (verified §CRITICAL); spec patch recommended before sdd-tasks |
| Demo removal breaks CI refs | Low | pages.yml repointed in same change; apply greps `demo`/`dist-demo`/`vite.config.demo` |
| CSS-name SSR edge | Low | built-in table fallback; unknown → default + warning |
| npm name availability (`thinking-orbs-colorized`) | Low | verify before publish; publish.yml unchanged |

## Open Questions

- [x] **Spec patch (RESOLVED):** the "Dot role tagging" requirement was corrected to the canonical mapping (`lattice→field+active`, `orbits→ghost+particle`, `ribbon→ghost+band`, `morph→outline`) and `src/modes/*` → `src/engine/*` in spec.md.
- [x] **Fork Pages URL (RESOLVED):** `https://bardolog1.github.io/thinking-orbs-colorized/` (fork `Bardolog1/thinking-orbs-colorized`, confirmed via `git remote -v`). NOTE: Pages is not yet enabled on the fork (`GET /repos/Bardolog1/thinking-orbs-colorized/pages` → 404); repo owner MUST enable Pages (Settings → Pages → Source: GitHub Actions) before the first deploy.
