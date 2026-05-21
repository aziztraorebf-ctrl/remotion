/**
 * NewsClipping — effet article de presse decouppe (Caspian Report style)
 *
 * Simule un article de journal decouppe et pose sur fond neutre.
 * Authentifie le propos par le renvoi a une source documentaire.
 * Effet "preuve" : titre de une + lead + citation avec mention source.
 *
 * Pas de photo — typographie seule. Decoupe + ombre = objet physique.
 *
 * Usage :
 *   <NewsClipping
 *     date="12 Novembre 2018"
 *     publication="Le Monde Afrique"
 *     headline="Le Niger exige 55% des royalties sur l'uranium"
 *     lead="Lors du sommet de l'UA à Abuja, le president Issoufou a annoncé..."
 *     pullQuote="Nos ressources, notre souveraineté."
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

type NewsClippingVariant = "jauni" | "blanc" | "gris";

const PALETTES: Record<NewsClippingVariant, { paper: string; text: string; headline: string; accent: string; shadow: string }> = {
  jauni: {
    paper: "#f2e8c9",
    text: "#2a2218",
    headline: "#1a1209",
    accent: "#8b5e1a",
    shadow: "rgba(0,0,0,0.35)",
  },
  blanc: {
    paper: "#faf9f6",
    text: "#1a1a1a",
    headline: "#0a0a0a",
    accent: "#c0392b",
    shadow: "rgba(0,0,0,0.25)",
  },
  gris: {
    paper: "#e8e5df",
    text: "#2a2a2a",
    headline: "#0a0a0a",
    accent: "#555",
    shadow: "rgba(0,0,0,0.30)",
  },
};

interface NewsClippingProps {
  date: string;
  publication: string;
  headline: string;
  lead?: string;
  pullQuote?: string;
  variant?: NewsClippingVariant;
  rotation?: number;
}

export const NewsClipping: React.FC<NewsClippingProps> = ({
  date,
  publication,
  headline,
  lead,
  pullQuote,
  variant = "jauni",
  rotation = -1.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pal = PALETTES[variant];

  const dropIn = spring({ frame, fps, config: { damping: 80, stiffness: 50 }, durationInFrames: 40 });
  const contentReveal = spring({ frame: frame - 20, fps, config: { damping: 150, stiffness: 80 }, durationInFrames: 30 });
  const quoteReveal = spring({ frame: frame - 35, fps, config: { damping: 150, stiffness: 80 }, durationInFrames: 25 });

  const cardY = interpolate(dropIn, [0, 1], [-120, 0]);
  const cardOpacity = dropIn;

  const deg = rotation;

  return (
    <AbsoluteFill
      style={{
        background: "#1a1209",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: pal.paper,
          width: 880,
          padding: "52px 60px 60px 60px",
          transform: `translateY(${cardY}px) rotate(${deg}deg)`,
          opacity: cardOpacity,
          boxShadow: `6px 10px 40px ${pal.shadow}`,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderBottom: `2px solid ${pal.text}`,
            paddingBottom: 14,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue', 'Impact', serif",
              fontSize: 36,
              color: pal.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {publication}
          </div>
          <div
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: 26,
              color: pal.accent,
              fontStyle: "italic",
            }}
          >
            {date}
          </div>
        </div>

        <div
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 52,
            lineHeight: 1.1,
            color: pal.headline,
            fontWeight: "bold",
            marginBottom: 28,
            opacity: contentReveal,
          }}
        >
          {headline}
        </div>

        {lead && (
          <div
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: 28,
              lineHeight: 1.55,
              color: pal.text,
              opacity: contentReveal * 0.85,
              marginBottom: pullQuote ? 28 : 0,
            }}
          >
            {lead}
          </div>
        )}

        {pullQuote && (
          <div
            style={{
              borderLeft: `5px solid ${pal.accent}`,
              paddingLeft: 28,
              marginTop: 8,
              opacity: quoteReveal,
            }}
          >
            <div
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: 34,
                lineHeight: 1.35,
                color: pal.accent,
                fontStyle: "italic",
                fontWeight: "bold",
              }}
            >
              "{pullQuote}"
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
