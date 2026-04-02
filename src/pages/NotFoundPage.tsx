import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <main className="page-enter min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center flex flex-col items-center gap-6 max-w-md">
        {/* Decorative */}
        <div className="relative">
          <div className="text-9xl font-display font-bold text-cream-200 dark:text-charcoal-600 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen size={52} className="text-gold-500" />
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal-700 dark:text-cream-100 mb-2">
            Page Not Found
          </h1>
          <p className="text-charcoal-400 dark:text-cream-500 leading-relaxed">
            Looks like this page went missing from our shelves. It may have been moved, deleted, or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gold-500 text-charcoal-900 font-semibold hover:bg-gold-400 transition-colors shadow-sm"
          >
            Return to Bookstore
          </Link>
          <Link
            to="/books"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-charcoal-300 dark:border-charcoal-500 text-charcoal-600 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-charcoal-700 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      </div>
    </main>
  );
};
