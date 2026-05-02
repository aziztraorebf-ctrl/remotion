import { AbsoluteFill, useCurrentFrame, useVideoConfig, delayRender, continueRender, interpolate, Easing, spring, Audio, Sequence, Img, staticFile } from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import parcheminReliefStyle from "../mapbox-styles/atlas-parchemin-mande-relief.json";
import maliModernPolygonData from "./mali-polygon.json";
import maliEmpire1300Data from "./mali-empire-1300-polygon.json";
import egyptPolygonData from "./egypt-polygon.json";
import { T, DURATION_FRAMES, COORDS, SFX_VOLUMES, MUSIC_VOLUME_DEFAULT, MUSIC_VOLUME_DUCKED } from "./timing-mansa-moussa";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const MALI_MODERN = maliModernPolygonData as [number, number][];
const MALI_EMPIRE_1300 = maliEmpire1300Data as [number, number][];
const EGYPT = egyptPolygonData as [number, number][];

const FPS = 30;

type CameraKeyframe = { frame: number; lon: number; lat: number; zoom: number; pitch: number; bearing: number };

// Multi-segment fly-to: Globe Africa -> Mali zoom -> Sahara pitch 60 -> Caire -> Mecque
const KEYFRAMES: CameraKeyframe[] = [
  // F0: globe Afrique (Hook + Setup)
  { frame: 0,                          lon: 5,   lat: 18, zoom: 1.5, pitch: 0,  bearing: 0 },
  // F4s: zoom Mali (debut scene 1)
  { frame: T.maliAppears,              lon: -3,  lat: 17, zoom: 2.8, pitch: 25, bearing: 0 },
  // F11s: empire deborde (Empire historique apparait)
  { frame: T.empireSpread,             lon: -5,  lat: 16, zoom: 2.6, pitch: 30, bearing: 5 },
  // F23s: zoom Tombouctou (densite Cesar)
  { frame: T.tombouctouAppears,        lon: COORDS.tombouctou.lon, lat: COORDS.tombouctou.lat, zoom: 4.5, pitch: 40, bearing: 8 },
  // F27s: Sankore close
  { frame: T.sankoreAppears,           lon: COORDS.tombouctou.lon, lat: COORDS.tombouctou.lat, zoom: 5.2, pitch: 45, bearing: 12 },
  // F37s: Climax Hadj - retour vue Mali pour caravane
  { frame: T.douzeCouronnement,        lon: 0,   lat: 20, zoom: 3.5, pitch: 50, bearing: 5 },
  // F43s: Sahara traversee pitch 60
  { frame: T.soixanteHommes,           lon: 15,  lat: 23, zoom: 3.8, pitch: 60, bearing: 0 },
  // F47s: continuation Sahara
  { frame: T.chameaux,                 lon: 22,  lat: 25, zoom: 3.8, pitch: 60, bearing: -3 },
  // F54s: arrivee Caire
  { frame: T.caireArrival,             lon: COORDS.caire.lon, lat: COORDS.caire.lat, zoom: 4.5, pitch: 45, bearing: 0 },
  // F63s: vue Mediterraneeet Egypte (consequence)
  { frame: T.unSeulHomme,              lon: COORDS.caire.lon, lat: 28, zoom: 4.0, pitch: 35, bearing: 0 },
  // F67s: dezoom pour CTA portrait
  { frame: T.mansaReveal,              lon: -3,  lat: 17, zoom: 3.0, pitch: 25, bearing: 0 },
  // F80s: zoom final Mali rotation continue
  { frame: T.mansaFinal,               lon: -3,  lat: 17, zoom: 3.2, pitch: 30, bearing: 15 },
  // End
  { frame: DURATION_FRAMES,            lon: -3,  lat: 17, zoom: 3.2, pitch: 30, bearing: 18 },
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

// Micro-zoom Q2 Kimi: scene 2 densite, sync sur chiffres-choc
// Add small zoom punch at moitie/Tombouctou/Sankore
const microZoomBoost = (frame: number): number => {
  const punches = [
    { center: T.moitieOrFirst, amplitude: 0.15 },
    { center: T.moitieSerious, amplitude: 0.30 },
    { center: T.tombouctouAppears, amplitude: 0.20 },
    { center: T.sankoreAppears, amplitude: 0.20 },
  ];
  let boost = 0;
  for (const p of punches) {
    const dist = Math.abs(frame - p.center);
    if (dist < 12) {
      const factor = 1 - dist / 12;
      boost += p.amplitude * factor * factor;
    }
  }
  return boost;
};

export type MansaMoussaProps = {
  musicVariant?: "C-mande-contemplatif" | "none";
};

export const AtlasMansaMoussaShowcase: React.FC<MansaMoussaProps> = ({ musicVariant = "C-mande-contemplatif" }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mansa Moussa render"));
  const [ready, setReady] = useState(false);

  const [maliModernPx, setMaliModernPx] = useState<string>("");
  const [maliEmpirePx, setMaliEmpirePx] = useState<string>("");
  const [egyptPx, setEgyptPx] = useState<string>("");
  const [tombouctouPx, setTombouctouPx] = useState<{ x: number; y: number } | null>(null);
  const [cairePx, setCairePx] = useState<{ x: number; y: number } | null>(null);
  const [mecquePx, setMecquePx] = useState<{ x: number; y: number } | null>(null);
  const [nianiPx, setNianiPx] = useState<{ x: number; y: number } | null>(null);

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
  const zoomBase = interpKey(frame, "zoom");
  const zoom = zoomBase + microZoomBoost(frame);
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

    const projectPoly = (poly: [number, number][]) =>
      poly
        .map(([lo, la]) => {
          const p = mapRef.current!.project([lo, la]);
          return `${p.x},${p.y}`;
        })
        .join(" ");

    setMaliModernPx(projectPoly(MALI_MODERN));
    setMaliEmpirePx(projectPoly(MALI_EMPIRE_1300));
    setEgyptPx(projectPoly(EGYPT));

    const t = mapRef.current.project([COORDS.tombouctou.lon, COORDS.tombouctou.lat]);
    const c = mapRef.current.project([COORDS.caire.lon, COORDS.caire.lat]);
    const me = mapRef.current.project([COORDS.mecque.lon, COORDS.mecque.lat]);
    const n = mapRef.current.project([COORDS.niani.lon, COORDS.niani.lat]);
    setTombouctouPx({ x: t.x, y: t.y });
    setCairePx({ x: c.x, y: c.y });
    setMecquePx({ x: me.x, y: me.y });
    setNianiPx({ x: n.x, y: n.y });
  }, [frame, lon, lat, zoom, pitch, bearing, ready]);

  if (!MAPBOX_TOKEN) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#222", color: "white", padding: 40, fontSize: 24 }}>
        REMOTION_MAPBOX_TOKEN env var manquante.
      </AbsoluteFill>
    );
  }

  // ============ ANIMATIONS ============

  // Empire 1300 fade in / out (scene 1 setup)
  const empireOpacity = interpolate(
    frame,
    [T.empireSpread - 5, T.empireSpread + 25, T.tombouctouAppears - 15, T.tombouctouAppears + 5],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Mali moderne (scene 1 + reapparition scene 5)
  const maliModernOpacity = interpolate(
    frame,
    [T.empireSpread + 15, T.empireSpread + 35, T.tombouctouAppears - 5, T.tombouctouAppears + 5,
     T.mansaReveal - 5, T.mansaReveal + 15, DURATION_FRAMES],
    [0, 1, 1, 0, 0, 0.7, 0.7],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Egypte (scene 4 effondrement)
  const egyptOpacity = interpolate(
    frame,
    [T.caireArrival - 5, T.caireArrival + 20, T.unSeulHomme + 30, T.unSeulHomme + 50],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Mention "Empire XIVe siecle" (2-3s)
  const mentionEmpireOpacity = interpolate(
    frame,
    [T.empireSpread + 10, T.empireSpread + 25, T.empireSpread + 80, T.empireSpread + 100],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ============ AUDIO LEVELS ============

  // Music volume ducks during "Un seul homme. Un continent qui s'effondre." [serious]
  const musicVolume = interpolate(
    frame,
    [T.unSeulHomme - 10, T.unSeulHomme, T.continentEffondre + 30, T.continentEffondre + 50],
    [MUSIC_VOLUME_DEFAULT, MUSIC_VOLUME_DUCKED, MUSIC_VOLUME_DUCKED, MUSIC_VOLUME_DEFAULT],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ============ DESATURATION SCENE 4 [serious] (Q3 Kimi) ============
  const desaturation = interpolate(
    frame,
    [T.unSeulHomme - 5, T.unSeulHomme + 15, T.continentEffondre + 30, T.continentEffondre + 50],
    [0, 0.7, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ============ PARTICULES OR HOOK (0.7s -> 2.7s) ============
  const particulesActive = frame >= T.particulesOrStart && frame <= T.particulesOrStart + 60;

  // ============ SHOW FLAGS ============
  const showEmpire = empireOpacity > 0.01 && maliEmpirePx;
  const showMaliModern = maliModernOpacity > 0.01 && maliModernPx;
  const showEgypt = egyptOpacity > 0.01 && egyptPx;

  // Markers villes
  const tombouctouMarkerProgress = spring({
    frame: frame - T.tombouctouAppears,
    fps, config: { damping: 12, stiffness: 200 }, durationInFrames: 30,
  });
  const tombouctouPulsePhase = (frame - T.tombouctouAppears) > 0 ? ((frame - T.tombouctouAppears) % 30) / 30 : 0;
  const tombouctouPulseScale = interpolate(tombouctouPulsePhase, [0, 1], [1, 2.5]);
  const tombouctouPulseOpacity = interpolate(tombouctouPulsePhase, [0, 1], [0.7, 0]);

  const caireMarkerProgress = spring({
    frame: frame - T.caireArrival,
    fps, config: { damping: 12, stiffness: 200 }, durationInFrames: 30,
  });
  const cairePulsePhase = (frame - T.caireArrival) > 0 ? ((frame - T.caireArrival) % 30) / 30 : 0;
  const cairePulseScale = interpolate(cairePulsePhase, [0, 1], [1, 2.5]);
  const cairePulseOpacity = interpolate(cairePulsePhase, [0, 1], [0.7, 0]);

  // Mecque marker
  const mecqueMarkerProgress = spring({
    frame: frame - T.mecqueWord,
    fps, config: { damping: 12, stiffness: 200 }, durationInFrames: 30,
  });

  // Trace caravane Mali->Caire->Mecque (scene 3)
  const caravaneProgress = spring({
    frame: frame - T.douzeCouronnement,
    fps, config: { damping: 30, stiffness: 60 }, durationInFrames: 180,
  });

  // Cartouches stats (scene 2 + 3)
  const moitieCartouche = spring({
    frame: frame - T.moitieSerious, fps,
    config: { damping: 15, stiffness: 150 }, durationInFrames: 25,
  });
  const sankoreCartouche = spring({
    frame: frame - T.sankoreAppears, fps,
    config: { damping: 15, stiffness: 150 }, durationInFrames: 30,
  });
  const chamoCartouche = spring({
    frame: frame - T.chameaux, fps,
    config: { damping: 15, stiffness: 150 }, durationInFrames: 30,
  });
  const douzeAnsCartouche = spring({
    frame: frame - T.douzeAnsChute, fps,
    config: { damping: 15, stiffness: 150 }, durationInFrames: 30,
  });

  // Medaillon Gizeh (scene 4)
  const gizehProgress = spring({
    frame: frame - T.caireArrival, fps,
    config: { damping: 14, stiffness: 180 }, durationInFrames: 35,
  });
  const showGizeh = frame >= T.caireArrival && frame <= T.unSeulHomme + 20;

  // Portraits Mansa Moussa (scene 5 cross-fade)
  const portraitAOpacity = interpolate(
    frame,
    [T.mansaReveal - 5, T.mansaReveal + 15, T.pourtantPivot, T.pourtantPivot + 15],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const portraitBOpacity = interpolate(
    frame,
    [T.pourtantPivot, T.pourtantPivot + 20, DURATION_FRAMES],
    [0, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Freeze + dolly on "La moitie." [serious] (Q3 Kimi)
  const moitieZoomFreeze = interpolate(
    frame,
    [T.moitieSerious - 3, T.moitieSerious + 30],
    [0, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#1F2A4A" }}>
      {/* Map container with desaturation filter */}
      <div
        ref={containerRef}
        style={{
          width,
          height,
          position: "absolute",
          top: 0,
          left: 0,
          filter: desaturation > 0 ? `saturate(${1 - desaturation})` : "none",
        }}
      />

      {/* AUDIO */}
      <Audio src={staticFile("atlas-mansa-moussa/narration-v3.mp3")} volume={1} />
      {musicVariant !== "none" && (
        <Audio src={staticFile(`atlas-mansa-moussa/music/${musicVariant}.mp3`)} volume={() => musicVolume} />
      )}

      {/* SFX B - impact stamp Tombouctou */}
      <Sequence from={Math.max(0, T.tombouctouAppears - 3)} durationInFrames={Math.round(0.8 * FPS)}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/B-impact-stamp.mp3")} volume={SFX_VOLUMES.B_impact} />
      </Sequence>
      {/* SFX B - impact stamp Caire */}
      <Sequence from={Math.max(0, T.caireArrival - 3)} durationInFrames={Math.round(0.8 * FPS)}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/B-impact-stamp.mp3")} volume={SFX_VOLUMES.B_impact} />
      </Sequence>
      {/* SFX B - impact stamp Mecque */}
      <Sequence from={Math.max(0, T.mecqueWord - 3)} durationInFrames={Math.round(0.8 * FPS)}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/B-impact-stamp.mp3")} volume={SFX_VOLUMES.B_impact} />
      </Sequence>

      {/* SFX C - ink-draw caravane */}
      <Sequence from={Math.max(0, T.douzeCouronnement)} durationInFrames={Math.round(2.5 * FPS)}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/C-caravane-ink-draw.mp3")} volume={SFX_VOLUMES.C_inkdraw} />
      </Sequence>

      {/* SFX D - cartouches thud */}
      <Sequence from={Math.max(0, T.moitieSerious - 3)} durationInFrames={Math.round(0.7 * FPS)}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/D-cartouche-thud.mp3")} volume={SFX_VOLUMES.D_thud} />
      </Sequence>
      <Sequence from={Math.max(0, T.sankoreAppears - 3)} durationInFrames={Math.round(0.7 * FPS)}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/D-cartouche-thud.mp3")} volume={SFX_VOLUMES.D_thud} />
      </Sequence>
      <Sequence from={Math.max(0, T.chameaux - 3)} durationInFrames={Math.round(0.7 * FPS)}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/D-cartouche-thud.mp3")} volume={SFX_VOLUMES.D_thud} />
      </Sequence>
      <Sequence from={Math.max(0, T.douzeAnsChute - 3)} durationInFrames={Math.round(0.7 * FPS)}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/D-cartouche-thud.mp3")} volume={SFX_VOLUMES.D_thud} />
      </Sequence>

      {/* SFX E - vent Sahara (scene 3 traversee) */}
      <Sequence from={Math.max(0, T.soixanteHommes)} durationInFrames={Math.round(6 * FPS)}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/E-vent-sahara.mp3")} volume={SFX_VOLUMES.E_ventSahara} />
      </Sequence>

      {/* OVERLAY SVG : pays + caravane + markers */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <filter id="empire-glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="mali-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Empire Mali 1300 - pointille dore */}
        {showEmpire && (
          <g opacity={empireOpacity}>
            <polygon points={maliEmpirePx} fill="#D4A574" fillOpacity={0.28} />
            <polyline
              points={maliEmpirePx}
              fill="none"
              stroke="#D4A574"
              strokeWidth="3"
              strokeOpacity={0.9}
              strokeDasharray="14 7"
              filter="url(#empire-glow)"
            />
          </g>
        )}

        {/* Mali moderne - indigo plein */}
        {showMaliModern && (
          <g opacity={maliModernOpacity}>
            <polygon points={maliModernPx} fill="#1F2A4A" fillOpacity={0.55} />
            <polyline
              points={maliModernPx}
              fill="none"
              stroke="#D4A574"
              strokeWidth="4"
              strokeOpacity={0.95}
              filter="url(#mali-glow)"
            />
          </g>
        )}

        {/* Egypte - rouge translucide effondrement */}
        {showEgypt && (
          <g opacity={egyptOpacity}>
            <polygon points={egyptPx} fill="#A85A3A" fillOpacity={0.45} />
            <polyline
              points={egyptPx}
              fill="none"
              stroke="#A85A3A"
              strokeWidth="3"
              strokeOpacity={0.85}
              filter="url(#mali-glow)"
            />
          </g>
        )}

        {/* Trace caravane Niani -> Tombouctou -> Caire -> Mecque */}
        {nianiPx && tombouctouPx && cairePx && mecquePx && frame >= T.douzeCouronnement && (
          <g opacity={Math.min(1, caravaneProgress)}>
            {/* Path with stroke-dasharray progression */}
            <path
              d={`M ${nianiPx.x} ${nianiPx.y} Q ${(nianiPx.x + tombouctouPx.x) / 2 - 30} ${(nianiPx.y + tombouctouPx.y) / 2 - 50}, ${tombouctouPx.x} ${tombouctouPx.y} Q ${(tombouctouPx.x + cairePx.x) / 2} ${(tombouctouPx.y + cairePx.y) / 2 - 100}, ${cairePx.x} ${cairePx.y} Q ${(cairePx.x + mecquePx.x) / 2 + 20} ${(cairePx.y + mecquePx.y) / 2 + 50}, ${mecquePx.x} ${mecquePx.y}`}
              fill="none"
              stroke="#D4A574"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="2000"
              strokeDashoffset={2000 * (1 - caravaneProgress)}
              filter="url(#line-glow)"
            />
          </g>
        )}

        {/* Pulse markers villes */}
        {tombouctouPx && frame >= T.tombouctouAppears && frame < T.douzeCouronnement && (
          <g>
            <circle
              cx={tombouctouPx.x}
              cy={tombouctouPx.y}
              r={20 * tombouctouPulseScale}
              fill="none"
              stroke="#D4A574"
              strokeWidth="3"
              opacity={tombouctouPulseOpacity}
            />
            <circle
              cx={tombouctouPx.x}
              cy={tombouctouPx.y}
              r={14 * tombouctouMarkerProgress}
              fill="#D4A574"
              opacity={0.95}
            />
          </g>
        )}

        {cairePx && frame >= T.caireArrival && (
          <g>
            <circle
              cx={cairePx.x}
              cy={cairePx.y}
              r={20 * cairePulseScale}
              fill="none"
              stroke="#A85A3A"
              strokeWidth="3"
              opacity={cairePulseOpacity}
            />
            <circle
              cx={cairePx.x}
              cy={cairePx.y}
              r={14 * caireMarkerProgress}
              fill="#A85A3A"
              opacity={0.95}
            />
          </g>
        )}

        {mecquePx && frame >= T.mecqueWord && frame < T.caireArrival && (
          <g>
            <circle
              cx={mecquePx.x}
              cy={mecquePx.y}
              r={14 * mecqueMarkerProgress}
              fill="#D4A574"
              opacity={0.95}
            />
          </g>
        )}
      </svg>

      {/* PARTICULES OR HOOK (1-3s, 8 particules) */}
      {particulesActive && (
        <svg
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox={`0 0 ${width} ${height}`}
        >
          {Array.from({ length: 8 }).map((_, i) => {
            const startX = 200 + i * 90;
            const startFrame = T.particulesOrStart + i * 3;
            const localFrame = frame - startFrame;
            if (localFrame < 0 || localFrame > 50) return null;
            const y = interpolate(localFrame, [0, 50], [-100, height * 0.7]);
            const opacity = interpolate(localFrame, [0, 10, 40, 50], [0, 1, 1, 0]);
            const radius = 12 + (i % 3) * 4;
            return (
              <circle
                key={i}
                cx={startX}
                cy={y}
                r={radius}
                fill="#D4A574"
                opacity={opacity}
                filter="url(#line-glow)"
              />
            );
          })}
        </svg>
      )}

      {/* MENTION EMPIRE 1300 (3s scene 1) */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: mentionEmpireOpacity,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 400,
          fontSize: 22,
          color: "#F2E5C8",
          letterSpacing: 1.0,
          textShadow: "0 2px 8px rgba(0,0,0,0.85)",
          padding: "0 60px",
          lineHeight: 1.4,
        }}
      >
        Empire du Mali XIVe siecle
        <br />
        <span style={{ fontSize: 16, opacity: 0.75 }}>
          (Bordure pointillee : limite historique)
        </span>
      </div>

      {/* CARTOUCHE "LA MOITIE" (scene 2 [serious]) */}
      {moitieCartouche > 0.01 && frame >= T.moitieSerious - 3 && frame < T.tombouctouAppears - 5 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${moitieCartouche})`,
            backgroundColor: "rgba(31,42,74,0.92)",
            border: "4px solid #D4A574",
            borderRadius: 24,
            padding: "30px 60px",
            color: "#F2E5C8",
            fontFamily: "'Cormorant Garamond', 'Cinzel', serif",
            fontWeight: 700,
            fontSize: 130,
            lineHeight: 1,
            textShadow: "0 4px 16px rgba(0,0,0,0.9)",
            letterSpacing: 2,
          }}
        >
          ½
          <div style={{ fontSize: 24, marginTop: 12, fontWeight: 400, letterSpacing: 3, color: "#D4A574" }}>
            DE L'OR MONDIAL
          </div>
        </div>
      )}

      {/* CARTOUCHE SANKORE 25 000 */}
      {sankoreCartouche > 0.01 && frame >= T.sankoreAppears - 3 && frame < T.douzeCouronnement - 5 && (
        <div
          style={{
            position: "absolute",
            bottom: 200,
            left: 60,
            right: 60,
            transform: `scale(${sankoreCartouche})`,
            transformOrigin: "center bottom",
            backgroundColor: "rgba(31,42,74,0.92)",
            border: "3px solid #D4A574",
            borderRadius: 18,
            padding: "20px 30px",
            color: "#F2E5C8",
            fontFamily: "'Cormorant Garamond', 'Cinzel', serif",
            fontWeight: 700,
            fontSize: 28,
            textAlign: "center",
            textShadow: "0 3px 12px rgba(0,0,0,0.9)",
          }}
        >
          <div style={{ fontSize: 70, color: "#D4A574", marginBottom: 6 }}>25 000</div>
          <div style={{ fontSize: 22, fontWeight: 400, letterSpacing: 2 }}>ETUDIANTS A SANKORE</div>
        </div>
      )}

      {/* CARTOUCHE 12 TONNES (scene 3 chameaux) */}
      {chamoCartouche > 0.01 && frame >= T.chameaux - 3 && frame < T.caireArrival - 5 && (
        <div
          style={{
            position: "absolute",
            bottom: 200,
            left: 60,
            right: 60,
            transform: `scale(${chamoCartouche})`,
            transformOrigin: "center bottom",
            backgroundColor: "rgba(31,42,74,0.92)",
            border: "3px solid #D4A574",
            borderRadius: 18,
            padding: "20px 30px",
            color: "#F2E5C8",
            fontFamily: "'Cormorant Garamond', 'Cinzel', serif",
            fontWeight: 700,
            fontSize: 28,
            textAlign: "center",
            textShadow: "0 3px 12px rgba(0,0,0,0.9)",
          }}
        >
          <div style={{ fontSize: 70, color: "#D4A574", marginBottom: 6 }}>12 TONNES</div>
          <div style={{ fontSize: 22, fontWeight: 400, letterSpacing: 2 }}>D'OR PUR EN CARAVANE</div>
        </div>
      )}

      {/* CARTOUCHE 12 ANS (scene 4 chute) */}
      {douzeAnsCartouche > 0.01 && frame >= T.douzeAnsChute - 3 && frame < T.mansaReveal - 5 && (
        <div
          style={{
            position: "absolute",
            bottom: 200,
            left: 60,
            right: 60,
            transform: `scale(${douzeAnsCartouche})`,
            transformOrigin: "center bottom",
            backgroundColor: "rgba(31,42,74,0.92)",
            border: "3px solid #A85A3A",
            borderRadius: 18,
            padding: "20px 30px",
            color: "#F2E5C8",
            fontFamily: "'Cormorant Garamond', 'Cinzel', serif",
            fontWeight: 700,
            fontSize: 28,
            textAlign: "center",
            textShadow: "0 3px 12px rgba(0,0,0,0.9)",
          }}
        >
          <div style={{ fontSize: 70, color: "#A85A3A", marginBottom: 6 }}>12 ANS</div>
          <div style={{ fontSize: 22, fontWeight: 400, letterSpacing: 2 }}>L'OR S'EFFONDRE EN MEDITERRANEE</div>
        </div>
      )}

      {/* MEDAILLON GIZEH (scene 4) */}
      {showGizeh && (
        <div
          style={{
            position: "absolute",
            top: 320,
            left: "50%",
            transform: `translateX(-50%) scale(${gizehProgress})`,
            width: 360,
            height: 360,
            borderRadius: "50%",
            overflow: "hidden",
            border: "6px solid #D4A574",
            boxShadow: "0 8px 32px rgba(212,165,116,0.5)",
            backgroundColor: "#1F2A4A",
          }}
        >
          <Img
            src={staticFile("atlas-mansa-moussa/assets/gizeh-medallion.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* PORTRAIT A (Mansa scene 5 reveal) */}
      {portraitAOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: 280,
            left: "50%",
            transform: "translateX(-50%)",
            width: 460,
            height: 460,
            borderRadius: "50%",
            overflow: "hidden",
            border: "6px solid #D4A574",
            boxShadow: "0 8px 32px rgba(212,165,116,0.6)",
            backgroundColor: "#1F2A4A",
            opacity: portraitAOpacity,
          }}
        >
          <Img
            src={staticFile("atlas-mansa-moussa/assets/mansa-portrait-A-v2-canonique.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* PORTRAIT B (Mansa scene 5 finale - throne) */}
      {portraitBOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: 220,
            left: "50%",
            transform: "translateX(-50%)",
            width: 540,
            height: 540,
            borderRadius: "50%",
            overflow: "hidden",
            border: "6px solid #D4A574",
            boxShadow: "0 8px 36px rgba(212,165,116,0.7)",
            backgroundColor: "#1F2A4A",
            opacity: portraitBOpacity,
          }}
        >
          <Img
            src={staticFile("atlas-mansa-moussa/assets/mansa-portrait-B-v2-canonique-trone.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* CTA TEXT (scene 5 - sous le portrait) */}
      {portraitAOpacity > 0.01 && frame < T.pourtantPivot && (
        <div
          style={{
            position: "absolute",
            bottom: 200,
            left: 60,
            right: 60,
            textAlign: "center",
            opacity: portraitAOpacity,
            fontFamily: "'Cormorant Garamond', 'Cinzel', serif",
            fontWeight: 700,
            fontSize: 64,
            color: "#D4A574",
            letterSpacing: 2,
            textShadow: "0 4px 16px rgba(0,0,0,0.9)",
            lineHeight: 1.1,
          }}
        >
          MANSA MOUSSA
          <div style={{ fontSize: 24, marginTop: 8, fontWeight: 400, color: "#F2E5C8", letterSpacing: 3 }}>
            EMPEREUR DU MALI · 1312-1337
          </div>
        </div>
      )}

      {/* CTA TEXT FINALE (after pourtant pivot) */}
      {portraitBOpacity > 0.5 && (
        <div
          style={{
            position: "absolute",
            bottom: 140,
            left: 60,
            right: 60,
            textAlign: "center",
            opacity: portraitBOpacity,
            fontFamily: "'Cormorant Garamond', 'Cinzel', serif",
            fontWeight: 700,
            fontSize: 56,
            color: "#D4A574",
            letterSpacing: 1.5,
            textShadow: "0 4px 16px rgba(0,0,0,0.9)",
            lineHeight: 1.15,
          }}
        >
          L'HOMME LE PLUS RICHE
          <br />
          DE L'HISTOIRE
        </div>
      )}

      {/* CREDIT FOOTER (Historical Basemaps GPL-3.0) */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Helvetica, sans-serif",
          fontSize: 14,
          color: "rgba(242,229,200,0.5)",
          letterSpacing: 0.5,
        }}
      >
        Traces : Natural Earth · Historical Basemaps (GPL-3.0)
      </div>
    </AbsoluteFill>
  );
};

export const MANSA_MOUSSA_DURATION_FRAMES = DURATION_FRAMES;
