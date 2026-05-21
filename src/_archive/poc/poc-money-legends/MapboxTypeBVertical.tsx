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

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Timings derives du forced alignment (30fps)
const T = {
  GHANA_ALLUME: 158,
  MESSAGE_ARRETEZ: 377,
  PULLBACK: 450,
  MALI_ALLUME: 501,
  BURKINA_ALLUME: 606,
  NIGER_ALLUME: 698,
  CINQ_PAYS: 796,
  FIN: 870,
};

const COUNTRIES = [
  { iso: "GHA", name: "GHANA",   lon: -1.0232, lat:  7.9465, color: "#D4AF37", allume: T.GHANA_ALLUME },
  { iso: "MLI", name: "MALI",    lon: -2.0000, lat: 17.5707, color: "#E8A020", allume: T.MALI_ALLUME },
  { iso: "BFA", name: "BURKINA", lon: -1.5616, lat: 12.3641, color: "#CC7722", allume: T.BURKINA_ALLUME },
  { iso: "NER", name: "NIGER",   lon:  8.0817, lat: 17.6078, color: "#B05A1A", allume: T.NIGER_ALLUME },
];

type CamState = { lon: number; lat: number; zoom: number; pitch: number; bearing: number };

// Cameras — format vertical 9:16, zoom plus serré
const CAM_INTRO:    CamState = { lon:  0,      lat: 10,     zoom: 1.2, pitch:  0, bearing:  0 };
const CAM_GHANA:    CamState = { lon: -1.0232, lat:  7.95,  zoom: 5.2, pitch: 45, bearing: -5 };
const CAM_PULLBACK: CamState = { lon: -1.5,    lat: 12.5,   zoom: 3.4, pitch: 20, bearing:  0 };
const CAM_FINALE:   CamState = { lon: -1.5,    lat: 12.5,   zoom: 3.6, pitch: 25, bearing:  5 };

const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const lerpCam = (a: CamState, b: CamState, t: number): CamState => {
  const e = ease(Math.max(0, Math.min(1, t)));
  return {
    lon:     a.lon     + (b.lon     - a.lon)     * e,
    lat:     a.lat     + (b.lat     - a.lat)     * e,
    zoom:    a.zoom    + (b.zoom    - a.zoom)    * e,
    pitch:   a.pitch   + (b.pitch   - a.pitch)   * e,
    bearing: a.bearing + (b.bearing - a.bearing) * e,
  };
};

const getCam = (frame: number): CamState => {
  if (frame < T.GHANA_ALLUME) {
    return lerpCam(CAM_INTRO, CAM_GHANA, frame / T.GHANA_ALLUME);
  }
  if (frame < T.PULLBACK) {
    return CAM_GHANA;
  }
  if (frame < T.MALI_ALLUME) {
    return lerpCam(CAM_GHANA, CAM_PULLBACK, (frame - T.PULLBACK) / (T.MALI_ALLUME - T.PULLBACK));
  }
  if (frame < T.FIN) {
    return lerpCam(CAM_PULLBACK, CAM_FINALE, (frame - T.MALI_ALLUME) / (T.FIN - T.MALI_ALLUME));
  }
  return CAM_FINALE;
};

