/**
 * Demo Template B — Carto Caspian V2
 *
 * V2 vs V1 :
 *   - Projection Mercator forcee (pas Globe) via map.setProjection("mercator")
 *   - Continents complets, pas de courbure
 *   - LeaderPin demo sur Niger (composant existant MarqueurPortrait adapte)
 *   - Cartouche texte flottant au-dessus de la carte
 *   - Highlight Niger OR + Algerie INDIGO pour montrer multi-pays Souverain
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
import {
  MapboxBrandingHide,
  lerpCam,
  ISO,
  addCountryHighlight,
} from "../mapbox/MapboxBase";
import {
  applyCartoCaspian,
  CASPIAN_PALETTE,
  CartoCaspianOverlay,
} from "../mapbox/templates/CartoCaspian";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Vue Mercator Afrique-Sahel complete (pas globe)
const CAM_AFRIQUE = { lon: 10.0, lat: 10.0, zoom: 2.6, pitch: 0, bearing: 0 };
const CAM_SAHEL   = { lon:  5.5, lat: 17.5, zoom: 3.8, pitch: 0, bearing: 0 };

// Position Niger sur le canvas (approximative Mercator) pour LeaderPin
const NIGER_PIN_X = 0.545; // ratio 0-1 de gauche a droite (Mercator)
const NIGER_PIN_Y = 0.41;  // ratio 0-1 de haut en bas

export const CARTO_CASPIAN_DEMO_FRAMES = 270;

export const CartoCaspianDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("CartoCaspianDemoV2"));

  const t = interpolate(frame, [0, CARTO_CASPIAN_DEMO_FRAMES - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cam = lerpCam(CAM_AFRIQUE, CAM_SAHEL, t);

  // Apparition des overlays
  const pinScale = spring({ frame: frame - 60, fps, config: { damping: 14, stiffness: 120 }, durationInFrames: 20 });
  const cartoucheOpacity = interpolate(frame, [90, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM_AFRIQUE.lon, CAM_AFRIQUE.lat],
      zoom: CAM_AFRIQUE.zoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
    });

    map.on("style.load", () => {
      // Forcer Mercator plat (pas Globe)
      if (typeof (map as any).setProjection === "function") {
        (map as any).setProjection("mercator");
      }
      applyCartoCaspian(map);
      // Niger en or
      addCountryHighlight(map, ISO.NIGER, CASPIAN_PALETTE.highlightOr, 0.55, 1.2);
      // Algerie en indigo (demontre multi-pays)
      addCountryHighlight(map, ISO.ALGERIE, CASPIAN_PALETTE.highlightIndigo, 0.30, 0.8);
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
    <AbsoluteFill style={{ backgroundColor: CASPIAN_PALETTE.land }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ width, height }} />
      <CartoCaspianOverlay />

      {/* LeaderPin demo — Niger */}
      <div
        style={{
          position: "absolute",
          left: width * NIGER_PIN_X,
          top: height * NIGER_PIN_Y,
          transform: `translate(-50%, -100%) scale(${pinScale})`,
          transformOrigin: "bottom center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            backgroundColor: CASPIAN_PALETTE.highlightOr,
            color: "#1a1a1a",
            fontFamily: "Georgia, serif",
            fontSize: 22,
            fontWeight: 700,
            padding: "8px 18px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}
        >
          Niger
        </div>
        {/* Tige du pin */}
        <div style={{ width: 2, height: 14, backgroundColor: CASPIAN_PALETTE.highlightOr }} />
        {/* Point */}
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: CASPIAN_PALETTE.highlightOr }} />
      </div>

      {/* Cartouche texte editorial */}
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 80,
          opacity: cartoucheOpacity,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.88)",
            border: `1px solid ${CASPIAN_PALETTE.border}`,
            padding: "16px 24px",
            maxWidth: 420,
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#1a1a1a",
              lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            Uranium du Sahel
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: 20,
              color: "#5a5a5a",
            }}
          >
            Niger · Algérie — 2024
          </div>
        </div>
      </div>

      {/* Signature template bas-gauche */}
      <div
        style={{
          position: "absolute",
          left: 44,
          bottom: 44,
          fontFamily: "Georgia, serif",
          fontSize: 18,
          color: "#8a8070",
          fontStyle: "italic",
          letterSpacing: 0.5,
        }}
      >
        Souverain — Template B (Carto Caspian) v2
      </div>
    </AbsoluteFill>
  );
};
