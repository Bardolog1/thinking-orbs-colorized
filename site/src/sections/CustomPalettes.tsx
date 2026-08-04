import type { ReactNode } from 'react';
import { registerPalette, ThinkingOrb, type OrbState } from 'thinking-orbs-colorized';

// Registered once at module scope so any orb in the app can use palette="brand".
registerPalette({
  id: 'brand',
  name: 'Brand',
  light: { ink: '#7c3aed', fade: '#ede9fe' },
  dark: { ink: '#c4b5fd', fade: '#1e1b4b' },
  accents: {
    light: { active: '#a78bfa', particle: '#7c3aed' },
    dark: { active: '#a78bfa', particle: '#c4b5fd' }
  }
});

const INLINE_PALETTE = `{
  id: 'brand',
  name: 'Brand',
  light: { ink: '#0d9488', fade: '#f0fdfa' },
  dark: { ink: '#5eead4', fade: '#042f2e' }
}`;

const EXAMPLES: Array<{
  title: string;
  desc: string;
  state: OrbState;
  render: () => ReactNode;
  snippet: string;
}> = [
  {
    title: 'Register a reusable palette',
    desc: 'Register once, reuse anywhere by id. Invalid entries are rejected in dev; the mono id is reserved.',
    state: 'working',
    render: () => <ThinkingOrb state="working" palette="brand" />,
    snippet: `import { registerPalette, ThinkingOrb } from 'thinking-orbs-colorized';

registerPalette({
  id: 'brand',
  name: 'Brand',
  light: { ink: '#7c3aed', fade: '#ede9fe' },
  dark: { ink: '#c4b5fd', fade: '#1e1b4b' },
  accents: {
    light: { active: '#a78bfa', particle: '#7c3aed' },
    dark: { active: '#a78bfa', particle: '#c4b5fd' }
  }
});

<ThinkingOrb state="working" palette="brand" />`
  },
  {
    title: 'Inline palette object',
    desc: 'No registry needed — pass a palette object straight into the prop.',
    state: 'searching',
    render: () => (
      <ThinkingOrb
        state="searching"
        palette={{
          id: 'brand',
          name: 'Brand',
          light: { ink: '#0d9488', fade: '#f0fdfa' },
          dark: { ink: '#5eead4', fade: '#042f2e' }
        }}
      />
    ),
    snippet: `import { ThinkingOrb } from 'thinking-orbs-colorized';

<ThinkingOrb state="searching" palette={${INLINE_PALETTE}} />`
  },
  {
    title: 'CSS color shorthand',
    desc: 'Pass any CSS color — dual light/dark ramps are derived automatically.',
    state: 'composing',
    render: () => <ThinkingOrb state="composing" palette="#0ea5e9" />,
    snippet: `import { ThinkingOrb } from 'thinking-orbs-colorized';

<ThinkingOrb state="composing" palette="#0ea5e9" />`
  },
  {
    title: 'Per-role colors overlay',
    desc: 'The colors prop repaints individual dot roles on top of any palette — for the listed roles it wins over the palette accent, and the fade stop stays the base ramp.',
    state: 'shaping',
    render: () => (
      <ThinkingOrb state="shaping" palette="ocean" colors={{ active: '#ef4444', particle: '#f59e0b' }} />
    ),
    snippet: `import { ThinkingOrb } from 'thinking-orbs-colorized';

<ThinkingOrb
  state="shaping"
  palette="ocean"
  colors={{ active: '#ef4444', particle: '#f59e0b' }}
/>`
  }
];

export function CustomPalettes() {
  return (
    <section className="w-full flex flex-col gap-4" aria-label="Custom palettes">
      <div className="flex flex-col gap-1.5">
        <h2 className="flex items-center gap-2 text-base font-normal leading-[34px] text-(--section-title-color)">
          <span className="t-title-mark" aria-hidden="true" />
          Custom palettes
        </h2>
        <p className="text-sm leading-[21px] text-(--text-muted)">
          Three ways to bring your own color: register a reusable palette by id, pass an inline
          palette object, or hand a plain CSS color. On top of that,{' '}
          <code className="font-[Roboto_Mono,monospace] text-[13px]">colors</code> overrides
          individual dot roles —{' '}
          <em>
            <code className="font-[Roboto_Mono,monospace] text-[13px]">colors</code> wins over
            the palette accent for those roles
          </em>
          , while the depth (fade) stop always stays the base ramp.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {EXAMPLES.map((example) => (
          <div
            key={example.title}
            className="grid grid-cols-[1fr_180px] gap-3 items-stretch rounded-[10px] bg-(--panel-bg) p-4 max-sm:grid-cols-1"
          >
            <div className="flex flex-col gap-2 min-w-0">
              <h3 className="text-sm font-normal leading-[20px] text-(--section-title-color)">
                {example.title}
              </h3>
              <p className="text-[13px] leading-[18px] text-(--text-muted)">{example.desc}</p>
              <div className="rounded-[10px] bg-(--code-bg) p-4 overflow-x-auto">
                <code className="font-[Roboto_Mono,monospace] text-[13px] leading-[22px] text-(--code-text) whitespace-pre block">
                  {example.snippet}
                </code>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-[10px] bg-(--surface) min-h-[140px] max-sm:min-h-[120px]">
              {example.render()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
