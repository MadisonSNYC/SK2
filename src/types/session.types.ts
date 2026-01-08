/**
 * @fileoverview Session Tracker feature types
 * @module types/session
 *
 * Types for gambling session tracking including:
 * - Session lifecycle and state
 * - Transaction records
 * - Lifetime statistics
 */

// ============================================
// SESSION TYPES (Phase 3)
// ============================================

/** Transaction type categories */
export type TransactionType = 'win' | 'loss' | 'buy-in' | 'cashout' | 'expense';

/**
 * Transaction - individual money movement within a session
 */
export interface Transaction {
  id: string;
  sessionId: string;
  timestamp: Date;
  type: TransactionType;
  amount: number;              // Always positive, type determines +/-
  description?: string;
  game?: string;               // Which game this transaction was on
  machineId?: string;          // Link to machine if applicable
}

/**
 * Session - represents one visit/session on a machine
 * From sitting down to cashing out
 */
export interface Session {
  id: string;
  startTime: Date;
  endTime?: Date;              // Undefined while active
  isActive: boolean;

  // Bankroll
  startingBalance: number;     // Initial buy-in amount
  currentBalance: number;      // Running balance (updated by transactions)
  endingBalance?: number;      // Final balance when session ends

  // Context
  machineId?: string;          // Primary machine for session
  currentGameId?: string;      // Current game being played
  location?: string;           // Venue name
  notes?: string;              // User notes

  // Linked data
  transactions: Transaction[]; // All transactions in this session
  followMeAttemptIds?: string[]; // Link to Follow Me attempts during session
}

// ============================================
// STATISTICS TYPES
// ============================================

/**
 * LifetimeStats - aggregated statistics across all sessions
 */
export interface LifetimeStats {
  // Session counts
  totalSessions: number;
  totalTimeMinutes: number;

  // Money
  totalWagered: number;
  totalWon: number;
  totalLost: number;
  netProfit: number;

  // Performance
  winRate: number;                   // % of profitable sessions
  roi: number;                       // (netProfit / totalWagered) * 100
  averageSessionDuration: number;    // In minutes
  averageSessionProfit: number;

  // Records
  biggestWin: number;
  biggestLoss: number;
  longestWinStreak: number;          // Consecutive profitable sessions
  longestLoseStreak: number;
  currentStreak: number;
  currentStreakType: 'win' | 'lose' | 'none';

  // Follow Me specific
  totalFollowMeAttempts: number;
  followMeSuccessRate: number;       // % of attempts that completed all rounds
  followMeAverageRounds: number;     // Average rounds completed
  followMeBonusTotal: number;        // Total $ won from Follow Me
}
