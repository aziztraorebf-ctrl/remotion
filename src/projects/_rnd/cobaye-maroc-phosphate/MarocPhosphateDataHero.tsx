// MarocPhosphateDataHero.tsx — COBAYE beat data-viz "70%" (ÉCRASER, Data-Hero)
// Direction validée Aziz (storyboard Gemini beatB-dataviz-gemini.png) :
//   E1  le "70" surgit + count-up
//   E2  le "%" claque + satellite "RÉSERVES MONDIALES" (gauche)
//   E3  satellite "PHOSPHATE" (droite) + segment final "30% reste du monde" écrasé
//       à droite + source USGS 2024
//   plateau final court
//
// Fond OBLIGATOIRE : parchemin crème (PAS navy). Accent OCRE/terre cuite #b06a2c.
// Pivot = CHIFFRE (70). Count-up via <CountUp> partagé (prefix="" — voir GOTCHA).
//
// DataLabel = pattern INLINE recopié de SenegalScene1IntroCoin (PAS de composant partagé).
// REJETS respectés : pas de CSS transition/setTimeout/@keyframes, spring+translateY,
// pop réservé à l'overshoot count-up (bounce du CountUp).

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CountUp } from "../../_shared/components/ui/CountUp";

const W = 1920;
const H = 1080;
const FPS = 30;

// Palette parchemin / ocre (validée)
const PARCHEMIN = "#ece3cb"; // crème de fond
const PARCHEMIN_HI = "#f3ecd6"; // crème un poil plus clair (vignette douce)
const OCRE = "#b06a2c"; // accent terre cuite (chiffre + traits)
const OCRE_GRID = "#c9a86f"; // lignes de grille (ocre désaturé)
const ENCRE = "#5a4528"; // texte secondaire (sépia foncé lisible)

// ── Timeline LOCALE (frame 0 = "soixante-dix") ──
const F_COUNT_S = 6; // le "70" surgit + count-up démarre
const F_COUNT_E = 46; // count-up fini (overshoot)
const F_PCT = 50; // le "%" claque
const F_SAT_L = 62; // satellite gauche "RÉSERVES MONDIALES"
const F_SAT_R = 88; // satellite droite "PHOSPHATE"
const F_SEG = 96; // segment "30% reste du monde" écrasé à droite
const F_SOURCE = 110; // source USGS
// plateau final jusqu'à 165

// Audio : narration V3, "soixante-dix" ~11.6s (calage approximatif cobaye)
const AUDIO_START_SEC = 11.6;

