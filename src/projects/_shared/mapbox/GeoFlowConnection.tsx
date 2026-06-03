/**
 * GeoFlowConnection — V2 premium : une ROUTE sequentielle ville -> ville -> ville
 * qui se DESSINE progressivement sur une vraie carte Mapbox, avec marqueurs de ville,
 * labels, un SPRITE MOBILE (avion / caravane) qui court le long du trace et oriente sa
 * direction sur la tangente, et une CAMERA qui suit la tete du trace.
 *
 * Comble le gap "Flux inter-pays" du backlog CATALOGUE-CARTE-VIVANTE. Inspiration directe :
 * mapanimation.io "Silk Road Caravan" (golden dashed route + moving caravan + pan).
 *
 * Difference avec l'existant :
 *   - ConvergingFlows = multi-sources -> 1 destination (convergence), pas de sequence.
 *   - FlowArrowsMap   = SVG pur, PAS geo-attache a Mapbox (ne suit pas le drift/zoom).
 *   - AnimatedCaravan = POC hors-prod, pas de trace dashed dessine ni de city markers.
 * V2 fait l'enchainement COMPLET et reste headless-safe.
 *
 * Technique (frame-driven, headless-safe) :
 *   - Vraie carte Mapbox dessous (style dark, ocean navy, voisins ivory faible).
 *   - Waypoints [lon,lat] reprojetes CHAQUE frame via map.project() -> coords ecran.
 *   - Trace = polyline lissee (Catmull-Rom -> bezier) revelee par segment selon le frame.
 *   - Dash anime (dashoffset qui glisse) = sensation de flux le long du trace deja dessine.
 *   - City markers : pop ressort (spring) quand la tete atteint la ville + label.
 *   - Sprite mobile : position = point a t% du trace cumulatif ; rotation = tangente locale.
 *   - Camera : center interpole vers la ville active (camera-follow), drift+zoom doux.
 *   - PAS de filter:blur CSS. Halo = cercles d'opacite (rend en headless).
 *
 * Usage :
 *   <GeoFlowConnection
 *     title="THE SILK ROAD"
 *     waypoints={[{name:"Milan",coord:[9.19,45.46]}, ...]}
 *     accentColor="#e8c34a" sprite="plane"
 *     drawStartFrame={20} drawPerSegment={42} durationFrames={450} />
 *
 * IMPORTANT : render via scripts/render-mapbox.sh (WebGL headless).
 *
 * ⚠️ SPRITE & PITCH (NON-NEGOTIABLE) : le sprite "plane" (top-view) suppose une carte 2D PLATE
 * (pitch ~0), comme mapanimation.io. Sur une carte SOUVERAIN inclinee (pitch 28-38°), un sprite
 * top-view est FAUX et souvent illisible (cf. rejet beat A5, 2026-06-03). En contexte 3D/pitch,
 * utiliser sprite="dot" (neutre) ou sprite="none". Voir Playbook section 2bis (2D-plat vs 3D-pitch).
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { applyGeoAfriqueV5, MapboxBrandingHide } from "./MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#e8c34a";
const IVORY = "#f2ebd9";

export interface FlowWaypoint {
  name: string;
  coord: [number, number]; // [lon, lat]
  /** decalage du label : "auto" (defaut), ou positionnement manuel */
  labelDx?: number;
  labelDy?: number;
}

export interface GeoFlowConnectionProps {
  waypoints: FlowWaypoint[];
  title?: string;
  accentColor?: string;
  /** "plane"/"cargo" (icones directionnelles, top-view — voir avertissement pitch),
   *  "dot" (point lumineux, neutre à tout angle), "none". API alignée sur AnimatedRouteOverlay. */
  sprite?: "plane" | "cargo" | "dot" | "none";
  /** style Mapbox (defaut dark premium) */
  mapStyle?: string;
  /** frame ou le trace commence a se dessiner */
  drawStartFrame?: number;
  /** frames pour dessiner UN segment ville->ville */
  drawPerSegment?: number;
  /** zoom de la carte (auto-fit si non fourni) */
  zoom?: number;
  /** suit la tete du trace (camera-follow). Si false : vue fixe cadree sur tout */
  cameraFollow?: boolean;
  durationFrames?: number;
}

// ---------- geometrie ----------

