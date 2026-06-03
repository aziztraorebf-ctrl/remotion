import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  continueRender,
  delayRender,
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
import { countryFilter } from "../../../_shared/mapbox/flagCanvas";
import { GeoCountryPlaque } from "../../../_shared/mapbox/GeoCountryPlaque";
import { feature } from "topojson-client";
import { SEGMENTS } from "../timing";
import { MAROC_WORDS } from "../maroc-words";

// Beat 3 — Acteurs Gotion/VW (V3 — feedback Aziz)
//   Temps 1 (LOCAL, 0-5s) : Kenitra serre, pitch 32, Maroc DRAPEAU statique (fill-pattern,
//                           PAS gold uni cheap) + popup "GIGAFACTORY 156 ha".
//   Temps 2 (PULL BACK rapide, ~5s) : recul vers vue monde Mercator (zoom 1.0).
//   Temps 3 (vue monde) : drapeaux STATIQUES (pas de pulse) s'allument SYNCHRO VOIX :
//     - Maroc deja allume (drapeau depuis le debut)
//     - "Gotion High-Tech chinois" (~5s) -> Chine s'allume + plaque GOTION
//     - "Volkswagen 40%" (~9s)          -> Allemagne s'allume + plaque VW + arc Wolfsburg
//     Chaque pays RESTE allume -> fin sur les 3 drapeaux ensemble.
// Pas de texte "Demarrage 2026" — la carte parle (decision Aziz).

const SEG      = SEGMENTS.beat3_acteurs;
const DURATION = SEG.endFrame - SEG.startFrame; // 475

const GOLD  = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY  = "#16213a";
const RED_CN = "#de2910"; // rouge Chine / Gotion
const BLUE_VW = "#3a6ea5"; // bleu VW (eclairci pour lisibilite sur navy)

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const KENITRA: [number, number]   = [-6.58, 34.26];
const WOLFSBURG: [number, number] = [10.78, 52.42];
const TOPO_PATH = "_shared/geo-data/countries-50m.json";

// Les 3 pays a remplir avec leur drapeau (clip SVG net a toute echelle).
// at = frame d'allumage (synchro voix). MAR = 0 (des le debut).
const FLAG_COUNTRIES = [
  { iso: "MAR", geoNames: ["Morocco", "W. Sahara"], at: 0,   centroid: [-6, 32] as [number, number] },
  { iso: "CHN", geoNames: ["China"],                at: 189, centroid: [104, 35] as [number, number] },
  { iso: "DEU", geoNames: ["Germany"],              at: 267, centroid: [10, 51] as [number, number] },
];

// Vraies images drapeaux officiels HD (Wikimedia SVG -> PNG) dans public/_shared/flags/
const FLAG_FILES: Record<string, string> = { MAR: "ma.png", CHN: "cn.png", DEU: "de.png" };

// ── Timing local (forced alignment, beat demarre a f1342 = 44.719s) ──────────────
// "Kenitra" 45.539  → f24
// "gigafactory" 46.84 → f63
// "156 hectares" 48.159-49.219 → f97
// "Gotion High-Tech chinois" 51.02 → f189
// "Volkswagen 40%" 53.639 → f267
// "Demarrage mi-2026" 57.18 → f373
const F_KENITRA_POP = 24;   // GlassPopup gigafactory 156 ha (mot "Kenitra" ~f24)
const F_PULLBACK    = 150;  // debut recul planetaire (~5s, avant "Gotion")
const F_PULLBACK_END = 240; // vue monde atteinte
const F_GOTION      = 189;  // "Gotion High-Tech chinois" -> Chine s'allume + plaque
const F_VW          = 267;  // "Volkswagen 40%" -> Allemagne s'allume + plaque
const F_CHN_FLAG    = F_GOTION;  // drapeau Chine synchro plaque Gotion
const F_DEU_FLAG    = F_VW;      // drapeau Allemagne synchro plaque VW
const F_END         = DURATION;

// ── Camera : Temps 1 Kenitra (pitch 32) → Temps 2 pull back monde ────────────────
const CAM_KENITRA: CamState = camCountryApproach(KENITRA, { zoom: 6.2, pitch: 32, bearing: -4 });
const CAM_KENITRA_END: CamState = camCountryApproach(KENITRA, { zoom: 6.0, pitch: 32, bearing: 4 });
const CAM_GLOBAL: CamState = { lon: 20, lat: 25, zoom: 1.0, pitch: 0, bearing: 0 };

