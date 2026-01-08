import { useEffect, useRef, useState } from 'react';
import type { ColorKey, BonusDetails } from '../../types/index';
import { useFollowMe } from '../../hooks/useFollowMe';
import { useSpeech } from '../../hooks/useSpeech';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { useFollowMeAttempts } from '../../hooks/useFollowMeAttempts';
import { useApp } from '../../context/AppContext';
import ColorGrid from './ColorGrid';
import SequenceDisplay from './SequenceDisplay';
import FollowMeControls from './FollowMeControls';
import BonusModal from './BonusModal';
import BonusDetailsForm from './BonusDetailsForm';

export default function FollowMeHelper() {
  const { activeMachine } = useApp();
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

  const {
    speakSequence,
    speak,
    stop: stopSpeaking,
    isSpeaking,
    currentSpeakingIndex,
    currentSpeakingColor,
  } = useSpeech();

  const handleColorTap = (colorKey: ColorKey) => {
    if (isSpeaking) return;
    addColor(colorKey);
  };

  const handleVoiceColorDetected = (colorKey: ColorKey) => {
    if (isSpeaking) return;
    addColor(colorKey);
  };

  const {
    voiceState,
    errorMessage,
    lastHeard,
    toggleListening,
    isListening: _isListening,
  } = useVoiceInput(handleVoiceColorDetected);

  const { saveAttempt } = useFollowMeAttempts();

  // Modal state for Next Round flow
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showBonusDetailsForm, setShowBonusDetailsForm] = useState(false);

  // Track previous sequence length for auto-readback
  const prevSequenceLengthRef = useRef(0);

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

  const handleReset = () => {
    stopSpeaking(); // Stop TTS immediately if playing
    prevSequenceLengthRef.current = 0; // Reset the ref to prevent auto-readback
    resetSequence();
  };

  const handleUndo = () => {
    stopSpeaking(); // Stop TTS immediately if playing
    // Update ref to current length - 1 to prevent auto-readback triggering
    prevSequenceLengthRef.current = Math.max(0, sequence.length - 1);
    removeLastColor();
  };

  const handleReplay = () => {
    if (isSpeaking || sequence.length === 0) return;
    speakSequence(getSequence());
  };

  const handleStatus = () => {
    if (isSpeaking) return;
    const colorCount = sequence.length;
    const statusText = `Round ${currentRound}, ${colorCount} color${colorCount !== 1 ? 's' : ''}`;
    speak(statusText);
  };

  const handleNextRound = () => {
    if (sequence.length === 0) return;
    stopSpeaking(); // Stop any active TTS
    setShowBonusModal(true);
  };

  const handleBonusNo = () => {
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
  };

  const handleBonusYes = () => {
    setShowBonusModal(false);
    setShowBonusDetailsForm(true);
  };

  const handleBonusDetailsSave = (details: BonusDetails) => {
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
  };

  const handleBonusDetailsSkip = () => {
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
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      {/* Header with active machine or placeholder */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">Follow Me Helper</h1>
        <p className="text-sm text-gray-400">
          {activeMachine ? (
            <>
              Machine: <span className="text-yellow-400 font-semibold">{activeMachine.name}</span>
            </>
          ) : (
            <span className="text-gray-500">No Machine Selected</span>
          )}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">
            {currentRound >= 20 ? (
              <>Round {currentRound} 🏆</>
            ) : (
              <>Round {currentRound} / 20</>
            )}
          </span>
          <span className="text-sm font-medium text-gray-300">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              currentRound >= 20 ? 'bg-green-500' : 'bg-yellow-400'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        {isComplete && currentRound === 20 && (
          <p className="text-center text-green-400 font-semibold mt-2 text-sm">
            🎉 Complete! You've reached 20 rounds!
          </p>
        )}
        {currentRound > 20 && (
          <p className="text-center text-green-400 font-semibold mt-2 text-sm">
            🏆 {currentRound - 20} rounds past goal!
          </p>
        )}
      </div>

      {/* Sequence Display */}
      <SequenceDisplay
        sequence={sequence}
        currentSpeakingIndex={currentSpeakingIndex}
      />

      {/* Voice Input Section */}
      <div className="w-full space-y-3">
        {/* Voice Button */}
        <button
          onClick={toggleListening}
          disabled={voiceState === 'starting'}
          className={`
            w-full
            py-3
            px-4
            rounded-lg
            font-semibold
            text-sm
            transition-all
            duration-200
            flex
            items-center
            justify-center
            gap-2
            ${
              voiceState === 'ready'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : voiceState === 'starting'
                ? 'bg-gray-600 text-gray-300 cursor-wait'
                : voiceState === 'listening'
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }
          `}
        >
          {voiceState === 'ready' && (
            <>
              <span>🎤</span>
              <span>Tap to Enable Voice</span>
            </>
          )}
          {voiceState === 'starting' && (
            <>
              <span>⏳</span>
              <span>Starting microphone...</span>
            </>
          )}
          {voiceState === 'listening' && (
            <>
              <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span>LISTENING - Tap to Stop</span>
            </>
          )}
          {voiceState === 'error' && (
            <>
              <span>🎤</span>
              <span>Tap to Retry Voice</span>
            </>
          )}
        </button>

        {/* Error Message */}
        {voiceState === 'error' && errorMessage && (
          <div className="w-full p-3 bg-gray-800 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm text-center">{errorMessage}</p>
          </div>
        )}

        {/* Heard Feedback */}
        {(voiceState === 'listening' || lastHeard) && (
          <div className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Heard:</p>
            <p className="text-sm text-white">
              {lastHeard || <span className="text-gray-500 italic">Listening...</span>}
            </p>
          </div>
        )}
      </div>

      {/* Color Grid */}
      <ColorGrid
        onColorTap={handleColorTap}
        currentSpeakingColor={currentSpeakingColor}
        disabled={isSpeaking}
      />

      {/* Control Buttons */}
      <FollowMeControls
        onReset={handleReset}
        onUndo={handleUndo}
        onReplay={handleReplay}
        onStatus={handleStatus}
        isSpeaking={isSpeaking}
        hasSequence={sequence.length > 0}
      />

      {/* Next Round Button */}
      {sequence.length > 0 && (
        <button
          onClick={handleNextRound}
          className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
        >
          Next Round →
        </button>
      )}

      {/* Modals */}
      <BonusModal
        isOpen={showBonusModal}
        roundsCompleted={currentRound}
        onYes={handleBonusYes}
        onNo={handleBonusNo}
      />

      <BonusDetailsForm
        isOpen={showBonusDetailsForm}
        onSave={handleBonusDetailsSave}
        onSkip={handleBonusDetailsSkip}
      />
    </div>
  );
}
