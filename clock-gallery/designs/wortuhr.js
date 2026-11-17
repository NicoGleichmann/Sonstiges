// Wortuhr (deutsch): alle Wörter stehen da, die aktuelle Zeit leuchtet. Fünf-Minuten-Schritte + Punkte für 1–4 Minuten.
import { el, fitBlock } from './_lib.js';

// [Schlüssel, Text, an vorheriges Wort anhängen?]
const VOCAB = [
  ['ES', 'ES'], ['IST', 'IST'],
  ['FUENF', 'FÜNF'], ['ZEHN', 'ZEHN'], ['VIERTEL', 'VIERTEL'], ['ZWANZIG', 'ZWANZIG'],
  ['VOR', 'VOR'], ['NACH', 'NACH'], ['HALB', 'HALB'],
  ['H12', 'ZWÖLF'], ['H1', 'EIN'], ['S', 'S', true], ['H2', 'ZWEI'], ['H3', 'DREI'], ['H4', 'VIER'],
  ['H5', 'FÜNF'], ['H6', 'SECHS'], ['H7', 'SIEBEN'], ['H8', 'ACHT'], ['H9', 'NEUN'],
  ['H10', 'ZEHN'], ['H11', 'ELF'], ['UHR', 'UHR'],
];

// Liefert die aktiven Schlüssel für eine Uhrzeit.
export function phrase(H, m) {
  const step = Math.floor(m / 5);
  const keys = ['ES', 'IST'];
  let hour = H % 12;
  const pre = [
    [], ['FUENF', 'NACH'], ['ZEHN', 'NACH'], ['VIERTEL', 'NACH'], ['ZWANZIG', 'NACH'],
    ['FUENF', 'VOR', 'HALB'], ['HALB'], ['FUENF', 'NACH', 'HALB'], ['ZWANZIG', 'VOR'],
    ['VIERTEL', 'VOR'], ['ZEHN', 'VOR'], ['FUENF', 'VOR'],
  ][step];
  keys.push(...pre);
  if (step >= 5) hour = (hour + 1) % 12;
  const h = hour === 0 ? 12 : hour;
  keys.push('H' + h);
  if (step === 0) keys.push('UHR');
  else if (h === 1) keys.push('S'); // „eins“ statt „ein“, außer bei „ein Uhr“
  return keys;
}

let r = null;

export default {
  id: 'wortuhr',
  name: 'Wortuhr',
  mount(root) {
    r = { words: {} };
    r.box = el('div', 'words', root);
    let last = null;
    for (const [key, text, join] of VOCAB) {
      if (join && last) { r.words[key] = el('span', 'w', last, text); continue; }
      const grp = el('span', 'g', r.box);
      r.words[key] = el('span', 'w', grp, text);
      last = grp;
    }
    r.dots = el('div', 'mdots', root);
    r.dot = [0, 1, 2, 3].map(() => el('i', '', r.dots));
  },
  tick(p) {
    const on = new Set(phrase(p.H, p.m));
    const sig = [...on].join();
    if (sig !== r.sig) {
      r.sig = sig;
      for (const [k, n] of Object.entries(r.words)) n.classList.toggle('on', on.has(k));
    }
    r.dot.forEach((d, i) => d.classList.toggle('on', i < p.m % 5));
  },
  layout(ctx) {
    if (!r) return;
    const land = ctx.orientation === 'landscape';
    fitBlock(r.box, ctx.width * (land ? 0.9 : 0.86), ctx.height * (land ? 0.78 : 0.7));
    r.dots.style.setProperty('--d', Math.max(6, Math.min(ctx.width, ctx.height) * 0.018) + 'px');
  },
  unmount() { r = null; },
};
