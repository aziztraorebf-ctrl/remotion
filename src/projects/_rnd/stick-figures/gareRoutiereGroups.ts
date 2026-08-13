// Groupes SVG de la scene "gare routiere ouest-africaine, tot le matin".
// Decor de PARALLAXE en 6 plans, du fond vers l'avant :
//   PLAN_CIEL -> PLAN_LOINTAIN -> PLAN_BATIMENTS -> PLAN_VEHICULES -> PLAN_SOL -> PLAN_AVANT
// Chaque constante contient le CONTENU INTERNE d'un <g> (sans la balise <g> externe) :
// cote React, chaque plan est injecte dans un wrapper <g transform> anime par frame
// (doctrine SVG : innerHTML n'anime pas les <g> internes).
//
// Reperes de composition (viewBox 0 0 1920 1080, dessin de x=-200 a x=2120) :
//   - horizon franc a y=616
//   - BANDE DE SOL LIBRE entre y=780 et y=1010 : reservee aux personnages ajoutes
//     par code. AUCUN objet n'y est dessine, seulement la terre battue (PLAN_SOL).
//   - vehicules et batiments posent leurs pieds/roues EXACTEMENT a y=780
//   - objets du PLAN_AVANT strictement sous y=1010
// Palette verrouillee terre/matin, remplissages PLATS, contours encre #2b2117.
// Zero personnage, zero animal, zero texte.

export const DEFS = `
  <linearGradient id="gCielMatin" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e8dcc0"/>
    <stop offset="1" stop-color="#f0e4cc"/>
  </linearGradient>
  <g id="roue">
    <circle r="30" fill="#2b2117"/>
    <circle r="12" fill="#b9a884" stroke="#2b2117" stroke-width="2"/>
  </g>
`;

// --- PLAN CIEL (le plus lent) : degrade du matin, soleil bas rasant, nuages plats. ---
export const PLAN_CIEL = `
  <rect x="-200" y="-60" width="2320" height="700" fill="url(#gCielMatin)"/>
  <circle cx="1490" cy="540" r="140" fill="#f0e4cc" opacity="0.9"/>
  <circle cx="1490" cy="540" r="56" fill="#d8a54a"/>
  <path d="M160,210 Q420,192 700,200 Q540,222 320,224 Q220,222 160,210 Z" fill="#f0e4cc" opacity="0.9"/>
  <path d="M960,150 Q1220,134 1500,144 Q1340,162 1100,164 Q1010,162 960,150 Z" fill="#f0e4cc" opacity="0.8"/>
  <path d="M1520,260 Q1760,244 2000,254 Q1840,272 1640,274 Q1560,270 1520,260 Z" fill="#f0e4cc" opacity="0.85"/>
  <path d="M300,330 Q520,316 760,322 Q620,340 440,342 Q350,340 300,330 Z" fill="#c9b48e" opacity="0.25"/>
  <path d="M1140,390 Q1380,376 1640,382 Q1490,400 1300,402 Q1200,400 1140,390 Z" fill="#c9b48e" opacity="0.2"/>
  <rect x="-200" y="560" width="2320" height="56" fill="#f0e4cc" opacity="0.55"/>
`;

// --- PLAN LOINTAIN : masse de ville a l'horizon (y=616), chateau d'eau, tour,
// arbres. Tout en #c9b48e (silhouettes de brume), rien sous y=780. ---
export const PLAN_LOINTAIN = `
  <rect x="-200" y="616" width="2320" height="164" fill="#c9b48e"/>
  <path d="M-200,616 H2120" stroke="#2b2117" stroke-width="1.5" opacity="0.35" fill="none"/>
  <g fill="#c9b48e" opacity="0.85">
    <rect x="-200" y="556" width="140" height="60"/>
    <rect x="-40" y="576" width="110" height="40"/>
    <rect x="480" y="570" width="90" height="46"/>
    <rect x="580" y="552" width="120" height="64"/>
    <rect x="1050" y="566" width="100" height="50"/>
    <rect x="1160" y="584" width="90" height="32"/>
    <rect x="1900" y="560" width="120" height="56"/>
    <rect x="2030" y="578" width="90" height="38"/>
  </g>
  <g fill="#c9b48e" opacity="0.9">
    <rect x="214" y="462" width="92" height="44" rx="20"/>
    <path d="M226,506 L244,616 M294,506 L276,616 M260,506 V616" stroke="#c9b48e" stroke-width="5" fill="none"/>
    <rect x="1716" y="444" width="30" height="172"/>
    <rect x="1708" y="500" width="46" height="12"/>
    <rect x="1722" y="428" width="18" height="16"/>
    <circle cx="380" cy="566" r="36"/>
    <circle cx="410" cy="576" r="28"/>
    <rect x="382" y="592" width="8" height="24"/>
    <circle cx="880" cy="556" r="40"/>
    <circle cx="915" cy="570" r="30"/>
    <rect x="884" y="588" width="8" height="28"/>
    <circle cx="1560" cy="570" r="34"/>
    <rect x="1556" y="596" width="8" height="20"/>
  </g>
  <ellipse cx="960" cy="744" rx="1100" ry="34" fill="#f0e4cc" opacity="0.45"/>
`;