export const MapboxTypeBVertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox Type B Vertical"));
  const [ready, setReady] = useState(false);

  // Label Ghana (apparait quand Ghana s'allume, disparait au pullback)
  const ghanaLabelOpacity = interpolate(
    frame,
    [T.GHANA_ALLUME, T.GHANA_ALLUME + 20, T.PULLBACK - 20, T.PULLBACK],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ghanaScale = spring({ frame: Math.max(0, frame - T.GHANA_ALLUME), fps, config: { damping: 80, stiffness: 300 } });

  // Label "ARRÊTEZ" en rouge
  const arretezOpacity = interpolate(
    frame,
    [T.MESSAGE_ARRETEZ, T.MESSAGE_ARRETEZ + 15, T.PULLBACK - 10, T.PULLBACK],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Labels pays qui s'allument (Mali/Burkina/Niger) — petits labels sur la carte
  const getCountryLabelOpacity = (allume: number) =>
    interpolate(frame, [allume, allume + 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // Titre final
  const finalOpacity = interpolate(frame, [T.CINQ_PAYS, T.CINQ_PAYS + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finalScale = spring({ frame: Math.max(0, frame - T.CINQ_PAYS), fps, config: { damping: 70, stiffness: 280 } });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [CAM_INTRO.lon, CAM_INTRO.lat],
      zoom: CAM_INTRO.zoom,
      pitch: CAM_INTRO.pitch,
      bearing: CAM_INTRO.bearing,
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
      }

      COUNTRIES.forEach((c) => {
        if (!map.getLayer(`fill-${c.iso}`)) map.addLayer({
          id: `fill-${c.iso}`,
          type: "fill",
          source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], c.iso],
          paint: { "fill-color": c.color, "fill-opacity": 0 },
        });
        if (!map.getLayer(`border-${c.iso}`)) map.addLayer({
          id: `border-${c.iso}`,
          type: "line",
          source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], c.iso],
          paint: { "line-color": c.color, "line-width": 2, "line-opacity": 0 },
        });
      });

      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    map.jumpTo({
      center: [getCam(frame).lon, getCam(frame).lat],
      zoom: getCam(frame).zoom,
      pitch: getCam(frame).pitch,
      bearing: getCam(frame).bearing,
    });

    COUNTRIES.forEach((c) => {
      const visible = frame >= c.allume;
      const opacity = visible ? interpolate(frame, [c.allume, c.allume + 20], [0, 0.65], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
      try {
        map.setPaintProperty(`fill-${c.iso}`, "fill-opacity", opacity);
        map.setPaintProperty(`border-${c.iso}`, "line-opacity", visible ? Math.min(opacity * 1.4, 0.9) : 0);
      } catch {}
    });
  }, [frame, ready]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Narration */}
      <Audio
        src={staticFile("poc-money-legends/audio/narration-typeB-v1.mp3")}
        startFrom={0}
        volume={1}
      />

      {/* Musique kora en fond */}
      <Audio
        src={staticFile("poc-money-legends/audio/music-v1.mp3")}
        startFrom={0}
        volume={0.12}
      />

      {/* SFX ping sur chaque pays qui s'allume — Sequence par frame d'allumage */}
      {COUNTRIES.map((c) => (
        frame >= c.allume && frame < c.allume + 15 ? (
          <Audio
            key={c.iso}
            src={staticFile("poc-money-legends/audio/sfx-map-ping.mp3")}
            startFrom={0}
            trimAfter={14}
            volume={0.5}
          />
        ) : null
      ))}

      {/* Carte Mapbox */}
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {/* Label GHANA */}
      {frame >= T.GHANA_ALLUME && frame < T.PULLBACK && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 180,
            pointerEvents: "none",
            opacity: ghanaLabelOpacity,
          }}
        >
          <div
            style={{
              transform: `scale(${ghanaScale})`,
              backgroundColor: "rgba(0,0,0,0.85)",
              border: "2px solid #D4AF37",
              borderRadius: 10,
              padding: "16px 36px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 52, fontWeight: 900, fontFamily: "Arial Black, sans-serif", color: "#D4AF37", letterSpacing: "0.1em" }}>
              GHANA
            </div>
            <div style={{ fontSize: 22, fontFamily: "Arial, sans-serif", color: "rgba(255,255,255,0.8)", marginTop: 6 }}>
              5% → 12% royalties
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* "ARRÊTEZ." en rouge */}
      {frame >= T.MESSAGE_ARRETEZ && frame < T.PULLBACK && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: 80,
            pointerEvents: "none",
            opacity: arretezOpacity,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(180,0,0,0.9)",
              borderRadius: 8,
              padding: "10px 32px",
            }}
          >
            <div style={{ fontSize: 42, fontWeight: 900, fontFamily: "Arial Black, sans-serif", color: "#ffffff", letterSpacing: "0.06em" }}>
              LE MESSAGE : ARRÊTEZ.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Labels pays (Mali/Burkina/Niger) après pullback */}
      {frame >= T.PULLBACK && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {COUNTRIES.slice(1).map((c) => (
            <div
              key={c.iso}
              style={{
                position: "absolute",
                bottom: 180,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                opacity: getCountryLabelOpacity(c.allume),
              }}
            />
          ))}
        </AbsoluteFill>
      )}

      {/* Titre final "5 PAYS. MÊME MOUVEMENT." */}
      {frame >= T.CINQ_PAYS && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            opacity: finalOpacity,
          }}
        >
          <div
            style={{
              transform: `scale(${finalScale})`,
              backgroundColor: "rgba(0,0,0,0.9)",
              border: "2px solid #D4AF37",
              borderRadius: 12,
              padding: "28px 56px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 64, fontWeight: 900, fontFamily: "Arial Black, sans-serif", color: "#D4AF37", letterSpacing: "0.06em" }}>
              5 PAYS.
            </div>
            <div style={{ fontSize: 40, fontFamily: "Arial, sans-serif", color: "rgba(255,255,255,0.9)", marginTop: 10, letterSpacing: "0.04em" }}>
              MÊME MOUVEMENT.
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const MAPBOX_TYPE_B_VERTICAL_FRAMES = T.FIN;
