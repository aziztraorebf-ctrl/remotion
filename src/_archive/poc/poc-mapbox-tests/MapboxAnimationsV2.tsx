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

export const MAPBOX_ANIMATIONS_V2_FRAMES = 960; // 32s @ 30fps

const SEG = {
  PULSE:      { start: 0,   end: 160, label: "PULSE RADAR V2",      desc: "Ondes couleur intensité + label pulsant" },
  ROUTE:      { start: 160, end: 330, label: "TRACÉ PROGRESSIF V2", desc: "Étapes nommées + ombre + vitesse variable" },
  FLECHES:    { start: 330, end: 510, label: "FLÈCHES FLUX V2",     desc: "Arcs courbés + labels quantifiés" },
  KEN_BURNS:  { start: 510, end: 660, label: "KEN BURNS V2",        desc: "Satellite → Dark en mid-zoom" },
  PARTICULES: { start: 660, end: 810, label: "PARTICULES V2",       desc: "Flux dirigé + traîne lumineuse" },
  HEATMAP:    { start: 810, end: 960, label: "HEATMAP V2",          desc: "Respiration + isochrones animés" },
};

// Caméras
const CAM_PULSE:    CamState = { lon: -3.0,  lat: 16.8, zoom: 5.5, pitch: 20, bearing: 0  };
const CAM_ROUTE:    CamState = { lon: -3.0,  lat: 15.5, zoom: 3.4, pitch: 25, bearing: 0  };
const CAM_FLECHES:  CamState = { lon: -3.0,  lat: 15.0, zoom: 3.5, pitch: 20, bearing: 0  };
const CAM_KB_A:     CamState = { lon: -5.0,  lat: 15.0, zoom: 2.5, pitch: 0,  bearing: 0  };
const CAM_KB_B:     CamState = { lon: -3.5,  lat: 14.5, zoom: 4.5, pitch: 35, bearing: 0  };
const CAM_KB_C:     CamState = { lon: -2.0,  lat: 16.0, zoom: 6.0, pitch: 55, bearing: 10 };
const CAM_PART:     CamState = { lon: -3.0,  lat: 15.5, zoom: 3.4, pitch: 20, bearing: 0  };
const CAM_HEAT:     CamState = { lon: -2.0,  lat: 13.5, zoom: 3.6, pitch: 0,  bearing: 0  };

const ROUTE_COORDS: [number, number][] = [
  [-17.4, 14.7],
  [-11.4, 14.1],
  [ -7.0, 14.5],
  [ -3.0, 16.8],
  [  1.0, 16.9],
  [  7.9, 16.9],
];
const ROUTE_LABELS = ["DAKAR", "TAMBACOUNDA", "BAMAKO", "TOMBOUCTOU", "GAO", "AGADEZ"];

const HEATMAP_POINTS = [
  { lon: -17.4, lat: 14.7, weight: 1.0 },
  { lon:  -3.0, lat: 16.8, weight: 0.9 },
  { lon:  -1.7, lat: 12.4, weight: 0.8 },
  { lon:   7.9, lat: 16.9, weight: 0.75 },
  { lon:   2.1, lat: 13.5, weight: 0.7 },
  { lon:  -0.2, lat:  5.6, weight: 0.9 },
  { lon:   3.4, lat:  6.5, weight: 0.95 },
];

const easeQ = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const lerp  = (a: number, b: number, t: number) => a + (b - a) * easeQ(Math.max(0, Math.min(1, t)));
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const segOp = (frame: number, s: { start: number; end: number }) =>
  interpolate(frame, [s.start, s.start + 15, s.end - 15, s.end], [0, 1, 1, 0], { extrapolateRight: "clamp" });

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
const Badge: React.FC<{ label: string; desc: string; opacity: number }> = ({ label, desc, opacity }) => (
  <div style={{ position: "absolute", top: 50, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity, pointerEvents: "none" }}>
    <div style={{ background: "rgba(26,18,9,0.78)", padding: "6px 22px", borderRadius: 4, fontFamily: "Georgia, serif", fontSize: 13, letterSpacing: 3, color: "#D4AF37", fontWeight: 700 }}>{label}</div>
    <div style={{ fontFamily: "Georgia, serif", fontSize: 10, letterSpacing: 1.5, color: "#555", opacity: 0.8 }}>{desc}</div>
  </div>
);

