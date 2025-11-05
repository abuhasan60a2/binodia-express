import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import CategoryBadge from '../components/CategoryBadge.jsx';
import { useCategories } from '../hooks/useCategories.js';
import { useFoods } from '../hooks/useFoods.js';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => { document.title = 'Binodia Express – Home'; }, []);
  const { categories } = useCategories();
  const { foods } = useFoods();

  const counts = foods.reduce((acc, f) => {
    const key = f.category || 'Other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const featured = categories
    .map((c) => ({ ...c, count: counts[c.name] || 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
          <div className="mx-auto max-w-6xl px-4 py-20 flex flex-col items-center text-center gap-6">
            <img src="/logo.jpeg" alt="Logo" className="h-20 w-20 rounded-2xl shadow-lg object-cover" />
            <h1 className="text-4xl sm:text-5xl font-extrabold">Taste the Premium Difference</h1>
            <p className="text-white/90 max-w-2xl">Freshly prepared dishes, fast service, and a menu curated for every craving.</p>
            <div className="flex items-center gap-3">
              <Link to="/menu" className="px-5 py-3 rounded-lg bg-white text-primary-700 font-semibold hover:bg-white/90 transition-colors">
                Browse Menu
              </Link>
              <a href="#featured" className="px-5 py-3 rounded-lg border border-white/30 hover:bg-white/10 transition-colors">Featured</a>
            </div>
          </div>
        </section>

        <section id="featured" className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Categories</h2>
          <div className="flex flex-wrap gap-3">
            {featured.map((c, idx) => (
              <CategoryBadge key={`${c.id}-${idx}`} label={`${c.name} · ${c.count}`} active={true} onToggle={() => {}} />
            ))}
            {!featured.length && (
              <p className="text-gray-500">Categories will appear once items are available.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


