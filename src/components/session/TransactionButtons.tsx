interface TransactionButtonsProps {
  onWin: () => void;
  onLoss: () => void;
  disabled?: boolean;
}

export default function TransactionButtons({
  onWin,
  onLoss,
  disabled = false,
}: TransactionButtonsProps) {
  return (
    <div className="flex gap-3 w-full">
      <button
        onClick={onWin}
        disabled={disabled}
        className="flex-1 py-4 px-6 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
      >
        <span className="text-2xl">💰</span>
        <span>+ Win</span>
      </button>
      <button
        onClick={onLoss}
        disabled={disabled}
        className="flex-1 py-4 px-6 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
      >
        <span className="text-2xl">💸</span>
        <span>- Loss</span>
      </button>
    </div>
  );
}
