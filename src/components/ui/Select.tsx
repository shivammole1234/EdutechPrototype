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
          <label className="block text-xs font-bold uppercase tracking-wider text-[#71717a]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3.5 py-2 text-xs text-[#fafafa] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 cursor-pointer disabled:opacity-50',
            error && 'border-rose-500 focus:border-rose-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#18181b] text-[#fafafa]">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
