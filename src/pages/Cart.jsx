import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useCart } from '../hooks/useCart.jsx';
import { Link } from 'react-router-dom';
import { formatBDT } from '../utils/currency.js';

export default function Cart() {
  useEffect(() => { document.title = 'Binodia Express – Cart'; }, []);
  const { state, subtotal, total, increment, decrement, removeItem } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Your Cart</h1>
          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img 
                    src={item.image_url || '/logo.jpeg'} 
                    alt={item.name || 'Food item'} 
                    className="h-16 w-24 sm:h-16 sm:w-24 object-cover rounded flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/logo.jpeg';
                    }}
                  />
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">Unit: {formatBDT(item.price)}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
                    <div className="flex items-center gap-3">
                      <button aria-label="Decrease" onClick={() => decrement(item.id)} className="px-2 py-1 rounded border bg-white hover:bg-gray-50 transition-colors">−</button>
                      <span aria-live="polite" className="min-w-6 text-center">{item.quantity}</span>
                      <button aria-label="Increase" onClick={() => increment(item.id)} className="px-2 py-1 rounded border bg-white hover:bg-gray-50 transition-colors">+</button>
                    </div>
                    <div className="text-right sm:text-left">
                      <div className="font-semibold text-gray-900">{formatBDT(item.price * item.quantity)}</div>
                      <button onClick={() => removeItem(item.id)} className="text-xs sm:text-sm text-rose-600 hover:underline mt-1">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {state.items.length === 0 && (
              <p className="text-gray-500">Your cart is empty.</p>
            )}
          </div>
        </section>

        <aside className="bg-white rounded-lg border border-gray-200 p-4 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatBDT(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Delivery Fee</span><span>{formatBDT(state.deliveryFee)}</span></div>
            <div className="pt-2 border-t flex justify-between font-semibold text-gray-900"><span>Total</span><span>{formatBDT(total)}</span></div>
          </div>
          <Link
            to="/checkout"
            className={[
              'mt-4 inline-flex w-full items-center justify-center rounded-lg px-4 py-2',
              state.items.length ? 'bg-emerald-900 hover:bg-emerald-800 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed',
            ].join(' ')}
          >
            Checkout
          </Link>
        </aside>
      </main>
      <Footer />
    </div>
  );
}


