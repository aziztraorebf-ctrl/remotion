/**
 * SenegalScene1 — ACTE 1 V3 : les 3 gisements + le paradoxe (~100s, 1 Map Mapbox continue).
 *
 * Doctrine CONTINUITE-SCENE : UN seul monde (une seule Map qui voyage), des points qui s'allument —
 * pas 3 ecrans. L'image PRECEDE l'oreille (~1s avant le mot-cle). Mapbox frame-driven (jumpTo, jamais flyTo).
 *
 * Timing = forced alignment ElevenLabs (audio/scene1-alignment.json, loss 0.28). La scene 1 occupe
 * l'audio absolu ~25s -> ~125s. ICI on travaille en frames LOCALES (0 = debut scene 1 = 25s absolu).
 *
 * Arc camera (contraste d'echelle volontaire) :
 *   A. raccord/2 recits  : Senegal cote, vue calme.
 *   C. SANGOMAR          : PLONGEE serree sur le point petrole (-17.15,13.45).
 *   D. GTA               : DEZOOM large (Senegal + Europe + amorce Asie) pour que les arcs export aient
 *                          une destination VISIBLE (precision Aziz).
 *   E. YAKAAR            : RETOUR sur la cote, point froid "en attente" (open loop).
 *   F. 60%               : sortie Mapbox -> plein ecran Remotion (registre conceptuel).
 *
 * Frames locales @30fps. NARR_OFFSET = 25.0s : on convertit les t-absolus de l'alignment en frames locales
 * via tf(absSec) = round((absSec - 25.0) * 30).
 */
import React, { useEffect, useRef } from "react";
import {
  AbsoluteFill, Audio, Img, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig, delayRender, continueRender,
} from "remotion";
import mapboxgl from "mapbox-gl";
import { MapboxBrandingHide, MAPBOX_STYLES, applyGeoAfriqueV5, addCountryHighlight, ISO } from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const ICE = "#5b8fb0";      // bleu froid pour Yakaar (en attente, non attribue)
const IVORY = "#f2ebd9";
const NAVY = "#0d1424";

// ---- conversion alignment absolu -> frame locale (scene commence a 25.0s) ----
const NARR_OFFSET = 25.0;
const tf = (absSec: number) => Math.round((absSec - NARR_OFFSET) * 30);

// ancres narration (absolu -> local frame)
const F_TROIS      = tf(53.0);   // "il en a trouve trois"
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
const TOTAL_F      = tf(125.5);  // ~3015 frames

// gisements (lon/lat reels, verifies dans beats V1)
const SANGOMAR = { lon: -17.15, lat: 13.45 };
const GTA      = { lon: -17.50, lat: 14.80 };
const YAKAAR   = { lon: -18.00, lat: 14.20 };

const easeInOut = (r: number) => (r < 0.5 ? 4 * r * r * r : 1 - Math.pow(-2 * r + 2, 3) / 2);
const seg = (f: number, a: number, b: number) =>
  easeInOut(Math.max(0, Math.min(1, (f - a) / Math.max(1, b - a))));

