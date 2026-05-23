import React, { useEffect, useRef, useState } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import mapboxgl from "mapbox-gl";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "../../../_shared/mapbox/MapboxBase";

// Beat 7 — Acte 2 / Beat B — "GTA + arc export" (60.36s → 96.06s narration)
// Durée réelle : 35.7s / 1071 frames
// Forced-alignment anchors (relatifs) :
//   0s    — "GTA" → dot GTA s'allume (f0)
//   1.52s — "frontière maritime" → label frontière (f46)
//   5.06s — "BP" → sous-label BP (f152)
//   9.70s — "février 2025" → date overlay (f291)
//   13.52s — "produire" → PRODUCTION ACTIVE (f406)
//   19.10s — "première cargaison" → highlight date (f573)
//   24.20s — "fournisseur réel" → texte éditorial (f726)
//   27.40s — "acheteurs au bout" → arc GTA→Europe se trace (f822)
//   31.70s — "Europe" → arc complet + point Europe (f951)
//   31.70s+ — arc GTA→Asie se trace décalé (f980)

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const MAURITANIE_GOLD = "rgba(200,169,81,0.18)";

// Centres géographiques (vue Atlantique Nord)
const CAM_CENTER = { lon: -20.0, lat: 20.0 };
const CAM_ZOOM = 3.2;

// Coordonnées géographiques réelles
const GTA_LNGLAT: [number, number] = [-17.3, 16.5];       // frontière SN/MR
const SANGOMAR_LNGLAT: [number, number] = [-17.15, 13.45]; // Sangomar offshore
const EUROPE_LNGLAT: [number, number] = [-9.14, 38.72];    // Portugal/Lisbonne
const ASIA_LNGLAT: [number, number] = [51.5, 25.3];        // Golfe Persique/Qatar (hub GNL Asie — visible viewport)

// Fallback screen-space si map pas encore prête (zoom 3.2, center [-20, 20])
const GTA_FALLBACK = { x: 978, y: 562 };
const SANGOMAR_FALLBACK = { x: 979, y: 600 };
const EUROPE_FALLBACK = { x: 1106, y: 432 };
const ASIA_FALLBACK = { x: 1500, y: 520 };

const F_GTA        = 0;
const F_FRONTIERE  = 46;
const F_BP         = 152;
const F_DATE       = 291;
const F_PRODUCTION = 406;
const F_CARGAISON  = 573;
const F_FOURNISSEUR = 726;
const F_ARC_EU     = 822;
const F_ARC_EU_END = 951;
const F_ARC_AS     = 980;
const F_ARC_AS_END = 1071;

