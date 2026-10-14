import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C5A059] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 uppercase tracking-wider',
      md: 'text-sm px-5 py-2.5 tracking-wide',
      lg: 'text-base px-7 py-3.5 tracking-wide font-semibold',
    };

    const variantStyles = {
      primary:
        'bg-[#C5A059] text-[#0B0B0D] hover:bg-[#D4AF37] shadow-lg shadow-[#C5A059]/15 active:scale-[0.98]',
      secondary:
        'bg-[#19191E] text-[#F4F3EF] border border-[#2B2B36] hover:border-[#C5A059]/60 hover:bg-[#202027]',
      outline:
        'bg-transparent border border-[#C5A059]/60 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0B0B0D]',
      ghost:
        'bg-transparent text-[#D1D1CB] hover:text-[#F4F3EF] hover:bg-white/5',
      danger:
        'bg-rose-900/40 text-rose-300 border border-rose-800/60 hover:bg-rose-900/70',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
