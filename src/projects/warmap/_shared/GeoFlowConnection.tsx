/**
 * GeoFlowConnection — chemin en pointillés animé entre 2+ points géo, avec un marqueur qui VOYAGE
 * le long du tracé (indépendant du tracé lui-même). Différence clé vs SahelAttackArrow :
 * SahelAttackArrow = UNE seule chose qui progresse (`progress` pilote tracé ET tête ensemble).
 * GeoFlowConnection = DEUX choses indépendantes : le TRACÉ (peut être révélé instantanément ou en continu)
 * et le MARQUEUR qui voyage dessus à SON propre rythme (peut repartir en sens inverse sans redessiner
 * le tracé — utile pour un aller-retour sur le même chemin après une transformation, ex. or→drones).
 *
 * Repris de SahelAttackArrow.tsx (interpolateWaypoints, revealPoints, toPathD, bearing2d) — même famille,
 * même contrat headless-safe (100% SVG + opacité, JAMAIS filter:blur CSS, frame-driven pur).
 *
 * Usage type (Acte 3 Soudan, beat 3 — or Darfour → Dubaï) :
 *   <GeoFlowConnection
 *     map={mapRef.current}
 *     waypoints={[[23.706,13.834], [35,18], [45,22], [55.27,25.20]]}
 *     progress={interpolate(frame, [F_START, F_START+90], [0,1], clampBoth)}
 *     markerProgress={interpolate(frame, [F_START, F_START+90], [0,1], clampBoth)}
 *     lineColor="#D4A574" markerColor="#D4A574"
 *     dashOffsetFrame={frame}
 *   />
 */

import React from "react";
import mapboxgl from "mapbox-gl";

export interface GeoFlowConnectionProps {
  /** Instance mapboxgl.Map courante */
  map: mapboxgl.Map | null;
  /** Waypoints géographiques [lon, lat]. Min 2 — utiliser des points intermédiaires pour une courbe, pas juste [A,B]. */
  waypoints: [number, number][];
  /** 0→1 — fraction du TRACÉ révélée (indépendant du marqueur). */
  progress: number;
  /** 0→1 — position du MARQUEUR le long du chemin. Défaut = progress (comportement simple type SahelAttackArrow). */
  markerProgress?: number;
  lineColor?: string;
  lineOpacity?: number;
  lineWidth?: number;
  /** Couleur du marqueur (ignorée si markerColorTransition fourni). */
  markerColor?: string;
  /** Forme du marqueur — pas de sprite raster, cohérent stack SVG pur 2D top-down. */
  markerIcon?: "dot" | "diamond";
  /** Rayon/taille du marqueur en px. */
  markerSize?: number;
  /** Le marqueur change de couleur/forme au franchissement d'un seuil sur markerProgress (ex. beat 4 : or→drone à Dubaï). */
  markerColorTransition?: {
    beforeT: number; // 0..1, seuil de bascule sur markerProgress
    colorBefore: string;
    colorAfter: string;
  };
  /** Au-delà de ce seuil (0..1 sur progress), le TRACÉ s'estompe en fondu (pas le marqueur) — utile sortie hors-carte. */
  fadeOutAfterT?: number;
  /** Si true, le tracé reste visible (trace fantôme, opacité réduite) même après progress=1. */
  persistAfterArrival?: boolean;
  /** Opacité du tracé fantôme si persistAfterArrival. */
  persistOpacity?: number;
  /** Frame courant — anime le marching ants du tracé. */
  dashOffsetFrame?: number;
  /** Masquer le marqueur (utile si on ne veut que le tracé, ex. lignes de fuite décoratives). */
  hideMarker?: boolean;
  width?: number;
  height?: number;
}

function bearing2d(ax: number, ay: number, bx: number, by: number): number {
  return Math.atan2(by - ay, bx - ax) * (180 / Math.PI);
}

function revealPoints(pts: [number, number][], reveal: number): [number, number][] {
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
    result.push([a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac]);
  }
  return result;
}

/** Point exact (pas juste jusqu'à) à une fraction donnée du chemin — pour positionner le marqueur. */
function pointAt(pts: [number, number][], t: number): { x: number; y: number; angle: number } | null {
  if (pts.length < 2) return null;
  const clamped = Math.max(0, Math.min(1, t));
  const totalSegments = pts.length - 1;
  const targetIdx = clamped * totalSegments;
  const floorIdx = Math.min(totalSegments - 1, Math.floor(targetIdx));
  const frac = targetIdx - floorIdx;
  const a = pts[floorIdx];
  const b = pts[floorIdx + 1] ?? pts[floorIdx];
  const x = a[0] + (b[0] - a[0]) * frac;
  const y = a[1] + (b[1] - a[1]) * frac;
  const angle = bearing2d(a[0], a[1], b[0], b[1]);
  return { x, y, angle };
}

