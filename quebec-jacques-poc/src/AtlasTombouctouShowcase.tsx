import { AbsoluteFill, useCurrentFrame, useVideoConfig, delayRender, continueRender, interpolate, Easing, spring, Audio, Sequence, Img, staticFile } from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import parcheminReliefStyle from "../mapbox-styles/atlas-parchemin-mande-relief.json";
import maliPolygonData from "./mali-polygon.json";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const TOMBOUCTOU_LON = -3.0026;
const TOMBOUCTOU_LAT = 16.7666;

const SIJILMASA_LON = -4.2833;
const SIJILMASA_LAT = 31.2833;

const MALI_CENTER_LON = -2.0;
const MALI_CENTER_LAT = 17.5;

// Contour Mali — Natural Earth 50m haute precision (474 points, fidelite BBC/NatGeo)
const MALI_POLYGON = maliPolygonData as [number, number][];

const FPS = 30;

const T = {
  start: 0,
  questionEnd: 0.7 * FPS,
  treizemeStart: 1.54 * FPS,
  africaineEnd: 3.98 * FPS,
  oxfordHook: 5.52 * FPS,
  tombouctouAppears: 6.98 * FPS,
  maliConverge: 8.78 * FPS,
  carrefour: 10.04 * FPS,
  marocStart: 12.82 * FPS,
  bibliotheque: 14.14 * FPS,
  sankoreAppears: 15.22 * FPS,
  vingtCinqMille: 16.56 * FPS,
  oxfordStat: 19.14 * FPS,
  universite: 21.58 * FPS,
  sorbonneEnd: 24.84 * FPS,
};

const DURATION_FRAMES = Math.ceil(26 * FPS);

type CameraKeyframe = { frame: number; lon: number; lat: number; zoom: number; pitch: number; bearing: number };

const KEYFRAMES: CameraKeyframe[] = [
  { frame: 0,                       lon: 5,             lat: 18,             zoom: 1.5, pitch: 0,  bearing: 0 },
  { frame: T.tombouctouAppears,     lon: 0,             lat: 17,             zoom: 3.5, pitch: 25, bearing: 5 },
  { frame: T.sankoreAppears,        lon: TOMBOUCTOU_LON, lat: TOMBOUCTOU_LAT, zoom: 5.0, pitch: 45, bearing: 12 },
  { frame: DURATION_FRAMES,         lon: TOMBOUCTOU_LON, lat: TOMBOUCTOU_LAT, zoom: 5.5, pitch: 55, bearing: 18 },
];

