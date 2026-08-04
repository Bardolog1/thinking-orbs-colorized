# Tasks: Orb Color Palettes

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~3,400 (range 2,800–3,600) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (A+B) → PR 2 (C+D) → PR 3 (E) → PR 4 (F) |
| Delivery strategy | ask-on-risk (orchestrator: ask-always) |
| Chain strategy | pending (user chooses stacked-to-main / feature-branch-chain / size-exception) |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

Note: design.md §Migration says "one atomic PR"; the review guard overrides — user must pick a chain strategy. PR 3 (site ~1,980) inherently exceeds budget (new static site + demo deletion); may sub-split into E1–E4 then E5–E6, or take `size:exception`. PR 1 (~650) may sub-split into A alone (~470) + B (~111).

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Library colorization (palette module + engine threading + props + exports + lerp check) | PR 1 | base main/tracker; library builds green; mono byte-identical |
| 2 | Rename + local Storybook | PR 2 | base PR 1 branch; package flips to `thinking-orbs-colorized@0.2.0` here |
| 3 | Product site + deploy swap (site/, pages.yml, delete demo/) | PR 3 | base PR 2 branch; Pages must be enabled manually first |
| 4 | Bilingual README | PR 4 | base PR 3 branch; EN + ES mirrored |

## Workstream A — Palette data + API (foundation)

- [x] **A1 — Engine color contract types** — `src/engine/types.ts`: add `DotRole` (`ghost|particle|field|active|band|outline`), `RGB`, `RoleRamp`, `ResolvedRoleColors` (`{default}` + partial roles); extend `ModeDraw` with trailing `colors?: ResolvedRoleColors` (existing 5-arg impls stay assignable). Verify: `npm run typecheck` passes with zero draw changes. Accept: additive-only diff; spec "Non-breaking colors threading". Est: ~20
- [x] **A2 — Palette data** — create `src/palette-data.ts`: 22 curated `OrbPalette` entries (id/name/light/dark ink+fade + accents per design §1 table), `mono` = `light{#000,#fff}`/`dark{#fff,#000}`; compact so file < 250 lines (biome). Verify: `npm run typecheck`; `npx biome check src/palette-data.ts`. Accept: all 22 ids present; every ramp parses; spec "All 22 palettes resolve". Est: ~210
- [x] **A3 — Palette module** — create `src/palettes.ts`: `ThemeRamp`/`OrbPalette` types (re-export `DotRole` etc. from engine), frozen `PALETTES` snapshot, `DEFAULT_PALETTE`, `registerPalette` (validate; dup id overwrites + dev warn; invalid rejected + warn), `resolvePalette` (id | CSS shorthand `#0ea5e9` auto-derive dual ramps via mix with white/black | inline object; unknown/malformed → mono + dev warn, never throw), `resolveColorSet` (precedence `colors > palette > default`, numeric RGB ramps), internal `cssToRgb` (table of basic names + one-time 1×1 canvas probe cached in module Map, SSR-safe) and `lerpRGB`. Verify: `npm run typecheck`. Accept: spec scenarios — shorthand derives readable ramps; unknown id → mono + warning; probe cached (single probe); SSR (no document) no throw. Est: ~240
- [x] **A4 — Optional lerp identity check (low priority)** — create `scripts/lerp-check.mjs` (node:assert, zero deps): `lerp(a,b,0)=a`, `lerp(a,b,1)=b`, `lerp(x,x,w)=x`; mono light == `Math.round(w*255)`, mono dark == `Math.round((1-w)*255)`; add `"check:lerp"` script. Verify: `npm run check:lerp`. Accept: script exits 0. Est: ~70

## Workstream B — Engine colorization (non-breaking)

