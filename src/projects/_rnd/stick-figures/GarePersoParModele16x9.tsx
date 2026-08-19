// ============================================================================================
// TEST CONTROLE — personnage dessine PAR LE MODELE (pas le <Figure> du socle), anime par les
// MEMES PRINCIPES que le socle stick-figure :
//   - frame-driven pur (useCurrentFrame + interpolate, zero CSS/timeout/keyframes/random)
//   - VERROU PAS/DISTANCE : PAS_L = 2 * LEG_LEN * sin(swingMax) ; x = x0 + pas * PAS_L * SCALE.
//     Le deplacement est DERIVE du cycle de jambes, jamais anime a cote.
//   - ballot COLLE a l'epaule : sa position est calculee depuis l'ancre epaule, qui derive de
//     la hanche (bob inclus) — il suit donc le rebond vertical par construction.
//
// Le personnage est un PORTEUR de gare routiere : silhouette habillee (tunique, pantalon,
// sandales), remplissages plats, palette du decor (gareRoutiereGroups). De PROFIL, SANS visage.
// Principes repris du socle (StickFigure.tsx) mais REDESSINES ici : convention d'angle
// (0 = membre qui pend, 90 = horizontale vers l'avant), adaptation de longueur de jambe pour
// que le pied d'appui touche toujours le sol malgre le bob, dephasage bras/jambes (BRAS_LAG),
// IK 2 segments (loi des cosinus) pour la main qui tient le ballot.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  DEFS,
  PLAN_CIEL,
  PLAN_LOINTAIN,
  PLAN_BATIMENTS,
  PLAN_VEHICULES,
  PLAN_SOL,
  PLAN_AVANT,
} from "./gareRoutiereGroups";

export const GARE_PERSO_MODELE_FRAMES = 300;

// ============================================================================================
// PALETTE (strictement celle du decor — terre/matin, contours encre)
// ============================================================================================
const ENCRE = "#2b2117";
const TUNIQUE = "#5e7245";
const PANTALON = "#8a6a45";
const BALLOT_TISSU = "#d8a54a";
const BALLOT_CORDE = "#b9a884";
const KUFI = "#c17e3a";

const rad = (d: number) => (d * Math.PI) / 180;
const dirX = (deg: number) => Math.sin(rad(deg));
const dirY = (deg: number) => Math.cos(rad(deg));

// ============================================================================================
// SQUELETTE DU PORTEUR — repere local : origine = sol sous la hanche, y positif vers le BAS,
// +x = sens de marche (droite). Convention d'angle = celle du socle (0 pend, 90 avant, 180 leve).
// ============================================================================================
const LEG_LEN = 40;
const TORSO_LEN = 40;
const HEAD_R = 10;
const HIP_STAND = -(LEG_LEN * 0.97); // hanche debout, jambes quasi tendues (-38.8)
// Epaule dans le repere du buste (avant rotation lean) : legerement en avant de l'axe hanche.
// ⚠️ Ce couple (2, -TORSO_LEN) doit rester coherent avec le dessin de la tunique plus bas.
const SHOULDER_LOCAL: [number, number] = [2, -TORSO_LEN];

// Bras 2 segments (IK) — portee totale 30
const UPPER_ARM = 16;
const FOREARM = 14;

// ============================================================================================
// MARCHE CHARGEE — parametres + VERROU PAS/DISTANCE
// ============================================================================================
const SWING_MAX = 16; // deg — pas raccourcis par la charge
const FRAMES_PER_STEP = 15; // 1 pas = 0.5s a 30fps, cadence lourde
const BOB_AMP = 2.2; // rebond vertical amorti (il porte)
const HIP_DROP = 3; // hanche abaissee sous la charge
const LEAN = 8; // buste penche en avant sous le poids
const ARM_SWING = 13; // balancement du bras libre, reduit
const BRAS_LAG = 0.35; // rad — dephasage bras/jambes (parade pose degeneree, cf. socle)

// LE VERROU : distance couverte par UN pas, en unites locales du squelette.
const PAS_L = 2 * LEG_LEN * Math.sin(rad(SWING_MAX));

