import { motion } from 'motion/react';
import { Product } from '../data/products';

interface Props {
  product: Product;
  compact?: boolean;
}

export default function StorySection({ product, compact = false }: Props) {
  return (
    <div className={compact ? '' : 'grid-adaptive-2 items-center'}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="h-px w-10 bg-brand-gold" />
          <span className="label text-brand-gold">Origin Stories</span>
        </div>
        <h2 className="text-[34px] sm:text-[46px] md:text-[58px] font-serif text-brand-ink mb-5 sm:mb-8 leading-[1.08] tracking-tight md:tracking-tighter">
          {product.detailsSection.title}
        </h2>
        <p className="text-[14px] sm:text-[15px] text-brand-ink/60 leading-relaxed mb-8 sm:mb-14 font-light">
          {product.detailsSection.description}
        </p>

        <div className="grid-adaptive-3">
          {product.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center py-5 sm:py-7 px-4 text-center rounded-xl sm:rounded-2xl border border-brand-border bg-white"
            >
              <span className="label mb-2 sm:mb-3">{stat.label}</span>
              <span className="num text-[28px] sm:text-[32px] font-medium text-brand-forest leading-none tabular-nums">
                {stat.val}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {!compact && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="relative rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[4/5] bg-brand-parchment shadow-xl shadow-brand-forest/10"
        >
          {product.image && (
            <img
              src={product.image}
              alt={product.detailsSection.imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-brand-forest/80 via-brand-forest/30 to-transparent px-6 sm:px-8 py-6 sm:py-8">
            <p className="label text-brand-gold/90 text-center">{product.name}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}