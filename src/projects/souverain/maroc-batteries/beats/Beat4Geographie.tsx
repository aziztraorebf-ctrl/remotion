import React, { useEffect, useRef } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  applyGeoAfriqueV5,
  MapboxBrandingHide,
  MAPBOX_STYLES,
  lerpCam,
  camCountryApproach,
  CamState,
} from "../../../_shared/mapbox/MapboxBase";
import { countryFilter, pushCanvas } from "../../../_shared/mapbox/flagCanvas";
import { drawResourceTexture } from "../../../_shared/mapbox/resourceTextures";
import { useClipFlags, ClipFlagsLayer, ClipFlag } from "../../../_shared/mapbox/useClipFlags";
import { ConvergingFlows } from "../../../_shared/mapbox/ConvergingFlows";
import { SEGMENTS } from "../timing";
import { MAROC_WORDS } from "../maroc-words";

// Beat 4 — Géographie industrielle (~37s, MAPBOX)
//
// 3 sub-moments :
//   SUB 1 (f0→f440)   "Pour le Maroc..." — Maroc drapeau ondulant + plaque OCP
//   SUB 2 (f440→f880) "Pour l'Europe..." — drift vers détroit Gibraltar + VW popup + arc 179km
//   SUB 3 (f880→end)  "Le triangle..."  — pull back planétaire + ConvergingFlows CHN+ESP→MAR
//                                         + GeoClimaxOverlay "GÉOGRAPHIE INDUSTRIELLE"

const SEG      = SEGMENTS.beat4_geographie;
const DURATION = SEG.endFrame - SEG.startFrame; // 1123f

const GOLD  = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY  = "#16213a";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Coordonnées clés
const MAR_CENTER:   [number, number] = [-7.09, 31.79];
const KHOURIBGA:    [number, number] = [-6.91, 32.88]; // mines de phosphate (brut)
const JORF_LASFAR:  [number, number] = [-8.62, 33.11]; // complexe chimique (transformation)
const KENITRA:      [number, number] = [-6.58, 34.26]; // gigafactory (composants)
const MADRID:       [number, number] = [-3.7,  40.4];
const EUROPE_HUB:   [number, number] = [9.0,   50.0];  // cœur industriel européen (Wolfsburg/Ruhr)
const CHN_CENTER:   [number, number] = [104.0, 35.0];

// Frames locales — dérivées des word anchors (startS = 60.639)
// "composants"           71.18 → f316
// "l'Europe"             75.459 → f441  (sub2 commence)
// "Volkswagen" (sub2)    80.5   → f596
// "deux heures bateau"   84.18  → f712
// "entre Chine/Europe"   88.36  → f833  (sub3 commence ~= pull back)
// "fabriquent ensemble"  92.279 → f950
const F_PHOSPHATE    = 60;   // texture phosphate apparait (apres settle camera)
const F_TRANSFORM    = 220;  // flux brut->transforme commence (chaine de valeur)
const F_OCP_POPUP    = 316;  // popup donnee OCP (mot "composants")
const F_SUB2         = 441;
const F_DIST_ARCS    = 560;  // arcs comparatifs distance (cale avant Volkswagen)
const F_VW_POPUP     = 660;  // popup VW apres l'argument distance
const F_SUB3         = 833;
const F_WHIP_END     = 893;  // fin du whip pan (60f)
const F_FLOWS_START  = 893;
const F_ENSEMBLE     = 950;
const F_END          = DURATION;

// ── Caméras ───────────────────────────────────────────────────────────────────
// SUB1 : on SUIT la chaine de valeur — Khouribga (mines) -> Kenitra (usine), vue qui remonte.
const CAM_KHOURIBGA: CamState = camCountryApproach(KHOURIBGA, { zoom: 6.4, pitch: 38, bearing: -8 });
const CAM_TRANSFORM: CamState = camCountryApproach([-7.4, 33.4], { zoom: 6.0, pitch: 36, bearing: -2 });
const CAM_MAR_WIDE:  CamState = camCountryApproach(MAR_CENTER, { zoom: 4.9, pitch: 32, bearing: 6 });
const CAM_GIBRALTAR: CamState = { lon: -5.8, lat: 35.4, zoom: 5.0, pitch: 28, bearing: 12 };
const CAM_PULLBACK:  CamState = { lon: 30.0, lat: 28.0, zoom: 2.4, pitch: 0, bearing: 0 };
const CAM_HOLD:      CamState = { lon: 30.0, lat: 28.0, zoom: 2.4, pitch: 0, bearing: 0.5 };

