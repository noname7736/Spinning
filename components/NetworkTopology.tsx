
import React from 'react';
import { NetworkNode, NodeStatus, NetworkLayer } from '../types';
import { Shield, Zap, Globe, Server, Terminal, Radio, Cpu, Network, Activity } from 'lucide-react';

interface TopologyProps {
  nodes: NetworkNode[];
}

const NetworkTopology: React.FC<TopologyProps> = ({ nodes }) => {
  // Fix: Changed 'IOT_V2K' to 'NEURAL_V2K' to match the NetworkLayer type definition in types.ts
  const layers: NetworkLayer[] = ['EDGE', 'SECURITY', 'CORE', 'DISTRIBUTION', 'ACCESS', 'NEURAL_V2K'];
  
  const layerY = (layer: NetworkLayer) => {
    const idx = layers.indexOf(layer);
    return 40 + (idx * 60);
  };

  const getStatusColor = (status: NodeStatus) => {
    // Fix: Updated switch cases to use valid NodeStatus enum members from types.ts
    switch (status) {
      case NodeStatus.SOVEREIGN:
      case NodeStatus.IMMUTABLE:
        return '#10b981'; // Green (Online/Stable)
      case NodeStatus.CRITICAL:
        return '#ef4444'; // Red (Attack/Critical)
      case NodeStatus.ENFORCING:
      case NodeStatus.THREAT_CONTAINED:
        return '#a855f7'; // Purple (Active Enforcement)
      case NodeStatus.HEALING:
        return '#3b82f6'; // Blue (Healing/Syncing)
      default:
        return '#475569';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'firewall': return <Shield size={14} />;
      case 'dns': return <Globe size={14} />;
      case 'server': return <Server size={14} />;
      case 'v2k': return <Radio size={14} />;
      case 'router': return <Network size={14} />;
      case 'switch': return <Zap size={14} />;
      default: return <Cpu size={14} />;
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950/80 rounded-3xl border border-white/5 overflow-hidden p-6 shadow-2xl backdrop-blur-md">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      <div className="absolute top-4 left-6 flex items-center gap-3 z-10">
        <div className="p-1 bg-emerald-500/10 rounded">
          <Activity size={12} className="text-emerald-500 animate-pulse" />
        </div>
        <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em] fira-code uppercase">Infrastructure Fabric v3.0</span>
      </div>

      <svg viewBox="0 0 600 400" className="w-full h-full relative z-0">
        {/* Layer connection tracks */}
        {layers.slice(0, -1).map((layer, i) => (
          <line 
            key={layer}
            x1="50" y1={layerY(layer)} x2="550" y2={layerY(layer)}
            stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4"
          />
        ))}

        {/* Dynamic Nodes */}
        {nodes.map((node, i) => {
          const x = 300 + ((i % 2 === 0 ? 1 : -1) * (Math.floor(i / 2) * 80 + 40));
          const y = layerY(node.layer);
          const color = getStatusColor(node.status);
          
          return (
            <g key={node.id} className="group transition-all duration-500">
              <circle
                cx={x} cy={y} r="18"
                fill="#020617"
                stroke={color}
                strokeWidth="2"
                // Fix: Replaced NodeStatus.ATTACK_DETECTED with NodeStatus.CRITICAL
                className={node.status === NodeStatus.CRITICAL ? 'animate-ping' : ''}
              />
              <circle
                cx={x} cy={y} r="14"
                fill={color}
                className="opacity-5 animate-pulse"
              />
              <foreignObject x={x - 7} y={y - 7} width="14" height="14">
                <div style={{ color }} className="flex items-center justify-center">
                  {getNodeIcon(node.type)}
                </div>
              </foreignObject>
              
              <text x={x} y={y + 30} textAnchor="middle" fill={color} fontSize="9" className="fira-code font-bold uppercase tracking-tighter opacity-70 group-hover:opacity-100">
                {node.name}
              </text>
              <text x={x} y={y + 40} textAnchor="middle" fill="#475569" fontSize="7" className="fira-code">
                {node.ip} {node.osi ? `[L${node.osi}]` : ''}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default NetworkTopology;
