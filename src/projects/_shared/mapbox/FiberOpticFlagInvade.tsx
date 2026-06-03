/**
 * FiberOpticFlagInvade — V2 hook de FiberOpticBorderDraw + SequentialFlagReveal.
 *
 * Demande Aziz : la frontiere se DESSINE en laser dore, PUIS le drapeau du pays ENVAHIT
 * (remplit) le pays. Sequentiel multi-pays. = hook d'ouverture de video.
 *
 * Sequence PAR PAYS (chacun avec son frame de depart `at`) :
 *   phase 1 (drawDur)     : la frontiere se trace (laser dasharray + glow)
 *   phase 2 (invadeDur)   : le drapeau "envahit" depuis un bord → remplit la silhouette
 *                           (drapeau clippe + masque de revelation directionnel)
 *   puis reste affiche.
 *
 * Combine : reprojection frame-driven (FiberOptic) + clip drapeau (FlagReveal) + sweep
 * de revelation (Sweep). Hybride V+H.
 *
 * Usage :
 *   <FiberOpticFlagInvade center={[-5,27]} baseZoom={3.9}
 *     countries={[
 *       { iso:"MAR", geoName:["Morocco","W. Sahara"], boundaryIsos:["ESH"], flagCode:"ma", at:6,  label:"MAROC" },
 *       { iso:"DZA", geoName:"Algeria",   flagCode:"dz", at:54, label:"ALGERIE" },
 *       { iso:"MRT", geoName:"Mauritania", flagCode:"mr", at:102, label:"MAURITANIE" },
 *     ]}
 *     drawDur={22} invadeDur={20} />
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
import { applyGeoAfriqueV5, MapboxBrandingHide, COUNTRY_CENTERS } from "./MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const IVORY = "#f2ebd9";
const TOPO_PATH = "_shared/geo-data/countries-50m.json";

export interface FlagInvadeCountry {
  iso: string;
  geoName: string | string[];
  boundaryIsos?: string[];
  flagCode: string;
  at: number;
  label?: string;
}

export interface FiberOpticFlagInvadeProps {
  center: [number, number];
  baseZoom?: number;
  countries: FlagInvadeCountry[];
  drawDur?: number;
  invadeDur?: number;
  accentColor?: string;
  driftAmplitude?: number;
  durationFrames?: number;
}

type Rings = number[][][];

export const FiberOpticFlagInvade: React.FC<FiberOpticFlagInvadeProps> = ({
  center,
  baseZoom = 3.9,
  countries,
  drawDur = 22,
  invadeDur = 20,
  accentColor = GOLD,
  driftAmplitude = 0.8,
  durationFrames = 180,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("FiberFlagInvade init"));
  const [ready, setReady] = useState(false);
  const [rings, setRings] = useState<Record<string, Rings>>({});
  const [geoHandle] = useState(() => delayRender("FiberFlagInvade geo"));
  const [flags, setFlags] = useState<Record<string, string>>({});
  // par iso : path d, bbox, longueur contour
  const [proj, setProj] = useState<
    Record<string, { d: string; len: number; bbox: { x: number; y: number; w: number; h: number } }>
  >({});
  const [labelPos, setLabelPos] = useState<Record<string, { x: number; y: number }>>({});

  const effZoom = baseZoom + (isVertical ? 0 : -0.5);

  // Charger geometries
  useEffect(() => {
    let cancelled = false;
    fetch(staticFile(TOPO_PATH))
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries) as unknown as { features: any[] };
        const out: Record<string, Rings> = {};
        for (const c of countries) {
          const names = Array.isArray(c.geoName) ? c.geoName : [c.geoName];
          const rs: Rings = [];
          for (const nm of names) {
            const f = fc.features.find((x) => x.properties?.name === nm);
            if (!f) continue;
            const g = f.geometry;
            if (g.type === "Polygon") rs.push(...(g.coordinates as Rings));
            else if (g.type === "MultiPolygon")
              rs.push(...(g.coordinates as number[][][][]).map((p) => p[0]));
          }
          out[c.iso] = rs;
        }
        setRings(out);
        continueRender(geoHandle);
      })
      .catch(() => continueRender(geoHandle));
    return () => {
      cancelled = true;
    };
  }, [countries, geoHandle]);

  // Charger drapeaux
  useEffect(() => {
    let cancelled = false;
    const out: Record<string, string> = {};
    let pending = countries.length;
    const fh = delayRender("FiberFlagInvade flags");
    if (pending === 0) {
      continueRender(fh);
      return;
    }
    for (const c of countries) {
      const src = `https://flagcdn.com/w2560/${c.flagCode}.png`;
      const img = new Image();
      img.crossOrigin = "anonymous";
      const done = () => {
        pending -= 1;
        if (pending <= 0 && !cancelled) {
          setFlags({ ...out });
          continueRender(fh);
        }
      };
      img.onload = () => {
        out[c.iso] = src;
        done();
      };
      img.onerror = done;
      img.src = src;
    }
    return () => {
      cancelled = true;
    };
  }, [countries]);

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
      const allFocus = countries.flatMap((c) => [c.iso, ...(c.boundaryIsos ?? [])]);
      if (!map.getLayer("ffi-neighbors")) {
        map.addLayer({
          id: "ffi-neighbors",
          type: "fill",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", allFocus]]],
          paint: { "fill-color": IVORY, "fill-opacity": 0.05 },
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

  // Drift + reprojection (path + longueur + bbox)
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const driftT = interpolate(frame, [0, durationFrames], [-1, 1]);
    const driftLon = isVertical ? 0 : driftT * driftAmplitude;
    const driftLat = isVertical ? driftT * driftAmplitude : 0;
    map.jumpTo({
      center: [center[0] + driftLon, center[1] + driftLat],
      zoom: effZoom + interpolate(frame, [0, durationFrames], [0, 0.1]),
      bearing: 0,
      pitch: 0,
    });

    const next: typeof proj = {};
    for (const c of countries) {
      const rs = rings[c.iso];
      if (!rs || !rs.length) continue;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const parts: string[] = [];
      let len = 0;
      for (const ring of rs) {
        let seg = "";
        let prev: { x: number; y: number } | null = null;
        ring.forEach((coord, i) => {
          const p = map.project(coord as [number, number]);
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
          seg += `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          if (prev) len += Math.hypot(p.x - prev.x, p.y - prev.y);
          prev = p;
        });
        seg += "Z";
        parts.push(seg);
      }
      next[c.iso] = {
        d: parts.join(" "),
        len: Math.max(1, len),
        bbox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY },
      };
    }
    setProj(next);

    const lp: Record<string, { x: number; y: number }> = {};
    for (const c of countries) {
      const cc = COUNTRY_CENTERS[c.iso];
      if (cc) {
        const s = map.project(cc);
        lp[c.iso] = { x: s.x, y: s.y };
      }
    }
    setLabelPos(lp);
  }, [frame, ready, center, effZoom, durationFrames, isVertical, driftAmplitude, countries, rings]);

  const globalOpacity = interpolate(
    frame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const labelSize = isVertical ? 60 : 46;

  return (
    <AbsoluteFill style={{ background: "#16213a", opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="ffi-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {countries.map((c) =>
            proj[c.iso] ? (
              <clipPath key={c.iso} id={`ffi-clip-${c.iso}`}>
                <path d={proj[c.iso].d} />
              </clipPath>
            ) : null
          )}
          {countries.map((c) => {
            const pr = proj[c.iso];
            if (!pr) return null;
            const rel = frame - c.at;
            // phase 2 : revelation directionnelle du drapeau (gauche→droite)
            const invadeT = interpolate(rel, [drawDur, drawDur + invadeDur], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const soft = 0.08;
            return (
              <linearGradient key={c.iso} id={`ffi-mask-${c.iso}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fff" stopOpacity={1} />
                <stop offset={`${Math.max(0, (invadeT - soft) * 100)}%`} stopColor="#fff" stopOpacity={1} />
                <stop offset={`${Math.min(100, invadeT * 100)}%`} stopColor="#fff" stopOpacity={0} />
                <stop offset="100%" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
            );
          })}
          {countries.map((c) =>
            proj[c.iso] ? (
              <mask key={c.iso} id={`ffi-revealmask-${c.iso}`} maskUnits="userSpaceOnUse">
                <rect
                  x={proj[c.iso].bbox.x}
                  y={proj[c.iso].bbox.y}
                  width={proj[c.iso].bbox.w}
                  height={proj[c.iso].bbox.h}
                  fill={`url(#ffi-mask-${c.iso})`}
                />
              </mask>
            ) : null
          )}
        </defs>

        {countries.map((c) => {
          const pr = proj[c.iso];
          const fl = flags[c.iso];
          if (!pr) return null;
          const rel = frame - c.at;
          if (rel < 0) return null;

          // phase 1 : trace de la frontiere
          const drawT = interpolate(rel, [0, drawDur], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const drawn = pr.len * drawT;
          // phase 2 : drapeau envahit
          const invadeStarted = rel >= drawDur;

          return (
            <g key={c.iso}>
              {/* drapeau qui envahit (clippe dans le pays + masque directionnel) */}
              {invadeStarted && fl && (
                <g clipPath={`url(#ffi-clip-${c.iso})`} mask={`url(#ffi-revealmask-${c.iso})`}>
                  <image
                    href={fl}
                    x={pr.bbox.x}
                    y={pr.bbox.y}
                    width={pr.bbox.w}
                    height={pr.bbox.h}
                    preserveAspectRatio="xMidYMid slice"
                    opacity={0.95}
                  />
                </g>
              )}
              {/* frontiere laser (toujours visible une fois tracee) */}
              <path
                d={pr.d}
                fill="none"
                stroke={accentColor}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`${drawn} ${pr.len}`}
                filter="url(#ffi-glow)"
                opacity={0.95}
              />
            </g>
          );
        })}
      </svg>

      {/* Labels — apparaissent quand le drapeau envahit */}
      {countries.map((c) => {
        if (!c.label || !labelPos[c.iso]) return null;
        const rel = frame - c.at;
        const op = interpolate(rel, [drawDur, drawDur + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (op <= 0.01) return null;
        return (
          <div
            key={c.iso}
            style={{
              position: "absolute",
              left: labelPos[c.iso].x,
              top: labelPos[c.iso].y,
              transform: "translate(-50%, -50%)",
              opacity: op,
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                color: IVORY,
                fontSize: labelSize,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                textShadow: "0 2px 16px rgba(0,0,0,0.95)",
              }}
            >
              {c.label}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default FiberOpticFlagInvade;
