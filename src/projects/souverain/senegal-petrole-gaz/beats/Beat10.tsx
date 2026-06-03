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
import { SourceTag } from "../../../_shared/components/overlays/SourceTag";

// Beat10 — S1 Comparatif Norvege / Congo / Botswana
// Duree : 1703 frames = 56.76s @30fps
// Audio : gere au niveau assemblage (pas d'<Audio> ici)
//
// PHASES calees sur forced alignment Acte 3 :
// Phase A  f0→620     Norvege  (voix "Avant de parler" → avant "Le Congo")
// Trans AB f620→680   Dolly back + depart vers Congo (60f)
// Phase B  f680→997   Congo    (voix "Le Congo" → avant "Le Botswana")
// Trans BC f997→1037  Depart vers Botswana (40f)
// Phase C  f1037→1400 Botswana (voix "Le Botswana" → avant transition)
// Phase D  f1400→1703 Crane Up progressif → vue Afrique+Europe + punchline

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD    = "#c8a951";
const ORANGE  = "#d4855a";  // Congo — neutre, pas accusateur
const GREEN   = "#3a8a70";  // Botswana
const IVORY   = "#f0e6c8";
const NAVY    = "#0d1520";

// ── Coordonnees ──────────────────────────────────────────────
const NORVEGE:  [number, number] = [4.50,  62.00];
// Congo-Brazzaville (COG) — dot sur Pointe-Noire (petrole offshore)
const CONGO:    [number, number] = [11.86, -4.80];
// Botswana — dot sur Jwaneng (mine de diamants Debswana)
const BOTSWANA: [number, number] = [24.73, -24.60];
// Vue finale : cadre remonte pour inclure Norvege (nord) + Congo + Botswana
const VUE_FINALE: [number, number] = [14.0, 20.0];
const ZOOM_FINALE = 2.8;

// ── Frontieres de phase ───────────────────────────────────────
const F_A_END  = 620;   // fin Phase A — dernier moment sur Norvege
const F_AB_END = 680;   // fin transition A→B (60f dolly back)
const F_B_END  = 997;   // fin Phase B — dernier moment sur Congo
const F_BC_END = 1037;  // fin transition B→C (40f) = exactement "Le Botswana"
const F_C_END  = 1400;  // fin Phase C — debut Crane Up
const F_VOICE_OFF = 1746; // apres "mecanismes." complet = (190.82-132.64)*30
const F_D_END  = 1836;  // fin Phase D = F_VOICE_OFF + 90f (3s respiration carte)

// ── Anchors narratifs ─────────────────────────────────────────
// Phase A : Norvege
const FA_DOT   = 0;
const FA_LABEL = 60;
const FA_STAT  = 200;   // "1 500 Mds$" — seule stat chiffree

// Phase B : Congo
const FB_DOT   = F_AB_END;
const FB_LABEL = F_AB_END + 40;

// Phase C : Botswana
const FC_DOT   = F_BC_END;
const FC_LABEL = F_BC_END + 40;

// Phase D : punchline
const FD_OVERLAY = F_C_END + 120;  // overlay fond apparait apres settle
const FD_LINE1   = F_C_END + 200;  // "3 pays."
const FD_LINE2   = F_C_END + 280;  // "3 mecanismes differents."
const FD_NAMES   = F_C_END + 360;  // noms des 3 pays en couleur

// ── Easing cubique ────────────────────────────────────────────
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type DotPos = { x: number; y: number };

