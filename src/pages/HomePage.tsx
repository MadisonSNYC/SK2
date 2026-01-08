import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { hasActiveSession, activeSession, sessions } = useSessionContext();
  const navigate = useNavigate();
  const [_currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for "sessions today" calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Calculate today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  });

  const todayProfitLoss = todaySessions.reduce((total, session) => {
    if (!session.endingBalance) return total;
    return total + (session.endingBalance - session.startingBalance);
  }, 0);

  const recentSessions = sessions.slice(0, 3);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const formatDuration = (session: any) => {
    if (!session.endTime) return 'In Progress';
    const start = new Date(session.startTime).getTime();
    const end = new Date(session.endTime).getTime();
    const minutes = Math.floor((end - start) / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Track your skill machine performance</p>
      </div>

      {/* Active Session Alert */}
      {hasActiveSession && activeSession && (
        <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-white font-semibold">Session In Progress</p>
              <p className="text-sm text-gray-300">
                Started {formatDate(activeSession.startTime)}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/session')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            Resume Session
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Today's Sessions</p>
          <p className="text-2xl font-bold text-white">{todaySessions.length}</p>
        </div>
        <div className={`rounded-lg p-4 border ${
          todayProfitLoss > 0
            ? 'bg-green-900/20 border-green-500'
            : todayProfitLoss < 0
            ? 'bg-red-900/20 border-red-500'
            : 'bg-gray-800 border-gray-700'
        }`}>
          <p className="text-sm text-gray-400 mb-1">Today's P/L</p>
          <p className={`text-2xl font-bold ${
            todayProfitLoss > 0
              ? 'text-green-400'
              : todayProfitLoss < 0
              ? 'text-red-400'
              : 'text-white'
          }`}>
            {todayProfitLoss >= 0 ? '+' : '-'}${formatCurrency(todayProfitLoss)}
          </p>
        </div>
      </div>

      {/* Start Session CTA */}
      <button
        onClick={() => navigate('/start-session')}
        className="w-full py-6 px-8 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-xl rounded-lg transition-colors shadow-lg"
      >
        🎰 Start New Session
      </button>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Recent Sessions</h2>
          <div className="space-y-3">
            {recentSessions.map((session) => {
              const profitLoss = session.endingBalance
                ? session.endingBalance - session.startingBalance
                : session.currentBalance - session.startingBalance;
              const isProfit = profitLoss > 0;
              const isLoss = profitLoss < 0;

              return (
                <div
                  key={session.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold">
                        {formatDate(session.startTime)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDuration(session)} • {session.location || 'No location'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        isProfit ? 'text-green-400' : isLoss ? 'text-red-400' : 'text-white'
                      }`}>
                        {profitLoss >= 0 ? '+' : '-'}${formatCurrency(profitLoss)}
                      </p>
                      <p className="text-sm text-gray-400">
                        ${formatCurrency(session.startingBalance)} → ${formatCurrency(session.endingBalance || session.currentBalance)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasActiveSession && recentSessions.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <p className="text-gray-400 text-lg mb-2">No sessions yet</p>
          <p className="text-sm text-gray-500">Start your first session to begin tracking</p>
        </div>
      )}
    </div>
  );
}
