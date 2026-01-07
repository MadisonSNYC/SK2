import { useState } from 'react';
import type { BonusDetails, BonusType, CurrencyMode } from '../../types/index';
import Modal from '../common/Modal';

interface BonusDetailsFormProps {
  isOpen: boolean;
  onSave: (details: BonusDetails) => void;
  onSkip: () => void;
}

const BONUS_TYPES: BonusType[] = ['Bonus Spins', 'Free Games', 'Pick Bonus', 'Other'];

export default function BonusDetailsForm({ isOpen, onSave, onSkip }: BonusDetailsFormProps) {
  const [bonusType, setBonusType] = useState<BonusType>('Bonus Spins');
  const [initialSpins, setInitialSpins] = useState<string>('');
  const [retriggered, setRetriggered] = useState(false);
  const [totalSpins, setTotalSpins] = useState<string>('');
  const [winnings, setWinnings] = useState<string>('');
  const [currencyMode, setCurrencyMode] = useState<CurrencyMode>('credits');

  const handleSave = () => {
    const details: BonusDetails = {
      type: bonusType,
      initialSpinsAwarded: initialSpins ? parseInt(initialSpins) : undefined,
      retriggered,
      totalSpins: totalSpins ? parseInt(totalSpins) : undefined,
      winnings: parseFloat(winnings) || 0,
      currencyMode,
    };

    onSave(details);

    // Reset form
    setBonusType('Bonus Spins');
    setInitialSpins('');
    setRetriggered(false);
    setTotalSpins('');
    setWinnings('');
    setCurrencyMode('credits');
  };

  return (
    <Modal isOpen={isOpen} onClose={onSkip} title="Bonus Details">
      <div className="space-y-4">
        {/* Bonus Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bonus Type
          </label>
          <select
            value={bonusType}
            onChange={(e) => setBonusType(e.target.value as BonusType)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {BONUS_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Initial Spins Awarded */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Initial Spins Awarded <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="number"
            value={initialSpins}
            onChange={(e) => setInitialSpins(e.target.value)}
            placeholder="e.g., 8"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Did it Retrigger? */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={retriggered}
              onChange={(e) => setRetriggered(e.target.checked)}
              className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-yellow-400 focus:ring-2 focus:ring-yellow-400"
            />
            <span className="text-sm font-medium text-gray-300">
              Did it retrigger?
            </span>
          </label>
        </div>

        {/* Total Spins (if retriggered) */}
        {retriggered && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total Spins (including retriggers)
            </label>
            <input
              type="number"
              value={totalSpins}
              onChange={(e) => setTotalSpins(e.target.value)}
              placeholder="e.g., 20"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        )}

        {/* Currency Mode Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Winnings Amount
          </label>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setCurrencyMode('credits')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                currencyMode === 'credits'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Credits
            </button>
            <button
              onClick={() => setCurrencyMode('dollars')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                currencyMode === 'dollars'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Dollars
            </button>
          </div>
          <div className="relative">
            {currencyMode === 'dollars' && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            )}
            <input
              type="number"
              step="0.01"
              value={winnings}
              onChange={(e) => setWinnings(e.target.value)}
              placeholder={currencyMode === 'credits' ? 'e.g., 2000' : 'e.g., 20.00'}
              className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                currencyMode === 'dollars' ? 'pl-8' : ''
              }`}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {currencyMode === 'credits'
              ? '(100 credits typically = $1.00)'
              : 'Enter dollar amount (e.g., 20.00 for $20)'}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!winnings}
            className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            Save
          </button>
          <button
            onClick={onSkip}
            className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </Modal>
  );
}
