import { useScroll, useTransform, motion } from 'motion/react';
import { useRef } from 'react';
import { Product } from '../data/products';

interface Props { product: Product; }

export default function ProductTextOverlays({ product }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity1 = useTransform(scrollYProgress, [0.05, 0.15, 0.25], [0, 1, 0]);
  const y1      = useTransform(scrollYProgress, [0.05, 0.15, 0.25], [80, 0, -80]);
  const opacity2 = useTransform(scrollYProgress, [0.3,  0.4,  0.5 ], [0, 1, 0]);
  const y2      = useTransform(scrollYProgress, [0.3,  0.4,  0.5 ], [80, 0, -80]);
  const opacity3 = useTransform(scrollYProgress, [0.55, 0.65, 0.75], [0, 1, 0]);
  const y3      = useTransform(scrollYProgress, [0.55, 0.65, 0.75], [80, 0, -80]);
  const opacity4 = useTransform(scrollYProgress, [0.8,  0.9,  0.98], [0, 1, 0]);
  const y4      = useTransform(scrollYProgress, [0.8,  0.9,  0.98], [80, 0, -80]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-20 pointer-events-none h-[500vh]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6">
        <div className="max-w-5xl w-full">

          {/* Section 1 — Product Name */}
          <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-[9px] uppercase tracking-[0.6em] text-brand-gold/80 mb-6 block">
              {product.subName}
            </span>
            <h1 className="text-[58px] md:text-[96px] font-serif italic text-stone-900 leading-none mb-8 tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-px w-16 bg-brand-gold/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
              <div className="h-px w-16 bg-brand-gold/40" />
            </div>
          </motion.div>

          {/* Section 2 — Tagline */}
          <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute inset-0 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="mb-6 px-4 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/5">
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-brand-gold">
                Heritage Grain
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-stone-900 leading-tight mb-6">
              {product.section2.title}
            </h2>
            <p className="text-lg text-stone-500 leading-relaxed font-light italic">
              {product.section2.subtitle}
            </p>
          </motion.div>

          {/* Section 3 — Nutritional Stats */}
          <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-brand-sage mb-12 block">
              Nutritional Profile
            </span>

            <div className="flex gap-10 md:gap-20">
              {product.stats.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <span className="num text-5xl md:text-7xl font-medium text-brand-gold leading-none">
                    {s.val}
                  </span>
                  <div className="h-px w-8 bg-brand-gold/30" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-stone-400">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 4 — Call to action */}
          <motion.div style={{ opacity: opacity4, y: y4 }} className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-brand-gold/70 mb-8 block">
              Experience
            </span>
            <h2 className="text-[44px] md:text-[80px] font-serif text-stone-900 leading-tight">
              Honest snacking.<br />
              <span className="italic font-light text-brand-forest">Evolved.</span>
            </h2>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
