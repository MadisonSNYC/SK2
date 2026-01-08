/**
 * @fileoverview Session timer display component
 * @module components/tracker/SessionTimer
 *
 * Displays elapsed session time with auto-updating timer.
 * Extracted from ActiveSessionDashboard.tsx to separate timer concerns.
 */

import { useState, useEffect } from 'react';
import { formatTime } from '../../utils/formatting';

interface SessionTimerProps {
  startTime: Date;
  className?: string;
}

export default function SessionTimer({ startTime, className = '' }: SessionTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    // Calculate initial elapsed time
    const start = new Date(startTime).getTime();
    const now = Date.now();
    setElapsedSeconds(Math.floor((now - start) / 1000));

    // Update every second
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className={`text-center ${className}`}>
      <div className="text-4xl font-mono font-bold text-yellow-400">
        {formatTime(elapsedSeconds)}
      </div>
      <p className="text-sm text-gray-400 mt-1">Elapsed Time</p>
    </div>
  );
}
