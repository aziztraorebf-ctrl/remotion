import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "./MapboxBase";

// ─────────────────────────────────────────────────────────────────────────────
// MapboxOverlayLab — Catalogue techniques d'overlay Mapbox
//
// 5 scènes × 10s = 300f par scène = 1500f @ 30fps = 50s
//
// SCÈNES :
//  S1  f0    → f300  Sénégal        FILL-PATTERN drapeau sur territoire
//  S2  f300  → f600  Sahel          LINE DASHARRAY tracé progressif frontière
//  S3  f600  → f900  Afrique Ouest  FILL-EXTRUSION 3D pays proportionnel
//  S4  f900  → f1200 Golfe Guinée   MARKERS spring pop + zoom in
//  S5  f1200 → f1500 Sénégal        FILL-PATTERN canvas animé (test GIF-like)
//
// REF CAMERA LAB v2 : https://files.catbox.moe/v0v4e6.mp4
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const SCENE_DUR = 300;
const S = Array.from({ length: 6 }, (_, i) => i * SCENE_DUR);

const LOC = {
  senegal:     [-14.5, 14.4] as [number, number],
  sahel:       [-2.0,  15.0] as [number, number],
  westAfrica:  [-3.0,  10.0] as [number, number],
  gulfGuinea:  [2.0,    5.5] as [number, number],
};

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }
function springBounce(t: number) {
  // scale 0→1.3→1 sur [0,1]
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const overshoot = 1.3;
  if (t < 0.6) return interpolate(t, [0, 0.6], [0, overshoot]);
  return interpolate(t, [0.6, 1], [overshoot, 1.0]);
}

