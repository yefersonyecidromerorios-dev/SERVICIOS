const CACHE_NAME = 'entrega-imc-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './logo-imc.png',
  './logo-imp.png',
  './icon-192.png',
  './icon-512.png'
];

// Instalación: guarda los archivos principales en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activación: limpia cachés viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: sirve desde caché primero, si no hay conexión
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).catch(() => {
        // Si falla la red y no hay caché, intenta servir el index como fallback
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
