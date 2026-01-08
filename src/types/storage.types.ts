/**
 * @fileoverview Storage constants and types
 * @module types/storage
 *
 * LocalStorage keys and related type definitions.
 */

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
  ACTIVE_MACHINE_ID: 'skillmachine_active_machine_id',
  CURRENT_SEQUENCE: 'skillmachine_current_sequence',
  LIFETIME_STATS: 'skillmachine_lifetime_stats',
} as const;
