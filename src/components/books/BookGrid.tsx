import React from 'react';
import type { Book } from '../../types';
import { BookCard } from './BookCard';
import { BookCardSkeleton } from '../ui/Skeleton';

interface BookGridProps {
  books: Book[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
}

export const BookGrid: React.FC<BookGridProps> = ({ books, loading = false, viewMode = 'grid' }) => {
  if (loading) {
    return (
      <div className={viewMode === 'grid'
        ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
        : 'flex flex-col gap-3'
      }>
        {Array.from({ length: 8 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="text-6xl">📚</div>
        <h3 className="font-display text-xl font-semibold text-charcoal-700 dark:text-cream-100">
          No books found
        </h3>
        <p className="text-charcoal-400 dark:text-cream-500 max-w-xs">
          Try adjusting your filters or search query to discover more books.
        </p>
      </div>
    );
  }

  return (
    <div
      className={viewMode === 'grid'
        ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
        : 'flex flex-col gap-3'
      }
      role="list"
      aria-label="Books"
    >
      {books.map((book, i) => (
        <div
          key={book.id}
          role="listitem"
          className="animate-fade-in"
          style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
        >
          <BookCard book={book} viewMode={viewMode} />
        </div>
      ))}
    </div>
  );
};
