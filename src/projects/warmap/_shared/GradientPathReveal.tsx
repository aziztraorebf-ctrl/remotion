/**
 * GradientPathReveal — un tracé géo qui se révèle comme une MASSE qui se teinte progressivement,
 * pas un marqueur ponctuel qui voyage. Distinct de GeoFlowConnection (réservé aux objets qui VOYAGENT
 * A→B — or, drones, argent). Ici l'objet est un TERRITOIRE/RESSOURCE qui change d'état sur toute sa
 * longueur (ex. le Nil qui "s'irrigue" de sens stratégique) — cf doctrine "objet inerte ne glisse jamais,
 * il s'illumine sur place" appliquée à une bande entière plutôt qu'à un point.
 *
 * Créé DA-brief upstream Acte 4 Soudan (2026-07-11), convergence 3/3 modèles (Gemini/Kimi/DeepSeek) sur
 * ce mécanisme pour le Beat 4 "profondeur stratégique égyptienne" : Beat 4 nécessitait une remontée du
 * geste ponctuel (marqueur invisible sur render réel, diff pixel quasi nul) vers un geste de MASSE.
 *
 * Mécanisme : le stroke-width ET l'opacité augmentent progressivement le long du chemin en fonction d'un
 * "front" qui avance (`fillProgress`), pas une position de marqueur — segment par segment du chemin déjà
 * interpolé en pixels. Un flash final (`flashT`, 0→1) peut illuminer tout le tracé d'un coup au moment clé.
 */

import React from "react";
import mapboxgl from "mapbox-gl";

export interface GradientPathRevealProps {
  map: mapboxgl.Map | null;
  /** Waypoints géographiques [lon, lat], dans le sens du courant réel (ex. amont → aval). */
  waypoints: [number, number][];
  /** 0→1 — position du FRONT qui avance le long du chemin (le segment déjà "coloré"). */
  fillProgress: number;
  /** Couleur de départ (segment pas encore atteint par le front, résidu ténu). */
  colorBefore: string;
  /** Couleur du segment déjà coloré par le front. */
  colorAfter: string;
  /** Épaisseur minimale (avant passage du front). */
  strokeWidthBefore?: number;
  /** Épaisseur maximale (après passage du front). */
  strokeWidthAfter?: number;
  /** 0→1 — flash net sur tout le tracé (ex. au moment d'une phrase coup de poing). 0 = pas de flash. */
  flashT?: number;
  /** Opacité de base du tracé (avant tout state). */
  baseOpacity?: number;
  /** Frame courant — anime la texture organique du trait (feTurbulence, seed déterministe). */
  dashOffsetFrame?: number;
  width?: number;
  height?: number;
}

function toPathD(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) d += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
  return d;
}

/** Interpolation lon/lat linéaire par segment, projetée en pixels — même logique que GeoFlowConnection. */
function interpolateWaypoints(waypoints: [number, number][], segments: number, map: mapboxgl.Map): [number, number][] {
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

/** Coupe le chemin pixel en 2 segments (coloré / résiduel) selon fillProgress. */
function splitAt(pts: [number, number][], t: number): { filled: [number, number][]; rest: [number, number][] } {
  if (pts.length < 2) return { filled: [], rest: pts };
  const clamped = Math.max(0, Math.min(1, t));
  const totalSegments = pts.length - 1;
  const targetIdx = clamped * totalSegments;
  const floorIdx = Math.min(totalSegments, Math.floor(targetIdx));
  const frac = targetIdx - floorIdx;
  const filled = pts.slice(0, floorIdx + 1);
  const rest = pts.slice(floorIdx);
  if (floorIdx < totalSegments) {
    const a = pts[floorIdx];
    const b = pts[floorIdx + 1];
    const mid: [number, number] = [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac];
    filled.push(mid);
    rest[0] = mid;
  }
  return { filled, rest };
}

export const GradientPathReveal: React.FC<GradientPathRevealProps> = ({
  map,
  waypoints,
  fillProgress,
  colorBefore,
  colorAfter,
  strokeWidthBefore = 2,
  strokeWidthAfter = 10,
  flashT = 0,
  baseOpacity = 0.55,
  dashOffsetFrame = 0,
  width = 1920,
  height = 1080,
}) => {
  if (!map || waypoints.length < 2) return null;

  const allPixelPts = interpolateWaypoints(waypoints, 60, map);
  if (allPixelPts.length < 2) return null;

  const { filled, rest } = splitAt(allPixelPts, fillProgress);
  const filledD = toPathD(filled);
  const restD = toPathD(rest);
  const fullD = toPathD(allPixelPts);

  // texture organique déterministe (jamais Math.random en Remotion)
  const turbSeed = Math.floor(dashOffsetFrame / 4);
  const filterId = "gpr-water-texture";

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width, height, pointerEvents: "none", overflow: "visible" }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency={0.012} numOctaves={2} seed={turbSeed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.2} />
        </filter>
      </defs>

      {/* résidu (avant le front) — trait ténu, résiduel */}
      {restD && (
        <path d={restD} fill="none" stroke={colorBefore} strokeWidth={strokeWidthBefore} strokeLinecap="round" strokeLinejoin="round" opacity={baseOpacity * 0.4} />
      )}

      {/* segment coloré par le front — halo diffus dessous */}
      {filledD && (
        <path d={filledD} fill="none" stroke={colorAfter} strokeWidth={strokeWidthAfter * 1.8} strokeLinecap="round" strokeLinejoin="round" opacity={baseOpacity * 0.18} />
      )}
      {/* segment coloré — trait principal texturé eau */}
      {filledD && (
        <path d={filledD} fill="none" stroke={colorAfter} strokeWidth={strokeWidthAfter} strokeLinecap="round" strokeLinejoin="round"
          opacity={baseOpacity} filter={`url(#${filterId})`} />
      )}

      {/* flash — illumine tout le tracé d'un coup au moment clé (halo large + trait net, pour rester
          lisible même écrasé sous le trait principal déjà à pleine opacité) */}
      {flashT > 0.01 && fullD && (
        <>
          <path d={fullD} fill="none" stroke="#FFFFFF" strokeWidth={strokeWidthAfter * 3.2} strokeLinecap="round" strokeLinejoin="round"
            opacity={flashT * 0.5} />
          <path d={fullD} fill="none" stroke="#FFFFFF" strokeWidth={strokeWidthAfter * 1.3} strokeLinecap="round" strokeLinejoin="round"
            opacity={flashT} />
        </>
      )}
    </svg>
  );
};

export default GradientPathReveal;
