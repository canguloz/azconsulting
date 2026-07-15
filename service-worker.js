const CACHE_NAME = 'azconsulting-v3';

const urlsToCache = [
  '/azconsulting/',
  '/azconsulting/index.html',
  '/azconsulting/assets/css/styles.css',
  '/azconsulting/assets/js/main.js',
  '/azconsulting/blog/blog-ia.html',
  '/azconsulting/blog/blog-ciberseguridad.html',
  '/azconsulting/blog/blog-nube.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  const cacheAllowlist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});