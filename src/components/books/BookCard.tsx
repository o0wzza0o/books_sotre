import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import type { Book } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { StarRating } from '../ui/StarRating';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { BookCardSkeleton } from '../ui/Skeleton';

interface BookCardProps {
  book: Book;
  loading?: boolean;
  viewMode?: 'grid' | 'list';
}

export const BookCard: React.FC<BookCardProps> = ({ book, loading = false, viewMode = 'grid' }) => {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(book.id);

  if (loading) return <BookCardSkeleton />;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(book);
  };

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <Link
        to={`/books/${book.id}`}
        className="group flex gap-4 bg-white dark:bg-charcoal-700 rounded-xl p-4 shadow-sm hover:shadow-md border border-transparent hover:border-gold-400/30 transition-all duration-300"
      >
        {/* Cover */}
        <div className="shrink-0 w-20 h-28 rounded-lg overflow-hidden bg-cream-200 dark:bg-charcoal-600">
          <img
            src={imgError ? `https://picsum.photos/seed/${book.id + 100}/300/400` : book.coverUrl}
            alt={book.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-display font-semibold text-charcoal-700 dark:text-cream-100 line-clamp-1 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                {book.title}
              </h3>
              <div className="flex gap-1 shrink-0">
                {book.isNew && <Badge variant="new">New</Badge>}
                {book.isBestseller && <Badge variant="bestseller">★ Best</Badge>}
              </div>
            </div>
            <p className="text-sm text-charcoal-400 dark:text-cream-500 mb-2">{book.author}</p>
            <StarRating rating={book.rating} reviewCount={book.reviewCount} size="sm" />
            <p className="text-sm text-charcoal-500 dark:text-cream-400 mt-2 line-clamp-2">{book.description}</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-charcoal-700 dark:text-cream-100">${book.price.toFixed(2)}</span>
              {book.originalPrice && (
                <span className="text-sm text-charcoal-400 line-through">${book.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleWishlist}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="p-1.5 rounded-lg hover:bg-cream-100 dark:hover:bg-charcoal-600 transition-colors"
              >
                <Heart size={16} className={wishlisted ? 'fill-gold-500 text-gold-500' : 'text-charcoal-400'} />
              </button>
              <Button variant="gold" size="sm" onClick={handleAddToCart} disabled={!book.inStock}>
                {added ? '✓ Added' : !book.inStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid card
  return (
    <Link
      to={`/books/${book.id}`}
      className="group relative flex flex-col bg-white dark:bg-charcoal-700 rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-transparent hover:border-gold-400/20 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover */}
      <div className="relative overflow-hidden bg-cream-200 dark:bg-charcoal-600 h-56">
        <img
          src={imgError ? `https://picsum.photos/seed/${book.id + 100}/300/400` : book.coverUrl}
          alt={book.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {book.isNew && <Badge variant="new">New</Badge>}
          {discount > 0 && <Badge variant="discount">-{discount}%</Badge>}
        </div>
        {book.isBestseller && (
          <div className="absolute top-2 right-2">
            <Badge variant="bestseller">★ Best</Badge>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-charcoal-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-charcoal-700 transition-all duration-200 hover:scale-110"
          >
            <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
          </button>
          <Link
            to={`/books/${book.id}`}
            onClick={(e) => e.stopPropagation()}
            aria-label={`View ${book.title}`}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-charcoal-700 transition-all duration-200 hover:scale-110"
          >
            <Eye size={16} />
          </Link>
        </div>

        {/* Stock indicator */}
        {!book.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-charcoal-700 text-xs font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-1.5">
        <p className="text-xs text-gold-500 font-medium tracking-wide">{book.genre}</p>
        <h3 className="font-display font-semibold text-sm text-charcoal-700 dark:text-cream-100 line-clamp-2 leading-snug group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-charcoal-400 dark:text-cream-500">{book.author}</p>
        <StarRating rating={book.rating} reviewCount={book.reviewCount} size="sm" />

        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-charcoal-700 dark:text-cream-100">${book.price.toFixed(2)}</span>
            {book.originalPrice && (
              <span className="text-xs text-charcoal-400 line-through">${book.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <Button
            variant="gold"
            size="sm"
            onClick={handleAddToCart}
            disabled={!book.inStock}
            icon={<ShoppingCart size={13} />}
            className="text-xs"
          >
            {added ? '✓' : 'Add'}
          </Button>
        </div>
      </div>
    </Link>
  );
};
