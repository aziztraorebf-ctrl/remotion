/**
 * AtlasAttackArrow — flèche d'attaque / mouvement de troupe qui se DESSINE
 * progressivement le long d'un arc géodésique, avec tête mobile, marching ants
 * (dash animé) et tête de flèche orientée sur la tangente. Style "diagramme
 * tactique" (Napoléon / Cannes), décodé de mapanimation.io Route Pack 2026-06-03.
 *
 * DIFFÉRENCE avec eux : on dessine dans les VRAIES coords géo (lngLatToSvg + arc
 * great-circle), donc la flèche suit la carte au drift/zoom et épouse la géographie.
 * Et — voir [[atlas-pixellab-differentiel]] — la flèche raconte la GÉOGRAPHIE du
 * mouvement ; quand un ACTEUR du récit la parcourt, on lui marie un sprite PixelLab
 * (la flèche montre où va l'armée, le sprite EST l'armée). Ce composant = la flèche
 * seule (brique de base). Le mariage sprite vient dans un wrapper séparé.
 *
 * RENDU : ce composant retourne du SVG en coords carte (espace 720×1280). À placer
 * DANS le <g transform caméra> du beat (comme les <path> pays), pour hériter du
 * drift/zoom. NE crée PAS sa propre <svg> ni son propre transform.
 *
 *   <g transform={`...scale(${camScale})...`}>
 *     <AtlasMercator ... />
 *     <AtlasAttackArrow
 *       waypoints={[{lon, lat}, {lon, lat}]}
 *       progress={interpolate(frame, [start, end], [0, 1], clampBoth)}
 *       color="#b3322c" headType="arrow" />
 *   </g>
 *
 * Headless-safe : 100% SVG path + opacité (pas de filter:blur), frame-driven via
 * la prop `progress` pilotée par l'appelant (useCurrentFrame + interpolate).
 */

import React from "react";
import {
  buildRoute,
  greatCircleRoute,
  positionAlongRoute,
  bearingAlongRoute,
  rotationFromBearing,
  type GeoPoint,
} from "./geoUtils";

export interface AtlasAttackArrowProps {
  /** étapes géo de la flèche (min 2). 2 points → arc géodésique ; 3+ → polyligne. */
  waypoints: GeoPoint[];
  /** 0→1 — fraction tracée. Piloté par l'appelant (interpolate sur le frame). */
  progress: number;
  /** couleur principale du tracé (défaut rouge tactique) */
  color?: string;
  /** épaisseur du trait de base */
  strokeWidth?: number;
  /** "arrow" (tête de flèche), "dot" (marqueur rond), "none" */
  headType?: "arrow" | "dot" | "none";
  /** dash "marching ants" animé. Passer le frame courant pour animer le défilement. */
  marchingFrame?: number;
  /** opacité globale (fade in/out depuis l'appelant) */
  opacity?: number;
  /** courber l'arc (great-circle) quand 2 points. false = ligne droite géodésique. */
  curved?: boolean;
  /** échantillonnage de l'arc (densité de points pour le path) */
  samples?: number;
}

// échantillonne la route en N points SVG le long de progress (0..reveal)
function sampleSvgPath(
  routeFeature: ReturnType<typeof buildRoute>,
  reveal: number,
  samples: number
): [number, number][] {
  const n = Math.max(2, Math.floor(samples * Math.max(0.02, reveal)));
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const p = (i / n) * reveal;
    pts.push(positionAlongRoute(routeFeature, p));
  }
  return pts;
}

function toPathD(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)}`;
  }
  return d;
}

export const AtlasAttackArrow: React.FC<AtlasAttackArrowProps> = ({
  waypoints,
  progress,
  color = "#b3322c",
  strokeWidth = 3,
  headType = "arrow",
  marchingFrame = 0,
  opacity = 1,
  curved = true,
  samples = 80,
}) => {
  if (waypoints.length < 2) return null;
  const reveal = Math.max(0, Math.min(1, progress));
  if (reveal <= 0) return null;

  // construire la route : arc géodésique si 2 points + curved, sinon polyligne
  const routeFeature =
    waypoints.length === 2 && curved
      ? greatCircleRoute(waypoints[0], waypoints[1], 64)
      : buildRoute(waypoints);

  const pts = sampleSvgPath(routeFeature, reveal, samples);
  const d = toPathD(pts);
  if (!d) return null;

  // tête mobile = dernier point tracé ; orientation = bearing local
  const head = pts[pts.length - 1];
  const bearing = bearingAlongRoute(routeFeature, Math.max(0.001, reveal - 0.001));
  const headRot = rotationFromBearing(bearing); // sprite/flèche orienté est par défaut

  const dashOffset = -(marchingFrame * 0.9) % 22;

  return (
    <g opacity={opacity} style={{ pointerEvents: "none" }}>
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
      {/* trait de base continu */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.95}
      />
      {/* marching ants (dash clair animé par-dessus) */}
      <path
        d={d}
        fill="none"
        stroke="#fff"
        strokeWidth={strokeWidth * 0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="7 11"
        strokeDashoffset={dashOffset}
        opacity={0.55}
      />
      {/* tête */}
      {headType === "dot" && (
        <g transform={`translate(${head[0]} ${head[1]})`}>
          <circle r={strokeWidth * 2.2} fill={color} opacity={0.25} />
          <circle r={strokeWidth * 1.1} fill="#fff" />
        </g>
      )}
      {headType === "arrow" && (
        <g transform={`translate(${head[0]} ${head[1]}) rotate(${headRot})`}>
          {/* pointe orientée vers +x (sens de progression). Calibrée plus fine/élancée
              (proportions ~2.4x1.4 au lieu de 3.4x2.2) pour ne pas écraser le trait. */}
          <path
            d={`M ${strokeWidth * 2.4} 0 L ${-strokeWidth * 1.0} ${-strokeWidth * 1.5} L ${strokeWidth * 0.2} 0 L ${-strokeWidth * 1.0} ${strokeWidth * 1.5} Z`}
            fill={color}
            stroke="#fff"
            strokeWidth={strokeWidth * 0.28}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
};
