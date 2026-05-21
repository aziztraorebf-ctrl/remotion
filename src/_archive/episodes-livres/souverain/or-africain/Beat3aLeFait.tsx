import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { BEATS, AUDIO_SEGMENTS, NARRATION_PATH } from "./timing";
import { PALETTE, PROGRESS_BAR } from "./manifest";
import { Subtitles } from "../../geoafrique-shorts/Subtitles";
import { OR_AFRICAIN_WORDS } from "./whisper-words-or-africain";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Beat 3a covers Phases A+B+C+D of the original Beat 3 (f819 → f1259 absolute)
// Local frames: 0 → 440 (14.66s)
const BEAT_START = BEATS.beat3.startFrame;
const BEAT_END_ABS = AUDIO_SEGMENTS.etats_unis.startFrame; // f1259 — handoff to Beat 3b
const BEAT_DURATION = BEAT_END_ABS - BEAT_START; // 440 frames
const BEAT_START_S = BEATS.beat3.startSec;
const BEAT_END_S = BEAT_END_ABS / 30;

// Phase boundaries (local frames, relative to Beat 3a start)
// Phase B (flash $5000) was removed — narration + karaoke carry the message.
// Phase A is now extended through where the flash used to live; Phase C unchanged at end.
const PHASE_C_START = AUDIO_SEGMENTS.cinq_mille_b3.startFrame - BEAT_START + 45;   // f172 — pan+zoom starts (after where flash used to end)
const PHASE_C_END = AUDIO_SEGMENTS.progressives.startFrame - BEAT_START;           // f265 — pan+zoom ends, badge appears
const PHASE_D_END = BEAT_DURATION;                                                 // f440 — end of beat

const GHANA_LON = -1.0232;
const GHANA_LAT = 7.9465;

// STYLE_GEO_AFRIQUE_V5 — validated style for mobile/sun visibility
const STYLE = {
  water: "#1a3a5c",
  land: "#4a4a4a",
  border: "#c8c8c8",
  highlight: PALETTE.or, // #f5d547
  space: "#0d1b2a",
};

// Camera keyframes — top-down Africa view, no space, mercator projection
// Phase A: wide view of West Africa (Ghana visible, no horizon, no stars)
// Phase C: pan + slight zoom toward Ghana close-up
const CAM_AFRICA = { lon: 5, lat: 8, zoom: 3.0, pitch: 0, bearing: 0 };
const CAM_GHANA = { lon: GHANA_LON, lat: GHANA_LAT, zoom: 5.5, pitch: 45, bearing: -5 };

const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const lerpCam = (a: typeof CAM_AFRICA, b: typeof CAM_AFRICA, t: number) => {
  const e = ease(Math.max(0, Math.min(1, t)));
  return {
    lon: a.lon + (b.lon - a.lon) * e,
    lat: a.lat + (b.lat - a.lat) * e,
    zoom: a.zoom + (b.zoom - a.zoom) * e,
    pitch: a.pitch + (b.pitch - a.pitch) * e,
    bearing: a.bearing + (b.bearing - a.bearing) * e,
  };
};

// Drifted Africa view at end of Phase A (used as start of Phase C pan)
const CAM_AFRICA_DRIFT_END = { lon: 2, lat: 7.5, zoom: 3.2, pitch: 0, bearing: 0 };

function getCameraForFrame(frame: number) {
  // Phase A (0..PHASE_C_START): subtle drift on Africa wide view, pulls slightly toward Ghana
  // No freeze, no flash — continuous map view throughout.
  if (frame < PHASE_C_START) {
    const t = frame / PHASE_C_START;
    return lerpCam(CAM_AFRICA, CAM_AFRICA_DRIFT_END, t);
  }
  // Phase C (PHASE_C_START..PHASE_C_END): smooth pan + zoom from Africa wide to Ghana close-up
  if (frame < PHASE_C_END) {
    const t = (frame - PHASE_C_START) / (PHASE_C_END - PHASE_C_START);
    return lerpCam(CAM_AFRICA_DRIFT_END, CAM_GHANA, t);
  }
  // Phase D: hold on Ghana
  return CAM_GHANA;
}

