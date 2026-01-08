/**
 * @fileoverview Session detail page
 * @module pages/SessionDetailPage
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { formatCurrency, formatDuration, formatDate } from '../utils/formatting';
import SessionBalanceCard from '../components/tracker/SessionBalanceCard';

export default function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions } = useSessionContext();

  const session = sessions.find(s => s.id === sessionId);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold mb-2">Session Not Found</h2>
          <button
            onClick={() => navigate('/history')}
            className="text-yellow-400 underline"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const duration = session.endTime
    ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000)
    : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-24">
      {/* Header */}
      <button
        onClick={() => navigate('/history')}
        className="text-gray-400 hover:text-white mb-4"
      >
        ← Back to History
      </button>

      <h1 className="text-2xl font-bold mb-1">
        {session.location || 'Session Details'}
      </h1>
      <p className="text-gray-400 mb-6">
        {formatDate(new Date(session.startTime))}
      </p>

      {/* Balance Card */}
      <SessionBalanceCard
        currentBalance={session.endingBalance || session.currentBalance}
        startingBalance={session.startingBalance}
        className="mb-6"
      />

      {/* Session Info */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Duration</span>
          <span className="text-white">{formatDuration(duration)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Starting Balance</span>
          <span className="text-white">{formatCurrency(session.startingBalance)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Ending Balance</span>
          <span className="text-white">{formatCurrency(session.endingBalance || session.currentBalance)}</span>
        </div>
        {session.machineId && (
          <div className="flex justify-between">
            <span className="text-gray-400">Machine</span>
            <span className="text-white">{session.machineId}</span>
          </div>
        )}
      </div>

      {/* Transactions */}
      <h2 className="text-lg font-bold mb-3">Transactions ({session.transactions?.length || 0})</h2>

      {session.transactions && session.transactions.length > 0 ? (
        <div className="space-y-2">
          {session.transactions.map(txn => (
            <div key={txn.id} className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
              <div>
                <div className={`font-medium ${
                  txn.type === 'win' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {txn.type === 'win' ? '💰 Win' : '💸 Loss'}
                </div>
                <div className="text-gray-400 text-sm">
                  {formatDate(new Date(txn.timestamp))}
                </div>
              </div>
              <div className={`text-lg font-bold ${
                txn.type === 'win' ? 'text-green-400' : 'text-red-400'
              }`}>
                {txn.type === 'win' ? '+' : '-'}{formatCurrency(txn.amount)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No transactions recorded
        </div>
      )}

      {/* Notes */}
      {session.notes && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Notes</h2>
          <div className="bg-gray-800 rounded-lg p-4 text-gray-300">
            {session.notes}
          </div>
        </div>
      )}
    </div>
  );
}
