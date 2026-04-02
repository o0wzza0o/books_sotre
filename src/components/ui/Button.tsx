import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-charcoal-700 text-cream-100 hover:bg-charcoal-600 dark:bg-cream-100 dark:text-charcoal-700 dark:hover:bg-cream-200 shadow-sm',
  secondary:
    'bg-transparent border border-charcoal-700 text-charcoal-700 hover:bg-charcoal-700 hover:text-cream-100 dark:border-cream-200 dark:text-cream-200 dark:hover:bg-cream-200 dark:hover:text-charcoal-700',
  ghost:
    'bg-transparent text-charcoal-700 hover:bg-black/5 dark:text-cream-200 dark:hover:bg-white/8',
  danger:
    'bg-red-600 text-white hover:bg-red-700',
  gold:
    'bg-gold-500 text-charcoal-900 hover:bg-gold-400 shadow-sm font-semibold',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-all duration-200 cursor-pointer select-none',
        'focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : icon}
      {children}
    </button>
  );
};
