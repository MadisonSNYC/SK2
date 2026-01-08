/**
 * @fileoverview Machine management types
 * @module types/machine
 *
 * Types for skill game machine tracking including:
 * - Machine definitions
 * - Manufacturer information
 * - Machine-specific statistics
 */

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
