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

export const MAPBOX_TEXTURES_FRAMES = 600; // 20s @ 30fps

// 4 effets x 5s chacun — apparition sequentielle
const SEGMENTS = {
  GRAIN:     { start: 0,   end: 150 },
  BORDURE:   { start: 150, end: 300 },
  VIGNETTE:  { start: 300, end: 450 },
  PARCHEMIN: { start: 450, end: 600 },
};

// Cameras — Afrique de l'Ouest, vue claire
const CAM_LIGHT: CamState  = { lon: -3.5,  lat: 12.5, zoom: 3.6, pitch: 10, bearing: 0 };
const CAM_PARCHEMIN: CamState = { lon: 5.0, lat: 20.0, zoom: 3.2, pitch: 25, bearing: 5 };

// ---------------------------------------------------------------------------
// Effet 1 — Grain papier (overlay SVG noise + mix-blend-mode multiply)
// ---------------------------------------------------------------------------
const GrainOverlay: React.FC<{ opacity: number; width: number; height: number }> = ({ opacity, width, height }) => (
  <svg
    style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", pointerEvents: "none" }}
    width={width}
    height={height}
  >
    <filter id="grain-filter">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.65"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
      <feBlend in="SourceGraphic" mode="multiply" />
    </filter>
    <rect
      width={width}
      height={height}
      filter="url(#grain-filter)"
      opacity={opacity * 0.35}
      fill="#8B6914"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Effet 2 — Bordure ornement (cadre SVG style atlas)
// ---------------------------------------------------------------------------
const BordureOrnement: React.FC<{ opacity: number; width: number; height: number }> = ({ opacity, width, height }) => {
  const m = 24; // marge intérieure
  const color = "#8B5E3C";
  return (
    <svg
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      width={width}
      height={height}
    >
      {/* Cadre double */}
      <rect x={m} y={m} width={width - m * 2} height={height - m * 2}
        fill="none" stroke={color} strokeWidth={2} opacity={opacity * 0.8} />
      <rect x={m + 6} y={m + 6} width={width - (m + 6) * 2} height={height - (m + 6) * 2}
        fill="none" stroke={color} strokeWidth={1} opacity={opacity * 0.5} />

      {/* Coins ornementaux — chaque coin */}
      {[
        [m, m, 0],
        [width - m, m, 90],
        [width - m, height - m, 180],
        [m, height - m, 270],
      ].map(([cx, cy, rot], i) => (
        <g key={i} transform={`translate(${cx}, ${cy}) rotate(${rot})`} opacity={opacity}>
          <line x1={0} y1={0} x2={20} y2={0}  stroke={color} strokeWidth={2} />
          <line x1={0} y1={0} x2={0}  y2={20} stroke={color} strokeWidth={2} />
          <circle cx={8} cy={8} r={2.5} fill={color} />
        </g>
      ))}

      {/* Milieu des bords — tirets ornementaux */}
      {[
        [width / 2, m],
        [width / 2, height - m],
        [m, height / 2],
        [width - m, height / 2],
      ].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx}, ${cy})`} opacity={opacity * 0.6}>
          <circle r={3} fill={color} />
          <circle r={6} fill="none" stroke={color} strokeWidth={1} />
        </g>
      ))}

      {/* Label titre en haut */}
      <text
        x={width / 2} y={m - 6}
        textAnchor="middle"
        fill={color}
        fontSize={11}
        fontFamily="Georgia, serif"
        letterSpacing={3}
        opacity={opacity * 0.9}
      >
        ATLAS GÉOGRAPHIQUE
      </text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Effet 3 — Vignette douce (gradient radial depuis les bords)
// ---------------------------------------------------------------------------
const Vignette: React.FC<{ opacity: number; width: number; height: number }> = ({ opacity, width, height }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${opacity * 0.55}) 100%)`,
    }}
  />
);

// ---------------------------------------------------------------------------
// Effet 4 — Style parchemin (fond chaud + grain léger + bordure)
// Ici on change juste la teinte de fond via overlay (Mapbox reste light)
// ---------------------------------------------------------------------------
const ParcheminOverlay: React.FC<{ opacity: number; width: number; height: number }> = ({ opacity, width, height }) => (
  <>
    {/* Teinte parchemin sur toute la carte */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: "rgba(210, 180, 120, 0.28)",
        mixBlendMode: "multiply",
        opacity,
      }}
    />
    {/* Grain léger par-dessus */}
    <svg
      style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "multiply" }}
      width={width}
      height={height}
    >
      <filter id="parchemin-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={width} height={height} filter="url(#parchemin-grain)" opacity={opacity * 0.2} fill="#8B6914" />
    </svg>
    {/* Bordure parchemin */}
    <BordureOrnement opacity={opacity * 0.7} width={width} height={height} />
  </>
);

