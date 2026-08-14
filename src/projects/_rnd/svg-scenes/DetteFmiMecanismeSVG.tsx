/**
 * DetteFmiMecanismeSVG — TEST R&D (hypothese Aziz, 2026-08-13, mode reflexion MAX).
 *
 * But : verifier si un agent Claude (moi, appele en mode MAX, ZERO appel API externe) peut
 * reproduire FIDELEMENT une image-cible Gemini (whiteboard doodle / trait marqueur noir)
 * en codant le SVG A LA MAIN, sans jury LLM externe.
 *
 * Reference : memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/dette-fmi-whiteboard-doodle-v2.png
 * Sujet : mecanisme "une dette remboursee ne diminue jamais" (piste FMI/dette, Kora & Cartes).
 *
 * Perimetre (statique, SANS stick figure central — cf brief) :
 *  - cadre metallique de tableau blanc (bezel alu + coins noirs)
 *  - pile de billets en bloc 3D + bande de reliure + etiquette "PRET" + etiquette vierge
 *  - fleche noire PRET -> silhouette Afrique
 *  - silhouette Afrique + Madagascar (geo reconnaissable, trait main-levee)
 *  - facture "INVOICE" + montant "3 000" encercle + fleche BLEUE hachuree montante
 *  - pile de 3 pieces + fleche "OUT" vers la facture
 *  - fleche courbe qui boucle du bas vers la pile de billets (le pret qui revient/se represente)
 *
 * Registre : GATE AMONT (SVG-SCENES-GENERATIVES.md) — scene d'OBJETS simples/data-viz, PAS une
 * masse organique riche -> CODE-MAIN justifie (aucun appel LLM pour le materiau final).
 *
 * v2 (mode MAX) : observation rapprochee (crops) de la reference AVANT reecriture — corrections
 * majeures vs v1 : cadre de tableau ajoute, pile de billets refaite en bloc 3D (pas des couches
 * plates empilees), montant "3 000" encercle en NOIR (pas rouge — seul le bleu est colore dans la
 * reference), fleche bleue avec hachures (pas juste un contour), pieces en "puck" a aretes
 * horizontales (pas des cylindres ouverts), Afrique redessinee sur une geo reconnaissable
 * (Corne, golfe de Guinee, pointe sud), ajout de la fleche de boucle qui revient vers la pile.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { AFRICA_PATH_620 } from "./africaPath";

const NOIR = "#1c1c1c";
const BLEU = "#2f6fb0";
const FOND = "#f7f7f4";
const CADRE = "#c7c9cc";
const CADRE_SOMBRE = "#9a9ea3";

// Filtre "feutre a main levee" — feTurbulence + feDisplacementMap, recette prouvee
// (memory/doctrines/REVERSE-STYLE-VIDEO-VERS-ASSETS.md, statique). Seed fixe = grain fige (OK, image statique).
const HandDrawnFilter: React.FC<{ id: string; scale?: number }> = ({ id, scale = 3.2 }) => (
  <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.014 0.02" numOctaves={2} seed={11} result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale={scale} xChannelSelector="R" yChannelSelector="G" />
  </filter>
);

const WhiteboardSmudge: React.FC = () => (
  <g opacity={0.045}>
    <ellipse cx={260} cy={140} rx={220} ry={60} fill="#a9a9a0" />
    <ellipse cx={1520} cy={210} rx={280} ry={70} fill="#a9a9a0" />
    <ellipse cx={880} cy={900} rx={340} ry={90} fill="#a9a9a0" />
    <ellipse cx={1660} cy={760} rx={200} ry={55} fill="#a9a9a0" />
    <ellipse cx={140} cy={860} rx={160} ry={50} fill="#a9a9a0" />
  </g>
);

// Cadre metallique du tableau blanc : bezel + coins noirs arrondis (un <rect> par coin, pas de rotate foireux)
const WhiteboardFrame: React.FC = () => {
  const W = 1920;
  const H = 1080;
  const T = 26; // epaisseur du bezel
  const C = 58; // taille du coin noir
  const lines = Array.from({ length: 10 }, (_, i) => i);
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill={CADRE} />
      {/* traits verticaux "metal brosse" sur les bandes haut/bas */}
      <g stroke={CADRE_SOMBRE} strokeWidth={1} opacity={0.5}>
        {lines.map((i) => (
          <line key={`t${i}`} x1={(W / 10) * i + 20} y1={2} x2={(W / 10) * i + 20} y2={T - 2} />
        ))}
        {lines.map((i) => (
          <line key={`b${i}`} x1={(W / 10) * i + 20} y1={H - T + 2} x2={(W / 10) * i + 20} y2={H - 2} />
        ))}
      </g>
      {/* coins noirs arrondis (4 rects independants, coin arrondi vers l'interieur) */}
      <rect x={0} y={0} width={C} height={C} rx={10} fill="#141414" opacity={0.88} />
      <rect x={W - C} y={0} width={C} height={C} rx={10} fill="#141414" opacity={0.88} />
      <rect x={0} y={H - C} width={C} height={C} rx={10} fill="#141414" opacity={0.88} />
      <rect x={W - C} y={H - C} width={C} height={C} rx={10} fill="#141414" opacity={0.88} />
      {/* surface interne du tableau */}
      <rect x={T} y={T} width={W - T * 2} height={H - T * 2} fill={FOND} />
    </g>
  );
};

