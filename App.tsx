
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Shield, Zap, Activity, Globe, Database, Server, Terminal, Anchor,
  Wind, Waves, CloudLightning, Eye, Layers, RefreshCw, Cpu, HardDrive, Wifi, Clock
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
  const audioCtx = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);

  const writeLog = useCallback((level: LogEntry['level'], tag: string, message: string) => {
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      level, tag, message
    };
    setLogs(prev => [...prev.slice(-100), entry]);
  }, []);

  // AMBIENT ENGINE: REAL-TIME AUDITORY FEEDBACK
  useEffect(() => {
    if (!isBooted) return;
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Create oscillator for base hum
    if (!oscillator.current) {
      oscillator.current = audioCtx.current.createOscillator();
      const gainNode = audioCtx.current.createGain();
      gainNode.gain.value = 0.01; // Low volume for atmosphere
      oscillator.current.connect(gainNode);
      gainNode.connect(audioCtx.current.destination);
      oscillator.current.start();
    }

    // Adjust frequency based on layer
    const freq = activeLayer === 'SKY' ? 440 : activeLayer === 'SURFACE' ? 220 : 55;
    oscillator.current.frequency.exponentialRampToValueAtTime(freq, audioCtx.current.currentTime + 2);
    
    writeLog('ENVIRONMENT', 'SYNC', `Atmospheric transition to ${activeLayer} level complete.`);
  }, [activeLayer, isBooted, writeLog]);

  // TELEMETRY SYNC
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
    writeLog('KERNEL', 'EXEC', `[DEPTH_${activeLayer}] > ${cmd}`);
    
    setIsProcessing(true);
    const aiRes = await sovereignGovernanceExecute({ command: cmd, metrics, activeLayer });
    setActiveDirective(aiRes);
    setIsProcessing(false);
  };

  if (!isBooted) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center p-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#020617_100%)] opacity-40" />
        <div className="relative group cursor-pointer" onClick={() => setIsBooted(true)}>
          <div className="absolute -inset-24 bg-emerald-500/10 blur-[150px] animate-pulse rounded-full" />
          <div className="relative p-28 border border-white/5 rounded-[4rem] bg-black/40 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] group-hover:border-emerald-500/30 transition-all duration-1000 group-hover:scale-105">
            <Layers className="w-24 h-24 text-slate-800 group-hover:text-emerald-500 transition-colors duration-500" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-2.5 bg-black border border-white/10 rounded-full text-[11px] font-black text-white tracking-[1em] uppercase shadow-2xl">
              INITIALIZE
            </div>
          </div>
        </div>
        <div className="mt-20 text-center z-10">
          <h2 className="text-[10px] font-black fira-code text-slate-700 tracking-[2em] uppercase animate-pulse">Engaging_Vertical_Condo_v7.2</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen transition-all duration-[2500ms] ease-in-out font-sans overflow-hidden ${
      activeLayer === 'SKY' ? 'bg-[#0a1120]' : activeLayer === 'SURFACE' ? 'bg-[#010409]' : 'bg-[#000205]'
    }`}>
      {/* ATMOSPHERIC PARALLAX */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute inset-0 opacity-40 transition-opacity duration-[3000ms] ${activeLayer === 'SKY' ? 'bg-[url("https://www.transparenttextures.com/patterns/stardust.png")]' : ''}`} />
        <div className={`absolute inset-0 transition-all duration-[3000ms] ${
          activeLayer === 'SKY' ? 'bg-gradient-to-b from-blue-500/10 via-transparent to-transparent' : 
          activeLayer === 'ABYSS' ? 'bg-gradient-to-t from-blue-900/20 via-transparent to-transparent' : ''
        }`} />
      </div>

      {/* HEADER: OBSIDIAN HUD */}
      <header className="h-24 bg-black/60 border-b border-white/5 flex items-center justify-between px-12 backdrop-blur-3xl z-20 shadow-2xl">
        <div className="flex items-center gap-12">
          <div className="relative group">
            <div className={`absolute -inset-4 rounded-3xl blur-2xl transition-all duration-1000 ${
              activeLayer === 'SKY' ? 'bg-blue-400/10' : activeLayer === 'SURFACE' ? 'bg-emerald-400/10' : 'bg-blue-900/30'
            }`} />
            <div className="relative p-5 bg-white/[0.03] border border-white/10 rounded-3xl shadow-inner group-hover:border-emerald-500/30 transition-all">
              {activeLayer === 'SKY' ? <Wind className="text-blue-400 animate-pulse" /> : 
               activeLayer === 'SURFACE' ? <Shield className="text-emerald-500" /> : 
               <Anchor className="text-blue-800 animate-bounce" />}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-[0.5em] fira-code text-white uppercase drop-shadow-2xl">
              AIIS_CONDO <span className="text-[10px] text-emerald-500 font-black ml-4 opacity-50">V7.2_FINAL</span>
            </h1>
            <div className="flex items-center gap-8 mt-2 text-[9px] font-black uppercase fira-code text-slate-600">
               <span className="flex items-center gap-2"><Clock size={10} /> UP: {Math.floor((Date.now() - startTime.current)/1000)}s</span>
               <span className="flex items-center gap-2 text-emerald-500/60"><Activity size={10} /> LINK: REAL-TIME</span>
            </div>
          </div>
        </div>

        <div className="flex gap-16">
          <Metric icon={<Cpu size={12}/>} label="CPUS" value={metrics.cpuCores.toString()} />
          <Metric icon={<HardDrive size={12}/>} label="LOAD" value={`${metrics.pressure.toFixed(1)}%`} color={metrics.pressure > 80 ? 'text-red-500' : 'text-slate-300'} />
          <Metric icon={<Wifi size={12}/>} label="NET" value={`${metrics.bandwidth}M`} />
          <Metric icon={<Eye size={12}/>} label="OMNI" value="360°" color="text-emerald-500" />
        </div>
      </header>

      {/* CONDO SPATIAL WORKSPACE */}
      <main className="flex-1 grid grid-cols-12 gap-8 p-8 overflow-hidden z-10">
        
        {/* NAVIGATOR: THE LIFT */}
        <div className="col-span-12 lg:col-span-3 flex flex-col">
           <div className="flex-1 bg-black/40 border border-white/5 rounded-[3.5rem] p-10 flex flex-col justify-between backdrop-blur-3xl shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Layers size={180} />
              </div>
              <div className="flex flex-col gap-6 relative z-10">
                 <span className="text-[11px] font-black fira-code text-slate-600 uppercase tracking-[0.4em] mb-4">Vertical_Deck</span>
                 <LevelBtn active={activeLayer === 'SKY'} label="SKY_LAYER" depth="+85.0M" onClick={() => setActiveLayer('SKY')} icon={<Wind size={18}/>} color="blue" />
                 <LevelBtn active={activeLayer === 'SURFACE'} label="CORE_LEVEL" depth="±0.00M" onClick={() => setActiveLayer('SURFACE')} icon={<Shield size={18}/>} color="emerald" />
                 <LevelBtn active={activeLayer === 'ABYSS'} label="ABYSS_DEEP" depth="-120.0M" onClick={() => setActiveLayer('ABYSS')} icon={<Anchor size={18}/>} color="indigo" />
              </div>

              <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 space-y-6 relative z-10">
                 <div className="flex items-center justify-between text-[10px] font-black text-slate-700 tracking-widest">
                   <span>AIR_PRESSURE</span>
                   <span className="text-blue-400">NORMAL</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{width: activeLayer === 'SKY' ? '20%' : activeLayer === 'SURFACE' ? '50%' : '90%'}} />
                 </div>
              </div>
           </div>
        </div>

        {/* 360 VISUALIZER */}
        <div className="col-span-12 lg:col-span-6 flex flex-col overflow-hidden">
           <div className="flex-1 relative rounded-[5rem] border border-white/5 bg-black/30 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] group backdrop-blur-xl">
              <NetworkTopology nodes={VERTICAL_INFRA.filter(n => n.layer === activeLayer)} />
              
              <div className="absolute bottom-10 left-10 right-10 z-20">
                 <form onSubmit={handleCommand} className="bg-black/80 border border-white/10 p-7 rounded-[3rem] flex items-center gap-8 shadow-2xl backdrop-blur-3xl focus-within:border-emerald-500/50 transition-all focus-within:ring-1 ring-emerald-500/20">
                    <Terminal size={22} className="text-emerald-500" />
                    <input 
                       type="text" 
                       value={terminalInput}
                       onChange={(e) => setTerminalInput(e.target.value)}
                       placeholder={`LINKING_LEVEL_${activeLayer}...`} 
                       className="flex-1 bg-transparent border-none outline-none text-[13px] font-black fira-code text-white placeholder:text-slate-800 uppercase tracking-widest"
                    />
                    <button type="submit" disabled={isProcessing} className="p-4 hover:bg-emerald-500/10 rounded-2xl transition-all">
                       <RefreshCw size={18} className={`text-emerald-500 ${isProcessing ? 'animate-spin' : ''}`} />
                    </button>
                 </form>
              </div>
           </div>
        </div>

        {/* GOVERNANCE FEED */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-8 overflow-hidden">
           <div className={`h-[48%] border rounded-[3.5rem] p-12 flex flex-col shadow-2xl transition-all duration-1000 backdrop-blur-2xl ${
             activeLayer === 'SKY' ? 'bg-blue-900/5 border-blue-500/20 shadow-blue-500/5' : 
             activeLayer === 'SURFACE' ? 'bg-black border-emerald-500/20 shadow-emerald-500/5' : 
             'bg-indigo-950/10 border-indigo-500/20 shadow-indigo-500/5'
           }`}>
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-4">
                    <Zap size={20} className="text-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.5em] fira-code">Directive</span>
                 </div>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 <div className="text-[13px] font-black fira-code text-slate-100 leading-relaxed italic opacity-90 drop-shadow-lg">
                    {activeDirective}
                 </div>
              </div>
           </div>
           <div className="flex-1 min-h-0">
              <AutonomousLog logs={logs} />
           </div>
        </div>

      </main>

      {/* FOOTER: THE DEPTH GAUGE */}
      <footer className="h-12 bg-black border-t border-white/5 flex items-center px-16 justify-between text-[11px] font-black fira-code text-slate-800 uppercase tracking-[0.8em] z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex gap-20">
           <span className="flex items-center gap-6">
              <Layers size={14} className="opacity-30" /> DEPTH: <span className="text-emerald-500">{activeLayer === 'SKY' ? '+085.00' : activeLayer === 'SURFACE' ? '±000.00' : '-120.00'}</span>
           </span>
           <span>JURISDICTION: EXCLUSIVE</span>
        </div>
        <div className="flex items-center gap-8">
           <span className="text-slate-900">VER: 7.2.0_SOV</span>
           <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_20px_#10b981]" />
        </div>
      </footer>
    </div>
  );
};

