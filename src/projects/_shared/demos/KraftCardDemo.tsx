/**
 * Demo Template D — WonderWhy KraftCard
 *
 * 3 compositions :
 *   A - kraft beige (WonderWhy original) : drapeau Niger + bulle dialogue
 *   B - slate indigo (variante Souverain) : portrait editorial + dialogue
 *   C - kraft collage : 2 drapeaux acteurs + objet icone mine (demontre polyvalence)
 */

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { KraftCard } from "../components/inserts/KraftCard";

export const KRAFT_CARD_DEMO_FRAMES = 150;

// --- Drapeau SVG inline (Niger) ---
const FlagNiger: React.FC<{ size?: number }> = ({ size = 220 }) => (
  <svg width={size} height={Math.round(size * 0.6667)} viewBox="0 0 900 600">
    <rect width="900" height="200" fill="#E05206" />
    <rect y="200" width="900" height="200" fill="#FFFFFF" />
    <rect y="400" width="900" height="200" fill="#009A44" />
    <circle cx="450" cy="300" r="80" fill="#E05206" />
  </svg>
);

// --- Drapeau SVG inline (France) ---
const FlagFrance: React.FC<{ size?: number }> = ({ size = 180 }) => (
  <svg width={size} height={Math.round(size * 0.6667)} viewBox="0 0 900 600">
    <rect width="300" height="600" fill="#002395" />
    <rect x="300" width="300" height="600" fill="#FFFFFF" />
    <rect x="600" width="300" height="600" fill="#ED2939" />
  </svg>
);

// --- Drapeau SVG inline (OUA) placeholder couleurs ---
const FlagUA: React.FC<{ size?: number }> = ({ size = 180 }) => (
  <svg width={size} height={Math.round(size * 0.6667)} viewBox="0 0 900 600">
    <rect width="900" height="600" fill="#009A44" />
    <circle cx="450" cy="300" r="150" fill="#FFFFFF" stroke="#009A44" strokeWidth="8" />
    <text x="450" y="320" textAnchor="middle" fontSize="140" fill="#009A44" fontWeight="bold">AU</text>
  </svg>
);

// Variante A — kraft beige, drapeau Niger + dialogue
export const KraftCardDemoA: React.FC = () => (
  <KraftCard
    variant="kraft"
    asset={<FlagNiger size={280} />}
    label="Niger"
    sublabel="République du Niger"
    dialogue="Nous revendiquons 55% des royalties sur l'uranium extrait de notre sol."
    footnote="Déclaration CNPC, Niamey 2023"
    appearFrame={0}
    dialogueFrame={18}
  />
);

// Variante B — slate indigo, portrait editorial + dialogue
export const KraftCardDemoB: React.FC = () => {
  const frame = useCurrentFrame();
  const portraitOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <KraftCard
      variant="slate"
      asset={
        <Img
          src={staticFile("_shared/flags-portraits/leaders/leader-portrait-editorial.png")}
          style={{
            width: 260,
            height: 260,
            objectFit: "cover",
            borderRadius: 4,
            opacity: portraitOpacity,
          }}
        />
      }
      label="Mahamadou Issoufou"
      sublabel="Président du Niger 2011–2021"
      dialogue="L'uranium de notre pays enrichit d'autres nations. Cela doit changer."
      footnote="Discours ONU, 2018"
      appearFrame={0}
      dialogueFrame={22}
    />
  );
};

// Variante C — kraft collage : 2 drapeaux acteurs + icone mine
export const KraftCardDemoC: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const flagNigerScale = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flagFranceScale = interpolate(frame, [12, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mineOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#d9c8a4" }}>
      <Img
        src={staticFile("_shared/textures/bg-kraft-affirme.png")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.85 }}
      />

      {/* Titre */}
      <div style={{
        position: "absolute",
        top: 100,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "Georgia, serif",
        fontSize: 42,
        fontWeight: 700,
        color: "#1a120a",
        letterSpacing: 1,
      }}>
        Les acteurs
      </div>

      {/* Niger gauche */}
      <div style={{
        position: "absolute",
        left: 80,
        top: height * 0.28,
        transform: `scale(${flagNigerScale})`,
        transformOrigin: "center center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}>
        <FlagNiger size={240} />
        <div style={{ fontFamily: "Georgia, serif", fontSize: 32, color: "#1a120a", fontWeight: 600 }}>Niger</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#5a4a2a", fontStyle: "italic" }}>Pays producteur</div>
      </div>

      {/* France droite */}
      <div style={{
        position: "absolute",
        right: 80,
        top: height * 0.28,
        transform: `scale(${flagFranceScale})`,
        transformOrigin: "center center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}>
        <FlagFrance size={240} />
        <div style={{ fontFamily: "Georgia, serif", fontSize: 32, color: "#1a120a", fontWeight: 600 }}>France</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#5a4a2a", fontStyle: "italic" }}>Orano (ex-Areva)</div>
      </div>

      {/* Fleche VS centrale */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: height * 0.36,
        transform: "translateX(-50%)",
        opacity: arrowOpacity,
        fontFamily: "Georgia, serif",
        fontSize: 52,
        fontWeight: 900,
        color: "#8a4020",
      }}>
        VS
      </div>

      {/* Icone mine bas */}
      <div style={{
        position: "absolute",
        bottom: 140,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: mineOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}>
        <Img
          src={staticFile("_shared/flags-portraits/icons/icon-mine-uranium.png")}
          style={{ width: 160, height: 160, objectFit: "contain" }}
        />
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 24, color: "#5a4a2a" }}>
          Mine d'Arlit — 3,500t/an
        </div>
      </div>
    </AbsoluteFill>
  );
};
