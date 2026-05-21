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
import {
  MapboxBrandingHide,
  lerpCam,
  removeLabels,
  CAM_PRESETS,
  type CamState,
} from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const MAPBOX_MARQUEURS_FRAMES = 300; // 10s @ 30fps

// Points d'ancrage sur la carte Afrique de l'Ouest
const PINS: Array<{
  id: string;
  lon: number;
  lat: number;
  type: "ornement" | "chiffre" | "drapeau" | "photo";
  label: string;
  value?: number;
  color: string;
  appearAt: number;
}> = [
  {
    id: "ghana",
    lon: -1.023, lat: 7.947,
    type: "ornement",
    label: "GHANA",
    color: "#D4AF37",
    appearAt: 30,
  },
  {
    id: "mali",
    lon: -2.0, lat: 17.571,
    type: "chiffre",
    label: "MALI",
    value: 1,
    color: "#E8A020",
    appearAt: 60,
  },
  {
    id: "senegal",
    lon: -14.452, lat: 14.497,
    type: "drapeau",
    label: "SÉNÉGAL",
    color: "#2E7D32",
    appearAt: 90,
  },
  {
    id: "nigeria",
    lon: 8.675, lat: 9.082,
    type: "photo",
    label: "NIGERIA",
    color: "#C62828",
    appearAt: 120,
  },
];

// Caméra : Afrique de l'Ouest centrée
const CAM_WEST_AFRICA: CamState = { lon: -2.0, lat: 11.0, zoom: 3.2, pitch: 20, bearing: 0 };

// ---------------------------------------------------------------------------
// Marqueur type A — Cercle doré ornemental (style atlas premium)
// ---------------------------------------------------------------------------
const MarqueurOrnement: React.FC<{ color: string; label: string; progress: number }> = ({
  color, label, progress,
}) => {
  const scale = spring({ frame: progress * 15, fps: 30, config: { damping: 200 } });
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g style={{ transform: `scale(${scale})`, transformOrigin: "0 0", opacity }}>
      {/* Anneau extérieur */}
      <circle r={22} fill="none" stroke={color} strokeWidth={2} opacity={0.6} />
      {/* Cercle principal */}
      <circle r={16} fill={color} opacity={0.9} />
      {/* Point central */}
      <circle r={4} fill="#1a1209" />
      {/* Ornements — 4 tirets aux angles */}
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = Math.cos(rad) * 18;
        const y1 = Math.sin(rad) * 18;
        const x2 = Math.cos(rad) * 24;
        const y2 = Math.sin(rad) * 24;
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} />;
      })}
      {/* Label */}
      <text
        y={38}
        textAnchor="middle"
        fill={color}
        fontSize={11}
        fontFamily="'Georgia', serif"
        fontWeight="700"
        letterSpacing={2}
      >
        {label}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Marqueur type B — Pion chiffré
