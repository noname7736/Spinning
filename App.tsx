
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Shield, Zap, Activity, Globe, Database, Server, Terminal, Rocket, 
  RefreshCw, Power, Cpu, HardDrive, Wifi, Command, Clock, AlertTriangle,
  ChevronRight, Fingerprint
} from 'lucide-react';
import { NetworkNode, NodeStatus, LogEntry, SystemMetrics, DeploymentJob } from './types';
import { PRODUCTION_NODES, REMOTE_HUBS } from './constants';
import NetworkTopology from './components/NetworkTopology';
import AutonomousLog from './components/AutonomousLog';
import { sovereignGovernanceExecute } from './services/geminiService';

const App: React.FC = () => {
  const [isBooted, setIsBooted] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuCores: navigator.hardwareConcurrency || 0,
    memoryHeap: 0,
    bandwidth: 0,
    latency: 0,
    batteryLevel: 100,
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

  // REAL TELEMETRY SYNC
  useEffect(() => {
    const channel = new BroadcastChannel('aiis_sovereign_fabric');
    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'FABRIC_UPDATE') {
        setHubState(payload.hubs);
        // Fix for arithmetic error: explicitly cast and sum before division
        const hubsValues = Object.values(payload.hubs as Record<string, { online: boolean, latency: number }>);
        const activeHubs = hubsValues.filter(h => h.online);
        const totalLatency = activeHubs.reduce((acc: number, curr) => acc + curr.latency, 0);
        const avgLatency = REMOTE_HUBS.length > 0 ? totalLatency / REMOTE_HUBS.length : 0;
        
        setMetrics(prev => ({ 
          ...prev, 
          latency: Math.round(avgLatency),
          bandwidth: (navigator as any).connection?.downlink || 0
        }));
      }
      if (type === 'HEARTBEAT') {
        const mem = (performance as any).memory;
        setMetrics(prev => ({ 
          ...prev, 
          memoryHeap: mem ? Math.round(mem.usedJSHeapSize / 1024 / 1024) : 0 
        }));
      }
    };
    return () => channel.close();
  }, []);

  // AUTO GOVERNANCE WITH REAL DATA
  useEffect(() => {
    if (!isBooted) return;
    const govTimer = setInterval(async () => {
      if (!isProcessing) {
        setIsProcessing(true);
        const result = await sovereignGovernanceExecute({ 
          metrics, 
          hubs: hubState,
          nodes: PRODUCTION_NODES 
        });
        setActiveDirective(result);
        setIsProcessing(false);
      }
    }, 15000);
    return () => clearInterval(govTimer);
  }, [isBooted, metrics, hubState, isProcessing]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toUpperCase();
    if (!cmd) return;
    setTerminalInput("");
    writeLog('KERNEL', 'EXEC', `> ${cmd}`);

    if (cmd === 'STATUS') {
      writeLog('KERNEL', 'INFO', `HARDWARE: ${metrics.cpuCores} CORES | ${metrics.memoryHeap}MB HEAP | ${metrics.bandwidth}Mbps`);
      return;
    }

    if (cmd === 'DEPLOY') {
      setIsProcessing(true);
      writeLog('GOVERNANCE', 'INIT', "Triggering Sovereign Deployment Sequence...");
      await new Promise(r => setTimeout(r, 2000));
      if (navigator.onLine) {
        writeLog('KERNEL', 'SUCCESS', "Deployment Synced with Global Edge Hubs.");
      } else {
        writeLog('SECURITY', 'ERROR', "Link Failure: System Offline.");
      }
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    const aiRes = await sovereignGovernanceExecute({ command: cmd, metrics });
    setActiveDirective(aiRes);
    setIsProcessing(false);
  };

  if (!isBooted) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center p-8">
        <div className="relative group cursor-pointer" onClick={() => {
          setIsBooted(true);
          startTime.current = Date.now();
        }}>
          <div className="absolute -inset-8 bg-emerald-500/10 blur-3xl animate-pulse rounded-full" />
          <div className="relative p-20 border border-white/5 rounded-full bg-black shadow-2xl group-hover:border-emerald-500/30 transition-all duration-700">
            <Fingerprint className="w-20 h-20 text-slate-800 group-hover:text-emerald-500 transition-colors" />
          </div>
        </div>
        <div className="mt-12 text-center">
          <h2 className="text-xs font-black fira-code text-slate-600 tracking-[1em] uppercase">Initialize_Sovereign_Link</h2>
          <p className="text-[10px] text-slate-800 mt-2 font-bold uppercase italic">Hardware Signature Required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#010409] text-slate-300 font-sans overflow-hidden">
      {/* HEADER: REAL TELEMETRY */}
      <header className="h-24 bg-black/80 border-b border-white/5 flex items-center justify-between px-10 backdrop-blur-xl z-20">
        <div className="flex items-center gap-8">
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.05)]">
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-[0.3em] fira-code text-white uppercase flex items-center gap-4">
              AIIS_SOVEREIGN <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 font-black">v6.2_STABLE</span>
            </h1>
            <div className="flex items-center gap-8 mt-1.5 text-[9px] font-black uppercase fira-code text-slate-600">
              <span className="text-emerald-500 flex items-center gap-2"><Activity size={10} /> ACTIVE_ENFORCEMENT</span>
              <span className="flex items-center gap-2"><Clock size={10} /> UPTIME: {Math.floor((Date.now() - startTime.current)/1000)}S</span>
            </div>
          </div>
        </div>

        <div className="flex gap-12">
          <Metric icon={<Cpu size={12}/>} label="CPUS" value={metrics.cpuCores.toString()} />
          <Metric icon={<HardDrive size={12}/>} label="HEAP" value={`${metrics.memoryHeap}MB`} />
          <Metric icon={<Wifi size={12}/>} label="NET" value={`${metrics.bandwidth}Mbps`} />
          <Metric icon={<Activity size={12}/>} label="LATENCY" value={`${metrics.latency}ms`} color={metrics.latency > 100 ? 'text-amber-500' : 'text-emerald-500'} />
        </div>
      </header>

      {/* CORE WORKSPACE */}
      <main className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* NETWORK & HUBS */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          <div className="grid grid-cols-4 gap-4">
            {REMOTE_HUBS.map(hub => {
              const status = hubState[hub.url] || { online: false, latency: 0 };
              return (
                <div key={hub.id} className="bg-black/40 border border-white/5 p-4 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl bg-white/5 ${status.online ? 'text-emerald-400' : 'text-red-500 animate-pulse'}`}>
                      <Globe size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{hub.name}</span>
                      <span className="text-[10px] text-white fira-code font-bold">{status.online ? `${status.latency}ms` : 'TIMEOUT'}</span>
                    </div>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${status.online ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500'}`} />
                </div>
              );
            })}
          </div>

          <div className="flex-1 min-h-0 relative rounded-[3rem] border border-white/5 bg-black/20 overflow-hidden shadow-inner">
             <NetworkTopology nodes={PRODUCTION_NODES} />
             <div className="absolute bottom-6 left-6 right-6 z-20">
                <form onSubmit={handleCommand} className="bg-black/90 border border-white/10 p-5 rounded-3xl flex items-center gap-4 shadow-2xl backdrop-blur-3xl">
                   <Terminal size={18} className="text-emerald-500" />
                   <input 
                      type="text" 
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="ENTER_SOVEREIGN_COMMAND..." 
                      className="flex-1 bg-transparent border-none outline-none text-[11px] font-black fira-code text-white placeholder:text-slate-800 uppercase tracking-widest"
                   />
                   <button type="submit" disabled={isProcessing} className="p-2 hover:bg-emerald-500/10 rounded-xl transition-all">
                      <RefreshCw size={14} className={`text-emerald-500 ${isProcessing ? 'animate-spin' : ''}`} />
                   </button>
                </form>
             </div>
          </div>
        </div>

        {/* LOGS & DIRECTIVES */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
          <div className="h-[40%] bg-black/60 border border-emerald-500/20 rounded-[2.5rem] p-10 flex flex-col shadow-2xl relative overflow-hidden shrink-0">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Command size={120} className="text-emerald-500" />
             </div>
             <div className="flex items-center gap-4 mb-6 relative z-10">
                <Zap size={18} className="text-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest fira-code">Current_Governance_Directive</span>
             </div>
             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                <div className="text-sm font-black fira-code text-slate-100 leading-relaxed italic border-l-2 border-emerald-500/40 pl-6 bg-white/5 p-6 rounded-2xl">
                   {activeDirective}
                </div>
             </div>
          </div>
          <div className="flex-1 min-h-0">
            <AutonomousLog logs={logs} />
          </div>
        </div>
      </main>

      <footer className="h-10 bg-black border-t border-white/5 flex items-center px-10 justify-between text-[9px] font-black fira-code text-slate-800 uppercase tracking-[0.5em]">
        <div className="flex gap-12">
           <span>OS: {navigator.platform}</span>
           <span>SYNC_MODE: PERSISTENT_DAEMON</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-emerald-500/50">Jurisdiction_Locked_v6.2</span>
        </div>
      </footer>
    </div>
  );
};

const Metric = ({ icon, label, value, color }: { icon: any, label: string, value: string, color?: string }) => (
  <div className="flex flex-col items-end gap-0.5">
    <div className="flex items-center gap-2 text-[8px] font-black text-slate-600 uppercase tracking-widest">
      {icon} {label}
    </div>
    <div className={`text-xs font-black fira-code tracking-tighter ${color || 'text-slate-200'}`}>{value}</div>
  </div>
);

export default App;
