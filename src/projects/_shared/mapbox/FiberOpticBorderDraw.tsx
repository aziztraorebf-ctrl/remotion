/**
 * FiberOpticBorderDraw — la frontiere d'un pays se DESSINE comme un laser/fibre optique doree
 * qui court le long du trace, puis pulse et remplit legerement l'interieur.
 *
 * Idee Gemini #3 (Chantier C v2, axe Aziz : dynamisme + couleur + accrocher l'oeil).
 * Effet "salle de controle" nerveux et haut de gamme : attire l'oeil sur la beaute du trace
 * frontalier avant meme de parler du pays.
 *
 * Technique :
 *   - Vraie carte Mapbox dessous (drift, ocean navy, voisins ivory).
 *   - Frontiere reprojetee frame-driven (map.project) → path SVG.
 *   - stroke-dasharray + stroke-dashoffset animes → le trait se "dessine" le long du contour.
 *   - Filtre glow (feGaussianBlur) pour le halo fibre optique.
 *   - Apres le trace : fill interieur monte legerement + pulse.
 *
 * Usage :
 *   <FiberOpticBorderDraw countryIso="SEN" geoName="Senegal" center={[-14.5,14.5]}
 *     baseZoom={5.8} label="SENEGAL" drawAt={8} drawDur={45} />
 *
 * IMPORTANT : render via scripts/render-mapbox.sh (WebGL headless).
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { feature } from "topojson-client";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { applyGeoAfriqueV5, MapboxBrandingHide } from "./MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const IVORY = "#f2ebd9";
const TOPO_PATH = "_shared/geo-data/countries-50m.json";

export interface FiberOpticBorderDrawProps {
  countryIso: string;
  geoName: string | string[];
  center: [number, number];
  baseZoom?: number;
  label: string;
  drawAt?: number;
  drawDur?: number;
  accentColor?: string;
  durationFrames?: number;
}

export const FiberOpticBorderDraw: React.FC<FiberOpticBorderDrawProps> = ({
  countryIso,
  geoName,
  center,
  baseZoom = 5.8,
  label,
  drawAt = 8,
  drawDur = 45,
  accentColor = GOLD,
  durationFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("FiberOptic init"));
  const [ready, setReady] = useState(false);
  const [rings, setRings] = useState<number[][][]>([]);
  const [geoHandle] = useState(() => delayRender("FiberOptic geo"));
  // path SVG + longueur estimee par anneau
  const [paths, setPaths] = useState<{ d: string; len: number }[]>([]);

  const effZoom = baseZoom + (isVertical ? 0 : -0.5);
  const fillId = `fiber-fill-${countryIso}`;

  // Charger geometrie
  useEffect(() => {
    let cancelled = false;
    fetch(staticFile(TOPO_PATH))
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries) as unknown as {
          features: any[];
        };
        const names = Array.isArray(geoName) ? geoName : [geoName];
        const rs: number[][][] = [];
        for (const nm of names) {
          const f = fc.features.find((x) => x.properties?.name === nm);
          if (!f) continue;
          const g = f.geometry;
          if (g.type === "Polygon") rs.push(...(g.coordinates as number[][][]));
          else if (g.type === "MultiPolygon")
            rs.push(...(g.coordinates as number[][][][]).map((p) => p[0]));
        }
        setRings(rs);
        continueRender(geoHandle);
      })
      .catch(() => continueRender(geoHandle));
    return () => {
      cancelled = true;
    };
  }, [geoName, geoHandle]);

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
      // Voisins ivory
      if (!map.getLayer("fiber-neighbors")) {
        map.addLayer({
          id: "fiber-neighbors",
          type: "fill",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["!=", ["get", "iso_3166_1_alpha_3"], countryIso],
          paint: { "fill-color": IVORY, "fill-opacity": 0.05 },
        });
      }
      // Fill interieur du pays (monte apres le trace)
      if (!map.getLayer(fillId)) {
        map.addLayer({
          id: fillId,
          type: "fill",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], countryIso],
          paint: { "fill-color": accentColor, "fill-opacity": 0 },
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

  // Drift + reprojection (calcule longueur de chaque anneau pour dasharray)
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const driftBearing = interpolate(frame, [0, durationFrames], [-2.5, 2.5]);
    const driftZoom = effZoom + interpolate(frame, [0, durationFrames], [0, 0.12]);
    map.jumpTo({ center, zoom: driftZoom, bearing: driftBearing, pitch: 0 });

    if (rings.length) {
      const out: { d: string; len: number }[] = [];
      for (const ring of rings) {
        let seg = "";
        let len = 0;
        let prev: { x: number; y: number } | null = null;
        ring.forEach((coord, i) => {
          const p = map.project(coord as [number, number]);
          if (i === 0) {
            seg += `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          } else {
            seg += `L${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            if (prev) len += Math.hypot(p.x - prev.x, p.y - prev.y);
          }
          prev = p;
        });
        seg += "Z";
        out.push({ d: seg, len: Math.max(1, len) });
      }
      setPaths(out);
    }

    // Fill interieur : monte apres la fin du trace, pulse leger
    const afterDraw = frame - (drawAt + drawDur);
    const fillBase = interpolate(afterDraw, [0, 16], [0, 0.32], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const pulse = afterDraw > 16 ? 0.32 + 0.05 * Math.sin((afterDraw - 16) * 0.12) : fillBase;
    try {
      map.setPaintProperty(fillId, "fill-opacity", afterDraw > 16 ? pulse : fillBase);
    } catch {}
  }, [frame, ready, center, effZoom, durationFrames, drawAt, drawDur, fillId, rings]);

  // Progression du trace 0→1
  const drawT = interpolate(frame - drawAt, [0, drawDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const globalOpacity = interpolate(
    frame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const labelOp = interpolate(frame - drawAt, [drawDur * 0.7, drawDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowId = `fiber-glow-${countryIso}`;
  const labelSize = isVertical ? 76 : 60;

  return (
    <AbsoluteFill style={{ background: "#16213a", opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {paths.length > 0 && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <defs>
            <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {paths.map((p, i) => {
            const drawn = p.len * drawT;
            return (
              <g key={i}>
                {/* trace fibre optique : dasharray [drawn, reste] */}
                <path
                  d={p.d}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={`${drawn} ${p.len}`}
                  filter={`url(#${glowId})`}
                  opacity={0.95}
                />
                {/* point brillant de tete (laser) */}
              </g>
            );
          })}
        </svg>
      )}

      {/* Label */}
      <div
        style={{
          position: "absolute",
          bottom: isVertical ? height * 0.12 : height * 0.08,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: labelOp,
        }}
      >
        <span
          style={{
            color: IVORY,
            fontSize: labelSize,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            textShadow: "0 4px 24px rgba(0,0,0,0.7)",
          }}
        >
          {label}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export default FiberOpticBorderDraw;
