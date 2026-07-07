import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Leaf, Sparkles } from 'lucide-react';
import { useLenis } from 'lenis/react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount, openDrawer, navigateTo, openBuyModal } = useCart();

  useLenis(({ scroll }) => {
    setIsScrolled(scroll > 60);
  });

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      isScrolled
        ? 'bg-brand-forest/95 backdrop-blur-xl border-b border-white/5 py-4'
        : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-8 md:px-14 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3.5 group"
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-500 ${
            isScrolled ? 'bg-brand-gold' : 'bg-brand-forest'
          }`}>
            <Leaf className="w-4 h-4 text-white" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className={`text-[15px] font-sans font-700 tracking-[0.15em] uppercase transition-colors duration-500 ${
              isScrolled ? 'text-white' : 'text-brand-forest'
            }`}>
              Millet<span className="font-400 opacity-60">Fam</span>
            </span>
            <span className={`text-[8px] font-mono tracking-[0.4em] uppercase transition-colors duration-500 ${
              isScrolled ? 'text-brand-gold/70' : 'text-brand-sage/80'
            }`}>
              Est. 2018
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-8 items-center">
            {['Home', 'Our Ethos', 'Origins'].map((item, i) => (
              <button
                key={item}
                onClick={() => i === 0 && navigateTo('home')}
                className={`text-[10px] font-mono uppercase tracking-[0.3em] transition-colors duration-300 ${
                  isScrolled
                    ? i === 0 ? 'text-white border-b border-brand-gold pb-0.5' : 'text-white/50 hover:text-white'
                    : i === 0 ? 'text-brand-forest border-b border-brand-gold pb-0.5' : 'text-brand-forest/50 hover:text-brand-forest'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* BUY button */}
          <motion.button
            onClick={openBuyModal}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            className={`relative flex items-center gap-2 px-7 py-3 rounded-full text-[11px] font-mono uppercase tracking-[0.35em] font-bold transition-all duration-300 shadow-lg ${
              isScrolled
                ? 'bg-brand-gold text-brand-forest shadow-brand-gold/30 hover:bg-brand-amber'
                : 'bg-brand-gold text-brand-forest shadow-brand-gold/25 hover:bg-brand-amber'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Buy
          </motion.button>

          {/* Cart */}
          <motion.button
            onClick={openDrawer}
            whileTap={{ scale: 0.96 }}
            className={`relative flex items-center gap-2.5 px-5 py-3 rounded-full text-[10px] font-mono uppercase tracking-[0.25em] font-medium transition-all duration-300 ${
              isScrolled
                ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                : 'bg-brand-forest text-white hover:bg-brand-moss shadow-xl shadow-brand-forest/25'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Pack
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-terracotta text-white text-[9px] font-mono font-bold flex items-center justify-center shadow"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <motion.button
            onClick={openBuyModal}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-gold text-brand-forest font-mono text-[9px] uppercase tracking-[0.3em] font-bold shadow-md shadow-brand-gold/25"
          >
            <Sparkles className="w-3 h-3" />
            Buy
          </motion.button>

          <button
            onClick={openDrawer}
            className={`relative p-2.5 rounded-xl transition-colors ${
              isScrolled ? 'text-white' : 'text-brand-forest'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-terracotta text-white text-[9px] font-mono font-bold flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </nav>
  );
}
