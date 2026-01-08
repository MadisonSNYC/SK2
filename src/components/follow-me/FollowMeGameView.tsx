/**
 * @fileoverview Follow Me game view component
 * @module components/follow-me/FollowMeGameView
 *
 * Renders the Follow Me game UI including grid, sequence, and controls.
 * Extracted from FollowMeHelper.tsx to separate presentation from logic.
 */

import type { ColorKey } from '../../types';
import ColorGrid from './ColorGrid';
import SequenceDisplay from './SequenceDisplay';
import FollowMeControls from './FollowMeControls';

interface FollowMeGameViewProps {
  // Sequence state
  sequence: ColorKey[];
  currentRound: number;
  progress: number;
  isComplete: boolean;

  // Speech state
  isSpeaking: boolean;
  currentSpeakingIndex: number | null;
  currentSpeakingColor: ColorKey | null;

  // Voice input state
  voiceState: 'ready' | 'starting' | 'listening' | 'error';
  errorMessage: string;
  lastHeard: string;

  // Machine info
  machineName: string | null;

  // Event handlers
  onColorTap: (color: ColorKey) => void;
  onReset: () => void;
  onUndo: () => void;
  onReplay: () => void;
  onStatus: () => void;
  onNextRound: () => void;
  onToggleListening: () => void;
}

export default function FollowMeGameView({
  sequence,
  currentRound,
  progress,
  isComplete,
  isSpeaking,
  currentSpeakingIndex,
  currentSpeakingColor,
  voiceState,
  errorMessage,
  lastHeard,
  machineName,
  onColorTap,
  onReset,
  onUndo,
  onReplay,
  onStatus,
  onNextRound,
  onToggleListening,
}: FollowMeGameViewProps) {
  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      {/* Header with active machine or placeholder */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">Follow Me Helper</h1>
        <p className="text-sm text-gray-400">
          {machineName ? (
            <>
              Machine: <span className="text-yellow-400 font-semibold">{machineName}</span>
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
          onClick={onToggleListening}
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
        onColorTap={onColorTap}
        currentSpeakingColor={currentSpeakingColor}
        disabled={isSpeaking}
      />

      {/* Control Buttons */}
      <FollowMeControls
        onReset={onReset}
        onUndo={onUndo}
        onReplay={onReplay}
        onStatus={onStatus}
        isSpeaking={isSpeaking}
        hasSequence={sequence.length > 0}
      />

      {/* Next Round Button */}
      {sequence.length > 0 && (
        <button
          onClick={onNextRound}
          className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
        >
          Next Round →
        </button>
      )}
    </div>
  );
}
