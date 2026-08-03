// ============================================================================================
// ENCHAINEMENT DE GESTES DEJA VALIDES — un personnage, un decor simple, 5 segments narratifs
// (2026-08-02)
// ============================================================================================
//
// POURQUOI CE FICHIER : deux prototypes precedents ont ete rejetes parce qu'ils INVENTAIENT des
// poses (angles devines au juge, jamais verifies par calcul -> pied qui traverse le sol de 14
// unites, cadence 2,3x trop lente). Consigne d'Aziz : "repartons EXACTEMENT des gestes deja
// valides". Ce fichier ne contient donc AUCUNE pose neuve : toutes les valeurs d'angle, de
// cadence, de swing et de flexion sont RECOPIEES telles quelles depuis les 2 planches validees
// (branche rnd/stick-figures-gestes) :
//
//   gestes/GestesLocomotion16x9.tsx  -> MARCHE LENTE / MARCHE PRESSEE (table VARIANTES),
//                                       ArretNet (T_STOP/T_ARRET/cad0/inertie/balanResiduel),
//                                       POUSSER (BandePoids : cad .42, swing 16, lean 30,
//                                       hipDrop 3, hand1/hand2 sur la face de caisse, acoup)
//   gestes/GestesExpressifs16x9.tsx  -> S'ASSEOIR (useAssisAttendre + APPUIS.banc + les 3
//                                       couches d'immobilite habitee) et son <Stick>
//
// --------------------------------------------------------------------------------------------
// ⭐ LE CHOIX TECHNIQUE — POURQUOI UN CROSSFADE (option a) ET PAS UN PORTAGE
// --------------------------------------------------------------------------------------------
// Marche / arret / pousser vivent sur <Figure> (socle StickFigure.tsx, convention : 0 = membre
// qui PEND). S'asseoir vit sur <Stick>, un moteur DIFFERENT de GestesExpressifs16x9, avec un
// type Pose different (champs obligatoires bob/leanBuste/brasAvantAngle...) et une convention
// d'angle INVERSEE (le socle dit noir sur blanc : "NE PAS COPIER cette convention-la").
//
// 3 options etaient possibles. J'ai retenu (a), le CROSSFADE, apres avoir mesure la geometrie :
//
//   (a) CROSSFADE  <- RETENU. Les deux moteurs dessinent la MEME anatomie. Verifie par calcul
//       (script de geometrie rejouant les 2 chaines cinematiques, pas a l'oeil), pose debout :
//           hanche   Figure (0, -27.2)   Stick (0, -26.0)   ecart 1.2
//           epaule   Figure (0, -59.2)   Stick (0, -58.0)   ecart 1.2
//           tete     Figure (3, -71.2)   Stick (3, -69.0)   ecart 2.2
//           pieds    Figure (+-4.1, 6.5) Stick (+-3.0, 7.9) ecart 1.2 / 1.3
//       Soit un ecart MAXIMAL de 2.2 unites locales sur le squelette (tete), le reste sous 1.4.
//       Ces 1.2 d'ecart viennent d'une seule chose : la pose plantee de l'arret pose la hanche a
//       -27.2 (= -26 - 1.2, le tassement de l'appui) la ou Stick debout est a -26.0. On annule
//       donc l'ecart par un OFFSET DE RACCORD applique au <g> qui porte le Stick (jamais aux
//       poses internes) -> les deux silhouettes se superposent au pixel pres pendant le fondu.
//       Seuls les BRAS divergent (~14 unites) : Figure les tient a 28 depuis l'epaule, Stick a
//       20+18 depuis un point 12% plus bas. C'est invisible ici parce que le fondu est place
//       PENDANT la premiere demi-seconde de useAssisAttendre, ou les deux corps sont debout,
//       bras le long du corps, et ou le regard suit deja la descente qui s'amorce.
//
//   (b) PORTER useAssisAttendre SUR <Figure> (retraduire les angles d'une convention a l'autre).
//       ECARTE : c'est exactement le geste qui a fait echouer les 2 prototypes precedents —
//       retraduire des angles, c'est en re-deriver, donc en inventer. Le socle documente 2 bugs
//       vecus ("oreilles de lapin", mains 28px au-dessus de l'epaule) causes par precisement ca.
//
//   (c) TOUT jouer sur <Stick> (y compris marche/pousser). ECARTE : <Stick> n'a pas de verrou
//       pas/distance, pas de legLen adaptatif (le pied ne suit pas le sol quand le bassin bouge),
//       et la marche validee par Aziz ("parfaitement bien, surtout la rapide avec le corps
//       penche") est celle de <Figure>. On perdrait le geste le mieux note du registre.
//
// --------------------------------------------------------------------------------------------
// LE VERROU PAS/DISTANCE (regle DURE du registre)
// --------------------------------------------------------------------------------------------
// x ne s'interpole JAMAIS tout seul : il derive du nombre de pas ecoules.
//   - SEGMENT A (lente -> pressee) : le swing VARIE. Le socle interdit explicitement d'appeler
//     walkDistance() sur le total dans ce cas (les pas deja poses retreciraient apres coup et le
//     personnage RECULERAIT — bug reel du 2026-07-29, 430px de recul). On integre donc
//     INCREMENTALEMENT le delta de pas avec le swing de CHAQUE frame (useMemo, deterministe).
//   - SEGMENTS B / C / D : swing CONSTANT -> la forme fermee reste correcte (le socle l'autorise
//     nommement : "Si swingDeg est CONSTANT sur toute la scene, l'appel sur le total reste
//     correct").
// Le facteur d'echelle est passe EXPLICITEMENT a walkDistance (parametre obligatoire du socle),
// parce que la <Figure> est rendue avec scale=PERSO_SCALE et que x est anime DANS le repere de
// la scene, pas dans le repere local du personnage.
//
// CONTINUITE : chaque segment demarre exactement ou le precedent s'est arrete (X_B = X_A + dA,
// etc.), calcule une seule fois en constantes — aucun saut possible.
//
// FRAME LOCALE : ArretNet et useAssisAttendre ont des seuils internes en secondes (T_STOP 1.9,
// T_ARRET 2.6, T_ASSIS 0.9) qui supposent de partir de 0. Chaque segment recoit donc
// (frame - debutDuSegment). Le modulo de boucle d'ArretNet (frame % CYCLE) est RETIRE : ici
// l'arret arrive une fois puis se tient.
//
// TECHNIQUE : frame-driven, zero Math.random, zero setTimeout / CSS transition / @keyframes.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import {
  Figure,
  type Pose,
  type WalkParams,
  walkDistance,
  BRAS_LAG,
  rad,
  NUIT,
  NUIT2,
  ENCRE,
  OR_CLAIR,
  CUIVRE,
} from "../../_shared/stick-figure-svg/StickFigure";
// ⭐ DECOR (2026-08-03) — le banc d'essai de gestes recoit son LIEU : un entrepot / quai de
// chargement, dessine en SVG pur dans le meme registre "encre sur fond nuit". Voir l'en-tete de
// DecorEntrepot.tsx pour la methode (3 plans de parallaxe, bornes derivees de la course camera,
// bande franche reservee au personnage).
// ⛔ LE DECOR NE TOUCHE NI AU TIMING NI AUX POSES : il ne fait que remplir l'arriere-plan, et il
// prend SOL_Y comme donnee d'entree immuable (le personnage y est deja ancre au pixel pres).
import { DecorEntrepot, PlanSol } from "./DecorEntrepot";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// Echelle d'affichage du personnage. A scale=1 le squelette fait ~80 unites de haut : illisible
// en 1080p. 2.6 -> ~208px, l'echelle d'usage des scenes narratives du registre.
const PERSO_SCALE = 2.6;
const SOL_Y = 812;

// ============================================================================================
// SEGMENT A — MARCHE : lente, puis pressee
// ============================================================================================
// Valeurs RECOPIEES de GestesLocomotion16x9 > VARIANTES :
//   MARCHE LENTE   : cadence 0.55 Hz, { swingMax: 16, bobAmp: 2.4, armSwing: 18 }
//   MARCHE PRESSEE : cadence 1.45 Hz, { swingMax: 21, bobAmp: 4.2, lean: 9, armSwing: 38 }
// La transition entre les deux est une rampe lissee sur chacun de ces parametres : on ne cree
// aucune allure nouvelle, on passe continument de l'allure validee n°1 a l'allure validee n°2.
const LENTE = { cadence: 0.55, swingMax: 16, bobAmp: 2.4, lean: 0, armSwing: 18 };
const PRESSEE = { cadence: 1.45, swingMax: 21, bobAmp: 4.2, lean: 9, armSwing: 38 };

const A_DUR = S(6.0);
const A_ACC0 = 2.0; // secondes : debut de l'acceleration
const A_ACC1 = 3.8; // fin de l'acceleration

const smooth = (u: number) => {
  const v = Math.max(0, Math.min(1, u));
  return v * v * (3 - 2 * v);
};
const mix = (a: number, b: number, u: number) => a + (b - a) * u;

