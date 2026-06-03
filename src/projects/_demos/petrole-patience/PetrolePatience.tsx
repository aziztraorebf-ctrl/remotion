import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import lottie from "lottie-web";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "../../_shared/mapbox/MapboxBase";

// ─────────────────────────────────────────────────────────────────────────────
// PetrolePatience — Démo Mid-form 2min16s
// 7 actes, audio-driven (whisper-mesured), 1 Map continue, GéoAfrique V5
//
// Audio : public/_demos/petrole-patience/audio/narration-v1.mp3 (136.64s)
// Voix  : Narratrice GéoAfrique V2 (ElevenLabs z3gESu49naEZW8Af2Upm)
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// ── Audio-anchored frames (whisper segments) ──────────────────────────────────
export const F = {
  A1_START: 0,
  A2_START: 408,   //  13.60s — "Le Nigeria pompe"
  A3_START: 1116,  //  37.20s — "La Guinée équatoriale"
  A4_START: 1819,  //  60.64s — "À sept mille km au nord"
  A5_START: 2372,  //  79.08s — "Le Sénégal, lui"
  A6_START: 3220,  // 107.36s — "Dix-huit pour cent"
  A7_START: 3673,  // 122.44s — "Suffira-t-il"
  END:      4099,  // 136.64s
};

export const PETROLE_PATIENCE_FRAMES = F.END;

