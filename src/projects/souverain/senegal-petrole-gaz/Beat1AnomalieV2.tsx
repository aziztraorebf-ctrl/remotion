/**
 * Beat 1 V2 — L'Anomalie (plan Gemini 3.5)
 *
 * 0:00→0:08  Phase 1 : Zoom ease-in cubique espace→côtes Sénégal
 * 0:08→0:15  Phase 2 : Pulses concentriques or sur Sangomar + GTA offshore
 * 0:15→0:24  Phase 3 : BigStat "8M$" émerge du bas + vagues SVG fond
 * 0:24→0:35  Phase 4 : Guillotine clipPath — moitié droite glisse hors écran
 * 0:35→0:49  Phase 5 : Carte Mapbox floutée en fond + TypeReveal typewriter + Sankey 3 blocs
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";
import {
  applyCartoCaspian,
  CartoCaspianOverlay,
  CASPIAN_SEPIA,
} from "../../_shared/mapbox/templates/CartoCaspian";
import { AUDIO_SEGMENTS } from "./timing";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const BEAT = AUDIO_SEGMENTS.acte1_anomalie;
const BEAT_DUR = BEAT.endFrame - BEAT.startFrame; // 1496

// Frames (audio-derived depuis timing.ts)
// Phase 1 : 0→240 (8s zoom)
// Phase 2 : 240→450 (7s pulses offshore)
// Phase 3 : 450→720 (9s BigStat émerge)
// Phase 4 : 720→1050 (11s guillotine — anchor: contradictionBeat=1064, on commence un peu avant)
// Phase 5 : 1050→1496 (14.5s fond flouté + typewriter + Sankey)
const P1_END = 240;
const P2_END = 450;
const P3_END = 720;
const P4_END = 1064; // contradictionBeat exact
const P5_END = BEAT_DUR;

// Coordonnées offshore confirmées
const SANGOMAR = { lat: 13.82, lon: -17.50 }; // ~100km au large de Dakar
const GTA      = { lat: 16.55, lon: -16.45 }; // frontière Sénégal/Mauritanie

// Caméra
const CAM_START = { lat: 5.0,  lon: -10.0, zoom: 2.2 };
const CAM_ZOOM  = { lat: 14.5, lon: -17.0, zoom: 5.8 };  // côtes Sénégal offshore
const CAM_BLUR  = { lat: 14.5, lon: -17.0, zoom: 5.2 };  // phase 5 légèrement dezoomée

const HIGHLIGHT_COLOR = CASPIAN_SEPIA.highlightOr; // "#c08820"
const GOLD = "#d4a93c";
const AUDIO_END_AT = 1457 + 30; // acte1LastWord + 1s

// ──────────────────────────────────────────────────────────
// Composant principal
// ──────────────────────────────────────────────────────────
export const Beat1AnomalieV2: React.FC = () => {
  const frame = useCurrentFrame();

  // La carte reste montée tout le beat (fond permanent)
  const showMapFront   = frame < P3_END;
  const showMapBack    = frame >= P4_END; // carte floue en fond phase 5
  const mapBlur        = frame >= P4_END ? 8 : 0;
  const mapDimOpacity  = frame >= P4_END
    ? interpolate(frame, [P4_END, P4_END + 30], [0, 0.35], { extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: CASPIAN_SEPIA.water }}>
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3")}
        startFrom={BEAT.startFrame}
        endAt={AUDIO_END_AT}
      />

      {/* ── Carte Mapbox (fond permanent) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: mapDimOpacity,
          filter: mapBlur > 0 ? `blur(${mapBlur}px)` : undefined,
          transition: "none",
        }}
      >
        <MapScene frame={frame} />
      </div>

      {/* ── Phase 2 : Pulses offshore ── */}
      {frame >= P1_END && frame < P3_END && (
        <OffshorePulses frame={frame} />
      )}

      {/* ── Phase 3 : BigStat émerge + vagues ── */}
      {frame >= P2_END && frame < P4_END + 30 && (
        <BigStatPhase frame={frame} />
      )}

      {/* ── Phase 4 : Guillotine (overlaid sur BigStat) ── */}
      {frame >= P3_END + 30 && frame < P4_END + 30 && (
        <GuillotineOverlay frame={frame} />
      )}

      {/* ── Phase 5 : TypeReveal typewriter + Sankey ── */}
      {frame >= P4_END && (
        <Phase5Overlay frame={frame} />
      )}
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────
// Carte Mapbox — zoom ease-in cubique phase 1, fixe ensuite
// ──────────────────────────────────────────────────────────
const MapScene: React.FC<{ frame: number }> = ({ frame }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("beat1-v2-map"));

  // Zoom ease-in cubique sur P1 (0→P1_END), fixe ensuite
  const t = Math.min(frame / P1_END, 1);
  const eased = t * t * t; // ease-in cubique Gemini
  const zoom = interpolate(eased, [0, 1], [CAM_START.zoom, CAM_ZOOM.zoom]);
  const lon  = interpolate(eased, [0, 1], [CAM_START.lon, CAM_ZOOM.lon]);
  const lat  = interpolate(eased, [0, 1], [CAM_START.lat, CAM_ZOOM.lat]);

  const mapOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM_START.lon, CAM_START.lat],
      zoom: CAM_START.zoom,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      applyCartoCaspian(map, CASPIAN_SEPIA);

      // Highlight Sénégal
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
        paint: { "fill-color": HIGHLIGHT_COLOR, "fill-opacity": 0.4 },
      });
      map.addLayer({
        id: "senegal-border",
        type: "line",
        source: "senegal-src",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "SEN"],
        paint: { "line-color": HIGHLIGHT_COLOR, "line-width": 2.0, "line-opacity": 0.9 },
      });

      continueRender(handle);
    });
  }, [handle]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setCenter([lon, lat]);
    mapRef.current.setZoom(zoom);
  }, [frame, lon, lat, zoom]);

  return (
    <AbsoluteFill style={{ backgroundColor: CASPIAN_SEPIA.water }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, opacity: mapOpacity }} />
      <CartoCaspianOverlay opacity={0.05} />
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────
// Phase 2 : Pulses concentriques SVG sur Sangomar + GTA
// Positionnés en CSS % depuis coordonnées approximatives
// ──────────────────────────────────────────────────────────
interface PulseFieldProps {
  frame: number;
  name: string;
  cssTop: string;
  cssLeft: string;
  delay: number;
}

