import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  OffthreadVideo,
  staticFile,
} from "remotion";

// ============================================================
// BEAT 01 OCEAN OVERLAY TEST — local test only
// Probleme : beat01-o3-pan-B.mp4 = 10s, beat ocean = 13.6s
// Solution : clip 10s puis SVG overlay 3.6s (108 frames)
//
// Palette derivee du end frame pan-B :
//   fond     = #050208 (noir absolu)
//   horizon  = #D4AF37 -> #C88B1A (ligne doree)
//   cote     = #A52A2A (terracotta africain)
//   brume    = #080d1a (indigo profond)
// ============================================================

const W = 1080;
const H = 1920;
const FPS = 30;

const CLIP_DURATION_S = 10.04;
const CLIP_FRAMES = Math.round(CLIP_DURATION_S * FPS); // 301
const TOTAL_FRAMES = Math.round(13.6 * FPS); // 408

// Transition : crossfade sur 18 frames autour du cut
const CROSSFADE_START = CLIP_FRAMES - 18; // frame 283
const CROSSFADE_END = CLIP_FRAMES + 0; // frame 301

function ci(
  frame: number,
  inputRange: number[],
  outputRange: number[]
): number {
  return interpolate(frame, inputRange, outputRange, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Valeurs observees sur beat01-endframe-pan-B.png :
// Horizon : Y ~ 57% du cadre (1094px sur 1920)
// Cote africaine : bord droit, occupe ~45% de la largeur depuis la droite
// Ligne horizon : s'arrete a gauche de la cote (~W*0.55)
// Lueur dorée : centree sur la cote, fort halo a droite
const HORIZON_Y = H * 0.57;

const OceanSVGContinuation: React.FC<{ localFrame: number }> = ({
  localFrame,
}) => {
  // Vague subtile : oscillation lente de l'horizon
  const horizonY = HORIZON_Y + Math.sin(localFrame * 0.04) * 3;

  // Etoiles : deja visibles (le end frame en a ~20 dans le ciel superieur)
  const starsOpacity = ci(localFrame, [0, 10], [0.55, 0.7]);

  // Brume sur l'horizon
  const hazeOpacity = 0.18 + Math.sin(localFrame * 0.06) * 0.04;

  // Lueur horizon doree
  const glowOpacity = 0.75 + Math.sin(localFrame * 0.08) * 0.06;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <defs>
        <linearGradient id="ot-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050208" />
          <stop offset="55%" stopColor="#080d1a" />
          <stop offset="100%" stopColor="#0d1828" />
        </linearGradient>
        <linearGradient id="ot-ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1828" />
          <stop offset="100%" stopColor="#050208" />
        </linearGradient>
        {/* Horizon doré — s'etend depuis la droite (zone cote) vers la gauche */}
        <linearGradient id="ot-horizon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#050208" stopOpacity="0" />
          <stop offset="15%" stopColor="#8B6914" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#C9A227" stopOpacity="0.85" />
          <stop offset="58%" stopColor="#D4AF37" stopOpacity="1.0" />
          <stop offset="75%" stopColor="#C88B1A" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0.2" />
        </linearGradient>
        {/* Halo radial chaud — uniquement autour de la ligne d'horizon */}
        <radialGradient id="ot-glow" cx="45%" cy="57%" r="25%">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#050208" stopOpacity="0" />
        </radialGradient>
        <filter id="ot-blur-sm">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <filter id="ot-blur-md">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="ot-blur-lg">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* Fond ciel */}
      <rect x={0} y={0} width={W} height={horizonY} fill="url(#ot-sky)" />

      {/* Fond ocean */}
      <rect
        x={0}
        y={horizonY}
        width={W}
        height={H - horizonY}
        fill="url(#ot-ocean)"
      />

      {/* Cote africaine terracotta — calquee sur le end frame pan-B
          Dans le end frame : la cote occupe tout le coin bas-droit
          Le bord gauche de la cote est presque vertical, tranche net
          Le bord superieur est a la hauteur de l'horizon (horizonY) */}
      <path
        d={`M ${W * 0.6} ${horizonY}
            L ${W * 0.58} ${horizonY + 100}
            L ${W * 0.56} ${horizonY + 300}
            L ${W * 0.54} ${horizonY + 600}
            L ${W * 0.54} ${H}
            L ${W} ${H}
            L ${W} ${horizonY}
            Z`}
        fill="#A52A2A"
        opacity={0.93}
      />
      {/* Bord gauche de la cote — tranche nette avec ombre */}
      <path
        d={`M ${W * 0.6} ${horizonY}
            L ${W * 0.58} ${horizonY + 100}
            L ${W * 0.56} ${horizonY + 300}
            L ${W * 0.54} ${horizonY + 600}
            L ${W * 0.54} ${H}`}
        fill="none"
        stroke="#5A1010"
        strokeWidth={5}
        opacity={0.5}
      />

      {/* Etoiles dans le ciel superieur */}
      <g opacity={starsOpacity}>
        {[
          [85, 120, 1.1],
          [210, 85, 0.9],
          [320, 150, 1.3],
          [430, 70, 1.0],
          [520, 200, 1.4],
          [140, 260, 1.2],
          [380, 310, 0.8],
          [75, 380, 1.0],
          [265, 420, 1.3],
          [460, 380, 0.9],
          [55, 510, 1.1],
          [195, 560, 0.8],
          [340, 490, 1.2],
          [420, 540, 1.0],
          [115, 640, 0.9],
          [295, 680, 1.4],
          [390, 720, 0.8],
          [80, 750, 1.1],
          [230, 800, 0.9],
          [360, 830, 1.2],
        ].map(([sx, sy, sr], i) => {
          const twinkle =
            0.4 +
            0.35 *
              Math.sin(localFrame * 0.05 + i * 1.4) *
              Math.sin(localFrame * 0.09 + i * 0.8);
          return (
            <circle
              key={i}
              cx={sx}
              cy={sy}
              r={sr}
              fill="#E8D4A8"
              opacity={twinkle}
            />
          );
        })}
      </g>

      {/* Halo chaud derriere la cote */}
      <rect
        x={0}
        y={0}
        width={W}
        height={H}
        fill="url(#ot-glow)"
      />

      {/* Bande lumineuse horizon — identique au end frame */}
      <rect
        x={0}
        y={horizonY - 6}
        width={W * 0.58}
        height={12}
        fill="url(#ot-horizon)"
        opacity={glowOpacity}
        filter="url(#ot-blur-sm)"
      />
      {/* Lueur diffuse autour de la bande */}
      <rect
        x={0}
        y={horizonY - 40}
        width={W * 0.65}
        height={80}
        fill="url(#ot-horizon)"
        opacity={glowOpacity * 0.4}
        filter="url(#ot-blur-lg)"
      />

      {/* Brume horizon */}
      <rect
        x={0}
        y={horizonY - 30}
        width={W}
        height={60}
        fill="#10182e"
        opacity={hazeOpacity}
        filter="url(#ot-blur-md)"
      />

      {/* Reflets ocean subtils */}
      {[0.62, 0.70, 0.78].map((fy, i) => (
        <line
          key={i}
          x1={W * 0.05}
          y1={H * fy + Math.sin(localFrame * 0.04 + i) * 2}
          x2={W * 0.52}
          y2={H * fy + Math.sin(localFrame * 0.04 + i + 1.2) * 2}
          stroke="#C9A227"
          strokeWidth={0.7}
          opacity={0.07 + Math.sin(localFrame * 0.035 + i * 1.1) * 0.025}
        />
      ))}
    </svg>
  );
};

export const Beat01OceanOverlayTest: React.FC = () => {
  const frame = useCurrentFrame();

  // Opacite du clip video : 1.0 jusqu'a crossfade, puis fade out
  const videoOpacity = ci(frame, [CROSSFADE_START, CROSSFADE_END], [1, 0]);

  // Opacite du SVG overlay : 0 jusqu'a crossfade, puis fade in
  const svgOpacity = ci(frame, [CROSSFADE_START, CROSSFADE_END], [0, 1]);

  // Frame locale dans le SVG (commence a 0 au moment du crossfade)
  const localFrame = Math.max(0, frame - CROSSFADE_START);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050208" }}>
      {/* Clip Kling — joue jusqu'a la fin (freeze naturel sur last frame) */}
      {frame < CLIP_FRAMES + 5 && (
        <AbsoluteFill style={{ opacity: videoOpacity }}>
          <OffthreadVideo
            muted
            src={staticFile("assets/geoafrique/beat01-o3-pan-B.mp4")}
            startFrom={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {/* SVG Ocean Continuation — fade in au moment du crossfade */}
      {frame >= CROSSFADE_START && (
        <AbsoluteFill style={{ opacity: svgOpacity }}>
          <OceanSVGContinuation localFrame={localFrame} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
