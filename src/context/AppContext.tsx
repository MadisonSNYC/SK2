import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Machine } from '../types/index';
import { STORAGE_KEYS } from '../types/index';
import { getStorageItem, setStorageItem, generateId } from '../utils/storage';

interface AppContextType {
  machines: Machine[];
  activeMachine: Machine | null;
  addMachine: (machineData: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMachine: (id: string, updates: Partial<Machine>) => void;
  deleteMachine: (id: string) => void;
  setActiveMachine: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [activeMachineId, setActiveMachineId] = useState<string | null>(null);

  // Load machines and active machine ID from localStorage on mount
  useEffect(() => {
    const savedMachines = getStorageItem<Machine[]>(STORAGE_KEYS.MACHINES, []);
    const savedActiveId = getStorageItem<string | null>(STORAGE_KEYS.ACTIVE_MACHINE, null);

    setMachines(savedMachines);
    setActiveMachineId(savedActiveId);
  }, []);

  // Save machines to localStorage whenever they change
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.MACHINES, machines);
  }, [machines]);

  // Save active machine ID to localStorage whenever it changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ACTIVE_MACHINE, activeMachineId);
  }, [activeMachineId]);

  const addMachine = (machineData: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newMachine: Machine = {
      ...machineData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    setMachines(prev => [...prev, newMachine]);

    // If this is the first machine, set it as active
    if (machines.length === 0) {
      setActiveMachineId(newMachine.id);
    }
  };

  const updateMachine = (id: string, updates: Partial<Machine>) => {
    setMachines(prev =>
      prev.map(machine =>
        machine.id === id
          ? { ...machine, ...updates, updatedAt: new Date() }
          : machine
      )
    );
  };

  const deleteMachine = (id: string) => {
    setMachines(prev => prev.filter(machine => machine.id !== id));

    // If deleting the active machine, clear active selection
    if (activeMachineId === id) {
      setActiveMachineId(null);
    }
  };

  const setActiveMachine = (id: string | null) => {
    setActiveMachineId(id);
  };

  const activeMachine = machines.find(m => m.id === activeMachineId) || null;

  return (
    <AppContext.Provider
      value={{
        machines,
        activeMachine,
        addMachine,
        updateMachine,
        deleteMachine,
        setActiveMachine,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
