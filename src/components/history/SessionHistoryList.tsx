/**
 * @fileoverview Session history list component
 * @module components/history/SessionHistoryList
 */

import SessionHistoryCard from './SessionHistoryCard';
import EmptyHistory from './EmptyHistory';
import type { Session } from '../../types';

interface SessionHistoryListProps {
  sessions: Session[];
  isLoading?: boolean;
}

export default function SessionHistoryList({ sessions, isLoading }: SessionHistoryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return <EmptyHistory />;
  }

  return (
    <div className="space-y-3">
      {sessions.map(session => (
        <SessionHistoryCard key={session.id} session={session} />
      ))}
    </div>
  );
}
