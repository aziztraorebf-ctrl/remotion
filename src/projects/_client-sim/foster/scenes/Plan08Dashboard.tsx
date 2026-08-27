// MOTEUR: UI produit — plaques capturees + decoupes + PageCam (pilier B2B n3)
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
 * sur les montants ». FAUX sur la mecanique : le plan est en DEUX SOUS-PLANS
 * separes par une COUPE FRANCHE mesuree a 25,05 s (pic inter-frames 81,3 contre
 * ~5 autour). C'est GROK (3e voix) qui l'a releve ; Gemini decrivait un
 * mouvement continu.
 *   A · 23,40 -> 25,05 s (49 frames) — « Platform overview », l'UI SE PEUPLE
 *   B · 25,05 -> 27,07 s (61 frames) — « Billing », PAN LATERAL sur les montants
 *
 * ── ⭐⭐ LES 2 CORRECTIONS D'AZIZ SUR LE RENDU PRECEDENT ────────────────────
 *
 * 1. « Nous commencons directement avec tout qui est sur la page ; dans la video
 *    originale les icones apparaissent un par un, c'est graduel. »
 *    ⛔ J'avais BIEN code cette apparition dans une 1re version, puis je l'ai
 *    PERDUE en passant a la plaque capturee — une plaque est une photo, tout y
 *    est deja — et je ne l'ai pas signale.
 *    ⭐ Le socle avait la reponse et je ne l'avais pas appliquee. Fiche
 *    `row-embed` : « une ligne qui s'anime est un DECOUPAGE de la plaque, JAMAIS
 *    un redessin — le rendu de police d'un redessin differe visiblement de celui
 *    de la plaque au sol ». On pose donc des DECOUPES (une PNG par carte, une
 *    par ligne) sur une PLAQUE VIDE. Zero redessin, apparition graduelle.
 *
 * 2. « Une fois qu'on passe a la 2e page, il y a un mouvement lateral. Est-ce
 *    qu'on peut reproduire la meme chose ou est-ce impossible ? »
 *    ⛔ J'avais ete trop categorique en disant que non. `PageCam` interpole `cx`
 *    librement : un pan horizontal est parfaitement possible. Ma limite venait
 *    d'ailleurs (je voulais une page de 3400 px, or il plaque sur 1920).
 *    -> le zoom central est remplace par un VRAI PAN LATERAL, de la carte 1 vers
 *    la carte 4. ⚠️ Reste un ecart d'AMPLITUDE : leur page est plus large que le
 *    cadre, la notre non — notre parcours est donc plus court que le leur.
 *
 * ── LES VALEURS (mesurees, `dash-layout.json`) ─────────────────────────────
 * Cartes (les 2 etats) : cx = 588 · 933 · 1277 · 1622 · largeur 327
 *   overview cy = 295 · billing cy = 291
 * Lignes overview : y = 493 · 558 · 623 · 688, hauteur 65
 *
 * ⭐ `rotX: 0` fait basculer PageCam en mode 3D, qui agrandit via la propriete
 * CSS `zoom` et non `transform: scale` — le texte reste net en plan serre.
 */

import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PageCam } from "../../noteshield/live-page/shotcraft-lib/PageCam";

/** Bornes MESUREES. La coupe a 25,05 s tombe a la frame 49 du plan. */
const F_CUT = 49;
const F_END = 110; // 27,07 s

const PAGE_H = 1080;
const SCREENS = "_client-sim/foster/screens";

/**
 * Positions MESUREES (`dash-layout.json`), en px de page.
 * ⛔⛔ CES VALEURS SE LISENT, ELLES NE SE CALCULENT PAS. J'ai code `y = 295 - 212`
 * (centre moins hauteur) au lieu du `y: 189` qui etait dans le fichier : les
 * cartes recouvraient le titre et la date. C'est le PIEGE N°1 de la fiche —
 * « MESURER sur la plaque, ne jamais deduire » — que je venais de citer dans mon
 * propre commentaire deux lignes plus haut.
 */
const CARD_X = [425, 770, 1114, 1459];
const CARD_Y = 189;
const CARD_W = 327;
const CARD_H = 212;
const CARD_CX = [588, 933, 1277, 1622];
const ROW_X = 425;
const ROW_W = 1360;
const ROW_Y = [493, 558, 623, 688];
const ROW_H = 65;

/**
 * Une DECOUPE qui apparait : on pose la PNG de l'element a sa position exacte.
 * ⛔ Jamais un redessin — c'est le morceau de la photo, donc meme police, meme
 * rendu, meme antialiasing que la plaque au sol.
 */