// --- PLAN BATIMENTS : deux hangars a auvent de tole + une facade centrale.
// Poteaux et murs descendent EXACTEMENT a y=780 (jamais dans la bande libre). ---
export const PLAN_BATIMENTS = `
  <rect x="-200" y="484" width="800" height="296" fill="#d9c9a4" stroke="#2b2117" stroke-width="2"/>
  <rect x="-40" y="600" width="100" height="180" fill="#2b2117" opacity="0.85"/>
  <rect x="200" y="600" width="100" height="180" fill="#2b2117" opacity="0.85"/>
  <rect x="420" y="560" width="70" height="60" fill="#2b2117" opacity="0.7"/>
  <polygon points="-200,432 560,448 600,488 -200,470" fill="#b9a884" stroke="#2b2117" stroke-width="2.5"/>
  <g stroke="#2b2117" stroke-width="1.5" opacity="0.3" fill="none">
    <path d="M-130,434 L-124,470"/>
    <path d="M-40,436 L-34,472"/>
    <path d="M50,438 L56,474"/>
    <path d="M140,440 L146,476"/>
    <path d="M230,442 L236,478"/>
    <path d="M320,443 L326,480"/>
    <path d="M410,445 L416,482"/>
    <path d="M500,447 L506,485"/>
  </g>
  <rect x="-64" y="478" width="10" height="302" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="136" y="480" width="10" height="300" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="336" y="482" width="10" height="298" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="536" y="486" width="10" height="294" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>

  <rect x="700" y="488" width="480" height="292" fill="#d9c9a4" stroke="#2b2117" stroke-width="2.5"/>
  <rect x="690" y="474" width="500" height="18" fill="#b9a884" stroke="#2b2117" stroke-width="2"/>
  <rect x="760" y="505" width="26" height="18" fill="#2b2117" opacity="0.7"/>
  <rect x="930" y="505" width="26" height="18" fill="#2b2117" opacity="0.7"/>
  <rect x="1100" y="505" width="26" height="18" fill="#2b2117" opacity="0.7"/>
  <polygon points="690,556 1190,556 1160,606 720,606" fill="#b9a884" stroke="#2b2117" stroke-width="2"/>
  <g stroke="#2b2117" stroke-width="1.5" opacity="0.3" fill="none">
    <path d="M750,558 L746,604"/>
    <path d="M810,558 L806,604"/>
    <path d="M870,558 L866,604"/>
    <path d="M930,558 L926,604"/>
    <path d="M990,558 L986,604"/>
    <path d="M1050,558 L1046,604"/>
    <path d="M1110,558 L1106,604"/>
  </g>
  <rect x="880" y="640" width="110" height="140" fill="#2b2117" opacity="0.9"/>
  <rect x="745" y="628" width="95" height="105" fill="#8a6a45" stroke="#2b2117" stroke-width="2"/>
  <g stroke="#2b2117" stroke-width="1.5" opacity="0.5" fill="none">
    <path d="M745,646 H840 M745,664 H840 M745,682 H840 M745,700 H840 M745,718 H840"/>
  </g>
  <rect x="1035" y="628" width="95" height="105" fill="#8a6a45" stroke="#2b2117" stroke-width="2"/>
  <g stroke="#2b2117" stroke-width="1.5" opacity="0.5" fill="none">
    <path d="M1035,646 H1130 M1035,664 H1130 M1035,682 H1130 M1035,700 H1130 M1035,718 H1130"/>
  </g>

  <rect x="1226" y="470" width="8" height="310" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="1198" y="486" width="64" height="7" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
  <path d="M1202,493 Q800,532 -200,508" stroke="#2b2117" stroke-width="2" opacity="0.45" fill="none"/>
  <path d="M1258,493 Q1700,530 2120,506" stroke="#2b2117" stroke-width="2" opacity="0.45" fill="none"/>

  <rect x="1360" y="496" width="760" height="284" fill="#d9c9a4" stroke="#2b2117" stroke-width="2"/>
  <rect x="1480" y="610" width="110" height="170" fill="#2b2117" opacity="0.85"/>
  <rect x="1760" y="610" width="110" height="170" fill="#2b2117" opacity="0.85"/>
  <polygon points="1320,458 2120,434 2120,478 1280,502" fill="#b9a884" stroke="#2b2117" stroke-width="2.5"/>
  <g stroke="#2b2117" stroke-width="1.5" opacity="0.3" fill="none">
    <path d="M1390,456 L1384,498"/>
    <path d="M1480,453 L1474,494"/>
    <path d="M1570,450 L1564,490"/>
    <path d="M1660,447 L1654,486"/>
    <path d="M1750,445 L1744,482"/>
    <path d="M1840,442 L1834,478"/>
    <path d="M1930,439 L1924,474"/>
    <path d="M2020,436 L2014,470"/>
  </g>
  <rect x="1400" y="494" width="10" height="286" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="1660" y="488" width="10" height="292" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="1920" y="480" width="10" height="300" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="2080" y="476" width="10" height="304" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
`;

