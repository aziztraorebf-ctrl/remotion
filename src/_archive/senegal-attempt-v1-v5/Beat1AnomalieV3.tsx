/**
 * Beat 1 V3 — L'Anomalie (directive production complète)
 *
 * Architecture : <Series> 3 séquences audio-anchored
 *   SEQ1 (f0→f360,  12s) : MapSequence — bezier zoom + pitch 45° + pulses offshore
 *   SEQ2 (f360→f555, ~6.5s) : BigStatSequence — spring rebond + D3 curveBasis
 *   SEQ3 (f555→f1299, ~24.8s) : TextFracture — guillotine clipPath + TypeReveal + Sankey
 *
 * Anchors audio-derived (timing.ts recalibrés 2026-05-19) :
 *   bigstatReveal    = 555  ("Huit millions de dollars par jour" @ 18.5s)
 *   contradictionBeat = 871 ("Et pourtant" @ 29.04s — offset 871-555=316 dans SEQ3)
 *   acte1LastWord     = 1260 ("direct." @ 42.0s)
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";
import {
  applyCartoCaspian,
  CartoCaspianOverlay,
  CASPIAN_SEPIA,
} from "../../_shared/mapbox/templates/CartoCaspian";
import { AUDIO_SEGMENTS } from "./timing";

// Charger Cinzel au niveau module (une seule fois)
const { fontFamily: CINZEL } = loadFont();

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const BEAT = AUDIO_SEGMENTS.acte1_anomalie;
const BEAT_DUR = BEAT.endFrame - BEAT.startFrame; // 1299

// Anchors audio-derived (recalibrés 2026-05-19 — audio trimmed, forced-alignment loss=0.110)
const BIGSTAT_REVEAL     = 555;  // "Huit millions de dollars par jour" @ 18.5s
const CONTRADICTION_BEAT = 871;  // "Et pourtant, l'État n'est pas certain" @ 29.04s
const ACTE1_LAST_WORD    = 1260; // "tester en direct." @ 42.0s

// Durées Series dérivées des anchors — jamais hardcodées
const SEQ1_DUR = 360;                              // 12s carte
const SEQ2_DUR = BIGSTAT_REVEAL - SEQ1_DUR;        // 195f ~6.5s BigStat
const SEQ3_DUR = BEAT_DUR - BIGSTAT_REVEAL;        // 744f ~24.8s fracture+typewriter

// Palette
const GOLD           = "#d4a93c";
const HIGHLIGHT      = CASPIAN_SEPIA.highlightOr;
const EDITORIAL_BG   = "#0b0f19";

// Caméra Mapbox
const CAM_START  = { lat: 4.0,   lon: -8.0,  zoom: 2.0,  pitch: 0,  bearing: 0   };
const CAM_END    = { lat: 13.9,  lon: -17.5, zoom: 6.2,  pitch: 45, bearing: -15 };

// Gisements offshore
const SANGOMAR = { lat: 13.82, lon: -17.50, label: "SANGOMAR" };
const GTA      = { lat: 16.55, lon: -16.45, label: "GTA"      };

const AUDIO_END_AT = ACTE1_LAST_WORD + 30;

// ─────────────────────────────────────────────────────────────────────────────
// EditorialBackground — bleu-nuit #0b0f19 + dégradé radial studio
// ─────────────────────────────────────────────────────────────────────────────
const EditorialBackground: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundColor: EDITORIAL_BG,
      backgroundImage:
        "radial-gradient(ellipse 70% 55% at 50% 48%, #141c2e 0%, #0b0f19 100%)",
      opacity,
    }}
  />
);

// ─────────────────────────────────────────────────────────────────────────────
// Composant principal — orchestre les 3 séquences
// ─────────────────────────────────────────────────────────────────────────────
export const Beat1AnomalieV3: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: CASPIAN_SEPIA.water }}>
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3")}
        startFrom={BEAT.startFrame}
        endAt={AUDIO_END_AT}
      />

      <Series>
        {/* SEQ 1 — Approche cartographique (12s) */}
        <Series.Sequence durationInFrames={SEQ1_DUR}>
          <MapSequence />
        </Series.Sequence>

        {/* SEQ 2 — BigStat jaillit + D3 vagues (~13s) */}
        <Series.Sequence durationInFrames={SEQ2_DUR}>
          <BigStatSequence />
        </Series.Sequence>

        {/* SEQ 3 — Fracture + TypeReveal + Sankey (~25s) */}
        <Series.Sequence durationInFrames={SEQ3_DUR}>
          <TextFracture contradictionOffset={CONTRADICTION_BEAT - BIGSTAT_REVEAL} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SEQ 1 — MapSequence
