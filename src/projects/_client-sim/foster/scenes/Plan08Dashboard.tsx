// MOTEUR: UI produit — 2 plaques capturees + PageCam (pilier B2B n3)
/**
 * FOSTER — PLAN 8 (23,40 -> 27,07 s) : LE DASHBOARD
 * =================================================
 * Reference : public/_client-sim/_references/foster/foster-with-confidence.mp4
 *
 * ⛔ REGLE N°1 DU PILIER UI PRODUIT — l'UI est CAPTUREE, pas redessinee en React.
 * Les 2 etats vivent dans `live-page/billing.html?state=overview|billing`, sont
 * photographies par `scripts/tools/ui-capture/capture-foster-billing.mjs`, et
 * `PageCam` promene une camera dessus. Doctrine : `memory/fiches/FICHE-UI-PRODUIT.md`.
 *
 * ⛔⛔ LE TABLEAU DE DECOUPAGE ANNONCAIT « dashboard qui monte par le bas, zoom
 * sur les montants ». FAUX sur la mecanique. Le plan est en DEUX SOUS-PLANS
 * separes par une COUPE FRANCHE mesuree a 25,05 s (ecart inter-frames 81,3
 * contre ~5 autour — un pic net, pas une transition) :
 *
 *   A · 23,40 -> 25,05 s (49 frames) — page « Platform overview »
 *   B · 25,05 -> 27,07 s (61 frames) — page « Billing », les 4 montants
 *
 * ⭐ C'est GROK (3e voix) qui a releve la coupe et la structure en 2 pages ;
 * Gemini decrivait un seul mouvement continu. Verifie a la mesure avant de coder.
 *
 * ── ⭐⭐ LA DECISION QUI A REDRESSE CE PLAN (Aziz) ─────────────────────────
 * Une 1re version reproduisait le PANORAMIQUE horizontal de la reference : page
 * de 3400 px, donc `PageCam` (qui plaque sur 1920 en dur) inutilisable, donc
 * mecanique de camera reecrite a la main, puis UI redessinee en React — ce qui
 * violait la regle n°1 de notre propre fiche. Trois rendus perdus en plomberie,
 * sur le plan cense etre notre terrain le plus fort.
 *
 * Recadrage d'Aziz : « rien n'oblige a reproduire a 100 % ; si on a Shotcraft et
 * PageCam avec tout ce dont on a besoin dedans, il ne reste qu'a recopier les
 * couleurs et les ecritures ». Et : « le but est de prouver qu'on peut tout
 * refaire, mais avec NOTRE maniere ».
 * -> on adapte la PAGE a ce que le socle sait faire, on ne contourne pas le
 * socle pour coller a la reference.
 *
 * ⚠️ ECART ASSUME, a ne pas relever comme un defaut au comparatif : le mouvement
 * est ici un ENCHAINEMENT DE ZOOMS et non le pan horizontal continu de la
 * reference. Le geste raconte la meme chose — on part de la vue d'ensemble, on
 * va chercher les montants — mais il n'est pas superposable image par image.
 * C'est un CHOIX de methode, pas un echec de reproduction.
 *
 * ── LES VALEURS ────────────────────────────────────────────────────────────
 * Centres MESURES sur la plaque (`dash-layout.json`, jamais deduits du CSS —
 * c'est le piege n°1 de la fiche) : les 4 montants sont a
 * cx = 588 · 933 · 1277 · 1622, cy = 291.
 *
 * ⭐ `rotX: 0` sur les keyframes n'est PAS decoratif : il fait basculer PageCam
 * en mode 3D, qui agrandit via la propriete CSS `zoom` au lieu de
 * `transform: scale`. Avec `scale`, Chromium rasterise la couche a la taille de
 * layout PUIS agrandit — le texte est floute avant d'etre grossi. C'est ce qui
 * garde les montants nets en plan serre.
 */

import React from "react";
import { AbsoluteFill, Easing, Sequence } from "remotion";
import { PageCam } from "../../noteshield/live-page/shotcraft-lib/PageCam";

/** Bornes MESUREES. La coupe a 25,05 s tombe a la frame 49 du plan. */
const F_CUT = 49;
const F_END = 110; // 27,07 s

/** La page fait 1080 de haut — la meme que le cadre. */
const PAGE_H = 1080;

/** Centres des 4 montants, mesures (dash-layout.json). */
const AMOUNT_CX = [588, 933, 1277, 1622];
const AMOUNT_CY = 291;

export const Plan08Dashboard: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b100d" }}>
      {/*
        A — « Platform overview ». La reference garde la camera FIXE ici : ce qui
        bouge, ce sont les cartes qui se posent et la liste qui tombe en cascade.
        On respecte l'intention (plan pose, on decouvre l'outil) avec une tres
        legere derive avant — assez pour que le plan ne soit pas mort, pas assez
        pour concurrencer le mouvement du sous-plan B.
      */}
      <Sequence durationInFrames={F_CUT}>
        <PageCam
          src="_client-sim/foster/screens/dash-overview.png"
          pageH={PAGE_H}
          keys={[
            /**
             * ⚠️ zoom de depart 1,04 et non 1,0 : `PageCam` a un fond papier
             * `#faf7f2` par defaut (note dans la fiche) qui depasse des que la
             * page ne couvre pas exactement le cadre — une bande claire
             * apparaissait en haut au rendu v4. Un leger sur-cadrage la mange.
             */
            { frame: 0, cx: 960, cy: 540, zoom: 1.04, rotX: 0 },
            { frame: F_CUT, cx: 960, cy: 528, zoom: 1.1, rotX: 0 },
          ]}
        />
      </Sequence>

      {/*
        B — coupe franche, puis on va chercher les montants. La camera part de la
        vue d'ensemble et se resserre entre le 2e et le 3e montant : en fin de
        plan la reference montre £590,940 et £422,780.82 en gros, avec £2,592
        entame a droite.
      */}
      <Sequence from={F_CUT} durationInFrames={F_END - F_CUT}>
        <PageCam
          src="_client-sim/foster/screens/dash-billing.png"
          pageH={PAGE_H}
          keys={[
            { frame: 0, cx: 960, cy: 540, zoom: 1.04, rotX: 0 },
            {
              frame: F_END - F_CUT,
              cx: (AMOUNT_CX[1] + AMOUNT_CX[2]) / 2,
              cy: AMOUNT_CY,
              zoom: 1.9,
              rotX: 0,
            },
          ]}
          /**
           * Le mouvement de la reference est REGULIER (correlation croisee :
           * ~110 px par 0,2 s, stable d'un bout a l'autre) — donc pas d'ease
           * marque. On garde une legere sortie pour que l'arrivee se pose.
           */
          ease={Easing.bezier(0.4, 0, 0.35, 1)}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
