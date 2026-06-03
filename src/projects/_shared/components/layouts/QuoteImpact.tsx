import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GridOverlay } from "../overlays/GridOverlay";

interface QuoteImpactProps {
  question: string;
  subtitle?: string;
  startFrame: number;
  durationFrames?: number;
}

export const QuoteImpact: React.FC<QuoteImpactProps> = ({
  question,
  subtitle,
  startFrame,
  durationFrames = 411,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = Math.max(0, frame - startFrame);

  // Micro-zoom continu : 1.0 -> 1.03 sur toute la duree de la phase
  const sceneScale = interpolate(elapsed, [0, durationFrames], [1.0, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade-in global rapide (20f)
  const globalOpacity = interpolate(elapsed, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Revelation mot par mot — etalee sur 60% de la duree totale
  const words = question.split(" ");
  const revealWindow = durationFrames * 0.60;
  const framesPerWord = revealWindow / Math.max(words.length, 1);

  return (
    <AbsoluteFill
      style={{
        zIndex: 10,
        transform: `scale(${sceneScale})`,
        transformOrigin: "center center",
        opacity: globalOpacity,
      }}
    >
      {/* Fond degrade radial — navy profond au centre, presque noir aux bords */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, #1a1f35 0%, #0a0c14 60%, #050608 100%)",
        }}
      />

      {/* Grille architecturale fine */}
      <GridOverlay opacity={0.04} spacing={90} color="#c8a951" noiseOpacity={0.02} />

      {/* Guillemet ouvrant */}
      <div
        className="absolute font-serif font-bold select-none pointer-events-none"
        style={{
          top: 80,
          left: 24,
          fontSize: 380,
          lineHeight: 1,
          color: "#c8a95120",
          fontFamily: "Cinzel, Georgia, serif",
        }}
      >
        &ldquo;
      </div>

      {/* Guillemet fermant */}
      <div
        className="absolute font-serif font-bold select-none pointer-events-none"
        style={{
          bottom: 220,
          right: 24,
          fontSize: 380,
          lineHeight: 1,
          color: "#c8a95120",
          fontFamily: "Cinzel, Georgia, serif",
        }}
      >
        &rdquo;
      </div>

      {/* Zone texte principale — police reduite de ~20% (175->140) + safe zones respectees */}
      <AbsoluteFill className="flex flex-col items-center justify-center">
        <div
          className="relative z-10 flex flex-col items-center"
          style={{ padding: "0 120px", width: "100%" }}
        >
          <p
            className="text-center m-0 p-0"
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              width: "100%",
              color: "transparent",
            }}
          >
            {words.map((word, i) => {
              const wordStart = i * framesPerWord;
              const wordEnd   = wordStart + framesPerWord * 0.8;

              const wordOpacity = interpolate(elapsed, [wordStart, wordEnd], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const wordTranslateY = interpolate(elapsed, [wordStart, wordEnd], [18, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    color: "#f2ebd9",
                    opacity: wordOpacity,
                    transform: `translateY(${wordTranslateY}px)`,
                    marginRight: "0.22em",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </p>

          {/* Reglette or */}
          <div className="w-20 h-0.5 bg-gold mt-8 mb-6" />

          {subtitle && (
            <span
              className="text-slate text-center block"
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: 32,
                letterSpacing: "0.08em",
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