const ease = (p: number) =>
  interpolate(p, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ── Fond parchemin quadrillé (natif SVG, calque le storyboard) ──
const ParcheminGrid: React.FC = () => {
  const minor = 48;
  const cols = Math.ceil(W / minor);
  const rows = Math.ceil(H / minor);
  return (
    <AbsoluteFill style={{ backgroundColor: PARCHEMIN }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="parch-vig" cx="50%" cy="46%" r="70%">
            <stop offset="0%" stopColor={PARCHEMIN_HI} stopOpacity={1} />
            <stop offset="100%" stopColor={PARCHEMIN} stopOpacity={1} />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#parch-vig)" />
        {/* grille mineure */}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * minor}
            y1={0}
            x2={i * minor}
            y2={H}
            stroke={OCRE_GRID}
            strokeWidth={1}
            opacity={0.22}
          />
        ))}
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={i * minor}
            x2={W}
            y2={i * minor}
            stroke={OCRE_GRID}
            strokeWidth={1}
            opacity={0.22}
          />
        ))}
        {/* grille majeure (tous les 4 carreaux) */}
        {Array.from({ length: Math.ceil(cols / 4) + 1 }).map((_, i) => (
          <line
            key={`V${i}`}
            x1={i * minor * 4}
            y1={0}
            x2={i * minor * 4}
            y2={H}
            stroke={OCRE_GRID}
            strokeWidth={1.5}
            opacity={0.4}
          />
        ))}
        {Array.from({ length: Math.ceil(rows / 4) + 1 }).map((_, i) => (
          <line
            key={`H${i}`}
            x1={0}
            y1={i * minor * 4}
            x2={W}
            y2={i * minor * 4}
            stroke={OCRE_GRID}
            strokeWidth={1.5}
            opacity={0.4}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ── Satellite gravé (ocre, plat, trait épais) — repère visuel du storyboard ──
// Plus gros + traits plus épais (signal Gemini : satellites sous-rendus vs storyboard).
const SatelliteIcon: React.FC<{ size?: number }> = ({ size = 92 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: "block" }}>
    <g stroke={OCRE} strokeWidth={4} fill="none" strokeLinejoin="round" strokeLinecap="round">
      {/* corps */}
      <rect x={26} y={26} width={12} height={12} rx={1.5} fill={OCRE} fillOpacity={0.35} />
      {/* panneaux solaires gauche/droite */}
      <rect x={4} y={27} width={16} height={10} fill={OCRE} fillOpacity={0.22} />
      <line x1={12} y1={27} x2={12} y2={37} />
      <rect x={44} y={27} width={16} height={10} fill={OCRE} fillOpacity={0.22} />
      <line x1={52} y1={27} x2={52} y2={37} />
      {/* mâts panneaux */}
      <line x1={20} y1={32} x2={26} y2={32} />
      <line x1={38} y1={32} x2={44} y2={32} />
      {/* antenne parabole */}
      <path d="M 32 26 Q 40 12 52 14" />
      <circle cx={52} cy={14} r={3} fill={OCRE} />
    </g>
  </svg>
);

// ── DataLabel INLINE (recopié de SenegalScene1IntroCoin, adapté parchemin) ──
// ax/ay = ancre du texte ; tx/ty = pointe du trait (vers le chiffre).
const DataLabel: React.FC<{
  ax: number;
  ay: number;
  tx: number;
  ty: number;
  lines: string[];
  appearF: number;
  frame: number;
  fps: number;
  align: "start" | "end";
}> = ({ ax, ay, tx, ty, lines, appearF, frame, fps, align }) => {
  const p = spring({
    frame: frame - appearF,
    fps,
    config: { damping: 20, stiffness: 150 },
    durationInFrames: 22,
  });
  const op = ease(p);
  const draw = interpolate(frame, [appearF, appearF + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // léger glissement vertical à l'entrée (spring + translateY, jamais opacity seule)
  const ty0 = interpolate(p, [0, 1], [14, 0]);
  return (
    <g opacity={op} transform={`translate(0 ${ty0})`}>
      <line
        x1={tx}
        y1={ty}
        x2={tx + (ax - tx) * draw}
        y2={ty + (ay - ty) * draw}
        stroke={OCRE}
        strokeWidth={2}
        opacity={0.9}
      />
      <circle cx={tx} cy={ty} r={4} fill={OCRE} opacity={draw} />
      <text
        x={ax}
        y={ay}
        fill={ENCRE}
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={26}
        fontWeight={700}
        textAnchor={align}
        letterSpacing="1.5"
      >
        {lines.map((l, i) => (
          <tspan key={i} x={ax} dy={i === 0 ? 0 : 30}>
            {l}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export const MarocPhosphateDataHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Centre du pivot CHIFFRE. Le bloc "70%" est centré-gauche pour laisser
  // respirer la droite (satellite PHOSPHATE + segment écrasé), comme le storyboard.
  const pivotX = W * 0.42;
  const pivotY = H * 0.5;

  // ── "%" qui claque (E2) : spring overshoot + translateY ──
  const pctP = spring({
    frame: frame - F_PCT,
    fps,
    config: { damping: 11, stiffness: 180 },
    durationInFrames: 20,
  });
  const pctOp = ease(
    interpolate(frame, [F_PCT, F_PCT + 6], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const pctScale = interpolate(pctP, [0, 1], [0.4, 1]);
  const pctY = interpolate(pctP, [0, 1], [-18, 0]);

  // ── segment "30% reste du monde" ÉCRASÉ à droite (E3) : barre qui se compresse ──
  const segP = spring({
    frame: frame - F_SEG,
    fps,
    config: { damping: 18, stiffness: 140 },
    durationInFrames: 24,
  });
  const segOp = ease(segP);
  // la barre "s'écrase" : hauteur pleine -> hauteur réduite (30%)
  const segScaleY = interpolate(segP, [0, 1], [1, 0.42]);

  // ── source USGS (fade + slide léger) ──
  const srcP = spring({
    frame: frame - F_SOURCE,
    fps,
    config: { damping: 22, stiffness: 120 },
    durationInFrames: 20,
  });
  const srcOp = ease(srcP);
  const srcY = interpolate(srcP, [0, 1], [10, 0]);

  // Le "70" : taille de police hero
  const NUM_SIZE = 360;

  return (
    <AbsoluteFill>
      <ParcheminGrid />

      {/* ── Bloc CHIFFRE "70" + "%" (le pivot) ── */}
      {/* Conteneur ancré sur le pivot ; le "70" via CountUp, le "%" en claque séparée. */}
      <div
        style={{
          position: "absolute",
          left: pivotX,
          top: pivotY,
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "baseline",
          lineHeight: 1,
        }}
      >
        {/* GOTCHA CountUp : prefix défaut "$" -> on force prefix="". Pas de suffix
            ici car le "%" doit claquer SÉPARÉMENT après la fin du count-up. */}
        <CountUp
          target={70}
          startFrame={F_COUNT_S}
          endFrame={F_COUNT_E}
          prefix=""
          fontSize={NUM_SIZE}
          color={OCRE}
          bounce
        />
        {/* "%" qui claque (E2) */}
        <span
          style={{
            fontSize: NUM_SIZE * 0.62,
            fontWeight: 900,
            color: OCRE,
            fontFamily: "Bebas Neue, Impact, Arial Black, sans-serif",
            letterSpacing: "-0.02em",
            display: "inline-block",
            opacity: pctOp,
            transform: `translateY(${pctY}px) scale(${pctScale})`,
            transformOrigin: "left bottom",
            filter: `drop-shadow(0 0 24px ${OCRE}55)`,
            marginLeft: 6,
          }}
        >
          %
        </span>
      </div>

      {/* ── Satellites + segment écrasé + source : SVG overlay plein cadre ── */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* Satellite GAUCHE "RÉSERVES MONDIALES" (E2) */}
        <g
          transform={`translate(${pivotX - 360} ${pivotY - 20})`}
          opacity={ease(
            interpolate(frame, [F_SAT_L, F_SAT_L + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          )}
        >
          <foreignObject x={-20} y={-46} width={96} height={96}>
            <SatelliteIcon size={92} />
          </foreignObject>
        </g>
        <DataLabel
          ax={pivotX - 360}
          ay={pivotY + 90}
          tx={pivotX - 300}
          ty={pivotY + 10}
          lines={["RÉSERVES", "MONDIALES"]}
          appearF={F_SAT_L}
          frame={frame}
          fps={fps}
          align="start"
        />

        {/* Satellite DROITE "PHOSPHATE" (E3) */}
        <g
          transform={`translate(${pivotX + 320} ${pivotY - 120})`}
          opacity={ease(
            interpolate(frame, [F_SAT_R, F_SAT_R + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          )}
        >
          <foreignObject x={0} y={-10} width={92} height={92}>
            <SatelliteIcon size={88} />
          </foreignObject>
        </g>
        <DataLabel
          ax={pivotX + 372}
          ay={pivotY - 150}
          tx={pivotX + 340}
          ty={pivotY - 90}
          lines={["PHOSPHATE"]}
          appearF={F_SAT_R}
          frame={frame}
          fps={fps}
          align="start"
        />

        {/* Segment "30% reste du monde" ÉCRASÉ à droite (E3) :
            une barre verticale fine qui se comprime à 30% (l'inverse du 70% du Maroc). */}
        <g opacity={segOp} transform={`translate(${pivotX + 560} ${pivotY + 20})`}>
          {/* rail complet (fantôme) */}
          <rect x={0} y={-130} width={18} height={260} fill={OCRE} opacity={0.12} rx={2} />
          {/* barre écrasée : ancrée en bas, hauteur 30% */}
          <g transform={`translate(0 130) scale(1 ${segScaleY}) translate(0 -130)`}>
            <rect x={0} y={-130} width={18} height={260} fill={OCRE} opacity={0.55} rx={2} />
          </g>
          {/* trait + label */}
          <line x1={26} y1={70} x2={50} y2={70} stroke={ENCRE} strokeWidth={2} opacity={0.7} />
          <text
            x={56}
            y={62}
            fill={ENCRE}
            fontFamily="'IBM Plex Mono', monospace"
            fontSize={24}
            fontWeight={700}
            letterSpacing="1"
          >
            <tspan x={56} dy={0}>
              30%
            </tspan>
            <tspan x={56} dy={28}>
              reste du
            </tspan>
            <tspan x={56} dy={28}>
              monde
            </tspan>
          </text>
        </g>

        {/* Source USGS (bas gauche) */}
        <g opacity={srcOp} transform={`translate(120 ${H - 80 + srcY})`}>
          <text
            fill={ENCRE}
            fontFamily="'IBM Plex Mono', monospace"
            fontSize={22}
            fontWeight={600}
            letterSpacing="2"
            opacity={0.8}
          >
            SOURCE : USGS 2024
          </text>
        </g>
      </svg>

      <Audio
        src={staticFile("souverain/maroc-batteries/audio/narration-maroc-v3.mp3")}
        startFrom={Math.round(AUDIO_START_SEC * FPS)}
        volume={1}
      />
    </AbsoluteFill>
  );
};

export const MAROC_DATAHERO_FRAMES = 165;
