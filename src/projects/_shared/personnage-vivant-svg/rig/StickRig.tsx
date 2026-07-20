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
import { capsulePath, twoSegmentCapsulePath } from "./capsuleSegment";

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
  volumetric?: boolean;       // PROTOTYPE 2026-07-02 : jambes + bras avant en capsules tapered fermees
                               // (registre "planteur-cacao-charsheet-GPT.png") au lieu de lignes strokeWidth.
                               // Defaut false = rendu ligne d'origine, AUCUNE regression sur les scenes existantes.
  face?: "none" | "neutral" | "smile" | "serious" | "surprise" | "angry"; // TRIO MINIMUM (2026-07-03) : yeux-points + sourcil + bouche
  faceView?: "profile" | "3/4" | "front"; // profil=1 oeil (defaut), 3/4=2 yeux decales, front=2 yeux symetriques
  skinTone?: string;          // remplissage tete (defaut = pas de remplissage, cercle vide comme avant)
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
  volumetric = false,
  face = "none",
  faceView = "profile",
  skinTone,
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

  // ---- VOLUMETRIC (prototype) : coude explicite pour le bras avant (epaule -> coude -> main), meme angle
  // que le rendu ligne (frontRad implicite dans frontHandX/Y), coude a mi-chemin avec un leger flechissement.
  const armDx = faHandX - shX, armDy = faHandY - shY;
  const armMidX = shX + armDx * 0.5, armMidY = shY + armDy * 0.5;
  // flechissement perpendiculaire du coude (vers l'avant du corps, faible amplitude — coherent avec un bras qui pend/agit)
  const armLen = Math.sqrt(armDx * armDx + armDy * armDy) || 1;
  const armPerpX = -armDy / armLen, armPerpY = armDx / armLen;
  const elbowBend = faElbowX != null ? 0 : 6; // pas de flechissement si carry impose deja un coude explicite
  const vElbowX = faElbowX ?? armMidX + armPerpX * elbowBend;
  const vElbowY = faElbowY ?? armMidY + armPerpY * elbowBend;

  const S = { stroke: ink, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const SACK = "#7a5230", SACK_D = "#5e3d22";

  const isFrontalBody = faceView === "front" || faceView === "3/4";

  // --- FRONTAL BODY: torse face camera, bras sur les cotes, jambes symetriques ---
  const fShoulderHW = faceView === "front" ? 28 : 24;
  const fHipHW = faceView === "front" ? 16 : 14;
  const fNeckLen = HEAD_R + 14;
  const fTorsoLen = RIG.TORSO;
  const fShY = -RIG.HIP - fTorsoLen;
  const fHipY2 = -RIG.HIP;
  const fHeadY = fShY - fNeckLen;
  const fArmLen = RIG.ARM;
  const fLegLen = RIG.LEG;

  return (
    <g transform={`scale(${facing} 1)`} opacity={0.92}>
      {isFrontalBody ? (
        <>
          {/* JAMBES FRONTALES : V symetrique */}
          <path d={`M 0 ${fHipY2} L ${-fHipHW - 6} ${fHipY2 + fLegLen} L ${-fHipHW - 6 - 14} ${fHipY2 + fLegLen}`} {...S} strokeWidth={10} opacity={0.85} />
          <path d={`M 0 ${fHipY2} L ${fHipHW + 6} ${fHipY2 + fLegLen} L ${fHipHW + 6 + 14} ${fHipY2 + fLegLen}`} {...S} strokeWidth={10} />
          {/* BRAS FRONTAUX : tombent sur les cotes avec leger coude */}
          <path d={`M ${-fShoulderHW} ${fShY + 10} L ${-fShoulderHW - 14} ${fShY + fArmLen * 0.45} L ${-fShoulderHW - 8} ${fShY + fArmLen * 0.9}`} {...S} strokeWidth={9} opacity={0.85} />
          <path d={`M ${fShoulderHW} ${fShY + 10} L ${fShoulderHW + 14} ${fShY + fArmLen * 0.45} L ${fShoulderHW + 8} ${fShY + fArmLen * 0.9}`} {...S} strokeWidth={9} />
          {/* TORSE FRONTAL : trapeze large (epaules) -> etroit (hanches) */}
          <path
            d={`M ${-fHipHW} ${fHipY2} L ${-fShoulderHW} ${fShY} L ${fShoulderHW} ${fShY} L ${fHipHW} ${fHipY2} Z`}
            fill={tunicColor} stroke={ink} strokeWidth={4} strokeLinejoin="round"
          />
          {tunicPattern === "collar" && (
            <path d={`M ${-fShoulderHW + 4} ${fShY + 10} Q 0 ${fShY + 24} ${fShoulderHW - 4} ${fShY + 10}`} fill="none" stroke={ink} strokeWidth={2.5} opacity={0.5} />
          )}
          {tunicPattern === "stripes" && (
            <>
              <line x1={-8} y1={fShY + 6} x2={-6} y2={fHipY2 - 4} stroke={ink} strokeWidth={2} opacity={0.4} />
              <line x1={0} y1={fShY + 4} x2={0} y2={fHipY2 - 4} stroke={ink} strokeWidth={2} opacity={0.4} />
              <line x1={8} y1={fShY + 6} x2={6} y2={fHipY2 - 4} stroke={ink} strokeWidth={2} opacity={0.4} />
            </>
          )}
          {neckwear === "tie" && (
            <path d={`M ${-4} ${fShY + 4} L ${4} ${fShY + 4} L 0 ${fShY + 34} Z`} fill={neckwearColor} stroke={ink} strokeWidth={2.5} strokeLinejoin="round" />
          )}
          {neckwear === "scarf-knot" && (
            <g>
              <circle cx={0} cy={fShY + 8} r={9} fill={neckwearColor} stroke={ink} strokeWidth={2.5} />
              <path d={`M -4 ${fShY + 14} q -6 16 -2 26`} fill="none" stroke={neckwearColor} strokeWidth={6} strokeLinecap="round" />
            </g>
          )}
          {/* COU */}
          <line x1={0} y1={fShY} x2={0} y2={fHeadY + HEAD_R} {...S} strokeWidth={11} />
        </>
      ) : (
        <>
          {/* sac sur l'epaule : dessine DERRIERE le corps (avant le torse) pour qu'il soit "sur le dos/epaule" */}
          {carry === "shoulder-sack" && (
            <g transform={`translate(${shX - 6} ${shY - 6})`}>
              <ellipse cx={-22} cy={-26} rx={42} ry={50} fill={SACK} stroke={ink} strokeWidth={5} transform="rotate(-14 -22 -26)" />
              <path d="M -46 -52 q -8 -18 6 -30" fill="none" stroke={SACK_D} strokeWidth={5} strokeLinecap="round" />
              <line x1={-2} y1={-2} x2={-40} y2={-44} stroke={ink} strokeWidth={4} opacity={0.7} />
            </g>
          )}
          {volumetric ? (
            <g opacity={0.85}>
              <path d={twoSegmentCapsulePath({ x: hipX, y: hipY }, { x: legBack.kx, y: legBack.ky }, { x: legBack.fx, y: legBack.fy }, 20, 15, 11).upper} fill={tunicColor} stroke={ink} strokeWidth={3.5} />
              <path d={twoSegmentCapsulePath({ x: hipX, y: hipY }, { x: legBack.kx, y: legBack.ky }, { x: legBack.fx, y: legBack.fy }, 20, 15, 11).lower} fill={tunicColor} stroke={ink} strokeWidth={3.5} />
              <path d={capsulePath({ ax: legBack.fx, ay: legBack.fy, bx: legBack.toeX, by: legBack.fy, widthA: 13, widthB: 13 })} fill={tunicColor} stroke={ink} strokeWidth={3.5} />
            </g>
          ) : (
            <path d={`M ${hipX} ${hipY} L ${legBack.kx} ${legBack.ky} L ${legBack.fx} ${legBack.fy} L ${legBack.toeX} ${legBack.fy}`} {...S} strokeWidth={10} opacity={0.85} />
          )}
          <path d={`M ${shX} ${shY} L ${backHandX} ${backHandY}`} {...S} strokeWidth={9} opacity={0.85} />
          {/* TORSE-POLYGONE : trapeze opaque colorable (tunicColor), epaules plus larges que hanches */}
          <path
            d={`M ${hipBackX} ${hipBackY} L ${shBackX} ${shBackY} L ${shFrontX} ${shFrontY} L ${hipFrontX} ${hipFrontY} Z`}
            fill={tunicColor} stroke={ink} strokeWidth={4} strokeLinejoin="round"
          />
          {tunicPattern === "stripes" && Array.from({ length: 3 }, (_, i) => {
            const t = (i + 1) / 4;
            const x1 = hipBackX + (shBackX - hipBackX) * t, y1 = hipBackY + (shBackY - hipBackY) * t;
            const x2 = hipFrontX + (shFrontX - hipFrontX) * t, y2 = hipFrontY + (shFrontY - hipFrontY) * t;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth={2} opacity={0.4} />;
          })}
          {tunicPattern === "collar" && (
            <path d={`M ${shBackX} ${shBackY + 8} Q ${(shBackX + shFrontX) / 2} ${(shBackY + shFrontY) / 2 + 16} ${shFrontX} ${shFrontY + 8}`} fill="none" stroke={ink} strokeWidth={2.5} opacity={0.5} />
          )}
          {neckwear === "tie" && (
            <path d={`M ${shX - 4} ${shY + 4} L ${shX + 4} ${shY + 4} L ${shX} ${shY + 34} Z`} fill={neckwearColor} stroke={ink} strokeWidth={2.5} strokeLinejoin="round" />
          )}
          {neckwear === "scarf-knot" && (
            <g>
              <circle cx={shX} cy={shY + 8} r={9} fill={neckwearColor} stroke={ink} strokeWidth={2.5} />
              <path d={`M ${shX - 4} ${shY + 14} q -6 16 -2 26`} fill="none" stroke={neckwearColor} strokeWidth={6} strokeLinecap="round" />
            </g>
          )}
          {volumetric ? (
            <g>
              <path d={twoSegmentCapsulePath({ x: hipX, y: hipY }, { x: legFront.kx, y: legFront.ky }, { x: legFront.fx, y: legFront.fy }, 22, 16, 12).upper} fill={tunicColor} stroke={ink} strokeWidth={4} />
              <path d={twoSegmentCapsulePath({ x: hipX, y: hipY }, { x: legFront.kx, y: legFront.ky }, { x: legFront.fx, y: legFront.fy }, 22, 16, 12).lower} fill={tunicColor} stroke={ink} strokeWidth={4} />
              <path d={capsulePath({ ax: legFront.fx, ay: legFront.fy, bx: legFront.toeX, by: legFront.fy, widthA: 14, widthB: 14 })} fill={tunicColor} stroke={ink} strokeWidth={4} />
            </g>
          ) : (
            <path d={`M ${hipX} ${hipY} L ${legFront.kx} ${legFront.ky} L ${legFront.fx} ${legFront.fy} L ${legFront.toeX} ${legFront.fy}`} {...S} strokeWidth={11} />
          )}
          <line x1={shX} y1={shY} x2={headX} y2={headY} {...S} strokeWidth={11} />
        </>
      )}
      <circle cx={isFrontalBody ? 0 : headX} cy={isFrontalBody ? fHeadY : headY} r={HEAD_R} fill={skinTone || "none"} stroke={ink} strokeWidth={6} />
      {face !== "none" && (() => {
        const EYE_R = 3;
        const eyeY = -3;
        const browY = eyeY - 7;
        const mouthY = 10;
        const browAngle = face === "angry" ? 12 : face === "surprise" ? -8 : face === "serious" ? 4 : 0;
        const mouthW = face === "surprise" ? 0 : face === "smile" ? 6 : 4;
        const mouthOpen = face === "surprise";

        const isProfile = faceView === "profile";
        const isFront = faceView === "front";

        const eye1X = isProfile ? 8 * facing : isFront ? -8 : -6;
        const eye2X = isProfile ? null : isFront ? 8 : 12;
        const mouthCenterX = isProfile ? 8 * facing - 2 * facing : isFront ? 0 : 3;

        return (
          <g transform={`translate(${isFrontalBody ? 0 : headX} ${isFrontalBody ? fHeadY : headY}) rotate(${isFrontalBody ? 0 : neckDeg * 0.6})`}>
            <circle cx={eye1X} cy={eyeY} r={EYE_R} fill={ink} />
            {eye2X != null && <circle cx={eye2X} cy={eyeY} r={EYE_R} fill={ink} />}
            <line
              x1={eye1X - 5} y1={browY + browAngle * 0.3}
              x2={eye1X + 5} y2={browY - browAngle * 0.3}
              stroke={ink} strokeWidth={2.5} strokeLinecap="round"
            />
            {eye2X != null && (
              <line
                x1={eye2X - 5} y1={browY + browAngle * 0.3}
                x2={eye2X + 5} y2={browY - browAngle * 0.3}
                stroke={ink} strokeWidth={2.5} strokeLinecap="round"
              />
            )}
            {mouthOpen
              ? <ellipse cx={mouthCenterX} cy={mouthY} rx={4} ry={5} fill={ink} />
              : <path
                  d={`M ${mouthCenterX - mouthW} ${mouthY} q ${mouthW} ${face === "smile" ? 5 : face === "serious" ? -1 : 2} ${mouthW * 2} 0`}
                  fill="none" stroke={ink} strokeWidth={2.5} strokeLinecap="round"
                />
            }
          </g>
        );
      })()}
      {hat === "straw" && (
        <g transform={`translate(${isFrontalBody ? 0 : headX} ${isFrontalBody ? fHeadY : headY}) rotate(${isFrontalBody ? 0 : neckDeg * 0.6})`}>
          <ellipse cx={0} cy={-20} rx={50} ry={13} fill={STRAW} stroke={ink} strokeWidth={4} />
          <path d="M -28 -22 C -20 -46 20 -46 28 -22 Z" fill={STRAW_D} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
        </g>
      )}
      {hat === "cap" && (
        <g transform={`translate(${isFrontalBody ? 0 : headX} ${isFrontalBody ? fHeadY : headY}) rotate(${isFrontalBody ? 0 : neckDeg * 0.6})`}>
          <path d="M -26 -16 A 26 26 0 0 1 26 -16 Z" fill={CAP} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
          {!isFrontalBody && <path d="M 22 -14 L 50 -10 L 48 -4 L 20 -8 Z" fill={CAP_D} stroke={ink} strokeWidth={3.5} strokeLinejoin="round" />}
        </g>
      )}
      {hat === "scarf" && (
        <g transform={`translate(${isFrontalBody ? 0 : headX} ${isFrontalBody ? fHeadY : headY}) rotate(${isFrontalBody ? 0 : neckDeg * 0.6})`}>
          <path d="M -26 -10 A 26 24 0 0 1 26 -10 Z" fill={SCARF} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
          {!isFrontalBody && <path d={`M -22 -10 q -18 ${6 + Math.sin(walkPhase / 5) * 4} -30 2`} fill="none" stroke={SCARF} strokeWidth={6} strokeLinecap="round" />}
        </g>
      )}
      {/* bras avant (profil only — le frontal dessine ses propres bras) */}
      {!isFrontalBody && (volumetric ? (
        <g>
          <path d={capsulePath({ ax: shX, ay: shY, bx: vElbowX, by: vElbowY, widthA: 18, widthB: 13 })} fill={tunicColor} stroke={ink} strokeWidth={3.5} />
          <path d={capsulePath({ ax: vElbowX, ay: vElbowY, bx: faHandX, by: faHandY, widthA: 13, widthB: 10 })} fill={tunicColor} stroke={ink} strokeWidth={3.5} />
        </g>
      ) : (
        <path d={frontArmPath} {...S} strokeWidth={9} />
      ))}
      {/* panier a la main : accroche a la main avant (profil only) */}
      {!isFrontalBody && carry === "hand-basket" && (
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
