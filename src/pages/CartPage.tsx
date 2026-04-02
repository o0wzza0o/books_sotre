import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight, CheckCircle } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';

const DISCOUNT_CODE = 'MAKTABA20';
const DISCOUNT_RATE = 0.2;
const FREE_SHIPPING_THRESHOLD = 35;
const SHIPPING_COST = 4.99;

export const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [checkedOut, setCheckedOut] = useState(false);
  const navigate = useNavigate();

  const sub = subtotal();
  const discount = couponApplied ? sub * DISCOUNT_RATE : 0;
  const shipping = sub - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = sub - discount + shipping;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === DISCOUNT_CODE) {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid discount code. Try MAKTABA20');
      setCouponApplied(false);
    }
  };

  const handleCheckout = () => {
    clearCart();
    setCheckedOut(true);
  };

  // Success screen
  if (checkedOut) {
    return (
      <main className="page-enter min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center flex flex-col items-center gap-6 max-w-md animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-charcoal-700 dark:text-cream-100 mb-2">
              Order Placed! 🎉
            </h1>
            <p className="text-charcoal-500 dark:text-cream-400">
              Thank you for your order. Your books are on their way. You'll receive a confirmation email shortly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="gold" size="lg" fullWidth onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
            <Button variant="secondary" size="lg" fullWidth onClick={() => navigate('/books')}>
              Browse More Books
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <main className="page-enter min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center flex flex-col items-center gap-6 max-w-sm">
          <div className="text-7xl">🛒</div>
          <h1 className="font-display text-2xl font-bold text-charcoal-700 dark:text-cream-100">Your cart is empty</h1>
          <p className="text-charcoal-400 dark:text-cream-500">
            Looks like you haven't added any books yet. Start exploring our collection!
          </p>
          <Button variant="gold" size="lg" onClick={() => navigate('/books')}>
            Browse Books
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-charcoal-700 dark:text-cream-100 mb-6">
        Shopping Cart
        <span className="text-lg font-body font-normal text-charcoal-400 dark:text-cream-500 ml-3">
          ({items.reduce((s, i) => s + i.quantity, 0)} items)
        </span>
      </h1>

      <div className="grid lg:grid-cols-[1fr,380px] gap-8">
        {/* Items */}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.book.id}
              className="flex gap-4 bg-white dark:bg-charcoal-700 rounded-xl p-4 shadow-sm border border-transparent hover:border-gold-400/20 transition-all duration-200"
            >
              {/* Cover */}
              <Link to={`/books/${item.book.id}`} className="shrink-0">
                <img
                  src={item.book.coverUrl}
                  alt={item.book.title}
                  className="w-16 h-22 object-cover rounded-lg hover:opacity-80 transition-opacity"
                  style={{ height: '88px' }}
                />
              </Link>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <Link
                    to={`/books/${item.book.id}`}
                    className="font-display font-semibold text-sm text-charcoal-700 dark:text-cream-100 hover:text-gold-600 dark:hover:text-gold-400 transition-colors line-clamp-2"
                  >
                    {item.book.title}
                  </Link>
                  <p className="text-xs text-charcoal-400 dark:text-cream-500 mt-0.5">{item.book.author}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  {/* Quantity */}
                  <div className="flex items-center gap-0 rounded-lg border border-cream-200 dark:border-charcoal-500 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                      className="px-2.5 py-1.5 hover:bg-cream-200 dark:hover:bg-charcoal-600 transition-colors text-charcoal-600 dark:text-cream-300"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium text-charcoal-700 dark:text-cream-100 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-cream-200 dark:hover:bg-charcoal-600 transition-colors text-charcoal-600 dark:text-cream-300"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-charcoal-700 dark:text-cream-100">
                      ${(item.book.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.book.id)}
                      className="p-1.5 rounded-lg text-charcoal-400 dark:text-cream-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                      aria-label={`Remove ${item.book.title}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-charcoal-700 rounded-2xl p-6 shadow-sm border border-cream-200 dark:border-charcoal-500 sticky top-24">
            <h2 className="font-display text-xl font-semibold text-charcoal-700 dark:text-cream-100 mb-5 flex items-center gap-2">
              <ShoppingBag size={18} className="text-gold-500" />
              Order Summary
            </h2>

            {/* Coupon */}
            <div className="mb-5">
              <label htmlFor="coupon-input" className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 dark:text-cream-500 mb-2 block flex items-center gap-1">
                <Tag size={12} /> Discount Code
              </label>
              <div className="flex gap-2">
                <input
                  id="coupon-input"
                  type="text"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); setCouponError(''); }}
                  placeholder="e.g. MAKTABA20"
                  disabled={couponApplied}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-cream-300 dark:border-charcoal-500 text-sm bg-white dark:bg-charcoal-600 text-charcoal-700 dark:text-cream-100 placeholder-charcoal-300 focus:outline-none focus:ring-2 focus:ring-gold-400 disabled:opacity-60"
                />
                <Button
                  variant={couponApplied ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={applyCoupon}
                  disabled={couponApplied}
                >
                  {couponApplied ? '✓' : 'Apply'}
                </Button>
              </div>
              {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
              {couponApplied && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">✓ 20% discount applied!</p>}
            </div>

            {/* Breakdown */}
            <div className="flex flex-col gap-2.5 text-sm border-t border-cream-200 dark:border-charcoal-500 pt-4">
              <div className="flex justify-between text-charcoal-600 dark:text-cream-300">
                <span>Subtotal</span>
                <span>${sub.toFixed(2)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount (MAKTABA20)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal-600 dark:text-cream-300">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-charcoal-400 dark:text-cream-500">
                  Add ${(FREE_SHIPPING_THRESHOLD - (sub - discount)).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="flex justify-between font-bold text-lg text-charcoal-700 dark:text-cream-100 border-t border-cream-200 dark:border-charcoal-500 pt-3 mt-1">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="gold"
              size="lg"
              fullWidth
              className="mt-5"
              icon={<ArrowRight size={16} />}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>

            <p className="text-xs text-center text-charcoal-400 dark:text-cream-500 mt-3">
              🔒 Secure checkout — No real payment needed
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
