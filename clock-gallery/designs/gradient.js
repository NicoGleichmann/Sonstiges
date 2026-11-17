// Gradient (Tageszeit): Farbfeld vom unteren Rand, Farbe folgt der Uhrzeit. Oben bleibt es schwarz (AMOLED).
import { el, setText, fit } from './_lib.js';

// Stützpunkte: Stunde → [innen, außen]
const STOPS = [
  [0, '#0b1030', '#05060f'], [5, '#1a1440', '#07061a'], [6.5, '#7a3a5a', '#24142e'], [8, '#d0784a', '#3a1f2a'],
  [10, '#2f6db3', '#0e1f3a'], [13, '#3c86c9', '#10284a'], [16, '#d79a42', '#3a2614'], [18.5, '#c4503a', '#3a1420'],
  [20, '#6a2a6a', '#1e0d26'], [22, '#1c1650', '#0a0820'], [24, '#0b1030', '#05060f'],
];
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; };

export function skyColors(hour) {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [h0, a0, b0] = STOPS[i], [h1, a1, b1] = STOPS[i + 1];
    if (hour >= h0 && hour <= h1) { const t = (hour - h0) / (h1 - h0); return [mix(a0, a1, t), mix(b0, b1, t)]; }
  }
  return [STOPS[0][1], STOPS[0][2]];
}

let r = null;

export default {
  id: 'gradient',
  name: 'Gradient (Tageszeit)',
  mount(root) {
    r = {};
    r.sky = el('div', 'sky', root);
    r.box = el('div', 'gr-box', root);
    r.time = el('div', 'num', r.box);
    r.date = el('div', 'lbl', r.box);
  },
  tick(p, ctx) {
    const s = ctx.settings;
    const hour = p.H + p.m / 60;
    if (r.lastMin !== p.m || r.mono !== !!ctx.theme.mono) {
      r.lastMin = p.m; r.mono = !!ctx.theme.mono;
      const [a, b] = r.mono ? ['var(--accent)', 'var(--ghost)'] : skyColors(hour);
      r.sky.style.setProperty('--c1', a);
      r.sky.style.setProperty('--c2', b);
    }
    let ch = setText(r.time, `${p.hh}:${p.mm}${p.ampm ? ' ' + p.ampm : ''}`);
    r.date.hidden = !s.showDate;
    ch = setText(r.date, s.showSeconds ? `${p.dateLong} · ${p.ss}` : p.dateLong) || ch;
    if (ch && (r.time.textContent.length !== r.len || r.date.textContent.length !== r.dlen)) {
      r.len = r.time.textContent.length; r.dlen = r.date.textContent.length; this.layout(ctx);
    }
  },
  layout(ctx) {
    if (!r) return;
    const land = ctx.orientation === 'landscape';
    fit(r.time, ctx.width * 0.86, ctx.height * (land ? 0.5 : 0.3));
    fit(r.date, ctx.width * 0.8, ctx.height * 0.06, 40);
  },
  unmount() { r = null; },
};
