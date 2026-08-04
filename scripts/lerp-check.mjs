// Lerp identity checks for the palette colorization math (zero deps).
// Mirrors src/palettes.ts lerpRGB plus the paint-time rounding in
// src/engine/core.ts. Run: npm run check:lerp

import assert from 'node:assert/strict';

const lerp = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t
];

const round = (v) => Math.round(v);

// lerp(a, b, 0) === a
assert.deepEqual(lerp([10, 20, 30], [200, 100, 50], 0), [10, 20, 30]);
// lerp(a, b, 1) === b
assert.deepEqual(lerp([10, 20, 30], [200, 100, 50], 1), [200, 100, 50]);
// lerp(x, x, w) === x
assert.deepEqual(lerp([7, 9, 11], [7, 9, 11], 0.37), [7, 9, 11]);

// mono light: ink #000, fade #fff → Math.round(w * 255), matching the
// legacy grayscale formula in core.ts paint() for light themes
for (const w of [0, 0.25, 0.5, 0.75, 1]) {
  const c = lerp([0, 0, 0], [255, 255, 255], w);
  assert.equal(round(c[0]), Math.round(w * 255));
}

// mono dark: ink #fff, fade #000 → Math.round((1 - w) * 255)
for (const w of [0, 0.25, 0.5, 0.75, 1]) {
  const c = lerp([255, 255, 255], [0, 0, 0], w);
  assert.equal(round(c[0]), Math.round((1 - w) * 255));
}

console.log('lerp checks passed');
