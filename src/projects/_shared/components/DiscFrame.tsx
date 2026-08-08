// DiscFrame — cadre disque + anneau qui se referme progressivement autour, pour isoler visuellement
// un contenu (video/React) plutot que de le laisser en plein cadre. Pattern extrait de
// FlowdeskAbstraitV4.tsx (panneau "Resolution", disque + anneau orange autour d'un clip video) puis
// re-decouvert independamment sous forme parametree dans NorthShieldV3 (disque + anneau cyan autour
// de Sarah/l'inconnu, P5/P6) -- 2 implementations independantes du meme motif = extrait ici comme
// source unique reutilisable. Couleurs/dimensions parametrees (pas de dependance a une charte
// projet precise) -- passer stroke/glow/background du theme appelant.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const DEFAULT_DISC_RX = 420;
export const DEFAULT_DISC_RY = 278;

function ringPerimeter(rx: number, ry: number) {
  // Formule de Ramanujan (perimetre approx d'une ellipse).
  return Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
}

/**
 * Disque HTML qui accueille le contenu (video/React) -- centre sur (centerX, centerY).
 */
export const DiscContent: React.FC<{
  centerX: number;
  centerY: number;
  rx?: number;
  ry?: number;
  opacity?: number;
  background: string;
  glowColor: string;
  children: React.ReactNode;
}> = ({ centerX, centerY, rx = DEFAULT_DISC_RX, ry = DEFAULT_DISC_RY, opacity = 1, background, glowColor, children }) => (
  <div
    style={{
      position: "absolute",
      left: centerX - rx,
      top: centerY - ry,
      width: rx * 2,
      height: ry * 2,
      borderRadius: "50%",
      overflow: "hidden",
      opacity,
      boxShadow: `0 0 60px 10px ${glowColor}`,
      background,
    }}
  >
    {children}
  </div>
);

/**
 * Anneau SVG qui se referme progressivement autour du disque -- a placer dans un <svg> par-dessus
 * le DiscContent, memes coordonnees. `drawStart`/`drawEnd` en frames LOCALES au composant appelant.
 */
export const DiscRing: React.FC<{
  centerX: number;
  centerY: number;
  rx?: number;
  ry?: number;
  drawStart: number;
  drawEnd: number;
  stroke: string;
  strokeWidth?: number;
}> = ({ centerX, centerY, rx = DEFAULT_DISC_RX, ry = DEFAULT_DISC_RY, drawStart, drawEnd, stroke, strokeWidth = 5 }) => {
  const frame = useCurrentFrame();
  const ringDraw = interpolate(frame, [drawStart, drawEnd], [0, 1], clamp);
  const ringEased = 1 - Math.pow(1 - ringDraw, 3); // cubic ease-out
  const ringOpacity = interpolate(frame, [drawStart - 5, drawStart + 10], [0, 1], clamp);
  const perimeter = ringPerimeter(rx, ry);

  return (
    <ellipse
      cx={centerX}
      cy={centerY}
      rx={rx}
      ry={ry}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      opacity={ringOpacity}
      style={{
        strokeDasharray: perimeter,
        strokeDashoffset: perimeter * (1 - ringEased),
      }}
    />
  );
};
