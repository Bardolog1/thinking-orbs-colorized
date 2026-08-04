import { resolvePalette } from 'thinking-orbs-colorized';

/**
 * Renders the resolved ink→fade ramp of a palette (id, CSS shorthand or
 * object) as a small gradient dot. `dark` picks which theme ramp to show.
 */
export function PaletteSwatch({
  palette,
  dark,
  className = '',
}: {
  palette: string;
  dark: boolean;
  className?: string;
}) {
  const resolved = resolvePalette(palette, dark);
  const ramp = dark ? resolved.dark : resolved.light;
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-4 shrink-0 rounded-full ${className}`}
      style={{ background: `linear-gradient(135deg, ${ramp.ink} 0%, ${ramp.fade} 100%)` }}
    />
  );
}
