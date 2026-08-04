// Engine-level contracts shared by every mode implementation.

import type { ModeOpts } from './profiles';

export type { Dot } from './core';

/** Which visual population a dot belongs to — used for per-role color accents. */
export type DotRole = 'ghost' | 'particle' | 'field' | 'active' | 'band' | 'outline';

/** An RGB triplet, 0–255 per channel. */
export type RGB = readonly [number, number, number];

/** Ink→fade ramp stops as numeric RGB; dot color = lerp(ink, fade, depth). */
export interface RoleRamp {
  ink: RGB;
  fade: RGB;
}

/**
 * Resolved per-role color ramps, precomputed once per mount. `default`
 * paints untagged dots; role keys override the ink stop for their role
 * while the fade stop (depth) stays the base ramp's.
 */
export type ResolvedRoleColors = { default: RoleRamp } & Partial<Record<DotRole, RoleRamp>>;

/** One frame painter: draws a mode into a 2D context at CSS-px `size`. */
export type ModeDraw = (
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  opts: ModeOpts,
  colors?: ResolvedRoleColors
) => void;
