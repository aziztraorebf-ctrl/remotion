import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide, removeLabels, type CamState } from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const MAPBOX_ANIMATIONS_FRAMES = 900; // 30s @ 30fps

// 6 effets x 5s chacun
const SEG = {
  PULSE:      { start: 0,   end: 150, label: "PULSE RADAR",       desc: "Ondes concentriques depuis point géo" },
  ROUTE:      { start: 150, end: 300, label: "TRACÉ PROGRESSIF",  desc: "Route qui se dessine point par point" },
  FLECHES:    { start: 300, end: 450, label: "FLÈCHES FLUX",      desc: "Direction animée sur ligne" },
  KEN_BURNS:  { start: 450, end: 600, label: "KEN BURNS",         desc: "Zoom très lent + pan imperceptible" },
  PARTICULES: { start: 600, end: 750, label: "PARTICULES",        desc: "Points lumineux dérivants — flux" },
  HEATMAP:    { start: 750, end: 900, label: "HEATMAP",           desc: "Densité colorée par zone" },
};

// Caméras
const CAM_SAHEL: CamState   = { lon: -2.0,  lat: 14.0, zoom: 3.8, pitch: 15, bearing: 0 };
const CAM_ROUTE: CamState   = { lon:  0.0,  lat: 16.0, zoom: 3.6, pitch: 20, bearing: 0 };
const CAM_KB_A: CamState    = { lon: -3.0,  lat: 13.0, zoom: 3.4, pitch: 10, bearing: 0 };
const CAM_KB_B: CamState    = { lon: -1.0,  lat: 14.5, zoom: 4.2, pitch: 20, bearing: 8 };
const CAM_HEATMAP: CamState = { lon:  1.0,  lat: 12.0, zoom: 3.5, pitch: 0,  bearing: 0 };

// Route Trans-Saharienne simplifiee (Dakar → Tombouctou → Agadez)
const ROUTE_COORDS: [number, number][] = [
  [-17.4, 14.7], // Dakar
  [-14.5, 14.5], // Kaolack
  [-11.4, 14.1], // Tambacounda
  [ -7.0, 14.5], // Bamako zone
  [ -3.0, 15.5], // Segou zone
  [ -3.0, 16.8], // Mopti
  [ -3.0, 16.8], // Tombouctou approche
  [ -3.0, 16.77],// Tombouctou
  [  1.0, 16.9], // Gao
  [  7.9, 16.9], // Agadez
];

// Points heatmap (villes Sahel densité simulée)
const HEATMAP_POINTS = [
  { lon: -17.4, lat: 14.7, weight: 1.0 },  // Dakar
  { lon:  -3.0, lat: 16.8, weight: 0.9 },  // Tombouctou
  { lon:  -8.0, lat: 12.4, weight: 0.85 }, // Conakry
  { lon:  -1.7, lat: 12.4, weight: 0.8 },  // Ouagadougou
  { lon:   7.9, lat: 16.9, weight: 0.75 }, // Agadez
  { lon:   2.1, lat: 13.5, weight: 0.7 },  // Niamey
  { lon: -13.7, lat: 9.5,  weight: 0.65 }, // Conakry
  { lon:  -0.2, lat:  5.6, weight: 0.9 },  // Accra
  { lon:   3.4, lat:  6.5, weight: 0.95 }, // Lagos
  { lon: -16.5, lat: 13.5, weight: 0.6 },  // Banjul
];

// Easing quadratique
const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const lerp  = (a: number, b: number, t: number) => a + (b - a) * ease(Math.max(0, Math.min(1, t)));

// ---------------------------------------------------------------------------
// Badge nom effet
// ---------------------------------------------------------------------------
const Badge: React.FC<{ label: string; desc: string; opacity: number }> = ({ label, desc, opacity }) => (
  <div style={{
    position: "absolute", top: 50, left: 0, right: 0,
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    opacity, pointerEvents: "none",
  }}>
    <div style={{
      background: "rgba(26,18,9,0.75)", padding: "6px 22px", borderRadius: 4,
      fontFamily: "Georgia, serif", fontSize: 13, letterSpacing: 3,
      color: "#D4AF37", fontWeight: 700,
    }}>{label}</div>
    <div style={{
      fontFamily: "Georgia, serif", fontSize: 10, letterSpacing: 1.5,
      color: "#ffffff", opacity: 0.6,
    }}>{desc}</div>
  </div>
);

