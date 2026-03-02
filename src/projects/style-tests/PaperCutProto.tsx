import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const BG = "#0a0608";
const SEPIA_DARK = "#2a1a12";
const SEPIA_MID = "#4a3020";
const SEPIA_LIGHT = "#7a5a3a";
const ASH = "#6a6460";
const BLOOD = "#7a1a14";

// Silhouette SVG paths — formes simples mais lisibles
const HOOD_FIGURE = (x: number, y: number, scale = 1) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Corps */}
    <ellipse cx="0" cy="-30" rx="9" ry="11" fill="currentColor" />
    {/* Capuchon */}
    <path d="M-11,-28 Q-4,-52 0,-54 Q4,-52 11,-28 Z" fill="currentColor" />
    {/* Robe */}
    <path d="M-13,-22 Q-16,0 -14,20 Q-6,26 0,26 Q6,26 14,20 Q16,0 13,-22 Z" fill="currentColor" />
  </g>
);

const FALLEN_FIGURE = (x: number, y: number) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Corps allongé au sol */}
    <ellipse cx="0" cy="-4" rx="22" ry="8" fill="currentColor" />
    {/* Tête */}
    <ellipse cx="22" cy="-6" rx="8" ry="9" fill="currentColor" />
    {/* Capuchon tombé */}
    <path d="M16,-14 Q24,-20 30,-12 Q26,-4 22,-5 Z" fill="currentColor" />
  </g>
);

// Bâtiment silhouette
const BUILDING = (x: number, w: number, h: number, winY: number[]) => (
  <g>
    <rect x={x} y={1080 - h} width={w} height={h} fill={SEPIA_DARK} />
    {/* Toit triangulaire */}
    <polygon
      points={`${x},${1080 - h} ${x + w / 2},${1080 - h - 60} ${x + w},${1080 - h}`}
      fill={SEPIA_MID}
    />
    {/* Fenêtres — éclairées faiblement */}
    {winY.map((wy, i) => (
      <rect
        key={i}
        x={x + w / 2 - 12}
        y={wy}
        width={24}
        height={32}
        fill="#3a2810"
        rx={2}
      />
    ))}
  </g>
);

// Couche brume de fond
const FogLayer: React.FC<{ opacity: number; offsetX: number }> = ({ opacity, offsetX }) => (
  <ellipse
    cx={960 + offsetX}
    cy={700}
    rx={800}
    ry={200}
    fill={SEPIA_DARK}
    opacity={opacity}
  />
);

