/**
 * SequentialFlagReveal — plusieurs pays s'allument EN SEQUENCE avec LEUR DRAPEAU rempli
 * dans leur silhouette, sur une vraie carte Mapbox. Une fois allume, un pays RESTE allume.
 *
 * V2 demandee par Aziz (Chantier C) : combine
 *   - la sequence d'allumage de SequentialBorderPulse (chaque pays a son frame "at")
 *   - le drapeau clippe dans la silhouette de MapboxFlagFill (SVG clip + reprojection
 *     frame-driven via map.project → colle a la carte pendant le drift)
 *
 * C'est la technique classique des chaines cartographiques : "les pays X, Y, Z" et chacun
 * se remplit de son drapeau a tour de role, le tout restant affiche.
 *
 * Aligne Playbook : P1 sequentiel · P2 drift · P2bis altitude · P3 voisins ivory · P4 drapeaux.
 *
 * Usage :
 *   <SequentialFlagReveal center={[-3, 28]} baseZoom={4.0}
 *     countries={[
 *       { iso: "MAR", geoName: ["Morocco","W. Sahara"], boundaryIsos: ["ESH"], flagCode: "ma", at: 12, label: "MAROC" },
 *       { iso: "DZA", geoName: "Algeria",   flagCode: "dz", at: 48, label: "ALGERIE" },
 *       { iso: "MRT", geoName: "Mauritania", flagCode: "mr", at: 84, label: "MAURITANIE" },
 *     ]} />
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

export interface FlagRevealCountry {
  /** ISO alpha-3 (pour bordure Mapbox + label center) */
  iso: string;
  /** Nom(s) Natural Earth pour la geometrie du clip */
  geoName: string | string[];
  /** ISO additionnels pour la bordure (ex: ["ESH"] Sahara) */
  boundaryIsos?: string[];
  /** ISO-2 lowercase → drapeau HD flagcdn */
  flagCode: string;
  /** Frame d'allumage */
  at: number;
  label?: string;
}

export interface SequentialFlagRevealProps {
  center: [number, number];
  baseZoom?: number;
  countries: FlagRevealCountry[];
  accentColor?: string;
  driftAmplitude?: number;
  durationFrames?: number;
}

type Rings = number[][][];

