import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "../../_shared/mapbox/MapboxBase";
import { MAROC_WORDS, WordTs } from "./maroc-words";

// ─────────────────────────────────────────────────────────────────────────────
// MarocBatteriesShort — 1080×1920, 109.48s, 6 actes
// Structure : 1 fichier unique, 1 Map continue, getCam(frame)
// Skeleton : SOUVERAIN-SHORT-SKELETON.md
//
// Nouveautés épisode :
//   1. Ligne dasharray transcontinentale (Détroit Gibraltar comme levier hook)
//   2. À découvrir en production
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// ── Timing (frames à 30fps) ───────────────────────────────────────────────────
export const F = {
  A1_START: 0,      // Hook — "Dans 2 ans... usine qui n'existait pas"
  A2_START: 248,    // Phosphate — "Sous le sol marocain... 70%"
  A3_START: 932,    // Cailloux — "Pendant des décennies... valeur ajoutée"
  A4_START: 1300,   // Acteurs — "Gotion, Volkswagen, Kénitra"
  A5_START: 1817,   // Géographie — "Pour le Maroc... géographie industrielle"
  A6_START: 2977,   // Question — "Qui fixe le prix dans 10 ans ?"
  END:      3284,
};

export const MAROC_SHORT_FRAMES = F.END;

// ── Coordonnées ───────────────────────────────────────────────────────────────
const LOC = {
  atlantique:  [-10.0, 36.0]  as [number, number], // Vue large Europe+Maroc
  detroit:     [-5.5,  35.9]  as [number, number],  // Détroit de Gibraltar
  maroc:       [-6.0,  32.0]  as [number, number],  // Centre Maroc
  kenitra:     [-6.58, 34.26] as [number, number],  // Gigafactory
  khouribga:   [-6.91, 32.88] as [number, number],  // Bassin phosphate
  wolfsburg:   [10.78, 52.42] as [number, number],  // VW
  hefei:       [117.23,31.82] as [number, number],  // Gotion
  tanger:      [-5.51, 35.88] as [number, number],  // Port export
  algeciras:   [-5.45, 36.13] as [number, number],  // Espagne face Maroc
  eurafriq:    [0.0,   38.0]  as [number, number],  // Vue triangle géopolitique
};

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  navy:   "#16213a",
  gold:   "#c8a951",
  accent: "#c08820",
  ivory:  "#f2ebd9",
  red:    "#e63946",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

// ── Caméra continue (1 seule Map) ─────────────────────────────────────────────
type Cam = { lon: number; lat: number; zoom: number; pitch: number; bearing: number };

function getCam(frame: number): Cam {
  // A1 — Vue large Atlantique → zoom lent vers Kénitra (max zoom 7 pour garder le contexte Maroc)
  if (frame < F.A2_START) {
    const t = clamp01(frame / F.A2_START);
    // Easing plus lent — cubic au lieu de in-out pour arriver progressivement
    const e = Math.pow(t, 0.6);
    return {
      lon:     interpolate(e, [0, 1], [LOC.atlantique[0], LOC.kenitra[0]]),
      lat:     interpolate(e, [0, 1], [LOC.atlantique[1], LOC.kenitra[1]]),
      zoom:    interpolate(e, [0, 1], [4.2, 7.0]),
      pitch:   0,
      bearing: 0,
    };
  }
  // A2 — Phosphate Khouribga : Orbit+Dolly → Pull Back Reveal → Drift respiratoire
  if (frame < F.A3_START) {
    const lf = frame - F.A2_START;
    // Phase A (lf 0→239) : Orbit + Dolly lent sur Khouribga
    if (lf < 240) {
      const t = clamp01(lf / 240);
      const e = easeInOut(t);
      return {
        lon:     LOC.khouribga[0],
        lat:     LOC.khouribga[1],
        zoom:    interpolate(e, [0, 1], [9.5, 9.8]),
        pitch:   interpolate(e, [0, 1], [20, 30]),
        bearing: interpolate(e, [0, 1], [-12, 12]),
      };
    }
    // Phase B (lf 240→479) : Pull Back Reveal — dézoom LENT Khouribga → vue Maroc+Europe
    // Fix Gemini : 4s -> 8s (240f) pour un mouvement fluide, pas de saut
    if (lf < 480) {
      const t = clamp01((lf - 240) / 240);
      const e = easeInOut(t);
      return {
        lon:     interpolate(e, [0, 1], [LOC.khouribga[0], -5.0]),
        lat:     interpolate(e, [0, 1], [LOC.khouribga[1], 38.0]),
        zoom:    interpolate(e, [0, 1], [9.8, 3.5]),
        pitch:   interpolate(e, [0, 1], [30, 0]),
        bearing: interpolate(e, [0, 1], [12, 0]),
      };
    }
    // Phase C (lf 480→fin) : Drift respiratoire AMPLIFIE — fix R1 (jamais statique)
    const t = clamp01((lf - 480) / (F.A3_START - F.A2_START - 480));
    const e = easeInOut(t);
    return {
      lon:     interpolate(e, [0, 1], [-5.0, -3.4]),   // drift lon plus ample
      lat:     interpolate(e, [0, 1], [38.0, 37.4]),    // + drift lat
      zoom:    interpolate(e, [0, 1], [3.5, 3.9]),       // + dolly continu
      pitch:   0,
      bearing: interpolate(e, [0, 1], [0, -4]),          // léger bearing pour la vie
    };
  }
  // A3-A6 : à coder en session suivante selon le plan visuel validé par acte
  return { lon: LOC.kenitra[0], lat: LOC.kenitra[1], zoom: 7.0, pitch: 0, bearing: 0 };
}

