import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as d3 from "d3-geo";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

// ---------------------------------------------------------------------------
// Routes commerciales or — coordonnées géographiques réelles
// ---------------------------------------------------------------------------
const GOLD_ROUTES: Array<{
  id: string;
  label: string;
  color: string;
  coords: [number, number][];
  labelPos: [number, number];
}> = [
  {
    id: "ghana-maroc",
    label: "Route de l'or → Marrakech",
    color: "#D4AF37",
    coords: [
      [-1.023,  7.946],  // Accra, Ghana
      [-5.354, 11.854],  // Bamako, Mali
      [-4.003, 17.570],  // Tombouctou
      [-5.008, 24.100],  // Sahara central
      [-7.992, 31.630],  // Marrakech, Maroc
    ],
    labelPos: [-6.0, 20.0],
  },
  {
    id: "ghana-niger",
    label: "Route minière → Niamey",
    color: "#E8A020",
    coords: [
      [-1.023,  7.946],  // Accra
      [ 1.213,  9.032],  // Lomé
      [ 2.351,  6.366],  // Cotonou
      [ 3.396,  6.455],  // Lagos
      [ 7.998, 13.513],  // Kano
      [ 2.116, 13.515],  // Niamey
    ],
    labelPos: [4.0, 10.5],
  },
];

// Cercles proportionnels production or (tonnes/an)
const GOLD_PRODUCERS = [
  { iso: "GHA", lon: -1.023, lat:  7.946, tons: 130, label: "130t" },
  { iso: "MLI", lon: -2.000, lat: 17.571, tons:  72, label: "72t" },
  { iso: "BFA", lon: -1.562, lat: 12.364, tons:  60, label: "60t" },
  { iso: "NER", lon:  8.082, lat: 17.608, tons:  25, label: "25t" },
];

const MAX_TONS = 130;

// Caméra — vue Afrique de l'Ouest + Sahara + Maghreb
const CAM = { lon: -3.0, lat: 16.0, zoom: 3.2, pitch: 30, bearing: 0 };

const TOTAL_FRAMES = 300; // 10s

