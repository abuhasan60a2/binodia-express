import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { db } from '../config/firebase.js';
import { doc, onSnapshot } from 'firebase/firestore';
import { formatBDT } from '../utils/currency.js';

export default function Order() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = 'Binodia Express – Order Tracking'; }, []);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    const orderRef = doc(db, 'Orders', id);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(
      orderRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setOrder({ id: snap.id, ...data });
        } else {
          setOrder(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching order:', error);
        setOrder(null);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [id]);

  const shortId = (id || '').slice(-6).toUpperCase();
  
  // Status configuration
  const statuses = [
    { key: 'initiated', label: 'Order Initiated', icon: '📦' },
    { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'out for delivery', label: 'Out for Delivery', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '✅' },
  ];
  
  const currentStatus = order?.status || 'initiated';
  const currentStatusIndex = statuses.findIndex(s => s.key === currentStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-gray-900">Thank you for your order!</h1>
            <p className="text-gray-600 mt-2">Order ID: <span className="font-mono font-semibold">{shortId}</span></p>
          </div>

          {loading ? (
            <div className="mt-6 h-24 bg-gray-100 animate-pulse rounded-lg" />
          ) : order ? (
            <>
              {/* Order Status Tracker */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                  
                  <div className="space-y-6">
                    {statuses.map((status, index) => {
                      const isActive = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      
                      return (
                        <div key={status.key} className="relative flex items-start gap-4">
                          {/* Status icon */}
                          <div className={[
                            'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300',
                            isActive 
                              ? 'bg-emerald-600 border-emerald-600 text-white scale-110' 
                              : 'bg-white border-gray-300 text-gray-400'
                          ].join(' ')}>
                            <span className="text-sm">{status.icon}</span>
                          </div>
                          
                          {/* Status content */}
                          <div className="flex-1 pt-1">
                            <div className={[
                              'font-medium transition-colors duration-300',
                              isActive ? 'text-gray-900' : 'text-gray-400'
                            ].join(' ')}>
                              {status.label}
                            </div>
                            {isCurrent && isActive && (
                              <div className="mt-1 text-sm text-emerald-600 font-medium animate-pulse">
                                Current status
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
                {order.foods && order.foods.length > 0 ? (
                  <ul className="divide-y border border-gray-200 rounded-lg overflow-hidden">
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
                <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-lg font-semibold text-gray-900 mt-4">
                  <span>Total</span>
                  <span>{formatBDT(order.totalprice || 0)}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-6 text-rose-600 text-center">Order not found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


