import { Instagram, Twitter, Facebook, ArrowRight, Leaf } from 'lucide-react';

const SECTION_LINKS = [
  { label: 'Energy Bar', id: 'hero' },
  { label: 'Our Story', id: 'story' },
  { label: 'Freshness', id: 'freshness' },
  { label: 'Craft', id: 'craft' },
];

export default function Footer() {
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-brand-forest text-white relative overflow-hidden">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-8 md:px-14 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-brand-gold flex items-center justify-center">
                <Leaf className="w-4 h-4 text-brand-forest" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-[15px] font-sans font-700 tracking-[0.15em] uppercase text-white">
                  Energy<span className="font-400 opacity-50">Bar</span>
                </h2>
                <p className="font-mono text-[8px] tracking-[0.4em] uppercase text-brand-gold/60">Est. 2018</p>
              </div>
            </div>
            <p className="text-[15px] text-white/50 max-w-sm leading-relaxed font-light mb-8">
              On a mission to bring ancient Indian grain wisdom to your modern plate. Smarter snacking, cleaner life.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-brand-gold/40 hover:bg-brand-gold/10 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-brand-gold/70 mb-6">Explore</p>
            <ul className="space-y-3.5">
              {SECTION_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-[13px] text-white/45 hover:text-white transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-brand-gold/70 mb-6">Stay in the Loop</p>
            <p className="text-[13px] text-white/40 mb-6 leading-relaxed font-light">
              Drop alerts, grain wisdom, and seasonal recipes.
            </p>
            <div className="relative border-b border-white/20 focus-within:border-brand-gold/60 transition-colors">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent py-3 text-[13px] text-white placeholder:text-white/25 focus:outline-none font-mono"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-gold/60 hover:text-brand-gold transition-colors hover:translate-x-0.5 duration-200">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/25">
            © 2024 Energy Bar. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms'].map((l) => (
              <a
                key={l}
                href="#"
                className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25 hover:text-white/60 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}