import { useLocation, useNavigate } from 'react-router-dom';
import SessionSummary from '../components/tracker/SessionSummary';
import type { Session } from '../types/index';

export default function SessionSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session as Session | undefined;

  // If no session data, redirect to home
  if (!session) {
    navigate('/home');
    return null;
  }

  const handleDone = () => {
    navigate('/home');
  };

  return <SessionSummary session={session} onDone={handleDone} />;
}
