/**
 * @fileoverview Statistics dashboard component
 * @module components/stats/StatsDashboard
 */

import { useLifetimeStats } from '../../hooks/useLifetimeStats';
import StatCard from './StatCard';
import FollowMeStats from './FollowMeStats';
import { formatCurrency, formatDuration } from '../../utils/formatting';

export default function StatsDashboard() {
  const stats = useLifetimeStats();

  if (stats.totalSessions === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📈</div>
        <h3 className="text-xl font-bold text-white mb-2">No Stats Yet</h3>
        <p className="text-gray-400">
          Complete some sessions to see your statistics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Net Profit"
          value={formatCurrency(stats.netProfit)}
          icon="💰"
          color={stats.netProfit >= 0 ? 'green' : 'red'}
        />
        <StatCard
          label="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          icon="📊"
          color={stats.winRate >= 50 ? 'green' : 'red'}
        />
        <StatCard
          label="Total Sessions"
          value={stats.totalSessions}
          icon="🎰"
        />
        <StatCard
          label="Time Played"
          value={formatDuration(stats.totalTimeMinutes)}
          icon="⏱️"
        />
      </div>

      {/* Records */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3">Records</h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Biggest Win"
            value={formatCurrency(stats.biggestWin)}
            icon="🏆"
            color="green"
          />
          <StatCard
            label="Biggest Loss"
            value={formatCurrency(Math.abs(stats.biggestLoss))}
            icon="📉"
            color="red"
          />
          <StatCard
            label="Win Streak"
            value={stats.longestWinStreak}
            icon="🔥"
            subtext="sessions"
          />
          <StatCard
            label="Lose Streak"
            value={stats.longestLoseStreak}
            icon="❄️"
            subtext="sessions"
          />
        </div>
      </div>

      {/* Averages */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3">Averages</h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Avg Session"
            value={formatCurrency(stats.averageSessionProfit)}
            color={stats.averageSessionProfit >= 0 ? 'green' : 'red'}
          />
          <StatCard
            label="Avg Duration"
            value={formatDuration(stats.averageSessionDuration)}
          />
          <StatCard
            label="ROI"
            value={`${stats.roi.toFixed(1)}%`}
            color={stats.roi >= 0 ? 'green' : 'red'}
          />
          <StatCard
            label="Total Wagered"
            value={formatCurrency(stats.totalWagered)}
          />
        </div>
      </div>

      {/* Follow Me Stats */}
      <FollowMeStats
        attempts={stats.totalFollowMeAttempts}
        successRate={stats.followMeSuccessRate}
        avgRounds={stats.followMeAverageRounds}
        bonusTotal={stats.followMeBonusTotal}
      />
    </div>
  );
}
