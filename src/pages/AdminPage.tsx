import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Package, Leaf, ChevronDown, Trash2, Eye, EyeOff, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Order, OrderStatus } from '../lib/supabase';

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered'];
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
};

// ── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError('Invalid email or password.'); return; }
    onLogin();
  };

  return (
    <div className="min-h-screen bg-brand-parchment flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-brand-forest flex items-center justify-center">
            <Leaf className="w-4 h-4 text-brand-gold" strokeWidth={1.5} />
          </div>
          <span className="font-sans text-[14px] font-600 tracking-[0.12em] uppercase text-brand-forest">
            Millet<span className="opacity-50 font-400">Fam</span>
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/60 shadow-xl shadow-stone-200/50 overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-stone-100 bg-brand-forest">
            <p className="font-mono text-[9px] uppercase tracking-[0.45em] text-white/50 mb-1">Admin Portal</p>
            <p className="font-serif text-xl text-white">Sign in</p>
          </div>

          <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@millefam.com"
                required
                className="w-full bg-transparent border-b-2 border-stone-300 focus:border-brand-forest py-2.5 text-stone-900 text-[14px] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border-b-2 border-stone-300 focus:border-brand-forest py-2.5 text-stone-900 text-[14px] focus:outline-none transition-colors pr-8"
                />
                <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-0 top-2.5 text-stone-400 hover:text-stone-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="font-mono text-[10px] text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-brand-forest text-white font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-brand-moss transition-colors shadow-lg shadow-brand-forest/15 disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ── Order Row ────────────────────────────────────────────────────────────────

function OrderRow({ order, onStatusChange, onDelete, onView }: {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
  onDelete: (id: string, orderNumber: string) => Promise<void>;
  onView: (order: Order) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setUpdating(true);
    await onStatusChange(order.id, newStatus);
    setUpdating(false);
  };

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${order.is_new ? 'bg-amber-50/40' : ''}`}
    >
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          {order.is_new && <div className="w-2 h-2 rounded-full bg-brand-gold shrink-0" />}
          <span className="font-mono text-[11px] text-brand-forest font-medium">{order.order_number}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="text-[13px] text-stone-900 font-medium">{order.customer_name}</p>
        <p className="font-mono text-[10px] text-stone-400">{order.phone}</p>
      </td>
      <td className="px-4 py-4 hidden md:table-cell">
        <p className="text-[12px] text-stone-600 max-w-[180px] truncate">
          {order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
        </p>
      </td>
      <td className="px-4 py-4">
        <span className="num text-[13px] font-medium text-stone-900">₹{order.grand_total}</span>
      </td>
      <td className="px-4 py-4 hidden sm:table-cell">
        <span className="font-mono text-[9px] uppercase tracking-wider text-stone-500">{order.payment_method}</span>
      </td>
      <td className="px-4 py-4">
        <div className="relative">
          <select
            value={order.status}
            onChange={e => handleStatusChange(e.target.value as OrderStatus)}
            disabled={updating}
            className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg border text-[11px] font-mono uppercase tracking-wider cursor-pointer focus:outline-none ${STATUS_COLORS[order.status]} disabled:opacity-60`}
          >
            {STATUS_FLOW.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-2 w-3 h-3 pointer-events-none opacity-60" />
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="font-mono text-[10px] text-stone-400">
          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
        </p>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button onClick={() => onView(order)} className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors">
            <Eye className="w-3.5 h-3.5 text-stone-500" />
          </button>
          <button onClick={() => onDelete(order.id, order.order_number)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

// ── Order Detail Modal ───────────────────────────────────────────────────────

function OrderDetail({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-stone-100 bg-brand-forest flex items-center justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/50">Order Details</p>
            <p className="font-mono text-[16px] text-brand-gold mt-0.5">{order.order_number}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono uppercase tracking-wider ${STATUS_COLORS[order.status]}`}>
            {order.status}
          </span>
        </div>

        <div className="px-8 py-6 space-y-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-stone-400 mb-3">Customer</p>
            <div className="space-y-1.5">
              <p className="text-[14px] text-stone-900 font-medium">{order.customer_name}</p>
              <p className="font-mono text-[12px] text-stone-500">{order.email}</p>
              <p className="font-mono text-[12px] text-stone-500">{order.phone}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-stone-400 mb-3">Delivery Address</p>
            <p className="text-[13px] text-stone-700 leading-relaxed">
              {order.address}, {order.city}, {order.state} — {order.pincode}
            </p>
          </div>

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-stone-400 mb-3">Items</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-stone-100">
                  <span className="text-[13px] text-stone-800">{item.name} <span className="text-stone-400">×{item.quantity}</span></span>
                  <span className="num text-[13px] font-medium text-stone-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-stone-50 rounded-2xl p-5 space-y-2">
            <div className="flex justify-between text-[12px]">
              <span className="font-mono text-stone-500 uppercase tracking-wider">Subtotal</span>
              <span className="num text-stone-700">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="font-mono text-stone-500 uppercase tracking-wider">Delivery</span>
              <span className="num text-stone-700">₹{order.delivery_fee}</span>
            </div>
            <div className="flex justify-between text-[13px] font-medium pt-2 border-t border-stone-200">
              <span className="font-mono text-stone-800 uppercase tracking-wider">Total</span>
              <span className="num text-brand-forest">₹{order.grand_total}</span>
            </div>
          </div>

          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-stone-400 mb-2">Payment</p>
            <p className="font-mono text-[12px] text-stone-700 uppercase tracking-wider">{order.payment_method}</p>
            {order.payment_note && (
              <p className="font-mono text-[12px] text-brand-forest mt-1">{order.payment_note}</p>
            )}
          </div>

          <p className="font-mono text-[10px] text-stone-300 text-center">
            Placed on {new Date(order.created_at).toLocaleString('en-IN')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newCount, setNewCount] = useState(0);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) {
      setOrders(data as Order[]);
      setNewCount(data.filter((o: Order) => o.is_new).length);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Realtime subscription for new orders
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleView = async (order: Order) => {
    setSelectedOrder(order);
    if (order.is_new) {
      await supabase.from('orders').update({ is_new: false }).eq('id', order.id);
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, is_new: false } : o));
      setNewCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleDelete = async (id: string, orderNumber: string) => {
    if (!window.confirm(`Delete order ${orderNumber}? This cannot be undone.`)) return;
    await supabase.from('orders').delete().eq('id', id);
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-brand-parchment">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-forest flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-brand-gold" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-sans text-[13px] font-600 tracking-[0.12em] uppercase text-brand-forest">
                Millet<span className="font-400 opacity-50">Fam</span>
              </p>
              <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-stone-400">Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {newCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-gold/15 border border-brand-gold/30 rounded-full">
                <Bell className="w-3 h-3 text-brand-gold" />
                <span className="font-mono text-[10px] text-stone-700 tracking-wider">
                  <span className="num font-medium">{newCount}</span> new
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-stone-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {([
            { label: 'Total Orders', val: orders.length },
            { label: 'New', val: newCount },
            { label: 'Pending', val: orders.filter(o => o.status === 'pending').length },
            { label: 'Delivered', val: orders.filter(o => o.status === 'delivered').length },
          ] as const).map(({ label, val }) => (
            <div key={label} className="bg-white rounded-2xl border border-stone-200/60 px-6 py-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-stone-400 mb-2">{label}</p>
              <p className="num text-[32px] font-medium text-brand-forest leading-none">{val}</p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden">
          <div className="px-7 py-5 border-b border-stone-100 bg-brand-forest">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/70">All Orders</p>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-6 h-6 border-2 border-stone-200 border-t-brand-forest rounded-full mx-auto"
              />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center">
              <Package className="w-8 h-8 text-stone-200 mx-auto mb-3" />
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-stone-300">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100">
                    {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-[0.3em] text-stone-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                      onView={handleView}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
  }, []);

  if (session === null) return null; // loading

  return session
    ? <Dashboard onLogout={() => setSession(false)} />
    : <LoginScreen onLogin={() => setSession(true)} />;
}
