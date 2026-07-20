const CACHE_NAME = 'azconsulting-v4';

// Recursos del shell de la app — se pre-cachean en la instalación
const PRECACHE_URLS = [
  '/azconsulting/',
  '/azconsulting/index.html',
  '/azconsulting/assets/css/styles.css',
  '/azconsulting/assets/js/main.js',
  '/azconsulting/assets/js/enhancements.js',
  '/azconsulting/blog/blog-ia.html',
  '/azconsulting/blog/blog-ciberseguridad.html',
  '/azconsulting/blog/blog-nube.html',
  '/azconsulting/blog/blog-chatbots.html',
  '/azconsulting/blog/blog-desarrollo.html',
  '/azconsulting/blog/blog-uxui.html',
];

// ─── INSTALL: Pre-cachear recursos del shell ───
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE: Limpiar cachés antiguas ───
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── FETCH: Estrategia según tipo de recurso ───
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptar peticiones al mismo origen
  if (url.origin !== location.origin) return;

  const isHTML = request.headers.get('Accept')?.includes('text/html');
  const isAsset = /\.(css|js|woff2?|avif|webp|jpg|png|svg|ico)$/i.test(url.pathname);

  if (isHTML) {
    // Network-First para HTML: siempre intenta la red primero para contenido fresco
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else if (isAsset) {
    // Cache-First para assets estáticos: velocidad máxima en revisitas
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        });
      })
    );
  } else {
    // Stale-While-Revalidate para el resto
    event.respondWith(
      caches.match(request).then(cached => {
        const fetchPromise = fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        });
        return cached || fetchPromise;
      })
    );
  }
});