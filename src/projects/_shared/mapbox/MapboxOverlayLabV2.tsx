import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import lottie from "lottie-web";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "./MapboxBase";

// ─────────────────────────────────────────────────────────────────────────────
// MapboxOverlayLab v2 — Techniques canvas premium
//
// 6 scènes × 10s = 300f par scène = 1800f @ 30fps = 60s
//
// SCÈNES :
//  S1  f0    → f300  Nigeria        GRADIENT VAGUE horizontal (richesse pétrolière)
//  S2  f300  → f600  Maroc          GRADIENT RADIAL pulsant depuis Rabat
//  S3  f600  → f900  Afrique Ouest  GRADIENT MULTI-PAYS couleurs distinctes
//  S4  f900  → f1200 Sénégal        NOISE ORGANIQUE — territoire vivant
//  S5  f1200 → f1500 Sénégal        SVG WATERMARK "$47B" répété en pattern
//  S6  f1500 → f1800 Nigeria        LOTTIE off-screen canvas — test headless
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const SCENE_DUR = 300;
const S = Array.from({ length: 7 }, (_, i) => i * SCENE_DUR);

const LOC = {
  nigeria:    [8.0,    9.0] as [number, number],
  maroc:      [-6.0,  32.0] as [number, number],
  rabat:      [-6.851, 33.991] as [number, number],
  westAfrica: [-3.0,  10.0] as [number, number],
  senegal:    [-14.5, 14.4] as [number, number],
};

function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ── Source partagée — helper ──────────────────────────────────────────────────
function ensureSource(map: mapboxgl.Map) {
  if (!map.getSource("cb-source")) {
    map.addSource("cb-source", {
      type: "vector",
      url:  "mapbox://mapbox.country-boundaries-v1",
    });
  }
}

// ── Push canvas image vers Mapbox ─────────────────────────────────────────────
function pushCanvas(map: mapboxgl.Map, id: string, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data as unknown as Uint8Array;
  if (!map.hasImage(id)) {
    map.addImage(id, { width: canvas.width, height: canvas.height, data });
  } else {
    try {
      map.updateImage(id, { width: canvas.width, height: canvas.height, data });
    } catch {
      map.removeImage(id);
      map.addImage(id, { width: canvas.width, height: canvas.height, data });
    }
  }
}

