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
    default: 'bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]',
    primary: 'bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    outline: 'border border-[var(--border-default)] text-[var(--text-secondary)] bg-transparent',
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
