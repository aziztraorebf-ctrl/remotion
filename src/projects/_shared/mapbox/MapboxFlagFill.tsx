/**
 * MapboxFlagFill — UNE image (drapeau, texture minerai, portrait...) projetee DANS la
 * silhouette exacte d'un pays, par-dessus une VRAIE carte Mapbox vivante.
 *
 * Technique (Chantier C, validee Aziz 2026-06-01) :
 *   - Vraie carte Mapbox dessous : ocean navy, voisins en contexte, DRIFT + altitude pays.
 *   - Overlay SVG par-dessus : on reprojette la geometrie du pays (Natural Earth) via
 *     map.project() A CHAQUE FRAME → le path SVG colle a la carte pendant le drift.
 *   - <clipPath> sur ce path + <image> drapeau HD (flagcdn) dedans = UNE image nette,
 *     PAS carrelee (contrairement a fill-pattern Mapbox).
 *
 * C'est le port "carte vivante" du vieux CountryFlagFill (qui dessinait la silhouette en
 * SVG isole, hors carte, sans contexte ni drift).
 *
 * Aligne SOUVERAIN VISUAL PLAYBOOK :
 *   P2 drift · P2bis altitude pays · P3 remplissage (ocean/voisins) · P4 projection image.
 *
 * Hybride V+H : useVideoConfig().width/height → zoom + tailles overlay adaptes.
 *
 * Usage :
 *   <MapboxFlagFill countryIso="MAR" geoName="Morocco" center={[-7.09,31.79]}
 *     baseZoom={5.0} flagCode="ma" label="MAROC" />
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

// Natural Earth 50m — deja dans public/_shared/geo-data/
const TOPO_PATH = "_shared/geo-data/countries-50m.json";

export interface MapboxFlagFillProps {
  /** ISO 3166-1 alpha-3 (MAR, SEN...) — pour le highlight bordure Mapbox */
  countryIso: string;
  /**
   * ISO additionnels a inclure dans la bordure gold + a exclure des voisins assombris.
   * Ex: ["ESH"] pour le Sahara occidental sous le drapeau Maroc.
   */
  boundaryIsos?: string[];
  /**
   * Nom(s) du pays dans Natural Earth pour la geometrie SVG du clip.
   * String simple ("Senegal") ou tableau pour fusionner plusieurs polygones
   * (ex: ["Morocco", "W. Sahara"] → drapeau remplit aussi le Sahara occidental).
   */
  geoName: string | string[];
  /** Centre [lon, lat] */
  center: [number, number];
  /** Zoom altitude pays. Auto -0.6 en horizontal. */
  baseZoom?: number;
  /** ISO-2 lowercase → drapeau HD flagcdn (w2560). Recommande. */
  flagCode?: string;
  /** Alternative : chemin staticFile d'une image HD (>=1024px) a projeter dans le pays. */
  flagImage?: string;
  /** Label pays */
  label: string;
  /**
   * Traitement bichromie navy/gold sur l'image (0 = vraies couleurs, 1 = full atlas).
   * Defaut 0 : on garde les vraies couleurs nationales (comme les chaines premium).
   */
  bichromie?: number;
  accentColor?: string;
  flagEntryAt?: number;
  durationFrames?: number;
}

