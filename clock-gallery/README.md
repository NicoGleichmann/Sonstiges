# Clock Gallery

Schreibtisch-Uhr als Web-App (PWA) für ein Android-Handy, das dauerhaft am Strom liegt.
12 Uhr-Designs × 17 Stile, Hoch- und Querformat, offline, ohne Tracker und ohne externe Anfragen.

Reines HTML/CSS/JavaScript, kein Framework, kein Build-Schritt.

## Bedienung

| Geste | Wirkung |
|---|---|
| Tippen | Steuerung 3 Sekunden einblenden (im Browser-Tab zusätzlich Vollbild) |
| Wischen links/rechts | Nächstes/vorheriges Design |
| Wischen hoch/runter | Nächster/vorheriger Stil |
| Lange drücken (0,6 s) | Einstellungen |

Am Rechner: Pfeiltasten wie Wischen, `S` öffnet die Einstellungen, `F` schaltet Vollbild.

Alle Einstellungen und das zuletzt gewählte Design/der Stil werden im Browser gespeichert (`localStorage`).

## Designs und Stile

**Designs (12):** Minimal, Flip-Uhr, Analog klassisch, Analog minimal, Wortuhr, 7-Segment retro, Neon,
Große Ziffern + Datum, Ring, Terminal, Typografie, Gradient (Tageszeit).

**Stile (17):** Instrument, Retro-Hardware, Editorial, Ambient, Bauhaus, Swiss Grid, Brutal Outline, Art Déco,
Blueprint, Zen, Kreidetafel, Synthwave, Pixel, Uhrwerk, Industrial, Rotlicht, Dot-Matrix.

Jedes Design lässt sich mit jedem Stil kombinieren. Der Stil liefert Farben, Schriften und Dekor,
das Design liefert den Aufbau.

## Display-Schutz (AMOLED)

- Hintergrund ist echtes Schwarz (`#000`), schwarze Pixel sind auf AMOLED aus.
- **Pixel-Shift:** Die ganze Uhr wandert jede Minute um bis zu 4 px auf einer Kreisbahn.
- **Helligkeit** 10–100 %, über die Deckkraft der Uhr. Die System-Helligkeit kann eine Web-App nicht steuern.
- **Nachtdimmung:** Zeitfenster frei wählbar (Standard 23–6 Uhr, 25 %). Optional nachts automatisch Stil „Rotlicht“.
  Dekor-Flächen (Raster, Synthwave-Sonne, Farbfelder) sind nachts aus.

## Hosting auf Cloudflare Pages (einmalig, ca. 5 Minuten)

Die App braucht HTTPS (sonst funktionieren Offline-Modus und „Display bleibt an“ nicht). Cloudflare Pages liefert das kostenlos.

1. Code auf `main` bringen (Pull Request mergen).
2. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Erstellen** → **Pages** → **Mit Git verbinden**.
3. Repository **`Sonstiges`** wählen.
4. Einstellungen:
   - Produktions-Branch: `main`
   - Framework-Voreinstellung: **Keine**
   - Build-Befehl: **leer**
   - Build-Ausgabeverzeichnis: **`clock-gallery`**
5. **Speichern und bereitstellen.** Du bekommst eine Adresse wie `https://<projekt>.pages.dev`.

Jeder weitere Push auf `main` geht automatisch live. Die Datei `_headers` setzt auf Cloudflare die
Sicherheitsregeln (nur eigene Dateien erlaubt) und sorgt dafür, dass Updates ankommen.

Alternative ohne GitHub: In Cloudflare Pages „Direkt hochladen“ wählen und den Ordner `clock-gallery` hineinziehen.
Jedes Update muss dann wieder von Hand hochgeladen werden.

## Installation auf dem Samsung Galaxy A70

1. Die `pages.dev`-Adresse in **Chrome** öffnen (nicht Samsung Internet).
2. Einmal kurz warten, bis die Seite geladen ist (dabei speichert sie alles für den Offline-Betrieb).
3. Menü **⋮** → **App installieren** bzw. **Zum Startbildschirm hinzufügen** → **Installieren**.
4. Die App über das neue Symbol auf dem Startbildschirm starten. Sie läuft im Vollbild.
5. Einmal auf die Uhr tippen. Unter **Einstellungen → Status** sollte „Display bleibt an: ja“ und „Offline bereit: ja“ stehen.

