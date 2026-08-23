import React from 'react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  subtitle,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--card-shadow)] relative overflow-hidden transition-all duration-200 hover:border-[var(--border-hover)]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase text-[var(--text-muted)] font-bold tracking-wider">{title}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-[var(--text-primary)]">{value}</span>
            {change && (
              <span
                className={cn(
                  'text-[11px] font-medium px-2 py-0.5 rounded-md font-mono',
                  changeType === 'positive' && 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
                  changeType === 'negative' && 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20',
                  changeType === 'neutral' && 'text-[var(--text-secondary)] bg-[var(--bg-surface-secondary)] border border-[var(--border-default)]'
                )}
              >
                {change}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-[var(--text-secondary)] mt-2">{subtitle}</p>}
        </div>
        <div className="p-2.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl text-[var(--text-secondary)]">
          {icon}
        </div>
      </div>
    </div>
  );
};
