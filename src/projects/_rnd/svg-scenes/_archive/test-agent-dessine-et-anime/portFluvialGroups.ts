// ---------------------------------------------------------------------------
// MATIERE STATIQUE de la scene "Port fluvial ouest-africain a l'aube".
//
// Doctrine maison : ce fichier ne contient QUE du SVG statique + des DONNEES
// (positions, profondeurs, tailles). Aucune animation ici : toute la vie est
// codee frame par frame dans SceneVivanteMax16x9.tsx.
//
// Repere : viewBox 1920 x 1080. Horizon (ligne d'eau lointaine) a y = 470.
// Quai (sol du premier plan ou marchent les dockers) a y = 880.
//
// PERSPECTIVE : la taille de tout element pose au sol DERIVE de sa profondeur
// via une formule unique (voir scaleFromDepth dans le composant). Aucune taille
// n'est reglee a l'oeil element par element.
// ---------------------------------------------------------------------------

export const HORIZON_Y = 470;
export const QUAI_Y = 880;

// ---------------------------------------------------------------------------
// DEFS : degrades et symboles reutilisables.
// gSkyNight / gSkyDawn sont superposes : on fait varier l'opacite du second.
// ---------------------------------------------------------------------------
export const PORT_DEFS = `
  <linearGradient id="pSkyNight" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stop-color="#0b1027"/>
    <stop offset="0.38" stop-color="#141c3d"/>
    <stop offset="0.72" stop-color="#24284c"/>
    <stop offset="1"    stop-color="#38304f"/>
  </linearGradient>
  <linearGradient id="pSkyDawn" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stop-color="#2b3a6b"/>
    <stop offset="0.30" stop-color="#6b5a86"/>
    <stop offset="0.55" stop-color="#c4726b"/>
    <stop offset="0.76" stop-color="#e79a5f"/>
    <stop offset="0.92" stop-color="#f6c877"/>
    <stop offset="1"    stop-color="#fbe0a2"/>
  </linearGradient>
  <radialGradient id="pSunGlow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0"    stop-color="#fff2cd" stop-opacity="0.95"/>
    <stop offset="0.26" stop-color="#ffd691" stop-opacity="0.55"/>
    <stop offset="0.60" stop-color="#f2955c" stop-opacity="0.22"/>
    <stop offset="1"    stop-color="#f2955c" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="pSunDisc" cx="0.5" cy="0.44" r="0.6">
    <stop offset="0"    stop-color="#fffdf0"/>
    <stop offset="0.62" stop-color="#ffe6a6"/>
    <stop offset="1"    stop-color="#f8c368"/>
  </radialGradient>
  <linearGradient id="pRiver" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stop-color="#3b4468"/>
    <stop offset="0.14" stop-color="#2e3757"/>
    <stop offset="0.46" stop-color="#22304b"/>
    <stop offset="1"    stop-color="#16223a"/>
  </linearGradient>
  <linearGradient id="pQuaiTop" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stop-color="#4a4256"/>
    <stop offset="0.5" stop-color="#3b3648"/>
    <stop offset="1"   stop-color="#2c2937"/>
  </linearGradient>
  <linearGradient id="pQuaiWall" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stop-color="#2a2734"/>
    <stop offset="1"   stop-color="#171622"/>
  </linearGradient>
  <linearGradient id="pFarBank" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stop-color="#2a2f52"/>
    <stop offset="1"   stop-color="#1d2340"/>
  </linearGradient>
  <linearGradient id="pMidBank" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stop-color="#242a49"/>
    <stop offset="1"   stop-color="#171c33"/>
  </linearGradient>
  <linearGradient id="pNight" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stop-color="#060a1c" stop-opacity="0.92"/>
    <stop offset="0.45" stop-color="#0a1130" stop-opacity="0.74"/>
    <stop offset="0.80" stop-color="#101637" stop-opacity="0.52"/>
    <stop offset="1"    stop-color="#141a38" stop-opacity="0.40"/>
  </linearGradient>
  <linearGradient id="pWarmWash" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stop-color="#ffb066" stop-opacity="0"/>
    <stop offset="0.42" stop-color="#ffb066" stop-opacity="0.10"/>
    <stop offset="0.66" stop-color="#ff9a52" stop-opacity="0.20"/>
    <stop offset="1"    stop-color="#ff8a44" stop-opacity="0.07"/>
  </linearGradient>
  <radialGradient id="pLampGlow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0"   stop-color="#ffd98a" stop-opacity="0.85"/>
    <stop offset="0.4" stop-color="#ffbe63" stop-opacity="0.32"/>
    <stop offset="1"   stop-color="#ff9f3d" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="pBrazier" cx="0.5" cy="0.55" r="0.5">
    <stop offset="0"   stop-color="#ffd27a" stop-opacity="0.9"/>
    <stop offset="0.45" stop-color="#ff8a3d" stop-opacity="0.4"/>
    <stop offset="1"   stop-color="#e4551f" stop-opacity="0"/>
  </radialGradient>

  <symbol id="pBird" viewBox="0 0 24 12" overflow="visible">
    <path d="M0 8 Q6 0 12 7 Q18 0 24 8" />
  </symbol>
`;

