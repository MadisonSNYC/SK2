import { useState, useEffect } from 'react';
import type { ColorKey } from '../types/index';
import { STORAGE_KEYS } from '../types/index';
import { getStorageItem, setStorageItem } from '../utils/storage';

const FOLLOW_ME_ROUNDS_TO_WIN = 20;

export function useFollowMe() {
  const [sequence, setSequence] = useState<ColorKey[]>([]);

  // Load sequence from localStorage on mount
  useEffect(() => {
    const saved = getStorageItem<ColorKey[]>(STORAGE_KEYS.CURRENT_SEQUENCE, []);
    if (saved.length > 0) {
      setSequence(saved);
    }
  }, []);

  // Save sequence to localStorage whenever it changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CURRENT_SEQUENCE, sequence);
  }, [sequence]);

  const addColor = (colorKey: ColorKey) => {
    setSequence(prev => [...prev, colorKey]);
  };

  const removeLastColor = () => {
    setSequence(prev => prev.slice(0, -1));
  };

  const resetSequence = () => {
    setSequence([]);
  };

  const getSequence = (): ColorKey[] => {
    return [...sequence];
  };

  const currentRound = sequence.length;
  const isActive = sequence.length > 0;
  const isComplete = sequence.length >= FOLLOW_ME_ROUNDS_TO_WIN;
  const progress = Math.min((sequence.length / FOLLOW_ME_ROUNDS_TO_WIN) * 100, 100);

  return {
    sequence,
    currentRound,
    isActive,
    isComplete,
    progress,
    addColor,
    removeLastColor,
    resetSequence,
    getSequence,
  };
}
