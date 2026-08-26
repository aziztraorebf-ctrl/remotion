// MOTEUR: UI produit (plaques capturees) + camera 2.5D
/**
 * FOSTER — PLAN 2 (1,602 -> 5,597 s) : LA SUBMERSION
 * ==================================================
 * Reference : public/_client-sim/_references/foster/foster-with-confidence.mp4
 *
 * ⭐ CE QUE RACONTE LE PLAN (et que le decoupage initial ne disait pas) :
 * ce n'est PAS « un gros plan sur la notification ». C'est une CONVERSATION qui
 * se joue en direct — on repond a la demande Ofsted, et pendant qu'on repond les
 * notifications s'EMPILENT par-dessus. Les compteurs montent : 11+ -> 13+ -> 17+.
 * C'est la submersion : exactement le probleme que le SaaS pretend resoudre.
 *
 * DECOUPAGE MESURE (frames denses sur la zone centrale propre) :
 *   1,602 s  COUPE FRANCHE en avant (score 0,60) : saut d'echelle sec du plan
 *            large au tres gros plan. ⛔ PAS un zoom continu.
 *   2,05 s   « I'll »            2,35 s  « I'll see »
 *   2,50 s   « I'll see how long »
 *   2,65 s   « I'll see how long it » + le bouton REPLY apparait
 *   3,00 s   « I'll see how long it takes » (phrase finie)
 *   3,80 s   + « You got a new mail »     badge 11+
 *   4,30 s   + « You got a new message »  badge 13+
 *   4,80 s   + « You got a new mail »     badge 17+
 *   5,597 s  COUPE (fin du plan)
 *
 * La frappe : 27 caracteres en 0,95 s ≈ 1,05 frame/caractere — plus rapide que
 * la regle des 3 f/car du socle shotcraft, et les mots arrivent par GROUPES.
 * On ne recode donc pas une frappe caractere par caractere : on bascule entre
 * des plaques capturees (pattern `row-embed` : decoupage de plaque, jamais redessin).
 *
 * ⛔ La reponse vit DANS la bulle de la notification (mesure : meme carte,
 * y~540/1080), ce n'est pas un champ de saisie separe.
 */

