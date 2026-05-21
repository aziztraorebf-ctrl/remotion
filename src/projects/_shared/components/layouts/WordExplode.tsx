import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export interface WordExplodeProps {
  wordA?: string;
  wordB?: string;
  labelA?: string;
  labelB?: string;
  subtitle?: string;
}

const pseudoRandom = (seed: number): number => {
  const x = Math.sin(seed * 127.1) * 43758.5;
  return x - Math.floor(x);
};

const LETTER_WIDTH = 90;
const LETTER_HEIGHT = 140;

export const WordExplode: React.FC<WordExplodeProps> = ({
  wordA = "COLONIE",
  wordB = "RICHESSE",
  labelA = "LE PASSE",
  labelB = "LA VERITE",
  subtitle = "AFRIQUE · RESILIENCE",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 1080 / 2;
  const CY = 1920 / 2;

  // Header spring
  const headerProgress = spring({ frame, fps, config: { damping: 80, stiffness: 60 } });

  // Flash opacity (white flash during explosion)
  const flashOpacity = interpolate(frame, [40, 47, 60], [0, 0.25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Word A center X
  const totalWidthA = wordA.length * LETTER_WIDTH;
  const startXA = CX - totalWidthA / 2;

  // Word B center X
  const totalWidthB = wordB.length * LETTER_WIDTH;
  const startXB = CX - totalWidthB / 2;

  // Label A opacity (visible during phase 1, fades at explosion)
  const labelAOpacity = interpolate(frame, [0, 15, 40, 60], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label B opacity (appears at frame 150)
  const labelBOpacity = interpolate(frame, [150, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle opacity
  const subtitleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Word B glow pulse (frame 160-210)
  const glowPhase = interpolate(frame, [160, 185, 210], [0, 1, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowAlpha = 0.3 + glowPhase * 0.4;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1420", overflow: "hidden" }}>
      {/* Flash effect during explosion */}
      <AbsoluteFill
        style={{
          backgroundColor: "white",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Top header */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Cinzel, serif",
          fontSize: 48,
          fontWeight: 700,
          color: "#c4a053",
          letterSpacing: "0.15em",
          opacity: headerProgress,
          transform: `translateY(${(1 - headerProgress) * -20}px)`,
        }}
      >
        TRANSFORMATION
      </div>

      {/* Decorative line under header */}
      <div
        style={{
          position: "absolute",
          top: 172,
          left: "50%",
          transform: `translateX(-50%) scaleX(${headerProgress})`,
          width: 200,
          height: 2,
          backgroundColor: "#c4a053",
          opacity: 0.5,
        }}
      />

      {/* Word A letters */}
      {Array.from(wordA).map((letter, i) => {
        const cx = startXA + i * LETTER_WIDTH + LETTER_WIDTH / 2;
        const cy = CY;

        // Phase 1: pop-in (frame 0 to 40), staggered by i * 4
        const popDelay = i * 4;
        const popProgress = spring({
          frame: Math.max(0, frame - popDelay),
          fps,
          config: { damping: 70, stiffness: 80 },
        });
        const popScale = interpolate(popProgress, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Phase 2: explosion (frame 40 to 90)
        const angle = pseudoRandom(i * 7.3) * Math.PI * 2;
        const dist = 300 + pseudoRandom(i * 3.1) * 400;
        const explodeProgress = interpolate(frame, [40, 90], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const dx = Math.cos(angle) * dist * explodeProgress;
        const dy = Math.sin(angle) * dist * explodeProgress;
        const rotation = pseudoRandom(i * 5.7) > 0.5
          ? explodeProgress * 180
          : explodeProgress * -180;
        const letterOpacity = interpolate(frame, [60, 90], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // During pop-in phase, don't explode yet
        const currentDx = frame >= 40 ? dx : 0;
        const currentDy = frame >= 40 ? dy : 0;
        const currentRotation = frame >= 40 ? rotation : 0;
        const currentOpacity = frame >= 40 ? letterOpacity : (frame < 2 ? 0 : popScale);

        return (
          <div
            key={`a-${i}`}
            style={{
              position: "absolute",
              left: cx + currentDx,
              top: cy + currentDy,
              transform: `translate(-50%, -50%) scale(${frame < 40 ? popScale : 1}) rotate(${currentRotation}deg)`,
              fontFamily: "Cinzel, serif",
              fontSize: LETTER_HEIGHT,
              fontWeight: 700,
              color: "#c4a053",
              width: LETTER_WIDTH,
              textAlign: "center",
              opacity: currentOpacity,
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            {letter}
          </div>
        );
      })}

      {/* Word B letters */}
      {Array.from(wordB).map((letter, j) => {
        const finalX = startXB + j * LETTER_WIDTH + LETTER_WIDTH / 2;
        const finalY = CY;

        // Each letter of B converges from a dispersed position
        const disperseAngle = pseudoRandom(j * 11.3 + 99) * Math.PI * 2;
        const disperseDist = 400 + pseudoRandom(j * 4.7 + 55) * 300;
        const startX = finalX + Math.cos(disperseAngle) * disperseDist;
        const startY = finalY + Math.sin(disperseAngle) * disperseDist;

        const convergeDelay = 90 + j * 5;
        const convergeProgress = spring({
          frame: Math.max(0, frame - convergeDelay),
          fps,
          config: { damping: 80, stiffness: 50 },
        });

        const currentX = interpolate(convergeProgress, [0, 1], [startX, finalX], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const currentY = interpolate(convergeProgress, [0, 1], [startY, finalY], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const letterScale = interpolate(convergeProgress, [0, 1], [0.3, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const letterRotation = interpolate(
          convergeProgress,
          [0, 1],
          [pseudoRandom(j * 6.1) > 0.5 ? 90 : -90, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const letterOpacity = interpolate(convergeProgress, [0, 0.15, 1], [0, 1, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Glow during hold phase
        const textShadow = frame >= 160
          ? `0 0 60px rgba(196,160,83,0.8), 0 0 120px rgba(196,160,83,0.4)`
          : "none";

        return (
          <div
            key={`b-${j}`}
            style={{
              position: "absolute",
              left: currentX,
              top: currentY,
              transform: `translate(-50%, -50%) scale(${letterScale}) rotate(${letterRotation}deg)`,
              fontFamily: "Cinzel, serif",
              fontSize: LETTER_HEIGHT,
              fontWeight: 700,
              color: "#f2ebd9",
              width: LETTER_WIDTH,
              textAlign: "center",
              opacity: letterOpacity,
              lineHeight: 1,
              textShadow,
              userSelect: "none",
            }}
          >
            {letter}
          </div>
        );
      })}

      {/* Label A — below word A */}
      {labelA && (
        <div
          style={{
            position: "absolute",
            top: CY + 100,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "Cinzel, serif",
            fontSize: 28,
            letterSpacing: "0.25em",
            color: "#64748b",
            opacity: labelAOpacity,
          }}
        >
          {labelA}
        </div>
      )}

      {/* Label B — below word B */}
      {labelB && (
        <div
          style={{
            position: "absolute",
            top: CY + 100,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 28,
            letterSpacing: "0.2em",
            color: "#c4a053",
            opacity: labelBOpacity,
          }}
        >
          {labelB}
        </div>
      )}

      {/* Bottom subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 24,
          letterSpacing: "0.3em",
          color: "#64748b",
          opacity: subtitleOpacity,
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};
