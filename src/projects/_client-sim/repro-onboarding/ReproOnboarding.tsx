// MOTEUR: objet/metaphore SVG (flux d'INTERFACE anime par code)
//
// REPRO-ONBOARDING — 3e piece du chantier corpus, en mode « MECANIQUE SEULE ».
//
// ⭐⭐ POURQUOI CE N'EST PAS UNE COPIE (decision d'Aziz, 2026-08-30).
// La piece source `12_BVaKTgmqgb.lottie` (kamotionstudio, 2000x4369, 4,58 s) a
// ete mesuree avant d'etre reproduite : sur ses **214 calques, 176 sont FIXES**,
// et les 38 animes le sont a **37/38 en OPACITE SEULE** (+1 changement
// d'echelle). Aucune position, aucune rotation, aucune deformation.
// => elle ne contient AUCUN geste a apprendre. Son savoir-faire tient dans 3
// regles de timing, relevees et rejouees a l'identique dans `cascade.ts`.
// Le DECOR, lui, est le notre : recopier 176 elements de l'interface d'un tiers
// n'apprend rien et ne vaut rien en portfolio (on ne peut pas montrer l'ecran
// d'une app qui n'est pas a nous).
//
// ⛔ Les ecrans sont ceux d'un produit FICTIF (« Loop », gestion de taches).
// Aucune marque reelle : la 1re version des pastilles portait « slack / drive /
// figma » — c'etait une erreur de MON brief, corrigee en « chat / files /
// design ». Un ecran de demo qui affiche des marques tierces est inutilisable
// commercialement et suggere une integration qui n'existe pas.
//
// LE RECIT (275 frames a 60 fps, comme la source) :
//   f0-33     l'ecran 1 se deploie en cascade, de haut en bas
//   f33-75    il est pose, lisible
//   f75-113   il se replie EN ORDRE INVERSE (par le bas) — « ca se range »
//   f102-134  le bouton d'action arrive en rebondissant (0 -> 110 % -> 100 %)
//   f113-160  l'ecran 2 se deploie a son tour
//   f160-200  l'interrupteur bascule : gris -> vert
//   f200-275  l'ecran reste pose

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import {
  entree,
  sortie,
  rebond,
  glissement,
  glissementVivant,
  pulsationCle,
} from "./cascade";
import {
  ECRAN_INVITE,
  ECRAN_REGLAGES,
  E1_MEMBRE_1,
  E1_MEMBRE_2,
  E1_MEMBRE_3,
  E1_MEMBRE_4,
  E1_MEMBRE_5,
  E1_MEMBRE_6,
  E2_ETAPE_2,
  E2_APERCU,
  E2_NOTE,
  E2_PIED,
  E2_TOGGLE_OFF,
  E2_TOGGLE_ON,
  BOUTON_FLOTTANT,
} from "./planche";

// ⭐ THEME — le fond suit la planche generee. Pour livrer la version claire :
//   THEME=clair python3 assets/gen-planche.py && python3 assets/extraire-groupes.py
// puis basculer cette constante. C'est le SEUL point du CODE a toucher : tout
// le reste (13 couleurs, 11 ombres, 4 opacites de texte) vit dans le generateur.
const FOND_ECRAN = "#0e1116"; // clair : "#f7f8fa"
const W = 500;
const H = 1080;

// Reperes de la piece, relevés dans la planche (l'ecran y est a translate(40 50),
// donc les positions locales sont les coordonnees de planche moins cet offset).
const MEMBRES = [
  E1_MEMBRE_1,
  E1_MEMBRE_2,
  E1_MEMBRE_3,
  E1_MEMBRE_4,
  E1_MEMBRE_5,
  E1_MEMBRE_6,
];
const MEMBRE_X = 40;
const MEMBRE_Y0 = 500;
const MEMBRE_PAS = 88;

// Position de l'interrupteur dans l'ecran 2 (rangee 2 de la liste de reglages).
const TOGGLE_X = 388;
const TOGGLE_Y = 316;

