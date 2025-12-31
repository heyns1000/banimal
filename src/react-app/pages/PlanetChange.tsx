import Layout from '@/react-app/components/Layout';
import { Leaf, TrendingDown, TrendingUp, Globe, Droplet, Wind, Recycle, CheckCircle, Target, Users, Zap } from 'lucide-react';
import { useState } from 'react';

export default function PlanetChange() {
  const [selectedZone, setSelectedZone] = useState<string>('global');

  const planetStats = {
    carbonOffset: 847000,
    treesPlanted: 2340000,
    plasticRecycled: 156000,
    waterSaved: 4200000,
    energySaved: 890000,
    impactScore: 94.7
  };

  const impactMetrics = [
    {
      title: 'Carbon Offset',
      value: '847K',
      unit: 'tons CO₂',
      change: '+23%',
      trend: 'down',
      icon: Leaf,
      color: 'from-green-500 to-emerald-600',
      description: 'Total carbon emissions offset across all operations'
    },
    {
      title: 'Trees Planted',
      value: '2.34M',
      unit: 'trees',
      change: '+67%',
      trend: 'up',
      icon: Globe,
      color: 'from-blue-500 to-cyan-600',
      description: 'Global reforestation initiative contributions'
    },
    {
      title: 'Plastic Recycled',
      value: '156K',
      unit: 'tons',
      change: '+42%',
      trend: 'up',
      icon: Recycle,
      color: 'from-purple-500 to-indigo-600',
      description: 'Plastic waste diverted from landfills and oceans'
    },
    {
      title: 'Water Conserved',
      value: '4.2M',
      unit: 'liters',
      change: '+31%',
      trend: 'up',
      icon: Droplet,
      color: 'from-cyan-500 to-blue-600',
      description: 'Fresh water saved through efficiency programs'
    },
    {
      title: 'Clean Energy',
      value: '890K',
      unit: 'MWh',
      change: '+54%',
      trend: 'up',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      description: 'Renewable energy generated and utilized'
    },
    {
      title: 'Impact Score',
      value: '94.7',
      unit: '/100',
      change: '+8.3',
      trend: 'up',
      icon: Target,
      color: 'from-pink-500 to-red-600',
      description: 'Overall planetary impact effectiveness rating'
    }
  ];

  const globalZones = [
    {
      name: 'North America',
      code: 'NA',
      carbonOffset: 234000,
      treesPlanted: 680000,
      participants: 1200000,
      status: 'excellent',
      emoji: '🇺🇸'
    },
    {
      name: 'Europe',
      code: 'EU',
      carbonOffset: 189000,
      treesPlanted: 520000,
      participants: 980000,
      status: 'excellent',
      emoji: '🇪🇺'
    },
    {
      name: 'Asia-Pacific',
      code: 'APAC',
      carbonOffset: 156000,
      treesPlanted: 450000,
      participants: 2100000,
      status: 'good',
      emoji: '🌏'
    },
    {
      name: 'Sub-Saharan Africa',
      code: 'SSA',
      carbonOffset: 98000,
      treesPlanted: 340000,
      participants: 1100000,
      status: 'growing',
      emoji: '🇿🇦'
    },
    {
      name: 'Latin America',
      code: 'LATAM',
      carbonOffset: 87000,
      treesPlanted: 230000,
      participants: 650000,
      status: 'good',
      emoji: '🇧🇷'
    },
    {
      name: 'Middle East',
      code: 'MENA',
      carbonOffset: 83000,
      treesPlanted: 120000,
      participants: 450000,
      status: 'growing',
      emoji: '🇦🇪'
    }
  ];

  const initiatives = [
    {
      name: 'Zero Waste Supply Chain',
      status: 'active',
      progress: 87,
      impact: 'High',
      participants: '847 companies',
      emoji: '♻️',
      description: 'Eliminating waste across global supply chain operations'
    },
    {
      name: 'Renewable Energy Transition',
      status: 'active',
      progress: 94,
      impact: 'Critical',
      participants: '1,203 facilities',
      emoji: '⚡',
      description: 'Converting to 100% renewable energy sources'
    },
    {
      name: 'Ocean Plastic Recovery',
      status: 'active',
      progress: 76,
      impact: 'High',
      participants: '234 coastal regions',
      emoji: '🌊',
      description: 'Removing plastic waste from oceans and waterways'
    },
    {
      name: 'Carbon Credit Marketplace',
      status: 'active',
      progress: 92,
      impact: 'Medium',
      participants: '5,678 organizations',
      emoji: '💰',
      description: 'Trading platform for verified carbon offset credits'
    },
    {
      name: 'Sustainable Agriculture',
      status: 'active',
      progress: 68,
      impact: 'High',
      participants: '12,340 farms',
      emoji: '🌱',
      description: 'Promoting regenerative farming practices globally'
    },
    {
      name: 'Green Transportation',
      status: 'expanding',
      progress: 81,
      impact: 'Critical',
      participants: '456 cities',
      emoji: '🚲',
      description: 'Electric vehicle adoption and public transit expansion'
    }
  ];

  const recentActions = [
    {
      timestamp: '5 minutes ago',
      action: 'Carbon offset certification',
      zone: 'EU',
      impact: '+2,340 tons CO₂',
      status: 'verified'
    },
    {
      timestamp: '12 minutes ago',
      action: 'Tree planting milestone',
      zone: 'SSA',
      impact: '+50,000 trees',
      status: 'complete'
    },
    {
      timestamp: '23 minutes ago',
      action: 'Plastic recycling processed',
      zone: 'APAC',
      impact: '+1,200 tons',
      status: 'verified'
    },
    {
      timestamp: '31 minutes ago',
      action: 'Water conservation target',
      zone: 'MENA',
      impact: '+180,000 liters',
      status: 'complete'
    },
    {
      timestamp: '47 minutes ago',
      action: 'Renewable energy milestone',
      zone: 'NA',
      impact: '+45,000 MWh',
      status: 'verified'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-12">
        <div className="premium-card p-10 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-black mb-3 font-serif flex items-center gap-4">
                🌍 Fruitful Planet Change
              </h1>
              <p className="text-xl text-green-200">Global Environmental Impact Tracking & Sustainability Dashboard</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20 text-center">
              <div className="text-4xl font-black text-green-400 mb-1">{planetStats.impactScore}</div>
              <div className="text-sm text-green-200">Impact Score</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-green-200 mb-1">Carbon Offset</div>
              <div className="text-2xl font-black">{(planetStats.carbonOffset / 1000).toFixed(0)}K</div>
              <div className="text-xs text-green-300">tons CO₂</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-green-200 mb-1">Trees Planted</div>
              <div className="text-2xl font-black">{(planetStats.treesPlanted / 1000000).toFixed(2)}M</div>
              <div className="text-xs text-green-300">globally</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-green-200 mb-1">Plastic Recycled</div>
              <div className="text-2xl font-black">{(planetStats.plasticRecycled / 1000).toFixed(0)}K</div>
              <div className="text-xs text-green-300">tons</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-green-200 mb-1">Water Saved</div>
              <div className="text-2xl font-black">{(planetStats.waterSaved / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-green-300">liters</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-green-200 mb-1">Clean Energy</div>
              <div className="text-2xl font-black">{(planetStats.energySaved / 1000).toFixed(0)}K</div>
              <div className="text-xs text-green-300">MWh</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-green-200 mb-1">Zones Active</div>
              <div className="text-2xl font-black">12</div>
              <div className="text-xs text-green-300">global</div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Metrics Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Environmental Impact Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
            return (
              <div key={index} className="premium-card p-6">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${metric.color} mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{metric.title}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="text-4xl font-black text-gray-900">{metric.value}</div>
                  <div className="text-lg text-gray-600">{metric.unit}</div>
                </div>
                <div className={`flex items-center gap-2 mb-3 ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="font-bold text-sm">{metric.change} this quarter</span>
                </div>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Zones */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">Global Impact Zones</h2>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none font-medium"
          >
            <option value="global">All Zones</option>
            {globalZones.map(z => <option key={z.code} value={z.code}>{z.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {globalZones
            .filter(z => selectedZone === 'global' || z.code === selectedZone)
            .map((zone, index) => (
            <div key={index} className="premium-card overflow-hidden">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{zone.emoji}</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    zone.status === 'excellent' ? 'bg-green-500/20 border border-green-400' :
                    zone.status === 'good' ? 'bg-blue-500/20 border border-blue-400' :
                    'bg-yellow-500/20 border border-yellow-400'
                  }`}>
                    {zone.status === 'excellent' ? '⭐ Excellent' :
                     zone.status === 'good' ? '✓ Good' : '📈 Growing'}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{zone.name}</h3>
                <div className="text-sm opacity-90">{zone.code} Zone</div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Carbon Offset</div>
                    <div className="text-xl font-black text-gray-900">{(zone.carbonOffset / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">tons CO₂</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Trees</div>
                    <div className="text-xl font-black text-gray-900">{(zone.treesPlanted / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">planted</div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600">Active Participants</span>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{(zone.participants / 1000000).toFixed(1)}M</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Initiatives */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Global Initiatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((initiative, index) => (
            <div key={index} className="premium-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{initiative.emoji}</div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  initiative.status === 'active' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {initiative.status === 'active' ? '🟢 Active' : '📈 Expanding'}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{initiative.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{initiative.description}</p>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-gray-900">{initiative.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${initiative.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Impact</div>
                  <div className="font-bold text-gray-900">{initiative.impact}</div>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Participants</div>
                  <div className="font-bold text-gray-900">{initiative.participants}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Actions */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Recent Impact Actions</h2>
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Zone</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Impact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentActions.map((action, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {action.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{action.action}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        {action.zone}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">{action.impact}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-600 capitalize">{action.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Repository Integration */}
      <div className="premium-card p-10 bg-gradient-to-br from-green-900 to-emerald-900 text-white">
        <div className="flex items-start gap-6 mb-8">
          <div className="flex-shrink-0 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl">
            🌍
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-3 font-serif">Connected Repository</h2>
            <p className="text-lg text-green-200 mb-4">
              Real-time environmental data synchronization from FruitfulPlanetChange repository
            </p>
            <div className="bg-black/30 p-4 rounded-xl font-mono text-sm break-all">
              git@github.com:Fruitful-Global-Planet/FruitfulPlanetChange.git
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <Wind className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Live Impact Tracking</h3>
            <p className="text-sm text-green-200">Real-time environmental metrics updated every 5 minutes</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <Globe className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">12 Global Zones</h3>
            <p className="text-sm text-green-200">Comprehensive coverage across all major regions</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <CheckCircle className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Verified Impact</h3>
            <p className="text-sm text-green-200">Third-party certification of all environmental claims</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
