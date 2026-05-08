import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeFromCart, updateQuantity, total, itemCount, navigateTo } = useCart();

  const handleCheckout = () => {
    closeDrawer();
    navigateTo('checkout');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-brand-forest/50 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 34 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[460px] bg-brand-parchment flex flex-col shadow-2xl shadow-brand-forest/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-stone-200/60 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-forest flex items-center justify-center">
                  <Leaf className="w-3.5 h-3.5 text-brand-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-forest font-medium">Your Pack</p>
                  <p className="font-mono text-[9px] text-stone-400 tracking-wider">
                    <span className="num">{itemCount}</span> item{itemCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-stone-500" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center py-20"
                >
                  <div className="w-14 h-14 rounded-2xl border border-stone-200 flex items-center justify-center mb-5">
                    <ShoppingBag className="w-6 h-6 text-stone-300" />
                  </div>
                  <p className="font-serif italic text-2xl text-stone-300 mb-2">Empty pack</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-stone-300">
                    Add something nourishing
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.22 }}
                      className="flex gap-4 p-5 bg-white rounded-2xl border border-stone-100 shadow-sm"
                    >
                      <div
                        className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-white font-serif italic text-sm"
                        style={{ background: item.themeColor }}
                      >
                        {item.name.split(' ')[1]?.[0] || item.name[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <p className="font-sans font-600 text-stone-900 text-sm leading-tight">{item.name}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-300 hover:text-brand-terracotta transition-colors shrink-0 mt-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="font-mono text-[9px] text-stone-400 tracking-wider mb-3">{item.unit}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 bg-stone-50 rounded-full p-0.5 border border-stone-100">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
                            >
                              <Minus className="w-2.5 h-2.5 text-stone-600" />
                            </button>
                            <span className="num w-6 text-center text-[13px] font-medium text-stone-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
                            >
                              <Plus className="w-2.5 h-2.5 text-stone-600" />
                            </button>
                          </div>
                          <span className="num text-[18px] font-medium text-brand-forest">
                            ₹{item.priceNum * item.quantity}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-stone-200/60 bg-white space-y-4">
                <div className="flex items-end justify-between mb-1">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-stone-400 mb-1">Subtotal</p>
                    <p className="font-mono text-[9px] text-stone-400">Delivery calculated at checkout</p>
                  </div>
                  <span className="num text-[32px] font-medium text-brand-forest leading-none">₹{total}</span>
                </div>

                <motion.button
                  onClick={handleCheckout}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-brand-forest text-white py-4.5 rounded-xl font-mono text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-brand-moss transition-colors group shadow-lg shadow-brand-forest/20"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </motion.button>

                <button
                  onClick={closeDrawer}
                  className="w-full text-center font-mono text-[9px] uppercase tracking-[0.3em] text-stone-400 hover:text-stone-700 transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
