// MOTEUR: objet/metaphore SVG
//
// Overlay plein cadre 1920x1080, fond TRANSPARENT, compteur verrouille en bas a gauche.
// Une seule composition parametree par `state` -> les 7 livrables du brief.
//
// Le brief exige "full-screen transparent overlays, not cropped tightly" : le compteur est
// donc positionne ICI, a sa place definitive, et le reste du cadre reste vide. La cliente
// depose le fichier dans CapCut, il se cale plein cadre, le compteur ne bouge jamais d'un pixel.

import React from "react";
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Easing } from "remotion";
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

// ---- Timing de l'entree (jalon 2) ----
// ⭐ 09/09 : frame d'impact reculee de 26 -> 32 avec l'entree ralentie (stiffness 68).
const IMPACT_FRAME = 32;
// Thud (fichier "Heavy thud sfx.WAV") : le vrai coup d'attaque demarre a t=0,984s dans le
// fichier (mesure ffmpeg silencedetect — le debut du WAV est un silence de padding). A 30fps
// ca fait 29,5 frames. On demarre l'Audio 30 frames AVANT l'impact pour que l'attaque tombe
// pile sur la frame de contact au sol (`startFrom` non utilise : on garde la queue de
// resonance du fichier intacte, seul le point de depart de lecture compte).
const THUD_ATTACK_FRAMES = 30; // round(0,984 * 30)
const THUD_START_FRAME = IMPACT_FRAME - THUD_ATTACK_FRAMES;
// Power-up (fichier "Power up sound (adjusted).WAV") : rise progressif, climax mesure vers
// t=1,79s (54 frames), le fichier demarre quasi immediatement (0,10s de silence negligeable).
// Sa consigne : « sync with the moment the green power button turns on and the meter powers
// up ». Le son DOIT preceder/accompagner l'allumage (un climax qui suit l'image lue comme un
// defaut de sync) — donc c'est l'allumage visuel qui se cale sur le son, pas l'inverse : le
// power-up demarre PILE a l'impact (le geste d'allumage commence des que l'objet touche le
// sol), et `powerOn` est retarde pour que le bouton s'allume au moment du climax.
const POWERUP_START_FRAME = IMPACT_FRAME;
const POWERUP_CLIMAX_FRAMES = 54; // round(1,79 * 30)
const POWERON_LIT_FRAME = POWERUP_START_FRAME + POWERUP_CLIMAX_FRAMES;

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

  // ---- Entree : arrive de la gauche en diagonale, atterrit, rebondit, s'allume ----
  // ⭐ 09/09 (jalon 2, retour Abigail) : « please make the entrance slightly slower than
  // the example » — stiffness baissee 92 -> 68 (meme damping/mass, juste une chute moins
  // vive). L'IMPACT recule de 26 -> 32 pour laisser le temps de chute a la nouvelle vitesse.
  const landSpring = spring({ frame, fps, config: { damping: 11, stiffness: 68, mass: 0.9 } });
  const isEntrance = state === "entrance";

  const entX = isEntrance ? interpolate(landSpring, [0, 1], [-720, 0]) : 0;
  const entY = isEntrance ? interpolate(landSpring, [0, 1], [-300, 0]) : 0;

  // ⭐ 09/09 : legere bascule en vol (pas un tumble complet — objet mecanique/lourd, pas
  // un de qu'on lance). Parti de 0deg, incline pendant la chute, revient a plat pile a
  // l'impact — la bascule EST l'indice de chute, elle doit donc disparaitre au contact.
  const entRot = isEntrance
    ? interpolate(frame, [0, 10, 22, IMPACT_FRAME], [-7, -4, 3, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      })
    : 0;

  // petit rebond apres l'impact
  const IMPACT = IMPACT_FRAME;
  const bounce = isEntrance
    ? interpolate(frame, [IMPACT, IMPACT + 5, IMPACT + 11, IMPACT + 17], [0, -17, 5, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      })
    : 0;

  // Ombre de contact : large et pale tant que l'objet est en l'air, resserree et dense
  // une fois pose. C'est ce couple etalement/densite qui fait lire l'appui — une ombre
  // d'opacite constante suit l'objet sans jamais le poser.
  const ombreEtal = isEntrance
    ? interpolate(frame, [0, IMPACT, IMPACT + 17], [1.22, 1.0, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const ombreOpacite = isEntrance
    ? interpolate(frame, [0, IMPACT - 6, IMPACT, IMPACT + 17], [0, 0.45, 1, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // ⭐ 09/09 : allumage recale sur le CLIMAX du SFX power-up (POWERON_LIT_FRAME), pas sur un
  // delai arbitraire apres l'impact — sa consigne explicite : « sync with the moment the green
  // power button turns on ». Montee sur 14 frames avant le climax pour que le bouton arrive
  // a pleine intensite pile quand le son culmine, pas apres.
  const powerOn = isEntrance
    ? interpolate(frame, [POWERON_LIT_FRAME - 14, POWERON_LIT_FRAME], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // ---- Brume/poussiere a l'impact ----
  // ⭐ 09/09 (jalon 2) : sa demande explicite — « especially the dust/mist that comes up
  // around it after impact ». Panache simple (radial-gradient anime), coherent avec le style
  // deja en place dans ce fichier (ombres en div, pas de calque video pour un effet aussi
  // bref et localise). Jaillit a l'impact, monte et se dissipe sur ~26 frames.
  const dustProgress = isEntrance
    ? interpolate(frame, [IMPACT, IMPACT + 10, IMPACT + 26], [0, 1, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      })
    : 0;
  // ⭐ 09/09 : pic remonte 0,55 -> 0,85 — mesure au rendu (crop precis sur la zone), le
  // premier reglage etait bien present mais quasi invisible a l'oeil nu (gradient qui
  // s'estompe des 75 % du rayon x opacity x blur 9px = trop dilue pour se lire comme
  // "poussiere qui jaillit" a la taille d'ecran normale).
  const dustOpacity = isEntrance
    ? interpolate(frame, [IMPACT, IMPACT + 4, IMPACT + 26], [0, 0.85, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      })
    : 0;
  const dustRise = dustProgress * 46; // monte de 46px pendant la dissipation
  const dustSpread = 0.6 + dustProgress * 0.9; // s'etale en se dissipant

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
          frame 48, et le spring d'entree retombe a 0,000 px de residuel des la frame 80.
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
              top: RUSTIC_SOL_SCREEN + 1 + bounce * 0.12,
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
              top: RUSTIC_SOL_SCREEN - 2 + bounce * 0.12,
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
          l'entree (entX/bounce) pour rester solidaire de l'objet. */}
      {chassis === "rustic" && (
        <div
          style={{
            position: "absolute",
            left: PIANO_X0,
            top: RUSTIC_SOL_SCREEN - 4 + bounce * 0.12,
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
            top: RUSTIC_POS_Y + entY + bounce,
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
              transform: `rotate(${entRot}deg)`,
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
            top: POS_Y + entY + bounce,
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
          <Audio src={staticFile("_client-sim/chill-meter/sfx-abigail/thud.wav")} />
        </Sequence>
      )}
      {isEntrance && !muted && (
        <Sequence from={POWERUP_START_FRAME} layout="none">
          <Audio src={staticFile("_client-sim/chill-meter/sfx-abigail/power-up.wav")} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
