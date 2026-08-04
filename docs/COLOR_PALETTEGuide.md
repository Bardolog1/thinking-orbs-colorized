# Orb Color Palettes — Usage Guide

How to create, register, and resolve custom color palettes with `thinking-orbs-colorized`.

## Overview

The package ships 22 curated palettes (`PALETTES`) plus a reserved default `mono`
(the grayscale fast path — byte-identical to pre-colorization output). Power
users can register their own palettes via `registerPalette` and select any
palette per orb via the `palette` prop (id string, CSS-color shorthand, or an
inline palette object).

Resolution is always fallback-safe: unknown ids, malformed shorthand, and
unresolvable colors degrade to `mono` with a dev-only warning and **never
throw**.

## Palette shape

```ts
interface ThemeRamp {
  ink: string;  // the deep color dots resolve toward
  fade: string; // the pale color dots fade toward
}

interface OrbPalette {
  id: string;
  name: string;
  light: ThemeRamp;
  dark: ThemeRamp;
  accents?: {
    light?: Partial<Record<DotRole, string>>; // per-role ink stops
    dark?: Partial<Record<DotRole, string>>;
  };
}
```

The 22 built-in ids: `mono`, `graphite`, `slate`, `paper`, `ember`, `sunset`,
`aurora`, `ocean`, `arctic`, `nebula`, `ai-gradient`, `mint`, `synthwave`,
`cyberpunk`, `matrix`, `macaron`, `fog`, `forest`, `moss`, `desert`, `holiday`,
`midnight`.

## Creating and registering a palette

```ts
import { registerPalette } from 'thinking-orbs-colorized';

const brand = {
  id: 'brand',
  name: 'Brand',
  light: { ink: '#7c3aed', fade: '#ede9fe' },
  dark: { ink: '#c4b5fd', fade: '#1e1b4b' },
  accents: {
    light: { tail: '#f97316' },
    dark: { tail: '#fb923c' }
  }
};

registerPalette(brand); // now usable via palette="brand"
```

Rules:

- `id` must be a non-empty string; `light`/`dark` ramps must both parse as CSS
  colors, otherwise the palette is **rejected** (no registry mutation) with a
  dev warning.
- `id: 'mono'` is **reserved** — the built-in default cannot be overridden.
- Re-registering an existing id **overwrites** it and warns.
- The frozen `PALETTES` snapshot is never mutated.

## Using a palette on an orb

```tsx
<ThinkingOrb palette="ember" dark={false} />
<ThinkingOrb palette="#0ea5e9" />   {/* CSS shorthand → auto-derived dual ramps */}
<ThinkingOrb palette={inlinePaletteObject} />
```

A CSS-color shorthand keeps its hue and derives readable light/dark ramps by
mixing with white/black (same-hue doctrine).

## Per-role colors overlay

`colors` overrides individual dot roles and takes precedence over `palette`:

```tsx
<ThinkingOrb palette="ocean" colors={{ core: '#ef4444', tail: '#f59e0b' }} />
```

Precedence: `colors` > `palette` > `mono` default.

## Fallback behavior

- Unknown palette id → `mono` + dev warning.
- Non-string, non-object input to `resolvePalette` → `mono` + dev warning.
- Palette with unresolvable colors → `mono` + dev warning.
- Invalid `colors[role]` value → that role is skipped + dev warning.
- SSR-safe: no `document` → named-color lookup falls back to a cached table;
  resolution never throws outside the browser.

## Exports

```ts
import {
  OrbPalette,       // type
  ThemeRamp,        // type
  DotRole,          // type
  PALETTES,         // readonly frozen snapshot of the 22 palettes
  DEFAULT_PALETTE,  // the mono default
  registerPalette,  // add/overwrite a palette by id
  resolvePalette    // id | CSS shorthand | inline object → OrbPalette
} from 'thinking-orbs-colorized';
```

## Bilingual documentation

Palette names and descriptions shipped in the site/API docs carry English and
Spanish (`*_es`) translations; the API surface itself uses English identifiers.
