/**
 * GlobeCountryRevealMapbox V4 — globe Mapbox + overlay reticule + panel pays
 *
 * Approche simple : Mapbox fait le globe (projection: 'globe', texture, atmosphere),
 * Remotion fait l'overlay (reticule jaune, ligne pointillee, panel silhouette pays).
 *
 * Pattern :
 *   - <div> Mapbox fullscreen avec projection globe + style sombre
 *   - Highlight pays avec country-boundaries-v1 source
 *   - Overlay SVG par dessus : reticule SVG positionne via map.project([lon,lat])
 *   - Panel rectangulaire bleu nuit avec silhouette pays auto-centree + capitale
 *
 * Sequence (fps 30, 150f) :
 *   f0-30   : globe fade-in + rotation vers pays
 *   f30-50  : reticule pulse-in sur le pays
 *   f50-80  : ligne pointillee jaune descend vers panel
 *   f60-100 : panel slide-up + silhouette + label NIGER + capitale dot
 *   f138-150: fade-out global
 *
 * Usage :
 *   <GlobeCountryRevealMapbox
 *     countryIso="NER"
 *     countryName="NIGER"
 *     capitalName="NIAMEY"
 *     capitalCoord={[2.109, 13.52]}
 *     centerCoord={[8.082, 17.608]}
 *     countryPath="M..."
 *     countryBBox={{ minX, maxX, minY, maxY }}
 *     durationFrames={150}
 *   />
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

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

interface BBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface Props {
  countryIso: string; // ISO alpha-3 (NER, MLI, etc.)
  countryName: string;
  capitalName?: string;
  capitalCoord?: [number, number]; // [lon, lat]
  centerCoord: [number, number]; // [lon, lat] centre pays pour focus globe
  countryPath: string; // SVG path pre-genere pour silhouette panel
  countryBBox: BBox;
  highlightColor?: string;
  accentColor?: string;
  durationFrames?: number;
  /** Zoom Mapbox final (1.5 = vue globe avec pays visible). 1.2 = globe entier. */
  finalZoom?: number;
}

