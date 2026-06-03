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
  // A1 (0-411) — Pull Back inversé : Afrique → Nigeria
  if (frame < F.A2_START) {
    const t = clamp01(frame / F.A2_START);
    const e = easeInOut(t);
    return {
      lon:     interpolate(e, [0, 1], [LOC.africa[0], LOC.nigeria[0]]),
      lat:     interpolate(e, [0, 1], [LOC.africa[1], LOC.nigeria[1]]),
      zoom:    interpolate(e, [0, 1], [3.0, 5.0]),
      pitch:   interpolate(e, [0, 0.5], [0, 25], { extrapolateRight: "clamp" }),
      bearing: interpolate(e, [0, 1], [0, 8]),
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
  // A3 (906-1314) — Pull back vers Norvège
  if (frame < F.A4_START) {
    const dur = F.A4_START - F.A3_START;
    const transitEnd = F.A3_START + Math.round(dur * 0.45);

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

// ═══════════════════════════════════════════════════════════════════════════════
// DRAPEAUX ANIMÉS (canvas ondulation par phase)
// ═══════════════════════════════════════════════════════════════════════════════

// Drapeau Sénégal animé (vert / jaune / rouge + étoile verte)
function drawSenegalFlag(canvas: HTMLCanvasElement, phase: number) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  for (let x = 0; x < w; x++) {
    const waveY = Math.sin((x / w) * Math.PI * 3 + phase) * h * 0.07;
    const third = w / 3;
    let color: string;
    if (x < third) color = "#00853F";
    else if (x < third * 2) color = "#FDEF42";
    else color = "#E31B23";
    ctx.fillStyle = color;
    ctx.fillRect(x, waveY, 1, h - Math.abs(waveY) * 2);
  }
  // Étoile verte centrale qui bouge légèrement
  ctx.fillStyle = "#00853F";
  ctx.save();
  ctx.translate(w / 2, h / 2 + Math.sin(phase) * h * 0.03);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const r = h * 0.18;
    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Drapeau Norvège animé (rouge + croix blanche + croix bleue)
function drawNorwayFlag(canvas: HTMLCanvasElement, phase: number) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  // Vague verticale subtile sur le rouge
  for (let x = 0; x < w; x++) {
    const waveY = Math.sin((x / w) * Math.PI * 4 + phase) * h * 0.05;
    ctx.fillStyle = "#BA0C2F";
    ctx.fillRect(x, waveY, 1, h - Math.abs(waveY) * 2);
  }
  // Croix blanche (proportions Norvège : 6:1:2:1:12 horizontal, 6:1:2:1:6 vertical)
  const crossX = w * 0.30;
  const wWhite = h * 0.22;
  const wBlue  = h * 0.10;
  // Bandes horizontales et verticales blanches
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(crossX - wWhite / 2 + Math.sin(phase * 1.3) * 2, 0, wWhite, h);
  ctx.fillRect(0, h / 2 - wWhite / 2 + Math.cos(phase * 1.1) * 2, w, wWhite);
  // Croix bleue plus fine (avec un léger pulsing)
  const blueAlpha = 0.85 + Math.sin(phase * 2) * 0.15;
  ctx.fillStyle = `rgba(0, 32, 91, ${blueAlpha})`;
  ctx.fillRect(crossX - wBlue / 2 + Math.sin(phase * 1.3) * 2, 0, wBlue, h);
  ctx.fillRect(0, h / 2 - wBlue / 2 + Math.cos(phase * 1.1) * 2, w, wBlue);
}

// Drapeau Nigeria animé (vert / blanc / vert)
function drawNigeriaFlag(canvas: HTMLCanvasElement, phase: number) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  for (let x = 0; x < w; x++) {
    const waveY = Math.sin((x / w) * Math.PI * 3.5 + phase) * h * 0.06;
    const third = w / 3;
    let color: string;
    if (x < third) color = "#008753";
    else if (x < third * 2) color = "#FFFFFF";
    else color = "#008753";
    ctx.fillStyle = color;
    ctx.fillRect(x, waveY, 1, h - Math.abs(waveY) * 2);
  }
}

// Drapeau Angola animé (rouge / noir / étoile jaune)
function drawAngolaFlag(canvas: HTMLCanvasElement, phase: number) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  // Moitié rouge (haut), moitié noire (bas), avec ondulation
  for (let x = 0; x < w; x++) {
    const waveY = Math.sin((x / w) * Math.PI * 3 + phase) * h * 0.05;
    // Bande rouge en haut
    ctx.fillStyle = "#CC092F";
    ctx.fillRect(x, waveY, 1, h / 2 - waveY);
    // Bande noire en bas
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, h / 2, 1, h / 2 - Math.abs(waveY));
  }
  // Emblème central jaune (simplifié : roue dentée)
  ctx.fillStyle = "#FFCD00";
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, h * 0.12, 0, Math.PI * 2);
  ctx.fill();
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export const PetrolePatienceShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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

    // ─── A1 : 3 pays pétroliers extrusion 3D ──────────────────────────
    if (frame < F.A2_START) {
      const t = frame / F.A2_START;
      const producers = [
        { iso: "NGA", height: 200000, color: C.gold },
        { iso: "AGO", height: 160000, color: C.amber },
        { iso: "DZA", height: 130000, color: C.rust },
      ];
      producers.forEach(({ iso, height, color }) => {
        const id = `a1-ext-${iso}`;
        if (!map.getLayer(id)) {
          map.addLayer({
            id, type: "fill-extrusion", source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
            paint: {
              "fill-extrusion-color": color,
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

    // ─── A2 : Drapeau Nigeria animé + Drapeau Angola animé ───────────
    if (frame >= F.A2_START && frame < F.A3_START) {
      const t = (frame - F.A2_START) / (F.A3_START - F.A2_START);

      // Nettoyage A1 extrusions
      if (frame === F.A2_START + 5) {
        ["a1-ext-NGA", "a1-ext-AGO", "a1-ext-DZA"].forEach(id => {
          if (map.getLayer(id)) {
            try { map.setPaintProperty(id, "fill-extrusion-opacity", 0); } catch {}
          }
        });
      }

      // Drapeau Nigeria animé
      const ngaCanvas = getCanvas("nga-flag", 200, 130);
      drawNigeriaFlag(ngaCanvas, phase);
      pushCanvas(map, "img-nga-flag", ngaCanvas);
      ensureCountryFill(map, "a2-nga", "NGA", { pattern: "img-nga-flag" });
      try { map.setPaintProperty("a2-nga", "fill-opacity", Math.min(0.92, t * 3)); } catch {}

      // Drapeau Angola animé (apparaît plus tard après whip)
      if (t > 0.65) {
        const agoCanvas = getCanvas("ago-flag", 200, 130);
        drawAngolaFlag(agoCanvas, phase);
        pushCanvas(map, "img-ago-flag", agoCanvas);
        ensureCountryFill(map, "a2-ago", "AGO", { pattern: "img-ago-flag" });
        const op = Math.min(0.92, (t - 0.65) * 3);
        try { map.setPaintProperty("a2-ago", "fill-opacity", op); } catch {}
      }
    }

    // ─── A3 : Drapeau Norvège animé ──────────────────────────────────
    if (frame >= F.A3_START && frame < F.A4_START) {
      const t = (frame - F.A3_START) / (F.A4_START - F.A3_START);
      if (t > 0.40) {
        const norCanvas = getCanvas("nor-flag", 250, 175);
        drawNorwayFlag(norCanvas, phase);
        pushCanvas(map, "img-nor-flag", norCanvas);
        ensureCountryFill(map, "a3-nor", "NOR", { pattern: "img-nor-flag" });
        const op = Math.min(0.92, (t - 0.40) * 3);
        try { map.setPaintProperty("a3-nor", "fill-opacity", op); } catch {}
      }
    }

    // ─── A4 : Drapeau Sénégal animé + smoke premium ──────────────────
    if (frame >= F.A4_START && frame < F.A5_START) {
      const t = (frame - F.A4_START) / (F.A5_START - F.A4_START);

      // Drapeau Sénégal animé
      if (t > 0.30) {
        const senCanvas = getCanvas("sen-flag", 180, 120);
        drawSenegalFlag(senCanvas, phase);
        pushCanvas(map, "img-sen-flag", senCanvas);
        ensureCountryFill(map, "a4-sen-flag", "SEN", { pattern: "img-sen-flag" });
        const op = Math.min(0.85, (t - 0.30) * 3);
        try { map.setPaintProperty("a4-sen-flag", "fill-opacity", op); } catch {}
      }
    }

    // ─── A5 : Smoke premium sur SEN + comparaison 18% vs 82% visuelle ─
    if (frame >= F.A5_START && frame < F.A6_START) {
      const t = (frame - F.A5_START) / (F.A6_START - F.A5_START);

      // Drapeau Sénégal continue (héritage A4) avec opacité réduite + smoke par-dessus
      if (smokeCanvasRef.current && smokeAnimRef.current) {
        const total = (smokeAnimRef.current.totalFrames ?? 106) | 0;
        const sceneF = frame - F.A5_START;
        try { smokeAnimRef.current.goToAndStop(sceneF % total, true); } catch {}
        pushCanvas(map, "img-sen-smoke", smokeCanvasRef.current);
        ensureCountryFill(map, "a5-sen-smoke", "SEN", { pattern: "img-sen-smoke" });
        const op = Math.min(0.65, t * 2.5);
        try { map.setPaintProperty("a5-sen-smoke", "fill-opacity", op); } catch {}
      }
    }

    // ─── A6 : Sénégal pulse final ────────────────────────────────────
    if (frame >= F.A6_START) {
      const senCanvas = getCanvas("a6-sen", 200, 200);
      drawSenegalFlag(senCanvas, phase * 0.8);
      pushCanvas(map, "img-a6-sen", senCanvas);
      ensureCountryFill(map, "a6-sen", "SEN", { pattern: "img-a6-sen" });
      const t = (frame - F.A6_START) / (F.END - F.A6_START);
      const op = t < 0.7 ? 0.85 : interpolate(t, [0.7, 1], [0.85, 0.3]);
      try { map.setPaintProperty("a6-sen", "fill-opacity", op); } catch {}
    }
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
      <MapboxBrandingHide />

      <AbsoluteFill style={{
        filter: getCam(frame).blur > 0 ? `blur(${getCam(frame).blur}px)` : undefined,
      }}>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>

      <ShortOverlays frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// OVERLAYS TEXTE 9:16 — piles verticales adaptées Short
// ═══════════════════════════════════════════════════════════════════════════════

const ShortOverlays: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // A1 — Hook
  if (frame < F.A2_START) {
    const p1 = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 30 });
    const p2 = spring({ frame: frame - 200, fps, config: { damping: 18 }, durationInFrames: 30 });
    return (
      <>
        {/* Titre top */}
        <div style={{
          position: "absolute", top: 100, left: 60, right: 60,
          opacity: p1, transform: `translateY(${(1 - p1) * 20}px)`,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 26,
            color: C.gold, letterSpacing: 5, textTransform: "uppercase",
          }}>SOUVERAIN</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 78, fontWeight: 700,
            color: C.ivory, marginTop: 12, lineHeight: 1.1,
          }}>Le pétrole<br/>de la patience</div>
        </div>
        {/* Big stat center-bottom */}
        {frame > 200 && (
          <div style={{
            position: "absolute", bottom: 350, left: 0, right: 0,
            textAlign: "center", opacity: p2,
            transform: `translateY(${(1 - p2) * 30}px)`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 22,
              color: C.gold, letterSpacing: 5, textTransform: "uppercase", marginBottom: 16,
            }}>Extraction depuis 2000</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 240, fontWeight: 700,
              color: C.goldHi, lineHeight: 1,
            }}>$1500<span style={{ fontSize: 140 }}>B</span></div>
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

  // A3 — Norvège (contre-exemple)
  if (frame < F.A4_START) {
    const p = spring({ frame: frame - F.A3_START - 150, fps, config: { damping: 18 }, durationInFrames: 30 });
    return (
      <div style={{
        position: "absolute", top: 140, left: 60, right: 60,
        textAlign: "center",
        opacity: p, transform: `translateY(${(1 - p) * 20}px)`,
      }}>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 22,
          color: C.gold, letterSpacing: 5, textTransform: "uppercase",
        }}>Norvège · 1969</div>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 84, fontWeight: 700,
          color: C.ivory, marginTop: 12, lineHeight: 1.1,
        }}>Un autre<br/>choix</div>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 26,
          color: C.gold, letterSpacing: 4, textTransform: "uppercase", marginTop: 60,
        }}>Fonds souverain</div>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 230, fontWeight: 700,
          color: C.goldHi, lineHeight: 1, marginTop: 12,
        }}>$1700<span style={{ fontSize: 130 }}>B</span></div>
      </div>
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

  // A5 — Comparaison 18% vs 82% (empilé vertical)
  if (frame < F.A6_START) {
    const pP = spring({ frame: frame - F.A5_START, fps, config: { damping: 18 }, durationInFrames: 30 });
    const pE = spring({ frame: frame - F.A5_START - 90, fps, config: { damping: 18 }, durationInFrames: 30 });
    return (
      <div style={{
        position: "absolute", top: 120, left: 60, right: 60,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 24,
          color: C.gold, letterSpacing: 5, textTransform: "uppercase",
          opacity: pP,
        }}>Sénégal vs Export</div>

        <div style={{
          marginTop: 50,
          opacity: pP, transform: `translateY(${(1 - pP) * 20}px)`,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 240, fontWeight: 700,
            color: C.goldHi, lineHeight: 0.9,
          }}>18%</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 30,
            color: C.gold, marginTop: 8, letterSpacing: 3,
          }}>PETROSEN</div>
        </div>

        <div style={{
          fontFamily: "Georgia, serif", fontSize: 50, color: C.slate,
          margin: "32px 0",
          opacity: pE,
        }}>VS</div>

        <div style={{
          opacity: pE, transform: `translateY(${(1 - pE) * 20}px)`,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 240, fontWeight: 700,
            color: C.rust, lineHeight: 0.9,
          }}>82%</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 30,
            color: C.gold, marginTop: 8, letterSpacing: 3,
          }}>EXPORT</div>
        </div>
      </div>
    );
  }

  // A6 — Question finale
  const p = spring({ frame: frame - F.A6_START, fps, config: { damping: 18 }, durationInFrames: 30 });
  const tLocal = (frame - F.A6_START) / (F.END - F.A6_START);
  const p2 = spring({ frame: frame - F.A6_START - 130, fps, config: { damping: 18 }, durationInFrames: 30 });
  return (
    <>
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
      {tLocal > 0.55 && (
        <div style={{
          position: "absolute", bottom: 180, left: 0, right: 0,
          textAlign: "center", opacity: p2,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 24,
            color: C.gold, letterSpacing: 5, textTransform: "uppercase",
          }}>SOUVERAIN</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 30, fontStyle: "italic",
            color: C.slate, marginTop: 14,
          }}>Dans dix ans, on saura.</div>
        </div>
      )}
    </>
  );
};
