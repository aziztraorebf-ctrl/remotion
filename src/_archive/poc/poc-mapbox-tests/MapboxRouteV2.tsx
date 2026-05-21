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

export const MAPBOX_ROUTE_V2_FRAMES = 210; // 7s @ 30fps

// Caméra fixe Trans-Saharienne
const CAM = { lon: -3.0, lat: 15.5, zoom: 3.4, pitch: 25, bearing: 0 };

// Route Trans-Saharienne avec noms de villes
const ROUTE: [number, number][] = [
  [-17.4, 14.7], // Dakar
  [-11.4, 14.1], // Tambacounda
  [ -7.0, 14.5], // Bamako
  [ -3.0, 16.8], // Tombouctou
  [  1.0, 16.9], // Gao
  [  7.9, 16.9], // Agadez
];

const CITY_NAMES = ["Dakar", "Tambacounda", "Bamako", "Tombouctou", "Gao", "Agadez"];

// Easing quadratique — accelere debut, ralentit fin
const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// ---------------------------------------------------------------------------
// SVG Overlay V2 — tracé progressif avec toutes les améliorations
// ---------------------------------------------------------------------------
const RouteV2Overlay: React.FC<{
  frame: number;
  map: mapboxgl.Map | null;
}> = ({ frame, map }) => {
  if (!map) return null;

  // Effet vitesse : easing quadratique sur [30, 195]
  const rawProgress = interpolate(frame, [30, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const progress = ease(rawProgress);

  const totalSegs = ROUTE.length - 1;
  const drawn = progress * totalSegs;
  const fullSegs = Math.floor(drawn);
  const partial = drawn - fullSegs;

  // Construire les points de la ligne dessinée
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= fullSegs && i < ROUTE.length; i++) {
    const p = map.project(ROUTE[i]);
    points.push({ x: p.x, y: p.y });
  }
  if (fullSegs < totalSegs) {
    const a = ROUTE[fullSegs];
    const b = ROUTE[fullSegs + 1];
    const px = map.project([
      a[0] + (b[0] - a[0]) * partial,
      a[1] + (b[1] - a[1]) * partial,
    ]);
    points.push({ x: px.x, y: px.y });
  }

  if (points.length < 2) {
    // Juste le point de départ — afficher uniquement le cercle initial
    if (points.length === 1) {
      const startOp = interpolate(frame, [30, 45], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return (
        <svg
          style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
          width="100%"
          height="100%"
        >
          <circle cx={points[0].x} cy={points[0].y} r={6} fill="#D4AF37" opacity={startOp} />
        </svg>
      );
    }
    return null;
  }

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Position courante (tête de flèche)
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const angle = Math.atan2(last.y - prev.y, last.x - prev.x) * (180 / Math.PI);

  // Trail — les 3 derniers segments ont un traitement lumineux
  // On construit un path pour les N derniers points seulement
  const trailStart = Math.max(0, points.length - 4);
  const trailPoints = points.slice(trailStart);
  const trailD = trailPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Opacité globale — fade in au début
  const globalOp = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Villes allumées : une ville s'allume quand la ligne la dépasse
  // Ville i s'allume quand drawn >= i (c'est-à-dire progress >= i/totalSegs)
  const cityItems = ROUTE.map((coord, i) => {
    const p = map.project(coord);
    const threshold = i / totalSegs;
    // drawn >= i signifie que le tracé a dépassé ce point
    const isLit = drawn >= i;
    const litProgress = Math.max(0, drawn - i);
    const cityOp = isLit ? Math.min(1, litProgress * 4) * globalOp : 0;
    return { p, name: CITY_NAMES[i], op: cityOp, isLast: i === ROUTE.length - 1 };
  });

  return (
    <svg
      style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      width="100%"
      height="100%"
    >
      {/* Ombre portée — path dupliqué décalé +2px en y, stroke sombre */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={globalOp}
        transform="translate(0, 2)"
      />

      {/* Ligne principale */}
      <path
        d={pathD}
        fill="none"
        stroke="#D4AF37"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={globalOp * 0.9}
      />

      {/* Trail — 3 derniers segments plus épais et lumineux */}
      {trailPoints.length >= 2 && (
        <>
          <path
            d={trailD}
            fill="none"
            stroke="#FFD700"
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={globalOp * 0.55}
          />
          <path
            d={trailD}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={globalOp * 0.35}
          />
        </>
      )}

      {/* Tête de flèche animée à la position courante */}
      <g
        transform={`translate(${last.x}, ${last.y}) rotate(${angle})`}
        opacity={globalOp}
      >
        {/* Ombre de la flèche */}
        <polygon
          points="0,0 -14,-6 -14,6"
          fill="rgba(0,0,0,0.25)"
          transform="translate(1, 1.5)"
        />
        {/* Flèche principale */}
        <polygon points="0,0 -14,-6 -14,6" fill="#FFD700" />
        {/* Reflet */}
        <polygon points="0,0 -14,-6 -7,0" fill="#FFFFFF" opacity={0.3} />
      </g>

      {/* Villes : cercle doré + label fade-in quand la ligne dépasse */}
      {cityItems.map(({ p, name, op, isLast }, i) => (
        <g key={i} opacity={op}>
          {/* Halo */}
          <circle cx={p.x} cy={p.y} r={10} fill="#D4AF37" opacity={0.12} />
          {/* Cercle doré */}
          <circle cx={p.x} cy={p.y} r={5} fill="#D4AF37" stroke="#1a1209" strokeWidth={1} />
          {/* Point central */}
          <circle cx={p.x} cy={p.y} r={2} fill={isLast ? "#FFD700" : "#1a1209"} />
          {/* Label nom de la ville */}
          <text
            x={p.x + 10}
            y={p.y - 9}
            fill="#D4AF37"
            fontSize={11}
            fontFamily="Georgia, serif"
            letterSpacing={1.2}
            fontWeight="bold"
            opacity={0.95}
          >
            {name.toUpperCase()}
          </text>
          {/* Soulignement décoratif sous le label */}
          <line
            x1={p.x + 10}
            y1={p.y - 6}
            x2={p.x + 10 + name.length * 6.5}
            y2={p.y - 6}
            stroke="#D4AF37"
            strokeWidth={0.5}
            opacity={0.5}
          />
        </g>
      ))}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Composition principale
// ---------------------------------------------------------------------------
export const MapboxRouteV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-route-v2"));
  const [ready, setReady] = useState(false);
  // Force re-render quand Mapbox re-rend (pour synchroniser les projections SVG)
  const [, setMapTick] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM.lon, CAM.lat],
      zoom: CAM.zoom,
      pitch: CAM.pitch,
      bearing: CAM.bearing,
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

  return (
    <AbsoluteFill style={{ background: "#e8e4dc" }}>
      <MapboxBrandingHide />
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, width, height }}
      />
      {ready && (
        <RouteV2Overlay frame={frame} map={mapRef.current} />
      )}
    </AbsoluteFill>
  );
};
