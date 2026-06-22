/* auto-genere — top-down mur braise : fond + arbres {transform, body}. Jetable. */
export const TD_FOND = `<g id="cadre">
    <rect x="40" y="40" width="1840" height="1000" fill="none" stroke="#f2e3c0" stroke-width="1" opacity="0.2"/>
    <polyline points="30,60 30,30 60,30" fill="none" stroke="#f2e3c0" stroke-width="2" opacity="0.6"/>
    <polyline points="1890,60 1890,30 1860,30" fill="none" stroke="#f2e3c0" stroke-width="2" opacity="0.6"/>
    <polyline points="30,1020 30,1050 60,1050" fill="none" stroke="#f2e3c0" stroke-width="2" opacity="0.6"/>
    <polyline points="1890,1020 1890,1050 1860,1050" fill="none" stroke="#f2e3c0" stroke-width="2" opacity="0.6"/>
    <text x="70" y="45" fill="#f2e3c0" font-family="monospace" font-size="12" opacity="0.4">14°41"34"N 17°26"48"W</text>
    <text x="1690" y="45" fill="#f2e3c0" font-family="monospace" font-size="12" opacity="0.4">11°35"20"N 43°08"42"E</text>
    <text x="70" y="1045" fill="#f2e3c0" font-family="monospace" font-size="12" opacity="0.4">SAHEL_TOPDOWN_VIEW</text>
  </g><g id="desert">
    <rect x="0" y="0" width="1920" height="1080" fill="#2a1a0d"/>
    
    <g id="dunes-principales" opacity="0.7">
      <path d="M-100,150 Q400,300 800,100 T1950,200" fill="none" stroke="#7a4a22" stroke-width="8" stroke-linecap="round"/>
      <path d="M-100,180 Q400,330 800,130 T1950,230" fill="none" stroke="#9c5f2c" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
      <path d="M-50,850 Q500,1000 1000,850 T2000,950" fill="none" stroke="#7a4a22" stroke-width="12" stroke-linecap="round"/>
      <path d="M-50,880 Q500,1030 1000,880 T2000,980" fill="none" stroke="#9c5f2c" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
      <path d="M300,-50 Q700,400 1200,300 T2000,-50" fill="none" stroke="#7a4a22" stroke-width="5" stroke-linecap="round" opacity="0.4"/>
    </g>

    <g id="oueds-craquelures" opacity="0.6">
      <path d="M440,685 Q400,850 250,950 T50,1050" fill="none" stroke="#8a2a12" stroke-width="3" stroke-linecap="round"/>
      <path d="M400,850 Q450,900 500,920" fill="none" stroke="#8a2a12" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M980,450 Q1050,300 1200,150 T1350,-50" fill="none" stroke="#8a2a12" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M1200,150 Q1250,200 1300,180" fill="none" stroke="#8a2a12" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M1430,655 Q1500,850 1700,950 T1950,1000" fill="none" stroke="#8a2a12" stroke-width="4" stroke-linecap="round"/>
      <path d="M1500,850 Q1450,920 1400,940" fill="none" stroke="#8a2a12" stroke-width="2" stroke-linecap="round"/>
    </g>

    <g id="hachures-gravure" stroke="#b8763a" stroke-width="1.5" opacity="0.2">
      <path d="M150,200 L180,230 M160,200 L190,230 M170,200 L200,230 M180,200 L210,230 M190,200 L220,230 M200,200 L230,230"/>
      <path d="M1650,850 L1680,880 M1660,850 L1690,880 M1670,850 L1700,880 M1680,850 L1710,880 M1690,850 L1720,880 M1700,850 L1730,880 M1710,850 L1740,880"/>
      <path d="M850,250 L870,280 M860,250 L880,280 M870,250 L890,280 M880,250 L900,280 M890,250 L910,280"/>
      <path d="M1100,800 L1130,820 M1110,800 L1140,820 M1120,800 L1150,820 M1130,800 L1160,820 M1140,800 L1170,820"/>
    </g>
  </g><g id="bande-trace">
    <path id="zone-influence" d="M140,595 Q310,700 440,685 T980,450 T1430,655 T1780,500" fill="none" stroke="#7a4a22" stroke-width="70" opacity="0.2" stroke-linecap="round"/>
    <path id="trace-decoratif-hachure" d="M140,615 Q310,720 440,705 T980,470 T1430,675 T1780,520" fill="none" stroke="#9c5f2c" stroke-width="2" stroke-dasharray="6 6" opacity="0.5"/>
    <path id="trace-continu-animation" d="M140,595 Q310,700 440,685 T980,450 T1430,655 T1780,500" fill="none" stroke="#d6552e" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
  </g><g id="reperes">
    <circle cx="140" cy="595" r="5" fill="#f2e3c0" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="140" cy="595" r="10" fill="none" stroke="#f2e3c0" stroke-width="1" opacity="0.5"/>
    <text x="130" y="625" fill="#f2e3c0" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="end" letter-spacing="2">SÉNÉGAL</text>
    
    <circle cx="1780" cy="500" r="5" fill="#f2e3c0" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="1780" cy="500" r="10" fill="none" stroke="#f2e3c0" stroke-width="1" opacity="0.5"/>
    <text x="1790" y="480" fill="#f2e3c0" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="start" letter-spacing="2">DJIBOUTI</text>
  </g><g id="vignette" pointer-events="none">
    <rect x="0" y="0" width="1920" height="1080" fill="none" stroke="#1c1108" stroke-width="150" opacity="0.8"/>
    <rect x="0" y="0" width="1920" height="1080" fill="none" stroke="#2a1a0d" stroke-width="80" opacity="0.5"/>
    <rect x="0" y="0" width="1920" height="1080" fill="none" stroke="#8a2a12" stroke-width="20" opacity="0.3"/>
  </g>`;
