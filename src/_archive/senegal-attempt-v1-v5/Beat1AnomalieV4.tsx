/**
 * Beat 1 V4 — L'Anomalie
 *
 * Changements vs V3 :
 * - Style Mapbox : dark-v11 + palette navy #0b1f35 (au lieu de CartoCaspian sepia)
 * - Fond panels non-Mapbox : SVGGrain sur navy (identité épisode TextureB)
 * - Caméra : lerpCamera() via camera-chapters.ts (au lieu de bezier inline)
 * - Shared components : GoldLine, CountUp, Badge, Baseline, SVGGrain depuis _shared/ui/
 *
 * Architecture : <Series> 3 séquences audio-anchored (identique V3)
 *   SEQ1 (f0→f360,  12s)  : MapSequence — lerpCamera + pulses offshore
 *   SEQ2 (f360→f555, ~6.5s) : BigStatSequence — spring rebond + D3 curveBasis
 *   SEQ3 (f555→f1299, ~24.8s) : TextFracture — guillotine + TypeReveal + Sankey
 *
 * Anchors audio-derived (timing.ts recalibrés 2026-05-19) :
 *   bigstatReveal     = 555  ("Huit millions de dollars par jour" @ 18.5s)
 *   contradictionBeat = 871  ("Et pourtant" @ 29.04s)
 *   thesisIntro       = 1119 ("mécanique" @ 37.3s)
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
import { AUDIO_SEGMENTS } from "./timing";
import { CHAPTERS_BEAT1, lerpCamera, OFFSHORE_POINTS } from "./camera-chapters";
import { Badge } from "../../_shared/components/ui/Badge";
import { Baseline } from "../../_shared/components/ui/Baseline";
import { CountUp } from "../../_shared/components/ui/CountUp";
import { GoldLine } from "../../_shared/components/ui/GoldLine";
import { SVGGrain } from "../../_shared/components/ui/SVGGrain";

const { fontFamily: CINZEL } = loadFont();

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const BEAT = AUDIO_SEGMENTS.acte1_anomalie;
const BEAT_DUR = BEAT.endFrame - BEAT.startFrame; // 1299

const BIGSTAT_REVEAL     = 555;
const CONTRADICTION_BEAT = 871;
const ACTE1_LAST_WORD    = 1260;

const SEQ1_DUR = 360;
const SEQ2_DUR = BIGSTAT_REVEAL - SEQ1_DUR;   // 195f
const SEQ3_DUR = BEAT_DUR - BIGSTAT_REVEAL;   // 744f

// Palette épisode
const GOLD        = "#d4a93c";
const NAVY        = "#0b1f35";
const IVORY       = "#f5f0e8";
const BADGE_RED   = "#5a1010";
const BADGE_RED_B = "#8b2020";
const BADGE_AMB   = "#7a4a10";
const BADGE_AMB_B = "#c47a20";

const AUDIO_END_AT = ACTE1_LAST_WORD + 30;

// ─────────────────────────────────────────────────────────────────────────────
// NavyBackground — fond standard épisode (navy + radial + SVGGrain)
// ─────────────────────────────────────────────────────────────────────────────
const NavyBackground: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <>
    <AbsoluteFill
      style={{
        background: NAVY,
        opacity,
      }}
    />
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 25%, #0e2240 0%, #070e1a 65%)",
        opacity,
      }}
    />
    <SVGGrain opacity={0.12} />
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────────────────────
export const Beat1AnomalieV4: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3")}
        startFrom={BEAT.startFrame}
        endAt={AUDIO_END_AT}
      />

      <Series>
        {/* SEQ 1 — Carte Mapbox dark (12s) */}
        <Series.Sequence durationInFrames={SEQ1_DUR} premountFor={fps}>
          <MapSequence />
        </Series.Sequence>

        {/* SEQ 2 — BigStat navy (~6.5s) */}
        <Series.Sequence durationInFrames={SEQ2_DUR} premountFor={fps}>
          <BigStatSequence />
        </Series.Sequence>

        {/* SEQ 3 — Fracture + TypeReveal + Sankey (~24.8s) */}
        <Series.Sequence durationInFrames={SEQ3_DUR} premountFor={fps}>
          <TextFracture contradictionOffset={CONTRADICTION_BEAT - BIGSTAT_REVEAL} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SEQ 1 — MapSequence