export const PaperCutProto: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  // === TIMING ===
  // 0-30   : établissement de la rue (fade in)
  // 30-100 : 3 figures marchent normalement
  // 100-130: une figure chancelle et tombe
  // 130-200: les autres s'arrêtent, regardent
  // 200-260: ils s'éloignent rapidement
  // 260-300: rue vide, figure au sol seule

  const globalOpacity = interpolate(frame, [0, 20, durationInFrames - 15, durationInFrames], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Parallax fond (très lent)
  const bgParallax = interpolate(frame, [0, durationInFrames], [0, -40], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Figure 1 — marche de gauche à droite, s'arrête frame 130
  const fig1X = frame < 130
    ? interpolate(frame, [0, 130], [-60, 580], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
    : interpolate(frame, [130, 200], [580, 600], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Figure 2 — marche de droite à gauche, s'arrête frame 130
  const fig2X = frame < 130
    ? interpolate(frame, [0, 130], [1980, 1300], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
    : interpolate(frame, [130, 200], [1300, 1280], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Figure 3 (qui tombe) — marche normalement jusqu'à frame 95, puis chute
  const fig3X = interpolate(frame, [0, 95], [200, 900], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Rotation de la figure qui tombe (de debout à allongée)
  const fallRotation = interpolate(frame, [95, 120], [0, 90], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const fig3Y = interpolate(frame, [95, 120], [0, 18], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Fuite des figures 1 et 2 (frame 200-260)
  const fig1Flee = frame > 200
    ? interpolate(frame, [200, 270], [600, -100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
    : fig1X;

  const fig2Flee = frame > 200
    ? interpolate(frame, [200, 270], [1280, 2100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
    : fig2X;

  // Sol (ground line)
  const GROUND_Y = 820;

  // Teinte sang sur la figure tombée (apparaît progressivement après la chute)
  const bloodOpacity = interpolate(frame, [130, 170], [0, 0.7], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Brume qui monte après la fuite
  const fogRise = interpolate(frame, [260, 300], [0, 0.35], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        background: BG,
        position: "relative",
        overflow: "hidden",
        opacity: globalOpacity,
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>

        {/* === FOND — BÂTIMENTS LOINTAINS === */}
        <g transform={`translate(${bgParallax * 0.3}, 0)`} opacity={0.5}>
          {BUILDING(-80, 220, 380, [720, 820])}
          {BUILDING(200, 180, 320, [780])}
          {BUILDING(440, 260, 420, [700, 810])}
          {BUILDING(760, 200, 360, [760])}
          {BUILDING(1050, 240, 390, [710, 820])}
          {BUILDING(1380, 190, 340, [780])}
          {BUILDING(1640, 230, 400, [720, 830])}
          {BUILDING(1920, 210, 360, [770])}
        </g>

        {/* === MI-PLAN — BÂTIMENTS PROCHES === */}
        <g transform={`translate(${bgParallax * 0.6}, 0)`}>
          {BUILDING(-40, 300, 500, [560, 680])}
          {BUILDING(320, 360, 540, [530, 660])}
          {BUILDING(760, 280, 480, [570])}
          {BUILDING(1120, 340, 520, [540, 670])}
          {BUILDING(1540, 300, 490, [560, 690])}
          {BUILDING(1900, 260, 460, [580])}
        </g>

        {/* === SOL === */}
        <rect x={0} y={GROUND_Y} width={width} height={height - GROUND_Y} fill={SEPIA_DARK} opacity={0.9} />
        {/* Pavés — lignes horizontales subtiles */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1={0} y1={GROUND_Y + 30 + i * 50}
            x2={width} y2={GROUND_Y + 30 + i * 50}
            stroke={SEPIA_MID}
            strokeWidth={1.5}
            opacity={0.4}
          />
        ))}

        {/* === BRUME DE SOL === */}
        <FogLayer opacity={0.15 + fogRise} offsetX={bgParallax * 0.1} />

        {/* === FIGURE 1 — gauche vers droite === */}
        <g color={ASH} transform={`translate(0, ${GROUND_Y - 10})`}>
          {HOOD_FIGURE(fig1Flee, 0, 1.1)}
        </g>

        {/* === FIGURE 2 — droite vers gauche === */}
        <g color={SEPIA_LIGHT} transform={`translate(0, ${GROUND_Y - 10})`}>
          {HOOD_FIGURE(fig2Flee, 0, 1.0)}
        </g>

        {/* === FIGURE 3 — tombe === */}
        {frame < 120 ? (
          // Debout puis rotation de chute
          <g
            color={ASH}
            transform={`translate(${fig3X}, ${GROUND_Y - 10 + fig3Y}) rotate(${fallRotation}, 0, 0)`}
          >
            {HOOD_FIGURE(0, 0, 1.15)}
          </g>
        ) : (
          // Allongée au sol
          <g color={ASH} transform={`translate(${fig3X - 20}, ${GROUND_Y + 6})`}>
            {FALLEN_FIGURE(0, 0)}
            {/* Tache de sang */}
            <ellipse cx={-10} cy={8} rx={18} ry={8} fill={BLOOD} opacity={bloodOpacity} />
          </g>
        )}

        {/* === VIGNETTE CINEMATIQUE === */}
        <defs>
          <radialGradient id="vignette" cx="50%" cy="55%" r="65%">
            <stop offset="30%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.75)" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={width} height={height} fill="url(#vignette)" />

      </svg>
    </div>
  );
};
