import { useState, useEffect } from 'react';
import { 
  Bug, 
  Terminal, 
  AlertTriangle, 
  Cpu, 
  Layers, 
  RefreshCcw,
  ShieldAlert,
  Dna,
  Zap
} from 'lucide-react';

interface LogEntry {
  id: number;
  type: 'ERROR' | 'TRACE';
  msg: string;
  time: string;
}

export default function ThesisDebug() {
  const [pulse, setPulse] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [bugStatus, setBugStatus] = useState<'SCANNING' | 'QUARANTINING' | 'STABLE'>('SCANNING');
  const [memoryUsage, setMemoryUsage] = useState(42);

  // 9s Engine Pulse Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setPulse((prev) => (prev + 1) % 10);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Bug Generator Simulator
  useEffect(() => {
    if (pulse === 1) {
      const messages = [
        "Recursive dependency in 3_BIO/nexus.py detected.",
        "Buffer overflow prevented in 9s_Engine kernel.",
        "Stigmergy signal latency: +14ms",
        "Memory Leak in 40D_Store quarantined.",
        "Unsigned brand DNA found in ThesisGallery/Tier_1",
        "ClaimRoot™ validation passed for brand #13713",
        "PulseTrade™ heartbeat synchronized at 9s",
        "Elephant Trunk memory integrity: 100%",
        "VaultMesh™ encryption layer verified",
        "BareCart™ grain count sync complete"
      ];
      
      const newLog: LogEntry = {
        id: Date.now(),
        type: Math.random() > 0.7 ? 'ERROR' : 'TRACE',
        msg: messages[Math.floor(Math.random() * messages.length)],
        time: new Date().toLocaleTimeString()
      };
      setLogs(prev => [newLog, ...prev].slice(0, 12));
      setMemoryUsage(prev => Math.min(98, prev + Math.floor(Math.random() * 5)));
    }
    if (pulse === 9) {
      setBugStatus('QUARANTINING');
      setTimeout(() => {
        setBugStatus('STABLE');
        setMemoryUsage(38);
      }, 800);
    }
  }, [pulse]);

  const faultPoints = [
    { name: '40D_Vault/Corrupt_Headers', risk: 'HIGH' as const },
    { name: '9s_Sync/Oscillation_Error', risk: 'MED' as const },
    { name: 'Brand_Lattice/ID_Mismatch', risk: 'HIGH' as const },
    { name: 'Thesis_Core/Recursive_Loop', risk: 'CRIT' as const }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-stone-400 p-4 md:p-8 flex flex-col gap-6" style={{ fontFamily: 'monospace' }}>
      
      {/* Top Navigation / Status Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-950 border border-stone-800 p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-950/30 rounded-lg border border-red-500/20">
            <Bug className={`w-8 h-8 ${bugStatus === 'STABLE' ? 'text-green-500' : 'text-red-500 animate-pulse'}`} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter">
              ThesisGallery <span className="text-stone-600">v∞ DEBUG</span>
            </h1>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
              Repository: git@github.com:heyns1000/ThesisGallery.git
            </p>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-32 bg-stone-900/50 p-3 rounded-xl border border-stone-800">
            <p className="text-[9px] uppercase font-bold text-stone-500 mb-1">Pulse Sync</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: `${(pulse / 9) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-blue-400">{pulse}s</span>
            </div>
          </div>
          <button className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl transition-all flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" /> RECOMPILE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left: Live Bug Trace Terminal */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 bg-stone-950 border border-stone-800 rounded-2xl p-6 relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-stone-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-stone-300">System Log Trace</span>
              </div>
              <span className="text-[10px] text-green-500 bg-green-500/10 px-2 py-0.5 rounded font-mono">LIVE_STREAM</span>
            </div>
            
            <div className="space-y-2 overflow-y-auto max-h-[400px]">
              {logs.map(log => (
                <div key={log.id} className="flex gap-4 text-xs animate-in slide-in-from-left duration-300">
                  <span className="text-stone-600">[{log.time}]</span>
                  <span className={log.type === 'ERROR' ? 'text-red-500 font-bold' : 'text-blue-400'}>
                    {log.type === 'ERROR' ? '!!!' : '>>>'}
                  </span>
                  <span className={log.type === 'ERROR' ? 'text-red-200' : 'text-stone-400'}>{log.msg}</span>
                </div>
              ))}
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-stone-500/5 to-transparent h-24 w-full animate-scan"></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <Cpu className="w-4 h-4 text-yellow-600" />
                <span className="text-[10px] text-stone-500 font-bold uppercase">Memory</span>
              </div>
              <p className="text-2xl font-black text-white">{memoryUsage}%</p>
              <div className="w-full h-1 bg-stone-800 mt-2 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${memoryUsage > 80 ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${memoryUsage}%` }}></div>
              </div>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] text-stone-500 font-bold uppercase">Layers</span>
              </div>
              <p className="text-2xl font-black text-white">111</p>
              <p className="text-[9px] text-blue-400 mt-1 uppercase">Active Langs</p>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <ShieldAlert className="w-4 h-4 text-green-500" />
                <span className="text-[10px] text-stone-500 font-bold uppercase">Threats</span>
              </div>
              <p className="text-2xl font-black text-white">0</p>
              <p className="text-[9px] text-green-500 mt-1 uppercase">Quarantined</p>
            </div>
          </div>
        </div>

        {/* Right: Repository Structure & Bug Quarantining */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-stone-950 border border-stone-800 p-6 rounded-2xl">
            <h3 className="text-xs font-black text-stone-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Critical Fault Points
            </h3>
            <div className="space-y-3">
              {faultPoints.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-stone-900/40 p-3 rounded-lg border border-stone-800 group hover:border-red-500/30 transition-all">
                  <span className="text-xs text-stone-400 font-bold group-hover:text-white transition-colors">{item.name}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    item.risk === 'CRIT' ? 'bg-red-600 text-white' : 
                    item.risk === 'HIGH' ? 'bg-orange-600 text-white' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {item.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-stone-950 border border-stone-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
                <Dna className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-white uppercase italic">Baobab Defense™</h4>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed mb-6">
              Automated root-level healing active. Quarantining "buggy" logic nodes in the `ThesisGallery` branch.
            </p>
            <div className="flex gap-2">
              <button className="flex-1 bg-stone-800 hover:bg-stone-700 text-white text-[10px] font-black py-2 rounded-lg transition-colors uppercase">
                Purge Traces
              </button>
              <button className="flex-1 bg-stone-800 hover:bg-stone-700 text-white text-[10px] font-black py-2 rounded-lg transition-colors uppercase">
                Seal Vault
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-950/20 to-stone-950 border border-stone-800 p-6 rounded-2xl text-center">
            <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-[10px] font-black text-stone-500 uppercase mb-1">Great Wall Integrity</p>
            <p className="text-xl font-black text-white italic">永不崩塌</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>

    </div>
  );
}
