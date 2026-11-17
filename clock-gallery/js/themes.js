// Stile = Token-Sätze. Jedes Design liest nur diese CSS-Variablen.
// Neuer Stil: ein Objekt ergänzen. Pflichtfelder: id, name, vars.
// Optional: deco ('grid' | 'dots' | 'synth' | 'ambient'), flags (CSS-Klassen am Stage: 'outline', 'chrome', 'tilt', 'caps'),
//           mono: true → Designs mit eigenen Farbverläufen bleiben einfarbig (Akzentfarbe).

const base = {
  '--fg': '#ece9e2', '--dim': '#7d7b76', '--ghost': '#1a1a19', '--accent': '#ff8a3d', '--accent2': '#ece9e2',
  '--card': '#0c0c0b', '--card-line': '#000', '--glow': 'none',
  '--f-display': '"Inter Tight", system-ui, sans-serif', '--w-display': '200', '--s-display': 'normal',
  '--w-alt': '300', '--s-alt': 'normal', '--track': '-0.03em',
  '--f-text': '"Inter Tight", system-ui, sans-serif', '--w-text': '300',
  '--f-mono': '"JetBrains Mono", ui-monospace, monospace',
  '--hand-h': 'var(--fg)', '--hand-m': 'var(--fg)', '--hand-s': 'var(--accent)', '--hand-w': '1',
};

const T = (id, name, vars, extra = {}) => ({ id, name, vars: { ...base, ...vars }, ...extra });