// lerpCamera() depuis camera-chapters.ts + pulses SVG offshore + label Sénégal
// ─────────────────────────────────────────────────────────────────────────────
const MapSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("beat1-v4-map"));
  const [sangPos, setSangPos] = useState<{ x: number; y: number } | null>(null);
  const [gtaPos, setGtaPos]   = useState<{ x: number; y: number } | null>(null);
  const [labelPos, setLabelPos] = useState<{ x: number; y: number } | null>(null);

  const cam = lerpCamera(frame, CHAPTERS_BEAT1);

  const mapOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const PULSE_START = 4 * fps;
  const showPulses = frame >= PULSE_START;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: cam.center,
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      // Highlight Sénégal en or sur fond dark
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
        paint: { "fill-color": GOLD, "fill-opacity": 0.35 },
      });
      map.addLayer({
        id: "senegal-border",
        type: "line",
        source: "senegal-src",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "SEN"],
        paint: { "line-color": GOLD, "line-width": 2.5, "line-opacity": 1 },
      });

      continueRender(handle);
    });
  }, [handle]);

  // Mise à jour caméra + positions SVG overlay à chaque frame
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.jumpTo({
      center: cam.center,
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
    });

    const sangPx  = map.project([OFFSHORE_POINTS.sangomar.lng, OFFSHORE_POINTS.sangomar.lat]);
    const gtaPx   = map.project([OFFSHORE_POINTS.gta.lng, OFFSHORE_POINTS.gta.lat]);
    // Label Sénégal — centroïde approximatif Dakar inland
    const labelPx = map.project([-14.5, 14.4]);

    setSangPos({ x: sangPx.x, y: sangPx.y });
    setGtaPos({ x: gtaPx.x, y: gtaPx.y });
    setLabelPos({ x: labelPx.x, y: labelPx.y });
  }, [frame, cam.center, cam.zoom, cam.pitch, cam.bearing]);

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, opacity: mapOpacity }} />

      {showPulses && sangPos && (
        <OffshorePulse
          x={sangPos.x} y={sangPos.y}
          name={OFFSHORE_POINTS.sangomar.label}
          subLabel={OFFSHORE_POINTS.sangomar.subLabel}
          frame={frame} fps={fps} startAt={PULSE_START} delay={0}
        />
      )}
      {showPulses && gtaPos && (
        <OffshorePulse
          x={gtaPos.x} y={gtaPos.y}
          name={OFFSHORE_POINTS.gta.label}
          subLabel={OFFSHORE_POINTS.gta.subLabel}
          frame={frame} fps={fps} startAt={PULSE_START} delay={20}
        />
      )}
      {labelPos && frame >= PULSE_START && (
        <SenegalLabel x={labelPos.x} y={labelPos.y} frame={frame} startAt={PULSE_START} fps={fps} />
      )}

      {/* Baseline journalistique en bas */}
      <Baseline
        country="SÉNÉGAL"
        year="2024"
        source="Source : Woodside Energy"
        fadeInStart={PULSE_START + 10}
        fadeInEnd={PULSE_START + 25}
      />
    </AbsoluteFill>
  );
};

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
      <div style={{
        width: 10, height: 10, borderRadius: "50%",
        backgroundColor: GOLD,
        boxShadow: `0 0 10px ${GOLD}bb`,
      }} />
      <span style={{
        fontFamily: CINZEL,
        fontSize: 22,
        color: IVORY,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 700,
        whiteSpace: "nowrap",
        textShadow: `0 0 12px ${GOLD}66`,
      }}>
        SÉNÉGAL
      </span>
    </div>
  );
};

