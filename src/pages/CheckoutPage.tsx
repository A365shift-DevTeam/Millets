import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Truck, ChevronRight, CreditCard, Smartphone, Banknote, Check, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

const DELIVERY_FEE = 49;
type PaymentMethod = 'upi' | 'card' | 'cod';

export default function CheckoutPage() {
  const { items, total, clearCart, navigateTo } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
    upiId: '', cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPlacing, setIsPlacing] = useState(false);

  const grandTotal = total + DELIVERY_FEE + (paymentMethod === 'cod' ? 20 : 0);

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = '10-digit mobile required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.state.trim()) e.state = 'Required';
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = '6-digit pincode';
    if (paymentMethod === 'upi' && !form.upiId.includes('@')) e.upiId = 'Valid UPI ID required';
    if (paymentMethod === 'card') {
      if (!form.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) e.cardNumber = '16-digit card required';
      if (!form.cardName.trim()) e.cardName = 'Required';
      if (!form.cardExpiry.match(/^\d{2}\/\d{2}$/)) e.cardExpiry = 'MM/YY format';
      if (!form.cardCvv.match(/^\d{3,4}$/)) e.cardCvv = '3–4 digits';
    }
    return e;
  };

  const handlePlaceOrder = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setIsPlacing(true);
    await new Promise(r => setTimeout(r, 1800));
    clearCart();
    navigateTo('success');
  };

  const Field = ({ label, field, type = 'text', placeholder, value }: {
    label: string; field: string; type?: string; placeholder?: string; value: string;
  }) => (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.3em] text-stone-600 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => update(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent border-b-2 py-3 text-stone-900 font-sans text-[14px] placeholder:text-stone-400 focus:outline-none transition-colors ${
          errors[field] ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-brand-forest'
        }`}
      />
      {errors[field] && <p className="font-mono text-[10px] text-red-500 mt-1.5">{errors[field]}</p>}
    </div>
  );

  const steps = ['Cart', 'Details', 'Payment', 'Confirm'];

  return (
    <div className="min-h-screen bg-brand-parchment">
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
              <div className="grid grid-cols-2 gap-6">
                <Field label="First Name" field="firstName" value={form.firstName} placeholder="Arjun" />
                <Field label="Last Name" field="lastName" value={form.lastName} placeholder="Sharma" />
                <div className="col-span-2">
                  <Field label="Email Address" field="email" type="email" value={form.email} placeholder="arjun@example.com" />
                </div>
                <div className="col-span-2">
                  <Field label="Mobile Number" field="phone" type="tel" value={form.phone} placeholder="9XXXXXXXXX" />
                </div>
              </div>
            </motion.section>

            {/* Delivery */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-8 rounded-xl bg-brand-forest text-white flex items-center justify-center font-mono text-[11px] font-bold">2</div>
                <h2 className="font-serif text-2xl text-stone-900">Delivery Address</h2>
              </div>
              <div className="space-y-6">
                <Field label="Street Address / Flat No." field="address" value={form.address} placeholder="123, Park Lane, Sector 5" />
                <div className="grid grid-cols-2 gap-6">
                  <Field label="City" field="city" value={form.city} placeholder="Chennai" />
                  <Field label="State" field="state" value={form.state} placeholder="Tamil Nadu" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <Field label="Pincode" field="pincode" value={form.pincode} placeholder="600001" />
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

              {paymentMethod === 'upi' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <Field label="UPI ID" field="upiId" value={form.upiId} placeholder="yourname@upi" />
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-100">
                    <Shield className="w-4 h-4 text-brand-sage shrink-0" />
                    <p className="text-[12px] text-stone-600 font-light">Payments encrypted via 256-bit SSL. We never store your UPI ID.</p>
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'card' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <Field label="Card Number" field="cardNumber" value={form.cardNumber} placeholder="1234 5678 9012 3456" />
                  <Field label="Name on Card" field="cardName" value={form.cardName} placeholder="ARJUN SHARMA" />
                  <div className="grid grid-cols-2 gap-6">
                    <Field label="Expiry (MM/YY)" field="cardExpiry" value={form.cardExpiry} placeholder="12/27" />
                    <Field label="CVV" field="cardCvv" value={form.cardCvv} type="password" placeholder="•••" />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-100">
                    <Shield className="w-4 h-4 text-brand-sage shrink-0" />
                    <p className="text-[12px] text-stone-600 font-light">256-bit SSL encryption. Card details are never stored on our servers.</p>
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'cod' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-white rounded-2xl border border-stone-100">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-forest mb-2">Cash on Delivery</p>
                  <p className="text-[13px] text-stone-600 leading-relaxed font-light mb-4">
                    Pay in cash when your order arrives. Please keep exact change ready. Available on orders up to ₹2,000.
                  </p>
                  <div className="px-4 py-3 bg-brand-gold/10 border border-brand-gold/30 rounded-xl">
                    <p className="font-mono text-[10px] text-stone-700 tracking-wider">Additional ₹20 COD handling charge.</p>
                  </div>
                </motion.div>
              )}
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
                    className={`w-full py-4.5 rounded-xl font-mono text-[10px] uppercase tracking-[0.3em] transition-all shadow-lg ${
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
