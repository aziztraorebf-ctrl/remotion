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
import { STYLE_GEO_AFRIQUE_V5, StarField } from "./MapboxOceanColor";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

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

// Timestamps word-level issus du forced alignment ElevenLabs
const SUBTITLES = [
  { word: "Le",              start:  21, end:  138 },
  { word: "Ghana",           start: 140, end:  149 },
  { word: "augmente",        start: 151, end:  164 },
  { word: "ses",             start: 165, end:  167 },
  { word: "royalties",       start: 169, end:  187 },
  { word: "sur",             start: 191, end:  224 },
  { word: "l'or.",           start: 225, end:  226 },
  { word: "De",              start: 227, end:  229 },
  { word: "cinq",            start: 229, end:  234 },
  { word: "pour",            start: 236, end:  256 },
  { word: "cent",            start: 258, end:  271 },
  { word: "à",               start: 274, end:  274 },
  { word: "douze",           start: 277, end:  285 },
  { word: "pour",            start: 285, end:  339 },
  { word: "cent.",           start: 340, end:  342 },
  { word: "Le",              start: 344, end:  346 },
  { word: "message",         start: 348, end:  365 },
  { word: "aux",             start: 375, end:  376 },
  { word: "multinationales", start: 376, end:  376 },
  { word: "est",             start: 376, end:  376 },
  { word: "clair.",          start: 376, end:  391 },
  { word: "Arrêtez.",        start: 391, end:  411 },
  { word: "Mali.",           start: 411, end:  470 },
  { word: "Burkina",         start: 515, end:  577 },
  { word: "Faso.",           start: 580, end:  594 },
  { word: "Niger.",          start: 645, end:  685 },
  { word: "Côte",            start: 686, end:  728 },
  { word: "d'Ivoire.",       start: 729, end:  736 },
  { word: "Cinq",            start: 738, end:  790 },
  { word: "pays.",           start: 793, end:  803 },
  { word: "Même",            start: 818, end:  826 },
  { word: "mouvement.",      start: 827, end:  838 },
];

// Groupes de sous-titres (2-4 mots par ligne)
const SUBTITLE_GROUPS = [
  { words: ["Le", "Ghana", "augmente", "ses"],    start:  21, end: 168 },
  { words: ["royalties", "sur", "l'or."],          start: 169, end: 226 },
  { words: ["De", "cinq", "pour", "cent"],         start: 227, end: 272 },
  { words: ["à", "douze", "pour", "cent."],        start: 274, end: 342 },
  { words: ["Le", "message", "aux"],               start: 344, end: 376 },
  { words: ["multinationales", "est", "clair."],   start: 376, end: 391 },
  { words: ["Arrêtez."],                           start: 391, end: 411 },
  { words: ["Mali."],                              start: 411, end: 514 },
  { words: ["Burkina", "Faso."],                   start: 515, end: 594 },
  { words: ["Niger."],                             start: 645, end: 685 },
  { words: ["Côte", "d'Ivoire."],                  start: 686, end: 736 },
  { words: ["Cinq", "pays."],                      start: 738, end: 803 },
  { words: ["Même", "mouvement."],                 start: 818, end: 838 },
];

const COUNTRIES = [
  { iso: "GHA", name: "GHANA",        stat: "5% → 12% royalties", lon: -1.0232, lat:  7.9465, color: "#FFD700", allume: T.GHANA_ALLUME },
  { iso: "MLI", name: "MALI",         stat: "Barrick +$430M",      lon: -2.0000, lat: 17.5707, color: "#F5C542", allume: T.MALI_ALLUME },
  { iso: "MLI", name: "MALI",         stat: "Barrick +$430M",      lon: -2.0000, lat: 17.5707, color: "#F5C542", allume: T.MALI_ALLUME },
  { iso: "BFA", name: "BURKINA",      stat: "Renégociation 2023",  lon: -1.5616, lat: 12.3641, color: "#E8B84B", allume: T.BURKINA_ALLUME },
  { iso: "NER", name: "NIGER",        stat: "Coup d'état minier",  lon:  8.0817, lat: 17.6078, color: "#DCAA3C", allume: T.NIGER_ALLUME },
];

