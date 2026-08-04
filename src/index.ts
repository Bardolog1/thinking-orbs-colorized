export { ThinkingOrb } from './ThinkingOrb';

export type { ThinkingOrbProps, OrbState, OrbSize, OrbTheme } from './types';

// Power-user surface: the resolved presets + raw frame painters, for
// consumers driving their own canvas outside React.
export { resolvePreset, STATE_TO_MODE, type ModeKey, type Resolved } from './presets';
export { MODE_DRAWS } from './engine/registry';

// Palette surface: curated + custom palettes for the `palette` prop.
export { PALETTES, DEFAULT_PALETTE, registerPalette, resolvePalette } from './palettes';
export type { OrbPalette, ThemeRamp } from './palettes';
export type { DotRole } from './engine/types';
