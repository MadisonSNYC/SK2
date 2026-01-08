/**
 * @fileoverview Session balance display component
 * @module components/tracker/SessionBalanceCard
 *
 * Displays current balance and net profit/loss for an active session.
 * Extracted from ActiveSessionDashboard.tsx to separate balance display concerns.
 */

interface SessionBalanceCardProps {
  currentBalance: number;
  startingBalance: number;
  className?: string;
}

export default function SessionBalanceCard({
  currentBalance,
  startingBalance,
  className = '',
}: SessionBalanceCardProps) {
  const netProfitLoss = currentBalance - startingBalance;
  const isProfit = netProfitLoss > 0;
  const isLoss = netProfitLoss < 0;

  return (
    <div className={`p-6 rounded-lg border-2 ${
      isProfit ? 'bg-green-900/20 border-green-500' :
      isLoss ? 'bg-red-900/20 border-red-500' :
      'bg-gray-800 border-gray-600'
    } ${className}`}>
      <div className="text-center">
        <p className="text-sm text-gray-300 mb-1">Current Balance</p>
        <div className={`text-5xl font-bold ${
          isProfit ? 'text-green-400' :
          isLoss ? 'text-red-400' :
          'text-white'
        }`}>
          ${currentBalance.toFixed(2)}
        </div>

        {/* Net Profit/Loss */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-1">Net</p>
          <div className={`text-2xl font-semibold ${
            isProfit ? 'text-green-400' :
            isLoss ? 'text-red-400' :
            'text-gray-300'
          }`}>
            {isProfit && '+'}${netProfitLoss.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
