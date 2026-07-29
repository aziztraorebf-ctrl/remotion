// =============================================================================================
// ⭐ TEST — LE PERSONNAGE RICHE DANS LE ROLE DEMONSTRATIF (2026-07-29)
//
// LA QUESTION (posee par Aziz) : un personnage HABILLE (PersonnageRole du socle : tenue,
// carnation, coiffe) tient-il le role demonstratif aussi bien que la stick figure nue ?
//
// ⛔ VARIABLE UNIQUE : seul LE CORPS change. Meme voix, memes timings issus du forced-align,
// meme charge, meme cadrage, meme sol. On remplace <Figure> par <PersonnageRole role="commercante">.
// Si le resultat differe, c'est l'APPARENCE du personnage qui l'explique — rien d'autre.
//
// ⚠️ L'ENJEU N'EST PAS TECHNIQUE, IL EST NARRATIF : le porteur fonctionne parce qu'il est
// ANONYME. C'est n'importe qui, donc c'est un pays, une economie. Un personnage identifiable
// devient QUELQU'UN — une histoire individuelle peut AFFAIBLIR une demonstration macro (on suit
// une personne au lieu de comprendre un mecanisme), ou au contraire l'INCARNER. Non mesure.
//
// ⚠️ Rappel du dossier : "le personnage complet anime est ECARTE en prod (pantin bien anime)" —
// mais cette conclusion ne valait QUE pour le personnage riche d'alors, PAS pour la stick figure
// de profil, et n'a jamais ete retestee depuis que le socle a muri. Ce test la reouvre.
//
// avecObjet={false} : le role "commercante" tient normalement un panier ; ici le personnage porte
// NOTRE sac (la charge qui grossit), donc on desactive l'objet du role pour ne pas en avoir deux.
//
// --- en-tete de la version stick figure, conserve ---
//
// ⭐⭐ LE PORTEUR NARRE — LA 1re SCENE OU LES GESTES SONT DERIVES DE LA VOIX (2026-07-29)
//
// PORTAGE de PorteurCharge16x9 (valide par Aziz le meme jour). ⛔ VARIABLE UNIQUE : seule la
// SOURCE DES TIMINGS change. Codes a la main -> derives du forced-align. Le personnage, la
// charge, la mecanique du corps, le verrou pas/distance, le cadrage : tout est identique.
//
// LA QUESTION QUE CETTE SCENE POSE (non mesuree avant aujourd'hui) : le geste et la voix se
// RENFORCENT-ils, ou se GENENT-ils ? Un corps qui bouge pendant qu'une voix parle peut tres bien
// DIVISER l'attention au lieu de l'additionner. On ne le saura qu'en regardant ET en ecoutant.
//
// AVANT : il s'arretait a la frame 570 parce que quelqu'un avait ecrit "19 secondes".
// APRES : il s'arrete a la frame 652 parce que la voix dit "on ne peut plus AVANCER du tout".
// Tous les reperes viennent de porteurNarreTiming.ts (forced-align, 66 mots, loss 0.099).
//
// --- en-tete d'origine, conserve tel quel ---
//
// ⭐ LE PORTEUR — la 1re scene DEMONSTRATIVE ou le personnage AGIT (2026-07-29)
//
// POURQUOI CETTE SCENE : le funambule (CfaActe4Filet16x9) prouve un personnage qui SUBIT — il
// marche, il vacille, il est rattrape. L'ACTION au service d'un argument n'avait jamais ete
// prouvee dans le regime demonstratif. C'est le trou identifie par
// memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md § "CE QUI RESTE A PROUVER".
//
// L'ARGUMENT (une seule metaphore, tenue de bout en bout) :
//   UN HOMME PORTE UNE CHARGE QUI GROSSIT PENDANT QU'IL MARCHE. LUI NE CHANGE PAS.
// C'est le ratio dette/capacite — pas le montant. Le corps DIT le rapport sans qu'aucun chiffre
// ne soit affiche : il ploie, son pas raccourcit, il s'arrete. La charge, elle, n'a jamais cesse
// de grossir. Test decisif (principe n.1) : si on retire le porteur, il ne reste qu'un sac qui
// gonfle — AUCUNE demonstration. La scene passe.
//
// ⛔ LES 7 PRINCIPES DU FUNAMBULE, APPLIQUES ICI :
//  1. le personnage EST l'argument (le ratio est dans son corps, pas dans un graphe a cote)
//  2. UNE seule metaphore : la charge qui grossit. Zero idee annexe.
//  3. arc complet : il avance librement -> il peine -> il ploie -> il s'arrete. AVANT et APRES.
//  4. la mecanique du corps porte l'argument : lean/hipDrop/swingMax disent l'effort
//  5. AUCUNE CONCURRENCE VISUELLE — verdict des 2 manches du test decor (2026-07-29) :
//     ABSENCE > PARTICIPANT > INERTE, et un decor ne se justifie que s'il porte une information
//     que les elements principaux ne portent pas deja. Ici la metaphore est complete (le corps,
//     la charge, le sol) -> AUCUN decor. Juste une ligne de sol.
//  6. l'echelle porte l'enjeu : le personnage est petit dans un cadre large, la charge finit par
//     faire presque sa taille. C'est le RAPPORT des deux qui se lit, pas leur taille absolue.
//  7. l'animation se dimensionne sur ce qu'il y a a demontrer : marcher + ployer + s'arreter.
//     Rien de plus. Le socle fait ces 3 choses depuis la vague A.
//
// ⭐⭐ LE VERROU PAS/DISTANCE (regle non negociable du registre) :
// x derive du nombre de PAS via walkDistance(), JAMAIS l'inverse. Le pas raccourcit quand la
// charge grossit (swingMax baisse) -> la distance parcourue par pas diminue MECANIQUEMENT ->
// le ralentissement est REEL, pas simule par une courbe d'easing plaquee sur x. C'est ce qui
// rend l'effort credible : les pieds ne glissent jamais.
//
// ⚠️ BUG CONNU DU SOCLE (non corrige, cf. NEXT-ACTION) : BRAS_LAG est exporte et documente mais
// <Figure> ne l'applique pas -> pose degeneree ~9% du cycle. PARADE COTE APPELANT ici : on ne
// laisse jamais la phase de marche s'immobiliser sur une valeur quelconque. A l'arret final, la
// pose est FORCEE explicitement (Pose), la phase de marche n'est plus lue.
//
// NO EMOJIS. Accents francais obligatoires dans les strings AFFICHEES.
// =============================================================================================
import React from "react";
import { AbsoluteFill, Audio, useCurrentFrame, interpolate, staticFile } from "remotion";
import {
  MOTS,
  FIN_VO,
  PORTEUR_NARRE_FRAMES,
  ENTREE,
  CHARGE_ACCEL,
  SUBIT,
  PAS_COURT,
  ARRET_DEBUT,
  ARRET_FIN,
} from "./porteurNarreTiming";
import {
  // Figure remplacee par PersonnageRole dans cette variante
  walkDistance,
  walkPhaseFromSteps,
  ENCRE,
  NUIT,
  NUIT2,
  OR_CLAIR,
  CUIVRE,
  type WalkParams,
  type Pose,
} from "../../_shared/stick-figure-svg/StickFigure";
// ⛔ NE JAMAIS recalculer la geometrie du corps a la main pour poser un objet : bodyPoints() est
// LA source de verite (memes formules et memes constantes que <Figure>), donc l'objet colle au
// corps frame pour frame, bob compris. Cf. l'en-tete de habillage.ts (cout reel de l'oubli).
import { bodyPoints } from "../../_shared/stick-figure-svg/habillage";
// ⭐ LA BRIQUE D'HABILLAGE EXISTE — ne JAMAIS improviser un vetement (l'oubli a coute 3 tentatives
// + 1 agent delegue le 2026-07-28, cf. l'en-tete de habillage.ts).
import { PersonnageRole } from "../../_shared/stick-figure-svg/identite/Roles";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ================== GEOMETRIE ==================
const SOL_Y = 760;          // la ligne de sol
// ⭐ SCALE ET DEPART CALCULES, PAS REGLES A L'OEIL : l'integration donne un parcours de 1661px
// pour scale=3.2 -> depart 130, arret a ~1791 dans un cadre de 1920. Il TRAVERSE le cadre et
// s'arrete avant d'atteindre l'autre bord — le deplacement raconte donc quelque chose en soi.
// (1re valeur essayee : scale 2.6 -> perso de 155px, trop petit dans un cadre vide, corrige au rendu.)
// Le RAPPORT charge/corps est inchange par le scale (le sac est dans le repere local) : le
// principe n.6 (l'echelle porte l'enjeu) porte sur ce rapport, pas sur la taille absolue.
// ⚠️ RECALCULE POUR LA VERSION NARREE : les courbes de charge/swing sont articulees sur les MOTS,
// donc le parcours differe de la version a timings manuels. Mesure : scale 3.2 -> il ne faisait
// que 1436px et s'arretait aux 2/3 du cadre. scale 3.8 -> il finit a ~1700 dans un cadre de 1920.
// (Et le personnage est plus grand, ce qui sert la lecture — retour d'Aziz sur le "gros plan".)
const PERSO_SCALE = 3.8;    // le squelette fait ~60 unites locales -> ~228px a l'ecran
const PERSO_X0 = 90;        // point de depart (parcours ~1610px -> arret a ~1700)

