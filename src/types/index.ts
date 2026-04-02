// ===== Core Domain Types =====

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: Genre;
  price: number;
  originalPrice?: number; // if set, shows a discount badge
  rating: number; // 1.0 – 5.0
  reviewCount: number;
  coverUrl: string;
  description: string;
  language: string;
  pages: number;
  publishedYear: number;
  inStock: boolean;
  isBestseller: boolean;
  isNew: boolean;
}

export type Genre =
  | 'Fiction'
  | 'Non-Fiction'
  | 'Science'
  | 'History'
  | 'Biography'
  | 'Self-Help'
  | 'Technology'
  | 'Children'
  | 'Mystery'
  | 'Fantasy'
  | 'Romance'
  | 'Business';

export const ALL_GENRES: Genre[] = [
  'Fiction', 'Non-Fiction', 'Science', 'History', 'Biography',
  'Self-Help', 'Technology', 'Children', 'Mystery', 'Fantasy', 'Romance', 'Business',
];

// ===== Cart Types =====

export interface CartItem {
  book: Book;
  quantity: number;
}

// ===== Filter & Sort Types =====

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'bestseller';

export interface FilterState {
  genres: Genre[];
  priceRange: [number, number]; // [min, max]
  minRating: number;
  language: string;
  inStockOnly: boolean;
  sortBy: SortOption;
}

export const defaultFilterState: FilterState = {
  genres: [],
  priceRange: [0, 100],
  minRating: 0,
  language: 'All',
  inStockOnly: false,
  sortBy: 'newest',
};
