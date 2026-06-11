// ConvergingFlows — Arcs bezier animés multi-source convergent vers une destination.
// Usage : corridors gaziers, alliances, routes commerciales, flux BRICS, triangle géopolitique.
// Technique : SVG overlay AbsoluteFill. Coordonnées via map.project(). Arc quadratique
//             avec point de contrôle décalé = courbure naturelle (pas de droites).

import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import mapboxgl from "mapbox-gl";

export interface FlowSource {
  coord: [number, number];
  at: number;           // frame locale d'apparition
  duration?: number;    // frames pour dessiner l'arc (défaut 60)
  label?: string;       // label au départ (ex: "CHINE")
  color?: string;       // couleur de cet arc (surcharge la couleur globale)
}

export interface ConvergingFlowsProps {
  frame: number;
  map: mapboxgl.Map | null;
  destination: [number, number];   // coord [lon,lat] du point central
  sources: FlowSource[];
  color?: string;                  // couleur par défaut des arcs
  glowColor?: string;              // couleur du glow (rgba)
  strokeWidth?: number;
  // Dot pulsant sur la destination
  destPulseAt?: number;            // frame locale activation pulse destination
  destColor?: string;
  // Glow sur destination
  destGlow?: boolean;
  // Dimensions du canvas (viewBox SVG). Défaut 1080×1920 (vertical, rétrocompat Maroc).
  // Passer width/height pour les compos horizontales (ex: War-Map 1920×1080).
  width?: number;
  height?: number;
}

const DEFAULT_COLOR    = "#c8a951";
const DEFAULT_GLOW     = "rgba(200,169,81,0.45)";
const DEFAULT_WIDTH    = 2.5;
const LABEL_FONT       = "'IBM Plex Mono', monospace";

function quadBezierPoint(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number]
): [number, number] {
  const mt = 1 - t;
  return [
    mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0],
    mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1],
  ];
}

function buildBezierPath(
  src: [number, number],
  dst: [number, number],
  progress: number // 0..1
): string {
  // Point de contrôle : milieu avec offset perpendiculaire (~25% de la longueur)
  const mx = (src[0] + dst[0]) / 2;
  const my = (src[1] + dst[1]) / 2;
  const dx = dst[0] - src[0];
  const dy = dst[1] - src[1];
  const len = Math.sqrt(dx * dx + dy * dy);
  const off = len * 0.28;
  const ctrl: [number, number] = [mx - dy * off / len, my + dx * off / len];

  if (progress <= 0) return "";
  if (progress >= 1) {
    return `M ${src[0]} ${src[1]} Q ${ctrl[0]} ${ctrl[1]} ${dst[0]} ${dst[1]}`;
  }

  // Dessin progressif : échantillonner N points jusqu'à progress
  const N = 32;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * progress;
    pts.push(quadBezierPoint(t, src, ctrl, dst));
  }
  return "M " + pts.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");
}

export const ConvergingFlows: React.FC<ConvergingFlowsProps> = ({
  frame,
  map,
  destination,
  sources,
  color = DEFAULT_COLOR,
  glowColor = DEFAULT_GLOW,
  strokeWidth = DEFAULT_WIDTH,
  destPulseAt,
  destColor,
  destGlow = true,
  width = 1080,
  height = 1920,
}) => {
  if (!map) return null;

  const dstPx = map.project(new mapboxgl.LngLat(destination[0], destination[1]));

  // Pulse destination
  const destActive = destPulseAt !== undefined && frame >= destPulseAt;
  const destPulse = destActive
    ? Math.abs(Math.sin((frame - (destPulseAt ?? 0)) * 0.08)) * 0.5 + 0.5
    : 0;
  const destR = destActive ? 10 + destPulse * 6 : 0;
  const destC = destColor ?? color;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0 }}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="cf-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {sources.map((src, i) => {
          const dur = src.duration ?? 60;
          const progress = interpolate(frame, [src.at, src.at + dur], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (progress <= 0) return null;

          const srcPx = map.project(new mapboxgl.LngLat(src.coord[0], src.coord[1]));
          const arcColor = src.color ?? color;

          const opacity = interpolate(progress, [0, 0.05], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const pathD = buildBezierPath(
            [srcPx.x, srcPx.y],
            [dstPx.x, dstPx.y],
            progress
          );
          if (!pathD) return null;

          // Tête de l'arc (dot animé qui se déplace)
          const headPt = (() => {
            const mx = (srcPx.x + dstPx.x) / 2;
            const my = (srcPx.y + dstPx.y) / 2;
            const dx = dstPx.x - srcPx.x;
            const dy = dstPx.y - srcPx.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const off = len * 0.28;
            const ctrl: [number, number] = [mx - dy * off / len, my + dx * off / len];
            return quadBezierPoint(progress, [srcPx.x, srcPx.y], ctrl, [dstPx.x, dstPx.y]);
          })();

          return (
            <g key={i} opacity={opacity} filter="url(#cf-glow)">
              {/* Glow track (large, transparent) */}
              <path
                d={pathD}
                fill="none"
                stroke={glowColor}
                strokeWidth={strokeWidth * 4}
                strokeLinecap="round"
              />
              {/* Trait principal */}
              <path
                d={pathD}
                fill="none"
                stroke={arcColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray="none"
              />
              {/* Dot tête */}
              <circle
                cx={headPt[0]}
                cy={headPt[1]}
                r={strokeWidth * 2}
                fill={arcColor}
              />
              {/* Dot départ */}
              <circle
                cx={srcPx.x}
                cy={srcPx.y}
                r={strokeWidth * 1.5}
                fill={arcColor}
                opacity={0.7}
              />
              {/* Label source */}
              {src.label && progress > 0.15 && (
                <text
                  x={srcPx.x + 14}
                  y={srcPx.y - 10}
                  fontFamily={LABEL_FONT}
                  fontSize={18}
                  fill={arcColor}
                  opacity={Math.min(opacity, (progress - 0.15) / 0.15)}
                  style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  {src.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Dot destination — pulse quand actif */}
        {destActive && destR > 0 && (
          <g filter="url(#cf-glow)">
            <circle cx={dstPx.x} cy={dstPx.y} r={destR * 1.8} fill={destC} opacity={0.18} />
            <circle cx={dstPx.x} cy={dstPx.y} r={destR} fill={destC} opacity={0.7} />
            <circle cx={dstPx.x} cy={dstPx.y} r={4} fill="#fff" />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
