import { AppSettings, FollowMeVariant } from '../types';

/**
 * Default app configuration
 */
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  currency: 'USD',
  ttsEnabled: true,
  ttsRate: 1.3,
  defaultFollowMeVariant: 'colors',
  autoRecordFollowMe: true,
  autoSaveInterval: 30,
};

/**
 * Follow Me game configurations by variant
 */
export const FOLLOW_ME_CONFIG: Record<FollowMeVariant, {
  gridSize: number;
  roundsToWin: number;
  paybackPercent: number;
  description: string;
}> = {
  colors: {
    gridSize: 9,
    roundsToWin: 20,
    paybackPercent: 105,
    description: 'Standard PA Skill 3x3 color grid',
  },
  banana: {
    gridSize: 9,
    roundsToWin: 20,
    paybackPercent: 104,
    description: 'Banilla "Follow the Banana" variant',
  },
  piano: {
    gridSize: 8,
    roundsToWin: 20,
    paybackPercent: 105,
    description: 'Piano keys variant',
  },
  numbers: {
    gridSize: 9,
    roundsToWin: 20,
    paybackPercent: 105,
    description: 'Number sequence variant',
  },
  none: {
    gridSize: 0,
    roundsToWin: 0,
    paybackPercent: 0,
    description: 'Machine has no Follow Me feature',
  },
};

/**
 * Known manufacturers and their typical configurations
 */
export const MANUFACTURER_DEFAULTS: Record<string, {
  followMeVariant: FollowMeVariant;
  maxBet: number;
  paybackPercent: number;
}> = {
  'Pace-O-Matic': {
    followMeVariant: 'colors',
    maxBet: 4.00,
    paybackPercent: 105,
  },
  'Banilla': {
    followMeVariant: 'banana',
    maxBet: 20.00,
    paybackPercent: 104,
  },
  'Diamond Skill': {
    followMeVariant: 'none',
    maxBet: 10.00,
    paybackPercent: 0,
  },
  'Miele': {
    followMeVariant: 'colors',
    maxBet: 4.00,
    paybackPercent: 105,
  },
  'Grover': {
    followMeVariant: 'none',
    maxBet: 5.00,
    paybackPercent: 0,
  },
};

/**
 * App metadata
 */
export const APP_CONFIG = {
  name: 'SkillMachine',
  version: '0.1.0',
  description: 'PA Skill Game Tracker + Follow Me Helper',
};
