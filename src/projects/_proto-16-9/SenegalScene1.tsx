/**
 * SenegalScene1 — ACTE 1 V3 : les 3 gisements + le paradoxe (~100s, 1 Map Mapbox continue).
 *
 * Storyboard : V3-REFONTE/STORYBOARD-SCENE-1.md (6 beats A-F, spatial/abstrait, transitions tenues).
 * Doctrine CONTINUITE : UN monde qui se transforme. L'image PRECEDE l'oreille (~1s avant le mot-cle).
 * Mapbox frame-driven (jumpTo, jamais flyTo). PAS de ResourceFill (decision Aziz : gisement = dot offshore).
 *
 * Timing = forced alignment (scene1-alignment.json, loss 0.28). Scene 1 = audio absolu ~25s -> ~125s.
 * Frames LOCALES @30fps. tf(absSec) = round((absSec - 25) * 30).
 *
 * Arc camera (contraste d'echelle = intention) :
 *   A (recits)  cote Senegal, carte recomposee INTACTE (heritee du hook) · 2 etiquettes balayees.
 *   B (trois)   plongee vers le large, 3 halos s'amorcent.
 *   C SANGOMAR  plongee serree pitch (-17.15,13.45) · dot+halo sous-marin · drapeaux AU/SN.
 *   D GTA       frontiere SN/MR illuminee · DEZOOM pour arcs export + methaniers (Europe/Asie visibles).
 *   E YAKAAR    retour cote · dot FROID "non attribue" · capitales qui regardent (open loop).
 *   F 60%       carte s'ASSOMBRIT, overlay ANCRE 60% + reglette · desature sur "ne dit rien".
 */
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig, delayRender, continueRender,
} from "remotion";
import mapboxgl from "mapbox-gl";
import { MapboxBrandingHide, MAPBOX_STYLES, applyGeoAfriqueV5, addCountryHighlight, ISO } from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const ICE = "#5b8fb0";      // bleu froid Yakaar (en attente)
const IVORY = "#f2ebd9";
const NAVY = "#0d1424";

const NARR_OFFSET = 25.0;
const tf = (absSec: number) => Math.round((absSec - NARR_OFFSET) * 30);

// ancres narration (frame locale)
const F_RECITS     = tf(26.0);   // "ces deux recits"
const F_AILLEURS   = tf(43.3);   // "la realite se joue ailleurs" -> balayage
const F_DIRECT     = tf(48.0);   // "en direct" -> carte seule
const F_TROIS      = tf(53.6);
const F_SANGOMAR   = tf(55.6);
const F_WOODSIDE   = tf(60.5);
const F_PETROSEN   = tf(65.6);
const F_GTA        = tf(68.7);
const F_BP         = tf(72.9);
const F_CARGAISON  = tf(77.0);
const F_FOURNISSEUR= tf(87.4);
const F_YAKAAR     = tf(90.3);
const F_ATTEND     = tf(96.8);
const F_SURPRISE   = tf(102.1);
const F_SOIXANTE   = tf(109.6);
const F_MOYENNE    = tf(114.4);
const F_CHUTE      = tf(122.2);
const TOTAL_F      = tf(125.5);

// gisements (lon/lat reels)
const SANGOMAR = { lon: -17.15, lat: 13.45 };
const GTA      = { lon: -17.50, lat: 14.80 };
const YAKAAR   = { lon: -18.00, lat: 14.20 };

const easeInOut = (r: number) => (r < 0.5 ? 4 * r * r * r : 1 - Math.pow(-2 * r + 2, 3) / 2);
const seg = (f: number, a: number, b: number) => easeInOut(Math.max(0, Math.min(1, (f - a) / Math.max(1, b - a))));

// SFX (chemins reels verifies)
const SFX = {
  boom:    "_shared/sfx/warmap/boom-coup.mp3",
  whoosh:  "_shared/sfx/warmap/arrow-whoosh.mp3",
  drone:   "_shared/sfx/warmap/tension-drone.mp3",
  tick:    "_shared/sfx/data/stat-tick.mp3",
  counter: "_shared/sfx/data/counter-tick.mp3",
  stamp:   "souverain/senegal-petrole-gaz/audio/sfx/sfx-stamp-impact.mp3",
};
const Sfx: React.FC<{ src: string; at: number; vol?: number }> = ({ src, at, vol = 0.5 }) => (
  <Sequence from={at} durationInFrames={90}><Audio src={staticFile(src)} volume={vol} /></Sequence>
);