function getCam(frame: number): CamState {
  // Temps 1 : drift sur Kenitra (0 -> f150, ~5s)
  if (frame < F_PULLBACK) {
    const t = frame / F_PULLBACK;
    return lerpCam(CAM_KENITRA, CAM_KENITRA_END, t);
  }
  // Temps 2 : pull back rapide Kenitra -> vue monde (f150 -> f240)
  if (frame < F_PULLBACK_END) {
    const t = (frame - F_PULLBACK) / (F_PULLBACK_END - F_PULLBACK);
    return lerpCam(CAM_KENITRA_END, CAM_GLOBAL, t);
  }
  // Temps 3 : hold vue monde (les pays s'allument ici)
  return CAM_GLOBAL;
}

function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }
function easeOut(t: number) { return 1 - Math.pow(1 - clamp01(t), 3); }

// ── GlassPopup geolocalise (Kenitra : GIGAFACTORY / 156 ha) ──────────────────────
const GeoPopup: React.FC<{
  pos: { x: number; y: number } | null;
  opacity: number;
  sp: number;
  title: string;
  value: string;
}> = ({ pos, opacity, sp, title, value }) => {
  if (!pos || opacity <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: pos.x + 30, top: pos.y - 42, opacity, transform: `translateX(${(1 - sp) * 16}px)`, pointerEvents: "none" }}>
      <svg style={{ position: "absolute", left: -30, top: 30, overflow: "visible" }} width={30} height={1}>
        <line x1={0} y1={0} x2={30} y2={0} stroke={GOLD} strokeWidth={1.5} strokeOpacity={0.8} />
        <circle cx={0} cy={0} r={3} fill={GOLD} />
      </svg>
      <div style={{ display: "flex", alignItems: "stretch", height: 64 }}>
        <div style={{ width: 4, background: GOLD, borderRadius: 2, flexShrink: 0 }} />
        <div style={{ background: "rgba(13,21,37,0.92)", padding: "0 16px", display: "flex", flexDirection: "column", justifyContent: "center", border: "1px solid rgba(200,169,81,0.25)", borderLeft: "none" }}>
          <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 30, color: GOLD, lineHeight: 1.05, letterSpacing: "0.02em" }}>{value}</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: IVORY, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.8 }}>{title}</span>
        </div>
      </div>
    </div>
  );
};

// ── Karaoke (reutilise pattern Beat1) ────────────────────────────────────────────
type WordTs = [string, number, number];
function buildPhrases(words: WordTs[], beatStartS: number) {
  const phrases: { words: WordTs[]; start: number; end: number }[] = [];
  let current: WordTs[] = [];
  for (let i = 0; i < words.length; i++) {
    current.push(words[i]);
    const next = words[i + 1]; const gap = next ? next[1] - words[i][2] : 999;
    if (gap > 0.4 || current.length >= 6 || !next) {
      phrases.push({ words: [...current], start: current[0][1] - beatStartS, end: current[current.length - 1][2] - beatStartS });
      current = [];
    }
  }
  return phrases;
}

const KaraokeSubtitles: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
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

