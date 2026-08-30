// MOTEUR: objet/metaphore SVG (flux d'INTERFACE anime par code)
//
// REPRO-DOCS — reproduction d'une piece REELLEMENT VENDUE.
// Source : kamotionstudio.site, `08_Docs.lottie` (2000x2000, 60 fps, 151 frames
// = 2,52 s). Meme studio que `repro-redeem`, cite comme niveau-cible dans
// `memory/projects/RECHERCHE-MARCHE-INDEX.md`.
//
// ⭐⭐ CE FICHIER NE DESSINE RIEN. Il PILOTE des formes dessinees ailleurs
// (`assets/planche-docs.svg` -> module genere `planche.ts`). Regle n°0 : le
// modele dessine le statique, NOUS animons.
//
// ⭐ LA PARTITION EST RELEVEE, PAS DEVINEE. Toutes les valeurs ci-dessous sont
// lues dans le .lottie source (keyframes `s`/`e`, frames a 60 fps). Aucune n'est
// un dosage a l'oeil. Cf. `feedback_recouvrement-est-un-probleme-d-ancre-pas-de-dosage`
// (2026-08-30) : sur une repro, ce qui se mesure ne se devine pas.
//
// LE MECANISME, ET C'EST LUI QU'ON VIENT APPRENDRE :
// les 3 documents et la photo sont PARENTES A UN MEME NULL (`Null 1`). Ils
// convergent chacun vers leur place (f30-75), puis c'est le NULL qui se deplace
// et pivote de -90 deg (f55-85) : toute la pile bascule d'un coup dans le
// dossier. Ce n'est pas 4 animations synchronisees, c'est UNE animation de
// parent. Un 2e null (`Null 2`) porte la scene entiere et fait le recadrage
// final (f75-125).
//
// LE RECIT :
//   f0-30    le curseur entre depuis le bas-droite et vient sur les documents
//   f30-75   photo et documents convergent vers la pile
//   f55-85   LE NULL bascule (-90 deg) : la pile part dans le dossier
//   f75-85   le curseur s'efface (son travail est fait)
//   f89-94   les documents s'eteignent : ils sont avales
//   f93-113  le logo client apparait
//   f75-125  recadrage general vers le centre

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";

import { rabatD } from "./rabat";
import {
  DOC,
  PHOTO,
  FOLDER_BACK,
  CURSOR,
  LOGO,
} from "./planche";

const W = 2000;
const H = 2000;

// ⭐⭐ ECHELLES MESUREES DANS LE RENDU DE REFERENCE, calque par calque isole
// (chaque calque rendu seul a 2000x2000, bbox du non-blanc relevee).
// ⛔ NE PAS les recalculer depuis les `s` du .lottie : les documents passent par
// une PRECOMP dont l'ancre est decalee (a=(966,9;669,2) pour p=(215;277)), donc
// le `s=100 %` du calque racine ne dit PAS la taille a l'ecran. Premiere passe :
// documents rendus a 111 px au lieu de 430 -> minuscules a cote du dossier.
//   document 111x135 -> 430x554  (x3,87)
//   photo     46x46  -> 314x313  (x6,83)
//   curseur   29x34  -> 213x239  (x7,30)
//   dossier  103x86  -> 696x515  (x6,76 / x5,99)
const K_DOC = 3.87;
const K_PHOTO = 6.83;
const K_CURSEUR = 7.3;
const K_DOSSIER_X = 6.76;
const K_DOSSIER_Y = 5.99;

// ⭐⭐ LES EASINGS SONT RELEVES UN PAR UN, ils ne sont PAS interchangeables.
// La 1re version imposait une bezier unique (0.33,0,0.15,1) « puisque la
// reference n'utilise pas de courbe exotique » : la bascule arrivait EN AVANCE
// (hauteur mesuree 0,74 contre la reference a f70). Chaque calque a la sienne :
const EASE_NULL = Easing.bezier(0.167, 0.167, 0.667, 1); // Null 1 : p ET r
const EASE_ENTREE = Easing.bezier(0.029, 0, 0.148, 1); // 1er segment docs+photo
const EASE_POSE = Easing.bezier(0.167, 0, 0, 1); // 2e segment : la pose
const EASE_CURSEUR = Easing.bezier(0.333, 0, 0.36, 1); // Arrow .p
const EASE_CADRE = Easing.bezier(0.333, 0, 0, 1); // Null 2 : le recadrage
const EASE_RABAT = Easing.bezier(0.167, 0.167, 0.157, 1); // ouverture/fermeture du rabat

