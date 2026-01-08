/**
 * @fileoverview Machine selector component
 * @module components/session/MachineSelector
 *
 * Dropdown for selecting machine type, filtered by location.
 * Extracted from StartSessionPage.tsx to separate machine selection concerns.
 */

import { getMachineTypesForLocation } from '../../constants/gameData';

interface MachineSelectorProps {
  value: string;
  locationId: string;
  isCustomLocation: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function MachineSelector({
  value,
  locationId,
  isCustomLocation,
  onChange,
  disabled = false,
}: MachineSelectorProps) {
  const availableMachines = locationId ? getMachineTypesForLocation(locationId) : [];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">
        2. Machine <span className="text-red-400">*</span>
      </h2>
      {!isCustomLocation && availableMachines.length > 0 ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select Machine</option>
          {availableMachines.map((machine) => (
            <option key={machine.id} value={machine.id}>
              {machine.name} ({machine.manufacturer})
            </option>
          ))}
        </select>
      ) : isCustomLocation ? (
        <div>
          <p className="text-sm text-gray-400 mb-3">
            Select any machine type:
          </p>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
