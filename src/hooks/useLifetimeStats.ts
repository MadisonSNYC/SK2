/**
 * @fileoverview Lifetime statistics hook
 * @module hooks/useLifetimeStats
 */

import { useMemo } from 'react';
import { useSessionContext } from '../context/SessionContext';
import { useFollowMeAttempts } from './useFollowMeAttempts';
import type { LifetimeStats } from '../types';

export function useLifetimeStats(): LifetimeStats & { isLoading: boolean } {
  const { sessions } = useSessionContext();
  const { attempts } = useFollowMeAttempts();

  const stats = useMemo((): LifetimeStats => {
    const completedSessions = sessions.filter(s => !s.isActive && s.endTime);

    // Session stats
    const totalSessions = completedSessions.length;
    const totalTimeMinutes = completedSessions.reduce((sum, s) => {
      const duration = (new Date(s.endTime!).getTime() - new Date(s.startTime).getTime()) / 60000;
      return sum + duration;
    }, 0);

    // Money stats
    const profits = completedSessions.map(s =>
      (s.endingBalance || s.currentBalance) - s.startingBalance
    );
    const totalWon = profits.filter(p => p > 0).reduce((sum, p) => sum + p, 0);
    const totalLost = Math.abs(profits.filter(p => p < 0).reduce((sum, p) => sum + p, 0));
    const netProfit = totalWon - totalLost;
    const totalWagered = completedSessions.reduce((sum, s) => sum + s.startingBalance, 0);

    // Win rate
    const winningSessions = profits.filter(p => p > 0).length;
    const winRate = totalSessions > 0 ? (winningSessions / totalSessions) * 100 : 0;

    // ROI
    const roi = totalWagered > 0 ? (netProfit / totalWagered) * 100 : 0;

    // Averages
    const averageSessionDuration = totalSessions > 0 ? totalTimeMinutes / totalSessions : 0;
    const averageSessionProfit = totalSessions > 0 ? netProfit / totalSessions : 0;

    // Records
    const biggestWin = profits.length > 0 ? Math.max(...profits, 0) : 0;
    const biggestLoss = profits.length > 0 ? Math.min(...profits, 0) : 0;

    // Streaks
    let currentStreak = 0;
    let currentStreakType: 'win' | 'lose' | 'none' = 'none';
    let longestWinStreak = 0;
    let longestLoseStreak = 0;
    let tempWinStreak = 0;
    let tempLoseStreak = 0;

    // Process profits in chronological order (they're already in that order)
    for (const profit of profits) {
      if (profit > 0) {
        tempWinStreak++;
        tempLoseStreak = 0;
        longestWinStreak = Math.max(longestWinStreak, tempWinStreak);
      } else if (profit < 0) {
        tempLoseStreak++;
        tempWinStreak = 0;
        longestLoseStreak = Math.max(longestLoseStreak, tempLoseStreak);
      }
    }

    // Current streak is the last streak
    if (profits.length > 0) {
      const lastProfit = profits[profits.length - 1];
      if (lastProfit > 0) {
        currentStreakType = 'win';
        currentStreak = tempWinStreak;
      } else if (lastProfit < 0) {
        currentStreakType = 'lose';
        currentStreak = tempLoseStreak;
      }
    }

    // Follow Me stats
    const totalFollowMeAttempts = attempts.length;
    const successfulAttempts = attempts.filter(a => a.success).length;
    const followMeSuccessRate = totalFollowMeAttempts > 0
      ? (successfulAttempts / totalFollowMeAttempts) * 100
      : 0;
    const followMeAverageRounds = totalFollowMeAttempts > 0
      ? attempts.reduce((sum, a) => sum + a.roundsCompleted, 0) / totalFollowMeAttempts
      : 0;
    const followMeBonusTotal = attempts
      .filter(a => a.bonusTriggered && a.bonusDetails)
      .reduce((sum, a) => sum + (a.bonusDetails?.winnings || 0), 0);

    return {
      totalSessions,
      totalTimeMinutes,
      totalWagered,
      totalWon,
      totalLost,
      netProfit,
      winRate,
      roi,
      averageSessionDuration,
      averageSessionProfit,
      biggestWin,
      biggestLoss,
      longestWinStreak,
      longestLoseStreak,
      currentStreak,
      currentStreakType,
      totalFollowMeAttempts,
      followMeSuccessRate,
      followMeAverageRounds,
      followMeBonusTotal,
    };
  }, [sessions, attempts]);

  return { ...stats, isLoading: false };
}
