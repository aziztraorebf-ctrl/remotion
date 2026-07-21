// Groupes SVG de la scene "village de pecheurs senegalais au coucher de soleil".
// Matiere statique = public/_rnd/fable-svg/village-parallaxe.svg (7 plans de parallaxe).
// La VIE (parallaxe, reflet ondulant, oiseaux, palmiers, coucher de soleil, fenetres)
// est faite en JSX par frame cote React (doctrine SVG : innerHTML n'anime pas les <g>
// internes -> chaque plan est injecte dans un wrapper <g transform> anime).
//
// On stocke le CONTENU INTERNE de chaque <g id="plan-..."> (sans la balise <g> externe).
// Certains sous-elements (soleil, reflet, oiseaux, frondes de palmiers, fenetres) sont
// SORTIS des strings de plan et decrits en donnees JS pour etre animes individuellement.

export const VILLAGE_DEFS = `
  <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#4a2f55"/>
    <stop offset="0.32" stop-color="#8a4a63"/>
    <stop offset="0.55" stop-color="#c96a58"/>
    <stop offset="0.74" stop-color="#e0795b"/>
    <stop offset="0.88" stop-color="#ffd98a"/>
    <stop offset="1" stop-color="#f2cf72"/>
  </linearGradient>
  <radialGradient id="gSunGlow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#fff3c9" stop-opacity="0.9"/>
    <stop offset="0.3" stop-color="#ffdf9a" stop-opacity="0.5"/>
    <stop offset="0.65" stop-color="#f2a65e" stop-opacity="0.2"/>
    <stop offset="1" stop-color="#f2a65e" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="gSun" cx="0.5" cy="0.42" r="0.6">
    <stop offset="0" stop-color="#fffbe8"/>
    <stop offset="0.65" stop-color="#ffe9a0"/>
    <stop offset="1" stop-color="#f7c96e"/>
  </radialGradient>
  <linearGradient id="gSea" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#cf8355"/>
    <stop offset="0.16" stop-color="#6f7a68"/>
    <stop offset="0.45" stop-color="#2e6068"/>
    <stop offset="0.75" stop-color="#1d4a55"/>
    <stop offset="1" stop-color="#16394a"/>
  </linearGradient>
  <linearGradient id="gGlitCol" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffd98a" stop-opacity="0.3"/>
    <stop offset="1" stop-color="#ffd98a" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="gWet" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e8b07a"/>
    <stop offset="1" stop-color="#c49a5e"/>
  </linearGradient>
  <linearGradient id="gSand" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e2b578"/>
    <stop offset="0.5" stop-color="#caa46a"/>
    <stop offset="1" stop-color="#a97f47"/>
  </linearGradient>
  <linearGradient id="gFore" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#b08a52"/>
    <stop offset="1" stop-color="#7a4e26"/>
  </linearGradient>
  <linearGradient id="gDune" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#d9a96a"/>
    <stop offset="1" stop-color="#a87c46"/>
  </linearGradient>
  <linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e8c088"/>
    <stop offset="1" stop-color="#b98a55"/>
  </linearGradient>
  <linearGradient id="gRoof" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#b98a4e"/>
    <stop offset="1" stop-color="#7a5326"/>
  </linearGradient>
  <linearGradient id="gTin" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#d98a55"/>
    <stop offset="1" stop-color="#9c5233"/>
  </linearGradient>
  <linearGradient id="gHullA" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e05a48"/>
    <stop offset="1" stop-color="#9c3226"/>
  </linearGradient>
  <linearGradient id="gHullB" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#3f7fa8"/>
    <stop offset="1" stop-color="#23506e"/>
  </linearGradient>
  <linearGradient id="gBottom" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#4a2c14" stop-opacity="0"/>
    <stop offset="1" stop-color="#4a2c14" stop-opacity="0.45"/>
  </linearGradient>
  <linearGradient id="gNight" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0c0a2a"/>
    <stop offset="0.45" stop-color="#241238"/>
    <stop offset="0.8" stop-color="#3a1c3e"/>
    <stop offset="1" stop-color="#2a1830"/>
  </linearGradient>
  <pattern id="netMesh" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
    <path d="M0,11 H22 M11,0 V22" stroke="#6b4a26" stroke-width="2" fill="none"/>
  </pattern>
  <clipPath id="clipHullA">
    <path d="M556,816 C780,856 1340,856 1564,806 C1500,868 1330,912 1060,916 C790,912 620,868 556,816 Z"/>
  </clipPath>
  <clipPath id="clipHullB">
    <path d="M44,782 C180,814 420,814 556,778 C470,842 340,866 292,866 C220,862 96,826 44,782 Z"/>
  </clipPath>
  <path id="frond" d="M0,0 Q36,-24 92,-18 Q42,-4 4,9 Z"/>
  <path id="bird" d="M0,0 Q7,-8 14,0 Q21,-8 28,0"/>
`;