// Zoom Easing.bezier(0.64,0,0.78,0) + pitch 45° + pulses SVG Sangomar/GTA
// Label ancré via map.project()
// ─────────────────────────────────────────────────────────────────────────────
const MapSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("beat1-v3-map"));
  const [labelPos, setLabelPos] = useState<{ x: number; y: number } | null>(null);
  const [sangPos, setSangPos]   = useState<{ x: number; y: number } | null>(null);
  const [gtaPos, setGtaPos]     = useState<{ x: number; y: number } | null>(null);

  const DUR = SEQ1_DUR;

  // Bezier curve Gemini : démarre lent, accélère brutalement
  const bezierEase = Easing.bezier(0.64, 0, 0.78, 0);
  const t = Math.min(frame / DUR, 1);
  const eased = bezierEase(t);

  const zoom    = interpolate(eased, [0, 1], [CAM_START.zoom,    CAM_END.zoom]);
  const lon     = interpolate(eased, [0, 1], [CAM_START.lon,     CAM_END.lon]);
  const lat     = interpolate(eased, [0, 1], [CAM_START.lat,     CAM_END.lat]);
  const pitch   = interpolate(eased, [0, 1], [CAM_START.pitch,   CAM_END.pitch]);
  const bearing = interpolate(eased, [0, 1], [CAM_START.bearing, CAM_END.bearing]);

  const mapOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulses apparaissent à 4*fps
  const PULSE_START = 4 * fps;
  const showPulses = frame >= PULSE_START;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM_START.lon, CAM_START.lat],
      zoom: CAM_START.zoom,
      pitch: CAM_START.pitch,
      bearing: CAM_START.bearing,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      applyCartoCaspian(map, CASPIAN_SEPIA);

      map.addSource("senegal-src", {
        type: "vector",
        url: "mapbox://mapbox.country-boundaries-v1",
      });
      map.addLayer({
        id: "senegal-fill",
        type: "fill",
        source: "senegal-src",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "SEN"],
        paint: { "fill-color": HIGHLIGHT, "fill-opacity": 0.45 },
      });
      map.addLayer({
        id: "senegal-border",
        type: "line",
        source: "senegal-src",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "SEN"],
        paint: { "line-color": HIGHLIGHT, "line-width": 2.2, "line-opacity": 0.95 },
      });

      continueRender(handle);
    });
  }, [handle]);

  // Mise à jour caméra + positions labels via map.project()
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setCenter([lon, lat]);
    map.setZoom(zoom);
    map.setPitch(pitch);
    map.setBearing(bearing);

    // Ancrage label Sénégal sur centroïde réel
    const labelPx = map.project([CAM_END.lon + 1.8, CAM_END.lat]);
    setLabelPos({ x: labelPx.x, y: labelPx.y });

    // Anchors gisements
    const sangPx = map.project([SANGOMAR.lon, SANGOMAR.lat]);
    setSangPos({ x: sangPx.x, y: sangPx.y });
    const gtaPx = map.project([GTA.lon, GTA.lat]);
    setGtaPos({ x: gtaPx.x, y: gtaPx.y });
  }, [frame, lon, lat, zoom, pitch, bearing]);

  return (
    <AbsoluteFill style={{ backgroundColor: CASPIAN_SEPIA.water }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, opacity: mapOpacity }} />
      <CartoCaspianOverlay opacity={0.05} />

      {/* Label SÉNÉGAL ancré via map.project() */}
      {labelPos && frame >= PULSE_START && (
        <SenegalLabel x={labelPos.x} y={labelPos.y} frame={frame} startAt={PULSE_START} fps={fps} />
      )}

      {/* Pulses offshore */}
      {showPulses && sangPos && (
        <OffshorePulse x={sangPos.x} y={sangPos.y} name="SANGOMAR" frame={frame} fps={fps} startAt={PULSE_START} delay={0} />
      )}
      {showPulses && gtaPos && (
        <OffshorePulse x={gtaPos.x} y={gtaPos.y} name="GTA" frame={frame} fps={fps} startAt={PULSE_START} delay={20} />
      )}
    </AbsoluteFill>
  );
};

