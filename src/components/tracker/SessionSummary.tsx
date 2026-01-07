import { useSessionContext } from '../../context/SessionContext';
import { useApp } from '../../context/AppContext';
import type { Session } from '../../types/index';

interface SessionSummaryProps {
  session: Session;
  onDone: () => void;
}

export default function SessionSummary({ session, onDone }: SessionSummaryProps) {
  const { getSessionDuration, getNetProfitLoss } = useSessionContext();
  const { machines } = useApp();

  const duration = getSessionDuration(session);
  const netProfitLoss = getNetProfitLoss(session);
  const isProfit = netProfitLoss > 0;
  const isLoss = netProfitLoss < 0;

  const machine = machines.find(m => m.id === session.machineId);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Session Complete!</h1>
        <p className="text-gray-400 text-sm">Duration: {formatDuration(duration)}</p>
      </div>

      {/* Net Result (Large Display) */}
      <div className={`p-8 rounded-lg border-2 ${
        isProfit ? 'bg-green-900/20 border-green-500' :
        isLoss ? 'bg-red-900/20 border-red-500' :
        'bg-gray-800 border-gray-600'
      }`}>
        <div className="text-center">
          {isProfit && (
            <div className="text-6xl mb-4">✅</div>
          )}
          {isLoss && (
            <div className="text-6xl mb-4">📉</div>
          )}
          {!isProfit && !isLoss && (
            <div className="text-6xl mb-4">➖</div>
          )}

          <p className="text-sm text-gray-300 mb-2">Net Result</p>
          <div className={`text-6xl font-bold ${
            isProfit ? 'text-green-400' :
            isLoss ? 'text-red-400' :
            'text-gray-300'
          }`}>
            {isProfit && '+'}${netProfitLoss.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Balance Summary */}
      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Starting Balance:</span>
          <span className="text-lg font-semibold text-white">
            ${session.startingBalance.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Ending Balance:</span>
          <span className="text-lg font-semibold text-white">
            ${session.currentBalance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Session Details */}
      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
        {machine && (
          <div>
            <p className="text-xs text-gray-400">Machine</p>
            <p className="text-lg font-semibold text-yellow-400">{machine.name}</p>
          </div>
        )}

        {session.location && (
          <div>
            <p className="text-xs text-gray-400">Location</p>
            <p className="text-lg text-white">{session.location}</p>
          </div>
        )}

        {session.notes && (
          <div>
            <p className="text-xs text-gray-400">Notes</p>
            <p className="text-sm text-gray-300">{session.notes}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-400">Session Start</p>
          <p className="text-sm text-gray-300">
            {new Date(session.startTime).toLocaleString()}
          </p>
        </div>

        {session.endTime && (
          <div>
            <p className="text-xs text-gray-400">Session End</p>
            <p className="text-sm text-gray-300">
              {new Date(session.endTime).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Done Button */}
      <button
        onClick={onDone}
        className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
      >
        Done
      </button>
    </div>
  );
}
