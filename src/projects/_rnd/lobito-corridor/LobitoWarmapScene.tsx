/**
 * LobitoWarmapScene — 30s warmap top-down, Corridor de Lobito.
 *
 * Prouve que le moteur warmap (pilier 3) est le bon outil pour représenter
 * un FLUX économique géoréférencé — pas le pilier Atlas (conçu pour l'histoire/PixelLab).
 *
 * Architecture : réutilise EXACTEMENT le moteur WarMapEngine (Mapbox pitch 0,
 * sprites PNG top-down, trainée directionnelle auto, positionnement map.project()).
 * Seuls le fichier de données et les sprites changent.
 *
 * 30s timeline :
 *   0–5s  : intro — carte Afrique centrale s'allume, Copperbelt en or
 *   5–20s : wagons OR vers l'OUEST (Lobito/Atlantique) + wagons ROUGE vers l'EST (Dar/Chine)
 *  20–27s : dwell — les deux convois en mouvement, cartouche "LE MÊME MÉTAL"
 *  27–30s : fade out
 *
 * Sprites : wagon-cargo-or.png + wagon-cargo-rouge.png (générés Gemini 2026-06-05).
 * Narration : réutilise narration-a3.mp3 (Lobito V2).
 * Musique : music-A-tension-industrielle.mp3 (Maroc Batteries).
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  MapboxBrandingHide,
  addCountryHighlight,
  applyGeoAfriqueV5,
  removeLabels,
} from "../../_shared/mapbox/MapboxBase";

// ===========================================================================
// PALETTE — identique ATLAS parchemin (warmap-playbook §7)
// ===========================================================================
const ATLAS = {
  cream:     "#F2E5C8",
  ocean:     "#3A5A7E",
  land:      "#C97D5A",
  outline:   "#1A1A1A",
  ink:       "#3A2A18",
  gold:      "#D4A574",
  // Lobito : pas de faction RSF/SAF — on utilise or (ouest) et rouge (est)
  west:      "#C8A46A",   // convoi Lobito/Atlantique/Occident
  east:      "#B14B3C",   // convoi Dar/Chine
  contested: "#C99A3A",
};

// ===========================================================================
// TIMING (30fps)
// ===========================================================================
const FPS = 30;
export const LOBITO_WARMAP_FRAMES = 30 * FPS; // 900 frames

const T_INTRO_END  = 5  * FPS;  // 150f — carte allumée, labels
const T_MOVE_START = 5  * FPS;  // wagons démarrent
const T_DWELL      = 20 * FPS;  // 600f — dwell "LE MÊME MÉTAL"
const T_FADE_START = 27 * FPS;  // 810f — fade out
const T_END        = 30 * FPS;  // 900f

// tGlobal [0..1] sur la phase de mouvement (T_MOVE_START → T_FADE_START)
const toTGlobal = (frame: number): number => {
  const span = T_FADE_START - T_MOVE_START;
  return Math.max(0, Math.min(1, (frame - T_MOVE_START) / span));
};

// ===========================================================================
// CONVOIS — paths lngLat réels (géocodés Mapbox MCP 2026-06-05)
// ===========================================================================
type ConvoyPoint = { t: number; lon: number; lat: number };
type Convoy = {
  id: string;
  dir: "west" | "east";
  sprite: "wagon-cargo-or" | "wagon-cargo-rouge";
  size: number;
  path: ConvoyPoint[];
  delay: number;  // frames
  // sprite-or = vertical (orient +0°), sprite-rouge = horizontal (orient +90°)
  baseRotation: number;
};

// Corridor OUEST : Copperbelt → Kolwezi → Luau → Luena → Lobito (port Atlantique)
// tGlobal 0 = mine, 1 = port
const PATH_WEST: ConvoyPoint[] = [
  { t: 0.0, lon: 27.48, lat: -11.67 }, // Lubumbashi
  { t: 0.2, lon: 25.47, lat: -10.72 }, // Kolwezi
  { t: 0.4, lon: 22.22, lat: -10.71 }, // Luau (frontière RDC-Angola)
  { t: 0.7, lon: 19.91, lat: -11.78 }, // Luena (Angola)
  { t: 1.0, lon: 13.55, lat: -12.35 }, // Lobito (port)
];

// Route EST : Copperbelt → Tanzanie → Dar es Salaam (Océan Indien)
const PATH_EAST: ConvoyPoint[] = [
  { t: 0.0, lon: 27.48, lat: -11.67 }, // Lubumbashi
  { t: 0.4, lon: 31.0,  lat: -8.9  }, // vers frontière Tanzanie
  { t: 0.7, lon: 36.8,  lat: -7.4  }, // Tanzanie centrale
  { t: 1.0, lon: 39.28, lat: -6.82 }, // Dar es Salaam (port Indien)
];

const CONVOYS: Convoy[] = [
  // Convoi ouest 1 (meneur) — taille augmentée pour lisibilité à zoom 4.8
  { id: "w1", dir: "west", sprite: "wagon-cargo-or",    size: 88, path: PATH_WEST, delay: 0,  baseRotation: 0   },
  // Convoi ouest 2 (décalé)
  { id: "w2", dir: "west", sprite: "wagon-cargo-or",    size: 72, path: PATH_WEST, delay: 22, baseRotation: 0   },
  // Convoi est 1 (meneur)
  { id: "e1", dir: "east", sprite: "wagon-cargo-rouge", size: 88, path: PATH_EAST, delay: 10, baseRotation: 90  },
  // Convoi est 2 (décalé)
  { id: "e2", dir: "east", sprite: "wagon-cargo-rouge", size: 72, path: PATH_EAST, delay: 32, baseRotation: 90  },
];

// Interpolation position le long d'un path
function convoyPos(c: Convoy, tGlobal: number): [number, number] {
  const path = c.path;
  const t = Math.max(0, Math.min(1, tGlobal));
  for (let i = 0; i < path.length - 1; i++) {
    if (t <= path[i + 1].t) {
      const local = (t - path[i].t) / (path[i + 1].t - path[i].t);
      return [
        path[i].lon + (path[i + 1].lon - path[i].lon) * local,
        path[i].lat + (path[i + 1].lat - path[i].lat) * local,
      ];
    }
  }
  return [path[path.length - 1].lon, path[path.length - 1].lat];
}

// ===========================================================================
// COMPOSANT PRINCIPAL
// ===========================================================================
export const LobitoWarmapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const [handle]     = useState(() => delayRender("LobitoWarmap", { timeoutInMilliseconds: 60000 }));
  const [ready, setReady] = useState(false);
  const [convoyPx, setConvoyPx] = useState<
    { id: string; x: number; y: number; dx: number; dy: number }[]
  >([]);

  const tGlobal = toTGlobal(frame);

  // ---------------------------------------------------------------------------
  // Init Mapbox (pitch 0 — identique WarMapEngine)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN ?? "";

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [22.0, -10.5],   // centré sur le Copperbelt
      zoom:   4.2,
      pitch:  0,               // TOP-DOWN PUR
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      projection: { name: "mercator" } as any,
    });
    mapRef.current = map;

    map.on("style.load", async () => {
      // Reskin parchemin (même recette WarMapEngine)
      const layers = map.getStyle().layers ?? [];
      for (const l of layers) {
        if (l.type === "symbol") map.setLayoutProperty(l.id, "visibility", "none");
        if (l.id.includes("water")) {
          try { map.setPaintProperty(l.id, "fill-color", ATLAS.ocean); } catch {}
        }
        if (l.id === "land" || l.id.includes("landuse") || l.id.includes("landcover") ||
            l.id === "background" || l.id.includes("national-park")) {
          try { map.setPaintProperty(l.id, "background-color", ATLAS.land); } catch {}
          try { map.setPaintProperty(l.id, "fill-color", ATLAS.land); } catch {}
        }
        if (l.id.includes("admin-0")) map.setPaintProperty(l.id, "line-color", ATLAS.outline);
        if (l.id.includes("admin-1")) map.setPaintProperty(l.id, "line-color", "rgba(58,42,24,0.2)");
      }

      // Pays protagonistes — highlightés avec leurs couleurs
      addCountryHighlight(map, "COD", ATLAS.gold,    0.55, 2.5, "cod-");  // RDC or (source)
      addCountryHighlight(map, "ZMB", ATLAS.gold,    0.38, 1.5, "zmb-");  // Zambie or (source)
      addCountryHighlight(map, "AGO", "#A88A52",     0.35, 1.5, "ago-");  // Angola (corridor)

      setReady(true);
      map.once("idle", () => continueRender(handle));
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle]);

  // ---------------------------------------------------------------------------
  // Update frame-by-frame : caméra + positions convois
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;

    // Caméra : drift léger vers l'ouest au fil du temps (suit le mouvement des convois)
    const camLon  = interpolate(tGlobal, [0, 1], [22.0, 19.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const camLat  = interpolate(tGlobal, [0, 1], [-10.5, -11.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const camZoom = interpolate(frame, [0, T_INTRO_END, T_DWELL, T_FADE_START],
      [4.4, 4.8, 4.9, 4.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    map.jumpTo({ center: [camLon, camLat], zoom: camZoom, pitch: 0, bearing: 0 });

    // Projeter les convois en pixels
    const dt = 0.012;
    const projections = CONVOYS.map((c) => {
      const [lon, lat]   = convoyPos(c, tGlobal);
      const [lon2, lat2] = convoyPos(c, Math.max(0, tGlobal - dt));
      const p     = map.project([lon, lat]);
      const pPrev = map.project([lon2, lat2]);
      return { id: c.id, x: p.x, y: p.y, dx: p.x - pPrev.x, dy: p.y - pPrev.y };
    });
    setConvoyPx(projections);

    const h = delayRender(`lobito-frame-${frame}`, { timeoutInMilliseconds: 40000 });
    let done = false;
    const finish = () => { if (!done) { done = true; continueRender(h); } };
    map.once("idle", finish);
    setTimeout(finish, map.areTilesLoaded() ? 300 : 1200);
  }, [frame, ready, tGlobal]);

  // ---------------------------------------------------------------------------
  // Fade global
  // ---------------------------------------------------------------------------
  const fadeIn  = interpolate(frame, [0, T_INTRO_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [T_FADE_START, T_END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalOpacity = Math.min(fadeIn, fadeOut);

  // ---------------------------------------------------------------------------
  // HUD — date/titre haut + cartouche dwell bas
  // ---------------------------------------------------------------------------
  const hudOp = interpolate(frame, [T_INTRO_END - 15, T_INTRO_END + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    * interpolate(frame, [T_FADE_START - 20, T_FADE_START], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const dwellOp = interpolate(frame, [T_DWELL, T_DWELL + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    * interpolate(frame, [T_FADE_START - 20, T_FADE_START], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const plaque: React.CSSProperties = {
    background: ATLAS.cream, border: `2px solid ${ATLAS.ink}`, borderRadius: 8,
    color: ATLAS.ink, boxShadow: "0 4px 18px rgba(0,0,0,0.28)",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS.ocean, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <MapboxBrandingHide />

      {/* Audio — narration A3 (acte "même métal deux directions") + musique */}
      <Audio src={staticFile("atlas/_rnd/lobito/audio/narration-a3.mp3")} volume={1} />
      <Audio src={staticFile("souverain/maroc-batteries/audio/music-A-tension-industrielle.mp3")}
        volume={interpolate(frame, [0, 30, T_END - 40, T_END], [0, 0.16, 0.16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

      {/* Filtre papier parchemin */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="paperLobito">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.9  0 0 0 0 0.78  0 0 0 0.04 0" />
        </filter>
      </svg>

      {/* Carte Mapbox */}
      <div ref={containerRef} style={{ width, height, position: "absolute", opacity: globalOpacity }} />

      {/* Grain papier multiply (identique WarMapEngine) */}
      <AbsoluteFill style={{ filter: "url(#paperLobito)", opacity: 0.28, pointerEvents: "none", mixBlendMode: "multiply" }} />

      {/* Vignette douce */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 66%, rgba(40,28,16,0.20) 100%)",
        opacity: globalOpacity,
      }} />

      {/* ================================================================
          CONVOIS — sprites top-down orientés selon le cap (moteur warmap)
          ================================================================ */}
      {ready && CONVOYS.map((c) => {
        const pos = convoyPx.find((p) => p.id === c.id);
        if (!pos) return null;

        // Apparition décalée par delay
        const appearFrame = T_MOVE_START + c.delay;
        const pop = interpolate(frame, [appearFrame, appearFrame + 18], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.bezier(0.2, 0.9, 0.3, 1),
        });
        if (pop <= 0) return null;

        const mag = Math.hypot(pos.dx, pos.dy);
        const moving = mag > 0.1;

        // Cap de déplacement + rotation de base du sprite
        const headingDeg = moving
          ? (Math.atan2(pos.dy, pos.dx) * 180) / Math.PI + 90 + c.baseRotation
          : c.baseRotation;

        const ang = Math.atan2(pos.dy, pos.dx);
        const trailLen = Math.min(45, mag * 7 + 12);
        const col = c.dir === "west" ? ATLAS.west : ATLAS.east;
        const vSize = c.size * 1.45;

        return (
          <div key={c.id} style={{
            position: "absolute", left: pos.x, top: pos.y,
            transform: `translate(-50%, -50%) scale(${pop})`,
            opacity: pop * globalOpacity, pointerEvents: "none",
          }}>
            {/* Trainée directionnelle */}
            {moving && (
              <div style={{
                position: "absolute", left: 0, top: 0,
                width: trailLen, height: 7,
                transform: `translate(-100%, -50%) rotate(${(ang * 180) / Math.PI}deg)`,
                transformOrigin: "100% 50%",
                background: `linear-gradient(90deg, rgba(0,0,0,0), ${col})`,
                borderRadius: 4, opacity: 0.5,
              }} />
            )}
            {/* Ombre portée */}
            <div style={{
              position: "absolute", left: "50%", top: "54%",
              width: vSize * 0.7, height: vSize * 0.28,
              transform: "translate(-50%,-50%)",
              background: "rgba(26,18,9,0.28)", borderRadius: "50%", filter: "blur(3px)",
            }} />
            {/* Sprite PNG top-down orienté */}
            <img
              src={staticFile(`_shared/sprites/warmap/${c.sprite}.png`)}
              style={{
                width: vSize, height: vSize, objectFit: "contain", display: "block",
                transform: `rotate(${headingDeg}deg)`,
                filter: `drop-shadow(0 1px 3px rgba(0,0,0,0.45))`,
              }}
            />
          </div>
        );
      })}

      {/* ================================================================
          HUD — titre haut + légende itinéraires
          ================================================================ */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 40px 0", gap: 12, opacity: hudOp * globalOpacity, pointerEvents: "none" }}>
        {/* Titre principal */}
        <div style={{ ...plaque, padding: "10px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: "0.05em", color: ATLAS.ink }}>
            LE CORRIDOR DE LOBITO
          </div>
          <div style={{ fontSize: 22, fontStyle: "italic", color: ATLAS.ink, opacity: 0.75, marginTop: 2 }}>
            1 300 km — Copperbelt → Atlantique
          </div>
        </div>

        {/* Légende itinéraires */}
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ ...plaque, padding: "6px 18px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: ATLAS.west }} />
            <span style={{ fontSize: 18, fontWeight: 700 }}>OUEST · LOBITO · USA / EUROPE</span>
          </div>
          <div style={{ ...plaque, padding: "6px 18px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: ATLAS.east }} />
            <span style={{ fontSize: 18, fontWeight: 700 }}>EST · DAR ES SALAAM · CHINE</span>
          </div>
        </div>
      </div>

      {/* ================================================================
          CARTOUCHE DWELL — "LE MÊME MÉTAL"
          ================================================================ */}
      <div style={{
        position: "absolute", bottom: 220, left: 0, right: 0, display: "flex", justifyContent: "center",
        opacity: dwellOp * globalOpacity, pointerEvents: "none",
      }}>
        <div style={{ ...plaque, padding: "18px 48px", textAlign: "center", maxWidth: 680 }}>
          <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: "0.04em", color: ATLAS.ink }}>
            LE MÊME MÉTAL
          </div>
          <div style={{ fontSize: 26, fontStyle: "italic", color: ATLAS.ink, opacity: 0.8, marginTop: 4 }}>
            deux marchés, deux routes, une seule mine
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
