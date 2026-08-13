// Groupes SVG de la scene "marche de nuit ouest-africain eclaire aux lampes".
// Decor en PARALLAXE pour 1920x1080 : chaque plan est une string SVG injectee
// dans un wrapper <g transform> anime cote React (meme doctrine que
// fable-svg/villageParallaxeGroups.ts : le contenu interne des plans est stocke
// ici, l'animation du glissement horizontal est faite par frame en JSX).
//
// Ordre de rendu, du fond vers l'avant :
//   PLAN_CIEL -> PLAN_VILLE -> PLAN_ETALS_FOND -> PLAN_ETALS -> PLAN_SOL -> PLAN_AVANT
//
// Contraintes respectees :
// - chaque plan couvre x=-200 a 2120 (glissement sans vide) ;
// - bande de sol LIBRE entre y=780 et y=1010 (rien d'autre que le sol et les
//   flaques de lumiere plates, qui font partie du sol) ;
// - aucun personnage, aucun animal ;
// - remplissages plats, seuls les halos de lampes utilisent un radialGradient.

export const DEFS = `
  <radialGradient id="gHaloBulb" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#ffd98a" stop-opacity="0.8"/>
    <stop offset="0.35" stop-color="#ffd98a" stop-opacity="0.38"/>
    <stop offset="1" stop-color="#ffd98a" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="gHaloLampe" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#ffd98a" stop-opacity="0.6"/>
    <stop offset="0.4" stop-color="#ffd98a" stop-opacity="0.25"/>
    <stop offset="1" stop-color="#ffd98a" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="gHaloLoin" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#ffd98a" stop-opacity="0.45"/>
    <stop offset="0.5" stop-color="#ffd98a" stop-opacity="0.16"/>
    <stop offset="1" stop-color="#ffd98a" stop-opacity="0"/>
  </radialGradient>
`;

// --- PLAN CIEL : nuit profonde, bande basse plus claire, etoiles, lune. Le plus lent. ---
export const PLAN_CIEL = `
  <rect x="-200" y="-60" width="2320" height="840" fill="#1a2238"/>
  <rect x="-200" y="470" width="2320" height="300" fill="#2b3654"/>
  <rect x="-200" y="418" width="2320" height="52" fill="#2b3654" opacity="0.45"/>
  <path d="M300,240 Q560,222 820,236 Q640,256 420,258 Q340,252 300,240 Z" fill="#2b3654" opacity="0.75"/>
  <path d="M1240,322 Q1480,306 1720,318 Q1560,338 1360,340 Q1290,334 1240,322 Z" fill="#2b3654" opacity="0.65"/>
  <path d="M-80,340 Q80,328 240,336 Q120,352 -20,352 Q-60,348 -80,340 Z" fill="#2b3654" opacity="0.6"/>
  <circle cx="1560" cy="176" r="44" fill="#fff3c9" opacity="0.95"/>
  <circle cx="1580" cy="164" r="40" fill="#1a2238"/>
  <circle cx="100" cy="92" r="2.5" fill="#fff3c9" opacity="0.85"/>
  <circle cx="322" cy="150" r="1.8" fill="#fff3c9" opacity="0.6"/>
  <circle cx="520" cy="62" r="2" fill="#fff3c9" opacity="0.75"/>
  <circle cx="762" cy="122" r="1.6" fill="#fff3c9" opacity="0.55"/>
  <circle cx="940" cy="72" r="2.4" fill="#fff3c9" opacity="0.8"/>
  <circle cx="1152" cy="162" r="1.7" fill="#fff3c9" opacity="0.6"/>
  <circle cx="1322" cy="92" r="2.1" fill="#fff3c9" opacity="0.7"/>
  <circle cx="1750" cy="132" r="1.8" fill="#fff3c9" opacity="0.6"/>
  <circle cx="1948" cy="82" r="2.4" fill="#fff3c9" opacity="0.8"/>
  <circle cx="2052" cy="192" r="1.6" fill="#fff3c9" opacity="0.55"/>
  <circle cx="-84" cy="142" r="2" fill="#fff3c9" opacity="0.65"/>
  <circle cx="622" cy="232" r="1.5" fill="#fff3c9" opacity="0.5"/>
  <circle cx="1424" cy="212" r="1.6" fill="#fff3c9" opacity="0.5"/>
  <circle cx="1852" cy="262" r="1.5" fill="#fff3c9" opacity="0.45"/>
`;

