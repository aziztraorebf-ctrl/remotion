// Groupes SVG de la scene neon/data-terminal generee par Fable 5.
// La MATIERE vient du LLM (statique) ; l'ANIMATION est faite en JSX par frame
// (cf doctrine SVG-SCENES-GENERATIVES : innerHTML n'anime pas les <g> internes,
// donc chaque groupe est injecte dans un wrapper JSX anime).
// On stocke le CONTENU INTERNE de chaque <g id="..."> (sans la balise <g> externe),
// pour l'injecter dans un wrapper <g transform=... opacity=...> anime cote React.

export const NEON_DEFS = `
  <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#05080f"/>
    <stop offset="0.55" stop-color="#081020"/>
    <stop offset="1" stop-color="#0a1220"/>
  </linearGradient>
  <radialGradient id="vignette" cx="0.5" cy="0.45" r="0.75">
    <stop offset="0" stop-color="#0e1a30" stop-opacity="0.55"/>
    <stop offset="0.6" stop-color="#070d1a" stop-opacity="0.15"/>
    <stop offset="1" stop-color="#03060c" stop-opacity="0.85"/>
  </radialGradient>
  <radialGradient id="node-core-cyan" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#d8f9ff"/>
    <stop offset="0.35" stop-color="#38e0ff"/>
    <stop offset="1" stop-color="#38e0ff" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="node-core-magenta" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#ffd6ec"/>
    <stop offset="0.35" stop-color="#ff3ea5"/>
    <stop offset="1" stop-color="#ff3ea5" stop-opacity="0"/>
  </radialGradient>
  <filter id="glow-soft" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="4" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="glow-strong" x="-120%" y="-120%" width="340%" height="340%">
    <feGaussianBlur stdDeviation="9" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <pattern id="grid-fine" width="48" height="48" patternUnits="userSpaceOnUse">
    <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#38e0ff" stroke-width="1" opacity="0.07"/>
  </pattern>
  <pattern id="grid-major" width="240" height="240" patternUnits="userSpaceOnUse">
    <path d="M 240 0 L 0 0 0 240" fill="none" stroke="#38e0ff" stroke-width="1" opacity="0.13"/>
  </pattern>
  <marker id="arrow-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#38e0ff"/>
  </marker>
  <marker id="arrow-magenta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff3ea5"/>
  </marker>
`;

export const NEON_FOND = `
  <rect x="0" y="0" width="1920" height="1080" fill="url(#bg-grad)"/>
  <rect x="0" y="0" width="1920" height="1080" fill="url(#vignette)"/>
`;

export const NEON_GRILLE = `
  <rect x="0" y="0" width="1920" height="1080" fill="url(#grid-fine)"/>
  <rect x="0" y="0" width="1920" height="1080" fill="url(#grid-major)"/>
  <line x1="0" y1="540" x2="1920" y2="540" stroke="#38e0ff" stroke-width="1" opacity="0.10"/>
  <line x1="960" y1="0" x2="960" y2="1080" stroke="#38e0ff" stroke-width="1" opacity="0.10"/>
`;

export const NEON_ECRAN = `
  <rect x="430" y="150" width="1060" height="700" rx="10" fill="#071224" opacity="0.72"/>
  <rect x="430" y="150" width="1060" height="700" rx="10" fill="none" stroke="#38e0ff" stroke-width="2" opacity="0.85" filter="url(#glow-soft)"/>
  <rect x="444" y="164" width="1032" height="672" rx="6" fill="none" stroke="#38e0ff" stroke-width="1" opacity="0.25"/>
  <rect x="430" y="150" width="1060" height="34" rx="10" fill="#0b1e38" opacity="0.9"/>
  <text x="452" y="173" font-family="Menlo, Consolas, monospace" font-size="17" fill="#38e0ff" letter-spacing="3">TRACE // FLUX-MONITOR</text>
  <text x="1466" y="173" font-family="Menlo, Consolas, monospace" font-size="15" fill="#5affa0" text-anchor="end" letter-spacing="2">LIVE SEC-CH 04</text>
  <ellipse cx="960" cy="500" rx="440" ry="255" fill="none" stroke="#38e0ff" stroke-width="1" opacity="0.10"/>
  <ellipse cx="960" cy="500" rx="300" ry="172" fill="none" stroke="#38e0ff" stroke-width="1" opacity="0.08"/>
`;

