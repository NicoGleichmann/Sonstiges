// Alle Einstellungen unter einem Schlüssel, mit Versionsfeld. Fehlerhafte/fehlende Werte → Defaults.
const KEY = 'clockgallery.settings';
const VERSION = 1;

export const DEFAULTS = Object.freeze({
  v: VERSION,
  design: 'minimal',
  theme: 'instrument',
  hour12: false,
  showSeconds: true,
  showDate: true,
  brightness: 80,
  pixelShift: true,
  night: { enabled: true, from: '23:00', to: '06:00', level: 25, red: true },
});

const clone = o => JSON.parse(JSON.stringify(o));

export function load() {
  const s = clone(DEFAULTS);
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return s;
    const o = JSON.parse(raw);
    if (!o || o.v !== VERSION) return s;
    for (const k of Object.keys(s)) {
      if (k === 'night' && o.night && typeof o.night === 'object') {
        for (const n of Object.keys(s.night)) if (typeof o.night[n] === typeof s.night[n]) s.night[n] = o.night[n];
      } else if (k in o && typeof o[k] === typeof s[k]) s[k] = o[k];
    }
  } catch { /* Speicher gesperrt oder kaputt → Defaults */ }
  return s;
}

export function save(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch { return false; }
}

export function reset() {
  try { localStorage.removeItem(KEY); } catch {}
  return clone(DEFAULTS);
}