function getCam(frame: number): CamState {
  // SUB 1a : serre sur les mines de Khouribga, drift
  if (frame < F_TRANSFORM) {
    const t = frame / F_TRANSFORM;
    return lerpCam(CAM_KHOURIBGA, CAM_TRANSFORM, t);
  }
  // SUB 1b : remonte/recule vers vue Maroc entier (on a suivi la chaine)
  if (frame < F_SUB2) {
    const t = (frame - F_TRANSFORM) / (F_SUB2 - F_TRANSFORM);
    return lerpCam(CAM_TRANSFORM, CAM_MAR_WIDE, t);
  }
  // SUB 2 : drift vers le détroit de Gibraltar
  if (frame < F_SUB3) {
    const t = (frame - F_SUB2) / (F_SUB3 - F_SUB2);
    return lerpCam(CAM_MAR_WIDE, CAM_GIBRALTAR, t);
  }
  // Whip pan vers vue planétaire (60f)
  if (frame < F_WHIP_END) {
    const t = (frame - F_SUB3) / (F_WHIP_END - F_SUB3);
    return lerpCam(CAM_GIBRALTAR, CAM_PULLBACK, t);
  }
  // SUB 3 : hold + drift très lent (bearing + 0.02/frame)
  const driftF = frame - F_WHIP_END;
  return { ...CAM_HOLD, bearing: driftF * 0.02 };
}

function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }
function easeOut(t: number) { return 1 - Math.pow(1 - clamp01(t), 3); }

// Blur overlay pour le whip pan
const WhipBlur: React.FC<{ frame: number }> = ({ frame }) => {
  const t = clamp01((frame - F_SUB3) / 60);
  const blur = t < 0.5
    ? interpolate(t, [0, 0.5], [0, 12])
    : interpolate(t, [0.5, 1], [12, 0]);
  if (blur < 0.5) return null;
  return (
    <AbsoluteFill style={{ backdropFilter: `blur(${blur}px)`, pointerEvents: "none", zIndex: 5 }} />
  );
};

// Karaoké — pattern identique Beat3
type WordTs = [string, number, number];
function buildPhrases(words: WordTs[], beatStartS: number) {
  const phrases: { words: WordTs[]; start: number; end: number }[] = [];
  let current: WordTs[] = [];
  for (let i = 0; i < words.length; i++) {
    current.push(words[i]);
    const next = words[i + 1];
    const gap = next ? next[1] - words[i][2] : 999;
    if (gap > 0.45 || current.length >= 6 || !next) {
      phrases.push({ words: [...current], start: current[0][1] - beatStartS, end: current[current.length - 1][2] - beatStartS });
      current = [];
    }
  }
  return phrases;
}

const KaraokeSubtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentS = SEG.startS + frame / fps;
  const beatWords = MAROC_WORDS.filter(w => w[1] >= SEG.startS - 0.05 && w[2] <= SEG.endS + 0.1);
  const phrases = buildPhrases(beatWords, SEG.startS);
  const hardShadow = "2px 2px 0 #000,-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,0 0 8px rgba(0,0,0,0.9)";
  const goldGlow   = "0 0 16px rgba(200,169,81,0.8),2px 2px 0 #000,-2px -2px 0 #000";
  return (
    <div style={{ position: "absolute", bottom: 160, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      {phrases.map((phrase, i) => {
        const nextStart = phrases[i + 1]?.start ?? SEG.durationS;
        const localFrame = frame - Math.round(phrase.start * fps);
        const displayFrames = Math.round((nextStart - phrase.start) * fps) + 5;
        if (localFrame < 0 || localFrame > displayFrames) return null;
        const fadeIn  = spring({ frame: localFrame, fps, config: { damping: 35, stiffness: 130 } });
        const fadeOut = interpolate(localFrame, [displayFrames - 6, displayFrames + 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, opacity: Math.min(fadeIn, fadeOut), textAlign: "center", padding: "0 48px" }}>
            <div style={{ display: "inline-block", background: "linear-gradient(180deg,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.65) 100%)", padding: "14px 24px", borderRadius: 12 }}>
              <p style={{ fontFamily: "'Anton',sans-serif", fontSize: 54, fontWeight: 400, margin: 0, lineHeight: 1.15, letterSpacing: "0.02em", textTransform: "uppercase", wordBreak: "break-word" }}>
                {phrase.words.map((w, j) => (
                  <span key={j} style={{ color: currentS >= w[1] ? GOLD : "#fff", textShadow: currentS >= w[1] ? goldGlow : hardShadow, marginRight: 10, display: "inline-block" }}>{w[0]}</span>
                ))}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Drapeaux useClipFlags — ESP + CHN seulement (le Maroc = texture phosphate, pas drapeau)
const CLIP_FLAGS: ClipFlag[] = [
  { iso: "ESP", geoNames: ["Spain"], flagFile: "es.png", at: F_SUB2, bgColor: "#aa151b", mainlandBox: [-10, 35, 5, 44] },
  { iso: "CHN", geoNames: ["China"], flagFile: "cn.png", at: F_SUB3, bgColor: "#de2910" },
];

// ── Composant principal ───────────────────────────────────────────────────────
export const Beat4Geographie: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const setupRef     = useRef(false);

  const { paths: flagPaths, ready: flagsReady } = useClipFlags(mapRef, CLIP_FLAGS, frame);

  // Position projetée de Kénitra pour popups
  const kenitraPos = (() => {
    const m = mapRef.current;
    if (!m) return null;
    try { const p = m.project(KENITRA); return { x: p.x, y: p.y }; } catch { return null; }
  })();

  // Init Mapbox
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const cam0 = getCam(0);
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [cam0.lon, cam0.lat], zoom: cam0.zoom, pitch: cam0.pitch, bearing: cam0.bearing,
      interactive: false, attributionControl: false, fadeDuration: 0, preserveDrawingBuffer: true,
    });
    map.on("style.load", () => {
      try {
        (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
        applyGeoAfriqueV5(map);
        if (!map.getSource("cb")) map.addSource("cb", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });

        // Texture PHOSPHATE projetee dans le Maroc (fill-pattern bichromie navy/gold)
        // = "le Maroc EST une mine de phosphate" — montre la ressource, ne la dit pas.
        pushCanvas(map, "tex-phosphate", drawResourceTexture("phosphate", 256));
        if (!map.getLayer("b4-mar-phosphate")) {
          map.addLayer({ id: "b4-mar-phosphate", type: "fill", source: "cb", "source-layer": "country_boundaries",
            filter: countryFilter("MAR", ["ESH"]),
            paint: { "fill-pattern": "tex-phosphate", "fill-opacity": 0 } });
        }

        // Bordure gold Maroc (toujours visible en SUB1/2)
        if (!map.getLayer("b4-border-MAR")) {
          map.addLayer({ id: "b4-border-MAR", type: "line", source: "cb", "source-layer": "country_boundaries",
            filter: countryFilter("MAR", ["ESH"]),
            paint: { "line-color": GOLD, "line-width": 2.0, "line-opacity": 0 } });
        }
        // Bordures gold pays drapeaux (ESP, CHN)
        for (const cf of CLIP_FLAGS) {
          if (!map.getLayer(`b4-border-${cf.iso}`)) {
            map.addLayer({ id: `b4-border-${cf.iso}`, type: "line", source: "cb", "source-layer": "country_boundaries",
              filter: countryFilter(cf.iso, []),
              paint: { "line-color": GOLD, "line-width": 1.6, "line-opacity": 0 } });
          }
        }

        // FLUX chaine de valeur : Khouribga (brut) -> Jorf Lasfar (transforme) -> Kenitra (composants)
        if (!map.getSource("b4-chain")) {
          map.addSource("b4-chain", { type: "geojson", data: { type: "Feature",
            geometry: { type: "LineString", coordinates: [KHOURIBGA, JORF_LASFAR, KENITRA] },
            properties: {} } });
        }
        if (!map.getLayer("b4-chain-glow")) map.addLayer({ id: "b4-chain-glow", type: "line", source: "b4-chain", paint: { "line-color": GOLD, "line-width": 7, "line-opacity": 0, "line-blur": 5 } });
        if (!map.getLayer("b4-chain-line")) map.addLayer({ id: "b4-chain-line", type: "line", source: "b4-chain", paint: { "line-color": GOLD, "line-width": 2.5, "line-dasharray": [2, 3], "line-opacity": 0 } });

        setupRef.current = true;
      } catch (_e) {}
    });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; setupRef.current = false; };
  }, []);

  // Engine frame
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const cam = getCam(frame);
    map.jumpTo({ center: [cam.lon, cam.lat], zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing });
    if (!setupRef.current) return;
    const safe = (id: string, prop: string, val: unknown) => {
      try { if (map.getLayer(id)) (map.setPaintProperty as (a: string, b: string, c: unknown) => void)(id, prop, val); } catch (_e) {}
    };

    // Texture phosphate Maroc — fade-in f60, reste jusqu'au pull back
    const phosOp = interpolate(frame, [F_PHOSPHATE, F_PHOSPHATE + 30, F_SUB3, F_WHIP_END], [0, 0.88, 0.88, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    safe("b4-mar-phosphate", "fill-opacity", phosOp);

    // Bordure Maroc — visible des f50, s'eteint au pull back
    const marBorderOp = interpolate(frame, [50, 70, F_SUB3, F_WHIP_END], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    safe("b4-border-MAR", "line-opacity", marBorderOp);

    // Bordures gold ESP/CHN — synchro allumage drapeaux
    for (const cf of CLIP_FLAGS) {
      const op = easeOut(clamp01((frame - cf.at) / 20));
      safe(`b4-border-${cf.iso}`, "line-opacity", op);
    }

    // Flux chaine de valeur Khouribga->Jorf->Kenitra (SUB1, f220→pull back)
    if (frame >= F_TRANSFORM) {
      const cp = easeOut(clamp01((frame - F_TRANSFORM) / 45));
      const fade = interpolate(frame, [F_SUB3, F_WHIP_END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      safe("b4-chain-line", "line-opacity", cp * 0.95 * fade);
      safe("b4-chain-glow", "line-opacity", cp * 0.30 * fade);
      const off = ((frame - F_TRANSFORM) * 0.6) % 5;
      safe("b4-chain-line", "line-dasharray", [Math.max(1, 2 - off * 0.1), Math.max(2, 3 + off * 0.1)]);
    }
  });

  // ── Opacités overlays ─────────────────────────────────────────────────────
  // Popup donnee OCP (donnee NON-DITE par la voix) : apparait f316
  const ocpOp   = interpolate(frame, [F_OCP_POPUP, F_OCP_POPUP + 18, F_SUB2 - 15, F_SUB2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Popup VW (donnee : montant investi) : apparait f660
  const vwOp    = interpolate(frame, [F_VW_POPUP, F_VW_POPUP + 18, F_SUB3 - 20, F_SUB3], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ConvergingFlows : CHN+ESP après pull back
  const showFlows = frame >= F_FLOWS_START;

  // Audio
  const volNarr  = interpolate(frame, [0, 8, F_END - 12, F_END], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const volMusic = interpolate(frame, [0, 20, F_END - 20, F_END], [0, 0.13, 0.13, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* Audio */}
      <Audio src={staticFile("souverain/maroc-batteries/audio/narration-maroc-v3.mp3")} startFrom={SEG.startFrame} volume={volNarr} />
      <Audio src={staticFile("souverain/maroc-batteries/audio/music-C-analytique-tendu.mp3")} startFrom={SEG.startFrame} volume={volMusic} />

      {/* SFX — <Sequence> OBLIGATOIRE, pas frame===X */}
      <Sequence from={0}            durationInFrames={30}><Audio src={staticFile("_shared/sfx/camera/sfx-swoosh-zoomin.mp3")} volume={0.50} /></Sequence>
      <Sequence from={F_TRANSFORM}  durationInFrames={20}><Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.45} /></Sequence>
      <Sequence from={F_OCP_POPUP}  durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.55} /></Sequence>
      <Sequence from={F_SUB2}       durationInFrames={30}><Audio src={staticFile("_shared/sfx/camera/sfx-swoosh-pullback.mp3")} volume={0.50} /></Sequence>
      <Sequence from={F_DIST_ARCS}  durationInFrames={20}><Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.50} /></Sequence>
      <Sequence from={F_VW_POPUP}   durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.55} /></Sequence>
      <Sequence from={F_SUB3}       durationInFrames={30}><Audio src={staticFile("_shared/sfx/camera/sfx-swoosh-pullback.mp3")} volume={0.55} /></Sequence>
      <Sequence from={F_ENSEMBLE}   durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.60} /></Sequence>

      {/* Carte Mapbox */}
      <div ref={containerRef} style={{ position: "absolute", inset: 0, backgroundColor: NAVY }} />
      <MapboxBrandingHide />

      {/* Vignette narrative */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(22,33,58,0.35) 0%,rgba(22,33,58,0.0) 40%,rgba(22,33,58,0.30) 100%)", pointerEvents: "none" }} />

      {/* Drapeaux clippes (vraies images) */}
      {flagsReady && (
        <ClipFlagsLayer width={width} height={height} flags={CLIP_FLAGS} paths={flagPaths} frame={frame} idPrefix="b4" />
      )}

      {/* SUB2 — ARCS DISTANCE COMPARÉE (l'argument géographique en image) :
          arc COURT Maroc→Europe (2 jours) vs arc LONG Chine→Europe (~40 jours).
          La voix dit "sans délocaliser loin" — nous, on PROUVE à quel point c'est plus proche. */}
      {frame >= F_DIST_ARCS && frame < F_SUB3 && (
        <ConvergingFlows
          frame={frame - F_DIST_ARCS}
          map={mapRef.current}
          destination={EUROPE_HUB}
          sources={[
            { coord: KENITRA,    at: 0,  duration: 40, label: "2 JOURS",   color: GOLD },
            { coord: CHN_CENTER, at: 20, duration: 90, label: "~40 JOURS", color: "#c0392b" },
          ]}
          color={GOLD}
          glowColor="rgba(200,169,81,0.30)"
          strokeWidth={2.5}
          destColor={IVORY}
        />
      )}

      {/* SUB3 — ConvergingFlows CHN+ESP → Kénitra (le triangle converge sur le Maroc) */}
      {showFlows && (
        <ConvergingFlows
          frame={frame - F_FLOWS_START}
          map={mapRef.current}
          destination={KENITRA}
          sources={[
            { coord: CHN_CENTER, at: 0,  duration: 90, label: "CHINE",  color: "#de2910" },
            { coord: MADRID,     at: 15, duration: 75, label: "EUROPE", color: IVORY },
          ]}
          color={GOLD}
          glowColor="rgba(200,169,81,0.35)"
          strokeWidth={2.5}
          destPulseAt={F_ENSEMBLE - F_FLOWS_START}
          destColor={GOLD}
        />
      )}

      {/* Whip blur overlay */}
      <WhipBlur frame={frame} />

      {/* SUB1 — Popup donnée OCP : 1er exportateur mondial (donnée NON-DITE par la voix) */}
      {ocpOp > 0.01 && kenitraPos && (
        <div style={{
          position: "absolute",
          left: Math.min(kenitraPos.x + 24, width - 360),
          top: Math.max(kenitraPos.y - 100, 80),
          opacity: ocpOp,
          transform: `translateX(${(1 - ocpOp) * 16}px)`,
          pointerEvents: "none",
        }}>
          <div style={{ display: "flex", alignItems: "stretch", minHeight: 66 }}>
            <div style={{ width: 4, background: GOLD, borderRadius: 2, flexShrink: 0 }} />
            <div style={{ background: "rgba(13,21,37,0.92)", padding: "8px 16px", display: "flex", flexDirection: "column", justifyContent: "center", border: "1px solid rgba(200,169,81,0.25)", borderLeft: "none" }}>
              <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 32, color: GOLD, lineHeight: 1.0 }}>OCP · 70% des réserves mondiales</span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: IVORY, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.8, marginTop: 4 }}>Du minerai brut au composant — USGS 2024</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB2 — Popup VW : montant investi (donnée NON-DITE) */}
      {vwOp > 0.01 && kenitraPos && (
        <div style={{
          position: "absolute",
          left: Math.min(kenitraPos.x + 24, width - 340),
          top: Math.max(kenitraPos.y - 70, 80),
          opacity: vwOp,
          transform: `translateX(${(1 - vwOp) * 14}px)`,
          pointerEvents: "none",
        }}>
          <div style={{ display: "flex", alignItems: "stretch", minHeight: 64 }}>
            <div style={{ width: 4, background: "#5b9dff", borderRadius: 2, flexShrink: 0 }} />
            <div style={{ background: "rgba(13,21,37,0.92)", padding: "8px 16px", display: "flex", flexDirection: "column", justifyContent: "center", border: "1px solid rgba(200,169,81,0.25)", borderLeft: "none" }}>
              <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 30, color: "#5b9dff", lineHeight: 1.0, letterSpacing: "0.02em" }}>VOLKSWAGEN · 1,3 Md€</span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: IVORY, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.8, marginTop: 4 }}>Gigafactory cathodes · Kénitra</span>
            </div>
          </div>
        </div>
      )}

      {/* Karaoké */}
      <KaraokeSubtitles />
    </AbsoluteFill>
  );
};
