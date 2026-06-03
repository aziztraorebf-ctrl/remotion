import React from "react";
import { AbsoluteFill } from "remotion";

// ─────────────────────────────────────────────────────────────────────────────
// ThumbnailSouverain — Composant générique réutilisable
//
// Architecture :
//   - Fond + branding + texte = centralisés ICI
//   - Icône-métaphore par sujet = composant séparé dans icons/
//
// Usage :
//   <ThumbnailSouverain
//     icon={<BarilJaugeIcon ratio={18} flagColors={[...]} />}
//     title="Le pétrole de la patience"
//     variant="A"
//   />
// ─────────────────────────────────────────────────────────────────────────────

export const C = {
  // Fond bleu nuit (vs noir pur) — meilleure lisibilité mobile au soleil
  navyDeep:   "#0d1f3a",
  navyMid:    "#0a1830",
  navyDark:   "#061224",
  // Palette Souverain
  gold:       "#c8a951",
  goldHi:     "#e8c472",
  ivory:      "#f2ebd9",
  slate:      "#6a7588",
  slateHi:    "#8a92a3",
  // Drapeaux pays (réutilisables dans icônes)
  flags: {
    senegal: { a: "#00853F", b: "#FDEF42", c: "#E31B23" },
    niger:   { a: "#E05206", b: "#FFFFFF", c: "#0DB02B" }, // orange-blanc-vert
    rdc:     { a: "#007FFF", b: "#F7D618", c: "#CE1021" },
    mali:    { a: "#14B53A", b: "#FCD116", c: "#CE1126" },
    angola:  { a: "#CE1126", b: "#000000", c: "#FFCD00" },
  },
};

export interface ThumbnailSouverainProps {
  icon: React.ReactNode;
  title: string;            // titre principal (ex: "Le pétrole de la patience")
  subtitle?: string;        // sous-titre optionnel
  variant?: "A" | "B" | "C";
  showStats?: boolean;      // afficher stats top/bottom (variant A)
  statTop?: { label: string; value: string };
  statBottom?: { label: string; value: string };
}

export const ThumbnailSouverain: React.FC<ThumbnailSouverainProps> = ({
  icon,
  title,
  subtitle,
  variant = "A",
  showStats = false,
  statTop,
  statBottom,
}) => {
  const W = 1280;
  const H = 720;

  return (
    <AbsoluteFill style={{
      // Fond bleu nuit profond (ajustement Aziz 2026-05-27)
      background: `radial-gradient(ellipse at center, ${C.navyDeep} 0%, ${C.navyDark} 80%)`,
    }}>
      {/* Grille de points or subtile */}
      <AbsoluteFill style={{
        backgroundImage: "radial-gradient(rgba(200,169,81,0.07) 1.5px, transparent 1.5px)",
        backgroundSize: "40px 40px",
      }} />

      {/* L'icône-métaphore centrale */}
      <AbsoluteFill>
        {icon}
      </AbsoluteFill>

      {/* ═════════ TEXTE ═════════ */}

      {/* Variant A : stats top/bottom seulement (le texte principal est porté par l'icône) */}
      {variant === "A" && showStats && (
        <>
          {statTop && (
            <div style={{
              position: "absolute",
              right: 80,
              top: 90,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}>
              <div style={{
                fontFamily: "Georgia, serif",
                fontSize: 22,
                color: C.slateHi,
                letterSpacing: 6,
                textTransform: "uppercase",
                marginBottom: 8,
              }}>{statTop.label}</div>
              <div style={{
                fontFamily: "Georgia, serif",
                fontSize: 180,
                fontWeight: 700,
                color: C.slateHi,
                lineHeight: 0.9,
              }}>{statTop.value}</div>
            </div>
          )}
          {statBottom && (
            <div style={{
              position: "absolute",
              left: 80,
              top: 460,
            }}>
              <div style={{
                fontFamily: "Georgia, serif",
                fontSize: 22,
                color: C.gold,
                letterSpacing: 6,
                textTransform: "uppercase",
                marginBottom: 8,
              }}>{statBottom.label}</div>
              <div style={{
                fontFamily: "Georgia, serif",
                fontSize: 180,
                fontWeight: 700,
                color: C.goldHi,
                lineHeight: 0.9,
                textShadow: `0 0 50px ${C.goldHi}88`,
              }}>{statBottom.value}</div>
            </div>
          )}
        </>
      )}

      {/* Variant B : titre à droite multi-ligne, centré verticalement (comme Niger B) */}
      {/* Décalé plus à droite pour éviter chevauchement avec l'icône (ajustement Aziz 2026-05-28) */}
      {variant === "B" && (
        <div style={{
          position: "absolute",
          right: 40,
          top: H / 2 - 130,
          width: 500,
          textAlign: "center",
        }}>
          {subtitle && (
            <div style={{
              fontFamily: "Georgia, serif",
              fontSize: 24,
              color: C.gold,
              letterSpacing: 7,
              textTransform: "uppercase",
              marginBottom: 18,
            }}>{subtitle}</div>
          )}
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 66,
            fontWeight: 700,
            color: C.ivory,
            lineHeight: 1.1,
          }}>{title}</div>
        </div>
      )}

      {/* Variant C : titre à droite + sous-titre */}
      {variant === "C" && (
        <div style={{
          position: "absolute",
          right: 80,
          top: 140,
          width: 540,
          textAlign: "right",
        }}>
          {subtitle && (
            <div style={{
              fontFamily: "Georgia, serif",
              fontSize: 22,
              color: C.gold,
              letterSpacing: 6,
              textTransform: "uppercase",
              marginBottom: 24,
            }}>{subtitle}</div>
          )}
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 68,
            fontWeight: 700,
            color: C.ivory,
            lineHeight: 1.1,
          }}>{title}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
