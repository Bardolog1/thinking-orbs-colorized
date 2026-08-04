import { useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { useTheme } from './hooks/useTheme';
import { ApiDocs } from './sections/ApiDocs';
import { CustomPalettes } from './sections/CustomPalettes';
import { Hero } from './sections/Hero';
import { LiveDemo } from './sections/LiveDemo';
import { PaletteGallery } from './sections/PaletteGallery';
import { QuickStart } from './sections/QuickStart';

export function App() {
  // Mirrors a concrete dark/light onto <html> (follows the OS when 'auto'),
  // keeping the site CSS and the orbs' theme resolution in sync.
  const [theme, setTheme] = useTheme('auto');
  // The gallery has its own light/dark toggle, defaulting to dark.
  const [galleryDark, setGalleryDark] = useState(true);

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <Header />
      <main className="w-full max-w-[1060px] mx-auto px-5 max-sm:px-4 flex flex-col gap-16">
        <Hero />
        <LiveDemo theme={theme} onThemeChange={setTheme} />
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 self-start" role="radiogroup" aria-label="Gallery theme">
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setGalleryDark(t === 'dark')}
                aria-pressed={galleryDark === (t === 'dark')}
                className="h-8 px-3 border-none rounded-lg font-[Inter,sans-serif] text-[13px] leading-[14px] cursor-pointer bg-(--tab-bg) text-(--tab-color) hover:bg-(--tab-hover-bg) hover:text-(--tab-hover-color)"
              >
                {t === 'dark' ? 'Dark' : 'Light'}
              </button>
            ))}
          </div>
          <PaletteGallery dark={galleryDark} />
        </div>
        <CustomPalettes />
        <ApiDocs />
        <QuickStart />
      </main>
      <Footer />
    </div>
  );
}
