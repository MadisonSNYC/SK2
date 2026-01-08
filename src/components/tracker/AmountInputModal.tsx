/**
 * @fileoverview Amount input modal for transactions
 * @module components/tracker/AmountInputModal
 */

import { useState } from 'react';
import Modal from '../common/Modal';
import { parseCurrency } from '../../utils/formatting';

interface AmountInputModalProps {
  isOpen: boolean;
  type: 'win' | 'loss';
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

const QUICK_AMOUNTS = [5, 10, 20, 50, 100];

export default function AmountInputModal({
  isOpen,
  type,
  onClose,
  onSubmit,
}: AmountInputModalProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    const value = parseCurrency(amount);
    if (value > 0) {
      onSubmit(value);
      setAmount('');
    }
  };

  const handleQuickAmount = (value: number) => {
    onSubmit(value);
    setAmount('');
  };

  const isWin = type === 'win';
  const title = isWin ? '💰 Log Win' : '💸 Log Loss';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-4">
        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {QUICK_AMOUNTS.map((value) => (
            <button
              key={value}
              onClick={() => handleQuickAmount(value)}
              className={`py-2 rounded font-medium text-sm ${
                isWin
                  ? 'bg-green-700 hover:bg-green-600 text-white'
                  : 'bg-red-700 hover:bg-red-600 text-white'
              }`}
            >
              ${value}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Custom Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className="w-full p-3 pl-8 bg-gray-800 border border-gray-600 rounded-lg text-white text-lg"
              autoFocus
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!amount || parseCurrency(amount) <= 0}
            className={`py-3 font-bold rounded-lg disabled:opacity-50 ${
              isWin
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-red-600 hover:bg-red-500 text-white'
            }`}
          >
            {isWin ? 'Add Win' : 'Add Loss'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