// --- PLAN CIEL : rect degrade + glow + nuages. SOLEIL sorti (anime en translateY). ---
export const PLAN_CIEL = `
  <rect x="-200" y="-60" width="2320" height="660" fill="url(#gSky)"/>
  <path d="M180,190 Q420,168 700,176 Q560,196 320,198 Q230,198 180,190 Z" fill="#e0795b" opacity="0.4"/>
  <path d="M980,140 Q1240,124 1520,134 Q1360,152 1120,154 Q1030,152 980,140 Z" fill="#e0795b" opacity="0.3"/>
  <path d="M1420,236 Q1660,220 1900,230 Q1740,248 1540,250 Q1460,246 1420,236 Z" fill="#ffd98a" opacity="0.45"/>
  <path d="M740,396 Q920,362 1120,366 Q1330,370 1490,394 Q1310,412 1060,410 Q870,408 740,396 Z" fill="#ffce8a" opacity="0.85"/>
  <path d="M760,404 Q930,376 1120,380 Q1320,384 1470,402 Q1300,416 1070,414 Q880,412 760,404 Z" fill="#b05a68" opacity="0.8"/>
  <path d="M240,462 Q380,440 540,446 Q430,466 300,468 Q260,466 240,462 Z" fill="#ffce8a" opacity="0.6"/>
  <path d="M256,468 Q390,450 526,452 Q420,470 310,472 Q272,470 256,468 Z" fill="#a85668" opacity="0.6"/>
`;

// Soleil : glow (ellipse) + disque (circle). cx=1150. cyGlow=520, cySun=545.
export const SUN_CX = 1150;
export const SUN_GLOW_CY = 520;
export const SUN_CY = 545;

// --- PLAN OCEAN : mer + traits d'ecume. Reflet (ellipses) sorti (ondule). ---
export const PLAN_OCEAN = `
  <path d="M-200,580 H2120 V790 Q1800,802 1500,796 Q1100,788 800,798 Q450,806 -200,794 Z" fill="url(#gSea)"/>
  <rect x="-200" y="578" width="2320" height="4" fill="#f2cf72" opacity="0.55"/>
  <rect x="-200" y="582" width="2320" height="24" fill="#d98a55" opacity="0.45"/>
  <rect x="1040" y="582" width="220" height="210" fill="url(#gGlitCol)"/>
  <path d="M-200,624 Q300,616 700,624 T1600,622 T2120,626" stroke="#12303c" stroke-width="3" fill="none" opacity="0.35"/>
  <path d="M-200,660 Q400,652 900,660 T2120,656" stroke="#12303c" stroke-width="3" fill="none" opacity="0.3"/>
  <path d="M-200,700 Q350,692 850,700 T2120,696" stroke="#12303c" stroke-width="4" fill="none" opacity="0.28"/>
  <path d="M-200,744 Q450,736 950,744 T2120,740" stroke="#0f2a35" stroke-width="4" fill="none" opacity="0.25"/>
  <path d="M860,648 Q1000,642 1160,648 T1420,646" stroke="#f2cf72" stroke-width="3" fill="none" opacity="0.5"/>
  <path d="M920,714 Q1080,708 1240,714 T1480,712" stroke="#ffd98a" stroke-width="3" fill="none" opacity="0.35"/>
`;

