// ⛔⛔ VERSION ABANDONNEE — NE PAS REPRENDRE (decision Aziz 2026-08-16).
// Cette version montrait UNE MAIN qui hesite entre deux robinets. Elle a ete ecartee pour 3 raisons :
//   1. Elle REPETAIT la narration : la voix dit "qui aura la main sur le robinet" au meme instant.
//   2. Elle portait le mauvais sujet : le script dit "et SURTOUT, selon quel MODELE" — l'enjeu est
//      le modele, pas la personne qui choisit.
//   3. Pire : DEUX robinets contredisaient le texte, qui dit "LE prochain grand robinet" (SINGULIER).
// ✅ La version RETENUE est GazoducActe5Vannes2.tsx : UNE vanne unique + une bifurcation en Y.
// Conserve uniquement comme trace du test comparatif SVG (4 modeles sur la main).
// MOTEUR: objet/metaphore SVG — le sommet thematique ("qui aura la main sur le robinet, et selon
// quel modele") n'est ni spatial ni cartographique : c'est un CHOIX abstrait. Seule la metaphore-objet
// en SVG plat (deux robinets identiques + une main humaine en suspens) rend le dilemme lisible en une
// image. Composition reprise du panneau valide par Aziz (/tmp/a5-panels/edit2-p2.png).
//
// GazoducActe5Vannes — SOMMET de l'Acte 5 (530 frames, 17.7s a 30 fps).
// Narration : "QUI AURA LA MAIN SUR LE PROCHAIN GRAND ROBINET DE L'EUROPE... selon quel MODELE :
// financements internationaux, ou Etats SOUVERAINS."
//
// DEROULE (ancres forced-align, frames locales) :
//   f0-58    : la scene se dessine (trace blueprint), la grille apparait.
//   f0-260   : la main est au centre, en suspens — respiration lente (quelques px), rien ne departage
//              les deux robinets, strictement identiques et egalement eclaires.
//   f260     : "robinet" — la main S'ORIENTE : rotation vers la droite + derive amorcee.
//   f383     : "modele" — les robinets se DISTINGUENT : le gauche s'assombrit, le droit s'affirme
//              (trait plus clair, plus epais) et un lisere ambre se trace autour de son volant.
//   f450-521 : le geste decisif — la main GLISSE vers le robinet de droite (un seul mouvement,
//              easeInOut propre, pas de zigzag).
//   f521-530 : la main SE POSE sur le volant — micro-tassement, le robinet encaisse 3px. Definitif.
//
// LA MAIN : contour continu unique (~29 courbes cubiques), pouce separe avec commissure en V,
// 4 doigts de longueurs distinctes (majeur le plus long, auriculaire plus court et plus etroit),
// pointes effilees et legerement incurvees vers la paume, ligne des jointures suggeree par
// 3 petits arcs discrets. Aucun ongle, aucun remplissage, aucune ombre.
//
// ZERO TREMBLEMENT, ZERO FLASH, ZERO PULSE (exigence realisateur). Un geste : glisser, se poser.
// AUCUN TEXTE, AUCUN CHIFFRE. Determinisme total : tout depend de `frame`, aucun Math.random().
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  interpolateColors,
  Easing,
} from "remotion";

const W = 1920;
const H = 1080;

const CYAN = "#2E9FD4";
const CYAN_LIGHT = "#7FD8FF";
const AMBRE = "#FFC742";
const BG_TOP = "#0d1f38";
const BG_BOTTOM = "#050c1a";

const easeIO = Easing.inOut(Easing.cubic);

// ---------------------------------------------------------------------------
// ROBINET (vu de profil, version GAUCHE — le droit est le miroir exact).
// Conduite horizontale qui sort du cadre, deux brides, corps bulbe, volant en
// croix sur tige, bec courbe qui plonge dans une conduite verticale a collier.
// ---------------------------------------------------------------------------
type TapProps = {
  stroke: string;
  strokeWidth: number;
  draw: number; // 0..1 trace blueprint
};

