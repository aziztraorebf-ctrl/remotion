// ============================================================================================
// ENCHAINEMENT DE GESTES EXPRESSIFS — 2e CAS D'USAGE DE L'HERITAGE DE POSE (2026-08-03)
// ============================================================================================
//
// POURQUOI CE FICHIER EXISTE : la brique n°7 de STICK-FIGURE-INDEX.md ("continuite de pose aux
// jonctions par HERITAGE, jamais par fondu") est prouvee sur UN SEUL enchainement — marche /
// arret / pousser / marche / assis (EnchainementGestesValides.tsx). Un cas unique ne dit pas si
// la methode est generale ou si elle epousait les particularites de cet enchainement-la. Ce
// fichier est le 2e cas d'usage, VOLONTAIREMENT DIFFERENT sur les 3 axes qui pouvaient porter le
// doute :
//   · GESTES EXPRESSIFS et non de locomotion (pas de deplacement : x est constant)
//   · AUCUN OBJET manipule (le premier reposait beaucoup sur la caisse, cible de main explicite)
//   · CHANGEMENT D'ETAT EMOTIONNEL (alerte -> peur -> reddition -> effondrement) et non
//     d'activite physique
//
// ⛔ CE N'EST PAS UNE GENERALISATION. Decision d'Aziz (2026-08-03) explicitement respectee ici :
// on NE construit PAS de fonction/hook generique "heritage de pose". 2 cas ne suffisent pas a
// fixer la forme d'une abstraction — c'est l'erreur du prototype du sac (poses inventees,
// generalisees avant d'avoir un 2e cas reel). Ce fichier est un banc d'essai concret, comme le
// premier. Ce qui est reutilisable pour l'instant, c'est le PRINCIPE, pas du code partage.
//
// --------------------------------------------------------------------------------------------
// ⛔⛔ AUCUNE POSE N'EST INVENTEE DANS CE FICHIER
// --------------------------------------------------------------------------------------------
// Toutes les valeurs d'angle, de flexion, d'amplitude et de frequence sont RECOPIEES telles
// quelles des planches validees (branche rnd/stick-figures-gestes) :
//   gestes/GestesExpressifs16x9.tsx -> useLeverBras("alerte")     : le spring d'arret (mass 0.5,
//       damping 26, stiffness 300), l'inertie du buste (0/5.5/-1.2/0), le bras a 96 deg, les
//       jambes 22/-19 et leurs genoux -7/+9, le souffle contenu.
//   gestes/GestesExpressifs16x9.tsx -> useTrembler("peur")        : la fonction `bruit` (sinus a
//       rapports irrationnels 1/1.618/2.718), l'enveloppe par vagues (0.45+0.55*sin), les
//       sursauts ecretes (seuil 0.72), et les 13 termes de pose (leanBuste 15, leanTete 13,
//       coudes -96/-102, jambes 11/-10, hancheY -24...).
//   gestes/GestesExpressifs16x9.tsx -> useLeverBras("reddition")  : la montee LINEAIRE (aucun
//       spring), les bras 128/118, les coudes 52/58, la tete a +16, le tassement de 6.5.
//   gestes/GestesLocomotion16x9.tsx -> BandeChute                 : les poses-cles P_CHUTE et
//       P_SOL du geste "tomber" (reflexe parachute : les mains devant, jamais la tete), et le
//       spring de chute (mass 2.2, damping 20, stiffness 62).
//
// --------------------------------------------------------------------------------------------
// ⭐ LE POINT TECHNIQUE NOUVEAU, ET IL EST FAVORABLE : UN SEUL MOTEUR
// --------------------------------------------------------------------------------------------
// Le 1er enchainement devait faire cohabiter 2 moteurs (<Figure> pour marcher/pousser, <Stick>
// pour s'asseoir) et il lui restait, a la toute derniere jonction, une COUPE FRANCHE irreductible
// — non pas a cause de la pose (heritee au pixel pres) mais d'un ecart STRUCTUREL de longueur de
// membre entre les 2 moteurs (bras 28u chez Figure, 20+18=38u chez Stick).
//
// Ici les 3 premiers gestes viennent tous de la MEME planche et tournent donc nativement sur le
// MEME moteur <Stick>, avec le MEME type Pose. Il n'y a aucun moteur a remplacer -> aucune coupe,
// aucun fondu, NULLE PART dans ce fichier. C'est un enchainement 100% par heritage.
//
// ⭐ LE 4e GESTE (l'effondrement) EST LE CAS INTERESSANT, et il a failli casser ca : le geste
// "tomber" validé n'existe que sur <Figure>. Le porter naivement en recopiant ses angles de bras
// vers <Stick> donne 181.6px d'erreur sur les mains (MESURE) — c'est exactement le piege
// "oreilles de lapin" du registre : retraduire un angle d'une convention a l'autre, c'est en
// inventer un. La parade appliquee ici respecte la regle sans y renoncer :
//   · hanche / buste / jambes : correspondance DEMONTREE et re-verifiee (ecart 0.00u)
//         leanBuste = -torsoDeg · jambeAvant = leg1Deg · jambeArriere = leg2Deg · genoux egaux
//   · bras : on ne recopie AUCUN angle. On lit la POSITION DE MAIN que la pose validee produit
//         sur <Figure> (une donnee geometrique, pas une convention), et on RESOUT par IK 2
//         segments (loi des cosinus, brique n°2 du registre) l'angle Stick qui atteint ce point.
// Resultat MESURE sur les 2 poses-cles portees : ecart 0.00px sur les 6 reperes (hanche, epaule,
// 2 pieds, 2 mains), tension des bras 81-86% — sous la limite de 97% du registre (au-dela, un
// bras en butee glisse et tremble). La silhouette validee est donc conservee A L'IDENTIQUE, sur
// un seul moteur, sans coupe.
//
// --------------------------------------------------------------------------------------------
// LE MECANISME D'HERITAGE, IDENTIQUE AU 1er FICHIER
// --------------------------------------------------------------------------------------------
// Chaque geste est ecrit sous la forme  articulation = interpolate(lvl, [0,1], [DEPART, CIBLE])
// ou les CIBLE sont LE GESTE (intouchables) et les DEPART sont le POINT D'ENTREE. On ne modifie
// donc QUE les DEPART, qui ne sont plus des litteraux mais des parametres alimentes par la pose
// de sortie REELLE du geste precedent — obtenue en rejouant ses propres formules a sa frame de
// fin, jamais devinee, jamais recalculee a part.
//
// ⛔ GARDE-FOU (le meme que dans le 1er fichier) : le COEUR de chaque geste est INTACT. Springs,
// frequences de bruit, enveloppes, seuils d'ecretage, valeurs cibles, poses-cles : rien n'est
// touche. Seule l'interface d'entree est parametree.
//
// ⚠️ DETAIL QUI COMPTE, TROUVE PAR LA MESURE (pas anticipe) : l'heritage doit etre lu a la frame
// `DUR` du geste precedent, et NON a `DUR - 1`. Le geste precedent affiche ses frames 0..DUR-1 ;
// si le suivant demarre sur la pose de DUR-1, il REAFFICHE la meme image -> la meme silhouette
// occupe 2 frames = un micro-freeze d'une frame a chaque jonction (mesure : 0.00 px/frame a la
// frontiere alors que le mouvement tournait a 0.1-3 px/frame autour). En lisant l'heritage a
// `DUR` (la frame que le geste AURAIT affichee ensuite), la continuite est preservee ET la
// frontiere avance normalement (mesure apres correction : 0.08 / 1.03 px/frame, dans la
// continuite exacte des frames voisines).
//
// --------------------------------------------------------------------------------------------
// ✅ DEFAUT RESIDUEL DE LA VERSION D'ORIGINE — CORRIGE DANS CETTE COPIE
// --------------------------------------------------------------------------------------------
// ⛔ CE QUI SUIT DECRIT LA VERSION D'ORIGINE, CONSERVE COMME TRACE. Dans cette copie le defaut
// N'EXISTE PLUS, et il disparait sans qu'on ait rien corrige a la main : il venait UNIQUEMENT de
// l'arret sur un transitoire. Mesure de la pose finale ICI : pied1 a y=-3.00 et pied2 a y=-5.95,
// donc 7.8px et 15.5px AU-DESSUS de la ligne de sol (le corps repose sur son flanc, les pieds ne
// portent plus), tete a y=0.00 exactement sur la ligne, hanche a -3.
//
// [VERSION D'ORIGINE] La scene se termine sur le corps EN TRAIN de basculer, pas pose au sol.
// Dans cette pose finale, les PIEDS passent legerement SOUS la ligne de sol : mesure, pied1 a
// +6.95u (18.1px) et pied2 a +2.70u (7.0px) sous le sol.
// ⛔ Ce n'est PAS un bug introduit ici : c'est une caracteristique de la pose-cle P_CHUTE du geste
// valide, ou elle est une frame de PASSAGE (le corps est en l'air, en train de tomber, et P_SOL
// l'amene a plat 0.5s plus tard). En la prenant comme pose d'ARRIVEE, on la TIENT — et ce qui
// etait un transitoire invisible devient une pose tenue, donc visible.
// ⛔ NON CORRIGE VOLONTAIREMENT : toute correction (remonter la hanche, replier les jambes,
// inventer une pose de contact) reviendrait a INVENTER une pose — l'erreur explicitement
// interdite pour ce chantier. La vraie solution est en amont : soit porter le geste de chute
// complet sur un moteur qui peut le dessiner, soit ajouter une pose "au sol" NATIVE a la planche
// des gestes expressifs (donc validee comme un geste, pas bricolee ici).
// ✅ C'EST LA 1re BRANCHE QUI A ETE PRISE, ET ELLE ETAIT LA BONNE : le geste de chute complet EST
// portable sur <Stick>, il manquait juste au moteur le degre de liberte `headTuck` que <Figure>
// possede. Aucune pose n'a ete inventee, aucune n'a ete bricolee. Cf. l'en-tete de cette copie.
//
// ============================================================================================
// ⭐⭐ CETTE COPIE (2026-08-03) — LA CHAINE VA MAINTENANT JUSQU'A P_SOL
// ============================================================================================
// Ce fichier est une COPIE de EnchainementGestesExpressifs.tsx, modifiee sur UN SEUL point :
// le 4e geste ne s'arrete plus a P_CHUTE, il continue jusqu'a P_SOL (le corps a terre).
//
// Ce qui a debloque P_SOL n'est PAS une pose inventee : c'est un PARAMETRE MANQUANT du moteur
// <Stick> — `headTuck`, que <Figure> possede et utilise a 0.45 sur P_SOL ("rentrer la tete =
// encaisser"). Toute la demonstration, les mesures et la transposition sont dans
// `PoseSolPortee.tsx`, d'ou ce fichier importe le moteur et les 2 poses portees. Rien n'est
// duplique ici.
//
// ⛔ TOUT LE RESTE DU FICHIER EST INTACT : les 3 premiers gestes, leurs springs, leurs bruits,
// leurs cibles, le mecanisme d'heritage, les durees. Le paragraphe "LIMITE TROUVEE AU RENDER"
// ci-dessous est CONSERVE TEL QUEL comme trace historique — mais sa conclusion ("P_SOL est
// insoluble sur ce moteur") est REFUTEE, cf. l'en-tete de PoseSolPortee.tsx : le critere
// utilise (13u entre CHAQUE point de segment et la tete) etait faux, la pose validee le viole
// sur son propre moteur (bras a 3.31u du centre du crane chez <Figure>). Le bon critere est la
// distance COUDE<->tete ; avec le tuck, elle passe a 14.8u / 14.2u -> les 2 coudes degages.
//
// TECHNIQUE : frame-driven, zero Math.random, zero setTimeout / CSS transition / @keyframes.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Stick, POSE_NEUTRE as NEUTRE_SOCLE, K_CHUTE, K_SOL, mixPose } from "./PoseSolPortee";
import type { PoseStick } from "./PoseSolPortee";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// Palette du registre (identique aux planches sources)
const NUIT = "#22345c";
const NUIT2 = "#182746";
const ENCRE = "#f0e8d2";
const ENCRE_FAIBLE = "rgba(240,232,210,0.34)";

