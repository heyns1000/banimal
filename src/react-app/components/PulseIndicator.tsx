import { usePulse } from '@/react-app/contexts/PulseContext';

interface PulseIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showGrains?: boolean;
}

export default function PulseIndicator({ 
  size = 'md', 
  showLabel = true,
  showGrains = false 
}: PulseIndicatorProps) {
  const { pulseSecond, pulsePhase, pulseColor, grainCount } = usePulse();

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div 
          className={`${dotSizes[size]} rounded-full animate-pulse`}
          style={{ backgroundColor: pulseColor }}
        />
        {showLabel && (
          <span className={`${sizeClasses[size]} font-bold uppercase tracking-wider`} style={{ color: pulseColor }}>
            {pulsePhase} ({pulseSecond}s)
          </span>
        )}
      </div>
      {showGrains && (
        <div className={`${sizeClasses[size]} text-gray-600`}>
          Grains: <span className="font-bold text-gray-900">{grainCount.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
