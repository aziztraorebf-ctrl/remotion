// MOTEUR: objet/metaphore SVG (flux d'INTERFACE anime par code)
//
// ONBOARDING GENERIQUE — 1re piece de PORTFOLIO tiree du chantier corpus.
//
// ⭐⭐ CE QUE CETTE PIECE EST, ET CE QU'ELLE N'EST PAS.
// Elle derive de `repro-onboarding` (R&D), mais ce n'en est PAS une copie :
// la repro portait un produit fictif nomme, 6 personnes nommees et un scenario
// precis (contacts, permissions). Un acheteur n'achete pas CE scenario — il
// achete le MOUVEMENT dans SON produit. Tout le contenu est donc devenu des
// EMPLACEMENTS qu'il remplit (« Step one title », « Member name »...).
// C'est la condition 4 de `out/PORTFOLIO/README.md` : reutilisable, pas datee.
//
// ⭐⭐ CE QUI SE DECLINE SANS TOUCHER A CE FICHIER (tout vit dans le generateur) :
//   ICONES=2|3|4          nombre de pastilles, RECENTREES a la generation
//   ICONE_LABELS=a,b,c    leurs libelles
//   OPTION_ACTIVE=1..4    quelle rangee de reglages est designee
//   OPTION_LABELS=w,x,y,z les libelles des 4 rangees
//   THEME=clair|sombre    le theme complet
// ⛔ Un Lottie n'a PAS de moteur de mise en page : rien ne se recentre chez le
// client. C'est NOUS qui calculons la mise en page a la generation et qui
// livrons la variante. C'est exactement l'argument deterministe.
//
// LE RECIT (une phrase, validee avant tout dessin) :
//   « Rejoindre un produit se fait en quelques pas, et chacun se termine tout seul. »
// Ce que le spectateur doit avoir compris : ce produit ne me demandera pas grand-chose.
//
// LA PARTITION (275 frames a 60 fps) :
//   f0-33     l'ecran 1 se deploie en cascade, de haut en bas
//   f33-75    il est pose, lisible
//   f75-105   il se replie EN ORDRE INVERSE (par le bas) — « ca se range »
//   f102-134  le bouton d'action arrive en rebondissant (0 -> 110 % -> 100 %)
//   f105-152  l'ecran 2 se deploie a son tour
//   f138-152  ⭐ LE CADRE DESIGNE la ligne a activer — AVANT qu'elle bascule
//   f152-166  l'interrupteur bascule : gris -> vert
//   f186-206  l'etape 2 s'allume, puis la notification descend (la preuve)

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
  SCREEN_ONE,
  SCREEN_TWO,
  STEP1_MEMBER_1,
  STEP1_MEMBER_2,
  STEP1_MEMBER_3,
  STEP1_MEMBER_4,
  STEP1_MEMBER_5,
  STEP1_MEMBER_6,
  STEP2_STEP_2,
  STEP2_NOTIFICATION,
  STEP2_FOOTNOTE,
  STEP2_FOOTER,
  STEP2_FRAME,
  STEP2_TOGGLE_OFF,
  STEP2_TOGGLE_ON,
  ACTION_BUTTON,
} from "./planche";

// ⭐ THEME — le fond suit la planche generee. Pour livrer la version claire :
//   THEME=clair python3 assets/gen-planche.py && python3 assets/extraire-groupes.py
// puis basculer cette constante. C'est le SEUL point du CODE a toucher.
const FOND_ECRAN = "#0e1116"; // clair : "#f7f8fa"
const W = 500;
const H = 1080;

const MEMBRES = [
  STEP1_MEMBER_1,
  STEP1_MEMBER_2,
  STEP1_MEMBER_3,
  STEP1_MEMBER_4,
  STEP1_MEMBER_5,
  STEP1_MEMBER_6,
];
const MEMBRE_X = 40;
const MEMBRE_Y0 = 500;
const MEMBRE_PAS = 88;

// L'interrupteur ET le cadre suivent OPTION_ACTIVE : leurs coordonnees sont
// relevees dans la planche generee (l'ecran 2 y est a translate(620 50), donc
// local = planche - cet offset). ⛔ Regenerer la planche avec un autre
// OPTION_ACTIVE deplace les deux ensemble — ils ne peuvent plus se desolidariser.
const TOGGLE_X = 388;
const TOGGLE_Y = 316;
const CADRE_X = 52;
const CADRE_Y = 302;

const BOUTON_X = 396;
const BOUTON_Y = 828;
const BOUTON_TAILLE = 72;

// Bornes du recit.
const SORTIE_1 = 75; // l'ecran 1 commence a se replier
const ENTREE_2 = 105; // l'ecran 2 prend la main, des la fin REELLE de la sortie
const REBOND = 102; // le bouton d'action arrive
const CADRE = 138; // ⭐ le cadre designe la ligne — AVANT la bascule
const BASCULE = 152; // l'interrupteur passe au vert
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

