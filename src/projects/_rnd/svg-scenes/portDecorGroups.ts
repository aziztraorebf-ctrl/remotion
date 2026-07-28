// ============================================================================
// PORT FLUVIAL OUEST-AFRICAIN — decor statique vu depuis le quai (1920x1080)
// ============================================================================
// MATIERE STATIQUE UNIQUEMENT. Aucune animation ici (aucun useCurrentFrame,
// aucun interpolate, aucun SMIL). L'equipe animera les groupes exportes.
//
// ARCHITECTURE :
// - PALETTE : source unique des couleurs. Les chaines SVG sont des template
//   literals qui referencent PALETTE — changer une valeur re-eclaire tout le
//   decor (jour/nuit) sans toucher aux formes.
// - Chaque plan de profondeur = une constante exportee (parallaxe).
// - Chaque element individuellement animable = une constante separee
//   (grues avec mat/fleche/cable distincts, chaque fenetre, chaque bateau...).
// - CALQUES : ordre d'empilement pret a consommer (du fond vers l'avant).
// - COORDS / LUMIERES / POINTS_AMARRAGE / ECHELLE_PERSONNAGE : donnees de pose.
//
// NOTES POUR L'EQUIPE ANIMATION (rien de tout ceci n'est code ici) :
// - NUAGES : derive lente. OISEAUX : traversee du ciel. BAC_LOIN : traversee
//   du fleuve. Bateaux : tangage leger (rotation 1-2 deg autour du centre).
// - GRUE_*_FLECHE pivote autour de son point "pivot" (voir COORDS.grues),
//   GRUE_*_CABLE se translate verticalement avec sa charge.
// - FENETRE_* / LAMPADAIRE_* / FEU d'antenne : passer les remplissages
//   BLANC_CASSE a une teinte chaude pour la nuit.
// - LINGE : leger balancement. PLAN_EAU : les traits d'eau peuvent glisser
//   horizontalement tres lentement.
// ============================================================================

export const PALETTE = {
  // Ciel / ville / eau : teintes greffees depuis le decor concurrent (choix Aziz
  // 2026-07-28) — ciel plus bleu en haut, ville en brume froide, eau franchement
  // bleue au lieu du vert-gris d'origine. Aucune geometrie touchee.
  CIEL_HAUT: "#8fb6c9",
  CIEL_BAS: "#dcd2b6",
  NUAGE: "#f2f2ea",
  VILLE_LOIN: "#8e9aa2",
  VILLE_PROCHE: "#77848d",
  EAU: "#6b8496",
  EAU_SOMBRE: "#3f5563",
  EAU_CLAIRE: "#a8bcc4",
  QUAI: "#aaa392",
  QUAI_CLAIR: "#b9b2a0",
  QUAI_JOINT: "#8c8577",
  QUAI_TACHE: "#6f6a5e",
  TOLE: "#b5a98d",
  TOLE_OMBRE: "#9b9077",
  ROUILLE: "#8a5b3f",
  ROUILLE_SOMBRE: "#6b4530",
  BOIS: "#8a6a4c",
  BOIS_SOMBRE: "#5e4730",
  BOIS_CLAIR: "#a98a64",
  TOIT: "#79838a",
  TOIT_CLAIR: "#98a0a5",
  METAL: "#757b80",
  METAL_SOMBRE: "#4d5357",
  PEINTURE_BLEUE: "#5f7d8a",
  PEINTURE_BLEUE_SOMBRE: "#48626d",
  PEINTURE_ROUGE: "#a85638",
  PEINTURE_VERTE: "#5f7d62",
  PEINTURE_JAUNE: "#b39b4f",
  BLANC_CASSE: "#e9e4d4",
  NOIR_DOUX: "#38362f",
  CORDE: "#c3b28f",
  SAC: "#b7a069",
  SAC_OMBRE: "#97824f",
  VEGETATION: "#6d7a4c",
  PALME: "#5f7a52",
  PALME_SOMBRE: "#49603f",
  TRONC: "#8b7350",
  PNEU: "#33322c",
} as const;

const P = PALETTE;

// ---------------------------------------------------------------------------
// Helpers de dessin (statiques : ils produisent des chaines une seule fois)
// ---------------------------------------------------------------------------

const vlines = (
  x0: number, x1: number, step: number, y0: number, y1: number,
  color: string, w: number, op: number,
): string => {
  let s = "";
  for (let x = x0; x <= x1; x += step) {
    s += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="${color}" stroke-width="${w}" opacity="${op}"/>`;
  }
  return s;
};

const hlines = (
  y0: number, y1: number, step: number, x0: number, x1: number,
  color: string, w: number, op: number,
): string => {
  let s = "";
  for (let y = y0; y <= y1; y += step) {
    s += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${color}" stroke-width="${w}" opacity="${op}"/>`;
  }
  return s;
};

// Poutre en treillis entre deux points (deux membrures + diagonales en zigzag).
const latticeBeam = (
  ax: number, ay: number, bx: number, by: number,
  width: number, n: number, color: string, w: number,
): string => {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy);
  const px = (-dy / len) * (width / 2);
  const py = (dx / len) * (width / 2);
  const a1x = ax + px, a1y = ay + py, a2x = ax - px, a2y = ay - py;
  const b1x = bx + px, b1y = by + py, b2x = bx - px, b2y = by - py;
  let s = `<line x1="${a1x.toFixed(1)}" y1="${a1y.toFixed(1)}" x2="${b1x.toFixed(1)}" y2="${b1y.toFixed(1)}" stroke="${color}" stroke-width="${w}"/>`;
  s += `<line x1="${a2x.toFixed(1)}" y1="${a2y.toFixed(1)}" x2="${b2x.toFixed(1)}" y2="${b2y.toFixed(1)}" stroke="${color}" stroke-width="${w}"/>`;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const side = i % 2 === 0 ? 1 : -1;
    pts.push([ax + dx * t + px * side, ay + dy * t + py * side]);
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
  }
  s += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w * 0.6}"/>`;
  return s;
};

// Corde amarree : quadratique avec ventre.
const rope = (
  x1: number, y1: number, x2: number, y2: number, sag: number,
  color: string, w: number,
): string => {
  const mx = (x1 + x2) / 2;
  const my = Math.max(y1, y2) + sag;
  return `<path d="M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
};

// Touffe d'herbe dans une fissure.
const grassTuft = (x: number, y: number, s: number): string => {
  let out = "";
  const angles = [-38, -18, 0, 16, 34];
  for (let i = 0; i < angles.length; i++) {
    const a = (angles[i] * Math.PI) / 180;
    const len = s * (0.7 + 0.3 * ((i * 37) % 10) / 10);
    const ex = x + Math.sin(a) * len;
    const ey = y - Math.cos(a) * len;
    const cx = x + Math.sin(a) * len * 0.4;
    const cy = y - Math.cos(a) * len * 0.55;
    out += `<path d="M ${x} ${y} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="${P.VEGETATION}" stroke-width="${Math.max(1.6, s * 0.12)}" stroke-linecap="round"/>`;
  }
  return out;
};

// Sac de grain pose (forme rebondie + couture).
const sack = (x: number, y: number, w: number, h: number, fill: string): string =>
  `<path d="M ${x} ${y + h} L ${x} ${y + h * 0.35} Q ${x} ${y} ${x + w * 0.18} ${y + h * 0.06} L ${x + w * 0.82} ${y + h * 0.06} Q ${x + w} ${y} ${x + w} ${y + h * 0.35} L ${x + w} ${y + h} Z" fill="${fill}" stroke="${P.SAC_OMBRE}" stroke-width="2"/>` +
  `<line x1="${x + w * 0.14}" y1="${y + h * 0.1}" x2="${x + w * 0.86}" y2="${y + h * 0.1}" stroke="${P.SAC_OMBRE}" stroke-width="2" stroke-dasharray="4 3"/>`;

// ---------------------------------------------------------------------------
// PLAN 1 — CIEL (zone colorable ; seul degrade tolere car c'est le ciel)
// ---------------------------------------------------------------------------

export const PLAN_CIEL = `
<defs>
  <linearGradient id="pd-ciel" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${P.CIEL_HAUT}"/>
    <stop offset="1" stop-color="${P.CIEL_BAS}"/>
  </linearGradient>
</defs>
<rect x="-120" y="-120" width="2160" height="700" fill="url(#pd-ciel)"/>
<rect x="-120" y="396" width="2160" height="52" fill="${P.NUAGE}" opacity="0.35"/>
`;

// Nuages plats, exportes a part (derive lente possible).
const cloud = (cx: number, cy: number, s: number): string =>
  `<g>` +
  `<ellipse cx="${cx}" cy="${cy}" rx="${110 * s}" ry="${22 * s}" fill="${P.NUAGE}" opacity="0.92"/>` +
  `<ellipse cx="${cx - 40 * s}" cy="${cy - 14 * s}" rx="${52 * s}" ry="${20 * s}" fill="${P.NUAGE}" opacity="0.92"/>` +
  `<ellipse cx="${cx + 34 * s}" cy="${cy - 18 * s}" rx="${64 * s}" ry="${24 * s}" fill="${P.NUAGE}" opacity="0.92"/>` +
  `<line x1="${cx - 96 * s}" y1="${cy + 16 * s}" x2="${cx + 92 * s}" y2="${cy + 16 * s}" stroke="${P.CIEL_HAUT}" stroke-width="${3 * s}" opacity="0.5"/>` +
  `</g>`;

export const NUAGES = `
<g id="NUAGE_1">${cloud(310, 150, 1.25)}</g>
<g id="NUAGE_2">${cloud(1120, 105, 0.95)}</g>
<g id="NUAGE_3">${cloud(1660, 225, 0.7)}</g>
<g id="NUAGE_4">${cloud(760, 265, 0.5)}</g>
`;

const gull = (x: number, y: number, s: number): string =>
  `<path d="M ${x} ${y} q ${9 * s} ${-7 * s} ${18 * s} 0 q ${9 * s} ${-7 * s} ${18 * s} 0" fill="none" stroke="${P.NOIR_DOUX}" stroke-width="${2.4 * s}" stroke-linecap="round" opacity="0.75"/>`;

export const OISEAUX = `
${gull(830, 178, 1)}
${gull(886, 210, 0.75)}
${gull(778, 148, 0.6)}
${gull(1310, 156, 0.85)}
${gull(1368, 186, 0.55)}
`;

// ---------------------------------------------------------------------------
// PLAN 2 — VILLE LOINTAINE sur l'horizon (y=445)
// ---------------------------------------------------------------------------

