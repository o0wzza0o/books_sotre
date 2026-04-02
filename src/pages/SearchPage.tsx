import React, { useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { StarRating } from '../components/ui/StarRating';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

/** Highlights matching text within a string */
const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-gold-200 dark:bg-gold-800 text-charcoal-900 dark:text-cream-100 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlQuery = searchParams.get('q') || '';
  const { query, setQuery, results } = useSearch(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  return (
    <main className="page-enter max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-charcoal-500 dark:text-cream-400 hover:text-charcoal-700 dark:hover:text-cream-100 mb-6 transition-colors group"
      >
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      <h1 className="font-display text-3xl font-bold text-charcoal-700 dark:text-cream-100 mb-2">
        Search Results
      </h1>
      {query && (
        <p className="text-charcoal-400 dark:text-cream-500 mb-6">
          {results.length} result{results.length !== 1 ? 's' : ''} for{' '}
          <span className="font-semibold text-charcoal-700 dark:text-cream-100">"{query}"</span>
        </p>
      )}

      {/* Search input */}
      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400 dark:text-cream-500 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) {
              navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`, { replace: true });
            }
          }}
          placeholder="Search books, authors, genres..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-cream-300 dark:border-charcoal-500 bg-white dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-100 placeholder-charcoal-400 dark:placeholder-charcoal-500 text-base focus:outline-none focus:ring-2 focus:ring-gold-400 shadow-sm"
          autoFocus
          aria-label="Search books"
        />
      </div>

      {/* Results */}
      {!query ? (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-cream-300 dark:text-charcoal-500 mb-4" />
          <p className="text-charcoal-400 dark:text-cream-500">Start typing to search books, authors, or genres</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <div className="text-6xl">🔍</div>
          <h2 className="font-display text-xl font-semibold text-charcoal-700 dark:text-cream-100">
            No results found
          </h2>
          <p className="text-charcoal-400 dark:text-cream-500 max-w-sm">
            We couldn't find any books matching "{query}". Try a different search term or browse by genre.
          </p>
          <Button variant="gold" size="md" onClick={() => navigate('/books')}>
            Browse All Books
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((book, i) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              className="group flex gap-4 bg-white dark:bg-charcoal-700 rounded-xl p-4 shadow-sm hover:shadow-md border border-transparent hover:border-gold-400/30 transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
            >
              <div className="shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-cream-200 dark:bg-charcoal-600">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="font-display font-semibold text-charcoal-700 dark:text-cream-100 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                    <Highlight text={book.title} query={query} />
                  </h2>
                  <span className="shrink-0 font-bold text-charcoal-700 dark:text-cream-100">
                    ${book.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-charcoal-400 dark:text-cream-500 mb-1">
                  <Highlight text={book.author} query={query} />
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="genre">
                    <Highlight text={book.genre} query={query} />
                  </Badge>
                  <StarRating rating={book.rating} reviewCount={book.reviewCount} size="sm" />
                </div>
                <p className="text-sm text-charcoal-500 dark:text-cream-400 mt-1.5 line-clamp-2">
                  {book.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};
