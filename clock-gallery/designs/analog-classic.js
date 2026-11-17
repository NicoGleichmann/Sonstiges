// Klassisch analog: volle Minuterie, Ziffern 1–12, Datum im Zifferblatt.
import { analogDial, setText } from './_lib.js';

let r = null;

export default {
  id: 'analog-classic',
  name: 'Analog klassisch',
  mount(root) {
    r = analogDial(root, { numerals: true, ticks: 'full' });
  },
  tick(p, ctx) {
    r.set(p, ctx.settings.showSeconds);
    setText(r.info, ctx.settings.showDate ? p.dateShort : '');
  },
  unmount() { r = null; },
};
