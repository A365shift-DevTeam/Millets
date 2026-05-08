import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Shield, Truck, ChevronRight, CreditCard, Smartphone, Banknote, Check, Leaf, AlertCircle, X } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

const DELIVERY_FEE = 49;
type PaymentMethod = 'upi' | 'card' | 'cod';

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 bg-red-600 text-white rounded-2xl shadow-2xl shadow-red-600/30 max-w-[90vw]"
    >
      <AlertCircle className="w-4 h-4 shrink-0" />
      <p className="font-mono text-[11px] tracking-wider">{message}</p>
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({ label, field, type = 'text', placeholder, value, errors, onUpdate }: {
  label: string; field: string; type?: string; placeholder?: string; value: string;
  errors: Record<string, string>; onUpdate: (field: string, value: string) => void;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.3em] text-stone-600 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onUpdate(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent border-b-2 py-3 text-stone-900 font-sans text-[14px] placeholder:text-stone-400 focus:outline-none transition-colors ${
          errors[field] ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-brand-forest'
        }`}
      />
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, total, clearCart, navigateTo } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [form, setForm] = useState({
    firstName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPlacing, setIsPlacing] = useState(false);
  const [toast, setToast] = useState('');

  const grandTotal = total + DELIVERY_FEE + (paymentMethod === 'cod' ? 20 : 0);

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim())                          e.firstName  = 'First name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email      = 'Enter a valid email address';
    if (!form.phone.match(/^[6-9]\d{9}$/))               e.phone      = 'Enter a valid 10-digit mobile number';
    if (!form.address.trim())                            e.address    = 'Street address is required';
    if (!form.city.trim())                               e.city       = 'City is required';
    if (!form.state.trim())                              e.state      = 'State is required';
    if (!form.pincode.match(/^\d{6}$/))                  e.pincode    = 'Enter a valid 6-digit pincode';
    return e;
  };

  const handlePlaceOrder = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      // Show first error as toast
      setToast(Object.values(e)[0]);
      return;
    }
    setIsPlacing(true);

    const orderNumber = `MF-${Math.floor(100000 + Math.random() * 900000)}`;

    const { error } = await supabase.from('orders').insert({
      order_number: orderNumber,
      status: 'pending',
      customer_name: form.firstName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.priceNum })),
      subtotal: total,
      delivery_fee: DELIVERY_FEE,
      grand_total: grandTotal,
      payment_method: paymentMethod,
      payment_note: null,
      is_new: true,
    });

    if (error) {
      setToast('Something went wrong. Please try again.');
      setIsPlacing(false);
      return;
    }

    clearCart();
    navigateTo('success', orderNumber);
  };

  const steps = ['Cart', 'Details', 'Payment', 'Confirm'];

  return (
    <div className="min-h-screen bg-brand-parchment">
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast('')} />}
      </AnimatePresence>

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6 md:px-14 py-4 flex items-center justify-between">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-stone-400 hover:text-brand-forest transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Shop
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-forest flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-brand-gold" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-sans text-[13px] font-600 tracking-[0.12em] uppercase text-brand-forest">
                Millet<span className="font-400 opacity-50">Fam</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-brand-sage" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-stone-400">Secure</span>
          </div>
        </div>

        {/* Progress */}
        <div className="max-w-7xl mx-auto px-6 md:px-14 py-3 border-t border-stone-100">
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold transition-all ${
                  i < 2 ? 'bg-brand-forest text-white' : i === 2 ? 'bg-brand-gold text-brand-forest' : 'bg-stone-100 text-stone-300'
                }`}>
                  {i < 2 ? <Check className="w-2.5 h-2.5" /> : <span>{i + 1}</span>}
                </div>
                <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${i <= 2 ? 'text-stone-800' : 'text-stone-400'}`}>
                  {step}
                </span>
                {i < 3 && <ChevronRight className="w-3 h-3 text-stone-300" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-14 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-14 xl:gap-20">

          {/* Left: Form Sections */}
          <div className="space-y-14">

            {/* Contact */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-8 rounded-xl bg-brand-forest text-white flex items-center justify-center font-mono text-[11px] font-bold">1</div>
                <h2 className="font-serif text-2xl text-stone-900">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <Field label="Full Name" field="firstName" value={form.firstName} placeholder="Arjun Sharma" errors={errors} onUpdate={update} />
                <Field label="Email Address" field="email" type="email" value={form.email} placeholder="arjun@example.com" errors={errors} onUpdate={update} />
                <Field label="Mobile Number" field="phone" type="tel" value={form.phone} placeholder="9XXXXXXXXX" errors={errors} onUpdate={update} />
              </div>
            </motion.section>

            {/* Delivery */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-8 rounded-xl bg-brand-forest text-white flex items-center justify-center font-mono text-[11px] font-bold">2</div>
                <h2 className="font-serif text-2xl text-stone-900">Delivery Address</h2>
              </div>
              <div className="space-y-6">
                <Field label="Street Address / Flat No." field="address" value={form.address} placeholder="123, Park Lane, Sector 5" errors={errors} onUpdate={update} />
                <div className="grid grid-cols-2 gap-6">
                  <Field label="City" field="city" value={form.city} placeholder="Chennai" errors={errors} onUpdate={update} />
                  <Field label="State" field="state" value={form.state} placeholder="Tamil Nadu" errors={errors} onUpdate={update} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <Field label="Pincode" field="pincode" value={form.pincode} placeholder="600001" errors={errors} onUpdate={update} />
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.3em] text-stone-600 mb-2">Country</label>
                    <div className="border-b-2 border-stone-300 py-3 font-sans text-[14px] text-stone-700">India</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-5 bg-white rounded-2xl border border-stone-200/60 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-brand-sage/10 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-brand-sage" />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-forest mb-1">
                    Standard Delivery · <span className="num">₹{DELIVERY_FEE}</span>
                  </p>
                  <p className="text-[13px] text-stone-600 leading-relaxed font-light">
                    3–5 business days. Crush-proof packaging. Pan-India shipping. Free on orders above ₹499.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Payment */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-8 rounded-xl bg-brand-gold text-brand-forest flex items-center justify-center font-mono text-[11px] font-bold">3</div>
                <h2 className="font-serif text-2xl text-stone-900">Payment Method</h2>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {([
                  { key: 'upi',  Icon: Smartphone, label: 'UPI' },
                  { key: 'card', Icon: CreditCard,  label: 'Card' },
                  { key: 'cod',  Icon: Banknote,    label: 'Cash on Delivery' },
                ] as const).map(({ key, Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setPaymentMethod(key)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-200 ${
                      paymentMethod === key
                        ? 'border-brand-forest bg-brand-forest text-white shadow-lg shadow-brand-forest/15'
                        : 'border-stone-200 bg-white text-stone-400 hover:border-stone-300 hover:text-stone-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-center leading-tight">{label}</span>
                  </button>
                ))}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={paymentMethod} className="p-5 bg-white rounded-2xl border border-stone-100 flex items-start gap-3">
                <Shield className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                <p className="text-[13px] text-stone-600 font-light leading-relaxed">
                  {paymentMethod === 'upi' && 'Our team will send you a UPI payment request to your registered mobile number after confirming your order.'}
                  {paymentMethod === 'card' && 'Our team will share a secure payment link to your email after confirming your order.'}
                  {paymentMethod === 'cod' && 'Pay in cash when your order arrives. Please keep exact change ready. An additional ₹20 COD handling charge applies.'}
                </p>
              </motion.div>
            </motion.section>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="sticky top-[120px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-xl shadow-stone-200/60"
              >
                <div className="px-7 py-6 border-b border-stone-100 bg-brand-forest">
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white mb-1">Order Summary</p>
                  <p className="font-mono text-[10px] text-brand-gold tracking-wider">
                    <span className="num">{items.length}</span> item{items.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="px-7 py-5 space-y-4 max-h-56 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
                        style={{ background: item.themeColor + '18' }}
                      >
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <span className="font-serif italic text-sm" style={{ color: item.themeColor }}>
                            {item.name.split(' ')[1]?.[0] || item.name[0]}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[13px] font-600 text-stone-900 truncate">{item.name}</p>
                        <p className="font-mono text-[10px] text-stone-500">Qty: <span className="num">{item.quantity}</span></p>
                      </div>
                      <span className="num text-[15px] font-medium text-brand-forest shrink-0">₹{item.priceNum * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="px-7 py-5 border-t border-stone-100 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-600">Subtotal</span>
                    <span className="num text-[14px] font-medium text-stone-900">₹{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-600">Delivery</span>
                    <span className="num text-[14px] font-medium text-stone-900">₹{DELIVERY_FEE}</span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-600">COD Charges</span>
                      <span className="num text-[14px] font-medium text-stone-900">₹20</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-stone-100 flex justify-between items-end">
                    <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-stone-900 font-bold">Total</span>
                    <span className="num text-[34px] font-medium text-brand-forest leading-none">₹{grandTotal}</span>
                  </div>
                </div>

                <div className="px-7 pb-7">
                  <motion.button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing || items.length === 0}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-xl font-mono text-[10px] uppercase tracking-[0.3em] transition-all shadow-lg ${
                      isPlacing
                        ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        : 'bg-brand-forest text-white hover:bg-brand-moss shadow-brand-forest/20'
                    }`}
                  >
                    {isPlacing ? (
                      <span className="flex items-center justify-center gap-3">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full block"
                        />
                        Placing Order…
                      </span>
                    ) : 'Place Order'}
                  </motion.button>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Shield className="w-3 h-3 text-stone-300" />
                    <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-stone-300">256-Bit Encrypted</p>
                  </div>
                </div>
              </motion.div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2.5 mt-4">
                {[
                  { icon: '🌿', label: 'All Natural' },
                  { icon: '📦', label: 'Safe Packaging' },
                  { icon: '↩️', label: '7-Day Return' },
                ].map(b => (
                  <div key={b.label} className="text-center p-3 bg-white rounded-2xl border border-stone-100">
                    <div className="text-lg mb-1">{b.icon}</div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-stone-400 leading-tight">{b.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
