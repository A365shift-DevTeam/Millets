import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Package, Truck, CheckCircle, ArrowRight, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ORDER_ID = `MF-${Math.floor(100000 + Math.random() * 900000)}`;

export default function OrderSuccessPage() {
  const { navigateTo } = useCart();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 1000);
    const t3 = setTimeout(() => setStep(3), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const timeline = [
    { icon: CheckCircle, label: 'Order Confirmed', sub: 'Just now',            active: step >= 1 },
    { icon: Package,     label: 'Preparing Your Pack', sub: 'Within 24 hours', active: step >= 2 },
    { icon: Truck,       label: 'Out for Delivery',    sub: '3–5 business days', active: step >= 3 },
  ];

  return (
    <div className="min-h-screen bg-brand-parchment flex flex-col">
      {/* Header */}
      <div className="border-b border-stone-200/60 bg-white/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-8 py-5 flex items-center justify-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-forest flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-brand-gold" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-sans text-[13px] font-600 tracking-[0.12em] uppercase text-brand-forest">
              Millet<span className="font-400 opacity-50">Fam</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">

        {/* Animated check */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20, delay: 0.1 }}
          className="relative mb-10"
        >
          <div className="w-24 h-24 rounded-2xl bg-brand-forest flex items-center justify-center shadow-2xl shadow-brand-forest/25">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 300 }}
            >
              <CheckCircle className="w-12 h-12 text-brand-gold" strokeWidth={1.5} />
            </motion.div>
          </div>
          {/* Pulse ring */}
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 rounded-2xl border-2 border-brand-forest"
          />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-center mb-3"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-brand-gold block mb-4">
            Order Confirmed
          </span>
          <h1 className="font-serif italic text-5xl md:text-6xl text-stone-900 leading-tight mb-4">
            Your pack<br />is on its way.
          </h1>
          <p className="text-stone-400 font-light text-[15px] max-w-sm mx-auto leading-relaxed">
            Thank you for choosing MilletFam. We're packing your order with care.
          </p>
        </motion.div>

        {/* Order ID */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-10 mt-8 px-8 py-5 bg-white border border-stone-200/60 rounded-2xl shadow-sm text-center"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-stone-400 mb-2">Order ID</p>
          <p className="num text-[24px] font-medium text-brand-forest">{ORDER_ID}</p>
          <p className="font-mono text-[9px] text-stone-300 tracking-wider mt-2">Confirmation sent to your email</p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="w-full max-w-sm mb-10 bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-sm"
        >
          <div className="px-7 py-5 border-b border-stone-100 bg-brand-forest">
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/50">Order Timeline</p>
          </div>
          <div className="px-7 py-4 space-y-0">
            {timeline.map((item, i) => (
              <div key={item.label} className="flex items-start gap-4 py-4 relative">
                {i < timeline.length - 1 && (
                  <div className={`absolute left-[17px] top-[44px] bottom-0 w-0.5 transition-colors duration-700 ${item.active ? 'bg-brand-forest/20' : 'bg-stone-100'}`} />
                )}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                  item.active ? 'bg-brand-forest border-brand-forest' : 'bg-white border-stone-200'
                }`}>
                  <item.icon className={`w-3.5 h-3.5 transition-colors duration-500 ${item.active ? 'text-brand-gold' : 'text-stone-300'}`} />
                </div>
                <div>
                  <p className={`font-sans font-600 text-[13px] transition-colors duration-500 ${item.active ? 'text-stone-900' : 'text-stone-300'}`}>
                    {item.label}
                  </p>
                  <p className="font-mono text-[9px] text-stone-400 tracking-wider mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
        >
          <button
            onClick={() => navigateTo('home')}
            className="flex-1 bg-brand-forest text-white py-4 rounded-xl font-mono text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-brand-moss transition-colors shadow-lg shadow-brand-forest/15 group"
          >
            Shop More
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="flex-1 bg-white text-stone-700 py-4 rounded-xl font-mono text-[10px] uppercase tracking-[0.3em] flex items-center justify-center hover:bg-stone-50 transition-colors border border-stone-200"
          >
            Track Order
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-14 font-mono text-[8px] uppercase tracking-[0.5em] text-stone-300"
        >
          MilletFam — Ancient Grains, Modern Life
        </motion.p>
      </div>
    </div>
  );
}
