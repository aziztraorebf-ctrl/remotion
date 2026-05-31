import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * CurveChartClean — graphique courbe data-viz propre pour carrousel hybride.
 * Courbe exponentielle (prix de l'or 2010→2026) qui se dessine, fond navy doctrine,
 * axes minimalistes. Aucun overlay texte (le texte carrousel vient par-dessus).
 *
 * Réutilisable pour toute slide "stat avec courbe ascendante".
 * Format cible : 1080x1350 (4:5). La courbe occupe le tiers central/haut.
 */

const NAVY = "#16213a";
const GOLD = "#c8a951";
const ORANGE = "#e89b3c";

// Géométrie chart (dans 1080x1350)
const CHART = { left: 120, right: 960, top: 360, bottom: 760 };
const W = CHART.right - CHART.left;
const H = CHART.bottom - CHART.top;

function curvePath(progress: number): string {
  const N = 16;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    if (t > progress) break;
    const x = CHART.left + t * W;
    const y = CHART.bottom - Math.pow(t, 1.6) * (H * 0.92);
    pts.push([x, y]);
  }
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
}

function curveArea(progress: number): string {
  const line = curvePath(progress);
  if (!line) return "";
  const N = 16;
  const lastT = Math.min(progress, 1);
  const lastX = CHART.left + lastT * W;
  return `${line} L${lastX.toFixed(1)},${CHART.bottom} L${CHART.left},${CHART.bottom} Z`;
}

export const CurveChartClean: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [10, durationInFrames * 0.72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Point de tête (glow qui suit la courbe)
  const headT = Math.min(progress, 1);
  const headX = CHART.left + headT * W;
  const headY = CHART.bottom - Math.pow(headT, 1.6) * (H * 0.92);

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      {/* léger grain radial */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(200,169,81,0.06) 0%, transparent 60%)" }} />

      <svg width="100%" height="100%" viewBox="0 0 1080 1350" style={{ position: "absolute" }}>
        {/* axe X */}
        <line x1={CHART.left} y1={CHART.bottom} x2={CHART.right} y2={CHART.bottom} stroke="rgba(200,169,81,0.3)" strokeWidth={2} />
        {/* axe Y */}
        <line x1={CHART.left} y1={CHART.top - 20} x2={CHART.left} y2={CHART.bottom} stroke="rgba(200,169,81,0.18)" strokeWidth={2} />

        {/* labels années */}
        <text x={CHART.left} y={CHART.bottom + 38} fill="rgba(245,239,224,0.5)" fontSize={26} fontFamily="monospace">2010</text>
        <text x={CHART.right} y={CHART.bottom + 38} fill="rgba(245,239,224,0.5)" fontSize={26} fontFamily="monospace" textAnchor="end">2026</text>

        {/* aire sous la courbe */}
        <path d={curveArea(progress)} fill="url(#orGrad)" opacity={0.35} />
        <defs>
          <linearGradient id="orGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ORANGE} stopOpacity={0.7} />
            <stop offset="100%" stopColor={ORANGE} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* courbe */}
        <path d={curvePath(progress)} fill="none" stroke={ORANGE} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 12px ${ORANGE})` }} />

        {/* point de tête */}
        {progress > 0.02 && (
          <circle cx={headX} cy={headY} r={12} fill={GOLD} style={{ filter: `drop-shadow(0 0 14px ${GOLD})` }} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
