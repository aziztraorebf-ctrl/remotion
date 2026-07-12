/**
 * PoissonEncre — composant React du poisson indexe (poisson-encre.svg/.md). Code a la main
 * (2026-07-04) apres echec de 2 essais LLM sur cet objet simple (Qwen : oeil mal place + queue
 * disproportionnee ; GLM-5.2 : timeout). Voir poisson-encre.md pour le detail de la geometrie.
 */
import React from "react";

export const PoissonEncre: React.FC<{ ink?: string; fillColor?: string }> = ({
  ink = "#2b2117",
  fillColor = "#8B5A2B",
}) => (
  <g fill={fillColor} stroke={ink} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round">
    <path d="M 30,30 C 30,18 55,14 78,20 C 88,23 92,27 92,30 C 92,33 88,37 78,40 C 55,46 30,42 30,30 Z" />
    <path d="M 30,30 L 12,18 L 22,30 L 12,42 Z" />
    <path d="M 52,18 Q 60,4 68,18 Z" />
    <circle cx={80} cy={27} r={2.2} fill={ink} stroke="none" />
    <path d="M 68,20 Q 66,30 68,40" fill="none" strokeWidth={1.5} opacity={0.6} />
  </g>
);
