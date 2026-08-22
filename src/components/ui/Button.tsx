import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const variants = {
      primary:
        'bg-[#fafafa] hover:bg-[#e4e4e7] text-[#09090b] font-semibold shadow-sm active:scale-[0.98]',
      secondary:
        'bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] border border-[#3f3f46] active:scale-[0.98]',
      outline:
        'border border-[#27272a] hover:border-[#3f3f46] bg-[#18181b]/60 hover:bg-[#27272a] text-[#fafafa] active:scale-[0.98]',
      ghost:
        'bg-transparent hover:bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa] active:scale-[0.98]',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20 active:scale-[0.98]',
      success:
        'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
      md: 'px-4 py-2 text-xs font-semibold rounded-lg gap-2',
      lg: 'px-5 py-2.5 text-sm font-semibold rounded-xl gap-2.5',
      icon: 'p-2 rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52525b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin -ml-0.5 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
