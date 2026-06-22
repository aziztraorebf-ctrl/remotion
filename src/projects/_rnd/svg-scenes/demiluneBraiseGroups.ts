/* auto-genere — groupes braise demi-lune, jetable. */
export const B_CIEL = `
    <rect x="0" y="0" width="1920" height="450" fill="url(#sky-grad)" />
    <circle cx="1400" cy="250" r="250" fill="url(#sun-grad)" />
    <g id="soleil-hachures" opacity="0.6">
      <circle cx="1400" cy="250" r="150" stroke="#ffe39a" stroke-width="2" stroke-dasharray="10 15" fill="none" />
      <circle cx="1400" cy="250" r="200" stroke="#f2cf72" stroke-width="1" stroke-dasharray="5 20" fill="none" />
      <path d="M 1000,250 L 1800,250 M 1400,50 L 1400,450 M 1150,100 L 1650,400 M 1150,400 L 1650,100" stroke="#e8b44a" stroke-width="2" stroke-dasharray="2 12" fill="none" />
    </g>
    <path d="M 200,150 Q 350,120 500,160 T 800,140" stroke="#d6552e" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="M 150,170 Q 300,140 450,180 T 750,160" stroke="#c23a1e" stroke-width="2" fill="none" stroke-linecap="round" />
  `;
export const B_PLUIE = `
    <path d="M 400,-50 L 250,450 M 600,-50 L 450,450 M 800,-50 L 650,450 M 1000,-50 L 850,450 M 1200,-50 L 1050,450 M 1400,-50 L 1250,450 M 1600,-50 L 1450,450" stroke="#f2e3c0" stroke-width="2" stroke-dasharray="25 45" fill="none" opacity="0.5" />
    <path d="M 500,-50 L 350,450 M 700,-50 L 550,450 M 900,-50 L 750,450 M 1100,-50 L 950,450 M 1300,-50 L 1150,450 M 1500,-50 L 1350,450" stroke="#f2cf72" stroke-width="1" stroke-dasharray="15 35" fill="none" opacity="0.4" />
  `;
export const B_SOUS_SOL = `
    <rect x="0" y="450" width="1920" height="630" fill="#1c1108" />
    <rect x="0" y="450" width="1920" height="630" fill="url(#hatch-subsoil)" />
    <path d="M 0,550 Q 400,600 960,530 T 1920,580 M 0,700 Q 500,750 960,680 T 1920,750 M 0,850 Q 450,820 960,890 T 1920,830 M 0,1000 Q 400,980 960,1020 T 1920,980" stroke="#2a1a0d" stroke-width="8" fill="none" />
    <path d="M 0,550 Q 400,600 960,530 T 1920,580 M 0,700 Q 500,750 960,680 T 1920,750" stroke="#7a4a22" stroke-width="2" fill="none" stroke-dasharray="20 10" transform="translate(0, 5)" />
  `;
export const B_TERRE_SECHE = `
    <rect x="0" y="450" width="1920" height="80" fill="#7a4a22" />
    <rect x="0" y="450" width="1920" height="80" fill="url(#hatch-earth)" />
    <line x1="0" y1="450" x2="1920" y2="450" stroke="#b8763a" stroke-width="6" />
    <line x1="0" y1="450" x2="1920" y2="450" stroke="#f2e3c0" stroke-width="2" stroke-dasharray="30 20" />
    <g id="craquelures">
      <path d="M 150,450 L 170,490 L 155,520 L 180,540 M 170,490 L 210,510 M 450,450 L 430,480 L 440,510 L 410,530 M 1500,450 L 1530,480 L 1510,520 M 1750,450 L 1730,490 L 1760,530" stroke="#1c1108" stroke-width="3" fill="none" stroke-linejoin="bevel" />
      <path d="M 150,450 L 170,490 L 155,520 L 180,540 M 170,490 L 210,510 M 450,450 L 430,480 L 440,510 L 410,530 M 1500,450 L 1530,480 L 1510,520 M 1750,450 L 1730,490 L 1760,530" stroke="#9c5f2c" stroke-width="1" fill="none" stroke-linejoin="bevel" transform="translate(2, 2)" />
    </g>
  `;
export const B_DEMILUNE = `
    <path d="M 600,450 C 700,620 1000,620 1100,450 Z" fill="#1c1108" stroke="#2a1a0d" stroke-width="6" />
    <path d="M 630,470 C 720,590 980,590 1070,470 M 660,490 C 740,560 960,560 1040,490" stroke="#7a4a22" stroke-width="3" fill="none" stroke-linecap="round" />
    <path d="M 630,470 C 720,590 980,590 1070,470 M 660,490 C 740,560 960,560 1040,490" stroke="#9c5f2c" stroke-width="1" fill="none" stroke-dasharray="10 5" transform="translate(0, -3)" />
    <path d="M 1100,450 C 1150,370 1350,370 1420,450 Z" fill="#8a2a12" stroke="#b8763a" stroke-width="4" />
    <path d="M 1120,430 C 1160,390 1320,390 1390,430 M 1150,410 C 1200,380 1280,380 1350,410" stroke="#d6552e" stroke-width="2" fill="none" />
    <path d="M 1300,380 L 1360,180" stroke="#b8763a" stroke-width="10" stroke-linecap="round" />
    <path d="M 1290,420 L 1320,370 L 1310,360 L 1280,410 Z" fill="#c23a1e" stroke="#ffe39a" stroke-width="2" stroke-linejoin="round" />
  `;
