import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { scaleLinear } from "d3-scale";
import { format } from "d3-format";

// PROTOTYPE — Test D3.js + React/SVG dans Remotion
// Cas : Mécanisme 1 Acte 3 — StackedBars Cost Recovery Sénégal
//
// Narratif :
// "Le 60% est une estimation officielle. La réalité dépend des contrats."
//
// 3 étapes visuelles :
//   1. f0→f60   : Barre pleine "REVENU BRUT" — 100M$ apparaît
//   2. f60→f180 : Découpe : "COST RECOVERY WOODSIDE" 40% sort par la gauche
//   3. f180→f300: Découpe finale : "ÉTAT SÉNÉGAL 36%" / "WOODSIDE 64%" (révélation)
//   4. f300→f450: Annotation "60% annoncé → 36% réel" (révélation friction)

const GOLD     = "#c8a951";
const NAVY     = "#16213a";
const WHITE    = "#f2ebd9";
const RED_ALERT = "#d97757";   // pour souligner la friction "annoncé vs réel"
const GREY_MUTED = "rgba(255,255,255,0.25)";

// Phases narratives
const F_REVENU_BRUT     = 0;
const F_COST_RECOVERY   = 90;
const F_FINAL_BREAKDOWN = 180;
const F_REVELATION      = 300;

// D3 : utilisé pour les calculs (scales), pas pour manipuler le DOM
// On rend tout en SVG/React classique
const fmtMoney = format("$,.0f");
const fmtPct = format(".0%");