// ---------------------------------------------------------------------------
// Badge nom effet
// ---------------------------------------------------------------------------
const EffetBadge: React.FC<{ label: string; description: string; opacity: number; width: number }> = ({
  label, description, opacity, width,
}) => (
  <div style={{
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    opacity,
    pointerEvents: "none",
  }}>
    <div style={{
      background: "rgba(0,0,0,0.55)",
      padding: "6px 20px",
      borderRadius: 4,
      fontFamily: "Georgia, serif",
      fontSize: 13,
      letterSpacing: 3,
      color: "#D4AF37",
      fontWeight: 700,
    }}>
      {label}
    </div>
    <div style={{
      fontFamily: "Georgia, serif",
      fontSize: 10,
      letterSpacing: 1.5,
      color: "#ffffff",
      opacity: 0.65,
    }}>
      {description}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Composition principale — 1080×1920 vertical, fond light-v11
// ---------------------------------------------------------------------------
export const MapboxTextures: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-textures"));
  const [ready, setReady] = useState(false);

  // Changer camera sur segment parchemin
  const isParchemin = frame >= SEGMENTS.PARCHEMIN.start;
  const cam = isParchemin ? CAM_PARCHEMIN : CAM_LIGHT;

  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM_LIGHT.lon, CAM_LIGHT.lat],
      zoom: CAM_LIGHT.zoom,
      pitch: CAM_LIGHT.pitch,
      bearing: CAM_LIGHT.bearing,
      interactive: false,
      preserveDrawingBuffer: true,
    });

    map.on("style.load", () => {
      mapRef.current = map;
      setReady(true);
      continueRender(handle);
    });

    return () => map.remove();
  }, []);

  // Mise a jour camera
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.jumpTo({ center: [cam.lon, cam.lat], zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing });
  }, [isParchemin]);

  // Opacités par segment avec fade in/out
  const grainOp    = interpolate(frame, [SEGMENTS.GRAIN.start,    SEGMENTS.GRAIN.start + 20,    SEGMENTS.GRAIN.end - 20,    SEGMENTS.GRAIN.end],    [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const bordureOp  = interpolate(frame, [SEGMENTS.BORDURE.start,  SEGMENTS.BORDURE.start + 20,  SEGMENTS.BORDURE.end - 20,  SEGMENTS.BORDURE.end],  [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const vignetteOp = interpolate(frame, [SEGMENTS.VIGNETTE.start, SEGMENTS.VIGNETTE.start + 20, SEGMENTS.VIGNETTE.end - 20, SEGMENTS.VIGNETTE.end], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const parcheminOp= interpolate(frame, [SEGMENTS.PARCHEMIN.start,SEGMENTS.PARCHEMIN.start + 20], [0, 1], { extrapolateRight: "clamp" });

  const showGrain    = frame >= SEGMENTS.GRAIN.start    && frame < SEGMENTS.GRAIN.end;
  const showBordure  = frame >= SEGMENTS.BORDURE.start  && frame < SEGMENTS.BORDURE.end;
  const showVignette = frame >= SEGMENTS.VIGNETTE.start && frame < SEGMENTS.VIGNETTE.end;
  const showParchemin= frame >= SEGMENTS.PARCHEMIN.start;

  return (
    <AbsoluteFill style={{ background: "#e8e4dc" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />

      {ready && (
        <>
          {showGrain    && <GrainOverlay    opacity={grainOp}    width={width} height={height} />}
          {showBordure  && <BordureOrnement opacity={bordureOp}  width={width} height={height} />}
          {showVignette && <Vignette        opacity={vignetteOp} width={width} height={height} />}
          {showParchemin && <ParcheminOverlay opacity={parcheminOp} width={width} height={height} />}

          {showGrain    && <EffetBadge label="GRAIN PAPIER"     description="feTurbulence + mix-blend-mode multiply"         opacity={grainOp}    width={width} />}
          {showBordure  && <EffetBadge label="BORDURE ATLAS"    description="Cadre SVG double + coins ornementaux"           opacity={bordureOp}  width={width} />}
          {showVignette && <EffetBadge label="VIGNETTE DOUCE"   description="Radial gradient depuis les bords"               opacity={vignetteOp} width={width} />}
          {showParchemin && <EffetBadge label="PARCHEMIN MANDE" description="Teinte chaude + grain + bordure — registre Atlas historique" opacity={parcheminOp} width={width} />}
        </>
      )}
    </AbsoluteFill>
  );
};
