// Clock Gallery: verbindet Designs, Stile, Takt, Wake Lock, Einbrennschutz, Gesten und Einstellungen.
import { DESIGNS, designById } from '../designs/index.js';
import { THEMES, themeById, NIGHT_THEME } from './themes.js';
import * as store from './settings.js';
import { startTicker } from './ticker.js';
import { createWakeLock } from './wakelock.js';
import { createBurnIn } from './burnin.js';
import { attachGestures } from './gestures.js';
import { parts, timeZone } from './format.js';

export const APP_VERSION = '1.0.1'; // bei Änderungen zusammen mit VERSION in sw.js erhöhen

const $ = id => document.getElementById(id);
const stage = $('stage'), shiftEl = $('shift'), designEl = $('design'), decoEl = $('deco');
const controls = $('controls'), settingsEl = $('settings'), toastEl = $('toast');

let S = store.load();
let current = null, effTheme = null, night = false, lastNow = new Date();

const orientation = () => (innerWidth > innerHeight ? 'landscape' : 'portrait');
const ctx = () => ({
  settings: S, theme: themeById(effTheme), orientation: orientation(), tz: timeZone(),
  width: designEl.clientWidth, height: designEl.clientHeight,
});
const persist = () => { if (!store.save(S)) toast('Einstellungen konnten nicht gespeichert werden (Speicher gesperrt).'); };

/* ---------- Stil ---------- */
function applyTheme() {
  const id = night && S.night.red ? NIGHT_THEME : S.theme;
  if (id === effTheme) return false;
  effTheme = id;
  const t = themeById(id);
  for (const [k, v] of Object.entries(t.vars)) stage.style.setProperty(k, v);
  stage.className = (t.flags || []).map(f => 't-' + f).join(' ') + (t.mono ? ' t-mono' : '');
  stage.dataset.theme = id;
  document.documentElement.style.setProperty('--ui-accent', t.vars['--accent']);
  return true;
}
function applyDeco() {
  const t = themeById(effTheme);
  const cls = t.deco && !night ? 'deco-' + t.deco : '';
  if (decoEl.className !== cls) decoEl.className = cls;
}

/* ---------- Design ---------- */
function mountDesign(id) {
  if (current && current.unmount) current.unmount();
  current = designById(id);
  designEl.textContent = '';
  designEl.className = 'd-' + current.id;
  designEl.setAttribute('aria-label', 'Uhr: ' + current.name);
  const c = ctx();
  current.mount(designEl, c);
  current.layout && current.layout(c);
  current.tick(parts(lastNow, S.hour12), c);
  current.layout && current.layout(c);
  updateLabels();
}
function relayout() {
  stage.dataset.orientation = orientation();
  if (current && current.layout) { const c = ctx(); current.layout(c); current.tick(parts(lastNow, S.hour12), c); }
}

function step(list, curId, dir) {
  const i = list.findIndex(x => x.id === curId);
  return list[(i + dir + list.length) % list.length].id;
}
function nextDesign(dir) {
  S.design = step(DESIGNS, current.id, dir); persist(); mountDesign(S.design); showControls();
}
function nextTheme(dir) {
  S.theme = step(THEMES, S.theme, dir); persist();
  if (applyTheme()) mountDesign(S.design);
  applyDeco(); updateLabels(); showControls();
  if (night && S.night.red) toast('Nachts ist Rotlicht aktiv. Dein Stil gilt ab Ende der Nachtzeit.');
}

/* ---------- Takt ---------- */
const burn = createBurnIn(shiftEl);
function onTick(now) {
  lastNow = now;
  const wasNight = night;
  night = burn.update(now, S);
  if (applyTheme()) mountDesign(S.design);
  if (wasNight !== night) updateLabels();
  applyDeco();
  current.tick(parts(now, S.hour12), ctx());
}

