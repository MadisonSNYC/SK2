import { useState } from 'react';
import Modal from '../common/Modal';

interface AmountInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  type: 'win' | 'loss';
  currentBalance?: number;
}

const QUICK_AMOUNTS = [5, 10, 20, 50, 100];

export default function AmountInputModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  currentBalance,
}: AmountInputModalProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const isWin = type === 'win';
  const title = isWin ? '💰 Log Win' : '💸 Log Loss';
  const accentColor = isWin ? 'green' : 'red';

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountValue = parseFloat(amount);

    // Validation
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount greater than $0');
      return;
    }

    // Warning for losses greater than current balance (but allow it)
    if (!isWin && currentBalance && amountValue > currentBalance) {
      // Could show a warning, but allow it
      console.warn('Loss amount exceeds current balance');
    }

    onSubmit(amountValue);
    setAmount('');
    setError('');
  };

  const handleCancel = () => {
    setAmount('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quick Amount Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Quick amounts:
          </label>
          <div className="flex gap-2 flex-wrap">
            {QUICK_AMOUNTS.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => handleQuickAmount(quickAmount)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  amount === quickAmount.toString()
                    ? `bg-${accentColor}-600 text-white`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ${quickAmount}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
            Or enter custom amount:
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">
              $
            </span>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-lg text-white text-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoFocus
            />
          </div>
        </div>

        {/* Current Balance Context */}
        {currentBalance !== undefined && (
          <div className="text-sm text-gray-400 text-center">
            Current balance: ${currentBalance.toFixed(2)}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`flex-1 py-3 px-6 ${
              isWin
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            } text-white font-semibold rounded-lg transition-colors`}
          >
            {isWin ? '+ Add Win' : '- Add Loss'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
