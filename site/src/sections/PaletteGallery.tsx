import { PALETTES } from 'thinking-orbs-colorized';
import { PaletteSwatch } from '../components/PaletteSwatch';

/**
 * Grid of all 22 shipped palettes. `dark` selects which theme ramp each
 * swatch shows; toggling is handled by the section's parent.
 */
export function PaletteGallery({ dark }: { dark: boolean }) {
  return (
    <section className="w-full flex flex-col gap-4" aria-label="Palette gallery">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-base font-normal leading-[34px] text-(--section-title-color)">Palettes</h2>
        <p className="text-sm leading-[21px] text-(--text-muted)">
          All {PALETTES.length} curated palettes shipped with the package — pass any{' '}
          <code className="font-[Roboto_Mono,monospace] text-[13px]">id</code> to{' '}
          <code className="font-[Roboto_Mono,monospace] text-[13px]">palette</code>, or register
          your own with <code className="font-[Roboto_Mono,monospace] text-[13px]">registerPalette</code>.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {PALETTES.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-2.5 rounded-[10px] bg-(--panel-bg) p-3 min-w-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <PaletteSwatch palette={p.id} dark={dark} className="size-5" />
              <span className="truncate text-[13px] leading-[18px] text-(--section-title-color)">
                {p.name}
              </span>
            </div>
            <code className="font-[Roboto_Mono,monospace] text-[11px] leading-[14px] text-(--text-muted)">
              palette=&quot;{p.id}&quot;
            </code>
          </div>
        ))}
      </div>
    </section>
  );
}
