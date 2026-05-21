/**
 * Demo Template C — Atlas Réaliste 3D
 *
 * Demontre :
 *   - Satellite desature
 *   - Mask monde gris + Niger focus or
 *   - Drift pitch 0->50 (tilt 3D oblique progressif)
 *   - Cartouche noir + border or
 *   - LeaderPin minimal
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
import { MapboxBrandingHide, lerpCam } from "../mapbox/MapboxBase";
import { applyAtlasRealiste3D, addCountryMask, ATLAS3D_PALETTE } from "../mapbox/templates/AtlasRealiste3D";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const CAM_WIDE  = { lon: 8.0,  lat: 17.0, zoom: 3.2, pitch: 0,  bearing: 0 };
const CAM_TILT  = { lon: 8.08, lat: 17.6, zoom: 4.2, pitch: 52, bearing: -8 };

export const ATLAS_REALISTE_3D_DEMO_FRAMES = 270;

export const AtlasRealiste3DDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("AtlasRealiste3DDemo"));

  // Phase A (0-90) : vue large satellite
  // Phase B (90-270) : tilt progressif vers vue oblique
  const tiltT = interpolate(frame, [90, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cam = lerpCam(CAM_WIDE, CAM_TILT, tiltT);

  const cartoucheOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pinScale = spring({ frame: frame - 45, fps, config: { damping: 14, stiffness: 120 }, durationInFrames: 20 });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [CAM_WIDE.lon, CAM_WIDE.lat],
      zoom: CAM_WIDE.zoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
    });

    map.on("style.load", () => {
      if (typeof (map as any).setProjection === "function") {
        (map as any).setProjection("mercator");
      }
      applyAtlasRealiste3D(map);
      addCountryMask(map, "NER", ATLAS3D_PALETTE.accentOr, 0.6);
      mapRef.current = map;
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.jumpTo({ center: [cam.lon, cam.lat], zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing });
  }, [cam.lon, cam.lat, cam.zoom, cam.pitch, cam.bearing]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1e22" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ width, height }} />

      {/* Cartouche noir signature Template C */}
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 80,
          opacity: cartoucheOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: ATLAS3D_PALETTE.cartoucheBackground,
            border: `1px solid ${ATLAS3D_PALETTE.cartoucheBorder}`,
            padding: "14px 22px",
            maxWidth: 380,
          }}
        >
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 32,
            fontWeight: 700,
            color: ATLAS3D_PALETTE.cartoucheText,
            letterSpacing: 1,
          }}>
            NIGER
          </div>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 20,
            color: ATLAS3D_PALETTE.accentOr,
            marginTop: 4,
            fontStyle: "italic",
          }}>
            7e réserve mondiale d'uranium
          </div>
        </div>
      </div>

      {/* LeaderPin minimal */}
      <div
        style={{
          position: "absolute",
          left: width * 0.56,
          top: height * 0.44,
          transform: `translate(-50%, -100%) scale(${pinScale})`,
          transformOrigin: "bottom center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: ATLAS3D_PALETTE.accentOr,
          border: "2px solid white",
          boxShadow: "0 0 8px rgba(212,169,60,0.8)",
        }} />
      </div>

      <div style={{
        position: "absolute",
        left: 44,
        bottom: 44,
        fontFamily: "Georgia, serif",
        fontSize: 18,
        color: "rgba(255,255,255,0.4)",
        fontStyle: "italic",
      }}>
        Souverain — Template C (Atlas réaliste 3D) v1
      </div>
    </AbsoluteFill>
  );
};