// Le bouton flottant, en bas a droite de l'ecran 2.
// ⭐ Le bouton flotte AU-DESSUS du contenu, marge droite et bas — pas dans le
// pied de l'ecran, ou il se confondait avec le bouton principal (V1).
const BOUTON_X = 396;
const BOUTON_Y = 828;
const BOUTON_TAILLE = 72;

// Bornes du recit — memes valeurs que la source.
const SORTIE_1 = 75; // l'ecran 1 commence a se replier
const ENTREE_2 = 105; // l'ecran 2 prend la main, des la fin REELLE de la sortie
const REBOND = 102; // le bouton d'action arrive
const BASCULE = 152; // l'interrupteur passe au vert
// ⭐⭐ LES 1,8 s MORTES DE LA FIN — mesure : 164 frames figees sur 275 (60 % de
// la piece), dont 1,80 s d'affilee apres la bascule. Les 4 voix du DA-brief
// l'ont relevee ; Kimi l'a chiffree (« from 3.05 to 4.56, NOTHING moves »).
// ⛔ On ne comble PAS avec du decoratif (pulsation de bouton, reflet) : ca
// meuble sans rien dire. On fait JOUER l'etape 2, que l'ecran annonce et ne
// montrait jamais. Le temps mort devient la RESOLUTION du recit.
const ETAPE_2 = 186; // la pastille « 2 » s'allume
const NOTIF = 206; // la notification descend — la preuve que ca a marche

/** Injecte une forme dessinee. ⛔ dangerouslySetInnerHTML obligatoire : ces
 *  chaines sont du MARKUP, en enfant JSX elles s'affichent en texte brut. */