// Ellipses de reflet du soleil sur l'eau (ondulent : opacite/scaleX en sin).
export const OCEAN_REFLECTS: { cx: number; cy: number; rx: number; ry: number; op: number; fill: string }[] = [
  { cx: 1150, cy: 596, rx: 60, ry: 4, op: 0.9, fill: "#fff3c9" },
  { cx: 1128, cy: 610, rx: 44, ry: 4, op: 0.7, fill: "#ffd98a" },
  { cx: 1176, cy: 622, rx: 52, ry: 4, op: 0.75, fill: "#ffd98a" },
  { cx: 1142, cy: 636, rx: 70, ry: 5, op: 0.65, fill: "#fff3c9" },
  { cx: 1170, cy: 652, rx: 48, ry: 4, op: 0.6, fill: "#ffd98a" },
  { cx: 1122, cy: 666, rx: 60, ry: 5, op: 0.6, fill: "#ffd98a" },
  { cx: 1158, cy: 684, rx: 84, ry: 6, op: 0.5, fill: "#ffd98a" },
  { cx: 1136, cy: 702, rx: 64, ry: 5, op: 0.45, fill: "#ffd98a" },
  { cx: 1178, cy: 722, rx: 90, ry: 6, op: 0.4, fill: "#ffd98a" },
  { cx: 1140, cy: 742, rx: 74, ry: 6, op: 0.35, fill: "#ffd98a" },
  { cx: 1164, cy: 762, rx: 100, ry: 7, op: 0.3, fill: "#ffd98a" },
  { cx: 1150, cy: 778, rx: 120, ry: 7, op: 0.28, fill: "#ffd98a" },
];

// --- PLAN LOINTAIN : silhouettes + bateaux. OISEAUX sortis (derivent). ---
export const PLAN_LOINTAIN = `
  <path d="M1720,580 Q1860,552 2120,548 L2120,580 Z" fill="#5e3a4a" opacity="0.85"/>
  <path d="M400,622 q34,9 72,0 q-36,14 -72,0 z" fill="#2e2233" opacity="0.9"/>
  <path d="M720,612 q30,8 64,0 q-32,13 -64,0 z" fill="#2e2233" opacity="0.9"/>
  <path d="M748,610 V592" stroke="#2e2233" stroke-width="4"/>
  <circle cx="748" cy="588" r="4" fill="#2e2233"/>
  <path d="M1268,606 q40,10 84,0 q-42,16 -84,0 z" fill="#2e2233" opacity="0.95"/>
  <path d="M1300,604 V586" stroke="#2e2233" stroke-width="4"/>
  <circle cx="1300" cy="582" r="4" fill="#2e2233"/>
`;

// Oiseaux : position de base + echelle. Derivent lentement (translate en frame).
export const BIRDS: { x: number; y: number; scale: number }[] = [
  { x: 900, y: 320, scale: 1 },
  { x: 962, y: 298, scale: 0.8 },
  { x: 1032, y: 338, scale: 0.7 },
  { x: 700, y: 262, scale: 0.9 },
  { x: 1242, y: 278, scale: 0.65 },
];

