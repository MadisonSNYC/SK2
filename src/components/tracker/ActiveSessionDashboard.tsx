/**
 * @fileoverview Active session dashboard
 * @module components/tracker/ActiveSessionDashboard
 *
 * Main dashboard for viewing and managing an active session.
 * Refactored to compose SessionTimer, SessionBalanceCard, and SessionInfoCard.
 */

import { useState } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useApp } from '../../context/AppContext';
import SessionTimer from './SessionTimer';
import SessionBalanceCard from './SessionBalanceCard';
import SessionInfoCard from './SessionInfoCard';

interface ActiveSessionDashboardProps {
  onEndSession: () => void;
}

export default function ActiveSessionDashboard({ onEndSession }: ActiveSessionDashboardProps) {
  const { activeSession } = useSessionContext();
  const { machines } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!activeSession) {
    return (
      <div className="text-center text-gray-400 py-8">
        No active session
      </div>
    );
  }

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
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Active Session</h1>
      </div>

      {/* Timer */}
      <SessionTimer startTime={activeSession.startTime} />

      {/* Balance Display */}
      <SessionBalanceCard
        currentBalance={activeSession.currentBalance}
        startingBalance={activeSession.startingBalance}
      />

      {/* Session Info */}
      <SessionInfoCard
        startingBalance={activeSession.startingBalance}
        machineName={machine?.name}
        location={activeSession.location}
        notes={activeSession.notes}
      />

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
