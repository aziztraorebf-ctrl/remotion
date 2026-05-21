import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  MapboxBrandingHide,
  removeLabels,
} from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const MAPBOX_PARTICULES_V2_FRAMES = 180;

// Camera centree sur route trans-saharienne
const CAM = { lon: -3.0, lat: 15.5, zoom: 3.4, pitch: 20, bearing: 0 };

// Route trans-saharienne : Dakar -> Bamako -> Tombouctou -> Agadez
const ROUTE: [number, number][] = [
  [-17.4, 14.7], // Dakar
  [ -7.0, 14.5], // Bamako zone
  [ -3.0, 16.8], // Tombouctou
  [  7.9, 16.9], // Agadez
];

// Coordonnees de Tombouctou pour boost de taille
const TIMBUKTU: [number, number] = [-3.0, 16.8];

// 3 couleurs reparties en tiers
const PARTICLE_COLORS = ["#D4AF37", "#E8A020", "#ffffff"] as const;

const NUM_PARTICLES = 30;
const TRAIL_LENGTH = 5;
const PHASE_STEP = 0.003;

// Longueur totale approximative de la route (nb de segments)
const ROUTE_SEGMENTS = ROUTE.length - 1;

// Interpolation lineaire sur la route selon phase 0..1
const routePosition = (phase: number): [number, number] => {
  const p = Math.max(0, Math.min(0.9999, phase));
  const t = p * ROUTE_SEGMENTS;
  const seg = Math.floor(t);
  const frac = t - seg;
  const a = ROUTE[seg];
  const b = ROUTE[Math.min(seg + 1, ROUTE.length - 1)];
  return [
    a[0] + (b[0] - a[0]) * frac,
    a[1] + (b[1] - a[1]) * frac,
  ];
};

// Generer les phases initiales de facon uniformement repartie
const INITIAL_PHASES = Array.from({ length: NUM_PARTICLES }, (_, i) => i / NUM_PARTICLES);

// ---------------------------------------------------------------------------
// Composition principale — 1080x1920 vertical
// ---------------------------------------------------------------------------
export const MapboxParticulesV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-particules-v2"));
  const [ready, setReady] = useState(false);

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
    return () => map.remove();
  }, []);

  // Projeter la position Tombouctou une fois la carte prete
  const timbuktuPixel = mapRef.current
    ? mapRef.current.project(TIMBUKTU)
    : null;

  // Calculer toutes les positions de particules pour ce frame
  const particles = INITIAL_PHASES.map((initPhase, i) => {
    const color = PARTICLE_COLORS[Math.floor(i / (NUM_PARTICLES / 3)) % 3];
    // Phase courante en boucle
    const currentPhase = (initPhase + frame * PHASE_STEP) % 1;

    // Position head + trail (5 positions anterieures simulees)
    const positions: Array<[number, number] | null> = [];
    for (let t = 0; t <= TRAIL_LENGTH; t++) {
      const trailPhase = (currentPhase - t * PHASE_STEP * 3 + 1) % 1;
      const coord = routePosition(trailPhase);
      if (mapRef.current) {
        const px = mapRef.current.project(coord);
        positions.push([px.x, px.y]);
      } else {
        positions.push(null);
      }
    }

    // Boost de taille si proche de Tombouctou
    let scale = 1.0;
    if (timbuktuPixel && positions[0]) {
      const [hx, hy] = positions[0];
      const dx = hx - timbuktuPixel.x;
      const dy = hy - timbuktuPixel.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 50) {
        scale = 1 + (1 - dist / 50);
      }
    }

    return { color, positions, scale };
  });

  return (
    <AbsoluteFill style={{ background: "#f5f0e8" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />

      {ready && (
        <svg
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
          width={width}
          height={height}
        >
          {particles.map((p, pi) => {
            const head = p.positions[0];
            if (!head) return null;
            const [hx, hy] = head;

            return (
              <g key={pi}>
                {/* Trail — 5 cercles de plus en plus petits et transparents */}
                {p.positions.slice(1).map((pos, ti) => {
                  if (!pos) return null;
                  const [tx, ty] = pos;
                  const trailIndex = ti + 1;
                  const trailRadius = (4 - trailIndex * 0.5) * p.scale;
                  const trailOpacity = (1 - trailIndex / (TRAIL_LENGTH + 1)) * 0.5;
                  if (trailRadius <= 0) return null;
                  return (
                    <circle
                      key={ti}
                      cx={tx}
                      cy={ty}
                      r={Math.max(0.5, trailRadius)}
                      fill={p.color}
                      opacity={trailOpacity}
                    />
                  );
                })}
                {/* Particule principale */}
                <circle
                  cx={hx}
                  cy={hy}
                  r={4 * p.scale}
                  fill={p.color}
                  opacity={0.92}
                />
                {/* Halo lumineux sur la particule principale */}
                <circle
                  cx={hx}
                  cy={hy}
                  r={7 * p.scale}
                  fill={p.color}
                  opacity={0.18}
                />
              </g>
            );
          })}

          {/* Waypoints de reference — points fixes sur la route */}
          {mapRef.current && ROUTE.map(([lon, lat], i) => {
            const px = mapRef.current!.project([lon, lat]);
            const labels = ["DAKAR", "BAMAKO", "TOMBOUCTOU", "AGADEZ"];
            return (
              <g key={i} transform={`translate(${px.x}, ${px.y})`}>
                <circle r={5} fill="none" stroke="#8B7355" strokeWidth={1.5} opacity={0.7} />
                <circle r={2} fill="#8B7355" opacity={0.8} />
                <text
                  x={8}
                  y={4}
                  fill="#4a3728"
                  fontSize={11}
                  fontFamily="Georgia, serif"
                  fontWeight="700"
                  letterSpacing={1.5}
                  opacity={0.85}
                >
                  {labels[i]}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* Titre */}
      <div style={{
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "Georgia, serif",
        color: "#4a3728",
        fontSize: 20,
        letterSpacing: 4,
        fontWeight: 700,
      }}>
        ROUTE TRANS-SAHARIENNE
      </div>
    </AbsoluteFill>
  );
};
