
const BROADCAST = new BroadcastChannel('aiis_sovereign_fabric');
const HUB_URLS = [
  'https://dvrgbujpbwuz.trickle.host/',
  'https://du4gt1ckra57.trickle.host/'
];

self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// Real-time Health Monitor
setInterval(async () => {
  const statusReport = {};
  
  for (const url of HUB_URLS) {
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      
      // REAL FETCH - No Simulation
      await fetch(url, { 
        mode: 'no-cors', 
        cache: 'no-store', 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      const latency = Math.round(performance.now() - startTime);
      statusReport[url] = { online: true, latency };
    } catch (err) {
      statusReport[url] = { online: false, latency: 0 };
    }
  }

  BROADCAST.postMessage({
    type: 'FABRIC_UPDATE',
    payload: {
      timestamp: Date.now(),
      hubs: statusReport,
      userAgent: navigator.userAgent
    }
  });
}, 5000);

// Heartbeat for persistence
setInterval(() => {
  BROADCAST.postMessage({ type: 'HEARTBEAT', payload: { memory: processMemory() } });
}, 10000);

function processMemory() {
  return typeof performance !== 'undefined' && performance.memory 
    ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) 
    : 0;
}