// ── pushCanvas ────────────────────────────────────────────────────────────────
function pushCanvas(map: mapboxgl.Map, id: string, canvas: HTMLCanvasElement) {
  if (!canvas || canvas.width === 0) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  try {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data as unknown as Uint8Array;
    if (!map.hasImage(id)) map.addImage(id, { width: canvas.width, height: canvas.height, data });
    else map.updateImage(id, { width: canvas.width, height: canvas.height, data });
  } catch {}
}

// ── Drapeau Maroc animé (canvas ondulant) ────────────────────────────────────
function drawMarocFlag(canvas: HTMLCanvasElement, phase: number, opacity: number) {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  ctx.globalAlpha = opacity;

  for (let x = 0; x < w; x++) {
    const waveY = Math.sin((x / w) * Math.PI * 3 + phase) * h * 0.06;
    ctx.fillStyle = "#c1272d";
    ctx.fillRect(x, waveY, 1, h - Math.abs(waveY) * 2);
  }
  // Étoile verte à 5 branches
  const cx = w / 2; const cy = h / 2 + Math.sin(phase) * h * 0.02;
  const R = Math.min(w, h) * 0.28; const r = R * 0.38;
  ctx.fillStyle = "#006233";
  ctx.strokeStyle = "#006233";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const ao = (i * 72 - 90) * Math.PI / 180;
    const ai = ((i * 72 + 36) - 90) * Math.PI / 180;
    const ox = cx + Math.cos(ao) * R; const oy = cy + Math.sin(ao) * R;
    const ix = cx + Math.cos(ai) * r; const iy = cy + Math.sin(ai) * r;
    i === 0 ? ctx.moveTo(ox, oy) : ctx.lineTo(ox, oy);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
}

// ── Karaoké ───────────────────────────────────────────────────────────────────
function buildPhrases(words: WordTs[], startS: number, endS: number) {
  const filtered = words.filter(w => w[1] >= startS - 0.1 && w[2] <= endS + 0.3);
  const phrases: { words: WordTs[]; start: number; end: number }[] = [];
  let current: WordTs[] = [];
  for (let i = 0; i < filtered.length; i++) {
    current.push(filtered[i]);
    const next = filtered[i + 1];
    const gap = next ? next[1] - filtered[i][2] : 999;
    if (gap > 0.4 || current.length >= 6 || !next) {
      phrases.push({ words: [...current], start: current[0][1], end: current[current.length - 1][2] });
      current = [];
    }
  }
  return phrases;
}

