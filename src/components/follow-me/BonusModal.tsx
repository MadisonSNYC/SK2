import Modal from '../common/Modal';

interface BonusModalProps {
  isOpen: boolean;
  roundsCompleted: number;
  onYes: () => void;
  onNo: () => void;
}

export default function BonusModal({ isOpen, roundsCompleted, onYes, onNo }: BonusModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onNo} title="Round Complete!">
      <div className="space-y-6">
        {/* Round Summary */}
        <div className="text-center">
          <p className="text-lg text-gray-300 mb-1">You completed</p>
          <p className="text-3xl font-bold text-yellow-400">{roundsCompleted} rounds</p>
        </div>

        {/* Question */}
        <div className="text-center">
          <p className="text-xl font-semibold text-white mb-4">
            Did a bonus trigger?
          </p>
          <p className="text-sm text-gray-400">
            (Bonus Spins, Free Games, Pick Bonus, etc.)
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onYes}
            className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            YES
          </button>
          <button
            onClick={onNo}
            className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            NO
          </button>
        </div>
      </div>
    </Modal>
  );
}
