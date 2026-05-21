/**
 * GlobeLocationReveal V1 — globe Mapbox + reticule sur lieu (pays OU ville)
 *
 * Generalisation de GlobeCountryRevealMapbox : supporte highlight pays (countryIso)
 * OU simplement un dot lumineux sur une ville (sans country highlight).
 *
 * Panel optionnel : peut etre desactive (panelMode="none") pour ne montrer que le globe + reticule,
 * utile pour transition vers zoom Mercator.
 *
 * 3 styles : "souverain" (bleu nuit panel jaune), "caspian" (papier creme),
 *            "noir" (panel noir bord blanc).
 *
 * Camera : peut continuer apres durationFrames si zoomTo est fourni (zoom continu jusqu'a finalZoom2).
 * Pour scenes end-to-end : globe -> reticule -> fade panel -> zoom Mercator.
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
  applyCartoCaspian,
  CASPIAN_PALETTE,
} from "../../mapbox/templates/CartoCaspian";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export type GlobeRevealStyle = "souverain" | "caspian" | "noir";
export type PanelMode = "country" | "city" | "none";

interface CamKeyframe {
  frame: number;
  lon: number;
  lat: number;
  zoom: number;
  /** Optional Mapbox projection: "globe" or "mercator" */
  projection?: "globe" | "mercator";
}

interface Props {
  /** Coordonnees [lon, lat] du point a viser (pays centre OU ville) */
  targetCoord: [number, number];
  /** Code ISO alpha-3 si on veut highlight le pays entier (NER, CAN, FRA...) */
  countryIso?: string;
  /** Nom principal affiche dans panel (ex: "NIGER", "MONTREAL") */
  primaryLabel: string;
  /** Sous-label discret (ex: "NIAMEY" pour pays, "QUEBEC, CANADA" pour ville) */
  secondaryLabel?: string;
  /** Donnee editoriale courte remplacant secondaryLabel (ex: "SAHEL · 26.2M HAB.") */
  subInfo?: string;
  /** Path SVG silhouette pays optionnel pour panel */
  countryPath?: string;
  countryBBox?: { minX: number; maxX: number; minY: number; maxY: number };
  /** Coords [x,y] de la capitale en SVG units (meme projection que countryPath) */
  capitalSvgCoord?: [number, number];
  /** Label affiche a cote du dot capitale dans la silhouette */
  capitalLabel?: string;
  /** Style global */
  style?: GlobeRevealStyle;
  panelMode?: PanelMode;
  /** Cache panel apres ce frame (defaut: jamais). Permet fade avant zoom Mercator. */
  panelHideStart?: number;
  /** Camera keyframes — override la sequence par defaut. Permet sequences longues. */
  cameraKeyframes?: CamKeyframe[];
  durationFrames?: number;
  highlightColor?: string;
  accentColor?: string;
  /** Reticule visible apres ce frame seulement (defaut 30) */
  reticleStartFrame?: number;
  /** Reticule cache apres ce frame (defaut: jamais). Pour transition zoom. */
  reticleHideStart?: number;
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const lerpCam = (frame: number, kfs: CamKeyframe[]): CamKeyframe => {
  if (frame <= kfs[0].frame) return kfs[0];
  if (frame >= kfs[kfs.length - 1].frame) return kfs[kfs.length - 1];
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i];
    const b = kfs[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = (frame - a.frame) / (b.frame - a.frame);
      const e = easeInOut(t);
      return {
        frame,
        lon: a.lon + (b.lon - a.lon) * e,
        lat: a.lat + (b.lat - a.lat) * e,
        zoom: a.zoom + (b.zoom - a.zoom) * e,
        projection: e < 0.5 ? a.projection : b.projection,
      };
    }
  }
  return kfs[kfs.length - 1];
};

