/**
 * MapboxIsolateZone — isolation d'un pays + zone d'interet (offshore/mine) hachuree
 * + badge pin + bloc stat, sur une VRAIE carte Mapbox.
 *
 * Port Mapbox du vieux CountryIsolateWithHatch (qui utilisait un SVG path INVENTE,
 * pas une vraie geometrie). Ici tout est sur la vraie carte Mapbox.
 *
 * Aligne SOUVERAIN VISUAL PLAYBOOK :
 *   - P2/P2bis : drift + altitude pays par defaut
 *   - P3  : isolation = pays focus net, reste assombri (masque navy) + voisins ivory
 *   - P4  : zone d'interet remplie par fill-pattern hachures gold (texture, pas vide)
 *   - P5  : badge pin minimaliste reliant le point geo (map.project) + bloc stat
 *
 * Hybride V+H : useVideoConfig().width/height → zoom + tailles overlay adaptes.
 *
 * Usage :
 *   <MapboxIsolateZone
 *     countryIso="SEN"
 *     center={[-15.5, 14.2]}
 *     baseZoom={5.6}
 *     zone={SANGOMAR_ZONE}      // GeoJSON Polygon de la zone offshore
 *     badge="SANGOMAR"
 *     badgeCoord={[-17.15, 13.45]}
 *     statValue="2,4 MDS $"
 *     statLabel="PRODUCTION ANNUELLE"
 *     countryName="SENEGAL"
 *   />
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

type GeoPolygon = {
  type: "Feature";
  geometry: { type: "Polygon"; coordinates: number[][][] };
  properties: Record<string, unknown>;
};

/** Default : zone offshore Sangomar (Senegal) — agrandie + decalee vers le large. */
export const SANGOMAR_ZONE: GeoPolygon = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-18.2, 14.2],
        [-17.35, 14.25],
        [-17.2, 13.5],
        [-17.45, 12.85],
        [-18.3, 12.95],
        [-18.55, 13.6],
        [-18.2, 14.2],
      ],
    ],
  },
};

export interface MapboxIsolateZoneProps {
  countryIso: string;
  center: [number, number];
  baseZoom?: number;
  /** Zone d'interet (GeoJSON Feature Polygon). Defaut SANGOMAR_ZONE. */
  zone?: GeoPolygon;
  badge: string;
  badgeCoord: [number, number];
  statValue: string;
  statLabel: string;
  countryName: string;
  accentColor?: string;
  durationFrames?: number;
}

/** Hachures gold dessinees au canvas pour fill-pattern. */
function hatchImageData(): { data: Uint8Array; width: number; height: number } {
  const size = 16;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  // Cyan vif sur fond legerement teinte → ressort sur le navy de l'ocean
  ctx.fillStyle = "rgba(74,158,255,0.12)";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(120,200,255,0.95)";
  ctx.lineWidth = 2.5;
  // diagonale 45deg
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(size, 0);
  ctx.moveTo(-size / 2, size / 2);
  ctx.lineTo(size / 2, -size / 2);
  ctx.moveTo(size / 2, size + size / 2);
  ctx.lineTo(size + size / 2, size / 2);
  ctx.stroke();
  const id = ctx.getImageData(0, 0, size, size);
  return { data: id.data as unknown as Uint8Array, width: size, height: size };
}

