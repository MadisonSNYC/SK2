interface FollowMeControlsProps {
  onReset: () => void;
  onUndo: () => void;
  onReplay: () => void;
  onStatus: () => void;
  isSpeaking: boolean;
  hasSequence: boolean;
}

export default function FollowMeControls({
  onReset,
  onUndo,
  onReplay,
  onStatus,
  isSpeaking,
  hasSequence,
}: FollowMeControlsProps) {
  const buttonBaseClass = `
    flex-1
    px-4
    py-3
    rounded-lg
    font-semibold
    text-sm
    transition-all
    duration-200
    disabled:opacity-50
    disabled:cursor-not-allowed
    active:scale-95
  `;

  return (
    <div className="w-full flex gap-2">
      {/* Reset Button - Red - Always enabled when sequence exists, can stop TTS */}
      <button
        onClick={onReset}
        disabled={!hasSequence}
        className={`${buttonBaseClass} bg-red-600 hover:bg-red-700 text-white`}
      >
        Reset
      </button>

      {/* Undo Button - Orange - Always enabled when sequence exists, can stop TTS */}
      <button
        onClick={onUndo}
        disabled={!hasSequence}
        className={`${buttonBaseClass} bg-orange-600 hover:bg-orange-700 text-white`}
      >
        Undo
      </button>

      {/* Replay Button - Blue */}
      <button
        onClick={onReplay}
        disabled={isSpeaking || !hasSequence}
        className={`${buttonBaseClass} bg-blue-600 hover:bg-blue-700 text-white`}
      >
        Replay
      </button>

      {/* Status Button - Green */}
      <button
        onClick={onStatus}
        disabled={isSpeaking}
        className={`${buttonBaseClass} bg-green-600 hover:bg-green-700 text-white`}
      >
        Status
      </button>
    </div>
  );
}
