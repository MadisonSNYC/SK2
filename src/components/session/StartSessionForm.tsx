/**
 * @fileoverview Start session form component
 * @module components/session/StartSessionForm
 *
 * Orchestrates the multi-step session creation form with progressive disclosure.
 * Extracted from StartSessionPage.tsx to separate form logic from page layout.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../../context/SessionContext';
import { LOCATIONS, type GameInfo } from '../../constants/gameData';
import LocationSelector from './LocationSelector';
import MachineSelector from './MachineSelector';
import GameSelector from './GameSelector';

export default function StartSessionForm() {
  const navigate = useNavigate();
  const { startSession } = useSessionContext();

  // Form state
  const [locationId, setLocationId] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [machineTypeId, setMachineTypeId] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameInfo | null>(null);
  const [startingBalance, setStartingBalance] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleLocationChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomLocation(true);
      setLocationId('');
    } else {
      setShowCustomLocation(false);
      setLocationId(value);
      setCustomLocation('');
    }
    // Reset dependent fields
    setMachineTypeId('');
    setSelectedGame(null);
  };

  const handleCustomLocationChange = (value: string) => {
    setCustomLocation(value);
  };

  const handleMachineChange = (value: string) => {
    setMachineTypeId(value);
    // Reset game selection when machine changes
    setSelectedGame(null);
  };

  const handleGameSelect = (game: GameInfo) => {
    setSelectedGame(game);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const finalLocation = showCustomLocation ? customLocation : locationId;
    if (!finalLocation) {
      setError('Please select or enter a location');
      return;
    }

    if (!machineTypeId) {
      setError('Please select a machine');
      return;
    }

    if (!selectedGame) {
      setError('Please select a game');
      return;
    }

    const balance = parseFloat(startingBalance);
    if (!startingBalance || isNaN(balance) || balance <= 0) {
      setError('Please enter a valid starting balance greater than $0');
      return;
    }

    // Start the session
    startSession({
      startingBalance: balance,
      machineId: machineTypeId,
      location: showCustomLocation
        ? customLocation
        : LOCATIONS.find(loc => loc.id === locationId)?.name || '',
      notes: notes || undefined,
    });

    // Navigate to session page
    navigate('/session');
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1: Location */}
      <LocationSelector
        locationId={locationId}
        customLocation={customLocation}
        showCustomInput={showCustomLocation}
        onChange={handleLocationChange}
        onCustomLocationChange={handleCustomLocationChange}
      />

      {/* Step 2: Machine */}
      {(locationId || customLocation) && (
        <MachineSelector
          value={machineTypeId}
          locationId={locationId}
          isCustomLocation={showCustomLocation}
          onChange={handleMachineChange}
        />
      )}

      {/* Step 3: Game Selection */}
      {machineTypeId && (
        <GameSelector
          machineTypeId={machineTypeId}
          selectedGame={selectedGame}
          onGameSelect={handleGameSelect}
        />
      )}

      {/* Step 4: Starting Balance */}
      {selectedGame && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            4. Starting Balance <span className="text-red-400">*</span>
          </h2>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">
              $
            </span>
            <input
              type="number"
              step="0.01"
              value={startingBalance}
              onChange={(e) => setStartingBalance(e.target.value)}
              placeholder="100.00"
              className="w-full pl-10 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-lg text-white text-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoFocus={!!selectedGame}
            />
          </div>
        </div>
      )}

      {/* Optional Notes */}
      {startingBalance && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            Notes <span className="text-gray-500">(optional)</span>
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about this session..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 py-4 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!locationId && !customLocation || !machineTypeId || !selectedGame || !startingBalance}
        >
          Let's Play! 🎰
        </button>
      </div>
    </form>
  );
}