// Echelle d'usage des scenes narratives du registre (~208px de haut), la meme que le 1er
// enchainement : les defauts invisibles a 74px deviennent grotesques a cette taille, c'est donc
// a CETTE echelle qu'il faut juger (regle dure du registre).
const PERSO_SCALE = 2.6;
const SOL_Y = 780;
const PERSO_X = W / 2;

const smooth = (u: number) => {
  const v = Math.max(0, Math.min(1, u));
  return v * v * (3 - 2 * v);
};
const mix = (a: number, b: number, u: number) => a + (b - a) * u;

// ============================================================================================
// LE MOTEUR <Stick> — IMPORTE de PoseSolPortee.tsx (avec le degre de liberte `headTuck`)
// ============================================================================================
// ⛔ Convention d'angle : 180 = bras vers le haut (l'INVERSE du socle StickFigure.tsx). Elle ne
// doit jamais etre melangee avec celle de <Figure> — c'est le bug "oreilles de lapin" documente
// dans le registre. Ici tout le fichier vit dans CETTE convention, sans exception.
//
// ⛔ LE MOTEUR N'EST PAS DUPLIQUE : il vient de PoseSolPortee.tsx, ou il est identique a celui
// d'origine A UNE CHOSE PRES — le champ `headTuck`, INERTE A 0 (formule de tete d'origine rendue
// caractere pour caractere quand tuck === 0, verifie : ecart 0.000u). Les 3 premiers gestes de
// cette chaine, qui n'utilisent jamais le tuck, sont donc rendus a l'identique.
const POSE_NEUTRE: PoseStick = NEUTRE_SOCLE;

