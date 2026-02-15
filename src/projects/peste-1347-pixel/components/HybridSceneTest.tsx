import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { COLORS, FONTS } from "../config/theme";

/**
 * Prototype: Hybrid scene using AI-generated background + Remotion overlays.
 * Demonstrates the "pro motion design" workflow:
 * Layer 1: Static AI image (the "set")
 * Layer 2: Animated overlays (text, data, effects)
 * Layer 3: CRT post-processing
 */

interface HybridSceneTestProps {
  startFrame: number;
  /** Path to the AI-generated background image in public/ */
  backgroundSrc: string;
}

export const HybridSceneTest: React.FC<HybridSceneTestProps> = ({
  startFrame,
  backgroundSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = Math.max(0, frame - startFrame);

  // Ken Burns: slow zoom + slight pan over the background
  const kenBurnsScale = interpolate(elapsed, [0, 300], [1.0, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kenBurnsX = interpolate(elapsed, [0, 300], [0, -15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kenBurnsY = interpolate(elapsed, [0, 300], [0, -8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated overlays timing
  const titleOpacity = interpolate(elapsed, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleScale =
    elapsed >= 10
      ? spring({
          frame: elapsed - 10,
          fps,
          config: { mass: 0.6, damping: 10, stiffness: 150 },
        })
      : 0;

  const subtitleOpacity = interpolate(elapsed, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing alert indicator
  const alertPulse = Math.sin(frame * 0.12) * 0.3 + 0.7;

  // Ticker scroll
  const tickerText =
    "/// DETECTION PATHOGENE INCONNU /// ALERTE NIVEAU 4 /// " +
    "SURVEILLANCE RENFORCEE /// PORT DE MESSINE -- 12 NAVIRES IDENTIFIES ///";
  const tickerOffset = elapsed * 1.5;

  // Scanline flicker
  const flickerOpacity =
    Math.random() > 0.97 ? 0.15 : 0;

  if (elapsed <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {/* Layer 1: AI Background with Ken Burns */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${kenBurnsScale}) translate(${kenBurnsX}px, ${kenBurnsY}px)`,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={staticFile(backgroundSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Darken overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Layer 2: Animated overlays */}

      {/* Title stamp */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          transformOrigin: "left top",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.title,
            fontSize: 42,
            color: COLORS.terminalGreen,
            letterSpacing: 3,
            textShadow: "0 0 20px rgba(0,255,65,0.5), 0 0 40px rgba(0,255,65,0.2)",
          }}
        >
          OCTOBRE 1347
        </div>
      </div>

      {/* Subtitle narrative */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 80,
          right: 80,
          opacity: subtitleOpacity,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 36,
            color: COLORS.textPrimary,
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          12 navires entrent dans le port de Messine...
        </div>
      </div>

      {/* Alert indicator - pulsing red dot */}
      <div
        style={{
          position: "absolute",
          top: 65,
          right: 80,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: COLORS.infectionRed,
            opacity: alertPulse,
            boxShadow: `0 0 10px ${COLORS.infectionRed}, 0 0 20px ${COLORS.infectionRed}40`,
          }}
        />
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 20,
            color: COLORS.infectionRed,
            letterSpacing: 2,
          }}
        >
          ALERTE
        </div>
      </div>

      {/* Ticker bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 40,
          backgroundColor: "rgba(0,0,0,0.85)",
          borderTop: `1px solid ${COLORS.terminalGreen}30`,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "0 12px",
            fontFamily: FONTS.body,
            fontSize: 16,
            color: COLORS.terminalGreenDim,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          [TERMINAL]
        </div>
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 18,
            color: COLORS.terminalGreen,
            whiteSpace: "nowrap",
            transform: `translateX(-${tickerOffset}px)`,
          }}
        >
          {tickerText}
        </div>
      </div>

      {/* Flicker overlay (random) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "white",
          opacity: flickerOpacity,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
