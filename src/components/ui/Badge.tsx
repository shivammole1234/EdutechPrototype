import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-[#27272a] text-[#fafafa] border border-[#3f3f46]',
    primary: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    outline: 'border border-[#27272a] text-[#a1a1aa] bg-transparent',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-md whitespace-nowrap',
    md: 'px-2.5 py-0.5 text-xs font-semibold rounded-md whitespace-nowrap',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5', variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
