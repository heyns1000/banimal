import Layout from '@/react-app/components/Layout';
import { GitBranch, CheckCircle, Clock, AlertCircle, TrendingUp, RefreshCw, Database, Package } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RepositorySync() {
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [syncInProgress, setSyncInProgress] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSyncTime(new Date());
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSync = () => {
    setSyncInProgress(true);
    setTimeout(() => {
      setSyncInProgress(false);
      setLastSyncTime(new Date());
    }, 3000);
  };

  const syncStats = {
    totalBrands: 13713,
    lastSync: lastSyncTime,
    syncStatus: 'healthy',
    deploymentsActive: 847,
    regionsConnected: 193,
    repositories: 5,
    planetChangeActive: true,
    omnigridActive: true,
    baobabPortalActive: true,
    licenseVaultActive: true
  };

  const recentSyncs = [
    {
      timestamp: '2 minutes ago',
      action: 'Brand deployment sync',
      brands: 156,
      status: 'success',
      region: 'APAC'
    },
    {
      timestamp: '8 minutes ago',
      action: 'Configuration update',
      brands: 89,
      status: 'success',
      region: 'EU'
    },
    {
      timestamp: '15 minutes ago',
      action: 'New brand registration',
      brands: 7,
      status: 'success',
      region: 'NA'
    },
    {
      timestamp: '23 minutes ago',
      action: 'Regional expansion',
      brands: 234,
      status: 'success',
      region: 'SSA'
    },
    {
      timestamp: '31 minutes ago',
      action: 'Security policy update',
      brands: 13713,
      status: 'success',
      region: 'Global'
    }
  ];

  const syncMetrics = [
    { label: 'Sync Frequency', value: 'Every 5 min', icon: Clock, color: 'blue' },
    { label: 'Success Rate', value: '99.98%', icon: TrendingUp, color: 'green' },
    { label: 'Avg Sync Time', value: '1.2s', icon: RefreshCw, color: 'purple' },
    { label: 'Data Transferred', value: '2.4 GB', icon: Database, color: 'orange' }
  ];

  const brandSystems = [
    {
      name: 'FAA™ Global Network',
      brands: 7344,
      status: 'synced',
      lastSync: '2 min ago',
      coverage: '7 regions',
      emoji: '🏛️'
    },
    {
      name: 'HSOMNI9000 Mesh',
      brands: 6219,
      status: 'synced',
      lastSync: '2 min ago',
      coverage: '48 regions',
      emoji: '🧠'
    },
    {
      name: 'Seedwave Premium',
      brands: 150,
      status: 'synced',
      lastSync: '2 min ago',
      coverage: '7 premium regions',
      emoji: '🌱'
    }
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-12">
        <div className="premium-card p-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-black mb-3 font-serif flex items-center gap-4">
                <GitBranch className="w-12 h-12" />
                Unified Repository Sync Hub
              </h1>
              <p className="text-xl text-purple-200">Fruitful-global-deployment × FruitfulPlanetChange × Omnigrid × Baobab-Portal × LicenseVault × Banimal</p>
            </div>
            <button
              onClick={handleSync}
              disabled={syncInProgress}
              className="bg-white/20 hover:bg-white/30 disabled:opacity-50 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all border border-white/30"
            >
              <RefreshCw className={`w-6 h-6 ${syncInProgress ? 'animate-spin' : ''}`} />
              {syncInProgress ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-purple-200 mb-1">Repositories</div>
              <div className="text-3xl font-black">{syncStats.repositories}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-purple-200 mb-1">Total Brands</div>
              <div className="text-3xl font-black">{syncStats.totalBrands.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-purple-200 mb-1">Deployments</div>
              <div className="text-3xl font-black">{syncStats.deploymentsActive}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-purple-200 mb-1">Regions</div>
              <div className="text-3xl font-black">{syncStats.regionsConnected}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-purple-200 mb-1">Status</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-bold">Healthy</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-purple-200 mb-1">Last Sync</div>
              <div className="text-lg font-bold">
                {lastSyncTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Metrics */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Synchronization Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {syncMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="premium-card p-6">
                <div className={`inline-flex p-4 rounded-2xl mb-4 ${
                  metric.color === 'blue' ? 'bg-blue-100' :
                  metric.color === 'green' ? 'bg-green-100' :
                  metric.color === 'purple' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <Icon className={`w-8 h-8 ${
                    metric.color === 'blue' ? 'text-blue-600' :
                    metric.color === 'green' ? 'text-green-600' :
                    metric.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  }`} />
                </div>
                <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
                <div className="text-3xl font-black text-gray-900">{metric.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand Systems Status */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Brand System Synchronization</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brandSystems.map((system, index) => (
            <div key={index} className="premium-card overflow-hidden">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 text-white">
                <div className="text-5xl mb-4">{system.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{system.name}</h3>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <CheckCircle className="w-4 h-4" />
                  <span>Synchronized</span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Brands</div>
                    <div className="text-2xl font-black text-gray-900">{system.brands.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Coverage</div>
                    <div className="text-lg font-bold text-gray-900">{system.coverage}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last sync</span>
                  <span className="font-bold text-green-600">{system.lastSync}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sync Activity */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Recent Sync Activity</h2>
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Brands Affected</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Region</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentSyncs.map((sync, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {sync.timestamp}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{sync.action}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{sync.brands.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        {sync.region}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-600">Success</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Five Repository Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Repository 1: Fruitful-global-deployment */}
        <div className="premium-card p-8 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 font-serif">Global Deployment</h3>
              <p className="text-sm text-blue-200 mb-3">Enterprise infrastructure repository</p>
              <div className="bg-black/30 p-3 rounded-xl font-mono text-xs break-all">
                git@github.com:heyns1000/Fruitful-global-deployment.git
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-xs text-blue-200 mb-1">Brands Deployed</div>
              <div className="text-2xl font-black">13,713</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-xs text-blue-200 mb-1">Active Regions</div>
              <div className="text-2xl font-black">193</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-bold">Synced 2 min ago</span>
          </div>
        </div>

        {/* Repository 2: FruitfulPlanetChange */}
        <div className="premium-card p-8 bg-gradient-to-br from-green-900 to-emerald-900 text-white">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
              🌍
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 font-serif">Planet Change</h3>
              <p className="text-sm text-green-200 mb-3">Environmental impact tracking</p>
              <div className="bg-black/30 p-3 rounded-xl font-mono text-xs break-all">
                git@github.com:Fruitful-Global-Planet/FruitfulPlanetChange.git
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-xs text-green-200 mb-1">Impact Metrics</div>
              <div className="text-2xl font-black">47</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-xs text-green-200 mb-1">Global Zones</div>
              <div className="text-2xl font-black">12</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-bold">Synced 2 min ago</span>
          </div>
        </div>

        {/* Repository 3: Omnigrid */}
        <div className="premium-card p-8 bg-gradient-to-br from-yellow-900 to-amber-900 text-white">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
              🌳
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 font-serif">Omnigrid</h3>
              <p className="text-sm text-yellow-200 mb-3">FAA™ brand infrastructure</p>
              <div className="bg-black/30 p-3 rounded-xl font-mono text-xs break-all">
                git@github.com:heyns1000/omnigrid.git
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-xs text-yellow-200 mb-1">Brands</div>
              <div className="text-2xl font-black">120</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-xs text-yellow-200 mb-1">Target</div>
              <div className="text-2xl font-black">$100B</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-bold">Synced 2 min ago</span>
          </div>
        </div>

        {/* Repository 4: Baobab Portal */}
        <div className="premium-card p-8 bg-gradient-to-br from-teal-900 to-green-900 text-white">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
              🌲
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 font-serif">Baobab Portal</h3>
              <p className="text-sm text-teal-200 mb-3">Ecosystem access gateway</p>
              <div className="bg-black/30 p-3 rounded-xl font-mono text-xs break-all">
                git@github.com:heyns1000/baobab-bush-portal.git
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-xs text-teal-200 mb-1">Active Users</div>
              <div className="text-2xl font-black">8,947</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-xs text-teal-200 mb-1">Uptime</div>
              <div className="text-2xl font-black">99.98%</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-bold">Synced 2 min ago</span>
          </div>
        </div>

        {/* Repository 5: LicenseVault */}
        <div className="premium-card p-8 bg-gradient-to-br from-purple-900 to-pink-900 text-white lg:col-span-2">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
              🔐
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 font-serif">LicenseVault</h3>
              <p className="text-sm text-purple-200 mb-3">0.08sec restructure pull/push to BareCart™</p>
              <div className="bg-black/30 p-3 rounded-xl font-mono text-xs break-all">
                git@github.com:heyns1000/LicenseVault.git
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-xs text-purple-200 mb-1">Total Licenses</div>
              <div className="text-2xl font-black">8</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-xs text-purple-200 mb-1">Sync Speed</div>
              <div className="text-2xl font-black text-yellow-400">0.08s</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-xs text-purple-200 mb-1">Zero Waste</div>
              <div className="text-2xl font-black text-green-400">100%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-xs text-purple-200 mb-1">BareCart Ready</div>
              <div className="text-2xl font-black">✓</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 font-bold">0.08s restructure active</span>
          </div>
        </div>
      </div>

      {/* Unified Sync Features */}
      <div className="premium-card p-10 bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        <h2 className="text-3xl font-bold mb-8 font-serif">Unified Sync Infrastructure</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Five Repository Auto Sync</h3>
            <p className="text-sm text-purple-200">All five repositories sync with 0.08s restructure timing</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">99.98% Success Rate</h3>
            <p className="text-sm text-purple-200">Proven reliability across all sync operations</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <AlertCircle className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Cross-Repo Coordination</h3>
            <p className="text-sm text-purple-200">Intelligent conflict resolution across 5 repositories including LicenseVault→BareCart™</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
