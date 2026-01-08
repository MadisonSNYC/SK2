/**
 * @fileoverview Transaction logging buttons
 * @module components/tracker/TransactionButtons
 */

import { useState } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import AmountInputModal from './AmountInputModal';

type TransactionType = 'win' | 'loss';

export default function TransactionButtons() {
  const { addTransaction } = useSessionContext();
  const [modalType, setModalType] = useState<TransactionType | null>(null);

  const handleTransaction = (amount: number) => {
    if (modalType && amount > 0) {
      addTransaction(modalType, amount);
      setModalType(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setModalType('win')}
          className="py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-lg flex items-center justify-center gap-2"
        >
          <span>💰</span> +Win
        </button>
        <button
          onClick={() => setModalType('loss')}
          className="py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-lg flex items-center justify-center gap-2"
        >
          <span>💸</span> -Loss
        </button>
      </div>

      <AmountInputModal
        isOpen={modalType !== null}
        type={modalType || 'win'}
        onClose={() => setModalType(null)}
        onSubmit={handleTransaction}
      />
    </>
  );
}
