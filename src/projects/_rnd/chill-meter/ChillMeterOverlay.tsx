// MOTEUR: objet/metaphore SVG
//
// Overlay plein cadre 1920x1080, fond TRANSPARENT, compteur verrouille en bas a gauche.
// Une seule composition parametree par `state` -> les 7 livrables du brief.
//
// Le brief exige "full-screen transparent overlays, not cropped tightly" : le compteur est
// donc positionne ICI, a sa place definitive, et le reste du cadre reste vide. La cliente
// depose le fichier dans CapCut, il se cale plein cadre, le compteur ne bouge jamais d'un pixel.

import React from "react";
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig, interpolate, staticFile, Easing } from "remotion";
import { ChillMeterDevice, DEVICE_W, DEVICE_H, type MetalFinish, type RustPass } from "./ChillMeterDevice";
import { ChillMeterRustic, RUSTIC_W, RUSTIC_H, RUSTIC_SOL_Y } from "./ChillMeterRustic";
import { BottomIceBank, FullChillCoded } from "./EffetsEcran";

/** Quel chassis on rend. "rustic" = l'image choisie par la cliente (revision 2, 04/09).
 *  "svg" = l'ancien chassis dessine, garde tant qu'elle n'a pas valide le nouveau. */
export type Chassis = "rustic" | "svg";

/** Les effets de givre plein cadre (brume du bas, onde, neige).
 *  ⭐ Coupes par defaut depuis le 04/09 : on montre L'OBJET dans son etat initial.
 *  Le givre est le sujet du JALON 2, il se retravaille apres validation de la texture.
 *  ⛔ Ne PAS supprimer ce code : il est deja ecrit et mesure, il sera rallume tel quel.
 *  Rappel du brief (p.8) : au 75 %, la brume vient du BAS UNIQUEMENT et « the rest of
 *  the screen should remain clear » — or la version actuelle couvre les 1920 px de large. */
export type Effects = "off" | "on";

export type MeterState =
  | "entrance"
  | "idle"
  | "fill25"
  | "fill50"
  | "fill75"
  | "fill100";

// Placement recalibre sur la capture de reference envoyee par Abigail (retour Jalon 1, 2026-09-01) :
// meter reduit, colle bas-gauche sous la fenetre du clip, marge de securite avec la video.
// SCALE au maximum exploitable compte tenu de l'espace vertical disponible sous la fenetre.
// ⭐ 180 (et non 198) depuis le 03/09 : elle demande le meter centre sous le cadre video
// COMPLET, « use the black side strips as guides » — donc bandes noires laterales incluses,
// pas la zone d'image. Cadre complet mesure sur son plateau : x 29..872, centre = 450.
// Le meter etait centre sur 468, soit 18 px trop a droite.
const POS_X = 180;
// ⭐ Descendu de 670 -> 706 le 02/09 : mesure sur son plateau reel, le cadre bas de
// la fenetre video finit a y=725 et le meter commencait a y=727 — 2 px d'ecart, ils
// se touchaient visuellement. Sa demande n°6 etait explicitement de ne PAS coller a
// la fenetre video. Repartition retenue : 38 px de respiration sous la video, 35 px
// sous le meter (marge basse gardee courte mais suffisante : les glacons du givre
// debordent vers le bas au jalon 2).
// ⭐⭐ 06/09 (2e message, meme jour) : sa vraie capture confirmee identique (checksum),
// mais nouvelle demande explicite « move the meter slightly lower vertically ». Marge
// disponible avant que la ligne de sol ne touche le bas du cadre 1080 : 49 px (mesure).
// Descente moderee et documentee, a ajuster au visionnage : +18 px.
const POS_Y = 706 + 18;
const SCALE = 0.373595;

// ---- Geometrie du chassis RUSTIQUE (l'image choisie par la cliente) ----
// Le PNG fait 1195x896 alors que l'ancien SVG faisait 1448x1086 : l'echelle differe donc,
// mais on vise la MEME largeur a l'ecran (541 px) et le MEME centre x que le chassis valide.
const RUSTIC_SCALE = 0.452691; // 541 / 1195
// ⭐ Centre 450 : « use the black side strips as guides » — centre sous le cadre video
// COMPLET (bandes noires incluses), mesure sur son plateau x 29..872.
const RUSTIC_POS_X = 179.5;
// ⭐ Cale sur le SOL du device (y=717 dans l'image), pas sur le bas du PNG : sa demande n°6
// est que le meter ne FLOTTE pas. Le sol tombe donc a 706 + 717*scale = 1031.
const RUSTIC_POS_Y = 706 + 18;
/** y ou le chassis rustique pose au sol, dans le repere 1920x1080. */
const RUSTIC_SOL_SCREEN = RUSTIC_POS_Y + RUSTIC_SOL_Y * RUSTIC_SCALE;

