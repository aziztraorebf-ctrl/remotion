/**
 * PROTO 16:9 — cadrage SERRE, le personnage EST le sujet (pas "plan large + fond minuscule",
 * qui a echoue 2x sur CargoVoyage16x9_LibreInspire : StickRig et GeminiRig tous deux illisibles
 * a l'echelle cueilleur-fond-de-plan). Ici le personnage occupe ~55% de la hauteur du cadre.
 *
 * Mecanique de geste reprise de ProtoGeminiTreeCueillette.tsx (angles reach-up deja valides
 * en silhouette, session 2026-07-02) mais portee sur le rig CANONIQUE partage GeminiRig.tsx
 * (_shared/personnage-vivant-svg/rig/) au lieu d'un rig local duplique — et integree dans un
 * vrai decor (registre chaud CargoVoyage : ciel ocre, horizon cacaoyers, CacaoTree geant en
 * fond), pas un fond parchemin plat de test isole.
 *
 * Sequence : marche vers l'arbre -> leve le bras -> cueille -> redescend (cabosse en main) ->
 * repart, camera FIXE (le sujet vient a nous, pas de parallaxe — a cette echelle un travelling
 * ferait sortir le perso du cadre en 1-2s).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { GeminiRig, IDLE, lerpAngles, type LimbAngles } from "../../_shared/personnage-vivant-svg/rig/GeminiRig";
import { CacaoTree } from "../../souverain/cacao-chocolat-short/components/VergerCacao";
import { lerpHex } from "../../_shared/svg-library/motion";

const SKY_A = "#e8dcc0";
const SKY_B = "#f2d9a0"; // ciel dore, plus chaud qu'au lever (heure de la cueillette = milieu de journee)
const INK = "#2b2117";

const EASE = Easing.bezier(0.4, 0, 0.2, 1);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// angles repris tels quels de ProtoGeminiTreeCueillette (v2-reach-up.svg valide 2026-07-02),
// adaptes au type LimbAngles canonique (ajoute hipX/hipY que le rig local n'avait pas).
const WALK_A: LimbAngles = { torsoTilt: 0, headTilt: 0, armUpperFront: -45, armLowerFront: -15, armUpperBack: 45, armLowerBack: -15, legUpperFront: -35, legLowerFront: 50, footFront: 0, legUpperBack: 30, legLowerBack: 20, footBack: 0, hipX: 0, hipY: 0 };
const WALK_B: LimbAngles = { torsoTilt: 0, headTilt: 0, armUpperFront: 45, armLowerFront: -15, armUpperBack: -45, armLowerBack: -15, legUpperFront: 30, legLowerFront: 20, footFront: 0, legUpperBack: -35, legLowerBack: 50, footBack: 0, hipX: 0, hipY: 0 };
// marche RETOUR (main occupee par la cabosse) : bras avant fige pres du corps (angle reduit),
// meme bug/fix que hand-basket-walk et tree-cueillette originaux — un bras qui tient un objet
// ne peut pas suivre le grand balancier de la marche libre (±45), sinon l'objet "vole".
const WALK_A_CARRY: LimbAngles = { ...WALK_A, armUpperFront: -10, armLowerFront: -5 };
const WALK_B_CARRY: LimbAngles = { ...WALK_B, armUpperFront: -10, armLowerFront: -5 };
const REACH_UP: LimbAngles = { torsoTilt: -2, headTilt: 15, armUpperFront: -155, armLowerFront: -10, armUpperBack: 15, armLowerBack: -10, legUpperFront: -2, legLowerFront: 0, footFront: 0, legUpperBack: 3, legLowerBack: 0, footBack: 0, hipX: 0, hipY: 0 };
const HOLD_LOW: LimbAngles = { ...IDLE };

const HALF_STEP = 14;
function walkCycle(frame: number, start: number, walkA: LimbAngles, walkB: LimbAngles) {
  const cf = frame - start;
  const stepIndex = Math.floor(cf / HALF_STEP);
  const localT = (cf % HALF_STEP) / HALF_STEP;
  const from = stepIndex % 2 === 0 ? walkA : walkB;
  const to = stepIndex % 2 === 0 ? walkB : walkA;
  return lerpAngles(from, to, localT);
}

// position SCENE de la main avant, meme chaine de transforms que GeminiRig profil :
// hip translate -> torse rotate -> arm-upper translate+rotate -> arm-lower translate+rotate -> main.
function computeFrontHandScene(a: LimbAngles, hipX: number, hipY: number) {
  const rot = (px: number, py: number, deg: number) => {
    const r = (deg * Math.PI) / 180;
    return [px * Math.cos(r) - py * Math.sin(r), px * Math.sin(r) + py * Math.cos(r)];
  };
  const [sx, sy] = rot(0, -135, a.torsoTilt);
  const shX = hipX + sx, shY = hipY + sy;
  const [ux, uy] = rot(0, 90, a.torsoTilt + a.armUpperFront);
  const elbowX = shX + ux, elbowY = shY + uy;
  const [lx, ly] = rot(0, 75, a.torsoTilt + a.armUpperFront + a.armLowerFront);
  return { x: elbowX + lx, y: elbowY + ly + 10 };
}

const T = {
  walkStart: 20, walkEnterEnd: 35, walkEnd: 110,
  reachEnd: 140, fGrab: 148, holdEnd: 165,
  lowerEnd: 195,
  walk2Start: 195, walk2EnterEnd: 210, walk2End: 280,
  stopEnd: 300,
};

export const PROTO_CUEILLETTE_GROS_PLAN_FRAMES = T.stopEnd + 40;

const TREE_HIP_X = 1250; // position scene ou le corps s'arrete (bras a portee de la cabosse)
const HIP_Y = 700;
const PERSO_SCALE = 1.3;
// TREE_ORIGIN/TREE_SCALE resolus algebriquement (pas devines) pour que la cabosse la PLUS HAUTE
// du houppier (locale cx=-14 cy=-238 dans CacaoTree, cf ellipse podPulse(3)) tombe exactement a
// la position SCENE de la main levee (REACH_UP, calculee via computeFrontHandScene) — bug corrige
// du 1er essai : une cabosse basse (cy=-128) + arbre surdimensionne (scale 2.6) plaçait la cible
// hors de portee reelle du bras (verifie par calcul, pas juste a l'oeil).
const TREE_SCALE = 1.1;
const REACH_HAND = (() => {
  const rot = (px: number, py: number, deg: number) => {
    const r = (deg * Math.PI) / 180;
    return [px * Math.cos(r) - py * Math.sin(r), px * Math.sin(r) + py * Math.cos(r)];
  };
  const torsoTilt = -2, armUpperFront = -155, armLowerFront = -10;
  const [sx, sy] = rot(0, -135, torsoTilt);
  const shX = TREE_HIP_X + sx * PERSO_SCALE, shY = HIP_Y + sy * PERSO_SCALE;
  const [ux, uy] = rot(0, 90, torsoTilt + armUpperFront);
  const elbowX = shX + ux * PERSO_SCALE, elbowY = shY + uy * PERSO_SCALE;
  const [lx, ly] = rot(0, 75, torsoTilt + armUpperFront + armLowerFront);
  return { x: elbowX + lx * PERSO_SCALE, y: elbowY + ly * PERSO_SCALE + 10 * PERSO_SCALE };
})();
const POD_TREE_LOCAL = { x: -14, y: -238 };
const TREE_ORIGIN_X = REACH_HAND.x - POD_TREE_LOCAL.x * TREE_SCALE;
const TREE_ORIGIN_Y = REACH_HAND.y - POD_TREE_LOCAL.y * TREE_SCALE;
const POD_LOCAL = { x: REACH_HAND.x, y: REACH_HAND.y };

export const ProtoCueilletteGrosPlan16x9: React.FC = () => {
  const frame = useCurrentFrame();

  const skyColor = lerpHex(SKY_A, SKY_B, Math.min(1, frame / 200));

  let limb: LimbAngles;
  let hipX = 260;
  let label = "";

  if (frame < T.walkStart) {
    limb = IDLE; hipX = 260; label = "idle";
  } else if (frame < T.walkEnterEnd) {
    const t = interpolate(frame, [T.walkStart, T.walkEnterEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(IDLE, WALK_A, easeInOutCubic(t));
    hipX = interpolate(frame, [T.walkStart, T.walkEnd], [260, TREE_HIP_X], { extrapolateRight: "clamp", easing: EASE });
    label = "marche vers l'arbre";
  } else if (frame < T.walkEnd) {
    limb = walkCycle(frame, T.walkEnterEnd, WALK_A, WALK_B);
    hipX = interpolate(frame, [T.walkStart, T.walkEnd], [260, TREE_HIP_X], { extrapolateRight: "clamp", easing: EASE });
    label = "marche vers l'arbre";
  } else if (frame < T.reachEnd) {
    const t = interpolate(frame, [T.walkEnd, T.reachEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(IDLE, REACH_UP, easeInOutCubic(t)); hipX = TREE_HIP_X;
    label = "leve le bras vers la cabosse";
  } else if (frame < T.holdEnd) {
    limb = REACH_UP; hipX = TREE_HIP_X;
    label = frame < T.fGrab ? "leve le bras vers la cabosse" : "cueille (hold)";
  } else if (frame < T.lowerEnd) {
    const t = interpolate(frame, [T.holdEnd, T.lowerEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(REACH_UP, HOLD_LOW, easeInOutCubic(t)); hipX = TREE_HIP_X;
    label = "redescend le bras, cabosse en main";
  } else if (frame < T.walk2EnterEnd) {
    const t = interpolate(frame, [T.walk2Start, T.walk2EnterEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(HOLD_LOW, WALK_A_CARRY, easeInOutCubic(t));
    hipX = interpolate(frame, [T.walk2Start, T.walk2End], [TREE_HIP_X, TREE_HIP_X + 420], { extrapolateRight: "clamp", easing: EASE });
    label = "repart avec la cabosse";
  } else if (frame < T.walk2End) {
    limb = walkCycle(frame, T.walk2EnterEnd, WALK_A_CARRY, WALK_B_CARRY);
    hipX = interpolate(frame, [T.walk2Start, T.walk2End], [TREE_HIP_X, TREE_HIP_X + 420], { extrapolateRight: "clamp", easing: EASE });
    label = "repart avec la cabosse";
  } else if (frame < T.stopEnd) {
    const t = interpolate(frame, [T.walk2End, T.stopEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(WALK_A_CARRY, IDLE, easeInOutCubic(t)); hipX = TREE_HIP_X + 420;
    label = "arrive / idle";
  } else {
    limb = IDLE; hipX = TREE_HIP_X + 420;
  }

  const inHand = frame >= T.fGrab;
  const handScene = computeFrontHandScene(limb, hipX, HIP_Y);
  const podX = inHand ? handScene.x : POD_LOCAL.x;
  const podY = inHand ? handScene.y : POD_LOCAL.y;

  return (
    <AbsoluteFill style={{ backgroundColor: skyColor }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <rect x={0} y={0} width={1920} height={1080} fill={skyColor} />

        {/* horizon + rideau de cacaoyers en fond, FLOUS/pales (profondeur derriere le sujet) */}
        <rect x={0} y={640} width={1920} height={440} fill="#8a9a6b" opacity={0.35} />
        <line x1={0} y1={640} x2={1920} y2={640} stroke={INK} strokeWidth={2} opacity={0.3} />
        {[
          { x: 120, s: 0.32 }, { x: 340, s: 0.28 }, { x: 1720, s: 0.3 }, { x: 1880, s: 0.26 },
        ].map((t, i) => (
          <g key={i} transform={`translate(${t.x} 660) scale(${t.s})`} opacity={0.55}>
            <CacaoTree alive={1} grow={1} tone={i % 3} />
          </g>
        ))}

        {/* L'ARBRE-SUJET : cacaoyer au premier plan avec le personnage, echelle 1.4 (pas 2.6 —
            bug corrige du 1er essai : le houppier a scale 2.6 mangeait le tiers superieur de
            l'ecran et ecrasait visuellement le personnage). Le tronc reste DERRIERE le
            personnage (rendu avant), le houppier haut ne descend pas devant sa tete a cette
            echelle reduite. */}
        <g transform={`translate(${TREE_ORIGIN_X} ${TREE_ORIGIN_Y}) scale(${TREE_SCALE})`}>
          <CacaoTree alive={1} grow={1} tone={0} />
        </g>
        {!inHand && (
          <line x1={podX} y1={podY - 26} x2={podX} y2={podY} stroke={INK} strokeWidth={3} />
        )}

        {/* sol */}
        <rect x={0} y={1030} width={1920} height={50} fill={INK} opacity={0.14} />

        {/* PERSONNAGE — sujet principal du cadre, rendu APRES l'arbre pour rester DEVANT le tronc */}
        <g transform={`translate(${hipX} ${HIP_Y}) scale(${PERSO_SCALE})`}>
          <GeminiRig
            a={{ ...limb, hipX: 0, hipY: 0 }}
            face="neutral"
            faceView="profile"
            skinTone="#8B5A2B"
            clothesColor="#b5552f"
            pantsColor="#2F4F4F"
            hatType="scarf"
          />
        </g>

        {/* cabosse : suspendue a l'arbre ou en main (machine a etats simple, meme logique que
            ProtoGeminiTreeCueillette) — rendue APRES le personnage pour rester visible en main */}
        <ellipse cx={podX} cy={podY} rx={26} ry={20} fill="#4a2c14" stroke={INK} strokeWidth={3} />

        <text x={960} y={70} textAnchor="middle" fill={INK} fontFamily="Georgia, serif" fontSize={26} opacity={0.7}>
          {label}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
