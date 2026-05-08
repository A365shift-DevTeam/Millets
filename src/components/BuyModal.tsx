import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ArrowRight, Leaf, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export default function BuyModal() {
  const {
    isBuyModalOpen, closeBuyModal,
    addToCart, items, updateQuantity,
    total, itemCount, navigateTo,
  } = useCart();

  const getQty = (id: string) => items.find(i => i.id === id)?.quantity || 0;

  const handleCheckout = () => {
    closeBuyModal();
    navigateTo('checkout');
  };

  return (
    <AnimatePresence>
      {isBuyModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="buy-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-brand-forest/70 backdrop-blur-md"
            onClick={closeBuyModal}
          />

          {/* Panel — bottom sheet */}
          <motion.div
            key="buy-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 36 }}
            className="fixed bottom-0 left-0 right-0 z-[90] flex flex-col bg-brand-cream rounded-t-3xl overflow-hidden"
            style={{ maxHeight: '92vh' }}
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-6 md:px-10 py-5 bg-brand-parchment border-b border-stone-200/60">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-brand-forest flex items-center justify-center shadow-md shadow-brand-forest/20">
                  <Leaf className="w-4 h-4 text-brand-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-serif text-[22px] text-stone-900 leading-none">Our Collection</h2>
                  <p className="font-mono text-[8px] uppercase tracking-[0.45em] text-stone-400 mt-1">
                    {products.length} Products · Add to your pack
                  </p>
                </div>
              </div>
              <button
                onClick={closeBuyModal}
                className="w-8 h-8 rounded-xl border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-stone-500" />
              </button>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
                {products.map((product, i) => {
                  const qty = getQty(product.id);
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                    >
                      {/* Product image */}
                      <div
                        className="relative h-44 flex items-center justify-center overflow-hidden"
                        style={{ background: product.themeColor + '12' }}
                      >
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            background: product.gradient,
                            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
                            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
                          }}
                        />
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="relative z-10 h-36 w-auto object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-serif italic text-2xl shadow-lg"
                            style={{ background: product.gradient }}
                          >
                            {product.name.split(' ')[1]?.[0] || product.name[0]}
                          </div>
                        )}
                        <span
                          className="absolute top-3 right-3 font-mono text-[7px] uppercase tracking-[0.3em] px-2 py-1 rounded-lg z-10"
                          style={{ color: product.themeColor, background: '#ffffff' + 'cc' }}
                        >
                          In Stock
                        </span>
                      </div>

                      <div className="px-5 pb-5 flex flex-col flex-1">
                        {/* Name */}
                        <div className="mb-4">
                          <h3 className="font-serif text-xl text-stone-900 leading-tight">{product.name}</h3>
                          <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-stone-400 mt-1 leading-relaxed">
                            {product.subName}
                          </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-1.5 mb-5 flex-1">
                          {product.features.map((f, fi) => (
                            <div key={fi} className="flex items-center gap-2">
                              <div
                                className="w-1 h-1 rounded-full shrink-0"
                                style={{ background: product.themeColor }}
                              />
                              <span className="font-mono text-[8px] text-stone-500 tracking-wider">{f}</span>
                            </div>
                          ))}
                        </div>

                        {/* Price */}
                        <div className="mb-4 pb-4 border-b border-stone-100">
                          <span className="num text-[32px] font-medium text-brand-forest leading-none">
                            {product.buyNowSection.price}
                          </span>
                          <p className="font-mono text-[8px] text-stone-400 tracking-wider mt-0.5">
                            {product.buyNowSection.unit}
                          </p>
                        </div>

                        {/* Add / Quantity control */}
                        {qty === 0 ? (
                          <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={() => addToCart(product, true)}
                            className="w-full py-3 rounded-xl bg-brand-forest text-white font-mono text-[9px] uppercase tracking-[0.25em] flex items-center justify-center gap-2 hover:bg-brand-moss transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            Add to Pack
                          </motion.button>
                        ) : (
                          <div className="flex items-center justify-between bg-stone-50 rounded-xl px-3 py-2 border border-stone-100">
                            <button
                              onClick={() => updateQuantity(product.id, qty - 1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
                            >
                              <Minus className="w-3 h-3 text-stone-600" />
                            </button>
                            <span className="num text-[15px] font-medium text-stone-900 tabular-nums">{qty}</span>
                            <button
                              onClick={() => updateQuantity(product.id, qty + 1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
                            >
                              <Plus className="w-3 h-3 text-stone-600" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Sticky footer — appears when cart has items */}
            <AnimatePresence>
              {itemCount > 0 ? (
                <motion.div
                  key="footer-filled"
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 80, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  className="shrink-0 px-6 md:px-10 py-5 bg-white border-t border-stone-200/60"
                >
                  <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 flex-wrap">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-stone-400">
                        Pack Total · {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </p>
                      <span className="num text-[30px] font-medium text-brand-forest leading-tight">₹{total}</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      className="flex-1 min-w-[200px] max-w-[320px] bg-brand-forest text-white py-4 rounded-xl font-mono text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-brand-moss transition-colors group shadow-xl shadow-brand-forest/25"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="footer-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="shrink-0 px-6 py-4 bg-white border-t border-stone-200/60 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-stone-300" />
                  <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-stone-300">
                    Your pack is empty — pick something nourishing
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
