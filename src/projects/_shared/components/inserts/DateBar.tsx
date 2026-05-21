/**
 * DateBar — bandeau date pleine largeur (Africa Eye style)
 *
 * Marqueur temporel chronologique. Slide depuis la gauche (ou bas).
 * Indication precise de la date d'un evenement.
 * Design sobre : fond couleur signature + date en bold.
 *
 * Positions :
 *   "top"    — en haut de l'ecran (sur fond video/image)
 *   "bottom" — en bas (safe zone sous-titres respectee)
 *   "center" — plein ecran centré (beat de transition)
 *
 * Usage :
 *   <DateBar date="12 NOVEMBRE 2018" subtitle="Sommet de l'UA — Abuja" />
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type DateBarPosition = "top" | "bottom" | "center";
export type DateBarVariant = "or" | "rouge" | "blanc" | "noir";

const COLORS: Record<DateBarVariant, { bg: string; text: string; sub: string }> = {
  or: { bg: "#f5d547", text: "#0a0a0a", sub: "rgba(10,10,10,0.65)" },
  rouge: { bg: "#c0392b", text: "#ffffff", sub: "rgba(255,255,255,0.7)" },
  blanc: { bg: "#f5f0e6", text: "#1a1209", sub: "rgba(26,18,9,0.6)" },
  noir: { bg: "#0a0a0a", text: "#ffffff", sub: "rgba(255,255,255,0.6)" },
};

interface DateBarProps {
  date: string;
  subtitle?: string;
  position?: DateBarPosition;
  variant?: DateBarVariant;
  fullscreen?: boolean;
}

export const DateBar: React.FC<DateBarProps> = ({
  date,
  subtitle,
  position = "bottom",
  variant = "or",
  fullscreen = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = COLORS[variant];

  const slideIn = spring({ frame, fps, config: { damping: 120, stiffness: 80 }, durationInFrames: 28 });
  const textReveal = spring({ frame: frame - 8, fps, config: { damping: 150, stiffness: 100 }, durationInFrames: 22 });

  const slideX = interpolate(slideIn, [0, 1], [-1080, 0]);
  const textOpacity = textReveal;

  if (fullscreen) {
    return (
      <AbsoluteFill
        style={{
          background: col.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${slideX}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontSize: 120,
            color: col.text,
            letterSpacing: "0.08em",
            textAlign: "center",
            opacity: textOpacity,
          }}
        >
          {date}
        </div>
        {subtitle && (
          <div
            style={{
              fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
              fontSize: 40,
              color: col.sub,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textAlign: "center",
              marginTop: 16,
              opacity: textOpacity,
            }}
          >
            {subtitle}
          </div>
        )}
      </AbsoluteFill>
    );
  }

  const positionStyles: React.CSSProperties =
    position === "top"
      ? { top: 80, left: 0, right: 0 }
      : position === "center"
      ? { top: "50%", left: 0, right: 0, transform: `translateX(${slideX}px) translateY(-50%)` }
      : { bottom: 180, left: 0, right: 0 };

  const transformStyle =
    position === "center"
      ? `translateX(${slideX}px) translateY(-50%)`
      : `translateX(${slideX}px)`;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          ...positionStyles,
          transform: transformStyle,
          background: col.bg,
          padding: "22px 60px 18px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 32,
            opacity: textOpacity,
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontSize: 52,
              color: col.text,
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}
          >
            {date}
          </div>
          {subtitle && (
            <div
              style={{
                fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                fontSize: 32,
                color: col.sub,
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
