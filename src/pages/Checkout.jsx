import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useCart } from '../hooks/useCart.jsx';
import { formatBDT } from '../utils/currency.js';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { useToast } from '../components/Toast.jsx';

export default function Checkout() {
  useEffect(() => { document.title = 'Binodia Express – Checkout'; }, []);
  const { state, subtotal, total, clearCart } = useCart();
  const { add } = useToast();
  const nav = useNavigate();

  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', instructions: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const order = {
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim(),
        address: form.address.trim(),
        instructions: form.instructions.trim() || undefined,
        foods: state.items.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
        totalprice: Number(total),
        status: 'initiated',
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'Orders'), order);
      const shortId = docRef.id.slice(-6).toUpperCase();
      add(`Order placed! ID: ${shortId}`, 'success');
      clearCart();
      nav(`/order/${docRef.id}`);
    } catch (err) {
      add('Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Checkout</h1>
          <form onSubmit={submit} className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1" htmlFor="name">Name *</label>
              <input 
                id="name" 
                value={form.name} 
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }} 
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                  errors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1" htmlFor="phone">Phone *</label>
                <input 
                  id="phone" 
                  value={form.phone} 
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }} 
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.phone ? 'border-rose-300 focus:ring-rose-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1" htmlFor="email">Email</label>
                <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1" htmlFor="address">Address *</label>
              <textarea 
                id="address" 
                rows={3} 
                value={form.address} 
                onChange={(e) => {
                  setForm({ ...form, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: '' });
                }} 
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                  errors.address ? 'border-rose-300 focus:ring-rose-500' : 'border-gray-300'
                }`}
              />
              {errors.address && <p className="text-xs text-rose-600 mt-1">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1" htmlFor="instructions">Instructions</label>
              <textarea id="instructions" rows={2} value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            </div>

            <button
              type="submit"
              disabled={submitting || state.items.length === 0}
              className={[
                'inline-flex items-center px-4 py-2 rounded-lg',
                submitting || state.items.length === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-emerald-900 text-white hover:bg-emerald-800',
              ].join(' ')}
            >
              {submitting ? 'Placing Order…' : 'Place Order'}
            </button>
          </form>
        </section>

        <aside className="bg-white rounded-lg border border-gray-200 p-4 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatBDT(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Delivery Fee</span><span>{formatBDT(state.deliveryFee)}</span></div>
            <div className="pt-2 border-t flex justify-between font-semibold text-gray-900"><span>Total</span><span>{formatBDT(total)}</span></div>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}