// Mise en scene : echelle et sol dans la bande libre y=780..1010 du decor.
const SCALE = 1.65;
const GROUND_Y = 952;
const X_START = 190;

// ============================================================================================
// IK 2 SEGMENTS — loi des cosinus (meme principe que solveArm du socle, re-derive ici).
// bend = +1 : coude pousse vers l'avant/bas du perso.
// ============================================================================================
const solveElbow = (
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  bend: number
): { ex: number; ey: number; hx: number; hy: number } => {
  const dx = tx - sx;
  const dy = ty - sy;
  let dist = Math.sqrt(dx * dx + dy * dy);
  const maxReach = UPPER_ARM + FOREARM - 0.001;
  const minReach = Math.abs(UPPER_ARM - FOREARM) + 0.001;
  let cx = tx;
  let cy = ty;
  if (dist > maxReach) {
    cx = sx + (dx / dist) * maxReach;
    cy = sy + (dy / dist) * maxReach;
    dist = maxReach;
  } else if (dist < minReach) {
    cx = sx + (dx / (dist || 1)) * minReach;
    cy = sy + (dy / (dist || 1)) * minReach;
    dist = minReach;
  }
  const a = (UPPER_ARM * UPPER_ARM - FOREARM * FOREARM + dist * dist) / (2 * dist);
  const h = Math.sqrt(Math.max(0, UPPER_ARM * UPPER_ARM - a * a));
  const ux = (cx - sx) / dist;
  const uy = (cy - sy) / dist;
  return {
    ex: sx + a * ux + bend * h * -uy,
    ey: sy + a * uy + bend * h * ux,
    hx: cx,
    hy: cy,
  };
};

