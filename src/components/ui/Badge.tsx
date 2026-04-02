import React from 'react';

type BadgeVariant = 'genre' | 'bestseller' | 'new' | 'discount' | 'outofstock' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  genre:
    'bg-cream-200 text-charcoal-700 dark:bg-charcoal-600 dark:text-cream-200',
  bestseller:
    'bg-gold-500 text-charcoal-900 font-semibold',
  new:
    'bg-emerald-500 text-white font-semibold',
  discount:
    'bg-red-500 text-white font-semibold',
  outofstock:
    'bg-gray-400 text-white',
  default:
    'bg-charcoal-200 text-charcoal-700',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs tracking-wide',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
};