const interpKey = (frame: number, axis: keyof Omit<CameraKeyframe, "frame">): number => {
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      return interpolate(frame, [a.frame, b.frame], [a[axis], b[axis]], {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1][axis];
};

export type AtlasShowcaseProps = {
  musicVariant?: "A-sahara-ambient" | "B-cesar-epique" | "C-mande-contemplatif" | "none";
};

export const AtlasTombouctouShowcase: React.FC<AtlasShowcaseProps> = ({ musicVariant = "none" }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Atlas showcase render"));
  const [ready, setReady] = useState(false);
  const [tombouctouPx, setTombouctouPx] = useState<{ x: number; y: number } | null>(null);
  const [sijilmasaPx, setSijilmasaPx] = useState<{ x: number; y: number } | null>(null);
  const [maliCenterPx, setMaliCenterPx] = useState<{ x: number; y: number } | null>(null);
  const [maliPolyPx, setMaliPolyPx] = useState<string>("");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: parcheminReliefStyle as mapboxgl.StyleSpecification,
      projection: { name: "globe" },
      center: [KEYFRAMES[0].lon, KEYFRAMES[0].lat],
      zoom: KEYFRAMES[0].zoom,
      pitch: KEYFRAMES[0].pitch,
      bearing: KEYFRAMES[0].bearing,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      map.setFog({
        "color": "rgba(242, 229, 200, 0.55)",
        "high-color": "rgba(168, 90, 58, 0.45)",
        "horizon-blend": 0.12,
        "space-color": "rgba(31, 42, 74, 0.95)",
        "star-intensity": 0.4,
      });
      map.setTerrain({ source: "mapbox-terrain-dem", exaggeration: 1.5 });
    });

    map.on("load", () => {
      const waitIdle = () => {
        if (map.areTilesLoaded() && map.isStyleLoaded()) {
          setReady(true);
          continueRender(handle);
        } else {
          map.once("idle", waitIdle);
        }
      };
      waitIdle();
    });
  }, [handle]);

  const lon = interpKey(frame, "lon");
  const lat = interpKey(frame, "lat");
  const zoom = interpKey(frame, "zoom");
  const pitch = interpKey(frame, "pitch");
  const bearing = interpKey(frame, "bearing");

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const targetProjection = zoom >= 4.2 ? "mercator" : "globe";
    const currentProjection = mapRef.current.getProjection().name;
    if (currentProjection !== targetProjection) {
      mapRef.current.setProjection({ name: targetProjection });
    }
    mapRef.current.jumpTo({ center: [lon, lat], zoom, pitch, bearing });
    const t = mapRef.current.project([TOMBOUCTOU_LON, TOMBOUCTOU_LAT]);
    const s = mapRef.current.project([SIJILMASA_LON, SIJILMASA_LAT]);
    const m = mapRef.current.project([MALI_CENTER_LON, MALI_CENTER_LAT]);
    setTombouctouPx({ x: t.x, y: t.y });
    setSijilmasaPx({ x: s.x, y: s.y });
    setMaliCenterPx({ x: m.x, y: m.y });

    // Projeter le contour Mali en pixels pour overlay SVG React
    const pts = MALI_POLYGON.map(([lo, la]) => {
      const p = mapRef.current!.project([lo, la]);
      return `${p.x},${p.y}`;
    });
    setMaliPolyPx(pts.join(" "));
  }, [frame, lon, lat, zoom, pitch, bearing, ready]);

  if (!MAPBOX_TOKEN) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#222", color: "white", padding: 40, fontSize: 24 }}>
        REMOTION_MAPBOX_TOKEN env var manquante.
      </AbsoluteFill>
    );
  }

  // Marker Tombouctou (apparait au mot "Tombouctou")
  const markerProgress = spring({
    frame: frame - T.tombouctouAppears,
    fps,
    config: { damping: 12, stiffness: 200 },
    durationInFrames: 30,
  });
  const pulsePhase = (frame - T.tombouctouAppears) > 0 ? ((frame - T.tombouctouAppears) % 30) / 30 : 0;
  const pulseScale = interpolate(pulsePhase, [0, 1], [1, 2.5]);
  const pulseOpacity = interpolate(pulsePhase, [0, 1], [0.7, 0]);

  // Tracé caravane (apparait au mot "Maroc")
  const routeProgress = spring({
    frame: frame - T.marocStart,
    fps,
    config: { damping: 30, stiffness: 80 },
    durationInFrames: 60,
  });

  // Mosquee Sankore (apparait au mot "Sankoré")
  const mosqueProgress = spring({
    frame: frame - T.sankoreAppears,
    fps,
    config: { damping: 14, stiffness: 180 },
    durationInFrames: 30,
  });

  // Cartouche stat (apparait au mot "Vingt-cinq mille")
  const cartoucheProgress = spring({
    frame: frame - T.vingtCinqMille,
    fps,
    config: { damping: 15, stiffness: 150 },
    durationInFrames: 35,
  });

  // Drapeau Mali (apparait au mot "Mali" = T.maliConverge)
  const flagProgress = spring({
    frame: frame - T.maliConverge,
    fps,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 25,
  });

  const maliOpacity = interpolate(
    frame,
    [T.maliConverge, T.maliConverge + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const showMarker = frame >= T.tombouctouAppears && tombouctouPx;
  const showRoute = frame >= T.marocStart && tombouctouPx && sijilmasaPx;
  const showMosque = frame >= T.sankoreAppears && tombouctouPx;
  const showCartouche = frame >= T.vingtCinqMille;
  const showMali = frame >= T.maliConverge && maliPolyPx;
  const showFlag = frame >= T.maliConverge && maliCenterPx;

  return (
    <AbsoluteFill style={{ backgroundColor: "#1F2A4A" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute", top: 0, left: 0 }} />

      <Audio src={staticFile("atlas-tombouctou/narration-v1.mp3")} volume={1} />

      {musicVariant !== "none" && (
        <Audio src={staticFile(`atlas-tombouctou/music/${musicVariant}.mp3`)} volume={0.04} />
      )}

      <Sequence from={Math.round(T.tombouctouAppears - 3)} durationInFrames={Math.round(0.8 * FPS)}>
        <Audio src={staticFile("atlas-tombouctou/sfx/B-tombouctou-impact.mp3")} volume={0.6} />
      </Sequence>

      <Sequence from={Math.round(T.marocStart)} durationInFrames={Math.round(2.2 * FPS)}>
        <Audio src={staticFile("atlas-tombouctou/sfx/C-caravane-ink-draw.mp3")} volume={0.85} />
      </Sequence>

      <Sequence from={Math.round(T.vingtCinqMille - 3)} durationInFrames={Math.round(0.7 * FPS)}>
        <Audio src={staticFile("atlas-tombouctou/sfx/D-cartouche-thud.mp3")} volume={1.5} />
      </Sequence>

      {/* Overlay SVG Mali — coloration React par-dessus la carte */}
      {showMali && (
        <svg
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox={`0 0 ${width} ${height}`}
        >
          <defs>
            <filter id="mali-glow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Fill indigo */}
          <polygon
            points={maliPolyPx}
            fill="#1F2A4A"
            fillOpacity={maliOpacity * 0.65}
          />
          {/* Bordure dorée lumineuse */}
          <polyline
            points={maliPolyPx}
            fill="none"
            stroke="#D4A574"
            strokeWidth="5"
            strokeOpacity={maliOpacity * 0.95}
            strokeLinejoin="round"
            filter="url(#mali-glow)"
          />
        </svg>
      )}

      {/* Trace route caravaniere Sijilmasa -> Tombouctou */}
      {showRoute && (
        <svg
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox={`0 0 ${width} ${height}`}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <line
            x1={sijilmasaPx.x}
            y1={sijilmasaPx.y}
            x2={sijilmasaPx.x + (tombouctouPx.x - sijilmasaPx.x) * routeProgress}
            y2={sijilmasaPx.y + (tombouctouPx.y - sijilmasaPx.y) * routeProgress}
            stroke="#D4A574"
            strokeWidth="6"
            strokeDasharray="14 8"
            strokeLinecap="round"
            filter="url(#glow)"
            opacity={0.9}
          />
        </svg>
      )}

      {/* Marker Tombouctou */}
      {showMarker && (
        <>
          <div
            style={{
              position: "absolute",
              left: tombouctouPx.x - 30,
              top: tombouctouPx.y - 30,
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#D4A574",
              transform: `scale(${pulseScale})`,
              opacity: pulseOpacity,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: tombouctouPx.x - 18,
              top: tombouctouPx.y - 18,
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "#D4A574",
              border: "4px solid #F2E5C8",
              transform: `scale(${markerProgress})`,
              boxShadow: "0 0 20px rgba(212, 165, 116, 0.9)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: tombouctouPx.x - 250,
              top: tombouctouPx.y - 90,
              width: 500,
              textAlign: "center",
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 900,
              fontSize: 64,
              color: "#F2E5C8",
              letterSpacing: 4,
              textShadow: "0 2px 6px rgba(0,0,0,0.95), 0 0 14px rgba(31,42,74,1)",
              opacity: markerProgress,
              pointerEvents: "none",
            }}
          >
            TOMBOUCTOU
          </div>
        </>
      )}

      {/* Mosquee Sankore en medaillon circulaire */}
      {showMosque && (
        <div
          style={{
            position: "absolute",
            left: tombouctouPx.x - 130,
            top: tombouctouPx.y + 40,
            width: 260,
            height: 260,
            borderRadius: "50%",
            backgroundColor: "#1F2A4A",
            border: "5px solid #D4A574",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${mosqueProgress})`,
            opacity: mosqueProgress,
            boxShadow: "0 8px 24px rgba(0,0,0,0.7), 0 0 30px rgba(212, 165, 116, 0.4)",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <Img
            src={staticFile("atlas-tombouctou/mosquee-sankore.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {/* Cartouche stat */}
      {showCartouche && (
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            bottom: 200,
            backgroundColor: "rgba(31, 42, 74, 0.92)",
            border: "3px solid #D4A574",
            borderRadius: 16,
            padding: "32px 28px",
            transform: `translateY(${interpolate(cartoucheProgress, [0, 1], [80, 0])}px)`,
            opacity: cartoucheProgress,
            boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 900,
              fontSize: 110,
              color: "#D4A574",
              letterSpacing: 2,
              lineHeight: 1.0,
              textShadow: "0 0 12px rgba(212, 165, 116, 0.4)",
            }}
          >
            25 000
          </div>
          <div
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 46,
              color: "#F2E5C8",
              letterSpacing: 3,
              marginTop: 8,
            }}
          >
            ÉTUDIANTS
          </div>
          <div
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 400,
              fontSize: 28,
              color: "rgba(242, 229, 200, 0.85)",
              marginTop: 16,
              fontStyle: "italic",
            }}
          >
            Plus que Oxford à la même époque
          </div>
        </div>
      )}

      {/* Drapeau Mali flottant au-dessus du centroide */}
      {showFlag && (
        <div
          style={{
            position: "absolute",
            left: maliCenterPx.x - 36,
            top: maliCenterPx.y - 130,
            transform: `scale(${flagProgress})`,
            transformOrigin: "bottom center",
            opacity: flagProgress,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.8))",
          }}
        >
          {/* Drapeau 3 bandes verticales en haut */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: 72,
              height: 48,
              border: "2px solid rgba(212,165,116,0.7)",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
              marginLeft: 4,
            }}
          >
            <div style={{ flex: 1, backgroundColor: "#009A00" }} />
            <div style={{ flex: 1, backgroundColor: "#FCD116" }} />
            <div style={{ flex: 1, backgroundColor: "#CF0028" }} />
          </div>
          {/* Hampe verticale en bas */}
          <div
            style={{
              width: 3,
              height: 44,
              backgroundColor: "#D4A574",
              borderRadius: 2,
              marginLeft: 6,
            }}
          />
        </div>
      )}

    </AbsoluteFill>
  );
};

export const ATLAS_SHOWCASE_DURATION_FRAMES = DURATION_FRAMES;
