import { ReactNode, HTMLAttributes } from 'react';
import { usePulse } from '@/react-app/contexts/PulseContext';

interface PulseCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'premium' | 'glow';
  intensity?: 'low' | 'medium' | 'high';
}

export default function PulseCard({ 
  children, 
  variant = 'default',
  intensity = 'medium',
  className = '',
  ...props 
}: PulseCardProps) {
  const { breathIntensity, pulseColor } = usePulse();

  const intensityMultiplier = {
    low: 0.3,
    medium: 0.6,
    high: 1.0
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200',
    premium: 'bg-gradient-to-br from-white to-gray-50 border-2 border-purple-200',
    glow: 'bg-gradient-to-br from-purple-50 to-indigo-50 border-2'
  };

  const glowIntensity = breathIntensity * intensityMultiplier[intensity];

  return (
    <div
      className={`
        ${variantClasses[variant]}
        rounded-2xl p-6
        transition-all duration-300
        hover:scale-[1.02]
        ${className}
      `}
      style={{
        boxShadow: variant === 'glow' 
          ? `0 0 ${30 * glowIntensity}px ${pulseColor}22, 0 4px 6px -1px rgba(0, 0, 0, 0.1)`
          : `0 0 ${15 * glowIntensity}px ${pulseColor}11, 0 4px 6px -1px rgba(0, 0, 0, 0.1)`,
        borderColor: variant === 'glow' ? `${pulseColor}44` : undefined,
        transform: `translateY(${-2 * glowIntensity}px)`
      }}
      {...props}
    >
      {children}
    </div>
  );
}
