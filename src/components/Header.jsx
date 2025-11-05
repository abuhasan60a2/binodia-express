import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../hooks/useCart.jsx';

export default function Header() {
  const { state } = useCart();
  const count = state.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/menu" className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="Logo" className="h-9 w-9 rounded-lg object-cover" loading="lazy" />
          <span className="font-semibold text-gray-900">Binodia Express</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <NavLink to="/menu" className={({ isActive }) => isActive ? 'text-emerald-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}>
            Menu
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'text-emerald-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}>
            Cart
            <span aria-hidden className="ml-2 inline-flex items-center justify-center text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
              {count}
            </span>
          </NavLink>
        </nav>
        <Link to="/cart" className="sm:hidden inline-flex items-center text-sm px-3 py-1.5 rounded-lg bg-emerald-900 text-white hover:bg-emerald-800 transition-colors relative">
          Cart
          {count > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center text-xs w-5 h-5 rounded-full bg-rose-500 text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}


