import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "../../_shared/mapbox/MapboxBase";

// ─────────────────────────────────────────────────────────────────────────────
// L'Anomalie Montréal — POC interne portabilité du système Souverain
// vers contexte canadien/québécois (sujet immobilier).
//
// Audio : 71.76s, voix GéoAfrique V2 (réutilisée — POC interne, pas publié)
// Format : 1920×1080
// Test : provinces canadiennes via mapbox.country-boundaries-v1 (iso_3166_2)
//        + odomètre années + line dasharray flux migratoires
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const F = {
  A1_START: 0,     //  0.00s  Hook global Paris/Londres/NY
  A2_START: 580,   // 19.32s  Whip Atlantic → Toronto/Vancouver
  A3_START: 980,   // 32.68s  Pull back + Montréal anomalie + odomètre
  A4_START: 1514,  // 50.48s  Drift est→ouest + flux dasharray
  A5_START: 1930,  // 64.32s  Closing
  END:      2152,  // 71.76s
};

export const ANOMALIE_MONTREAL_FRAMES = F.END;

// ── Coordonnées MCP-vérifiées ────────────────────────────────────────────────
const LOC = {
  paris:     [2.348, 48.853]    as [number, number],
  london:    [-0.128, 51.507]   as [number, number],
  nyc:       [-74.006, 40.713]  as [number, number],
  toronto:   [-79.384, 43.648]  as [number, number],
  vancouver: [-123.115, 49.261] as [number, number],
  montreal:  [-73.573, 45.503]  as [number, number],
  calgary:   [-114.068, 51.046] as [number, number],
  edmonton:  [-113.494, 53.543] as [number, number],
  // Centres de cadrage
  northAtlantic: [-30.0, 50.0]  as [number, number],
  canadaCentre:  [-95.0, 55.0]  as [number, number],
  canadaEast:    [-80.0, 47.0]  as [number, number],
};

const C = {
  navy:    "#0d1520",
  gold:    "#c8a951",
  goldHi:  "#e8c472",
  ivory:   "#f2ebd9",
  amber:   "#d4831f",
  red:     "#e84a4a",
  slate:   "rgba(242,235,217,0.65)",
};

function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMÉRA
// ═══════════════════════════════════════════════════════════════════════════════

type Cam = { lon: number; lat: number; zoom: number; pitch: number; bearing: number; blur: number };

function whipBlur(f: number, start: number, dur = 40): number {
  if (f < start || f >= start + dur) return 0;
  const t = (f - start) / dur;
  return t < 0.5 ? interpolate(t, [0, 0.5], [0, 12]) : interpolate(t, [0.5, 1], [12, 0]);
}