export const SequentialFlagReveal: React.FC<SequentialFlagRevealProps> = ({
  center,
  baseZoom = 4.0,
  countries,
  accentColor = GOLD,
  driftAmplitude = 1.0,
  durationFrames = 180,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("SequentialFlagReveal init"));
  const [ready, setReady] = useState(false);

  // Geometries (anneaux lon/lat) par iso
  const [rings, setRings] = useState<Record<string, Rings>>({});
  const [geoHandle] = useState(() => delayRender("SequentialFlagReveal geo"));
  // Drapeaux (data URL) par iso
  const [flags, setFlags] = useState<Record<string, string>>({});
  // Paths SVG reprojetes + bbox ecran par iso (recalcules chaque frame)
  const [proj, setProj] = useState<
    Record<string, { d: string; bbox: { x: number; y: number; w: number; h: number } }>
  >({});
  // Centres projetes pour labels
  const [labelPos, setLabelPos] = useState<Record<string, { x: number; y: number }>>(
    {}
  );

  const effZoom = baseZoom + (isVertical ? 0 : -0.5);
  const borderId = (iso: string) => `sfr-border-${iso}`;
  const neighborsId = "sfr-neighbors";

  // ── Charger geometries ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    fetch(staticFile(TOPO_PATH))
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries) as unknown as {
          features: any[];
        };
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

  // ── Charger drapeaux (vraies couleurs, HD) ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const out: Record<string, string> = {};
    let pending = countries.length;
    const flagHandle = delayRender("SequentialFlagReveal flags");
    if (pending === 0) {
      continueRender(flagHandle);
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
          continueRender(flagHandle);
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
      // Voisins ivory 10% — exclut tous les pays focus
      const allFocus = countries.flatMap((c) => [c.iso, ...(c.boundaryIsos ?? [])]);
      if (!map.getLayer(neighborsId)) {
        map.addLayer({
          id: neighborsId,
          type: "fill",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", allFocus]]],
          paint: { "fill-color": IVORY, "fill-opacity": 0.05 },
        });
      }
      // Bordure gold par pays (opacite pilotee par frame)
      for (const c of countries) {
        const isos = [c.iso, ...(c.boundaryIsos ?? [])];
        if (!map.getLayer(borderId(c.iso))) {
          map.addLayer({
            id: borderId(c.iso),
            type: "line",
            source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["in", ["get", "iso_3166_1_alpha_3"], ["literal", isos]],
            paint: {
              "line-color": accentColor,
              "line-width": 2.5,
              "line-opacity": 0,
              "line-blur": 0,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Drift + reprojection paths + opacites bordure (reste allume) ─────────────
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    const driftT = interpolate(frame, [0, durationFrames], [-1, 1]);
    const driftLon = isVertical ? 0 : driftT * driftAmplitude;
    const driftLat = isVertical ? driftT * driftAmplitude : 0;
    const driftZoom = effZoom + interpolate(frame, [0, durationFrames], [0, 0.1]);
    map.jumpTo({
      center: [center[0] + driftLon, center[1] + driftLat],
      zoom: driftZoom,
      bearing: 0,
      pitch: 0,
    });

    // Reprojeter chaque pays charge
    const nextProj: typeof proj = {};
    for (const c of countries) {
      const rs = rings[c.iso];
      if (!rs || !rs.length) continue;
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      const parts: string[] = [];
      for (const ring of rs) {
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
      nextProj[c.iso] = {
        d: parts.join(" "),
        bbox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY },
      };
    }
    setProj(nextProj);

    // Bordure : flash a l'allumage puis RESTE allumee (breathe doux)
    for (const c of countries) {
      const rel = frame - c.at;
      const lineW = interpolate(rel, [0, 6, 16], [1, 4, 2.5], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const lineBlur = interpolate(rel, [0, 6, 20], [0, 6, 1.5], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const baseOp = interpolate(rel, [0, 6, 14], [0, 1, 0.9], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const breathe = rel > 16 ? 0.9 + 0.05 * Math.sin((rel - 16) * 0.1) : baseOp;
      try {
        map.setPaintProperty(borderId(c.iso), "line-opacity", rel > 16 ? breathe : baseOp);
        map.setPaintProperty(borderId(c.iso), "line-width", lineW);
        map.setPaintProperty(borderId(c.iso), "line-blur", lineBlur);
      } catch {}
    }

    // Labels
    const lp: Record<string, { x: number; y: number }> = {};
    for (const c of countries) {
      const cc = COUNTRY_CENTERS[c.iso];
      if (cc) {
        const s = map.project(cc);
        lp[c.iso] = { x: s.x, y: s.y };
      }
    }
    setLabelPos(lp);
  }, [
    frame,
    ready,
    center,
    effZoom,
    durationFrames,
    isVertical,
    driftAmplitude,
    countries,
    rings,
  ]);

  const globalOpacity = interpolate(
    frame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const labelSize = isVertical ? 34 : 28;

  return (
    <AbsoluteFill style={{ background: "#16213a", opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {/* Drapeaux clippes — un <image> + clipPath par pays. Reste affiche apres "at". */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          {countries.map((c) =>
            proj[c.iso] ? (
              <clipPath key={c.iso} id={`sfr-clip-${c.iso}`}>
                <path d={proj[c.iso].d} />
              </clipPath>
            ) : null
          )}
        </defs>
        {countries.map((c) => {
          const pr = proj[c.iso];
          const fl = flags[c.iso];
          if (!pr || !fl) return null;
          const rel = frame - c.at;
          // apparition : 0 → 1 (flash) → 0.95, PUIS reste (clamp a droite)
          const op = interpolate(rel, [0, 12, 18], [0, 1, 0.95], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (op <= 0.01) return null;
          return (
            <g key={c.iso}>
              <image
                href={fl}
                x={pr.bbox.x}
                y={pr.bbox.y}
                width={pr.bbox.w}
                height={pr.bbox.h}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#sfr-clip-${c.iso})`}
                opacity={op}
              />
              <path
                d={pr.d}
                fill="none"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth={2.5}
                opacity={op * 0.6}
              />
            </g>
          );
        })}
      </svg>

      {/* Labels — apparaissent a l'allumage, restent */}
      {countries.map((c) => {
        if (!c.label || !labelPos[c.iso]) return null;
        const rel = frame - c.at;
        const op = interpolate(rel, [10, 22], [0, 1], {
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
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                textShadow: "0 2px 14px rgba(0,0,0,0.95)",
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

export default SequentialFlagReveal;
