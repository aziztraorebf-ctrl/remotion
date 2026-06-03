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
  type CamState,
} from "./MapboxBase";

// ─────────────────────────────────────────────────────────────────────────────
// MapboxCameraLab v2 — Catalogue mouvements caméra Mapbox
//
// 12 scènes × 10s = 360f par scène = 3600f @ 30fps = 2 min
// NOUVEAUTES v2 :
//   - Projection Mercator forcée (plus de globe)
//   - S9  : Zoom sol 3D (Nairobi satellite-streets, pitch 70°, zoom 15)
//   - S10 : Fade style switch (Lagos, dark → satellite, fade CSS 20f)
//   - S11 : Whip pan + style switch au pic blur (Casablanca → Accra)
//   - S12 : Zoom out + style switch + zoom in (Dakar)
//
// SCÈNES :
//  S1  f0    → f360   Dakar           DRIFT CONTINU
//  S2  f360  → f720   Marrakech       ORBIT + DOLLY IN
//  S3  f720  → f1080  Lagos→Nairobi   MULTI-STOP + WHIP PAN
//  S4  f1080 → f1440  Agadez          ZOOM RAPIDE + FREEZE
//  S5  f1440 → f1800  Kinshasa        TILT + PULL BACK
//  S6  f1800 → f2160  Johannesburg    COUNTER-ROTATION + ORBIT
//  S7  f2160 → f2520  Alger           DRIFT LENT + BLUR ATMOSPHÈRE
//  S8  f2520 → f2880  Afrique         PULL BACK RÉVÈLE PLANÉTAIRE
//  S9  f2880 → f3240  Nairobi         ZOOM SOL 3D (satellite-streets)
//  S10 f3240 → f3600  Lagos           FADE STYLE SWITCH (dark→satellite)
//  S11 f3600 → f3960  Casablanca→Accra WHIP PAN + STYLE SWITCH
//  S12 f3960 → f4320  Dakar           ZOOM OUT → STYLE → ZOOM IN
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// ── Durée par scène ───────────────────────────────────────────────────────────
const SPF = 360; // frames per scene (10s @ 30fps... wait, 10s = 300f not 360)
// Correction: 10s @ 30fps = 300f. Utiliser 300f.
const SCENE_DUR = 300;
const TOTAL_SCENES = 12;

// ── Frontières de scène ───────────────────────────────────────────────────────
const S = Array.from({ length: TOTAL_SCENES + 1 }, (_, i) => i * SCENE_DUR);
// S[0]=0, S[1]=300, S[2]=600, ..., S[12]=3600

// ── Coordonnées MCP-vérifiées ─────────────────────────────────────────────────
const LOC = {
  dakar:         [-17.457, 14.712] as [number, number],
  marrakech:     [-7.988,  31.627] as [number, number],
  casablanca:    [-7.589,  33.573] as [number, number],
  lagos:         [3.390,   6.454] as [number, number],
  accra:         [-0.187,  5.603] as [number, number],
  nairobi:       [36.817, -1.289] as [number, number],
  agadez:        [7.991,  16.973] as [number, number],
  kinshasa:      [15.313, -4.322] as [number, number],
  johannesburg:  [28.042, -26.205] as [number, number],
  algiers:       [3.059,  36.773] as [number, number],
  africaCenter:  [20.0,    5.0] as [number, number],
};

// ── Easing ────────────────────────────────────────────────────────────────────
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }

// ── Blur whip pan ─────────────────────────────────────────────────────────────
function whipBlur(f: number, start: number, dur = 60): number {
  if (f < start || f >= start + dur) return 0;
  const t = (f - start) / dur;
  return t < 0.5
    ? interpolate(t, [0, 0.5], [0, 14])
    : interpolate(t, [0.5, 1], [14, 0]);
}

// ── Style requis par scène ────────────────────────────────────────────────────
// "dark" = dark-v11 + GéoAfrique V5
// "satellite" = satellite-v9 brut
// "streets" = satellite-streets-v12 (zoom sol avec labels)
type SceneStyle = "dark" | "satellite" | "streets";

