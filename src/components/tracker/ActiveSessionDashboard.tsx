import { useState, useEffect } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useApp } from '../../context/AppContext';

interface ActiveSessionDashboardProps {
  onEndSession: () => void;
}

export default function ActiveSessionDashboard({ onEndSession }: ActiveSessionDashboardProps) {
  const { activeSession, getNetProfitLoss } = useSessionContext();
  const { machines } = useApp();
  const [elapsed, setElapsed] = useState(0); // seconds
  const [showConfirm, setShowConfirm] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!activeSession) return;

    const interval = setInterval(() => {
      const start = new Date(activeSession.startTime).getTime();
      const now = Date.now();
      setElapsed(Math.floor((now - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!activeSession) {
    return (
      <div className="text-center text-gray-400 py-8">
        No active session
      </div>
    );
  }

  const netProfitLoss = getNetProfitLoss(activeSession);
  const isProfit = netProfitLoss > 0;
  const isLoss = netProfitLoss < 0;

  const machine = machines.find(m => m.id === activeSession.machineId);

  const handleEndClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmEnd = () => {
    onEndSession();
    setShowConfirm(false);
  };

  const handleCancelEnd = () => {
    setShowConfirm(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      {/* Header with Timer */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Active Session</h1>
        <div className="text-4xl font-mono font-bold text-yellow-400">
          {formatTime(elapsed)}
        </div>
        <p className="text-sm text-gray-400 mt-1">Elapsed Time</p>
      </div>

      {/* Balance Display */}
      <div className={`p-6 rounded-lg border-2 ${
        isProfit ? 'bg-green-900/20 border-green-500' :
        isLoss ? 'bg-red-900/20 border-red-500' :
        'bg-gray-800 border-gray-600'
      }`}>
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-1">Current Balance</p>
          <div className={`text-5xl font-bold ${
            isProfit ? 'text-green-400' :
            isLoss ? 'text-red-400' :
            'text-white'
          }`}>
            ${activeSession.currentBalance.toFixed(2)}
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

      {/* Session Info */}
      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
        <div>
          <p className="text-xs text-gray-400">Starting Balance</p>
          <p className="text-lg font-semibold text-white">${activeSession.startingBalance.toFixed(2)}</p>
        </div>

        {machine && (
          <div>
            <p className="text-xs text-gray-400">Machine</p>
            <p className="text-lg font-semibold text-yellow-400">{machine.name}</p>
          </div>
        )}

        {activeSession.location && (
          <div>
            <p className="text-xs text-gray-400">Location</p>
            <p className="text-lg text-white">{activeSession.location}</p>
          </div>
        )}

        {activeSession.notes && (
          <div>
            <p className="text-xs text-gray-400">Notes</p>
            <p className="text-sm text-gray-300">{activeSession.notes}</p>
          </div>
        )}
      </div>

      {/* Placeholder for Transaction Buttons (Phase 4) */}
      <div className="bg-gray-800 rounded-lg p-6 text-center border-2 border-dashed border-gray-700">
        <p className="text-gray-400 text-sm">
          💡 Transaction logging coming in Phase 4
        </p>
        <p className="text-gray-500 text-xs mt-1">
          (+Win / -Loss / Expense buttons)
        </p>
      </div>

      {/* End Session Button */}
      {!showConfirm ? (
        <button
          onClick={handleEndClick}
          className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
        >
          End Session
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-center text-yellow-400 font-semibold">
            End this session?
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCancelEnd}
              className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmEnd}
              className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Yes, End Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
