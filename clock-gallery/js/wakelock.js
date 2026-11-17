// Screen Wake Lock: anfordern, nach jedem Verlust neu anfordern, Fehler melden statt abstürzen.
export function createWakeLock({ onChange } = {}) {
  let sentinel = null, wanted = true, lastError = '';
  const supported = 'wakeLock' in navigator;

  const state = () => ({
    supported, active: !!sentinel && !sentinel.released, error: lastError,
  });
  const notify = () => onChange && onChange(state());

  async function request() {
    if (!supported) { lastError = 'Dieser Browser unterstützt die Display-Sperre nicht (HTTPS nötig).'; notify(); return false; }
    if (document.visibilityState !== 'visible') return false;
    if (sentinel && !sentinel.released) return true;
    try {
      sentinel = await navigator.wakeLock.request('screen');
      lastError = '';
      sentinel.addEventListener('release', () => {
        notify();
        // System hat den Lock entzogen (z. B. Akku-Sparmodus). Wenn sichtbar: neu versuchen.
        if (wanted && document.visibilityState === 'visible') setTimeout(request, 1000);
      });
      notify();
      return true;
    } catch (e) {
      sentinel = null;
      lastError = (e && e.name === 'NotAllowedError')
        ? 'Display-Sperre abgelehnt (Akku-Sparmodus?). Tippen zum Wiederholen.'
        : 'Display-Sperre nicht aktiv. Tippen zum Wiederholen.';
      notify();
      return false;
    }
  }

  const onVisible = () => { if (wanted && document.visibilityState === 'visible') request(); };
  document.addEventListener('visibilitychange', onVisible);
  document.addEventListener('fullscreenchange', onVisible);
  window.addEventListener('focus', onVisible);
  window.addEventListener('pageshow', onVisible);
  // Wächter: falls ein Ereignis verloren geht.
  setInterval(() => { if (wanted && document.visibilityState === 'visible' && !state().active) request(); }, 30000);

  return { request, state };
}
