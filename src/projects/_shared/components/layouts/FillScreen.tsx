import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FillScreenProps {
  /** Pourcentage cible du remplissage (ex: 60) */
  fillPercent: number;
  /** Valeur affichee en grand au centre (ex: "60%") */
  centralValue: string;
  /** Label en haut (ex: "DES TERRES AFRICAINES") */
  topLabel: string;
  /** Label en bas (ex: "vendues a des entreprises etrangeres") */
  bottomLabel: string;
  /** Couleur hexa de la barre de remplissage (ex: "#8B3A2A") */
  fillColor: string;
  /** Frame de debut des animations — defaut 0 */
  startFrame?: number;
  /** Duree totale de l'animation en frames — defaut 90 */
  durationFrames?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FillScreen: React.FC<FillScreenProps> = ({
  fillPercent,
  centralValue,
  topLabel,
  bottomLabel,
  fillColor,
  startFrame = 0,
  durationFrames = 90,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Spring configs ──────────────────────────────────────────────────────────

  const relativeFrame = frame - startFrame;

  // Barre de remplissage — monte de bas en haut
  const fillSpring = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 80, stiffness: 40 },
    durationInFrames: durationFrames,
  });
  const currentFill = interpolate(fillSpring, [0, 1], [0, fillPercent], {
    extrapolateRight: "clamp",
  });

  // Top label — fade + translateY
  const topSpring = spring({
    frame: relativeFrame - 5,
    fps,
    config: { damping: 80, stiffness: 50 },
    durationInFrames: durationFrames,
  });
  const topOpacity = interpolate(topSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const topTranslateY = interpolate(topSpring, [0, 1], [-12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Valeur centrale — fade in
  const centralSpring = spring({
    frame: relativeFrame - 10,
    fps,
    config: { damping: 80, stiffness: 40 },
    durationInFrames: durationFrames,
  });
  const centralOpacity = interpolate(centralSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom label — fade in
  const bottomSpring = spring({
    frame: relativeFrame - 20,
    fps,
    config: { damping: 80, stiffness: 50 },
    durationInFrames: durationFrames,
  });
  const bottomOpacity = interpolate(bottomSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hauteur du fond coloré en px (1920 total)
  const fillHeightPx = (currentFill / 100) * 1920;
  // Point Y de la frontière (depuis le haut)
  const borderY = 1920 - fillHeightPx;

  return (
    <AbsoluteFill style={{ backgroundColor: fillColor, overflow: "hidden" }}>

      {/* Fond navy-deep qui descend — couvre le haut */}
      <div
        className="absolute top-0 left-0 right-0 bg-navy-deep"
        style={{ height: borderY }}
      />

      {/* Vague SVG à la frontière navy/fillColor */}
      <svg
        className="absolute left-0 right-0 w-full pointer-events-none"
        style={{ top: borderY - 60, height: 120 }}
        viewBox="0 0 1080 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C180,0 360,120 540,60 C720,0 900,120 1080,60 L1080,0 L0,0 Z"
          fill="#080d14"
        />
      </svg>

      {/* Groupe textes — centré verticalement */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">

        {/* Label haut */}
        <div
          className="text-ivory uppercase tracking-[0.18em] font-bold text-center"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 40,
            opacity: topOpacity,
            transform: `translateY(${topTranslateY}px)`,
          }}
        >
          {topLabel}
        </div>

        {/* Valeur centrale */}
        <div
          className="text-ivory font-black leading-none text-center"
          style={{
            fontSize: 320,
            fontFamily: "'Nunito Sans', sans-serif",
            opacity: centralOpacity,
          }}
        >
          {centralValue}
        </div>

        {/* Label bas */}
        <div
          className="text-ivory font-medium tracking-wide text-center"
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: 36,
            opacity: bottomOpacity,
          }}
        >
          {bottomLabel}
        </div>

      </div>
    </AbsoluteFill>
  );
};

export default FillScreen;