export const DetteFmiMecanismeSVG: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: CADRE }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <HandDrawnFilter id="feutre-noir" scale={3.2} />
          <HandDrawnFilter id="feutre-bleu" scale={2.4} />
          <pattern id="hachure-bleue" width={10} height={10} patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width={10} height={10} fill={FOND} />
            <line x1={0} y1={0} x2={0} y2={10} stroke={BLEU} strokeWidth={4.5} />
          </pattern>
        </defs>

        <WhiteboardFrame />
        <WhiteboardSmudge />

        {/* ===================== PILE DE BILLETS ===================== */}
        {/* Empilement frontal de couches (chaque billet = un rectangle legerement decale),
            silhouette en escalier a droite pour suggerer l'epaisseur — approche la plus fiable
            (v1 en couches plates lisait bien ; la v2 "bloc 3D isometrique" a echoue 2x, abandonnee). */}
        <g filter="url(#feutre-noir)" fill={FOND} stroke={NOIR} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round">
          {Array.from({ length: 9 }, (_, i) => {
            const y = 470 - i * 20;
            const jitter = (i % 3) * 3 - 3;
            return <rect key={i} x={290 + jitter} y={y} width={340 + i * 6} height={26} rx={3} />;
          })}
        </g>
        {/* billet du dessus : portrait ovale seul (les coins replies en "x" isoles lisaient mal, retires) */}
        <g filter="url(#feutre-noir)" fill="none" stroke={NOIR} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
          <rect x={296} y={306} width={330} height={70} rx={5} fill={FOND} />
          <ellipse cx={460} cy={341} rx={30} ry={22} />
        </g>
        {/* bande de reliure haute (blanche, horizontale) */}
        <g filter="url(#feutre-noir)" fill={FOND} stroke={NOIR} strokeWidth={3.4} strokeLinejoin="round">
          <path d="M 400,300 L 400,384 L 452,384 L 452,300 Z" />
        </g>
        {/* bande de reliure basse (blanche), porte l'etiquette PRET */}
        <g filter="url(#feutre-noir)" fill={FOND} stroke={NOIR} strokeWidth={3.4} strokeLinejoin="round">
          <path d="M 470,398 L 470,478 L 522,478 L 522,398 Z" />
        </g>

        {/* etiquette "PRET" accrochee a la bande basse */}
        <g filter="url(#feutre-noir)" fill="none" stroke={NOIR} strokeWidth={3} strokeLinecap="round">
          <path d="M 520,450 C 552,462 580,470 606,478" strokeWidth={2.2} />
          <path d="M 606,478 L 692,458 L 748,492 L 714,540 L 632,518 Z" fill={FOND} />
          <circle cx={624} cy={486} r={4.6} fill={FOND} />
          <text x={678} y={506} fontFamily="'Comic Sans MS','Segoe Print',cursive" fontSize={28} fontWeight={700} stroke="none" fill={NOIR} textAnchor="middle" transform="rotate(6 678 506)">PRÊT</text>
        </g>

        {/* etiquette vierge, pend du coin bas-gauche de la pile */}
        <g filter="url(#feutre-noir)" fill="none" stroke={NOIR} strokeWidth={2.4} strokeLinecap="round">
          <path d="M 300,496 C 276,524 250,544 226,560" />
          <path d="M 226,560 L 214,528 L 184,530 L 180,568 L 216,588 Z" fill={FOND} />
          <circle cx={210} cy={546} r={3.4} fill={FOND} />
        </g>

        {/* ===================== FLECHE NOIRE : PRET -> AFRIQUE ===================== */}
        <g filter="url(#feutre-noir)" fill="none" stroke={NOIR} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 660,356 C 830,346 1000,332 1180,300" />
          <path d="M 1180,300 L 1132,282 M 1180,300 L 1140,320" />
        </g>

        {/* ===================== SILHOUETTE AFRIQUE + MADAGASCAR ===================== */}
        {/* v4 : VRAIE GEO (regle SVG-SCENES-GENERATIVES.md § RÈGLE GÉO — jamais approximer un continent
            a la main). Path Natural Earth 50m reel, pays africains fusionnes (d3-geo geoMercator +
            topojson-client merge, iles-etats exclues pour eviter les points parasites), extrait via
            un script one-off (scripts/tools/_tmp-gen-africa-path.mjs, non versionne). Path source
            620x620, translate+scale pour occuper la meme zone que la reference (~1150-1660 x, 155-770 y). */}
        <g
          filter="url(#feutre-noir)"
          fill="none"
          stroke={NOIR}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(1120,130) scale(0.87)"
        >
          <path d={AFRICA_PATH_620} />
        </g>

        {/* ===================== FACTURE / INVOICE ===================== */}
        <g filter="url(#feutre-noir)" fill="none" stroke={NOIR} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round">
          {/* feuille du dessous (legerement decalee, epaisseur) */}
          <path d="M 768,708 L 1064,700 L 1050,942 L 754,950 Z" fill={FOND} opacity={0.9} />
          {/* feuille principale */}
          <path d="M 748,696 L 1040,684 L 1054,930 L 736,942 Z" fill={FOND} />
          <text x={776} y={728} fontFamily="'Comic Sans MS','Segoe Print',cursive" fontSize={27} fontWeight={700} stroke="none" fill={NOIR}>INVOICE</text>
          <path d="M 752,738 L 1032,726" strokeWidth={2.2} />
          {/* lignes de tableau */}
          <path d="M 748,862 L 1044,850" strokeWidth={2} opacity={0.75} />
          <path d="M 745,890 L 1048,878" strokeWidth={2} opacity={0.75} />
          <path d="M 743,918 L 1052,906" strokeWidth={2} opacity={0.75} />
          <path d="M 940,760 L 928,940" strokeWidth={2} opacity={0.55} />
        </g>

        {/* montant "3 000" encercle en noir */}
        <g filter="url(#feutre-noir)">
          <text x={888} y={812} fontFamily="'Comic Sans MS','Segoe Print',cursive" fontSize={38} fontWeight={700} fill={NOIR} textAnchor="middle">3 000</text>
          <ellipse cx={888} cy={796} rx={92} ry={40} fill="none" stroke={NOIR} strokeWidth={3.4} transform="rotate(-3 888 796)" />
        </g>

        {/* fleche bleue hachuree, montante, a gauche de la facture */}
        <g filter="url(#feutre-bleu)">
          <path d="M 646,916 L 700,916 L 700,850 L 726,850 L 673,782 L 620,850 L 646,850 Z" fill="url(#hachure-bleue)" stroke={BLEU} strokeWidth={4} strokeLinejoin="round" />
        </g>

        {/* ===================== PILE DE 3 PIECES ===================== */}
        {/* Chaque piece = un "puck" simple : ellipse du dessus + rectangle de tranche + ellipse du dessous,
            2 traits verticaux courts pour la texture cranelee. Empilees, pas de chevauchement confus. */}
        <g filter="url(#feutre-noir)" fill={FOND} stroke={NOIR} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          {[0, 1, 2].map((i) => {
            const cy = 850 - i * 26;
            const rx = 48 - i * 2;
            return (
              <g key={i}>
                <path d={`M ${1160 - rx},${cy} L ${1160 - rx},${cy - 14} C ${1160 - rx},${cy - 20} ${1160 + rx},${cy - 20} ${1160 + rx},${cy - 14} L ${1160 + rx},${cy}`} />
                <ellipse cx={1160} cy={cy} rx={rx} ry={9} />
                <ellipse cx={1160} cy={cy - 14} rx={rx} ry={9} />
                <line x1={1160 - rx * 0.5} y1={cy - 16} x2={1160 - rx * 0.5} y2={cy - 4} strokeWidth={1.8} opacity={0.6} />
                <line x1={1160 + rx * 0.5} y1={cy - 16} x2={1160 + rx * 0.5} y2={cy - 4} strokeWidth={1.8} opacity={0.6} />
              </g>
            );
          })}
        </g>

        {/* fleche "OUT" : de la pile de pieces vers la facture */}
        <g filter="url(#feutre-noir)" fill="none" stroke={NOIR} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 1102,808 C 1058,802 1016,800 976,804" />
          <path d="M 976,804 L 1008,784 M 976,804 L 1006,828" />
        </g>
        <text x={1128} y={780} fontFamily="'Comic Sans MS','Segoe Print',cursive" fontSize={30} fontWeight={700} fill={NOIR} filter="url(#feutre-noir)" letterSpacing={2} transform="rotate(-8 1180 764)">OUT</text>
        {/* trait courbe reliant la zone pieces au bord ouest de l'Afrique (golfe de Guinee), comme la reference.
            Cible verifiee par echantillonnage du path reel (~1368,490) — pas une coordonnee devinee. */}
        <g filter="url(#feutre-noir)" fill="none" stroke={NOIR} strokeWidth={3.4} strokeLinecap="round">
          <path d="M 1214,772 C 1260,700 1320,590 1364,494" />
        </g>

        {/* ===================== FLECHE COURBE : boucle du bas vers la pile de billets ===================== */}
        <g filter="url(#feutre-noir)" fill="none" stroke={NOIR} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 618,900 C 560,780 500,640 476,560" />
          <path d="M 476,560 L 454,596 M 476,560 L 506,584" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const DETTE_FMI_MECANISME_FRAMES = 90;

export default DetteFmiMecanismeSVG;
