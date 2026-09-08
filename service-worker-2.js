// Tuition O Job Media — Service Worker
// Bump this on every deploy that changes cached files so old caches get purged.
const CACHE_VERSION = 'v1.2.0';
const CACHE_NAME = `tojm-cache-${CACHE_VERSION}`;

// Only same-origin, static "app shell" files are precached.
// Third-party scripts (Supabase, Chart.js, Google Fonts, GA/GTM/Clarity, Puter)
// are intentionally left alone so the SW never serves stale SDKs/tracking code.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/favicon.ico',
  '/icon-72.png',
  '/icon-96.png',
  '/icon-128.png',
  '/icon-144.png',
  '/icon-152.png',
  '/icon-180.png',
  '/icon-192.png',
  '/icon-384.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('tojm-cache-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ---- Chat push notifications ----
// Payload shape (see the send-chat-push Edge Function):
//   { title, body, tutorNumber, url }
// The server only ever sends one of these per tutor until they open the
// Chat tab (tm_chat_push_state), so there's no de-duplication to do here —
// each push that arrives is meant to be shown.
self.addEventListener('push', (event) => {
  let payload = { title: 'TuitionMedia', body: 'You have a new message.', url: '/#pageChat' };
  try {
    if (event.data) payload = Object.assign(payload, event.data.json());
  } catch (e) {
    // Non-JSON push data (shouldn't happen from our own backend) — fall
    // back to the default text above rather than failing silently.
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/icon-192.png',
      badge: '/icon-72.png',
      tag: 'tojm-chat', // collapses into one notification if somehow more than one is ever shown
      data: { url: payload.url || '/#pageChat' }
    })
  );
});

// Tapping the notification opens the PWA straight to the Chat tab (see
// index.html's updateBottomNavVisibility deep-link handling for "#pageChat")
// — or focuses an already-open tab and hash-navigates it there.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/#pageChat';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl).catch(() => {});
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests on our own origin. Everything else (Supabase API
  // calls, analytics, fonts, CDN scripts, POSTs, etc.) goes straight to the
  // network untouched.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // HTML navigations: network-first so users always get the latest page/data
  // when online, falling back to cache (and then a generic offline page) when not.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/offline.html'))
        )
    );
    return;
  }

  // Static app-shell assets (icons, manifest, favicon): cache-first for speed,
  // refreshed in the background whenever a newer copy is fetched.
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