// ---- Timing de l'entree (jalon 2, REECRIT le 10/09 apres retour Abigail) ----
// ⛔⛔ CE QUI N'ALLAIT PAS (mesure, pas devine) : l'entree etait portee par un `spring()`
// pendant que l'impact etait une CONSTANTE (IMPACT_FRAME = 32). Simulation du spring
// (damping 11, stiffness 68, mass 0.9) : la position atteignait le sol des la frame ~11-12.
// L'objet restait donc POSE ET IMMOBILE 20 frames (0,67 s) avant que « l'impact » ne parte.
// Rebond, poussiere, thud et allumage etaient tous cables sur un objet deja arrete.
// Son retour mot pour mot : « sliding in as a flat image, slightly readjusting, then moving
// up and down afterward » + « the dust comes in later, when the meter goes UP ». Elle
// decrivait exactement ce decalage. Le spring depassait aussi de +5,1 px a f15 avant de
// revenir : c'est son « slightly readjusting after it arrives ».
// ⭐ FIX : plus AUCUN spring sur la position. Trajectoire explicite en `interpolate`, ou la
// frame de contact est connue et ou TOUT (rebond, poussiere, SFX, allumage) en decoule.
// Une seule horloge. Voir memory/key-learnings.md § 2026-09-10.
//
// ---- Mecanique MESUREE sur sa video de reference (loot box, 30 fps, cycle 1) ----
//   chute visible ~f3 -> contact f10  = 7 frames (0,23 s) — TRES rapide
//   un rebond unique, court et de faible amplitude : f10 -> f16 (6 frames)
//   stabilise ~f18 · poussiere qui jaillit DES f10-11, au contact
// Sa demande du 10/09 : « a little faster from the left on a diagonal path » (elle revient
// sur son « slightly slower » du 09/09, qui rendait la chute irreelle). On adopte donc la
// cadence de la reference, a peine etiree pour laisser lire le chassis.
const FALL_FRAMES = 9; // chute : f0 -> f9 (0,30 s) — proche des 7 frames de la reference
const IMPACT_FRAME = FALL_FRAMES; // le contact EST la fin de la chute, par construction
// Rebond unique et amorti : il part A l'impact (plus aucun delai) et meurt en 7 frames.
// Amplitude volontairement faible (reference : le loot box decolle a peine) — c'est
// l'ecrasement/redressement qui porte le poids, pas la hauteur du saut.
const REBOND_FRAMES = 7;
const REBOND_H = 9; // px, contre 17 avant : un rebond haut lit comme un « saut », pas un poids
// Fin de la mise au repos (rebond + dissipation de l'ecrasement).
const SETTLE_FRAME = IMPACT_FRAME + REBOND_FRAMES;

// ---- SFX v2 (nouveaux fichiers envoyes par Abigail le 10/09) ----
// Attaques mesurees par profil RMS (fenetre 20 ms, seuil 25 % du max) :
//   thud sound.mp3      : attaque 0,100 s = 3,0 frames · climax 0,160 s
//   power switch on.mp3 : attaque 0,060 s = 1,8 frames (quasi instantane)
//   0-25%.mp3           : attaque 0,020 s · climax 1,020 s
// Bien plus nets que les v1 (dont le thud avait 0,98 s de silence de padding) : ils se calent
// au contact sans gymnastique.
const THUD_ATTACK_FRAMES = 3; // round(0,100 * 30)
const THUD_START_FRAME = IMPACT_FRAME - THUD_ATTACK_FRAMES;
// ⭐ Sa consigne du 10/09, explicite : « make sure the power-on sound begins right as the
// meter lights up blue, (where it says "MAX CHILL DETECTION") » — elle change d'indice de
// synchro (avant : le bouton vert, juge trop subtil). L'allumage du bandeau devient donc la
// reference, et le son demarre PILE dessus (attaque quasi nulle, aucune avance a prendre).
// L'allumage suit la mise au repos : l'objet se pose, puis s'allume — il ne s'allume pas en
// vol, ce qui casserait la lecture « livre puis mis en marche ».
// ⛔ 10/09 (mesure sur rendu rev2) : avec LIT = SETTLE+3, la montee de 5 frames demarrait a
// f14 alors que l'objet n'est au repos qu'a f16 — le bandeau s'allumait donc PENDANT la fin
// du rebond. Sa sequence est explicite : « tossed in, lands, rebounds once, then settles »,
// l'allumage vient APRES. Decale pour que la montee commence a SETTLE + 2.
const POWERON_LIT_FRAME = SETTLE_FRAME + 7;
const POWERUP_START_FRAME = POWERON_LIT_FRAME - 2; // round(0,060 * 30) = 1,8 -> 2
// Charge 0-25 % : le gauge demarre sa montee a la frame 6 (cf. RISE plus bas), attaque du
// fichier a 0,020 s (< 1 frame) — le son part donc avec le mouvement, sans avance a prendre.
const FILL25_SFX_START_FRAME = 6;