// --- PLAN VILLE : silhouettes sombres, ligne d'horizon franche vers y=560-620,
// quelques fenetres allumees. Toits soulignes d'un liseret bleu (rim light du ciel). ---
export const PLAN_VILLE = `
  <g fill="#141b2e">
    <rect x="-200" y="560" width="180" height="210"/>
    <rect x="-40" y="596" width="140" height="174"/>
    <rect x="120" y="540" width="110" height="230"/>
    <rect x="250" y="610" width="160" height="160"/>
    <rect x="414" y="598" width="122" height="172"/>
    <path d="M430,600 Q475,552 520,600 Z"/>
    <rect x="556" y="490" width="18" height="280"/>
    <path d="M556,490 Q565,472 574,490 Z"/>
    <rect x="600" y="575" width="150" height="195"/>
    <rect x="770" y="545" width="100" height="225"/>
    <rect x="788" y="518" width="48" height="28"/>
    <rect x="890" y="600" width="170" height="170"/>
    <rect x="1080" y="560" width="130" height="210"/>
    <rect x="1230" y="590" width="180" height="180"/>
    <rect x="1430" y="548" width="110" height="222"/>
    <rect x="1560" y="600" width="150" height="170"/>
    <rect x="1730" y="566" width="140" height="204"/>
    <rect x="1890" y="592" width="160" height="178"/>
    <rect x="2060" y="556" width="200" height="214"/>
    <rect x="-200" y="730" width="2320" height="40"/>
  </g>
  <g stroke="#141b2e" stroke-width="2.5" fill="none">
    <path d="M175,540 V506"/>
    <path d="M1484,548 V512"/>
    <path d="M796,546 V532 M828,546 V532"/>
  </g>
  <g stroke="#2b3654" stroke-width="1.5" fill="none" opacity="0.8">
    <path d="M-200,560 H-20"/>
    <path d="M120,540 H230"/>
    <path d="M430,600 Q475,552 520,600"/>
    <path d="M770,545 H870"/>
    <path d="M1080,560 H1210"/>
    <path d="M1430,548 H1540"/>
    <path d="M1730,566 H1870"/>
    <path d="M2060,556 H2120"/>
  </g>
  <g fill="#f0c060">
    <rect x="-160" y="592" width="9" height="13"/>
    <rect x="-132" y="628" width="9" height="13" opacity="0.65"/>
    <rect x="146" y="572" width="9" height="13"/>
    <rect x="188" y="606" width="9" height="13" opacity="0.7"/>
    <rect x="300" y="640" width="9" height="13"/>
    <rect x="448" y="628" width="9" height="13" opacity="0.75"/>
    <rect x="640" y="602" width="9" height="13"/>
    <rect x="700" y="640" width="9" height="13" opacity="0.6"/>
    <rect x="806" y="576" width="9" height="13"/>
    <rect x="946" y="632" width="9" height="13" opacity="0.7"/>
    <rect x="1118" y="588" width="9" height="13"/>
    <rect x="1290" y="620" width="9" height="13"/>
    <rect x="1348" y="656" width="9" height="13" opacity="0.6"/>
    <rect x="1466" y="580" width="9" height="13"/>
    <rect x="1614" y="632" width="9" height="13" opacity="0.7"/>
    <rect x="1780" y="596" width="9" height="13"/>
    <rect x="1944" y="624" width="9" height="13" opacity="0.65"/>
    <rect x="2096" y="586" width="9" height="13"/>
    <rect x="166" y="554" width="9" height="13" opacity="0.8"/>
    <rect x="806" y="556" width="9" height="13" opacity="0.75"/>
    <rect x="1118" y="568" width="9" height="13" opacity="0.8"/>
    <rect x="1466" y="558" width="9" height="13" opacity="0.75"/>
    <rect x="2094" y="564" width="9" height="13" opacity="0.8"/>
  </g>
`;

