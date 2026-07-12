/**
 * SoleilHaloRadial — halo radial en 3 couches (coeur dur -> bloom moyen -> halo large), au lieu
 * d'un disque plat. Extrait de CargoVoyage16x9_LibreInspire.tsx (2026-07-04, "pille a Gemini").
 * Chaque instance genere ses propres <radialGradient> avec un id unique (idPrefix) pour eviter
 * les collisions si plusieurs soleils/instances coexistent dans le meme SVG.
 */
import React from "react";

export const SoleilHaloRadial: React.FC<{
  cx: number;
  cy: number;
  color: string;
  opacity?: number;
  idPrefix?: string;
  ink?: string;
}> = ({ cx, cy, color, opacity = 1, idPrefix = "sun", ink = "#2b2117" }) => (
  <>
    <defs>
      <radialGradient id={`${idPrefix}HaloWide`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={color} stopOpacity={0.4} />
        <stop offset="45%" stopColor={color} stopOpacity={0.16} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${idPrefix}Bloom`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff6da" stopOpacity={0.9} />
        <stop offset="60%" stopColor={color} stopOpacity={0.55} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${idPrefix}Core`} cx="42%" cy="38%" r="60%">
        <stop offset="0%" stopColor="#fffbef" />
        <stop offset="70%" stopColor={color} />
        <stop offset="100%" stopColor={color} />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={230} fill={`url(#${idPrefix}HaloWide)`} opacity={opacity} />
    <circle cx={cx} cy={cy} r={128} fill={`url(#${idPrefix}Bloom)`} opacity={opacity} />
    <circle cx={cx} cy={cy} r={76} fill={`url(#${idPrefix}Core)`} opacity={0.97 * opacity} />
    <circle cx={cx} cy={cy} r={76} fill="none" stroke={ink} strokeWidth={2.2} opacity={0.28 * opacity} />
  </>
);
