import { useState } from 'react';
import { formatBDT } from '../utils/currency.js';
import FoodModal from './FoodModal.jsx';

export default function FoodCard({ food, categoryMap }) {
  const [loaded, setLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categoryName = categoryMap?.get(food.category) || null;

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-transform hover:-translate-y-0.5 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
        aria-label={`View details for ${food.name}`}
      >
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={food.image_url || '/logo.jpeg'}
            alt={food.name || 'Food item'}
            loading="lazy"
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
        </div>
        <div className="p-4">
          {categoryName && (
            <span className="inline-block mb-2 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
              {categoryName}
            </span>
          )}
          <h3 className="font-semibold text-gray-900 line-clamp-1">{food.name}</h3>
          {food.description ? (
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{food.description}</p>
          ) : null}
          <div className="mt-3">
            <p className="font-semibold text-gray-900">{formatBDT(food.price)}</p>
          </div>
        </div>
      </div>
      
      <FoodModal 
        food={food} 
        categoryMap={categoryMap}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}