// ── Canvas drapeau sénégalais (vert/jaune/rouge + étoile verte) ──────────────
function drawSenegalFlag(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const third = w / 3;
  ctx.fillStyle = "#00853F"; ctx.fillRect(0, 0, third, h);
  ctx.fillStyle = "#FDEF42"; ctx.fillRect(third, 0, third, h);
  ctx.fillStyle = "#E31B23"; ctx.fillRect(third * 2, 0, third, h);
  // Étoile verte au centre
  ctx.fillStyle = "#00853F";
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const r = h * 0.22;
    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ── Canvas drapeau animé (ondulation simulée via décalage horizontal) ─────────
function drawAnimatedFlag(ctx: CanvasRenderingContext2D, w: number, h: number, phase: number) {
  // Fond transparent
  ctx.clearRect(0, 0, w, h);
  // Dessiner colonne par colonne avec décalage sinusoïdal vertical
  const cols = w;
  for (let x = 0; x < cols; x++) {
    const waveY = Math.sin((x / w) * Math.PI * 3 + phase) * h * 0.08;
    const third = w / 3;
    let color: string;
    if (x < third) color = "#00853F";
    else if (x < third * 2) color = "#FDEF42";
    else color = "#E31B23";
    ctx.fillStyle = color;
    ctx.fillRect(x, waveY, 1, h - Math.abs(waveY) * 2);
  }
  // Étoile centrale
  ctx.fillStyle = "#00853F";
  ctx.save();
  ctx.translate(w / 2, h / 2 + Math.sin(phase) * h * 0.04);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const r = h * 0.22;
    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ── Villes Golfe de Guinée pour markers ───────────────────────────────────────
const GULF_CITIES = [
  { name: "Lagos",     lon: 3.390,   lat: 6.454,  val: 15.0 },
  { name: "Accra",     lon: -0.187,  lat: 5.603,  val: 6.5 },
  { name: "Abidjan",   lon: -3.960,  lat: 5.354,  val: 8.2 },
  { name: "Lomé",      lon: 1.222,   lat: 6.137,  val: 2.1 },
  { name: "Cotonou",   lon: 2.315,   lat: 6.366,  val: 1.8 },
  { name: "Port Harcourt", lon: 6.998, lat: 4.779, val: 10.3 },
];

// ── Pays Afrique Ouest pour extrusion (PIB relatif) ───────────────────────────
// ISO alpha-3 — champ correct dans mapbox.country-boundaries-v1
const EXTRUSION_COUNTRIES: Array<{ iso: string; name: string; height: number; color: string }> = [
  { iso: "NGA", name: "Nigeria",       height: 180000, color: "#c8a951" },
  { iso: "GHA", name: "Ghana",         height: 80000,  color: "#e8c472" },
  { iso: "CIV", name: "Côte d'Ivoire", height: 60000,  color: "#d4b55c" },
  { iso: "SEN", name: "Sénégal",       height: 45000,  color: "#b89840" },
  { iso: "MLI", name: "Mali",          height: 30000,  color: "#a08530" },
  { iso: "BFA", name: "Burkina Faso",  height: 20000,  color: "#8c7228" },
  { iso: "GIN", name: "Guinée",        height: 25000,  color: "#b08038" },
  { iso: "SLE", name: "Sierra Leone",  height: 15000,  color: "#987030" },
];

// ── Composant principal ────────────────────────────────────────────────────────
export const MapboxOverlayLab: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animImgRef = useRef<boolean>(false);

  const sceneIdx = Math.min(Math.floor(frame / SCENE_DUR), 4);
  const sceneFrame = frame - S[sceneIdx];
  const tScene = clamp01(sceneFrame / SCENE_DUR);

  // ── Init map ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container:            containerRef.current,
      style:                MAPBOX_STYLES.dark,
      center:               LOC.senegal,
      zoom:                 5.5,
      pitch:                30,
      bearing:              0,
      interactive:          false,
      preserveDrawingBuffer: true,
      antialias:            true,
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
      markersRef.current.forEach(m => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Engine principal — une scène à la fois ──────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const map = mapRef.current;

    // ── S1 : Fill-pattern drapeau statique ─────────────────────────────────
    if (sceneIdx === 0) {
      map.jumpTo({ center: LOC.senegal, zoom: interpolate(tScene, [0, 1], [4.5, 6.0]), pitch: 20, bearing: tScene * 8 });

      if (!map.hasImage("flag-sn")) {
        const canvas = document.createElement("canvas");
        canvas.width = 120; canvas.height = 80;
        const ctx = canvas.getContext("2d")!;
        drawSenegalFlag(ctx, 120, 80);
        map.addImage("flag-sn", { width: 120, height: 80, data: ctx.getImageData(0, 0, 120, 80).data as unknown as Uint8Array });
      }

      // Source partagée — même pattern que addCountryHighlight dans MapboxBase
      if (!map.getSource("cb-source")) {
        map.addSource("cb-source", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
      }

      if (!map.getLayer("sn-flag-layer")) {
        map.addLayer({
          id:     "sn-flag-layer",
          type:   "fill",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "SEN"],
          paint: { "fill-pattern": "flag-sn", "fill-opacity": 0 },
        });
      }

      const opacity = Math.min(1, tScene * 3);
      try { map.setPaintProperty("sn-flag-layer", "fill-opacity", opacity); } catch {}
    }

    // ── S2 : Line dasharray tracé progressif ───────────────────────────────
    if (sceneIdx === 1) {
      map.jumpTo({ center: LOC.sahel, zoom: interpolate(tScene, [0, 1], [3.5, 4.5]), pitch: 15, bearing: 0 });

      if (!map.getSource("cb-source")) {
        map.addSource("cb-source", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
      }

      if (!map.getLayer("sahel-draw-line")) {
        map.addLayer({
          id:     "sahel-draw-line",
          type:   "line",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["in", ["get", "iso_3166_1_alpha_3"], ["literal", ["MLI", "BFA", "SEN", "NER", "BEN"]]],
          paint: {
            "line-color":  "#c8a951",
            "line-width":  2.5,
            "line-opacity": 0.9,
            // dasharray [filled, gap] — on fait varier le filled de 0→20
            "line-dasharray": [0, 20],
          },
        });
      }

      // Tracé progressif : dasharray [filled, gap] où filled = tScene * 20
      const drawn = easeInOutCubic(tScene) * 20;
      const gap   = Math.max(0, 20 - drawn);
      try {
        map.setPaintProperty("sahel-draw-line", "line-dasharray", [drawn, gap]);
      } catch {}
    }

    // ── S3 : Fill-extrusion 3D ─────────────────────────────────────────────
    if (sceneIdx === 2) {
      const pitch = interpolate(tScene, [0, 0.3], [0, 55], { extrapolateRight: "clamp" });
      map.jumpTo({ center: LOC.westAfrica, zoom: 4.2, pitch, bearing: interpolate(tScene, [0, 1], [-15, 15]) });

      if (!map.getSource("cb-source")) {
        map.addSource("cb-source", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
      }

      const heightScale = easeOutCubic(clamp01(tScene * 2));

      EXTRUSION_COUNTRIES.forEach(({ iso, name, height, color }) => {
        const layerId = `ext-${iso}`;
        if (!map.getLayer(layerId)) {
          map.addLayer({
            id:     layerId,
            type:   "fill-extrusion",
            source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
            paint: {
              "fill-extrusion-color":   color,
              "fill-extrusion-height":  0,
              "fill-extrusion-opacity": 0.85,
            },
          });
        }
        try {
          map.setPaintProperty(layerId, "fill-extrusion-height", height * heightScale);
        } catch {}
      });
    }

    // ── S4 : Markers spring pop ────────────────────────────────────────────
    if (sceneIdx === 3) {
      const zoom = interpolate(tScene, [0, 1], [4.0, 5.8]);
      map.jumpTo({ center: LOC.gulfGuinea, zoom, pitch: 25, bearing: 0 });

      // Créer les markers si pas encore créés
      if (markersRef.current.length === 0) {
        GULF_CITIES.forEach((city, i) => {
          const el = document.createElement("div");
          el.style.cssText = `
            width: 12px; height: 12px;
            border-radius: 50%;
            background: #c8a951;
            border: 2px solid #f2ebd9;
            transform: scale(0);
            transform-origin: center;
            transition: none;
          `;
          const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
            .setLngLat([city.lon, city.lat])
            .addTo(map);
          markersRef.current.push(marker);
        });
      }

      // Spring pop séquentiel — chaque marker apparaît avec un délai
      GULF_CITIES.forEach((_, i) => {
        const el = markersRef.current[i]?.getElement();
        if (!el) return;
        const delay = i * 0.08;
        const tLocal = clamp01((tScene - delay) / 0.3);
        const scale = springBounce(tLocal);
        el.style.transform = `scale(${scale})`;
        // Pulse de taille continue après apparition
        if (tLocal >= 1) {
          const pulse = 1 + Math.sin((tScene - delay - 0.3) * Math.PI * 4) * 0.15;
          el.style.transform = `scale(${pulse})`;
        }
      });
    }

    // ── S5 : Fill-pattern canvas animé (drapeau ondulant) ──────────────────
    if (sceneIdx === 4) {
      map.jumpTo({ center: LOC.senegal, zoom: interpolate(tScene, [0, 1], [5.5, 6.5]), pitch: 25, bearing: tScene * 12 });

      // Phase de l'onde = frame / 8 (cycle rapide visible)
      const phase = (sceneFrame / fps) * Math.PI * 1.5;

      // Canvas animé : mettre à jour l'image à chaque frame
      if (!canvasRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = 128; canvas.height = 86;
        canvasRef.current = canvas;
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      drawAnimatedFlag(ctx, canvas.width, canvas.height, phase);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      try {
        if (!map.hasImage("flag-sn-anim")) {
          // Première création
          map.addImage("flag-sn-anim", {
            width:  canvas.width,
            height: canvas.height,
            data:   imgData.data as unknown as Uint8Array,
          });
          animImgRef.current = true;
        } else {
          // Update frame par frame
          map.updateImage("flag-sn-anim", {
            width:  canvas.width,
            height: canvas.height,
            data:   imgData.data as unknown as Uint8Array,
          });
        }
      } catch (e) {
        // Fallback : si updateImage non supporté, on recrée
        try {
          map.removeImage("flag-sn-anim");
          map.addImage("flag-sn-anim", {
            width:  canvas.width,
            height: canvas.height,
            data:   imgData.data as unknown as Uint8Array,
          });
        } catch {}
      }

      if (!map.getSource("cb-source")) {
        map.addSource("cb-source", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
      }
      if (!map.getLayer("sn-flag-anim-layer")) {
        map.addLayer({
          id:     "sn-flag-anim-layer",
          type:   "fill",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "SEN"],
          paint: {
            "fill-pattern": "flag-sn-anim",
            "fill-opacity": 0,
          },
        });
      }

      const opacity = Math.min(1, tScene * 2.5);
      try { map.setPaintProperty("sn-flag-anim-layer", "fill-opacity", opacity); } catch {}
    }

  }); // fin useEffect sans deps — appelé chaque frame

  // ── Labels scènes ───────────────────────────────────────────────────────────
  const SCENE_LABELS = [
    { name: "Sénégal",       technique: "FILL-PATTERN — drapeau statique" },
    { name: "Sahel",         technique: "LINE DASHARRAY — tracé progressif" },
    { name: "Afrique Ouest", technique: "FILL-EXTRUSION 3D — PIB relatif" },
    { name: "Golfe Guinée",  technique: "MARKERS — spring pop séquentiel" },
    { name: "Sénégal",       technique: "FILL-PATTERN — canvas animé (test)" },
  ];
  const label = SCENE_LABELS[sceneIdx];

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
        {sceneIdx === 4 && (
          <div style={{
            paddingLeft: 48, fontFamily: "monospace", fontSize: 11,
            color: "#a3d2e6", letterSpacing: 1,
          }}>
            map.updateImage() par frame
          </div>
        )}
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
        {SCENE_LABELS.map((_, i) => (
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

export const MAPBOX_OVERLAY_LAB_FRAMES = S[5]; // 1500