// ============================================================================================
// ⭐⭐ CONTINUITE DE POSE AUX JONCTIONS (refonte 2026-08-03 #2, 2e retour Aziz)
// ============================================================================================
// HISTORIQUE DES 2 TENTATIVES PRECEDENTES, ET POURQUOI ELLES ONT ETE JUGEES INSUFFISANTES :
//
//   V1 — blocs stricts `if (frame < B_START) {...} else if (...)`. Chaque segment redemarrait
//        son horloge ET sa pose depuis un etat par defaut. Verdict : coupures NETTES a chaque
//        frontiere (torsoDeg sautait de 0 a 30deg en 1 frame a la jonction B->C).
//
//   V2 — FONDU DE POSE : sur 10 frames a cheval sur chaque frontiere, les poses des 2 segments
//        adjacents etaient melangees par interpolation lineaire terme-a-terme (mixPoseTerms /
//        mixParams / jonction()). Verdict d'Aziz apres visionnage : "PAS TOUT A FAIT NATURELLE".
//        ⭐ LA RAISON DE FOND, et c'est elle qui gouverne toute cette refonte : un fondu, aussi
//        doux soit-il, est une DOUBLE EXPOSITION MATHEMATIQUE de deux poses statiques. Pendant
//        les 10 frames, le corps affiche la moyenne ponderee de deux etats qui ne sont ni l'un
//        ni l'autre un vrai instant du mouvement. L'oeil lit un CROISEMENT, pas un GESTE.
//
// ⭐ V3 (ce fichier) — CONTINUITE DE POSE PAR HERITAGE, zero fondu sur A->B, B->C et C->D.
//
//   PRINCIPE, mot pour mot la demande d'Aziz : "quand il se penche et touche la caisse au lieu
//   de revenir a un etat initial [...] il pousse immediatement apres ; quand il arrive au banc,
//   au lieu de revenir a un etat initial [...] que le mouvement de s'asseoir se declenche
//   automatiquement [...] que les differents etats se fassent en continu SANS AUCUN FONDU,
//   comme une VRAIE ANIMATION."
//
//   Traduction technique appliquee ici : chaque geste PART LITTERALEMENT D'OU LE PRECEDENT S'EST
//   ARRETE. Sa POSE DE DEPART n'est plus une constante ecrite a la main, c'est un PARAMETRE
//   D'ENTREE alimente par la pose de sortie REELLE du geste d'avant (lue dans le code, jamais
//   devinee). Le mouvement du geste suivant s'enchaine alors comme un seul mouvement continu.
//
// ⛔⛔ LE GARDE-FOU, TRANCHE PAR AZIZ ET RESPECTE INTEGRALEMENT :
//   On ne modifie QUE LE POINT D'ENTREE de chaque geste (pose initiale / condition de depart).
//   On ne touche JAMAIS AU COEUR d'un geste une fois lance :
//     · les cadences de marche (LENTE / PRESSEE / la rampe allureA) : INTACTES
//     · les springs et poses-cles internes d'ArretNet (inertie, balanResiduel, pose plantee,
//       la formule d'integrale de phase) : INTACTES
//     · la logique de poussee (lean 30, hipDrop 3, swing 16, cadence 0.42, a-coups de caisse,
//       cibles hand1/hand2 sur la face) : INTACTES
//     · les 3 couches d'immobilite habitee de useAssisAttendre (respiration ~4s, balancement
//       ~9s+~14.6s, micro-ajustements ecretes), le spring d'impact, la courbe de `desc` : INTACTS
//     · la table APPUI_BANC (solutions d'equation, pas des reglages) : INTACTE
//   Interface d'entree parametrable + coeur de geste inchange. C'est tout.
//
// ⭐ VERIFICATION PAR CALCUL, JAMAIS AU JUGE (methode imposee par le registre, deja appliquee
//    partout dans ce fichier). Un script rejouant les 2 chaines cinematiques a mesure, AVANT
//    d'ecrire une seule ligne, l'ecart REEL a chaque frontiere de l'ancien systeme :
//      A->B : cadence 1.45 -> 1.15 Hz (-0.30), swing 21 -> 18 (-3.0), lean 9 -> 0 (-9.0),
//             armSwing 38 -> 24 (-14.0), et la phase de marche RESET a 0 (perte de 0.027 cycle)
//      B->C : torsoDeg -1.455 -> 30.0 en UNE frame ; les mains sautent de (0.8,-31.3)/(-6.9,-31.6)
//             a (29.0,-37.7)/(27.0,-23.0), soit 75px et 91px A L'ECRAN, instantanement
//      C->D : torsoDeg 30 -> 0 en une frame ; phase 0.506 -> 0 (le cycle de pas repart de zero)
//      D->E : hipY -28.19 -> -27.2, leg 6.05/-6.05 -> 7/-7, arm -0.67/-5.53 -> 8/-8, et 0.9s
//             d'attente IMMOBILE (T_ASSIS) sans aucun lien avec l'elan de la marche
//    Toutes les valeurs de raccord ecrites ci-dessous sont DERIVEES de ces mesures.
//
// --------------------------------------------------------------------------------------------
// CE QUI RESTE DE L'ANCIEN SYSTEME : rien sur A->B, B->C, C->D (fondu SUPPRIME, y compris les
// fonctions mixPoseTerms/mixParams/jonction qui n'ont plus d'appelant). Sur D->E il subsiste un
// crossfade de 6 frames — mais UNIQUEMENT pour la bascule de MOTEUR (<Figure> -> <Stick>), pas
// pour la pose : la pose, elle, est desormais heritee. Justification mesuree au § D->E.
// --------------------------------------------------------------------------------------------

// Le mecanisme concret, dans les 4 cas : une constante `sortieX` (ou `X_FIN_*`) calculee UNE
// SEULE FOIS, qui rejoue les formules du segment X a sa DERNIERE frame rendue, et que le segment
// suivant consomme comme condition de depart. Chaque valeur est donc LUE dans le code du geste
// precedent, jamais ecrite a la main :
//   A -> B : A_FIN (allure) + A_FIN_PHASE (cycle de pas)
//   B -> C : sortieB (torse + position REELLE des 2 mains)
//   C -> D : C_FIN_PHASE (cycle de pas)
//   D -> E : sortieD (pose complete) -> DEBOUT_STICK (la meme, convertie pour l'autre moteur)

// ============================================================================================
// ⭐ PARADE A LA POSE DEGENEREE (BRAS_LAG) — corrige un defaut VU AU RENDER, pas anticipe
// ============================================================================================
// CONSTATE a la frame 30 du 1er render : le personnage se lisait comme un TRAIT VERTICAL surmonte
// d'une tete (bras ET jambes superposes au corps). Ce n'est pas un bug de ce fichier : c'est la
// limite connue du socle, documentee en tete de StickFigure.tsx — "BRAS_LAG EST EXPORTE MAIS
// Figure NE L'APPLIQUE PAS". Les bras automatiques valent -sin(a)*armSwing avec le MEME `a` que
// les jambes : les deux s'annulent donc simultanement 2x par cycle (~9% du temps en pose
// degeneree, mesure 62 a 84 frames sur 720 par marcheur).
//
// La parade prescrite par le socle est cote APPELANT (⛔ ne pas modifier le socle : les 6
// planches validees en dependent) : passer arm1Deg/arm2Deg dephases de BRAS_LAG, EN SOUSTRAYANT
// le torso que Figure re-ajoute aux angles MANUELS (`a1 = pose.arm1Deg + torso`).
// ⛔ Interdit explicite du socle : ne PAS "corriger" par un plancher dur sur le swing (ca ecrase
// l'oscillation des jambes et produit un glissement — anti-pattern deja documente).
//
// Verifie par calcul avant re-render : sans lag, min(|jambes| + |bras|) = 0.00 deg (les deux
// s'annulent ensemble) ; avec lag, le minimum remonte a 5.49 deg (marche lente) et 7.22 deg
// (marche pressee) — le corps n'est donc JAMAIS entierement referme sur son axe.
// ⚠️ MESURE AVANT / APRES (largeur horizontale totale de la silhouette, en px a l'ecran, trait
// de 11.7px) — c'est la methode imposee par le registre : "valider toute pose par l'ECART EN
// PIXELS aux extremites, jamais au juge".
//   - Figure nu (bras et jambes sur le MEME sin)      : largeur min 0.0px  -> un seul trait
//   - avec BRAS_LAG seul, les 2 bras sur le meme sin  : largeur min 8.8px  -> encore < au trait
//   - avec BRAS_LAG + les 2 bras dephases ENTRE EUX   : largeur min 21.6px -> silhouette ouverte
// Le 2e cas est celui que j'ai rendu en premier : le personnage se lisait encore comme un baton
// vertical a la frame 30 (defaut VU, pas anticipe). La cause est que -sin(a-LAG) et +sin(a-LAG)
// s'annulent au MEME instant : les deux bras collent au corps ensemble, exactement quand les
// jambes se croisent. C'est le point que le socle nomme comme reste a traiter : "Dephaser les
// bras ENTRE EUX, pas seulement vs les jambes (le fix BRAS_LAG=0.35 traite jambes<->bras
// uniquement)". On applique donc BRAS_LAG au bras avant, et BRAS_LAG*2 au bras arriere : les
// deux bras ne passent plus jamais par zero en meme temps, et aucun des deux ne le fait au
// croisement des jambes.
// ⛔ On ne touche NI au swing des jambes (plancher dur interdit : ca produit un glissement), NI
// aux poses validees : c'est une correction de PHASE des bras, cote appelant, la parade que le
// socle prescrit lui-meme.
const brasDephases = (phase: number, armSwing: number, lean: number): Pick<Pose, "arm1Deg" | "arm2Deg"> => {
  const a = phase * Math.PI * 2;
  // meme amplitude et meme formule que Figure (-sin / +sin), mais chaque bras sur SA phase ;
  // on retire `lean` parce que Figure fera `arm1Deg + torso` et que torso vaut ici P.lean.
  return {
    arm1Deg: -Math.sin(a - BRAS_LAG) * armSwing - lean,
    arm2Deg: Math.sin(a - BRAS_LAG * 2) * armSwing - lean,
  };
};

// allure (cadence + params de marche) a l'instant t, en secondes
const allureA = (t: number) => {
  const u = smooth((t - A_ACC0) / (A_ACC1 - A_ACC0));
  return {
    cadence: mix(LENTE.cadence, PRESSEE.cadence, u),
    swingMax: mix(LENTE.swingMax, PRESSEE.swingMax, u),
    bobAmp: mix(LENTE.bobAmp, PRESSEE.bobAmp, u),
    lean: mix(LENTE.lean, PRESSEE.lean, u),
    armSwing: mix(LENTE.armSwing, PRESSEE.armSwing, u),
  };
};

// ⭐ INTEGRATION INCREMENTALE (obligatoire : le swing varie sur ce segment).
// Table pre-calculee une fois : pour chaque frame, le nombre de pas cumules ET la distance
// cumulee A L'ECRAN. Deterministe (aucune dependance a l'ordre de rendu des frames de Remotion :
// la table entiere est recalculee a l'identique a chaque appel).
type TableMarche = { pas: number[]; dist: number[] };
const construireTableA = (): TableMarche => {
  const pas: number[] = [0];
  const dist: number[] = [0];
  const dt = 1 / FPS;
  let p = 0;
  let d = 0;
  for (let f = 0; f < A_DUR; f++) {
    const al = allureA(f * dt);
    const dPas = al.cadence * 2 * dt; // 1 cycle = 2 pas
    p += dPas;
    // le DELTA de distance utilise le swing DE CETTE FRAME-LA (jamais le swing courant applique
    // retroactivement au total — c'est le bug de recul documente dans le socle).
    d += walkDistance(dPas, al.swingMax, PERSO_SCALE);
    pas.push(p);
    dist.push(d);
  }
  return { pas, dist };
};
const TABLE_A = construireTableA();
// ⚠️ CORRIGE (2026-08-03 #2) : on prend la distance a la DERNIERE FRAME RENDUE de A (index
// A_DUR - 1), pas le total de la table (index A_DUR, une frame qui n'est jamais affichee).
// Defaut MESURE : X_B valait 976.90 alors que le personnage etait a 970.77 sur sa derniere frame
// visible -> un saut de +6.12px a la frontiere A->B, soit exactement un pas de marche pressee
// avale d'un coup. C'est faible mais c'est un VRAI saut de position, du meme genre que ceux
// qu'on corrige ici. Le defaut preexistait (il n'est pas introduit par cette refonte).
const A_DIST = TABLE_A.dist[A_DUR - 1];
// ⭐ CONTINUITE DU CYCLE DE PAS : la phase atteinte a la derniere frame RENDUE de A. Le segment B
// repart de cette phase-la (et non de 0) — sinon le personnage change de jambe d'appui d'une
// frame a l'autre. Mesure : 0.0267 cycle, soit ~19deg de ciseau, largement visible a 208px.
const A_FIN_PHASE = (TABLE_A.pas[A_DUR - 1] / 2) % 1;

