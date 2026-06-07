/**
 * RefugeeFlow — flux de déplacés animé en ruban SVG.
 *
 * Chaque corridor se dessine progressivement via stroke-dasharray animé.
 * Inspiré de "The Great Displacement — Ukraine Refugee Flows" (template #12).
 *
 * Corridors Act 4 (Sahel) :
 *   Djibo (lat 14.10, lon -1.32) → Bobo-Dioulasso (lat 11.18, lon -4.30)
 *   Ménaka (lat 15.92, lon 2.40) → Gao (lat 16.27, lon -0.04) → ouest
 *   Tillabéri (lat 14.21, lon 1.45) → Niamey (lat 13.51, lon 2.12)
 *
 * Usage dans SahelWarMapEngine.tsx (Act 4, f10294+) :
 *   <RefugeeFlow
 *     map={mapRef.current}
 *     flows={REFUGEE_FLOWS_ACT4}
 *     frame={frame}
 *     width={1920}
 *     height={1080}
 *   />
 *
 * Headless-safe : SVG stroke-dasharray, JAMAIS filter:blur CSS.
 * Frame-driven : triggerFrame par corridor, drawDuration pour l'animation.
 */

import React from "react";
import { interpolate } from "remotion";
import mapboxgl from "mapbox-gl";

export interface FlowCorridor {
  /** Identifiant */
  id: string;
  /** Points géographiques [lon, lat] du parcours (tracé réel, pas ligne droite) */
  waypoints: [number, number][];
  /** Frame absolu où ce corridor commence à se dessiner */
  triggerFrame: number;
  /** Durée en frames pour dessiner le chemin complet */
  drawDuration: number;
  /** Épaisseur relative au volume (1=base, 2=double volume) */
  weight?: number;
  /** Label affiché à la source */
  label?: string;
}

export interface RefugeeFlowProps {
  map: mapboxgl.Map | null;
  flows: FlowCorridor[];
  frame: number;
  /** Couleur des rubans (encre parchemin semi-transparent) */
  color?: string;
  /** Épaisseur de base en pixels */
  baseWidth?: number;
  width?: number;
  height?: number;
}

/**
 * Projette les waypoints via map.project() et génère un path SVG.
 */
function buildFlowPath(
  waypoints: [number, number][],
  map: mapboxgl.Map
): string {
  const pts: string[] = [];
  for (let i = 0; i < waypoints.length; i++) {
    try {
      const px = map.project(waypoints[i]);
      pts.push(i === 0 ? `M ${px.x.toFixed(1)} ${px.y.toFixed(1)}` : `L ${px.x.toFixed(1)} ${px.y.toFixed(1)}`);
    } catch {
      // map pas encore prête
    }
  }
  return pts.join(" ");
}

/**
 * Estime la longueur approximative d'un path SVG en px (distances euclidiennes).
 */
function estimatePathLength(
  waypoints: [number, number][],
  map: mapboxgl.Map
): number {
  let len = 0;
  let prev: { x: number; y: number } | null = null;
  for (const wp of waypoints) {
    try {
      const px = map.project(wp);
      if (prev) {
        const dx = px.x - prev.x;
        const dy = px.y - prev.y;
        len += Math.sqrt(dx * dx + dy * dy);
      }
      prev = px;
    } catch {
      // skip
    }
  }
  return len;
}

export const RefugeeFlow: React.FC<RefugeeFlowProps> = ({
  map,
  flows,
  frame,
  color = "#3A2A18",
  baseWidth = 5,
  width = 1920,
  height = 1080,
}) => {
  if (!map) return null;

  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

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
      {flows.map((flow) => {
        if (frame < flow.triggerFrame) return null;

        const progress = interpolate(
          frame,
          [flow.triggerFrame, flow.triggerFrame + flow.drawDuration],
          [0, 1],
          clamp
        );
        if (progress <= 0) return null;

        const pathD = buildFlowPath(flow.waypoints, map);
        if (!pathD || pathD === "") return null;

        const strokeW = baseWidth * (flow.weight ?? 1);

        // Animation de révélation via stroke-dasharray
        // On estime la longueur totale et on anime la portion visible
        const approxLen = estimatePathLength(flow.waypoints, map);
        const dashArray = `${(approxLen * progress).toFixed(0)} ${approxLen}`;

        // Opacité : monte vite au déclenchement, reste stable
        const opacity = interpolate(
          frame,
          [flow.triggerFrame, flow.triggerFrame + 15],
          [0, 0.35],
          clamp
        );

        // Label source : position du premier waypoint
        let labelPx: { x: number; y: number } | null = null;
        try {
          labelPx = map.project(flow.waypoints[0]);
        } catch {
          // skip
        }

        return (
          <g key={flow.id}>
            {/* halo externe très transparent */}
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth={strokeW * 2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dashArray}
              strokeDashoffset={0}
              opacity={opacity * 0.3}
            />
            {/* ruban principal */}
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth={strokeW}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dashArray}
              strokeDashoffset={0}
              opacity={opacity}
            />
            {/* traits de mouvement (petites tirets clairs) */}
            <path
              d={pathD}
              fill="none"
              stroke="#8B7355"
              strokeWidth={strokeW * 0.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${(approxLen * progress * 0.4).toFixed(0)} ${approxLen * 3}`}
              strokeDashoffset={-(frame * 1.5) % (approxLen * 0.6)}
              opacity={opacity * 0.7}
            />
            {/* label source si visible et progress > 0.1 */}
            {flow.label && labelPx && progress > 0.1 && (
              <g transform={`translate(${labelPx.x}, ${labelPx.y})`}>
                <circle r={4} fill={color} opacity={opacity * 1.5} />
                <text
                  x={8}
                  y={4}
                  fontSize={12}
                  fill={color}
                  opacity={opacity * 1.5}
                  fontFamily="serif"
                  fontStyle="italic"
                >
                  {flow.label}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ============================================================
// DONNÉES — Flux de déplacés Act 4 (Sahel)
// SCRIPT: f10294 "Djibo" / f10349 "Ménaka" / f10783 "réel."
// ============================================================
export const REFUGEE_FLOWS_ACT4: FlowCorridor[] = [
  {
    id: "djibo-bobo",
    label: "Djibo",
    waypoints: [
      [-1.32, 14.10], // Djibo — source déplacement
      [-2.10, 13.40], // intermédiaire (route N22 Burkina)
      [-3.20, 12.60], // intermédiaire (Dédougou direction)
      [-4.30, 11.18], // Bobo-Dioulasso — destination
    ],
    triggerFrame: 10294, // "Djibo,"
    drawDuration: 120,
    weight: 1.8, // volume important
  },
  {
    id: "menaka-gao-ouest",
    label: "Ménaka",
    waypoints: [
      [2.40, 15.92],  // Ménaka — source
      [1.20, 16.10],  // intermédiaire
      [-0.04, 16.27], // Gao — point de transit
      [-1.80, 15.80], // vers ouest (corridor fleuve Niger)
    ],
    triggerFrame: 10349, // "Ménaka"
    drawDuration: 100,
    weight: 1.2,
  },
  {
    id: "tillaberi-niamey",
    label: "Tillabéri",
    waypoints: [
      [1.45, 14.21],  // Tillabéri — source
      [1.80, 13.85],  // intermédiaire (route N1 Niger)
      [2.12, 13.51],  // Niamey — capitale
    ],
    triggerFrame: 10783, // "réel."
    drawDuration: 80,
    weight: 1.0,
  },
];
