import { useState, useEffect } from 'react';
import type { Session, Transaction } from '../types/index';
import { STORAGE_KEYS } from '../types/index';
import { getStorageItem, setStorageItem, generateId } from '../utils/storage';
import { parseCurrency } from '../utils/formatting';

interface StartSessionParams {
  startingBalance: number;
  machineId?: string;
  location?: string;
  notes?: string;
}

export function useSession() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  // Load sessions and active session from localStorage on mount
  useEffect(() => {
    const savedSessions = getStorageItem<Session[]>(STORAGE_KEYS.SESSIONS, []);
    const savedActiveSession = getStorageItem<Session | null>(STORAGE_KEYS.ACTIVE_SESSION, null);

    setSessions(savedSessions);
    setActiveSession(savedActiveSession);
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.SESSIONS, sessions);
  }, [sessions]);

  // Save active session to localStorage whenever it changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ACTIVE_SESSION, activeSession);
  }, [activeSession]);

  /**
   * Start a new session
   */
  const startSession = (params: StartSessionParams): Session => {
    const { startingBalance, machineId, location, notes } = params;

    const newSession: Session = {
      id: generateId(),
      startTime: new Date(),
      isActive: true,
      startingBalance,
      currentBalance: startingBalance,
      machineId,
      location,
      notes,
      transactions: [],
    };

    setActiveSession(newSession);
    return newSession;
  };

  /**
   * End the current active session
   */
  const endSession = (): Session | null => {
    if (!activeSession) return null;

    const completedSession: Session = {
      ...activeSession,
      endTime: new Date(),
      isActive: false,
      endingBalance: activeSession.currentBalance,
    };

    // Add to sessions array
    setSessions(prev => [completedSession, ...prev]); // Newest first

    // Clear active session
    setActiveSession(null);

    return completedSession;
  };

  /**
   * Update the current balance of the active session
   * (Will be used in Phase 4 when logging transactions)
   */
  const updateSessionBalance = (newBalance: number): void => {
    if (!activeSession) return;

    setActiveSession({
      ...activeSession,
      currentBalance: newBalance,
    });
  };

  /**
   * Add a note to the active session
   */
  const addNote = (note: string): void => {
    if (!activeSession) return;

    setActiveSession({
      ...activeSession,
      notes: note,
    });
  };

  /**
   * Get the duration of a session in minutes
   */
  const getSessionDuration = (session: Session): number => {
    const start = new Date(session.startTime).getTime();
    const end = session.endTime ? new Date(session.endTime).getTime() : Date.now();
    return Math.floor((end - start) / 1000 / 60); // Convert to minutes
  };

  /**
   * Get net profit/loss for a session
   */
  const getNetProfitLoss = (session: Session): number => {
    return session.currentBalance - session.startingBalance;
  };

  /**
   * Add a transaction to the active session
   * Automatically updates balance based on transaction type
   */
  const addTransaction = (
    type: 'win' | 'loss',
    amount: number,
    description?: string
  ): Transaction | null => {
    if (!activeSession) return null;

    const transaction: Transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: activeSession.id,
      timestamp: new Date(),
      type,
      amount: parseCurrency(amount),
      description,
    };

    const balanceChange = type === 'win' ? amount : -amount;
    const newBalance = parseCurrency(activeSession.currentBalance + balanceChange);

    const updatedSession = {
      ...activeSession,
      currentBalance: newBalance,
      transactions: [...(activeSession.transactions || []), transaction],
    };

    setActiveSession(updatedSession);

    return transaction;
  };

  return {
    sessions,
    activeSession,
    hasActiveSession: !!activeSession,
    startSession,
    endSession,
    updateSessionBalance,
    addNote,
    getSessionDuration,
    getNetProfitLoss,
    addTransaction,
  };
}
