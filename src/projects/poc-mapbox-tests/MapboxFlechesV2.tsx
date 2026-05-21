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
import { MapboxBrandingHide, removeLabels } from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const MAPBOX_FLECHES_V2_FRAMES = 180; // 6s @ 30fps

const TIMBUKTU: [number, number] = [-3.0, 16.8];

const CAMERA = { lon: -3.0, lat: 15.0, zoom: 3.5, pitch: 20, bearing: 0 };

const FLUX = [
  { from: [-17.4, 14.7] as [number, number], label: "DAKAR",  stat: "850t or",  color: "#D4AF37", phase: 0,  strokeWidth: 3   },
  { from: [  7.9, 16.9] as [number, number], label: "AGADEZ", stat: "620t sel", color: "#E8A020", phase: 20, strokeWidth: 2.5 },
  { from: [ -1.7, 12.4] as [number, number], label: "OUAGA",  stat: "310t",     color: "#C4A35A", phase: 40, strokeWidth: 2   },
];

// ---------------------------------------------------------------------------
// Calcul point de controle Bezier quadratique
// midpoint + offset perpendiculaire de 40px (espace ecran)
// ---------------------------------------------------------------------------
function bezierControl(
  x1: number, y1: number,
  x2: number, y2: number,
  offsetPx = 40
): { cx: number; cy: number } {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  // Perpendiculaire normalisee * offset
  const px = (-dy / len) * offsetPx;
  const py = ( dx / len) * offsetPx;
  return { cx: mx + px, cy: my + py };
}

// ---------------------------------------------------------------------------
// Longueur approximative d'un arc Bezier quadratique (subdivision simple)
// ---------------------------------------------------------------------------
function arcLength(
  x1: number, y1: number,
  cx: number, cy: number,
  x2: number, y2: number,
  steps = 20
): number {
  let len = 0;
  let prevX = x1;
  let prevY = y1;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    const bx = mt * mt * x1 + 2 * mt * t * cx + t * t * x2;
    const by = mt * mt * y1 + 2 * mt * t * cy + t * t * y2;
    const ddx = bx - prevX;
    const ddy = by - prevY;
    len += Math.sqrt(ddx * ddx + ddy * ddy);
    prevX = bx;
    prevY = by;
  }
  return len;
}