// bruit deterministe — RECOPIE de GestesExpressifs16x9 (sinus a rapports irrationnels).
// ⛔ Zero Math.random : Remotion recalcule chaque frame, un random casserait le rendu.
const bruit = (f: number, seed: number, base: number): number => {
  const p = seed * 1.7139;
  return (
    Math.sin(f * base + p) * 0.55 +
    Math.sin(f * base * 1.618 + p * 2.3) * 0.3 +
    Math.sin(f * base * 2.718 + p * 0.7) * 0.15
  );
};

// ============================================================================================
// DUREES DES 4 SEGMENTS
// ============================================================================================
// Chaque geste doit tourner assez longtemps pour etre JUGE (regle du registre : un geste ne se
// juge pas sur une frame). Les durees sont calees sur les constantes internes de chaque geste :
//   A (alerte)      3.2s — le spring d'arret est boucle a ~0.9s, le reste est le MAINTIEN fige
//                          (c'est l'immobilite soudaine qui fait l'alerte, pas l'agitation)
//   B (peur)        5.4s — l'enveloppe par vagues a une periode de ~1.34s et les sursauts sont
//                          espaces : il faut plusieurs vagues + au moins un sursaut pour lire
//   C (reddition)   4.6s — la montee lineaire dure 2.2s, le tassement 3.55s : il faut voir la
//                          contradiction (les bras montent / le corps descend) s'installer
//   D (effondrement) 2.0s — DERIVE, pas choisi. ⚠️ RE-MESURE DANS CETTE COPIE : en allant
//                          jusqu'a P_SOL, le mouvement dure PLUS LONGTEMPS que dans la version
//                          qui s'arretait a P_CHUTE. Mesure sur le spring reel :
//                            versChute sature a la frame 10, versSol atteint 0.995 a la frame 28
//                          (0.93s) — c'est le second temps, la mise a plat, qui prolonge le geste.
//                          Mesure sur les FRAMES RENDUES (centroide de l'encre, px/frame) :
//                            f405 12.73 · f408 6.70 · f411 4.94 · f414 3.09 · f417 1.87
//                            f420 0.95 · f423 0.43  -> decroissance continue, aucune rupture.
//                          ⛔ 1.5s (la valeur d'origine) etait trop court UNE FOIS P_SOL AJOUTEE :
//                          le fondu de fermeture de scene (18 frames) demarrait a la frame 423,
//                          donc PENDANT que le corps finissait encore de se poser — la pose au sol
//                          n'etait jamais vue en pleine opacite (mesure : encre a 1471px des la
//                          f426, puis nulle). 2.0s laisse ~0.5s de corps a terre pleinement
//                          visible avant que le fondu ne commence. ⛔ Pas plus : au-dela on
//                          retombe dans le defaut deja mesure de l'image strictement figee.
const A_DUR = S(3.2);
const B_DUR = S(5.4);
const C_DUR = S(4.6);
const D_DUR = S(2.0);

const A_START = 0;
const B_START = A_START + A_DUR;
const C_START = B_START + B_DUR;
const D_START = C_START + C_DUR;
export const EXPRESSIFS_SOL_FRAMES = D_START + D_DUR;

