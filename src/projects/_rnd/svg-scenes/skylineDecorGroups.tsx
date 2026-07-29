import React from 'react';

// =============================================================================
// Decor SVG statique — skyline urbain nocturne + rue en contrebas (1920x1080)
// Deux intensites du MEME dessin : SkylineAttenue / SkylinePlein.
// Geometrie strictement partagee (BUILDINGS, STREET) — seules les valeurs,
// densites de fenetres et opacites changent via le param d'intensite.
//
// Contraintes respectees :
// - Bande centrale y=170..790 entre x=430 et x=1490 : DEGAGEE (vide de la chute)
// - Rue : y=850..1080
// - Palette episode : nuit #22345c / #182746, fenetres ambre desature
// - Statique pur : aucune animation, aucun Math.random (bruit deterministe)
// =============================================================================

// Bruit deterministe : meme rendu a chaque frame
const frac = (n: number): number => n - Math.floor(n);
const rnd = (seed: number): number =>
  frac(Math.sin(seed * 127.1 + 311.7) * 43758.5453);

const STREET_TOP = 850;
const GROUND = 884; // pied des immeubles proches (derriere le trottoir arriere)

type Plane = 'far' | 'mid' | 'near';
type RoofKind = 'flat' | 'gradins' | 'spire' | 'watertower' | 'antennas';

interface Building {
  x: number;
  w: number;
  top: number;
  plane: Plane;
  roof: RoofKind;
  // details de toiture optionnels
  acUnits?: boolean;
  antenna?: boolean;
  sign?: boolean; // enseigne verticale
}

// --- GEOMETRIE PARTAGEE (identique dans les deux versions) -------------------

// Immeubles gauche (x < 430) et droite (x > 1490). Sommets libres en hauteur,
// mais aucune emprise dans la bande centrale x=430..1490 au-dessus de y=790.
const BUILDINGS: Building[] = [
  // ---- plan lointain gauche
  { x: -10, w: 100, top: 470, plane: 'far', roof: 'flat' },
  { x: 78, w: 74, top: 530, plane: 'far', roof: 'flat' },
  { x: 146, w: 96, top: 488, plane: 'far', roof: 'flat' },
  { x: 236, w: 82, top: 545, plane: 'far', roof: 'flat' },
  { x: 312, w: 108, top: 505, plane: 'far', roof: 'flat' },
  // ---- plan lointain droite (x >= 1494 : ne jamais deborder dans le vide central)
  { x: 1496, w: 76, top: 500, plane: 'far', roof: 'flat' },
  { x: 1562, w: 100, top: 462, plane: 'far', roof: 'flat' },
  { x: 1652, w: 78, top: 535, plane: 'far', roof: 'flat' },
  { x: 1722, w: 112, top: 486, plane: 'far', roof: 'flat' },
  { x: 1824, w: 106, top: 522, plane: 'far', roof: 'flat' },
  // ---- plan moyen gauche
  { x: -20, w: 130, top: 318, plane: 'mid', roof: 'flat', antenna: true },
  { x: 102, w: 92, top: 386, plane: 'mid', roof: 'gradins' },
  { x: 196, w: 112, top: 344, plane: 'mid', roof: 'watertower' },
  { x: 308, w: 104, top: 402, plane: 'mid', roof: 'flat', acUnits: true },
  // ---- plan moyen droite
  { x: 1498, w: 102, top: 364, plane: 'mid', roof: 'flat', acUnits: true },
  { x: 1592, w: 122, top: 322, plane: 'mid', roof: 'gradins' },
  { x: 1706, w: 92, top: 396, plane: 'mid', roof: 'flat', antenna: true },
  { x: 1788, w: 134, top: 348, plane: 'mid', roof: 'watertower' },
  // ---- plan proche gauche
  { x: -30, w: 176, top: 150, plane: 'near', roof: 'antennas', acUnits: true },
  { x: 138, w: 122, top: 348, plane: 'near', roof: 'gradins' },
  { x: 252, w: 112, top: 252, plane: 'near', roof: 'spire' },
  { x: 356, w: 74, top: 452, plane: 'near', roof: 'flat', acUnits: true },
  // ---- plan proche droite
  { x: 1494, w: 106, top: 440, plane: 'near', roof: 'flat', acUnits: true },
  { x: 1588, w: 132, top: 196, plane: 'near', roof: 'spire' },
  { x: 1712, w: 96, top: 316, plane: 'near', roof: 'watertower' },
  { x: 1798, w: 132, top: 228, plane: 'near', roof: 'antennas', sign: true },
];

