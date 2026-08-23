import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'underline' | 'pills' | 'segmented';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'underline',
}) => {
  if (variant === 'segmented') {
    return (
      <div
        className={cn(
          'inline-flex items-center p-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-default)] rounded-xl',
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap',
                isActive
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/50'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                    isActive ? 'bg-[var(--border-default)] text-[var(--text-primary)]' : 'bg-[var(--bg-surface-secondary)] text-[var(--text-secondary)]'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div className={cn('flex flex-wrap items-center gap-2', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap border',
                isActive
                  ? 'bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] border-[var(--border-hover)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default underline
  return (
    <div className={cn('border-b border-[var(--border-default)] flex items-center gap-6', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer border-b-2 -mb-px whitespace-nowrap',
              isActive
                ? 'border-[var(--text-primary)] text-[var(--text-primary)] font-bold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-mono',
                  isActive ? 'bg-[var(--bg-surface-secondary)] text-[var(--text-primary)]' : 'bg-[var(--bg-surface-secondary)] text-[var(--text-muted)]'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
