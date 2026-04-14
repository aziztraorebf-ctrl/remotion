import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

// ============================================================
// KirinaDateCard — 0.46s transition interlude between Segment A
// and Segment B of Soundjata Acte V.
//
// 14 frames @ 30fps = 0.47s (rounded up from 0.46s gap).
//
// Intent: a short punchy date-flash ("KIRINA - 1235") between the
// preparation shots (Segment A) and the battle shots (Segment B).
// Serves both as narrative beat AND as cover for the tiny continuity
// gap between two Seedance generations.
//
// Style: dusty amber savanna background, bold calligraphy, quick fade-in
// and hold, no fade-out (cuts straight to Segment B's aerial charge).
// ============================================================

const FPS_DEFAULT = 30;

const PAL = {
  bgWarm: "#B87A3E",        // warm amber earth
  bgDark: "#4A2B15",        // deep indigo-brown shadow
  dust: "rgba(232, 197, 71, 0.18)",
  inkPrimary: "#F5E5C4",    // warm ivory (parchment)
  inkAccent: "#D4AF37",     // GeoAfrique gold
} as const;

export const KirinaDateCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Fade in fast (frames 0 to 4), hold, no fade-out (hard cut to next segment)
  const bgOpacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title springs in slightly delayed
  const titleProgress = spring({
    frame: frame - 2,
    fps,
    config: { damping: 18, stiffness: 220 },
  });
  const titleScale = interpolate(titleProgress, [0, 1], [0.85, 1]);
  const titleOpacity = interpolate(titleProgress, [0, 0.6], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Date springs in after title
  const dateProgress = spring({
    frame: frame - 5,
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const dateScale = interpolate(dateProgress, [0, 1], [0.9, 1]);
  const dateOpacity = interpolate(dateProgress, [0, 0.6], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Subtle dust horizontal drift on the background
  const dustShift = interpolate(frame, [0, durationInFrames], [0, 40]);

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.bgDark }}>
      {/* Warm amber savanna gradient wash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${PAL.bgWarm} 0%, ${PAL.bgDark} 85%)`,
          opacity: bgOpacity,
        }}
      />

      {/* Dust particles layer (subtle drifting wash) */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(110deg, transparent 0%, ${PAL.dust} 45%, transparent 80%)`,
          opacity: bgOpacity * 0.9,
          transform: `translateX(${dustShift}px)`,
        }}
      />

      {/* Horizon line — thin warm glow */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "62%",
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${PAL.inkAccent} 30%, ${PAL.inkAccent} 70%, transparent 100%)`,
          opacity: bgOpacity * 0.65,
        }}
      />

      {/* Title "KIRINA" */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: 168,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: PAL.inkPrimary,
            textShadow: `0 6px 28px ${PAL.bgDark}, 0 0 40px rgba(245, 229, 196, 0.22)`,
          }}
        >
          KIRINA
        </div>
      </div>

      {/* Date "1235" */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${dateScale})`,
          opacity: dateOpacity,
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: 104,
            fontWeight: 500,
            fontStyle: "italic",
            letterSpacing: "0.24em",
            color: PAL.inkAccent,
            textShadow: `0 4px 20px rgba(0,0,0,0.55)`,
          }}
        >
          1235
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default KirinaDateCard;
