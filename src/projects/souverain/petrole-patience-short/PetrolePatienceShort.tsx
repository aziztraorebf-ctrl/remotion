import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import lottie from "lottie-web";
import { feature } from "topojson-client";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "../../_shared/mapbox/MapboxBase";
import {
  useClipFlags,
  ClipFlagsLayer,
  type ClipFlag,
} from "../../_shared/mapbox/useClipFlags";
import { GeoCountryPlaque } from "../../_shared/mapbox/GeoCountryPlaque";

// ─────────────────────────────────────────────────────────────────────────────
// PetrolePatienceShort — 1080×1920 vertical, 80s, 6 actes
// Drapeaux animés multi-pays (Norvège, Sénégal, Nigeria)
// Musique : kora Sénégal (réutilisée), narration GéoAfrique V2
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const F = {
  A1_START: 0,
  A2_START: 411,   //  13.70s
  A3_START: 906,   //  30.20s
  A4_START: 1314,  //  43.80s
  A5_START: 1683,  //  56.10s
  A6_START: 2169,  //  72.30s
  END:      2404,  //  80.16s
};

export const PETROLE_PATIENCE_SHORT_FRAMES = F.END;

// ─────────────────────────────────────────────────────────────────────────────
// DRAPEAUX — vrais drapeaux officiels projetes via useClipFlags (doctrine N1).
// Remplace les drawXFlag canvas (anti-pattern : etoiles deformees, bave hors polygone).
// `at` = frame d'allumage, calee sur les seuils d'opacite de la version showcase.
// Une fois allume, le drapeau reste (la camera quitte le pays par whip pan).
// ─────────────────────────────────────────────────────────────────────────────
const FLAGS: ClipFlag[] = [
  { iso: "NGA", geoNames: ["Nigeria"], flagFile: "ng.png", at: F.A2_START,        bgColor: "#008753", fadeFrames: 22 },
  { iso: "AGO", geoNames: ["Angola"],  flagFile: "ao.png", at: F.A2_START + 322,  bgColor: "#cc092f", fadeFrames: 22 },
  // mainlandBox : Norvege continentale uniquement (exclut Svalbard/Jan Mayen/Bouvet -> bbox geante)
  { iso: "NOR", geoNames: ["Norway"],  flagFile: "no.png", at: F.A3_START + 70,   bgColor: "#ba0c2f", fadeFrames: 24, mainlandBox: [4, 57, 32, 72] },
  { iso: "SEN", geoNames: ["Senegal"], flagFile: "sn.png", at: F.A4_START + 110,  bgColor: "#00853f", fadeFrames: 24 },
];

const LOC = {
  africa:     [12.0, 8.0]    as [number, number],
  nigeria:    [8.0, 9.0]     as [number, number],
  angola:     [17.87, -11.20] as [number, number],
  norway:     [10.75, 62.0]  as [number, number],
  senegal:    [-14.5, 14.4]  as [number, number],
  sangomar:   [-17.10, 13.65] as [number, number],
  westAfrica: [-7.0, 12.0]   as [number, number],
};

const C = {
  navy:    "#0d1520",
  gold:    "#c8a951",
  goldHi:  "#e8c472",
  ivory:   "#f2ebd9",
  amber:   "#d4831f",
  rust:    "#8c2f1d",
  slate:   "rgba(242,235,217,0.65)",
};

function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

// ═══════════════════════════════════════════════════════════════════════════════
// CAMÉRA — adaptée au 9:16 (zooms plus serrés)
// ═══════════════════════════════════════════════════════════════════════════════

type Cam = { lon: number; lat: number; zoom: number; pitch: number; bearing: number };

function whipBlur(f: number, start: number, dur = 50): number {
  if (f < start || f >= start + dur) return 0;
  const t = (f - start) / dur;
  return t < 0.5
    ? interpolate(t, [0, 0.5], [0, 14])
    : interpolate(t, [0.5, 1], [14, 0]);
}