// ============================ MAP (1 seule, continue) ============================
const SceneMap: React.FC<{ frame: number }> = ({ frame }) => {
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const handleRef = useRef<number>(delayRender("mapbox-scene1-load"));

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [SANGOMAR.lon - 1.5, SANGOMAR.lat + 0.8],
      zoom: 6.3, pitch: 0, bearing: 0,
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
      // contour gold discret du Senegal (ancrage pays, fill quasi nul)
      addCountryHighlight(map, ISO.SENEGAL, GOLD, 0.06, 1.5, "s1-");
    });
    // libere le render seulement quand la map a fini de peindre les tuiles (anti-frame-grise)
    map.on("idle", () => {
      try { continueRender(handleRef.current); } catch {}
    });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // ---- camera frame-driven : voyage entre les beats ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const f = frame;

    // points de passage (lon, lat, zoom) interpoles par segments narratifs
    // A->C : vue cote -> plongee Sangomar serree
    // C->D : Sangomar -> DEZOOM large (cadre Senegal+Europe pour les arcs)
    // D->E : large -> retour cote Yakaar
    // E->F : maintien doux (la sortie 60% est geree par overlay plein ecran)
    let lon: number, lat: number, zoom: number;

    if (f < F_SANGOMAR) {
      // A/B : derive lente sur la cote, le pays cadre
      const r = seg(f, 0, F_SANGOMAR);
      lon = interpolate(r, [0, 1], [SANGOMAR.lon - 1.5, SANGOMAR.lon - 0.4]);
      lat = interpolate(r, [0, 1], [SANGOMAR.lat + 0.8, SANGOMAR.lat + 0.3]);
      zoom = interpolate(r, [0, 1], [6.3, 6.8]);
    } else if (f < F_GTA) {
      // C : plongee serree sur Sangomar
      const r = seg(f, F_SANGOMAR, F_GTA);
      lon = interpolate(r, [0, 1], [SANGOMAR.lon - 0.4, SANGOMAR.lon - 0.15]);
      lat = interpolate(r, [0, 1], [SANGOMAR.lat + 0.3, SANGOMAR.lat]);
      zoom = interpolate(r, [0, 0.5, 1], [6.8, 7.4, 7.2]);
    } else if (f < F_YAKAAR) {
      // D : DEZOOM large pour les arcs export (Senegal -> Europe/Asie visibles)
      const r = seg(f, F_GTA, F_YAKAAR);
      // on remonte vers GTA (nord) puis on s'eleve tres haut pour cadrer l'Atlantique + Europe
      lon = interpolate(r, [0, 0.35, 1], [SANGOMAR.lon - 0.15, GTA.lon, -8.0]);
      lat = interpolate(r, [0, 0.35, 1], [SANGOMAR.lat, GTA.lat, 28.0]);
      zoom = interpolate(r, [0, 0.35, 1], [7.2, 6.6, 2.7]);
    } else if (f < F_SOIXANTE) {
      // E : retour sur la cote, cadrage Yakaar "en attente"
      const r = seg(f, F_YAKAAR, F_SOIXANTE);
      lon = interpolate(r, [0, 1], [-8.0, YAKAAR.lon - 0.6]);
      lat = interpolate(r, [0, 1], [28.0, YAKAAR.lat + 0.2]);
      zoom = interpolate(r, [0, 0.6, 1], [2.7, 5.5, 6.4]);
    } else {
      // F : maintien (overlay 60% plein ecran par-dessus)
      lon = YAKAAR.lon - 0.6; lat = YAKAAR.lat + 0.2; zoom = 6.4;
    }
    map.jumpTo({ center: [lon, lat], zoom, pitch: 0, bearing: 0 });
  }, [frame]);

  return (
    <>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
    </>
  );
};

// ============================ HELPERS OVERLAY ============================
// projette un lon/lat -> position ecran approximative selon la camera courante.
// (on n'a pas la Map dans l'overlay ; on positionne les marqueurs en ratio fixe par beat,
//  cale sur le cadrage choisi. Suffisant pour des dots/cartouches cales sur la camera scriptee.)

const Cartouche: React.FC<{
  x: number; y: number; opacity: number; title: string; sub: string;
  flag?: string; flagLabel?: string; flagOpacity?: number; cold?: boolean;
}> = ({ x, y, opacity, title, sub, flag, flagLabel, flagOpacity = 0, cold }) => {
  const accent = cold ? ICE : GOLD;
  return (
    <div style={{
      position: "absolute", left: x, top: y, opacity,
      pointerEvents: "none", display: "flex", flexDirection: "column", gap: 0,
    }}>
      <div style={{
        backgroundColor: "rgba(13,20,36,0.92)", borderLeft: `4px solid ${accent}`,
        padding: "10px 22px 8px 16px", display: "flex", flexDirection: "column", gap: 4,
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 700,
          color: IVORY, letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "nowrap",
        }}>{title}</div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, fontWeight: 500,
          color: accent, letterSpacing: "0.13em", textTransform: "uppercase",
        }}>{sub}</div>
      </div>
      {flag && (
        <div style={{
          backgroundColor: "rgba(13,20,36,0.78)", padding: "7px 18px",
          display: "flex", alignItems: "center", gap: 10, opacity: flagOpacity,
        }}>
          <Img src={staticFile(`_shared/flags/${flag}`)}
            style={{ width: 26, height: 17, objectFit: "cover", boxShadow: "0 1px 3px rgba(0,0,0,0.5)" }} />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 400,
            color: "rgba(242,235,217,0.66)", letterSpacing: "0.13em", textTransform: "uppercase",
          }}>{flagLabel}</span>
        </div>
      )}
    </div>
  );
};

