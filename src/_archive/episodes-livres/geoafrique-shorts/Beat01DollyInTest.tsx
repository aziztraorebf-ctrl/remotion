import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Video,
  staticFile,
} from "remotion";

// ============================================================
// BEAT 01 DOLLY IN TEST — local test only, NOT in AbouBakariShort
// Clip : beat01-dollyin-v1.mp4 (Kling V2.1 dolly in, 5s)
// "1311" overlay identique a la version retenue
// ============================================================

const W = 1080;
const H = 1920;
const FPS = 30;

function clampI(v: number): number {
  return interpolate(v, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export const Beat01DollyInTest: React.FC = () => {
  const frame = useCurrentFrame();

  // "1311" — spring pop entree, fade out a ~3s (frame 90)
  const spr = spring({ frame, fps: FPS, config: { damping: 8, stiffness: 120 } });
  const fadeInOp = clampI(interpolate(frame, [0, 8], [0, 1]));
  const fadeOutOp = clampI(interpolate(frame, [70, 100], [1, 0]));
  const textOpacity = fadeInOp * fadeOutOp;
  const textScale = spr;

  const gradId = "dollyin-goldGrad";

  return (
    <AbsoluteFill style={{ backgroundColor: "#050208" }}>
      <Video
        muted
        src={staticFile("assets/geoafrique/beat01-dollyin-v1.mp4")}
        startFrom={0}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F0D060" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#A07820" />
          </linearGradient>
          <filter id="dollyin-textGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <text
          x={W / 2}
          y={H * 0.28}
          textAnchor="middle"
          fill={`url(#${gradId})`}
          fontSize={220}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="bold"
          opacity={textOpacity}
          filter="url(#dollyin-textGlow)"
          transform={`translate(${W / 2},${H * 0.28}) scale(${textScale}) translate(${-W / 2},${-H * 0.28})`}
        >
          1311
        </text>
      </svg>
    </AbsoluteFill>
  );
};