export const TD_ARBRES = [
{transform:`translate(172, 615) scale(1.1)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(204, 633) scale(0.9)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(235, 649) scale(1.2)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(266, 662) scale(0.8)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(297, 672) scale(1.0)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(328, 679) scale(1.3)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(358, 684) scale(0.9)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(387, 686) scale(1.1)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(414, 686) scale(1.0)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(440, 685) scale(1.2)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(490, 670) scale(0.9)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(540, 650) scale(1.1)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(590, 625) scale(0.8)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(640, 595) scale(1.2)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(695, 565) scale(1.0)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(750, 535) scale(0.9)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(805, 510) scale(1.3)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(860, 485) scale(1.1)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(920, 465) scale(0.8)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(980, 450) scale(1.2)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1020, 435) scale(0.9)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1060, 420) scale(1.1)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1100, 410) scale(1.0)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1140, 410) scale(1.3)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1180, 415) scale(0.8)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1220, 430) scale(1.2)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1260, 460) scale(0.9)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1300, 500) scale(1.1)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1340, 550) scale(1.0)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1380, 600) scale(0.8)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1430, 655) scale(1.3)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1470, 780) scale(1.1)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1510, 850) scale(0.9)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1570, 850) scale(1.2)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1650, 750) scale(1.0)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1715, 625) scale(0.8)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `},
{transform:`translate(1760, 540) scale(1.1)`, body:`
    <ellipse cx="3" cy="8" rx="22" ry="16" fill="#8a2a12" opacity="0.8"/>
    <circle cx="0" cy="0" r="20" fill="#e8b44a" stroke="#c23a1e" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="12" fill="#f2cf72" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="10" cy="-4" r="14" fill="#ffe39a" stroke="#d6552e" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="3" fill="#8a2a12"/>
    <path d="M-12,6 Q-6,16 6,12" stroke="#c23a1e" fill="none" stroke-width="2" stroke-linecap="round"/>
  `}
];