// Chaque flux = un path. On les liste pour animer le dash-flow.
export const NEON_FLUX_PATHS: { d: string; color: string; w: number; marker: string }[] = [
  { d: "M 610 660 C 700 560, 800 560, 880 470", color: "#38e0ff", w: 3, marker: "arrow-cyan" },
  { d: "M 620 300 C 720 360, 800 400, 880 452", color: "#38e0ff", w: 3, marker: "arrow-cyan" },
  { d: "M 905 470 C 1010 400, 1120 380, 1230 330", color: "#ff3ea5", w: 3.5, marker: "arrow-magenta" },
  { d: "M 905 485 C 1030 520, 1130 570, 1250 640", color: "#ff3ea5", w: 3.5, marker: "arrow-magenta" },
];

export const NEON_FLUX_LABELS = `
  <g font-family="Menlo, Consolas, monospace" font-size="16" letter-spacing="1">
    <rect x="700" y="530" width="98" height="28" rx="4" fill="#05080f" stroke="#38e0ff" stroke-width="1" opacity="0.9"/>
    <text x="749" y="549" fill="#38e0ff" text-anchor="middle">$4.2M</text>
    <rect x="1030" y="332" width="98" height="28" rx="4" fill="#05080f" stroke="#ff3ea5" stroke-width="1" opacity="0.9"/>
    <text x="1079" y="351" fill="#ff3ea5" text-anchor="middle">$1.8M</text>
    <rect x="1050" y="560" width="112" height="28" rx="4" fill="#05080f" stroke="#ff3ea5" stroke-width="1" opacity="0.9"/>
    <text x="1106" y="579" fill="#ff3ea5" text-anchor="middle">$12.6M</text>
  </g>
`;

// Noeuds : chacun a un centre (cx,cy) pour le pulse, et son contenu.
export const NEON_NODES: { id: string; cx: number; cy: number; content: string; pulse: boolean }[] = [
  { id: "origine", cx: 610, cy: 660, pulse: true, content: `
    <circle cx="610" cy="660" r="34" fill="url(#node-core-cyan)" opacity="0.9"/>
    <circle cx="610" cy="660" r="13" fill="#0b2233" stroke="#38e0ff" stroke-width="2.5" filter="url(#glow-strong)"/>
    <circle cx="610" cy="660" r="24" fill="none" stroke="#38e0ff" stroke-width="1" opacity="0.5"/>
    <text x="610" y="712" font-family="Menlo, Consolas, monospace" font-size="16" fill="#38e0ff" text-anchor="middle" letter-spacing="2">ORIGINE</text>` },
  { id: "node02", cx: 620, cy: 300, pulse: false, content: `
    <circle cx="620" cy="300" r="26" fill="url(#node-core-cyan)" opacity="0.8"/>
    <circle cx="620" cy="300" r="10" fill="#0b2233" stroke="#38e0ff" stroke-width="2" filter="url(#glow-soft)"/>
    <text x="620" y="264" font-family="Menlo, Consolas, monospace" font-size="14" fill="#38e0ff" text-anchor="middle" letter-spacing="2">NODE-02</text>` },
  { id: "relais", cx: 890, cy: 468, pulse: true, content: `
    <circle cx="890" cy="468" r="40" fill="url(#node-core-cyan)" opacity="0.95"/>
    <circle cx="890" cy="468" r="15" fill="#0b2233" stroke="#38e0ff" stroke-width="3" filter="url(#glow-strong)"/>
    <circle cx="890" cy="468" r="28" fill="none" stroke="#38e0ff" stroke-width="1" opacity="0.55"/>
    <text x="890" y="418" font-family="Menlo, Consolas, monospace" font-size="15" fill="#38e0ff" text-anchor="middle" letter-spacing="2">NODE-07 RELAIS</text>` },
  { id: "shellA", cx: 1245, cy: 330, pulse: true, content: `
    <circle cx="1245" cy="330" r="32" fill="url(#node-core-magenta)" opacity="0.9"/>
    <circle cx="1245" cy="330" r="12" fill="#2a0b1d" stroke="#ff3ea5" stroke-width="2.5" filter="url(#glow-strong)"/>
    <circle cx="1245" cy="330" r="22" fill="none" stroke="#ff3ea5" stroke-width="1" opacity="0.5"/>
    <text x="1290" y="322" font-family="Menlo, Consolas, monospace" font-size="14" fill="#ff3ea5" letter-spacing="2">SHELL-A</text>` },
  { id: "dest", cx: 1275, cy: 650, pulse: true, content: `
    <circle cx="1275" cy="650" r="38" fill="url(#node-core-magenta)" opacity="0.95"/>
    <circle cx="1275" cy="650" r="14" fill="#2a0b1d" stroke="#ff3ea5" stroke-width="3" filter="url(#glow-strong)"/>
    <circle cx="1275" cy="650" r="26" fill="none" stroke="#ff3ea5" stroke-width="1" opacity="0.55"/>
    <text x="1275" y="708" font-family="Menlo, Consolas, monospace" font-size="15" fill="#ff3ea5" text-anchor="middle" letter-spacing="2">DESTINATION ?</text>` },
];