// ============================ MAP continue ============================
const SceneMap: React.FC<{ frame: number }> = ({ frame }) => {
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("mapbox-scene1-load"));

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [SANGOMAR.lon - 1.2, SANGOMAR.lat + 0.9],
      zoom: 6.4, pitch: 0, bearing: 0,
      interactive: false, attributionControl: false,
    });
    map.on("style.load", () => {
      (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
      applyGeoAfriqueV5(map);
      const safe = (id: string, prop: string, val: unknown) => {
        try { if (map.getLayer(id)) (map.setPaintProperty as (i: string, p: string, v: unknown) => void)(id, prop, val); } catch {}
      };
      safe("land", "background-color", "#5a5a5a");
      safe("landuse", "fill-color", "#5a5a5a");
      safe("landcover", "fill-color", "#545454");
      safe("water", "fill-color", "#2a4f72");
      safe("water-shadow", "fill-color", "#2a4f72");
      addCountryHighlight(map, ISO.SENEGAL, GOLD, 0.05, 1.5, "s1-");
    });
    map.on("idle", () => { try { continueRender(handle); } catch {} });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current; if (!map) return;
    const f = frame;
    let lon: number, lat: number, zoom: number, pitch = 0;

    if (f < F_TROIS) {
      // A : derive calme sur la cote, carte recomposee intacte
      const r = seg(f, 0, F_TROIS);
      lon = interpolate(r, [0, 1], [SANGOMAR.lon - 1.2, SANGOMAR.lon - 0.6]);
      lat = interpolate(r, [0, 1], [SANGOMAR.lat + 0.9, SANGOMAR.lat + 0.5]);
      zoom = interpolate(r, [0, 1], [6.4, 6.7]);
    } else if (f < F_SANGOMAR) {
      // B : plongee amorcee vers le large
      const r = seg(f, F_TROIS, F_SANGOMAR);
      lon = interpolate(r, [0, 1], [SANGOMAR.lon - 0.6, SANGOMAR.lon - 0.35]);
      lat = interpolate(r, [0, 1], [SANGOMAR.lat + 0.5, SANGOMAR.lat + 0.25]);
      zoom = interpolate(r, [0, 1], [6.7, 7.0]);
    } else if (f < F_GTA) {
      // C : plongee serree Sangomar + pitch (relief)
      const r = seg(f, F_SANGOMAR, F_GTA);
      lon = interpolate(r, [0, 1], [SANGOMAR.lon - 0.35, SANGOMAR.lon - 0.1]);
      lat = interpolate(r, [0, 1], [SANGOMAR.lat + 0.25, SANGOMAR.lat]);
      zoom = interpolate(r, [0, 0.5, 1], [7.0, 7.5, 7.3]);
      pitch = interpolate(r, [0, 0.5, 1], [0, 30, 38]);
    } else if (f < F_CARGAISON) {
      // D1 : remonte vers GTA (frontiere nord), pitch redescend
      const r = seg(f, F_GTA, F_CARGAISON);
      lon = interpolate(r, [0, 1], [SANGOMAR.lon - 0.1, GTA.lon]);
      lat = interpolate(r, [0, 1], [SANGOMAR.lat, GTA.lat]);
      zoom = interpolate(r, [0, 1], [7.3, 6.9]);
      pitch = interpolate(r, [0, 1], [38, 10]);
    } else if (f < F_YAKAAR) {
      // D2 : DEZOOM large pour arcs export (Atlantique + Europe)
      const r = seg(f, F_CARGAISON, F_YAKAAR);
      lon = interpolate(r, [0, 1], [GTA.lon, -7.0]);
      lat = interpolate(r, [0, 1], [GTA.lat, 26.0]);
      zoom = interpolate(r, [0, 1], [6.9, 2.9]);
    } else if (f < F_SOIXANTE) {
      // E : retour cote, cadrage Yakaar
      const r = seg(f, F_YAKAAR, F_SOIXANTE);
      lon = interpolate(r, [0, 1], [-7.0, YAKAAR.lon - 0.5]);
      lat = interpolate(r, [0, 1], [26.0, YAKAAR.lat + 0.25]);
      zoom = interpolate(r, [0, 0.55, 1], [2.9, 5.6, 6.5]);
    } else {
      lon = YAKAAR.lon - 0.5; lat = YAKAAR.lat + 0.25; zoom = 6.5;
    }
    map.jumpTo({ center: [lon, lat], zoom, pitch, bearing: 0 });
  }, [frame]);

  return (
    <>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
    </>
  );
};

