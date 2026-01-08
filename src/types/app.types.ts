/**
 * @fileoverview App configuration types
 * @module types/app
 *
 * Types for application-wide settings and configuration.
 */

import type { FollowMeVariant } from './machine.types';

// ============================================
// APP STATE TYPES
// ============================================

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
