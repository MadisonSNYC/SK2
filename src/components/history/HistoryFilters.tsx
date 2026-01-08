/**
 * @fileoverview History filter controls
 * @module components/history/HistoryFilters
 */

import { useState } from 'react';
import type { HistoryFilters as Filters, SortField, SortOrder } from '../../hooks/useSessionHistory';

interface HistoryFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderToggle: () => void;
  locations: string[];
}

export default function HistoryFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  sortField,
  sortOrder,
  onSortFieldChange,
  onSortOrderToggle,
  locations,
}: HistoryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined);

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      {/* Sort Controls */}
      <div className="flex gap-2 mb-3">
        <select
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
        >
          <option value="date">Sort by Date</option>
          <option value="profit">Sort by Profit</option>
          <option value="duration">Sort by Duration</option>
        </select>
        <button
          onClick={onSortOrderToggle}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        >
          {sortOrder === 'desc' ? '↓' : '↑'}
        </button>
      </div>

      {/* Expand/Collapse Filters */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-yellow-400 text-sm flex items-center gap-1"
      >
        {isExpanded ? '▼' : '▶'} Filters
        {hasActiveFilters && <span className="bg-yellow-500 text-gray-900 px-2 py-0.5 rounded-full text-xs">Active</span>}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* Location Filter */}
          {locations.length > 0 && (
            <select
              value={filters.location || ''}
              onChange={(e) => onFiltersChange({ ...filters, location: e.target.value || undefined })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-red-400 text-sm underline"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
