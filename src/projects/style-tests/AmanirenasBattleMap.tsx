import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

// ============================================================
// AMANIRENAS BATTLE MAP — Carte SVG Remotion pure
// Format : 1080x1920 (9:16 Shorts vertical)
// 300 frames @ 30fps = 10 secondes
//
// Seq 1 (0-90f)   : Carte Nil + territories apparaissent
// Seq 2 (91-180f) : Fleches d'invasion romaine + contre-fleche nubienne
// Seq 3 (181-270f): Timeline 4 ans de guerre
// Seq 4 (271-300f): Fade out + "Victoire 21 av. J.-C."
// ============================================================

const W = 1080;
const H = 1920;

// Palette Amanirenas
const C = {
  bg:           "#0a0a0f",
  bgCard:       "rgba(20,18,12,0.92)",
  nile:         "#4ab3d4",
  nileDark:     "#2a6880",
  nubia:        "#c87832",
  nubiaLight:   "#e8a850",
  nubiaDark:    "#8a4818",
  rome:         "#c8302a",
  romeDark:     "#8a1a16",
  egypt:        "#d4b860",
  egyptDark:    "#8a7030",
  gold:         "#f0c040",
  goldDim:      "#a87820",
  white:        "#f5f0e8",
  gray:         "#6a6560",
  sand:         "#e8d8a0",
  sandDark:     "#c8b060",
} as const;

// Coordonnees SVG simplifiees (1080x1920, nord=haut)
// Centre = zone Nil Moyen / Nubie / Egypte
// Nil = fleuve vertical central

const NIL_PATH = `
  M 540 80
  C 535 200, 545 350, 530 480
  C 520 600, 540 700, 535 820
  C 530 920, 550 1020, 545 1100
  C 540 1180, 535 1280, 540 1350
`;

// Territoire Nubie (sud, zone terracotta)
const NUBIA_POLYGON = "540,1350 380,1320 300,1200 280,1100 320,1000 400,920 480,880 540,860 600,880 680,920 760,1000 800,1100 820,1200 740,1320";

// Territoire Egypte (nord, zone or)
const EGYPT_POLYGON = "540,480 400,460 300,380 260,280 300,180 380,120 460,80 540,80 620,80 700,120 780,180 820,280 780,380 680,460";

// Ville Meroe (capitale nubienne) — bas
const MEROE = { x: 570, y: 1060, label: "Méroé" };
// Ville Napata
const NAPATA = { x: 545, y: 900, label: "Napata" };
// Assouan (frontiere)
const ASSOUAN = { x: 530, y: 700, label: "Assouan" };
// Alexandrie (nord)
const ALEXANDRIE = { x: 390, y: 200, label: "Alexandrie" };

// ---- Composants utilitaires ----

function NilRiver({ progress }: { progress: number }) {
  const totalLength = 1400;
  const drawn = progress * totalLength;
  return (
    <path
      d={NIL_PATH}
      fill="none"
      stroke={C.nile}
      strokeWidth={14}
      strokeLinecap="round"
      strokeDasharray={`${totalLength}`}
      strokeDashoffset={`${totalLength - drawn}`}
      opacity={0.85}
    />
  );
}

function Territory({
  points,
  fill,
  stroke,
  opacity,
}: {
  points: string;
  fill: string;
  stroke: string;
  opacity: number;
}) {
  return (
    <polygon
      points={points}
      fill={fill}
      stroke={stroke}
      strokeWidth={3}
      opacity={opacity}
    />
  );
}

function CityDot({
  x,
  y,
  label,
  color,
  scale,
  labelSide = "right",
}: {
  x: number;
  y: number;
  label: string;
  color: string;
  scale: number;
  labelSide?: "right" | "left";
}) {
  const offset = labelSide === "right" ? 28 : -28;
  const anchor = labelSide === "right" ? "start" : "end";
  return (
    <g transform={`scale(${scale}) translate(${x / scale - x / scale * (1 - scale) / scale}, 0)`}>
      <g transform={`translate(${x}, ${y})`}>
        <circle r={18} fill={color} opacity={0.9} />
        <circle r={10} fill={C.white} opacity={0.95} />
        <circle r={4} fill={color} />
        <text
          x={offset}
          y={6}
          fontSize={32}
          fontFamily="Georgia, serif"
          fill={C.white}
          textAnchor={anchor}
          fontWeight="600"
          opacity={0.9}
        >
          {label}
        </text>
      </g>
    </g>
  );
}