const OffshorePulse: React.FC<{
  x: number; y: number;
  name: string; subLabel: string;
  frame: number; fps: number; startAt: number; delay: number;
}> = ({ x, y, name, subLabel, frame, fps, startAt, delay }) => {
  const localF = Math.max(0, frame - startAt - delay);
  const entryP = spring({ frame: localF, fps, config: { damping: 80, stiffness: 55 }, durationInFrames: 18 });
  const entryOpacity = interpolate(entryP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const rings = [0, 20, 40];
  const CYCLE = 2 * fps;

  return (
    <div style={{
      position: "absolute", left: x, top: y,
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
    }}>
      <svg style={{ position: "absolute", left: -70, top: -70, overflow: "visible" }} width={140} height={140}>
        <circle cx={70} cy={70} r={6} fill={GOLD} opacity={entryOpacity}
          style={{ filter: `drop-shadow(0 0 6px ${GOLD})` }} />
        {rings.map((ringDelay, i) => {
          const ringF    = Math.max(0, localF - ringDelay) % CYCLE;
          const progress = ringF / CYCLE;
          const r        = interpolate(progress, [0, 1], [6, 55]);
          const ringOpacity = interpolate(progress, [0, 0.25, 1], [0.9, 0.5, 0]) * entryOpacity;
          return (
            <circle key={i} cx={70} cy={70} r={r} fill="none"
              stroke={GOLD} strokeWidth={1.5} opacity={ringOpacity} />
          );
        })}
      </svg>
      <div style={{ position: "absolute", top: 14, left: 12, opacity: entryOpacity }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 18,
          color: IVORY,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: 700,
          textShadow: `0 0 8px ${NAVY}cc`,
          whiteSpace: "nowrap",
          display: "block",
        }}>
          {name}
        </span>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13,
          color: "#8aaacc",
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
          display: "block",
          marginTop: 3,
        }}>
          {subLabel}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SEQ 2 — BigStatSequence (fond navy + grain)
// Spring rebond + D3 curveBasis + GoldLine + CountUp + Badge (shared components)
// ─────────────────────────────────────────────────────────────────────────────
const BigStatSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emergenceP = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 100 },
  });
  const translateY     = interpolate(emergenceP, [0, 1], [320, 0]);
  const contentOpacity = interpolate(emergenceP, [0, 0.2, 1], [0, 1, 1], { extrapolateRight: "clamp" });

  const bgOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <NavyBackground opacity={bgOpacity} />
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
        gap: 0,
      }}>
        {/* Badge rouge */}
        <Badge label="PÉTROLE OFFSHORE" appearFrame={8} bgColor={BADGE_RED} borderColor={BADGE_RED_B} />

        {/* Ligne dorée */}
        <div style={{ marginTop: 20 }}>
          <GoldLine startFrame={8} durationFrames={18} />
        </div>

        {/* CountUp $0 → $8,000,000 */}
        <CountUp
          target={8000000}
          startFrame={22}
          endFrame={52}
          prefix="$"
          fontSize={128}
        />

        {/* Sous-unité */}
        <div style={{
          marginTop: 10,
          opacity: interpolate(frame, [30, 42], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}>
          <span style={{
            color: "#6a8aaa",
            fontSize: 28,
            letterSpacing: "0.22em",
            fontFamily: "sans-serif",
            textTransform: "uppercase",
          }}>
            PAR JOUR
          </span>
        </div>
      </div>

      {/* Baseline */}
      <Baseline
        country="SÉNÉGAL"
        year="2024"
        source="Source : Woodside Energy"
        fadeInStart={55}
        fadeInEnd={70}
      />
    </AbsoluteFill>
  );
};

// D3 curveBasis — ondes dorées en fond
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
// BigStat stable → guillotine → TypeReveal → badge "L'ÉTAT N'EST PAS CERTAIN"
// ─────────────────────────────────────────────────────────────────────────────
interface TextFractureProps {
  contradictionOffset: number;
}