// dot pulsant (gisement) + rings, en coords ecran
const GisementDot: React.FC<{ x: number; y: number; appearF: number; frame: number; fps: number; cold?: boolean; strong?: boolean }>
  = ({ x, y, appearF, frame, fps, cold, strong }) => {
  const color = cold ? ICE : GOLD;
  const p = spring({ frame: frame - appearF, fps, config: { damping: 9, stiffness: 320 }, durationInFrames: 24 });
  const scale = interpolate(p, [0, 1], [0.05, 1], { extrapolateRight: "clamp" });
  const dy = interpolate(p, [0, 1], [26, 0], { extrapolateRight: "clamp" });
  const op = interpolate(p, [0, 0.1, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const pulse = Math.sin((frame / (strong ? 24 : 42)) * Math.PI * 2);
  const glow = interpolate(pulse, [-1, 1], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const RING_PERIOD = cold ? 75 : 90;
  const rings = [0, 1, 2].map((i) => {
    const lf = Math.max(0, frame - appearF - i * 28);
    const pr = (lf % RING_PERIOD) / RING_PERIOD;
    return { r: pr * (cold ? 120 : 150), o: interpolate(pr, [0, 0.15, 0.7, 1], [0, 0.5, 0.22, 0], { extrapolateRight: "clamp" }) };
  });
  return (
    <g opacity={op}>
      {rings.map((rg, i) => <circle key={i} cx={x} cy={y} r={rg.r} stroke={color} strokeWidth={1.4} fill="none" opacity={rg.o} />)}
      <circle cx={x} cy={y + dy} r={13 * scale} fill={color} opacity={glow} />
      <circle cx={x} cy={y + dy} r={26 * scale} fill={color} opacity={glow * 0.18} />
      <ellipse cx={x} cy={y + dy - 56 * scale} rx={7 * scale} ry={46 * scale} fill={color} opacity={0.1} />
    </g>
  );
};

// ============================ SCENE ============================
export const SenegalScene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const W = width, H = height;

  // --- opacites des beats ---
  const op = (appearF: number, dur = 18) =>
    interpolate(spring({ frame: frame - appearF, fps, config: { damping: 18, stiffness: 190 }, durationInFrames: dur }), [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // A. raccord parchemin->mapbox : voile parchemin qui se dissout sur les ~2 premieres s
  const parchemin = interpolate(frame, [0, 45], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 2 glyphes recits (s'effacent sur "la realite se joue ailleurs" ~ f locale tf(38)=390)
  const recitsIn = op(20, 22);
  const recitsOut = interpolate(frame, [tf(36), tf(40)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const recitsOp = recitsIn * recitsOut;

  // positions ecran des gisements (calees sur les cadrages camera scriptes)
  // Sangomar (plongee serree) : centre-gauche
  const sangPos = { x: W * 0.42, y: H * 0.52 };
  // GTA pendant le dezoom : se deplace vers le point Afrique de l'Ouest (haut-gauche du cadre large)
  const gtaPos = { x: W * 0.30, y: H * 0.62 };
  // Yakaar (retour cote) : centre
  const yakPos = { x: W * 0.40, y: H * 0.50 };

  // visibilites
  const showSang = frame >= F_SANGOMAR - 6 && frame < F_GTA + 10;
  const showGTA = frame >= F_GTA - 6 && frame < F_YAKAAR + 6;
  const showYak = frame >= F_YAKAAR - 6 && frame < F_SOIXANTE + 6;
  const showArcs = frame >= F_BP && frame < F_YAKAAR;

  // F. 60% plein ecran (sortie mapbox)
  const sixtyIn = interpolate(frame, [F_SOIXANTE - 8, F_SOIXANTE + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sixtyCount = Math.round(interpolate(frame, [F_SOIXANTE - 4, F_SOIXANTE + 26], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const sixtyDesat = interpolate(frame, [F_CHUTE, F_CHUTE + 30], [1, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // "ne dit rien" -> palit

  // bascule CANDIDAT -> FOURNISSEUR (noyau)
  const fourni = interpolate(frame, [F_FOURNISSEUR - 6, F_FOURNISSEUR + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fourniOut = interpolate(frame, [F_YAKAAR - 14, F_YAKAAR - 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* AUDIO : portion scene 1 de la narration V3 (decalee : on lit l'audio complet depuis 0,
          mais la scene 1 demarre a 25s -> on joue avec startFrom). Musique continue. */}
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={Math.round(NARR_OFFSET * 30)} volume={1} />
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")} startFrom={Math.round(NARR_OFFSET * 30)} volume={0.14} />

      {/* MAP continue */}
      <SceneMap frame={frame} />

      {/* vignette legere */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 52%, rgba(8,12,22,0.42) 100%)", pointerEvents: "none" }} />

      {/* A. raccord parchemin -> mapbox (voile clair qui se dissout) */}
      {parchemin > 0.01 && (
        <div style={{
          position: "absolute", inset: 0, opacity: parchemin, pointerEvents: "none",
          background: "radial-gradient(ellipse at 45% 45%, rgba(224,214,184,0.55), rgba(224,214,184,0.18) 60%, transparent 80%)",
          mixBlendMode: "screen",
        }} />
      )}

      {/* SVG overlay (dots, rings, arcs, glyphes) */}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {/* A. 2 glyphes recits : fleche sortante (multinationales) | poing (souverainete) */}
        {recitsOp > 0.01 && (
          <g opacity={recitsOp}>
            {/* recit 1 : fleche qui sort (extraction qui repart) */}
            <g transform={`translate(${W * 0.30}, ${H * 0.30})`} stroke={GOLD} strokeWidth={2.2} fill="none" strokeLinecap="round">
              <line x1={-26} y1={0} x2={26} y2={0} />
              <line x1={10} y1={-14} x2={26} y2={0} />
              <line x1={10} y1={14} x2={26} y2={0} />
            </g>
            {/* recit 2 : chevron-poing montant (souverainete) */}
            <g transform={`translate(${W * 0.68}, ${H * 0.30})`} stroke={GOLD} strokeWidth={2.2} fill="none" strokeLinecap="round">
              <line x1={-22} y1={14} x2={0} y2={-14} />
              <line x1={0} y1={-14} x2={22} y2={14} />
            </g>
          </g>
        )}

        {/* C. SANGOMAR dot */}
        {showSang && <GisementDot x={sangPos.x} y={sangPos.y} appearF={F_SANGOMAR} frame={frame} fps={fps} />}

        {/* D. GTA dot + arcs export (apres dezoom) */}
        {showGTA && <GisementDot x={gtaPos.x} y={gtaPos.y} appearF={F_GTA} frame={frame} fps={fps} />}
        {showArcs && (() => {
          const arcOp = interpolate(frame, [F_BP, F_BP + 20], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // destinations approx en coords ecran (apres dezoom large) : Europe haut-droite, Asie tres droite
          const dests = [{ x: W * 0.62, y: H * 0.22, label: "EUROPE" }, { x: W * 0.82, y: H * 0.34, label: "ASIE" }];
          return (
            <g opacity={arcOp}>
              {dests.map((d, i) => {
                const mx = (gtaPos.x + d.x) / 2, my = Math.min(gtaPos.y, d.y) - 70;
                const draw = interpolate(frame, [F_BP + i * 8, F_BP + i * 8 + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const pathD = `M${gtaPos.x},${gtaPos.y} Q${mx},${my} ${d.x},${d.y}`;
                return (
                  <g key={i}>
                    <path d={pathD} stroke={GOLD} strokeWidth={1.6} fill="none"
                      strokeDasharray={600} strokeDashoffset={600 * (1 - draw)} opacity={0.85} />
                    <circle cx={d.x} cy={d.y} r={3.5} fill={GOLD} opacity={draw} />
                  </g>
                );
              })}
            </g>
          );
        })()}

        {/* E. YAKAAR dot (froid) + capitales qui regardent (lignes entrantes suspendues) */}
        {showYak && <GisementDot x={yakPos.x} y={yakPos.y} appearF={F_YAKAAR} frame={frame} fps={fps} cold strong={frame >= F_SURPRISE && frame < F_SURPRISE + 20} />}
        {frame >= F_ATTEND && frame < F_SOIXANTE && (() => {
          const capOp = interpolate(frame, [F_ATTEND, F_ATTEND + 24], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const caps = [{ x: W * 0.78, y: H * 0.20 }, { x: W * 0.85, y: H * 0.55 }, { x: W * 0.16, y: H * 0.22 }];
          return (
            <g opacity={capOp}>
              {caps.map((c, i) => {
                // ligne pointillee qui s'arrete AVANT de toucher le point (tension suspendue)
                const dx = yakPos.x - c.x, dy = yakPos.y - c.y;
                const len = Math.hypot(dx, dy), stop = 0.72; // s'arrete a 72%
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

      {/* CARTOUCHES (HTML par-dessus le SVG) */}
      {showSang && (
        <Cartouche x={sangPos.x + 36} y={sangPos.y - 80} opacity={op(F_SANGOMAR + 4)}
          title="SANGOMAR" sub="PÉTROLE BRUT"
          flag="au.png" flagLabel="OPÉRATEUR — WOODSIDE (AUSTRALIE)" flagOpacity={op(F_WOODSIDE)} />
      )}
      {showSang && op(F_PETROSEN) > 0.01 && (
        <div style={{
          position: "absolute", left: sangPos.x + 36, top: sangPos.y + 36, opacity: op(F_PETROSEN),
          backgroundColor: "rgba(13,20,36,0.74)", padding: "6px 18px", display: "flex", alignItems: "center", gap: 10, pointerEvents: "none",
        }}>
          <Img src={staticFile("_shared/flags/sn.png")} style={{ width: 26, height: 17, objectFit: "cover" }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600, color: GOLD, letterSpacing: "0.13em" }}>PETROSEN — 18%</span>
        </div>
      )}

      {showGTA && (
        <Cartouche x={gtaPos.x + 34} y={gtaPos.y - 78} opacity={op(F_GTA + 4)}
          title="GTA" sub="GAZ NATUREL — FRONTIÈRE SN/MR"
          flag="gb.png" flagLabel="OPÉRATEUR — BP (ROYAUME-UNI)" flagOpacity={op(F_BP)} />
      )}

      {showYak && (
        <Cartouche x={yakPos.x + 34} y={yakPos.y - 78} opacity={op(F_YAKAAR + 4)} cold
          title="YAKAAR-TERANGA" sub="GAZ — STATUT : NON ATTRIBUÉ" />
      )}

      {/* bascule CANDIDAT -> FOURNISSEUR (noyau, pas la phrase) */}
      {fourni * fourniOut > 0.01 && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: H * 0.16, textAlign: "center",
          opacity: fourni * fourniOut, pointerEvents: "none",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 34, fontWeight: 700, letterSpacing: "0.14em",
        }}>
          <span style={{ color: "rgba(242,235,217,0.4)", textDecoration: "line-through" }}>CANDIDAT</span>
          <span style={{ color: GOLD }}>  →  FOURNISSEUR</span>
        </div>
      )}

      {/* F. 60% plein ecran (registre conceptuel) */}
      {sixtyIn > 0.01 && (
        <AbsoluteFill style={{
          background: `rgba(8,12,22,${0.92 * sixtyIn})`,
          alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18,
          opacity: sixtyIn,
        }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 500, color: "rgba(242,235,217,0.55)", letterSpacing: "0.3em" }}>
            REVENUS QUI RESTENT AU SÉNÉGAL
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 150, fontWeight: 700, color: GOLD, opacity: sixtyDesat, letterSpacing: "0.02em", lineHeight: 1 }}>
            {sixtyCount}%
          </div>
          {/* reglette "moyenne pays emergents" */}
          {frame >= F_MOYENNE - 4 && (
            <div style={{ opacity: interpolate(frame, [F_MOYENNE - 4, F_MOYENNE + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * sixtyDesat, width: W * 0.42, marginTop: 10 }}>
              <div style={{ height: 4, background: "rgba(242,235,217,0.18)", position: "relative" }}>
                <div style={{ position: "absolute", left: "60%", top: -7, width: 2, height: 18, background: GOLD }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "rgba(242,235,217,0.5)", letterSpacing: "0.12em" }}>
                <span>NI SCANDALE</span><span>MOYENNE PAYS ÉMERGENTS</span><span>NI JACKPOT</span>
              </div>
            </div>
          )}
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: "rgba(242,235,217,0.4)", letterSpacing: "0.16em", marginTop: 6 }}>
            PARTICIPATION · TAXES · ROYALTIES
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default SenegalScene1;