function toPathD(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) d += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
  return d;
}

/** Interpolation lon/lat linéaire par segment (suffisant pour les distances de cet acte, cf SahelAttackArrow). */
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
      if (wi > 0 && si === 0) continue;
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

export const GeoFlowConnection: React.FC<GeoFlowConnectionProps> = ({
  map,
  waypoints,
  progress,
  markerProgress,
  lineColor = "#D4A574",
  lineOpacity = 0.95,
  lineWidth = 3.5,
  markerColor = "#D4A574",
  markerIcon = "dot",
  markerSize = 7,
  markerColorTransition,
  fadeOutAfterT,
  persistAfterArrival = false,
  persistOpacity = 0.35,
  dashOffsetFrame = 0,
  hideMarker = false,
  width = 1920,
  height = 1080,
}) => {
  if (!map || waypoints.length < 2) return null;
  const reveal = Math.max(0, Math.min(1, progress));
  if (reveal <= 0 && !persistAfterArrival) return null;

  const allPixelPts = interpolateWaypoints(waypoints, 60, map);
  if (allPixelPts.length < 2) return null;

  const effectiveReveal = persistAfterArrival ? 1 : reveal;
  const visiblePts = revealPoints(allPixelPts, effectiveReveal);
  if (visiblePts.length < 2) return null;

  const d = toPathD(visiblePts);
  if (!d) return null;

  // opacité du TRACÉ : fade-out optionnel au-delà d'un seuil, ou opacité réduite si trace fantôme persistante
  let trackOpacity = lineOpacity;
  if (persistAfterArrival && reveal >= 1) trackOpacity = persistOpacity;
  if (fadeOutAfterT != null && reveal > fadeOutAfterT) {
    const fadeT = (reveal - fadeOutAfterT) / (1 - fadeOutAfterT);
    trackOpacity = lineOpacity * Math.max(0, 1 - fadeT);
  }

  const dashOffset = -(dashOffsetFrame * 0.9) % 22;

  // marqueur : position indépendante sur le chemin COMPLET (pas juste la portion révélée)
  const mProgress = markerProgress ?? progress;
  const markerPos = !hideMarker ? pointAt(allPixelPts, mProgress) : null;

  let curMarkerColor = markerColor;
  if (markerColorTransition) {
    curMarkerColor = mProgress >= markerColorTransition.beforeT
      ? markerColorTransition.colorAfter
      : markerColorTransition.colorBefore;
  }

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width, height, pointerEvents: "none", overflow: "visible" }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g>
        {/* halo doux sous le tracé */}
        <path d={d} fill="none" stroke={lineColor} strokeWidth={lineWidth * 2.6} strokeLinecap="round" strokeLinejoin="round" opacity={trackOpacity * 0.14} />
        {/* trait principal */}
        <path d={d} fill="none" stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" strokeLinejoin="round" opacity={trackOpacity} />
        {/* marching ants */}
        {trackOpacity > 0.02 && (
          <path
            d={d} fill="none" stroke="#fff" strokeWidth={lineWidth * 0.45} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="8 13" strokeDashoffset={dashOffset} opacity={trackOpacity * 0.5}
          />
        )}
      </g>
      {markerPos && (
        <g transform={`translate(${markerPos.x} ${markerPos.y})`}>
          {/* ombre portée légère (drop-shadow SVG simple, PAS 3D) pour lisibilité sur fond parchemin */}
          <ellipse cx={0} cy={markerSize * 0.55} rx={markerSize * 0.8} ry={markerSize * 0.35} fill="rgba(40,27,8,0.35)" />
          {markerIcon === "dot" && (
            <>
              <circle r={markerSize * 1.8} fill={curMarkerColor} opacity={0.22} />
              <circle r={markerSize} fill={curMarkerColor} stroke="#fff" strokeWidth={1.4} />
            </>
          )}
          {markerIcon === "diamond" && (
            <g transform={`rotate(${markerPos.angle})`}>
              <circle r={markerSize * 1.8} fill={curMarkerColor} opacity={0.22} />
              <path
                d={`M ${markerSize * 1.3} 0 L 0 ${-markerSize} L ${-markerSize * 1.3} 0 L 0 ${markerSize} Z`}
                fill={curMarkerColor} stroke="#fff" strokeWidth={1.4} strokeLinejoin="round"
              />
            </g>
          )}
        </g>
      )}
    </svg>
  );
};

export default GeoFlowConnection;
