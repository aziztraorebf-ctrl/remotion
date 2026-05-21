/**
 * Beat 1 V5 — L'Anomalie — Style Storyboard Kraft
 *
 * Fidèle au storyboard 9 panels généré GPT Image 2.0 (catbox/fal v3 Kraft).
 * Style : fond ivory #f5f0e8 (papier), texte navy, accents or, SVGGrain léger.
 *
 * Architecture — 6 séquences audio-ancrées (Gemini breakdown) :
 *   SEQ1  f0→f180    (6s)    Panel 1 — Carte large Atlantique + label Sénégal
 *   SEQ2  f180→f360  (6s)    Panel 2 — Zoom côte + marqueur GTA
 *   SEQ3  f360→f555  (6.5s)  Panel 3 — $8M reveal ivory/or
 *   SEQ4  f555→f871  (10.5s) Panel 4 — $8M fracturé + AnimatedCrack
 *   SEQ5  f871→f1119 (8.3s)  Panel 5 — Question "OÙ PASSE L'ARGENT ?" + warning
 *   SEQ6  f1119→f1299 (6s)   Panel 6 — FlowDiagram "Du puits au trésor public"
 *
 * Anchors audio-derived (timing.ts) :
 *   bigstatReveal     = f555  (18.5s) — "Huit millions de dollars par jour"
 *   contradictionBeat = f871  (29.0s) — "l'État n'est pas certain"
 *   thesisIntro       = f1119 (37.3s) — "mécanique plus complexe"
 *   acte1LastWord     = f1260 (42.0s) — "tester en direct"
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
  interpolate,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";
import { AUDIO_SEGMENTS } from "./timing";

const { fontFamily: BEBAS } = loadBebas();
import { CHAPTERS_BEAT1, lerpCamera, OFFSHORE_POINTS } from "./camera-chapters";
import { GoldLine } from "../../_shared/components/ui/GoldLine";
import { SVGGrain } from "../../_shared/components/ui/SVGGrain";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const BEAT = AUDIO_SEGMENTS.acte1_anomalie;
const BEAT_DUR = BEAT.endFrame - BEAT.startFrame; // 1299

// Anchors audio-derived
const BIGSTAT_REVEAL      = 555;
const CONTRADICTION_BEAT  = 871;
const THESIS_INTRO        = 1119;
const ACTE1_LAST_WORD     = 1260;

// Durées séquences
const SEQ1_DUR = 180;
const SEQ2_DUR = 180;
const SEQ3_DUR = BIGSTAT_REVEAL - SEQ1_DUR - SEQ2_DUR;       // 195f
const SEQ4_DUR = CONTRADICTION_BEAT - BIGSTAT_REVEAL;         // 316f
const SEQ5_DUR = THESIS_INTRO - CONTRADICTION_BEAT;           // 248f
const SEQ6_DUR = BEAT_DUR - THESIS_INTRO;                     // 180f

// Palette Kraft documentaire
const IVORY   = "#f5f0e8";
const NAVY    = "#0b1f35";
const GOLD    = "#d4a93c";
const AMBER_B = "#c47a20";
const KRAFT   = "#e8dcc8";

// ─────────────────────────────────────────────────────────────────────────────
// KraftBackground — fond papier ivoire + grain SVG léger
// ─────────────────────────────────────────────────────────────────────────────
const KraftBackground: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <>
    <AbsoluteFill style={{ backgroundColor: IVORY, opacity }} />
    <SVGGrain opacity={0.06} />
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────────────────────
export const Beat1AnomalieV5: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: IVORY }}>
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3")}
        startFrom={BEAT.startFrame}
        endAt={ACTE1_LAST_WORD + 30}
      />

      <Series>
        {/* SEQ 1 — Carte large Atlantique, Sénégal gold, label (6s) */}
        <Series.Sequence durationInFrames={SEQ1_DUR} premountFor={fps}>
          <MapSeq1 />
        </Series.Sequence>

        {/* SEQ 2 — Zoom côte Sénégal + marqueur GTA (6s) */}
        <Series.Sequence durationInFrames={SEQ2_DUR} premountFor={fps}>
          <MapSeq2 />
        </Series.Sequence>

        {/* SEQ 3 — $8M reveal fond ivory (6.5s) */}
        <Series.Sequence durationInFrames={SEQ3_DUR} premountFor={fps}>
          <BigStatReveal />
        </Series.Sequence>

        {/* SEQ 4 — $8M stable puis AnimatedCrack (10.5s) */}
        <Series.Sequence durationInFrames={SEQ4_DUR} premountFor={fps}>
          <BigStatWithCrack />
        </Series.Sequence>

        {/* SEQ 5 — Question "OÙ PASSE L'ARGENT ?" (8.3s) */}
        <Series.Sequence durationInFrames={SEQ5_DUR} premountFor={fps}>
          <QuestionPanel />
        </Series.Sequence>

        {/* SEQ 6 — FlowDiagram "Du puits au trésor public" (6s) */}
        <Series.Sequence durationInFrames={SEQ6_DUR} premountFor={fps}>
          <FlowDiagramPanel />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MapSeq1 — Vue Atlantique large, Sénégal gold, label "SÉNÉGAL" (f0→f180)
