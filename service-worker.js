const CACHE_NAME = 'biblia-app-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/bible.xml',
  '/service-worker.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/voice.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  // Limpiar cachés antiguos y tomar control inmediato
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  );
});
