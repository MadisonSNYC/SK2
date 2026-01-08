/**
 * @fileoverview Session history card component
 * @module components/history/SessionHistoryCard
 */

import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDuration, formatDate } from '../../utils/formatting';
import type { Session } from '../../types';

interface SessionHistoryCardProps {
  session: Session;
}

export default function SessionHistoryCard({ session }: SessionHistoryCardProps) {
  const navigate = useNavigate();

  const profit = (session.endingBalance || session.currentBalance) - session.startingBalance;
  const isProfit = profit > 0;
  const isLoss = profit < 0;

  const duration = session.endTime
    ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000)
    : 0;

  return (
    <button
      onClick={() => navigate(`/history/${session.id}`)}
      className="w-full bg-gray-800 rounded-lg p-4 text-left hover:bg-gray-750 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-white font-medium">
            {session.location || 'Unknown Location'}
          </div>
          <div className="text-gray-400 text-sm">
            {formatDate(new Date(session.startTime))}
          </div>
        </div>
        <div className={`text-lg font-bold ${
          isProfit ? 'text-green-400' : isLoss ? 'text-red-400' : 'text-gray-400'
        }`}>
          {isProfit ? '+' : ''}{formatCurrency(profit)}
        </div>
      </div>

      <div className="flex gap-4 text-sm text-gray-400">
        <span>⏱️ {formatDuration(duration)}</span>
        <span>💰 {formatCurrency(session.startingBalance)} start</span>
        <span>📊 {session.transactions?.length || 0} transactions</span>
      </div>
    </button>
  );
}
