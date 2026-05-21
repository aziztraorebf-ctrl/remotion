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
import { MapboxBrandingHide, removeLabels, type CamState } from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const MAPBOX_FLAG_PATTERNS_FRAMES = 750; // 25s @ 30fps

// 5 options x 5s chacune
const SEG = {
  A: { start: 0,   end: 150, label: "OPTION A — APLAT COULEUR",     desc: "Couleur narrative (or Ghana) — baseline" },
  B: { start: 150, end: 300, label: "OPTION B — OR SOURD UNIFIÉ",   desc: "Tous les pays même traitement doré sourd" },
  C: { start: 300, end: 450, label: "OPTION C — CARTOUCHE ÉDITORIAL", desc: "Pays neutre + cartouche drapeau SVG à côté" },
  D: { start: 450, end: 600, label: "OPTION D — GLOW FRONTIÈRES",   desc: "Pays neutre + glow lumineux sur les bords" },
  E: { start: 600, end: 750, label: "OPTION E — BANDE DRAPEAU",     desc: "Pays neutre + bande couleurs drapeau en bas" },
};

const CAM: CamState = { lon: -2.0, lat: 12.5, zoom: 3.8, pitch: 15, bearing: 0 };

const COUNTRIES = [
  { iso: "GHA", name: "GHANA",   lon: -1.023, lat:  7.947, color: "#D4AF37", flagColors: ["#006B3F", "#FCD116", "#CE1126"] },
  { iso: "MLI", name: "MALI",    lon: -2.000, lat: 17.571, color: "#C0923A", flagColors: ["#14B53A", "#FCD116", "#CE1126"] },
  { iso: "BFA", name: "BURKINA", lon: -1.562, lat: 12.364, color: "#B07830", flagColors: ["#EF2B2D", "#009A00"] },
  { iso: "NER", name: "NIGER",   lon:  8.082, lat: 17.608, color: "#A06820", flagColors: ["#E05206", "#FFFFFF", "#189C38"] },
  { iso: "SEN", name: "SÉNÉGAL", lon: -14.452, lat: 14.497, color: "#906010", flagColors: ["#00853F", "#FDEF42", "#E31B23"] },
];

const COUNTRY_SOURCE = "mapbox-country-boundaries";

const segOp = (frame: number, s: { start: number; end: number }) =>
  interpolate(frame, [s.start, s.start + 15, s.end - 15, s.end], [0, 1, 1, 0], { extrapolateRight: "clamp" });

const Badge: React.FC<{ label: string; desc: string; opacity: number }> = ({ label, desc, opacity }) => (
  <div style={{ position: "absolute", top: 50, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity, pointerEvents: "none", zIndex: 10 }}>
    <div style={{ background: "rgba(26,18,9,0.82)", padding: "6px 22px", borderRadius: 4, fontFamily: "Georgia, serif", fontSize: 12, letterSpacing: 2.5, color: "#D4AF37", fontWeight: 700 }}>{label}</div>
    <div style={{ fontFamily: "Georgia, serif", fontSize: 9, letterSpacing: 1.5, color: "#555" }}>{desc}</div>
  </div>
);

// Cartouche SVG drapeau inline pour un pays (Option C)
const CartoucheDrapeau: React.FC<{
  x: number; y: number; name: string; flagColors: string[]; opacity: number;
}> = ({ x, y, name, flagColors, opacity }) => {
  const w = 80, h = 44;
  const bandW = w / flagColors.length;
  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity}>
      {/* Rectangle fond */}
      <rect x={-w / 2 - 4} y={-h / 2 - 8} width={w + 8} height={h + 22} rx={3} fill="rgba(26,18,9,0.88)" stroke="#D4AF37" strokeWidth={1} />
      {/* Drapeau */}
      <clipPath id={`clip-${name}`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2} /></clipPath>
      <g clipPath={`url(#clip-${name})`}>
        {flagColors.map((c, i) => (
          <rect key={i} x={-w / 2 + i * bandW} y={-h / 2} width={bandW + 1} height={h} fill={c} />
        ))}
      </g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2} fill="none" stroke="#D4AF37" strokeWidth={1} />
      {/* Nom */}
      <text y={h / 2 + 12} textAnchor="middle" fill="#D4AF37" fontSize={9} fontFamily="Georgia, serif" fontWeight="700" letterSpacing={1.5}>{name}</text>
    </g>
  );
};

