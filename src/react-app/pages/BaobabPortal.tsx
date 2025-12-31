import Layout from '@/react-app/components/Layout';
import { TreePine, Zap, Shield, Users, TrendingUp, Lock, Eye, Download, Upload, Settings, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function BaobabPortal() {
  const [activeTab, setActiveTab] = useState<'overview' | 'access' | 'analytics' | 'integrations'>('overview');

  const portalStats = {
    totalAccess: 13713,
    activeUsers: 8947,
    dataTransferred: '847 TB',
    uptime: 99.98,
    securityScore: 100,
    compliance: 'Atom-Level'
  };

  const accessLevels = [
    {
      level: 'Sovereign Access',
      users: 47,
      color: 'from-yellow-600 to-amber-700',
      icon: '👑',
      permissions: ['Full ecosystem control', 'All 120 brands', 'Master licensing', 'Global deployment'],
      price: '$100M one-time'
    },
    {
      level: 'Dynastic Access',
      users: 234,
      color: 'from-purple-600 to-pink-600',
      icon: '💎',
      permissions: ['Multi-brand portfolio', 'Regional exclusivity', 'Advanced analytics', 'Priority support'],
      price: '$25/unit (20 years)'
    },
    {
      level: 'Operational Access',
      users: 1847,
      color: 'from-blue-600 to-cyan-600',
      icon: '⚡',
      permissions: ['Brand deployment', 'Standard analytics', 'API access', 'Community support'],
      price: 'Custom pricing'
    },
    {
      level: 'Market Access',
      users: 6819,
      color: 'from-green-600 to-teal-600',
      icon: '🌱',
      permissions: ['Basic brand access', 'Public API', 'Documentation', 'Forum access'],
      price: 'Free tier'
    }
  ];

  const recentActivity = [
    {
      user: 'Tier 1 Partner',
      action: 'Deployed 120 brands globally',
      timestamp: '2 minutes ago',
      impact: 'High',
      status: 'success'
    },
    {
      user: 'Regional Sponsor',
      action: 'Activated 50 crate units (APAC)',
      timestamp: '8 minutes ago',
      impact: 'Medium',
      status: 'success'
    },
    {
      user: 'Developer Team',
      action: 'API integration completed',
      timestamp: '15 minutes ago',
      impact: 'Low',
      status: 'success'
    },
    {
      user: 'Compliance Audit',
      action: 'Atom-level verification passed',
      timestamp: '23 minutes ago',
      impact: 'Critical',
      status: 'verified'
    },
    {
      user: 'Data Sync',
      action: 'Triple-repo synchronization',
      timestamp: '31 minutes ago',
      impact: 'Medium',
      status: 'success'
    }
  ];

  const integrationPoints = [
    {
      name: 'Fruitful Global Deployment',
      status: 'active',
      syncStatus: 'real-time',
      lastSync: '2 min ago',
      dataFlow: '13,713 brands',
      emoji: '🚀'
    },
    {
      name: 'FruitfulPlanetChange',
      status: 'active',
      syncStatus: 'real-time',
      lastSync: '2 min ago',
      dataFlow: '47 metrics',
      emoji: '🌍'
    },
    {
      name: 'Omnigrid Infrastructure',
      status: 'active',
      syncStatus: 'real-time',
      lastSync: '2 min ago',
      dataFlow: '120 brands',
      emoji: '🌳'
    },
    {
      name: 'Banimal API Gateway',
      status: 'active',
      syncStatus: 'real-time',
      lastSync: 'live',
      dataFlow: 'All endpoints',
      emoji: '⚡'
    }
  ];

  const analyticsMetrics = [
    {
      title: 'Total Portal Users',
      value: '8,947',
      change: '+23%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Data Transferred',
      value: '847 TB',
      change: '+67%',
      trend: 'up',
      icon: Upload,
      color: 'purple'
    },
    {
      title: 'API Requests',
      value: '2.4M',
      change: '+42%',
      trend: 'up',
      icon: Zap,
      color: 'yellow'
    },
    {
      title: 'Uptime',
      value: '99.98%',
      change: '+0.01%',
      trend: 'up',
      icon: Shield,
      color: 'green'
    }
  ];

  const securityFeatures = [
    {
      title: 'Atom-Level Compliance™',
      description: 'Molecular-grade regulatory precision across all transactions',
      status: 'Active',
      coverage: '100%'
    },
    {
      title: 'End-to-End Encryption',
      description: 'Military-grade encryption for all data transfers',
      status: 'Active',
      coverage: '100%'
    },
    {
      title: 'Multi-Factor Authentication',
      description: 'Advanced biometric and cryptographic verification',
      status: 'Active',
      coverage: '100%'
    },
    {
      title: 'Audit Trail Logging',
      description: 'Complete immutable record of all portal activities',
      status: 'Active',
      coverage: '100%'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-12">
        <div className="premium-card p-10 bg-gradient-to-br from-green-900 via-teal-900 to-emerald-900 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-block px-4 py-1 border border-green-400/50 rounded-full text-green-400 text-xs font-bold tracking-widest uppercase mb-4">
                The Baobab Portal
              </div>
              <h1 className="text-5xl font-black mb-3 font-serif flex items-center gap-4">
                <TreePine className="w-12 h-12" />
                Baobab Bush Portal
              </h1>
              <p className="text-xl text-green-200">
                Gateway to the 1000-Year Ecosystem • Atom-Level Security
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20 text-center">
              <div className="text-4xl font-black text-green-400 mb-1">{portalStats.uptime}%</div>
              <div className="text-sm text-green-200">Uptime</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-green-200 mb-1">Total Access</div>
              <div className="text-3xl font-black">{portalStats.totalAccess.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-green-200 mb-1">Active Users</div>
              <div className="text-3xl font-black">{portalStats.activeUsers.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-green-200 mb-1">Data Transfer</div>
              <div className="text-3xl font-black">{portalStats.dataTransferred}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-green-200 mb-1">Security Score</div>
              <div className="text-3xl font-black text-green-400">{portalStats.securityScore}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-green-200 mb-1">Compliance</div>
              <div className="text-lg font-black">{portalStats.compliance}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-green-200 mb-1">Status</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-bold">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex gap-2 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-8 py-4 font-bold transition-all ${
              activeTab === 'overview'
                ? 'border-b-4 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('access')}
            className={`px-8 py-4 font-bold transition-all ${
              activeTab === 'access'
                ? 'border-b-4 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Access Levels
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-8 py-4 font-bold transition-all ${
              activeTab === 'analytics'
                ? 'border-b-4 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-8 py-4 font-bold transition-all ${
              activeTab === 'integrations'
                ? 'border-b-4 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Integrations
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-12">
          {/* Recent Activity */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Recent Portal Activity</h2>
            <div className="premium-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Impact</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentActivity.map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{activity.user}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{activity.action}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {activity.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            activity.impact === 'Critical' ? 'bg-red-100 text-red-700' :
                            activity.impact === 'High' ? 'bg-orange-100 text-orange-700' :
                            activity.impact === 'Medium' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {activity.impact}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium text-green-600 capitalize">{activity.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Security Infrastructure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="premium-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <Shield className="w-6 h-6 text-green-700" />
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      {feature.status}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Coverage</span>
                    <span className="text-lg font-bold text-green-600">{feature.coverage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Access Levels Tab */}
      {activeTab === 'access' && (
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Portal Access Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accessLevels.map((level, index) => (
              <div key={index} className={`premium-card p-8 ${index === 0 ? 'border-4 border-yellow-500' : ''}`}>
                {index === 0 && (
                  <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase inline-block mb-4">
                    ⭐ Premium Tier
                  </div>
                )}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-5xl mb-3">{level.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{level.level}</h3>
                    <div className="text-3xl font-black bg-gradient-to-r {level.color} bg-clip-text text-transparent">
                      {level.price}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Active Users</div>
                    <div className="text-3xl font-black text-gray-900">{level.users.toLocaleString()}</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="text-sm font-bold text-gray-700 mb-3">PERMISSIONS</div>
                  {level.permissions.map((permission, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all bg-gradient-to-r ${level.color} text-white hover:shadow-2xl`}>
                  Request Access
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Portal Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="premium-card p-6">
                  <div className={`inline-flex p-4 rounded-2xl mb-4 ${
                    metric.color === 'blue' ? 'bg-blue-100' :
                    metric.color === 'purple' ? 'bg-purple-100' :
                    metric.color === 'yellow' ? 'bg-yellow-100' :
                    'bg-green-100'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      metric.color === 'blue' ? 'text-blue-600' :
                      metric.color === 'purple' ? 'text-purple-600' :
                      metric.color === 'yellow' ? 'text-yellow-600' :
                      'text-green-600'
                    }`} />
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{metric.title}</div>
                  <div className="text-4xl font-black text-gray-900 mb-2">{metric.value}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-green-600">{metric.change} this month</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Active Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrationPoints.map((integration, index) => (
              <div key={index} className="premium-card p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{integration.emoji}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{integration.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">{integration.syncStatus}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                    {integration.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Last Sync</div>
                    <div className="text-lg font-bold text-gray-900">{integration.lastSync}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Data Flow</div>
                    <div className="text-lg font-bold text-gray-900">{integration.dataFlow}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                    <Settings className="w-4 h-4" />
                    Configure
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Monitor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Repository Integration */}
      <div className="mt-12 premium-card p-10 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="flex items-start gap-6 mb-8">
          <div className="flex-shrink-0 w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center">
            <TreePine className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-serif">Connected Repository</h2>
            <p className="text-lg text-gray-700 mb-4">
              Real-time synchronization with Baobab Bush Portal infrastructure repository
            </p>
            <div className="bg-white/80 p-4 rounded-xl font-mono text-sm text-gray-900 border-2 border-green-600">
              git@github.com:heyns1000/baobab-bush-portal.git
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-green-200">
            <Lock className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Atom-Level Security</h3>
            <p className="text-sm text-gray-600">Military-grade encryption and compliance tracking</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-blue-200">
            <Users className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">8,947 Active Users</h3>
            <p className="text-sm text-gray-600">Multi-tier access management system</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200">
            <Download className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">847 TB Transferred</h3>
            <p className="text-sm text-gray-600">High-bandwidth data synchronization</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
