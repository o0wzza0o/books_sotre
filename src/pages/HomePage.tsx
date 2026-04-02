import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Sparkles, TrendingUp, Mail, Send } from 'lucide-react';
import { ALL_GENRES } from '../types';
import type { Genre } from '../types';
import { getFeaturedBooks, getNewArrivals, getTopRated } from '../data/books';
import { BookCarousel } from '../components/books/BookCarousel';
import { BookGrid } from '../components/books/BookGrid';
import { Button } from '../components/ui/Button';

const HERO_BOOKS = getTopRated().slice(0, 6);
const GENRE_COLORS: Record<Genre, string> = {
  Fiction: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Non-Fiction': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Science: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  History: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Biography: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Self-Help': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  Technology: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  Children: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Mystery: 'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300',
  Fantasy: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  Romance: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  Business: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Auto-rotate hero book
  useEffect(() => {
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % HERO_BOOKS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <main className="page-enter">
      {/* ===== HERO SECTION ===== */}
      <section
        className="relative min-h-[88vh] flex items-center overflow-hidden"
        aria-label="Hero section"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-700 via-charcoal-800 to-charcoal-900" />
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.3) 0%, transparent 60%),
                              radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.15) 0%, transparent 50%)`,
          }}
        />

        {/* Decorative book spines */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex flex-col gap-0.5 opacity-10 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="h-6 rounded-l-sm"
              style={{
                background: `hsl(${(i * 37) % 360}, 50%, ${30 + (i % 4) * 10}%)`,
                width: `${50 + (i % 5) * 20}%`,
                marginLeft: 'auto',
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gold-400" />
              <span className="text-gold-400 text-sm font-medium tracking-wide">Your Literary Journey Starts Here</span>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl font-bold text-white leading-tight">
              Discover{' '}
              <span className="text-gradient">Stories</span>
              {' '}That{' '}
              <span className="text-cream-200">Move You</span>
            </h1>

            <p className="text-cream-300 text-lg leading-relaxed max-w-md">
              Browse over 24 handpicked books across every genre. From timeless classics to modern bestsellers — find your next great read.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/books')}
                icon={<ArrowRight size={18} />}
              >
                Browse All Books
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/books?filter=new')}
                className="border-cream-300 text-cream-200 hover:bg-cream-100 hover:text-charcoal-700"
              >
                New Arrivals
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4 border-t border-white/10">
              {[
                { value: '24+', label: 'Curated Books' },
                { value: '12', label: 'Genres' },
                { value: '4.7★', label: 'Avg. Rating' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-bold text-gold-400">{s.value}</p>
                  <p className="text-xs text-cream-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Animated Featured Book */}
          <div className="relative flex justify-center items-center">
            {/* Glow */}
            <div className="absolute w-72 h-72 rounded-full bg-gold-500/20 blur-3xl" />
            {/* Book stack visual */}
            <div className="relative">
              {HERO_BOOKS.map((book, i) => {
                const offset = (i - heroIndex + HERO_BOOKS.length) % HERO_BOOKS.length;
                const isActive = offset === 0;
                const isNext = offset === 1;
                const isPrev = offset === HERO_BOOKS.length - 1;
                if (!isActive && !isNext && !isPrev) return null;
                return (
                  <Link
                    key={book.id}
                    to={`/books/${book.id}`}
                    className={[
                      'absolute top-1/2 left-1/2 block rounded-xl overflow-hidden shadow-2xl transition-all duration-700',
                      isActive ? '-translate-x-1/2 -translate-y-1/2 w-48 h-64 z-20 shadow-gold-400/20' : '',
                      isNext ? 'translate-x-4 -translate-y-1/2 w-36 h-52 z-10 opacity-60 scale-90 blur-[1px]' : '',
                      isPrev ? '-translate-x-full -translate-y-1/2 w-36 h-52 z-10 opacity-60 scale-90 blur-[1px]' : '',
                    ].join(' ')}
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                );
              })}
              {/* Placeholder to give height */}
              <div className="w-48 h-64 opacity-0">_</div>
            </div>

            {/* Dot indicators */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
              {HERO_BOOKS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  aria-label={`Hero book ${i + 1}`}
                  className={[
                    'h-1.5 rounded-full transition-all duration-300',
                    i === heroIndex ? 'w-6 bg-gold-400' : 'w-1.5 bg-white/30',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z"
              className="fill-cream-100 dark:fill-charcoal-800" />
          </svg>
        </div>
      </section>

      {/* ===== GENRE PILLS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-labelledby="genres-heading">
        <div className="flex items-center justify-between mb-5">
          <h2 id="genres-heading" className="font-display text-2xl font-bold text-charcoal-700 dark:text-cream-100">
            Browse by Genre
          </h2>
          <Link to="/books" className="flex items-center gap-1 text-sm text-gold-600 dark:text-gold-400 hover:gap-2 transition-all">
            All Books <ChevronRight size={14} />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {ALL_GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => navigate(`/books?genre=${encodeURIComponent(genre)}`)}
              className={[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-pointer',
                GENRE_COLORS[genre],
              ].join(' ')}
              aria-label={`Browse ${genre} books`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-labelledby="new-arrivals-heading">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-gold-500" />
          <h2 id="new-arrivals-heading" className="font-display text-2xl font-bold text-charcoal-700 dark:text-cream-100">
            New Arrivals
          </h2>
        </div>
        <p className="text-charcoal-400 dark:text-cream-500 text-sm mb-5">Fresh off the press — just added to our collection</p>
        <BookCarousel books={getNewArrivals()} />
      </section>

      {/* ===== TOP RATED ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-labelledby="top-rated-heading">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-gold-500" />
            <h2 id="top-rated-heading" className="font-display text-2xl font-bold text-charcoal-700 dark:text-cream-100">
              Top Rated
            </h2>
          </div>
          <Link to="/books?sort=rating" className="flex items-center gap-1 text-sm text-gold-600 dark:text-gold-400 hover:gap-2 transition-all">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <BookGrid books={getTopRated().slice(0, 4)} />
      </section>

      {/* ===== FEATURED / BESTSELLERS ===== */}
      <section className="bg-charcoal-700 dark:bg-charcoal-900 py-12 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-bold text-cream-100">
              ★ Bestsellers
            </h2>
            <Link to="/books?sort=bestseller" className="flex items-center gap-1 text-sm text-gold-400 hover:gap-2 transition-all">
              See all <ChevronRight size={14} />
            </Link>
          </div>
          <BookCarousel books={getFeaturedBooks()} />
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="newsletter-heading">
        <div className="relative rounded-3xl bg-gradient-to-br from-gold-600 to-gold-800 overflow-hidden p-10 text-center">
          {/* Pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative flex flex-col items-center gap-4">
            <Mail size={32} className="text-charcoal-900/70" />
            <h2 id="newsletter-heading" className="font-display text-3xl font-bold text-charcoal-900">
              Stay in the Literary Loop
            </h2>
            <p className="text-charcoal-800 max-w-md">
              Get new releases, curated recommendations, and exclusive deals delivered to your inbox weekly.
            </p>
            {subscribed ? (
              <div className="bg-white/30 rounded-xl px-6 py-3 text-charcoal-900 font-semibold">
                🎉 Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="flex-1 px-4 py-3 rounded-xl text-sm bg-white/90 text-charcoal-700 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-charcoal-700"
                  aria-label="Email address for newsletter"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<Send size={15} />}
                  className="bg-charcoal-700 text-cream-100 hover:bg-charcoal-900 shrink-0"
                >
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