// ---------------------------------------------------------------------------
// PLAN 0 : rive lointaine (silhouette de la ville en face, derriere l'eau).
// ---------------------------------------------------------------------------
export const PLAN_RIVE_LOINTAINE = `
  <path fill="url(#pFarBank)" d="
    M -260 470
    L -260 440 L -120 440 L -120 424 L -40 424 L -40 446
    L 60 446 L 60 408 L 96 408 L 96 396 L 130 396 L 130 434
    L 210 434 L 210 452 L 300 452 L 300 418 L 340 418 L 340 402
    L 372 402 L 372 440 L 470 440 L 470 428 L 560 428 L 560 448
    L 660 448 L 660 414 L 700 414 L 700 400 L 736 400 L 736 442
    L 830 442 L 830 452 L 960 452 L 960 430 L 1010 430 L 1010 414
    L 1046 414 L 1046 446 L 1140 446 L 1140 436 L 1230 436 L 1230 452
    L 1330 452 L 1330 420 L 1372 420 L 1372 404 L 1404 404 L 1404 444
    L 1500 444 L 1500 430 L 1600 430 L 1600 450 L 1700 450 L 1700 422
    L 1748 422 L 1748 408 L 1782 408 L 1782 446 L 1880 446 L 1880 434
    L 2180 434 L 2180 470 Z" />
  <g fill="#151a33" opacity="0.55">
    <rect x="-40" y="440" width="1" height="30"/>
    <rect x="300" y="446" width="1" height="24"/>
    <rect x="960" y="444" width="1" height="26"/>
    <rect x="1500" y="442" width="1" height="28"/>
  </g>
`;

// ---------------------------------------------------------------------------
// PLAN 1 : rive intermediaire — appontement lointain + entrepots bas.
// ---------------------------------------------------------------------------
export const PLAN_RIVE_MEDIANE = `
  <path fill="url(#pMidBank)" d="
    M -260 505 L -260 486 L 120 486 L 120 472 L 250 472 L 250 490
    L 470 490 L 470 478 L 610 478 L 610 496 L 900 496 L 900 480
    L 1080 480 L 1080 492 L 1360 492 L 1360 476 L 1520 476 L 1520 494
    L 2180 494 L 2180 505 Z" />
  <g fill="#1a2039">
    <rect x="150" y="454" width="58" height="34" rx="2"/>
    <rect x="163" y="440" width="32" height="16" rx="1"/>
    <rect x="640" y="452" width="74" height="46" rx="2"/>
    <rect x="1120" y="458" width="62" height="36" rx="2"/>
    <rect x="1430" y="450" width="70" height="44" rx="2"/>
  </g>
  <g stroke="#1a2039" stroke-width="3" fill="none">
    <path d="M 300 486 L 300 452 M 292 452 L 336 452"/>
    <path d="M 980 490 L 980 448 M 972 448 L 1022 448"/>
    <path d="M 1660 492 L 1660 456 M 1652 456 L 1698 456"/>
  </g>
`;

