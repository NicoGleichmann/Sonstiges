// Service Worker: lädt alle Dateien beim ersten Start in den Cache, danach läuft die App komplett offline.
// Neue/geänderte Dateien: VERSION erhöhen (und APP_VERSION in js/app.js), neue Dateien in ASSETS eintragen.
const VERSION = '1.0.0';
const CACHE = 'clockgallery-' + VERSION;
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/fonts.css',
  'css/app.css',
  'css/designs.css',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'js/app.js',
  'js/burnin.js',
  'js/format.js',
  'js/gestures.js',
  'js/settings.js',
  'js/themes.js',
  'js/ticker.js',
  'js/wakelock.js',
  'designs/_lib.js',
  'designs/analog-classic.js',
  'designs/analog-minimal.js',
  'designs/bigdate.js',
  'designs/flip.js',
  'designs/gradient.js',
  'designs/index.js',
  'designs/minimal.js',
  'designs/neon.js',
  'designs/ring.js',
  'designs/segment7.js',
  'designs/terminal.js',
  'designs/typo.js',
  'designs/wortuhr.js',
  'fonts/archivo-latin-800-normal.woff2',
  'fonts/audiowide-latin-400-normal.woff2',
  'fonts/caveat-latin-600-normal.woff2',
  'fonts/cormorant-garamond-latin-400-italic.woff2',
  'fonts/doto-latin-800-normal.woff2',
  'fonts/fraunces-latin-300-italic.woff2',
  'fonts/fraunces-latin-800-normal.woff2',
  'fonts/ibm-plex-mono-latin-300-normal.woff2',
  'fonts/inter-tight-latin-200-normal.woff2',
  'fonts/inter-tight-latin-300-normal.woff2',
  'fonts/inter-tight-latin-500-normal.woff2',
  'fonts/jetbrains-mono-latin-400-normal.woff2',
  'fonts/jost-latin-400-normal.woff2',
  'fonts/jost-latin-500-normal.woff2',
  'fonts/manrope-latin-300-normal.woff2',
  'fonts/manrope-latin-500-normal.woff2',
  'fonts/poiret-one-latin-400-normal.woff2',
  'fonts/saira-latin-200-normal.woff2',
  'fonts/saira-stencil-one-latin-400-normal.woff2',
  'fonts/share-tech-mono-latin-400-normal.woff2',
  'fonts/silkscreen-latin-400-normal.woff2',
  'fonts/space-mono-latin-400-normal.woff2',
  'fonts/space-mono-latin-700-normal.woff2',
  'fonts/zen-kaku-gothic-new-latin-300-normal.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('clockgallery-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache zuerst; nur was fehlt, kommt aus dem Netz (und wird dann ebenfalls gespeichert).
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('index.html', { cacheName: CACHE }).then(r => r || fetch(req)));
    return;
  }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});
