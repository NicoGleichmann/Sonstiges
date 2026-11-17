// Service Worker: lädt alle Dateien beim ersten Start in den Cache, danach läuft die App komplett offline.
// Neue/geänderte Dateien: VERSION erhöhen (und APP_VERSION in js/app.js), neue Dateien in ASSETS eintragen.
const VERSION = '1.0.2';
const CACHE = 'clockgallery-' + VERSION;
const ASSETS = [
  './',
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

// Umgeleitete Antworten (Cloudflare leitet z. B. /index.html → / um) dürfen nicht für Seitenaufrufe
// ausgeliefert werden (Chrome: ERR_FAILED). Deshalb vor dem Speichern in eine „saubere“ Antwort kopieren.
async function clean(res) {
  if (!res.redirected) return res;
  const body = await res.blob();
  return new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers });
}

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(ASSETS.map(async u => {
      const res = await fetch(new Request(u, { cache: 'reload' }));
      if (!res.ok) throw new Error('Precache fehlgeschlagen: ' + u + ' (' + res.status + ')');
      await c.put(u, await clean(res));
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('clockgallery-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Seitenaufrufe: zuerst Netz (damit Updates ankommen), ohne Netz die gespeicherte Startseite.
// Alles andere: Cache zuerst; was fehlt, kommt aus dem Netz und wird gespeichert.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cached = await caches.match('./', { cacheName: CACHE });
      try {
        // Höchstens 4 s aufs Netz warten, sonst gespeicherte Version (Uhr soll sofort starten).
        const res = await Promise.race([fetch(req), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), cached ? 4000 : 30000))]);
        if (res.ok) return clean(res);
        return cached || res;
      } catch {
        return cached || Response.error();
      }
    })());
    return;
  }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(async res => {
      if (res.ok && res.type === 'basic') { const copy = await clean(res.clone()); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});