// ---------------------------------------------------------------------------
// PLAN 2 : le quai (sol du premier plan) — dalle + mur + bittes d'amarrage.
// ---------------------------------------------------------------------------
export const PLAN_QUAI = `
  <rect x="-260" y="880" width="2440" height="26" fill="url(#pQuaiTop)"/>
  <rect x="-260" y="906" width="2440" height="240" fill="url(#pQuaiWall)"/>
  <g stroke="#171622" stroke-width="2" opacity="0.6">
    <path d="M -120 906 L -120 1080 M 90 906 L 90 1080 M 300 906 L 300 1080
             M 510 906 L 510 1080 M 720 906 L 720 1080 M 930 906 L 930 1080
             M 1140 906 L 1140 1080 M 1350 906 L 1350 1080 M 1560 906 L 1560 1080
             M 1770 906 L 1770 1080 M 1980 906 L 1980 1080"/>
  </g>
  <g fill="#514a5e">
    <path d="M 170 880 L 170 852 Q 170 842 182 842 Q 194 842 194 852 L 194 880 Z"/>
    <path d="M 742 880 L 742 852 Q 742 842 754 842 Q 766 842 766 852 L 766 880 Z"/>
    <path d="M 1418 880 L 1418 852 Q 1418 842 1430 842 Q 1442 842 1442 852 L 1442 880 Z"/>
  </g>
  <g fill="#2c2937" opacity="0.85">
    <ellipse cx="182" cy="884" rx="26" ry="5"/>
    <ellipse cx="754" cy="884" rx="26" ry="5"/>
    <ellipse cx="1430" cy="884" rx="26" ry="5"/>
  </g>
`;

// ---------------------------------------------------------------------------
// PLAN 3 : bord de quai avant (bollards, cordages, pneus d'amarrage).
// Purement decoratif, le plus rapide en parallaxe.
// ---------------------------------------------------------------------------
export const PLAN_AVANT_QUAI = `
  <g fill="#211f2b">
    <path d="M -60 1080 L -60 986 Q 30 966 120 986 L 120 1080 Z" opacity="0.9"/>
    <path d="M 1700 1080 L 1700 996 Q 1810 972 1920 996 L 1920 1080 Z" opacity="0.9"/>
  </g>
  <g stroke="#39344a" stroke-width="7" fill="none" stroke-linecap="round">
    <path d="M 250 1002 Q 400 1052 552 1004"/>
    <path d="M 1060 1010 Q 1200 1058 1340 1012"/>
  </g>
  <g fill="none" stroke="#312d40" stroke-width="9">
    <circle cx="640" cy="1040" r="30"/>
    <circle cx="1520" cy="1046" r="26"/>
  </g>
`;

// ---------------------------------------------------------------------------
// DONNEES ANIMEES (positions de base ; l'animation vit dans le composant)
// ---------------------------------------------------------------------------

// --- Grue portuaire : un mat + une fleche pivotante + un cable + un crochet.
// La grue est un objet inerte : elle NE GLISSE PAS. Seule sa fleche pivote
// (mouvement mecanique credible) et son cable monte/descend.
export type Crane = {
  /** abscisse du pied du mat */
  x: number;
  /** profondeur normalisee 0 = tres loin, 1 = tout pres (pilote l'echelle) */
  depth: number;
  /** hauteur du mat en unites locales (avant mise a l'echelle) */
  mastH: number;
  /** longueur de la fleche */
  jibLen: number;
  /** dephasage du cycle de levage (frames) */
  phase: number;
  /** duree d'un cycle de levage complet (frames) */
  cycle: number;
  /** angle de repos de la fleche (deg, 0 = horizontale vers la droite) */
  baseAngle: number;
  /** amplitude du balayage de la fleche (deg) */
  sweep: number;
};

