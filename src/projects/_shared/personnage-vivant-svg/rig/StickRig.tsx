/**
 * StickRig — personnage d'encre GENERIQUE anime par code (R&D validee 2026-06-30, prouve sur le cacao).
 * Doc complete : ../PERSONNAGE-VIVANT-INDEX.md
 *
 * Stick figure SIMPLE (lignes droites, registre pictogramme digne) dont l'ANIMATION est correcte :
 *  - MARCHE sans glissé (foot-plant : pied au sol clampe, ne descend pas sous y=0).
 *  - PENCHE sans bascule-arriere (compensation du bassin : recule + descend — voir poses.ts).
 *  - BRAS qui descend vers le SOL en recolte (armReach).
 *
 * ⛔ GARDE-FOU (doctrine SVG) : silhouette stylisee, JAMAIS un humain detaille/realiste. Segments DROITS.
 * ⛔ REMOTION : zero logique de frame ici. Le parent passe walkPhase (la frame) + bend/armReach/moving.
 *
 * GENERIQUE : le chapeau est une OPTION (hat) et l'encre est parametrable (ink). Un futur perso
 * (mineur, pecheur, ouvrier) reutilise le MEME rig en changeant l'accessoire/la couleur.
 *
 * TORSE-POLYGONE (2026-07-01, valide Aziz, promu standard) : ne au chantier "8 directions" (le trait
 * simple hanche->epaule etait illisible en 3/4/dos, il fallait un vrai trapeze opaque comme masque de
 * profondeur). Aziz prefere ce design MEME en profil : le tronc visible et colorable (`tunicColor`)
 * donne un 3e axe de differenciation des persos (en plus de `ink`=trait et `hat`=tete) — boubou, cravate,
 * vetement... Devient le design PAR DEFAUT sur toutes les vues, remplace la ligne simple d'origine.
 */
import React from "react";
import { computePose, RIG } from "./poses";

const DEFAULT_INK = "#2b2117";
const DEFAULT_TUNIC = "#e8dcc0"; // parchemin — neutre, coherent avec le fond par defaut
const STRAW = "#d1b46b";
const STRAW_D = "#c39a4f";
const CAP = "#5e7245";   // casquette vert-feuille (registre GGW)
const CAP_D = "#4a5c37";
const SCARF = "#b5552f"; // foulard terre-cuite
const SCARF_DEFAULT = "#8a3a2e"; // couleur par defaut cravate/foulard de cou (distinct du foulard de tete)

export type StickRigProps = {
  walkPhase?: number;
  moving?: boolean;
  moveAmt?: number;            // 0..1 amplitude continue du pas (remplace moving, evite l'arret brutal — voir poses.ts)
  bend?: number;
  armReach?: number;
  offerReach?: number;        // 0..1 bras tendu a l'HORIZONTALE (offrir/tendre un objet a qqn en face)
  facing?: 1 | -1;
  ink?: string;               // couleur du trait d'encre (defaut charte)
  tunicColor?: string;        // couleur de remplissage du TORSE (boubou/vetement) — defaut = parchemin (neutre)
  tunicPattern?: "none" | "stripes" | "collar"; // motif textile sur le torse (rayures verticales / bordure de col)
  neckwear?: "none" | "tie" | "scarf-knot";     // accessoire au COU (cravate triangle / foulard noue) — distinct de hat
  neckwearColor?: string;     // couleur de l'accessoire de cou — defaut terre-cuite (charte)
  hat?: "straw" | "cap" | "scarf" | "none"; // accessoire tete (straw=paille, cap=casquette, scarf=foulard)
  carry?: "none" | "shoulder-sack" | "hand-basket"; // charge portee (defaut none)
  load?: number;              // 0..1 intensite du poids (courbe le bras de port + main fermee)
};