// --- PLAN VEHICULES : 3 minibus de brousse de profil (museau court, caisse haute,
// galerie de toit chargee). Roues posees EXACTEMENT a y=780. ---
export const PLAN_VEHICULES = `
  <ellipse cx="420" cy="773" rx="290" ry="7" fill="#ab8f5f" opacity="0.5"/>
  <ellipse cx="1140" cy="773" rx="300" ry="7" fill="#ab8f5f" opacity="0.5"/>
  <ellipse cx="1830" cy="773" rx="300" ry="7" fill="#ab8f5f" opacity="0.5"/>

  <rect x="270" y="556" width="390" height="6" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="300" y="562" width="8" height="10" fill="#8a6a45"/>
  <rect x="460" y="562" width="8" height="10" fill="#8a6a45"/>
  <rect x="620" y="562" width="8" height="10" fill="#8a6a45"/>
  <rect x="285" y="520" width="95" height="36" rx="10" fill="#d8a54a" stroke="#2b2117" stroke-width="2"/>
  <ellipse cx="438" cy="536" rx="45" ry="20" fill="#8a6a45" stroke="#2b2117" stroke-width="2"/>
  <rect x="495" y="526" width="130" height="30" rx="14" fill="#b9a884" stroke="#2b2117" stroke-width="2"/>
  <circle cx="610" cy="541" r="10" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
  <path d="M310,520 V556 M355,520 V556 M525,526 V556 M580,526 V556" stroke="#2b2117" stroke-width="1.5" opacity="0.7" fill="none"/>
  <path d="M156,758 L156,672 L212,660 L248,584 Q252,572 266,572 L664,572 Q682,572 682,590 L682,740 Q682,758 664,758 Z" fill="#c17e3a" stroke="#2b2117" stroke-width="2.5"/>
  <rect x="214" y="676" width="466" height="18" fill="#d8a54a"/>
  <path d="M212,660 L212,758" stroke="#2b2117" stroke-width="1.5" opacity="0.4" fill="none"/>
  <polygon points="216,654 250,588 268,588 240,654" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="280" y="592" width="80" height="56" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="374" y="592" width="80" height="56" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="468" y="592" width="80" height="56" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="562" y="592" width="80" height="56" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <path d="M470,592 V752" stroke="#2b2117" stroke-width="1.5" opacity="0.4" fill="none"/>
  <rect x="478" y="702" width="20" height="6" fill="#2b2117" opacity="0.7"/>
  <rect x="142" y="724" width="16" height="26" fill="#b9a884" stroke="#2b2117" stroke-width="1.5"/>
  <circle cx="170" cy="700" r="8" fill="#d8a54a" stroke="#2b2117" stroke-width="1.5"/>
  <path d="M220,758 A40,40 0 0 1 300,758 Z" fill="#2b2117" opacity="0.25"/>
  <path d="M556,758 A40,40 0 0 1 636,758 Z" fill="#2b2117" opacity="0.25"/>
  <use href="#roue" x="260" y="750"/>
  <use href="#roue" x="596" y="750"/>

  <rect x="990" y="548" width="400" height="6" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="1020" y="554" width="8" height="10" fill="#8a6a45"/>
  <rect x="1180" y="554" width="8" height="10" fill="#8a6a45"/>
  <rect x="1350" y="554" width="8" height="10" fill="#8a6a45"/>
  <rect x="1000" y="510" width="140" height="38" rx="12" fill="#8a6a45" stroke="#2b2117" stroke-width="2"/>
  <rect x="1160" y="504" width="40" height="44" rx="4" fill="#c17e3a" stroke="#2b2117" stroke-width="2"/>
  <rect x="1208" y="504" width="40" height="44" rx="4" fill="#b9a884" stroke="#2b2117" stroke-width="2"/>
  <ellipse cx="1310" cy="528" rx="52" ry="20" fill="#d8a54a" stroke="#2b2117" stroke-width="2"/>
  <path d="M1040,510 V548 M1095,510 V548 M1290,514 V548 M1332,514 V548" stroke="#2b2117" stroke-width="1.5" opacity="0.7" fill="none"/>
  <path d="M866,758 L866,664 L926,652 L962,576 Q966,564 980,564 L1394,564 Q1412,564 1412,582 L1412,740 Q1412,758 1394,758 Z" fill="#5e7245" stroke="#2b2117" stroke-width="2.5"/>
  <rect x="930" y="670" width="478" height="18" fill="#d8a54a"/>
  <path d="M926,652 L926,758" stroke="#2b2117" stroke-width="1.5" opacity="0.4" fill="none"/>
  <polygon points="930,646 964,582 982,582 952,646" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="996" y="586" width="86" height="56" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="1098" y="586" width="86" height="56" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="1200" y="586" width="86" height="56" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="1302" y="586" width="86" height="56" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <path d="M1198,586 V750" stroke="#2b2117" stroke-width="1.5" opacity="0.4" fill="none"/>
  <rect x="1206" y="700" width="20" height="6" fill="#2b2117" opacity="0.7"/>
  <rect x="852" y="722" width="16" height="26" fill="#b9a884" stroke="#2b2117" stroke-width="1.5"/>
  <circle cx="882" cy="696" r="8" fill="#d8a54a" stroke="#2b2117" stroke-width="1.5"/>
  <path d="M920,758 A40,40 0 0 1 1000,758 Z" fill="#2b2117" opacity="0.25"/>
  <path d="M1280,758 A40,40 0 0 1 1360,758 Z" fill="#2b2117" opacity="0.25"/>
  <use href="#roue" x="960" y="750"/>
  <use href="#roue" x="1320" y="750"/>

  <rect x="1580" y="548" width="370" height="6" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="1610" y="554" width="8" height="10" fill="#8a6a45"/>
  <rect x="1760" y="554" width="8" height="10" fill="#8a6a45"/>
  <rect x="1910" y="554" width="8" height="10" fill="#8a6a45"/>
  <rect x="1600" y="516" width="150" height="32" rx="14" fill="#b9a884" stroke="#2b2117" stroke-width="2"/>
  <circle cx="1738" cy="532" r="11" fill="#8a6a45" stroke="#2b2117" stroke-width="1.5"/>
  <ellipse cx="1810" cy="528" rx="48" ry="20" fill="#c17e3a" stroke="#2b2117" stroke-width="2"/>
  <rect x="1876" y="510" width="60" height="38" fill="#d9c9a4" stroke="#2b2117" stroke-width="2"/>
  <path d="M1640,516 V548 M1690,516 V548 M1792,512 V548 M1830,512 V548 M1906,510 V548" stroke="#2b2117" stroke-width="1.5" opacity="0.7" fill="none"/>
  <path d="M1556,758 Q1540,758 1540,740 L1540,582 Q1540,564 1558,564 L1966,564 Q1980,564 1984,574 L2020,650 L2076,662 L2076,758 Z" fill="#8a6a45" stroke="#2b2117" stroke-width="2.5"/>
  <rect x="1548" y="672" width="524" height="18" fill="#d8a54a"/>
  <path d="M2020,650 L2020,758" stroke="#2b2117" stroke-width="1.5" opacity="0.4" fill="none"/>
  <polygon points="1978,582 2012,646 1990,646 1962,582" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="1572" y="586" width="86" height="56" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="1674" y="586" width="86" height="56" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="1776" y="586" width="86" height="56" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="1878" y="586" width="72" height="56" fill="#a8b8c0" stroke="#2b2117" stroke-width="1.5"/>
  <path d="M1774,586 V750" stroke="#2b2117" stroke-width="1.5" opacity="0.4" fill="none"/>
  <rect x="1746" y="700" width="20" height="6" fill="#2b2117" opacity="0.7"/>
  <rect x="2072" y="722" width="16" height="26" fill="#b9a884" stroke="#2b2117" stroke-width="1.5"/>
  <circle cx="2052" cy="698" r="8" fill="#d8a54a" stroke="#2b2117" stroke-width="1.5"/>
  <path d="M1600,758 A40,40 0 0 1 1680,758 Z" fill="#2b2117" opacity="0.25"/>
  <path d="M1956,758 A40,40 0 0 1 2036,758 Z" fill="#2b2117" opacity="0.25"/>
  <use href="#roue" x="1640" y="750"/>
  <use href="#roue" x="1996" y="750"/>

  <ellipse cx="500" cy="762" rx="420" ry="14" fill="#f0e4cc" opacity="0.3"/>
  <ellipse cx="1600" cy="758" rx="460" ry="15" fill="#f0e4cc" opacity="0.25"/>
`;

