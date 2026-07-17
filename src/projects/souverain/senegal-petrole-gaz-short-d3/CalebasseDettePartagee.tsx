// CalebasseDettePartagee — calebasse-dette du Short Senegal D3, pilotee par un TEMPS ABSOLU de
// narration (secondes), pas par une frame locale a un beat. Raison (retour Aziz 2026-07-16) : la
// calebasse doit vivre EN CONTINU a cheval sur le Beat 4 (FONSIS/dette) ET le debut du Beat 5
// ("reste a savoir si ce coffre va tenir"), et deborder pleinement juste AVANT le cartouche CTA.
// En calculant son etat depuis un temps absolu partage (identique dans les 2 beats), la continuite
// au raccord est EXACTE — quelle que soit la facon dont les beats sont assembles.
//
// Calage (secondes de narration) :
//   CALEB_START = 82.4  : la calebasse apparait et commence a se remplir
//   CALEB_FULL  = 100.8 : le liquide atteint le ras bord (fin de la montee lente, ~18.4s)
//   CALEB_OVERFLOW = 100.8 : le debordement (coulees+gouttes+mare) demarre au ras bord
//   -> debordement pleinement etabli ~101.4s, juste avant le cartouche CTA (~101.7s)
import React from "react";
import { interpolate } from "remotion";
import { getLength } from "@remotion/paths";

const NAVY = "#16213a";
const IVORY = "#f2ebd9";
const RED_LIQUID = "#8f2a24";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const calebassePath =
  "M120,50 L280,50 C280,50 320,150 360,250 C400,350 350,480 200,480 C50,480 0,350 40,250 C80,150 120,50 120,50 Z";
const fillWavePath =
  "M0,50 Q50,0 100,50 T200,50 T300,50 T400,50 T500,50 T600,50 T700,50 T800,50 L800,600 L0,600 Z";

// Calage en SECONDES de narration (temps absolu partage entre Beat 4 et Beat 5)
export const CALEB_START = 82.4;
export const CALEB_FULL = 100.8; // ras bord atteint (fin montee ~18.4s)
export const CALEB_OVERFLOW = 100.8; // debordement demarre au ras bord

const PATH_LEN = getLength(calebassePath);

// tAbs = temps absolu de narration en secondes (frameGlobal/fps + T_OFFSET_du_beat)
export const CalebasseDettePartagee: React.FC<{ tAbs: number }> = ({ tAbs }) => {
  // temps ecoule depuis le debut de la calebasse, en SECONDES puis converti en "frames-equivalent"
  // (x30) pour reutiliser les memes constantes d'animation qu'avant.
  const s = tAbs - CALEB_START; // secondes depuis le debut
  if (s < -0.1) return null;
  const f = s * 30; // frames-equivalent depuis le debut

  const strokeDashoffset = interpolate(f, [0, 24], [PATH_LEN, 0], clamp);
  const op = interpolate(f, [-2, 10], [0, 1], clamp);

  // montee lente : de f=8 jusqu'a (CALEB_FULL-CALEB_START)*30 frames-equivalent
  const fullF = (CALEB_FULL - CALEB_START) * 30; // ~552
  const liquidTranslateY = interpolate(f, [8, fullF], [500, 8], clamp);
  const waveTranslateX = -(((f - 8) * 3) % 400);

  // debordement : demarre quand le vase est plein (CALEB_OVERFLOW)
  const overflowF = (CALEB_OVERFLOW - CALEB_START) * 30; // ~552
  const overflowOp = interpolate(f, [overflowF, overflowF + 16], [0, 1], clamp);
  const streamLen = interpolate(f, [overflowF, overflowF + 30], [0, 155], clamp);
  const drips = [0, 18, 34, 50, 12, 40, 58].map((offset) => {
    const cycle = 64;
    const t = f > overflowF ? ((f - overflowF + offset) % cycle) / cycle : 0;
    return { t, opacity: overflowOp };
  });

  return (
    <svg width={560} height={700} viewBox="0 0 400 500" overflow="visible" style={{ opacity: op, flexShrink: 0 }}>
      <defs>
        <clipPath id="cbd-clip">
          <path d={calebassePath} />
        </clipPath>
        <filter id="cbd-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx={6} dy={8} stdDeviation={4} floodColor={NAVY} floodOpacity={0.3} />
        </filter>
      </defs>
      <g filter="url(#cbd-shadow)">
        <g clipPath="url(#cbd-clip)">
          <g transform={`translate(${waveTranslateX}, ${liquidTranslateY})`}>
            <path d={fillWavePath} fill={RED_LIQUID} />
          </g>
        </g>
        <path d={calebassePath} fill="transparent" stroke={NAVY} strokeWidth={6} strokeDasharray={PATH_LEN} strokeDashoffset={strokeDashoffset} strokeLinecap="round" strokeLinejoin="round" />
        <path d={calebassePath} fill="transparent" stroke={IVORY} strokeWidth={2} strokeDasharray={PATH_LEN} strokeDashoffset={strokeDashoffset} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
      </g>
      {streamLen > 1 && (
        <g opacity={overflowOp}>
          <path d={`M128,52 C110,${52 + streamLen * 0.35} 70,${52 + streamLen * 0.6} 58,${52 + streamLen}`} fill="none" stroke={RED_LIQUID} strokeWidth={16} strokeLinecap="round" />
          <path d={`M272,52 C290,${52 + streamLen * 0.35} 330,${52 + streamLen * 0.6} 342,${52 + streamLen}`} fill="none" stroke={RED_LIQUID} strokeWidth={16} strokeLinecap="round" />
        </g>
      )}
      {drips.map((drip, i) => {
        const fromLeft = i % 2 === 0;
        const startX = fromLeft ? 56 : 344;
        const wobble = Math.sin((f + i * 20) / 6) * 6;
        const dropY = 52 + streamLen + drip.t * 150;
        const dropSize = 1 - drip.t * 0.4;
        return <ellipse key={i} cx={startX + wobble} cy={dropY} rx={13 * dropSize} ry={19 * dropSize} fill={RED_LIQUID} opacity={drip.opacity * (1 - drip.t * 0.6)} />;
      })}
      <ellipse cx={200} cy={498} rx={interpolate(f, [overflowF + 20, overflowF + 70], [0, 150], clamp)} ry={interpolate(f, [overflowF + 20, overflowF + 70], [0, 22], clamp)} fill={RED_LIQUID} opacity={overflowOp * 0.75} />
    </svg>
  );
};

export default CalebasseDettePartagee;