Empfohlene Handy-Einstellungen für den Dauerbetrieb:
- **Akku → Hintergrundnutzung begrenzen:** Chrome nicht in „Schlafende Apps“ legen.
- **Energiesparmodus aus.** Im Energiesparmodus kann Android die Display-Sperre verweigern; die App zeigt dann einen Hinweis.
- **Auto-Drehen an**, damit Hoch-/Querformat automatisch wechseln.
- Bildschirm-Timeout darf normal bleiben; die App hält das Display an, solange sie im Vordergrund ist.

## Bekannte Grenzen

- **Kein echtes Always-On-Display.** Eine Web-App kann das Display nur anhalten, solange sie sichtbar ist.
  Drückst du die Ein/Aus-Taste, geht das Display aus. Beim Einschalten fordert die App die Sperre sofort neu an.
- **Kein Wecker, keine Benachrichtigungen, keine Töne.** Bewusst weggelassen.
- **Display-Sperre kann verweigert werden** (Energiesparmodus, sehr niedriger Akkustand). Dann erscheint ein Hinweis, die Uhr läuft weiter.
- **Helligkeit** wird über die Deckkraft geregelt, nicht über die Hintergrundbeleuchtung.
- **Einbrennen** wird reduziert, nicht ausgeschlossen. Stile mit großen hellen Flächen (Synthwave, Ambient) sind riskanter als dünne Schriften (Instrument, Zen, Rotlicht).
- **Zeitzone/Sommerzeit** kommen vom Handy. Stimmt die Handy-Uhr nicht, stimmt auch die App nicht.

## Aufbau

```
clock-gallery/
├─ index.html            Bühne, Steuerung, Einstellungen
├─ manifest.webmanifest  display: fullscreen, orientation: any
├─ sw.js                 Service Worker (Offline-Cache)
├─ _headers              Cloudflare-Header (CSP, Caching)
├─ css/                  fonts.css, app.css (Gerüst), designs.css (Designs + Stil-Flags)
├─ js/
│  ├─ app.js             Zusammenspiel aller Teile
│  ├─ themes.js          17 Stile als Variablen-Sätze
│  ├─ ticker.js          Sekundentakt an der Systemuhr ausgerichtet
│  ├─ wakelock.js        Display-Sperre inkl. Neu-Anfordern
│  ├─ burnin.js          Pixel-Shift, Helligkeit, Nachtdimmung
│  ├─ gestures.js        Tippen, Wischen, Langdruck
│  ├─ settings.js        Speichern/Laden mit Standardwerten
│  └─ format.js          12/24 h, Datum, Zahlwörter
├─ designs/              ein Modul pro Design + index.js (Liste) + _lib.js (Helfer)
├─ fonts/                Schriften lokal (SIL Open Font License, siehe fonts/LICENSE.md)
└─ icons/
```

## Neues Design hinzufügen

1. Datei `designs/mein-design.js` anlegen:

```js
import { el, setText, fit } from './_lib.js';
let r = null;
export default {
  id: 'mein-design',
  name: 'Mein Design',
  mount(root, ctx) { r = { time: el('div', 'num', root) }; },      // Elemente anlegen
  tick(p, ctx) { if (setText(r.time, `${p.hh}:${p.mm}`)) this.layout(ctx); }, // jede Sekunde
  layout(ctx) { fit(r.time, ctx.width * 0.9, ctx.height * 0.5); },  // bei Drehen / Größenänderung
  unmount() { r = null; },
};
```

   `p` enthält u. a. `hh`, `mm`, `ss`, `H`, `m`, `s`, `ampm`, `dateShort`, `dateLong`, `weekday`, `week`.
   `ctx` enthält `settings`, `theme`, `orientation` (`portrait`/`landscape`), `width`, `height`.
   Farben/Schriften nur über die Stil-Variablen (`var(--fg)`, `var(--accent)`, Klasse `num`/`lbl`).

2. In `designs/index.js` importieren und in `DESIGNS` eintragen.
3. Styles unter `.d-mein-design` in `css/designs.css` ergänzen.
4. In `sw.js` den Dateinamen in `ASSETS` eintragen und `VERSION` erhöhen (ebenso `APP_VERSION` in `js/app.js`).

Neuer Stil: ein Eintrag in `js/themes.js` (siehe Kommentar oben in der Datei).

## Lokal testen

```bash
cd clock-gallery && python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen. `localhost` gilt als sicher, Service Worker und Display-Sperre funktionieren dort.
