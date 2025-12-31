import Layout from '@/react-app/components/Layout';
import { Zap, Database, Cpu, Grid3x3, Activity, Radio, Waves, GitBranch } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function OmnigridEngine() {
  const [pulseActive, setPulseActive] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const [intakeProgress, setIntakeProgress] = useState(0);
  const [latticeBuilding, setLatticeBuilding] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'intake' | 'vortex' | 'lattice' | 'complete'>('idle');

  useEffect(() => {
    if (pulseActive) {
      const interval = setInterval(() => {
        setPulseCount(prev => prev + 1);
      }, 9000); // 9-second pulse
      return () => clearInterval(interval);
    }
  }, [pulseActive]);

  const startEngine = () => {
    setPulseActive(true);
    setCurrentPhase('intake');
    
    // Simulate intake progression
    let progress = 0;
    const intakeInterval = setInterval(() => {
      progress += 2;
      setIntakeProgress(progress);
      
      if (progress >= 100) {
        clearInterval(intakeInterval);
        setCurrentPhase('vortex');
        
        setTimeout(() => {
          setCurrentPhase('lattice');
          setLatticeBuilding(true);
          
          setTimeout(() => {
            setCurrentPhase('complete');
            setLatticeBuilding(false);
          }, 5000);
        }, 3000);
      }
    }, 200);
  };

  const engineStats = {
    totalBrands: 13713,
    systems: 3,
    repositories: 80,
    pulseInterval: 9,
    dataPoints: 21000000,
    latticeNodes: 10000,
    vortexActive: true,
    dimensions: 40
  };

  const systems = [
    {
      name: 'FAA™ System',
      brands: 7344,
      status: 'syncing',
      tier: 'Sovereign',
      gradient: 'from-yellow-600 to-amber-700',
      emoji: '🏛️'
    },
    {
      name: 'HSOMNI9000',
      brands: 6219,
      status: 'syncing',
      tier: 'Infinite',
      gradient: 'from-purple-600 to-indigo-700',
      emoji: '🧠'
    },
    {
      name: 'Seedwave Premium',
      brands: 150,
      status: 'syncing',
      tier: 'Verified',
      gradient: 'from-green-600 to-emerald-700',
      emoji: '🌱'
    }
  ];

  const repositories = [
    { name: 'Fruitful-global-deployment', files: 1065, status: 'active' },
    { name: 'FruitfulPlanetChange', files: 847, status: 'active' },
    { name: 'omnigrid', files: 1234, status: 'active' },
    { name: 'baobab-bush-portal', files: 956, status: 'active' },
    { name: 'Banimal Ecosystem', files: 2341, status: 'active' }
  ];

  const latticeMetrics = [
    {
      title: 'Cube Lattice Nodes',
      value: '10,000',
      icon: Grid3x3,
      color: 'blue',
      status: latticeBuilding ? 'building' : 'ready'
    },
    {
      title: 'Vortex Ant Distance',
      value: '0.08',
      icon: Waves,
      color: 'purple',
      status: currentPhase === 'vortex' ? 'active' : 'ready'
    },
    {
      title: 'Data Intake Rate',
      value: '2.4M/s',
      icon: Database,
      color: 'green',
      status: currentPhase === 'intake' ? 'active' : 'ready'
    },
    {
      title: '9s Pulse Count',
      value: pulseCount.toString(),
      icon: Activity,
      color: 'red',
      status: pulseActive ? 'active' : 'idle'
    }
  ];

  const phases = [
    { name: 'Intake', key: 'intake', desc: 'Global AI interstellar data intake', duration: '0-30s' },
    { name: 'Vortex', key: 'vortex', desc: 'Ant vortex 0.08 short distance processing', duration: '30-40s' },
    { name: 'Lattice', key: 'lattice', desc: 'Cube lattice construction (millions of pages)', duration: '40-50s' },
    { name: 'Complete', key: 'complete', desc: 'Grok engine filtering & belief activation', duration: '50s+' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-12">
        <div className="premium-card p-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-block px-4 py-1 border border-blue-400/50 rounded-full text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
                RESPITORY v∞ — NEXUS_NAIR ACTIVATED
              </div>
              <h1 className="text-5xl font-black mb-3 font-serif flex items-center gap-4">
                <Cpu className="w-12 h-12 animate-pulse" />
                Omnigrid Data Engine
              </h1>
              <p className="text-xl text-purple-200">
                9s Pulse • 13,713 Brands • 40D Lattice • Infinite Sovereignty
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={startEngine}
                disabled={pulseActive}
                className={`px-10 py-5 rounded-2xl font-black text-lg transition-all ${
                  pulseActive
                    ? 'bg-green-500/20 border-2 border-green-500 text-green-400 cursor-not-allowed'
                    : 'gradient-gold text-gray-900 hover:shadow-2xl transform hover:scale-105'
                }`}
              >
                {pulseActive ? (
                  <span className="flex items-center gap-3">
                    <Radio className="w-6 h-6 animate-pulse" />
                    ENGINE ACTIVE
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Zap className="w-6 h-6" />
                    START OMNIGRID
                  </span>
                )}
              </button>
              {pulseActive && (
                <div className="mt-3 text-sm text-blue-300">
                  Next pulse in: {9 - (pulseCount % 9)}s
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-purple-200 mb-1">Total Brands</div>
              <div className="text-3xl font-black">{engineStats.totalBrands.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-purple-200 mb-1">Repositories</div>
              <div className="text-3xl font-black">{engineStats.repositories}+</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-purple-200 mb-1">Pulse Interval</div>
              <div className="text-3xl font-black">{engineStats.pulseInterval}s</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-purple-200 mb-1">Dimensions</div>
              <div className="text-3xl font-black">{engineStats.dimensions}D</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Phase */}
      {currentPhase !== 'idle' && (
        <div className="mb-12">
          <div className="premium-card p-8 bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Engine Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {phases.map((phase) => (
                <div
                  key={phase.key}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    currentPhase === phase.key
                      ? 'border-blue-600 bg-blue-100 shadow-lg scale-105'
                      : phase.key === 'intake' ? 'border-gray-300 bg-white opacity-50'
                      : phase.key === 'vortex' && (currentPhase === 'vortex' || currentPhase === 'lattice' || currentPhase === 'complete')
                        ? 'border-green-500 bg-green-50'
                      : phase.key === 'lattice' && (currentPhase === 'lattice' || currentPhase === 'complete')
                        ? 'border-green-500 bg-green-50'
                      : phase.key === 'complete' && currentPhase === 'complete'
                        ? 'border-green-600 bg-green-100'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-xl font-bold mb-2 ${
                      currentPhase === phase.key ? 'text-blue-700' : 'text-gray-900'
                    }`}>
                      {phase.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{phase.desc}</div>
                    <div className="text-xs font-mono text-gray-500">{phase.duration}</div>
                    {currentPhase === phase.key && (
                      <div className="mt-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full mx-auto animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {currentPhase === 'intake' && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700">Intake Progress</span>
                  <span className="text-sm font-mono text-gray-900">{intakeProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${intakeProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lattice Metrics */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Lattice Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latticeMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="premium-card p-6">
                <div className={`inline-flex p-4 rounded-2xl mb-4 ${
                  metric.color === 'blue' ? 'bg-blue-100' :
                  metric.color === 'purple' ? 'bg-purple-100' :
                  metric.color === 'green' ? 'bg-green-100' :
                  'bg-red-100'
                }`}>
                  <Icon className={`w-8 h-8 ${
                    metric.color === 'blue' ? 'text-blue-600' :
                    metric.color === 'purple' ? 'text-purple-600' :
                    metric.color === 'green' ? 'text-green-600' :
                    'text-red-600'
                  } ${metric.status === 'active' ? 'animate-pulse' : ''}`} />
                </div>
                <div className="text-sm text-gray-600 mb-2">{metric.title}</div>
                <div className="text-4xl font-black text-gray-900 mb-2">{metric.value}</div>
                <div className={`text-xs font-bold uppercase ${
                  metric.status === 'active' ? 'text-green-600' :
                  metric.status === 'building' ? 'text-blue-600' :
                  metric.status === 'ready' ? 'text-gray-600' :
                  'text-gray-400'
                }`}>
                  {metric.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Systems Sync */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">System Synchronization</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systems.map((system, index) => (
            <div key={index} className="premium-card overflow-hidden">
              <div className={`bg-gradient-to-br ${system.gradient} p-6 text-white`}>
                <div className="text-5xl mb-4">{system.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{system.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  {pulseActive && (
                    <>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>{system.status}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Brands</div>
                    <div className="text-2xl font-black text-gray-900">{system.brands.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Tier</div>
                    <div className="text-lg font-bold text-gray-900">{system.tier}</div>
                  </div>
                </div>
                {pulseActive && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse w-full" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Repository Integration */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Repository Intake (80+ Systems)</h2>
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Repository</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Files</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {repositories.map((repo, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{repo.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{repo.files.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        {repo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pulseActive ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-bold text-green-600">Every 9s</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Idle</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Core Protocols */}
      <div className="premium-card p-10 bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
        <h2 className="text-3xl font-bold mb-8 font-serif">Core Protocols Active</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <Zap className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">PulseTrade™</h3>
            <p className="text-sm text-purple-200">9-second heartbeat synchronization across all systems</p>
            <div className="mt-4 text-2xl font-black text-yellow-400">{pulseCount} pulses</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <Grid3x3 className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Cube Lattice</h3>
            <p className="text-sm text-purple-200">Multi-dimensional data organization structure</p>
            <div className="mt-4 text-2xl font-black text-blue-400">10,000 nodes</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <Waves className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Vortex Ant™</h3>
            <p className="text-sm text-purple-200">0.08 short distance bio-inspired routing</p>
            <div className="mt-4 text-2xl font-black text-purple-400">Active</div>
          </div>
        </div>

        <div className="mt-10 p-6 bg-white/5 rounded-2xl border-2 border-yellow-500/30">
          <div className="text-center">
            <div className="text-sm text-yellow-400 mb-2 font-mono">瓷勺旋渦已築, 脈買已通, 華夏復興, 震驚寰字!</div>
            <div className="text-xs text-purple-200">
              The ceramic spoon vortex is built • The pulse trade is connected
            </div>
            <div className="mt-4 text-2xl font-serif italic text-white">
              One empire. One breath. Infinite sovereignty.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