// Arc SVG path entre deux points avec courbe de Bézier
function arcPath(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number) {
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

type DotPositions = {
  gta: { x: number; y: number };
  sangomar: { x: number; y: number };
  europe: { x: number; y: number };
  asia: { x: number; y: number };
};

export const Beat7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mauritanieLayerReady = useRef(false);

  // Positions projetées depuis les coordonnées géographiques réelles
  const [dots, setDots] = useState<DotPositions>({
    gta: GTA_FALLBACK,
    sangomar: SANGOMAR_FALLBACK,
    europe: EUROPE_FALLBACK,
    asia: ASIA_FALLBACK,
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [CAM_CENTER.lon, CAM_CENTER.lat],
      zoom: CAM_ZOOM,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
    });

    map.on("style.load", () => {
      (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
      applyGeoAfriqueV5(map);
      const safe = (id: string, prop: string, val: unknown) => {
        try { if (map.getLayer(id)) (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)(id, prop, val); } catch {}
      };
      safe("land",         "background-color", "#5a5a5a");
      safe("landuse",      "fill-color",       "#5a5a5a");
      safe("landcover",    "fill-color",       "#545454");
      safe("water",        "fill-color",       "#2a4f72");
      safe("water-shadow", "fill-color",       "#2a4f72");

      // Highlight Mauritanie — layer fill gold semi-transparent
      try {
        // Source GeoJSON inline — polygon Mauritanie approximé (simplifié 6 points)
        if (!map.getSource("mauritanie-src")) {
          (map as unknown as { addSource: (id: string, src: unknown) => void }).addSource("mauritanie-src", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [[
                  [-17.07, 20.85],
                  [-16.85, 19.98],
                  [-16.51, 19.37],
                  [-16.27, 16.52],
                  [-13.42, 15.83],
                  [-10.90, 15.14],
                  [-10.71, 17.86],
                  [-11.50, 19.30],
                  [-12.28, 20.98],
                  [-13.43, 21.53],
                  [-15.65, 21.65],
                  [-17.07, 20.85],
                ]],
              },
            },
          });
        }
        if (!map.getLayer("mauritanie-fill")) {
          (map as unknown as { addLayer: (layer: unknown) => void }).addLayer({
            id: "mauritanie-fill",
            type: "fill",
            source: "mauritanie-src",
            paint: {
              "fill-color": GOLD,
              "fill-opacity": 0,
            },
          });
        }
        mauritanieLayerReady.current = true;
      } catch (_e) {
        // layer optionnel — ne pas crasher si Mapbox refuse
      }
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; mauritanieLayerReady.current = false; };
  }, []);

  // Camera drift agressif + projection dots + opacity Mauritanie
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const f = Math.min(frame, 1071);
    // Centre dérive vers nord-est — garde GTA + Europe dans le cadre
    const lon = interpolate(f, [0, 400, 1071], [-20.0, -19.5, -18.8], { extrapolateRight: "clamp" });
    const lat = interpolate(f, [0, 400, 1071], [20.0,  20.3,  20.8],  { extrapolateRight: "clamp" });
    // Bearing stable au début (labels lisibles), rotation agressive ensuite
    const bearing = interpolate(f, [0, 200, 600, 1071], [0, -2, -12, -22], { extrapolateRight: "clamp" });
    // Pitch plat pendant dots/labels, plonge quand les arcs apparaissent
    const pitch = interpolate(f, [0, 400, 750, 1071], [0, 0, 20, 35], { extrapolateRight: "clamp" });
    // Zoom in doux
    const zoom = interpolate(f, [0, 500, 1071], [3.2, 3.5, 3.9], { extrapolateRight: "clamp" });
    map.jumpTo({ center: [lon, lat], bearing, pitch, zoom });

    // Projeter les coordonnées géographiques → pixels canvas après jumpTo
    const project = (lngLat: [number, number]) => {
      const pt = map.project(new mapboxgl.LngLat(lngLat[0], lngLat[1]));
      return { x: Math.round(pt.x), y: Math.round(pt.y) };
    };
    setDots({
      gta: project(GTA_LNGLAT),
      sangomar: project(SANGOMAR_LNGLAT),
      europe: project(EUROPE_LNGLAT),
      asia: project(ASIA_LNGLAT),
    });

    // Mauritanie opacity — apparaît progressivement à F_FOURNISSEUR
    if (mauritanieLayerReady.current) {
      const maurOpacity = interpolate(frame, [F_FOURNISSEUR, F_FOURNISSEUR + 40], [0, 0.22], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
      try {
        (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)(
          "mauritanie-fill", "fill-opacity", maurOpacity
        );
      } catch (_e) {}
    }
  });

  // Dot GTA — pop immédiat
  const gtaP = spring({ frame: frame - F_GTA, fps, config: { damping: 10, stiffness: 300 }, durationInFrames: 20 });
  const gtaScale = interpolate(gtaP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const sinePulse = Math.sin((frame / 40) * Math.PI * 2);
  const gtaGlow = interpolate(sinePulse, [-1, 1], [0.7, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Dot Sangomar — plus petit, dimmer
  const sangomarOpacity = interpolate(frame, [0, 20], [0, 0.55], { extrapolateRight: "clamp" });

  // Label frontière
  const frontiereP = spring({ frame: frame - F_FRONTIERE, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 20 });
  const frontiereOpacity = interpolate(frontiereP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const frontiereX = interpolate(frontiereP, [0, 1], [-20, 0], { extrapolateRight: "clamp" });

  // Label BP
  const bpP = spring({ frame: frame - F_BP, fps, config: { damping: 18, stiffness: 180 }, durationInFrames: 18 });
  const bpOpacity = interpolate(bpP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const bpY = interpolate(bpP, [0, 1], [8, 0], { extrapolateRight: "clamp" });

  // Date overlay
  const dateP = spring({ frame: frame - F_DATE, fps, config: { damping: 18, stiffness: 160 }, durationInFrames: 20 });
  const dateOpacity = interpolate(dateP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Production active
  const prodP = spring({ frame: frame - F_PRODUCTION, fps, config: { damping: 12, stiffness: 280 }, durationInFrames: 18 });
  const prodScale = interpolate(prodP, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });
  const prodOpacity = interpolate(prodP, [0, 0.1, 1], [0, 1, 1], { extrapolateRight: "clamp" });

  // Cargaison highlight
  const cargaisonP = spring({ frame: frame - F_CARGAISON, fps, config: { damping: 8, stiffness: 400 }, durationInFrames: 12 });
  const cargaisonGlow = interpolate(cargaisonP, [0, 0.3, 1], [0, 1, 0.6], { extrapolateRight: "clamp" });

  // Fournisseur réel
  const fournisseurP = spring({ frame: frame - F_FOURNISSEUR, fps, config: { damping: 18, stiffness: 160 }, durationInFrames: 20 });
  const fournisseurOpacity = interpolate(fournisseurP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const fournisseurY = interpolate(fournisseurP, [0, 1], [12, 0], { extrapolateRight: "clamp" });

  // Arc GTA → Europe
  const arcEuProgress = interpolate(frame, [F_ARC_EU, F_ARC_EU_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ARC_EU_LENGTH = 620;
  const arcEuDash = arcEuProgress * ARC_EU_LENGTH;

  // Arc GTA → Asie (décalé, départ F_ARC_AS)
  const arcAsProgress = interpolate(frame, [F_ARC_AS, F_ARC_AS_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ARC_AS_LENGTH = 900;
  const arcAsDash = arcAsProgress * ARC_AS_LENGTH;

  // Points destination
  const europeP = spring({ frame: frame - F_ARC_EU_END, fps, config: { damping: 12, stiffness: 200 }, durationInFrames: 18 });
  const europeScale = interpolate(europeP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const asiaP = spring({ frame: frame - F_ARC_AS_END, fps, config: { damping: 12, stiffness: 200 }, durationInFrames: 18 });
  const asiaScale = interpolate(asiaP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const { gta, sangomar, europe, asia } = dots;

  // Point de contrôle Bézier pour chaque arc
  const euCtrlX = (gta.x + europe.x) / 2 - 60;
  const euCtrlY = gta.y - 280;
  const asCtrlX = (gta.x + asia.x) / 2 + 100;
  const asCtrlY = gta.y - 60;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1520" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 55%, rgba(13,21,32,0.35) 100%)", pointerEvents: "none" }} />

      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>

        {/* Arc GTA → Europe */}
        {arcEuProgress > 0 && (
          <path
            d={arcPath(gta.x, gta.y, europe.x, europe.y, euCtrlX, euCtrlY)}
            stroke={GOLD} strokeWidth={2} fill="none"
            strokeDasharray={`${arcEuDash} ${ARC_EU_LENGTH}`}
            opacity={0.85}
          />
        )}

        {/* Arc GTA → Asie — traits pointillés pour distinguer */}
        {arcAsProgress > 0 && (
          <path
            d={arcPath(gta.x, gta.y, asia.x, asia.y, asCtrlX, asCtrlY)}
            stroke={GOLD} strokeWidth={1.5} fill="none" strokeDasharray={`${arcAsDash} ${ARC_AS_LENGTH}`}
            opacity={0.60}
          />
        )}

        {/* Dot Europe destination */}
        {europeScale > 0.01 && (
          <>
            <circle cx={europe.x} cy={europe.y} r={8 * europeScale} fill={GOLD} opacity={0.9} />
            <circle cx={europe.x} cy={europe.y} r={18 * europeScale} fill={GOLD} opacity={0.12} />
          </>
        )}

        {/* Dot Asie destination */}
        {asiaScale > 0.01 && (
          <>
            <circle cx={asia.x} cy={asia.y} r={7 * asiaScale} fill={GOLD} opacity={0.8} />
            <circle cx={asia.x} cy={asia.y} r={16 * asiaScale} fill={GOLD} opacity={0.10} />
          </>
        )}

        {/* Dot GTA — principal, ancré à la projection */}
        <circle cx={gta.x} cy={gta.y} r={16 * gtaScale} fill={GOLD} opacity={gtaGlow} />
        <circle cx={gta.x} cy={gta.y} r={32 * gtaScale} fill={GOLD} opacity={gtaGlow * 0.18} />

        {/* Dot Sangomar — secondaire */}
        <circle cx={sangomar.x} cy={sangomar.y} r={10} fill={GOLD} opacity={sangomarOpacity} />
        <circle cx={sangomar.x} cy={sangomar.y} r={20} fill={GOLD} opacity={sangomarOpacity * 0.15} />
      </svg>

      {/* Label destination Europe */}
      {europeScale > 0.3 && (
        <div style={{
          position: "absolute",
          left: europe.x + 14,
          top: europe.y - 10,
          opacity: europeScale,
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11, fontWeight: 600,
            color: GOLD, letterSpacing: "0.14em",
            textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            EUROPE
          </div>
        </div>
      )}

      {/* Label destination Asie / Golfe */}
      {asiaScale > 0.3 && (
        <div style={{
          position: "absolute",
          left: asia.x - 20,
          top: asia.y - 22,
          opacity: asiaScale,
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11, fontWeight: 600,
            color: GOLD, letterSpacing: "0.14em",
            textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            ASIE / GOLFE
          </div>
        </div>
      )}

      {/* Label frontière SN/MR — positionné relative au dot GTA projeté */}
      <div style={{
        position: "absolute",
        left: gta.x - 155,
        top: gta.y - 58,
        opacity: frontiereOpacity,
        transform: `translateX(${frontiereX}px)`,
        display: "flex", alignItems: "center", gap: 8,
        pointerEvents: "none",
      }}>
        <div style={{ width: 3, height: 20, backgroundColor: GOLD }} />
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 14, fontWeight: 600,
          color: "#f2ebd9", letterSpacing: "0.14em",
          textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          GTA / GAZ NATUREL
        </div>
      </div>

      {/* Label BP */}
      <div style={{
        position: "absolute",
        left: gta.x - 95,
        top: gta.y - 30,
        opacity: bpOpacity,
        transform: `translateY(${bpY}px)`,
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12, fontWeight: 400,
          color: "rgba(242,235,217,0.60)", letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}>
          BP — OPÉRATEUR
        </div>
      </div>

      {/* Date + 1ère cargaison */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 60,
        display: "flex", justifyContent: "center",
        opacity: dateOpacity, pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 22, fontWeight: 400,
          color: frame >= F_CARGAISON
            ? `rgba(200,169,81,${0.65 + cargaisonGlow * 0.35})`
            : "rgba(242,235,217,0.60)",
          letterSpacing: "0.2em", textTransform: "uppercase",
          textShadow: frame >= F_CARGAISON ? `0 0 ${20 * cargaisonGlow}px rgba(200,169,81,0.8)` : "none",
        }}>
          FÉV. 2025 — 1ÈRE CARGAISON
        </div>
      </div>

      {/* Production active */}
      <div style={{
        position: "absolute",
        left: gta.x - 115,
        top: gta.y + 26,
        opacity: prodOpacity,
        transform: `scale(${prodScale})`,
        transformOrigin: "left center",
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13, fontWeight: 600,
          color: GOLD, letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}>
          PRODUCTION ACTIVE
        </div>
      </div>

      {/* Fournisseur réel */}
      <div style={{
        position: "absolute", left: 0, right: 0,
        top: height * 0.38,
        display: "flex", justifyContent: "center",
        opacity: fournisseurOpacity,
        transform: `translateY(${fournisseurY}px)`,
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 20, fontWeight: 500,
          color: "rgba(242,235,217,0.80)", letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}>
          FOURNISSEUR RÉEL — EUROPE & ASIE
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Beat7;