const Piece: React.FC<{
  html: string;
  transform?: string;
  opacite?: number;
}> = ({ html, transform, opacite = 1 }) => {
  if (opacite <= 0.001) return null;
  return (
    <g
      opacity={opacite}
      transform={transform}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const ReproOnboarding: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== ECRAN 1 — deploiement puis repli ==================================
  // Rangs de la cascade, de haut en bas : le decor occupe les rangs 0-4
  // (titre, sous-titre, apps, section, banniere), les 6 membres les rangs 5-10.
  // ⭐ La SORTIE inverse l'ordre : le dernier membre part en premier.
  const TOTAL_1 = 5 + MEMBRES.length;
  const opacite1 = (rang: number): number =>
    frame < SORTIE_1
      ? entree(frame, rang)
      : sortie(frame - SORTIE_1, rang, TOTAL_1);
  // ⛔ La sortie dure (TOTAL_1-1)*PAS + FONDU = 30 frames, soit fin a f105,
  // alors que l'ecran 2 n'entrait qu'a f113 en V1 : 8 frames de TROU NOIR.
  // La source etale sa sortie sur 36 frames (f75->f113) sans laisser de vide.
  // On enchaine donc l'ecran 2 des la fin REELLE de notre sortie.

  // Le decor de l'ecran (fond + titre + apps + banniere) est un seul bloc :
  // on lui donne le rang 0, les membres suivent.
  const opDecor1 = opacite1(0);
  const ecran1Visible = frame < ENTREE_2;

  // ===== LE BOUTON D'ACTION — le seul geste non-opacite de la piece ========
  const echelleBouton = rebond(frame, REBOND);

  // ===== ECRAN 2 ============================================================
  const opDecor2 = entree(frame - ENTREE_2, 0);
  const ecran2Visible = frame >= ENTREE_2;

  // L'interrupteur : fondu croise entre les deux etats dessines.
  // ⭐ On ne deplace PAS la pastille a la main — les deux etats sont dessines,
  // on passe de l'un a l'autre. C'est ce que fait la source (2 calques).
  const bascule = interpolate(frame, [BASCULE, BASCULE + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: FOND_ECRAN }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* ---------- ECRAN 1 : inviter l'equipe ----------
            ⭐ Porte par le GLISSEMENT : l'ecran monte de 134 px en decelerant
            pendant que ses elements apparaissent (mesure sur l'original, cf.
            `cascade.ts`). C'est ce mouvement d'ensemble qui manquait a la V1 —
            2,2x moins d'activite que la reference, 70 % de frames figees. */}
        {ecran1Visible && (
          <>
            {/* Le decor (rang 0) : il arrive en premier et se pose en premier. */}
            <Piece
              html={ECRAN_INVITE}
              opacite={opDecor1}
              transform={`translate(0 ${glissement(frame, 0)})`}
            />
            {MEMBRES.map((m, i) => (
              <Piece
                key={i}
                html={m}
                opacite={opacite1(5 + i)}
                transform={
                  `translate(${MEMBRE_X} ` +
                  `${MEMBRE_Y0 + i * MEMBRE_PAS + glissementVivant(frame, 5 + i)})`
                }
              />
            ))}
          </>
        )}

        {/* ---------- ECRAN 2 : autoriser les notifications ---------- */}
        {ecran2Visible && (
          <g transform={`translate(0 ${glissement(frame, 0, ENTREE_2)})`}>
            <Piece html={ECRAN_REGLAGES} opacite={opDecor2} />
            {/* L'interrupteur — L'ACTION CLE du recit : c'est lui que l'etape 1
                designe. ⭐ Il recoit la seule pulsation marquee de la piece
                (+18 %), pour que l'oeil aille LA et nulle part ailleurs. Les 4
                voix du DA-brief ont toutes releve que rien ne hierarchisait
                l'attention : tout bougeait avec la meme importance. */}
            <g
              opacity={opDecor2}
              transform={
                `translate(${TOGGLE_X + 29} ${TOGGLE_Y + 16}) ` +
                `scale(${pulsationCle(frame, BASCULE)}) ` +
                `translate(${-(TOGGLE_X + 29)} ${-(TOGGLE_Y + 16)})`
              }
            >
              <Piece
                html={E2_TOGGLE_OFF}
                opacite={1 - bascule}
                transform={`translate(${TOGGLE_X} ${TOGGLE_Y})`}
              />
              <Piece
                html={E2_TOGGLE_ON}
                opacite={bascule}
                transform={`translate(${TOGGLE_X} ${TOGGLE_Y})`}
              />
            </g>

            {/* ⭐⭐ LA FIN JOUE, elle ne fige plus. Mesure avant correction :
                164 frames figees sur 275 (60 %), dont 1,80 s d'affilee apres la
                bascule. Les 4 voix du DA-brief l'ont relevee, Kimi l'a chiffree.
                ⛔ On ne comble pas avec du decoratif : on fait JOUER l'etape 2,
                que l'ecran annonce ("Then reopen Loop") et ne montrait jamais.
                La notification arrive APRES, comme sa consequence — elle devient
                la preuve que l'action a marche, au lieu d'un decor pose la. */}
            <Piece
              html={E2_ETAPE_2}
              opacite={entree(frame - ETAPE_2, 0)}
              transform={`translate(0 ${glissementVivant(frame, 0, ETAPE_2, 24)})`}
            />
            <Piece
              html={E2_APERCU}
              opacite={entree(frame - NOTIF, 0)}
              transform={`translate(0 ${glissementVivant(frame, 0, NOTIF, 46)})`}
            />
            <Piece html={E2_NOTE} opacite={entree(frame - NOTIF, 2)} />
            <Piece
              html={E2_PIED}
              opacite={opDecor2}
              transform={`translate(0 0) scale(1)`}
            />
          </g>
        )}

        {/* ---------- LE BOUTON D'ACTION — au-dessus de tout ---------- */}
        {echelleBouton > 0.001 && (
          <Piece
            html={BOUTON_FLOTTANT}
            transform={
              `translate(${BOUTON_X + BOUTON_TAILLE / 2} ${BOUTON_Y + BOUTON_TAILLE / 2}) ` +
              `scale(${echelleBouton}) ` +
              `translate(${-BOUTON_TAILLE / 2} ${-BOUTON_TAILLE / 2})`
            }
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
