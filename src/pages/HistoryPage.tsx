/**
 * @fileoverview Session history page
 * @module pages/HistoryPage
 */

import { useSessionHistory } from '../hooks/useSessionHistory';
import SessionHistoryList from '../components/history/SessionHistoryList';
import HistoryFilters from '../components/history/HistoryFilters';
import { formatCurrency } from '../utils/formatting';

export default function HistoryPage() {
  const {
    filteredSessions,
    filters,
    setFilters,
    clearFilters,
    sortField,
    sortOrder,
    setSortField,
    toggleSortOrder,
    totalSessions,
    totalProfit,
    locations,
  } = useSessionHistory();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-24">
      <h1 className="text-2xl font-bold mb-2">Session History</h1>

      {/* Summary */}
      <div className="flex gap-4 mb-4 text-sm">
        <span className="text-gray-400">
          {totalSessions} session{totalSessions !== 1 ? 's' : ''}
        </span>
        <span className={totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
          {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)} total
        </span>
      </div>

      <HistoryFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortFieldChange={setSortField}
        onSortOrderToggle={toggleSortOrder}
        locations={locations}
      />

      <SessionHistoryList sessions={filteredSessions} />
    </div>
  );
}
