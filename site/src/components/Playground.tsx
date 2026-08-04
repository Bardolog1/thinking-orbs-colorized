import { useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import type { DotRole, OrbSize, OrbState } from 'thinking-orbs-colorized';
import { PALETTES, ThinkingOrb } from 'thinking-orbs-colorized';
import type { Theme } from '../hooks/useTheme';
import { cn } from '../lib/cn';
import { CopyButton } from './CopyButton';
import { ChevronDownIcon } from './icons';
import { PaletteSwatch } from './PaletteSwatch';
import { PlayPauseToggle } from './PlayPauseToggle';

const STATES: OrbState[] = ['working', 'searching', 'solving', 'listening', 'composing', 'shaping'];
const SIZES: OrbSize[] = [64, 20];
const THEMES: Theme[] = ['auto', 'dark', 'light'];
const ROLES: DotRole[] = ['ghost', 'particle', 'field', 'active', 'band', 'outline'];

const SPEED_MIN = 25;
const SPEED_MAX = 300;

function buildSnippet(
  state: OrbState,
  size: OrbSize,
  speed: number,
  palette: string,
  colors: Partial<Record<DotRole, string>>,
  theme: Theme
) {
  const props = [`state="${state}"`, `size={${size}}`];
  if (speed !== 100) props.push(`speed={${(speed / 100).toFixed(2)}}`);
  if (palette !== 'mono') props.push(`palette="${palette}"`);
  const entries = Object.entries(colors).filter(
    (entry): entry is [DotRole, string] => typeof entry[1] === 'string' && entry[1].length > 0
  );
  if (entries.length > 0) {
    const inner = entries.map(([role, value]) => `${role}: '${value}'`).join(', ');
    props.push(`colors={{ ${inner} }}`);
  }
  if (theme !== 'auto') props.push(`theme="${theme}"`);
  return `import { ThinkingOrb } from 'thinking-orbs-colorized';\n\n<ThinkingOrb ${props.join(' ')} />`;
}

const tabBtnBase =
  'flex items-center justify-center h-9 px-3 border-none rounded-lg font-[Inter,sans-serif] text-[13px] font-normal leading-[14px] cursor-pointer transition-[background-color,color] duration-150 whitespace-nowrap [-webkit-tap-highlight-color:transparent] hover:bg-(--tab-hover-bg) hover:text-(--tab-hover-color) focus-visible:outline-2 focus-visible:outline-[rgba(255,255,255,0.5)] focus-visible:outline-offset-2';

function TabBtn({ active, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      {...props}
      className={cn(
        tabBtnBase,
        active
          ? 'bg-(--tab-active-bg) text-(--tab-active-color) shadow-(--tab-active-shadow)'
          : 'bg-(--tab-bg) text-(--tab-color)'
      )}
      type="button"
    />
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const labelClass = 'text-xs font-normal leading-[14px] text-(--text-muted)';

export function Playground({
  theme,
  onThemeChange,
}: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}) {
  const [state, setState] = useState<OrbState>('listening');
  const [size, setSize] = useState<OrbSize>(64);
  // Speed stays local to the Playground — the surrounding sections have
  // their own baked pacing, so nothing else consumes it.
  const [speed, setSpeed] = useState(100);
  // Starts paused so the page loads quietly; the PlayPauseToggle below only
  // flips this local state.
  const [paused, setPaused] = useState(true);
  const [palette, setPalette] = useState('mono');
  const [colors, setColors] = useState<Partial<Record<DotRole, string>>>({});
  const [showColors, setShowColors] = useState(false);

  const snippet = buildSnippet(state, size, speed, palette, colors, theme);
  const fillPct = ((speed - SPEED_MIN) / (SPEED_MAX - SPEED_MIN)) * 100;
  const selectedPalette = PALETTES.find((p) => p.id === palette);
  const effectiveDark =
    theme === 'dark' ||
    (theme === 'auto' &&
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="flex flex-col gap-4 bg-(--panel-bg) rounded-[10px] p-4">
      <div className="flex items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
        <div className="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="Orb state">
          <span className={labelClass}>State</span>
          <div className="flex gap-2 items-center flex-wrap">
            {STATES.map((s) => (
              <TabBtn key={s} active={state === s} onClick={() => setState(s)}>
                {cap(s)}
              </TabBtn>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
        <div className="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="Orb size">
          <span className={labelClass}>Size</span>
          <div className="flex gap-2 items-center">
            {SIZES.map((s) => (
              <TabBtn key={s} active={size === s} onClick={() => setSize(s)}>
                {s}px
              </TabBtn>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[9px] min-w-[100px] w-[140px] max-sm:w-full">
          <span className={labelClass}>Speed</span>
          <div className="strength-track relative w-full h-9 rounded-lg bg-(--strength-bg) shadow-(--strength-shadow) overflow-hidden cursor-grab active:cursor-grabbing hover:bg-(--strength-hover)">
            <div
              className="absolute top-0 left-0 bottom-0 rounded-lg bg-(--strength-fill-bg) shadow-(--strength-shadow) transition-[width] duration-[80ms] ease-out pointer-events-none"
              style={{ width: `${fillPct}%` }}
            />
            <span className="absolute top-0 left-[11px] h-full flex items-center text-[11px] font-normal leading-[14px] text-(--text-muted) whitespace-nowrap pointer-events-none z-[1]">
              {(speed / 100).toFixed(2)}×
            </span>
            <input
              className="strength-input appearance-none absolute inset-0 w-full h-full m-0 p-0 bg-transparent cursor-grab opacity-0 z-[2] active:cursor-grabbing"
              type="range"
              min={SPEED_MIN}
              max={SPEED_MAX}
              step={5}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              aria-label="Animation speed"
            />
          </div>
        </div>
      </div>

      <div className="flex items-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
        <div className="flex flex-col gap-[9px] min-w-0">
          <span className={labelClass}>Palette</span>
          <div className="flex items-center gap-2">
            {selectedPalette && (
              <PaletteSwatch palette={palette} dark={effectiveDark} />
            )}
            <select
              className="h-9 max-w-[220px] rounded-lg bg-(--tab-bg) text-(--tab-active-color) border-none px-3 text-[13px] leading-[14px] cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-[rgba(255,255,255,0.5)] focus-visible:outline-offset-2 [&>option]:bg-(--panel-bg)"
              value={palette}
              onChange={(e) => setPalette(e.target.value)}
              aria-label="Palette"
            >
              {PALETTES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id}
                </option>
              ))}
            </select>
            {selectedPalette && (
              <span className="text-xs font-normal leading-[14px] text-(--text-muted) truncate">
                {selectedPalette.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[9px] min-w-0" role="radiogroup" aria-label="Theme">
          <span className={labelClass}>Theme</span>
          <div className="flex gap-2 items-center">
            {THEMES.map((t) => (
              <TabBtn key={t} active={theme === t} onClick={() => onThemeChange(t)}>
                {cap(t)}
              </TabBtn>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setShowColors((v) => !v)}
          aria-expanded={showColors}
          className="self-start flex items-center gap-1.5 text-xs font-normal leading-[14px] text-(--text-muted) border-none bg-transparent cursor-pointer hover:text-(--tab-hover-color) transition-colors duration-150"
        >
          <ChevronDownIcon className={`transition-transform duration-150 ${showColors ? 'rotate-180' : ''}`} />
          Advanced colors
        </button>
        {showColors && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 max-sm:grid-cols-1">
            {ROLES.map((role) => {
              const value = colors[role];
              return (
                <div key={role} className="flex items-center gap-2 min-w-0">
                  <span className="w-[70px] shrink-0 text-xs font-normal leading-[14px] text-(--text-muted)">
                    {cap(role)}
                  </span>
                  <input
                    type="color"
                    value={value ?? '#888888'}
                    onChange={(e) => setColors((c) => ({ ...c, [role]: e.target.value }))}
                    aria-label={`${cap(role)} color`}
                    className="size-6 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span className="flex-1 text-[11px] leading-[14px] font-[Roboto_Mono,monospace] text-(--text-muted) truncate">
                    {value ?? 'unset'}
                  </span>
                  {value && (
                    <button
                      type="button"
                      onClick={() => {
                        setColors((c) => {
                          const next = { ...c };
                          delete next[role];
                          return next;
                        });
                      }}
                      aria-label={`Clear ${role} color`}
                      className="shrink-0 border-none bg-transparent p-0 text-xs text-(--footer-muted) cursor-pointer hover:text-(--footer-name) transition-colors duration-150"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative w-full min-h-[304px] rounded-[10px] bg-(--surface) flex flex-col items-center justify-center p-12 gap-6 max-sm:p-6">
        <ThinkingOrb
          key={`${state}-${size}`}
          state={state}
          size={size}
          theme={theme}
          palette={palette}
          colors={colors}
          speed={speed / 100}
          paused={paused}
        />
        <PlayPauseToggle
          playing={!paused}
          onToggle={() => setPaused((p) => !p)}
          className="max-sm:absolute max-sm:bottom-6 max-sm:left-1/2 max-sm:-translate-x-1/2"
        />
      </div>

      <div className="flex items-start h-auto bg-(--code-bg) rounded-[10px] py-1.5 pr-10 pl-3 overflow-hidden relative max-sm:hidden">
        <code className="font-[Roboto_Mono,monospace] text-sm leading-[22px] text-(--code-text) whitespace-pre overflow-x-auto min-w-0 flex-1">
          {snippet}
        </code>
        <CopyButton getText={() => snippet} />
      </div>
    </div>
  );
}