// BANDE ARRIERE : les grues sont posees au bord amont du quai, DERRIERE les
// hangars et le materiel du premier plan. Abscisses choisies pour qu'aucun mat
// ne soit plante dans un hangar (verifie par scripts/verify).
export const CRANES: Crane[] = [
  { x: 560, depth: 0.3, mastH: 330, jibLen: 250, phase: 0, cycle: 210, baseAngle: -8, sweep: 16 },
  { x: 1290, depth: 0.4, mastH: 360, jibLen: 235, phase: 96, cycle: 240, baseAngle: -6, sweep: 20 },
  { x: 1880, depth: 0.22, mastH: 300, jibLen: 225, phase: 168, cycle: 186, baseAngle: -10, sweep: 13 },
];

// --- Barges / pirogues sur l'eau. Un vehicule PEUT glisser : c'est credible.
export type Boat = {
  /** abscisse de depart */
  x0: number;
  /** vitesse horizontale en px/frame (signe = sens de marche) */
  vx: number;
  /** profondeur normalisee (pilote echelle ET position verticale) */
  depth: number;
  /** longueur de coque locale */
  len: number;
  /** couleur de coque */
  hull: string;
  /** couleur de la voile / bache (vide = pas de voile) */
  sail: string;
  /** dephasage du tangage */
  phase: number;
  /** true = pirogue a rameur (silhouette assise + rame) */
  rower: boolean;
};

export const BOATS: Boat[] = [
  // grosse barge lointaine, lente, remonte le fleuve vers la droite
  { x0: -260, vx: 0.62, depth: 0.16, len: 300, hull: "#2b3352", sail: "", phase: 0, rower: false },
  // pirogue mediane a voile, descend vers la gauche
  { x0: 1560, vx: -0.42, depth: 0.34, len: 180, hull: "#33324f", sail: "#5c4a63", phase: 40, rower: false },
  // pirogue a rameur, proche, lente vers la droite
  { x0: 220, vx: 0.28, depth: 0.56, len: 160, hull: "#3a3550", sail: "", phase: 78, rower: true },
  // petite pirogue tres proche, vers la gauche
  { x0: 1780, vx: -0.34, depth: 0.72, len: 140, hull: "#413a56", sail: "", phase: 120, rower: true },
];

// --- Lampadaires du quai : allumes la nuit, s'eteignent quand le jour monte.
export type Lamp = { x: number; y: number; h: number; delay: number };
// BANDE AVANT : les lampadaires sont sur le bord aval du quai, DEVANT les
// hangars. Espacement >= 200 px, et leur bras (x + 38) ne surplombe ni une pile
// de caisses ni un brasero.
export const LAMPS: Lamp[] = [
  { x: 96, y: 880, h: 168, delay: 0.0 },
  { x: 660, y: 880, h: 176, delay: 0.06 },
  { x: 1080, y: 880, h: 170, delay: 0.13 },
  { x: 1440, y: 880, h: 178, delay: 0.2 },
  { x: 1870, y: 880, h: 166, delay: 0.27 },
];

// --- Fenetres des entrepots du quai : s'allument par vagues au reveil.
export type Window = { x: number; y: number; w: number; h: number; wake: number };

// --- Entrepots / hangars poses sur le quai (objets inertes : jamais de glissement).
export type Shed = {
  x: number;
  /** largeur au sol */
  w: number;
  /** hauteur du mur */
  h: number;
  /** hauteur du toit au-dessus du mur */
  roof: number;
  wall: string;
  roofFill: string;
  windows: Window[];
  /** cheminee : abscisse relative au hangar, ou null */
  chimney: number | null;
};

