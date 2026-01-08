/**
 * @fileoverview Session info display component
 * @module components/tracker/SessionInfoCard
 *
 * Displays session metadata (starting balance, location, machine, notes).
 * Extracted from ActiveSessionDashboard.tsx to separate info display concerns.
 */

interface SessionInfoCardProps {
  startingBalance: number;
  location?: string;
  machineName?: string;
  notes?: string;
  className?: string;
}

export default function SessionInfoCard({
  startingBalance,
  location,
  machineName,
  notes,
  className = '',
}: SessionInfoCardProps) {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 space-y-3 ${className}`}>
      <div>
        <p className="text-xs text-gray-400">Starting Balance</p>
        <p className="text-lg font-semibold text-white">${startingBalance.toFixed(2)}</p>
      </div>

      {machineName && (
        <div>
          <p className="text-xs text-gray-400">Machine</p>
          <p className="text-lg font-semibold text-yellow-400">{machineName}</p>
        </div>
      )}

      {location && (
        <div>
          <p className="text-xs text-gray-400">Location</p>
          <p className="text-lg text-white">{location}</p>
        </div>
      )}

      {notes && (
        <div>
          <p className="text-xs text-gray-400">Notes</p>
          <p className="text-sm text-gray-300">{notes}</p>
        </div>
      )}
    </div>
  );
}
