/**
 * ProtoBack — PROTOTYPE ISOLE R&D (session 2026-07-01, piste A "8 directions", 2e des 3 vues du palier 1).
 * Vue de DOS : le personnage marche vers le FOND de la scene (s'eloigne de la camera).
 * ⛔ Ne touche PAS a StickRig.tsx / poses.ts — computePose() reste la SOURCE DE VERITE du TIMING.
 *
 * v2 (apres avis EXTERNES convergents Gemini 3.1 Pro + GPT-5.5, 2026-07-01) : le v1 REUTILISAIT la
 * mecanique de PROFIL (jambes qui s'ouvrent en angle sur l'axe X ecran) -> lisait comme un PAS CHASSE
 * LATERAL, pas une marche vers le fond (bug repere par Aziz). Les 2 modeles CONFIRMENT : c'est une
 * erreur de PROJECTION, pas un reglage a ajuster.
 *
 * REGLE FONDAMENTALE (convergente) :
 *  - PROFIL : le pas se lit sur l'axe X ecran (stride = angle d'ouverture lateral).
 *  - DOS (marche vers le fond, axe Z camera) : le pas doit se lire sur l'axe Y ecran (raccourci vertical/
 *    profondeur), PAS sur X. Pied qui avance vers le fond = MONTE a l'ecran (Y diminue). Pied qui recule/
 *    reste proche camera = DESCEND a l'ecran (Y augmente). X ecran = tres faible offset (largeur de piste
 *    ~0.12-0.20L + micro-sway), jamais un grand ecartement angulaire.
 *  - Angle lateral apparent hanche->pied : 0-10° max (au-dela de 15-20°, ca relit "pas chasse").
 *  - Genou : le vrai pli est presque invisible de dos (axe aligne camera) -> "tricher" avec un TRES leger
 *    decalage lateral du genou (side * ~0.03-0.04L) pendant le swing, mouvement principal reste en Y.
 *
 * ⚠️ Honnetete technique (les 2 modeles) : la vue de DOS PURE est l'une des vues les plus difficiles/
 * limitees en stick-figure 2D (meme les jeux video type Zelda/Pokemon trichent en 3/4-dos plutot que dos
 * pur). Ce proto reste donc plus SOBRE que le 3/4 (moins spectaculaire), a juger sur sa lisibilite reelle
 * en mouvement, pas sur un standard de marche laterale classique.
 *
 * Torse/tete/chapeau (deja valides visuellement en v1) inchanges : epaules > hanches, tete pleine sans
 * visage, chapeau vu par-dessus, ligne d'omoplates.
 *
 * Banc d'essai anime (pas une compo de prod) : marche en boucle, vue de dos fixe, jugee en MOUVEMENT.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { computePose, RIG } from "../rig/poses";

const INK = "#2b2117";
const PARCH = "#e8dcc0";
const STRAW = "#d1b46b";
const STRAW_D = "#c39a4f";

const SHOULDER_OFFSET_X = 24;
const SHOULDER_OFFSET_Y = 2;
const HIP_OFFSET_X = 13;
const HIP_OFFSET_Y = 1.5;

// ---- jambes : stride en Y (profondeur), PAS en X (regle GPT+Gemini) ----
const TRACK_WIDTH = 0.16;   // largeur de piste (ratio de LEG) : offset X FIXE, tres faible, PAS anime en angle
const LATERAL_SWAY = 0.035; // micro-sway lateral (ratio LEG), tres subtil
const DEPTH_AMP = 0.20;     // amplitude du mouvement de profondeur (ratio LEG) -> stride EN Y
const LIFT_AMP = 0.08;      // leve du pied pendant le swing (ratio LEG)
const KNEE_FLARE = 0.035;   // leger "triche" lateral du genou pendant le swing (ratio LEG)

export const PASSER_BACK_FRAMES = 180;

export const ProtoBack: React.FC = () => {
  const frame = useCurrentFrame();
  const { LEG, HEAD_R, ARM } = RIG;
  const W = 1920, H = 1080;
  const GROUND_Y = 700;
  const MAN_S = 1.4;

  const pose = computePose({ walkPhase: frame, moveAmt: 1, bend: 0 });
  const { phase, hipY: hipYBase, shY: shYBase } = pose;

  const shXNear = SHOULDER_OFFSET_X, shXFar = -SHOULDER_OFFSET_X;
  const shYNear = shYBase + SHOULDER_OFFSET_Y, shYFar = shYBase - SHOULDER_OFFSET_Y;
  const hipXNear = HIP_OFFSET_X, hipXFar = -HIP_OFFSET_X;
  const hipYNear = hipYBase + HIP_OFFSET_Y, hipYFar = hipYBase - HIP_OFFSET_Y;

  // ---- JAMBE DE DOS : formule GPT/Gemini — stride principal en Y, X quasi-fixe ----
  // side : +1 jambe "near/droite", -1 jambe "far/gauche". phaseOffset : les 2 jambes en opposition (PI).
  function legBackView(side: 1 | -1, phaseOffset: number, hipX: number, hipY: number) {
    const p = phase + phaseOffset;
    const advance = Math.sin(p);       // +1 = pied avant/fond (monte ecran), -1 = pied arriere/proche (descend ecran)
    const swing = Math.max(0, Math.cos(p)); // phase de swing (le pied est en l'air, revient vers l'avant)

    const trackX = hipX + side * TRACK_WIDTH * LEG * 0.5;
    const footX = trackX + side * LATERAL_SWAY * LEG * Math.sin(p) * 0.4;
    const footY = hipY + LEG * 0.5 - DEPTH_AMP * LEG * advance - LIFT_AMP * LEG * swing;

    const kneeX = (hipX + footX) / 2 + side * KNEE_FLARE * LEG * swing;
    const kneeY = (hipY + footY) / 2 - 0.06 * LEG * swing;

    let fy = footY;
    if (fy > 0) fy = 0; // FOOT-PLANT : jamais sous le sol
    return { kx: kneeX, ky: kneeY, fx: footX, fy };
  }
  const legNear = legBackView(1, 0, hipXNear, hipYNear);
  const legFar = legBackView(-1, Math.PI, hipXFar, hipYFar);

  // bras : balancier oppose aux jambes (leger, coherent avec le mouvement de profondeur — pas de grand angle X)
  const armSwing = (side: 1 | -1, phaseOffset: number) => Math.sin(phase + phaseOffset) * side * 6;
  const armNearHandX = shXNear + armSwing(1, Math.PI) ;
  const armNearHandY = shYNear + ARM;
  const armFarHandX = shXFar + armSwing(-1, 0);
  const armFarHandY = shYFar + ARM * 0.95;

  const neckX = (shXNear + shXFar) / 2;
  const neckY = (shYNear + shYFar) / 2;
  const headX = neckX;
  const headY = neckY - (HEAD_R + 14);

  const S = { stroke: INK, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  // ordre near/far par profondeur reelle (pied le plus bas ecran = le plus proche camera = dessine devant)
  const nearIsRight = legNear.fy >= legFar.fy;

  const FarLeg = () => (
    <path d={`M ${hipXFar} ${hipYFar} L ${legFar.kx} ${legFar.ky} L ${legFar.fx} ${legFar.fy}`} {...S} strokeWidth={9.5} opacity={0.85} />
  );
  const NearLeg = () => (
    <path d={`M ${hipXNear} ${hipYNear} L ${legNear.kx} ${legNear.ky} L ${legNear.fx} ${legNear.fy}`} {...S} strokeWidth={10.5} />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <path d={`M0 ${GROUND_Y - 4} H ${W}`} stroke={INK} strokeWidth={2.4} opacity={0.3} fill="none" />

        <g transform={`translate(${W / 2} ${GROUND_Y}) scale(${MAN_S})`} opacity={0.92}>
          {/* 1. bras far (leger balancier, pas de grand angle) */}
          <path d={`M ${shXFar} ${shYFar} L ${armFarHandX} ${armFarHandY}`} {...S} strokeWidth={8.5} opacity={0.85} />
          {/* 2. jambe la plus loin ecran = dessinee en premier (derriere) */}
          {nearIsRight ? <FarLeg /> : <NearLeg />}

          {/* 3. TORSE DE DOS : epaules nettement plus larges que hanches (signal du dos) */}
          <path
            d={`M ${hipXFar} ${hipYFar} L ${shXFar} ${shYFar} L ${shXNear} ${shYNear} L ${hipXNear} ${hipYNear} Z`}
            fill={PARCH} fillOpacity={0.94} stroke={INK} strokeWidth={4} strokeLinejoin="round"
          />
          <path d={`M ${shXFar + 6} ${shYFar + 14} Q ${neckX} ${neckY + 6} ${shXNear - 6} ${shYNear + 14}`} fill="none" stroke={INK} strokeWidth={2.5} opacity={0.35} />

          {/* 4. nuque + tete PLEINE (pas de visage), centree */}
          <line x1={neckX} y1={neckY} x2={headX} y2={headY} {...S} strokeWidth={11} />
          <circle cx={headX} cy={headY} r={HEAD_R} fill={INK} opacity={0.9} stroke={INK} strokeWidth={6} />
          <g transform={`translate(${headX} ${headY})`}>
            <ellipse cx={0} cy={-18} rx={48} ry={16} fill={STRAW} stroke={INK} strokeWidth={4} />
            <ellipse cx={0} cy={-22} rx={26} ry={12} fill={STRAW_D} stroke={INK} strokeWidth={3} />
          </g>

          {/* 5. jambe la plus proche ecran = dessinee par-dessus */}
          {nearIsRight ? <NearLeg /> : <FarLeg />}

          {/* 6. bras near */}
          <path d={`M ${shXNear} ${shYNear} L ${armNearHandX} ${armNearHandY}`} {...S} strokeWidth={9} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
