import type { ColorKey } from '../../types/index';
import { COLORS, COLOR_GRID_ORDER, isDarkText } from '../../constants/colors';

interface ColorGridProps {
  onColorTap: (colorKey: ColorKey) => void;
  currentSpeakingColor: ColorKey | null;
  disabled: boolean;
}

export default function ColorGrid({ onColorTap, currentSpeakingColor, disabled }: ColorGridProps) {
  const handleColorClick = (colorKey: ColorKey) => {
    if (disabled) return;
    onColorTap(colorKey);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-3">
        {COLOR_GRID_ORDER.map((colorKey) => {
          const color = COLORS[colorKey];
          const isActive = currentSpeakingColor === colorKey;
          const isDimmed = disabled && !isActive;

          return (
            <button
              key={colorKey}
              onClick={() => handleColorClick(colorKey)}
              disabled={disabled}
              className={`
                relative
                aspect-square
                rounded-xl
                font-semibold
                text-sm
                transition-all
                duration-200
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                ${isActive ? 'scale-[1.15] ring-4 ring-white' : 'scale-100'}
                ${isDimmed ? 'opacity-35' : 'opacity-100'}
                ${!disabled && !isActive ? 'hover:scale-105 hover:shadow-lg' : ''}
              `}
              style={{
                backgroundColor: color.hex,
                color: isDarkText(colorKey) ? '#1F2937' : '#FFFFFF',
                boxShadow: isActive
                  ? `0 0 30px ${color.hex}, 0 0 50px ${color.hex}, 0 0 70px ${color.hex}`
                  : undefined,
              }}
              aria-label={color.name}
            >
              <span className="drop-shadow-md">{color.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
