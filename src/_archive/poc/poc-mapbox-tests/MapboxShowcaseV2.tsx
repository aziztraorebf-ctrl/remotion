import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide, removeLabels, type CamState } from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const MAPBOX_SHOWCASE_V2_FRAMES = 720; // 24s @ 30fps — 4 segments x 6s

const SEG = {
  FLAG:     { start: 0,   end: 180, label: "DRAPEAU PROJETÉ",    desc: "Bandes drapeau teignent le relief satellite" },
  SOLDIERS: { start: 180, end: 360, label: "SOLDATS FRONTIÈRE",  desc: "Médaillons soldats le long de la frontière" },
  WORLDMAP: { start: 360, end: 540, label: "CARTE MONDE PLATE",  desc: "Natural Earth posée sur table quadrillée" },
  LANDMARK: { start: 540, end: 720, label: "PHOTO + LANDMARK",   desc: "Photo réelle + popup + modèle posé sur carte" },
};

const CAM_FRANCE:  CamState = { lon: 2.2,   lat: 46.5,  zoom: 4.8, pitch: 0,  bearing: 0 };
const CAM_SAHEL:   CamState = { lon: 70.0,  lat: 28.0,  zoom: 4.5, pitch: 40, bearing: 0 };
const CAM_ACCRA:   CamState = { lon: -0.187, lat: 5.603, zoom: 13.0, pitch: 50, bearing: 10 };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const Badge: React.FC<{ label: string; desc: string; opacity: number }> = ({ label, desc, opacity }) => (
  <div style={{ position: "absolute", top: 60, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity, pointerEvents: "none", zIndex: 20 }}>
    <div style={{ background: "rgba(10,8,4,0.88)", padding: "7px 28px", borderRadius: 4, fontFamily: "Georgia, serif", fontSize: 13, letterSpacing: 3, color: "#D4AF37", fontWeight: 700, border: "1px solid rgba(212,175,55,0.3)" }}>{label}</div>
    <div style={{ fontFamily: "Georgia, serif", fontSize: 9, letterSpacing: 1.5, color: "#888" }}>{desc}</div>
  </div>
);

// ---------------------------------------------------------------------------
// SEG 1 — Drapeau projeté sur relief satellite (technique D3-Geo clipPath SVG)
// Bandes verticales colorées clippées par la forme du pays en SVG
// Le style satellite transparaît sous les couleurs semi-transparentes
// ---------------------------------------------------------------------------

// Ghana — bandes verticales drapeau (rouge, or, vert) en projection Mercator simplifiée
// Coordonnées bbox Ghana : lon -3.26 → 1.19, lat 4.74 → 11.17
const GHANA_BBOX = { minLon: -3.26, maxLon: 1.19, minLat: 4.74, maxLat: 11.17 };
const GHANA_BANDS = ["#CE1126", "#FCD116", "#006B3F"]; // Rouge, Or, Vert — drapeau Ghana

