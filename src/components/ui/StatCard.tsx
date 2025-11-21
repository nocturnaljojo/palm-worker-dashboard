'use client';

import React from 'react';
import clsx from 'clsx'; // Assuming clsx is already installed based on package.json

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; direction: 'up' | 'down'; percentage: number }; // Added percentage for trend
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  const trendColorClass = trend
    ? trend.direction === 'up'
      ? 'text-success' // Tailwind class for success green
      : 'text-error'   // Tailwind class for error red
    : 'text-text-muted'; // Default muted color

  return (
    <div className="bg-white shadow-md rounded-lg p-md flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-sm">
        <h3 className="text-text-muted font-body text-sm uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-primary-blue">{icon}</div>}
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-text-dark font-heading text-3xl font-bold">{value}</p>
        {trend && (
          <p className={clsx("font-body text-sm flex items-center", trendColorClass)}>
            {trend.direction === 'up' ? '▲' : '▼'} {trend.percentage}%
          </p>
        )}
      </div>
    </div>
  );
}