// ================== TIMINGS — TOUS DERIVES DU FORCED-ALIGN ==================
// ⛔ Aucune valeur choisie ici : elles viennent toutes de porteurNarreTiming.ts, lui-meme produit
// par scripts/tools/forced-align.py sur la narration reelle. Voir l'en-tete de ce fichier-la.
export { PORTEUR_NARRE_FRAMES as PORTEUR_RICHE_FRAMES };

// rampe en FRAMES (et non plus en secondes) — les reperes sont des frames de mots
const rampF = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], clamp);

// ================== LA CHARGE ==================
// Elle grossit de facon MONOTONE et ne s'arrete jamais — c'est tout l'argument. Meme quand il
// s'arrete de marcher, elle continue. Croissance qui s'accelere legerement (la dette compose).
// ⭐ LA COURBE EST MAINTENANT ARTICULEE SUR LES MOTS, plus sur une seule rampe :
//   entree -> "grossit"  : croissance lente (la dette est "un outil", elle ne pese pas encore)
//   "grossit" -> "stagnent" : elle s'accelere (les interets ne s'arretent jamais)
//   "stagnent" -> fin    : elle continue, et le corps ne compense plus
// La charge ne s'arrete JAMAIS de croitre — y compris apres l'arret du personnage. C'est
// l'argument meme : lui s'arrete, elle non.
const chargeAt = (f: number): number => {
  const c1 = rampF(f, ENTREE, CHARGE_ACCEL, 0, 0.22);        // lente
  const c2 = rampF(f, CHARGE_ACCEL, SUBIT, 0, 0.38);         // elle s'emballe
  const c3 = rampF(f, SUBIT, FIN_VO + 48, 0, 0.40);          // et ne s'arrete pas
  return Math.min(1, c1 + c2 + c3);
};

