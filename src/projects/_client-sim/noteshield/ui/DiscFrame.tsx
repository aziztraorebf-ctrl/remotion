// DiscFrame — cadre disque + anneau qui se referme, pattern repris de FlowdeskAbstraitV4.tsx
// (lignes ~875-960, "Panneau Resolution" cite explicitement par Aziz comme modele pour P5/P6 de
// NorthShield). Adapte a la palette navy/cyan NorthShield (theme.ts) au lieu de la palette
// orange/marine de Flowdesk -- structure identique : disque central qui accueille un contenu
// video/React en overflow:hidden + <ellipse> dont le strokeDasharray/strokeDashoffset dessine
// progressivement un anneau autour du disque.
//
// Reutilise tel quel par P5VideoSarah (disque autour du clip H3 Sarah) et P6VideoInconnu
// (disque autour du clip H3 "inconnu") -- cf STORYBOARD-V3-MIX-INCARNE.md + retour Aziz
// 2026-08-08 ("le pattern Flowdesk P5/P6 plutot que le plein-cadre actuel").
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { NS_COLORS } from "./theme";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const DISC_RX = 420;
export const DISC_RY = 278;
// perimetre approx d'une ellipse (formule de Ramanujan) -- identique a Flowdesk.
const RING_PERIMETER = Math.PI * (3 * (DISC_RX + DISC_RY) - Math.sqrt((3 * DISC_RX + DISC_RY) * (DISC_RX + 3 * DISC_RY)));

/**
 * Disque HTML qui accueille le contenu (video/React) -- centre sur (centerX, centerY), memes
 * dimensions que le rayon du disque Flowdesk (840x556, ellipse visuelle proche d'un disque).
 */
export const DiscContent: React.FC<{
  centerX: number;
  centerY: number;
  opacity?: number;
  children: React.ReactNode;
}> = ({ centerX, centerY, opacity = 1, children }) => (
  <div
    style={{
      position: "absolute",
      left: centerX - DISC_RX,
      top: centerY - DISC_RY,
      width: DISC_RX * 2,
      height: DISC_RY * 2,
      borderRadius: "50%",
      overflow: "hidden",
      opacity,
      boxShadow: `0 0 60px 10px ${NS_COLORS.cyanDim}`,
      background: NS_COLORS.navyPanel,
    }}
  >
    {children}
  </div>
);

/**
 * Anneau SVG qui se referme progressivement autour du disque -- a placer dans un <svg
 * viewBox="0 0 1920 1080"> par-dessus le DiscContent. `drawStart`/`drawEnd` en frames LOCALES au
 * composant appelant (pas de dependance a un timing global).
 */
export const DiscRing: React.FC<{
  centerX: number;
  centerY: number;
  drawStart: number;
  drawEnd: number;
}> = ({ centerX, centerY, drawStart, drawEnd }) => {
  const frame = useCurrentFrame();
  const ringDraw = interpolate(frame, [drawStart, drawEnd], [0, 1], clamp);
  const ringEased = 1 - Math.pow(1 - ringDraw, 3); // cubic ease-out, meme grammaire que Flowdesk
  const ringOpacity = interpolate(frame, [drawStart - 5, drawStart + 10], [0, 1], clamp);

  return (
    <ellipse
      cx={centerX}
      cy={centerY}
      rx={DISC_RX}
      ry={DISC_RY}
      fill="none"
      stroke={NS_COLORS.cyan}
      strokeWidth={5}
      strokeLinecap="round"
      opacity={ringOpacity}
      style={{
        strokeDasharray: RING_PERIMETER,
        strokeDashoffset: RING_PERIMETER * (1 - ringEased),
      }}
    />
  );
};
