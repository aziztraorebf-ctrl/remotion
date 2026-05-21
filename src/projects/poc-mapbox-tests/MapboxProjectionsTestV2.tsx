/**
 * MapboxProjectionsTestV2 — POC complet pour Souverain Template C
 *
 * Itération 2 (post-feedback Aziz 2026-05-08) :
 * - Zoom large mondial pour vraiment exploiter equirectangulaire
 * - Style GeoAfriqueV5 validé Or Africain (water #1a3a5c, land #4a4a4a, borders #c8c8c8)
 * - Highlights pays Sahel (Ghana, Mali, Burkina, Niger) en couleurs distinctes
 * - Leader-pins animés sur capitales (réutilise pattern MarqueurPortrait/Pulse)
 * - 2 compositions : vertical 1080x1920 (Short) ET horizontal 1920x1080 (YouTube)
 *
 * Structure : 4 vues de 5s chacune (20s total)
 *   V1 (0-150f)   : Mercator + GeoAfriqueV5 + highlights + pins (référence)
 *   V2 (150-300f) : Equirectangular + GeoAfriqueV5 + highlights + pins
 *   V3 (300-450f) : Equirectangular + naturalEarth (compromis bonus)
 *   V4 (450-600f) : Equirectangular + winkelTripel (compromis bonus)
 *
 * Stack confirmé via Context7 2026-05-08 : Mapbox GL JS v3.x supporte nativement
 * mercator, equirectangular, naturalEarth, winkelTripel, equalEarth, albers,
 * lambertConformalConic, globe.
 */
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  addCountryHighlight,
  applyGeoAfriqueV5,
  ISO,
  MapboxBrandingHide,
  removeLabels,
} from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// 4 vues x 5s @ 30fps = 600 frames
export const MAPBOX_PROJECTIONS_V2_FRAMES = 600;
const VIEW_FRAMES = 150;

// Vue large mondiale centrée Afrique (lon=20, lat=10)
// Zoom 1.0 = planisphère complet en horizontal
// Pour vertical 1080x1920, ratio implique zoom 1.4 pour remplir
const WORLD_VIEW_CENTER: [number, number] = [20, 10];
const ZOOM_HORIZONTAL = 1.0;
const ZOOM_VERTICAL = 1.4;

// Pays Sahel highlights — couleurs distinctes (palette ledger Or Africain)
type CountryHighlight = { iso: string; color: string; nom: string };
const HIGHLIGHTS: CountryHighlight[] = [
  { iso: ISO.GHANA,   color: "#f5d547", nom: "Ghana" },     // or
  { iso: ISO.MALI,    color: "#e89b3c", nom: "Mali" },      // orange
  { iso: ISO.BURKINA, color: "#c47a28", nom: "Burkina" },   // ambre
  { iso: ISO.NIGER,   color: "#d4872a", nom: "Niger" },     // ocre
];

// Capitales pour leader-pins (lon, lat)
type Pin = { id: string; lon: number; lat: number; color: string; appearAt: number };
const PINS: Pin[] = [
  { id: "accra",       lon: -0.187,  lat:  5.604, color: "#f5d547", appearAt: 30  },
  { id: "bamako",      lon: -7.992,  lat: 12.640, color: "#e89b3c", appearAt: 50  },
  { id: "ouagadougou", lon: -1.535,  lat: 12.371, color: "#c47a28", appearAt: 70  },
  { id: "niamey",      lon:  2.118,  lat: 13.512, color: "#d4872a", appearAt: 90  },
];

// ---------------------------------------------------------------------------
// Hook : projection lon/lat → pixels (suit la map durant transitions)
// ---------------------------------------------------------------------------
const useProjection = (
  map: mapboxgl.Map | null,
  points: { lon: number; lat: number }[]
) => {
  const [positions, setPositions] = useState<({ x: number; y: number } | null)[]>(
    points.map(() => null)
  );
  useEffect(() => {
    if (!map) return;
    const update = () => {
      setPositions(
        points.map(({ lon, lat }) => {
          const p = map.project([lon, lat]);
          return { x: p.x, y: p.y };
        })
      );
    };
    map.on("render", update);
    update();
    return () => {
      map.off("render", update);
    };
  }, [map]);
  return positions;
};

