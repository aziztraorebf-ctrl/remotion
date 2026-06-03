import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

// ─────────────────────────────────────────────────────────────────────────────
// BandeauNoir — Brique signature Or Africain
//
// Bandeau noir avec titre en jaune doré. Compteur X/Y optionnel sous le bandeau.
// Animation typewriter-snap : apparition par snap (pas typewriter caractère).
//
// Usage :
//   <BandeauNoir text="LA PREMIÈRE FOIS DE L'HISTOIRE, LE" entityHighlight="GHANA" />
//   <BandeauNoir text="PAYS QUI PROTESTENT" compteur={{ current: 3, total: 6 }} />
// ─────────────────────────────────────────────────────────────────────────────

export interface BandeauNoirProps {
  text: string;
  entityHighlight?: string;
  compteur?: { current: number; total: number };
  position?: "bottom" | "middle"; // défaut : bottom (~70% écran)
  delayFrames?: number;           // délai apparition
}

const COLORS = {
  yellow:   "#f4c534",
  yellowHi: "#ffd84d",
  black:    "#0a0e16",
  ivory:    "#f2ebd9",
};

export const BandeauNoir: React.FC<BandeauNoirProps> = ({
  text,
  entityHighlight,
  compteur,
  position = "bottom",
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const snapP = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 14, stiffness: 140 },
    durationInFrames: 22,
  });

  // Compteur count-up
  const compteurP = spring({
    frame: frame - delayFrames - 12,
    fps,
    config: { damping: 100, stiffness: 80 },
    durationInFrames: 35,
  });
  const compteurValue = compteur
    ? Math.round(compteurP * compteur.current)
    : 0;

  const topPosition = position === "bottom" ? height * 0.68 : height * 0.45;

  return (
    <div style={{
      position: "absolute",
      top: topPosition,
      left: 0, right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 30,
    }}>
      {/* Bandeau noir */}
      <div style={{
        background: COLORS.black,
        border: `2px solid ${COLORS.yellow}`,
        padding: "26px 50px",
        maxWidth: "92%",
        transform: `scale(${0.92 + 0.08 * snapP}) translateY(${(1 - snapP) * 30}px)`,
        opacity: snapP,
      }}>
        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: 48,
          fontWeight: 700,
          color: COLORS.yellow,
          letterSpacing: 2,
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.15,
        }}>
          {text}
          {entityHighlight && (
            <div style={{
              color: COLORS.ivory,
              marginTop: 8,
              fontSize: 56,
            }}>{entityHighlight}</div>
          )}
        </div>
      </div>

      {/* Compteur X/Y */}
      {compteur && (
        <div style={{
          opacity: compteurP > 0 ? 1 : 0,
          transform: `scale(${0.85 + 0.15 * compteurP})`,
        }}>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 20,
            color: COLORS.yellow,
            letterSpacing: 5,
            textAlign: "center",
            textTransform: "uppercase",
            marginBottom: 8,
          }}>
            {text.includes("·") ? "" : ""}
          </div>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 78,
            fontWeight: 700,
            color: COLORS.yellow,
            letterSpacing: 4,
            textAlign: "center",
            lineHeight: 1,
          }}>
            {compteurValue}<span style={{ color: "rgba(244,197,52,0.5)" }}>/{compteur.total}</span>
          </div>
        </div>
      )}
    </div>
  );
};