// ---------------------------------------------------------------------------
// Overlay SVG principal
// ---------------------------------------------------------------------------
const FlechesV2Overlay: React.FC<{
  frame: number;
  map: mapboxgl.Map | null;
}> = ({ frame, map }) => {
  if (!map) return null;

  const pTo = map.project(TIMBUKTU);
  // Pulse noeud central
  const pulseT = (frame % 40) / 40;
  const pulseR = 10 + pulseT * 20;
  const pulseOp = (1 - pulseT) * 0.5;

  // Apparition globale (fade-in rapide)
  const globalOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <svg
      style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      width="100%"
      height="100%"
    >
      {/* --- Arcs flux --- */}
      {FLUX.map(({ from, color, stat, label, phase, strokeWidth }, fi) => {
        const pFrom = map.project(from);
        const { cx, cy } = bezierControl(pFrom.x, pFrom.y, pTo.x, pTo.y, 40);

        // Tirets animes — offset diminue chaque frame = flux qui avance
        const totalLen = arcLength(pFrom.x, pFrom.y, cx, cy, pTo.x, pTo.y, 30);
        const dashLen = 10;
        const gapLen = 8;
        const dashOffset = -((frame + phase) % (dashLen + gapLen)) * 2;

        // Point mi-arc pour badge (t=0.5 sur Bezier)
        const midT = 0.5;
        const midX = (1 - midT) * (1 - midT) * pFrom.x + 2 * (1 - midT) * midT * cx + midT * midT * pTo.x;
        const midY = (1 - midT) * (1 - midT) * pFrom.y + 2 * (1 - midT) * midT * cy + midT * midT * pTo.y;

        // Badge apparait apres f=60
        const badgeOp = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" }) * globalOp;

        // Fleche terminus — direction tangente en t=1
        const tanX = 2 * (cx - pFrom.x) + 2 * (pTo.x - cx); // derivee * 0.5 (non necessaire pour atan2)
        const tanY = 2 * (cy - pFrom.y) + 2 * (pTo.y - cy);
        const arrowAngle = Math.atan2(pTo.y - cy, pTo.x - cx) * (180 / Math.PI);
        // Supprime usage inutilise
        void tanX; void tanY; void totalLen;

        const pathD = `M ${pFrom.x},${pFrom.y} Q ${cx},${cy} ${pTo.x},${pTo.y}`;

        // Delai d'apparition par flux
        const fluxDelay = fi * 15;
        const fluxOp = interpolate(frame, [fluxDelay, fluxDelay + 20], [0, 1], { extrapolateRight: "clamp" }) * globalOp;

        return (
          <g key={fi} opacity={fluxOp}>
            {/* Halo */}
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth + 4}
              opacity={0.1}
              strokeLinecap="round"
            />
            {/* Arc principal avec tirets animes */}
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLen} ${gapLen}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              opacity={0.9}
            />
            {/* Fleche terminus */}
            <g transform={`translate(${pTo.x},${pTo.y}) rotate(${arrowAngle})`}>
              <polygon points="0,0 -14,-6 -14,6" fill={color} opacity={0.95} />
            </g>
            {/* Point origine */}
            <circle cx={pFrom.x} cy={pFrom.y} r={4} fill={color} opacity={0.85} />
            {/* Label ville origine */}
            <text
              x={pFrom.x}
              y={pFrom.y - 10}
              fill={color}
              fontSize={10}
              fontFamily="Georgia, serif"
              letterSpacing={1.5}
              textAnchor="middle"
              opacity={0.9}
            >
              {label}
            </text>
            {/* Badge mi-arc (rectangle arrondi + stat) */}
            <g opacity={badgeOp}>
              <rect
                x={midX - 28}
                y={midY - 12}
                width={56}
                height={22}
                rx={4}
                ry={4}
                fill="rgba(20,14,5,0.78)"
                stroke={color}
                strokeWidth={0.8}
              />
              <text
                x={midX}
                y={midY + 4}
                fill={color}
                fontSize={9}
                fontFamily="Georgia, serif"
                letterSpacing={1}
                textAnchor="middle"
                fontWeight="700"
              >
                {stat}
              </text>
            </g>
          </g>
        );
      })}

      {/* --- Noeud central Tombouctou --- */}
      <g opacity={globalOp}>
        {/* Pulse */}
        <circle cx={pTo.x} cy={pTo.y} r={pulseR} fill="none" stroke="#D4AF37" strokeWidth={1.5} opacity={pulseOp} />
        {/* Cercle fixe */}
        <circle cx={pTo.x} cy={pTo.y} r={10} fill="#D4AF37" opacity={0.15} />
        <circle cx={pTo.x} cy={pTo.y} r={10} fill="none" stroke="#D4AF37" strokeWidth={1.8} opacity={0.9} />
        <circle cx={pTo.x} cy={pTo.y} r={4}  fill="#D4AF37" opacity={1} />
        {/* Label TOMBOUCTOU */}
        <text
          x={pTo.x + 16}
          y={pTo.y - 6}
          fill="#D4AF37"
          fontSize={11}
          fontFamily="Georgia, serif"
          letterSpacing={1.8}
          fontWeight="700"
          opacity={0.95}
        >
          TOMBOUCTOU
        </text>
        {/* Sous-label noeud commercial */}
        <text
          x={pTo.x + 16}
          y={pTo.y + 9}
          fill="#D4AF37"
          fontSize={8}
          fontFamily="Georgia, serif"
          letterSpacing={1}
          opacity={0.65}
        >
          noeud commercial
        </text>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Composition principale
// ---------------------------------------------------------------------------
export const MapboxFlechesV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-fleches-v2"));
  const [ready, setReady] = useState(false);
  const [mapTick, setMapTick] = useState(0);
  void mapTick;

  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAMERA.lon, CAMERA.lat],
      zoom: CAMERA.zoom,
      pitch: CAMERA.pitch,
      bearing: CAMERA.bearing,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AbsoluteFill style={{ background: "#e8e4dc" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      {ready && (
        <FlechesV2Overlay frame={frame} map={mapRef.current} />
      )}
    </AbsoluteFill>
  );
};
