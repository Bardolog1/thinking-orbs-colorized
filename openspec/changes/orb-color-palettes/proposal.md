# Proposal: Orb Color Palettes

## Intent

Colorization is the fork's product differentiator. Every competitor ships single absolute colors (react-spinners `color`), fixed per-element arrays (react-loader-spinner `colors={[]}`), or 4-token enums (react-loader-animate) — none offer curated named palettes, dual light/dark ramps, or depth-preserving per-role color. This change ships 22 curated palettes whose per-theme `ink`/`fade` ramps keep the engine's depth model intact (near dots = ink contrast, far dots = fade to substrate) and give theme-aware contrast for free — and gives the renamed `thinking-orbs-colorized` package a real product presence: public site, bilingual docs, local Storybook.

## Scope

### In Scope
- **(a) Palette data system + API** — `src/palettes.ts`: OrbPalette types; 22-entry PALETTES; `registerPalette`; `resolvePalette` (id | CSS-color shorthand → auto-derived dual ramps | inline object); `resolveColors` merge; hex/CSS-name parser (one-time canvas probe, SSR-safe); RGB lerp. Single `palette` union prop; `colors` per-role overlay; precedence `colors > palette > default`; deliberately NO `color` prop.
- **(b) Engine colorization (non-breaking)** — optional trailing `colors?` on ModeDraw/paint; optional `Dot.role?`; colors stay out of numeric ModeOpts; mono reproduces current output byte-identically.
- **(c) Package rename** — → `thinking-orbs-colorized`; version 0.1.1 → 0.2.0; homepage/description/keywords → new site.
- **(d) Storybook LOCAL showcase** — @storybook/react-vite; per-prop controls/args; docs mode; `npm run storybook` for contributors only; NOT deployed anywhere.
- **(e) Product website `site/`** — static Vite site (fresh product page, not a port of the old playground), separate from the library build. Sections: hero/product intro; interactive live demo (state, size, theme, speed, paused, palette, colors); full 22-palette gallery (clickable, light/dark toggle); API docs (props reference incl. palette/colors/registerPalette); install + quick start; Storybook link. Replaces the old Playground as the deployed showcase. pages.yml repointed to build + deploy `site/`.
- **(f) Bilingual README** — README.md (English, default) + README.es.md (Spanish, neutral/professional, no slang), linked from README top, kept in sync; existing content (states, sizes, theme, other props, accessibility, performance) + new color features + rename + new site URL + Storybook workflow.

### Out of Scope
Upstream PR; WebGL/canvas gradients & filters (plain-fill cross-browser doctrine); visual tests (Storybook addons remain future); performance tuning; full test infra (zero tests today — optional minimal lerp identity-property test recommended); OKLCH lerp (later); keeping the old `demo/` app.

## Capabilities

### New Capabilities
- `color-palettes`: registry, resolution, CSS parse, RGB lerp, API contract
- `engine-colorization`: colors threading through ModeDraw/paint + dot roles
- `storybook-showcase`: local Storybook showcase (contributor-facing, not deployed)
- `product-site`: static Vite site (demo + palette gallery + API docs) deployed to GH Pages
- `bilingual-docs`: synchronized README.md / README.es.md

### Modified Capabilities
None — no existing `openspec/specs/`; package rename is config-level, not spec behavior.

## Approach

Resolve palette once per mount (useMemo keyed palette/colors/dark). Dot color = `lerp(ink, fade, w)` per theme; accents override the ink stop per role, depth preserved via fade lerp. Mono ramp light {#000,#fff} / dark {#fff,#000} reproduces the current gray formula exactly; `dark` param stays as fallback when colors are undefined. Six mode files tag dots (roles: ghost | particle | field | active | band | outline) and forward colors to paint. RGB ramps precomputed as numbers once; per-dot cost = 3 mults/channel — negligible at 100–600 dots.

Site structure (details → design/spec): `site/index.html`, `site/vite.config.ts`, `site/src/main.tsx`; build output `site/dist`; library build untouched. Scripts: add `storybook`, `build:site`, `preview:site`; drop `dev`/`build:demo` (vite.config.demo.ts removed).

## Affected Areas

| Area | Impact | Change |
|------|--------|--------|
| `src/palettes.ts` | New | types, registry, resolve/parse/lerp |
| `src/engine/core.ts` | Modified | `paint(ctx,dots,dark,colors?,rMin)` |
| `src/engine/types.ts` | Modified | ModeDraw + `colors?`; `Dot.role?` |
| `src/modes/*.ts` (6) | Modified | tag roles, forward colors |
| `src/ThinkingOrb.tsx` | Modified | palette/colors props, resolve memo |
| `src/index.ts` | Modified | new exports (OrbPalette, PALETTES, registerPalette, DotRole) |
| `demo/`, `vite.config.demo.ts` | Removed | replaced by site + Storybook |
| `site/` | New | product site (hero, demo, gallery, API docs, quick start) |
| `.storybook/`, `src/stories/` | New | local showcase, docs mode |
| `.github/workflows/pages.yml` | Modified | build + deploy `site/dist`, drop `dist-demo` |
| `package.json` | Modified | rename, homepage → site URL, scripts, devDeps |
| `README.md` | Modified | bilingual rewrite (English) |
| `README.es.md` | New | Spanish translation, linked from README top |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| RGB lerp muddies cross-hue pairs | Med | curated palettes use same-hue tint/shade stops; OKLCH later |
| Neon palettes weak on light bg | Med | per-theme sober light ramps; contrast QA at 20px dot scale |
| CSS color-name resolution | Low | one-time canvas probe, SSR-safe, cached |
| Invalid palette input | Low | fallback mono + dev warning |
| Bundle growth (~2–3KB) | Low | single module, tree-shakeable |
| Site scope creep / design effort | Med | fixed section list; lean v1; details in design |
| Demo removal breaks CI refs | Low | pages.yml repointed in same change; grep demo refs |
| Bilingual README drift | Low | both written in same change; sync checklist |

## Rollback Plan

One atomic PR. Revert the commit → restores `demo/`, `vite.config.demo.ts`, old pages.yml. Engine change is purely additive (optional params) — no migration or data impact. Rename revert = package.json metadata only. Storybook is local-only → no deploy surface. Site revert = remove `site/` + restore pages.yml.

## Dependencies

- Storybook 8 + `@storybook/react-vite` (devDependencies); Vite already in the stack (site reuses it); existing Node 20 GH Pages runner

## Success Criteria

- [ ] mono palette output byte-identical to current (diff snapshot)
- [ ] all 22 palettes resolve and render in light & dark
- [ ] `palette="#0ea5e9"` shorthand auto-derives readable dual ramps
- [ ] `registerPalette` + `colors` overlay work; precedence holds
- [ ] `npm run storybook` opens the local controls showcase
- [ ] `site/` builds and deploys to GH Pages; `demo/` gone; CI green
- [ ] README.md + README.es.md shipped in sync; package publishes as `thinking-orbs-colorized@0.2.0`
