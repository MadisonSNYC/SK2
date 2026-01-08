import { createContext, useContext, type ReactNode } from 'react';
import { useSession } from '../hooks/useSession';
import type { Session, Transaction, TransactionType } from '../types/index';

interface SessionContextValue {
  sessions: Session[];
  activeSession: Session | null;
  hasActiveSession: boolean;
  startSession: (params: {
    startingBalance: number;
    machineId?: string;
    currentGameId?: string;
    location?: string;
    notes?: string;
  }) => Session;
  endSession: () => Session | null;
  updateSessionBalance: (newBalance: number) => void;
  addNote: (note: string) => void;
  getSessionDuration: (session: Session) => number;
  getNetProfitLoss: (session: Session) => number;
  addTransaction: (type: TransactionType, amount: number, description?: string) => Transaction | null;
  getSessionTransactions: () => Transaction[];
  getSessionStats: () => {
    totalWins: number;
    totalLosses: number;
    netProfitLoss: number;
    winCount: number;
    lossCount: number;
    winRate: number;
  } | null;
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