export const MapboxFlagFill: React.FC<MapboxFlagFillProps> = ({
  countryIso,
  boundaryIsos = [],
  geoName,
  center,
  baseZoom = 5.0,
  flagCode,
  flagImage,
  label,
  bichromie = 0,
  accentColor = GOLD,
  flagEntryAt = 12,
  durationFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("MapboxFlagFill init"));
  const [ready, setReady] = useState(false);
  // Path SVG du pays reprojete a chaque frame via map.project()
  const [projectedPath, setProjectedPath] = useState<string>("");
  // BBox ecran du path (pour positionner l'image dans le clip)
  const [screenBBox, setScreenBBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  const effZoom = baseZoom + (isVertical ? 0 : -0.6);
  const borderId = `flagborder-${countryIso}`;
  const neighborsId = "neighbors-fill";

  // Geometrie du pays (anneaux lon/lat) — chargee via fetch (staticFile)
  const [countryRings, setCountryRings] = useState<number[][][]>([]);
  const [geoHandle] = useState(() => delayRender("MapboxFlagFill geo"));
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
        let rings: number[][][] = [];
        for (const nm of names) {
          const feat = fc.features.find((f) => f.properties?.name === nm);
          if (!feat) continue;
          const g = feat.geometry;
          if (g.type === "Polygon") rings.push(...(g.coordinates as number[][][]));
          else if (g.type === "MultiPolygon")
            rings.push(
              ...(g.coordinates as number[][][][]).map((poly) => poly[0])
            );
        }
        setCountryRings(rings);
        continueRender(geoHandle);
      })
      .catch(() => {
        if (!cancelled) continueRender(geoHandle);
      });
    return () => {
      cancelled = true;
    };
  }, [geoName, geoHandle]);

  // ── Image drapeau (HD, optionnellement bichromie) → data URL pour <image> SVG ──
  const [flagDataUrl, setFlagDataUrl] = useState<string>("");
  useEffect(() => {
    const src = flagCode
      ? `https://flagcdn.com/w2560/${flagCode}.png`
      : flagImage
        ? staticFile(flagImage)
        : "";
    if (!src) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (bichromie <= 0) {
        setFlagDataUrl(src); // vraies couleurs : on utilise l'URL directe
        return;
      }
      const w = 1024;
      const h = Math.round((img.height / img.width) * 1024);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) {
        setFlagDataUrl(src);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const id = ctx.getImageData(0, 0, w, h);
      const d = id.data;
      const navy = [0x16, 0x21, 0x3a];
      const gold = [0xc8, 0xa9, 0x51];
      for (let i = 0; i < d.length; i += 4) {
        const lum =
          (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
        const mr = navy[0] + (gold[0] - navy[0]) * lum;
        const mg = navy[1] + (gold[1] - navy[1]) * lum;
        const mb = navy[2] + (gold[2] - navy[2]) * lum;
        d[i] = Math.round(mr * bichromie + d[i] * (1 - bichromie));
        d[i + 1] = Math.round(mg * bichromie + d[i + 1] * (1 - bichromie));
        d[i + 2] = Math.round(mb * bichromie + d[i + 2] * (1 - bichromie));
      }
      ctx.putImageData(id, 0, 0);
      setFlagDataUrl(c.toDataURL("image/png"));
    };
    img.onerror = () => setFlagDataUrl("");
    img.src = src;
  }, [flagCode, flagImage, bichromie]);

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
      const focusIsos = [countryIso, ...boundaryIsos];
      // P3 — voisins ivory 10% (carte jamais vide) — exclut tous les ISO focus
      if (!map.getLayer(neighborsId)) {
        map.addLayer({
          id: neighborsId,
          type: "fill",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", focusIsos]]],
          paint: { "fill-color": IVORY, "fill-opacity": 0.06 },
        });
      }
      // Bordure gold du pays focus (le drapeau lui vient de l'overlay SVG)
      if (!map.getLayer(borderId)) {
        map.addLayer({
          id: borderId,
          type: "line",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["in", ["get", "iso_3166_1_alpha_3"], ["literal", focusIsos]],
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

  // ── Drive camera (drift) + reprojeter le path + opacite bordure ─────────────
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    const driftBearing = interpolate(frame, [0, durationFrames], [-4, 4]);
    const driftZoom = effZoom + interpolate(frame, [0, durationFrames], [0, 0.18]);
    map.jumpTo({ center, zoom: driftZoom, bearing: driftBearing, pitch: 0 });

    // Reprojeter chaque anneau du pays vers l'ecran → path SVG colle a la carte
    if (countryRings.length) {
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      const parts: string[] = [];
      for (const ring of countryRings) {
        let dseg = "";
        ring.forEach((coord, i) => {
          const p = map.project(coord as [number, number]);
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
          dseg += `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        });
        dseg += "Z";
        parts.push(dseg);
      }
      setProjectedPath(parts.join(" "));
      setScreenBBox({ x: minX, y: minY, w: maxX - minX, h: maxY - minY });
    }

    const borderOpacity = interpolate(frame - flagEntryAt, [0, 16], [0, 0.95], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    try {
      map.setPaintProperty(borderId, "line-opacity", borderOpacity);
    } catch {}
  }, [
    frame,
    ready,
    center,
    effZoom,
    durationFrames,
    flagEntryAt,
    borderId,
    countryRings,
  ]);

  // ── Opacites overlay ─────────────────────────────────────────────────────────
  const rel = frame - flagEntryAt;
  const flagOpacity = interpolate(rel, [0, 14, 20], [0, 1, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacity = interpolate(rel, [16, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(rel, [16, 34], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globalOpacity = interpolate(
    frame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const clipId = `flagclip-${countryIso}`;
  const labelSize = isVertical ? 84 : 64;

  return (
    <AbsoluteFill style={{ background: "#16213a", opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {/* Overlay SVG : drapeau clippe dans la silhouette reprojetee */}
      {projectedPath && screenBBox && flagDataUrl && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <defs>
            <clipPath id={clipId}>
              <path d={projectedPath} />
            </clipPath>
          </defs>
          <image
            href={flagDataUrl}
            x={screenBBox.x}
            y={screenBBox.y}
            width={screenBBox.w}
            height={screenBBox.h}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
            opacity={flagOpacity}
          />
          {/* Liseré interne subtil pour decoller le drapeau du fond */}
          <path
            d={projectedPath}
            fill="none"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={3}
            opacity={flagOpacity * 0.6}
          />
        </svg>
      )}

      {/* Label pays */}
      <div
        style={{
          position: "absolute",
          bottom: isVertical ? height * 0.12 : height * 0.08,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
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

export default MapboxFlagFill;