// Crete lointaine centrale : toits tres bas (tops >= 792, sous la bande
// interdite), quasi fondus dans le fond — donne la profondeur sans occuper
// le vide de la chute.
const CENTER_RIDGE: Array<{ x: number; w: number; top: number }> = [
  { x: 430, w: 120, top: 812 }, { x: 550, w: 90, top: 800 },
  { x: 640, w: 130, top: 818 }, { x: 770, w: 100, top: 806 },
  { x: 870, w: 120, top: 796 }, { x: 990, w: 90, top: 810 },
  { x: 1080, w: 130, top: 800 }, { x: 1210, w: 100, top: 816 },
  { x: 1310, w: 110, top: 804 }, { x: 1420, w: 70, top: 812 },
];

// Vehicules a l'arret, vus de profil (x, largeur, voie)
const CARS: Array<{ x: number; w: number; lane: 'back' | 'front'; van?: boolean }> = [
  { x: 120, w: 74, lane: 'back' },
  { x: 340, w: 86, lane: 'back', van: true },
  { x: 620, w: 72, lane: 'back' },
  { x: 1010, w: 76, lane: 'back' },
  { x: 1330, w: 88, lane: 'back', van: true },
  { x: 1660, w: 74, lane: 'back' },
  { x: 240, w: 96, lane: 'front' },
  { x: 780, w: 104, lane: 'front', van: true },
  { x: 1180, w: 98, lane: 'front' },
  { x: 1560, w: 100, lane: 'front' },
];

// Lampadaires (trottoir arriere) + poteaux
const LAMPS_BACK = [70, 320, 570, 820, 1070, 1320, 1570, 1830];
const POLES = [460, 940, 1440]; // poteaux nus (sans lampe)

// --- INTENSITES --------------------------------------------------------------

interface Intensity {
  id: string; // prefixe d'ids SVG (evite les collisions si les 2 montes)
  farFill: string;
  farOp: number;
  midFill: string;
  midOp: number;
  nearFill: string;
  nearOp: number;
  ridgeOp: number;
  edgeOp: number; // liseret lunaire sur les aretes des tours proches
  winColor: string;
  winOpBase: number;
  litNear: number; // proportion de fenetres allumees
  litMid: number;
  farDots: boolean; // points de fenetres sur le plan lointain
  detailOp: number; // details de toiture (antennes, clim, chateau d'eau)
  signOp: number;
  glowOp: number; // halos lampadaires / devantures
  streetRoad: string;
  streetWalk: string;
  streetShopRow: string;
  shopWinOp: number;
  markingOp: number; // marquage au sol
  beaconOp: number; // feux rouges d'antennes
}

const ATTENUE: Intensity = {
  id: 'att',
  farFill: '#2b3d64', farOp: 0.38,
  midFill: '#1e2f56', midOp: 0.72,
  nearFill: '#142344', nearOp: 0.95,
  ridgeOp: 0.30,
  edgeOp: 0.05,
  winColor: '#7d6f4e', winOpBase: 0.26,
  litNear: 0.10, litMid: 0.05,
  farDots: false,
  detailOp: 0.5,
  signOp: 0.18,
  glowOp: 0.22,
  streetRoad: '#152443', streetWalk: '#1b2b4e', streetShopRow: '#16264a',
  shopWinOp: 0.2,
  markingOp: 0.1,
  beaconOp: 0.25,
};