// ============================================================================================
// SEGMENT B — S'ARRETER NET  ⭐ JONCTION A->B : LA DECELERATION PART DE LA VITESSE REELLE
// ============================================================================================
// Constantes et formules RECOPIEES de GestesLocomotion16x9 > ArretNet. Adaptations, toutes
// imposees par l'enchainement narratif :
//   1. le modulo de boucle (frame % CYCLE) est RETIRE : il s'arrete une fois, il ne reboucle pas.
//   2. la frame est LOCALE au segment (t part de 0), ce qu'attendent T_STOP / T_ARRET.
//   3. ⭐ NOUVEAU — LE POINT D'ENTREE EST HERITE DE A (c'est la jonction A->B).
//
// ⛔ LE DEFAUT DE L'ANCIENNE VERSION, MESURE (pas suppose) : ArretNet redemarrait a cad0 = 1.15 Hz
// et swing 18, alors que le segment A se termine a 1.45 Hz et swing 21. Le personnage RALENTISSAIT
// donc INSTANTANEMENT de 1.45 a 1.15 Hz (-21% de cadence) a la frontiere, avant meme d'avoir
// commence a freiner — un saut de VITESSE, invisible comme "coupure" mais bien present comme
// "ca ne coule pas". Idem lean (9 -> 0), armSwing (38 -> 24), bobAmp (4.2 -> 2.8) et la phase de
// marche remise a 0 (le pied changeait de jambe d'appui d'une frame a l'autre).
//
// ⭐ LE FIX : les 5 parametres de depart de B ne sont plus des litteraux, ils sont LUS a la
// derniere frame de A (constantes A_FIN_* ci-dessous, calculees une seule fois). Le freinage
// commence donc exactement a la vitesse a laquelle A s'est arrete. Le personnage marche vite,
// PUIS freine — au lieu de ralentir d'un coup puis freiner.
//
// ⛔ LE COEUR D'ArretNet EST INTACT : la forme de la rampe de deceleration (integrale analytique
// avec le terme k - k^2 + k^3/3), l'inertie du buste (0 -> 13 -> -4 -> 0), le balancement residuel
// amorti (cos(dt*7.6) * 15 * exp(-dt*2.6)), la pose plantee (hipY -27.2, jambes 7/-7, bras 8/-8) :
// aucune de ces valeurs n'est touchee. Seul le POINT DE DEPART change.
//
// ⭐ DUREE DU FREINAGE — DERIVEE, PAS DEVINEE. Le geste original freine de 1.15 Hz a 0 en
// (2.6 - 1.9) = 0.7s, soit un TAUX de deceleration de 1.15/0.7 = 1.6429 Hz/s. Ce taux EST le
// geste (c'est lui qui donne la sensation de freinage franc). En partant de 1.45 Hz, conserver ce
// meme taux impose une duree de 1.45/1.6429 = 0.8826s, donc T_ARRET = 1.9 + 0.8826 = 2.7826s.
// ⛔ On garde le TAUX du geste valide, on n'invente pas une nouvelle duree : c'est exactement le
// principe "coeur inchange, point d'entree parametre". Verifie : il reste 0.617s d'amortissement
// APRES l'arret complet, dans B_DUR = 3.4s, donc le balancement residuel a le temps de s'eteindre.
const A_FIN = allureA((A_DUR - 1) / FPS); // l'allure REELLE de la derniere frame rendue de A
const B_CAD0 = A_FIN.cadence;   // 1.45 (etait 1.15)
const B_SWING = A_FIN.swingMax; // 21   (etait 18)
const B_LEAN0 = A_FIN.lean;     // 9    (le buste est encore penche quand il commence a freiner)
const B_ARMSW0 = A_FIN.armSwing;// 38
const B_BOB0 = A_FIN.bobAmp;    // 4.2
const B_T_STOP = 1.9;
const B_TAUX_DECEL = 1.15 / 0.7;                       // Hz/s — LE taux du geste valide
const B_T_ARRET = B_T_STOP + B_CAD0 / B_TAUX_DECEL;    // 2.7826s (etait 2.6)
const B_DUR = S(3.4); // le temps que le balancement residuel s'eteigne apres T_ARRET

// phase = INTEGRALE de la cadence (analytique — formule RECOPIEE telle quelle, seules les
// bornes cad0/T_ARRET sont desormais heritees de A).
// ⭐ La phase est DECALEE de la phase de fin de A (A_FIN_PHASE) : le cycle de pas ne repart pas
// de zero, il CONTINUE. Sans ce decalage, le personnage changeait de jambe d'appui a la frontiere.
const phaseIntB = (u: number): number => {
  if (u <= B_T_STOP) return B_CAD0 * u;
  const d = Math.min(u, B_T_ARRET) - B_T_STOP;
  const span = B_T_ARRET - B_T_STOP;
  const k = d / span;
  const integ = B_CAD0 * span * (k - k * k + (k * k * k) / 3);
  return B_CAD0 * B_T_STOP + integ;
};
// swing CONSTANT sur ce segment -> forme fermee autorisee par le socle
// ⚠️ (B_DUR - 1) / FPS et non B_DUR / FPS : la distance du segment est celle atteinte a sa
// DERNIERE FRAME RENDUE. Meme correction que pour A_DIST — sinon le segment suivant demarre
// quelques px devant l'endroit ou le personnage se trouvait reellement.
// (Ici l'ecart etait nul en pratique — B est deja arrete depuis longtemps a B_DUR — mais on
// applique la meme regle partout pour que la continuite soit garantie par CONSTRUCTION.)
const B_DIST = walkDistance(phaseIntB((B_DUR - 1) / FPS) * 2, B_SWING, PERSO_SCALE);

// ⭐ LE BUSTE SE REDRESSE PENDANT LE FREINAGE. Le segment A finit lean = 9 (marche pressee,
// corps en avant) ; l'arret se joue buste vertical (c'est la pose plantee du geste valide, qui
// part de torsoDeg = inertie, donc ~0). Faire retomber le lean de 9 a 0 EXACTEMENT sur la fenetre
// de freinage [T_STOP, T_ARRET] est la lecture physique du geste : on se redresse quand on freine.
// ⛔ Ce n'est PAS une pose nouvelle : c'est la valeur de depart (9, heritee de A) qui rejoint la
// valeur d'arrivee (0) du geste valide, sur la fenetre que le geste valide definit deja.
const leanB = (t: number) => mix(B_LEAN0, 0, smooth((t - B_T_STOP) / (B_T_ARRET - B_T_STOP)));
// idem pour les 2 autres parametres d'allure herites : ils rejoignent les valeurs du geste valide
// (armSwing 24, bobAmp 2.8) sur la meme fenetre de freinage.
const armSwB = (t: number) => mix(B_ARMSW0, 24, smooth((t - B_T_STOP) / (B_T_ARRET - B_T_STOP)));
const bobB = (t: number) => mix(B_BOB0, 2.8, smooth((t - B_T_STOP) / (B_T_ARRET - B_T_STOP)));

// ============================================================================================
// SEGMENT C — POUSSER LA CAISSE
// ============================================================================================
// RECOPIE de GestesLocomotion16x9 > BandePoids, bloc POUSSER, valeur pour valeur :
//   cadence 0.42 (c'est LA CHARGE qui ralentit, jamais un reglage a la main)
//   swing 16 · p = { swingMax: 16, bobAmp: 0.8, lean: 30, hipDrop: 3, armSwing: 0 }
//   pose = { hand1: [faceX, -CAISSE*0.82], hand2: [faceX - 2, -CAISSE*0.5], headTuck: 0.3 }
//   acoup = max(0, sin(a)) * 2.4  (la caisse avance par A-COUPS, un par appui)
//   CAISSE = 46 (agrandie apres render : a 34 elle lisait comme un carre decoratif)
const C_CAD = 0.42;
const C_SWING = 16;
const C_DUR = S(6.0);
const CAISSE = 46;

// ⭐⭐ JONCTION B->C — LA PRISE EN MAIN (le point le plus visible signale par Aziz)
// --------------------------------------------------------------------------------------------
// MESURE DU DEFAUT (script de geometrie, avant tout code) : a la frontiere, torsoDeg passait de
// -1.455deg (fin de l'arret, buste quasi vertical) a 30deg (lean du pousseur) EN UNE FRAME, et
// les DEUX MAINS se teleportaient de leur position au repos le long du corps vers la face de la
// caisse — un trajet de 28.91 et 34.98 unites locales, soit 75px et 91px A L'ECRAN, en 1/30e de
// seconde. C'est le "l'action coupe" d'Aziz : il ne se penche pas, il EST penche.
//
// ⭐ LE GESTE MANQUANT, ET C'EST UN VRAI GESTE : il se penche ET tend les bras vers la caisse,
// puis pousse. On l'implemente comme une RAMPE D'ENTREE du segment C (T_PRISE frames), pendant
// laquelle :
//   · torsoDeg   va de la valeur de sortie REELLE de B (l'inertie residuelle) vers 30
//   · hipDrop    va de 0 vers 3        (les jambes encaissent progressivement la charge)
//   · bobAmp     va de 2.8 (fin de B) vers 0.8  (le corps se plaque au sol sous l'effort)
//   · les MAINS  vont de leur position de sortie REELLE de B vers la face de la caisse
//   · la CADENCE de poussee va de 0 vers C_CAD
//
// ⭐ LE DERNIER POINT EST LE PLUS IMPORTANT — LA CAUSALITE : la cadence part de 0, donc la caisse
// NE BOUGE PAS tant que les mains ne l'ont pas atteinte. Avant, la caisse commencait a avancer
// des la 1re frame de C, alors que le personnage venait tout juste de se materialiser penche
// dessus. Maintenant : il arrive, il se penche, il pose les mains, PUIS la caisse part. C'est
// exactement "il se penche et touche la caisse, il pousse immediatement apres".
//
// ⛔ COEUR DE LA POUSSEE INTACT : lean 30, hipDrop 3, swing 16, bobAmp 0.8, armSwing 0, cadence
// 0.42, a-coups max(0,sin(a))*2.4, cibles hand1/hand2 sur la face de la caisse, headTuck 0.3 —
// toutes ces valeurs sont celles du geste valide et ne sont PAS modifiees. Seule la RAMPE D'ENTREE
// est nouvelle, et elle ne fait que RELIER la sortie de B a ces valeurs-la.
//
// DUREE : 0.75s. Verifie par calcul que la longueur du bras (epaule -> main interpolee) reste
// credible pendant tout le trajet : maximum 30.56 unites, sous la limite de ~34 du registre
// ("JAMAIS au-dela de ~97% de la portee, un bras en butee glisse et tremble"). A 0.5s le bras
// atteignait 33+ sur la 2e main : trop tendu. 0.75s est la duree la plus courte qui reste saine.
const C_PRISE = S(0.75);

