import type { Transaction } from '../../types/index';

interface TransactionListProps {
  transactions: Transaction[];
  maxItems?: number;
}

export default function TransactionList({ transactions, maxItems }: TransactionListProps) {
  // Show newest first
  const sortedTransactions = [...transactions].reverse();
  const displayTransactions = maxItems
    ? sortedTransactions.slice(0, maxItems)
    : sortedTransactions;

  if (displayTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">No transactions yet</p>
        <p className="text-xs mt-1">Tap + Win or - Loss to get started</p>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-2">
      {displayTransactions.map((transaction) => {
        const isWin = transaction.type === 'win';
        const icon = isWin ? '💰' : '💸';
        const sign = isWin ? '+' : '-';
        const colorClass = isWin ? 'text-green-400' : 'text-red-400';

        return (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-lg border border-gray-700"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{icon}</span>
              <div>
                <p className="text-sm text-gray-400">
                  {formatTime(transaction.timestamp)}
                </p>
                {transaction.game && (
                  <p className="text-xs text-gray-500">{transaction.game}</p>
                )}
              </div>
            </div>
            <div className={`text-lg font-bold ${colorClass}`}>
              {sign}
              {formatAmount(transaction.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
