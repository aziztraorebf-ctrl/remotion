import React from "react";
import { AbsoluteFill } from "remotion";

// ─────────────────────────────────────────────────────────────────────────────
// ThumbnailAtlas — Composant générique pour thumbnails Atlas
//
// Différence avec ThumbnailSouverain :
//   - Fond bleu nuit étoilé (vs bleu nuit uni)
//   - Palette terre cuite + or + ivoire (vs gold/navy)
//   - Bandeau source en bas (signature Atlas : Ibn Battuta, Al-Umari, etc.)
//   - Police Cinzel pour titres (vs Georgia)
// ─────────────────────────────────────────────────────────────────────────────

export const CA = {
  // Bleu nuit étoilé
  navyDeep:   "#0d1f3a",
  navyMid:    "#0a1830",
  navyDark:   "#061224",
  // Atlas palette
  terraCotta: "#c47c5a",        // continents
  terraCottaHi: "#d9967a",       // continents lit
  terraCottaLo: "#8a5742",       // shadow continents
  ocean:      "#16213a",         // mers/océans bleu très sombre
  gold:       "#d9b25e",
  goldHi:     "#f0c97a",
  goldGlow:   "#ffd84d",
  ivory:      "#f0e8d4",         // texte principal (crème vieilli)
  parchment:  "#e8d9a9",         // bandeau source
  parchmentBorder: "#a8902f",
  // Mali highlight (drapeau vert/jaune/rouge)
  maliGreen:  "#14B53A",
  maliYellow: "#FCD116",
  maliRed:    "#CE1126",
};

export interface ThumbnailAtlasProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  source?: string;          // bandeau source bas (Ibn Battuta, Al-Umari, etc.)
  variant?: "A" | "B";      // A: titre droite / B: titre haut centré
}

// Ciel étoilé en fond
const StarryBackground: React.FC = () => {
  // 80 étoiles aléatoires positions déterministes via seeded random
  const stars: { x: number; y: number; r: number; o: number }[] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 80; i++) {
    stars.push({
      x: rand() * 1280,
      y: rand() * 720,
      r: rand() * 1.2 + 0.3,
      o: rand() * 0.7 + 0.2,
    });
  }
  return (
    <svg width={1280} height={720} style={{ position: "absolute", top: 0, left: 0 }}>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={CA.ivory} opacity={s.o} />
      ))}
    </svg>
  );
};

export const ThumbnailAtlas: React.FC<ThumbnailAtlasProps> = ({
  icon,
  title,
  subtitle,
  source,
  variant = "A",
}) => {
  const W = 1280;
  const H = 720;

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 30% 40%, ${CA.navyDeep} 0%, ${CA.navyDark} 85%)`,
    }}>
      <StarryBackground />

      {/* L'icône-métaphore */}
      <AbsoluteFill>{icon}</AbsoluteFill>

      {/* Variant A : titre droite multi-ligne (similaire Niger B) */}
      {variant === "A" && (
        <div style={{
          position: "absolute",
          right: 40,
          top: H / 2 - 150,
          width: 500,
          textAlign: "center",
        }}>
          {subtitle && (
            <div style={{
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: 22,
              color: CA.gold,
              letterSpacing: 7,
              textTransform: "uppercase",
              marginBottom: 18,
            }}>{subtitle}</div>
          )}
          <div style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: 60,
            fontWeight: 700,
            color: CA.ivory,
            lineHeight: 1.15,
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
              color: CA.gold,
              letterSpacing: 7,
              textTransform: "uppercase",
              marginBottom: 14,
            }}>{subtitle}</div>
          )}
          <div style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: 56,
            fontWeight: 700,
            color: CA.ivory,
            lineHeight: 1.1,
          }}>{title}</div>
        </div>
      )}

      {/* Bandeau source bas (signature Atlas) */}
      {source && (
        <div style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}>
          <div style={{
            background: CA.parchment,
            border: `2px solid ${CA.parchmentBorder}`,
            padding: "14px 50px",
            boxShadow: `0 4px 12px rgba(0,0,0,0.5)`,
          }}>
            <div style={{
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: 24,
              fontWeight: 700,
              color: CA.navyDeep,
              letterSpacing: 4,
              textTransform: "uppercase",
              textAlign: "center",
            }}>{source}</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
