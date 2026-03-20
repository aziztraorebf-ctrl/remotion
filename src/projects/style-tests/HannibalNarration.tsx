import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from "remotion";

// --- PALETTE ---
const C = {
  mint: "#4ecb8d",
  navy: "#1a1f4e",
  purple: "#7b3fbf",
  white: "#ffffff",
  lightGray: "#e8e8e8",
  pathRed: "#e84040",
  ground: "#dce8de",
};

// --- HELPERS ---
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

function springVal(
  frame: number,
  start: number,
  fps: number,
  config: { damping?: number; stiffness?: number; mass?: number } = {}
) {
  return spring({
    frame: frame - start,
    fps,
    config: { damping: 18, stiffness: 180, mass: 1, ...config },
  });
}

// ============================================================
// HANNIBAL DETAILED — vivid_shapes flat style
// origin: feet at (0,0), height ~220px
// ============================================================
const HannibalDetailed: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <g opacity={opacity}>
    <rect x={-22} y={160} width={18} height={30} rx={3} fill={C.navy} />
    <rect x={6} y={160} width={18} height={30} rx={3} fill={C.navy} />
    <rect x={-22} y={145} width={18} height={18} rx={2} fill={C.navy} />
    <rect x={6} y={145} width={18} height={18} rx={2} fill={C.navy} />
    <rect x={-30} y={105} width={60} height={45} rx={4} fill={C.navy} />
    <rect x={-28} y={116} width={56} height={5} rx={1} fill={C.purple} />
    <rect x={-28} y={126} width={56} height={5} rx={1} fill={C.purple} />
    <rect x={-28} y={136} width={56} height={5} rx={1} fill={C.purple} />
    <rect x={-25} y={60} width={50} height={50} rx={6} fill={C.navy} />
    <circle cx={0} cy={85} r={6} fill={C.purple} />
    <circle cx={0} cy={85} r={3} fill={C.mint} />
    <ellipse cx={0} cy={95} rx={48} ry={55} fill={C.purple} />
    <ellipse cx={0} cy={85} rx={28} ry={42} fill={C.navy} />
    <path d="M-25,65 Q-70,110 -55,170 Q-35,150 -30,105 Z" fill={C.purple} />
    <path d="M25,65 Q70,110 55,170 Q35,150 30,105 Z" fill={C.purple} />
    <ellipse cx={0} cy={50} rx={20} ry={15} fill={C.navy} />
    <ellipse cx={0} cy={42} rx={14} ry={10} fill={C.mint} />
    <ellipse cx={0} cy={30} rx={18} ry={14} fill={C.navy} />
    <rect x={-3} y={8} width={6} height={22} rx={2} fill={C.navy} />
    <ellipse cx={0} cy={8} rx={5} ry={4} fill={C.purple} />
    <rect x={-38} y={70} width={14} height={50} rx={5} fill={C.navy} />
    <rect x={24} y={70} width={14} height={50} rx={5} fill={C.navy} />
    <line x1={-35} y1={-50} x2={30} y2={190} stroke={C.navy} strokeWidth={5} strokeLinecap="round" />
    <polygon points="-38,-58 -32,-58 -35,-75" fill={C.navy} />
    <circle cx={38} cy={125} r={10} fill={C.navy} />
    <circle cx={38} cy={125} r={6} fill={C.purple} />
  </g>
);

