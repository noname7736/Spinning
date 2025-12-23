
export enum NodeStatus {
  SOVEREIGN = 'SOVEREIGN',
  ENFORCING = 'ENFORCING',
  IMMUTABLE = 'IMMUTABLE',
  HEALING = 'HEALING',
  OFFLINE = 'OFFLINE',
  SYNCING = 'SYNCING',
  // Added missing status used in NetworkTopology.tsx
  CRITICAL = 'CRITICAL'
}

// Added 'DEPLOYMENT' layer used in constants.tsx and NetworkTopology.tsx
export type NetworkLayer = 'EDGE' | 'SECURITY' | 'CORE' | 'DATA_FABRIC' | 'NEURAL_V2K' | 'DEPLOYMENT';

export interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  // Added 'switch' type used in NetworkTopology.tsx
  type: 'router' | 'firewall' | 'dns' | 'server' | 'v2k' | 'database' | 'switch';
  status: NodeStatus;
  layer: NetworkLayer;
  latency: number;
  // Added optional metadata properties used in constants.tsx
  osi?: number;
  integrity?: number;
  provider?: string;
  dbType?: string;
}

export interface DeploymentJob {
  id: string;
  stage: 'AUTH' | 'PULL' | 'BUILD' | 'DEPLOY' | 'VERIFY';
  progress: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
}

export interface SystemMetrics {
  cpuCores: number;
  memoryHeap: number;
  bandwidth: number;
  latency: number;
  batteryLevel: number;
  uptime: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  // Added 'ETHICAL' level used in AutonomousLog.tsx
  level: 'GOVERNANCE' | 'SECURITY' | 'KERNEL' | 'NETWORK' | 'ETHICAL';
  tag: string;
  message: string;
}