// ============================================================================================
// LE PORTEUR — dessine dans le repere local (sol a y=0). Tout derive de `frame`.
// ============================================================================================
const Porteur: React.FC<{ frame: number }> = ({ frame }) => {
  // Cycle de marche : 1 cycle = 2 pas. La MEME variable `pas` pilote jambes ET deplacement
  // (le deplacement est applique par le parent, cf. composition — jamais anime a part).
  const pas = frame / FRAMES_PER_STEP;
  const phase = (pas / 2) % 1;
  const a = phase * Math.PI * 2;
  const swing = Math.sin(a) * SWING_MAX;
  const bob = Math.abs(Math.cos(a)) * BOB_AMP;

  // Hanche (x=0 dans le repere local : c'est le groupe parent qui avance)
  const hipY = HIP_STAND - bob + HIP_DROP;

  // ------------------------------------------------------------------------------
  // JAMBES en ciseau. La jambe en phase d'oscillation (vitesse angulaire vers l'avant)
  // plie le genou et se souleve ; la jambe d'appui reste quasi tendue et sa longueur
  // s'adapte pour que le pied touche TOUJOURS le sol malgre le bob (principe du socle).
  // ------------------------------------------------------------------------------
  const legDeg1 = swing;
  const legDeg2 = -swing;
  const flex1 = Math.max(0, Math.cos(a)) * 22; // d(swing)/dt > 0 => jambe 1 oscille
  const flex2 = Math.max(0, -Math.cos(a)) * 22;

  const legGeom = (deg: number, flex: number) => {
    const c = Math.cos(rad(deg));
    const adapted =
      c > 0.25
        ? Math.min(LEG_LEN * 1.06, Math.max(LEG_LEN * 0.8, -hipY / c))
        : LEG_LEN;
    // jambe d'appui (flex ~ 0) : longueur adaptee au sol ; jambe levee : longueur naturelle
    const t = Math.min(1, flex / 8);
    const len = adapted + (LEG_LEN - adapted) * t;
    const kx = dirX(deg) * (len / 2);
    const ky = hipY + dirY(deg) * (len / 2);
    const fx = kx + dirX(deg + flex) * (len / 2);
    const fy = ky + dirY(deg + flex) * (len / 2);
    return { kx, ky, fx, fy, footTilt: flex * 0.6 };
  };
  const J1 = legGeom(legDeg1, flex1);
  const J2 = legGeom(legDeg2, flex2);

  // ------------------------------------------------------------------------------
  // BUSTE penche + ANCRE EPAULE. L'epaule derive de la hanche (bob inclus) : tout ce
  // qui s'y accroche (ballot, bras, tete) herite du rebond vertical par construction.
  // ------------------------------------------------------------------------------
  const cosL = Math.cos(rad(LEAN));
  const sinL = Math.sin(rad(LEAN));
  const sx = SHOULDER_LOCAL[0] * cosL - SHOULDER_LOCAL[1] * sinL;
  const sy = hipY + SHOULDER_LOCAL[0] * sinL + SHOULDER_LOCAL[1] * cosL;

  // Tete : dans le prolongement du buste, un peu en avant (sens de marche). Pas de visage.
  const headCx = sx + sinL * 12 + 4;
  const headCy = sy - cosL * 12 - 3;

  // ------------------------------------------------------------------------------
  // BALLOT sur l'epaule — position ANCREE sur (sx, sy) : il suit le bob, jamais flottant.
  // Pose derriere la tete (le porteur le cale contre sa nuque), incline avec le buste.
  // ------------------------------------------------------------------------------
  const ballotCx = sx - 10;
  const ballotCy = sy - 15;
  const ballotTilt = -10 + LEAN;

  // Bras AVANT : la main agrippe le bord avant-bas du ballot (cible dans le repere du
  // corps, donc solidaire du bob). IK loi des cosinus, coude pousse vers l'avant.
  const grip = solveElbow(sx, sy, ballotCx + 17, ballotCy + 7, +1);

  // Bras ARRIERE : pend et balance en opposition aux jambes, avec BRAS_LAG (jamais
  // aligne verticalement avec les jambes en meme temps — cf. socle, pose degeneree).
  const armDeg = Math.sin(a - BRAS_LAG) * ARM_SWING;
  const elbow2x = sx + dirX(armDeg) * UPPER_ARM;
  const elbow2y = sy + dirY(armDeg) * UPPER_ARM;
  const hand2x = elbow2x + dirX(armDeg * 0.6) * FOREARM;
  const hand2y = elbow2y + dirY(armDeg * 0.6) * FOREARM;

  const shadowRx = 20 + Math.abs(Math.sin(a)) * 8;

  return (
    <g>
      {/* ombre au sol */}
      <ellipse cx={4} cy={1.5} rx={shadowRx} ry={4} fill={ENCRE} opacity={0.16} />

      {/* jambe ARRIERE (profondeur : opacite reduite) */}
      <path
        d={`M 0 ${hipY} L ${J2.kx} ${J2.ky} L ${J2.fx} ${J2.fy}`}
        fill="none"
        stroke={PANTALON}
        strokeWidth={8.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
      <g transform={`translate(${J2.fx} ${J2.fy}) rotate(${J2.footTilt})`} opacity={0.8}>
        <path d="M -4 0 L 9 0 L 8 3.5 L -4 3.5 Z" fill={ENCRE} />
      </g>

      {/* bras ARRIERE (balance libre, derriere le buste) */}
      <path
        d={`M ${sx} ${sy} L ${elbow2x} ${elbow2y} L ${hand2x} ${hand2y}`}
        fill="none"
        stroke={TUNIQUE}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
      <circle cx={hand2x} cy={hand2y} r={3} fill={ENCRE} opacity={0.8} />

      {/* BALLOT — derriere la tete, ancre sur l'epaule */}
      <g transform={`translate(${ballotCx} ${ballotCy}) rotate(${ballotTilt})`}>
        <ellipse rx={21} ry={12.5} fill={BALLOT_TISSU} stroke={ENCRE} strokeWidth={2} />
        <path d="M -14 -3 Q 0 3 14 -2" stroke={ENCRE} strokeWidth={1.5} fill="none" opacity={0.5} />
        <path d="M -6 -12 Q -4 -16 0 -15 Q 3 -14 2 -11" fill={BALLOT_CORDE} stroke={ENCRE} strokeWidth={1.5} />
        <path d="M -21 2 Q -18 8 -12 10" stroke={BALLOT_CORDE} strokeWidth={3} fill="none" />
      </g>

      {/* TUNIQUE (buste habille) — groupe rigide pivote a la hanche, coherent avec
          SHOULDER_LOCAL = (2, -40) : le col du vetement entoure ce point */}
      <g transform={`translate(0 ${hipY}) rotate(${LEAN})`}>
        <path
          d="M -9 7 L -7 -38 Q -7 -44 0 -44 L 6 -44 Q 12 -44 12 -38 L 15 9 Q 3 14 -9 7 Z"
          fill={TUNIQUE}
          stroke={ENCRE}
          strokeWidth={2}
        />
        <path d="M -7 -14 L 13 -12" stroke={ENCRE} strokeWidth={1.3} opacity={0.35} fill="none" />
      </g>

      {/* jambe AVANT */}
      <path
        d={`M 0 ${hipY} L ${J1.kx} ${J1.ky} L ${J1.fx} ${J1.fy}`}
        fill="none"
        stroke={PANTALON}
        strokeWidth={8.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g transform={`translate(${J1.fx} ${J1.fy}) rotate(${J1.footTilt})`}>
        <path d="M -4 0 L 9 0 L 8 3.5 L -4 3.5 Z" fill={ENCRE} />
      </g>

      {/* TETE silhouette, sans visage, + kufi */}
      <line x1={sx} y1={sy} x2={headCx} y2={headCy + 6} stroke={ENCRE} strokeWidth={5} strokeLinecap="round" />
      <circle cx={headCx} cy={headCy} r={HEAD_R} fill={ENCRE} />
      <path
        d={`M ${headCx - 9} ${headCy - 4} A 9 9 0 0 1 ${headCx + 9} ${headCy - 4} L ${headCx + 8} ${headCy - 7} A 8 8 0 0 0 ${headCx - 8} ${headCy - 7} Z`}
        fill={KUFI}
        stroke={ENCRE}
        strokeWidth={1.5}
      />

      {/* bras AVANT — main sur le ballot (IK), dessine en dernier (devant tout) */}
      <path
        d={`M ${sx} ${sy} L ${grip.ex} ${grip.ey} L ${grip.hx} ${grip.hy}`}
        fill="none"
        stroke={TUNIQUE}
        strokeWidth={6.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={grip.hx} cy={grip.hy} r={3.4} fill={ENCRE} />
    </g>
  );
};

// ============================================================================================
// COMPOSITION 1920x1080 — decor statique (6 plans) + porteur qui marche vers la droite.
// LE VERROU EN ACTION : x est calcule depuis `pas` (le meme compteur qui pilote les jambes),
// multiplie par PAS_L et par SCALE (le scale du <g> du perso). Zero animation de x a cote.
// ============================================================================================
export const GarePersoParModele16x9: React.FC = () => {
  const frame = useCurrentFrame();

  // nombre de pas ecoules — pilote a la fois les jambes (dans Porteur) et le deplacement ici
  const pas = frame / FRAMES_PER_STEP;
  const x = X_START + pas * PAS_L * SCALE;

  // entree en douceur (seul usage decoratif d'interpolate — le mouvement, lui, est le verrou)
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#e8dcc0" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />
        <g dangerouslySetInnerHTML={{ __html: PLAN_CIEL }} />
        <g dangerouslySetInnerHTML={{ __html: PLAN_LOINTAIN }} />
        <g dangerouslySetInnerHTML={{ __html: PLAN_BATIMENTS }} />
        <g dangerouslySetInnerHTML={{ __html: PLAN_VEHICULES }} />
        <g dangerouslySetInnerHTML={{ __html: PLAN_SOL }} />

        {/* LE PORTEUR — dans la bande libre y=780..1010, pieds au sol a y=952 */}
        <g transform={`translate(${x} ${GROUND_Y}) scale(${SCALE})`} opacity={opacity}>
          <Porteur frame={frame} />
        </g>

        <g dangerouslySetInnerHTML={{ __html: PLAN_AVANT }} />
      </svg>
    </AbsoluteFill>
  );
};

export default GarePersoParModele16x9;
