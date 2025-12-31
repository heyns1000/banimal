import Layout from '@/react-app/components/Layout';
import { usePulse } from '@/react-app/contexts/PulseContext';
import PulseCard from '@/react-app/components/PulseCard';
import PulseIndicator from '@/react-app/components/PulseIndicator';
import { Database, Activity, CheckCircle, Globe, Zap, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SystemStats {
  system: string;
  total: number;
}

interface BrandSystem {
  name: string;
  emoji: string;
  brands: number;
  status: 'operational' | 'syncing';
  tier: string;
  gradient: string;
}

export default function EcosystemDashboard() {
  const { pulseSecond, pulsePhase, pulseColor, grainCount, breathIntensity } = usePulse();
  const [syncStatus] = useState<'synced' | 'syncing'>('synced');
  const [systemStats, setSystemStats] = useState<SystemStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const response = await fetch('/api/brands/stats');
      if (response.ok) {
        const data = await response.json();
        setSystemStats(data.stats || []);
      }
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSystemData = (key: string): number => {
    const stat = systemStats.find(s => s.system === key);
    return stat?.total || 0;
  };

  const systems: BrandSystem[] = [
    {
      name: 'FAA™ Brand Licensing System',
      emoji: '🏛️',
      brands: getSystemData('faa'),
      status: 'operational',
      tier: 'Sovereign',
      gradient: 'from-yellow-400 to-amber-600'
    },
    {
      name: 'HSOMNI9000 Repository',
      emoji: '🧠',
      brands: getSystemData('hsomni'),
      status: 'operational',
      tier: 'VaultMesh',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      name: 'Seedwave Verified Brands',
      emoji: '🌱',
      brands: getSystemData('seedwave'),
      status: 'operational',
      tier: 'Premium',
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  const totalBrands = systems.reduce((sum, sys) => sum + sys.brands, 0);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-12">
        <PulseCard variant="premium" intensity="high" className="p-10 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 
                className="text-5xl font-black mb-2 font-serif"
                style={{
                  transform: `scale(${0.98 + (breathIntensity * 0.02)})`,
                  transition: 'transform 0.3s ease'
                }}
              >
                🌐 Ecosystem Command Center
              </h1>
              <p className="text-xl text-purple-200">Three-Tier Brand Synchronization System</p>
            </div>
            <PulseCard
              variant="glow"
              intensity="high"
              className={`px-6 py-3 rounded-2xl border`}
              style={{
                borderColor: pulseColor,
                backgroundColor: `${pulseColor}22`
              }}
            >
              <div className="flex items-center gap-3">
                {syncStatus === 'synced' && <CheckCircle className="w-6 h-6" style={{ color: pulseColor }} />}
                {syncStatus === 'syncing' && <Activity className="w-6 h-6 animate-pulse" style={{ color: pulseColor }} />}
                <div>
                  <div className="text-sm font-bold text-white">
                    {syncStatus === 'synced' && 'All Systems Synced'}
                    {syncStatus === 'syncing' && 'Syncing...'}
                  </div>
                  <PulseIndicator size="sm" showLabel={false} showGrains={false} />
                </div>
              </div>
            </PulseCard>
          </div>

          {/* Master Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <PulseCard variant="glow" intensity="medium" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div 
                className="text-4xl font-black mb-2"
                style={{
                  color: pulseColor,
                  transform: `scale(${0.95 + (breathIntensity * 0.1)})`,
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? '...' : totalBrands.toLocaleString()}
              </div>
              <div className="text-sm text-gray-300 font-semibold">Total Brands</div>
              <div className="text-xs text-purple-200 mt-1">Across 3 Systems</div>
            </PulseCard>
            <PulseCard variant="default" intensity="low" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-black text-green-400 mb-2">{systems.length}</div>
              <div className="text-sm text-gray-300 font-semibold">Active Systems</div>
              <div className="text-xs text-purple-200 mt-1">100% Operational</div>
            </PulseCard>
            <PulseCard variant="default" intensity="low" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-black text-blue-400 mb-2">{pulsePhase}</div>
              <div className="text-sm text-gray-300 font-semibold">Pulse Phase</div>
              <div className="text-xs text-purple-200 mt-1">9s Engine</div>
            </PulseCard>
            <PulseCard variant="default" intensity="low" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-black text-purple-400 mb-2">{grainCount.toLocaleString()}</div>
              <div className="text-sm text-gray-300 font-semibold">Grain Count</div>
              <div className="text-xs text-purple-200 mt-1">Live Counter</div>
            </PulseCard>
          </div>
        </PulseCard>
      </div>

      {/* System Cards */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">System Status Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {systems.map((system, index) => (
            <PulseCard key={index} variant="premium" intensity="medium" className="overflow-hidden">
              <div 
                className={`bg-gradient-to-br ${system.gradient} p-6 text-white`}
                style={{
                  opacity: 0.9 + (breathIntensity * 0.1)
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="text-5xl"
                    style={{
                      transform: `scale(${0.95 + (breathIntensity * 0.1)})`,
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    {system.emoji}
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                    {system.tier}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{system.name}</h3>
                <div 
                  className="text-4xl font-black mb-2"
                  style={{
                    transform: `scale(${0.98 + (breathIntensity * 0.02)})`,
                    transition: 'transform 0.3s ease'
                  }}
                >
                  {loading ? '...' : system.brands.toLocaleString()}
                </div>
                <div className="text-sm opacity-90">Registered Brands</div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="flex items-center gap-2 text-sm font-bold" style={{ color: pulseColor }}>
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: pulseColor,
                          boxShadow: `0 0 ${10 * breathIntensity}px ${pulseColor}`,
                          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }}
                      ></div>
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pulse Second</span>
                    <span className="text-sm font-bold text-gray-900">{pulseSecond}/9</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sync Status</span>
                    <span className="text-sm font-bold text-gray-900">Live</span>
                  </div>
                </div>
              </div>
            </PulseCard>
          ))}
        </div>
      </div>

      {/* Integration Features */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Ecosystem Integration Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PulseCard variant="glow" intensity="medium" className="p-6">
            <div 
              className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4"
              style={{
                transform: `scale(${0.95 + (breathIntensity * 0.05)})`,
                transition: 'transform 0.3s ease'
              }}
            >
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ClaimRoot™</h3>
            <p className="text-sm text-gray-600">Authentication & verification across all systems</p>
          </PulseCard>
          
          <PulseCard variant="glow" intensity="medium" className="p-6">
            <div 
              className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mb-4"
              style={{
                transform: `scale(${0.95 + (breathIntensity * 0.05)})`,
                transition: 'transform 0.3s ease'
              }}
            >
              <Database className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">VaultPay™</h3>
            <p className="text-sm text-gray-600">Payment integration & processing</p>
          </PulseCard>
          
          <PulseCard variant="glow" intensity="medium" className="p-6">
            <div 
              className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4"
              style={{
                transform: `scale(${0.95 + (breathIntensity * 0.05)})`,
                transition: 'transform 0.3s ease'
              }}
            >
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">GhostTrace™</h3>
            <p className="text-sm text-gray-600">Security & encryption layer</p>
          </PulseCard>
          
          <PulseCard variant="glow" intensity="medium" className="p-6">
            <div 
              className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 mb-4"
              style={{
                transform: `scale(${0.95 + (breathIntensity * 0.05)})`,
                transition: 'transform 0.3s ease'
              }}
            >
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">GridCore™</h3>
            <p className="text-sm text-gray-600">Infrastructure management</p>
          </PulseCard>
        </div>
      </div>

      {/* Sync Timeline */}
      <PulseCard variant="premium" intensity="low" className="p-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Live Ecosystem Pulse</h2>
        <div className="space-y-6">
          <div 
            className="flex items-start gap-6 border-l-4 pl-6"
            style={{
              borderColor: pulseColor,
              transform: `translateX(${breathIntensity * 5}px)`,
              transition: 'all 0.3s ease'
            }}
          >
            <div className="flex-shrink-0">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${pulseColor}22`,
                  border: `2px solid ${pulseColor}`
                }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: pulseColor }} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">Ecosystem Synchronized</h3>
                <PulseIndicator size="sm" showLabel={false} showGrains={false} />
              </div>
              <p className="text-sm text-gray-600">{totalBrands} brands operational across {systems.length} systems</p>
            </div>
          </div>
          
          <div 
            className="flex items-start gap-6 border-l-4 border-green-500 pl-6"
            style={{
              opacity: 0.7 + (breathIntensity * 0.3)
            }}
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Database className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">Real-Time Data Feed</h3>
                <span className="text-sm text-gray-500">Phase: {pulsePhase}</span>
              </div>
              <p className="text-sm text-gray-600">All brand data sourced from live database</p>
            </div>
          </div>
          
          <div 
            className="flex items-start gap-6 border-l-4 border-blue-500 pl-6"
            style={{
              opacity: 0.7 + (breathIntensity * 0.3)
            }}
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">Global Pulse Active</h3>
                <span className="text-sm text-gray-500">Grain: {grainCount}</span>
              </div>
              <p className="text-sm text-gray-600">9s heartbeat synchronizing all ecosystem elements</p>
            </div>
          </div>
        </div>
      </PulseCard>
    </Layout>
  );
}
