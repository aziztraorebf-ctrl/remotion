import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Caméra — vue Afrique centrée
const CAM_START = { lon: 0, lat: 15, zoom: 1.5, pitch: 0, bearing: 0 };
const CAM_END   = { lon: 15, lat: 5,  zoom: 2.8, pitch: 30, bearing: 10 };

export const MAPBOX_OCEAN_COLOR_FRAMES = 300; // 10s

// 4 presets d'océan à démontrer successivement
const OCEAN_PRESETS = [
  {
    label: "ABYSSAL DEEP",
    desc: "Océan bleu abyssal",
    water: "#03224c",
    land: "#111111",
    border: "#2a2a2a",
    highlight: "#D4AF37",
  },
  {
    label: "TERRA INCOGNITA",
    desc: "Parchemin & mer de jade",
    water: "#1a4a3a",
    land: "#2a1e0e",
    border: "#5a3e1e",
    highlight: "#E8C97D",
  },
  {
    label: "NEON ATLAS",
    desc: "Océan cyan néon",
    water: "#001a2e",
    land: "#0a0a0a",
    border: "#1a1a1a",
    highlight: "#00CFFF",
  },
  {
    label: "SAHARA GOLD",
    desc: "Mer dorée, continent sombre",
    water: "#3d2a00",
    land: "#0f0f0f",
    border: "#2a1a00",
    highlight: "#FFB800",
  },
];

// Style validé par Aziz — Terre Terra Incognita + Océan Abyssal Deep
export const STYLE_GEO_AFRIQUE = {
  label: "GEO AFRIQUE",
  desc: "Style signature GéoAfrique",
  water: "#03224c",      // Abyssal Deep ocean
  land: "#2a1e0e",       // Terra Incognita land (parchemin sombre)
  border: "#5a3e1e",     // Terra Incognita borders (or sombre)
  highlight: "#E8C97D",  // Or doux Terra Incognita
};

// Option 2 — Océan sombre conservé, terre éclaircie pour lisibilité mobile/soleil
export const STYLE_GEO_AFRIQUE_V2 = {
  label: "GEO AFRIQUE V2",
  desc: "Océan abyssal + Terre parchemin lisible",
  water: "#03224c",      // Abyssal Deep ocean — inchangé (contraste dramatique)
  land: "#4a3520",       // Parchemin sombre mais lisible (+40% luminosité vs V1)
  border: "#8a6030",     // Or sombre visible sur fond clair
  highlight: "#FFE08A",  // Or chaud plus pop, lisible en plein soleil
};

// Option 3 — Fond cohérent (pas de noir pur), terre encore plus lisible, brightness boost
export const STYLE_GEO_AFRIQUE_V3 = {
  label: "GEO AFRIQUE V3",
  desc: "Fond océan cohérent · Terre parchemin clair · Luminosité boostée",
  water: "#0a3a6e",      // Bleu océan légèrement plus clair que V1 (cohérent avec bgcolor)
  land: "#6b4e2a",       // Parchemin clair, très lisible mobile/soleil
  border: "#b07840",     // Frontières or visible sur parchemin clair
  highlight: "#FFE08A",  // Or chaud — identique V2
};

// Option 4 — Or lumineux + masquage rivières + étoiles
export const STYLE_GEO_AFRIQUE_V4 = {
  label: "GEO AFRIQUE V4",
  desc: "Continents or · Océan abyssal · Étoiles",
  water: "#0a3060",      // Bleu profond océan
  land: "#c8963e",       // Or lumineux — très lisible mobile/soleil
  border: "#e8b86d",     // Frontières or clair, bien visible
  highlight: "#fff4a0",  // Jaune-or très clair pour le pays mis en avant
};

// V5 — Dark Grey éclairci : même structure que Mapbox Dark Grey mais tout boosté
// Espace gris-bleu foncé (pas noir), territoire gris clair, frontières blanches
export const STYLE_GEO_AFRIQUE_V5 = {
  label: "GEO AFRIQUE V5",
  desc: "Dark Grey éclairci · Espace visible · Frontières blanches",
  water: "#1a3a5c",      // Bleu-gris océan (éclairci vs abyssal)
  land: "#4a4a4a",       // Gris clair territoire — lisible mobile/soleil
  border: "#c8c8c8",     // Frontières blanches/claires comme Dark Grey natif
  highlight: "#FFD700",  // Or pur pour le pays mis en avant
  space: "#0d1b2a",      // Fond espace : bleu-gris foncé, pas noir pur
};

