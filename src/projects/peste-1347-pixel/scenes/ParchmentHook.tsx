import React from "react";
import {
  AbsoluteFill,
  Img,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { CRTOverlay } from "../components/CRTOverlay";
import { FilledEuropeMap } from "../components/FilledEuropeMap";
import { PixelTypewriter } from "../components/PixelTypewriter";
import { FONTS, COLORS } from "../config/theme";

const PARCHMENT_BG = staticFile(
  "assets/peste-pixel/backgrounds/parchment-war-table.png"
);

// 10 seconds = 300 frames at 30fps
const CUE_1347 = 55;
const CUE_TEXT = 180;

// Floating dust particles for parchment breathing
const DUST_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.sin(i * 2.7) * 0.4 + 0.5,
  y: Math.cos(i * 1.9) * 0.4 + 0.5,
  size: 1.5 + (i % 3) * 0.8,
  speedX: 0.08 + (i % 5) * 0.02,
  speedY: 0.05 + (i % 4) * 0.015,
  phase: i * 0.7,
}));

export const ParchmentHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Ken Burns micro drift on parchment
  const bgScale = interpolate(frame, [0, 300], [1.02, 1.06], {
    extrapolateRight: "clamp",
  });
  const bgX = interpolate(frame, [0, 300], [0, -8], {
    extrapolateRight: "clamp",
  });
  const bgY = interpolate(frame, [0, 300], [0, -5], {
    extrapolateRight: "clamp",
  });

  // Warm candle flicker on parchment
  const candleFlicker =
    Math.sin(frame * 0.15) * 0.02 + Math.sin(frame * 0.37) * 0.01;

  // Content fade in
  const contentOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Spring helper
  const springAt = (cueFrame: number) =>
    frame >= cueFrame
      ? spring({
          frame: frame - cueFrame,
          fps,
          config: { mass: 0.6, damping: 10, stiffness: 150 },
        })
      : 0;

  // Grain seed (changes every 3 frames)
  const grainSeed = Math.floor(frame / 3);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1A140A" }}>
      {/* ============ AUDIO ============ */}
      <Audio
        src={staticFile("audio/peste-pixel/voiceover-v2-2min.mp3")}
        volume={1}
        endAt={300}
      />
      <Audio
        src={staticFile("audio/peste-pixel/music.mp3")}
        volume={0.15}
        loop
        endAt={300}
      />

      {/* ============ LAYER 1: Parchment FULL BACKGROUND ============ */}
      <AbsoluteFill
        style={{
          transform: `scale(${bgScale}) translate(${bgX}px, ${bgY}px)`,
          filter: `brightness(${0.95 + candleFlicker})`,
        }}
      >
        <Img
          src={PARCHMENT_BG}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* ============ LAYER 2: Warm vignette (darken edges) ============ */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 45%, transparent 40%, ${COLORS.parchmentVignette} 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* ============ LAYER 3: Europe Map (centered, full size) ============ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: contentOpacity,
        }}
      >
        <FilledEuropeMap
          startFrame={10}
          drawDuration={220}
          width={Math.round(width * 0.78)}
          height={Math.round(height * 0.8)}
        />
      </div>

      {/* ============ LAYER 4: Floating dust particles ============ */}
      {DUST_PARTICLES.map((p) => {
        const t = frame * 0.01;
        const px =
          (p.x + Math.sin(t * p.speedX + p.phase) * 0.15) * width;
        const py =
          (p.y + Math.cos(t * p.speedY + p.phase * 0.5) * 0.12) * height;
        const opacity =
          (Math.sin(frame * 0.05 + p.phase) * 0.3 + 0.35) *
          contentOpacity;

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: "rgba(220, 200, 160, 0.3)",
              pointerEvents: "none",
              opacity,
            }}
          />
        );
      })}

      {/* ============ LAYER 5: "1347" stamp ============ */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${springAt(CUE_1347)})`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.title,
            fontSize: 110,
            color: COLORS.plagueRed,
            textShadow: `0 0 40px ${COLORS.plagueRed}60, 0 0 80px ${COLORS.plagueRed}30, 0 2px 4px rgba(0,0,0,0.5)`,
            letterSpacing: 8,
          }}
        >
          1347
        </div>
      </div>

      {/* ============ LAYER 6: Voiceover sync text ============ */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 40,
          right: 40,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <PixelTypewriter
          text="La MOITIE de l'Europe va mourir."
          startFrame={CUE_TEXT}
          charsPerFrame={0.8}
          font="body"
          fontSize={34}
          variant="narrative"
        />
      </div>

      {/* ============ LAYER 7: Grain noise (subtle) ============ */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 80,
          opacity: 0.04,
        }}
      >
        <filter id="parchGrainV3">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves={3}
            seed={grainSeed}
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" />
        </filter>
        <rect width="100%" height="100%" filter="url(#parchGrainV3)" />
      </svg>

      {/* ============ LAYER 8 (top): CRT Overlay (subtle) ============ */}
      <CRTOverlay />
    </AbsoluteFill>
  );
};
