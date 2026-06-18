/**
 * REPRODUCTIONS FIDELES Hera — LOT 2 (templates CONSERVES apres review Aziz 2026-06-18).
 * Couleurs/layout echantillonnes sur les vraies frames Hera.
 *
 * GARDES (validés Aziz) :
 *   - HeraFidele_V03_KineticText : "Rejection isn't failure" texte cinetique sur noir + souligne rouge.
 *       Raison : esthetique d'emphase interessante (mettre l'accent sur un mot).
 *   - HeraFidele_V12_LineChart   : line chart lime + bande jaune surlignee + points noirs sur quadrille.
 *       Raison : variation 2 couleurs tres modulable (autres couleurs/styles/types a decliner plus tard).
 *
 * SUPPRIMES (review Aziz) : V05 contagion + V06 contour (on fait BIEN mieux en Mapbox 3D frame-driven,
 *   et pas notre style) · V11 count-up (basique Remotion deja maitrise de plusieurs facons).
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";

const W = 1920;
const H = 1080;

// ======================================================================================
// V03 — TEXTE CINETIQUE sur fond noir + ondulations
// Hera : noir #0d0d0d + lignes ondulees gris foncE, "Rejection" serif italique blanc,
//   "isn't" sans-serif bold souligne ROUGE, "failure" sans-serif gris. Construction mot par mot.
// ======================================================================================
export const HeraFidele_V03_KineticText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const RED = "#e8261d";

  const w1 = spring({ fps, frame: Math.max(0, frame - 8), config: { damping: 18, stiffness: 120 } });
  const w2 = spring({ fps, frame: Math.max(0, frame - 26), config: { damping: 18, stiffness: 120 } });
  const w3 = spring({ fps, frame: Math.max(0, frame - 40), config: { damping: 18, stiffness: 120 } });
  const underline = interpolate(frame, [34, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* ondulations subtiles */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }} opacity={0.5}>
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M0,${250 + i * 200} C${W * 0.3},${180 + i * 200} ${W * 0.6},${330 + i * 200} ${W},${230 + i * 200}`}
            fill="none"
            stroke="#1f1f1f"
            strokeWidth={2}
          />
        ))}
      </svg>

      <div style={{ display: "flex", alignItems: "baseline", gap: 26, fontSize: 130, lineHeight: 1 }}>
        <span style={{ fontFamily: "Georgia,serif", fontStyle: "italic", color: "#fff", opacity: w1, transform: `translateY(${(1 - w1) * 30}px)` }}>Rejection</span>
        <span style={{ position: "relative", fontFamily: "'Inter',sans-serif", fontWeight: 800, color: "#fff", opacity: w2, transform: `translateY(${(1 - w2) * 30}px)` }}>
          isn't
          <span style={{ position: "absolute", left: 0, bottom: -14, height: 8, width: `${underline * 100}%`, background: RED }} />
        </span>
        <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, color: "#8a8a8a", opacity: w3, transform: `translateY(${(1 - w3) * 30}px)` }}>failure</span>
      </div>
    </AbsoluteFill>
  );
};

// ======================================================================================
// V12 — LINE CHART lime + bande jaune surlignee + points noirs sur quadrille clair
// Hera : quadrille blanc, bande jaune verticale (periode surlignee), courbe LIME #aed136 epaisse,
//   points noirs sur la courbe, axe Y % (10-30%), axe X annees.
// MODULABLE : couleur courbe, couleur bande, jeu de donnees -> a decliner (autres conversions plus tard).
// ======================================================================================
export const HeraFidele_V12_LineChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const LIME = "#aed136";
  const BAND = "#f3e9a8";
  const step = 80;

  const plotX = 220;
  const plotW = W - 440;
  const plotBot = 880;
  const plotTop = 200;
  const plotH = plotBot - plotTop;

  // valeurs %  (10-30%) : monte, redescend, remonte (forme V12)
  const pts = [0.13, 0.26, 0.24, 0.2, 0.205, 0.24, 0.28];
  const years = ["2022", "", "", "2023", "", "", "2024"];
  const xy = pts.map((v, i) => ({ x: plotX + (plotW * i) / (pts.length - 1), y: plotBot - plotH * ((v - 0.05) / 0.27) }));
  const d = xy.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  let len = 0;
  for (let i = 1; i < xy.length; i++) len += Math.hypot(xy[i].x - xy[i - 1].x, xy[i].y - xy[i - 1].y);
  const draw = spring({ fps, frame: Math.max(0, frame - 18), config: { damping: 44, stiffness: 24 } });

  const gridV = Array.from({ length: Math.ceil(W / step) + 1 }, (_, i) => i * step);
  const gridH = Array.from({ length: Math.ceil(H / step) + 1 }, (_, i) => i * step);
  const ticksY = [0.1, 0.2, 0.3];

  // bande jaune : entre x de 2022 et 2023 (index 0 a 3)
  const bandX0 = xy[0].x;
  const bandX1 = xy[3].x;
  const bandOp = interpolate(frame, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#fbfbf9" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* quadrille */}
        <g stroke="#ededed" strokeWidth={1.2}>
          {gridV.map((x) => <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />)}
          {gridH.map((y) => <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />)}
        </g>

        {/* bande jaune (periode surlignee) */}
        <rect x={bandX0} y={plotTop - 40} width={bandX1 - bandX0} height={plotBot - plotTop + 40} fill={BAND} opacity={0.7 * bandOp} />

        {/* axes */}
        <line x1={plotX} y1={plotTop - 40} x2={plotX} y2={plotBot} stroke="#222" strokeWidth={2.5} />
        <line x1={plotX} y1={plotBot} x2={plotX + plotW + 40} y2={plotBot} stroke="#222" strokeWidth={2.5} />
        {/* ticks Y */}
        {ticksY.map((t) => {
          const y = plotBot - plotH * ((t - 0.05) / 0.27);
          return <text key={t} x={plotX - 18} y={y + 8} textAnchor="end" fontFamily="'Inter',sans-serif" fontSize={26} fill="#555">{Math.round(t * 100)}%</text>;
        })}
        {/* annees */}
        {years.map((y, i) => y ? <text key={i} x={xy[i].x} y={plotBot + 40} textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize={24} fill="#555">{y}</text> : null)}

        {/* courbe lime epaisse */}
        <path d={d} fill="none" stroke={LIME} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
        {/* points noirs (apparaissent au fil du trace) */}
        {xy.map((p, i) => {
          const reveal = draw > (i / (xy.length - 1)) * 0.95;
          return reveal ? <circle key={i} cx={p.x} cy={p.y} r={7} fill="#1a1a1a" /> : null;
        })}
      </svg>
    </AbsoluteFill>
  );
};
