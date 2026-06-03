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
  applyGeoAfriqueV5,
  MAPBOX_STYLES,
} from "../../../_shared/mapbox/MapboxBase";
import { QuoteImpact } from "../../../_shared/components/layouts/QuoteImpact";
import { GridOverlay } from "../../../_shared/components/overlays/GridOverlay";
import { SourceTag } from "../../../_shared/components/overlays/SourceTag";

// Beat14 — Acte 4 : L'IMPLICATION (scene finale)
// Duree : 2217f = 73.9s @30fps
// Audio : startFrom=10391 (346.36s), endAt=12608 (420.26s)
//
// Phase A  f0   →f772   Mapbox dezoom Yakaar→Afrique Ouest + 3 plates garde-fous
// Phase B  f772 →f1140  Mapbox maintenu + slashes rouges + fragilites
// Phase C  f1140→f1601  ParadigmShiftTimeline (Norvege/Botswana/Senegal)
// Phase D  f1601→f2012  QuoteImpact (phrase cle navy gold)
// Phase E  f2012→f2217  CTA minimaliste fond navy

const F_A_END = 772;
const F_B_END = 1140;
const F_C_END = 1601;
const F_D_END = 2012;
const F_END   = 2217;
const F_TOTAL = 2307; // +90f fade out final

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Coordonnees
const YAKAAR: [number, number]         = [-18.0, 14.2];
const SANGOMAR: [number, number]       = [-17.3, 12.5];
// Vue finale dezoom : centree plus a l'est pour que Senegal occupe tiers centre-gauche
// Ocean visible a gauche mais Senegal lisible, continent a droite
const SENEGAL_VIEW: [number, number]   = [-13.5, 13.8];

const GOLD  = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY  = "#16213a";
const RED   = "#ef4444";

type Pos = { x: number; y: number };

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Plate label — dark navy rect + gold left bar + ivory text
// FIX P3: slash calcule correctement depuis le coin superieur-gauche de la plate
function PlateLabel({
  text,
  x,
  y,
  width = 320,
  height = 54,
  opacity = 1,
  slashProgress = 0,
  captionText = "",
  captionOpacity = 0,
}: {
  text: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  opacity?: number;
  slashProgress?: number;
  captionText?: string;
  captionOpacity?: number;
}) {
  // Slash diagonal du coin sup-gauche vers coin inf-droit de la plate
  const slashLen = Math.sqrt(width ** 2 + height ** 2);
  const drawn    = slashLen * Math.min(slashProgress, 1);
  const angle    = Math.atan2(height, width);
  const x2       = x + drawn * Math.cos(angle);
  const y2       = y + drawn * Math.sin(angle);

  return (
    <g opacity={opacity}>
      {/* Plate background */}
      <rect x={x} y={y} width={width} height={height} rx={3} fill="#0d1525" />
      {/* Gold left bar */}
      <rect x={x} y={y} width={5} height={height} rx={2} fill={GOLD} />
      {/* Label text */}
      <text
        x={x + 20}
        y={y + height / 2 + 7}
        fontFamily="IBM Plex Mono, monospace"
        fontSize={22}
        fill={IVORY}
        letterSpacing="0.08em"
      >
        {text}
      </text>

      {/* Red slash drawn progressively */}
      {slashProgress > 0 && (
        <line
          x1={x}
          y1={y}
          x2={x2}
          y2={y2}
          stroke={RED}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.92}
        />
      )}

      {/* Fragility caption to the right */}
      {captionOpacity > 0 && captionText && (
        <text
          x={x + width + 18}
          y={y + height / 2 + 7}
          fontFamily="IBM Plex Mono, monospace"
          fontSize={20}
          fill={RED}
          opacity={captionOpacity}
          letterSpacing="0.04em"
        >
          {captionText}
        </text>
      )}
    </g>
  );
}