// --- PLAN ETALS FOND : rangee d'etals eloignes, quasi silhouettes, quelques
// lampes faibles. Tout reste au-dessus de y=780 (bases a y=748). ---
export const PLAN_ETALS_FOND = `
  <g stroke="#12100c" stroke-width="1.5">
    <path d="M-180,612 L40,608 L56,646 L-196,650 Z" fill="#141b2e"/>
    <rect x="-172" y="648" width="6" height="100" fill="#141b2e"/>
    <rect x="26" y="646" width="6" height="102" fill="#141b2e"/>
    <rect x="-178" y="700" width="216" height="48" fill="#141b2e"/>
    <path d="M140,610 L360,606 L376,644 L124,648 Z" fill="#4a3a28" opacity="0.85"/>
    <rect x="148" y="646" width="6" height="102" fill="#141b2e"/>
    <rect x="346" y="644" width="6" height="104" fill="#141b2e"/>
    <rect x="142" y="700" width="216" height="48" fill="#141b2e"/>
    <path d="M470,614 L690,610 L706,648 L454,652 Z" fill="#141b2e"/>
    <rect x="478" y="650" width="6" height="98" fill="#141b2e"/>
    <rect x="676" y="648" width="6" height="100" fill="#141b2e"/>
    <rect x="472" y="702" width="216" height="46" fill="#141b2e"/>
    <path d="M800,608 L1020,604 L1036,642 L784,646 Z" fill="#4a3a28" opacity="0.85"/>
    <rect x="808" y="644" width="6" height="104" fill="#141b2e"/>
    <rect x="1006" y="642" width="6" height="106" fill="#141b2e"/>
    <rect x="802" y="698" width="216" height="50" fill="#141b2e"/>
    <path d="M1130,614 L1350,610 L1366,648 L1114,652 Z" fill="#141b2e"/>
    <rect x="1138" y="650" width="6" height="98" fill="#141b2e"/>
    <rect x="1336" y="648" width="6" height="100" fill="#141b2e"/>
    <rect x="1132" y="702" width="216" height="46" fill="#141b2e"/>
    <path d="M1460,608 L1680,604 L1696,642 L1444,646 Z" fill="#4a3a28" opacity="0.85"/>
    <rect x="1468" y="644" width="6" height="104" fill="#141b2e"/>
    <rect x="1666" y="642" width="6" height="106" fill="#141b2e"/>
    <rect x="1462" y="698" width="216" height="50" fill="#141b2e"/>
    <path d="M1790,614 L2010,610 L2026,648 L1774,652 Z" fill="#141b2e"/>
    <rect x="1798" y="650" width="6" height="98" fill="#141b2e"/>
    <rect x="1996" y="648" width="6" height="100" fill="#141b2e"/>
    <rect x="1792" y="702" width="216" height="46" fill="#141b2e"/>
    <path d="M2050,610 L2270,606 L2286,644 L2034,648 Z" fill="#4a3a28" opacity="0.85"/>
    <rect x="2058" y="646" width="6" height="102" fill="#141b2e"/>
    <rect x="2052" y="700" width="216" height="48" fill="#141b2e"/>
  </g>
  <circle cx="250" cy="670" r="30" fill="url(#gHaloLoin)"/>
  <circle cx="250" cy="670" r="4" fill="#ffd98a"/>
  <circle cx="228" cy="694" r="6" fill="#c17e3a" opacity="0.5"/>
  <circle cx="244" cy="694" r="6" fill="#c17e3a" opacity="0.5"/>
  <circle cx="910" cy="666" r="30" fill="url(#gHaloLoin)"/>
  <circle cx="910" cy="666" r="4" fill="#ffd98a"/>
  <circle cx="932" cy="692" r="6" fill="#d8a54a" opacity="0.5"/>
  <circle cx="1570" cy="666" r="30" fill="url(#gHaloLoin)"/>
  <circle cx="1570" cy="666" r="4" fill="#ffd98a"/>
  <circle cx="1548" cy="692" r="6" fill="#8a2b2b" opacity="0.6"/>
  <circle cx="2160" cy="668" r="26" fill="url(#gHaloLoin)"/>
  <circle cx="2160" cy="668" r="4" fill="#ffd98a"/>
  <circle cx="545" cy="672" r="28" fill="url(#gHaloLoin)"/>
  <circle cx="545" cy="672" r="4" fill="#ffd98a"/>
  <circle cx="600" cy="696" r="6" fill="#c17e3a" opacity="0.5"/>
  <circle cx="616" cy="696" r="6" fill="#c17e3a" opacity="0.5"/>
  <circle cx="1275" cy="672" r="28" fill="url(#gHaloLoin)"/>
  <circle cx="1275" cy="672" r="4" fill="#ffd98a"/>
  <circle cx="1240" cy="696" r="6" fill="#d8a54a" opacity="0.5"/>
  <circle cx="1900" cy="674" r="28" fill="url(#gHaloLoin)"/>
  <circle cx="1900" cy="674" r="4" fill="#ffd98a"/>
  <circle cx="1936" cy="698" r="6" fill="#8a2b2b" opacity="0.6"/>
`;