const KaraokeSubtitles: React.FC<{ startS: number; endS: number }> = ({ startS, endS }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentS = frame / fps;
  const phrases = buildPhrases(MAROC_WORDS, startS, endS);
  const hard = ["2px 2px 0 #000","-2px -2px 0 #000","2px -2px 0 #000","-2px 2px 0 #000","0 0 8px rgba(0,0,0,0.9)"].join(",");
  const glow = [`0 0 16px rgba(200,169,81,0.8)`,"2px 2px 0 #000","-2px -2px 0 #000"].join(",");

  return (
    <div style={{ position:"absolute", bottom:100, left:0, right:0, display:"flex", justifyContent:"center" }}>
      {phrases.map((phrase, i) => {
        const localF = frame - Math.round((phrase.start - startS) * fps);
        const nextStart = phrases[i + 1]?.start ?? endS;
        const dispF = Math.round((nextStart - phrase.start) * fps) + 5;
        if (localF < 0 || localF > dispF) return null;
        const fadeIn  = spring({ frame: localF, fps, config: { damping: 35, stiffness: 130 } });
        const fadeOut = interpolate(localF, [dispF - 6, dispF + 2], [1, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
        return (
          <div key={i} style={{ position:"absolute", left:0, right:0, opacity:Math.min(fadeIn, fadeOut), textAlign:"center", padding:"0 48px" }}>
            <div style={{ display:"inline-block", background:"linear-gradient(180deg,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.65) 100%)", padding:"14px 24px", borderRadius:12, backdropFilter:"blur(2px)" }}>
              <p style={{ fontFamily:"'Anton', sans-serif", fontSize:52, fontWeight:400, margin:0, lineHeight:1.15, letterSpacing:"0.02em", textTransform:"uppercase", wordBreak:"break-word" }}>
                {phrase.words.map((w, j) => (
                  <span key={j} style={{ color: currentS >= w[1] ? C.gold : "#fff", textShadow: currentS >= w[1] ? glow : hard, marginRight:10, display:"inline-block" }}>
                    {w[0]}
                  </span>
                ))}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Composant principal ───────────────────────────────────────────────────────
export const MarocBatteriesShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerRef   = useRef<HTMLDivElement>(null);
  const mapRef         = useRef<mapboxgl.Map | null>(null);
  const delayHandleRef = useRef<number | null>(null);
  const markerRef      = useRef<mapboxgl.Marker | null>(null);
  const khouribgaMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const canvasesRef    = useRef<Record<string, HTMLCanvasElement>>({});
  const setupRef       = useRef(false);

  function getCanvas(key: string, w = 128, h = 128): HTMLCanvasElement {
    if (!canvasesRef.current[key]) {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      canvasesRef.current[key] = c;
    }
    return canvasesRef.current[key];
  }

  // ── Init Map ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const handle = delayRender("MarocShort Mapbox", { timeoutInMilliseconds: 45000 });
    delayHandleRef.current = handle;
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: LOC.atlantique, zoom: 4.5, pitch: 0, bearing: 0,
      interactive: false, attributionControl: false, fadeDuration: 0,
      projection: { name: "mercator" } as unknown as mapboxgl.MapboxOptions["projection"],
    });
    map.on("style.load", () => {
      try { applyGeoAfriqueV5(map); } catch {}
      setMapReady(true);
      continueRender(handle);
      delayHandleRef.current = null;
    });
    mapRef.current = map;
    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      khouribgaMarkerRef.current?.remove();
      khouribgaMarkerRef.current = null;
      map.remove(); mapRef.current = null;
      setupRef.current = false;
      if (delayHandleRef.current !== null) {
        continueRender(delayHandleRef.current);
        delayHandleRef.current = null;
      }
    };
  }, []);

  // ── Engine principal ────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const cam = getCam(frame);
    map.jumpTo({ center: [cam.lon, cam.lat], zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing });

    const phase = (frame / fps) * 1.5;

    // Setup layers une seule fois
    if (!setupRef.current) {
      try {
        // Source pays vectorielle
        if (!map.getSource("cb")) {
          map.addSource("cb", { type:"vector", url:"mapbox://mapbox.country-boundaries-v1" });
        }
        // Drapeau Maroc — tile 48x32px dessiné en canvas (étoiles minuscules, rouge dominant)
        // Taille choisie pour que les étoiles soient quasi-invisibles à zoom 4-7
        {
          const TW = 48; const TH = 32;
          const fc = document.createElement("canvas");
          fc.width = TW; fc.height = TH;
          canvasesRef.current["mar-flag-static"] = fc;
          const ctx = fc.getContext("2d")!;
          ctx.fillStyle = "#c1272d";
          ctx.fillRect(0, 0, TW, TH);
          ctx.fillStyle = "#006233";
          ctx.beginPath();
          const cx = TW / 2; const cy = TH / 2;
          const R = 7; const r = 3;
          for (let i = 0; i < 5; i++) {
            const ao = (i * 72 - 90) * Math.PI / 180;
            const ai = ((i * 72 + 36) - 90) * Math.PI / 180;
            i === 0
              ? ctx.moveTo(cx + Math.cos(ao) * R, cy + Math.sin(ao) * R)
              : ctx.lineTo(cx + Math.cos(ao) * R, cy + Math.sin(ao) * R);
            ctx.lineTo(cx + Math.cos(ai) * r, cy + Math.sin(ai) * r);
          }
          ctx.closePath();
          ctx.fill();
          pushCanvas(map, "img-mar-flag", fc);
          if (!map.getLayer("mar-flag-fill")) {
            map.addLayer({
              id: "mar-flag-fill", type: "fill", source: "cb",
              "source-layer": "country_boundaries",
              filter: ["==", ["get", "iso_3166_1_alpha_3"], "MAR"],
              paint: { "fill-pattern": "img-mar-flag", "fill-opacity": 0 },
            });
          }
        }

        // Marker DOM KÉNITRA — suit les coordonnées géo, ne drift pas
        if (!markerRef.current) {
          const el = document.createElement("div");
          el.style.cssText = `
            display: flex; align-items: stretch; height: 48px;
            opacity: 0; transition: none; pointer-events: none;
          `;
          el.id = "kenitra-marker-el";
          // Barre gold + plaque navy
          // Barre gold
          const bar = document.createElement("div");
          bar.style.cssText = "width:4px;background:#c08820;border-radius:2px;flex-shrink:0";
          // Plaque navy
          const plate = document.createElement("div");
          plate.style.cssText = "background:#0d1525;padding:0 14px;display:flex;align-items:center;";
          const label = document.createElement("span");
          label.style.cssText = "font-family:'IBM Plex Mono',monospace;font-size:18px;font-weight:700;color:#fff;letter-spacing:0.08em;white-space:nowrap;";
          label.textContent = "KÉNITRA";
          plate.appendChild(label);
          // Flèche SVG
          const arrowWrap = document.createElement("div");
          arrowWrap.style.cssText = "display:flex;align-items:center;padding-left:6px;";
          const ns = "http://www.w3.org/2000/svg";
          const svg = document.createElementNS(ns, "svg");
          svg.setAttribute("width", "32"); svg.setAttribute("height", "16");
          svg.style.overflow = "visible";
          const defs = document.createElementNS(ns, "defs");
          const mkr = document.createElementNS(ns, "marker");
          mkr.setAttribute("id", "mk-arr"); mkr.setAttribute("markerWidth", "5");
          mkr.setAttribute("markerHeight", "5"); mkr.setAttribute("refX", "2.5");
          mkr.setAttribute("refY", "2.5"); mkr.setAttribute("orient", "auto");
          const poly = document.createElementNS(ns, "polygon");
          poly.setAttribute("points", "0 0,5 2.5,0 5"); poly.setAttribute("fill", "#c08820");
          mkr.appendChild(poly); defs.appendChild(mkr); svg.appendChild(defs);
          const line = document.createElementNS(ns, "line");
          line.setAttribute("x1", "0"); line.setAttribute("y1", "8");
          line.setAttribute("x2", "28"); line.setAttribute("y2", "8");
          line.setAttribute("stroke", "#c08820"); line.setAttribute("stroke-width", "2");
          line.setAttribute("marker-end", "url(#mk-arr)");
          svg.appendChild(line); arrowWrap.appendChild(svg);
          el.appendChild(bar); el.appendChild(plate); el.appendChild(arrowWrap);
          const marker = new mapboxgl.Marker({
            element: el,
            anchor: "right", // ancré à droite → la flèche pointe vers le dot à droite
            offset: [-16, 0],
          })
            .setLngLat(LOC.kenitra)
            .addTo(map);
          markerRef.current = marker;
        }

        // Dot Kénitra UNIQUEMENT — plus grand, pulse visible
        if (!map.getSource("kenitra-src")) {
          map.addSource("kenitra-src", { type:"geojson", data:{ type:"Feature", geometry:{ type:"Point", coordinates:LOC.kenitra }, properties:{} } });
          // Halo pulse externe — 3 anneaux
          map.addLayer({ id:"kenitra-halo", type:"circle", source:"kenitra-src",
            paint:{"circle-radius":30,"circle-color":"transparent","circle-stroke-width":2,"circle-stroke-color":C.accent,"circle-stroke-opacity":0} });
          // Dot central plus grand
          map.addLayer({ id:"kenitra-dot", type:"circle", source:"kenitra-src",
            paint:{"circle-radius":14,"circle-color":C.accent,"circle-stroke-width":3,"circle-stroke-color":C.gold} });
        }
        // Ligne dasharray Détroit — NOUVEAUTÉ 1 (transcontinentale hook)
        if (!map.getSource("detroit-line")) {
          map.addSource("detroit-line", { type:"geojson", data:{
            type:"Feature", geometry:{ type:"LineString",
              coordinates:[LOC.tanger, LOC.algeciras] }, properties:{} } });
          map.addLayer({ id:"detroit-dasharray", type:"line", source:"detroit-line",
            paint:{ "line-color":C.gold, "line-width":3, "line-dasharray":[6,4], "line-opacity":0 } });
        }

        // ── A2 — Dot pulse Khouribga (mine = territoire, halo large) ──
        if (!map.getSource("khouribga-src")) {
          map.addSource("khouribga-src", { type:"geojson", data:{ type:"Feature", geometry:{ type:"Point", coordinates:LOC.khouribga }, properties:{} } });
          map.addLayer({ id:"khouribga-halo", type:"circle", source:"khouribga-src",
            paint:{"circle-radius":40,"circle-color":"transparent","circle-stroke-width":2,"circle-stroke-color":C.accent,"circle-stroke-opacity":0} });
          map.addLayer({ id:"khouribga-dot", type:"circle", source:"khouribga-src",
            paint:{"circle-radius":16,"circle-color":C.accent,"circle-stroke-width":3,"circle-stroke-color":C.gold,"circle-opacity":0,"circle-stroke-opacity":0} });
        }

        // ── A2 — Ligne dasharray Khouribga→Kénitra (phosphate brut qui voyage) ──
        if (!map.getSource("phosphate-line")) {
          map.addSource("phosphate-line", { type:"geojson", data:{
            type:"Feature", geometry:{ type:"LineString",
              coordinates:[LOC.khouribga, LOC.kenitra] }, properties:{} } });
          map.addLayer({ id:"phosphate-dasharray", type:"line", source:"phosphate-line",
            paint:{ "line-color":C.gold, "line-width":3.5, "line-dasharray":[6,4], "line-opacity":0 } });
        }

        // ── A2 — Frontières admin fines ivory — habille l'espace vide (réf Johnny Harris) ──
        if (!map.getLayer("admin-fines")) {
          map.addLayer({
            id: "admin-fines", type: "line", source: "cb",
            "source-layer": "country_boundaries",
            paint: { "line-color": C.ivory, "line-width": 0.6, "line-opacity": 0 },
          });
        }

        // ── A2 — Highlight Maroc (fill gold semi-transparent) — fix anti-gris (réf Géo Globe-Trotter) ──
        // Maintenu pendant le pull back pour éviter l'océan de gris en vue large
        if (!map.getLayer("maroc-highlight")) {
          map.addLayer({
            id: "maroc-highlight", type: "fill", source: "cb",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], "MAR"],
            paint: { "fill-color": C.gold, "fill-opacity": 0 },
          });
        }

        // ── A2 — Zone bassin minier Khouribga (cercle large texturé) — fix anti-gris (réf Vox) ──
        if (!map.getSource("mine-zone-src")) {
          map.addSource("mine-zone-src", { type:"geojson", data:{ type:"Feature", geometry:{ type:"Point", coordinates:LOC.khouribga }, properties:{} } });
          // Zone large remplie semi-transparente (le bassin)
          map.addLayer({ id:"mine-zone-fill", type:"circle", source:"mine-zone-src",
            paint:{
              "circle-radius": ["interpolate",["linear"],["zoom"], 7, 60, 10, 180],
              "circle-color": C.accent,
              "circle-opacity": 0,
              "circle-blur": 0.6,
            } }, "khouribga-halo");
        }

        // ── A2 — Marker DOM KHOURIBGA ──
        if (!khouribgaMarkerRef.current) {
          const el = document.createElement("div");
          el.style.cssText = "display:flex;align-items:center;height:40px;opacity:0;pointer-events:none;";
          const bar = document.createElement("div");
          bar.style.cssText = "width:4px;height:100%;background:#c08820;border-radius:2px;flex-shrink:0";
          const plate = document.createElement("div");
          plate.style.cssText = "background:#0d1525;padding:0 12px;height:100%;display:flex;align-items:center;";
          const label = document.createElement("span");
          label.style.cssText = "font-family:'IBM Plex Mono',monospace;font-size:16px;font-weight:700;color:#fff;letter-spacing:0.08em;white-space:nowrap;";
          label.textContent = "KHOURIBGA";
          plate.appendChild(label);
          el.appendChild(bar); el.appendChild(plate);
          const marker = new mapboxgl.Marker({ element: el, anchor: "left", offset: [18, 0] })
            .setLngLat(LOC.khouribga).addTo(map);
          khouribgaMarkerRef.current = marker;
        }

        setupRef.current = true;
      } catch {}
    }

    // ── A1 : drapeau Maroc statique + ligne Détroit ──
    const marFlagOp = interpolate(frame,
      [80, 140, F.A2_START - 20, F.A2_START],
      [0, 0.15, 0.15, 0],
      { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
    try { map.setPaintProperty("mar-flag-fill", "fill-opacity", marFlagOp); } catch {}

    const detroitOp = interpolate(frame,
      [80, 140, F.A2_START - 20, F.A2_START],
      [0, 1, 1, 0],
      { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
    try { map.setPaintProperty("detroit-dasharray", "line-opacity", detroitOp); } catch {}

    // Dasharray animé sur la ligne Détroit
    if (frame > 80 && map.getLayer("detroit-dasharray")) {
      const offset = (frame * 0.4) % 10;
      try { map.setPaintProperty("detroit-dasharray", "line-dasharray", [6 - offset * 0.3, 4 + offset * 0.3]); } catch {}
    }

    // ── Marker KÉNITRA — apparaît à f110, suit les coordonnées géo ──
    const markerEl = markerRef.current?.getElement();
    if (markerEl) {
      const op = interpolate(frame, [110, 125, F.A2_START - 10, F.A2_START],
        [0, 1, 1, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
      markerEl.style.opacity = String(op);
    }

    // ── Dot Kénitra pulse — visible dès f30, cycle 80f, halo large ──
    if (frame >= 30 && map.getLayer("kenitra-halo")) {
      const cycle = ((frame - 30) % 80) / 80;
      const haloR  = interpolate(cycle, [0, 1], [16, 45]);
      const haloOp = interpolate(cycle, [0, 0.2, 1], [0.9, 0.5, 0]);
      try {
        map.setPaintProperty("kenitra-halo", "circle-radius", haloR);
        map.setPaintProperty("kenitra-halo", "circle-stroke-opacity", haloOp);
      } catch {}
    }

    // ═══════════════════════════════════════════════════════════════════════
    // A2 — Phosphate (Khouribga)
    // ═══════════════════════════════════════════════════════════════════════
    const inA2 = frame >= F.A2_START && frame < F.A3_START;
    const lf2 = frame - F.A2_START;

    // Dot Khouribga — apparaît dès le début A2, pulse pendant les phases A+B (vue serrée)
    if (map.getLayer("khouribga-dot")) {
      // visible uniquement quand la mine est à l'écran (zoom serré) — fade out au pull back
      const dotOp = inA2
        ? interpolate(lf2, [0, 20, 240, 320], [0, 1, 1, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" })
        : 0;
      try {
        map.setPaintProperty("khouribga-dot", "circle-opacity", dotOp);
        map.setPaintProperty("khouribga-dot", "circle-stroke-opacity", dotOp);
        // Pulsation du dot (réf Géo Globe-Trotter — le point d'intérêt respire)
        const pulse = inA2 ? 16 + Math.sin(lf2 / 12) * 3 : 16;
        map.setPaintProperty("khouribga-dot", "circle-radius", pulse);
      } catch {}
      if (inA2 && lf2 >= 0 && map.getLayer("khouribga-halo")) {
        const cycle = (lf2 % 80) / 80;
        const haloR  = interpolate(cycle, [0, 1], [18, 50]);
        const haloOp = interpolate(cycle, [0, 0.2, 1], [0.9, 0.5, 0]) * dotOp;
        try {
          map.setPaintProperty("khouribga-halo", "circle-radius", haloR);
          map.setPaintProperty("khouribga-halo", "circle-stroke-opacity", haloOp);
        } catch {}
      }
    }

    // Marker KHOURIBGA — apparaît f30 local, disparaît au pull back
    const khEl = khouribgaMarkerRef.current?.getElement();
    if (khEl) {
      // Disparaît AVANT le pull back (lf240) pour éviter collision avec KÉNITRA en vue large
      const op = inA2
        ? interpolate(lf2, [30, 50, 215, 235], [0, 1, 1, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" })
        : 0;
      khEl.style.opacity = String(op);
    }

    // Ligne dasharray Khouribga→Kénitra — se dessine en phase A, reste visible
    if (map.getLayer("phosphate-dasharray")) {
      const lineOp = inA2
        ? interpolate(lf2, [60, 100, 240, 320], [0, 0.9, 0.9, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" })
        : 0;
      try { map.setPaintProperty("phosphate-dasharray", "line-opacity", lineOp); } catch {}
      if (inA2 && lf2 > 60) {
        const offset = (lf2 * 0.4) % 10;
        try { map.setPaintProperty("phosphate-dasharray", "line-dasharray", [6 - offset * 0.3, 4 + offset * 0.3]); } catch {}
      }
    }

    // Ligne Détroit — démarre dès le pull back (lf360) pour guider le regard vers l'Europe (réf Géo Globe-Trotter)
    if (map.getLayer("detroit-dasharray") && inA2) {
      const detC = interpolate(lf2, [360, 420, F.A3_START - F.A2_START - 20, F.A3_START - F.A2_START],
        [0, 1, 1, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
      try { map.setPaintProperty("detroit-dasharray", "line-opacity", detC); } catch {}
      // Animation dash-offset continue (flux vivant)
      if (lf2 > 360) {
        const offset = (lf2 * 0.4) % 10;
        try { map.setPaintProperty("detroit-dasharray", "line-dasharray", [6 - offset * 0.3, 4 + offset * 0.3]); } catch {}
      }
    }

    // Zone bassin minier — visible phases serrées, fade au pull back (fix anti-gris Vox)
    if (map.getLayer("mine-zone-fill")) {
      const zoneOp = inA2
        ? interpolate(lf2, [0, 30, 240, 360], [0, 0.22, 0.22, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" })
        : 0;
      try { map.setPaintProperty("mine-zone-fill", "circle-opacity", zoneOp); } catch {}
    }

    // Highlight Maroc — fill-color gold FRANC (jamais le pattern drapeau), monte au pull back, maintenu vue large
    if (map.getLayer("maroc-highlight")) {
      const hlOp = inA2
        ? interpolate(lf2, [240, 360, F.A3_START - F.A2_START - 30, F.A3_START - F.A2_START],
            [0, 0.14, 0.14, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" })
        : 0;
      try { map.setPaintProperty("maroc-highlight", "fill-opacity", hlOp); } catch {}
    }
    // Fix critique : forcer le pattern drapeau A1 à 0 pendant tout A2 (évite texture "boueuse")
    if (inA2 && map.getLayer("mar-flag-fill")) {
      try { map.setPaintProperty("mar-flag-fill", "fill-opacity", 0); } catch {}
    }
    // Frontières admin fines — apparaissent au pull back, habillent l'espace vide en vue large
    if (map.getLayer("admin-fines")) {
      const adminOp = inA2
        ? interpolate(lf2, [240, 360, F.A3_START - F.A2_START - 20, F.A3_START - F.A2_START],
            [0, 0.18, 0.18, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" })
        : 0;
      try { map.setPaintProperty("admin-fines", "line-opacity", adminOp); } catch {}
    }

    // Fix collision : masquer le marker KÉNITRA (de A1) pendant tout A2
    const kenEl = markerRef.current?.getElement();
    if (kenEl && inA2) {
      kenEl.style.opacity = "0";
    }

  });

  // ── Overlays CSS ────────────────────────────────────────────────────────────
  const volNarr  = interpolate(frame, [0, 10, F.END - 20, F.END], [0,1,1,0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
  const volMusic = interpolate(frame, [0, 30, F.END - 40, F.END], [0,0.07,0.07,0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });

  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <Audio src={staticFile("souverain/maroc-batteries/audio/narration-maroc-v3.mp3")} volume={volNarr} />
      <Audio src={staticFile("souverain/maroc-batteries/audio/music-C-analytique-tendu.mp3")} volume={volMusic} />
      <MapboxBrandingHide />

      <div ref={containerRef} style={{ position:"absolute", inset:0, backgroundColor:C.navy }} />

      {/* Vignette lisibilité — légère, ne pas masquer la carte */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(22,33,58,0.35) 0%,rgba(22,33,58,0.0) 40%,rgba(22,33,58,0.25) 100%)", pointerEvents:"none" }} />

      <ShortOverlays frame={frame} fps={fps} />

      {/* Karaoké par acte */}
      {frame < F.A2_START && <KaraokeSubtitles startS={0.14} endS={8.28} />}
      {frame >= F.A2_START && frame < F.A3_START && <KaraokeSubtitles startS={9.4} endS={30.8} />}
    </AbsoluteFill>
  );
};

// ── ShortOverlays — textes par acte ──────────────────────────────────────────
const ShortOverlays: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const sp = (f: number, delay = 0) =>
    spring({ frame: Math.max(0, f - delay), fps, config: { damping: 18 }, durationInFrames: 30 });

  // A1 — Hook : SFX uniquement, la plaque est un DOM Marker qui suit la carte
  if (frame < F.A2_START) {
    return (
      <>
        {/* SFX ping quand dot pulse démarre */}
        {frame === 32 && <Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} startFrom={0} volume={0.5} />}
        {/* SFX plate-pop quand marker KÉNITRA apparaît */}
        {frame === 112 && <Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} startFrom={0} volume={0.6} />}
        {/* SFX swoosh-zoomin au début du zoom */}
        {frame === 5 && <Audio src={staticFile("_shared/sfx/camera/sfx-swoosh-zoomin.mp3")} startFrom={0} volume={0.35} />}
      </>
    );
  }

  // ── A2 — Phosphate : stat 70% géante + SFX ──
  if (frame < F.A3_START) {
    const lf = frame - F.A2_START;
    // Stat 70% — fade-in à lf120 (après settle orbit), fade-out juste avant le pull back (lf240)
    const statSp = sp(lf, 120);
    const statOp = interpolate(lf, [120, 140, 215, 240], [0, 1, 1, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
    return (
      <>
        {/* SFX — timing recalé sur le nouveau pull back (lf240) + ping vue large (lf480) */}
        {frame === F.A2_START + 0   && <Audio src={staticFile("_shared/sfx/camera/sfx-swoosh-zoomin.mp3")} startFrom={0} volume={0.35} />}
        {frame === F.A2_START + 120 && <Audio src={staticFile("_shared/sfx/data/stat-tick.mp3")} startFrom={0} volume={0.30} />}
        {frame === F.A2_START + 240 && <Audio src={staticFile("_shared/sfx/camera/sfx-swoosh-pullback.mp3")} startFrom={0} volume={0.45} />}
        {frame === F.A2_START + 480 && <Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} startFrom={0} volume={0.40} />}

        {/* Stat 70% — intégrée (réf Vox) : tiers supérieur, taille mesurée, glow gold, scale-up continu */}
        <div style={{
          position:"absolute", top:240, left:0, right:0, textAlign:"center",
          opacity:statOp,
          transform:`translateY(${(1 - statSp) * 18}px) scale(${interpolate(lf, [120, 240], [0.96, 1.04], { extrapolateLeft:"clamp", extrapolateRight:"clamp" })})`,
          pointerEvents:"none",
        }}>
          <p style={{
            fontFamily:"'Anton', sans-serif", fontSize:128, lineHeight:0.9, margin:0,
            color:C.gold, letterSpacing:"-0.01em",
            textShadow:`0 0 28px rgba(200,169,81,0.45), 0 4px 18px rgba(0,0,0,0.6)`,
          }}>70%</p>
          <p style={{
            fontFamily:"'IBM Plex Mono', monospace", fontSize:21, fontWeight:600, margin:"6px 0 0",
            color:C.ivory, letterSpacing:"0.12em", textTransform:"uppercase",
            textShadow:"0 2px 10px rgba(0,0,0,0.8)",
          }}>réserves mondiales de phosphate</p>
        </div>
      </>
    );
  }

  // A3-A6 : non codés — à construire acte par acte en session suivante
  return null;
};
