import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Beat 9 — Acte 2 / Beat D — "60% — ni scandale ni jackpot" (114.28s → 131.48s narration)
// Durée réelle : 17.20s / 516 frames
// v3 : donut SVG animé 0→60° (arc gold) + split left/right équilibré

const GOLD  = "#c8a951";
const NAVY  = "#16213a";  // v4 : fond légèrement plus clair (bleu nuit au lieu de quasi-noir)
const WHITE = "#f2ebd9";

// Timing narratif v4 — arc se dessine sur ~9s pour respirer avec la voix-off
// Beat dure 516 frames (17.2s). Arc : f60→f330 (9s). Verdict : f400→f445.
const F_DONUT    = 60;   // donut commence à se dessiner
const F_ARC_END  = 330;  // arc gold terminé (= f60 + 270f = 9s de dessin)
const F_AVG      = 330;  // arc "moyenne mondiale" apparaît simultanément à la fin de l'arc
const F_NUMBER   = 315;  // "60%" pop-in juste avant la fin (anticipation)
const F_DIVIDER  = 380;
const F_SCANDALE = 400;
const F_JACKPOT  = 445;

// Géométrie donut SVG
const R_OUTER = 210;  // rayon externe (px)
const R_INNER = 148;  // rayon interne → épaisseur arc = 62px
const CX = 0;         // centre relatif (viewBox centrée)
const CY = 0;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Dessine un arc SVG path entre startDeg et endDeg
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const clampedEnd = Math.min(endDeg, startDeg + 359.99);
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end   = polarToCartesian(cx, cy, r, clampedEnd);
  const large = clampedEnd - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