const PulseField: React.FC<PulseFieldProps> = ({ frame, name, cssTop, cssLeft, delay }) => {
  const { fps } = useVideoConfig();
  const localF = Math.max(0, frame - P1_END - delay);

  const entryP = spring({ frame: localF, fps, config: { damping: 80, stiffness: 60 }, durationInFrames: 20 });
  const dotOpacity = interpolate(entryP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // 3 anneaux concentriques décalés
  const rings = [0, 18, 36];

  return (
    <div style={{ position: "absolute", top: cssTop, left: cssLeft, transform: "translate(-50%, -50%)", pointerEvents: "none" }}>
      {/* Point central */}
      <div style={{
        position: "absolute",
        width: 14, height: 14,
        borderRadius: "50%",
        backgroundColor: GOLD,
        boxShadow: `0 0 12px ${GOLD}cc`,
        top: -7, left: -7,
        opacity: dotOpacity,
      }} />

      {/* Anneaux pulsants */}
      {rings.map((ringDelay, i) => {
        const ringF = Math.max(0, localF - ringDelay);
        const cycle = ringF % 60; // cycle 60f
        const ringProgress = cycle / 60;
        const radius = interpolate(ringProgress, [0, 1], [10, 60]);
        const ringOpacity = interpolate(ringProgress, [0, 0.3, 1], [0.9, 0.5, 0]) * dotOpacity;

        return (
          <svg
            key={i}
            style={{ position: "absolute", top: -60, left: -60, pointerEvents: "none" }}
            width={120}
            height={120}
          >
            <circle
              cx={60}
              cy={60}
              r={radius}
              fill="none"
              stroke={GOLD}
              strokeWidth={1.5}
              opacity={ringOpacity}
            />
          </svg>
        );
      })}

      {/* Label champ */}
      <div style={{
        position: "absolute",
        top: 16,
        left: 10,
        opacity: dotOpacity,
        whiteSpace: "nowrap",
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 22,
          color: "#1a1209",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: 700,
          textShadow: "0 1px 3px rgba(255,255,255,0.9)",
        }}>
          {name}
        </span>
      </div>
    </div>
  );
};

const OffshorePulses: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {/* Sangomar : ~100km au large de Dakar. Vue zoomée sur côtes Sénégal → ~38% top, 28% left */}
    <PulseField frame={frame} name="SANGOMAR" cssTop="60%" cssLeft="22%" delay={0} />
    {/* GTA : frontière nord Sénégal/Mauritanie → ~18% top, 38% left */}
    <PulseField frame={frame} name="GTA" cssTop="22%" cssLeft="40%" delay={25} />
  </>
);

