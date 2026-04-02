import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { books as allBooks } from '../data/books';
import type { FilterState, Genre, SortOption } from '../types';
import { defaultFilterState } from '../types';
import { useFilter } from '../hooks/useFilter';
import { BookGrid } from '../components/books/BookGrid';
import { Sidebar } from '../components/layout/Sidebar';
import { Button } from '../components/ui/Button';

const BOOKS_PER_PAGE = 12;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'bestseller', label: 'Bestsellers' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export const BooksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const genre = searchParams.get('genre') as Genre | null;
    const sort = searchParams.get('sort') as SortOption | null;
    return {
      ...defaultFilterState,
      genres: genre ? [genre] : [],
      sortBy: sort || 'newest',
    };
  });

  // Simulate async loading on filter change
  useEffect(() => {
    setLoading(true);
    setPage(1);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [filters]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const filtered = useFilter(allBooks, filters);
  const totalPages = Math.ceil(filtered.length / BOOKS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE);

  const handleFiltersChange = (next: FilterState) => {
    setFilters(next);
  };

  const activeFilterChips = [
    ...filters.genres.map((g) => ({ label: g, onRemove: () => setFilters((f) => ({ ...f, genres: f.genres.filter((x) => x !== g) })) })),
    filters.inStockOnly ? { label: 'In Stock', onRemove: () => setFilters((f) => ({ ...f, inStockOnly: false })) } : null,
    filters.minRating > 0 ? { label: `★ ${filters.minRating}+`, onRemove: () => setFilters((f) => ({ ...f, minRating: 0 })) } : null,
    filters.language !== 'All' ? { label: filters.language, onRemove: () => setFilters((f) => ({ ...f, language: 'All' })) } : null,
  ].filter(Boolean) as { label: string; onRemove: () => void }[];

  return (
    <main className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-charcoal-700 dark:text-cream-100 mb-2">
        Browse Books
      </h1>
      <p className="text-charcoal-400 dark:text-cream-500 mb-6">
        {filtered.length} book{filtered.length !== 1 ? 's' : ''} found
      </p>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <Sidebar filters={filters} onChange={handleFiltersChange} totalResults={filtered.length} />
          </div>
        </div>

        {/* Mobile Sidebar */}
        <Sidebar
          filters={filters}
          onChange={handleFiltersChange}
          totalResults={filtered.length}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Mobile filter button */}
            <Button
              variant="secondary"
              size="sm"
              icon={<SlidersHorizontal size={15} />}
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden"
            >
              Filters
            </Button>

            {/* Active filter chips */}
            {activeFilterChips.map((chip) => (
              <button
                key={chip.label}
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 text-xs font-medium hover:bg-gold-200 dark:hover:bg-gold-900/50 transition-colors"
              >
                {chip.label} <X size={12} />
              </button>
            ))}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value as SortOption }))}
              className="rounded-lg border border-cream-300 dark:border-charcoal-500 bg-white dark:bg-charcoal-700 text-sm text-charcoal-700 dark:text-cream-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gold-400"
              aria-label="Sort books"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* View mode */}
            <div className="flex rounded-lg border border-cream-300 dark:border-charcoal-500 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-charcoal-700 dark:bg-gold-500 text-white dark:text-charcoal-900' : 'bg-white dark:bg-charcoal-700 text-charcoal-400 dark:text-cream-400'}`}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-charcoal-700 dark:bg-gold-500 text-white dark:text-charcoal-900' : 'bg-white dark:bg-charcoal-700 text-charcoal-400 dark:text-cream-400'}`}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}>
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Book Grid */}
          <BookGrid books={paginated} loading={loading} viewMode={viewMode} />

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-center gap-2 mt-8" role="navigation" aria-label="Pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-cream-300 dark:border-charcoal-500 disabled:opacity-40 hover:bg-cream-200 dark:hover:bg-charcoal-600 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  className={[
                    'w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200',
                    p === page
                      ? 'bg-charcoal-700 text-cream-100 dark:bg-gold-500 dark:text-charcoal-900'
                      : 'border border-cream-300 dark:border-charcoal-500 text-charcoal-600 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-charcoal-600',
                  ].join(' ')}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-cream-300 dark:border-charcoal-500 disabled:opacity-40 hover:bg-cream-200 dark:hover:bg-charcoal-600 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
