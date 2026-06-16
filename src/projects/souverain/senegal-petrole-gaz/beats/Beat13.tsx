import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill, Audio, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import {
  applyGeoAfriqueV5,
  MAPBOX_STYLES,
} from "../../../_shared/mapbox/MapboxBase";
import { SourceTag } from "../../../_shared/components/overlays/SourceTag";
import { KraftGrain } from "../../../_shared/components/overlays/KraftDepth";

// Beat13 — S3 Mecanisme 3 : Coulisses Yakaar
// Duree : 1540f = 51.33s @30fps (allonge de 70f pour couvrir la phrase finale jusqu'a Beat14)
// Audio : startFrom=8851 (295.02s, apres "Mecanisme 3"), endAt=10391 (346.37s)
//
// Phase A  f0→505     Carte Mapbox zoom Yakaar + labels acteurs (Cosmos/BP/Petrosen)
// Phase B  f505→931   CoinFlip SVG — capitales regardent, face Europe / pile Chine
// Phase C  f931→1470  Europe ralentit (barres) + Pekin avance + question finale typewriter
//
// Timestamps Whisper (offset depuis 295.02s) :
//   "Yakaar Teranga Gazier" → 296.86s → +1.84s → f55
//   "Cosmos / BP / Petrosen"→ 304.06s → +9.04s → f271
//   "aucune decision finale"→ 307.28s → +12.26s → f368
//   "Ce champ attend"       → 311.88s → +16.86s → f505  (debut Phase B)
//   "discussions chinoises" → 319.42s → +24.40s → f732
//   "Pekin regarde"         → 326.04s → +31.02s → f931  (debut Phase C)
//   "l'Europe ralentit"     → 330.24s → +35.22s → f1057
//   "Si les Occidentaux"    → 336.02s → +41.00s → f1230
//   "tres vite" (fin)       → 343.38s → +48.36s → f1451

const F_A_END = 505;
const F_B_END = 931;
const F_END   = 1540;

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const YAKAAR: [number, number] = [-18.00, 14.20];

const KRAFT_BG   = "#e8d5b0";
const KRAFT_DARK = "#2d1810";
const KRAFT_MID  = "#c4a882";
const GOLD       = "#c8a951";
const RED_BRICK  = "#8b2020";
const CYAN       = "#a3d2e6";
const IVORY      = "#f5f0e8";
const SAUGE      = "#7a9e7e";

function typewriter(text: string, frame: number, speed = 3): string {
  return text.slice(0, Math.floor(frame / speed));
}

