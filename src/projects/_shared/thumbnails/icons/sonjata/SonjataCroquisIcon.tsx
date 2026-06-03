import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SonjataCroquisIcon — Croquis annoté ultra-épuré pour Gemini
//
// Ce composant ne dessine PAS la scène finale. Il pose seulement :
//   - Le cadrage (zones ciel, sol, vide centrale)
//   - Le texte typographique (préservé par Gemini)
//   - Des annotations explicites pour Gemini ("ZONE PERSONNAGE", etc.)
//
// Gemini se chargera de créer le contenu visuel cartoon storybook
// en utilisant les frames Sonjata V7 comme référence d'esthétique.
// ─────────────────────────────────────────────────────────────────────────────

export interface SonjataCroquisIconProps {
  showAnnotations?: boolean;
}

const C = {
  sky:           "#e89a4a",
  skyLight:      "#f0a55a",
  ground:        "#8a4a2a",
  groundLight:   "#a55a30",
  outline:       "#2a1810",
  annotation:    "rgba(42, 24, 16, 0.4)",
};

export const SonjataCroquisIcon: React.FC<SonjataCroquisIconProps> = ({
  showAnnotations = false,  // false par défaut pour le render final ; true pour debug
}) => {
  return (
    <svg
      width="100%" height="100%"
      viewBox="0 0 1280 720"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {/* === CIEL ORANGE CHAUD (savane jour finissant) === */}
      <rect x={0} y={0} width={1280} height={500} fill={C.sky} />
      {/* Léger dégradé doux vers horizon */}
      <rect x={0} y={400} width={1280} height={100} fill={C.skyLight} opacity={0.4} />

      {/* === SOL TERRE ROUGE === */}
      <rect x={0} y={500} width={1280} height={220} fill={C.ground} />
      {/* Ligne d'horizon douce */}
      <path
        d={`M 0 500
            Q 200 498 400 501
            Q 600 504 800 500
            Q 1000 497 1280 502
            L 1280 510
            L 0 510 Z`}
        fill={C.groundLight}
      />

      {/* === ZONES DE CADRAGE (visibles uniquement si annotations) === */}
      {showAnnotations && (
        <>
          {/* Zone personnage Sonjata (centre-gauche) */}
          <rect x={280} y={280} width={280} height={400}
            fill="none" stroke={C.annotation} strokeWidth={2} strokeDasharray="8 8" />
          <text x={420} y={500} fill={C.outline} fontSize={14} textAnchor="middle"
            fontFamily="monospace" opacity={0.5}>
            ZONE PERSONNAGE SONJATA
          </text>

          {/* Zone baobab (loin droite) */}
          <rect x={580} y={220} width={150} height={300}
            fill="none" stroke={C.annotation} strokeWidth={2} strokeDasharray="8 8" />
          <text x={655} y={400} fill={C.outline} fontSize={12} textAnchor="middle"
            fontFamily="monospace" opacity={0.5}>
            BAOBAB
          </text>

          {/* Zone village au loin */}
          <rect x={50} y={400} width={220} height={120}
            fill="none" stroke={C.annotation} strokeWidth={2} strokeDasharray="8 8" />
          <text x={160} y={470} fill={C.outline} fontSize={12} textAnchor="middle"
            fontFamily="monospace" opacity={0.5}>
            VILLAGE / HUTTES
          </text>
        </>
      )}
    </svg>
  );
};