export const SHEDS: Shed[] = [
  {
    x: 168,
    w: 268,
    h: 158,
    roof: 46,
    wall: "#3b3348",
    roofFill: "#2a2536",
    chimney: 214,
    windows: [
      { x: 200, y: 780, w: 26, h: 32, wake: 0.18 },
      { x: 250, y: 780, w: 26, h: 32, wake: 0.3 },
      { x: 340, y: 780, w: 26, h: 32, wake: 0.46 },
      { x: 390, y: 780, w: 26, h: 32, wake: 0.62 },
    ],
  },
  {
    x: 812,
    w: 232,
    h: 140,
    roof: 40,
    wall: "#372f44",
    roofFill: "#262133",
    chimney: null,
    windows: [
      { x: 848, y: 792, w: 24, h: 28, wake: 0.24 },
      { x: 900, y: 792, w: 24, h: 28, wake: 0.38 },
      { x: 976, y: 792, w: 24, h: 28, wake: 0.54 },
    ],
  },
  {
    x: 1518,
    w: 296,
    h: 172,
    roof: 52,
    wall: "#403751",
    roofFill: "#2d2739",
    chimney: 1566,
    windows: [
      { x: 1560, y: 770, w: 28, h: 34, wake: 0.12 },
      { x: 1618, y: 770, w: 28, h: 34, wake: 0.42 },
      { x: 1706, y: 770, w: 28, h: 34, wake: 0.58 },
      { x: 1764, y: 770, w: 28, h: 34, wake: 0.7 },
    ],
  },
];

// --- Piles de caisses / sacs sur le quai : objets INERTES. Elles n'apparaissent
// jamais en glissant : elles sont posees des le depart, seule leur lumiere change.
export type Crate = { x: number; y: number; w: number; h: number; fill: string; tilt: number };
export const CRATES: Crate[] = [
  { x: 470, y: 880, w: 62, h: 46, fill: "#4a3f52", tilt: 0 },
  { x: 470, y: 834, w: 54, h: 44, fill: "#443a4c", tilt: -1.5 },
  { x: 542, y: 880, w: 58, h: 42, fill: "#463c4f", tilt: 0 },
  { x: 1170, y: 880, w: 70, h: 50, fill: "#4c4155", tilt: 0 },
  { x: 1178, y: 830, w: 60, h: 48, fill: "#443a4e", tilt: 2 },
  { x: 1250, y: 880, w: 56, h: 40, fill: "#413848", tilt: 0 },
  { x: 1310, y: 880, w: 64, h: 44, fill: "#4a3f52", tilt: 0 },
];

// --- Dockers : silhouettes de profil qui marchent sur le quai.
// PROFIL uniquement (doctrine stick figure maison), pas de visage.
export type Docker = {
  /** abscisse de depart */
  x0: number;
  /** vitesse px/frame */
  vx: number;
  /** profondeur normalisee (pilote UNIQUEMENT l'echelle, formule unique) */
  depth: number;
  /** dephasage de la marche */
  phase: number;
  /** vitesse de la cadence de marche (rad/frame) */
  gait: number;
  /** charge portee : "none" | "head" (sur la tete) | "shoulder" (sac a l'epaule) */
  load: "none" | "head" | "shoulder";
  /** teinte du corps */
  fill: string;
};

export const DOCKERS: Docker[] = [
  { x0: -140, vx: 0.86, depth: 0.62, phase: 0, gait: 0.2, load: "head", fill: "#1b1826" },
  { x0: 660, vx: -0.7, depth: 0.5, phase: 1.9, gait: 0.17, load: "shoulder", fill: "#221d2e" },
  { x0: 1180, vx: 0.58, depth: 0.42, phase: 3.4, gait: 0.15, load: "none", fill: "#241f30" },
  { x0: 1960, vx: -0.94, depth: 0.7, phase: 0.8, gait: 0.22, load: "shoulder", fill: "#17141f" },
  { x0: 380, vx: 0.44, depth: 0.32, phase: 2.6, gait: 0.13, load: "head", fill: "#282234" },
  { x0: 1560, vx: -0.5, depth: 0.36, phase: 4.4, gait: 0.14, load: "none", fill: "#262032" },
];

