/**
 * Prototype A v2 — Mapbox Satellite Senegal/Sangomar (16:9)
 *
 * Pattern : copy of AtlasRealiste3DShowcase (validated production), targeting Senegal.
 * Style satellite-v9 + applyAtlasRealiste3D + addCountryFocus.
 * Renders via `./scripts/render-mapbox.sh ProtoA-MapboxSatelliteSenegal out/...`
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
import { MapboxBrandingHide } from "../_shared/mapbox/MapboxBase";
import { applyAtlasRealiste3D, addCountryFocus, ATLAS3D_PALETTE } from "../_shared/mapbox/templates/AtlasRealiste3D";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const HIGHLIGHT_OR = ATLAS3D_PALETTE.accentOr;

const CAM_START = { lon: -5,     lat: 14,    zoom: 2.6, pitch: 0,  bearing: 0 };
const CAM_MID   = { lon: -15.5,  lat: 14.5,  zoom: 5.2, pitch: 35, bearing: -10 };
const CAM_END   = { lon: -16.65, lat: 13.95, zoom: 6.4, pitch: 55, bearing: -20 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const lerpCam = (a: typeof CAM_START, b: typeof CAM_END, t: number) => ({
  lon: lerp(a.lon, b.lon, t),
  lat: lerp(a.lat, b.lat, t),
  zoom: lerp(a.zoom, b.zoom, t),
  pitch: lerp(a.pitch, b.pitch, t),
  bearing: lerp(a.bearing, b.bearing, t),
});

const cameraAt = (frame: number) => {
  if (frame <= 0) return CAM_START;
  if (frame <= 90) return lerpCam(CAM_START, CAM_MID, frame / 90);
  if (frame <= 180) return lerpCam(CAM_MID, CAM_END, (frame - 90) / 90);
  return CAM_END;
};

export const Prototype_A_MapboxSatelliteSenegal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Prototype_A_MapboxSatelliteSenegal"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [CAM_START.lon, CAM_START.lat],
      zoom: CAM_START.zoom,
      pitch: CAM_START.pitch,
      bearing: CAM_START.bearing,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
    });

    map.on("style.load", () => {
      if (typeof (map as any).setProjection === "function") {
        (map as any).setProjection("mercator");
      }
      applyAtlasRealiste3D(map);
      addCountryFocus(map, "SEN", HIGHLIGHT_OR, 0.55);
      mapRef.current = map;
      setReady(true);
      continueRender(handle);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handle]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const cam = cameraAt(frame);
    mapRef.current.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
    });
  }, [frame, ready]);

  const cartoucheProgress = spring({
    frame: frame - 60,
    fps,
    config: { damping: 18, stiffness: 90 },
    durationInFrames: 25,
  });

  const subtitleOpacity = interpolate(frame, [105, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <MapboxBrandingHide />
      <div ref={mapContainerRef} style={{ position: "absolute", inset: 0, width, height }} />

      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }} />

      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 80,
            transform: `translateX(${(1 - cartoucheProgress) * -40}px)`,
            opacity: cartoucheProgress,
            backgroundColor: ATLAS3D_PALETTE.cartoucheBackground,
            border: `2px solid ${HIGHLIGHT_OR}`,
            padding: "18px 28px",
            borderRadius: 4,
          }}
        >
          <div style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 22,
            fontStyle: "italic",
            color: HIGHLIGHT_OR,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 6,
          }}>
            Senegal
          </div>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 44,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 2,
          }}>
            BLOC SANGOMAR
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            opacity: subtitleOpacity,
            backgroundColor: "rgba(10,10,10,0.75)",
            border: `1px solid ${HIGHLIGHT_OR}`,
            padding: "12px 20px",
            borderRadius: 3,
            fontFamily: "Georgia, serif",
            fontSize: 20,
            color: "#ffffff",
            letterSpacing: 1,
          }}
        >
          100 km offshore &mdash; Operateur Woodside Energy
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
