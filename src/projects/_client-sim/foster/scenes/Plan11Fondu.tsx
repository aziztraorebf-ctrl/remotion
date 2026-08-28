// MOTEUR: fond seul — noir + grain pointille (fin de video)
/**
 * FOSTER — PLAN 11 (40,46 -> 42,75 s) : LE NOIR FINAL
 * ===================================================
 * Reference : public/_client-sim/_references/foster/foster-with-confidence.mp4
 * 69 frames a 30 fps (2,29 s).
 *
 * ⛔⛔ LE TABLEAU ANNONCAIT « fondu au noir, texture pointillee ». La mesure
 * corrige les deux moities de cette phrase :
 *
 * 1. **IL N'Y A PAS DE FONDU.** Le noir est DEJA la des la premiere frame
 *    (luminance moyenne 1,275 a f0, puis 1,153 stable jusqu'a la fin — aucune
 *    rampe). Le fondu appartient a la FIN DU PLAN 10, qui l'execute deja
 *    (`greenOut`, 39,4 -> 40,2 s). Le coder ici l'aurait joue DEUX FOIS.
 *
 * 2. **LA « TEXTURE POINTILLEE » EST UN GRAIN, PAS DES POINTS.** Mesure sur une
 *    zone propre (hors watermark) :
 *      fond      luminance 1
 *      « points » luminance mediane 6, max 14
 *      couverture 1,354 % de la surface
 *      trame      ~81 px en X, ~51 px en Y
 *    A 6/255 sur un fond a 1/255, c'est a la limite du visible — un grain de
 *    compression stylise, pas une trame de points marques. Le rendre plus
 *    lisible serait plus faux que de ne rien mettre.
 *
 * ⭐⭐ CE QUE LA REFERENCE MONTRE APRES 42,19 s N'EST PAS LA VIDEO : c'est
 * L'INTERFACE DU LECTEUR FIVERR qui revient en fin de lecture (le « 7 of 20 »,
 * la barre de progression, le temoignage client « an excellent job creating the
 * explainer video for our SaaS product », un spinner). Meme artefact de capture
 * que sur la premiere seconde du plan 1, deja documente. On ne le reproduit pas.
 * ⚠️ La source s'arrete a 42,752 s : le plan ne dure que 59 frames de matiere
 * reelle, pas 69. On garde 69 pour respecter la duree annoncee du montage — les
 * 10 dernieres sont du noir, ce que la reference montre aussi sous son overlay.
 */

import React from "react";
import { AbsoluteFill } from "remotion";

/** 40,46 -> 42,75 s = 69 frames a 30 fps. */
const F_END = 69;

/**
 * Le grain. ⛔ PAS 520 points comme au premier jet : la mesure demandait
 * **1,354 % de la surface** couverte, et 520 points n'en donnaient que 0,007 % —
 * 200 fois trop peu. Il en faut ~7 000, ce qui exclut de poser autant de `<div>`.
 * On utilise donc un `radial-gradient` REPETE : la trame mesuree est justement
 * reguliere (~81 px en X, ~51 px en Y), donc une tuile CSS la decrit exactement
 * et ne coute qu'une seule couche.
 *
 * ⚠️ Pas d'animation : la diff inter-frames de la reference est a 0,00 sur tout
 * le plan — le grain est FIXE. Un grain qui grouille serait un ajout, pas une
 * reproduction.
 */
export const Plan11Fondu: React.FC = () => {
  return (
    /* Fond a luminance 1, MESURE — pas un `#000` pur : la reference n'est jamais
       a zero, elle plafonne a 1/255 sur toute la zone propre. */
    <AbsoluteFill style={{ backgroundColor: "rgb(1,1,1)" }}>
      <AbsoluteFill
        style={{
          /* Deux trames superposees et decalees : une seule grille reguliere se
             lit comme un quadrillage, deux se lisent comme du grain. Tailles
             calees sur la mesure (81 x 51 px, et sa moitie pour la seconde). */
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.06) 1.0px, rgba(0,0,0,0) 1.8px)," +
            "radial-gradient(circle at 70% 75%, rgba(255,255,255,0.045) 0.9px, rgba(0,0,0,0) 1.6px)",
          /* Cales sur la couverture MESUREE (1,354 % de la surface). Un premier
             reglage donnait 1,087 % : les rayons sont montes d'un dixieme de px. */
          backgroundSize: "81px 51px, 43px 27px",
        }}
      />
    </AbsoluteFill>
  );
};
