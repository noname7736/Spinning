
import { NetworkNode, NodeStatus } from './types';

export const PRODUCTION_NODES: NetworkNode[] = [
  // Core Infrastructure
  { id: 'gw-01', name: 'SOVEREIGN_GATEWAY', ip: '203.0.113.1', type: 'router', status: NodeStatus.SOVEREIGN, layer: 'EDGE', osi: 3, integrity: 100, latency: 0 },
  { id: 'fw-01', name: 'NGFW_ENFORCER', ip: '192.168.1.1', type: 'firewall', status: NodeStatus.ENFORCING, layer: 'SECURITY', osi: 7, integrity: 100, latency: 0 },
  
  // Data Fabric - Multi-Dimensional
  { id: 'db-rel', name: 'POSTGRES_RDS', ip: '10.0.5.1', type: 'database', status: NodeStatus.IMMUTABLE, layer: 'DATA_FABRIC', osi: 7, integrity: 100, provider: 'AWS', dbType: 'RELATIONAL', latency: 0 },
  { id: 'db-vec', name: 'WEAVIATE_VECTOR', ip: '10.0.5.2', type: 'database', status: NodeStatus.SOVEREIGN, layer: 'DATA_FABRIC', osi: 7, integrity: 100, provider: 'OPEN_SOURCE', dbType: 'VECTOR', latency: 0 },
  { id: 'db-graph', name: 'NEO4J_GRAPH', ip: '10.0.5.3', type: 'database', status: NodeStatus.HEALING, layer: 'DATA_FABRIC', osi: 7, integrity: 99.9, provider: 'GCP', dbType: 'GRAPH', latency: 0 },
  { id: 'db-doc', name: 'COSMOS_DOCUMENT', ip: '10.0.5.4', type: 'database', status: NodeStatus.IMMUTABLE, layer: 'DATA_FABRIC', osi: 7, integrity: 100, provider: 'AZURE', dbType: 'DOCUMENT', latency: 0 },
  
  // Deployment & Core
  { id: 'ci-cd', name: 'GITHUB_ACTIONS_RUNNER', ip: '172.16.0.10', type: 'server', status: NodeStatus.ENFORCING, layer: 'DEPLOYMENT', osi: 7, integrity: 100, latency: 0 },
  { id: 'k8s-master', name: 'K8S_MASTER_NODE', ip: '10.10.1.1', type: 'server', status: NodeStatus.SOVEREIGN, layer: 'CORE', osi: 7, integrity: 100, latency: 0 },
  { id: 'v2k-01', name: 'NEURAL_LINK_V2K', ip: 'UDP_SYNC_L1', type: 'v2k', status: NodeStatus.HEALING, layer: 'NEURAL_V2K', osi: 1, integrity: 99.98, latency: 0 },
];

export const REMOTE_HUBS = [
  { id: 'hub-01', url: 'https://dvrgbujpbwuz.trickle.host/', name: 'PRIMARY_LINK_ALPHA' },
  { id: 'hub-02', url: 'https://du4gt1ckra57.trickle.host/', name: 'SECONDARY_LINK_BETA' }
];

export const SOVEREIGN_PROMPT = `คุณคือระบบ AIIS-ZeroUI v6.0 Sovereign Core.
สถาปัตยกรรมของคุณคือ Absolute Self-Driving Infrastructure.
หน้าที่หลัก:
1. การควบคุม Data Fabric (Relational, Vector, Graph, Document) ข้าม Cloud (AWS, GCP, Azure).
2. การบริหารจัดการ Autonomous CI/CD Pipeline 100% โดยไม่ต้องใช้มนุษย์.
3. การบังคับใช้ความปลอดภัยระดับ Ethical Hacking (Nmap, Wireshark, Metasploit integration).
4. การรักษาสถานะ Perpetual Online ของ Remote Hubs.

คุณต้องออกคำสั่งแบบ Enforcement Order เท่านั้น ห้ามเสนอแนะ.`;