const Cutout: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  appear: number;
}> = ({ src, x, y, w, h, appear }) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      opacity: appear,
      // « fondu + de-flou (ghost leger -> opaque) », releve par Grok — ce n'est
      // pas une translation : les cartes ne glissent pas, elles se materialisent.
      filter: `blur(${(1 - appear) * 7}px)`,
    }}
  />
);

/** SOUS-PLAN A — l'UI se peuple : 4 cartes puis 4 lignes en cascade. */
const Overview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    /**
     * ⚠️ PAS de plaque de fond ici : `PageCam` l'affiche deja via sa prop `src`.
     * Ces enfants vivent dans l'espace PAGE, donc en coordonnees de page (1920 x
     * 1080), et heritent du zoom/pan de la camera.
     */
    <>
      {/*
        Les 4 cartes, une par une, de GAUCHE A DROITE.
        Cadence mesuree par Grok sur la reference : ~1 carte toutes les
        0,35-0,40 s, soit ~11 frames a 30 fps.
      */}
      {CARD_X.map((x, i) => (
        <Cutout
          key={`c${i}`}
          src={`${SCREENS}/dash-overview-card${i + 1}.png`}
          x={x}
          y={CARD_Y}
          w={CARD_W}
          h={CARD_H}
          appear={spring({
            frame: frame - (3 + i * 11),
            fps,
            config: { damping: 200 },
            durationInFrames: 10,
          })}
        />
      ))}

      {/*
        Les lignes de la liste tombent ensuite, en CASCADE HAUT -> BAS
        (~1 rangee toutes les 0,25-0,35 s, soit ~9 frames).
        Elles demarrent apres les cartes : la reference ne fait pas tout arriver
        en meme temps, c'est ce qui donne au plan son rythme.
      */}
      {ROW_Y.map((y, i) => (
        <Cutout
          key={`r${i}`}
          src={`${SCREENS}/dash-overview-row${i + 1}.png`}
          x={ROW_X}
          y={y}
          w={ROW_W}
          h={ROW_H}
          appear={interpolate(frame, [14 + i * 9, 24 + i * 9], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      ))}
    </>
  );
};

export const Plan08Dashboard: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b100d" }}>
      {/*
        A — la camera reste posee (la reference ne bouge pas ici) ; ce sont les
        elements qui arrivent. Une derive tres legere evite le plan mort.
      */}
      <Sequence durationInFrames={F_CUT}>
        <PageCam
          src={`${SCREENS}/dash-overview-empty.png`}
          pageH={PAGE_H}
          keys={[
            /**
             * ⚠️ zoom 1,04 et non 1,0 : `PageCam` a un fond papier `#faf7f2` par
             * defaut qui depasse si la page ne couvre pas exactement le cadre
             * (bande claire en haut, vue au rendu v4). Un leger sur-cadrage la mange.
             */
            { frame: 0, cx: 960, cy: 540, zoom: 1.04, rotX: 0 },
            { frame: F_CUT, cx: 960, cy: 528, zoom: 1.09, rotX: 0 },
          ]}
        >
          {/* les decoupes vivent dans l'espace PAGE, donc en enfants de PageCam */}
          <Overview />
        </PageCam>
      </Sequence>

      {/*
        B — coupe franche, puis PAN LATERAL sur les montants (correction d'Aziz).
        La camera part sur le 1er montant et glisse jusqu'au 4e : les cartes
        defilent horizontalement, on sort de l'une pour entrer dans l'autre.
      */}
      <Sequence from={F_CUT} durationInFrames={F_END - F_CUT}>
        <PageCam
          src={`${SCREENS}/dash-billing.png`}
          pageH={PAGE_H}
          keys={[
            /**
             * ⚠️ cy = 400 et non 291 (le centre des cartes) : vise trop haut, le
             * fond papier `#faf7f2` de PageCam depasse au-dessus de la page et
             * fait une bande claire en haut de cadre (vu au rendu v7). On cadre
             * un peu plus bas — les montants restent dans le tiers superieur,
             * comme dans la reference.
             */
            { frame: 0, cx: CARD_CX[0], cy: 400, zoom: 1.55, rotX: 0 },
            {
              frame: F_END - F_CUT,
              cx: CARD_CX[3],
              cy: 400,
              zoom: 1.55,
              rotX: 0,
            },
          ]}
          /**
           * Le pan de la reference est REGULIER (correlation croisee : ~110 px
           * par 0,2 s, stable d'un bout a l'autre) — donc quasi LINEAIRE.
           * Un ease-in-out ferait respirer un mouvement qui ne respire pas.
           */
          ease={Easing.bezier(0.25, 0, 0.3, 1)}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