export const MapboxIsolateZone: React.FC<MapboxIsolateZoneProps> = ({
  countryIso,
  center,
  baseZoom = 5.6,
  zone = SANGOMAR_ZONE,
  badge,
  badgeCoord,
  statValue,
  statLabel,
  countryName,
  accentColor = GOLD,
  durationFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("MapboxIsolateZone init"));
  const [ready, setReady] = useState(false);
  const [badgeScreen, setBadgeScreen] = useState<{ x: number; y: number } | null>(
    null
  );

  const effZoom = baseZoom + (isVertical ? 0 : -0.6);

  const hatchImgId = "zone-hatch";
  const maskId = "world-mask"; // assombrit tout sauf le pays focus
  const countryFillId = `iso-fill-${countryIso}`;
  const countryBorderId = `iso-border-${countryIso}`;
  const zoneFillId = "zone-fill";
  const zoneBorderId = "zone-border";

  // ── Init map ──────────────────────────────────────────────────────────────
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

      // P3 — masque : assombrit TOUT sauf le pays focus (effet isolation/spotlight)
      if (!map.getLayer(maskId)) {
        map.addLayer({
          id: maskId,
          type: "fill",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["!=", ["get", "iso_3166_1_alpha_3"], countryIso],
          paint: { "fill-color": NAVY, "fill-opacity": 0.55 },
        });
      }

      // Pays focus — fill gold semi-opaque
      if (!map.getLayer(countryFillId)) {
        map.addLayer({
          id: countryFillId,
          type: "fill",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], countryIso],
          paint: { "fill-color": GOLD, "fill-opacity": 0 },
        });
      }
      if (!map.getLayer(countryBorderId)) {
        map.addLayer({
          id: countryBorderId,
          type: "line",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], countryIso],
          paint: { "line-color": accentColor, "line-width": 2.5, "line-opacity": 0 },
        });
      }

      // P4 — zone d'interet hachuree
      const hatch = hatchImageData();
      if (!map.hasImage(hatchImgId)) {
        map.addImage(hatchImgId, {
          width: hatch.width,
          height: hatch.height,
          data: hatch.data,
        });
      }
      if (!map.getSource("zone-source")) {
        map.addSource("zone-source", { type: "geojson", data: zone });
      }
      if (!map.getLayer(zoneFillId)) {
        map.addLayer({
          id: zoneFillId,
          type: "fill",
          source: "zone-source",
          paint: { "fill-pattern": hatchImgId, "fill-opacity": 0 },
        });
      }
      if (!map.getLayer(zoneBorderId)) {
        map.addLayer({
          id: zoneBorderId,
          type: "line",
          source: "zone-source",
          paint: {
            "line-color": "#78c8ff",
            "line-width": 2.5,
            "line-opacity": 0,
            "line-dasharray": [3, 2],
          },
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

  // ── Drive camera + opacites sequentielles ──────────────────────────────────
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    // P2 — drift
    const driftBearing = interpolate(frame, [0, durationFrames], [-3, 3]);
    const driftZoom = effZoom + interpolate(frame, [0, durationFrames], [0, 0.15]);
    map.jumpTo({ center, zoom: driftZoom, bearing: driftBearing, pitch: 0 });

    // Sequence : pays (f0-25) → zone hachuree (f30-50) → badge (f45-65)
    const countryOp = interpolate(frame, [4, 24], [0, 0.45], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const borderOp = interpolate(frame, [4, 20], [0, 0.95], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const zoneOp = interpolate(frame, [30, 50], [0, 0.9], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    try {
      map.setPaintProperty(countryFillId, "fill-opacity", countryOp);
      map.setPaintProperty(countryBorderId, "line-opacity", borderOp);
      map.setPaintProperty(zoneFillId, "fill-opacity", zoneOp);
      map.setPaintProperty(zoneBorderId, "line-opacity", zoneOp);
    } catch {}

    // Projeter le badge a l'ecran
    const s = map.project(badgeCoord);
    setBadgeScreen({ x: s.x, y: s.y });
  }, [
    frame,
    ready,
    center,
    effZoom,
    durationFrames,
    badgeCoord,
    countryFillId,
    countryBorderId,
    zoneFillId,
    zoneBorderId,
  ]);

  // ── Overlay React ───────────────────────────────────────────────────────────
  const badgeSpring = spring({
    frame: frame - 45,
    fps: 30,
    config: { damping: 12, stiffness: 180, mass: 0.7 },
    durationInFrames: 18,
  });
  const badgePulse =
    frame > 65 ? 1 + 0.04 * Math.sin((frame - 65) * 0.15) : 1;
  const badgeScale = frame < 63 ? badgeSpring : badgePulse;

  const nameOp = interpolate(frame, [8, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const statOp = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const statY = interpolate(frame, [55, 75], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globalOpacity = interpolate(
    frame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const nameSize = isVertical ? 60 : 48;
  const statSize = isVertical ? 84 : 68;

  return (
    <AbsoluteFill
      style={{
        background: NAVY,
        opacity: globalOpacity,
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      }}
    >
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, width, height }}
      />
      <MapboxBrandingHide />

      {/* Nom pays — haut */}
      <div
        style={{
          position: "absolute",
          top: isVertical ? height * 0.1 : height * 0.07,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: nameOp,
        }}
      >
        <span
          style={{
            color: GOLD,
            fontSize: nameSize,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            textShadow: "0 2px 24px rgba(0,0,0,0.6)",
          }}
        >
          {countryName}
        </span>
      </div>

      {/* Badge pin — ancre au point geo via map.project */}
      {badgeScreen && badgeScale > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: badgeScreen.x,
            top: badgeScreen.y,
            transform: `translate(-50%, -100%) scale(${badgeScale})`,
            transformOrigin: "center bottom",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: "rgba(22,33,58,0.94)",
              border: `1.5px solid ${accentColor}`,
              borderRadius: 4,
              padding: isVertical ? "6px 14px" : "5px 12px",
              whiteSpace: "nowrap",
              marginBottom: 4,
              filter: "drop-shadow(0 0 8px rgba(200,169,81,0.45))",
            }}
          >
            <span
              style={{
                color: accentColor,
                fontSize: isVertical ? 20 : 16,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {badge}
            </span>
          </div>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: `10px solid ${accentColor}`,
              margin: "0 auto",
            }}
          />
        </div>
      )}

      {/* Bloc stat — bas centre */}
      <div
        style={{
          position: "absolute",
          bottom: isVertical ? height * 0.12 : height * 0.09,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: statOp,
          transform: `translateY(${statY}px)`,
        }}
      >
        <div
          style={{
            width: 48,
            height: 2,
            background: "rgba(200,169,81,0.5)",
            marginBottom: 14,
          }}
        />
        <span
          style={{
            color: GOLD,
            fontSize: statSize,
            fontWeight: 900,
            letterSpacing: "0.04em",
            lineHeight: 1,
            textShadow: "0 2px 32px rgba(200,169,81,0.35)",
          }}
        >
          {statValue}
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: isVertical ? 20 : 18,
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginTop: 8,
          }}
        >
          {statLabel}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export default MapboxIsolateZone;