// Catmull-Rom -> points lisses (echantillonnage dense) en coords ecran.
function smoothPolyline(pts: [number, number][], perSeg = 24): [number, number][] {
  if (pts.length < 3) return pts;
  const out: [number, number][] = [];
  const p = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    for (let j = 0; j < perSeg; j++) {
      const t = j / perSeg;
      const t2 = t * t, t3 = t2 * t;
      const x =
        0.5 *
        (2 * p1[0] +
          (-p0[0] + p2[0]) * t +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const y =
        0.5 *
        (2 * p1[1] +
          (-p0[1] + p2[1]) * t +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      out.push([x, y]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

// longueurs cumulees d'une polyline
function cumulativeLengths(line: [number, number][]): { total: number; cum: number[] } {
  const cum = [0];
  let total = 0;
  for (let i = 1; i < line.length; i++) {
    const dx = line[i][0] - line[i - 1][0];
    const dy = line[i][1] - line[i - 1][1];
    total += Math.hypot(dx, dy);
    cum.push(total);
  }
  return { total, cum };
}

// point + angle (deg) a la distance `d` le long de la polyline
function pointAtLength(
  line: [number, number][],
  cum: number[],
  d: number
): { pt: [number, number]; angle: number } {
  if (d <= 0) return { pt: line[0], angle: segAngle(line, 0) };
  const last = cum[cum.length - 1];
  if (d >= last) return { pt: line[line.length - 1], angle: segAngle(line, line.length - 2) };
  let i = 1;
  while (i < cum.length && cum[i] < d) i++;
  const seg = cum[i] - cum[i - 1] || 1;
  const t = (d - cum[i - 1]) / seg;
  const a = line[i - 1], b = line[i];
  return {
    pt: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t],
    angle: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI,
  };
}

function segAngle(line: [number, number][], i: number): number {
  const a = line[Math.max(0, i)], b = line[Math.min(line.length - 1, i + 1)];
  return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
}

// path "M x y L ..." jusqu'a la distance revelee
function partialPath(line: [number, number][], cum: number[], reveal: number): string {
  if (reveal <= 0) return "";
  let d = `M ${line[0][0].toFixed(1)} ${line[0][1].toFixed(1)}`;
  for (let i = 1; i < line.length; i++) {
    if (cum[i] <= reveal) {
      d += ` L ${line[i][0].toFixed(1)} ${line[i][1].toFixed(1)}`;
    } else {
      const { pt } = pointAtLength(line, cum, reveal);
      d += ` L ${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`;
      break;
    }
  }
  return d;
}

// ---------- composant ----------

export const GeoFlowConnection: React.FC<GeoFlowConnectionProps> = ({
  waypoints,
  title,
  accentColor = GOLD,
  sprite = "plane",
  mapStyle = "mapbox://styles/mapbox/dark-v11",
  drawStartFrame = 20,
  drawPerSegment = 42,
  zoom,
  cameraFollow = true,
  durationFrames = 450,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("GeoFlow init"));
  const [ready, setReady] = useState(false);
  const [, force] = useState(0);

  // auto-fit center/zoom a partir des waypoints
  const lons = waypoints.map((w) => w.coord[0]);
  const lats = waypoints.map((w) => w.coord[1]);
  const fitCenter: [number, number] = [
    (Math.min(...lons) + Math.max(...lons)) / 2,
    (Math.min(...lats) + Math.max(...lats)) / 2,
  ];
  const spanLon = Math.max(...lons) - Math.min(...lons);
  const autoZoom = spanLon > 60 ? 2.2 : spanLon > 30 ? 3 : spanLon > 12 ? 4.2 : 5.2;
  const baseZoom = (zoom ?? autoZoom) + (isVertical ? 0.3 : 0);

  // ---- progression du trace ----
  const totalSegs = Math.max(1, waypoints.length - 1);
  const headProgress = interpolate(
    frame,
    [drawStartFrame, drawStartFrame + drawPerSegment * totalSegs],
    [0, totalSegs],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ); // 0..totalSegs (index fractionnaire du waypoint atteint)
  const activeWp = Math.min(waypoints.length - 1, Math.floor(headProgress) + 1);

  // ---- init map ----
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: fitCenter,
      zoom: baseZoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;
    map.on("style.load", () => {
      try {
        (map as mapboxgl.Map & { setProjection?: (p: string) => void }).setProjection?.(
          "mercator"
        );
      } catch {}
      applyGeoAfriqueV5(map);
      // assombrir fortement l'eau / fond / terre pour un rendu dramatique (contraste trace dore)
      try {
        if (map.getLayer("water")) map.setPaintProperty("water", "fill-color", "#070b14");
        if (map.getLayer("background"))
          map.setPaintProperty("background", "background-color", "#0a0d15");
        // assombrir la terre (land/landcover) si presente
        for (const lid of ["land", "landcover", "landuse"]) {
          if (map.getLayer(lid)) {
            try { map.setPaintProperty(lid, "fill-color", "#1b1f28"); } catch {}
            try { map.setPaintProperty(lid, "background-color", "#1b1f28"); } catch {}
          }
        }
      } catch {}
      setReady(true);
      continueRender(handle);
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- camera follow + drift (frame-driven) ----
  // ⚠️ DÉSYNC 1 FRAME (audit 06-03) : jumpTo est appliqué ici dans un useEffect[frame],
  // donc la reprojection map.project() du corps (screenPts) utilise la transform de la
  // frame AVANT ce jumpTo. force((n)=>n+1) déclenche un 2e render dans le même tick pour
  // rattraper. En render headless (frames isolées) ce double-render fonctionne en pratique
  // (jumpTo est SYNCHRONE, pas d'animation), MAIS si un désalignement tracé/carte d'1 frame
  // apparaît sur un drift+zoom rapide, c'est ICI qu'il faut regarder (appliquer la caméra
  // de façon synchrone avant la projection, ou valider l'absence de lag à pleine échelle).
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    let center = fitCenter;
    const drawEndFrame = drawStartFrame + drawPerSegment * totalSegs;
    // dezoom UNIQUEMENT sur les ~20% finaux (apres que le trace soit complet)
    const endBlend = interpolate(
      frame,
      [drawEndFrame, drawEndFrame + (durationFrames - drawEndFrame) * 0.6],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    if (cameraFollow && waypoints.length > 1) {
      // center interpole le long des waypoints selon headProgress (reste serre sur la tete)
      const i = Math.min(waypoints.length - 2, Math.floor(headProgress));
      const t = headProgress - i;
      const a = waypoints[i].coord;
      const b = waypoints[Math.min(waypoints.length - 1, i + 1)].coord;
      const follow: [number, number] = [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
      ];
      center = [
        follow[0] + (fitCenter[0] - follow[0]) * endBlend,
        follow[1] + (fitCenter[1] - follow[1]) * endBlend,
      ];
    }
    const driftBearing = interpolate(frame, [0, durationFrames], [-1.2, 1.2]);
    // serre pendant le trace, dezoom vers la vue d'ensemble a la fin
    const followZoom = cameraFollow ? baseZoom + 1.8 : baseZoom;
    const endZoom = followZoom + (baseZoom - followZoom) * endBlend;
    map.jumpTo({
      center,
      zoom: cameraFollow ? endZoom : baseZoom,
      bearing: driftBearing,
      pitch: 0,
    });
    force((n) => n + 1); // re-render overlay apres reprojection
  }, [
    ready,
    frame,
    headProgress,
    cameraFollow,
    baseZoom,
    durationFrames,
    drawStartFrame,
    drawPerSegment,
    totalSegs,
    // fitCenter/waypoints stables
  ]);

  // ---- projeter les waypoints en coords ecran ----
  const map = mapRef.current;
  const screenPts: [number, number][] =
    ready && map
      ? waypoints.map((w) => {
          const p = map.project(new mapboxgl.LngLat(w.coord[0], w.coord[1]));
          return [p.x, p.y];
        })
      : [];

  // polyline lissee + longueurs
  const line = screenPts.length >= 2 ? smoothPolyline(screenPts, 26) : screenPts;
  const { total, cum } = line.length >= 2 ? cumulativeLengths(line) : { total: 0, cum: [0] };

  // distance revelee = fraction de longueur correspondant a headProgress
  // (on mappe l'index fractionnaire de waypoint sur la longueur via les marqueurs de segment)
  const segMarkers: number[] = [0]; // distance cumulee a chaque waypoint
  if (line.length >= 2 && screenPts.length >= 2) {
    // retrouver la distance ou la polyline passe au plus pres de chaque waypoint
    for (let w = 1; w < screenPts.length; w++) {
      const target = screenPts[w];
      let best = Infinity, bestD = 0;
      for (let i = 0; i < line.length; i++) {
        const dd = Math.hypot(line[i][0] - target[0], line[i][1] - target[1]);
        if (dd < best) { best = dd; bestD = cum[i]; }
      }
      segMarkers.push(bestD);
    }
  }
  const lo = Math.floor(headProgress);
  const frac = headProgress - lo;
  const revealDist =
    segMarkers.length > 1
      ? (segMarkers[Math.min(lo, segMarkers.length - 1)] ?? 0) +
        ((segMarkers[Math.min(lo + 1, segMarkers.length - 1)] ?? total) -
          (segMarkers[Math.min(lo, segMarkers.length - 1)] ?? 0)) *
          frac
      : 0;

  const drawnPath = line.length >= 2 ? partialPath(line, cum, revealDist) : "";

  // sprite (tete mobile) position + angle
  const head = line.length >= 2 ? pointAtLength(line, cum, revealDist) : null;

  // dash anime (flux qui glisse sur le trace deja dessine)
  const dashShift = -(frame * 1.4) % 28;

  const W = width, H = height;

  return (
    <AbsoluteFill style={{ backgroundColor: "#10141d" }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
      <MapboxBrandingHide />

      {/* vignette douce pour ancrer le regard au centre */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {ready && line.length >= 2 && (
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          preserveAspectRatio="none"
        >
          {/* halo externe large (opacite, pas de blur CSS) */}
          {drawnPath && (
            <path
              d={drawnPath}
              fill="none"
              stroke={accentColor}
              strokeWidth={18}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.12}
            />
          )}
          {/* halo interne */}
          {drawnPath && (
            <path
              d={drawnPath}
              fill="none"
              stroke={accentColor}
              strokeWidth={9}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.28}
            />
          )}
          {/* trace continu lumineux (base) */}
          {drawnPath && (
            <path
              d={drawnPath}
              fill="none"
              stroke={accentColor}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.95}
            />
          )}
          {/* dash clair anime par-dessus (flux qui glisse) */}
          {drawnPath && (
            <path
              d={drawnPath}
              fill="none"
              stroke="#fff6d8"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 16"
              strokeDashoffset={dashShift}
              opacity={0.9}
            />
          )}

          {/* city markers + labels (pop quand la tete depasse le waypoint) */}
          {screenPts.map((p, i) => {
            const reached = revealDist >= (segMarkers[i] ?? 0) - 2;
            if (!reached) return null;
            // frame d'apparition approx = quand headProgress atteint i
            const appearFrame = drawStartFrame + drawPerSegment * Math.max(0, i);
            const pop = spring({
              frame: frame - appearFrame,
              fps,
              config: { damping: 12, stiffness: 180, mass: 0.6 },
            });
            const r = 7.5 * pop;
            const dx = waypoints[i].labelDx ?? 12;
            const dy = waypoints[i].labelDy ?? -14;
            return (
              <g key={i} opacity={Math.min(1, pop * 1.2)}>
                <circle cx={p[0]} cy={p[1]} r={r * 2.6} fill={accentColor} opacity={0.16} />
                <circle cx={p[0]} cy={p[1]} r={r} fill={accentColor} />
                <circle cx={p[0]} cy={p[1]} r={r * 0.42} fill="#fff" />
                <text
                  x={p[0] + dx}
                  y={p[1] + dy}
                  fontFamily="'IBM Plex Mono', monospace"
                  fontSize={isVertical ? 26 : 22}
                  fontWeight={700}
                  fill="#fdf3d4"
                  stroke="#070b14"
                  strokeWidth={4}
                  paintOrder="stroke"
                  style={{ letterSpacing: "0.03em" }}
                >
                  {waypoints[i].name}
                </text>
              </g>
            );
          })}

          {/* sprite mobile (avion oriente sur la tangente / point lumineux) */}
          {head && sprite !== "none" && revealDist > 1 && revealDist < total - 1 && (
            <g transform={`translate(${head.pt[0]},${head.pt[1]})`}>
              {sprite === "dot" && (
                <>
                  <circle r={11} fill={accentColor} opacity={0.22} />
                  <circle r={5} fill="#fff" />
                </>
              )}
              {sprite === "plane" && (
                <g transform={`rotate(${head.angle})`}>
                  {/* halo lumineux */}
                  <circle r={20} fill={accentColor} opacity={0.16} />
                  <circle r={11} fill={accentColor} opacity={0.28} />
                  {/* avion stylise pointant vers +x (sens du trace) — plus gros */}
                  <path
                    d="M 22 0 L -12 -11 L -5 0 L -12 11 Z"
                    fill="#fff"
                    stroke={accentColor}
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                </g>
              )}
              {sprite === "cargo" && (
                <g transform={`rotate(${head.angle})`}>
                  <circle r={18} fill={accentColor} opacity={0.16} />
                  {/* cargo stylise vu de dessus (coque + pont) */}
                  <path
                    d="M -16 -6 L 14 -6 L 21 0 L 14 6 L -16 6 Z"
                    fill="#cfd6e0"
                    stroke={accentColor}
                    strokeWidth={1.8}
                    strokeLinejoin="round"
                  />
                  <rect x={-9} y={-3.5} width={14} height={7} fill={accentColor} opacity={0.85} />
                </g>
              )}
            </g>
          )}
        </svg>
      )}

      {/* titre */}
      {title && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: isVertical ? "10%" : "8%",
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: isVertical ? 54 : 46,
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: accentColor,
              opacity: interpolate(frame, [0, 18], [0, 0.85], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              textShadow: "0 2px 18px rgba(0,0,0,0.6)",
            }}
          >
            {title}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
