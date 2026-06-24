const CACHE = 'banimal-v3';
const SHELL = ['/', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/api/')) return;
  e.respondWith(
    caches.match(e.request).then(
      (cached) => cached || fetch(e.request).then((res) => {
        if (res.ok && url.origin === self.location.origin) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      })
    )
  );
});

self.addEventListener('push', (e) => {
  if (!e.data) return;
  const d = e.data.json();
  e.waitUntil(
    self.registration.showNotification(d.title || 'Banimal', {
      body: d.body || '',
      icon: 'https://banimal.co.za/icon-192.png',
      badge: 'https://banimal.co.za/favicon-32.png',
      image: d.image || '',
      data: { url: d.url || '/' },
      actions: d.actions || [],
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const target = e.notification.data?.url || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const hit = list.find((c) => c.url === target);
      if (hit) return hit.focus();
      return clients.openWindow(target);
    })
  );
});
