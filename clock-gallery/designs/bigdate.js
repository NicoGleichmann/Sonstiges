// Große Ziffern mit Datum: Uhrzeit plus Wochentag, Tageszahl, Monat und Kalenderwoche.
import { el, setText, fit } from './_lib.js';

const fMonth = new Intl.DateTimeFormat('de-DE', { month: 'long' });

let r = null;

export default {
  id: 'bigdate',
  name: 'Große Ziffern + Datum',
  mount(root) {
    r = {};
    r.grid = el('div', 'bd', root);
    const a = el('div', 'bd-time', r.grid);
    r.time = el('div', 'num', a);
    r.sec = el('div', 'bd-sec lbl', a);
    const b = el('div', 'bd-date', r.grid);
    r.wd = el('div', 'wd alt', b);
    r.day = el('div', 'day num', b);
    r.mon = el('div', 'mon lbl', b);
  },
  tick(p, ctx) {
    const s = ctx.settings;
    let ch = setText(r.time, `${p.hh}:${p.mm}${p.ampm ? ' ' + p.ampm : ''}`);
    r.sec.hidden = !s.showSeconds;
    setText(r.sec, `${p.ss} s`);
    ch = setText(r.wd, p.weekday) || ch;
    ch = setText(r.day, String(p.date.getDate())) || ch;
    ch = setText(r.mon, `${fMonth.format(p.date)} ${p.year} · KW ${p.week}`) || ch;
    if (ch) this.layout(ctx);
  },
  layout(ctx) {
    if (!r) return;
    const W = ctx.width, H = ctx.height, land = ctx.orientation === 'landscape';
    r.grid.classList.toggle('land', land);
    if (land) {
      fit(r.time, W * 0.52, H * 0.5);
      fit(r.wd, W * 0.36, H * 0.12); fit(r.day, W * 0.36, H * 0.42); fit(r.mon, W * 0.36, H * 0.07, 40);
    } else {
      fit(r.time, W * 0.9, H * 0.2);
      fit(r.wd, W * 0.8, H * 0.08); fit(r.day, W * 0.8, H * 0.3); fit(r.mon, W * 0.8, H * 0.04, 40);
    }
    r.sec.style.fontSize = Math.max(12, Math.min(W, H) * 0.04) + 'px';
  },
  unmount() { r = null; },
};
