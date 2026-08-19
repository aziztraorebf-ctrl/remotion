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
import {
  Figure,
  Membre,
  solveArm,
  rad,
  TORSO_LENGTH,
  HIP_Y_STANDING,
  LEG_LENGTH,
  BRAS_L,
  AVBRAS_L,
  walkPhaseFromSteps,
} from "../../_shared/stick-figure-svg/StickFigure";
import { PersonnageRole, CARNATIONS } from "../../_shared/stick-figure-svg/identite/Roles";

/**
 * "LE DEPART" — SCENE A du test A/B (2026-07-27)
 *
 * LE PARTAGE TESTE ICI : le MODELE dessine le DECOR VIDE (gareRoutiereGroups.ts, par Fable 5,
 * agent, 0 API), NOUS posons et animons les personnages avec notre socle + nos roles/tenues.
 * C'est le partage qui a fonctionne sur le village. La scene B (GarePersoParModele16x9) teste
 * l'inverse — un personnage dessine par le modele — pour trancher par la preuve.
 *
 * LE RECIT : une commercante confie un ballot a un porteur, qui le charge dans le car ; puis
 * elle monte, il reste. Le lieu (gare routiere a l'aube) raconte deja le depart ; les
 * personnages n'ont qu'a l'habiter.
 *
 * ⭐ TOUT EST REUTILISE, RIEN DE NEUF :
 *  - le decor : les 6 plans en parallaxe, verifies au rendu AVANT d'y poser quiconque
 *    (lecon de la peche : ne jamais heriter d'un decor non eprouve).
 *  - la marche : verrou pas/distance du socle (brique 1) — c'est le pas qui produit le
 *    deplacement. Corrige apres le retour d'Aziz sur le faux demi-tour en scaleX(-1).
 *  - l'asymetrie : trait/encre/posture (vague D) pour differencier les deux personnages.
 *  - les tenues : PersonnageRole (commercante) et carnations distinctes.
 *
 * ⛔ Registre : profil uniquement, aucun visage, frame-driven pur.
 */

export const GARE_DEPART_FRAMES = 660; // 22s @ 30fps

const W = 1920;
const H = 1080;
const INK = "#2b2117";

// ⭐ LA BANDE LIBRE du decor (contrat declare par le fichier de plans) : rien n'y est dessine.
// Les personnages se posent DEDANS — on prend le bas de la bande comme ligne de sol.
const SOL_Y = 966;

const smooth = (t: number) => t * t * (3 - 2 * t);

// ⛔ 12e PIEGE — LA PARALLAXE QUI "MORPHE" (repere par Aziz : « il semble avoir un leger
// mouvement lateral de la camera, donc le decor semble bouger, morpher un peu »).
// Cause : chaque plan derivait a sa propre vitesse. C'est JUSTE pour le village (la camera
// glisse VRAIMENT le long de la plage) mais FAUX ici : la camera est FIXE, les personnages
// se deplacent DANS le cadre. Des plans qui glissent les uns par rapport aux autres sous
// une camera immobile ne se lisent pas comme de la profondeur — ils se lisent comme un
// decor qui se deforme.
// ⭐ REGLE : la parallaxe est le mouvement de la CAMERA, pas une decoration. Camera fixe =
// PAS de parallaxe. On ne la reactive que si la camera suit reellement un personnage.
const derive = (_frame: number, _v: number) => 0;

// ===========================================================================
// LA MARCHE — verrou pas/distance (brique 1 du socle)
// ===========================================================================
const SWING = 19;
const PAS_L = 2 * LEG_LENGTH * Math.sin(rad(SWING)); // unites locales par pas

// ===========================================================================
// LE BALLOT — l'objet transmis. Machine a etats : chez ELLE -> en transit ->
// sur SON epaule a LUI -> sur la galerie du car. Jamais duplique, jamais
// "ne dans" un contenant (lecon du filet de la peche).
// ===========================================================================
type Porteur = "elle" | "transit" | "lui" | "galerie";

const T = {
  // il vient vers elle
  marcheIn0: 40, marcheIn1: 165,
  // la remise du ballot (les 2 mains au meme point : relais invisible)
  tendre0: 175, tendre1: 235,
  // il porte le ballot jusqu'au car
  marcheCar0: 250, marcheCar1: 390,
  // il le hisse sur la galerie
  hisse0: 400, hisse1: 470,
  // elle monte dans le car, il reste
  elleMonte0: 485, elleMonte1: 600,
};

