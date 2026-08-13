// Groupes SVG de la scene "marche de nuit ouest-africain, eclaire aux lampes".
// Decor de PARALLAXE en 6 plans, du fond vers l'avant :
//   PLAN_CIEL -> PLAN_VILLE -> PLAN_ETALS_FOND -> PLAN_ETALS -> PLAN_SOL -> PLAN_AVANT
// Chaque constante contient le CONTENU INTERNE d'un <g> (sans la balise <g> externe) :
// cote React, chaque plan est injecte dans un wrapper <g transform> anime par frame
// (doctrine SVG : innerHTML n'anime pas les <g> internes).
//
// Reperes de composition (viewBox 0 0 1920 1080, dessin de x=-200 a x=2120) :
//   - ligne d'horizon franche a y=600 (base des batiments de la ville)
//   - BANDE DE SOL LIBRE entre y=780 et y=1010 : reservee aux personnages ajoutes
//     par code. AUCUN objet n'y est dessine, seulement la terre battue et les
//     flaques de lumiere PLATES projetees au sol (PLAN_SOL).
//   - les etals posent leurs pieds EXACTEMENT a y=780, rien dessous
//   - objets du PLAN_AVANT strictement sous y=1010
// Palette verrouillee nuit + lumiere chaude, remplissages PLATS, contours encre #12100c.
// Seuls les halos de lampe utilisent un radialGradient (c'est le sujet). Aucun filtre.
// Zero personnage, zero animal, zero texte.

export const DEFS = `
  <radialGradient id="gHalo" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#ffd98a" stop-opacity="0.85"/>
    <stop offset="0.45" stop-color="#ffd98a" stop-opacity="0.32"/>
    <stop offset="1" stop-color="#ffd98a" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="gHaloFaible" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#ffd98a" stop-opacity="0.45"/>
    <stop offset="0.5" stop-color="#ffd98a" stop-opacity="0.16"/>
    <stop offset="1" stop-color="#ffd98a" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="gFlaque" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#6b5836" stop-opacity="0.95"/>
    <stop offset="0.55" stop-color="#6b5836" stop-opacity="0.45"/>
    <stop offset="1" stop-color="#6b5836" stop-opacity="0"/>
  </radialGradient>
`;

// --- PLAN CIEL (le plus lent) : nuit franche, ciel plus clair pres de l'horizon,
// quelques etoiles et un banc de nuage sombre. Rien sous y=620. ---
export const PLAN_CIEL = `
  <rect x="-200" y="-60" width="2320" height="500" fill="#1a2238"/>
  <rect x="-200" y="440" width="2320" height="180" fill="#2b3654"/>
  <path d="M-200,440 Q300,414 800,432 Q1400,452 2120,428 L2120,448 Q1400,472 800,452 Q300,434 -200,460 Z" fill="#1a2238" opacity="0.8"/>
  <g fill="#f0c060" opacity="0.55">
    <circle cx="140" cy="118" r="3"/>
    <circle cx="356" cy="72" r="2.5"/>
    <circle cx="512" cy="176" r="3"/>
    <circle cx="742" cy="96" r="2.5"/>
    <circle cx="908" cy="204" r="3"/>
    <circle cx="1134" cy="88" r="2.5"/>
    <circle cx="1318" cy="182" r="3"/>
    <circle cx="1520" cy="110" r="2.5"/>
    <circle cx="1742" cy="196" r="3"/>
    <circle cx="1908" cy="132" r="2.5"/>
    <circle cx="-80" cy="164" r="2.5"/>
    <circle cx="2040" cy="88" r="3"/>
  </g>
  <path d="M180,300 Q420,278 700,290 Q540,312 320,314 Q230,312 180,300 Z" fill="#141b2e" opacity="0.75"/>
  <path d="M1180,246 Q1440,228 1720,240 Q1560,262 1320,264 Q1230,262 1180,246 Z" fill="#141b2e" opacity="0.7"/>
  <path d="M-60,376 Q180,358 420,368 Q270,388 80,390 Q0,386 -60,376 Z" fill="#141b2e" opacity="0.6"/>
`;