export const PLAN_VILLE_LOINTAINE = `
<rect x="-120" y="432" width="2160" height="14" fill="${P.VILLE_LOIN}" opacity="0.85"/>

<g id="VILLE_ARRIERE" opacity="0.75">
  <rect x="560" y="404" width="58" height="40" fill="${P.VILLE_LOIN}"/>
  <rect x="640" y="416" width="90" height="28" fill="${P.VILLE_LOIN}"/>
  <rect x="860" y="396" width="42" height="48" fill="${P.VILLE_LOIN}"/>
  <rect x="1010" y="410" width="110" height="34" fill="${P.VILLE_LOIN}"/>
  <rect x="1300" y="400" width="52" height="44" fill="${P.VILLE_LOIN}"/>
  <path d="M 620 404 Q 640 380 660 404 Z" fill="${P.VILLE_LOIN}"/>
  <path d="M 905 430 C 912 404 900 384 918 362 C 922 386 934 402 928 430 Z" fill="${P.VILLE_LOIN}"/>
</g>

<g id="VILLE_AVANT" fill="${P.VILLE_PROCHE}">
  <rect x="-120" y="424" width="380" height="20"/>
  <rect x="60" y="408" width="46" height="36"/>
  <rect x="180" y="414" width="70" height="30"/>
  <rect x="700" y="410" width="20" height="10"/>
  <path d="M 690 420 L 730 420 L 726 444 L 694 444 Z"/>
  <path d="M 697 410 Q 710 398 723 410 Z"/>
  <line x1="697" y1="420" x2="694" y2="444" stroke="${P.VILLE_PROCHE}" stroke-width="3"/>
  <line x1="723" y1="420" x2="726" y2="444" stroke="${P.VILLE_PROCHE}" stroke-width="3"/>
  <rect x="760" y="392" width="34" height="52"/>
  <rect x="800" y="412" width="56" height="32"/>
  <rect x="1130" y="388" width="30" height="56"/>
  <rect x="1166" y="404" width="48" height="40"/>
  <path d="M 1226 444 L 1226 372 Q 1233 360 1240 372 L 1240 444 Z"/>
  <rect x="1220" y="386" width="26" height="6"/>
  <path d="M 1252 444 Q 1276 414 1300 444 Z"/>
  <rect x="1310" y="418" width="76" height="26"/>
  <rect x="1420" y="408" width="40" height="36"/>
  <g id="GRUE_PORTUAIRE_LOIN">
    <rect x="1478" y="424" width="44" height="20"/>
    <line x1="1500" y1="444" x2="1500" y2="396" stroke="${P.VILLE_PROCHE}" stroke-width="4"/>
    <line x1="1476" y1="400" x2="1546" y2="396" stroke="${P.VILLE_PROCHE}" stroke-width="3"/>
    <line x1="1500" y1="396" x2="1540" y2="382" stroke="${P.VILLE_PROCHE}" stroke-width="2"/>
    <line x1="1536" y1="397" x2="1536" y2="420" stroke="${P.VILLE_PROCHE}" stroke-width="2"/>
  </g>
  <g id="PALMIERS_LOIN">
    <line x1="1600" y1="444" x2="1596" y2="416" stroke="${P.VILLE_PROCHE}" stroke-width="4"/>
    <circle cx="1596" cy="412" r="9"/>
    <line x1="1636" y1="444" x2="1640" y2="410" stroke="${P.VILLE_PROCHE}" stroke-width="4"/>
    <circle cx="1640" cy="406" r="11"/>
    <line x1="1676" y1="444" x2="1672" y2="420" stroke="${P.VILLE_PROCHE}" stroke-width="3"/>
    <circle cx="1672" cy="416" r="8"/>
  </g>
  <line x1="890" y1="444" x2="890" y2="352" stroke="${P.VILLE_PROCHE}" stroke-width="3"/>
  <line x1="880" y1="380" x2="900" y2="380" stroke="${P.VILLE_PROCHE}" stroke-width="2"/>
  <line x1="882" y1="400" x2="898" y2="400" stroke="${P.VILLE_PROCHE}" stroke-width="2"/>
</g>
<path d="M 905 366 C 900 350 912 340 906 322 C 918 336 912 352 920 364" fill="none" stroke="${P.VILLE_LOIN}" stroke-width="5" opacity="0.5" stroke-linecap="round"/>
<g id="FEU_ANTENNE"><circle cx="890" cy="350" r="3.4" fill="${P.PEINTURE_ROUGE}"/></g>
`;

// Petit bac (ferry) au loin — exporte a part pour pouvoir traverser le fleuve.
export const BAC_LOIN = `
<g id="BAC_LOIN">
  <path d="M 420 462 L 500 462 L 492 472 L 428 472 Z" fill="${P.VILLE_PROCHE}"/>
  <rect x="444" y="452" width="32" height="10" fill="${P.VILLE_PROCHE}"/>
  <line x1="452" y1="452" x2="452" y2="444" stroke="${P.VILLE_PROCHE}" stroke-width="2.5"/>
  <line x1="424" y1="475" x2="500" y2="475" stroke="${P.EAU_SOMBRE}" stroke-width="2" opacity="0.6"/>
</g>
`;

// ---------------------------------------------------------------------------
// PLAN 3 — EAU (fleuve large, y 436 -> 748)
// ---------------------------------------------------------------------------

const waterStreaks = (): string => {
  const rows: Array<[number, number, number]> = [
    [452, 1.4, 0.25], [462, 1.5, 0.28], [474, 1.6, 0.3], [488, 1.8, 0.3],
    [504, 2, 0.32], [522, 2.2, 0.32], [542, 2.4, 0.34], [566, 2.6, 0.34],
    [592, 2.8, 0.36], [620, 3, 0.36], [652, 3.4, 0.38], [686, 3.8, 0.38],
    [722, 4.2, 0.4],
  ];
  const segs = [
    [60, 320], [420, 700], [820, 1080], [1180, 1420], [1560, 1860],
    [200, 460], [640, 900], [1020, 1300], [1480, 1740], [40, 260],
    [520, 800], [960, 1240], [1380, 1680],
  ];
  let s = "";
  for (let i = 0; i < rows.length; i++) {
    const [y, w, op] = rows[i];
    const [x0, x1] = segs[i % segs.length];
    const shift = (i * 137) % 300 - 150;
    const color = i % 3 === 2 ? P.EAU_CLAIRE : P.EAU_SOMBRE;
    s += `<line x1="${x0 + shift}" y1="${y}" x2="${x1 + shift}" y2="${y}" stroke="${color}" stroke-width="${w}" opacity="${op}" stroke-linecap="round"/>`;
    const [x2, x3] = segs[(i + 5) % segs.length];
    s += `<line x1="${x2 - shift}" y1="${y + 4}" x2="${x3 - shift}" y2="${y + 4}" stroke="${i % 2 === 0 ? P.EAU_CLAIRE : P.EAU_SOMBRE}" stroke-width="${w * 0.7}" opacity="${op * 0.7}" stroke-linecap="round"/>`;
  }
  return s;
};

export const PLAN_EAU = `
<rect x="-120" y="436" width="2160" height="314" fill="${P.EAU}"/>
<g id="REFLET_VILLE" opacity="0.2">
  <path d="M 600 448 q 8 22 0 44 q -8 20 2 40 l 14 0 q 8 -22 0 -44 q -8 -20 2 -40 Z" fill="${P.VILLE_LOIN}"/>
  <path d="M 770 448 q -7 24 1 48 q 7 22 -2 44 l 16 0 q 7 -24 -1 -48 q -7 -22 2 -44 Z" fill="${P.VILLE_LOIN}"/>
  <path d="M 900 448 q 9 30 -1 60 q -8 26 2 52 l 13 0 q 9 -30 -1 -60 q -8 -26 2 -52 Z" fill="${P.VILLE_LOIN}"/>
  <path d="M 1140 448 q -8 20 0 40 q 8 20 -2 42 l 15 0 q 8 -20 0 -40 q -8 -20 2 -42 Z" fill="${P.VILLE_LOIN}"/>
  <path d="M 1240 448 q 6 26 -2 52 q -7 24 2 46 l 12 0 q 6 -26 -2 -52 q -7 -24 2 -46 Z" fill="${P.VILLE_LOIN}"/>
</g>
${waterStreaks()}
<path d="M 120 742 q 60 -8 120 0" fill="none" stroke="${P.EAU_CLAIRE}" stroke-width="3" opacity="0.4"/>
<path d="M 1520 738 q 70 -9 140 0" fill="none" stroke="${P.EAU_CLAIRE}" stroke-width="3" opacity="0.4"/>
<g id="BOIS_FLOTTANT">
  <line x1="1120" y1="700" x2="1178" y2="694" stroke="${P.BOIS_SOMBRE}" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
  <line x1="288" y1="676" x2="322" y2="672" stroke="${P.BOIS_SOMBRE}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
</g>
`;

export const BOUEE_1 = `
<g id="BOUEE_1">
  <path d="M 444 656 L 466 656 L 474 694 L 436 694 Z" fill="${P.PEINTURE_ROUGE}"/>
  <rect x="440" y="670" width="30" height="8" fill="${P.BLANC_CASSE}" opacity="0.85"/>
  <line x1="455" y1="656" x2="455" y2="642" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
  <circle cx="455" cy="640" r="3.2" fill="${P.METAL_SOMBRE}"/>
  <line x1="430" y1="700" x2="480" y2="700" stroke="${P.EAU_SOMBRE}" stroke-width="3" opacity="0.5"/>
</g>
`;

export const BOUEE_2 = `
<g id="BOUEE_2">
  <path d="M 1294 610 L 1308 610 L 1313 634 L 1289 634 Z" fill="${P.PEINTURE_ROUGE}"/>
  <rect x="1291" y="618" width="20" height="5" fill="${P.BLANC_CASSE}" opacity="0.85"/>
  <line x1="1286" y1="640" x2="1316" y2="640" stroke="${P.EAU_SOMBRE}" stroke-width="2" opacity="0.5"/>
</g>
`;

// ---------------------------------------------------------------------------
// EMBARCATIONS (chacune est un groupe independant, posee sur PLAN_EAU)
// ---------------------------------------------------------------------------

export const VOILIER_LOIN = `
<g id="VOILIER_LOIN" transform="translate(88 6)">
  <path d="M 735 532 L 825 532 L 810 546 L 750 546 Z" fill="${P.BOIS_SOMBRE}"/>
  <line x1="778" y1="532" x2="774" y2="468" stroke="${P.BOIS_SOMBRE}" stroke-width="3"/>
  <line x1="748" y1="488" x2="820" y2="468" stroke="${P.BOIS_SOMBRE}" stroke-width="2.5"/>
  <path d="M 752 490 L 816 471 L 798 528 Z" fill="${P.BLANC_CASSE}" opacity="0.95"/>
  <path d="M 770 486 L 796 526" fill="none" stroke="${P.TOLE_OMBRE}" stroke-width="1.5" opacity="0.5"/>
  <line x1="742" y1="552" x2="818" y2="552" stroke="${P.EAU_SOMBRE}" stroke-width="2.5" opacity="0.5"/>
</g>
`;

export const PIROGUE_LOIN = `
<g id="PIROGUE_LOIN" transform="translate(0 -14)">
  <path d="M 1392 566 Q 1400 556 1412 555 L 1560 555 Q 1578 552 1588 542 Q 1584 562 1566 570 L 1420 574 Q 1400 574 1392 566 Z" fill="${P.BOIS_SOMBRE}"/>
  <path d="M 1408 560 L 1566 558" stroke="${P.PEINTURE_ROUGE}" stroke-width="4" fill="none"/>
  <ellipse cx="1460" cy="556" rx="14" ry="6" fill="${P.SAC}"/>
  <ellipse cx="1492" cy="555" rx="12" ry="5" fill="${P.SAC_OMBRE}"/>
  <line x1="1400" y1="580" x2="1500" y2="581" stroke="${P.EAU_SOMBRE}" stroke-width="2.5" opacity="0.5"/>
</g>
`;