// ── Ensure fill-pattern layer ─────────────────────────────────────────────────
function ensureFillLayer(map: mapboxgl.Map, layerId: string, imgId: string, iso: string) {
  if (!map.getLayer(layerId)) {
    map.addLayer({
      id:     layerId,
      type:   "fill",
      source: "cb-source",
      "source-layer": "country_boundaries",
      filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
      paint:  { "fill-pattern": imgId, "fill-opacity": 0 },
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESSINATEURS CANVAS
// ═══════════════════════════════════════════════════════════════════════════════

// S1 — Gradient vague horizontal
// phase 0→1 = vague qui balaye de gauche (noir) vers droite (or/orange)
function drawGradientWave(canvas: HTMLCanvasElement, phase: number) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  // Vague : bord gauche de la zone colorée oscille selon phase
  const waveX = (Math.sin(phase * Math.PI * 2) * 0.5 + 0.5) * w;

  const grad = ctx.createLinearGradient(waveX - w * 0.3, 0, waveX + w * 0.5, 0);
  grad.addColorStop(0,   "rgba(0,0,0,0)");
  grad.addColorStop(0.3, "rgba(200,100,0,0.6)");
  grad.addColorStop(0.6, "rgba(200,169,81,0.85)");
  grad.addColorStop(1,   "rgba(255,220,100,0.5)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

// S2 — Gradient radial pulsant
// pulse 0→1 = rayon du cercle croît et décroît
function drawRadialPulse(canvas: HTMLCanvasElement, pulse: number) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  // Centre = position relative de Rabat dans le canvas (approximatif — le pattern se tile)
  const cx = w * 0.5;
  const cy = h * 0.4;
  const maxR = w * (0.3 + pulse * 0.5);

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
  grad.addColorStop(0,    "rgba(200,169,81,0.9)");
  grad.addColorStop(0.4,  "rgba(200,100,50,0.6)");
  grad.addColorStop(0.7,  "rgba(100,50,20,0.3)");
  grad.addColorStop(1,    "rgba(0,0,0,0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

// S3 — Multi-pays : chaque couleur est assignée par bande
// On crée un pattern distinct par pays dans la même scène
// NGA=or, GHA=vert, CIV=orange, SEN=rouge
function makeCountryGradient(
  canvas: HTMLCanvasElement,
  r: number, g: number, b: number,
  phase: number
) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  const alpha = 0.55 + Math.sin(phase * Math.PI * 2) * 0.2;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
  grad.addColorStop(0.4, `rgba(${r},${g},${b},${alpha})`);
  grad.addColorStop(1,   `rgba(${r},${g},${b},${alpha * 0.6})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

// S4 — Noise organique (pseudo-Perlin simplifié via sin harmoniques)
function drawOrganicNoise(canvas: HTMLCanvasElement, t: number) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Combinaison de sin à différentes fréquences = pseudo-noise
      const nx = x / w;
      const ny = y / h;
      const noise =
        Math.sin(nx * 8  + t * 2.1) * 0.35 +
        Math.sin(ny * 6  + t * 1.7) * 0.25 +
        Math.sin((nx + ny) * 5 + t * 3.0) * 0.20 +
        Math.sin(nx * 13 - ny * 7 + t * 0.8) * 0.20;
      const v = (noise + 1) / 2; // 0→1

      // Palette or/ambre
      const idx = (y * w + x) * 4;
      data[idx]     = Math.round(180 + v * 60);   // R
      data[idx + 1] = Math.round(120 + v * 60);   // G
      data[idx + 2] = Math.round(20  + v * 30);   // B
      data[idx + 3] = Math.round(v * 200);         // A — transparence variable
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

// S5 — SVG watermark "$47B" répété
function drawWatermarkSVG(canvas: HTMLCanvasElement, opacity: number) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  // Background semi-transparent or
  ctx.fillStyle = `rgba(200,169,81,${opacity * 0.25})`;
  ctx.fillRect(0, 0, w, h);

  // Texte répété en grille
  ctx.fillStyle = `rgba(255,235,150,${opacity * 0.7})`;
  ctx.font = `bold ${h * 0.28}px monospace`;
  ctx.textBaseline = "middle";

  const text = "$47B";
  const cellW = w / 2;
  const cellH = h / 2;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      ctx.save();
      ctx.translate(col * cellW + cellW / 2, row * cellH + cellH / 2);
      ctx.rotate(-Math.PI / 8);
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }
  }
}

// S6 — Lottie off-screen (animation de flamme/énergie générée programmatiquement)
// lottie-web nécessite un JSON Lottie. On génère un JSON minimal inline :
// un cercle qui pulse en scale — Lottie "bodymovin" format
function buildLottieJson() {
  // Lottie JSON minimal : 1 layer, 1 shape (cercle), scale 0→200 sur 30f
  return {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 30,
    w: 128,
    h: 128,
    nm: "pulse",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0, ind: 1, ty: 4, nm: "circle", sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [64, 64, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] },
                t: 0,  s: [20,  20,  100] },
              { i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] },
                t: 15, s: [110, 110, 100] },
              { t: 29, s: [20, 20, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "el",
                p: { a: 0, k: [0, 0] },
                s: { a: 0, k: [60, 60] },
              },
              {
                ty: "fl",
                c: { a: 1, k: [
                  { i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] },
                    t: 0,  s: [0.784, 0.663, 0.318, 1] },
                  { i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] },
                    t: 15, s: [1.0,   0.4,   0.0,   1] },
                  { t: 29, s: [0.784, 0.663, 0.318, 1] },
                ]},
                o: { a: 0, k: 90 },
                r: 1,
              },
              {
                ty: "tr",
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 },
              },
            ],
          },
        ],
        ip: 0, op: 30, st: 0,
      },
    ],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT
// ═══════════════════════════════════════════════════════════════════════════════

export const MapboxOverlayLabV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);

  // Canvas persistants — un par technique
  const canvasesRef = useRef<Record<string, HTMLCanvasElement>>({});
  // Lottie animation instance
  const lottieRef = useRef<{ goToAndStop: (f: number, b: boolean) => void; destroy?: () => void } | null>(null);
  const lottieCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const sceneIdx  = Math.min(Math.floor(frame / SCENE_DUR), 5);
  const sceneFrame = frame - S[sceneIdx];
  const tScene    = clamp01(sceneFrame / SCENE_DUR);

  function getCanvas(key: string, w = 128, h = 128): HTMLCanvasElement {
    if (!canvasesRef.current[key]) {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      canvasesRef.current[key] = c;
    }
    return canvasesRef.current[key];
  }

  // ── Init map + Lottie dans le même effect ─────────────────────────────────
  // Lottie doit être initialisé dans le même cycle que la map pour que le
  // canvas off-screen soit stable en headless (pas de GC entre deux effects)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    // Init Lottie : container div caché dans le DOM + canvas off-screen
    // lottie-web exige un container DOM même quand on passe context direct
    const lottieContainer = document.createElement("div");
    lottieContainer.style.cssText = "position:absolute;width:128px;height:128px;opacity:0;pointer-events:none;left:-9999px;top:-9999px;";
    document.body.appendChild(lottieContainer);

    const offCanvas = document.createElement("canvas");
    offCanvas.width = 128; offCanvas.height = 128;
    lottieCanvasRef.current = offCanvas;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anim = lottie.loadAnimation({
        container:        lottieContainer,
        animationData:    buildLottieJson(),
        renderer:         "canvas",
        loop:             true,
        autoplay:         false,
        rendererSettings: { clearCanvas: true, progressiveLoad: false },
      } as any);

      // Lottie crée son propre canvas dans lottieContainer — on le récupère
      anim.addEventListener("DOMLoaded", () => {
        const created = lottieContainer.querySelector("canvas") as HTMLCanvasElement | null;
        if (created) lottieCanvasRef.current = created;
      });

      lottieRef.current = anim;
    } catch (e) {
      // Fallback radial actif si init échoue
    }

    const map = new mapboxgl.Map({
      container:             containerRef.current,
      style:                 MAPBOX_STYLES.dark,
      center:                LOC.nigeria,
      zoom:                  4.5,
      pitch:                 20,
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
      applyGeoAfriqueV5(map);
      setReady(true);
    });

    mapRef.current = map;
    return () => {
      lottieRef.current?.destroy?.();
      lottieRef.current = null;
      try { document.body.removeChild(lottieContainer); } catch {}
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Engine par frame ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const map = mapRef.current;

    // ── S1 : Gradient vague horizontal (Nigeria) ────────────────────────────
    if (sceneIdx === 0) {
      map.jumpTo({
        center:  LOC.nigeria,
        zoom:    interpolate(tScene, [0, 1], [4.5, 5.5]),
        pitch:   25,
        bearing: tScene * 6,
      });
      ensureSource(map);

      const phase = (sceneFrame / fps) * 0.6;
      const c = getCanvas("wave");
      drawGradientWave(c, phase);
      pushCanvas(map, "img-wave", c);
      ensureFillLayer(map, "nga-wave", "img-wave", "NGA");
      const opacity = Math.min(0.9, tScene * 2);
      try { map.setPaintProperty("nga-wave", "fill-opacity", opacity); } catch {}
    }

    // ── S2 : Gradient radial pulsant (Maroc) ───────────────────────────────
    if (sceneIdx === 1) {
      map.jumpTo({
        center:  LOC.maroc,
        zoom:    interpolate(tScene, [0, 1], [4.0, 5.5]),
        pitch:   20,
        bearing: 0,
      });
      ensureSource(map);

      // pulse = sin oscillation 0→1→0
      const pulse = (Math.sin((sceneFrame / fps) * Math.PI * 1.2) + 1) / 2;
      const c = getCanvas("radial");
      drawRadialPulse(c, pulse);
      pushCanvas(map, "img-radial", c);
      ensureFillLayer(map, "mar-radial", "img-radial", "MAR");
      const opacity = Math.min(0.9, tScene * 2.5);
      try { map.setPaintProperty("mar-radial", "fill-opacity", opacity); } catch {}
    }

    // ── S3 : Multi-pays gradients distincts ────────────────────────────────
    if (sceneIdx === 2) {
      map.jumpTo({
        center:  LOC.westAfrica,
        zoom:    4.2,
        pitch:   interpolate(tScene, [0, 0.4], [0, 30], { extrapolateRight: "clamp" }),
        bearing: interpolate(tScene, [0, 1], [-5, 10]),
      });
      ensureSource(map);

      const phase = (sceneFrame / fps) * 0.8;
      const countries = [
        { iso: "NGA", key: "nga-g", imgKey: "img-nga", r: 200, g: 169, b: 81  },
        { iso: "GHA", key: "gha-g", imgKey: "img-gha", r: 0,   g: 180, b: 80  },
        { iso: "CIV", key: "civ-g", imgKey: "img-civ", r: 240, g: 130, b: 30  },
        { iso: "SEN", key: "sen-g", imgKey: "img-sen", r: 220, g: 60,  b: 60  },
        { iso: "MLI", key: "mli-g", imgKey: "img-mli", r: 100, g: 160, b: 220 },
      ];

      countries.forEach(({ iso, key, imgKey, r, g, b }, i) => {
        const c = getCanvas(imgKey);
        makeCountryGradient(c, r, g, b, phase + i * 0.2);
        pushCanvas(map, imgKey, c);
        ensureFillLayer(map, key, imgKey, iso);
        const opacity = Math.min(0.85, tScene * 3);
        try { map.setPaintProperty(key, "fill-opacity", opacity); } catch {}
      });
    }

    // ── S4 : Noise organique (Sénégal) ─────────────────────────────────────
    if (sceneIdx === 3) {
      map.jumpTo({
        center:  LOC.senegal,
        zoom:    interpolate(tScene, [0, 1], [5.0, 6.2]),
        pitch:   25,
        bearing: tScene * 10,
      });
      ensureSource(map);

      const t = (sceneFrame / fps) * 1.5;
      // Noise sur canvas plus grand pour meilleure résolution
      const c = getCanvas("noise", 256, 256);
      drawOrganicNoise(c, t);
      pushCanvas(map, "img-noise", c);
      ensureFillLayer(map, "sen-noise", "img-noise", "SEN");
      const opacity = Math.min(0.9, tScene * 2);
      try { map.setPaintProperty("sen-noise", "fill-opacity", opacity); } catch {}
    }

    // ── S5 : SVG Watermark (Sénégal) ───────────────────────────────────────
    if (sceneIdx === 4) {
      map.jumpTo({
        center:  LOC.senegal,
        zoom:    interpolate(tScene, [0, 1], [5.5, 6.5]),
        pitch:   20,
        bearing: 0,
      });
      ensureSource(map);

      const opacity = easeInOutCubic(Math.min(1, tScene * 2));
      const c = getCanvas("watermark", 200, 150);
      drawWatermarkSVG(c, opacity);
      pushCanvas(map, "img-watermark", c);
      ensureFillLayer(map, "sen-watermark", "img-watermark", "SEN");
      try { map.setPaintProperty("sen-watermark", "fill-opacity", opacity); } catch {}
    }

    // ── S6 : Lottie off-screen ─────────────────────────────────────────────
    if (sceneIdx === 5) {
      map.jumpTo({
        center:  LOC.nigeria,
        zoom:    interpolate(tScene, [0, 1], [4.5, 5.8]),
        pitch:   30,
        bearing: tScene * 8,
      });
      ensureSource(map);

      if (lottieRef.current && lottieCanvasRef.current) {
        // Pousser lottie au bon frame (cycle de 30f)
        const lottieFrame = sceneFrame % 30;
        try {
          lottieRef.current.goToAndStop(lottieFrame, true);
        } catch {}
        const c = lottieCanvasRef.current;
        pushCanvas(map, "img-lottie", c);
        ensureFillLayer(map, "nga-lottie", "img-lottie", "NGA");
        const opacity = Math.min(0.85, tScene * 2);
        try { map.setPaintProperty("nga-lottie", "fill-opacity", opacity); } catch {}
      } else {
        // Fallback si Lottie non disponible — pulse radial gold
        ensureSource(map);
        const pulse = (Math.sin((sceneFrame / fps) * Math.PI * 2) + 1) / 2;
        const c = getCanvas("lottie-fb");
        drawRadialPulse(c, pulse);
        pushCanvas(map, "img-lottie-fb", c);
        ensureFillLayer(map, "nga-lottie-fb", "img-lottie-fb", "NGA");
        const opacity = Math.min(0.85, tScene * 2);
        try { map.setPaintProperty("nga-lottie-fb", "fill-opacity", opacity); } catch {}
      }
    }
  });

  // ── Labels ──────────────────────────────────────────────────────────────────
  const LABELS = [
    { name: "Nigeria",       technique: "GRADIENT VAGUE — richesse pétrolière" },
    { name: "Maroc",         technique: "GRADIENT RADIAL — pulse depuis Rabat" },
    { name: "Afrique Ouest", technique: "MULTI-PAYS — gradients distincts" },
    { name: "Sénégal",       technique: "NOISE ORGANIQUE — territoire vivant" },
    { name: "Sénégal",       technique: "SVG WATERMARK — $47B répété" },
    { name: "Nigeria",       technique: "LOTTIE OFF-SCREEN — cercle pulsant animé" },
  ];
  const label = LABELS[sceneIdx];

  return (
    <AbsoluteFill style={{ background: "#0d1520" }}>
      <MapboxBrandingHide />
      <AbsoluteFill>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>

      {/* HUD */}
      <div style={{
        position: "absolute", top: 40, left: 48,
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: "#c8a951",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "#0d1520",
          }}>
            {sceneIdx + 1}
          </div>
          <div style={{
            fontFamily: "monospace", fontSize: 22, fontWeight: 700,
            color: "#f2ebd9", letterSpacing: 1,
          }}>
            {label.name}
          </div>
        </div>
        <div style={{
          fontFamily: "monospace", fontSize: 12, color: "#c8a951",
          letterSpacing: 2, textTransform: "uppercase", paddingLeft: 48,
        }}>
          {label.technique}
        </div>
      </div>

      {/* Barre progression */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 3, background: "rgba(255,255,255,0.08)",
      }}>
        <div style={{
          height: "100%",
          width: `${(sceneFrame / SCENE_DUR) * 100}%`,
          background: "#c8a951", transition: "none",
        }} />
      </div>

      {/* Minimap */}
      <div style={{
        position: "absolute", bottom: 20, left: "50%",
        transform: "translateX(-50%)", display: "flex", gap: 6,
      }}>
        {LABELS.map((_, i) => (
          <div key={i} style={{
            width: 24, height: 4, borderRadius: 2,
            background: i === sceneIdx ? "#c8a951"
              : frame > S[i] ? "rgba(200,169,81,0.4)"
              : "rgba(255,255,255,0.15)",
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const MAPBOX_OVERLAY_LAB_V2_FRAMES = S[6]; // 1800
