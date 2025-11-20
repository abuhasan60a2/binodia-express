import { useEffect, useState, useRef } from 'react';
import { useCart } from '../hooks/useCart.jsx';
import { formatBDT } from '../utils/currency.js';
import { useToast } from './Toast.jsx';
import QuantityStepper from './QuantityStepper.jsx';

export default function FoodModal({ food, categoryMap, isOpen, onClose }) {
  const { addItem, state, increment, decrement } = useCart();
  const { add } = useToast();
  const [qty, setQty] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const modalRef = useRef(null);
  const inCart = food ? state.items.find((i) => i.id === food.id) : null;
  
  // Try to get category name - handle both string IDs and Firestore references
  let categoryName = null;
  if (food && categoryMap && food.category) {
    // Extract category ID - handle Firestore references, strings, and other types
    let categoryId = food.category;
    
    // If it's a Firestore DocumentReference, extract the ID
    if (food.category?.id) {
      categoryId = food.category.id;
    } else if (food.category?.path) {
      // Extract ID from Firestore reference path (e.g., "Categories/abc123" -> "abc123")
      categoryId = food.category.path.split('/').pop();
    }
    
    // Normalize to string and trim
    const normalizedId = String(categoryId || '').trim();
    
    // Try multiple lookup strategies
    categoryName = categoryMap.get(normalizedId) || 
                   categoryMap.get(categoryId) || 
                   categoryMap.get(String(categoryId));
  }

  useEffect(() => {
    if (inCart && food) {
      setQty(inCart.quantity);
    } else if (food) {
      setQty(1);
    }
  }, [inCart, food]);

  useEffect(() => {
    if (isOpen) {
      setLoaded(false);
      // Trap focus in modal
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen || !food) return null;

  const handleAddToCart = () => {
    addItem({ 
      id: food.id, 
      name: food.name, 
      price: food.price, 
      image_url: food.image_url, 
      quantity: qty 
    });
    add('Added to cart', 'success');
  };

  const handleIncrement = () => {
    increment(food.id);
    add('Added to cart', 'success');
  };

  const handleDecrement = () => {
    decrement(food.id);
    add('Removed one from cart', 'info');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-[modalIn_200ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-[modalIn_200ms_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="food-modal-title"
          tabIndex={-1}
        >
          <div className="relative">
            {/* Image */}
            <div className="aspect-video bg-gray-100 overflow-hidden relative">
              <img
                src={food.image_url || '/logo.jpeg'}
                alt={food.name || 'Food item'}
                loading="eager"
                onLoad={() => setLoaded(true)}
                onError={(e) => {
                  e.target.src = '/logo.jpeg';
                  setLoaded(true);
                }}
                className={[
                  'h-full w-full object-cover transition-all duration-300',
                  loaded ? 'blur-0 scale-100' : 'blur-sm scale-[1.02]'
                ].join(' ')}
              />
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 id="food-modal-title" className="text-2xl font-bold text-gray-900 mb-2">{food.name}</h2>
              
              {categoryName && (
                <span className="inline-block mb-3 px-3 py-1 text-sm font-medium rounded-full bg-emerald-600 text-white">
                  {categoryName}
                </span>
              )}
              
              {food.description && (
                <p className="text-gray-600 mb-4 leading-relaxed">{food.description}</p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{formatBDT(food.price)}</p>
                  <p className="text-sm text-gray-500 mt-1">Per item</p>
                </div>

                {inCart ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleDecrement}
                        className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span aria-live="polite" className="min-w-8 text-center font-semibold text-gray-900">{inCart.quantity}</span>
                      <button
                        type="button"
                        onClick={handleIncrement}
                        className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-600">In cart</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <QuantityStepper value={qty} onChange={setQty} min={1} />
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="px-6 py-3 rounded-lg bg-emerald-900 text-white hover:bg-emerald-800 transition-colors font-semibold"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