export const MapboxOceanColor: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox Ocean Color"));
  const [ready, setReady] = useState(false);

  // Quel preset actif ? Change toutes les 75 frames
  const presetIndex = Math.floor(frame / 75) % OCEAN_PRESETS.length;
  const preset = OCEAN_PRESETS[presetIndex];

  // Progression dans le preset courant (0→1 sur 75 frames)
  const localT = (frame % 75) / 75;
  const labelOpacity = interpolate(localT, [0, 0.08, 0.85, 1.0], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Mouvement caméra continu
  const camT = interpolate(frame, [0, MAPBOX_OCEAN_COLOR_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ease = camT < 0.5 ? 2 * camT * camT : -1 + (4 - 2 * camT) * camT;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [CAM_START.lon, CAM_START.lat],
      zoom: CAM_START.zoom,
      pitch: CAM_START.pitch,
      bearing: CAM_START.bearing,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      // Supprimer labels
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }

      // Appliquer le premier preset
      applyPreset(map, OCEAN_PRESETS[0]);

      // Ghana highlight
      if (!map.getLayer("ghana-fill")) map.addLayer({
        id: "ghana-fill",
        type: "fill",
        source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "fill-color": OCEAN_PRESETS[0].highlight, "fill-opacity": 0.7 },
      });
      if (!map.getLayer("ghana-border")) map.addLayer({
        id: "ghana-border",
        type: "line",
        source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "line-color": OCEAN_PRESETS[0].highlight, "line-width": 2, "line-opacity": 0.9 },
      });

      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle]);

  // Appliquer le preset courant à chaque changement
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    applyPreset(map, preset);
    // Mettre à jour la couleur du highlight Ghana
    if (map.getLayer("ghana-fill")) {
      map.setPaintProperty("ghana-fill", "fill-color", preset.highlight);
    }
    if (map.getLayer("ghana-border")) {
      map.setPaintProperty("ghana-border", "line-color", preset.highlight);
    }
  }, [presetIndex, ready, preset]);

  // Mouvement caméra continu
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.jumpTo({
      center: [
        CAM_START.lon + (CAM_END.lon - CAM_START.lon) * ease,
        CAM_START.lat + (CAM_END.lat - CAM_START.lat) * ease,
      ],
      zoom: CAM_START.zoom + (CAM_END.zoom - CAM_START.zoom) * ease,
      pitch: CAM_START.pitch + (CAM_END.pitch - CAM_START.pitch) * ease,
      bearing: CAM_START.bearing + (CAM_END.bearing - CAM_START.bearing) * ease,
    });
  }, [frame, ready, ease]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {/* Badge preset en haut à gauche */}
      {ready && (
        <div style={{
          position: "absolute",
          top: 40,
          left: 48,
          opacity: labelOpacity,
          pointerEvents: "none",
        }}>
          <div style={{
            backgroundColor: "rgba(0,0,0,0.85)",
            border: `2px solid ${preset.highlight}`,
            borderRadius: 8,
            padding: "10px 24px",
          }}>
            <div style={{
              fontSize: 10,
              fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}>
              STYLE MAPBOX — COULEUR OCÉAN
            </div>
            <div style={{
              fontSize: 22,
              fontWeight: 900,
              fontFamily: "Arial Black, sans-serif",
              color: preset.highlight,
              letterSpacing: "0.05em",
            }}>
              {preset.label}
            </div>
            <div style={{
              fontSize: 13,
              fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.55)",
              marginTop: 2,
            }}>
              {preset.desc}
            </div>
          </div>
        </div>
      )}

      {/* Indicateur preset — 4 points en bas */}
      {ready && (
        <div style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
          pointerEvents: "none",
        }}>
          {OCEAN_PRESETS.map((p, i) => (
            <div key={i} style={{
              width: i === presetIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === presetIndex ? p.highlight : "rgba(255,255,255,0.2)",
              transition: "none",
            }} />
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Helper — applique un preset de couleurs sur la carte
// ─────────────────────────────────────────────────────────────────────────────
// Composition style GéoAfrique — style signature fixe (Terre Terra + Océan Abyssal)
// ─────────────────────────────────────────────────────────────────────────────
export const MAPBOX_GEO_AFRIQUE_STYLE_FRAMES = 300;

export const MapboxGeoAfriqueStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox GeoAfrique Style"));
  const [ready, setReady] = useState(false);

  const s = STYLE_GEO_AFRIQUE;

  // Mouvement caméra : zoom depuis l'espace vers Afrique de l'Ouest
  const camT = interpolate(frame, [0, MAPBOX_GEO_AFRIQUE_STYLE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const ease = camT < 0.5 ? 2 * camT * camT : -1 + (4 - 2 * camT) * camT;
  const zoom  = 1.2 + ease * 1.8;  // 1.2 → 3.0
  const lat   = 20  - ease * 12;   // 20 → 8
  const lon   = 0   - ease * 3;    // 0 → -3
  const pitch = ease * 25;          // 0 → 25

  // Badge fade-in
  const badgeOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 20],
      zoom: 1.2,
      pitch: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      // Supprimer labels
      for (const layer of map.getStyle().layers ?? []) {
        if (layer.type === "symbol") map.setLayoutProperty(layer.id, "visibility", "none");
      }

      // Appliquer le style GéoAfrique
      applyPreset(map, s);

      // Ghana highlight
      if (!map.getLayer("gha-fill")) map.addLayer({
        id: "gha-fill",
        type: "fill",
        source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "fill-color": s.highlight, "fill-opacity": 0.75 },
      });
      if (!map.getLayer("gha-border")) map.addLayer({
        id: "gha-border",
        type: "line",
        source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "line-color": s.highlight, "line-width": 2.5, "line-opacity": 1 },
      });

      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle, s]);

  // Mouvement caméra frame par frame
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    mapRef.current.jumpTo({ center: [lon, lat], zoom, pitch, bearing: 0 });
  }, [frame, ready, lon, lat, zoom, pitch]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {ready && (
        <div style={{
          position: "absolute", top: 40, left: 48,
          opacity: badgeOpacity, pointerEvents: "none",
        }}>
          <div style={{
            backgroundColor: "rgba(0,0,0,0.82)",
            border: `2px solid ${s.highlight}`,
            borderRadius: 8,
            padding: "10px 24px",
          }}>
            <div style={{
              fontSize: 10, fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em",
              textTransform: "uppercase", marginBottom: 4,
            }}>
              STYLE SIGNATURE
            </div>
            <div style={{
              fontSize: 24, fontWeight: 900,
              fontFamily: "Arial Black, sans-serif",
              color: s.highlight, letterSpacing: "0.08em",
            }}>
              {s.label}
            </div>
            <div style={{
              fontSize: 13, fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.55)", marginTop: 2,
            }}>
              Terre Terra Incognita · Océan Abyssal Deep
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Composition verticale 9:16 — style GéoAfrique V3 (fond cohérent + brightness)
// ─────────────────────────────────────────────────────────────────────────────
export const MAPBOX_GEO_AFRIQUE_V3_FRAMES = 300;

export const MapboxGeoAfriqueV3: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox GeoAfrique V3"));
  const [ready, setReady] = useState(false);

  const s = STYLE_GEO_AFRIQUE_V3;

  const camT = interpolate(frame, [0, MAPBOX_GEO_AFRIQUE_V3_FRAMES], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const ease = camT < 0.5 ? 2 * camT * camT : -1 + (4 - 2 * camT) * camT;
  const zoom  = 1.4 + ease * 2.6;
  const lat   = 18  - ease * 10;
  const lon   = -1  - ease * 2;
  const pitch = ease * 30;

  const badgeOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-1, 18],
      zoom: 1.4,
      pitch: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      for (const layer of map.getStyle().layers ?? []) {
        if (layer.type === "symbol") map.setLayoutProperty(layer.id, "visibility", "none");
      }
      applyPreset(map, s);

      if (!map.getLayer("ghav3-fill")) map.addLayer({
        id: "ghav3-fill",
        type: "fill",
        source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "fill-color": s.highlight, "fill-opacity": 0.8 },
      });
      if (!map.getLayer("ghav3-border")) map.addLayer({
        id: "ghav3-border",
        type: "line",
        source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "line-color": s.highlight, "line-width": 3, "line-opacity": 1 },
      });

      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle, s]);

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    mapRef.current.jumpTo({ center: [lon, lat], zoom, pitch, bearing: 0 });
  }, [frame, ready, lon, lat, zoom, pitch]);

  return (
    <AbsoluteFill style={{ backgroundColor: s.water }}>
      <div
        ref={containerRef}
        style={{ width, height, position: "absolute", filter: "brightness(1.25)" }}
      />
      {ready && (
        <div style={{
          position: "absolute", top: 80, left: 40,
          opacity: badgeOpacity, pointerEvents: "none",
        }}>
          <div style={{
            backgroundColor: "rgba(0,0,0,0.65)",
            border: `2px solid ${s.highlight}`,
            borderRadius: 8,
            padding: "10px 24px",
          }}>
            <div style={{
              fontSize: 12, fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em",
              textTransform: "uppercase", marginBottom: 4,
            }}>
              STYLE SIGNATURE
            </div>
            <div style={{
              fontSize: 28, fontWeight: 900,
              fontFamily: "Arial Black, sans-serif",
              color: s.highlight, letterSpacing: "0.08em",
            }}>
              {s.label}
            </div>
            <div style={{
              fontSize: 14, fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.7)", marginTop: 2,
            }}>
              Fond cohérent · Luminosité +25%
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Composition verticale 9:16 — style GéoAfrique V2 (Option 2 : lisibilité mobile)
// ─────────────────────────────────────────────────────────────────────────────
export const MAPBOX_GEO_AFRIQUE_V2_FRAMES = 300;

export const MapboxGeoAfriqueV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox GeoAfrique V2"));
  const [ready, setReady] = useState(false);

  const s = STYLE_GEO_AFRIQUE_V2;

  // Mouvement caméra : zoom depuis l'espace vers Afrique de l'Ouest
  const camT = interpolate(frame, [0, MAPBOX_GEO_AFRIQUE_V2_FRAMES], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const ease = camT < 0.5 ? 2 * camT * camT : -1 + (4 - 2 * camT) * camT;
  const zoom  = 1.4 + ease * 2.6;  // 1.4 → 4.0 (zoom plus serré vertical 9:16)
  const lat   = 18  - ease * 10;   // 18 → 8
  const lon   = -1  - ease * 2;    // -1 → -3
  const pitch = ease * 30;          // 0 → 30

  // Badge fade-in
  const badgeOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-1, 18],
      zoom: 1.4,
      pitch: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      for (const layer of map.getStyle().layers ?? []) {
        if (layer.type === "symbol") map.setLayoutProperty(layer.id, "visibility", "none");
      }

      applyPreset(map, s);

      // Ghana highlight
      if (!map.getLayer("ghav2-fill")) map.addLayer({
        id: "ghav2-fill",
        type: "fill",
        source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "fill-color": s.highlight, "fill-opacity": 0.75 },
      });
      if (!map.getLayer("ghav2-border")) map.addLayer({
        id: "ghav2-border",
        type: "line",
        source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "line-color": s.highlight, "line-width": 2.5, "line-opacity": 1 },
      });

      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle, s]);

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    mapRef.current.jumpTo({ center: [lon, lat], zoom, pitch, bearing: 0 });
  }, [frame, ready, lon, lat, zoom, pitch]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {ready && (
        <div style={{
          position: "absolute", top: 80, left: 40,
          opacity: badgeOpacity, pointerEvents: "none",
        }}>
          <div style={{
            backgroundColor: "rgba(0,0,0,0.75)",
            border: `2px solid ${s.highlight}`,
            borderRadius: 8,
            padding: "10px 24px",
          }}>
            <div style={{
              fontSize: 12, fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em",
              textTransform: "uppercase", marginBottom: 4,
            }}>
              STYLE SIGNATURE
            </div>
            <div style={{
              fontSize: 28, fontWeight: 900,
              fontFamily: "Arial Black, sans-serif",
              color: s.highlight, letterSpacing: "0.08em",
            }}>
              {s.label}
            </div>
            <div style={{
              fontSize: 14, fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.65)", marginTop: 2,
            }}>
              Terre lisible · Océan Abyssal Deep
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Génère un tableau d'étoiles stable (seedé, pas random à chaque frame)
export const STARS = Array.from({ length: 280 }, (_, i) => {
  const a = Math.sin(i * 127.1) * 43758.5453;
  const b = Math.sin(i * 311.7) * 43758.5453;
  const c = Math.sin(i * 74.3) * 43758.5453;
  const r1 = a - Math.floor(a);
  const r2 = b - Math.floor(b);
  const r3 = c - Math.floor(c);
  return {
    x: r1 * 100,
    y: r2 * 100,
    size: 0.7 + r3 * 1.5,
    phase: Math.floor(r1 * 300),
    speed: 40 + Math.floor(r3 * 80),
  };
});

// Composant étoiles scintillantes (SVG pur, zero dépendance)
export const StarField: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();
  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      width={width}
      height={height}
    >
      {STARS.map((star, i) => {
        const t = ((frame + star.phase) % star.speed) / star.speed;
        const opacity = interpolate(
          Math.abs(t - 0.5) * 2,
          [0, 1],
          [0.9, 0.2],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <circle
            key={i}
            cx={star.x * width / 100}
            cy={star.y * height / 100}
            r={star.size}
            fill="#ffffff"
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Composition verticale 9:16 — style GéoAfrique V5
// Dark Grey éclairci — espace bleu-gris, territoire gris clair, frontières blanches
// Étoiles derrière la carte (z-index correct), brightness global +30%
// ─────────────────────────────────────────────────────────────────────────────
export const MAPBOX_GEO_AFRIQUE_V5_FRAMES = 300;

export const MapboxGeoAfriqueV5: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox GeoAfrique V5"));
  const [ready, setReady] = useState(false);

  const s = STYLE_GEO_AFRIQUE_V5;

  const camT = interpolate(frame, [0, MAPBOX_GEO_AFRIQUE_V5_FRAMES], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const ease = camT < 0.5 ? 2 * camT * camT : -1 + (4 - 2 * camT) * camT;
  const zoom  = 1.4 + ease * 2.6;
  const lat   = 18  - ease * 10;
  const lon   = -1  - ease * 2;
  const pitch = ease * 30;

  const badgeOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-1, 18],
      zoom: 1.4,
      pitch: 0,
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

      // Océan
      safe("water", "fill-color", s.water);
      safe("water-shadow", "fill-color", s.water);

      // Territoire — gris clair éclairci
      safe("land", "background-color", s.land);
      safe("landuse", "fill-color", s.land);
      safe("national-park", "fill-color", s.land);
      safe("landcover", "fill-color", s.land);

      // Frontières — blanc/clair comme Dark Grey natif
      safe("admin-0-boundary", "line-color", s.border);
      safe("admin-0-boundary-disputed", "line-color", s.border);
      safe("admin-1-boundary", "line-color", "rgba(180,180,180,0.3)");

      if (!map.getLayer("ghav5-fill")) map.addLayer({
        id: "ghav5-fill",
        type: "fill",
        source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "fill-color": s.highlight, "fill-opacity": 0.85 },
      });
      if (!map.getLayer("ghav5-border")) map.addLayer({
        id: "ghav5-border",
        type: "line",
        source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "line-color": s.highlight, "line-width": 3, "line-opacity": 1 },
      });

      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle, s]);

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    mapRef.current.jumpTo({ center: [lon, lat], zoom, pitch, bearing: 0 });
  }, [frame, ready, lon, lat, zoom, pitch]);

  return (
    // Fond espace : bleu-gris foncé — pas noir pur
    <AbsoluteFill style={{ backgroundColor: s.space }}>
      {/* Étoiles en z=0, derrière la carte Mapbox */}
      <div style={{ position: "absolute", top: 0, left: 0, width, height, zIndex: 0 }}>
        <StarField width={width} height={height} />
      </div>

      {/* Carte Mapbox en z=1, avec brightness +30% */}
      <div
        ref={containerRef}
        style={{
          width, height, position: "absolute",
          zIndex: 1,
          filter: "brightness(1.3)",
        }}
      />

      {/* Badge en z=2 */}
      {ready && (
        <div style={{
          position: "absolute", top: 80, left: 40,
          opacity: badgeOpacity, pointerEvents: "none",
          zIndex: 2,
        }}>
          <div style={{
            backgroundColor: "rgba(0,10,20,0.75)",
            border: `2px solid ${s.highlight}`,
            borderRadius: 8,
            padding: "10px 24px",
          }}>
            <div style={{
              fontSize: 12, fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em",
              textTransform: "uppercase", marginBottom: 4,
            }}>
              STYLE SIGNATURE
            </div>
            <div style={{
              fontSize: 28, fontWeight: 900,
              fontFamily: "Arial Black, sans-serif",
              color: s.highlight, letterSpacing: "0.08em",
            }}>
              {s.label}
            </div>
            <div style={{
              fontSize: 14, fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.7)", marginTop: 2,
            }}>
              Espace bleu-gris · Territoire clair · Frontières blanches
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Composition verticale 9:16 — style GéoAfrique V4
// Or lumineux + masquage rivières/lacs + étoiles scintillantes
// ─────────────────────────────────────────────────────────────────────────────
export const MAPBOX_GEO_AFRIQUE_V4_FRAMES = 300;

export const MapboxGeoAfriqueV4: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox GeoAfrique V4"));
  const [ready, setReady] = useState(false);

  const s = STYLE_GEO_AFRIQUE_V4;

  const camT = interpolate(frame, [0, MAPBOX_GEO_AFRIQUE_V4_FRAMES], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const ease = camT < 0.5 ? 2 * camT * camT : -1 + (4 - 2 * camT) * camT;
  const zoom  = 1.4 + ease * 2.6;
  const lat   = 18  - ease * 10;
  const lon   = -1  - ease * 2;
  const pitch = ease * 30;

  const badgeOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-1, 18],
      zoom: 1.4,
      pitch: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 300,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        // Masquer labels
        if (layer.type === "symbol") map.setLayoutProperty(layer.id, "visibility", "none");
        // Masquer rivières, lacs, zones humides
        if (
          layer.id.includes("water") && layer.id !== "water" ||
          layer.id.includes("waterway") ||
          layer.id.includes("wetland")
        ) {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }

      applyPreset(map, s);

      // Colorer aussi les lacs intérieurs comme la terre (pas en bleu)
      const safe = (id: string, prop: string, val: unknown) => {
        try { if (map.getLayer(id)) map.setPaintProperty(id, prop, val); } catch {}
      };
      safe("water", "fill-color", s.water);

      if (!map.getLayer("ghav4-fill")) map.addLayer({
        id: "ghav4-fill",
        type: "fill",
        source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "fill-color": s.highlight, "fill-opacity": 0.85 },
      });
      if (!map.getLayer("ghav4-border")) map.addLayer({
        id: "ghav4-border",
        type: "line",
        source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "line-color": s.highlight, "line-width": 3, "line-opacity": 1 },
      });

      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle, s]);

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    mapRef.current.jumpTo({ center: [lon, lat], zoom, pitch, bearing: 0 });
  }, [frame, ready, lon, lat, zoom, pitch]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000005" }}>
      {/* Étoiles derrière la carte */}
      <StarField width={width} height={height} />

      {/* Carte Mapbox */}
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {/* Badge */}
      {ready && (
        <div style={{
          position: "absolute", top: 80, left: 40,
          opacity: badgeOpacity, pointerEvents: "none",
        }}>
          <div style={{
            backgroundColor: "rgba(0,0,10,0.72)",
            border: `2px solid ${s.highlight}`,
            borderRadius: 8,
            padding: "10px 24px",
          }}>
            <div style={{
              fontSize: 12, fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em",
              textTransform: "uppercase", marginBottom: 4,
            }}>
              STYLE SIGNATURE
            </div>
            <div style={{
              fontSize: 28, fontWeight: 900,
              fontFamily: "Arial Black, sans-serif",
              color: s.highlight, letterSpacing: "0.08em",
            }}>
              {s.label}
            </div>
            <div style={{
              fontSize: 14, fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.7)", marginTop: 2,
            }}>
              Or lumineux · Étoiles · Rivières masquées
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

function applyPreset(map: mapboxgl.Map, preset: typeof OCEAN_PRESETS[0]) {
  const safe = (layer: string, prop: string, value: unknown) => {
    try {
      if (map.getLayer(layer)) map.setPaintProperty(layer, prop, value);
    } catch {}
  };

  // Océan / eau
  safe("water", "fill-color", preset.water);
  safe("water-shadow", "fill-color", preset.water);

  // Terre / continents
  safe("land", "background-color", preset.land);
  safe("landuse", "fill-color", preset.land);
  safe("national-park", "fill-color", preset.land);
  safe("landcover", "fill-color", preset.land);

  // Frontières
  safe("admin-0-boundary", "line-color", preset.border);
  safe("admin-0-boundary-disputed", "line-color", preset.border);
  safe("admin-1-boundary", "line-color", preset.border);
  safe("country-label", "text-color", "rgba(255,255,255,0.5)");
}
