import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill, Audio, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "../../../_shared/mapbox/MapboxBase";

// Beat10 — S1 Comparatif Norvege / Congo / Botswana
// Acte 3 : 132.64s → 189.40s narration = 56.76s = 1703 frames @30fps
//
// PHASES & MOUVEMENTS :
// Phase A  f0→360    Norvege — Dolly In mer du Nord, Crane Down 0→30deg
// Trans AB f360→420  — Whip Pan 60f sud vers Congo equatorial
// Phase B  f420→680  — Zoom sur bassin Congo, pitch 0→25deg
// Trans BC f680→740  — Whip Pan 60f SE vers Botswana
// Phase C  f740→1037 — Zoom Botswana, Crane Down, overlay stats
// Phase D  f1037→1703 — Pull Back Reveal vue Afrique + punchline

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD  = "#c8a951";
const IVORY = "#f0e6c8";
const NAVY  = "#0d1520";

// ── Coordonnees geographiques ─────────────────────────────────
const NORVEGE:    [number, number] = [4.50,  62.00];  // cote Norvege
const CONGO:      [number, number] = [12.35, -4.32];  // Brazzaville
const BOTSWANA:   [number, number] = [25.91, -24.65]; // Gaborone
const AFRIQUE:    [number, number] = [17.00,  2.00];  // vue continentale

// ── Frontieres de phase (frames) ──────────────────────────────
const F_A_END  = 360;   // fin Phase A (Norvege)
const F_AB_END = 420;   // fin Whip Pan A→B
const F_B_END  = 680;   // fin Phase B (Congo)
const F_BC_END = 740;   // fin Whip Pan B→C
const F_C_END  = 1037;  // fin Phase C (Botswana)
const F_D_END  = 1703;  // fin Phase D (Pull Back + punchline)

// ── Anchors narratifs (frames absolus) ───────────────────────
// Forced alignment Acte 3 : debut = 132.64s → frame 0 ici
// "La Norvege" = +4.0s  → f120
// "Le Congo"   = +22.66s → f680
// "Le Botswana"= +34.56s → f1037
// "les mecanismes" = +56.76s → f1703
const FA_DOT    = 0;
const FA_LABEL  = 60;   // label Norvege apparait ~2s apres
const FA_STAT1  = 150;  // "Fonds souverain" countUp
const FA_STAT2  = 240;  // "1500 Mds$"
const FA_STAT3  = 300;  // "280 000 $/Norvegien"

const FB_DOT    = F_AB_END;
const FB_LABEL  = F_AB_END + 46;
const FB_STAT1  = F_AB_END + 120;
const FB_STAT2  = F_AB_END + 180;

const FC_DOT    = F_BC_END;
const FC_LABEL  = F_BC_END + 46;
const FC_STAT1  = F_BC_END + 120;
const FC_STAT2  = F_BC_END + 200;

const FD_START  = F_C_END;
const FD_LINE1  = FD_START + 120;  // punchline ligne 1
const FD_LINE2  = FD_START + 220;  // punchline ligne 2 (emphase)

// ── Easing cubique in-out ─────────────────────────────────────
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ── Blur pendant whip pans ────────────────────────────────────
function blurAmount(frame: number): number {
  // Whip pan A→B : F_A_END(360) → F_AB_END(420), 60f
  if (frame >= F_A_END && frame < F_AB_END) {
    const mid = F_A_END + 15;
    const clr = F_A_END + 40;
    // clr(400) < F_AB_END(420) — toujours monotone
    return interpolate(frame, [F_A_END, mid, clr, F_AB_END - 1],
      [0, 14, 2, 0], { extrapolateRight: "clamp" });
  }
  // Whip pan B→C : F_B_END(680) → F_BC_END(740), 60f
  if (frame >= F_B_END && frame < F_BC_END) {
    const mid = F_B_END + 15;
    const clr = F_B_END + 40;
    return interpolate(frame, [F_B_END, mid, clr, F_BC_END - 1],
      [0, 14, 2, 0], { extrapolateRight: "clamp" });
  }
  return 0;
}

type DotPos = { x: number; y: number };