export const Beat9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── Donut principal : 0 → 216° (= 60% de 360°) sur 270f = 9s ─
  const donutProg = interpolate(frame, [F_DONUT, F_ARC_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const donutEndDeg = interpolate(donutProg, [0, 1], [0, 216]);
  const donutOpacity = interpolate(frame, [F_DONUT, F_DONUT + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Chiffre "60%" au centre — pop-in spring à F_NUMBER (juste avant fin de l'arc)
  const numberP = spring({ frame: frame - F_NUMBER, fps, config: { damping: 14, stiffness: 280 }, durationInFrames: 22 });
  const numberScale   = interpolate(numberP, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });
  const numberOpacity = interpolate(numberP, [0, 0.1, 1], [0, 1, 1], { extrapolateRight: "clamp" });

  // Respiration légère sur le chiffre après apparition
  const breathe = frame >= F_NUMBER ? 1 + Math.sin(((frame - F_NUMBER) / 95) * Math.PI * 2) * 0.010 : 1;

  // ── Arc "Moy. mondiale 45%" — apparaît à la fin de l'arc gold ─
  const avgProg = interpolate(frame, [F_AVG, F_AVG + 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const avgEndDeg = interpolate(avgProg, [0, 1], [0, 162]); // 45% × 360 = 162°
  const avgOpacity = interpolate(frame, [F_AVG, F_AVG + 18], [0, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Label "REVENUS PÉTROLIERS SÉNÉGAL" — apparaît avec le donut
  const labelTopP = spring({ frame: frame - F_DONUT, fps, config: { damping: 18, stiffness: 180 }, durationInFrames: 20 });
  const labelTopOp = interpolate(labelTopP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelTopY  = interpolate(labelTopP, [0, 1], [-10, 0], { extrapolateRight: "clamp" });

  // ── Divider gold ──────────────────────────────────────────────
  const dividerP = spring({ frame: frame - F_DIVIDER, fps, config: { damping: 16, stiffness: 200 }, durationInFrames: 22 });
  const dividerScaleX = interpolate(dividerP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const dividerOpacity = interpolate(dividerP, [0, 0.05, 1], [0, 1, 1], { extrapolateRight: "clamp" });

  // ── "NI UN SCANDALE." ─────────────────────────────────────────
  const scandaleP = spring({ frame: frame - F_SCANDALE, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 20 });
  const scandaleOpacity = interpolate(scandaleP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scandaleY = interpolate(scandaleP, [0, 1], [28, 0], { extrapolateRight: "clamp" });

  // ── "NI UN JACKPOT." ──────────────────────────────────────────
  const jackpotP = spring({ frame: frame - F_JACKPOT, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 20 });
  const jackpotOpacity = interpolate(jackpotP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const jackpotY = interpolate(jackpotP, [0, 1], [28, 0], { extrapolateRight: "clamp" });

  // ── Layout : donut centré gauche, texte droite ────────────────
  const VB = R_OUTER + 20; // demi-côté viewBox
  const donutCX = width * 0.32;  // centre horizontal donut
  const donutCY = height * 0.50; // centre vertical donut
  const textX   = width * 0.57;  // colonne texte
  const textW   = width * 0.39;

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>

      {/* ── Donut SVG ───────────────────────────────────────────── */}
      <svg
        viewBox={`${-VB} ${-VB} ${VB * 2} ${VB * 2}`}
        width={VB * 2} height={VB * 2}
        style={{
          position: "absolute",
          left: donutCX - VB,
          top: donutCY - VB,
          overflow: "visible",
          pointerEvents: "none",
          opacity: donutOpacity,
        }}
      >
        {/* Track fond — cercle complet discret */}
        <circle cx={CX} cy={CY} r={R_OUTER} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth={R_OUTER - R_INNER} />

        {/* Arc moyenne mondiale (pointillé blanc) */}
        {avgEndDeg > 0.5 && (
          <path
            d={arcPath(CX, CY, (R_OUTER + R_INNER) / 2, 0, avgEndDeg)}
            fill="none"
            stroke="rgba(255,255,255,0.40)"
            strokeWidth={R_OUTER - R_INNER}
            strokeDasharray="6 8"
            opacity={avgOpacity / 0.45}
          />
        )}

        {/* Arc principal 60% — gold plein */}
        {donutEndDeg > 0.5 && (
          <path
            d={arcPath(CX, CY, (R_OUTER + R_INNER) / 2, 0, donutEndDeg)}
            fill="none"
            stroke={GOLD}
            strokeWidth={R_OUTER - R_INNER}
            strokeLinecap="round"
          />
        )}

        {/* Légende MOY. MONDIALE — à l'extérieur de l'arc, au bout de l'arc blanc */}
        {avgOpacity > 0.05 && avgEndDeg > 130 && (
          <>
            <text
              x={polarToCartesian(CX, CY, R_OUTER + 48, avgEndDeg).x}
              y={polarToCartesian(CX, CY, R_OUTER + 48, avgEndDeg).y - 8}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize={16}
              fontWeight={400}
              fill="rgba(255,255,255,0.40)"
              letterSpacing="1.5"
            >
              MOY.
            </text>
            <text
              x={polarToCartesian(CX, CY, R_OUTER + 48, avgEndDeg).x}
              y={polarToCartesian(CX, CY, R_OUTER + 48, avgEndDeg).y + 12}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize={16}
              fontWeight={400}
              fill="rgba(255,255,255,0.40)"
              letterSpacing="1.5"
            >
              ~45%
            </text>
          </>
        )}
      </svg>

      {/* ── Chiffre central du donut ─────────────────────────────── */}
      {numberOpacity > 0.01 && (
        <div style={{
          position: "absolute",
          left: donutCX,
          top: donutCY,
          transform: `translate(-50%, -50%) scale(${numberScale * breathe})`,
          opacity: numberOpacity,
          pointerEvents: "none",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 108,
            fontWeight: 700,
            color: GOLD,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}>
            60%
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 14,
            fontWeight: 400,
            color: "rgba(242,235,217,0.50)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}>
            EXPORTÉ
          </div>
        </div>
      )}

      {/* ── Label "PART EXPORTÉE" au-dessus du donut ────────────── */}
      {labelTopOp > 0.01 && (
        <div style={{
          position: "absolute",
          left: donutCX - VB + 10,
          top: donutCY - VB - 52,
          width: VB * 2 - 20,
          textAlign: "center",
          opacity: labelTopOp,
          transform: `translateY(${labelTopY}px)`,
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(242,235,217,0.40)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}>
            REVENUS PÉTROLIERS SÉNÉGAL
          </div>
        </div>
      )}

      {/* ── Colonne texte droite ─────────────────────────────────── */}
      <div style={{
        position: "absolute",
        left: textX,
        top: donutCY - 140,
        width: textW,
        display: "flex", flexDirection: "column",
        pointerEvents: "none",
      }}>
        {/* Divider gold */}
        {dividerOpacity > 0.01 && (
          <div style={{
            width: "100%",
            height: 2,
            backgroundColor: GOLD,
            transformOrigin: "left center",
            transform: `scaleX(${dividerScaleX})`,
            opacity: dividerOpacity * 0.75,
            marginBottom: 32,
          }} />
        )}

        {/* NI UN SCANDALE. */}
        <div style={{
          opacity: scandaleOpacity,
          transform: `translateY(${scandaleY}px)`,
          marginBottom: 18,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 58,
            fontWeight: 700,
            color: WHITE,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            lineHeight: 1.1,
          }}>
            NI UN<br />SCANDALE.
          </div>
        </div>

        {/* NI UN JACKPOT. */}
        <div style={{
          opacity: jackpotOpacity,
          transform: `translateY(${jackpotY}px)`,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 58,
            fontWeight: 700,
            color: WHITE,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            lineHeight: 1.1,
          }}>
            NI UN<br />JACKPOT.
          </div>
        </div>
      </div>

      {/* Vignette coins */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(5,10,20,0.55) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

export default Beat9;