// ⭐⭐ LE PAS RACCOURCIT SUR LE MOT "raccourcit" (frame 475), pas graduellement avec la charge.
// C'est LE point du test : le geste ne suit plus une courbe physique, il repond a un mot.
// Il reste une degradation de fond liee a la charge (sinon le pas serait constant puis casserait
// d'un coup, ce qui serait faux), mais la CHUTE FRANCHE tombe sur le mot.
// ⛔ SOURCE UNIQUE : la boucle d'integration ET l'affichage appellent CETTE fonction. Deux
// formules qui divergeraient d'un demi-degre feraient GLISSER les pieds.
const swingAt = (f: number): number => {
  const c = chargeAt(f);
  const deFond = interpolate(c, [0, 0.35, 0.75, 1], [17, 15.5, 13, 11], clamp);
  const surLeMot = interpolate(f, [PAS_COURT, PAS_COURT + 34], [0, 4.6], clamp); // -4.6deg en ~1.1s
  return Math.max(7, deFond - surLeMot);
};

// ================== LE SAC PORTE A L'EPAULE ==================
// Ancre sur l'epaule du porteur (bp fourni par l'appelant). Il grossit vers le HAUT et vers
// l'ARRIERE : un sac qui grossit vers le bas traverserait le corps.
// ⚠️ Lecon gravee (STICK-FIGURE-INDEX) : l'objet ne doit pas "popper" ni changer de taille par
// saut — la croissance est continue, derivee de `charge`.
const Sac: React.FC<{ sx: number; sy: number; charge: number }> = ({ sx, sy, charge }) => {
  // ⛔ BUG CORRIGE AU 1er RENDU (2026-07-29) : un sac ancre en `y = sy - h` grandit VERS LE HAUT
  // sans limite -> a pleine charge il montait au-dessus de l'epaule et MASQUAIT LA TETE. Or la
  // tete est ce qui fait lire "un homme" ; la cacher casse la scene.
  // Le sac repose donc SUR l'epaule (son bas reste a hauteur d'epaule) et grossit surtout vers
  // l'ARRIERE et vers le BAS-arriere — comme une vraie charge dorsale. Le haut ne depasse jamais
  // l'epaule de plus de HAUT_MAX.
  const HAUT_MAX = 9;                       // debord vertical max au-dessus de l'epaule
  const w = 8 + charge * 30;                // il s'etale surtout en largeur (vers l'arriere)
  const h = 7 + charge * 26;
  const haut = Math.min(h * 0.45, HAUT_MAX); // ce qui depasse au-dessus de l'epaule
  // ⛔ 2e CORRECTION AU RENDU : colle a l'axe (x = sx - w - 1.5), le sac RECOUVRAIT LE BUSTE des
  // qu'il grossissait — on ne voyait plus qu'une tete et des jambes. Le buste (hanche->epaule)
  // est ce qui fait lire la POSTURE, donc l'effort : le masquer supprime l'argument.
  // ECART franc vers l'arriere : le sac est porte DERRIERE le dos, il ne touche l'axe qu'a
  // charge nulle. L'ecart croit avec la charge (une grosse charge se porte plus en arriere).
  const ecart = 4 + charge * 7;
  const x = sx - w - ecart;
  const y = sy - haut;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2.2}
        fill={CUIVRE} opacity={0.55 + 0.35 * charge}
        stroke={OR_CLAIR} strokeWidth={1.1} />
      {/* la sangle : du haut-arriere du sac, elle passe PAR-DESSUS l'epaule et redescend devant.
          Elle s'epaissit avec la charge (elle se tend). C'est elle qui dit que le sac est PORTE
          et non pose : sans sangle, une masse flottante derriere le dos. */}
      <line x1={x + w * 0.62} y1={y} x2={sx + 1.2} y2={sy + 4}
        stroke={OR_CLAIR} strokeWidth={0.9 + charge * 1.1} opacity={0.8} />
    </g>
  );
};