// ── CountUp helper ────────────────────────────────────────────
function countUp(frame: number, startFrame: number, fps: number, targetValue: number, durationFrames = 45): number {
  const localF = Math.max(0, frame - startFrame);
  const progress = Math.min(localF / durationFrames, 1);
  return Math.round(easeInOutCubic(progress) * targetValue);
}

export const Beat10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);

  const [norvegeDot,  setNorvegeDot]  = useState<DotPos>({ x: 960, y: 540 });
  const [congoDot,    setCongoDot]    = useState<DotPos>({ x: 960, y: 540 });
  const [botswanaDot, setBotswanaDot] = useState<DotPos>({ x: 960, y: 540 });

  // ── Init Map ─────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: NORVEGE,
      zoom: 4.5,
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
      safe("land",         "background-color", "#4a5060");
      safe("landuse",      "fill-color",       "#4a5060");
      safe("landcover",    "fill-color",       "#454555");
      safe("water",        "fill-color",       "#1a3050");
      safe("water-shadow", "fill-color",       "#1a3050");

      // Highlight layer Norvege (or)
      try {
        (map as unknown as { addSource: (id: string, src: unknown) => void }).addSource("norv-src", {
          type: "geojson",
          data: { type: "Feature", geometry: { type: "Polygon", coordinates: [[
            [4.0, 57.5], [9.0, 57.5], [9.0, 58.5], [5.7, 58.5], [5.5, 59.5],
            [5.0, 61.5], [5.5, 63.0], [7.0, 65.0], [6.0, 68.0], [4.0, 70.0],
            [3.0, 68.0], [4.5, 63.0], [4.0, 60.0], [4.0, 57.5],
          ]] } },
        });
        (map as unknown as { addLayer: (layer: unknown) => void }).addLayer({
          id: "norv-fill",
          type: "fill",
          source: "norv-src",
          paint: { "fill-color": GOLD, "fill-opacity": 0.18 },
        });
      } catch (_e) {}
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // ── Moteur camera — s'execute a chaque frame ─────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const f = frame;

    let lon: number, lat: number, zoom: number, bearing: number, pitch: number;

    // ── Phase A : Dolly In sur cote Norvege ───────────────────
    if (f <= F_A_END) {
      lon     = interpolate(f, [0, F_A_END], [4.50,  4.80],  { extrapolateRight: "clamp" });
      lat     = interpolate(f, [0, F_A_END], [62.00, 61.40], { extrapolateRight: "clamp" });
      zoom    = interpolate(f, [0, 100, F_A_END], [4.5, 4.7, 5.2], { extrapolateRight: "clamp" });
      bearing = interpolate(f, [0, F_A_END], [0, -8], { extrapolateRight: "clamp" });
      pitch   = interpolate(f, [0, 120, F_A_END], [0, 0, 30], { extrapolateRight: "clamp" });
    }

    // ── Transition A→B : Whip Pan vers Congo equatorial ───────
    else if (f <= F_AB_END) {
      const fAB = f - F_A_END;
      const tActive = Math.min(fAB / 60, 1);
      const ease = easeInOutCubic(tActive);
      zoom    = interpolate(ease, [0, 1], [5.2, 4.0],    {});
      lon     = interpolate(ease, [0, 1], [4.80,  12.35], {});
      lat     = interpolate(ease, [0, 1], [61.40, -4.32], {});
      bearing = interpolate(ease, [0, 1], [-8, 10],       {});
      pitch   = interpolate(ease, [0, 1], [30,  0],       {});
    }

    // ── Phase B : Zoom sur bassin Congo ───────────────────────
    else if (f <= F_B_END) {
      const fB = f - F_AB_END;
      const DUR_B = F_B_END - F_AB_END;
      lon     = interpolate(fB, [0, DUR_B], [12.35, 12.80], { extrapolateRight: "clamp" });
      lat     = interpolate(fB, [0, DUR_B], [-4.32, -4.80], { extrapolateRight: "clamp" });
      zoom    = interpolate(fB, [0, 120, DUR_B], [4.0, 4.3, 4.8], { extrapolateRight: "clamp" });
      bearing = interpolate(fB, [0, DUR_B], [10, 4],  { extrapolateRight: "clamp" });
      pitch   = interpolate(fB, [0, 80, DUR_B], [0, 0, 25], { extrapolateRight: "clamp" });
    }

    // ── Transition B→C : Whip Pan SE vers Botswana ───────────
    else if (f <= F_BC_END) {
      const fBC = f - F_B_END;
      const tActive = Math.min(fBC / 60, 1);
      const ease = easeInOutCubic(tActive);
      zoom    = interpolate(ease, [0, 1], [4.8, 4.2],     {});
      lon     = interpolate(ease, [0, 1], [12.80, 25.91], {});
      lat     = interpolate(ease, [0, 1], [-4.80, -24.65],{});
      bearing = interpolate(ease, [0, 1], [4, -5],        {});
      pitch   = interpolate(ease, [0, 1], [25,  0],       {});
    }

    // ── Phase C : Zoom Botswana + Crane Down ─────────────────
    else if (f <= F_C_END) {
      const fC = f - F_BC_END;
      const DUR_C = F_C_END - F_BC_END;
      lon     = interpolate(fC, [0, DUR_C], [25.91, 26.20], { extrapolateRight: "clamp" });
      lat     = interpolate(fC, [0, DUR_C], [-24.65, -24.90],{ extrapolateRight: "clamp" });
      zoom    = interpolate(fC, [0, 100, DUR_C], [4.2, 4.6, 5.0], { extrapolateRight: "clamp" });
      bearing = interpolate(fC, [0, DUR_C], [-5, 8],  { extrapolateRight: "clamp" });
      pitch   = interpolate(fC, [0, 80, DUR_C], [0, 0, 28], { extrapolateRight: "clamp" });
    }

    // ── Phase D : Pull Back Reveal vue Afrique continentale ──
    else {
      const fD = f - F_D_END;
      const tActive = Math.min(Math.abs(fD) / 150, 1);
      const ease = easeInOutCubic(tActive);
      lon     = interpolate(ease, [0, 1], [26.20, 17.00], { extrapolateRight: "clamp" });
      lat     = interpolate(ease, [0, 1], [-24.90, 2.00], { extrapolateRight: "clamp" });
      zoom    = interpolate(ease, [0, 1], [5.0,   2.4],   { extrapolateRight: "clamp" });
      bearing = interpolate(ease, [0, 1], [8,     0],     { extrapolateRight: "clamp" });
      pitch   = interpolate(ease, [0, 1], [28,    0],     { extrapolateRight: "clamp" });
      // Derive legere apres settle
      if (f > F_C_END + 150) {
        const fSettle = f - F_C_END - 150;
        lon     = interpolate(fSettle, [0, 553], [17.00, 17.20], { extrapolateRight: "clamp" });
        lat     = interpolate(fSettle, [0, 553], [2.00,  2.30],  { extrapolateRight: "clamp" });
        zoom    = 2.4;
        bearing = 0;
        pitch   = 0;
      }
    }

    map.jumpTo({ center: [lon, lat], zoom, bearing, pitch });

    const project = (lngLat: [number, number]): DotPos => {
      const pt = map.project(new mapboxgl.LngLat(lngLat[0], lngLat[1]));
      return { x: Math.round(pt.x), y: Math.round(pt.y) };
    };
    setNorvegeDot(project(NORVEGE));
    setCongoDot(project(CONGO));
    setBotswanaDot(project(BOTSWANA));
  });

  const blur = blurAmount(frame);

  // ── Visibilite des phases ────────────────────────────────────
  const phaseAVisible = frame < F_AB_END + 20;
  const phaseBVisible = frame >= F_AB_END && frame < F_BC_END + 20;
  const phaseCVisible = frame >= F_BC_END && frame < F_C_END + 30;
  const phaseDVisible = frame >= F_C_END;

  // ── Fade entre phases ────────────────────────────────────────
  const phaseAFade = interpolate(frame, [F_A_END - 20, F_A_END + 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phaseBFade = interpolate(frame, [F_B_END - 20, F_B_END + 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phaseCFade = interpolate(frame, [F_C_END - 20, F_C_END + 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Dots spring Phase A (Norvege) ────────────────────────────
  const dotAP    = spring({ frame: frame - FA_DOT, fps, config: { damping: 8, stiffness: 350 }, durationInFrames: 25 });
  const dotAScale = interpolate(dotAP, [0, 1], [0.05, 1], { extrapolateRight: "clamp" });
  const dotAOp    = interpolate(dotAP, [0, 0.08, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const sinePulseA = Math.sin((frame / 40) * Math.PI * 2);
  const dotAGlow   = interpolate(sinePulseA, [-1, 1], [0.7, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ringsA = [0, 1, 2].map((i) => {
    const localF   = Math.max(0, frame - FA_DOT - i * 28);
    const progress = (localF % 80) / 80;
    return {
      radius:  progress * 140,
      opacity: interpolate(progress, [0, 0.15, 0.65, 1], [0, 0.55, 0.2, 0], { extrapolateRight: "clamp" }) * dotAOp,
    };
  });

  const labelAP  = spring({ frame: frame - FA_LABEL, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 20 });
  const labelAOp = interpolate(labelAP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelAX  = interpolate(labelAP, [0, 1], [40, 0], { extrapolateRight: "clamp" });

  const stat1AP  = spring({ frame: frame - FA_STAT1, fps, config: { damping: 18, stiffness: 180 }, durationInFrames: 18 });
  const stat1AOp = interpolate(stat1AP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const stat1AY  = interpolate(stat1AP, [0, 1], [8, 0], { extrapolateRight: "clamp" });

  const stat2AP  = spring({ frame: frame - FA_STAT2, fps, config: { damping: 12, stiffness: 260 }, durationInFrames: 18 });
  const stat2AOp = interpolate(stat2AP, [0, 0.1, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const stat2AScale = interpolate(stat2AP, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });

  const stat3AP  = spring({ frame: frame - FA_STAT3, fps, config: { damping: 18, stiffness: 160 }, durationInFrames: 20 });
  const stat3AOp = interpolate(stat3AP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const stat3AY  = interpolate(stat3AP, [0, 1], [8, 0], { extrapolateRight: "clamp" });

  // ── Dots spring Phase B (Congo) ──────────────────────────────
  const dotBP    = spring({ frame: frame - FB_DOT, fps, config: { damping: 10, stiffness: 300 }, durationInFrames: 25 });
  const dotBScale = interpolate(dotBP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const dotBOp    = interpolate(dotBP, [0, 0.1, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const sinePulseB = Math.sin((frame / 35) * Math.PI * 2);
  const dotBGlow   = interpolate(sinePulseB, [-1, 1], [0.6, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ringsB = [0, 1, 2].map((i) => {
    const localF   = Math.max(0, frame - FB_DOT - i * 28);
    const progress = (localF % 80) / 80;
    return {
      radius:  progress * 140,
      opacity: interpolate(progress, [0, 0.15, 0.65, 1], [0, 0.45, 0.18, 0], { extrapolateRight: "clamp" }) * dotBOp,
    };
  });

  const labelBP  = spring({ frame: frame - FB_LABEL, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 20 });
  const labelBOp = interpolate(labelBP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelBX  = interpolate(labelBP, [0, 1], [40, 0], { extrapolateRight: "clamp" });

  const stat1BP  = spring({ frame: frame - FB_STAT1, fps, config: { damping: 18, stiffness: 180 }, durationInFrames: 18 });
  const stat1BOp = interpolate(stat1BP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const stat1BY  = interpolate(stat1BP, [0, 1], [8, 0], { extrapolateRight: "clamp" });

  const stat2BP  = spring({ frame: frame - FB_STAT2, fps, config: { damping: 18, stiffness: 160 }, durationInFrames: 18 });
  const stat2BOp = interpolate(stat2BP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const stat2BY  = interpolate(stat2BP, [0, 1], [8, 0], { extrapolateRight: "clamp" });

  // ── Dots spring Phase C (Botswana) ───────────────────────────
  const dotCP    = spring({ frame: frame - FC_DOT, fps, config: { damping: 10, stiffness: 280 }, durationInFrames: 28 });
  const dotCScale = interpolate(dotCP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const dotCOp    = interpolate(dotCP, [0, 0.1, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const sinePulseC = Math.sin((frame / 45) * Math.PI * 2);
  const dotCGlow   = interpolate(sinePulseC, [-1, 1], [0.65, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ringsC = [0, 1, 2].map((i) => {
    const localF   = Math.max(0, frame - FC_DOT - i * 30);
    const progress = (localF % 85) / 85;
    return {
      radius:  progress * 140,
      opacity: interpolate(progress, [0, 0.15, 0.65, 1], [0, 0.5, 0.2, 0], { extrapolateRight: "clamp" }) * dotCOp,
    };
  });

  const labelCP  = spring({ frame: frame - FC_LABEL, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 20 });
  const labelCOp = interpolate(labelCP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelCX  = interpolate(labelCP, [0, 1], [40, 0], { extrapolateRight: "clamp" });

  const stat1CP  = spring({ frame: frame - FC_STAT1, fps, config: { damping: 18, stiffness: 180 }, durationInFrames: 18 });
  const stat1COp = interpolate(stat1CP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const stat1CY  = interpolate(stat1CP, [0, 1], [8, 0], { extrapolateRight: "clamp" });

  const stat2CP  = spring({ frame: frame - FC_STAT2, fps, config: { damping: 18, stiffness: 160 }, durationInFrames: 18 });
  const stat2COp = interpolate(stat2CP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const stat2CY  = interpolate(stat2CP, [0, 1], [8, 0], { extrapolateRight: "clamp" });

  // ── Phase D : punchlines ─────────────────────────────────────
  const line1P   = spring({ frame: frame - FD_LINE1, fps, config: { damping: 20, stiffness: 160 }, durationInFrames: 25 });
  const line1Op  = interpolate(line1P, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const line1Y   = interpolate(line1P, [0, 1], [20, 0], { extrapolateRight: "clamp" });

  const line2P   = spring({ frame: frame - FD_LINE2, fps, config: { damping: 14, stiffness: 280 }, durationInFrames: 22 });
  const line2Op  = interpolate(line2P, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const line2Scale = interpolate(line2P, [0, 1], [0.75, 1], { extrapolateRight: "clamp" });

  // CountUp valeurs Norvege
  const fondsVal = countUp(frame, FA_STAT2, fps, 1500, 60);
  const perCapVal = countUp(frame, FA_STAT3, fps, 280, 50);

  const PXnorv = norvegeDot.x;
  const PYnorv = norvegeDot.y;
  const PXcong = congoDot.x;
  const PYcong = congoDot.y;
  const PXbots = botswanaDot.x;
  const PYbots = botswanaDot.y;

  // Offset overlay = a droite du dot, ancrage en bas
  const OVERLAY_OFFSET_X = 24;
  const OVERLAY_OFFSET_Y = -80;

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <MapboxBrandingHide />

      {/* Audio : tranche Acte 3, startFrom = 132.64s * 30fps = ~3979f */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3")}
        startFrom={3979}
        volume={1}
      />

      {/* Carte — blur pendant whip pans */}
      <div
        ref={containerRef}
        style={{
          position: "absolute", inset: 0, width, height,
          filter: blur > 0 ? `blur(${blur}px)` : "none",
        }}
      />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(13,21,32,0.45) 100%)",
        pointerEvents: "none",
      }} />

      {/* SVG overlay pour dots et rings */}
      <svg
        style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
        width={width} height={height}
      >
        {/* ── Phase A : Dot Norvege ──── */}
        {phaseAVisible && (
          <g opacity={phaseAFade}>
            {ringsA.map((r, i) => (
              <circle key={`rA${i}`} cx={PXnorv} cy={PYnorv} r={r.radius} fill="none"
                stroke={GOLD} strokeWidth={1.5} opacity={r.opacity} />
            ))}
            <circle cx={PXnorv} cy={PYnorv} r={10 * dotAScale}
              fill={GOLD} opacity={dotAOp * dotAGlow} />
            <circle cx={PXnorv} cy={PYnorv} r={4 * dotAScale}
              fill={IVORY} opacity={dotAOp} />
          </g>
        )}

        {/* ── Phase B : Dot Congo ────── */}
        {phaseBVisible && (
          <g opacity={phaseBFade}>
            {ringsB.map((r, i) => (
              <circle key={`rB${i}`} cx={PXcong} cy={PYcong} r={r.radius} fill="none"
                stroke="#e08060" strokeWidth={1.5} opacity={r.opacity} />
            ))}
            <circle cx={PXcong} cy={PYcong} r={10 * dotBScale}
              fill="#d06040" opacity={dotBOp * dotBGlow} />
            <circle cx={PXcong} cy={PYcong} r={4 * dotBScale}
              fill={IVORY} opacity={dotBOp} />
          </g>
        )}

        {/* ── Phase C : Dot Botswana ─── */}
        {phaseCVisible && (
          <g opacity={phaseCFade}>
            {ringsC.map((r, i) => (
              <circle key={`rC${i}`} cx={PXbots} cy={PYbots} r={r.radius} fill="none"
                stroke="#60b8a0" strokeWidth={1.5} opacity={r.opacity} />
            ))}
            <circle cx={PXbots} cy={PYbots} r={10 * dotCScale}
              fill="#50a890" opacity={dotCOp * dotCGlow} />
            <circle cx={PXbots} cy={PYbots} r={4 * dotCScale}
              fill={IVORY} opacity={dotCOp} />
          </g>
        )}
      </svg>

      {/* ── Overlay labels & stats Phase A (Norvege) ────────────── */}
      {phaseAVisible && (
        <div style={{
          position: "absolute",
          left: PXnorv + OVERLAY_OFFSET_X,
          top: PYnorv + OVERLAY_OFFSET_Y,
          opacity: phaseAFade,
          pointerEvents: "none",
        }}>
          {/* Label pays */}
          <div style={{
            color: GOLD, fontFamily: "sans-serif", fontWeight: 700,
            fontSize: 28, letterSpacing: 3, textTransform: "uppercase",
            opacity: labelAOp,
            transform: `translateX(${labelAX}px)`,
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}>
            NORVEGE
          </div>
          {/* Sous-label annee */}
          <div style={{
            color: IVORY, fontFamily: "sans-serif", fontSize: 16,
            opacity: labelAOp * 0.7,
            transform: `translateX(${labelAX}px)`,
            marginTop: 2,
          }}>
            1969 — petrole en mer du Nord
          </div>
          {/* Stat 1 : Fonds souverain */}
          <div style={{
            color: IVORY, fontFamily: "sans-serif", fontSize: 20, marginTop: 14,
            opacity: stat1AOp,
            transform: `translateY(${stat1AY}px)`,
          }}>
            Fonds souverain
          </div>
          {/* Stat 2 : CountUp Mds$ */}
          <div style={{
            fontFamily: "sans-serif", fontWeight: 800, fontSize: 42,
            color: GOLD, marginTop: 4,
            opacity: stat2AOp,
            transform: `scale(${stat2AScale})`,
            transformOrigin: "left center",
          }}>
            {fondsVal} <span style={{ fontSize: 24, fontWeight: 400, color: IVORY }}>Mds$</span>
          </div>
          {/* Stat 3 : per capita */}
          <div style={{
            color: IVORY, fontFamily: "sans-serif", fontSize: 18, marginTop: 6,
            opacity: stat3AOp,
            transform: `translateY(${stat3AY}px)`,
          }}>
            {perCapVal} 000 $/Norvegien
          </div>
        </div>
      )}

      {/* ── Overlay labels & stats Phase B (Congo) ──────────────── */}
      {phaseBVisible && (
        <div style={{
          position: "absolute",
          left: PXcong + OVERLAY_OFFSET_X,
          top: PYcong + OVERLAY_OFFSET_Y,
          opacity: phaseBFade,
          pointerEvents: "none",
        }}>
          <div style={{
            color: "#e08060", fontFamily: "sans-serif", fontWeight: 700,
            fontSize: 28, letterSpacing: 3, textTransform: "uppercase",
            opacity: labelBOp,
            transform: `translateX(${labelBX}px)`,
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}>
            CONGO
          </div>
          <div style={{
            color: IVORY, fontFamily: "sans-serif", fontSize: 16,
            opacity: labelBOp * 0.7,
            transform: `translateX(${labelBX}px)`,
            marginTop: 2,
          }}>
            meme epoque — petrole du delta
          </div>
          <div style={{
            color: "#e08060", fontFamily: "sans-serif", fontWeight: 700,
            fontSize: 32, marginTop: 14,
            opacity: stat1BOp,
            transform: `translateY(${stat1BY}px)`,
          }}>
            DETTE
          </div>
          <div style={{
            color: IVORY, fontFamily: "sans-serif", fontSize: 20, marginTop: 4,
            opacity: stat2BOp,
            transform: `translateY(${stat2BY}px)`,
          }}>
            Pauvrete persistante
          </div>
          <div style={{
            color: IVORY, fontFamily: "sans-serif", fontSize: 16, marginTop: 4,
            opacity: stat2BOp * 0.8,
          }}>
            Memes ressources. Autres choix.
          </div>
        </div>
      )}

      {/* ── Overlay labels & stats Phase C (Botswana) ───────────── */}
      {phaseCVisible && (
        <div style={{
          position: "absolute",
          left: PXbots + OVERLAY_OFFSET_X,
          top: PYbots + OVERLAY_OFFSET_Y,
          opacity: phaseCFade,
          pointerEvents: "none",
        }}>
          <div style={{
            color: "#60b8a0", fontFamily: "sans-serif", fontWeight: 700,
            fontSize: 28, letterSpacing: 3, textTransform: "uppercase",
            opacity: labelCOp,
            transform: `translateX(${labelCX}px)`,
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}>
            BOTSWANA
          </div>
          <div style={{
            color: IVORY, fontFamily: "sans-serif", fontSize: 16,
            opacity: labelCOp * 0.7,
            transform: `translateX(${labelCX}px)`,
            marginTop: 2,
          }}>
            1966 — diamants de Jwaneng
          </div>
          <div style={{
            color: "#60b8a0", fontFamily: "sans-serif", fontWeight: 700,
            fontSize: 32, marginTop: 14,
            opacity: stat1COp,
            transform: `translateY(${stat1CY}px)`,
          }}>
            Institutions
          </div>
          <div style={{
            color: IVORY, fontFamily: "sans-serif", fontSize: 20, marginTop: 4,
            opacity: stat2COp,
            transform: `translateY(${stat2CY}px)`,
          }}>
            Fonds de stabilisation
          </div>
          <div style={{
            color: IVORY, fontFamily: "sans-serif", fontSize: 16, marginTop: 4,
            opacity: stat2COp * 0.8,
          }}>
            Seul pays africain AAA Moody's
          </div>
        </div>
      )}

      {/* ── Phase D : Punchline sur vue Afrique ─────────────────── */}
      {phaseDVisible && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-end",
          paddingBottom: 140,
          pointerEvents: "none",
        }}>
          {/* Fond fume derriere punchline */}
          <div style={{
            background: "linear-gradient(to top, rgba(13,21,32,0.75) 0%, transparent 100%)",
            position: "absolute", bottom: 0, left: 0, right: 0, height: 300,
          }} />
          <div style={{
            position: "relative", textAlign: "center",
            opacity: line1Op,
            transform: `translateY(${line1Y}px)`,
          }}>
            <div style={{
              color: IVORY, fontFamily: "sans-serif", fontSize: 36,
              fontWeight: 400, letterSpacing: 1,
              textShadow: "0 2px 20px rgba(0,0,0,0.9)",
              marginBottom: 8,
            }}>
              Ce ne sont pas les ressources.
            </div>
          </div>
          <div style={{
            position: "relative", textAlign: "center",
            opacity: line2Op,
            transform: `scale(${line2Scale})`,
          }}>
            <div style={{
              color: GOLD, fontFamily: "sans-serif", fontSize: 52,
              fontWeight: 900, letterSpacing: 2, textTransform: "uppercase",
              textShadow: "0 4px 30px rgba(200,169,81,0.4)",
            }}>
              Ce sont les mecanismes.
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