export const GlobeCountryRevealMapbox: React.FC<Props> = ({
  countryIso,
  countryName,
  capitalName,
  capitalCoord,
  centerCoord,
  countryPath,
  countryBBox,
  highlightColor = "#f5d547",
  accentColor = "#f5d547",
  durationFrames = 150,
  finalZoom = 1.6,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox globe reveal"));
  const [ready, setReady] = useState(false);
  const [pinScreen, setPinScreen] = useState<{ x: number; y: number } | null>(null);

  // Globe entry rotation : commence un peu decale, atterrit sur centerCoord
  const startLon = centerCoord[0] - 35;
  const startZoom = 1.2;

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
      style: "mapbox://styles/mapbox/dark-v11",
      projection: { name: "globe" },
      center: [startLon, centerCoord[1] - 5],
      zoom: startZoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      // Atmosphere bleu nuit
      map.setFog({
        color: "#0a1834",
        "high-color": "#1a2548",
        "horizon-blend": 0.04,
        "space-color": "#020714",
        "star-intensity": 0.6,
      });

      // Cacher labels
      const layers = map.getStyle().layers ?? [];
      for (const l of layers) {
        if (l.type === "symbol") map.setLayoutProperty(l.id, "visibility", "none");
      }

      // Highlight pays — fill jaune
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

      // Bordure pays
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

      setReady(true);
      continueRender(handle);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handle, countryIso, highlightColor, startLon, centerCoord]);

  // Drive camera + projeter coord pays
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    // Rotation lon : startLon -> centerCoord[0] de f0 a f60
    const t = Math.min(1, frame / 60);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const curLon = startLon + (centerCoord[0] - startLon) * ease;
    const curLat = centerCoord[1] - 5 + (centerCoord[1] - (centerCoord[1] - 5)) * ease;
    const curZoom = startZoom + (finalZoom - startZoom) * ease;

    mapRef.current.jumpTo({
      center: [curLon, curLat],
      zoom: curZoom,
    });

    // Projeter le centre du pays a l'ecran pour positionner le reticule
    const screen = mapRef.current.project(centerCoord);
    setPinScreen({ x: screen.x, y: screen.y });
  }, [frame, ready, centerCoord, finalZoom, startLon]);

  // Animations overlay
  const reticleProgress = spring({
    frame: frame - 30,
    fps: 30,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 22,
  });

  const linkProgress = spring({
    frame: frame - 50,
    fps: 30,
    config: { damping: 100, stiffness: 70 },
    durationInFrames: 25,
  });

  const panelSlide = spring({
    frame: frame - 60,
    fps: 30,
    config: { damping: 90, stiffness: 65 },
    durationInFrames: 32,
  });

  const nameOpacity = spring({
    frame: frame - 80,
    fps: 30,
    config: { damping: 150, stiffness: 100 },
    durationInFrames: 22,
  });

  const globalOpacity = interpolate(
    frame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Reticule pulse (subtil)
  const pulseScale = 1 + 0.08 * Math.sin(frame * 0.18);

  // Panel
  const PANEL_X = 80;
  const PANEL_Y = 1280;
  const PANEL_W = 920;
  const PANEL_H = 480;
  const PANEL_PAD = 48;

  const LINE_END_X = PANEL_X + PANEL_W / 2;
  const LINE_END_Y = PANEL_Y + 4;

  // Auto-centrer silhouette
  const { minX: bMinX, maxX: bMaxX, minY: bMinY, maxY: bMaxY } = countryBBox;
  const bW = bMaxX - bMinX;
  const bH = bMaxY - bMinY;
  const availW = PANEL_W - PANEL_PAD * 2 - 80;
  const availH = PANEL_H - PANEL_PAD * 2 - 60;
  const shapeScale = Math.min(availW / bW, availH / bH) * 0.92;
  const shapeTX = PANEL_PAD + 60 + availW / 2 - (bMinX + bW / 2) * shapeScale;
  const shapeTY = PANEL_PAD + 60 + availH / 2 - (bMinY + bH / 2) * shapeScale;

  // Capitale dot dans panel : projeter (capitalCoord - centerCoord) -> approx via meme bbox
  // Simplification : on positionne dot en (panel center) si pas de coord precise.
  // Si capitalCoord donne, on projette via meme orthographic que countryPath.
  // Ici on suppose countryPath genere via d3-geo orthographic rotate(-centerCoord),
  // donc capital = projection de capitalCoord avec meme rotation.
  let capitalDot: { x: number; y: number } | null = null;
  if (capitalCoord) {
    // Approximation simple : mapper coord lon/lat de capitale vers bbox via interpolation
    // Niamey (2.1, 13.5) dans Niger qui s'etend bbox lon[0.16,15.99] lat[11.69,23.52]
    // On utilise un mapping lineaire simple pour positionner dans la bbox du path SVG.
    // Pour rendu correct il faudrait faire d3-geo orthographic mais en simple :
    // user fournit countryPath pre-projete, donc on accepte capitalSvgCoord plutot que lon/lat.
    capitalDot = null; // desactive ici, voir prop capitalSvgCoord ci-dessous
  }

  const panelTranslateY = interpolate(panelSlide, [0, 1], [60, 0]);

  return (
    <AbsoluteFill style={{ background: "#020714", opacity: globalOpacity }}>
      {/* Mapbox globe en arriere-plan */}
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

      {/* Mapbox branding hide */}
      <style>{`
        .mapboxgl-ctrl-attrib, .mapboxgl-ctrl-logo { display: none !important; }
      `}</style>

      {/* Overlay SVG : reticule, ligne, panel */}
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
            opacity={reticleProgress}
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
            {/* Croix */}
            <line x1="-58" y1="0" x2="-30" y2="0" stroke={accentColor} strokeWidth="2" />
            <line x1="30" y1="0" x2="58" y2="0" stroke={accentColor} strokeWidth="2" />
            <line x1="0" y1="-58" x2="0" y2="-30" stroke={accentColor} strokeWidth="2" />
            <line x1="0" y1="30" x2="0" y2="58" stroke={accentColor} strokeWidth="2" />
          </g>
        )}

        {/* LIGNE pointillee reticule -> panel */}
        {pinScreen && linkProgress > 0.01 && (
          <g opacity={linkProgress}>
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
            {/* Fleche */}
            <polygon
              points={`${LINE_END_X - 8},${LINE_END_Y - 14} ${LINE_END_X + 8},${LINE_END_Y - 14} ${LINE_END_X},${LINE_END_Y - 2}`}
              fill={accentColor}
            />
          </g>
        )}

        {/* PANEL pays */}
        <g
          transform={`translate(0 ${panelTranslateY})`}
          opacity={panelSlide}
        >
          {/* Fond */}
          <rect
            x={PANEL_X}
            y={PANEL_Y}
            width={PANEL_W}
            height={PANEL_H}
            fill="#1a2548"
            fillOpacity="0.96"
            rx={16}
          />
          {/* Bordure */}
          <rect
            x={PANEL_X}
            y={PANEL_Y}
            width={PANEL_W}
            height={PANEL_H}
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeOpacity="0.5"
            rx={16}
          />

          {/* Silhouette pays */}
          <g
            transform={`translate(${PANEL_X + shapeTX} ${PANEL_Y + shapeTY}) scale(${shapeScale})`}
          >
            <path
              d={countryPath}
              fill={accentColor}
              fillOpacity="0.18"
              stroke={accentColor}
              strokeWidth={1.4 / shapeScale}
              strokeOpacity="0.9"
            />
          </g>
        </g>
      </svg>

      {/* TEXTE panel — DOM pour Bebas Neue */}
      <div
        style={{
          position: "absolute",
          left: PANEL_X + 32,
          top: PANEL_Y + 36 + panelTranslateY,
          opacity: nameOpacity * panelSlide,
          color: "#ffffff",
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
          {countryName}
        </div>
        {capitalName && (
          <div
            style={{
              fontSize: 22,
              fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
              color: accentColor,
              letterSpacing: "0.3em",
              marginTop: 8,
              opacity: 0.85,
            }}
          >
            {capitalName}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