const ballotChez = (f: number): Porteur => {
  if (f < T.tendre0) return "elle";
  if (f < T.tendre1) return "transit";
  if (f < T.hisse1) return "lui";
  return "galerie";
};

// ===========================================================================
// POSITIONS (en unites locales du personnage, x croissant vers la droite)
// ===========================================================================
// ⛔ 13e PIEGE — L'ECHANGE A SENS UNIQUE (repere par Aziz : « l'objet flotte des mains de la
// femme pour aller dans les mains de l'autre. Ce n'est pas comme si la femme se retournait et
// lui tendait l'objet »). Mesure : le ballot traversait son corps sur 121px et ELLE ne faisait
// AUCUN geste — je n'avais anime qu'un seul cote de l'echange.
// ⭐ REGLE : un echange se joue A DEUX. Celui qui donne TEND le bras (pose manuelle cote
// donneur), celui qui recoit tend le sien, et l'objet est en lerp(mainA, mainB) — la bascule
// se fait quand les deux mains sont au MEME point (brique 3 du socle). Sinon l'objet "vole".
// -> Et il faut qu'ils se FASSENT FACE : il arrive par la DROITE (elle lui tend vers la
//    droite), pas par derriere elle.
// ⚠️ Ecart mesure : a 44 unites, les DEUX bras sont a 0.992 de tension (butee 0.97) car chacun
// doit couvrir la moitie. A 34, chacun tend a ~0.79 : marge confortable, l'echange est credible.
const X_ELLE = -32;       // elle attend, cote gauche
const X_LUI_DEPART = 116; // il arrive de la DROITE du cadre (il vient vers elle)
const X_LUI_ECHANGE = 8;  // il s'arrete FACE a elle, a portee de bras
const X_CAR = 74;         // l'arriere du car, ou il charge (a droite)
const X_RENCONTRE = (X_ELLE + X_LUI_ECHANGE) / 2; // ou les 2 mains se rejoignent

const PERSO_SCALE = 2.75;

// ---------------------------------------------------------------------------
// LE PORTEUR — c'est lui qui fait le geste. Socle importe + bras en IK.
// ---------------------------------------------------------------------------
type EtatLui = {
  posX: number;
  marche: boolean;
  pas: number;
  torsoDeg: number;
  hipY: number;
  hipDrop: number;   // charge portee — le socle l'applique AUSSI en marche (contrairement a hipY)
  versGauche: boolean; // sens de deplacement : il arrive de la droite, repart vers la droite
  legFront: number; legBack: number;
  kneeFront: number; kneeBack: number;
  mainX: number; mainY: number;   // la main qui prend / porte / hisse
  faceGauche: boolean;
};

