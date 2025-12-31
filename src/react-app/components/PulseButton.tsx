import { ReactNode, ButtonHTMLAttributes } from 'react';
import { usePulse } from '@/react-app/contexts/PulseContext';

interface PulseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export default function PulseButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}: PulseButtonProps) {
  const { breathIntensity, pulseColor } = usePulse();

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white',
    danger: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white'
  };

  return (
    <button
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        font-bold rounded-xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        transform: `scale(${0.95 + (breathIntensity * 0.05)})`,
        boxShadow: `0 0 ${20 * breathIntensity}px ${pulseColor}33`
      }}
      {...props}
    >
      {children}
    </button>
  );
}
