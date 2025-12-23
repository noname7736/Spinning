
export enum NodeStatus {
  SOVEREIGN = 'SOVEREIGN',
  ENFORCING = 'ENFORCING',
  IMMUTABLE = 'IMMUTABLE',
  HEALING = 'HEALING',
  THREAT_CONTAINED = 'THREAT_CONTAINED',
  CRITICAL = 'CRITICAL',
  SYNCING = 'SYNCING'
}

export type NetworkLayer = 'EDGE' | 'SECURITY' | 'CORE' | 'DISTRIBUTION' | 'ACCESS' | 'NEURAL_V2K' | 'DEPLOYMENT' | 'DATA_FABRIC';

export interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  type: 'router' | 'switch' | 'firewall' | 'dns' | 'server' | 'v2k' | 'iot' | 'cloud' | 'database';
  status: NodeStatus;
  layer: NetworkLayer;
  osi: number;
  integrity: number;
  provider?: 'AWS' | 'GCP' | 'AZURE' | 'OPEN_SOURCE';
  dbType?: 'RELATIONAL' | 'VECTOR' | 'GRAPH' | 'DOCUMENT' | 'KEY_VALUE' | 'TIME_SERIES';
}

export interface DeploymentJob {
  id: string;
  stage: 'SOURCE' | 'BUILD' | 'TEST' | 'STAGING' | 'DEPLOY';
  status: 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'FAILURE';
  logs: string[];
  startTime: number;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  bandwidth: number;
  v2kEntropy: number;
  governanceCompliance: number;
  ethicalIntegrity: number;
  deploymentVelocity: number;
  dataConsistency: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'GOVERNANCE' | 'SECURITY' | 'KERNEL' | 'ETHICAL' | 'NEURAL' | 'DEPLOY' | 'FABRIC';
  tag: string;
  message: string;
}
