import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useSession } from '../hooks/useSession';
import type { Session } from '../types/index';

interface SessionContextValue {
  sessions: Session[];
  activeSession: Session | null;
  hasActiveSession: boolean;
  startSession: (params: {
    startingBalance: number;
    machineId?: string;
    location?: string;
    notes?: string;
  }) => Session;
  endSession: () => Session | null;
  updateSessionBalance: (newBalance: number) => void;
  addNote: (note: string) => void;
  getSessionDuration: (session: Session) => number;
  getNetProfitLoss: (session: Session) => number;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const sessionState = useSession();

  return (
    <SessionContext.Provider value={sessionState}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}
