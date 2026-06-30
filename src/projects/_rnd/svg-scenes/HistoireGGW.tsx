/**
 * HistoireGGW — mini-RECIT 9:16 Grande Muraille Verte : DEUX personnages plantent des arbres (R&D 2026-06-30).
 * 2e test narratif (apres HistoirePlanteur cacao) : prouver 2 persos differencies + un nouveau geste (planter).
 * Brique perso : _shared/personnage-vivant-svg (StickRig + computePose + objectHandling).
 *
 * RECIT (~14s @30 = 420f) :
 *  - 2 planteurs entrent (vitesse constante, decales). Differencies : tailles + accessoires (cap vert / foulard).
 *  - chacun s'arrete, se penche, DEPOSE un jeune plant au sol (geste "manipuler-objet" mais depot AU SOL).
 *  - le plant prend racine et POUSSE un peu (la vie revient = sens GGW).
 *  - ils se relevent et repartent.
 *
 * ⛔ Marche = vitesse CONSTANTE (translation lineaire). Plant tenu = colle a la main (objectHandling).
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { StickRig } from "../../_shared/personnage-vivant-svg/rig/StickRig";
import { computePose } from "../../_shared/personnage-vivant-svg/rig/poses";

export const HISTOIRE_GGW_FRAMES = 420;
const SKY = "#e9dcc2";       // ciel sahel chaud (parchemin)
const SAND = "#dcc89e";      // sol aride
const INK = "#2b2117";
const GREEN = "#5e7245";     // vert-vie (GGW)
const GREEN_D = "#46582f";
const TRUNK = "#6b4423";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

const W = 1080, H = 1920;
const GROUND_Y = 1380;
const WALK_SPEED = 5.0;

// un planteur = un acteur avec sa timeline propre, sa taille, son accessoire, son point de plantation
type Planter = {
  scaleBody: number;          // taille (silhouettes distinctes)
  hat: "cap" | "scarf";
  stopX: number;              // ou il plante
  fArrive: number; fBend: number; fPlant: number; fRise: number; fLeave: number;
};

const lerpHex = (a: string, c: string, t: number) => {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const cc = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${cc.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

// jeune plant qui pousse (grow 0..1) : tige + 2-3 petites feuilles
const Sapling: React.FC<{ grow: number; wf: number }> = ({ grow, wf }) => {
  const g = Math.max(0, Math.min(1, grow));
  const h = 70 * g;
  const sway = Math.sin(wf / 24) * 2 * g;
  return (
    <g transform={`rotate(${sway} 0 0)`} opacity={g > 0.02 ? 1 : 0}>
      <line x1={0} y1={0} x2={0} y2={-h} stroke={TRUNK} strokeWidth={5} strokeLinecap="round" />
      {g > 0.3 && <path d={`M0 ${-h * 0.6} q -22 -10 -30 -26`} fill="none" stroke={GREEN} strokeWidth={5} strokeLinecap="round" />}
      {g > 0.5 && <path d={`M0 ${-h * 0.8} q 22 -10 30 -26`} fill="none" stroke={GREEN} strokeWidth={5} strokeLinecap="round" />}
      {g > 0.7 && <ellipse cx={0} cy={-h - 6} rx={20 * g} ry={14 * g} fill={GREEN} stroke={INK} strokeWidth={3} opacity={0.9} />}
    </g>
  );
};

const PlanterActor: React.FC<{ frame: number; wf: number; p: Planter }> = ({ frame, wf, p }) => {
  // deplacement : arrive (vitesse constante) -> plante -> repart
  let x: number;
  if (frame < p.fArrive) x = p.stopX - (p.fArrive - frame) * WALK_SPEED;
  else if (frame < p.fLeave) x = p.stopX;
  else x = p.stopX + (frame - p.fLeave) * WALK_SPEED;
  const moving = frame < p.fArrive || frame >= p.fLeave;
  const walkPhase = frame;

  // geste : se penche, depose le plant au sol, se releve
  const bend = interpolate(frame, [p.fArrive, p.fBend, p.fRise, p.fRise + 24], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const armReach = interpolate(frame, [p.fBend - 10, p.fPlant, p.fRise, p.fRise + 18], [0, 1, 1, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  const pose = computePose({ walkPhase, moving, bend, armReach });
  const s = p.scaleBody;
  const handX = x + pose.frontHandX * s;
  const handY = GROUND_Y + pose.frontHandY * s;

  // le plant : tenu en main jusqu'au depot (fPlant), puis pose au sol et POUSSE
  const planted = frame >= p.fPlant;
  // position-sol du plant = la ou la main le depose (pose de depot)
  const plantPose = computePose({ walkPhase: p.fPlant, moving: false, bend: 1, armReach: 1 });
  const groundPlantX = p.stopX + plantPose.frontHandX * s;
  const seedX = planted ? groundPlantX : handX;
  const seedY = planted ? GROUND_Y : handY;
  const grow = interpolate(frame, [p.fPlant, p.fPlant + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  return (
    <>
      {/* plant : graine en main (avant) -> jeune arbre qui pousse au sol (apres depot) */}
      {!planted ? (
        <g transform={`translate(${handX} ${handY})`}>
          <ellipse cx={0} cy={0} rx={11} ry={16} fill={GREEN_D} stroke={INK} strokeWidth={2.5} />
        </g>
      ) : (
        <g transform={`translate(${seedX} ${seedY}) scale(${s})`}>
          <Sapling grow={grow} wf={wf} />
        </g>
      )}
      {/* le planteur */}
      <g transform={`translate(${x} ${GROUND_Y}) scale(${s})`}>
        <StickRig walkPhase={walkPhase} moving={moving} bend={bend} armReach={armReach} facing={1} hat={p.hat} />
      </g>
    </>
  );
};

