import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  leftIcon,
  rightIcon,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-charcoal-700 dark:text-cream-300"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-charcoal-400 dark:text-cream-500 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            'w-full rounded-lg border bg-white dark:bg-charcoal-700',
            'border-cream-300 dark:border-charcoal-500',
            'text-charcoal-700 dark:text-cream-100 placeholder-charcoal-300 dark:placeholder-charcoal-400',
            'py-2.5 text-sm transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent',
            leftIcon ? 'pl-10' : 'pl-4',
            rightIcon ? 'pr-10' : 'pr-4',
            error ? 'border-red-500 focus:ring-red-500' : '',
            className,
          ].join(' ')}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 text-charcoal-400 dark:text-cream-500">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
