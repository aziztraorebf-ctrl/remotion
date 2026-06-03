/**
 * RapidFireCountries — HOOK : rafale ultra-rapide de pays (drapeau plein cadre + nom) facon
 * montage cut TikTok, puis FREEZE sur LE pays du sujet qui s'allume sur la carte.
 *
 * Idee Aziz (Chantier HOOK). Energie = cuts rapides d'OVERLAYS (4-6 frames/pays), pas la camera.
 * La carte Mapbox reste sur un cadrage stable (drift tres leger) → zero probleme de tuiles.
 *
 * Mecanique :
 *   0 → N*cut : chaque pays flashe plein cadre (bande drapeau + nom geant) ~5 frames, cut sec
 *   apres rafale : freeze → la carte (deja en place) prend le dessus, le pays focus s'allume gold
 *                  + son drapeau rempli (clip) + nom, le reste s'efface.
 *
 * Usage :
 *   <RapidFireCountries center={[0,12]} baseZoom={3.0} focusIso="SEN"
 *     flash={[{code:"ng",name:"NIGERIA"},{code:"gh",name:"GHANA"},...]} focus={{code:"sn",name:"SENEGAL"}}
 *     cutFrames={5} />
 *
 * IMPORTANT : render via scripts/render-mapbox.sh (WebGL headless).
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
import { applyGeoAfriqueV5, MapboxBrandingHide } from "./MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY = "#16213a";

export interface RapidFlashItem {
  code: string; // ISO-2 flagcdn
  name: string;
}
export interface RapidFocus {
  iso: string; // ISO-3 pour highlight Mapbox
  code: string; // ISO-2 flagcdn
  name: string;
}

export interface RapidFireCountriesProps {
  center: [number, number];
  baseZoom?: number;
  /** Pays qui flashent en rafale (avant le focus) */
  flash: RapidFlashItem[];
  /** Pays final sur lequel on freeze */
  focus: RapidFocus;
  /** Nombre de frames par flash (4-6 = punchy) */
  cutFrames?: number;
  /** Frame de demarrage de la rafale */
  startAt?: number;
  accentColor?: string;
  durationFrames?: number;
}

export const RapidFireCountries: React.FC<RapidFireCountriesProps> = ({
  center,
  baseZoom = 3.0,
  flash,
  focus,
  cutFrames = 5,
  startAt = 4,
  accentColor = GOLD,
  durationFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("RapidFire init"));
  const [ready, setReady] = useState(false);

  const effZoom = baseZoom + (isVertical ? 0 : -0.4);
  const rafaleEnd = startAt + flash.length * cutFrames;
  const focusFillId = `rf-fill-${focus.iso}`;
  const focusLineId = `rf-line-${focus.iso}`;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center,
      zoom: effZoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;
    map.on("style.load", () => {
      try {
        (map as mapboxgl.Map & { setProjection?: (p: string) => void }).setProjection?.(
          "mercator"
        );
      } catch {}
      applyGeoAfriqueV5(map);
      if (!map.getSource("cb-source")) {
        map.addSource("cb-source", {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        });
      }
      if (!map.getLayer(focusFillId)) {
        map.addLayer({
          id: focusFillId,
          type: "fill",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], focus.iso],
          paint: { "fill-color": accentColor, "fill-opacity": 0 },
        });
      }
      if (!map.getLayer(focusLineId)) {
        map.addLayer({
          id: focusLineId,
          type: "line",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], focus.iso],
          paint: { "line-color": accentColor, "line-width": 3, "line-opacity": 0 },
        });
      }
      setReady(true);
      continueRender(handle);
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drift tres leger + allumage focus apres rafale
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const driftBearing = interpolate(frame, [0, durationFrames], [-2, 2]);
    map.jumpTo({ center, zoom: effZoom, bearing: driftBearing, pitch: 0 });

    const rel = frame - rafaleEnd;
    const fillOp = interpolate(rel, [0, 12], [0, 0.5], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const lineOp = interpolate(rel, [0, 10], [0, 0.95], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    try {
      map.setPaintProperty(focusFillId, "fill-opacity", fillOp);
      map.setPaintProperty(focusLineId, "line-opacity", lineOp);
    } catch {}
  }, [frame, ready, center, effZoom, durationFrames, rafaleEnd, focusFillId, focusLineId]);

  // Quel flash est actif ?
  const flashIndex = Math.floor((frame - startAt) / cutFrames);
  const inRafale = frame >= startAt && frame < rafaleEnd;
  const current = inRafale && flashIndex >= 0 && flashIndex < flash.length
    ? flash[flashIndex]
    : null;

  // Freeze focus apres rafale
  const focusRel = frame - rafaleEnd;
  const focusFlagOp = interpolate(focusRel, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const focusNameSpring = spring({
    frame: focusRel - 6,
    fps,
    config: { damping: 12, stiffness: 180 },
    durationInFrames: 16,
  });

  const globalOpacity = interpolate(
    frame,
    [durationFrames - 10, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const flashNameSize = isVertical ? 110 : 130;
  const focusNameSize = isVertical ? 90 : 110;
  // bande drapeau plein cadre (en haut) pendant le flash
  const bandH = isVertical ? height * 0.28 : height * 0.36;

  return (
    <AbsoluteFill style={{ background: NAVY, opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {/* RAFALE : flash plein cadre par pays (cut sec) */}
      {current && (
        <AbsoluteFill style={{ background: "rgba(22,33,58,0.82)" }}>
          {/* bande drapeau */}
          <img
            src={`https://flagcdn.com/w1280/${current.code}.png`}
            style={{
              position: "absolute",
              top: (height - bandH) / 2 - bandH * 0.55,
              left: "8%",
              width: "84%",
              height: bandH,
              objectFit: "cover",
              border: `3px solid ${accentColor}`,
              boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
            }}
          />
          {/* nom geant */}
          <div
            style={{
              position: "absolute",
              top: (height - bandH) / 2 + bandH * 0.65,
              left: 0,
              right: 0,
              textAlign: "center",
            }}
          >
            <span
              style={{
                color: IVORY,
                fontSize: flashNameSize,
                fontWeight: 900,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                textShadow: `0 0 24px ${accentColor}`,
              }}
            >
              {current.name}
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* FREEZE : focus s'allume sur la carte + drapeau rempli + nom */}
      {focusRel >= 0 && (
        <>
          {/* drapeau focus en cartouche (pas clippe ici, simple cartouche premium en bas) */}
          <div
            style={{
              position: "absolute",
              bottom: isVertical ? height * 0.14 : height * 0.1,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              opacity: focusFlagOp,
              transform: `scale(${0.9 + focusNameSpring * 0.1})`,
            }}
          >
            <img
              src={`https://flagcdn.com/w640/${focus.code}.png`}
              style={{
                width: isVertical ? 180 : 150,
                border: `2px solid ${accentColor}`,
                boxShadow: `0 0 24px rgba(200,169,81,0.5)`,
              }}
            />
            <span
              style={{
                color: IVORY,
                fontSize: focusNameSize,
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                textShadow: "0 4px 24px rgba(0,0,0,0.8)",
              }}
            >
              {focus.name}
            </span>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

export default RapidFireCountries;