export const MapboxFlagPatterns: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-flag-patterns"));
  const [ready, setReady] = useState(false);
  const [mapTick, setMapTick] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM.lon, CAM.lat],
      zoom: CAM.zoom,
      pitch: CAM.pitch,
      bearing: CAM.bearing,
      interactive: false,
      preserveDrawingBuffer: true,
    });
    map.on("style.load", () => {
      removeLabels(map);
      mapRef.current = map;
      setReady(true);
      continueRender(handle);
    });
    map.on("render", () => setMapTick((t) => t + 1));
    return () => map.remove();
  }, []);

  // Mise a jour layers selon option active
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    // Nettoyer tous les layers existants
    COUNTRIES.forEach(({ iso }) => {
      [`fill-${iso}`, `border-${iso}`, `glow-${iso}`].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
    });
    if (!map.getSource(COUNTRY_SOURCE)) {
      map.addSource(COUNTRY_SOURCE, { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
    }

    if (frame < SEG.B.start) {
      // Option A — aplat couleur narratif
      COUNTRIES.forEach(({ iso, color }) => {
        map.addLayer({ id: `fill-${iso}`, type: "fill", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], iso], paint: { "fill-color": color, "fill-opacity": 0.65 } });
        map.addLayer({ id: `border-${iso}`, type: "line", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], iso], paint: { "line-color": color, "line-width": 2, "line-opacity": 0.9 } });
      });
    } else if (frame < SEG.C.start) {
      // Option B — or sourd unifié
      COUNTRIES.forEach(({ iso }) => {
        map.addLayer({ id: `fill-${iso}`, type: "fill", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], iso], paint: { "fill-color": "#C4A35A", "fill-opacity": 0.4 } });
        map.addLayer({ id: `border-${iso}`, type: "line", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], iso], paint: { "line-color": "#D4AF37", "line-width": 1.5, "line-opacity": 0.7 } });
      });
    } else if (frame < SEG.D.start) {
      // Option C — pays neutre, cartouches SVG dehors (layers minimes)
      COUNTRIES.forEach(({ iso }) => {
        map.addLayer({ id: `fill-${iso}`, type: "fill", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], iso], paint: { "fill-color": "#b8a870", "fill-opacity": 0.3 } });
        map.addLayer({ id: `border-${iso}`, type: "line", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], iso], paint: { "line-color": "#888", "line-width": 1, "line-opacity": 0.5 } });
      });
    } else if (frame < SEG.E.start) {
      // Option D — pays neutre + glow frontières
      COUNTRIES.forEach(({ iso, color }) => {
        map.addLayer({ id: `fill-${iso}`, type: "fill", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], iso], paint: { "fill-color": "#b8a870", "fill-opacity": 0.2 } });
        map.addLayer({ id: `glow-${iso}`, type: "line", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], iso], paint: { "line-color": color, "line-width": 6, "line-opacity": 0.25, "line-blur": 4 } });
        map.addLayer({ id: `border-${iso}`, type: "line", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], iso], paint: { "line-color": color, "line-width": 1.5, "line-opacity": 0.85 } });
      });
    } else {
      // Option E — pays neutre + bande couleur drapeau en bas (SVG overlay)
      COUNTRIES.forEach(({ iso }) => {
        map.addLayer({ id: `fill-${iso}`, type: "fill", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], iso], paint: { "fill-color": "#b8a870", "fill-opacity": 0.25 } });
        map.addLayer({ id: `border-${iso}`, type: "line", source: COUNTRY_SOURCE, "source-layer": "country_boundaries", filter: ["==", ["get", "iso_3166_1_alpha_3"], iso], paint: { "line-color": "#888", "line-width": 1, "line-opacity": 0.5 } });
      });
    }
  }, [ready, Math.floor(frame / 150)]);

  // Projections centres pays pour overlays SVG
  const centers = COUNTRIES.map(({ lon, lat }) => {
    if (!mapRef.current) return null;
    const p = mapRef.current.project([lon, lat]);
    return { x: p.x, y: p.y };
  });

  const currentSeg = frame < SEG.B.start ? SEG.A : frame < SEG.C.start ? SEG.B : frame < SEG.D.start ? SEG.C : frame < SEG.E.start ? SEG.D : SEG.E;
  const badgeOp = interpolate(frame, [currentSeg.start, currentSeg.start + 15], [0, 1], { extrapolateRight: "clamp" });
  const optionOp = segOp(frame, currentSeg);

  return (
    <AbsoluteFill style={{ background: "#e8e4dc" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />

      {/* Option C — cartouches SVG */}
      {ready && frame >= SEG.C.start && frame < SEG.C.end && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }} width={width} height={height}>
          {COUNTRIES.map((c, i) => {
            const pos = centers[i];
            if (!pos) return null;
            return (
              <CartoucheDrapeau key={c.iso}
                x={pos.x + 30} y={pos.y - 30}
                name={c.name} flagColors={c.flagColors}
                opacity={optionOp}
              />
            );
          })}
        </svg>
      )}

      {/* Option E — bandes drapeau SVG sous chaque pays */}
      {ready && frame >= SEG.E.start && frame < SEG.E.end && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }} width={width} height={height}>
          {COUNTRIES.map((c, i) => {
            const pos = centers[i];
            if (!pos) return null;
            const bw = 50;
            const bh = 8;
            const bandW = bw / c.flagColors.length;
            return (
              <g key={c.iso} transform={`translate(${pos.x - bw / 2}, ${pos.y + 12})`} opacity={optionOp}>
                <clipPath id={`band-clip-${c.iso}`}><rect width={bw} height={bh} rx={2} /></clipPath>
                <g clipPath={`url(#band-clip-${c.iso})`}>
                  {c.flagColors.map((col, j) => (
                    <rect key={j} x={j * bandW} y={0} width={bandW + 1} height={bh} fill={col} />
                  ))}
                </g>
                <rect width={bw} height={bh} rx={2} fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth={0.5} />
                <text x={bw / 2} y={bh + 12} textAnchor="middle" fill="#333" fontSize={9} fontFamily="Georgia, serif" fontWeight="700" letterSpacing={1}>{c.name}</text>
              </g>
            );
          })}
        </svg>
      )}

      <Badge label={currentSeg.label} desc={currentSeg.desc} opacity={badgeOp} />
    </AbsoluteFill>
  );
};
