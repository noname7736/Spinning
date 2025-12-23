
import React, { useMemo } from 'react';
import { NetworkNode, NodeStatus, NetworkLayer } from '../types';
import { Shield, Zap, Globe, Server, Radio, Cpu, Network, Activity, Database, Cloud } from 'lucide-react';

interface TopologyProps {
  nodes: NetworkNode[];
}

const NetworkTopology: React.FC<TopologyProps> = ({ nodes }) => {
  const layers: NetworkLayer[] = ['EDGE', 'SECURITY', 'DATA_FABRIC', 'DEPLOYMENT', 'CORE', 'NEURAL_V2K'];
  
  const layerY = (layer: NetworkLayer) => {
    const idx = layers.indexOf(layer);
    return 40 + (idx * 60);
  };

  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.SOVEREIGN: return '#10b981'; // Emerald
      case NodeStatus.IMMUTABLE: return '#06b6d4'; // Cyan
      case NodeStatus.CRITICAL: return '#ef4444'; // Red
      case NodeStatus.ENFORCING: return '#8b5cf6'; // Violet
      case NodeStatus.HEALING: return '#3b82f6'; // Blue
      case NodeStatus.SYNCING: return '#f59e0b'; // Amber
      default: return '#475569';
    }
  };

  const getNodeIcon = (node: NetworkNode) => {
    if (node.layer === 'DATA_FABRIC') return <Database size={14} />;
    if (node.provider) return <Cloud size={14} />;
    
    switch (node.type) {
      case 'firewall': return <Shield size={14} />;
      case 'dns': return <Globe size={14} />;
      case 'server': return <Server size={14} />;
      case 'v2k': return <Radio size={14} />;
      case 'router': return <Network size={14} />;
      case 'switch': return <Zap size={14} />;
      default: return <Cpu size={14} />;
    }
  };

  const connections = useMemo(() => {
    const lines = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const start = nodes[i];
      const end = nodes[i + 1];
      lines.push({ start, end });
    }
    return lines;
  }, [nodes]);

  return (
    <div className="relative w-full h-full bg-[#020617]/90 rounded-[3rem] border border-white/5 overflow-hidden p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="absolute top-8 left-10 flex items-center gap-4 z-10">
        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
          <Activity size={14} className="text-emerald-500 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em] fira-code uppercase">Sovereign_Fabric_v6.0</span>
          <span className="text-[8px] text-slate-500 font-bold tracking-widest uppercase italic">Real-time_Synapse_Active</span>
        </div>
      </div>

      <svg viewBox="0 0 800 500" className="w-full h-full relative z-0">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Connections */}
        {connections.map((conn, idx) => {
          const x1 = 400 + ((idx % 2 === 0 ? 1 : -1) * (Math.floor(idx / 2) * 100 + 50));
          const y1 = layerY(conn.start.layer);
          const x2 = 400 + (((idx+1) % 2 === 0 ? 1 : -1) * (Math.floor((idx+1) / 2) * 100 + 50));
          const y2 = layerY(conn.end.layer);
          
          return (
            <path 
              key={`path-${idx}`}
              d={`M ${x1} ${y1} C ${x1} ${(y1+y2)/2}, ${x2} ${(y1+y2)/2}, ${x2} ${y2}`}
              stroke="url(#line-grad)"
              strokeWidth="0.5"
              fill="none"
              className="opacity-20 animate-pulse"
            />
          );
        })}
        
        <linearGradient id="line-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>

        {/* Node Layers */}
        {nodes.map((node, i) => {
          const x = 400 + ((i % 2 === 0 ? 1 : -1) * (Math.floor(i / 2) * 100 + 50));
          const y = layerY(node.layer);
          const color = getStatusColor(node.status);
          
          return (
            <g key={node.id} className="cursor-pointer">
              <circle cx={x} cy={y} r="22" fill="#020617" stroke={color} strokeWidth="1" className="opacity-40" />
              <circle cx={x} cy={y} r="18" fill="none" stroke={color} strokeWidth="2" filter="url(#glow)" />
              
              <foreignObject x={x - 8} y={y - 8} width="16" height="16">
                <div style={{ color }} className="flex items-center justify-center">
                  {getNodeIcon(node)}
                </div>
              </foreignObject>
              
              <text x={x} y={y + 35} textAnchor="middle" fill={color} fontSize="8" className="fira-code font-black uppercase tracking-widest">{node.name}</text>
              <text x={x} y={y + 45} textAnchor="middle" fill="#475569" fontSize="6" className="fira-code font-bold">{node.ip} | {node.provider || 'CORE'}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default NetworkTopology;
