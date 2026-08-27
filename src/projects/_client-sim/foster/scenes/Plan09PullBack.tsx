// MOTEUR: UI produit — meme plaque capturee que le plan 8, recadree (pilier B2B n3)
/**
 * FOSTER — PLAN 9 (27,07 -> 28,07 s) : LA PLAQUE ENTIERE, FIN DE COURSE
 * ====================================================================
 * Reference : public/_client-sim/_references/foster/foster-with-confidence.mp4
 *
 * ⛔⛔ LE TABLEAU DE DECOUPAGE DISAIT « transition (1 s), contenu a MESURER ».
 * Ce n'est PAS une transition : c'est un PLAN a part entiere, le dernier temps
 * du dashboard. Mesure sur la reference (frames 26,80 -> 28,37, crop 1920 centre) :
 *
 *   27,067 s  COUPE FRANCHE (diff inter-frames 94,3 contre ~3 avant) — on passe
 *             du plan serre du plan 8 a la plaque VUE EN ENTIER.
 *   28,067 s  COUPE FRANCHE (diff 150,5) vers le plan 10 (typo, fond vert sombre,
 *             le premier mot « Not » est deja lisible sur la 1re frame).
 *
 * ── ⭐⭐ CE QUE LA MESURE CONTREDIT : IL N'Y A AUCUN CHANGEMENT D'ECHELLE ──
 * bbox de la plaque, frame par frame (seuil de luminance 90, watermark masque) :
 *
 *   t       x0    x1     W     H
 *   27,067  199  1877  1678  904
 *   27,133  176  1855  1679  904
 *   27,267  151  1829  1678  904
 *   27,467  133  1811  1678  904
 *   27,733  123  1801  1678  904
 *   28,033  120  1799  1679  904
 *
 * ⭐ W et H sont CONSTANTS a 1 px pres sur toute la duree. Ce n'est donc ni un
 * pull back ni un push-in : c'est un PAN HORIZONTAL PUR de 79 px vers la gauche,
 * fortement amorti. J'ai failli coder un dezoom parce que le plan « a l'air » de
 * s'ouvrir — c'est le PIEGE N°2 du fichier projet (« ne jamais convertir une
 * impression en facteur sans mesurer le rapport reel »). Le sentiment d'ouverture
 * vient de la COUPE qui precede, pas d'un mouvement.
 *
 * ── L'AMORTISSEMENT (mesure, diff inter-frames) ────────────────────────────
 * 8,00 -> 6,65 -> 5,48 -> 4,40 -> 3,26 -> 2,15 -> 1,27 -> 0,65 -> 0,17 -> 0,02
 * Decroissance exponentielle propre, quasi immobile des 27,90 s. 55 des 79 px
 * sont consommes dans les 200 premieres ms. C'est une FIN DE COURSE (le pan du
 * plan 8 qui se pose), donc `Easing.out(Easing.expo)` et non un ease-in-out.
 *
 * ── LA GEOMETRIE : RESOLUE PAR SYSTEME, PAS DOSEE ─────────────────────────
 * Plaque 1678 x 904 dans un cadre 1920 x 1080 => ratio 1,856, alors que la page
 * capturee est en 1,778. La page n'est donc pas seulement REDUITE, elle est
 * RECADREE en hauteur : on n'en voit ni le haut ni le bas.
 *
 * ⛔⛔ LA v1 A ECHOUE, ET PAS SUR UN DOSAGE. A zoom 1,044 / cx 960 la plaque
 * sortait a 1731 px (contre 1678) et, aux premieres frames, le bord GAUCHE de la
 * page entrait dans le cadre (x0 = 0, W = 1904) : PageCam remplit alors le
 * hors-champ avec son fond papier `#faf7f2`. C'est le defaut deja paye au plan 8
 * — a droite cette fois-ci — et sa cause est la meme : LA PAGE N'EST PAS ASSEZ
 * LARGE pour le pan demande.
 *
 * ⭐ Resolution par systeme (2 cibles mesurees, 2 inconnues), jamais par retouche :
 *   les bords de la fenetre dans l'espace page sont mesures sur la plaque
 *   (x 130 -> 1789,5 en coords de page), les 2 cibles ecran sont celles de la
 *   reference — [199, 1877] a la 1re frame, [120, 1799] a la derniere. D'ou
 *   ZOOM et CX directement, sans essai.
 *
 * ⭐⭐ ET LA VRAIE CORRECTION EST EN AMONT, PAS DANS LES VALEURS. Le systeme
 * montrait qu'a la bonne echelle le bord de page tombait A +67 px DANS le cadre :
 * aucune valeur de cx ne pouvait sauver ca. `PageCam` codant son `#faf7f2` en
 * dur (aucune prop de fond) et etant partage avec noteshield, on n'y touche pas :
 * on ADAPTE L'ENTREE a ce que le socle sait faire (regle 3 du protocole projet).
 * `dash-billing-wide.png` = la plaque elargie de 130 px de page de chaque cote,
 * remplis avec le PROFIL VERTICAL du fond echantillonne sur ses propres colonnes
 * de bord — donc le meme degrade vert, pas un aplat approche.
 * ⚠️ `PageCam` force `width: 1920` sur la page : une plaque plus large se
 * comprimerait horizontalement. On lui rend donc sa hauteur proportionnelle
 * (pageH = 1080 x 1920/2180 = 951) pour conserver le ratio.
 *
 * Liseré doré mesure au bord de la plaque : ~#d5bb84 (mesure (213,187,136)).
 * Fond : vert sombre en bas (28,62,45), quasi noir en haut (20,19,15).
 */

