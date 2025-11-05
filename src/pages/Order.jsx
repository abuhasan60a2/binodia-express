import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { db } from '../config/firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { formatBDT } from '../utils/currency.js';

export default function Order() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = 'Binodia Express – Order Confirmation'; }, []);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, 'Orders', id));
        if (mounted) {
          if (snap.exists()) {
            const data = snap.data();
            setOrder({ id: snap.id, ...data });
          } else {
            setOrder(null);
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        if (mounted) setOrder(null);
      } finally { 
        if (mounted) setLoading(false); 
      }
    }
    run();
    return () => { mounted = false; };
  }, [id]);

  const shortId = (id || '').slice(-6).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900">Thank you for your order!</h1>
          <p className="text-gray-600 mt-2">Order ID: <span className="font-mono font-semibold">{shortId}</span></p>

          {loading ? (
            <div className="mt-6 h-24 bg-gray-100 animate-pulse rounded-lg" />
          ) : order ? (
            <div className="mt-6 text-left space-y-4">
              <div>
                <h2 className="font-semibold text-gray-900 mb-2">Order Summary</h2>
                {order.foods && order.foods.length > 0 ? (
                  <ul className="mt-2 divide-y border border-gray-200 rounded-lg overflow-hidden">
                    {order.foods.map((f, idx) => (
                      <li key={f.id || idx} className="flex items-center justify-between px-4 py-3 text-sm bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span className="text-gray-800">{f.name || 'Unknown item'} × {f.quantity || 1}</span>
                        <span className="text-gray-900 font-medium">{formatBDT((f.price || 0) * (f.quantity || 1))}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm mt-2">No items found in order.</p>
                )}
              </div>
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatBDT(order.totalprice || 0)}</span>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-rose-600">Order not found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


