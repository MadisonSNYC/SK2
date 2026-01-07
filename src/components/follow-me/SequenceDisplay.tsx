import type { ColorKey } from '../../types/index';
import { COLORS } from '../../constants/colors';

interface SequenceDisplayProps {
  sequence: ColorKey[];
  currentSpeakingIndex: number | null;
}

export default function SequenceDisplay({ sequence, currentSpeakingIndex }: SequenceDisplayProps) {
  if (sequence.length === 0) {
    return (
      <div className="w-full p-6 bg-gray-800 rounded-lg border border-gray-700 text-center">
        <p className="text-gray-500 text-sm">No colors added yet. Tap a color to start!</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex flex-wrap gap-3 max-h-32 overflow-y-auto">
        {sequence.map((colorKey, index) => {
          const color = COLORS[colorKey];
          const isActive = currentSpeakingIndex === index;

          return (
            <div
              key={index}
              className={`
                w-10
                h-10
                rounded-md
                flex
                items-center
                justify-center
                text-sm
                font-bold
                text-white
                drop-shadow-md
                transition-all
                duration-200
                ${isActive ? 'scale-[1.4] ring-2 ring-yellow-400' : 'scale-100'}
              `}
              style={{
                backgroundColor: color.hex,
                opacity: isActive ? 1 : 0.8,
                boxShadow: isActive
                  ? `0 0 30px ${color.hex}, 0 0 50px ${color.hex}, 0 0 70px ${color.hex}`
                  : undefined,
              }}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
