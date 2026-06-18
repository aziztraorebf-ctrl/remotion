/**
 * REPRODUCTIONS FIDELES Hera — LOT 2 (templates restants, methode mapanimation : copie a l'identique).
 * Couleurs/layout echantillonnes sur les vraies frames Hera.
 *
 *   - HeraFidele_V05_Contagion   : pays se remplit de son drapeau + label pastille, contagion vers voisins (carte claire)
 *   - HeraFidele_V06_Contour     : contour pays (France) qui se trace en rouge sur carte estompee + label drapeau
 *   - HeraFidele_V03_KineticText : "Rejection isn't failure" texte cinetique sur fond noir + ondulations + souligne rouge
 *   - HeraFidele_V11_CountUp     : odometre rose sur damier alpha (count-up $)
 *   - HeraFidele_V12_LineChart   : line chart lime + bande jaune surlignee + points noirs sur quadrille clair
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, staticFile, Img } from "remotion";
import { SCENE_VB, SPAIN_SCENE, FRANCE_SCENE } from "./heraScenePaths";

const W = 1920;
const H = 1080;

// ======================================================================================
// V05 — CONTAGION (drapeau fill + propagation voisins) sur carte claire
// Hera : terre blanche #f4f4f4, mer gris-bleu #a8b0b8, pays focus rempli du DRAPEAU reel + label pastille noire,
//   voisins se teintent rouge (contagion), foyers orange.
// ======================================================================================
export const HeraFidele_V05_Contagion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const SEA = "#a8b0b8";
  const LAND = "#f4f4f4";
  const LAND_LINE = "#d2d6da";
  const RED = "#c0392b";

  // remplissage drapeau du focus (clip wipe bas->haut)
  const fill = spring({ fps, frame: Math.max(0, frame - 16), config: { damping: 32, stiffness: 45 } });
  // contagion voisins (apparition rouge sequentielle)
  const labelOp = interpolate(frame, [40, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: SEA }}>
      <svg width={W} height={H} viewBox={SCENE_VB} preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="esFlag" patternUnits="objectBoundingBox" width="1" height="1">
            <image href={staticFile("_shared/flags/es.png")} x="0" y="0" width="1600" height="900" preserveAspectRatio="xMidYMid slice" />
          </pattern>
          <clipPath id="esFillWipe">
            <rect x="0" y={900 - 900 * fill} width="1600" height={900 * fill} />
          </clipPath>
        </defs>

        {/* voisins (terre blanche, certains se teintent rouge = contagion) */}
        {SPAIN_SCENE.neighbors.map((nb, i) => {
          const contag = ["Morocco", "Portugal", "France"].includes(nb.name);
          const cg = contag ? spring({ fps, frame: Math.max(0, frame - (50 + i * 10)), config: { damping: 30, stiffness: 40 } }) : 0;
          return <path key={nb.name} d={nb.d} fill={cg > 0 ? RED : LAND} opacity={cg > 0 ? 0.35 + 0.45 * cg : 1} stroke={LAND_LINE} strokeWidth={1} />;
        })}

        {/* focus Espagne : terre blanche puis remplissage drapeau (wipe) */}
        <path d={SPAIN_SCENE.focus} fill={LAND} stroke={LAND_LINE} strokeWidth={1} />
        <g clipPath="url(#esFillWipe)">
          <path d={SPAIN_SCENE.focus} fill="url(#esFlag)" stroke="#fff" strokeWidth={2} />
        </g>
      </svg>

      {/* label pastille noire "Espagne" */}
      <div style={{ position: "absolute", top: 90, left: "50%", transform: "translateX(-50%)", opacity: labelOp, background: "#1a1a1a", color: "#fff", padding: "10px 28px", borderRadius: 8, fontFamily: "'Inter',sans-serif", fontSize: 36, fontWeight: 700, boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}>
        Espagne
      </div>
    </AbsoluteFill>
  );
};

// ======================================================================================
// V06 — CONTOUR pays qui se trace (rouge) sur carte estompee + label drapeau coin
// Hera : carte gris-bleu estompee (#c8ccce terre, contours pales), contour ROUGE qui se trace autour de la France.
// ======================================================================================
export const HeraFidele_V06_Contour: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const MAP_LAND = "#e6e8ea";
  const MAP_SEA = "#c2c8cc";
  const MAP_LINE = "#cfd3d6";
  const RED = "#e23b30";

  const draw = spring({ fps, frame: Math.max(0, frame - 18), config: { damping: 44, stiffness: 22 } });
  // longueur approx du contour France (pour dash)
  const LEN = 3800;
  const labelOp = interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: MAP_SEA }}>
      <svg width={W} height={H} viewBox={SCENE_VB} preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        {/* voisins estompes */}
        {FRANCE_SCENE.neighbors.map((nb) => (
          <path key={nb.name} d={nb.d} fill={MAP_LAND} stroke={MAP_LINE} strokeWidth={1} />
        ))}
        {/* France : terre + contour rouge qui se trace */}
        <path d={FRANCE_SCENE.focus} fill={MAP_LAND} stroke={MAP_LINE} strokeWidth={1} />
        <path d={FRANCE_SCENE.focus} fill="none" stroke={RED} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={LEN} strokeDashoffset={LEN * (1 - draw)} />
      </svg>

      {/* label drapeau coin haut-gauche */}
      <div style={{ position: "absolute", top: 60, left: 60, opacity: labelOp, display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.92)", padding: "10px 20px 10px 12px", borderRadius: 8, boxShadow: "0 4px 14px rgba(0,0,0,0.18)" }}>
        <div style={{ width: 54, height: 36, overflow: "hidden", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
          <Img src={staticFile("_shared/flags/fr.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 32, fontWeight: 700, color: "#1a1a1a" }}>FRANCE</span>
      </div>
    </AbsoluteFill>
  );
};

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
// V11 — COUNT-UP odometre rose sur damier alpha (export transparent)
// Hera : damier alpha + chiffre $XX,XXX.XX rose #f98a9c, monospace, count-up.
// ======================================================================================
export const HeraFidele_V11_CountUp: React.FC = () => {
  const frame = useCurrentFrame();
  const PINK = "#f98a9c";

  const TARGET = 9399.16;
  const t = interpolate(frame, [10, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = 1 - Math.pow(1 - t, 3);
  const val = eased * TARGET;
  const str = "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).padStart(9, "0");

  // damier alpha simule (carres gris clairs alternes) — en prod = vrai fond transparent
  const sq = 40;

  return (
    <AbsoluteFill style={{ background: "#ffffff" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: Math.ceil(H / sq) }).map((_, r) =>
          Array.from({ length: Math.ceil(W / sq) }).map((_, c) => (
            <rect key={`${r}-${c}`} x={c * sq} y={r * sq} width={sq} height={sq} fill={(r + c) % 2 === 0 ? "#ffffff" : "#e9e9e9"} />
          ))
        )}
      </svg>
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'JetBrains Mono','SF Mono',monospace", fontSize: 150, fontWeight: 800, color: PINK }}>{str}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ======================================================================================
// V12 — LINE CHART lime + bande jaune surlignee + points noirs sur quadrille clair
// Hera : quadrille blanc, bande jaune verticale (periode surlignee), courbe LIME #aed136 epaisse,
//   points noirs sur la courbe, axe Y % (10-30%), axe X annees.
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
