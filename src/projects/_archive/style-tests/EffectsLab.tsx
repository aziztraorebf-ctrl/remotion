import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Lottie } from "@remotion/lottie";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const smokeData = require("../../../public/assets/Lottie files/smoke_postin.json");

// ============================================================
// EFFECTS LAB — Demo comparative 9 techniques
// Seg 1 (0-299f)    : Baseline — SVG pur, aucun effet
// Seg 2 (300-599f)  : Grain anime + Fumee SVG
// Seg 3 (600-899f)  : spring() physique sur personnages
// Seg 4 (900-1199f) : Stroke-dasharray — dessin progressif
// Seg 5 (1200-1499f): Vignette + source lumineuse directionnelle
// Seg 6 (1500-1799f): Split-screen enluminure / gravure
// Seg 7 (1800-2099f): Lottie smoke vs SVG smoke — comparaison directe
// Seg 8 (2100-2399f): Animation marche Math.sin() — bras, jambes, corps
// Seg 9 (2400-2699f): Carte propagation — dessin progressif + cercles
// Seg10 (2700-2999f): Micro-expressions — clignement, peur, bouche, flash, taches
//
// 3000 frames @ 30fps = 100 secondes
// SANDBOX : ne pas modifier HookBlocA/B
// ============================================================

const C = {
  parchment:   "#F5E6C8",
  parchmentD:  "#E8D4A8",
  parchmentDD: "#D4B896",
  ink:         "#1A1008",
  inkLight:    "#6B5030",
  gold:        "#C9A227",
  goldDark:    "#8B6914",
  skyBlue:     "#2D3A8C",
  vermillon:   "#C1392B",
  seaBlue:     "#1B4F8C",
} as const;

const W = 1920;
const H = 1080;
const SEG = 300;
const TOTAL = SEG * 10;

// ── Helpers partagés ─────────────────────────────────────────

function SegmentLabel({ text, sub }: { text: string; sub: string }) {
  return (
    <g>
      <rect x={40} y={40} width={580} height={90} rx={6}
        fill={C.ink} opacity={0.85} />
      <text x={60} y={88} fontFamily="Georgia, serif" fontSize={28}
        fill={C.parchment} fontWeight="bold">{text}</text>
      <text x={60} y={118} fontFamily="Georgia, serif" fontSize={18}
        fill={C.parchmentD}>{sub}</text>
    </g>
  );
}

function ParchmentBackground() {
  return (
    <>
      <rect width={W} height={H} fill={C.parchment} />
      <line x1={0} y1={320} x2={W} y2={310} stroke={C.parchmentD} strokeWidth={1} opacity={0.5} />
      <line x1={0} y1={640} x2={W} y2={655} stroke={C.parchmentD} strokeWidth={1} opacity={0.4} />
      <rect x={30} y={30} width={W - 60} height={H - 60}
        fill="none" stroke={C.inkLight} strokeWidth={2} opacity={0.4} />
    </>
  );
}

// Batiments avec paths exportables pour stroke-dasharray
const CHURCH_BODY   = "M800,500 L800,780 L1100,780 L1100,500 L950,380 Z";
const CHURCH_TOWER  = "M910,380 L910,260 L990,260 L990,380";
const HOUSE_LEFT    = "M120,780 L120,580 L230,480 L340,580 L340,780";
const HOUSE_RIGHT   = "M1520,780 L1520,600 L1650,500 L1780,600 L1780,780";
const GROUND_LINE   = `M80,780 L${W - 80},780`;

function VillageBuildings() {
  return (
    <g>
      <path d={HOUSE_LEFT} fill={C.parchmentD} stroke={C.ink} strokeWidth={2.5} />
      <rect x={190} y={680} width={60} height={100} fill={C.parchmentDD} stroke={C.ink} strokeWidth={2} />
      <rect x={140} y={620} width={55} height={45} fill="none" stroke={C.ink} strokeWidth={2} />
      <line x1={147} y1={627} x2={187} y2={657} stroke={C.vermillon} strokeWidth={2.5} />
      <line x1={187} y1={627} x2={147} y2={657} stroke={C.vermillon} strokeWidth={2.5} />

      <path d={CHURCH_BODY} fill={C.parchmentD} stroke={C.ink} strokeWidth={2.5} />
      <path d={CHURCH_TOWER} fill={C.parchmentD} stroke={C.ink} strokeWidth={2} />
      <polygon points="910,260 950,200 990,260" fill={C.parchmentDD} stroke={C.ink} strokeWidth={2} />
      <line x1={950} y1={208} x2={950} y2={240} stroke={C.ink} strokeWidth={3} />
      <line x1={934} y1={222} x2={966} y2={222} stroke={C.ink} strokeWidth={3} />
      <path d="M890,780 L890,660 Q950,620 1010,660 L1010,780Z" fill={C.parchmentDD} stroke={C.ink} strokeWidth={2} />

      <path d={HOUSE_RIGHT} fill={C.parchmentD} stroke={C.ink} strokeWidth={2.5} />
      <rect x={1600} y={690} width={55} height={90} fill={C.parchmentDD} stroke={C.ink} strokeWidth={2} />
      <rect x={1540} y={640} width={50} height={40} fill="none" stroke={C.ink} strokeWidth={2} />

      <path d={GROUND_LINE} stroke={C.inkLight} strokeWidth={1.5} opacity={0.6} />
    </g>
  );
}