// Dédupliqué pour les layers Mapbox
const COUNTRIES_UNIQUE = [
  { iso: "GHA", color: "#FFD700", allume: T.GHANA_ALLUME },
  { iso: "MLI", color: "#F5C542", allume: T.MALI_ALLUME },
  { iso: "BFA", color: "#E8B84B", allume: T.BURKINA_ALLUME },
  { iso: "NER", color: "#DCAA3C", allume: T.NIGER_ALLUME },
];

// Labels pays après pullback (sauf Ghana qui a son propre label)
const COUNTRY_LABELS = [
  { iso: "MLI", name: "MALI",    stat: "Barrick +$430M",     color: "#F5C542", allume: T.MALI_ALLUME },
  { iso: "BFA", name: "BURKINA", stat: "Renégociation 2023", color: "#E8B84B", allume: T.BURKINA_ALLUME },
  { iso: "NER", name: "NIGER",   stat: "Coup d'état minier", color: "#DCAA3C", allume: T.NIGER_ALLUME },
];

type CamState = { lon: number; lat: number; zoom: number; pitch: number; bearing: number };

const CAM_INTRO:    CamState = { lon:  0,      lat: 10,     zoom: 1.2, pitch:  0, bearing:  0 };
const CAM_GHANA:    CamState = { lon: -1.0232, lat:  7.95,  zoom: 5.2, pitch: 45, bearing: -5 };
const CAM_PULLBACK: CamState = { lon: -1.5,    lat: 12.5,   zoom: 3.4, pitch: 20, bearing:  0 };
const CAM_FINALE:   CamState = { lon: -1.5,    lat: 12.5,   zoom: 3.6, pitch: 25, bearing:  5 };

const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const lerpCam = (a: CamState, b: CamState, t: number): CamState => {
  const e = easeInOut(Math.max(0, Math.min(1, t)));
  return {
    lon:     a.lon     + (b.lon     - a.lon)     * e,
    lat:     a.lat     + (b.lat     - a.lat)     * e,
    zoom:    a.zoom    + (b.zoom    - a.zoom)    * e,
    pitch:   a.pitch   + (b.pitch   - a.pitch)   * e,
    bearing: a.bearing + (b.bearing - a.bearing) * e,
  };
};

const getCam = (frame: number): CamState => {
  if (frame < T.GHANA_ALLUME) return lerpCam(CAM_INTRO, CAM_GHANA, frame / T.GHANA_ALLUME);
  if (frame < T.PULLBACK) return CAM_GHANA;
  if (frame < T.MALI_ALLUME) return lerpCam(CAM_GHANA, CAM_PULLBACK, (frame - T.PULLBACK) / (T.MALI_ALLUME - T.PULLBACK));
  if (frame < T.FIN) return lerpCam(CAM_PULLBACK, CAM_FINALE, (frame - T.MALI_ALLUME) / (T.FIN - T.MALI_ALLUME));
  return CAM_FINALE;
};

