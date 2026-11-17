// Terminal/Matrix: Shell-Ausgabe mit großer Uhrzeit, dahinter gedimmter Zeichenregen.
import { el, setText, fit } from './_lib.js';

const GLYPHS = 'アイウエオカキクケコサシスセソ0123456789ABCDEF:;<>=*+';
let r = null;

function startRain(canvas) {
  const ctx2d = canvas.getContext('2d');
  let cols = [], fs = 14, timer = 0, color = '#0f0';
  const resize = () => {
    const dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr;
    fs = Math.max(10, Math.round(Math.min(canvas.width, canvas.height) / 40));
    cols = Array.from({ length: Math.ceil(canvas.width / fs) }, () => Math.random() * -50);
    color = getComputedStyle(canvas).color || color;
    ctx2d.fillStyle = '#000'; ctx2d.fillRect(0, 0, canvas.width, canvas.height);
  };
  const frame = () => {
    if (document.visibilityState !== 'visible') return;
    ctx2d.fillStyle = 'rgba(0,0,0,0.14)';
    ctx2d.fillRect(0, 0, canvas.width, canvas.height);
    ctx2d.fillStyle = color; ctx2d.font = fs + 'px monospace';
    for (let i = 0; i < cols.length; i++) {
      const y = cols[i] * fs;
      if (y > 0) ctx2d.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * fs, y);
      cols[i] = y > canvas.height && Math.random() > 0.97 ? 0 : cols[i] + 1;
    }
  };
  resize();
  timer = setInterval(frame, 90); // ~11 fps reicht, schont Akku/CPU
  return { resize, stop() { clearInterval(timer); } };
}

export default {
  id: 'terminal',
  name: 'Terminal',
  mount(root, ctx) {
    r = {};
    r.canvas = el('canvas', 'rain', root);
    r.term = el('div', 'term', root);
    const line = (cls, txt) => el('div', 'ln ' + cls, r.term, txt);
    line('cmd', 'user@clock:~$ date +%T');
    r.time = line('big num', '');
    r.cmdDate = line('cmd', 'user@clock:~$ date +"%A, %-d. %B %Y"');
    r.date = line('out', '');
    line('cmd', 'user@clock:~$ echo $TZ');
    r.tz = line('out', ctx.tz || '');
    r.prompt = line('cmd', 'user@clock:~$ ');
    r.cursor = el('span', 'cursor', r.prompt, '█');
    requestAnimationFrame(() => { if (r) r.rain = startRain(r.canvas); });
  },
  tick(p, ctx) {
    const s = ctx.settings;
    const ch = setText(r.time, `${p.hh}:${p.mm}${s.showSeconds ? ':' + p.ss : ''}${p.ampm ? ' ' + p.ampm : ''}`);
    r.cmdDate.hidden = r.date.hidden = !s.showDate;
    setText(r.date, p.dateLong);
    r.cursor.style.visibility = p.s % 2 ? 'hidden' : 'visible';
    if (ch && r.time.textContent.length !== r.len) { r.len = r.time.textContent.length; this.layout(ctx); }
  },
  layout(ctx) {
    if (!r) return;
    const land = ctx.orientation === 'landscape';
    r.term.style.fontSize = Math.max(11, Math.min(ctx.width * 0.034, ctx.height * 0.045)) + 'px';
    fit(r.time, ctx.width * 0.86, ctx.height * (land ? 0.42 : 0.2));
    r.rain && r.rain.resize();
  },
  unmount() { if (r && r.rain) r.rain.stop(); r = null; },
};