export const Beat10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const containerRef  = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<mapboxgl.Map | null>(null);
  const layersReady   = useRef(false);

  const [norvegeDot,  setNorvegeDot]  = useState<DotPos>({ x: 960, y: 400 });
  const [congoDot,    setCongoDot]    = useState<DotPos>({ x: 960, y: 540 });
  const [botswanaDot, setBotswanaDot] = useState<DotPos>({ x: 960, y: 620 });

  // ── Init Map ─────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: NORVEGE,
      zoom: 4.2,
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

      // Layers coloration pays — source officielle mapbox.country-boundaries-v1
      // Pattern identique a GlobeCountryRevealMapbox.tsx (valide en production)
      const addCountryLayer = (id: string, isoA3: string, color: string) => {
        try {
          if (!map.getLayer(id)) {
            (map as unknown as { addLayer: (layer: unknown) => void }).addLayer({
              id,
              type: "fill",
              source: {
                type: "vector",
                url: "mapbox://mapbox.country-boundaries-v1",
              },
              "source-layer": "country_boundaries",
              filter: ["==", ["get", "iso_3166_1_alpha_3"], isoA3],
              paint: { "fill-color": color, "fill-opacity": 0 },
            });
          }
        } catch (_e) {}
      };

      addCountryLayer("fill-norvege",  "NOR", GOLD);
      addCountryLayer("fill-congo",    "COG", ORANGE);  // Congo-Brazzaville
      addCountryLayer("fill-botswana", "BWA", GREEN);
      layersReady.current = true;
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; layersReady.current = false; };
  }, []);

  // ── Moteur camera ─────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const f = frame;

    let lon: number, lat: number, zoom: number, bearing: number, pitch: number;

    // ── Phase A : Dolly In sur cote Norvege ───────────────────
    if (f <= F_A_END) {
      const t = f / F_A_END;
      lon     = interpolate(t, [0, 1], [4.50,  5.20],  {});
      lat     = interpolate(t, [0, 1], [62.00, 61.20], {});
      zoom    = interpolate(t, [0, 0.3, 1], [4.2, 4.4, 5.0], {});
      bearing = interpolate(t, [0, 1], [0, -6], {});
      pitch   = interpolate(t, [0, 0.35, 1], [0, 0, 28], {});
    }

    // ── Transition A→B : pull back + depart sud ───────────────
    else if (f <= F_AB_END) {
      const fAB = f - F_A_END;
      const ease = easeInOutCubic(Math.min(fAB / 60, 1));
      zoom    = interpolate(ease, [0, 1], [5.0,  3.8],    {});
      lon     = interpolate(ease, [0, 1], [5.20,  12.35], {});
      lat     = interpolate(ease, [0, 1], [61.20, -4.32], {});
      bearing = interpolate(ease, [0, 1], [-6, 6],        {});
      pitch   = interpolate(ease, [0, 1], [28,  0],       {});
    }

    // ── Phase B : Zoom Congo ──────────────────────────────────
    else if (f <= F_B_END) {
      const fB = f - F_AB_END;
      const DUR_B = F_B_END - F_AB_END;
      lon     = interpolate(fB, [0, DUR_B], [12.35, 12.90], { extrapolateRight: "clamp" });
      lat     = interpolate(fB, [0, DUR_B], [-4.32, -4.90], { extrapolateRight: "clamp" });
      zoom    = interpolate(fB, [0, 120, DUR_B], [3.8, 4.4, 5.2], { extrapolateRight: "clamp" });
      bearing = interpolate(fB, [0, DUR_B], [6, 2],  { extrapolateRight: "clamp" });
      pitch   = interpolate(fB, [0, 60, DUR_B], [0, 0, 22], { extrapolateRight: "clamp" });
    }

    // ── Transition B→C : depart SE vers Botswana (pas de blur) ─
    else if (f <= F_BC_END) {
      const fBC = f - F_B_END;
      const ease = easeInOutCubic(Math.min(fBC / 40, 1));
      zoom    = interpolate(ease, [0, 1], [5.2,  4.0],     {});
      lon     = interpolate(ease, [0, 1], [12.90, 25.91],  {});
      lat     = interpolate(ease, [0, 1], [-4.90, -24.65], {});
      bearing = interpolate(ease, [0, 1], [2, -4],         {});
      pitch   = interpolate(ease, [0, 1], [22,  0],        {});
    }

    // ── Phase C : Zoom Botswana + Crane Down ─────────────────
    else if (f <= F_C_END) {
      const fC = f - F_BC_END;
      const DUR_C = F_C_END - F_BC_END;
      lon     = interpolate(fC, [0, DUR_C], [25.91, 26.30], { extrapolateRight: "clamp" });
      lat     = interpolate(fC, [0, DUR_C], [-24.65, -25.10],{ extrapolateRight: "clamp" });
      zoom    = interpolate(fC, [0, 120, DUR_C], [4.0, 4.5, 5.2], { extrapolateRight: "clamp" });
      bearing = interpolate(fC, [0, DUR_C], [-4, 6],  { extrapolateRight: "clamp" });
      pitch   = interpolate(fC, [0, 60, DUR_C], [0, 0, 30], { extrapolateRight: "clamp" });
    }

    // ── Phase D : Crane Up progressif → vue Afrique + Europe ─
    // Pas de cut — interpolation continue depuis position Botswana
    else {
      const fD   = f - F_C_END;
      const DUR_D = F_D_END - F_C_END; // 303f
      const ease = easeInOutCubic(Math.min(fD / DUR_D, 1));
      lon     = interpolate(ease, [0, 1], [26.30, VUE_FINALE[0]], {});
      lat     = interpolate(ease, [0, 1], [-25.10, VUE_FINALE[1]], {});
      zoom    = interpolate(ease, [0, 1], [5.2, ZOOM_FINALE], {});
      bearing = interpolate(ease, [0, 1], [6, 0],   {});
      pitch   = interpolate(ease, [0, 1], [30, 0],  {});
    }

    map.jumpTo({ center: [lon, lat], zoom, bearing, pitch });

    const project = (lngLat: [number, number]): DotPos => {
      const pt = map.project(new mapboxgl.LngLat(lngLat[0], lngLat[1]));
      return { x: Math.round(pt.x), y: Math.round(pt.y) };
    };
    setNorvegeDot(project(NORVEGE));
    setCongoDot(project(CONGO));
    setBotswanaDot(project(BOTSWANA));

    // ── Opacites layers pays — s'activent a l'arrivee, ne s'eteignent jamais ──
    if (layersReady.current) {
      const setOp = (id: string, op: number) => {
        try {
          (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)(id, "fill-opacity", op);
        } catch (_e) {}
      };

      // Norvege : monte a l'arrivee (f0), reste
      const opN = interpolate(frame, [FA_DOT, FA_DOT + 45], [0, 0.30],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      setOp("fill-norvege", opN);

      // Congo : monte a l'arrivee (F_AB_END), reste
      const opC = interpolate(frame, [FB_DOT, FB_DOT + 45], [0, 0.32],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      setOp("fill-congo", opC);

      // Botswana : monte a l'arrivee (F_BC_END), reste
      const opB = interpolate(frame, [FC_DOT, FC_DOT + 45], [0, 0.32],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      setOp("fill-botswana", opB);
    }
  });

  // ── Animations dots ───────────────────────────────────────────
  // Norvege (gold)
  const dotAP    = spring({ frame: frame - FA_DOT, fps, config: { damping: 8, stiffness: 350 }, durationInFrames: 25 });
  const dotAScale = interpolate(dotAP, [0, 1], [0.05, 1], { extrapolateRight: "clamp" });
  const dotAOp    = interpolate(dotAP, [0, 0.08, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const sineA     = Math.sin((frame / 42) * Math.PI * 2);
  const glowA     = interpolate(sineA, [-1, 1], [0.7, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ringsA = [0, 1, 2].map((i) => {
    const lf = Math.max(0, frame - FA_DOT - i * 28);
    const p  = (lf % 80) / 80;
    return {
      r:   p * 130,
      op:  interpolate(p, [0, 0.15, 0.65, 1], [0, 0.5, 0.18, 0], { extrapolateRight: "clamp" }) * dotAOp,
    };
  });

  const labelAP  = spring({ frame: frame - FA_LABEL, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 20 });
  const labelAOp = interpolate(labelAP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelAX  = interpolate(labelAP, [0, 1], [30, 0], { extrapolateRight: "clamp" });

  const statAP    = spring({ frame: frame - FA_STAT, fps, config: { damping: 12, stiffness: 260 }, durationInFrames: 20 });
  const statAOp   = interpolate(statAP, [0, 0.1, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const statAScale = interpolate(statAP, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });
  // Fade out Phase A label pendant transition
  const phaseALabelFade = interpolate(frame, [F_A_END - 30, F_A_END + 30], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Congo (orange)
  const dotBP    = spring({ frame: frame - FB_DOT, fps, config: { damping: 10, stiffness: 300 }, durationInFrames: 25 });
  const dotBScale = interpolate(dotBP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const dotBOp    = interpolate(dotBP, [0, 0.1, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const sineB     = Math.sin((frame / 36) * Math.PI * 2);
  const glowB     = interpolate(sineB, [-1, 1], [0.65, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ringsB = [0, 1, 2].map((i) => {
    const lf = Math.max(0, frame - FB_DOT - i * 28);
    const p  = (lf % 80) / 80;
    return {
      r:   p * 130,
      op:  interpolate(p, [0, 0.15, 0.65, 1], [0, 0.45, 0.16, 0], { extrapolateRight: "clamp" }) * dotBOp,
    };
  });

  const labelBP  = spring({ frame: frame - FB_LABEL, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 20 });
  const labelBOp = interpolate(labelBP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelBX  = interpolate(labelBP, [0, 1], [30, 0], { extrapolateRight: "clamp" });
  const phaseBLabelFade = interpolate(frame, [F_B_END - 30, F_B_END + 30], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Botswana (vert)
  const dotCP    = spring({ frame: frame - FC_DOT, fps, config: { damping: 10, stiffness: 280 }, durationInFrames: 28 });
  const dotCScale = interpolate(dotCP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const dotCOp    = interpolate(dotCP, [0, 0.1, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const sineC     = Math.sin((frame / 46) * Math.PI * 2);
  const glowC     = interpolate(sineC, [-1, 1], [0.65, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ringsC = [0, 1, 2].map((i) => {
    const lf = Math.max(0, frame - FC_DOT - i * 30);
    const p  = (lf % 85) / 85;
    return {
      r:   p * 130,
      op:  interpolate(p, [0, 0.15, 0.65, 1], [0, 0.48, 0.18, 0], { extrapolateRight: "clamp" }) * dotCOp,
    };
  });

  const labelCP  = spring({ frame: frame - FC_LABEL, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 20 });
  const labelCOp = interpolate(labelCP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelCX  = interpolate(labelCP, [0, 1], [30, 0], { extrapolateRight: "clamp" });
  const phaseCLabelFade = interpolate(frame, [F_C_END - 30, F_C_END + 60], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Phase D : punchline ───────────────────────────────────────
  const overlayOp  = interpolate(frame, [FD_OVERLAY, FD_OVERLAY + 40], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const line1P     = spring({ frame: frame - FD_LINE1, fps, config: { damping: 20, stiffness: 160 }, durationInFrames: 25 });
  const line1Op    = interpolate(line1P, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const line1Y     = interpolate(line1P, [0, 1], [24, 0], { extrapolateRight: "clamp" });

  const line2P     = spring({ frame: frame - FD_LINE2, fps, config: { damping: 14, stiffness: 280 }, durationInFrames: 22 });
  const line2Op    = interpolate(line2P, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const line2Scale = interpolate(line2P, [0, 1], [0.78, 1], { extrapolateRight: "clamp" });

  const namesP     = spring({ frame: frame - FD_NAMES, fps, config: { damping: 22, stiffness: 180 }, durationInFrames: 30 });
  const namesOp    = interpolate(namesP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const namesY     = interpolate(namesP, [0, 1], [12, 0], { extrapolateRight: "clamp" });

  // Visibilite dots sur vue finale (pendant Crane Up les dots restent sur la carte)
  const showDotA = frame < F_D_END;
  const showDotB = frame >= F_AB_END - 10;
  const showDotC = frame >= F_BC_END - 5;

  const PXn = norvegeDot.x;
  const PYn = norvegeDot.y;
  const PXc = congoDot.x;
  const PYc = congoDot.y;
  const PXb = botswanaDot.x;
  const PYb = botswanaDot.y;

  const LOFF_X = 20;
  const LOFF_Y = -72;

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <MapboxBrandingHide />

      {/* Voix-off — tranche Acte 3 S1 — coupe nette apres "mecanismes." */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v1-congo-brazzaville.mp3")}
        startFrom={3979}
        endAt={5718}
        volume={1}
      />

      {/* Musique — 18%, fade-out 4s avant la fin */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        startFrom={3979}
        volume={(f) => {
          const s = f / fps;
          const fadeStart = F_D_END / fps - 4;
          if (s >= fadeStart) {
            return 0.05 * Math.max(0, 1 - (s - fadeStart) / 4);
          }
          return 0.05;
        }}
      />

      {/* Carte plein ecran */}
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(13,21,32,0.42) 100%)",
        pointerEvents: "none",
      }} />

      {/* SVG : dots + rings */}
      <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
        width={width} height={height}>

        {/* Dot Norvege */}
        {showDotA && (
          <g>
            {ringsA.map((r, i) => (
              <circle key={`rA${i}`} cx={PXn} cy={PYn} r={r.r} fill="none"
                stroke={GOLD} strokeWidth={1.5} opacity={r.op} />
            ))}
            <circle cx={PXn} cy={PYn} r={11 * dotAScale} fill={GOLD} opacity={dotAOp * glowA} />
            <circle cx={PXn} cy={PYn} r={4.5 * dotAScale} fill={IVORY} opacity={dotAOp} />
          </g>
        )}

        {/* Dot Congo */}
        {showDotB && (
          <g>
            {ringsB.map((r, i) => (
              <circle key={`rB${i}`} cx={PXc} cy={PYc} r={r.r} fill="none"
                stroke={ORANGE} strokeWidth={1.5} opacity={r.op} />
            ))}
            <circle cx={PXc} cy={PYc} r={11 * dotBScale} fill={ORANGE} opacity={dotBOp * glowB} />
            <circle cx={PXc} cy={PYc} r={4.5 * dotBScale} fill={IVORY} opacity={dotBOp} />
          </g>
        )}

        {/* Dot Botswana */}
        {showDotC && (
          <g>
            {ringsC.map((r, i) => (
              <circle key={`rC${i}`} cx={PXb} cy={PYb} r={r.r} fill="none"
                stroke={GREEN} strokeWidth={1.5} opacity={r.op} />
            ))}
            <circle cx={PXb} cy={PYb} r={11 * dotCScale} fill={GREEN} opacity={dotCOp * glowC} />
            <circle cx={PXb} cy={PYb} r={4.5 * dotCScale} fill={IVORY} opacity={dotCOp} />
          </g>
        )}
      </svg>

      {/* Label Norvege */}
      {frame < F_A_END + 60 && (
        <div style={{
          position: "absolute",
          left: PXn + LOFF_X,
          top: PYn + LOFF_Y,
          opacity: labelAOp * phaseALabelFade,
          pointerEvents: "none",
        }}>
          <div style={{
            color: GOLD, fontFamily: "sans-serif", fontWeight: 700,
            fontSize: 30, letterSpacing: 3, textTransform: "uppercase",
            transform: `translateX(${labelAX}px)`,
            textShadow: "0 2px 14px rgba(0,0,0,0.85)",
          }}>
            NORVEGE
          </div>
          <div style={{
            color: IVORY, fontFamily: "sans-serif", fontSize: 15,
            opacity: labelAOp * phaseALabelFade * 0.65,
            transform: `translateX(${labelAX}px)`,
            marginTop: 3, letterSpacing: 1,
          }}>
            petrole en mer du Nord — 1969
          </div>

          {/* Seule stat chiffree — ce que la carte peut apporter */}
          {frame >= FA_STAT && (
            <div style={{
              fontFamily: "sans-serif", fontWeight: 800, fontSize: 36,
              color: GOLD, marginTop: 8,
              opacity: statAOp,
              transform: `scale(${statAScale})`,
              transformOrigin: "left center",
              textShadow: "0 2px 18px rgba(200,169,81,0.35)",
            }}>
              1 500 Mds$
            </div>
          )}
        </div>
      )}

      {/* Label Congo — label seul, pas de sous-titres */}
      {frame >= F_AB_END - 10 && frame < F_B_END + 60 && (
        <div style={{
          position: "absolute",
          left: PXc + LOFF_X,
          top: PYc + LOFF_Y,
          opacity: labelBOp * phaseBLabelFade,
          pointerEvents: "none",
        }}>
          <div style={{
            color: ORANGE, fontFamily: "sans-serif", fontWeight: 700,
            fontSize: 30, letterSpacing: 3, textTransform: "uppercase",
            transform: `translateX(${labelBX}px)`,
            textShadow: "0 2px 14px rgba(0,0,0,0.85)",
          }}>
            CONGO
          </div>
          <div style={{
            color: IVORY, fontFamily: "sans-serif", fontSize: 15,
            opacity: labelBOp * 0.65,
            transform: `translateX(${labelBX}px)`,
            marginTop: 3, letterSpacing: 1,
          }}>
            petrole offshore — Pointe-Noire
          </div>
        </div>
      )}

      {/* Label Botswana — label seul */}
      {frame >= F_BC_END - 5 && frame < F_C_END + 80 && (
        <div style={{
          position: "absolute",
          left: PXb + LOFF_X,
          top: PYb + LOFF_Y,
          opacity: labelCOp * phaseCLabelFade,
          pointerEvents: "none",
        }}>
          <div style={{
            color: GREEN, fontFamily: "sans-serif", fontWeight: 700,
            fontSize: 30, letterSpacing: 3, textTransform: "uppercase",
            transform: `translateX(${labelCX}px)`,
            textShadow: "0 2px 14px rgba(0,0,0,0.85)",
          }}>
            BOTSWANA
          </div>
          <div style={{
            color: IVORY, fontFamily: "sans-serif", fontSize: 15,
            opacity: labelCOp * 0.65,
            transform: `translateX(${labelCX}px)`,
            marginTop: 3, letterSpacing: 1,
          }}>
            mine de diamants — Jwaneng
          </div>
        </div>
      )}

      {/* Phase D : Punchline — style Or Africain overlay */}
      {frame >= FD_OVERLAY && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-end",
          paddingBottom: 130,
          pointerEvents: "none",
          opacity: overlayOp,
        }}>
          {/* Fond degrade bas */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 340,
            background: "linear-gradient(to top, rgba(13,21,32,0.82) 0%, transparent 100%)",
          }} />

          {/* Ligne 1 — "3 pays." sobre */}
          <div style={{
            position: "relative", textAlign: "center",
            opacity: line1Op,
            transform: `translateY(${line1Y}px)`,
            marginBottom: 4,
          }}>
            <div style={{
              color: IVORY, fontFamily: "sans-serif", fontSize: 42,
              fontWeight: 300, letterSpacing: 3,
              textShadow: "0 2px 24px rgba(0,0,0,0.95)",
            }}>
              3 pays.
            </div>
          </div>

          {/* Ligne 2 — emphase gold massive */}
          <div style={{
            position: "relative", textAlign: "center",
            opacity: line2Op,
            transform: `scale(${line2Scale})`,
          }}>
            <div style={{
              color: GOLD, fontFamily: "sans-serif", fontSize: 64,
              fontWeight: 900, letterSpacing: 3, textTransform: "uppercase",
              textShadow: "0 4px 40px rgba(200,169,81,0.45)",
            }}>
              3 mecanismes differents.
            </div>
          </div>
        </div>
      )}

      {/* SFX — pings apparition dots (Norvege, Congo, Botswana) */}
      {frame === FA_DOT + 5 && <Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.4} />}
      {frame === FB_DOT + 5 && <Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.4} />}
      {frame === FC_DOT + 5 && <Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.4} />}

      {/* SFX — Pull Back Reveal (caler sur debut dezoom) */}
      {frame === F_A_END && <Audio src={staticFile("_shared/sfx/camera/sfx-swoosh-pullback.mp3")} volume={0.35} />}
      {frame === F_B_END && <Audio src={staticFile("_shared/sfx/camera/sfx-swoosh-pullback.mp3")} volume={0.35} />}

      {/* Sources */}
      <SourceTag source="NBIM — Rapport annuel 2025" startFrame={F_A_END} endFrame={F_AB_END + 300} />
      <SourceTag source="Banque mondiale — Botswana" startFrame={F_BC_END} endFrame={F_C_END} />
    </AbsoluteFill>
  );
};