function getCam(frame: number): Cam {
  // A1 (0-580) : Hook global — 3 stops Paris → Londres → NYC
  if (frame < F.A2_START) {
    const dur = F.A2_START;
    const s1End = Math.round(dur * 0.30);   // 0-174 : Paris
    const s2End = Math.round(dur * 0.55);   // 174-319 : Londres
    const s3End = Math.round(dur * 0.85);   // 319-493 : NYC
    // Le reste : zoom out vers Atlantique pour préparer A2

    if (frame < s1End) {
      const t = clamp01(frame / s1End);
      return {
        lon: LOC.paris[0], lat: LOC.paris[1],
        zoom: interpolate(t, [0, 1], [4.0, 5.5]),
        pitch: 20, bearing: t * 5, blur: 0,
      };
    }
    if (frame < s2End) {
      const t = clamp01((frame - s1End) / (s2End - s1End));
      const e = easeInOut(t);
      const blur = whipBlur(frame, s1End, 30);
      return {
        lon: interpolate(e, [0, 1], [LOC.paris[0], LOC.london[0]]),
        lat: interpolate(e, [0, 1], [LOC.paris[1], LOC.london[1]]),
        zoom: interpolate(e, [0, 0.5, 1], [5.5, 3.5, 5.0]),
        pitch: 20, bearing: 0, blur,
      };
    }
    if (frame < s3End) {
      const t = clamp01((frame - s2End) / (s3End - s2End));
      const e = easeInOut(t);
      const blur = whipBlur(frame, s2End, 40);
      return {
        lon: interpolate(e, [0, 1], [LOC.london[0], LOC.nyc[0]]),
        lat: interpolate(e, [0, 1], [LOC.london[1], LOC.nyc[1]]),
        zoom: interpolate(e, [0, 0.5, 1], [5.0, 3.0, 5.0]),
        pitch: 20, bearing: interpolate(e, [0, 1], [0, -15]), blur,
      };
    }
    // Zoom out vers Atlantique pour préparer whip pan
    const t = clamp01((frame - s3End) / (dur - s3End));
    const e = easeInOut(t);
    return {
      lon: interpolate(e, [0, 1], [LOC.nyc[0], LOC.northAtlantic[0]]),
      lat: interpolate(e, [0, 1], [LOC.nyc[1], LOC.northAtlantic[1]]),
      zoom: interpolate(e, [0, 1], [5.0, 3.0]),
      pitch: interpolate(e, [0, 1], [20, 10]),
      bearing: -15, blur: 0,
    };
  }

  // A2 (580-980) : Whip Atlantic → Toronto/Vancouver
  if (frame < F.A3_START) {
    const dur = F.A3_START - F.A2_START;
    const whipEnd = F.A2_START + Math.round(dur * 0.30);
    const torontoEnd = F.A2_START + Math.round(dur * 0.55);

    if (frame < whipEnd) {
      const t = clamp01((frame - F.A2_START) / (whipEnd - F.A2_START));
      const e = easeInOut(t);
      const blur = whipBlur(frame, F.A2_START, whipEnd - F.A2_START);
      return {
        lon: interpolate(e, [0, 1], [LOC.northAtlantic[0], LOC.toronto[0]]),
        lat: interpolate(e, [0, 1], [LOC.northAtlantic[1], LOC.toronto[1]]),
        zoom: interpolate(e, [0, 0.5, 1], [3.0, 2.5, 4.8]),
        pitch: interpolate(e, [0, 1], [10, 35]),
        bearing: -10, blur,
      };
    }
    if (frame < torontoEnd) {
      // Pose Toronto
      const t = clamp01((frame - whipEnd) / (torontoEnd - whipEnd));
      const e = easeInOut(t);
      return {
        lon: LOC.toronto[0], lat: LOC.toronto[1],
        zoom: interpolate(e, [0, 1], [4.8, 5.5]),
        pitch: 45, bearing: interpolate(e, [0, 1], [-10, 5]),
        blur: 0,
      };
    }
    // Mini whip vers Vancouver
    const t = clamp01((frame - torontoEnd) / (F.A3_START - torontoEnd));
    const e = easeInOut(t);
    const blur = whipBlur(frame, torontoEnd, 30);
    return {
      lon: interpolate(e, [0, 1], [LOC.toronto[0], LOC.vancouver[0]]),
      lat: interpolate(e, [0, 1], [LOC.toronto[1], LOC.vancouver[1]]),
      zoom: interpolate(e, [0, 0.5, 1], [5.5, 3.0, 5.0]),
      pitch: 45, bearing: interpolate(e, [0, 1], [5, 20]), blur,
    };
  }

  // A3 (980-1514) : Pull back + descente Montréal + odomètre
  if (frame < F.A4_START) {
    const dur = F.A4_START - F.A3_START;
    const pullEnd = F.A3_START + Math.round(dur * 0.30);
    const diveEnd = F.A3_START + Math.round(dur * 0.55);

    if (frame < pullEnd) {
      const t = clamp01((frame - F.A3_START) / (pullEnd - F.A3_START));
      const e = easeInOut(t);
      const blur = whipBlur(frame, F.A3_START, pullEnd - F.A3_START);
      return {
        lon: interpolate(e, [0, 1], [LOC.vancouver[0], LOC.canadaCentre[0]]),
        lat: interpolate(e, [0, 1], [LOC.vancouver[1], LOC.canadaCentre[1]]),
        zoom: interpolate(e, [0, 0.5, 1], [5.0, 2.5, 3.5]),
        pitch: interpolate(e, [0, 1], [45, 0]),
        bearing: 0, blur,
      };
    }
    if (frame < diveEnd) {
      // Plongée vers Montréal
      const t = clamp01((frame - pullEnd) / (diveEnd - pullEnd));
      const e = easeInOut(t);
      return {
        lon: interpolate(e, [0, 1], [LOC.canadaCentre[0], LOC.montreal[0]]),
        lat: interpolate(e, [0, 1], [LOC.canadaCentre[1], LOC.montreal[1]]),
        zoom: interpolate(e, [0, 1], [3.5, 5.8]),
        pitch: interpolate(e, [0, 1], [0, 50]),
        bearing: interpolate(e, [0, 1], [0, -15]),
        blur: 0,
      };
    }
    // Pose Montréal avec léger drift
    const t = clamp01((frame - diveEnd) / (F.A4_START - diveEnd));
    return {
      lon: LOC.montreal[0] + Math.sin(t * Math.PI * 0.3) * 0.08,
      lat: LOC.montreal[1],
      zoom: 5.8, pitch: 50,
      bearing: -15 + t * 8, blur: 0,
    };
  }

  // A4 (1514-1930) : Drift Est → Calgary, line dasharray flux
  if (frame < F.A5_START) {
    const dur = F.A5_START - F.A4_START;
    const t = clamp01((frame - F.A4_START) / dur);
    const e = easeInOut(t);
    // Drift continu de Montréal vers Calgary
    return {
      lon: interpolate(e, [0, 1], [LOC.montreal[0], LOC.calgary[0]]),
      lat: interpolate(e, [0, 1], [LOC.montreal[1], LOC.calgary[1] - 1]),
      zoom: interpolate(e, [0, 1], [5.5, 4.8]),
      pitch: interpolate(e, [0, 1], [50, 35]),
      bearing: interpolate(e, [0, 1], [-15, 5]),
      blur: 0,
    };
  }

  // A5 (1930-2152) : Pull back Canada entier + closing
  const t = clamp01((frame - F.A5_START) / (F.END - F.A5_START));
  const e = easeInOut(t);
  return {
    lon: interpolate(e, [0, 1], [LOC.calgary[0], LOC.canadaCentre[0]]),
    lat: interpolate(e, [0, 1], [LOC.calgary[1] - 1, LOC.canadaCentre[1]]),
    zoom: interpolate(e, [0, 1], [4.8, 3.0]),
    pitch: interpolate(e, [0, 1], [35, 5]),
    bearing: interpolate(e, [0, 1], [5, 0]),
    blur: 0,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ODOMÈTRE 2016 → 2026 (technique nouvelle)
// ═══════════════════════════════════════════════════════════════════════════════

const Odometre: React.FC<{
  startYear: number;
  endYear: number;
  startFrame: number;
  durationFrames: number;
  position: { top: number; left?: number; right?: number };
}> = ({ startYear, endYear, startFrame, durationFrames, position }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = clamp01((frame - startFrame) / durationFrames);
  const e = easeInOut(t);
  const currentYear = Math.floor(interpolate(e, [0, 1], [startYear, endYear]));

  const enterP = spring({ frame: frame - startFrame, fps, config: { damping: 14 }, durationInFrames: 25 });

  return (
    <div style={{
      position: "absolute",
      top: position.top,
      left: position.left,
      right: position.right,
      opacity: enterP,
      transform: `scale(${0.9 + 0.1 * enterP})`,
    }}>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 18,
        color: C.gold, letterSpacing: 5, textTransform: "uppercase",
        marginBottom: 6,
      }}>Évolution prix médian</div>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 12,
        fontFamily: "monospace",
      }}>
        <div style={{
          fontSize: 96, fontWeight: 700, color: C.goldHi,
          lineHeight: 1, fontFeatureSettings: '"tnum"',
        }}>{currentYear}</div>
        <div style={{
          fontSize: 24, color: C.slate,
          fontFamily: "Georgia, serif", fontStyle: "italic",
        }}>
          {currentYear === startYear ? "Anomalie" : currentYear < 2022 ? "→" : "Digue cède"}
        </div>
      </div>
      {/* Prix qui monte */}
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 48, fontWeight: 700,
        color: C.red, marginTop: 8,
      }}>
        ${(320000 + (currentYear - startYear) * 33000).toLocaleString("fr-FR").replace(",", " ")}
      </div>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 14, color: C.slate,
        marginTop: 4, fontStyle: "italic",
      }}>prix médian Montréal · approx.</div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export const LAnomalieMontreal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: LOC.paris, zoom: 4.0, pitch: 20, bearing: 0,
      interactive: false, preserveDrawingBuffer: true, antialias: true,
    });

    map.on("style.load", () => {
      try {
        (map as mapboxgl.Map & { setProjection?: (p: string) => void })
          .setProjection?.("mercator");
      } catch {}
      applyGeoAfriqueV5(map);

      // Source country-boundaries (a aussi des admin-1 via le tileset boundaries)
      if (!map.getSource("cb-source")) {
        map.addSource("cb-source", {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        });
      }
      // Source boundaries admin-1 (sub-divisions) — pour provinces
      if (!map.getSource("adm1-source")) {
        map.addSource("adm1-source", {
          type: "vector",
          url: "mapbox://mapbox.boundaries-adm1-v3",
        });
      }

      setReady(true);
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Engine principal
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const map = mapRef.current;
    const cam = getCam(frame);

    map.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing,
    });

    // ── A1 : Highlight des pays Paris/Londres/NY au moment où on les visite
    if (frame < F.A2_START) {
      const cities = [
        { iso: "FRA", color: C.gold,   appearAt: 30,  layerId: "a1-fra" },
        { iso: "GBR", color: C.gold,   appearAt: 200, layerId: "a1-gbr" },
        { iso: "USA", color: C.gold,   appearAt: 360, layerId: "a1-usa" },
      ];
      cities.forEach(({ iso, color, appearAt, layerId }) => {
        if (!map.getLayer(layerId)) {
          map.addLayer({
            id: layerId, type: "fill", source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
            paint: { "fill-color": color, "fill-opacity": 0 },
          });
        }
        const op = Math.max(0, Math.min(0.55, (frame - appearAt) / 25 * 0.55));
        try { map.setPaintProperty(layerId, "fill-opacity", op); } catch {}
      });
    }

    // ── A2 : Canada + Toronto/Vancouver extrusion via DOM markers tower-style
    if (frame >= F.A2_START && frame < F.A3_START) {
      // Highlight Canada en or pâle
      if (!map.getLayer("a2-can")) {
        map.addLayer({
          id: "a2-can", type: "fill", source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "CAN"],
          paint: { "fill-color": "#3a3a4a", "fill-opacity": 0 },
        });
      }
      const tLocal = (frame - F.A2_START) / (F.A3_START - F.A2_START);
      try { map.setPaintProperty("a2-can", "fill-opacity", Math.min(0.4, tLocal * 2)); } catch {}
    }

    // ── A3 : Highlight Québec province
    if (frame >= F.A3_START && frame < F.A4_START) {
      // Province Québec via admin-1 (worldview = all)
      if (!map.getLayer("a3-qc")) {
        try {
          map.addLayer({
            id: "a3-qc", type: "fill", source: "adm1-source",
            "source-layer": "boundaries_admin_1",
            filter: ["all",
              ["==", ["get", "iso_3166_1"], "CA"],
              ["==", ["get", "iso_3166_2"], "CA-QC"],
            ],
            paint: { "fill-color": C.goldHi, "fill-opacity": 0 },
          });
        } catch (e) {
          // Si admin-1 source pas accessible, fallback : highlight Canada entier
          if (!map.getLayer("a3-can-fb")) {
            map.addLayer({
              id: "a3-can-fb", type: "fill", source: "cb-source",
              "source-layer": "country_boundaries",
              filter: ["==", ["get", "iso_3166_1_alpha_3"], "CAN"],
              paint: { "fill-color": "#3a3a4a", "fill-opacity": 0.3 },
            });
          }
        }
      }
      const tLocal = (frame - F.A3_START) / (F.A4_START - F.A3_START);
      const op = tLocal > 0.4 ? Math.min(0.5, (tLocal - 0.4) * 2) : 0;
      try { map.setPaintProperty("a3-qc", "fill-opacity", op); } catch {}
    }

    // ── A4 : Highlight Alberta + lignes flux (via canvas pushed as image overlay)
    if (frame >= F.A4_START && frame < F.A5_START) {
      // Highlight Alberta
      if (!map.getLayer("a4-ab")) {
        try {
          map.addLayer({
            id: "a4-ab", type: "fill", source: "adm1-source",
            "source-layer": "boundaries_admin_1",
            filter: ["all",
              ["==", ["get", "iso_3166_1"], "CA"],
              ["==", ["get", "iso_3166_2"], "CA-AB"],
            ],
            paint: { "fill-color": C.amber, "fill-opacity": 0 },
          });
        } catch {}
      }
      const tLocal = (frame - F.A4_START) / (F.A5_START - F.A4_START);
      try {
        map.setPaintProperty("a4-ab", "fill-opacity", Math.min(0.5, tLocal * 2));
      } catch {}

      // Line flux Montréal → Calgary via geojson source
      if (!map.getSource("flux-line")) {
        map.addSource("flux-line", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [LOC.montreal, LOC.toronto, LOC.calgary],
            },
            properties: {},
          },
        });
        map.addLayer({
          id: "flux-line-layer",
          type: "line",
          source: "flux-line",
          paint: {
            "line-color": C.goldHi,
            "line-width": 4,
            "line-opacity": 0.95,
            "line-dasharray": [0, 30],
          },
        });
      }
      // Animation dasharray : filled grandit de 0 → 30
      const drawn = easeInOut(Math.min(1, tLocal * 1.4)) * 30;
      const gap = Math.max(0, 30 - drawn);
      try {
        map.setPaintProperty("flux-line-layer", "line-dasharray", [drawn, gap]);
      } catch {}
    }
  });

  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <Audio src={staticFile("_demos/anomalie-montreal/audio/narration-v1.mp3")} />
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-B-kora-percussion.mp3")}
        volume={(f) => {
          if (f < 60) return interpolate(f, [0, 60], [0, 0.14]);
          if (f > F.END - 60) return interpolate(f, [F.END - 60, F.END], [0.14, 0]);
          return 0.14;
        }}
      />
      <MapboxBrandingHide />

      <AbsoluteFill style={{
        filter: getCam(frame).blur > 0 ? `blur(${getCam(frame).blur}px)` : undefined,
      }}>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>

      <ActOverlays frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// OVERLAYS TEXTE