export const PorteurRiche16x9: React.FC = () => {
  const frame = useCurrentFrame();

  const op = interpolate(frame, [0, 12, PORTEUR_NARRE_FRAMES - 16, PORTEUR_NARRE_FRAMES],
    [0, 1, 1, 0], clamp);

  const charge = chargeAt(frame);

  // ===== LE CORPS ENCAISSE — c'est ici que l'argument se joue =====
  // La charge grossit lineairement ; le corps, lui, a des limites. Les 3 parametres du socle
  // qui disent l'effort :
  //   swingMax : le pas RACCOURCIT (17deg ample -> 7deg traine). Plancher a 7 : en dessous, le
  //              ciseau disparait et le perso GLISSE (regle dure du socle).
  //   lean     : le buste penche en avant pour contrebalancer la masse a l'epaule
  //   hipDrop  : la hanche s'abaisse — il s'ecrase sous la charge
  const swingMax = swingAt(frame); // meme fonction que la boucle d'integration (source unique)

  // ⛔ PLAFOND SUR LE LEAN (corrige au 1er rendu du porteur) : a 23deg, le buste incline + le sac
  // derriere se superposaient — le personnage se lisait comme "une tete et des jambes". 14deg
  // suffit a dire l'effort et garde le corps LISIBLE. Un parametre d'effort pousse a fond degrade
  // la lecture avant d'ajouter du sens.
  // ⭐ "stagnent" (frame 414) : le corps CESSE DE COMPENSER. Avant ce mot il tient la charge ;
  // apres, il la subit — l'inclinaison prend un supplement franc.
  const leanDeFond = interpolate(charge, [0, 0.3, 0.7, 1], [2, 5, 8, 10], clamp);
  const leanSubit = rampF(frame, SUBIT, SUBIT + 45, 0, 4);
  const lean = leanDeFond + leanSubit;
  const hipDrop = interpolate(charge, [0, 0.4, 1], [0, 2.5, 6], clamp)
    + rampF(frame, SUBIT, SUBIT + 45, 0, 1.2);
  const armSwing = interpolate(charge, [0, 1], [22, 9], clamp); // le bras libre bat moins

  // ===== LA CADENCE — il ralentit AUSSI en frequence =====
  // pas/seconde : allure normale ~1.9 -> traine ~0.75. Combine au pas plus court, la vitesse
  // au sol chute fortement. On INTEGRE la cadence pour obtenir le nombre de pas cumules : c'est
  // la seule facon d'avoir un ralentissement continu sans jamais casser le verrou pas/distance.
  // ⭐ L'ARRET tombe sur "avancer" (frame 652). Amorce ~0.8s AVANT le mot pour que l'immobilite
  // soit ACQUISE quand le mot tombe : un arret qui commence sur le mot se lit en retard.
  const arretT = rampF(frame, ARRET_DEBUT, ARRET_FIN, 1, 0); // 1 = il marche, 0 = arrete

  // ⭐⭐ LE VERROU PAS/DISTANCE — INTEGRATION INCREMENTALE, PAS UN PRODUIT GLOBAL.
  //
  // ⛔ BUG ATTRAPE PAR LE CALCUL (avant tout rendu, 2026-07-29) : appliquer walkDistance(pasTotal,
  // swingCourant) applique la longueur de pas COURANTE a TOUS les pas deja faits. Quand le pas
  // raccourcit (c'est tout le sujet de la scene), les 29 pas deja poses sont retroactivement
  // raccourcis -> x DIMINUE -> le personnage RECULE de 430px sur la fin. Physiquement faux : un
  // pas deja pose ne se raccourcit pas apres coup.
  //
  // La distance doit s'integrer pas par pas, CHACUN avec la longueur qu'il avait AU MOMENT ou il
  // a ete fait. walkDistance() reste la source de verite : on l'appelle sur le DELTA de chaque
  // frame (dPas), avec le swing de cette frame-la.
  // ⛔ swingAt() est LA source unique : la boucle d'integration et l'affichage DOIVENT utiliser
  // exactement la meme formule. Deux formules qui divergent d'un demi-degre = les pieds glissent
  // (le corps avance d'une distance qui ne correspond pas a l'ouverture de son ciseau).
  const { pasCumules, dist } = React.useMemo(() => {
    let pas = 0;
    let d = 0;
    for (let f = 0; f <= frame; f++) {
      if (f < ENTREE) continue;
      const c = chargeAt(f);
      const cadence = interpolate(c, [0, 0.5, 1], [1.9, 1.35, 0.75], clamp);
      const stop = interpolate(f, [ARRET_DEBUT, ARRET_FIN], [1, 0], clamp);
      const dPas = (cadence * stop) / FPS;
      pas += dPas;
      d += walkDistance(dPas, swingAt(f), PERSO_SCALE); // la longueur du pas AU MOMENT du pas
    }
    return { pasCumules: pas, dist: d };
  }, [frame]);

  const x = PERSO_X0 + dist;
  const phase = walkPhaseFromSteps(pasCumules);

  // ===== L'ARRET FINAL : pose FORCEE (parade au bug BRAS_LAG) =====
  // Une fois arrete, on ne lit plus la phase de marche : on impose une pose explicite (jambes
  // ecartees en appui, buste penche, bras libre pendant). Sans ca, la phase se figerait sur une
  // valeur quelconque — potentiellement la pose degeneree (jambes superposees).
  const estArrete = arretT < 0.02;

  // souffle a l'arret : le buste monte/descend legerement (il respire sous la charge)
  const souffle = estArrete ? Math.sin((frame - ARRET_FIN) / 7) * 1.1 : 0;

  // tremblement d'effort quand la charge devient tres lourde
  const tremble = charge > 0.72
    ? Math.sin(frame * 2.7) * (charge - 0.72) * 3.4
    : 0;

  const walkP: Partial<WalkParams> = {
    swingMax,
    lean: lean + souffle,
    hipDrop,
    armSwing,
    bobAmp: interpolate(charge, [0, 1], [2.5, 1.2], clamp), // moins de rebond = plus lourd
  };

  // ⭐ L'ARRET FINAL : pose FORCEE (parade au bug BRAS_LAG du socle).
  // Une fois arrete, on ne lit plus la phase de marche : on impose une pose explicite (jambes
  // ecartees en appui, buste penche). Sans ca, la phase se figerait sur une valeur quelconque —
  // potentiellement la pose degeneree (jambes superposees), exactement le defaut observe a
  // t~15s sur le funambule pendant son arret "stable".
  const poseArret: Pose | undefined = estArrete
    ? { leg1Deg: 13, leg2Deg: -11, torsoDeg: lean + souffle + 4, arm1Deg: 10, arm2Deg: -7 }
    : undefined;

  // ⭐ ANCRE DE L'EPAULE via bodyPoints() — la source de verite du socle, jamais un calcul maison.
  // On lui passe EXACTEMENT les memes params que <Figure> pour que le sac colle au corps, bob
  // compris. torsoOverride quand la pose d'arret force l'angle du buste.
  const bp = bodyPoints(phase, walkP, poseArret ? poseArret.torsoDeg : undefined);

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 45%, ${NUIT} 0%, ${NUIT2} 100%)`,
      opacity: op,
    }}>
      <Audio src={staticFile("_rnd/porteur-narre/narration.mp3")} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {/* ===== LE SOL — une simple ligne. Aucun decor (verdict des 2 manches du 2026-07-29). ===== */}
        <line x1={0} y1={SOL_Y} x2={W} y2={SOL_Y} stroke={ENCRE} strokeWidth={2} opacity={0.5} />

        {/* ===== LE PORTEUR + SA CHARGE =====
             ⛔ ORDRE ARRIERE -> AVANT (regle 1 de habillage.ts) : le sac est porte DANS LE DOS
             (il deborde derriere l'epaule), donc il se dessine AVANT la Figure — sinon il
             recouvrirait le buste et le bras, et se lirait comme une masse posee par-dessus le
             personnage au lieu d'etre portee par lui.
             Le sac est dans le MEME repere local que la Figure (translate + scale identiques),
             donc les coordonnees de bodyPoints() s'y appliquent directement. */}
        <g transform={`translate(${x + tremble} ${SOL_Y}) scale(${PERSO_SCALE})`}>
          <Sac sx={bp.sx} sy={bp.sy} charge={charge} />
        </g>
        {/* ⭐ LE SEUL CHANGEMENT DU TEST : <Figure> (stick figure nue) remplacee par
             <PersonnageRole> (corps du socle + tenue + carnation + coiffe). Memes x/y/phase/p/pose
             /scale — la brique applique EXACTEMENT la meme geometrie de corps, donc la marche, le
             verrou pas/distance et l'ancrage du sac sont rigoureusement inchanges. */}
        <PersonnageRole
          x={x + tremble}
          y={SOL_Y}
          phase={phase}
          p={walkP}
          pose={poseArret}
          couleur={ENCRE}
          scale={PERSO_SCALE}
          role="commercante"
          avecObjet={false}
        />
      </svg>
    </AbsoluteFill>
  );
};

export default PorteurRiche16x9;
