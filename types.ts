
export enum NodeStatus {
  SOVEREIGN = 'SOVEREIGN',
  ENFORCING = 'ENFORCING',
  IMMUTABLE = 'IMMUTABLE',
  HEALING = 'HEALING',
  OFFLINE = 'OFFLINE',
  SYNCING = 'SYNCING',
  CRITICAL = 'CRITICAL'
}

export type NetworkLayer = 'SKY' | 'SURFACE' | 'ABYSS';

export interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  type: 'satellite' | 'gateway' | 'server' | 'database' | 'neural' | 'vault';
  status: NodeStatus;
  layer: NetworkLayer;
  latency: number;
  depth: number; // For Vertical UI positioning
}

export interface SystemMetrics {
  cpuCores: number;
  memoryHeap: number;
  bandwidth: number;
  latency: number;
  pressure: number; // Calculated system pressure
  uptime: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'GOVERNANCE' | 'SECURITY' | 'KERNEL' | 'ENVIRONMENT';
  tag: string;
  message: string;
}
