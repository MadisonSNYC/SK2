import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useSessionContext } from '../../context/SessionContext';
import Modal from '../common/Modal';

interface StartSessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionStarted?: () => void;
}

export default function StartSessionForm({ isOpen, onClose, onSessionStarted }: StartSessionFormProps) {
  const { machines, activeMachine } = useApp();
  const { startSession } = useSessionContext();

  const [bankroll, setBankroll] = useState('');
  const [selectedMachineId, setSelectedMachineId] = useState(activeMachine?.id || '');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const bankrollAmount = parseFloat(bankroll);

    // Validation
    if (!bankroll || isNaN(bankrollAmount) || bankrollAmount <= 0) {
      setError('Please enter a valid bankroll amount greater than $0');
      return;
    }

    // Start session
    startSession({
      startingBalance: bankrollAmount,
      machineId: selectedMachineId || undefined,
      location: location || undefined,
      notes: notes || undefined,
    });

    // Reset form
    setBankroll('');
    setSelectedMachineId(activeMachine?.id || '');
    setLocation('');
    setNotes('');
    setError('');

    if (onSessionStarted) {
      onSessionStarted();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    setBankroll('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Start New Session">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bankroll Input */}
        <div>
          <label htmlFor="bankroll" className="block text-sm font-medium text-gray-300 mb-2">
            Starting Bankroll <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
            <input
              id="bankroll"
              type="number"
              step="0.01"
              value={bankroll}
              onChange={(e) => setBankroll(e.target.value)}
              placeholder="100.00"
              className="w-full pl-8 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoFocus
            />
          </div>
        </div>

        {/* Machine Selection */}
        <div>
          <label htmlFor="machine" className="block text-sm font-medium text-gray-300 mb-2">
            Machine <span className="text-gray-500">(optional)</span>
          </label>
          <select
            id="machine"
            value={selectedMachineId}
            onChange={(e) => setSelectedMachineId(e.target.value)}
            className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Select Machine (optional)</option>
            {machines.map(machine => (
              <option key={machine.id} value={machine.id}>
                {machine.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Input */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
            Location <span className="text-gray-500">(optional)</span>
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Joe's Bar, Sunoco Main St"
            className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Notes Input */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
            Notes <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about this session..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Buttons */}
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
            className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            Start Session
          </button>
        </div>
      </form>
    </Modal>
  );
}
