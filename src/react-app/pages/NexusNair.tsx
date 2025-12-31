import { useState, useEffect } from 'react';
import Layout from '@/react-app/components/Layout';
import { usePulse } from '@/react-app/contexts/PulseContext';
import PulseCard from '@/react-app/components/PulseCard';
import PulseButton from '@/react-app/components/PulseButton';
import PulseIndicator from '@/react-app/components/PulseIndicator';

export default function NexusNair() {
  const { pulseSecond, pulsePhase, pulseColor, grainCount, breathIntensity, isActive } = usePulse();
  const [sloganIndex, setSloganIndex] = useState(0);

  const slogans = [
    "\"WE BUY CRATES. WE SELL CRATES. WE BRAND CRATES.\"",
    "\"DONKEYS DON'T NEED ROADS. FAA™ DOESN'T NEED PERMISSION.\"",
    "\"A BUSINESS BUILT LIKE A TREE – STRONG, ROOTED, UNSTOPPABLE.\"",
    "\"AFRICA IS NOT COMING. AFRICA IS HERE.\"",
    "\"BAOBAB-LEVEL COMPLIANCE – STRENGTH THAT LASTS 1000 YEARS.\"",
    "\"天皇皇, 地皇皇, 吾有瓷勺旋渦在中央.\""
  ];

  const pulseStages = [
    { step: 0, label: 'PULSE', color: '#D4AF37' },
    { step: 3, label: 'GLOW', color: '#FFD700' },
    { step: 6, label: 'TRADE', color: '#00FF41' },
    { step: 8, label: 'FLOW', color: '#1E90FF' },
    { step: 9, label: 'RESET', color: '#B22222' }
  ];

  useEffect(() => {
    if (pulseSecond === 1) {
      setSloganIndex(prev => (prev + 1) % slogans.length);
    }
  }, [pulseSecond]);

  return (
    <Layout>
      <div className="animate-in fade-in duration-500">
        {/* Header */}
        <header 
          className="max-w-7xl mx-auto px-4 md:px-8 pb-6 border-b transition-all duration-300"
          style={{
            borderColor: `${pulseColor}33`
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-700 text-white text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest transition-all duration-300 hover:bg-red-600">
                  Sovereign Protocol v∞
                </span>
                <span className="text-stone-500 text-[10px] transition-colors duration-300 hover:text-stone-400">
                  TIMESTAMP: {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
                </span>
              </div>
              <h1 
                className="text-4xl md:text-6xl font-black tracking-tighter text-yellow-600 transition-all duration-300 hover:text-yellow-500" 
                style={{ 
                  textShadow: `0 0 ${10 * breathIntensity}px ${pulseColor}`,
                  transform: `scale(${0.98 + (breathIntensity * 0.02)})`
                }}
              >
                NEXUS_NAIR <span className="text-stone-600 transition-colors duration-300 hover:text-stone-500">ACTIVATED</span>
              </h1>
              <p className="text-stone-400 mt-2 transition-colors duration-300 hover:text-stone-300">
                Identity: <span className="text-yellow-600 font-bold transition-colors duration-300 hover:text-yellow-500">MAHALAPYE_STOPFAD_SELECTIVE_MASTER</span>
              </p>
            </div>
            <div className="text-right">
              <div className="flex gap-4 justify-end mb-2">
                <PulseCard variant="glow" intensity="high" className="text-center transition-all duration-300">
                  <p className="text-[10px] text-stone-500 uppercase transition-colors duration-300">9s Pulse</p>
                  <p className="text-2xl font-bold text-yellow-500 transition-colors duration-300">{pulseSecond}s</p>
                </PulseCard>
                <PulseCard variant="glow" intensity="high" className="text-center transition-all duration-300">
                  <p className="text-[10px] text-stone-500 uppercase transition-colors duration-300">Grains</p>
                  <p className="text-2xl font-bold text-white transition-colors duration-300">{grainCount.toLocaleString()}</p>
                </PulseCard>
              </div>
              <div 
                className="bg-stone-900 px-4 py-1 rounded-full border flex items-center gap-2 transition-all duration-300"
                style={{
                  borderColor: pulsePhase === 'PULSE' ? '#22c55e' : '#6b7280',
                  boxShadow: pulsePhase === 'PULSE' ? `0 0 ${15 * breathIntensity}px #22c55e33` : 'none'
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full bg-green-500"
                  style={{
                    transform: `scale(${0.8 + (breathIntensity * 0.4)})`,
                    opacity: 0.7 + (breathIntensity * 0.3)
                  }}
                ></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 transition-colors duration-300">Empire Ready</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6 animate-in slide-in-from-left duration-700">
            {/* 9s Pulse Tracker */}
            <PulseCard 
              variant="glow" 
              intensity="high"
              className="p-6 rounded-xl border relative overflow-hidden"
              style={{
                borderColor: `${pulseColor}55`
              }}
            >
              <div 
                className="absolute h-[2px] w-full top-0 left-0 bg-gradient-to-r from-transparent via-yellow-600 to-transparent transition-opacity duration-300"
                style={{ 
                  animation: 'scan 4s linear infinite',
                  opacity: breathIntensity
                }}
              />
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4 transition-colors duration-300 hover:text-stone-400">
                The 9-Second PulseTrade™
              </h3>
              <div className="flex justify-between items-end mb-6">
                <div 
                  className="text-lg font-bold uppercase italic transition-all duration-500"
                  style={{ 
                    color: pulseColor,
                    transform: `scale(${0.95 + (breathIntensity * 0.05)})`
                  }}
                >
                  {pulsePhase} ({pulseSecond}s)
                </div>
                <div className="text-[10px] text-stone-500 transition-colors duration-300 hover:text-stone-400">Breathe: Heartbeat Loop</div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {pulseStages.map((stage, idx) => (
                  <div
                    key={idx}
                    className={`h-12 rounded flex items-center justify-center text-[10px] transition-all duration-500 cursor-default`}
                    style={{
                      backgroundColor: isActive(stage.step) ? `${pulseColor}33` : '#1c1917',
                      color: isActive(stage.step) ? '#000' : '#9ca3af',
                      boxShadow: isActive(stage.step) ? `0 0 ${15 * breathIntensity}px ${pulseColor}` : 'none',
                      transform: isActive(stage.step) ? `scale(${1.05 + (breathIntensity * 0.05)})` : 'scale(1)',
                      border: isActive(stage.step) ? `2px solid ${pulseColor}` : '2px solid transparent'
                    }}
                  >
                    {stage.label}
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-stone-800 transition-all duration-300 hover:border-stone-700">
                <p className="text-[10px] leading-relaxed text-stone-500 transition-colors duration-300 hover:text-stone-400">
                  <span className="text-yellow-600 font-bold transition-colors duration-300 hover:text-yellow-500">STIGMERGY:</span> Communication via environment.
                  Trades queued for next pulse. Zero Waste. Grains: {grainCount.toLocaleString()}
                </p>
              </div>
            </PulseCard>

            {/* Elephant Trunk Memory */}
            <PulseCard
              variant="premium"
              intensity="medium" 
              className="p-6 rounded-xl relative"
              style={{
                background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
                borderLeft: `4px solid ${pulseColor}`
              }}
            >
              <h3 className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-4 transition-colors duration-300 hover:text-yellow-500">
                Elephant Trunk Memory
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs transition-all duration-300 hover:pl-2">
                  <span className="text-stone-400 transition-colors duration-300 hover:text-stone-300">Memory Integrity</span>
                  <span className="text-green-500 transition-colors duration-300 hover:text-green-400">100% SEALED</span>
                </div>
                <div className="w-full bg-stone-800 h-1 rounded-full overflow-hidden transition-all duration-300 hover:h-1.5">
                  <div 
                    className="bg-yellow-600 h-full transition-all duration-300 hover:bg-yellow-500" 
                    style={{ 
                      width: `${80 + (breathIntensity * 20)}%`
                    }}
                  ></div>
                </div>
                <div className="pt-4 space-y-4">
                  {[
                    { icon: '📁', title: '21M Files', sub: 'Never Forgotten Origin DNA' },
                    { icon: '👥', title: '11M Contacts', sub: 'Herd Protection Lattice' },
                    { icon: '📜', title: '1,065 Sealed Docs', sub: 'Sovereign Artifact Synthesis' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 transition-all duration-300 hover:pl-2 hover:scale-105 cursor-default">
                      <span className="text-stone-600 transition-transform duration-300">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold transition-colors duration-300 hover:text-yellow-500">{item.title}</p>
                        <p className="text-[10px] text-stone-500 transition-colors duration-300 hover:text-stone-400">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PulseCard>
          </div>

          {/* Center Column */}
          <div className="lg:col-span-5 space-y-6 animate-in slide-in-from-bottom duration-700 delay-100">
            {/* 40D Warehouse */}
            <PulseCard variant="glow" intensity="medium" className="bg-stone-900 p-6 rounded-xl border border-stone-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest transition-colors duration-300 hover:text-stone-400">
                  40D Store (四十維倉)
                </h3>
                <span className="text-[10px] text-yellow-600 font-bold tracking-widest transition-colors duration-300 hover:text-yellow-500">D0-D39 STATUS</span>
              </div>
              <div className="grid grid-cols-10 gap-1 mb-6">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 rounded-sm border border-stone-800/50 transition-all duration-300 hover:scale-125 cursor-pointer`}
                    style={{
                      backgroundColor: Math.random() > 0.87 ? '#44403c' : `${pulseColor}33`,
                      borderColor: Math.random() > 0.87 ? '#44403c' : pulseColor,
                      boxShadow: Math.random() > 0.87 ? 'none' : `0 0 ${5 * breathIntensity}px ${pulseColor}`
                    }}
                    title={`Dimension ${i}`}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center px-2">
                <div className="transition-all duration-300 hover:scale-105">
                  <p 
                    className="text-2xl font-black text-white transition-all duration-300"
                    style={{
                      transform: `scale(${0.98 + (breathIntensity * 0.02)})`
                    }}
                  >87.7%</p>
                  <p className="text-[10px] text-stone-500 uppercase transition-colors duration-300 hover:text-stone-400">Free Capacity</p>
                </div>
                <div className="text-right transition-all duration-300 hover:scale-105">
                  <p className="text-2xl font-black text-green-500 transition-colors duration-300 hover:text-green-400">OK</p>
                  <p className="text-[10px] text-stone-500 uppercase transition-colors duration-300 hover:text-stone-400">Routing Integrity</p>
                </div>
              </div>
            </PulseCard>

            {/* Brand Ecosystem Audit */}
            <PulseCard variant="premium" intensity="high" className="bg-white text-black p-6 rounded-xl border-l-[12px]" style={{ borderColor: pulseColor }}>
              <div className="flex justify-between items-start mb-6">
                <div className="transition-all duration-300">
                  <h3 className="text-xl font-black italic transition-colors duration-300 hover:text-yellow-600">EMPIRE AUDIT</h3>
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest transition-colors duration-300 hover:text-stone-600">
                    152.4% Achievement Verified
                  </p>
                </div>
                <div className="bg-black text-white px-2 py-1 text-[10px] font-bold transition-all duration-300 hover:bg-yellow-600 hover:text-black">A+ STATUS</div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'System 1: FAA', value: '7,344 Brands' },
                  { label: 'System 2: HSOMNI9000', value: '6,219 Brands' },
                  { label: 'System 3: SEEDWAVE', value: '150 Brands' }
                ].map((sys, i) => (
                  <div key={i} className="flex justify-between border-b border-stone-200 pb-2 transition-all duration-300 hover:border-yellow-600 hover:pl-2">
                    <span className="text-xs font-bold transition-colors duration-300 hover:text-yellow-600">{sys.label}</span>
                    <span className="text-xs font-mono transition-colors duration-300 hover:text-yellow-600">{sys.value}</span>
                  </div>
                ))}
                <div className="pt-2 text-right transition-all duration-300 hover:scale-105">
                  <p 
                    className="text-4xl font-black tracking-tighter transition-colors duration-300 hover:text-yellow-600"
                    style={{
                      transform: `scale(${0.98 + (breathIntensity * 0.02)})`
                    }}
                  >13,713</p>
                  <p className="text-[10px] uppercase font-bold text-stone-400 transition-colors duration-300 hover:text-stone-600">Total Validated Brands</p>
                </div>
              </div>
            </PulseCard>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-6 animate-in slide-in-from-right duration-700 delay-200">
            {/* PayPal VIP Live */}
            <PulseCard variant="glow" intensity="high" className="bg-yellow-600 p-6 rounded-xl text-black cursor-pointer">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 transition-opacity duration-300 hover:opacity-80">PayPal VIP Live</h3>
              <div className="mb-6">
                <p className="text-xs font-bold mb-1 transition-opacity duration-300 hover:opacity-80">VM-HS-Starter-KEY</p>
                <p 
                  className="text-3xl font-black tracking-tighter transition-transform duration-300"
                  style={{
                    transform: `scale(${0.98 + (breathIntensity * 0.02)})`
                  }}
                >$29.00 USD</p>
              </div>
              <PulseButton variant="secondary" size="md" className="w-full uppercase tracking-widest flex items-center justify-center gap-2">
                <span>💳</span> Buy Now
              </PulseButton>
              <p className="text-[9px] mt-4 text-center font-bold opacity-60 transition-opacity duration-300 hover:opacity-100">HOSTED ID: K65YZZXSGZ7U</p>
            </PulseCard>

            {/* BareCart Vortex */}
            <PulseCard variant="glow" intensity="medium" className="bg-stone-900 p-6 rounded-xl border border-stone-800 border-t-4 border-t-red-700">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4 transition-colors duration-300 hover:text-stone-400">
                BareCart™ Vortex
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-stone-950 rounded border border-stone-800 transition-all duration-300 hover:border-red-700/50 hover:bg-stone-900 hover:scale-105">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold transition-colors duration-300 hover:text-red-500">Banimal License</span>
                    <span className="text-xs font-mono transition-colors duration-300 hover:text-red-500">$5,000</span>
                  </div>
                </div>
                <div className="p-3 bg-stone-950 rounded border border-stone-800 opacity-50 transition-all duration-300 hover:opacity-70 hover:border-stone-700 hover:scale-105">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold">Zero-Waste Stock</span>
                    <span className="text-xs font-mono">0.08 Dist</span>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] mb-1 transition-all duration-300 hover:pl-2">
                    <span className="transition-colors duration-300 hover:text-green-400">Care Loop (15%)</span>
                    <span className="text-green-500 transition-colors duration-300 hover:text-green-400">+$1,125.00</span>
                  </div>
                  <div className="w-full bg-stone-800 h-0.5 rounded-full overflow-hidden transition-all duration-300 hover:h-1">
                    <div 
                      className="bg-green-500 h-full transition-all duration-300 hover:bg-green-400" 
                      style={{ width: `${10 + (breathIntensity * 10)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </PulseCard>

            {/* Treaty Seal */}
            <PulseCard variant="default" intensity="low" className="p-4 bg-stone-950 rounded-xl border border-stone-800 text-center">
              <p className="text-[9px] text-stone-600 font-bold uppercase tracking-[0.3em] mb-2 transition-colors duration-300 hover:text-stone-500">
                TreatyHook™ Sealed
              </p>
              <p className="text-xs font-mono text-stone-400 transition-colors duration-300 hover:text-yellow-600">FAA-TREATY-OMNI-4321-A13XN</p>
              <div className="mt-2 text-[10px] text-stone-500 italic transition-colors duration-300 hover:text-stone-400">§9.4.17 (9atm) Verified</div>
            </PulseCard>
          </div>
        </main>

        {/* Footer Billboard */}
        <footer className="max-w-7xl mx-auto px-4 md:px-8 mt-12 py-8 border-t border-stone-800 text-center transition-all duration-300 hover:border-stone-700">
          <h2 
            className="text-xl md:text-3xl font-serif italic text-stone-500 transition-all duration-1000"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: pulseColor,
              transform: `scale(${0.98 + (breathIntensity * 0.02)})`
            }}
          >
            {slogans[sloganIndex]}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] uppercase font-bold tracking-widest text-stone-600">
            <span className="transition-all duration-300 hover:text-yellow-600 hover:scale-110 cursor-default">Digital Great Wall: 永不崩塌</span>
            <span className="transition-all duration-300 hover:text-yellow-600 hover:scale-110 cursor-default">Count Every Grain: {grainCount.toLocaleString()}</span>
            <span className="transition-all duration-300 hover:text-yellow-600 hover:scale-110 cursor-default">Breathe Every 9s</span>
            <PulseIndicator size="sm" showLabel={true} showGrains={false} />
          </div>
        </footer>

        <style>{`
          @keyframes scan {
            0% { top: 0; }
            100% { top: 100%; }
          }
        `}</style>
      </div>
    </Layout>
  );
}