/* ---------- Steuerung ---------- */
let hideT = 0;
function showControls() {
  controls.hidden = false;
  requestAnimationFrame(() => controls.classList.add('show'));
  clearTimeout(hideT);
  hideT = setTimeout(hideControls, 3000);
}
function hideControls() {
  controls.classList.remove('show');
  clearTimeout(hideT);
  hideT = setTimeout(() => { if (!controls.classList.contains('show')) controls.hidden = true; }, 300);
}
function updateLabels() {
  $('lblDesign').textContent = current ? current.name : '';
  const t = themeById(S.theme);
  $('btnTheme').textContent = 'Stil: ' + t.name + (night && S.night.red ? ' (nachts Rotlicht)' : '');
  const dots = $('dots');
  if (dots.childElementCount !== DESIGNS.length) dots.innerHTML = DESIGNS.map(() => '<i></i>').join('');
  [...dots.children].forEach((d, i) => d.classList.toggle('on', current && DESIGNS[i].id === current.id));
}
controls.addEventListener('pointerdown', () => { if (controls.classList.contains('show')) showControls(); });
$('btnPrev').addEventListener('click', () => nextDesign(-1));
$('btnNext').addEventListener('click', () => nextDesign(1));
$('btnTheme').addEventListener('click', () => nextTheme(1));
$('btnSettings').addEventListener('click', openSettings);
$('btnFull').addEventListener('click', () => toggleFullscreen(true));

/* ---------- Vollbild (Fallback im Browser-Tab) ---------- */
const installed = () => ['fullscreen', 'standalone'].some(m => matchMedia(`(display-mode: ${m})`).matches);
async function toggleFullscreen(toggle = false) {
  const d = document;
  try {
    if (d.fullscreenElement) { if (toggle) await d.exitFullscreen(); return; }
    if (d.documentElement.requestFullscreen) await d.documentElement.requestFullscreen({ navigationUI: 'hide' });
  } catch { if (toggle) toast('Vollbild wird hier nicht unterstützt.'); }
}

/* ---------- Hinweis ---------- */
let toastT = 0;
function toast(msg, ms = 5000) {
  toastEl.textContent = msg; toastEl.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { toastEl.hidden = true; }, ms);
}

/* ---------- Wake Lock ---------- */
let lastWakeErr = '';
const wake = createWakeLock({
  onChange(st) {
    $('stWake').textContent = st.active ? 'ja' : (st.supported ? 'nein' : 'nicht unterstützt');
    if (!st.active && st.error && st.error !== lastWakeErr && document.visibilityState === 'visible') toast(st.error, 7000);
    lastWakeErr = st.active ? '' : st.error;
  },
});

/* ---------- Gesten ---------- */
attachGestures(stage, {
  enabled: () => settingsEl.hidden,
  onTap() {
    wake.request();
    if (!installed() && !document.fullscreenElement) toggleFullscreen();
    if (controls.classList.contains('show')) hideControls(); else showControls();
  },
  onSwipe(dir) {
    if (dir === 'left') nextDesign(1);
    else if (dir === 'right') nextDesign(-1);
    else if (dir === 'up') nextTheme(1);
    else nextTheme(-1);
  },
  onLongPress: openSettings,
});

/* ---------- Einstellungen ---------- */
function fillSelect(sel, list, val) {
  if (sel.options.length !== list.length) sel.innerHTML = list.map(x => `<option value="${x.id}">${x.name}</option>`).join('');
  sel.value = val;
}
function syncSettingsUI() {
  fillSelect($('selDesign'), DESIGNS, S.design);
  fillSelect($('selTheme'), THEMES, S.theme);
  $('chk12').checked = S.hour12;
  $('chkSec').checked = S.showSeconds;
  $('chkDate').checked = S.showDate;
  $('rngBright').value = S.brightness; $('outBright').textContent = S.brightness + ' %';
  $('chkShift').checked = S.pixelShift;
  $('chkNight').checked = S.night.enabled;
  $('timeFrom').value = S.night.from; $('timeTo').value = S.night.to;
  $('rngNight').value = S.night.level; $('outNight').textContent = S.night.level + ' %';
  $('chkRed').checked = S.night.red;
  settingsEl.querySelector('.sheet').classList.toggle('night-off', !S.night.enabled);
  $('stTz').textContent = timeZone();
  $('stVer').textContent = APP_VERSION;
}
let openedAt = 0;
function openSettings() {
  hideControls();
  syncSettingsUI();
  settingsEl.hidden = false;
  openedAt = performance.now();
  $('btnClose').focus({ preventScroll: true });
}
function closeSettings() { settingsEl.hidden = true; }
$('btnClose').addEventListener('click', closeSettings);
// Klick aufs Abdunkeln schließt, aber nicht der Klick, der beim Loslassen des Langdrucks entsteht.
settingsEl.addEventListener('click', e => { if (e.target === settingsEl && performance.now() - openedAt > 700) closeSettings(); });
document.addEventListener('keydown', e => {
  if (!settingsEl.hidden) { if (e.key === 'Escape') closeSettings(); return; }
  if (e.key === 'ArrowRight') nextDesign(1);
  else if (e.key === 'ArrowLeft') nextDesign(-1);
  else if (e.key === 'ArrowUp') nextTheme(1);
  else if (e.key === 'ArrowDown') nextTheme(-1);
  else if (e.key === 's' || e.key === 'Enter') openSettings();
  else if (e.key === 'f') toggleFullscreen(true);
});