// ═══════════════════════════════════════════════════════════════════════════════

const ActOverlays: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // ─── A1 : Hook + labels villes mondiales
  if (frame < F.A2_START) {
    const titleP = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 30 });
    const localFrame = frame;
    return (
      <>
        {/* Titre épisode top */}
        <div style={{
          position: "absolute", top: 50, left: 70,
          opacity: titleP, transform: `translateY(${(1 - titleP) * 20}px)`,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 16,
            color: C.gold, letterSpacing: 5, textTransform: "uppercase",
          }}>SOUVERAIN · POC INTERNE</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 48, fontWeight: 700,
            color: C.ivory, marginTop: 6,
          }}>L'Anomalie Montréal</div>
        </div>

        {/* Labels cities qui apparaissent successivement */}
        {[
          { name: "Paris",    price: "1,2M€",  appearAt: 40,   x: "8%", y: "60%" },
          { name: "Londres",  price: "£900K",  appearAt: 200,  x: "8%", y: "60%" },
          { name: "New York", price: "$1,4M",  appearAt: 360,  x: "8%", y: "60%" },
        ].map(({ name, price, appearAt, x, y }, i) => {
          const visible = localFrame >= appearAt && localFrame < appearAt + 150;
          if (!visible) return null;
          const p = spring({
            frame: localFrame - appearAt, fps,
            config: { damping: 18 }, durationInFrames: 25,
          });
          return (
            <div key={i} style={{
              position: "absolute", left: x, top: y,
              opacity: p, transform: `translateY(${(1 - p) * 20}px)`,
            }}>
              <div style={{
                fontFamily: "Georgia, serif", fontSize: 14,
                color: C.gold, letterSpacing: 4, textTransform: "uppercase",
              }}>Prix médian</div>
              <div style={{
                fontFamily: "Georgia, serif", fontSize: 72, fontWeight: 700,
                color: C.ivory, marginTop: 4,
              }}>{name}</div>
              <div style={{
                fontFamily: "Georgia, serif", fontSize: 52,
                color: C.goldHi, marginTop: 6,
              }}>{price}</div>
            </div>
          );
        })}
      </>
    );
  }

  // ─── A2 : Canada + Toronto/Vancouver
  if (frame < F.A3_START) {
    const tLocal = (frame - F.A2_START) / (F.A3_START - F.A2_START);
    const torP = spring({ frame: frame - F.A2_START - 60, fps, config: { damping: 18 }, durationInFrames: 30 });
    const vanP = spring({ frame: frame - F.A2_START - 240, fps, config: { damping: 18 }, durationInFrames: 30 });

    return (
      <>
        {tLocal < 0.55 && (
          <div style={{
            position: "absolute", top: 120, left: 80,
            opacity: torP, transform: `translateY(${(1 - torP) * 20}px)`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 16,
              color: C.gold, letterSpacing: 5, textTransform: "uppercase",
            }}>Prix médian · 2024</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 72, fontWeight: 700,
              color: C.ivory, marginTop: 4,
            }}>Toronto</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 90,
              color: C.red, marginTop: 10,
            }}>$1,4M</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 18,
              color: C.slate, marginTop: 12, fontStyle: "italic",
            }}>90% acheteurs · exclus</div>
          </div>
        )}
        {tLocal > 0.55 && (
          <div style={{
            position: "absolute", top: 120, right: 80, textAlign: "right",
            opacity: vanP, transform: `translateY(${(1 - vanP) * 20}px)`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 16,
              color: C.gold, letterSpacing: 5, textTransform: "uppercase",
            }}>Prix médian · 2024</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 72, fontWeight: 700,
              color: C.ivory, marginTop: 4,
            }}>Vancouver</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 90,
              color: C.red, marginTop: 10,
            }}>$1,4M</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 18,
              color: C.slate, marginTop: 12, fontStyle: "italic",
            }}>Inaccessible</div>
          </div>
        )}
      </>
    );
  }

  // ─── A3 : Montréal + odomètre
  if (frame < F.A4_START) {
    const tLocal = (frame - F.A3_START) / (F.A4_START - F.A3_START);
    const titleP = spring({ frame: frame - F.A3_START, fps, config: { damping: 18 }, durationInFrames: 30 });

    return (
      <>
        <div style={{
          position: "absolute", top: 80, left: 80,
          opacity: titleP, transform: `translateY(${(1 - titleP) * 20}px)`,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 16,
            color: C.gold, letterSpacing: 5, textTransform: "uppercase",
          }}>L'anomalie · 30 ans de répit</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 72, fontWeight: 700,
            color: C.ivory, marginTop: 6,
          }}>Montréal</div>
        </div>

        {/* Odomètre apparaît à mi-acte */}
        {tLocal > 0.45 && (
          <Odometre
            startYear={2016}
            endYear={2026}
            startFrame={F.A3_START + Math.round((F.A4_START - F.A3_START) * 0.45)}
            durationFrames={Math.round((F.A4_START - F.A3_START) * 0.50)}
            position={{ top: 700, left: 80 }}
          />
        )}
      </>
    );
  }

  // ─── A4 : Drift est→ouest + Calgary refuge
  if (frame < F.A5_START) {
    const tLocal = (frame - F.A4_START) / (F.A5_START - F.A4_START);
    const calP = spring({ frame: frame - F.A4_START - 180, fps, config: { damping: 18 }, durationInFrames: 30 });

    return (
      <>
        <div style={{
          position: "absolute", top: 80, left: 80,
          opacity: spring({ frame: frame - F.A4_START, fps, config: { damping: 18 }, durationInFrames: 30 }),
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 16,
            color: C.gold, letterSpacing: 5, textTransform: "uppercase",
          }}>L'exode · 3000 km</div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 56, fontWeight: 700,
            color: C.ivory, marginTop: 6, maxWidth: 700, lineHeight: 1.15,
          }}>Une génération<br/>prend la route</div>
        </div>

        {tLocal > 0.40 && (
          <div style={{
            position: "absolute", bottom: 140, right: 80, textAlign: "right",
            opacity: calP, transform: `translateY(${(1 - calP) * 20}px)`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 16,
              color: C.gold, letterSpacing: 5, textTransform: "uppercase",
            }}>Refuge · Alberta</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 72, fontWeight: 700,
              color: C.ivory, marginTop: 4,
            }}>Calgary</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 80,
              color: C.goldHi, marginTop: 8,
            }}>$540K</div>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 16, fontStyle: "italic",
              color: C.slate, marginTop: 10,
            }}>maison ≈ condo Montréal</div>
          </div>
        )}
      </>
    );
  }

  // ─── A5 : Closing
  const tLocal = (frame - F.A5_START) / (F.END - F.A5_START);
  const p1 = spring({ frame: frame - F.A5_START, fps, config: { damping: 18 }, durationInFrames: 30 });
  const p2 = spring({ frame: frame - F.A5_START - 90, fps, config: { damping: 18 }, durationInFrames: 30 });

  return (
    <>
      <div style={{
        position: "absolute", top: 200, left: 0, right: 0,
        textAlign: "center", opacity: p1,
        transform: `translateY(${(1 - p1) * 20}px)`,
      }}>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 18,
          color: C.gold, letterSpacing: 6, textTransform: "uppercase",
        }}>LA QUESTION</div>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 56, fontWeight: 600,
          color: C.ivory, marginTop: 20, lineHeight: 1.25,
          maxWidth: 1300, margin: "20px auto 0",
        }}>Combien de temps avant qu'aucune ville<br/>canadienne ne soit plus accessible ?</div>
      </div>
      {tLocal > 0.55 && (
        <div style={{
          position: "absolute", bottom: 150, left: 0, right: 0,
          textAlign: "center", opacity: p2,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 20,
            color: C.gold, letterSpacing: 7, textTransform: "uppercase",
          }}>SOUVERAIN · POC INTERNE</div>
        </div>
      )}
    </>
  );
};
