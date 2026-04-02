import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Book } from '../../types';
import { BookCard } from './BookCard';

interface BookCarouselProps {
  books: Book[];
  title?: string;
}

export const BookCarousel: React.FC<BookCarouselProps> = ({ books, title }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {title && (
        <h2 className="font-display text-2xl font-bold text-charcoal-700 dark:text-cream-100 mb-4">{title}</h2>
      )}
      <div className="group/carousel relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white dark:bg-charcoal-700 shadow-lg border border-cream-200 dark:border-charcoal-500 flex items-center justify-center text-charcoal-700 dark:text-cream-100 hover:bg-gold-500 hover:text-charcoal-900 hover:border-gold-500 transition-all duration-200 opacity-0 group-hover/carousel:opacity-100"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="scroll-x flex gap-4 pb-2"
          role="list"
          aria-label={title || 'Books carousel'}
        >
          {books.map((book) => (
            <div key={book.id} role="listitem" className="shrink-0 w-48">
              <BookCard book={book} />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white dark:bg-charcoal-700 shadow-lg border border-cream-200 dark:border-charcoal-500 flex items-center justify-center text-charcoal-700 dark:text-cream-100 hover:bg-gold-500 hover:text-charcoal-900 hover:border-gold-500 transition-all duration-200 opacity-0 group-hover/carousel:opacity-100"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
