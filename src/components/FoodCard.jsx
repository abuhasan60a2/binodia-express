import { useState } from 'react';
import { formatBDT } from '../utils/currency.js';
import FoodModal from './FoodModal.jsx';

export default function FoodCard({ food, categoryMap }) {
  const [loaded, setLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Try to get category name - handle both string IDs and Firestore references
  let categoryName = null;
  if (categoryMap && food.category) {
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
    
    // Debug logging (remove after fixing)
    if (!categoryName) {
      console.log('FoodCard Debug - Category not found:', {
        foodId: food.id,
        foodName: food.name,
        foodCategory: food.category,
        foodCategoryType: typeof food.category,
        extractedCategoryId: categoryId,
        normalizedId: normalizedId,
        categoryMapKeys: Array.from(categoryMap.keys()),
        categoryMapSize: categoryMap.size
      });
    }
  }

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
            <span className="inline-block mb-2 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-600 text-white">
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