// --- PLAN SOL : la terre battue de la gare, de y=780 a 1080. C'est la BANDE LIBRE :
// uniquement le sol lui-meme (ornieres, traces de pneus, plaques, lumiere rasante). ---
export const PLAN_SOL = `
  <rect x="-200" y="780" width="2320" height="300" fill="#c3a877"/>
  <rect x="-200" y="780" width="2320" height="5" fill="#ab8f5f" opacity="0.6"/>
  <ellipse cx="300" cy="850" rx="260" ry="26" fill="#ab8f5f" opacity="0.3"/>
  <ellipse cx="1200" cy="920" rx="380" ry="34" fill="#ab8f5f" opacity="0.3"/>
  <ellipse cx="1900" cy="860" rx="240" ry="24" fill="#ab8f5f" opacity="0.28"/>
  <ellipse cx="700" cy="985" rx="300" ry="30" fill="#ab8f5f" opacity="0.25"/>
  <path d="M-200,840 Q400,832 900,842 T2120,836" stroke="#ab8f5f" stroke-width="10" fill="none" opacity="0.7"/>
  <path d="M-200,862 Q400,854 900,864 T2120,858" stroke="#ab8f5f" stroke-width="8" fill="none" opacity="0.6"/>
  <path d="M-200,930 Q500,940 1000,928 T2120,938" stroke="#ab8f5f" stroke-width="12" fill="none" opacity="0.55"/>
  <path d="M-200,952 Q500,962 1000,950 T2120,960" stroke="#ab8f5f" stroke-width="9" fill="none" opacity="0.5"/>
  <path d="M-200,895 Q600,890 1300,898 T2120,892" stroke="#ab8f5f" stroke-width="3" fill="none" opacity="0.5"/>
  <path d="M-200,1000 Q600,994 1300,1002 T2120,996" stroke="#ab8f5f" stroke-width="3" fill="none" opacity="0.45"/>
  <rect x="-200" y="806" width="2320" height="8" fill="#d8a54a" opacity="0.15"/>
  <rect x="-200" y="878" width="2320" height="10" fill="#d8a54a" opacity="0.12"/>
`;

