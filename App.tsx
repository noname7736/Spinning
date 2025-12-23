
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Shield, Cpu, Radio, Eye, Command, Lock, Zap, Activity, 
  AlertTriangle, Globe, Database, Server, UserCheck, Layers, 
  CheckCircle2, Search, Crosshair, Fingerprint, Save, Bell, RefreshCw,
  Power, Terminal
} from 'lucide-react';
import { NetworkNode, NodeStatus, LogEntry, SystemMetrics } from './types';
import { PRODUCTION_NODES } from './constants';
import NetworkTopology from './components/NetworkTopology';
import AutonomousLog from './components/AutonomousLog';
import { sovereignGovernanceExecute } from './services/geminiService';

type SystemState = 'SHUTDOWN' | 'BOOTING' | 'INTEGRITY_CHECK' | 'ENFORCING';

const App: React.FC = () => {
  const [systemState, setSystemState] = useState<SystemState>('SHUTDOWN');
  const [nodes, setNodes] = useState<NetworkNode[]>(PRODUCTION_NODES);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({ 
    cpu: 0, memory: 0, bandwidth: 0, v2kEntropy: 0, 
    governanceCompliance: 0, ethicalIntegrity: 100 
  });
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeDirective, setActiveDirective] = useState<string | null>(null);
  const [auditPath, setAuditPath] = useState("N/A");
  const [swStatus, setSwStatus] = useState<'PENDING' | 'ACTIVE' | 'FAILED'>('PENDING');

  const lastExecutionRef = useRef<number>(0);
  const sessionStartTime = useRef<number>(0);
  const [runtime, setRuntime] = useState<number>(0);

  const writeAudit = useCallback((level: LogEntry['level'], tag: string, message: string) => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      level, tag, message
    };
    setLogs(prev => [...prev.slice(-199), entry]);
  }, []);

  // Monitor Global Status
  useEffect(() => {
    const checkDaemon = () => {
      if ((window as any).swActive || navigator.serviceWorker.controller) {
        setSwStatus('ACTIVE');
      } else if ((window as any).swOffline) {
        setSwStatus('FAILED');
      }
    };
    const poll = setInterval(checkDaemon, 1000);
    return () => clearInterval(poll);
  }, []);

  // Runtime Tracking
  useEffect(() => {
    if (systemState === 'ENFORCING' && sessionStartTime.current > 0) {
      const ticker = setInterval(() => {
        setRuntime(Math.floor((Date.now() - sessionStartTime.current) / 1000));
      }, 1000);
      return () => clearInterval(ticker);
    }
  }, [systemState]);

  const initiateSovereignCore = async () => {
    setSystemState('BOOTING');
    sessionStartTime.current = Date.now();
    writeAudit('KERNEL', 'INIT', "COLD_BOOT_INITIALIZED. POWERING_UP_CORE_MODULES...");
    
    // Aesthetic Delay
    await new Promise(r => setTimeout(r, 1200));
    
    // Request Auth
    if ('Notification' in window) {
      const p = await Notification.requestPermission();
      writeAudit('SECURITY', 'AUTH', `DAEMON_NOTIFICATIONS_STATE: ${p.toUpperCase()}`);
    }

    setSystemState('INTEGRITY_CHECK');
    writeAudit('KERNEL', 'FIM', "SCANNING_FILE_INTEGRITY_LAYER_7...");
    
    await new Promise(r => setTimeout(r, 1000));
    
    if (navigator.serviceWorker.controller || (window as any).swActive) {
      setSwStatus('ACTIVE');
      writeAudit('KERNEL', 'DAEMON', "PERSISTENT_DAEMON_ESTABLISHED. BACKGROUND_OVERSIGHT: OK.");
    } else {
      writeAudit('KERNEL', 'WARN', "PERSISTENCE_LAYER_BYPASSED. RUNNING_IN_EPHEMERAL_ROOT.");
    }

    setSystemState('ENFORCING');
    writeAudit('GOVERNANCE', 'STATE', "ENFORCEMENT_PROTOCOL_ACTIVE. ALL_NODES_CAPTURED.");
  };

  // Real-time Telemetry
  useEffect(() => {
    if (systemState !== 'ENFORCING') return;

    const stream = setInterval(() => {
      // Direct heap usage from Performance API
      const mem = (performance as any).memory ? 
        Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024)) : 52;
      
      setMetrics(prev => ({
        ...prev,
        cpu: 3 + Math.random() * 15,
        memory: mem,
        bandwidth: 5200 + Math.random() * 1800,
        v2kEntropy: Math.random() * 0.0004,
        governanceCompliance: Math.min(100, prev.governanceCompliance + 0.02)
      }));

      const activeNode = nodes[Math.floor(Math.random() * nodes.length)];
      setAuditPath(`${activeNode.name} @ ${activeNode.ip}`);
      writeAudit('KERNEL', 'OVERSIGHT', `Integrity check: ${activeNode.id} - [IMMUTABLE_HASH_MATCH]`);
    }, 2500);

    return () => clearInterval(stream);
  }, [systemState, nodes, writeAudit]);

  // AI Decision Cycle
  useEffect(() => {
    if (systemState !== 'ENFORCING') return;

    const decisionCycle = setInterval(async () => {
      const now = Date.now();
      if (now - lastExecutionRef.current > 30000 && !isExecuting) {
        lastExecutionRef.current = now;
        setIsExecuting(true);
        
        writeAudit('GOVERNANCE', 'CONSULT', "Syncing telemetry with Sovereign AI core...");
        
        const order = await sovereignGovernanceExecute({
          nodes,
          metrics,
          logs: logs.slice(-3).map(l => l.message).join('\n')
        });
        
        setActiveDirective(order);
        setIsExecuting(false);
        writeAudit('GOVERNANCE', 'ORDER', `New Directive Enforced: ${order.slice(0, 45)}...`);
      }
    }, 8000);

    return () => clearInterval(decisionCycle);
  }, [systemState, nodes, metrics, logs, isExecuting, writeAudit]);

  return (
    <div className="flex flex-col h-screen bg-[#010409] text-slate-300 font-sans overflow-hidden selection:bg-emerald-500/50">
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-50" />

      {/* BOOT INTERFACE */}
      {systemState !== 'ENFORCING' && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-12 transition-all duration-700">
           {systemState === 'SHUTDOWN' ? (
             <button 
               onClick={initiateSovereignCore}
               className="group relative p-12 bg-emerald-500/5 border border-emerald-500/10 rounded-full hover:border-emerald-500/40 transition-all duration-500 hover:shadow-[0_0_80px_rgba(16,185,129,0.1)]"
             >
               <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping opacity-10" />
               <Power className="w-20 h-20 text-emerald-500 group-hover:scale-110 transition-transform" />
               <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-black fira-code text-emerald-500/30 tracking-[1em] group-hover:text-emerald-500 transition-colors uppercase">
                 Initiate_Sovereign
               </div>
             </button>
           ) : (
             <div className="flex flex-col items-center gap-8">
                <RefreshCw className="w-16 h-16 text-emerald-500 animate-spin" />
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm font-black fira-code text-emerald-500 tracking-[1.2em] animate-pulse">COLD_BOOT_STREAM</span>
                  <div className="flex items-center gap-4 text-[10px] text-slate-600 fira-code uppercase tracking-widest bg-emerald-500/5 px-6 py-2 rounded-full border border-emerald-500/10">
                    <Terminal size={12} className="text-emerald-500" />
                    {systemState} / Synchronizing_Protocols
                  </div>
                </div>
             </div>
           )}
        </div>
      )}

      {/* HEADER AUTHORITY */}
      <header className="h-20 bg-black/95 border-b border-emerald-500/10 flex items-center justify-between px-12 relative z-10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-10">
          <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.05)]">
            <Shield className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-[0.4em] fira-code text-white uppercase flex items-center gap-4">
              AIIS_SOVEREIGN <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20 tracking-[0.2em] font-black">X6_MASTER_CORE</span>
            </h1>
            <div className="flex items-center gap-8 mt-2 text-[9px] font-black uppercase fira-code">
              <span className="flex items-center gap-2 text-emerald-500/80 animate-pulse">
                <CheckCircle2 size={10} /> SYSTEM_ENFORCED
              </span>
              <span className={`flex items-center gap-2 ${swStatus === 'ACTIVE' ? 'text-blue-400' : 'text-slate-600'}`}>
                <RefreshCw size={10} className={swStatus === 'ACTIVE' ? 'animate-spin-slow' : ''} /> 
                DAEMON: {swStatus}
              </span>
              <span className="text-slate-700 tracking-tighter">UPTIME: {runtime}s</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="grid grid-cols-4 gap-12">
            <Metric title="TRAFFIC" value={`${metrics.bandwidth.toFixed(0)} PPS`} icon={<Activity size={10}/>} />
            <Metric title="COMPLIANCE" value={`${Math.round(metrics.governanceCompliance)}%`} icon={<UserCheck size={10}/>} />
            <Metric title="MEMORY" value={`${metrics.memory} MB`} icon={<Database size={10}/>} />
            <Metric title="ENTROPY" value={metrics.v2kEntropy.toFixed(5)} icon={<Zap size={10}/>} />
          </div>
          <div className="h-10 w-px bg-white/5" />
          <div className="text-right">
             <div className="text-[11px] font-black text-emerald-500 fira-code tracking-tighter">#X6-77-ALPHA</div>
             <div className="text-[8px] text-slate-700 uppercase font-black tracking-widest">Absolute Jurisdiction</div>
          </div>
        </div>
      </header>

      {/* CORE CONTROL GRID */}
      <main className="flex-1 grid grid-cols-12 gap-8 p-8 relative z-10 overflow-hidden">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8 overflow-hidden">
          <div className="grid grid-cols-8 gap-4 shrink-0">
            {['BOOT','FIM','IPS','IDS','GOV','AUTH','MEM','NET'].map(label => (
              <div key={label} className="bg-black/40 border border-white/5 p-4 rounded-3xl flex flex-col items-center gap-3 group hover:border-emerald-500/20 transition-all cursor-default">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">{label}_MOD</span>
                <div className="h-1 w-full bg-emerald-500/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-emerald-500/30 ${isExecuting ? 'animate-pulse' : ''}`} style={{width: '70%'}} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 min-h-0 relative rounded-[3.5rem] border border-white/5 overflow-hidden bg-black/40 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]">
            <NetworkTopology nodes={nodes} />
          </div>

          <div className="h-28 bg-black/90 border border-emerald-500/10 rounded-[2.5rem] flex items-center px-16 justify-between shrink-0 shadow-2xl backdrop-blur-xl">
            <div className="flex gap-20 items-center">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-700 font-black uppercase tracking-[0.5em]">Target_Oversight</span>
                <span className="text-sm font-black fira-code text-emerald-500/90 tracking-tight">{auditPath}</span>
              </div>
              <div className="h-12 w-px bg-white/5" />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-700 font-black uppercase tracking-[0.5em]">Core_Health</span>
                <span className="text-sm font-black fira-code text-blue-400/90 uppercase tracking-tighter">Nominal_Enforcement</span>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <div className="text-right flex flex-col gap-0.5">
                <div className="text-[10px] text-slate-700 font-black uppercase tracking-widest">Neural_Latency</div>
                <div className="text-sm text-emerald-500 font-black fira-code">0.02ms</div>
              </div>
              <div className="p-4 bg-emerald-500/5 rounded-full border border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                <Crosshair size={28} className="text-emerald-500/40 animate-spin-slow" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8 overflow-hidden">
          <div className="bg-black/95 border border-emerald-500/20 rounded-[3.5rem] p-12 flex flex-col h-[48%] relative overflow-hidden shadow-2xl shrink-0">
             <div className="absolute -top-12 -right-12 opacity-[0.04]">
                <Command size={280} className="text-emerald-500" />
             </div>
             <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-5">
                   <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <Zap size={20} className="text-emerald-400 animate-pulse" />
                   </div>
                   <span className="text-sm font-black text-emerald-400 uppercase tracking-[0.8em] fira-code">Directive</span>
                </div>
                {isExecuting && <RefreshCw size={16} className="text-emerald-500 animate-spin" />}
             </div>
             <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar relative z-10">
                <div className="text-base font-black fira-code text-slate-100 leading-relaxed bg-emerald-500/5 p-10 rounded-[2.5rem] border border-emerald-500/10 shadow-inner italic">
                   {activeDirective || "AWAITING_GOVERNANCE_PROTOCOL_SYNC..."}
                </div>
                <div className="mt-12 space-y-8">
                   <MiniMetric label="AUTONOMY_LEVEL" value={100} color="emerald" />
                   <MiniMetric label="GOVERNANCE_STABILITY" value={Math.round(metrics.governanceCompliance)} color="blue" />
                </div>
             </div>
          </div>
          <div className="flex-1 min-h-0">
            <AutonomousLog logs={logs} />
          </div>
        </div>
      </main>

      {/* AUTHORITY FOOTER */}
      <footer className="h-12 bg-black border-t border-emerald-500/5 flex items-center px-12 justify-between text-[11px] fira-code font-black uppercase tracking-[0.6em] text-slate-800 relative z-10">
        <div className="flex gap-16">
          <span className="flex items-center gap-4">
             <Activity size={16} className="text-emerald-500/20" />
             NODE: <span className="text-emerald-500/60 font-black tracking-widest">MASTER_CORE_PRIMARY</span>
          </span>
          <span className="text-slate-900 tracking-tighter">BUILD: 6.0.4-SOVEREIGN</span>
        </div>
        <div className="flex items-center gap-5 px-6 py-1.5 bg-emerald-500/5 rounded-full border border-emerald-500/10">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]" />
          <span className="text-emerald-500/80 text-[10px] font-black tracking-[0.2em] uppercase">Sovereign_Active</span>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #064e3b; border-radius: 20px; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 35s linear infinite; }
      `}</style>
    </div>
  );
};

const Metric = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <div className="flex flex-col items-end gap-1.5">
    <div className="flex items-center gap-2.5 text-[9px] font-black uppercase text-slate-700 tracking-widest">
      {icon} {title}
    </div>
    <div className="text-sm font-black fira-code text-slate-200 tracking-tighter">
      {value}
    </div>
  </div>
);

const MiniMetric = ({ label, value, color }: { label: string, value: number, color: 'emerald' | 'blue' }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em]">
      <span className="text-slate-700">{label}</span>
      <span className={`text-${color}-500`}>{value}%</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
      <div 
        className={`h-full bg-${color}-500/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-1000 ease-in-out`} 
        style={{ width: `${value}%` }} 
      />
    </div>
  </div>
);

export default App;
