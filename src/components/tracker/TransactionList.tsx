/**
 * @fileoverview Transaction list for active session
 * @module components/tracker/TransactionList
 */

import { useSessionContext } from '../../context/SessionContext';
import { formatCurrency, formatDate } from '../../utils/formatting';

export default function TransactionList() {
  const { activeSession } = useSessionContext();

  const transactions = activeSession?.transactions || [];

  if (transactions.length === 0) {
    return null;
  }

  // Show last 5 transactions, most recent first
  const recentTransactions = [...transactions].reverse().slice(0, 5);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-3">
        Recent Transactions ({transactions.length})
      </h3>
      <div className="space-y-2">
        {recentTransactions.map((txn) => (
          <div key={txn.id} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span>{txn.type === 'win' ? '💰' : '💸'}</span>
              <span className="text-gray-400">
                {formatDate(new Date(txn.timestamp), { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
            <span className={txn.type === 'win' ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
              {txn.type === 'win' ? '+' : '-'}{formatCurrency(txn.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