// ============================================================
// HANNIBAL SILHOUETTE — solid navy
// ============================================================
const HannibalSilhouette: React.FC<{ opacity?: number; color?: string }> = ({
  opacity = 1,
  color = C.navy,
}) => (
  <g opacity={opacity}>
    <rect x={-22} y={160} width={18} height={30} rx={3} fill={color} />
    <rect x={6} y={160} width={18} height={30} rx={3} fill={color} />
    <rect x={-22} y={145} width={18} height={18} rx={2} fill={color} />
    <rect x={6} y={145} width={18} height={18} rx={2} fill={color} />
    <rect x={-30} y={105} width={60} height={45} rx={4} fill={color} />
    <rect x={-25} y={60} width={50} height={50} rx={6} fill={color} />
    <path d="M-25,65 Q-70,110 -55,170 Q-35,150 -30,105 Z" fill={color} />
    <path d="M25,65 Q70,110 55,170 Q35,150 30,105 Z" fill={color} />
    <ellipse cx={0} cy={95} rx={48} ry={55} fill={color} />
    <ellipse cx={0} cy={50} rx={20} ry={15} fill={color} />
    <ellipse cx={0} cy={30} rx={18} ry={14} fill={color} />
    <rect x={-3} y={8} width={6} height={22} rx={2} fill={color} />
    <ellipse cx={0} cy={8} rx={5} ry={4} fill={color} />
    <rect x={-38} y={70} width={14} height={50} rx={5} fill={color} />
    <rect x={24} y={70} width={14} height={50} rx={5} fill={color} />
    <line x1={-35} y1={-50} x2={30} y2={190} stroke={color} strokeWidth={5} strokeLinecap="round" />
    <polygon points="-38,-58 -32,-58 -35,-75" fill={color} />
    <circle cx={38} cy={125} r={10} fill={color} />
  </g>
);

// ============================================================
// ELEPHANT
// ============================================================
const ElephantDetailed: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <g opacity={opacity}>
    <ellipse cx={0} cy={-70} rx={80} ry={65} fill={C.navy} />
    <ellipse cx={-65} cy={-110} rx={50} ry={42} fill={C.navy} />
    <ellipse cx={-90} cy={-105} rx={22} ry={28} fill={C.navy} />
    <path d="M-90,-90 Q-115,-60 -110,-20 Q-108,0 -95,-5 Q-82,-10 -85,-30 Q-90,-60 -70,-85"
      fill="none" stroke={C.navy} strokeWidth={18} strokeLinecap="round" />
    <ellipse cx={-95} cy={-8} rx={10} ry={7} fill={C.navy} />
    <path d="M-100,-80 Q-130,-75 -135,-55 Q-132,-45 -120,-48"
      fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
    <circle cx={-55} cy={-120} r={5} fill={C.white} />
    <circle cx={-55} cy={-120} r={2.5} fill={C.navy} />
    <rect x={-55} y={-15} width={28} height={70} rx={10} fill={C.navy} />
    <rect x={-15} y={-15} width={28} height={70} rx={10} fill={C.navy} />
    <rect x={25} y={-15} width={28} height={70} rx={10} fill={C.navy} />
    <rect x={50} y={-20} width={24} height={65} rx={10} fill={C.navy} />
  </g>
);

// ============================================================
// SOLDIER
// ============================================================
const SoldierSilhouette: React.FC<{ flip?: boolean }> = ({ flip = false }) => (
  <g transform={flip ? "scale(-1,1)" : "scale(1,1)"}>
    <rect x={-8} y={-50} width={16} height={30} rx={4} fill={C.navy} />
    <circle cx={0} cy={-60} r={10} fill={C.navy} />
    <rect x={-2} y={-72} width={4} height={10} rx={1} fill={C.navy} />
    <rect x={-10} y={-20} width={10} height={28} rx={3} fill={C.navy} />
    <rect x={2} y={-20} width={10} height={28} rx={3} fill={C.navy} />
    <line x1={12} y1={-90} x2={12} y2={15} stroke={C.navy} strokeWidth={3} />
    <polygon points="9,-90 15,-90 12,-102" fill={C.navy} />
    <ellipse cx={-18} cy={-40} rx={10} ry={14} fill={C.navy} />
  </g>
);