// Anneaux d'alerte (sonar) autour des cibles suspectes — animes (r qui grandit).
export const NEON_ALERT_TARGETS: { cx: number; cy: number }[] = [
  { cx: 1275, cy: 650 },
  { cx: 1245, cy: 330 },
];

export const NEON_ALERT_STATIC = `
  <g transform="translate(1350 585)">
    <path d="M 14 0 L 28 24 L 0 24 Z" fill="#1c1406" stroke="#ffb020" stroke-width="2" filter="url(#glow-soft)"/>
    <rect x="12.5" y="8" width="3" height="9" fill="#ffb020"/>
    <rect x="12.5" y="19" width="3" height="3" fill="#ffb020"/>
  </g>
  <rect x="1388" y="583" width="112" height="30" rx="4" fill="#05080f" stroke="#ffb020" stroke-width="1.5" opacity="0.95"/>
  <text x="1444" y="604" font-family="Menlo, Consolas, monospace" font-size="16" fill="#ffb020" text-anchor="middle" letter-spacing="2">ALERTE</text>
`;

export const NEON_HUD = `
  <path d="M 40 40 L 40 110 M 40 40 L 110 40" fill="none" stroke="#38e0ff" stroke-width="3" opacity="0.9" filter="url(#glow-soft)"/>
  <path d="M 1880 40 L 1880 110 M 1880 40 L 1810 40" fill="none" stroke="#38e0ff" stroke-width="3" opacity="0.9" filter="url(#glow-soft)"/>
  <path d="M 40 1040 L 40 970 M 40 1040 L 110 1040" fill="none" stroke="#38e0ff" stroke-width="3" opacity="0.9" filter="url(#glow-soft)"/>
  <path d="M 1880 1040 L 1880 970 M 1880 1040 L 1810 1040" fill="none" stroke="#38e0ff" stroke-width="3" opacity="0.9" filter="url(#glow-soft)"/>
  <text x="84" y="1010" font-family="Menlo, Consolas, monospace" font-size="14" fill="#38e0ff" opacity="0.75" letter-spacing="3">GRID 48.7N / 2.3E</text>
  <text x="1836" y="1010" font-family="Menlo, Consolas, monospace" font-size="14" fill="#38e0ff" opacity="0.75" letter-spacing="3" text-anchor="end">UPLINK 214 MS</text>
`;

export const NEON_TITRES = `
  <text x="960" y="78" font-family="Menlo, Consolas, monospace" font-size="34" fill="#e6f9ff" text-anchor="middle" letter-spacing="10" filter="url(#glow-soft)">TRACEUR DE FLUX ILLICITES</text>
  <text x="960" y="112" font-family="Menlo, Consolas, monospace" font-size="16" fill="#38e0ff" text-anchor="middle" letter-spacing="6" opacity="0.85">UNITE RENSEIGNEMENT FINANCIER - CANAL SECURISE</text>
`;
