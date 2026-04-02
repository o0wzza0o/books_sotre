import { useMemo } from 'react';
import type { Book, FilterState } from '../types';

export const useFilter = (allBooks: Book[], filters: FilterState): Book[] => {
  return useMemo(() => {
    let result = [...allBooks];

    // Genre
    if (filters.genres.length > 0) {
      result = result.filter((b) => filters.genres.includes(b.genre));
    }

    // Price
    result = result.filter(
      (b) => b.price >= filters.priceRange[0] && b.price <= filters.priceRange[1]
    );

    // Rating
    if (filters.minRating > 0) {
      result = result.filter((b) => b.rating >= filters.minRating);
    }

    // Language
    if (filters.language && filters.language !== 'All') {
      result = result.filter((b) => b.language === filters.language);
    }

    // In stock
    if (filters.inStockOnly) {
      result = result.filter((b) => b.inStock);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'bestseller':
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.publishedYear - a.publishedYear);
        break;
    }

    return result;
  }, [allBooks, filters]);
};
