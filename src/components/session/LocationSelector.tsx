/**
 * @fileoverview Location selector component
 * @module components/session/LocationSelector
 *
 * Dropdown for selecting gaming location with custom location option.
 * Extracted from StartSessionPage.tsx to separate location selection concerns.
 */

import { LOCATIONS } from '../../constants/gameData';

interface LocationSelectorProps {
  locationId: string;
  customLocation: string;
  showCustomInput: boolean;
  onChange: (value: string) => void;
  onCustomLocationChange: (value: string) => void;
}

export default function LocationSelector({
  locationId,
  customLocation,
  showCustomInput,
  onChange,
  onCustomLocationChange,
}: LocationSelectorProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">
        1. Location <span className="text-red-400">*</span>
      </h2>
      <select
        value={showCustomInput ? 'custom' : locationId}
        onChange={(e) => onChange(e.target.value)}
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

      {showCustomInput && (
        <input
          type="text"
          value={customLocation}
          onChange={(e) => onCustomLocationChange(e.target.value)}
          placeholder="Enter location name"
          className="w-full mt-3 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          autoFocus
        />
      )}
    </div>
  );
}
