/**
 * AnimatedRouteOverlay — overlay SVG (PAS de map propre) : trace une route point-a-point
 * qui se DESSINE + marqueurs etapes + marqueur MOBILE (sprite avion / cargo / point) le long
 * du trace, par-dessus une carte Mapbox DEJA EXISTANTE (passee via `map`).
 *
 * Difference avec GeoFlowConnection : celui-ci NE cree PAS sa propre Map — il se branche sur
 * la Map continue d'un beat (ex: Beat4Geographie) via map.project() frame-driven. C'est la
 * mecanique de path animee, en brique additive. Headless-safe (halo opacite, pas de blur).
 *
 * Usage dans un beat avec une Map deja montee :
 *   <AnimatedRouteOverlay map={mapRef.current} frame={frame - START} waypoints={[...]}
 *     reveal={0..1} sprite="dot" accentColor="#c8a951" width={w} height={h} />
 *
 * Inspiration : mapanimation.io Silk Road (#96) + vol (#256). Voir
 * memory/_r-and-d-mapanimation-PREMIUM-DECODE.md.
 *
 * ⚠️ SPRITE & PITCH (NON-NEGOTIABLE) : eux sont en carte 2D PLATE (sprite top-view lisible).
 * Nous sommes souvent en pitch 28-38° (relief). Un sprite "top-view" (plane/cargo) sur une carte
 * INCLINEE est FAUX visuellement (ne colle pas a la perspective) et souvent ILLISIBLE a petite
 * taille (cf. rejet beat A5, 2026-06-03). N'utiliser sprite!="none" QUE si la camera est a plat
 * (pitch ~0) ET que la voix justifie l'objet ET qu'il est assez gros pour etre identifiable.
 * Par defaut, preferer sprite="dot" (point lumineux, neutre a tout angle) ou "none".
 */

import React from "react";
import mapboxgl from "mapbox-gl";

export interface RouteWaypoint {
  coord: [number, number];      // [lon, lat]
  label?: string;
  labelDx?: number;
  labelDy?: number;
}

export interface AnimatedRouteOverlayProps {
  map: mapboxgl.Map | null;
  frame: number;                // frame locale (depuis le debut de l'effet)
  waypoints: RouteWaypoint[];
  /** 0..1 — fraction de la route revelee (pilote par l'appelant via interpolate) */
  reveal: number;
  width: number;
  height: number;
  accentColor?: string;
  sprite?: "plane" | "cargo" | "dot" | "none";
  strokeWidth?: number;
  /** afficher les labels d'etape */
  showLabels?: boolean;
  /** opacite globale (pour fade in/out depuis l'appelant) */
  opacity?: number;
}

function smooth(pts: [number, number][], perSeg = 22): [number, number][] {
  if (pts.length < 3) return pts;
  const out: [number, number][] = [];
  const p = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    for (let j = 0; j < perSeg; j++) {
      const t = j / perSeg, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function cum(line: [number, number][]) {
  const c = [0]; let tot = 0;
  for (let i = 1; i < line.length; i++) { tot += Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]); c.push(tot); }
  return { c, tot };
}

function at(line: [number, number][], c: number[], d: number): { pt: [number, number]; ang: number } {
  if (d <= 0) return { pt: line[0], ang: ang(line, 0) };
  const last = c[c.length - 1];
  if (d >= last) return { pt: line[line.length - 1], ang: ang(line, line.length - 2) };
  let i = 1; while (i < c.length && c[i] < d) i++;
  const seg = c[i] - c[i - 1] || 1, t = (d - c[i - 1]) / seg, a = line[i - 1], b = line[i];
  return { pt: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], ang: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI };
}
function ang(line: [number, number][], i: number) {
  const a = line[Math.max(0, i)], b = line[Math.min(line.length - 1, i + 1)];
  return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
}
function partial(line: [number, number][], c: number[], rev: number): string {
  if (rev <= 0) return "";
  let d = `M ${line[0][0].toFixed(1)} ${line[0][1].toFixed(1)}`;
  for (let i = 1; i < line.length; i++) {
    if (c[i] <= rev) d += ` L ${line[i][0].toFixed(1)} ${line[i][1].toFixed(1)}`;
    else { const { pt } = at(line, c, rev); d += ` L ${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`; break; }
  }
  return d;
}