// ⭐ La cadence de poussee monte de 0 a C_CAD sur la rampe de prise. La phase est son INTEGRALE
// (analytique, deterministe — jamais une accumulation frame a frame, cf. la note du geste valide).
// Integrale de C_CAD * smoothstep(t/T) : on l'evalue en fermant la forme sur smoothstep, dont
// la primitive de 3u^2-2u^3 est u^3 - u^4/2, soit T*(k^3 - k^4/2) avec k = t/T.
const C_TP = C_PRISE / FPS;
const phaseIntC = (t: number): number => {
  if (t <= 0) return 0;
  if (t >= C_TP) {
    const k = 1;
    return C_CAD * C_TP * (k * k * k - (k * k * k * k) / 2) + C_CAD * (t - C_TP);
  }
  const k = t / C_TP;
  return C_CAD * C_TP * (k * k * k - (k * k * k * k) / 2);
};
// swing CONSTANT sur C -> forme fermee autorisee par le socle (walkDistance sur le total des pas)
const C_DIST = walkDistance(phaseIntC((C_DUR - 1) / FPS) * 2, C_SWING, PERSO_SCALE);

// ============================================================================================
// SEGMENT D — MARCHE COURTE VERS LE BANC   ⭐ JONCTION C->D : IL SE REDRESSE ET LACHE
// ============================================================================================
// Retour a la MARCHE LENTE validee (mêmes valeurs que la table VARIANTES).
//
// ⚠️ DUREE CORRIGEE APRES RENDER (3.0s -> 5.6s). Defaut VU au contact-sheet de la transition :
// le personnage s'asseyait DANS la caisse. Cause mesuree, pas devinee : il lache la caisse a
// x=1626 (elle est devant lui, il vient de la pousser jusque la) et ne parcourait ensuite que
// 160px — donc il s'arretait a x=1651, soit 26px DERRIERE la face de la caisse, et le banc etait
// dessine au meme endroit. Il faut qu'il DEPASSE franchement la caisse avant de trouver le banc.
//
// ⚠️⚠️ DUREE RE-CORRIGEE (5.6s -> 6.8s), consequence MESUREE de la jonction A->B ci-dessus.
// En faisant partir le freinage de 1.45 Hz (au lieu de 1.15) et en allongeant la fenetre de
// freinage au meme taux, B_DIST passe de 268px a 403px : TOUT le decor aval se decale de +135px.
// Le banc se retrouvait alors a 16.8px seulement de la face droite de la caisse abandonnee — le
// personnage se serait assis en frolant la caisse, exactement le defaut deja corrige une fois.
// 6.8s de marche lente = 364px (au lieu de 300), ce qui redonne ~80px de degagement entre la
// caisse et le bord gauche du banc. ⛔ L'allure elle-meme n'est PAS touchee : seule la DUREE
// change, donc la distance. C'est un ajustement de mise en scene, pas de geste.
const D_DUR = S(6.8);

// ⭐⭐ JONCTION C->D — LE REDRESSEMENT (rampe de SORTIE du geste de poussee)
// --------------------------------------------------------------------------------------------
// MESURE DU DEFAUT : torsoDeg passait de 30 a 0 en une frame (le pousseur se redressait
// instantanement), les mains quittaient la caisse pour reapparaitre en balancement de marche, et
// la phase du cycle de pas etait remise a 0 alors qu'elle valait 0.506 — le personnage changeait
// de jambe d'appui au milieu d'un pas.
//
// ⭐ FIX EN DEUX TEMPS :
//
//   1. LA PHASE EST HERITEE. D repart de la phase exacte de fin de C. Et il se trouve — verifie
//      par calcul, ce n'est pas une chance mais la consequence du fait que les deux gestes
//      partagent le meme swing — que C_SWING (16) == LENTE.swingMax (16). A phase egale, le
//      ciseau des jambes est donc RIGOUREUSEMENT IDENTIQUE des deux cotes de la frontiere :
//      ecart mesure 0.000 deg. La marche reprend litteralement le pas en cours. AUCUN fondu
//      n'est necessaire sur les jambes — c'est deja le meme mouvement.
//
//   2. LE BUSTE SE REDRESSE ET LES MAINS LACHENT, sur une rampe de sortie D_LACHE. Pendant
//      cette fenetre : torsoDeg 30 -> 0, hipDrop 3 -> 0, bobAmp 0.8 -> 2.4, armSwing 0 -> 18,
//      et surtout les MAINS interpolent depuis la face de la caisse vers la position que leur
//      donnerait deja le balancement automatique de la marche. Le passage "main pilotee par une
//      cible" -> "bras pilote par un angle" devient donc continu, alors qu'il etait un saut.
//
// DUREE : 0.8s. Verifie par calcul : la longueur du bras reste entre 18.95 et 28.05 unites sur
// toute la rampe (limite credible ~34) — le bras ne se tend jamais anormalement.
//
// ⛔ COEUR DE LA MARCHE LENTE INTACT : cadence 0.55, swingMax 16, bobAmp 2.4, armSwing 18, et le
// dephasage BRAS_LAG. La rampe ne fait que REJOINDRE ces valeurs depuis celles du pousseur.
const D_LACHE = S(0.8);
const D_DIST = walkDistance((D_DUR - 1) / FPS * LENTE.cadence * 2, LENTE.swingMax, PERSO_SCALE);

// ============================================================================================
// SEGMENT E — S'ASSEOIR SUR LE BANC, ET ATTENDRE   ⭐ JONCTION D->E
// ============================================================================================
// ⭐ "que le mouvement de s'asseoir se declenche AUTOMATIQUEMENT" (Aziz) : T_ASSIS passe de 0.9s
// a 0. La descente s'enclenche des l'arrivee au banc, sans le temps mort debout. Voir le detail
// et la mesure au § useAssisAttendre plus bas.
const E_DUR = S(8.2); // 1.35 (descente, demarree immediatement) + ~6.8s d'immobilite habitee

// ---- bornes de frame : chaque segment demarre ou le precedent finit ----
export const A_START = 0;
export const B_START = A_START + A_DUR;
export const C_START = B_START + B_DUR;
export const D_START = C_START + C_DUR;
export const E_START = D_START + D_DUR;
export const ENCHAINEMENT_FRAMES = E_START + E_DUR;

// ---- positions : continuite garantie par construction ----
const X_A = 260;                 // il entre par la gauche
const X_B = X_A + A_DIST;        // ou l'arret commence
const X_C = X_B + B_DIST;        // ou il empoigne la caisse
const X_D = X_C + C_DIST;        // ou il lache la caisse
const X_E = X_D + D_DIST;        // devant le banc

// ============================================================================================
// LE MOTEUR "S'ASSEOIR" — <Stick> et useAssisAttendre, RECOPIES de GestesExpressifs16x9
// ============================================================================================
// ⛔ CE BLOC EST UNE COPIE CONFORME. Sa convention d'angle est l'INVERSE de celle du socle
// (ici 180 = bras vers le haut). Elle ne doit JAMAIS etre melangee avec celle de <Figure> :
// c'est precisement le bug "oreilles de lapin" documente dans StickFigure.tsx. Ces deux mondes
// se touchent uniquement par le fondu croise, jamais par un echange de valeurs d'angle.
type PoseStick = {
  bob: number;
  leanBuste: number;
  leanTete: number;
  brasAvantAngle: number;
  brasArriereAngle: number;
  brasAvantCoude: number;
  brasArriereCoude: number;
  jambeAvant: number;
  jambeArriere: number;
  jambeAvantGenou: number;
  jambeArriereGenou: number;
  dx: number;
  dy: number;
  hancheY: number;
};

const POSE_NEUTRE: PoseStick = {
  bob: 0,
  leanBuste: 0,
  leanTete: 0,
  brasAvantAngle: 12,
  brasArriereAngle: -8,
  brasAvantCoude: 8,
  brasArriereCoude: 8,
  jambeAvant: 5,
  jambeArriere: -5,
  jambeAvantGenou: 0,
  jambeArriereGenou: 0,
  dx: 0,
  dy: 0,
  hancheY: -26,
};

const chaine = (
  ox: number, oy: number, l1: number, l2: number, racineAngle: number, flexion: number,
): { mx: number; my: number; ex: number; ey: number } => {
  const a1 = rad(racineAngle);
  const mx = ox + Math.sin(a1) * l1;
  const my = oy + Math.cos(a1) * l1;
  const a2 = rad(racineAngle + flexion);
  const ex = mx + Math.sin(a2) * l2;
  const ey = my + Math.cos(a2) * l2;
  return { mx, my, ex, ey };
};

const Stick: React.FC<{
  x: number; y: number; pose: PoseStick; opacity?: number; couleur?: string; tilt?: number;
  scale?: number;
}> = ({ x, y, pose, opacity = 1, couleur = ENCRE, tilt = 0, scale = 1 }) => {
  const p = pose;
  const hx = 0;
  const hy = p.hancheY - p.bob;
  const busteL = 32;
  const sx = hx + Math.sin(rad(180 + p.leanBuste)) * busteL;
  const sy = hy + Math.cos(rad(180 + p.leanBuste)) * busteL;
  const teteA = rad(180 + p.leanBuste + p.leanTete);
  const tx = sx + Math.sin(teteA) * 11 + 3;
  const ty = sy + Math.cos(teteA) * 11;

  const epX = sx + (hx - sx) * 0.12;
  const epY = sy + (hy - sy) * 0.12;
  const brasA = chaine(epX, epY, 20, 18, p.brasAvantAngle + p.leanBuste, p.brasAvantCoude);
  const brasB = chaine(epX, epY, 20, 18, -p.brasArriereAngle + p.leanBuste, -p.brasArriereCoude);

  const jbA = chaine(hx, hy, 17, 17, p.jambeAvant, p.jambeAvantGenou);
  const jbB = chaine(hx, hy, 17, 17, p.jambeArriere, p.jambeArriereGenou);

  const L = (a: number, b: number, c: number, d: number, w = 4.5, o = 1, key?: string) => (
    <line key={key} x1={a} y1={b} x2={c} y2={d} stroke={couleur} strokeWidth={w}
      strokeLinecap="round" opacity={o} />
  );

  return (
    <g transform={`translate(${x + p.dx * scale} ${y + p.dy * scale}) scale(${scale}) rotate(${tilt})`}
      opacity={opacity}>
      {L(hx, hy, jbB.mx, jbB.my, 4.5, 0.75, "jb1")}
      {L(jbB.mx, jbB.my, jbB.ex, jbB.ey, 4.5, 0.75, "jb2")}
      {L(epX, epY, brasB.mx, brasB.my, 4.2, 0.75, "brb1")}
      {L(brasB.mx, brasB.my, brasB.ex, brasB.ey, 4.2, 0.75, "brb2")}
      {L(hx, hy, sx, sy, 4.5, 1, "buste")}
      {L(hx, hy, jbA.mx, jbA.my, 4.5, 1, "ja1")}
      {L(jbA.mx, jbA.my, jbA.ex, jbA.ey, 4.5, 1, "ja2")}
      {L(epX, epY, brasA.mx, brasA.my, 4.2, 1, "bra1")}
      {L(brasA.mx, brasA.my, brasA.ex, brasA.ey, 4.2, 1, "bra2")}
      <circle cx={tx} cy={ty} r={9} fill={couleur} />
    </g>
  );
};

