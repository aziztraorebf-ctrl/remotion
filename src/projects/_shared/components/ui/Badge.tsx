import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface BadgeProps {
  label: string;
  appearFrame: number;
  bgColor?: string;      // défaut #5a1010 (rouge)
  borderColor?: string;  // défaut #8b2020
  textColor?: string;    // défaut #f5f0e8
  fontSize?: number;     // défaut 22
  /**
   * HERO DATA (P5) : mode "satellite" — badge stat discret navy/gold qui gravite
   * autour d'un objet hero (pattern Silicon Savannah : 300 000 / 1ER MONDIAL).
   * Surcharge les couleurs par défaut vers la charte navy/gold et un pop plus marqué.
   */
  satellite?: boolean;
  /** Sous-label optionnel (mode satellite) : valeur en gros + label en petit dessous. */
  sublabel?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  appearFrame,
  bgColor,
  borderColor,
  textColor,
  fontSize = 22,
  satellite = false,
  sublabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Defaults : rouge classique, ou navy/gold en mode satellite
  const bg = bgColor ?? (satellite ? "#1e2d4a" : "#5a1010");
  const border = borderColor ?? (satellite ? "#c8a951" : "#8b2020");
  const txt = textColor ?? (satellite ? "#f0e8d8" : "#f5f0e8");

  // Mode satellite : pop plus marqué (scale 0.7→1) pour un effet "arrivée" net
  const t = spring({
    frame: frame - appearFrame,
    fps,
    config: satellite ? { damping: 70, stiffness: 50 } : { damping: 22, stiffness: 120 },
    durationInFrames: satellite ? 25 : undefined,
  });

  const opacity = interpolate(frame - appearFrame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(t, [0, 1], [satellite ? 0.7 : 0.85, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: bg,
        border: `1.5px solid ${border}`,
        borderRadius: 4,
        padding: satellite ? "8px 20px" : "5px 18px",
        textAlign: "center",
      }}
    >
      <span
        style={{
          color: satellite ? "#c8a951" : txt,
          fontSize: satellite ? fontSize * 1.4 : fontSize,
          fontWeight: 700,
          letterSpacing: "0.08em",
          fontFamily: "Bebas Neue, Impact, sans-serif",
          display: "block",
          lineHeight: 1,
        }}
      >
        {label}
      </span>
      {sublabel && (
        <span
          style={{
            color: txt,
            fontSize: fontSize * 0.6,
            fontWeight: 400,
            letterSpacing: "0.15em",
            fontFamily: "monospace",
            opacity: 0.75,
            display: "block",
            marginTop: 3,
          }}
        >
          {sublabel}
        </span>
      )}
    </div>
  );
};