function getSceneStyle(frame: number): SceneStyle {
  const si = Math.floor(frame / SCENE_DUR);
  // S9 (idx 8) = streets, S10 après fade (idx 9 phase 2) = satellite,
  // S11 après whip (idx 10 phase 2) = satellite, S12 après zoom out (idx 11 phase 2) = satellite
  if (si === 8) return "streets";
  if (si === 9) {
    const tLocal = (frame - S[9]) / SCENE_DUR;
    return tLocal > 0.4 ? "satellite" : "dark";
  }
  if (si === 10) {
    const tLocal = (frame - S[10]) / SCENE_DUR;
    return tLocal > 0.5 ? "satellite" : "dark";
  }
  if (si === 11) {
    const tLocal = (frame - S[11]) / SCENE_DUR;
    return tLocal > 0.4 ? "satellite" : "dark";
  }
  return "dark";
}

function styleUrl(s: SceneStyle): string {
  if (s === "satellite") return MAPBOX_STYLES.satellite;
  if (s === "streets")   return "mapbox://styles/mapbox/satellite-streets-v12";
  return MAPBOX_STYLES.dark;
}

// ── Calcul caméra par frame ───────────────────────────────────────────────────
function getCam(frame: number): CamState & { blur: number } {

  // S1 — DRIFT CONTINU (Dakar)
  if (frame < S[1]) {
    const t = frame / S[1];
    return {
      lon:     LOC.dakar[0] + Math.sin(t * Math.PI * 0.4) * 0.08,
      lat:     LOC.dakar[1] + t * 0.05,
      zoom:    5.8,
      pitch:   25,
      bearing: t * 12,
      blur:    0,
    };
  }

  // S2 — ORBIT + DOLLY IN (Marrakech)
  if (frame < S[2]) {
    const t = clamp01((frame - S[1]) / SCENE_DUR);
    const e = easeInOutCubic(t);
    return {
      lon:     LOC.marrakech[0],
      lat:     LOC.marrakech[1],
      zoom:    interpolate(e, [0, 1], [4.5, 6.2]),
      pitch:   interpolate(e, [0, 1], [0, 50]),
      bearing: interpolate(e, [0, 1], [0, -180]),
      blur:    0,
    };
  }

  // S3 — MULTI-STOP A→B (Lagos → Nairobi)
  if (frame < S[3]) {
    const whipStart = S[2] + Math.round(SCENE_DUR * 0.40);
    const whipEnd   = S[2] + Math.round(SCENE_DUR * 0.60);
    const blur = whipBlur(frame, whipStart, whipEnd - whipStart);

    if (frame < whipStart) {
      const tL = clamp01((frame - S[2]) / (whipStart - S[2]));
      const e = easeInOutCubic(tL);
      return { lon: LOC.lagos[0], lat: LOC.lagos[1],
               zoom: interpolate(e, [0, 1], [3.5, 5.2]), pitch: 20, bearing: 0, blur: 0 };
    }
    if (frame < whipEnd) {
      const tL = clamp01((frame - whipStart) / (whipEnd - whipStart));
      const e = easeInOutCubic(tL);
      return {
        lon:     interpolate(e, [0, 1], [LOC.lagos[0], LOC.nairobi[0]]),
        lat:     interpolate(e, [0, 1], [LOC.lagos[1], LOC.nairobi[1]]),
        zoom:    interpolate(e, [0, 0.5, 1], [5.2, 3.0, 5.0]),
        pitch:   20,
        bearing: interpolate(e, [0, 1], [0, 45]),
        blur,
      };
    }
    const tL = clamp01((frame - whipEnd) / (S[3] - whipEnd));
    const e = easeInOutCubic(tL);
    return { lon: LOC.nairobi[0], lat: LOC.nairobi[1],
             zoom: interpolate(e, [0, 1], [5.0, 5.8]),
             pitch: interpolate(e, [0, 1], [20, 35]), bearing: 45, blur: 0 };
  }

  // S4 — ZOOM RAPIDE + FREEZE (Agadez) — zoom cap 5.8 (headless safe)
  if (frame < S[4]) {
    const zoomEnd = S[3] + Math.round(SCENE_DUR * 0.30);
    if (frame < zoomEnd) {
      const tL = clamp01((frame - S[3]) / (zoomEnd - S[3]));
      const e = easeInOutCubic(tL);
      return { lon: LOC.agadez[0], lat: LOC.agadez[1],
               zoom: interpolate(e, [0, 1], [3.2, 5.8]), pitch: 0, bearing: 0, blur: 0 };
    }
    const tL = clamp01((frame - zoomEnd) / (S[4] - zoomEnd));
    return { lon: LOC.agadez[0], lat: LOC.agadez[1],
             zoom: 5.8, pitch: 0, bearing: tL * 2.5, blur: 0 };
  }

  // S5 — TILT + PULL BACK (Kinshasa)
  if (frame < S[5]) {
    const tiltEnd = S[4] + Math.round(SCENE_DUR * 0.60);
    const pullEnd = S[4] + Math.round(SCENE_DUR * 0.80);
    if (frame < tiltEnd) {
      const tL = clamp01((frame - S[4]) / (tiltEnd - S[4]));
      const e = easeInOutCubic(tL);
      return { lon: LOC.kinshasa[0], lat: LOC.kinshasa[1],
               zoom: 5.5, pitch: interpolate(e, [0, 1], [0, 60]), bearing: 0, blur: 0 };
    }
    if (frame < pullEnd) {
      const tL = clamp01((frame - tiltEnd) / (pullEnd - tiltEnd));
      const e = easeInOutCubic(tL);
      const blur = whipBlur(frame, tiltEnd, pullEnd - tiltEnd);
      return { lon: LOC.kinshasa[0], lat: LOC.kinshasa[1],
               zoom: interpolate(e, [0, 1], [5.5, 3.0]),
               pitch: interpolate(e, [0, 1], [60, 15]), bearing: 0, blur };
    }
    const tL = clamp01((frame - pullEnd) / (S[5] - pullEnd));
    const e = easeInOutCubic(tL);
    return { lon: LOC.kinshasa[0], lat: LOC.kinshasa[1],
             zoom: interpolate(e, [0, 1], [3.0, 3.5]),
             pitch: interpolate(e, [0, 1], [15, 0]), bearing: 0, blur: 0 };
  }

  // S6 — COUNTER-ROTATION + ORBIT (Johannesburg)
  if (frame < S[6]) {
    const t = clamp01((frame - S[5]) / SCENE_DUR);
    const mid = 0.5;
    if (t < mid) {
      const e = easeInOutCubic(clamp01(t / mid));
      return { lon: LOC.johannesburg[0], lat: LOC.johannesburg[1],
               zoom: interpolate(e, [0, 1], [4.0, 5.2]),
               pitch: 40, bearing: interpolate(e, [0, 1], [0, -45]), blur: 0 };
    }
    const e = easeInOutCubic(clamp01((t - mid) / (1 - mid)));
    return { lon: LOC.johannesburg[0], lat: LOC.johannesburg[1],
             zoom: interpolate(e, [0, 1], [5.2, 5.6]),
             pitch: interpolate(e, [0, 1], [40, 20]),
             bearing: interpolate(e, [0, 1], [-45, 35]), blur: 0 };
  }

  // S7 — DRIFT LENT + BLUR ATMOSPHÈRE (Alger)
  if (frame < S[7]) {
    const t = clamp01((frame - S[6]) / SCENE_DUR);
    return {
      lon:     LOC.algiers[0] + Math.sin(t * Math.PI) * 0.04,
      lat:     LOC.algiers[1] + t * 0.03,
      zoom:    interpolate(t, [0, 1], [4.5, 5.0]),
      pitch:   interpolate(t, [0, 1], [15, 30]),
      bearing: interpolate(t, [0, 1], [0, 8]),
      blur:    1.5,
    };
  }

  // S8 — PULL BACK REVEAL PLANÉTAIRE (Afrique entière)
  if (frame < S[8]) {
    const pullActive = S[7] + 60;
    if (frame < pullActive) {
      const tL = clamp01((frame - S[7]) / 60);
      const e = easeInOutCubic(tL);
      return {
        lon: LOC.africaCenter[0], lat: LOC.africaCenter[1],
        zoom: interpolate(e, [0, 1], [5.5, 2.8]),
        pitch: interpolate(e, [0, 1], [30, 0]),
        bearing: interpolate(e, [0, 1], [20, 0]),
        blur: whipBlur(frame, S[7], 60),
      };
    }
    const tS = clamp01((frame - pullActive) / (S[8] - pullActive));
    const e = easeInOutCubic(tS);
    return { lon: LOC.africaCenter[0], lat: LOC.africaCenter[1],
             zoom: interpolate(e, [0, 1], [2.8, 4.2]),
             pitch: 0, bearing: interpolate(e, [0, 1], [0, 3]), blur: 0 };
  }

  // S9 — ZOOM SOL 3D (Nairobi, satellite-streets)
  // Phase 1 (0→60%): zoom 4→14, pitch 0→70° — on "atterrit"
  // Phase 2 (60→100%): drift lent à zoom 14 pour voir les rues
  if (frame < S[9]) {
    const landEnd = S[8] + Math.round(SCENE_DUR * 0.60);
    if (frame < landEnd) {
      const tL = clamp01((frame - S[8]) / (landEnd - S[8]));
      const e = easeInOutCubic(tL);
      return {
        lon:     LOC.nairobi[0],
        lat:     LOC.nairobi[1],
        zoom:    interpolate(e, [0, 1], [4.0, 14.0]),
        pitch:   interpolate(e, [0, 1], [0, 65]),
        bearing: interpolate(e, [0, 1], [0, 25]),
        blur:    0,
      };
    }
    const tL = clamp01((frame - landEnd) / (S[9] - landEnd));
    return {
      lon:     LOC.nairobi[0] + tL * 0.002,
      lat:     LOC.nairobi[1],
      zoom:    14.0,
      pitch:   65,
      bearing: 25 + tL * 5,
      blur:    0,
    };
  }

  // S10 — FADE STYLE SWITCH (Lagos, dark → satellite)
  // Phase 1 (0→30%): pose sur Lagos, dark
  // Transition (30→50%): fade out (opacity piloté via fadeOpacity)
  // Phase 2 (50→100%): satellite, fade in, pose finale
  if (frame < S[10]) {
    const t = clamp01((frame - S[9]) / SCENE_DUR);
    if (t < 0.35) {
      const e = easeInOutCubic(clamp01(t / 0.35));
      return { lon: LOC.lagos[0], lat: LOC.lagos[1],
               zoom: interpolate(e, [0, 1], [3.5, 5.5]),
               pitch: 20, bearing: 0, blur: 0 };
    }
    return { lon: LOC.lagos[0], lat: LOC.lagos[1],
             zoom: 5.5, pitch: 20, bearing: 0, blur: 0 };
  }

  // S11 — WHIP PAN + STYLE SWITCH (Casablanca → Accra)
  // Transition au pic du blur — style switch invisible dans le flou
  if (frame < S[11]) {
    const whipStart = S[10] + Math.round(SCENE_DUR * 0.35);
    const whipEnd   = S[10] + Math.round(SCENE_DUR * 0.65);
    const blur = whipBlur(frame, whipStart, whipEnd - whipStart);

    if (frame < whipStart) {
      const tL = clamp01((frame - S[10]) / (whipStart - S[10]));
      const e = easeInOutCubic(tL);
      return { lon: LOC.casablanca[0], lat: LOC.casablanca[1],
               zoom: interpolate(e, [0, 1], [3.5, 5.5]), pitch: 15, bearing: 0, blur: 0 };
    }
    if (frame < whipEnd) {
      const tL = clamp01((frame - whipStart) / (whipEnd - whipStart));
      const e = easeInOutCubic(tL);
      return {
        lon:     interpolate(e, [0, 1], [LOC.casablanca[0], LOC.accra[0]]),
        lat:     interpolate(e, [0, 1], [LOC.casablanca[1], LOC.accra[1]]),
        zoom:    interpolate(e, [0, 0.5, 1], [5.5, 3.2, 5.2]),
        pitch:   15, bearing: interpolate(e, [0, 1], [0, -30]), blur,
      };
    }
    const tL = clamp01((frame - whipEnd) / (S[11] - whipEnd));
    const e = easeInOutCubic(tL);
    return { lon: LOC.accra[0], lat: LOC.accra[1],
             zoom: interpolate(e, [0, 1], [5.2, 6.0]),
             pitch: interpolate(e, [0, 1], [15, 35]), bearing: -30, blur: 0 };
  }

  // S12 — ZOOM OUT → STYLE SWITCH → ZOOM IN (Dakar)
  // Phase 1 (0→35%): zoom in 5→3 (pull back vers Afrique de l'Ouest)
  // Transition (35→50%): zoom out max 3→2 + blur (style switch au pic)
  // Phase 2 (50→100%): zoom in satellite 2→6, redolly sur côte
  if (frame < S[12]) {
    const outEnd  = S[11] + Math.round(SCENE_DUR * 0.35);
    const midEnd  = S[11] + Math.round(SCENE_DUR * 0.50);

    if (frame < outEnd) {
      const tL = clamp01((frame - S[11]) / (outEnd - S[11]));
      const e = easeInOutCubic(tL);
      return { lon: LOC.dakar[0], lat: LOC.dakar[1],
               zoom: interpolate(e, [0, 1], [5.5, 3.0]),
               pitch: 0, bearing: 0, blur: 0 };
    }
    if (frame < midEnd) {
      const tL = clamp01((frame - outEnd) / (midEnd - outEnd));
      const e = easeInOutCubic(tL);
      const blur = interpolate(e, [0, 0.5, 1], [0, 10, 0]);
      return { lon: LOC.dakar[0], lat: LOC.africaCenter[1],
               zoom: interpolate(e, [0, 0.5, 1], [3.0, 2.2, 2.8]),
               pitch: 0, bearing: 0, blur };
    }
    const tL = clamp01((frame - midEnd) / (S[12] - midEnd));
    const e = easeInOutCubic(tL);
    return { lon: LOC.dakar[0], lat: LOC.dakar[1],
             zoom: interpolate(e, [0, 1], [2.8, 6.5]),
             pitch: interpolate(e, [0, 1], [0, 40]),
             bearing: interpolate(e, [0, 1], [0, -15]), blur: 0 };
  }

  // Fallback
  return { lon: LOC.africaCenter[0], lat: LOC.africaCenter[1],
           zoom: 2.3, pitch: 0, bearing: 0, blur: 0 };
}