// --- PLAN VILLAGE : dune + cases + troncs. FRONDES de palmiers et FENETRES sorties. ---
export const PLAN_VILLAGE = `
  <path d="M-200,706 Q40,652 240,648 Q460,644 640,658 Q760,668 820,706 L840,860 Q400,838 -200,852 Z" fill="url(#gDune)"/>
  <path d="M-200,706 Q40,652 240,648 Q460,644 640,658 Q760,668 820,706" stroke="#e8c088" stroke-width="3" fill="none" opacity="0.5"/>
  <path d="M60,700 C66,620 76,540 90,474 L102,478 C90,548 82,624 84,700 Z" fill="#5a4126"/>
  <ellipse cx="164" cy="614" rx="30" ry="30" fill="#ffd98a" opacity="0.3"/>
  <ellipse cx="266" cy="614" rx="30" ry="30" fill="#ffd98a" opacity="0.3"/>
  <rect x="112" y="548" width="188" height="12" rx="4" fill="#c99a5e"/>
  <rect x="118" y="556" width="176" height="112" rx="3" fill="url(#gWall)"/>
  <rect x="246" y="556" width="48" height="112" fill="#f2c078" opacity="0.5"/>
  <rect x="118" y="560" width="176" height="6" fill="#8a5a2c" opacity="0.4"/>
  <path d="M196,668 V616 Q213,600 230,616 V668 Z" fill="#3a2417"/>
  <polygon points="306,560 478,556 496,596 316,596" fill="url(#gTin)"/>
  <g stroke="#8a4a33" stroke-width="2" opacity="0.5">
    <path d="M340,594 L330,560"/><path d="M362,594 L352,559"/><path d="M384,594 L374,559"/>
    <path d="M406,595 L396,558"/><path d="M428,595 L418,558"/><path d="M450,595 L440,557"/>
    <path d="M472,595 L462,557"/>
  </g>
  <rect x="330" y="592" width="150" height="84" fill="url(#gWall)"/>
  <rect x="330" y="592" width="40" height="84" fill="#8a5a2c" opacity="0.35"/>
  <rect x="388" y="624" width="30" height="52" fill="#3a2417"/>
  <path d="M506,624 L562,546 L618,624 Q562,612 506,624 Z" fill="url(#gRoof)"/>
  <g stroke="#6b4423" stroke-width="2" opacity="0.5">
    <path d="M562,546 L522,620"/><path d="M562,546 L546,616"/><path d="M562,546 L580,616"/><path d="M562,546 L602,620"/>
  </g>
  <rect x="520" y="618" width="84" height="54" rx="8" fill="url(#gWall)"/>
  <rect x="548" y="636" width="26" height="36" rx="10" fill="#3a2417"/>
  <rect x="700" y="608" width="6" height="92" fill="#5a4126"/>
  <rect x="792" y="604" width="6" height="96" fill="#5a4126"/>
  <rect x="694" y="612" width="110" height="5" fill="#6b4a26"/>
  <path d="M714,620 q6,14 0,26 q-6,-12 0,-26 z" fill="#4a3423"/>
  <path d="M738,620 q6,14 0,26 q-6,-12 0,-26 z" fill="#4a3423"/>
  <path d="M762,620 q6,14 0,26 q-6,-12 0,-26 z" fill="#4a3423"/>
  <path d="M786,620 q6,14 0,26 q-6,-12 0,-26 z" fill="#4a3423"/>
`;

// Troncs des palmiers (points de pivot des frondes). Chaque palmier = liste de frondes.
// pivot = point de rotation (haut du tronc) ; les frondes tournent legerement autour.
export const PALM_TREES: {
  px: number;
  py: number;
  fronds: { rot: number; scale: number; fill: string }[];
}[] = [
  {
    px: 94,
    py: 470,
    fronds: [
      { rot: -15, scale: 1, fill: "#463a2b" },
      { rot: -45, scale: 1, fill: "#463a2b" },
      { rot: -75, scale: 1, fill: "#463a2b" },
      { rot: -105, scale: 1, fill: "#514434" },
      { rot: -135, scale: 1, fill: "#463a2b" },
      { rot: -165, scale: 1, fill: "#514434" },
      { rot: 20, scale: 0.9, fill: "#463a2b" },
      { rot: 200, scale: 0.85, fill: "#463a2b" },
    ],
  },
  {
    px: 672,
    py: 544,
    fronds: [
      { rot: -10, scale: 0.75, fill: "#4b3b2e" },
      { rot: -45, scale: 0.75, fill: "#4b3b2e" },
      { rot: -80, scale: 0.75, fill: "#514434" },
      { rot: -120, scale: 0.7, fill: "#4b3b2e" },
      { rot: -155, scale: 0.75, fill: "#514434" },
      { rot: 25, scale: 0.65, fill: "#4b3b2e" },
      { rot: 198, scale: 0.6, fill: "#4b3b2e" },
    ],
  },
];