// ============================ cartouche reutilisable ============================
const Cartouche: React.FC<{
  x: number; y: number; opacity: number; title: string; sub: string; cold?: boolean;
  flag?: string; flagLabel?: string; flagOpacity?: number;
  flag2?: string; flag2Label?: string; flag2Opacity?: number;
}> = ({ x, y, opacity, title, sub, cold, flag, flagLabel, flagOpacity = 0, flag2, flag2Label, flag2Opacity = 0 }) => {
  const accent = cold ? ICE : GOLD;
  const FlagRow = (f: string, label: string, op: number) => (
    <div style={{ backgroundColor: "rgba(13,20,36,0.78)", padding: "6px 18px", display: "flex", alignItems: "center", gap: 10, opacity: op }}>
      <Img src={staticFile(`_shared/flags/${f}`)} style={{ width: 26, height: 17, objectFit: "cover", boxShadow: "0 1px 3px rgba(0,0,0,0.5)" }} />
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "rgba(242,235,217,0.66)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, pointerEvents: "none", display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ backgroundColor: "rgba(13,20,36,0.92)", borderLeft: `4px solid ${accent}`, padding: "10px 22px 8px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 27, fontWeight: 700, color: IVORY, letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 500, color: accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>{sub}</div>
      </div>
      {flag && flagOpacity > 0.01 && FlagRow(flag, flagLabel ?? "", flagOpacity)}
      {flag2 && flag2Opacity > 0.01 && FlagRow(flag2, flag2Label ?? "", flag2Opacity)}
    </div>
  );
};

