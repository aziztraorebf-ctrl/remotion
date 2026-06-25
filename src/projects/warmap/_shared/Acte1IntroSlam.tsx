// Acte1IntroSlam — INTRO du hook AES : le chiffre "3" geant slamme, la carte du MOTEUR est visible
// seulement A TRAVERS le chiffre, puis le "3" zoome jusqu'a reveler la carte pleine.
//
// Decode/doctrine : adaptation de la MECANIQUE de KineticMaskSlam (texte-masque + zoom-reveal) SANS
// amener de 2e carte (contrainte "1 seule Map continue", brief Acte1). Ici = overlay PUR par-dessus la
// carte du moteur : un voile parchemin plein ecran, TROUE par le "3" → on voit la carte dans le chiffre.
// Le "3" grossit → le trou remplit l'ecran → le voile s'efface → carte pleine (le reste du hook prend le relais).
//
// Intention (texte AES) : "trois pays" → le CHIFFRE est le 1er mot, on entre dans l'histoire par lui.
// Calage : slam f0-8, lecture f8-revealStart, zoom-reveal revealStart->revealEnd. Avant "chassent" (f145).

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface Acte1IntroSlamProps {
  bigText?: string;        // le chiffre ("3")
  subText?: string;        // sous-texte optionnel
  slamAt?: number;
  revealStart?: number;
  revealEnd?: number;      // au-dela, plus rien (carte pleine)
  veilColor?: string;      // voile qui cache la carte hors-chiffre
  ink?: string;
}

export const Acte1IntroSlam: React.FC<Acte1IntroSlamProps> = ({
  bigText = "3",
  subText,
  slamAt = 2,
  revealStart = 70,
  revealEnd = 110,
  veilColor = "#F5EFD6",   // parchemin (SAHEL_COLORS.land) — coherent avec la carte
  ink = "#2E1F0A",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  if (frame > revealEnd) return null; // au-dela : carte pleine, l'intro a disparu

  // Slam : le chiffre arrive avec rebond
  const slam = spring({ frame: frame - slamAt, fps, config: { damping: 11, stiffness: 200, mass: 0.8 }, durationInFrames: 18 });
  // Zoom-reveal : scale exponentiel
  const revealProg = interpolate(frame, [revealStart, revealEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textScale = slam * (1 + revealProg * revealProg * 34);

  // Le voile s'efface a la fin du reveal (la carte devient pleinement visible)
  const veilOpacity = interpolate(frame, [revealEnd - 16, revealEnd], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bigFontSize = height * 0.62;
  const subOp = subText ? interpolate(frame, [slamAt + 8, slamAt + 20, revealStart, revealStart + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* VOILE parchemin TROUE par le chiffre (mask) : la carte du moteur n'est visible que dans le "3" */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: veilOpacity }}>
        <defs>
          <mask id="slam-hole">
            <rect x="0" y="0" width={width} height={height} fill="white" />
            <text
              x={width / 2}
              y={height / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'Cormorant Garamond', Georgia, serif"
              fontWeight={800}
              fontSize={bigFontSize}
              fill="black"
              transform={`translate(${width / 2} ${height / 2}) scale(${textScale}) translate(${-width / 2} ${-height / 2})`}
            >
              {bigText}
            </text>
          </mask>
        </defs>
        {/* le voile (cache la carte) avec le trou en forme de chiffre */}
        <rect x="0" y="0" width={width} height={height} fill={veilColor} mask="url(#slam-hole)" />
        {/* liseré du chiffre (encre) pour le détacher tant qu'il est petit */}
        {revealProg < 0.5 && (
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontWeight={800}
            fontSize={bigFontSize}
            fill="none"
            stroke={ink}
            strokeWidth={3}
            opacity={0.5 * (1 - revealProg * 2)}
            transform={`translate(${width / 2} ${height / 2}) scale(${textScale}) translate(${-width / 2} ${-height / 2})`}
          >
            {bigText}
          </text>
        )}
      </svg>

      {subText && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: height * 0.66, textAlign: "center",
          fontFamily: "'Roboto Condensed', sans-serif", fontSize: 30, letterSpacing: 6, fontWeight: 700,
          color: ink, opacity: subOp,
        }}>{subText}</div>
      )}
    </AbsoluteFill>
  );
};

export default Acte1IntroSlam;
