import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { StarRating } from '../components/ui/StarRating';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const WishlistPage: React.FC = () => {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <main className="page-enter min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center flex flex-col items-center gap-6 max-w-sm">
          <Heart size={64} className="text-cream-300 dark:text-charcoal-500" />
          <h1 className="font-display text-2xl font-bold text-charcoal-700 dark:text-cream-100">
            Your wishlist is empty
          </h1>
          <p className="text-charcoal-400 dark:text-cream-500">
            Save books you love by clicking the heart icon on any book card.
          </p>
          <Button variant="gold" size="lg" onClick={() => navigate('/books')}>
            Discover Books
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-charcoal-700 dark:text-cream-100">
          My Wishlist
          <span className="text-lg font-body font-normal text-charcoal-400 dark:text-cream-500 ml-3">
            ({items.length} book{items.length !== 1 ? 's' : ''})
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((book, i) => {
          const discount = book.originalPrice
            ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
            : 0;

          return (
            <div
              key={book.id}
              className="group bg-white dark:bg-charcoal-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-transparent hover:border-gold-400/20 transition-all duration-300 animate-fade-in flex flex-col"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
            >
              {/* Cover */}
              <Link to={`/books/${book.id}`} className="relative block overflow-hidden h-52 bg-cream-200 dark:bg-charcoal-600">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {book.isNew && <Badge variant="new">New</Badge>}
                  {discount > 0 && <Badge variant="discount">-{discount}%</Badge>}
                </div>
                {!book.inStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white/90 text-charcoal-700 text-xs font-semibold px-3 py-1 rounded-full">Out of Stock</span>
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1 gap-2">
                <p className="text-xs text-gold-500 font-medium">{book.genre}</p>
                <Link to={`/books/${book.id}`}>
                  <h3 className="font-display font-semibold text-sm text-charcoal-700 dark:text-cream-100 line-clamp-2 hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-xs text-charcoal-400 dark:text-cream-500">{book.author}</p>
                <StarRating rating={book.rating} reviewCount={book.reviewCount} size="sm" />

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-bold text-charcoal-700 dark:text-cream-100">${book.price.toFixed(2)}</span>
                  {book.originalPrice && (
                    <span className="text-xs text-charcoal-400 line-through">${book.originalPrice.toFixed(2)}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-2">
                  <Button
                    variant="gold"
                    size="sm"
                    fullWidth
                    icon={<ShoppingCart size={13} />}
                    onClick={() => {
                      addToCart(book);
                      removeItem(book.id);
                    }}
                    disabled={!book.inStock}
                  >
                    Move to Cart
                  </Button>
                  <button
                    onClick={() => removeItem(book.id)}
                    className="p-2 rounded-lg border border-cream-200 dark:border-charcoal-500 text-charcoal-400 dark:text-cream-500 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                    aria-label={`Remove ${book.title} from wishlist`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};