// ---------------------------------------------------------------------------
const MarqueurChiffre: React.FC<{ color: string; label: string; value: number; progress: number }> = ({
  color, label, value, progress,
}) => {
  const scale = spring({ frame: progress * 15, fps: 30, config: { damping: 200 } });
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g style={{ transform: `scale(${scale})`, transformOrigin: "0 0", opacity }}>
      {/* Fond hexagonal simulé via cercle */}
      <circle r={18} fill="#1a1209" stroke={color} strokeWidth={2.5} />
      {/* Numéro */}
      <text
        y={6}
        textAnchor="middle"
        fill={color}
        fontSize={16}
        fontFamily="'Georgia', serif"
        fontWeight="900"
      >
        {value}
      </text>
      {/* Pointe basse */}
      <polygon
        points="0,18 -6,28 6,28"
        fill={color}
      />
      {/* Label */}
      <text
        y={44}
        textAnchor="middle"
        fill={color}
        fontSize={10}
        fontFamily="'Georgia', serif"
        fontWeight="700"
        letterSpacing={2}
      >
        {label}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Marqueur type C — Drapeau (SVG inline Sénégal)
// ---------------------------------------------------------------------------
const MarqueurDrapeau: React.FC<{ label: string; progress: number }> = ({ label, progress }) => {
  const scale = spring({ frame: progress * 15, fps: 30, config: { damping: 200 } });
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g style={{ transform: `scale(${scale})`, transformOrigin: "0 0", opacity }}>
      {/* Cercle fond blanc */}
      <circle r={20} fill="#fff" stroke="#ccc" strokeWidth={1.5} />
      {/* Drapeau Sénégal inline — 3 bandes + étoile verte */}
      <clipPath id="circle-clip-sen">
        <circle r={19} />
      </clipPath>
      <g clipPath="url(#circle-clip-sen)">
        <rect x={-19} y={-19} width={13} height={38} fill="#00853F" />
        <rect x={-6}  y={-19} width={12} height={38} fill="#FDEF42" />
        <rect x={6}   y={-19} width={13} height={38} fill="#E31B23" />
        {/* Étoile verte centrale */}
        <text y={5} textAnchor="middle" fill="#00853F" fontSize={14} fontWeight="bold">★</text>
      </g>
      {/* Anneau doré */}
      <circle r={20} fill="none" stroke="#D4AF37" strokeWidth={1.5} />
      {/* Label */}
      <text
        y={36}
        textAnchor="middle"
        fill="#D4AF37"
        fontSize={10}
        fontFamily="'Georgia', serif"
        fontWeight="700"
        letterSpacing={1.5}
      >
        {label}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Marqueur type D — Pion photo (cercle + avatar placeholder)
// ---------------------------------------------------------------------------
const MarqueurPhoto: React.FC<{ color: string; label: string; progress: number }> = ({
  color, label, progress,
}) => {
  const scale = spring({ frame: progress * 15, fps: 30, config: { damping: 200 } });
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g style={{ transform: `scale(${scale})`, transformOrigin: "0 0", opacity }}>
      {/* Anneau couleur */}
      <circle r={22} fill="#1a1209" stroke={color} strokeWidth={3} />
      {/* Avatar placeholder — silhouette */}
      <clipPath id="circle-clip-photo">
        <circle r={19} />
      </clipPath>
      <g clipPath="url(#circle-clip-photo)">
        {/* Fond */}
        <circle r={19} fill="#2a1e0e" />
        {/* Tête */}
        <circle cx={0} cy={-5} r={7} fill={color} opacity={0.7} />
        {/* Corps */}
        <ellipse cx={0} cy={14} rx={11} ry={8} fill={color} opacity={0.5} />
      </g>
      {/* Point bas */}
      <polygon points="0,22 -5,30 5,30" fill={color} />
      {/* Label */}
      <text
        y={44}
        textAnchor="middle"
        fill={color}
        fontSize={10}
        fontFamily="'Georgia', serif"
        fontWeight="700"
        letterSpacing={1.5}
      >
        {label}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Projection lon/lat → pixel screen (via Mapbox)
// ---------------------------------------------------------------------------
const useMapboxProjection = (
  map: mapboxgl.Map | null,
  points: Array<{ lon: number; lat: number }>
) => {
  const [positions, setPositions] = useState<Array<{ x: number; y: number } | null>>(
    points.map(() => null)
  );

  useEffect(() => {
    if (!map) return;

    const update = () => {
      const next = points.map(({ lon, lat }) => {
        const p = map.project([lon, lat]);
        return { x: p.x, y: p.y };
      });
      setPositions(next);
    };

    map.on("move", update);
    map.on("render", update);
    update();

    return () => {
      map.off("move", update);
      map.off("render", update);
    };
  }, [map]);

  return positions;
};

// ---------------------------------------------------------------------------
// Composition principale
// ---------------------------------------------------------------------------
export const MapboxMarqueurs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-marqueurs"));
  const [ready, setReady] = useState(false);

  // Caméra fixe — vue Afrique de l'Ouest
  useEffect(() => {
    if (!containerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [CAM_WEST_AFRICA.lon, CAM_WEST_AFRICA.lat],
      zoom: CAM_WEST_AFRICA.zoom,
      pitch: CAM_WEST_AFRICA.pitch,
      bearing: CAM_WEST_AFRICA.bearing,
      interactive: false,
      preserveDrawingBuffer: true,
    });

    map.on("style.load", () => {
      removeLabels(map);

      // Teinte GéoAfrique sur océan
      if (map.getLayer("water")) {
        map.setPaintProperty("water", "fill-color", "#03224c");
      }
      if (map.getLayer("background")) {
        map.setPaintProperty("background", "fill-color", "#2a1e0e");
      }

      mapRef.current = map;
      setReady(true);
      continueRender(handle);
    });

    return () => map.remove();
  }, []);

  const positions = useMapboxProjection(
    mapRef.current,
    PINS.map((p) => ({ lon: p.lon, lat: p.lat }))
  );

  return (
    <AbsoluteFill style={{ background: "#1a1209" }}>
      <MapboxBrandingHide />

      {/* Carte Mapbox */}
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, width, height }}
      />

      {/* Overlay SVG — marqueurs */}
      {ready && (
        <svg
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
          width={width}
          height={height}
        >
          {PINS.map((pin, i) => {
            const pos = positions[i];
            if (!pos) return null;

            const elapsed = frame - pin.appearAt;
            if (elapsed < 0) return null;
            const progress = Math.max(0, Math.min(1, elapsed / 30));

            return (
              <g key={pin.id} transform={`translate(${pos.x}, ${pos.y})`}>
                {pin.type === "ornement" && (
                  <MarqueurOrnement color={pin.color} label={pin.label} progress={progress} />
                )}
                {pin.type === "chiffre" && pin.value !== undefined && (
                  <MarqueurChiffre color={pin.color} label={pin.label} value={pin.value} progress={progress} />
                )}
                {pin.type === "drapeau" && (
                  <MarqueurDrapeau label={pin.label} progress={progress} />
                )}
                {pin.type === "photo" && (
                  <MarqueurPhoto color={pin.color} label={pin.label} progress={progress} />
                )}
              </g>
            );
          })}
        </svg>
      )}

      {/* Légende en bas */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 48,
          opacity: interpolate(frame, [150, 180], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {[
          { label: "ORNEMENTAL", color: "#D4AF37" },
          { label: "CHIFFRÉ", color: "#E8A020" },
          { label: "DRAPEAU", color: "#D4AF37" },
          { label: "PHOTO", color: "#C62828" },
        ].map(({ label, color }) => (
          <div
            key={label}
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 11,
              letterSpacing: 2,
              color,
              opacity: 0.8,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