// ── Opacité map pour fade style switch ────────────────────────────────────────
function getMapOpacity(frame: number): number {
  // S10 : fade out f9→f10 mid, fade in après
  if (frame >= S[9] && frame < S[10]) {
    const t = (frame - S[9]) / SCENE_DUR;
    if (t >= 0.30 && t < 0.40) return interpolate(t, [0.30, 0.40], [1, 0]);
    if (t >= 0.40 && t < 0.50) return 0; // style swap happening
    if (t >= 0.50 && t < 0.60) return interpolate(t, [0.50, 0.60], [0, 1]);
    return 1;
  }
  // S12 : fade autour du mid (style swap)
  if (frame >= S[11] && frame < S[12]) {
    const outEnd = S[11] + Math.round(SCENE_DUR * 0.35);
    const midEnd = S[11] + Math.round(SCENE_DUR * 0.50);
    if (frame >= outEnd && frame < outEnd + 15)
      return interpolate(frame, [outEnd, outEnd + 15], [1, 0]);
    if (frame >= outEnd + 15 && frame < midEnd - 15)
      return 0;
    if (frame >= midEnd - 15 && frame < midEnd)
      return interpolate(frame, [midEnd - 15, midEnd], [0, 1]);
    return 1;
  }
  return 1;
}

// ── Labels de scène ────────────────────────────────────────────────────────────
const SCENE_LABELS = [
  { start: S[0],  name: "Dakar",              technique: "DRIFT CONTINU" },
  { start: S[1],  name: "Marrakech",          technique: "ORBIT + DOLLY IN" },
  { start: S[2],  name: "Lagos → Nairobi",    technique: "MULTI-STOP + WHIP PAN" },
  { start: S[3],  name: "Agadez Sahara",      technique: "ZOOM RAPIDE + FREEZE" },
  { start: S[4],  name: "Kinshasa",           technique: "TILT + PULL BACK" },
  { start: S[5],  name: "Johannesburg",       technique: "COUNTER-ROTATION + ORBIT" },
  { start: S[6],  name: "Alger",              technique: "DRIFT LENT + BLUR ATMO" },
  { start: S[7],  name: "Afrique",            technique: "PULL BACK PLANÉTAIRE" },
  { start: S[8],  name: "Nairobi",            technique: "ZOOM SOL 3D" },
  { start: S[9],  name: "Lagos",              technique: "FADE STYLE SWITCH" },
  { start: S[10], name: "Casablanca → Accra", technique: "WHIP PAN + STYLE SWITCH" },
  { start: S[11], name: "Dakar",              technique: "ZOOM OUT → STYLE → ZOOM IN" },
];

