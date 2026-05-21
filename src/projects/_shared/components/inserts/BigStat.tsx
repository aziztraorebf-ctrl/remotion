/**
 * BigStat — chiffre enorme + petit libelle (style Vox/kurzgesagt)
 *
 * Insert 2-4s tres YouTube-friendly. Chiffre occupe 70% de l'ecran.
 * Libelle minuscule en dessous. Pas d'autre decoration.
 * Impact maximal, lisibilite instantanee.
 *
 * Variantes :
 *   "noir"    — fond #0a0a0a, chiffre blanc, unité or #f5d547
 *   "blanc"   — fond #f5f0e6, chiffre brun, unité rouge
 *   "accent"  — fond accent (or, rouge, etc.) configurable
 *
 * Usage :
 *   <BigStat value="$3.7B" label="extraits du sol nigérien" unit="par an" />
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type BigStatVariant = "noir" | "blanc" | "accent";

interface BigStatProps {
  value: string;
  label: string;
  unit?: string;
  variant?: BigStatVariant;
  accentColor?: string;
  textColor?: string;
  unitColor?: string;
}

export const BigStat: React.FC<BigStatProps> = ({
  value,
  label,
  unit,
  variant = "noir",
  accentColor = "#f5d547",
  textColor,
  unitColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let bg = "#0a0a0a";
  let mainText = "#ffffff";
  let accentText = accentColor;
  let labelText = "rgba(255,255,255,0.65)";

  if (variant === "blanc") {
    bg = "#f5f0e6";
    mainText = "#1a1209";
    accentText = unitColor ?? "#c0392b";
    labelText = "rgba(26,18,9,0.6)";
  } else if (variant === "accent") {
    bg = accentColor;
    mainText = textColor ?? "#ffffff";
    accentText = textColor ?? "#ffffff";
    labelText = "rgba(255,255,255,0.75)";
  }

  if (textColor) mainText = textColor;
  if (unitColor) accentText = unitColor;

  const valueProgress = spring({ frame, fps, config: { damping: 60, stiffness: 50 }, durationInFrames: 35 });
  const labelProgress = spring({ frame: frame - 15, fps, config: { damping: 100, stiffness: 80 }, durationInFrames: 25 });

  const valueScale = interpolate(valueProgress, [0, 1], [0.75, 1.0]);
  const valueOpacity = interpolate(valueProgress, [0, 1], [0, 1]);
  const labelY = interpolate(labelProgress, [0, 1], [30, 0]);

  return (
    <AbsoluteFill
      style={{
        background: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      <div
        style={{
          fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
          fontSize: 260,
          lineHeight: 0.85,
          color: mainText,
          textAlign: "center",
          letterSpacing: "-0.01em",
          transform: `scale(${valueScale})`,
          opacity: valueOpacity,
        }}
      >
        {value}
      </div>

      {unit && (
        <div
          style={{
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontSize: 72,
            color: accentText,
            textAlign: "center",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginTop: 8,
            opacity: labelProgress,
            transform: `translateY(${labelY}px)`,
          }}
        >
          {unit}
        </div>
      )}

      <div
        style={{
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          fontSize: 36,
          color: labelText,
          textAlign: "center",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 500,
          marginTop: 36,
          maxWidth: 800,
          lineHeight: 1.3,
          opacity: labelProgress,
          transform: `translateY(${labelY}px)`,
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};