// ---- Empreinte au sol, mesuree DANS le PNG (06/09) ----
// A y=717 (la ligne de sol), le device occupe x 131..1039 : c'est la surface qui porte,
// pas la largeur totale du chassis (1099 px plus haut, aux epaulements).
const SOL_EMPREINTE_X0 = 131;
const SOL_EMPREINTE_W = 908;
const SOL_OMBRE_H = 26;

/** Panneau blanc du piano — MESURE le 06/09 par segmentation couleur + RANSAC (0,4 px
 *  de RMS). C'est le coin en pointe du panneau avant, pas une surface traversante :
 *  il s'arrete NET a x=356. Sert de support au reflet, et documente pourquoi
 *  l'occlusion est impossible (le meter, lui, va de x=188 a x=716). */
const PIANO_X0 = 188;   // debut du reflet : bord gauche du meter (le panneau commence a 109)
const PIANO_X1 = 356;   // fin MESUREE du panneau — au-dela, aucune surface de premier plan

// ⛔ Les anciens BottomEdgeEffect / FullChillEffect (brume en linear-gradient + heptagones)
// ont ete REMPLACES le 2026-09-04 par EffetsEcran.tsx : ils dataient de l'ancien chassis,
// leur brume couvrait les 1920 px de large (le brief exige « bottom edge only »), et leur
// givre s'accrochait au cadre de la fenetre video. Voir EffetsEcran.tsx pour la geometrie
// des zones protegees. Source de verite unique : ne pas les reintroduire.

