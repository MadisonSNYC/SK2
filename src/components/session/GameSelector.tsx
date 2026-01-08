/**
 * @fileoverview Game selector component
 * @module components/session/GameSelector
 *
 * Grid of game buttons for selecting a game on the machine.
 * Extracted from StartSessionPage.tsx to separate game selection concerns.
 */

import { getGamesForMachineType, type GameInfo } from '../../constants/gameData';

interface GameSelectorProps {
  machineTypeId: string;
  selectedGame: GameInfo | null;
  onGameSelect: (game: GameInfo) => void;
}

export default function GameSelector({
  machineTypeId,
  selectedGame,
  onGameSelect,
}: GameSelectorProps) {
  const availableGames = machineTypeId ? getGamesForMachineType(machineTypeId) : [];

  if (!availableGames || availableGames.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">
        3. Game <span className="text-red-400">*</span>
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {availableGames.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => onGameSelect(game)}
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
  );
}