// APPUIS.banc — RECOPIE. Ces angles sont des SOLUTIONS d'equation, pas des reglages : pour une
// hauteur d'assise SEAT et une cuisse d'angle A, le tibia verifie cos(B) = (SEAT - 17.cos A)/17.
// Verifie ici par calcul avant render : bassin exactement a y=-18 (la surface du banc), pieds a
// y=-0.94 et -0.37 (au sol). Ne pas retoucher ces 4 nombres.
const APPUI_BANC = {
  seat: 18, cuisseA: 84, flexA: -58, cuisseB: 78, flexB: -44,
  brasAngle: 48, brasCoude: -30,
};

// ============================================================================================
// ⭐⭐ JONCTION D->E — LA POSE DEBOUT DE DEPART EST CELLE DE LA FIN DE LA MARCHE
// ============================================================================================
// C'est la demande la plus explicite d'Aziz sur cette jonction : "que le mouvement de s'asseoir
// se declenche AUTOMATIQUEMENT", et que la pose de depart soit "litteralement la pose de fin de
// la marche du segment D (buste, bras dans la continuite du dernier pas), au lieu de reinitialiser
// a une pose neutre".
//
// ⭐ LE POINT STRUCTUREL QUI REND CA POSSIBLE, ET QUI EST LA CLE DE TOUTE CETTE JONCTION :
// useAssisAttendre est ecrit ENTIEREMENT sous la forme
//        articulation = interpolate(desc, [0, 1], [VAL_DEBOUT, VAL_ASSIS])
// ou `desc` est l'avancement de la descente (0 = debout, 1 = assis). Les VAL_DEBOUT sont donc,
// litteralement et par construction, LA POSE DE DEPART DU GESTE — exactement le "point d'entree"
// que la consigne autorise a parametrer. Les VAL_ASSIS (la table APPUI_BANC : seat 18, cuisseA 84,
// flexA -58, cuisseB 78, flexB -44, brasAngle 48, brasCoude -30) sont, elles, LE GESTE, et elles
// ne bougent pas d'un iota.
//
// ⛔⛔ CE QUI RESTE STRICTEMENT INTACT DANS CETTE FONCTION (verifiable ligne a ligne ci-dessous) :
//   · la courbe de descente `desc` : [0, 0.85s, 1.35s] -> [0, 0.7, 1], easing lineaire
//   · le contretemps du buste `busteAvant` : [0, 0.7s, 1.5s, 2.1s] -> [0, 22, 22, 7]
//   · le spring d'impact (mass 0.7, damping 9, stiffness 190) et `encaisse` (3.5 -> 0)
//   · LES 3 COUCHES DE L'IMMOBILITE HABITEE, au complet et inchangees :
//       respiration ~4s · balancement du poids ~9s + ~14.6s · micro-ajustements ecretes
//       (decl(0.0271,0.0113,0.55) / decl(0.0189,0.0074,0.62) / decl(0.0143,0.0097,0.68))
//   · tous les coefficients de melange de ces couches sur chaque articulation (resp*-0.9,
//     poids*2.6, ajDos*7, ajTete*-13, ajJambe*7, etc.)
//   · la table APPUI_BANC
//
// ⭐ CE QUI CHANGE, ET RIEN D'AUTRE :
//   1. T_ASSIS : S(0.9) -> 0. La descente demarre a la frame 0 du segment. Le "micro-freeze"
//      de 27 frames debout et immobile disparait — c'est le "declenchement automatique" demande.
//      ⚠️ Consequence VERIFIEE : `busteAvant`, `impact` et `ta` etaient tous exprimes en
//      `T_ASSIS + S(x)`. Avec T_ASSIS = 0 ils deviennent `S(x)`, donc toute la sequence interne
//      garde EXACTEMENT les memes durees relatives — elle est seulement avancee de 0.9s. Aucune
//      courbe n'est deformee, aucun timing interne n'est comprime.
//   2. Les VAL_DEBOUT ne sont plus des litteraux (-26, 12, -8, 8, 8, 5, -5, 0, 0) mais les champs
//      d'un objet `debout` passe en parametre, alimente par la pose REELLE de fin de D.
//
// ⭐ CONVERSION DES ANGLES — VERIFIEE PAR CALCUL, PAS TRADUITE AU JUGE.
// Les 2 moteurs n'ont pas la meme convention (c'est le bug "oreilles de lapin" du registre), donc
// on ne recopie AUCUN angle : on RESOUT la correspondance geometrique, et on la verifie.
//   BUSTE   : Figure  epaule = hanche + (sin(torso)*32, -cos(torso)*32)
//             Stick   epaule = hanche + (sin(180+leanBuste)*32, cos(180+leanBuste)*32)
//             sin(180+L) = -sin(L) et cos(180+L) = -cos(L)  =>  leanBuste = -torsoDeg
//             Verifie a torso = 0 / 9 / 30 / -3 : ecart 0.000 unite dans les 4 cas.
//   JAMBES  : Figure  pied = hanche + (sin(deg)*34, cos(deg)*34)
//             Stick   chaine(hanche,17,17,deg,0) = hanche + (sin(deg)*34, cos(deg)*34)
//             => MEME FORMULE. jambeAvant = leg1Deg, jambeArriere = leg2Deg, genoux = 0.
//             Verifie numeriquement : ecart 0.0 (au flottant pres).
//   BRAS    : Figure  a1 = arm1Deg + torso ; Stick racine = brasAvantAngle + leanBuste
//             avec leanBuste = -torso  =>  brasAvantAngle = arm1Deg + 2*torso
//             bras arriere : racine = -brasArriereAngle + leanBuste => brasArriereAngle = -arm2Deg - 2*torso
//             A la fin de D la marche lente a lean = 0, donc simplement brasAvantAngle = arm1Deg
//             et brasArriereAngle = -arm2Deg. Coudes a 0 (Figure dessine un bras DROIT).
//
// ⭐ RESULTAT MESURE (silhouette complete, ecart Figure vs Stick a l'instant de la bascule) :
//     hanche 0.00px · epaule 0.00px · tete 2.60px · (trait du corps : 11.7px)
//   Les 3 points qui portent la lecture de la posture se superposent donc AU PIXEL PRES.
//
// ⚠️⚠️ LA LIMITE HONNETE, MESUREE ET NON CONTOURNABLE — pourquoi un crossfade TRES court subsiste
// sur cette seule jonction (les 3 autres n'en ont plus aucun) :
//   Les deux moteurs n'ont pas les MEMES LONGUEURS DE MEMBRES, et ce n'est pas un reglage :
//     · bras   : Figure 28 unites depuis l'epaule · Stick 20+18 = 38 depuis un point 12% plus bas
//     · jambes : Figure adapte sa longueur pour coller au sol (Leff = -hipY/cos, donc <= 28.4 en
//                marche) · Stick a 17+17 = 34 en dur
//   J'ai teste et MESURE 5 strategies pour annuler cet ecart :
//     (a) poser la main du Stick sur celle de Figure par IK -> coude a -101deg, bras en V :
//         la silhouette du bras devient franchement differente (37.9px d'ecart de trace).
//     (b) IK partiel (50%) -> le meilleur compromis, mais encore 26.5px d'ecart.
//     (c) allonger les bras de Figure a 41.84 (valeur qui aligne EXACTEMENT les deux mains,
//         verifiee a 0.24px pres !) -> mais c'est +49% de longueur de bras sur la fin de la
//         marche : des bras de singe. REJETE.
//     (d) allonger les jambes de Figure a 34 en fournissant leg1Deg/leg2Deg -> le socle passe
//         alors en longueur fixe, mais il faut remonter la hanche de 5.6 unites pour garder les
//         pieds au sol : le personnage GRANDIT de 14.6px. REJETE.
//     (e) choisir la frame de bascule ou les membres sont les plus verticaux -> gain reel mais
//         partiel, l'ecart de longueur subsiste par construction.
//   => L'ecart de longueur de membre est STRUCTUREL entre les 2 moteurs. Aucune pose ne l'annule.
//   Le fichier avait deja tranche (et c'est le bon choix) : on aligne HANCHE/EPAULE/TETE, qui
//   portent la lecture de la posture, et on laisse les extremites diverger. Ce qui change ici,
//   c'est que la pose de depart etant desormais HERITEE, l'ecart total de silhouette tombe de
//   45.3px (POSE_NEUTRE arbitraire) a 36.0px, et surtout il ne porte plus sur la POSTURE (qui est
//   exacte) mais uniquement sur la LONGUEUR des extremites. Le crossfade de 6 frames sert donc
//   uniquement a absorber ce residu de longueur, plus du tout un changement de pose.
//   ⛔ Le seul moyen d'aller plus loin serait de porter useAssisAttendre sur <Figure>, ce que le
//   fichier a explicitement ecarte en tete (option b) : retraduire des angles, c'est en inventer,
//   et c'est ce qui a fait echouer les 2 prototypes precedents.
type DeboutStick = {
  hancheY: number;
  leanBuste: number;
  brasAvantAngle: number;
  brasArriereAngle: number;
  brasAvantCoude: number;
  brasArriereCoude: number;
  jambeAvant: number;
  jambeArriere: number;
};

