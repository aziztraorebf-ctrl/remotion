/**
 * Beat 1 — L'Anomalie
 * Sénégal pétrole & gaz — Acte I Hook
 *
 * Phase 1 (f0 → f752):   CartoCaspian SEPIA — Afrique Ouest → Sénégal highlight
 * Phase 2 (f752 → f1064): BigStat — "8 000 000 $" / jour (noir, 2s pulse à bigstatReveal)
 * Phase 3 (f1064 → f1496): TypeReveal — question centrale
 *
 * Timing anchors from timing.ts (audio-derived, zero hardcoded frames):
 *   bigstatReveal    = 752  ("Huit millions de dollars par jour")
 *   contradictionBeat = 1064 ("Et pourtant, l'État n'est pas certain")
 *   acte1LastWord     = 1457 ("tester en direct.")
 *
 * Audio: public/souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3
 * Duration standalone: 1496 frames (49.9s @ 30fps)
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
import { BigStat } from "../../_shared/components/inserts/BigStat";
import { TypeReveal } from "../../_shared/components/layouts/TypeReveal";
import { AUDIO_SEGMENTS } from "./timing";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const BEAT = AUDIO_SEGMENTS.acte1_anomalie;
const BEAT_DUR = BEAT.endFrame - BEAT.startFrame; // 1496

// Anchors (local frames, beat starts at 0)
const BIGSTAT_REVEAL = 752;
const CONTRADICTION_BEAT = 1064;
const ACTE1_LAST_WORD = 1457;

// Caméra : vue Afrique Ouest large → Sénégal centré
const CAM_START = { lat: 5, lon: -10, zoom: 2.4 };
const CAM_END   = { lat: 14.5, lon: -14.4, zoom: 5.2 };

// Sénégal ISO_A3 = "SEN"
const ISO_SENEGAL = "SEN";
const HIGHLIGHT_COLOR = "#c08820"; // CASPIAN_SEPIA.highlightOr

export const Beat1Anomalie: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase transitions ──
  const phase1End   = BIGSTAT_REVEAL;
  const phase2End   = CONTRADICTION_BEAT;
  // phase3 : f1064 → f1496

  // Crossfade map → BigStat (12f)
  const bigstatOpacity = interpolate(
    frame,
    [phase1End - 6, phase1End + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const mapFadeout = interpolate(
    frame,
    [phase1End - 6, phase1End + 6],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // BigStat local frame (starts counting from bigstatReveal)
  const bigstatLocalFrame = Math.max(0, frame - BIGSTAT_REVEAL);

  // TypeReveal : crossfade depuis BigStat (12f)
  const typeRevealOpacity = interpolate(
    frame,
    [phase2End - 6, phase2End + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const bigstatFadeout = interpolate(
    frame,
    [phase2End - 6, phase2End + 6],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // TypeReveal local frame
  const typeRevealLocalFrame = Math.max(0, frame - CONTRADICTION_BEAT);

  // Audio : endAt = last VO word + 1s buffer
  const audioEndAt = ACTE1_LAST_WORD + 30;

  return (
    <AbsoluteFill style={{ backgroundColor: CASPIAN_SEPIA.water }}>
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3")}
        startFrom={BEAT.startFrame}
        endAt={audioEndAt}
      />

      {/* ── Phase 1 : Carte Mapbox ── */}
      {frame < phase2End && (
        <div style={{ position: "absolute", inset: 0, opacity: mapFadeout }}>
          <MapCarte frame={frame} fps={fps} beatDur={BEAT_DUR} phase1End={phase1End} />
        </div>
      )}

      {/* ── Phase 2 : BigStat ── */}
      {frame >= BIGSTAT_REVEAL && frame < phase2End + 12 && (
        <div style={{ position: "absolute", inset: 0, opacity: bigstatOpacity * (frame < phase2End ? 1 : bigstatFadeout) }}>
          <BigStatPhase localFrame={bigstatLocalFrame} fps={fps} />
        </div>
      )}

      {/* ── Phase 3 : TypeReveal ── */}
      {frame >= CONTRADICTION_BEAT && (
        <div style={{ position: "absolute", inset: 0, opacity: typeRevealOpacity }}>
          <TypeRevealPhase localFrame={typeRevealLocalFrame} fps={fps} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── Sous-composant : Carte Mapbox phase 1 ──
interface MapCarteProps {
  frame: number;
  fps: number;
  beatDur: number;
  phase1End: number;
}

const MapCarte: React.FC<MapCarteProps> = ({ frame, beatDur, phase1End }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("beat1-anomalie-map"));

  const progress = Math.min(frame / phase1End, 1);

  const zoom = interpolate(progress, [0, 1], [CAM_START.zoom, CAM_END.zoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lon = interpolate(progress, [0, 1], [CAM_START.lon, CAM_END.lon], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lat = interpolate(progress, [0, 1], [CAM_START.lat, CAM_END.lat], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mapOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sénégal label apparait à f=300 (environ mi-zoom)
  const LABEL_APPEAR = 300;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM_START.lon, CAM_START.lat],
      zoom: CAM_START.zoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      applyCartoCaspian(map, CASPIAN_SEPIA);

      map.addSource("country-highlights", {
        type: "vector",
        url: "mapbox://mapbox.country-boundaries-v1",
      });

      map.addLayer({
        id: "senegal-fill",
        type: "fill",
        source: "country-highlights",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], ISO_SENEGAL],
        paint: {
          "fill-color": HIGHLIGHT_COLOR,
          "fill-opacity": 0.45,
        },
      });

      map.addLayer({
        id: "senegal-border",
        type: "line",
        source: "country-highlights",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], ISO_SENEGAL],
        paint: {
          "line-color": HIGHLIGHT_COLOR,
          "line-width": 2.0,
          "line-opacity": 0.9,
        },
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

      {/* Label SÉNÉGAL */}
      <SenegalLabel frame={frame} appearsAt={LABEL_APPEAR} />

      {/* Badge OR : 8M$/jour — apparait à f=580, disparait au bigstatReveal */}
      <OrBadge frame={frame} />
    </AbsoluteFill>
  );
};

// ── Label SÉNÉGAL overlay ──
const SenegalLabel: React.FC<{ frame: number; appearsAt: number }> = ({ frame, appearsAt }) => {
  const { fps } = useVideoConfig();
  if (frame < appearsAt) return null;

  const p = spring({
    frame: frame - appearsAt,
    fps,
    config: { damping: 100, stiffness: 80 },
    durationInFrames: 20,
  });
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale   = interpolate(p, [0, 1], [0.8, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: "38%",
        left: "36%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: HIGHLIGHT_COLOR,
        boxShadow: `0 0 10px ${HIGHLIGHT_COLOR}cc`,
      }} />
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 28,
        color: "#1a1209",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        textShadow: "0 1px 3px rgba(255,255,255,0.8)",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}>
        SÉNÉGAL
      </span>
    </div>
  );
};