import React from "react";
import {
  AbsoluteFill,
  Easing,
} from "remotion";
import { PageCam } from "../../noteshield/live-page/shotcraft-lib/PageCam";

/** 27,07 -> 28,07 s = 30 frames a 30 fps. */
const F_END = 30;

/**
 * ⚠️ PAS 1080 : la plaque elargie fait 2180 px de page de large, or `PageCam`
 * impose `width: 1920`. On lui passe la hauteur proportionnelle pour que la page
 * ne soit pas comprimee horizontalement.
 */
const PAGE_H = 951;
const SCREENS = "_client-sim/foster/screens";

/**
 * ⭐ Valeurs RESOLUES (voir l'en-tete), pas dosees : la fenetre occupe
 * x 229,0 -> 1690,6 dans cet espace page, et doit couvrir [199, 1877] a l'ecran
 * en debut de plan puis [120, 1799] en fin — soit exactement les bbox mesurees
 * sur la reference.
 * Controle fait avant le rendu : aux deux extremites le bord gauche de la page
 * tombe a -64 / -143 px (hors cadre) et le bord droit a 2142 / 2063 px (hors
 * cadre) ; la hauteur couverte vaut 1092 px pour un cadre de 1080. Aucun fond
 * papier ne peut donc apparaitre.
 */
const ZOOM = 1.1488;
const CX_START = 891.4;
const CX_END = 960.2;

export const Plan09PullBack: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#16241b" }}>
      <PageCam
        src={`${SCREENS}/dash-billing-wide.png`}
        pageH={PAGE_H}
        keys={[
          { frame: 0, cx: CX_START, cy: PAGE_H / 2, zoom: ZOOM, rotX: 0 },
          { frame: F_END, cx: CX_END, cy: PAGE_H / 2, zoom: ZOOM, rotX: 0 },
        ]}
        /**
         * Fin de course, pas un mouvement qui respire : 55 des 79 px sont
         * consommes dans les 200 premieres ms, puis ca se pose (diff inter-frames
         * mesuree 8,00 -> 0,02 en 30 frames). `Easing.out(Easing.exp)` reproduit
         * cette decroissance exponentielle ; un ease-in-out ferait respirer un
         * mouvement qui ne respire pas.
         */
        ease={Easing.out(Easing.exp)}
      />
    </AbsoluteFill>
  );
};