function ThomasFigure({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-18} y={-80} width={36} height={55} fill={C.parchmentD} stroke={C.ink} strokeWidth={2} />
      <circle cx={0} cy={-95} r={22} fill={C.parchmentD} stroke={C.ink} strokeWidth={2} />
      <path d="M-18,-105 Q0,-130 18,-105" fill={C.inkLight} stroke={C.ink} strokeWidth={1.5} />
      <circle cx={8} cy={-95} r={3} fill={C.ink} />
      <line x1={-18} y1={-70} x2={-45} y2={-30} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={-45} y1={-30} x2={-45} y2={30} stroke={C.inkLight} strokeWidth={2} />
      <line x1={-50} y1={-10} x2={-50} y2={-30} stroke={C.inkLight} strokeWidth={2} />
      <line x1={-40} y1={-10} x2={-40} y2={-30} stroke={C.inkLight} strokeWidth={2} />
      <line x1={18} y1={-70} x2={40} y2={-45} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={-10} y1={-25} x2={-15} y2={20} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={10} y1={-25} x2={15} y2={20} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

function SmokeParticle({ cx, cy, r, opacity, frame, delay }: {
  cx: number; cy: number; r: number; opacity: number; frame: number; delay: number;
}) {
  const t = (frame + delay * 30) % 120;
  const rise = interpolate(t, [0, 120], [0, -180], { extrapolateRight: "clamp" });
  const drift = Math.sin((frame + delay * 20) * 0.04) * 20;
  const fade = interpolate(t, [0, 60, 120], [0, opacity, 0]);
  const grow = interpolate(t, [0, 120], [r * 0.5, r * 2]);
  return <circle cx={cx + drift} cy={cy + rise} r={grow} fill={C.inkLight} opacity={fade} />;
}

function ChimneySmoke({ x, y, frame }: { x: number; y: number; frame: number }) {
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <SmokeParticle key={i} cx={x} cy={y} r={8 + i * 4}
          opacity={0.18 - i * 0.03} frame={frame} delay={i * 0.4} />
      ))}
    </g>
  );
}

function FilmGrainOverlay({ frame, intensity = 0.05 }: { frame: number; intensity?: number }) {
  const seed = frame % 60;
  return (
    <g>
      <defs>
        <filter id="film-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed={seed} result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
          <feComponentTransfer in="blended"><feFuncA type="linear" slope="1" /></feComponentTransfer>
        </filter>
      </defs>
      <rect width={W} height={H} fill={C.inkLight} opacity={intensity}
        filter="url(#film-grain)" style={{ mixBlendMode: "multiply" }} />
    </g>
  );
}

// ── Utilitaire : longueur approximative d'un path SVG ────────
// Pour stroke-dasharray, on utilise des valeurs precalculees
const PATH_LENGTHS: Record<string, number> = {
  churchBody:  1200,
  churchTower: 320,
  houseLeft:   800,
  houseRight:  800,
  groundLine:  W - 160,
};

// ── SEGMENT 1 : Baseline ─────────────────────────────────────
function Segment1Baseline({ frame }: { frame: number }) {
  const thomasX = interpolate(frame, [0, 200], [400, 520],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g>
      <ParchmentBackground />
      <VillageBuildings />
      <ThomasFigure x={thomasX} y={760} />
      <SegmentLabel text="SEGMENT 1 — Baseline" sub="SVG pur, interpolate() lineaire, aucun effet" />
      <text x={W / 2} y={H - 60} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={20} fill={C.inkLight} opacity={0.6}>
        Mouvement lineaire — image numerique plate
      </text>
    </g>
  );
}

