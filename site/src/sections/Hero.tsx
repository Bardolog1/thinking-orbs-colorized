import { ThinkingOrb, type OrbState } from 'thinking-orbs-colorized';

const listeningPillClass =
  'inline-flex items-center gap-3 w-[270px] h-[74px] pl-[9px] pr-8 rounded-full bg-(--pill-fill) shadow-(--pill-stroke) text-(--pill-fg) text-lg leading-6 font-inherit cursor-default';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const chipClass =
  'inline-flex items-center gap-2 h-9 pl-2 pr-3.5 rounded-full bg-(--pill-fill) shadow-(--pill-stroke) text-(--pill-fg) text-xs leading-[14px] font-inherit cursor-default';

const CHIP_STATES: OrbState[] = ['listening', 'working', 'searching', 'shaping'];

// Chip states that render as full large pills (the rest stay compact).
const LARGE_CHIPS = new Set<OrbState>(['working', 'searching']);

const surfaceClass = 'bg-(--hero-surface)';

export function Hero() {
  return (
    <section className="w-full flex flex-col items-center gap-10" aria-label="Product introduction">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="max-w-[22ch] text-4xl sm:text-5xl font-medium leading-[1.08] tracking-tight text-(--heading-fg)">
          Thought orbs for <span className="t-wordmark">agent UIs</span>
        </h2>
        <p className="max-w-[38rem] text-sm sm:text-base leading-6 text-(--text-muted)">
          22 curated palettes — drop them into any loading, waiting, or agent-thinking surface. No
          WebGL, no filters, no dependencies.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* The component itself — no scaffolding around it. */}
        <div
          className={`relative w-full min-h-[420px] rounded-[32px] ${surfaceClass} t-hero-glow flex items-center justify-center overflow-hidden max-sm:min-h-[260px] max-sm:rounded-[20px]`}
        >
          <ThinkingOrb state="working" size={64} style={{ width: 120, height: 120 }} palette="ocean" />
        </div>

        {/* Case examples. Row-spans (not CSS multi-column) so the mixed-height boxes
            tile with no gaps AND render correctly in Safari. Auto-rows of 151px → a
            2-row span is 314px (large pill), a 1-row span is 151px (compact chip). */}
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
      </div>
    </section>
  );
}
