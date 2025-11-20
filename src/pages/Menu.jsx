import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import CategoryBadge from '../components/CategoryBadge.jsx';
import FoodCard from '../components/FoodCard.jsx';
import { useCategories } from '../hooks/useCategories.js';
import { useFoods } from '../hooks/useFoods.js';
import { debounce } from '../utils/debounce.js';

export default function Menu() {
  useEffect(() => { document.title = 'Binodia Express – Menu'; }, []);
  const { categories, loading: catLoading, error: catError } = useCategories();
  const { foods, loading: foodLoading, error: foodError } = useFoods();

  const [selected, setSelected] = useState(() => new Set()); // Store category IDs
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');

  const setSearchDebounced = useMemo(() => debounce((v) => setSearch(v), 250), []);

  // Create a map for quick category lookup: categoryId -> categoryName
  // Normalize keys to strings for consistent matching
  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => {
      const key = String(c.id || '').trim();
      if (key) {
        map.set(key, c.name);
        // Also store with the original ID type for flexibility
        if (c.id !== key) {
          map.set(c.id, c.name);
        }
      }
    });
    // Debug: Log category structure
    if (categories.length > 0) {
      console.log('📋 Categories loaded:', categories.map(c => ({ id: c.id, name: c.name, allKeys: Object.keys(c) })));
      console.log('📋 CategoryMap keys:', Array.from(map.keys()));
    }
    return map;
  }, [categories]);

  const toggle = (categoryId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const sortedCategories = useMemo(() => {
    // Deduplicate categories by name (case-insensitive) and sort alphabetically
    const seen = new Set();
    const unique = categories.filter((c) => {
      const key = (c.name || '').trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return unique.sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }));
  }, [categories]);

  // Prepare foods with category names for fuzzy search
  const searchableFoods = useMemo(() => {
    return foods.map((f) => {
      // Extract category ID and get category name
      let categoryId = f.category;
      if (f.category?.id) {
        categoryId = f.category.id;
      } else if (f.category?.path) {
        categoryId = f.category.path.split('/').pop();
      }
      const normalizedCategoryId = String(categoryId || '').trim();
      const categoryName = categoryMap.get(normalizedCategoryId) || categoryMap.get(categoryId) || '';
      
      return {
        ...f,
        categoryName: categoryName,
        // Convert price to string for searching
        priceString: String(f.price || ''),
      };
    });
  }, [foods, categoryMap]);

  // Create Fuse instance for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(searchableFoods, {
      keys: [
        { name: 'name', weight: 0.4 },           // Highest weight for name
        { name: 'description', weight: 0.3 },    // Medium weight for description
        { name: 'categoryName', weight: 0.2 },   // Lower weight for category
        { name: 'priceString', weight: 0.1 },    // Lowest weight for price
      ],
      threshold: 0.4,        // 0.0 = perfect match, 1.0 = match anything (0.4 = good fuzzy matching)
      distance: 100,          // Maximum distance to search in the text
      ignoreLocation: true,   // Search anywhere in the text
      minMatchCharLength: 1,  // Minimum character length to match
      includeScore: true,     // Include relevance scores
      shouldSort: true,       // Sort results by relevance
    });
  }, [searchableFoods]);

  const filtered = useMemo(() => {
    const hasCategoryFilter = selected.size > 0;
    const hasSearchQuery = search.trim().length > 0;
    
    // First, filter by category if any categories are selected
    let categoryFiltered = hasCategoryFilter
      ? searchableFoods.filter((f) => {
          let categoryId = f.category;
          if (f.category?.id) {
            categoryId = f.category.id;
          } else if (f.category?.path) {
            categoryId = f.category.path.split('/').pop();
          }
          const foodCategoryId = String(categoryId || '').trim();
          return Array.from(selected).some(selectedId => String(selectedId).trim() === foodCategoryId);
        })
      : searchableFoods;
    
    // Then apply fuzzy search if there's a search query
    if (hasSearchQuery) {
      const searchResults = fuse.search(search.trim());
      const searchResultIds = new Set(searchResults.map(result => result.item.id));
      
      // Filter category-filtered results to only include those that match the search
      categoryFiltered = categoryFiltered.filter(f => searchResultIds.has(f.id));
      
      // Sort by search relevance (best matches first)
      const resultMap = new Map(searchResults.map(r => [r.item.id, r.score]));
      categoryFiltered.sort((a, b) => {
        const scoreA = resultMap.get(a.id) ?? 1;
        const scoreB = resultMap.get(b.id) ?? 1;
        return scoreA - scoreB; // Lower score = better match
      });
    }
    
    return categoryFiltered;
  }, [searchableFoods, selected, search, fuse]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {sortedCategories.map((c, idx) => (
            <CategoryBadge key={`${c.id}-${idx}`} label={c.name} active={selected.has(c.id)} onToggle={() => toggle(c.id)} />
          ))}
          {selected.size > 0 && (
            <button type="button" onClick={() => setSelected(new Set())} className="text-sm text-emerald-900 hover:underline font-medium">
              Clear filters
            </button>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1" htmlFor="search">Search dishes</label>
          <input
            id="search"
            type="search"
            placeholder="Search by name, description, category, or price (fuzzy search)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchDebounced(e.target.value); }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {(catError || foodError) && (
          <div className="text-rose-700 bg-rose-50 border border-rose-200 px-4 py-3 rounded-lg mb-6">Failed to load menu. Please try again.</div>
        )}

        {(catLoading || foodLoading) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((f) => (
              <FoodCard key={f.id} food={f} categoryMap={categoryMap} />
            ))}
            {filtered.length === 0 && (
              <p className="text-gray-500">No matching items.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}


