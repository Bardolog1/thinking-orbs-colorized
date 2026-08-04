import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { useTheme } from './hooks/useTheme';
import { Hero } from './sections/Hero';
import { LiveDemo } from './sections/LiveDemo';

export function App() {
  // Mirrors a concrete dark/light onto <html> (follows the OS when 'auto'),
  // keeping the site CSS and the orbs' theme resolution in sync.
  const [theme, setTheme] = useTheme('auto');

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <Header />
      <main className="w-full max-w-[1060px] mx-auto px-5 max-sm:px-4 flex flex-col gap-16">
        <Hero />
        <LiveDemo theme={theme} onThemeChange={setTheme} />
        {/* PaletteGallery/ApiDocs/QuickStart (E4) */}
      </main>
      <Footer />
    </div>
  );
}
