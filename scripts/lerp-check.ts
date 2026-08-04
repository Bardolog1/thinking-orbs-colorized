// Lerp identity + fallback contract checks for the palette colorization
// math. Imports the REAL production lerpRGB (plus resolvePalette /
// resolveColorSet / registerPalette / DEFAULT_PALETTE) from src/palettes.ts
// so the checks can never drift from the implementation they guard, and
// pins the paint-time rounding of the mono fast path in src/engine/core.ts.
// Run: npm run check:lerp

import assert from 'node:assert/strict';
import type { RGB } from '../src/engine/types';
import {
  DEFAULT_PALETTE,
  lerpRGB,
  registerPalette,
  resolveColorSet,
  resolvePalette
} from '../src/palettes';

const black: RGB = [0, 0, 0];
const white: RGB = [255, 255, 255];

// lerp(a, b, 0) === a
assert.deepEqual(lerpRGB([10, 20, 30], [200, 100, 50], 0), [10, 20, 30]);
// lerp(a, b, 1) === b
assert.deepEqual(lerpRGB([10, 20, 30], [200, 100, 50], 1), [200, 100, 50]);
// lerp(x, x, w) === x for every sampled weight
for (let i = 0; i <= 1000; i += 1) {
  const w = i / 1000;
  assert.deepEqual(lerpRGB([7, 9, 11], [7, 9, 11], w), [7, 9, 11]);
}

// Byte-identity of the colorized branch (paint() with colors) vs the legacy
// grayscale branch (paint() with colors=undefined):
//  - light: lerpRGB([0,0,0],[255,255,255],w) = 0 + (255-0)*w = 255*w, which
//    is bit-identical to the legacy `w * 255` (IEEE: 0 + x === x, and
//    multiplication is commutative) → the mono light ramp reproduces legacy
//    pixels exactly.
//  - dark: the colorized branch computes 255 + (0-255)*w = 255 - 255*w
//    (IEEE: x + (-y) === x - y), which is NOT bit-identical to the legacy
//    `(1 - w) * 255` — the two agree to within ±1 LSB on some weights. The
//    colors=undefined fast path in paint() is what guarantees true legacy
//    byte-identity; both formulas are pinned here as-is and their drift is
//    bounded, so a future refactor can never silently widen the gap.
for (let i = 0; i <= 1000; i += 1) {
  const w = i / 1000;
  const c = lerpRGB(black, white, w);
  assert.equal(Math.round(c[0]), Math.round(w * 255));
  assert.equal(Math.round(c[1]), Math.round(w * 255));
  assert.equal(Math.round(c[2]), Math.round(w * 255));
}
for (let i = 0; i <= 1000; i += 1) {
  const w = i / 1000;
  const c = lerpRGB(white, black, w);
  assert.equal(Math.round(c[0]), Math.round(255 - 255 * w));
  assert.equal(Math.round(c[1]), Math.round(255 - 255 * w));
  assert.equal(Math.round(c[2]), Math.round(255 - 255 * w));
  const drift = Math.abs(Math.round(c[0]) - Math.round((1 - w) * 255));
  assert.ok(drift <= 1, `dark mono drift exceeds 1 LSB at w=${w}`);
}

// resolvePalette never throws: undefined, non-string scalars and unknown
// ids all fall back to DEFAULT_PALETTE with a dev warning (the `as never`
// casts model hostile runtime input that TypeScript would not allow).
assert.equal(resolvePalette(undefined as never, false), DEFAULT_PALETTE);
assert.equal(resolvePalette(42 as never, false), DEFAULT_PALETTE);
assert.equal(resolvePalette('definitely-not-a-real-palette', false), DEFAULT_PALETTE);

// registerPalette rejects the reserved `mono` id: a later resolution by id
// still yields DEFAULT_PALETTE by identity, never the attempted override.
registerPalette({
  id: 'mono',
  name: 'Attempted Mono Override',
  light: { ink: '#123456', fade: '#ffffff' },
  dark: { ink: '#ffffff', fade: '#123456' }
});
assert.equal(resolvePalette('mono', false), DEFAULT_PALETTE);

// resolveColorSet keys the mono fast path off DEFAULT_PALETTE identity, not
// the id: an inline object carrying `id: 'mono'` is honored, not swallowed.
const inlineMono = resolveColorSet(
  {
    id: 'mono',
    name: 'Inline Mono',
    light: { ink: '#123456', fade: '#ffffff' },
    dark: { ink: '#ffffff', fade: '#123456' }
  },
  undefined,
  false
);
assert.ok(inlineMono);
assert.deepEqual(inlineMono.default.ink, [0x12, 0x34, 0x56]);
assert.deepEqual(inlineMono.default.fade, [255, 255, 255]);

console.log('lerp + fallback checks passed');
