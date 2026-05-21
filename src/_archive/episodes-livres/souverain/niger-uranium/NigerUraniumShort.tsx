/**
 * NigerUraniumShort — composition principale Souverain
 *
 * 96.04s | 2881 frames | 30fps | 1080x1920
 * Audio-derived timing via timing.ts — zero hardcoded frames
 * Style CartoCaspian Sepia + Noir (climax)
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  AUDIO_DURATION_S,
  AUDIO_SEGMENTS,
  BEATS,
  CTA_DURATION_FRAMES,
  CTA_START_FRAME,
  FPS,
  TOTAL_FRAMES,
  TOTAL_DURATION_FRAMES,
} from "./timing";
import { GlobeLocationReveal } from "../../_shared/components/inserts/GlobeLocationReveal";
import {
  ComparisonTable,
  PercentIcon,
} from "../../_shared/components/inserts/ComparisonTable";
import {
  EntityDiagram,
  FactoryIcon,
  FlagIcon,
  BankIcon,
} from "../../_shared/components/inserts/EntityDiagram";
import { BigStat } from "../../_shared/components/inserts/BigStat";
import { KraftCardDocClassifie } from "../../_shared/components/inserts/KraftCardDocClassifie";
import {
  applyCartoCaspian,
  CASPIAN_SEPIA,
  CASPIAN_NOIR,
  CASPIAN_PALETTE,
} from "../../_shared/mapbox/templates/CartoCaspian";
import { CamState } from "../../_shared/mapbox/MapboxBase";
import { Subtitles } from "../../geoafrique-shorts/Subtitles";

// Cast helper — les variantes ont des types litteraux incompatibles avec la signature stricte
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const applySepia = (map: mapboxgl.Map) => applyCartoCaspian(map, CASPIAN_SEPIA as unknown as typeof CASPIAN_PALETTE);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const applyNoir = (map: mapboxgl.Map) => applyCartoCaspian(map, CASPIAN_NOIR as unknown as typeof CASPIAN_PALETTE);

// Alignment JSON — word-level timing
import alignmentData from "../../../../public/souverain/niger-uranium/audio/narration-niger-uranium-v5-alignment.json";
import hookV2Words from "../../../../public/souverain/niger-uranium/audio/hook-v2-words.json";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// ─────────────────────────────────────────────────────────────────────────────
// UTILITAIRES
// ─────────────────────────────────────────────────────────────────────────────

const MapboxBrandingHide: React.FC = () => (
  <style>{`
    .mapboxgl-ctrl-attrib,
    .mapboxgl-ctrl-logo,
    .mapboxgl-ctrl-bottom-left,
    .mapboxgl-ctrl-bottom-right { display: none !important; }
  `}</style>
);

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

interface CamKf {
  frame: number;
  lon: number;
  lat: number;
  zoom: number;
}

const lerpCam = (frame: number, kfs: CamKf[]): CamKf => {
  if (frame <= kfs[0].frame) return kfs[0];
  if (frame >= kfs[kfs.length - 1].frame) return kfs[kfs.length - 1];
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i];
    const b = kfs[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = (frame - a.frame) / (b.frame - a.frame);
      const e = easeInOut(t);
      return {
        frame,
        lon: a.lon + (b.lon - a.lon) * e,
        lat: a.lat + (b.lat - a.lat) * e,
        zoom: a.zoom + (b.zoom - a.zoom) * e,
      };
    }
  }
  return kfs[kfs.length - 1];
};

// ─────────────────────────────────────────────────────────────────────────────
// BEAT 1 — Hook Globe (frames 2–370)
// ─────────────────────────────────────────────────────────────────────────────

const Beat1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Beat1Hook"));
  const [ready, setReady] = useState(false);
  const [arlitPt, setArlitPt] = useState<{ x: number; y: number } | null>(null);

  // Coords MCP-verified
  const NIGER_COORD: [number, number] = [8.0, 17.0];
  const ARLIT_COORD: [number, number] = [7.393, 18.739];

  // Frames-pivots word-aligned (beat startFrame=2, local=absolute-2)
  // Beat duration = 368 frames (12.27s)
  const arlitWordF       = 57;   // "Arlit" (1.96s relatif - 0.08s start = ~57)
  const radioactifF      = 102;  // "radioactifs" (3.48s)
  const niameyF          = 182;  // "Niamey" (6.14s)
  const vingtFoisF       = 204;  // "vingt fois" (6.86s)
  const normeF           = 248;  // "norme" (8.32s)
  const oranoF           = 263;  // "Orano" (8.84s)
  const contesteF        = 280;  // "conteste" (9.40s)
  const totalLocal       = 368;

  // Camera keyframes — globe wide → globe Africa → mercator Niger → mercator Arlit
  type Cam = { frame: number; lon: number; lat: number; zoom: number; projection: "globe" | "mercator" };
  const kfs: Cam[] = [
    { frame: 0,             lon: -25, lat: 12, zoom: 1.2, projection: "globe" },
    { frame: 55,            lon: 5,   lat: 16, zoom: 1.7, projection: "globe" },
    { frame: 130,           lon: 7.5, lat: 17.5, zoom: 2.6, projection: "globe" },
    { frame: 180,           lon: 7.4, lat: 18.5, zoom: 3.5, projection: "mercator" },
    { frame: 260,           lon: 7.4, lat: 18.7, zoom: 4.3, projection: "mercator" },
    { frame: totalLocal,    lon: 7.4, lat: 18.7, zoom: 4.5, projection: "mercator" },
  ];

  const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
  const lerpCam = (f: number): Cam => {
    if (f <= kfs[0].frame) return kfs[0];
    if (f >= kfs[kfs.length - 1].frame) return kfs[kfs.length - 1];
    for (let i = 0; i < kfs.length - 1; i++) {
      const a = kfs[i], b = kfs[i + 1];
      if (f >= a.frame && f <= b.frame) {
        const t = (f - a.frame) / (b.frame - a.frame);
        const e = easeInOut(t);
        return {
          frame: f,
          lon: a.lon + (b.lon - a.lon) * e,
          lat: a.lat + (b.lat - a.lat) * e,
          zoom: a.zoom + (b.zoom - a.zoom) * e,
          projection: e < 0.5 ? a.projection : b.projection,
        };
      }
    }
    return kfs[kfs.length - 1];
  };

  // Init Mapbox
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [kfs[0].lon, kfs[0].lat],
      zoom: kfs[0].zoom,
      projection: { name: "globe" },
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      // Atmosphere lumineuse Caspian
      map.setFog({
        color: "#ffffff",
        "high-color": "#d8e4ee",
        "horizon-blend": 0.12,
        "space-color": "#7a92a8",
        "star-intensity": 0.0,
      });

      applySepia(map);

      // Hide Mapbox text labels
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }

      // Niger highlight
      if (!map.getSource("countries-src")) {
        map.addSource("countries-src", {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        });
      }
      if (!map.getLayer("ner-fill")) {
        map.addLayer({
          id: "ner-fill",
          type: "fill",
          source: "countries-src",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "NER"],
          paint: {
            "fill-color": CASPIAN_SEPIA.highlightOr,
            "fill-opacity": 0.85,
          },
        });
      }
      // Niger border emphasis
      if (!map.getLayer("ner-border")) {
        map.addLayer({
          id: "ner-border",
          type: "line",
          source: "countries-src",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "NER"],
          paint: {
            "line-color": "#5a3a18",
            "line-width": 1.5,
          },
        });
      }

      setReady(true);
      continueRender(handle);
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

  // Drive camera + projection switch + project Arlit
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const cam = lerpCam(frame);
    const map = mapRef.current;
    // Switch projection if needed (only at the crossover frame to avoid flicker)
    const currentProj = (map.getProjection().name as "globe" | "mercator");
    if (currentProj !== cam.projection) {
      map.setProjection({ name: cam.projection });
    }
    map.jumpTo({ center: [cam.lon, cam.lat], zoom: cam.zoom });
    const ap = map.project(ARLIT_COORD);
    setArlitPt({ x: ap.x, y: ap.y });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, ready]);

  // Springs amortis Souverain
  const arlitDotProg   = spring({ frame: frame - arlitWordF,  fps: FPS, config: { damping: 100, stiffness: 70 }, durationInFrames: 25 });
  const radioactifProg = spring({ frame: frame - radioactifF, fps: FPS, config: { damping: 100, stiffness: 70 }, durationInFrames: 25 });
  const bigStatProg    = spring({ frame: frame - vingtFoisF,  fps: FPS, config: { damping: 100, stiffness: 60 }, durationInFrames: 28 });
  const bigStatOutProg = spring({ frame: frame - (oranoF - 8), fps: FPS, config: { damping: 100, stiffness: 60 }, durationInFrames: 22 });

  // Permanent motion
  const arlitPulse  = 1 + Math.sin(frame * 0.18) * 0.25;
  const haloPulse   = 0.35 + Math.sin(frame * 0.18) * 0.2;

  // BigStat "20× NORME" visibility — on between vingtFoisF and shortly before oranoF
  const bigStatVisible = Math.max(0, bigStatProg - bigStatOutProg);

  // Subtle camera-bound vignette toward end (slight darken from frame 320)
  const endFade = interpolate(frame, [320, totalLocal], [0, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#bcd5e3" }}>
      <MapboxBrandingHide />

      {/* Mapbox map full screen */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: 0,
        }}
      />

      {/* End fade vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at center, transparent 50%, rgba(20,12,4,${endFade}) 100%)`,
        pointerEvents: "none",
      }} />

      {/* SVG Overlay — Arlit dot + plate label + Big stat */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Arlit dot — appears on word "Arlit" */}
        {arlitPt && (
          <g transform={`translate(${arlitPt.x} ${arlitPt.y})`} opacity={arlitDotProg}>
            {/* Halo permanent */}
            <circle
              cx={0} cy={0}
              r={28}
              fill={CASPIAN_SEPIA.highlightOr}
              opacity={haloPulse}
              transform={`scale(${arlitPulse})`}
            />
            {/* Inner gold dot */}
            <circle cx={0} cy={0} r={11} fill={CASPIAN_SEPIA.highlightOr} stroke="#0d1525" strokeWidth={3} />
            {/* Cross-hair */}
            <line x1={-22} y1={0} x2={-15} y2={0} stroke="#0d1525" strokeWidth={2} opacity={0.7} />
            <line x1={15}  y1={0} x2={22}  y2={0} stroke="#0d1525" strokeWidth={2} opacity={0.7} />
            <line x1={0} y1={-22} x2={0} y2={-15} stroke="#0d1525" strokeWidth={2} opacity={0.7} />
            <line x1={0} y1={15}  x2={0} y2={22}  stroke="#0d1525" strokeWidth={2} opacity={0.7} />

            {/* Plate label ARLIT (above dot, dark navy + gold bar template) */}
            <g transform="translate(-78 -68)">
              <rect x={0} y={0} width={156} height={36} rx={4} fill="#0d1525" opacity={0.92} />
              <rect x={0} y={0} width={3} height={36} fill={CASPIAN_SEPIA.highlightOr} />
              <text x={78} y={16} fontFamily="'IBM Plex Mono', monospace" fontSize={18} fill="#ffffff" fontWeight={700} letterSpacing="0.22em" textAnchor="middle">ARLIT</text>
              <text x={78} y={30} fontFamily="'IBM Plex Mono', monospace" fontSize={11} fill={CASPIAN_SEPIA.highlightOr} letterSpacing="0.2em" textAnchor="middle">SITE MINIER · NIGER</text>
            </g>
          </g>
        )}
      </svg>

      {/* BIG STAT "20× NORME" — chiffre-pivot Souverain (frames vingtFoisF -> oranoF-8) */}
      {bigStatVisible > 0.02 && (
        <div style={{
          position: "absolute",
          left: 60, right: 60, bottom: 220,
          opacity: bigStatVisible,
          transform: `translateY(${interpolate(bigStatVisible, [0, 1], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}>
          <div style={{
            background: "rgba(13,21,37,0.95)",
            padding: "32px 40px",
            borderLeft: `5px solid ${CASPIAN_SEPIA.highlightOr}`,
            display: "flex",
            alignItems: "center",
            gap: 28,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}>
            <div style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 140,
              color: CASPIAN_SEPIA.highlightOr,
              lineHeight: 0.85,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}>
              20×
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: 38,
                color: "#ffffff",
                letterSpacing: "0.08em",
                lineHeight: 1.05,
                fontWeight: 700,
              }}>
                AU-DESSUS
              </div>
              <div style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: 38,
                color: "#ffffff",
                letterSpacing: "0.08em",
                lineHeight: 1.05,
                fontWeight: 700,
              }}>
                DE LA NORME
              </div>
              <div style={{
                marginTop: 10,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 14,
                color: "#9a8a6a",
                letterSpacing: "0.3em",
              }}>
                SOURCE — NIAMEY
              </div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BEAT 2 — Contexte 53 ans (frames 379–822)
// ─────────────────────────────────────────────────────────────────────────────

const Beat2Contexte: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Frames locales calees sur les mots-pivots (Sequence repart a 0)
  const beatStart = BEATS.contexte53ans.startFrame;
  const oranoCountF = AUDIO_SEGMENTS.beat2OranoPct - beatStart;   // ~155 ("quatre-vingt-six")
  const nigerCountF = AUDIO_SEGMENTS.beat2NigerPct - beatStart;   // ~317 ("Neuf")
  const totalLocal = BEATS.contexte53ans.endFrame - beatStart;    // 443

  // Timeline JSON (frames locales) — adaptations Aziz Jour 7 (retrait insert mine B&W)
  const gridF      = 0;     // dividers + bottom progress bar fade-in
  const pillsF     = 15;    // pills + labels + 0% appear
  // counters: oranoCountF (155), nigerCountF (317)
  const verdictF   = 404;   // "conteste" pulse — frame 404 local

  // SFX volumes
  const tick1Vol = (f: number) => {
    const d = Math.abs(f - oranoCountF);
    return d < 4 ? interpolate(d, [0, 4], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  };
  const tick2Vol = (f: number) => {
    const d = Math.abs(f - nigerCountF);
    return d < 4 ? interpolate(d, [0, 4], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  };

  // Springs amortis (Souverain rythme journalistique)
  const gridProg     = spring({ frame: frame - gridF,     fps, config: { damping: 100, stiffness: 60 }, durationInFrames: 30 });
  const pillsProg    = spring({ frame: frame - pillsF,    fps, config: { damping: 90,  stiffness: 70 }, durationInFrames: 28 });
  const oranoCntProg = spring({ frame: frame - oranoCountF, fps, config: { damping: 80, stiffness: 50 }, durationInFrames: 35 });
  const nigerCntProg = spring({ frame: frame - nigerCountF, fps, config: { damping: 80, stiffness: 50 }, durationInFrames: 30 });
  const verdictProg  = spring({ frame: frame - verdictF,  fps, config: { damping: 14, stiffness: 200 }, durationInFrames: 20 });

  // Permanent motion — grid pan diagonal + breathing
  const gridDriftX = (frame * 0.15) % 64;
  const gridDriftY = (frame * 0.10) % 64;
  const breathe    = 1 + Math.sin(frame * 0.06) * 0.012;

  // Counts
  const oranoVal = Math.round(interpolate(oranoCntProg, [0, 1], [0, 86], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const nigerVal = interpolate(nigerCntProg, [0, 1], [0, 9.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "Conteste" verdict pulse (orange/gold flash)
  const pulseScale = 1 + verdictProg * 0.08;
  const verdictGlow = verdictProg * (1 - Math.min(1, Math.max(0, (frame - verdictF - 25) / 15)));

  // Bottom progress bar — fills with elapsed time across beat
  const barProg = Math.min(1, frame / totalLocal);

  return (
    <AbsoluteFill style={{ background: "#0d1525" }}>
      <Audio src={staticFile("souverain/niger-uranium/audio/sfx-tick-counter.mp3")} volume={tick1Vol} />
      <Audio src={staticFile("souverain/niger-uranium/audio/sfx-tick-counter.mp3")} volume={tick2Vol} />

      {/* Background dotted grid Gemini-generated */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${staticFile("souverain/niger-uranium/assets/storyboard-v3/dark_navy_dotted_grid.png")})`,
        backgroundSize: "cover",
        transform: `translate(${gridDriftX - 32}px, ${gridDriftY - 32}px) scale(1.05)`,
      }} />
      {/* Vignette overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 40%, transparent 0%, rgba(5,10,20,0.5) 90%)",
      }} />

      {/* Grid dividers (z-index 2) */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: gridProg }}>
        {/* Vertical center divider */}
        <line x1={540} y1={0} x2={540} y2={1920} stroke="#ffffff" strokeWidth={2} strokeOpacity={0.15} />
        {/* Horizontal dividers */}
        <line x1={40} y1={400}  x2={1040} y2={400}  stroke="#ffffff" strokeWidth={2} strokeOpacity={0.15} />
        <line x1={40} y1={1080} x2={1040} y2={1080} stroke="#ffffff" strokeWidth={2} strokeOpacity={0.15} />
        <line x1={40} y1={1720} x2={1040} y2={1720} stroke="#ffffff" strokeWidth={2} strokeOpacity={0.15} />
      </svg>

      {/* PILL LEFT — ORANO (yellow) */}
      <div style={{
        position: "absolute",
        left: 70, top: 200,
        opacity: pillsProg,
        transform: `scale(${pillsProg * breathe})`,
        transformOrigin: "left center",
      }}>
        <div style={{
          background: "#c29b26",
          padding: "32px 70px",
          borderRadius: 80,
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 70,
          color: "#0d1525",
          letterSpacing: "0.18em",
          fontWeight: 700,
          boxShadow: `0 6px ${24 + Math.sin(frame * 0.07) * 6}px rgba(194,155,38,0.35)`,
          width: 440,
          textAlign: "center",
          boxSizing: "border-box",
          lineHeight: 1,
        }}>
          ORANO
        </div>
      </div>

      {/* PILL RIGHT — NIGER (orange terracotta) */}
      <div style={{
        position: "absolute",
        right: 70, top: 200,
        opacity: pillsProg,
        transform: `scale(${pillsProg * breathe})`,
        transformOrigin: "right center",
      }}>
        <div style={{
          background: "#c26b4d",
          padding: "32px 70px",
          borderRadius: 80,
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 70,
          color: "#fff",
          letterSpacing: "0.18em",
          fontWeight: 700,
          boxShadow: `0 6px ${24 + Math.cos(frame * 0.07) * 6}px rgba(194,107,77,0.35)`,
          width: 440,
          textAlign: "center",
          boxSizing: "border-box",
          lineHeight: 1,
        }}>
          NIGER
        </div>
      </div>

      {/* PERCENT LEFT — 86% (verdict pulse on conteste) */}
      <div style={{
        position: "absolute",
        left: 0, top: 600,
        width: 540,
        textAlign: "center",
        opacity: pillsProg,
        transform: `scale(${verdictF <= frame ? pulseScale : 1})`,
        transformOrigin: "center",
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 280,
          color: verdictF <= frame ? `rgba(255,210,90,${1 - verdictGlow * 0.5})` : "#ffffff",
          fontWeight: 700,
          lineHeight: 0.9,
          letterSpacing: "-0.02em",
          textShadow: verdictF <= frame
            ? `0 0 ${30 * verdictGlow}px rgba(255,200,80,${verdictGlow * 0.8})`
            : "0 4px 20px rgba(0,0,0,0.4)",
        }}>
          {oranoVal}%
        </div>
      </div>

      {/* PERCENT RIGHT — 9,2% */}
      <div style={{
        position: "absolute",
        right: 0, top: 640,
        width: 540,
        textAlign: "center",
        opacity: pillsProg,
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 220,
          color: "#ffffff",
          fontWeight: 700,
          lineHeight: 0.9,
          letterSpacing: "-0.02em",
          textShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}>
          {nigerVal.toFixed(1).replace(".", ",")}%
        </div>
      </div>

      {/* LABEL LEFT — period (1971 → 2024 = 53 ans) */}
      <div style={{
        position: "absolute",
        left: 0, top: 1280,
        width: 540,
        textAlign: "center",
        opacity: pillsProg,
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 80,
          color: "#e8d5a0",
          letterSpacing: "0.08em",
          lineHeight: 1.05,
          fontWeight: 700,
        }}>
          1971 → 2024
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 28,
          color: "#9a8a6a",
          letterSpacing: "0.3em",
          marginTop: 20,
        }}>
          53 ANS
        </div>
      </div>

      {/* LABEL RIGHT — Bénéfices nets */}
      <div style={{
        position: "absolute",
        right: 0, top: 1290,
        width: 540,
        textAlign: "center",
        opacity: pillsProg,
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 64,
          color: "#ffffff",
          letterSpacing: "0.08em",
          lineHeight: 1.05,
          fontWeight: 700,
        }}>
          BÉNÉFICES
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 64,
          color: "#ffffff",
          letterSpacing: "0.08em",
          lineHeight: 1.05,
          fontWeight: 700,
          marginTop: 4,
        }}>
          NETS
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 26,
          color: "#9a8a6a",
          letterSpacing: "0.3em",
          marginTop: 16,
        }}>
          RÉPARTITION
        </div>
      </div>

      {/* Bottom progress bar */}
      <div style={{
        position: "absolute",
        left: 40, top: 1780,
        width: 1000, height: 50,
        opacity: gridProg,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(42,59,92,0.5)",
          borderRadius: 4,
        }} />
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${barProg * 100}%`,
          background: "linear-gradient(90deg, #c29b26 0%, #e8d5a0 100%)",
          borderRadius: 4,
          boxShadow: "0 0 12px rgba(232,213,160,0.4)",
        }} />
      </div>

      {/* Source mention */}
      <div style={{
        position: "absolute",
        left: 40, top: 1850,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 18,
        color: "rgba(154,138,106,0.7)",
        letterSpacing: "0.2em",
        opacity: gridProg,
      }}>
        SOURCE — NIAMEY · CONTESTÉ PAR ORANO
      </div>

      {/* Permanent data-flow particles : gold dots streaming from NIGER side toward ORANO side
          Reinforces "86% des bénéfices reviennent à Orano" sans casser la scène data */}
      <svg width={1080} height={120} style={{
        position: "absolute", left: 0, top: 1620,
        opacity: 0.45 + Math.sin(frame * 0.05) * 0.1,
      }}>
        {Array.from({ length: 8 }, (_, i) => {
          const phase = (frame * 2.2 + i * 28) % 220;
          const t = phase / 220;
          // Stream goes RIGHT->LEFT (Niger right pill toward Orano left pill)
          const x = 950 - t * 850;
          const y = 60 + Math.sin(frame * 0.08 + i * 0.7) * 8;
          const size = interpolate(t, [0, 0.15, 0.85, 1], [0, 4, 4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const alpha = interpolate(t, [0, 0.1, 0.9, 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <circle
              key={i}
              cx={x} cy={y} r={size}
              fill="#e8d5a0"
              opacity={alpha * 0.85}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BEAT 3 — Nationalisation juin 2025 (frames 838–1165)
// ─────────────────────────────────────────────────────────────────────────────

const Beat3Nationalisation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Frames locales — TIMELINE SELON JSON GEMINI 3.1-PRO BREAKDOWN v4
  // Source: public/souverain/niger-uranium/assets/storyboard-v3/beat3_breakdown_v4_pro.json
  const niameyEnterF = 0;                                                                // setup, fade-in 15f
  const stampF = AUDIO_SEGMENTS.beat3DateJuin - BEATS.nationalisation.startFrame;        // 6 — "juin", stamp-impact 10f
  const somairF = AUDIO_SEGMENTS.beat3Nationalise - BEATS.nationalisation.startFrame;    // 80 — "nationalise", draw-stroke 25f
  const niameyPulseF = AUDIO_SEGMENTS.beat3NiameyNode - BEATS.nationalisation.startFrame;// 205 — "souverainete retrouvee", pulse 30f
  const oranoF = AUDIO_SEGMENTS.beat3OranoNode - BEATS.nationalisation.startFrame;       // 273 — "Orano", scale-pop 20f

  // SFX
  const stampVol = (f: number) => {
    const d = Math.abs(f - stampF);
    return d < 4 ? interpolate(d, [0, 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  };
  // SFX nodes desactives (decision Aziz : trop distrayants avec la musique)

  // Springs alignes sur le timeline JSON (3.1-pro breakdown)
  // Frame 0: niger group fade-in 15f soft
  // Frame 6: stamp-impact 10f bouncy
  // Frame 80: somair + arrow draw-stroke 25f linear
  // Frame 205: niger pulse 30f soft
  // Frame 273: orano group scale-pop 20f bouncy
  const niameyEnterProg = spring({ frame: frame - niameyEnterF, fps, config: { damping: 100, stiffness: 70 }, durationInFrames: 25 });
  const stampProg = spring({ frame: frame - stampF, fps, config: { damping: 12, stiffness: 220 }, durationInFrames: 18 });
  const somairDrawProg = spring({ frame: frame - somairF, fps, config: { damping: 100, stiffness: 50 }, durationInFrames: 35 });
  const niameyPulseProg = spring({ frame: frame - niameyPulseF, fps, config: { damping: 80, stiffness: 60 }, durationInFrames: 35 });
  const oranoPopProg = spring({ frame: frame - oranoF, fps, config: { damping: 14, stiffness: 130 }, durationInFrames: 28 });

  // Permanent motion : nodes flottent legerement, marching ants, breath du tampon
  const float = Math.sin(frame * 0.04) * 3;
  const float2 = Math.sin(frame * 0.04 + 1.5) * 3;
  const float3 = Math.sin(frame * 0.04 + 3) * 3;
  const stampBreath = 1 + Math.sin(frame * 0.07) * 0.012;
  const dashedDashOffset = -frame * 1.3;
  const grainShiftX = Math.sin(frame * 0.025) * 4;
  const grainShiftY = Math.cos(frame * 0.022) * 3;

  // Pulse Niger : amplitude qui s'epanouit puis reflue
  const niameyPulseScale = niameyPulseProg < 0.5
    ? 1 + niameyPulseProg * 0.16
    : 1.08 - (niameyPulseProg - 0.5) * 0.16;

  // POSITIONS (selon JSON) — tout est ramene au repere 1080x1920 absolu
  // Niger node : centre x=540 y=550, taille 400x400 (cercle r=190 + border 15px or)
  // Somair node : centre x=250 y=1250, taille 300x300 (cercle r=145 sans border)
  // Orano node : centre x=830 y=1250, taille 300x300 (cercle r=145 sans border)
  // Stamp DOSSIER : centre 250,150 rotation -12deg
  // Arrow nationalisation : ancre 540,550 -> 250,1250 (descendant gauche)
  // Line contested : ancre 540,550 -> 830,1250 (descendant droit)
  // Line tension dashed : segment horizontal 400→680 y=1450 (sous les 2 nodes bas)

  const NIGER_X = 540, NIGER_Y = 550;
  const SOMAIR_X = 250, SOMAIR_Y = 1250;
  const ORANO_X = 830, ORANO_Y = 1250;

  // Scale-up overshoot pour scale-pop
  const popScale = (p: number) => p < 0.6 ? p * 1.15 / 0.6 : 1.15 - (p - 0.6) * 0.15 / 0.4;

  // Calcul progressif draw-stroke pour la fleche et la ligne (stroke-dashoffset)
  const ARROW_LEN = 350; // longueur approx du chemin Niger->Somair
  const arrowDrawn = somairDrawProg * ARROW_LEN;

  return (
    <AbsoluteFill>
      <Audio src={staticFile("souverain/niger-uranium/audio/sfx-stamp-dossier.mp3")} volume={stampVol} />

      {/* Background — bg-dark-navy-paper.png genere par Gemini avec grain shift permanent */}
      <Img
        src={staticFile("souverain/niger-uranium/assets/storyboard-v3/bg-dark-navy-paper.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(1.03) translate(${grainShiftX}px, ${grainShiftY}px)`,
        }}
      />

      {/* Grille fine de points pour ambiance dossier (overlay) */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,194,157,0.04) 1px, transparent 1.5px)",
        backgroundSize: "32px 32px",
        opacity: 0.6,
        transform: `translate(${grainShiftX * 0.5}px, ${grainShiftY * 0.5}px)`,
      }} />

      {/* SVG global — fleche, ligne contested, dashed tension (z-index 1, sous les nodes) */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <marker id="b3-arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
            <polygon points="0 0, 10 5, 0 10" fill="#d4c29d" />
          </marker>
        </defs>

        {/* ARROW NATIONALISATION : Niger (540,720) -> Somair (250,1100) */}
        {/* draw-stroke via stroke-dasharray */}
        {somairDrawProg > 0.01 && (
          <line
            x1={NIGER_X - 20} y1={NIGER_Y + 170}
            x2={SOMAIR_X + 60} y2={SOMAIR_Y - 100}
            stroke="#d4c29d"
            strokeWidth={11}
            strokeLinecap="round"
            strokeDasharray={ARROW_LEN}
            strokeDashoffset={ARROW_LEN - arrowDrawn}
            markerEnd={somairDrawProg > 0.92 ? "url(#b3-arrow)" : undefined}
          />
        )}

        {/* LINE CONTESTED : Niger (540,720) -> Orano (830,1100) */}
        {oranoPopProg > 0.01 && (
          <line
            x1={NIGER_X + 20} y1={NIGER_Y + 170}
            x2={ORANO_X - 60} y2={ORANO_Y - 100}
            stroke="#d4c29d"
            strokeWidth={4}
            opacity={oranoPopProg * 0.8}
          />
        )}

        {/* LINE TENSION DASHED (rouge marching ants permanent une fois apparue) */}
        {oranoPopProg > 0.3 && (
          <line
            x1={SOMAIR_X + 145} y1={SOMAIR_Y + 200}
            x2={ORANO_X - 145} y2={ORANO_Y + 200}
            stroke="#a33333"
            strokeWidth={6}
            strokeDasharray="20 15"
            strokeDashoffset={dashedDashOffset}
            opacity={(oranoPopProg - 0.3) / 0.7 * 0.85}
          />
        )}
      </svg>

      {/* JUIN 2025 STAMP — top-left, rotation -12deg, color #a33333 */}
      <div style={{
        position: "absolute",
        left: 80, top: 110,
        opacity: stampProg,
        transform: `rotate(-12deg) scale(${popScale(stampProg) * stampBreath})`,
        transformOrigin: "left center",
      }}>
        <div style={{
          border: "8px solid #a33333",
          padding: "16px 50px",
          color: "#a33333",
          fontFamily: "'Bebas Neue', 'Oswald', Impact, sans-serif",
          fontSize: 64,
          letterSpacing: "0.1em",
          fontWeight: 700,
          background: "rgba(163,51,51,0.05)",
          boxShadow: "inset 0 0 0 4px rgba(163,51,51,0.4)",
        }}>
          JUIN 2025
        </div>
      </div>

      {/* PULSE RING NIGER — anneau qui s'epanouit sur cue "souverainete" (visible) */}
      {niameyPulseProg > 0.01 && (
        <svg
          width={1080}
          height={1920}
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4 }}
        >
          {/* Anneau 1 (rapide) */}
          <circle
            cx={NIGER_X}
            cy={NIGER_Y + float}
            r={210 + niameyPulseProg * 90}
            fill="none"
            stroke="#c8a951"
            strokeWidth={6}
            opacity={(1 - niameyPulseProg) * 0.85}
          />
          {/* Anneau 2 (plus lent, decale) */}
          {niameyPulseProg > 0.2 && (
            <circle
              cx={NIGER_X}
              cy={NIGER_Y + float}
              r={210 + (niameyPulseProg - 0.2) * 70}
              fill="none"
              stroke="#d4c29d"
              strokeWidth={3}
              opacity={(1 - (niameyPulseProg - 0.2) / 0.8) * 0.6}
            />
          )}
        </svg>
      )}

      {/* NODE NIGER (cercle dore avec border or) */}
      <div style={{
        position: "absolute",
        left: NIGER_X - 200,
        top: NIGER_Y - 200 + float,
        width: 400, height: 400,
        opacity: niameyEnterProg,
        transform: `scale(${niameyEnterProg * niameyPulseScale})`,
        zIndex: 2,
      }}>
        {/* Cercle fill #d4c29d + border #c8a951 width 15 + glow inner sur pulse */}
        <div style={{
          width: 380, height: 380,
          marginLeft: 10, marginTop: 10,
          borderRadius: "50%",
          background: "#d4c29d",
          border: "15px solid #c8a951",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: niameyPulseProg > 0.01
            ? `0 0 ${interpolate(niameyPulseProg, [0, 0.5, 1], [0, 80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px rgba(220,180,80,0.85)`
            : `0 0 20px rgba(0,0,0,0.4)`,
        }}>
          <Img
            src={staticFile("souverain/niger-uranium/assets/icons/icon-etat-niger-cream.png")}
            style={{ width: 240, height: 240, objectFit: "contain" }}
          />
        </div>
      </div>

      {/* PULSE RING SOMAIR a l'apparition (frame 80, dure ~25f) */}
      {somairDrawProg > 0.05 && somairDrawProg < 1 && (
        <svg
          width={1080}
          height={1920}
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4 }}
        >
          <circle
            cx={SOMAIR_X}
            cy={SOMAIR_Y + float2}
            r={155 + somairDrawProg * 70}
            fill="none"
            stroke="#d4c29d"
            strokeWidth={5}
            opacity={(1 - somairDrawProg) * 0.7}
          />
        </svg>
      )}

      {/* NODE SOMAIR (cercle creme, label dessous) — apparait frame 80 */}
      <div style={{
        position: "absolute",
        left: SOMAIR_X - 150,
        top: SOMAIR_Y - 150 + float2,
        width: 300, height: 300,
        opacity: somairDrawProg,
        transform: `scale(${popScale(somairDrawProg)})`,
        zIndex: 2,
      }}>
        <div style={{
          width: 290, height: 290,
          marginLeft: 5, marginTop: 5,
          borderRadius: "50%",
          background: "#d4c29d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}>
          <Img
            src={staticFile("souverain/niger-uranium/assets/icons/icon-somair-mine-cream.png")}
            style={{ width: 200, height: 200, objectFit: "contain" }}
          />
        </div>
      </div>
      <div style={{
        position: "absolute",
        left: SOMAIR_X - 150,
        top: SOMAIR_Y + 170 + float2,
        width: 300,
        textAlign: "center",
        opacity: somairDrawProg,
        fontFamily: "'Bebas Neue', 'Oswald', Impact, sans-serif",
        fontSize: 44,
        color: "#d4c29d",
        letterSpacing: "0.14em",
        fontWeight: 700,
        zIndex: 3,
      }}>
        SOMAÏR
      </div>

      {/* Label NATIONALISATION (le long de la fleche) */}
      {somairDrawProg > 0.5 && (
        <div style={{
          position: "absolute",
          left: 60,
          top: 920,
          width: 320,
          opacity: (somairDrawProg - 0.5) / 0.5,
          fontFamily: "'Bebas Neue', 'Oswald', Impact, sans-serif",
          fontSize: 30,
          color: "#d4c29d",
          letterSpacing: "0.18em",
          textAlign: "center",
          background: "rgba(22,28,36,0.85)",
          border: "1px solid rgba(212,194,157,0.3)",
          padding: "8px 16px",
          transform: "rotate(-52deg)",
        }}>
          NATIONALISATION
        </div>
      )}

      {/* PULSE RING ORANO a l'apparition (frame 273) */}
      {oranoPopProg > 0.05 && oranoPopProg < 1 && (
        <svg
          width={1080}
          height={1920}
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4 }}
        >
          <circle
            cx={ORANO_X}
            cy={ORANO_Y + float3}
            r={155 + oranoPopProg * 80}
            fill="none"
            stroke="#a33333"
            strokeWidth={5}
            opacity={(1 - oranoPopProg) * 0.85}
          />
        </svg>
      )}

      {/* NODE ORANO (cercle creme, label dessous) — apparait frame 273 */}
      <div style={{
        position: "absolute",
        left: ORANO_X - 150,
        top: ORANO_Y - 150 + float3,
        width: 300, height: 300,
        opacity: oranoPopProg,
        transform: `scale(${popScale(oranoPopProg)})`,
        zIndex: 2,
      }}>
        <div style={{
          width: 290, height: 290,
          marginLeft: 5, marginTop: 5,
          borderRadius: "50%",
          background: "#d4c29d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}>
          <Img
            src={staticFile("souverain/niger-uranium/assets/icons/icon-orano-corporate-cream.png")}
            style={{ width: 200, height: 200, objectFit: "contain" }}
          />
        </div>
      </div>
      <div style={{
        position: "absolute",
        left: ORANO_X - 150,
        top: ORANO_Y + 170 + float3,
        width: 300,
        textAlign: "center",
        opacity: oranoPopProg,
        fontFamily: "'Bebas Neue', 'Oswald', Impact, sans-serif",
        fontSize: 44,
        color: "#d4c29d",
        letterSpacing: "0.14em",
        fontWeight: 700,
        zIndex: 3,
      }}>
        ORANO
      </div>

      {/* Label CONTESTÉ (le long de la ligne droite) */}
      {oranoPopProg > 0.4 && (
        <div style={{
          position: "absolute",
          right: 60,
          top: 920,
          width: 320,
          opacity: (oranoPopProg - 0.4) / 0.6,
          fontFamily: "'Bebas Neue', 'Oswald', Impact, sans-serif",
          fontSize: 30,
          color: "#d4c29d",
          letterSpacing: "0.18em",
          textAlign: "center",
          background: "rgba(22,28,36,0.85)",
          border: "1px solid rgba(212,194,157,0.3)",
          padding: "8px 16px",
          transform: "rotate(52deg)",
        }}>
          CONTESTÉ
        </div>
      )}

      {/* Footer source */}
      <div style={{
        position: "absolute", bottom: 60, left: 0, right: 0,
        textAlign: "center",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 16,
        color: "rgba(212,194,157,0.4)",
        letterSpacing: "0.25em",
      }}>
        SOURCE : SOPAMIN / AGENCE ECOFIN — JUIN 2025
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BEAT 4 — Bras de fer juridique (frames 1175–1862)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * BEAT 4 — Bras de fer juridique (frames 1175–1862, 22.9s)
 *
 * Voix-off : "Orano saisit le tribunal arbitral de la Banque mondiale et lance
 *            plusieurs procédures. Mille trois cents tonnes d'uranium concentré
 *            restent sur le site. Deux cent cinquante millions d'euros immobilisés.
 *            En juillet, Moscou exprime son intérêt pour reprendre l'exploitation.
 *            En septembre, le tribunal interdit au Niger de vendre le stock tant
 *            que le litige n'est pas résolu."
 *
 * Code suit fidèlement `assets/storyboard-v3/beat4_breakdown_v2_pro.json` (Gemini 3.1-pro, schéma officiel).
 *
 * 4 panels distincts :
 *   Panel 1 (f=0→165)   : Balance justice + dot NIGER — "Orano saisit..."
 *   Panel 2 (f=165→367) : Mine schématique + cadenas + pills 1300T / 250M€
 *   Panel 3 (f=367→498) : Mapbox Caspian Sepia + arc Niger→Moscou + drapeau russe
 *   Panel 4 (f=498→687) : Tampon INTERDIT bordeaux — "En septembre, le tribunal interdit..."
 */
// ─── Panel 3 Mapbox — sous-composant isolé pour éviter le delayRender bloquant ───
interface Beat4Panel3Props {
  frame: number;
  width: number;
  height: number;
  p3Prog: number;
  MOSCOU_F: number;
  P2_END: number;
}
const Beat4Panel3Mapbox: React.FC<Beat4Panel3Props> = ({ frame, width, height, p3Prog, MOSCOU_F, P2_END }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Beat4Panel3Mapbox"));
  const [mapReady, setMapReady] = useState(false);
  const [nigerPt, setNigerPt] = useState<{ x: number; y: number } | null>(null);
  const [moscouPt, setMoscouPt] = useState<{ x: number; y: number } | null>(null);

  const NIGER_COORD: [number, number] = [8.0, 17.0];
  const MOSCOU_COORD: [number, number] = [37.617, 55.751];

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [20, 35],
      zoom: 1.8,
      projection: { name: "mercator" },
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;
    map.on("style.load", () => {
      applySepia(map);
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") map.setLayoutProperty(layer.id, "visibility", "none");
      }
      if (!map.getSource("countries-src-b4")) {
        map.addSource("countries-src-b4", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
      }
      if (!map.getLayer("ner-fill-b4")) {
        map.addLayer({
          id: "ner-fill-b4", type: "fill",
          source: "countries-src-b4", "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "NER"],
          paint: { "fill-color": CASPIAN_SEPIA.highlightOr, "fill-opacity": 0.85 },
        });
      }
      setMapReady(true);
      continueRender(handle);
    });
    return () => { map.remove(); mapRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const localF = frame - P2_END;
    const lon = interpolate(localF, [0, 131], [18, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const lat = interpolate(localF, [0, 131], [33, 37], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    mapRef.current.jumpTo({ center: [lon, lat], zoom: 1.8 });
    const ns = mapRef.current.project(NIGER_COORD);
    const ms = mapRef.current.project(MOSCOU_COORD);
    setNigerPt({ x: ns.x, y: ns.y });
    setMoscouPt({ x: ms.x, y: ms.y });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, mapReady]);

  const arcLocalF = frame - MOSCOU_F;
  const arcProg = spring({ frame: arcLocalF, fps: FPS, config: { damping: 100, stiffness: 30 }, durationInFrames: 50 });
  const arcDashOffset = 1200 * (1 - arcProg) - ((frame * 1.2) % 16);
  const moscouProg = spring({ frame: frame - MOSCOU_F, fps: FPS, config: { damping: 100, stiffness: 50 }, durationInFrames: 25 });

  const buildArcPath = (from: { x: number; y: number } | null, to: { x: number; y: number } | null) => {
    if (!from || !to) return "";
    const cx = (from.x + to.x) / 2;
    const cy = Math.min(from.y, to.y) - 100;
    return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  };

  return (
    <AbsoluteFill style={{ opacity: p3Prog }}>
      <div ref={mapContainerRef} style={{ position: "absolute", top: 0, left: 0, width, height }} />
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
        {nigerPt && moscouPt && frame >= MOSCOU_F && (
          <path
            d={buildArcPath(nigerPt, moscouPt)}
            fill="none"
            stroke={CASPIAN_SEPIA.highlightOr}
            strokeWidth={3}
            strokeDasharray="8 8"
            strokeDashoffset={arcDashOffset}
            strokeLinecap="round"
            opacity={arcProg * 0.9}
            style={{ filter: `drop-shadow(0 0 5px ${CASPIAN_SEPIA.highlightOr}88)` }}
          />
        )}
        {nigerPt && (
          <g transform={`translate(${nigerPt.x} ${nigerPt.y})`} opacity={p3Prog}>
            <circle cx={0} cy={0} r={24} fill={CASPIAN_SEPIA.highlightOr} opacity={0.25 + 0.1 * Math.sin(frame * 0.12)} />
            <circle cx={0} cy={0} r={11} fill={CASPIAN_SEPIA.highlightOr} stroke="#0d1525" strokeWidth={2.5} />
            <g transform="translate(-72 -52)">
              <rect x={0} y={0} width={144} height={32} rx={4} fill="#0d1525" opacity={0.92} />
              <rect x={0} y={0} width={3} height={32} fill={CASPIAN_SEPIA.highlightOr} />
              <text x={72} y={22} fontFamily="'IBM Plex Mono', monospace" fontSize={17} fill="#ffffff" fontWeight={700} letterSpacing="0.22em" textAnchor="middle">NIGER</text>
            </g>
          </g>
        )}
        {moscouPt && frame >= MOSCOU_F && (
          <g transform={`translate(${moscouPt.x} ${moscouPt.y})`} opacity={moscouProg}>
            <circle cx={0} cy={0} r={24} fill={CASPIAN_SEPIA.highlightOr} opacity={0.25 + 0.1 * Math.sin(frame * 0.12 + 1.5)} />
            <circle cx={0} cy={0} r={11} fill={CASPIAN_SEPIA.highlightOr} stroke="#0d1525" strokeWidth={2.5} />
            <g transform="translate(-168 -52)">
              <rect x={0} y={0} width={156} height={32} rx={4} fill="#0d1525" opacity={0.92} />
              <rect x={153} y={0} width={3} height={32} fill={CASPIAN_SEPIA.highlightOr} />
              <text x={78} y={22} fontFamily="'IBM Plex Mono', monospace" fontSize={17} fill="#ffffff" fontWeight={700} letterSpacing="0.22em" textAnchor="middle">MOSCOU</text>
            </g>
            <g transform="translate(18 -48)">
              <rect x={0} y={0} width={54} height={12} fill="#ffffff" stroke="#cccccc" strokeWidth={0.5} />
              <rect x={0} y={12} width={54} height={12} fill="#0039a6" />
              <rect x={0} y={24} width={54} height={12} fill="#d52b1e" />
            </g>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

const Beat4BrasDeFer: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // ─── Frames locales (mots-pivots alignment) ───
  const P1_END   = 166;   // "Mille" — Panel 2 débute
  const P2_END   = 367;   // "juillet," — Panel 3 Mapbox débute
  const P3_END   = 499;   // "septembre," — Panel 4 tampon débute
  const TONNES_F = 189;   // "tonnes" → pill 1300T spring-scale
  const DEUX_F   = 280;   // "Deux" → pill 250M spring-scale
  const MOSCOU_F = 393;   // "Moscou" → dot + arc draw
  const INTERDIT_F = 552; // "interdit" → tampon slam

  // Panel courant (0-indexé)
  const panel = frame < P1_END ? 1 : frame < P2_END ? 2 : frame < P3_END ? 3 : 4;

  // ─── Springs ───
  const p1Prog      = spring({ frame,             fps: FPS, config: { damping: 90, stiffness: 60 }, durationInFrames: 20 });
  const p2Prog      = spring({ frame: frame - P1_END, fps: FPS, config: { damping: 90, stiffness: 60 }, durationInFrames: 20 });
  const p3Prog      = spring({ frame: frame - P2_END, fps: FPS, config: { damping: 90, stiffness: 60 }, durationInFrames: 20 });
  const p4Prog      = spring({ frame: frame - P3_END, fps: FPS, config: { damping: 90, stiffness: 60 }, durationInFrames: 20 });
  const tonnesProg  = spring({ frame: frame - TONNES_F, fps: FPS, config: { damping: 80, stiffness: 70 }, durationInFrames: 20 });
  const deuxProg    = spring({ frame: frame - DEUX_F,   fps: FPS, config: { damping: 80, stiffness: 70 }, durationInFrames: 20 });
  const interditProg = spring({ frame: frame - INTERDIT_F, fps: FPS, config: { damping: 120, stiffness: 200 }, durationInFrames: 12 });

  // Pills opacity
  const tonnOp = frame >= TONNES_F && frame < P2_END
    ? interpolate(tonnesProg, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const deuxOp = frame >= DEUX_F && frame < P2_END
    ? interpolate(deuxProg, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const tonnScale = interpolate(tonnesProg, [0, 1], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const deuxScale = interpolate(deuxProg, [0, 1], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Tampon scale slam (spring à rebond prononcé)
  const stampScale = interpolate(interditProg, [0, 1], [2.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampOp = frame >= INTERDIT_F ? interpolate(interditProg, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  // Permanent motion Panel 1 : balance flottante
  const balanceFloat = Math.sin(frame * 0.08) * 6;
  // Permanent motion Panel 2 : zoom très lent sur schéma
  const mineZoom = 1 + interpolate(frame - P1_END, [0, 202], [0, 0.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#d8c9a8" }}>
      <MapboxBrandingHide />

      {/* ─── PANEL 1 : Balance de justice (f=0→165) ─── */}
      {panel === 1 && (
        <AbsoluteFill style={{ opacity: p1Prog, background: "#1a1508" }}>
          {/* Balance plein écran + flottaison verticale */}
          <div style={{
            position: "absolute", top: 0, left: 0, width, height,
            transform: `translateY(${balanceFloat}px)`,
            overflow: "hidden",
          }}>
            <img
              src={staticFile("souverain/niger-uranium/assets/storyboard-v3/justice_scale.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          {/* Overlay sombre léger pour contraste */}
          <div style={{
            position: "absolute", top: 0, left: 0, width, height,
            background: "rgba(0,0,0,0.25)",
          }} />
        </AbsoluteFill>
      )}

      {/* ─── PANEL 2 : Mine schématique + cadenas + pills (f=166→367) ─── */}
      {panel === 2 && (
        <AbsoluteFill style={{ opacity: p2Prog, background: "#d8c9a8" }}>
          {/* Schéma mine — zoom lent permanent */}
          <div style={{
            position: "absolute", top: 0, left: 0, width, height,
            transform: `scale(${mineZoom})`, transformOrigin: "center center",
          }}>
            <img
              src={staticFile("souverain/niger-uranium/assets/storyboard-v3/aerial_mine_schematic.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
            />
          </div>
          {/* Cadenas SVG centré */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
          }}>
            <svg width={110} height={110} viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" fill="#0d1525" opacity={0.9} />
            </svg>
          </div>
          {/* Pill 1300 T */}
          <div style={{
            position: "absolute", left: "50%", top: 700,
            transform: `translate(-50%, -50%) scale(${tonnScale})`,
            opacity: tonnOp,
            background: "#0d1525", borderRadius: 50,
            padding: "16px 52px",
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 72, color: CASPIAN_SEPIA.highlightOr,
            letterSpacing: "0.05em", whiteSpace: "nowrap",
            boxShadow: `0 4px 24px rgba(0,0,0,0.35)`,
          }}>
            1 300 T
          </div>
          {/* Pill 250 M€ */}
          <div style={{
            position: "absolute", left: "50%", top: 1200,
            transform: `translate(-50%, -50%) scale(${deuxScale})`,
            opacity: deuxOp,
            background: "#0d1525", borderRadius: 50,
            padding: "16px 52px",
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 72, color: CASPIAN_SEPIA.highlightOr,
            letterSpacing: "0.05em", whiteSpace: "nowrap",
            boxShadow: `0 4px 24px rgba(0,0,0,0.35)`,
          }}>
            250 M€
          </div>
        </AbsoluteFill>
      )}

      {/* ─── PANEL 3 : Mapbox Caspian Sepia + arc Niger→Moscou (f=367→498) ─── */}
      {panel === 3 && (
        <Beat4Panel3Mapbox
          frame={frame}
          width={width}
          height={height}
          p3Prog={p3Prog}
          MOSCOU_F={MOSCOU_F}
          P2_END={P2_END}
        />
      )}

      {/* ─── PANEL 4 : Tampon INTERDIT (f=498→687) ─── */}
      {panel === 4 && (
        <AbsoluteFill style={{ opacity: p4Prog, background: "#1a1508" }}>
          {/* Document légal plein écran */}
          <div style={{ position: "absolute", top: 0, left: 0, width, height }}>
            <img
              src={staticFile("souverain/niger-uranium/assets/storyboard-v3/legal_document_icon.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.65 }}
            />
          </div>
          {/* Overlay sombre pour lisibilité du tampon */}
          <div style={{
            position: "absolute", top: 0, left: 0, width, height,
            background: "rgba(0,0,0,0.3)",
          }} />
          {/* Tampon INTERDIT — slam scale 2.5→1 sur "interdit" (f=552) */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: `translate(-50%, -50%) rotate(-15deg) scale(${stampScale})`,
            opacity: stampOp,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 200, color: "#5c1a1a",
              border: "14px solid #5c1a1a",
              padding: "8px 36px",
              letterSpacing: "0.06em",
              lineHeight: 1,
              textShadow: "2px 2px 0px rgba(92,26,26,0.3)",
              opacity: 0.88,
            }}>
              INTERDIT
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BEAT 5 — Asymétrie quotidienne (frames 1864–2476)
// ─────────────────────────────────────────────────────────────────────────────

const Beat5Asymetrie: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Beat5MapAsymetrie"));
  const [ready, setReady] = useState(false);
  const [nigerPt, setNigerPt] = useState<{ x: number; y: number } | null>(null);
  const [canadaPt, setCanadaPt] = useState<{ x: number; y: number } | null>(null);
  const [kazakhPt, setKazakhPt] = useState<{ x: number; y: number } | null>(null);

  // Coords MCP-verified — Orano supply chain
  const NIGER_COORD: [number, number] = [8.0, 17.0];                 // Niger (Arlit region)
  const CANADA_COORD: [number, number] = [-105.052, 57.762];         // McArthur River
  const KAZAKH_COORD: [number, number] = [67.4, 45.0];               // Inkai

  const TOP_HALF = Math.round(height / 2); // 960
  const BOTTOM_HALF = TOP_HALF;

  // Frames locales
  const beatStart = BEATS.asymetrie.startFrame;
  const sceneLeftF    = 0;    // soldier scene appears immediately on "Et pendant ce temps"
  const insurrectionF = 137;  // "Contenir une insurrection" red flash on soldier
  const sceneRightF   = 220;  // "Nourrir une population" sack scene appears
  const dimTopF       = 286;  // "Orano, lui," — top dims, focus to map
  // Arcs déclenchés tôt (Aziz Jour 7) — laisse 8s pour que l'animation respire
  const arcCanadaStartF = 340; // "actif majeur lui échapper"
  const arcKazakhStartF = 420; // "centaines de millions gelés"
  const canadaF       = AUDIO_SEGMENTS.beat5Canada - beatStart;       // 560 — pulse highlight sur le mot
  const kazakhF       = AUDIO_SEGMENTS.beat5Kazakhstan - beatStart;   // 590 — pulse highlight sur le mot

  // Mapbox setup — explicit Mercator + Caspian Sepia palette
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [10, 30],
      zoom: 1.95,
      projection: { name: "mercator" },        // FORCE Mercator (no globe)
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      applySepia(map);

      // Hide Mapbox text labels for clean editorial look
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }

      if (!map.getSource("countries-src")) {
        map.addSource("countries-src", {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        });
      }
      // Niger highlight gold (origin point)
      if (!map.getLayer("ner-fill")) {
        map.addLayer({
          id: "ner-fill",
          type: "fill",
          source: "countries-src",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "NER"],
          paint: {
            "fill-color": CASPIAN_SEPIA.highlightOr,
            "fill-opacity": 0.85,
          },
        });
      }
      // Canada highlight (lighter, appears via opacity over time)
      if (!map.getLayer("can-fill")) {
        map.addLayer({
          id: "can-fill",
          type: "fill",
          source: "countries-src",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "CAN"],
          paint: {
            "fill-color": CASPIAN_SEPIA.highlightOr,
            "fill-opacity": 0,
          },
        });
      }
      // Kazakhstan highlight
      if (!map.getLayer("kaz-fill")) {
        map.addLayer({
          id: "kaz-fill",
          type: "fill",
          source: "countries-src",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "KAZ"],
          paint: {
            "fill-color": CASPIAN_SEPIA.highlightOr,
            "fill-opacity": 0,
          },
        });
      }

      setReady(true);
      continueRender(handle);
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

  // Slow camera drift + dynamic country highlight via opacity
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    // Very slow zoom-in for permanent motion (1.95 -> 2.05 over 612 frames)
    const z = interpolate(frame, [0, 612], [1.95, 2.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const lon = interpolate(frame, [0, 612], [10, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    mapRef.current.jumpTo({ center: [lon, 30], zoom: z });

    // Drive Canada/Kazakhstan fill opacity — appear with arc draw, pulse on word
    const canadaFill = interpolate(frame, [arcCanadaStartF, arcCanadaStartF + 30, canadaF, canadaF + 15], [0, 0.55, 0.55, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const kazakhFill = interpolate(frame, [arcKazakhStartF, arcKazakhStartF + 30, kazakhF, kazakhF + 15], [0, 0.55, 0.55, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    if (mapRef.current.getLayer("can-fill")) {
      mapRef.current.setPaintProperty("can-fill", "fill-opacity", canadaFill);
    }
    if (mapRef.current.getLayer("kaz-fill")) {
      mapRef.current.setPaintProperty("kaz-fill", "fill-opacity", kazakhFill);
    }

    const np = mapRef.current.project(NIGER_COORD);
    const cp = mapRef.current.project(CANADA_COORD);
    const kp = mapRef.current.project(KAZAKH_COORD);
    setNigerPt({ x: np.x, y: np.y });
    setCanadaPt({ x: cp.x, y: cp.y });
    setKazakhPt({ x: kp.x, y: kp.y });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, ready]);

  // Springs amortis (rythme Souverain)
  const sceneLeftProg  = spring({ frame: frame - sceneLeftF,  fps: FPS, config: { damping: 90,  stiffness: 65 }, durationInFrames: 28 });
  const sceneRightProg = spring({ frame: frame - sceneRightF, fps: FPS, config: { damping: 90,  stiffness: 65 }, durationInFrames: 28 });
  const dimTopProg     = spring({ frame: frame - dimTopF,     fps: FPS, config: { damping: 100, stiffness: 50 }, durationInFrames: 35 });
  const nigerDotProg   = spring({ frame: frame - dimTopF,         fps: FPS, config: { damping: 18,  stiffness: 120 }, durationInFrames: 22 });
  // Dots Canada/Kazakhstan apparaissent EN MEME TEMPS que l'arc commence à se tracer (pas après)
  const canadaDotProg  = spring({ frame: frame - arcCanadaStartF, fps: FPS, config: { damping: 100, stiffness: 70 },  durationInFrames: 25 });
  const kazakhDotProg  = spring({ frame: frame - arcKazakhStartF, fps: FPS, config: { damping: 100, stiffness: 70 },  durationInFrames: 25 });
  // Arcs tracés lentement (60 frames = 2s) pour bien voir l'animation
  const arcCanadaProg  = spring({ frame: frame - arcCanadaStartF, fps: FPS, config: { damping: 100, stiffness: 30 }, durationInFrames: 60 });
  const arcKazakhProg  = spring({ frame: frame - arcKazakhStartF, fps: FPS, config: { damping: 100, stiffness: 30 }, durationInFrames: 60 });
  // Pulse sur dot Canada quand le mot "Canada" est prononcé (frame canadaF)
  const canadaWordPulse = (frame >= canadaF && frame < canadaF + 25)
    ? Math.sin(((frame - canadaF) / 25) * Math.PI) : 0;
  const kazakhWordPulse = (frame >= kazakhF && frame < kazakhF + 25)
    ? Math.sin(((frame - kazakhF) / 25) * Math.PI) : 0;

  // Insurrection red flash on soldier scene (137 - 197)
  const insurrectionPulse = (frame >= insurrectionF && frame < insurrectionF + 60)
    ? interpolate(frame, [insurrectionF, insurrectionF + 30, insurrectionF + 60], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Permanent motion
  const grainShift   = Math.sin(frame * 0.05) * 2;
  const nigerPulse   = 1 + Math.sin(frame * 0.12) * 0.18;
  const sceneFloat   = Math.sin(frame * 0.04) * 3;

  // Top half opacity dims after frame 286
  const topOpacity   = interpolate(dimTopProg, [0, 1], [1.0, 0.32], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bottomBoost  = interpolate(dimTopProg, [0, 1], [0.85, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Arc draw (strokeDasharray)
  const arcLen = 1500;
  const canadaDashOffset = arcLen * (1 - arcCanadaProg);
  const kazakhDashOffset = arcLen * (1 - arcKazakhProg);

  const arcPath = (from: { x: number; y: number } | null, to: { x: number; y: number } | null) => {
    if (!from || !to) return "";
    const cx = (from.x + to.x) / 2;
    const cy = Math.min(from.y, to.y) - 90;
    return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  };

  const nigerScreenY  = nigerPt  ? nigerPt.y  + TOP_HALF : 0;
  const canadaScreenY = canadaPt ? canadaPt.y + TOP_HALF : 0;
  const kazakhScreenY = kazakhPt ? kazakhPt.y + TOP_HALF : 0;

  return (
    <AbsoluteFill style={{ background: "#0d1525" }}>
      <MapboxBrandingHide />

      {/* ──────────────── TOP HALF — two complete editorial panels ──────────────── */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, width, height: TOP_HALF,
        opacity: topOpacity,
        background: "#e8d8b8",
        overflow: "hidden",
      }}>
        {/* Subtle paper grain */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(-45deg, transparent 0 3px, rgba(80,50,20,0.04) 3px 4px), repeating-linear-gradient(45deg, transparent 0 5px, rgba(80,50,20,0.03) 5px 6px)",
          transform: `translate(${grainShift}px, ${grainShift * 0.4}px)`,
          mixBlendMode: "multiply",
        }} />

        {/* LEFT PANEL — soldier + crates + dunes (full scene) */}
        <div style={{
          position: "absolute",
          left: 0, top: 0,
          width: width / 2,
          height: TOP_HALF,
          opacity: sceneLeftProg,
          transform: `translateY(${interpolate(sceneLeftProg, [0, 1], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px) translateY(${sceneFloat * 0.5}px)`,
          // Insurrection red glow
          filter: insurrectionPulse > 0
            ? `drop-shadow(0 0 ${insurrectionPulse * 35}px rgba(195,75,55,${insurrectionPulse}))`
            : undefined,
        }}>
          <Img
            src={staticFile("souverain/niger-uranium/assets/storyboard-v3/scene_left_soldier_full.png")}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* RIGHT PANEL — sacks + dunes (full scene) */}
        <div style={{
          position: "absolute",
          right: 0, top: 0,
          width: width / 2,
          height: TOP_HALF,
          opacity: sceneRightProg,
          transform: `translateY(${interpolate(sceneRightProg, [0, 1], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px) translateY(${sceneFloat * 0.5}px)`,
        }}>
          <Img
            src={staticFile("souverain/niger-uranium/assets/storyboard-v3/scene_right_sacks_full.png")}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Vertical separator between the two panels */}
        <div style={{
          position: "absolute",
          left: width / 2 - 1,
          top: 40, bottom: 40,
          width: 2,
          background: "linear-gradient(180deg, transparent 0%, rgba(60,40,20,0.25) 50%, transparent 100%)",
        }} />
      </div>

      {/* Gold horizontal separator (no VS badge) */}
      <div style={{
        position: "absolute",
        top: TOP_HALF - 1, left: 0, right: 0,
        height: 3,
        background: `linear-gradient(90deg, transparent 0%, ${CASPIAN_SEPIA.highlightOr} 50%, transparent 100%)`,
        opacity: 0.7,
      }} />

      {/* ──────────────── BOTTOM HALF — Mapbox Mercator ──────────────── */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: TOP_HALF, left: 0,
          width, height: BOTTOM_HALF,
          opacity: bottomBoost,
        }}
      />

      {/* Overlay SVG over Mapbox — arcs, dots, captions */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {/* Arc Canada */}
        {nigerPt && canadaPt && (
          <path
            d={arcPath(
              { x: nigerPt.x, y: nigerScreenY },
              { x: canadaPt.x, y: canadaScreenY }
            )}
            fill="none"
            stroke={CASPIAN_SEPIA.highlightOr}
            strokeWidth={3}
            strokeDasharray={arcLen}
            strokeDashoffset={canadaDashOffset}
            strokeLinecap="round"
            opacity={arcCanadaProg}
            style={{
              filter: `drop-shadow(0 0 8px ${CASPIAN_SEPIA.highlightOr}cc)`,
            }}
          />
        )}

        {/* Arc Kazakhstan */}
        {nigerPt && kazakhPt && (
          <path
            d={arcPath(
              { x: nigerPt.x, y: nigerScreenY },
              { x: kazakhPt.x, y: kazakhScreenY }
            )}
            fill="none"
            stroke={CASPIAN_SEPIA.highlightOr}
            strokeWidth={3}
            strokeDasharray={arcLen}
            strokeDashoffset={kazakhDashOffset}
            strokeLinecap="round"
            opacity={arcKazakhProg}
            style={{
              filter: `drop-shadow(0 0 8px ${CASPIAN_SEPIA.highlightOr}cc)`,
            }}
          />
        )}

        {/* Dot Niger — pulse permanent (origin point) */}
        {nigerPt && (
          <g transform={`translate(${nigerPt.x} ${nigerScreenY})`} opacity={nigerDotProg}>
            <circle cx={0} cy={0} r={22} fill={CASPIAN_SEPIA.highlightOr} opacity={0.25} transform={`scale(${nigerPulse})`} />
            <circle cx={0} cy={0} r={12} fill={CASPIAN_SEPIA.highlightOr} stroke="#0d1525" strokeWidth={3} />
            {/* Plate label NIGER (white text, dark navy plate, above the dot) */}
            <g transform="translate(-72 -52)">
              <rect x={0} y={0} width={144} height={32} rx={4} fill="#0d1525" opacity={0.92} />
              <rect x={0} y={0} width={3} height={32} fill={CASPIAN_SEPIA.highlightOr} />
              <text x={72} y={22} fontFamily="'IBM Plex Mono', monospace" fontSize={18} fill="#ffffff" fontWeight={700} letterSpacing="0.22em" textAnchor="middle">NIGER</text>
            </g>
          </g>
        )}

        {/* Dot Canada */}
        {canadaPt && (
          <g transform={`translate(${canadaPt.x} ${canadaScreenY})`} opacity={canadaDotProg}>
            <circle cx={0} cy={0} r={18} fill={CASPIAN_SEPIA.highlightOr} opacity={0.35 + canadaWordPulse * 0.4} transform={`scale(${1 + Math.sin(frame * 0.15) * 0.2 + canadaWordPulse * 0.6})`} />
            <circle cx={0} cy={0} r={11} fill={CASPIAN_SEPIA.highlightOr} stroke="#0d1525" strokeWidth={3} />
            {/* Plate label CANADA (above) */}
            <g transform="translate(-78 -56)">
              <rect x={0} y={0} width={156} height={36} rx={4} fill="#0d1525" opacity={0.92} />
              <rect x={0} y={0} width={3} height={36} fill={CASPIAN_SEPIA.highlightOr} />
              <text x={78} y={16} fontFamily="'IBM Plex Mono', monospace" fontSize={17} fill="#ffffff" fontWeight={700} letterSpacing="0.18em" textAnchor="middle">CANADA</text>
              <text x={78} y={30} fontFamily="'IBM Plex Mono', monospace" fontSize={11} fill={CASPIAN_SEPIA.highlightOr} letterSpacing="0.2em" textAnchor="middle">MCARTHUR R.</text>
            </g>
          </g>
        )}

        {/* Dot Kazakhstan */}
        {kazakhPt && (
          <g transform={`translate(${kazakhPt.x} ${kazakhScreenY})`} opacity={kazakhDotProg}>
            <circle cx={0} cy={0} r={18} fill={CASPIAN_SEPIA.highlightOr} opacity={0.35 + kazakhWordPulse * 0.4} transform={`scale(${1 + Math.sin(frame * 0.15 + 1) * 0.2 + kazakhWordPulse * 0.6})`} />
            <circle cx={0} cy={0} r={11} fill={CASPIAN_SEPIA.highlightOr} stroke="#0d1525" strokeWidth={3} />
            {/* Plate label KAZAKHSTAN (above, decalé à gauche pour ne pas sortir du cadre) */}
            <g transform="translate(-180 -56)">
              <rect x={0} y={0} width={180} height={36} rx={4} fill="#0d1525" opacity={0.92} />
              <rect x={177} y={0} width={3} height={36} fill={CASPIAN_SEPIA.highlightOr} />
              <text x={90} y={16} fontFamily="'IBM Plex Mono', monospace" fontSize={17} fill="#ffffff" fontWeight={700} letterSpacing="0.18em" textAnchor="middle">KAZAKHSTAN</text>
              <text x={90} y={30} fontFamily="'IBM Plex Mono', monospace" fontSize={11} fill={CASPIAN_SEPIA.highlightOr} letterSpacing="0.2em" textAnchor="middle">INKAI</text>
            </g>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BEAT 6 — Climax (frames 2481–2661)
// ─────────────────────────────────────────────────────────────────────────────

const Beat6Climax: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Beat6MapClimax"));
  const [ready, setReady] = useState(false);
  const [nigerScreen, setNigerScreen] = useState<{ x: number; y: number } | null>(null);

  const NIGER_COORD: [number, number] = [8.0, 17.0];

  // Beat 6 = 180 frames (6.0s)
  // Voix-off : "Une guerre d'usure devant les tribunaux. Chaque mois de procédure
  //            est un mois de recettes qui n'entrent pas à Niamey."
  // Frame 0   → entrée carte NOIR + halo Niger (déjà visible)
  // Frame 30  → BIG STAT "0€" apparaît (sur mot "tribunaux", climax visuel)
  // Frame 30+ → 0€ tient jusqu'à la fin, halo continue de pulser

  const bigStatLocal = 30;

  const tensionVol = (f: number): number =>
    f >= 0 && f < 6 ? interpolate(f, [0, 2, 5, 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: NIGER_COORD,
      zoom: 4.6,
      projection: { name: "mercator" },        // FORCE Mercator (pas globe)
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;
    map.on("style.load", () => {
      applyNoir(map);

      // Hide labels Mapbox natifs
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }

      // Niger highlight gold
      if (!map.getSource("ner-noir-src")) {
        map.addSource("ner-noir-src", {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        });
      }
      if (!map.getLayer("ner-noir-fill")) {
        map.addLayer({
          id: "ner-noir-fill",
          type: "fill",
          source: "ner-noir-src",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "NER"],
          paint: {
            "fill-color": CASPIAN_NOIR.highlightOr,
            "fill-opacity": 0.85,
          },
        });
      }

      setReady(true);
      continueRender(handle);
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

  // Permanent motion : très léger drift de zoom (3.5 → 3.62 sur 180 frames)
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const z = interpolate(frame, [0, 180], [4.6, 4.72], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    mapRef.current.jumpTo({ center: NIGER_COORD, zoom: z });
    const ns = mapRef.current.project(NIGER_COORD);
    setNigerScreen({ x: ns.x, y: ns.y });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, ready]);

  // Halo concentrique pulsant permanent (3 cercles, sin légèrement déphasés) — bien visibles sur fond NOIR
  const pulse1 = 1 + 0.18 * Math.sin(frame * 0.18);
  const pulse2 = 1 + 0.22 * Math.sin(frame * 0.18 + 1.0);
  const pulse3 = 1 + 0.28 * Math.sin(frame * 0.18 + 2.0);
  const glowOp = 0.55 + 0.15 * Math.sin(frame * 0.22);

  // Niger dot pulse permanent
  const nigerPulse = 1 + Math.sin(frame * 0.12) * 0.18;

  // BIG STAT "0€" — apparition sur frame 30, springs amortis Souverain (damping 90, stiffness 60, durée 30)
  const bigStatProg = spring({
    frame: frame - bigStatLocal,
    fps: FPS,
    config: { damping: 90, stiffness: 60 },
    durationInFrames: 30,
  });
  const bigStatOp = interpolate(bigStatProg, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bigStatScale = interpolate(bigStatProg, [0, 1], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0a0e16" }}>
      <Audio src={staticFile("souverain/niger-uranium/audio/sfx-tension-pulse.mp3")} volume={tensionVol} />
      <MapboxBrandingHide />

      {/* Barre rouge brique 6px haut — signal alerte légitime, pas de texte */}
      <div style={{ position: "absolute", top: 0, left: 0, width, height: 6, background: "#c04a3a" }} />

      <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, width, height }} />

      {/* Halo concentrique pulsant + Niger dot + plate label NIGER */}
      {nigerScreen && (
        <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
          {/* Halo concentrique — 4 cercles bien visibles sur fond NOIR */}
          <g transform={`translate(${nigerScreen.x} ${nigerScreen.y})`}>
            <circle cx="0" cy="0" r="160" fill="none" stroke={CASPIAN_NOIR.highlightOr} strokeWidth="3" opacity={glowOp} transform={`scale(${pulse1})`} />
            <circle cx="0" cy="0" r="260" fill="none" stroke={CASPIAN_NOIR.highlightOr} strokeWidth="2.5" opacity={glowOp * 0.78} transform={`scale(${pulse2})`} />
            <circle cx="0" cy="0" r="370" fill="none" stroke={CASPIAN_NOIR.highlightOr} strokeWidth="2" opacity={glowOp * 0.55} transform={`scale(${pulse3})`} />
            <circle cx="0" cy="0" r="490" fill="none" stroke={CASPIAN_NOIR.highlightOr} strokeWidth="1.5" opacity={glowOp * 0.35} transform={`scale(${pulse2})`} />
          </g>

          {/* Niger dot + plate label NIGER (template officiel dark navy + barre gold + IBM Plex Mono) */}
          <g transform={`translate(${nigerScreen.x} ${nigerScreen.y})`}>
            <circle cx={0} cy={0} r={22} fill={CASPIAN_NOIR.highlightOr} opacity={0.3} transform={`scale(${nigerPulse})`} />
            <circle cx={0} cy={0} r={11} fill={CASPIAN_NOIR.highlightOr} stroke="#0a0e16" strokeWidth={3} />
            {/* Plate au-dessus du dot */}
            <g transform="translate(-72 -56)">
              <rect x={0} y={0} width={144} height={32} rx={4} fill="#0d1525" opacity={0.92} />
              <rect x={0} y={0} width={3} height={32} fill={CASPIAN_NOIR.highlightOr} />
              <text x={72} y={22} fontFamily="'IBM Plex Mono', monospace" fontSize={18} fill="#ffffff" fontWeight={700} letterSpacing="0.22em" textAnchor="middle">NIGER</text>
            </g>
          </g>
        </svg>
      )}

      {/* BIG STAT "0€" — chiffre-pivot du climax (autorisé : pas dans la voix-off littérale)
          Position : centré horizontalement, partie basse du frame pour ne pas masquer le halo Niger.
          Pas de caption en dessous — la voix-off + sous-titres karaoke disent déjà "recettes qui n'entrent pas à Niamey". */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 280,
          opacity: bigStatOp,
          transform: `scale(${bigStatScale})`,
          pointerEvents: "none",
        }}
      >
        <div style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 360,
          lineHeight: 0.85,
          color: CASPIAN_NOIR.highlightOr,
          textAlign: "center",
          letterSpacing: "-0.02em",
          textShadow: `0 0 80px ${CASPIAN_NOIR.highlightOr}cc, 0 0 30px rgba(0,0,0,0.85)`,
        }}>
          0€
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BEAT 7 — Verdict CTA (frames 2663–2881)
// ─────────────────────────────────────────────────────────────────────────────

const Beat7Verdict: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beat 7 = 7.26s = 218 frames (88.78s → 96.04s)
  // Word-level cues (local frames):
  //   "Orano a un portefeuille mondial."   0  → 60   (line 1)
  //   "Le Niger a une mine."              63  → 105  (line 2)
  //   "Une partie d'échecs"              107  → 138  (knight + transition)
  //   "asymétrique."                     140  → 170
  //   "Sans vainqueur."                  172  → 196  (line 3 + stamp)
  //   "Pour l'instant."                  200  → 218

  const paperF   = 0;
  const headerF  = 12;
  const box1F    = 0;     // Orano portefeuille — speaks immediately
  const line1F   = 8;     // text reveal slightly after
  const box2F    = 63;    // Le Niger a une mine
  const line2F   = 71;
  const knightF  = 107;   // partie d'échecs
  const box3F    = 172;   // Sans vainqueur
  const line3F   = 180;
  const stampF   = 195;   // CONTESTÉ slam

  // SFX
  const stampVol = (f: number) => {
    const d = Math.abs(f - stampF);
    return d < 4 ? interpolate(d, [0, 4], [0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  };

  // Springs
  const paperProg  = spring({ frame: frame - paperF,   fps, config: { damping: 100, stiffness: 50 }, durationInFrames: 28 });
  const headerProg = spring({ frame: frame - headerF,  fps, config: { damping: 100, stiffness: 70 }, durationInFrames: 22 });
  const box1Prog   = spring({ frame: frame - box1F,    fps, config: { damping: 100, stiffness: 60 }, durationInFrames: 25 });
  const line1Prog  = spring({ frame: frame - line1F,   fps, config: { damping: 100, stiffness: 60 }, durationInFrames: 28 });
  const box2Prog   = spring({ frame: frame - box2F,    fps, config: { damping: 100, stiffness: 60 }, durationInFrames: 25 });
  const line2Prog  = spring({ frame: frame - line2F,   fps, config: { damping: 100, stiffness: 60 }, durationInFrames: 28 });
  const knightProg = spring({ frame: frame - knightF,  fps, config: { damping: 14,  stiffness: 130 }, durationInFrames: 24 });
  const box3Prog   = spring({ frame: frame - box3F,    fps, config: { damping: 100, stiffness: 55 }, durationInFrames: 28 });
  const line3Prog  = spring({ frame: frame - line3F,   fps, config: { damping: 100, stiffness: 55 }, durationInFrames: 32 });
  const stampProg  = spring({ frame: frame - stampF,   fps, config: { damping: 11, stiffness: 240 }, durationInFrames: 18 });

  // Mouvement permanent
  const grainShift = Math.sin(frame * 0.04) * 2.5;
  const stampBreath = 1 + Math.sin(frame * 0.08) * 0.018;
  const knightFloat = Math.sin(frame * 0.06) * 4;
  const paperBreath = Math.sin(frame * 0.05) * 0.18; // micro rotation degrees

  // Permanent slow scale on kraft bg (1.0 → 1.05 over 7s)
  const kraftScale = interpolate(frame, [0, 218], [1.0, 1.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Stamp impact: scale 3.0 → 1.0 hard
  const stampScale = interpolate(stampProg, [0, 1], [3.0, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * stampBreath;

  return (
    <AbsoluteFill style={{ background: "#3a2a18" }}>
      <Audio src={staticFile("souverain/niger-uranium/audio/sfx-stamp-dossier.mp3")} volume={stampVol} />

      {/* Kraft background Gemini-generated, slow scale */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${staticFile("souverain/niger-uranium/assets/storyboard-v3/kraft_bg.png")})`,
        backgroundSize: "cover",
        transform: `scale(${kraftScale})`,
        transformOrigin: "center",
      }} />
      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(20,12,4,0.5) 100%)",
      }} />
      {/* Subtle film grain shifting */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(-45deg, transparent 0 3px, rgba(40,20,5,0.05) 3px 4px)",
        transform: `translate(${grainShift}px, ${grainShift * 0.6}px)`,
        mixBlendMode: "multiply",
      }} />

      {/* Corner codes (z=2) */}
      <div style={{
        position: "absolute", left: 60, top: 50,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 22,
        color: "rgba(40,25,10,0.65)",
        letterSpacing: "0.3em",
        opacity: paperProg,
      }}>◯ COD1</div>
      <div style={{
        position: "absolute", right: 60, top: 50,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 22,
        color: "rgba(40,25,10,0.65)",
        letterSpacing: "0.3em",
        opacity: paperProg,
      }}>NER-2025-Σ ◯</div>
      <div style={{
        position: "absolute", left: 60, bottom: 50,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 22,
        color: "rgba(40,25,10,0.65)",
        letterSpacing: "0.3em",
        opacity: paperProg,
      }}>◯ CODE</div>

      {/* Stained document image with breath rotation */}
      <div style={{
        position: "absolute",
        left: 90, top: 200,
        width: 900, height: 1500,
        opacity: paperProg,
        transform: `translateY(${interpolate(paperProg, [0, 1], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px) rotate(${paperBreath}deg)`,
        transformOrigin: "center",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
      }}>
        <Img
          src={staticFile("souverain/niger-uranium/assets/storyboard-v3/stained_document_base.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Document border + corner circles */}
        <svg width={900} height={1500} style={{ position: "absolute", inset: 0 }}>
          <rect x={30} y={30} width={840} height={1440} fill="none" stroke="#1a1a1a" strokeWidth={3} strokeOpacity={0.7} />
          <circle cx={50} cy={50}  r={8} fill="none" stroke="#1a1a1a" strokeWidth={2} strokeOpacity={0.7} />
          <circle cx={850} cy={50} r={8} fill="none" stroke="#1a1a1a" strokeWidth={2} strokeOpacity={0.7} />
          <circle cx={50} cy={1450} r={8} fill="none" stroke="#1a1a1a" strokeWidth={2} strokeOpacity={0.7} />
          <circle cx={850} cy={1450} r={8} fill="none" stroke="#1a1a1a" strokeWidth={2} strokeOpacity={0.7} />
        </svg>

        {/* Header bandeau guilloché simplifié (z=5) */}
        <div style={{
          position: "absolute",
          left: 60, top: 80,
          width: 780, height: 90,
          background: "repeating-linear-gradient(90deg, #1a1a1a 0 16px, #2a2a2a 16px 32px)",
          opacity: headerProg,
          overflow: "hidden",
        }}>
          {/* Wave overlay */}
          <svg width={780} height={90} style={{ position: "absolute", inset: 0, opacity: 0.4 }}>
            <path
              d={Array.from({ length: 30 }, (_, i) => `M${i * 30},45 Q${i * 30 + 15},${i % 2 === 0 ? 15 : 75} ${i * 30 + 30},45`).join(" ")}
              fill="none" stroke="#aaa" strokeWidth={1}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 24,
            color: "#d4c29d",
            letterSpacing: "0.5em",
            fontWeight: 700,
          }}>
            VERDICT · PARTIE EN COURS
          </div>
        </div>

        {/* CRC text (z=4) */}
        <div style={{
          position: "absolute", right: 70, bottom: 100,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 20,
          color: "rgba(40,25,10,0.7)",
          letterSpacing: "0.2em",
          opacity: paperProg,
        }}>CRC1:88</div>

        {/* Signature scribble (z=4) */}
        <svg width={200} height={100} style={{
          position: "absolute", left: 80, bottom: 80,
          opacity: paperProg * 0.6,
        }}>
          <path d="M20,80 C40,20 60,10 70,50 C80,90 90,100 100,60 C110,20 120,80 140,80 L180,80"
                fill="none" stroke="#1a1a1a" strokeWidth={3} />
          <rect x={10} y={10} width={60} height={60} fill="none" stroke="#1a1a1a" strokeWidth={1} strokeOpacity={0.4} />
        </svg>

        {/* BOX 1 — Orano portefeuille mondial */}
        <div style={{
          position: "absolute",
          left: 80, top: 280,
          width: 740, height: 150,
          opacity: box1Prog,
          transform: `scaleY(${box1Prog})`,
          transformOrigin: "top",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            border: "2.5px solid #1a1a1a",
            background: "rgba(255,250,240,0.15)",
          }} />
          <div style={{
            position: "absolute",
            left: 28, top: 0, bottom: 0,
            display: "flex", alignItems: "center",
            opacity: line1Prog,
            transform: `translateX(${interpolate(line1Prog, [0, 1], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 56,
            color: "#1a1a1a",
            letterSpacing: "0.04em",
            lineHeight: 1.05,
            paddingRight: 20,
          }}>
            ORANO — PORTEFEUILLE MONDIAL
          </div>
        </div>

        {/* BOX 2 — Le Niger a une mine */}
        <div style={{
          position: "absolute",
          left: 80, top: 460,
          width: 740, height: 150,
          opacity: box2Prog,
          transform: `scaleY(${box2Prog})`,
          transformOrigin: "top",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            border: "2.5px solid #1a1a1a",
            background: "rgba(255,250,240,0.15)",
          }} />
          <div style={{
            position: "absolute",
            left: 28, top: 0, bottom: 0,
            display: "flex", alignItems: "center",
            opacity: line2Prog,
            transform: `translateX(${interpolate(line2Prog, [0, 1], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 56,
            color: "#c04a3a",
            letterSpacing: "0.04em",
            lineHeight: 1.05,
            paddingRight: 20,
          }}>
            NIGER — UNE MINE
          </div>
        </div>

        {/* BOX 3 — Sans vainqueur. Pour l'instant. */}
        <div style={{
          position: "absolute",
          left: 80, top: 640,
          width: 740, height: 150,
          opacity: box3Prog,
          transform: `scaleY(${box3Prog})`,
          transformOrigin: "top",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            border: "2.5px solid #1a1a1a",
            background: "rgba(255,250,240,0.15)",
          }} />
          <div style={{
            position: "absolute",
            left: 28, top: 0, bottom: 0, right: 28,
            display: "flex", flexDirection: "column", justifyContent: "center",
            opacity: line3Prog,
            transform: `translateX(${interpolate(line3Prog, [0, 1], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}>
            <div style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 44,
              color: "#1a1a1a",
              letterSpacing: "0.04em",
              lineHeight: 1.1,
            }}>
              SANS VAINQUEUR.
            </div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 22,
              color: "#5a3a1a",
              letterSpacing: "0.2em",
              marginTop: 8,
            }}>
              POUR L'INSTANT.
            </div>
          </div>
        </div>

        {/* Chess knight (z=6) */}
        <div style={{
          position: "absolute",
          right: 100, bottom: 280,
          fontSize: 220,
          fontFamily: "'Noto Sans Symbols 2', 'Segoe UI Symbol', serif",
          color: "#0a0a0a",
          opacity: knightProg,
          transform: `scale(${knightProg}) translateY(${knightFloat}px)`,
          textShadow: "0 6px 20px rgba(0,0,0,0.5)",
          lineHeight: 0.9,
        }}>
          ♞
        </div>
      </div>

      {/* CONTESTÉ stamp (z=8, outside doc rotation) */}
      {stampProg > 0.01 && (
        <div style={{
          position: "absolute",
          left: 540 - 240, top: 540,
          width: 480, height: 160,
          opacity: Math.min(1, stampProg * 1.2),
          transform: `rotate(-10deg) scale(${stampScale})`,
          transformOrigin: "center",
          zIndex: 80,
        }}>
          {/* Stamp double border */}
          <div style={{
            position: "absolute", inset: 0,
            border: "10px solid #c04a3a",
          }} />
          <div style={{
            position: "absolute", inset: 12,
            border: "3px solid #c04a3a",
          }} />
          {/* Text */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 92,
            color: "#c04a3a",
            letterSpacing: "0.1em",
            fontWeight: 700,
            // Worn texture effect
            textShadow: "1px 0 0 #c04a3a, -1px 0 0 #c04a3a",
            mixBlendMode: "multiply",
            opacity: 0.9,
          }}>
            CONTESTÉ
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SOUS-TITRES — NigerSubtitles (template Subtitles Or Africain)
// ─────────────────────────────────────────────────────────────────────────────

// Hook v2 words (character-level reconstruction)
const HOOK_V2_WORDS = (hookV2Words as { word: string; start: number; end: number }[]);

// Narration v5 words — filtres a partir du Beat 2 (start >= 12.619s)
// Dans le composant, ces mots sont joues via startFrom=379 donc leur timing est relatif a 12.619s
const V5_WORDS_FROM_BEAT2 = (alignmentData as { words: { text: string; start: number; end: number }[] }).words
  .filter((w) => w.text.trim().length > 0 && w.start >= 12.619)
  .map((w) => ({ word: w.text.trim(), start: w.start - 12.619, end: w.end - 12.619 }));

const NigerSubtitles: React.FC = () => {
  const BEAT2_START_F = BEATS.contexte53ans.startFrame; // 379

  return (
    <>
      {/* Beat 1 : sous-titres hook v2 (0 → Beat2) */}
      <Sequence from={0} durationInFrames={BEAT2_START_F}>
        <Subtitles
          sceneStartS={0}
          sceneEndS={9.76}
          highlightColor={CASPIAN_SEPIA.highlightOr}
          fontSize={52}
          bottomOffset={160}
          words={HOOK_V2_WORDS}
        />
      </Sequence>

      {/* Beat 2→7 : sous-titres narration v5 (relatifs au startFrom) */}
      <Sequence from={BEAT2_START_F} durationInFrames={TOTAL_FRAMES - BEAT2_START_F}>
        <Subtitles
          sceneStartS={0}
          sceneEndS={AUDIO_DURATION_S - 12.619}
          highlightColor={CASPIAN_SEPIA.highlightOr}
          fontSize={52}
          bottomOffset={160}
          words={V5_WORDS_FROM_BEAT2}
        />
      </Sequence>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BEAT 8 — CTA (frames 2881–3031, 5s)
// ─────────────────────────────────────────────────────────────────────────────

const Beat8CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 3 lignes en cascade — IBM Plex Mono + palette Caspian Sepia
  const LINE1_F = 8;   // like + abonne
  const LINE2_F = 55;  // newsletter
  const LINE3_F = 105; // lien en bio

  const bgProg = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const line1Prog = spring({ frame: frame - LINE1_F, fps, config: { damping: 28, stiffness: 80 }, durationInFrames: 22 });
  const line2Prog = spring({ frame: frame - LINE2_F, fps, config: { damping: 28, stiffness: 80 }, durationInFrames: 22 });
  const line3Prog = spring({ frame: frame - LINE3_F, fps, config: { damping: 28, stiffness: 80 }, durationInFrames: 22 });

  const kraftBreath = Math.sin(frame * 0.04) * 0.008 + 1.0;

  return (
    <AbsoluteFill style={{ background: "#1a1208", opacity: bgProg * fadeOut }}>
      {/* Fond kraft breathing */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${staticFile("souverain/niger-uranium/assets/storyboard-v3/kraft_bg.png")})`,
        backgroundSize: "cover",
        transform: `scale(${kraftBreath})`,
        transformOrigin: "center",
        opacity: 0.85,
      }} />
      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 25%, rgba(10,6,2,0.6) 100%)",
      }} />
      {/* Barre or horizontale centrée */}
      <div style={{
        position: "absolute", left: 160, right: 160, top: 760, height: 2,
        background: CASPIAN_SEPIA.highlightOr,
        opacity: interpolate(line1Prog, [0, 1], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }} />

      {/* LINE 1 — like + abonnement */}
      {frame >= LINE1_F && (
        <div style={{
          position: "absolute", top: 680, left: 0, right: 0,
          opacity: line1Prog,
          transform: `translateY(${interpolate(line1Prog, [0, 1], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "0 80px",
        }}>
          <svg width={68} height={68} viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#ffffff" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }} />
          </svg>
          <p style={{
            margin: 0, fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 44, fontWeight: 700, color: "#ffffff",
            letterSpacing: "0.04em", textAlign: "center", lineHeight: 1.3,
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}>
            Like si tu as appris quelque chose
          </p>
          <p style={{
            margin: 0, fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 30, color: "#e8dcc8",
            letterSpacing: "0.06em", textAlign: "center",
            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
          }}>
            Abonne-toi pour la suite
          </p>
        </div>
      )}

      {/* LINE 2 — newsletter */}
      {frame >= LINE2_F && (
        <div style={{
          position: "absolute", top: 1080, left: 0, right: 0,
          opacity: line2Prog,
          transform: `translateY(${interpolate(line2Prog, [0, 1], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "0 80px",
        }}>
          <svg width={68} height={68} viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="#ffffff" strokeWidth="2.2" fill="rgba(255,255,255,0.1)" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }} />
            <path d="M2 7l10 7 10-7" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <p style={{
            margin: 0, fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 44, fontWeight: 700, color: "#ffffff",
            letterSpacing: "0.04em", textAlign: "center",
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}>
            Newsletter
          </p>
          <p style={{
            margin: 0, fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 30, color: "#e8dcc8",
            letterSpacing: "0.06em", textAlign: "center",
            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
          }}>
            L&apos;actualité africaine autrement
          </p>
        </div>
      )}

      {/* LINE 3 — lien en bio */}
      {frame >= LINE3_F && (
        <div style={{
          position: "absolute", top: 1470, left: 0, right: 0,
          opacity: line3Prog,
          transform: `translateY(${interpolate(line3Prog, [0, 1], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "0 80px",
        }}>
          <svg width={68} height={68} viewBox="0 0 24 24" fill="none">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }} />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <p style={{
            margin: 0, fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 60, fontWeight: 700, color: "#ffffff",
            letterSpacing: "0.15em", textAlign: "center",
            textShadow: "0 2px 16px rgba(0,0,0,0.9)",
          }}>
            LIEN EN BIO
          </p>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITION PRINCIPALE
// ─────────────────────────────────────────────────────────────────────────────

export const NigerUraniumShort: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#0d0f14" }}>
      {/* Hook v2 — remplace le hook original du fichier v5 (Beat 1 uniquement) */}
      <Audio
        src={staticFile("souverain/niger-uranium/audio/hook-v2.mp3")}
        volume={1.0}
        endAt={Math.round(9.76 * fps)}
      />

      {/* Narration v5 — demarre au Beat 2 uniquement (pas de chevauchement avec hook v2) */}
      <Sequence from={BEATS.contexte53ans.startFrame} durationInFrames={TOTAL_DURATION_FRAMES - BEATS.contexte53ans.startFrame}>
        <Audio
          src={staticFile("souverain/niger-uranium/audio/narration-niger-uranium-v5.mp3")}
          startFrom={Math.round(12.619 * fps)}
          playbackRate={1}
          volume={1.0}
        />
      </Sequence>

      {/* Musique de fond — continue jusqu'a la fin du CTA */}
      <Audio
        src={staticFile("souverain/niger-uranium/audio/music-v1.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [0, fps * 2, TOTAL_DURATION_FRAMES - 30, TOTAL_DURATION_FRAMES],
            [0, 0.07, 0.07, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
      />

      {/* BEAT 1 — Hook Globe */}
      <Sequence
        from={BEATS.hook.startFrame}
        durationInFrames={BEATS.hook.endFrame - BEATS.hook.startFrame}
        premountFor={fps}
      >
        <Beat1Hook />
      </Sequence>

      {/* BEAT 2 — Contexte 53 ans */}
      <Sequence
        from={BEATS.contexte53ans.startFrame}
        durationInFrames={BEATS.contexte53ans.endFrame - BEATS.contexte53ans.startFrame}
        premountFor={fps}
      >
        <Beat2Contexte />
      </Sequence>

      {/* BEAT 3 — Nationalisation */}
      <Sequence
        from={BEATS.nationalisation.startFrame}
        durationInFrames={BEATS.nationalisation.endFrame - BEATS.nationalisation.startFrame}
        premountFor={fps}
      >
        <Beat3Nationalisation />
      </Sequence>

      {/* BEAT 4 — Bras de fer juridique */}
      <Sequence
        from={BEATS.brasDeFer.startFrame}
        durationInFrames={BEATS.brasDeFer.endFrame - BEATS.brasDeFer.startFrame}
        premountFor={fps}
      >
        <Beat4BrasDeFer />
      </Sequence>

      {/* BEAT 5 — Asymétrie */}
      <Sequence
        from={BEATS.asymetrie.startFrame}
        durationInFrames={BEATS.asymetrie.endFrame - BEATS.asymetrie.startFrame}
        premountFor={fps}
      >
        <Beat5Asymetrie />
      </Sequence>

      {/* BEAT 6 — Climax */}
      <Sequence
        from={BEATS.climax.startFrame}
        durationInFrames={BEATS.climax.endFrame - BEATS.climax.startFrame}
        premountFor={fps}
      >
        <Beat6Climax />
      </Sequence>

      {/* BEAT 7 — Verdict CTA */}
      <Sequence
        from={BEATS.verdict.startFrame}
        durationInFrames={BEATS.verdict.endFrame - BEATS.verdict.startFrame}
        premountFor={fps}
      >
        <Beat7Verdict />
      </Sequence>

      {/* BEAT 8 — CTA post-verdict */}
      <Sequence
        from={CTA_START_FRAME}
        durationInFrames={CTA_DURATION_FRAMES}
        premountFor={fps}
      >
        <Beat8CTA />
      </Sequence>

      {/* Sous-titres par-dessus tout (narration uniquement, pas sur CTA) */}
      <NigerSubtitles />
    </AbsoluteFill>
  );
};
