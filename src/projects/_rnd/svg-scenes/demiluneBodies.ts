/* auto-genere — SVG bruts demi-lune-racine, 3 registres (comparatif identite). Jetable. */
export const DL_PAPIER = `<svg viewBox="0 0 1920 1080" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#bfe3ef" />
      <stop offset="100%" stopColor="#fdf3df" />
    </linearGradient>
    <filter id="paperShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#554433" floodOpacity="0.15" />
    </filter>
    <filter id="paperShadowLight" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#554433" floodOpacity="0.1" />
    </filter>
  </defs>

  <g id="ciel">
    <rect width="1920" height="1080" fill="url(#skyGrad)" />
    <circle cx="350" cy="250" r="100" fill="#f2cf72" filter="url(#paperShadow)" />
    <circle cx="350" cy="250" r="80" fill="#ffd98a" />
    <circle cx="350" cy="250" r="60" fill="#fff4c2" />
    <g filter="url(#paperShadow)">
      <path d="M 1300 250 A 50 50 0 0 1 1400 220 A 70 70 0 0 1 1520 250 A 40 40 0 0 1 1600 280 L 1250 280 A 40 40 0 0 1 1300 250 Z" fill="#fbf6ea" />
      <path d="M 1320 260 A 40 40 0 0 1 1400 230 A 50 50 0 0 1 1500 260 L 1320 260 Z" fill="#ffffff" />
    </g>
  </g>

  <g id="sous-sol">
    <path d="M 0 680 Q 400 660 960 750 T 1920 700 L 1920 1080 L 0 1080 Z" fill="#8a5a2c" />
    <path d="M 0 650 Q 500 620 960 720 T 1920 680 L 1920 1080 L 0 1080 Z" fill="#b3823f" filter="url(#paperShadow)" />
  </g>

  <g id="terre-seche">
    <path d="M 0 580 Q 380 570 760 590 C 820 600, 840 680, 960 680 C 1080 680, 1100 600, 1160 590 Q 1540 570 1920 580 L 1920 1080 L 0 1080 Z" fill="#caa46a" filter="url(#paperShadow)" />
    <path d="M 0 620 Q 380 610 700 640 L 700 1080 L 0 1080 Z" fill="#c08a4e" filter="url(#paperShadowLight)" fillOpacity="0.5" />
    <g stroke="#b3823f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <polyline points="200,600 220,630 210,650 240,680" />
      <polyline points="220,630 250,640" />
      <polyline points="450,590 440,620 460,650 430,690" />
      <polyline points="440,620 410,610" />
      <polyline points="1500,590 1520,620 1490,660 1510,700" />
      <polyline points="1520,620 1560,630" />
      <polyline points="1750,595 1740,620 1760,650" />
    </g>
  </g>

  <g id="demilune">
    <path d="M 1080 640 C 1120 540, 1220 560, 1260 590 C 1180 610, 1120 640, 1080 640 Z" fill="#e3c489" filter="url(#paperShadow)" />
    <path d="M 1095 625 C 1125 560, 1200 570, 1230 590 C 1170 600, 1120 620, 1095 625 Z" fill="#fdf3df" fillOpacity="0.6" />
    <g id="pelle" filter="url(#paperShadowLight)">
      <line x1="1170" y1="560" x2="1220" y2="420" stroke="#c08a4e" strokeWidth="8" strokeLinecap="round" />
      <line x1="1205" y1="415" x2="1235" y2="425" stroke="#a06b35" strokeWidth="8" strokeLinecap="round" />
      <path d="M 1160 575 L 1185 550 L 1175 530 L 1150 555 Z" fill="#e0795b" />
    </g>
  </g>

  <g id="eau">
    <path d="M 840 640 C 860 680, 1060 680, 1080 640 C 1000 645, 920 645, 840 640 Z" fill="#a8d8e8" filter="url(#paperShadowLight)" />
    <path d="M 860 645 C 880 670, 1040 670, 1060 645 C 1000 648, 920 648, 860 645 Z" fill="#bfe3ef" />
    <g stroke="#a8d8e8" strokeWidth="4" strokeLinecap="round" fill="none">
      <path d="M 960 650 Q 950 690 960 740" />
      <path d="M 910 645 Q 920 680 900 720" />
      <path d="M 1010 645 Q 1000 680 1020 720" />
    </g>
  </g>

  <g id="racine" stroke="#f2cf72" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#paperShadowLight)">
    <path d="M 960 760 Q 950 820 970 880 T 960 1000" strokeWidth="8" />
    <path d="M 965 800 Q 920 830 850 850 T 780 890" strokeWidth="6" />
    <path d="M 890 835 Q 860 880 820 900" strokeWidth="4" />
    <path d="M 960 900 Q 900 950 860 980" strokeWidth="5" />
    <path d="M 965 840 Q 1020 860 1080 890 T 1150 940" strokeWidth="6" />
    <path d="M 1040 870 Q 1070 920 1120 950" strokeWidth="4" />
    <path d="M 965 940 Q 1020 970 1060 1020" strokeWidth="5" />
  </g>

  <g id="pousse">
    <path d="M 960 635 Q 980 500 940 350" fill="none" stroke="#7cba5a" strokeWidth="12" strokeLinecap="round" filter="url(#paperShadow)" />
    <g filter="url(#paperShadow)">
      <path d="M 965 580 C 900 580, 850 540, 850 500 C 850 480, 920 490, 965 540 Z" fill="#3e7c34" />
      <path d="M 965 580 C 920 570, 870 540, 850 500 C 880 520, 920 540, 965 550 Z" fill="#569b43" />
      <path d="M 955 480 C 1030 460, 1080 400, 1080 350 C 1080 330, 1000 360, 955 430 Z" fill="#569b43" />
      <path d="M 955 480 C 1000 460, 1050 420, 1080 350 C 1040 380, 990 420, 955 440 Z" fill="#7cba5a" />
      <path d="M 940 355 C 900 320, 870 250, 880 200 C 920 200, 950 270, 940 355 Z" fill="#7cba5a" />
      <path d="M 940 355 C 920 310, 900 260, 880 200 C 910 230, 930 280, 940 355 Z" fill="#a8d678" />
    </g>
  </g>

  <g id="pluie" stroke="#a8d8e8" strokeWidth="4" strokeLinecap="round" fill="none" fillOpacity="0.8">
    <path d="M 700 200 L 650 350" />
    <path d="M 850 150 L 780 360" />
    <path d="M 1000 100 L 920 340" />
    <path d="M 1150 180 L 1080 390" />
    <path d="M 1300 120 L 1220 360" />
  </g>
</svg>`;
export const DL_BRAISE = `<svg viewBox="0 0 1920 1080" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sun-grad" cx="75%" cy="35%" r="50%">
      <stop offset="0%" stopColor="#ffe39a" stopOpacity="1" />
      <stop offset="30%" stopColor="#f2cf72" stopOpacity="0.9" />
      <stop offset="70%" stopColor="#d6552e" stopOpacity="0.5" />
      <stop offset="100%" stopColor="#8a2a12" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="sky-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#8a2a12" />
      <stop offset="50%" stopColor="#c23a1e" />
      <stop offset="100%" stopColor="#e8b44a" />
    </linearGradient>
    <radialGradient id="vignette-grad" cx="50%" cy="50%" r="75%">
      <stop offset="60%" stopColor="#1c1108" stopOpacity="0" />
      <stop offset="100%" stopColor="#1c1108" stopOpacity="0.85" />
    </radialGradient>
    <pattern id="hatch-subsoil" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
      <path d="M 0,15 L 30,15" stroke="#2a1a0d" strokeWidth="2" fill="none" />
      <path d="M 0,30 L 30,30" stroke="#1c1108" strokeWidth="4" fill="none" />
    </pattern>
    <pattern id="hatch-earth" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 0,10 L 40,10 M 0,30 L 40,30" stroke="#9c5f2c" strokeWidth="1" fill="none" strokeDasharray="8 4" />
      <path d="M 10,0 L 10,40 M 30,0 L 30,40" stroke="#7a4a22" strokeWidth="1" fill="none" strokeDasharray="4 8" />
    </pattern>
  </defs>

  <g id="ciel">
    <rect x="0" y="0" width="1920" height="450" fill="url(#sky-grad)" />
    <circle cx="1400" cy="250" r="250" fill="url(#sun-grad)" />
    <g id="soleil-hachures" opacity="0.6">
      <circle cx="1400" cy="250" r="150" stroke="#ffe39a" strokeWidth="2" strokeDasharray="10 15" fill="none" />
      <circle cx="1400" cy="250" r="200" stroke="#f2cf72" strokeWidth="1" strokeDasharray="5 20" fill="none" />
      <path d="M 1000,250 L 1800,250 M 1400,50 L 1400,450 M 1150,100 L 1650,400 M 1150,400 L 1650,100" stroke="#e8b44a" strokeWidth="2" strokeDasharray="2 12" fill="none" />
    </g>
    <path d="M 200,150 Q 350,120 500,160 T 800,140" stroke="#d6552e" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M 150,170 Q 300,140 450,180 T 750,160" stroke="#c23a1e" strokeWidth="2" fill="none" strokeLinecap="round" />
  </g>

  <g id="pluie">
    <path d="M 400,-50 L 250,450 M 600,-50 L 450,450 M 800,-50 L 650,450 M 1000,-50 L 850,450 M 1200,-50 L 1050,450 M 1400,-50 L 1250,450 M 1600,-50 L 1450,450" stroke="#f2e3c0" strokeWidth="2" strokeDasharray="25 45" fill="none" opacity="0.5" />
    <path d="M 500,-50 L 350,450 M 700,-50 L 550,450 M 900,-50 L 750,450 M 1100,-50 L 950,450 M 1300,-50 L 1150,450 M 1500,-50 L 1350,450" stroke="#f2cf72" strokeWidth="1" strokeDasharray="15 35" fill="none" opacity="0.4" />
  </g>

  <g id="sous-sol">
    <rect x="0" y="450" width="1920" height="630" fill="#1c1108" />
    <rect x="0" y="450" width="1920" height="630" fill="url(#hatch-subsoil)" />
    <path d="M 0,550 Q 400,600 960,530 T 1920,580 M 0,700 Q 500,750 960,680 T 1920,750 M 0,850 Q 450,820 960,890 T 1920,830 M 0,1000 Q 400,980 960,1020 T 1920,980" stroke="#2a1a0d" strokeWidth="8" fill="none" />
    <path d="M 0,550 Q 400,600 960,530 T 1920,580 M 0,700 Q 500,750 960,680 T 1920,750" stroke="#7a4a22" strokeWidth="2" fill="none" strokeDasharray="20 10" transform="translate(0, 5)" />
  </g>

  <g id="terre-seche">
    <rect x="0" y="450" width="1920" height="80" fill="#7a4a22" />
    <rect x="0" y="450" width="1920" height="80" fill="url(#hatch-earth)" />
    <line x1="0" y1="450" x2="1920" y2="450" stroke="#b8763a" strokeWidth="6" />
    <line x1="0" y1="450" x2="1920" y2="450" stroke="#f2e3c0" strokeWidth="2" strokeDasharray="30 20" />
    <g id="craquelures">
      <path d="M 150,450 L 170,490 L 155,520 L 180,540 M 170,490 L 210,510 M 450,450 L 430,480 L 440,510 L 410,530 M 1500,450 L 1530,480 L 1510,520 M 1750,450 L 1730,490 L 1760,530" stroke="#1c1108" strokeWidth="3" fill="none" strokeLinejoin="bevel" />
      <path d="M 150,450 L 170,490 L 155,520 L 180,540 M 170,490 L 210,510 M 450,450 L 430,480 L 440,510 L 410,530 M 1500,450 L 1530,480 L 1510,520 M 1750,450 L 1730,490 L 1760,530" stroke="#9c5f2c" strokeWidth="1" fill="none" strokeLinejoin="bevel" transform="translate(2, 2)" />
    </g>
  </g>

  <g id="demilune">
    <path d="M 600,450 C 700,620 1000,620 1100,450 Z" fill="#1c1108" stroke="#2a1a0d" strokeWidth="6" />
    <path d="M 630,470 C 720,590 980,590 1070,470 M 660,490 C 740,560 960,560 1040,490" stroke="#7a4a22" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M 630,470 C 720,590 980,590 1070,470 M 660,490 C 740,560 960,560 1040,490" stroke="#9c5f2c" strokeWidth="1" fill="none" strokeDasharray="10 5" transform="translate(0, -3)" />
    <path d="M 1100,450 C 1150,370 1350,370 1420,450 Z" fill="#8a2a12" stroke="#b8763a" strokeWidth="4" />
    <path d="M 1120,430 C 1160,390 1320,390 1390,430 M 1150,410 C 1200,380 1280,380 1350,410" stroke="#d6552e" strokeWidth="2" fill="none" />
    <path d="M 1300,380 L 1360,180" stroke="#b8763a" strokeWidth="10" strokeLinecap="round" />
    <path d="M 1290,420 L 1320,370 L 1310,360 L 1280,410 Z" fill="#c23a1e" stroke="#ffe39a" strokeWidth="2" strokeLinejoin="round" />
  </g>

  <g id="eau">
    <path d="M 680,520 C 780,590 920,590 1020,520 C 920,550 780,550 680,520 Z" fill="#e8b44a" />
    <path d="M 680,520 C 780,510 920,510 1020,520 C 920,535 780,535 680,520 Z" fill="#ffe39a" />
    <path d="M 730,540 Q 850,560 970,540" stroke="#f2e3c0" strokeWidth="2" fill="none" />
    <path d="M 750,555 Q 850,575 950,555" stroke="#f2cf72" strokeWidth="2" strokeDasharray="15 10" fill="none" />
    <g id="infiltration">
      <path d="M 850,570 L 850,680" stroke="#f2cf72" strokeWidth="4" strokeDasharray="8 6" fill="none" strokeLinecap="round" />
      <path d="M 800,550 L 770,660" stroke="#e8b44a" strokeWidth="3" strokeDasharray="6 8" fill="none" strokeLinecap="round" />
      <path d="M 900,550 L 930,660" stroke="#e8b44a" strokeWidth="3" strokeDasharray="6 8" fill="none" strokeLinecap="round" />
      <path d="M 825,560 L 810,670" stroke="#f2e3c0" strokeWidth="2" strokeDasharray="4 10" fill="none" strokeLinecap="round" />
      <path d="M 875,560 L 890,670" stroke="#f2e3c0" strokeWidth="2" strokeDasharray="4 10" fill="none" strokeLinecap="round" />
    </g>
  </g>

  <g id="racine">
    <path d="M 850,680 C 820,780 880,900 850,1050" stroke="#e8b44a" strokeWidth="10" fill="none" strokeLinecap="round" />
    <path d="M 850,680 C 820,780 880,900 850,1050" stroke="#ffe39a" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M 835,740 C 720,800 680,880 620,1000" stroke="#f2cf72" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M 835,740 C 720,800 680,880 620,1000" stroke="#f2e3c0" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M 860,760 C 980,820 1020,920 1080,1040" stroke="#f2cf72" strokeWidth="7" fill="none" strokeLinecap="round" />
    <path d="M 860,760 C 980,820 1020,920 1080,1040" stroke="#f2e3c0" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M 845,860 C 780,900 750,980 720,1060" stroke="#e8b44a" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M 855,880 C 920,950 960,1000 980,1080" stroke="#e8b44a" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M 740,840 C 700,880 650,920 580,960" stroke="#f2cf72" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M 960,860 C 1020,890 1080,940 1150,980" stroke="#f2cf72" strokeWidth="3" fill="none" strokeLinecap="round" />
  </g>

  <g id="pousse">
    <path d="M 850,560 C 820,400 890,250 850,150" stroke="#f2cf72" strokeWidth="14" fill="none" strokeLinecap="round" />
    <path d="M 850,560 C 820,400 890,250 850,150" stroke="#8a2a12" strokeWidth="4" fill="none" strokeLinecap="round" transform="translate(-2, 0)" />
    <path d="M 850,560 C 820,400 890,250 850,150" stroke="#ffe39a" strokeWidth="2" fill="none" strokeLinecap="round" transform="translate(2, 0)" />
  </g>

  <g id="feuilles">
    <g id="feuille-1">
      <path d="M 860,420 C 960,380 1000,440 980,480 C 940,460 890,450 860,420 Z" fill="#e8b44a" stroke="#ffe39a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 860,420 C 920,430 960,460 980,480" stroke="#d6552e" strokeWidth="2" fill="none" />
    </g>
    <g id="feuille-2">
      <path d="M 845,320 C 740,280 700,340 720,380 C 760,360 810,350 845,320 Z" fill="#f2cf72" stroke="#ffe39a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 845,320 C 780,330 740,360 720,380" stroke="#d6552e" strokeWidth="2" fill="none" />
    </g>
    <g id="feuille-3">
      <path d="M 865,240 C 940,200 970,250 950,290 C 920,270 880,260 865,240 Z" fill="#e8b44a" stroke="#ffe39a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 865,240 C 910,250 940,270 950,290" stroke="#d6552e" strokeWidth="2" fill="none" />
    </g>
    <g id="feuille-top">
      <path d="M 850,150 C 800,80 880,50 900,120 C 880,130 860,140 850,150 Z" fill="#f2cf72" stroke="#ffe39a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 850,150 C 860,110 880,90 900,120" stroke="#d6552e" strokeWidth="2" fill="none" />
    </g>
  </g>

  <g id="vignette">
    <rect width="1920" height="1080" fill="url(#vignette-grad)" pointerEvents="none" />
  </g>
</svg>`;
export const DL_ENCRE = `<g id="scene-demilune-sahel">
  <rect width="1920" height="1080" fill="#e8dcc0" />
  <rect x="20" y="20" width="1880" height="1040" fill="none" stroke="#2b2117" stroke-width="4" />
  <rect x="30" y="30" width="1860" height="1020" fill="none" stroke="#2b2117" stroke-width="1" />
  
  <g id="ciel">
    <circle cx="250" cy="200" r="70" fill="none" stroke="#2b2117" stroke-width="3" stroke-dasharray="10, 5" />
    <circle cx="250" cy="200" r="85" fill="none" stroke="#2b2117" stroke-width="1" stroke-dasharray="4, 6" />
    <path d="M 250 100 L 250 40 M 320 130 L 380 70 M 350 200 L 420 200 M 320 270 L 380 330 M 250 300 L 250 360 M 180 270 L 120 330 M 150 200 L 80 200 M 180 130 L 120 70" fill="none" stroke="#2b2117" stroke-width="3" />
    <path d="M 450 150 L 650 150 M 500 180 L 800 180 M 550 210 L 700 210 M 1200 150 L 1400 150 M 1300 180 L 1600 180" fill="none" stroke="#3a2c1c" stroke-width="1.5" stroke-dasharray="15, 10" />
  </g>

  <g id="pluie">
    <path d="M 700 50 L 600 350 M 800 20 L 680 380 M 900 80 L 780 390 M 1050 50 L 920 370 M 1150 100 L 1020 390 M 1250 30 L 1120 360" fill="none" stroke="#2b2117" stroke-width="2" stroke-dasharray="20, 30" opacity="0.8" />
    <path d="M 750 100 L 650 400 M 850 150 L 750 450 M 950 120 L 830 480 M 1100 150 L 970 450 M 1200 80 L 1080 440" fill="none" stroke="#2b2117" stroke-width="1" stroke-dasharray="10, 20" opacity="0.6" />
  </g>

  <g id="sous-sol">
    <path d="M 0 450 Q 250 470 500 440 T 1000 460 T 1500 440 T 1920 450" fill="none" stroke="#2b2117" stroke-width="3" />
    <path d="M 0 520 Q 300 500 600 530 T 1200 510 T 1800 540 T 1920 520" fill="none" stroke="#3a2c1c" stroke-width="2" stroke-dasharray="80, 10" />
    <path d="M 0 600 Q 200 620 400 590 T 900 610 T 1400 590 T 1920 610" fill="none" stroke="#3a2c1c" stroke-width="1.5" />
    <path d="M 0 700 Q 350 680 700 720 T 1400 700 T 1920 730" fill="none" stroke="#3a2c1c" stroke-width="1.5" />
    <path d="M 0 850 Q 400 870 800 840 T 1600 860 T 1920 840" fill="none" stroke="#3a2c1c" stroke-width="2" />
    <path d="M 0 1000 Q 500 980 1000 1020 T 1920 990" fill="none" stroke="#3a2c1c" stroke-width="2.5" />
    <path d="M 30 450 L 30 1080 M 60 450 L 60 1080 M 90 450 L 90 1080 M 120 450 L 120 1080 M 150 450 L 150 1080 M 180 450 L 180 1080 M 210 450 L 210 1080" fill="none" stroke="#3a2c1c" stroke-width="1" opacity="0.5" />
    <path d="M 1890 450 L 1890 1080 M 1860 450 L 1860 1080 M 1830 450 L 1830 1080 M 1800 450 L 1800 1080 M 1770 450 L 1770 1080 M 1740 450 L 1740 1080 M 1710 450 L 1710 1080" fill="none" stroke="#3a2c1c" stroke-width="1" opacity="0.5" />
    <path d="M 0 800 L 250 1080 M 0 850 L 200 1080 M 0 900 L 150 1080 M 0 950 L 100 1080 M 0 1000 L 50 1080" fill="none" stroke="#3a2c1c" stroke-width="1.5" />
    <path d="M 1920 800 L 1670 1080 M 1920 850 L 1720 1080 M 1920 900 L 1770 1080 M 1920 950 L 1820 1080 M 1920 1000 L 1870 1080" fill="none" stroke="#3a2c1c" stroke-width="1.5" />
    <path d="M 0 1080 L 250 800 M 50 1080 L 300 800 M 100 1080 L 350 800 M 150 1080 L 400 800" fill="none" stroke="#3a2c1c" stroke-width="1" opacity="0.5" />
    <path d="M 1920 1080 L 1670 800 M 1870 1080 L 1620 800 M 1820 1080 L 1570 800 M 1770 1080 L 1520 800" fill="none" stroke="#3a2c1c" stroke-width="1" opacity="0.5" />
  </g>

  <g id="terre-seche">
    <path d="M 0 450 L 650 450 M 1250 450 L 1920 450" fill="none" stroke="#2b2117" stroke-width="6" stroke-linecap="round" />
    <path d="M 150 450 L 160 480 L 140 510 L 155 550 M 160 480 L 190 500" fill="none" stroke="#2b2117" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M 350 450 L 340 490 L 360 540 L 345 590 M 360 540 L 390 570" fill="none" stroke="#2b2117" stroke-width="3" stroke-linejoin="round" />
    <path d="M 500 450 L 515 500 L 490 540 L 505 580 M 515 500 L 550 510" fill="none" stroke="#2b2117" stroke-width="2" stroke-linejoin="round" />
    <path d="M 1400 450 L 1380 490 L 1410 550 L 1390 600 M 1410 550 L 1450 570" fill="none" stroke="#2b2117" stroke-width="3" stroke-linejoin="round" />
    <path d="M 1650 450 L 1670 510 L 1640 560 M 1670 510 L 1710 530" fill="none" stroke="#2b2117" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M 1800 450 L 1790 490 L 1810 530" fill="none" stroke="#2b2117" stroke-width="2" stroke-linejoin="round" />
  </g>

  <g id="demilune">
    <path d="M 650 450 C 750 650, 1050 680, 1250 450" fill="none" stroke="#2b2117" stroke-width="8" stroke-linecap="round" />
    <path d="M 1250 450 C 1300 350, 1400 380, 1450 450" fill="none" stroke="#2b2117" stroke-width="6" stroke-linecap="round" />
    <path d="M 670 470 C 760 620, 1040 650, 1220 470" fill="none" stroke="#2b2117" stroke-width="3" />
    <path d="M 690 490 C 770 590, 1030 620, 1190 490" fill="none" stroke="#2b2117" stroke-width="2" />
    <path d="M 720 510 C 790 560, 1010 590, 1150 510" fill="none" stroke="#2b2117" stroke-width="1.5" />
    <path d="M 750 530 C 810 540, 990 560, 1100 530" fill="none" stroke="#2b2117" stroke-width="1" />
    <path d="M 850 460 Q 860 520 880 580 M 900 460 Q 910 540 930 600 M 950 460 Q 950 550 960 620 M 1000 460 Q 990 540 980 610 M 1050 460 Q 1030 520 1010 590" fill="none" stroke="#3a2c1c" stroke-width="1" stroke-dasharray="5, 5" />
    <path d="M 1270 420 C 1300 380, 1370 390, 1420 440" fill="none" stroke="#2b2117" stroke-width="2" />
    <path d="M 1290 400 C 1310 370, 1350 380, 1390 430" fill="none" stroke="#2b2117" stroke-width="1.5" />
  </g>

  <g id="pelle">
    <path d="M 1340 430 L 1400 250" fill="none" stroke="#2b2117" stroke-width="5" stroke-linecap="round" />
    <path d="M 1395 255 L 1425 245 L 1435 275 L 1405 285 Z" fill="none" stroke="#2b2117" stroke-width="3" stroke-linejoin="round" />
    <path d="M 1335 425 L 1310 480 L 1350 490 L 1355 435 Z" fill="none" stroke="#2b2117" stroke-width="3" stroke-linejoin="round" />
  </g>

  <g id="eau">
    <path d="M 700 550 Q 820 560 950 550 T 1180 550" fill="none" stroke="#2b2117" stroke-width="3" />
    <path d="M 720 570 Q 820 575 950 570 T 1140 570" fill="none" stroke="#2b2117" stroke-width="2" />
    <path d="M 740 590 Q 820 595 950 590 T 1100 590" fill="none" stroke="#2b2117" stroke-width="1.5" />
    <path d="M 780 610 Q 850 615 950 610 T 1050 610" fill="none" stroke="#2b2117" stroke-width="1" />
    
    <path d="M 850 600 Q 840 640 855 680 T 840 750" fill="none" stroke="#2b2117" stroke-width="2" stroke-dasharray="6, 8" stroke-linecap="round" />
    <path d="M 900 620 Q 890 670 910 720 T 900 800" fill="none" stroke="#2b2117" stroke-width="2.5" stroke-dasharray="8, 10" stroke-linecap="round" />
    <path d="M 950 630 Q 945 690 960 740 T 950 820" fill="none" stroke="#2b2117" stroke-width="2" stroke-dasharray="5, 7" stroke-linecap="round" />
    <path d="M 1000 620 Q 1010 670 990 720 T 1000 790" fill="none" stroke="#2b2117" stroke-width="2.5" stroke-dasharray="8, 10" stroke-linecap="round" />
    <path d="M 1050 600 Q 1060 650 1045 690 T 1060 760" fill="none" stroke="#2b2117" stroke-width="2" stroke-dasharray="6, 8" stroke-linecap="round" />
  </g>

  <g id="racine">
    <path d="M 950 650 Q 930 750 960 850 T 940 1000" fill="none" stroke="#2b2117" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 950 650 Q 930 750 960 850 T 940 1000" fill="none" stroke="#e8dcc0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    
    <path d="M 945 720 Q 850 750 800 830 T 700 920" fill="none" stroke="#2b2117" stroke-width="8" stroke-linecap="round" />
    <path d="M 820 780 Q 750 800 700 880 T 600 950" fill="none" stroke="#2b2117" stroke-width="5" stroke-linecap="round" />
    <path d="M 955 800 Q 880 880 850 950 T 780 1050" fill="none" stroke="#2b2117" stroke-width="6" stroke-linecap="round" />
    
    <path d="M 955 700 Q 1050 730 1100 820 T 1200 900" fill="none" stroke="#2b2117" stroke-width="8" stroke-linecap="round" />
    <path d="M 1080 780 Q 1150 800 1200 860 T 1300 920" fill="none" stroke="#2b2117" stroke-width="5" stroke-linecap="round" />
    <path d="M 950 880 Q 1020 920 1050 980 T 1100 1050" fill="none" stroke="#2b2117" stroke-width="6" stroke-linecap="round" />

    <path d="M 750 880 Q 720 920 680 940" fill="none" stroke="#2b2117" stroke-width="3" stroke-linecap="round" />
    <path d="M 830 920 Q 810 980 790 1000" fill="none" stroke="#2b2117" stroke-width="3" stroke-linecap="round" />
    <path d="M 1150 860 Q 1180 900 1220 910" fill="none" stroke="#2b2117" stroke-width="3" stroke-linecap="round" />
    <path d="M 1040 960 Q 1080 1000 1090 1020" fill="none" stroke="#2b2117" stroke-width="3" stroke-linecap="round" />
  </g>

  <g id="pousse">
    <path d="M 950 650 Q 980 500 940 300 Q 910 150 950 80" fill="none" stroke="#2b2117" stroke-width="10" stroke-linecap="round" />
    <path d="M 950 650 Q 980 500 940 300 Q 910 150 950 80" fill="none" stroke="#e8dcc0" stroke-width="1.5" stroke-linecap="round" />
    
    <path d="M 965 450 C 1050 420, 1150 450, 1180 350 C 1120 320, 1020 370, 965 450" fill="none" stroke="#2b2117" stroke-width="3.5" stroke-linejoin="round" />
    <path d="M 965 450 Q 1080 400 1180 350" fill="none" stroke="#2b2117" stroke-width="2.5" stroke-linecap="round" />
    <path d="M 1030 420 Q 1060 440 1080 435 M 1080 395 Q 1120 410 1130 405" fill="none" stroke="#2b2117" stroke-width="1.5" />
    
    <path d="M 945 350 C 850 320, 750 360, 720 250 C 780 220, 880 270, 945 350" fill="none" stroke="#2b2117" stroke-width="3.5" stroke-linejoin="round" />
    <path d="M 945 350 Q 830 300 720 250" fill="none" stroke="#2b2117" stroke-width="2.5" stroke-linecap="round" />
    <path d="M 880 320 Q 850 340 830 335 M 830 295 Q 790 310 780 305" fill="none" stroke="#2b2117" stroke-width="1.5" />
    
    <path d="M 935 220 C 1000 180, 1080 200, 1100 120 C 1050 100, 970 140, 935 220" fill="none" stroke="#2b2117" stroke-width="3" stroke-linejoin="round" />
    <path d="M 935 220 Q 1020 170 1100 120" fill="none" stroke="#2b2117" stroke-width="2" stroke-linecap="round" />
    <path d="M 990 190 Q 1020 210 1030 200" fill="none" stroke="#2b2117" stroke-width="1.5" />
    
    <path d="M 950 80 C 900 50, 850 70, 820 20 C 880 10, 930 40, 950 80" fill="none" stroke="#2b2117" stroke-width="3" stroke-linejoin="round" />
    <path d="M 950 80 Q 880 40 820 20" fill="none" stroke="#2b2117" stroke-width="2" stroke-linecap="round" />
  </g>
</g>`;
