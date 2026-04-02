import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 – 5
  reviewCount?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 12, md: 16, lg: 20 };

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  reviewCount,
  interactive = false,
  onRate,
  size = 'sm',
}) => {
  const px = sizeMap[size];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating);
          const half = !filled && star - 0.5 <= rating;
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => onRate?.(star)}
              className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            >
              <Star
                size={px}
                className={
                  filled
                    ? 'fill-gold-500 text-gold-500'
                    : half
                    ? 'fill-gold-300 text-gold-400'
                    : 'fill-none text-cream-400 dark:text-charcoal-500'
                }
              />
            </button>
          );
        })}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-charcoal-400 dark:text-cream-500">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};
