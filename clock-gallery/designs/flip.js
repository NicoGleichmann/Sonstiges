// Flip-Uhr: Klappkarten. Hochformat 2×2 (Stunden über Minuten), Querformat 1×4.
import { el, setText, fit, reducedMotion } from './_lib.js';

let r = null;

function card(parent) {
  const c = el('div', 'card', parent);
  const half = cls => el('span', 'num', el('div', 'half ' + cls, c));
  const top = half('top'), bot = half('bot'), lt = half('leaf top'), lb = half('leaf bot');
  el('i', 'hinge', c);
  let val = null, t = 0;
  return {
    set(v) {
      if (v === val) return;
      const old = val; val = v;
      clearTimeout(t);
      if (old === null || reducedMotion()) {
        top.textContent = bot.textContent = lt.textContent = lb.textContent = v;
        c.classList.remove('go');
        return;
      }
      top.textContent = v; lt.textContent = old; bot.textContent = old; lb.textContent = v;
      c.classList.remove('go'); void c.offsetWidth; c.classList.add('go');
      t = setTimeout(() => { bot.textContent = v; lt.textContent = v; c.classList.remove('go'); }, 650);
    },
  };
}

export default {
  id: 'flip',
  name: 'Flip-Uhr',
  mount(root) {
    r = {};
    r.wrap = el('div', 'flip', root);
    const gh = el('div', 'grp', r.wrap);
    r.h = [card(gh), card(gh)];
    r.colon = el('div', 'colon', r.wrap); el('i', '', r.colon); el('i', '', r.colon);
    const gm = el('div', 'grp', r.wrap);
    r.m = [card(gm), card(gm)];
    r.foot = el('div', 'foot lbl', root);
  },
  tick(p, ctx) {
    const s = ctx.settings;
    const hh = p.hh.padStart(2, ' ');
    r.h[0].set(hh[0]); r.h[1].set(hh[1]);
    r.m[0].set(p.mm[0]); r.m[1].set(p.mm[1]);
    const bits = [];
    if (s.showSeconds) bits.push(p.ss);
    if (p.ampm) bits.push(p.ampm);
    if (s.showDate) bits.push(p.dateShort);
    const ch = setText(r.foot, bits.join('  ·  '));
    r.foot.hidden = !bits.length;
    if (ch && r.foot.textContent.length !== r.flen) { r.flen = r.foot.textContent.length; this.layout(ctx); }
  },
  layout(ctx) {
    if (!r) return;
    const W = ctx.width, H = ctx.height;
    const cw = ctx.orientation === 'landscape'
      ? Math.min(W * 0.92 / 4.5, H * 0.72 / 1.42)
      : Math.min(W * 0.88 / 2.06, H * 0.8 / 3.2);
    r.wrap.style.setProperty('--cw', Math.floor(cw) + 'px');
    r.cw = cw; r.W = W;
    fit(r.foot, W * 0.9, Math.min(cw * 0.22, 40), 40);
  },
  unmount() { r = null; },
};