const TapShape: React.FC<TapProps> = ({ stroke, strokeWidth, draw }) => {
  const common = {
    fill: "none",
    stroke,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - draw,
  };
  return (
    <>
      {/* conduite horizontale (sort du cadre a gauche), interrompue par les brides */}
      <path d="M -12,517 L 170,517" {...common} />
      <path d="M -12,605 L 170,605" {...common} />
      <path d="M 224,517 L 254,517" {...common} />
      <path d="M 224,605 L 254,605" {...common} />
      {/* brides (double anneau) */}
      <rect x={174} y={500} width={20} height={122} rx={7} {...common} />
      <rect x={198} y={500} width={20} height={122} rx={7} {...common} />
      {/* corps + bec courbe — contour superieur */}
      <path
        d="M 252,517 C 282,498 308,488 338,484 C 358,480 380,480 398,483
           C 428,487 458,496 478,508 C 560,524 616,592 622,690 L 622,1082"
        {...common}
      />
      {/* corps + bec courbe — contour inferieur (ventre puis bord interne du bec) */}
      <path
        d="M 252,605 C 296,626 352,634 408,624 C 470,612 542,640 542,700 L 542,1082"
        {...common}
      />
      {/* tige du volant */}
      <path d="M 344,481 L 350,432" {...common} />
      <path d="M 394,482 L 388,432" {...common} />
      <rect x={330} y={410} width={76} height={22} rx={6} {...common} />
      {/* volant en croix : barre a bouts arrondis + moyeu + teton superieur */}
      <rect x={258} y={366} width={216} height={34} rx={17} {...common} />
      <circle cx={366} cy={383} r={24} {...common} />
      <rect x={352} y={340} width={28} height={26} rx={9} {...common} />
      {/* collier de la conduite verticale */}
      <rect x={524} y={792} width={116} height={32} rx={7} {...common} />
    </>
  );
};

// ---------------------------------------------------------------------------
// MAIN — contour continu unique, poignet en haut (origine locale), doigts vers
// le bas. Paume tournee vers la gauche, dos de main a droite, pouce a gauche.
// ---------------------------------------------------------------------------
const HAND_OUTLINE = [
  "M -46,4",
  // poignet -> eminence thenar (base du pouce)
  "C -52,34 -62,52 -76,68",
  // bord externe du pouce, qui descend et s'effile
  "C -92,88 -102,124 -108,164",
  "C -112,190 -113,214 -106,226",
  // pointe du pouce, arrondie
  "C -100,236 -88,236 -82,226",
  // bord interne du pouce, remonte vers la commissure
  "C -74,210 -68,180 -63,152",
  "C -60,138 -56,130 -50,126",
  // INDEX : bord externe descend depuis la commissure
  "C -56,160 -62,220 -68,268",
  "C -71,284 -72,292 -70,296",
  // pointe de l'index
  "C -66,306 -52,307 -48,297",
  // remontee dans l'encoche index/majeur
  "C -44,282 -37,224 -32,180",
  "C -30,172 -28,168 -26,166",
  // MAJEUR (le plus long)
  "C -30,180 -36,240 -40,290",
  "C -42,306 -43,316 -41,321",
  "C -37,331 -23,330 -20,320",
  "C -17,306 -10,240 -4,186",
  "C -2,178 0,173 2,171",
  // ANNULAIRE
  "C 0,184 -4,240 -6,280",
  "C -7,296 -7,304 -5,308",
  "C -1,317 13,315 16,305",
  "C 19,292 26,232 31,182",
  "C 33,174 35,169 37,167",
  // AURICULAIRE (plus court, plus etroit)
  "C 34,178 31,214 29,240",
  "C 28,252 28,258 30,262",
  "C 34,271 46,268 49,258",
  "C 52,247 55,206 58,168",
  // dos de la main, remonte vers le poignet
  "C 62,140 68,110 70,84",
  "C 71,56 62,20 50,4",
].join(" ");

// avant-bras : deux lignes legerement convergentes qui sortent du cadre en haut
const FOREARM_LEFT = "M -58,-460 C -54,-300 -50,-130 -46,2";
const FOREARM_RIGHT = "M 62,-460 C 58,-300 53,-130 49,2";

// ligne des jointures : 3 petits arcs discrets a la base des doigts
const KNUCKLES = [
  "M -46,150 q 9,9 18,7",
  "M -13,158 q 9,9 18,7",
  "M 21,155 q 8,8 16,6",
];

