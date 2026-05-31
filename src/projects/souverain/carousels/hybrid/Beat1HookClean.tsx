import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from "remotion";

/**
 * Beat1HookClean — variante PROPRE du Hook Or Africain (compteur prix de l'or)
 * pour carrousel hybride. Conserve : fond parchemin premium + compteur qui grimpe.
 * Retire : RecordStamp ("RECORD HISTORIQUE"), Subtitles karaoké, ProgressBar, Audio.
 *
 * Le texte du carrousel (titre hook) vient PAR-DESSUS via CarouselSlideHybrid.
 * Format cible : 1080x1350 (4:5). Compteur placé dans le tiers haut pour laisser
 * la place au titre carrousel ancré en bas.
 */

const ORANGE = "#e89b3c";
const START_VALUE = 1000;
const END_VALUE = 5589;

export const Beat1HookClean: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Compteur grimpe sur les premiers 70% de la durée, puis hold
  const countProgress = interpolate(frame, [0, durationInFrames * 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayValue = Math.round(START_VALUE + countProgress * (END_VALUE - START_VALUE));
  const glowIntensity = 0.4 * (displayValue / END_VALUE);

  // Micro-vibration aux paliers
  const tickFrames = [0, 30, 60, 90, 120];
  const isTick = tickFrames.some((tf) => frame >= tf && frame < tf + 3);
  const vibX = isTick ? Math.sin(frame * 40) * 2 : 0;
  const vibY = isTick ? Math.cos(frame * 40) * 1 : 0;

  const scaleIn = spring({ fps, frame, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <Img
        src={staticFile("/souverain/or-africain/backgrounds/beat1-bg-v4-parchemin-modern.png")}
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.95 }}
      />
      {/* Vignette pour concentrer sur le compteur */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 28%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Compteur — placé dans le tiers haut (laisse la place au titre carrousel en bas) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${scaleIn}) translate(${vibX}px, ${vibY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 210,
            fontWeight: 800,
            color: ORANGE,
            letterSpacing: "-6px",
            textShadow: `0 0 ${50 * glowIntensity}px ${ORANGE}, 0 0 ${100 * glowIntensity}px ${ORANGE}`,
            lineHeight: 1,
          }}
        >
          ${displayValue.toLocaleString("en-US")}
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 30,
            color: "#9a9a9a",
            letterSpacing: "8px",
            marginTop: 32,
            textShadow: "0 0 8px rgba(0,0,0,0.6)",
          }}
        >
          PRIX DE L'OR / ONCE  ·  $/once
        </div>
      </div>
    </AbsoluteFill>
  );
};
