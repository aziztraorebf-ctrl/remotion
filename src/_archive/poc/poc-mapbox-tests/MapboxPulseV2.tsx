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
import {
  MapboxBrandingHide,
  removeLabels,
  type CamState,
} from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const MAPBOX_PULSE_V2_FRAMES = 150; // 5s @ 30fps

// Tombouctou
const TIMBUKTU: [number, number] = [-3.0, 16.8];

const CAM: CamState = {
  lon: -3.0,
  lat: 16.8,
  zoom: 5.5,
  pitch: 20,
  bearing: 0,
};

// Couleurs par intensite d'onde (interieure -> exterieure)
const WAVE_COLORS = ["#FF4500", "#E8A020", "#D4AF37"] as const;

// Rayon max des ondes en pixels (espace SVG 1080x1920 — echelle visuelle)
const WAVE_MAX_R = 160;
const WAVE_MIN_R = 20;
// Decalage entre chaque onde (frames)
const WAVE_OFFSET = 25;
// Duree d'un cycle complet (frames)
const WAVE_CYCLE = 75;

// ---------------------------------------------------------------------------
// Hook projection Mapbox -> pixel
// ---------------------------------------------------------------------------
const useProjection = (map: mapboxgl.Map | null, point: [number, number]) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!map) return;
    const update = () => {
      const p = map.project(point);
      setPos({ x: p.x, y: p.y });
    };
    map.on("render", update);
    update();
    return () => {
      map.off("render", update);
    };
  }, [map]);
  return pos;
};

// ---------------------------------------------------------------------------
// Onde individuelle avec couleur parametree
// ---------------------------------------------------------------------------
const Wave: React.FC<{ frame: number; delay: number; color: string }> = ({
  frame,
  delay,
  color,
}) => {
  const t = ((frame - delay) % WAVE_CYCLE) / WAVE_CYCLE;
  const tClamped = Math.max(0, t);
  const r = WAVE_MIN_R + tClamped * (WAVE_MAX_R - WAVE_MIN_R);
  const opacity = (1 - tClamped) * 0.7;
  return (
    <circle
      r={r}
      fill="none"
      stroke={color}
      strokeWidth={2}
      opacity={opacity}
    />
  );
};

// ---------------------------------------------------------------------------
// Point central pulsant
// ---------------------------------------------------------------------------
const CenterDot: React.FC<{ frame: number }> = ({ frame }) => {
  const scale = 0.8 + 0.4 * ((Math.sin((frame / 30) * Math.PI * 2) + 1) / 2);
  return (
    <g transform={`scale(${scale})`}>
      <circle r={10} fill="#FF4500" opacity={0.95} />
      <circle r={4} fill="#ffffff" opacity={0.85} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Anneau statique style "cible"
// ---------------------------------------------------------------------------
const StaticRing: React.FC = () => (
  <>
    <circle r={18} fill="none" stroke="#D4AF37" strokeWidth={2} opacity={0.9} />
    <circle r={22} fill="none" stroke="#D4AF37" strokeWidth={0.8} opacity={0.4} />
    {/* Croix de cible aux 4 extremites */}
    {[0, 90, 180, 270].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      return (
        <line
          key={angle}
          x1={Math.cos(rad) * 23}
          y1={Math.sin(rad) * 23}
          x2={Math.cos(rad) * 29}
          y2={Math.sin(rad) * 29}
          stroke="#D4AF37"
          strokeWidth={1.5}
          opacity={0.8}
        />
      );
    })}
  </>
);

// ---------------------------------------------------------------------------
// Label TOMBOUCTOU + stat coordonnees
// Opacity synchronisee avec l'onde interieure (delay=0)
// ---------------------------------------------------------------------------
const PulsingLabel: React.FC<{ frame: number }> = ({ frame }) => {
  // L'onde interieure est la plus brillante quand t est proche de 0 ou 1
  // On cree une pulsation : pic au moment ou l'onde repart du centre
  const t = (frame % WAVE_CYCLE) / WAVE_CYCLE;
  // Opacity max au debut du cycle (t ~ 0), descend a 0.4 au milieu
  const labelOpacity = interpolate(t, [0, 0.25, 0.75, 1.0], [1, 0.55, 0.55, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Apparition initiale douce
  const introOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const finalOpacity = introOpacity * labelOpacity;

  return (
    <g opacity={finalOpacity} transform="translate(0, -200)">
      {/* Fond du label */}
      <rect
        x={-100}
        y={-26}
        width={200}
        height={52}
        rx={4}
        fill="#0a0a0a"
        opacity={0.75}
      />
      {/* Bande superieure doree */}
      <rect x={-100} y={-26} width={200} height={3} rx={1} fill="#D4AF37" opacity={0.9} />
      {/* Titre */}
      <text
        y={4}
        textAnchor="middle"
        fill="#D4AF37"
        fontSize={18}
        fontFamily="Georgia, serif"
        fontWeight="700"
        letterSpacing={3}
      >
        TOMBOUCTOU
      </text>
      {/* Coordonnees */}
      <text
        y={18}
        textAnchor="middle"
        fill="#E8A020"
        fontSize={11}
        fontFamily="Georgia, serif"
        letterSpacing={1.5}
        opacity={0.85}
      >
        16.8&#176;N &#8212; 3.0&#176;W
      </text>
      {/* Ligne pointillee vers le point central */}
      <line
        x1={0}
        y1={26}
        x2={0}
        y2={170}
        stroke="#D4AF37"
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.5}
      />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Composition principale 1080x1920
// ---------------------------------------------------------------------------
export const MapboxPulseV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-pulse-v2"));
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

  const center = useProjection(mapRef.current, TIMBUKTU);

  return (
    <AbsoluteFill style={{ background: "#f0ece4" }}>
      <MapboxBrandingHide />
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, width, height }}
      />

      {ready && center && (
        <svg
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
          width={width}
          height={height}
        >
          <g transform={`translate(${center.x}, ${center.y})`}>
            {/* 3 ondes concentriques — decalees de 25 frames — couleurs par intensite */}
            <Wave frame={frame} delay={0}            color={WAVE_COLORS[0]} />
            <Wave frame={frame} delay={WAVE_OFFSET}  color={WAVE_COLORS[1]} />
            <Wave frame={frame} delay={WAVE_OFFSET * 2} color={WAVE_COLORS[2]} />

            {/* Anneau statique "cible" autour du point central */}
            <StaticRing />

            {/* Point central pulsant */}
            <CenterDot frame={frame} />

            {/* Label pulsant */}
            <PulsingLabel frame={frame} />
          </g>
        </svg>
      )}
    </AbsoluteFill>
  );
};
