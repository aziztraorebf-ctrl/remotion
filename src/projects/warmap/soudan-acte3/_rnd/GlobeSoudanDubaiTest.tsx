/**
 * PROTO ISOLÉ — Globe Mapbox rotatif night-mode, style "flow map" (référence _incoming/globe trial.mov).
 * Teste : globe sombre + étoiles + connexion pointillée cyan Darfour→Dubaï en overlay SVG.
 *
 * ⚠️ Bug connu (memory/rules-outils-techniques.md) : en mode globe HEADLESS, les vrais layers
 * Mapbox fill/circle ne s'appliquent pas de façon fiable. Ce proto contourne : AUCUN layer
 * Mapbox custom (fill/circle/line) n'est ajouté — tout point/label/connexion est dessiné en
 * overlay SVG React via map.project(), même pattern que GeoFlowConnection + GlobeLocationReveal.
 *
 * Complètement séparé de SoudanActe3.tsx — ne PAS toucher au beat réel depuis ce fichier.
 */

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
import { GeoFlowConnection } from "../../_shared/GeoFlowConnection";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const GLOBE_SOUDAN_DUBAI_TEST_FRAMES = 165; // 5.5s @ 30fps

const DARFOUR: [number, number] = [23.706, 13.834];
const DUBAI: [number, number] = [55.27, 25.2];
// Point intermédiaire pour une courbe douce (pas juste [A,B]) — approx Mer Rouge / golfe.
const MIDPOINT: [number, number] = [40, 18];

// Centre caméra ~ milieu du trajet Darfour-Dubaï, légèrement au-dessus pour cadrer les deux points.
const CAM_CENTER: [number, number] = [38, 20];

const CYAN = "#4de8ff";

export const GlobeSoudanDubaiTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Globe Soudan-Dubai test"));
  const [ready, setReady] = useState(false);
  const [tick, setTick] = useState(0); // force re-render pour recalculer map.project() a chaque frame
  const [darfourScreen, setDarfourScreen] = useState<{ x: number; y: number } | null>(null);
  const [dubaiScreen, setDubaiScreen] = useState<{ x: number; y: number } | null>(null);

  // Init map — 1 seule fois
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      projection: { name: "globe" },
      center: CAM_CENTER,
      zoom: 1.9,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      // Atmosphere night-mode — fond noir spatial, etoiles visibles (memes valeurs que style "souverain"
      // mais horizon-blend plus faible pour un terrain plus sombre/estompe, plus proche de la reference).
      map.setFog({
        color: "#050b1a",
        "high-color": "#0d1730",
        "horizon-blend": 0.03,
        "space-color": "#000000",
        "star-intensity": 0.85,
      });

      // Cacher tous les labels/symboles du style de base (on gere nos propres labels en overlay SVG/HTML).
      const layers = map.getStyle().layers ?? [];
      for (const l of layers) {
        if (l.type === "symbol") map.setLayoutProperty(l.id, "visibility", "none");
      }

      // Assombrir davantage le terrain/eau pour matcher le bleu nuit tres sombre de la reference
      // (contournement 100% via paint-property standard du style de base, PAS un nouveau layer fill).
      try {
        if (map.getLayer("water")) {
          map.setPaintProperty("water", "fill-color", "#03060f");
        }
        if (map.getLayer("land")) {
          map.setPaintProperty("land", "background-color", "#0a1220");
        }
        if (map.getLayer("background")) {
          map.setPaintProperty("background", "background-color", "#03060f");
        }
        // Frontieres fines grises a peine visibles
        if (map.getLayer("admin-0-boundary")) {
          map.setPaintProperty("admin-0-boundary", "line-color", "#3a4a5f");
          map.setPaintProperty("admin-0-boundary", "line-opacity", 0.5);
        }
        if (map.getLayer("admin-1-boundary")) {
          map.setPaintProperty("admin-1-boundary", "line-opacity", 0.15);
        }
      } catch {
        // layers absents selon version du style — pas bloquant, overlay SVG reste la source de verite visuelle
      }

      setReady(true);
      continueRender(handle);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handle]);

  // Drive camera par frame : rotation lente continue (bearing) + leger zoom-in, façon "globe trial.mov"
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    // Rotation lente : ~25deg sur toute la duree (mouvement doux, pas un tour complet)
    const bearing = interpolate(frame, [0, durationInFrames], [-12, 13], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const zoom = interpolate(frame, [0, durationInFrames], [1.75, 2.05], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    map.jumpTo({
      center: CAM_CENTER,
      zoom,
      bearing,
      pitch: 0,
    });

    setDarfourScreen(map.project(DARFOUR));
    setDubaiScreen(map.project(DUBAI));
    setTick((t) => t + 1);
  }, [frame, ready, durationInFrames]);

  // Connexion : tracé se dessine entre frame 40 et 130, marqueur suit
  const connProgress = interpolate(frame, [40, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const darfourGlow = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dubaiGlow = interpolate(frame, [100, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = 1 + 0.15 * Math.sin(frame * 0.15);

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <div
        ref={containerRef}
        style={{ position: "absolute", top: 0, left: 0, width, height }}
      />
      <style>{`.mapboxgl-ctrl-attrib, .mapboxgl-ctrl-logo { display: none !important; }`}</style>

      {/* Overlay SVG — connexion pointillee + marqueur (contournement bug layers headless) */}
      {ready && mapRef.current && (
        <GeoFlowConnection
          map={mapRef.current}
          waypoints={[DARFOUR, MIDPOINT, DUBAI]}
          progress={connProgress}
          markerProgress={connProgress}
          lineColor={CYAN}
          markerColor={CYAN}
          markerIcon="dot"
          markerSize={6}
          dashOffsetFrame={frame}
          width={width}
          height={height}
        />
      )}

      {/* Overlay SVG — points lumineux + labels (contournement : PAS de layer Mapbox circle) */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {darfourScreen && darfourGlow > 0.01 && (
          <g opacity={darfourGlow}>
            <circle
              cx={darfourScreen.x}
              cy={darfourScreen.y}
              r={16 * pulse}
              fill={CYAN}
              opacity={0.25}
            />
            <circle cx={darfourScreen.x} cy={darfourScreen.y} r={5} fill={CYAN} />
            <circle
              cx={darfourScreen.x}
              cy={darfourScreen.y}
              r={5}
              fill="none"
              stroke="#ffffff"
              strokeWidth={1}
            />
            <text
              x={darfourScreen.x}
              y={darfourScreen.y - 22}
              textAnchor="middle"
              fontFamily="'Bebas Neue', 'Impact', sans-serif"
              fontSize={26}
              fontWeight={700}
              fill="#ffffff"
              letterSpacing="0.08em"
            >
              SOUDAN
            </text>
            <text
              x={darfourScreen.x}
              y={darfourScreen.y + 24}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', 'Courier New', monospace"
              fontSize={13}
              fill={CYAN}
              letterSpacing="0.15em"
            >
              DARFOUR
            </text>
          </g>
        )}

        {dubaiScreen && dubaiGlow > 0.01 && (
          <g opacity={dubaiGlow}>
            <circle
              cx={dubaiScreen.x}
              cy={dubaiScreen.y}
              r={16 * pulse}
              fill={CYAN}
              opacity={0.25}
            />
            <circle cx={dubaiScreen.x} cy={dubaiScreen.y} r={5} fill={CYAN} />
            <circle
              cx={dubaiScreen.x}
              cy={dubaiScreen.y}
              r={5}
              fill="none"
              stroke="#ffffff"
              strokeWidth={1}
            />
            <text
              x={dubaiScreen.x}
              y={dubaiScreen.y - 22}
              textAnchor="middle"
              fontFamily="'Bebas Neue', 'Impact', sans-serif"
              fontSize={26}
              fontWeight={700}
              fill="#ffffff"
              letterSpacing="0.08em"
            >
              DUBAÏ
            </text>
            <text
              x={dubaiScreen.x}
              y={dubaiScreen.y + 24}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', 'Courier New', monospace"
              fontSize={13}
              fill={CYAN}
              letterSpacing="0.15em"
            >
              EMIRATS ARABES UNIS
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

export default GlobeSoudanDubaiTest;
