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
          'inline-flex items-center p-1 bg-[#18181b] border border-[#27272a] rounded-xl',
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
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a]'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                    isActive ? 'bg-blue-700 text-white' : 'bg-[#27272a] text-[#a1a1aa]'
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
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                  : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46]'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#27272a] text-[#fafafa] font-mono">
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
    <div className={cn('border-b border-[#27272a] flex items-center gap-6', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer border-b-2 -mb-px whitespace-nowrap',
              isActive
                ? 'border-blue-500 text-white font-bold'
                : 'border-transparent text-[#71717a] hover:text-[#a1a1aa]'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-mono',
                  isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-[#27272a] text-[#71717a]'
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
