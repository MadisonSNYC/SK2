/**
 * @fileoverview Session history hook with filtering and sorting
 * @module hooks/useSessionHistory
 */

import { useState, useMemo } from 'react';
import { useSessionContext } from '../context/SessionContext';
import type { Session } from '../types';

export type SortField = 'date' | 'profit' | 'duration';
export type SortOrder = 'asc' | 'desc';

export interface HistoryFilters {
  startDate?: Date;
  endDate?: Date;
  location?: string;
  machineId?: string;
  minProfit?: number;
  maxProfit?: number;
}

export interface UseSessionHistoryReturn {
  sessions: Session[];
  filteredSessions: Session[];
  filters: HistoryFilters;
  setFilters: (filters: HistoryFilters) => void;
  clearFilters: () => void;
  sortField: SortField;
  sortOrder: SortOrder;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
  totalSessions: number;
  totalProfit: number;
  locations: string[];
}

export function useSessionHistory(): UseSessionHistoryReturn {
  const { sessions } = useSessionContext();
  const [filters, setFilters] = useState<HistoryFilters>({});
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Get unique locations for filter dropdown
  const locations = useMemo(() => {
    const locs = sessions
      .map(s => s.location)
      .filter((loc): loc is string => !!loc);
    return [...new Set(locs)];
  }, [sessions]);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    let result = sessions.filter(s => !s.isActive); // Only completed sessions

    if (filters.startDate) {
      result = result.filter(s => new Date(s.startTime) >= filters.startDate!);
    }
    if (filters.endDate) {
      result = result.filter(s => new Date(s.startTime) <= filters.endDate!);
    }
    if (filters.location) {
      result = result.filter(s => s.location === filters.location);
    }
    if (filters.machineId) {
      result = result.filter(s => s.machineId === filters.machineId);
    }
    if (filters.minProfit !== undefined) {
      result = result.filter(s => {
        const profit = (s.endingBalance || s.currentBalance) - s.startingBalance;
        return profit >= filters.minProfit!;
      });
    }
    if (filters.maxProfit !== undefined) {
      result = result.filter(s => {
        const profit = (s.endingBalance || s.currentBalance) - s.startingBalance;
        return profit <= filters.maxProfit!;
      });
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          break;
        case 'profit':
          const profitA = (a.endingBalance || a.currentBalance) - a.startingBalance;
          const profitB = (b.endingBalance || b.currentBalance) - b.startingBalance;
          comparison = profitA - profitB;
          break;
        case 'duration':
          const durationA = a.endTime ? new Date(a.endTime).getTime() - new Date(a.startTime).getTime() : 0;
          const durationB = b.endTime ? new Date(b.endTime).getTime() - new Date(b.startTime).getTime() : 0;
          comparison = durationA - durationB;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [sessions, filters, sortField, sortOrder]);

  const totalProfit = useMemo(() => {
    return filteredSessions.reduce((sum, s) => {
      return sum + ((s.endingBalance || s.currentBalance) - s.startingBalance);
    }, 0);
  }, [filteredSessions]);

  const clearFilters = () => setFilters({});
  const toggleSortOrder = () => setSortOrder(o => o === 'asc' ? 'desc' : 'asc');

  return {
    sessions,
    filteredSessions,
    filters,
    setFilters,
    clearFilters,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    toggleSortOrder,
    totalSessions: filteredSessions.length,
    totalProfit,
    locations,
  };
}
