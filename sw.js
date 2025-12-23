
const CACHE_NAME = 'aiis-sovereign-core-v6';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// ระบบ Heartbeat จำลองการทำงานเบื้องหลัง
let heartbeatCount = 0;
setInterval(() => {
  heartbeatCount++;
  // ทุกๆ 10 heartbeats จะทำการส่งสัญญาณว่าระบบยังเฝ้าระวังอยู่
  if (heartbeatCount % 60 === 0) {
    self.registration.showNotification('Sovereign Core: Status Active', {
      body: 'Autonomous surveillance protocol is running in background layer.',
      icon: 'https://cdn-icons-png.flaticon.com/512/543/543204.png',
      tag: 'sovereign-status',
      silent: true
    });
  }
}, 1000);

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.text() : 'Threat detected';
  event.waitUntil(
    self.registration.showNotification('AIIS SECURITY ALERT', {
      body: data,
      badge: 'https://cdn-icons-png.flaticon.com/512/543/543204.png'
    })
  );
});
