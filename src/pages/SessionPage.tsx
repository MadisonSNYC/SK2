import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import ActiveSessionDashboard from '../components/tracker/ActiveSessionDashboard';

export default function SessionPage() {
  const { hasActiveSession, endSession } = useSessionContext();
  const navigate = useNavigate();

  // If no active session, redirect to home
  if (!hasActiveSession) {
    navigate('/home');
    return null;
  }

  const handleEndSession = () => {
    const session = endSession();
    if (session) {
      // Navigate to summary page with session data
      navigate('/session/summary', { state: { session } });
    }
  };

  // Show active session dashboard
  return <ActiveSessionDashboard onEndSession={handleEndSession} />;
}
