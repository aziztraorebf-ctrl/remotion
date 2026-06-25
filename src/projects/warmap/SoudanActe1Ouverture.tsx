/**
 * SoudanActe1Ouverture — MINI-RENDER DE VALIDATION (beat ouverture Acte 1, ~12s).
 *
 * But : valider le pipeline War-Map Soudan de bout en bout sur le beat signature :
 *   carte Soudan parchemin -> Darfour s'allume (l'or) -> jeton-visage Hemeti s'ancre +
 *   ses forces RSF (sprites top-down) -> contour national draw-in -> dezoom vers le pays entier.
 *
 * Architecture : composition DEDIEE (doctrine WARMAP-GRAMMAIRE §7 "composition isolee d'abord"),
 * batie sur les patterns valides de HookMapBackground (1 Map frame-driven, jumpTo, applyParchment,
 * projection lon/lat->ecran). Pas de reutilisation du lourd WarMapEngine (couple aux donnees ACLED).
 *
 * Grammaire appliquee :
 *   - D-7 "on nomme -> ca se dessine" : Darfour s'allume, contour Soudan se trace, jeton s'ancre.
 *   - CAUSE avant EFFET : le jeton Hemeti se pose AVANT que ses forces RSF apparaissent.
 *   - Jeton = cercle parchemin + bordure faction + portrait clippe (jamais buste nu).
 *   - Taille sprite ancree carte (spriteMapWidth en degres) -> ne grossit pas au dezoom.
 *   - Pitch 0 (sprites top-down nets), camera serree->dezoom narratif.
 *
 * ⚠️ Asset jeton = portrait-rsf.png (GENERIQUE) pour la VALIDATION du pipeline. Le vrai jeton-visage
 *    Hemeti est a generer en PRODUCTION (Gemini, recette War-Map). Ici on valide la mecanique.
 *
 * Audio : narration fact-checkee Acte 1 (out/_r-and-d, place dans public pour le render).
 * Render via scripts/render-mapbox.sh (WebGL headless).
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide } from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const SOUDAN_A1_FPS = 30;
export const SOUDAN_A1_DURATION = 12 * SOUDAN_A1_FPS; // 360 frames = 12s

// ── Palette parchemin War-Map (source SAHEL_COLORS / HookMapBackground) ──
const PARCHMENT = { land: "#F5EFD6", ocean: "#C8D9E0", ink: "#3A2A18" } as const;
const RSF_RED = "#B14B3C"; // rouge brique faction RSF
const GOLD = "#C9A24B"; // l'or du Darfour

// ── Coordonnees (centroides geojson sudan-states) ──
const SUDAN_CENTER: [number, number] = [30.2, 15.0];
const NORTH_DARFUR: [number, number] = [25.51, 15.92]; // ancrage Hemeti + or
const GEOJSON = "_shared/geo-data/sudan/sudan-states.geojson";
const OUTLINE = "_shared/geo-data/sudan/sudan-outline.geojson"; // enveloppe nationale dissoute

// etats Darfour (zone RSF a teinter en rouge leger)
const DARFUR_STATES = [
  "North Darfur", "Western Darfur", "Central Darfur",
  "Southern Darfur", "Eastern Darfur",
];

// ── Trajectoire camera : serre sur le Darfour -> dezoom vers le Soudan entier ──
// (narratif : on part de l'homme/l'or, on revele le pays). easeInOut entre keyframes.
const CAM_KEYS = [
  { f: 0, lon: 25.8, lat: 15.6, zoom: 5.2 },     // serre sur Nord-Darfour
  { f: 90, lon: 26.5, lat: 15.6, zoom: 5.0 },    // leger pan (drift, jamais fige)
  { f: 200, lon: 29.5, lat: 15.2, zoom: 4.4 },   // commence a s'ouvrir
  { f: 330, lon: 30.2, lat: 15.0, zoom: 4.0 },   // Soudan entier visible
];

// sprites RSF top-down : positions (lon,lat) autour du Darfour = les forces de Hemeti
const RSF_FORCES: { lon: number; lat: number; appear: number }[] = [
  { lon: 24.4, lat: 14.5, appear: 110 },  // Sud-Darfour
  { lon: 26.5, lat: 16.8, appear: 130 },  // Nord-Est Darfour
  { lon: 23.4, lat: 13.6, appear: 150 },  // Ouest
];
const SPRITE_MAP_WIDTH = 1.15; // largeur sprite en DEGRES (ancree carte, ne grossit pas au dezoom)

// timings narratifs (synchro audio approx : "contrôlait les mines d'or du Darfour" ~0-3s,
// "Hemeti" ~3-5s, "il fait la guerre / gagner" ~6-9s, "regarder une carte" ~9-12s)
const F_GOLD = 12;      // Darfour s'allume (l'or)
const F_HEMETI = 70;    // jeton Hemeti s'ancre
const F_BORDER = 175;   // contour national Soudan se trace
const F_FORCES = 110;   // forces RSF commencent

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

export const SoudanActe1Ouverture: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("SoudanA1 init"));
  const [ready, setReady] = useState(false);
  const projRef = useRef<((c: [number, number]) => { x: number; y: number }) | null>(null);
  const [, force] = useState(0);

  // ── init Map ──
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM_KEYS[0].lon, CAM_KEYS[0].lat],
      zoom: CAM_KEYS[0].zoom,
      pitch: 0, bearing: 0,
      interactive: false, attributionControl: false,
      preserveDrawingBuffer: true, fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", async () => {
      try { (map as any).setProjection?.("mercator"); } catch {}
      // reskin parchemin
      const layers = map.getStyle().layers ?? [];
      for (const l of layers) {
        if (l.type === "symbol") map.setLayoutProperty(l.id, "visibility", "none");
        if (l.id.includes("water") && l.type === "fill") {
          try { map.setPaintProperty(l.id, "fill-color", PARCHMENT.ocean); } catch {}
        }
        if (l.id === "land" || l.id.includes("landuse") || l.id.includes("landcover") ||
            l.id === "background" || l.id.includes("national-park")) {
          try { map.setPaintProperty(l.id, "background-color", PARCHMENT.land); } catch {}
          try { map.setPaintProperty(l.id, "fill-color", PARCHMENT.land); } catch {}
        }
        if (l.id.includes("admin-0")) { try { map.setPaintProperty(l.id, "line-color", PARCHMENT.ink); } catch {} }
        if (l.id.includes("admin-1")) { try { map.setPaintProperty(l.id, "line-color", "rgba(58,42,24,0.18)"); } catch {} }
      }
      if (map.getLayer("background")) {
        try { map.setPaintProperty("background", "background-color", PARCHMENT.land); } catch {}
      }

      // charger geojson Soudan (etats)
      try {
        const res = await fetch(staticFile(GEOJSON));
        const fc = await res.json();
        map.addSource("sudan", { type: "geojson", data: fc });

        // 1. teinte OR du Darfour (s'allume au F_GOLD) — fill sur les 5 etats Darfour
        map.addLayer({
          id: "sudan-darfur-gold", type: "fill", source: "sudan",
          filter: ["in", ["get", "name"], ["literal", DARFUR_STATES]],
          paint: { "fill-color": GOLD, "fill-opacity": 0 },
        });
        // 2. teinte ROUGE RSF du Darfour (par-dessus l'or, monte avec les forces)
        map.addLayer({
          id: "sudan-darfur-rsf", type: "fill", source: "sudan",
          filter: ["in", ["get", "name"], ["literal", DARFUR_STATES]],
          paint: { "fill-color": RSF_RED, "fill-opacity": 0 },
        });
        // 3. liseres internes des etats (discrets)
        map.addLayer({
          id: "sudan-states-line", type: "line", source: "sudan",
          paint: { "line-color": "rgba(58,42,24,0.20)", "line-width": 1 },
        });
        // 4. CONTOUR NATIONAL epais dissous (enveloppe nationale propre, se revele au F_BORDER)
        const resO = await fetch(staticFile(OUTLINE));
        const fcO = await resO.json();
        map.addSource("sudan-outline", { type: "geojson", data: fcO });
        // glow large sous le trait (halo)
        map.addLayer({
          id: "sudan-border-glow", type: "line", source: "sudan-outline",
          paint: { "line-color": GOLD, "line-width": 9, "line-opacity": 0, "line-blur": 4 },
        });
        map.addLayer({
          id: "sudan-border", type: "line", source: "sudan-outline",
          paint: { "line-color": PARCHMENT.ink, "line-width": 4.2, "line-opacity": 0 },
        });
        setReady(true);
      } catch (e) {
        console.warn("[SoudanA1] geojson skipped:", e);
        setReady(true);
      }
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── frame-driven : camera + allumages ──
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    // camera (interpolation easeInOut entre keyframes)
    const ks = CAM_KEYS;
    let a = ks[0], b = ks[ks.length - 1], t = 1;
    if (frame <= ks[0].f) { a = b = ks[0]; t = 0; }
    else if (frame >= ks[ks.length - 1].f) { a = b = ks[ks.length - 1]; t = 0; }
    else {
      for (let i = 0; i < ks.length - 1; i++) {
        if (frame >= ks[i].f && frame < ks[i + 1].f) {
          a = ks[i]; b = ks[i + 1]; t = (frame - a.f) / (b.f - a.f || 1); break;
        }
      }
    }
    const e = easeInOut(t);
    map.jumpTo({
      center: [a.lon + (b.lon - a.lon) * e, a.lat + (b.lat - a.lat) * e],
      zoom: a.zoom + (b.zoom - a.zoom) * e,
      bearing: 0, pitch: 0,
    });

    // allumage OR Darfour (F_GOLD -> +20f) + RESPIRATION vivante (pulse sin, D-0 anti-fige)
    const goldBase = interpolate(frame - F_GOLD, [0, 20], [0, 0.50], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const goldPulse = frame > F_GOLD ? 0.10 * Math.abs(Math.sin((frame - F_GOLD) / 14)) : 0;
    try { map.setPaintProperty("sudan-darfur-gold", "fill-opacity", goldBase + goldPulse); } catch {}

    // teinte RSF rouge monte avec les forces (F_FORCES -> +40f)
    const rsfOp = interpolate(frame - F_FORCES, [0, 40], [0, 0.40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    try { map.setPaintProperty("sudan-darfur-rsf", "fill-opacity", rsfOp); } catch {}

    // contour national se revele (trait + glow or qui pulse brievement au trace)
    const borderOp = interpolate(frame - F_BORDER, [0, 26], [0, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    try { map.setPaintProperty("sudan-border", "line-opacity", borderOp); } catch {}
    const glowOp = interpolate(frame - F_BORDER, [0, 18, 50], [0, 0.55, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    try { map.setPaintProperty("sudan-border-glow", "line-opacity", glowOp); } catch {}

    // remonter la projection au render des overlays
    projRef.current = (c) => { const p = map.project(c); return { x: p.x, y: p.y }; };
    force((n) => (n + 1) % 1000);
  }, [frame, ready]);

  const project = projRef.current;

  // taille ecran d'un sprite ancre carte : projeter 2 points distants de SPRITE_MAP_WIDTH degres
  const spritePx = (() => {
    if (!project) return 110;
    const p1 = project([NORTH_DARFUR[0], NORTH_DARFUR[1]]);
    const p2 = project([NORTH_DARFUR[0] + SPRITE_MAP_WIDTH, NORTH_DARFUR[1]]);
    return Math.max(70, Math.abs(p2.x - p1.x));
  })();

  // jeton Hemeti : pop spring a F_HEMETI. Taille = element narratif (UI), rayon plancher genereux
  // pour rester LISIBLE meme au dezoom (le jeton-acteur n'est pas un objet-au-sol comme les chars).
  const hemetiPop = spring({ frame: frame - F_HEMETI, fps, config: { damping: 13, stiffness: 150 }, durationInFrames: 22 });
  const hemetiPos = project ? project(NORTH_DARFUR) : null;
  const chipR = Math.max(58, spritePx * 0.78) * Math.min(1, hemetiPop * 1.12);
  // pulse d'arrivee (anneau qui s'expanse une fois)
  const hemetiPulse = frame >= F_HEMETI ? Math.max(0, 1 - (frame - F_HEMETI) / 26) : 0;

  // fade-in global premium
  const introOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: PARCHMENT.land, opacity: introOp }}>
      {/* audio narration fact-checkee */}
      <Audio src={staticFile("_shared/audio/soudan/acte1-factcheck.mp3")} />

      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {/* couche sprites + jeton (SVG + Img ancres a la projection) */}
      {project && (
        <>
          {/* forces RSF top-down (sprites), derriere le jeton */}
          {RSF_FORCES.map((f, i) => {
            const pop = spring({ frame: frame - f.appear, fps, config: { damping: 14, stiffness: 130 }, durationInFrames: 20 });
            if (pop <= 0.01) return null;
            const p = project([f.lon, f.lat]);
            const sz = Math.max(54, spritePx * 1.05) * Math.min(1, pop * 1.1);
            return (
              <Img key={i} src={staticFile("_shared/sprites/warmap/tech-td-red.png")}
                style={{
                  position: "absolute", left: p.x, top: p.y,
                  width: sz, height: sz, transform: "translate(-50%,-50%)",
                  opacity: Math.min(1, pop * 1.2),
                  filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.4))",
                }} />
            );
          })}

          {/* jeton-visage Hemeti (cercle parchemin + bordure RSF + portrait clippe + ancrage) */}
          {hemetiPos && hemetiPop > 0.01 && (
            <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <defs>
                <clipPath id="hemeti-clip">
                  <circle cx={hemetiPos.x} cy={hemetiPos.y - chipR - 8} r={chipR} />
                </clipPath>
                <filter id="hemeti-shadow" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.45" />
                </filter>
              </defs>
              {/* anneau de pulse a l'arrivee (vie) */}
              {hemetiPulse > 0 && (
                <circle cx={hemetiPos.x} cy={hemetiPos.y - chipR - 8}
                  r={chipR * (1 + (1 - hemetiPulse) * 0.7)} fill="none"
                  stroke={RSF_RED} strokeWidth={3} opacity={hemetiPulse * 0.7} />
              )}
              {/* point d'ancrage au sol (Darfour) */}
              <circle cx={hemetiPos.x} cy={hemetiPos.y} r={5} fill={PARCHMENT.ink} />
              {/* tige ancre -> jeton */}
              <line x1={hemetiPos.x} y1={hemetiPos.y} x2={hemetiPos.x} y2={hemetiPos.y - chipR - 8 + chipR}
                stroke={PARCHMENT.ink} strokeWidth={2.5} opacity={0.7} />
              {/* fond parchemin du jeton (ombre portee) */}
              <circle cx={hemetiPos.x} cy={hemetiPos.y - chipR - 8} r={chipR + 4}
                fill={PARCHMENT.land} filter="url(#hemeti-shadow)" />
              {/* portrait clippe */}
              <image href={staticFile("_shared/sprites/warmap/portrait-rsf.png")}
                x={hemetiPos.x - chipR} y={hemetiPos.y - chipR - 8 - chipR}
                width={chipR * 2} height={chipR * 2}
                clipPath="url(#hemeti-clip)" preserveAspectRatio="xMidYMid slice" />
              {/* bordure faction RSF */}
              <circle cx={hemetiPos.x} cy={hemetiPos.y - chipR - 8} r={chipR}
                fill="none" stroke={RSF_RED} strokeWidth={4} />
              {/* plaque label */}
              {hemetiPop > 0.7 && (
                <g transform={`translate(${hemetiPos.x},${hemetiPos.y - chipR - 8 + chipR + 18})`} opacity={interpolate(hemetiPop, [0.7, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                  <rect x={-56} y={-13} width={112} height={26} rx={4} fill={PARCHMENT.ink} opacity={0.94} />
                  <text x={0} y={1} textAnchor="middle" dominantBaseline="central" fontSize={17}
                    fontWeight={700} fill="#F4ECD8" style={{ fontFamily: "Georgia, serif" }}>HEMETI</text>
                </g>
              )}
            </svg>
          )}
        </>
      )}

      {/* grain premium leger */}
      <AbsoluteFill style={{
        background: "radial-gradient(circle at 50% 50%, transparent 60%, rgba(58,42,24,0.10) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

export default SoudanActe1Ouverture;