const TextFracture: React.FC<TextFractureProps> = ({ contradictionOffset }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const FRACTURE_START   = contradictionOffset; // 316f
  const TYPEWRITER_START = FRACTURE_START + 60;

  const showBigStat  = frame < FRACTURE_START + 90;
  const showTyping   = frame >= TYPEWRITER_START;

  const bigStatOpacity = interpolate(
    frame, [FRACTURE_START + 60, FRACTURE_START + 90], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      <NavyBackground />
      <D3WaveBackground frame={frame + SEQ1_DUR + SEQ2_DUR} opacity={showBigStat ? bigStatOpacity * 0.6 : 0} />

      {showBigStat && (
        <div style={{ position: "absolute", inset: 0, opacity: bigStatOpacity }}>
          <BigStatStatic />
        </div>
      )}

      {frame >= FRACTURE_START && frame < FRACTURE_START + 90 && (
        <GuillofinePieces frame={frame} fps={fps} fractureStart={FRACTURE_START} />
      )}

      {frame >= FRACTURE_START && frame < FRACTURE_START + 45 && (
        <FractureLine frame={frame} fractureStart={FRACTURE_START} />
      )}

      {showTyping && (
        <Phase5Layer frame={frame} fps={fps} startFrame={TYPEWRITER_START} />
      )}
    </AbsoluteFill>
  );
};

const BigStatStatic: React.FC = () => (
  <div style={{
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
  }}>
    <div style={{
      fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
      fontSize: 230, lineHeight: 0.85,
      color: IVORY, textAlign: "center",
      letterSpacing: "-0.01em",
    }}>
      8 000 000 $
    </div>
    <div style={{
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 74, color: GOLD,
      textAlign: "center", letterSpacing: "0.12em",
      marginTop: 10,
    }}>
      / JOUR
    </div>
  </div>
);

