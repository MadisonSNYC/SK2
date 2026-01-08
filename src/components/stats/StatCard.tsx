/**
 * @fileoverview Stat card component
 * @module components/stats/StatCard
 */

import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: 'default' | 'green' | 'red' | 'yellow';
  subtext?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  color = 'default',
  subtext
}: StatCardProps) {
  const colorClasses = {
    default: 'text-white',
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-xl">{icon}</span>}
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>
        {value}
      </div>
      {subtext && (
        <div className="text-gray-500 text-xs mt-1">{subtext}</div>
      )}
    </div>
  );
}
