import { motion } from 'motion/react';
import { products } from './data/products';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductPackScroll from './components/ProductPackScroll';

const product = products[0];

export default function App() {
  return (
    <div className="bg-brand-cream min-h-screen text-stone-900">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Hero */}
        <section id="hero" className="relative">
          <ProductPackScroll product={product} />
        </section>

        {/* Story */}
        <section
          id="story"
          className="bg-brand-parchment py-20 md:py-36 px-6 border-y border-stone-200/50"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-10 bg-brand-gold" />
                <span className="font-mono text-[9px] uppercase tracking-[0.45em] text-brand-gold">
                  Origin Stories
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif text-stone-900 mb-6 md:mb-8 leading-[1.1] tracking-tight">
                {product.detailsSection.title}
              </h2>
              <p className="text-[16px] text-stone-500 leading-relaxed mb-14 font-light">
                {product.detailsSection.description}
              </p>

              <div className="grid grid-cols-3 gap-0 border border-stone-200 rounded-2xl overflow-hidden">
                {product.stats.map((stat, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center py-7 px-4 text-center ${
                      i < product.stats.length - 1 ? 'border-r border-stone-200' : ''
                    }`}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-stone-400 mb-3">
                      {stat.label}
                    </span>
                    <span className="num text-[32px] font-medium text-brand-forest leading-none">
                      {stat.val}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="relative rounded-[3rem] overflow-hidden aspect-[4/5] bg-brand-parchment shadow-2xl shadow-brand-forest/15"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.detailsSection.imageAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-brand-forest/80 via-brand-forest/30 to-transparent px-8 py-8">
                <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-brand-gold/90 text-center">
                  {product.name}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Freshness */}
        <section id="freshness" className="py-20 md:py-36 px-6 bg-brand-cream">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-6">
                  <div className="w-2 h-2 rounded-full bg-brand-gold" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.45em] text-brand-gold block mb-3">
                  Freshness Promise
                </span>
                <div className="h-px w-12 bg-brand-gold/30" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6 tracking-tight">
                  {product.freshnessSection.title}
                </h2>
                <p className="text-[16px] text-stone-500 leading-relaxed font-light">
                  {product.freshnessSection.description}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Craft */}
        <section id="craft" className="relative overflow-hidden grain">
          <div className="absolute inset-0 bg-brand-forest" />
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: product.gradient }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 py-20 md:py-32">
            <div className="flex flex-col lg:flex-row gap-12 md:gap-20 items-start">
              <div className="flex-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-brand-gold/60 block mb-10">
                  {product.craftSection.label}
                </span>
                <h3 className="text-4xl md:text-7xl font-serif text-white mb-8 md:mb-10 leading-tight">
                  {product.craftSection.title}
                </h3>
                <p className="text-[16px] text-white/40 leading-relaxed font-light mb-14 max-w-xl">
                  {product.craftSection.description}
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {product.craftSection.processingParams.map((param, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-[9px] uppercase tracking-[0.25em] text-white/50 flex items-center gap-2"
                    >
                      <div className="w-1 h-1 rounded-full bg-brand-gold" />
                      {param}
                    </span>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-[400px] shrink-0"
              >
                <div className="bg-brand-parchment rounded-3xl overflow-hidden shadow-2xl shadow-black/40 px-10 py-10">
                  <p className="font-mono text-[9px] uppercase tracking-[0.45em] text-stone-400 mb-6">
                    What Makes It Special
                  </p>
                  <div className="space-y-3">
                    {product.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                        <span className="font-mono text-[10px] text-stone-600 tracking-wider">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </motion.main>

      <Footer />
    </div>
  );
}