// ──────────────────────────────────────────────────────────
// Phase 3 : BigStat émerge du bas + vagues SVG fond
// ──────────────────────────────────────────────────────────
const WaveBackground: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const waves = [0, 1, 2, 3, 4];
  const W = 1920;
  const H = 1080;

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      {waves.map((i) => {
        const points = Array.from({ length: 100 }, (_, idx) => {
          const x = (idx / 99) * W;
          const y = H * 0.5 + Math.sin(idx * 0.3 + frame * 0.08 + i * 1.2) * (15 + i * 8);
          return `${x},${y}`;
        });
        return (
          <polyline
            key={i}
            points={points.join(" ")}
            fill="none"
            stroke={GOLD}
            strokeWidth={1.2}
            opacity={(0.06 - i * 0.01) * opacity}
          />
        );
      })}
    </svg>
  );
};

const BigStatPhase: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const localF = Math.max(0, frame - P2_END);

  // Fade-in fond noir
  const bgOpacity = interpolate(frame, [P2_END, P2_END + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Émergence spring depuis le bas (Gemini)
  const emergenceP = spring({
    frame: localF,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 100 },
  });
  const translateY = interpolate(emergenceP, [0, 1], [300, 0]);
  const contentOpacity = interpolate(emergenceP, [0, 0.3, 1], [0, 1, 1], { extrapolateRight: "clamp" });

  // Pulse lent du chiffre (ondulation) — anchor bigstatReveal=752, local=752-450=302
  const pulseF = Math.max(0, localF - (752 - P2_END));
  const pulseScale = 1 + Math.sin(pulseF * 0.08) * 0.012;

  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(10,10,10,${bgOpacity})` }}>
      <WaveBackground frame={frame} opacity={bgOpacity} />

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
        {/* Chiffre principal */}
        <div style={{
          fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
          fontSize: 220,
          lineHeight: 0.85,
          color: "#ffffff",
          textAlign: "center",
          letterSpacing: "-0.01em",
          transform: `scale(${pulseScale})`,
        }}>
          8 000 000 $
        </div>

        {/* Unité */}
        <div style={{
          fontFamily: "'Bebas Neue', 'Impact', sans-serif",
          fontSize: 72,
          color: HIGHLIGHT_COLOR,
          textAlign: "center",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginTop: 8,
        }}>
          / JOUR
        </div>

        {/* Label */}
        <div style={{
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          fontSize: 32,
          color: "rgba(255,255,255,0.55)",
          textAlign: "center",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginTop: 32,
        }}>
          REVENUS PÉTROLE ET GAZ — SÉNÉGAL 2024
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────
// Phase 4 : Guillotine clipPath (Gemini)
// Le 8M$ se coupe en deux — moitié droite glisse vers le bas
// ──────────────────────────────────────────────────────────
const GuillotineOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const cutStart = P3_END + 30; // début coupe
  const localF = Math.max(0, frame - cutStart);

  const cutP = spring({
    frame: localF,
    fps,
    config: { damping: 15, stiffness: 120 },
    durationInFrames: 30,
  });

  // Partie droite glisse vers le bas et disparait
  const rightY = interpolate(cutP, [0, 1], [0, 350]);
  const rightOpacity = interpolate(cutP, [0, 0.4, 1], [1, 0.7, 0]);

  // Partie gauche se recentre et rétrécit vers "~4M$"
  const leftScale = interpolate(cutP, [0, 1], [1, 0.55]);
  const leftX = interpolate(cutP, [0, 1], [0, -240]);

  // Ligne de coupe oblique
  const lineProgress = interpolate(localF, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sharedStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  };

  const textStyle: React.CSSProperties = {
    fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
    fontSize: 220,
    lineHeight: 0.85,
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: "-0.01em",
  };

  return (
    <>
      {/* Partie gauche (reste à l'écran, rétrécit) */}
      <div style={{
        ...sharedStyle,
        clipPath: "polygon(0 0, 52% 0, 42% 100%, 0 100%)",
        transform: `translateX(${leftX}px) scale(${leftScale})`,
        transformOrigin: "center center",
      }}>
        <div style={textStyle}>8 000 000 $</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, color: HIGHLIGHT_COLOR, letterSpacing: "0.1em", marginTop: 8 }}>/ JOUR</div>
      </div>

      {/* Partie droite (glisse vers le bas) */}
      <div style={{
        ...sharedStyle,
        clipPath: "polygon(52% 0, 100% 0, 100% 100%, 42% 100%)",
        transform: `translateY(${rightY}px)`,
        opacity: rightOpacity,
      }}>
        <div style={textStyle}>8 000 000 $</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, color: HIGHLIGHT_COLOR, letterSpacing: "0.1em", marginTop: 8 }}>/ JOUR</div>
      </div>

      {/* Ligne de coupe dorée oblique */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <line
          x1={0}
          y1={1080 * 0.42}
          x2={1920 * lineProgress}
          y2={1080 * 0.58}
          stroke={GOLD}
          strokeWidth={2.5}
          opacity={0.85}
        />
      </svg>
    </>
  );
};

// ──────────────────────────────────────────────────────────
// Phase 5 : TypeReveal typewriter + Sankey 3 blocs
// sur fond carte Mapbox floué
// ──────────────────────────────────────────────────────────
const Phase5Overlay: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const localF = Math.max(0, frame - P4_END);

  // Fade-in de l'overlay sombre
  const overlayOpacity = interpolate(frame, [P4_END, P4_END + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sankey apparait plus tard (f=180 local)
  const SANKEY_START = 180;
  const sankeyOpacity = interpolate(localF, [SANKEY_START, SANKEY_START + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Overlay sombre semi-transparent sur la carte floue */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: `rgba(5,10,16,${overlayOpacity * 0.82})`,
        backgroundImage: `radial-gradient(circle at center, rgba(17,26,40,${overlayOpacity * 0.82}) 0%, rgba(5,10,16,${overlayOpacity * 0.9}) 70%)`,
      }} />

      {/* TypeReveal typewriter vrai lettre par lettre */}
      <TypewriterReveal frame={frame} fps={fps} startFrame={P4_END} opacity={overlayOpacity} />

      {/* Sankey 3 blocs */}
      {localF >= SANKEY_START && (
        <SankeyBlocs frame={frame} fps={fps} opacity={sankeyOpacity} />
      )}
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────
// TypeReveal — vrai typewriter lettre par lettre (5f/char)
// ──────────────────────────────────────────────────────────
interface TypewriterRevealProps {
  frame: number;
  fps: number;
  startFrame: number;
  opacity: number;
}

const CHARS_PER_FRAME = 1;
const FRAMES_PER_CHAR = 5;
const TEXT_BEFORE = "La vraie question n'est pas ";
const KEYWORD = "COMBIEN";
const TEXT_AFTER = " il va garder.";

const TypewriterReveal: React.FC<TypewriterRevealProps> = ({ frame, startFrame, opacity }) => {
  const localF = Math.max(0, frame - startFrame);
  const totalTyped = Math.floor(localF / FRAMES_PER_CHAR) * CHARS_PER_FRAME;

  const beforeLen = TEXT_BEFORE.length;
  const kwLen = KEYWORD.length;

  const visibleBefore = TEXT_BEFORE.slice(0, Math.min(totalTyped, beforeLen));
  const kwTyped = Math.max(0, Math.min(totalTyped - beforeLen, kwLen));
  const visibleKeyword = KEYWORD.slice(0, kwTyped);
  const afterTyped = Math.max(0, totalTyped - beforeLen - kwLen);
  const visibleAfter = TEXT_AFTER.slice(0, afterTyped);

  // Cursor blink
  const cursorOpacity = Math.floor(localF / 12) % 2 === 0 ? 1 : 0;
  const allDone = totalTyped >= beforeLen + kwLen + TEXT_AFTER.length;

  // Keyword scale spring quand il commence à apparaitre
  const { fps } = useVideoConfig();
  const kwStartFrame = startFrame + beforeLen * FRAMES_PER_CHAR;
  const kwP = spring({
    frame: Math.max(0, frame - kwStartFrame),
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const kwScale = interpolate(kwP, [0, 1], [0.4, 1], { extrapolateRight: "clamp" });

  // Sous-titre fade après tout le texte
  const doneFr = startFrame + (beforeLen + kwLen + TEXT_AFTER.length) * FRAMES_PER_CHAR + 15;
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
      paddingLeft: 48,
      paddingRight: 48,
      gap: 0,
      lineHeight: 1.15,
      opacity,
    }}>
      {/* Texte avant */}
      {visibleBefore.length > 0 && (
        <span style={{
          fontSize: 76,
          fontFamily: "'Cinzel', serif",
          color: "#fdf6e3",
          lineHeight: 1.2,
        }}>
          {visibleBefore}
        </span>
      )}

      {/* Keyword COMBIEN */}
      {visibleKeyword.length > 0 && (
        <span style={{
          fontSize: 200,
          fontFamily: "'Cinzel', serif",
          fontWeight: 900,
          color: "#e9d59e",
          lineHeight: 1,
          transform: `scale(${kwScale})`,
          display: "inline-block",
          transformOrigin: "center bottom",
          textShadow: "0 0 60px rgba(233,213,158,0.7), 0 0 20px rgba(233,213,158,0.5)",
          marginLeft: 10,
          marginRight: 10,
        }}>
          {visibleKeyword}
        </span>
      )}

      {/* Texte après */}
      {visibleAfter.length > 0 && (
        <span style={{
          fontSize: 76,
          fontFamily: "'Cinzel', serif",
          color: "#fdf6e3",
          lineHeight: 1.2,
        }}>
          {visibleAfter}
        </span>
      )}

      {/* Cursor clignotant */}
      {!allDone && (
        <span style={{
          display: "inline-block",
          backgroundColor: "#e9d59e",
          width: 5,
          height: 76,
          marginLeft: 6,
          verticalAlign: "middle",
          opacity: cursorOpacity,
          flexShrink: 0,
        }} />
      )}

      {/* Sous-titre */}
      <div style={{
        position: "absolute",
        bottom: "-15%",
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        opacity: subtitleOpacity,
      }}>
        <div style={{ width: 280, height: 1, backgroundColor: "#9a8a6a", opacity: 0.5 }} />
        <span style={{
          color: "#9a8a6a",
          fontSize: 28,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}>
          SÉNÉGAL · PÉTROLE & GAZ · 2024
        </span>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
// Sankey simplifié 3 blocs — flux financiers
// Revenu brut → [Compagnies | FONSIS | Budget État]
// ──────────────────────────────────────────────────────────
interface SankeyBlocsProps {
  frame: number;
  fps: number;
  opacity: number;
}

const SankeyBlocs: React.FC<SankeyBlocsProps> = ({ frame, fps, opacity }) => {
  const localF = Math.max(0, frame - (P4_END + 180));

  const blocs = [
    { label: "COMPAGNIES", pct: "~40%", color: "#6a4a3a", delay: 0 },
    { label: "FONSIS", pct: "~12%", color: HIGHLIGHT_COLOR, delay: 15 },
    { label: "BUDGET ÉTAT", pct: "~48%", color: "#3a5a3a", delay: 30 },
  ];

  const sourceP = spring({ frame: localF, fps, config: { damping: 80, stiffness: 60 }, durationInFrames: 25 });
  const sourceOpacity = interpolate(sourceP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const sourceY = interpolate(sourceP, [0, 1], [20, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute",
      bottom: 80,
      left: 0,
      right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      opacity,
      pointerEvents: "none",
    }}>
      {/* Source */}
      <div style={{
        opacity: sourceOpacity,
        transform: `translateY(${sourceY}px)`,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderTop: `2px solid ${GOLD}`,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 32,
        paddingRight: 32,
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 20,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}>
          REVENU BRUT · 8 000 000 $ / JOUR
        </span>
      </div>

      {/* Flèche */}
      <svg width={24} height={24} style={{ opacity: sourceOpacity }}>
        <polyline points="12,0 12,18 6,12 12,18 18,12" fill="none" stroke={GOLD} strokeWidth={1.5} />
      </svg>

      {/* 3 blocs destination */}
      <div style={{ display: "flex", flexDirection: "row", gap: 16 }}>
        {blocs.map((bloc, i) => {
          const blocP = spring({
            frame: Math.max(0, localF - bloc.delay),
            fps,
            config: { damping: 80, stiffness: 70 },
            durationInFrames: 20,
          });
          const bOpacity = interpolate(blocP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const bY = interpolate(blocP, [0, 1], [16, 0], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              opacity: bOpacity,
              transform: `translateY(${bY}px)`,
              borderLeft: `3px solid ${bloc.color}`,
              backgroundColor: "rgba(5,10,16,0.7)",
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 18,
              paddingRight: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 4,
              minWidth: 200,
            }}>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 28,
                color: bloc.color === HIGHLIGHT_COLOR ? GOLD : "rgba(255,255,255,0.85)",
                letterSpacing: "0.08em",
              }}>
                {bloc.pct}
              </span>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 16,
                color: "rgba(255,255,255,0.5)",
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

export default Beat1AnomalieV2;
