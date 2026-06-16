/**
 * KraftDepth — profondeur "decoupage papier" + grain pour les inserts data-viz sur fond kraft/beige.
 *
 * Issu du breakdown premium Gemini (video Senegal, 2026-06-16) : les inserts kraft (barres, coffre,
 * calebasse, fiches) sont en flat-design pur, poses sans profondeur. Ajouter une OMBRE PORTEE nette
 * (navy, decalee bas-droite) + un GRAIN papier subtil = effet "document officiel decoupe" (Vox/Polymatter).
 *
 * Render-safe : feDropShadow + feTurbulence sont du SVG natif, prouves en render headless (WarMapEngine,
 * HookGrain). PAS de filter:blur CSS (interdit doctrine). PAS de box-shadow CSS (flou non maitrise headless).
 *
 * Usage :
 *   1. Poser <KraftShadowDefs/> UNE fois dans le <svg> de l'insert (dans un <defs> ou en tete).
 *      Puis appliquer filter="url(#kraft-shadow)" sur les <g>/<rect>/<path> a faire "decouper".
 *   2. Poser <KraftGrain/> en DERNIER par-dessus l'insert (texture papier, opacite faible).
 */

import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * Defs du filtre ombre portee "decoupage papier". A inclure une fois par <svg>.
 * dx/dy = decalage net (pas de flou diffus : stdDeviation faible). Couleur navy doctrine #16213a.
 */
export const KraftShadowDefs: React.FC<{
  /** id du filtre a referencer via filter="url(#...)". Defaut "kraft-shadow". */
  id?: string;
  dx?: number;
  dy?: number;
  /** Diffusion de l'ombre. Faible = net "papier". Defaut 3. */
  blur?: number;
  /** Opacite de l'ombre. Defaut 0.28. */
  opacity?: number;
  color?: string;
}> = ({ id = "kraft-shadow", dx = 6, dy = 7, blur = 3, opacity = 0.28, color = "#16213a" }) => (
  <defs>
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx={dx} dy={dy} stdDeviation={blur} floodColor={color} floodOpacity={opacity} />
    </filter>
  </defs>
);

/**
 * Grain papier subtil par-dessus un insert kraft. feTurbulence desature, mixBlend multiply.
 * Pose en DERNIER dans l'insert (au-dessus du SVG de contenu).
 */
export const KraftGrain: React.FC<{
  opacity?: number;
  baseFrequency?: number;
}> = ({ opacity = 0.055, baseFrequency = 0.85 }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "multiply", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id="kraft-grain">
        <feTurbulence type="fractalNoise" baseFrequency={baseFrequency} numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#kraft-grain)" />
    </svg>
  </AbsoluteFill>
);
