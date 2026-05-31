import React from "react";
import { AbsoluteFill, OffthreadVideo, useCurrentFrame, interpolate, staticFile } from "remotion";

/**
 * CarouselSlideHybrid — slide de carrousel hybride : clip vidéo (matière Mapbox/Remotion
 * propre) en fond + texte premium par-dessus, charte Souverain (navy/gold/ivory).
 *
 * Format : 1080x1350 (4:5 Instagram). Header = 1 rangée de barres (PAS de "SLIDE X/8").
 * Le clip de fond est joué en boucle ; un voile navy léger garantit la lisibilité du texte.
 */

export interface CarouselSlideHybridProps {
  /** chemin staticFile du clip de fond (déjà au ratio 4:5) */
  bgClip: string;
  /** texte highlight optionnel (gros, doré) — ex : "6 pays" */
  highlight?: string;
  /** corps du texte */
  body: string;
  /** index de slide (pour la barre de progression) */
  slideIndex: number;
  totalSlides: number;
  /** position verticale du bloc texte : "bottom" (défaut) ou "top" */
  textAnchor?: "bottom" | "top";
  /** mode hook : titre éditorial + sous-titre gold + filets dorés */
  isHook?: boolean;
  /** sous-titre (mode hook) */
  subtitle?: string;
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

export const CarouselSlideHybrid: React.FC<CarouselSlideHybridProps> = ({
  bgClip,
  highlight,
  body,
  slideIndex,
  totalSlides,
  textAnchor = "bottom",
  isHook = false,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#16213a" }}>
      {/* Fond : clip Map propre en boucle */}
      <OffthreadVideo
        src={staticFile(bgClip)}
        muted
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Voile dégradé navy pour lisibilité (plus dense côté texte) */}
      <AbsoluteFill
        style={{
          background:
            textAnchor === "bottom"
              ? "linear-gradient(to bottom, rgba(22,33,58,0.30) 0%, rgba(22,33,58,0.04) 42%, rgba(22,33,58,0.70) 78%, rgba(22,33,58,0.92) 100%)"
              : "linear-gradient(to top, rgba(22,33,58,0.30) 0%, rgba(22,33,58,0.04) 42%, rgba(22,33,58,0.70) 78%, rgba(22,33,58,0.92) 100%)",
        }}
      />

      {/* Header — K&C + 1 rangée de barres (PAS de "SLIDE X/8") */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "28px 40px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: GOLD, letterSpacing: 4, fontWeight: 700 }}>
            K&amp;C
          </span>
        </div>
        <ProgressBar current={slideIndex} total={totalSlides} />
      </div>

      {/* Bloc texte premium */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: textAnchor === "bottom" ? "flex-end" : "flex-start",
          alignItems: isHook ? "center" : "stretch",
          textAlign: isHook ? "center" : "left",
          padding: textAnchor === "bottom" ? "0 64px 190px" : "180px 64px 0",
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
                textShadow: "0 2px 22px rgba(0,0,0,0.9)",
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
                  textShadow: "0 2px 16px rgba(0,0,0,0.85)",
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
                  textShadow: "0 2px 22px rgba(0,0,0,0.7)",
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
                textShadow: "0 2px 18px rgba(0,0,0,0.85)",
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
