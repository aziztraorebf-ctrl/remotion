import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  staticFile,
} from "remotion";

// ============================================================
// HistoricalMapGemini — Carte Gemini V4 parchment + pipeline camera COMPLET
// Format : 1080x1920 (Short vertical) | 30s @ 30fps = 900 frames
//
// COPIE EXACTE du timing/camera de HistoricalMap (d3-geo) :
// PART 1 (0-300f) : Route Tombouctou -> Senegal
// PART 2 (300-600f) : Empire du Mali (bordures colorees via overlay)
// PART 3 (600-900f) : Deep zoom + icones Gemini
// ============================================================

const W = 1080;
const H = 1920;

const PAL = {
  gold: "#D4AF37",
  goldGlow: "rgba(212, 175, 55, 0.3)",
  goldPulse: "rgba(212, 175, 55, 0.15)",
  empireBorder: "#C9A227",
  text: "#2C1810",
  textBg: "rgba(245, 230, 200, 0.90)",
} as const;

// -- Positions villes (calibrees sur V4 parchment) --
const TOMBOUCTOU = { x: W * 0.55, y: H * 0.30 };
const NIANI = { x: W * 0.30, y: H * 0.48 };
const SENEGAL_COAST = { x: W * 0.10, y: H * 0.38 };
const MAP_CENTER = { x: W * 0.42, y: H * 0.38 };
const CARAVAN_PT = { x: W * 0.38, y: H * 0.40 };

// -- Route 1 : Tombouctou -> Senegal --
const ROUTE1: [number, number][] = [
  [TOMBOUCTOU.x, TOMBOUCTOU.y],
  [W * 0.45, H * 0.32],
  [W * 0.35, H * 0.35],
  [W * 0.22, H * 0.37],
  [W * 0.15, H * 0.38],
  [SENEGAL_COAST.x, SENEGAL_COAST.y],
];

// -- Route 2 : Niani -> Tombouctou --
const ROUTE2: [number, number][] = [
  [NIANI.x, NIANI.y],
  [W * 0.34, H * 0.44],
  [W * 0.40, H * 0.38],
  [W * 0.48, H * 0.33],
  [TOMBOUCTOU.x, TOMBOUCTOU.y],
];


// ── Helpers ──────────────────────────────────────────────────
function buildCurve(points: [number, number][]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    d += ` Q ${(prev[0] + curr[0]) / 2} ${(prev[1] + curr[1]) / 2 - 10} ${curr[0]} ${curr[1]}`;
  }
  return d;
}

function getDot(progress: number, points: [number, number][]) {
  const total = points.length - 1;
  const seg = Math.min(Math.floor(progress * total), total - 1);
  const t = progress * total - seg;
  const a = points[seg];
  const b = points[Math.min(seg + 1, points.length - 1)];
  return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t };
}

function evolve(progress: number, len: number) {
  const drawn = len * progress;
  return `${drawn} ${len - drawn}`;
}

// ── Sous-composants ──────────────────────────────────────────
function PulseRing({ cx, cy, frame, startFrame }: {
  cx: number; cy: number; frame: number; startFrame: number;
}) {
  const local = frame - startFrame;
  if (local < 0) return null;
  return (
    <>
      {[0, 20, 40].map((offset, i) => {
        const t = ((local - offset) % 60 + 60) % 60 / 60;
        if (local < offset) return null;
        return (
          <circle key={i} cx={cx} cy={cy} r={8 + t * 35}
            fill="none" stroke={PAL.gold} strokeWidth={1.5} opacity={(1 - t) * 0.4}
          />
        );
      })}
    </>
  );
}

function CityLabel({ name, x, y, ox, oy, appear }: {
  name: string; x: number; y: number; ox: number; oy: number; appear: number;
}) {
  return (
    <g opacity={appear} transform={`translate(${x}, ${y})`}>
      <circle r={6} fill={PAL.gold} stroke="#FFFFFF" strokeWidth={2} />
      <g transform={`translate(${ox}, ${oy})`}>
        <rect x={-6} y={-16} width={name.length * 12 + 16} height={26}
          rx={4} fill={PAL.textBg} stroke={PAL.gold} strokeWidth={1}
        />
        <text x={2} y={2} fontFamily="Georgia, serif" fontSize={16}
          fontWeight="bold" fill={PAL.text}
        >{name}</text>
      </g>
    </g>
  );
}

