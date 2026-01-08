import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Machine, Manufacturer, FollowMeVariant } from '../../types/index';
import { MANUFACTURER_DEFAULTS } from '../../constants/config';
import TextInputField from '../common/TextInputField';
import SelectField from '../common/SelectField';
import TextAreaField from '../common/TextAreaField';

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
        <TextInputField
          label="Machine Name"
          value={formData.name}
          onChange={(value) => handleChange('name', value)}
          placeholder="e.g., Sunoco PA Skill #3"
          required
          error={errors.name}
        />

        {/* Manufacturer */}
        <SelectField
          label="Manufacturer"
          value={formData.manufacturer}
          onChange={(value) => handleChange('manufacturer', value as Manufacturer)}
          required
        >
          {manufacturers.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </SelectField>

        {/* Game Series */}
        <TextInputField
          label="Game Series"
          value={formData.gameSeries}
          onChange={(value) => handleChange('gameSeries', value)}
          placeholder="e.g., Pennsylvania Skill"
        />

        {/* Location */}
        <TextInputField
          label="Location"
          value={formData.location}
          onChange={(value) => handleChange('location', value)}
          placeholder="e.g., Joe's Bar, Sunoco Main St"
        />

        {/* Follow Me Variant */}
        <SelectField
          label="Follow Me Variant"
          value={formData.followMeVariant}
          onChange={(value) => handleChange('followMeVariant', value as FollowMeVariant)}
        >
          {followMeVariants.map((v) => (
            <option key={v} value={v}>
              {v === 'none' ? 'Not Available' : v.charAt(0).toUpperCase() + v.slice(1)}
            </option>
          ))}
        </SelectField>

        {/* Max Bet */}
        <TextInputField
          label="Max Bet ($)"
          type="number"
          step="0.01"
          value={formData.maxBet.toString()}
          onChange={(value) => handleChange('maxBet', parseFloat(value) || 0)}
          placeholder="4.00"
        />

        {/* Notes */}
        <TextAreaField
          label="Notes"
          value={formData.notes}
          onChange={(value) => handleChange('notes', value)}
          placeholder="Any additional notes about this machine..."
          rows={3}
        />
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