const Metric = ({ icon, label, value, color }: { icon: any, label: string, value: string, color?: string }) => (
  <div className="flex flex-col items-end gap-1">
    <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 tracking-widest opacity-60">
      {icon} {label}
    </div>
    <div className={`text-sm font-black fira-code tracking-tighter ${color || 'text-slate-200'}`}>{value}</div>
  </div>
);

const LevelBtn = ({ active, label, depth, icon, onClick, color }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-6 rounded-[2.5rem] border transition-all duration-700 group relative overflow-hidden ${
      active ? `bg-${color}-500/10 border-${color}-500/50 shadow-2xl` : 'bg-transparent border-white/5 hover:bg-white/[0.02]'
    }`}
  >
    {active && <div className={`absolute inset-0 bg-gradient-to-r from-${color}-500/5 to-transparent animate-[pulse_3s_infinite]`} />}
    <div className="flex items-center gap-5 relative z-10">
      <div className={`p-3.5 rounded-2xl transition-all duration-500 ${active ? `text-${color}-400 bg-white/10 scale-110 shadow-lg` : 'text-slate-800'}`}>
        {icon}
      </div>
      <div className="flex flex-col items-start">
        <span className={`text-[11px] font-black tracking-[0.2em] transition-colors ${active ? 'text-white' : 'text-slate-700'}`}>{label}</span>
        <span className={`text-[8px] font-black mt-1 transition-colors ${active ? `text-${color}-500/80` : 'text-slate-900'}`}>{depth}</span>
      </div>
    </div>
    {active && <ChevronRight size={14} className={`text-${color}-500 animate-bounce relative z-10`} />}
  </button>
);

const ChevronRight = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default App;
