/**
 * Template Insert — GoldVein V3
 *
 * Equal Earth projection → zoom progressif continent→sol + veines arborescentes depuis Arlit.
 * Mapbox bascule automatiquement de equalEarth → mercator autour de zoom 4.0 (comportement natif).
 *
 * Stack : Mapbox GL JS (equalEarth) + SVG React overlay (map.project()) + Remotion spring/interpolate
 * Durée : 150 frames (5s @ 30fps)
 *
 * Animation :
 *   f0–30   : vue monde Equal Earth — Niger highlight, on apprécie la projection
 *   f30–80  : zoom progressif continent→Niger (zoom 1.8→5.5)
 *   f50–100 : branches arborescentes se tracent en éventail depuis Arlit (stagger 10f entre branches)
 *   f110–135: panel données slide-in spring
 *   f100–150: veines pulsent (glow sinus)
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
  addCountryHighlight,
  lerpCam,
} from "../../mapbox/MapboxBase";
import {
  applyCartoCaspian,
  CartoCaspianOverlay,
  CASPIAN_SEPIA,
} from "../../mapbox/templates/CartoCaspian";
import { MapboxBrandingHide } from "../../mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Point focal — Arlit, principal gisement uranium Niger
const ARLIT: [number, number] = [7.38, 18.73];

// 4 branches arborescentes depuis Arlit — failles géologiques en éventail
// Chaque branche = tableau de points [lon, lat] depuis Arlit vers la direction
const VEIN_BRANCHES: [number, number][][] = [
  // Branche nord-est → Agadez / Aïr nord
  [[7.38, 18.73], [8.2, 19.4], [8.9, 20.1], [9.6, 20.8]],
  // Branche est → Zinder
  [[7.38, 18.73], [9.0, 18.2], [10.5, 17.8], [12.0, 17.2]],
  // Branche sud → Tahoua / centre Niger
  [[7.38, 18.73], [7.0, 17.2], [6.5, 15.8], [5.8, 14.5]],
  // Branche ouest → Mali frontier
  [[7.38, 18.73], [5.8, 18.9], [4.2, 19.5], [2.8, 20.0]],
];

// Caméra : Equal Earth vue monde → zoom progressif jusqu'au Niger
const CAM_START = { lon: 20.0, lat:  5.0, zoom: 1.8, pitch:  0, bearing: 0 };
const CAM_MID   = { lon: 10.0, lat: 15.0, zoom: 3.4, pitch: 10, bearing: 0 };
const CAM_END   = { lon:  7.8, lat: 17.8, zoom: 5.5, pitch: 30, bearing: -8 };

export interface GoldVeinProps {
  countryIso?: string;
  countryLabel?: string;
  resourceName?: string;
  resourceValue?: string;
  resourceUnit?: string;
  resourceSource?: string;
}

export const GOLD_VEIN_FRAMES = 150;

function branchToPoints(map: mapboxgl.Map, pts: [number, number][]): string {
  return pts.map(([lon, lat]) => {
    const p = map.project([lon, lat]);
    return `${p.x},${p.y}`;
  }).join(" ");
}

function branchLength(map: mapboxgl.Map, pts: [number, number][]): number {
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = map.project([pts[i - 1][0], pts[i - 1][1]]);
    const b = map.project([pts[i][0], pts[i][1]]);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return Math.max(total, 1);
}

// Interpolation caméra 3 keyframes avec easing
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

function lerpCam3(
  frame: number,
  fA: number, camA: typeof CAM_START,
  fB: number, camB: typeof CAM_START,
  fC: number, camC: typeof CAM_END,
) {
  if (frame <= fA) return camA;
  if (frame <= fB) {
    const t = easeInOut((frame - fA) / (fB - fA));
    return {
      lon: camA.lon + (camB.lon - camA.lon) * t,
      lat: camA.lat + (camB.lat - camA.lat) * t,
      zoom: camA.zoom + (camB.zoom - camA.zoom) * t,
      pitch: camA.pitch + (camB.pitch - camA.pitch) * t,
      bearing: camA.bearing + (camB.bearing - camA.bearing) * t,
    };
  }
  if (frame >= fC) return camC;
  const t = easeInOut((frame - fB) / (fC - fB));
  return {
    lon: camB.lon + (camC.lon - camB.lon) * t,
    lat: camB.lat + (camC.lat - camB.lat) * t,
    zoom: camB.zoom + (camC.zoom - camB.zoom) * t,
    pitch: camB.pitch + (camC.pitch - camB.pitch) * t,
    bearing: camB.bearing + (camC.bearing - camB.bearing) * t,
  };
}

export const GoldVein: React.FC<GoldVeinProps> = ({
  countryIso = "NER",
  countryLabel = "NIGER",
  resourceName = "URANIUM",
  resourceValue = "3 500 T",
  resourceUnit = "extraites par an",
  resourceSource = "AIEA, 2022",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("GoldVein map load"));
  const [mapReady, setMapReady] = useState(false);

  // État SVG des 4 branches — recalculé à chaque frame
  const [branches, setBranches] = useState<{ pts: string; len: number }[]>([]);

  // Init Mapbox — Equal Earth au départ
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [CAM_START.lon, CAM_START.lat],
      zoom: CAM_START.zoom,
      pitch: CAM_START.pitch,
      bearing: CAM_START.bearing,
      interactive: false,
      projection: { name: "equalEarth" } as mapboxgl.ProjectionSpecification,
      preserveDrawingBuffer: true,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      applyCartoCaspian(map, CASPIAN_SEPIA);
      addCountryHighlight(map, countryIso, CASPIAN_SEPIA.highlightOr, 0.4);
      setMapReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Caméra + recalcul SVG à chaque frame
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;

    const cam = lerpCam3(
      frame,
      0,  CAM_START,
      55, CAM_MID,
      80, CAM_END,
    );

    map.setCenter([cam.lon, cam.lat]);
    map.setZoom(cam.zoom);
    map.setPitch(cam.pitch);
    map.setBearing(cam.bearing);

    // Recalculer les 4 branches en coordonnées pixel
    const computed = VEIN_BRANCHES.map((branch) => ({
      pts: branchToPoints(map, branch),
      len: branchLength(map, branch),
    }));
    setBranches(computed);
  }, [frame, mapReady]);

  // --- Animations ---

  // Fade-in carte f0→20
  const mapOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Chaque branche démarre avec un stagger de 8 frames à partir de f50
  // branche 0 : f50–80, branche 1 : f58–88, branche 2 : f66–96, branche 3 : f74–104
  const BRANCH_START = 50;
  const BRANCH_DURATION = 30;
  const STAGGER = 8;

  const branchProgresses = VEIN_BRANCHES.map((_, i) => {
    const start = BRANCH_START + i * STAGGER;
    return interpolate(frame, [start, start + BRANCH_DURATION], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });

  // Veines visibles à partir de f48
  const veinOpacity = interpolate(frame, [48, 56], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Glow pulsant après f100 (sinus)
  const glowBase  = frame >= 100 ? 5 + 3 * Math.sin((frame - 100) / 10) : 5;
  const glowOuter = frame >= 100 ? 12 + 5 * Math.sin((frame - 100) / 10) : 12;
  const veinFilter = `drop-shadow(0 0 ${glowBase}px #f0c040) drop-shadow(0 0 ${glowOuter}px #ffdd77)`;

  // Dot focal Arlit — pulse dès f45
  const arlatPos = mapRef.current && mapReady
    ? mapRef.current.project([ARLIT[0], ARLIT[1]])
    : { x: width / 2, y: height / 2 };

  const dotScale = frame >= 45
    ? 1 + 0.3 * Math.sin((frame - 45) / 8)
    : interpolate(frame, [40, 50], [0, 1], { extrapolateRight: "clamp" });

  const dotOpacity = interpolate(frame, [40, 52], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Plate label — apparaît à f20, reste visible
  const labelOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Panel données slide-in f110→135
  const panelSpring = spring({
    frame: frame - 110,
    fps,
    config: { stiffness: 70, damping: 100 },
  });
  const panelX = interpolate(panelSpring, [0, 1], [440, 0]);
  const panelOpacity = interpolate(frame, [110, 122], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#1a1208" }}>
      <MapboxBrandingHide />

      {/* Carte Mapbox Equal Earth */}
      <AbsoluteFill style={{ opacity: mapOpacity }}>
        <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
        <CartoCaspianOverlay opacity={0.06} />
      </AbsoluteFill>

      {/* Overlay SVG — 4 branches arborescentes */}
      {mapReady && branches.length === 4 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <svg
            width={width}
            height={height}
            style={{
              position: "absolute",
              inset: 0,
              filter: veinFilter,
              opacity: veinOpacity,
            }}
          >
            {branches.map((branch, i) => {
              const progress = branchProgresses[i];
              const dashOffset = branch.len * (1 - progress);
              return (
                <g key={i}>
                  {/* Halo */}
                  <polyline
                    points={branch.pts}
                    fill="none"
                    stroke="rgba(240,192,64,0.12)"
                    strokeWidth={18}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={branch.len}
                    strokeDashoffset={dashOffset}
                  />
                  {/* Corps principal */}
                  <polyline
                    points={branch.pts}
                    fill="none"
                    stroke="#f0c040"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={branch.len}
                    strokeDashoffset={dashOffset}
                  />
                  {/* Coeur lumineux */}
                  <polyline
                    points={branch.pts}
                    fill="none"
                    stroke="#ffe880"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={branch.len}
                    strokeDashoffset={dashOffset}
                  />
                </g>
              );
            })}
          </svg>

          {/* Dot focal — Arlit, foyer des branches */}
          <div
            style={{
              position: "absolute",
              left: arlatPos.x - 12,
              top: arlatPos.y - 12,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "radial-gradient(circle, #fff8c0 0%, #f0c040 45%, transparent 100%)",
              transform: `scale(${dotScale})`,
              opacity: dotOpacity,
              filter: "drop-shadow(0 0 10px #f0c040) drop-shadow(0 0 20px #ffdd77)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Plate label bas-gauche */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: 60,
            bottom: 140,
            display: "flex",
            alignItems: "center",
            opacity: labelOpacity,
          }}
        >
          <div style={{
            width: 4, height: 44, background: "#c08820",
            marginRight: 10, borderRadius: 2,
          }} />
          <div style={{
            background: "rgba(13,21,37,0.88)",
            padding: "6px 16px",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 22, fontWeight: 700,
            color: "#ffffff", letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            {countryLabel}
          </div>
        </div>
      </AbsoluteFill>

      {/* Panel données — slide-in droite f110 */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          top: 620, right: 0,
          width: 420, minHeight: 480,
          background: "rgba(20,16,10,0.93)",
          borderLeft: "5px solid #f0c040",
          transform: `translateX(${panelX}px)`,
          opacity: panelOpacity,
          padding: "36px 32px 32px 28px",
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 18, fontWeight: 400,
            color: "#c08820", letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}>
            {countryLabel}
          </div>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 42, fontWeight: 700,
            color: "#f0c040", letterSpacing: "0.06em",
            textTransform: "uppercase", lineHeight: 1, marginTop: 4,
          }}>
            {resourceName}
          </div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 82, fontWeight: 700,
            color: "#ffffff", lineHeight: 1, marginTop: 16,
          }}>
            {resourceValue}
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 21, color: "#cccccc",
            letterSpacing: "0.04em", marginTop: 4,
          }}>
            {resourceUnit}
          </div>
          <div style={{
            width: "100%", height: 1,
            background: "rgba(192,136,32,0.3)", marginTop: 20,
          }} />
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 16, color: "#9a7030",
            letterSpacing: "0.06em", marginTop: 8,
          }}>
            {resourceSource}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Composition démo pour Root.tsx
export const GoldVeinDemo: React.FC = () => (
  <GoldVein
    countryIso="NER"
    countryLabel="NIGER"
    resourceName="URANIUM"
    resourceValue="3 500 T"
    resourceUnit="extraites par an"
    resourceSource="AIEA, 2022"
  />
);