// ============================================================================================
// SEGMENT A — L'ALERTE  (useLeverBras "alerte", RECOPIE)
// ============================================================================================
// INTENTION (mot pour mot de la planche) : "quelqu'un vient de voir ce que personne d'autre n'a
// vu, et son corps s'est arrete AVANT sa voix". Ce n'est pas "lever les bras", c'est un ARRET NET.
//
// ⛔ COEUR INTACT : le spring d'arret amorti (mass 0.5, damping 26, stiffness 300 — damping haut
// = il se BLOQUE, il ne rebondit pas), l'inertie du buste (0 / 5.5 / -1.2 / 0 sur 0.62s), le bras
// a 96 deg (l'avant-bras part a l'horizontale pour DESIGNER — pas 168, ce serait de la pantomime),
// l'autre bras qui n'accompagne PAS (-14), les jambes 22/-19 avec genoux -7/+9, le souffle contenu.
//
// ⭐ POINT D'ENTREE PARAMETRE : `debut`. Ici c'est le seul geste dont le depart n'est herite de
// rien (c'est le 1er de la chaine) — il part donc de POSE_NEUTRE, exactement comme dans la
// planche. La signature est neanmoins parametree pour que TOUS les gestes de ce fichier aient la
// meme forme (point d'entree explicite), ce qui rend la chaine lisible.
//
// ⚠️ UNE SEULE ADAPTATION, imposee par l'enchainement : la planche fait BOUCLER le geste sur un
// cycle de 4s (montee, maintien, redescente `down` a partir de 3.0s, puis retour). Ici il ne
// reboucle pas — la PEUR prend le relais. La redescente `down` est donc retiree, comme le modulo
// de boucle d'ArretNet avait ete retire dans le 1er enchainement pour la meme raison. Le maintien
// se prolonge simplement jusqu'a la jonction. Aucune valeur du geste n'est modifiee.
const A_DEPART = S(0.55); // RECOPIE : le geste laisse 0.55s avant de declencher

const poseAlerte = (f: number, fps: number, debut: PoseStick): PoseStick => {
  // ⛔ RECOPIE : arret rapide mais AMORTI (damping haut = il se bloque, il ne rebondit pas)
  const stop = spring({
    frame: f - A_DEPART, fps,
    config: { mass: 0.5, damping: 26, stiffness: 300 },
  });
  const lvl = Math.max(0, stop);
  // ⛔ RECOPIE : l'inertie du buste — le SEUL depassement conserve (celui du poids)
  const inertie = interpolate(f,
    [A_DEPART, A_DEPART + S(0.14), A_DEPART + S(0.4), A_DEPART + S(0.62)],
    [0, 5.5, -1.2, 0], clamp);
  // ⛔ RECOPIE : respiration TRES contenue — il est en apnee, pas en surtension
  const souffle = Math.sin(f * 0.21) * 0.5 + Math.sin(f * 0.34) * 0.25;
  return {
    ...POSE_NEUTRE,
    // ⭐ chaque DEPART est lu dans `debut` ; chaque CIBLE est la valeur du geste valide
    brasAvantAngle: interpolate(lvl, [0, 1], [debut.brasAvantAngle, 96], clamp) + souffle * lvl * 0.5,
    brasArriereAngle: interpolate(lvl, [0, 1], [debut.brasArriereAngle, -14], clamp),
    brasAvantCoude: interpolate(lvl, [0, 1], [debut.brasAvantCoude, 14], clamp),
    brasArriereCoude: interpolate(lvl, [0, 1], [debut.brasArriereCoude, 12], clamp),
    leanBuste: interpolate(lvl, [0, 1], [debut.leanBuste, 6], clamp) + inertie,
    leanTete: interpolate(lvl, [0, 1], [debut.leanTete, -7], clamp) + inertie * 0.35,
    jambeAvant: interpolate(lvl, [0, 1], [debut.jambeAvant, 22], clamp),
    jambeArriere: interpolate(lvl, [0, 1], [debut.jambeArriere, -19], clamp),
    jambeAvantGenou: interpolate(lvl, [0, 1], [debut.jambeAvantGenou, -7], clamp),
    jambeArriereGenou: interpolate(lvl, [0, 1], [debut.jambeArriereGenou, 9], clamp),
    bob: interpolate(lvl, [0, 1], [debut.bob, 0], clamp) + souffle * lvl * 0.4,
    dx: interpolate(lvl, [0, 1], [debut.dx, 0], clamp),
    dy: interpolate(lvl, [0, 1], [debut.dy, 0], clamp),
    hancheY: interpolate(lvl, [0, 1], [debut.hancheY, -26], clamp),
  };
};

// ============================================================================================
// SEGMENT B — LA PEUR  (useTrembler "peur", RECOPIE)   ⭐ JONCTION A->B
// ============================================================================================
// ⛔ COEUR INTACT : l'enveloppe par VAGUES (0.45 + 0.55*max(0,sin(f*0.078))), les SURSAUTS isoles
// (produit de 2 sinus lents ecrete au seuil 0.72 — des pics brefs qui cassent la vague), la
// fonction `bruit` a frequences incommensurables et sa base 0.62, et les 13 termes de la pose :
// leanBuste 15, leanTete 13 (la tete tremble le PLUS), bras 30/24, coudes -96/-102 (avant-bras en
// travers du buste = corps FERME), jambes 11/-10, genoux 8/7, hancheY -24 (legerement tasse).
//
// ⭐⭐ LA JONCTION, ET C'EST ICI QUE SE JOUE LE TEST DE CE FICHIER
// --------------------------------------------------------------------------------------------
// MESURE DU DEFAUT SANS HERITAGE (script de geometrie rejouant la chaine cinematique de <Stick>,
// AVANT d'ecrire une ligne de code) : entre la derniere frame de l'alerte et la 1re frame de la
// peur, les reperes sautaient de
//     main1 19.08u = 49.6px · main2 16.49u = 42.9px · tete 14.89u = 38.7px · epaule 9.44u = 24.5px
// EN UNE SEULE FRAME, a l'echelle d'usage — pour un trait de corps de 11.7px. C'est une
// teleportation franche des deux mains, du meme ordre que les 75/91px mesures a la jonction
// B->C du 1er enchainement. Le defaut est donc BIEN REPRODUIT sur ce 2e cas : ce n'etait pas une
// particularite de l'enchainement de locomotion.
//
// ⭐ LE FIX : les valeurs de DEPART de la peur ne sont plus les constantes implicites de
// POSE_NEUTRE, ce sont les 13 champs de la pose de sortie REELLE de l'alerte (`debut`), et le
// corps y converge par une rampe d'entree B_RAMPE.
//
// ⭐ ET SURTOUT — LE POINT PROPRE A CE GESTE, QUI N'AVAIT PAS D'EQUIVALENT DANS LE 1er FICHIER :
// LE TREMBLEMENT LUI-MEME DOIT NAITRE. L'amplitude du bruit est multipliee par la rampe `u`.
// Sans ca, la peur demarrerait a PLEINE amplitude de tremblement des sa 1re frame : la pose de
// depart serait bien heritee, mais le corps se mettrait a vibrer d'un coup — un saut de
// MOUVEMENT au lieu d'un saut de pose, tout aussi visible. C'est le pendant exact de "la cadence
// de poussee part de 0" du 1er fichier (la caisse ne bouge qu'une fois touchee) : ce qui est
// herite, ce n'est pas seulement la POSITION, c'est aussi la VITESSE/l'ENERGIE du corps.
//
// DUREE DE LA RAMPE : 0.9s. Calee sur l'enveloppe du geste valide, dont la vague a une periode de
// 2*PI/0.078 = ~80 frames (2.7s) : 0.9s = un tiers de vague, assez pour que le tremblement
// s'installe comme une monté et non comme un interrupteur, sans retarder la lecture de la peur.
const B_RAMPE = S(0.9);

