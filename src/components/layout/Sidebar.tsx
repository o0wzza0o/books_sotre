import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import type { FilterState, Genre } from '../../types';
import { ALL_GENRES, defaultFilterState } from '../../types';
import { Button } from '../ui/Button';
import { StarRating } from '../ui/StarRating';

interface SidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalResults: number;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const LANGUAGES = ['All', 'English', 'Arabic', 'French', 'Spanish', 'German'];

export const Sidebar: React.FC<SidebarProps> = ({
  filters,
  onChange,
  totalResults,
  mobileOpen = false,
  onMobileClose,
}) => {
  const toggleGenre = (genre: Genre) => {
    const has = filters.genres.includes(genre);
    onChange({
      ...filters,
      genres: has ? filters.genres.filter((g) => g !== genre) : [...filters.genres, genre],
    });
  };

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100 ||
    filters.minRating > 0 ||
    filters.language !== 'All' ||
    filters.inStockOnly;

  const sidebar = (
    <aside className="flex flex-col gap-6" aria-label="Filters">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-gold-500" />
          <span className="font-display font-semibold text-charcoal-700 dark:text-cream-100">Filters</span>
          <span className="text-xs text-charcoal-400 dark:text-cream-500">({totalResults} books)</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(defaultFilterState)}
            className="text-xs text-red-500 hover:text-red-600 px-2"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Genre */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 dark:text-cream-500 mb-3">Genre</h3>
        <div className="flex flex-col gap-1.5">
          {ALL_GENRES.map((genre) => (
            <label key={genre} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.genres.includes(genre)}
                onChange={() => toggleGenre(genre)}
                className="w-4 h-4 rounded border-cream-300 dark:border-charcoal-500 accent-gold-500 cursor-pointer"
              />
              <span className="text-sm text-charcoal-600 dark:text-cream-300 group-hover:text-charcoal-900 dark:group-hover:text-cream-100 transition-colors">
                {genre}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 dark:text-cream-500 mb-3">
          Price Range
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-sm font-medium text-charcoal-700 dark:text-cream-100">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={filters.priceRange[1]}
            onChange={(e) =>
              onChange({ ...filters, priceRange: [filters.priceRange[0], +e.target.value] })
            }
            aria-label="Maximum price"
            className="w-full accent-gold-500"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 dark:text-cream-500 mb-3">
          Min. Rating
        </h3>
        <div className="flex flex-col gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => onChange({ ...filters, minRating: r })}
                className="accent-gold-500 cursor-pointer"
              />
              {r === 0 ? (
                <span className="text-sm text-charcoal-600 dark:text-cream-300">Any</span>
              ) : (
                <StarRating rating={r} size="sm" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 dark:text-cream-500 mb-3">
          Language
        </h3>
        <select
          value={filters.language}
          onChange={(e) => onChange({ ...filters, language: e.target.value })}
          className="w-full rounded-lg border border-cream-300 dark:border-charcoal-500 bg-white dark:bg-charcoal-700 text-sm text-charcoal-700 dark:text-cream-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gold-400"
          aria-label="Language filter"
        >
          {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            role="switch"
            aria-checked={filters.inStockOnly}
            onClick={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
            className={[
              'relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer',
              filters.inStockOnly ? 'bg-gold-500' : 'bg-cream-300 dark:bg-charcoal-500',
            ].join(' ')}
          >
            <span className={[
              'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
              filters.inStockOnly ? 'translate-x-5' : '',
            ].join(' ')} />
          </div>
          <span className="text-sm text-charcoal-700 dark:text-cream-200">In Stock Only</span>
        </label>
      </div>
    </aside>
  );

  // Mobile overlay
  if (mobileOpen) {
    return (
      <div className="fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
        <div className="relative bg-cream-100 dark:bg-charcoal-700 w-72 max-h-screen overflow-y-auto p-6 shadow-xl">
          <button
            onClick={onMobileClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/8"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
          {sidebar}
        </div>
      </div>
    );
  }

  return sidebar;
};
