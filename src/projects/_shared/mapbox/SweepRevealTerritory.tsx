/**
 * SweepRevealTerritory — un faisceau lumineux gold TRAVERSE un pays et l'allume au passage.
 *
 * Idee Gemini #1 (Chantier C v2, axe Aziz : dynamisme + couleur + accrocher l'oeil).
 * Effet "scanner strategique / lever de soleil" : la couleur du territoire se revele dans le
 * sillage d'un faisceau qui balaye, au lieu d'apparaitre d'un bloc.
 *
 * Technique :
 *   - Vraie carte Mapbox dessous (drift, voisins ivory, ocean navy).
 *   - Silhouette du pays reprojetee frame-driven (map.project) → clipPath SVG.
 *   - DANS le clip : (a) un fill de base gold faible + (b) une bande de gradient lumineux
 *     qui se deplace (le "faisceau"), + (c) un masque de revelation : la partie deja
 *     balayee reste allumee (opacite montee progressive selon position du front).
 *   - Direction du balayage adaptative : V = vertical (haut→bas), H = horizontal (gauche→droite).
 *
 * Usage :
 *   <SweepRevealTerritory countryIso="MAR" geoName={["Morocco","W. Sahara"]} boundaryIsos={["ESH"]}
 *     center={[-7,31]} baseZoom={4.8} label="MAROC" sweepAt={10} sweepDur={45} />
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

export interface SweepRevealTerritoryProps {
  countryIso: string;
  geoName: string | string[];
  boundaryIsos?: string[];
  center: [number, number];
  baseZoom?: number;
  label: string;
  /** Frame de demarrage du balayage */
  sweepAt?: number;
  /** Duree du balayage (frames) */
  sweepDur?: number;
  /** Couleur du faisceau + remplissage revele */
  accentColor?: string;
  durationFrames?: number;
  showHatching?: boolean;
}