// Pirogue amarree le long du chalutier (dessinee APRES lui dans CALQUES).
export const PIROGUE_1 = `
<g id="PIROGUE_1">
  <path d="M 1052 716 Q 1066 700 1100 696 L 1210 692 Q 1244 688 1258 676 Q 1256 700 1230 712 Q 1180 726 1120 726 Q 1078 726 1052 716 Z" fill="${P.BOIS}" stroke="${P.BOIS_SOMBRE}" stroke-width="3"/>
  <path d="M 1066 712 Q 1150 724 1236 706" fill="none" stroke="${P.BOIS_SOMBRE}" stroke-width="2.2" opacity="0.7"/>
  <path d="M 1064 707 L 1248 684" stroke="${P.PEINTURE_ROUGE}" stroke-width="6" fill="none"/>
  <path d="M 1082 710 L 1094 700 L 1106 708 Z" fill="${P.BLANC_CASSE}" opacity="0.9"/>
  <path d="M 1114 707 L 1126 697 L 1138 705 Z" fill="${P.BLANC_CASSE}" opacity="0.9"/>
  <text x="1162" y="710" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="${P.BLANC_CASSE}" transform="rotate(-4 1162 710)">TERANGA</text>
  <ellipse cx="1104" cy="694" rx="17" ry="7" fill="${P.SAC}"/>
  <ellipse cx="1134" cy="691" rx="14" ry="6" fill="${P.SAC_OMBRE}"/>
  <line x1="1216" y1="684" x2="1244" y2="720" stroke="${P.BOIS_SOMBRE}" stroke-width="3.5" stroke-linecap="round"/>
  <ellipse cx="1246" cy="723" rx="4.5" ry="7" fill="${P.BOIS_SOMBRE}"/>
</g>
`;

export const CHALUTIER = `
<g id="CHALUTIER">
  <path d="M 886 632 Q 940 620 1040 622 L 1256 630 Q 1268 660 1262 700 L 1258 740 L 894 740 Q 884 690 886 632 Z" fill="${P.PEINTURE_BLEUE}" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="3"/>
  <path d="M 890 648 L 1262 652" stroke="${P.BLANC_CASSE}" stroke-width="5" fill="none" opacity="0.9"/>
  <path d="M 888 634 Q 1000 622 1254 632 L 1254 646 Q 1010 636 890 646 Z" fill="${P.BOIS_CLAIR}"/>
  <path d="M 918 656 q 4 26 -2 44" fill="none" stroke="${P.ROUILLE}" stroke-width="5" opacity="0.7"/>
  <path d="M 1052 660 q 3 30 -2 48" fill="none" stroke="${P.ROUILLE}" stroke-width="4" opacity="0.6"/>
  <path d="M 1196 662 q 4 24 0 46" fill="none" stroke="${P.ROUILLE_SOMBRE}" stroke-width="5" opacity="0.65"/>
  <rect x="888" y="730" width="372" height="10" fill="${P.NOIR_DOUX}" opacity="0.85"/>
  <text x="928" y="700" font-family="Arial, sans-serif" font-size="17" font-weight="bold" letter-spacing="2" fill="${P.BLANC_CASSE}">SN 742 DK</text>

  <g id="CHALUTIER_TIMONERIE">
    <rect x="1118" y="548" width="118" height="92" fill="${P.BLANC_CASSE}" stroke="${P.TOLE_OMBRE}" stroke-width="3"/>
    <rect x="1112" y="540" width="130" height="12" fill="${P.TOIT}"/>
    <rect x="1130" y="562" width="28" height="24" fill="${P.NOIR_DOUX}"/>
    <rect x="1166" y="562" width="28" height="24" fill="${P.NOIR_DOUX}"/>
    <rect x="1204" y="562" width="20" height="24" fill="${P.NOIR_DOUX}"/>
    <rect x="1206" y="596" width="24" height="44" fill="${P.BOIS}" stroke="${P.BOIS_SOMBRE}" stroke-width="2"/>
    <line x1="1124" y1="596" x2="1124" y2="640" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
    <line x1="1131" y1="596" x2="1131" y2="640" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
    <line x1="1120" y1="604" x2="1135" y2="604" stroke="${P.METAL_SOMBRE}" stroke-width="2"/>
    <line x1="1120" y1="616" x2="1135" y2="616" stroke="${P.METAL_SOMBRE}" stroke-width="2"/>
    <line x1="1120" y1="628" x2="1135" y2="628" stroke="${P.METAL_SOMBRE}" stroke-width="2"/>
    <line x1="1240" y1="548" x2="1248" y2="500" stroke="${P.METAL_SOMBRE}" stroke-width="2"/>
    <rect x="1150" y="518" width="14" height="22" fill="${P.ROUILLE_SOMBRE}"/>
    <path d="M 1150 518 L 1164 518 L 1160 510 L 1154 510 Z" fill="${P.NOIR_DOUX}"/>
  </g>

  <g id="CHALUTIER_MAT">
    <line x1="948" y1="632" x2="942" y2="498" stroke="${P.BOIS_SOMBRE}" stroke-width="6"/>
    <line x1="920" y1="522" x2="966" y2="520" stroke="${P.BOIS_SOMBRE}" stroke-width="4"/>
    <line x1="944" y1="540" x2="1046" y2="566" stroke="${P.BOIS_SOMBRE}" stroke-width="4"/>
    <line x1="943" y1="510" x2="896" y2="636" stroke="${P.CORDE}" stroke-width="1.8"/>
    <line x1="944" y1="514" x2="1060" y2="622" stroke="${P.CORDE}" stroke-width="1.8"/>
    <line x1="1046" y1="566" x2="1042" y2="620" stroke="${P.CORDE}" stroke-width="1.8"/>
    <path d="M 942 498 L 942 486 L 962 492 L 942 496 Z" fill="${P.PEINTURE_ROUGE}"/>
  </g>

  <g id="CHALUTIER_PONT">
    <path d="M 964 616 q 22 -14 52 -6 q 26 6 34 14 q -30 8 -58 4 q -22 -2 -28 -12 Z" fill="${P.CORDE}" stroke="${P.SAC_OMBRE}" stroke-width="2"/>
    <circle cx="986" cy="612" r="4" fill="${P.PEINTURE_ROUGE}"/>
    <circle cx="1008" cy="616" r="4" fill="${P.PEINTURE_ROUGE}"/>
    <circle cx="1030" cy="614" r="4" fill="${P.PEINTURE_ROUGE}"/>
    <rect x="1070" y="606" width="22" height="18" fill="${P.METAL}" stroke="${P.METAL_SOMBRE}" stroke-width="2"/>
  </g>

  <g id="CHALUTIER_DEFENSES">
    <line x1="964" y1="648" x2="966" y2="664" stroke="${P.CORDE}" stroke-width="2.5"/>
    <circle cx="966" cy="674" r="12" fill="${P.PNEU}"/>
    <circle cx="966" cy="674" r="4.5" fill="${P.PEINTURE_BLEUE}"/>
    <line x1="1108" y1="650" x2="1110" y2="668" stroke="${P.CORDE}" stroke-width="2.5"/>
    <circle cx="1110" cy="678" r="12" fill="${P.PNEU}"/>
    <circle cx="1110" cy="678" r="4.5" fill="${P.PEINTURE_BLEUE}"/>
  </g>
</g>
`;

// ---------------------------------------------------------------------------
// PLAN 4 — QUAI ARRIERE : ponton bois, bord du quai, bittes, amarres
// ---------------------------------------------------------------------------

// Vestige d'un ancien appontement : pilotis de bois dans l'eau, planche
// restante, mouette posee. Place dans la trouee d'eau visible.
export const PONTON = `
<g id="PONTON">
  ${[
    [746, 662], [782, 672], [818, 668], [854, 678],
  ].map(([x, yTop]) => `<line x1="${x}" y1="${yTop}" x2="${x}" y2="736" stroke="${P.BOIS_SOMBRE}" stroke-width="8"/><ellipse cx="${x}" cy="${yTop}" rx="4.5" ry="2.5" fill="${P.BOIS_CLAIR}"/><line x1="${x - 8}" y1="738" x2="${x + 8}" y2="738" stroke="${P.EAU_SOMBRE}" stroke-width="3" opacity="0.6"/>`).join("")}
  <line x1="744" y1="678" x2="822" y2="672" stroke="${P.BOIS_CLAIR}" stroke-width="6"/>
  <line x1="800" y1="674" x2="836" y2="700" stroke="${P.BOIS}" stroke-width="4" opacity="0.8"/>
  <g id="PONTON_MOUETTE">
    <ellipse cx="748" cy="652" rx="8" ry="5.5" fill="${P.BLANC_CASSE}"/>
    <circle cx="755" cy="646" r="3.4" fill="${P.BLANC_CASSE}"/>
    <path d="M 758 646 L 764 648 L 758 649 Z" fill="${P.PEINTURE_JAUNE}"/>
    <line x1="740" y1="652" x2="734" y2="648" stroke="${P.TOLE_OMBRE}" stroke-width="2"/>
  </g>
</g>
`;

export const AMARRE_PIROGUE = rope(1038, 758, 1068, 702, 16, P.CORDE, 3);

export const QUAI_BORD = `
<rect x="-120" y="733" width="2160" height="40" fill="${P.QUAI_CLAIR}"/>
<line x1="-120" y1="736" x2="2040" y2="736" stroke="${P.BLANC_CASSE}" stroke-width="2.5" opacity="0.5"/>
<line x1="-120" y1="770" x2="2040" y2="770" stroke="${P.QUAI_JOINT}" stroke-width="3" opacity="0.8"/>
${[140, 320, 500, 680, 860, 1040, 1220, 1400, 1580, 1760, 1920].map((x) => `<line x1="${x}" y1="${735}" x2="${x}" y2="${771}" stroke="${P.QUAI_JOINT}" stroke-width="2" opacity="0.55"/>`).join("")}
${[0, 230, 470, 705, 940, 1180, 1420, 1660, 1880].map((x) => `<rect x="${x}" y="742" width="120" height="8" fill="${P.PEINTURE_JAUNE}" opacity="0.55"/>`).join("")}
<path d="M -120 734 L 2040 734" stroke="${P.VEGETATION}" stroke-width="3" opacity="0.35"/>
<g id="TACHES_BORD">
  <ellipse cx="600" cy="756" rx="40" ry="6" fill="${P.QUAI_TACHE}" opacity="0.3"/>
  <ellipse cx="1330" cy="752" rx="52" ry="7" fill="${P.QUAI_TACHE}" opacity="0.25"/>
</g>
<g id="PNEU_BORD_1">
  <ellipse cx="700" cy="742" rx="26" ry="9" fill="${P.PNEU}"/>
  <ellipse cx="700" cy="741" rx="10" ry="3.4" fill="${P.QUAI_CLAIR}"/>
  <path d="M 688 740 Q 700 726 712 740" fill="none" stroke="${P.CORDE}" stroke-width="2.5"/>
</g>
<g id="PNEU_BORD_2">
  <ellipse cx="1712" cy="740" rx="24" ry="8" fill="${P.PNEU}"/>
  <ellipse cx="1712" cy="739" rx="9" ry="3" fill="${P.QUAI_CLAIR}"/>
</g>
`;

