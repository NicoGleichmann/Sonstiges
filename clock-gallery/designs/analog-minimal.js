// Analog minimal: nur vier Marken, schlanke Zeiger, Sekunde als kreisender Punkt.
import { analogDial, setText } from './_lib.js';

let r = null;

export default {
  id: 'analog-minimal',
  name: 'Analog minimal',
  mount(root) {
    r = analogDial(root, { ticks: 'quarters', secondsDot: true, slim: true });
  },
  tick(p, ctx) {
    r.set(p, ctx.settings.showSeconds);
    setText(r.info, ctx.settings.showDate ? String(p.date.getDate()) : '');
  },
  unmount() { r = null; },
};
