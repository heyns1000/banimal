import Layout from '@/react-app/components/Layout';
import { Activity, CheckCircle, XCircle, AlertCircle, Zap, Play, TrendingUp, Server, Database } from 'lucide-react';

export default function ApiStatus() {
  const healthChecks = [
    { name: 'WordPress Core', status: 'healthy', latency: '12ms', icon: Server },
    { name: 'Database Connection', status: 'healthy', latency: '8ms', icon: Database },
    { name: 'WooCommerce', status: 'healthy', latency: '15ms', icon: CheckCircle },
    { name: 'File System Access', status: 'healthy', latency: '5ms', icon: CheckCircle },
    { name: 'Network Connectivity', status: 'healthy', latency: '45ms', icon: TrendingUp }
  ];

  const integrationStatus = [
    { name: 'Paystack', status: 'configured', lastTest: '2 minutes ago', emoji: '💳' },
    { name: 'Google Drive', status: 'configured', lastTest: '1 hour ago', emoji: '📁' },
    { name: 'GitHub Sync', status: 'pending', lastTest: 'Never', emoji: '🐙' },
    { name: 'Webhooks', status: 'configured', lastTest: '5 minutes ago', emoji: '🔗' },
    { name: 'OpenAI', status: 'pending', lastTest: 'Never', emoji: '🧠' }
  ];

  const recentActivity = [
    { type: 'success', message: 'Automated supply chain initiated successfully', time: '2 minutes ago' },
    { type: 'info', message: 'Configuration updated', time: '15 minutes ago' },
    { type: 'success', message: 'Payment processed via Paystack', time: '1 hour ago' },
    { type: 'warning', message: 'GitHub sync delayed', time: '2 hours ago' },
    { type: 'success', message: 'WooCommerce webhook received', time: '3 hours ago' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              📊 API Status Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Real-time system health monitoring and endpoint testing
          </p>
        </div>

        {/* Overall Status */}
        <div className="premium-card bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-2 border-green-300 rounded-3xl p-10 mb-10 animate-slide-up shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full p-5 shadow-xl">
                <CheckCircle className="w-12 h-12" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 font-serif">All Systems Operational</h2>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-700 font-medium">Last checked: Just now • Uptime: 99.9%</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="glass p-6 rounded-2xl border border-green-300">
              <div className="text-4xl font-black gold-gradient-text mb-2">99.9%</div>
              <div className="text-sm text-gray-700 font-semibold uppercase tracking-wide">System Uptime</div>
            </div>
            <div className="glass p-6 rounded-2xl border border-green-300">
              <div className="text-4xl font-black gold-gradient-text mb-2">18ms</div>
              <div className="text-sm text-gray-700 font-semibold uppercase tracking-wide">Avg Response Time</div>
            </div>
            <div className="glass p-6 rounded-2xl border border-green-300">
              <div className="text-4xl font-black gold-gradient-text mb-2">1,247</div>
              <div className="text-sm text-gray-700 font-semibold uppercase tracking-wide">Requests Today</div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="premium-card rounded-3xl p-8 mb-10 animate-slide-up shadow-2xl" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3 font-serif">
            <div className="p-3 gradient-purple rounded-2xl">
              <Activity className="w-7 h-7 text-white" />
            </div>
            System Health Checks
          </h2>
          <div className="space-y-4">
            {healthChecks.map((check, index) => {
              const Icon = check.icon;
              return (
                <div key={index} className="group flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-50 rounded-xl group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="font-bold text-gray-900 text-lg">{check.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-mono text-gray-600 font-semibold">{check.latency}</div>
                      <div className="text-xs text-gray-500">Response Time</div>
                    </div>
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg">
                      ✓ Healthy
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integration Status */}
        <div className="premium-card rounded-3xl p-8 mb-10 animate-slide-up shadow-2xl" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3 font-serif">
            <div className="p-3 gradient-gold rounded-2xl">
              <Zap className="w-7 h-7 text-white" />
            </div>
            Integration Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrationStatus.map((integration, index) => (
              <div key={index} className="group p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 hover:border-yellow-400 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl group-hover:scale-110 transition-transform">{integration.emoji}</span>
                    <span className="font-bold text-gray-900 text-lg">{integration.name}</span>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide ${
                    integration.status === 'configured' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg'
                  }`}>
                    {integration.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className={`w-2 h-2 rounded-full ${integration.status === 'configured' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                  Last tested: <span className="font-semibold">{integration.lastTest}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Endpoints */}
        <div className="premium-card rounded-3xl p-8 mb-10 animate-slide-up shadow-2xl" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3 font-serif">
            <div className="p-3 gradient-green rounded-2xl">
              <Play className="w-7 h-7 text-white" />
            </div>
            Test API Endpoints
          </h2>
          <div className="space-y-5">
            <button className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-6 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-3 group">
              <Play className="w-6 h-6 group-hover:animate-pulse" />
              Test Supply Chain Endpoint
              <span className="ml-auto text-sm opacity-75">POST /automated-supply</span>
            </button>
            <button className="w-full glass border-2 border-indigo-300 text-indigo-700 px-8 py-6 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-3 group">
              <Play className="w-6 h-6 group-hover:animate-pulse" />
              Test Payment Processing
              <span className="ml-auto text-sm opacity-75">POST /process-payment</span>
            </button>
            <button className="w-full glass border-2 border-gray-300 text-gray-700 px-8 py-6 rounded-2xl font-bold text-lg hover:border-indigo-400 hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-3 group">
              <Play className="w-6 h-6 group-hover:animate-pulse" />
              Test Webhook Delivery
              <span className="ml-auto text-sm opacity-75">POST /webhook</span>
            </button>
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-900 text-center">
              <strong>ℹ️ Note:</strong> Tests are executed against your configured API endpoints in the WordPress admin panel
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="premium-card rounded-3xl p-8 animate-slide-up shadow-2xl" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3 font-serif">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <Activity className="w-7 h-7 text-white" />
            </div>
            Recent Activity Log
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
