// Tipp, Wisch (horizontal/vertikal) und Langdruck auf einer Fläche, per Pointer Events.
const SWIPE = 60, MOVE_TOL = 12, LONG_MS = 600;

export function attachGestures(el, { onTap, onSwipe, onLongPress, enabled = () => true }) {
  let start = null, timer = 0, longFired = false;

  el.addEventListener('pointerdown', e => {
    if (!enabled() || !e.isPrimary) return;
    start = { x: e.clientX, y: e.clientY };
    longFired = false;
    clearTimeout(timer);
    timer = setTimeout(() => { longFired = true; start = null; onLongPress && onLongPress(); }, LONG_MS);
  });
  el.addEventListener('pointermove', e => {
    if (!start) return;
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > MOVE_TOL) clearTimeout(timer);
  });
  const end = e => {
    clearTimeout(timer);
    if (!start || longFired) { start = null; return; }
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    start = null;
    if (Math.abs(dx) >= SWIPE && Math.abs(dx) > Math.abs(dy)) onSwipe && onSwipe(dx < 0 ? 'left' : 'right');
    else if (Math.abs(dy) >= SWIPE && Math.abs(dy) > Math.abs(dx)) onSwipe && onSwipe(dy < 0 ? 'up' : 'down');
    else if (Math.hypot(dx, dy) <= MOVE_TOL) onTap && onTap(e);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', () => { clearTimeout(timer); start = null; });
  el.addEventListener('contextmenu', e => e.preventDefault());
}
