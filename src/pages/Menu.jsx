import { useEffect, useMemo, useState } from 'react';
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
  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => {
      map.set(c.id, c.name);
    });
    // Debug: Log category structure
    if (categories.length > 0) {
      console.log('📋 Categories loaded:', categories.map(c => ({ id: c.id, name: c.name, allKeys: Object.keys(c) })));
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

  const filtered = useMemo(() => {
    const lower = search.trim().toLowerCase();
    const hasFilter = selected.size > 0;
    
    // Debug logging - expand arrays for inspection
    if (hasFilter && foods.length > 0) {
      const selectedIds = Array.from(selected);
      const firstFood = foods[0];
      console.log('🔍 Filtering Debug:');
      console.log('  Selected IDs:', selectedIds);
      console.log('  First food category:', firstFood?.category);
      console.log('  Will match?', selectedIds.some(id => String(id).trim() === String(firstFood?.category || '').trim()));
      console.log('  Burger category ID:', categories.find(c => c.name === 'Burger')?.id);
    }
    
    return foods.filter((f) => {
      // Compare food.category (ID) with selected category IDs
      // Ensure both are strings for comparison
      const foodCategoryId = String(f.category || '').trim();
      const inCategory = hasFilter 
        ? Array.from(selected).some(selectedId => String(selectedId).trim() === foodCategoryId)
        : true;
      const inSearch = lower ? ((f.name || '').toLowerCase().includes(lower) || (f.description || '').toLowerCase().includes(lower)) : true;
      return inCategory && inSearch;
    });
  }, [foods, selected, search, categoryMap]);

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
            placeholder="Search by name or description"
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


