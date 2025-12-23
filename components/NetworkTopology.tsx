
import React, { useEffect, useState, useMemo } from 'react';
import { NetworkNode, NodeStatus } from '../types';
import { Shield, Zap, Server, Activity, Database, Anchor, Wind, Cpu } from 'lucide-react';

interface TopologyProps {
  nodes: NetworkNode[];
}

const NetworkTopology: React.FC<TopologyProps> = ({ nodes }) => {
  const [rotation, setRotation] = useState(0);

  // Auto-rotation engine
  useEffect(() => {
    const frame = requestAnimationFrame(function animate() {
      setRotation(prev => (prev + 0.2) % 360);
      requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.SOVEREIGN: return '#10b981';
      case NodeStatus.IMMUTABLE: return '#06b6d4';
      case NodeStatus.ENFORCING: return '#8b5cf6';
      case NodeStatus.HEALING: return '#3b82f6';
      case NodeStatus.CRITICAL: return '#ef4444';
      default: return '#475569';
    }
  };

  const getNodeIcon = (node: NetworkNode) => {
    switch (node.type) {
      case 'satellite': return <Wind size={20} />;
      case 'gateway': return <Shield size={20} />;
      case 'server': return <Server size={20} />;
      case 'neural': return <Zap size={20} />;
      case 'database': return <Database size={20} />;
      case 'vault': return <Anchor size={20} />;
      default: return <Cpu size={20} />;
    }
  };

  return (
    <div className="relative w-full h-full p-12 overflow-hidden perspective-1000">
      {/* 360 RADIAL SCANNER */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] border border-emerald-500/5 rounded-full animate-[pulse_4s_infinite]" />
        <div className="absolute w-[450px] h-[450px] border border-blue-500/10 rounded-full" />
        <div className="absolute w-[300px] h-[300px] border border-white/5 rounded-full" />
      </div>

      <div className="absolute top-10 left-12 flex items-center gap-4 z-10">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
          <Activity size={16} className="text-emerald-500 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-white tracking-[0.6em] fira-code uppercase">OMNISCIENT_LINK</span>
          <span className="text-[8px] text-slate-600 font-bold uppercase italic tracking-widest">360°_Sovereign_View</span>
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-center relative">
        <div className="relative w-full h-full max-w-5xl transition-transform duration-1000" style={{ transform: `rotateY(${rotation}deg)` }}>
           {nodes.map((node, i) => {
             const angle = (i / nodes.length) * Math.PI * 2;
             const radius = 220;
             const x = 50 + Math.cos(angle) * 35; 
             const y = 50 + Math.sin(angle) * 35;
             const color = getStatusColor(node.status);
             const isFront = Math.sin(angle + (rotation * Math.PI / 180)) > 0;

             return (
               <div 
                 key={node.id} 
                 className={`absolute transition-all duration-700 group ${isFront ? 'z-20 opacity-100' : 'z-0 opacity-20 grayscale'}`}
                 style={{ 
                   left: `${x}%`, 
                   top: `${y}%`, 
                   transform: `translate(-50%, -50%) scale(${isFront ? 1 : 0.7})` 
                 }}
               >
                 <div className="relative flex flex-col items-center gap-3">
                    <div 
                      className="w-20 h-20 rounded-3xl bg-black/90 border-2 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all group-hover:scale-125 group-hover:shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                      style={{ borderColor: `${color}66`, color: color }}
                    >
                       {getNodeIcon(node)}
                       {/* Real-time status pulse */}
                       <div className="absolute inset-0 rounded-3xl border border-white/5 animate-ping opacity-5" />
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-[10px] font-black fira-code uppercase tracking-tighter" style={{ color }}>{node.name}</span>
                       <span className="text-[7px] font-bold text-slate-800 tracking-widest">{node.ip}</span>
                    </div>
                 </div>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};

export default NetworkTopology;
