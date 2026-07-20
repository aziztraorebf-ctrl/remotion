/**
 * CloudGLM — nuage genere par GLM-5.2 (test formes simples, 2026-07-03, cf conversation
 * Concept-video-SVG). Confirme l'hypothese Aziz : GLM excelle sur les formes iconiques simples/detourees
 * (nuage, oiseau, croissant de lune) — nettement mieux qu'un empilement d'ellipses codees a la main.
 * Trace BRUT (2 chemins : ombre de volume dessous + silhouette principale dessus), centre sur 0,0.
 */
import React from "react";

export const CloudGLM: React.FC<{ ink?: string; fill?: string; shadowFill?: string }> = ({
  ink = "#2b2117",
  fill = "#ffffff", // blanc pur (demande Aziz 2026-07-03, pas la teinte creme d'origine)
  shadowFill = "#cfcac0",
}) => (
  <g stroke={ink} strokeWidth={2} strokeLinejoin="round">
    <path
      d="M -70 15 C -80 35 -50 35 -30 20 C -10 35 20 35 40 20 C 60 35 80 30 80 5 L 65 15 L 25 15 L -20 15 L -60 15 Z"
      fill={shadowFill}
    />
    <path
      d="M -70 15 Q -90 15 -85 -5 Q -80 -25 -60 -20 Q -50 -45 -25 -35 Q 0 -50 20 -30 Q 50 -40 60 -15 Q 85 -20 80 5 Q 85 20 65 15 Z"
      fill={fill}
    />
  </g>
);