export const THEMES = [
  T('instrument', 'Instrument', {}),
  T('retro', 'Retro-Hardware', {
    '--fg': '#ffb347', '--dim': '#8a5a22', '--ghost': '#2a1a08', '--accent': '#ff7a1a', '--accent2': '#ffd08a',
    '--card': '#140c03', '--glow': '0 0 .08em rgba(255,140,30,.6)',
    '--f-display': '"Share Tech Mono", monospace', '--w-display': '400', '--w-alt': '400', '--track': '0',
    '--f-text': '"Share Tech Mono", monospace', '--w-text': '400', '--f-mono': '"Share Tech Mono", monospace',
  }, { flags: ['caps'] }),
  T('editorial', 'Editorial', {
    '--fg': '#f1ede4', '--dim': '#7a756b', '--ghost': '#1c1a17', '--accent': '#c9b99a', '--accent2': '#c9b99a',
    '--card': '#0f0e0c', '--f-display': '"Fraunces", Georgia, serif', '--w-display': '800', '--w-alt': '300', '--s-alt': 'italic',
    '--track': '-0.05em', '--f-text': '"Inter Tight", sans-serif', '--w-text': '500', '--hand-s': '#c9b99a',
  }, { flags: ['caps'] }),
  T('ambient', 'Ambient', {
    '--fg': '#f4efe8', '--dim': '#b9a6c9', '--ghost': '#1b1622', '--accent': '#c88cff', '--accent2': '#ffb3a1',
    '--card': '#120e18', '--f-display': '"Manrope", sans-serif', '--w-display': '300', '--w-alt': '300', '--track': '-0.02em',
    '--f-text': '"Manrope", sans-serif', '--w-text': '500',
  }, { deco: 'ambient' }),
  T('bauhaus', 'Bauhaus', {
    '--fg': '#efece4', '--dim': '#8d8a83', '--ghost': '#1b1b1b', '--accent': '#e63b2e', '--accent2': '#2f5bea',
    '--card': '#0e0e0e', '--f-display': '"Jost", sans-serif', '--w-display': '500', '--w-alt': '400', '--track': '0',
    '--f-text': '"Jost", sans-serif', '--w-text': '400',
    '--hand-h': '#e63b2e', '--hand-m': '#2f5bea', '--hand-s': '#f5c400', '--hand-w': '2.2',
  }, { flags: ['caps'] }),
  T('swiss', 'Swiss Grid', {
    '--fg': '#f2f2f2', '--dim': '#7b7b7b', '--ghost': '#1a1a1a', '--accent': '#e30613', '--accent2': '#f2f2f2',
    '--card': '#0e0e0e', '--f-display': '"Archivo", "Arial Black", sans-serif', '--w-display': '800', '--w-alt': '800', '--track': '-0.06em',
    '--f-text': '"Inter Tight", sans-serif', '--w-text': '500', '--hand-w': '1.6',
  }),
  T('brutal', 'Brutal Outline', {
    '--fg': '#ffffff', '--dim': '#9a9a9a', '--ghost': '#1a1a1a', '--accent': '#ffffff', '--accent2': '#9a9a9a',
    '--card': '#000', '--card-line': '#fff', '--f-display': '"Space Mono", monospace', '--w-display': '700', '--w-alt': '700', '--track': '-0.02em',
    '--f-text': '"Space Mono", monospace', '--w-text': '400', '--f-mono': '"Space Mono", monospace', '--hand-s': '#ffffff', '--hand-w': '1.4',
  }, { flags: ['outline', 'caps'] }),
  T('deco', 'Art Déco', {
    '--fg': '#d6b26e', '--dim': '#8c7448', '--ghost': '#1f1a10', '--accent': '#d6b26e', '--accent2': '#f1dcae',
    '--card': '#0f0c06', '--f-display': '"Poiret One", serif', '--w-display': '400', '--w-alt': '400', '--track': '0.06em',
    '--f-text': '"Poiret One", serif', '--w-text': '400', '--hand-s': '#f1dcae',
  }, { flags: ['caps'] }),
  T('blueprint', 'Blueprint', {
    '--fg': '#59c7ff', '--dim': '#3c8fbb', '--ghost': '#0b2433', '--accent': '#59c7ff', '--accent2': '#cdeeff',
    '--card': '#020b11', '--card-line': '#0f3a52', '--f-display': '"IBM Plex Mono", monospace', '--w-display': '300', '--w-alt': '300', '--track': '0',
    '--f-text': '"IBM Plex Mono", monospace', '--w-text': '300', '--f-mono': '"IBM Plex Mono", monospace', '--hand-s': '#cdeeff',
  }, { deco: 'grid', flags: ['caps'] }),
  T('zen', 'Zen', {
    '--fg': '#e7e2d8', '--dim': '#77736b', '--ghost': '#1d1c1a', '--accent': '#d8d2c4', '--accent2': '#a8a294',
    '--card': '#0d0c0b', '--f-display': '"Zen Kaku Gothic New", sans-serif', '--w-display': '300', '--w-alt': '300', '--track': '0.05em',
    '--f-text': '"Zen Kaku Gothic New", sans-serif', '--w-text': '300', '--hand-s': '#a8a294', '--hand-w': '.8',
  }),
  T('kreide', 'Kreidetafel', {
    '--fg': '#efeadf', '--dim': '#a9a397', '--ghost': '#1d1c19', '--accent': '#f3d27a', '--accent2': '#9fd3e6',
    '--card': '#0e0e0c', '--f-display': '"Caveat", cursive', '--w-display': '600', '--w-alt': '600', '--track': '0',
    '--f-text': '"Caveat", cursive', '--w-text': '600', '--hand-s': '#f3d27a', '--hand-w': '1.6',
  }, { flags: ['tilt'] }),
  T('synthwave', 'Synthwave', {
    '--fg': '#ffffff', '--dim': '#21d4fd', '--ghost': '#2a0a2a', '--accent': '#ff2bd6', '--accent2': '#21d4fd',
    '--card': '#12041a', '--glow': '0 0 .12em rgba(255,43,214,.55)', '--f-display': '"Audiowide", sans-serif', '--w-display': '400', '--w-alt': '400', '--track': '0',
    '--f-text': '"Audiowide", sans-serif', '--w-text': '400', '--hand-h': '#21d4fd', '--hand-m': '#ffffff', '--hand-s': '#ff2bd6',
  }, { deco: 'synth', flags: ['chrome', 'caps'] }),
  T('pixel', 'Pixel', {
    '--fg': '#d9f7ff', '--dim': '#5d8697', '--ghost': '#14303f', '--accent': '#4fe0ff', '--accent2': '#ff5c8a',
    '--card': '#071822', '--glow': '.06em .06em 0 #1b4b6b', '--f-display': '"Silkscreen", monospace', '--w-display': '400', '--w-alt': '400', '--track': '0',
    '--f-text': '"Silkscreen", monospace', '--w-text': '400', '--f-mono': '"Silkscreen", monospace', '--hand-s': '#ff5c8a', '--hand-w': '2',
  }, { flags: ['caps'] }),
  T('uhrwerk', 'Uhrwerk', {
    '--fg': '#cfb27a', '--dim': '#9a8459', '--ghost': '#241e14', '--accent': '#e6cf9f', '--accent2': '#b8322b',
    '--card': '#100d07', '--f-display': '"Cormorant Garamond", Georgia, serif', '--w-display': '400', '--s-display': 'italic', '--w-alt': '400', '--s-alt': 'italic', '--track': '0',
    '--f-text': '"Cormorant Garamond", Georgia, serif', '--w-text': '400', '--hand-h': '#cfb27a', '--hand-m': '#e6cf9f', '--hand-s': '#b8322b',
  }),
  T('industrial', 'Industrial', {
    '--fg': '#ff6a13', '--dim': '#8a4a22', '--ghost': '#2a1206', '--accent': '#ff6a13', '--accent2': '#ffd2b5',
    '--card': '#150802', '--f-display': '"Saira Stencil One", sans-serif', '--w-display': '400', '--w-alt': '400', '--track': '0',
    '--f-text': '"Inter Tight", sans-serif', '--w-text': '500', '--hand-s': '#ffd2b5', '--hand-w': '2',
  }, { flags: ['caps'] }),
  T('rotlicht', 'Rotlicht', {
    '--fg': '#c4001a', '--dim': '#6a000f', '--ghost': '#1a0003', '--accent': '#c4001a', '--accent2': '#8a0012',
    '--card': '#0a0001', '--card-line': '#000', '--f-display': '"Saira", sans-serif', '--w-display': '200', '--w-alt': '200', '--track': '-0.02em',
    '--f-text': '"Saira", sans-serif', '--w-text': '200', '--f-mono': '"Saira", sans-serif',
    '--hand-h': '#c4001a', '--hand-m': '#c4001a', '--hand-s': '#8a0012',
  }, { mono: true }),
  T('dotmatrix', 'Dot-Matrix', {
    '--fg': '#f2f6ff', '--dim': '#6c7590', '--ghost': '#151a24', '--accent': '#a0beff', '--accent2': '#ffd27a',
    '--card': '#05070b', '--glow': '0 0 .08em rgba(160,190,255,.4)', '--f-display': '"Doto", monospace', '--w-display': '800', '--w-alt': '800', '--track': '0',
    '--f-text': '"Doto", monospace', '--w-text': '800', '--f-mono': '"Doto", monospace', '--hand-s': '#ffd27a', '--hand-w': '1.6',
  }, { deco: 'dots', flags: ['caps'] }),
];

export const NIGHT_THEME = 'rotlicht';
export const themeById = id => THEMES.find(t => t.id === id) || THEMES[0];
