import Layout from '@/react-app/components/Layout';
import { Activity, CheckCircle, AlertCircle, Zap, Database, RefreshCw, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SyncListener() {
  const [events, setEvents] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(true);

  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      const eventTypes = ['sync', 'update', 'insert', 'validation', 'integration'];
      const systems = ['FAA™', 'HSOMNI9000', 'Seedwave'];
      const statuses = ['success', 'processing', 'warning'];
      
      const randomEvent = {
        id: Date.now(),
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        system: systems[Math.floor(Math.random() * systems.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        message: generateMessage(),
        timestamp: new Date(),
        details: {
          brands: Math.floor(Math.random() * 100) + 1,
          duration: Math.floor(Math.random() * 5000) + 100
        }
      };

      setEvents(prev => [randomEvent, ...prev.slice(0, 49)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isListening]);

  const generateMessage = () => {
    const messages = [
      'Brand metadata synchronized',
      'Tier classification updated',
      'VaultMesh IDs allocated',
      'ClaimRoot authentication verified',
      'GhostTrace security layer active',
      'License fee calculation complete',
      'Geographic division assigned',
      'Category taxonomy updated',
      'CORE-SUBNODE relationship verified',
      'Premium brand validation complete'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getEventIcon = (type: string, status: string) => {
    if (status === 'processing') {
      return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
    }
    if (status === 'warning') {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
    
    switch (type) {
      case 'sync':
        return <RefreshCw className="w-5 h-5 text-green-500" />;
      case 'update':
        return <Zap className="w-5 h-5 text-purple-500" />;
      case 'insert':
        return <Database className="w-5 h-5 text-blue-500" />;
      case 'validation':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'integration':
        return <Activity className="w-5 h-5 text-orange-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'processing':
        return 'border-blue-500 bg-blue-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const stats = {
    totalEvents: events.length,
    successRate: Math.round((events.filter(e => e.status === 'success').length / events.length) * 100) || 0,
    avgDuration: Math.round(events.reduce((sum, e) => sum + e.details.duration, 0) / events.length) || 0,
    totalBrands: events.reduce((sum, e) => sum + e.details.brands, 0)
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black text-gray-900 mb-4 font-serif">📡 Ecosystem Listener</h1>
            <p className="text-xl text-gray-600">Real-time event monitoring across all three systems</p>
          </div>
          <button
            onClick={() => setIsListening(!isListening)}
            className={`px-8 py-4 rounded-2xl font-bold text-white shadow-lg transform hover:scale-105 transition-all ${
              isListening ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'
            }`}
          >
            {isListening ? '⏸ Pause Listening' : '▶ Resume Listening'}
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            {isListening && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>}
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{stats.totalEvents}</div>
          <div className="text-sm text-gray-600 font-semibold">Total Events</div>
        </div>

        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{stats.successRate}%</div>
          <div className="text-sm text-gray-600 font-semibold">Success Rate</div>
        </div>

        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{stats.avgDuration}ms</div>
          <div className="text-sm text-gray-600 font-semibold">Avg Duration</div>
        </div>

        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <Database className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{stats.totalBrands}</div>
          <div className="text-sm text-gray-600 font-semibold">Brands Processed</div>
        </div>
      </div>

      {/* Event Stream */}
      <div className="premium-card p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Live Event Stream</h2>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-gray-600">Streaming</span>
          </div>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {events.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-500">Waiting for events...</p>
            </div>
          )}

          {events.map((event) => (
            <div
              key={event.id}
              className={`border-l-4 ${getStatusColor(event.status)} p-6 rounded-r-2xl transition-all hover:shadow-lg animate-slide-in`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {getEventIcon(event.type, event.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        event.system === 'FAA™' ? 'bg-yellow-100 text-yellow-700' :
                        event.system === 'HSOMNI9000' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {event.system}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium mb-2">{event.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>🏷️ {event.details.brands} brands</span>
                      <span>⚡ {event.details.duration}ms</span>
                      <span>🕐 {event.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card p-6 border-l-4 border-yellow-500">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🏛️ FAA™ System</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className="flex items-center gap-2 text-sm font-bold text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Sync</span>
              <span className="text-sm font-bold text-gray-900">2 min ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Events</span>
              <span className="text-sm font-bold text-gray-900">
                {events.filter(e => e.system === 'FAA™').length}
              </span>
            </div>
          </div>
        </div>

        <div className="premium-card p-6 border-l-4 border-purple-500">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🧠 HSOMNI9000</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className="flex items-center gap-2 text-sm font-bold text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Sync</span>
              <span className="text-sm font-bold text-gray-900">5 min ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Events</span>
              <span className="text-sm font-bold text-gray-900">
                {events.filter(e => e.system === 'HSOMNI9000').length}
              </span>
            </div>
          </div>
        </div>

        <div className="premium-card p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🌱 Seedwave</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className="flex items-center gap-2 text-sm font-bold text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Sync</span>
              <span className="text-sm font-bold text-gray-900">1 min ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Events</span>
              <span className="text-sm font-bold text-gray-900">
                {events.filter(e => e.system === 'Seedwave').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
