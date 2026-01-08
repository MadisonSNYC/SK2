/**
 * @fileoverview Follow Me statistics component
 * @module components/stats/FollowMeStats
 */

import StatCard from './StatCard';
import { formatCurrency } from '../../utils/formatting';

interface FollowMeStatsProps {
  attempts: number;
  successRate: number;
  avgRounds: number;
  bonusTotal: number;
}

export default function FollowMeStats({
  attempts,
  successRate,
  avgRounds,
  bonusTotal,
}: FollowMeStatsProps) {
  if (attempts === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-3">🎯 Follow Me Stats</h3>
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Attempts"
          value={attempts}
          icon="🎮"
        />
        <StatCard
          label="Success Rate"
          value={`${successRate.toFixed(1)}%`}
          icon="✅"
          color={successRate >= 50 ? 'green' : 'red'}
        />
        <StatCard
          label="Avg Rounds"
          value={avgRounds.toFixed(1)}
          icon="🔢"
        />
        <StatCard
          label="Bonus Wins"
          value={formatCurrency(bonusTotal)}
          icon="🎁"
          color="green"
        />
      </div>
    </div>
  );
}