const bollard = (x: number, id: string): string => `
<g id="${id}">
  <ellipse cx="${x}" cy="${x % 2 === 0 ? 776 : 777}" rx="20" ry="6" fill="${P.QUAI_TACHE}" opacity="0.5"/>
  <path d="M ${x - 11} 776 L ${x - 9} 752 Q ${x - 12} 742 ${x} 742 Q ${x + 12} 742 ${x + 9} 752 L ${x + 11} 776 Z" fill="${P.METAL_SOMBRE}"/>
  <ellipse cx="${x}" cy="743" rx="12" ry="4.5" fill="${P.METAL}"/>
  <path d="M ${x - 10} 764 L ${x + 10} 762" stroke="${P.CORDE}" stroke-width="4"/>
  <path d="M ${x - 10} 758 L ${x + 10} 756" stroke="${P.CORDE}" stroke-width="4"/>
</g>
`;

export const BITTE_1 = bollard(960, "BITTE_1");
export const BITTE_2 = bollard(1035, "BITTE_2");
export const BITTE_3 = bollard(1155, "BITTE_3");

export const AMARRE_CHALUTIER_AVANT = rope(1032, 756, 930, 662, 34, P.CORDE, 3.5);
export const AMARRE_CHALUTIER_ARRIERE = rope(1152, 756, 1240, 666, 30, P.CORDE, 3.5);

// ---------------------------------------------------------------------------
// PLAN 5 — SOL DU QUAI (surface sous les batiments et sous les personnages)
// ---------------------------------------------------------------------------

export const PLAN_QUAI_SOL = `
<rect x="-120" y="768" width="2160" height="332" fill="${P.QUAI}"/>
${[802, 846, 902, 968, 1044].map((y, i) => `<line x1="-120" y1="${y}" x2="2040" y2="${y}" stroke="${P.QUAI_JOINT}" stroke-width="${2 + i * 0.4}" opacity="0.55"/>`).join("")}
${[[200, 86], [500, 431], [800, 776], [1250, 1293], [1550, 1638], [1850, 1983]].map(([xt, xb]) => `<line x1="${xt}" y1="770" x2="${xb}" y2="1080" stroke="${P.QUAI_JOINT}" stroke-width="2" opacity="0.4"/>`).join("")}
<g id="TACHES_SOL">
  <ellipse cx="420" cy="880" rx="90" ry="16" fill="${P.QUAI_TACHE}" opacity="0.18"/>
  <ellipse cx="1080" cy="952" rx="110" ry="20" fill="${P.NOIR_DOUX}" opacity="0.15"/>
  <ellipse cx="1560" cy="878" rx="70" ry="13" fill="${P.QUAI_TACHE}" opacity="0.16"/>
  <ellipse cx="760" cy="1020" rx="120" ry="22" fill="${P.QUAI_TACHE}" opacity="0.14"/>
</g>
<g id="FISSURES">
  <path d="M 618 792 L 654 828 L 642 866" fill="none" stroke="${P.QUAI_JOINT}" stroke-width="2.2" opacity="0.7"/>
  <path d="M 1494 996 L 1526 1032 L 1512 1062" fill="none" stroke="${P.QUAI_JOINT}" stroke-width="2.4" opacity="0.7"/>
  <path d="M 260 806 L 288 830" fill="none" stroke="${P.QUAI_JOINT}" stroke-width="2" opacity="0.6"/>
</g>
${grassTuft(654, 868, 14)}
${grassTuft(288, 832, 11)}
${grassTuft(1512, 1064, 16)}
<g id="RAILS_GRUE">
  <line x1="-120" y1="800" x2="2040" y2="800" stroke="${P.METAL_SOMBRE}" stroke-width="3.5" opacity="0.6"/>
  <line x1="-120" y1="821" x2="2040" y2="821" stroke="${P.METAL_SOMBRE}" stroke-width="3.5" opacity="0.5"/>
</g>
<g id="GRILLE_EGOUT">
  <rect x="820" y="900" width="64" height="18" rx="3" fill="${P.METAL_SOMBRE}"/>
  ${[830, 842, 854, 866].map((x) => `<line x1="${x}" y1="903" x2="${x}" y2="915" stroke="${P.QUAI}" stroke-width="2.5"/>`).join("")}
</g>
<path d="M 336 998 L 560 998 L 560 1020 L 336 1020 Z" fill="none" stroke="${P.QUAI_JOINT}" stroke-width="4" opacity="0.24"/>
<g id="OMBRES_BATIMENTS" opacity="0.12" fill="${P.NOIR_DOUX}">
  <rect x="-40" y="810" width="500" height="22" rx="10"/>
  <rect x="460" y="812" width="200" height="18" rx="9"/>
  <rect x="1160" y="812" width="400" height="20" rx="10"/>
  <rect x="1550" y="812" width="420" height="22" rx="10"/>
</g>
`;

// ---------------------------------------------------------------------------
// BATIMENTS — HANGAR A (gauche, tole ondulee, avec caractere)
// ---------------------------------------------------------------------------

export const HANGAR_A = `
<g id="HANGAR_A">
  <rect x="-30" y="430" width="470" height="382" fill="${P.TOLE}"/>
  ${vlines(-16, 434, 22, 436, 806, P.TOLE_OMBRE, 2, 0.45)}
  <path d="M -30 432 L 212 352 L 440 432 Z" fill="${P.TOLE_OMBRE}"/>
  ${[100, 140, 180, 220, 260, 300, 340].map((x) => `<line x1="${x}" y1="${432 - Math.round((1 - Math.abs(x - 212) / 242) * 66)}" x2="${x}" y2="430" stroke="${P.TOLE}" stroke-width="2" opacity="0.4"/>`).join("")}
  <g id="HANGAR_A_VENTILATION">
    <rect x="194" y="392" width="38" height="26" fill="${P.NOIR_DOUX}" opacity="0.8"/>
    <line x1="196" y1="399" x2="230" y2="399" stroke="${P.TOLE_OMBRE}" stroke-width="2.4"/>
    <line x1="196" y1="406" x2="230" y2="406" stroke="${P.TOLE_OMBRE}" stroke-width="2.4"/>
    <line x1="196" y1="413" x2="230" y2="413" stroke="${P.TOLE_OMBRE}" stroke-width="2.4"/>
  </g>
  <path d="M -40 434 L 212 348 L 452 434 L 446 448 L 212 364 L -34 448 Z" fill="${P.TOIT}"/>
  <path d="M -30 430 L 212 352 L 440 430 L 440 442 L 212 366 L -30 442 Z" fill="${P.TOIT_CLAIR}" opacity="0.5"/>
  <path d="M 60 480 q 30 -14 60 2 q 20 12 8 30 q -30 12 -58 -4 q -18 -12 -10 -28 Z" fill="${P.ROUILLE}" opacity="0.55"/>
  <path d="M 330 700 q 26 -10 50 4 q 16 10 6 26 q -26 10 -48 -4 q -14 -10 -8 -26 Z" fill="${P.ROUILLE}" opacity="0.5"/>
  <path d="M 6 640 q 20 -8 38 3 q 12 8 5 20 q -20 8 -36 -3 q -11 -8 -7 -20 Z" fill="${P.ROUILLE_SOMBRE}" opacity="0.45"/>
  ${[36, 92, 148, 258, 314, 402].map((x) => `<path d="M ${x} 452 q 3 22 -1 40" fill="none" stroke="${P.ROUILLE}" stroke-width="3" opacity="0.4"/>`).join("")}
  <g id="HANGAR_A_RUSTINE" transform="rotate(-2 85 640)">
    <rect x="40" y="600" width="90" height="82" fill="${P.TOIT_CLAIR}"/>
    ${vlines(50, 122, 18, 604, 678, P.TOIT, 2, 0.5)}
    <circle cx="46" cy="606" r="2.5" fill="${P.METAL_SOMBRE}"/>
    <circle cx="124" cy="606" r="2.5" fill="${P.METAL_SOMBRE}"/>
    <circle cx="46" cy="676" r="2.5" fill="${P.METAL_SOMBRE}"/>
    <circle cx="124" cy="676" r="2.5" fill="${P.METAL_SOMBRE}"/>
  </g>
  <g id="HANGAR_A_ANTENNE">
    <line x1="246" y1="352" x2="246" y2="296" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
    <line x1="232" y1="312" x2="260" y2="312" stroke="${P.METAL_SOMBRE}" stroke-width="2"/>
    <line x1="236" y1="324" x2="256" y2="324" stroke="${P.METAL_SOMBRE}" stroke-width="2"/>
    <line x1="246" y1="296" x2="286" y2="352" stroke="${P.METAL_SOMBRE}" stroke-width="1.2" opacity="0.7"/>
  </g>
  <g id="HANGAR_A_AUVENT">
    <path d="M 342 660 L 446 656 L 452 672 L 348 678 Z" fill="${P.TOIT}"/>
    <line x1="352" y1="676" x2="358" y2="742" stroke="${P.BOIS_SOMBRE}" stroke-width="4"/>
    <line x1="440" y1="670" x2="444" y2="742" stroke="${P.BOIS_SOMBRE}" stroke-width="4"/>
    <rect x="366" y="678" width="62" height="130" fill="${P.BOIS}" stroke="${P.BOIS_SOMBRE}" stroke-width="2.5"/>
    ${hlines(694, 794, 20, 368, 426, P.BOIS_SOMBRE, 1.6, 0.6)}
    <circle cx="418" cy="746" r="3" fill="${P.BOIS_SOMBRE}"/>
  </g>
  <rect x="-30" y="796" width="470" height="16" fill="${P.QUAI_TACHE}" opacity="0.45"/>
  <g id="BIDONS_HANGAR_A">
    <rect x="14" y="738" width="40" height="70" rx="4" fill="${P.PEINTURE_BLEUE}" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="2.5"/>
    <ellipse cx="34" cy="739" rx="20" ry="6" fill="${P.PEINTURE_BLEUE_SOMBRE}"/>
    <line x1="16" y1="760" x2="52" y2="760" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="2.5"/>
    <line x1="16" y1="784" x2="52" y2="784" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="2.5"/>
    <rect x="58" y="748" width="36" height="62" rx="4" fill="${P.ROUILLE}" stroke="${P.ROUILLE_SOMBRE}" stroke-width="2.5"/>
    <ellipse cx="76" cy="749" rx="18" ry="5" fill="${P.ROUILLE_SOMBRE}"/>
    <line x1="60" y1="768" x2="94" y2="768" stroke="${P.ROUILLE_SOMBRE}" stroke-width="2"/>
    <line x1="60" y1="790" x2="94" y2="790" stroke="${P.ROUILLE_SOMBRE}" stroke-width="2"/>
  </g>
  <g id="PALETTE_HANGAR_A" transform="rotate(8 130 780)">
    <rect x="104" y="742" width="14" height="66" fill="${P.BOIS_CLAIR}" stroke="${P.BOIS_SOMBRE}" stroke-width="2"/>
    <rect x="122" y="744" width="14" height="64" fill="${P.BOIS_CLAIR}" stroke="${P.BOIS_SOMBRE}" stroke-width="2"/>
    <rect x="140" y="746" width="14" height="62" fill="${P.BOIS_CLAIR}" stroke="${P.BOIS_SOMBRE}" stroke-width="2"/>
  </g>
</g>
`;