// ── Localisations (toutes MCP-vérifiées) ──────────────────────────────────────
const LOC = {
  africa:      [20.0, 5.0]    as [number, number],
  nigeria:     [8.0, 9.0]     as [number, number],
  lagos:       [3.39, 6.45]   as [number, number],
  angola:      [17.87, -11.20] as [number, number],
  luanda:      [13.23, -8.84] as [number, number],
  guineaEq:    [10.27, 1.65]  as [number, number],
  malabo:      [8.78, 3.75]   as [number, number],
  norway:      [10.75, 60.0]  as [number, number],
  oslo:        [10.75, 59.91] as [number, number],
  senegal:     [-14.5, 14.4]  as [number, number],
  sangomar:    [-17.10, 13.65] as [number, number],
  westAfrica:  [-3.0, 10.0]   as [number, number],
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
// CAMÉRA — calcul par frame absolue
// ═══════════════════════════════════════════════════════════════════════════════

type Cam = { lon: number; lat: number; zoom: number; pitch: number; bearing: number };

function whipBlur(f: number, start: number, dur = 60): number {
  if (f < start || f >= start + dur) return 0;
  const t = (f - start) / dur;
  return t < 0.5
    ? interpolate(t, [0, 0.5], [0, 14])
    : interpolate(t, [0.5, 1], [14, 0]);
}

function getCam(frame: number): Cam & { blur: number } {
  // A1 (0-408) — Pull Back inversé : Afrique entière → zoom in Nigeria
  if (frame < F.A2_START) {
    const t = clamp01(frame / F.A2_START);
    const e = easeInOut(t);
    return {
      lon:     interpolate(e, [0, 1], [LOC.africa[0], LOC.nigeria[0]]),
      lat:     interpolate(e, [0, 1], [LOC.africa[1], LOC.nigeria[1]]),
      zoom:    interpolate(e, [0, 1], [2.5, 4.8]),
      pitch:   interpolate(e, [0, 0.5], [0, 25], { extrapolateRight: "clamp" }),
      bearing: interpolate(e, [0, 1], [0, 10]),
      blur:    0,
    };
  }
  // A2 (408-1116) — Multi-stop Whip Pan Nigeria → Angola
  if (frame < F.A3_START) {
    const dur = F.A3_START - F.A2_START; // 708f
    const whipStart = F.A2_START + Math.round(dur * 0.45);
    const whipEnd   = F.A2_START + Math.round(dur * 0.65);
    const blur = whipBlur(frame, whipStart, whipEnd - whipStart);

    if (frame < whipStart) {
      const t = clamp01((frame - F.A2_START) / (whipStart - F.A2_START));
      const e = easeInOut(t);
      return {
        lon:     LOC.nigeria[0],
        lat:     LOC.nigeria[1],
        zoom:    interpolate(e, [0, 1], [4.8, 5.4]),
        pitch:   25,
        bearing: interpolate(e, [0, 1], [10, 0]),
        blur:    0,
      };
    }
    if (frame < whipEnd) {
      const t = clamp01((frame - whipStart) / (whipEnd - whipStart));
      const e = easeInOut(t);
      return {
        lon:     interpolate(e, [0, 1], [LOC.nigeria[0], LOC.angola[0]]),
        lat:     interpolate(e, [0, 1], [LOC.nigeria[1], LOC.angola[1]]),
        zoom:    interpolate(e, [0, 0.5, 1], [5.4, 3.0, 5.2]),
        pitch:   20,
        bearing: interpolate(e, [0, 1], [0, 45]),
        blur,
      };
    }
    const t = clamp01((frame - whipEnd) / (F.A3_START - whipEnd));
    const e = easeInOut(t);
    return {
      lon:     LOC.angola[0],
      lat:     LOC.angola[1],
      zoom:    interpolate(e, [0, 1], [5.2, 5.8]),
      pitch:   interpolate(e, [0, 1], [20, 35]),
      bearing: 45,
      blur:    0,
    };
  }
  // A3 (1116-1819) — Guinée Eq : Zoom Sol 3D (satellite-streets switch)
  if (frame < F.A4_START) {
    const dur = F.A4_START - F.A3_START; // 703f
    const landEnd = F.A3_START + Math.round(dur * 0.55);

    if (frame < landEnd) {
      const t = clamp01((frame - F.A3_START) / (landEnd - F.A3_START));
      const e = easeInOut(t);
      return {
        lon:     LOC.malabo[0],
        lat:     LOC.malabo[1],
        zoom:    interpolate(e, [0, 1], [4.5, 11.5]),
        pitch:   interpolate(e, [0, 1], [10, 55]),
        bearing: interpolate(e, [0, 1], [0, 25]),
        blur:    0,
      };
    }
    const t = clamp01((frame - landEnd) / (F.A4_START - landEnd));
    return {
      lon:     LOC.malabo[0] + t * 0.012,
      lat:     LOC.malabo[1],
      zoom:    11.5,
      pitch:   55,
      bearing: 25 + t * 8,
      blur:    0,
    };
  }
  // A4 (1819-2372) — Norvège : Pull back + Drift (switch retour dark)
  if (frame < F.A5_START) {
    const dur = F.A5_START - F.A4_START; // 553f
    const pullEnd = F.A4_START + Math.round(dur * 0.40);

    if (frame < pullEnd) {
      const t = clamp01((frame - F.A4_START) / (pullEnd - F.A4_START));
      const e = easeInOut(t);
      const blur = whipBlur(frame, F.A4_START, pullEnd - F.A4_START);
      return {
        lon:     interpolate(e, [0, 1], [LOC.malabo[0], LOC.norway[0]]),
        lat:     interpolate(e, [0, 1], [LOC.malabo[1], LOC.norway[1]]),
        zoom:    interpolate(e, [0, 0.5, 1], [11.5, 2.5, 5.2]),
        pitch:   interpolate(e, [0, 1], [55, 25]),
        bearing: interpolate(e, [0, 1], [25, 0]),
        blur,
      };
    }
    const t = clamp01((frame - pullEnd) / (F.A5_START - pullEnd));
    return {
      lon:     LOC.norway[0] + Math.sin(t * Math.PI * 0.3) * 0.4,
      lat:     LOC.norway[1] + t * 0.3,
      zoom:    interpolate(t, [0, 1], [5.2, 5.5]),
      pitch:   25,
      bearing: t * 6,
      blur:    0,
    };
  }
  // A5 (2372-3220) — Sénégal Sangomar : Orbit + Dolly In
  if (frame < F.A6_START) {
    const dur = F.A6_START - F.A5_START; // 848f
    const transitEnd = F.A5_START + Math.round(dur * 0.20);

    if (frame < transitEnd) {
      // Transit Norvège → Sangomar (blur)
      const t = clamp01((frame - F.A5_START) / (transitEnd - F.A5_START));
      const e = easeInOut(t);
      const blur = whipBlur(frame, F.A5_START, transitEnd - F.A5_START);
      return {
        lon:     interpolate(e, [0, 1], [LOC.norway[0], LOC.sangomar[0]]),
        lat:     interpolate(e, [0, 1], [LOC.norway[1], LOC.sangomar[1]]),
        zoom:    interpolate(e, [0, 0.5, 1], [5.5, 2.8, 5.5]),
        pitch:   25,
        bearing: 0,
        blur,
      };
    }
    const t = clamp01((frame - transitEnd) / (F.A6_START - transitEnd));
    const e = easeInOut(t);
    return {
      lon:     LOC.sangomar[0],
      lat:     LOC.sangomar[1],
      zoom:    interpolate(e, [0, 1], [5.5, 5.8]),
      pitch:   interpolate(e, [0, 1], [25, 45]),
      bearing: interpolate(e, [0, 1], [0, -50]),
      blur:    0,
    };
  }
  // A6 (3220-3673) — Sénégal + voisins : Counter-Rotation
  if (frame < F.A7_START) {
    const t = clamp01((frame - F.A6_START) / (F.A7_START - F.A6_START));
    const e = easeInOut(t);
    return {
      lon:     LOC.senegal[0] - 1,
      lat:     LOC.senegal[1] - 1,
      zoom:    interpolate(e, [0, 1], [5.5, 4.8]),
      pitch:   interpolate(e, [0, 1], [45, 25]),
      bearing: interpolate(e, [0, 1], [-50, 20]),
      blur:    0,
    };
  }
  // A7 (3673-4099) — Drift Dakar + Pull Back final
  const dur = F.END - F.A7_START; // 426f
  const pullStart = F.A7_START + Math.round(dur * 0.55);

  if (frame < pullStart) {
    const t = clamp01((frame - F.A7_START) / (pullStart - F.A7_START));
    return {
      lon:     LOC.senegal[0] + Math.sin(t * Math.PI * 0.5) * 0.15,
      lat:     LOC.senegal[1] + t * 0.1,
      zoom:    interpolate(t, [0, 1], [5.0, 4.5]),
      pitch:   25,
      bearing: t * 8,
      blur:    0,
    };
  }
  const t = clamp01((frame - pullStart) / (F.END - pullStart));
  const e = easeInOut(t);
  return {
    lon:     interpolate(e, [0, 1], [LOC.senegal[0], LOC.africa[0]]),
    lat:     interpolate(e, [0, 1], [LOC.senegal[1] + 0.1, LOC.africa[1]]),
    zoom:    interpolate(e, [0, 1], [4.5, 2.8]),
    pitch:   interpolate(e, [0, 1], [25, 0]),
    bearing: interpolate(e, [0, 1], [8, 0]),
    blur:    0,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE par acte — quel style Mapbox actif
// ═══════════════════════════════════════════════════════════════════════════════

type SceneStyle = "dark" | "satellite" | "streets";

function getStyle(frame: number): SceneStyle {
  // A3 (Guinée Eq) : style streets (zoom sol 3D)
  // Transition à 30% de l'acte pour laisser le temps de l'arrivée
  if (frame >= F.A3_START && frame < F.A4_START) {
    const t = (frame - F.A3_START) / (F.A4_START - F.A3_START);
    return t > 0.25 ? "streets" : "dark";
  }
  // A4 (Norvège) : retour dark + GéoAfrique V5
  return "dark";
}

function styleUrl(s: SceneStyle): string {
  if (s === "streets")   return "mapbox://styles/mapbox/satellite-streets-v12";
  if (s === "satellite") return MAPBOX_STYLES.satellite;
  return MAPBOX_STYLES.dark;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERLAY HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function ensureSource(map: mapboxgl.Map) {
  if (!map.getSource("cb-source")) {
    map.addSource("cb-source", {
      type: "vector",
      url: "mapbox://mapbox.country-boundaries-v1",
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

function ensureCountryBorder(map: mapboxgl.Map, layerId: string, iso: string, color: string, width = 3) {
  if (!map.getLayer(layerId)) {
    map.addLayer({
      id: layerId, type: "line", source: "cb-source",
      "source-layer": "country_boundaries",
      filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
      paint: { "line-color": color, "line-width": width, "line-opacity": 0 },
    });
  }
}

// Canvas drawers
function drawWatermark(canvas: HTMLCanvasElement, opacity: number, text: string) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = `rgba(200,169,81,${opacity * 0.25})`;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = `rgba(255,235,150,${opacity * 0.7})`;
  ctx.font = `bold ${h * 0.22}px Georgia, serif`;
  ctx.textBaseline = "middle";
  const cellW = w / 2; const cellH = h / 2;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      ctx.save();
      ctx.translate(col * cellW + cellW / 2, row * cellH + cellH / 2);
      ctx.rotate(-Math.PI / 10);
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }
  }
}

function drawNorwayFlag(canvas: HTMLCanvasElement) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d")!;
  // Drapeau Norvège : rouge avec croix bleue bordée blanc
  ctx.fillStyle = "#BA0C2F"; ctx.fillRect(0, 0, w, h);
  // Croix blanche
  const t = h * 0.22;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(w * 0.30 - t / 2, 0, t, h);   // vertical
  ctx.fillRect(0, h / 2 - t / 2, w, t);      // horizontal
  // Croix bleue (plus fine)
  const tb = h * 0.10;
  ctx.fillStyle = "#00205B";
  ctx.fillRect(w * 0.30 - tb / 2, 0, tb, h);
  ctx.fillRect(0, h / 2 - tb / 2, w, tb);
}

function drawRadialPulse(canvas: HTMLCanvasElement, pulse: number, color: string) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  const cx = w * 0.5; const cy = h * 0.5;
  const maxR = w * (0.25 + pulse * 0.5);
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
  grad.addColorStop(0,   `${color}E0`);
  grad.addColorStop(0.5, `${color}90`);
  grad.addColorStop(1,   `${color}00`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export const PetrolePatience: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const currentStyleRef = useRef<SceneStyle>("dark");
  const styleLoadingRef = useRef(false);
  const canvasesRef = useRef<Record<string, HTMLCanvasElement>>({});

  // Lottie smoke (chargé async)
  const [smokeJson, setSmokeJson] = useState<object | null>(null);
  const smokeAnimRef = useRef<{
    goToAndStop: (f: number, b: boolean) => void;
    destroy?: () => void;
    totalFrames?: number;
  } | null>(null);
  const smokeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const smokeContainerRef = useRef<HTMLDivElement | null>(null);
  const [, forceRender] = useState(0);

  function getCanvas(key: string, w = 256, h = 256): HTMLCanvasElement {
    if (!canvasesRef.current[key]) {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      canvasesRef.current[key] = c;
    }
    return canvasesRef.current[key];
  }

  // ── Load smoke JSON ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (smokeJson) return;
    fetch(staticFile("_shared/lottie/smoke.json"))
      .then(r => r.json())
      .then(j => setSmokeJson(j))
      .catch(() => {});
  }, []);

  // ── Init map ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container:             containerRef.current,
      style:                 MAPBOX_STYLES.dark,
      center:                LOC.africa,
      zoom:                  2.5,
      pitch:                 0,
      bearing:               0,
      interactive:           false,
      preserveDrawingBuffer: true,
      antialias:             true,
    });

    map.on("style.load", () => {
      try {
        (map as mapboxgl.Map & { setProjection?: (p: string) => void })
          .setProjection?.("mercator");
      } catch {}
      // GéoAfrique V5 uniquement sur dark
      if (currentStyleRef.current === "dark") applyGeoAfriqueV5(map);
      setReady(true);
    });

    mapRef.current = map;
    return () => {
      smokeAnimRef.current?.destroy?.();
      smokeAnimRef.current = null;
      if (smokeContainerRef.current) {
        try { document.body.removeChild(smokeContainerRef.current); } catch {}
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Init smoke quand JSON dispo ─────────────────────────────────────────────
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

  // ── Engine principal — par frame ────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const map = mapRef.current;
    const cam = getCam(frame);
    const targetStyle = getStyle(frame);

    // Style switch
    if (targetStyle !== currentStyleRef.current && !styleLoadingRef.current) {
      currentStyleRef.current = targetStyle;
      styleLoadingRef.current = true;
      map.setStyle(styleUrl(targetStyle));
      map.once("style.load", () => {
        try {
          (map as mapboxgl.Map & { setProjection?: (p: string) => void })
            .setProjection?.("mercator");
        } catch {}
        if (targetStyle === "dark") applyGeoAfriqueV5(map);
        styleLoadingRef.current = false;
      });
    }

    map.jumpTo({
      center:  [cam.lon, cam.lat],
      zoom:    cam.zoom,
      pitch:   cam.pitch,
      bearing: cam.bearing,
    });

    // Overlays par acte
    if (currentStyleRef.current === "dark") {
      ensureSource(map);
    }

    // ─── A1 Hook : fill-extrusion 3D des 3 pays pétroliers ───────────────
    if (frame < F.A2_START && currentStyleRef.current === "dark") {
      const t = frame / F.A2_START;
      ensureSource(map);
      const oilProducers = [
        { iso: "NGA", height: 200000, color: C.gold },
        { iso: "AGO", height: 160000, color: C.amber },
        { iso: "GNQ", height: 140000, color: C.rust },
      ];
      oilProducers.forEach(({ iso, height, color }) => {
        const id = `a1-ext-${iso}`;
        if (!map.getLayer(id)) {
          map.addLayer({
            id, type: "fill-extrusion", source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
            paint: {
              "fill-extrusion-color":  color,
              "fill-extrusion-height": 0,
              "fill-extrusion-opacity": 0.75,
            },
          });
        }
        try {
          const h = easeOutCubic(Math.min(1, t * 1.5)) * height;
          map.setPaintProperty(id, "fill-extrusion-height", h);
        } catch {}
      });
    }

    // ─── A2 Paradoxe : watermark "$1500B" sur NGA et AGO ─────────────────
    if (frame >= F.A2_START && frame < F.A3_START && currentStyleRef.current === "dark") {
      const t = (frame - F.A2_START) / (F.A3_START - F.A2_START);
      const wmCanvas = getCanvas("wm-1500", 300, 200);
      drawWatermark(wmCanvas, Math.min(1, t * 2), "$1500B");
      pushCanvas(map, "img-wm-1500", wmCanvas);
      ["NGA", "AGO"].forEach(iso => {
        const id = `a2-wm-${iso}`;
        ensureCountryFill(map, id, iso, { pattern: "img-wm-1500" });
        try { map.setPaintProperty(id, "fill-opacity", Math.min(0.9, t * 2)); } catch {}
      });
    }

    // ─── A3 Malédiction : highlight border GNQ en streets ─────────────────
    if (frame >= F.A3_START && frame < F.A4_START && currentStyleRef.current === "streets") {
      ensureSource(map);
      ensureCountryBorder(map, "a3-gnq-border", "GNQ", C.goldHi, 4);
      try { map.setPaintProperty("a3-gnq-border", "line-opacity", 0.9); } catch {}
    }

    // ─── A4 Contraste : fill-pattern drapeau Norvège ──────────────────────
    if (frame >= F.A4_START && frame < F.A5_START && currentStyleRef.current === "dark") {
      const t = (frame - F.A4_START) / (F.A5_START - F.A4_START);
      if (t > 0.40) { // Après le pull-back
        const flagCanvas = getCanvas("nor-flag", 150, 100);
        drawNorwayFlag(flagCanvas);
        pushCanvas(map, "img-nor-flag", flagCanvas);
        ensureCountryFill(map, "a4-nor-flag", "NOR", { pattern: "img-nor-flag" });
        const flagOpacity = Math.min(0.85, (t - 0.40) * 3);
        try { map.setPaintProperty("a4-nor-flag", "fill-opacity", flagOpacity); } catch {}
      }
    }

    // ─── A5 Sénégal : smoke Lottie premium sur SEN ────────────────────────
    if (frame >= F.A5_START && frame < F.A6_START && currentStyleRef.current === "dark") {
      const t = (frame - F.A5_START) / (F.A6_START - F.A5_START);
      if (t > 0.20) { // Après le transit
        if (smokeCanvasRef.current && smokeAnimRef.current) {
          const total = (smokeAnimRef.current.totalFrames ?? 106) | 0;
          const sceneF = frame - F.A5_START;
          try { smokeAnimRef.current.goToAndStop(sceneF % total, true); } catch {}
          pushCanvas(map, "img-sen-smoke", smokeCanvasRef.current);
          ensureCountryFill(map, "a5-sen-smoke", "SEN", { pattern: "img-sen-smoke" });
          const opacity = Math.min(0.7, (t - 0.20) * 2);
          try { map.setPaintProperty("a5-sen-smoke", "fill-opacity", opacity); } catch {}
        }
      }
    }

    // ─── A6 Risque : gradients multi-pays distincts ───────────────────────
    if (frame >= F.A6_START && frame < F.A7_START && currentStyleRef.current === "dark") {
      const t = (frame - F.A6_START) / (F.A7_START - F.A6_START);
      const phase = (frame / fps) * 1.0;

      const players = [
        { iso: "SEN", color: C.gold,  size: 0.6 + (Math.sin(phase) + 1) / 4 },
        { iso: "MRT", color: C.amber, size: 0.4 + (Math.sin(phase + 1) + 1) / 5 },
        { iso: "MLI", color: C.rust,  size: 0.4 + (Math.sin(phase + 2) + 1) / 5 },
        { iso: "GIN", color: C.amber, size: 0.4 + (Math.sin(phase + 3) + 1) / 5 },
        { iso: "GMB", color: C.gold,  size: 0.4 + (Math.sin(phase + 0.5) + 1) / 5 },
      ];

      players.forEach(({ iso, color, size }) => {
        const cnv = getCanvas(`a6-${iso}`, 128, 128);
        drawRadialPulse(cnv, size, color);
        pushCanvas(map, `img-a6-${iso}`, cnv);
        ensureCountryFill(map, `a6-fill-${iso}`, iso, { pattern: `img-a6-${iso}` });
        try { map.setPaintProperty(`a6-fill-${iso}`, "fill-opacity", Math.min(0.8, t * 2.5)); } catch {}
      });
    }

    // ─── A7 Question : pulse final sur Sénégal puis fade ──────────────────
    if (frame >= F.A7_START && currentStyleRef.current === "dark") {
      const t = (frame - F.A7_START) / (F.END - F.A7_START);
      const phase = (frame / fps) * 1.5;
      const cnv = getCanvas("a7-sen", 200, 200);
      drawRadialPulse(cnv, (Math.sin(phase) + 1) / 2, C.gold);
      pushCanvas(map, "img-a7-sen", cnv);
      ensureCountryFill(map, "a7-sen-fill", "SEN", { pattern: "img-a7-sen" });
      const op = t < 0.6 ? 0.9 : interpolate(t, [0.6, 1], [0.9, 0.3]);
      try { map.setPaintProperty("a7-sen-fill", "fill-opacity", op); } catch {}
    }
  });

  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <Audio src={staticFile("_demos/petrole-patience/audio/narration-v1.mp3")} />
      <MapboxBrandingHide />

      <AbsoluteFill style={{
        filter: getCam(frame).blur > 0 ? `blur(${getCam(frame).blur}px)` : undefined,
      }}>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>

      <ActOverlays frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// OVERLAYS TEXTE PAR ACTE
// ═══════════════════════════════════════════════════════════════════════════════

const ActOverlays: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // A1 — Hook : titre + stat 1500B + question
  if (frame < F.A2_START) {
    const t = frame / F.A2_START;
    const p1 = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 30 });
    const p2 = spring({ frame: frame - 90, fps, config: { damping: 18 }, durationInFrames: 30 });
    const p3 = spring({ frame: frame - 250, fps, config: { damping: 18 }, durationInFrames: 30 });
    return (
      <>
        {/* Titre épisode top */}
        <div style={{
          position: "absolute", top: 60, left: 80,
          opacity: p1, transform: `translateY(${(1 - p1) * 20}px)`,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 18,
            color: C.gold, letterSpacing: 3, textTransform: "uppercase",
          }}>SOUVERAIN</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 56, fontWeight: 700,
            color: C.ivory, letterSpacing: 1, marginTop: 6,
          }}>Le pétrole de la patience</div>
        </div>
        {/* Big stat */}
        {frame > 90 && (
          <div style={{
            position: "absolute", bottom: 200, right: 80,
            textAlign: "right",
            opacity: p2, transform: `translateY(${(1 - p2) * 30}px)`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 12,
              color: C.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8,
            }}>Extraction pétrolière Afrique · depuis 2000</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 140, fontWeight: 700,
              color: C.goldHi, lineHeight: 1,
            }}>$1500<span style={{ fontSize: 80 }}>B</span></div>
          </div>
        )}
      </>
    );
  }
  // A2 — Paradoxe : labels Nigeria / Angola
  if (frame < F.A3_START) {
    const tLocal = (frame - F.A2_START) / (F.A3_START - F.A2_START);
    const nigeriaP = spring({ frame: frame - F.A2_START, fps, config: { damping: 18 }, durationInFrames: 30 });
    const angolaP  = spring({ frame: frame - F.A2_START - 280, fps, config: { damping: 18 }, durationInFrames: 30 });
    return (
      <>
        {/* Label Nigeria (gauche) avant whip */}
        {tLocal < 0.55 && (
          <div style={{
            position: "absolute", top: 100, left: 80,
            opacity: nigeriaP, transform: `translateX(${(1 - nigeriaP) * -20}px)`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 14,
              color: C.gold, letterSpacing: 4, textTransform: "uppercase",
            }}>Producteur n°1 Afrique</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 64, fontWeight: 700,
              color: C.ivory, marginTop: 4,
            }}>Nigeria</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 38,
              color: C.goldHi, marginTop: 10,
            }}>2 Mb/jour</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 16, fontStyle: "italic",
              color: C.slate, marginTop: 14, maxWidth: 380,
            }}>Revenu par habitant stagné 20 ans</div>
          </div>
        )}
        {/* Label Angola après whip */}
        {tLocal > 0.65 && (
          <div style={{
            position: "absolute", top: 100, right: 80, textAlign: "right",
            opacity: angolaP, transform: `translateX(${(1 - angolaP) * 20}px)`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 14,
              color: C.gold, letterSpacing: 4, textTransform: "uppercase",
            }}>Producteur n°2</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 64, fontWeight: 700,
              color: C.ivory, marginTop: 4,
            }}>Angola</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 38,
              color: C.goldHi, marginTop: 10,
            }}>75%</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 16, fontStyle: "italic",
              color: C.slate, marginTop: 14, maxWidth: 380,
            }}>des recettes publiques dépendent du baril</div>
          </div>
        )}
      </>
    );
  }
  // A3 — Malédiction : citation économistes
  if (frame < F.A4_START) {
    const p = spring({ frame: frame - F.A3_START, fps, config: { damping: 20 }, durationInFrames: 40 });
    const tLocal = (frame - F.A3_START) / (F.A4_START - F.A3_START);
    return (
      <>
        <div style={{
          position: "absolute", bottom: 120, left: 80,
          opacity: p, transform: `translateY(${(1 - p) * 20}px)`,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 14,
            color: C.gold, letterSpacing: 4, textTransform: "uppercase",
          }}>Guinée Équatoriale</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 600,
            color: C.ivory, marginTop: 8, maxWidth: 760, lineHeight: 1.3,
          }}>« La malédiction des ressources »</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 16,
            color: C.slate, marginTop: 12, fontStyle: "italic", maxWidth: 760,
          }}>Revenu par tête comparable au Portugal — 2/3 de la population sous le seuil de pauvreté</div>
        </div>
        {/* Stats droite */}
        {tLocal > 0.4 && (
          <div style={{
            position: "absolute", top: 80, right: 80, textAlign: "right",
            opacity: clamp01((tLocal - 0.4) * 3),
          }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 12,
              color: C.gold, letterSpacing: 3, textTransform: "uppercase",
            }}>Sous le seuil de pauvreté</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 110, fontWeight: 700,
              color: C.goldHi, lineHeight: 1,
            }}>66%</div>
          </div>
        )}
      </>
    );
  }
  // A4 — Norvège : BigStat fonds 1700B
  if (frame < F.A5_START) {
    const p = spring({ frame: frame - F.A4_START - 60, fps, config: { damping: 18 }, durationInFrames: 30 });
    return (
      <>
        <div style={{
          position: "absolute", top: 80, left: 80,
          opacity: p, transform: `translateY(${(1 - p) * 20}px)`,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 14,
            color: C.gold, letterSpacing: 4, textTransform: "uppercase",
          }}>Norvège · 1969</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 54, fontWeight: 700,
            color: C.ivory, marginTop: 6, maxWidth: 700, lineHeight: 1.2,
          }}>Un autre choix</div>
        </div>
        <div style={{
          position: "absolute", bottom: 120, right: 80, textAlign: "right",
          opacity: p, transform: `translateY(${(1 - p) * 20}px)`,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 13,
            color: C.gold, letterSpacing: 3, textTransform: "uppercase",
          }}>Fonds souverain norvégien</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 130, fontWeight: 700,
            color: C.goldHi, lineHeight: 1,
          }}>$1700<span style={{ fontSize: 80 }}>B</span></div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 15, fontStyle: "italic",
            color: C.slate, marginTop: 8,
          }}>Trésor collectif · générations futures</div>
        </div>
      </>
    );
  }
  // A5 — Sénégal : production Sangomar
  if (frame < F.A6_START) {
    const tLocal = (frame - F.A5_START) / (F.A6_START - F.A5_START);
    const p1 = spring({ frame: frame - F.A5_START - 60, fps, config: { damping: 18 }, durationInFrames: 30 });
    const p2 = spring({ frame: frame - F.A5_START - 320, fps, config: { damping: 18 }, durationInFrames: 30 });
    const p3 = spring({ frame: frame - F.A5_START - 530, fps, config: { damping: 18 }, durationInFrames: 30 });
    return (
      <>
        <div style={{
          position: "absolute", top: 80, left: 80,
          opacity: p1, transform: `translateY(${(1 - p1) * 20}px)`,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 14,
            color: C.gold, letterSpacing: 4, textTransform: "uppercase",
          }}>Sénégal · découverte 2014</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 54, fontWeight: 700,
            color: C.ivory, marginTop: 6,
          }}>Sangomar</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 18,
            color: C.slate, marginTop: 6, fontStyle: "italic",
          }}>Production commerciale · juin 2024</div>
        </div>
        {/* Stat 1 : 25 TCF */}
        {tLocal > 0.40 && (
          <div style={{
            position: "absolute", bottom: 280, left: 80,
            opacity: p2, transform: `translateY(${(1 - p2) * 20}px)`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 12,
              color: C.gold, letterSpacing: 3, textTransform: "uppercase",
            }}>Réserves prouvées</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 72, fontWeight: 700,
              color: C.goldHi, lineHeight: 1,
            }}>25<span style={{ fontSize: 36, marginLeft: 8 }}>TCF</span></div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 13,
              color: C.slate, marginTop: 4,
            }}>de gaz · trillions de pieds cubes</div>
          </div>
        )}
        {/* Stat 2 : Petrosen 18% */}
        {tLocal > 0.65 && (
          <div style={{
            position: "absolute", bottom: 120, right: 80, textAlign: "right",
            opacity: p3, transform: `translateY(${(1 - p3) * 20}px)`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 12,
              color: C.gold, letterSpacing: 3, textTransform: "uppercase",
            }}>Part nationale · Petrosen</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 130, fontWeight: 700,
              color: C.goldHi, lineHeight: 1,
            }}>18%</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 14,
              color: C.slate, marginTop: 6, fontStyle: "italic",
            }}>Premier projet de cette taille</div>
          </div>
        )}
      </>
    );
  }
  // A6 — Risque : comparaison 18% vs 82%
  if (frame < F.A7_START) {
    const p = spring({ frame: frame - F.A6_START, fps, config: { damping: 18 }, durationInFrames: 30 });
    return (
      <div style={{
        position: "absolute", top: 100, right: 80, textAlign: "right",
        opacity: p, transform: `translateY(${(1 - p) * 20}px)`,
      }}>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 13,
          color: C.gold, letterSpacing: 3, textTransform: "uppercase",
        }}>Part Sénégal vs Export</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "flex-end", gap: 20, marginTop: 14 }}>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 96, fontWeight: 700, color: C.goldHi, lineHeight: 1 }}>18%</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: C.slate, marginTop: 4 }}>Petrosen</div>
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 64, color: C.slate, lineHeight: 1 }}>vs</div>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 96, fontWeight: 700, color: C.rust, lineHeight: 1 }}>82%</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: C.slate, marginTop: 4 }}>Export</div>
          </div>
        </div>
      </div>
    );
  }
  // A7 — Question finale
  const p = spring({ frame: frame - F.A7_START, fps, config: { damping: 18 }, durationInFrames: 30 });
  const tLocal = (frame - F.A7_START) / (F.END - F.A7_START);
  const p2 = spring({ frame: frame - F.A7_START - 230, fps, config: { damping: 18 }, durationInFrames: 30 });
  return (
    <>
      <div style={{
        position: "absolute", top: 100, left: 80,
        opacity: p, transform: `translateY(${(1 - p) * 20}px)`, maxWidth: 900,
      }}>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 14,
          color: C.gold, letterSpacing: 4, textTransform: "uppercase",
        }}>La question</div>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 40, fontWeight: 600,
          color: C.ivory, marginTop: 10, lineHeight: 1.25,
        }}>Suffira-t-il de garder une plus grosse part… pour échapper à la malédiction ?</div>
      </div>
      {tLocal > 0.55 && (
        <div style={{
          position: "absolute", bottom: 100, left: "50%", transform: "translateX(-50%)",
          textAlign: "center", opacity: p2,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 14,
            color: C.gold, letterSpacing: 4, textTransform: "uppercase",
          }}>SOUVERAIN</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 18, fontStyle: "italic",
            color: C.slate, marginTop: 8,
          }}>Dans dix ans, l'expérience sera jugée.</div>
        </div>
      )}
    </>
  );
};