// ---------------------------------------------------------------------------
// PULSE V2 — couleurs par intensité + label pulsant + point central animé
// ---------------------------------------------------------------------------
const PulseV2: React.FC<{ frame: number; op: number; map: mapboxgl.Map | null }> = ({ frame, op, map }) => {
  if (!map) return null;
  const pt = map.project([-3.0, 16.8]);

  const WAVES = [
    { offset: 0,  colorInner: "#FF4500", colorOuter: "#FF450000", maxR: 60 },
    { offset: 25, colorInner: "#E8A020", colorOuter: "#E8A02000", maxR: 70 },
    { offset: 50, colorInner: "#D4AF37", colorOuter: "#D4AF3700", maxR: 80 },
  ];

  const pulse = 0.85 + Math.sin(frame * 0.18) * 0.15;
  const labelOp = clamp(Math.sin((frame % 75) / 75 * Math.PI) * 1.5, 0, 1);

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }} width="100%" height="100%">
      {WAVES.map(({ offset, colorInner, maxR }, i) => {
        const cycle = ((frame + offset) % 75) / 75;
        const r = 10 + cycle * maxR;
        const wOp = (1 - cycle) * 0.75 * op;
        return <circle key={i} cx={pt.x} cy={pt.y} r={r} fill="none" stroke={colorInner} strokeWidth={2} opacity={wOp} />;
      })}
      {/* Anneau statique */}
      <circle cx={pt.x} cy={pt.y} r={14} fill="none" stroke="#D4AF37" strokeWidth={1.5} opacity={op * 0.6} />
      {/* Point central pulsant */}
      <circle cx={pt.x} cy={pt.y} r={8 * pulse} fill="#FF4500" opacity={op * 0.95} />
      <circle cx={pt.x} cy={pt.y} r={3} fill="#1a1209" opacity={op} />
      {/* Label pulsant */}
      <text x={pt.x} y={pt.y - 28} textAnchor="middle" fill="#D4AF37" fontSize={12} fontFamily="Georgia, serif" fontWeight="700" letterSpacing={2} opacity={op * labelOp}>TOMBOUCTOU</text>
      <text x={pt.x} y={pt.y - 14} textAnchor="middle" fill="#888" fontSize={9} fontFamily="Georgia, serif" letterSpacing={1} opacity={op * labelOp * 0.7}>16.8°N — 3.0°W</text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// ROUTE V2 — étapes nommées + ombre + easing vitesse