// ---------------------------------------------------------------------------
// SVG overlay — Pulse radar (Remotion, independant de Mapbox)
// ---------------------------------------------------------------------------
const PulseOverlay: React.FC<{ frame: number; opacity: number; cx: number; cy: number }> = ({
  frame, opacity, cx, cy,
}) => {
  const waves = [0, 25, 50].map((offset) => {
    const cycle = ((frame + offset) % 75) / 75;
    const r = 8 + cycle * 55;
    const waveOp = (1 - cycle) * 0.7;
    return { r, waveOp };
  });
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      width="100%" height="100%">
      {waves.map(({ r, waveOp }, i) => (
        <circle key={i} cx={cx} cy={cy} r={r}
          fill="none" stroke="#D4AF37" strokeWidth={1.5}
          opacity={opacity * waveOp} />
      ))}
      <circle cx={cx} cy={cy} r={8} fill="#D4AF37" opacity={opacity * 0.9} />
      <circle cx={cx} cy={cy} r={3} fill="#1a1209" opacity={opacity} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// SVG overlay — Tracé progressif route
// ---------------------------------------------------------------------------
const RouteOverlay: React.FC<{
  progress: number; opacity: number;
  coords: [number, number][]; map: mapboxgl.Map | null;
}> = ({ progress, opacity, coords, map }) => {
  if (!map) return null;

  const totalSegs = coords.length - 1;
  const drawn = progress * totalSegs;
  const fullSegs = Math.floor(drawn);
  const partial = drawn - fullSegs;

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= fullSegs && i < coords.length; i++) {
    const p = map.project(coords[i]);
    points.push({ x: p.x, y: p.y });
  }
  if (fullSegs < totalSegs) {
    const a = coords[fullSegs];
    const b = coords[fullSegs + 1];
    const px = map.project([a[0] + (b[0] - a[0]) * partial, a[1] + (b[1] - a[1]) * partial]);
    points.push({ x: px.x, y: px.y });
  }

  if (points.length < 2) return null;
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Tête de fleche a la position actuelle
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const angle = Math.atan2(last.y - prev.y, last.x - prev.x) * (180 / Math.PI);

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      width="100%" height="100%">
      {/* Halo */}
      <path d={d} fill="none" stroke="#D4AF37" strokeWidth={5} opacity={opacity * 0.15} strokeLinecap="round" />
      {/* Ligne principale */}
      <path d={d} fill="none" stroke="#D4AF37" strokeWidth={2} opacity={opacity * 0.9}
        strokeLinecap="round" strokeLinejoin="round" />
      {/* Tete de fleche */}
      <g transform={`translate(${last.x}, ${last.y}) rotate(${angle})`} opacity={opacity}>
        <polygon points="0,0 -10,-5 -10,5" fill="#D4AF37" />
      </g>
      {/* Point depart */}
      <circle cx={points[0].x} cy={points[0].y} r={5} fill="#D4AF37" opacity={opacity} />
      {/* Label depart */}
      <text x={points[0].x + 10} y={points[0].y - 8}
        fill="#D4AF37" fontSize={10} fontFamily="Georgia, serif" letterSpacing={1}
        opacity={opacity * 0.9}>DAKAR</text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// SVG overlay — Fleches flux (segments animes)
// ---------------------------------------------------------------------------
const FlechesOverlay: React.FC<{
  frame: number; opacity: number; map: mapboxgl.Map | null;
}> = ({ frame, opacity, map }) => {
  if (!map) return null;

  const FLUX = [
    { from: [-17.4, 14.7] as [number, number], to: [-3.0, 16.8] as [number, number], color: "#D4AF37", phase: 0 },
    { from: [7.9, 16.9]   as [number, number], to: [-3.0, 16.8] as [number, number], color: "#E8A020", phase: 20 },
    { from: [-1.7, 12.4]  as [number, number], to: [-3.0, 16.8] as [number, number], color: "#C4A35A", phase: 40 },
  ];

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      width="100%" height="100%">
      {FLUX.map(({ from, to, color, phase }, fi) => {
        const pFrom = map.project(from);
        const pTo   = map.project(to);
        const dx = pTo.x - pFrom.x;
        const dy = pTo.y - pFrom.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Tirets animes — offset qui avance dans le temps
        const dashOffset = -((frame + phase) % 30) * 2;

        return (
          <g key={fi} opacity={opacity}>
            {/* Ligne pointillee animee */}
            <line
              x1={pFrom.x} y1={pFrom.y} x2={pTo.x} y2={pTo.y}
              stroke={color} strokeWidth={2} strokeDasharray="8 6"
              strokeDashoffset={dashOffset} opacity={0.85}
            />
            {/* Fleche terminus */}
            <g transform={`translate(${pTo.x}, ${pTo.y}) rotate(${angle})`}>
              <polygon points="0,0 -12,-5 -12,5" fill={color} opacity={0.9} />
            </g>
            {/* Point origine */}
            <circle cx={pFrom.x} cy={pFrom.y} r={4} fill={color} opacity={0.8} />
          </g>
        );
      })}
      {/* Label Tombouctou — noeud central */}
      {(() => {
        const p = map.project([-3.0, 16.8]);
        return (
          <g opacity={opacity}>
            <circle cx={p.x} cy={p.y} r={7} fill="#D4AF37" opacity={0.9} />
            <text x={p.x + 12} y={p.y + 4}
              fill="#D4AF37" fontSize={10} fontFamily="Georgia, serif" letterSpacing={1}
              opacity={0.9}>TOMBOUCTOU</text>
          </g>
        );
      })()}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// SVG overlay — Particules (points qui derivent)
// ---------------------------------------------------------------------------
const PARTICLE_COUNT = 40;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  startLon: -18 + Math.sin(i * 2.3) * 20,
  startLat: 8  + Math.cos(i * 1.7) * 10,
  speedLon: 0.015 + (i % 5) * 0.004,
  speedLat: 0.008 + (i % 3) * 0.003,
  size: 1.5 + (i % 4) * 0.8,
  opacity: 0.3 + (i % 5) * 0.12,
  color: i % 3 === 0 ? "#D4AF37" : i % 3 === 1 ? "#E8A020" : "#ffffff",
}));

