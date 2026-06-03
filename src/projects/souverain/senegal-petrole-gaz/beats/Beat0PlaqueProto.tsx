import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Prototype Phase A Beat0 — deux plaques documentaires sequentielles
// 360 frames = 12s @ 30fps
// Plaque 1 : Yakaar (f0→f150) | Plaque 2 : Dissolution (f150→f360)

const GOLD  = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY  = "#16213a";
const RED   = "#ef4444";
const SLATE = "#8b9bb4";

interface PlaqueProps {
  label: string;
  date: string;
  headline: string;
  subline: string;
  accentColor: string;
  startFrame: number;
  endFrame: number;
  frame: number;
  fps: number;
}

const Plaque: React.FC<PlaqueProps> = ({
  label, date, headline, subline,
  accentColor, startFrame, endFrame, frame, fps,
}) => {
  const local = frame - startFrame;
  const duration = endFrame - startFrame;

  const fadeIn = interpolate(local, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(local, [duration - 24, duration - 6], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  const slideIn = spring({
    fps,
    frame: Math.max(0, local),
    config: { damping: 80, stiffness: 50 },
    durationInFrames: 30,
  });
  const translateY = interpolate(slideIn, [0, 1], [32, 0]);

  const barGrow = spring({
    fps,
    frame: Math.max(0, local - 4),
    config: { damping: 120, stiffness: 80 },
    durationInFrames: 25,
  });

  if (frame < startFrame || frame >= endFrame) return null;

  return (
    <div style={{
      position: "absolute",
      left: 160,
      right: 160,
      top: "50%",
      transform: `translateY(calc(-50% + ${translateY}px))`,
      opacity,
      display: "flex",
      gap: 0,
    }}>
      {/* Barre accent verticale */}
      <div style={{
        width: 5,
        height: barGrow * 160,
        backgroundColor: accentColor,
        borderRadius: 2,
        flexShrink: 0,
        marginRight: 36,
        alignSelf: "flex-start",
        marginTop: 8,
      }} />

      {/* Contenu */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {/* Label + date */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginBottom: 20,
        }}>
          <span style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 18,
            letterSpacing: "0.22em",
            color: accentColor,
            textTransform: "uppercase",
            opacity: 0.75,
          }}>
            {label}
          </span>
          <span style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 18,
            letterSpacing: "0.18em",
            color: SLATE,
            textTransform: "uppercase",
          }}>
            {date}
          </span>
        </div>

        {/* Headline */}
        <div style={{
          fontFamily: "Cinzel, serif",
          fontSize: 64,
          fontWeight: 700,
          color: IVORY,
          lineHeight: 1.15,
          letterSpacing: "0.02em",
          marginBottom: 20,
        }}>
          {headline}
        </div>

        {/* Subline */}
        <div style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 26,
          color: SLATE,
          letterSpacing: "0.06em",
          lineHeight: 1.5,
        }}>
          {subline}
        </div>
      </div>
    </div>
  );
};

export const Beat0PlaqueProto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ligne separatrice entre les deux plaques
  const dividerOpacity = interpolate(frame, [138, 156, 168, 186], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>

      {/* Grain subtil */}
      <AbsoluteFill style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
        pointerEvents: "none",
      }} />

      {/* Ligne horizontale gold separatrice (transition entre plaques) */}
      <div style={{
        position: "absolute",
        left: 160,
        right: 160,
        top: "50%",
        height: 1,
        backgroundColor: GOLD,
        opacity: dividerOpacity * 0.3,
      }} />

      {/* Plaque 1 — Yakaar */}
      <Plaque
        label="Souveraineté"
        date="Avril 2026"
        headline={"Yakaar-Teranga\nreprend sous contrôle sénégalais"}
        subline="Kosmos Energy se retire — PETROSEN prend le contrôle exclusif\n25 TCF de gaz · 7,5 milliards $ à développer"
        accentColor={GOLD}
        startFrame={0}
        endFrame={162}
        frame={frame}
        fps={fps}
      />

      {/* Plaque 2 — Dissolution */}
      <Plaque
        label="Rupture politique"
        date="22 Mai 2026"
        headline={"Gouvernement dissous\nSonko limogé"}
        subline="Décret n°2026-1128 — L'homme qui avait annoncé Yakaar\nn'est plus en poste un mois plus tard."
        accentColor={RED}
        startFrame={198}
        endFrame={360}
        frame={frame}
        fps={fps}
      />

    </AbsoluteFill>
  );
};
