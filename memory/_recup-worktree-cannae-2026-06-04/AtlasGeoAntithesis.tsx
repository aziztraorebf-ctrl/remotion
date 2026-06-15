import React from "react";
import { interpolate } from "remotion";
import { ATLAS_COLORS } from "./atlas-components";

// =============================================================================
// ATLAS GEO ANTITHESIS — deux groupes de territoires en ETATS OPPOSES
// =============================================================================
//
// POURQUOI : pattern narratif recurrent ("pendant que X meurt, Y prospere") code
// a la main 3x jusqu'ici (Mansa S4 grisaille, Peste Beat1 lerpColor, Peste Beat2
// mixHex). Trou systeme #5 du stress test Peste 1347 + fuite de code #6.
// Consolide la mecanique grisaille EPROUVEE de Mansa S4 (#C97D5A -> #8A8A8A) et
// ajoute l'etat "vivant" (glow pulse) pour le territoire qui prospere.
//
// DOCTRINE : §1.4 (etats de territoire : grisaille = mort, glow = vivant),
// §3 routage "Antithese geographique". Ne porte AUCUN texte (les labels/cartouches
// restent geres par AtlasLabel/AtlasCartouche au-dessus). Pur traitement de FILL.
//
// USAGE : a placer DANS le <g transform camera> du beat, APRES le fond ocean et
// AVANT les overlays. Les paths sont des silhouettes pre-projetees (c.d du JSON geo).
//
//   <AtlasGeoAntithesis
//     declinePaths={europePaths}      // [{iso,d}] qui virent au gris
//     thrivePaths={maliPaths}         // [{iso,d}] qui s'illuminent (or vivant)
//     declineProgress={plagueT}       // 0->1 : avancee du declin (synchro voix)
//     thriveProgress={maliT}          // 0->1 : montee de la vie
//     frame={localF}                  // pour le glow pulse du territoire vivant
//   />
//
// =============================================================================

const lerpChannel = (from: number, to: number, t: number) =>
  Math.round(from + (to - from) * t);

/** Interpole une couleur de depart (terre vivante) vers une couleur cible. */
const lerpRgb = (
  fromRgb: [number, number, number],
  toRgb: [number, number, number],
  t: number
): string =>
  `rgb(${lerpChannel(fromRgb[0], toRgb[0], t)},${lerpChannel(
    fromRgb[1],
    toRgb[1],
    t
  )},${lerpChannel(fromRgb[2], toRgb[2], t)})`;

export interface GeoPath {
  iso: string;
  d: string;
}

export interface AtlasGeoAntithesisProps {
  /** Territoires qui DECLINENT (virent vers declineColor). */
  declinePaths: GeoPath[];
  /** Territoires qui PROSPERENT (s'illuminent vers thriveColor + glow). */
  thrivePaths: GeoPath[];
  /** 0 = etat neutre (terre vivante), 1 = declin complet. Cale sur la voix. */
  declineProgress: number;
  /** 0 = neutre, 1 = prosperite pleine. Cale sur la voix. */
  thriveProgress: number;
  /** Frame locale, pour le glow pulse du territoire vivant. */
  frame: number;

  /** Couleur de depart commune (terre vivante de la carte). Defaut = ATLAS terracotta. */
  baseColorRgb?: [number, number, number];
  /** Couleur de declin (gris cendre par defaut, ou crimson pour la peste). */
  declineColorRgb?: [number, number, number];
  /** Couleur de prosperite (or empire par defaut). */
  thriveColor?: string;
  /** Stroke commun. */
  strokeColor?: string;
  /** Intensite du glow du territoire vivant (0 = aucun). */
  glowStrength?: number;
}

// Defauts derives de la charte parchemin Atlas (mecanique Mansa S4 validee).
const DEFAULT_BASE: [number, number, number] = [201, 125, 90]; // #C97D5A terracotta
const DEFAULT_DECLINE: [number, number, number] = [138, 138, 138]; // #8A8A8A gris cendre

export const AtlasGeoAntithesis: React.FC<AtlasGeoAntithesisProps> = ({
  declinePaths,
  thrivePaths,
  declineProgress,
  thriveProgress,
  frame,
  baseColorRgb = DEFAULT_BASE,
  declineColorRgb = DEFAULT_DECLINE,
  thriveColor = ATLAS_COLORS.empireGold,
  strokeColor = ATLAS_COLORS.landStroke,
  glowStrength = 1,
}) => {
  const dT = interpolate(declineProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tT = interpolate(thriveProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const declineColor = lerpRgb(baseColorRgb, declineColorRgb, dT);

  // Le territoire vivant : fill or qui monte + glow pulse respirant.
  const thriveFillOpacity = 0.3 + 0.55 * tT;
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.08);
  const glowOpacity = glowStrength * tT * (0.35 + 0.25 * pulse);

  return (
    <>
      {/* GLOW du territoire vivant — halo or pulse sous le fill (profondeur "vie").
          PAS de filter:blur CSS (ne rend PAS en headless). On simule le halo par
          3 strokes concentriques larges + opacite decroissante = glow doux headless-safe. */}
      {glowOpacity > 0.01 &&
        thrivePaths.map((c) => (
          <g key={`glow-${c.iso}`}>
            <path
              d={c.d}
              fill="none"
              stroke={thriveColor}
              strokeWidth={16}
              strokeOpacity={glowOpacity * 0.3}
              strokeLinejoin="round"
            />
            <path
              d={c.d}
              fill="none"
              stroke={thriveColor}
              strokeWidth={9}
              strokeOpacity={glowOpacity * 0.55}
              strokeLinejoin="round"
            />
            <path
              d={c.d}
              fill="none"
              stroke={thriveColor}
              strokeWidth={4}
              strokeOpacity={glowOpacity * 0.85}
              strokeLinejoin="round"
            />
          </g>
        ))}

      {/* DECLIN — territoires qui virent au gris/crimson */}
      {declinePaths.map((c) => (
        <path
          key={`decline-${c.iso}`}
          d={c.d}
          fill={declineColor}
          stroke={strokeColor}
          strokeWidth={0.8}
          strokeOpacity={0.8}
        />
      ))}

      {/* VIE — territoires qui s'illuminent en or vivant (par-dessus le glow) */}
      {thrivePaths.map((c) => (
        <path
          key={`thrive-${c.iso}`}
          d={c.d}
          fill={thriveColor}
          fillOpacity={thriveFillOpacity}
          stroke={thriveColor}
          strokeWidth={1.2}
          strokeOpacity={0.5 + 0.5 * tT}
          strokeLinejoin="round"
        />
      ))}
    </>
  );
};
