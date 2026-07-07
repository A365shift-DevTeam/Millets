import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { useLenis } from 'lenis/react';

const NAV_ITEMS = [
  { label: 'Home', id: 'hero' },
  { label: 'Story', id: 'story' },
  { label: 'Freshness', id: 'freshness' },
  { label: 'Craft', id: 'craft' },
] as const;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const lenis = useLenis();

  useLenis(({ scroll }) => {
    setIsScrolled(scroll > 60);
  });

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target, { offset: -80 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? 'bg-brand-forest/95 backdrop-blur-xl border-b border-white/5 py-4'
          : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-14 flex items-center justify-between">
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-3.5 group"
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-500 ${
              isScrolled ? 'bg-brand-gold' : 'bg-brand-forest'
            }`}
          >
            <Leaf className="w-4 h-4 text-white" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className={`text-[15px] font-sans font-700 tracking-[0.15em] uppercase transition-colors duration-500 ${
                isScrolled ? 'text-white' : 'text-brand-forest'
              }`}
            >
              Energy<span className="font-400 opacity-60">Bar</span>
            </span>
            <span
              className={`text-[8px] font-mono tracking-[0.4em] uppercase transition-colors duration-500 ${
                isScrolled ? 'text-brand-gold/70' : 'text-brand-sage/80'
              }`}
            >
              Est. 2018
            </span>
          </div>
        </button>

        <div className="hidden sm:flex items-center gap-6 md:gap-10">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-[10px] font-mono uppercase tracking-[0.3em] transition-colors duration-300 ${
                isScrolled
                  ? 'text-white/50 hover:text-white'
                  : 'text-brand-forest/50 hover:text-brand-forest'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}