// ── Badge "pétrole offshore" apparait à f=520, prépare la transition BigStat ──
const OrBadge: React.FC<{ frame: number }> = ({ frame }) => {
  const BADGE_APPEAR = 520;
  const BADGE_HIDE   = BIGSTAT_REVEAL - 6;
  if (frame < BADGE_APPEAR || frame > BADGE_HIDE) return null;

  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - BADGE_APPEAR,
    fps,
    config: { damping: 80, stiffness: 60 },
    durationInFrames: 20,
  });
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(p, [0, 1], [20, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: "none",
      }}
    >
      <div style={{
        backgroundColor: "rgba(26, 18, 9, 0.82)",
        borderLeft: `3px solid ${HIGHLIGHT_COLOR}`,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 28,
        paddingRight: 28,
        backdropFilter: "blur(4px)",
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 22,
          color: "#e3d6b8",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          PRODUCTION OFFSHORE · 2024
        </span>
      </div>
    </div>
  );
};

// ── Sous-composant : BigStat phase 2 (standalone frame context) ──
const BigStatPhase: React.FC<{ localFrame: number; fps: number }> = ({ localFrame, fps }) => {
  // Pulse à frame 0 local (= bigstatReveal)
  const pulseScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 8, stiffness: 200 },
    durationInFrames: 25,
  });
  const scale = interpolate(pulseScale, [0, 1], [1.25, 1.0], { extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${scale})` }}>
      <BigStat
        value="8 000 000 $"
        unit="/ JOUR"
        label="revenus pétrole et gaz — Sénégal 2024"
        variant="noir"
        unitColor="#c08820"
      />
    </div>
  );
};

// ── Sous-composant : TypeReveal phase 3 ──
const TypeRevealPhase: React.FC<{ localFrame: number; fps: number }> = ({ localFrame }) => {
  return (
    <TypeReveal
      textBefore={"La vraie question n'est pas "}
      keyword="COMBIEN"
      textAfter={" il va garder."}
      subtitle="SÉNÉGAL · PÉTROLE & GAZ · 2024"
      typeSpeed={3}
    />
  );
};

export default Beat1Anomalie;
