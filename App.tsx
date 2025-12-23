
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Shield, Zap, Activity, Globe, Database, Server, Terminal, Rocket, 
  RefreshCw, Power, Cpu, HardDrive, Wifi, Command, Clock, Anchor,
  Wind, Waves, CloudLightning, Eye, Layers, ChevronUp, ChevronDown
} from 'lucide-react';
import { NetworkNode, NodeStatus, LogEntry, SystemMetrics } from './types';
import { VERTICAL_INFRA, REMOTE_HUBS } from './constants';
import NetworkTopology from './components/NetworkTopology';
import AutonomousLog from './components/AutonomousLog';
import { sovereignGovernanceExecute } from './services/geminiService';

const App: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'SKY' | 'SURFACE' | 'ABYSS'>('SURFACE');
  const [isBooted, setIsBooted] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuCores: navigator.hardwareConcurrency || 0,
    memoryHeap: 0,
    bandwidth: 0,
    latency: 0,
    pressure: 0,
    uptime: 0
  });
  
  const [hubState, setHubState] = useState<Record<string, { online: boolean, latency: number }>>({});
  const [activeDirective, setActiveDirective] = useState("AWAITING_SOVEREIGN_AUTH");
  const [terminalInput, setTerminalInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const startTime = useRef(Date.now());

  const writeLog = useCallback((level: LogEntry['level'], tag: string, message: string) => {
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      level, tag, message
    };
    setLogs(prev => [...prev.slice(-100), entry]);
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel('aiis_sovereign_fabric');
    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'FABRIC_UPDATE') {
        setHubState(payload.hubs);
        const activeHubs = Object.values(payload.hubs as Record<string, any>).filter(h => h.online);
        const avgLat = activeHubs.length > 0 ? activeHubs.reduce((a, b) => a + b.latency, 0) / activeHubs.length : 0;
        setMetrics(prev => ({ 
          ...prev, 
          latency: Math.round(avgLat),
          bandwidth: (navigator as any).connection?.downlink || 0
        }));
      }
      if (type === 'HEARTBEAT') {
        const mem = (performance as any).memory;
        setMetrics(prev => ({ 
          ...prev, 
          memoryHeap: mem ? Math.round(mem.usedJSHeapSize / 1024 / 1024) : 0,
          pressure: mem ? (mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100 : 0
        }));
      }
    };
    return () => channel.close();
  }, []);

  useEffect(() => {
    if (!isBooted) return;
    const govTimer = setInterval(async () => {
      if (!isProcessing) {
        setIsProcessing(true);
        const result = await sovereignGovernanceExecute({ metrics, hubs: hubState, activeLayer });
        setActiveDirective(result);
        setIsProcessing(false);
      }
    }, 20000);
    return () => clearInterval(govTimer);
  }, [isBooted, metrics, hubState, activeLayer, isProcessing]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toUpperCase();
    if (!cmd) return;
    setTerminalInput("");
    writeLog('KERNEL', 'EXEC', `[LEVEL_${activeLayer}] > ${cmd}`);
    
    setIsProcessing(true);
    const aiRes = await sovereignGovernanceExecute({ command: cmd, metrics, activeLayer });
    setActiveDirective(aiRes);
    setIsProcessing(false);
  };

  if (!isBooted) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#020617_100%)] opacity-40" />
        <div className="relative group cursor-pointer" onClick={() => setIsBooted(true)}>
          <div className="absolute -inset-20 bg-emerald-500/5 blur-[120px] animate-pulse rounded-full" />
          <div className="relative p-24 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-3xl shadow-2xl group-hover:border-emerald-500/40 transition-all duration-1000">
            <Layers className="w-24 h-24 text-slate-800 group-hover:text-emerald-500 transition-colors" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 tracking-[0.5em] uppercase">
              V7.0_VERTICAL
            </div>
          </div>
        </div>
        <div className="mt-16 text-center z-10">
          <h2 className="text-sm font-black fira-code text-slate-500 tracking-[1.5em] uppercase animate-pulse">Engaging_Sovereign_Lift</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen transition-colors duration-[2000ms] ease-in-out font-sans overflow-hidden ${
      activeLayer === 'SKY' ? 'bg-[#0f172a]' : activeLayer === 'SURFACE' ? 'bg-[#020617]' : 'bg-[#00050a]'
    }`}>
      {/* VERTICAL ATMOSPHERE BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute inset-0 opacity-20 transition-opacity duration-1000 ${activeLayer === 'SKY' ? 'opacity-30' : 'opacity-10'}`}>
          <div className="absolute top-0 w-full h-1/3 bg-gradient-to-b from-blue-500/20 to-transparent" />
        </div>
        <div className={`absolute inset-0 opacity-20 transition-opacity duration-1000 ${activeLayer === 'ABYSS' ? 'opacity-40' : 'opacity-5'}`}>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-900/40 to-transparent" />
        </div>
      </div>

      {/* HEADER: CONDO HUD */}
      <header className="h-24 bg-black/40 border-b border-white/5 flex items-center justify-between px-10 backdrop-blur-2xl z-20">
        <div className="flex items-center gap-10">
          <div className="relative group">
            <div className={`absolute -inset-4 rounded-full blur-xl transition-colors duration-1000 ${
              activeLayer === 'SKY' ? 'bg-blue-400/20' : activeLayer === 'SURFACE' ? 'bg-emerald-400/20' : 'bg-purple-900/40'
            }`} />
            <div className="relative p-4 bg-white/5 border border-white/10 rounded-2xl">
              {activeLayer === 'SKY' ? <Wind className="text-blue-400" /> : 
               activeLayer === 'SURFACE' ? <Shield className="text-emerald-500" /> : 
               <Anchor className="text-blue-700" />}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-[0.4em] fira-code text-white uppercase">
              AIIS_CONDO <span className="text-[10px] text-slate-500 font-bold ml-4">V7.0_SOVEREIGN</span>
            </h1>
            <div className="flex items-center gap-6 mt-1 text-[9px] font-black uppercase fira-code text-slate-600">
               <span className="flex items-center gap-2"><Clock size={10} /> UPTIME: {Math.floor((Date.now() - startTime.current)/1000)}S</span>
               <span className="flex items-center gap-2 text-emerald-500/70"><Activity size={10} /> STATUS: PERPETUAL</span>
            </div>
          </div>
        </div>

        <div className="flex gap-12">
          <Metric icon={<Cpu size={12}/>} label="CORES" value={metrics.cpuCores.toString()} />
          <Metric icon={<HardDrive size={12}/>} label="PRESSURE" value={`${metrics.pressure.toFixed(1)}%`} color={metrics.pressure > 80 ? 'text-red-500' : 'text-slate-300'} />
          <Metric icon={<Wifi size={12}/>} label="DOWNLINK" value={`${metrics.bandwidth}M`} />
          <Metric icon={<Eye size={12}/>} label="VIEW" value="360°_ACTIVE" />
        </div>
      </header>

      {/* MAIN CONDO STRUCTURE */}
      <main className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden z-10">
        
        {/* LEFT: VERTICAL NAVIGATOR & TELEMETRY */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
           <div className="flex-1 bg-black/40 border border-white/5 rounded-[3rem] p-8 flex flex-col justify-between backdrop-blur-md">
              <div className="flex flex-col gap-4">
                 <span className="text-[10px] font-black fira-code text-slate-500 uppercase tracking-widest mb-4">Level_Selector</span>
                 <LevelBtn active={activeLayer === 'SKY'} label="SKY_LAYER" depth="100-80m" onClick={() => setActiveLayer('SKY')} icon={<Wind size={16}/>} color="blue" />
                 <LevelBtn active={activeLayer === 'SURFACE'} label="SURFACE_CORE" depth="50-40m" onClick={() => setActiveLayer('SURFACE')} icon={<Shield size={16}/>} color="emerald" />
                 <LevelBtn active={activeLayer === 'ABYSS'} label="ABYSS_VAULT" depth="10-0m" onClick={() => setActiveLayer('ABYSS')} icon={<Anchor size={16}/>} color="blue-900" />
              </div>

              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                 <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">Environment_Reading</span>
                 <div className="flex items-center justify-between">
                    <CloudLightning size={14} className="text-slate-500" />
                    <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 animate-pulse" style={{width: '65%'}} />
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                    <Waves size={14} className="text-slate-500" />
                    <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-900" style={{width: '40%'}} />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* CENTER: 360 TOPOLOGY VISUALIZER */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 overflow-hidden">
           <div className="flex-1 relative rounded-[4rem] border border-white/10 bg-black/20 overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#1e3a8a33_0%,transparent_50%)]" />
              <NetworkTopology nodes={VERTICAL_INFRA.filter(n => n.layer === activeLayer)} />
              
              {/* TERMINAL OVERLAY */}
              <div className="absolute bottom-8 left-8 right-8 z-20">
                 <form onSubmit={handleCommand} className="bg-black/90 border border-white/10 p-6 rounded-[2.5rem] flex items-center gap-6 shadow-2xl backdrop-blur-3xl focus-within:border-emerald-500/40 transition-all">
                    <Terminal size={20} className="text-emerald-500" />
                    <input 
                       type="text" 
                       value={terminalInput}
                       onChange={(e) => setTerminalInput(e.target.value)}
                       placeholder={`COMMAND_LEVEL_${activeLayer}...`} 
                       className="flex-1 bg-transparent border-none outline-none text-[12px] font-black fira-code text-white placeholder:text-slate-800 uppercase tracking-widest"
                    />
                    <button type="submit" disabled={isProcessing} className="p-3 hover:bg-white/5 rounded-2xl transition-all">
                       <RefreshCw size={16} className={`text-emerald-500 ${isProcessing ? 'animate-spin' : ''}`} />
                    </button>
                 </form>
              </div>
           </div>
        </div>

        {/* RIGHT: GOVERNANCE & LOGS */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-hidden">
           <div className={`h-[45%] border rounded-[3rem] p-10 flex flex-col shadow-2xl transition-colors duration-1000 ${
             activeLayer === 'SKY' ? 'bg-blue-900/20 border-blue-500/20' : 
             activeLayer === 'SURFACE' ? 'bg-black border-emerald-500/20' : 
             'bg-slate-900/40 border-blue-900/40'
           }`}>
              <div className="flex items-center gap-4 mb-8">
                 <Zap size={18} className="text-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] fira-code">Sovereign_Directive</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 <div className="text-xs font-black fira-code text-slate-100 leading-relaxed italic opacity-80">
                    {activeDirective}
                 </div>
              </div>
           </div>
           <div className="flex-1 min-h-0">
              <AutonomousLog logs={logs} />
           </div>
        </div>

      </main>

      {/* FOOTER: SYSTEM DEPTH */}
      <footer className="h-12 bg-black/80 border-t border-white/5 flex items-center px-12 justify-between text-[10px] font-black fira-code text-slate-700 uppercase tracking-[0.5em] z-20">
        <div className="flex gap-16">
           <span className="flex items-center gap-4">
              <Layers size={14} className="opacity-20" /> CURRENT_DEPTH: <span className="text-emerald-500/50">{activeLayer === 'SKY' ? '+85m' : activeLayer === 'SURFACE' ? '±0m' : '-120m'}</span>
           </span>
           <span>REAL_TELEMETRY: ACTIVE</span>
        </div>
        <div className="flex items-center gap-6">
           <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
           <span className="text-emerald-500/40">Jurisdiction_Locked_v7.0</span>
        </div>
      </footer>
    </div>
  );
};

const Metric = ({ icon, label, value, color }: { icon: any, label: string, value: string, color?: string }) => (
  <div className="flex flex-col items-end">
    <div className="flex items-center gap-2 text-[8px] font-black text-slate-600 tracking-widest">
      {icon} {label}
    </div>
    <div className={`text-xs font-black fira-code ${color || 'text-slate-200'}`}>{value}</div>
  </div>
);

const LevelBtn = ({ active, label, depth, icon, onClick, color }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-5 rounded-[2rem] border transition-all duration-500 group ${
      active ? `bg-${color}-500/10 border-${color}-500/40 shadow-lg` : 'bg-transparent border-white/5 hover:border-white/10'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl transition-colors ${active ? `text-${color}-400 bg-white/5` : 'text-slate-700'}`}>
        {icon}
      </div>
      <div className="flex flex-col items-start">
        <span className={`text-[10px] font-black tracking-widest ${active ? 'text-white' : 'text-slate-600'}`}>{label}</span>
        <span className="text-[7px] font-bold text-slate-800 mt-0.5">{depth}</span>
      </div>
    </div>
    {active && <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500 shadow-glow`} />}
  </button>
);

export default App;
