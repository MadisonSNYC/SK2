/**
 * @fileoverview Follow Me state orchestration hook
 * @module components/follow-me/hooks/useFollowMeOrchestrator
 *
 * Coordinates all Follow Me sub-hooks and manages state flow.
 * Extracted from FollowMeHelper.tsx to separate concerns.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ColorKey, BonusDetails } from '../../../types';
import { useFollowMe } from '../../../hooks/useFollowMe';
import { useSpeech } from '../../../hooks/useSpeech';
import { useVoiceInput } from '../../../hooks/useVoiceInput';
import { useFollowMeAttempts } from '../../../hooks/useFollowMeAttempts';
import { useApp } from '../../../context/AppContext';

export interface UseFollowMeOrchestratorReturn {
  // Sequence state
  sequence: ColorKey[];
  currentRound: number;
  isComplete: boolean;
  progress: number;

  // Speech
  isSpeaking: boolean;
  currentSpeakingIndex: number | null;
  currentSpeakingColor: ColorKey | null;

  // Voice input
  voiceState: 'ready' | 'starting' | 'listening' | 'error';
  errorMessage: string;
  lastHeard: string;
  toggleListening: () => void;

  // Machine
  activeMachine: ReturnType<typeof useApp>['activeMachine'];

  // Handlers
  handleColorTap: (color: ColorKey) => void;
  handleReset: () => void;
  handleUndo: () => void;
  handleReplay: () => void;
  handleStatus: () => void;
  handleNextRound: () => void;

  // Bonus flow
  showBonusModal: boolean;
  showBonusDetailsForm: boolean;
  handleBonusNo: () => void;
  handleBonusYes: () => void;
  handleBonusDetailsSave: (details: BonusDetails) => void;
  handleBonusDetailsSkip: () => void;
}

export function useFollowMeOrchestrator(): UseFollowMeOrchestratorReturn {
  const { activeMachine } = useApp();

  // Follow Me sequence management
  const {
    sequence,
    currentRound,
    isComplete,
    progress,
    addColor,
    removeLastColor,
    resetSequence,
    getSequence,
  } = useFollowMe();

  // Text-to-speech
  const {
    speakSequence,
    speak,
    stop: stopSpeaking,
    isSpeaking,
    currentSpeakingIndex,
    currentSpeakingColor,
  } = useSpeech();

  // Attempt persistence
  const { saveAttempt } = useFollowMeAttempts();

  // Bonus modal state
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showBonusDetailsForm, setShowBonusDetailsForm] = useState(false);

  // Track previous sequence length for auto-readback
  const prevSequenceLengthRef = useRef(0);

  // Color tap handler (from grid or voice)
  const handleColorTap = useCallback((colorKey: ColorKey) => {
    if (isSpeaking) return;
    addColor(colorKey);
  }, [isSpeaking, addColor]);

  // Voice input - callback when color detected
  const handleVoiceColorDetected = useCallback((colorKey: ColorKey) => {
    if (isSpeaking) return;
    addColor(colorKey);
  }, [isSpeaking, addColor]);

  // Voice input hook
  const {
    voiceState,
    errorMessage,
    lastHeard,
    toggleListening,
  } = useVoiceInput(handleVoiceColorDetected);

  // Auto-readback: trigger TTS whenever user adds a color
  useEffect(() => {
    const currentLength = sequence.length;
    const prevLength = prevSequenceLengthRef.current;

    // Only trigger TTS if sequence grew by exactly 1 (user added one color)
    // AND we're not currently speaking
    if (currentLength === prevLength + 1 && !isSpeaking) {
      speakSequence(sequence);
    }

    // Update ref for next comparison
    prevSequenceLengthRef.current = currentLength;
  }, [sequence, speakSequence, isSpeaking]);

  // Reset handler
  const handleReset = useCallback(() => {
    stopSpeaking(); // Stop TTS immediately if playing
    prevSequenceLengthRef.current = 0; // Reset the ref to prevent auto-readback
    resetSequence();
  }, [stopSpeaking, resetSequence]);

  // Undo last color
  const handleUndo = useCallback(() => {
    stopSpeaking(); // Stop TTS immediately if playing
    // Update ref to current length - 1 to prevent auto-readback triggering
    prevSequenceLengthRef.current = Math.max(0, sequence.length - 1);
    removeLastColor();
  }, [stopSpeaking, removeLastColor, sequence.length]);

  // Replay sequence
  const handleReplay = useCallback(() => {
    if (isSpeaking || sequence.length === 0) return;
    speakSequence(getSequence());
  }, [isSpeaking, sequence.length, speakSequence, getSequence]);

  // Speak status
  const handleStatus = useCallback(() => {
    if (isSpeaking) return;
    const colorCount = sequence.length;
    const statusText = `Round ${currentRound}, ${colorCount} color${colorCount !== 1 ? 's' : ''}`;
    speak(statusText);
  }, [isSpeaking, sequence.length, currentRound, speak]);

  // Next round - open bonus flow
  const handleNextRound = useCallback(() => {
    if (sequence.length === 0) return;
    stopSpeaking(); // Stop any active TTS
    setShowBonusModal(true);
  }, [sequence.length, stopSpeaking]);

  // Bonus flow: User says "No" to bonus
  const handleBonusNo = useCallback(() => {
    // No bonus triggered - save attempt with bonusTriggered: false
    saveAttempt(
      currentRound,
      sequence,
      false, // bonusTriggered
      undefined, // bonusDetails
      activeMachine?.id,
      undefined // sessionId - will implement in Phase 3
    );

    // Reset for next round
    prevSequenceLengthRef.current = 0;
    resetSequence();
    setShowBonusModal(false);
  }, [currentRound, sequence, activeMachine, saveAttempt, resetSequence]);

  // Bonus flow: User says "Yes" to bonus
  const handleBonusYes = useCallback(() => {
    setShowBonusModal(false);
    setShowBonusDetailsForm(true);
  }, []);

  // Bonus flow: User saves bonus details
  const handleBonusDetailsSave = useCallback((details: BonusDetails) => {
    // Bonus triggered - save attempt with bonus details
    saveAttempt(
      currentRound,
      sequence,
      true, // bonusTriggered
      details,
      activeMachine?.id,
      undefined // sessionId
    );

    // Reset for next round
    prevSequenceLengthRef.current = 0;
    resetSequence();
    setShowBonusDetailsForm(false);
  }, [currentRound, sequence, activeMachine, saveAttempt, resetSequence]);

  // Bonus flow: User skips entering details
  const handleBonusDetailsSkip = useCallback(() => {
    // User skipped entering details - save with bonusTriggered: true but no details
    saveAttempt(
      currentRound,
      sequence,
      true, // bonusTriggered
      undefined, // no details
      activeMachine?.id,
      undefined // sessionId
    );

    // Reset for next round
    prevSequenceLengthRef.current = 0;
    resetSequence();
    setShowBonusDetailsForm(false);
  }, [currentRound, sequence, activeMachine, saveAttempt, resetSequence]);

  return {
    // Sequence state
    sequence,
    currentRound,
    isComplete,
    progress,

    // Speech
    isSpeaking,
    currentSpeakingIndex,
    currentSpeakingColor,

    // Voice input
    voiceState,
    errorMessage,
    lastHeard,
    toggleListening,

    // Machine
    activeMachine,

    // Handlers
    handleColorTap,
    handleReset,
    handleUndo,
    handleReplay,
    handleStatus,
    handleNextRound,

    // Bonus flow
    showBonusModal,
    showBonusDetailsForm,
    handleBonusNo,
    handleBonusYes,
    handleBonusDetailsSave,
    handleBonusDetailsSkip,
  };
}
