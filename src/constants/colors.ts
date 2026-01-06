import { ColorKey, ColorDefinition } from '../types';

/**
 * Color definitions for the Follow Me 3x3 grid
 * Based on PA Skill machine color layout
 *
 * Grid positions:
 * [0] [1] [2]    Hot Pink | Blue | Red
 * [3] [4] [5]    Yellow   | Green| Teal
 * [6] [7] [8]    Grey     | Pink | Burgundy
 */
export const COLORS: Record<ColorKey, ColorDefinition> = {
  'hot-pink': {
    name: 'Hot Pink',
    hex: '#FF69B4',
    position: 0,
    aliases: ['hot pink', 'hotpink', 'hot', 'magenta', 'fuchsia'],
  },
  'blue': {
    name: 'Blue',
    hex: '#0066FF',
    position: 1,
    aliases: ['blue', 'blew', 'bloo'],
  },
  'red': {
    name: 'Red',
    hex: '#FF0000',
    position: 2,
    aliases: ['red', 'read', 'bread'],
  },
  'yellow': {
    name: 'Yellow',
    hex: '#FFD700',
    position: 3,
    aliases: ['yellow', 'yell', 'mellow'],
  },
  'green': {
    name: 'Green',
    hex: '#00CC00',
    position: 4,
    aliases: ['green', 'greene', 'grin'],
  },
  'teal': {
    name: 'Teal',
    hex: '#008080',
    position: 5,
    aliases: ['teal', 'teel', 'tiel', 'deal', 'tea'],
  },
  'grey': {
    name: 'Grey',
    hex: '#808080',
    position: 6,
    aliases: ['grey', 'gray', 'great', 'grape'],
  },
  'pink': {
    name: 'Pink',
    hex: '#FFB6C1',
    position: 7,
    aliases: ['pink', 'think'],
  },
  'burgundy': {
    name: 'Burgundy',
    hex: '#800020',
    position: 8,
    aliases: ['burgundy', 'burgandy', 'maroon', 'dark red', 'brown'],
  },
};

/** Grid order for rendering (left-to-right, top-to-bottom) */
export const COLOR_GRID_ORDER: ColorKey[] = [
  'hot-pink', 'blue', 'red',
  'yellow', 'green', 'teal',
  'grey', 'pink', 'burgundy',
];

/** Helper to check if text color should be dark on this background */
export const isDarkText = (colorKey: ColorKey): boolean => {
  return ['yellow', 'pink', 'grey'].includes(colorKey);
};
