const PROPS: Array<{
  name: string;
  type: string;
  default: string;
  desc: string;
}> = [
  {
    name: 'state',
    type: "'working' | 'searching' | 'solving' | 'listening' | 'composing' | 'shaping'",
    default: "'working'",
    desc: 'Which hand-tuned animation to show.'
  },
  {
    name: 'size',
    type: '64 | 20',
    default: '64',
    desc: 'Tuned CSS-px preset — chat-avatar (64) or inline-text (20) scale.'
  },
  {
    name: 'theme',
    type: "'auto' | 'dark' | 'light'",
    default: "'auto'",
    desc: '`auto` resolves from an ancestor `data-theme`/class, else `prefers-color-scheme`.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    desc: 'Animation speed multiplier on top of the preset pacing.'
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    desc: 'Freeze the animation on the current frame.'
  },
  {
    name: 'palette',
    type: 'string | OrbPalette',
    default: 'undefined (mono)',
    desc: 'A curated palette id, a CSS-color shorthand (dual ramps auto-derived), or an inline palette object. Omit for classic mono.'
  },
  {
    name: 'colors',
    type: 'Partial<Record<DotRole, string>>',
    default: 'undefined',
    desc: 'Per-role ink overlay, e.g. `{ particle: "#ff6b6b" }`. Wins over `palette` accents for listed roles.'
  }
];

const ROLES: Array<{ name: string; desc: string }> = [
  { name: 'ghost', desc: 'Faint background drift' },
  { name: 'particle', desc: 'Dots on tilted orbits' },
  { name: 'field', desc: 'Dotted globe fill' },
  { name: 'active', desc: 'Scan / signal emphasis' },
  { name: 'band', desc: 'Latitude rings / sash' },
  { name: 'outline', desc: 'Shape outline' }
];

/** Static API reference rendered from the real prop surface. */
export function ApiDocs() {
  return (
    <section className="w-full flex flex-col gap-4" aria-label="API documentation">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-base font-normal leading-[34px] text-(--section-title-color)">API</h2>
        <p className="text-sm leading-[21px] text-(--text-muted)">
          The full prop surface of <code className="font-[Roboto_Mono,monospace] text-[13px]">ThinkingOrb</code>.
        </p>
      </div>

      <div className="rounded-[10px] bg-(--panel-bg) overflow-hidden">
        <div className="flex flex-col">
          {PROPS.map((p) => (
            <div
              key={p.name}
              className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-1 px-4 py-3 border-t border-(--surface) first:border-t-0 max-sm:grid-cols-1"
            >
              <code className="font-[Roboto_Mono,monospace] text-[13px] leading-[18px] text-(--section-title-color)">
                {p.name}
              </code>
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-[13px] leading-[18px] text-(--text-muted)">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  <code className="font-[Roboto_Mono,monospace] text-[11px] leading-[14px] text-(--footer-muted)">
                    {p.type}
                  </code>
                  <code className="font-[Roboto_Mono,monospace] text-[11px] leading-[14px] text-(--text-muted)">
                    default: {p.default}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-sm font-normal leading-[20px] text-(--section-title-color) pt-2">
        Dot roles (for <code className="font-[Roboto_Mono,monospace] text-[13px]">colors</code>)
      </h3>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-2 max-sm:grid-cols-1">
        {ROLES.map((r) => (
          <li key={r.name} className="flex gap-2 min-w-0">
            <code className="font-[Roboto_Mono,monospace] text-[12px] leading-[18px] text-(--section-title-color) shrink-0">
              {r.name}
            </code>
            <span className="text-[13px] leading-[18px] text-(--text-muted)">{r.desc}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
