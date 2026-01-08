/**
 * @fileoverview Reusable select dropdown field component
 * @module components/common/SelectField
 */

import type { ReactNode } from 'react';

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export default function SelectField({
  label,
  value,
  onChange,
  required,
  children,
  className = '',
}: SelectFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        {children}
      </select>
    </div>
  );
}
