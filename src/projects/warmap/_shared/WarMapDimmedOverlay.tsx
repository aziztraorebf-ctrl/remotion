// TEMPLATE — WarMapDimmedOverlay (validé Aziz 2026-06-14, Chantier 3 confédération AES).
//
// PATTERN PRINCIPAL réutilisable : on NE quitte PAS la carte, on l'ASSOMBRIT (voile semi-transparent) tout
// en gardant ses contours/couleurs VISIBLES en arrière-plan, puis on superpose des ÉLÉMENTS (sceau, drapeaux,
// titre, data, schéma...) PAR-DESSUS. Effet "spotlight cinématographique" : la carte reste le décor vivant,
// l'élément superposé est la scène. Beaucoup plus fort que le plein écran opaque (qui tue la carte) OU que de
// forcer le concept sur la carte (illisible). Voir doctrine WARMAP-CARTE-VS-OVERLAY.
//
// CE QUE CE COMPOSANT FAIT : le VOILE + halo + grain + fade in/out + un slot `children` centré. Il est PUR
// (reçoit `frame` en prop, pas de hook) → utilisable dans n'importe quelle couche <PartieX> ou compo.
//
// ⚠️ CONFLIT Z-ORDER (leçon Chantier 3) : si la carte a une couche de contours rendue PAR LE MOTEUR APRÈS la
// couche overlay (ex. SahelWarMapEngine `countryBorderPaths`), ces contours passent AU-DESSUS du voile ET des
// children → ils traversent l'élément superposé. SOLUTION : percer un TROU (mask SVG) dans la couche contours
// du moteur, à l'emplacement écran de l'élément, actif sur la même fenêtre. Helper `dimmedOverlayHole()` fournit
// les params du trou (cx, cy, r) ; le moteur l'applique. Ne PAS masquer TOUS les contours (ça tue la beauté).

import React from "react";
import { AbsoluteFill, interpolate, staticFile } from "remotion";

export type DimmedOverlayParams = {
  frame: number;
  inAt: number;
  outAt: number;
  width: number;
  height: number;
  /** Opacité du voile noir sur la carte (0.5-0.7 typique : assez pour faire ressortir, pas pour tout cacher). */
  veil?: number;
  /** Couleur de base du voile (charte épisode). */
  veilColor?: string;
  /** Accent du halo radial (doré par défaut). */
  haloColor?: string;
  /** Position verticale du centre du halo/contenu (0-1 de la hauteur). */
  centerY?: number;
  /** Durées de fondu (frames). */
  fadeIn?: number;
  fadeOut?: number;
  children?: React.ReactNode;
};

// Params du TROU à percer dans la couche contours du moteur (à appliquer côté moteur via mask SVG).
// Retourne null hors fenêtre. `holeR` = rayon écran du disque non-tracé (autour de l'élément superposé).
export function dimmedOverlayHole(opts: {
  frame: number; inAt: number; outAt: number; width: number; height: number;
  centerY?: number; holeRadiusVmin?: number;
}): { cx: number; cy: number; r: number; t: number } | null {
  const { frame, inAt, outAt, width, height } = opts;
  const t = interpolate(frame, [inAt - 8, inAt + 12, outAt - 12, outAt + 8], [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0.01) return null;
  const vmin = Math.min(width, height);
  return { cx: width / 2, cy: height * (opts.centerY ?? 0.46), r: vmin * (opts.holeRadiusVmin ?? 0.105) * t, t };
}

export const WarMapDimmedOverlay: React.FC<DimmedOverlayParams> = ({
  frame, inAt, outAt, width, height, veil = 0.62, veilColor = "12,10,6",
  haloColor = "70,60,34", centerY = 0.44, fadeIn = 16, fadeOut = 18, children,
}) => {
  if (frame < inAt - 2 || frame > outAt + 2) return null;
  const op = interpolate(frame, [inAt, inAt + fadeIn, outAt - fadeOut, outAt], [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (op <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      {/* voile assombrissant SEMI-TRANSPARENT : la carte (contours/couleurs) reste visible derrière */}
      <AbsoluteFill style={{ background: `rgba(${veilColor},${veil})` }} />
      {/* halo radial noble (spotlight doux sur le centre où se joue la scène) */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% ${centerY * 100}%, rgba(${haloColor},0.40) 0%, rgba(22,19,12,0.12) 55%, transparent 100%)` }} />
      {/* grain (texture, anti-flat) */}
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("_shared/sprites/warmap/paper-grain.png")})`,
        backgroundRepeat: "repeat", opacity: 0.10, mixBlendMode: "overlay" }} />
      {/* slot pour la scène superposée (drapeaux, sceau, data, schéma...) */}
      {children}
    </AbsoluteFill>
  );
};
