import { useState, useEffect, FormEvent } from 'react';
import type { Machine, Manufacturer, FollowMeVariant } from '../../types/index';
import { MANUFACTURER_DEFAULTS } from '../../constants/config';

interface MachineFormProps {
  machine?: Machine; // If provided, we're editing; otherwise, adding
  onSave: (machineData: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const manufacturers: Manufacturer[] = [
  'Pace-O-Matic',
  'Banilla',
  'Miele',
  'Grover',
  'Diamond Skill',
  'Other',
];

const followMeVariants: FollowMeVariant[] = [
  'colors',
  'banana',
  'piano',
  'numbers',
  'none',
];

export default function MachineForm({ machine, onSave, onCancel }: MachineFormProps) {
  const [formData, setFormData] = useState({
    name: machine?.name || '',
    manufacturer: machine?.manufacturer || ('Pace-O-Matic' as Manufacturer),
    gameSeries: machine?.gameSeries || '',
    gameTitle: machine?.gameTitle || '',
    location: machine?.location || '',
    locationAddress: machine?.locationAddress || '',
    followMeVariant: machine?.followMeVariant || ('colors' as FollowMeVariant),
    followMeGridSize: machine?.followMeGridSize || 9,
    followMeRoundsToWin: machine?.followMeRoundsToWin || 20,
    followMePaybackPercent: machine?.followMePaybackPercent || 105,
    maxBet: machine?.maxBet || 4.0,
    notes: machine?.notes || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Auto-fill defaults when manufacturer changes
  useEffect(() => {
    if (!machine) { // Only auto-fill when adding new machine
      const defaults = MANUFACTURER_DEFAULTS[formData.manufacturer];
      if (defaults) {
        setFormData(prev => ({
          ...prev,
          followMeVariant: defaults.followMeVariant,
          maxBet: defaults.maxBet,
          followMePaybackPercent: defaults.paybackPercent,
        }));
      }
    }
  }, [formData.manufacturer, machine]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Machine name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleChange = (
    field: string,
    value: string | number | Manufacturer | FollowMeVariant
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="space-y-4">
        {/* Machine Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Machine Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.name ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="e.g., Sunoco PA Skill #3"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Manufacturer */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Manufacturer <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.manufacturer}
            onChange={(e) => handleChange('manufacturer', e.target.value as Manufacturer)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {manufacturers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Game Series */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Game Series
          </label>
          <input
            type="text"
            value={formData.gameSeries}
            onChange={(e) => handleChange('gameSeries', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="e.g., Pennsylvania Skill"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="e.g., Joe's Bar, Sunoco Main St"
          />
        </div>

        {/* Follow Me Variant */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Follow Me Variant
          </label>
          <select
            value={formData.followMeVariant}
            onChange={(e) => handleChange('followMeVariant', e.target.value as FollowMeVariant)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {followMeVariants.map((v) => (
              <option key={v} value={v}>
                {v === 'none' ? 'Not Available' : v.charAt(0).toUpperCase() + v.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Max Bet */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Max Bet ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.maxBet}
            onChange={(e) => handleChange('maxBet', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="4.00"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            placeholder="Any additional notes about this machine..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
        >
          {machine ? 'Save Changes' : 'Add Machine'}
        </button>
      </div>
    </form>
  );
}
