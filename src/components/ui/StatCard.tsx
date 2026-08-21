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
        'bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all duration-200 hover:border-[#3f3f46]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase text-[#71717a] font-bold tracking-wider">{title}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-[#fafafa]">{value}</span>
            {change && (
              <span
                className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded-md font-mono',
                  changeType === 'positive' && 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
                  changeType === 'negative' && 'text-rose-400 bg-rose-500/10 border border-rose-500/20',
                  changeType === 'neutral' && 'text-[#a1a1aa] bg-[#27272a] border border-[#3f3f46]'
                )}
              >
                {change}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-[#a1a1aa] mt-2">{subtitle}</p>}
        </div>
        <div className="p-3 bg-[#09090b] border border-[#27272a] rounded-xl text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );
};