const lui = (f: number): EtatLui => {
  const base: EtatLui = {
    posX: X_LUI_ECHANGE, marche: false, pas: 0,
    torsoDeg: 4, hipY: HIP_Y_STANDING, hipDrop: 0, versGauche: false,
    legFront: 12, legBack: -14, kneeFront: 0, kneeBack: 0,
    // 10/-32 et non 12/-30 : mesure de tension = 0.970, pile au seuil de butee IK (0.97).
    // On garde une marge — un bras en butee glisse et tremble (regle du socle).
    mainX: 10, mainY: -32, faceGauche: false,
  };

  // 1. il arrive de la gauche, en marchant vers elle
  if (f < T.marcheIn1) {
    const t = smooth(interpolate(f, [T.marcheIn0, T.marcheIn1], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }));
    const dist = Math.abs(X_LUI_ECHANGE - X_LUI_DEPART);
    const nbPas = dist / PAS_L;
    const pas = nbPas * t;
    return {
      ...base,
      posX: X_LUI_DEPART - pas * PAS_L,   // il vient de la droite -> il avance vers la gauche
      marche: true,
      pas,
      torsoDeg: 6,
      versGauche: true,
    };
  }

  // 2. il tend les bras et recoit le ballot
  // ⚠️ Il reste TOURNE VERS ELLE (versGauche) pendant tout l'echange : sinon il lui tourne
  // le dos au moment ou il recoit l'objet (bug vu au rendu v3).
  if (f < T.tendre1) {
    const t = smooth(interpolate(f, [T.tendre0, T.tendre1], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }));
    return {
      ...base,
      // il tend le bras vers elle (main au point de rencontre), PUIS cale le ballot sur
      // son epaule. 2 temps dans la meme phase : recevoir (t<0.5) puis charger (t>0.5).
      mainX: t < 0.5 ? 17 - 4 * (t / 0.5) : 13 - 3 * ((t - 0.5) / 0.5),
      mainY: t < 0.5 ? -34 : -34 - 18 * ((t - 0.5) / 0.5),
      torsoDeg: 4 + 6 * t,
      hipY: HIP_Y_STANDING + 3 * t,
      kneeFront: 4 * t,
      versGauche: true,
    };
  }

  // 3. il porte le ballot jusqu'au car — la charge se VOIT dans la posture
  if (f < T.marcheCar1) {
    const t = smooth(interpolate(f, [T.marcheCar0, T.marcheCar1], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }));
    const dist = Math.abs(X_CAR - X_LUI_ECHANGE);
    const nbPas = dist / PAS_L;
    const pas = nbPas * t;
    return {
      ...base,
      posX: X_LUI_ECHANGE + pas * PAS_L,   // vers la droite, jusqu'au car
      marche: true,
      pas,
      // ⛔ 14e PIEGE — LE SAUT VERTICAL (repere par Aziz : « quand il fait son mouvement pour
      // porter l'objet jusqu'a sa tete, le personnage semble decale, il semble disparaitre et
      // reapparaitre un peu plus bas »). CAUSE MESUREE : en pose MANUELLE le socle utilise le
      // `hipY` fourni ; EN MARCHE il l'IGNORE et recalcule HIP - bob + hipDrop. Passer de l'un
      // a l'autre faisait sauter la hanche de 3 unites = 8px ecran, d'un coup.
      // ⭐ FIX : en marche, on n'impose JAMAIS hipY — on passe la charge par `hipDrop`, le
      // parametre que le socle attend justement pour ca (et qui, bonus, raccourcit les pas
      // tout seul : il ralentit sous la charge sans qu'on regle une vitesse).
      torsoDeg: 13,
      hipDrop: 3,
      mainX: 10, mainY: -52,   // main qui maintient le ballot sur l'epaule
    };
  }

  // 4. il hisse le ballot sur la galerie du car
  if (f < T.hisse1) {
    const t = smooth(interpolate(f, [T.hisse0, T.hisse1], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }));
    return {
      ...base,
      posX: X_CAR,
      torsoDeg: 13 - 20 * t,          // il se cambre en arriere pour pousser vers le haut
      hipY: HIP_Y_STANDING + 3 - 5 * t,
      kneeFront: 6 - 6 * t,
      mainX: 10 + 4 * t,
      mainY: -52 - 26 * t,            // la main monte : le ballot part vers la galerie
    };
  }

  // 5. il reste, et regarde le car partir (immobile habite : il ne suit PAS du regard)
  const t = smooth(interpolate(f, [T.hisse1, T.hisse1 + 60], [0, 1], { extrapolateRight: "clamp" }));
  return {
    ...base,
    posX: X_CAR,
    torsoDeg: 4 + 4 * t,   // il se redresse puis se relache un peu
    mainX: 12, mainY: -30,
  };
};

// position du ballot EN MONDE (unites locales de la scene)
// ⭐ LA MAIN D'ELLE — elle DONNE, donc elle a un vrai geste (c'etait le bug : elle ne
// bougeait pas et l'objet volait tout seul). Sa main part du repos et va au point de
// rencontre, ou celle du porteur la rejoint.
const mainElle = (f: number): { x: number; y: number } => {
  const REPOS = { x: 16, y: -34 };
  const TENDU = { x: X_RENCONTRE - X_ELLE, y: -34 };
  if (f < T.tendre0 - 30) return REPOS;
  // elle tend AVANT qu'il n'arrive (elle l'a vu venir), et garde le bras tendu le temps
  // de l'echange, puis le ramene.
  if (f < T.tendre1) {
    const t = smooth(interpolate(f, [T.tendre0 - 30, T.tendre0 + 20], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }));
    return { x: REPOS.x + (TENDU.x - REPOS.x) * t, y: REPOS.y + (TENDU.y - REPOS.y) * t };
  }
  const t = smooth(interpolate(f, [T.tendre1, T.tendre1 + 40], [0, 1], { extrapolateRight: "clamp" }));
  return { x: TENDU.x + (REPOS.x - TENDU.x) * t, y: TENDU.y + (REPOS.y - TENDU.y) * t };
};

