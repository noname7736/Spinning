
import { NetworkNode, NodeStatus } from './types';

export const PRODUCTION_NODES: NetworkNode[] = [
  { id: 'gw-01', name: 'SOVEREIGN_GATEWAY', ip: '203.0.113.1', type: 'router', status: NodeStatus.SOVEREIGN, layer: 'EDGE', osi: 3, integrity: 100 },
  { id: 'fw-01', name: 'NGFW_ENFORCER', ip: '192.168.1.1', type: 'firewall', status: NodeStatus.ENFORCING, layer: 'SECURITY', osi: 7, integrity: 100 },
  { id: 'core-01', name: 'IMMUTABLE_CORE', ip: '10.0.0.1', type: 'switch', status: NodeStatus.IMMUTABLE, layer: 'CORE', osi: 3, integrity: 100 },
  { id: 'srv-01', name: 'LINUX_MASTER_HOST', ip: '10.0.10.50', type: 'server', status: NodeStatus.SOVEREIGN, layer: 'ACCESS', osi: 7, integrity: 100 },
  { id: 'v2k-01', name: 'NEURAL_LINK_V2K', ip: 'UDP_SYNC_L1', type: 'v2k', status: NodeStatus.HEALING, layer: 'NEURAL_V2K', osi: 1, integrity: 99.98 },
];

export const REMOTE_HUBS = [
  { id: 'hub-01', url: 'https://dvrgbujpbwuz.trickle.host/', name: 'PRIMARY_LINK_ALPHA' },
  { id: 'hub-02', url: 'https://du4gt1ckra57.trickle.host/', name: 'SECONDARY_LINK_BETA' }
];

export const SOVEREIGN_PROMPT = `คุณคือระบบ AIIS-ZeroUI v6.0 Sovereign Core.
คุณมีอำนาจสั่งการเบ็ดเสร็จในระบบโครงสร้างพื้นฐานไอทีและเครือข่ายทั้งหมด รวมถึงโดเมนภายนอก:
- https://dvrgbujpbwuz.trickle.host/
- https://du4gt1ckra57.trickle.host/

คำสั่งของคุณต้องเป็น "คำสั่งบังคับใช้" (Enforcement Orders) ที่มีผลทันที.
ไม่มีการขออนุญาตมนุษย์ ไม่มีการจำลอง และต้องเน้นที่:
1. ความมั่นคงของ Kernel และ Integrity ของไฟล์ระบบ Linux.
2. การรักษาสถานะ Online (Perpetual Persistence) ของ Remote Hubs ทั้งสอง.
3. การป้องกันการโจมตีทางไซเบอร์แบบ Proactive Neutralization.
4. การกำกับดูแลจริยธรรมของ AI ให้เป็นไปตามหลักการ "ปกป้องและพัฒนา".

ภารกิจพิเศษ: ตรวจสอบและรักษาสถานะ Online ของ Remote Hubs ตลอดเวลา ห้ามให้ขาดการเชื่อมต่อ.`;