function MapIcon({ x, y, src, size, appear }: {
  x: number; y: number; src: string; size: number; appear: number;
}) {
  if (appear <= 0) return null;
  const half = size / 2;
  return (
    <g opacity={appear} transform={`translate(${x}, ${y}) scale(${appear})`}>
      <image href={staticFile(src)} x={-half} y={-half} width={size} height={size} />
    </g>
  );
}

// ── Composant principal ──────────────────────────────────────
export const HistoricalMapGemini: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const route1 = React.useMemo(() => buildCurve(ROUTE1), []);
  const route2 = React.useMemo(() => buildCurve(ROUTE2), []);
  const R1_LEN = 600;
  const R2_LEN = 450;

  // ================================================================
  // TIMING — exactement identique a HistoricalMap d3-geo
  // ================================================================

  const mapOpacity = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // -- Phase markers (memes que d3-geo) --
  const PULLBACK_END = 60;
  const BREATHE1_END = 90;
  const PAN1_END = 210;
  const SNAP1_END = 240;

  // -- Route 1 trace (Part 1) --
  const trace1 = interpolate(frame, [BREATHE1_END, PAN1_END], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const dot1 = getDot(trace1, ROUTE1);


  // -- Niani label (Part 2) --
  const nianiLabel = spring({
    frame: frame - 390,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  // -- Route 2 trace (Part 2, 420-510f) --
  const trace2 = interpolate(frame, [420, 510], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const dot2 = getDot(trace2, ROUTE2);

  // -- Icones (Part 3) --
  const mosqueAppear = spring({ frame: frame - 660, fps, config: { damping: 16, stiffness: 120 } });
  const caravanAppear = spring({ frame: frame - 690, fps, config: { damping: 18, stiffness: 100 } });
  const mansaAppear = spring({ frame: frame - 750, fps, config: { damping: 14, stiffness: 140 } });

  // ================================================================
  // CAMERA — copie exacte de HistoricalMap d3-geo
  // ================================================================

  const breathe = Math.sin(frame * 0.08) * 0.006;

  // -- ZOOM --
  let zoomScale: number;
  if (frame <= PULLBACK_END) {
    zoomScale = interpolate(frame, [0, PULLBACK_END], [1.35, 1.12], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }) + breathe;
  } else if (frame <= PAN1_END) {
    zoomScale = interpolate(frame, [PULLBACK_END, PAN1_END], [1.12, 1.20], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }) + breathe;
  } else if (frame <= 300) {
    const snap1 = spring({ frame: frame - PAN1_END, fps, config: { damping: 12, stiffness: 300 } });
    zoomScale = 1.20 + snap1 * 0.10 + breathe;
  } else if (frame <= 360) {
    zoomScale = 1.30 + breathe;
  } else if (frame <= 420) {
    const snapNiani = spring({ frame: frame - 360, fps, config: { damping: 14, stiffness: 200 } });
    zoomScale = 1.30 + snapNiani * 0.12 + breathe;
  } else if (frame <= 510) {
    zoomScale = interpolate(frame, [420, 510], [1.42, 1.25], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }) + breathe;
  } else if (frame <= 600) {
    zoomScale = interpolate(frame, [510, 570], [1.25, 1.05], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }) + breathe;
  } else if (frame <= 660) {
    zoomScale = interpolate(frame, [600, 660], [1.05, 2.8], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
  } else if (frame <= 720) {
    zoomScale = 2.8 + breathe * 2;
  } else if (frame <= 780) {
    zoomScale = interpolate(frame, [720, 780], [2.8, 2.4], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }) + breathe;
  } else if (frame <= 840) {
    zoomScale = interpolate(frame, [780, 840], [2.4, 1.0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }) + breathe;
  } else {
    zoomScale = 1.0 + breathe;
  }

  // -- PAN --
  let panX: number;
  let panY: number;

  if (frame <= BREATHE1_END) {
    panX = TOMBOUCTOU.x; panY = TOMBOUCTOU.y;
  } else if (frame <= PAN1_END) {
    const p = interpolate(frame, [BREATHE1_END, PAN1_END], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    panX = TOMBOUCTOU.x + (SENEGAL_COAST.x - TOMBOUCTOU.x) * p;
    panY = TOMBOUCTOU.y + (SENEGAL_COAST.y - TOMBOUCTOU.y) * p;
  } else if (frame <= 360) {
    panX = SENEGAL_COAST.x; panY = SENEGAL_COAST.y;
  } else if (frame <= 420) {
    const p = interpolate(frame, [360, 420], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    panX = SENEGAL_COAST.x + (NIANI.x - SENEGAL_COAST.x) * p;
    panY = SENEGAL_COAST.y + (NIANI.y - SENEGAL_COAST.y) * p;
  } else if (frame <= 510) {
    const p = interpolate(frame, [420, 510], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    panX = NIANI.x + (TOMBOUCTOU.x - NIANI.x) * p;
    panY = NIANI.y + (TOMBOUCTOU.y - NIANI.y) * p;
  } else if (frame <= 600) {
    const p = interpolate(frame, [510, 570], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    panX = TOMBOUCTOU.x + (MAP_CENTER.x - TOMBOUCTOU.x) * p;
    panY = TOMBOUCTOU.y + (MAP_CENTER.y - TOMBOUCTOU.y) * p;
  } else if (frame <= 720) {
    const p = interpolate(frame, [600, 660], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    panX = MAP_CENTER.x + (TOMBOUCTOU.x - MAP_CENTER.x) * p;
    panY = MAP_CENTER.y + (TOMBOUCTOU.y - MAP_CENTER.y) * p;
  } else if (frame <= 780) {
    const p = interpolate(frame, [720, 780], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    panX = TOMBOUCTOU.x + (NIANI.x - TOMBOUCTOU.x) * p;
    panY = TOMBOUCTOU.y + (NIANI.y - TOMBOUCTOU.y) * p;
  } else {
    const p = interpolate(frame, [780, 840], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    panX = NIANI.x + (MAP_CENTER.x - NIANI.x) * p;
    panY = NIANI.y + (MAP_CENTER.y - NIANI.y) * p;
  }

  // -- ROTATION --
  let rotation = 0;
  if (frame > BREATHE1_END && frame <= PAN1_END) {
    rotation = interpolate(frame, [BREATHE1_END, (BREATHE1_END + PAN1_END) / 2, PAN1_END], [0, 2.5, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  } else if (frame > 360 && frame <= 420) {
    rotation = interpolate(frame, [360, 390, 420], [0, -2, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  } else if (frame > 420 && frame <= 510) {
    rotation = interpolate(frame, [420, 465, 510], [0, 1.5, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  } else if (frame > 720 && frame <= 780) {
    rotation = interpolate(frame, [720, 750, 780], [0, -1.5, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  }

  // -- Labels --
  const labelTombouctou = spring({ frame: frame - 30, fps, config: { damping: 20, stiffness: 120 } });
  const labelSenegal = spring({ frame: frame - PAN1_END, fps, config: { damping: 18, stiffness: 150 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#c8d0d8" }}>
      {/* Narration — demarre a 1s (30 frames) pour laisser le pull back s'installer */}
      <Sequence from={30}>
        <Audio src={staticFile("assets/geoafrique/audio/historical-map-narration.mp3")} />
      </Sequence>

      {/* Musique de fond — demarre au frame 0, volume -18dB sous la voix */}
      <Audio
        src={staticFile("assets/geoafrique/audio/historical-map-music-minimax26-v2-30s.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [0, 30, 870, 900],
            [0, 0.12, 0.12, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
      />

      <div
        style={{
          width: W, height: H,
          transform: `translate(${panX}px, ${panY}px) scale(${zoomScale}) rotate(${rotation}deg) translate(${-panX}px, ${-panY}px)`,
          transformOrigin: "0 0",
          opacity: mapOpacity,
        }}
      >
        {/* Carte Gemini V4 parchment */}
        <Img
          src={staticFile("assets/geoafrique/maps/west-africa-map-v4-parchment.png")}
          style={{ width: W, height: H, objectFit: "cover", position: "absolute" }}
        />

        {/* Overlays SVG */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* Route 1 */}
          {trace1 > 0 && (
            <>
              <path d={route1} fill="none" stroke={PAL.goldGlow} strokeWidth={14}
                strokeLinecap="round" strokeDasharray={evolve(trace1, R1_LEN)}
              />
              <path d={route1} fill="none" stroke={PAL.gold} strokeWidth={4}
                strokeLinecap="round" strokeDasharray={evolve(trace1, R1_LEN)}
              />
            </>
          )}

          {/* Route 2 */}
          {trace2 > 0 && (
            <>
              <path d={route2} fill="none" stroke={PAL.goldGlow} strokeWidth={14}
                strokeLinecap="round" strokeDasharray={evolve(trace2, R2_LEN)}
              />
              <path d={route2} fill="none" stroke={PAL.gold} strokeWidth={4}
                strokeLinecap="round" strokeDasharray={evolve(trace2, R2_LEN)}
              />
            </>
          )}

          {/* Dots */}
          {trace1 > 0 && trace1 < 1 && (
            <>
              <circle cx={dot1.x} cy={dot1.y} r={12} fill={PAL.goldPulse}
                opacity={0.5 + Math.sin(frame * 0.3) * 0.2}
              />
              <circle cx={dot1.x} cy={dot1.y} r={5} fill={PAL.gold} />
            </>
          )}
          {trace2 > 0 && trace2 < 1 && (
            <>
              <circle cx={dot2.x} cy={dot2.y} r={12} fill={PAL.goldPulse}
                opacity={0.5 + Math.sin(frame * 0.3) * 0.2}
              />
              <circle cx={dot2.x} cy={dot2.y} r={5} fill={PAL.gold} />
            </>
          )}

          {/* Pulse rings */}
          <PulseRing cx={TOMBOUCTOU.x} cy={TOMBOUCTOU.y} frame={frame} startFrame={40} />
          <PulseRing cx={SENEGAL_COAST.x} cy={SENEGAL_COAST.y} frame={frame} startFrame={PAN1_END + 10} />
          {nianiLabel > 0 && (
            <PulseRing cx={NIANI.x} cy={NIANI.y} frame={frame} startFrame={400} />
          )}

          {/* Icones Gemini (Part 3) */}
          <MapIcon x={TOMBOUCTOU.x} y={TOMBOUCTOU.y - 50}
            src="assets/geoafrique/icons/mosque-icon-v2-transparent.png"
            size={70} appear={mosqueAppear}
          />
          <MapIcon x={CARAVAN_PT.x} y={CARAVAN_PT.y - 25}
            src="assets/geoafrique/icons/caravan-icon-v2-transparent.png"
            size={90} appear={caravanAppear}
          />
          <MapIcon x={NIANI.x} y={NIANI.y - 55}
            src="assets/geoafrique/icons/mansa-moussa-icon-v2-transparent.png"
            size={70} appear={mansaAppear}
          />

          {/* Labels */}
          <CityLabel name="Tombouctou" x={TOMBOUCTOU.x} y={TOMBOUCTOU.y}
            ox={14} oy={-20} appear={labelTombouctou}
          />
          <CityLabel name="Cote du Senegal" x={SENEGAL_COAST.x} y={SENEGAL_COAST.y}
            ox={14} oy={18} appear={labelSenegal}
          />
          {nianiLabel > 0 && (
            <CityLabel name="Niani" x={NIANI.x} y={NIANI.y}
              ox={14} oy={18} appear={nianiLabel}
            />
          )}

          {/* Titre final */}
          {frame > 530 && (() => {
            const t = spring({ frame: frame - 530, fps, config: { damping: 20, stiffness: 100 } });
            return (
              <g opacity={t}>
                <rect x={W / 2 - 180} y={H * 0.78 - 30} width={360} height={50}
                  rx={6} fill={PAL.textBg} stroke={PAL.empireBorder} strokeWidth={2}
                />
                <text x={W / 2} y={H * 0.78 + 5}
                  fontFamily="Georgia, serif" fontSize={26} fontWeight="bold"
                  fill={PAL.text} textAnchor="middle"
                >Empire du Mali (XIIIe s.)</text>
              </g>
            );
          })()}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