// ---------------------------------------------------------------------------
// GRILLE technique discrete
// ---------------------------------------------------------------------------
const GridLines: React.FC<{ opacity: number }> = ({ opacity }) => {
  const minor: React.ReactNode[] = [];
  const major: React.ReactNode[] = [];
  for (let x = 96; x < W; x += 96) {
    const isMajor = x % 480 === 0;
    (isMajor ? major : minor).push(
      <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />
    );
  }
  for (let y = 96; y < H; y += 96) {
    const isMajor = y % 480 === 0;
    (isMajor ? major : minor).push(
      <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />
    );
  }
  return (
    <g id="grid" opacity={opacity}>
      <g stroke={CYAN} strokeWidth={1} opacity={0.07}>
        {minor}
      </g>
      <g stroke={CYAN} strokeWidth={1.4} opacity={0.11}>
        {major}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
export const GazoducActe5Vannes: React.FC = () => {
  const frame = useCurrentFrame();

  // --- Trace blueprint d'ouverture -----------------------------------------
  const gridIn = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tapDraw = interpolate(frame, [4, 58], [0, 1], {
    easing: easeIO,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const handDraw = interpolate(frame, [14, 72], [0, 1], {
    easing: easeIO,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Respiration de la main (suspens, f0-260) ----------------------------
  // Derive lente de quelques pixels, periode ~10s : pas une pulsation, une presence.
  // S'eteint progressivement quand le geste decisif commence.
  const breathFade = interpolate(frame, [450, 500], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bx = 6 * Math.sin(frame * 0.021) * breathFade;
  const by = 4 * Math.sin(frame * 0.013 + 1.2) * breathFade;
  const brot = 0.8 * Math.sin(frame * 0.016 + 0.5) * breathFade;

  // --- f260 "robinet" : la main s'oriente ----------------------------------
  const tOrient = interpolate(frame, [260, 330], [0, 1], {
    easing: easeIO,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // --- f330-450 : derive lente continue (rien d'immobile > 4s) -------------
  const tCreep = interpolate(frame, [330, 450], [0, 1], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // --- f450-521 : LE geste — glisser vers le robinet de droite -------------
  const tGlide = interpolate(frame, [450, 521], [0, 1], {
    easing: easeIO,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // --- f521-530 : se poser — micro-tassement, definitif --------------------
  const tPress = interpolate(frame, [521, 530], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Position du poignet (pivot de rotation de la main)
  const wristX = 960 + bx + 46 * tOrient + 44 * tCreep + 452 * tGlide;
  const wristY = 250 + by - 10 * tOrient - 10 * tCreep - 188 * tGlide + 3 * tPress;
  // Rotation negative = les doigts balancent vers la droite (pivot au poignet)
  const handRot = brot - 10 * tOrient - 1 * tCreep - 4 * tGlide + 1.2 * tPress;

  // --- f383 "modele" : les deux robinets se distinguent --------------------
  const diff = interpolate(frame, [383, 425], [0, 1], {
    easing: easeIO,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leftOpacity = 1 - 0.58 * diff;
  const rightStroke = interpolateColors(diff, [0, 1], [CYAN, CYAN_LIGHT]);
  const rightSW = 5 + 1.2 * diff;
  // lisere ambre qui se trace autour du volant droit
  const ringDraw = diff;
  // le robinet droit encaisse le poids de la main (3px, une seule fois)
  const dip = 3 * tPress;

  return (
    <AbsoluteFill style={{ background: BG_BOTTOM }}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="a5v-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={BG_TOP} />
            <stop offset="1" stopColor={BG_BOTTOM} />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#a5v-bg)" />

        <GridLines opacity={gridIn} />

        {/* ROBINET GAUCHE — modele des financements internationaux */}
        <g id="tap-left" opacity={leftOpacity}>
          <TapShape stroke={CYAN} strokeWidth={5} draw={tapDraw} />
        </g>

        {/* ROBINET DROIT — modele des Etats souverains (miroir exact du gauche) */}
        <g id="tap-right" transform={`translate(1920, ${dip}) scale(-1, 1)`}>
          <TapShape stroke={rightStroke} strokeWidth={rightSW} draw={tapDraw} />
          {/* lisere ambre : seul accent de couleur de la scene */}
          <circle
            cx={366}
            cy={383}
            r={38}
            fill="none"
            stroke={AMBRE}
            strokeWidth={2.5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - ringDraw}
            opacity={0.9}
          />
        </g>

        {/* MAIN — contour pur, pivot au poignet */}
        <g
          id="hand"
          transform={`translate(${wristX}, ${wristY}) rotate(${handRot}) scale(1.15)`}
        >
          <g
            fill="none"
            stroke={CYAN_LIGHT}
            strokeWidth={4.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d={FOREARM_LEFT}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - handDraw}
            />
            <path
              d={FOREARM_RIGHT}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - handDraw}
            />
            <path
              id="hand-outline"
              d={HAND_OUTLINE}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - handDraw}
            />
            <g id="knuckles" opacity={0.45 * handDraw} strokeWidth={3}>
              <path id="knuckle-index" d={KNUCKLES[0]} />
              <path id="knuckle-majeur" d={KNUCKLES[1]} />
              <path id="knuckle-annulaire" d={KNUCKLES[2]} />
            </g>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
