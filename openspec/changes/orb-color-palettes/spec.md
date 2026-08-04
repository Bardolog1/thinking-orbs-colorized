# Delta Spec: Orb Color Palettes

## ADDED Requirements

### Requirement: Palette registry and model (color-palettes)

The system MUST ship a `PALETTES` registry of 22 curated palettes (mono, graphite, slate, paper, ember, sunset, aurora, ocean, arctic, nebula, ai-gradient, mint, synthwave, cyberpunk, matrix, macaron, fog, forest, moss, desert, holiday, midnight). Each `OrbPalette` MUST expose `{id, name, light:{ink,fade}, dark:{ink,fade}}` and MAY expose `accents`.

#### Scenario: All 22 palettes resolve

- GIVEN the exported PALETTES registry
- WHEN each of the 22 ids is resolved
- THEN a full OrbPalette with light and dark ramps is returned

#### Scenario: Malformed entry rejected

- GIVEN a palette entry missing `dark.ink`
- WHEN resolution validates it
- THEN it falls back to the default palette

### Requirement: Palette resolution and precedence (color-palettes)

The `palette` prop MUST accept a palette id, a CSS-color-string shorthand (`palette="#0ea5e9"`) that auto-derives dual light/dark ramps for contrast, or an inline OrbPalette object. Resolution precedence MUST be `colors > palette > default`.

#### Scenario: CSS shorthand derives dual ramps

- GIVEN `palette="#0ea5e9"`
- WHEN resolved
- THEN readable light and dark ramps are derived from the single color

#### Scenario: colors overlay wins

- GIVEN `palette="ember"` and `colors={{particle:"#f00"}}`
- WHEN rendering
- THEN the particle role uses `#f00` and remaining roles keep ember

### Requirement: Mono identity (color-palettes)

The mono palette MUST reproduce current output byte-identically (light ramp `{#000,#fff}`, dark ramp `{#fff,#000}`), and the `dark` prop MUST remain the fallback when colors are absent.

#### Scenario: Byte-identical mono output

- GIVEN default props with no palette or colors
- WHEN rendered
- THEN output matches a snapshot of the pre-change build

### Requirement: Depth-preserving ramps and role accents (color-palettes)

Per theme, dot color MUST be `lerp(ink, fade, w)` where `w` is depth; per-role accents (`ghost | particle | field | active | band | outline`) MUST override the ink stop while fade preserves depth. RGB ramps MUST be precomputed once per mount.

#### Scenario: Accent overrides ink stop

- GIVEN a dot with `role="active"` and an active accent
- WHEN painted at depth `w`
- THEN color equals `lerp(accent, fade, w)`

#### Scenario: Cross-hue contrast QA

- GIVEN same-hue tint/shade stops in a curated palette
- WHEN rendered in light and dark
- THEN both themes remain readable at 20px dot scale

### Requirement: registerPalette extensibility (color-palettes)

`registerPalette` MUST accept an OrbPalette and make it resolvable by id. Invalid entries MUST be rejected with a dev-only warning.

#### Scenario: Custom palette usable by id

- GIVEN `registerPalette({id:"brand", ...})`
- WHEN `palette="brand"`
- THEN the custom ramps are used

#### Scenario: Duplicate id overwrites

- GIVEN an id already in PALETTES
- WHEN registered again
- THEN the new entry replaces it and a dev warning is emitted

### Requirement: Invalid-input fallback (color-palettes)

Unknown ids, malformed shorthand, or unresolvable colors MUST fall back to the mono default and emit a dev-only warning; MUST NOT throw.

#### Scenario: Unknown palette id

- GIVEN `palette="not-a-palette"`
- WHEN resolved
- THEN mono is used and a dev warning is logged

### Requirement: SSR-safe color-name resolution (color-palettes)

CSS color-name parsing MUST use a one-time, cached canvas probe and MUST be safe when `document` is unavailable.

#### Scenario: Server render without document

- GIVEN no `document`/canvas available
- WHEN a color name resolves
- THEN cached/fallback values are returned without throwing

#### Scenario: Probe cached

- GIVEN a color name resolved once
- WHEN resolved again
- THEN the cached result is reused (single probe total)

### Requirement: Non-breaking colors threading (engine-colorization)

`ModeDraw` and `paint` MUST accept an optional trailing `colors?` parameter. When absent, the mono path MUST remain byte-identical. `colors` MUST NOT enter numeric `ModeOpts`.

#### Scenario: Colors absent