// Fenetres des cases : s'allument quand la nuit tombe (opacite/glow monte).
// baseFill = couleur de jour (deja jaune pale), on renforce l'eclat la nuit.
export const WINDOWS: { x: number; y: number; w: number; h: number; fill: string }[] = [
  { x: 140, y: 596, w: 24, h: 28, fill: "#ffdf9a" },
  { x: 254, y: 596, w: 24, h: 28, fill: "#ffce7a" },
  { x: 434, y: 620, w: 22, h: 24, fill: "#ffdf9a" },
];

// --- PLAN SABLE : plage humide + sable sec + reflet au sol. ---
export const PLAN_SABLE = `
  <path d="M-200,780 Q400,768 900,776 Q1400,782 2120,770 L2120,836 Q1200,852 500,844 Q100,840 -200,848 Z" fill="url(#gWet)"/>
  <path d="M-200,780 Q400,768 900,776 Q1400,782 2120,770" stroke="#fff0d0" stroke-width="5" fill="none" opacity="0.75"/>
  <ellipse cx="1150" cy="806" rx="130" ry="20" fill="#ffd98a" opacity="0.3"/>
  <ellipse cx="1150" cy="800" rx="60" ry="10" fill="#fff3c9" opacity="0.35"/>
  <path d="M120,806 Q400,796 700,804" stroke="#fff0d0" stroke-width="3" fill="none" opacity="0.5"/>
  <path d="M1600,800 Q1850,794 2100,802" stroke="#fff0d0" stroke-width="3" fill="none" opacity="0.5"/>
  <path d="M-200,826 Q500,836 1100,830 Q1700,822 2120,832 L2120,1080 H-200 Z" fill="url(#gSand)"/>
  <path d="M-200,872 Q300,864 800,872 T2120,868" stroke="#a97f47" stroke-width="2" fill="none" opacity="0.5"/>
  <path d="M-200,918 Q400,910 900,918 T2120,912" stroke="#a97f47" stroke-width="2" fill="none" opacity="0.4"/>
  <path d="M-100,962 Q500,954 1000,962 T2120,956" stroke="#a97f47" stroke-width="2" fill="none" opacity="0.35"/>
  <path d="M-200,874 Q300,866 800,874" stroke="#e8c088" stroke-width="1.5" fill="none" opacity="0.5"/>
`;

// --- PLAN PIROGUES : 2 pirogues (coques + details). ---
export const PLAN_PIROGUES = `
  <ellipse cx="260" cy="864" rx="240" ry="16" fill="#5e3a1e" opacity="0.35"/>
  <path d="M44,782 C180,814 420,814 556,778 C470,842 340,866 292,866 C220,862 96,826 44,782 Z" fill="url(#gHullB)"/>
  <g clip-path="url(#clipHullB)">
    <rect x="30" y="800" width="540" height="18" fill="#f2e6cc"/>
    <rect x="30" y="818" width="540" height="7" fill="#e05a48"/>
    <circle cx="140" cy="796" r="12" fill="#f2e6cc"/>
    <circle cx="140" cy="796" r="6" fill="#23506e"/>
  </g>
  <path d="M84,788 C200,814 400,814 516,784 C400,830 200,830 84,788 Z" fill="#3a2417" opacity="0.85"/>
  <path d="M44,782 C180,814 420,814 556,778" stroke="#ffd98a" stroke-width="3" fill="none" opacity="0.6"/>
  <ellipse cx="1000" cy="918" rx="480" ry="26" fill="#5e3a1e" opacity="0.4"/>
  <path d="M556,816 C780,856 1340,856 1564,806 C1500,868 1330,912 1060,916 C790,912 620,868 556,816 Z" fill="url(#gHullA)"/>
  <g clip-path="url(#clipHullA)">
    <rect x="540" y="860" width="1040" height="20" fill="#f2cf72"/>
    <rect x="540" y="880" width="1040" height="18" fill="#3f7f57"/>
    <polyline points="704,876 728,862 752,876 776,862 800,876 824,862 848,876 872,862 896,876 920,862 944,876 968,862 992,876 1016,862 1040,876 1064,862 1088,876 1112,862 1136,876 1160,862 1184,876 1208,862 1232,876 1256,862 1280,876 1304,862 1328,876 1352,862 1376,876 1400,862" stroke="#fdf6e3" stroke-width="5" fill="none" opacity="0.9"/>
    <circle cx="1476" cy="846" r="16" fill="#fdf6e3"/>
    <circle cx="1476" cy="846" r="8" fill="#23506e"/>
    <rect x="620" y="836" width="10" height="60" fill="#f2cf72" opacity="0.8"/>
    <rect x="644" y="840" width="10" height="60" fill="#fdf6e3" opacity="0.8"/>
  </g>
  <path d="M600,824 C800,858 1320,858 1520,812 C1320,846 800,846 600,824 Z" fill="#4a2418" opacity="0.85"/>
  <path d="M556,816 C780,856 1340,856 1564,806" stroke="#ffd98a" stroke-width="4" fill="none" opacity="0.7"/>
  <path d="M1560,806 L1552,742" stroke="#5a4126" stroke-width="5"/>
  <path d="M1552,742 L1512,752 L1552,764 Z" fill="#e05a48"/>
  <g transform="translate(900,830) rotate(-24)">
    <rect x="0" y="0" width="150" height="7" rx="3" fill="#6b4a26"/>
    <ellipse cx="162" cy="4" rx="26" ry="12" fill="#8a5a2c"/>
  </g>
`;

