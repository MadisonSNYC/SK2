/**
 * Game and Machine Type Definitions
 * Preloaded data for common PA skill game machines
 */

export interface GameInfo {
  id: string;
  name: string;
  description: string;
  minBet: number;
  maxBet: number;
}

export interface MachineType {
  id: string;
  name: string;
  manufacturer: string;
  games: GameInfo[];
}

export const MACHINE_TYPES: MachineType[] = [
  {
    id: 'banilla-fusion-2',
    name: 'Banilla Fusion 2',
    manufacturer: 'Banilla',
    games: [
      { id: 'gem-master', name: 'Gem Master', description: 'Gem-matching themed game with cascading wins', minBet: 0.25, maxBet: 5.00 },
      { id: 'pirates', name: 'Pirates', description: 'High-seas treasure hunt with bonus spins', minBet: 0.40, maxBet: 8.00 },
      { id: 'living-large', name: 'Living Large', description: 'Luxury lifestyle theme with jackpot features', minBet: 0.25, maxBet: 5.00 },
      { id: 'lucky-fruit', name: 'Lucky Fruit', description: 'Classic fruit machine style', minBet: 0.20, maxBet: 4.00 },
    ]
  },
  {
    id: 'platinum-3',
    name: 'Platinum 3',
    manufacturer: 'Pace-O-Matic',
    games: [
      { id: 'shamrock-shenanigans', name: 'Shamrock Shenanigans', description: 'Irish luck theme with free spins', minBet: 0.25, maxBet: 5.00 },
      { id: 'sugar-n-spice', name: 'Sugar N Spice', description: 'Candy and sweets themed with multipliers', minBet: 0.25, maxBet: 5.00 },
      { id: 'plunderin-pirates', name: "Plunderin' Pirates", description: 'Pirate adventure with treasure bonus', minBet: 0.40, maxBet: 8.00 },
    ]
  },
  {
    id: 'diamond-skills',
    name: 'Diamond Skills',
    manufacturer: 'Diamond Skill Games',
    games: [
      { id: 'under-the-mountain', name: 'Under the Mountain', description: 'Mining adventure with gem bonuses', minBet: 0.25, maxBet: 5.00 },
      { id: 'wildebeest-wild', name: 'Wildebeest Wild', description: 'Safari theme with expanding wilds', minBet: 0.40, maxBet: 8.00 },
      { id: 'lucky-fruit-ds', name: 'Lucky Fruit', description: 'Classic fruit machine style', minBet: 0.20, maxBet: 4.00 },
    ]
  },
  {
    id: 'pennsylvania-skill',
    name: 'Pennsylvania Skill',
    manufacturer: 'Miele Manufacturing',
    games: [
      { id: 'gem-master-ps', name: 'Gem Master', description: 'Gem-matching themed game', minBet: 0.25, maxBet: 5.00 },
      { id: 'living-large-ps', name: 'Living Large', description: 'Luxury lifestyle theme', minBet: 0.25, maxBet: 5.00 },
      { id: 'plunderin-pirates-ps', name: "Plunderin' Pirates", description: 'Pirate adventure theme', minBet: 0.40, maxBet: 8.00 },
      { id: 'wildebeest-wild-ps', name: 'Wildebeest Wild', description: 'Safari theme with wilds', minBet: 0.40, maxBet: 8.00 },
    ]
  },
];

// Helper functions
export const getMachineById = (id: string) => MACHINE_TYPES.find(m => m.id === id);
export const getGamesByMachineId = (machineId: string) => getMachineById(machineId)?.games || [];
export const getAllGames = () => MACHINE_TYPES.flatMap(m => m.games);
export const getGameById = (gameId: string) => getAllGames().find(g => g.id === gameId);
