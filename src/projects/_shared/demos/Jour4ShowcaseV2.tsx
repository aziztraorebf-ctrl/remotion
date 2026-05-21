/**
 * Showcase Jour 4 V2 — Iterations sur retours Aziz
 *
 * Phase A (f0-90)    — NewsClipping V2 plein ecran + soulignage anime or
 * Phase B (f90-180)  — NewsClipping V2 fond texture grain CSS (option C)
 * Phase C (f180-270) — BrutalHeadline + photo terrain B&W Gemini
 * Phase D (f270-360) — BrutalHeadline + illustration stylisee Gemini
 * Phase E (f360-450) — BrutalHeadline + drapeau SVG (option C, zero asset externe)
 */

import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrutalHeadline } from "../components/inserts/BrutalHeadline";

const PHASE_DUR = 90;
const FADE = 10;
export const JOUR4_SHOWCASE_V2_FRAMES = PHASE_DUR * 5;

const phaseOpacity = (frame: number, start: number, end: number) =>
  interpolate(
    frame,
    [start, start + FADE, end - FADE, end],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

// ——— NewsClipping V2 : plein ecran + soulignage anime ———

interface NewsClippingV2Props {
  date: string;
  publication: string;
  headline: string;
  lead?: string;
  pullQuote: string;
  underlineWord?: string;
  variant?: "fullscreen" | "grain";
  accentColor?: string;
}

const NewsClippingV2FullScreen: React.FC<NewsClippingV2Props> = ({
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

  const underlineW = interpolate(underlineProgress, [0, 1], [0, 100]);

  return (
    <AbsoluteFill
      style={{
        background: bg,
        ...(variant === "grain" ? { backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")" } : {}),
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
          {/* Soulignage anime SVG */}
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

// Drapeau Niger SVG inline
const FlagNiger: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 900 600" style={style}>
    <rect width="900" height="200" fill="#E05206" />
    <rect y="200" width="900" height="200" fill="#FFFFFF" />
    <rect y="400" width="900" height="200" fill="#009A44" />
    <circle cx="450" cy="300" r="80" fill="#E05206" />
  </svg>
);

// ——— Showcase principal ———

export const Jour4ShowcaseV2: React.FC = () => {
  const frame = useCurrentFrame();

  const phases = Array.from({ length: 5 }, (_, i) => ({
    start: PHASE_DUR * i,
    end: PHASE_DUR * (i + 1),
  }));

  const lf = (i: number) => Math.max(0, frame - phases[i].start);

  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>

      {/* Phase A — NewsClipping V2 plein ecran */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[0].start, phases[0].end) }}>
        <NewsClippingV2FullScreen
          date="12 Novembre 2018"
          publication="Le Monde Afrique"
          headline="Le Niger exige 55% des royalties sur l'uranium d'Arlit"
          lead="Lors du sommet de l'UA à Abuja, le président Issoufou a remis en cause les contrats historiques signés sous la colonisation française."
          pullQuote="Nos ressources, notre souveraineté."
          variant="fullscreen"
          key={`a-${lf(0)}`}
        />
      </AbsoluteFill>

      {/* Phase B — NewsClipping V2 fond grain, accent rouge brique Reuters */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[1].start, phases[1].end) }}>
        <NewsClippingV2FullScreen
          date="7 Mars 2014"
          publication="Reuters Africa"
          headline="ORANO signs new uranium deal with Niger — terms undisclosed"
          lead="The French nuclear giant quietly renewed its contracts, avoiding scrutiny from civil society groups who demanded transparency."
          pullQuote="Terms remain confidential per both parties."
          variant="grain"
          accentColor="#8B3A2A"
          key={`b-${lf(1)}`}
        />
      </AbsoluteFill>

      {/* Phase C — BrutalHeadline + photo terrain B&W */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[2].start, phases[2].end) }}>
        <BrutalHeadline
          headline="L'URANIUM QUI VAUT UN EMPIRE"
          subline="Niger · 2006–2026"
          tag="SOUVERAIN"
          variant="noir"
          photoRatio={0.58}
          photo={
            <Img
              src={staticFile("_shared/brutal-headline-assets/terrain-bw.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
            />
          }
          key={`c-${lf(2)}`}
        />
      </AbsoluteFill>

      {/* Phase D — BrutalHeadline + illustration stylisee */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[3].start, phases[3].end) }}>
        <BrutalHeadline
          headline="20 ANS DE PILLAGE SILENCIEUX"
          subline="Arlit · Niger · Sahel"
          tag="INVESTIGATION"
          variant="noir"
          photoRatio={0.62}
          photo={
            <Img
              src={staticFile("_shared/brutal-headline-assets/illustration-stylisee.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }}
            />
          }
          key={`d-${lf(3)}`}
        />
      </AbsoluteFill>

      {/* Phase E — BrutalHeadline + drapeau SVG (option C, zero asset) */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[4].start, phases[4].end) }}>
        <BrutalHeadline
          headline="NIGER : LA BOMBE QU'ON NE VOIT PAS"
          subline="Uranium · Souveraineté · 2023"
          tag="SOUVERAIN"
          variant="noir"
          photoRatio={0.50}
          photo={
            <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
              <FlagNiger
                style={{
                  width: "100%",
                  height: "100%",
                  filter: "brightness(0.45) saturate(0.7)",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, rgba(10,10,10,0) 40%, rgba(10,10,10,1) 100%)",
                }}
              />
            </div>
          }
          key={`e-${lf(4)}`}
        />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
