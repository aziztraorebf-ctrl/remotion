/**
 * PasserObjetMainAMain — SCENE-PROTOTYPE R&D (session 2026-07-01, piste B de la R&D perso vivant).
 * Prouve la brique "2 personnages se font face et se passent un objet main-a-main" (planteur -> acheteur).
 * Doc : ../PERSONNAGE-VIVANT-INDEX.md (recette a ajouter une fois validee).
 *
 * Brique reutilisable : handoffState (rig/objectHandling.ts) — meme principe HOLD que le ramassage au sol
 * (RecolteAuSol) : l'objet ne glisse JAMAIS seul, il est colle a la main REELLE (computePose) tant qu'il
 * est tenu, avec un point de contact FIGE pendant le HOLD.
 *
 * Choregraphie :
 *  1. A (gauche, facing=1) marche vers B (droite, facing=-1, deja sur place).
 *  2. A s'arrete a distance de bras, tend son bras avant (armReach) vers B.
 *  3. B tend son bras avant (armReach) en miroir, au meme moment (regard implicite = les 2 bras se rejoignent).
 *  4. HOLD (~14f) au point de contact -> transfert.
 *  5. B retire son bras (objet en main), A retire le sien, repart legerement en arriere.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { StickRig } from "../rig/StickRig";
import { computePose } from "../rig/poses";
import { handoffState } from "../rig/objectHandling";

export const PASSER_OBJET_FRAMES = 300;
const PARCH = "#e8dcc0";
const INK = "#2b2117";
const POD = "#a26432";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// ---- TIMELINE (frames @30) ----
const F_ARRIVE = 110;  // A finit sa marche, s'arrete a distance de bras
const WALK_DECAY = 15; // duree (frames) du ralenti AVANT F_ARRIVE : le pas revient a une position neutre (pas de cut brutal)
const F_REACH = 150;   // les 2 bras sont tendus au max (fin extension)
const F_HOLD = 164;    // fin du HOLD (~14f) -> transfert A->B
const F_RETRACT = 210; // les 2 bras se retirent
const F_END = 300;

const lerpHex = (a: string, c: string, t: number) => {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const cc = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${cc.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

const Pod: React.FC = () => (
  <>
    <ellipse cx={0} cy={0} rx={16} ry={26} fill={POD} stroke={INK} strokeWidth={3} />
    <path d="M0 -22 L0 20 M-8 -16 C-3 -6 -3 8 -8 14 M8 -16 C3 -6 3 8 8 14" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
  </>
);

export const PasserObjetMainAMain: React.FC = () => {
  const frame = useCurrentFrame();
  const wf = frame;
  const W = 1920, H = 1080;
  const GROUND_Y = 780;
  const MAN_S = 1.15;
  // distance calculee pour que les mains tendues (offerReach=1, frontHandX local ~120) se rejoignent :
  // A_STOP_X + 120*MAN_S == B_X - 120*MAN_S  ->  B_X - A_STOP_X == 240*MAN_S
  const A_STOP_X = 800;    // A s'arrete ici (distance de bras de B)
  const B_X = 1076;        // B est fixe sur place

  // ---- A : marche puis s'arrete, tend le bras HORIZONTALEMENT (offerReach) ----
  const aX = interpolate(frame, [0, F_ARRIVE], [-160, A_STOP_X], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  // ralenti PROGRESSIF avant l'arret (pas de cut brutal moving=true->false : le pas revient a sa position
  // neutre au lieu de se figer en pleine foulee — bug corrige 2026-07-01, cf poses.ts doc moveAmt).
  const aMoveAmt = interpolate(frame, [F_ARRIVE - WALK_DECAY, F_ARRIVE], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const aOffer = interpolate(frame, [F_ARRIVE, F_REACH, F_HOLD, F_RETRACT], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const aPose = computePose({ walkPhase: frame, moveAmt: aMoveAmt, bend: 0, offerReach: aOffer });
  // A facing=1 -> main scene = aX + frontHandX (pas de reflet, frontHandX deja oriente "vers l'avant" = vers la droite)
  const aHandSceneX = aX + aPose.frontHandX * MAN_S;
  const aHandSceneY = GROUND_Y + aPose.frontHandY * MAN_S;

  // ---- B : immobile, tend le bras EN MIROIR au meme rythme que A ----
  const bOffer = interpolate(frame, [F_ARRIVE + 6, F_REACH + 6, F_HOLD, F_RETRACT], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const bPose = computePose({ walkPhase: frame, moving: false, bend: 0, offerReach: bOffer });
  // B facing=-1 -> StickRig applique scale(facing,1) en interne -> la main SCENE est reflechie en X
  const bHandSceneX = B_X - bPose.frontHandX * MAN_S;
  const bHandSceneY = GROUND_Y + bPose.frontHandY * MAN_S;

  // ---- point de contact FIGE (calcule au frame F_HOLD, pas recalcule a chaque frame du HOLD) ----
  const aPoseAtHold = computePose({ walkPhase: F_HOLD, moving: false, bend: 0, offerReach: 1 });
  const bPoseAtHold = computePose({ walkPhase: F_HOLD, moving: false, bend: 0, offerReach: 1 });
  const contactX = ((A_STOP_X + aPoseAtHold.frontHandX * MAN_S) + (B_X - bPoseAtHold.frontHandX * MAN_S)) / 2;
  const contactY = GROUND_Y + aPoseAtHold.frontHandY * MAN_S;

  const handoff = handoffState({
    frame,
    fHold: F_HOLD,
    fRelease: F_HOLD + 14,
    handAX: aHandSceneX, handAY: aHandSceneY,
    handBX: bHandSceneX, handBY: bHandSceneY,
    contactX, contactY,
  });

  // ambiance (heure doree, coherent avec les autres scenes proto)
  const dusk = interpolate(frame, [60, F_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgDusk = lerpHex(PARCH, "#e7cfa3", dusk);
  const sunDusk = lerpHex("#f2c14e", "#e8923a", dusk);
  const sunX = 960, sunY = 220;

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={bgDusk} />
        <circle cx={sunX} cy={sunY} r={80} fill={sunDusk} opacity={0.95} />
        <circle cx={sunX} cy={sunY} r={80} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />
        <g stroke={sunDusk} strokeWidth={4} opacity={0.5} strokeLinecap="round">
          {Array.from({ length: 8 }, (_, k) => { const ba = (k / 8) * Math.PI * 2 + wf / 120; const r0 = 92, r1 = 128; return <line key={k} x1={sunX + Math.cos(ba) * r0} y1={sunY + Math.sin(ba) * r0} x2={sunX + Math.cos(ba) * r1} y2={sunY + Math.sin(ba) * r1} />; })}
        </g>

        {/* sol */}
        <path d={`M0 ${GROUND_Y - 4} H ${W}`} fill="none" stroke={INK} strokeWidth={2.4} opacity={0.45} />
        <ellipse cx={A_STOP_X} cy={GROUND_Y + 8} rx={110} ry={16} fill={INK} opacity={0.05} />
        <ellipse cx={B_X} cy={GROUND_Y + 8} rx={110} ry={16} fill={INK} opacity={0.05} />

        {/* objet (feve) : suit A -> point de contact fige -> suit B */}
        <g transform={`translate(${handoff.x} ${handoff.y})`}>
          {handoff.holding === "hold" && (
            <circle cx={0} cy={0} r={24} fill="#f2c14e" opacity={interpolate(frame, [F_HOLD, F_HOLD + 3, F_HOLD + 14], [0, 0.35, 0], { extrapolateRight: "clamp" })} />
          )}
          <Pod />
        </g>

        {/* PERSO A (planteur, gauche -> droite, tend la feve) */}
        <g transform={`translate(${aX} ${GROUND_Y}) scale(${MAN_S})`}>
          <StickRig walkPhase={frame} moveAmt={aMoveAmt} bend={0} offerReach={aOffer} facing={1} hat="straw" />
        </g>

        {/* PERSO B (acheteur, droite, immobile, tend la main en miroir) */}
        <g transform={`translate(${B_X} ${GROUND_Y}) scale(${MAN_S})`}>
          <StickRig walkPhase={frame} moving={false} bend={0} offerReach={bOffer} facing={-1} hat="cap" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
