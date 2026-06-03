import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill, Audio, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { SourceTag } from "../../_shared/components/overlays/SourceTag";
import mapboxgl from "mapbox-gl";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "../../_shared/mapbox/MapboxBase";

// SenegalActe2Continu — une seule Map, zéro cut entre Beat6/7/8
// Acte 2 complet : 60.36s → 131.48s narration → 2134 frames @ 30fps
//
// PHASES & MOUVEMENTS :
// Phase A  f0→512    Sangomar  — Crane Down (pitch 0→45°) + Dolly In + Orbit lent
// Trans AB f512→620  — Pull Back Reveal (zoom 7.8→3.6) + Whip Pan nord vers GTA
// Phase B  f620→1671 GTA       — Travelling + Zoom spirale (3.6→3.9) + pitch monte
// Trans BC f1671→760 — Counter-rotation + Pull Back + Whip Pan SO vers Yakaar
// Phase C  f1760→2134 Yakaar   — Tilt 0→50° + Orbit suspendu lent

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD  = "#c8a951";
const CYAN  = "#a3d2e6";
const NAVY  = "#0d1520";

// ── Coordonnées géographiques ─────────────────────────────────
const SANGOMAR:  [number, number] = [-17.15, 13.45];
const GTA:       [number, number] = [-17.30, 16.50];
const YAKAAR:    [number, number] = [-18.00, 14.20];
const EUROPE:    [number, number] = [-9.14,  38.72];
const QATAR:     [number, number] = [51.50,  25.30];

// ── Frontières de phase ───────────────────────────────────────
const F_A_END  = 512;   // fin Phase A (Sangomar)
const F_AB_END = 620;   // fin transition A→B
const F_B_END  = 1671;  // fin Phase B (GTA)
const F_BC_END = 1760;  // fin transition B→C
const F_TOTAL  = 2134;  // fin Phase C (Yakaar)

// ── Anchors narratifs Phase A (Sangomar) ─────────────────────
const FA_DOT      = 0;
const FA_LABEL    = Math.round(6.56 * 30);   // 197f
const FA_WOODSIDE = Math.round(8.70 * 30);   // 261f
const FA_PETROSEN = Math.round(11.60 * 30);  // 348f

// ── Anchors narratifs Phase B (GTA) ──────────────────────────
// Relatifs à f=620 (début Phase B)
const FB_START    = F_AB_END;
const FB_GTA      = FB_START + 0;
const FB_LABEL    = FB_START + 46;
const FB_BP       = FB_START + 152;
const FB_DATE     = FB_START + 291;
const FB_PROD     = FB_START + 406;
const FB_CARGAISON = FB_START + 573;
const FB_FOURNI   = FB_START + 726;
const FB_ARC_EU   = FB_START + 822;
const FB_ARC_EU_END = FB_START + 951;
const FB_ARC_AS   = FB_START + 980;

// ── Anchors narratifs Phase C (Yakaar) ───────────────────────
const FC_START    = F_BC_END;
const FC_SHIFT    = FC_START + 161;
const FC_QUESTION = FC_START + 267;
const FC_ATTEND   = FC_START + 293;
const FC_VIBRATION = FC_START + 413;

// ── Easing cubique in-out pour les transitions ────────────────
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ── Blur CSS pendant les whip pans ────────────────────────────
// Pic à 60f (frame 30 = milieu actif) — le blur se dissipe avant la fin de la fenêtre
function blurAmount(frame: number): number {
  if (frame >= F_A_END && frame < F_AB_END) {
    const mid = F_A_END + 30;
    const clrEnd = F_A_END + 60;
    return interpolate(frame, [F_A_END, mid, clrEnd, F_AB_END],
      [0, 16, 0, 0], { extrapolateRight: "clamp" });
  }
  if (frame >= F_B_END && frame < F_BC_END) {
    const mid = F_B_END + 30;
    const clrEnd = F_B_END + 60;
    return interpolate(frame, [F_B_END, mid, clrEnd, F_BC_END],
      [0, 12, 0, 0], { extrapolateRight: "clamp" });
  }
  return 0;
}

type DotPos = { x: number; y: number };