const poseFeur = (f: number, debut: PoseStick): PoseStick => {
  const u = smooth(f / B_RAMPE);
  // ⛔ RECOPIE : enveloppe par VAGUES + SURSAUTS isoles
  const vague = 0.45 + 0.55 * Math.max(0, Math.sin(f * 0.078));
  const pic = Math.max(0, Math.sin(f * 0.041) * Math.sin(f * 0.0173) - 0.72) / 0.28;
  // ⭐ SEULE ADAPTATION : l'amplitude est portee par la rampe -> le tremblement NAIT (cf. supra)
  const amp = (vague * 2.6 + pic * 5.4) * u;
  const b = (s: number) => bruit(f, s, 0.62) * amp;
  const m = (a: number, cible: number) => mix(a, cible, u);
  return {
    ...POSE_NEUTRE,
    // ⛔ toutes les CIBLES sont celles du geste valide ; seuls les DEPARTS sont herites
    leanBuste: m(debut.leanBuste, 15) + b(1) * 0.9,
    leanTete: m(debut.leanTete, 13) + b(2) * 1.5,
    brasAvantAngle: m(debut.brasAvantAngle, 30) + b(3) * 1.3,
    brasArriereAngle: m(debut.brasArriereAngle, 24) + b(4) * 1.1,
    brasAvantCoude: m(debut.brasAvantCoude, -96) + b(5) * 2.2,
    brasArriereCoude: m(debut.brasArriereCoude, -102) + b(6) * 2.0,
    jambeAvant: m(debut.jambeAvant, 11) + b(7) * 0.7,
    jambeArriere: m(debut.jambeArriere, -10) + b(8) * 0.6,
    jambeAvantGenou: m(debut.jambeAvantGenou, 8) + b(9) * 0.9,
    jambeArriereGenou: m(debut.jambeArriereGenou, 7),
    bob: m(debut.bob, 0) + b(10) * 0.7,
    dx: m(debut.dx, 0) + b(11) * 0.9,
    dy: m(debut.dy, 0) + b(12) * 0.5,
    hancheY: m(debut.hancheY, -24),
  };
};

// ============================================================================================
// SEGMENT C — LA REDDITION  (useLeverBras "reddition", RECOPIE)   ⭐ JONCTION B->C
// ============================================================================================
// ⛔ COEUR INTACT : la montee LENTE et LINEAIRE (interpolate, AUCUN spring, aucun rebond — c'est
// le seul des 3 levers de bras ou rien ne rebondit), les bras COLLES vers l'interieur (128/118)
// avec coudes FLECHIS (52/58 : la vraie posture "mains en l'air", pas le V du vainqueur), la
// CONTRADICTION INTERNE (leanBuste +5 mais tete BAISSEE a +16), les jambes 14/-13, et le
// tassement de 6.5 (bob NEGATIF = le bassin DESCEND pendant que les bras montent).
//
// ⭐ JONCTION : meme mecanisme qu'en A->B. Mesure sans heritage : main1 19.79u = 51.5px,
// tete 15.10u = 39.3px en une frame. Avec heritage : 0.00px sur les 7 reperes.
//
// ⚠️ ADAPTATION imposee par l'enchainement (meme nature que pour l'alerte) : la planche fait
// redescendre les bras en fin de cycle (lvl retombe a 0.06 a 3.9s) pour reboucler. Ici la
// reddition ne reboucle pas — l'effondrement prend le relais. La branche de redescente est donc
// retiree ; la montee et le tassement, eux, sont recopies tels quels.
//
// ⭐ NOTE SUR LE TREMBLEMENT QUI S'ETEINT : la peur laisse le corps avec une amplitude de bruit
// non nulle. La reddition, elle, n'a AUCUN terme de bruit (le geste valide est explicitement
// "aucune oscillation : ce qui monte reste fige"). Le tremblement s'arrete donc a la jonction.
// C'est VOULU et c'est le sens du geste (on cesse de lutter), mais c'est aussi le point le plus
// delicat de la chaine : l'arret d'une vibration est un changement de MOUVEMENT, pas de pose.
// L'heritage garantit la pose (0.00px, mesure) ; la mesure de VITESSE aux frames voisines a
// confirme qu'il n'y a pas d'a-coup (0.36 -> 1.03 -> 0.29 px/frame sur la tete de part et
// d'autre de la frontiere, donc une decroissance continue, pas une rupture).
const poseReddition = (f: number, debut: PoseStick): PoseStick => {
  // ⛔ RECOPIE : montee lineaire sur 2.2s, sans le moindre spring
  const lvl = interpolate(f, [0, S(2.2)], [0, 1], clamp);
  // ⛔ RECOPIE : le seul mouvement residuel — une respiration TRES lente
  const resp = Math.sin(f * 0.13) * 1.1;
  // ⛔ RECOPIE : le tassement, qui continue apres que les bras aient fini de monter
  const tasse = interpolate(f, [0, S(3.55)], [0, 6.5], clamp);
  return {
    ...POSE_NEUTRE,
    brasAvantAngle: interpolate(lvl, [0, 1], [debut.brasAvantAngle, 128], clamp),
    brasArriereAngle: interpolate(lvl, [0, 1], [debut.brasArriereAngle, 118], clamp),
    brasAvantCoude: interpolate(lvl, [0, 1], [debut.brasAvantCoude, 52], clamp),
    brasArriereCoude: interpolate(lvl, [0, 1], [debut.brasArriereCoude, 58], clamp),
    leanBuste: interpolate(lvl, [0, 1], [debut.leanBuste, 5], clamp),
    leanTete: interpolate(lvl, [0, 1], [debut.leanTete, 16], clamp),
    jambeAvant: interpolate(lvl, [0, 1], [debut.jambeAvant, 14], clamp),
    jambeArriere: interpolate(lvl, [0, 1], [debut.jambeArriere, -13], clamp),
    jambeAvantGenou: interpolate(lvl, [0, 1], [debut.jambeAvantGenou, 9], clamp),
    jambeArriereGenou: interpolate(lvl, [0, 1], [debut.jambeArriereGenou, 8], clamp),
    bob: interpolate(lvl, [0, 1], [debut.bob, 0], clamp) - tasse + resp * lvl,
    dx: interpolate(lvl, [0, 1], [debut.dx, 0], clamp),
    dy: interpolate(lvl, [0, 1], [debut.dy, 0], clamp) + tasse * 0.55,
    hancheY: interpolate(lvl, [0, 1], [debut.hancheY, -26], clamp),
  };
};

