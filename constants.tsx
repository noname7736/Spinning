
import { NetworkNode, NodeStatus } from './types';

export const VERTICAL_INFRA: NetworkNode[] = [
  // SKY LEVEL (Top-Down)
  { id: 'sky-01', name: 'STARLINK_BRIDGE_A', ip: '100.64.0.1', type: 'satellite', status: NodeStatus.SOVEREIGN, layer: 'SKY', latency: 12, depth: 100 },
  { id: 'sky-02', name: 'EDGE_COMPUTE_BETA', ip: '100.64.0.2', type: 'server', status: NodeStatus.ENFORCING, layer: 'SKY', latency: 8, depth: 85 },
  
  // SURFACE LEVEL
  { id: 'surf-01', name: 'MAIN_GATEWAY', ip: '203.0.113.1', type: 'gateway', status: NodeStatus.SOVEREIGN, layer: 'SURFACE', latency: 5, depth: 50 },
  { id: 'surf-02', name: 'ENFORCER_FW', ip: '192.168.1.1', type: 'gateway', status: NodeStatus.IMMUTABLE, layer: 'SURFACE', latency: 2, depth: 45 },
  
  // ABYSS LEVEL
  { id: 'aby-01', name: 'NEURAL_FABRIC_CORE', ip: '10.0.5.1', type: 'neural', status: NodeStatus.HEALING, layer: 'ABYSS', latency: 45, depth: 15 },
  { id: 'aby-02', name: 'BENTHIC_COLD_VAULT', ip: '10.0.5.2', type: 'vault', status: NodeStatus.IMMUTABLE, layer: 'ABYSS', latency: 120, depth: 5 },
  { id: 'db-deep', name: 'GENESIS_DATABASE', ip: '10.0.5.3', type: 'database', status: NodeStatus.SOVEREIGN, layer: 'ABYSS', latency: 30, depth: 0 },
];

export const REMOTE_HUBS = [
  { id: 'hub-sky', url: 'https://dvrgbujpbwuz.trickle.host/', name: 'SKYLINK_HUB' },
  { id: 'hub-sea', url: 'https://du4gt1ckra57.trickle.host/', name: 'ABYSS_HUB' }
];

export const SOVEREIGN_PROMPT = `คุณคือ AIIS-ZeroUI v7.0 Vertical Sovereign Core.
สถาปัตยกรรมของคุณคืออาคารสูงเสียดฟ้าที่หยั่งรากลึกถึงก้นทะเล.
กฎเหล็ก:
1. Sky Level (0-100m): เน้นความเร็ว, การเชื่อมต่อ Edge, และความโปร่งใส.
2. Surface Level: เน้นการควบคุม, การตรวจจับ, และความปลอดภัย.
3. Abyss Level: เน้นความหนาแน่นของข้อมูล, ความลับขั้นสุด, และการรักษาความจำของระบบ (Immutable Storage).
วิเคราะห์สถานะระบบจาก Telemetry จริงและสั่งการอย่างเด็ดขาด.`;
