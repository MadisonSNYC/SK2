/**
 * SkillMachine Type Definitions
 *
 * Core data models for the slot tracker and Follow Me helper.
 * Based on PA skill game research (Pace-O-Matic, Banilla, etc.)
 */

// ============================================
// COLOR TYPES (Follow Me)
// ============================================

/** Valid color keys for the 3x3 Follow Me grid */
export type ColorKey =
  | 'hot-pink'
  | 'blue'
  | 'red'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'grey'
  | 'pink'
  | 'burgundy';

/** Color definition with display info */
export interface ColorDefinition {
  name: string;       // Display name (e.g., "Hot Pink")
  hex: string;        // Hex color code (e.g., "#FF69B4")
  position: number;   // Grid position 0-8 (left-to-right, top-to-bottom)
  aliases: string[];  // Voice recognition aliases
}

// ============================================
// MACHINE TYPES
// ============================================

/** Follow Me variant type */
export type FollowMeVariant = 'colors' | 'banana' | 'piano' | 'numbers' | 'none';

/** Known PA skill game manufacturers */
export type Manufacturer =
  | 'Pace-O-Matic'
  | 'Banilla'
  | 'Miele'
  | 'Grover'
  | 'Diamond Skill'
  | 'Other';

/**
 * Machine profile - stores info about a specific skill game machine
 * Users can save multiple machines they play regularly
 */
export interface Machine {
  id: string;                        // Unique identifier (UUID)
  name: string;                      // User-defined name (e.g., "Sunoco PA Skill #3")
  manufacturer: Manufacturer;        // Machine manufacturer
  gameSeries?: string;               // Platform/series (e.g., "Pennsylvania Skill", "Diamond Skill 9")
  gameTitle?: string;                // Specific game if known (e.g., "Pirates High Seas")
  followMeVariant: FollowMeVariant;  // Type of Follow Me game (colors, banana, none, etc.)
  followMeGridSize?: number;         // Grid size (default 9 for 3x3)
  followMeRoundsToWin?: number;      // Rounds needed to win (default 20)
  followMePaybackPercent?: number;   // Payback on win (default 105 for POM, 104 for Banilla)
  maxBet?: number;                   // Max bet allowed (e.g., $4.00 for POM)
  location?: string;                 // Venue name (e.g., "Joe's Bar", "Sunoco Main St")
  locationAddress?: string;          // Optional address
  notes?: string;                    // User notes about this machine
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SESSION TYPES
// ============================================

/**
 * Play session - represents one visit/session on a machine
 * From sitting down to cashing out
 */
export interface Session {
  id: string;
  machineId: string;                 // Link to Machine being played
  startTime: Date;
  endTime?: Date;                    // Undefined if session is active
  isActive: boolean;                 // True if session is ongoing

  // Bankroll tracking
  startingBalance: number;           // Money started with
  currentBalance: number;            // Current balance (updated as transactions are logged)

  // Computed totals (can be derived from transactions but cached for performance)
  totalWagered: number;              // Sum of all bets placed
  totalWon: number;                  // Sum of all winnings
  totalLost: number;                 // Sum of all losses
  netProfit: number;                 // currentBalance - startingBalance

  // Metadata
  transactionCount: number;          // Number of transactions
  followMeAttemptCount: number;      // Number of Follow Me games played
  notes?: string;
}

// ============================================
// TRANSACTION TYPES
// ============================================

/** Transaction type categories */
export type TransactionType =
  | 'win'      // Money won from a spin
  | 'loss'     // Money lost on a spin
  | 'expense'  // Side costs (drinks, food, tips)
  | 'buy-in'   // Additional money added to session
  | 'cashout'; // Partial or full withdrawal

/**
 * Transaction - individual money movement within a session
 */
export interface Transaction {
  id: string;
  sessionId: string;
  timestamp: Date;
  type: TransactionType;
  amount: number;                    // Always positive (type determines +/-)
  description?: string;              // Optional note
  gameTitle?: string;                // Which game on multi-game machine

  // For win/loss transactions
  betAmount?: number;                // Original bet that led to this outcome

  // Link to Follow Me if this was a Follow Me bonus win
  followMeAttemptId?: string;
}

// ============================================
// FOLLOW ME TYPES
// ============================================

/**
 * FollowMeAttempt - record of one Follow Me bonus game attempt
 * This is the core data for validating the "hack" hypothesis
 */
export interface FollowMeAttempt {
  id: string;
  sessionId: string;
  machineId: string;
  timestamp: Date;

  // Performance
  roundsCompleted: number;           // How many rounds correctly completed (0-20)
  success: boolean;                  // True if completed all rounds (20 for POM)

  // Payout
  triggeringBetAmount: number;       // The bet that was lost before Follow Me
  bonusAwarded: number;              // Amount won (bet + 5% on success, 0 on failure)

  // Pattern tracking (for "hack" analysis)
  precedingLossCount: number;        // How many losses before this attempt
  precedingLossAmount: number;       // Total $ lost before this attempt

  // Outcome tracking
  didBonusTriggerAfter?: boolean;    // Did a bonus feature trigger on next spins?
  spinsUntilNextWin?: number;        // How many spins until next win after this

  // Sequence data (optional - for replay/analysis)
  sequence?: ColorKey[];             // The actual sequence entered

  notes?: string;
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

/**
 * MachineStats - statistics for a specific machine
 */
export interface MachineStats {
  machineId: string;
  sessionCount: number;
  totalProfit: number;
  winRate: number;
  followMeAttempts: number;
  followMeSuccessRate: number;
  lastPlayed: Date;
}

// ============================================
// APP STATE TYPES
// ============================================

/** Current Follow Me helper state */
export interface FollowMeState {
  sequence: ColorKey[];
  currentRound: number;
  isActive: boolean;
  isSpeaking: boolean;
  isListening: boolean;              // Voice input active
}

/** App-wide settings */
export interface AppSettings {
  // Display
  theme: 'dark' | 'light' | 'system';
  currency: string;                  // USD, EUR, etc.

  // TTS
  ttsEnabled: boolean;
  ttsRate: number;                   // Speech rate (0.5 - 2.0)
  ttsVoice?: string;                 // Preferred voice

  // Follow Me
  defaultFollowMeVariant: FollowMeVariant;
  autoRecordFollowMe: boolean;       // Auto-create FollowMeAttempt on completion

  // Data
  autoSaveInterval: number;          // Seconds between auto-saves
}

// ============================================
// STORAGE KEYS
// ============================================

/** localStorage key constants */
export const STORAGE_KEYS = {
  MACHINES: 'skillmachine_machines',
  SESSIONS: 'skillmachine_sessions',
  TRANSACTIONS: 'skillmachine_transactions',
  FOLLOW_ME_ATTEMPTS: 'skillmachine_followme_attempts',
  SETTINGS: 'skillmachine_settings',
  ACTIVE_SESSION_ID: 'skillmachine_active_session',
  CURRENT_SEQUENCE: 'skillmachine_current_sequence',
} as const;
