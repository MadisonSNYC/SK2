import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import StartSessionForm from '../components/tracker/StartSessionForm';

export default function TrackerPage() {
  const { hasActiveSession } = useSessionContext();
  const [showStartForm, setShowStartForm] = useState(false);
  const navigate = useNavigate();

  const handleStartSession = () => {
    setShowStartForm(true);
  };

  const handleCloseStartForm = () => {
    setShowStartForm(false);
  };

  const handleSessionStarted = () => {
    setShowStartForm(false);
    navigate('/tracker/session');
  };

  // If there's an active session, redirect to session page
  if (hasActiveSession) {
    navigate('/tracker/session');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 max-w-2xl mx-auto min-h-[60vh]">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Session Tracker</h1>
        <p className="text-gray-400">Track your gambling sessions and performance</p>
      </div>

      {/* Start Session Button */}
      <button
        onClick={handleStartSession}
        className="w-full max-w-md py-6 px-8 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-lg transition-colors shadow-lg"
      >
        Start New Session
      </button>

      {/* Quick Info */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold text-white mb-3">Session Tracking Features:</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Track time spent gambling</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Monitor your bankroll in real-time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Record wins, losses, and expenses (Phase 4)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>View session history and analytics (Phase 6)</span>
          </li>
        </ul>
      </div>

      {/* Start Session Form Modal */}
      <StartSessionForm
        isOpen={showStartForm}
        onClose={handleCloseStartForm}
        onSessionStarted={handleSessionStarted}
      />
    </div>
  );
}