const ballotPos = (f: number): { x: number; y: number; scale: number } => {
  const etat = ballotChez(f);
  const l = lui(f);
  const me = mainElle(f);
  if (etat === "elle") return { x: X_ELLE + me.x, y: me.y, scale: 1 };
  if (etat === "transit") {
    // ⭐ RELAIS INVISIBLE (brique 3 du socle) : le ballot n'est JAMAIS reparente d'un
    // personnage a l'autre (ca produit un saut). Sa position est interpolee entre les
    // deux mains, et la bascule se fait pendant qu'elles sont au meme point.
    const t = smooth(interpolate(f, [T.tendre0, T.tendre1], [0, 1], { extrapolateRight: "clamp" }));
    const from = { x: X_ELLE + me.x, y: me.y };
    // il est RETOURNE (il regarde vers la gauche), donc sa main locale se projette en -mainX
    const to = { x: l.posX - l.mainX, y: l.mainY - 6 };
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t, scale: 1 };
  }
  // ⛔ 15e PIEGE — L'OBJET PORTE QUI SE DETACHE (vu au rendu v3 : le ballot flottait au-dessus
  // de sa tete pendant qu'il marchait vers le car). CAUSE : sa position etait calculee sur un
  // `mainY` FIXE, alors que le corps MONTE ET DESCEND (bob de marche). Le corps oscillait,
  // l'objet non — donc il se decollait a chaque foulee.
  // ⭐ REGLE GENERALE (3e verification ce soir, apres le bras du pecheur et la mesure du
  // marche) : TOUT CE QUI EST TENU DOIT SUIVRE LE BOB. Un objet porte n'a pas de position
  // propre — il a la position d'une PARTIE DU CORPS.
  if (etat === "lui") {
    const bob = l.marche ? Math.abs(Math.cos(walkPhaseFromSteps(l.pas) * Math.PI * 2)) * 2.5 : 0;
    // ⚠️ -14 et non -6 : a -6 le ballot etait plaque au niveau du COU (vu au rendu v6). Un
    // ballot porte repose SUR l'epaule, au-dessus de la ligne des epaules. Et scale 1.45 :
    // a taille 1 il ne se lisait pas comme une CHARGE (sous-dimensionnement, biais recurrent
    // deja grave dans WARMAP-GRAMMAIRE).
    // ⚠️ ANCRE SUR L'EPAULE, PAS SUR LA MAIN. Mesure du bug v7 : ancre sur la main, le ballot
    // tombait a 2.9 unites du centre de la tete (rayon 9) -> il l'ENCERCLAIT. Un ballot porte
    // repose sur l'epaule, en ARRIERE du cou. On recalcule donc l'epaule ici (meme formule que
    // le socle) et on decale de -6 en x (vers l'arriere) / -8 en y (au-dessus de l'epaule).
    const shx = Math.sin(rad(l.torsoDeg)) * TORSO_LENGTH;
    const shy = HIP_Y_STANDING + l.hipDrop - Math.cos(rad(l.torsoDeg)) * TORSO_LENGTH;
    const bx = shx - 6;
    return {
      x: l.posX + (l.versGauche ? -bx : bx),
      y: shy - 8 - bob,
      scale: 1.45,
    };
  }
  // sur la galerie : il y reste, immobile, le car ne bouge pas encore
  return { x: X_CAR + 14, y: -80, scale: 1 };
};

const Ballot: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M -11 -7 Q 0 -11 11 -7 L 12 6 Q 0 10 -12 6 Z" fill="#b9a884" stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
    <path d="M -11 -1 L 12 -1" stroke={INK} strokeWidth={1.1} opacity={0.7} />
    <path d="M 0 -9 L 0 8" stroke={INK} strokeWidth={1.1} opacity={0.7} />
  </g>
);

