/**
 * NewsClippingV2 — Coupure de presse plein ecran animee
 *
 * Version 2 validee jury 3 LLMs Jour 4 (consensus 3/3).
 * Deux variantes :
 *   "fullscreen" — fond creme #f5f0e6, accent or (defaut)
 *   "grain"      — fond kraft #e8e0cd + texture CSS, accent configurable
 *
 * Animations :
 *   - Header slide-in (spring)
 *   - Headline translateY spring
 *   - Lead + pull quote cascade
 *   - Soulignage SVG anime sur pull quote
 *
 * Usage :
 *   <NewsClippingV2
 *     date="12 Novembre 2018"
 *     publication="Le Monde Afrique"
 *     headline="Le Niger exige 55% des royalties..."
 *     lead="Lors du sommet..."
 *     pullQuote="Nos ressources, notre souverainete."
 *     variant="fullscreen"
 *     accentColor="#c8972b"
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

interface NewsClippingV2Props {
  date: string;
  publication: string;
  headline: string;
  lead?: string;
  pullQuote: string;
  variant?: "fullscreen" | "grain";
  accentColor?: string;
}

export const NewsClippingV2: React.FC<NewsClippingV2Props> = ({
  date,
  publication,
  headline,
  lead,
  pullQuote,
  variant = "fullscreen",
  accentColor: accentProp,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerIn = spring({ frame, fps, config: { damping: 150, stiffness: 80 }, durationInFrames: 25 });
  const headlineIn = spring({ frame: frame - 10, fps, config: { damping: 120, stiffness: 70 }, durationInFrames: 28 });
  const leadIn = spring({ frame: frame - 20, fps, config: { damping: 150, stiffness: 80 }, durationInFrames: 25 });
  const quoteIn = spring({ frame: frame - 30, fps, config: { damping: 150, stiffness: 80 }, durationInFrames: 25 });
  const underlineProgress = spring({ frame: frame - 42, fps, config: { damping: 200, stiffness: 60 }, durationInFrames: 35 });

  const bg = variant === "grain" ? "#e8e0cd" : "#f5f0e6";
  const accentColor = accentProp ?? "#c8972b";
  const textColor = "#1a1209";

  return (
    <AbsoluteFill
      style={{
        background: bg,
        ...(variant === "grain"
          ? {
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
            }
          : {}),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      {/* Header publication + date */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          borderBottom: `3px solid ${textColor}`,
          paddingBottom: 20,
          marginBottom: 36,
          opacity: headerIn,
        }}
      >
        <div
          style={{
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontSize: 44,
            color: accentColor,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {publication}
        </div>
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 32,
            color: accentColor,
            fontStyle: "italic",
          }}
        >
          {date}
        </div>
      </div>

      {/* Headline */}
      <div
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: 72,
          lineHeight: 1.1,
          color: textColor,
          fontWeight: "bold",
          marginBottom: 36,
          opacity: headlineIn,
          transform: `translateY(${interpolate(headlineIn, [0, 1], [20, 0])}px)`,
        }}
      >
        {headline}
      </div>

      {/* Lead */}
      {lead && (
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 34,
            lineHeight: 1.6,
            color: textColor,
            opacity: leadIn * 0.85,
            marginBottom: 40,
          }}
        >
          {lead}
        </div>
      )}

      {/* Pull quote + soulignage anime */}
      <div
        style={{
          borderLeft: `6px solid ${accentColor}`,
          paddingLeft: 32,
          opacity: quoteIn,
        }}
      >
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 42,
            lineHeight: 1.4,
            color: accentColor,
            fontStyle: "italic",
            fontWeight: "bold",
            position: "relative",
            display: "inline-block",
          }}
        >
          "{pullQuote}"
          <svg
            style={{
              position: "absolute",
              bottom: -8,
              left: 0,
              width: "100%",
              height: 10,
              overflow: "visible",
            }}
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
          >
            <path
              d="M0 4 Q25 1 50 4 Q75 7 100 4"
              fill="none"
              stroke={accentColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={interpolate(underlineProgress, [0, 1], [100, 0])}
            />
          </svg>
        </div>
      </div>

      {/* Ligne de credit */}
      <div
        style={{
          marginTop: 60,
          fontFamily: "'Inter', sans-serif",
          fontSize: 22,
          color: "rgba(26,18,9,0.45)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: quoteIn * 0.6,
        }}
      >
        Source : {publication} — {date}
      </div>
    </AbsoluteFill>
  );
};