// useAssisAttendre — RECOPIE de GestesExpressifs16x9 (variante "banc" seule), avec sa POSE DEBOUT
// DE DEPART rendue parametrable (cf. le long § ci-dessus). Les 3 couches de l'immobilite habitee
// sont conservees telles quelles : respiration (~4s), balancement du poids (~9s + ~14.6s),
// micro-ajustements brefs et espaces (~13s, non periodiques a l'oeil). C'est elle qui fait le
// travail pendant l'attente — rien n'est ajoute par-dessus.
const useAssisAttendre = (
  frameLocal: number, fps: number, debout: DeboutStick,
): { pose: PoseStick; assis: number } => {
  const f = frameLocal;
  const A = APPUI_BANC;
  // ⭐ 0 au lieu de S(0.9) : la descente s'enclenche des l'arrivee (aucun temps mort debout).
  // Toutes les bornes internes restent exprimees en T_ASSIS + S(x) : les durees RELATIVES du
  // geste sont donc rigoureusement inchangees, la sequence est seulement avancee de 0.9s.
  const T_ASSIS = 0;

  const desc = interpolate(f, [T_ASSIS, T_ASSIS + S(0.85), T_ASSIS + S(1.35)], [0, 0.7, 1], {
    ...clamp, easing: (t) => t,
  });
  const busteAvant = interpolate(f,
    [T_ASSIS, T_ASSIS + S(0.7), T_ASSIS + S(1.5), T_ASSIS + S(2.1)],
    [0, 22, 22, 7], clamp);
  const impact = spring({
    frame: f - (T_ASSIS + S(1.35)), fps,
    config: { mass: 0.7, damping: 9, stiffness: 190 },
  });
  const encaisse = f >= T_ASSIS + S(1.35)
    ? interpolate(impact, [0, 1], [3.5, 0], clamp)
    : 0;

  const ta = Math.max(0, f - (T_ASSIS + S(1.35)));

  const respPhase = ta * (2 * Math.PI) / S(4.0);
  const resp = Math.sin(respPhase);

  const poids = Math.sin(ta * (2 * Math.PI) / S(9.0)) * 0.62
    + Math.sin(ta * (2 * Math.PI) / S(14.6)) * 0.38;

  const decl = (a: number, b: number, seuil: number) =>
    Math.max(0, Math.sin(ta * a) * Math.sin(ta * b) - seuil) / (1 - seuil);
  const ajTete = decl(0.0271, 0.0113, 0.55);
  const ajDos = decl(0.0189, 0.0074, 0.62);
  const ajJambe = decl(0.0143, 0.0097, 0.68);

  // ⭐ SEULE MODIFICATION DE CORPS : chaque `interpolate(desc, [0,1], [X, VAL_ASSIS])` voit son X
  // (la valeur DEBOUT, c.-a-d. le point d'entree du geste) lu dans `debout` au lieu d'etre un
  // litteral. Les VAL_ASSIS (A.seat, A.cuisseA, A.flexA, A.cuisseB, A.flexB, A.brasAngle,
  // A.brasCoude) et TOUS les termes d'immobilite habitee sont identiques a l'original.
  return {
    assis: desc,
    pose: {
      ...POSE_NEUTRE,
      hancheY: interpolate(desc, [0, 1], [debout.hancheY, -A.seat], clamp) + encaisse,
      leanBuste: interpolate(desc, [0, 1], [debout.leanBuste, 0], clamp)
        + busteAvant * (1 - desc * 0.15)
        + desc * (resp * -0.9 + poids * 2.6 - ajDos * 7),
      leanTete: desc * (4 + resp * 0.8 + ajTete * -13 - poids * 1.6),
      brasAvantAngle: interpolate(desc, [0, 1], [debout.brasAvantAngle, A.brasAngle], clamp)
        + desc * (poids * 2.2 + ajDos * 5),
      brasArriereAngle: interpolate(desc, [0, 1], [debout.brasArriereAngle, A.brasAngle - 8], clamp)
        + desc * poids * 1.8,
      brasAvantCoude: interpolate(desc, [0, 1], [debout.brasAvantCoude, A.brasCoude], clamp)
        + desc * (resp * 1.2 - ajTete * 9),
      brasArriereCoude: interpolate(desc, [0, 1], [debout.brasArriereCoude, A.brasCoude + 4], clamp)
        + desc * resp * 1.0,
      jambeAvant: interpolate(desc, [0, 1], [debout.jambeAvant, A.cuisseA], clamp)
        + desc * (ajJambe * 7 + poids * 1.4),
      jambeArriere: interpolate(desc, [0, 1], [debout.jambeArriere, A.cuisseB], clamp)
        + desc * (poids * -1.2),
      jambeAvantGenou: interpolate(desc, [0, 1], [0, A.flexA], clamp) + desc * ajJambe * -8,
      jambeArriereGenou: interpolate(desc, [0, 1], [0, A.flexB], clamp),
      bob: desc * (resp * 1.5 + poids * 0.9),
      dx: desc * poids * 1.3,
      dy: 0,
    },
  };
};

// ============================================================================================
// DECOR — volontairement minimal : le sujet du test est le personnage, pas le decor.
// ============================================================================================
// Le banc reprend le dessin du registre (DessinAppui "banc" : un trait + 2 pieds, meme encre,
// meme epaisseur que les accessoires du registre). Note de mise en scene d'Aziz : "dans une
// vraie scene, dessiner un VRAI banc plutot que le banc-trait des protos" — ici on est justement
// dans un banc d'essai de gestes, donc on garde le banc-trait valide pour ne rien introduire de
// neuf a juger a cote des gestes.
const Banc: React.FC<{ x: number; solY: number; scale: number }> = ({ x, solY, scale }) => {
  const y = solY - APPUI_BANC.seat * scale;
  return (
    <g stroke={ENCRE} strokeWidth={3.8 * scale} strokeLinecap="round" fill="none" opacity={0.9}>
      <line x1={x - 34 * scale} y1={y} x2={x + 40 * scale} y2={y} />
      <line x1={x - 26 * scale} y1={y} x2={x - 26 * scale} y2={solY} />
      <line x1={x + 32 * scale} y1={y} x2={x + 32 * scale} y2={solY} />
    </g>
  );
};

// La caisse — meme dessin que BandePoids (rect + une latte, or clair, jamais de remplissage).
const Caisse: React.FC<{ x: number; solY: number; scale: number }> = ({ x, solY, scale }) => {
  const c = CAISSE * scale;
  return (
    <g transform={`translate(${x} ${solY})`}>
      <rect x={-c / 2} y={-c} width={c} height={c} fill="none"
        stroke={OR_CLAIR} strokeWidth={3.5 * scale} strokeLinejoin="round" />
      <line x1={-c / 2} y1={-c * 0.62} x2={c / 2} y2={-c * 0.62}
        stroke={OR_CLAIR} strokeWidth={2 * scale} opacity={0.6} />
    </g>
  );
};