export const PORTE_HANGAR_A = `
<g id="PORTE_HANGAR_A">
  <rect x="90" y="544" width="266" height="12" fill="${P.METAL}" stroke="${P.METAL_SOMBRE}" stroke-width="2"/>
  <rect x="304" y="556" width="44" height="250" fill="${P.NOIR_DOUX}"/>
  <rect x="112" y="556" width="192" height="250" fill="${P.PEINTURE_BLEUE}" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="3"/>
  <line x1="112" y1="556" x2="304" y2="806" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="4"/>
  <line x1="304" y1="556" x2="112" y2="806" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="4"/>
  <rect x="112" y="672" width="192" height="8" fill="${P.PEINTURE_BLEUE_SOMBRE}" opacity="0.7"/>
  <circle cx="140" cy="562" r="5" fill="${P.METAL_SOMBRE}"/>
  <circle cx="280" cy="562" r="5" fill="${P.METAL_SOMBRE}"/>
  <path d="M 130 780 q 8 -14 20 -4 q 8 8 -2 16 q -12 4 -18 -12 Z" fill="${P.ROUILLE}" opacity="0.6"/>
</g>
`;

const smallWindow = (x: number, y: number, id: string): string => `
<g id="${id}">
  <rect x="${x - 4}" y="${y - 4}" width="62" height="74" fill="${P.BOIS_SOMBRE}"/>
  <rect x="${x}" y="${y}" width="54" height="66" fill="${P.BLANC_CASSE}" opacity="0.92"/>
  <line x1="${x + 27}" y1="${y}" x2="${x + 27}" y2="${y + 66}" stroke="${P.BOIS_SOMBRE}" stroke-width="3"/>
  <line x1="${x}" y1="${y + 33}" x2="${x + 54}" y2="${y + 33}" stroke="${P.BOIS_SOMBRE}" stroke-width="3"/>
  <line x1="${x - 6}" y1="${y + 74}" x2="${x + 60}" y2="${y + 74}" stroke="${P.QUAI_TACHE}" stroke-width="4" opacity="0.5"/>
</g>
`;

export const FENETRE_HANGAR_A_1 = smallWindow(30, 470, "FENETRE_HANGAR_A_1");
export const FENETRE_HANGAR_A_2 = smallWindow(372, 470, "FENETRE_HANGAR_A_2");

export const ENSEIGNE_HANGAR_A = `
<g id="ENSEIGNE_HANGAR_A" transform="rotate(-1.5 213 492)">
  <rect x="126" y="468" width="174" height="48" fill="${P.PEINTURE_ROUGE}" stroke="${P.ROUILLE_SOMBRE}" stroke-width="3"/>
  <rect x="134" y="476" width="158" height="32" fill="none" stroke="${P.BLANC_CASSE}" stroke-width="2" opacity="0.28"/>
  <path d="M 168 470 q 10 22 -4 46" fill="none" stroke="${P.ROUILLE_SOMBRE}" stroke-width="3" opacity="0.35"/>
  <path d="M 258 472 q -8 20 3 42" fill="none" stroke="${P.ROUILLE_SOMBRE}" stroke-width="2.5" opacity="0.3"/>
  <line x1="150" y1="468" x2="150" y2="456" stroke="${P.BOIS_SOMBRE}" stroke-width="3"/>
  <line x1="276" y1="468" x2="276" y2="456" stroke="${P.BOIS_SOMBRE}" stroke-width="3"/>
  <path d="M 132 512 q 4 8 0 14" fill="none" stroke="${P.ROUILLE_SOMBRE}" stroke-width="2.5" opacity="0.6"/>
</g>
`;

export const LINGE = `
<g id="LINGE">
  <path d="M 436 486 Q 512 528 588 566" fill="none" stroke="${P.CORDE}" stroke-width="2.2"/>
  <path d="M 470 505 L 494 518 L 490 552 Q 478 558 468 546 Z" fill="${P.PEINTURE_BLEUE}" opacity="0.95"/>
  <path d="M 512 528 L 534 540 L 532 570 Q 520 576 510 566 Z" fill="${P.BLANC_CASSE}"/>
  <path d="M 552 548 L 570 558 L 567 582 Q 558 587 550 579 Z" fill="${P.PEINTURE_ROUGE}" opacity="0.9"/>
</g>
`;

// ---------------------------------------------------------------------------
// KIOSQUE — buvette en bois avec comptoir et enseigne peinte a la main
// ---------------------------------------------------------------------------

export const KIOSQUE = `
<g id="KIOSQUE">
  <rect x="470" y="600" width="160" height="212" fill="${P.BOIS}" stroke="${P.BOIS_SOMBRE}" stroke-width="2.5"/>
  ${hlines(622, 802, 22, 472, 628, P.BOIS_SOMBRE, 1.6, 0.5)}
  <g id="KIOSQUE_COMPTOIR">
    <rect x="494" y="642" width="106" height="70" fill="${P.NOIR_DOUX}"/>
    <path d="M 494 642 L 600 642 L 612 606 L 506 606 Z" fill="${P.BOIS_CLAIR}" stroke="${P.BOIS_SOMBRE}" stroke-width="2"/>
    <line x1="500" y1="640" x2="510 " y2="608" stroke="${P.BOIS_SOMBRE}" stroke-width="2"/>
    <line x1="594" y1="640" x2="606" y2="608" stroke="${P.BOIS_SOMBRE}" stroke-width="2"/>
    <rect x="490" y="712" width="114" height="10" fill="${P.BOIS_CLAIR}" stroke="${P.BOIS_SOMBRE}" stroke-width="2"/>
    <rect x="516" y="694" width="14" height="18" fill="${P.PEINTURE_VERTE}"/>
    <rect x="536" y="690" width="12" height="22" fill="${P.PEINTURE_ROUGE}"/>
    <rect x="554" y="694" width="14" height="18" fill="${P.PEINTURE_BLEUE}"/>
  </g>
  <rect x="606" y="656" width="30" height="156" fill="${P.BOIS_SOMBRE}"/>
  <circle cx="612" cy="736" r="3" fill="${P.CORDE}"/>
  <path d="M 452 612 L 655 586 L 657 608 L 454 634 Z" fill="${P.ROUILLE}" stroke="${P.ROUILLE_SOMBRE}" stroke-width="2.5"/>
  ${[470, 500, 530, 560, 590, 620].map((x) => `<line x1="${x}" y1="${609 - (x - 470) * 0.128}" x2="${x + 2}" y2="${630 - (x - 470) * 0.128}" stroke="${P.ROUILLE_SOMBRE}" stroke-width="2" opacity="0.55"/>`).join("")}
  <g id="ENSEIGNE_KIOSQUE" transform="rotate(2 550 566)">
    <rect x="478" y="548" width="144" height="38" fill="${P.PEINTURE_VERTE}" stroke="${P.BOIS_SOMBRE}" stroke-width="3"/>
    <rect x="486" y="556" width="128" height="22" fill="none" stroke="${P.BLANC_CASSE}" stroke-width="1.6" opacity="0.3"/>
    <path d="M 520 550 q 6 18 -3 36" fill="none" stroke="${P.BOIS_SOMBRE}" stroke-width="2" opacity="0.3"/>
  </g>
  <g id="KIOSQUE_CAISSES">
    <rect x="640" y="762" width="52" height="46" fill="${P.BOIS_CLAIR}" stroke="${P.BOIS_SOMBRE}" stroke-width="2"/>
    <line x1="640" y1="778" x2="692" y2="778" stroke="${P.BOIS_SOMBRE}" stroke-width="1.6"/>
    <line x1="666" y1="762" x2="666" y2="808" stroke="${P.BOIS_SOMBRE}" stroke-width="1.6"/>
    <rect x="646" y="726" width="44" height="34" fill="${P.PEINTURE_JAUNE}" stroke="${P.SAC_OMBRE}" stroke-width="2"/>
    <circle cx="658" cy="740" r="4" fill="${P.PEINTURE_ROUGE}"/>
    <circle cx="672" cy="736" r="4" fill="${P.PEINTURE_ROUGE}"/>
    <circle cx="680" cy="744" r="4" fill="${P.PEINTURE_ROUGE}"/>
  </g>
</g>
`;

export const PALMIER_1 = `
<g id="PALMIER_1">
  <path d="M 706 814 C 700 700 692 560 678 432 L 694 428 C 710 556 716 700 722 814 Z" fill="${P.TRONC}" stroke="${P.BOIS_SOMBRE}" stroke-width="2"/>
  ${[770, 726, 682, 638, 594, 550, 506, 462].map((y, i) => `<path d="M ${702 - i * 1.6} ${y} q ${8} ${-5} ${17} 0" fill="none" stroke="${P.BOIS_SOMBRE}" stroke-width="1.8" opacity="0.55"/>`).join("")}
  <g id="PALMIER_1_COURONNE">
    ${[-84, -56, -26, 4, 34, 64, 96].map((a) => `<path d="M 0 0 Q 62 -34 132 -12 Q 66 -16 6 10 Z" fill="${P.PALME}" transform="translate(686 430) rotate(${a})"/>`).join("")}
    ${[-70, -12, 48].map((a) => `<path d="M 0 0 Q 56 -30 118 -10 Q 60 -14 5 9 Z" fill="${P.PALME_SOMBRE}" transform="translate(686 430) rotate(${a})"/>`).join("")}
    <circle cx="680" cy="446" r="9" fill="${P.ROUILLE}"/>
    <circle cx="698" cy="452" r="8" fill="${P.ROUILLE_SOMBRE}"/>
  </g>
</g>
`;

// ---------------------------------------------------------------------------
// GRUE 2 — grue a portique (mi-plan gauche), fleche repliee au repos
// ---------------------------------------------------------------------------

export const GRUE_2_MAT = `
<g id="GRUE_2_MAT">
  <line x1="722" y1="815" x2="748" y2="654" stroke="${P.METAL_SOMBRE}" stroke-width="8"/>
  <line x1="775" y1="815" x2="755" y2="654" stroke="${P.METAL_SOMBRE}" stroke-width="8"/>
  <line x1="877" y1="815" x2="851" y2="654" stroke="${P.METAL_SOMBRE}" stroke-width="8"/>
  <line x1="824" y1="815" x2="844" y2="654" stroke="${P.METAL_SOMBRE}" stroke-width="8"/>
  <line x1="728" y1="780" x2="772" y2="700" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
  <line x1="770" y1="780" x2="732" y2="700" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
  <line x1="830" y1="780" x2="872" y2="700" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
  <line x1="872" y1="780" x2="834" y2="700" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
  <rect x="708" y="640" width="186" height="16" fill="${P.METAL}" stroke="${P.METAL_SOMBRE}" stroke-width="2.5"/>
  <g id="GRUE_2_BOGIES">
    <rect x="712" y="798" width="74" height="11" fill="${P.METAL_SOMBRE}"/>
    <circle cx="728" cy="813" r="8" fill="${P.NOIR_DOUX}"/>
    <circle cx="764" cy="813" r="8" fill="${P.NOIR_DOUX}"/>
    <rect x="814" y="798" width="74" height="11" fill="${P.METAL_SOMBRE}"/>
    <circle cx="830" cy="813" r="8" fill="${P.NOIR_DOUX}"/>
    <circle cx="866" cy="813" r="8" fill="${P.NOIR_DOUX}"/>
  </g>
  ${latticeBeam(799, 640, 799, 340, 34, 10, P.METAL_SOMBRE, 4.5)}
  <g id="GRUE_2_CABINE">
    <rect x="766" y="300" width="66" height="42" fill="${P.PEINTURE_BLEUE}" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="3"/>
    <rect x="774" y="308" width="26" height="18" fill="${P.BLANC_CASSE}"/>
    <path d="M 766 300 L 832 300 L 826 290 L 772 290 Z" fill="${P.METAL}"/>
  </g>
  <ellipse cx="800" cy="818" rx="96" ry="8" fill="${P.NOIR_DOUX}" opacity="0.12"/>
</g>
`;

