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

export const MAPBOX_KEN_BURNS_V2_FRAMES = 210; // 7s @ 30fps

// Cameras
const CAM_SPACE = { lon: -5.0, lat: 15.0, zoom: 2.5, pitch: 0,  bearing: 0  };
const CAM_MID   = { lon: -3.5, lat: 14.5, zoom: 4.5, pitch: 35, bearing: 0  };
const CAM_CLOSE = { lon: -2.0, lat: 16.0, zoom: 6.0, pitch: 55, bearing: 10 };

// Easing quadratique
const ease = (t: number): number =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * ease(Math.max(0, Math.min(1, t)));

// ---------------------------------------------------------------------------
// Composition principale
// ---------------------------------------------------------------------------
export const MapboxKenBurnsV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const styleChanged = useRef(false);

  // 2 delayRender handles — 1 pour le style initial, 1 pour le setStyle
  const [handle1] = useState(() => delayRender("mapbox-ken-burns-v2-init"));
  const [handle2, setHandle2] = useState<number | null>(null);
  const [ready, setReady]     = useState(false);

  // Initialisation de la carte (style satellite)
  useEffect(() => {
    if (!containerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container:            containerRef.current,
      style:                "mapbox://styles/mapbox/satellite-v9",
      center:               [CAM_SPACE.lon, CAM_SPACE.lat],
      zoom:                 CAM_SPACE.zoom,
      pitch:                CAM_SPACE.pitch,
      bearing:              CAM_SPACE.bearing,
      interactive:          false,
      preserveDrawingBuffer: true,
    });

    map.once("style.load", () => {
      mapRef.current = map;
      setReady(true);
      continueRender(handle1);
    });

    return () => {
      map.remove();
    };
  }, []);

  // Switch de style satellite -> dark a f=140
  useEffect(() => {
    if (!ready || !mapRef.current || styleChanged.current) return;
    if (frame < 140) return;

    styleChanged.current = true;
    const h2 = delayRender("mapbox-ken-burns-v2-style-switch");
    setHandle2(h2);

    mapRef.current.setStyle("mapbox://styles/mapbox/dark-v11");
    mapRef.current.once("style.load", () => {
      if (mapRef.current) {
        removeLabels(mapRef.current);
      }
      continueRender(h2);
    });
  }, [ready, frame >= 140]);

  // Mise a jour camera chaque frame via jumpTo + easing quadratique
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (frame <= 70) {
      // Phase 1 : f0-70 — espace -> Afrique de l'Ouest
      const t = frame / 70;
      map.jumpTo({
        center:  [lerp(CAM_SPACE.lon, CAM_MID.lon, t), lerp(CAM_SPACE.lat, CAM_MID.lat, t)],
        zoom:    lerp(CAM_SPACE.zoom, CAM_MID.zoom, t),
        pitch:   lerp(CAM_SPACE.pitch, CAM_MID.pitch, t),
        bearing: lerp(CAM_SPACE.bearing, CAM_MID.bearing, t),
      });
    } else if (frame <= 140) {
      // Phase 2 : f70-140 — plongee vers Afrique de l'Ouest
      const t = (frame - 70) / 70;
      map.jumpTo({
        center:  [lerp(CAM_MID.lon, CAM_CLOSE.lon, t), lerp(CAM_MID.lat, CAM_CLOSE.lat, t)],
        zoom:    lerp(CAM_MID.zoom, CAM_CLOSE.zoom, t),
        pitch:   lerp(CAM_MID.pitch, CAM_CLOSE.pitch, t),
        bearing: lerp(CAM_MID.bearing, CAM_CLOSE.bearing, t),
      });
    } else {
      // Phase 3 : f140-210 — Mali/Sahel (camera fixe, style dark)
      map.jumpTo({
        center:  [CAM_CLOSE.lon, CAM_CLOSE.lat],
        zoom:    CAM_CLOSE.zoom,
        pitch:   CAM_CLOSE.pitch,
        bearing: CAM_CLOSE.bearing,
      });
    }
  }, [frame]);

  // Overlay noir pendant la transition de style (f120-150)
  const overlayOpacity = interpolate(
    frame,
    [120, 140, 150],
    [0, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Label "MALI — 1 235 000 km²" — apparait en fondu a f=180
  const labelOpacity = interpolate(
    frame,
    [180, 200],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MapboxBrandingHide />

      {/* Conteneur Mapbox */}
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, width, height }}
      />

      {/* Overlay fondu pendant le switch de style satellite -> dark */}
      <div
        style={{
          position:       "absolute",
          inset:          0,
          background:     "#000",
          opacity:        overlayOpacity,
          pointerEvents:  "none",
        }}
      />

      {/* Label final style Atlas */}
      {ready && (
        <div
          style={{
            position:      "absolute",
            bottom:        120,
            left:          0,
            right:         0,
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            gap:           8,
            opacity:       labelOpacity,
            pointerEvents: "none",
          }}
        >
          {/* Ligne decorative */}
          <div style={{
            width:       80,
            height:      1,
            background:  "#D4AF37",
            opacity:     0.7,
          }} />
          {/* Nom pays */}
          <div style={{
            fontFamily:    "Georgia, serif",
            fontSize:      36,
            fontWeight:    700,
            letterSpacing: 6,
            color:         "#D4AF37",
            textTransform: "uppercase",
          }}>
            MALI
          </div>
          {/* Superficie */}
          <div style={{
            fontFamily:    "Georgia, serif",
            fontSize:      16,
            letterSpacing: 3,
            color:         "#ffffff",
            opacity:       0.75,
          }}>
            1 235 000 km²
          </div>
          {/* Ligne decorative */}
          <div style={{
            width:       80,
            height:      1,
            background:  "#D4AF37",
            opacity:     0.7,
          }} />
        </div>
      )}
    </AbsoluteFill>
  );
};