- [x] **B1 — paint() colors?** — `src/engine/core.ts`: add `role?: DotRole` to `Dot`; `paint(ctx, dots, dark, rMin = 0.3, colors?: ResolvedRoleColors)`; when `colors` undefined keep existing grayscale branch byte-identical (formula `core.ts:65` untouched); when present, `ramp = colors[d.role] ?? colors.default`, `c = lerpRGB(ramp.ink, ramp.fade, w)`, fill `rgba(c0,c1,c2,alpha)`; keep clamp + `alpha<0.02` skip. Verify: `npm run typecheck`; `npm run build`. Accept: spec "Colors absent" byte-identical mono; "Colors present" paints per-role. Est: ~25
- [x] **B2 — lattice role tags** — `src/engine/lattice.ts`: globe `role: boost > 0.01 ? 'active' : 'field'` (l.116), rubik `role: inActive ? 'active' : 'field'` (l.156), wave `role: crest > 0.01 ? 'active' : 'field'` (l.195); forward `colors` to `paint(ctx, dots, dark, o.rMin, colors)`. Verify: `npm run typecheck`; visual smoke in Storybook (B2 belongs to PR 1 — verify via site gallery later or temporary console). Accept: design §CRITICAL mapping lattice→field+active; spec "Dot role tagging". Est: ~18
- [x] **B3 — orbits role tags** — `src/engine/orbits.ts`: ghost `role:'ghost'` (l.52), particle `role:'particle'` (l.70); forward `colors`. Verify: `npm run typecheck`. Accept: design mapping orbits→ghost+particle. Est: ~10
- [x] **B4 — ribbon role tags** — `src/engine/ribbon.ts`: ghost `role:'ghost'` (l.24), band `role:'band'` (l.60); forward `colors`. Verify: `npm run typecheck`. Accept: design mapping ribbon→ghost+band. Est: ~10
- [x] **B5 — morph role tag** — `src/engine/morph.ts`: outline `role:'outline'` (l.121); forward `colors`. Verify: `npm run typecheck`. Accept: design mapping morph→outline (no sub-population). Est: ~8
- [x] **B6 — public props** — `src/types.ts`: add `palette?: string | OrbPalette` (id | CSS shorthand | inline object, `@default mono`) and `colors?: Partial<Record<DotRole, string>>` (per-role ink overlay, wins over palette), JSDoc'd for autodocs. Verify: `npm run typecheck`. Accept: spec "Palette resolution and precedence" — `colors > palette > default`. Est: ~18
- [x] **B7 — ThinkingOrb wiring** — `src/ThinkingOrb.tsx`: `const colorSet = useMemo(() => resolveColorSet(palette, colors, dark), [palette, colors, dark])`; pass `colorSet ?? undefined` as 6th arg to `draw` in `frame()` (incl. reduced-motion `frame(0.6)` path, l.56–58); add `colorSet` to effect deps (l.103). Verify: `npm run typecheck`; `npm run build`. Accept: spec "Reduced-motion path" — static frame colorized; colors never enter numeric `ModeOpts`. Est: ~14
- [x] **B8 — public exports** — `src/index.ts`: explicit named exports `OrbPalette`, `ThemeRamp`, `DotRole`, `PALETTES`, `DEFAULT_PALETTE`, `registerPalette`, `resolvePalette` (no barrel/namespace re-export per biome `noBarrelFile`). Verify: `npm run typecheck`; `npx biome check src/index.ts`. Accept: power-user surface matches design §3; existing exports unchanged. Est: ~8

## Workstream C — Package rename + build config (before D/E — they need scripts/devDeps)

- [x] **C1 — Metadata rename** — `package.json`: `name: "thinking-orbs-colorized"`, `version: "0.2.0"`, `description`/`keywords` (+palette/color/theme), `homepage: "https://bardolog1.github.io/thinking-orbs-colorized/"`, `repository`/`bugs` → fork URLs. Verify: `npm pkg get name version homepage`. Accept: spec "Metadata updated"; npm name availability checked (design §7). Est: ~12
- [x] **C2 — Scripts + devDeps + biome** — `package.json`: drop `dev`/`build:demo`; add `build:site`, `preview:site`, `storybook`, `build:storybook`, `check:lerp`; add devDeps `storybook@^8`, `@storybook/react-vite@^8`, `@storybook/addon-essentials@^8`. `biome.json`: add `.storybook` (and `site` if flagged) to `files.excludes`. Verify: `npm install` resolves; `npm run typecheck` still green. Accept: scripts available for D/E; no deploy workflow references storybook (grep `.github/`). Est: ~25

## Workstream D — Storybook (local only)

- [x] **D1 — Storybook config** — create `.storybook/main.ts` (`stories: ['../src/stories/**/*.stories.tsx']`, framework `@storybook/react-vite`, addons `@storybook/addon-essentials`, `docs: { autodocs: true }`) and `.storybook/preview.ts` (toolbar globals `theme` auto/dark/light driving background grid). Verify: `npm run storybook` launches on :6006. Accept: spec "Local Storybook showcase" controls/docs mode; `pages.yml`/`publish.yml` untouched (grep). Est: ~45
- [x] **D2 — Playground story** — create `src/stories/ThinkingOrb.stories.tsx`: args/controls for `state` (6), `size` (64|20), `theme`, `speed` (0–3), `paused`, `palette` (select: 22 ids + `#0ea5e9` + `red`), `colors` (per-role object). Verify: story re-renders on every control change. Accept: spec "Controls drive the orb". Est: ~110
- [x] **D3 — Palette gallery story** — create `src/stories/PaletteGallery.stories.tsx`: all 22 palettes × representative states, light/dark toggle via theme global, swatches show id + name (imports `PALETTES`). Verify: `npm run storybook` shows 22 swatches. Accept: spec "All palettes shown". Est: ~85
- [x] **D4 — Theme story** — create `src/stories/Theme.stories.tsx`: light vs dark themed examples on matching backgrounds. Verify: renders both themes. Accept: covers spec "Cross-hue contrast QA" manual check. Est: ~45