import React, { useLayoutEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/** Les 9 etats captures (voir capture-foster-notifstack.mjs). */
const STATES = [
  { at: 0.0, src: "_client-sim/foster/screens/stack-r0.png" },
  { at: 2.05, src: "_client-sim/foster/screens/stack-r1.png" },
  { at: 2.35, src: "_client-sim/foster/screens/stack-r2.png" },
  { at: 2.5, src: "_client-sim/foster/screens/stack-r3.png" },
  { at: 2.65, src: "_client-sim/foster/screens/stack-r4.png" },
  { at: 3.0, src: "_client-sim/foster/screens/stack-r5.png" },
  { at: 3.8, src: "_client-sim/foster/screens/stack-s1.png" },
  { at: 4.3, src: "_client-sim/foster/screens/stack-s2.png" },
  { at: 4.8, src: "_client-sim/foster/screens/stack-s3.png" },
] as const;

/** Temps ABSOLU du debut du plan dans la video de reference. */
const PLAN_START = 1.602;

/**
 * CADRAGE — CALCULE sur les bbox reelles relevees a la capture
 * (`stack-layout.json`), pas choisi a l'oeil.
 * La plaque fait 2556 px de haut. Les cartes occupent y=300 (haut de la notif
 * Ofsted) a y=1055 (bas de la 3e notification) => centre de la pile ~ y=640.
 * ⛔ Sans ce recentrage, caler la plaque en hauteur montre son CENTRE (y=1278),
 * c'est-a-dire le bas du fond d'ecran : on ne voyait aucune notification.
 */
const PLATE_W = 1179;
const PLATE_H = 2556;
const STACK_TOP = 300;
const STACK_BOTTOM = 1055;
const STACK_CENTER = (STACK_TOP + STACK_BOTTOM) / 2;
/** Decalage a appliquer, en fraction de la hauteur de plaque. */
const CENTER_OFFSET = STACK_CENTER / PLATE_H - 0.5;

/**
 * SFX — un son par EVENEMENT (la reference porte 12 transitoires en 8 s).
 * ⛔ PAS de whoosh sur une UI (doctrine : vocabulaire d'air, sans rapport).
 */
const SFX = {
  /** Chaque notification qui tombe. */
  drop: "_client-sim/noteshield/sfx/tone.mp3",
  /** La coupe d'entree. */
  cut: "_client-sim/noteshield/sfx/hit-weak.mp3",
} as const;
const SFX_VOL = 0.5;

/** Precharge une plaque et bloque le render tant qu'elle n'est pas prete. */
const usePlate = (src: string) => {
  const [handle] = useState(() => delayRender(`plate ${src}`));
  useLayoutEffect(() => {
    const img = new Image();
    img.onload = () => continueRender(handle);
    img.onerror = () => continueRender(handle);
    img.src = staticFile(src);
  }, [src, handle]);
};

export const Plan02NotifStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const tAbs = PLAN_START + frame / fps;

  STATES.forEach((s) => usePlate(s.src));

  /**
   * Etat courant = la derniere bascule franchie. Les `at` sont des temps
   * ABSOLUS de la reference (le 1er vaut 0 et sert de valeur initiale).
   */
  const idx = STATES.reduce((acc, s, i) => (tAbs >= s.at ? i : acc), 0);
  const state = STATES[idx];

  /**
   * LA VUE DESCEND quand la pile grandit (mesure : a 4,10 s la notification
   * Ofsted commence a sortir par le haut du cadre).
   * On translate la plaque vers le haut a mesure que les intrus s'ajoutent.
   */
  const scroll = interpolate(tAbs, [3.8, 4.3, 4.8, 5.2], [0, 0.05, 0.11, 0.13], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  /**
   * TRES GROS PLAN — la coupe de 1,602 s est un SAUT D'ECHELLE, donc le plan
   * demarre deja serre. Le resserrement se POURSUIT ensuite doucement
   * (mesure : le telephone continue de grandir jusqu'a ~2,2 s), puis se cale.
   */
  /**
   * ZOOM — CALCULE sur la LARGEUR, pas sur la hauteur.
   * ⛔ Erreur payee 2 fois : piloter la hauteur d'une plaque tres verticale
   * (1179x2556) ne l'elargit presque pas — a 2,5x la hauteur du cadre elle ne
   * fait que 1258 px de large, a peine plus que le cadre lui-meme.
   * MESURE sur la reference (a la regle) : la bulle occupe **1100 px sur 1920**
   * (x=400 -> x=1500), et les bords du telephone sont a x=290 et x=1610.
   * Notre carte fait 1031 px sur 1179 de plaque => pour couvrir 1100 px il faut
   * une plaque affichee a 1100/1031 * 1179 = **1258 px de large**... ce qui
   * correspond a une largeur de 1258/1920 = 0,655 du cadre pour l'ECRAN SEUL.
   * Comme la reference montre l'ecran a ~1320 px de large (bords x=290->1610
   * moins le chassis), on vise **1,30 fois la largeur du cadre** en fin de plan.
   */
  const zoomW = interpolate(tAbs, [1.602, 2.2, 5.597], [1.22, 1.28, 1.31], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  /** Chaque notification qui tombe pousse legerement la pile : micro-impact. */
  const impact = [3.8, 4.3, 4.8].reduce((acc, at) => {
    const d = tAbs - at;
    if (d < 0 || d > 0.25) return acc;
    return acc + Math.sin((d / 0.25) * Math.PI) * 0.006 * (1 - d / 0.25);
  }, 0);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/*
        ⛔ PAS de couche de contexte (tapis floute, bandes de chassis) : elles
        ont ete codees puis RETIREES apres mesure — a ce cadrage la plaque fait
        2458 px de large sur un cadre de 1920, elle DEBORDE de 269 px de chaque
        cote et recouvre integralement ce qui est derriere. C'etait du code mort.
        La reference montre les bords du telephone parce qu'elle cadre un peu
        plus large ; chez nous l'ecran remplit le cadre — parti pris assume.
      */}
      {/* SFX : la coupe, puis un son par notification qui tombe. */}
      <Sequence from={0} durationInFrames={Math.round(0.5 * fps)}>
        <Audio src={staticFile(SFX.cut)} volume={SFX_VOL * 0.8} />
      </Sequence>
      {[3.8, 4.3, 4.8].map((at) => (
        <Sequence
          key={at}
          from={Math.round((at - PLAN_START) * fps)}
          durationInFrames={Math.round(0.4 * fps)}
        >
          <Audio src={staticFile(SFX.drop)} volume={SFX_VOL * 0.65} />
        </Sequence>
      ))}

      {/* LA PLAQUE — on bascule d'un etat a l'autre, on ne redessine jamais l'UI.
          Le zoom se fait par `scale` sur l'image : la plaque est capturee en
          1179x2556 natif, donc elle reste nette a ce facteur. */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(state.src)}
          style={{
            width: width * (zoomW + impact),
            /* Recentrage sur la pile (mesure) + descente de la vue quand elle
               grandit. Les deux sont exprimes en fraction de la hauteur AFFICHEE
               de la plaque, pas du cadre : sinon le decalage change avec le zoom. */
            /* Le decalage s'exprime en fraction de la HAUTEUR AFFICHEE de la
               plaque. Celle-ci vaut largeur_affichee * (2556/1179). */
            transform: `translateY(${
              (-CENTER_OFFSET - scroll) * width * (zoomW + impact) * (PLATE_H / PLATE_W)
            }px)`,
          }}
        />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