// --- Oiseaux : derivent au-dessus du fleuve, deux nappes de profondeur.
export type Bird = { x: number; y: number; depth: number; vx: number; bobPhase: number; flapPhase: number };
export const BIRDS_PORT: Bird[] = [
  { x: 260, y: 236, depth: 0.1, vx: -0.5, bobPhase: 0.0, flapPhase: 0.0 },
  { x: 340, y: 262, depth: 0.09, vx: -0.46, bobPhase: 1.1, flapPhase: 0.7 },
  { x: 410, y: 224, depth: 0.11, vx: -0.54, bobPhase: 2.2, flapPhase: 1.5 },
  { x: 1180, y: 200, depth: 0.13, vx: -0.62, bobPhase: 0.6, flapPhase: 2.1 },
  { x: 1268, y: 232, depth: 0.1, vx: -0.5, bobPhase: 1.8, flapPhase: 0.3 },
  { x: 1620, y: 268, depth: 0.12, vx: -0.58, bobPhase: 3.0, flapPhase: 1.9 },
  { x: 1780, y: 214, depth: 0.09, vx: -0.44, bobPhase: 2.5, flapPhase: 2.7 },
];

// --- Reflets sur le fleuve : bandes horizontales qui ondulent sous le soleil.
export type Reflect = { cx: number; cy: number; rx: number; ry: number; op: number; phase: number };
export const RIVER_REFLECTS: Reflect[] = [
  { cx: 1290, cy: 512, rx: 108, ry: 4.5, op: 0.5, phase: 0.0 },
  { cx: 1276, cy: 538, rx: 132, ry: 5.5, op: 0.56, phase: 0.7 },
  { cx: 1300, cy: 566, rx: 96, ry: 5, op: 0.44, phase: 1.4 },
  { cx: 1268, cy: 596, rx: 150, ry: 6.5, op: 0.6, phase: 2.1 },
  { cx: 1296, cy: 630, rx: 118, ry: 6, op: 0.48, phase: 2.8 },
  { cx: 1262, cy: 666, rx: 168, ry: 7.5, op: 0.62, phase: 3.5 },
  { cx: 1302, cy: 704, rx: 130, ry: 7, op: 0.46, phase: 4.2 },
  { cx: 1274, cy: 744, rx: 186, ry: 8.5, op: 0.55, phase: 4.9 },
  { cx: 1292, cy: 788, rx: 142, ry: 8, op: 0.4, phase: 5.6 },
  { cx: 1268, cy: 832, rx: 200, ry: 9.5, op: 0.34, phase: 6.3 },
];

// --- Rides de l'eau (traits fins qui scintillent partout sur le fleuve).
export type Ripple = { x: number; y: number; w: number; phase: number; op: number };
export const RIPPLES: Ripple[] = (() => {
  const out: Ripple[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < 90; i++) {
    const t = rnd();
    // les rides sont plus larges et plus espacees quand on se rapproche
    const y = 486 + t * t * 386;
    out.push({
      x: rnd() * 2100 - 90,
      y,
      w: 16 + t * 74,
      phase: rnd() * 6.28,
      op: 0.06 + rnd() * 0.14,
    });
  }
  return out;
})();

// --- Etoiles du ciel de nuit : s'effacent quand le jour se leve.
export type Star = { x: number; y: number; r: number; phase: number };
export const STARS_PORT: Star[] = (() => {
  const out: Star[] = [];
  let seed = 31;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < 46; i++) {
    out.push({
      x: rnd() * 1920,
      y: 20 + rnd() * 330,
      r: 0.9 + rnd() * 1.5,
      phase: rnd() * 6.28,
    });
  }
  return out;
})();

// --- Braseros du quai : petits foyers ou les dockers se rechauffent avant l'aube.
export type Brazier = { x: number; y: number; depth: number; phase: number };
// BANDE AVANT : les braseros sont a l'ecart des caisses (jamais de marchandise
// au contact du feu) et a l'ecart des lampadaires.
export const BRAZIERS: Brazier[] = [
  { x: 880, y: 880, depth: 0.46, phase: 0 },
  { x: 1640, y: 880, depth: 0.54, phase: 2.4 },
];

export const SUN_CX = 1284;
export const SUN_BASE_CY = 720; // depart : bien sous l'horizon (invisible)
export const SUN_END_CY = 372; // arrivee : au-dessus de l'horizon