export const ChillMeterOverlay: React.FC<{
  state: MeterState;
  metal?: MetalFinish;
  rust?: RustPass;
  chassis?: Chassis;
  effects?: Effects;
  /** ⭐ 09/09 : coupe les 2 SFX de l'entrance (thud/power-up) sans toucher a l'anim
   *  visuelle — utile pour un montage muet (clip de demo "sans son" a cote du "avec son"). */
  muted?: boolean;
}> = ({ state, metal = "flat", rust = "none", chassis = "rustic", effects = "off", muted = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- Entree : lancee de la gauche en diagonale, touche, rebondit une fois, se pose ----
  // ⛔ Le `spring()` a ete RETIRE (10/09) : il portait la position pendant qu'une constante
  // portait l'impact — deux horloges qui divergeaient de 20 frames. Detail en tete de fichier.
  // Tout ce qui suit part de IMPACT_FRAME, qui est desormais la VRAIE frame de contact.
  const isEntrance = state === "entrance";
  const IMPACT = IMPACT_FRAME;

  // Chute : acceleration franche (easing.in = part lentement, arrive vite), comme un objet
  // lance qui prend de la vitesse en tombant. `Easing.in(Easing.quad)` est la courbe de la
  // gravite — c'est elle qui donne le poids, pas l'amplitude du rebond.
  // ⭐ Sa demande du 10/09 : « a little faster from the left on a diagonal path ».
  const fallT = isEntrance
    ? interpolate(frame, [0, IMPACT], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.quad),
      })
    : 1;

  // Diagonale : la composante X arrive PILE en meme temps que la Y (donc au contact), sinon
  // l'objet finit sa course laterale apres s'etre pose = le « sliding » qu'elle a vu.
  // ⛔ Aucun depassement : il atterrit DIRECTEMENT a sa position finale approuvee — sa
  // demande explicite « without that extra little shift/readjustment after it arrives ».
  const entX = isEntrance ? interpolate(fallT, [0, 1], [-760, 0]) : 0;

  // Rebond : demarre A l'impact (aucun delai), une seule fois, amorti. C'est la SUITE de la
  // chute sur le meme axe Y, pas un mouvement separe — d'ou l'addition dans `entY`.
  // Sa demande : « a natural weighted rebound and settle from impact, not just a separate
  // up-and-down movement ».
  const rebond = isEntrance
    ? interpolate(
        frame,
        [IMPACT, IMPACT + 3, IMPACT + REBOND_FRAMES],
        [0, -REBOND_H, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        },
      )
    : 0;

  // Y = hauteur de chute puis rebond, sur une seule et meme courbe continue.
  const entY = isEntrance ? interpolate(fallT, [0, 1], [-320, 0]) + rebond : 0;

  // Bascule en vol : le chassis est incline pendant la chute et se remet a plat PILE au
  // contact (pas de tumble complet — c'est un panneau vu de face, le faire tourner montrerait
  // une tranche qu'on n'a pas dessinee ; explique a Abigail le 10/09, non conteste).
  const entRot = isEntrance
    ? interpolate(frame, [0, IMPACT * 0.6, IMPACT], [-9, -5, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      })
    : 0;

  // Ecrasement a l'impact : le chassis se tasse (scaleY < 1) sur 2 frames puis se redresse.
  // ⭐ C'est CA qui fait lire le poids et l'appui — bien plus que la hauteur du rebond.
  // Tres bref et tres faible (2 %) : sur un objet metallique rigide, un ecrasement visible
  // lirait comme du caoutchouc.
  const squash = isEntrance
    ? interpolate(
        frame,
        [IMPACT - 1, IMPACT + 1, IMPACT + 4, SETTLE_FRAME],
        [1, 0.98, 1.008, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        },
      )
    : 1;

  // Ombre de contact : large et pale tant que l'objet est en l'air, resserree et dense
  // une fois pose. C'est ce couple etalement/densite qui fait lire l'appui — une ombre
  // d'opacite constante suit l'objet sans jamais le poser.
  const ombreEtal = isEntrance
    ? interpolate(frame, [0, IMPACT, SETTLE_FRAME], [1.22, 1.0, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const ombreOpacite = isEntrance
    ? interpolate(frame, [0, IMPACT - 3, IMPACT, SETTLE_FRAME], [0, 0.45, 1, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // ⭐ 09/09 : allumage recale sur le CLIMAX du SFX power-up (POWERON_LIT_FRAME), pas sur un
  // delai arbitraire apres l'impact — sa consigne explicite : « sync with the moment the green
  // power button turns on ». Montee sur 14 frames avant le climax pour que le bouton arrive
  // a pleine intensite pile quand le son culmine, pas apres.
  // ⭐ 10/09 : montee resserree 14 -> 5 frames. Elle a change d'indice de synchro (« right as
  // the meter lights up blue, where it says MAX CHILL DETECTION ») : un allumage etale sur
  // une demi-seconde n'a pas d'instant identifiable auquel accrocher le son. Une montee
  // courte donne un « il s'allume MAINTENANT » net, sur lequel le SFX tombe.
  const powerOn = isEntrance
    ? interpolate(frame, [POWERON_LIT_FRAME - 5, POWERON_LIT_FRAME], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // ---- Brume/poussiere a l'impact ----
  // ⭐ 09/09 (jalon 2) : sa demande explicite — « especially the dust/mist that comes up
  // around it after impact ». Panache simple (radial-gradient anime), coherent avec le style
  // deja en place dans ce fichier (ombres en div, pas de calque video pour un effet aussi
  // bref et localise). Jaillit a l'impact, monte et se dissipe sur ~26 frames.
  // ⛔⛔ 10/09 — SON REPROCHE LE PLUS PRECIS : « the dust comes in later, when the meter goes
  // UP, so the timing does not feel lined up with the landing ». Cause reelle : la poussiere
  // etait bien calee sur IMPACT, mais IMPACT valait 32 alors que l'objet touchait a f~12 —
  // elle jaillissait donc pendant le faux rebond tardif. IMPACT est maintenant la vraie frame
  // de contact, la poussiere part donc AU contact sans rien changer d'autre que l'horloge.
  // Montee raccourcie (10 -> 5 frames) : une poussiere d'impact jaillit, elle ne monte pas
  // en fondu. Sa demande : « right at the moment of INITIAL impact ».
  const dustProgress = isEntrance
    ? interpolate(frame, [IMPACT, IMPACT + 5, IMPACT + 24], [0, 1, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      })
    : 0;
  // ⭐ 09/09 : pic remonte 0,55 -> 0,85 — mesure au rendu (crop precis sur la zone), le
  // premier reglage etait bien present mais quasi invisible a l'oeil nu (gradient qui
  // s'estompe des 75 % du rayon x opacity x blur 9px = trop dilue pour se lire comme
  // "poussiere qui jaillit" a la taille d'ecran normale).
  // ⭐ 10/09 : pic avance a IMPACT+2 (au lieu de +4) — le jaillissement doit etre SIMULTANE du
  // coup, pas consecutif. 2 frames = le temps que la matiere soit chassee, pas plus.
  // ⭐ 10/09 : pic 0,85 -> 0,95. Elle insiste deux fois sur cet element (« ESPECIALLY the
  // dust/mist » le 09/09, puis le timing le 10/09) — c'est le detail de la reference auquel
  // elle tient le plus. Releve sans exces : au-dela, le panache masque le bas du chassis.
  const dustOpacity = isEntrance
    ? interpolate(frame, [IMPACT, IMPACT + 2, IMPACT + 24], [0, 0.95, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      })
    : 0;
  const dustRise = dustProgress * 46; // monte de 46px pendant la dissipation
  // ⛔ 10/09 — MESURE sur le rendu rev1 : avec un depart a 0,6, le panache naissait ETROIT et
  // ne debordait lateralement qu'en s'elargissant — la poussiere n'apparaissait sur les ailes
  // qu'a f12 alors que le contact est a f9/f10. Soit 2-3 frames de retard : exactement le
  // defaut qu'elle a signale, en plus petit. Une poussiere d'impact est CHASSEE horizontalement
  // par le choc : elle est large des la premiere frame, puis monte et se dissipe.
  // Depart releve 0,6 -> 1,05, l'etalement ne fait plus que prolonger un panache deja ouvert.
  const dustSpread = 1.05 + dustProgress * 0.55;

  // ---- Niveau de chill selon l'etat ----
  let chill = 0;
  let frost = 0;
  let bottomEdge = 0;
  let fullChill = 0;

  const RISE = 42; // duree de montee du gauge (1.4s)

  if (state === "fill25") {
    chill = interpolate(frame, [6, 6 + RISE], [0, 25], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
  } else if (state === "fill50") {
    chill = interpolate(frame, [6, 6 + RISE], [25, 50], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    // le givre pousse sur l'appareil, en retard sur le gauge
    frost = interpolate(frame, [6 + RISE * 0.5, 6 + RISE + 34], [0, 0.62], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (state === "fill75") {
    chill = interpolate(frame, [6, 6 + RISE], [50, 75], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    frost = interpolate(frame, [0, 6 + RISE + 28], [0.62, 0.84], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    bottomEdge = interpolate(frame, [6 + RISE * 0.7, 6 + RISE + 30], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (state === "fill100") {
    chill = interpolate(frame, [6, 6 + RISE], [75, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    frost = interpolate(frame, [0, 6 + RISE + 20], [0.84, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    bottomEdge = 1;
    // Le payoff se declenche quand le gauge touche 100 et court jusqu'a la fin du clip.
    // ⛔ Rampe LINEAIRE et LONGUE (86 frames, pas 46) : chaque effet applique deja sa
    // propre courbe en interne. Empiler un Easing.out ici saturait `progress` a 1 en
    // une quinzaine de frames et l'onde de choc s'eteignait avant d'avoir ete vue
    // (mesure du 04/09 : 0,12 % du cadre a la frame 15, puis 0 %).
    fullChill = interpolate(frame, [6 + RISE, 6 + RISE + 86], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // Etat initial : l'objet seul, sans habillage de givre plein cadre.
  if (effects === "off") {
    bottomEdge = 0;
    fullChill = 0;
  }

  return (
    // Fond TRANSPARENT — aucune couleur de fond, c'est ce qui permet l'export alpha.
    <AbsoluteFill>
      {/* 75 % — la banquise du bord bas. Elle passe DERRIERE le meter : la glace monte
          autour de l'instrument, elle ne le recouvre pas. */}
      <BottomIceBank intensity={bottomEdge} t={frame / fps} />

      {/* Ombre de CONTACT — ce qui pose reellement l'objet sur le plateau.
          ⛔ Sa demande n°6 (« especially once animated ») n'etait PAS un defaut
          d'animation : mesure du 06/09, le device est immobile au pixel pres des la
          frame 48 (mesure faite du temps du spring d'entree, retire le 10/09 ; la
          trajectoire explicite qui l'a remplace est posee des la frame 16).
          Il ne flottait pas au sens d'une oscillation — il ne reposait sur RIEN.
          RUSTIC_SOL_SCREEN existait deja mais n'etait CABLE a aucun element dessine :
          une ligne de sol qui vit comme un nombre et que rien ne materialise a l'ecran.
          L'ombre se resserre et s'assombrit a l'atterrissage : c'est le contact qui
          rend l'appui lisible, pas le recalage vertical (deja juste).

          ⭐⭐ 06/09 — POURQUOI DEUX OMBRES ET PAS UNE.
          L'OCCLUSION EST GEOMETRIQUEMENT IMPOSSIBLE SUR CE PLATEAU : mesure a 0,4 px
          pres (agent dedie, 3 methodes, 5 seuils), le panneau du piano ne couvre que
          x=109..356 alors que le meter va de x=188 a x=716. Les deux tiers droits du
          bo1tier n'ont AUCUN element de premier plan devant eux — le banc, lui, est en
          ARRIERE-plan (son bord superieur MONTE vers la droite, il fuit vers le fond).
          Toute occlusion fidele au decor est donc forcement asymetrique, et une
          asymetrie sur un objet symetrique se lit comme une AMPUTATION (4 essais rejetes,
          dont un ou le bouton DATA etait tranche). Le jury demandait « ne pas flotter » ;
          l'occlusion n'etait que le MOYEN qu'il proposait, pas l'exigence.
          On ancre donc par les deux indices qui, eux, sont disponibles partout :

          1. OMBRE DE CONTACT DURE (ci-dessous) — c'est l'indice le plus fort quand il
             n'y a pas de surface d'appui visible. Une ombre unique et floue se lit comme
             « objet en vol stationnaire » ; un vrai contact a TOUJOURS deux composantes :
             un noyau serre et dense sur la ligne de contact (quasi net) + l'etalement
             ambiant diffus. Seul le second existait — d'ou la sensation de flottement.

             ⭐⭐ 06/09 (2e message, meme jour) : sa demande EXPLICITE — « Give it a stronger
             shadow/contact shadow underneath so it feels more grounded [...] even if it
             may technically be aligned to the floor line, it still visually reads like it
             is hovering. » Elle tranche elle-meme le desaccord avec le jury externe (qui
             rejetait « une ombre plus grasse ») : c'est SA lecture qui prime, pas la leur.
             Noyau et etalement renforces en densite ET en etendue par rapport au 1er
             passage — toujours positionnes SOUS la base (cf. note ci-dessous), jamais
             recentres sur la ligne de sol. */}
      {chassis === "rustic" && (
        <>
          {/* (a) NOYAU DE CONTACT — serre, dense, a peine floute. C'est LUI qui pose
              l'objet. Il ne fait que 38 % de l'empreinte en hauteur et reste colle a la
              ligne de sol : plus il est etroit et net, plus l'appui est credible. */}
          <div
            style={{
              position: "absolute",
              left: RUSTIC_POS_X + entX + SOL_EMPREINTE_X0 * RUSTIC_SCALE,
              // ⛔ PAS centre sur la ligne de sol : le chassis est opaque JUSQU'A y=1030
              // (mesure : 373 px opaques a 1030, plus que 33 a 1035). Une ombre centree
              // sur RUSTIC_SOL_SCREEN a donc sa moitie haute CACHEE DERRIERE l'objet, et
              // seule sa moitie basse, la plus faible, ressortait — d'ou une ombre
              // presente dans l'alpha mais invisible a l'ecran. On la pose SOUS la base.
              top: RUSTIC_SOL_SCREEN + 1 + rebond * 0.12,
              width: SOL_EMPREINTE_W * RUSTIC_SCALE * ombreEtal * 0.94,
              height: SOL_OMBRE_H * 0.52,
              marginLeft: (SOL_EMPREINTE_W * RUSTIC_SCALE * (1 - ombreEtal * 0.94)) / 2,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.74) 55%, rgba(0,0,0,0) 88%)",
              opacity: ombreOpacite,
              filter: "blur(2px)",
            }}
          />
          {/* (b) ETALEMENT AMBIANT — l'ombre douce d'origine, conservee telle quelle.
              Elle seule ne posait pas l'objet, mais elle porte le volume. */}
          <div
            style={{
              position: "absolute",
              left: RUSTIC_POS_X + entX + SOL_EMPREINTE_X0 * RUSTIC_SCALE,
              // Meme correction que le noyau : centre sur la ligne de sol, cet etalement
              // etait aux 2/3 masque par le chassis. On le descend et on l'etire pour
              // qu'il porte le noyau au lieu de mourir en 8 px.
              top: RUSTIC_SOL_SCREEN - 2 + rebond * 0.12,
              width: SOL_EMPREINTE_W * RUSTIC_SCALE * ombreEtal * 1.14,
              height: SOL_OMBRE_H * 2.1,
              marginLeft: (SOL_EMPREINTE_W * RUSTIC_SCALE * (1 - ombreEtal * 1.14)) / 2,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.50) 42%, rgba(0,0,0,0) 80%)",
              opacity: ombreOpacite,
              filter: "blur(8px)",
            }}
          />
        </>
      )}

      {/* 2. REFLET SUR LE PANNEAU DU PIANO — le 2e indice d'appartenance.
          Le panneau blanc du piano est la SEULE surface claire et lisse du plateau
          situee devant le plan du meter : mesuree x=109..356, arete haute plate a
          y~993 (pente reelle 0,54 deg, donc horizontale a l'oeil). C'est physiquement
          le seul endroit ou un reflet est justifie — on ne le pose donc PAS ailleurs,
          et surtout pas symetriquement : un reflet a droite serait invente (le banc y
          est en arriere-plan, il ne peut rien reflechir du meter).
          ⛔ Volontairement TRES discret : un reflet trop lu se voit comme une tache.
          Il dit seulement « cet objet partage la lumiere de cette piece ». Il suit
          l'entree (entX/rebond) pour rester solidaire de l'objet. */}
      {chassis === "rustic" && (
        <div
          style={{
            position: "absolute",
            left: PIANO_X0,
            top: RUSTIC_SOL_SCREEN - 4 + rebond * 0.12,
            width: PIANO_X1 - PIANO_X0,
            height: 46,
            background:
              "linear-gradient(to bottom, rgba(150,205,235,0.20) 0%, rgba(150,205,235,0.09) 45%, rgba(150,205,235,0) 100%)",
            opacity: ombreOpacite * 0.85,
            filter: "blur(6px)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      )}

      {chassis === "rustic" ? (
        // ⛔ Le rotate NE VA PAS sur ce div : son `left/top` positionne l'objet en absolu
        // avec pivot top-left implicite (comme avant le jalon 2). Un transformOrigin en px
        // ici desaligne tout le positionnement (mesure : l'objet saute hors-cadre, cf.
        // feedback_rotation-svg-le-rotate-va-DANS-le-groupe-qui-porte-le-translate — meme
        // piege en CSS qu'en SVG, le rotate va DANS le groupe qui porte deja le placement).
        // Le tilt vit sur un wrapper INTERNE avec un transformOrigin en % (relatif a SA
        // propre box, sans melange d'echelle avec RUSTIC_SCALE).
        <div
          style={{
            position: "absolute",
            left: RUSTIC_POS_X + entX,
            top: RUSTIC_POS_Y + entY,
            width: RUSTIC_W * RUSTIC_SCALE,
            height: RUSTIC_H * RUSTIC_SCALE,
            transform: `scale(${RUSTIC_SCALE})`,
            transformOrigin: "top left",
          }}
        >
          <div
            style={{
              width: RUSTIC_W,
              height: RUSTIC_H,
              // bascule origine bas-centre (le pivot d'un objet qui incline en tombant
              // puis se pose a plat) — en %, dans le repere natif de ce wrapper.
              // ⭐ 10/09 : l'ecrasement d'impact partage ce pivot au SOL — un objet qui
              // encaisse se tasse VERS le sol, il ne se comprime pas vers son centre.
              transform: `rotate(${entRot}deg) scaleY(${squash})`,
              transformOrigin: `50% ${(RUSTIC_SOL_Y / RUSTIC_H) * 100}%`,
            }}
          >
            <ChillMeterRustic chill={chill} powerOn={powerOn} frost={frost} frame={frame} fps={fps} />
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: POS_X + entX,
            top: POS_Y + entY,
            width: DEVICE_W * SCALE,
            height: DEVICE_H * SCALE,
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
          }}
        >
          <ChillMeterDevice
            chill={chill}
            frost={frost}
            powerOn={powerOn}
            frame={frame}
            fps={fps}
            metal={metal}
            rust={rust}
          />
        </div>
      )}

      {/* Brume/poussiere a l'impact — jaillit au contact, PAR-DESSUS le meter (dans la
          reference elle enveloppe l'objet pose, elle ne reste pas derriere). 2 panaches
          decales (gauche/droite de l'empreinte) pour eviter un rond de fumee trop lisible. */}
      {chassis === "rustic" && isEntrance && dustOpacity > 0.001 && (
        <>
          <div
            style={{
              position: "absolute",
              left:
                RUSTIC_POS_X +
                SOL_EMPREINTE_X0 * RUSTIC_SCALE -
                60 * dustSpread +
                SOL_EMPREINTE_W * RUSTIC_SCALE * 0.18,
              top: RUSTIC_SOL_SCREEN - 40 - dustRise,
              width: 260 * dustSpread,
              height: 170 * dustSpread,
              borderRadius: "50%",
              // ⭐ 09/09 : 1ere version (blanc translucide 0,9 + opacity 0,55 + blur 9px,
              // panaches 220x150) etait quasi invisible au rendu a taille d'ecran normale
              // — confirme present par crop precis, mais trop dilue (gradient qui s'estompe
              // des 75 % du rayon × opacity × blur 9px). Corrige : coeur OPAQUE dans le
              // gradient (c'est `opacity` seul qui pilote la visibilite), panaches plus
              // grands, pic d'opacite remonte a 0,85.
              // ⭐⭐ 09/09 (retour Aziz) : re-teintee brune/poussiereuse — un blanc-bleu pur
              // jurait sur un objet rustique/rouille. Mesure directe sur device-rustique.png
              // (pixels chauds R-B>25) : rouille moyenne RGB(108,81,58). La poussiere reprend
              // cette teinte mais ECLAIRCIE et DESATUREE (une poussiere en suspension est plus
              // pale et grise que le metal qui la genere — coeur trop sature se lirait comme
              // de la peinture projetee, pas un nuage).
              background:
                "radial-gradient(ellipse at center, rgba(196,178,156,0.95) 0%, rgba(176,158,136,0.65) 45%, rgba(160,144,122,0) 75%)",
              opacity: dustOpacity,
              filter: "blur(9px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left:
                RUSTIC_POS_X +
                SOL_EMPREINTE_X0 * RUSTIC_SCALE -
                40 * dustSpread +
                SOL_EMPREINTE_W * RUSTIC_SCALE * 0.62,
              top: RUSTIC_SOL_SCREEN - 30 - dustRise * 0.85,
              width: 230 * dustSpread,
              height: 150 * dustSpread,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(190,172,150,0.9) 0%, rgba(172,154,132,0.6) 45%, rgba(160,144,122,0) 75%)",
              opacity: dustOpacity,
              filter: "blur(9px)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* 100 % — gel des 4 bords + onde de choc codee + neige, PAR-DESSUS le meter
          (l'onde en part, elle doit donc le franchir). */}
      <FullChillCoded progress={fullChill} t={frame / fps} />

      {/* ---- SFX jalon 2 — fichiers envoyes par Abigail le 09/09, sync mesuree en tete
          de fichier (THUD_START_FRAME / POWERUP_START_FRAME). Uniquement sur l'entree :
          les autres etats (idle, fillNN) ne portent pas ces sons. `Sequence from=` decale
          le POINT DE DEPART de lecture du fichier (frame 0 de l'enfant = `from` du parent),
          ce qu'un simple rendu conditionnel ne ferait pas — l'Audio recommencerait a 0 a
          chaque frame plutot que de suivre une position de lecture qui avance. */}
      {isEntrance && !muted && THUD_START_FRAME >= 0 && (
        <Sequence from={THUD_START_FRAME} layout="none">
          <Audio src={staticFile("_client-sim/chill-meter/sfx-abigail/thud-v2.mp3")} />
        </Sequence>
      )}
      {isEntrance && !muted && (
        <Sequence from={POWERUP_START_FRAME} layout="none">
          <Audio src={staticFile("_client-sim/chill-meter/sfx-abigail/power-on-v2.mp3")} />
        </Sequence>
      )}
      {/* ⭐ 10/09 : son de charge 0-25 %, envoye par Abigail avec ce retour. Il comblait un
          manque qu'on lui avait signale le 09/09 (« those two states stay silent for now »).
          Cale sur le DEBUT de la montee du gauge (frame 6, cf. RISE) : attaque a 0,020 s, donc
          depart direct ; son climax (1,02 s = f31) tombe dans la montee du gauge (6 -> 48). */}
      {state === "fill25" && !muted && (
        <Sequence from={FILL25_SFX_START_FRAME} layout="none">
          <Audio src={staticFile("_client-sim/chill-meter/sfx-abigail/fill-0-25-v2.mp3")} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