// ---------------------------------------------------------------------------
const RouteV2: React.FC<{ frame: number; op: number; map: mapboxgl.Map | null }> = ({ frame, op, map }) => {
  if (!map) return null;
  const relFrame = frame - SEG.ROUTE.start;
  const rawT = clamp(relFrame / (SEG.ROUTE.end - SEG.ROUTE.start - 15), 0, 1);
  const progress = easeQ(rawT);

  const totalSegs = ROUTE_COORDS.length - 1;
  const drawn = progress * totalSegs;
  const fullSegs = Math.floor(drawn);
  const partial = drawn - fullSegs;

  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= fullSegs && i < ROUTE_COORDS.length; i++) {
    const p = map.project(ROUTE_COORDS[i]);
    pts.push({ x: p.x, y: p.y });
  }
  if (fullSegs < totalSegs) {
    const a = ROUTE_COORDS[fullSegs], b = ROUTE_COORDS[fullSegs + 1];
    const p = map.project([a[0] + (b[0] - a[0]) * partial, a[1] + (b[1] - a[1]) * partial]);
    pts.push({ x: p.x, y: p.y });
  }
  if (pts.length < 2) return null;

  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const last = pts[pts.length - 1];
  const prev = pts[pts.length - 2];
  const angle = Math.atan2(last.y - prev.y, last.x - prev.x) * 180 / Math.PI;

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }} width="100%" height="100%">
      {/* Ombre portée */}
      <path d={d} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={7} strokeLinecap="round" transform="translate(2,2)" />
      {/* Halo */}
      <path d={d} fill="none" stroke="#D4AF37" strokeWidth={6} opacity={op * 0.15} strokeLinecap="round" />
      {/* Ligne */}
      <path d={d} fill="none" stroke="#D4AF37" strokeWidth={2.5} opacity={op * 0.9} strokeLinecap="round" strokeLinejoin="round" />
      {/* Tête de flèche */}
      <g transform={`translate(${last.x},${last.y}) rotate(${angle})`} opacity={op}>
        <polygon points="0,0 -12,-5 -12,5" fill="#D4AF37" />
      </g>
      {/* Étapes nommées */}
      {ROUTE_COORDS.map((coord, i) => {
        if (i > fullSegs) return null;
        const p = map.project(coord);
        const cityOp = clamp((drawn - i) * 3, 0, 1) * op;
        return (
          <g key={i} opacity={cityOp}>
            <circle cx={p.x} cy={p.y} r={i === 3 ? 7 : 5} fill="#D4AF37" opacity={0.9} />
            <text x={p.x + 10} y={p.y - 6} fill="#D4AF37" fontSize={10} fontFamily="Georgia, serif" fontWeight="700" letterSpacing={1}>{ROUTE_LABELS[i]}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// FLÈCHES V2 — arcs Bézier + labels quantifiés
// ---------------------------------------------------------------------------
const FLUX = [
  { from: [-17.4, 14.7] as [number,number], label: "DAKAR",  stat: "850t or",  color: "#D4AF37", w: 3,   phase: 0  },
  { from: [  7.9, 16.9] as [number,number], label: "AGADEZ", stat: "620t sel", color: "#E8A020", w: 2.5, phase: 20 },
  { from: [ -1.7, 12.4] as [number,number], label: "OUAGA",  stat: "310t",     color: "#C4A35A", w: 2,   phase: 40 },
];
const TO: [number, number] = [-3.0, 16.8];

const FlechesV2: React.FC<{ frame: number; op: number; map: mapboxgl.Map | null }> = ({ frame, op, map }) => {
  if (!map) return null;
  const relFrame = frame - SEG.FLECHES.start;
  const labelOp = clamp((relFrame - 60) / 30, 0, 1) * op;
  const pTo = map.project(TO);
  const pulseTo = 0.85 + Math.sin(frame * 0.15) * 0.15;

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }} width="100%" height="100%">
      {FLUX.map(({ from, label, stat, color, w, phase }, fi) => {
        const pFrom = map.project(from);
        const mx = (pFrom.x + pTo.x) / 2;
        const my = (pFrom.y + pTo.y) / 2;
        const dx = pTo.x - pFrom.x;
        const dy = pTo.y - pFrom.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        // Point de contrôle Bézier — offset perpendiculaire
        const cx = mx + (-dy / len) * 50;
        const cy = my + ( dx / len) * 50;
        const dashOff = -((frame + phase) % 30) * (w + 1);
        // Midpoint sur la courbe (t=0.5)
        const bmx = 0.25 * pFrom.x + 0.5 * cx + 0.25 * pTo.x;
        const bmy = 0.25 * pFrom.y + 0.5 * cy + 0.25 * pTo.y;
        // Angle de la tangente à t=1 pour la flèche
        const tx = pTo.x - cx;
        const ty = pTo.y - cy;
        const arrowAngle = Math.atan2(ty, tx) * 180 / Math.PI;

        return (
          <g key={fi} opacity={op}>
            <path d={`M ${pFrom.x},${pFrom.y} Q ${cx},${cy} ${pTo.x},${pTo.y}`}
              fill="none" stroke={color} strokeWidth={w}
              strokeDasharray={`10 7`} strokeDashoffset={dashOff} opacity={0.85} />
            <g transform={`translate(${pTo.x},${pTo.y}) rotate(${arrowAngle})`}>
              <polygon points="0,0 -12,-5 -12,5" fill={color} opacity={0.9} />
            </g>
            <circle cx={pFrom.x} cy={pFrom.y} r={4} fill={color} opacity={0.8} />
            {/* Badge stat au milieu de l'arc */}
            <g transform={`translate(${bmx},${bmy})`} opacity={labelOp}>
              <rect x={-30} y={-12} width={60} height={22} rx={3} fill="rgba(26,18,9,0.82)" stroke={color} strokeWidth={1} />
              <text y={-1} textAnchor="middle" fill={color} fontSize={9} fontFamily="Georgia, serif" fontWeight="700">{label}</text>
              <text y={9} textAnchor="middle" fill="#ffffff" fontSize={8} fontFamily="Georgia, serif" opacity={0.7}>{stat}</text>
            </g>
          </g>
        );
      })}
      {/* Noeud central Tombouctou */}
      <g opacity={op}>
        <circle cx={pTo.x} cy={pTo.y} r={10 * pulseTo} fill="#D4AF37" opacity={0.9} />
        <circle cx={pTo.x} cy={pTo.y} r={4} fill="#1a1209" />
        <text x={pTo.x + 14} y={pTo.y + 4} fill="#D4AF37" fontSize={10} fontFamily="Georgia, serif" fontWeight="700" letterSpacing={1}>TOMBOUCTOU</text>
        <text x={pTo.x + 14} y={pTo.y + 15} fill="#888" fontSize={8} fontFamily="Georgia, serif" opacity={labelOp}>noeud commercial XIIIe s.</text>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// KEN BURNS V2 — satellite → dark mid-zoom
// ---------------------------------------------------------------------------
const KenBurnsV2: React.FC<{ frame: number; op: number; map: mapboxgl.Map | null; onStyleSwitch: () => void; styleSwitched: boolean }> = ({ frame, op, map, onStyleSwitch, styleSwitched }) => {
  const relFrame = frame - SEG.KEN_BURNS.start;
  const total = SEG.KEN_BURNS.end - SEG.KEN_BURNS.start;

  useEffect(() => {
    if (!map || relFrame < 0) return;
    const t1 = relFrame / 70;
    const t2 = clamp((relFrame - 70) / 70, 0, 1);
    const t3 = clamp((relFrame - 140) / 70, 0, 1);

    if (relFrame < 70) {
      map.jumpTo({ center: [lerp(CAM_KB_A.lon, CAM_KB_B.lon, t1), lerp(CAM_KB_A.lat, CAM_KB_B.lat, t1)], zoom: lerp(CAM_KB_A.zoom, CAM_KB_B.zoom, t1), pitch: lerp(CAM_KB_A.pitch, CAM_KB_B.pitch, t1), bearing: CAM_KB_A.bearing });
    } else if (relFrame < 140) {
      map.jumpTo({ center: [lerp(CAM_KB_B.lon, CAM_KB_C.lon, t2), lerp(CAM_KB_B.lat, CAM_KB_C.lat, t2)], zoom: lerp(CAM_KB_B.zoom, CAM_KB_C.zoom, t2), pitch: lerp(CAM_KB_B.pitch, CAM_KB_C.pitch, t2), bearing: lerp(CAM_KB_B.bearing, CAM_KB_C.bearing, t2) });
      if (relFrame === 70) onStyleSwitch();
    } else {
      map.jumpTo({ center: [CAM_KB_C.lon, CAM_KB_C.lat], zoom: CAM_KB_C.zoom, pitch: CAM_KB_C.pitch, bearing: CAM_KB_C.bearing });
    }
  }, [frame]);

  // Overlay fondu pendant transition de style
  const transOp = interpolate(relFrame, [68, 75, 95, 110], [0, 0.45, 0.45, 0], { extrapolateRight: "clamp" });
  // Label final
  const finalOp = interpolate(relFrame, [145, 160], [0, 1], { extrapolateRight: "clamp" }) * op;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${transOp})`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, textAlign: "center", opacity: finalOp, pointerEvents: "none" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 18, letterSpacing: 4, color: "#D4AF37", fontWeight: 700 }}>MALI</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 11, letterSpacing: 2, color: "#aaa", marginTop: 4 }}>1 235 000 km²</div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
// PARTICULES V2 — flux dirigé + traîne
// ---------------------------------------------------------------------------
const PART_COUNT = 35;
const PARTICLES = Array.from({ length: PART_COUNT }, (_, i) => ({
  id: i,
  phase: i / PART_COUNT,
  speed: 0.0025 + (i % 5) * 0.0006,
  size: 2 + (i % 3) * 0.8,
  color: i % 3 === 0 ? "#D4AF37" : i % 3 === 1 ? "#E8A020" : "#ffffff",
  opacity: 0.4 + (i % 4) * 0.12,
}));

const getRoutePos = (t: number): [number, number] => {
  const total = ROUTE_COORDS.length - 1;
  const seg = Math.floor(t * total);
  const segT = (t * total) - seg;
  const s = Math.min(seg, total - 1);
  const a = ROUTE_COORDS[s], b = ROUTE_COORDS[s + 1];
  return [a[0] + (b[0] - a[0]) * segT, a[1] + (b[1] - a[1]) * segT];
};

const ParticulesV2: React.FC<{ frame: number; op: number; map: mapboxgl.Map | null }> = ({ frame, op, map }) => {
  if (!map) return null;
  const tombouctouPx = map.project([-3.0, 16.8]);

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }} width="100%" height="100%">
      {PARTICLES.map((p) => {
        const t = (p.phase + (frame - SEG.PARTICULES.start) * p.speed) % 1;
        const pos = map.project(getRoutePos(t));
        // Boost près de Tombouctou
        const dx = pos.x - tombouctouPx.x;
        const dy = pos.y - tombouctouPx.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const boost = dist < 50 ? 2.2 : 1;
        // Traîne — 5 positions passées
        const trail = [0.012, 0.008, 0.005, 0.003, 0.001].map((delta, ti) => {
          const tPrev = ((t - delta) + 1) % 1;
          const pp = map.project(getRoutePos(tPrev));
          return { x: pp.x, y: pp.y, r: p.size * boost * (1 - (ti + 1) * 0.15), trailOp: (1 - (ti + 1) * 0.18) * op * p.opacity };
        });

        return (
          <g key={p.id}>
            {trail.map((tr, ti) => (
              <circle key={ti} cx={tr.x} cy={tr.y} r={tr.r} fill={p.color} opacity={tr.trailOp} />
            ))}
            <circle cx={pos.x} cy={pos.y} r={p.size * boost} fill={p.color} opacity={op * p.opacity} />
          </g>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// HEATMAP V2 — respiration + isochrones
// ---------------------------------------------------------------------------
const HeatmapV2: React.FC<{ frame: number; op: number; map: mapboxgl.Map | null }> = ({ frame, op, map }) => {
  if (!map) return null;
  const center = map.project([-3.0, 16.8]);
  const relFrame = frame - SEG.HEATMAP.start;
  const dashOff = -(relFrame * 1.2);

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }} width="100%" height="100%">
      {/* Isochrones animés */}
      {[{ r: 55, label: "500 km" }, { r: 105, label: "1 000 km" }, { r: 155, label: "1 500 km" }].map(({ r, label }, i) => {
        const isoOp = interpolate(relFrame, [i * 20, i * 20 + 25], [0, 1], { extrapolateRight: "clamp" }) * op * 0.6;
        return (
          <g key={i} opacity={isoOp}>
            <circle cx={center.x} cy={center.y} r={r} fill="none" stroke="#D4AF37" strokeWidth={1} strokeDasharray="6 5" strokeDashoffset={dashOff + i * 15} opacity={0.5} />
            <text x={center.x + r + 4} y={center.y + 3} fill="#D4AF37" fontSize={9} fontFamily="Georgia, serif" opacity={0.8}>{label}</text>
          </g>
        );
      })}
      {/* Point central */}
      <circle cx={center.x} cy={center.y} r={6} fill="#FF4500" opacity={op * 0.9} />
      {/* Label titre */}
      <text x={center.x} y={center.y - 170} textAnchor="middle" fill="#555" fontSize={10} fontFamily="Georgia, serif" letterSpacing={2} opacity={op * 0.8}>DENSITÉ COMMERCIALE — SAHEL XIIIe s.</text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Composition principale
// ---------------------------------------------------------------------------
export const MapboxAnimationsV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-anim-v2"));
  const [ready, setReady] = useState(false);
  const [styleSwitched, setStyleSwitched] = useState(false);
  const [mapTick, setMapTick] = useState(0);

  const currentSeg = Object.values(SEG).find((s) => frame >= s.start && frame < s.end) ?? SEG.PULSE;

  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [CAM_KB_A.lon, CAM_KB_A.lat],
      zoom: CAM_KB_A.zoom,
      pitch: CAM_KB_A.pitch,
      bearing: CAM_KB_A.bearing,
      interactive: false,
      preserveDrawingBuffer: true,
    });
    map.on("style.load", () => {
      mapRef.current = map;
      setReady(true);
      continueRender(handle);
    });
    map.on("render", () => setMapTick((t) => t + 1));
    return () => map.remove();
  }, []);

  // Camera par segment (sauf Ken Burns qui se gère lui-même)
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const map = mapRef.current;
    if (frame < SEG.PULSE.end) {
      if (frame === SEG.PULSE.start) {
        map.setStyle("mapbox://styles/mapbox/light-v11");
        map.once("style.load", () => { removeLabels(map); });
      }
      map.jumpTo({ center: [CAM_PULSE.lon, CAM_PULSE.lat], zoom: CAM_PULSE.zoom, pitch: CAM_PULSE.pitch, bearing: CAM_PULSE.bearing });
    } else if (frame < SEG.ROUTE.end) {
      if (frame === SEG.ROUTE.start) removeLabels(map);
      map.jumpTo({ center: [CAM_ROUTE.lon, CAM_ROUTE.lat], zoom: CAM_ROUTE.zoom, pitch: CAM_ROUTE.pitch, bearing: CAM_ROUTE.bearing });
    } else if (frame < SEG.FLECHES.end) {
      map.jumpTo({ center: [CAM_FLECHES.lon, CAM_FLECHES.lat], zoom: CAM_FLECHES.zoom, pitch: CAM_FLECHES.pitch, bearing: CAM_FLECHES.bearing });
    } else if (frame < SEG.KEN_BURNS.start) {
      // Transition vers satellite pour Ken Burns
    } else if (frame === SEG.KEN_BURNS.start) {
      map.setStyle("mapbox://styles/mapbox/satellite-v9");
      map.jumpTo({ center: [CAM_KB_A.lon, CAM_KB_A.lat], zoom: CAM_KB_A.zoom, pitch: CAM_KB_A.pitch, bearing: CAM_KB_A.bearing });
    } else if (frame < SEG.PARTICULES.end) {
      if (frame === SEG.PARTICULES.start) {
        map.setStyle("mapbox://styles/mapbox/light-v11");
        map.once("style.load", () => { removeLabels(map); });
        map.jumpTo({ center: [CAM_PART.lon, CAM_PART.lat], zoom: CAM_PART.zoom, pitch: CAM_PART.pitch, bearing: CAM_PART.bearing });
      }
    } else if (frame >= SEG.HEATMAP.start) {
      if (frame === SEG.HEATMAP.start) {
        map.jumpTo({ center: [CAM_HEAT.lon, CAM_HEAT.lat], zoom: CAM_HEAT.zoom, pitch: CAM_HEAT.pitch, bearing: CAM_HEAT.bearing });
        if (!map.getSource("heatmap-src")) {
          map.addSource("heatmap-src", { type: "geojson", data: { type: "FeatureCollection", features: HEATMAP_POINTS.map((p) => ({ type: "Feature" as const, geometry: { type: "Point" as const, coordinates: [p.lon, p.lat] }, properties: { weight: p.weight } })) } });
          map.addLayer({ id: "heatmap-lyr", type: "heatmap", source: "heatmap-src", paint: { "heatmap-weight": ["interpolate", ["linear"], ["get", "weight"], 0, 0, 1, 1], "heatmap-intensity": 1.2, "heatmap-radius": 45, "heatmap-opacity": 0.72, "heatmap-color": ["interpolate", ["linear"], ["heatmap-density"], 0, "rgba(0,0,0,0)", 0.2, "rgba(212,175,55,0.4)", 0.5, "rgba(232,160,32,0.7)", 0.8, "rgba(200,100,20,0.85)", 1.0, "rgba(180,40,10,1)"] } });
        }
      }
      // Respiration
      const intensity = 0.8 + Math.sin(frame * 0.05) * 0.5;
      if (map.getLayer("heatmap-lyr")) map.setPaintProperty("heatmap-lyr", "heatmap-intensity", intensity);
    }
  }, [frame, ready]);

  const handleStyleSwitch = () => {
    if (!mapRef.current) return;
    mapRef.current.setStyle("mapbox://styles/mapbox/dark-v11");
    setStyleSwitched(true);
  };

  const pulseOp     = segOp(frame, SEG.PULSE);
  const routeOp     = segOp(frame, SEG.ROUTE);
  const flechesOp   = segOp(frame, SEG.FLECHES);
  const kbOp        = segOp(frame, SEG.KEN_BURNS);
  const particulesOp = segOp(frame, SEG.PARTICULES);
  const heatmapOp   = segOp(frame, SEG.HEATMAP);
  const badgeOp     = interpolate(frame, [currentSeg.start, currentSeg.start + 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#e8e4dc" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      {ready && (
        <>
          {frame >= SEG.PULSE.start     && frame < SEG.PULSE.end     && <PulseV2      frame={frame} op={pulseOp}      map={mapRef.current} />}
          {frame >= SEG.ROUTE.start     && frame < SEG.ROUTE.end     && <RouteV2      frame={frame} op={routeOp}      map={mapRef.current} />}
          {frame >= SEG.FLECHES.start   && frame < SEG.FLECHES.end   && <FlechesV2    frame={frame} op={flechesOp}    map={mapRef.current} />}
          {frame >= SEG.KEN_BURNS.start && frame < SEG.KEN_BURNS.end && <KenBurnsV2   frame={frame} op={kbOp}         map={mapRef.current} onStyleSwitch={handleStyleSwitch} styleSwitched={styleSwitched} />}
          {frame >= SEG.PARTICULES.start && frame < SEG.PARTICULES.end && <ParticulesV2 frame={frame} op={particulesOp} map={mapRef.current} />}
          {frame >= SEG.HEATMAP.start   && frame < SEG.HEATMAP.end   && <HeatmapV2    frame={frame} op={heatmapOp}    map={mapRef.current} />}
        </>
      )}
      <Badge label={currentSeg.label} desc={currentSeg.desc} opacity={badgeOp} />
    </AbsoluteFill>
  );
};