export const PrototypeD3StackedBars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Géométrie : barre horizontale centrée
  const BAR_X = width * 0.18;
  const BAR_Y = height * 0.48;
  const BAR_W = width * 0.64;
  const BAR_H = 90;

  // D3 scale : valeur monétaire (0 à 100M$) → pixels
  const xScale = scaleLinear()
    .domain([0, 100])
    .range([0, BAR_W]);

  // ── Phase 1 : Barre "Revenu brut" se construit gauche → droite ────
  const brutP = spring({ frame: frame - F_REVENU_BRUT, fps, config: { damping: 18, stiffness: 140 }, durationInFrames: 40 });
  const brutWidthPct = interpolate(brutP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const brutWidth = xScale(100) * brutWidthPct;

  // Label "100M$" pop-in
  const brutLabelP = spring({ frame: frame - (F_REVENU_BRUT + 30), fps, config: { damping: 14, stiffness: 200 }, durationInFrames: 22 });
  const brutLabelOp = interpolate(brutLabelP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // ── Phase 2 : Cost Recovery se découpe (40M$ part par la gauche) ───
  const costP = interpolate(frame, [F_COST_RECOVERY, F_COST_RECOVERY + 90],
    [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const costWidth = xScale(40) * costP;
  const costLabelOp = interpolate(frame, [F_COST_RECOVERY + 20, F_COST_RECOVERY + 50],
    [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Phase 3 : Découpe finale dans "Reste à partager" (60M$) ───────
  // État Sénégal touche 60% de ce qui reste = 60% × 60M$ = 36M$
  // Woodside touche les 40% restants dans la zone "à partager" = 24M$
  // PLUS le cost recovery déjà parti = total Woodside 40+24 = 64M$
  const breakdownP = interpolate(frame, [F_FINAL_BREAKDOWN, F_FINAL_BREAKDOWN + 90],
    [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const etatWidth = xScale(36) * breakdownP;
  const woodsideShareWidth = xScale(24) * breakdownP;

  const breakdownLabelOp = interpolate(frame, [F_FINAL_BREAKDOWN + 30, F_FINAL_BREAKDOWN + 60],
    [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Phase 4 : Révélation "60% annoncé → 36% réel" ─────────────────
  const revealP = spring({ frame: frame - F_REVELATION, fps, config: { damping: 16, stiffness: 180 }, durationInFrames: 30 });
  const revealOp = interpolate(revealP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const revealY = interpolate(revealP, [0, 1], [20, 0], { extrapolateRight: "clamp" });

  // Pulse subtil sur les chiffres clés (animation après reveal)
  const pulsePhase = frame > F_REVELATION + 40
    ? 0.96 + 0.04 * Math.sin(((frame - F_REVELATION - 40) / 25) * Math.PI * 2)
    : 1;

  // ── Marqueurs d'échelle (D3 ticks) ────────────────────────────────
  const ticks = xScale.ticks(5); // génère [0, 20, 40, 60, 80, 100]
  const ticksOp = interpolate(frame, [F_REVENU_BRUT + 10, F_REVENU_BRUT + 40],
    [0, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>

      {/* Label titre éditorial — en haut */}
      <div style={{
        position: "absolute",
        left: 0, right: 0, top: height * 0.13,
        textAlign: "center",
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 14,
          fontWeight: 500,
          color: "rgba(242,235,217,0.45)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
        }}>
          DÉCOMPOSITION D'UN BARIL DE PÉTROLE SÉNÉGALAIS
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 32,
          fontWeight: 700,
          color: WHITE,
          letterSpacing: "0.02em",
          marginTop: 8,
        }}>
          Où vont les 100$ de revenu brut ?
        </div>
      </div>

      {/* SVG : data-viz */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>

        {/* ── Axe : ticks d'échelle (D3) ── */}
        {ticks.map((t) => (
          <g key={t} opacity={ticksOp}>
            <line
              x1={BAR_X + xScale(t)} x2={BAR_X + xScale(t)}
              y1={BAR_Y + BAR_H + 8} y2={BAR_Y + BAR_H + 16}
              stroke={GREY_MUTED} strokeWidth={1}
            />
            <text
              x={BAR_X + xScale(t)}
              y={BAR_Y + BAR_H + 36}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize={13}
              fill="rgba(255,255,255,0.40)"
              letterSpacing="1"
            >
              ${t}M
            </text>
          </g>
        ))}

        {/* ── Phase 1 : Barre "REVENU BRUT" gold complète ── */}
        {/* Track de fond (apparaît dès le début) */}
        <rect
          x={BAR_X} y={BAR_Y}
          width={xScale(100)} height={BAR_H}
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.10)" strokeWidth={1}
        />

        {/* La barre gold qui se remplit gauche → droite */}
        {frame < F_FINAL_BREAKDOWN && (
          <rect
            x={BAR_X} y={BAR_Y}
            width={brutWidth} height={BAR_H}
            fill={GOLD}
            opacity={interpolate(frame, [F_COST_RECOVERY, F_COST_RECOVERY + 90], [1, 0.4], { extrapolateRight: "clamp" })}
          />
        )}

        {/* ── Phase 2 : Cost Recovery découpe par la gauche (zone grise) ── */}
        {frame >= F_COST_RECOVERY && frame < F_FINAL_BREAKDOWN && (
          <>
            <rect
              x={BAR_X} y={BAR_Y}
              width={costWidth} height={BAR_H}
              fill="rgba(217,119,87,0.55)"
              stroke={RED_ALERT}
              strokeWidth={2}
            />
            {/* Hachures subtiles dans la zone cost recovery */}
            <defs>
              <pattern id="hatch-cost" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke={RED_ALERT} strokeWidth="1" opacity="0.4" />
              </pattern>
            </defs>
            <rect
              x={BAR_X} y={BAR_Y}
              width={costWidth} height={BAR_H}
              fill="url(#hatch-cost)"
            />
          </>
        )}

        {/* ── Phase 3 : Découpe finale (3 segments) ── */}
        {frame >= F_FINAL_BREAKDOWN && (
          <>
            {/* Segment 1 : Cost Recovery (gauche, rouge) */}
            <rect
              x={BAR_X} y={BAR_Y}
              width={xScale(40)} height={BAR_H}
              fill="rgba(217,119,87,0.45)"
              stroke={RED_ALERT} strokeWidth={2}
            />
            <rect
              x={BAR_X} y={BAR_Y}
              width={xScale(40)} height={BAR_H}
              fill="url(#hatch-cost)"
            />

            {/* Segment 2 : Part Woodside dans le reste (24M$, gold pâle) */}
            <rect
              x={BAR_X + xScale(40)} y={BAR_Y}
              width={woodsideShareWidth} height={BAR_H}
              fill="rgba(200,169,81,0.30)"
              stroke={GOLD} strokeWidth={1}
            />

            {/* Segment 3 : Part État Sénégal (36M$, gold plein) */}
            <rect
              x={BAR_X + xScale(40) + xScale(24)} y={BAR_Y}
              width={etatWidth} height={BAR_H}
              fill={GOLD}
              opacity={pulsePhase}
            />

            {/* Bordure totale */}
            <rect
              x={BAR_X} y={BAR_Y}
              width={xScale(100)} height={BAR_H}
              fill="none"
              stroke="rgba(255,255,255,0.15)" strokeWidth={1}
            />
          </>
        )}

        {/* ── Labels des segments (Phase 3) ── */}
        {frame >= F_FINAL_BREAKDOWN && breakdownLabelOp > 0.02 && (
          <g opacity={breakdownLabelOp}>
            {/* Cost Recovery label */}
            <text
              x={BAR_X + xScale(20)}
              y={BAR_Y - 18}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize={14}
              fontWeight={600}
              fill={RED_ALERT}
              letterSpacing="1.5"
            >
              COST RECOVERY WOODSIDE
            </text>
            <text
              x={BAR_X + xScale(20)}
              y={BAR_Y + BAR_H / 2 + 6}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize={28}
              fontWeight={700}
              fill={WHITE}
            >
              $40M
            </text>

            {/* Part Woodside (dans le reste) — petit label */}
            <text
              x={BAR_X + xScale(52)}
              y={BAR_Y + BAR_H / 2 + 6}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize={18}
              fontWeight={600}
              fill="rgba(242,235,217,0.70)"
            >
              $24M
            </text>

            {/* Part État label */}
            <text
              x={BAR_X + xScale(82)}
              y={BAR_Y - 18}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize={14}
              fontWeight={600}
              fill={GOLD}
              letterSpacing="1.5"
            >
              ÉTAT SÉNÉGAL
            </text>
            <text
              x={BAR_X + xScale(82)}
              y={BAR_Y + BAR_H / 2 + 6}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize={28}
              fontWeight={700}
              fill={WHITE}
            >
              $36M
            </text>
          </g>
        )}

        {/* ── Label "Revenu brut" pendant phase 1 et 2 ── */}
        {frame < F_FINAL_BREAKDOWN && brutLabelOp > 0.02 && (
          <g opacity={brutLabelOp}>
            <text
              x={BAR_X + xScale(50)}
              y={BAR_Y - 18}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize={14}
              fontWeight={600}
              fill={GOLD}
              letterSpacing="1.5"
            >
              REVENU BRUT
            </text>
            <text
              x={BAR_X + xScale(50)}
              y={BAR_Y + BAR_H / 2 + 8}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize={36}
              fontWeight={700}
              fill={WHITE}
            >
              $100M
            </text>
          </g>
        )}
      </svg>

      {/* ── Phase 4 : Révélation "60% annoncé → 36% réel" ── */}
      {frame >= F_REVELATION && (
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          bottom: height * 0.13,
          textAlign: "center",
          opacity: revealOp,
          transform: `translateY(${revealY}px)`,
          pointerEvents: "none",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 28,
            backgroundColor: "rgba(13,21,37,0.85)",
            border: `2px solid ${RED_ALERT}`,
            padding: "20px 44px",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12, fontWeight: 500,
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.2em", marginBottom: 4,
              }}>
                ANNONCÉ
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 42, fontWeight: 700,
                color: "rgba(255,255,255,0.50)",
                lineHeight: 1,
                textDecoration: "line-through",
                textDecorationColor: RED_ALERT,
              }}>
                60%
              </div>
            </div>

            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 32,
              color: RED_ALERT,
            }}>
              →
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12, fontWeight: 500,
                color: RED_ALERT,
                letterSpacing: "0.2em", marginBottom: 4,
              }}>
                RÉEL
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 42, fontWeight: 700,
                color: WHITE,
                lineHeight: 1,
              }}>
                36%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 55%, rgba(5,10,20,0.45) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

export default PrototypeD3StackedBars;
