import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { useTheme } from './hooks/useTheme';
import { Hero } from './sections/Hero';

export function App() {
  // Mirrors a concrete dark/light onto <html> (follows the OS when 'auto'),
  // keeping the site CSS and the orbs' theme resolution in sync.
  useTheme('auto');

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <Header />
      <main className="w-full max-w-[1060px] mx-auto px-5 max-sm:px-4">
        <Hero />
        {/* LiveDemo (E3), PaletteGallery/ApiDocs/QuickStart (E4) */}
      </main>
      <Footer />
    </div>
  );
}