// ---------------------------------------------------------------------------
export const GareDepart16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const l = lui(frame);
  const b = ballotPos(frame);

  // ELLE : attend, tend le ballot, puis monte dans le car (elle sort du cadre par la droite)
  const elleMonte = smooth(interpolate(frame, [T.elleMonte0, T.elleMonte1], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  }));
  const elleNbPas = Math.abs(X_CAR - 10 - X_ELLE) / PAS_L;
  const ellePas = elleNbPas * elleMonte;
  const elleX = X_ELLE + ellePas * PAS_L;
  // ⛔ 11e PIEGE — LA GLISSADE, reperee a l'oeil par Aziz : « le personnage feminin glisse,
  // parfois marche, parfois glisse ». Mesuree ensuite : aux extremites du smooth, x variait
  // encore (t=0.00023 -> x bouge) alors que le drapeau `marche` etait deja FAUX, donc les
  // jambes etaient figees par une pose manuelle pendant que le corps se deplacait.
  // ⛔ CAUSE DE FOND : avoir un ETAT "marche" separe de la position est une bequille. Un
  // personnage ne peut pas "se deplacer sans marcher" — c'est precisement ce que le verrou
  // pas/distance interdit. On SUPPRIME le seuil : la phase derive TOUJOURS du nombre de pas,
  // donc les jambes suivent le deplacement par construction, a toutes les vitesses, y compris
  // quasi nulles. A l'arret complet, pas = constante -> phase constante -> jambes immobiles,
  // automatiquement et sans cas particulier.
  const elleImmobile = elleMonte <= 0 || elleMonte >= 1;
  const mElle = mainElle(frame);
  // elle disparait dans le car a la fin (elle est montee)
  const elleOpacity = interpolate(frame, [T.elleMonte1 - 24, T.elleMonte1], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // le bras du porteur (IK vers la main qui tient/hisse)
  const phaseL = l.marche ? walkPhaseFromSteps(l.pas) : 0;
  const bobL = l.marche ? Math.abs(Math.cos(phaseL * Math.PI * 2)) * 2.5 : 0;
  const hipL = l.marche ? HIP_Y_STANDING - bobL + l.hipDrop : l.hipY;
  const sxL = Math.sin(rad(l.torsoDeg)) * TORSO_LENGTH;
  const syL = hipL - Math.cos(rad(l.torsoDeg)) * TORSO_LENGTH;
  const mainYL = l.marche ? l.mainY - bobL : l.mainY;
  const armL = solveArm(sxL, syL, l.mainX, mainYL, 1);

  return (
    <AbsoluteFill style={{ backgroundColor: "#e8dcc0" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />

        {/* ===== LE DECOR (6 plans en parallaxe, dessine par Fable 5) ===== */}
        <g transform={`translate(${derive(frame, 0.04)} 0)`} dangerouslySetInnerHTML={{ __html: PLAN_CIEL }} />
        <g transform={`translate(${derive(frame, 0.13)} 0)`} dangerouslySetInnerHTML={{ __html: PLAN_LOINTAIN }} />
        <g transform={`translate(${derive(frame, 0.28)} 0)`} dangerouslySetInnerHTML={{ __html: PLAN_BATIMENTS }} />
        <g transform={`translate(${derive(frame, 0.45)} 0)`} dangerouslySetInnerHTML={{ __html: PLAN_VEHICULES }} />
        <g transform={`translate(${derive(frame, 0.62)} 0)`} dangerouslySetInnerHTML={{ __html: PLAN_SOL }} />

        {/* ===== LES PERSONNAGES — DANS la bande libre, entre le sol et l'avant-plan =====
            Leur place dans la pile est ce qui les integre : devant le sol et les vehicules,
            DERRIERE les ballots du premier plan. */}
        <g transform={`translate(${W / 2} ${SOL_Y}) scale(${PERSO_SCALE})`}>
          {/* ombres portees — chacune suit son personnage */}
          <ellipse cx={l.posX} cy={1} rx={17} ry={2.6} fill={INK} opacity={0.15} />
          <ellipse cx={elleX} cy={1} rx={16} ry={2.4} fill={INK} opacity={0.15 * elleOpacity} />

          {/* ELLE — la commercante (tenue + objet du registre identite, carnation distincte) */}
          <g opacity={elleOpacity}>
            <PersonnageRole
              x={elleX} y={0}
              // la phase derive TOUJOURS des pas — jamais de drapeau "marche"
              phase={walkPhaseFromSteps(ellePas)}
              scale={1}
              role="commercante"
              couleur={CARNATIONS[3].couleur}
              p={{ swingMax: SWING, bobAmp: elleImmobile ? 0 : 2.5, armSwing: elleImmobile ? 0 : 20 }}
              // ⛔ AUCUNE pose manuelle de jambe : elles doivent rester pilotees par la phase,
              // sinon on retombe sur la glissade. Seul le buste est impose.
              pose={{
                torsoDeg: elleImmobile ? 3 : 5,
                // ⭐ sa main TEND le ballot : hand1 est une cible monde, le bras s'y resout.
                // C'est ce qui manquait — sans ca elle restait bras ballants et l'objet volait.
                ...(elleImmobile ? { hand1: [mElle.x, mElle.y] as [number, number] } : {}),
              }}
              avecObjet={false}
            />
          </g>

          {/* LUI — le porteur. Carnation differente + trait plus epais (asymetrie vague D :
              ce n'est pas "deux bonshommes identiques"). */}
          {/* ⛔ 16e PIEGE — L'OBJET PORTE QUI MASQUE LA TETE (vu au rendu v5 : le ballot
              effaçait le visage et le haut du corps du porteur). Ce n'etait PAS un probleme de
              position (mesure : 8px d'ecart seulement avec l'epaule) mais d'ORDRE DE RENDU :
              le ballot etait monte APRES tout le personnage, donc par-dessus.
              ⭐ REGLE : un objet porte SUR L'EPAULE passe DERRIERE la tete (c'est l'anatomie —
              la charge repose en arriere du cou). Un objet TENU A DEUX MAINS devant soi passe
              DEVANT. L'ordre depend donc de l'etat de l'objet, pas d'une position fixe. */}
          {ballotChez(frame) === "lui" && <Ballot x={b.x} y={b.y} scale={b.scale} />}

          <g transform={`translate(${l.posX} 0) scale(${l.versGauche ? -1 : 1} 1)`}>
            <Figure
              x={0} y={0}
              phase={phaseL}
              // ⛔ hipDrop (et JAMAIS hipY) porte la charge en marche : le socle ignore hipY
              // des qu'il anime la marche -> sinon saut vertical de 8px (bug vecu).
              p={l.marche ? { swingMax: SWING, bobAmp: 2.5, armSwing: 18, hipDrop: l.hipDrop } : undefined}
              hideArm1
              color={CARNATIONS[1].couleur}
              // ⛔ EN MARCHE : aucune pose de jambe (elles suivent la phase, sinon glissade).
              // A L'ARRET : la phase est constante, donc les jambes sont naturellement
              // immobiles — on peut imposer une pose de travail sans risque.
              pose={
                l.marche
                  ? { torsoDeg: l.torsoDeg }
                  : {
                      hipY: l.hipY,
                      torsoDeg: l.torsoDeg,
                      leg1Deg: l.legFront,
                      leg2Deg: l.legBack,
                      leg1Knee: l.kneeFront,
                      leg2Knee: l.kneeBack,
                      arm2Deg: 0,
                      arm2Len: 0.001,
                    }
              }
            />
            <Membre
              ax={sxL} ay={syL} bx={armL.ex} by={armL.ey} cx={armL.hx} cy={armL.hy}
              w={4.4} color={CARNATIONS[1].couleur}
            />
          </g>

          {/* LE BALLOT quand il n'est PAS sur l'epaule (chez elle, en transit entre les deux
              mains, ou pose sur la galerie) : il passe DEVANT, car il est tenu ou pose. */}
          {ballotChez(frame) !== "lui" && <Ballot x={b.x} y={b.y} scale={b.scale} />}
        </g>

        {/* ===== PREMIER PLAN — passe DEVANT les personnages (profondeur reelle) ===== */}
        <g transform={`translate(${derive(frame, 0.95)} 0)`} dangerouslySetInnerHTML={{ __html: PLAN_AVANT }} />
      </svg>
    </AbsoluteFill>
  );
};

export default GareDepart16x9;