export const GRUE_2_FLECHE = `
<g id="GRUE_2_FLECHE">
  ${latticeBeam(792, 322, 592, 218, 22, 9, P.METAL_SOMBRE, 4)}
  <line x1="800" y1="292" x2="618" y2="212" stroke="${P.METAL_SOMBRE}" stroke-width="2" opacity="0.8"/>
  <circle cx="592" cy="218" r="7" fill="${P.METAL}" stroke="${P.METAL_SOMBRE}" stroke-width="2.5"/>
</g>
`;

export const GRUE_2_CABLE = `
<g id="GRUE_2_CABLE">
  <line x1="592" y1="224" x2="592" y2="318" stroke="${P.METAL_SOMBRE}" stroke-width="2.4"/>
  <rect x="584" y="318" width="16" height="14" fill="${P.METAL}" stroke="${P.METAL_SOMBRE}" stroke-width="2"/>
  <path d="M 592 332 q -12 12 0 24 q 14 -2 8 -14" fill="none" stroke="${P.METAL_SOMBRE}" stroke-width="4.5" stroke-linecap="round"/>
</g>
`;

// ---------------------------------------------------------------------------
// BRASERO — petit foyer a charbon avec bouilloire (pres du kiosque)
// ---------------------------------------------------------------------------

export const BRASERO = `
<g id="BRASERO">
  <path d="M 896 776 Q 912 786 928 776 L 924 764 Q 912 770 900 764 Z" fill="${P.METAL_SOMBRE}"/>
  <line x1="900" y1="776" x2="894" y2="800" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
  <line x1="924" y1="776" x2="930" y2="800" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
  <line x1="912" y1="780" x2="912" y2="800" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
  <circle cx="906" cy="766" r="3" fill="${P.NOIR_DOUX}"/>
  <circle cx="914" cy="764" r="3" fill="${P.NOIR_DOUX}"/>
  <circle cx="920" cy="767" r="2.6" fill="${P.NOIR_DOUX}"/>
  <g id="BRASERO_BOUILLOIRE">
    <path d="M 902 762 Q 902 746 912 746 Q 922 746 922 762 Z" fill="${P.PEINTURE_BLEUE}" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="2"/>
    <path d="M 922 754 q 8 0 8 8" fill="none" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="2.5"/>
    <path d="M 902 750 q -6 -2 -8 4" fill="none" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="2.5"/>
  </g>
</g>
`;

// ---------------------------------------------------------------------------
// GRUE 1 — grande grue portuaire en treillis (droite), charge suspendue
// ---------------------------------------------------------------------------

export const GRUE_1_MAT = `
<g id="GRUE_1_MAT">
  <ellipse cx="1250" cy="818" rx="90" ry="8" fill="${P.NOIR_DOUX}" opacity="0.12"/>
  <path d="M 1180 815 L 1320 815 L 1300 738 L 1200 738 Z" fill="${P.METAL}" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
  <rect x="1236" y="762" width="28" height="40" fill="${P.METAL_SOMBRE}"/>
  <rect x="1186" y="714" width="130" height="26" fill="${P.METAL_SOMBRE}"/>
  <g id="GRUE_1_CONTREPOIDS">
    <rect x="1292" y="656" width="66" height="58" fill="${P.METAL_SOMBRE}"/>
    <rect x="1292" y="656" width="66" height="12" fill="${P.PEINTURE_JAUNE}" opacity="0.8"/>
    <line x1="1300" y1="668" x2="1312" y2="656" stroke="${P.NOIR_DOUX}" stroke-width="4"/>
    <line x1="1320" y1="668" x2="1332" y2="656" stroke="${P.NOIR_DOUX}" stroke-width="4"/>
    <line x1="1340" y1="668" x2="1352" y2="656" stroke="${P.NOIR_DOUX}" stroke-width="4"/>
  </g>
  <g id="GRUE_1_CABINE">
    <rect x="1176" y="652" width="62" height="62" fill="${P.PEINTURE_BLEUE}" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="3"/>
    <rect x="1182" y="660" width="30" height="26" fill="${P.BLANC_CASSE}"/>
    <line x1="1197" y1="660" x2="1197" y2="686" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="2"/>
    <path d="M 1176 652 L 1238 652 L 1232 642 L 1182 642 Z" fill="${P.METAL}"/>
  </g>
  ${latticeBeam(1256, 714, 1256, 160, 40, 15, P.METAL_SOMBRE, 5)}
  <path d="M 1236 160 L 1276 160 L 1256 122 Z" fill="none" stroke="${P.METAL_SOMBRE}" stroke-width="4"/>
  <circle cx="1256" cy="128" r="4" fill="${P.PEINTURE_ROUGE}"/>
</g>
`;

export const GRUE_1_FLECHE = `
<g id="GRUE_1_FLECHE">
  ${latticeBeam(1230, 700, 1004, 262, 30, 13, P.METAL_SOMBRE, 5)}
  <line x1="1256" y1="140" x2="1046" y2="322" stroke="${P.METAL_SOMBRE}" stroke-width="2.4"/>
  <line x1="1256" y1="152" x2="1010" y2="272" stroke="${P.METAL_SOMBRE}" stroke-width="2.4"/>
  <circle cx="1004" cy="262" r="8" fill="${P.METAL}" stroke="${P.METAL_SOMBRE}" stroke-width="2.5"/>
</g>
`;

export const GRUE_1_CABLE = `
<g id="GRUE_1_CABLE">
  <line x1="1004" y1="270" x2="1006" y2="500" stroke="${P.METAL_SOMBRE}" stroke-width="2.6"/>
  <rect x="996" y="500" width="20" height="16" fill="${P.METAL}" stroke="${P.METAL_SOMBRE}" stroke-width="2"/>
  <path d="M 1006 516 q -13 13 0 26 q 15 -2 9 -15" fill="none" stroke="${P.METAL_SOMBRE}" stroke-width="5" stroke-linecap="round"/>
  <g id="FILET_SUSPENDU">
    <path d="M 1006 540 L 962 570 Q 958 606 1006 614 Q 1054 606 1050 570 Z" fill="${P.SAC}" stroke="${P.SAC_OMBRE}" stroke-width="2.5"/>
    <path d="M 968 574 Q 1006 588 1044 574 M 964 590 Q 1006 604 1048 590" fill="none" stroke="${P.SAC_OMBRE}" stroke-width="2"/>
    <line x1="976" y1="566" x2="988" y2="610" stroke="${P.SAC_OMBRE}" stroke-width="2"/>
    <line x1="1006" y1="560" x2="1006" y2="614" stroke="${P.SAC_OMBRE}" stroke-width="2"/>
    <line x1="1036" y1="566" x2="1024" y2="610" stroke="${P.SAC_OMBRE}" stroke-width="2"/>
    <line x1="1006" y1="540" x2="962" y2="570" stroke="${P.CORDE}" stroke-width="2.5"/>
    <line x1="1006" y1="540" x2="1050" y2="570" stroke="${P.CORDE}" stroke-width="2.5"/>
  </g>
</g>
`;

// ---------------------------------------------------------------------------
// CONTENEUR + LAMPADAIRES + VELO
// ---------------------------------------------------------------------------

export const CONTENEUR = `
<g id="CONTENEUR">
  <rect x="1335" y="588" width="220" height="218" fill="${P.PEINTURE_VERTE}" stroke="${P.NOIR_DOUX}" stroke-width="3"/>
  ${vlines(1349, 1521, 16, 592, 802, P.PALME_SOMBRE, 2.4, 0.5)}
  <rect x="1516" y="592" width="36" height="210" fill="${P.PALME_SOMBRE}"/>
  <line x1="1526" y1="596" x2="1526" y2="798" stroke="${P.PEINTURE_VERTE}" stroke-width="3"/>
  <line x1="1542" y1="596" x2="1542" y2="798" stroke="${P.PEINTURE_VERTE}" stroke-width="3"/>
  <circle cx="1526" cy="640" r="4" fill="${P.NOIR_DOUX}"/>
  <circle cx="1542" cy="640" r="4" fill="${P.NOIR_DOUX}"/>
  <rect x="1335" y="588" width="220" height="14" fill="${P.PALME_SOMBRE}" opacity="0.6"/>
  <rect x="1360" y="620" width="52" height="52" rx="3" fill="${P.BLANC_CASSE}" opacity="0.34"/>
  <path d="M 1370 646 l 16 -16 l 16 16 l -16 16 Z" fill="${P.PEINTURE_VERTE}" opacity="0.5"/>
  <path d="M 1432 626 q 8 26 -3 48" fill="none" stroke="${P.ROUILLE_SOMBRE}" stroke-width="3" opacity="0.35"/>
  <path d="M 1352 596 q 4 30 -2 52" fill="none" stroke="${P.ROUILLE}" stroke-width="4" opacity="0.55"/>
  <path d="M 1480 596 q 3 24 -1 40" fill="none" stroke="${P.ROUILLE}" stroke-width="3.5" opacity="0.5"/>
  <path d="M 1400 760 q 30 -10 60 0 q 20 8 6 20 l -70 0 q -8 -12 4 -20 Z" fill="${P.ROUILLE}" opacity="0.35"/>
  <g id="CONTENEUR_TOIT_OBJETS">
    <ellipse cx="1390" cy="586" rx="24" ry="8" fill="${P.PNEU}"/>
    <ellipse cx="1390" cy="584" rx="9" ry="3" fill="${P.PEINTURE_VERTE}"/>
    <line x1="1430" y1="586" x2="1530" y2="582" stroke="${P.BOIS_CLAIR}" stroke-width="6"/>
  </g>
</g>
`;

const lamppost = (x: number, baseY: number, armDir: 1 | -1, id: string): string => {
  const topY = baseY - 415;
  const armX = x + 66 * armDir;
  return `
<g id="${id}">
  <ellipse cx="${x}" cy="${baseY + 2}" rx="22" ry="5" fill="${P.NOIR_DOUX}" opacity="0.18"/>
  <path d="M ${x - 9} ${baseY} L ${x - 6} ${baseY - 26} L ${x + 6} ${baseY - 26} L ${x + 9} ${baseY} Z" fill="${P.METAL_SOMBRE}"/>
  <line x1="${x}" y1="${baseY - 24}" x2="${x}" y2="${topY + 20}" stroke="${P.METAL_SOMBRE}" stroke-width="7"/>
  <path d="M ${x} ${topY + 22} Q ${x} ${topY} ${armX} ${topY}" fill="none" stroke="${P.METAL_SOMBRE}" stroke-width="6"/>
  <g id="${id}_TETE">
    <path d="M ${armX - 16 * armDir} ${topY - 4} L ${armX + 14 * armDir} ${topY - 4} L ${armX + 10 * armDir} ${topY + 10} L ${armX - 12 * armDir} ${topY + 10} Z" fill="${P.METAL_SOMBRE}"/>
    <ellipse cx="${armX}" cy="${topY + 12}" rx="10" ry="5" fill="${P.BLANC_CASSE}" opacity="0.95"/>
  </g>
  <rect x="${x - 6}" y="${baseY - 120}" width="12" height="16" fill="${P.METAL}"/>
</g>
`;
};

