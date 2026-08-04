import type { Theme } from '../hooks/useTheme';
import { Playground } from '../components/Playground';

export function LiveDemo({
  theme,
  onThemeChange,
}: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}) {
  return (
    <section className="w-full flex flex-col gap-4" aria-label="Interactive live demo">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-base font-normal leading-[34px] text-(--section-title-color)">Live demo</h2>
        <p className="text-sm leading-[21px] text-(--text-muted)">
          The migrated playground — every control the component exposes, including the new{' '}
          <code className="font-[Roboto_Mono,monospace] text-[13px]">palette</code>,{' '}
          <code className="font-[Roboto_Mono,monospace] text-[13px]">colors</code> and{' '}
          <code className="font-[Roboto_Mono,monospace] text-[13px]">theme</code> props. The
          snippet stays in sync and is ready to copy.
        </p>
      </div>
      <Playground theme={theme} onThemeChange={onThemeChange} />
    </section>
  );
}
