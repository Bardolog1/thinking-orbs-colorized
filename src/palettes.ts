// Palette registry + color resolution. Consumed by ThinkingOrb once per
// mount and by power users (registerPalette / resolvePalette). Resolution
// is always fallback-safe: unknown ids, malformed shorthand and
// unresolvable colors degrade to the mono default with a dev warning and
// never throw. Ramps are resolved to numeric RGB so paint() never parses
// CSS strings per dot.

import type { DotRole, ResolvedRoleColors, RGB } from './engine/types';
import { PALETTE_DATA } from './palette-data';

/** Light/dark ink+fade stops as CSS colors. */
export interface ThemeRamp {
  ink: string;
  fade: string;
}

/** A curated or user-registered palette. */
export interface OrbPalette {
  id: string;
  name: string;
  light: ThemeRamp;
  dark: ThemeRamp;
  /** Per-role ink-stop accents; the fade stop stays the base ramp's. */
  accents?: {
    light?: Partial<Record<DotRole, string>>;
    dark?: Partial<Record<DotRole, string>>;
  };
}

/** Frozen snapshot of the 22 shipped palettes. */
export const PALETTES: readonly OrbPalette[] = Object.freeze(
  PALETTE_DATA.map((p) => Object.freeze(p))
);

/** The mono default: byte-identical to the pre-colorization output. */
export const DEFAULT_PALETTE: OrbPalette =
  PALETTES.find((p) => p.id === 'mono') ?? {
    id: 'mono',
    name: 'Mono',
    light: { ink: '#000000', fade: '#ffffff' },
    dark: { ink: '#ffffff', fade: '#000000' }
  };

const registry = new Map<string, OrbPalette>(PALETTES.map((p) => [p.id, p]));

function devWarn(message: string): void {
  console.warn(`[thinking-orbs] ${message}`);
}

// --- CSS color parsing -------------------------------------------------

// Minimal named-color table (CSS basic 17 + a few common) so resolution
// works without a DOM; unknown names fall back to a cached canvas probe.
const BASIC_NAMES: Record<string, RGB> = {
  aqua: [0, 255, 255],
  black: [0, 0, 0],
  blue: [0, 0, 255],
  brown: [165, 42, 42],
  cyan: [0, 255, 255],
  fuchsia: [255, 0, 255],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  lime: [0, 255, 0],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  navy: [0, 0, 128],
  olive: [128, 128, 0],
  orange: [255, 165, 0],
  pink: [255, 192, 203],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  silver: [192, 192, 192],
  teal: [0, 128, 128],
  violet: [238, 130, 238],
  white: [255, 255, 255],
  yellow: [255, 255, 0]
};

/** Cache of names probed via canvas; one probe per name, total. */
const probeCache = new Map<string, RGB | null>();

/** Resolve a color-name via a 1×1 canvas probe. SSR-safe: no document → null. */
function probeRgb(color: string): RGB | null {
  if (typeof document === 'undefined') return null;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    // an invalid name leaves the pixel transparent; alpha 0 also rules out
    // `transparent` as an ink stop
    if (data[3] === 0) return null;
    return [data[0], data[1], data[2]];
  } catch {
    return null;
  }
}

function hexToRgb(hex: string): RGB | null {
  let h = hex.slice(1);
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (h.length !== 6 && h.length !== 8) return null;
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return null;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function channel(value: string): number | null {
  if (value.endsWith('%')) {
    const p = parseFloat(value);
    return Number.isFinite(p) ? Math.round((p / 100) * 255) : null;
  }
  const n = parseFloat(value);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function parseRgbFn(s: string): RGB | null {
  const m = /^rgba?\(\s*([^)]+)\)$/.exec(s);
  if (!m) return null;
  const parts = m[1].split(/[,\s]+/).filter(Boolean);
  if (parts.length < 3 || parts.length > 4) return null;
  const r = channel(parts[0]);
  const g = channel(parts[1]);
  const b = channel(parts[2]);
  if (r == null || g == null || b == null) return null;
  return [r, g, b];
}

function parseHslFn(s: string): RGB | null {
  const m = /^hsla?\(\s*([^)]+)\)$/.exec(s);
  if (!m) return null;
  const parts = m[1].split(/[,\s]+/).filter(Boolean);
  if (parts.length < 3 || parts.length > 4) return null;
  const h = parseFloat(parts[0]);
  const sat = parseFloat(parts[1]) / 100;
  const light = parseFloat(parts[2]) / 100;
  if (!Number.isFinite(h) || !Number.isFinite(sat) || !Number.isFinite(light)) return null;
  return hslToRgb(h, sat, light);
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

/** Parse a CSS color into numeric RGB; named colors use table + cached probe. */
function cssToRgb(color: string): RGB | null {
  const c = color.trim().toLowerCase();
  if (!c) return null;
  if (c.startsWith('#')) return hexToRgb(c);
  if (c.startsWith('rgb')) return parseRgbFn(c);
  if (c.startsWith('hsl')) return parseHslFn(c);
  const named = BASIC_NAMES[c];
  if (named) return named;
  const cached = probeCache.get(c);
  if (cached !== undefined) return cached;
  const probed = probeRgb(c);
  probeCache.set(c, probed);
  return probed;
}

function toCss(rgb: RGB): string {
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}

/** Per-channel linear mix of two RGB colors, rounded. */
function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ];
}

