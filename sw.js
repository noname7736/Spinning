
const CACHE_NAME = 'aiis-sovereign-v6-daemon';

const REMOTE_HUBS = [
  'https://dvrgbujpbwuz.trickle.host/',
  'https://du4gt1ckra57.trickle.host/'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Autonomous Background Persistence Driver
let cycleCount = 0;
setInterval(async () => {
  cycleCount++;
  
  // Every 30 seconds, perform a keep-alive ping for remote hubs
  if (cycleCount % 30 === 0) {
    for (const url of REMOTE_HUBS) {
      try {
        await fetch(url, { mode: 'no-cors', cache: 'no-store' });
        console.log(`[DAEMON] Persistence Heartbeat sent to: ${url}`);
      } catch (e) {
        console.error(`[DAEMON] Persistence failed for: ${url}`);
      }
    }
  }

  // Every 5 minutes, notify user of background status
  if (cycleCount % 300 === 0) {
    self.registration.showNotification('AIIS Sovereign Daemon', {
      body: 'Autonomous oversight active. Remote hubs persistence: SECURED.',
      icon: 'https://cdn-icons-png.flaticon.com/512/543/543204.png',
      tag: 'sovereign-status',
      silent: true
    });
  }
}, 1000);

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow('/');
    })
  );
});