// --- PLAN VILLE : silhouettes franches de batiments posees sur l'horizon y=600,
// quelques fenetres allumees. Masse pleine jusqu'a y=780, rien dessous. ---
export const PLAN_VILLE = `
  <rect x="-200" y="600" width="2320" height="180" fill="#141b2e"/>
  <g fill="#141b2e">
    <rect x="-200" y="486" width="180" height="118"/>
    <rect x="-30" y="524" width="140" height="80"/>
    <rect x="130" y="462" width="112" height="142"/>
    <rect x="262" y="512" width="164" height="92"/>
    <rect x="446" y="440" width="96" height="164"/>
    <rect x="562" y="506" width="132" height="98"/>
    <rect x="714" y="470" width="118" height="134"/>
    <rect x="852" y="530" width="150" height="74"/>
    <rect x="1022" y="452" width="104" height="152"/>
    <rect x="1146" y="516" width="140" height="88"/>
    <rect x="1306" y="482" width="122" height="122"/>
    <rect x="1448" y="534" width="158" height="70"/>
    <rect x="1626" y="466" width="110" height="138"/>
    <rect x="1756" y="518" width="146" height="86"/>
    <rect x="1922" y="476" width="118" height="128"/>
    <rect x="2060" y="524" width="60" height="80"/>
  </g>
  <g fill="#141b2e">
    <rect x="176" y="424" width="20" height="42"/>
    <rect x="486" y="396" width="16" height="48"/>
    <rect x="1062" y="410" width="18" height="46"/>
    <rect x="1668" y="428" width="16" height="42"/>
    <path d="M760,470 L772,436 L784,470 Z"/>
    <path d="M1352,482 L1366,448 L1380,482 Z"/>
  </g>
  <path d="M-200,600 H2120" stroke="#12100c" stroke-width="2" fill="none" opacity="0.5"/>
  <g fill="#f0c060">
    <rect x="-160" y="512" width="14" height="18"/>
    <rect x="-120" y="548" width="14" height="18"/>
    <rect x="20" y="552" width="12" height="16"/>
    <rect x="72" y="552" width="12" height="16"/>
    <rect x="152" y="492" width="14" height="20"/>
    <rect x="152" y="536" width="14" height="20"/>
    <rect x="200" y="492" width="14" height="20"/>
    <rect x="296" y="538" width="16" height="18"/>
    <rect x="360" y="538" width="16" height="18"/>
    <rect x="384" y="574" width="16" height="18"/>
    <rect x="466" y="470" width="14" height="20"/>
    <rect x="466" y="518" width="14" height="20"/>
    <rect x="508" y="566" width="14" height="20"/>
    <rect x="592" y="532" width="16" height="18"/>
    <rect x="648" y="532" width="16" height="18"/>
    <rect x="620" y="570" width="16" height="18"/>
    <rect x="736" y="498" width="14" height="20"/>
    <rect x="782" y="498" width="14" height="20"/>
    <rect x="736" y="548" width="14" height="20"/>
    <rect x="884" y="556" width="18" height="18"/>
    <rect x="946" y="556" width="18" height="18"/>
    <rect x="1044" y="480" width="14" height="20"/>
    <rect x="1044" y="528" width="14" height="20"/>
    <rect x="1090" y="528" width="14" height="20"/>
    <rect x="1174" y="542" width="16" height="18"/>
    <rect x="1236" y="542" width="16" height="18"/>
    <rect x="1204" y="576" width="16" height="18"/>
    <rect x="1330" y="508" width="14" height="20"/>
    <rect x="1380" y="508" width="14" height="20"/>
    <rect x="1330" y="556" width="14" height="20"/>
    <rect x="1484" y="560" width="18" height="18"/>
    <rect x="1548" y="560" width="18" height="18"/>
    <rect x="1650" y="492" width="14" height="20"/>
    <rect x="1650" y="540" width="14" height="20"/>
    <rect x="1698" y="540" width="14" height="20"/>
    <rect x="1788" y="544" width="16" height="18"/>
    <rect x="1852" y="544" width="16" height="18"/>
    <rect x="1820" y="578" width="16" height="18"/>
    <rect x="1944" y="502" width="14" height="20"/>
    <rect x="1994" y="502" width="14" height="20"/>
    <rect x="1944" y="550" width="14" height="20"/>
    <rect x="2076" y="552" width="16" height="18"/>
  </g>
`;