// ─────────────────────────────────────────────────────────────────────────────
const MapSeq1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("beat1-v5-map1"));
  const [sangPos, setSangPos] = useState<{ x: number; y: number } | null>(null);

  const cam = lerpCamera(frame, CHAPTERS_BEAT1);

  const mapOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
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
        paint: { "fill-color": GOLD, "fill-opacity": 0.55 },
      });
      map.addLayer({
        id: "senegal-border",
        type: "line",
        source: "senegal-src",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "SEN"],
        paint: { "line-color": NAVY, "line-width": 2, "line-opacity": 0.8 },
      });
      continueRender(handle);
    });
  }, [handle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.jumpTo({ center: cam.center, zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing });
    const sangPx = map.project([OFFSHORE_POINTS.sangomar.lng, OFFSHORE_POINTS.sangomar.lat]);
    setSangPos({ x: sangPx.x, y: sangPx.y });
  }, [frame, cam.center, cam.zoom, cam.pitch, cam.bearing]);

  const MARKER_START = 2 * fps;
  const showMarker = frame >= MARKER_START;

  return (
    <AbsoluteFill style={{ backgroundColor: IVORY }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, opacity: mapOpacity }} />
      {showMarker && sangPos && (
        <MapMarker
          x={sangPos.x}
          y={sangPos.y}
          label="SANGOMAR"
          frame={frame}
          startAt={MARKER_START}
          fps={fps}
        />
      )}
      <KraftTopBar label="SÉNÉGAL · PÉTROLE & GAZ" />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MapSeq2 — Zoom côte Sénégal + GTA marker (f180→f360, local f0→f180)
