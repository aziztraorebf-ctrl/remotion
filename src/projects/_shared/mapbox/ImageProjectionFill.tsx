// ImageProjectionFill.tsx — Template N3.3 : image bichromie clippee dans un polygone
// Projeter une photo satellite / image stylisee bichromie dans la silhouette d'un pays.
// Technique : image chargee en canvas, bichromisee (navy/gold), puis fill-pattern.
// Plus riche qu'un drapeau pour montrer un lieu precis (mine, ville, usine, foret).

import React, { useEffect, useRef } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  applyGeoAfriqueV5,
  MapboxBrandingHide,
  MAPBOX_STYLES,
} from "./MapboxBase";
import { pushCanvas } from "./flagCanvas";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD   = "#c8a951";
const IVORY  = "#f2ebd9";
const NAVY   = "#16213a";

// Convertit une image en bichromie navy/gold (ou deux couleurs custom)
// Luminosite haute → goldColor, basse → navyColor
function bichromize(
  img: HTMLImageElement,
  size = 512,
  navyColor = "#16213a",
  goldColor = "#c8a951",
  contrast = 1.2,
): HTMLCanvasElement {
  const c = document.createElement("canvas"); c.width = size; c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  const [nr, ng, nb] = hexToRgb(navyColor);
  const [gr, gg, gb] = hexToRgb(goldColor);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
    // Luminosite perceptuelle (ITU-R BT.709)
    let lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    // Contraste
    lum = Math.max(0, Math.min(1, (lum - 0.5) * contrast + 0.5));

    data[i]     = Math.round(nr + (gr - nr) * lum);
    data[i + 1] = Math.round(ng + (gg - ng) * lum);
    data[i + 2] = Math.round(nb + (gb - nb) * lum);
    // Alpha inchange
  }

  ctx.putImageData(imgData, 0, 0);
  return c;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export interface ImageProjectionEntry {
  iso: string;
  geoName?: string | string[];
  // ISO additionnels a fusionner dans la silhouette (ex: ["ESH"] pour le Sahara occidental)
  boundaryIsos?: string[];
  // Chemin vers l'image (staticFile-compatible ou URL absolue)
  imageSrc: string;
  // Couleurs bichromie (defaut : navy + gold)
  navyColor?: string;
  goldColor?: string;
  // Contraste (1.0 = neutre, >1.0 = plus contraste)
  contrast?: number;
  at?: number;
  fadeFrames?: number;
  opacity?: number;
  borderColor?: string;
}

export interface ImageProjectionFillProps {
  countries: ImageProjectionEntry[];
  secondary?: Array<{ iso: string; color: string }>;
  center?: [number, number];
  baseZoom?: number;
  basePitch?: number;
  bearingStart?: number;
  bearingEnd?: number;
  imageSize?: number;
  children?: React.ReactNode;
}