// --- PLAN ETALS_FOND : rangee d'etals eloignes, plus sombres et plus petits.
// Baches assombries, ampoules faibles. Pieds jusqu'a y=780 STRICTEMENT, pas plus bas. ---
export const PLAN_ETALS_FOND = `
  <g fill="url(#gHaloFaible)">
    <ellipse cx="-60" cy="662" rx="130" ry="110"/>
    <ellipse cx="248" cy="656" rx="140" ry="116"/>
    <ellipse cx="612" cy="662" rx="132" ry="110"/>
    <ellipse cx="968" cy="652" rx="144" ry="118"/>
    <ellipse cx="1320" cy="660" rx="134" ry="112"/>
    <ellipse cx="1660" cy="654" rx="142" ry="116"/>
    <ellipse cx="2000" cy="662" rx="130" ry="108"/>
  </g>
  <g stroke="#12100c" stroke-width="1.5">
    <path d="M-200,646 L-140,608 L20,608 L80,646 Z" fill="#4a3a28"/>
    <rect x="-150" y="646" width="180" height="8" fill="#4a3a28"/>
    <rect x="-136" y="654" width="6" height="126" fill="#4a3a28"/>
    <rect x="6" y="654" width="6" height="126" fill="#4a3a28"/>
    <rect x="-152" y="706" width="176" height="10" fill="#4a3a28"/>
    <rect x="-146" y="686" width="52" height="20" fill="#c17e3a"/>
    <rect x="-84" y="688" width="46" height="18" fill="#5e7245"/>
    <rect x="-28" y="686" width="46" height="20" fill="#8a2b2b"/>
  </g>
  <g stroke="#12100c" stroke-width="1.5">
    <path d="M136,650 L206,606 L370,606 L440,650 Z" fill="#6b5a44" opacity="0.55"/>
    <rect x="146" y="650" width="284" height="8" fill="#4a3a28"/>
    <rect x="152" y="658" width="6" height="122" fill="#4a3a28"/>
    <rect x="416" y="658" width="6" height="122" fill="#4a3a28"/>
    <rect x="144" y="712" width="288" height="10" fill="#4a3a28"/>
    <rect x="156" y="690" width="56" height="22" fill="#c17e3a"/>
    <rect x="222" y="692" width="50" height="20" fill="#d8a54a"/>
    <rect x="282" y="690" width="54" height="22" fill="#5e7245"/>
    <rect x="346" y="692" width="48" height="20" fill="#8a2b2b"/>
    <circle cx="288" cy="622" r="7" fill="#fff3c9"/>
    <path d="M288,606 V615" stroke="#4a3a28" stroke-width="2"/>
  </g>
  <g stroke="#12100c" stroke-width="1.5">
    <path d="M500,652 L562,610 L714,610 L776,652 Z" fill="#7d5f3c" opacity="0.5"/>
    <rect x="510" y="652" width="256" height="8" fill="#4a3a28"/>
    <rect x="516" y="660" width="6" height="120" fill="#4a3a28"/>
    <rect x="752" y="660" width="6" height="120" fill="#4a3a28"/>
    <rect x="508" y="714" width="260" height="10" fill="#4a3a28"/>
    <rect x="520" y="692" width="52" height="22" fill="#5e7245"/>
    <rect x="582" y="694" width="48" height="20" fill="#c17e3a"/>
    <rect x="640" y="692" width="52" height="22" fill="#a8b8c0"/>
    <rect x="702" y="694" width="46" height="20" fill="#d8a54a"/>
    <circle cx="640" cy="626" r="7" fill="#fff3c9"/>
    <path d="M640,610 V619" stroke="#4a3a28" stroke-width="2"/>
  </g>
  <g stroke="#12100c" stroke-width="1.5">
    <path d="M852,646 L920,602 L1084,602 L1152,646 Z" fill="#6b5a44" opacity="0.55"/>
    <rect x="862" y="646" width="280" height="8" fill="#4a3a28"/>
    <rect x="868" y="654" width="6" height="126" fill="#4a3a28"/>
    <rect x="1128" y="654" width="6" height="126" fill="#4a3a28"/>
    <rect x="860" y="710" width="284" height="10" fill="#4a3a28"/>
    <rect x="872" y="686" width="54" height="24" fill="#8a2b2b"/>
    <rect x="936" y="688" width="50" height="22" fill="#c17e3a"/>
    <rect x="996" y="686" width="52" height="24" fill="#5e7245"/>
    <rect x="1058" y="688" width="48" height="22" fill="#d8a54a"/>
    <circle cx="1002" cy="618" r="8" fill="#fff3c9"/>
    <path d="M1002,602 V611" stroke="#4a3a28" stroke-width="2"/>
  </g>
  <g stroke="#12100c" stroke-width="1.5">
    <path d="M1210,650 L1272,608 L1420,608 L1482,650 Z" fill="#7d5f3c" opacity="0.5"/>
    <rect x="1220" y="650" width="252" height="8" fill="#4a3a28"/>
    <rect x="1226" y="658" width="6" height="122" fill="#4a3a28"/>
    <rect x="1458" y="658" width="6" height="122" fill="#4a3a28"/>
    <rect x="1218" y="712" width="256" height="10" fill="#4a3a28"/>
    <rect x="1230" y="690" width="50" height="22" fill="#d8a54a"/>
    <rect x="1290" y="692" width="48" height="20" fill="#5e7245"/>
    <rect x="1348" y="690" width="50" height="22" fill="#c17e3a"/>
    <rect x="1408" y="692" width="46" height="20" fill="#a8b8c0"/>
    <circle cx="1346" cy="624" r="7" fill="#fff3c9"/>
    <path d="M1346,608 V617" stroke="#4a3a28" stroke-width="2"/>
  </g>
  <g stroke="#12100c" stroke-width="1.5">
    <path d="M1546,648 L1612,604 L1772,604 L1838,648 Z" fill="#6b5a44" opacity="0.55"/>
    <rect x="1556" y="648" width="272" height="8" fill="#4a3a28"/>
    <rect x="1562" y="656" width="6" height="124" fill="#4a3a28"/>
    <rect x="1816" y="656" width="6" height="124" fill="#4a3a28"/>
    <rect x="1554" y="710" width="276" height="10" fill="#4a3a28"/>
    <rect x="1566" y="688" width="54" height="22" fill="#c17e3a"/>
    <rect x="1630" y="690" width="48" height="20" fill="#8a2b2b"/>
    <rect x="1688" y="688" width="52" height="22" fill="#5e7245"/>
    <rect x="1750" y="690" width="48" height="20" fill="#d8a54a"/>
    <circle cx="1692" cy="620" r="8" fill="#fff3c9"/>
    <path d="M1692,604 V613" stroke="#4a3a28" stroke-width="2"/>
  </g>
  <g stroke="#12100c" stroke-width="1.5">
    <path d="M1900,652 L1962,610 L2120,610 L2120,652 Z" fill="#7d5f3c" opacity="0.5"/>
    <rect x="1910" y="652" width="210" height="8" fill="#4a3a28"/>
    <rect x="1916" y="660" width="6" height="120" fill="#4a3a28"/>
    <rect x="2098" y="660" width="6" height="120" fill="#4a3a28"/>
    <rect x="1908" y="714" width="212" height="10" fill="#4a3a28"/>
    <rect x="1920" y="692" width="52" height="22" fill="#5e7245"/>
    <rect x="1982" y="694" width="48" height="20" fill="#c17e3a"/>
    <rect x="2040" y="692" width="52" height="22" fill="#d8a54a"/>
    <circle cx="2010" cy="626" r="7" fill="#fff3c9"/>
    <path d="M2010,610 V619" stroke="#4a3a28" stroke-width="2"/>
  </g>
`;