function AnimatedArrow({
  x1, y1, x2, y2,
  color,
  progress,
  strokeWidth = 12,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color: string;
  progress: number;
  strokeWidth?: number;
}) {
  const cx = x1 + (x2 - x1) * progress;
  const cy = y1 + (y2 - y1) * progress;
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  return (
    <g>
      <line
        x1={x1} y1={y1}
        x2={cx} y2={cy}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={0.9}
      />
      {progress > 0.05 && (
        <polygon
          points="-20,0 -36,-10 -36,10"
          transform={`translate(${cx},${cy}) rotate(${angle})`}
          fill={color}
          opacity={0.95}
        />
      )}
    </g>
  );
}

// ---- Sequence 1 : Carte de base ----

function Seq1Map({ localFrame, fps }: { localFrame: number; fps: number }) {
  const bgOpacity = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const nilProgress = interpolate(localFrame, [10, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const egyptOpacity = interpolate(localFrame, [20, 50], [0, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const nubiaOpacity = interpolate(localFrame, [30, 60], [0, 0.65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const citiesScale = spring({
    frame: localFrame - 50,
    fps,
    config: { damping: 12, stiffness: 180 },
    from: 0,
    to: 1,
  });

  const titleOpacity = interpolate(localFrame, [60, 80], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g opacity={bgOpacity}>
      {/* Territories */}
      <Territory
        points={EGYPT_POLYGON}
        fill={C.egypt}
        stroke={C.egyptDark}
        opacity={egyptOpacity}
      />
      <Territory
        points={NUBIA_POLYGON}
        fill={C.nubia}
        stroke={C.nubiaDark}
        opacity={nubiaOpacity}
      />

      {/* Nil */}
      <NilRiver progress={nilProgress} />

      {/* Labels territoire */}
      <text x={460} y={340} fontSize={44} fontFamily="Georgia, serif"
        fill={C.egyptDark} textAnchor="middle" fontWeight="bold"
        opacity={egyptOpacity}>
        EGYPTE
      </text>
      <text x={540} y={1160} fontSize={44} fontFamily="Georgia, serif"
        fill={C.white} textAnchor="middle" fontWeight="bold"
        opacity={nubiaOpacity * 0.9}>
        NUBIE
      </text>

      {/* Villes */}
      <g transform={`scale(${citiesScale})`} style={{ transformOrigin: "540px 540px" }}>
        <g>
          {citiesScale > 0.1 && (
            <>
              <g transform={`translate(${MEROE.x}, ${MEROE.y})`}>
                <circle r={18} fill={C.nubiaLight} opacity={0.95} />
                <circle r={9} fill={C.white} opacity={0.95} />
                <circle r={4} fill={C.nubiaDark} />
                <text x={28} y={6} fontSize={32} fontFamily="Georgia, serif"
                  fill={C.white} fontWeight="600" opacity={0.92}>Méroé</text>
              </g>
              <g transform={`translate(${NAPATA.x}, ${NAPATA.y})`}>
                <circle r={14} fill={C.nubiaLight} opacity={0.85} />
                <circle r={7} fill={C.white} opacity={0.95} />
                <circle r={3} fill={C.nubiaDark} />
                <text x={26} y={5} fontSize={28} fontFamily="Georgia, serif"
                  fill={C.white} fontWeight="400" opacity={0.82}>Napata</text>
              </g>
              <g transform={`translate(${ASSOUAN.x}, ${ASSOUAN.y})`}>
                <circle r={14} fill={C.sandDark} opacity={0.9} />
                <circle r={7} fill={C.white} opacity={0.95} />
                <circle r={3} fill={C.egyptDark} />
                <text x={26} y={5} fontSize={28} fontFamily="Georgia, serif"
                  fill={C.white} fontWeight="400" opacity={0.82}>Assouan</text>
              </g>
              <g transform={`translate(${ALEXANDRIE.x}, ${ALEXANDRIE.y})`}>
                <circle r={16} fill={C.rome} opacity={0.9} />
                <circle r={8} fill={C.white} opacity={0.95} />
                <circle r={3} fill={C.romeDark} />
                <text x={26} y={5} fontSize={28} fontFamily="Georgia, serif"
                  fill={C.white} fontWeight="400" opacity={0.82}>Alexandrie</text>
              </g>
            </>
          )}
        </g>
      </g>

      {/* Titre carte */}
      <text x={540} y={1500} fontSize={52} fontFamily="Georgia, serif"
        fill={C.gold} textAnchor="middle" fontStyle="italic"
        opacity={titleOpacity}>
        25 av. J.-C.
      </text>
    </g>
  );
}

// ---- Sequence 2 : Fleches invasion + resistance ----

function Seq2Arrows({ localFrame, fps }: { localFrame: number; fps: number }) {

  // Rome descend du nord (3 fleches)
  const arrow1 = interpolate(localFrame, [0, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrow2 = interpolate(localFrame, [10, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrow3 = interpolate(localFrame, [20, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Contre-fleche nubienne (remonte)
  const counterArrow = interpolate(localFrame, [45, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Label "ROME" apparait
  const romeLabel = spring({ frame: localFrame - 5, fps, config: { damping: 15, stiffness: 150 }, from: 0, to: 1 });
  const nubiaLabel = spring({ frame: localFrame - 45, fps, config: { damping: 12, stiffness: 160 }, from: 0, to: 1 });

  // Flash rouge sur territoire egypt quand rome envahit
  const romeFill = interpolate(localFrame, [30, 50], [0.55, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g>
      {/* Egypt passe sous controle romain */}
      <Territory
        points={EGYPT_POLYGON}
        fill={C.rome}
        stroke={C.romeDark}
        opacity={romeFill * 0.6}
      />

      {/* Fleches romaines (nord → sud) */}
      <AnimatedArrow x1={350} y1={120} x2={430} y2={620} color={C.rome} progress={arrow1} />
      <AnimatedArrow x1={540} y1={80} x2={535} y2={640} color={C.rome} progress={arrow2} />
      <AnimatedArrow x1={720} y1={130} x2={650} y2={600} color={C.rome} progress={arrow3} />

      {/* Label ROME */}
      {romeLabel > 0.1 && (
        <g opacity={romeLabel}>
          <rect x={320} y={48} width={260} height={68} rx={12}
            fill={C.romeDark} opacity={0.88} />
          <text x={450} y={94} fontSize={46} fontFamily="Georgia, serif"
            fill={C.white} textAnchor="middle" fontWeight="bold" letterSpacing={4}>
            ROME
          </text>
        </g>
      )}

      {/* Contre-fleche nubienne (sud → nord) */}
      <AnimatedArrow
        x1={540} y1={900} x2={535} y2={660}
        color={C.nubiaLight} progress={counterArrow}
        strokeWidth={16}
      />
      <AnimatedArrow
        x1={430} y1={950} x2={420} y2={680}
        color={C.nubiaLight} progress={counterArrow * 0.85}
        strokeWidth={12}
      />
      <AnimatedArrow
        x1={650} y1={940} x2={660} y2={670}
        color={C.nubiaLight} progress={counterArrow * 0.85}
        strokeWidth={12}
      />

      {/* Label NUBIE RESISTE */}
      {nubiaLabel > 0.1 && (
        <g opacity={nubiaLabel}>
          <rect x={240} y={1380} width={600} height={80} rx={12}
            fill={C.nubiaDark} opacity={0.9} />
          <text x={540} y={1432} fontSize={40} fontFamily="Georgia, serif"
            fill={C.gold} textAnchor="middle" fontWeight="bold" letterSpacing={2}>
            AMANIRENAS RESISTE
          </text>
        </g>
      )}
    </g>
  );
}

// ---- Sequence 3 : Timeline ----

const EVENTS = [
  { year: "25", label: "Invasion romaine", color: C.rome, frame: 10 },
  { year: "24", label: "Contre-attaque nubienne", color: C.nubiaLight, frame: 30 },
  { year: "22", label: "Siège d'Assouan repris", color: C.nubiaLight, frame: 50 },
  { year: "21", label: "Traité de paix — Victoire", color: C.gold, frame: 70 },
];

function Seq3Timeline({ localFrame, fps }: { localFrame: number; fps: number }) {
  const lineProgress = interpolate(localFrame, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const timelineY = 1600;
  const timelineX1 = 120;
  const timelineX2 = 960;
  const timelineW = timelineX2 - timelineX1;

  return (
    <g>
      {/* Header timeline */}
      <text x={540} y={1420} fontSize={40} fontFamily="Georgia, serif"
        fill={C.gray} textAnchor="middle" fontStyle="italic"
        opacity={titleOpacity}>
        4 ans de résistance
      </text>

      {/* Ligne horizontale */}
      <line
        x1={timelineX1} y1={timelineY}
        x2={timelineX1 + timelineW * lineProgress} y2={timelineY}
        stroke={C.goldDim}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Evenements */}
      {EVENTS.map((evt, i) => {
        const xPos = timelineX1 + (i / (EVENTS.length - 1)) * timelineW;
        const dotScale = spring({
          frame: localFrame - evt.frame,
          fps,
          config: { damping: 10, stiffness: 200 },
          from: 0,
          to: 1,
        });
        const textOpacity = interpolate(
          localFrame,
          [evt.frame + 8, evt.frame + 22],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const isAbove = i % 2 === 0;
        const labelY = isAbove ? timelineY - 80 : timelineY + 80;
        const yearY = isAbove ? timelineY - 120 : timelineY + 120;

        return (
          <g key={i}>
            {/* Point */}
            <circle
              cx={xPos}
              cy={timelineY}
              r={18 * dotScale}
              fill={evt.color}
              opacity={0.95}
            />
            <circle
              cx={xPos}
              cy={timelineY}
              r={8 * dotScale}
              fill={C.white}
              opacity={0.95}
            />

            {/* Tige verticale */}
            {dotScale > 0.5 && (
              <line
                x1={xPos} y1={timelineY + (isAbove ? -18 : 18)}
                x2={xPos} y2={isAbove ? timelineY - 60 : timelineY + 60}
                stroke={evt.color}
                strokeWidth={2}
                opacity={0.6}
              />
            )}

            {/* Annee */}
            <text
              x={xPos} y={yearY}
              fontSize={36}
              fontFamily="Georgia, serif"
              fill={evt.color}
              textAnchor="middle"
              fontWeight="bold"
              opacity={textOpacity}
            >
              {evt.year}
            </text>

            {/* Label */}
            <text
              x={xPos} y={labelY}
              fontSize={24}
              fontFamily="Georgia, serif"
              fill={C.white}
              textAnchor="middle"
              opacity={textOpacity * 0.85}
            >
              {evt.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// ---- Sequence 4 : Victoire finale ----

function Seq4Victory({ localFrame, fps }: { localFrame: number; fps: number }) {
  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 120 },
    from: 0.6,
    to: 1,
  });

  const opacity = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Pulse ring
  const ring = interpolate(localFrame % 40, [0, 40], [1, 2.5], { extrapolateRight: "clamp" });
  const ringOpacity = interpolate(localFrame % 40, [0, 40], [0.6, 0], { extrapolateRight: "clamp" });

  return (
    <g opacity={opacity}>
      {/* Pulse autour de Meroe */}
      <circle cx={MEROE.x} cy={MEROE.y} r={60 * ring} fill="none"
        stroke={C.gold} strokeWidth={3} opacity={ringOpacity} />

      {/* Card victoire */}
      <rect x={100} y={1380} width={880} height={220} rx={20}
        fill={C.bgCard} stroke={C.gold} strokeWidth={2} />

      <text x={540} y={1450} fontSize={34} fontFamily="Georgia, serif"
        fill={C.gold} textAnchor="middle" fontStyle="italic" opacity={0.8}>
        21 av. J.-C.
      </text>
      <text
        x={540} y={1510}
        fontSize={52}
        fontFamily="Georgia, serif"
        fill={C.white}
        textAnchor="middle"
        fontWeight="bold"
        transform={`scale(${scale})`}
        style={{ transformOrigin: "540px 1510px" }}
      >
        VICTOIRE NUBIENNE
      </text>
      <text x={540} y={1560} fontSize={28} fontFamily="Georgia, serif"
        fill={C.sand} textAnchor="middle" opacity={0.7}>
        Traité de Samos — Rome recule
      </text>
    </g>
  );
}

// ---- Composant principal ----

export const AmanirenasBattleMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          {/* Gradient Nil */}
          <linearGradient id="nilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.nile} />
            <stop offset="100%" stopColor={C.nileDark} />
          </linearGradient>

          {/* Vignette */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="60%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
          </radialGradient>
        </defs>

        <g opacity={globalOpacity}>
          {/* Seq 1 : carte base (0-90f) — affichee tout du long */}
          <Seq1Map localFrame={Math.min(frame, 90)} fps={fps} />

          {/* Seq 2 : fleches (91-180f) */}
          {frame >= 91 && (
            <Seq2Arrows localFrame={frame - 91} fps={fps} />
          )}

          {/* Seq 3 : timeline (181-270f) */}
          {frame >= 181 && (
            <Seq3Timeline localFrame={frame - 181} fps={fps} />
          )}

          {/* Seq 4 : victoire (271-300f) */}
          {frame >= 271 && (
            <Seq4Victory localFrame={frame - 271} fps={fps} />
          )}

          {/* Vignette permanente */}
          <rect x={0} y={0} width={W} height={H} fill="url(#vignette)" />

          {/* Header permanent */}
          <text x={540} y={60} fontSize={34} fontFamily="Georgia, serif"
            fill={C.goldDim} textAnchor="middle" fontStyle="italic" opacity={0.7}>
            La Guerre Méroïtique
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
