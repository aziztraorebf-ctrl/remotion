import React from "react";
import {
  AbsoluteFill, Audio, Img, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { scaleLinear } from "d3-scale";
import { SourceTag } from "../../../_shared/components/overlays/SourceTag";

// Beat11 — S2 Mecanisme 1 : Le Contrat de Concession
// Duree : 1473f = 49.10s @30fps (allonge de 125f pour couvrir "mais voila" jusqu'a Beat12)
// Audio : narration-v1-clean.mp3 startFrom=5755 (191.86s "le contrat.")
//
// PHASES calees sur forced alignment S2 :
// Phase 0  f0→193     KraftCard doc "CONTESTÉ" apparait
// Phase 1  f193→380   "60%." → barre REVENU BRUT $100M
// Phase 2  f380→704   "contrats... pas tous publics" → Cost Recovery découpe
// Phase 3  f704→1122  "Woodside... profits." → découpe finale 3 segments
// Phase 4  f1122→1348 "Ce désaccord... friction" → révélation 60%→36%

// ── Ancres audio (absolues → frame beat = abs_f - 5755) ──────────
const F_TITRE        = 0;
const F_CONTRAT      = 46;
const F_60PCT        = 193;
const F_CONTRATS     = 380;
const F_PUBLICS      = 629;
const F_WOODSIDE     = 704;
const F_PROFITS      = 1087;
const F_DESACCORD    = 1122;
const F_MILLIARDS    = 1167;
const F_END          = 1473;

// ── Palette kraft (valeurs SVG uniquement — Tailwind pour le reste) ──
const GOLD      = "#c8a951";
const RED_ALERT = "#a02525";
const IVORY     = "#f5f0e0";
const KRAFT_BG  = "#d9c8a4";
const KRAFT_MID = "#5a4a2a";
const KRAFT_DARK = "#1a120a";

export const Beat11: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── Géométrie barre — agrandie, centrée verticalement ───────────
  const BAR_X = width * 0.08;
  const BAR_Y = height * 0.44;
  const BAR_W = width * 0.84;
  const BAR_H = 116;

  const xScale = scaleLinear().domain([0, 100]).range([0, BAR_W]);
  const ticks = xScale.ticks(5);

  // ── Phase 0 : KraftCard ─────────────────────────────────────────
  const cardP     = spring({ frame: frame - F_TITRE, fps, config: { damping: 22, stiffness: 90 }, durationInFrames: 30 });
  const cardScale = interpolate(cardP, [0, 1], [0.88, 1], { extrapolateRight: "clamp" });
  const cardOp    = interpolate(cardP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const tamponP   = spring({ frame: frame - F_CONTRAT, fps, config: { damping: 14, stiffness: 260 }, durationInFrames: 20 });
  const tamponOp  = interpolate(tamponP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const tamponRot = interpolate(tamponP, [0, 1], [-22, -9], { extrapolateRight: "clamp" });
  const tamponSc  = interpolate(tamponP, [0, 1], [0.6, 1], { extrapolateRight: "clamp" });

  const cardFade = interpolate(frame, [F_60PCT - 30, F_60PCT + 30], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Phase 1 : Barre REVENU BRUT ─────────────────────────────────
  const brutP      = spring({ frame: frame - F_60PCT, fps, config: { damping: 18, stiffness: 130 }, durationInFrames: 45 });
  const brutProg   = interpolate(brutP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const brutWidth  = xScale(100) * brutProg;
  const brutFade   = interpolate(frame, [F_CONTRATS, F_CONTRATS + 60], [1, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brutLabelP  = spring({ frame: frame - (F_60PCT + 35), fps, config: { damping: 14, stiffness: 200 }, durationInFrames: 22 });
  const brutLabelOp = interpolate(brutLabelP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const brutAmountLive = Math.floor(100 * brutProg);
  const brutSweepP = interpolate(frame, [F_60PCT + 42, F_60PCT + 62], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ticksOp = interpolate(frame, [F_60PCT + 10, F_60PCT + 50], [0, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Phase 2 : Cost Recovery ──────────────────────────────────────
  const costP       = interpolate(frame, [F_CONTRATS, F_PUBLICS], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const costWidth   = xScale(40) * costP;
  const costLabelOp = interpolate(frame, [F_CONTRATS + 60, F_CONTRATS + 100], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const costPctLive = Math.floor(40 * costP);
  const costSweepP  = interpolate(frame, [F_PUBLICS - 10, F_PUBLICS + 20], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Phase 3 : 3 segments ────────────────────────────────────────
  const breakP       = interpolate(frame, [F_WOODSIDE, F_PROFITS], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const etatWidth      = xScale(36) * breakP;
  const woodShareWidth = xScale(24) * breakP;
  const breakLabelOp   = interpolate(frame, [F_WOODSIDE + 60, F_WOODSIDE + 110], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const etatAmountLive = Math.floor(36 * breakP);
  const woodAmountLive = Math.floor(24 * breakP);
  const etatSweepP     = interpolate(frame, [F_PROFITS - 5, F_PROFITS + 25], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ghostOp = interpolate(frame, [F_WOODSIDE, F_WOODSIDE + 40], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pulsePhase = frame > F_DESACCORD + 30
    ? 0.92 + 0.08 * Math.sin(((frame - F_DESACCORD - 30) / 28) * Math.PI * 2)
    : 1;

  // ── Phase 4 : Révélation ─────────────────────────────────────────
  const revealP  = spring({ frame: frame - F_DESACCORD, fps, config: { damping: 16, stiffness: 200 }, durationInFrames: 28 });
  const revealOp = interpolate(revealP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const revealY  = interpolate(revealP, [0, 1], [28, 0], { extrapolateRight: "clamp" });
  const mdsP     = spring({ frame: frame - F_MILLIARDS, fps, config: { damping: 18, stiffness: 220 }, durationInFrames: 20 });
  const mdsOp    = interpolate(mdsP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const ticksFade  = interpolate(frame, [F_DESACCORD, F_DESACCORD + 30], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const showCard   = frame < F_60PCT + 30;
  const showBarre  = frame >= F_60PCT - 10;
  const showPhase3 = frame >= F_WOODSIDE;
  const showReveal = frame >= F_DESACCORD;

  // Y des labels au-dessus de la barre
  const LABEL_TITLE_Y = BAR_Y - 56;
  const LABEL_SUB_Y   = BAR_Y - 32;
  const LABEL_VAL_Y   = BAR_Y + BAR_H / 2 + 14;

  return (
    <AbsoluteFill style={{ backgroundColor: KRAFT_BG }}>

      {/* Texture kraft */}
      <Img
        src={staticFile("_shared/textures/bg-kraft-affirme.png")}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          mixBlendMode: "multiply",
          opacity: 0.90,
        }}
      />

      {/* Vignette papier */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 48%, rgba(60,35,8,0.38) 100%)",
        pointerEvents: "none",
      }} />

      {/* Audio voix-off */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3")}
        startFrom={5755}
        endAt={7182}
        volume={1}
      />

      {/* Audio musique */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        startFrom={5755}
        volume={(f) => {
          const fadeStart = F_END / fps - 4;
          if (f / fps >= fadeStart) return 0.05 * Math.max(0, 1 - (f / fps - fadeStart) / 4);
          return 0.05;
        }}
      />

      {/* ── Titre ── */}
      <div
        className="absolute left-0 right-0 text-center pointer-events-none"
        style={{ top: height * 0.06, opacity: cardOp, transform: `scale(${cardScale})` }}
      >
        <div className="font-mono text-sm font-semibold tracking-[0.28em] uppercase mb-2"
          style={{ color: "rgba(26,18,10,0.45)" }}>
          MÉCANISME 1 — CONTRAT DE CONCESSION
        </div>
        <div className="font-mono text-4xl font-bold tracking-wide" style={{ color: KRAFT_DARK }}>
          Où vont les revenus du pétrole sénégalais ?
        </div>
      </div>

      {/* ── Phase 0 : Document classifié ── */}
      {showCard && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: height * 0.19,
            left: width * 0.18,
            width: width * 0.64,
            opacity: cardOp * cardFade,
            transform: `scale(${cardScale}) rotate(-1.5deg)`,
            transformOrigin: "center center",
          }}
        >
          <div
            className="relative"
            style={{
              backgroundColor: IVORY,
              padding: "22px 22px 56px 22px",
              boxShadow: "0 14px 40px rgba(40,20,5,0.40), 0 4px 10px rgba(0,0,0,0.18)",
            }}
          >
            {/* Ruban adhésif */}
            <div style={{
              position: "absolute", top: -16, left: -18,
              width: 100, height: 28,
              backgroundColor: "rgba(220,200,140,0.75)",
              transform: "rotate(-16deg)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
            }} />
            <div className="px-2 py-1">
              {[
                { label: "PARTIES", val: "ÉTAT SÉNÉGAL / WOODSIDE ENERGY" },
                { label: "OBJET",   val: "PARTAGE DE PRODUCTION — GTA / SANGOMAR" },
                { label: "DURÉE",   val: "25 ANS RENOUVELABLES" },
                { label: "CLAUSE",  val: "COST RECOVERY AVANT PARTAGE" },
                { label: "STATUT",  val: "PARTIELLEMENT PUBLIC" },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex gap-4 py-2 font-mono"
                  style={{
                    borderBottom: "1px solid rgba(26,18,10,0.12)",
                    opacity: interpolate(frame, [F_TITRE + i * 12, F_TITRE + i * 12 + 20], [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  }}
                >
                  <span className="text-sm font-bold min-w-[160px]" style={{ color: KRAFT_MID, letterSpacing: 1.5 }}>
                    {row.label}
                  </span>
                  <span className="text-sm" style={{ color: KRAFT_DARK }}>{row.val}</span>
                </div>
              ))}
            </div>
            <div className="font-mono text-xs text-center mt-2" style={{ color: KRAFT_MID, letterSpacing: 1 }}>
              REF. ITIE-SN-2023 / GTA-CONTRAT-001
            </div>
          </div>

          {/* Tampon CONTESTÉ */}
          <div
            className="absolute"
            style={{
              bottom: -10, right: -20,
              opacity: tamponOp,
              transform: `rotate(${tamponRot}deg) scale(${tamponSc})`,
              transformOrigin: "center center",
            }}
          >
            <div
              className="font-mono font-black text-3xl text-center px-4 py-2"
              style={{
                border: `4px solid ${RED_ALERT}`,
                color: RED_ALERT, letterSpacing: 4,
                backgroundColor: "rgba(245,235,210,0.35)",
              }}
            >
              CONTESTÉ
            </div>
            <div className="font-mono text-xs text-center mt-1 opacity-70" style={{ color: RED_ALERT, letterSpacing: 1 }}>
              WOODSIDE VS ÉTAT — 2024
            </div>
          </div>
        </div>
      )}

      {/* ── Phases 1-3 : SVG data-viz ── */}
      {showBarre && (
        <svg
          width={width} height={height}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <defs>
            <pattern id="hatch-kraft" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke={RED_ALERT} strokeWidth="1.5" opacity="0.5" />
            </pattern>
            <linearGradient id="sweep-gold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="white" stopOpacity="0" />
              <stop offset="45%"  stopColor="white" stopOpacity="0.16" />
              <stop offset="55%"  stopColor="white" stopOpacity="0.22" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="sweep-red" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="white" stopOpacity="0" />
              <stop offset="45%"  stopColor="white" stopOpacity="0.12" />
              <stop offset="55%"  stopColor="white" stopOpacity="0.16" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <clipPath id="clip-brut">
              <rect x={BAR_X} y={BAR_Y} width={brutWidth} height={BAR_H} />
            </clipPath>
            <clipPath id="clip-cost">
              <rect x={BAR_X} y={BAR_Y} width={xScale(40)} height={BAR_H} />
            </clipPath>
            <clipPath id="clip-etat">
              <rect x={BAR_X + xScale(64)} y={BAR_Y} width={xScale(36)} height={BAR_H} />
            </clipPath>
          </defs>

          {/* Ticks D3 */}
          {ticks.map((t) => (
            <g key={t} opacity={ticksOp * ticksFade}>
              <line
                x1={BAR_X + xScale(t)} x2={BAR_X + xScale(t)}
                y1={BAR_Y + BAR_H + 6} y2={BAR_Y + BAR_H + 18}
                stroke={KRAFT_MID} strokeWidth={1.5}
              />
              <text x={BAR_X + xScale(t)} y={BAR_Y + BAR_H + 42}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={16} fill={KRAFT_MID} letterSpacing={1}>
                ${t}M
              </text>
            </g>
          ))}

          {/* Track fond */}
          <rect x={BAR_X} y={BAR_Y} width={xScale(100)} height={BAR_H}
            fill="rgba(26,18,10,0.05)" stroke="rgba(26,18,10,0.18)" strokeWidth={1} />

          {/* [3] Ghost trailing — 60% promis */}
          {showPhase3 && (
            <rect x={BAR_X + xScale(40)} y={BAR_Y - 3}
              width={xScale(60)} height={BAR_H + 6}
              fill="rgba(200,169,81,0.06)"
              stroke={GOLD} strokeWidth={2} strokeDasharray="7 4"
              opacity={ghostOp * 0.65}
            />
          )}

          {/* Phase 1 : barre gold */}
          {frame < F_WOODSIDE && (
            <>
              <rect x={BAR_X} y={BAR_Y} width={brutWidth} height={BAR_H}
                fill={GOLD} opacity={brutFade * 0.85} />
              {brutSweepP > 0.01 && (
                <rect
                  x={BAR_X + brutWidth * (brutSweepP * 1.8 - 0.5)} y={BAR_Y}
                  width={brutWidth * 0.55} height={BAR_H}
                  fill="url(#sweep-gold)" clipPath="url(#clip-brut)"
                  opacity={interpolate(brutSweepP, [0, 0.3, 0.7, 1], [0, 1, 1, 0], { extrapolateRight: "clamp" })}
                />
              )}
            </>
          )}

          {/* Phase 2 : Cost Recovery */}
          {frame >= F_CONTRATS && frame < F_WOODSIDE && (
            <>
              <rect x={BAR_X} y={BAR_Y} width={costWidth} height={BAR_H}
                fill="rgba(160,37,37,0.28)" stroke={RED_ALERT} strokeWidth={2} />
              <rect x={BAR_X} y={BAR_Y} width={costWidth} height={BAR_H}
                fill="url(#hatch-kraft)" />
              {costSweepP > 0.01 && (
                <rect
                  x={BAR_X + xScale(40) * (costSweepP * 1.8 - 0.5)} y={BAR_Y}
                  width={xScale(40) * 0.55} height={BAR_H}
                  fill="url(#sweep-red)" clipPath="url(#clip-cost)"
                  opacity={interpolate(costSweepP, [0, 0.3, 0.7, 1], [0, 1, 1, 0], { extrapolateRight: "clamp" })}
                />
              )}
            </>
          )}

          {/* Phase 3 : 3 segments */}
          {showPhase3 && (
            <>
              <rect x={BAR_X} y={BAR_Y} width={xScale(40)} height={BAR_H}
                fill="rgba(160,37,37,0.28)" stroke={RED_ALERT} strokeWidth={2} />
              <rect x={BAR_X} y={BAR_Y} width={xScale(40)} height={BAR_H}
                fill="url(#hatch-kraft)" />
              <rect x={BAR_X + xScale(40)} y={BAR_Y} width={woodShareWidth} height={BAR_H}
                fill="rgba(200,169,81,0.28)" stroke={GOLD} strokeWidth={1} />
              <rect x={BAR_X + xScale(64)} y={BAR_Y} width={etatWidth} height={BAR_H}
                fill={GOLD} opacity={0.85 * pulsePhase} />
              {etatSweepP > 0.01 && (
                <rect
                  x={BAR_X + xScale(64) + xScale(36) * (etatSweepP * 1.8 - 0.5)} y={BAR_Y}
                  width={xScale(36) * 0.55} height={BAR_H}
                  fill="url(#sweep-gold)" clipPath="url(#clip-etat)"
                  opacity={interpolate(etatSweepP, [0, 0.3, 0.7, 1], [0, 1, 1, 0], { extrapolateRight: "clamp" })}
                />
              )}
              <rect x={BAR_X} y={BAR_Y} width={xScale(100)} height={BAR_H}
                fill="none" stroke="rgba(26,18,10,0.20)" strokeWidth={1} />
              {showReveal && (
                <rect x={BAR_X + xScale(64)} y={BAR_Y - 5} width={xScale(36)} height={BAR_H + 10}
                  fill="none" stroke={GOLD} strokeWidth={3.5 * pulsePhase} opacity={0.80 * revealOp} />
              )}
            </>
          )}

          {/* Label revenu brut Phase 1 — fond semi-transparent pour lisibilité */}
          {frame < F_WOODSIDE && brutLabelOp > 0.02 && (
            <g opacity={brutLabelOp * brutFade}>
              <rect x={BAR_X + xScale(35)} y={LABEL_TITLE_Y - 22}
                width={xScale(30)} height={26}
                fill="rgba(26,18,10,0.55)" rx={3} />
              <text x={BAR_X + xScale(50)} y={LABEL_TITLE_Y}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={15} fontWeight={700} fill="white" letterSpacing={2}>
                REVENU BRUT
              </text>
              <text x={BAR_X + xScale(50)} y={LABEL_VAL_Y}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={52} fontWeight={700} fill={KRAFT_DARK}>
                ${brutAmountLive}M
              </text>
            </g>
          )}

          {/* Label cost recovery Phase 2 — fond sombre */}
          {frame >= F_CONTRATS && frame < F_WOODSIDE && costLabelOp > 0.02 && (
            <g opacity={costLabelOp}>
              <rect x={BAR_X + xScale(8)} y={LABEL_TITLE_Y - 22}
                width={xScale(24)} height={26}
                fill="rgba(160,37,37,0.80)" rx={3} />
              <text x={BAR_X + xScale(20)} y={LABEL_TITLE_Y}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={15} fontWeight={700} fill="white" letterSpacing={1.5}>
                COST RECOVERY
              </text>
              <text x={BAR_X + xScale(20)} y={LABEL_VAL_Y}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={42} fontWeight={700} fill="white">
                {costPctLive}%
              </text>
            </g>
          )}

          {/* Labels 3 segments Phase 3 — fonds colorés pour contraste maximal */}
          {showPhase3 && breakLabelOp > 0.02 && (
            <g opacity={breakLabelOp}>

              {/* COST RECOVERY — fond rouge */}
              <rect x={BAR_X + xScale(3)} y={LABEL_TITLE_Y - 48}
                width={xScale(34)} height={54}
                fill="rgba(160,37,37,0.82)" rx={4} />
              <text x={BAR_X + xScale(20)} y={LABEL_TITLE_Y - 28}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={14} fontWeight={700} fill="white" letterSpacing={1.5}>
                COST RECOVERY
              </text>
              <text x={BAR_X + xScale(20)} y={LABEL_TITLE_Y - 8}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={12} fill="rgba(255,255,255,0.80)">
                remboursement depenses
              </text>
              <text x={BAR_X + xScale(20)} y={LABEL_VAL_Y}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={42} fontWeight={700} fill="white">
                $40M
              </text>

              {/* PART COMPAGNIES — fond brun foncé */}
              <rect x={BAR_X + xScale(41)} y={LABEL_TITLE_Y - 48}
                width={xScale(22)} height={54}
                fill="rgba(26,18,10,0.70)" rx={4} />
              <text x={BAR_X + xScale(52)} y={LABEL_TITLE_Y - 28}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={13} fontWeight={700} fill="white" letterSpacing={1}>
                COMPAGNIES
              </text>
              <text x={BAR_X + xScale(52)} y={LABEL_TITLE_Y - 10}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={12} fill="rgba(255,255,255,0.70)">
                profit oil
              </text>
              <text x={BAR_X + xScale(52)} y={LABEL_VAL_Y}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={32} fontWeight={600} fill="rgba(255,255,255,0.85)">
                ${woodAmountLive}M
              </text>

              {/* PART ÉTAT — fond or foncé */}
              <rect x={BAR_X + xScale(65)} y={LABEL_TITLE_Y - 48}
                width={xScale(31)} height={54}
                fill="rgba(140,100,20,0.82)" rx={4} />
              <text x={BAR_X + xScale(82)} y={LABEL_TITLE_Y - 28}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={14} fontWeight={700} fill="white" letterSpacing={1}>
                PART REELLE ETAT
              </text>
              <text x={BAR_X + xScale(82)} y={LABEL_TITLE_Y - 8}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={12} fill="rgba(255,255,255,0.80)">
                vs 60% annonce
              </text>
              <text x={BAR_X + xScale(82)} y={LABEL_VAL_Y}
                textAnchor="middle" fontFamily="'Courier New', monospace"
                fontSize={42} fontWeight={700} fill="white">
                ${etatAmountLive}M
              </text>
            </g>
          )}
        </svg>
      )}

      {/* ── Phase 4 : Révélation 60% → 36% ── */}
      {showReveal && (
        <div
          className="absolute left-0 right-0 flex justify-center pointer-events-none"
          style={{
            bottom: height * 0.05,
            opacity: revealOp,
            transform: `translateY(${revealY}px)`,
          }}
        >
          <div
            className="inline-flex items-center gap-8"
            style={{
              backgroundColor: "rgba(245,235,210,0.92)",
              border: `3px solid ${RED_ALERT}`,
              padding: "22px 52px",
              boxShadow: "0 10px 32px rgba(40,20,5,0.32)",
            }}
          >
            <div className="text-center">
              <div className="font-mono text-sm font-bold tracking-widest mb-1"
                style={{ color: "rgba(26,18,10,0.50)" }}>
                ANNONCÉ
              </div>
              <div className="font-mono font-black leading-none"
                style={{
                  fontSize: 64, color: "rgba(26,18,10,0.35)",
                  textDecoration: "line-through",
                  textDecorationColor: RED_ALERT,
                  textDecorationThickness: 4,
                }}>
                60%
              </div>
            </div>

            <div className="font-mono font-bold text-5xl" style={{ color: RED_ALERT }}>→</div>

            <div className="text-center">
              <div className="font-mono text-sm font-bold tracking-widest mb-1" style={{ color: RED_ALERT }}>
                RÉEL ESTIMÉ
              </div>
              <div className="font-mono font-black leading-none" style={{ fontSize: 64, color: KRAFT_DARK }}>
                36%
              </div>
            </div>

            {frame >= F_MILLIARDS && (
              <div
                className="pl-8"
                style={{ borderLeft: `2px solid ${RED_ALERT}`, opacity: mdsOp }}
              >
                <div className="font-mono text-sm tracking-widest mb-1" style={{ color: KRAFT_MID }}>
                  DÉSACCORD EN COURS
                </div>
                <div className="font-mono font-black text-4xl" style={{ color: RED_ALERT }}>
                  8 Mds$
                </div>
                <div className="font-mono text-sm mt-1" style={{ color: KRAFT_MID }}>
                  revenus imposables
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sources */}
      <SourceTag source="ITIE Sénégal — Rapport 2023" startFrame={F_60PCT} endFrame={F_WOODSIDE} />
      <SourceTag source="Woodside Energy — Rapport annuel 2024" startFrame={F_WOODSIDE} endFrame={F_END} />
    </AbsoluteFill>
  );
};

export default Beat11;