export const LAMPADAIRE_1 = lamppost(1592, 836, -1, "LAMPADAIRE_1");
export const LAMPADAIRE_2 = lamppost(96, 842, 1, "LAMPADAIRE_2");

export const VELO = `
<g id="VELO" transform="rotate(-4 1862 790)">
  <circle cx="1826" cy="792" r="24" fill="none" stroke="${P.METAL_SOMBRE}" stroke-width="3.5"/>
  <circle cx="1898" cy="792" r="24" fill="none" stroke="${P.METAL_SOMBRE}" stroke-width="3.5"/>
  <path d="M 1826 792 L 1850 748 L 1886 748 L 1898 792 M 1850 748 L 1862 792 L 1898 792 M 1862 792 L 1826 792" fill="none" stroke="${P.PEINTURE_ROUGE}" stroke-width="3.5"/>
  <line x1="1886" y1="748" x2="1880" y2="736" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
  <line x1="1872" y1="736" x2="1888" y2="736" stroke="${P.METAL_SOMBRE}" stroke-width="3.5"/>
  <line x1="1850" y1="748" x2="1846" y2="738" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
  <line x1="1840" y1="738" x2="1852" y2="738" stroke="${P.METAL_SOMBRE}" stroke-width="3.5"/>
  <rect x="1902" y="756" width="18" height="14" fill="${P.BOIS_CLAIR}" stroke="${P.BOIS_SOMBRE}" stroke-width="2"/>
</g>
`;

// ---------------------------------------------------------------------------
// HANGAR B — entrepot droit : bois + tole, lettrage peint delave
// ---------------------------------------------------------------------------

export const HANGAR_B = `
<g id="HANGAR_B">
  <rect x="1560" y="640" width="390" height="175" fill="${P.BOIS}"/>
  ${hlines(662, 800, 22, 1560, 1948, P.BOIS_SOMBRE, 2, 0.5)}
  ${vlines(1640, 1900, 130, 662, 810, P.BOIS_SOMBRE, 2.4, 0.45)}
  <rect x="1560" y="446" width="390" height="196" fill="${P.TOLE}"/>
  ${vlines(1572, 1940, 22, 452, 638, P.TOLE_OMBRE, 2, 0.45)}
  <path d="M 1548 444 L 1952 386 L 1958 404 L 1554 462 Z" fill="${P.TOIT}"/>
  <path d="M 1700 424 L 1830 406 L 1832 418 L 1702 436 Z" fill="${P.TOLE}" opacity="0.9"/>
  <line x1="1840" y1="398" x2="1840" y2="360" stroke="${P.METAL_SOMBRE}" stroke-width="8"/>
  <path d="M 1830 360 L 1850 360 L 1846 352 L 1834 352 Z" fill="${P.METAL_SOMBRE}"/>
  <path d="M 1596 470 q 30 -12 56 2 q 18 10 8 26 q -28 10 -52 -3 q -16 -10 -12 -25 Z" fill="${P.ROUILLE}" opacity="0.5"/>
  <path d="M 1880 560 q 24 -10 44 3 q 13 9 6 22 q -22 9 -42 -3 q -12 -9 -8 -22 Z" fill="${P.ROUILLE_SOMBRE}" opacity="0.45"/>
  ${[1618, 1758, 1912].map((x) => `<path d="M ${x} 448 q 3 20 -1 36" fill="none" stroke="${P.ROUILLE}" stroke-width="3" opacity="0.45"/>`).join("")}
  <g id="ENSEIGNE_HANGAR_B">
    ${[1660, 1712, 1764, 1816].map((x) => `<path d="M ${x} 512 q 5 34 -2 66" fill="none" stroke="${P.ROUILLE}" stroke-width="3" opacity="0.3"/>`).join("")}
    <path d="M 1690 528 q 60 -10 122 6 q -58 14 -122 -6 Z" fill="${P.ROUILLE}" opacity="0.22"/>
    <line x1="1650" y1="548" x2="1650" y2="562" stroke="${P.BLANC_CASSE}" stroke-width="2" opacity="0.4"/>
    <line x1="1782" y1="548" x2="1782" y2="566" stroke="${P.BLANC_CASSE}" stroke-width="2" opacity="0.35"/>
    <rect x="1826" y="500" width="60" height="48" fill="${P.TOLE}" opacity="0.45"/>
  </g>
  <g id="HANGAR_B_AUVENT">
    <path d="M 1564 626 L 1668 620 L 1674 636 L 1570 642 Z" fill="${P.TOLE_OMBRE}"/>
    <line x1="1576" y1="640" x2="1580" y2="700" stroke="${P.BOIS_SOMBRE}" stroke-width="4"/>
    <line x1="1660" y1="634" x2="1664" y2="696" stroke="${P.BOIS_SOMBRE}" stroke-width="4"/>
  </g>
  <g id="SACS_HANGAR_B">
    ${sack(1572, 762, 52, 48, P.SAC)}
    ${sack(1626, 766, 48, 44, P.SAC_OMBRE)}
    ${sack(1590, 722, 50, 44, P.SAC)}
    ${sack(1640, 726, 44, 40, P.SAC)}
    ${sack(1612, 684, 48, 42, P.SAC_OMBRE)}
  </g>
  <rect x="1560" y="800" width="390" height="14" fill="${P.QUAI_TACHE}" opacity="0.45"/>
  <path d="M 1560 448 Q 1576 440 1592 436" fill="none" stroke="${P.METAL_SOMBRE}" stroke-width="1.6" opacity="0.8"/>
</g>
`;

export const PORTE_HANGAR_B = `
<g id="PORTE_HANGAR_B">
  <rect x="1690" y="660" width="122" height="152" fill="${P.NOIR_DOUX}"/>
  <rect x="1690" y="656" width="130" height="10" fill="${P.BOIS_SOMBRE}"/>
  <rect x="1692" y="666" width="58" height="146" fill="${P.BOIS_CLAIR}" stroke="${P.BOIS_SOMBRE}" stroke-width="2.5"/>
  ${vlines(1704, 1740, 12, 670, 808, P.BOIS_SOMBRE, 1.4, 0.5)}
  <path d="M 1762 666 L 1808 674 L 1808 812 L 1762 812 Z" fill="${P.BOIS}" stroke="${P.BOIS_SOMBRE}" stroke-width="2.5"/>
  <line x1="1774" y1="668" x2="1774" y2="812" stroke="${P.BOIS_SOMBRE}" stroke-width="1.4" opacity="0.5"/>
  <line x1="1788" y1="670" x2="1788" y2="812" stroke="${P.BOIS_SOMBRE}" stroke-width="1.4" opacity="0.5"/>
  <circle cx="1746" cy="742" r="3.5" fill="${P.METAL_SOMBRE}"/>
</g>
`;

export const FENETRE_HANGAR_B_1 = `
<g id="FENETRE_HANGAR_B_1">
  <rect x="1596" y="466" width="58" height="70" fill="${P.BOIS_SOMBRE}"/>
  <rect x="1600" y="470" width="50" height="62" fill="${P.BLANC_CASSE}" opacity="0.92"/>
  <line x1="1625" y1="470" x2="1625" y2="532" stroke="${P.BOIS_SOMBRE}" stroke-width="3"/>
  <line x1="1600" y1="501" x2="1650" y2="501" stroke="${P.BOIS_SOMBRE}" stroke-width="3"/>
  <path d="M 1626 502 L 1650 502 L 1650 532 L 1632 532 Z" fill="${P.NOIR_DOUX}" opacity="0.85"/>
  <line x1="1604" y1="476" x2="1620" y2="496" stroke="${P.TOLE_OMBRE}" stroke-width="1.6"/>
</g>
`;

// ---------------------------------------------------------------------------
// PLAN 6 — PROPS D'AVANT-PLAN (bases >= 1000 : ils CADRENT la bande de
// circulation sans jamais la bloquer ; le centre bas reste degage)
// ---------------------------------------------------------------------------

export const PROPS_AVANT_GAUCHE = `
<g id="PROPS_AVANT_GAUCHE">
  <g id="SACS_AVANT">
    ${sack(-30, 1030, 96, 70, P.SAC)}
    ${sack(62, 1038, 88, 64, P.SAC_OMBRE)}
    ${sack(8, 986, 92, 62, P.SAC)}
    ${sack(96, 992, 84, 58, P.SAC)}
    ${sack(52, 944, 88, 58, P.SAC_OMBRE)}
    <path d="M 60 950 l 18 -12 l 6 10" fill="none" stroke="${P.SAC_OMBRE}" stroke-width="3"/>
    <rect x="120" y="960" width="30" height="18" fill="${P.BLANC_CASSE}" opacity="0.9" transform="rotate(6 135 969)"/>
  </g>
  <g id="CAISSE_1">
    <rect x="186" y="1006" width="128" height="90" fill="${P.BOIS_CLAIR}" stroke="${P.BOIS_SOMBRE}" stroke-width="3"/>
    <line x1="186" y1="1036" x2="314" y2="1036" stroke="${P.BOIS_SOMBRE}" stroke-width="2.4"/>
    <line x1="186" y1="1066" x2="314" y2="1066" stroke="${P.BOIS_SOMBRE}" stroke-width="2.4"/>
    <line x1="250" y1="1006" x2="250" y2="1096" stroke="${P.BOIS_SOMBRE}" stroke-width="2.4"/>
    <g transform="rotate(-1 250 1058)">
      <path d="M 214 1040 l 36 0 l 18 20 l -18 20 l -36 0 l -18 -20 Z" fill="${P.PEINTURE_ROUGE}" opacity="0.55"/>
    </g>
  </g>
  <g id="FILET_AVANT">
    <path d="M 296 1022 Q 350 1006 388 1030 Q 402 1060 380 1080 L 300 1080 Q 282 1050 296 1022 Z" fill="none" stroke="${P.CORDE}" stroke-width="2.5"/>
    <path d="M 300 1034 Q 344 1022 380 1040 M 296 1052 Q 342 1040 386 1058 M 306 1070 Q 348 1058 382 1072" fill="none" stroke="${P.CORDE}" stroke-width="2"/>
    <path d="M 312 1026 L 320 1078 M 340 1018 L 344 1078 M 366 1024 L 368 1078" fill="none" stroke="${P.CORDE}" stroke-width="2"/>
    <circle cx="308" cy="1024" r="6" fill="${P.PEINTURE_ROUGE}"/>
    <circle cx="352" cy="1014" r="6" fill="${P.PEINTURE_ROUGE}"/>
    <circle cx="388" cy="1032" r="6" fill="${P.PEINTURE_ROUGE}"/>
  </g>
  <g id="PNEUS_AVANT">
    <ellipse cx="424" cy="1062" rx="42" ry="16" fill="${P.PNEU}"/>
    <ellipse cx="424" cy="1058" rx="42" ry="16" fill="${P.PNEU}"/>
    <ellipse cx="424" cy="1056" rx="17" ry="6" fill="${P.QUAI}"/>
    <ellipse cx="428" cy="1088" rx="44" ry="16" fill="${P.PNEU}"/>
    <ellipse cx="428" cy="1084" rx="17" ry="6" fill="${P.QUAI_TACHE}"/>
  </g>
</g>
`;