// --- PLAN AVANT : filet + flotteurs + objets au premier plan. ---
export const PLAN_AVANT = `
  <path d="M-200,972 Q400,946 900,960 Q1500,974 2120,950 L2120,1080 H-200 Z" fill="url(#gFore)"/>
  <path d="M1180,1004 Q1340,962 1520,972 Q1720,982 1900,956 Q2050,940 2120,952 L2120,1080 L1180,1080 Q1160,1040 1180,1004 Z" fill="#8a5a2c" opacity="0.3"/>
  <path d="M1180,1004 Q1340,962 1520,972 Q1720,982 1900,956 Q2050,940 2120,952 L2120,1080 L1180,1080 Q1160,1040 1180,1004 Z" fill="url(#netMesh)" opacity="0.8"/>
  <path d="M1180,1004 Q1340,962 1520,972 Q1720,982 1900,956 Q2050,940 2120,952" stroke="#7a4e26" stroke-width="5" fill="none"/>
  <circle cx="1240" cy="988" r="13" fill="#e05a48"/>
  <circle cx="1350" cy="968" r="13" fill="#f2cf72"/>
  <circle cx="1470" cy="970" r="13" fill="#3f7fa8"/>
  <circle cx="1600" cy="976" r="13" fill="#e05a48"/>
  <circle cx="1730" cy="972" r="13" fill="#f2cf72"/>
  <circle cx="1860" cy="958" r="13" fill="#3f7fa8"/>
  <circle cx="1990" cy="948" r="13" fill="#e05a48"/>
  <g stroke="#7a4e26" fill="none" opacity="0.9">
    <ellipse cx="320" cy="1030" rx="70" ry="22" stroke-width="9"/>
    <ellipse cx="320" cy="1030" rx="52" ry="16" stroke-width="8"/>
    <ellipse cx="320" cy="1030" rx="34" ry="10" stroke-width="7"/>
    <path d="M386,1030 Q460,1044 520,1030" stroke-width="7"/>
  </g>
  <path d="M560,1024 Q700,1060 900,1046" stroke="#7a4e26" stroke-width="4" fill="none" opacity="0.7"/>
  <circle cx="560" cy="1006" r="20" fill="#e05a48"/>
  <circle cx="554" cy="1000" r="6" fill="#ffd98a" opacity="0.7"/>
  <ellipse cx="760" cy="1002" rx="8" ry="5" fill="#f2e0c0" opacity="0.8"/>
  <ellipse cx="980" cy="1036" rx="6" ry="4" fill="#f2e0c0" opacity="0.8"/>
  <ellipse cx="1080" cy="996" rx="7" ry="4" fill="#f2e0c0" opacity="0.7"/>
  <ellipse cx="880" cy="1010" rx="6" ry="4" fill="#5e3a1e" opacity="0.5"/>
  <rect x="-200" y="1010" width="2320" height="70" fill="url(#gBottom)"/>
`;
