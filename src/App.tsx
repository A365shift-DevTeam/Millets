import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Truck, RotateCcw } from 'lucide-react';
import { products } from './data/products';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductPackScroll from './components/ProductPackScroll';
import ProductTextOverlays from './components/ProductTextOverlays';
import CartDrawer from './components/CartDrawer';
import BuyModal from './components/BuyModal';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminPage from './pages/AdminPage';
import { CartProvider, useCart } from './context/CartContext';

function HomeContent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProduct = products[currentIndex];
  const { page } = useCart();

  useEffect(() => { window.scrollTo(0, 0); }, [currentIndex]);
  const nextProduct = () => setCurrentIndex(prev => (prev + 1) % products.length);
  const prevProduct = () => setCurrentIndex(prev => (prev - 1 + products.length) % products.length);

  if (page !== 'home') return null;

  return (
    <div className="bg-brand-cream min-h-screen text-stone-900">
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={currentProduct.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Scrollytelling Hero */}
          <section className="relative">
            <ProductPackScroll product={currentProduct} />
            <ProductTextOverlays product={currentProduct} />
          </section>

          {/* ─── Details / Origin Section ─── */}
          <section className="bg-brand-parchment py-36 px-6 border-y border-stone-200/50">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">

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
                <h2 className="text-5xl md:text-6xl font-serif text-stone-900 mb-8 leading-[1.1] tracking-tight">
                  {currentProduct.detailsSection.title}
                </h2>
                <p className="text-[16px] text-stone-500 leading-relaxed mb-14 font-light">
                  {currentProduct.detailsSection.description}
                </p>

                {/* Stats — DM Mono numbers */}
                <div className="grid grid-cols-3 gap-0 border border-stone-200 rounded-2xl overflow-hidden">
                  {currentProduct.stats.map((stat, i) => (
                    <div key={i} className={`flex flex-col items-center py-7 px-4 text-center ${
                      i < currentProduct.stats.length - 1 ? 'border-r border-stone-200' : ''
                    }`}>
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

              {/* Visual placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="relative rounded-[3rem] overflow-hidden aspect-[4/5] bg-brand-forest shadow-2xl shadow-brand-forest/20 flex items-center justify-center"
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ background: currentProduct.gradient }}
                />
                <div className="relative z-10 text-center px-12">
                  <div className="font-serif italic text-[100px] text-white/10 leading-none select-none">
                    {currentProduct.name.split(' ')[1]?.[0] || currentProduct.name[0]}
                  </div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-brand-gold/60 mt-4">
                    {currentProduct.name}
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ─── Freshness Section ─── */}
          <section className="py-36 px-6 bg-brand-cream">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 items-start">
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
                    {currentProduct.freshnessSection.title}
                  </h2>
                  <p className="text-[16px] text-stone-500 leading-relaxed font-light">
                    {currentProduct.freshnessSection.description}
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ─── Buy Section ─── */}
          <section className="relative overflow-hidden grain">
            <div className="absolute inset-0 bg-brand-forest" />
            <div
              className="absolute inset-0 opacity-10"
              style={{ background: currentProduct.gradient }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 py-32">
              <div className="flex flex-col lg:flex-row gap-20 items-start">

                {/* Left copy */}
                <div className="flex-1">
                  <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-brand-gold/60 block mb-10">
                    Ready to Begin
                  </span>
                  <h3 className="text-5xl md:text-7xl font-serif text-white mb-10 leading-tight">
                    Your daily<br />millet<br />
                    <span className="italic font-light text-brand-gold">ritual.</span>
                  </h3>

                  {/* Processing tags */}
                  <div className="flex flex-wrap gap-2.5 mb-14">
                    {currentProduct.buyNowSection.processingParams.map((param, i) => (
                      <span key={i} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-[9px] uppercase tracking-[0.25em] text-white/50 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-brand-gold" />
                        {param}
                      </span>
                    ))}
                  </div>

                  {/* Promises */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { icon: Truck, title: 'Standard Shipping', body: currentProduct.buyNowSection.deliveryPromise },
                      { icon: RotateCcw, title: 'Satisfaction Guarantee', body: currentProduct.buyNowSection.returnPolicy },
                    ].map(({ icon: Icon, title, body }) => (
                      <div key={title} className="flex gap-5">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-brand-gold/70" />
                        </div>
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/60 mb-2">{title}</p>
                          <p className="text-[13px] text-white/35 leading-relaxed font-light">{body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Card */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="w-full lg:w-[400px] shrink-0"
                >
                  <div className="bg-brand-parchment rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
                    {/* Card header */}
                    <div className="px-10 pt-10 pb-8 border-b border-stone-200/60">
                      <p className="font-mono text-[9px] uppercase tracking-[0.45em] text-stone-400 mb-4">Price</p>
                      <div className="flex items-end gap-3">
                        <span className="num text-[64px] font-medium text-brand-forest leading-none">
                          {currentProduct.buyNowSection.price}
                        </span>
                      </div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-stone-400 mt-3">
                        {currentProduct.buyNowSection.unit}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="px-10 py-8">
                      <div className="space-y-3">
                        {currentProduct.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                            <span className="font-mono text-[10px] text-stone-600 tracking-wider">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ─── Next Product ─── */}
          <section
            className="relative h-[70vh] overflow-hidden cursor-pointer group bg-brand-parchment"
            onClick={nextProduct}
          >
            {/* Next product image — faint, centred */}
            {products[(currentIndex + 1) % products.length].image && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img
                  src={products[(currentIndex + 1) % products.length].image}
                  alt=""
                  className="h-[55%] w-auto object-contain opacity-10 group-hover:opacity-20 transition-opacity duration-700 scale-110 group-hover:scale-100 transition-transform"
                />
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-900 p-6">
              <span className="font-mono text-[9px] uppercase tracking-[0.6em] text-stone-400 mb-10">
                Continue the Journey
              </span>
              <h2 className="text-5xl md:text-8xl font-serif italic text-center mb-10 tracking-tight group-hover:text-brand-forest transition-colors duration-500">
                {products[(currentIndex + 1) % products.length].name}
              </h2>
              <div className="w-16 h-16 rounded-full border-2 border-stone-200 group-hover:border-brand-gold flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-brand-gold transition-colors" />
              </div>
            </div>
          </section>

        </motion.main>
      </AnimatePresence>

      <Footer />

      {/* Product Switcher */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 bg-white/85 backdrop-blur-2xl border border-stone-200/70 rounded-full shadow-xl shadow-black/10 max-w-[92vw] flex-wrap justify-center">
        {products.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setCurrentIndex(i)}
            className={`px-5 py-3 font-mono text-[9px] uppercase tracking-[0.25em] transition-all duration-300 rounded-full ${
              currentIndex === i
                ? 'bg-brand-forest text-white shadow-md px-8'
                : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
            }`}
          >
            {p.name.split(' ')[1] || p.name}
          </button>
        ))}
      </div>

      <button
        onClick={prevProduct}
        className="fixed left-5 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-forest transition-all shadow-lg hidden md:flex"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextProduct}
        className="fixed right-5 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-forest transition-all shadow-lg hidden md:flex"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function AppContent() {
  const { page } = useCart();

  // Admin page bypasses cart/drawer entirely
  if (page === 'admin') return <AdminPage />;

  return (
    <>
      <AnimatePresence mode="wait">
        {page === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <HomeContent />
          </motion.div>
        )}
        {page === 'checkout' && (
          <motion.div key="checkout" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <CheckoutPage />
          </motion.div>
        )}
        {page === 'success' && (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <OrderSuccessPage />
          </motion.div>
        )}
      </AnimatePresence>
      <CartDrawer />
      <BuyModal />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