const ParticlesOverlay: React.FC<{
  frame: number; opacity: number; map: mapboxgl.Map | null;
}> = ({ frame, opacity, map }) => {
  if (!map) return null;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      width="100%" height="100%">
      {PARTICLES.map((p) => {
        const lon = p.startLon + (frame * p.speedLon) % 22;
        const lat = p.startLat + Math.sin(frame * 0.02 + p.id) * 0.8;
        const proj = map.project([lon, lat]);
        const pulse = 0.6 + Math.sin(frame * 0.1 + p.id * 0.7) * 0.4;
        return (
          <circle key={p.id}
            cx={proj.x} cy={proj.y}
            r={p.size * pulse}
            fill={p.color}
            opacity={opacity * p.opacity * pulse}
          />
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Composition principale
// ---------------------------------------------------------------------------
export const MapboxAnimations: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-animations"));
  const [ready, setReady] = useState(false);
  const [mapTick, setMapTick] = useState(0);

  const currentSeg = Object.values(SEG).find((s) => frame >= s.start && frame < s.end) ?? SEG.PULSE;

  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM_SAHEL.lon, CAM_SAHEL.lat],
      zoom: CAM_SAHEL.zoom,
      pitch: CAM_SAHEL.pitch,
      bearing: CAM_SAHEL.bearing,
      interactive: false,
      preserveDrawingBuffer: true,
    });
    map.on("style.load", () => {
      removeLabels(map);
      mapRef.current = map;
      setReady(true);
      continueRender(handle);
    });
    map.on("render", () => setMapTick((t) => t + 1));
    return () => map.remove();
  }, []);

  // Mise a jour camera selon segment
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (frame >= SEG.KEN_BURNS.start && frame < SEG.KEN_BURNS.end) {
      const t = (frame - SEG.KEN_BURNS.start) / (SEG.KEN_BURNS.end - SEG.KEN_BURNS.start);
      map.jumpTo({
        center: [lerp(CAM_KB_A.lon, CAM_KB_B.lon, t), lerp(CAM_KB_A.lat, CAM_KB_B.lat, t)],
        zoom:    lerp(CAM_KB_A.zoom, CAM_KB_B.zoom, t),
        pitch:   lerp(CAM_KB_A.pitch, CAM_KB_B.pitch, t),
        bearing: lerp(CAM_KB_A.bearing, CAM_KB_B.bearing, t),
      });
    } else if (frame >= SEG.HEATMAP.start) {
      map.jumpTo({ center: [CAM_HEATMAP.lon, CAM_HEATMAP.lat], zoom: CAM_HEATMAP.zoom, pitch: CAM_HEATMAP.pitch, bearing: CAM_HEATMAP.bearing });
    } else if (frame >= SEG.ROUTE.start) {
      map.jumpTo({ center: [CAM_ROUTE.lon, CAM_ROUTE.lat], zoom: CAM_ROUTE.zoom, pitch: CAM_ROUTE.pitch, bearing: CAM_ROUTE.bearing });
    } else {
      map.jumpTo({ center: [CAM_SAHEL.lon, CAM_SAHEL.lat], zoom: CAM_SAHEL.zoom, pitch: CAM_SAHEL.pitch, bearing: CAM_SAHEL.bearing });
    }
  }, [frame]);

  // Heatmap — ajouter/retirer source+layer selon segment
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const isHeatmap = frame >= SEG.HEATMAP.start && frame < SEG.HEATMAP.end;

    if (isHeatmap && !map.getSource("heatmap-source")) {
      map.addSource("heatmap-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: HEATMAP_POINTS.map((p) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [p.lon, p.lat] },
            properties: { weight: p.weight },
          })),
        },
      });
      map.addLayer({
        id: "heatmap-layer",
        type: "heatmap",
        source: "heatmap-source",
        paint: {
          "heatmap-weight": ["interpolate", ["linear"], ["get", "weight"], 0, 0, 1, 1],
          "heatmap-intensity": 1.2,
          "heatmap-radius": 40,
          "heatmap-opacity": 0.75,
          "heatmap-color": [
            "interpolate", ["linear"], ["heatmap-density"],
            0,   "rgba(0,0,0,0)",
            0.2, "rgba(212,175,55,0.4)",
            0.5, "rgba(232,160,32,0.7)",
            0.8, "rgba(200,100,20,0.85)",
            1.0, "rgba(180,40,10,1)",
          ],
        },
      });
    }
    if (!isHeatmap) {
      if (map.getLayer("heatmap-layer")) map.removeLayer("heatmap-layer");
      if (map.getSource("heatmap-source")) map.removeSource("heatmap-source");
    }
  }, [ready, frame >= SEG.HEATMAP.start]);

  // Projections pour overlays SVG
  const pulsePt  = mapRef.current ? mapRef.current.project([-3.0, 16.8]) : { x: 0, y: 0 };

  // Opacite par segment
  const segOp = (s: typeof SEG.PULSE) =>
    interpolate(frame, [s.start, s.start + 15, s.end - 15, s.end], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  const pulseOp     = segOp(SEG.PULSE);
  const routeOp     = segOp(SEG.ROUTE);
  const flechesOp   = segOp(SEG.FLECHES);
  const kbOp        = segOp(SEG.KEN_BURNS);
  const particlesOp = segOp(SEG.PARTICULES);

  const routeProgress = interpolate(frame, [SEG.ROUTE.start, SEG.ROUTE.end - 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#e8e4dc" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />

      {ready && (
        <>
          {frame >= SEG.PULSE.start     && frame < SEG.PULSE.end     && (
            <PulseOverlay frame={frame} opacity={pulseOp} cx={pulsePt.x} cy={pulsePt.y} />
          )}
          {frame >= SEG.ROUTE.start     && frame < SEG.ROUTE.end     && (
            <RouteOverlay progress={routeProgress} opacity={routeOp} coords={ROUTE_COORDS} map={mapRef.current} />
          )}
          {frame >= SEG.FLECHES.start   && frame < SEG.FLECHES.end   && (
            <FlechesOverlay frame={frame} opacity={flechesOp} map={mapRef.current} />
          )}
          {frame >= SEG.PARTICULES.start && frame < SEG.PARTICULES.end && (
            <ParticlesOverlay frame={frame} opacity={particlesOp} map={mapRef.current} />
          )}
          {frame >= SEG.KEN_BURNS.start  && frame < SEG.KEN_BURNS.end  && (
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "rgba(0,0,0,0)", opacity: kbOp,
            }} />
          )}
        </>
      )}

      <Badge label={currentSeg.label} desc={currentSeg.desc}
        opacity={interpolate(frame, [currentSeg.start, currentSeg.start + 15], [0, 1], { extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};