// Dot gold pulsant
function MapDot({
  pos,
  frame,
  opacity = 1,
  label = "",
}: {
  pos: Pos;
  frame: number;
  opacity?: number;
  label?: string;
}) {
  const pulse = 1 + 0.18 * Math.sin(frame * 0.18);
  return (
    <g opacity={opacity}>
      <circle cx={pos.x} cy={pos.y} r={10 * pulse} fill={GOLD} opacity={0.18} />
      <circle cx={pos.x} cy={pos.y} r={6} fill={GOLD} />
      {label && (
        <text
          x={pos.x + 14}
          y={pos.y + 5}
          fontFamily="IBM Plex Mono, monospace"
          fontSize={16}
          fill={GOLD}
          letterSpacing="0.06em"
        >
          {label}
        </text>
      )}
    </g>
  );
}

export const Beat14: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const [yakaarPos, setYakaarPos] = useState<Pos>({ x: width * 0.28, y: height * 0.52 });
  const [sangPos,   setSangPos]   = useState<Pos>({ x: width * 0.25, y: height * 0.60 });

  // ── Init Mapbox ───────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: YAKAAR,
      zoom: 5.2,
      bearing: 0,
      pitch: 0,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
    });
    map.on("style.load", () => {
      try {
        (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
        applyGeoAfriqueV5(map);
      } catch (_e) {}
    });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // ── Moteur camera Phases A+B ──────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || frame >= F_B_END) return;

    if (frame < F_A_END) {
      // Phase A : Pull Back Reveal — dezoom Yakaar→ vue Senegal+Afrique Ouest
      // FIX P2: zoom final 4.2 (pas 3.4) pour garder Senegal lisible, centrage SENEGAL_VIEW
      const prog = easeInOutCubic(Math.min(frame / F_A_END, 1));
      const zoom    = interpolate(prog, [0, 1], [5.2, 4.2], {});
      const bearing = interpolate(prog, [0, 1], [0, -4], {});
      const lon     = interpolate(prog, [0, 1], [YAKAAR[0], SENEGAL_VIEW[0]], {});
      const lat     = interpolate(prog, [0, 1], [YAKAAR[1], SENEGAL_VIEW[1]], {});
      map.jumpTo({ center: [lon, lat], zoom, bearing, pitch: 0 });
    } else {
      // Phase B : orbit tres lent
      const bFrame = frame - F_A_END;
      const bearing = interpolate(bFrame, [0, F_B_END - F_A_END], [-4, 4], {});
      map.jumpTo({ center: SENEGAL_VIEW, zoom: 4.2, bearing, pitch: 0 });
    }

    try {
      const py = map.project(YAKAAR as [number, number]);
      setYakaarPos({ x: py.x, y: py.y });
      const ps = map.project(SANGOMAR as [number, number]);
      setSangPos({ x: ps.x, y: ps.y });
    } catch (_e) {}
  });

  // ── Opacites de transition entre phases ──────────────────────
  const opMap = interpolate(frame,
    [F_B_END - 20, F_B_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opC = interpolate(frame,
    [F_B_END, F_B_END + 20, F_C_END - 20, F_C_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opD = interpolate(frame,
    [F_C_END, F_C_END + 15, F_D_END - 20, F_D_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opE = interpolate(frame,
    [F_D_END, F_D_END + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Phase A : overlays ────────────────────────────────────────
  // Micro-stat "10 mois" — a f90
  const opStat  = interpolate(frame, [90, 115], [0, 1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const statSp  = spring({ fps, frame: Math.max(0, frame - 90),  config: { damping: 80, stiffness: 55 } });
  const statScale = interpolate(statSp, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });

  // 3 plates spring stagger
  const sp1 = spring({ fps, frame: Math.max(0, frame - 240), config: { damping: 80, stiffness: 55 } });
  const sp2 = spring({ fps, frame: Math.max(0, frame - 330), config: { damping: 80, stiffness: 55 } });
  const sp3 = spring({ fps, frame: Math.max(0, frame - 420), config: { damping: 80, stiffness: 55 } });
  const opFonsis = interpolate(sp1, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const opItie   = interpolate(sp2, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const opLoi    = interpolate(sp3, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Dots Yakaar + Sangomar — a f550
  const opDots = interpolate(frame, [550, 580], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Lignes de connexion drawPath
  const lineP = interpolate(frame, [240, 320], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Phase B : slashes + captions ─────────────────────────────
  const bFrame = Math.max(0, frame - F_A_END);
  const slashF = interpolate(bFrame, [0,  40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slashI = interpolate(bFrame, [20, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slashL = interpolate(bFrame, [40, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opCapDette   = interpolate(bFrame, [50,  75],  [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opCapContrat = interpolate(bFrame, [100, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opCapYakaar  = interpolate(bFrame, [180, 205], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Overlay navy leger Phase B pour lisibilite rouge
  const navyOverlayB = interpolate(frame,
    [F_A_END, F_A_END + 30],
    [0, 0.42],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Phase C : Reveal sequentiel minimaliste (3 moments) ──────
  // 461 frames totales → 3 blocs ~140f chacun + chevauchement fade 20f
  const cFrame = Math.max(0, frame - F_B_END);
  const C_DUR  = F_C_END - F_B_END; // 461f

  // Bornes de chaque moment (relatif a cFrame)
  const C1_IN  = 0;   const C1_OUT = Math.round(C_DUR * 0.38); // Botswana
  const C2_IN  = Math.round(C_DUR * 0.33); const C2_OUT = Math.round(C_DUR * 0.70); // Norvege
  const C3_IN  = Math.round(C_DUR * 0.65); const C3_OUT = C_DUR; // Senegal

  const FADE = 18; // frames de cross-fade

  const opC1 = interpolate(cFrame,
    [C1_IN, C1_IN + FADE, C1_OUT - FADE, C1_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opC2 = interpolate(cFrame,
    [C2_IN, C2_IN + FADE, C2_OUT - FADE, C2_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opC3 = interpolate(cFrame,
    [C3_IN, C3_IN + FADE, C3_OUT - FADE, C3_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Phase E : CTA ─────────────────────────────────────────────
  const eFrame    = Math.max(0, frame - F_D_END);
  const lineE     = interpolate(eFrame, [0,  40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opCTALabel= interpolate(eFrame, [35, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opCTATitle= interpolate(eFrame, [65, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaGlow   = 0.9 + 0.1 * Math.sin(eFrame * 0.12);

  // ── Layout plates : ancrees dans la zone terre (droite de l'ecran) ─
  const PLATE_X = width * 0.58;
  const PLATE_W = 330;
  const PLATE_H = 54;
  const PLATE_FONSIS_Y = height * 0.22;
  const PLATE_ITIE_Y   = height * 0.44;
  const PLATE_LOI_Y    = height * 0.66;

  // ── Audio ─────────────────────────────────────────────────────
  const VOL_NARRATION = interpolate(frame,
    [0, 15, F_END, F_TOTAL],
    [0, 1,  1,     0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const VOL_MUSIC = interpolate(frame,
    [0, 20, F_END, F_TOTAL],
    [0, 0.05, 0.05, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade out visuel global sur les 90 dernières frames
  const globalFadeOut = interpolate(frame,
    [F_END, F_TOTAL],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    // FIX P1: fond navy visible des f0 — la carte s'affiche par-dessus
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden", opacity: globalFadeOut }}>

      {/* ── AUDIO ──────────────────────────────────────────────── */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3")}
        startFrom={10391}
        endAt={12608}
        volume={VOL_NARRATION}
      />
      {/* Music loop: piste epuisee au startFrom=346s → relancer depuis 0 */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        startFrom={0}
        volume={VOL_MUSIC}
      />

      {/* ══════════════════════════════════════════════════════════
          PHASES A+B — MAPBOX + OVERLAYS SVG
      ══════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: opMap }}>
        {/* Mapbox container */}
        <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

        {/* Watermark mask */}
        <style>{`.mapboxgl-ctrl-bottom-left,.mapboxgl-ctrl-bottom-right,.mapboxgl-ctrl-logo,.mapboxgl-ctrl-attrib{display:none!important}`}</style>

        {/* Overlay navy Phase B (lisibilite texte rouge) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: NAVY,
            opacity: navyOverlayB,
            pointerEvents: "none",
          }}
        />

        {/* SVG overlay */}
        <svg
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          width={width}
          height={height}
        >
          {/* Lignes de connexion dot → plates */}
          {lineP > 0 && [PLATE_FONSIS_Y, PLATE_ITIE_Y, PLATE_LOI_Y].map((plateY, i) => (
            <line
              key={i}
              x1={yakaarPos.x}
              y1={yakaarPos.y}
              x2={yakaarPos.x + lineP * (PLATE_X - yakaarPos.x)}
              y2={yakaarPos.y + lineP * (plateY + PLATE_H / 2 - yakaarPos.y)}
              stroke={GOLD}
              strokeWidth={1.5}
              strokeOpacity={0.45}
              strokeDasharray="4 3"
            />
          ))}

          {/* Micro-stat Phase A */}
          {opStat > 0 && (
            <g
              opacity={opStat}
              transform={`scale(${statScale})`}
              style={{ transformOrigin: `${width * 0.18}px ${height * 0.82}px` }}
            >
              <rect
                x={width * 0.05}
                y={height * 0.79}
                width={430}
                height={74}
                rx={4}
                fill="#0d1525"
                fillOpacity={0.92}
              />
              <rect x={width * 0.05} y={height * 0.79} width={5} height={74} rx={2} fill={GOLD} />
              <text
                x={width * 0.05 + 22}
                y={height * 0.79 + 26}
                fontFamily="IBM Plex Mono, monospace"
                fontSize={15}
                fill={GOLD}
                letterSpacing="0.12em"
                opacity={0.8}
              >
                EN 10 MOIS
              </text>
              <text
                x={width * 0.05 + 22}
                y={height * 0.79 + 55}
                fontFamily="Cinzel, serif"
                fontSize={22}
                fill={IVORY}
                letterSpacing="0.04em"
              >
                DE ZERO A EXPORTATEUR
              </text>
            </g>
          )}

          {/* Dots Yakaar + Sangomar */}
          {opDots > 0 && (
            <g opacity={opDots}>
              <MapDot pos={yakaarPos} frame={frame} label="YAKAAR" />
              <MapDot pos={sangPos}   frame={frame} label="SANGOMAR" />
            </g>
          )}

          {/* Plates FONSIS / ITIE / LOI */}
          <PlateLabel
            text="FONSIS"
            x={PLATE_X} y={PLATE_FONSIS_Y}
            width={PLATE_W} height={PLATE_H}
            opacity={opFonsis}
            slashProgress={frame >= F_A_END ? slashF : 0}
            captionText="Dette 80% PIB"
            captionOpacity={frame >= F_A_END ? opCapDette : 0}
          />
          <PlateLabel
            text="ITIE"
            x={PLATE_X} y={PLATE_ITIE_Y}
            width={PLATE_W} height={PLATE_H}
            opacity={opItie}
            slashProgress={frame >= F_A_END ? slashI : 0}
            captionText="Contrats partiels"
            captionOpacity={frame >= F_A_END ? opCapContrat : 0}
          />
          <PlateLabel
            text="LOI LOCAL CONTENT"
            x={PLATE_X} y={PLATE_LOI_Y}
            width={PLATE_W} height={PLATE_H}
            opacity={opLoi}
            slashProgress={frame >= F_A_END ? slashL : 0}
            captionText="Yakaar incertain"
            captionOpacity={frame >= F_A_END ? opCapYakaar : 0}
          />
        </svg>
      </AbsoluteFill>

      {/* ══════════════════════════════════════════════════════════
          PHASE C — Reveal sequentiel minimaliste
          3 moments independants : Botswana → Norvege → Senegal
          Drapeau national flouté + desature en fond
      ══════════════════════════════════════════════════════════ */}
      {opC > 0 && (
        <AbsoluteFill style={{ opacity: opC, background: NAVY }}>

          {/* Moment 1 — BOTSWANA */}
          {opC1 > 0 && (
            <AbsoluteFill style={{ opacity: opC1 }}>
              {/* Drapeau Botswana : bleu ciel / blanc / noir / blanc / bleu ciel */}
              <svg
                viewBox="0 0 3 2"
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  filter: "blur(28px) saturate(0.18) brightness(0.55)",
                }}
                preserveAspectRatio="xMidYMid slice"
              >
                <rect width="3" height="2" fill="#75AADB" />
                <rect y="0.77" width="3" height="0.13" fill="#fff" />
                <rect y="0.87" width="3" height="0.26" fill="#000" />
                <rect y="1.10" width="3" height="0.13" fill="#fff" />
              </svg>
              <div style={{ position: "absolute", inset: 0, background: NAVY, opacity: 0.72 }} />
              <AbsoluteFill className="flex flex-col items-center justify-center">
                <p style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 22, letterSpacing: "0.28em",
                  color: IVORY, opacity: 0.6,
                  textTransform: "uppercase", margin: 0, marginBottom: 28,
                }}>
                  Les règles d'abord
                </p>
                <p style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: 130, fontWeight: 700,
                  letterSpacing: "0.05em", color: IVORY,
                  textTransform: "uppercase", margin: 0, marginBottom: 24, lineHeight: 1,
                }}>
                  Botswana
                </p>
                <p style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 26, letterSpacing: "0.12em",
                  color: IVORY, opacity: 0.65, margin: 0,
                }}>
                  Les revenus ont suivi.
                </p>
              </AbsoluteFill>
            </AbsoluteFill>
          )}

          {/* Moment 2 — NORVEGE */}
          {opC2 > 0 && (
            <AbsoluteFill style={{ opacity: opC2 }}>
              {/* Drapeau Norvège : rouge + croix blanche + croix bleue */}
              <svg
                viewBox="0 22 66 44"
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  filter: "blur(28px) saturate(0.18) brightness(0.50)",
                }}
                preserveAspectRatio="xMidYMid slice"
              >
                <rect width="66" height="44" y="22" fill="#EF2B2D" />
                <rect x="14" y="22" width="8" height="44" fill="#fff" />
                <rect x="0" y="39" width="66" height="8" fill="#fff" />
                <rect x="16" y="22" width="4" height="44" fill="#002868" />
                <rect x="0" y="41" width="66" height="4" fill="#002868" />
              </svg>
              <div style={{ position: "absolute", inset: 0, background: NAVY, opacity: 0.72 }} />
              <AbsoluteFill className="flex flex-col items-center justify-center">
                <p style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 22, letterSpacing: "0.28em",
                  color: IVORY, opacity: 0.6,
                  textTransform: "uppercase", margin: 0, marginBottom: 28,
                }}>
                  Les règles d'abord
                </p>
                <p style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: 130, fontWeight: 700,
                  letterSpacing: "0.05em", color: IVORY,
                  textTransform: "uppercase", margin: 0, marginBottom: 24, lineHeight: 1,
                }}>
                  Norvège
                </p>
                <p style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 26, letterSpacing: "0.12em",
                  color: IVORY, opacity: 0.65, margin: 0,
                }}>
                  Les revenus ont suivi.
                </p>
              </AbsoluteFill>
            </AbsoluteFill>
          )}

          {/* Moment 3 — SENEGAL */}
          {opC3 > 0 && (
            <AbsoluteFill style={{ opacity: opC3 }}>
              {/* Drapeau Senegal : vert / or / rouge + etoile verte centre */}
              <svg
                viewBox="0 0 3 2"
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  filter: "blur(40px) saturate(0.15) brightness(0.45)",
                }}
                preserveAspectRatio="xMidYMid slice"
              >
                <rect width="1" height="2" fill="#00853F" />
                <rect x="1" width="1" height="2" fill="#FDEF42" />
                <rect x="2" width="1" height="2" fill="#E31B23" />
                <polygon
                  points="1.5,0.62 1.56,0.82 1.77,0.82 1.60,0.94 1.67,1.14 1.5,1.02 1.33,1.14 1.40,0.94 1.23,0.82 1.44,0.82"
                  fill="#00853F"
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, background: NAVY, opacity: 0.72 }} />
              <AbsoluteFill className="flex flex-col items-center justify-center">
                <p style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 22, letterSpacing: "0.28em",
                  color: GOLD, opacity: 0.6,
                  textTransform: "uppercase", margin: 0, marginBottom: 28,
                }}>
                  C'est maintenant.
                </p>
                <p style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: 130, fontWeight: 700,
                  letterSpacing: "0.05em", color: GOLD,
                  textTransform: "uppercase", margin: 0, marginBottom: 24, lineHeight: 1,
                }}>
                  Sénégal
                </p>
                <p style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 26, letterSpacing: "0.12em",
                  color: GOLD, opacity: 0.65, margin: 0,
                }}>
                  Les règles sont en cours.
                </p>
              </AbsoluteFill>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════════════════════════════
          PHASE D — QuoteImpact
      ══════════════════════════════════════════════════════════ */}
      {opD > 0 && (
        <AbsoluteFill style={{ opacity: opD }}>
          <QuoteImpact
            question="Les décisions des 5 prochaines années vont définir la prochaine génération."
            startFrame={F_C_END}
          />
        </AbsoluteFill>
      )}

      {/* ══════════════════════════════════════════════════════════
          PHASE E — CTA minimaliste
          FIX P5: centrage vertical correct, texte plus grand
      ══════════════════════════════════════════════════════════ */}
      {opE > 0 && (
        <AbsoluteFill style={{ background: NAVY, opacity: opE }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "65%" }}>
            {/* Ligne gold drawPath */}
            <svg
              width="100%"
              height={4}
              style={{ display: "block", marginBottom: 36 }}
              viewBox="0 0 1000 4"
              preserveAspectRatio="none"
            >
              <line
                x1={0} y1={2}
                x2={1000 * lineE} y2={2}
                stroke={GOLD}
                strokeWidth={3.5}
                strokeLinecap="round"
              />
            </svg>

            {/* "Prochaine vidéo →" */}
            <p
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 46,
                letterSpacing: "0.06em",
                color: IVORY,
                opacity: opCTALabel,
                margin: 0,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Prochaine vid&eacute;o &rarr;
            </p>

            {/* Titre sujet suivant */}
            <p
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: 30,
                letterSpacing: "0.04em",
                color: IVORY,
                opacity: opCTATitle * ctaGlow,
                margin: 0,
                lineHeight: 1.5,
                maxWidth: 900,
                textAlign: "center",
              }}
            >
              Comment les fonds souverains africains transforment leurs &eacute;conomies.
            </p>
          </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SFX — plates apparition (Phase A, f240 / f280 / f320) */}
      {frame === 240 && <Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.35} />}
      {frame === 280 && <Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.35} />}
      {frame === 320 && <Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.35} />}

      {/* SFX — slashes rouges (Phase B, F_A_END + 0 / +20 / +40) */}
      {frame === F_A_END && <Audio src={staticFile("_shared/sfx/ui/slash-red.mp3")} volume={0.45} />}
      {frame === F_A_END + 20 && <Audio src={staticFile("_shared/sfx/ui/slash-red.mp3")} volume={0.45} />}
      {frame === F_A_END + 40 && <Audio src={staticFile("_shared/sfx/ui/slash-red.mp3")} volume={0.45} />}

      {/* Sources */}
      <SourceTag source="Loi 2012-22 — Journal officiel Sénégal" startFrame={F_A_END} endFrame={F_B_END} />
    </AbsoluteFill>
  );
};
