
import React, { useMemo } from 'react';
import { NetworkNode, NodeStatus } from '../types';
import { Shield, Zap, Globe, Server, Radio, Cpu, Network, Activity, Database, Anchor, Wind } from 'lucide-react';

interface TopologyProps {
  nodes: NetworkNode[];
}

const NetworkTopology: React.FC<TopologyProps> = ({ nodes }) => {
  
  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.SOVEREIGN: return '#10b981';
      case NodeStatus.IMMUTABLE: return '#06b6d4';
      case NodeStatus.ENFORCING: return '#8b5cf6';
      case NodeStatus.HEALING: return '#3b82f6';
      case NodeStatus.SYNCING: return '#f59e0b';
      case NodeStatus.CRITICAL: return '#ef4444';
      default: return '#475569';
    }
  };

  const getNodeIcon = (node: NetworkNode) => {
    switch (node.type) {
      case 'satellite': return <Wind size={18} />;
      case 'gateway': return <Shield size={18} />;
      case 'server': return <Server size={18} />;
      case 'neural': return <Zap size={18} />;
      case 'database': return <Database size={18} />;
      case 'vault': return <Anchor size={18} />;
      default: return <Cpu size={18} />;
    }
  };

  return (
    <div className="relative w-full h-full p-12 overflow-hidden">
      {/* 360 GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
         <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
               <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.1"/>
               </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
         </svg>
      </div>

      <div className="absolute top-10 left-12 flex items-center gap-4 z-10">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
          <Activity size={16} className="text-emerald-500 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-white tracking-[0.5em] fira-code uppercase">Sovereign_Scan</span>
          <span className="text-[8px] text-slate-600 font-bold uppercase italic tracking-widest">Active_Telemetry_Mapping</span>
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-center relative">
        {/* CENTER CORE GLOW */}
        <div className="absolute w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full animate-pulse" />
        
        <div className="relative w-full h-full max-w-4xl max-h-[500px]">
           {nodes.map((node, i) => {
             // Circular distribution (360 View)
             const angle = (i / nodes.length) * Math.PI * 2;
             const radius = 200 + (node.depth % 50); // Offset by depth for perspective
             const x = 50 + Math.cos(angle) * 35; 
             const y = 50 + Math.sin(angle) * 35;
             const color = getStatusColor(node.status);

             return (
               <div 
                 key={node.id} 
                 className="absolute transition-all duration-1000 ease-in-out group"
                 style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
               >
                 <div className="relative flex flex-col items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-[2rem] bg-black/80 border-2 flex items-center justify-center shadow-2xl transition-all group-hover:scale-110"
                      style={{ borderColor: `${color}44`, color: color }}
                    >
                       {getNodeIcon(node)}
                       {/* Latency Ring */}
                       <div className="absolute inset-0 rounded-[2rem] border border-white/5 animate-ping opacity-10" />
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-[9px] font-black fira-code uppercase tracking-widest" style={{ color }}>{node.name}</span>
                       <span className="text-[7px] font-bold text-slate-700 mt-0.5">{node.ip}</span>
                    </div>
                 </div>
               </div>
             );
           })}

           {/* CONNECTIVE WEB */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              {nodes.map((n, i) => {
                const next = nodes[(i + 1) % nodes.length];
                const angle1 = (i / nodes.length) * Math.PI * 2;
                const angle2 = ((i + 1) / nodes.length) * Math.PI * 2;
                return (
                  <line 
                    key={`line-${i}`}
                    x1={`${50 + Math.cos(angle1) * 35}%`} y1={`${50 + Math.sin(angle1) * 35}%`}
                    x2={`${50 + Math.cos(angle2) * 35}%`} y2={`${50 + Math.sin(angle2) * 35}%`}
                    stroke="white" strokeWidth="0.5" strokeDasharray="4"
                  />
                );
              })}
           </svg>
        </div>
      </div>
    </div>
  );
};

export default NetworkTopology;
