// SVG foyer (encre pur, Gemini) — inner du <svg>, pour injection + colorisation test
export const FOYER_INNER = `
  <rect width="1080" height="1920" fill="#E8E0D0" stroke="none" />
  <style>
    path, ellipse, circle { fill: none; stroke: #2E241A; stroke-linecap: round; stroke-linejoin: round; }
  </style>

  <g id="background_scenery">
    <!-- Soleil couchant et ciel -->
    <path d="M500,1280 A350,350 0 0,1 1080,1100" stroke-width="4" />
    <path d="M420,1250 A450,450 0 0,1 1080,1000" stroke-width="2" stroke-dasharray="15 20" />
    <path d="M550,1050 L500,1000 M680,950 L650,880 M850,910 L880,830 M1020,970 L1080,930" stroke-width="2" />

    <!-- Horizon et dunes de savane -->
    <path d="M0,1350 Q300,1300 650,1380 T1080,1330" stroke-width="3" />
    <path d="M250,1330 Q450,1290 600,1330" stroke-width="1.5" stroke-dasharray="10 15" />
    <path d="M0,1500 Q400,1400 850,1520 T1080,1480" stroke-width="4" />
    <path d="M0,1650 Q250,1580 500,1680" stroke-width="2" stroke-dasharray="25 20" />
    <path d="M650,1780 Q850,1820 1080,1720" stroke-width="2" stroke-dasharray="15 25" />

    <!-- Baobab majestueux (gauche) -->
    <path d="M-50,1500 C50,1400 120,1000 100,500" stroke-width="8" />
    <path d="M420,1550 C320,1450 280,1000 360,500" stroke-width="8" />
    <path d="M-50,1500 Q50,1520 100,1580 M150,1480 Q200,1530 250,1550 M420,1550 Q480,1580 580,1590" stroke-width="6" />
    <path d="M100,500 Q50,400 -20,350 M100,500 Q150,300 200,100 M150,350 Q250,250 300,150" stroke-width="6" />
    <path d="M360,500 Q430,350 530,250 M360,500 Q330,300 380,50 M360,350 Q280,200 260,-20" stroke-width="6" />
    <path d="M130,1200 Q150,900 120,700 M240,1250 Q220,950 250,750 M350,1300 Q330,1000 340,800" stroke-width="2" stroke-dasharray="30 25" />

    <!-- Cases au fond (droite) -->
    <path d="M780,1370 L860,1370" stroke-width="4" />
    <path d="M780,1370 L780,1280 M860,1370 L860,1280" stroke-width="3" />
    <path d="M760,1280 L880,1280" stroke-width="5" />
    <path d="M760,1280 Q820,1150 880,1280" stroke-width="4" />
    <path d="M790,1280 L820,1180 M810,1280 L830,1160 M830,1280 L840,1170" stroke-width="1.5" />
    <path d="M900,1330 L1020,1330" stroke-width="4" />
    <path d="M900,1330 L900,1220 M1020,1330 L1020,1220" stroke-width="3" />
    <path d="M870,1220 L1050,1220" stroke-width="5" />
    <path d="M870,1220 Q960,1050 1050,1220" stroke-width="4" />
    <path d="M920,1220 L960,1090 M950,1220 L975,1070 M980,1220 L990,1080" stroke-width="1.5" />
  </g>

  <g id="hearth_and_fire">
    <!-- Trois pierres du foyer -->
    <path d="M440,1690 C410,1630 470,1590 500,1650 C520,1690 480,1720 440,1690 Z" stroke-width="6" />
    <path d="M680,1690 C710,1630 650,1590 620,1650 C600,1690 640,1720 680,1690 Z" stroke-width="6" />
    <path d="M520,1760 C540,1710 580,1710 600,1760 C610,1800 510,1800 520,1760 Z" stroke-width="6" />

    <!-- Bûches -->
    <path d="M370,1740 L480,1670 M750,1740 L640,1670 M560,1860 L560,1730" stroke-width="9" stroke-linecap="round" />
    <path d="M460,1800 L510,1690 M660,1800 L610,1690" stroke-width="7" stroke-linecap="round" />

    <!-- Flammes -->
    <path d="M490,1650 Q510,1540 530,1590 Q540,1480 560,1550 Q570,1460 590,1570 Q610,1520 620,1630" stroke-width="4" stroke-linejoin="miter" />
    <path d="M510,1630 Q540,1500 560,1580 Q580,1490 600,1610" stroke-width="3" />
    <path d="M530,1610 Q560,1530 580,1610" stroke-width="2" />

    <!-- Volutes de fumée majestueuses -->
    <path d="M550,1460 C510,1210 710,1110 560,810 C410,510 660,310 510,-50" stroke-width="4" stroke-dasharray="25 15" stroke-linecap="round" />
    <path d="M580,1430 C660,1260 460,1060 590,760 C720,460 460,260 610,-50" stroke-width="2" stroke-dasharray="10 10 30 15" stroke-linecap="round" />
    <path d="M530,1390 C460,1160 610,960 510,660 C410,360 560,160 460,-50" stroke-width="1.5" stroke-dasharray="5 20" stroke-linecap="round" />
  </g>

  <g id="cooking_pot">
    <!-- Silhouette de la marmite -->
    <path d="M470,1480 C410,1550 450,1660 550,1660 C650,1660 690,1550 630,1480" stroke-width="8" />
    <!-- Rebords -->
    <ellipse cx="550" cy="1480" rx="80" ry="16" stroke-width="6" />
    <ellipse cx="550" cy="1475" rx="72" ry="10" stroke-width="3" />
    <!-- Vapeur frémissante au-dessus -->
    <path d="M510,1430 Q530,1400 550,1420 T590,1400" stroke-width="2" stroke-dasharray="6 6" />
    <path d="M530,1450 Q550,1420 570,1440" stroke-width="2" stroke-dasharray="4 8" />
  </g>

  <g id="mortar_and_pestle">
    <!-- Pilon planté -->
    <path d="M340,1250 L270,1650" stroke-width="16" stroke-linecap="round" />
    <path d="M340,1250 L350,1210" stroke-width="20" stroke-linecap="round" />
    <!-- Ouverture du mortier -->
    <ellipse cx="250" cy="1550" rx="75" ry="20" stroke-width="6" />
    <!-- Corps du mortier -->
    <path d="M175,1550 C185,1650 195,1750 205,1800 L295,1800 C305,1750 315,1650 325,1550" stroke-width="7" />
    <!-- Base -->
    <path d="M185,1800 C185,1825 315,1825 315,1800 Z" stroke-width="6" />
    <!-- Lignes décoratives creusées -->
    <path d="M190,1680 C220,1695 280,1695 310,1680" stroke-width="3" stroke-dasharray="12 8" />
    <path d="M195,1720 C225,1735 275,1735 305,1720" stroke-width="3" stroke-dasharray="6 12" />
  </g>

  <g id="rolled_mats">
    <!-- Natte arrière -->
    <path d="M800,1650 L1040,1570" stroke-width="6" />
    <path d="M770,1590 L1010,1510" stroke-width="6" />
    <ellipse cx="785" cy="1620" rx="16" ry="38" transform="rotate(-18 785 1620)" stroke-width="5" />
    <ellipse cx="1025" cy="1540" rx="16" ry="38" transform="rotate(-18 1025 1540)" stroke-width="5" />
    <path d="M785,1620 Q800,1570 1025,1540" stroke-width="2" stroke-dasharray="10 10" />
    <path d="M795,1640 Q810,1590 1035,1560" stroke-width="2" stroke-dasharray="15 12" />

    <!-- Natte avant croisée -->
    <path d="M700,1780 L1060,1730" stroke-width="8" />
    <path d="M680,1690 L1040,1640" stroke-width="8" />
    <ellipse cx="690" cy="1735" rx="20" ry="46" transform="rotate(-8 690 1735)" stroke-width="6" />
    <ellipse cx="1050" cy="1685" rx="20" ry="46" transform="rotate(-8 1050 1685)" stroke-width="6" />
    <path d="M690,1725 Q705,1735 690,1745 Q675,1735 690,1725" stroke-width="3" />
    <!-- Texture tressée -->
    <path d="M690,1735 L1050,1685" stroke-width="3" stroke-dasharray="12 18" />
    <path d="M695,1755 L1055,1705" stroke-width="2" stroke-dasharray="6 12" />
    <path d="M685,1715 L1045,1665" stroke-width="2" stroke-dasharray="25 15" />
  </g>

  <g id="calabashes">
    <!-- Calebasse renversée près du mortier -->
    <path d="M330,1770 C270,1770 250,1660 310,1660 C340,1660 350,1630 380,1650 C420,1670 400,1770 330,1770 Z" stroke-width="6" />
    <path d="M330,1670 Q360,1690 380,1680" stroke-width="3" />
    <path d="M300,1710 Q330,1740 370,1710" stroke-width="2" stroke-dasharray="8 10" />

    <!-- Demi-calebasse droite (bol) -->
    <path d="M420,1830 C420,1880 520,1880 520,1830 Z" stroke-width="6" />
    <ellipse cx="470" cy="1830" rx="50" ry="12" stroke-width="5" />
    <path d="M435,1845 Q470,1860 505,1845" stroke-width="2" stroke-dasharray="5 8" />
  </g>
`;
