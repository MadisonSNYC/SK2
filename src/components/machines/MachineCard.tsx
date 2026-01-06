import type { Machine } from '../../types/index';
import { Edit, MapPin, Cpu } from 'lucide-react';

interface MachineCardProps {
  machine: Machine;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

export default function MachineCard({
  machine,
  isActive,
  onSelect,
  onEdit,
}: MachineCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
        isActive
          ? 'bg-gray-700 border-yellow-400 shadow-lg shadow-yellow-400/20'
          : 'bg-gray-800 border-gray-700 hover:border-gray-600'
      }`}
    >
      {/* Active Badge */}
      {isActive && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-semibold rounded">
          ACTIVE
        </div>
      )}

      {/* Machine Name */}
      <h3 className="text-lg font-semibold text-white mb-2 pr-16">
        {machine.name}
      </h3>

      {/* Machine Info */}
      <div className="space-y-1 text-sm">
        {/* Manufacturer */}
        <div className="flex items-center gap-2 text-gray-400">
          <Cpu size={14} />
          <span>{machine.manufacturer}</span>
          {machine.gameSeries && (
            <span className="text-gray-500">• {machine.gameSeries}</span>
          )}
        </div>

        {/* Location */}
        {machine.location && (
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin size={14} />
            <span>{machine.location}</span>
          </div>
        )}

        {/* Follow Me Variant */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-500">Follow Me:</span>
          <span className={`text-xs px-2 py-0.5 rounded ${
            machine.followMeVariant === 'none'
              ? 'bg-gray-700 text-gray-400'
              : 'bg-yellow-400 bg-opacity-20 text-yellow-400'
          }`}>
            {machine.followMeVariant === 'none' ? 'Not Available' : machine.followMeVariant.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Edit Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="absolute bottom-4 right-4 p-2 text-gray-400 hover:text-yellow-400 transition-colors"
        aria-label="Edit machine"
      >
        <Edit size={18} />
      </button>
    </div>
  );
}