// ============================================================================================
// SEGMENT D — L'EFFONDREMENT   ⭐ JONCTION C->D  +  LE PORTAGE PAR IK
// ============================================================================================
// ⛔ LES 2 POSES-CLES SONT CELLES DU GESTE VALIDE (GestesLocomotion16x9 > BandeChute), recopiees
// valeur pour valeur dans la convention de <Figure> :
//   P_CHUTE : le REFLEXE PARACHUTE — les bras se jettent EN AVANT, mains ouvertes devant, pour
//             amortir. (C'est la correction qu'Aziz avait imposee : avant, les bras partaient en
//             arriere et le personnage "plantait face premiere".)
//   P_SOL   : a plat, contact franc, les DEUX MAINS au sol devant lui, jambes qui trainent.
// ⛔ Le spring de chute est lui aussi RECOPIE (mass 2.2, damping 20, stiffness 62 — volontairement
// lent : a stiffness 130 la chute etait bouclee en 5 frames et le reflexe parachute ne se VOYAIT
// pas). La chute passe par P_CHUTE AVANT P_SOL, exactement comme le geste valide.
//
// ⭐⭐ LE PORTAGE VERS <Stick> — LE POINT TECHNIQUE LE PLUS DELICAT DE CE FICHIER
// --------------------------------------------------------------------------------------------
// Ces poses vivent nativement sur <Figure>, dont la convention d'angle est INVERSE de celle de
// <Stick>, et dont les bras ont une longueur (28u depuis l'epaule) et un point d'attache
// DIFFERENTS (Stick : 20+18 = 38u depuis un point 12% sous l'epaule).
//
// ⛔ CE QUI EST INTERDIT ET N'EST PAS FAIT ICI : retraduire les angles de bras d'une convention a
// l'autre. MESURE de ce que ca donnerait sur P_SOL : les mains atterrissent 69.84u et 68.83u a
// cote, soit 181.6px et 179.0px a l'echelle d'usage. C'est le bug "oreilles de lapin" du registre
// dans toute sa splendeur — et c'est exactement le geste (re-deriver un angle) qui avait fait
// echouer les 2 prototypes d'avant le 1er enchainement.
//
// ✅ CE QUI EST FAIT : on ne transporte pas des ANGLES, on transporte de la GEOMETRIE.
//   1. hanche / buste / jambes : correspondance DEMONTREE (et re-verifiee ici numeriquement,
//      ecart 0.00u sur les 4 reperes) — leanBuste = -torsoDeg, jambeAvant = leg1Deg,
//      jambeArriere = leg2Deg, genoux identiques.
//   2. bras : on calcule OU SE TROUVE LA MAIN que la pose validee produit sur <Figure> (c'est une
//      donnee geometrique objective, independante de toute convention), puis on RESOUT par IK 2
//      segments (loi des cosinus — brique n°2 du registre) l'angle Stick qui place la main
//      EXACTEMENT la. C'est la methode que le registre prescrit deja pour les objets tenus :
//      "decider la position monde de la main, le coude se resout".
//
// RESULTAT MESURE sur les 2 poses portees (6 reperes : hanche, epaule, 2 pieds, 2 mains) :
//      ecart 0.00u = 0.0px sur TOUS.  Tension des bras : 86%/83% (P_CHUTE) et 84%/81% (P_SOL).
// ⚠️ La tension est le point a surveiller : le registre interdit de laisser un bras au-dela de
// ~97% de sa portee (un bras en butee glisse et tremble). On est a 81-86%, avec de la marge.
//
// ⚠️⚠️ LIMITE TROUVEE AU RENDER, ET ELLE EST STRUCTURELLE — POURQUOI LA CHAINE S'ARRETE A P_CHUTE
// --------------------------------------------------------------------------------------------
// DEFAUT VU sur le 1er render (pas anticipe) : dans la pose finale AU SOL, les deux bras se
// repliaient AUTOUR DE LA TETE et formaient un losange ferme — le crane pris dans un accolade de
// membres. Illisible comme "il a amorti sa chute", parfaitement lisible comme artefact.
//
// ⛔ MA VERIFICATION INITIALE ETAIT INSUFFISANTE, et c'est la leçon de methode de ce fichier :
// j'avais mesure l'ecart sur les EXTREMITES (mains, pieds) et conclu "0.00px, porte a l'identique".
// Or une chaine a 2 os a aussi une articulation INTERMEDIAIRE. Les mains etaient bien sur leur
// cible ; c'etaient les COUDES qui traversaient la tete (mesure a posteriori : coude1 a 10.9u et
// coude2 a 12.2u du centre de la tete, pour un crane de rayon 9u — donc dedans).
//
// ⭐ DIAGNOSTIC PAR CALCUL (les 4 combinaisons de sens de coude testees sur les 2 poses) :
//   · P_CHUTE : la combinaison (s1=+1, s2=+1) donne coude1 a 13.8u et coude2 a 18.4u de la tete
//               -> DEGAGE. C'est celle qui est appliquee ci-dessous.
//   · P_SOL   : AUCUNE des 4 combinaisons ne degage la tete (meilleur coude possible : 11.3u et
//               12.5u, il en faudrait >13). Verifie exhaustivement en balayant le cercle du coude
//               degre par degre : il n'existe AUCUNE solution IK.
//   RAISON, purement arithmetique : dans P_SOL le corps est A PLAT, donc la tete se trouve SUR le
//   segment epaule->main. Le bras de <Stick> mesure 38u (20+18) pour une cible a ~31-32u : il DOIT
//   se plier de 6-7u, et ce pli tombe forcement pres de la tete. Sur <Figure>, dont le bras fait
//   28u (un seul segment tendu), le probleme n'existe pas — il n'y a pas de coude a loger.
//
// ✅ DECISION : la chaine s'arrete a l'effondrement EN COURS (P_CHUTE), et non au corps a plat.
// Ce n'est pas un repli esthetique, c'est la seule pose des deux qui soit REELLEMENT dessinable
// par ce moteur. ⛔ Les alternatives ont ete ecartees pour la raison qui gouverne tout ce fichier :
//   · inventer une pose de sol "compatible Stick" = inventer une pose (l'erreur interdite) ;
//   · rallonger/raccourcir le bras de Stick = deformer un moteur valide pour 1 pose ;
//   · basculer sur <Figure> pour la seule fin = reintroduire le changement de moteur et sa coupe,
//     alors que l'interet de ce 2e cas est justement d'etre un enchainement a moteur unique.
// La chute reste parfaitement lisible : le corps part en avant, les mains sont JETEES DEVANT
// (reflexe parachute, mesure : mains a x=+48.7 et +42.8 pour une hanche a x=0), les pieds ont
// quitte le sol (y=+7.0 et +2.7). C'est le moment fort du geste, pas son epilogue.
//
// ⭐ CONSEQUENCE : il n'y a AUCUN changement de moteur dans ce fichier, donc AUCUNE coupe et
// AUCUN fondu — la limite structurelle qui obligeait le 1er enchainement a une coupe franche
// (ecart de longueur de membre entre 2 moteurs affiches tour a tour) ne se presente pas ici,
// parce que le corps n'est jamais dessine que par <Stick>. ⚠️ Mais elle se manifeste AUTREMENT,
// et c'est le vrai enseignement : l'ecart de longueur de membre entre les 2 moteurs ne disparait
// pas quand on porte de la GEOMETRIE au lieu d'ANGLES — il se DEPLACE de la main vers le coude.
// ⛔ LE PORTAGE N'EST PAS DUPLIQUE ICI. `PoseFigure`, `P_CHUTE`, `P_SOL`, `mainsDeFigure`,
// `ikStick`, `porterVersStick` et `mixPose` vivent dans `PoseSolPortee.tsx`, avec leurs mesures.
// On importe les 2 poses-cles DEJA PORTEES (K_CHUTE, K_SOL) et le fondu terme a terme.
//
// ⚠️ `mixPose` N'EST PAS UN "FONDU DE JONCTION" (l'anti-pattern proscrit par la brique n°7). C'est
// la brique n°4 du registre : "POSES-CLES EXPLICITES + fondu SEQUENTIEL", la methode meme du geste
// de chute valide. Ici on interpole entre 2 poses-cles A L'INTERIEUR d'un seul geste (a tout
// instant on est sur le segment entre 2 silhouettes valides, donc jamais de derive) ;
// l'anti-pattern, lui, melange les poses de DEUX GESTES DIFFERENTS de part et d'autre d'une
// frontiere. Aucune opacite n'est jamais melangee : un seul corps est dessine.