// ── Composant principal ────────────────────────────────────────────────────────
export const MapboxCameraLab: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const currentStyleRef = useRef<SceneStyle>("dark");
  const styleLoadingRef = useRef(false);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container:            containerRef.current,
      style:                MAPBOX_STYLES.dark,
      center:               LOC.dakar,
      zoom:                 5.8,
      pitch:                25,
      bearing:              0,
      interactive:          false,
      preserveDrawingBuffer: true,
      antialias:            true,
    });

    // Forcer Mercator — supprime le rendu globe de Mapbox GL JS v3
    map.on("style.load", () => {
      try { (map as mapboxgl.Map & { setProjection?: (p: string) => void }).setProjection?.("mercator"); } catch {}
      applyGeoAfriqueV5(map);
      setReady(true);
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Camera engine
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const map = mapRef.current;
    const cam = getCam(frame);
    const targetStyle = getSceneStyle(frame);

    // Style switch si nécessaire
    if (targetStyle !== currentStyleRef.current && !styleLoadingRef.current) {
      currentStyleRef.current = targetStyle;
      styleLoadingRef.current = true;
      map.setStyle(styleUrl(targetStyle));
      map.once("style.load", () => {
        try { (map as mapboxgl.Map & { setProjection?: (p: string) => void }).setProjection?.("mercator"); } catch {}
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
  });

  const cam = getCam(frame);
  const opacity = getMapOpacity(frame);

  const currentScene = [...SCENE_LABELS]
    .reverse()
    .find((s) => frame >= s.start) ?? SCENE_LABELS[0];
  const sceneIdx = SCENE_LABELS.findIndex((s) => s.start === currentScene.start);
  const sceneFrame = frame - currentScene.start;
  const sceneSec = (sceneFrame / fps).toFixed(1);
  const sceneStyle = getSceneStyle(frame);

  return (
    <AbsoluteFill style={{ background: "#0d1520" }}>
      <MapboxBrandingHide />

      {/* Carte Mapbox avec blur + fade opacity */}
      <AbsoluteFill style={{
        filter:  cam.blur > 0 ? `blur(${cam.blur}px)` : undefined,
        opacity,
      }}>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>

      {/* HUD — coin supérieur gauche */}
      <div style={{
        position: "absolute", top: 40, left: 48,
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "#c8a951",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "#0d1520",
          }}>
            {sceneIdx + 1}
          </div>
          <div style={{
            fontFamily: "monospace", fontSize: 22, fontWeight: 700,
            color: "#f2ebd9", letterSpacing: 1,
          }}>
            {currentScene.name}
          </div>
        </div>
        <div style={{
          fontFamily: "monospace", fontSize: 13, color: "#c8a951",
          letterSpacing: 2, textTransform: "uppercase", paddingLeft: 48,
        }}>
          {currentScene.technique}
        </div>
        {/* Badge style actif */}
        <div style={{
          paddingLeft: 48, fontFamily: "monospace", fontSize: 11,
          color: sceneStyle === "dark" ? "rgba(200,169,81,0.5)" : "#a3d2e6",
          letterSpacing: 1, textTransform: "uppercase",
        }}>
          {sceneStyle === "dark" ? "dark-v11 + GéoAfrique V5"
           : sceneStyle === "satellite" ? "satellite-v9"
           : "satellite-streets-v12"}
        </div>
      </div>

      {/* HUD — coin inférieur droit — paramètres caméra live */}
      <div style={{
        position: "absolute", bottom: 40, right: 48,
        fontFamily: "monospace", fontSize: 12,
        color: "rgba(200,169,81,0.7)", lineHeight: 1.8, textAlign: "right",
      }}>
        <div>zoom  {cam.zoom.toFixed(2)}</div>
        <div>pitch {cam.pitch.toFixed(1)}</div>
        <div>bear  {cam.bearing.toFixed(1)}</div>
        <div>lon   {cam.lon.toFixed(3)}</div>
        <div>lat   {cam.lat.toFixed(3)}</div>
        {cam.blur > 0 && <div style={{ color: "#a3d2e6" }}>blur  {cam.blur.toFixed(1)}px</div>}
        {opacity < 0.99 && <div style={{ color: "#e67a7a" }}>fade  {opacity.toFixed(2)}</div>}
      </div>

      {/* Barre progression scène */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 3, background: "rgba(255,255,255,0.08)",
      }}>
        <div style={{
          height: "100%",
          width: `${(sceneFrame / SCENE_DUR) * 100}%`,
          background: "#c8a951",
          transition: "none",
        }} />
      </div>

      {/* Minimap scènes */}
      <div style={{
        position: "absolute", bottom: 20, left: "50%",
        transform: "translateX(-50%)", display: "flex", gap: 5,
      }}>
        {SCENE_LABELS.map((s, i) => (
          <div
            key={i}
            style={{
              width: 18, height: 4, borderRadius: 2,
              background: i === sceneIdx
                ? "#c8a951"
                : frame > s.start
                  ? "rgba(200,169,81,0.4)"
                  : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const MAPBOX_CAMERA_LAB_FRAMES = S[TOTAL_SCENES]; // 3600
