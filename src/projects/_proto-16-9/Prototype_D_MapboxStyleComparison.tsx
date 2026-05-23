/**
 * Prototype D — Mapbox Style Comparison (Vague 1.5)
 *
 * 3 scenes sequentielles (5s chacune) pour comparer visuellement les 3 styles Mapbox
 * sur la même vue Afrique Ouest / Sénégal :
 *   Scene 1 — GeoAfrique V5 (dark-v11 + overrides)
 *   Scene 2 — CartoCaspian (streets-v12 + overrides sepia/cream)
 *   Scene 3 — Satellite Senegal (satellite-v9 + applyAtlasRealiste3D)
 *
 * Render : ./scripts/render-mapbox.sh ProtoD-MapboxStyleComparison out/_proto-16-9/ProtoD-MapboxStyleComparison-v1.mp4
 *
 * Vue cadre sur le Sénégal (pitch 35, bearing -10, zoom 4.8)
 * pour que les 3 styles soient lisibles sur la même zone geographique.
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  MapboxBrandingHide,
  applyGeoAfriqueV5,
} from "../_shared/mapbox/MapboxBase";
import { applyCartoCaspian } from "../_shared/mapbox/templates/CartoCaspian";
import {
  applyAtlasRealiste3D,
  addCountryFocus,
  ATLAS3D_PALETTE,
} from "../_shared/mapbox/templates/AtlasRealiste3D";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const CAM = { lon: -15.5, lat: 14.5, zoom: 4.8, pitch: 35, bearing: -10 };

type StyleId = "geoafrique" | "caspian" | "satellite";

interface MapPanelProps {
  styleId: StyleId;
  label: string;
  sublabel: string;
  accentColor: string;
}

const MapPanel: React.FC<MapPanelProps> = ({ styleId, label, sublabel, accentColor }) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender(`MapPanel-${styleId}`));

  const mapboxStyle =
    styleId === "satellite" ? "mapbox://styles/mapbox/satellite-v9" :
    styleId === "caspian"   ? "mapbox://styles/mapbox/streets-v12" :
                              "mapbox://styles/mapbox/dark-v11";

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapboxStyle,
      center: [CAM.lon, CAM.lat],
      zoom: CAM.zoom,
      pitch: CAM.pitch,
      bearing: CAM.bearing,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
    });

    map.on("style.load", () => {
      if (typeof (map as any).setProjection === "function") {
        (map as any).setProjection("mercator");
      }

      if (styleId === "geoafrique") {
        applyGeoAfriqueV5(map);
      } else if (styleId === "caspian") {
        applyCartoCaspian(map);
      } else {
        applyAtlasRealiste3D(map);
        addCountryFocus(map, "SEN", ATLAS3D_PALETTE.accentOr, 0.55);
      }

      mapRef.current = map;
      continueRender(handle);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handle, styleId, mapboxStyle]);

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <MapboxBrandingHide />
      <div
        ref={mapContainerRef}
        style={{ position: "absolute", inset: 0, width, height }}
      />

      <AbsoluteFill style={{ pointerEvents: "none", opacity: labelOpacity }}>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 80,
            backgroundColor: "rgba(0,0,0,0.75)",
            border: `2px solid ${accentColor}`,
            padding: "16px 28px",
            borderRadius: 4,
          }}
        >
          <div style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 14,
            letterSpacing: 4,
            color: accentColor,
            textTransform: "uppercase",
            marginBottom: 6,
          }}>
            {sublabel}
          </div>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 36,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 1,
          }}>
            {label}
          </div>
        </div>

        <div style={{
          position: "absolute",
          top: 40,
          right: 80,
          backgroundColor: "rgba(0,0,0,0.65)",
          border: `1px solid rgba(255,255,255,0.2)`,
          padding: "8px 16px",
          borderRadius: 3,
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 13,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: 2,
        }}>
          SENEGAL · AFRIQUE DE L'OUEST
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SCENE = 5 * 30;

export const Prototype_D_MapboxStyleComparison: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={SCENE} premountFor={30}>
        <MapPanel
          styleId="geoafrique"
          label="GeoAfrique V5"
          sublabel="Style 1 / Dark signature"
          accentColor="#c8a951"
        />
      </Sequence>

      <Sequence from={SCENE} durationInFrames={SCENE} premountFor={30}>
        <MapPanel
          styleId="caspian"
          label="CartoCaspian"
          sublabel="Style 2 / Editorial sepia"
          accentColor="#bcd5e3"
        />
      </Sequence>

      <Sequence from={SCENE * 2} durationInFrames={SCENE} premountFor={30}>
        <MapPanel
          styleId="satellite"
          label="Satellite Senegal"
          sublabel="Style 3 / Drone agence"
          accentColor="#f0a050"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
