// Typografie: Uhrzeit in Worten, Stunde schwer, Minute im Kontrast-Schnitt.
import { el, setText, fit } from './_lib.js';
import { numberWord } from '../js/format.js';

let r = null;

export default {
  id: 'typo',
  name: 'Typografie',
  mount(root) {
    r = {};
    r.box = el('div', 'typo', root);
    r.h = el('div', 'tw-h num', r.box);
    r.u = el('div', 'tw-u lbl', r.box, 'Uhr');
    r.m = el('div', 'tw-m num alt', r.box);
    r.bar = el('div', 'tw-bar', r.box);
    r.fill = el('i', '', r.bar);
    r.date = el('div', 'tw-d lbl', r.box);
  },
  tick(p, ctx) {
    const s = ctx.settings;
    let ch = setText(r.h, numberWord(p.h));
    ch = setText(r.m, p.m ? numberWord(p.m) : 'punkt') || ch;
    ch = setText(r.u, p.ampm ? `Uhr · ${p.ampm}` : 'Uhr') || ch;
    r.bar.hidden = !s.showSeconds;
    r.fill.style.width = (p.s / 59 * 100).toFixed(1) + '%';
    r.date.hidden = !s.showDate;
    ch = setText(r.date, p.dateLong) || ch;
    if (ch) this.layout(ctx);
  },
  layout(ctx) {
    if (!r) return;
    const W = ctx.width, H = ctx.height, land = ctx.orientation === 'landscape';
    fit(r.h, W * 0.9, H * (land ? 0.36 : 0.26));
    fit(r.m, W * 0.9, H * (land ? 0.3 : 0.22));
    fit(r.u, W * 0.4, H * 0.06, 44);
    fit(r.date, W * 0.8, H * 0.05, 32);
  },
  unmount() { r = null; },
};