// --- PLAN ETALS : la rangee principale. Baches tendues, ampoules nues, lampe
// tempete, marchandises empilees. Les pieds des etals s'arretent a y=780. ---
export const PLAN_ETALS = `
  <path d="M-220,556 L-30,550 L-10,612 L-220,612 Z" fill="#7d5f3c" stroke="#12100c" stroke-width="2.5"/>
  <path d="M-220,612 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0" fill="#7d5f3c" stroke="#12100c" stroke-width="2"/>
  <rect x="-28" y="610" width="9" height="170" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <rect x="-220" y="688" width="204" height="10" fill="#4a3a28" stroke="#12100c" stroke-width="2"/>
  <rect x="-212" y="698" width="188" height="80" fill="#8a2b2b" stroke="#12100c" stroke-width="2"/>
  <path d="M-170,702 V774 M-120,702 V774 M-70,702 V774" stroke="#12100c" stroke-width="1.5" opacity="0.35"/>
  <ellipse cx="-90" cy="678" rx="14" ry="10" fill="#5e7245" stroke="#12100c" stroke-width="1.5"/>
  <ellipse cx="-118" cy="680" rx="14" ry="10" fill="#5e7245" stroke="#12100c" stroke-width="1.5"/>
  <path d="M-120,612 V636" stroke="#12100c" stroke-width="2"/>
  <circle cx="-120" cy="646" r="55" fill="url(#gHaloLampe)"/>
  <rect x="-125" y="632" width="10" height="10" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <circle cx="-120" cy="648" r="8" fill="#fff3c9" stroke="#12100c" stroke-width="1.5"/>
  <path d="M30,548 L450,544 L480,610 L0,610 Z" fill="#7d5f3c" stroke="#12100c" stroke-width="2.5"/>
  <path d="M0,610 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0" fill="#7d5f3c" stroke="#12100c" stroke-width="2"/>
  <rect x="36" y="604" width="9" height="176" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <rect x="436" y="604" width="9" height="176" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <rect x="28" y="674" width="424" height="11" fill="#4a3a28" stroke="#12100c" stroke-width="2"/>
  <rect x="36" y="685" width="408" height="93" fill="#8a2b2b" stroke="#12100c" stroke-width="2"/>
  <path d="M110,690 V772 M200,690 V772 M290,690 V772 M380,690 V772" stroke="#12100c" stroke-width="1.5" opacity="0.35"/>
  <g fill="#c17e3a" stroke="#12100c" stroke-width="1.5">
    <circle cx="96" cy="663" r="11"/><circle cx="118" cy="663" r="11"/><circle cx="140" cy="663" r="11"/><circle cx="162" cy="663" r="11"/><circle cx="184" cy="663" r="11"/>
    <circle cx="107" cy="645" r="11"/><circle cx="129" cy="645" r="11"/><circle cx="151" cy="645" r="11"/><circle cx="173" cy="645" r="11"/>
    <circle cx="118" cy="628" r="11"/><circle cx="140" cy="628" r="11"/><circle cx="162" cy="628" r="11"/>
  </g>
  <g fill="#5e7245" stroke="#12100c" stroke-width="1.5">
    <ellipse cx="248" cy="662" rx="15" ry="11"/>
    <ellipse cx="278" cy="660" rx="15" ry="11"/>
    <ellipse cx="262" cy="646" rx="15" ry="11"/>
    <ellipse cx="292" cy="648" rx="13" ry="10"/>
  </g>
  <ellipse cx="370" cy="666" rx="52" ry="13" fill="#a8b8c0" stroke="#12100c" stroke-width="2"/>
  <ellipse cx="370" cy="662" rx="40" ry="8" fill="#12100c" opacity="0.3"/>
  <g fill="#d8a54a" stroke="#12100c" stroke-width="1.5">
    <circle cx="350" cy="652" r="9"/><circle cx="370" cy="650" r="9"/><circle cx="390" cy="652" r="9"/>
    <circle cx="360" cy="638" r="9"/><circle cx="380" cy="638" r="9"/>
  </g>
  <path d="M240,610 V636" stroke="#12100c" stroke-width="2"/>
  <circle cx="240" cy="650" r="72" fill="url(#gHaloBulb)"/>
  <rect x="235" y="632" width="10" height="10" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <circle cx="240" cy="652" r="9" fill="#fff3c9" stroke="#12100c" stroke-width="1.5"/>
  <path d="M640,528 L1180,528 L1210,600 L610,600 Z" fill="#6b5a44" stroke="#12100c" stroke-width="2.5"/>
  <path d="M610,600 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0" fill="#6b5a44" stroke="#12100c" stroke-width="2"/>
  <rect x="630" y="598" width="9" height="182" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <rect x="1180" y="598" width="9" height="182" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <rect x="620" y="678" width="576" height="11" fill="#4a3a28" stroke="#12100c" stroke-width="2"/>
  <rect x="628" y="689" width="560" height="89" fill="#6b5a44" stroke="#12100c" stroke-width="2"/>
  <rect x="628" y="712" width="560" height="12" fill="#8a2b2b" opacity="0.8"/>
  <rect x="628" y="742" width="560" height="12" fill="#8a2b2b" opacity="0.8"/>
  <g stroke="#12100c" stroke-width="1.5">
    <rect x="666" y="665" width="148" height="13" fill="#8a2b2b"/>
    <rect x="672" y="652" width="140" height="13" fill="#d8a54a"/>
    <rect x="668" y="639" width="144" height="13" fill="#5e7245"/>
    <rect x="676" y="626" width="132" height="13" fill="#8a2b2b"/>
  </g>
  <g fill="#8a2b2b" stroke="#12100c" stroke-width="1.5">
    <circle cx="868" cy="670" r="8"/><circle cx="884" cy="670" r="8"/><circle cx="900" cy="670" r="8"/><circle cx="916" cy="670" r="8"/><circle cx="932" cy="670" r="8"/>
    <circle cx="876" cy="656" r="8"/><circle cx="892" cy="656" r="8"/><circle cx="908" cy="656" r="8"/><circle cx="924" cy="656" r="8"/>
    <circle cx="892" cy="643" r="8"/><circle cx="908" cy="643" r="8"/>
  </g>
  <circle cx="980" cy="655" r="48" fill="url(#gHaloLampe)"/>
  <rect x="970" y="666" width="20" height="8" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <ellipse cx="980" cy="655" rx="9" ry="11" fill="#fff3c9" stroke="#12100c" stroke-width="1.5"/>
  <rect x="973" y="640" width="14" height="5" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <path d="M971,642 Q980,628 989,642" stroke="#12100c" stroke-width="1.5" fill="none"/>
  <g fill="#a8b8c0" stroke="#12100c" stroke-width="2">
    <ellipse cx="1100" cy="672" rx="55" ry="12"/>
    <ellipse cx="1100" cy="658" rx="52" ry="11"/>
    <ellipse cx="1100" cy="644" rx="49" ry="10"/>
  </g>
  <ellipse cx="1100" cy="642" rx="38" ry="6" fill="#12100c" opacity="0.25"/>
  <path d="M760,600 V630" stroke="#12100c" stroke-width="2"/>
  <circle cx="760" cy="644" r="75" fill="url(#gHaloBulb)"/>
  <rect x="755" y="626" width="10" height="10" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <circle cx="760" cy="646" r="9" fill="#fff3c9" stroke="#12100c" stroke-width="1.5"/>
  <path d="M1060,600 V624" stroke="#12100c" stroke-width="2"/>
  <circle cx="1060" cy="638" r="70" fill="url(#gHaloBulb)"/>
  <rect x="1055" y="620" width="10" height="10" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <circle cx="1060" cy="640" r="9" fill="#fff3c9" stroke="#12100c" stroke-width="1.5"/>
  <path d="M1370,542 L1790,536 L1820,606 L1340,606 Z" fill="#7d5f3c" stroke="#12100c" stroke-width="2.5"/>
  <path d="M1340,606 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0" fill="#7d5f3c" stroke="#12100c" stroke-width="2"/>
  <rect x="1354" y="606" width="9" height="174" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <rect x="1800" y="604" width="9" height="176" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <rect x="1346" y="682" width="468" height="11" fill="#4a3a28" stroke="#12100c" stroke-width="2"/>
  <rect x="1354" y="693" width="452" height="85" fill="#8a2b2b" stroke="#12100c" stroke-width="2"/>
  <path d="M1440,698 V772 M1540,698 V772 M1640,698 V772 M1730,698 V772" stroke="#12100c" stroke-width="1.5" opacity="0.35"/>
  <g fill="#c17e3a" stroke="#12100c" stroke-width="1.5">
    <ellipse cx="1408" cy="672" rx="16" ry="9"/><ellipse cx="1442" cy="672" rx="16" ry="9"/><ellipse cx="1476" cy="672" rx="16" ry="9"/>
    <ellipse cx="1424" cy="657" rx="16" ry="9"/><ellipse cx="1458" cy="657" rx="16" ry="9"/>
    <ellipse cx="1440" cy="643" rx="16" ry="9"/>
  </g>
  <path d="M1540,682 Q1536,640 1560,632 Q1580,626 1600,632 Q1624,640 1620,682 Z" fill="#7d5f3c" stroke="#12100c" stroke-width="2"/>
  <ellipse cx="1580" cy="633" rx="22" ry="6" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <g fill="#d8a54a">
    <circle cx="1572" cy="631" r="2.5"/><circle cx="1580" cy="629" r="2.5"/><circle cx="1588" cy="631" r="2.5"/>
    <circle cx="1576" cy="634" r="2.5"/><circle cx="1584" cy="634" r="2.5"/>
  </g>
  <g fill="#5e7245" stroke="#12100c" stroke-width="1.5">
    <ellipse cx="1690" cy="668" rx="15" ry="11"/>
    <ellipse cx="1720" cy="666" rx="15" ry="11"/>
    <ellipse cx="1704" cy="652" rx="15" ry="11"/>
  </g>
  <path d="M1500,606 V632" stroke="#12100c" stroke-width="2"/>
  <circle cx="1500" cy="646" r="70" fill="url(#gHaloBulb)"/>
  <rect x="1495" y="628" width="10" height="10" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <circle cx="1500" cy="648" r="9" fill="#fff3c9" stroke="#12100c" stroke-width="1.5"/>
  <path d="M2010,552 L2240,548 L2260,612 L1980,612 Z" fill="#6b5a44" stroke="#12100c" stroke-width="2.5"/>
  <path d="M1980,612 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0 q30,18 60,0" fill="#6b5a44" stroke="#12100c" stroke-width="2"/>
  <rect x="1992" y="610" width="9" height="170" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <rect x="1988" y="686" width="272" height="11" fill="#4a3a28" stroke="#12100c" stroke-width="2"/>
  <rect x="1996" y="697" width="256" height="81" fill="#6b5a44" stroke="#12100c" stroke-width="2"/>
  <g fill="#a8b8c0" stroke="#12100c" stroke-width="2">
    <ellipse cx="2080" cy="678" rx="46" ry="10"/>
    <ellipse cx="2080" cy="666" rx="43" ry="9"/>
  </g>
  <path d="M2100,614 V638" stroke="#12100c" stroke-width="2"/>
  <circle cx="2100" cy="650" r="60" fill="url(#gHaloLampe)"/>
  <rect x="2095" y="634" width="10" height="10" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <circle cx="2100" cy="652" r="8" fill="#fff3c9" stroke="#12100c" stroke-width="1.5"/>
`;

