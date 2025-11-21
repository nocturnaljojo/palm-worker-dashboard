'use client';

import React from 'react';
import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; direction: 'up' | 'down' };
  variant?: 'default' | 'highlight';
}

export function StatCard({ title, value, icon, trend, variant = 'default' }: StatCardProps) {
  const isHighlight = variant === 'highlight';

  return (
    <div className={clsx(
      'relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
      isHighlight
        ? 'bg-gradient-to-br from-ocean to-midnight dark:from-charcoal dark:to-black text-white border-white/10 dark:border-gold/20'
        : 'bg-white dark:bg-charcoal/50 backdrop-blur-md border-slate-100 dark:border-white/5 text-slate-900 dark:text-white'
    )}>
      {/* Decorative glow for highlight cards */}
      {isHighlight && (
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-gold/20 rounded-full blur-3xl"></div>
      )}

      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className={clsx(
              'text-xs font-semibold uppercase tracking-wider mb-2',
              isHighlight
                ? 'text-gold'
                : 'text-slate-500 dark:text-slate-400'
            )}>
              {title}
            </p>
            <h3 className="text-3xl font-heading font-bold tracking-tight">
              {value}
            </h3>
          </div>
          {icon && (
            <div className={clsx(
              'p-3 rounded-xl',
              isHighlight
                ? 'bg-white/10 text-gold backdrop-blur-sm'
                : 'bg-ocean/5 dark:bg-white/5 text-ocean dark:text-gold'
            )}>
              {icon}
            </div>
          )}
        </div>

        {trend && (
          <div className="mt-5 flex items-center text-sm">
            <span className={clsx(
              'flex items-center font-medium px-2 py-0.5 rounded-full text-xs',
              trend.direction === 'up'
                ? (isHighlight ? 'bg-green-500/20 text-green-300' : 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400')
                : (isHighlight ? 'bg-coral/20 text-coral' : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400')
            )}>
              {trend.direction === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {trend.value}%
            </span>
            <span className={clsx(
              'ml-2 text-xs',
              isHighlight
                ? 'text-white/60'
                : 'text-slate-400 dark:text-slate-500'
            )}>
              vs last month
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
