/**
 * OceanProfondeurVagues — ocean a 2 groupes de rendu (fond + 1er plan, pour poser un objet ENTRE les
 * deux), degrade de profondeur + vagues en courbes douces (loin=fines/claires, pres=epaisses/sombres,
 * alternance trait blanc/sombre). Extrait de CargoVoyage16x9_LibreInspire.tsx (2026-07-04, "repris
 * fidelement de la cible SVG Gemini, groupe ocean_base").
 *
 * Usage : rendre <OceanProfondeurVagues part="fond" .../> AVANT l'objet pose sur l'eau (cargo/pirogue),
 * puis <OceanProfondeurVagues part="premier-plan" .../> APRES, avec le MEME splitY (cf objectVisualBottom
 * dans motion.ts) pour que les vagues proches passent devant le bas de l'objet.
 *
 * reflectColor optionnel : reflet du soleil sur l'eau (triangle qui s'evase + lignes scintillantes,
 * suit reflectX en temps reel). Omettre si pas de soleil visible dans la scene (nuit, etc.).
 */
import React from "react";

const DEFAULT_WAVES = [
  { y: 750, width: 1, opacity: 0.2, color: "#ffffff" },
  { y: 765, width: 1.5, opacity: 0.25, color: "#ffffff" },
  { y: 780, width: 1.5, opacity: 0.3, color: "#ffffff" },
  { y: 800, width: 2, opacity: 0.5, color: "#2b2117" },
  { y: 830, width: 2, opacity: 0.2, color: "#ffffff" },
  { y: 860, width: 3, opacity: 0.4, color: "#2b2117" },
  { y: 900, width: 2, opacity: 0.15, color: "#ffffff" },
  { y: 940, width: 4, opacity: 0.4, color: "#2b2117" },
  { y: 990, width: 3, opacity: 0.1, color: "#ffffff" },
  { y: 1040, width: 5, opacity: 0.4, color: "#2b2117" },
];

export const OceanProfondeurVagues: React.FC<{
  frame: number;
  part: "fond" | "premier-plan";
  splitY: number;
  seaColor: string;
  seaColorDeep: string;
  reflectColor?: string;
  reflectX?: number;
  reflectOpacity?: number;
  waves?: typeof DEFAULT_WAVES;
  idPrefix?: string;
}> = ({
  frame,
  part,
  splitY,
  seaColor,
  seaColorDeep,
  reflectColor,
  reflectX = 0,
  reflectOpacity = 0,
  waves = DEFAULT_WAVES,
  idPrefix = "ocean",
}) => {
  const filtered = part === "fond" ? waves.filter((w) => w.y < splitY) : waves.filter((w) => w.y >= splitY);

  return (
    <>
      {part === "fond" && (
        <defs>
          <linearGradient id={`${idPrefix}DepthGrad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={seaColorDeep} stopOpacity={0.55} />
            <stop offset="20%" stopColor={seaColor} stopOpacity={0.5} />
            <stop offset="100%" stopColor={seaColor} stopOpacity={0.42} />
          </linearGradient>
          {reflectColor && (
            <linearGradient id={`${idPrefix}ReflectGrad`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={reflectColor} stopOpacity={0.4} />
              <stop offset="100%" stopColor={reflectColor} stopOpacity={0} />
            </linearGradient>
          )}
        </defs>
      )}
      {part === "fond" && <rect x={-800} y={720} width={4000} height={360} fill={`url(#${idPrefix}DepthGrad)`} />}

      {part === "fond" && reflectColor && reflectOpacity > 0.05 && (
        <>
          <path
            d={`M ${reflectX - 50} 720 L ${reflectX + 50} 720 L ${reflectX + 120} 1080 L ${reflectX - 120} 1080 Z`}
            fill={`url(#${idPrefix}ReflectGrad)`}
            opacity={reflectOpacity}
          />
          {[
            { dy: 5, hw: 30, w: 2, op: 0.8 },
            { dy: 15, hw: 40, w: 3, op: 0.7 },
            { dy: 30, hw: 50, w: 3, op: 0.6 },
            { dy: 50, hw: 60, w: 4, op: 0.5 },
            { dy: 80, hw: 70, w: 4, op: 0.4 },
            { dy: 120, hw: 90, w: 5, op: 0.3 },
            { dy: 180, hw: 110, w: 6, op: 0.2 },
          ].map((r, i) => {
            const shimmer = 0.6 + 0.4 * Math.sin(frame / 8 + i * 1.7);
            return (
              <line
                key={i}
                x1={reflectX - r.hw * shimmer}
                y1={720 + r.dy}
                x2={reflectX + r.hw * shimmer}
                y2={720 + r.dy}
                stroke="#ffffff"
                strokeWidth={r.w}
                strokeLinecap="round"
                opacity={r.op * reflectOpacity}
              />
            );
          })}
        </>
      )}

      {filtered.map((w, i) => {
        const offset = (frame * (0.4 + i * 0.05)) % 200;
        const d = `M ${-200 - offset} ${w.y} Q ${0 - offset} ${w.y - 12} ${200 - offset} ${w.y} T ${600 - offset} ${w.y} T ${1000 - offset} ${w.y} T ${1400 - offset} ${w.y} T ${1800 - offset} ${w.y} T ${2200 - offset} ${w.y}`;
        return <path key={i} d={d} fill="none" stroke={w.color} strokeWidth={w.width} opacity={w.opacity} />;
      })}
    </>
  );
};