export const MapboxD3Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox D3 Overlay"));
  const [ready, setReady] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ x: number; y: number; zoom: number } | null>(null);

  // Progression du dessin des routes
  const routeProgress = interpolate(frame, [20, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Apparition des cercles
  const circlesProgress = interpolate(frame, [100, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label titre
  const titleOpacity = interpolate(frame, [200, 230], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Projection Mercator Mapbox → pixel SVG
  // On utilise mapboxgl.MercatorCoordinate pour projeter
  const project = (lon: number, lat: number): [number, number] | null => {
    if (!mapRef.current) return null;
    const pt = mapRef.current.project([lon, lat]);
    return [pt.x, pt.y];
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [CAM.lon, CAM.lat],
      zoom: CAM.zoom,
      pitch: CAM.pitch,
      bearing: CAM.bearing,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }

      // Highlight Ghana en or
      if (!map.getLayer("ghana-fill")) map.addLayer({
        id: "ghana-fill",
        type: "fill",
        source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "fill-color": "#D4AF37", "fill-opacity": 0.5 },
      });

      setReady(true);
      setMapCenter({ x: width / 2, y: height / 2, zoom: CAM.zoom });
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle, width, height]);

  // Forcer re-render SVG à chaque frame
  useEffect(() => {
    if (ready) setMapCenter({ x: width / 2, y: height / 2, zoom: CAM.zoom });
  }, [frame, ready, width, height]);

  // Construire les paths SVG des routes avec progression
  const routePaths = useMemo(() => {
    if (!ready || !mapRef.current) return [];

    return GOLD_ROUTES.map((route) => {
      const pixels = route.coords
        .map((c) => project(c[0], c[1]))
        .filter(Boolean) as [number, number][];

      if (pixels.length < 2) return null;

      // Construire path complet
      const fullPath = pixels
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
        .join(" ");

      // Calculer longueur approximative pour le stroke-dasharray
      let totalLen = 0;
      for (let i = 1; i < pixels.length; i++) {
        const dx = pixels[i][0] - pixels[i-1][0];
        const dy = pixels[i][1] - pixels[i-1][1];
        totalLen += Math.sqrt(dx*dx + dy*dy);
      }

      const drawn = totalLen * routeProgress;

      // Label position
      const labelPx = project(route.labelPos[0], route.labelPos[1]);

      return { ...route, fullPath, totalLen, drawn, labelPx };
    }).filter(Boolean);
  }, [mapCenter, routeProgress, ready]);

  // Cercles producteurs
  const producerCircles = useMemo(() => {
    if (!ready || !mapRef.current) return [];

    return GOLD_PRODUCERS.map((p) => {
      const px = project(p.lon, p.lat);
      if (!px) return null;

      const maxRadius = 28;
      const radius = (p.tons / MAX_TONS) * maxRadius * circlesProgress;
      const pulseRadius = radius + spring({ frame: Math.max(0, frame - 120), fps, config: { damping: 8, stiffness: 100 } }) * 8;

      return { ...p, px, radius, pulseRadius };
    }).filter(Boolean);
  }, [mapCenter, circlesProgress, frame, fps, ready]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {/* SVG overlay d3-geo par-dessus Mapbox */}
      {ready && (
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        >
          <defs>
            {/* Glow filter pour les routes */}
            <filter id="glow-gold">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-orange">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Routes commerciales animées */}
          {routePaths.map((route) => route && (
            <g key={route.id}>
              {/* Halo lumineux */}
              <path
                d={route.fullPath}
                fill="none"
                stroke={route.color}
                strokeWidth={6}
                strokeOpacity={0.15}
                strokeDasharray={`${route.drawn} ${route.totalLen}`}
                filter={`url(#glow-${route.color === "#D4AF37" ? "gold" : "orange"})`}
              />
              {/* Ligne principale */}
              <path
                d={route.fullPath}
                fill="none"
                stroke={route.color}
                strokeWidth={2.5}
                strokeOpacity={0.9}
                strokeDasharray={`${route.drawn} ${route.totalLen}`}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Point de tête animé */}
              {routeProgress > 0.05 && routeProgress < 0.98 && route.labelPx && (
                <circle
                  cx={route.labelPx[0]}
                  cy={route.labelPx[1]}
                  r={4}
                  fill={route.color}
                  opacity={0.9}
                />
              )}
            </g>
          ))}

          {/* Cercles proportionnels producteurs */}
          {producerCircles.map((p) => p && (
            <g key={p.iso}>
              {/* Halo pulse */}
              <circle
                cx={p.px[0]}
                cy={p.px[1]}
                r={p.pulseRadius}
                fill={GOLD_PRODUCERS.find(x => x.iso === p.iso)?.tons === MAX_TONS ? "#D4AF37" : "#E8A020"}
                opacity={0.12}
              />
              {/* Cercle principal */}
              <circle
                cx={p.px[0]}
                cy={p.px[1]}
                r={p.radius}
                fill={GOLD_PRODUCERS.find(x => x.iso === p.iso)?.tons === MAX_TONS ? "#D4AF37" : "#E8A020"}
                opacity={0.75}
              />
              {/* Label tonnes */}
              {p.radius > 8 && (
                <text
                  x={p.px[0]}
                  y={p.px[1] - p.radius - 6}
                  textAnchor="middle"
                  fill="white"
                  fontSize={13}
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                  opacity={circlesProgress}
                >
                  {p.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      )}

      {/* Titre en overlay */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 48,
          opacity: titleOpacity,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.82)",
            border: "2px solid #D4AF37",
            borderRadius: 8,
            padding: "10px 24px",
          }}
        >
          <div style={{ fontSize: 11, fontFamily: "Arial, sans-serif", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>
            PRODUCTION D'OR — AFRIQUE DE L'OUEST
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "Arial Black, sans-serif", color: "#D4AF37" }}>
            Routes commerciales actives
          </div>
          <div style={{ fontSize: 14, fontFamily: "Arial, sans-serif", color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
            Taille des cercles = production annuelle (tonnes)
          </div>
        </div>
      </div>

      {/* Légende routes */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          right: 48,
          opacity: interpolate(frame, [150, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          pointerEvents: "none",
        }}
      >
        <div style={{ backgroundColor: "rgba(0,0,0,0.78)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "10px 18px" }}>
          {GOLD_ROUTES.map((r) => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 24, height: 2.5, backgroundColor: r.color, borderRadius: 2 }} />
              <div style={{ fontSize: 13, fontFamily: "Arial, sans-serif", color: "rgba(255,255,255,0.7)" }}>{r.label}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MAPBOX_D3_OVERLAY_FRAMES = TOTAL_FRAMES;