// ── SEGMENT 2 : Grain + Fumee ────────────────────────────────
function Segment2Grain({ frame }: { frame: number }) {
  const localF = frame - SEG;
  const thomasX = interpolate(localF, [0, 200], [400, 520],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const grainIntensity = interpolate(localF, [0, 150, 299], [0.03, 0.06, 0.09],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g>
      <ParchmentBackground />
      <VillageBuildings />
      <ChimneySmoke x={230} y={480} frame={localF} />
      <ChimneySmoke x={1650} y={500} frame={localF + 15} />
      <ThomasFigure x={thomasX} y={760} />
      <FilmGrainOverlay frame={localF} intensity={grainIntensity} />
      <SegmentLabel text="SEGMENT 2 — Grain + Fumee SVG" sub="feTurbulence anime + particules ascendantes" />
      <text x={W / 2} y={H - 60} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={20} fill={C.inkLight} opacity={0.6}>
        Parchemin vivant — grain progresse, cheminees fument
      </text>
    </g>
  );
}

// ── SEGMENT 3 : spring() ─────────────────────────────────────
function Segment3Spring({ frame, fps }: { frame: number; fps: number }) {
  const localF = frame - SEG * 2;
  const thomasSpring = spring({ frame: localF, fps,
    config: { damping: 14, stiffness: 180, mass: 1.2 }, from: 0, to: 1 });
  const thomasX = interpolate(thomasSpring, [0, 1], [250, 520]);
  const forcheTilt = localF > 150
    ? spring({ frame: localF - 150, fps,
        config: { damping: 8, stiffness: 240 }, from: 0, to: -12 })
    : 0;
  const agnes = spring({ frame: Math.max(0, localF - 60), fps,
    config: { damping: 18, stiffness: 150 }, from: 0, to: 1 });
  const agnesX = interpolate(agnes, [0, 1], [1600, 1400]);
  const agnesOpacity = interpolate(agnes, [0, 0.05, 1], [0, 1, 1]);
  const grainIntensity = interpolate(localF, [0, 299], [0.06, 0.10],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g>
      <ParchmentBackground />
      <VillageBuildings />
      <ChimneySmoke x={230} y={480} frame={localF} />
      <ChimneySmoke x={1650} y={500} frame={localF + 15} />
      <g transform={`translate(${thomasX}, 760) rotate(${forcheTilt}, 0, 0)`}>
        <ThomasFigure x={0} y={0} />
      </g>
      <g opacity={agnesOpacity}>
        <g transform={`translate(${agnesX}, 755)`}>
          <rect x={-16} y={-75} width={32} height={50} fill={C.parchmentD} stroke={C.ink} strokeWidth={2} />
          <circle cx={0} cy={-90} r={20} fill={C.parchmentD} stroke={C.ink} strokeWidth={2} />
          <path d="M-20,-95 Q0,-120 20,-95 L20,-108 Q0,-135 -20,-108Z"
            fill={C.inkLight} stroke={C.ink} strokeWidth={1.5} />
          <circle cx={7} cy={-90} r={2.5} fill={C.ink} />
          <line x1={-16} y1={-60} x2={-35} y2={-30} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={16} y1={-60} x2={35} y2={-35} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={-8} y1={-25} x2={-12} y2={18} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={8} y1={-25} x2={12} y2={18} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      </g>
      <FilmGrainOverlay frame={localF} intensity={grainIntensity} />
      <SegmentLabel text="SEGMENT 3 — spring() physique" sub="Entrees en rebond, poids naturel, Agnes apparait" />
      <text x={W / 2} y={H - 60} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={20} fill={C.inkLight} opacity={0.6}>
        Personnages avec masse — spring() natif Remotion, export garanti
      </text>
    </g>
  );
}

// ── SEGMENT 4 : Dessin progressif (stroke-dasharray) ─────────
function Segment4DrawOn({ frame }: { frame: number }) {
  const localF = frame - SEG * 3;

  // Chaque element se dessine sequentiellement
  // Sol : 0-40f | Maison gauche : 20-80f | Eglise : 60-160f | Maison droite : 140-200f | Thomas : 180-240f
  const drawGround    = interpolate(localF, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drawHouseL    = interpolate(localF, [20, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drawChurch    = interpolate(localF, [60, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drawTower     = interpolate(localF, [100, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drawHouseR    = interpolate(localF, [140, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drawThomas    = interpolate(localF, [180, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fonction dasharray : dash = longueur * progress, gap = longueur restant
  const dash = (len: number, progress: number) =>
    `${len * progress} ${len * (1 - progress) + 1}`;

  // Lueur de la plume — suit la progression generale
  const penX = interpolate(localF, [0, 240], [80, 1780],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const penY = interpolate(localF, [0, 40, 80, 160, 240], [780, 480, 580, 400, 660],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const penOpacity = localF > 250
    ? interpolate(localF, [250, 280], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  return (
    <g>
      <rect width={W} height={H} fill={C.parchment} />
      <rect x={30} y={30} width={W - 60} height={H - 60}
        fill="none" stroke={C.inkLight} strokeWidth={2} opacity={0.4} />

      {/* Sol */}
      <path d={GROUND_LINE} fill="none" stroke={C.inkLight} strokeWidth={1.5} opacity={0.6}
        strokeDasharray={dash(PATH_LENGTHS.groundLine, drawGround)} />

      {/* Maison gauche — outline seulement, se trace */}
      <path d={HOUSE_LEFT} fill="none" stroke={C.ink} strokeWidth={2.5}
        strokeDasharray={dash(PATH_LENGTHS.houseLeft, drawHouseL)} />
      {drawHouseL > 0.5 && (
        <>
          <line x1={147} y1={627} x2={187} y2={657} stroke={C.vermillon} strokeWidth={2.5}
            opacity={interpolate(drawHouseL, [0.5, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
          <line x1={187} y1={627} x2={147} y2={657} stroke={C.vermillon} strokeWidth={2.5}
            opacity={interpolate(drawHouseL, [0.5, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        </>
      )}

      {/* Eglise */}
      <path d={CHURCH_BODY} fill="none" stroke={C.ink} strokeWidth={2.5}
        strokeDasharray={dash(PATH_LENGTHS.churchBody, drawChurch)} />
      <path d={CHURCH_TOWER} fill="none" stroke={C.ink} strokeWidth={2}
        strokeDasharray={dash(PATH_LENGTHS.churchTower, drawTower)} />
      {drawTower > 0.8 && (
        <g opacity={interpolate(drawTower, [0.8, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <line x1={950} y1={208} x2={950} y2={240} stroke={C.ink} strokeWidth={3} />
          <line x1={934} y1={222} x2={966} y2={222} stroke={C.ink} strokeWidth={3} />
        </g>
      )}

      {/* Maison droite */}
      <path d={HOUSE_RIGHT} fill="none" stroke={C.ink} strokeWidth={2.5}
        strokeDasharray={dash(PATH_LENGTHS.houseRight, drawHouseR)} />

      {/* Thomas apparait en dernier */}
      <g opacity={drawThomas}>
        <ThomasFigure x={490} y={760} />
      </g>

      {/* Point lumineux de la plume */}
      <g opacity={penOpacity}>
        <circle cx={penX} cy={penY} r={12} fill={C.gold} opacity={0.6} />
        <circle cx={penX} cy={penY} r={5} fill={C.gold} opacity={0.9} />
      </g>

      <SegmentLabel text="SEGMENT 4 — Dessin progressif" sub="stroke-dasharray : la scene se trace comme un manuscrit" />
      <text x={W / 2} y={H - 60} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={20} fill={C.inkLight} opacity={0.6}>
        Effet plume — chaque element se dessine dans l'ordre narratif
      </text>
    </g>
  );
}

// ── SEGMENT 5 : Vignette + source lumineuse ──────────────────
function Segment5Light({ frame }: { frame: number }) {
  const localF = frame - SEG * 4;

  // Torche se deplace : entre depuis la gauche, s'arrete au centre-gauche
  const torchX = interpolate(localF, [0, 60], [150, 380],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const torchY = 680;

  // Intensite lumineuse pulse legerement (flamme)
  const flicker = 1 + Math.sin(localF * 0.3) * 0.08;
  const lightRadius = 520 * flicker;

  // Nuit progressive : le fond s'assombrit
  const nightProgress = interpolate(localF, [0, 120], [0, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Ombres portees : les batiments projettent vers la droite
  const shadowLen = interpolate(localF, [60, 180], [0, 80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g>
      <defs>
        {/* Lueur de la torche — radial gradient */}
        <radialGradient id="torchLight" cx={torchX / W} cy={torchY / H}
          r={lightRadius / W} gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#E8A020" stopOpacity="0.45" />
          <stop offset="30%" stopColor="#C9A227" stopOpacity="0.2" />
          <stop offset="70%" stopColor={C.parchmentD} stopOpacity="0.05" />
          <stop offset="100%" stopColor={C.ink} stopOpacity="0" />
        </radialGradient>
        {/* Vignette sombre sur les bords */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <stop offset="80%" stopColor={C.ink} stopOpacity="0" />
          <stop offset="100%" stopColor={C.ink} stopOpacity={0.6} />
        </radialGradient>
        <filter id="torchGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <ParchmentBackground />

      {/* Voile de nuit progressif */}
      <rect width={W} height={H} fill={C.ink} opacity={nightProgress} />

      <VillageBuildings />

      {/* Ombres portees depuis la torche vers la droite */}
      {shadowLen > 0 && (
        <g opacity={0.25}>
          <polygon
            points={`${340},580 ${340 + shadowLen * 2},580 ${340 + shadowLen * 2},780 ${340},780`}
            fill={C.ink} />
          <polygon
            points={`1100,380 ${1100 + shadowLen * 3},500 ${1100 + shadowLen * 3},780 1100,780`}
            fill={C.ink} />
        </g>
      )}

      {/* Lueur de la torche */}
      <rect width={W} height={H} fill="url(#torchLight)" />

      {/* La torche elle-meme */}
      <g filter="url(#torchGlow)">
        {/* Manche */}
        <rect x={torchX - 3} y={torchY - 40} width={6} height={50}
          fill={C.inkLight} stroke={C.ink} strokeWidth={1} />
        {/* Flamme */}
        <ellipse cx={torchX} cy={torchY - 52} rx={8 * flicker} ry={14 * flicker}
          fill="#E8A020" opacity={0.9} />
        <ellipse cx={torchX} cy={torchY - 58} rx={5 * flicker} ry={9 * flicker}
          fill="#F5D060" opacity={0.8} />
      </g>

      <ChimneySmoke x={230} y={480} frame={localF} />
      <ThomasFigure x={490} y={760} />

      {/* Vignette bords */}
      <rect width={W} height={H} fill="url(#vignette)" />

      <SegmentLabel text="SEGMENT 5 — Vignette + Torche" sub="Gradient radial pulse + ombres portees + nuit progressive" />
      <text x={W / 2} y={H - 60} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={20} fill={C.parchmentD} opacity={0.8}>
        Atmosphere nocturne — une torche eclaire Saint-Pierre
      </text>
    </g>
  );
}

// ── SEGMENT 6 : Split-screen enluminure / gravure ────────────
function Segment6SplitScreen({ frame }: { frame: number }) {
  const localF = frame - SEG * 5;

  // Ligne de separation : commence au centre, puis stable
  const splitX = interpolate(localF, [0, 60], [W / 2, W / 2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Etiquettes apparaissent
  const labelOpacity = interpolate(localF, [30, 70], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Cote gauche : enluminure (couleur)
  // Cote droit  : gravure (monochrome + traits)
  const grainIntensity = interpolate(localF, [0, 299], [0.04, 0.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g>
      <defs>
        {/* Clip gauche : enluminure */}
        <clipPath id="clipLeft">
          <rect x={0} y={0} width={splitX} height={H} />
        </clipPath>
        {/* Clip droit : gravure */}
        <clipPath id="clipRight">
          <rect x={splitX} y={0} width={W - splitX} height={H} />
        </clipPath>
        {/* Filtre grayscale pour le cote gravure */}
        <filter id="grayscale">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.1" intercept="-0.05" />
            <feFuncG type="linear" slope="1.1" intercept="-0.05" />
            <feFuncB type="linear" slope="1.1" intercept="-0.05" />
          </feComponentTransfer>
        </filter>
      </defs>

      {/* COTE GAUCHE — Enluminure (couleur vivante) */}
      <g clipPath="url(#clipLeft)">
        <rect width={W} height={H} fill={C.parchment} />
        {/* Ciel bleu enluminure */}
        <rect x={0} y={0} width={W} height={400} fill={C.skyBlue} opacity={0.25} />
        {/* Batiments avec couleurs */}
        <path d={HOUSE_LEFT} fill={C.parchmentD} stroke={C.ink} strokeWidth={2.5} />
        <rect x={190} y={680} width={60} height={100} fill={C.parchmentDD} stroke={C.ink} strokeWidth={2} />
        <path d={CHURCH_BODY} fill={C.parchmentD} stroke={C.ink} strokeWidth={2.5} />
        <path d={CHURCH_TOWER} fill={C.parchmentD} stroke={C.ink} strokeWidth={2} />
        {/* Clocher dore */}
        <polygon points="910,260 950,200 990,260" fill={C.goldDark} stroke={C.gold} strokeWidth={2} />
        <line x1={950} y1={208} x2={950} y2={240} stroke={C.gold} strokeWidth={3} />
        <line x1={934} y1={222} x2={966} y2={222} stroke={C.gold} strokeWidth={3} />
        <path d="M890,780 L890,660 Q950,620 1010,660 L1010,780Z" fill={C.parchmentDD} stroke={C.ink} strokeWidth={2} />
        <path d={HOUSE_RIGHT} fill={C.parchmentD} stroke={C.ink} strokeWidth={2.5} />
        <path d={GROUND_LINE} stroke={C.inkLight} strokeWidth={1.5} opacity={0.6} />
        <ThomasFigure x={490} y={760} />
        {/* Titre cote gauche */}
        <g opacity={labelOpacity}>
          <rect x={60} y={820} width={280} height={50} rx={4}
            fill={C.skyBlue} opacity={0.85} />
          <text x={200} y={852} textAnchor="middle"
            fontFamily="Georgia, serif" fontSize={22} fill={C.parchment} fontWeight="bold">
            AVANT — 1346
          </text>
          <text x={200} y={875} textAnchor="middle"
            fontFamily="Georgia, serif" fontSize={16} fill={C.parchmentD}>
            Style enluminure · couleur
          </text>
        </g>
      </g>

      {/* COTE DROIT — Gravure (monochrome + contraste) */}
      <g clipPath="url(#clipRight)" filter="url(#grayscale)">
        <rect width={W} height={H} fill={C.parchmentDD} />
        <path d={HOUSE_LEFT} fill={C.parchmentDD} stroke={C.ink} strokeWidth={3} />
        <line x1={147} y1={627} x2={187} y2={657} stroke={C.ink} strokeWidth={3} />
        <line x1={187} y1={627} x2={147} y2={657} stroke={C.ink} strokeWidth={3} />
        <path d={CHURCH_BODY} fill={C.parchmentDD} stroke={C.ink} strokeWidth={3} />
        {/* Hachures sur l'eglise — style gravure */}
        {[500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760].map((y) => (
          <line key={y} x1={810} y1={y} x2={830} y2={y}
            stroke={C.ink} strokeWidth={1} opacity={0.4} />
        ))}
        <path d={CHURCH_TOWER} fill={C.parchmentDD} stroke={C.ink} strokeWidth={2.5} />
        <polygon points="910,260 950,200 990,260" fill={C.parchmentDD} stroke={C.ink} strokeWidth={2.5} />
        <line x1={950} y1={208} x2={950} y2={240} stroke={C.ink} strokeWidth={3} />
        <line x1={934} y1={222} x2={966} y2={222} stroke={C.ink} strokeWidth={3} />
        <path d="M890,780 L890,660 Q950,620 1010,660 L1010,780Z" fill={C.parchmentDD} stroke={C.ink} strokeWidth={2.5} />
        <path d={HOUSE_RIGHT} fill={C.parchmentDD} stroke={C.ink} strokeWidth={3} />
        <path d={GROUND_LINE} stroke={C.ink} strokeWidth={2} opacity={0.8} />
        {/* Thomas en gravure — silhouette plus sombre */}
        <g transform="translate(490, 760)">
          <rect x={-18} y={-80} width={36} height={55} fill={C.inkLight} stroke={C.ink} strokeWidth={2} />
          <circle cx={0} cy={-95} r={22} fill={C.inkLight} stroke={C.ink} strokeWidth={2} />
          <circle cx={8} cy={-95} r={3} fill={C.ink} />
          <line x1={-18} y1={-70} x2={-45} y2={-30} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={18} y1={-70} x2={40} y2={-45} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={-10} y1={-25} x2={-15} y2={20} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={10} y1={-25} x2={15} y2={20} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
        </g>
        {/* Grain gravure */}
        <FilmGrainOverlay frame={localF} intensity={grainIntensity} />
        {/* Titre cote droit */}
        <g opacity={labelOpacity}>
          <rect x={splitX + 60} y={820} width={300} height={50} rx={4}
            fill={C.ink} opacity={0.85} />
          <text x={splitX + 210} y={852} textAnchor="middle"
            fontFamily="Georgia, serif" fontSize={22} fill={C.parchment} fontWeight="bold">
            PENDANT — 1348
          </text>
          <text x={splitX + 210} y={875} textAnchor="middle"
            fontFamily="Georgia, serif" fontSize={16} fill={C.parchmentD}>
            Style gravure · monochrome
          </text>
        </g>
      </g>

      {/* Ligne de separation */}
      <line x1={splitX} y1={0} x2={splitX} y2={H}
        stroke={C.gold} strokeWidth={3} opacity={0.9} />
      {/* Ornement sur la ligne */}
      <circle cx={splitX} cy={H / 2} r={18} fill={C.gold} opacity={0.9} />
      <circle cx={splitX} cy={H / 2} r={10} fill={C.parchment} />
      <line x1={splitX} y1={H / 2 - 40} x2={splitX} y2={H / 2 - 25}
        stroke={C.gold} strokeWidth={3} />
      <line x1={splitX} y1={H / 2 + 25} x2={splitX} y2={H / 2 + 40}
        stroke={C.gold} strokeWidth={3} />

      <SegmentLabel text="SEGMENT 6 — Split-screen" sub="Enluminure (gauche) vs Gravure (droite) — clipPath + feColorMatrix" />
      <text x={W / 2} y={H - 60} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={20} fill={C.inkLight} opacity={0.7}>
        Dualite visuelle : avant / pendant la peste — une seule composition
      </text>
    </g>
  );
}

// ── Segment 7 : Lottie vs SVG smoke ──────────────────────────
function Segment7Lottie({ frame }: { frame: number }) {
  const localFrame = frame - SEG * 6;

  // Split-screen : Lottie gauche, SVG pur droite
  const splitX = W / 2;

  // SVG smoke (meme code que Segment 2)
  const smokeOpacity = interpolate(localFrame, [0, 40], [0, 0.7],
    { extrapolateRight: "clamp" });
  const smokePuffs = Array.from({ length: 5 }, (_, i) => {
    const offset = (i * 60) % 180;
    const rise  = (localFrame * 0.6 + offset) % 180;
    const sway  = Math.sin((localFrame + offset) * 0.04) * 18;
    return { x: 550 + sway, y: 400 - rise, r: 14 + i * 3, op: (1 - rise / 180) * 0.55 };
  });

  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill={C.parchment} />

      {/* --- Gauche : Lottie (rendu via foreignObject hors SVG) --- */}
      <clipPath id="leftClip7">
        <rect x={0} y={0} width={splitX} height={H} />
      </clipPath>
      <g clipPath="url(#leftClip7)">
        <rect x={0} y={0} width={splitX} height={H} fill={C.parchmentD} />
        <rect x={220} y={500} width={180} height={300} rx={4} fill={C.inkLight} opacity={0.6} />
        <text x={310} y={870} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={22} fill={C.ink} opacity={0.5}>
          Lottie JSON
        </text>
        <text x={310} y={420} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={15} fill={C.inkLight} opacity={0.7}>
          (voir zone Lottie ci-dessus)
        </text>
      </g>

      {/* --- Droite : SVG pur --- */}
      <clipPath id="rightClip7">
        <rect x={splitX} y={0} width={splitX} height={H} />
      </clipPath>
      <g clipPath="url(#rightClip7)" opacity={smokeOpacity}>
        <rect x={splitX} y={0} width={splitX} height={H} fill={C.parchmentD} />
        <rect x={splitX + 270} y={500} width={180} height={300} rx={4} fill={C.inkLight} opacity={0.6} />
        {smokePuffs.map((p, i) => (
          <ellipse key={i}
            cx={splitX + p.x} cy={p.y} rx={p.r * 1.4} ry={p.r}
            fill={C.inkLight} opacity={p.op} />
        ))}
        <text x={splitX + 360} y={870} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={22} fill={C.ink} opacity={0.5}>
          SVG pur (code)
        </text>
      </g>

      {/* --- Separateur --- */}
      <line x1={splitX} y1={60} x2={splitX} y2={H - 60}
        stroke={C.gold} strokeWidth={3} strokeDasharray="8 4" />
      <polygon
        points={`${splitX},${H / 2 - 20} ${splitX + 16},${H / 2} ${splitX},${H / 2 + 20} ${splitX - 16},${H / 2}`}
        fill={C.gold} />

      <SegmentLabel text="SEGMENT 7 — Lottie vs SVG fumee"
        sub="Gauche : @remotion/lottie (JSON) — Droite : SVG pur Remotion" />
      <text x={W / 2} y={H - 60} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={20} fill={C.inkLight} opacity={0.7}>
        Comparer style, transparence et integration au style medieval
      </text>
    </g>
  );
}

// ── Segment 8 : Animation marche Math.sin() ──────────────────
function ThomasWalking({ x, y, frame }: { x: number; y: number; frame: number }) {
  // Cycles de marche — frequence ajustee pour rythme naturel medieval (pas lents)
  const cycle = frame * 0.08;
  const bodyBounce = Math.sin(cycle * 2) * 3;           // corps monte/descend legèrement
  const armL = Math.sin(cycle) * 28;                    // bras gauche avant/arriere
  const armR = Math.sin(cycle + Math.PI) * 28;          // bras droit en opposition
  const legL = Math.sin(cycle) * 22;                    // jambe gauche
  const legR = Math.sin(cycle + Math.PI) * 22;          // jambe droite en opposition
  const headNod = Math.sin(cycle * 2) * 1.5;            // leger hochement de tete

  const bx = x;
  const by = y + bodyBounce;

  return (
    <g>
      {/* Corps */}
      <rect x={bx - 16} y={by - 75} width={32} height={50}
        fill={C.parchmentD} stroke={C.ink} strokeWidth={2} />
      {/* Tete */}
      <circle cx={bx} cy={by - 90 + headNod} r={20}
        fill={C.parchmentD} stroke={C.ink} strokeWidth={2} />
      {/* Yeux */}
      <circle cx={bx + 7} cy={by - 90 + headNod} r={3} fill={C.ink} />
      {/* Bras gauche */}
      <line
        x1={bx - 16} y1={by - 68}
        x2={bx - 16 - Math.cos(armL * 0.035) * 30}
        y2={by - 68 + Math.abs(Math.sin(armL * 0.035)) * 35 + 20}
        stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
      {/* Bras droit */}
      <line
        x1={bx + 16} y1={by - 68}
        x2={bx + 16 + Math.cos(armR * 0.035) * 30}
        y2={by - 68 + Math.abs(Math.sin(armR * 0.035)) * 35 + 20}
        stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
      {/* Jambe gauche */}
      <line
        x1={bx - 8} y1={by - 25}
        x2={bx - 8 + Math.sin(legL * 0.045) * 18}
        y2={by + 45 - Math.abs(Math.sin(legL * 0.045)) * 12}
        stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      {/* Jambe droite */}
      <line
        x1={bx + 8} y1={by - 25}
        x2={bx + 8 + Math.sin(legR * 0.045) * 18}
        y2={by + 45 - Math.abs(Math.sin(legR * 0.045)) * 12}
        stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      {/* Canne de medecin */}
      <line
        x1={bx + 32} y1={by - 55}
        x2={bx + 32 + Math.sin(armR * 0.02) * 8}
        y2={by + 48}
        stroke={C.inkLight} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

function Segment8Walk({ frame }: { frame: number }) {
  const local = frame - SEG * 7;

  // Thomas traverse l'ecran de gauche a droite
  const walkX = interpolate(local, [0, SEG - 1], [200, W - 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Agnes (statique, attend) apparait au milieu
  const agnesOpacity = interpolate(local, [80, 130], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Annotations
  const showAnnotations = local > 40;

  return (
    <g>
      <ParchmentBackground />
      <VillageBuildings />

      {/* Agnes statique qui attend */}
      <g opacity={agnesOpacity}>
        <ThomasFigure x={W - 380} y={680} />
        {showAnnotations && (
          <text x={W - 380} y={580} textAnchor="middle"
            fontFamily="Georgia, serif" fontSize={16} fill={C.inkLight}
            fontStyle="italic">Agnes</text>
        )}
      </g>

      {/* Thomas qui marche */}
      <ThomasWalking x={walkX} y={680} frame={local} />
      {showAnnotations && (
        <text x={walkX} y={580} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={16} fill={C.inkLight}
          fontStyle="italic">Thomas</text>
      )}

      <SegmentLabel text="SEGMENT 8 — Animation marche"
        sub="Math.sin() : bras + jambes + corps + tete — pas de bibliotheque externe" />
      <text x={W / 2} y={H - 60} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={20} fill={C.inkLight} opacity={0.7}>
        Cycle de marche pur SVG — frequence et amplitude reglables
      </text>
    </g>
  );
}

// ── Segment 9 : Carte propagation pest ───────────────────────
// Villes medievales aproximatives sur une grille 1920x1080
const MAP_CITIES = [
  { name: "Caffa",       x: 1350, y: 360, t: 0   },   // origine
  { name: "Constantinople", x: 1100, y: 440, t: 30  },
  { name: "Messine",     x: 820,  y: 530, t: 70  },
  { name: "Marseille",   x: 660,  y: 480, t: 100 },
  { name: "Paris",       x: 560,  y: 390, t: 140 },
  { name: "Londres",     x: 460,  y: 330, t: 170 },
  { name: "Saint-Pierre",x: 580,  y: 460, t: 120 },
] as const;

// Routes de propagation (paires d'indices)
const MAP_ROUTES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [3, 6],
] as const;

function Segment9Map({ frame }: { frame: number }) {
  const local = frame - SEG * 8;

  // Fond parchemin + contours de carte simplifies (mer Mediterranee)
  // Cercles de propagation qui s'expandent a partir de chaque ville touchee
  return (
    <g>
      {/* Fond parchemin */}
      <rect width={W} height={H} fill={C.parchment} />
      <rect x={30} y={30} width={W - 60} height={H - 60}
        fill="none" stroke={C.inkLight} strokeWidth={2} opacity={0.4} />

      {/* Contour tres simplifie de l'Europe / Mediterranee */}
      <path
        d="M200,200 Q400,180 600,220 Q800,250 1000,300 Q1200,350 1400,320 Q1500,310 1600,350 L1700,500 Q1600,600 1400,620 Q1200,650 1000,600 Q800,570 700,600 Q600,630 500,580 Q400,540 300,560 Q200,580 150,500 Z"
        fill={C.seaBlue} opacity={0.12} stroke={C.seaBlue} strokeWidth={1} />

      {/* Routes de propagation — dessin progressif */}
      {MAP_ROUTES.map(([a, b], i) => {
        const cityA = MAP_CITIES[a];
        const cityB = MAP_CITIES[b];
        const routeStart = cityA.t + 15;
        const routeEnd   = cityB.t;
        const progress = interpolate(local, [routeStart, routeEnd], [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const endX = cityA.x + (cityB.x - cityA.x) * progress;
        const endY = cityA.y + (cityB.y - cityA.y) * progress;
        return (
          <line key={i}
            x1={cityA.x} y1={cityA.y} x2={endX} y2={endY}
            stroke={C.vermillon} strokeWidth={2} opacity={0.6}
            strokeDasharray="6 3" />
        );
      })}

      {/* Villes touchees avec cercle de propagation */}
      {MAP_CITIES.map((city, i) => {
        const appear = interpolate(local, [city.t, city.t + 20], [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const waveR = interpolate(local, [city.t, city.t + 80], [0, 90],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const waveOpacity = interpolate(local, [city.t, city.t + 80], [0.4, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (appear <= 0) return null;
        const isOrigin = i === 0;
        const isSaintPierre = city.name === "Saint-Pierre";
        return (
          <g key={i} opacity={appear}>
            {/* Onde de propagation */}
            <circle cx={city.x} cy={city.y} r={waveR}
              fill="none" stroke={C.vermillon}
              strokeWidth={1.5} opacity={waveOpacity} />
            {/* Point ville */}
            <circle cx={city.x} cy={city.y} r={isOrigin ? 12 : 8}
              fill={isOrigin ? C.vermillon : C.ink}
              stroke={C.parchment} strokeWidth={2} />
            {/* Nom */}
            <text
              x={city.x + (isSaintPierre ? -10 : 14)}
              y={city.y + (isSaintPierre ? -14 : 4)}
              fontFamily="Georgia, serif"
              fontSize={isSaintPierre ? 16 : 14}
              fill={isSaintPierre ? C.gold : C.ink}
              fontWeight={isSaintPierre ? "bold" : "normal"}>
              {city.name}
            </text>
          </g>
        );
      })}

      {/* Annee qui progresse */}
      <text x={W - 120} y={H - 80} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={36} fill={C.ink}
        opacity={0.5} fontStyle="italic">
        {Math.round(interpolate(local, [0, SEG - 1], [1346, 1350],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}
      </text>

      <SegmentLabel text="SEGMENT 9 — Carte propagation"
        sub="Dessin progressif + ondes — stroke-dasharray + interpolate()" />
      <text x={W / 2} y={H - 60} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={20} fill={C.inkLight} opacity={0.7}>
        La peste se repand de Caffa vers l'Europe — chaque ville s'allume a son tour
      </text>
    </g>
  );
}

// ── Segment 10 : Micro-expressions personnage ─────────────────
// Thomas traverse 5 etats emotionnels : normal -> peur -> parle -> flash -> taches
// Chaque etat dure ~60 frames (2 secondes)

function ThomasFace({
  x, y,
  blinkProgress,    // 0-1 : fermeture oeil
  fearLevel,        // 0-1 : dilatation pupille + sueur
  mouthOpen,        // 0-1 : ouverture bouche
  plagueSpots,      // 0-1 : apparition taches
}: {
  x: number; y: number;
  blinkProgress: number;
  fearLevel: number;
  mouthOpen: number;
  plagueSpots: number;
}) {
  // Tete
  const eyeRY = interpolate(blinkProgress, [0, 1], [6, 0.5]);
  const pupilR = interpolate(fearLevel, [0, 1], [3, 5.5]);
  // Sueur (2 gouttes)
  const sweatOp = fearLevel;

  // Taches de pestilence — 5 spots sur visage/cou
  const spotDefs = [
    { dx: -10, dy: 8,  r: 5 },
    { dx:  14, dy: -4, r: 4 },
    { dx:  -4, dy: 18, r: 6 },
    { dx:  18, dy: 12, r: 3.5 },
    { dx:  -16, dy: -2, r: 4.5 },
  ];

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Corps simplifie */}
      <rect x={-20} y={0} width={40} height={60} rx={4}
        fill={C.parchmentD} stroke={C.ink} strokeWidth={2} />
      {/* Cou */}
      <rect x={-8} y={-22} width={16} height={24}
        fill={C.parchmentD} stroke={C.ink} strokeWidth={1.5} />
      {/* Tete */}
      <ellipse cx={0} cy={-42} rx={30} ry={34}
        fill={C.parchmentD} stroke={C.ink} strokeWidth={2} />
      {/* Cheveux */}
      <path d="M -30,-42 Q -28,-76 0,-80 Q 28,-76 30,-42 Q 20,-55 0,-58 Q -20,-55 -30,-42 Z"
        fill={C.inkLight} opacity={0.7} />

      {/* Taches pestilence */}
      {spotDefs.map((s, i) => {
        const delay = i * 0.15;
        const spotOp = interpolate(plagueSpots, [delay, delay + 0.3], [0, 0.75],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <circle key={i}
            cx={s.dx} cy={-42 + s.dy} r={s.r * (0.5 + plagueSpots * 0.5)}
            fill={C.vermillon} opacity={spotOp} />
        );
      })}

      {/* Oeil gauche */}
      <ellipse cx={-11} cy={-46} rx={7} ry={eyeRY}
        fill="white" stroke={C.ink} strokeWidth={1.5} />
      <circle cx={-11 - fearLevel * 1.5} cy={-46} r={pupilR}
        fill={C.ink} />
      {/* Oeil droit */}
      <ellipse cx={11} cy={-46} rx={7} ry={eyeRY}
        fill="white" stroke={C.ink} strokeWidth={1.5} />
      <circle cx={11 + fearLevel * 1.5} cy={-46} r={pupilR}
        fill={C.ink} />

      {/* Sourcils releves (peur) */}
      <path d={`M -18,-56 Q -11,${-60 - fearLevel * 8} -4,-56`}
        fill="none" stroke={C.ink} strokeWidth={2} strokeLinecap="round" />
      <path d={`M 4,-56 Q 11,${-60 - fearLevel * 8} 18,-56`}
        fill="none" stroke={C.ink} strokeWidth={2} strokeLinecap="round" />

      {/* Bouche */}
      <ellipse cx={0} cy={-22}
        rx={interpolate(mouthOpen, [0, 1], [8, 13])}
        ry={interpolate(mouthOpen, [0, 1], [3, 10])}
        fill={C.ink} opacity={0.85} />
      {/* Dents (quand bouche ouverte) */}
      {mouthOpen > 0.4 && (
        <rect x={-8} y={-28} width={16} height={8} rx={2}
          fill={C.parchment} opacity={mouthOpen} />
      )}

      {/* Gouttes de sueur */}
      <ellipse cx={-28} cy={-30} rx={3} ry={5}
        fill={C.seaBlue} opacity={sweatOp * 0.7} />
      <ellipse cx={28} cy={-22} rx={2.5} ry={4}
        fill={C.seaBlue} opacity={sweatOp * 0.5} />
    </g>
  );
}

function Segment10Expressions({ frame }: { frame: number }) {
  const local = frame - SEG * 9;

  // 5 etats de 60 frames chacun
  // 0-59 : normal
  // 60-119 : clignement
  // 120-179 : peur
  // 180-239 : parle
  // 240-299 : taches pestilence + flash

  const blinkProgress = interpolate(local, [60, 75, 90], [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const fearLevel = interpolate(local, [120, 160], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fearRelax = interpolate(local, [175, 190], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fear = local < 175 ? fearLevel : fearRelax;

  // Bouche : cycle de parole (oscillation rapide)
  const talkBase = interpolate(local, [180, 200], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const talkOff  = interpolate(local, [230, 245], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const talkGate = local < 230 ? talkBase : talkOff;
  const mouthOpen = talkGate * (0.5 + Math.abs(Math.sin(local * 0.3)) * 0.5);

  // Taches pestilence
  const plagueSpots = interpolate(local, [240, 285], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Flash de freeze frame (frame 270)
  const flashOp = interpolate(local, [268, 272, 280], [0, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Labels d'etat
  const stateLabel =
    local < 60   ? "Normal" :
    local < 120  ? "Clignement" :
    local < 180  ? "Peur" :
    local < 240  ? "Parle" :
                   "Pestilence";

  // 3 personnages cote a cote : Thomas normal, Thomas malade, Agnes
  return (
    <g>
      <ParchmentBackground />
      {/* Sol */}
      <line x1={80} y1={780} x2={W - 80} y2={780}
        stroke={C.inkLight} strokeWidth={2} opacity={0.5} />

      {/* Personnage 1 : Thomas (etats progressifs) */}
      <ThomasFace x={480} y={700}
        blinkProgress={blinkProgress}
        fearLevel={fear}
        mouthOpen={mouthOpen}
        plagueSpots={0} />
      <text x={480} y={820} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={18} fill={C.ink} fontStyle="italic">
        Thomas
      </text>

      {/* Personnage 2 : Thomas malade (taches fixes pour reference) */}
      <ThomasFace x={960} y={700}
        blinkProgress={0}
        fearLevel={0.3}
        mouthOpen={0.2}
        plagueSpots={plagueSpots} />
      <text x={960} y={820} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={18} fill={C.vermillon} fontStyle="italic">
        Thomas (contamine)
      </text>

      {/* Personnage 3 : Agnes (temoigne) */}
      <ThomasFace x={1440} y={700}
        blinkProgress={local > 240 ? interpolate(local, [240, 255, 268], [0, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0}
        fearLevel={local > 240 ? interpolate(local, [240, 280], [0, 0.8],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0}
        mouthOpen={0}
        plagueSpots={0} />
      <text x={1440} y={820} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={18} fill={C.ink} fontStyle="italic">
        Agnes (temoin)
      </text>

      {/* Label etat actuel */}
      <rect x={W / 2 - 130} y={860} width={260} height={44} rx={6}
        fill={local >= 240 ? C.vermillon : C.ink} opacity={0.8} />
      <text x={W / 2} y={889} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={22} fill={C.parchment} fontWeight="bold">
        {stateLabel}
      </text>

      {/* Flash freeze frame */}
      {flashOp > 0 && (
        <rect width={W} height={H} fill="white" opacity={flashOp} />
      )}

      <SegmentLabel text="SEGMENT 10 — Micro-expressions"
        sub="Clignement + peur + parole + flash freeze + taches pestilence" />
      <text x={W / 2} y={H - 60} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={20} fill={C.inkLight} opacity={0.7}>
        Expressions SVG pures — aucune bibliotheque — synchronisables avec audio
      </text>
    </g>
  );
}

// ── Barre de progression ─────────────────────────────────────
function ProgressBar({ frame }: { frame: number }) {
  const progress = interpolate(frame, [0, TOTAL - 1], [0, W - 60],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const segment = Math.min(Math.floor(frame / SEG) + 1, 10);
  return (
    <g>
      <rect x={30} y={H - 20} width={W - 60} height={6} fill={C.parchmentD} rx={3} />
      <rect x={30} y={H - 20} width={progress} height={6} fill={C.ink} rx={3} opacity={0.7} />
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <line key={i}
          x1={30 + (W - 60) * (i / 10)} y1={H - 24}
          x2={30 + (W - 60) * (i / 10)} y2={H - 10}
          stroke={C.gold} strokeWidth={2} />
      ))}
      <text x={W - 40} y={H - 22} textAnchor="end"
        fontFamily="Georgia, serif" fontSize={14} fill={C.inkLight}>
        {segment}/10
      </text>
    </g>
  );
}

// ── Composant principal ──────────────────────────────────────
export const EffectsLab: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isSeg7 = frame >= SEG * 6 && frame < SEG * 7;

  return (
    <AbsoluteFill style={{ background: C.parchment }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {frame < SEG                           && <Segment1Baseline frame={frame} />}
        {frame >= SEG * 1 && frame < SEG * 2  && <Segment2Grain frame={frame} />}
        {frame >= SEG * 2 && frame < SEG * 3  && <Segment3Spring frame={frame} fps={fps} />}
        {frame >= SEG * 3 && frame < SEG * 4  && <Segment4DrawOn frame={frame} />}
        {frame >= SEG * 4 && frame < SEG * 5  && <Segment5Light frame={frame} />}
        {frame >= SEG * 5 && frame < SEG * 6  && <Segment6SplitScreen frame={frame} />}
        {isSeg7                                && <Segment7Lottie frame={frame} />}
        {frame >= SEG * 7 && frame < SEG * 8  && <Segment8Walk frame={frame} />}
        {frame >= SEG * 8 && frame < SEG * 9    && <Segment9Map frame={frame} />}
        {frame >= SEG * 9                      && <Segment10Expressions frame={frame} />}
        <ProgressBar frame={frame} />
      </svg>
      {/* Layer Lottie HTML — superpose a gauche uniquement pour seg 7 */}
      {isSeg7 && (
        <div style={{
          position: "absolute",
          left: 150,
          top: 260,
          width: 300,
          height: 300,
          pointerEvents: "none",
        }}>
          <Lottie
            animationData={smokeData}
            style={{ width: 300, height: 300 }}
            loop
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
