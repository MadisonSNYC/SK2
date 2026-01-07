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

// SESSION TYPES moved to line 268+ (Phase 3 implementation)
// TRANSACTION TYPES moved to line 268+ (Phase 3 implementation)

// ============================================
// FOLLOW ME TYPES
// ============================================

/** Bonus type for machine bonuses */
export type BonusType = 'Bonus Spins' | 'Free Games' | 'Pick Bonus' | 'Other';

/** Currency mode for winnings */
export type CurrencyMode = 'credits' | 'dollars';

/**
 * Bonus details from a triggered bonus feature
 * Tracks spins, retriggs, and winnings
 */
export interface BonusDetails {
  type: BonusType;                   // Type of bonus triggered
  initialSpinsAwarded?: number;      // Initial spins given (e.g., 8)
  retriggered: boolean;              // Did the bonus retrigger?
  totalSpins?: number;               // Total spins including retriggs (e.g., 20)
  winnings: number;                  // Total amount won from bonus
  currencyMode: CurrencyMode;        // Credits or dollars
}

/**
 * FollowMeAttempt - record of one Follow Me bonus game attempt
 * Tracks sequence completion and any bonus features triggered after
 */
export interface FollowMeAttempt {
  id: string;
  timestamp: Date;
  machineId?: string;                // Link to Machine (optional - may not be selected)
  sessionId?: string;                // Link to active Session (optional)

  // Performance
  roundsCompleted: number;           // How many colors in sequence (can go past 20)
  sequence: ColorKey[];              // The actual sequence of colors
  success: boolean;                  // True if completed 20+ rounds

  // Bonus tracking (NEW for Phase 2.5)
  bonusTriggered: boolean;           // Did a bonus feature trigger after this attempt?
  bonusDetails?: BonusDetails;       // Details if bonus triggered

  // Legacy fields for "hack" hypothesis validation (optional)
  triggeringBetAmount?: number;      // The bet that was lost before Follow Me
  bonusAwarded?: number;             // Amount won from Follow Me completion
  precedingLossCount?: number;       // How many losses before this attempt
  precedingLossAmount?: number;      // Total $ lost before this attempt
  spinsUntilNextWin?: number;        // How many spins until next win after this

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

// LifetimeStats already defined above (lines 132-162)

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
  ACTIVE_SESSION: 'skillmachine_active_session',
  CURRENT_SEQUENCE: 'skillmachine_current_sequence',
  LIFETIME_STATS: 'skillmachine_lifetime_stats',
} as const;