- GIVEN a mode draw without colors
- THEN output equals the pre-change mono output

#### Scenario: Colors present

- GIVEN colors supplied to a mode draw
- THEN dots paint with resolved per-role colors

### Requirement: Dot role tagging (engine-colorization)

Mode files MUST emit optional `Dot.role?` per the verified mode implementations in `src/engine/`: lattice.ts (globe/rubik/wave) → field+active; orbits.ts → ghost+particle; ribbon.ts → ghost+band; morph.ts → outline. Untagged dots MUST use the default ink ramp.

#### Scenario: Roles forwarded to paint

- GIVEN a mode emitting roles and colors provided
- WHEN drawing
- THEN each dot paints with its role color

### Requirement: Reduced-motion path (engine-colorization)

The static reduced-motion frame MUST continue flowing through `draw` with colors applied.

#### Scenario: prefers-reduced-motion

- GIVEN reduced motion enabled and a palette
- THEN the static frame renders colorized

### Requirement: Local Storybook showcase (storybook-showcase)

The package MUST include `@storybook/react-vite` with controls/args for state, size, theme, speed, paused, palette, and colors, plus docs mode. `npm run storybook` MUST launch it. Storybook MUST be devDependencies-only and MUST NOT appear in any deploy workflow.

#### Scenario: Controls drive the orb

- GIVEN Storybook running locally
- WHEN a control changes (e.g., palette)
- THEN the story re-renders with the new value

#### Scenario: All palettes shown

- GIVEN the palettes story
- THEN all 22 palettes are listed with a light/dark toggle

#### Scenario: No deploy surface

- GIVEN pages.yml and CI workflows
- THEN no Storybook build step exists

### Requirement: Product site structure (product-site)

`site/` MUST be a static Vite app with fixed v1 sections: hero; interactive live demo; 22-palette gallery with light/dark toggle; API docs (props incl. palette, colors, registerPalette); install + quick start; Storybook link. The library build MUST remain untouched.

The interactive live demo MUST be built from the existing Playground component, migrated from the `demo/` Vite app into `site/` rather than deleted, and MUST retain its useful UX (state, size, speed, paused selector controls) extended with the new color controls (palette, colors, theme). SimpleApp, Examples, and useTheme MAY be absorbed or dropped as the site design dictates, but the Playground UX MUST be retained and enhanced.

#### Scenario: Site builds standalone

- GIVEN `npm run build:site`
- THEN `site/dist` is produced and the library build is unaffected

#### Scenario: Playground controls preserved and extended

- GIVEN the live demo section built from the migrated Playground
- THEN the state, size, speed, and paused controls remain functional
- AND palette, colors, and theme selectors are added alongside them

#### Scenario: Demo is interactive

- GIVEN the live demo section
- WHEN palette or theme changes
- THEN the orb updates in place

### Requirement: GitHub Pages deployment (product-site)

`pages.yml` MUST be repointed to build and deploy `site/dist`. The standalone `demo/` Vite app MUST be superseded by `site/` as the showcase; its Playground component MUST be migrated into the site's live demo (not deleted), and CI MUST stay green.

#### Scenario: Deploy succeeds

- GIVEN a push to main
- THEN Pages deploys the site and CI passes
- AND the Playground remains available as the deployed site's live demo

### Requirement: Bilingual docs (bilingual-docs)

README.md (EN) and README.es.md (ES, neutral/professional) MUST ship in the same change, linked from README top, and kept in sync. Both MUST cover existing content (states, sizes, theme, other props, accessibility, performance), the new color features, the rename to `thinking-orbs-colorized`, the new site URL, and the local Storybook workflow. package.json MUST update name/homepage/description/keywords to 0.2.0.

#### Scenario: Docs in sync

- GIVEN both files at release
- THEN every EN section has an ES equivalent

#### Scenario: Metadata updated

- GIVEN package.json at 0.2.0
- THEN name, homepage, description, and keywords reference the new package and site

## Non-Requirements (explicitly OUT)

- Visual tests / Storybook addons: OUT (future work)
- Canvas gradients, filters, WebGL: OUT (plain-fill cross-browser doctrine)
- Upstream PR to the original project: OUT
- Performance tuning: OUT (per-dot cost is 3 mults/channel; negligible at 100–600 dots)
- Full test infrastructure: OUT (zero tests today; an optional minimal lerp identity-property test MAY be added)
- OKLCH or other color-space lerp: OUT (later change)
