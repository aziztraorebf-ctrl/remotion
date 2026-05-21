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
import { BEATS, AUDIO_SEGMENTS, NARRATION_BEAT3B_V3_PATH, BEAT3B_V3_AUDIO_S, BEAT3B_V3_DURATION_FRAMES, FPS as PROJECT_FPS } from "./timing";
import { PALETTE, PROGRESS_BAR } from "./manifest";
import { Subtitles } from "../../geoafrique-shorts/Subtitles";
import { BEAT3B_V3_WORDS } from "./whisper-words-or-africain-v2";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Beat 3b v3 — own audio file (narration-beat3b-v3.mp3, 17.72s + pad = 17.92s = 538 frames)
// AVEC AFRIQUE DU SUD comme 6e pays (post fact-check Perplexity).
// In standalone composition : useCurrentFrame() commence a 0.
// AUDIO_SEGMENTS pour Beat 3b sont en frames RELATIVES au debut de ce beat.
const BEAT_DURATION = BEAT3B_V3_DURATION_FRAMES; // 538 frames
const BEAT_START_S = 0;
const BEAT_END_S = BEAT_DURATION / 30;

// Phase boundaries (local frames)
// Phase F (red screen) was removed — the map climax with 5/5 countries in red IS the climax.
const ZOOM_OUT_END = 45;        // first 1.5s = pull-back from Ghana to global view
const COUNTRIES_START = ZOOM_OUT_END; // f45

const GHANA_LON = -1.0232;
const GHANA_LAT = 7.9465;

const STYLE = {
  water: "#1a3a5c",
  land: "#4a4a4a",
  border: "#c8c8c8",
  highlight: PALETTE.or, // Ghana stays gold
  adversary: PALETTE.rouge, // 5 opposing countries in red
  space: "#0d1b2a",
};

// Camera keyframes — start on Ghana (continuity from Beat 3a end), pull back to global view
const CAM_GHANA = { lon: GHANA_LON, lat: GHANA_LAT, zoom: 5.5, pitch: 45, bearing: -5 };
const CAM_GLOBAL = { lon: 20, lat: 25, zoom: 1.0, pitch: 0, bearing: 0 };

// 6 adversary countries — Beat 3b v3 forced alignment (avec Afrique du Sud)
// États-Unis 0.299s=f9, Royaume-Uni 1.480s=f44, Chine 2.859s=f86,
// Canada 3.740s=f112, Australie 4.679s=f140, Afrique du Sud 5.879s=f176
type Adversary = {
  iso: string;
  nom: string;
  lon: number;
  lat: number;
  rawLocalStart: number;
};

const ADVERSARIES: Adversary[] = [
  { iso: "USA", nom: "ÉTATS-UNIS",     lon: -98,  lat: 39,  rawLocalStart: 9   },
  { iso: "GBR", nom: "ROYAUME-UNI",    lon: -2,   lat: 54,  rawLocalStart: 44  },
  { iso: "CHN", nom: "CHINE",          lon: 105,  lat: 35,  rawLocalStart: 86  },
  { iso: "CAN", nom: "CANADA",         lon: -106, lat: 56,  rawLocalStart: 112 },
  { iso: "AUS", nom: "AUSTRALIE",      lon: 134,  lat: -25, rawLocalStart: 140 },
  { iso: "ZAF", nom: "AFRIQUE DU SUD", lon: 25,   lat: -29, rawLocalStart: 176 },
];

// Country reveal times: clamped post zoom-out, respecting narration order with min 10f stagger
function effectiveStartFrame(idx: number): number {
  if (idx === 0) return Math.max(ADVERSARIES[0].rawLocalStart, ZOOM_OUT_END);
  const prev = effectiveStartFrame(idx - 1);
  return Math.max(ADVERSARIES[idx].rawLocalStart, prev + 10);
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const lerpCam = (a: typeof CAM_GHANA, b: typeof CAM_GHANA, t: number) => {
  const e = ease(Math.max(0, Math.min(1, t)));
  return {
    lon: a.lon + (b.lon - a.lon) * e,
    lat: a.lat + (b.lat - a.lat) * e,
    zoom: a.zoom + (b.zoom - a.zoom) * e,
    pitch: a.pitch + (b.pitch - a.pitch) * e,
    bearing: a.bearing + (b.bearing - a.bearing) * e,
  };
};

function getCameraForFrame(frame: number) {
  // Phase 1 — pull back from Ghana close-up to global view
  if (frame < ZOOM_OUT_END) {
    const t = frame / ZOOM_OUT_END;
    return lerpCam(CAM_GHANA, CAM_GLOBAL, t);
  }
  // Phase 2 — hold global view (no push-in: kept the world-readability of v3)
  return CAM_GLOBAL;
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

// Per-country label — option X : fade-out sequential, last label disappears ~1.5s after appearance
// (au lieu de rester jusqu'a fin de beat) pour laisser respirer la carte rouge des 6 pays au climax.
const LAST_LABEL_HOLD_FRAMES = 45; // ~1.5s pour le dernier label avant fade-out

function CountryLabel({ frame, idx, country }: { frame: number; idx: number; country: Adversary }) {
  const localStart = effectiveStartFrame(idx);
  const localEnd = idx < ADVERSARIES.length - 1
    ? effectiveStartFrame(idx + 1)              // option X : disparait quand le suivant arrive
    : localStart + LAST_LABEL_HOLD_FRAMES;       // dernier label : tient 1.5s puis fade

  if (frame < localStart || frame >= localEnd) return null;
  const localFrame = frame - localStart;
  const fadeIn = interpolate(localFrame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(localFrame, [localEnd - localStart - 6, localEnd - localStart], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);
  const slideY = interpolate(localFrame, [0, 12], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: 220,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        transform: `translateY(${slideY}px)`,
        zIndex: 25,
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: "rgba(0,0,0,0.78)",
          border: `2px solid ${STYLE.adversary}`,
          borderRadius: 10,
          padding: "12px 28px",
          fontFamily: "monospace",
          fontSize: 38,
          fontWeight: 700,
          color: PALETTE.blanc,
          letterSpacing: "4px",
          boxShadow: `0 0 24px rgba(211,47,47,0.45)`,
        }}
      >
        {country.nom}
      </div>
    </div>
  );
}

// Counter showing how many countries have spoken up
function CountriesCounter({ frame }: { frame: number }) {
  if (frame < COUNTRIES_START - 4) return null;
  const visibleCount = ADVERSARIES.filter((_, i) => frame >= effectiveStartFrame(i)).length;
  const opacity = interpolate(frame, [COUNTRIES_START - 4, COUNTRIES_START + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 280,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        zIndex: 25,
      }}
    >
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 22,
          color: "#9a9a9a",
          letterSpacing: "8px",
          marginBottom: 6,
        }}
      >
        PAYS QUI PROTESTENT
      </div>
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 80,
          fontWeight: 800,
          color: STYLE.adversary,
          letterSpacing: "-2px",
          textShadow: `0 0 20px ${STYLE.adversary}`,
          lineHeight: 1,
        }}
      >
        {visibleCount} / 6
      </div>
    </div>
  );
}

