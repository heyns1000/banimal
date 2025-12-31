import { useState, useEffect } from 'react';
import { usePulse } from '@/react-app/contexts/PulseContext';
import PulseCard from '@/react-app/components/PulseCard';
import PulseIndicator from '@/react-app/components/PulseIndicator';
import { 
  Activity, 
  Zap, 
  ShieldCheck, 
  Database, 
  Cloud,
  Lock,
  Globe,
  Share2,
  Server,
  Key
} from 'lucide-react';

interface APIRequest {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH';
  endpoint: string;
  status: number;
  latency: number;
}

export default function FruitfulAPI() {
  const { pulseSecond, pulsePhase, pulseColor, grainCount, breathIntensity } = usePulse();
  const [requests, setRequests] = useState<APIRequest[]>([]);
  const [latency, setLatency] = useState(14);

  // API Traffic Simulator synced to global pulse
  useEffect(() => {
    if (pulseSecond % 2 === 0) {
      const endpoints = [
        '/v1/brands/synthesis',
        '/v1/compliance/atom-trace',
        '/v1/logistics/vortex-grain',
        '/v1/sovereignty/treaty-hook',
        '/v1/media/baobab-stream',
        '/v1/webhook/brands',
        '/v1/stats/ecosystem',
        '/v1/deployment/global',
        '/v1/portal/baobab'
      ];

      const newRequest: APIRequest = {
        id: Math.random().toString(36).substr(2, 9),
        method: (['GET', 'POST', 'PUT', 'PATCH'] as const)[Math.floor(Math.random() * 4)],
        endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
        status: Math.random() > 0.95 ? 429 : 200,
        latency: Math.floor(Math.random() * 40) + 5
      };
      setRequests(prev => [newRequest, ...prev].slice(0, 10));
      setLatency(newRequest.latency);
    }
  }, [pulseSecond]);

  const stats = [
    { label: 'Total Brands', value: grainCount.toLocaleString(), sub: 'Verified DNA', icon: ShieldCheck, color: 'text-green-500' },
    { label: 'Linguistics', value: '111', sub: 'Active Dialects', icon: Globe, color: 'text-blue-400' },
    { label: 'Compliance', value: '100%', sub: 'Atom-Trace™', icon: Lock, color: 'text-yellow-600' },
    { label: 'Uptime', value: '∞', sub: '永不崩塌', icon: Activity, color: 'text-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-stone-300 p-4 md:p-8 flex flex-col gap-6" style={{ fontFamily: 'monospace' }}>
      
      {/* API Header Status */}
      <div 
        className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-800 pb-8 transition-all duration-300"
        style={{
          borderColor: `${pulseColor}22`
        }}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="bg-yellow-600 p-2 rounded-lg transition-all duration-300"
              style={{
                transform: `scale(${0.95 + (breathIntensity * 0.05)})`,
                boxShadow: `0 0 ${15 * breathIntensity}px ${pulseColor}44`
              }}
            >
              <Zap className="w-5 h-5 text-black" fill="currentColor" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500">
              Fruitful API Platform // Sovereign Gateway
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
            FRUITFUL <span className="text-stone-700">API</span>
          </h1>
          <p className="text-stone-500 text-xs mt-2 max-w-md leading-relaxed">
            git@github.com:heyns1000/fruitful-api-platform.git — Scaling so fast, even donkeys can't keep up.
          </p>
        </div>

        <div className="flex gap-4">
          <PulseCard variant="glow" intensity="high" className="bg-stone-900/50 border border-stone-800 p-4 rounded-2xl min-w-[140px]">
            <p className="text-[9px] font-bold text-stone-600 uppercase mb-1">Engine Pulse</p>
            <PulseIndicator size="sm" showLabel={true} showGrains={false} />
          </PulseCard>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left: Stats & Health */}
        <div className="lg:col-span-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <PulseCard 
                  key={i} 
                  variant="glow" 
                  intensity="medium"
                  className="bg-stone-900/30 border border-stone-800 p-4 rounded-2xl"
                >
                  <Icon className={`w-5 h-5 ${stat.color} mb-3`} />
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-[9px] font-bold text-stone-600 uppercase tracking-tighter">{stat.sub}</p>
                </PulseCard>
              );
            })}
          </div>

          <PulseCard variant="glow" intensity="low" className="bg-stone-950 border border-stone-800 p-6 rounded-2xl">
            <h3 className="text-xs font-black text-white uppercase mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-500" /> Infrastructure Node
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500">Region</span>
                <span className="text-stone-300">MAHALAPYE-AFRICA-01</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500">Orchestrator</span>
                <span className="text-stone-300">NoodleNexus™ v2.5</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500">Storage</span>
                <span className="text-stone-300">ElephantMemory™ (21M)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500">Grains</span>
                <span className="text-yellow-500 font-black">{grainCount.toLocaleString()}</span>
              </div>
            </div>
          </PulseCard>

          <PulseCard 
            variant="glow" 
            intensity="high"
            className="bg-gradient-to-br from-yellow-950/20 to-stone-950 border border-yellow-900/30 p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="relative z-10">
              <h4 className="text-xs font-black text-yellow-600 uppercase mb-2">TreatyHook™ Status</h4>
              <p className="text-xs text-stone-400 italic">"13,713 brands, one offer — $100M for total market dominance."</p>
              <div className="mt-4 p-3 bg-stone-900/50 rounded-lg border border-stone-800">
                <p className="text-[10px] text-stone-500 mb-1">Webhook Endpoint:</p>
                <code className="text-xs text-yellow-500 break-all">https://banimal.mocha.app/api/webhook/brands</code>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Key className="w-24 h-24 text-yellow-500" />
            </div>
          </PulseCard>
        </div>

        {/* Right: Real-time Traffic Monitor */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <PulseCard variant="premium" intensity="medium" className="bg-stone-950 border border-stone-800 rounded-2xl p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-black text-white uppercase tracking-widest">Vortex Traffic Stream</span>
              </div>
              <div className="text-[10px] text-stone-500 font-bold uppercase flex items-center gap-2">
                Latency: <span className={latency > 30 ? 'text-red-500' : 'text-green-500'}>{latency}ms</span>
                <span className="text-purple-400">Phase: {pulsePhase}</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-hidden">
              {requests.map(req => (
                <div 
                  key={req.id} 
                  className="flex items-center justify-between bg-stone-900/40 p-3 rounded-xl border border-stone-800/50 hover:bg-stone-900 transition-all duration-300 animate-in slide-in-from-right"
                  style={{
                    borderColor: `${pulseColor}11`,
                    transform: `translateY(${-2 * breathIntensity}px)`
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      req.method === 'GET' ? 'bg-blue-600' : 
                      req.method === 'POST' ? 'bg-green-600' : 'bg-stone-700'
                    } text-white`}>
                      {req.method}
                    </span>
                    <span className="text-xs text-stone-300 font-bold truncate max-w-[200px] md:max-w-none">{req.endpoint}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-stone-600 font-mono hidden md:block">ID: {req.id}</span>
                    <span className={`text-xs font-black ${req.status === 200 ? 'text-green-500' : 'text-red-500'}`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </PulseCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PulseCard variant="default" intensity="low" className="bg-stone-900/20 border border-stone-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="bg-stone-800 p-3 rounded-xl">
                <Share2 className="w-5 h-5 text-stone-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-stone-600 uppercase">Load Balancer</p>
                <p className="text-sm font-bold text-white uppercase tracking-wider">Shanana™ Routing</p>
              </div>
            </PulseCard>
            <PulseCard variant="default" intensity="low" className="bg-stone-900/20 border border-stone-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="bg-stone-800 p-3 rounded-xl">
                <Database className="w-5 h-5 text-stone-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-stone-600 uppercase">Crate Logic</p>
                <p className="text-sm font-bold text-white uppercase tracking-wider">Zero-Waste Storage</p>
              </div>
            </PulseCard>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="max-w-7xl mx-auto w-full border-t border-stone-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50 text-[9px] font-black uppercase tracking-[0.2em]">
        <div className="flex items-center gap-4">
          <span>FAA™ Sovereign Ecosystem</span>
          <span className="text-stone-800">/</span>
          <span>永不崩塌</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3" />
          <span>Global Access Point - OM-4321</span>
          <span className="text-stone-800">/</span>
          <PulseIndicator size="sm" showLabel={false} showGrains={true} />
        </div>
      </div>

    </div>
  );
}
