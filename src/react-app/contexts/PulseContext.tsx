import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PulseContextType {
  pulseSecond: number;
  pulsePhase: 'PULSE' | 'GLOW' | 'TRADE' | 'FLOW' | 'RESET';
  pulseColor: string;
  grainCount: number;
  breathIntensity: number;
  isActive: (step: number) => boolean;
}

const PulseContext = createContext<PulseContextType | undefined>(undefined);

const PULSE_PHASES = [
  { step: 0, label: 'PULSE', color: '#D4AF37', intensity: 1.0 },
  { step: 3, label: 'GLOW', color: '#FFD700', intensity: 0.8 },
  { step: 6, label: 'TRADE', color: '#00FF41', intensity: 0.6 },
  { step: 8, label: 'FLOW', color: '#1E90FF', intensity: 0.4 },
  { step: 9, label: 'RESET', color: '#B22222', intensity: 0.2 }
] as const;

export function PulseProvider({ children }: { children: ReactNode }) {
  const [pulseSecond, setPulseSecond] = useState(1);
  const [grainCount, setGrainCount] = useState(13713);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseSecond(prev => (prev % 9) + 1);
    }, 1000);

    const grainInterval = setInterval(() => {
      setGrainCount(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(grainInterval);
    };
  }, []);

  const getCurrentPhase = () => {
    if (pulseSecond === 1 || pulseSecond === 0) return PULSE_PHASES[0];
    if (pulseSecond >= 3 && pulseSecond < 6) return PULSE_PHASES[1];
    if (pulseSecond >= 6 && pulseSecond < 8) return PULSE_PHASES[2];
    if (pulseSecond === 8) return PULSE_PHASES[3];
    if (pulseSecond === 9) return PULSE_PHASES[4];
    return PULSE_PHASES[0];
  };

  const isActive = (step: number) => {
    if (step === 0) return pulseSecond >= 0 && pulseSecond < 3;
    if (step === 3) return pulseSecond >= 3 && pulseSecond < 6;
    if (step === 6) return pulseSecond >= 6 && pulseSecond < 8;
    if (step === 8) return pulseSecond === 8;
    if (step === 9) return pulseSecond === 9;
    return false;
  };

  const currentPhase = getCurrentPhase();

  return (
    <PulseContext.Provider
      value={{
        pulseSecond,
        pulsePhase: currentPhase.label,
        pulseColor: currentPhase.color,
        grainCount,
        breathIntensity: currentPhase.intensity,
        isActive
      }}
    >
      {children}
    </PulseContext.Provider>
  );
}

export function usePulse() {
  const context = useContext(PulseContext);
  if (context === undefined) {
    throw new Error('usePulse must be used within a PulseProvider');
  }
  return context;
}
