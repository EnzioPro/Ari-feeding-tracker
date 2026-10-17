// Service worker: lets the installed app show reminders with Snooze / Fed buttons.
const CACHE = 'feeding-tracker-v1';
const FILES = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html'))));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const action = e.action || 'fed';
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (all.length) {
      const c = all[0];
      if (action !== 'snooze') await c.focus();
      c.postMessage({ action });
    } else {
      await self.clients.openWindow('./#' + action);
    }
  })());
});