export const Beat3bPression: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Beat3b Mapbox"));
  const [ready, setReady] = useState(false);

  const clampedRel = Math.max(0, Math.min(frame, BEAT_DURATION - 1));

  // Which adversaries are visible at current frame — synced to forced alignment word timestamps
  const activeAdversaries = ADVERSARIES.map((c, i) => {
    const startFrame = effectiveStartFrame(i);
    return {
      ...c,
      visible: clampedRel >= startFrame,
      pulsePhase: clampedRel - startFrame,
    };
  });

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
      center: [CAM_GHANA.lon, CAM_GHANA.lat],
      zoom: CAM_GHANA.zoom,
      pitch: CAM_GHANA.pitch,
      bearing: CAM_GHANA.bearing,
      projection: { name: "mercator" },
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("style.load", () => {
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
        try { if (map.getLayer(id)) setPaint(id, prop, val); } catch {}
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

      // Ghana stays gold throughout — anchor visual
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

      // 5 adversary fill + border layers — initially invisible
      ADVERSARIES.forEach((c) => {
        if (!map.getLayer(`adv-fill-${c.iso}`)) {
          map.addLayer({
            id: `adv-fill-${c.iso}`,
            type: "fill",
            source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], c.iso],
            paint: { "fill-color": STYLE.adversary, "fill-opacity": 0 },
          });
        }
        if (!map.getLayer(`adv-border-${c.iso}`)) {
          map.addLayer({
            id: `adv-border-${c.iso}`,
            type: "line",
            source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], c.iso],
            paint: { "line-color": STYLE.adversary, "line-width": 2, "line-opacity": 0 },
          });
        }
      });

      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle]);

  // Update camera + adversary opacities every frame
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

    activeAdversaries.forEach((adv) => {
      try {
        if (!adv.visible) {
          setPaint(`adv-fill-${adv.iso}`, "fill-opacity", 0);
          setPaint(`adv-border-${adv.iso}`, "line-opacity", 0);
        } else {
          // Fade-in over 12 frames + subtle pulse
          const fadeIn = Math.min(1, adv.pulsePhase / 12);
          const pulse = 0.55 + 0.15 * Math.sin((adv.pulsePhase / 18) * Math.PI * 2);
          const fillOp = fadeIn * pulse;
          const borderOp = fadeIn * 0.95;
          setPaint(`adv-fill-${adv.iso}`, "fill-opacity", fillOp);
          setPaint(`adv-border-${adv.iso}`, "line-opacity", borderOp);
        }
      } catch {}
    });
  }, [clampedRel, ready, activeAdversaries]);

  return (
    <AbsoluteFill style={{ backgroundColor: STYLE.space }}>
      <MapboxBrandingHide />
      {/* Mapbox map */}
      <div
        ref={containerRef}
        style={{
          width,
          height,
          position: "absolute",
        }}
      />

      {/* Per-country label */}
      {ADVERSARIES.map((c, i) => (
        <CountryLabel key={c.iso} frame={clampedRel} idx={i} country={c} />
      ))}

      {/* Counter X / 5 */}
      <CountriesCounter frame={clampedRel} />

      {/* Karaoke subtitles — Beat 3b v3 words (avec Afrique du Sud, relative timing) */}
      <Subtitles
        sceneStartS={BEAT_START_S}
        sceneEndS={BEAT_END_S}
        highlightColor="#f5d547"
        fontSize={56}
        bottomOffset={480}
        words={BEAT3B_V3_WORDS}
      />

      <ProgressBar frame={clampedRel} />

      {/* Narration */}
      <Audio
        src={staticFile(NARRATION_BEAT3B_V3_PATH)}
        endAt={Math.round(BEAT3B_V3_AUDIO_S * PROJECT_FPS)}
      />

      {/* SFX swoosh pull-back at the start (camera flies away from Ghana) */}
      <Sequence from={0} durationInFrames={45}>
        <Audio src={staticFile("/souverain/or-africain/audio/sfx-swoosh-pullback.mp3")} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const BEAT3B_FRAMES = BEAT_DURATION;
