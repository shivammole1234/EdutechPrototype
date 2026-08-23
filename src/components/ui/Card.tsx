import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverable, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--card-shadow)] text-[var(--text-primary)] transition-all duration-200',
        hoverable && 'hover:border-[var(--border-hover)] hover:bg-[var(--bg-surface-hover)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('flex items-center justify-between gap-3 mb-5', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3 className={cn('text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]', className)} {...props}>
      {children}
    </h3>
  );
};
