import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, ShoppingCart, Heart, Sun, Moon, Menu, X, BookOpen,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useThemeStore } from '../../store/themeStore';
import { useSearch } from '../../hooks/useSearch';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { query, setQuery, results } = useSearch();

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-cream-100/95 dark:bg-charcoal-800/95 backdrop-blur-md border-b border-cream-300 dark:border-charcoal-600 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="Maktaba Home">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-md group-hover:shadow-gold-400/30 transition-shadow duration-300">
              <BookOpen className="text-charcoal-900" size={18} strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-lg text-charcoal-700 dark:text-cream-100 tracking-tight">Maktaba</span>
              <span className="text-[10px] text-gold-500 font-body tracking-widest">مكتبة</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {[
              { to: '/', label: 'Home' },
              { to: '/books', label: 'Books' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  location.pathname === to
                    ? 'text-gold-600 dark:text-gold-400 bg-gold-500/10'
                    : 'text-charcoal-600 dark:text-cream-300 hover:text-charcoal-900 dark:hover:text-cream-100 hover:bg-black/5 dark:hover:bg-white/5',
                ].join(' ')}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Search Bar — desktop */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-md relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 dark:text-cream-500 pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search books, authors..."
                  aria-label="Search books"
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-cream-200 dark:bg-charcoal-700 border border-transparent focus:border-gold-400 focus:bg-white dark:focus:bg-charcoal-600 text-charcoal-700 dark:text-cream-100 placeholder-charcoal-400 dark:placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-gold-400/30 transition-all duration-200"
                />
              </div>
            </form>

            {/* Search Dropdown */}
            {searchOpen && query && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-charcoal-700 rounded-xl shadow-xl border border-cream-200 dark:border-charcoal-500 overflow-hidden z-50 animate-slide-down">
                {results.slice(0, 5).map((book) => (
                  <button
                    key={book.id}
                    onClick={() => {
                      navigate(`/books/${book.id}`);
                      setQuery('');
                      setSearchOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cream-100 dark:hover:bg-charcoal-600 transition-colors text-left"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-8 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal-700 dark:text-cream-100 truncate">{book.title}</p>
                      <p className="text-xs text-charcoal-400 dark:text-cream-500 truncate">{book.author}</p>
                    </div>
                    <span className="text-xs font-semibold text-gold-600 dark:text-gold-400">${book.price}</span>
                  </button>
                ))}
                {results.length > 5 && (
                  <button
                    onClick={handleSearch as unknown as React.MouseEventHandler}
                    className="w-full px-4 py-2.5 text-sm text-center text-gold-600 dark:text-gold-400 hover:bg-cream-100 dark:hover:bg-charcoal-600 border-t border-cream-200 dark:border-charcoal-500 transition-colors"
                  >
                    View all {results.length} results
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-charcoal-500 dark:text-cream-400 hover:bg-black/5 dark:hover:bg-white/8 transition-all duration-200"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg text-charcoal-500 dark:text-cream-400 hover:bg-black/5 dark:hover:bg-white/8 transition-all duration-200"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-gold-500 text-charcoal-900 text-[10px] font-bold flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-charcoal-500 dark:text-cream-400 hover:bg-black/5 dark:hover:bg-white/8 transition-all duration-200"
              aria-label={`Cart (${totalItems} items)`}
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-charcoal-700 dark:bg-gold-500 text-cream-100 dark:text-charcoal-900 text-[10px] font-bold flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-charcoal-500 dark:text-cream-400 hover:bg-black/5 dark:hover:bg-white/8 transition-all duration-200"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-cream-200 dark:border-charcoal-600 animate-slide-down">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 dark:text-cream-500 pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search books..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-cream-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-100 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/books', label: 'Books' },
                { to: '/wishlist', label: `Wishlist (${wishlistCount})` },
                { to: '/cart', label: `Cart (${totalItems})` },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-charcoal-600 dark:text-cream-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
