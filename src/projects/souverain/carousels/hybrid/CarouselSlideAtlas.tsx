import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, staticFile } from "remotion";

/**
 * CarouselSlideAtlas — slide carrousel pour vidéos Atlas (D3/data-viz).
 * Contrairement à CarouselSlideHybrid (clip vidéo), ce composant utilise
 * une image statique avec Ken Burns léger pour éviter la collision de texte
 * entre le fond chargé (titres data-viz natifs) et notre overlay K&C.
 *
 * Le voile navy couvre le bas (texte nous) et atténue le haut (données natives).
 */

export interface CarouselSlideAtlasProps {
  bgImage: string;
  highlight?: string;
  body: string;
  slideIndex: number;
  totalSlides: number;
  textAnchor?: "bottom" | "top";
  isHook?: boolean;
  subtitle?: string;
  /** intensité du Ken Burns : "subtle" (défaut) ou "none" */
  kenBurns?: "subtle" | "none";
  /** opacité du voile sur le haut (pour couvrir titres natifs) : 0-1, défaut 0.55 */
  topVeilOpacity?: number;
}

const GOLD = "#c8a951";

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 8, width: "100%" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 3,
            flex: 1,
            borderRadius: 2,
            backgroundColor: i <= current ? GOLD : "rgba(200,169,81,0.25)",
          }}
        />
      ))}
    </div>
  );
}

export const CarouselSlideAtlas: React.FC<CarouselSlideAtlasProps> = ({
  bgImage,
  highlight,
  body,
  slideIndex,
  totalSlides,
  textAnchor = "bottom",
  isHook = false,
  subtitle,
  kenBurns = "subtle",
  topVeilOpacity = 0.55,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const textOpacity = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = kenBurns === "subtle"
    ? interpolate(frame, [0, durationInFrames], [1.0, 1.06], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#16213a", overflow: "hidden" }}>
      {/* Image statique + Ken Burns */}
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <Img
          src={staticFile(bgImage)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Voile global — fond semi-transparent uniforme pour neutraliser le texte natif Atlas */}
      <AbsoluteFill style={{ backgroundColor: "rgba(22,33,58,0.45)" }} />

      {/* Voile bas — lisibilité texte K&C */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to top, rgba(22,33,58,0.97) 0%, rgba(22,33,58,0.80) 38%, rgba(22,33,58,0.0) 62%)",
        }}
      />

      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "28px 40px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: GOLD, letterSpacing: 4, fontWeight: 700 }}>
            K&amp;C
          </span>
        </div>
        <ProgressBar current={slideIndex} total={totalSlides} />
      </div>

      {/* Bloc texte */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: textAnchor === "bottom" ? "flex-end" : "flex-start",
          alignItems: isHook ? "center" : "stretch",
          textAlign: isHook ? "center" : "left",
          padding: textAnchor === "bottom" ? "0 64px 250px" : "180px 64px 0",
          opacity: textOpacity,
        }}
      >
        {isHook ? (
          <>
            <div style={{ width: 60, height: 3, backgroundColor: GOLD, borderRadius: 2, marginBottom: 28 }} />
            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 64,
                fontWeight: 700,
                color: "#f5efe0",
                lineHeight: 1.18,
                margin: "0 0 22px",
                textShadow: "0 2px 22px rgba(0,0,0,0.95)",
              }}
            >
              {body}
            </h1>
            {subtitle && (
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 38,
                  lineHeight: 1.3,
                  color: GOLD,
                  margin: 0,
                  textShadow: "0 2px 16px rgba(0,0,0,0.9)",
                }}
              >
                {subtitle}
              </p>
            )}
            <div style={{ width: 60, height: 3, backgroundColor: GOLD, borderRadius: 2, marginTop: 28 }} />
          </>
        ) : (
          <>
            {highlight && (
              <h2
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 96,
                  fontWeight: 700,
                  color: GOLD,
                  lineHeight: 1,
                  margin: "0 0 20px",
                  textShadow: "0 2px 22px rgba(0,0,0,0.8)",
                }}
              >
                {highlight}
              </h2>
            )}
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 52,
                lineHeight: 1.32,
                fontWeight: 500,
                color: "#f5efe0",
                margin: 0,
                textShadow: "0 2px 18px rgba(0,0,0,0.95)",
              }}
            >
              {body}
            </p>
          </>
        )}
      </AbsoluteFill>

      {/* Footer */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0 36px", textAlign: "center" }}>
        <span style={{ color: GOLD, fontSize: 20, letterSpacing: 3, opacity: 0.7 }}>@koraetcartes</span>
      </div>
    </AbsoluteFill>
  );
};