export const SweepRevealTerritory: React.FC<SweepRevealTerritoryProps> = ({
  countryIso,
  geoName,
  boundaryIsos = [],
  center,
  baseZoom = 4.8,
  label,
  sweepAt = 10,
  sweepDur = 45,
  accentColor = GOLD,
  durationFrames = 150,
  showHatching = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("SweepReveal init"));
  const [ready, setReady] = useState(false);
  const [rings, setRings] = useState<number[][][]>([]);
  const [geoHandle] = useState(() => delayRender("SweepReveal geo"));
  const [pathData, setPathData] = useState<string>("");
  const [bbox, setBbox] = useState<{ x: number; y: number; w: number; h: number } | null>(
    null
  );

  const effZoom = baseZoom + (isVertical ? 0 : -0.5);
  const borderId = `sweep-border-${countryIso}`;
  const neighborsId = "sweep-neighbors";

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
      const focus = [countryIso, ...boundaryIsos];
      if (!map.getLayer(neighborsId)) {
        map.addLayer({
          id: neighborsId,
          type: "fill",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", focus]]],
          paint: { "fill-color": IVORY, "fill-opacity": 0.05 },
        });
      }
      if (!map.getLayer(borderId)) {
        map.addLayer({
          id: borderId,
          type: "line",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["in", ["get", "iso_3166_1_alpha_3"], ["literal", focus]],
          paint: { "line-color": accentColor, "line-width": 2.5, "line-opacity": 0 },
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

  // Drift + reprojection + bordure
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const driftBearing = interpolate(frame, [0, durationFrames], [-3, 3]);
    const driftZoom = effZoom + interpolate(frame, [0, durationFrames], [0, 0.14]);
    map.jumpTo({ center, zoom: driftZoom, bearing: driftBearing, pitch: 0 });

    if (rings.length) {
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      const parts: string[] = [];
      for (const ring of rings) {
        let seg = "";
        ring.forEach((coord, i) => {
          const p = map.project(coord as [number, number]);
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
          seg += `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        });
        seg += "Z";
        parts.push(seg);
      }
      setPathData(parts.join(" "));
      setBbox({ x: minX, y: minY, w: maxX - minX, h: maxY - minY });
    }

    const borderOp = interpolate(frame - sweepAt, [0, 16], [0, 0.95], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    try {
      map.setPaintProperty(borderId, "line-opacity", borderOp);
    } catch {}
  }, [frame, ready, center, effZoom, durationFrames, sweepAt, borderId, rings]);

  // Progression du faisceau 0→1
  const sweepT = interpolate(frame - sweepAt, [0, sweepDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const globalOpacity = interpolate(
    frame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const labelOp = interpolate(frame - sweepAt, [sweepDur * 0.6, sweepDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const clipId = `sweep-clip-${countryIso}`;
  const revealGradId = `sweep-reveal-${countryIso}`;
  const beamGradId = `sweep-beam-${countryIso}`;
  const labelSize = isVertical ? 84 : 64;

  // Geometrie du balayage selon format + bbox
  // V : balayage vertical (y) ; H : horizontal (x)
  const beamThickness = 0.18; // proportion de la dimension balayee
  let revealStops: { offset: number; op: number }[] = [];
  let gradCoords = { x1: "0%", y1: "0%", x2: "0%", y2: "100%" };
  let beamCoords = { x1: "0%", y1: "0%", x2: "0%", y2: "100%" };

  if (bbox) {
    // front de revelation : tout ce qui est "avant" le front est allume
    const front = sweepT; // 0→1 le long de l'axe
    const soft = 0.06;
    revealStops = [
      { offset: 0, op: 1 },
      { offset: Math.max(0, front - soft), op: 1 },
      { offset: Math.min(1, front), op: 0 },
      { offset: 1, op: 0 },
    ];
    if (isVertical) {
      gradCoords = { x1: "0%", y1: "0%", x2: "0%", y2: "100%" };
      beamCoords = { x1: "0%", y1: "0%", x2: "0%", y2: "100%" };
    } else {
      gradCoords = { x1: "0%", y1: "0%", x2: "100%", y2: "0%" };
      beamCoords = { x1: "0%", y1: "0%", x2: "100%", y2: "0%" };
    }
  }

  // position du faisceau (bande brillante) centree sur le front
  const beamCenter = sweepT;
  const beamHalf = beamThickness / 2;

  return (
    <AbsoluteFill style={{ background: "#16213a", opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {pathData && bbox && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <defs>
            <clipPath id={clipId}>
              <path d={pathData} />
            </clipPath>
            {/* Hachures diagonales ivory — blueprint industriel, visibles sur fond gold */}
            <pattern id={`hatch-${countryIso}`} patternUnits="userSpaceOnUse" width={18} height={18} patternTransform="rotate(-45)">
              <line x1={0} y1={0} x2={0} y2={18} stroke={IVORY} strokeWidth={2.5} strokeOpacity={0.55} />
            </pattern>
            {/* Gradient de revelation : zone deja balayee = allumee (objectBoundingBox) */}
            <linearGradient id={revealGradId} {...gradCoords}>
              {revealStops.map((s, i) => (
                <stop
                  key={i}
                  offset={`${s.offset * 100}%`}
                  stopColor={accentColor}
                  stopOpacity={s.op}
                />
              ))}
            </linearGradient>
            {/* Gradient du faisceau brillant (bande etroite ivory autour du front) */}
            <linearGradient id={beamGradId} {...beamCoords}>
              <stop offset={`${Math.max(0, (beamCenter - beamHalf) * 100)}%`} stopColor={IVORY} stopOpacity={0} />
              <stop offset={`${beamCenter * 100}%`} stopColor={IVORY} stopOpacity={0.9} />
              <stop offset={`${Math.min(100, (beamCenter + beamHalf) * 100)}%`} stopColor={IVORY} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Couche revelee (gold) — clippee dans le pays */}
          <g clipPath={`url(#${clipId})`}>
            <rect
              x={bbox.x}
              y={bbox.y}
              width={bbox.w}
              height={bbox.h}
              fill={`url(#${revealGradId})`}
              opacity={0.55}
            />
            {/* Hachures diagonales — s'affichent uniquement si showHatching, dans la zone revelée */}
            {showHatching && sweepT > 0 && (
              <rect
                x={bbox.x}
                y={bbox.y}
                width={bbox.w}
                height={bbox.h}
                fill={`url(#hatch-${countryIso})`}
              />
            )}
            {/* Faisceau brillant qui passe */}
            {sweepT > 0 && sweepT < 1 && (
              <rect
                x={bbox.x}
                y={bbox.y}
                width={bbox.w}
                height={bbox.h}
                fill={`url(#${beamGradId})`}
              />
            )}
          </g>
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

export default SweepRevealTerritory;
