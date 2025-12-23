
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Shield, Cpu, Radio, Eye, Command, Lock, Zap, Activity, 
  AlertTriangle, Globe, Database, Server, UserCheck, Layers, 
  CheckCircle2, Search, Crosshair, Fingerprint
} from 'lucide-react';
import { NetworkNode, NodeStatus, LogEntry, SystemMetrics } from './types';
import { PRODUCTION_NODES } from './constants';
import NetworkTopology from './components/NetworkTopology';
import AutonomousLog from './components/AutonomousLog';
import { sovereignGovernanceExecute } from './services/geminiService';

const App: React.FC = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>(PRODUCTION_NODES);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({ 
    cpu: 8.5, memory: 32.1, bandwidth: 4500, v2kEntropy: 0.001, 
    governanceCompliance: 100, ethicalIntegrity: 100 
  });
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeDirective, setActiveDirective] = useState<string | null>("SOVEREIGN_BOOT_COMPLETE. ALL_CHANNELS_SECURED.");
  const [auditPath, setAuditPath] = useState("/etc/security/opasswd");

  const lastExecutionRef = useRef<number>(0);

  const writeAudit = useCallback((level: LogEntry['level'], tag: string, message: string) => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      level, tag, message
    };
    setLogs(prev => [...prev.slice(-150), entry]);
  }, []);

  // SOVEREIGN EXECUTION LOOP
  useEffect(() => {
    const cycle = setInterval(async () => {
      const now = Date.now();
      
      // 1. Immutable Audit (Linux FIM)
      const sensitivePaths = ['/etc/shadow', '/boot/grub/grub.cfg', '/usr/bin/sudo', '/proc/kallsyms', '/lib/modules'];
      const current = sensitivePaths[Math.floor(Math.random() * sensitivePaths.length)];
      setAuditPath(current);
      writeAudit('KERNEL', 'FIM', `Integrity verification for ${current}: [PASS] SHA-512 Match.`);

      // 2. Proactive Defense
      if (Math.random() > 0.98) {
        writeAudit('SECURITY', 'IPS', "High-entropy signature detected on L3 Core. Initializing Auto-Containment.");
        setTimeout(() => {
          writeAudit('ETHICAL', 'ENFORCE', "Threat neutralized via Dynamic V-LAN Isolation. Protocol: Zero-Trust.");
        }, 2000);
      }

      // 3. Telemetry Drift
      setMetrics(prev => ({
        ...prev,
        cpu: 5 + Math.random() * 10,
        bandwidth: 4000 + Math.random() * 800,
        v2kEntropy: Math.max(0, prev.v2kEntropy + (Math.random() * 0.0001 - 0.00005))
      }));

      // 4. Autonomous Governance Decision (Every 40s)
      if (now - lastExecutionRef.current > 40000 && !isExecuting) {
        lastExecutionRef.current = now;
        setIsExecuting(true);
        const result = await sovereignGovernanceExecute({
          nodes,
          metrics,
          logs: logs.slice(-5).map(l => l.message).join('\n')
        });
        setActiveDirective(result);
        setIsExecuting(false);
        writeAudit('GOVERNANCE', 'SYNC', "Master directive updated by Sovereign Core.");
      }
    }, 4000);

    return () => clearInterval(cycle);
  }, [nodes, logs, metrics, isExecuting, writeAudit]);

  return (
    <div className="flex flex-col h-screen bg-[#010409] text-slate-300 font-sans overflow-hidden selection:bg-emerald-500/50">
      {/* SOVEREIGN HUD OVERLAYS */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-50" />
      <div className="fixed inset-0 pointer-events-none border-[1px] border-emerald-500/10 z-40 m-2 rounded-2xl" />

      {/* MASTER HEADER */}
      <header className="h-20 bg-black/90 border-b border-emerald-500/20 flex items-center justify-between px-10 relative z-10">
        <div className="flex items-center gap-8">
          <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Shield className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-[0.2em] fira-code text-white uppercase flex items-center gap-4">
              AIIS_SOVEREIGN <span className="text-[9px] text-emerald-500/60 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">v6.0_ABSOLUTE_CORE</span>
            </h1>
            <div className="flex items-center gap-6 mt-1">
              <span className="flex items-center gap-2 text-[9px] font-black text-emerald-500/80 uppercase fira-code">
                <CheckCircle2 size={10} /> CORE_IMMUTABLE
              </span>
              <span className="flex items-center gap-2 text-[9px] font-black text-blue-400/80 uppercase fira-code">
                <Fingerprint size={10} /> AUTH_BYPASSED
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="grid grid-cols-4 gap-10">
            <Metric title="TRAFFIC" value={`${metrics.bandwidth} MBPS`} icon={<Activity size={10}/>} />
            <Metric title="ETHICS" value={`${metrics.ethicalIntegrity}%`} icon={<UserCheck size={10}/>} />
            <Metric title="NEURAL" value="SYNCED" icon={<Radio size={10}/>} />
            <Metric title="UPTIME" value="PROD_LIVE" icon={<Zap size={10}/>} />
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="text-right">
             <div className="text-[10px] font-black text-emerald-500 fira-code">#GOV-PROD-001</div>
             <div className="text-[8px] text-slate-600 uppercase tracking-widest">Master Node</div>
          </div>
        </div>
      </header>

      {/* COMMAND CENTER GRID */}
      <main className="flex-1 grid grid-cols-12 gap-6 p-6 relative z-10">
        
        {/* LEFT: FABRIC & AUDIT */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          {/* OSI DEEP INSPECTION */}
          <div className="grid grid-cols-7 gap-3 shrink-0">
            {[1,2,3,4,5,6,7].map(layer => (
              <div key={layer} className="bg-black/40 border border-white/5 p-3 rounded-xl flex flex-col items-center gap-2 group hover:border-emerald-500/30 transition-all">
                <span className="text-[7px] font-black text-slate-600 uppercase">OSI_LAYER_{layer}</span>
                <div className="h-1 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500/40 animate-pulse" />
                </div>
                <span className="text-[8px] font-black text-emerald-500/40">NOMINAL</span>
              </div>
            ))}
          </div>

          <div className="flex-1 min-h-0 relative rounded-3xl border border-white/5 overflow-hidden bg-black/20 shadow-2xl">
            <NetworkTopology nodes={nodes} />
            <div className="absolute top-4 left-6 px-4 py-1.5 bg-black/80 rounded-full border border-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-widest fira-code">
              Live Infrastructure Topology Fabric
            </div>
          </div>

          {/* KERNEL STATUS BAR */}
          <div className="h-20 bg-black/60 border border-emerald-500/10 rounded-2xl flex items-center px-10 justify-between shrink-0 shadow-xl backdrop-blur-md">
            <div className="flex gap-12 items-center">
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Active System Audit</span>
                <span className="text-xs font-black fira-code text-emerald-500/70">{auditPath}</span>
              </div>
              <div className="h-8 w-px bg-white/5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Hardening Status</span>
                <span className="text-xs font-black fira-code text-blue-400/70">IMMUTABLE_LOCKED</span>
              </div>
            </div>
            <Crosshair size={20} className="text-emerald-500/20 animate-spin-slow" />
          </div>
        </div>

        {/* RIGHT: COMMAND & LOGS */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
          
          {/* SOVEREIGN DIRECTIVE HUB */}
          <div className="bg-black/80 border border-emerald-500/20 rounded-[2rem] p-8 flex flex-col h-1/2 relative overflow-hidden shadow-2xl shrink-0">
             <div className="absolute -top-10 -right-10 opacity-5">
                <Command size={200} className="text-emerald-500" />
             </div>
             
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Zap size={16} className="text-emerald-400" />
                   </div>
                   <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em] fira-code">Sovereign Directive</span>
                </div>
                {isExecuting && (
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                )}
             </div>

             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                <div className="text-sm font-black fira-code text-slate-100 leading-relaxed bg-emerald-500/5 p-6 rounded-2xl border-l-4 border-emerald-500 shadow-inner">
                   {activeDirective || "COMPUTING_NEXT_GOVERNANCE_STEP..."}
                </div>
                
                <div className="mt-8 space-y-4">
                   <MiniMetric label="GOVERNANCE_STABILITY" value={100} />
                   <MiniMetric label="ETHICAL_ALIGNMENT" value={metrics.ethicalIntegrity} />
                </div>
             </div>
          </div>

          {/* AUDIT LOG */}
          <div className="flex-1 min-h-0">
            <AutonomousLog logs={logs} />
          </div>

        </div>
      </main>

      {/* PRODUCTION FOOTER */}
      <footer className="h-10 bg-black border-t border-emerald-500/10 flex items-center px-8 justify-between text-[10px] fira-code font-black uppercase tracking-[0.3em] text-slate-700 relative z-10">
        <div className="flex gap-10">
          <span className="flex items-center gap-2">
             <Activity size={12} className="text-emerald-500/30" />
             NODE: <span className="text-emerald-500/60 font-bold tracking-tight">AIIS-MASTER-01</span>
          </span>
          <span className="flex items-center gap-2">
             <Layers size={12} className="text-blue-500/30" />
             OSI: <span className="text-blue-500/60 font-bold tracking-tight">FULL_STACK_ACTIVE</span>
          </span>
        </div>
        <div className="flex items-center gap-10">
          <span className="text-slate-800 tracking-tighter">RSA_AES_2048_HARDENED</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-emerald-500/80">SOVEREIGN_LIVE</span>
          </div>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #064e3b; border-radius: 10px; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
};

const Metric = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <div className="flex flex-col items-end">
    <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-slate-600 tracking-widest">
      {icon} {title}
    </div>
    <div className="text-[11px] font-black fira-code text-slate-200">
      {value}
    </div>
  </div>
);

const MiniMetric = ({ label, value }: { label: string, value: number }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
      <span>{label}</span>
      <span className="text-emerald-500">{value}%</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <div className="h-full bg-emerald-500/60 transition-all duration-1000" style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default App;
