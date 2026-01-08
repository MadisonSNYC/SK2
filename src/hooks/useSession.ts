import { useState, useEffect } from 'react';
import type { Session, Transaction, TransactionType } from '../types/index';
import { STORAGE_KEYS } from '../types/index';
import { getStorageItem, setStorageItem, generateId } from '../utils/storage';

interface StartSessionParams {
  startingBalance: number;
  machineId?: string;
  currentGameId?: string;
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
    const { startingBalance, machineId, currentGameId, location, notes } = params;

    const newSession: Session = {
      id: generateId(),
      startTime: new Date(),
      isActive: true,
      startingBalance,
      currentBalance: startingBalance,
      machineId,
      currentGameId,
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
   */
  const addTransaction = (
    type: TransactionType,
    amount: number,
    description?: string
  ): Transaction | null => {
    if (!activeSession) return null;

    const transaction: Transaction = {
      id: generateId(),
      sessionId: activeSession.id,
      timestamp: new Date(),
      type,
      amount: Math.abs(amount), // Always store as positive
      description,
      game: activeSession.currentGameId,
      machineId: activeSession.machineId,
    };

    // Calculate new balance
    const balanceChange =
      type === 'win' || type === 'cashout' ? amount : -amount;

    const newBalance = activeSession.currentBalance + balanceChange;

    // Update session with new transaction and balance
    setActiveSession({
      ...activeSession,
      currentBalance: newBalance,
      transactions: [...activeSession.transactions, transaction],
    });

    return transaction;
  };

  /**
   * Get all transactions for the active session
   */
  const getSessionTransactions = (): Transaction[] => {
    return activeSession?.transactions || [];
  };

  /**
   * Get session statistics
   */
  const getSessionStats = () => {
    if (!activeSession) return null;

    const transactions = activeSession.transactions;
    const wins = transactions.filter((t) => t.type === 'win');
    const losses = transactions.filter((t) => t.type === 'loss');

    const totalWins = wins.reduce((sum, t) => sum + t.amount, 0);
    const totalLosses = losses.reduce((sum, t) => sum + t.amount, 0);
    const netProfitLoss = totalWins - totalLosses;
    const winRate =
      transactions.length > 0 ? (wins.length / transactions.length) * 100 : 0;

    return {
      totalWins,
      totalLosses,
      netProfitLoss,
      winCount: wins.length,
      lossCount: losses.length,
      winRate,
    };
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
    getSessionTransactions,
    getSessionStats,
  };
}