/** interpolate 2D, avec les memes bornes clampees partout.
 *  ⛔ L'easing est un PARAMETRE : il change d'un calque a l'autre (cf. ci-dessus). */
const pos = (
  frame: number,
  frames: number[],
  xs: number[],
  ys: number[],
  easing: (t: number) => number,
): [number, number] => [
  interpolate(frame, frames, xs, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  }),
  interpolate(frame, frames, ys, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  }),
];

/**
 * Pose un groupe DESSINE (chaine SVG issue de `planche.ts`) sous une
 * transformation. ⛔ Les chaines sont du MARKUP : passees en enfant JSX elles
 * s'affichent en texte brut — c'est-a-dire, sur fond blanc, RIEN DU TOUT.
 * Vecu le 2026-08-30 : rendu integralement vide, 0 pixel non-blanc, sans la
 * moindre erreur de compilation. Il FAUT `dangerouslySetInnerHTML`.
 */
const Piece: React.FC<{ html: string; transform: string; opacite?: number }> = ({
  html,
  transform,
  opacite = 1,
}) => {
  if (opacite <= 0.001) return null;
  return (
    <g
      opacity={opacite}
      transform={transform}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const ReproDocs: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== NULL 2 — le porteur de toute la scene ============================
  // p : (1016,1706) -> (1024,1004) sur f75-125. C'est le recadrage final : la
  // scene se joue en bas, puis remonte au centre une fois le dossier ferme.
  const [n2x, n2y] = pos(frame, [75, 125], [1016, 1024], [1706, 1004], EASE_CADRE);

  // ===== NULL 1 — le porteur de la PILE (docs + photo) =====================
  // p : (-278,-802) -> (332,142) et r : 0 -> -90 deg, tous deux sur f55-85.
  // ⭐ C'est LE geste de la piece : la pile ne tombe pas, elle BASCULE.
  const [n1x, n1y] = pos(frame, [55, 85], [-278, 332], [-802, 142], EASE_NULL);
  const n1rot = interpolate(frame, [55, 85], [0, -90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_NULL,
  });

  // ===== LE CURSEUR ========================================================
  // ⭐⭐ POSITIONS MESUREES A L'ECRAN, pas calculees depuis `p`. Le calque `Arrow`
  // a une ancre a=(63,5;114,5) a l'echelle 652 % : la reconstruire de tete donnait
  // 204 px d'erreur en vertical. Coin haut-gauche du curseur, releve calque isole :
  //   f0 (1275,1419) · f10 (1043,1194) · f20 (757,917) · f30 (689,851)
  //   f43 (689,851)  · f60 (822,1039)  · f75 (1188,1467)
  // ⭐ Et il REPART apres f60 : la 1re version le laissait fige jusqu'a sa
  // disparition, le geste de retrait manquait completement.
  // Ces valeurs sont ABSOLUES (repere de la comp), donc posees hors du null 2.
  const [curX, curY] = pos(
    frame,
    [0, 10, 20, 30, 60, 75, 85],
    [1275, 1043, 757, 689, 822, 1188, 1264],
    [1419, 1194, 917, 851, 1039, 1467, 1516],
    EASE_CURSEUR,
  );
  const curOp = interpolate(frame, [75, 85], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ===== LA PHOTO — 2 segments enchaines ===================================
  // f30-60 : (6,77) -> (-52,35)   puis   f60-85 : -> (28,-171)
  const [phX, phY] = pos(
    frame,
    [30, 60, 85],
    [6.007, -51.993, 28.007],
    [77.389, 35.389, -170.611],
    EASE_ENTREE,
  );

  // ===== LES 3 DOCUMENTS ===================================================
  // Chacun a SA trajectoire et SON depart decale (35 / 40 / 45) : la cascade
  // fait la vie. Les 2 premiers ont 2 segments, le 3e un seul.
  const DOCS: { frames: number[]; xs: number[]; ys: number[] }[] = [
    { frames: [35, 65, 85], xs: [15, 59, 87], ys: [-521, -185, -291] },
    { frames: [40, 70, 85], xs: [553, 93, 105], ys: [-521, -253, -313] },
    { frames: [45, 75], xs: [553, 124], ys: [100, -326] },
  ];
  // Tous s'eteignent ensemble sur f89-94 : ils sont avales par le dossier.
  const docOp = interpolate(frame, [89, 94], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ===== LE LOGO — l'aboutissement =========================================
  // o : 0 -> 100 sur f93-113, pile quand les documents ont disparu.
  const logoOp = interpolate(frame, [93, 113], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* NULL 2 : le porteur global (ancre (50,50) dans la source).
            ⭐ Le dossier est FIXE dans le repere de ce null : mesure a f0, sa
            bbox ecran est (664,1381)-(1360,1896) quand le null est en
            (1016,1706). Son coin haut-gauche vaut donc null + (-352,-325). */}
        <g transform={`translate(${n2x - 50} ${n2y - 50})`}>
          {/* decalage du dossier dans le repere du null, mesure */}
          {/* Le dos du dossier : fixe, il recoit la pile. */}
          <Piece
            html={FOLDER_BACK}
            transform={`translate(-302 -275) scale(${K_DOSSIER_X} ${K_DOSSIER_Y})`}
          />

          {/* LA PILE — docs + photo, tous portes par le meme null.
              ⭐ L'ordre compte : rotate APRES translate, comme dans la source
              (le pivot est l'origine du null, pas le centre de la pile). */}
          <g
            opacity={docOp}
            transform={`translate(${n1x} ${n1y}) rotate(${n1rot})`}
          >
            {DOCS.map((d, i) => {
              const [x, y] = pos(frame, d.frames, d.xs, d.ys, EASE_ENTREE);
              return (
                <Piece
                  key={i}
                  html={DOC}
                  transform={`translate(${x - 215} ${y - 277}) scale(${K_DOC})`}
                />
              );
            })}
            <Piece
              html={PHOTO}
              transform={`translate(${phX - 23} ${phY - 23}) scale(${K_PHOTO})`}
            />
          </g>

          {/* Le rabat AVANT : dessine APRES la pile, il la recouvre — c'est ce
              qui donne l'impression que les documents entrent DANS le dossier. */}
          {/* ⭐ LE RABAT S'OUVRE ET SE REFERME — animation de FORME, pas un
              transform (cf. `rabat.ts`). Ferme a f0, ouvert de f30 a f75 pendant
              que les feuilles tombent, referme a f105.
              Le calque est enfant du dos du dossier dans la source : il herite
              donc de la meme echelle. Son repere est centre (sommets negatifs),
              d'ou le recentrage sur la moitie du dossier. */}
          <g
            transform={`translate(-302 -275) scale(${K_DOSSIER_X} ${K_DOSSIER_Y}) translate(59.2 51.7)`}
          >
            <path
              d={rabatD(frame, (t) => EASE_RABAT(t))}
              fill="#ffcf00"
              stroke="#0d3847"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>

          {/* Le logo client, une fois le dossier referme. */}
          {logoOp > 0.001 && (
            <Piece
              html={LOGO}
              opacite={logoOp}
              transform="translate(-21 -21) scale(2.79)"
            />
          )}
        </g>

        {/* LE CURSEUR — au-dessus de tout, comme dans la reference. */}
        {curOp > 0.001 && (
          <Piece
            html={CURSOR}
            opacite={curOp}
            transform={`translate(${curX} ${curY}) scale(${K_CURSEUR})`}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
