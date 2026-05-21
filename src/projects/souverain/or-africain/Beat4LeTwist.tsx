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
import { BEATS, AUDIO_SEGMENTS, NARRATION_BEAT4_V2_PATH, BEAT4_V2_AUDIO_S, BEAT4_V2_DURATION_FRAMES, FPS as PROJECT_FPS } from "./timing";
import { PALETTE, PROGRESS_BAR, SOURCES } from "./manifest";
import { Subtitles } from "../../geoafrique-shorts/Subtitles";
import { BEAT4_V2_WORDS } from "./whisper-words-or-africain-v2";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Beat 4 v2 — own audio (narration-beat4-v2.mp3, 22.20s, 672 frames pad)
// Standalone composition : useCurrentFrame() commence a 0. Frames RELATIVES.
const BEAT_DURATION = BEAT4_V2_DURATION_FRAMES; // 672
const BEAT_START_S = 0;
const BEAT_END_S = BEAT_DURATION / 30;

// Country reveal local frames — Beat 4 v2 forced alignment
// Mali 7.159s, Burkina 13.579s, Niger 16.799s, Quatre 20.239s, Signal 21.319s
const MALI_FRAME = 215;
const BURKINA_FRAME = 407;
const NIGER_FRAME = 504;
const QUATRE_PAYS_FRAME = 607;
const SIGNAL_FRAME = 640;

const STYLE = {
  water: "#1a3a5c",
  land: "#4a4a4a",
  border: "#c8c8c8",
  ghana: PALETTE.or,        // #f5d547
  mali: PALETTE.orange,     // #e89b3c
  burkina: "#c47a28",       // gold-orange darker
  niger: "#d4872a",          // bronze
  space: "#0d1b2a",
};

// Camera keyframes — regional West Africa view that travels country by country
const CAM_REGION_OPEN  = { lon: 0,    lat: 12, zoom: 3.6, pitch: 0,  bearing: 0 };
const CAM_GHANA_HOLD   = { lon: -1.0, lat: 8,  zoom: 4.5, pitch: 25, bearing: 0 };
const CAM_MALI         = { lon: -3.5, lat: 15, zoom: 4.6, pitch: 30, bearing: 5 };
const CAM_BURKINA      = { lon: -1.5, lat: 12.5, zoom: 4.8, pitch: 35, bearing: 0 };
const CAM_NIGER        = { lon: 7.5,  lat: 15, zoom: 4.6, pitch: 30, bearing: -10 };
const CAM_FOUR_PULLBACK = { lon: 0,   lat: 13, zoom: 3.4, pitch: 15, bearing: 0 };

const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const lerpCam = (a: typeof CAM_GHANA_HOLD, b: typeof CAM_GHANA_HOLD, t: number) => {
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
  // Phase opening — start on regional view, drift slightly toward Ghana
  if (frame < 100) {
    const t = frame / 100;
    return lerpCam(CAM_REGION_OPEN, CAM_GHANA_HOLD, t);
  }
  // Hold on Ghana while narration says "Ghana n'est pas un cas isolé / pays africains reprennent..."
  if (frame < MALI_FRAME) {
    return CAM_GHANA_HOLD;
  }
  // Travel to Mali
  if (frame < BURKINA_FRAME) {
    const t = (frame - MALI_FRAME) / (BURKINA_FRAME - MALI_FRAME);
    return lerpCam(CAM_GHANA_HOLD, CAM_MALI, Math.min(t * 1.5, 1));
  }
  // Travel to Burkina
  if (frame < NIGER_FRAME) {
    const t = (frame - BURKINA_FRAME) / (NIGER_FRAME - BURKINA_FRAME);
    return lerpCam(CAM_MALI, CAM_BURKINA, Math.min(t * 1.5, 1));
  }
  // Travel to Niger
  if (frame < QUATRE_PAYS_FRAME) {
    const t = (frame - NIGER_FRAME) / (QUATRE_PAYS_FRAME - NIGER_FRAME);
    return lerpCam(CAM_BURKINA, CAM_NIGER, Math.min(t * 1.5, 1));
  }
  // Pull back to frame all 4 countries together for the climax
  const t = (frame - QUATRE_PAYS_FRAME) / (BEAT_DURATION - QUATRE_PAYS_FRAME);
  return lerpCam(CAM_NIGER, CAM_FOUR_PULLBACK, t);
}

type Country = {
  iso: string;
  nom: string;
  color: string;
  appearFrame: number;
  badge: { text: string; subtext?: string };
};