// ============================================================
// MOUNTAINS — white bold triangles for 9:16 scene backdrop
// ============================================================
const Mountains: React.FC = () => (
  <g>
    <polygon points="-60,900 200,400 460,900" fill={C.white} />
    <polygon points="300,900 540,360 780,900" fill={C.white} />
    <polygon points="620,900 900,320 1180,900" fill={C.white} />
    <polygon points="900,900 1140,420 1380,900" fill={C.white} />
  </g>
);

// ============================================================
// SNOW DOTS
// ============================================================
const SnowDots: React.FC = () => {
  const positions = [
    [60, 80], [200, 110], [350, 65], [480, 130], [620, 75],
    [750, 105], [880, 55], [1000, 120], [140, 200], [300, 180],
    [450, 220], [590, 190], [720, 210], [860, 175], [50, 300],
    [190, 270], [380, 310], [530, 285], [680, 300], [820, 270],
    [970, 295], [100, 390], [260, 360], [420, 400], [570, 370],
  ];
  return (
    <g>
      {positions.map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={10} ry={7} fill={C.white} opacity={0.8} />
      ))}
    </g>
  );
};

// ============================================================
// MAP — Gemini Mediterranean carte as backdrop (9:16)
// Carthage = Tunisia coast (bottom-center of map)
// Alps = white triangles top-center
// Route: Carthage -> coast -> Spain -> Alps -> Italy
// ============================================================
const MapView: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#c8d4e0" />
    <image
      href={staticFile("assets/map-mediterranee-gemini-v1.png")}
      x={0}
      y={0}
      width={1080}
      height={1920}
      preserveAspectRatio="xMidYMid slice"
    />
    <rect width={1080} height={1920} fill={C.navy} opacity={0.06} />
  </g>
);

// ============================================================
// ROUTE WAYPOINTS — calibrated to Mediterranee map 1080x1920
// Map layout (portrait): Europe (green) top third, Alps (white) upper-center,
// Mediterranean (navy blue) center, North Africa (ochre) bottom half
// Carthage = Tunisia peninsula, bottom-center ~(540, 1350)
// ============================================================
const PATH_WAYPOINTS = [
  { x: 540, y: 1350 }, // Carthage — Tunisia coast (ochre zone bottom)
  { x: 480, y: 1180 }, // North African coast westward
  { x: 400, y: 1020 }, // Crossing Mediterranean (navy center)
  { x: 360, y: 840 },  // Spain coast landing
  { x: 400, y: 680 },  // Through Pyrenees
  { x: 480, y: 540 },  // Southern Gaul
  { x: 560, y: 440 },  // Alps approach
  { x: 620, y: 360 },  // Alps crossing (white triangles zone)
  { x: 680, y: 460 },  // Into Italy
];

function buildPathD(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x} ${prev.y} ${mx} ${my}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

const ROUTE_PATH_D = buildPathD(PATH_WAYPOINTS);
const PATH_LENGTH = 1100;

function posAlongPath(t: number): { x: number; y: number } {
  const pts = PATH_WAYPOINTS;
  if (t <= 0) return pts[0];
  if (t >= 1) return pts[pts.length - 1];
  const totalSegments = pts.length - 1;
  const raw = t * totalSegments;
  const segIdx = Math.min(Math.floor(raw), totalSegments - 1);
  const segT = raw - segIdx;
  const a = pts[segIdx];
  const b = pts[segIdx + 1];
  return { x: a.x + (b.x - a.x) * segT, y: a.y + (b.y - a.y) * segT };
}