/**
 * Per-channel linear interpolation between two RGB ramps, unrounded
 * (paint rounds at fill time so `Math.round` happens exactly once).
 */
export function lerpRGB(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function isRamp(r: ThemeRamp | undefined): r is ThemeRamp {
  return (
    !!r &&
    typeof r.ink === 'string' &&
    typeof r.fade === 'string' &&
    cssToRgb(r.ink) !== null &&
    cssToRgb(r.fade) !== null
  );
}

function isValidPalette(p: OrbPalette): boolean {
  return (
    !!p &&
    typeof p === 'object' &&
    typeof p.id === 'string' &&
    p.id.length > 0 &&
    isRamp(p.light) &&
    isRamp(p.dark)
  );
}

/**
 * CSS-color shorthand → a full palette with readable dual ramps: the color
 * keeps its hue, mixed with white for light-fade / dark-ink and black for
 * dark-fade (same-hue doctrine).
 */
function derivePalette(color: string, rgb: RGB): OrbPalette {
  const white: RGB = [255, 255, 255];
  const black: RGB = [0, 0, 0];
  return {
    id: color,
    name: color,
    light: { ink: color, fade: toCss(mix(rgb, white, 0.88)) },
    dark: { ink: toCss(mix(rgb, white, 0.38)), fade: toCss(mix(rgb, black, 0.85)) }
  };
}

/**
 * Resolve a palette by registry id, CSS-color shorthand (auto-derives dual
 * ramps) or inline object. Unknown/malformed input falls back to mono with
 * a dev warning — never throws. `dark` is reserved for symmetry with
 * resolveColorSet; ramps are derived for both themes.
 */
export function resolvePalette(input: string | OrbPalette, dark: boolean): OrbPalette {
  if (typeof input === 'object') {
    if (isValidPalette(input)) return input;
    devWarn(`Invalid palette object; falling back to mono.`);
    return DEFAULT_PALETTE;
  }
  const id = input.trim().toLowerCase();
  const registered = registry.get(id);
  if (registered) return registered;
  const rgb = cssToRgb(id);
  if (rgb) return derivePalette(id, rgb);
  devWarn(`Unknown palette "${input}"; falling back to mono.`);
  return DEFAULT_PALETTE;
}

/**
 * Register a custom palette, resolvable by `palette={id}`. Invalid entries
 * are rejected with a dev warning; re-registering an existing id overwrites
 * it and warns. The frozen PALETTES snapshot is not mutated.
 */
export function registerPalette(p: OrbPalette): void {
  if (!isValidPalette(p)) {
    devWarn(`registerPalette rejected invalid palette "${p?.id ?? '(no id)'}"; not registered.`);
    return;
  }
  if (registry.has(p.id)) {
    devWarn(`registerPalette overwrites existing palette "${p.id}".`);
  }
  registry.set(p.id, p);
}

/**
 * Resolve props into numeric per-role ramps for one theme. Precedence is
 * `colors` (per-role overlay) > `palette` (id/shorthand/object) > mono
 * default. Returns undefined for the plain mono default so paint() keeps
 * its byte-identical grayscale fast path.
 */
export function resolveColorSet(
  palette: string | OrbPalette | undefined,
  colors: Partial<Record<DotRole, string>> | undefined,
  dark: boolean
): ResolvedRoleColors | undefined {
  const hasOverlay = colors != null && Object.keys(colors).length > 0;
  if (palette == null && !hasOverlay) return undefined;
  const base = palette != null ? resolvePalette(palette, dark) : DEFAULT_PALETTE;
  if (base.id === 'mono' && !hasOverlay) return undefined;
  const theme = dark ? base.dark : base.light;
  const ink = cssToRgb(theme.ink);
  const fade = cssToRgb(theme.fade);
  if (!ink || !fade) {
    devWarn(`Palette "${base.id}" has unresolvable colors; falling back to mono.`);
    return undefined;
  }
  const result: ResolvedRoleColors = { default: { ink, fade } };
  const accents = base.accents?.[dark ? 'dark' : 'light'];
  if (accents) {
    for (const role of Object.keys(accents) as DotRole[]) {
      const accent = cssToRgb(accents[role] ?? '');
      if (accent) result[role] = { ink: accent, fade };
    }
  }
  if (colors) {
    for (const role of Object.keys(colors) as DotRole[]) {
      const c = colors[role];
      if (!c) continue;
      const rgb = cssToRgb(c);
      if (rgb) result[role] = { ink: rgb, fade };
      else devWarn(`colors.${role} "${c}" is not a resolvable color; skipped.`);
    }
  }
  return result;
}
