// Mediathek: Reihenfolge = Reihenfolge beim Wischen.
// Neues Design: Datei in /designs anlegen (siehe README), hier importieren und in die Liste eintragen,
// außerdem den Dateinamen in sw.js unter ASSETS ergänzen.
import minimal from './minimal.js';
import flip from './flip.js';
import analogClassic from './analog-classic.js';
import analogMinimal from './analog-minimal.js';
import wortuhr from './wortuhr.js';
import segment7 from './segment7.js';
import neon from './neon.js';
import bigdate from './bigdate.js';
import ring from './ring.js';
import terminal from './terminal.js';
import typo from './typo.js';
import gradient from './gradient.js';

export const DESIGNS = [
  minimal, flip, analogClassic, analogMinimal, wortuhr, segment7,
  neon, bigdate, ring, terminal, typo, gradient,
];

export const designById = id => DESIGNS.find(d => d.id === id) || DESIGNS[0];
