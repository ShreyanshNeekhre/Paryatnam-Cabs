// Service Worker for Paryatnam Cabs PWA
const CACHE_NAME = 'paryatnam-cabs-v1';
const urlsToCache = [
  '/',
  '/static/js/main.9672ccbe.js',
  '/static/css/main.064b42e3.css',
  '/manifest.json',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
}); 