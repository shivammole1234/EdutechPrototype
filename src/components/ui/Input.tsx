import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-[var(--text-muted)] pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              'w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3.5 py-2 text-xs text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-1 focus:ring-[var(--input-focus)] transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
              icon && 'pl-9',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
        {helperText && !error && <p className="text-xs text-[var(--text-muted)]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