export const SenegalActe2Continu: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const layersReady  = useRef(false);

  const [gtaDot,     setGtaDot]     = useState<DotPos>({ x: 978, y: 562 });
  const [sangomarDot, setSangomarDot] = useState<DotPos>({ x: 979, y: 600 });
  const [europeDot,  setEuropeDot]  = useState<DotPos>({ x: 1106, y: 432 });
  const [qatarDot,   setQatarDot]   = useState<DotPos>({ x: 1500, y: 520 });
  const [yakaarDot,  setYakaarDot]  = useState<DotPos>({ x: 960, y: 540 });

  // ── Init Map ─────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: SANGOMAR,
      zoom: 7.2,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
    });

    map.on("style.load", () => {
      (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
      applyGeoAfriqueV5(map);

      const safe = (id: string, prop: string, val: unknown) => {
        try {
          if (map.getLayer(id))
            (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)(id, prop, val);
        } catch (_e) {}
      };
      safe("land",         "background-color", "#5a5a5a");
      safe("landuse",      "fill-color",       "#5a5a5a");
      safe("landcover",    "fill-color",       "#545454");
      safe("water",        "fill-color",       "#2a4f72");
      safe("water-shadow", "fill-color",       "#2a4f72");

      // Layer Mauritanie highlight (Phase B)
      try {
        (map as unknown as { addSource: (id: string, src: unknown) => void }).addSource("maur-src", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [[
                [-17.07, 20.85], [-16.85, 19.98], [-16.51, 19.37],
                [-16.27, 16.52], [-13.42, 15.83], [-10.90, 15.14],
                [-10.71, 17.86], [-11.50, 19.30], [-12.28, 20.98],
                [-13.43, 21.53], [-15.65, 21.65], [-17.07, 20.85],
              ]],
            },
          },
        });
        (map as unknown as { addLayer: (layer: unknown) => void }).addLayer({
          id: "maur-fill",
          type: "fill",
          source: "maur-src",
          paint: { "fill-color": GOLD, "fill-opacity": 0 },
        });
        layersReady.current = true;
      } catch (_e) {}
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; layersReady.current = false; };
  }, []);

  // ── Moteur caméra — s'exécute à chaque frame ─────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const f = frame;
    let lon: number, lat: number, zoom: number, bearing: number, pitch: number;

    // ── Phase A : Crane Down + Dolly In + Orbit sur Sangomar ──
    if (f <= F_A_END) {
      // Orbit lent : bearing tourne de 0 à -18° pendant que la caméra plonge
      lon     = interpolate(f, [0, 200, F_A_END], [-17.15, -17.30, -17.55], { extrapolateRight: "clamp" });
      lat     = interpolate(f, [0, F_A_END],       [13.45,  13.25],          { extrapolateRight: "clamp" });
      bearing = interpolate(f, [0, 150, 350, F_A_END], [0, -3, -11, -18],   { extrapolateRight: "clamp" });
      // Crane Down : pitch plat pendant que le dot apparaît (f0→130), puis plonge (130→512)
      pitch   = interpolate(f, [0, 130, 300, F_A_END], [0, 0, 22, 45],      { extrapolateRight: "clamp" });
      zoom    = interpolate(f, [0, 200, F_A_END], [7.2, 7.45, 7.8],         { extrapolateRight: "clamp" });
    }

    // ── Transition A→B : Pull Back Reveal + Whip Pan nord ─────
    // Voyage en 60f (punch) puis settle doux sur 48f
    else if (f <= F_AB_END) {
      const fAB = f - F_A_END;
      const DUR_AB = F_AB_END - F_A_END; // 108f
      // Phase active : 60f de vol pur + easing cubique
      const tActive = Math.min(fAB / 60, 1);
      const ease = easeInOutCubic(tActive);
      // Pull Back Reveal : zoom 7.8→3.6 — l'essentiel visible dès f30
      zoom    = interpolate(ease, [0, 1], [7.8, 3.6],    {});
      // Voyage de Sangomar [-17.55, 13.25] vers la vue large entre les 3 sites
      lon     = interpolate(ease, [0, 1], [-17.55, -18.0], {});
      lat     = interpolate(ease, [0, 1], [13.25,  15.5],  {});
      // Counter-rotate pendant le vol (impression de pivot)
      bearing = interpolate(ease, [0, 1], [-18, -2],     {});
      // Redresse pitch 45→0 pendant le pull-back
      pitch   = interpolate(ease, [0, 1], [45,   0],     {});
      // Settle doux sur les 48f restantes (après f60 : valeurs stables, légère dérive)
      if (fAB > 60) {
        const tSettle = (fAB - 60) / (DUR_AB - 60);
        lon     = interpolate(tSettle, [0, 1], [-18.0, -18.1], {});
        lat     = interpolate(tSettle, [0, 1], [15.5,  15.6],  {});
        zoom    = 3.6;
        bearing = -2;
        pitch   = 0;
      }
    }

    // ── Phase B : Travelling + Zoom spirale sur GTA ────────────
    else if (f <= F_B_END) {
      const fB = f - F_AB_END;
      const DUR_B = F_B_END - F_AB_END; // 1051f

      // Arrive centré vue large, zoome progressivement sur GTA
      lon     = interpolate(fB, [0, 200, 600, DUR_B],
        [-18.0, -17.8, -17.5, -18.8],  { extrapolateRight: "clamp" });
      lat     = interpolate(fB, [0, 200, 600, DUR_B],
        [15.5,  16.2,  16.5,  17.2],   { extrapolateRight: "clamp" });

      // Zoom spirale : rentre doucement sur GTA
      zoom    = interpolate(fB, [0, 300, DUR_B],
        [3.6, 3.75, 3.9],              { extrapolateRight: "clamp" });

      // Bearing : stable pendant les labels (fB 0→200), tourne ensuite
      bearing = interpolate(fB, [0, 200, 600, DUR_B],
        [-2, -4, -14, -22],            { extrapolateRight: "clamp" });

      // Pitch : plat pendant dots/labels, plonge quand arcs apparaissent (fB≈820)
      pitch   = interpolate(fB, [0, 400, 750, DUR_B],
        [0, 0, 18, 35],                { extrapolateRight: "clamp" });
    }

    // ── Transition B→C : Counter-rotation + Pull Back + Whip SO vers Yakaar ──
    // Voyage en 60f (punch) puis settle doux sur les frames restantes
    else if (f <= F_BC_END) {
      const fBC = f - F_B_END;
      const DUR_BC = F_BC_END - F_B_END; // 89f
      const tActive = Math.min(fBC / 60, 1);
      const ease = easeInOutCubic(tActive);
      // Sweep SO vers Yakaar + counter-rotation (pivot visible dès f30)
      zoom    = interpolate(ease, [0, 1], [3.9, 5.8],    {});
      lon     = interpolate(ease, [0, 1], [-18.8, -18.0], {});
      lat     = interpolate(ease, [0, 1], [17.2,  14.2],  {});
      bearing = interpolate(ease, [0, 1], [-22, 8],       {});
      pitch   = interpolate(ease, [0, 1], [35,  0],       {});
      // Settle sur les frames restantes
      if (fBC > 60) {
        const tSettle = (fBC - 60) / (DUR_BC - 60);
        zoom    = interpolate(tSettle, [0, 1], [5.8, 5.9], {});
        lon     = -18.0;
        lat     = 14.2;
        bearing = 8;
        pitch   = 0;
      }
    }

    // ── Phase C : Tilt progressif + Orbit suspendu sur Yakaar ─
    else {
      const fC = f - F_BC_END;
      const DUR_C = F_TOTAL - F_BC_END; // 374f

      // Pan SW lent — dérive vers le large comme si la caméra observe sous l'eau
      lon     = interpolate(fC, [0, DUR_C], [-18.0, -18.9], { extrapolateRight: "clamp" });
      lat     = interpolate(fC, [0, DUR_C], [14.2,  13.7],  { extrapolateRight: "clamp" });

      // Orbit suspendu : bearing tourne dans la direction opposée à la Phase B
      bearing = interpolate(fC, [0, 180, DUR_C], [8, 14, 22], { extrapolateRight: "clamp" });

      // Tilt (Crane Down) : plonge progressivement — atmosphère de stase sous-marine
      pitch   = interpolate(fC, [0, 120, 250, DUR_C], [0, 0, 22, 50], { extrapolateRight: "clamp" });

      // Zoom in sur Yakaar
      zoom    = interpolate(fC, [0, 200, DUR_C], [5.8, 6.1, 6.6], { extrapolateRight: "clamp" });
    }

    map.jumpTo({ center: [lon, lat], zoom, bearing, pitch });

    // Projection dots après jumpTo
    const project = (lngLat: [number, number]): DotPos => {
      const pt = map.project(new mapboxgl.LngLat(lngLat[0], lngLat[1]));
      return { x: Math.round(pt.x), y: Math.round(pt.y) };
    };
    setSangomarDot(project(SANGOMAR));
    setGtaDot(project(GTA));
    setEuropeDot(project(EUROPE));
    setQatarDot(project(QATAR));
    setYakaarDot(project(YAKAAR));

    // Mauritanie opacity — apparaît en Phase B à FB_FOURNI
    if (layersReady.current) {
      const maurOp = interpolate(frame, [FB_FOURNI, FB_FOURNI + 40], [0, 0.22],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      try {
        (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)(
          "maur-fill", "fill-opacity", maurOp
        );
      } catch (_e) {}
    }
  });

  // ── Animations Phase A (Sangomar) ────────────────────────────
  const dotAP = spring({ frame: frame - FA_DOT, fps, config: { damping: 8, stiffness: 350 }, durationInFrames: 25 });
  const dotAScale   = interpolate(dotAP, [0, 1], [0.05, 1], { extrapolateRight: "clamp" });
  const dotAY       = interpolate(dotAP, [0, 1], [30, 0],   { extrapolateRight: "clamp" });
  const dotAOpacity = interpolate(dotAP, [0, 0.08, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const sinePulseA  = Math.sin((frame / 45) * Math.PI * 2);
  const dotAGlow    = interpolate(sinePulseA, [-1, 1], [0.65, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ringsA = [0, 1, 2].map((i) => {
    const localF   = Math.max(0, frame - FA_DOT - i * 30);
    const progress = (localF % 90) / 90;
    return {
      radius:  progress * 160,
      opacity: interpolate(progress, [0, 0.15, 0.7, 1], [0, 0.6, 0.25, 0], { extrapolateRight: "clamp" }) * dotAOpacity,
    };
  });

  const labelAP      = spring({ frame: frame - FA_LABEL, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 20 });
  const labelAOpacity = interpolate(labelAP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelAX      = interpolate(labelAP, [0, 1], [40, 0], { extrapolateRight: "clamp" });

  const woodsideP   = spring({ frame: frame - FA_WOODSIDE, fps, config: { damping: 18, stiffness: 180 }, durationInFrames: 18 });
  const woodsideOp  = interpolate(woodsideP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const woodsideY   = interpolate(woodsideP, [0, 1], [10, 0], { extrapolateRight: "clamp" });

  const petrosenP   = spring({ frame: frame - FA_PETROSEN, fps, config: { damping: 18, stiffness: 180 }, durationInFrames: 18 });
  const petrosenOp  = interpolate(petrosenP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const petrosenY   = interpolate(petrosenP, [0, 1], [8, 0], { extrapolateRight: "clamp" });

  // Fade out Phase A overlays pendant la transition AB
  const phaseAFade = interpolate(frame, [F_A_END - 30, F_A_END + 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Animations Phase B (GTA) ──────────────────────────────────
  const gtaP    = spring({ frame: frame - FB_GTA, fps, config: { damping: 10, stiffness: 300 }, durationInFrames: 20 });
  const gtaScale = interpolate(gtaP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const sinePulseB = Math.sin((frame / 40) * Math.PI * 2);
  const gtaGlow  = interpolate(sinePulseB, [-1, 1], [0.7, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const frontiereP  = spring({ frame: frame - FB_LABEL, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 20 });
  const frontiereOp = interpolate(frontiereP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const frontiereX  = interpolate(frontiereP, [0, 1], [-20, 0], { extrapolateRight: "clamp" });

  const bpP   = spring({ frame: frame - FB_BP, fps, config: { damping: 18, stiffness: 180 }, durationInFrames: 18 });
  const bpOp  = interpolate(bpP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const bpY   = interpolate(bpP, [0, 1], [8, 0], { extrapolateRight: "clamp" });

  const dateP  = spring({ frame: frame - FB_DATE, fps, config: { damping: 18, stiffness: 160 }, durationInFrames: 20 });
  const dateOp = interpolate(dateP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const prodP  = spring({ frame: frame - FB_PROD, fps, config: { damping: 12, stiffness: 280 }, durationInFrames: 18 });
  const prodScale = interpolate(prodP, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });
  const prodOp = interpolate(prodP, [0, 0.1, 1], [0, 1, 1], { extrapolateRight: "clamp" });

  const cargaisonP  = spring({ frame: frame - FB_CARGAISON, fps, config: { damping: 8, stiffness: 400 }, durationInFrames: 12 });
  const cargaisonGlow = interpolate(cargaisonP, [0, 0.3, 1], [0, 1, 0.6], { extrapolateRight: "clamp" });

  const fourniP  = spring({ frame: frame - FB_FOURNI, fps, config: { damping: 18, stiffness: 160 }, durationInFrames: 20 });
  const fourniOp = interpolate(fourniP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const fourniY  = interpolate(fourniP, [0, 1], [12, 0], { extrapolateRight: "clamp" });

  const arcEuProg = interpolate(frame, [FB_ARC_EU, FB_ARC_EU_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arcAsProg = interpolate(frame, [FB_ARC_AS, FB_ARC_AS + 91], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ARC_EU_LEN = 620;
  const ARC_AS_LEN = 900;

  const europeP  = spring({ frame: frame - FB_ARC_EU_END, fps, config: { damping: 12, stiffness: 200 }, durationInFrames: 18 });
  const europeScale = interpolate(europeP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const qatarP   = spring({ frame: frame - (FB_ARC_AS + 91), fps, config: { damping: 12, stiffness: 200 }, durationInFrames: 18 });
  const qatarScale = interpolate(qatarP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Fade out Phase B overlays pendant transition BC
  const phaseBFade = interpolate(frame, [F_B_END - 30, F_B_END + 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phaseAVisible = frame < F_A_END + 60;
  const phaseBVisible = frame >= F_AB_END - 10 && frame < F_B_END + 60;
  const phaseCVisible = frame >= F_BC_END;

  // ── Animations Phase C (Yakaar) ───────────────────────────────
  const dotCP = spring({ frame: frame - FC_START, fps, config: { damping: 10, stiffness: 280 }, durationInFrames: 30 });
  const dotCScale   = interpolate(dotCP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const dotCOpacity = interpolate(dotCP, [0, 0.1, 1], [0, 1, 1], { extrapolateRight: "clamp" });

  const pulsePeriodC = frame >= FC_SHIFT
    ? interpolate(frame, [FC_SHIFT, FC_SHIFT + 120], [45, 90], { extrapolateRight: "clamp" })
    : 30;
  const sinePulseC = Math.sin((frame / pulsePeriodC) * Math.PI * 2);
  const dotCGlow   = interpolate(sinePulseC, [-1, 1], [0.5, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const shiftCP   = spring({ frame: frame - FC_SHIFT, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: 45 });
  const colorMixC = interpolate(shiftCP, [0, 1], [0, 0.35], { extrapolateRight: "clamp" });
  const dotCR = Math.round(163 + (200 - 163) * colorMixC);
  const dotCG = Math.round(210 + (169 - 210) * colorMixC);
  const dotCB = Math.round(230 + (81  - 230) * colorMixC);
  const dotCColor = `rgb(${dotCR},${dotCG},${dotCB})`;

  const ringsC = [0, 1, 2].map((i) => {
    const RING_PERIOD = frame >= FC_SHIFT ? 110 : 70;
    const localF = Math.max(0, frame - FC_START - i * 35);
    const progress = (localF % RING_PERIOD) / RING_PERIOD;
    return {
      radius:  progress * 180,
      opacity: interpolate(progress, [0, 0.12, 0.65, 1], [0, 0.45, 0.18, 0], { extrapolateRight: "clamp" }) * dotCOpacity,
    };
  });

  const questionP  = spring({ frame: frame - FC_QUESTION, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: 26 });
  const questionScale  = interpolate(questionP, [0, 1], [0.6, 1], { extrapolateRight: "clamp" });
  const questionOpacity = interpolate(questionP, [0, 1], [0, 0.45], { extrapolateRight: "clamp" });

  const attendP = spring({ frame: frame - FC_ATTEND, fps, config: { damping: 25, stiffness: 200 }, durationInFrames: 20 });
  const attendOpacity = interpolate(attendP, [0, 1], [0.45, 0.62], { extrapolateRight: "clamp" });
  const finalQuestionOpacity = frame >= FC_ATTEND ? attendOpacity : questionOpacity;

  const vibX = frame >= FC_VIBRATION && frame < FC_VIBRATION + 60
    ? Math.sin((frame - FC_VIBRATION) * 1.8) * 4 * interpolate(frame, [FC_VIBRATION, FC_VIBRATION + 60], [1, 0], { extrapolateRight: "clamp" })
    : 0;
  const vibY = frame >= FC_VIBRATION && frame < FC_VIBRATION + 60
    ? Math.cos((frame - FC_VIBRATION) * 2.3) * 3 * interpolate(frame, [FC_VIBRATION, FC_VIBRATION + 60], [1, 0], { extrapolateRight: "clamp" })
    : 0;

  const labelCP  = spring({ frame: frame - FC_SHIFT, fps, config: { damping: 18, stiffness: 180 }, durationInFrames: 22 });
  const labelCX  = interpolate(labelCP, [0, 1], [30, 0], { extrapolateRight: "clamp" });
  const labelCOp = interpolate(labelCP, [0, 1], [0, 1],  { extrapolateRight: "clamp" });

  const sublabelCP  = spring({ frame: frame - (FC_SHIFT + 25), fps, config: { damping: 18, stiffness: 160 }, durationInFrames: 18 });
  const sublabelCOp = interpolate(sublabelCP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const blur = blurAmount(frame);

  // Positions dot Sangomar relatives (PX, PY fixes en Phase A — map.project() les met à jour)
  const PXa = sangomarDot.x;
  const PYa = sangomarDot.y;
  const PXc = yakaarDot.x;
  const PYc = yakaarDot.y;

  // Point contrôle arc Europe / Qatar
  const euCtrlX = (gtaDot.x + europeDot.x) / 2 - 60;
  const euCtrlY =  gtaDot.y - 280;
  const asCtrlX = (gtaDot.x + qatarDot.x) / 2 + 100;
  const asCtrlY =  gtaDot.y - 60;

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <MapboxBrandingHide />

      {/* Carte — blur pendant whip pans */}
      <div
        ref={containerRef}
        style={{
          position: "absolute", inset: 0, width, height,
          filter: blur > 0 ? `blur(${blur}px)` : "none",
        }}
      />

      {/* Vignette globale */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 52%, rgba(13,21,32,0.4) 100%)",
        pointerEvents: "none",
      }} />

      {/* ════════════════════════════════════════
          SVG — dots, rings, arcs (toutes phases)
          ════════════════════════════════════════ */}
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>

        {/* ── Phase A : Sangomar rings + dot ── */}
        {phaseAVisible && ringsA.map((ring, i) => (
          <circle key={`rA${i}`} cx={PXa} cy={PYa} r={ring.radius}
            stroke={GOLD} strokeWidth={1.5} fill="none"
            opacity={ring.opacity * phaseAFade} />
        ))}
        {phaseAVisible && (
          <>
            <circle cx={PXa} cy={PYa} r={14 * dotAScale} fill={GOLD}
              opacity={dotAGlow * dotAOpacity * phaseAFade}
              style={{ transform: `translateY(${dotAY}px)` }} />
            <circle cx={PXa} cy={PYa} r={28 * dotAScale} fill={GOLD}
              opacity={dotAGlow * 0.18 * dotAOpacity * phaseAFade} />
            <ellipse cx={PXa} cy={PYa - 60 * dotAScale} rx={8 * dotAScale} ry={50 * dotAScale}
              fill={GOLD} opacity={0.12 * dotAOpacity * phaseAFade} />
          </>
        )}

        {/* ── Phase B : GTA dot + Sangomar secondaire + arcs ── */}
        {phaseBVisible && (
          <>
            {/* Arc Europe */}
            {arcEuProg > 0 && (
              <path
                d={`M ${gtaDot.x} ${gtaDot.y} Q ${euCtrlX} ${euCtrlY} ${europeDot.x} ${europeDot.y}`}
                stroke={GOLD} strokeWidth={2} fill="none"
                strokeDasharray={`${arcEuProg * ARC_EU_LEN} ${ARC_EU_LEN}`}
                opacity={0.85 * phaseBFade}
              />
            )}
            {/* Arc Qatar/Asie */}
            {arcAsProg > 0 && (
              <path
                d={`M ${gtaDot.x} ${gtaDot.y} Q ${asCtrlX} ${asCtrlY} ${qatarDot.x} ${qatarDot.y}`}
                stroke={GOLD} strokeWidth={1.5} fill="none"
                strokeDasharray={`${arcAsProg * ARC_AS_LEN} ${ARC_AS_LEN}`}
                opacity={0.60 * phaseBFade}
              />
            )}
            {/* Dot Europe */}
            {europeScale > 0.01 && (
              <>
                <circle cx={europeDot.x} cy={europeDot.y} r={8 * europeScale} fill={GOLD} opacity={0.9 * phaseBFade} />
                <circle cx={europeDot.x} cy={europeDot.y} r={18 * europeScale} fill={GOLD} opacity={0.12 * phaseBFade} />
              </>
            )}
            {/* Dot Qatar */}
            {qatarScale > 0.01 && (
              <circle cx={qatarDot.x} cy={qatarDot.y} r={7 * qatarScale} fill={GOLD} opacity={0.8 * phaseBFade} />
            )}
            {/* Dot GTA principal */}
            <circle cx={gtaDot.x} cy={gtaDot.y} r={16 * gtaScale} fill={GOLD} opacity={gtaGlow * phaseBFade} />
            <circle cx={gtaDot.x} cy={gtaDot.y} r={32 * gtaScale} fill={GOLD} opacity={gtaGlow * 0.18 * phaseBFade} />
            {/* Dot Sangomar secondaire */}
            <circle cx={sangomarDot.x} cy={sangomarDot.y} r={10} fill={GOLD}
              opacity={interpolate(frame, [FB_GTA, FB_GTA + 20], [0, 0.55], { extrapolateRight: "clamp" }) * phaseBFade} />
          </>
        )}

        {/* ── Phase C : Yakaar rings + dot ── */}
        {phaseCVisible && ringsC.map((ring, i) => (
          <circle key={`rC${i}`} cx={PXc + vibX} cy={PYc + vibY} r={ring.radius}
            stroke={CYAN} strokeWidth={1.2} fill="none" opacity={ring.opacity} />
        ))}
        {phaseCVisible && (
          <>
            <circle cx={PXc + vibX} cy={PYc + vibY} r={16 * dotCScale}
              fill={dotCColor} opacity={dotCGlow * dotCOpacity} />
            <circle cx={PXc + vibX} cy={PYc + vibY} r={32 * dotCScale}
              fill={dotCColor} opacity={dotCGlow * 0.15 * dotCOpacity} />
          </>
        )}
      </svg>

      {/* ════════════════════════════════════════
          OVERLAYS Phase A — Sangomar
          ════════════════════════════════════════ */}
      {phaseAVisible && labelAOpacity > 0.01 && (
        <>
          {/* Icône derrick gold */}
          <div style={{
            position: "absolute",
            left: PXa - 30, top: PYa - 108,
            opacity: labelAOpacity * 0.85 * phaseAFade,
            transform: `translateX(${labelAX}px)`,
            pointerEvents: "none",
          }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <line x1="22" y1="6" x2="8" y2="38" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/>
              <line x1="22" y1="6" x2="36" y2="38" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/>
              <line x1="22" y1="6" x2="22" y2="38" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="38" x2="38" y2="38" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="13" y1="22" x2="31" y2="22" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
              <rect x="18" y="4" width="8" height="4" rx="1" fill={GOLD} opacity="0.7"/>
            </svg>
          </div>

          {/* Label SANGOMAR */}
          <div style={{
            position: "absolute",
            left: PXa + 40, top: PYa - 75,
            opacity: labelAOpacity * phaseAFade,
            transform: `translateX(${labelAX}px)`,
            pointerEvents: "none",
          }}>
            <div style={{
              backgroundColor: "rgba(13,21,37,0.92)",
              borderLeft: `4px solid ${GOLD}`,
              padding: "10px 20px 8px 16px",
              display: "flex", flexDirection: "column", gap: 4,
            }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 700, color: "#f2ebd9", letterSpacing: "0.16em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                SANGOMAR
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 500, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                PÉTROLE BRUT
              </div>
            </div>
            <div style={{
              backgroundColor: "rgba(13,21,37,0.75)",
              padding: "6px 20px",
              opacity: woodsideOp,
              transform: `translateY(${woodsideY}px)`,
            }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 400, color: "rgba(242,235,217,0.60)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                OPÉRATEUR — WOODSIDE ENERGY
              </div>
            </div>
            <div style={{
              backgroundColor: "rgba(13,21,37,0.70)",
              padding: "5px 20px",
              opacity: petrosenOp,
              transform: `translateY(${petrosenY}px)`,
            }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                PETROSEN — 18%
              </div>
            </div>
          </div>
        </>
      )}

      {/* ════════════════════════════════════════
          OVERLAYS Phase B — GTA
          ════════════════════════════════════════ */}
      {phaseBVisible && (
        <>
          {/* Label frontière */}
          {frontiereOp > 0.01 && (
            <div style={{
              position: "absolute",
              left: gtaDot.x - 155, top: gtaDot.y - 58,
              opacity: frontiereOp * phaseBFade,
              transform: `translateX(${frontiereX}px)`,
              display: "flex", alignItems: "center", gap: 8,
              pointerEvents: "none",
            }}>
              <div style={{ width: 3, height: 20, backgroundColor: GOLD }} />
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600, color: "#f2ebd9", letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                GTA / GAZ NATUREL
              </div>
            </div>
          )}

          {/* Label BP */}
          <div style={{
            position: "absolute",
            left: gtaDot.x - 95, top: gtaDot.y - 30,
            opacity: bpOp * phaseBFade,
            transform: `translateY(${bpY}px)`,
            pointerEvents: "none",
          }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 400, color: "rgba(242,235,217,0.60)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              BP — OPÉRATEUR
            </div>
          </div>

          {/* Production active */}
          <div style={{
            position: "absolute",
            left: gtaDot.x - 115, top: gtaDot.y + 26,
            opacity: prodOp * phaseBFade,
            transform: `scale(${prodScale})`,
            transformOrigin: "left center",
            pointerEvents: "none",
          }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600, color: GOLD, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              PRODUCTION ACTIVE
            </div>
          </div>

          {/* Date cargaison */}
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 60,
            display: "flex", justifyContent: "center",
            opacity: dateOp * phaseBFade, pointerEvents: "none",
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 400,
              color: frame >= FB_CARGAISON
                ? `rgba(200,169,81,${0.65 + cargaisonGlow * 0.35})`
                : "rgba(242,235,217,0.60)",
              letterSpacing: "0.2em", textTransform: "uppercase",
              textShadow: frame >= FB_CARGAISON ? `0 0 ${20 * cargaisonGlow}px rgba(200,169,81,0.8)` : "none",
            }}>
              FÉV. 2025 — 1ÈRE CARGAISON
            </div>
          </div>

          {/* Fournisseur réel */}
          <div style={{
            position: "absolute", left: 0, right: 0, top: height * 0.38,
            display: "flex", justifyContent: "center",
            opacity: fourniOp * phaseBFade,
            transform: `translateY(${fourniY}px)`,
            pointerEvents: "none",
          }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 500, color: "rgba(242,235,217,0.80)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              FOURNISSEUR RÉEL — EUROPE & ASIE
            </div>
          </div>

          {/* Labels destinations */}
          {europeScale > 0.3 && (
            <div style={{ position: "absolute", left: europeDot.x + 14, top: europeDot.y - 10, opacity: europeScale * phaseBFade, pointerEvents: "none" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                EUROPE
              </div>
            </div>
          )}
          {qatarScale > 0.3 && (
            <div style={{ position: "absolute", left: qatarDot.x - 20, top: qatarDot.y - 22, opacity: qatarScale * phaseBFade, pointerEvents: "none" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                ASIE / GOLFE
              </div>
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════
          OVERLAYS Phase C — Yakaar
          ════════════════════════════════════════ */}
      {phaseCVisible && (
        <>
          {/* "?" massif */}
          {questionScale > 0.01 && (
            <div style={{
              position: "absolute", left: 0, right: 0, top: height * 0.08,
              display: "flex", justifyContent: "center",
              opacity: finalQuestionOpacity,
              transform: `scale(${questionScale}) translateX(${vibX}px) translateY(${vibY}px)`,
              pointerEvents: "none",
            }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 480, fontWeight: 700, color: "#88929c", lineHeight: 1, filter: "blur(2px)", userSelect: "none" }}>
                ?
              </div>
            </div>
          )}

          {/* Icône derrick cyan */}
          {labelCOp > 0.01 && (
            <div style={{
              position: "absolute",
              left: PXc + 32, top: PYc - 128,
              opacity: labelCOp * 0.80,
              transform: `translateX(${labelCX}px)`,
              pointerEvents: "none",
            }}>
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
                <line x1="22" y1="6" x2="8" y2="38" stroke={CYAN} strokeWidth="2" strokeLinecap="round"/>
                <line x1="22" y1="6" x2="36" y2="38" stroke={CYAN} strokeWidth="2" strokeLinecap="round"/>
                <line x1="22" y1="6" x2="22" y2="38" stroke={CYAN} strokeWidth="2" strokeLinecap="round"/>
                <line x1="6" y1="38" x2="38" y2="38" stroke={CYAN} strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="13" y1="22" x2="31" y2="22" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="18" y="4" width="8" height="4" rx="1" fill={CYAN} opacity="0.6"/>
                <line x1="17" y1="30" x2="27" y2="36" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="27" y1="30" x2="17" y2="36" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          )}

          {/* Label YAKAAR-TERANGA */}
          <div style={{
            position: "absolute",
            left: PXc + 30, top: PYc - 80,
            opacity: labelCOp,
            transform: `translateX(${labelCX}px)`,
            pointerEvents: "none",
          }}>
            <div style={{
              backgroundColor: "rgba(13,21,37,0.88)",
              borderLeft: `4px solid ${CYAN}`,
              padding: "8px 18px 6px 14px",
              display: "flex", flexDirection: "column", gap: 3,
            }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 700, color: "#f2ebd9", letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                YAKAAR-TERANGA
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500, color: CYAN, letterSpacing: "0.12em", textTransform: "uppercase", opacity: sublabelCOp }}>
                GAZ NATUREL — NON EXPLOITE
              </div>
            </div>
          </div>

          {/* IL ATTEND. */}
          {frame >= FC_ATTEND && (
            <div style={{
              position: "absolute", left: 0, right: 0, bottom: 80,
              display: "flex", justifyContent: "center",
              opacity: interpolate(frame, [FC_ATTEND, FC_ATTEND + 20], [0, 0.75], { extrapolateRight: "clamp" }),
              pointerEvents: "none",
            }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, fontWeight: 400, color: "rgba(242,235,217,0.70)", letterSpacing: "0.22em", textTransform: "uppercase", fontStyle: "italic" }}>
                IL ATTEND.
              </div>
            </div>
          )}
        </>
      )}

      <SourceTag source="ITIE Sénégal — Rapport 2023" startFrame={FA_LABEL} endFrame={F_A_END} />
      <SourceTag source="Woodside Energy — Rapport annuel 2024" startFrame={FA_WOODSIDE} endFrame={F_AB_END} />
    </AbsoluteFill>
  );
};

export default SenegalActe2Continu;