// ---------------------------------------------------------------------------
// Pin animé (cercle + pulse + label)
// ---------------------------------------------------------------------------
const LeaderPin: React.FC<{
  color: string;
  elapsed: number;
  frame: number;
}> = ({ color, elapsed, frame }) => {
  const scale = spring({ frame: Math.max(0, elapsed), fps: 30, config: { damping: 200 } });
  const op = interpolate(elapsed, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  // Pulse onde radar
  const cycle = (frame % 60) / 60;
  const pulseR = 12 + cycle * 28;
  const pulseOp = (1 - cycle) * 0.5;
  return (
    <g transform={`scale(${scale})`} opacity={op}>
      <circle r={pulseR} fill="none" stroke={color} strokeWidth={1.5} opacity={pulseOp} />
      <circle r={9} fill={color} opacity={0.9} />
      <circle r={3.5} fill="#1a1209" />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Vue carte avec projection + highlights + pins
// ---------------------------------------------------------------------------
type Projection = "mercator" | "equirectangular" | "naturalEarth" | "winkelTripel";

const MapViewWithEffects: React.FC<{
  projection: Projection;
  zoom: number;
  label: string;
  viewIndex: number; // pour delayRender unique
}> = ({ projection, zoom, label, viewIndex }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender(`mapbox-proj-v2-${projection}-${viewIndex}`));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: WORLD_VIEW_CENTER,
      zoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      preserveDrawingBuffer: true,
      projection,
    });

    map.on("style.load", () => {
      removeLabels(map);
      applyGeoAfriqueV5(map);
      // Highlights pays Sahel
      for (const h of HIGHLIGHTS) {
        addCountryHighlight(map, h.iso, h.color, 0.55, 1.5);
      }
      mapRef.current = map;
      setReady(true);
      continueRender(handle);
    });

    return () => map.remove();
  }, []);

  // Projection des pins
  const pinPositions = useProjection(
    mapRef.current,
    PINS.map((p) => ({ lon: p.lon, lat: p.lat }))
  );

  // Le frame "elapsed" pour les pins est relatif à la vue (0-150)
  // mais useCurrentFrame ici est relatif à la Sequence parente
  const localFrame = frame; // déjà relatif via Sequence

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />

      {ready && (
        <svg
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
          width={width}
          height={height}
        >
          {PINS.map((pin, i) => {
            const pos = pinPositions[i];
            if (!pos) return null;
            const elapsed = localFrame - pin.appearAt;
            if (elapsed < 0) return null;
            return (
              <g key={pin.id} transform={`translate(${pos.x}, ${pos.y})`}>
                <LeaderPin color={pin.color} elapsed={elapsed} frame={localFrame} />
              </g>
            );
          })}
        </svg>
      )}

      {/* Label vue */}
      {ready && (
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "#f0e8d8",
            fontFamily: "Georgia, serif",
            fontSize: 22,
            letterSpacing: 4,
            textShadow: "0 2px 8px rgba(0,0,0,0.85)",
          }}
        >
          {label}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Composition réutilisable — 4 vues séquentielles
// ---------------------------------------------------------------------------
const ProjectionsCarousel: React.FC<{ zoom: number }> = ({ zoom }) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={VIEW_FRAMES}>
        <MapViewWithEffects
          projection="mercator"
          zoom={zoom}
          label="MERCATOR — référence Or Africain"
          viewIndex={0}
        />
      </Sequence>
      <Sequence from={VIEW_FRAMES} durationInFrames={VIEW_FRAMES}>
        <MapViewWithEffects
          projection="equirectangular"
          zoom={zoom}
          label="EQUIRECTANGULAIRE — Plate Carrée"
          viewIndex={1}
        />
      </Sequence>
      <Sequence from={VIEW_FRAMES * 2} durationInFrames={VIEW_FRAMES}>
        <MapViewWithEffects
          projection="naturalEarth"
          zoom={zoom}
          label="NATURAL EARTH — compromis"
          viewIndex={2}
        />
      </Sequence>
      <Sequence from={VIEW_FRAMES * 3} durationInFrames={VIEW_FRAMES}>
        <MapViewWithEffects
          projection="winkelTripel"
          zoom={zoom}
          label="WINKEL TRIPEL — compromis premium"
          viewIndex={3}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Composition VERTICAL (Short 1080x1920)
// ---------------------------------------------------------------------------
export const MapboxProjectionsV2Vertical: React.FC = () => {
  return <ProjectionsCarousel zoom={ZOOM_VERTICAL} />;
};

// ---------------------------------------------------------------------------
// Composition HORIZONTAL (YouTube classique 1920x1080)
// ---------------------------------------------------------------------------
export const MapboxProjectionsV2Horizontal: React.FC = () => {
  return <ProjectionsCarousel zoom={ZOOM_HORIZONTAL} />;
};
