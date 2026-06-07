/**
 * SahelAttackArrow — flèche tactique qui POUSSE progressivement vers sa cible.
 *
 * Version Mapbox (Sahel War-Map) de AtlasAttackArrow (d3-geo).
 * Différence clé : projette via `map.project()` → coordonnées pixel écran
 * → SVG positionné en AbsoluteFill par-dessus la carte Mapbox.
 *
 * Usage dans SahelWarMapEngine.tsx :
 *   <SahelAttackArrow
 *     map={mapRef.current}
 *     waypoints={[[-7.99, 12.65], [-0.5, 14.5]]}
 *     progress={interpolate(frame, [F_HOOK_LIPTAKO, F_HOOK_LIPTAKO + 45], [0, 1], clampBoth)}
 *     color="#C8A84B"
 *     marchingFrame={frame}
 *   />
 *
 * Headless-safe : 100% SVG + opacité, JAMAIS filter:blur CSS.
 * Frame-driven : progress piloté par l'appelant (interpolate + useCurrentFrame).
 * Mapbox-adapted : map.project() pour suivre la caméra (drift + zoom).
 */

import React from "react";
import mapboxgl from "mapbox-gl";

export interface SahelAttackArrowProps {
  /** Instance mapboxgl.Map courante */
  map: mapboxgl.Map | null;
  /** Waypoints géographiques [lon, lat]. Min 2. */
  waypoints: [number, number][];
  /** 0→1 — fraction du chemin révélé. Piloté par interpolate(frame, ...). */
  progress: number;
  /** Couleur principale */
  color?: string;
  /** Épaisseur du trait */
  strokeWidth?: number;
  /** Type de tête de flèche */
  headType?: "arrow" | "dot" | "none";
  /** Frame courant — anime le marching ants */
  marchingFrame?: number;
  /** Opacité globale */
  opacity?: number;
  /** Nb de segments interpolés entre waypoints */
  segments?: number;
  /** Largeur/hauteur du SVG canvas (= taille de la composition Remotion) */
  width?: number;
  height?: number;
}

function bearing2d(
  ax: number, ay: number,
  bx: number, by: number
): number {
  return Math.atan2(by - ay, bx - ax) * (180 / Math.PI);
}

/**
 * Interpole une liste de pixel-points sur la fraction `reveal` (0→1).
 * Renvoie les points tracés jusqu'à ce pourcentage du chemin total.
 */
function revealPoints(
  pts: [number, number][],
  reveal: number
): [number, number][] {
  if (pts.length < 2 || reveal <= 0) return [];
  if (reveal >= 1) return pts;

  const totalSegments = pts.length - 1;
  const targetIdx = reveal * totalSegments;
  const floorIdx = Math.floor(targetIdx);
  const frac = targetIdx - floorIdx;

  const result = pts.slice(0, floorIdx + 1);
  if (floorIdx < totalSegments) {
    const a = pts[floorIdx];
    const b = pts[floorIdx + 1];
    result.push([
      a[0] + (b[0] - a[0]) * frac,
      a[1] + (b[1] - a[1]) * frac,
    ]);
  }
  return result;
}

function toPathD(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
  }
  return d;
}

/**
 * Génère des points intermédiaires entre 2 coordonnées geo (interpolation sphérique simplifiée).
 * Pour les waypoints Sahel (<20° de distance), la linéarité en lon/lat est suffisante.
 */
function interpolateWaypoints(
  waypoints: [number, number][],
  segments: number,
  map: mapboxgl.Map
): [number, number][] {
  const result: [number, number][] = [];

  for (let wi = 0; wi < waypoints.length - 1; wi++) {
    const [lonA, latA] = waypoints[wi];
    const [lonB, latB] = waypoints[wi + 1];
    const steps = Math.max(2, Math.floor(segments / (waypoints.length - 1)));

    for (let si = 0; si <= steps; si++) {
      if (wi > 0 && si === 0) continue; // évite doublon aux jonctions
      const t = si / steps;
      const lon = lonA + (lonB - lonA) * t;
      const lat = latA + (latB - latA) * t;
      try {
        const px = map.project([lon, lat]);
        result.push([px.x, px.y]);
      } catch {
        // map pas encore prête
      }
    }
  }
  return result;
}

export const SahelAttackArrow: React.FC<SahelAttackArrowProps> = ({
  map,
  waypoints,
  progress,
  color = "#b3322c",
  strokeWidth = 4,
  headType = "arrow",
  marchingFrame = 0,
  opacity = 1,
  segments = 60,
  width = 1920,
  height = 1080,
}) => {
  if (!map || waypoints.length < 2) return null;
  const reveal = Math.max(0, Math.min(1, progress));
  if (reveal <= 0) return null;

  // Projeter tous les waypoints intermédiaires via map.project()
  const allPixelPts = interpolateWaypoints(waypoints, segments, map);
  if (allPixelPts.length < 2) return null;

  const visiblePts = revealPoints(allPixelPts, reveal);
  if (visiblePts.length < 2) return null;

  const d = toPathD(visiblePts);
  if (!d) return null;

  // Tête de flèche : dernier point visible, orientation = bearing du dernier segment
  const head = visiblePts[visiblePts.length - 1];
  const prev = visiblePts[visiblePts.length - 2];
  const headAngle = bearing2d(prev[0], prev[1], head[0], head[1]);

  const dashOffset = -(marchingFrame * 0.9) % 22;

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
      }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g opacity={opacity}>
        {/* halo doux (opacité, pas de blur) */}
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 3}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.14}
        />
        {/* trait principal */}
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.95}
        />
        {/* marching ants (blanc semi-transparent animé) */}
        <path
          d={d}
          fill="none"
          stroke="#fff"
          strokeWidth={strokeWidth * 0.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8 13"
          strokeDashoffset={dashOffset}
          opacity={0.5}
        />
        {/* tête de flèche */}
        {headType === "dot" && (
          <g transform={`translate(${head[0]} ${head[1]})`}>
            <circle r={strokeWidth * 2} fill={color} opacity={0.25} />
            <circle r={strokeWidth * 1} fill="#fff" />
          </g>
        )}
        {headType === "arrow" && (
          <g transform={`translate(${head[0]} ${head[1]}) rotate(${headAngle})`}>
            <path
              d={`M ${strokeWidth * 2.5} 0 L ${-strokeWidth * 1.0} ${-strokeWidth * 1.4} L ${strokeWidth * 0.2} 0 L ${-strokeWidth * 1.0} ${strokeWidth * 1.4} Z`}
              fill={color}
              stroke="#fff"
              strokeWidth={strokeWidth * 0.25}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        )}
      </g>
    </svg>
  );
};
