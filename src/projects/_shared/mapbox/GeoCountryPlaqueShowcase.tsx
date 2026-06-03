// GeoCountryPlaqueShowcase.tsx — démo du pattern Or Africain généralisé
// Montre : caméra approche pays (pitch 32) + GeoCountryPlaque (nom+stat+source)
// + GeoProgressCounter (X/N) + GeoClimaxOverlay final. Pour validation Aziz.

import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  applyGeoAfriqueV5,
  MapboxBrandingHide,
  MAPBOX_STYLES,
  lerpCam,
  camCountryApproach,
  CAM_MULTI_PULLBACK_DEFAULTS,
  CamState,
} from "./MapboxBase";
import { GeoCountryPlaque, GeoProgressCounter, GeoClimaxOverlay } from "./GeoCountryPlaque";
import { countryFilter } from "./flagCanvas";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const NAVY = "#16213a";
const GOLD = "#c8a951";

// 4 pays type "Or Africain" — chacun avec nom + stat + source
const COUNTRIES = [
  { iso: "GHA", name: "GHANA",        center: [-1.0, 7.95] as [number, number], color: "#f5d547", stat: "5% → 12%",          source: "ROYALTIES — Mines Act 2024",          appearAt: 0   },
  { iso: "MLI", name: "MALI",         center: [-3.5, 17.5] as [number, number], color: "#e89b3c", stat: "$430M",             source: "saisis à Barrick — Bloomberg, nov. 2025", appearAt: 90  },
  { iso: "BFA", name: "BURKINA FASO", center: [-1.5, 12.5] as [number, number], color: "#c47a28", stat: "Code minier révisé", source: "Loi 016-2024/ALT, juillet 2024",     appearAt: 180 },
  { iso: "NER", name: "NIGER",        center: [8.0, 17.0]  as [number, number], color: "#d4872a", stat: "100% nationalisé",   source: "Mine Somaïr (uranium) — Décret 2024", appearAt: 270 },
];

const CLIMAX_AT = 360;
const DURATION  = 480;

function getCam(frame: number): CamState {
  // Approche pays par pays (pitch 32), puis pull back au climax
  const segs = COUNTRIES.map((c, i) => ({
    start: c.appearAt,
    end: i < COUNTRIES.length - 1 ? COUNTRIES[i + 1].appearAt : CLIMAX_AT,
    cam: camCountryApproach(c.center, { bearing: i % 2 === 0 ? 5 : -8 }),
  }));

  if (frame >= CLIMAX_AT) {
    const last = segs[segs.length - 1].cam;
    const pull: CamState = { lon: 0, lat: 13, ...CAM_MULTI_PULLBACK_DEFAULTS };
    const t = (frame - CLIMAX_AT) / (DURATION - CLIMAX_AT);
    return lerpCam(last, pull, t);
  }

  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (frame >= s.start && frame < s.end) {
      const prev = i > 0 ? segs[i - 1].cam : s.cam;
      const t = (frame - s.start) / Math.max(1, s.end - s.start);
      return lerpCam(prev, s.cam, Math.min(1, t * 1.5));
    }
  }
  return segs[0].cam;
}

export const GeoCountryPlaqueShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("GeoCountryPlaqueShowcase"));
  const setupRef = useRef(false);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const cam0 = getCam(0);
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [cam0.lon, cam0.lat], zoom: cam0.zoom, pitch: cam0.pitch, bearing: cam0.bearing,
      interactive: false, attributionControl: false, fadeDuration: 0, preserveDrawingBuffer: true,
    });
    mapRef.current = map;
    map.on("style.load", () => {
      try {
        (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
        applyGeoAfriqueV5(map);
        if (!map.getSource("cb")) map.addSource("cb", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
        for (const c of COUNTRIES) {
          if (!map.getLayer(`gcp-fill-${c.iso}`)) {
            map.addLayer({ id: `gcp-fill-${c.iso}`, type: "fill", source: "cb", "source-layer": "country_boundaries",
              filter: countryFilter(c.iso), paint: { "fill-color": c.color, "fill-opacity": c.iso === "GHA" ? 0.8 : 0 } });
          }
          if (!map.getLayer(`gcp-border-${c.iso}`)) {
            map.addLayer({ id: `gcp-border-${c.iso}`, type: "line", source: "cb", "source-layer": "country_boundaries",
              filter: countryFilter(c.iso), paint: { "line-color": c.color, "line-width": 3, "line-opacity": c.iso === "GHA" ? 1 : 0 } });
          }
        }
        setupRef.current = true;
        continueRender(handle);
      } catch { continueRender(handle); }
    });
    return () => { map.remove(); mapRef.current = null; setupRef.current = false; };
  }, [handle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const cam = getCam(frame);
    map.jumpTo({ center: [cam.lon, cam.lat], zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing });
    if (!setupRef.current) return;
    const safe = (id: string, p: string, v: unknown) => { try { if (map.getLayer(id)) (map.setPaintProperty as (a: string, b: string, c: unknown) => void)(id, p, v); } catch {} };
    const proj: Record<string, { x: number; y: number }> = {};
    for (const c of COUNTRIES) {
      const visible = frame >= c.appearAt;
      const fadeIn = Math.min(1, (frame - c.appearAt) / 14);
      safe(`gcp-fill-${c.iso}`, "fill-opacity", c.iso === "GHA" ? 0.8 : (visible ? fadeIn * 0.75 : 0));
      safe(`gcp-border-${c.iso}`, "line-opacity", c.iso === "GHA" ? 1 : (visible ? fadeIn : 0));
      try { const p = map.project(c.center); proj[c.iso] = { x: p.x, y: p.y }; } catch {}
    }
    setPositions(proj);
  });

  // Compteur de pays qui ont "parlé"
  const visibleCount = COUNTRIES.filter(c => frame >= c.appearAt).length;

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {/* Plaques pays — mode "top" centré (comme Or Africain) */}
      {COUNTRIES.filter(c => c.iso !== "GHA").map((c, i) => {
        const next = i + 1 < COUNTRIES.length - 1 ? COUNTRIES.filter(x => x.iso !== "GHA")[i + 1].appearAt : CLIMAX_AT;
        return (
          <GeoCountryPlaque
            key={c.iso}
            frame={frame}
            name={c.name}
            color={c.color}
            stat={c.stat}
            source={c.source}
            appearAt={c.appearAt}
            hideAt={next}
            pos={null}
          />
        );
      })}

      {/* Compteur X / 4 */}
      {frame < CLIMAX_AT && (
        <GeoProgressCounter frame={frame} current={visibleCount} total={4} label="PAYS QUI SE LÈVENT" />
      )}

      {/* Climax */}
      <GeoClimaxOverlay frame={frame} line1="4 PAYS." line2="UN MÊME SIGNAL." appearAt={CLIMAX_AT} line2At={CLIMAX_AT + 33} />
    </AbsoluteFill>
  );
};

export const GEO_COUNTRY_PLAQUE_SHOWCASE_FRAMES = DURATION;
