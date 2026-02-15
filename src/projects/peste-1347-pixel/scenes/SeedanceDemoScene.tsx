import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Video,
  staticFile,
} from "remotion";
import { COLORS, FONTS } from "../config/theme";
import { CRTOverlay } from "../components/CRTOverlay";

/**
 * Demo: Seedance 2.0 animated background (from Recraft illustration) + light HUD overlay.
 * 5 seconds (150 frames at 30fps).
 * Seedance handles ALL scene animation. Remotion only adds text HUD + CRT post-processing.
 */

export const SeedanceDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -- Title text --
  const titleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleScale =
    frame >= 10
      ? spring({
          frame: frame - 10,
          fps,
          config: { mass: 0.6, damping: 10, stiffness: 150 },
        })
      : 0;

  // -- Stat counter (starts earlier since video is shorter) --
  const statStart = 40;
  const deathCount = Math.floor(
    interpolate(frame, [statStart, statStart + 60], [0, 25000000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const statOpacity = interpolate(frame, [statStart, statStart + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // -- Narrative text --
  const narrativeOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // -- Alert pulse --
  const alertPulse = Math.sin(frame * 0.15) * 0.3 + 0.7;

  // -- Ticker --
  const tickerText =
    "/// ALERTE PANDEMIQUE /// DETECTION YERSINIA PESTIS /// " +
    "MORTALITE ESTIMEE: 30-60% POPULATION EUROPEENNE /// " +
    "QUARANTAINE INEFFICACE /// PROPAGATION PAR VOIE MARITIME ///";
  const tickerOffset = frame * 2;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {/* LAYER 1: Seedance 2.0 animated background */}
      <Video
        src={staticFile("assets/peste-pixel/backgrounds/seedance2-animated-street.mp4")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        volume={0}
        loop
      />

      {/* LAYER 2: Light text HUD only */}

      {/* Title stamp top-left */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 70,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          transformOrigin: "left top",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.title,
            fontSize: 38,
            color: COLORS.terminalGreen,
            letterSpacing: 3,
            textShadow: `0 0 20px rgba(0,255,65,0.5), 0 0 40px rgba(0,255,65,0.2)`,
          }}
        >
          OCTOBRE 1347
        </div>
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 22,
            color: COLORS.terminalGreenDim,
            marginTop: 8,
            letterSpacing: 2,
          }}
        >
          /// ANALYSE COMPORTEMENTALE ///
        </div>
      </div>

      {/* Alert indicator top-right */}
      <div
        style={{
          position: "absolute",
          top: 55,
          right: 70,
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
            fontSize: 22,
            color: COLORS.infectionRed,
            letterSpacing: 2,
          }}
        >
          ALERTE NIVEAU 4
        </div>
      </div>

      {/* Death counter */}
      <div
        style={{
          position: "absolute",
          top: 140,
          right: 70,
          opacity: statOpacity,
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 18,
            color: COLORS.terminalGreenDim,
            letterSpacing: 1,
          }}
        >
          VICTIMES ESTIMEES
        </div>
        <div
          style={{
            fontFamily: FONTS.title,
            fontSize: 32,
            color: COLORS.infectionRed,
            textShadow: `0 0 15px ${COLORS.infectionRed}80`,
            letterSpacing: 2,
          }}
        >
          {deathCount.toLocaleString("fr-FR")}
        </div>
      </div>

      {/* Narrative text bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 70,
          right: 70,
          opacity: narrativeOpacity,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 36,
            color: COLORS.textPrimary,
            textShadow: "0 2px 10px rgba(0,0,0,0.9)",
            lineHeight: 1.4,
          }}
        >
          12 navires entrent dans le port de Messine...
          <br />
          La MOITIE de l&apos;Europe va mourir.
        </div>
      </div>

      {/* Ticker bar */}
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

      {/* LAYER 3: CRT post-processing only */}
      <CRTOverlay />
    </div>
  );
};
