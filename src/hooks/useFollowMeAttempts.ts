import { useState, useEffect } from 'react';
import type { FollowMeAttempt, ColorKey, BonusDetails } from '../types/index';
import { STORAGE_KEYS } from '../types/index';
import { getStorageItem, setStorageItem, generateId } from '../utils/storage';

export function useFollowMeAttempts() {
  const [attempts, setAttempts] = useState<FollowMeAttempt[]>([]);

  // Load attempts from localStorage on mount
  useEffect(() => {
    const saved = getStorageItem<FollowMeAttempt[]>(STORAGE_KEYS.FOLLOW_ME_ATTEMPTS, []);
    setAttempts(saved);
  }, []);

  // Save attempts to localStorage whenever they change
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.FOLLOW_ME_ATTEMPTS, attempts);
  }, [attempts]);

  /**
   * Save a new Follow Me attempt
   */
  const saveAttempt = (
    roundsCompleted: number,
    sequence: ColorKey[],
    bonusTriggered: boolean,
    bonusDetails?: BonusDetails,
    machineId?: string,
    sessionId?: string
  ) => {
    const attempt: FollowMeAttempt = {
      id: generateId(),
      timestamp: new Date(),
      machineId,
      sessionId,
      roundsCompleted,
      sequence: [...sequence],
      success: roundsCompleted >= 20,
      bonusTriggered,
      bonusDetails,
    };

    setAttempts(prev => [attempt, ...prev]); // Add to beginning (newest first)
    return attempt;
  };

  /**
   * Get all attempts for a specific machine
   */
  const getAttemptsForMachine = (machineId: string): FollowMeAttempt[] => {
    return attempts.filter(attempt => attempt.machineId === machineId);
  };

  /**
   * Get all attempts for a specific session
   */
  const getAttemptsForSession = (sessionId: string): FollowMeAttempt[] => {
    return attempts.filter(attempt => attempt.sessionId === sessionId);
  };

  /**
   * Delete an attempt by ID
   */
  const deleteAttempt = (id: string) => {
    setAttempts(prev => prev.filter(attempt => attempt.id !== id));
  };

  /**
   * Clear all attempts (with confirmation)
   */
  const clearAllAttempts = () => {
    setAttempts([]);
  };

  return {
    attempts,
    saveAttempt,
    getAttemptsForMachine,
    getAttemptsForSession,
    deleteAttempt,
    clearAllAttempts,
  };
}