export const MapboxTypeBVerticalV5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox Type B Vertical V5"));
  const [ready, setReady] = useState(false);

  const s = STYLE_GEO_AFRIQUE_V5;

  // Label Ghana
  const ghanaLabelOpacity = interpolate(
    frame,
    [T.GHANA_ALLUME, T.GHANA_ALLUME + 20, T.PULLBACK - 20, T.PULLBACK],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ghanaScale = spring({ frame: Math.max(0, frame - T.GHANA_ALLUME), fps, config: { damping: 80, stiffness: 300 } });

  // Label ARRETEZ
  const arretezOpacity = interpolate(
    frame,
    [T.MESSAGE_ARRETEZ, T.MESSAGE_ARRETEZ + 15, T.PULLBACK - 10, T.PULLBACK],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Titre final
  const finalOpacity = interpolate(frame, [T.CINQ_PAYS, T.CINQ_PAYS + 25], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalScale = spring({ frame: Math.max(0, frame - T.CINQ_PAYS), fps, config: { damping: 70, stiffness: 280 } });

  // Sous-titres — trouver le groupe actif
  const activeGroup = SUBTITLE_GROUPS.find(g => frame >= g.start && frame <= g.end + 15);
  const subtitleOpacity = activeGroup
    ? interpolate(frame, [activeGroup.start, activeGroup.start + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

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
      fadeDuration: 300,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") map.setLayoutProperty(layer.id, "visibility", "none");
        if (layer.id.includes("waterway") || layer.id.includes("wetland")) {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }

      const safe = (id: string, prop: string, val: unknown) => {
        try { if (map.getLayer(id)) map.setPaintProperty(id, prop, val); } catch {}
      };

      safe("water", "fill-color", s.water);
      safe("water-shadow", "fill-color", s.water);
      safe("land", "background-color", s.land);
      safe("landuse", "fill-color", s.land);
      safe("national-park", "fill-color", s.land);
      safe("landcover", "fill-color", s.land);
      safe("admin-0-boundary", "line-color", s.border);
      safe("admin-0-boundary-disputed", "line-color", s.border);
      safe("admin-1-boundary", "line-color", "rgba(180,180,180,0.3)");

      COUNTRIES_UNIQUE.forEach((c) => {
        if (!map.getLayer(`fill-${c.iso}`)) map.addLayer({
          id: `fill-${c.iso}`,
          type: "fill",
          source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], c.iso],
          paint: { "fill-color": c.color, "fill-opacity": 0 },
        });
        if (!map.getLayer(`border-v5-${c.iso}`)) map.addLayer({
          id: `border-v5-${c.iso}`,
          type: "line",
          source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], c.iso],
          paint: { "line-color": c.color, "line-width": 2.5, "line-opacity": 0 },
        });
      });

      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle, s]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    const cam = getCam(frame);
    map.jumpTo({ center: [cam.lon, cam.lat], zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing });

    COUNTRIES_UNIQUE.forEach((c) => {
      const visible = frame >= c.allume;
      const opacity = visible
        ? interpolate(frame, [c.allume, c.allume + 20], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        : 0;
      try {
        map.setPaintProperty(`fill-${c.iso}`, "fill-opacity", opacity);
        map.setPaintProperty(`border-v5-${c.iso}`, "line-opacity", visible ? Math.min(opacity * 1.4, 1) : 0);
      } catch {}
    });
  }, [frame, ready]);

  return (
    <AbsoluteFill style={{ backgroundColor: s.space }}>
      {/* Audio narration + musique */}
      <Audio src={staticFile("poc-money-legends/audio/narration-typeB-v1.mp3")} startFrom={0} volume={1} />
      <Audio src={staticFile("poc-money-legends/audio/music-v1.mp3")} startFrom={0} volume={0.12} />

      {/* SFX swoosh zoom-in vers Ghana (frame 0) */}
      {frame >= 0 && frame < 20 && (
        <Audio src={staticFile("poc-money-legends/audio/sfx-swoosh-zoomin.mp3")} startFrom={0} trimAfter={18} volume={0.35} />
      )}

      {/* SFX swoosh pullback (frame 450) */}
      {frame >= T.PULLBACK && frame < T.PULLBACK + 22 && (
        <Audio src={staticFile("poc-money-legends/audio/sfx-swoosh-pullback.mp3")} startFrom={0} trimAfter={21} volume={0.3} />
      )}

      {/* SFX ping sur chaque pays qui s'allume */}
      {COUNTRIES_UNIQUE.map((c) => (
        frame >= c.allume && frame < c.allume + 15 ? (
          <Audio key={c.iso} src={staticFile("poc-money-legends/audio/sfx-map-ping.mp3")} startFrom={0} trimAfter={14} volume={0.5} />
        ) : null
      ))}

      {/* Etoiles — z=0 derrière la carte */}
      <div style={{ position: "absolute", top: 0, left: 0, width, height, zIndex: 0 }}>
        <StarField width={width} height={height} />
      </div>

      {/* Carte Mapbox — z=1 */}
      <div ref={containerRef} style={{ width, height, position: "absolute", zIndex: 1, filter: "brightness(1.3)" }} />

      {/* Label GHANA — z=2 */}
      {frame >= T.GHANA_ALLUME && frame < T.PULLBACK && (
        <AbsoluteFill style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 220, pointerEvents: "none", opacity: ghanaLabelOpacity, zIndex: 2 }}>
          <div style={{ transform: `scale(${ghanaScale})`, backgroundColor: "rgba(0,10,20,0.88)", border: "2px solid #FFD700", borderRadius: 10, padding: "14px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 900, fontFamily: "Arial Black, sans-serif", color: "#FFD700", letterSpacing: "0.1em" }}>
              GHANA
            </div>
            <div style={{ fontSize: 20, fontFamily: "Arial, sans-serif", color: "rgba(255,255,255,0.85)", marginTop: 5 }}>
              5% → 12% royalties
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ARRETEZ — z=2 */}
      {frame >= T.MESSAGE_ARRETEZ && frame < T.PULLBACK && (
        <AbsoluteFill style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 80, pointerEvents: "none", opacity: arretezOpacity, zIndex: 2 }}>
          <div style={{ backgroundColor: "rgba(180,0,0,0.92)", borderRadius: 8, padding: "10px 32px" }}>
            <div style={{ fontSize: 38, fontWeight: 900, fontFamily: "Arial Black, sans-serif", color: "#ffffff", letterSpacing: "0.06em" }}>
              LE MESSAGE : ARRETEZ.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Labels pays Mali/Burkina/Niger — pop au moment de l'allumage */}
      {frame >= T.PULLBACK && (
        <AbsoluteFill style={{ pointerEvents: "none", zIndex: 2 }}>
          {COUNTRY_LABELS.map((c, i) => {
            if (frame < c.allume) return null;
            const labelOpacity = interpolate(frame, [c.allume, c.allume + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const labelScale = spring({ frame: Math.max(0, frame - c.allume), fps, config: { damping: 80, stiffness: 300 } });
            const topPos = 260 + i * 90;
            return (
              <div
                key={c.iso}
                style={{
                  position: "absolute",
                  top: topPos,
                  left: 36,
                  opacity: labelOpacity,
                  transform: `scale(${labelScale})`,
                  transformOrigin: "left center",
                }}
              >
                <div style={{
                  backgroundColor: "rgba(0,10,20,0.82)",
                  border: `1.5px solid ${c.color}`,
                  borderRadius: 7,
                  padding: "8px 18px",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "Arial Black, sans-serif", color: c.color, letterSpacing: "0.08em" }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 14, fontFamily: "Arial, sans-serif", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                    {c.stat}
                  </div>
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      {/* Titre final — z=2 */}
      {frame >= T.CINQ_PAYS && (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", opacity: finalOpacity, zIndex: 2 }}>
          <div style={{ transform: `scale(${finalScale})`, backgroundColor: "rgba(0,10,20,0.92)", border: "2px solid #FFD700", borderRadius: 12, padding: "28px 56px", textAlign: "center" }}>
            <div style={{ fontSize: 64, fontWeight: 900, fontFamily: "Arial Black, sans-serif", color: "#FFD700", letterSpacing: "0.06em" }}>
              5 PAYS.
            </div>
            <div style={{ fontSize: 40, fontFamily: "Arial, sans-serif", color: "rgba(255,255,255,0.9)", marginTop: 10, letterSpacing: "0.04em" }}>
              MEME MOUVEMENT.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Sous-titres karaoke — z=3, en bas */}
      {activeGroup && (
        <AbsoluteFill style={{ pointerEvents: "none", zIndex: 3 }}>
          <div style={{
            position: "absolute",
            bottom: 140,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: subtitleOpacity,
          }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: "85%" }}>
              {activeGroup.words.map((word, wi) => {
                const wordData = SUBTITLES.find(sw => sw.word === word &&
                  sw.start >= activeGroup.start - 5 && sw.start <= activeGroup.end + 5);
                const isActive = wordData ? frame >= wordData.start && frame <= wordData.end + 8 : false;
                return (
                  <span
                    key={wi}
                    style={{
                      fontSize: 36,
                      fontWeight: 900,
                      fontFamily: "Arial Black, sans-serif",
                      color: isActive ? "#FFD700" : "#ffffff",
                      textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)",
                      letterSpacing: "0.02em",
                      transition: "none",
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const MAPBOX_TYPE_B_V5_FRAMES = T.FIN;
