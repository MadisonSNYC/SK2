import { useState } from 'react';
import type { ColorKey } from '../types/index';

const FOLLOW_ME_ROUNDS_TO_WIN = 20;

export function useFollowMe() {
  const [sequence, setSequence] = useState<ColorKey[]>([]);

  // REMOVED: localStorage persistence of current sequence
  // Sequence now resets on page refresh for clean UX
  // Completed attempts are still saved via "Next Round" button

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
