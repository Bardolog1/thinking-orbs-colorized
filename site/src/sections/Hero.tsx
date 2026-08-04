import { ThinkingOrb, type OrbState } from 'thinking-orbs-colorized';

const listeningPillClass =
  'inline-flex items-center gap-3 w-[270px] h-[74px] pl-[9px] pr-8 rounded-full bg-(--pill-fill) shadow-(--pill-stroke) text-(--pill-fg) text-lg leading-6 font-inherit cursor-default';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const chipClass =
  'inline-flex items-center gap-2 h-9 pl-2 pr-3.5 rounded-full bg-(--pill-fill) shadow-(--pill-stroke) text-(--pill-fg) text-xs leading-[14px] font-inherit cursor-default';

const CHIP_STATES: OrbState[] = ['listening', 'working', 'searching', 'shaping'];

// Chip states that render as full large pills (the rest stay compact).
const LARGE_CHIPS = new Set<OrbState>(['working', 'searching']);

const HERO_PILLS: Array<{ state: OrbState; label: string }> = [
  { state: 'solving', label: 'Solving….' },
  { state: 'composing', label: 'Thinking….' },
];

const surfaceClass = 'bg-(--hero-surface)';

export function Hero() {
  return (
    <section className="w-full flex flex-col gap-3" aria-label="Component demonstrations">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-(--section-title-muted)">
          Animated thinking orbs
        </p>
        <h2 className="text-2xl font-medium leading-8 text-(--heading-fg)">
          Thought orbs for agent UIs
        </h2>
        <p className="max-w-[34rem] text-sm leading-6 text-(--text-muted)">
          Six hand-tuned states, two sizes, and 22 curated palettes — drop them into any loading,
          waiting, or agent-thinking surface.
        </p>
      </div>

      {/* Two hero pill mocks, side by side */}
      <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        {HERO_PILLS.map(({ state, label }) => (
          <div
            key={state}
            className={`relative w-full h-[314px] rounded-[30px] ${surfaceClass} flex items-center justify-center px-10 py-12 overflow-hidden max-sm:h-auto max-sm:min-h-[200px] max-sm:px-5 max-sm:py-8 max-sm:rounded-[20px]`}
          >
            <div className={listeningPillClass}>
              <ThinkingOrb state={state} size={64} style={{ width: 56, height: 56 }} />
              <span className="t-shimmer" data-text={label}>
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Grid with row-spans (not CSS multi-column) so the mixed-height boxes
          tile with no gaps AND render correctly in Safari, which mishandles
          `break-inside: avoid` on fixed-height multicol items. Auto-rows of
          151px → a 2-row span is 314px (large), a 1-row span is 151px. */}
      <div className="grid grid-cols-2 gap-3 [grid-auto-rows:151px] max-sm:grid-cols-1 max-sm:auto-rows-auto">
        {CHIP_STATES.map((state) => {
          const large = LARGE_CHIPS.has(state);
          const label = large ? `${cap(state)}….` : `Agent ${state}…`;
          return (
            <div
              key={state}
              className={`relative w-full ${large ? 'row-span-2' : 'row-span-1'} rounded-[30px] ${surfaceClass} flex items-center justify-center px-8 py-8 overflow-hidden max-sm:row-auto max-sm:h-auto max-sm:min-h-[200px] max-sm:rounded-[20px]`}
            >
              <div className={large ? listeningPillClass : chipClass}>
                {large ? (
                  <ThinkingOrb state={state} size={64} style={{ width: 56, height: 56 }} />
                ) : (
                  <ThinkingOrb state={state} size={20} />
                )}
                <span className="t-shimmer" data-text={label}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