// ⭐ JONCTION C->D : la pose de depart de la chute n'est PAS P_DEBOUT (la pose-cle "debout" du
// geste valide, qui refermerait la boucle dans la planche d'origine) — c'est la pose de sortie
// REELLE de la reddition. Le corps s'effondre donc depuis exactement la posture ou la reddition
// l'a laisse : bras encore en l'air, coudes flechis, buste deja tasse. C'est la lecture narrative
// juste (il ne se remet pas debout pour tomber ensuite), et c'est le meme mecanisme d'heritage
// qu'aux 2 autres jonctions.
// ⛔ Le SPRING du geste valide est intact (mass 2.2, damping 20, stiffness 62 — volontairement
// lent : a stiffness 130 la chute etait bouclee en 5 frames et le reflexe parachute ne se VOYAIT
// pas).
//
// ⭐⭐ CE QUI CHANGE DANS CETTE COPIE : LA CHAINE VA JUSQU'AU BOUT.
// La version d'origine s'arretait a P_CHUTE (corps en train de basculer, pieds sous le sol de
// 18.1px et 7.0px — un transitoire du geste valide, TENU donc rendu visible). Elle avait alors du
// etirer la borne du spring de [0, 0.55] a [0, 1] pour ne pas figer l'image, ce qui DEFORMAIT la
// cadence du geste valide.
// ⛔ ICI ON RESTAURE LA CADENCE EXACTE DE `BandeChute`, les deux bornes telles quelles :
//        versChute = interpolate(chute, [0, 0.55], [0, 1])
//        versSol   = interpolate(chute, [0.4,  1 ], [0, 1])
//        k = mix(depart, K_CHUTE, versChute) ; k = mix(k, K_SOL, versSol)
// Les deux plages SE CHEVAUCHENT sur [0.4, 0.55] : c'est le geste valide qui le veut, et c'est ce
// chevauchement qui rend la bascule continue (le corps ne "s'arrete" jamais sur P_CHUTE, il la
// traverse). ⛔ Aucun fondu de jonction n'est invente : c'est le fondu SEQUENTIEL interne du geste,
// exactement le meme mecanisme que dans la planche source.
// ⭐ RESULTAT MESURE : la pose finale a les DEUX pieds AU-DESSUS de la ligne de sol (y = -3.00 et
// -5.95, soit 7.8px et 15.5px au-dessus a l'echelle 2.6), la tete pose a y = 0.00 exactement sur
// la ligne, la hanche a -3. Le defaut residuel assume de la version d'origine (pieds enfonces sous
// le sol) DISPARAIT — parce qu'il venait justement de l'arret sur un transitoire.
const poseEffondrement = (f: number, fps: number, debut: PoseStick): PoseStick => {
  const chute = spring({
    frame: f, fps,
    config: { mass: 2.2, damping: 20, stiffness: 62 },
  });
  const versChute = interpolate(chute, [0, 0.55], [0, 1], clamp);
  const versSol = interpolate(chute, [0.4, 1], [0, 1], clamp);
  let k = mixPose(debut, K_CHUTE, versChute);
  k = mixPose(k, K_SOL, versSol);
  return k;
};