export const B_EAU = `
    <path d="M 680,520 C 780,590 920,590 1020,520 C 920,550 780,550 680,520 Z" fill="#e8b44a" />
    <path d="M 680,520 C 780,510 920,510 1020,520 C 920,535 780,535 680,520 Z" fill="#ffe39a" />
    <path d="M 730,540 Q 850,560 970,540" stroke="#f2e3c0" stroke-width="2" fill="none" />
    <path d="M 750,555 Q 850,575 950,555" stroke="#f2cf72" stroke-width="2" stroke-dasharray="15 10" fill="none" />
    <g id="infiltration">
      <path d="M 850,570 L 850,680" stroke="#f2cf72" stroke-width="4" stroke-dasharray="8 6" fill="none" stroke-linecap="round" />
      <path d="M 800,550 L 770,660" stroke="#e8b44a" stroke-width="3" stroke-dasharray="6 8" fill="none" stroke-linecap="round" />
      <path d="M 900,550 L 930,660" stroke="#e8b44a" stroke-width="3" stroke-dasharray="6 8" fill="none" stroke-linecap="round" />
      <path d="M 825,560 L 810,670" stroke="#f2e3c0" stroke-width="2" stroke-dasharray="4 10" fill="none" stroke-linecap="round" />
      <path d="M 875,560 L 890,670" stroke="#f2e3c0" stroke-width="2" stroke-dasharray="4 10" fill="none" stroke-linecap="round" />
    </g>
  `;
export const B_RACINE = `
    <path d="M 850,680 C 820,780 880,900 850,1050" stroke="#e8b44a" stroke-width="10" fill="none" stroke-linecap="round" />
    <path d="M 850,680 C 820,780 880,900 850,1050" stroke="#ffe39a" stroke-width="3" fill="none" stroke-linecap="round" />
    <path d="M 835,740 C 720,800 680,880 620,1000" stroke="#f2cf72" stroke-width="6" fill="none" stroke-linecap="round" />
    <path d="M 835,740 C 720,800 680,880 620,1000" stroke="#f2e3c0" stroke-width="2" fill="none" stroke-linecap="round" />
    <path d="M 860,760 C 980,820 1020,920 1080,1040" stroke="#f2cf72" stroke-width="7" fill="none" stroke-linecap="round" />
    <path d="M 860,760 C 980,820 1020,920 1080,1040" stroke="#f2e3c0" stroke-width="2" fill="none" stroke-linecap="round" />
    <path d="M 845,860 C 780,900 750,980 720,1060" stroke="#e8b44a" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="M 855,880 C 920,950 960,1000 980,1080" stroke="#e8b44a" stroke-width="5" fill="none" stroke-linecap="round" />
    <path d="M 740,840 C 700,880 650,920 580,960" stroke="#f2cf72" stroke-width="3" fill="none" stroke-linecap="round" />
    <path d="M 960,860 C 1020,890 1080,940 1150,980" stroke="#f2cf72" stroke-width="3" fill="none" stroke-linecap="round" />
  `;
export const B_POUSSE = `
    <path d="M 850,560 C 820,400 890,250 850,150" stroke="#f2cf72" stroke-width="14" fill="none" stroke-linecap="round" />
    <path d="M 850,560 C 820,400 890,250 850,150" stroke="#8a2a12" stroke-width="4" fill="none" stroke-linecap="round" transform="translate(-2, 0)" />
    <path d="M 850,560 C 820,400 890,250 850,150" stroke="#ffe39a" stroke-width="2" fill="none" stroke-linecap="round" transform="translate(2, 0)" />
  `;
export const B_FEUILLES = `
    <g id="feuille-1">
      <path d="M 860,420 C 960,380 1000,440 980,480 C 940,460 890,450 860,420 Z" fill="#e8b44a" stroke="#ffe39a" stroke-width="2" stroke-linejoin="round" />
      <path d="M 860,420 C 920,430 960,460 980,480" stroke="#d6552e" stroke-width="2" fill="none" />
    </g>
    <g id="feuille-2">
      <path d="M 845,320 C 740,280 700,340 720,380 C 760,360 810,350 845,320 Z" fill="#f2cf72" stroke="#ffe39a" stroke-width="2" stroke-linejoin="round" />
      <path d="M 845,320 C 780,330 740,360 720,380" stroke="#d6552e" stroke-width="2" fill="none" />
    </g>
    <g id="feuille-3">
      <path d="M 865,240 C 940,200 970,250 950,290 C 920,270 880,260 865,240 Z" fill="#e8b44a" stroke="#ffe39a" stroke-width="2" stroke-linejoin="round" />
      <path d="M 865,240 C 910,250 940,270 950,290" stroke="#d6552e" stroke-width="2" fill="none" />
    </g>
    <g id="feuille-top">
      <path d="M 850,150 C 800,80 880,50 900,120 C 880,130 860,140 850,150 Z" fill="#f2cf72" stroke="#ffe39a" stroke-width="2" stroke-linejoin="round" />
      <path d="M 850,150 C 860,110 880,90 900,120" stroke="#d6552e" stroke-width="2" fill="none" />
    </g>
  `;
export const B_VIGNETTE = `
    <rect width="1920" height="1080" fill="url(#vignette-grad)" pointerEvents="none" />
  `;