function getCam(frame: number): Cam & { blur: number } {
  // A1 (0-411) — Drift serré sur le golfe de Guinée (Nigeria + Angola visibles)
  //   Cadre stable et lisible, drift doux + léger pitch. Les pays se remplissent de pétrole.
  if (frame < F.A2_START) {
    const t = clamp01(frame / F.A2_START);
    const e = easeInOut(t);
    return {
      // Centre golfe de Guinée, glisse doucement vers le sud (Nigeria -> Angola)
      lon:     interpolate(e, [0, 1], [11.0, 13.0]),
      lat:     interpolate(e, [0, 1], [2.5, -1.5]),
      zoom:    interpolate(e, [0, 1], [3.55, 3.75]),
      pitch:   interpolate(t, [0, 0.4], [10, 26], { extrapolateRight: "clamp" }),
      bearing: interpolate(e, [0, 1], [-4, 4]),
      blur:    0,
    };
  }
  // A2 (411-906) — Whip Pan Nigeria → Angola
  if (frame < F.A3_START) {
    const dur = F.A3_START - F.A2_START;
    const whipStart = F.A2_START + Math.round(dur * 0.45);
    const whipEnd   = F.A2_START + Math.round(dur * 0.65);
    const blur = whipBlur(frame, whipStart, whipEnd - whipStart);

    if (frame < whipStart) {
      const t = clamp01((frame - F.A2_START) / (whipStart - F.A2_START));
      const e = easeInOut(t);
      return {
        lon: LOC.nigeria[0], lat: LOC.nigeria[1],
        zoom: interpolate(e, [0, 1], [5.0, 5.5]),
        pitch: 25, bearing: interpolate(e, [0, 1], [8, 0]),
        blur: 0,
      };
    }
    if (frame < whipEnd) {
      const t = clamp01((frame - whipStart) / (whipEnd - whipStart));
      const e = easeInOut(t);
      return {
        lon: interpolate(e, [0, 1], [LOC.nigeria[0], LOC.angola[0]]),
        lat: interpolate(e, [0, 1], [LOC.nigeria[1], LOC.angola[1]]),
        zoom: interpolate(e, [0, 0.5, 1], [5.5, 3.2, 5.3]),
        pitch: 20, bearing: interpolate(e, [0, 1], [0, 40]),
        blur,
      };
    }
    const t = clamp01((frame - whipEnd) / (F.A3_START - whipEnd));
    const e = easeInOut(t);
    return {
      lon: LOC.angola[0], lat: LOC.angola[1],
      zoom: interpolate(e, [0, 1], [5.3, 5.8]),
      pitch: interpolate(e, [0, 1], [20, 30]),
      bearing: 40, blur: 0,
    };
  }
  // A3 (906-1314) — Transition rapide vers Norvège (resserrée : caméra posée avant drapeau+plaque)
  if (frame < F.A4_START) {
    const dur = F.A4_START - F.A3_START;
    const transitEnd = F.A3_START + Math.round(dur * 0.16);

    if (frame < transitEnd) {
      const t = clamp01((frame - F.A3_START) / (transitEnd - F.A3_START));
      const e = easeInOut(t);
      const blur = whipBlur(frame, F.A3_START, transitEnd - F.A3_START);
      return {
        lon: interpolate(e, [0, 1], [LOC.angola[0], LOC.norway[0]]),
        lat: interpolate(e, [0, 1], [LOC.angola[1], LOC.norway[1]]),
        zoom: interpolate(e, [0, 0.5, 1], [5.3, 2.5, 4.5]),
        pitch: interpolate(e, [0, 1], [30, 20]),
        bearing: interpolate(e, [0, 1], [40, 0]),
        blur,
      };
    }
    const t = clamp01((frame - transitEnd) / (F.A4_START - transitEnd));
    return {
      lon: LOC.norway[0] + Math.sin(t * Math.PI * 0.4) * 0.5,
      lat: LOC.norway[1] + t * 0.4,
      zoom: interpolate(t, [0, 1], [4.5, 4.8]),
      pitch: 25, bearing: t * 5,
      blur: 0,
    };
  }
  // A4 (1314-1683) — Pull back vers Sénégal + Orbit Sangomar
  if (frame < F.A5_START) {
    const dur = F.A5_START - F.A4_START;
    const transitEnd = F.A4_START + Math.round(dur * 0.35);

    if (frame < transitEnd) {
      const t = clamp01((frame - F.A4_START) / (transitEnd - F.A4_START));
      const e = easeInOut(t);
      const blur = whipBlur(frame, F.A4_START, transitEnd - F.A4_START);
      return {
        lon: interpolate(e, [0, 1], [LOC.norway[0], LOC.sangomar[0]]),
        lat: interpolate(e, [0, 1], [LOC.norway[1], LOC.sangomar[1]]),
        zoom: interpolate(e, [0, 0.5, 1], [4.8, 2.8, 5.5]),
        pitch: 25, bearing: 0,
        blur,
      };
    }
    const t = clamp01((frame - transitEnd) / (F.A5_START - transitEnd));
    const e = easeInOut(t);
    return {
      lon: LOC.sangomar[0], lat: LOC.sangomar[1],
      zoom: interpolate(e, [0, 1], [5.5, 5.9]),
      pitch: interpolate(e, [0, 1], [25, 45]),
      bearing: interpolate(e, [0, 1], [0, -40]),
      blur: 0,
    };
  }
  // A5 (1683-2169) — Sénégal + voisins, counter-rotation
  if (frame < F.A6_START) {
    const t = clamp01((frame - F.A5_START) / (F.A6_START - F.A5_START));
    const e = easeInOut(t);
    return {
      lon: LOC.senegal[0] - 0.5,
      lat: LOC.senegal[1] - 0.5,
      zoom: interpolate(e, [0, 1], [5.5, 5.0]),
      pitch: interpolate(e, [0, 1], [45, 25]),
      bearing: interpolate(e, [0, 1], [-40, 15]),
      blur: 0,
    };
  }
  // A6 (2169-2404) — Drift + Pull Back final
  const dur = F.END - F.A6_START;
  const pullStart = F.A6_START + Math.round(dur * 0.55);

  if (frame < pullStart) {
    const t = clamp01((frame - F.A6_START) / (pullStart - F.A6_START));
    return {
      lon: LOC.senegal[0] + Math.sin(t * Math.PI * 0.5) * 0.15,
      lat: LOC.senegal[1] + t * 0.1,
      zoom: interpolate(t, [0, 1], [5.0, 4.5]),
      pitch: 25, bearing: t * 8, blur: 0,
    };
  }
  const t = clamp01((frame - pullStart) / (F.END - pullStart));
  const e = easeInOut(t);
  return {
    lon: interpolate(e, [0, 1], [LOC.senegal[0], LOC.africa[0]]),
    lat: interpolate(e, [0, 1], [LOC.senegal[1] + 0.1, LOC.africa[1]]),
    zoom: interpolate(e, [0, 1], [4.5, 3.0]),
    pitch: interpolate(e, [0, 1], [25, 0]),
    bearing: interpolate(e, [0, 1], [8, 0]),
    blur: 0,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS OVERLAY
// ═══════════════════════════════════════════════════════════════════════════════

function ensureSource(map: mapboxgl.Map) {
  if (!map.getSource("cb-source")) {
    map.addSource("cb-source", {
      type: "vector", url: "mapbox://mapbox.country-boundaries-v1",
    });
  }
}

function pushCanvas(map: mapboxgl.Map, id: string, canvas: HTMLCanvasElement) {
  if (!canvas || canvas.width === 0) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  try {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data as unknown as Uint8Array;
    if (!map.hasImage(id)) {
      map.addImage(id, { width: canvas.width, height: canvas.height, data });
    } else {
      map.updateImage(id, { width: canvas.width, height: canvas.height, data });
    }
  } catch {}
}

function ensureCountryFill(
  map: mapboxgl.Map, layerId: string, iso: string,
  fillKind: { color?: string; pattern?: string }
) {
  if (!map.getLayer(layerId)) {
    const paint: Record<string, unknown> = { "fill-opacity": 0 };
    if (fillKind.color)   paint["fill-color"]   = fillKind.color;
    if (fillKind.pattern) paint["fill-pattern"] = fillKind.pattern;
    map.addLayer({
      id: layerId, type: "fill", source: "cb-source",
      "source-layer": "country_boundaries",
      filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
      paint,
    });
  }
}

// (drapeaux drawXFlag canvas supprimes — remplaces par useClipFlags + vrais drapeaux officiels)

// ═══════════════════════════════════════════════════════════════════════════════
// FIBER OPTIC — frontières laser dorées qui se dessinent (technique FiberOpticBorderDraw)
//   Reprojette les contours NGA/AGO chaque frame -> path SVG + longueur,
//   anime stroke-dasharray pour "tracer" la frontière, puis glow.
// ═══════════════════════════════════════════════════════════════════════════════
const FIBER_TOPO = "_shared/geo-data/countries-50m.json";

interface FiberSpec { geoName: string; at: number; drawDur: number; }

function useBorderPaths(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  specs: FiberSpec[],
  frame: number,
  active: boolean,
): Record<string, { d: string; len: number }[]> {
  const ringsRef = useRef<Record<string, number[][][]>>({});
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("fiber geo"));
  const [out, setOut] = useState<Record<string, { d: string; len: number }[]>>({});

  useEffect(() => {
    let cancelled = false;
    fetch(staticFile(FIBER_TOPO))
      .then(r => r.json())
      .then((topo: any) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries) as unknown as { features: any[] };
        for (const s of specs) {
          const f = fc.features.find((x: any) => x.properties?.name === s.geoName);
          const rs: number[][][] = [];
          if (f) {
            const g = f.geometry;
            if (g.type === "Polygon") rs.push(...(g.coordinates as number[][][]));
            else if (g.type === "MultiPolygon") for (const poly of g.coordinates) rs.push(...(poly as number[][][]));
          }
          ringsRef.current[s.geoName] = rs;
        }
        setReady(true);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
    return () => { cancelled = true; try { continueRender(handle); } catch (_e) {} };
  }, [handle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !active) return;
    const res: Record<string, { d: string; len: number }[]> = {};
    for (const s of specs) {
      const rings = ringsRef.current[s.geoName];
      if (!rings || !rings.length) continue;
      const parts: { d: string; len: number }[] = [];
      for (const ring of rings) {
        let seg = ""; let len = 0; let prev: { x: number; y: number } | null = null;
        ring.forEach((coord, i) => {
          const p = map.project(coord as [number, number]);
          seg += `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          if (prev) len += Math.hypot(p.x - prev.x, p.y - prev.y);
          prev = p;
        });
        parts.push({ d: seg, len });
      }
      res[s.geoName] = parts;
    }
    setOut(res);
  });

  return out;
}

const FiberBordersLayer: React.FC<{
  width: number; height: number; frame: number;
  specs: FiberSpec[]; paths: Record<string, { d: string; len: number }[]>;
  color: string;
}> = ({ width, height, frame, specs, paths, color }) => {
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <filter id="fiber-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {specs.map(s => {
        const segs = paths[s.geoName];
        if (!segs || frame < s.at) return null;
        const t = Math.min(1, (frame - s.at) / s.drawDur);
        const drawn = 1 - Math.pow(1 - t, 3); // easeOutCubic
        return (
          <g key={s.geoName} filter="url(#fiber-glow)">
            {segs.map((seg, i) => (
              <path key={i} d={seg.d} fill="none" stroke={color} strokeWidth={2.5}
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={seg.len}
                strokeDashoffset={seg.len * (1 - drawn)}
                opacity={0.9} />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

// SFX ponctuel via Sequence (doctrine : jamais frame===X)
const Sfx: React.FC<{ at: number; file: string; vol?: number; dur?: number }> = ({ at, file, vol = 0.55, dur = 60 }) => (
  <Sequence from={at} durationInFrames={dur}>
    <Audio src={staticFile(`_shared/sfx/${file}`)} volume={vol} />
  </Sequence>
);

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export const PetrolePatienceShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const canvasesRef = useRef<Record<string, HTMLCanvasElement>>({});

  // Lottie smoke
  const [smokeJson, setSmokeJson] = useState<object | null>(null);
  const smokeAnimRef = useRef<{
    goToAndStop: (f: number, b: boolean) => void;
    destroy?: () => void;
    totalFrames?: number;
  } | null>(null);
  const smokeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const smokeContainerRef = useRef<HTMLDivElement | null>(null);
  const [, forceRender] = useState(0);

  // Drapeaux officiels projetes (clip SVG reprojete chaque frame)
  const { paths: flagPaths } = useClipFlags(mapRef, FLAGS, frame);

  // Positions ecran (projetees) pour les plaques geo-ancrees (Norvege, Senegal)
  const [geoPos, setGeoPos] = useState<{ nor?: { x: number; y: number }; sen?: { x: number; y: number } }>({});

  // Frontieres laser A1 (NGA puis AGO se dessinent au moment de l'allumage gold)
  const fiberSpecs: FiberSpec[] = [
    { geoName: "Nigeria", at: 8,   drawDur: 45 },
    { geoName: "Angola",  at: 138, drawDur: 45 },
  ];
  const fiberPaths = useBorderPaths(mapRef, fiberSpecs, frame, frame < F.A2_START);

  function getCanvas(key: string, w = 256, h = 256): HTMLCanvasElement {
    if (!canvasesRef.current[key]) {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      canvasesRef.current[key] = c;
    }
    return canvasesRef.current[key];
  }

  // ── Load smoke JSON EARLY ──────────────────────────────────────────────
  useEffect(() => {
    if (smokeJson) return;
    fetch(staticFile("_shared/lottie/smoke.json"))
      .then(r => r.json())
      .then(j => setSmokeJson(j))
      .catch(() => {});
  }, []);

  // ── Init map ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: LOC.africa, zoom: 3.0, pitch: 0, bearing: 0,
      interactive: false, preserveDrawingBuffer: true, antialias: true,
    });

    map.on("style.load", () => {
      try {
        (map as mapboxgl.Map & { setProjection?: (p: string) => void })
          .setProjection?.("mercator");
      } catch {}
      applyGeoAfriqueV5(map);
      setReady(true);
    });

    mapRef.current = map;
    return () => {
      smokeAnimRef.current?.destroy?.();
      if (smokeContainerRef.current) {
        try { document.body.removeChild(smokeContainerRef.current); } catch {}
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Init smoke quand JSON dispo ────────────────────────────────────────
  useEffect(() => {
    if (!smokeJson || smokeAnimRef.current) return;

    const container = document.createElement("div");
    container.style.cssText = "position:absolute;width:256px;height:256px;opacity:0;left:-9999px;top:-9999px;";
    document.body.appendChild(container);
    smokeContainerRef.current = container;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anim = lottie.loadAnimation({
        container, animationData: smokeJson,
        renderer: "canvas", loop: true, autoplay: false,
        rendererSettings: { clearCanvas: true, progressiveLoad: false },
      } as any);
      smokeAnimRef.current = anim as unknown as typeof smokeAnimRef.current;

      anim.addEventListener("DOMLoaded", () => {
        const created = container.querySelector("canvas") as HTMLCanvasElement | null;
        if (created) {
          smokeCanvasRef.current = created;
          forceRender(n => n + 1);
        }
      });
    } catch {}
  }, [smokeJson]);

  // ── Engine principal ───────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const map = mapRef.current;
    const cam = getCam(frame);

    map.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing,
    });

    ensureSource(map);
    const phase = (frame / fps) * 1.8;

    // ─── A1 : pays pétroliers GORGÉS de richesse (gold + glow + pulse) ─
    //   Remplace l'extrusion 3D showcase. Pattern PulsingRegionFill (N3.4) :
    //   fill gold + line glow (blur) + respiration sin. Lisible à l'échelle continent.
    //   Raconte "$1500B extraits de ces pays" sans texture illisible.
    if (frame < F.A2_START) {
      const producers = [
        { iso: "NGA", at: 0,   phase: 0 },
        { iso: "AGO", at: 130, phase: Math.PI },
      ];
      producers.forEach(({ iso, at, phase }) => {
        const fillId = `a1-rich-${iso}`;
        const glowId = `a1-richglow-${iso}`;
        const bId    = `a1-richb-${iso}`;
        if (!map.getLayer(glowId)) {
          map.addLayer({
            id: glowId, type: "line", source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
            paint: { "line-color": C.goldHi, "line-width": 12, "line-blur": 7, "line-opacity": 0 },
          });
        }
        if (!map.getLayer(fillId)) {
          map.addLayer({
            id: fillId, type: "fill", source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
            paint: { "fill-color": C.gold, "fill-opacity": 0 },
          });
        }
        if (!map.getLayer(bId)) {
          map.addLayer({
            id: bId, type: "line", source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
            paint: { "line-color": C.goldHi, "line-width": 2.0, "line-opacity": 0 },
          });
        }
        const lt = Math.max(0, frame - at);
        const intro = easeOutCubic(Math.min(1, lt / 35));
        // respiration sin une fois le pays allumé
        const pulse = 0.5 + 0.5 * Math.sin((lt / 70) * Math.PI * 2 + phase);
        const fillOp = intro * (0.42 + 0.20 * pulse);   // 0.42 -> 0.62
        const glowOp = intro * (0.30 + 0.35 * pulse);
        try {
          map.setPaintProperty(fillId, "fill-opacity", fillOp);
          map.setPaintProperty(glowId, "line-opacity", glowOp);
          map.setPaintProperty(bId, "line-opacity", intro * 0.9);
        } catch {}
      });
    }

    // ─── A2 : nettoyage du remplissage richesse A1 (les drapeaux NGA/AGO arrivent via useClipFlags) ─
    if (frame >= F.A2_START && frame < F.A2_START + 16) {
      const fadeT = (frame - F.A2_START) / 16;
      const k = Math.max(0, 1 - fadeT);
      ["a1-rich-NGA", "a1-rich-AGO"].forEach(id => {
        if (map.getLayer(id)) { try { map.setPaintProperty(id, "fill-opacity", 0.6 * k); } catch {} }
      });
      ["a1-richglow-NGA", "a1-richglow-AGO", "a1-richb-NGA", "a1-richb-AGO"].forEach(id => {
        if (map.getLayer(id)) { try { map.setPaintProperty(id, "line-opacity", k); } catch {} }
      });
    }

    // ─── A3-A4-A6 : drapeaux NOR / SEN geres par useClipFlags (rien a faire ici) ─

    // ─── A5 : Smoke premium sur SEN (le drapeau SEN reste affiche par useClipFlags) ─
    if (frame >= F.A5_START && frame < F.A6_START) {
      const t = (frame - F.A5_START) / (F.A6_START - F.A5_START);
      if (smokeCanvasRef.current && smokeAnimRef.current) {
        const total = (smokeAnimRef.current.totalFrames ?? 106) | 0;
        const sceneF = frame - F.A5_START;
        try { smokeAnimRef.current.goToAndStop(sceneF % total, true); } catch {}
        pushCanvas(map, "img-sen-smoke", smokeCanvasRef.current);
        ensureCountryFill(map, "a5-sen-smoke", "SEN", { pattern: "img-sen-smoke" });
        const op = Math.min(0.55, t * 2.5);
        try { map.setPaintProperty("a5-sen-smoke", "fill-opacity", op); } catch {}
      }
    }

    // ─── Projeter les ancres geo des plaques (Norvege en A3, Senegal en A5) ─
    try {
      if (frame >= F.A3_START && frame < F.A4_START) {
        const p = map.project([8.5, 61.0]);
        setGeoPos({ nor: { x: p.x, y: p.y } });
      } else if (frame >= F.A5_START && frame < F.A6_START) {
        const p = map.project([-14.5, 14.6]);
        setGeoPos({ sen: { x: p.x, y: p.y } });
      }
    } catch {}
  });

  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <Audio src={staticFile("_demos/petrole-patience/audio/narration-short-v1.mp3")} />
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-B-kora-percussion.mp3")}
        volume={(f) => {
          // Fade in 2s, body, fade out 2s
          if (f < 60) return interpolate(f, [0, 60], [0, 0.18]);
          if (f > F.END - 60) return interpolate(f, [F.END - 60, F.END], [0.18, 0]);
          return 0.18;
        }}
      />

      {/* ─── SFX (via Sequence, jamais frame===X — plancher 0.50) ───
           Convention : whoosh = changement de pays (switch), zoom-in = vrai zoom,
           pullback = dezoom, plate-pop = allumage drapeau, impact = reveal chiffre.
           (reveal.mp3 BANNI : 18.4s avec voix — cf SFX-INDEX) */}
      <Sfx at={8}             file="camera/sfx-map-ping.mp3"   vol={0.5} />
      <Sfx at={138}           file="camera/sfx-map-ping.mp3"   vol={0.5} />
      <Sfx at={150}           file="impact/impact.mp3"        vol={0.6} />
      <Sfx at={F.A2_START}    file="ui/plate-pop.mp3"         vol={0.55} />{/* allumage drapeau NGA */}
      <Sfx at={F.A2_START + 222} file="camera/sfx-whip-pan-1.mp3" vol={0.6} />{/* switch NGA -> AGO */}{/* whip-pan-1 = seul valide (2/3 etaient des lasers/ping) */}
      <Sfx at={F.A2_START + 322} file="ui/plate-pop.mp3"      vol={0.55} />{/* allumage drapeau AGO */}
      <Sfx at={F.A3_START}    file="camera/sfx-whip-pan-1.mp3" vol={0.6} />{/* switch -> Norvege */}
      <Sfx at={F.A3_START + 70} file="ui/plate-pop.mp3"       vol={0.5} />{/* allumage drapeau NOR */}
      <Sfx at={F.A3_START + 55} file="impact/impact.mp3"      vol={0.5} />{/* plaque $1700B */}
      <Sfx at={F.A4_START}    file="camera/sfx-whip-pan-1.mp3" vol={0.6} />{/* switch -> Senegal */}
      <Sfx at={F.A4_START + 130} file="camera/sfx-swoosh-zoomin.mp3" vol={0.5} />{/* vrai zoom sur Sangomar */}
      <Sfx at={F.A4_START + 110} file="ui/plate-pop.mp3"      vol={0.55} />{/* allumage drapeau SEN */}
      <Sfx at={F.A5_START}    file="impact/impact.mp3"        vol={0.5} />{/* plaque 18/82 */}
      <Sfx at={F.A6_START + 130} file="camera/sfx-swoosh-pullback.mp3" vol={0.6} />{/* dezoom final */}

      <MapboxBrandingHide />

      <AbsoluteFill>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>

      {/* Frontières laser dorées en A1 (NGA/AGO se dessinent) */}
      {frame < F.A2_START && (
        <FiberBordersLayer width={width} height={height} frame={frame}
          specs={fiberSpecs} paths={fiberPaths} color={C.goldHi} />
      )}

      {/* Drapeaux officiels clippes dans les silhouettes (au-dessus de la carte, sous le texte) */}
      <ClipFlagsLayer width={width} height={height} flags={FLAGS} paths={flagPaths} frame={frame} />

      <ShortOverlays frame={frame} fps={fps} geoPos={geoPos} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// OVERLAYS TEXTE 9:16 — piles verticales adaptées Short
// ═══════════════════════════════════════════════════════════════════════════════

const ShortOverlays: React.FC<{
  frame: number;
  fps: number;
  geoPos: { nor?: { x: number; y: number }; sen?: { x: number; y: number } };
}> = ({ frame, fps, geoPos }) => {
  // A1 — Hook (titre retiré ; "Extraction depuis 2000" + $1500B en jaune dans l'océan)
  if (frame < F.A2_START) {
    const p2 = spring({ frame: frame - 150, fps, config: { damping: 18 }, durationInFrames: 30 });
    return (
      <>
        {frame > 150 && (
          <div style={{
            position: "absolute", bottom: 360, left: 0, right: 0,
            textAlign: "center", opacity: p2,
            transform: `translateY(${(1 - p2) * 30}px)`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 24,
              color: C.goldHi, letterSpacing: 5, textTransform: "uppercase", marginBottom: 16,
              textShadow: "0 2px 10px rgba(0,0,0,0.6)",
            }}>Extraction depuis 2000</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 250, fontWeight: 700,
              color: C.goldHi, lineHeight: 1,
              textShadow: "0 4px 24px rgba(0,0,0,0.55)",
            }}>$1500<span style={{ fontSize: 145 }}>B</span></div>
          </div>
        )}
      </>
    );
  }

  // A2 — Nigeria & Angola
  if (frame < F.A3_START) {
    const tLocal = (frame - F.A2_START) / (F.A3_START - F.A2_START);
    const pNga = spring({ frame: frame - F.A2_START, fps, config: { damping: 18 }, durationInFrames: 30 });
    const pAgo = spring({ frame: frame - F.A2_START - 320, fps, config: { damping: 18 }, durationInFrames: 30 });

    return (
      <>
        {/* Nigeria avant whip */}
        {tLocal < 0.55 && (
          <div style={{
            position: "absolute", top: 120, left: 60, right: 60,
            textAlign: "center",
            opacity: pNga, transform: `translateY(${(1 - pNga) * 20}px)`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 22,
              color: C.gold, letterSpacing: 5, textTransform: "uppercase",
            }}>Producteur n°1</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 110, fontWeight: 700,
              color: C.ivory, marginTop: 8,
            }}>Nigeria</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 70,
              color: C.goldHi, marginTop: 18,
            }}>2 Mb/jour</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 28, fontStyle: "italic",
              color: C.slate, marginTop: 20,
            }}>Revenu stagné 20 ans</div>
          </div>
        )}
        {/* Angola après whip */}
        {tLocal > 0.70 && (
          <div style={{
            position: "absolute", top: 120, left: 60, right: 60,
            textAlign: "center",
            opacity: pAgo, transform: `translateY(${(1 - pAgo) * 20}px)`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 22,
              color: C.gold, letterSpacing: 5, textTransform: "uppercase",
            }}>Producteur n°2</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 110, fontWeight: 700,
              color: C.ivory, marginTop: 8,
            }}>Angola</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 110,
              color: C.goldHi, marginTop: 18,
            }}>75%</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 26, fontStyle: "italic",
              color: C.slate, marginTop: 20, maxWidth: 800, marginInline: "auto",
            }}>des recettes publiques dépendent du baril</div>
          </div>
        )}
      </>
    );
  }

  // A3 — Norvège : plaque géo-ancrée épurée (contre-exemple, le "bon choix")
  //   Apparaît tôt (comble le trou visuel), géo-ancrée au-dessus de la Norvège.
  if (frame < F.A4_START) {
    return (
      <GeoCountryPlaque
        frame={frame}
        name="NORVÈGE"
        color={C.goldHi}
        stat="$1700B"
        source="FONDS SOUVERAIN"
        appearAt={F.A3_START + 55}
        hideAt={F.A4_START}
        fadeFrames={16}
        pos={geoPos.nor ?? null}
      />
    );
  }

  // A4 — Sénégal Sangomar
  if (frame < F.A5_START) {
    const p = spring({ frame: frame - F.A4_START, fps, config: { damping: 18 }, durationInFrames: 30 });
    return (
      <div style={{
        position: "absolute", top: 120, left: 60, right: 60,
        textAlign: "center",
        opacity: p, transform: `translateY(${(1 - p) * 20}px)`,
      }}>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 22,
          color: C.gold, letterSpacing: 5, textTransform: "uppercase",
        }}>Sénégal · Découverte 2014</div>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 130, fontWeight: 700,
          color: C.ivory, marginTop: 14,
        }}>Sangomar</div>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 32, fontStyle: "italic",
          color: C.slate, marginTop: 18,
        }}>Production · juin 2024</div>
      </div>
    );
  }

  // A5 — Comparaison 18% vs 82% : plaque comparative géo-ancrée + ligne vers le Sénégal
  if (frame < F.A6_START) {
    return <SenegalSharePlaque frame={frame} fps={fps} pos={geoPos.sen ?? null} />;
  }

  // A6 — Question finale (bloc bas "SOUVERAIN / Dans dix ans" retiré : conflit futurs sous-titres)
  const p = spring({ frame: frame - F.A6_START, fps, config: { damping: 18 }, durationInFrames: 30 });
  return (
    <div style={{
      position: "absolute", top: 200, left: 60, right: 60,
      textAlign: "center",
      opacity: p, transform: `translateY(${(1 - p) * 20}px)`,
    }}>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 22,
        color: C.gold, letterSpacing: 5, textTransform: "uppercase",
      }}>La question</div>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 56, fontWeight: 600,
        color: C.ivory, marginTop: 24, lineHeight: 1.3,
      }}>Échapper à la<br/>malédiction ?</div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// A5 — Plaque comparative PETROSEN 18% vs EXPORT 82%, géo-ancrée + ligne vers le pays
// ═══════════════════════════════════════════════════════════════════════════════
const SenegalSharePlaque: React.FC<{
  frame: number; fps: number; pos: { x: number; y: number } | null;
}> = ({ frame, fps, pos }) => {
  if (!pos) return null;
  const local = frame - F.A5_START;
  const pIn  = spring({ frame: local, fps, config: { damping: 18 }, durationInFrames: 26 });
  const pE   = spring({ frame: local - 70, fps, config: { damping: 18 }, durationInFrames: 26 });

  // Plaque ancrée au-dessus du pays
  const cardW = 560;
  const cardCx = pos.x;
  const cardBottom = pos.y - 110;    // remontée pour dégager le drapeau du Sénégal
  const cardTop = cardBottom - 230;

  return (
    <>
      {/* Ligne de connexion plaque -> pays */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <line
          x1={cardCx} y1={cardBottom} x2={pos.x} y2={pos.y}
          stroke={C.gold} strokeWidth={2} opacity={pIn * 0.8} strokeDasharray="2 5"
        />
        <circle cx={pos.x} cy={pos.y} r={5} fill={C.goldHi} opacity={pIn} />
      </svg>

      {/* Carte comparative */}
      <div style={{
        position: "absolute",
        left: cardCx - cardW / 2,
        top: cardTop,
        width: cardW,
        opacity: pIn,
        transform: `translateY(${(1 - pIn) * 16}px)`,
        background: "rgba(0,0,0,0.74)",
        border: `2px solid ${C.gold}`,
        borderRadius: 14,
        boxShadow: `0 0 28px ${C.gold}45`,
        padding: "22px 26px",
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 22,
          color: C.ivory, letterSpacing: 4, textAlign: "center", marginBottom: 18,
        }}>SANGOMAR · PARTAGE</div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Petrosen 18% */}
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 96, fontWeight: 800,
              color: C.goldHi, lineHeight: 0.9, textShadow: `0 0 14px ${C.gold}70`,
            }}>18%</div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 18,
              color: C.gold, letterSpacing: 2, marginTop: 6,
            }}>PETROSEN</div>
          </div>

          <div style={{
            fontFamily: "Georgia, serif", fontSize: 34, color: C.slate,
            padding: "0 10px", opacity: pE,
          }}>vs</div>

          {/* Export 82% */}
          <div style={{ textAlign: "center", flex: 1, opacity: pE }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 96, fontWeight: 800,
              color: C.rust, lineHeight: 0.9,
            }}>82%</div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 18,
              color: C.gold, letterSpacing: 2, marginTop: 6,
            }}>EXPORT</div>
          </div>
        </div>
      </div>
    </>
  );
};