// Border line-width interpolated by zoom — fine at zoom 3, thick at zoom 5+
function borderWidthForZoom(zoom: number): number {
  if (zoom <= 3) return 1.5;
  if (zoom >= 5) return 3.0;
  return 1.5 + ((zoom - 3) / 2) * 1.5;
}

function ProgressBar({ frame }: { frame: number }) {
  const progress = frame / BEAT_DURATION;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: PROGRESS_BAR.y,
        width: `${progress * 100}%`,
        height: PROGRESS_BAR.height,
        backgroundColor: PROGRESS_BAR.color,
        opacity: PROGRESS_BAR.opacity,
        zIndex: 50,
      }}
    />
  );
}

// Phase D — Badge "5% → 12%" centered
function RoyaltiesBadge({ frame }: { frame: number }) {
  const startFrame = AUDIO_SEGMENTS.progressives.startFrame - BEAT_START;
  if (frame < startFrame) return null;
  const localFrame = frame - startFrame;

  const appear = spring({ fps: 30, frame: localFrame, config: { damping: 200 } });

  // The "12%" digit appears with a delay — after "douze pour cent" word
  const douzePctRel = AUDIO_SEGMENTS.douze_pct.startFrame - BEAT_START - startFrame;
  const arrowProgress = interpolate(
    localFrame,
    [douzePctRel - 10, douzePctRel + 5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 280,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 20,
        transform: `scale(${appear})`,
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.78)",
          border: `2px solid ${PALETTE.or}`,
          borderRadius: 14,
          padding: "20px 44px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          boxShadow: `0 0 30px rgba(245,213,71,0.4)`,
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 88,
            fontWeight: 800,
            color: PALETTE.gris,
            letterSpacing: "-2px",
          }}
        >
          5%
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 64,
            color: PALETTE.or,
            opacity: arrowProgress,
          }}
        >
          →
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 88,
            fontWeight: 800,
            color: PALETTE.or,
            letterSpacing: "-2px",
            opacity: arrowProgress,
            textShadow: `0 0 16px ${PALETTE.or}`,
          }}
        >
          12%
        </div>
      </div>
    </div>
  );
}

// Phase A — context label "JANVIER · 2026 / L'or franchit un seuil."
function SpaceLabel({ frame }: { frame: number }) {
  if (frame >= PHASE_C_START) return null;
  const opacity = interpolate(frame, [20, 40, PHASE_C_START - 12, PHASE_C_START], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 220,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        zIndex: 20,
      }}
    >
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 26,
          color: "#9a9a9a",
          letterSpacing: "8px",
          marginBottom: 12,
        }}
      >
        JANVIER · 2026
      </div>
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 50,
          color: PALETTE.blanc,
          fontWeight: 700,
          letterSpacing: "-1px",
          textShadow: "0 0 16px rgba(0,0,0,0.9)",
        }}
      >
        L'or franchit un seuil.
      </div>
    </div>
  );
}

