import { useState, useEffect, useMemo } from 'react';
import { usePulse } from '@/react-app/contexts/PulseContext';
import PulseCard from '@/react-app/components/PulseCard';
import PulseButton from '@/react-app/components/PulseButton';
import PulseIndicator from '@/react-app/components/PulseIndicator';
import { 
  ShieldCheck, 
  Fingerprint, 
  Search,
  CheckCircle2,
  Anchor,
  Dna,
  Box,
  Globe,
  Zap,
  TreePine,
  Leaf,
  Droplets,
  Wind
} from 'lucide-react';

interface License {
  id: string;
  name: string;
  tier: 'Sovereign' | 'Dynastic' | 'Operational' | 'Market';
  type: string;
  status: 'Deep Root' | 'Main Trunk' | 'Branching' | 'Foliage' | 'Sub-Soil';
  dna: string;
}

export default function BaobabEcoStack() {
  const { pulseSecond, pulsePhase, pulseColor, grainCount, breathIntensity } = usePulse();
  const [, setEcoStatus] = useState('DORMANT');
  const [search, setSearch] = useState('');
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [nutrientFlow, setNutrientFlow] = useState(0);
  const [isRooted, setIsRooted] = useState(false);

  // EcoStack Growth Logic synchronized with global pulse
  useEffect(() => {
    if (!isRooted) {
      const growth = pulseSecond * 11.11; // Reaches 100% at pulse 9
      setNutrientFlow(growth);
      if (growth >= 100) {
        setIsRooted(true);
        setEcoStatus('BAOBAB-LEVEL');
      }
    }
  }, [pulseSecond, isRooted]);

  const licenses: License[] = [
    { id: 'FAA-001', name: 'Playing with the Seed™', tier: 'Sovereign', type: 'Master IP', status: 'Deep Root', dna: 'SEED-4321-ALPHA' },
    { id: 'FAA-002', name: 'FAA™ Ecosystem', tier: 'Sovereign', type: 'Governance', status: 'Main Trunk', dna: 'GOV-9900-BETA' },
    { id: 'FAA-003', name: 'Banimal License', tier: 'Sovereign', type: 'Master Brand', status: 'Deep Root', dna: 'BANIM-5000-ROOT' },
    { id: 'HS-INF-01', name: 'InfraHouse Build', tier: 'Dynastic', type: 'Construction', status: 'Branching', dna: 'BUILD-0402-OMNI' },
    { id: 'HS-SMT-05', name: 'SmartCity Infra', tier: 'Dynastic', type: 'Infrastructure', status: 'Branching', dna: 'CITY-8821-GRID' },
    { id: 'FAA-029', name: 'Vortex Grain Path', tier: 'Dynastic', type: 'Logistics', status: 'Foliage', dna: 'VORTEX-0029-X' },
    { id: 'FAA-025', name: 'Elephant Memory™', tier: 'Sovereign', type: 'Storage', status: 'Sub-Soil', dna: 'MEM-21M-INF' },
    { id: 'FAA-030', name: 'BareCart™ Vortex', tier: 'Dynastic', type: 'Commerce', status: 'Foliage', dna: 'CART-3200-ZERO' },
    { id: 'FAA-031', name: 'Shanana™ Routing', tier: 'Operational', type: 'Load Balance', status: 'Branching', dna: 'ROUTE-2900-FLOW' },
    { id: 'FAA-032', name: '40D Warehouse', tier: 'Sovereign', type: 'Storage', status: 'Sub-Soil', dna: 'WARE-6500-40D' },
    { id: 'FAA-033', name: 'PulseTrade™ Core', tier: 'Operational', type: 'Trade Engine', status: 'Main Trunk', dna: 'PULSE-4100-9S' },
    { id: 'FAA-034', name: 'CrateLogic Pro', tier: 'Operational', type: 'Logistics', status: 'Foliage', dna: 'CRATE-1800-LOGIC' }
  ];

  const filteredLicenses = useMemo(() => {
    return licenses.filter(l => 
      l.name.toLowerCase().includes(search.toLowerCase()) || 
      l.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, licenses]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Deep Root':
      case 'Sub-Soil':
        return 'text-green-600 bg-green-600/10';
      case 'Main Trunk':
        return 'text-yellow-600 bg-yellow-600/10';
      case 'Branching':
        return 'text-blue-600 bg-blue-600/10';
      case 'Foliage':
        return 'text-emerald-600 bg-emerald-600/10';
      default:
        return 'text-stone-600 bg-stone-900';
    }
  };

  return (
    <div className="min-h-screen bg-[#020302] text-stone-300 font-mono p-4 md:p-10 selection:bg-green-600 selection:text-black">
      
      {/* Vertical Nutrient Pulse (Side indicator) */}
      <div className="fixed left-0 top-0 h-full w-1 bg-stone-900 z-50 overflow-hidden">
        <div 
          className="w-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] transition-all duration-1000"
          style={{ 
            height: `${(pulseSecond / 9) * 100}%`,
            boxShadow: `0 0 ${15 * breathIntensity}px ${pulseColor}`
          }}
        ></div>
      </div>

      {/* Baobab Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div className="flex items-center gap-5">
          <PulseCard
            variant="glow"
            intensity="high"
            className={`p-4 rounded-full border-2 transition-all duration-1000`}
            style={{
              borderColor: isRooted ? pulseColor : '#1c1917',
              backgroundColor: isRooted ? `${pulseColor}11` : 'rgba(28, 25, 23, 0.4)'
            }}
          >
            <TreePine 
              className={`w-8 h-8 transition-all duration-1000`}
              style={{
                color: isRooted ? pulseColor : '#44403c',
                transform: `scale(${0.95 + (breathIntensity * 0.1)}) rotate(${breathIntensity * 5}deg)`,
                animation: isRooted ? 'bounce 3s ease-in-out infinite' : 'none'
              }}
            />
          </PulseCard>
          <div>
            <h1 
              className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-2"
              style={{
                transform: `scale(${0.98 + (breathIntensity * 0.02)})`
              }}
            >
              BAOBAB <span className="text-stone-700 font-light">ECOSTACK</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black text-stone-600 tracking-widest uppercase italic">The Truth is Rooted</span>
              <PulseIndicator size="sm" showLabel={false} showGrains={false} />
              <div className="h-1 w-8 bg-stone-900 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000" 
                  style={{ 
                    width: `${nutrientFlow}%`,
                    backgroundColor: pulseColor,
                    boxShadow: `0 0 ${10 * breathIntensity}px ${pulseColor}`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <PulseCard variant="default" intensity="medium" className="bg-stone-900/30 border border-stone-800 px-6 py-3 rounded-2xl flex items-center gap-3">
            <Droplets 
              className="w-5 h-5 text-blue-500"
              style={{
                transform: `translateY(${-3 * breathIntensity}px)`
              }}
            />
            <div>
              <p className="text-[9px] font-bold text-stone-600 uppercase">Nutrient Flow</p>
              <p className="text-xs font-black text-white tracking-widest">{Math.floor(nutrientFlow)}% ASCENDING</p>
            </div>
          </PulseCard>
          <PulseCard variant="default" intensity="low" className="bg-stone-900/30 border border-stone-800 px-6 py-3 rounded-2xl flex items-center gap-3">
            <Wind className="w-5 h-5 text-stone-500" />
            <div>
              <p className="text-[9px] font-bold text-stone-600 uppercase">Air-Gap Sync</p>
              <p className="text-xs font-black text-white tracking-widest">111 DIALECTS</p>
            </div>
          </PulseCard>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left: EcoStack Growth Matrix */}
        <div className="lg:col-span-8 space-y-6">
          <PulseCard variant="premium" intensity="low" className="bg-stone-950/80 border border-stone-800 p-2 rounded-full flex items-center backdrop-blur-sm">
            <Search className="ml-4 w-4 h-4 text-stone-600" />
            <input 
              type="text" 
              placeholder={`Search the Forest (${licenses.length} Growth Nodes)...`}
              className="w-full bg-transparent py-3 px-4 focus:outline-none text-sm font-bold placeholder:text-stone-800"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="px-4 py-1 mr-2 bg-stone-900 rounded-lg text-[10px] font-black text-stone-500 border border-stone-800">
              {filteredLicenses.length} NODES
            </div>
          </PulseCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLicenses.map(node => (
              <PulseCard
                key={node.id}
                variant={selectedLicense?.id === node.id ? 'glow' : 'default'}
                intensity={selectedLicense?.id === node.id ? 'high' : 'low'}
                onClick={() => setSelectedLicense(node)}
                className={`p-6 rounded-3xl border cursor-pointer relative overflow-hidden ${
                  selectedLicense?.id === node.id 
                  ? 'bg-green-900/5 border-green-500/50' 
                  : 'bg-stone-900/10 border-stone-800/50 hover:border-green-800'
                }`}
              >
                {/* Organic Growth Texture */}
                <div 
                  className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity rotate-45"
                  style={{
                    transform: `rotate(${45 + (breathIntensity * 10)}deg)`
                  }}
                >
                  <Leaf className="w-32 h-32" />
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-xl ${getStatusColor(node.status)}`}>
                    {node.status === 'Deep Root' || node.status === 'Sub-Soil' ? (
                      <Anchor className="w-5 h-5" />
                    ) : (
                      <Leaf className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-[10px] font-black text-stone-700 uppercase tracking-widest">{node.id}</span>
                </div>
                <h3 
                  className="text-lg font-black text-white mb-1 group-hover:text-green-400 transition-colors italic tracking-tight"
                  style={{
                    transform: selectedLicense?.id === node.id ? `scale(${0.98 + (breathIntensity * 0.02)})` : 'scale(1)'
                  }}
                >
                  {node.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-600 uppercase font-black">{node.type}</span>
                  <div 
                    className="w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: pulseColor,
                      boxShadow: `0 0 ${5 * breathIntensity}px ${pulseColor}`
                    }}
                  ></div>
                  <span className={`text-[10px] font-black uppercase ${node.status === 'Deep Root' ? 'text-green-600' : 'text-stone-500'}`}>
                    {node.status}
                  </span>
                </div>
              </PulseCard>
            ))}
          </div>
        </div>

        {/* Right: Growth Intelligence & Sovereignty */}
        <div className="lg:col-span-4 space-y-6">
          <PulseCard variant="premium" intensity="medium" className="bg-stone-950 border border-stone-800 p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6">
              <Zap 
                className={`w-5 h-5 ${isRooted ? 'animate-pulse' : ''}`}
                style={{
                  color: isRooted ? pulseColor : '#1c1917',
                  filter: isRooted ? `drop-shadow(0 0 ${10 * breathIntensity}px ${pulseColor})` : 'none'
                }}
              />
            </div>
            
            <h2 className="text-xs font-black text-white uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
              <Fingerprint className="w-4 h-4" style={{ color: pulseColor }} /> 
              ECOSTACK INTEL
            </h2>
            
            {selectedLicense ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-1">
                  <label className="text-[9px] text-stone-600 uppercase font-black tracking-widest">Growth Pattern</label>
                  <p 
                    className="text-2xl font-black text-white leading-tight uppercase italic"
                    style={{
                      transform: `scale(${0.98 + (breathIntensity * 0.02)})`
                    }}
                  >
                    {selectedLicense.name}
                  </p>
                </div>

                <PulseCard 
                  variant="glow" 
                  intensity="high"
                  className="p-4 bg-stone-900/40 rounded-2xl border border-stone-800"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: pulseColor,
                        boxShadow: `0 0 ${10 * breathIntensity}px ${pulseColor}`
                      }}
                    ></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Sovereign DNA</span>
                  </div>
                  <p className="text-xs font-mono text-green-500 break-all leading-relaxed">
                    {selectedLicense.dna}-BAOBAB-ROOT
                  </p>
                </PulseCard>

                <div className="space-y-4">
                  {[
                    { label: 'Ecosystem Tier', value: selectedLicense.tier },
                    { label: 'Hydration (Data Flow)', value: 'OPTIMIZED' },
                    { label: 'Pulse Phase', value: pulsePhase },
                    { label: 'Grain Count', value: grainCount.toLocaleString() }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] uppercase font-bold text-stone-500 border-b border-stone-900 pb-3">
                      <span>{item.label}</span>
                      <span className="text-white">{item.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold">
                    <span>Resilience Rating</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5,6,7].map(i => (
                        <div 
                          key={i} 
                          className="w-3 h-1 rounded-full transition-all duration-300" 
                          style={{
                            backgroundColor: i <= 6 ? pulseColor : '#1c1917',
                            boxShadow: i <= 6 ? `0 0 ${5 * breathIntensity}px ${pulseColor}` : 'none'
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative inline-block">
                  <Dna 
                    className="w-16 h-16 text-stone-900 mx-auto mb-4" 
                    style={{
                      animation: 'spin 8s linear infinite',
                      transform: `rotate(${pulseSecond * 40}deg)`
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Box className="w-4 h-4 text-stone-700" />
                  </div>
                </div>
                <p className="text-[10px] text-stone-700 font-black uppercase tracking-[0.3em]">
                  Awaiting Soil Sample<br/>Initiating Baobab Protocol
                </p>
              </div>
            )}
            
            <PulseButton
              variant={isRooted ? 'success' : 'secondary'}
              size="lg"
              disabled={!isRooted}
              className={`w-full mt-10 uppercase tracking-[0.3em] ${!isRooted ? 'cursor-not-allowed' : ''}`}
            >
              <TreePine className="w-4 h-4" /> 
              {isRooted ? 'Expand Sovereign Forest' : `Deepening Roots ${Math.floor(nutrientFlow)}%`}
            </PulseButton>
          </PulseCard>

          <PulseCard variant="glow" intensity="medium" className="bg-gradient-to-br from-stone-900/40 to-black border border-stone-800 p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="p-3 rounded-2xl"
                style={{
                  backgroundColor: `${pulseColor}22`
                }}
              >
                <ShieldCheck 
                  className="w-6 h-6"
                  style={{ color: pulseColor }}
                />
              </div>
              <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Gorilla Ledger</h4>
            </div>
            <p className="text-[10px] text-stone-500 leading-relaxed italic mb-6">
              "A business built like a tree—strong, rooted, unstoppable. Scaling so fast donkeys can't keep up."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: pulseColor,
                  animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                }}
              ></div>
              <span 
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: pulseColor }}
              >
                Sovereignty: 永不崩塌
              </span>
            </div>
            <div className="mt-4 p-3 bg-stone-950 rounded-xl border border-stone-800">
              <p className="text-[9px] text-stone-600 uppercase tracking-wider mb-1">Repository Root</p>
              <code className="text-xs font-mono text-green-500 break-all">
                git@github.com:heyns1000/baobab.git
              </code>
            </div>
          </PulseCard>
        </div>
      </div>

      {/* Global Expansion Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-[#020302]/80 backdrop-blur-md border-t border-stone-900 p-5 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-600">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2">
              <Anchor className="w-3 h-3" style={{ color: pulseColor }} /> 
              Rooted in Legacy
            </span>
            <span className="hidden md:inline text-stone-800">|</span>
            <span className="flex items-center gap-2">
              <Globe className="w-3 h-3" /> 111 Dialects Synced
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="w-3 h-3" style={{ color: pulseColor }} />
              <span>Baobab Phase: {isRooted ? 'MATURE' : 'GROWING'}</span>
            </div>
            <span className="text-stone-800">/</span>
            <span className="text-stone-500 tracking-[0.4em]">$100M ECOSTACK CONSOLIDATED</span>
            <span className="text-stone-800">/</span>
            <PulseIndicator size="sm" showLabel={false} showGrains={true} />
          </div>
        </div>
      </div>

    </div>
  );
}
