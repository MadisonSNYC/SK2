/**
 * @fileoverview Empty history state component
 * @module components/history/EmptyHistory
 */

import { useNavigate } from 'react-router-dom';

export default function EmptyHistory() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📊</div>
      <h3 className="text-xl font-bold text-white mb-2">No Sessions Yet</h3>
      <p className="text-gray-400 mb-6">
        Start tracking your sessions to see your history here.
      </p>
      <button
        onClick={() => navigate('/start-session')}
        className="px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400"
      >
        Start First Session
      </button>
    </div>
  );
}