// --- PLAN SOL : terre battue + flaques de lumiere chaude projetees par les
// etals. Les flaques sont PLATES (ellipses) et font partie du sol. ---
export const PLAN_SOL = `
  <path d="M-200,772 Q200,764 600,770 Q1100,776 1500,768 Q1900,762 2120,770 L2120,1080 H-200 Z" fill="#3a3020"/>
  <path d="M-200,772 Q200,764 600,770 Q1100,776 1500,768 Q1900,762 2120,770" stroke="#12100c" stroke-width="1.5" fill="none" opacity="0.35"/>
  <ellipse cx="240" cy="850" rx="240" ry="42" fill="#6b5836" opacity="0.55"/>
  <ellipse cx="240" cy="848" rx="160" ry="28" fill="#6b5836" opacity="0.85"/>
  <ellipse cx="240" cy="846" rx="92" ry="16" fill="#6b5836"/>
  <ellipse cx="240" cy="846" rx="110" ry="18" fill="#ffd98a" opacity="0.13"/>
  <ellipse cx="900" cy="862" rx="320" ry="48" fill="#6b5836" opacity="0.55"/>
  <ellipse cx="900" cy="858" rx="220" ry="32" fill="#6b5836" opacity="0.85"/>
  <ellipse cx="900" cy="856" rx="130" ry="20" fill="#6b5836"/>
  <ellipse cx="900" cy="856" rx="150" ry="22" fill="#ffd98a" opacity="0.13"/>
  <ellipse cx="1580" cy="854" rx="250" ry="44" fill="#6b5836" opacity="0.55"/>
  <ellipse cx="1580" cy="852" rx="168" ry="29" fill="#6b5836" opacity="0.85"/>
  <ellipse cx="1580" cy="850" rx="96" ry="17" fill="#6b5836"/>
  <ellipse cx="1580" cy="850" rx="114" ry="19" fill="#ffd98a" opacity="0.13"/>
  <ellipse cx="2090" cy="844" rx="170" ry="32" fill="#6b5836" opacity="0.5"/>
  <ellipse cx="2090" cy="842" rx="104" ry="20" fill="#6b5836" opacity="0.85"/>
  <ellipse cx="-120" cy="844" rx="150" ry="30" fill="#6b5836" opacity="0.5"/>
  <ellipse cx="-120" cy="842" rx="92" ry="18" fill="#6b5836" opacity="0.85"/>
  <ellipse cx="560" cy="820" rx="90" ry="16" fill="#6b5836" opacity="0.4"/>
  <ellipse cx="1260" cy="824" rx="96" ry="17" fill="#6b5836" opacity="0.4"/>
  <ellipse cx="1900" cy="818" rx="80" ry="14" fill="#6b5836" opacity="0.4"/>
  <g stroke="#12100c" stroke-width="1.5" fill="none" opacity="0.18">
    <path d="M-200,904 Q300,896 800,904 T2120,898"/>
    <path d="M-160,956 Q400,948 900,956 T2120,950"/>
    <path d="M-200,1006 Q500,998 1000,1006 T2120,1000"/>
    <path d="M-200,806 Q350,800 760,806"/>
    <path d="M1200,798 Q1650,792 2120,800"/>
  </g>
  <g fill="#12100c" opacity="0.2">
    <ellipse cx="420" cy="922" rx="9" ry="4"/>
    <ellipse cx="1130" cy="948" rx="8" ry="4"/>
    <ellipse cx="1760" cy="912" rx="10" ry="4"/>
    <ellipse cx="120" cy="974" rx="8" ry="4"/>
    <ellipse cx="2010" cy="966" rx="9" ry="4"/>
    <ellipse cx="700" cy="988" rx="7" ry="3"/>
  </g>
`;

