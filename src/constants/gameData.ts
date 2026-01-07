// Preloaded game data - NOT user editable

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

export interface Location {
  id: string;
  name: string;
  address?: string;
  machineTypeIds: string[];  // Which machine types are at this location
}

// All games
export const GAMES: Record<string, GameInfo> = {
  'gem-master': {
    id: 'gem-master',
    name: 'Gem Master',
    description: 'Match colorful gems to win big prizes',
    minBet: 0.25,
    maxBet: 5.00,
  },
  'pirates': {
    id: 'pirates',
    name: 'Pirates',
    description: 'Sail the seven seas for treasure',
    minBet: 0.25,
    maxBet: 5.00,
  },
  'living-large': {
    id: 'living-large',
    name: 'Living Large',
    description: 'Live the high life with big wins',
    minBet: 0.25,
    maxBet: 5.00,
  },
  'lucky-fruit': {
    id: 'lucky-fruit',
    name: 'Lucky Fruit',
    description: 'Classic fruit machine with modern twists',
    minBet: 0.25,
    maxBet: 5.00,
  },
  'shamrock-shenanigans': {
    id: 'shamrock-shenanigans',
    name: 'Shamrock Shenanigans',
    description: 'Irish luck and fun gameplay',
    minBet: 0.25,
    maxBet: 5.00,
  },
  'sugar-n-spice': {
    id: 'sugar-n-spice',
    name: 'Sugar N Spice',
    description: 'Sweet treats and spicy wins',
    minBet: 0.25,
    maxBet: 5.00,
  },
  'plunderin-pirates': {
    id: 'plunderin-pirates',
    name: 'Plunderin Pirates',
    description: 'Plunder treasure chests for rewards',
    minBet: 0.25,
    maxBet: 5.00,
  },
  'under-the-mountain': {
    id: 'under-the-mountain',
    name: 'Under the Mountain',
    description: 'Dig deep for hidden riches',
    minBet: 0.25,
    maxBet: 5.00,
  },
  'wildebeest-wild': {
    id: 'wildebeest-wild',
    name: 'Wildebeest Wild',
    description: 'Safari adventure with wild wins',
    minBet: 0.25,
    maxBet: 5.00,
  },
};

// Machine types with their available games
export const MACHINE_TYPES: MachineType[] = [
  {
    id: 'banilla-fusion-2',
    name: 'Banilla Fusion 2',
    manufacturer: 'Banilla',
    games: [
      GAMES['gem-master'],
      GAMES['pirates'],
      GAMES['living-large'],
      GAMES['lucky-fruit'],
      GAMES['shamrock-shenanigans'],
    ],
  },
  {
    id: 'platinum-3',
    name: 'Platinum 3',
    manufacturer: 'Pace-O-Matic',
    games: [
      GAMES['sugar-n-spice'],
      GAMES['plunderin-pirates'],
      GAMES['gem-master'],
    ],
  },
  {
    id: 'diamond-skills',
    name: 'Diamond Skills',
    manufacturer: 'Pace-O-Matic',
    games: [
      GAMES['under-the-mountain'],
      GAMES['wildebeest-wild'],
      GAMES['lucky-fruit'],
    ],
  },
  {
    id: 'pennsylvania-skill',
    name: 'Pennsylvania Skill',
    manufacturer: 'Miele',
    games: [
      GAMES['shamrock-shenanigans'],
      GAMES['living-large'],
      GAMES['pirates'],
    ],
  },
];

// Known locations with their available machine types
export const LOCATIONS: Location[] = [
  {
    id: 'moose-ebensburg',
    name: 'Moose Lodge Ebensburg',
    address: 'Ebensburg, PA',
    machineTypeIds: ['banilla-fusion-2', 'platinum-3'],
  },
  {
    id: 'moose-nanty-glo',
    name: 'Moose Nanty Glo',
    address: 'Nanty Glo, PA',
    machineTypeIds: ['banilla-fusion-2', 'diamond-skills', 'pennsylvania-skill'],
  },
];

// Helper functions
export function getMachineTypeById(id: string): MachineType | undefined {
  return MACHINE_TYPES.find(mt => mt.id === id);
}

export function getLocationById(id: string): Location | undefined {
  return LOCATIONS.find(loc => loc.id === id);
}

export function getMachineTypesForLocation(locationId: string): MachineType[] {
  const location = getLocationById(locationId);
  if (!location) return [];

  return location.machineTypeIds
    .map(id => getMachineTypeById(id))
    .filter((mt): mt is MachineType => mt !== undefined);
}

export function getGamesForMachineType(machineTypeId: string): GameInfo[] {
  const machineType = getMachineTypeById(machineTypeId);
  return machineType?.games || [];
}