export const OnboardingGenerique: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== ECRAN 1 — deploiement puis repli ==================================
  // Le decor occupe les rangs 0-4, les 6 membres les rangs 5-10.
  // ⭐ La SORTIE inverse l'ordre : le dernier membre part en premier.
  const TOTAL_1 = 5 + MEMBRES.length;
  const opacite1 = (rang: number): number =>
    frame < SORTIE_1
      ? entree(frame, rang)
      : sortie(frame - SORTIE_1, rang, TOTAL_1);

  const opDecor1 = opacite1(0);
  const ecran1Visible = frame < ENTREE_2;

  // ===== LE BOUTON D'ACTION — le seul geste non-opacite de l'ecran 1 ======
  const echelleBouton = rebond(frame, REBOND);

  // ===== ECRAN 2 ===========================================================
  const opDecor2 = entree(frame - ENTREE_2, 0);
  const ecran2Visible = frame >= ENTREE_2;

  // ⭐⭐ LE CADRE DE DESIGNATION (idee d'Aziz, 2026-08-30).
  // Sans lui, l'interrupteur qui bascule est ARBITRAIRE : le spectateur voit un
  // toggle passer au vert sans savoir pourquoi celui-la. Le cadre dit « voici
  // l'option qu'on te demande d'activer », PUIS elle bascule. L'ordre fait le
  // sens : designer d'abord, agir ensuite.
  const opCadre = entree(frame - CADRE, 0);

  // L'interrupteur : fondu croise entre les deux etats dessines.
  // ⭐ On ne deplace PAS la pastille a la main — les deux etats sont dessines.
  const bascule = interpolate(frame, [BASCULE, BASCULE + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: FOND_ECRAN }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* ---------- ECRAN 1 : la liste ----------
            ⭐ Porte par le GLISSEMENT : l'ecran monte en decelerant pendant que
            ses elements apparaissent. C'est ce mouvement d'ensemble qui donne
            la vie — sans lui, 70 % des frames sont figees. */}
        {ecran1Visible && (
          <>
            <Piece
              html={SCREEN_ONE}
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

        {/* ---------- ECRAN 2 : les reglages ---------- */}
        {ecran2Visible && (
          <g transform={`translate(0 ${glissement(frame, 0, ENTREE_2)})`}>
            <Piece html={SCREEN_TWO} opacite={opDecor2} />

            {/* ⭐⭐ Le cadre arrive AVANT la bascule et reste : il designe. */}
            <Piece
              html={STEP2_FRAME}
              opacite={opCadre}
              transform={`translate(${CADRE_X} ${CADRE_Y})`}
            />

            {/* L'interrupteur — L'ACTION CLE : c'est lui que le cadre designe.
                ⭐ Il recoit la seule pulsation marquee de la piece, pour que
                l'oeil aille LA et nulle part ailleurs. */}
            <g
              opacity={opDecor2}
              transform={
                `translate(${TOGGLE_X + 29} ${TOGGLE_Y + 16}) ` +
                `scale(${pulsationCle(frame, BASCULE)}) ` +
                `translate(${-(TOGGLE_X + 29)} ${-(TOGGLE_Y + 16)})`
              }
            >
              <Piece
                html={STEP2_TOGGLE_OFF}
                opacite={1 - bascule}
                transform={`translate(${TOGGLE_X} ${TOGGLE_Y})`}
              />
              <Piece
                html={STEP2_TOGGLE_ON}
                opacite={bascule}
                transform={`translate(${TOGGLE_X} ${TOGGLE_Y})`}
              />
            </g>

            {/* ⭐⭐ LA FIN JOUE, elle ne fige plus : l'etape 2 s'allume, puis la
                notification descend comme sa CONSEQUENCE — la preuve que
                l'action a marche, au lieu d'un decor pose la. */}
            <Piece
              html={STEP2_STEP_2}
              opacite={entree(frame - ETAPE_2, 0)}
              transform={`translate(0 ${glissementVivant(frame, 0, ETAPE_2, 24)})`}
            />
            <Piece
              html={STEP2_NOTIFICATION}
              opacite={entree(frame - NOTIF, 0)}
              transform={`translate(0 ${glissementVivant(frame, 0, NOTIF, 46)})`}
            />
            <Piece html={STEP2_FOOTNOTE} opacite={entree(frame - NOTIF, 2)} />
            <Piece html={STEP2_FOOTER} opacite={opDecor2} />
          </g>
        )}

        {/* ---------- LE BOUTON D'ACTION — au-dessus de tout ---------- */}
        {echelleBouton > 0.001 && (
          <Piece
            html={ACTION_BUTTON}
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