// ─────────────────────────────────────────────────────────────────────────────
const MapSeq2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("beat1-v5-map2"));
  const [sangPos, setSangPos] = useState<{ x: number; y: number } | null>(null);
  const [gtaPos, setGtaPos] = useState<{ x: number; y: number } | null>(null);

  // Dans SEQ2 frame commence à 0, mais on veut les chapters pour f180→f360
  const globalFrame = frame + SEQ1_DUR;
  const cam = lerpCamera(globalFrame, CHAPTERS_BEAT1);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
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
        paint: { "fill-color": GOLD, "fill-opacity": 0.45 },
      });
      map.addLayer({
        id: "senegal-border",
        type: "line",
        source: "senegal-src",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "SEN"],
        paint: { "line-color": NAVY, "line-width": 2, "line-opacity": 0.8 },
      });
      continueRender(handle);
    });
  }, [handle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.jumpTo({ center: cam.center, zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing });
    const sangPx = map.project([OFFSHORE_POINTS.sangomar.lng, OFFSHORE_POINTS.sangomar.lat]);
    const gtaPx  = map.project([OFFSHORE_POINTS.gta.lng, OFFSHORE_POINTS.gta.lat]);
    setSangPos({ x: sangPx.x, y: sangPx.y });
    setGtaPos({ x: gtaPx.x, y: gtaPx.y });
  }, [frame, cam.center, cam.zoom, cam.pitch, cam.bearing]);

  const GTA_START = fps; // GTA apparaît à 1s dans SEQ2

  return (
    <AbsoluteFill style={{ backgroundColor: IVORY }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
      {sangPos && (
        <MapMarker x={sangPos.x} y={sangPos.y} label="SANGOMAR" frame={frame} startAt={0} fps={fps} />
      )}
      {gtaPos && frame >= GTA_START && (
        <MapMarker x={gtaPos.x} y={gtaPos.y} label="GTA" frame={frame} startAt={GTA_START} fps={fps} color="#88aacc" />
      )}
      <KraftTopBar label="SÉNÉGAL · PÉTROLE & GAZ" />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MapMarker — pin doré animé spring, label en Bebas Neue
// ─────────────────────────────────────────────────────────────────────────────
const MapMarker: React.FC<{
  x: number; y: number; label: string;
  frame: number; startAt: number; fps: number; color?: string;
}> = ({ x, y, label, frame, startAt, fps, color = GOLD }) => {
  const localF = Math.max(0, frame - startAt);
  const p = spring({ frame: localF, fps, config: { damping: 18, stiffness: 180 }, durationInFrames: 20 });
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale   = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Pulse rings
  const CYCLE = 2 * fps;
  const ringF  = localF % CYCLE;
  const ringR  = interpolate(ringF, [0, CYCLE], [6, 36]);
  const ringOp = interpolate(ringF, [0, CYCLE * 0.3, CYCLE], [0.8, 0.3, 0]);

  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
      pointerEvents: "none",
    }}>
      <svg style={{ position: "absolute", left: -50, top: -50, overflow: "visible" }} width={100} height={100}>
        <circle cx={50} cy={50} r={ringR} fill="none" stroke={color} strokeWidth={1.5} opacity={ringOp} />
        <circle cx={50} cy={50} r={7} fill={color} style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
      </svg>
      <div style={{
        position: "absolute",
        top: 14,
        left: 12,
        fontFamily: BEBAS,
        fontSize: 18,
        color: NAVY,
        letterSpacing: "0.14em",
        whiteSpace: "nowrap",
        background: `${IVORY}cc`,
        padding: "2px 6px",
        borderLeft: `2px solid ${color}`,
      }}>
        {label}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// KraftTopBar — barre titre en haut, style "journal documentaire"
// ─────────────────────────────────────────────────────────────────────────────
const KraftTopBar: React.FC<{ label: string }> = ({ label }) => (
  <div style={{
    position: "absolute",
    top: 36,
    left: 60,
    display: "flex",
    alignItems: "center",
    gap: 12,
  }}>
    <div style={{ width: 4, height: 28, backgroundColor: GOLD }} />
    <span style={{
      fontFamily: BEBAS,
      fontSize: 22,
      color: NAVY,
      letterSpacing: "0.22em",
      opacity: 0.75,
    }}>
      {label}
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BigStatReveal — Panel 3 — "$8M" sur fond ivory, reveal spring (f360→f555)
// ─────────────────────────────────────────────────────────────────────────────
const BigStatReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({ frame, fps, config: { damping: 12, mass: 0.7, stiffness: 120 }, durationInFrames: 30 });
  const translateY     = interpolate(p, [0, 1], [80, 0]);
  const contentOpacity = interpolate(p, [0, 0.15, 1], [0, 1, 1], { extrapolateRight: "clamp" });

  const subOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <KraftBackground />
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transform: `translateY(${translateY}px)`,
        opacity: contentOpacity,
      }}>
        <div style={{
          fontFamily: BEBAS,
          fontSize: 260,
          color: NAVY,
          lineHeight: 0.82,
          letterSpacing: "-0.01em",
          textAlign: "center",
        }}>
          $8M
        </div>

        <div style={{ marginTop: 12 }}>
          <GoldLine widthRatio={0.3} startFrame={20} durationFrames={18} />
        </div>

        <div style={{ opacity: subOpacity, marginTop: 4 }}>
          <span style={{
            fontFamily: BEBAS,
            fontSize: 42,
            color: GOLD,
            letterSpacing: "0.16em",
          }}>
            PÉTROLE SÉNÉGALAIS 2024
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BigStatWithCrack — Panel 4 — $8M stable puis image fissure kraft (f555→f871)
// Durée locale : 316f. Crack image démarre à f240 (8s avant fin)
// ─────────────────────────────────────────────────────────────────────────────
const BigStatWithCrack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CRACK_START = 240;
  const showCrack = frame >= CRACK_START;

  // Shake à l'impact
  const shakeF  = Math.max(0, frame - CRACK_START);
  const shakeMag = interpolate(shakeF, [0, 6, 20], [0, 10, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const shakeX = shakeMag * Math.sin(shakeF * 2.4);
  const shakeY = shakeMag * 0.4 * Math.cos(shakeF * 1.8);

  // Crack image — spring apparition
  const crackP = spring({ frame: Math.max(0, frame - CRACK_START), fps, config: { damping: 10, stiffness: 200 }, durationInFrames: 20 });
  const crackOpacity = interpolate(crackP, [0, 1], [0, 0.88], { extrapolateRight: "clamp" });
  const crackScale   = interpolate(crackP, [0, 1], [1.08, 1.0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <KraftBackground />
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}>
        <div style={{
          fontFamily: BEBAS,
          fontSize: 260,
          color: NAVY,
          lineHeight: 0.82,
          letterSpacing: "-0.01em",
          textAlign: "center",
        }}>
          $8M
        </div>
        <div style={{ marginTop: 12 }}>
          <GoldLine widthRatio={0.3} startFrame={0} durationFrames={1} />
        </div>
        <div style={{ marginTop: 4 }}>
          <span style={{
            fontFamily: BEBAS,
            fontSize: 42,
            color: GOLD,
            letterSpacing: "0.16em",
          }}>
            PÉTROLE SÉNÉGALAIS 2024
          </span>
        </div>
      </div>

      {showCrack && (
        <img
          src={staticFile("souverain/senegal-petrole-gaz/crack_kraft.png")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "multiply",
            opacity: crackOpacity,
            transform: `scale(${crackScale})`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// QuestionPanel — Panel 5 — "OÙ PASSE L'ARGENT DU PÉTROLE ?" (f871→f1119)
// ─────────────────────────────────────────────────────────────────────────────
const QuestionPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleP = spring({ frame, fps, config: { damping: 22, stiffness: 100 }, durationInFrames: 28 });
  const titleOpacity   = interpolate(titleP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const titleTranslateY = interpolate(titleP, [0, 1], [40, 0], { extrapolateRight: "clamp" });

  const WARNING_START = 45;
  const warningP = spring({ frame: Math.max(0, frame - WARNING_START), fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 16 });
  const warningScale   = interpolate(warningP, [0, 1], [0.3, 1], { extrapolateRight: "clamp" });
  const warningOpacity = interpolate(warningP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <KraftBackground />
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 120px",
      }}>
        <div style={{
          opacity: titleOpacity,
          transform: `translateY(${titleTranslateY}px)`,
          position: "relative",
        }}>
          <div style={{
            fontFamily: BEBAS,
            fontSize: 152,
            color: NAVY,
            lineHeight: 0.88,
            textAlign: "center",
            letterSpacing: "0.01em",
          }}>
            OÙ PASSE<br />
            L'ARGENT<br />
            DU PÉTROLE ?
          </div>

          {frame >= WARNING_START && (
            <div style={{
              position: "absolute",
              top: -30,
              right: -80,
              opacity: warningOpacity,
              transform: `scale(${warningScale})`,
              transformOrigin: "center center",
            }}>
              <WarningIcon />
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const WarningIcon: React.FC = () => (
  <svg width={72} height={72} viewBox="0 0 72 72">
    <polygon
      points="36,6 66,62 6,62"
      fill={GOLD}
      stroke={NAVY}
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <text
      x="36"
      y="52"
      textAnchor="middle"
      fontSize={32}
      fontWeight="900"
      fontFamily="Arial Black, sans-serif"
      fill={NAVY}
    >
      !
    </text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// FlowDiagramPanel — Panel 6 — "Du puits au trésor public" Sankey D3 (f1119→f1299)
// ─────────────────────────────────────────────────────────────────────────────
const FLOW_NODES = [
  { id: "source", label: "RECETTES\nPÉTROLIÈRES", sub: "$8M", color: NAVY, icon: "oil" },
  { id: "tresor", label: "COMPTE\nCONSOLIDÉ\nDU TRÉSOR", sub: "", color: GOLD, icon: "bank" },
  { id: "depenses", label: "DÉPENSES\nPUBLIQUES", sub: "Investissements\nServices sociaux\nInfrastructures", color: NAVY, icon: "people" },
];

const FlowDiagramPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Titre apparaît en premier
  const titleP = spring({ frame, fps, config: { damping: 26, stiffness: 90 }, durationInFrames: 20 });
  const titleOpacity = interpolate(titleP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Nœuds apparaissent en cascade
  const nodeDelays = [20, 30, 40];

  // Flèches D3 Sankey apparaissent après les nœuds
  const ARROW_START = 60;
  const arrowProgress = interpolate(frame, [ARROW_START, ARROW_START + 40], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const W = 1920;
  const NODE_W = 260;
  const NODE_H = 200;
  const NODE_Y = 420;
  const positions = [300, W / 2 - NODE_W / 2, W - 300 - NODE_W];

  // Courbes Bezier D3 pour les flux
  const curves = positions.slice(0, -1).map((x, i) => {
    const x1 = x + NODE_W;
    const x2 = positions[i + 1];
    const yMid = NODE_Y + NODE_H / 2;
    const cxMid = (x1 + x2) / 2;
    const totalLen = x2 - x1;
    const animLen = totalLen * arrowProgress;

    const lineGen = d3.line<[number, number]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(d3.curveBasis);

    const pts: [number, number][] = Array.from({ length: 20 }, (_, k) => {
      const t = k / 19;
      const px = x1 + (x2 - x1) * t * arrowProgress;
      const py = yMid + Math.sin(t * Math.PI) * -20;
      return [px, py];
    });

    return { d: lineGen(pts) ?? "", x1, x2, yMid, cxMid, animLen };
  });

  return (
    <AbsoluteFill>
      <KraftBackground />

      {/* Titre */}
      <div style={{
        position: "absolute",
        top: 120,
        left: 0, right: 0,
        textAlign: "center",
        opacity: titleOpacity,
      }}>
        <div style={{
          fontFamily: BEBAS,
          fontSize: 52,
          color: NAVY,
          letterSpacing: "0.14em",
        }}>
          DU PUITS AU TRÉSOR PUBLIC
        </div>
        <div style={{
          width: 180,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          margin: "10px auto 0",
        }} />
      </div>

      {/* SVG flux Bezier D3 */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1920 1080">
        {curves.map((c, i) => (
          <path
            key={i}
            d={c.d}
            fill="none"
            stroke={GOLD}
            strokeWidth={arrowProgress > 0.1 ? 18 : 0}
            opacity={0.35 * arrowProgress}
            strokeLinecap="round"
          />
        ))}
        {curves.map((c, i) => (
          <path
            key={`line-${i}`}
            d={c.d}
            fill="none"
            stroke={NAVY}
            strokeWidth={1.5}
            opacity={0.4 * arrowProgress}
            strokeLinecap="round"
            strokeDasharray="6 4"
          />
        ))}
      </svg>

      {/* Nœuds */}
      {FLOW_NODES.map((node, i) => {
        const delay = nodeDelays[i];
        const nodeP = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 22, stiffness: 90 }, durationInFrames: 20 });
        const nodeOpacity    = interpolate(nodeP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
        const nodeTranslateY = interpolate(nodeP, [0, 1], [20, 0], { extrapolateRight: "clamp" });
        const isCenter = i === 1;

        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: positions[i],
              top: NODE_Y,
              width: NODE_W,
              height: NODE_H,
              opacity: nodeOpacity,
              transform: `translateY(${nodeTranslateY}px)`,
              backgroundColor: isCenter ? GOLD : NAVY,
              border: isCenter ? `3px solid ${NAVY}` : `3px solid ${GOLD}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 18,
              gap: 8,
            }}
          >
            <FlowNodeIcon type={node.icon} color={isCenter ? NAVY : GOLD} />
            <div style={{
              fontFamily: BEBAS,
              fontSize: 22,
              color: isCenter ? NAVY : IVORY,
              letterSpacing: "0.12em",
              textAlign: "center",
              lineHeight: 1.15,
              whiteSpace: "pre-line",
            }}>
              {node.label}
            </div>
            {node.sub && (
              <div style={{
                fontFamily: "sans-serif",
                fontSize: 13,
                color: isCenter ? `${NAVY}bb` : `${IVORY}88`,
                textAlign: "center",
                lineHeight: 1.3,
                whiteSpace: "pre-line",
              }}>
                {node.sub}
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const FlowNodeIcon: React.FC<{ type: string; color: string }> = ({ type }) => {
  if (type === "oil") {
    return (
      <img
        src={staticFile("souverain/senegal-petrole-gaz/icon_oil_derrick.png")}
        style={{ width: 72, height: 72, objectFit: "contain" }}
      />
    );
  }
  if (type === "bank") {
    return (
      <img
        src={staticFile("souverain/senegal-petrole-gaz/icon_treasury.png")}
        style={{ width: 72, height: 72, objectFit: "contain" }}
      />
    );
  }
  // people — image générée ou fallback SVG
  if (type === "people") {
    return (
      <img
        src={staticFile("souverain/senegal-petrole-gaz/icon_people.png")}
        style={{ width: 72, height: 72, objectFit: "contain" }}
      />
    );
  }
  return null;
};

export default Beat1AnomalieV5;
