import Layout from '@/react-app/components/Layout';
import { Globe, Rocket, TrendingUp, MapPin, Users, Package, Zap, Shield, Database, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function GlobalDeployment() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const deploymentStats = {
    totalDeployments: 847,
    activeRegions: 193,
    totalUsers: '5.2B',
    uptime: '99.99%',
    brandsDeployed: 13713,
    dailyTransactions: '2.4M'
  };

  const regions = [
    { 
      code: 'NA', 
      name: 'North America', 
      deployments: 247, 
      brands: 4200, 
      users: '580M',
      status: 'operational',
      emoji: '🇺🇸',
      growth: '+18%'
    },
    { 
      code: 'EU', 
      name: 'Europe', 
      deployments: 189, 
      brands: 3100, 
      users: '741M',
      status: 'operational',
      emoji: '🇪🇺',
      growth: '+24%'
    },
    { 
      code: 'APAC', 
      name: 'Asia-Pacific', 
      deployments: 156, 
      brands: 2800, 
      users: '2.1B',
      status: 'operational',
      emoji: '🌏',
      growth: '+31%'
    },
    { 
      code: 'MENA', 
      name: 'Middle East & North Africa', 
      deployments: 98, 
      brands: 1400, 
      users: '450M',
      status: 'operational',
      emoji: '🇦🇪',
      growth: '+42%'
    },
    { 
      code: 'SSA', 
      name: 'Sub-Saharan Africa', 
      deployments: 87, 
      brands: 1200, 
      users: '1.1B',
      status: 'expanding',
      emoji: '🇿🇦',
      growth: '+67%'
    },
    { 
      code: 'LATAM', 
      name: 'Latin America', 
      deployments: 70, 
      brands: 1013, 
      users: '650M',
      status: 'operational',
      emoji: '🇧🇷',
      growth: '+29%'
    }
  ];

  const deploymentPipeline = [
    {
      stage: 'Repository Sync',
      status: 'complete',
      items: 13713,
      description: 'All brands synced from Fruitful-global-deployment',
      icon: Database,
      color: 'green'
    },
    {
      stage: 'Global Distribution',
      status: 'active',
      items: 847,
      description: 'Active deployments across 193 countries',
      icon: Globe,
      color: 'blue'
    },
    {
      stage: 'Regional Scaling',
      status: 'active',
      items: 6,
      description: 'Multi-region infrastructure expansion',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      stage: 'User Onboarding',
      status: 'active',
      items: 5200000000,
      description: '5.2B users connected globally',
      icon: Users,
      color: 'orange'
    }
  ];

  const integrationFeatures = [
    {
      name: 'FAA™ Global Network',
      brands: 7344,
      regions: 7,
      status: 'Deployed',
      emoji: '🏛️',
      color: 'from-yellow-500 to-amber-600'
    },
    {
      name: 'HSOMNI9000 Mesh',
      brands: 6219,
      regions: 48,
      status: 'Active',
      emoji: '🧠',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      name: 'Seedwave Premium',
      brands: 150,
      regions: 7,
      status: 'Premium',
      emoji: '🌱',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Fruitful Repository',
      brands: 13713,
      regions: 193,
      status: 'Synced',
      emoji: '🌍',
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-12">
        <div className="premium-card p-10 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-black mb-3 font-serif">🌍 Global Deployment Command</h1>
              <p className="text-xl text-purple-200">Fruitful-Global-Deployment × Banimal Ecosystem Integration</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20">
              <div className="text-4xl font-black text-green-400 mb-1">{deploymentStats.uptime}</div>
              <div className="text-sm text-purple-200">System Uptime</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-black text-white mb-1">{deploymentStats.totalDeployments}</div>
              <div className="text-xs text-purple-200">Deployments</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-black text-white mb-1">{deploymentStats.activeRegions}</div>
              <div className="text-xs text-purple-200">Countries</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-black text-white mb-1">{deploymentStats.totalUsers}</div>
              <div className="text-xs text-purple-200">Global Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-black text-white mb-1">{deploymentStats.brandsDeployed.toLocaleString()}</div>
              <div className="text-xs text-purple-200">Brands Live</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-black text-white mb-1">{deploymentStats.dailyTransactions}</div>
              <div className="text-xs text-purple-200">Daily Txns</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-black text-green-400 mb-1">152%</div>
              <div className="text-xs text-purple-200">Target Hit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Pipeline */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Deployment Pipeline Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deploymentPipeline.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div key={index} className="premium-card p-6">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${
                  stage.color === 'green' ? 'from-green-500 to-emerald-600' :
                  stage.color === 'blue' ? 'from-blue-500 to-cyan-600' :
                  stage.color === 'purple' ? 'from-purple-500 to-pink-600' :
                  'from-orange-500 to-red-600'
                } mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{stage.stage}</h3>
                <div className="text-3xl font-black text-gray-900 mb-2">{stage.items.toLocaleString()}</div>
                <p className="text-sm text-gray-600 mb-4">{stage.description}</p>
                <div className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                  stage.status === 'complete' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {stage.status === 'complete' ? '✓ Complete' : '⚡ Active'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regional Deployment Map */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">Regional Deployment Matrix</h2>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none font-medium"
          >
            <option value="all">All Regions</option>
            {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions
            .filter(r => selectedRegion === 'all' || r.code === selectedRegion)
            .map((region, index) => (
            <div key={index} className="premium-card overflow-hidden">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{region.emoji}</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    region.status === 'operational' ? 'bg-green-500/20 border border-green-400' :
                    'bg-yellow-500/20 border border-yellow-400'
                  }`}>
                    {region.status === 'operational' ? '✓ Operational' : '📈 Expanding'}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{region.name}</h3>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <MapPin className="w-4 h-4" />
                  <span>{region.code} Region</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Deployments</div>
                    <div className="text-2xl font-black text-gray-900">{region.deployments}</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Brands</div>
                    <div className="text-2xl font-black text-gray-900">{region.brands.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">User Base</span>
                    <span className="text-lg font-black text-gray-900">{region.users}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Growth Rate</span>
                    <span className="text-lg font-black text-green-600">{region.growth}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Infrastructure</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Features */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">System Integration Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrationFeatures.map((feature, index) => (
            <div key={index} className="premium-card p-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-4xl mb-4`}>
                {feature.emoji}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.name}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Brands</span>
                  <span className="text-sm font-bold text-gray-900">{feature.brands.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Coverage</span>
                  <span className="text-sm font-bold text-gray-900">{feature.regions} regions</span>
                </div>
              </div>
              <div className={`px-3 py-2 rounded-lg text-center text-xs font-bold ${
                feature.status === 'Deployed' ? 'bg-green-100 text-green-700' :
                feature.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                feature.status === 'Premium' ? 'bg-purple-100 text-purple-700' :
                'bg-cyan-100 text-cyan-700'
              }`}>
                {feature.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Repository Integration */}
      <div className="premium-card p-10 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="flex items-start gap-6 mb-8">
          <div className="flex-shrink-0 w-20 h-20 gradient-purple rounded-2xl flex items-center justify-center text-4xl">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-serif">Fruitful-Global-Deployment Integration</h2>
            <p className="text-lg text-gray-600 mb-6">
              Complete synchronization with GitHub repository providing enterprise-scale deployment infrastructure for all 13,713 brands across 193 countries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">Repository Sync</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Real-time brand updates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Automated deployments</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Version control</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Performance</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>99.99% uptime guaranteed</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Global CDN distribution</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Auto-scaling infrastructure</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Security</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>End-to-end encryption</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Multi-region backups</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>SOC 2 compliant</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">🚀 Repository Status: SYNCED</h3>
              <p className="text-purple-100">Connected to git@github.com:heyns1000/Fruitful-global-deployment.git</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black mb-1">13,713</div>
              <div className="text-sm opacity-90">Brands Deployed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Explosive Growth Model */}
      <div className="gradient-gold p-10 rounded-3xl text-gray-900">
        <h2 className="text-4xl font-black mb-6 font-serif text-center">💥 The Explosive Growth Model</h2>
        <p className="text-xl text-center mb-10 opacity-80">
          Combining Fruitful Repository infrastructure with Banimal's three-tier ecosystem for unprecedented global scale
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl">
            <div className="text-5xl mb-4 text-center">🌱</div>
            <h3 className="text-2xl font-bold mb-3 text-center">Foundation</h3>
            <p className="text-center text-gray-700 mb-4">13,713 brands across 3 systems ready for deployment</p>
            <div className="text-center font-bold text-purple-600">152% Target Achievement</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl">
            <div className="text-5xl mb-4 text-center">🚀</div>
            <h3 className="text-2xl font-bold mb-3 text-center">Distribution</h3>
            <p className="text-center text-gray-700 mb-4">847 deployments across 193 countries globally</p>
            <div className="text-center font-bold text-blue-600">5.2B Users Connected</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl">
            <div className="text-5xl mb-4 text-center">💎</div>
            <h3 className="text-2xl font-bold mb-3 text-center">Domination</h3>
            <p className="text-center text-gray-700 mb-4">Global infrastructure with 99.99% uptime</p>
            <div className="text-center font-bold text-green-600">2.4M Daily Transactions</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
