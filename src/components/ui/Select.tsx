import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3.5 py-2 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-1 focus:ring-[var(--input-focus)] transition duration-150 cursor-pointer disabled:opacity-50',
            error && 'border-rose-500 focus:border-rose-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
