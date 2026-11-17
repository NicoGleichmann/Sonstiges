// Neon: Leuchtröhren-Ziffern mit Glühen in der Akzentfarbe, Rahmen als zweite Röhre.
import { el, setText, fit } from './_lib.js';

let r = null;

export default {
  id: 'neon',
  name: 'Neon',
  mount(root) {
    r = {};
    r.frame = el('div', 'frame', root);
    r.time = el('div', 'tube num', r.frame);
    r.sub = el('div', 'script', r.frame);
  },
  tick(p, ctx) {
    const s = ctx.settings;
    let ch = setText(r.time, `${p.hh}:${p.mm}${s.showSeconds ? ':' + p.ss : ''}${p.ampm ? ' ' + p.ampm : ''}`);
    r.sub.hidden = !s.showDate;
    ch = setText(r.sub, p.weekday) || ch;
    const len = r.time.textContent.length;
    if (ch && len !== r.len) { r.len = len; this.layout(ctx); }
  },
  layout(ctx) {
    if (!r) return;
    const land = ctx.orientation === 'landscape';
    fit(r.time, ctx.width * 0.8, ctx.height * (land ? 0.42 : 0.24));
    fit(r.sub, ctx.width * 0.6, ctx.height * (land ? 0.14 : 0.08));
  },
  unmount() { r = null; },
};
