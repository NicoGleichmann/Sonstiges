// AMOLED-Schutz: Pixel-Shift, Helligkeit (über Deckkraft), Nachtdimmung.
const SHIFT_PX = 4, STEPS = 8;

export const toMin = t => { const [h, m] = String(t).split(':').map(Number); return (h || 0) * 60 + (m || 0); };

export function isNight(now, night) {
  if (!night.enabled) return false;
  const cur = now.getHours() * 60 + now.getMinutes();
  const a = toMin(night.from), b = toMin(night.to);
  if (a === b) return false;
  return a < b ? (cur >= a && cur < b) : (cur >= a || cur < b); // über Mitternacht
}

export function createBurnIn(el) {
  let step = 0, lastShiftMin = -1;
  return {
    // pro Sekunde aufrufen; verschiebt höchstens einmal pro Minute
    update(now, s) {
      const minute = Math.floor(now.getTime() / 60000);
      if (s.pixelShift) {
        if (minute !== lastShiftMin) {
          lastShiftMin = minute;
          step = (step + 1) % STEPS;
          const a = (step / STEPS) * Math.PI * 2;
          el.style.transform = `translate(${(Math.cos(a) * SHIFT_PX).toFixed(1)}px, ${(Math.sin(a) * SHIFT_PX).toFixed(1)}px)`;
        }
      } else if (el.style.transform) { el.style.transform = ''; lastShiftMin = -1; }
      const night = isNight(now, s.night);
      const level = (s.brightness / 100) * (night ? s.night.level / 100 : 1);
      el.style.opacity = Math.max(0.03, Math.min(1, level)).toFixed(3);
      return night;
    },
  };
}