// ============================================================
// MAIN COMPONENT — 1080x1920 (9:16)
// Act 1 (0-100):   Hannibal vivid scene + dissolve to silhouette
// Act 2 (100-200): Map + route draw-on + silhouette travels
// Act 3 (200-300): Gentle zoom Alps + morph back + elephant
// ============================================================
export const HannibalNarration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // --- ACT 1 ---
  const act1EntranceT = springVal(frame, 0, fps, { damping: 20, stiffness: 140 });
  const charTranslateY = interpolate(act1EntranceT, [0, 1], [220, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const charOpacityIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const dissolveProgress = interpolate(frame, [75, 100], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const detailedOpacity = clamp(1 - dissolveProgress, 0, 1);
  const silhouetteOpacityAct1 = clamp(dissolveProgress, 0, 1);

  const elephantT = springVal(frame, 15, fps, { damping: 22, stiffness: 120 });
  const elephantX = interpolate(elephantT, [0, 1], [350, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const soldierT = springVal(frame, 8, fps, { damping: 25, stiffness: 100 });
  const soldierX = interpolate(soldierT, [0, 1], [-200, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // --- ACT 2 ---
  const mapOpacity = interpolate(frame, [95, 120], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const act1FadeOut = interpolate(frame, [95, 115], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const pathDrawT = spring({ frame: frame - 120, fps, config: { damping: 28, stiffness: 80, mass: 1.2 } });
  const pathProgress = clamp(pathDrawT, 0, 1);
  const dashOffset = interpolate(pathProgress, [0, 1], [PATH_LENGTH, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const mapCharPos = posAlongPath(pathProgress);

  // Alps zoom: gentle 2x max to avoid pixelation
  // Focus point: Alps area around (620, 400)
  const alpsZoomT = interpolate(frame, [178, 200], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const zoomT = spring({ frame: frame - 195, fps, config: { damping: 30, stiffness: 70, mass: 1 } });
  const totalZoom = clamp(alpsZoomT + (frame > 200 ? zoomT * 0.5 : 0), 0, 1);

  const alpsZoomScale = interpolate(totalZoom, [0, 1], [1, 2.0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Center the zoom on Alps crossing point (620, 400)
  const alpsZoomTx = interpolate(totalZoom, [0, 1], [0, -(620 * 1.0)], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const alpsZoomTy = interpolate(totalZoom, [0, 1], [0, -(400 * 1.0)], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const mapFadeOut = interpolate(frame, [240, 265], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // --- ACT 3 ---
  const act3FadeIn = interpolate(frame, [245, 268], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const morphProgress = interpolate(frame, [250, 280], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const act3DetailedOpacity = clamp(morphProgress, 0, 1);
  const act3SilhouetteOpacity = clamp(1 - morphProgress, 0, 1);

  const act3GrowT = spring({ frame: frame - 248, fps, config: { damping: 16, stiffness: 130 } });
  const act3Scale = interpolate(act3GrowT, [0, 1], [0.2, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const elAct3T = springVal(frame, 265, fps, { damping: 20, stiffness: 110 });
  const elAct3X = interpolate(elAct3T, [0, 1], [400, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const showAct1 = frame < 115;
  const showAct2 = frame >= 95 && frame < 265;
  const showAct3 = frame >= 245;

  // 9:16 scene anchor points
  const centerX = width / 2;   // 540
  const groundY = height * 0.76; // ~1460

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block" }}
    >
      {/* ===== ACT 1 — Hannibal vivid scene ===== */}
      {showAct1 && (
        <g opacity={act1FadeOut * charOpacityIn}>
          <rect width={width} height={height} fill={C.mint} />
          <SnowDots />
          <Mountains />
          <rect x={0} y={groundY} width={width} height={height - groundY} fill={C.lightGray} />
          {[groundY + 40, groundY + 90, groundY + 140].map((y) => (
            <line key={y} x1={100} y1={y} x2={980} y2={y}
              stroke={C.mint} strokeWidth={2} strokeDasharray="30 20" opacity={0.5} />
          ))}

          {/* Soldiers left */}
          <g transform={`translate(${180 + soldierX}, ${groundY})`}>
            <g transform="scale(2.2)"><SoldierSilhouette /></g>
          </g>
          <g transform={`translate(${320 + soldierX}, ${groundY})`}>
            <g transform="scale(2.2)"><SoldierSilhouette flip /></g>
          </g>

          {/* Elephant right */}
          <g transform={`translate(${820 + elephantX}, ${groundY + 10})`}>
            <g transform="scale(1.5)"><ElephantDetailed /></g>
          </g>

          {/* Hannibal center */}
          <g transform={`translate(${centerX}, ${groundY + charTranslateY})`}>
            <g transform="scale(2.6)">
              <HannibalDetailed opacity={detailedOpacity} />
              <HannibalSilhouette opacity={silhouetteOpacityAct1} />
            </g>
          </g>
        </g>
      )}

      {/* ===== ACT 2 — Map + route ===== */}
      {showAct2 && (
        <g opacity={mapOpacity * mapFadeOut}>
          <g
            transform={`scale(${alpsZoomScale}) translate(${alpsZoomTx / alpsZoomScale}, ${alpsZoomTy / alpsZoomScale})`}
            style={{ transformOrigin: "0 0" }}
          >
            <MapView />

            {/* Route draw-on */}
            {frame >= 120 && (
              <path
                d={ROUTE_PATH_D}
                fill="none"
                stroke={C.pathRed}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={PATH_LENGTH}
                strokeDashoffset={dashOffset}
              />
            )}

            {/* Waypoint dots */}
            {frame >= 125 &&
              PATH_WAYPOINTS.slice(0, Math.ceil(pathProgress * PATH_WAYPOINTS.length)).map(
                (pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r={8} fill={C.pathRed} opacity={0.8} />
                )
              )}

            {/* Hannibal silhouette on map */}
            {frame >= 120 && (
              <g transform={`translate(${mapCharPos.x}, ${mapCharPos.y - 40})`}>
                <g transform="scale(0.18)">
                  <HannibalSilhouette color={C.navy} />
                </g>
              </g>
            )}

            {/* Arrow tip */}
            {frame >= 122 && (
              <g transform={`translate(${mapCharPos.x}, ${mapCharPos.y})`}>
                <polygon points="-7,7 7,7 0,-12" fill={C.pathRed} transform="rotate(-20)" />
              </g>
            )}

            {/* Carthage marker */}
            <circle cx={540} cy={1350} r={16} fill={C.pathRed} opacity={0.9} />
            <circle cx={540} cy={1350} r={8} fill={C.white} />
          </g>
        </g>
      )}

      {/* ===== ACT 3 — Alps arrival, morph back ===== */}
      {showAct3 && (
        <g opacity={act3FadeIn}>
          <rect width={width} height={height} fill={C.mint} />
          <SnowDots />
          {/* Alps slightly different arrangement — arrived */}
          <g>
            <polygon points="-80,900 180,350 440,900" fill={C.white} />
            <polygon points="260,900 540,300 820,900" fill={C.white} />
            <polygon points="640,900 900,400 1160,900" fill={C.white} />
          </g>
          <rect x={0} y={groundY} width={width} height={height - groundY} fill={C.lightGray} />

          {/* Elephant enters from right */}
          <g transform={`translate(${820 + elAct3X}, ${groundY + 10})`}>
            <g transform="scale(1.5)"><ElephantDetailed /></g>
          </g>

          {/* Hannibal grows back */}
          <g transform={`translate(${centerX}, ${groundY}) scale(${act3Scale})`}>
            <g transform="scale(2.6)">
              <HannibalSilhouette opacity={act3SilhouetteOpacity} />
              <HannibalDetailed opacity={act3DetailedOpacity} />
            </g>
          </g>

          {/* Victory ring */}
          {frame >= 275 && (
            <circle
              cx={centerX}
              cy={groundY - 180}
              r={interpolate(frame, [275, 295], [0, 200], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })}
              fill="none"
              stroke={C.purple}
              strokeWidth={10}
              opacity={interpolate(frame, [275, 299], [0, 0.45], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })}
            />
          )}
        </g>
      )}
    </svg>
  );
};