function onSetting(fn, { remount = false } = {}) {
  return e => {
    fn(e.target); persist(); syncSettingsUI();
    const themeChanged = applyTheme();
    if (remount || themeChanged) mountDesign(S.design);
    onTick(new Date());
  };
}
$('selDesign').addEventListener('change', onSetting(t => { S.design = t.value; }, { remount: true }));
$('selTheme').addEventListener('change', onSetting(t => { S.theme = t.value; }, { remount: true }));
$('chk12').addEventListener('change', onSetting(t => { S.hour12 = t.checked; }, { remount: true }));
$('chkSec').addEventListener('change', onSetting(t => { S.showSeconds = t.checked; }, { remount: true }));
$('chkDate').addEventListener('change', onSetting(t => { S.showDate = t.checked; }, { remount: true }));
$('rngBright').addEventListener('input', onSetting(t => { S.brightness = +t.value; }));
$('chkShift').addEventListener('change', onSetting(t => { S.pixelShift = t.checked; }));
$('chkNight').addEventListener('change', onSetting(t => { S.night.enabled = t.checked; }));
$('timeFrom').addEventListener('change', onSetting(t => { if (t.value) S.night.from = t.value; }));
$('timeTo').addEventListener('change', onSetting(t => { if (t.value) S.night.to = t.value; }));
$('rngNight').addEventListener('input', onSetting(t => { S.night.level = +t.value; }));
$('chkRed').addEventListener('change', onSetting(t => { S.night.red = t.checked; }));
$('btnReset').addEventListener('click', () => {
  S = store.reset(); effTheme = null; applyTheme(); mountDesign(S.design); syncSettingsUI(); onTick(new Date());
  toast('Einstellungen zurückgesetzt.');
});

/* ---------- Start ---------- */
let rT = 0;
const scheduleRelayout = () => { clearTimeout(rT); rT = setTimeout(relayout, 80); };
addEventListener('resize', scheduleRelayout);
addEventListener('orientationchange', scheduleRelayout);
if (screen.orientation) screen.orientation.addEventListener('change', scheduleRelayout);
if (document.fonts) {
  document.fonts.ready.then(relayout);
  document.fonts.addEventListener('loadingdone', scheduleRelayout);
}

stage.dataset.orientation = orientation();
applyTheme();
mountDesign(S.design);
startTicker(onTick);
wake.request();

/* ---------- Offline (Service Worker) ---------- */
if ('serviceWorker' in navigator && isSecureContext) {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js').catch(() => { $('stOffline').textContent = 'nein'; });
  navigator.serviceWorker.ready.then(() => { $('stOffline').textContent = 'ja'; });
  // Neue Version aktiv → einmal neu laden (nur bei Updates, nicht bei der ersten Installation).
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !reloaded) { reloaded = true; location.reload(); }
  });
} else {
  $('stOffline').textContent = 'nein (HTTPS nötig)';
}

// Für automatisierte Tests: Zustand lesbar machen (keine Funktion für Nutzer).
window.__clock = { get settings() { return S; }, get design() { return current && current.id; }, get theme() { return effTheme; }, APP_VERSION };