// --- PLAN AVANT (le plus rapide) : bande de terre sombre + ballots, bidons, cageots
// coupes par le bord bas. Tout strictement sous y=1010. ---
export const PLAN_AVANT = `
  <path d="M-200,1026 Q400,1014 900,1022 T2120,1016 L2120,1080 H-200 Z" fill="#ab8f5f"/>
  <path d="M-200,1026 Q400,1014 900,1022 T2120,1016" stroke="#2b2117" stroke-width="2" opacity="0.3" fill="none"/>
  <rect x="-80" y="1014" width="260" height="80" rx="18" fill="#d8a54a" stroke="#2b2117" stroke-width="2.5"/>
  <path d="M0,1014 V1080 M60,1014 V1080 M120,1014 V1080" stroke="#2b2117" stroke-width="2" opacity="0.7" fill="none"/>
  <path d="M-80,1048 H180" stroke="#2b2117" stroke-width="2" opacity="0.7" fill="none"/>
  <ellipse cx="290" cy="1060" rx="110" ry="46" fill="#8a6a45" stroke="#2b2117" stroke-width="2.5"/>
  <path d="M240,1032 Q290,1024 340,1032" stroke="#2b2117" stroke-width="2" opacity="0.6" fill="none"/>
  <rect x="620" y="1018" width="64" height="62" rx="6" fill="#c17e3a" stroke="#2b2117" stroke-width="2.5"/>
  <rect x="628" y="1012" width="16" height="8" fill="#c17e3a" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="652" y="1030" width="22" height="10" rx="4" fill="#2b2117" opacity="0.6"/>
  <rect x="696" y="1018" width="64" height="62" rx="6" fill="#5e7245" stroke="#2b2117" stroke-width="2.5"/>
  <rect x="704" y="1012" width="16" height="8" fill="#5e7245" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="728" y="1030" width="22" height="10" rx="4" fill="#2b2117" opacity="0.6"/>
  <rect x="772" y="1018" width="64" height="62" rx="6" fill="#b9a884" stroke="#2b2117" stroke-width="2.5"/>
  <rect x="780" y="1012" width="16" height="8" fill="#b9a884" stroke="#2b2117" stroke-width="1.5"/>
  <rect x="804" y="1030" width="22" height="10" rx="4" fill="#2b2117" opacity="0.6"/>
  <rect x="950" y="1030" width="170" height="50" rx="22" fill="#d9c9a4" stroke="#2b2117" stroke-width="2.5"/>
  <circle cx="1100" cy="1055" r="16" fill="#b9a884" stroke="#2b2117" stroke-width="2"/>
  <rect x="1180" y="1016" width="170" height="64" fill="#8a6a45" stroke="#2b2117" stroke-width="2.5"/>
  <rect x="1192" y="1022" width="20" height="52" fill="#d9c9a4" opacity="0.8"/>
  <rect x="1226" y="1022" width="20" height="52" fill="#d9c9a4" opacity="0.8"/>
  <rect x="1260" y="1022" width="20" height="52" fill="#d9c9a4" opacity="0.8"/>
  <rect x="1294" y="1022" width="20" height="52" fill="#d9c9a4" opacity="0.8"/>
  <rect x="1328" y="1022" width="16" height="52" fill="#d9c9a4" opacity="0.8"/>
  <rect x="1370" y="1024" width="150" height="56" fill="#b9a884" stroke="#2b2117" stroke-width="2.5"/>
  <rect x="1382" y="1030" width="18" height="44" fill="#d9c9a4" opacity="0.7"/>
  <rect x="1414" y="1030" width="18" height="44" fill="#d9c9a4" opacity="0.7"/>
  <rect x="1446" y="1030" width="18" height="44" fill="#d9c9a4" opacity="0.7"/>
  <rect x="1478" y="1030" width="18" height="44" fill="#d9c9a4" opacity="0.7"/>
  <rect x="1780" y="1012" width="300" height="68" rx="16" fill="#b9a884" stroke="#2b2117" stroke-width="2.5"/>
  <path d="M1850,1012 V1080 M1930,1012 V1080 M2010,1012 V1080" stroke="#2b2117" stroke-width="2" opacity="0.7" fill="none"/>
  <path d="M1780,1044 H2080" stroke="#2b2117" stroke-width="2" opacity="0.7" fill="none"/>
  <ellipse cx="2100" cy="1058" rx="90" ry="42" fill="#c17e3a" stroke="#2b2117" stroke-width="2.5"/>
`;
