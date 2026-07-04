/**
 * CloudQwenGravure — nuage genere par Qwen3.6 (avec vision), registre gravure/hachures (2026-07-03).
 *
 * Contexte : test GLM-5.2 (text-only) sur le meme brief a produit un assemblage de facettes geometriques
 * abstraites, ILLISIBLE comme nuage (Aziz : "on dirait des triangles, je ne comprends rien"). Root cause
 * probable : GLM n'a pas de vision, donc pas de reference visuelle du "reste un nuage" — juste une
 * description textuelle qu'il a suivie trop litteralement vers l'anguleux. Qwen3.6 A la vision : en lui
 * montrant CloudGLM (notre nuage rond/mignon) comme repoussoir de style + la meme consigne texte, il a
 * GARDE la silhouette nuageuse (masses arrondies qui se chevauchent) et change UNIQUEMENT le remplissage
 * (hachures fines au lieu de l'aplat plat) — exactement la demande. Reconnaissable comme nuage a 100%.
 *
 * Trace BRUT (nettoye : le clip-path="url(#cloud-clip)" du path "ombre" referencait un id inexistant
 * dans les defs originales — retire, sans impact visuel visible sur le rendu). Centre sur 0,0 (viewBox
 * source 0,0,200,120 -> translate(-100,-60) applique ici).
 */
import React from "react";

export const CloudQwenGravure: React.FC<{ ink?: string; fill?: string }> = ({
  ink = "#2b2117",
  fill = "#f4f1ea",
}) => (
  <g transform="translate(-100 -60)">
    <defs>
      <pattern id="qwenCloudHatchBody" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="8" stroke={ink} strokeWidth={0.5} strokeOpacity={0.3} />
      </pattern>
      <pattern id="qwenCloudHatchShadow" width="4" height="4" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="4" stroke={ink} strokeWidth={0.5} strokeOpacity={0.6} />
      </pattern>
    </defs>

    <path
      d="M 15 60 C 10 40, 30 30, 50 35 C 60 15, 90 15, 100 30 C 120 20, 150 20, 160 35 C 180 35, 195 50, 190 70 C 195 90, 160 95, 140 85 C 120 95, 80 95, 60 85 C 40 95, 10 90, 5 70 C 0 60, 10 60, 15 60 Z"
      fill={fill}
      stroke={ink}
      strokeWidth={2.5}
      strokeLinejoin="round"
    />
    <path
      d="M 15 60 C 10 40, 30 30, 50 35 C 60 15, 90 15, 100 30 C 120 20, 150 20, 160 35 C 180 35, 195 50, 190 70 C 195 90, 160 95, 140 85 C 120 95, 80 95, 60 85 C 40 95, 10 90, 5 70 C 0 60, 10 60, 15 60 Z"
      fill="url(#qwenCloudHatchBody)"
      opacity={0.8}
    />
    <path
      d="M 5 70 C 10 90, 40 95, 60 85 C 80 95, 120 95, 140 85 C 160 95, 195 90, 190 70 C 195 50, 180 35, 160 35 C 150 20, 120 20, 100 30 C 90 15, 60 15, 50 35 C 30 30, 10 40, 15 60 Z"
      fill="url(#qwenCloudHatchShadow)"
      opacity={0.9}
    />
    <path
      d="M 30 75 L 45 88 M 40 72 L 55 85 M 50 70 L 65 83 M 25 80 L 40 93"
      stroke={ink}
      strokeWidth={0.8}
      fill="none"
      strokeOpacity={0.7}
    />
    <path d="M 10 45 Q 12 40 15 42" stroke={ink} strokeWidth={0.5} fill="none" />
    <path d="M 180 45 Q 178 50 175 48" stroke={ink} strokeWidth={0.5} fill="none" />
    <path d="M 95 20 Q 98 18 100 22" stroke={ink} strokeWidth={0.5} fill="none" />
    <path d="M 140 85 Q 138 90 142 92" stroke={ink} strokeWidth={0.5} fill="none" />
  </g>
);