const COUNTRIES: Country[] = [
  { iso: "GHA", nom: "GHANA",        color: STYLE.ghana,   appearFrame: 0,             badge: { text: "5% → 12%", subtext: "ROYALTIES" } },
  { iso: "MLI", nom: "MALI",         color: STYLE.mali,    appearFrame: MALI_FRAME,    badge: { text: "$430M", subtext: "saisis à Barrick — " + SOURCES.bloomberg } },
  { iso: "BFA", nom: "BURKINA FASO", color: STYLE.burkina, appearFrame: BURKINA_FRAME, badge: { text: "Code minier révisé", subtext: "Loi 016-2024/ALT, juillet 2024" } },
  { iso: "NER", nom: "NIGER",        color: STYLE.niger,   appearFrame: NIGER_FRAME,   badge: { text: "100% nationalisé", subtext: "Mine Somaïr (uranium) — Décret 2024" } },
];

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

// Per-country label + badge that appears when narration names the country
function CountryCard({ frame, country, nextAppearFrame }: { frame: number; country: Country; nextAppearFrame: number }) {
  if (country.iso === "GHA") return null; // Ghana stays as anchor, no card

  const localStart = country.appearFrame;
  const localEnd = nextAppearFrame;
  if (frame < localStart || frame >= localEnd) return null;

  const localFrame = frame - localStart;
  const fadeIn = interpolate(localFrame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(localFrame, [localEnd - localStart - 10, localEnd - localStart], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);
  const slideY = interpolate(localFrame, [0, 14], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
          border: `2px solid ${country.color}`,
          borderRadius: 10,
          padding: "12px 28px",
          fontFamily: "monospace",
          fontSize: 36,
          fontWeight: 700,
          color: PALETTE.blanc,
          letterSpacing: "4px",
          boxShadow: `0 0 24px ${country.color}50`,
          marginBottom: 14,
        }}
      >
        {country.nom}
      </div>
      {country.badge && (
        <div
          style={{
            display: "block",
            margin: "0 auto",
            maxWidth: 720,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(0,0,0,0.65)",
              borderRadius: 8,
              padding: "10px 24px",
            }}
          >
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: country.badge.subtext ? 52 : 44,
                fontWeight: 800,
                color: country.color,
                letterSpacing: "-1px",
                textShadow: `0 0 12px ${country.color}80`,
              }}
            >
              {country.badge.text}
            </div>
            {country.badge.subtext && (
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 18,
                  color: "rgba(255,255,255,0.7)",
                  marginTop: 4,
                  letterSpacing: "2px",
                }}
              >
                {country.badge.subtext}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Counter X / 4 (counts countries that have spoken up)
function CountriesCounter({ frame }: { frame: number }) {
  if (frame < 60) return null;
  const visibleCount = COUNTRIES.filter(c => frame >= c.appearFrame).length;
  const opacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
        PAYS QUI SE LÈVENT
      </div>
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 80,
          fontWeight: 800,
          color: PALETTE.or,
          letterSpacing: "-2px",
          textShadow: `0 0 20px ${PALETTE.or}`,
          lineHeight: 1,
        }}
      >
        {visibleCount} / 4
      </div>
    </div>
  );
}

// Climax overlay "4 PAYS. UN MÊME SIGNAL." with map dimmed
function FourPaysOverlay({ frame }: { frame: number }) {
  if (frame < QUATRE_PAYS_FRAME) return null;
  const localFrame = frame - QUATRE_PAYS_FRAME;

  // Dim the map gradually
  const dimOpacity = interpolate(localFrame, [0, 20], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Line 1 "4 PAYS." appears at localFrame 0
  const line1Op = interpolate(localFrame, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Slide = interpolate(localFrame, [4, 22], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Line 2 "UN MÊME SIGNAL." appears at SIGNAL_FRAME (43 frames after QUATRE_PAYS)
  const signalLocal = frame - SIGNAL_FRAME;
  const line2Op = interpolate(signalLocal, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Slide = interpolate(signalLocal, [0, 18], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      {/* Dim layer over the map */}
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,1)", opacity: dimOpacity, zIndex: 30, pointerEvents: "none" }} />

      {/* Climax text */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 35,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 200,
            fontWeight: 900,
            color: PALETTE.or,
            letterSpacing: "-6px",
            opacity: line1Op,
            transform: `translateY(${line1Slide}px)`,
            textShadow: `0 0 40px ${PALETTE.or}, 0 0 80px ${PALETTE.or}`,
            lineHeight: 1,
          }}
        >
          4 PAYS.
        </div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 76,
            fontWeight: 700,
            color: PALETTE.blanc,
            letterSpacing: "4px",
            marginTop: 36,
            opacity: line2Op,
            transform: `translateY(${line2Slide}px)`,
            textShadow: "0 4px 18px rgba(0,0,0,0.7)",
          }}
        >
          UN MÊME SIGNAL.
        </div>
      </AbsoluteFill>
    </>
  );
}

