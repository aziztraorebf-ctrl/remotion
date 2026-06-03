import React, { useEffect, useRef } from "react";
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
import mapboxgl from "mapbox-gl";
import {
  applyGeoAfriqueV5,
  MAPBOX_STYLES,
} from "../../../_shared/mapbox/MapboxBase";
import { OdometerFlip } from "../../../_shared/components/layouts/OdometerFlip";

// Beat0 — Accroche v11
//
// ACTE 1 (f0  → f240) : "AVRIL" + OdometerFlip "2026" sur 6s — 2 éléments, zéro parasite
// ACTE 2 (f240→ f600) : Mapbox épuré — Yakaar gold, label "Yakaar-Teranga" seul
// ACTE 3 (f600→ f1050): LeSceau Sénégal séquentiel — cercle → drapeau → GOUVERNEMENT DISSOUS

// ─── Timing ──────────────────────────────────────────────────────────────────
const F_TOTAL        = 1095; // 36.5s (+ 1.5s respiration fin)

// ACTE 1
const F_AVRIL_IN     = 10;
const F_FLIP_START   = 30;   // les cases commencent à spinner
const F_A1_SLIDE     = 210;
const F_A1_END       = 240;

// ACTE 2
const F_MAP_IN       = 240;
const F_LABEL_IN     = 310;
const F_RIDEAU_START = 570;
const F_RIDEAU_END   = 630;

// ACTE 3 — LeSceau séquentiel
const F_SCEAU_IN     = 630;
const F_FLAG_IN      = 660;   // drapeau scale-in
const F_STAMP_IN     = 750;   // "SÉNÉGAL" stamp
const F_DISSOUS_IN   = 870;   // "GOUVERNEMENT DISSOUS"

// ─── Palette ─────────────────────────────────────────────────────────────────
const GOLD  = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY  = "#16213a";
const RED   = "#ef4444";
const GREEN_SN = "#00853f"; // vert drapeau sénégal

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const YAKAAR_CENTER: [number, number] = [-17.3, 14.6];
const DAKAR_VIEW: [number, number]    = [-17.0, 14.8];

const YAKAAR_POLYGON: [number, number][] = [
  [-17.8, 15.1], [-16.8, 15.1], [-16.8, 14.0], [-17.8, 14.0], [-17.8, 15.1],
];

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ─── ACTE 1 — AVRIL + OdometerFlip 2026 ──────────────────────────────────────

function Acte1({ frame, fps }: { frame: number; fps: number }) {
  const slideOut = interpolate(frame, [F_A1_SLIDE, F_A1_END], [0, -1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const opAvril = interpolate(frame, [F_AVRIL_IN, F_AVRIL_IN + 20, F_A1_SLIDE, F_A1_END], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const scAvril = spring({ fps, frame: Math.max(0, frame - F_AVRIL_IN), config: { damping: 70, stiffness: 60 } });

  const opFlip = interpolate(frame, [F_FLIP_START, F_FLIP_START + 15, F_A1_SLIDE, F_A1_END], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: NAVY, transform: `translateX(${slideOut * 100}vw)` }}>

      {/* Bloc centré : AVRIL au-dessus + gap + OdometerFlip 2026 en dessous */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 48,
      }}>
        {/* "AVRIL" */}
        <div style={{
          opacity: opAvril,
          transform: `scale(${interpolate(scAvril, [0, 1], [0.88, 1])})`,
          fontFamily: "Cinzel, serif",
          fontSize: 160, fontWeight: 700,
          color: GOLD, lineHeight: 1,
          letterSpacing: "0.08em",
        }}>
          AVRIL
        </div>

        {/* OdometerFlip "2026" */}
        <div style={{
          opacity: opFlip,
          position: "relative", width: "100%", height: 310,
        }}>
          <OdometerFlip
            toValue="2026"
            spinStartFrame={F_FLIP_START + 10}
            spinStagger={16}
            spinDuration={90}
            bgColor="transparent"
          />
        </div>
      </div>

    </AbsoluteFill>
  );
}

// ─── ACTE 2 — Mapbox épuré ───────────────────────────────────────────────────

