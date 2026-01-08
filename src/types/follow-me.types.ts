/**
 * @fileoverview Follow Me Helper feature types
 * @module types/follow-me
 *
 * Types for the Follow Me memory game helper including:
 * - Color definitions and grid layout
 * - Game state and attempt tracking
 * - Bonus round tracking
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

/** Current Follow Me helper state */
export interface FollowMeState {
  sequence: ColorKey[];
  currentRound: number;
  isActive: boolean;
  isSpeaking: boolean;
  isListening: boolean;              // Voice input active
}