export const Beat4LeTwist: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Beat4 Mapbox"));
  const [ready, setReady] = useState(false);

  const clampedRel = Math.max(0, Math.min(frame, BEAT_DURATION - 1));

  // Active countries (visible on map at current frame)
  const activeCountries = COUNTRIES.map(c => ({
    ...c,
    visible: clampedRel >= c.appearFrame,
    pulsePhase: clampedRel - c.appearFrame,
  }));

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
      center: [CAM_REGION_OPEN.lon, CAM_REGION_OPEN.lat],
      zoom: CAM_REGION_OPEN.zoom,
      pitch: CAM_REGION_OPEN.pitch,
      bearing: CAM_REGION_OPEN.bearing,
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

      // Add fill + border layer per country
      COUNTRIES.forEach((c) => {
        if (!map.getLayer(`country-fill-${c.iso}`)) {
          map.addLayer({
            id: `country-fill-${c.iso}`,
            type: "fill",
            source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], c.iso],
            paint: { "fill-color": c.color, "fill-opacity": c.iso === "GHA" ? 0.85 : 0 },
          });
        }
        if (!map.getLayer(`country-border-${c.iso}`)) {
          map.addLayer({
            id: `country-border-${c.iso}`,
            type: "line",
            source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], c.iso],
            paint: { "line-color": c.color, "line-width": 3, "line-opacity": c.iso === "GHA" ? 1 : 0 },
          });
        }
      });

      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle]);

  // Update camera + country opacities
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

    activeCountries.forEach((c) => {
      try {
        if (c.iso === "GHA") {
          // Ghana stays gold throughout, with very subtle slow pulse
          const ghanaPulse = 0.78 + 0.07 * Math.sin((clampedRel / 60) * Math.PI * 2);
          setPaint(`country-fill-${c.iso}`, "fill-opacity", ghanaPulse);
          return;
        }
        if (!c.visible) {
          setPaint(`country-fill-${c.iso}`, "fill-opacity", 0);
          setPaint(`country-border-${c.iso}`, "line-opacity", 0);
        } else {
          const fadeIn = Math.min(1, c.pulsePhase / 14);
          // Reduced amplitude (0.12 -> 0.06) and slowed cycle (18 -> 36 frames)
          const pulse = 0.7 + 0.06 * Math.sin((c.pulsePhase / 36) * Math.PI * 2);
          setPaint(`country-fill-${c.iso}`, "fill-opacity", fadeIn * pulse);
          setPaint(`country-border-${c.iso}`, "line-opacity", fadeIn * 0.95);
        }
      } catch {}
    });
  }, [clampedRel, ready, activeCountries]);

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

      {/* Per-country card (Mali, Burkina, Niger) */}
      {COUNTRIES.map((c, i) => {
        const next = i < COUNTRIES.length - 1 ? COUNTRIES[i + 1].appearFrame : QUATRE_PAYS_FRAME;
        return <CountryCard key={c.iso} frame={clampedRel} country={c} nextAppearFrame={next} />;
      })}

      {/* Counter X/4 — hide during climax overlay */}
      {clampedRel < QUATRE_PAYS_FRAME && <CountriesCounter frame={clampedRel} />}

      {/* Climax overlay "4 PAYS. UN MÊME SIGNAL." */}
      <FourPaysOverlay frame={clampedRel} />

      {/* Karaoke subtitles — Beat 4 v2 words (relative timing). Stop BEFORE "4 PAYS" overlay. */}
      <Subtitles
        sceneStartS={BEAT_START_S}
        sceneEndS={AUDIO_SEGMENTS.quatre_pays.startFrame / 30 - 0.15}
        highlightColor="#f5d547"
        fontSize={56}
        bottomOffset={480}
        words={BEAT4_V2_WORDS}
      />

      <ProgressBar frame={clampedRel} />

      {/* Narration */}
      <Audio
        src={staticFile(NARRATION_BEAT4_V2_PATH)}
        endAt={Math.round(BEAT4_V2_AUDIO_S * PROJECT_FPS)}
      />

      {/* SFX ping at each country reveal — subtle */}
      {[MALI_FRAME, BURKINA_FRAME, NIGER_FRAME].map((f) => (
        <Sequence key={f} from={f} durationInFrames={15}>
          <Audio src={staticFile("/souverain/or-africain/audio/sfx-map-ping.mp3")} volume={0.35} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const BEAT4_FRAMES = BEAT_DURATION;