export const Beat3aLeFait: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Beat3a Mapbox"));
  const [ready, setReady] = useState(false);

  const clampedRel = Math.max(0, Math.min(frame, BEAT_DURATION - 1));

  // Pulsing Ghana fill — stronger during phase A (wide view) so it stays visible from afar
  const ghanaPulse = clampedRel < PHASE_C_START
    ? 0.7 + 0.25 * Math.sin((clampedRel / 30) * Math.PI * 2) // 1s cycle, 0.45..0.95
    : 0.85;

  // Current camera zoom — used for dynamic border thickness
  const currentCam = getCameraForFrame(clampedRel);
  const dynamicBorderWidth = borderWidthForZoom(currentCam.zoom);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [CAM_AFRICA.lon, CAM_AFRICA.lat],
      zoom: CAM_AFRICA.zoom,
      pitch: CAM_AFRICA.pitch,
      bearing: CAM_AFRICA.bearing,
      projection: { name: "mercator" },
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      // Apply STYLE_GEO_AFRIQUE_V5 paint overrides
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
        if (layer.id.includes("waterway") || layer.id.includes("wetland")) {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }

      const setPaint = map.setPaintProperty.bind(map) as unknown as (id: string, prop: string, val: unknown) => void;
      const safe = (id: string, prop: string, val: unknown) => {
        try {
          if (map.getLayer(id)) setPaint(id, prop, val);
        } catch {}
      };

      safe("water", "fill-color", STYLE.water);
      safe("water-shadow", "fill-color", STYLE.water);
      safe("land", "background-color", STYLE.land);
      safe("landuse", "fill-color", STYLE.land);
      safe("national-park", "fill-color", STYLE.land);
      safe("landcover", "fill-color", STYLE.land);
      safe("admin-0-boundary", "line-color", STYLE.border);
      safe("admin-0-boundary", "line-width", 2);
      safe("admin-0-boundary-disputed", "line-color", STYLE.border);
      safe("admin-0-boundary-disputed", "line-width", 2);
      safe("admin-1-boundary", "line-color", "rgba(180,180,180,0.3)");

      // Ghana highlight (fill + border)
      if (!map.getLayer("ghana-fill")) {
        map.addLayer({
          id: "ghana-fill",
          type: "fill",
          source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
          paint: { "fill-color": STYLE.highlight, "fill-opacity": 0.85 },
        });
      }
      if (!map.getLayer("ghana-border")) {
        map.addLayer({
          id: "ghana-border",
          type: "line",
          source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
          paint: { "line-color": STYLE.highlight, "line-width": 3, "line-opacity": 1 },
        });
      }

      setReady(true);
      continueRender(handle);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handle]);

  // Update camera + Ghana pulse on every frame
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const cam = getCameraForFrame(clampedRel);

    map.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
    });

    const setPaint = (map.setPaintProperty as unknown as (id: string, prop: string, val: unknown) => void).bind(map);
    try {
      setPaint("ghana-fill", "fill-opacity", ghanaPulse);
      // Dynamic border thickness — fine when zoomed out, thick when zoomed in
      try { if (map.getLayer("admin-0-boundary")) setPaint("admin-0-boundary", "line-width", dynamicBorderWidth); } catch {}
      try { if (map.getLayer("admin-0-boundary-disputed")) setPaint("admin-0-boundary-disputed", "line-width", dynamicBorderWidth); } catch {}
    } catch {}
  }, [clampedRel, ready, ghanaPulse, dynamicBorderWidth]);

  return (
    <AbsoluteFill style={{ backgroundColor: STYLE.space }}>
      <MapboxBrandingHide />
      {/* Mapbox map — visible throughout, no flash interruption */}
      <div
        ref={containerRef}
        style={{
          width,
          height,
          position: "absolute",
        }}
      />

      {/* Phase A — context label */}
      <SpaceLabel frame={clampedRel} />

      {/* Phase D — royalties badge 5% → 12% */}
      <RoyaltiesBadge frame={clampedRel} />

      {/* Karaoke subtitles — continuous across the beat */}
      <Subtitles
        sceneStartS={BEAT_START_S}
        sceneEndS={BEAT_END_S}
        highlightColor="#f5d547"
        fontSize={56}
        bottomOffset={480}
        words={OR_AFRICAIN_WORDS}
      />

      <ProgressBar frame={clampedRel} />

      {/* Narration — slice from BEAT_START to BEAT_END_ABS - 11
          Cut RIGHT AFTER "cours." (master f1243) but BEFORE "Les" du master (f1252)
          to avoid overlap with Beat 3b v3 audio which re-starts with "Les États-Unis".
          Master timing: "cours." finit f1243, silence f1243-1252, "Les" master f1252.
          Trim de 11 frames (1259-11=1248) = preserve "cours." + petite respiration. */}
      <Audio src={staticFile(NARRATION_PATH)} startFrom={BEAT_START} endAt={BEAT_END_ABS - 11} />

      {/* SFX swoosh at the start of phase C (camera zooms toward Ghana) */}
      <Sequence from={PHASE_C_START} durationInFrames={30}>
        <Audio src={staticFile("/souverain/or-africain/audio/sfx-swoosh-zoomin.mp3")} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const BEAT3A_FRAMES = BEAT_DURATION;
