// Zeit- und Datumsformatierung. Zeitzone kommt automatisch aus dem System (Intl).
export const LOCALE = 'de-DE';
export const pad = n => String(n).padStart(2, '0');
export const timeZone = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'lokal'; } catch { return 'lokal'; } };

const fDateShort = new Intl.DateTimeFormat(LOCALE, { weekday: 'short', day: 'numeric', month: 'short' });
const fDateLong = new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const fWeekday = new Intl.DateTimeFormat(LOCALE, { weekday: 'long' });
const fDayMonth = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long' });
const fTzName = new Intl.DateTimeFormat(LOCALE, { timeZoneName: 'short' });

// Liefert alle Felder, die Designs brauchen.
export function parts(d, hour12) {
  const H = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
  const h = hour12 ? ((H + 11) % 12) + 1 : H;
  return {
    date: d, H, h, m, s, ms: d.getMilliseconds(),
    hh: hour12 ? String(h) : pad(h), mm: pad(m), ss: pad(s),
    ampm: hour12 ? (H < 12 ? 'AM' : 'PM') : '',
    dateShort: fDateShort.format(d),
    dateLong: fDateLong.format(d),
    weekday: fWeekday.format(d),
    dayMonth: fDayMonth.format(d),
    year: d.getFullYear(),
    week: isoWeek(d),
    tzName: (fTzName.formatToParts(d).find(p => p.type === 'timeZoneName') || {}).value || '',
  };
}

export function isoWeek(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - y0) / 864e5 + 1) / 7);
}

// Zahlen 0–59 als deutsches Wort (für Typografie-Design).
const ONES = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf',
  'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const TENS = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig'];
export function numberWord(n) {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10), o = n % 10;
  if (!o) return TENS[t];
  return (o === 1 ? 'ein' : ONES[o]) + 'und' + TENS[t];
}