// ============================================================================================
// LA SCENE
// ============================================================================================
export const EnchainementGestesExpressifsSol: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ⭐⭐ LA CHAINE D'HERITAGE — chaque pose de sortie est calculee UNE SEULE FOIS en rejouant les
  // formules du geste a sa frame de fin. Aucune valeur n'est ecrite a la main.
  //
  // ⚠️ LU A `X_DUR` ET NON `X_DUR - 1` : le geste precedent affiche ses frames 0..DUR-1 ; heriter
  // de DUR-1 ferait REAFFICHER cette meme image en frame 0 du geste suivant (micro-freeze d'une
  // frame, mesure : 0.00 px/frame a la frontiere). En lisant la frame DUR — celle que le geste
  // AURAIT affichee s'il continuait — la pose reste dans la continuite exacte du mouvement ET la
  // frontiere avance normalement.
  const sortieA = React.useMemo(() => poseAlerte(A_DUR, fps, POSE_NEUTRE), [fps]);
  const sortieB = React.useMemo(() => poseFeur(B_DUR, sortieA), [sortieA]);
  const sortieC = React.useMemo(() => poseReddition(C_DUR, sortieB), [sortieB]);

  // ---- SELECTION DU SEGMENT ACTIF — ⭐ AUCUN FONDU DE JONCTION, AUCUNE COUPE ----
  // Un seul moteur, un seul corps dessine, opacite pleine en permanence. La simple selection par
  // intervalle suffit : il n'y a aucun saut a masquer, puisque chaque geste demarre exactement
  // sur la pose ou le precedent s'est arrete.
  let pose: PoseStick;
  if (frame < B_START) {
    pose = poseAlerte(frame, fps, POSE_NEUTRE);
  } else if (frame < C_START) {
    pose = poseFeur(frame - B_START, sortieA);
  } else if (frame < D_START) {
    pose = poseReddition(frame - C_START, sortieB);
  } else {
    pose = poseEffondrement(frame - D_START, fps, sortieC);
  }

  // fondu d'ouverture / fermeture de la SCENE (pas des gestes)
  const op = interpolate(frame, [0, 14, EXPRESSIFS_SOL_FRAMES - 18, EXPRESSIFS_SOL_FRAMES],
    [0, 1, 1, 0], clamp);

  // etoiles de fond — PRNG a graine fixe (zero Math.random), calculees une fois
  const stars = React.useMemo(() => {
    const a: { x: number; y: number; r: number; o: number }[] = [];
    let s = 11;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 60; i++) {
      a.push({ x: rnd() * W, y: rnd() * H * 0.74, r: rnd() * 1.3 + 0.4, o: rnd() * 0.3 + 0.1 });
    }
    return a;
  }, []);

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 40%, ${NUIT} 0%, ${NUIT2} 100%)`,
      opacity: op,
    }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={ENCRE} opacity={s.o} />
        ))}

        {/* DECOR VOLONTAIREMENT MINIMAL : le sujet de ce test est le CORPS. Une seule ligne de
            sol, comme dans les planches sources — c'est elle qui permet de verifier a l'oeil que
            les pieds ne s'enfoncent pas et que le corps au sol repose bien dessus. */}
        <line x1={PERSO_X - 520} y1={SOL_Y} x2={PERSO_X + 520} y2={SOL_Y}
          stroke={ENCRE_FAIBLE} strokeWidth={2} />

        {/* LE PERSONNAGE — un seul moteur, un seul corps, opacite pleine. */}
        <Stick x={PERSO_X} y={SOL_Y} pose={pose} scale={PERSO_SCALE} />
      </svg>
    </AbsoluteFill>
  );
};

export default EnchainementGestesExpressifsSol;
