
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface LogProps {
  logs: LogEntry[];
}

const AutonomousLog: React.FC<LogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-black/60 rounded-3xl border border-white/5 overflow-hidden font-mono shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between px-8 py-5 bg-white/[0.02] border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
          </div>
          <span className="text-[9px] font-black text-slate-500 tracking-[0.5em] uppercase ml-4">SOVEREIGN_AUDIT_STREAM</span>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[7px] font-black text-emerald-500 tracking-widest uppercase">
          Enforcement_Mode
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-8 overflow-y-auto space-y-3 fira-code custom-scrollbar text-[10px]"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 border-l border-white/5 pl-6 hover:bg-white/[0.01] transition-colors py-1 group">
            <span className="text-slate-600 shrink-0 opacity-40">[{log.timestamp}]</span>
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="flex items-center gap-3">
                <span className={`shrink-0 font-black px-2 py-0.5 rounded-[4px] text-[8px] tracking-widest border ${
                  log.level === 'GOVERNANCE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  log.level === 'SECURITY' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  log.level === 'ETHICAL' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  log.level === 'KERNEL' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {log.level}
                </span>
                <span className="text-[8px] font-black text-slate-500 opacity-40 uppercase tracking-tighter">#{log.tag}</span>
              </div>
              <span className="text-slate-300 break-words font-medium group-hover:text-emerald-400 transition-colors">{log.message}</span>
            </div>
          </div>
        ))}
        <div className="w-1.5 h-4 bg-emerald-500 animate-pulse inline-block ml-1 align-middle" />
      </div>
    </div>
  );
};

export default AutonomousLog;