const GuillofinePieces: React.FC<{ frame: number; fps: number; fractureStart: number }> = ({
  frame, fps, fractureStart,
}) => {
  const localF = Math.max(0, frame - fractureStart);
  const cutP   = spring({ frame: localF, fps, config: { damping: 14, stiffness: 110 }, durationInFrames: 35 });

  const rightY       = interpolate(cutP, [0, 1], [0, 380]);
  const rightRotate  = interpolate(cutP, [0, 1], [0, 6]);
  const rightOpacity = interpolate(cutP, [0, 0.35, 1], [1, 0.65, 0]);

  const shakeMag = interpolate(cutP, [0, 0.15, 0.4, 1], [0, 6, 2, 0]);
  const shakeX   = shakeMag * Math.sin(localF * 1.8);

  const sharedText: React.CSSProperties = {
    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
    fontSize: 230, lineHeight: 0.85,
    color: IVORY, textAlign: "center",
    letterSpacing: "-0.01em", whiteSpace: "nowrap",
  };
  const sharedUnit: React.CSSProperties = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 74, color: GOLD,
    textAlign: "center", letterSpacing: "0.12em", marginTop: 10,
  };
  const sharedWrap: React.CSSProperties = {
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    pointerEvents: "none",
  };

  const LEFT_CLIP  = "polygon(0% 0%, 54% 0%, 46% 100%, 0% 100%)";
  const RIGHT_CLIP = "polygon(54% 0%, 100% 0%, 100% 100%, 46% 100%)";

  return (
    <>
      <div style={{ ...sharedWrap, clipPath: LEFT_CLIP, transform: `translateX(${shakeX}px)` }}>
        <div style={sharedText}>8 000 000 $</div>
        <div style={sharedUnit}>/ JOUR</div>
      </div>
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

const FractureLine: React.FC<{ frame: number; fractureStart: number }> = ({ frame, fractureStart }) => {
  const localF    = frame - fractureStart;
  const progress  = interpolate(localF, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineOpacity = interpolate(localF, [0, 5, 35, 45], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <line
        x1={0} y1={1080 * 0.43}
        x2={1920 * progress} y2={1080 * 0.57}
        stroke={GOLD} strokeWidth={2.5}
        opacity={lineOpacity} strokeLinecap="round"
      />
    </svg>
  );
};

// Phase 5 — TypeReveal + badge "L'ÉTAT N'EST PAS CERTAIN" + Sankey
const Phase5Layer: React.FC<{ frame: number; fps: number; startFrame: number }> = ({
  frame, fps, startFrame,
}) => {
  const localF = Math.max(0, frame - startFrame);

  const overlayOpacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Badge "L'ÉTAT N'EST PAS CERTAIN" apparaît à contradictionBeat dans le référentiel SEQ3
  // contradictionBeat = 871, BIGSTAT_REVEAL = 555, TYPEWRITER_START = FRACTURE_START+60
  // Dans le ref local SEQ3 : FRACTURE_START=316, TYPEWRITER_START=376
  // badge apparaît 60f après TYPEWRITER_START
  const BADGE_AMBER_FRAME = 60;
  const showAmberBadge = localF >= BADGE_AMBER_FRAME;

  const SANKEY_START = 200;
  const sankeyOpacity = interpolate(localF, [SANKEY_START, SANKEY_START + 25], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: `rgba(7,14,26,${overlayOpacity * 0.90})`,
        backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 46%, rgba(14,34,64,${overlayOpacity * 0.85}) 0%, rgba(7,14,26,${overlayOpacity * 0.95}) 70%)`,
      }} />

      <TypewriterReveal frame={frame} fps={fps} startFrame={startFrame} overlayOpacity={overlayOpacity} />

      {showAmberBadge && (
        <div style={{
          position: "absolute",
          top: "68%",
          left: "50%",
          transform: "translateX(-50%)",
        }}>
          <Badge
            label="L'ÉTAT N'EST PAS CERTAIN DU MONTANT EXACT"
            appearFrame={startFrame + BADGE_AMBER_FRAME}
            bgColor={BADGE_AMB}
            borderColor={BADGE_AMB_B}
            fontSize={20}
          />
        </div>
      )}

      {localF >= SANKEY_START && (
        <SankeyBlocs fps={fps} localF={localF} opacity={sankeyOpacity} />
      )}
    </AbsoluteFill>
  );
};

// TypeReveal — typewriter lettre par lettre
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
  const localF     = Math.max(0, frame - startFrame);
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

  const kwStartAbs = startFrame + beforeLen * FRAMES_PER_CHAR;
  const kwP = spring({
    frame: Math.max(0, frame - kwStartAbs),
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const kwScale = interpolate(kwP, [0, 1], [0.35, 1], { extrapolateRight: "clamp" });

  const doneFr = startFrame + (beforeLen + kwLen + T_AFTER.length) * FRAMES_PER_CHAR + 15;
  const subtitleOpacity = interpolate(frame, [doneFr, doneFr + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{
      position: "absolute",
      top: "50%", left: 0, right: 0,
      transform: "translateY(-60%)",
      display: "flex",
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "center",
      flexWrap: "wrap",
      paddingLeft: 56, paddingRight: 56,
      opacity: overlayOpacity,
    }}>
      {visibleBefore.length > 0 && (
        <span style={{ fontSize: 72, fontFamily: CINZEL, color: IVORY, lineHeight: 1.2 }}>
          {visibleBefore}
        </span>
      )}
      {visibleKeyword.length > 0 && (
        <span style={{
          fontSize: 195, fontFamily: CINZEL, fontWeight: 900,
          color: GOLD,
          lineHeight: 1,
          transform: `scale(${kwScale})`,
          display: "inline-block",
          transformOrigin: "center bottom",
          textShadow: `0 0 60px ${GOLD}bb, 0 0 20px ${GOLD}88`,
          marginLeft: 12, marginRight: 12,
        }}>
          {visibleKeyword}
        </span>
      )}
      {visibleAfter.length > 0 && (
        <span style={{ fontSize: 72, fontFamily: CINZEL, color: IVORY, lineHeight: 1.2 }}>
          {visibleAfter}
        </span>
      )}
      {!allDone && (
        <span style={{
          display: "inline-block",
          backgroundColor: GOLD,
          width: 4, height: 72,
          marginLeft: 5,
          verticalAlign: "middle",
          opacity: cursorBlink,
          flexShrink: 0,
        }} />
      )}

      <div style={{
        position: "absolute",
        bottom: "-20%", left: 0, right: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 14,
        opacity: subtitleOpacity,
      }}>
        <div style={{ width: 260, height: 1, backgroundColor: GOLD, opacity: 0.4 }} />
        <span style={{
          color: "#8aaa9a",
          fontSize: 24, fontFamily: CINZEL,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}>
          SÉNÉGAL · PÉTROLE & GAZ · 2024
        </span>
      </div>
    </div>
  );
};

// Sankey 3 blocs — flux financiers
const SANKEY_BLOCS = [
  { label: "COMPAGNIES",  pct: "~40%", color: "#7a5040" },
  { label: "FONSIS",      pct: "~12%", color: GOLD       },
  { label: "BUDGET ÉTAT", pct: "~48%", color: "#3a6a4a"  },
];

const SankeyBlocs: React.FC<{ fps: number; localF: number; opacity: number }> = ({ fps, localF, opacity }) => {
  const SANKEY_START = 200;
  const srcLocalF = Math.max(0, localF - SANKEY_START);

  const srcP = spring({ frame: srcLocalF, fps, config: { damping: 80, stiffness: 55 }, durationInFrames: 22 });
  const srcOpacity = interpolate(srcP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const srcY       = interpolate(srcP, [0, 1], [18, 0],  { extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute",
      bottom: 72, left: 0, right: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 10,
      opacity, pointerEvents: "none",
    }}>
      <div style={{
        opacity: srcOpacity,
        transform: `translateY(${srcY}px)`,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderTop: `2px solid ${GOLD}`,
        paddingTop: 9, paddingBottom: 9,
        paddingLeft: 28, paddingRight: 28,
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 18, color: "rgba(245,240,232,0.65)",
          letterSpacing: "0.13em", textTransform: "uppercase",
        }}>
          REVENU BRUT · 8 000 000 $ / JOUR
        </span>
      </div>

      <svg width={20} height={20} style={{ opacity: srcOpacity }}>
        <polyline points="10,0 10,15 5,10 10,15 15,10" fill="none" stroke={GOLD} strokeWidth={1.5} />
      </svg>

      <div style={{ display: "flex", flexDirection: "row", gap: 14 }}>
        {SANKEY_BLOCS.map((bloc, i) => {
          const bDelay  = i * 18;
          const bLocalF = Math.max(0, srcLocalF - bDelay);
          const bP      = spring({ frame: bLocalF, fps, config: { damping: 80, stiffness: 65 }, durationInFrames: 18 });
          const bOpacity = interpolate(bP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const bY       = interpolate(bP, [0, 1], [14, 0],  { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              opacity: bOpacity,
              transform: `translateY(${bY}px)`,
              borderLeft: `3px solid ${bloc.color}`,
              backgroundColor: "rgba(11,31,53,0.80)",
              paddingTop: 9, paddingBottom: 9,
              paddingLeft: 16, paddingRight: 16,
              display: "flex", flexDirection: "column",
              alignItems: "flex-start", gap: 3,
              minWidth: 188,
            }}>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 30,
                color: bloc.color === GOLD ? GOLD : "rgba(245,240,232,0.88)",
                letterSpacing: "0.06em",
              }}>
                {bloc.pct}
              </span>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 14,
                color: "rgba(245,240,232,0.45)",
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

export default Beat1AnomalieV4;
