/* PlanetMC — service worker.
   Objetivo: que las guías se puedan consultar sin conexión (dentro del juego,
   en el metro, con mala cobertura) y que la navegación sea instantánea.
   Estrategias: red primero para el HTML y los datos (con copia de respaldo),
   caché primero para los estáticos que no cambian de nombre. */
const VERSION = 'pmc-v4';
const SHELL = 'shell-' + VERSION;
const RUNTIME = 'run-' + VERSION;

/* Lo que se guarda al instalar: la portada, las guías y sus estáticos. */
const PRECACHE = [
  '/',
  '/guias',
  '/guias/primeros-pasos',
  '/guias/comandos',
  '/guias/protecciones',
  '/guias/casas-y-warps',
  '/guias/rtp',
  '/guias/economia',
  '/guias/trabajos',
  '/guias/misiones',
  '/guias/subastas',
  '/guias/pvp',
  '/guias/clanes',
  '/guias/rangos',
  '/guias/extras',
  '/guias/normas',
  '/guias/faq',
  '/sin-conexion',
  '/assets/wiki.css',
  '/assets/wiki.js',
  '/assets/wiki-index.js',
  '/assets/logo.webp',
  '/assets/java.webp',
  '/assets/bedrock.webp',
  '/assets/img/logo-192.png',
  '/favicon-96.png',
  '/apple-touch-icon.png',
  '/favicon.svg',
  '/site.webmanifest',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL)
      // addAll falla entero si un recurso falla: se añaden de uno en uno.
      .then((c) => Promise.all(PRECACHE.map((u) => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => !k.endsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

const esHTML = (req) => req.mode === 'navigate' ||
  (req.headers.get('accept') || '').includes('text/html');

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // nada de terceros (analítica, API del servidor)

  // HTML: red primero, caché si no hay conexión, y una página propia como último recurso.
  if (esHTML(req)) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone();
          caches.open(RUNTIME).then((c) => c.put(req, copia));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true })
          .then((hit) => hit || caches.match('/sin-conexion')))
    );
    return;
  }

  // El historial de jugadores siempre fresco si se puede.
  if (url.pathname.startsWith('/data/')) {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // Estáticos: caché primero y actualización en segundo plano.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      const red = fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copia = res.clone();
          caches.open(RUNTIME).then((c) => c.put(req, copia));
        }
        return res;
      }).catch(() => hit);
      return hit || red;
    })
  );
});