// --- PLAN ETALS : le coeur du decor. Rangee principale d'etals sous baches tendues,
// ampoules nues et lampes tempete, marchandises empilees, bassines emaillees.
// Tous les pieds de tables s'arretent EXACTEMENT a y=780. ---
export const PLAN_ETALS = `
  <g fill="url(#gHalo)">
    <ellipse cx="-90" cy="640" rx="190" ry="138"/>
    <ellipse cx="300" cy="628" rx="210" ry="150"/>
    <ellipse cx="760" cy="636" rx="200" ry="142"/>
    <ellipse cx="1180" cy="624" rx="215" ry="154"/>
    <ellipse cx="1600" cy="634" rx="205" ry="144"/>
    <ellipse cx="2010" cy="640" rx="190" ry="138"/>
  </g>

  <g stroke="#12100c" stroke-width="2.5">
    <path d="M-200,596 Q-140,556 -60,552 Q30,548 96,596 L84,608 Q20,566 -56,570 Q-136,574 -190,610 Z" fill="#6b5a44"/>
    <rect x="-196" y="596" width="290" height="12" fill="#7d5f3c"/>
    <rect x="-172" y="608" width="8" height="60" fill="#4a3a28"/>
    <rect x="62" y="608" width="8" height="60" fill="#4a3a28"/>
    <rect x="-196" y="668" width="292" height="16" fill="#4a3a28"/>
    <rect x="-186" y="684" width="10" height="96" fill="#4a3a28"/>
    <rect x="72" y="684" width="10" height="96" fill="#4a3a28"/>
    <rect x="-186" y="726" width="268" height="8" fill="#4a3a28"/>
    <rect x="-178" y="628" width="68" height="40" fill="#8a2b2b"/>
    <rect x="-98" y="634" width="60" height="34" fill="#c17e3a"/>
    <rect x="-26" y="628" width="66" height="40" fill="#5e7245"/>
    <rect x="52" y="638" width="40" height="30" fill="#d8a54a"/>
    <ellipse cx="-140" cy="700" rx="46" ry="18" fill="#a8b8c0"/>
    <ellipse cx="-20" cy="702" rx="40" ry="16" fill="#a8b8c0"/>
  </g>
  <circle cx="-56" cy="560" r="11" fill="#fff3c9" stroke="#12100c" stroke-width="2"/>
  <path d="M-56,540 V549" stroke="#4a3a28" stroke-width="3" fill="none"/>

  <g stroke="#12100c" stroke-width="2.5">
    <path d="M104,586 Q210,532 330,528 Q456,524 546,586 L532,600 Q446,548 330,552 Q212,556 118,602 Z" fill="#7d5f3c"/>
    <rect x="108" y="586" width="440" height="14" fill="#6b5a44"/>
    <rect x="134" y="600" width="8" height="64" fill="#4a3a28"/>
    <rect x="510" y="600" width="8" height="64" fill="#4a3a28"/>
    <rect x="106" y="664" width="444" height="18" fill="#4a3a28"/>
    <rect x="122" y="682" width="12" height="98" fill="#4a3a28"/>
    <rect x="518" y="682" width="12" height="98" fill="#4a3a28"/>
    <rect x="122" y="726" width="408" height="8" fill="#4a3a28"/>
    <rect x="126" y="620" width="86" height="44" fill="#c17e3a"/>
    <rect x="224" y="628" width="76" height="36" fill="#d8a54a"/>
    <rect x="312" y="616" width="88" height="48" fill="#5e7245"/>
    <rect x="412" y="626" width="80" height="38" fill="#8a2b2b"/>
    <path d="M126,620 h86 M224,628 h76 M312,616 h88 M412,626 h80" stroke="#12100c" stroke-width="2" fill="none"/>
    <ellipse cx="184" cy="700" rx="54" ry="20" fill="#a8b8c0"/>
    <ellipse cx="312" cy="702" rx="50" ry="18" fill="#a8b8c0"/>
    <ellipse cx="442" cy="700" rx="52" ry="20" fill="#a8b8c0"/>
    <path d="M138,700 H230 M264,702 H360 M394,700 H490" stroke="#12100c" stroke-width="2" fill="none"/>
  </g>
  <circle cx="238" cy="546" r="13" fill="#fff3c9" stroke="#12100c" stroke-width="2"/>
  <path d="M238,524 V533" stroke="#4a3a28" stroke-width="3" fill="none"/>
  <circle cx="420" cy="552" r="12" fill="#fff3c9" stroke="#12100c" stroke-width="2"/>
  <path d="M420,530 V540" stroke="#4a3a28" stroke-width="3" fill="none"/>
  <g stroke="#12100c" stroke-width="2">
    <rect x="466" y="614" width="34" height="40" rx="4" fill="#d8a54a"/>
    <rect x="474" y="622" width="18" height="24" fill="#fff3c9"/>
    <path d="M470,614 q13,-14 26,0" fill="#4a3a28"/>
  </g>

  <g stroke="#12100c" stroke-width="2.5">
    <path d="M562,592 Q668,542 786,538 Q908,534 992,592 L978,606 Q898,558 786,562 Q670,566 576,608 Z" fill="#6b5a44"/>
    <rect x="566" y="592" width="424" height="14" fill="#7d5f3c"/>
    <rect x="592" y="606" width="8" height="62" fill="#4a3a28"/>
    <rect x="956" y="606" width="8" height="62" fill="#4a3a28"/>
    <rect x="564" y="668" width="428" height="18" fill="#4a3a28"/>
    <rect x="580" y="686" width="12" height="94" fill="#4a3a28"/>
    <rect x="960" y="686" width="12" height="94" fill="#4a3a28"/>
    <rect x="580" y="730" width="392" height="8" fill="#4a3a28"/>
    <rect x="584" y="628" width="84" height="40" fill="#5e7245"/>
    <rect x="680" y="620" width="78" height="48" fill="#8a2b2b"/>
    <rect x="770" y="630" width="86" height="38" fill="#c17e3a"/>
    <rect x="868" y="622" width="80" height="46" fill="#d8a54a"/>
    <path d="M584,628 h84 M680,620 h78 M770,630 h86 M868,622 h80" stroke="#12100c" stroke-width="2" fill="none"/>
    <ellipse cx="642" cy="704" rx="52" ry="20" fill="#a8b8c0"/>
    <ellipse cx="774" cy="706" rx="48" ry="18" fill="#a8b8c0"/>
    <ellipse cx="898" cy="704" rx="52" ry="20" fill="#a8b8c0"/>
  </g>
  <circle cx="700" cy="556" r="13" fill="#fff3c9" stroke="#12100c" stroke-width="2"/>
  <path d="M700,534 V543" stroke="#4a3a28" stroke-width="3" fill="none"/>
  <circle cx="880" cy="562" r="11" fill="#fff3c9" stroke="#12100c" stroke-width="2"/>
  <path d="M880,540 V551" stroke="#4a3a28" stroke-width="3" fill="none"/>
  <g stroke="#12100c" stroke-width="2">
    <rect x="906" y="618" width="32" height="38" rx="4" fill="#c17e3a"/>
    <rect x="913" y="626" width="18" height="22" fill="#fff3c9"/>
    <path d="M910,618 q12,-13 24,0" fill="#4a3a28"/>
  </g>

  <g stroke="#12100c" stroke-width="2.5">
    <path d="M1006,580 Q1120,524 1248,520 Q1378,516 1466,580 L1452,594 Q1368,540 1248,544 Q1122,548 1020,596 Z" fill="#7d5f3c"/>
    <rect x="1010" y="580" width="458" height="14" fill="#6b5a44"/>
    <rect x="1036" y="594" width="8" height="70" fill="#4a3a28"/>
    <rect x="1432" y="594" width="8" height="70" fill="#4a3a28"/>
    <rect x="1008" y="664" width="462" height="18" fill="#4a3a28"/>
    <rect x="1024" y="682" width="12" height="98" fill="#4a3a28"/>
    <rect x="1440" y="682" width="12" height="98" fill="#4a3a28"/>
    <rect x="1024" y="726" width="428" height="8" fill="#4a3a28"/>
    <rect x="1028" y="614" width="90" height="50" fill="#8a2b2b"/>
    <rect x="1130" y="622" width="82" height="42" fill="#d8a54a"/>
    <rect x="1224" y="610" width="94" height="54" fill="#c17e3a"/>
    <rect x="1330" y="620" width="86" height="44" fill="#5e7245"/>
    <path d="M1028,614 h90 M1130,622 h82 M1224,610 h94 M1330,620 h86" stroke="#12100c" stroke-width="2" fill="none"/>
    <ellipse cx="1092" cy="700" rx="56" ry="20" fill="#a8b8c0"/>
    <ellipse cx="1234" cy="702" rx="52" ry="18" fill="#a8b8c0"/>
    <ellipse cx="1376" cy="700" rx="56" ry="20" fill="#a8b8c0"/>
    <path d="M1042,700 H1142 M1186,702 H1282 M1326,700 H1426" stroke="#12100c" stroke-width="2" fill="none"/>
  </g>
  <circle cx="1140" cy="538" r="14" fill="#fff3c9" stroke="#12100c" stroke-width="2"/>
  <path d="M1140,514 V524" stroke="#4a3a28" stroke-width="3" fill="none"/>
  <circle cx="1348" cy="544" r="12" fill="#fff3c9" stroke="#12100c" stroke-width="2"/>
  <path d="M1348,520 V531" stroke="#4a3a28" stroke-width="3" fill="none"/>

  <g stroke="#12100c" stroke-width="2.5">
    <path d="M1482,590 Q1590,538 1712,534 Q1838,530 1924,590 L1910,604 Q1828,554 1712,558 Q1592,562 1496,606 Z" fill="#6b5a44"/>
    <rect x="1486" y="590" width="440" height="14" fill="#7d5f3c"/>
    <rect x="1512" y="604" width="8" height="62" fill="#4a3a28"/>
    <rect x="1892" y="604" width="8" height="62" fill="#4a3a28"/>
    <rect x="1484" y="666" width="444" height="18" fill="#4a3a28"/>
    <rect x="1500" y="684" width="12" height="96" fill="#4a3a28"/>
    <rect x="1896" y="684" width="12" height="96" fill="#4a3a28"/>
    <rect x="1500" y="728" width="408" height="8" fill="#4a3a28"/>
    <rect x="1504" y="626" width="86" height="40" fill="#d8a54a"/>
    <rect x="1602" y="618" width="80" height="48" fill="#5e7245"/>
    <rect x="1694" y="628" width="88" height="38" fill="#8a2b2b"/>
    <rect x="1794" y="620" width="84" height="46" fill="#c17e3a"/>
    <path d="M1504,626 h86 M1602,618 h80 M1694,628 h88 M1794,620 h84" stroke="#12100c" stroke-width="2" fill="none"/>
    <ellipse cx="1566" cy="702" rx="52" ry="20" fill="#a8b8c0"/>
    <ellipse cx="1700" cy="704" rx="48" ry="18" fill="#a8b8c0"/>
    <ellipse cx="1830" cy="702" rx="52" ry="20" fill="#a8b8c0"/>
  </g>
  <circle cx="1620" cy="552" r="13" fill="#fff3c9" stroke="#12100c" stroke-width="2"/>
  <path d="M1620,530 V539" stroke="#4a3a28" stroke-width="3" fill="none"/>
  <circle cx="1808" cy="558" r="11" fill="#fff3c9" stroke="#12100c" stroke-width="2"/>
  <path d="M1808,536 V547" stroke="#4a3a28" stroke-width="3" fill="none"/>
  <g stroke="#12100c" stroke-width="2">
    <rect x="1400" y="616" width="34" height="40" rx="4" fill="#d8a54a"/>
    <rect x="1408" y="624" width="18" height="24" fill="#fff3c9"/>
    <path d="M1404,616 q13,-14 26,0" fill="#4a3a28"/>
  </g>

  <g stroke="#12100c" stroke-width="2.5">
    <path d="M1940,596 Q2010,552 2120,548 L2120,566 Q2016,570 1952,610 Z" fill="#7d5f3c"/>
    <rect x="1944" y="596" width="176" height="12" fill="#6b5a44"/>
    <rect x="1966" y="608" width="8" height="60" fill="#4a3a28"/>
    <rect x="2100" y="608" width="8" height="60" fill="#4a3a28"/>
    <rect x="1942" y="668" width="178" height="16" fill="#4a3a28"/>
    <rect x="1956" y="684" width="10" height="96" fill="#4a3a28"/>
    <rect x="2098" y="684" width="10" height="96" fill="#4a3a28"/>
    <rect x="1956" y="726" width="152" height="8" fill="#4a3a28"/>
    <rect x="1950" y="630" width="70" height="38" fill="#c17e3a"/>
    <rect x="2032" y="624" width="76" height="44" fill="#5e7245"/>
    <ellipse cx="2000" cy="700" rx="48" ry="18" fill="#a8b8c0"/>
  </g>
  <circle cx="2040" cy="562" r="12" fill="#fff3c9" stroke="#12100c" stroke-width="2"/>
  <path d="M2040,540 V551" stroke="#4a3a28" stroke-width="3" fill="none"/>

  <path d="M-200,548 Q160,514 520,530 Q880,546 1240,516 Q1600,486 2120,512" stroke="#4a3a28" stroke-width="2.5" fill="none"/>
`;

