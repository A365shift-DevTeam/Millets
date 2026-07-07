import { useState } from 'react';
import { Leaf, Menu, X, ArrowRight } from 'lucide-react';
import { useLenis } from 'lenis/react';

const NAV_ITEMS = [
  { label: 'Home', id: 'hero' },
  { label: 'Story', id: 'story' },
  { label: 'Freshness', id: 'freshness' },
  { label: 'Craft', id: 'craft' },
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const lenis = useLenis();

  const scrollToSection = (id: string) => {
    const target =
      document.getElementById(id) ||
      (id === 'story' ? document.getElementById('story-desktop') : null);
    if (!target) return;

    setMenuOpen(false);

    if (lenis) {
      lenis.scrollTo(target, { offset: -80 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-brand-surface/95 backdrop-blur-xl border-b border-brand-border">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 md:px-10 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 min-h-12 active:opacity-70 transition-opacity"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-forest flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 text-brand-accent" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col leading-none text-left">
              <span className="text-[13px] sm:text-[15px] font-display font-700 tracking-[0.1em] uppercase text-brand-ink">
                Energy<span className="font-400 opacity-50">Bar</span>
              </span>
              <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-brand-ink/45">
                Est. 2018
              </span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-ink/45 hover:text-brand-ink transition-colors min-h-12 flex items-center"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => scrollToSection('story')}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 h-9 sm:h-10 rounded-full bg-brand-accent text-white text-xs sm:text-sm font-mono uppercase tracking-[0.2em] font-bold active:scale-95 transition-transform min-w-12 justify-center"
            >
              <span className="sm:hidden">Start</span>
              <span className="hidden sm:inline">Explore Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="md:hidden w-11 h-11 flex items-center justify-center text-brand-ink active:bg-brand-border/50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] bg-brand-surface md:hidden flex flex-col pt-24 px-6">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-4 w-11 h-11 flex items-center justify-center text-brand-ink"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-left py-4 text-sm font-mono uppercase tracking-[0.25em] text-brand-ink/70 hover:text-brand-ink border-b border-brand-border active:text-brand-accent min-h-12"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}