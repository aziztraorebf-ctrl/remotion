/**
 * TerritorialExpansion — zones de contrôle qui GRANDISSENT organiquement.
 *
 * Remplace le basculement instantané de sahelControlAt() pour les actes qui
 * montrent une expansion progressive (Act 2 : contrôle JNIM 2012→2022).
 *
 * Pattern : fill-opacity qui monte région par région avec delays différents,
 * depuis le centre d'expansion (Kidal / Mopti) vers les voisines.
 * Effet "contamination" — le rouge sombre s'étend progressivement.
 *
 * Usage dans SahelWarMapEngine.tsx (Act 2, f2630→f4800) :
 *   <TerritorialExpansion
 *     map={mapRef.current}
 *     regions={EXPANSION_REGIONS_ACT2}
 *     startFrame={2630}
 *     endFrame={4800}
 *     frame={frame}
 *     color={SAHEL_COLORS.jnim}
 *     width={1920}
 *     height={1080}
 *   />
 *
 * Headless-safe : SVG avec fill-opacity uniquement, JAMAIS filter:blur CSS.
 * Frame-driven : interpolate sur chaque région individuellement.
 *
 * Architecture : chaque région a une position centrale en lon/lat.
 * On projette ce centre via map.project() et on dessine un polygone
 * "blob" SVG approximatif autour de ce centre (cercle déformé).
 * L'option `geoPolygon` permet de passer un vrai contour SVG pour les régions
 * dont on a les coordonnées réelles.
 */

import React from "react";
import { interpolate } from "remotion";
import mapboxgl from "mapbox-gl";

export interface ExpansionRegion {
  /** Identifiant de la région */
  id: string;
  /** Centre géographique [lon, lat] */
  center: [number, number];
  /** Délai relatif avant que cette région commence à s'étendre (0=première) */
  delayFrames: number;
  /** Durée de l'expansion pour cette région (en frames) */
  durationFrames: number;
  /** Rayon du blob SVG en pixels (à l'échelle zoom 4) */
  radiusPx?: number;
  /**
   * Contour réel en [lon, lat][] pour régions avec vraies formes.
   * Si fourni, remplace le blob circulaire.
   */
  geoPolygon?: [number, number][];
}

export interface TerritorialExpansionProps {
  map: mapboxgl.Map | null;
  regions: ExpansionRegion[];
  /** Frame absolu de début de l'expansion totale */
  startFrame: number;
  /** Frame absolu de fin de l'expansion totale */
  endFrame: number;
  /** Frame courant (useCurrentFrame()) */
  frame: number;
  /** Couleur de remplissage */
  color?: string;
  /** Opacité max atteinte quand la région est pleine */
  maxOpacity?: number;
  /** Frames de fade-out après endFrame (les halos s'effacent — le contrôle réel
      des régions a pris le relais via la couche Mapbox colorée). Défaut 90. */
  fadeOutFrames?: number;
  width?: number;
  height?: number;
}

/**
 * Génère un path SVG "blob" approximatif autour d'un centre pixel.
 * 8 points avec légère variation de rayon pour look organique.
 */
