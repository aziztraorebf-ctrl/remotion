/**
 * DataCard — fiche donnee chiffre central (reformulation Aziz Jour 3)
 *
 * Concept : une fiche qui incarne une donnee cle — chiffre enorme au centre,
 * libelle descriptif, source institutionnelle, contexte additionnel.
 * Donne une personnalite visuelle a chaque chiffre.
 *
 * Variantes :
 *   "cream"   — fond creme #f5f0e6, chiffre noir, accent or
 *   "kraft"   — fond kraft texture #d9c8a4, chiffre brun fonce
 *   "dark"    — fond noir #0a0a0a, chiffre blanc, accent or (alertant)
 *
 * Usage :
 *   <DataCard
 *     value="3 500 T"
 *     label="d'uranium extrait par an"
 *     source="AIEA, 2022"
 *     context="2e producteur africain"
 *     country="Niger"
 *     variant="kraft"
 *   />
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type DataCardVariant = "cream" | "kraft" | "dark";

const PALETTES: Record<DataCardVariant, { bg: string; text: string; accent: string; secondary: string; border: string }> = {
  cream: {
    bg: "#f5f0e6",
    text: "#1a1209",
    accent: "#c8972b",
    secondary: "#6b5c3e",
    border: "#c8972b",
  },
  kraft: {
    bg: "#d9c8a4",
    text: "#1a1009",
    accent: "#8b5e1a",
    secondary: "#3d2210",
    border: "#8b5e1a",
  },
  dark: {
    bg: "#0a0a0a",
    text: "#ffffff",
    accent: "#f5d547",
    secondary: "#999",
    border: "#f5d547",
  },
};

interface DataCardProps {
  value: string;
  label: string;
  source?: string;
  context?: string;
  country?: string;
  variant?: DataCardVariant;
  icon?: React.ReactNode;
}

export const DataCard: React.FC<DataCardProps> = ({
  value,
  label,
  source,
  context,
  country,
  variant = "cream",
  icon,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pal = PALETTES[variant];

  const cardScale = spring({ frame, fps, config: { damping: 80, stiffness: 60 }, durationInFrames: 35 });
  const valueProgress = spring({ frame: frame - 12, fps, config: { damping: 100, stiffness: 100 }, durationInFrames: 28 });
  const labelProgress = spring({ frame: frame - 22, fps, config: { damping: 120, stiffness: 80 }, durationInFrames: 25 });
  const metaProgress = spring({ frame: frame - 30, fps, config: { damping: 150, stiffness: 80 }, durationInFrames: 20 });

  const cardOpacity = cardScale;
  const valueY = interpolate(valueProgress, [0, 1], [60, 0]);
  const labelY = interpolate(labelProgress, [0, 1], [30, 0]);
  const metaY = interpolate(metaProgress, [0, 1], [20, 0]);

  return (
    <AbsoluteFill style={{ background: pal.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 960,
          opacity: cardOpacity,
          padding: "0 60px",
        }}
      >
        {country && (
          <div
            style={{
              color: pal.accent,
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontSize: 36,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: 40,
              opacity: metaProgress,
              transform: `translateY(${metaY}px)`,
            }}
          >
            {country}
          </div>
        )}

        <div
          style={{
            color: pal.text,
            fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
            fontSize: 200,
            lineHeight: 0.88,
            letterSpacing: "-0.01em",
            textAlign: "center",
            transform: `translateY(${valueY}px)`,
            opacity: valueProgress,
          }}
        >
          {value}
        </div>

        <div
          style={{
            width: 120,
            height: 5,
            background: pal.border,
            margin: "32px auto 28px auto",
            opacity: labelProgress,
          }}
        />

        <div
          style={{
            color: pal.secondary,
            fontFamily: "'Inter Tight', 'Inter', 'Helvetica Neue', sans-serif",
            fontSize: 42,
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.2,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            transform: `translateY(${labelY}px)`,
            opacity: labelProgress,
          }}
        >
          {label}
        </div>

        {context && (
          <div
            style={{
              color: pal.accent,
              fontFamily: "'Inter Tight', 'Inter', sans-serif",
              fontSize: 32,
              fontWeight: 500,
              textAlign: "center",
              marginTop: 24,
              opacity: metaProgress,
              transform: `translateY(${metaY}px)`,
            }}
          >
            {context}
          </div>
        )}

        {source && (
          <div
            style={{
              color: pal.secondary,
              fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
              fontSize: 24,
              textAlign: "center",
              marginTop: 48,
              opacity: metaProgress * 0.7,
              fontStyle: "italic",
            }}
          >
            {source}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
