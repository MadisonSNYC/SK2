/**
 * @fileoverview Follow Me Helper main component
 * @module components/follow-me/FollowMeHelper
 *
 * Main orchestrator component that composes the Follow Me feature.
 * Delegates to specialized sub-components and hooks.
 *
 * Refactored from 337-line monolith to thin composition layer.
 */

import { useFollowMeOrchestrator } from './hooks/useFollowMeOrchestrator';
import FollowMeGameView from './FollowMeGameView';
import FollowMeBonusFlow from './FollowMeBonusFlow';

export default function FollowMeHelper() {
  const {
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
  } = useFollowMeOrchestrator();

  return (
    <>
      <FollowMeGameView
        sequence={sequence}
        currentRound={currentRound}
        progress={progress}
        isComplete={isComplete}
        isSpeaking={isSpeaking}
        currentSpeakingIndex={currentSpeakingIndex}
        currentSpeakingColor={currentSpeakingColor}
        voiceState={voiceState}
        errorMessage={errorMessage}
        lastHeard={lastHeard}
        machineName={activeMachine?.name || null}
        onColorTap={handleColorTap}
        onReset={handleReset}
        onUndo={handleUndo}
        onReplay={handleReplay}
        onStatus={handleStatus}
        onNextRound={handleNextRound}
        onToggleListening={toggleListening}
      />

      <FollowMeBonusFlow
        showBonusModal={showBonusModal}
        showBonusDetailsForm={showBonusDetailsForm}
        roundsCompleted={currentRound}
        onBonusYes={handleBonusYes}
        onBonusNo={handleBonusNo}
        onBonusDetailsSave={handleBonusDetailsSave}
        onBonusDetailsSkip={handleBonusDetailsSkip}
      />
    </>
  );
}