const PLEIN: Intensity = {
  id: 'pl',
  farFill: '#2e4169', farOp: 0.7,
  midFill: '#1b2c52', midOp: 0.95,
  nearFill: '#0d1b36', nearOp: 1,
  ridgeOp: 0.55,
  edgeOp: 0.08,
  winColor: '#c1934f', winOpBase: 0.7,
  litNear: 0.34, litMid: 0.2,
  farDots: true,
  detailOp: 0.95,
  signOp: 0.85,
  glowOp: 0.5,
  streetRoad: '#101f3d', streetWalk: '#1d2e52', streetShopRow: '#122142',
  shopWinOp: 0.38,
  markingOp: 0.22,
  beaconOp: 0.8,
};

// --- SOUS-RENDUS -------------------------------------------------------------

const planeFill = (cfg: Intensity, plane: Plane): { fill: string; op: number } => {
  if (plane === 'far') return { fill: cfg.farFill, op: cfg.farOp };
  if (plane === 'mid') return { fill: cfg.midFill, op: cfg.midOp };
  return { fill: cfg.nearFill, op: cfg.nearOp };
};

// Fenetres au rythme irregulier (bruit deterministe, jamais une grille pleine)
const renderWindows = (b: Building, bi: number, cfg: Intensity): React.ReactNode => {
  if (b.plane === 'far') {
    if (!cfg.farDots) return null;
    // Lointain : quelques points minuscules seulement
    const dots: React.ReactNode[] = [];
    const n = Math.floor(b.w / 22);
    for (let i = 0; i < n * 3; i++) {
      const s = bi * 977 + i * 53;
      if (rnd(s) > 0.28) continue;
      const dx = b.x + 8 + rnd(s + 1) * (b.w - 16);
      const dy = b.top + 14 + rnd(s + 2) * (GROUND - 40 - b.top);
      dots.push(
        <rect key={i} x={dx} y={dy} width={3} height={4}
          fill={cfg.winColor} opacity={0.3 + rnd(s + 3) * 0.2} />,
      );
    }
    return <g>{dots}</g>;
  }
  const ratio = b.plane === 'near' ? cfg.litNear : cfg.litMid;
  const winW = b.plane === 'near' ? 9 : 7;
  const winH = b.plane === 'near' ? 13 : 10;
  const stepX = b.plane === 'near' ? 20 : 17;
  const stepY = b.plane === 'near' ? 26 : 23;
  const cols = Math.max(1, Math.floor((b.w - 18) / stepX));
  const rows = Math.max(1, Math.floor((GROUND - 26 - b.top) / stepY));
  const x0 = b.x + (b.w - (cols - 1) * stepX - winW) / 2;
  const y0 = b.top + 16;
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const s = bi * 1409 + r * 37 + c * 101;
      if (rnd(s) > ratio) continue;
      const op = cfg.winOpBase * (0.55 + rnd(s + 7) * 0.55);
      // legere variation de largeur : certaines baies doubles
      const wide = rnd(s + 11) < 0.14 && c < cols - 1;
      cells.push(
        <rect key={`${r}-${c}`}
          x={x0 + c * stepX} y={y0 + r * stepY}
          width={wide ? winW + stepX : winW} height={winH}
          fill={cfg.winColor} opacity={Math.min(op, 1)} />,
      );
    }
  }
  return <g>{cells}</g>;
};

