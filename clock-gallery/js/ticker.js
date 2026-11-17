// Sekundentakt, an der echten Systemuhr ausgerichtet: jedes Mal wird neu berechnet,
// wie lange es bis zur nächsten vollen Sekunde ist. Dadurch kein aufsummierter Drift.
export function startTicker(onTick) {
  let timer = 0, last = -1;
  const fire = () => {
    const now = new Date();
    const sec = Math.floor(now.getTime() / 1000);
    if (sec !== last) { last = sec; onTick(now); }
    schedule();
  };
  const schedule = () => {
    clearTimeout(timer);
    const delay = 1000 - (Date.now() % 1000) + 4; // 4 ms Puffer, damit wir sicher hinter der Sekundengrenze landen
    timer = setTimeout(fire, delay);
  };
  // Im Hintergrund drosselt der Browser Timer. Beim Zurückkehren sofort neu synchronisieren.
  const resync = () => { if (document.visibilityState === 'visible') { last = -1; fire(); } };
  document.addEventListener('visibilitychange', resync);
  window.addEventListener('pageshow', resync);
  window.addEventListener('focus', resync);
  fire();
  return { forceTick() { last = -1; fire(); } };
}