// dot gisement (or chaud ou ice froid) + halo sous-marin + rings
const Dot: React.FC<{ x: number; y: number; appearF: number; frame: number; fps: number; cold?: boolean; strong?: boolean }>
  = ({ x, y, appearF, frame, fps, cold, strong }) => {
  const color = cold ? ICE : GOLD;
  const p = spring({ frame: frame - appearF, fps, config: { damping: 9, stiffness: 320 }, durationInFrames: 24 });
  const scale = interpolate(p, [0, 1], [0.05, 1], { extrapolateRight: "clamp" });
  const dy = interpolate(p, [0, 1], [26, 0], { extrapolateRight: "clamp" });
  const op = interpolate(p, [0, 0.1, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const pulse = Math.sin((frame / (strong ? 22 : 42)) * Math.PI * 2);
  const glow = interpolate(pulse, [-1, 1], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const PERIOD = cold ? 78 : 92;
  const rings = [0, 1, 2].map((i) => {
    const lf = Math.max(0, frame - appearF - i * 28);
    const pr = (lf % PERIOD) / PERIOD;
    return { r: pr * (cold ? 120 : 150), o: interpolate(pr, [0, 0.15, 0.7, 1], [0, 0.5, 0.22, 0], { extrapolateRight: "clamp" }) };
  });
  return (
    <g opacity={op}>
      {rings.map((rg, i) => <circle key={i} cx={x} cy={y} r={rg.r} stroke={color} strokeWidth={1.4} fill="none" opacity={rg.o} />)}
      {/* halo sous-marin profond (echelle) */}
      <circle cx={x} cy={y} r={42 * scale} fill={color} opacity={glow * 0.10} />
      <ellipse cx={x} cy={y + 58 * scale} rx={30 * scale} ry={12 * scale} fill={color} opacity={glow * 0.08} />
      <circle cx={x} cy={y + dy} r={13 * scale} fill={color} opacity={glow} />
      <circle cx={x} cy={y + dy} r={25 * scale} fill={color} opacity={glow * 0.2} />
    </g>
  );
};

// methanier SVG (silhouette vue de dessus, sobre) qui glisse le long d'un arc
const Tanker: React.FC<{ x: number; y: number; angle: number; opacity: number }> = ({ x, y, angle, opacity }) => (
  <g transform={`translate(${x},${y}) rotate(${angle})`} opacity={opacity}>
    <path d="M-13,-4 L9,-4 L15,0 L9,4 L-13,4 Z" fill={GOLD} opacity={0.9} />
    <rect x={-9} y={-2.2} width={4} height={4.4} fill={NAVY} />
    <rect x={-2} y={-2.2} width={4} height={4.4} fill={NAVY} />
  </g>
);

// ============================ SCENE ============================
export const SenegalScene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const W = width, H = height;
  const op = (appearF: number, dur = 18) =>
    interpolate(spring({ frame: frame - appearF, fps, config: { damping: 18, stiffness: 190 }, durationInFrames: dur }), [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // A : voile parchemin (raccord hook) qui se dissout
  const parchemin = interpolate(frame, [0, 40], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // A : 2 etiquettes recits -> balayees sur "ailleurs"
  const recitsIn = op(F_RECITS, 22);
  const recitsOut = interpolate(frame, [F_AILLEURS, F_AILLEURS + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const recitsOp = recitsIn * recitsOut;
  const sweepX = interpolate(frame, [F_AILLEURS, F_AILLEURS + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // positions ecran (calees sur les cadrages camera)
  const sangPos = { x: W * 0.42, y: H * 0.52 };
  const gtaPos  = { x: W * 0.31, y: H * 0.60 };   // pendant dezoom : Afrique de l'Ouest bas-gauche
  const yakPos  = { x: W * 0.40, y: H * 0.50 };

  const showSang = frame >= F_SANGOMAR - 6 && frame < F_GTA + 14;
  const showGTA  = frame >= F_GTA - 6 && frame < F_YAKAAR + 4;
  const showYak  = frame >= F_YAKAAR - 6 && frame < F_SOIXANTE + 6;
  const showArcs = frame >= F_CARGAISON && frame < F_YAKAAR;

  // F : 60% overlay ancre sur carte assombrie
  const sixtyIn = interpolate(frame, [F_SOIXANTE - 8, F_SOIXANTE + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sixtyCount = Math.round(interpolate(frame, [F_SOIXANTE - 4, F_SOIXANTE + 26], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const sixtyDesat = interpolate(frame, [F_CHUTE, F_CHUTE + 30], [1, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // bascule CANDIDAT -> FOURNISSEUR
  const fourni = interpolate(frame, [F_FOURNISSEUR - 6, F_FOURNISSEUR + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fourniOut = interpolate(frame, [F_CARGAISON + 70, F_CARGAISON + 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* AUDIO : narration V3 + musique, demarrent a 25s (offset scene 1) */}
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={Math.round(NARR_OFFSET * 30)} volume={1} />
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")} startFrom={Math.round(NARR_OFFSET * 30)} volume={0.13} />

      {/* SFX cales */}
      <Sfx src={SFX.whoosh} at={F_AILLEURS} vol={0.4} />              {/* balayage recits */}
      <Sfx src={SFX.tick} at={F_TROIS - 4} vol={0.4} />              {/* 3 halos */}
      <Sfx src={SFX.boom} at={F_SANGOMAR} vol={0.5} />               {/* Sangomar emerge */}
      <Sfx src={SFX.boom} at={F_GTA} vol={0.45} />                   {/* GTA emerge */}
      <Sfx src={SFX.whoosh} at={F_CARGAISON} vol={0.4} />            {/* dezoom export */}
      <Sfx src={SFX.drone} at={F_YAKAAR} vol={0.45} />               {/* Yakaar tension */}
      <Sfx src={SFX.stamp} at={F_SURPRISE} vol={0.45} />             {/* surprise pulse */}
      <Sfx src={SFX.counter} at={F_SOIXANTE - 4} vol={0.4} />        {/* count-up 60% */}

      {/* MAP continue */}
      <SceneMap frame={frame} />

      {/* vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 52%, rgba(8,12,22,0.42) 100%)", pointerEvents: "none" }} />

      {/* A : voile parchemin (raccord hook) */}
      {parchemin > 0.01 && (
        <div style={{ position: "absolute", inset: 0, opacity: parchemin, pointerEvents: "none", background: "radial-gradient(ellipse at 45% 45%, rgba(224,214,184,0.5), rgba(224,214,184,0.16) 60%, transparent 80%)", mixBlendMode: "screen" }} />
      )}

      {/* SVG overlay : dots, arcs, methaniers, capitales */}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {showSang && <Dot x={sangPos.x} y={sangPos.y} appearF={F_SANGOMAR} frame={frame} fps={fps} />}
        {showGTA && <Dot x={gtaPos.x} y={gtaPos.y} appearF={F_GTA} frame={frame} fps={fps} />}

        {/* D : arcs export + methaniers (apres dezoom) */}
        {showArcs && (() => {
          const arcOp = interpolate(frame, [F_CARGAISON, F_CARGAISON + 20], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const dests = [{ x: W * 0.62, y: H * 0.22 }, { x: W * 0.82, y: H * 0.36 }];
          return (
            <g opacity={arcOp}>
              {dests.map((d, i) => {
                const mx = (gtaPos.x + d.x) / 2, my = Math.min(gtaPos.y, d.y) - 80;
                const draw = interpolate(frame, [F_CARGAISON + i * 8, F_CARGAISON + i * 8 + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const pathD = `M${gtaPos.x},${gtaPos.y} Q${mx},${my} ${d.x},${d.y}`;
                // methanier glisse le long de l'arc (parametre t = boucle)
                const tt = ((frame - F_CARGAISON - i * 15) % 120) / 120;
                const bz = (t: number, p0: number, p1: number, p2: number) => (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
                const sx = bz(tt, gtaPos.x, mx, d.x), sy = bz(tt, gtaPos.y, my, d.y);
                // tangente pour l'angle
                const sx2 = bz(tt + 0.02, gtaPos.x, mx, d.x), sy2 = bz(tt + 0.02, gtaPos.y, my, d.y);
                const ang = Math.atan2(sy2 - sy, sx2 - sx) * 180 / Math.PI;
                return (
                  <g key={i}>
                    <path d={pathD} stroke={GOLD} strokeWidth={1.5} fill="none" strokeDasharray="6 7" strokeDashoffset={-(frame * 1.5)} opacity={0.7 * draw} />
                    <circle cx={d.x} cy={d.y} r={3.5} fill={GOLD} opacity={draw} />
                    {draw > 0.6 && tt > 0.04 && tt < 0.96 && <Tanker x={sx} y={sy} angle={ang} opacity={draw} />}
                  </g>
                );
              })}
            </g>
          );
        })()}

        {/* E : Yakaar froid + capitales qui regardent */}
        {showYak && <Dot x={yakPos.x} y={yakPos.y} appearF={F_YAKAAR} frame={frame} fps={fps} cold strong={frame >= F_SURPRISE && frame < F_SURPRISE + 22} />}
        {frame >= F_ATTEND && frame < F_SOIXANTE && (() => {
          const capOp = interpolate(frame, [F_ATTEND, F_ATTEND + 24], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const caps = [{ x: W * 0.80, y: H * 0.20 }, { x: W * 0.86, y: H * 0.56 }, { x: W * 0.15, y: H * 0.24 }];
          return (
            <g opacity={capOp}>
              {caps.map((c, i) => {
                const dx = yakPos.x - c.x, dy = yakPos.y - c.y, stop = 0.72;
                const ex = c.x + dx * stop, ey = c.y + dy * stop;
                return (
                  <g key={i}>
                    <line x1={c.x} y1={c.y} x2={ex} y2={ey} stroke={ICE} strokeWidth={1.2} strokeDasharray="3 6" opacity={0.6} />
                    <circle cx={c.x} cy={c.y} r={3} fill="none" stroke={ICE} strokeWidth={1.2} opacity={0.8} />
                  </g>
                );
              })}
            </g>
          );
        })()}
      </svg>

      {/* A : 2 etiquettes recits (HTML), balayees vers les bords */}
      {recitsOp > 0.01 && (
        <>
          <div style={{ position: "absolute", left: W * 0.10 - sweepX * W * 0.25, top: H * 0.30, opacity: recitsOp, pointerEvents: "none", fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 700, color: "rgba(242,235,217,0.85)", letterSpacing: "0.12em", textShadow: "0 2px 8px #000" }}>
            « LA MALÉDICTION »<div style={{ fontSize: 13, color: "rgba(242,235,217,0.45)", marginTop: 4 }}>ILS POMPENT ET REPARTENT</div>
          </div>
          <div style={{ position: "absolute", right: W * 0.10 - sweepX * W * 0.25, top: H * 0.30, opacity: recitsOp, pointerEvents: "none", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 700, color: "rgba(242,235,217,0.85)", letterSpacing: "0.12em", textShadow: "0 2px 8px #000" }}>
            « LE MIRACLE »<div style={{ fontSize: 13, color: "rgba(242,235,217,0.45)", marginTop: 4 }}>LA SOUVERAINETÉ RETROUVÉE</div>
          </div>
        </>
      )}

      {/* CARTOUCHES */}
      {showSang && (
        <Cartouche x={sangPos.x + 38} y={sangPos.y - 84} opacity={op(F_SANGOMAR + 4)}
          title="SANGOMAR" sub="PÉTROLE BRUT"
          flag="au.png" flagLabel="WOODSIDE (AUSTRALIE)" flagOpacity={op(F_WOODSIDE)}
          flag2="sn.png" flag2Label="PETROSEN — 18%" flag2Opacity={op(F_PETROSEN)} />
      )}
      {showGTA && (
        <Cartouche x={gtaPos.x + 36} y={gtaPos.y - 80} opacity={op(F_GTA + 4)}
          title="GTA" sub="GAZ — FRONTIÈRE SN/MR"
          flag="gb.png" flagLabel="BP (ROYAUME-UNI)" flagOpacity={op(F_BP)} />
      )}
      {showYak && (
        <Cartouche x={yakPos.x + 36} y={yakPos.y - 80} opacity={op(F_YAKAAR + 4)} cold
          title="YAKAAR-TERANGA" sub="GAZ — STATUT : NON ATTRIBUÉ" />
      )}

      {/* bascule CANDIDAT -> FOURNISSEUR */}
      {fourni * fourniOut > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.14, textAlign: "center", opacity: fourni * fourniOut, pointerEvents: "none", fontFamily: "'IBM Plex Mono', monospace", fontSize: 34, fontWeight: 700, letterSpacing: "0.14em", textShadow: "0 2px 10px #000" }}>
          <span style={{ color: "rgba(242,235,217,0.4)", textDecoration: "line-through" }}>CANDIDAT</span>
          <span style={{ color: GOLD }}>{"  →  "}FOURNISSEUR</span>
        </div>
      )}

      {/* F : 60% overlay ancre (carte assombrie) */}
      {sixtyIn > 0.01 && (
        <AbsoluteFill style={{ background: `rgba(8,12,22,${0.88 * sixtyIn})`, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, opacity: sixtyIn }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 19, color: "rgba(242,235,217,0.55)", letterSpacing: "0.3em" }}>REVENUS QUI RESTENT AU SÉNÉGAL</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 150, fontWeight: 700, color: GOLD, opacity: sixtyDesat, lineHeight: 1 }}>{sixtyCount}%</div>
          {frame >= F_MOYENNE - 4 && (
            <div style={{ opacity: interpolate(frame, [F_MOYENNE - 4, F_MOYENNE + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * sixtyDesat, width: W * 0.42, marginTop: 8 }}>
              <div style={{ height: 4, background: "rgba(242,235,217,0.18)", position: "relative" }}>
                <div style={{ position: "absolute", left: "60%", top: -7, width: 2, height: 18, background: GOLD }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "rgba(242,235,217,0.5)", letterSpacing: "0.1em" }}>
                <span>NI SCANDALE</span><span>MOYENNE PAYS ÉMERGENTS</span><span>NI JACKPOT</span>
              </div>
            </div>
          )}
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: "rgba(242,235,217,0.4)", letterSpacing: "0.16em", marginTop: 4 }}>PARTICIPATION · TAXES · ROYALTIES</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default SenegalScene1;
