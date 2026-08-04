// The 22 curated palettes. Each entry is a same-hue ink→fade pair per
// theme: light substrate gets dark ink on a pale fade, dark substrate gets
// light ink on a deep fade. `mono` reproduces the pre-colorization output
// byte-identically. Accents paint selected roles at a second hue while the
// fade stop (depth) stays the base ramp's. Data only — logic in palettes.ts.

import type { DotRole } from './engine/types';
import type { OrbPalette } from './palettes';

/** Build a light/dark accent set applying one hue to the given roles. */
function accents(roles: readonly DotRole[], light: string, dark: string): NonNullable<OrbPalette['accents']> {
  const lightSet: Partial<Record<DotRole, string>> = {};
  const darkSet: Partial<Record<DotRole, string>> = {};
  for (const role of roles) {
    lightSet[role] = light;
    darkSet[role] = dark;
  }
  return { light: lightSet, dark: darkSet };
}

export const PALETTE_DATA: readonly OrbPalette[] = [
  { id: 'mono', name: 'Mono', light: { ink: '#000000', fade: '#ffffff' }, dark: { ink: '#ffffff', fade: '#000000' } },
  { id: 'graphite', name: 'Graphite', light: { ink: '#454a54', fade: '#eaeaeb' }, dark: { ink: '#afb5c0', fade: '#1f2023' } },
  { id: 'slate', name: 'Slate', light: { ink: '#385275', fade: '#e8eaee' }, dark: { ink: '#97b2d8', fade: '#1a2028' } },
  { id: 'paper', name: 'Paper', light: { ink: '#725b3b', fade: '#f6f5f4' }, dark: { ink: '#ebe2d6', fade: '#2d251b' } },
  { id: 'ember', name: 'Ember', light: { ink: '#8b3d23', fade: '#f0e8e6' }, dark: { ink: '#f4997b', fade: '#2e1b14' }, accents: accents(['active', 'particle', 'outline'], '#b4222e', '#f9868f') },
  { id: 'sunset', name: 'Sunset', light: { ink: '#8b5323', fade: '#f0eae6' }, dark: { ink: '#f4b47b', fade: '#2e2014' }, accents: accents(['active', 'particle', 'band', 'outline'], '#b4225f', '#f986b6') },
  { id: 'aurora', name: 'Aurora', light: { ink: '#238b68', fade: '#e6f0ec' }, dark: { ink: '#7bf4cc', fade: '#142e26' }, accents: accents(['active', 'particle', 'band'], '#22a1b4', '#86e9f9') },
  { id: 'ocean', name: 'Ocean', light: { ink: '#23578b', fade: '#e6ebf0' }, dark: { ink: '#7bb8f4', fade: '#14212e' }, accents: accents(['active', 'particle', 'band'], '#22a5b4', '#86edf9') },
  { id: 'arctic', name: 'Arctic', light: { ink: '#297ea3', fade: '#e6edf0' }, dark: { ink: '#7bd0f4', fade: '#14262e' }, accents: accents(['active', 'particle'], '#2283b4', '#86d2f9') },
  { id: 'nebula', name: 'Nebula', light: { ink: '#49238b', fade: '#e9e6f0' }, dark: { ink: '#a77bf4', fade: '#1e142e' }, accents: accents(['active', 'particle', 'outline'], '#b42288', '#f986d6') },
  { id: 'ai-gradient', name: 'AI Gradient', light: { ink: '#53238b', fade: '#eae6f0' }, dark: { ink: '#b47bf4', fade: '#20142e' }, accents: accents(['active', 'particle', 'band', 'outline'], '#b4227f', '#f986cf') },
  { id: 'mint', name: 'Mint', light: { ink: '#238b5a', fade: '#e6f0eb' }, dark: { ink: '#7bf4bc', fade: '#142e22' }, accents: accents(['active', 'particle'], '#66b422', '#bbf986') },
  { id: 'synthwave', name: 'Synthwave', light: { ink: '#8b2376', fade: '#f0e6ee' }, dark: { ink: '#f47bdc', fade: '#2e1429' }, accents: accents(['active', 'particle', 'band', 'outline'], '#22a3b4', '#86ebf9') },
  { id: 'cyberpunk', name: 'Cyberpunk', light: { ink: '#8b238b', fade: '#f0e6f0' }, dark: { ink: '#f47bf4', fade: '#2e142e' }, accents: accents(['active', 'particle', 'band', 'outline'], '#22afb4', '#86f5f9') },
  { id: 'matrix', name: 'Matrix', light: { ink: '#238b23', fade: '#e6f0e6' }, dark: { ink: '#7bf47b', fade: '#142e14' }, accents: accents(['active', 'particle', 'band'], '#83b422', '#d2f986') },
  { id: 'macaron', name: 'Macaron', light: { ink: '#7b324b', fade: '#f5f0f1' }, dark: { ink: '#df90ab', fade: '#2a181e' }, accents: accents(['active', 'particle'], '#5822b4', '#b086f9') },
  { id: 'fog', name: 'Fog', light: { ink: '#546978', fade: '#eef0f1' }, dark: { ink: '#a8bac7', fade: '#242a2e' }, accents: accents(['active', 'particle'], '#225fb4', '#86b6f9') },
  { id: 'forest', name: 'Forest', light: { ink: '#238b3d', fade: '#e6f0e8' }, dark: { ink: '#7bf499', fade: '#142e1b' }, accents: accents(['active', 'particle'], '#53b422', '#acf986') },
  { id: 'moss', name: 'Moss', light: { ink: '#5f8b23', fade: '#ebf0e6' }, dark: { ink: '#c2f47b', fade: '#232e14' }, accents: accents(['active', 'particle'], '#a8b422', '#eff986') },
  { id: 'desert', name: 'Desert', light: { ink: '#8b6523', fade: '#f0ece6' }, dark: { ink: '#f4c87b', fade: '#2e2514' }, accents: accents(['active', 'particle', 'band'], '#b43f22', '#f99d86') },
  { id: 'holiday', name: 'Holiday', light: { ink: '#8b2331', fade: '#f0e6e7' }, dark: { ink: '#f47b8b', fade: '#2e1417' }, accents: accents(['active', 'particle', 'band', 'outline'], '#22b453', '#86f9ac') },
  { id: 'midnight', name: 'Midnight', light: { ink: '#23238b', fade: '#e6e6f0' }, dark: { ink: '#9797f7', fade: '#14142e' }, accents: accents(['active', 'particle', 'outline'], '#2277b4', '#86c9f9') }
];