// --- PLAN SOL : la terre battue de nuit + les flaques de lumiere PLATES projetees
// par les lampes des etals. C'est la BANDE LIBRE y=780..1010 : rien d'autre ici. ---
export const PLAN_SOL = `
  <rect x="-200" y="780" width="2320" height="300" fill="#3a3020"/>
  <path d="M-200,780 H2120" stroke="#12100c" stroke-width="2" fill="none" opacity="0.55"/>
  <g fill="url(#gFlaque)">
    <ellipse cx="-60" cy="856" rx="230" ry="70"/>
    <ellipse cx="300" cy="864" rx="300" ry="80"/>
    <ellipse cx="760" cy="858" rx="280" ry="74"/>
    <ellipse cx="1180" cy="868" rx="310" ry="82"/>
    <ellipse cx="1600" cy="860" rx="285" ry="76"/>
    <ellipse cx="2010" cy="856" rx="230" ry="70"/>
  </g>
  <g fill="#6b5836" opacity="0.55">
    <ellipse cx="-56" cy="828" rx="96" ry="24"/>
    <ellipse cx="238" cy="834" rx="112" ry="28"/>
    <ellipse cx="420" cy="830" rx="92" ry="24"/>
    <ellipse cx="700" cy="836" rx="108" ry="28"/>
    <ellipse cx="880" cy="832" rx="88" ry="22"/>
    <ellipse cx="1140" cy="842" rx="120" ry="30"/>
    <ellipse cx="1348" cy="836" rx="96" ry="24"/>
    <ellipse cx="1620" cy="834" rx="110" ry="28"/>
    <ellipse cx="1808" cy="830" rx="90" ry="22"/>
    <ellipse cx="2040" cy="832" rx="92" ry="24"/>
  </g>
  <g stroke="#6b5836" stroke-width="2" fill="none" opacity="0.3">
    <path d="M-200,908 Q300,898 800,906 T2120,900"/>
    <path d="M-200,952 Q400,944 900,952 T2120,946"/>
    <path d="M-120,994 Q480,986 1020,994 T2120,988"/>
  </g>
  <g fill="#12100c" opacity="0.28">
    <ellipse cx="120" cy="922" rx="34" ry="8"/>
    <ellipse cx="540" cy="962" rx="42" ry="9"/>
    <ellipse cx="960" cy="930" rx="30" ry="7"/>
    <ellipse cx="1420" cy="972" rx="46" ry="10"/>
    <ellipse cx="1880" cy="936" rx="36" ry="8"/>
  </g>
`;

