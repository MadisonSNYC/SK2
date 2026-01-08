/**
 * @fileoverview Reusable text input field component
 * @module components/common/TextInputField
 */

import type { ReactNode } from 'react';

interface TextInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  type?: 'text' | 'number';
  step?: string;
  className?: string;
}

export default function TextInputField({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  type = 'text',
  step,
  className = '',
}: TextInputFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
          error ? 'border-red-500' : 'border-gray-600'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