## Workstream E — Product site + deploy swap

- [x] **E1 — Site scaffold** — create `site/index.html`, `site/vite.config.ts` (root `site`, react+tailwindcss plugins, alias `thinking-orbs-colorized` → `../src/index.ts`, outDir `site/dist`), `site/src/main.tsx`, `site/src/styles.css` (Tailwind 4 `@import "tailwindcss"`, fresh styling — not a port of demo tailwind), `site/public/favicon.svg`. Verify: `npm run build:site` → `site/dist` produced; `npm run build` (library) unaffected. Accept: spec "Site builds standalone"; library build untouched. Est: ~200
- [x] **E2 — Site chrome + hero** — create `site/src/App.tsx`, `sections/Hero.tsx` (absorbs Examples hero orb pills), migrate `demo/hooks/useTheme.ts` → `site/src/hooks/useTheme.ts`, `demo/lib/utils.ts` → `site/src/lib/cn.ts`; Header/Footer → site chrome. Verify: `npm run build:site`; site renders hero at `npm run preview:site`. Accept: design §5 structure; hero concept from Examples absorbed. Est: ~200
- [x] **E3 — Live demo (Playground migration)** — migrate `demo/components/Playground.tsx` → `site/src/components/Playground.tsx`: retain `state`/`size`/`speed` slider/`paused` controls; add `palette` select (22 ids), `colors` per-role pickers (collapsible "advanced"), `theme` (auto/dark/light); extend snippet builder to emit `palette`/`colors`/`theme` and renamed import `thinking-orbs-colorized`; move `PlayPauseToggle`/`CopyButton`; add `PaletteSwatch`; wrap in `sections/LiveDemo.tsx`. Verify: `npm run build:site`; in `preview:site` the orb updates in place when palette/theme change. Accept: spec "Playground controls preserved and extended" + "Demo is interactive"; drop dev-only `debug`/`bigChips`/`smallAll`. Est: ~330
- [x] **E4 — Gallery + API docs + quick start** — create `site/src/sections/PaletteGallery.tsx` (22 palettes, light/dark toggle, clickable swatches via `resolvePalette`), `ApiDocs.tsx` (props incl. `palette`/`colors`/`registerPalette`), `QuickStart.tsx` (install + quick start + Storybook link). Verify: `npm run build:site`; sections render. Accept: spec "Product site structure" fixed v1 sections. Est: ~280
- [x] **E5 — Deploy repoint** — `.github/workflows/pages.yml`: triggers `['site/**','src/**','package.json','.github/workflows/pages.yml']`; steps `npm ci` → `npm run build:site` → upload `site/dist`. `.gitignore`: drop `dist-demo`/`dist-playground` (`site/dist` already covered by `dist`). Verify: grep no `build:demo`/`dist-demo` refs; workflow parse. Accept: spec "GitHub Pages deployment". Pre-deploy manual step: repo owner enables Pages (Settings → Pages → Source: GitHub Actions). Est: ~18
- [x] **E6 — Demo removal** — delete `demo/` (App, SimpleApp, simple-*, main, styles/tailwind/simple css, components, hooks, lib, public/CNAME+header.png) and `vite.config.demo.ts` (Playground/useTheme/cn already migrated in E2/E3; SimpleApp/Examples superseded — SimpleApp dropped, Examples hero absorbed). Verify: grep repo for `demo/`, `vite.config.demo`, `dist-demo`, `orbs.jakubantalik.com`, `CNAME` → no dangling refs; `npm run typecheck && npm run build && npm run build:site` green. Accept: spec "demo superseded by site"; CI green. Est: ~950 (deletions)

## Workstream F — Bilingual docs

- [x] **F1 — README.md rewrite (EN)** — cover: install/quick start (`thinking-orbs-colorized`), states, sizes, theme, new Colors & Palettes section (22 palettes, `palette` id/CSS/object, `colors` overlay, `registerPalette`), other props, accessibility & performance, local Storybook workflow, new site URL, license; link `README.es.md` from top. Verify: section checklist matches F2. Accept: spec "Bilingual docs"; "Docs in sync". Est: ~210
- [x] **F2 — README.es.md create (ES)** — neutral/professional Spanish, structurally mirrored to F1, linked from README top. Verify: every EN `##` has an ES equivalent (sync checklist). Accept: spec "Docs in sync". Est: ~210

## Workstream G — Integration gate (verification only)

- [ ] **G1 — Final gate** — run `npm run typecheck`, `npm run build`, `npm run build:site`, `npx biome check`, `npm run check:lerp`; grep no `demo`/`dist-demo`/`vite.config.demo`/old homepage refs; one-time pixel-diff smoke that default mono output matches pre-change build. Verify: all commands pass. Accept: proposal success criteria — mono byte-identical, 22 palettes resolve, shorthand works, registerPalette/colors precedence holds, site deploys, CI green. Est: 0
