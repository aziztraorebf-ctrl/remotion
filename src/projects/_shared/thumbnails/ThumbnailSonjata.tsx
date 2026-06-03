import React from "react";
import { AbsoluteFill } from "remotion";

// ─────────────────────────────────────────────────────────────────────────────
// ThumbnailSonjata — Thumbnails pour vidéos Sonjata papercraft / conte oral
//
// Style référencé sur la vidéo Sonjata V7 livrée :
//   - Palette ocre brûlé + terre cuite + brun + crépuscule orange
//   - Fond brun foncé profond (closing Sonjata)
//   - Atmosphère storybook africain illustré
//   - Pas de drapeau moderne (anachronique pour Empire Mandé 13e siècle)
//   - Police Cinzel ou serif vintage
// ─────────────────────────────────────────────────────────────────────────────

export const CS = {
  // Bruns profonds Sonjata closing
  brownDeep:   "#1a0e08",        // fond très foncé
  brownMid:    "#2a1810",
  brownLight:  "#3e2418",
  // Terre cuite / ocre
  terraCotta:  "#c47c5a",
  ocre:        "#d49758",
  ocreBurnt:   "#a05a2c",
  // Crépuscule
  crepuscule:  "#e85a2a",        // soleil couchant orange-rouge
  crepLight:   "#f59555",
  // Or vintage Sonjata
  goldVintage: "#c8a951",
  goldVintLight: "#e8c472",
  // Crème / parchemin chaud
  cream:       "#f0e0c8",
  creamDim:    "#c9b08a",
};

export interface ThumbnailSonjataProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  variant?: "A" | "B";
}

export const ThumbnailSonjata: React.FC<ThumbnailSonjataProps> = ({
  icon,
  title,
  subtitle,
  variant = "A",
}) => {
  const W = 1280;
  const H = 720;

  return (
    <AbsoluteFill style={{
      // Fond brun foncé profond avec gradient crépuscule en haut (suggérant le soleil couchant)
      background: `linear-gradient(180deg,
        ${CS.crepuscule} 0%,
        ${CS.ocreBurnt} 25%,
        ${CS.brownMid} 60%,
        ${CS.brownDeep} 100%)`,
    }}>
      {/* Texture grain de papier vintage subtile */}
      <AbsoluteFill style={{
        backgroundImage: "radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)",
        backgroundSize: "8px 8px",
        opacity: 0.5,
      }} />

      {/* L'icône-métaphore (silhouette héro + baobab + soleil) */}
      <AbsoluteFill>{icon}</AbsoluteFill>

      {/* Variant A : titre droite multi-ligne */}
      {variant === "A" && (
        <div style={{
          position: "absolute",
          right: 40,
          top: H / 2 - 150,
          width: 520,
          textAlign: "center",
        }}>
          {subtitle && (
            <div style={{
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: 22,
              color: CS.goldVintLight,
              letterSpacing: 7,
              textTransform: "uppercase",
              marginBottom: 18,
              textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
            }}>{subtitle}</div>
          )}
          <div style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: 64,
            fontWeight: 700,
            color: CS.cream,
            lineHeight: 1.1,
            textShadow: "3px 3px 8px rgba(0,0,0,0.7)",
          }}>{title}</div>
        </div>
      )}

      {/* Variant B : titre centré haut */}
      {variant === "B" && (
        <div style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 80px",
        }}>
          {subtitle && (
            <div style={{
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: 22,
              color: CS.goldVintLight,
              letterSpacing: 7,
              textTransform: "uppercase",
              marginBottom: 14,
              textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
            }}>{subtitle}</div>
          )}
          <div style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: 58,
            fontWeight: 700,
            color: CS.cream,
            lineHeight: 1.1,
            textShadow: "3px 3px 8px rgba(0,0,0,0.7)",
          }}>{title}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