// --- PLAN AVANT : cageots, bassines, sacs au premier plan (le plus rapide).
// Tout est SOUS y=1010, en ombre, avec un liseret chaud retro-eclaire. ---
export const PLAN_AVANT = `
  <rect x="-180" y="1014" width="170" height="80" fill="#4a3a28" stroke="#12100c" stroke-width="2.5"/>
  <path d="M-140,1014 V1094 M-95,1014 V1094 M-50,1014 V1094" stroke="#12100c" stroke-width="1.5" opacity="0.5"/>
  <rect x="130" y="1012" width="210" height="80" fill="#4a3a28" stroke="#12100c" stroke-width="2.5"/>
  <path d="M180,1012 V1092 M235,1012 V1092 M290,1012 V1092" stroke="#12100c" stroke-width="1.5" opacity="0.5"/>
  <g fill="#c17e3a" stroke="#12100c" stroke-width="1.5">
    <circle cx="165" cy="1024" r="11"/><circle cx="192" cy="1026" r="11"/><circle cx="219" cy="1024" r="11"/>
    <circle cx="246" cy="1026" r="11"/><circle cx="273" cy="1024" r="11"/><circle cx="300" cy="1026" r="11"/>
  </g>
  <path d="M130,1012 H340" stroke="#ffd98a" stroke-width="2" opacity="0.4"/>
  <path d="M495,1048 L515,1102 L785,1102 L805,1048 Z" fill="#a8b8c0" stroke="#12100c" stroke-width="2.5"/>
  <ellipse cx="650" cy="1048" rx="155" ry="34" fill="#a8b8c0" stroke="#12100c" stroke-width="2.5"/>
  <ellipse cx="650" cy="1048" rx="122" ry="23" fill="#12100c" opacity="0.35"/>
  <path d="M505,1042 Q650,1012 795,1042" stroke="#ffd98a" stroke-width="2" fill="none" opacity="0.35"/>
  <path d="M950,1104 Q946,1034 996,1020 Q1046,1012 1066,1034 Q1082,1056 1078,1104 Z" fill="#7d5f3c" stroke="#12100c" stroke-width="2.5"/>
  <ellipse cx="1000" cy="1020" rx="10" ry="6" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <path d="M968,1044 Q1000,1054 1052,1042" stroke="#12100c" stroke-width="1.5" fill="none" opacity="0.4"/>
  <path d="M960,1076 Q1010,1086 1064,1074" stroke="#12100c" stroke-width="1.5" fill="none" opacity="0.4"/>
  <path d="M1060,1104 Q1058,1040 1110,1026 Q1160,1018 1178,1048 Q1188,1072 1184,1104 Z" fill="#7d5f3c" stroke="#12100c" stroke-width="2.5"/>
  <ellipse cx="1114" cy="1026" rx="10" ry="6" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <path d="M1076,1058 Q1120,1068 1172,1056" stroke="#12100c" stroke-width="1.5" fill="none" opacity="0.4"/>
  <rect x="1420" y="1016" width="200" height="76" fill="#4a3a28" stroke="#12100c" stroke-width="2.5"/>
  <path d="M1470,1016 V1092 M1520,1016 V1092 M1570,1016 V1092" stroke="#12100c" stroke-width="1.5" opacity="0.5"/>
  <g fill="#5e7245" stroke="#12100c" stroke-width="1.5">
    <circle cx="1452" cy="1028" r="11"/><circle cx="1479" cy="1030" r="11"/><circle cx="1506" cy="1028" r="11"/>
    <circle cx="1533" cy="1030" r="11"/><circle cx="1560" cy="1028" r="11"/><circle cx="1587" cy="1030" r="11"/>
  </g>
  <path d="M1420,1016 H1620" stroke="#ffd98a" stroke-width="2" opacity="0.4"/>
  <path d="M1810,1054 L1826,1100 L2074,1100 L2090,1054 Z" fill="#a8b8c0" stroke="#12100c" stroke-width="2.5"/>
  <ellipse cx="1950" cy="1054" rx="140" ry="32" fill="#a8b8c0" stroke="#12100c" stroke-width="2.5"/>
  <ellipse cx="1950" cy="1054" rx="110" ry="21" fill="#12100c" opacity="0.35"/>
  <path d="M1820,1048 Q1950,1020 2080,1048" stroke="#ffd98a" stroke-width="2" fill="none" opacity="0.35"/>
  <path d="M2140,1104 Q2138,1038 2192,1024 Q2244,1016 2262,1048 Q2272,1072 2268,1104 Z" fill="#7d5f3c" stroke="#12100c" stroke-width="2.5"/>
  <ellipse cx="2196" cy="1024" rx="10" ry="6" fill="#4a3a28" stroke="#12100c" stroke-width="1.5"/>
  <rect x="-200" y="1010" width="2320" height="75" fill="#12100c" opacity="0.25"/>
`;