export const ImageProjectionFill: React.FC<ImageProjectionFillProps> = ({
  countries,
  secondary = [],
  center = [20, 5],
  baseZoom = 4.0,
  basePitch = 0,
  bearingStart = -3,
  bearingEnd = 3,
  imageSize = 512,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const setupRef     = useRef(false);
  const loadedRef    = useRef<Set<string>>(new Set());
  // Canvas bichromises pre-charges (cle = iso) — prets AVANT l'init carte
  const bichroRef    = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const imagesReadyRef = useRef(false);
  const pushedRef    = useRef<Set<string>>(new Set());

  // ── Precharge + bichromise toutes les images AVANT le render (delayRender) ──
  useEffect(() => {
    const handle = delayRender("ImageProjectionFill: chargement images");
    let cancelled = false;
    const loadAll = async () => {
      await Promise.all(countries.map((entry) => new Promise<void>((resolve) => {
        const iso = entry.iso.toUpperCase();
        const img = new Image();
        // PAS de crossOrigin pour les fichiers staticFile locaux (sinon canvas tainted en headless)
        img.onload = () => {
          try {
            const bichro = bichromize(img, imageSize, entry.navyColor ?? NAVY, entry.goldColor ?? GOLD, entry.contrast ?? 1.2);
            bichroRef.current.set(iso, bichro);
            loadedRef.current.add(iso);
          } catch (_e) {}
          resolve();
        };
        img.onerror = () => resolve();
        img.src = entry.imageSrc;
      })));
      if (!cancelled) { imagesReadyRef.current = true; continueRender(handle); }
    };
    loadAll();
    return () => { cancelled = true; try { continueRender(handle); } catch (_e) {} };
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center, zoom: baseZoom, pitch: basePitch, bearing: bearingStart,
      interactive: false, attributionControl: false, fadeDuration: 0,
    });

    map.on("style.load", () => {
      try {
        (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
        applyGeoAfriqueV5(map);

        if (!map.getSource("cb")) {
          map.addSource("cb", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
        }

        // Fond neutre
        const allIsos = countries.map(c => c.iso.toUpperCase());
        if (!map.getLayer("img-neutral")) {
          map.addLayer({
            id: "img-neutral", type: "fill",
            source: "cb", "source-layer": "country_boundaries",
            filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", allIsos]]],
            paint: { "fill-color": IVORY, "fill-opacity": 0.04 },
          });
        }

        // Pays secondaires
        for (const sec of secondary) {
          const secIso = sec.iso.toUpperCase();
          if (!map.getLayer(`img-sec-${secIso}`)) {
            map.addLayer({
              id: `img-sec-${secIso}`, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter: ["==", ["get", "iso_3166_1_alpha_3"], secIso],
              paint: { "fill-color": sec.color, "fill-opacity": 0 },
            });
          }
        }

        // Charger et bichromiser chaque image, puis injecter
        for (const entry of countries) {
          const iso = entry.iso.toUpperCase();
          const imgId = `img-proj-${iso}`;

          // Image bichromisee deja prete (pre-chargee via delayRender) → push direct.
          // Sinon placeholder navy (le push reel se fera via l'engine frame quand pret).
          const ready = bichroRef.current.get(iso);
          if (ready) {
            pushCanvas(map, imgId, ready);
            pushedRef.current.add(iso);
          } else {
            const placeholder = document.createElement("canvas");
            placeholder.width = imageSize; placeholder.height = imageSize;
            const pc = placeholder.getContext("2d")!;
            pc.fillStyle = NAVY; pc.fillRect(0, 0, imageSize, imageSize);
            pushCanvas(map, imgId, placeholder);
          }

          // Filtre par ISO (fiable) — iso principal + boundaryIsos fusionnes
          const focusIsos = [iso, ...(entry.boundaryIsos ?? []).map(s => s.toUpperCase())];
          const filter: mapboxgl.Expression = ["in", ["get", "iso_3166_1_alpha_3"], ["literal", focusIsos]];

          if (!map.getLayer(`img-fill-${iso}`)) {
            map.addLayer({
              id: `img-fill-${iso}`, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: { "fill-pattern": imgId, "fill-opacity": 0 },
            });
          }
          if (!map.getLayer(`img-border-${iso}`)) {
            map.addLayer({
              id: `img-border-${iso}`, type: "line",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: { "line-color": entry.borderColor ?? GOLD, "line-width": 2.0, "line-opacity": 0 },
            });
          }
        }

        setupRef.current = true;
      } catch (_e) {}
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; setupRef.current = false; };
  }, []);

  // Engine frame
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const bearing = interpolate(frame, [0, durationInFrames], [bearingStart, bearingEnd], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    map.jumpTo({ center, zoom: baseZoom, pitch: basePitch, bearing });

    if (!setupRef.current) return;

    const safe = (id: string, prop: string, val: unknown) => {
      try { if (map.getLayer(id)) (map.setPaintProperty as (a: string, b: string, c: unknown) => void)(id, prop, val); } catch (_e) {}
    };

    // S'assurer que les images bichromisees sont bien poussees une fois (race init/load)
    for (const entry of countries) {
      const iso = entry.iso.toUpperCase();
      const ready = bichroRef.current.get(iso);
      if (ready && !pushedRef.current.has(iso)) {
        try { pushCanvas(map, `img-proj-${iso}`, ready); pushedRef.current.add(iso); } catch (_e) {}
      }
    }

    for (const sec of secondary) {
      safe(`img-sec-${sec.iso.toUpperCase()}`, "fill-opacity", Math.min(1, frame / 30) * 0.50);
    }

    for (const entry of countries) {
      const iso = entry.iso.toUpperCase();
      const at  = entry.at ?? 0;
      const fd  = entry.fadeFrames ?? 40;
      const maxOp = entry.opacity ?? 0.80;

      if (frame < at) continue;
      const t = Math.min(1, (frame - at) / fd);
      const eased = 1 - Math.pow(1 - t, 3);

      // N'afficher qu'une fois l'image chargee
      const loaded = loadedRef.current.has(iso);
      safe(`img-fill-${iso}`, "fill-opacity", loaded ? eased * maxOp : 0);
      safe(`img-border-${iso}`, "line-opacity", eased * 0.9);
    }
  });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, backgroundColor: NAVY }} />
      <MapboxBrandingHide />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to bottom,rgba(22,33,58,0.30) 0%,rgba(22,33,58,0.0) 40%,rgba(22,33,58,0.25) 100%)",
      }} />
      {children}
    </AbsoluteFill>
  );
};

// Preview : usage avec une image locale (chemin staticFile)
// Remplacer imageSrc par le chemin reel vers une image Gemini bichromisee
export const ImageProjectionFillPreview: React.FC = () => (
  <ImageProjectionFill
    center={[-5, 31]} baseZoom={5.2}
    countries={[
      {
        iso: "MAR",
        geoName: ["Morocco", "W. Sahara"],
        imageSrc: staticFile("_shared/refs/textures/khouribga-mine-satellite.png"),
        goldColor: "#c8a951",
        navyColor: "#16213a",
        contrast: 1.3,
        at: 0,
      },
    ]}
    secondary={[
      { iso: "ESP", color: "#c60b1e" },
      { iso: "DZA", color: "#006233" },
    ]}
  />
);