function Acte2({ frame, fps }: { frame: number; fps: number }) {
  const opMap = interpolate(frame, [F_MAP_IN, F_MAP_IN + 20, F_RIDEAU_START, F_RIDEAU_END], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const opLabel = interpolate(frame, [F_LABEL_IN, F_LABEL_IN + 20, F_RIDEAU_START, F_RIDEAU_END], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const barH = spring({ fps, frame: Math.max(0, frame - F_LABEL_IN), config: { damping: 120, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ opacity: opMap }}>
      <div style={{ position: "absolute", inset: 0, background: NAVY, opacity: 0.22, pointerEvents: "none" }} />

      {/* Label Yakaar-Teranga — sans le surlabel souveraineté */}
      <div style={{
        position: "absolute", left: 90, bottom: "38%",
        display: "flex", alignItems: "flex-start", gap: 20,
        opacity: opLabel,
      }}>
        <div style={{
          width: 4, height: barH * 72,
          backgroundColor: GOLD, borderRadius: 2, flexShrink: 0, marginTop: 6,
        }} />
        <div style={{
          fontFamily: "Cinzel, serif",
          fontSize: 52, fontWeight: 700, color: IVORY,
          letterSpacing: "0.02em", lineHeight: 1.2,
        }}>
          Yakaar-Teranga
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── ACTE 3 — Layout template Niger (drapeau carte + textes noirs) ───────────

// Étoile sénégalaise — path SVG 5 branches
function starPolygon(cx: number, cy: number, R: number, r: number): string {
  return Array.from({ length: 5 }, (_, i) => {
    const ao = (i * 72 - 90) * Math.PI / 180;
    const ai = ((i * 72 + 36) - 90) * Math.PI / 180;
    return `${cx + Math.cos(ao) * R},${cy + Math.sin(ao) * R} ${cx + Math.cos(ai) * r},${cy + Math.sin(ai) * r}`;
  }).join(" ");
}

function Acte3({ frame, fps }: { frame: number; fps: number }) {
  const opIn = interpolate(frame, [F_SCEAU_IN, F_SCEAU_IN + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Drapeau : slide-in depuis bord gauche, finit 30f avant F_STAMP_IN
  const flagSlide = interpolate(frame, [F_FLAG_IN, F_FLAG_IN + 40], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic — rapide puis settle doux
  });
  const flagX = interpolate(flagSlide, [0, 1], [-700, 0]);
  const flagOp = interpolate(frame, [F_FLAG_IN, F_FLAG_IN + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "SÉNÉGAL" stamp impact depuis F_STAMP_IN
  const scStamp = spring({ fps, frame: Math.max(0, frame - F_STAMP_IN), config: { damping: 8, stiffness: 200, mass: 1 } });
  const stampScale = interpolate(scStamp, [0, 1], [1.35, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampOp = interpolate(frame, [F_STAMP_IN, F_STAMP_IN + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const isGlitch = frame >= F_STAMP_IN && frame <= F_STAMP_IN + 4;
  const glitchX = isGlitch ? (frame % 2 === 0 ? 5 : -5) : 0;

  // Ligne séparatrice gold sous SÉNÉGAL
  const lineW = interpolate(frame, [F_STAMP_IN + 8, F_STAMP_IN + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "GOUVERNEMENT DISSOUS" slide-up depuis F_DISSOUS_IN
  const opDissous = interpolate(frame, [F_DISSOUS_IN, F_DISSOUS_IN + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const yDissous = interpolate(frame, [F_DISSOUS_IN, F_DISSOUS_IN + 20], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Drapeau dimensions
  const FW = 540; const FH = 360;
  const starCx = FW / 2; const starCy = FH / 2;

  return (
    <AbsoluteFill style={{ background: NAVY, opacity: opIn }}>

      {/* Bloc centré vertical */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 0,
      }}>

        {/* Carte drapeau — slide depuis la gauche */}
        <div style={{
          opacity: flagOp,
          transform: `translateX(${flagX}px)`,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>

          {/* Cadre gold fin + drapeau SVG */}
          <div style={{
            border: `2px solid rgba(200,169,81,0.45)`,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.55)",
          }}>
            <svg width={FW} height={FH} viewBox={`0 0 ${FW} ${FH}`} style={{ display: "block" }}>
              {/* Bande verte */}
              <rect x={0} y={0} width={FW / 3} height={FH} fill={GREEN_SN} />
              {/* Bande or */}
              <rect x={FW / 3} y={0} width={FW / 3} height={FH} fill={GOLD} />
              {/* Bande rouge */}
              <rect x={(FW * 2) / 3} y={0} width={FW / 3} height={FH} fill={RED} />
              {/* Étoile verte centrée sur la bande or */}
              <polygon
                points={starPolygon(starCx, starCy, 52, 22)}
                fill={GREEN_SN}
              />
            </svg>
          </div>
        </div>

        {/* "SÉNÉGAL" — ivory, Cinzel, stamp */}
        <div style={{
          opacity: stampOp,
          transform: `scale(${stampScale}) translateX(${glitchX}px)`,
          marginTop: 36,
          fontFamily: "Cinzel, serif",
          fontSize: 96, fontWeight: 700,
          color: IVORY, letterSpacing: "0.12em",
          lineHeight: 1,
        }}>
          SÉNÉGAL
        </div>

        {/* Ligne gold sous SÉNÉGAL */}
        <div style={{
          marginTop: 16,
          width: `${lineW * 320}px`,
          height: 2,
          backgroundColor: GOLD,
          borderRadius: 1,
        }} />

        {/* "GOUVERNEMENT DISSOUS" — même taille que SÉNÉGAL, gold */}
        <div style={{
          opacity: opDissous,
          transform: `translateY(${yDissous}px)`,
          marginTop: 20,
          fontFamily: "Cinzel, serif",
          fontSize: 96, fontWeight: 700,
          color: GOLD, letterSpacing: "0.10em",
          lineHeight: 1,
          textAlign: "center",
        }}>
          GOUVERNEMENT DISSOUS
        </div>

        {/* Date — IBM Plex Mono, petit, slate */}
        <div style={{
          opacity: opDissous,
          marginTop: 14,
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 22, fontWeight: 400,
          color: "#8b9bb4", letterSpacing: "0.18em",
        }}>
          22 MAI 2026
        </div>

      </div>

    </AbsoluteFill>
  );
}

// ─── Rideau transition A2→A3 ─────────────────────────────────────────────────

function Rideau({ frame }: { frame: number }) {
  const prog = interpolate(frame, [F_RIDEAU_START, F_RIDEAU_END], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  if (prog <= 0 || prog >= 1) return null;
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, bottom: 0,
      width: `${prog * 100}%`,
      backgroundColor: NAVY,
      zIndex: 20,
    }} />
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export const Beat0Accroche: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerRef    = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<mapboxgl.Map | null>(null);
  const polygonAddedRef = useRef(false);
  const delayHandleRef  = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const handle = delayRender("Beat0 Mapbox", { timeoutInMilliseconds: 45000 });
    delayHandleRef.current = handle;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: YAKAAR_CENTER,
      zoom: 7.5,
      bearing: 0, pitch: 0,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
    });
    map.on("style.load", () => {
      try {
        (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
        applyGeoAfriqueV5(map);
      } catch (_e) {}
      continueRender(handle);
      delayHandleRef.current = null;
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      polygonAddedRef.current = false;
      if (delayHandleRef.current !== null) {
        continueRender(delayHandleRef.current);
        delayHandleRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (frame >= F_MAP_IN && frame < F_RIDEAU_START) {
      const local = Math.max(0, frame - F_MAP_IN);
      const dur   = F_RIDEAU_START - F_MAP_IN;
      const prog  = ease(Math.min(local / dur, 1));
      map.jumpTo({
        center: [
          interpolate(prog, [0, 1], [YAKAAR_CENTER[0], DAKAR_VIEW[0]]),
          interpolate(prog, [0, 1], [YAKAAR_CENTER[1], DAKAR_VIEW[1]]),
        ] as [number, number],
        zoom: interpolate(prog, [0, 1], [7.5, 6.8]),
        bearing: 0, pitch: 0,
      });
    }

    if (frame >= F_MAP_IN && !polygonAddedRef.current && map.isStyleLoaded()) {
      try {
        map.addSource("yakaar-poly", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "Polygon", coordinates: [YAKAAR_POLYGON] },
            properties: {},
          },
        });
        map.addLayer({
          id: "yakaar-fill",
          type: "fill",
          source: "yakaar-poly",
          paint: { "fill-color": GOLD, "fill-opacity": 0 },
        });
        map.addLayer({
          id: "yakaar-line",
          type: "line",
          source: "yakaar-poly",
          paint: { "line-color": GOLD, "line-width": 2.5, "line-opacity": 0, "line-dasharray": [4, 3] },
        });
        polygonAddedRef.current = true;
      } catch (_e) {}
    }

    if (polygonAddedRef.current && map.isStyleLoaded()) {
      try {
        const fillOp = interpolate(frame,
          [F_LABEL_IN, F_LABEL_IN + 40, F_RIDEAU_START],
          [0, 0.35, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const lineOp = interpolate(frame,
          [F_LABEL_IN, F_LABEL_IN + 30, F_RIDEAU_START],
          [0, 0.9, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        map.setPaintProperty("yakaar-fill", "fill-opacity", fillOp);
        map.setPaintProperty("yakaar-line", "line-opacity", lineOp);
      } catch (_e) {}
    }
  });

  const volNarr = interpolate(frame,
    [0, 15, F_TOTAL - 20, F_TOTAL],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const volMusic = interpolate(frame,
    [0, 30, F_TOTAL - 30, F_TOTAL],
    [0, 0.05, 0.05, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>

      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/beat0-accroche-v3.mp3")}
        startFrom={0}
        volume={volNarr}
      />
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        startFrom={0}
        volume={volMusic}
      />

      {/* Mapbox — TOUJOURS dans le DOM */}
      <div ref={containerRef} style={{
        position: "absolute", inset: 0,
        opacity: frame >= F_MAP_IN && frame < F_RIDEAU_END ? 1 : 0,
        pointerEvents: "none",
      }} />
      <style>{`.mapboxgl-ctrl-bottom-left,.mapboxgl-ctrl-bottom-right,.mapboxgl-ctrl-logo,.mapboxgl-ctrl-attrib{display:none!important}`}</style>

      {/* ACTE 1 */}
      {frame < F_A1_END && <Acte1 frame={frame} fps={fps} />}

      {/* ACTE 2 — overlays Mapbox */}
      {frame >= F_MAP_IN && frame < F_RIDEAU_END && <Acte2 frame={frame} fps={fps} />}

      {/* Rideau */}
      <Rideau frame={frame} />

      {/* ACTE 3 — LeSceau Sénégal */}
      {frame >= F_SCEAU_IN && <Acte3 frame={frame} fps={fps} />}

    </AbsoluteFill>
  );
};
