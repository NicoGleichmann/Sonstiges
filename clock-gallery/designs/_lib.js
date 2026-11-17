// Gemeinsame Helfer für Design-Module. Kein Design braucht Wissen über Wake Lock, Storage oder Gesten.
const SVGNS = 'http://www.w3.org/2000/svg';

export function el(tag, cls, parent, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  if (parent) parent.appendChild(n);
  return n;
}

export function svgEl(tag, attrs = {}, parent) {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (parent) parent.appendChild(n);
  return n;
}

// Text nur setzen, wenn er sich ändert (vermeidet unnötige Layouts).
export function setText(node, txt) {
  txt = String(txt);
  if (node.textContent !== txt) { node.textContent = txt; return true; }
  return false;
}

// Schriftgröße so wählen, dass node in maxW × maxH passt. node: white-space nowrap, inline-block.
export function fit(node, maxW, maxH, maxPx = 4000) {
  if (!node || maxW <= 0 || maxH <= 0) return 0;
  node.style.fontSize = '100px';
  const r = node.getBoundingClientRect();
  const w = Math.max(node.scrollWidth, r.width) || 1;
  const h = Math.max(node.scrollHeight, r.height) || 1;
  const px = Math.max(6, Math.min(maxPx, Math.floor(100 * Math.min(maxW / w, maxH / h) * 0.98)));
  node.style.fontSize = px + 'px';
  return px;
}

// Für Text-Blöcke mit Umbruch: größte Schrift per Binärsuche, bei der der Block in die Box passt.
export function fitBlock(node, maxW, maxH, lo = 6, hi = 400) {
  maxW = Math.floor(maxW); maxH = Math.floor(maxH);
  node.style.width = maxW + 'px';
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2;
    node.style.fontSize = mid + 'px';
    if (node.scrollHeight <= maxH + 1 && node.scrollWidth <= maxW + 1) lo = mid; else hi = mid;
  }
  node.style.fontSize = Math.floor(lo) + 'px';
  return lo;
}

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Analoges Zifferblatt (viewBox 200×200). Farben/Stärken kommen aus den Stil-Variablen.
export function analogDial(parent, { numerals = false, ticks = 'full', secondsDot = false, slim = false } = {}) {
  const svg = svgEl('svg', { viewBox: '0 0 200 200', class: 'dial', 'aria-hidden': 'true' }, parent);
  const face = svgEl('g', { class: 'face' }, svg);
  for (let i = 0; i < 60; i++) {
    const major = i % 5 === 0, quarter = i % 15 === 0;
    if (ticks === 'none') break;
    if (ticks === 'major' && !major) continue;
    if (ticks === 'quarters' && !quarter) continue;
    const len = quarter ? 15 : major ? 11 : 5;
    svgEl('line', {
      x1: 100, y1: 4, x2: 100, y2: 4 + len,
      class: 'tick' + (major ? ' major' : '') + (quarter ? ' quarter' : ''),
      transform: `rotate(${i * 6} 100 100)`,
    }, face);
  }
  if (numerals) {
    for (let n = 1; n <= 12; n++) {
      const a = (n * 30 - 90) * Math.PI / 180;
      const t = svgEl('text', { x: (100 + Math.cos(a) * 68).toFixed(2), y: (100 + Math.sin(a) * 68).toFixed(2), class: 'numeral num', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, face);
      t.textContent = n;
    }
  }
  const info = svgEl('text', { x: 100, y: 140, class: 'dial-info lbl', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, face);
  const k = slim ? 0.6 : 1;
  const hh = svgEl('line', { x1: 100, y1: 112, x2: 100, y2: 52, class: 'hand hand-h', style: `stroke-width:calc(${7 * k}px * var(--hand-w))` }, svg);
  const mm = svgEl('line', { x1: 100, y1: 116, x2: 100, y2: 22, class: 'hand hand-m', style: `stroke-width:calc(${4.2 * k}px * var(--hand-w))` }, svg);
  let ss;
  if (secondsDot) ss = svgEl('circle', { cx: 100, cy: 10, r: 3.4, class: 'hand-s-dot' }, svg);
  else ss = svgEl('line', { x1: 100, y1: 126, x2: 100, y2: 14, class: 'hand hand-s', style: 'stroke-width:1.4px' }, svg);
  svgEl('circle', { cx: 100, cy: 100, r: slim ? 2.6 : 4.2, class: 'cap' }, svg);
  return {
    svg, info,
    set(p, showSeconds) {
      const hDeg = (p.H % 12) * 30 + p.m * 0.5 + p.s / 120;
      const mDeg = p.m * 6 + p.s * 0.1;
      hh.setAttribute('transform', `rotate(${hDeg.toFixed(2)} 100 100)`);
      mm.setAttribute('transform', `rotate(${mDeg.toFixed(2)} 100 100)`);
      ss.setAttribute('transform', `rotate(${p.s * 6} 100 100)`);
      ss.style.display = showSeconds ? '' : 'none';
    },
  };
}