export const PROPS_AVANT_DROITE = `
<g id="PROPS_AVANT_DROITE">
  <g id="CORDAGE_AVANT">
    <ellipse cx="1608" cy="1052" rx="52" ry="20" fill="none" stroke="${P.CORDE}" stroke-width="7"/>
    <ellipse cx="1608" cy="1044" rx="52" ry="20" fill="none" stroke="${P.CORDE}" stroke-width="7"/>
    <ellipse cx="1608" cy="1036" rx="52" ry="20" fill="none" stroke="${P.SAC_OMBRE}" stroke-width="6"/>
    <path d="M 1655 1042 q 30 10 44 34" fill="none" stroke="${P.CORDE}" stroke-width="5" stroke-linecap="round"/>
  </g>
  <g id="BIDONS_AVANT">
    <rect x="1690" y="952" width="76" height="128" rx="6" fill="${P.PEINTURE_BLEUE}" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="3"/>
    <ellipse cx="1728" cy="954" rx="38" ry="10" fill="${P.PEINTURE_BLEUE_SOMBRE}"/>
    <line x1="1692" y1="994" x2="1764" y2="994" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="3.5"/>
    <line x1="1692" y1="1038" x2="1764" y2="1038" stroke="${P.PEINTURE_BLEUE_SOMBRE}" stroke-width="3.5"/>
    <path d="M 1700 962 q 5 30 -2 48" fill="none" stroke="${P.ROUILLE}" stroke-width="4" opacity="0.5"/>
    <rect x="1770" y="972" width="70" height="108" rx="6" fill="${P.PEINTURE_ROUGE}" stroke="${P.ROUILLE_SOMBRE}" stroke-width="3"/>
    <ellipse cx="1805" cy="974" rx="35" ry="9" fill="${P.ROUILLE_SOMBRE}"/>
    <line x1="1772" y1="1010" x2="1840" y2="1010" stroke="${P.ROUILLE_SOMBRE}" stroke-width="3.5"/>
    <line x1="1772" y1="1046" x2="1840" y2="1046" stroke="${P.ROUILLE_SOMBRE}" stroke-width="3.5"/>
    <path d="M 1786 984 l 20 12 l -16 8 Z" fill="${P.ROUILLE_SOMBRE}" opacity="0.6"/>
  </g>
  <g id="BIDON_COUCHE">
    <rect x="1834" y="1032" width="110" height="60" rx="28" fill="${P.METAL}" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
    <ellipse cx="1842" cy="1062" rx="12" ry="28" fill="${P.METAL_SOMBRE}"/>
    <line x1="1874" y1="1034" x2="1874" y2="1090" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
    <line x1="1908" y1="1034" x2="1908" y2="1090" stroke="${P.METAL_SOMBRE}" stroke-width="3"/>
  </g>
  <g id="BROUETTE">
    <path d="M 1494 1006 L 1590 1006 L 1576 1052 L 1510 1052 Z" fill="${P.BOIS}" stroke="${P.BOIS_SOMBRE}" stroke-width="3"/>
    ${sack(1512, 984, 44, 32, P.SAC)}
    <circle cx="1500" cy="1072" r="20" fill="none" stroke="${P.METAL_SOMBRE}" stroke-width="5"/>
    <circle cx="1500" cy="1072" r="5" fill="${P.METAL_SOMBRE}"/>
    <line x1="1510" y1="1052" x2="1500" y2="1072" stroke="${P.METAL_SOMBRE}" stroke-width="4"/>
    <line x1="1576" y1="1052" x2="1620" y2="1078" stroke="${P.BOIS_SOMBRE}" stroke-width="5" stroke-linecap="round"/>
    <line x1="1580" y1="1044" x2="1626" y2="1066" stroke="${P.BOIS_SOMBRE}" stroke-width="5" stroke-linecap="round"/>
  </g>
</g>
`;

// ---------------------------------------------------------------------------
// DONNEES DE POSE (pour poser personnages, lumieres, amarres sans mesurer)
// ---------------------------------------------------------------------------

export const COORDS = {
  cadre: { largeur: 1920, hauteur: 1080 },
  horizonY: 445,
  // Ligne ou l'eau rencontre le bord du quai.
  bordQuaiY: 733,
  // Ligne de facade des batiments (leurs bases).
  ligneBatimentsY: 812,
  // Bande de circulation DEGAGEE : un personnage peut marcher de gauche a
  // droite sur toute la largeur, pieds entre yPiedsFond et yPiedsAvant.
  // Les props d'avant-plan ont tous une base >= 1000 (ils passent DEVANT),
  // le mobilier de quai (bittes, brasero...) a une base <= 810 (DERRIERE).
  bandeCirculation: { xMin: 0, xMax: 1920, yPiedsFond: 860, yPiedsAvant: 985 },
  grues: {
    grue1: { pivotFleche: { x: 1230, y: 700 }, boutFleche: { x: 1004, y: 262 } },
    grue2: { pivotFleche: { x: 792, y: 322 }, boutFleche: { x: 592, y: 218 } },
  },
} as const;

// Echelle personnage : hauteur en px d'un adulte debout selon la position
// verticale de ses PIEDS. Interpolation lineaire entre les deux reperes.
// h(y) = 180 + (y - 830) * 0.529
export const ECHELLE_PERSONNAGE = {
  avant: { yPieds: 1000, hauteurPx: 270 },
  fond: { yPieds: 830, hauteurPx: 180 },
  pente: 0.529,
} as const;

// Sources lumineuses a allumer pour la nuit (position du foyer lumineux).
export const LUMIERES = [
  { id: "LAMPADAIRE_1_TETE", x: 1526, y: 433 },
  { id: "LAMPADAIRE_2_TETE", x: 162, y: 439 },
  { id: "FENETRE_HANGAR_A_1", x: 57, y: 503 },
  { id: "FENETRE_HANGAR_A_2", x: 399, y: 503 },
  { id: "FENETRE_HANGAR_B_1", x: 1625, y: 501 },
  { id: "PORTE_HANGAR_A_ENTREBAILLEMENT", x: 326, y: 680 },
  { id: "PORTE_HANGAR_B_ENTREBAILLEMENT", x: 1740, y: 736 },
  { id: "CHALUTIER_TIMONERIE_FENETRES", x: 1162, y: 574 },
  { id: "FEU_ANTENNE_VILLE", x: 890, y: 350 },
  { id: "BRASERO_FOYER", x: 912, y: 766 },
] as const;

export const POINTS_AMARRAGE = [
  { id: "BITTE_1", x: 960, y: 756 },
  { id: "BITTE_2", x: 1035, y: 756 },
  { id: "BITTE_3", x: 1155, y: 756 },
  { id: "PILOTIS", x: 800, y: 690 },
] as const;

// ---------------------------------------------------------------------------
// ORDRE D'EMPILEMENT (du fond vers l'avant) — pret a consommer.
// Un plan de parallaxe = un ou plusieurs calques consecutifs.
// ---------------------------------------------------------------------------

export const CALQUES: ReadonlyArray<{ nom: string; svg: string }> = [
  { nom: "PLAN_CIEL", svg: PLAN_CIEL },
  { nom: "NUAGES", svg: NUAGES },
  { nom: "OISEAUX", svg: OISEAUX },
  { nom: "PLAN_VILLE_LOINTAINE", svg: PLAN_VILLE_LOINTAINE },
  { nom: "PLAN_EAU", svg: PLAN_EAU },
  { nom: "BAC_LOIN", svg: BAC_LOIN },
  { nom: "VOILIER_LOIN", svg: VOILIER_LOIN },
  { nom: "BOUEE_2", svg: BOUEE_2 },
  { nom: "PIROGUE_LOIN", svg: PIROGUE_LOIN },
  { nom: "BOUEE_1", svg: BOUEE_1 },
  { nom: "CHALUTIER", svg: CHALUTIER },
  { nom: "PONTON", svg: PONTON },
  { nom: "PIROGUE_1", svg: PIROGUE_1 },
  { nom: "AMARRE_PIROGUE", svg: AMARRE_PIROGUE },
  { nom: "QUAI_BORD", svg: QUAI_BORD },
  { nom: "BITTE_1", svg: BITTE_1 },
  { nom: "BITTE_2", svg: BITTE_2 },
  { nom: "BITTE_3", svg: BITTE_3 },
  { nom: "AMARRE_CHALUTIER_AVANT", svg: AMARRE_CHALUTIER_AVANT },
  { nom: "AMARRE_CHALUTIER_ARRIERE", svg: AMARRE_CHALUTIER_ARRIERE },
  { nom: "PLAN_QUAI_SOL", svg: PLAN_QUAI_SOL },
  { nom: "HANGAR_A", svg: HANGAR_A },
  { nom: "PORTE_HANGAR_A", svg: PORTE_HANGAR_A },
  { nom: "FENETRE_HANGAR_A_1", svg: FENETRE_HANGAR_A_1 },
  { nom: "FENETRE_HANGAR_A_2", svg: FENETRE_HANGAR_A_2 },
  { nom: "ENSEIGNE_HANGAR_A", svg: ENSEIGNE_HANGAR_A },
  { nom: "LINGE", svg: LINGE },
  { nom: "KIOSQUE", svg: KIOSQUE },
  { nom: "PALMIER_1", svg: PALMIER_1 },
  { nom: "GRUE_2_MAT", svg: GRUE_2_MAT },
  { nom: "GRUE_2_FLECHE", svg: GRUE_2_FLECHE },
  { nom: "GRUE_2_CABLE", svg: GRUE_2_CABLE },
  { nom: "BRASERO", svg: BRASERO },
  { nom: "GRUE_1_MAT", svg: GRUE_1_MAT },
  { nom: "GRUE_1_FLECHE", svg: GRUE_1_FLECHE },
  { nom: "GRUE_1_CABLE", svg: GRUE_1_CABLE },
  { nom: "CONTENEUR", svg: CONTENEUR },
  { nom: "HANGAR_B", svg: HANGAR_B },
  { nom: "PORTE_HANGAR_B", svg: PORTE_HANGAR_B },
  { nom: "FENETRE_HANGAR_B_1", svg: FENETRE_HANGAR_B_1 },
  { nom: "LAMPADAIRE_2", svg: LAMPADAIRE_2 },
  { nom: "LAMPADAIRE_1", svg: LAMPADAIRE_1 },
  { nom: "VELO", svg: VELO },
  { nom: "PROPS_AVANT_GAUCHE", svg: PROPS_AVANT_GAUCHE },
  { nom: "PROPS_AVANT_DROITE", svg: PROPS_AVANT_DROITE },
];
