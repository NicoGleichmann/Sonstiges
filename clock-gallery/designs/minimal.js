// Minimal digital: große Ziffern, kleine Sekunden, Datum darunter.
import { el, setText, fit } from './_lib.js';

let r = null;

export default {
  id: 'minimal',
  name: 'Minimal',
  mount(root) {
    r = {};
    r.wrap = el('div', 'wrap', root);
    r.time = el('div', 'time num', r.wrap);
    r.hm = el('span', 'hm', r.time);
    r.sec = el('span', 'sec alt', r.time);
    r.ap = el('span', 'ap lbl', r.time);
    r.date = el('div', 'date lbl', r.wrap);
  },
  tick(p, ctx) {
    const s = ctx.settings;
    let changed = setText(r.hm, `${p.hh}:${p.mm}`);
    r.sec.hidden = !s.showSeconds;
    setText(r.sec, p.ss);
    changed = setText(r.ap, p.ampm) || changed;
    r.date.hidden = !s.showDate;
    setText(r.date, p.dateLong);
    if (changed || r.sig !== `${s.showSeconds}`) { r.sig = `${s.showSeconds}`; this.layout(ctx); }
  },
  layout(ctx) {
    if (!r) return;
    const land = ctx.orientation === 'landscape';
    fit(r.time, ctx.width * 0.92, ctx.height * (land ? 0.62 : 0.4));
    fit(r.date, ctx.width * 0.86, ctx.height * 0.07, 48);
  },
  unmount() { r = null; },
};