export const HistoireGGW: React.FC = () => {
  const frame = useCurrentFrame();
  const wf = frame;

  // 2 planteurs differencies (taille + accessoire + decalage temporel)
  const A: Planter = { scaleBody: 0.66, hat: "cap", stopX: 360, fArrive: 110, fBend: 150, fPlant: 196, fRise: 250, fLeave: 290 };
  const B: Planter = { scaleBody: 0.54, hat: "scarf", stopX: 680, fArrive: 140, fBend: 180, fPlant: 226, fRise: 280, fLeave: 320 };

  // ambiance : le ciel/sol verdit tres legerement sur la duree (la vie revient)
  const life = interpolate(frame, [120, HISTOIRE_GGW_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sandLife = lerpHex(SAND, "#cdc18a", life);
  const sunDusk = lerpHex("#f2c14e", "#e8923a", life);

  return (
    <AbsoluteFill style={{ backgroundColor: SKY }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={SKY} />
        {/* soleil */}
        <circle cx={850} cy={330} r={84} fill={sunDusk} opacity={0.95} />
        <circle cx={850} cy={330} r={84} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />
        <g stroke={sunDusk} strokeWidth={4} opacity={0.5} strokeLinecap="round">
          {Array.from({ length: 8 }, (_, k) => { const ba = (k / 8) * Math.PI * 2 + wf / 120; const r0 = 96, r1 = 134; return <line key={k} x1={850 + Math.cos(ba) * r0} y1={330 + Math.sin(ba) * r0} x2={850 + Math.cos(ba) * r1} y2={330 + Math.sin(ba) * r1} />; })}
        </g>
        {/* sol aride */}
        <rect x={-200} y={GROUND_Y - 4} width={W + 400} height={H} fill={sandLife} />
        <path d={`M0 ${GROUND_Y - 4} H ${W}`} fill="none" stroke={INK} strokeWidth={2.4} opacity={0.4} />

        {/* les 2 planteurs */}
        <PlanterActor frame={frame} wf={wf} p={A} />
        <PlanterActor frame={frame} wf={wf} p={B} />
      </svg>
    </AbsoluteFill>
  );
};