const renderRoof = (b: Building, cfg: Intensity, fill: string): React.ReactNode => {
  const cx = b.x + b.w / 2;
  const items: React.ReactNode[] = [];
  if (b.roof === 'gradins') {
    // retraits successifs au-dessus du corps principal
    items.push(
      <g key="gr">
        <rect x={b.x + b.w * 0.14} y={b.top - 26} width={b.w * 0.72} height={26} fill={fill} />
        <rect x={b.x + b.w * 0.3} y={b.top - 46} width={b.w * 0.4} height={20} fill={fill} />
      </g>,
    );
  }
  if (b.roof === 'spire') {
    items.push(
      <g key="sp">
        <rect x={cx - b.w * 0.18} y={b.top - 30} width={b.w * 0.36} height={30} fill={fill} />
        <polygon points={`${cx - 10},${b.top - 30} ${cx + 10},${b.top - 30} ${cx},${b.top - 88}`} fill={fill} />
        <line x1={cx} y1={b.top - 88} x2={cx} y2={b.top - 112} stroke={fill} strokeWidth={2.5} />
        <circle cx={cx} cy={b.top - 112} r={2.5} fill="#a0524a" opacity={cfg.beaconOp} />
      </g>,
    );
  }
  if (b.roof === 'watertower') {
    items.push(
      <g key="wt" opacity={cfg.detailOp}>
        <line x1={cx - 12} y1={b.top} x2={cx - 9} y2={b.top - 16} stroke={fill} strokeWidth={2.5} />
        <line x1={cx + 12} y1={b.top} x2={cx + 9} y2={b.top - 16} stroke={fill} strokeWidth={2.5} />
        <rect x={cx - 14} y={b.top - 40} width={28} height={25} fill={fill} />
        <polygon points={`${cx - 16},${b.top - 40} ${cx + 16},${b.top - 40} ${cx},${b.top - 54}`} fill={fill} />
      </g>,
    );
  }
  if (b.roof === 'antennas') {
    items.push(
      <g key="an" opacity={cfg.detailOp}>
        <line x1={cx - b.w * 0.26} y1={b.top} x2={cx - b.w * 0.26} y2={b.top - 46} stroke={fill} strokeWidth={3} />
        <line x1={cx + b.w * 0.18} y1={b.top} x2={cx + b.w * 0.18} y2={b.top - 30} stroke={fill} strokeWidth={2} />
        <line x1={cx - b.w * 0.26 - 8} y1={b.top - 34} x2={cx - b.w * 0.26 + 8} y2={b.top - 34} stroke={fill} strokeWidth={2} />
        <circle cx={cx - b.w * 0.26} cy={b.top - 46} r={2.5} fill="#a0524a" opacity={cfg.beaconOp} />
      </g>,
    );
  }
  if (b.antenna) {
    items.push(
      <line key="a2" x1={cx + b.w * 0.22} y1={b.top} x2={cx + b.w * 0.22} y2={b.top - 34}
        stroke={fill} strokeWidth={2} opacity={cfg.detailOp} />,
    );
  }
  if (b.acUnits) {
    items.push(
      <g key="ac" opacity={cfg.detailOp}>
        <rect x={b.x + b.w * 0.16} y={b.top - 9} width={14} height={9} fill={fill} />
        <rect x={b.x + b.w * 0.55} y={b.top - 7} width={11} height={7} fill={fill} />
      </g>,
    );
  }
  return <g>{items}</g>;
};

// Enseigne verticale d'hotel sur la tour proche droite
const renderSign = (b: Building, cfg: Intensity): React.ReactNode => {
  const sx = b.x + 14;
  const sy = b.top + 40;
  const letters = ['H', 'Ô', 'T', 'E', 'L']; // HOTEL avec accent circonflexe
  return (
    <g opacity={cfg.signOp}>
      <rect x={sx - 4} y={sy - 16} width={24} height={110} fill="#0a1428" opacity={0.8} />
      {letters.map((ch, i) => (
        <text key={i} x={sx + 8} y={sy + i * 21}
          fontFamily="Helvetica, Arial, sans-serif" fontSize={17} fontWeight={700}
          fill="#c17e3a" textAnchor="middle">{ch}</text>
      ))}
    </g>
  );
};

