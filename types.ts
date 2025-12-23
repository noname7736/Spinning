
export enum NodeStatus {
  SOVEREIGN = 'SOVEREIGN',
  ENFORCING = 'ENFORCING',
  IMMUTABLE = 'IMMUTABLE',
  HEALING = 'HEALING',
  THREAT_CONTAINED = 'THREAT_CONTAINED',
  CRITICAL = 'CRITICAL'
}

export type NetworkLayer = 'EDGE' | 'SECURITY' | 'CORE' | 'DISTRIBUTION' | 'ACCESS' | 'NEURAL_V2K';

export interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  type: 'router' | 'switch' | 'firewall' | 'dns' | 'server' | 'v2k' | 'iot' | 'cloud';
  status: NodeStatus;
  layer: NetworkLayer;
  osi: number;
  integrity: number;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  bandwidth: number;
  v2kEntropy: number;
  governanceCompliance: number;
  ethicalIntegrity: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'GOVERNANCE' | 'SECURITY' | 'KERNEL' | 'ETHICAL' | 'NEURAL';
  tag: string;
  message: string;
}