function blobPath(
  cx: number,
  cy: number,
  radius: number,
  seed: number
): string {
  const N = 8;
  const pts: string[] = [];
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2;
    // variation pseudo-aléatoire déterministe (pas de Math.random)
    const variation = 1 + 0.18 * Math.sin(seed * 7.3 + i * 3.7);
    const r = radius * variation;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    pts.push(i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `L ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ") + " Z";
}

/**
 * Projette un contour géographique via map.project() → chemin SVG.
 */
function geoPolygonPath(
  polygon: [number, number][],
  map: mapboxgl.Map
): string {
  const pts: string[] = [];
  for (let i = 0; i < polygon.length; i++) {
    try {
      const px = map.project(polygon[i]);
      pts.push(i === 0 ? `M ${px.x.toFixed(1)} ${px.y.toFixed(1)}` : `L ${px.x.toFixed(1)} ${px.y.toFixed(1)}`);
    } catch {
      // map pas encore prête
    }
  }
  return pts.length > 0 ? pts.join(" ") + " Z" : "";
}

export const TerritorialExpansion: React.FC<TerritorialExpansionProps> = ({
  map,
  regions,
  startFrame,
  endFrame,
  frame,
  color = "#8B1A1A",
  maxOpacity = 0.5,
  fadeOutFrames = 90,
  width = 1920,
  height = 1080,
}) => {
  if (!map || frame < startFrame) return null;

  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  // Fade-out global après endFrame : les halos d'expansion s'effacent (le contrôle
  // réel des régions a pris le relais via la couche Mapbox colorée). Évite les
  // taches floues qui traînent sur les actes suivants (fix Aziz 2026-06-07).
  const globalFade = interpolate(
    frame,
    [endFrame, endFrame + fadeOutFrames],
    [1, 0],
    clamp
  );
  if (globalFade <= 0) return null;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
        overflow: "visible",
        opacity: globalFade,
      }}
      viewBox={`0 0 ${width} ${height}`}
    >
      {regions.map((region, idx) => {
        const regionStart = startFrame + region.delayFrames;
        const regionEnd = regionStart + region.durationFrames;

        if (frame < regionStart) return null;

        const opacity = interpolate(
          frame,
          [regionStart, regionEnd],
          [0, maxOpacity],
          clamp
        );
        if (opacity <= 0) return null;

        let pathD = "";

        if (region.geoPolygon && region.geoPolygon.length >= 3) {
          pathD = geoPolygonPath(region.geoPolygon, map);
        } else {
          try {
            const px = map.project(region.center);
            const radius = region.radiusPx ?? 60;
            pathD = blobPath(px.x, px.y, radius, idx);
          } catch {
            return null;
          }
        }

        if (!pathD) return null;

        return (
          <g key={region.id} opacity={opacity}>
            {/* halo externe très transparent — limite visible du front */}
            <path
              d={pathD}
              fill={color}
              stroke={color}
              strokeWidth={8}
              strokeOpacity={0.15}
              opacity={0.3}
            />
            {/* remplissage principal */}
            <path
              d={pathD}
              fill={color}
              stroke={color}
              strokeWidth={2}
              strokeOpacity={0.6}
            />
          </g>
        );
      })}
    </svg>
  );
};

// ============================================================
// DONNÉES — Expansion JNIM Act 2 (2012→2022)
// Centre depuis Kidal nord-Mali, contamination vers centre+Burkina
// Frames Act 2 : f2630 "s'embrase" → f4800 "2022"
// ============================================================
export const EXPANSION_REGIONS_ACT2: ExpansionRegion[] = [
  // Kidal — épicentre nord Mali, part immédiatement
  {
    id: "kidal-region",
    center: [1.44, 18.43],
    delayFrames: 0,
    durationFrames: 120,
    radiusPx: 80,
  },
  // Gao — nord Mali, part 2s après Kidal
  {
    id: "gao-region",
    center: [-0.04, 16.27],
    delayFrames: 60,
    durationFrames: 100,
    radiusPx: 70,
  },
  // Timbuktu — nord Mali, 3s de délai
  {
    id: "timbuktu-region",
    center: [-3.01, 16.77],
    delayFrames: 90,
    durationFrames: 110,
    radiusPx: 75,
  },
  // Mopti — centre Mali (pivot vers le sud), 5s de délai
  {
    id: "mopti-region",
    center: [-4.19, 14.49],
    delayFrames: 150,
    durationFrames: 120,
    radiusPx: 65,
  },
  // Menaka — Mali est, proche Niger, 4s de délai
  {
    id: "menaka-region",
    center: [2.40, 15.92],
    delayFrames: 120,
    durationFrames: 100,
    radiusPx: 60,
  },
  // Tillabéri — Niger ouest (Liptako), 6s de délai
  {
    id: "tillaberi-region",
    center: [1.45, 14.21],
    delayFrames: 180,
    durationFrames: 110,
    radiusPx: 65,
  },
  // Sahel Burkina (région Djibo) — 7s de délai
  {
    id: "djibo-region",
    center: [-1.32, 14.10],
    delayFrames: 210,
    durationFrames: 120,
    radiusPx: 60,
  },
  // Est Burkina (Fada) — 9s de délai, marque la limite de l'expansion
  {
    id: "fada-region",
    center: [0.36, 12.06],
    delayFrames: 270,
    durationFrames: 100,
    radiusPx: 55,
  },
];