type DotPos = { x: number; y: number };

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export const Beat13: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const [yakaarDot, setYakaarDot] = useState<DotPos>({ x: 960, y: 540 });

  // ── Init Map ─────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: YAKAAR,
      zoom: 4.5,
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

  // ── Moteur caméra Phase A ─────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || frame > F_A_END) return;
    const prog = Math.min(frame / F_A_END, 1);
    const ease = easeInOutCubic(prog);
    const zoom    = interpolate(ease, [0, 1], [4.5, 6.8], {});
    const pitch   = interpolate(ease, [0, 1], [0,   35],  {});
    const bearing = interpolate(ease, [0, 1], [0,   12],  {});
    map.jumpTo({ center: YAKAAR, zoom, pitch, bearing });
    const pt = map.project(YAKAAR);
    setYakaarDot({ x: pt.x, y: pt.y });
  });

  // ── Transitions opacite ──────────────────────────────────────
  const opMap = interpolate(frame, [F_A_END - 20, F_A_END], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opB = interpolate(frame, [F_A_END, F_A_END + 20, F_B_END - 20, F_B_END], [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opC = interpolate(frame, [F_B_END, F_B_END + 20], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Phase A : overlays carte ─────────────────────────────────
  const cosmosOp   = interpolate(frame, [271, 291], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bpOp       = interpolate(frame, [290, 310], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const petrosenOp = interpolate(frame, [309, 329], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const decisionOp = interpolate(frame, [368, 390], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dotPulse   = 1 + 0.15 * Math.sin(frame * 0.18);

  // ── Phase B : Jeu de bascule Europe → Chine ─────────────────
  const bL = Math.max(0, frame - F_A_END);
  const titleOpB = interpolate(bL, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleYB  = interpolate(bL, [0, 20], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Europe : apparaît au centre (x=960), puis glisse à gauche (x=480) quand Chine arrive
  // "discussions chinoises" = bL=227 → déclencheur du glissement
  const europeScale = spring({ frame: Math.max(0, bL - 40), fps, config: { damping: 14, stiffness: 100 } });
  const europeRot   = 5 * Math.sin(bL * 0.06);
  // Glissement : x=960 → 480, opacité 1 → 0.45, scale 1 → 0.82
  const europeShift = spring({ frame: Math.max(0, bL - 227), fps, config: { damping: 18, stiffness: 60 } });
  const europeX     = interpolate(europeShift, [0, 1], [960, 460], {});
  const europeOp    = interpolate(europeShift, [0, 1], [1, 0.45], {});
  const europeSize  = interpolate(europeShift, [0, 1], [1, 0.82], {});

  // Chine : émerge puissamment à droite (stiffness élevée = arrivée rapide)
  const chineScale = spring({ frame: Math.max(0, bL - 227), fps, config: { damping: 12, stiffness: 140 } });
  const chineRot   = -4 * Math.sin(bL * 0.05 + 1);
  const pekinPulse = bL > 400 ? 1 + 0.08 * Math.sin((bL - 400) * 0.25) : 1;

  // "?" central — disparaît quand Chine arrive
  const qScale  = spring({ frame: Math.max(0, bL - 100), fps, config: { damping: 10, stiffness: 80 } });
  const qOp     = interpolate(bL, [220, 260], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Phase C : barres croissance + typewriter + filigrane ─────
  const cL = Math.max(0, frame - F_B_END);
  const titleOpC = interpolate(cL, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const europeBarW_full = 480;
  // Barres : croissance gauche→droite avec easing power2 (interpolate cubic approx)
  const europeBarProg = interpolate(cL, [0, 45], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const europeBarW_init = europeBarW_full * (europeBarProg * (2 - europeBarProg)); // easeOutQuad
  // Recul Europe à partir de "l'Europe ralentit" (cL=126)
  const europeBarW = interpolate(cL, [126, 240], [europeBarW_init > 0 ? europeBarW_full : 0, 120],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const chineBarProg = interpolate(cL, [30, 90], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chineBarW_base = 80 * (chineBarProg * (2 - chineBarProg)); // easeOutQuad
  const chineBarW = interpolate(cL, [30, 210], [chineBarW_base, 360],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bounce check — apparaît quand barre Europe est établie (cL=50)
  const europeCheckBounce = spring({ frame: Math.max(0, cL - 50), fps,
    config: { damping: 8, stiffness: 200, mass: 0.6 } });
  const chineCheckBounce  = spring({ frame: Math.max(0, cL - 90), fps,
    config: { damping: 8, stiffness: 200, mass: 0.6 } });

  const lineOp = interpolate(cL, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Filigrane "?" géant (arrière-plan, 5% opacité)
  const filOp = interpolate(cL, [299, 340], [0, 0.06],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const twFrame = Math.max(0, cL - 299);
  const tw1 = typewriter("SI LES OCCIDENTAUX SE RETIRENT DE YAKAAR", twFrame, 2);
  const tw2 = twFrame > 80  ? typewriter("QUI PREND LA PLACE ?", twFrame - 80, 2) : "";
  const tw3 = twFrame > 150 ? typewriter("ET A QUELLES CONDITIONS ?", twFrame - 150, 2) : "";

  return (
    <AbsoluteFill style={{ backgroundColor: KRAFT_BG }}>
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3")}
        startFrom={8851} endAt={10391}
        volume={interpolate(frame, [64, 74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {/* Music loop: piste demarre a 295s, dure 26s -> s'arrête a f780. On relance depuis debut. */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        startFrom={8851}
        volume={interpolate(frame, [F_END - 45, F_END], [0.05, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        startFrom={0}
        playbackRate={1}
        volume={interpolate(frame, [780, 800, F_END - 45, F_END], [0, 0.05, 0.05, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />

      {/* ── PHASE A : Carte Mapbox Yakaar ── */}
      <AbsoluteFill style={{ opacity: opMap }}>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
        <style>{`.mapboxgl-ctrl-bottom-left,.mapboxgl-ctrl-bottom-right,.mapboxgl-ctrl-logo,.mapboxgl-ctrl-attrib{display:none!important}`}</style>
        <svg
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox="0 0 1920 1080"
        >
          {/* Titre */}
          <g opacity={interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <text x={960} y={80} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={24} fontWeight={400} fill={IVORY} opacity={0.8} letterSpacing="0.14em">
              MECANISME 3 — COULISSES YAKAAR
            </text>
          </g>

          {/* Dot Yakaar */}
          <circle cx={yakaarDot.x} cy={yakaarDot.y} r={14 * dotPulse} fill={CYAN} opacity={0.25} />
          <circle cx={yakaarDot.x} cy={yakaarDot.y} r={9} fill={CYAN} />
          <circle cx={yakaarDot.x} cy={yakaarDot.y} r={4} fill={IVORY} />
          <circle cx={yakaarDot.x} cy={yakaarDot.y}
            r={interpolate(frame % 90, [0, 90], [14, 48], {})}
            fill="none" stroke={CYAN} strokeWidth={1.5}
            opacity={interpolate(frame % 90, [0, 60, 90], [0.6, 0.2, 0], {})} />
          <text x={yakaarDot.x + 24} y={yakaarDot.y - 8}
            fontFamily='"IBM Plex Mono", monospace' fontSize={22}
            fontWeight={700} fill={CYAN} letterSpacing="0.1em">YAKAAR-TERANGA</text>
          <text x={yakaarDot.x + 24} y={yakaarDot.y + 16}
            fontFamily='"IBM Plex Mono", monospace' fontSize={14}
            fontWeight={400} fill={IVORY} opacity={0.7} letterSpacing="0.08em">GAZIER OFFSHORE</text>

          {/* Acteurs */}
          <g opacity={cosmosOp}>
            <rect x={580} y={300} width={150} height={36} rx={4} fill={KRAFT_DARK} opacity={0.92} />
            <text x={655} y={323} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={16} fontWeight={600} fill={GOLD} letterSpacing="0.08em">COSMOS</text>
          </g>
          <g opacity={bpOp}>
            <rect x={744} y={300} width={80} height={36} rx={4} fill={KRAFT_DARK} opacity={0.92} />
            <text x={784} y={323} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={16} fontWeight={600} fill={GOLD} letterSpacing="0.08em">BP</text>
          </g>
          <g opacity={petrosenOp}>
            <rect x={838} y={300} width={155} height={36} rx={4} fill={KRAFT_DARK} opacity={0.92} />
            <text x={915} y={323} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={16} fontWeight={600} fill={SAUGE} letterSpacing="0.08em">PETROSEN</text>
          </g>
          <line x1={730} y1={336} x2={yakaarDot.x - 10} y2={yakaarDot.y - 12}
            stroke={GOLD} strokeWidth={1} opacity={cosmosOp * 0.35} strokeDasharray="6 4" />

          {/* Bandeau décision */}
          <g opacity={decisionOp}>
            <rect x={580} y={840} width={760} height={52} rx={6} fill={KRAFT_DARK} opacity={0.92}
              stroke={CYAN} strokeWidth={1} />
            <text x={960} y={872} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={18} fontWeight={600} fill={IVORY} letterSpacing="0.1em">
              AUCUNE DECISION FINALE D'INVESTISSEMENT
            </text>
          </g>
        </svg>
      </AbsoluteFill>

      {/* ── PHASE B : CoinFlip ── */}
      <AbsoluteFill style={{ opacity: opB, backgroundColor: KRAFT_BG }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">

          {/* Titre */}
          <g opacity={titleOpB} transform={`translate(0, ${titleYB})`}>
            <text x={960} y={130} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={26} fontWeight={400} fill={KRAFT_DARK} letterSpacing="0.14em">
              PLUSIEURS CAPITALES REGARDENT
            </text>
            <text x={960} y={160} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={16} fontWeight={400} fill={KRAFT_DARK} opacity={0.5} letterSpacing="0.1em">
              QUI VA FINANCER LE DEVELOPPEMENT DE YAKAAR
            </text>
          </g>

          {/* Piece Europe — glisse gauche + s'efface quand Chine arrive */}
          <g transform={`translate(${europeX}, 520) scale(${europeScale * europeSize}) rotate(${europeRot})`}
            opacity={europeOp}>
            <polygon points="0,-155 134,-77 134,77 0,155 -134,77 -134,-77"
              fill={KRAFT_MID} stroke={GOLD} strokeWidth={4} />
            <polygon points="0,-135 117,-67 117,67 0,135 -117,67 -117,-67"
              fill={KRAFT_DARK} />
            {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => {
              const a = (i * 30 - 90) * Math.PI / 180;
              return (
                <text key={i} x={78 * Math.cos(a)} y={78 * Math.sin(a) + 6}
                  textAnchor="middle" fontFamily="serif" fontSize={17} fill={GOLD}>★</text>
              );
            })}
            <text y={-18} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={30} fontWeight={700} fill={GOLD} letterSpacing="0.05em">EUROPE</text>
            <text y={20} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={15} fontWeight={400} fill={IVORY} opacity={0.7} letterSpacing="0.08em">COSMOS · BP</text>
          </g>
          <g opacity={europeOp * europeScale}>
            <text x={europeX} y={720} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={16} fontWeight={400} fill={KRAFT_DARK} opacity={0.7} letterSpacing="0.1em">
              PARTENAIRES ACTUELS
            </text>
          </g>

          {/* Point d'interrogation central — disparaît quand Chine arrive */}
          <g transform={`translate(960, 520) scale(${qScale})`} opacity={qOp}>
            <text textAnchor="middle" dominantBaseline="middle"
              fontFamily='"IBM Plex Mono", monospace' fontSize={110} fontWeight={700}
              fill={KRAFT_DARK} opacity={0.12}>?</text>
          </g>

          {/* Piece Chine */}
          <g transform={`translate(1380, 520) scale(${chineScale}) rotate(${chineRot})`}>
            <polygon points="0,-155 134,-77 134,77 0,155 -134,77 -134,-77"
              fill={KRAFT_MID} stroke={RED_BRICK} strokeWidth={4} />
            <polygon points="0,-135 117,-67 117,67 0,135 -117,67 -117,-67"
              fill={KRAFT_DARK} />
            <text textAnchor="middle" dominantBaseline="middle"
              fontFamily="serif" fontSize={75} fill={RED_BRICK}>★</text>
            {[0,1,2,3].map((i) => {
              const a = (i * 90 - 45) * Math.PI / 180;
              return (
                <text key={i} x={70 * Math.cos(a)} y={70 * Math.sin(a) + 7}
                  textAnchor="middle" fontFamily="serif" fontSize={24} fill={RED_BRICK}>★</text>
              );
            })}
            <text y={-22} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={30} fontWeight={700} fill={IVORY} letterSpacing="0.05em">CHINE</text>
            <text y={20} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={15} fontWeight={400} fill={IVORY} opacity={0.7} letterSpacing="0.08em">EN DISCUSSION</text>
          </g>
          <g opacity={chineScale}>
            <text x={1380} y={720} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={16} fontWeight={400} fill={KRAFT_DARK} opacity={0.7} letterSpacing="0.1em">
              RIEN DE SIGNE
            </text>
            <g transform={`scale(${pekinPulse})`} style={{ transformOrigin: "1380px 755px" }}>
              <text x={1380} y={755} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
                fontSize={20} fontWeight={700} fill={RED_BRICK} letterSpacing="0.1em">
                PEKIN REGARDE
              </text>
            </g>
          </g>
        </svg>
      </AbsoluteFill>

      {/* ── PHASE C : Europe ralentit + question ── */}
      <AbsoluteFill style={{ opacity: opC, backgroundColor: KRAFT_BG }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">

          {/* Filigrane "?" géant en arrière-plan (5-6% opacité) */}
          <text x={960} y={680} textAnchor="middle" dominantBaseline="middle"
            fontFamily='"IBM Plex Mono", monospace' fontSize={620} fontWeight={700}
            fill={KRAFT_DARK} opacity={filOp}>?</text>

          {/* Titre */}
          <g opacity={titleOpC}>
            <text x={960} y={120} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={24} fontWeight={400} fill={KRAFT_DARK} letterSpacing="0.14em">
              PRESSION CLIMATIQUE
            </text>
            <text x={960} y={152} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={16} fontWeight={400} fill={KRAFT_DARK} opacity={0.5} letterSpacing="0.1em">
              L'EUROPE RALENTIT SES INVESTISSEMENTS DANS LES CHAMPS GAZIERS
            </text>
          </g>

          {/* Barre Europe */}
          <g opacity={interpolate(cL, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <text x={250} y={295} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={18} fontWeight={600} fill={GOLD} letterSpacing="0.1em">EUROPE</text>
            <rect x={500} y={268} width={europeBarW_full} height={40} rx={4} fill={KRAFT_MID} opacity={0.3} />
            <rect x={500} y={268} width={europeBarW} height={40} rx={4} fill={GOLD} />
            {cL > 126 && (
              <text x={500 + europeBarW + 14} y={294} fontFamily='"IBM Plex Mono", monospace'
                fontSize={22} fill={RED_BRICK}>↙</text>
            )}
            {/* Bounce check quand barre Europe est établie */}
            <g transform={`translate(${500 + europeBarW_full + 55}, 288) scale(${europeCheckBounce})`}
              opacity={europeCheckBounce}>
              <circle r={14} fill={KRAFT_DARK} />
              <text textAnchor="middle" dominantBaseline="middle"
                fontFamily='"IBM Plex Mono", monospace' fontSize={16} fontWeight={700} fill={GOLD}>✓</text>
            </g>
          </g>

          {/* Barre Chine */}
          <g opacity={interpolate(cL, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <text x={250} y={375} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
              fontSize={18} fontWeight={600} fill={RED_BRICK} letterSpacing="0.1em">CHINE</text>
            <rect x={500} y={348} width={europeBarW_full} height={40} rx={4} fill={KRAFT_MID} opacity={0.3} />
            <rect x={500} y={348} width={chineBarW} height={40} rx={4} fill={RED_BRICK} opacity={0.8} />
            {chineBarW > 200 && (
              <text x={500 + chineBarW + 14} y={374} fontFamily='"IBM Plex Mono", monospace'
                fontSize={22} fill={RED_BRICK}>↗</text>
            )}
            {/* Bounce check quand barre Chine est établie */}
            <g transform={`translate(${500 + europeBarW_full + 55}, 368) scale(${chineCheckBounce})`}
              opacity={chineCheckBounce}>
              <circle r={14} fill={KRAFT_DARK} />
              <text textAnchor="middle" dominantBaseline="middle"
                fontFamily='"IBM Plex Mono", monospace' fontSize={16} fontWeight={700} fill={RED_BRICK}>✓</text>
            </g>
          </g>

          {/* Ligne séparatrice */}
          <line x1={200} y1={420} x2={1720} y2={420}
            stroke={KRAFT_DARK} strokeWidth={1} opacity={lineOp * 0.3} />

          {/* Question finale typewriter */}
          <text x={960} y={520} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
            fontSize={28} fontWeight={700} fill={KRAFT_DARK} letterSpacing="0.06em">{tw1}</text>
          <text x={960} y={600} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
            fontSize={38} fontWeight={700} fill={GOLD} letterSpacing="0.06em">{tw2}</text>
          <text x={960} y={660} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace'
            fontSize={26} fontWeight={400} fill={KRAFT_DARK} opacity={0.65} letterSpacing="0.06em">{tw3}</text>

          {/* Rappel dot Yakaar */}
          {cL > 150 && (
            <g opacity={interpolate(cL, [150, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
              <circle cx={960} cy={860} r={7} fill={CYAN} />
              <text x={978} y={866} fontFamily='"IBM Plex Mono", monospace'
                fontSize={15} fill={CYAN} letterSpacing="0.08em">YAKAAR-TERANGA</text>
            </g>
          )}
        </svg>
      </AbsoluteFill>
      {/* SFX — Zoom In debut Phase A (carte Yakaar) */}
      {frame === 5 && <Audio src={staticFile("_shared/sfx/camera/sfx-swoosh-zoomin.mp3")} volume={0.35} />}

      {/* Grain papier sur phases kraft uniquement (eteint pendant la carte via 1-opMap) */}
      <KraftGrain opacity={0.055 * (1 - opMap)} />

      {/* Sources */}
      <SourceTag source="Kosmos Energy / PETROSEN — 2024" startFrame={F_A_END} endFrame={F_B_END} />
    </AbsoluteFill>
  );
};

export default Beat13;