// ============================================================================================
// LA SCENE
// ============================================================================================
export const EnchainementGestesValides: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------------------------------------
  // 1. OU EST LE PERSONNAGE, ET QUE FAIT-IL ? (un seul x, continu par construction)
  // ---------------------------------------------------------------------------------------
  // Chaque segment est une fonction PURE poseX(frameAbsolue) -> {x, phase, params, pose}.
  // ⭐ Chacune commence par une RAMPE D'ENTREE qui part de l'etat de sortie REEL du segment
  // precedent (constantes sortieB / C_FIN_PHASE / sortieD / A_FIN, calculees une seule fois en
  // rejouant les formules du geste d'avant a sa derniere frame). Passe cette rampe, le calcul
  // INTERNE de chaque segment (cadences, angles, springs, poses-cles) est RECOPIE tel quel du
  // geste valide — seul le POINT D'ENTREE est parametre.
  type EtatPerso = { x: number; phase: number; params: Partial<WalkParams>; pose: Pose | undefined };

  const poseA = (frameAbs: number): EtatPerso => {
    const fA = Math.max(0, Math.min(A_DUR, frameAbs));
    const i = Math.min(TABLE_A.pas.length - 1, Math.floor(fA));
    const al = allureA(fA / FPS);
    const xx = X_A + TABLE_A.dist[i];
    const ph = (TABLE_A.pas[i] / 2) % 1;
    return {
      x: xx, phase: ph,
      params: { swingMax: al.swingMax, bobAmp: al.bobAmp, lean: al.lean, armSwing: al.armSwing },
      pose: brasDephases(ph, al.armSwing, al.lean),
    };
  };

  // ------------------------------------------------------------------------------------
  // SEGMENT B — l'arret. ⭐ Son point d'entree est HERITE de A (cadence/swing/lean/armSwing/
  // bob/phase reels de la derniere frame de A). Le coeur du geste (rampe de deceleration,
  // inertie du buste, balancement residuel, pose plantee) est RECOPIE tel quel.
  // ------------------------------------------------------------------------------------
  const poseB = (frameAbs: number): EtatPerso => {
    const fB = Math.max(0, frameAbs - B_START);
    const tB = fB / FPS;
    const arreteB = tB >= B_T_ARRET;
    // ⭐ la phase CONTINUE celle de A (decalage A_FIN_PHASE) — le cycle de pas ne repart pas de 0
    const ph = (A_FIN_PHASE + phaseIntB(tB)) % 1;
    const xx = X_B + walkDistance(phaseIntB(tB) * 2, B_SWING, PERSO_SCALE);
    // ⛔ COEUR RECOPIE : inertie du haut du corps, meme table de points-cles
    const inertie = interpolate(tB, [B_T_STOP + 0.15, B_T_ARRET, B_T_ARRET + 0.45, B_T_ARRET + 1.0],
      [0, 13, -4, 0], clamp);
    const dtArret = tB - B_T_ARRET;
    // ⛔ COEUR RECOPIE : pendule amorti des bras a l'arret
    const balanResiduel = arreteB
      ? Math.cos(dtArret * 7.6) * 15 * Math.exp(-dtArret * 2.6)
      : 0;
    // ⭐ les 3 parametres d'allure herites de A rejoignent ceux du geste valide sur la fenetre
    // de freinage (le buste se redresse EN freinant — lecture physique, pas un reglage).
    const leanCourant = leanB(tB);
    return {
      x: xx, phase: ph,
      params: { swingMax: B_SWING, bobAmp: bobB(tB), armSwing: armSwB(tB), lean: leanCourant },
      pose: arreteB
        ? {
            // ⛔ POSE PLANTEE — RECOPIEE VALEUR POUR VALEUR du geste valide
            hipY: -26 - 1.2,
            torsoDeg: inertie,
            leg1Deg: 7,
            leg2Deg: -7,
            arm1Deg: 8 + balanResiduel - inertie * 0.35,
            arm2Deg: -8 + balanResiduel * 0.85 - inertie * 0.35,
          }
        : {
            // pendant le freinage : le buste porte l'inertie ET le lean residuel de la marche
            // pressee qui se resorbe. brasDephases est la parade BRAS_LAG, inchangee.
            torsoDeg: inertie + leanCourant,
            ...brasDephases(ph, armSwB(tB), inertie + leanCourant),
          },
    };
  };

  // ⭐ ETAT DE SORTIE DE B, calcule une seule fois : c'est lui qui amorce la prise en main de C.
  // Lu a la DERNIERE frame rendue de B (B_DUR - 1), jamais devine.
  const sortieB = (() => {
    const tB = (B_DUR - 1) / FPS;
    const inertie = interpolate(tB, [B_T_STOP + 0.15, B_T_ARRET, B_T_ARRET + 0.45, B_T_ARRET + 1.0],
      [0, 13, -4, 0], clamp);
    const dtArret = tB - B_T_ARRET;
    const balan = Math.cos(dtArret * 7.6) * 15 * Math.exp(-dtArret * 2.6);
    const torso = inertie;
    const arm1 = 8 + balan - inertie * 0.35;
    const arm2 = -8 + balan * 0.85 - inertie * 0.35;
    const hipY = -26 - 1.2;
    // position REELLE des 2 mains a la fin de B, calculee avec la formule EXACTE de <Figure>
    // (epaule = hanche + (sin(torso)*32, -cos(torso)*32) ; main = epaule + (sin(a)*28, cos(a)*28)
    // avec a = armDeg + torso). C'est le point de depart du trajet des mains vers la caisse.
    const sx = Math.sin(rad(torso)) * 32;
    const sy = hipY - Math.cos(rad(torso)) * 32;
    const a1 = arm1 + torso;
    const a2 = arm2 + torso;
    return {
      torso,
      main1: [sx + Math.sin(rad(a1)) * 28, sy + Math.cos(rad(a1)) * 28] as [number, number],
      main2: [sx + Math.sin(rad(a2)) * 28, sy + Math.cos(rad(a2)) * 28] as [number, number],
    };
  })();

  // ------------------------------------------------------------------------------------
  // SEGMENT C — la poussee. ⭐ Son point d'entree est une RAMPE DE PRISE EN MAIN (C_PRISE)
  // qui part de la pose de sortie REELLE de B : le buste descend, les mains vont chercher la
  // caisse, et la cadence de poussee monte de 0 (donc la caisse ne part QU'UNE FOIS TOUCHEE).
  // ⛔ Passe la rampe, toutes les valeurs sont celles du geste valide, inchangees.
  // ------------------------------------------------------------------------------------
  const poseC = (frameAbs: number): EtatPerso => {
    const fC = Math.max(0, frameAbs - C_START);
    const tC = fC / FPS;
    // avancement de la prise en main (0 = il arrive, 1 = mains posees, il pousse)
    const u = smooth(fC / C_PRISE);
    // ⭐ phase = integrale de la cadence qui monte de 0 a C_CAD (analytique, deterministe)
    const phC = phaseIntC(tC) % 1;
    const aPo = phC * Math.PI * 2;
    const acoupC = Math.max(0, Math.sin(aPo)) * 2.4;
    const xxPousseur = X_C + walkDistance(phaseIntC(tC) * 2, C_SWING, PERSO_SCALE);
    const faceXlocalC = 52 + acoupC - CAISSE / 2;
    // cibles finales des mains sur la face de la caisse — ⛔ valeurs du geste valide
    const cible1: [number, number] = [faceXlocalC, -CAISSE * 0.82];
    const cible2: [number, number] = [faceXlocalC - 2, -CAISSE * 0.5];
    return {
      x: xxPousseur, phase: phC,
      params: {
        swingMax: C_SWING,
        // ⭐ les 3 parametres d'allure partent de ceux de la fin de B et rejoignent ceux du
        // pousseur (bob 2.8 -> 0.8, hipDrop 0 -> 3, lean torso_sortieB -> 30)
        bobAmp: mix(2.8, 0.8, u),
        lean: mix(sortieB.torso, 30, u),
        hipDrop: mix(0, 3, u),
        armSwing: 0,
      },
      pose: {
        // ⭐ les mains VONT CHERCHER la caisse depuis leur position reelle de fin de B
        hand1: [mix(sortieB.main1[0], cible1[0], u), mix(sortieB.main1[1], cible1[1], u)],
        hand2: [mix(sortieB.main2[0], cible2[0], u), mix(sortieB.main2[1], cible2[1], u)],
        headTuck: mix(0, 0.3, u), // ⛔ 0.3 = valeur du geste valide
      },
    };
  };

  // ⭐ PHASE DE SORTIE DE C : le segment D en herite pour que le cycle de pas ne reparte pas de 0.
  // C_SWING (16) == LENTE.swingMax (16) -> a phase egale, le ciseau des jambes est IDENTIQUE des
  // deux cotes de la frontiere (ecart mesure 0.000 deg). La marche reprend le pas en cours.
  const C_FIN_PHASE = phaseIntC((C_DUR - 1) / FPS) % 1;

  // ------------------------------------------------------------------------------------
  // SEGMENT D — la marche vers le banc. ⭐ Son point d'entree est une RAMPE DE LACHAGE
  // (D_LACHE) : le buste se redresse de 30 a 0, les mains quittent la caisse pour rejoindre
  // le balancement automatique, et la phase est HERITEE de C.
  // ⛔ Passe la rampe, c'est la MARCHE LENTE validee, valeur pour valeur.
  // ------------------------------------------------------------------------------------
  const poseD = (frameAbs: number): EtatPerso => {
    const fD = Math.max(0, frameAbs - D_START);
    const tD = fD / FPS;
    const xx = X_D + walkDistance(tD * LENTE.cadence * 2, LENTE.swingMax, PERSO_SCALE);
    // ⭐ la phase CONTINUE celle de C
    const ph = (C_FIN_PHASE + tD * LENTE.cadence) % 1;
    const u = smooth(fD / D_LACHE); // 0 = il tient encore la caisse, 1 = marche libre
    // valeurs d'allure : de celles du pousseur vers celles de la marche lente
    const lean = mix(30, LENTE.lean, u);
    const armSw = mix(0, LENTE.armSwing, u);
    const bras = brasDephases(ph, armSw, lean);
    if (u >= 1) {
      // ⛔ MARCHE LENTE VALIDEE, strictement inchangee
      return {
        x: xx, phase: ph,
        params: { swingMax: LENTE.swingMax, bobAmp: LENTE.bobAmp, armSwing: LENTE.armSwing, lean: LENTE.lean },
        pose: brasDephases(ph, LENTE.armSwing, LENTE.lean),
      };
    }
    // pendant le lachage : les mains interpolent de la face de la caisse vers la position que
    // leur donne DEJA le balancement automatique. Le passage "main sur cible" -> "bras sur
    // angle" devient continu au lieu d'etre un saut.
    const aPo = ph * Math.PI * 2;
    const acoupC = Math.max(0, Math.sin(aPo)) * 2.4;
    const faceX = 52 + acoupC - CAISSE / 2;
    const bobD = mix(0.8, LENTE.bobAmp, u);
    const hipDropD = mix(3, 0, u);
    const hy = -26 - Math.abs(Math.cos(aPo)) * bobD + hipDropD;
    const sx = Math.sin(rad(lean)) * 32;
    const sy = hy - Math.cos(rad(lean)) * 32;
    const autoMain = (armDeg: number): [number, number] => {
      const a = armDeg + lean;
      return [sx + Math.sin(rad(a)) * 28, sy + Math.cos(rad(a)) * 28];
    };
    const auto1 = autoMain(bras.arm1Deg as number);
    const auto2 = autoMain(bras.arm2Deg as number);
    const cai1: [number, number] = [faceX, -CAISSE * 0.82];
    const cai2: [number, number] = [faceX - 2, -CAISSE * 0.5];
    return {
      x: xx, phase: ph,
      params: { swingMax: LENTE.swingMax, bobAmp: bobD, armSwing: armSw, lean, hipDrop: hipDropD },
      pose: {
        hand1: [mix(cai1[0], auto1[0], u), mix(cai1[1], auto1[1], u)],
        hand2: [mix(cai2[0], auto2[0], u), mix(cai2[1], auto2[1], u)],
        headTuck: mix(0.3, 0, u),
      },
    };
  };

  // ⭐ ETAT DE SORTIE DE D — la pose REELLE de la derniere frame de la marche. C'est elle qui
  // devient la pose DEBOUT de depart du geste "s'asseoir" (cf. le long § sur la jonction D->E).
  // ⛔ Lue dans le code, jamais devinee : memes formules que poseD ci-dessus.
  const sortieD = (() => {
    const tD = (D_DUR - 1) / FPS;
    const ph = (C_FIN_PHASE + tD * LENTE.cadence) % 1;
    const a = ph * Math.PI * 2;
    const swing = Math.sin(a) * LENTE.swingMax;
    const bob = Math.abs(Math.cos(a)) * LENTE.bobAmp;
    const bras = brasDephases(ph, LENTE.armSwing, LENTE.lean);
    return {
      phase: ph,
      swing,
      hipY: -26 - bob,
      torso: LENTE.lean, // 0 en marche lente
      arm1: bras.arm1Deg as number,
      arm2: bras.arm2Deg as number,
    };
  })();

  // ⭐ CONVERSION Figure -> Stick de la pose de sortie de D (correspondances demontrees et
  // verifiees numeriquement dans le § de la jonction D->E) :
  //   leanBuste = -torsoDeg · jambeAvant = leg1Deg · jambeArriere = leg2Deg · genoux = 0
  //   brasAvantAngle = arm1Deg + 2*torso · brasArriereAngle = -arm2Deg - 2*torso · coudes = 0
  const DEBOUT_STICK: DeboutStick = {
    hancheY: sortieD.hipY,
    leanBuste: -sortieD.torso,
    brasAvantAngle: sortieD.arm1 + 2 * sortieD.torso,
    brasArriereAngle: -sortieD.arm2 - 2 * sortieD.torso,
    brasAvantCoude: 0,
    brasArriereCoude: 0,
    jambeAvant: sortieD.swing,
    jambeArriere: -sortieD.swing,
  };

  // ------------------------------------------------------------------------------------
  // SEGMENT E — <Figure> tient la pose exacte de sortie de D pendant que <Stick> prend le
  // relais. ⛔ La pose n'est plus une constante "debout neutre" : c'est la derniere pose
  // reelle de la marche, figee le temps du remplacement de moteur (6 frames).
  // ------------------------------------------------------------------------------------
  const poseE = (): EtatPerso => ({
    x: X_E, phase: sortieD.phase,
    params: { swingMax: LENTE.swingMax, bobAmp: LENTE.bobAmp, armSwing: LENTE.armSwing, lean: LENTE.lean },
    pose: {
      hipY: sortieD.hipY,
      torsoDeg: sortieD.torso,
      leg1Deg: sortieD.swing,
      leg2Deg: -sortieD.swing,
      arm1Deg: sortieD.arm1,
      arm2Deg: sortieD.arm2,
    },
  });

  // ---- SELECTION DU SEGMENT ACTIF — ⭐ PLUS AUCUN FONDU ----
  // Chaque geste part de l'etat ou le precedent s'est arrete (rampes d'entree/sortie ci-dessus),
  // donc la simple selection par intervalle suffit : il n'y a plus de saut a masquer.
  // ⛔ L'ancien systeme (fonction `jonction()` + mixPoseTerms + mixParams sur une fenetre de 10
  // frames a cheval sur chaque frontiere) est SUPPRIME — c'est lui qu'Aziz a juge "pas tout a
  // fait naturel", parce qu'un fondu affiche la moyenne de deux poses statiques au lieu d'un
  // vrai mouvement.
  let etat: EtatPerso;
  if (frame < B_START) {
    etat = poseA(frame);
  } else if (frame < C_START) {
    etat = poseB(frame);
  } else if (frame < D_START) {
    etat = poseC(frame);
  } else if (frame < E_START) {
    etat = poseD(frame);
  } else {
    etat = poseE();
  }

  let x = etat.x;
  let phase = etat.phase;
  let params = etat.params;
  let pose = etat.pose;

  // ---- valeurs annexes encore necessaires plus bas (caisse, camera, bascule Figure->Stick) ----
  // ⚠️ RECALCULEES AVEC phaseIntC (la cadence qui monte de 0 pendant la prise en main), donc
  // STRICTEMENT COHERENTES avec poseC : c'est ce qui garantit que la caisse ne bouge pas tant
  // que les mains ne l'ont pas atteinte. Utiliser l'ancienne formule (tC * C_CAD) ici ferait
  // avancer la caisse sans que le pousseur la touche — desynchronisation main/objet.
  const enC = frame >= C_START && frame < D_START;
  const fC = frame - C_START;
  const tC = fC / FPS;
  const phC = phaseIntC(Math.max(0, tC)) % 1;
  const aPo = phC * Math.PI * 2;
  const acoup = Math.max(0, Math.sin(aPo)) * 2.4;
  const xPousseur = X_C + walkDistance(phaseIntC(Math.max(0, tC)) * 2, C_SWING, PERSO_SCALE);

  // --- SEGMENT E : s'asseoir (moteur <Stick>) ---
  // ⭐ La pose DEBOUT de depart du geste est desormais DEBOUT_STICK = la pose reelle de fin de la
  // marche D, convertie dans la convention du <Stick> (correspondances demontrees plus haut).
  // Le geste ne "revient" plus a un etat initial arbitraire : il PART de la marche.
  const enE = frame >= E_START;
  const fE = frame - E_START;
  const { pose: poseAssis } = useAssisAttendre(Math.max(0, fE), fps, DEBOUT_STICK);

  // ---------------------------------------------------------------------------------------
  // 2. LA BASCULE DE MOTEUR Figure -> Stick — UNE COUPE FRANCHE, PLUS AUCUN FONDU
  // ---------------------------------------------------------------------------------------
  // ⭐ CE QUI A CHANGE : il n'y a plus NULLE PART de fondu dans cette scene. La pose est HERITEE
  // des deux cotes — <Figure> tient exactement la derniere pose de la marche (poseE), et <Stick>
  // DEMARRE exactement de cette meme pose convertie (DEBOUT_STICK). Les deux moteurs affichent
  // donc la MEME POSTURE a l'instant du remplacement, ce qui rend le fondu inutile ET nuisible.
  //
  // ⭐ ET LA COUPE SE JOUE AU MEILLEUR INSTANT POSSIBLE. Avant, T_ASSIS = 0.9s figeait le
  // personnage debout et immobile, et le fondu se jouait sur ce freeze — un temps mort ou l'oeil
  // n'avait rien d'autre a regarder que le remplacement. Avec T_ASSIS = 0, la descente est deja
  // engagee : la frame qui suit la coupe voit deja le bassin descendre et le buste partir en
  // avant. Le mouvement couvre le remplacement au lieu de l'exposer.
  //
  // ⚠️⚠️ CORRIGE APRES RENDER (2026-08-03 #2) — LE CROSSFADE EST SUPPRIME, C'EST UNE COUPE FRANCHE.
  // DEFAUT VU au contact-sheet des frames 666-672 (pas anticipe, CONSTATE) : sur les 6 frames de
  // fondu, le personnage devenait semi-transparent et on lisait DEUX SILHOUETTES SUPERPOSEES —
  // tete delavee, jambes dedoublees. Exactement le defaut de "double exposition" que le fichier
  // documentait deja pour un fondu de 15 frames : le raccourcir de 15 a 6 l'avait attenue, pas
  // supprime.
  //
  // ⭐ LA CAUSE, ET POURQUOI LA COUPE FRANCHE EST MAINTENANT LA BONNE REPONSE :
  // un crossfade affiche les DEUX corps EN MEME TEMPS a opacite partielle. Il ne peut donc que
  // MONTRER l'ecart entre eux. Tant que cet ecart portait sur la POSTURE (l'ancien systeme :
  // POSE_NEUTRE arbitraire vs pose de marche, 45.3px d'ecart), le fondu servait au moins a etaler
  // un saut de pose. Maintenant que la pose est HERITEE, il n'y a PLUS de saut de pose a etaler :
  //   hanche 0.00px · epaule 0.00px · tete 2.60px   (mesure a l'instant de la bascule)
  // Le seul ecart residuel est la LONGUEUR des membres (bras 72.8 -> 98.8px, jambe 73.8 -> 88.4px
  // le long de leur propre axe), qui est structurelle aux 2 moteurs. Un fondu la transforme en
  // fantome ; une coupe franche la reduit a un allongement du trait sur UNE frame, a pleine
  // opacite, sans aucun dedoublement.
  //
  // ⛔ REGLE GENERALE A RETENIR : un crossfade ne masque un ecart que si cet ecart est un SAUT DE
  // POSE. Face a un ecart de PROPORTION (longueur de membre, echelle), il le DOUBLE au lieu de le
  // cacher — la coupe franche est alors strictement meilleure.
  const opFigure = enE ? 0 : 1;
  const opStick = enE ? 1 : 0;

  // ⭐ OFFSET DE RACCORD — recalcule pour la pose heritee (mesure, jamais devine).
  // La hanche du <Stick> demarre desormais a DEBOUT_STICK.hancheY, c'est-a-dire EXACTEMENT la
  // hanche de <Figure> a la derniere frame de la marche (sortieD.hipY). Les deux hanches sont
  // donc a la meme ordonnee LOCALE par construction : l'offset de raccord vaut 0.
  // ⛔ L'ancienne valeur (-1.2) compensait l'ecart entre la pose PLANTEE de l'arret (hipY -27.2)
  // et le POSE_NEUTRE du Stick (-26). Ces deux poses n'interviennent plus ici : la garder
  // introduirait maintenant un decalage de 3.12px au lieu d'en corriger un.
  // Verifie par calcul sur la silhouette complete a l'instant de la bascule :
  //   hanche 0.00px · epaule 0.00px · tete 2.60px (trait du corps : 11.7px).
  const RACCORD_Y = 0;

  // ---------------------------------------------------------------------------------------
  // 3. CAMERA — un travelling lateral doux qui garde le personnage dans le cadre.
  // ---------------------------------------------------------------------------------------
  // Le personnage parcourt ~1390px : sans camera il sortirait du cadre. La camera SUIT sa
  // position reelle (elle derive donc du pas, comme lui), avec un amortissement : elle se cale
  // sur x - CAM_AVANCE, borne pour ne jamais depasser la scene.
  const CAM_AVANCE = 660;
  const camX = Math.max(-60, x - CAM_AVANCE);
  // ⭐ COURSE REELLE DE LA CAMERA — derivee, jamais codee en dur. C'est ce que le decor consomme
  // pour dimensionner ses 3 plans : le plan lointain defile a 0.18, donc si on lui donnait la
  // largeur du monde a facteur 1, son bord gauche entrerait dans le cadre en fin de travelling.
  // camX minimal = -60 (la borne de la formule ci-dessus, atteinte tant que x < 600)
  // camX maximal = X_E - CAM_AVANCE (le personnage finit immobile devant le banc)
  // Mesure a la date de ce commit : -60 -> 1305.23, soit une fenetre monde de -60 a 3225.23.
  const CAM_MIN = -60;
  const CAM_MAX = Math.max(CAM_MIN, X_E - CAM_AVANCE);

  // fondu d'ouverture / fermeture
  const op = interpolate(frame, [0, 14, ENCHAINEMENT_FRAMES - 18, ENCHAINEMENT_FRAMES],
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

  // la caisse reste ou il l'a laissee une fois la poussee terminee.
  // ⛔ REVERT (2026-08-03) : Aziz prefere le comportement d'origine — un banc d'essai SANS
  // profondeur n'a de toute facon aucune notion d'evitement credible ; "passer a travers"
  // fait plus de sens narratif ici que le petit decalage qui rendait la caisse orpheline.
  const caisseX = frame < C_START
    ? X_C + 52 * PERSO_SCALE
    : (enC ? xPousseur + (52 + acoup) * PERSO_SCALE : X_D + 52 * PERSO_SCALE);

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 40%, ${NUIT} 0%, ${NUIT2} 100%)`,
      opacity: op,
    }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {/* ===== CIEL : ne bouge PAS avec la camera (facteur 0) — c'est le plan le plus lointain.
            ⚠️ Le decor d'entrepot etant une NEF FERMEE, les etoiles ne sont plus "le ciel de la
            scene" mais ce qu'on apercoit par la verriere et la porte de quai : leur opacite est
            donc reduite (elles passent derriere le mur du fond, monte juste apres) et leur bande
            verticale est ramenee au tiers haut du cadre, la ou se trouvent effectivement les
            baies. ⛔ Le PRNG et le nombre d'etoiles sont inchanges : zero Math.random. ===== */}
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y * 0.42} r={s.r} fill={ENCRE} opacity={s.o * 0.55} />
        ))}

        {/* ===== LE DECOR D'ARRIERE-PLAN (2 plans a parallaxe lente, facteurs 0.18 et 0.55).
            ⛔ Il vit HORS du groupe monde : il applique lui-meme sa propre translation, sinon il
            subirait -camX en plus de son facteur. Ecrit AVANT tout le reste -> il est donc
            toujours DERRIERE le sol, la caisse, le banc et le personnage. ===== */}
        <DecorEntrepot
          camX={camX} camMin={CAM_MIN} camMax={CAM_MAX} vw={W} solY={SOL_Y}
        />

        {/* ===== LE MONDE (tout ce qui defile sous la camera, facteur 1) ===== */}
        <g transform={`translate(${-camX} 0)`}>
          {/* ⭐ LE SOL DU QUAI — il REMPLACE la ligne nue + les reperes abstraits d'origine, mais
              il conserve la ligne SOL_Y EXACTEMENT au meme endroit (c'est elle qui prouve que les
              pieds ne patinent pas, et c'est l'ancrage deja valide du personnage). Ce qu'il ajoute
              autour d'elle : la dalle en perspective, les joints de beton, le nez de quai et sa
              bande de signalisation, les butoirs — ces derniers reprenant le role d'echelle du
              deplacement que jouaient les reperes au sol. */}
          <PlanSol solY={SOL_Y} xMin={CAM_MIN - 200} xMax={CAM_MAX + W + 200} />

          {/* la caisse */}
          <Caisse x={caisseX} solY={SOL_Y} scale={PERSO_SCALE} />

          {/* le banc */}
          <Banc x={X_E} solY={SOL_Y} scale={PERSO_SCALE} />

          {/* ===== LE PERSONNAGE ===== */}
          {/* moteur 1 : <Figure> — marche, arret, poussee (convention du socle : 0 = pend) */}
          {opFigure > 0.004 && (
            <Figure
              x={x} y={SOL_Y} phase={phase} p={params} pose={pose}
              scale={PERSO_SCALE} opacity={opFigure}
            />
          )}
          {/* moteur 2 : <Stick> — s'asseoir (convention INVERSE, jamais melangee avec celle
              du socle : les deux mondes ne se touchent que par ce fondu) */}
          {opStick > 0.004 && (
            <Stick
              x={X_E} y={SOL_Y + RACCORD_Y} pose={poseAssis}
              scale={PERSO_SCALE} opacity={opStick}
            />
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default EnchainementGestesValides;
