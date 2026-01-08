/**
 * @fileoverview Start session page
 * @module pages/StartSessionPage
 *
 * Thin wrapper page that provides layout and header for session creation flow.
 * Form logic extracted to StartSessionForm component (R2.2 refactor).
 */

import { useNavigate } from 'react-router-dom';
import StartSessionForm from '../components/session/StartSessionForm';

export default function StartSessionPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Start New Session</h1>
          <p className="text-gray-400">Select location, machine, and game to begin</p>
        </div>

        <StartSessionForm />
      </div>
    </div>
  );
}
