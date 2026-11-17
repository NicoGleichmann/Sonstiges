// Ring/Fortschritt: drei Ringe für Stunde (12 h), Minute und Sekunde, Uhrzeit in der Mitte.
import { el, svgEl, setText, fit } from './_lib.js';

let r = null;

function ring(svg, radius, cls) {
  svgEl('circle', { cx: 100, cy: 100, r: radius, class: 'track' }, svg);
  return svgEl('circle', { cx: 100, cy: 100, r: radius, class: 'arc ' + cls, pathLength: 1000, 'stroke-dasharray': '0 1000', transform: 'rotate(-90 100 100)' }, svg);
}

export default {
  id: 'ring',
  name: 'Ring',
  mount(root) {
    r = {};
    r.box = el('div', 'ring-box', root);
    const svg = svgEl('svg', { viewBox: '0 0 200 200', 'aria-hidden': 'true' }, r.box);
    r.s = ring(svg, 94, 'arc-s');
    r.m = ring(svg, 84, 'arc-m');
    r.h = ring(svg, 74, 'arc-h');
    const c = el('div', 'ring-center', r.box);
    r.time = el('div', 'num', c);
    r.date = el('div', 'lbl', c);
  },
  tick(p, ctx) {
    const s = ctx.settings;
    const set = (n, frac) => n.setAttribute('stroke-dasharray', `${Math.max(0.5, frac * 1000).toFixed(1)} 1000`);
    set(r.h, ((p.H % 12) * 60 + p.m) / 720);
    set(r.m, (p.m * 60 + p.s) / 3600);
    set(r.s, p.s / 60);
    r.s.parentNode.style.setProperty('--sec-vis', s.showSeconds ? 1 : 0);
    let ch = setText(r.time, `${p.hh}:${p.mm}`);
    r.date.hidden = !s.showDate;
    ch = setText(r.date, p.dateShort + (p.ampm ? ' · ' + p.ampm : '')) || ch;
    if (ch) this.layout(ctx);
  },
  layout(ctx) {
    if (!r) return;
    const d = Math.min(ctx.width, ctx.height) * 0.94;
    r.box.style.width = r.box.style.height = d + 'px';
    fit(r.time, d * 0.5, d * 0.22);
    fit(r.date, d * 0.46, d * 0.06, 40);
  },
  unmount() { r = null; },
};