const renderBuildings = (cfg: Intensity): React.ReactNode => {
  const planes: Plane[] = ['far', 'mid', 'near'];
  return (
    <g>
      {planes.map((plane) => (
        <g key={plane}>
          {BUILDINGS.filter((b) => b.plane === plane).map((b, i) => {
            const bi = BUILDINGS.indexOf(b);
            const { fill, op } = planeFill(cfg, plane);
            const bottom = plane === 'far' ? STREET_TOP + 6 : GROUND;
            return (
              <g key={i} opacity={op}>
                <rect x={b.x} y={b.top} width={b.w} height={bottom - b.top} fill={fill} />
                {renderRoof(b, cfg, fill)}
                {/* liseret lunaire discret sur l'arete EXTERIEURE du cluster
                    (jamais du cote du vide central) */}
                {plane === 'near' ? (
                  <rect x={b.x + b.w / 2 < 960 ? b.x : b.x + b.w - 2} y={b.top}
                    width={2} height={bottom - b.top}
                    fill="#f0e8d2" opacity={cfg.edgeOp} />
                ) : null}
                {renderWindows(b, bi, cfg)}
                {b.sign ? renderSign(b, cfg) : null}
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
};

// Crete lointaine derriere le filet : silhouettes quasi fondues dans le fond
const renderCenterRidge = (cfg: Intensity): React.ReactNode => (
  <g opacity={cfg.ridgeOp}>
    {CENTER_RIDGE.map((r, i) => (
      <rect key={i} x={r.x} y={r.top} width={r.w} height={STREET_TOP + 8 - r.top}
        fill={cfg.farFill} />
    ))}
    {/* rares lueurs dans la crete, tres faibles */}
    {CENTER_RIDGE.map((r, i) =>
      rnd(i * 31 + 5) < 0.4 ? (
        <rect key={`w${i}`} x={r.x + 10 + rnd(i * 7) * (r.w - 20)} y={r.top + 8}
          width={4} height={5} fill={cfg.winColor} opacity={0.5} />
      ) : null,
    )}
  </g>
);

const renderCar = (
  c: { x: number; w: number; van?: boolean }, y: number, h: number,
  cfg: Intensity, key: number,
): React.ReactNode => {
  const body = '#0b1730';
  const cabinH = c.van ? h * 0.9 : h * 0.55;
  const cabinW = c.van ? c.w * 0.92 : c.w * 0.52;
  const cabinX = c.van ? c.x + c.w * 0.04 : c.x + c.w * 0.22;
  const wr = h * 0.22;
  return (
    <g key={key}>
      <rect x={cabinX} y={y - cabinH} width={cabinW} height={cabinH} rx={4} fill={body} />
      <rect x={c.x} y={y - h * 0.5} width={c.w} height={h * 0.5} rx={3} fill={body} />
      {/* vitre faiblement eclairee */}
      <rect x={cabinX + cabinW * 0.12} y={y - cabinH + 3}
        width={cabinW * 0.3} height={Math.max(3, cabinH * 0.3)}
        fill={cfg.winColor} opacity={cfg.winOpBase * 0.35} />
      <circle cx={c.x + c.w * 0.2} cy={y} r={wr} fill="#060d1d" />
      <circle cx={c.x + c.w * 0.8} cy={y} r={wr} fill="#060d1d" />
    </g>
  );
};

const renderStreet = (cfg: Intensity): React.ReactNode => {
  const lampColor = '#0b1730';
  return (
    <g>
      {/* rangee basse de commerces derriere le trottoir (sous le filet) */}
      <rect x={0} y={806} width={1920} height={STREET_TOP - 806 + 4} fill={cfg.streetShopRow} />
      {/* devantures : vitrines ambre au rythme irregulier */}
      {Array.from({ length: 30 }, (_, i) => {
        const s = i * 61 + 13;
        if (rnd(s) > 0.55) return null;
        const x = 30 + i * 63 + rnd(s + 1) * 18;
        const w = 22 + rnd(s + 2) * 26;
        return (
          <g key={i}>
            <rect x={x} y={828} width={w} height={18} fill={cfg.winColor} opacity={cfg.shopWinOp} />
            <rect x={x} y={846} width={w} height={3} fill={cfg.winColor} opacity={cfg.shopWinOp * 0.35} />
          </g>
        );
      })}
      {/* trottoir arriere */}
      <rect x={0} y={STREET_TOP} width={1920} height={34} fill={cfg.streetWalk} />
      <rect x={0} y={STREET_TOP} width={1920} height={2} fill="#f0e8d2" opacity={0.05} />
      {/* chaussee */}
      <rect x={0} y={884} width={1920} height={158} fill={cfg.streetRoad} />
      {/* marquage axial discontinu */}
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={i * 124 + 18} y={958} width={54} height={4}
          fill="#f0e8d2" opacity={cfg.markingOp} />
      ))}
      {/* passage pieton a gauche */}
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={`z${i}`} x={70 + i * 26} y={894} width={14} height={138}
          fill="#f0e8d2" opacity={cfg.markingOp * 0.38} />
      ))}
      {/* trottoir avant (bord bas du cadre) */}
      <rect x={0} y={1042} width={1920} height={38} fill={cfg.streetWalk} />
      <rect x={0} y={1042} width={1920} height={2} fill="#f0e8d2" opacity={0.05} />

      {/* vehicules a l'arret, profil */}
      {CARS.filter((c) => c.lane === 'back').map((c, i) => renderCar(c, 916, 26, cfg, i))}
      {CARS.filter((c) => c.lane === 'front').map((c, i) => renderCar(c, 1030, 34, cfg, i + 50))}

      {/* lampadaires du trottoir arriere — tetes SOUS la bande du filet
          (y=790..824) pour ne jamais meler leurs halos dores au filet */}
      {LAMPS_BACK.map((lx, i) => (
        <g key={i}>
          <line x1={lx} y1={880} x2={lx} y2={832} stroke={lampColor} strokeWidth={3.5} />
          <line x1={lx} y1={833} x2={lx + 14} y2={833} stroke={lampColor} strokeWidth={3} />
          <circle cx={lx + 17} cy={835} r={3.6} fill="#d9a93a" opacity={cfg.glowOp + 0.2} />
          <circle cx={lx + 17} cy={837} r={12} fill="#d9a93a" opacity={cfg.glowOp * 0.24} />
          {/* flaque de lumiere au sol */}
          <ellipse cx={lx + 17} cy={STREET_TOP + 8} rx={24} ry={5}
            fill="#d9a93a" opacity={cfg.glowOp * 0.16} />
        </g>
      ))}

      {/* poteaux nus + cables (sous la bande du filet egalement) */}
      {POLES.map((px, i) => (
        <g key={`p${i}`}>
          <line x1={px} y1={880} x2={px} y2={828} stroke={lampColor} strokeWidth={3} />
          <line x1={px - 10} y1={836} x2={px + 10} y2={836} stroke={lampColor} strokeWidth={2} />
        </g>
      ))}
      <path d={`M ${POLES[0]} 837 Q ${(POLES[0] + POLES[1]) / 2} 848 ${POLES[1]} 837`}
        stroke={lampColor} strokeWidth={1.5} fill="none" opacity={0.8} />
      <path d={`M ${POLES[1]} 837 Q ${(POLES[1] + POLES[2]) / 2} 848 ${POLES[2]} 837`}
        stroke={lampColor} strokeWidth={1.5} fill="none" opacity={0.8} />

      {/* feu tricolore (boitier sous y=824) */}
      <g>
        <line x1={700} y1={880} x2={700} y2={850} stroke={lampColor} strokeWidth={3.5} />
        <rect x={694} y={826} width={12} height={26} rx={3} fill={lampColor} />
        <circle cx={700} cy={832} r={2.6} fill="#a0524a" opacity={cfg.beaconOp} />
        <circle cx={700} cy={839} r={2.6} fill="#b08948" opacity={cfg.beaconOp * 0.35} />
        <circle cx={700} cy={846} r={2.6} fill="#5f8a63" opacity={cfg.beaconOp * 0.45} />
      </g>
    </g>
  );
};

// Halo d'horizon : assoit la crete lointaine, tres discret
const renderHorizonHaze = (cfg: Intensity): React.ReactNode => (
  <g>
    <defs>
      <linearGradient id={`${cfg.id}-haze`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2e4169" stopOpacity={0} />
        <stop offset="1" stopColor="#2e4169" stopOpacity={cfg.ridgeOp * 0.5} />
      </linearGradient>
    </defs>
    <rect x={0} y={720} width={1920} height={STREET_TOP - 720} fill={`url(#${cfg.id}-haze)`} />
  </g>
);

const renderSkyline = (cfg: Intensity): React.ReactElement => (
  <g>
    {renderHorizonHaze(cfg)}
    {renderCenterRidge(cfg)}
    {renderBuildings(cfg)}
    {renderStreet(cfg)}
  </g>
);

// --- EXPORTS -----------------------------------------------------------------

export const SkylineAttenue: React.FC = () => renderSkyline(ATTENUE);

export const SkylinePlein: React.FC = () => renderSkyline(PLEIN);

// =============================================================================
// SKYLINE REACTIF — le decor PARTICIPE (test du 2026-07-29, 2e manche)
//
// Verdict de la 1re manche : la ligne de partage n'est pas riche vs vide, c'est
// PARTICIPANT vs DECORATIF. Un decor inerte nuit meme attenue. Ce composant teste
// l'autre branche : le meme decor, mais qui REAGIT au geste central.
//
// ⛔ PROTOCOLE : la GEOMETRIE est celle d'ATTENUE, a l'identique (memes tours,
// memes fenetres, meme rue). SEULES varient les valeurs pilotees par `reaction`.
// Si cette variante bat B, c'est la REACTION qui l'explique — pas un dessin
// different. C'est pour ca qu'on reprend le PERDANT tel quel.
//
// `reaction` in [0,1] : 0 = ville normale · 1 = ville qui accuse le coup
// (fenetres eteintes, halos baisses, enseignes coupees, marquage efface).
// L'appelant construit sa courbe sur l'arc reel de la scene — pas un flash.
// =============================================================================
export const SkylineReactif: React.FC<{ reaction: number }> = ({ reaction }) => {
  const r = Math.max(0, Math.min(1, reaction));
  const lerp = (a: number, b: number) => a + (b - a) * r;
  // Etat "ville qui accuse le coup" : on ETEINT, on ne rallume rien. Les fenetres
  // tombent presque a zero, les halos et enseignes suivent, le bati reste (une
  // ville ne disparait pas — elle s'eteint).
  const cfg: Intensity = {
    ...ATTENUE,
    // id variable : il sert de cle aux <defs> des degrades. Fixe, les degrades
    // resteraient figes sur la 1re frame. Quantifie pour limiter le nombre de defs.
    id: `att-r${Math.round(r * 20)}`,
    litNear: lerp(ATTENUE.litNear, 0.008),
    litMid: lerp(ATTENUE.litMid, 0.004),
    winOpBase: lerp(ATTENUE.winOpBase, 0.05),
    glowOp: lerp(ATTENUE.glowOp, 0.03),
    signOp: lerp(ATTENUE.signOp, 0.0),
    beaconOp: lerp(ATTENUE.beaconOp, 0.06),
    shopWinOp: lerp(ATTENUE.shopWinOp, 0.02),
    markingOp: lerp(ATTENUE.markingOp, 0.04),
    detailOp: lerp(ATTENUE.detailOp, 0.3),
  };
  return renderSkyline(cfg);
};
