import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import StartSessionPage from './pages/StartSessionPage';
import SessionPage from './pages/SessionPage';
import SessionSummaryPage from './pages/SessionSummaryPage';
import FollowMePage from './pages/FollowMePage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="start-session" element={<StartSessionPage />} />
          <Route path="session" element={<SessionPage />} />
          <Route path="session/summary" element={<SessionSummaryPage />} />
          <Route path="follow-me" element={<FollowMePage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
