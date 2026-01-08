import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import {
  LOCATIONS,
  getMachineTypesForLocation,
  getGamesForMachineType,
  type GameInfo,
} from '../constants/gameData';

export default function StartSessionPage() {
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

  // Get available machines based on selected location
  const availableMachines = locationId ? getMachineTypesForLocation(locationId) : [];

  // Get available games based on selected machine
  const availableGames = machineTypeId ? getGamesForMachineType(machineTypeId) : [];

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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Start New Session</h1>
          <p className="text-gray-400">Select location, machine, and game to begin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Location */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              1. Location <span className="text-red-400">*</span>
            </h2>
            <select
              value={showCustomLocation ? 'custom' : locationId}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Location</option>
              {LOCATIONS.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
              <option value="custom">➕ Custom Location</option>
            </select>

            {showCustomLocation && (
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Enter location name"
                className="w-full mt-3 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoFocus
              />
            )}
          </div>

          {/* Step 2: Machine */}
          {(locationId || customLocation) && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                2. Machine <span className="text-red-400">*</span>
              </h2>
              {!showCustomLocation && availableMachines.length > 0 ? (
                <select
                  value={machineTypeId}
                  onChange={(e) => handleMachineChange(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select Machine</option>
                  {availableMachines.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                      {machine.name} ({machine.manufacturer})
                    </option>
                  ))}
                </select>
              ) : showCustomLocation ? (
                <div>
                  <p className="text-sm text-gray-400 mb-3">
                    Select any machine type:
                  </p>
                  <select
                    value={machineTypeId}
                    onChange={(e) => handleMachineChange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Select Machine</option>
                    <option value="banilla-fusion-2">Banilla Fusion 2</option>
                    <option value="platinum-3">Platinum 3</option>
                    <option value="diamond-skills">Diamond Skills</option>
                    <option value="pennsylvania-skill">Pennsylvania Skill</option>
                  </select>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  No machines available at this location
                </p>
              )}
            </div>
          )}

          {/* Step 3: Game Selection */}
          {machineTypeId && availableGames.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                3. Game <span className="text-red-400">*</span>
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {availableGames.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => handleGameSelect(game)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedGame?.id === game.id
                        ? 'bg-yellow-500 border-yellow-400 text-gray-900'
                        : 'bg-gray-700 border-gray-600 text-white hover:border-yellow-400'
                    }`}
                  >
                    <p className="font-semibold mb-1">{game.name}</p>
                    <p className={`text-xs ${
                      selectedGame?.id === game.id ? 'text-gray-800' : 'text-gray-400'
                    }`}>
                      ${game.minBet.toFixed(2)} - ${game.maxBet.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
              {selectedGame && (
                <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-300">{selectedGame.description}</p>
                </div>
              )}
            </div>
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
      </div>
    </div>
  );
}