// Label Sénégal positionné précisément via map.project
const SenegalLabel: React.FC<{ x: number; y: number; frame: number; startAt: number; fps: number }> = ({
  x, y, frame, startAt, fps,
}) => {
  const p = spring({ frame: frame - startAt, fps, config: { damping: 80, stiffness: 60 }, durationInFrames: 20 });
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale   = interpolate(p, [0, 1], [0.8, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
      pointerEvents: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 5,
    }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: GOLD, boxShadow: `0 0 10px ${GOLD}bb` }} />
      <span style={{
        fontFamily: CINZEL,
        fontSize: 24,
        color: "#1a1209",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        textShadow: "0 1px 4px rgba(255,255,255,0.9)",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}>
        SÉNÉGAL
      </span>
    </div>
  );
};

// Pulse concentrique SVG — modulo frame pour boucle infinie
const OffshorePulse: React.FC<{
  x: number; y: number; name: string;
  frame: number; fps: number; startAt: number; delay: number;
}> = ({ x, y, name, frame, fps, startAt, delay }) => {
  const localF = Math.max(0, frame - startAt - delay);
  const entryP = spring({ frame: localF, fps, config: { damping: 80, stiffness: 55 }, durationInFrames: 18 });
  const entryOpacity = interpolate(entryP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const rings = [0, 20, 40];
  const CYCLE = 2 * fps; // 60f

  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", pointerEvents: "none" }}>
      <svg style={{ position: "absolute", left: -70, top: -70, overflow: "visible" }} width={140} height={140}>
        {/* Dot central */}
        <circle cx={70} cy={70} r={6} fill={GOLD} opacity={entryOpacity} style={{ filter: `drop-shadow(0 0 6px ${GOLD})` }} />

        {/* 3 anneaux en boucle via modulo */}
        {rings.map((ringDelay, i) => {
          const ringF = Math.max(0, localF - ringDelay) % CYCLE;
          const progress = ringF / CYCLE;
          const r = interpolate(progress, [0, 1], [6, 55]);
          const ringOpacity = interpolate(progress, [0, 0.25, 1], [0.9, 0.5, 0]) * entryOpacity;
          return (
            <circle key={i} cx={70} cy={70} r={r} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={ringOpacity} />
          );
        })}
      </svg>

      {/* Label champ */}
      <div style={{
        position: "absolute",
        top: 12,
        left: 10,
        opacity: entryOpacity,
        whiteSpace: "nowrap",
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 20,
          color: "#1a1209",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontWeight: 700,
          textShadow: "0 1px 3px rgba(255,255,255,0.85)",
        }}>
          {name}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SEQ 2 — BigStatSequence
// spring(damping:10, mass:0.6, stiffness:100) + D3 curveBasis sinusoïdale
// ─────────────────────────────────────────────────────────────────────────────
const BigStatSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Émergence spring — config Gemini
  const emergenceP = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 100 },
  });
  const translateY = interpolate(emergenceP, [0, 1], [320, 0]);
  const contentOpacity = interpolate(emergenceP, [0, 0.2, 1], [0, 1, 1], { extrapolateRight: "clamp" });

  // Fade-in fond éditorial
  const bgOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse lent du chiffre
  const pulseScale = 1 + Math.sin(frame * 0.07) * 0.011;

  return (
    <AbsoluteFill>
      <EditorialBackground opacity={bgOpacity} />
      <D3WaveBackground frame={frame} opacity={bgOpacity} />

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateY(${translateY}px)`,
        opacity: contentOpacity,
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
          fontSize: 230,
          lineHeight: 0.85,
          color: "#ffffff",
          textAlign: "center",
          letterSpacing: "-0.01em",
          transform: `scale(${pulseScale})`,
        }}>
          8 000 000 $
        </div>

        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 74,
          color: GOLD,
          textAlign: "center",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: 10,
        }}>
          / JOUR
        </div>

        <div style={{
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          fontSize: 30,
          color: "rgba(255,255,255,0.5)",
          textAlign: "center",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: 36,
          fontWeight: 500,
        }}>
          REVENUS PÉTROLE ET GAZ — SÉNÉGAL 2024
        </div>
      </div>
    </AbsoluteFill>
  );
};

// D3 curveBasis — onde sinusoïdale dorée (Gemini)
const D3WaveBackground: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const W = 1920;
  const H = 1080;
  const WAVE_COUNT = 5;

  const paths = Array.from({ length: WAVE_COUNT }, (_, wi) => {
    const points: [number, number][] = Array.from({ length: 80 }, (__, i) => {
      const x = (i / 79) * W;
      const y = H * 0.5 + Math.sin(i * 0.28 + frame * 0.08 + wi * 1.3) * (12 + wi * 7);
      return [x, y];
    });

    const lineGen = d3.line<[number, number]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(d3.curveBasis);

    return {
      d: lineGen(points) ?? "",
      strokeOpacity: (0.15 - wi * 0.02) * opacity,
    };
  });

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill="none" stroke={GOLD} strokeWidth={1.8} opacity={p.strokeOpacity} />
      ))}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SEQ 3 — TextFracture
// Guillotine LeftPiece/RightPiece + TypeReveal typewriter + Sankey 3 blocs
// contradictionOffset = 871 - 555 = 316f (dans le référentiel local SEQ3)
// ─────────────────────────────────────────────────────────────────────────────
interface TextFractureProps {
  contradictionOffset: number;
}

const TextFracture: React.FC<TextFractureProps> = ({ contradictionOffset }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A : BigStat affiché encore (~0→contradictionOffset)
  // Phase B : fracture démarre à contradictionOffset
  // Phase C : TypeReveal + Sankey sur fond éditorial flouté
  const FRACTURE_START = contradictionOffset; // 312f
  const TYPEWRITER_START = FRACTURE_START + 60; // laisser la fracture se terminer

  const showBigStat = frame < FRACTURE_START + 90;
  const showTypeReveal = frame >= TYPEWRITER_START;

  // BigStat opacity — sort progressivement quand fracture complète
  const bigStatOpacity = interpolate(frame, [FRACTURE_START + 60, FRACTURE_START + 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <EditorialBackground />
      <D3WaveBackground frame={frame + SEQ1_DUR + SEQ2_DUR} opacity={showBigStat ? bigStatOpacity * 0.6 : 0} />

      {/* BigStat stable jusqu'à la fracture */}
      {showBigStat && (
        <div style={{ position: "absolute", inset: 0, opacity: bigStatOpacity }}>
          <BigStatStatic />
        </div>
      )}

      {/* Fracture LeftPiece + RightPiece */}
      {frame >= FRACTURE_START && frame < FRACTURE_START + 90 && (
        <GuillofinePieces frame={frame} fps={fps} fractureStart={FRACTURE_START} />
      )}

      {/* Ligne de coupe dorée */}
      {frame >= FRACTURE_START && frame < FRACTURE_START + 45 && (
        <FractureLine frame={frame} fractureStart={FRACTURE_START} />
      )}

      {/* TypeReveal typewriter + Sankey */}
      {showTypeReveal && (
        <Phase5Layer frame={frame} fps={fps} startFrame={TYPEWRITER_START} />
      )}
    </AbsoluteFill>
  );
};

// BigStat statique (position finale, sans animation d'entrée)
const BigStatStatic: React.FC = () => (
  <div style={{
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }}>
    <div style={{
      fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
      fontSize: 230,
      lineHeight: 0.85,
      color: "#ffffff",
      textAlign: "center",
      letterSpacing: "-0.01em",
    }}>
      8 000 000 $
    </div>
    <div style={{
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 74,
      color: GOLD,
      textAlign: "center",
      letterSpacing: "0.12em",
      marginTop: 10,
    }}>
      / JOUR
    </div>
  </div>
);

// Jumeaux LeftPiece / RightPiece — clipPath oblique (Gemini)
const GuillofinePieces: React.FC<{ frame: number; fps: number; fractureStart: number }> = ({
  frame, fps, fractureStart,
}) => {
  const localF = Math.max(0, frame - fractureStart);

  const cutP = spring({ frame: localF, fps, config: { damping: 14, stiffness: 110 }, durationInFrames: 35 });

  // RightPiece — glisse vers le bas, tourne légèrement, disparaît
  const rightY       = interpolate(cutP, [0, 1], [0, 380]);
  const rightRotate  = interpolate(cutP, [0, 1], [0, 6]);
  const rightOpacity = interpolate(cutP, [0, 0.35, 1], [1, 0.65, 0]);

  // LeftPiece — légère vibration d'impact
  const shakeMag = interpolate(cutP, [0, 0.15, 0.4, 1], [0, 6, 2, 0]);
  const shakeX   = shakeMag * Math.sin(localF * 1.8);

  const sharedText: React.CSSProperties = {
    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
    fontSize: 230,
    lineHeight: 0.85,
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: "-0.01em",
    whiteSpace: "nowrap",
  };
  const sharedUnit: React.CSSProperties = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 74,
    color: GOLD,
    textAlign: "center",
    letterSpacing: "0.12em",
    marginTop: 10,
  };
  const sharedWrap: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  };

  // Ligne de fracture oblique : polygon coupe à ~50% horizontal avec angle 8°
  const LEFT_CLIP  = "polygon(0% 0%, 54% 0%, 46% 100%, 0% 100%)";
  const RIGHT_CLIP = "polygon(54% 0%, 100% 0%, 100% 100%, 46% 100%)";

  return (
    <>
      {/* LeftPiece — stable avec micro-vibration */}
      <div style={{ ...sharedWrap, clipPath: LEFT_CLIP, transform: `translateX(${shakeX}px)` }}>
        <div style={sharedText}>8 000 000 $</div>
        <div style={sharedUnit}>/ JOUR</div>
      </div>

      {/* RightPiece — glisse et tombe */}
      <div style={{
        ...sharedWrap,
        clipPath: RIGHT_CLIP,
        transform: `translateY(${rightY}px) rotate(${rightRotate}deg)`,
        opacity: rightOpacity,
      }}>
        <div style={sharedText}>8 000 000 $</div>
        <div style={sharedUnit}>/ JOUR</div>
      </div>
    </>
  );
};

// Ligne dorée de fracture qui traverse l'écran
const FractureLine: React.FC<{ frame: number; fractureStart: number }> = ({ frame, fractureStart }) => {
  const localF = frame - fractureStart;
  const progress = interpolate(localF, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineOpacity = interpolate(localF, [0, 5, 35, 45], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <line
        x1={0}
        y1={1080 * 0.43}
        x2={1920 * progress}
        y2={1080 * 0.57}
        stroke={GOLD}
        strokeWidth={2.5}
        opacity={lineOpacity}
        strokeLinecap="round"
      />
    </svg>
  );
};

// Phase 5 — carte floue + TypeReveal typewriter + Sankey
const Phase5Layer: React.FC<{ frame: number; fps: number; startFrame: number }> = ({
  frame, fps, startFrame,
}) => {
  const localF = Math.max(0, frame - startFrame);

  const overlayOpacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const SANKEY_START = 200;
  const sankeyOpacity = interpolate(localF, [SANKEY_START, SANKEY_START + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Overlay radial sombre */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: `rgba(11,15,25,${overlayOpacity * 0.88})`,
        backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 46%, rgba(20,28,46,${overlayOpacity * 0.85}) 0%, rgba(11,15,25,${overlayOpacity * 0.95}) 70%)`,
      }} />

      <TypewriterReveal frame={frame} fps={fps} startFrame={startFrame} overlayOpacity={overlayOpacity} />

      {localF >= SANKEY_START && (
        <SankeyBlocs frame={frame} fps={fps} localF={localF} opacity={sankeyOpacity} />
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TypeReveal — vrai typewriter lettre par lettre 5f/char, Cinzel
// ─────────────────────────────────────────────────────────────────────────────
const FRAMES_PER_CHAR = 5;
const T_BEFORE  = "La vraie question n'est pas ";
const T_KEYWORD = "COMBIEN";
const T_AFTER   = " il va garder.";

interface TypewriterRevealProps {
  frame: number;
  fps: number;
  startFrame: number;
  overlayOpacity: number;
}

const TypewriterReveal: React.FC<TypewriterRevealProps> = ({ frame, fps, startFrame, overlayOpacity }) => {
  const localF = Math.max(0, frame - startFrame);
  const totalTyped = Math.floor(localF / FRAMES_PER_CHAR);

  const beforeLen = T_BEFORE.length;
  const kwLen     = T_KEYWORD.length;

  const visibleBefore  = T_BEFORE.slice(0, Math.min(totalTyped, beforeLen));
  const kwTyped        = Math.max(0, Math.min(totalTyped - beforeLen, kwLen));
  const visibleKeyword = T_KEYWORD.slice(0, kwTyped);
  const afterTyped     = Math.max(0, totalTyped - beforeLen - kwLen);
  const visibleAfter   = T_AFTER.slice(0, afterTyped);
  const allDone        = totalTyped >= beforeLen + kwLen + T_AFTER.length;

  const cursorBlink = Math.floor(localF / 12) % 2 === 0 ? 1 : 0;

  // Keyword spring d'entrée
  const kwStartAbs = startFrame + beforeLen * FRAMES_PER_CHAR;
  const kwP = spring({
    frame: Math.max(0, frame - kwStartAbs),
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const kwScale = interpolate(kwP, [0, 1], [0.35, 1], { extrapolateRight: "clamp" });

  const doneFr = startFrame + (beforeLen + kwLen + T_AFTER.length) * FRAMES_PER_CHAR + 15;
  const subtitleOpacity = interpolate(frame, [doneFr, doneFr + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{
      position: "absolute",
      top: "50%",
      left: 0,
      right: 0,
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "center",
      flexWrap: "wrap",
      paddingLeft: 56,
      paddingRight: 56,
      gap: 0,
      opacity: overlayOpacity,
    }}>
      {visibleBefore.length > 0 && (
        <span style={{ fontSize: 72, fontFamily: CINZEL, color: "#fdf6e3", lineHeight: 1.2 }}>
          {visibleBefore}
        </span>
      )}

      {visibleKeyword.length > 0 && (
        <span style={{
          fontSize: 195,
          fontFamily: CINZEL,
          fontWeight: 900,
          color: "#e9d59e",
          lineHeight: 1,
          transform: `scale(${kwScale})`,
          display: "inline-block",
          transformOrigin: "center bottom",
          textShadow: "0 0 60px rgba(233,213,158,0.75), 0 0 20px rgba(233,213,158,0.5)",
          marginLeft: 12,
          marginRight: 12,
        }}>
          {visibleKeyword}
        </span>
      )}

      {visibleAfter.length > 0 && (
        <span style={{ fontSize: 72, fontFamily: CINZEL, color: "#fdf6e3", lineHeight: 1.2 }}>
          {visibleAfter}
        </span>
      )}

      {!allDone && (
        <span style={{
          display: "inline-block",
          backgroundColor: "#e9d59e",
          width: 4,
          height: 72,
          marginLeft: 5,
          verticalAlign: "middle",
          opacity: cursorBlink,
          flexShrink: 0,
        }} />
      )}

      {/* Sous-titre */}
      <div style={{
        position: "absolute",
        bottom: "-18%",
        left: 0, right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: subtitleOpacity,
      }}>
        <div style={{ width: 260, height: 1, backgroundColor: "#9a8a6a", opacity: 0.5 }} />
        <span style={{
          color: "#9a8a6a",
          fontSize: 26,
          fontFamily: CINZEL,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}>
          SÉNÉGAL · PÉTROLE & GAZ · 2024
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Sankey 3 blocs — flux financiers animés
// ─────────────────────────────────────────────────────────────────────────────
interface SankeyBlocsProps {
  frame: number;
  fps: number;
  localF: number;
  opacity: number;
}

const SANKEY_BLOCS = [
  { label: "COMPAGNIES",   pct: "~40%", color: "#7a5040" },
  { label: "FONSIS",       pct: "~12%", color: GOLD       },
  { label: "BUDGET ÉTAT",  pct: "~48%", color: "#3a6a4a" },
];

const SankeyBlocs: React.FC<SankeyBlocsProps> = ({ fps, localF, opacity }) => {
  const SANKEY_START = 200;
  const srcLocalF = Math.max(0, localF - SANKEY_START);

  const srcP = spring({ frame: srcLocalF, fps, config: { damping: 80, stiffness: 55 }, durationInFrames: 22 });
  const srcOpacity = interpolate(srcP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const srcY = interpolate(srcP, [0, 1], [18, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute",
      bottom: 72,
      left: 0, right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      opacity,
      pointerEvents: "none",
    }}>
      {/* Source */}
      <div style={{
        opacity: srcOpacity,
        transform: `translateY(${srcY}px)`,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderTop: `2px solid ${GOLD}`,
        paddingTop: 9,
        paddingBottom: 9,
        paddingLeft: 28,
        paddingRight: 28,
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 18,
          color: "rgba(255,255,255,0.65)",
          letterSpacing: "0.13em",
          textTransform: "uppercase",
        }}>
          REVENU BRUT · 8 000 000 $ / JOUR
        </span>
      </div>

      {/* Flèche */}
      <svg width={20} height={20} style={{ opacity: srcOpacity }}>
        <polyline points="10,0 10,15 5,10 10,15 15,10" fill="none" stroke={GOLD} strokeWidth={1.5} />
      </svg>

      {/* 3 blocs */}
      <div style={{ display: "flex", flexDirection: "row", gap: 14 }}>
        {SANKEY_BLOCS.map((bloc, i) => {
          const bDelay = i * 18;
          const bLocalF = Math.max(0, srcLocalF - bDelay);
          const bP = spring({ frame: bLocalF, fps, config: { damping: 80, stiffness: 65 }, durationInFrames: 18 });
          const bOpacity = interpolate(bP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const bY = interpolate(bP, [0, 1], [14, 0], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              opacity: bOpacity,
              transform: `translateY(${bY}px)`,
              borderLeft: `3px solid ${bloc.color}`,
              backgroundColor: "rgba(11,15,25,0.72)",
              paddingTop: 9,
              paddingBottom: 9,
              paddingLeft: 16,
              paddingRight: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 3,
              minWidth: 188,
            }}>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 30,
                color: bloc.color === GOLD ? GOLD : "rgba(255,255,255,0.88)",
                letterSpacing: "0.06em",
              }}>
                {bloc.pct}
              </span>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 14,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {bloc.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Beat1AnomalieV3;
