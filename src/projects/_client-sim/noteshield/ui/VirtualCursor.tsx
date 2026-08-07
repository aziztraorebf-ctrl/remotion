import React from "react";
import { NS_COLORS } from "./theme";

/**
 * VirtualCursor — curseur souris stylise pour habiter les scenes dashboard (P4/P5).
 * PROTOTYPE de test (2026-08-07) -- pas encore integre a une composition finale.
 * Style flat/geometrique coherent avec le reste de l'UI NorthShield (pas un curseur OS realiste).
 */

export const VirtualCursor: React.FC<{ x: number; y: number; clicking?: boolean; clickProgress?: number }> = ({
  x,
  y,
  clicking = false,
  clickProgress = 0,
}) => {
  const scale = clicking ? 0.85 : 1;
  // Anneau de clic : grossit et s'estompe (ripple), ancre sur la POINTE du curseur (2,2 dans le viewBox).
  const ringSize = 20 + clickProgress * 40;
  const ringOpacity = clicking ? 0.7 * (1 - clickProgress) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 2,
          top: 2,
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          borderRadius: "50%",
          border: `2px solid ${NS_COLORS.cyan}`,
          opacity: ringOpacity,
        }}
      />
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "2px 2px",
          filter: `drop-shadow(0 2px 8px rgba(0,0,0,0.5))`,
        }}
      >
        <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
          <path
            d="M2 2 L2 26 L9 20 L14 30 L18 28 L13 18 L22 18 Z"
            fill={NS_COLORS.ivory}
            stroke={NS_COLORS.navyDeep}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