export const StickRig: React.FC<StickRigProps> = ({
  walkPhase = 0,
  moving = true,
  moveAmt,
  bend = 0,
  armReach = 0,
  offerReach = 0,
  facing = 1,
  ink = DEFAULT_INK,
  tunicColor = DEFAULT_TUNIC,
  tunicPattern = "none",
  neckwear = "none",
  neckwearColor = SCARF_DEFAULT,
  hat = "straw",
  carry = "none",
  load = 0,
}) => {
  const { LEG, HEAD_R, ARM } = RIG;
  const pose = computePose({ walkPhase, moving, moveAmt, bend, armReach, offerReach });
  const { be, phase, swingDeg, hipX, hipY, torsoDeg, shX, shY, frontHandX, frontHandY } = pose;
  const m = Math.max(0, Math.min(1, moveAmt ?? (moving ? 1 : 0)));

  // ---- TORSE-POLYGONE (standard 2026-07-01) : trapeze de largeur autour de l'axe hanche->epaule.
  // Profil = un seul plan (pas de near/far comme en 3/4/dos) : la largeur est perpendiculaire a l'axe
  // du torse, projetee sur X (le rig est vu de cote, l'epaisseur du corps se lit en profondeur d'ecran
  // -> on la simule par une largeur constante de part et d'autre de l'axe, epaules > hanches).
  const torsoRad = (torsoDeg * Math.PI) / 180;
  const perpX = Math.cos(torsoRad), perpY = Math.sin(torsoRad); // perpendiculaire a l'axe hanche->epaule
  const SHOULDER_HALF_W = 16, HIP_HALF_W = 11;
  const shFrontX = shX + perpX * SHOULDER_HALF_W, shFrontY = shY - perpY * SHOULDER_HALF_W;
  const shBackX = shX - perpX * SHOULDER_HALF_W, shBackY = shY + perpY * SHOULDER_HALF_W;
  const hipFrontX = hipX + perpX * HIP_HALF_W, hipFrontY = hipY - perpY * HIP_HALF_W;
  const hipBackX = hipX - perpX * HIP_HALF_W, hipBackY = hipY + perpY * HIP_HALF_W;

  // ---- JAMBES (foot-plant : le pied ne descend jamais sous le sol y=0) ----
  const kneeBend = Math.max(0, Math.cos(phase)) * 14 * m + be * 30;
  function legPath(sign: 1 | -1) {
    const hipAngle = sign * swingDeg - be * 6 * sign;
    const rad = (hipAngle * Math.PI) / 180;
    const kx = hipX + Math.sin(rad) * (LEG * 0.5);
    const ky = hipY + Math.cos(rad) * (LEG * 0.5);
    const shinRad = ((hipAngle - sign * kneeBend) * Math.PI) / 180;
    const fx = kx + Math.sin(shinRad) * (LEG * 0.5);
    let fy = ky + Math.cos(shinRad) * (LEG * 0.5);
    if (fy > 0) fy = 0; // FOOT-PLANT : clamp au sol
    const toeX = fx + 16;
    return { kx, ky, fx, fy, toeX };
  }
  const legFront = legPath(1);
  const legBack = legPath(-1);

  // tete + cou (leger redressement de la nuque au penche)
  const neckDeg = torsoDeg - be * 12;
  const neckRad = (neckDeg * Math.PI) / 180;
  const headX = shX + Math.sin(neckRad) * (HEAD_R + 14);
  const headY = shY - Math.cos(neckRad) * (HEAD_R + 14);

  // bras arriere (balancier oppose)
  const backArmDeg = -swingDeg * 0.6 + torsoDeg * 0.5;
  const backRad = (backArmDeg * Math.PI) / 180;
  const backHandX = shX + Math.sin(backRad) * ARM;
  const backHandY = shY + Math.cos(backRad) * ARM;

  // ---- BRAS AVANT selon le port de charge ----
  // none/recolte : pose calculee (frontHand). shoulder-sack : la main monte tenir la sangle a l'epaule.
  // hand-basket : la main pend vers le BAS le long du corps (panier accroche, balance leger a la marche).
  let faHandX = frontHandX, faHandY = frontHandY, faElbowX: number | null = null, faElbowY: number | null = null;
  if (carry === "shoulder-sack") {
    // main remonte pres de l'epaule (coude plie), tient la sangle
    faElbowX = shX + 26; faElbowY = shY + 30;
    faHandX = shX + 14; faHandY = shY - 16;
  } else if (carry === "hand-basket") {
    // bras le long du corps, main en bas (leger balancier amorti par le poids)
    const swingLoad = swingDeg * 0.25 * (1 - load); // le poids amortit le balancier
    const a = (swingLoad + 6) * Math.PI / 180;
    faHandX = shX + Math.sin(a) * (ARM + 6);
    faHandY = shY + Math.cos(a) * (ARM + 6);
  }
  const frontArmPath = faElbowX != null
    ? `M ${shX} ${shY} L ${faElbowX} ${faElbowY} L ${faHandX} ${faHandY}`
    : `M ${shX} ${shY} L ${faHandX} ${faHandY}`;

  const S = { stroke: ink, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const SACK = "#7a5230", SACK_D = "#5e3d22";

  return (
    <g transform={`scale(${facing} 1)`} opacity={0.92}>
      {/* sac sur l'epaule : dessine DERRIERE le corps (avant le torse) pour qu'il soit "sur le dos/epaule" */}
      {carry === "shoulder-sack" && (
        <g transform={`translate(${shX - 6} ${shY - 6})`}>
          <ellipse cx={-22} cy={-26} rx={42} ry={50} fill={SACK} stroke={ink} strokeWidth={5} transform="rotate(-14 -22 -26)" />
          <path d="M -46 -52 q -8 -18 6 -30" fill="none" stroke={SACK_D} strokeWidth={5} strokeLinecap="round" />
          <line x1={-2} y1={-2} x2={-40} y2={-44} stroke={ink} strokeWidth={4} opacity={0.7} />
        </g>
      )}
      <path d={`M ${hipX} ${hipY} L ${legBack.kx} ${legBack.ky} L ${legBack.fx} ${legBack.fy} L ${legBack.toeX} ${legBack.fy}`} {...S} strokeWidth={10} opacity={0.85} />
      <path d={`M ${shX} ${shY} L ${backHandX} ${backHandY}`} {...S} strokeWidth={9} opacity={0.85} />
      {/* TORSE-POLYGONE : trapeze opaque colorable (tunicColor), epaules plus larges que hanches */}
      <path
        d={`M ${hipBackX} ${hipBackY} L ${shBackX} ${shBackY} L ${shFrontX} ${shFrontY} L ${hipFrontX} ${hipFrontY} Z`}
        fill={tunicColor} stroke={ink} strokeWidth={4} strokeLinejoin="round"
      />
      {/* motif textile : rayures verticales (interpolees lineairement le long du trapeze, suivent le penche) */}
      {tunicPattern === "stripes" && Array.from({ length: 3 }, (_, i) => {
        const t = (i + 1) / 4; // 0.25/0.5/0.75 -> repartition entre hipBack->shBack et hipFront->shFront
        const x1 = hipBackX + (shBackX - hipBackX) * t, y1 = hipBackY + (shBackY - hipBackY) * t;
        const x2 = hipFrontX + (shFrontX - hipFrontX) * t, y2 = hipFrontY + (shFrontY - hipFrontY) * t;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth={2} opacity={0.4} />;
      })}
      {/* motif textile : bordure de col (petit trait courbe sous les epaules, registre boubou/chemise) */}
      {tunicPattern === "collar" && (
        <path d={`M ${shBackX} ${shBackY + 8} Q ${(shBackX + shFrontX) / 2} ${(shBackY + shFrontY) / 2 + 16} ${shFrontX} ${shFrontY + 8}`} fill="none" stroke={ink} strokeWidth={2.5} opacity={0.5} />
      )}
      {/* accessoire COU : cravate (triangle qui pend du cou vers le torse) ou foulard noue */}
      {neckwear === "tie" && (
        <path d={`M ${shX - 4} ${shY + 4} L ${shX + 4} ${shY + 4} L ${shX} ${shY + 34} Z`} fill={neckwearColor} stroke={ink} strokeWidth={2.5} strokeLinejoin="round" />
      )}
      {neckwear === "scarf-knot" && (
        <g>
          <circle cx={shX} cy={shY + 8} r={9} fill={neckwearColor} stroke={ink} strokeWidth={2.5} />
          <path d={`M ${shX - 4} ${shY + 14} q -6 16 -2 26`} fill="none" stroke={neckwearColor} strokeWidth={6} strokeLinecap="round" />
        </g>
      )}
      <path d={`M ${hipX} ${hipY} L ${legFront.kx} ${legFront.ky} L ${legFront.fx} ${legFront.fy} L ${legFront.toeX} ${legFront.fy}`} {...S} strokeWidth={11} />
      <line x1={shX} y1={shY} x2={headX} y2={headY} {...S} strokeWidth={11} />
      <circle cx={headX} cy={headY} r={HEAD_R} fill="none" stroke={ink} strokeWidth={6} />
      {hat === "straw" && (
        <g transform={`translate(${headX} ${headY}) rotate(${neckDeg * 0.6})`}>
          <ellipse cx={0} cy={-20} rx={50} ry={13} fill={STRAW} stroke={ink} strokeWidth={4} />
          <path d="M -28 -22 C -20 -46 20 -46 28 -22 Z" fill={STRAW_D} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
        </g>
      )}
      {hat === "cap" && (
        // casquette : calotte + visiere (vers l'avant = sens facing, le scale parent gere le miroir)
        <g transform={`translate(${headX} ${headY}) rotate(${neckDeg * 0.6})`}>
          <path d="M -26 -16 A 26 26 0 0 1 26 -16 Z" fill={CAP} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
          <path d="M 22 -14 L 50 -10 L 48 -4 L 20 -8 Z" fill={CAP_D} stroke={ink} strokeWidth={3.5} strokeLinejoin="round" />
        </g>
      )}
      {hat === "scarf" && (
        // foulard noue sur la tete (calotte + petit pan qui flotte a l'arriere)
        <g transform={`translate(${headX} ${headY}) rotate(${neckDeg * 0.6})`}>
          <path d="M -26 -10 A 26 24 0 0 1 26 -10 Z" fill={SCARF} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
          <path d={`M -22 -10 q -18 ${6 + Math.sin(walkPhase / 5) * 4} -30 2`} fill="none" stroke={SCARF} strokeWidth={6} strokeLinecap="round" />
        </g>
      )}
      {/* bras avant */}
      <path d={frontArmPath} {...S} strokeWidth={9} />
      {/* panier a la main : accroche a la main avant */}
      {carry === "hand-basket" && (
        <g transform={`translate(${faHandX} ${faHandY + 4})`}>
          <path d="M -26 0 L 26 0 L 20 34 L -20 34 Z" fill={SACK} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
          <path d="M -26 0 q 26 -22 52 0" fill="none" stroke={ink} strokeWidth={4} />
          {/* feves dans le panier */}
          <ellipse cx={-8} cy={6} rx={6} ry={9} fill={POD_IN_BASKET} stroke={ink} strokeWidth={2} />
          <ellipse cx={8} cy={5} rx={6} ry={9} fill={POD_IN_BASKET} stroke={ink} strokeWidth={2} />
        </g>
      )}
    </g>
  );
};

const POD_IN_BASKET = "#a26432";
