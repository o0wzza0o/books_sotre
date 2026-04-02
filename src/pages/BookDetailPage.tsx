import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, BookOpen, Globe, Calendar, Hash, Package, Star } from 'lucide-react';
import { getBookById, getRelatedBooks } from '../data/books';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StarRating } from '../components/ui/StarRating';
import { BookGrid } from '../components/books/BookGrid';

// Simulated rating breakdown distribution
const getRatingDistribution = (rating: number, reviewCount: number) => {
  const base = rating;
  return [5, 4, 3, 2, 1].map((star) => {
    let pct = 0;
    if (star === Math.round(base)) pct = 55;
    else if (star === Math.round(base) - 1) pct = 25;
    else if (star === 5 && base > 4.5) pct = 70;
    else pct = Math.max(2, Math.floor(Math.random() * 10));
    return { star, pct: Math.min(pct, 95), count: Math.floor((reviewCount * pct) / 100) };
  });
};

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const book = getBookById(Number(id));
  const [added, setAdded] = useState(false);
  const [imgZoomed, setImgZoomed] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = book ? isWishlisted(book.id) : false;

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-6xl">📖</div>
        <h1 className="font-display text-2xl font-bold text-charcoal-700 dark:text-cream-100">Book not found</h1>
        <Button variant="gold" onClick={() => navigate('/books')}>Back to Books</Button>
      </div>
    );
  }

  const related = getRelatedBooks(book);
  const dist = getRatingDistribution(book.rating, book.reviewCount);
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-charcoal-400 dark:text-cream-500 mb-6">
        <Link to="/" className="hover:text-gold-600 dark:hover:text-gold-400 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/books" className="hover:text-gold-600 dark:hover:text-gold-400 transition-colors">Books</Link>
        <span>/</span>
        <span className="text-charcoal-700 dark:text-cream-200 truncate max-w-xs">{book.title}</span>
      </nav>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-charcoal-500 dark:text-cream-400 hover:text-charcoal-700 dark:hover:text-cream-100 mb-6 transition-colors group"
        aria-label="Go back"
      >
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      {/* Main detail area */}
      <div className="grid md:grid-cols-[auto,1fr] lg:grid-cols-[auto,1fr,1fr] gap-8 mb-12">
        {/* Cover with zoom */}
        <div className="flex flex-col gap-4">
          <div
            className={[
              'relative w-52 md:w-56 rounded-2xl overflow-hidden shadow-2xl cursor-zoom-in transition-all duration-500 origin-top-left',
              imgZoomed ? 'scale-125 shadow-gold-400/30 cursor-zoom-out z-10' : 'hover:shadow-gold-400/20',
            ].join(' ')}
            onClick={() => setImgZoomed(!imgZoomed)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setImgZoomed(!imgZoomed)}
            aria-label={imgZoomed ? 'Zoom out cover' : 'Zoom in cover'}
          >
            <img
              src={book.coverUrl}
              alt={`${book.title} cover`}
              className="w-full h-80 object-cover"
            />
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {book.isNew && <Badge variant="new">New</Badge>}
              {discount > 0 && <Badge variant="discount">-{discount}%</Badge>}
              {!book.inStock && <Badge variant="outofstock">Out of Stock</Badge>}
            </div>
          </div>

          {/* Metadata table */}
          <div className="w-52 md:w-56 rounded-xl bg-white dark:bg-charcoal-700 border border-cream-200 dark:border-charcoal-500 p-4 space-y-3">
            {[
              { icon: Globe, label: 'Language', value: book.language },
              { icon: Hash, label: 'Pages', value: book.pages.toLocaleString() },
              { icon: Calendar, label: 'Published', value: book.publishedYear === 500 ? '~500 BC' : book.publishedYear.toString() },
              { icon: Package, label: 'Stock', value: book.inStock ? 'Available' : 'Out of Stock' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5">
                <Icon size={14} className="text-gold-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-charcoal-400 dark:text-cream-500 uppercase tracking-wider">{label}</p>
                  <p className={`text-xs font-medium ${value === 'Out of Stock' ? 'text-red-500' : 'text-charcoal-700 dark:text-cream-100'}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Book Info */}
        <div className="flex flex-col gap-4">
          <div>
            <Badge variant="genre" className="mb-2">{book.genre}</Badge>
            {book.isBestseller && <Badge variant="bestseller" className="ml-2">★ Bestseller</Badge>}
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal-700 dark:text-cream-100 leading-tight">
            {book.title}
          </h1>
          <p className="text-lg text-charcoal-500 dark:text-cream-400">
            by <span className="font-semibold text-charcoal-700 dark:text-cream-200">{book.author}</span>
          </p>

          <StarRating rating={book.rating} reviewCount={book.reviewCount} size="md" />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-charcoal-700 dark:text-cream-100">
              ${book.price.toFixed(2)}
            </span>
            {book.originalPrice && (
              <>
                <span className="text-lg text-charcoal-400 line-through">${book.originalPrice.toFixed(2)}</span>
                <Badge variant="discount">Save {discount}%</Badge>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-charcoal-600 dark:text-cream-300 leading-relaxed text-base">
            {book.description}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant="gold"
              size="lg"
              icon={<ShoppingCart size={18} />}
              onClick={handleAddToCart}
              disabled={!book.inStock}
              className="min-w-48"
            >
              {added ? '✓ Added to Cart!' : !book.inStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button
              variant={wishlisted ? 'danger' : 'secondary'}
              size="lg"
              icon={<Heart size={18} className={wishlisted ? 'fill-current' : ''} />}
              onClick={() => toggleItem(book)}
            >
              {wishlisted ? 'Wishlisted' : 'Wishlist'}
            </Button>
          </div>

          {/* Stock indicator */}
          <div className={[
            'inline-flex items-center gap-2 text-sm font-medium',
            book.inStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500',
          ].join(' ')}>
            <span className={[
              'w-2 h-2 rounded-full',
              book.inStock ? 'bg-emerald-500 animate-pulse' : 'bg-red-500',
            ].join(' ')} />
            {book.inStock ? 'In stock — ready to ship' : 'Currently out of stock'}
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="rounded-2xl bg-white dark:bg-charcoal-700 border border-cream-200 dark:border-charcoal-500 p-6">
          <h2 className="font-display text-xl font-semibold text-charcoal-700 dark:text-cream-100 mb-4">
            Rating Breakdown
          </h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <p className="font-display text-5xl font-bold text-charcoal-700 dark:text-cream-100">{book.rating}</p>
              <StarRating rating={book.rating} size="sm" />
              <p className="text-xs text-charcoal-400 dark:text-cream-500 mt-1">{book.reviewCount.toLocaleString()} reviews</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {dist.map(({ star, pct, count }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-0.5 text-xs text-charcoal-500 dark:text-cream-400 w-8 shrink-0">
                  {star}<Star size={10} className="fill-gold-400 text-gold-400 ml-0.5" />
                </div>
                <div className="flex-1 h-2 rounded-full bg-cream-200 dark:bg-charcoal-600 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold-400 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-charcoal-400 dark:text-cream-500 w-12 text-right">{count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Author Bio */}
      <section className="rounded-2xl bg-white dark:bg-charcoal-700 border border-cream-200 dark:border-charcoal-500 p-6 mb-12" aria-labelledby="author-heading">
        <h2 id="author-heading" className="font-display text-xl font-semibold text-charcoal-700 dark:text-cream-100 mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-gold-500" />
          About the Author
        </h2>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-charcoal-900 font-display font-bold text-xl shrink-0">
            {book.author[0]}
          </div>
          <div>
            <h3 className="font-semibold text-charcoal-700 dark:text-cream-100 mb-1">{book.author}</h3>
            <p className="text-charcoal-500 dark:text-cream-400 text-sm leading-relaxed">
              {book.author} is a celebrated author known for their compelling storytelling and unique perspective.
              Their work has resonated with readers worldwide, earning critical acclaim and dedicated readership.
              "{book.title}" stands as one of their most notable contributions to {book.genre} literature.
            </p>
          </div>
        </div>
      </section>

      {/* Related Books */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-display text-2xl font-bold text-charcoal-700 dark:text-cream-100 mb-5">
            You Might Also Like
          </h2>
          <BookGrid books={related} />
        </section>
      )}
    </main>
  );
};