export const GlobeLocationReveal: React.FC<Props> = ({
  targetCoord,
  countryIso,
  primaryLabel,
  secondaryLabel,
  subInfo,
  countryPath,
  countryBBox,
  capitalSvgCoord,
  capitalLabel,
  style = "souverain",
  panelMode = "country",
  panelHideStart,
  cameraKeyframes,
  durationFrames = 150,
  highlightColor = "#f5d547",
  accentColor = "#f5d547",
  reticleStartFrame = 30,
  reticleHideStart,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Globe location reveal"));
  const [ready, setReady] = useState(false);
  const [pinScreen, setPinScreen] = useState<{ x: number; y: number } | null>(null);
  const [currentProjection, setCurrentProjection] = useState<"globe" | "mercator">("globe");

  const defaultKfs: CamKeyframe[] = [
    { frame: 0, lon: targetCoord[0] - 35, lat: targetCoord[1] - 5, zoom: 1.2, projection: "globe" },
    { frame: 60, lon: targetCoord[0], lat: targetCoord[1], zoom: 1.6, projection: "globe" },
    { frame: durationFrames, lon: targetCoord[0], lat: targetCoord[1], zoom: 1.6, projection: "globe" },
  ];
  const kfs = cameraKeyframes ?? defaultKfs;

  // Mapbox style key
  const STYLE_URL = "mapbox://styles/mapbox/dark-v11";

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: style === "caspian" ? "mapbox://styles/mapbox/light-v11" : STYLE_URL,
      projection: { name: "globe" },
      center: [kfs[0].lon, kfs[0].lat],
      zoom: kfs[0].zoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      // Atmosphere selon style
      if (style === "souverain" || style === "noir") {
        map.setFog({
          color: "#0a1834",
          "high-color": "#1a2548",
          "horizon-blend": 0.04,
          "space-color": "#020714",
          "star-intensity": 0.6,
        });
      } else if (style === "caspian") {
        // Atmosphere lumineuse blanche autour du globe + ciel bleu doux
        map.setFog({
          color: "#ffffff",
          "high-color": "#d8e4ee",
          "horizon-blend": 0.12,
          "space-color": "#7a92a8",
          "star-intensity": 0.0,
        });
        applyCartoCaspian(map);
      }

      // Cacher labels (pour souverain et noir)
      if (style !== "caspian") {
        const layers = map.getStyle().layers ?? [];
        for (const l of layers) {
          if (l.type === "symbol") map.setLayoutProperty(l.id, "visibility", "none");
        }
      }

      // Highlight pays optionnel
      if (countryIso) {
        const fillId = `country-fill-${countryIso}`;
        if (!map.getLayer(fillId)) {
          map.addLayer({
            id: fillId,
            type: "fill",
            source: {
              type: "vector",
              url: "mapbox://mapbox.country-boundaries-v1",
            },
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], countryIso],
            paint: {
              "fill-color": highlightColor,
              "fill-opacity": 0.85,
            },
          });
        }
        const lineId = `country-line-${countryIso}`;
        if (!map.getLayer(lineId)) {
          map.addLayer({
            id: lineId,
            type: "line",
            source: {
              type: "vector",
              url: "mapbox://mapbox.country-boundaries-v1",
            },
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], countryIso],
            paint: {
              "line-color": "#ffffff",
              "line-width": 1.5,
              "line-opacity": 0.95,
            },
          });
        }
      }

      // Dot lumineux sur la ville (city mode)
      if (!countryIso) {
        if (!map.getSource("target-point")) {
          map.addSource("target-point", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: { type: "Point", coordinates: targetCoord },
                  properties: {},
                },
              ],
            },
          });
        }
        if (!map.getLayer("target-glow")) {
          map.addLayer({
            id: "target-glow",
            type: "circle",
            source: "target-point",
            paint: {
              "circle-radius": 16,
              "circle-color": highlightColor,
              "circle-blur": 0.6,
              "circle-opacity": 0.7,
            },
          });
        }
        if (!map.getLayer("target-dot")) {
          map.addLayer({
            id: "target-dot",
            type: "circle",
            source: "target-point",
            paint: {
              "circle-radius": 5,
              "circle-color": highlightColor,
              "circle-stroke-color": "#ffffff",
              "circle-stroke-width": 1.5,
            },
          });
        }
      }

      setReady(true);
      continueRender(handle);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handle, countryIso, highlightColor, targetCoord, style]);

  // Drive camera per frame
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const cam = lerpCam(frame, kfs);

    // Switch projection if needed
    if (cam.projection && cam.projection !== currentProjection) {
      try {
        mapRef.current.setProjection({ name: cam.projection });
      } catch {}
      setCurrentProjection(cam.projection);
    }

    mapRef.current.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
    });

    const screen = mapRef.current.project(targetCoord);
    setPinScreen({ x: screen.x, y: screen.y });
  }, [frame, ready, targetCoord, kfs, currentProjection]);

  // Animations overlay
  const reticleProgress = spring({
    frame: frame - reticleStartFrame,
    fps: 30,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 22,
  });

  const reticleHideOp =
    reticleHideStart !== undefined
      ? interpolate(frame, [reticleHideStart, reticleHideStart + 15], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const linkProgress = spring({
    frame: frame - reticleStartFrame - 20,
    fps: 30,
    config: { damping: 100, stiffness: 70 },
    durationInFrames: 25,
  });

  const panelSlide = spring({
    frame: frame - reticleStartFrame - 30,
    fps: 30,
    config: { damping: 90, stiffness: 65 },
    durationInFrames: 32,
  });

  const nameOpacity = spring({
    frame: frame - reticleStartFrame - 50,
    fps: 30,
    config: { damping: 150, stiffness: 100 },
    durationInFrames: 22,
  });

  const panelHideOp =
    panelHideStart !== undefined
      ? interpolate(frame, [panelHideStart, panelHideStart + 15], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const globalOpacity = interpolate(
    frame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const pulseScale = 1 + 0.08 * Math.sin(frame * 0.18);

  // Panel layout — marges 11% (120px sur 1080) pour respiration sous-titres
  const PANEL_X = 120;
  const PANEL_Y = panelMode === "city" ? 1380 : 1280;
  const PANEL_W = 840;
  const PANEL_H = panelMode === "city" ? 380 : 480;
  const PANEL_PAD = 48;

  const LINE_END_X = PANEL_X + PANEL_W / 2;
  const LINE_END_Y = PANEL_Y + 4;

  // Panel style
  const PANEL_STYLES = {
    souverain: { bg: "#1a2548", border: accentColor, ink: "#ffffff", borderOp: 0.5 },
    caspian: { bg: "#ede5d3", border: "#5a5a5a", ink: "#2a1f12", borderOp: 0.7 },
    noir: { bg: "#0a0a0a", border: "#ffffff", ink: "#ffffff", borderOp: 0.6 },
  } as const;
  const ps = PANEL_STYLES[style];

  // Silhouette path
  let shapeScale = 1;
  let shapeTX = 0;
  let shapeTY = 0;
  if (countryPath && countryBBox) {
    const bW = countryBBox.maxX - countryBBox.minX;
    const bH = countryBBox.maxY - countryBBox.minY;
    const availW = PANEL_W - PANEL_PAD * 2 - 80;
    const availH = PANEL_H - PANEL_PAD * 2 - 60;
    shapeScale = Math.min(availW / bW, availH / bH) * 0.92;
    shapeTX = PANEL_PAD + 60 + availW / 2 - (countryBBox.minX + bW / 2) * shapeScale;
    shapeTY = PANEL_PAD + 60 + availH / 2 - (countryBBox.minY + bH / 2) * shapeScale;
  }

  const panelTranslateY = interpolate(panelSlide, [0, 1], [60, 0]);
  const showPanel = panelMode !== "none";

  const bgGradient =
    style === "caspian"
      ? "linear-gradient(180deg, #a8c5d8 0%, #6e8aa3 60%, #4a627a 100%)"
      : "#020714";

  return (
    <AbsoluteFill style={{ background: bgGradient, opacity: globalOpacity }}>
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: width,
          height: height,
        }}
      />
      <style>{`
        .mapboxgl-ctrl-attrib, .mapboxgl-ctrl-logo { display: none !important; }
      `}</style>

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {/* RETICULE */}
        {pinScreen && reticleProgress > 0.01 && (
          <g
            transform={`translate(${pinScreen.x} ${pinScreen.y}) scale(${reticleProgress * pulseScale})`}
            opacity={reticleProgress * reticleHideOp}
          >
            <circle
              cx="0"
              cy="0"
              r="44"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.85"
            />
            <circle
              cx="0"
              cy="0"
              r="22"
              fill="none"
              stroke={accentColor}
              strokeWidth="1.5"
              opacity="0.65"
            />
            <circle cx="0" cy="0" r="3" fill={accentColor} />
            <line x1="-58" y1="0" x2="-30" y2="0" stroke={accentColor} strokeWidth="2" />
            <line x1="30" y1="0" x2="58" y2="0" stroke={accentColor} strokeWidth="2" />
            <line x1="0" y1="-58" x2="0" y2="-30" stroke={accentColor} strokeWidth="2" />
            <line x1="0" y1="30" x2="0" y2="58" stroke={accentColor} strokeWidth="2" />
          </g>
        )}

        {/* LIGNE pointillee — uniquement si panel visible */}
        {showPanel && pinScreen && linkProgress > 0.01 && (
          <g opacity={linkProgress * panelHideOp}>
            <line
              x1={pinScreen.x}
              y1={pinScreen.y + 50}
              x2={LINE_END_X}
              y2={LINE_END_Y - 6}
              stroke={accentColor}
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeOpacity="0.85"
            />
            <polygon
              points={`${LINE_END_X - 8},${LINE_END_Y - 14} ${LINE_END_X + 8},${LINE_END_Y - 14} ${LINE_END_X},${LINE_END_Y - 2}`}
              fill={accentColor}
            />
          </g>
        )}

        {/* PANEL */}
        {showPanel && (
          <g
            transform={`translate(0 ${panelTranslateY})`}
            opacity={panelSlide * panelHideOp}
          >
            <rect
              x={PANEL_X}
              y={PANEL_Y}
              width={PANEL_W}
              height={PANEL_H}
              fill={ps.bg}
              fillOpacity={style === "caspian" ? 0.98 : 0.96}
              rx={16}
            />
            <rect
              x={PANEL_X}
              y={PANEL_Y}
              width={PANEL_W}
              height={PANEL_H}
              fill="none"
              stroke={ps.border}
              strokeWidth="1.5"
              strokeOpacity={ps.borderOp}
              rx={16}
            />
            {/* Silhouette si dispo et panelMode=country */}
            {panelMode === "country" && countryPath && countryBBox && (
              <g
                transform={`translate(${PANEL_X + shapeTX} ${PANEL_Y + shapeTY}) scale(${shapeScale})`}
              >
                <path
                  d={countryPath}
                  fill={accentColor}
                  fillOpacity={style === "caspian" ? 0.35 : 0.18}
                  stroke={accentColor}
                  strokeWidth={1.4 / shapeScale}
                  strokeOpacity="0.9"
                />
                {/* Dot capitale + label */}
                {capitalSvgCoord && (
                  <g transform={`translate(${capitalSvgCoord[0]} ${capitalSvgCoord[1]})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r={6 / shapeScale}
                      fill="none"
                      stroke="#c45a4a"
                      strokeWidth={1.5 / shapeScale}
                      strokeDasharray={`${2.5 / shapeScale} ${2 / shapeScale}`}
                      opacity="0.85"
                    />
                    <circle cx="0" cy="0" r={2.5 / shapeScale} fill="#c45a4a" />
                    {capitalLabel && (
                      <text
                        x={9 / shapeScale}
                        y={2 / shapeScale}
                        fontFamily="'IBM Plex Mono', 'Courier New', monospace"
                        fontSize={9 / shapeScale}
                        fill={style === "caspian" ? "#2a1f12" : "#ffffff"}
                        opacity="0.9"
                        letterSpacing={0.3 / shapeScale}
                      >
                        {capitalLabel}
                      </text>
                    )}
                  </g>
                )}
              </g>
            )}
            {/* Pin city pour mode city */}
            {panelMode === "city" && (
              <g transform={`translate(${PANEL_X + PANEL_W - 180} ${PANEL_Y + PANEL_H / 2})`}>
                <circle cx="0" cy="0" r="40" fill="none" stroke={accentColor} strokeWidth="2" strokeDasharray="3 4" opacity="0.7" />
                <circle cx="0" cy="0" r="22" fill={accentColor} fillOpacity="0.18" />
                <circle cx="0" cy="0" r="6" fill={accentColor} />
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Texte panel */}
      {showPanel && (
        <div
          style={{
            position: "absolute",
            left: PANEL_X + 32,
            top: PANEL_Y + 36 + panelTranslateY,
            opacity: nameOpacity * panelSlide * panelHideOp,
            color: ps.ink,
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "0.12em",
              lineHeight: 1,
            }}
          >
            {primaryLabel}
          </div>
          {(subInfo || secondaryLabel) && (
            <div
              style={{
                fontSize: 22,
                fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                color: style === "caspian" ? "#5a5a5a" : accentColor,
                letterSpacing: "0.3em",
                marginTop: 8,
                opacity: 0.85,
              }}
            >
              {subInfo ?? secondaryLabel}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