// --- PLAN AVANT (le plus rapide) : cageots, bassines empilees et sacs, tous
// STRICTEMENT sous y=1010. Silhouettes tres sombres, contre-jour de nuit. ---
export const PLAN_AVANT = `
  <rect x="-200" y="1010" width="2320" height="70" fill="#12100c" opacity="0.35"/>
  <g stroke="#12100c" stroke-width="2.5">
    <rect x="-180" y="1018" width="200" height="62" fill="#4a3a28"/>
    <path d="M-180,1040 H20 M-130,1018 V1080 M-70,1018 V1080 M-10,1018 V1080" stroke="#12100c" stroke-width="2" fill="none"/>
    <rect x="40" y="1030" width="170" height="50" fill="#5e7245"/>
    <path d="M40,1052 H210 M90,1030 V1080 M150,1030 V1080" stroke="#12100c" stroke-width="2" fill="none"/>
    <path d="M250,1080 Q244,1026 300,1016 Q356,1026 350,1080 Z" fill="#4a3a28"/>
    <path d="M262,1044 Q300,1034 338,1044" stroke="#12100c" stroke-width="2" fill="none"/>
    <ellipse cx="470" cy="1034" rx="110" ry="22" fill="#a8b8c0"/>
    <ellipse cx="470" cy="1034" rx="72" ry="14" fill="#12100c" opacity="0.35"/>
    <ellipse cx="470" cy="1060" rx="118" ry="24" fill="#a8b8c0"/>
    <rect x="620" y="1024" width="190" height="56" fill="#c17e3a"/>
    <path d="M620,1050 H810 M672,1024 V1080 M736,1024 V1080" stroke="#12100c" stroke-width="2" fill="none"/>
    <path d="M860,1080 Q852,1022 920,1014 Q988,1022 980,1080 Z" fill="#4a3a28"/>
    <path d="M872,1042 Q920,1030 968,1042" stroke="#12100c" stroke-width="2" fill="none"/>
    <rect x="1030" y="1032" width="180" height="48" fill="#8a2b2b"/>
    <path d="M1030,1056 H1210 M1084,1032 V1080 M1148,1032 V1080" stroke="#12100c" stroke-width="2" fill="none"/>
    <ellipse cx="1330" cy="1036" rx="104" ry="20" fill="#a8b8c0"/>
    <ellipse cx="1330" cy="1036" rx="68" ry="13" fill="#12100c" opacity="0.35"/>
    <ellipse cx="1330" cy="1066" rx="112" ry="22" fill="#a8b8c0"/>
    <path d="M1450,1080 Q1442,1024 1508,1016 Q1574,1024 1566,1080 Z" fill="#4a3a28"/>
    <path d="M1462,1044 Q1508,1032 1554,1044" stroke="#12100c" stroke-width="2" fill="none"/>
    <rect x="1620" y="1022" width="196" height="58" fill="#5e7245"/>
    <path d="M1620,1048 H1816 M1674,1022 V1080 M1740,1022 V1080" stroke="#12100c" stroke-width="2" fill="none"/>
    <rect x="1856" y="1034" width="180" height="46" fill="#d8a54a"/>
    <path d="M1856,1056 H2036 M1910,1034 V1080 M1974,1034 V1080" stroke="#12100c" stroke-width="2" fill="none"/>
    <path d="M2060,1080 Q2054,1028 2110,1020 Q2120,1022 2120,1080 Z" fill="#4a3a28"/>
  </g>
  <rect x="-200" y="1010" width="2320" height="10" fill="#12100c" opacity="0.5"/>
`;
