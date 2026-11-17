// 7-Segment retro: SVG-Segmente mit „Geister“-Segmenten. Hochformat gestapelt, Querformat in einer Zeile.
import { el, svgEl, setText } from './_lib.js';

const MAP = ['abcdef', 'bc', 'abged', 'abgcd', 'fgbc', 'afgcd', 'afgedc', 'abc', 'abcdefg', 'abcdfg'];
const SEG = {
  a: [8, 0, 44, 10], g: [8, 50, 44, 10], d: [8, 100, 44, 10],
  f: [0, 7, 10, 46], b: [50, 7, 10, 46], e: [0, 57, 10, 46], c: [50, 57, 10, 46],
};
const DW = 60, DH = 110, GAP = 14, COLW = 26;

let r = null;

function digit(parent, x, y, scale = 1) {
  const g = svgEl('g', { transform: `translate(${x} ${y}) scale(${scale}) skewX(-6)` }, parent);
  const segs = {};
  for (const [k, [sx, sy, w, h]] of Object.entries(SEG)) segs[k] = svgEl('rect', { x: sx, y: sy, width: w, height: h, rx: 4, class: 'seg' }, g);
  let cur = null;
  return {
    set(ch) {
      if (ch === cur) return; cur = ch;
      const on = ch === ' ' ? '' : MAP[+ch];
      for (const k in segs) segs[k].classList.toggle('on', on.includes(k));
    },
  };
}

function colon(parent, x, y, scale = 1) {
  const g = svgEl('g', { transform: `translate(${x} ${y}) scale(${scale})`, class: 'colon' }, parent);
  svgEl('rect', { x: 6, y: 30, width: 12, height: 12, rx: 3, class: 'seg on' }, g);
  svgEl('rect', { x: 2, y: 70, width: 12, height: 12, rx: 3, class: 'seg on' }, g);
  return g;
}

function build(root, land, withSec) {
  root.textContent = '';
  const svg = svgEl('svg', { class: 'seg7', 'aria-hidden': 'true', preserveAspectRatio: 'xMidYMid meet' }, root);
  const d = {};
  const pair = (x, y, s = 1) => [digit(svg, x, y, s), digit(svg, x + (DW + GAP) * s, y, s)];
  let w, h; const colons = [];
  if (land) {
    let x = 0;
    d.h = pair(x, 0); x += 2 * DW + GAP + 8;
    colons.push(colon(svg, x, 0)); x += COLW + 8;
    d.m = pair(x, 0); x += 2 * DW + GAP;
    if (withSec) {
      const s = 0.55; x += 18;
      colons.push(colon(svg, x, DH * (1 - s), s)); x += COLW * s + 10;
      d.s = pair(x, DH * (1 - s), s); x += (2 * DW + GAP) * s;
    }
    w = x + 8; h = DH;
  } else {
    d.h = pair(0, 0); d.m = pair(0, DH + 26);
    w = 2 * DW + GAP + 8; h = 2 * DH + 26;
    if (withSec) { const s = 0.5, sw = (2 * DW + GAP) * s; d.s = pair((w - sw) / 2, h + 24, s); h += 24 + DH * s; }
  }
  svg.setAttribute('viewBox', `-4 -4 ${w + 8} ${h + 8}`);
  return { svg, d, colons };
}

export default {
  id: 'segment7',
  name: '7-Segment retro',
  mount(root) {
    r = { stage: el('div', 'seg-stage', root), info: el('div', 'info lbl', root) };
  },
  tick(p, ctx) {
    const s = ctx.settings;
    const key = `${ctx.orientation}|${s.showSeconds}`;
    if (key !== r.key) { r.key = key; r.b = build(r.stage, ctx.orientation === 'landscape', s.showSeconds); }
    const hh = p.hh.padStart(2, ' ');
    r.b.d.h[0].set(hh[0]); r.b.d.h[1].set(hh[1]);
    r.b.d.m[0].set(p.mm[0]); r.b.d.m[1].set(p.mm[1]);
    if (r.b.d.s) { r.b.d.s[0].set(p.ss[0]); r.b.d.s[1].set(p.ss[1]); }
    r.b.colons.forEach(c => c.classList.toggle('dim', p.s % 2 === 1));
    const bits = [];
    if (p.ampm) bits.push(p.ampm);
    if (s.showDate) bits.push(p.dateShort);
    setText(r.info, bits.join('  ·  '));
    r.info.hidden = !bits.length;
  },
  layout(ctx) {
    if (!r) return;
    r.info.style.fontSize = Math.max(12, Math.min(ctx.width, ctx.height) * 0.045) + 'px';
  },
  unmount() { r = null; },
};