// ── Composant principal ──────────────────────────────────────────────────────────
export const Beat3Acteurs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const setupRef     = useRef(false);

  const [kenitraPos,   setKenitraPos]   = useState<{ x: number; y: number } | null>(null);
  const [wolfsburgPos, setWolfsburgPos] = useState<{ x: number; y: number } | null>(null);

  // Geometries (anneaux lon/lat) + drapeau dataURL par pays
  const ringsRef    = useRef<Record<string, number[][][]>>({});
  const flagUrlRef  = useRef<Record<string, string>>({});
  const [geoHandle] = useState(() => delayRender("Beat3 geo+flags"));
  const [assetsReady, setAssetsReady] = useState(false);

  // Path SVG reprojete + bbox par pays (recalcule chaque frame)
  const [projPaths, setProjPaths] = useState<Record<string, { path: string; bbox: { x: number; y: number; w: number; h: number } }>>({});
  // Centroides projetes (pour les lignes de connexion)

  // ── Charger geometries (topojson) + vraies images drapeaux HD (local, headless-safe) ──
  useEffect(() => {
    let cancelled = false;
    // Vraies images drapeaux officiels (Wikimedia SVG -> PNG HD), pas de dessin approximatif.
    // staticFile -> chemin local, on l'utilise directement comme href SVG <image>.
    for (const fc of FLAG_COUNTRIES) {
      flagUrlRef.current[fc.iso] = staticFile(`_shared/flags/${FLAG_FILES[fc.iso]}`);
    }
    fetch(staticFile(TOPO_PATH))
      .then(r => r.json())
      .then((topo: any) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries) as unknown as { features: any[] };
        for (const country of FLAG_COUNTRIES) {
          const rings: number[][][] = [];
          for (const nm of country.geoNames) {
            const feat = fc.features.find((f: any) => f.properties?.name === nm);
            if (!feat) continue;
            const g = feat.geometry;
            if (g.type === "Polygon") rings.push(...(g.coordinates as number[][][]));
            else if (g.type === "MultiPolygon") for (const poly of g.coordinates) rings.push(...(poly as number[][][]));
          }
          ringsRef.current[country.iso] = rings;
        }
        setAssetsReady(true);
        continueRender(geoHandle);
      })
      .catch(() => { continueRender(geoHandle); });
    return () => { cancelled = true; try { continueRender(geoHandle); } catch (_e) {} };
  }, [geoHandle]);

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

        // Bordures gold des pays focus (le drapeau vient de l'overlay SVG clippe)
        for (const fc of FLAG_COUNTRIES) {
          const boundary = fc.iso === "MAR" ? ["ESH"] : [];
          if (!map.getLayer(`b3-border-${fc.iso}`)) {
            map.addLayer({ id: `b3-border-${fc.iso}`, type: "line", source: "cb", "source-layer": "country_boundaries",
              filter: countryFilter(fc.iso, boundary), paint: { "line-color": GOLD, "line-width": 1.5, "line-opacity": 0 } });
          }
        }

        // Arc Kenitra -> Wolfsburg (dasharray gold, physique sur la carte)
        if (!map.getSource("b3-arc")) map.addSource("b3-arc", { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: [KENITRA, [0, 44], WOLFSBURG] }, properties: {} } });
        if (!map.getLayer("b3-arc-glow")) map.addLayer({ id: "b3-arc-glow", type: "line", source: "b3-arc", paint: { "line-color": GOLD, "line-width": 8, "line-opacity": 0, "line-blur": 6 } });
        if (!map.getLayer("b3-arc-line")) map.addLayer({ id: "b3-arc-line", type: "line", source: "b3-arc", paint: { "line-color": GOLD, "line-width": 2, "line-dasharray": [3, 4], "line-opacity": 0 } });

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

    try {
      const pk = map.project(KENITRA);   setKenitraPos({ x: pk.x, y: pk.y });
      const pw = map.project(WOLFSBURG); setWolfsburgPos({ x: pw.x, y: pw.y });
    } catch (_e) {}

    // Reprojeter les silhouettes des pays allumes (clip SVG colle a la carte)
    if (assetsReady) {
      const newPaths: Record<string, { path: string; bbox: { x: number; y: number; w: number; h: number } }> = {};
      for (const country of FLAG_COUNTRIES) {
        if (frame < country.at) continue;
        const rings = ringsRef.current[country.iso];
        if (!rings || !rings.length) continue;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const parts: string[] = [];
        for (const ring of rings) {
          let dseg = "";
          ring.forEach((coord, i) => {
            const p = map.project(coord as [number, number]);
            if (p.x < minX) minX = p.x; if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x; if (p.y > maxY) maxY = p.y;
            dseg += `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          });
          dseg += "Z";
          parts.push(dseg);
        }
        newPaths[country.iso] = { path: parts.join(" "), bbox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY } };
        // Centroide = centre de la bbox ecran (toujours dispo, pas de projection separee)
      }
      setProjPaths(newPaths);
    }

    if (!setupRef.current) return;
    const safe = (id: string, prop: string, val: unknown) => {
      try { if (map.getLayer(id)) (map.setPaintProperty as (a: string, b: string, c: unknown) => void)(id, prop, val); } catch (_e) {}
    };

    // Bordures gold (fade-in synchro allumage)
    for (const fc of FLAG_COUNTRIES) {
      if (frame < fc.at) continue;
      const fadeIn = easeOut(clamp01((frame - fc.at) / 20));
      safe(`b3-border-${fc.iso}`, "line-opacity", fadeIn);
    }

    // Arc Kenitra->Wolfsburg : se dessine quand l'Allemagne s'allume
    if (frame >= F_DEU_FLAG) {
      const ap = easeOut(clamp01((frame - F_DEU_FLAG) / 40));
      safe("b3-arc-line", "line-opacity", ap * 0.9);
      safe("b3-arc-glow", "line-opacity", ap * 0.25);
      const off = ((frame - F_DEU_FLAG) * 0.5) % 7;
      safe("b3-arc-line", "line-dasharray", [Math.max(1, 3 - off * 0.1), Math.max(2, 4 + off * 0.1)]);
    }
  });

  // ── Overlays calcules ─────────────────────────────────────────────────────────
  // Popup Kenitra + dot : visibles en Temps 1, disparaissent au debut du pull back
  const popupOp = interpolate(frame, [F_KENITRA_POP, F_KENITRA_POP + 20, F_PULLBACK - 10, F_PULLBACK + 15], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const popupSp = spring({ frame: Math.max(0, frame - F_KENITRA_POP), fps, config: { damping: 16 }, durationInFrames: 25 });

  const kenitraDotOp = interpolate(frame, [10, 30, F_PULLBACK - 10, F_PULLBACK + 15], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const volNarr  = interpolate(frame, [0, 8, F_END - 12, F_END], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const volMusic = interpolate(frame, [0, 20, F_END - 20, F_END], [0, 0.13, 0.13, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Audio src={staticFile("souverain/maroc-batteries/audio/narration-maroc-v3.mp3")} startFrom={SEG.startFrame} volume={volNarr} />
      <Audio src={staticFile("souverain/maroc-batteries/audio/music-C-analytique-tendu.mp3")} startFrom={0} volume={volMusic} />
      {/* SFX — plancher 0.50 (doctrine 2026-06-03).
          PATTERN <Sequence from durationInFrames> OBLIGATOIRE (pas {frame===X}) :
          un <Audio> monte une seule frame ne demarre PAS en render. */}
      <Sequence from={0} durationInFrames={30}><Audio src={staticFile("_shared/sfx/camera/sfx-swoosh-zoomin.mp3")} volume={0.50} /></Sequence>
      <Sequence from={F_KENITRA_POP} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.50} /></Sequence>
      <Sequence from={F_GOTION} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.55} /></Sequence>
      <Sequence from={F_VW} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.55} /></Sequence>
      <Sequence from={F_PULLBACK} durationInFrames={30}><Audio src={staticFile("_shared/sfx/camera/sfx-swoosh-pullback.mp3")} volume={0.55} /></Sequence>
      <Sequence from={F_CHN_FLAG} durationInFrames={20}><Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.50} /></Sequence>
      <Sequence from={F_DEU_FLAG} durationInFrames={20}><Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.50} /></Sequence>

      <div ref={containerRef} style={{ position: "absolute", inset: 0, backgroundColor: NAVY }} />
      <MapboxBrandingHide />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(22,33,58,0.35) 0%,rgba(22,33,58,0.0) 40%,rgba(22,33,58,0.30) 100%)", pointerEvents: "none" }} />

      {/* ── Drapeaux clippes (SVG net a toute echelle) + lignes de connexion ── */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          {FLAG_COUNTRIES.map(fc => {
            const pp = projPaths[fc.iso];
            return pp ? <clipPath key={fc.iso} id={`b3clip-${fc.iso}`}><path d={pp.path} /></clipPath> : null;
          })}
        </defs>

        {/* Lignes de connexion Maroc -> Chine et Maroc -> Allemagne (l'usine relie les partenaires).
            Centroides derives directement des bbox de projPaths (fiable, meme frame que les drapeaux). */}
        {(() => {
          const cen = (iso: string) => {
            const pp = projPaths[iso];
            return pp ? { x: pp.bbox.x + pp.bbox.w / 2, y: pp.bbox.y + pp.bbox.h / 2 } : null;
          };
          const mar = cen("MAR"), chn = cen("CHN"), deu = cen("DEU");
          return <>
            {mar && chn && frame >= F_CHN_FLAG && (() => {
              const op = easeOut(clamp01((frame - F_CHN_FLAG) / 30));
              const dash = ((frame - F_CHN_FLAG) * 0.6) % 13;
              return <>
                <line x1={mar.x} y1={mar.y} x2={chn.x} y2={chn.y} stroke={RED_CN} strokeWidth={6} strokeOpacity={op * 0.3} />
                <line x1={mar.x} y1={mar.y} x2={chn.x} y2={chn.y} stroke={GOLD} strokeWidth={2.2} strokeOpacity={op} strokeDasharray="7 6" strokeDashoffset={-dash} />
              </>;
            })()}
            {mar && deu && frame >= F_DEU_FLAG && (() => {
              const op = easeOut(clamp01((frame - F_DEU_FLAG) / 30));
              const dash = ((frame - F_DEU_FLAG) * 0.6) % 13;
              return <>
                <line x1={mar.x} y1={mar.y} x2={deu.x} y2={deu.y} stroke={BLUE_VW} strokeWidth={6} strokeOpacity={op * 0.3} />
                <line x1={mar.x} y1={mar.y} x2={deu.x} y2={deu.y} stroke={GOLD} strokeWidth={2.2} strokeOpacity={op} strokeDasharray="7 6" strokeDashoffset={-dash} />
              </>;
            })()}
          </>;
        })()}

        {/* Drapeaux : image HD clippee dans la silhouette reprojetee (net a toute echelle).
            'meet' garde le drapeau ENTIER (etoile centree, non coupee). Fond couleur nationale
            sous l'image pour combler les bords de la silhouette non couverts par le drapeau. */}
        {FLAG_COUNTRIES.map(fc => {
          const pp = projPaths[fc.iso];
          const url = flagUrlRef.current[fc.iso];
          if (!pp || !url || frame < fc.at) return null;
          const flagOp = easeOut(clamp01((frame - fc.at) / 20)) * 0.95;
          // Couleur de fond = teinte dominante du drapeau (comble les bords en 'meet')
          const bgColor = fc.iso === "DEU" ? "#1a1a1a" : RED_CN; // MAR/CHN rouge, DEU noir
          return (
            <g key={fc.iso}>
              <path d={pp.path} fill={bgColor} opacity={flagOp * 0.92} />
              <image href={url} x={pp.bbox.x} y={pp.bbox.y} width={pp.bbox.w} height={pp.bbox.h}
                preserveAspectRatio="xMidYMid meet" clipPath={`url(#b3clip-${fc.iso})`} opacity={flagOp} />
              <path d={pp.path} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={2} opacity={flagOp * 0.6} />
            </g>
          );
        })}
      </svg>

      {/* Dot Kenitra CSS (par-dessus) */}
      {kenitraPos && kenitraDotOp > 0.01 && (
        <div style={{ position: "absolute", left: kenitraPos.x - 13, top: kenitraPos.y - 13, pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 13 - 28, top: 13 - 28, width: 56, height: 56, borderRadius: "50%",
            border: `2px solid ${GOLD}`, opacity: kenitraDotOp * (0.3 + Math.abs(Math.sin(frame * 0.1)) * 0.5),
            transform: `scale(${1 + Math.sin(frame * 0.15) * 0.18})` }} />
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: GOLD,
            border: `3px solid ${IVORY}`, boxShadow: `0 0 10px rgba(200,169,81,0.7)`, opacity: kenitraDotOp }} />
        </div>
      )}

      {/* GlassPopup GIGAFACTORY / 156 ha */}
      <GeoPopup pos={frame < F_PULLBACK ? kenitraPos : null} opacity={popupOp} sp={popupSp} title="GIGAFACTORY" value="156 ha" />

      {/* Plaque GOTION (acteur chinois) — apparait sur vue monde quand Chine s'allume, part quand VW arrive */}
      <GeoCountryPlaque frame={frame} name="GOTION HIGH-TECH" color={RED_CN}
        stat="Constructeur batteries" source="Chine — actionnaire majoritaire"
        appearAt={F_GOTION} hideAt={F_VW} pos={null} topOffset={150} />

      {/* Plaque VOLKSWAGEN (acteur allemand) — apparait quand Allemagne s'allume, reste jusqu'a la fin */}
      <GeoCountryPlaque frame={frame} name="VOLKSWAGEN" color={BLUE_VW}
        stat="40%" source="Allemagne — actionnaire"
        appearAt={F_VW} hideAt={F_END} pos={null} topOffset={150} />

      {/* Label Wolfsburg (apparait au pull back) */}
      {wolfsburgPos && frame >= F_PULLBACK + 30 && (
        <div style={{ position: "absolute", left: wolfsburgPos.x - 50, top: wolfsburgPos.y - 50,
          opacity: interpolate(frame, [F_PULLBACK + 30, F_PULLBACK + 50, F_END - 10, F_END], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          pointerEvents: "none", textAlign: "center" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: IVORY, letterSpacing: "0.1em", textTransform: "uppercase", textShadow: "0 0 6px #000", whiteSpace: "nowrap" }}>WOLFSBURG</span>
        </div>
      )}

      <KaraokeSubtitles />
    </AbsoluteFill>
  );
};

export const BEAT3_FRAMES = DURATION;