export const AnimatedRouteOverlay: React.FC<AnimatedRouteOverlayProps> = ({
  map, frame, waypoints, reveal, width, height,
  accentColor = "#c8a951", sprite = "dot", strokeWidth = 4,
  showLabels = true, opacity = 1,
}) => {
  if (!map || waypoints.length < 2) return null;

  let screen: [number, number][];
  try {
    screen = waypoints.map((w) => { const p = map.project(new mapboxgl.LngLat(w.coord[0], w.coord[1])); return [p.x, p.y]; });
  } catch { return null; }

  const line = smooth(screen, 22);
  const { c, tot } = cum(line);

  // distance de chaque waypoint sur la polyline
  const wpDist = screen.map((target) => {
    let best = Infinity, bd = 0;
    for (let i = 0; i < line.length; i++) { const dd = Math.hypot(line[i][0] - target[0], line[i][1] - target[1]); if (dd < best) { best = dd; bd = c[i]; } }
    return bd;
  });

  const revealDist = tot * Math.max(0, Math.min(1, reveal));
  const path = partial(line, c, revealDist);
  const head = at(line, c, revealDist);
  const dash = -(frame * 1.4) % 26;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}>
      {path && (
        <>
          <path d={path} fill="none" stroke={accentColor} strokeWidth={strokeWidth * 3.6} strokeLinecap="round" strokeLinejoin="round" opacity={0.13} />
          <path d={path} fill="none" stroke={accentColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
          <path d={path} fill="none" stroke="#fff6d8" strokeWidth={strokeWidth * 0.45} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 14" strokeDashoffset={dash} opacity={0.85} />
        </>
      )}

      {screen.map((p, i) => {
        if (revealDist < wpDist[i] - 2) return null;
        const r = strokeWidth * 1.6;
        return (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r={r * 2.4} fill={accentColor} opacity={0.16} />
            <circle cx={p[0]} cy={p[1]} r={r} fill={accentColor} />
            <circle cx={p[0]} cy={p[1]} r={r * 0.42} fill="#fff" />
            {showLabels && waypoints[i].label && (
              <text x={p[0] + (waypoints[i].labelDx ?? 12)} y={p[1] + (waypoints[i].labelDy ?? -12)}
                fontFamily="'IBM Plex Mono', monospace" fontSize={22} fontWeight={700}
                fill="#fdf3d4" stroke="#0b1322" strokeWidth={4} paintOrder="stroke"
                style={{ letterSpacing: "0.03em" }}>
                {waypoints[i].label}
              </text>
            )}
          </g>
        );
      })}

      {sprite !== "none" && revealDist > 1 && revealDist < tot - 1 && (
        <g transform={`translate(${head.pt[0]},${head.pt[1]})`}>
          {sprite === "dot" && (<><circle r={strokeWidth * 2.4} fill={accentColor} opacity={0.25} /><circle r={strokeWidth * 1.1} fill="#fff" /></>)}
          {sprite === "plane" && (
            <g transform={`rotate(${head.ang})`}>
              <circle r={16} fill={accentColor} opacity={0.18} />
              <path d="M 20 0 L -11 -10 L -4 0 L -11 10 Z" fill="#fff" stroke={accentColor} strokeWidth={2} strokeLinejoin="round" />
            </g>
          )}
          {sprite === "cargo" && (
            <g transform={`rotate(${head.ang})`}>
              <circle r={15} fill={accentColor} opacity={0.18} />
              {/* cargo stylise vu de dessus (coque + pont) */}
              <path d="M -14 -5 L 12 -5 L 18 0 L 12 5 L -14 5 Z" fill="#cfd6e0" stroke={accentColor} strokeWidth={1.5} strokeLinejoin="round" />
              <rect x={-8} y={-3} width={12} height={6} fill={accentColor} opacity={0.85} />
            </g>
          )}
        </g>
      )}
    </svg>
  );
};
