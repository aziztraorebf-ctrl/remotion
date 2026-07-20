/**
 * RecolteAuSol — SCENE-PROTOTYPE de reference (validee 100% par Aziz, 2026-06-30).
 * Montre comment monter une scene "un personnage entre, marche, se penche, RAMASSE au sol, se releve".
 * Doc : ../PERSONNAGE-VIVANT-INDEX.md
 *
 * Brique reutilisable : la MACHINE A ETATS du ramassage (timeline + HOLD + transfert objet->main).
 *  - L'objet (feve) reste FIXE au sol jusqu'au HOLD, pose EXACTEMENT a la position de la main au HOLD.
 *  - Au HOLD : l'objet devient enfant de la main (suit le redressement). Plus de saut / flottement.
 *  - Le bras DESCEND vers le sol (computePose.frontHand) et reste en bas pendant la saisie, puis remonte.
 *
 * Format 9:16 par defaut (perso ~1/3 de l'arbre). Decor verger encre/parchemin (exemple ; remplacable).
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { StickRig } from "../rig/StickRig";
import { computePose } from "../rig/poses";

export const RECOLTE_AU_SOL_FRAMES = 300;
const PARCH = "#e8dcc0";
const INK = "#2b2117";
const POD = "#a26432";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// ---- TIMELINE DU GESTE (frames @30) — la recette reutilisable ----
const F_ARRIVE = 120; // fin de marche
const F_BEND = 165;   // penche complet
const F_REACH = 195;  // main au sol (fin descente)
const F_HOLD = 209;   // fin du HOLD (~14f de saisie) -> transfert main
const F_UP = 260;     // redresse, objet remonte

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

export const RecolteAuSol: React.FC = () => {
  const frame = useCurrentFrame();
  const wf = frame;
  const W = 1080, H = 1920;
  const GROUND_Y = 1340;
  const STOP_X = 430;
  const MAN_S = 0.62;

  // deplacement + marche (foot-plant cote rig)
  const x = interpolate(frame, [0, F_ARRIVE], [-120, STOP_X], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const moving = frame < F_ARRIVE - 2;
  const walkPhase = frame;

  // machine a etats (ordre Gemini) : se baisse, RESTE penche pendant la saisie, se redresse APRES le HOLD
  const bend = interpolate(frame, [F_ARRIVE, F_BEND, F_HOLD, F_UP, F_UP + 30], [0, 1, 1, 0.4, 0.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const armReach = interpolate(frame, [F_BEND - 10, F_REACH, F_HOLD, F_UP], [0, 1, 1, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // position main avant (helper PARTAGE -> coords scene)
  const pose = computePose({ walkPhase, moving, bend, armReach });
  const handSceneX = x + pose.frontHandX * MAN_S;
  const handSceneY = GROUND_Y + pose.frontHandY * MAN_S;

  // objet au sol : pose EXACTEMENT a la main au HOLD (bras en bas) -> pas de saut. Puis enfant de la main.
  const holdPose = computePose({ walkPhase: F_HOLD, moving: false, bend: 1, armReach: 1 });
  const podGroundX = STOP_X + holdPose.frontHandX * MAN_S;
  const podGroundY = GROUND_Y + holdPose.frontHandY * MAN_S;
  const grabbed = frame >= F_HOLD;
  const podX = grabbed ? handSceneX : podGroundX;
  const podY = grabbed ? handSceneY : podGroundY;

  // ambiance (heure doree)
  const dusk = interpolate(frame, [60, 280], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgDusk = lerpHex(PARCH, "#e7cfa3", dusk);
  const sunDusk = lerpHex("#f2c14e", "#e8923a", dusk);
  const sunX = 840, sunY = 340;

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={bgDusk} />
        <circle cx={sunX} cy={sunY} r={84} fill={sunDusk} opacity={0.95} />
        <circle cx={sunX} cy={sunY} r={84} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />
        <g stroke={sunDusk} strokeWidth={4} opacity={0.5} strokeLinecap="round">
          {Array.from({ length: 8 }, (_, k) => { const ba = (k / 8) * Math.PI * 2 + wf / 120; const r0 = 96, r1 = 134; return <line key={k} x1={sunX + Math.cos(ba) * r0} y1={sunY + Math.sin(ba) * r0} x2={sunX + Math.cos(ba) * r1} y2={sunY + Math.sin(ba) * r1} />; })}
        </g>
        {/* sol */}
        <path d={`M0 ${GROUND_Y - 4} H ${W}`} fill="none" stroke={INK} strokeWidth={2.4} opacity={0.45} />
        <ellipse cx={STOP_X} cy={GROUND_Y + 8} rx={120} ry={16} fill={INK} opacity={0.06} />

        {/* objet (feve) : sol -> main au HOLD. petit flash de saisie. */}
        <g transform={`translate(${podX} ${podY})`}>
          {grabbed && frame < F_HOLD + 10 && (
            <circle cx={0} cy={0} r={26} fill="#f2c14e" opacity={interpolate(frame, [F_HOLD, F_HOLD + 10], [0.35, 0], { extrapolateRight: "clamp" })} />
          )}
          <Pod />
        </g>

        {/* LE PERSONNAGE */}
        <g transform={`translate(${x} ${GROUND_Y}) scale(${MAN_S})`}>
          <StickRig walkPhase={walkPhase} moving={moving} bend={bend} armReach={armReach} facing={1} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