const FlagProjected: React.FC<{
  map: mapboxgl.Map | null;
  frame: number;
  ready: boolean;
  width: number;
  height: number;
}> = ({ map, frame, ready, width, height }) => {
  const relFrame = frame - SEG.FLAG.start;
  const [proj, setProj] = useState<{ tl: mapboxgl.Point; br: mapboxgl.Point } | null>(null);

  useEffect(() => {
    if (!map || !ready) return;

    // Source + layer pays Ghana — style satellite (le relief transparaît)
    const COUNTRY_SOURCE = "mapbox-country-boundaries-flag";
    if (!map.getSource(COUNTRY_SOURCE)) {
      map.addSource(COUNTRY_SOURCE, { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
    }

    // Layer clip transparent pour définir la forme — les bandes SVG s'en occupent
    ["flag-fill-gha", "flag-border-gha"].forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    map.addLayer({
      id: "flag-fill-gha",
      type: "fill",
      source: COUNTRY_SOURCE,
      "source-layer": "country_boundaries",
      filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
      paint: { "fill-color": "#ffffff", "fill-opacity": 0 },
    });
    map.addLayer({
      id: "flag-border-gha",
      type: "line",
      source: COUNTRY_SOURCE,
      "source-layer": "country_boundaries",
      filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
      paint: { "line-color": "#ffffff", "line-width": 2, "line-opacity": 0.8 },
    });

    const updateProj = () => {
      const tl = map.project([GHANA_BBOX.minLon, GHANA_BBOX.maxLat]);
      const br = map.project([GHANA_BBOX.maxLon, GHANA_BBOX.minLat]);
      setProj({ tl, br });
    };
    updateProj();
    map.on("render", updateProj);
    return () => {
      map.off("render", updateProj);
      ["flag-fill-gha", "flag-border-gha"].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
    };
  }, [map, ready]);

  const globalOp = interpolate(relFrame, [0, 20, 155, 175], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const bandsOp = interpolate(relFrame, [15, 50], [0, 0.55], { extrapolateRight: "clamp" });
  const labelOp = interpolate(relFrame, [60, 90], [0, 1], { extrapolateRight: "clamp" });

  if (!proj) return null;

  const bw = proj.br.x - proj.tl.x;
  const bh = proj.br.y - proj.tl.y;
  const bandW = bw / 3;

  // Clip polygon approximatif Ghana en coordonnées écran (bbox rectangulaire)
  // Pour un clip exact il faudrait le GeoJSON — ici on utilise le fill Mapbox transparent
  // et on overlay les bandes SVG sur la bbox, ce qui donne l'effet teinture sans déborder visuellement

  return (
    <div style={{ position: "absolute", inset: 0, opacity: globalOp, pointerEvents: "none" }}>
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={width} height={height}>
        <defs>
          <clipPath id="ghana-bbox-clip">
            <rect x={proj.tl.x} y={proj.tl.y} width={bw} height={bh} />
          </clipPath>
        </defs>
        {/* 3 bandes verticales semi-transparentes sur la bbox Ghana */}
        {GHANA_BANDS.map((color, i) => (
          <rect
            key={i}
            x={proj.tl.x + i * bandW}
            y={proj.tl.y}
            width={bandW}
            height={bh}
            fill={color}
            opacity={bandsOp}
            clipPath="url(#ghana-bbox-clip)"
          />
        ))}
        {/* Contour blanc */}
        <rect
          x={proj.tl.x} y={proj.tl.y} width={bw} height={bh}
          fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={1.5}
          clipPath="url(#ghana-bbox-clip)"
        />
      </svg>

      {/* Label */}
      <div style={{
        position: "absolute",
        left: proj.tl.x + bw / 2,
        top: proj.tl.y - 40,
        transform: "translateX(-50%)",
        opacity: labelOp,
        fontFamily: "Georgia, serif", fontSize: 12, letterSpacing: 3,
        color: "#FCD116", fontWeight: 700,
        textShadow: "0 1px 4px rgba(0,0,0,0.8)",
      }}>
        GHANA
      </div>

      {/* Mini drapeau légende */}
      <div style={{
        position: "absolute", bottom: 200, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 0, opacity: labelOp,
        border: "1px solid rgba(255,255,255,0.4)", borderRadius: 2, overflow: "hidden",
      }}>
        {GHANA_BANDS.map((c, i) => (
          <div key={i} style={{ width: 24, height: 16, background: c }} />
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// SEG 2 — Soldats en médaillons le long d'une frontière (Inde/Pakistan style)
// Style satellite outdoors, médaillons avec illustration soldat flat design
// Placés le long de la frontière Ghana/Côte d'Ivoire
// ---------------------------------------------------------------------------

// Points le long de la frontière Ghana ouest (lon ~-3.1, lat 4.7→10.5)
const BORDER_POINTS: [number, number][] = [
  [-3.05, 5.2], [-2.95, 6.0], [-3.00, 6.8], [-2.90, 7.6],
  [-2.85, 8.3], [-2.80, 9.0], [-2.75, 9.7], [-2.70, 10.3],
];

const SoldatsMedaillons: React.FC<{
  map: mapboxgl.Map | null;
  frame: number;
  ready: boolean;
  width: number;
  height: number;
}> = ({ map, frame, ready, width, height }) => {
  const relFrame = frame - SEG.SOLDIERS.start;
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    if (!map || !ready) return;

    const COUNTRY_SOURCE = "mapbox-country-boundaries-sol";
    if (!map.getSource(COUNTRY_SOURCE)) {
      map.addSource(COUNTRY_SOURCE, { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
    }

    // Ghana en vert semi-transparent
    ["sol-fill-gha", "sol-border-gha", "sol-fill-civ", "sol-border-civ"].forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    map.addLayer({ id: "sol-fill-gha",   type: "fill", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"], paint: { "fill-color": "#4a7c3f", "fill-opacity": 0.5 } });
    map.addLayer({ id: "sol-border-gha", type: "line", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"], paint: { "line-color": "#CE1126", "line-width": 2.5, "line-opacity": 0.9 } });
    map.addLayer({ id: "sol-fill-civ",   type: "fill", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], "CIV"], paint: { "fill-color": "#c8922a", "fill-opacity": 0.45 } });
    map.addLayer({ id: "sol-border-civ", type: "line", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], "CIV"], paint: { "line-color": "#FCD116", "line-width": 2, "line-opacity": 0.8 } });

    const updatePos = () => {
      setPositions(BORDER_POINTS.map(([lon, lat]) => {
        const p = map.project([lon, lat]);
        return { x: p.x, y: p.y };
      }));
    };
    updatePos();
    map.on("render", updatePos);
    return () => {
      map.off("render", updatePos);
      ["sol-fill-gha", "sol-border-gha", "sol-fill-civ", "sol-border-civ"].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
    };
  }, [map, ready]);

  const globalOp = interpolate(relFrame, [0, 20, 155, 175], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, opacity: globalOp, pointerEvents: "none" }}>
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={width} height={height}>
        <defs>
          {positions.map((_, i) => (
            <clipPath key={i} id={`soldier-clip-${i}`}>
              <circle cx={0} cy={0} r={26} />
            </clipPath>
          ))}
        </defs>
        {positions.map((pos, i) => {
          const delay = i * 12;
          const appear = interpolate(relFrame, [delay, delay + 20], [0, 1], { extrapolateRight: "clamp" });
          const r = 28 * appear;
          // Alternance couleurs Ghana (vert/jaune) et Côte d'Ivoire (orange)
          const borderColor = i % 2 === 0 ? "#FCD116" : "#4a7c3f";

          return (
            <g key={i} transform={`translate(${pos.x}, ${pos.y})`} opacity={appear}>
              {/* Fond cercle sombre */}
              <circle r={r} fill="#1a2a1a" stroke={borderColor} strokeWidth={2.5} />
              {/* Portrait soldat clippé en cercle */}
              <image
                href={staticFile("poc-mapbox-tests/soldat-flat-nobg.png")}
                x={-r * 0.85} y={-r * 0.85}
                width={r * 1.7} height={r * 1.7}
                clipPath={`url(#soldier-clip-${i})`}
                preserveAspectRatio="xMidYMid slice"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// SEG 3 — Carte monde plate sur table quadrillée (zéro Mapbox)
// Reproduction fidèle de l'image référence : fond grille bleu-gris foncé,
// carte posée légèrement inclinée comme une feuille sur une table
// ---------------------------------------------------------------------------
const CarteMondePlate: React.FC<{ frame: number; width: number; height: number }> = ({ frame, width, height }) => {
  const relFrame = frame - SEG.WORLDMAP.start;
  const total = SEG.WORLDMAP.end - SEG.WORLDMAP.start;
  const t = clamp(relFrame / total, 0, 1);

  const globalOp = interpolate(relFrame, [0, 25, total - 25, total], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  // Ken Burns : la carte s'approche lentement
  const scale = interpolate(t, [0, 1], [0.92, 1.05], { extrapolateRight: "clamp" });
  // Légère rotation initiale qui se stabilise
  const rotate = interpolate(t, [0, 0.3, 1], [-4, -2, -2], { extrapolateRight: "clamp" });

  const GRID_COLOR = "#1e2d3d";
  const BG_COLOR = "#16242f";

  return (
    <div style={{ position: "absolute", inset: 0, background: BG_COLOR, opacity: globalOp }}>
      {/* Grille quadrillée style table de travail */}
      <svg style={{ position: "absolute", inset: 0 }} width={width} height={height}>
        <rect width={width} height={height} fill={BG_COLOR} />
        {/* Grandes cases */}
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`gh${i}`} x1={0} y1={i * height / 13} x2={width} y2={i * height / 13} stroke={GRID_COLOR} strokeWidth={1} />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`gv${i}`} x1={i * width / 8} y1={0} x2={i * width / 8} y2={height} stroke={GRID_COLOR} strokeWidth={1} />
        ))}
        {/* Sous-grille fine */}
        {Array.from({ length: 52 }, (_, i) => (
          <line key={`sgh${i}`} x1={0} y1={i * height / 52} x2={width} y2={i * height / 52} stroke={GRID_COLOR} strokeWidth={0.3} opacity={0.5} />
        ))}
        {Array.from({ length: 32 }, (_, i) => (
          <line key={`sgv${i}`} x1={i * width / 32} y1={0} x2={i * width / 32} y2={height} stroke={GRID_COLOR} strokeWidth={0.3} opacity={0.5} />
        ))}
      </svg>

      {/* La carte posée sur la table */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: "center center",
        width: width * 0.88,
      }}>
        {/* Ombre portée style feuille posée */}
        <div style={{
          position: "absolute",
          inset: -8,
          background: "transparent",
          boxShadow: "6px 8px 30px rgba(0,0,0,0.6), 2px 3px 10px rgba(0,0,0,0.4)",
          borderRadius: 2,
        }} />
        {/* Bordure blanche fine */}
        <div style={{
          position: "absolute", inset: 0,
          border: "3px solid rgba(255,255,255,0.85)",
          borderRadius: 1,
          zIndex: 2,
          pointerEvents: "none",
        }} />
        <img
          src={staticFile("poc-mapbox-tests/world-map.jpg")}
          style={{
            width: "100%",
            display: "block",
            borderRadius: 1,
            filter: "saturate(0.55) brightness(0.75) contrast(1.1)",
          }}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// SEG 4 — Photo réelle + popup rectangulaire + bâtiment posé sur carte
// Style light/street Mapbox, popup avec photo + ligne de connexion
// Bâtiment PixelLab isométrique posé à la position géographique
// ---------------------------------------------------------------------------
const LandmarkPopup: React.FC<{
  map: mapboxgl.Map | null;
  frame: number;
  ready: boolean;
  width: number;
  height: number;
}> = ({ map, frame, ready, width, height }) => {
  const relFrame = frame - SEG.LANDMARK.start;
  const total = SEG.LANDMARK.end - SEG.LANDMARK.start;
  const [buildingPos, setBuildingPos] = useState<{ x: number; y: number } | null>(null);

  // Position de la Grande Mosquée de Djenné (Mali)
  const DJENNE_LON = -4.555;
  const DJENNE_LAT = 13.905;

  useEffect(() => {
    if (!map || !ready) return;
    const m = map;
    const updatePos = () => {
      const p = m.project([DJENNE_LON, DJENNE_LAT]);
      setBuildingPos({ x: p.x, y: p.y });
    };
    updatePos();
    m.on("render", updatePos);
    return () => { m.off("render", updatePos); };
  }, [map, ready]);

  const globalOp = interpolate(relFrame, [0, 20, total - 20, total], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const popupOp = interpolate(relFrame, [20, 55], [0, 1], { extrapolateRight: "clamp" });
  const buildingOp = interpolate(relFrame, [50, 85], [0, 1], { extrapolateRight: "clamp" });
  const buildingScale = interpolate(relFrame, [50, 90, total], [0.5, 1.0, 1.1], { extrapolateRight: "clamp" });

  // Popup position : centré en haut de l'écran
  const popupW = width * 0.75;
  const popupH = popupW * 0.55;
  const popupX = (width - popupW) / 2;
  const popupY = height * 0.18;
  // Ligne du bas du popup → position bâtiment
  const lineEndX = buildingPos?.x ?? width / 2;
  const lineEndY = buildingPos?.y ?? height * 0.6;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: globalOp, pointerEvents: "none" }}>
      {/* Ligne de connexion popup → bâtiment */}
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={width} height={height}>
        <line
          x1={popupX + popupW / 2}
          y1={popupY + popupH}
          x2={lineEndX}
          y2={lineEndY - 40}
          stroke="rgba(30,30,30,0.85)"
          strokeWidth={2}
          opacity={popupOp}
        />
      </svg>

      {/* Popup photo rectangulaire */}
      <div style={{
        position: "absolute",
        left: popupX,
        top: popupY,
        width: popupW,
        height: popupH,
        opacity: popupOp,
        border: "2px solid rgba(30,30,30,0.9)",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}>
        {/* Portrait roi utilisé comme landmark photo */}
        <img
          src={staticFile("poc-mapbox-tests/portrait-roi.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
        {/* Label sur la photo */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
          padding: "12px 12px 8px",
          fontFamily: "Georgia, serif", fontSize: 11, letterSpacing: 2,
          color: "#fff", fontWeight: 700,
        }}>
          GRANDE MOSQUÉE DE DJENNÉ
        </div>
      </div>

      {/* Bâtiment isométrique posé sur la carte */}
      {buildingPos && (
        <div style={{
          position: "absolute",
          left: buildingPos.x - 60,
          top: buildingPos.y - 80,
          width: 120,
          height: 120,
          opacity: buildingOp,
          transform: `scale(${buildingScale})`,
          transformOrigin: "bottom center",
          imageRendering: "pixelated",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))",
        }}>
          <img
            src={staticFile("poc-mapbox-tests/batiment-iso.png")}
            style={{ width: "100%", height: "100%", imageRendering: "pixelated" }}
          />
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Composition principale — 3 maps indépendantes (satellite, outdoors, light)
// Pattern prouvé de MapboxTransitions : une map par style, visibilité CSS
// Pas de setStyle() dynamique = zéro crash worker
// ---------------------------------------------------------------------------
export const MapboxShowcaseV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Map A — satellite (SEG 1 : drapeau)
  const mapSatRef = useRef<mapboxgl.Map | null>(null);
  const containerSatRef = useRef<HTMLDivElement>(null);
  const [handleSat] = useState(() => delayRender("showcase-sat"));
  const [readySat, setReadySat] = useState(false);

  // Map B — outdoors/relief (SEG 2 : soldats)
  const mapOutRef = useRef<mapboxgl.Map | null>(null);
  const containerOutRef = useRef<HTMLDivElement>(null);
  const [handleOut] = useState(() => delayRender("showcase-out"));
  const [readyOut, setReadyOut] = useState(false);

  // Map C — light (SEG 4 : landmark)
  const mapLightRef = useRef<mapboxgl.Map | null>(null);
  const containerLightRef = useRef<HTMLDivElement>(null);
  const [handleLight] = useState(() => delayRender("showcase-light"));
  const [readyLight, setReadyLight] = useState(false);

  // Map satellite — SEG 1
  useEffect(() => {
    if (!containerSatRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerSatRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [CAM_FRANCE.lon, CAM_FRANCE.lat],
      zoom: CAM_FRANCE.zoom, pitch: CAM_FRANCE.pitch, bearing: CAM_FRANCE.bearing,
      interactive: false, preserveDrawingBuffer: true,
    });
    map.on("style.load", () => {
      mapSatRef.current = map;
      setReadySat(true);
      continueRender(handleSat);
    });
    return () => map.remove();
  }, []);

  // Map outdoors — SEG 2
  useEffect(() => {
    if (!containerOutRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerOutRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [CAM_SAHEL.lon, CAM_SAHEL.lat],
      zoom: CAM_SAHEL.zoom, pitch: CAM_SAHEL.pitch, bearing: CAM_SAHEL.bearing,
      interactive: false, preserveDrawingBuffer: true,
    });
    map.on("style.load", () => {
      removeLabels(map);
      mapOutRef.current = map;
      setReadyOut(true);
      continueRender(handleOut);
    });
    return () => map.remove();
  }, []);

  // Map light — SEG 4
  useEffect(() => {
    if (!containerLightRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerLightRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-4.555, 13.905],
      zoom: 12.5, pitch: 45, bearing: 0,
      interactive: false, preserveDrawingBuffer: true,
    });
    map.on("style.load", () => {
      removeLabels(map);
      mapLightRef.current = map;
      setReadyLight(true);
      continueRender(handleLight);
    });
    return () => map.remove();
  }, []);

  const currentSeg = frame < SEG.SOLDIERS.start ? SEG.FLAG
    : frame < SEG.WORLDMAP.start ? SEG.SOLDIERS
    : frame < SEG.LANDMARK.start ? SEG.WORLDMAP
    : SEG.LANDMARK;

  const badgeOp = interpolate(frame, [currentSeg.start, currentSeg.start + 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#16242f" }}>
      <MapboxBrandingHide />

      {/* Map satellite — SEG 1 (toujours monté, visibility CSS) */}
      <div ref={containerSatRef} style={{
        position: "absolute", inset: 0, width, height,
        opacity: frame < SEG.SOLDIERS.start ? 1 : 0,
        pointerEvents: "none",
      }} />

      {/* Map outdoors — SEG 2 */}
      <div ref={containerOutRef} style={{
        position: "absolute", inset: 0, width, height,
        opacity: frame >= SEG.SOLDIERS.start && frame < SEG.WORLDMAP.start ? 1 : 0,
        pointerEvents: "none",
      }} />

      {/* Map light — SEG 4 */}
      <div ref={containerLightRef} style={{
        position: "absolute", inset: 0, width, height,
        opacity: frame >= SEG.LANDMARK.start ? 1 : 0,
        pointerEvents: "none",
      }} />

      {/* SEG 1 — Drapeau projeté */}
      {frame < SEG.SOLDIERS.start && (
        <FlagProjected map={mapSatRef.current} frame={frame} ready={readySat} width={width} height={height} />
      )}

      {/* SEG 2 — Soldats frontière */}
      {frame >= SEG.SOLDIERS.start && frame < SEG.WORLDMAP.start && (
        <SoldatsMedaillons map={mapOutRef.current} frame={frame} ready={readyOut} width={width} height={height} />
      )}

      {/* SEG 3 — Carte monde plate (zéro Mapbox) */}
      {frame >= SEG.WORLDMAP.start && frame < SEG.LANDMARK.start && (
        <CarteMondePlate frame={frame} width={width} height={height} />
      )}

      {/* SEG 4 — Landmark popup */}
      {frame >= SEG.LANDMARK.start && (
        <LandmarkPopup map={mapLightRef.current} frame={frame} ready={readyLight} width={width} height={height} />
      )}

      <Badge label={currentSeg.label} desc={currentSeg.desc} opacity={badgeOp} />
    </AbsoluteFill>
  );
};
