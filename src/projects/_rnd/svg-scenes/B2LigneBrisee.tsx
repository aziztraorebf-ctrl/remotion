/**
 * B2LigneBrisee — Beat 2 GGW, scene 1 "LA LIGNE BRISEE POUSSEE" (registre ENCRE NARRATIVE, anime).
 * Source = idee1.svg (diagonale de 4 arbres ; 3 morts en avant-plan ; 1 survivant haut-droite ; soleil hachure).
 * Composition Remotion 1080x1920 (9:16), 571 frames @30fps. Audio Beat 2 inclus.
 *
 * GRAMMAIRE (identique au hook prouve GgwHookEncreVivant) :
 *   - pop = spring({ frame: frame-birth, config:{mass:1,damping:13,stiffness:120} })
 *   - se-dessine = stroke-dashoffset pilote par interpolate (clamp)
 *   - colorisation timee = cross-fade par OPACITE entre version ENCRE et version COULEUR du meme element
 *   - clamp partout, frame-driven uniquement (zero CSS transition/keyframes/setTimeout)
 *
 * AJUSTEMENT V2 (2 changements precis, demande Aziz) :
 *   CHANGEMENT 1 — les 4 arbres NAISSENT TOUS feuillus vert tendre IDENTIQUES (houppier plein, pas de spoil).
 *     A la mort (3 temps par arbre) : vert tendre -> feuillu GRIS -> les feuilles tombent (houppier se vide)
 *     -> ALORS le tronc nu apparait. Le survivant nait pareil, grise SANS se denuder en fausse-mort,
 *     puis explose en vert VIF + glow a 393f (climax couleur, plus eclatant que le tendre).
 *   CHANGEMENT 2 — embrasement du soleil RETARDE : encre/discret 0-180f, puis s'embrase 180-210f
 *     (or + glow + rayons or qui tournent), juste avant la mort (232f). sunWarm = interpolate([180,210],[0,1]).
 *   TIMING COULEUR EN 3 TEMPS : 0-6s monde en encre + 4 arbres vert tendre · ~6-7s soleil s'embrase
 *     (1ere grosse couleur = or) · ~8s mort (vert tendre -> gris -> nu) · ~13s survivant vert VIF+glow (climax).
 *
 * CALAGE AUDIO (frames @30fps) — TIMING DES GROUPES :
 *   - 0->138f   : INSTALLATION. crete diagonale se trace + les 4 arbres pop en sequence (bas-gauche -> haut-droite),
 *                 TOUS feuillus vert tendre identiques. SOLEIL en ENCRE (discret, pas encore embrase).
 *   - 180->210f : SOLEIL S'EMBRASE (or + glow + rayons qui tournent) = la secheresse frappe.
 *   - 232-270f  : "MEURENT" = MORT EN CASCADE gauche->droite : arbre1 ~232f, arbre2 ~245f, arbre3 ~258f.
 *                 Chacun en 3 temps (feuillu tendre -> feuillu gris -> feuilles tombent -> tronc nu retarde)
 *                 + sa propre pluie de feuilles GROSSES + recroqueville. La cascade avance vers le survivant.
 *   - 265-390f  : SURVIVANT EN FAUSSE-MORT. Il grise legerement (~0.4) avec les autres, reste en suspens
 *                 (on croit qu'il meurt aussi). Sa feuille verte unique garde un soupcon de vert.
 *   - 393f      : "REVERDIT" = SURSAUT (spring pop) : le survivant rejette le gris, EXPLOSE en vert vif + glow vert
 *                 pulsant + racines s'enfoncent. Le payoff "lui aussi ?... non, il tient".
 *   - 450->571f : VERDICT. Scene FIXE (PAS de camera). Morts gris figes + feuilles GROSSES accumulees au sol +
 *                 survivant qui respire + sa feuille verte qui oscille au vent.
 *
 * LES 6 CHANGEMENTS APPLIQUES (fiche finale, valides Aziz) :
 *   1. SUPPRESSION du mouvement de camera (groupe monde translateY retire). Scene FIXE. Leger fade global en toute fin.
 *   2. SOLEIL BRULANT des f0 (disque or #f2b53a + glow #ffd86b blur + rayons or qui tournent + pouls).
 *   3. FEUILLES ~2.5x plus GROSSES + vrai mouvement (rotation continue + drift sinus ample + ralenti/rebond en bas)
 *      + accumulation au sol PERSISTANTE (les memes feuilles se posent, plus de couche separee statique).
 *   4. MORT EN CASCADE gauche->droite (arbre1 232f, arbre2 245f, arbre3 258f), chacun sa pluie + recroqueville.
 *   5. SURVIVANT EN 2 TEMPS : grise a ~265f (fausse mort, suspens jusqu'a 390f) PUIS reverdit en sursaut a 393f.
 *   6. FEUILLE VERTE UNIQUE accrochee au survivant, oscille au vent toute la scene (garde un soupcon de vert).
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import { Audio, staticFile } from "remotion";

const CREME = "#e8dcc0";
const ENCRE = "#2b2117";
const VERT = "#3e8f34"; // vert vif (climax survivant)
const VERT_D = "#295c1c";
const VERT_TENDRE = "#6fa85a"; // vert doux/pale = espoir fragile, etat de naissance des 4 arbres
const VERT_TENDRE_D = "#4f7e3f"; // contour/nervure du feuillage tendre
const CENDRE = "#6b6b6b";
const CENDRE_D = "#3a3a3a";
const GRIS_FEUILLE = "#8f8a7e"; // feuillage qui grise (bref) juste avant de tomber
const OR = "#f2b53a";
const OR_GLOW = "#ffd86b";

// grande valeur de dash pour le se-dessine (longueurs de path inconnues -> on sur-dimensionne + clamp)
const DASH = 2600;

// frames de mort par arbre (cascade gauche -> droite vers le survivant)
const DEATH_FRAMES = [232, 245, 258];
const DEATH_DUR = 34; // duree du cross-fade encre/vert -> cendre

/* ------------------------------------------------------------------ */
/* COUCHE SOUS-TITRES KARAOKE mot-a-mot (bas centre, zone safe).       */
/*   Pattern repris d'AtlasV2Subtitles : chaque mot s'illumine quand   */
/*   il est prononce (narrationSec >= w.start), MAIS en identite       */
/*   ENCRE/parchemin (mot pas dit = encre PALE ; mot dit = encre       */
/*   PLEINE, touche vert discrete sur le mot actif). Frame-driven      */
/*   pur : highlight = comparaison frame/fps vs start du mot (aucune   */
/*   CSS transition). Un seul groupe-phrase visible a la fois.         */
/* COUCHE MICRO-SOURCES : repositionnees SOUS le bloc sous-titre,      */
/*   centrees, plus grosses/visibles. Une seule a la fois.            */
/* ------------------------------------------------------------------ */
type Cue = { start: number; end: number; text: string };

// Mots avec timings forced-alignment (start/end = SECONDES relatives au debut du beat).
type Word = { word: string; start: number; end: number };
// ⚠️ CORRECTION FACTUELLE (2026-06-25) : "Au Nigeria, 3 arbres sur 4 meurent en 2 mois" etait mal
//   attribue (c'est le SAHEL global, pas le Nigeria) + "en 2 mois" invente. Corrige -> "dans le Sahel,
//   pres de huit arbres sur dix meurent, faute d'eau" (~80% morts, sourcé Smithsonian/Yale). Audio B2
//   regenere (606f). Scene SVG inchangee (4 arbres dont la majorite meurt = porte toujours le propos).
const B2_WORDS: Word[] = [
  { word: "L'idée", start: 0.119, end: 0.519 },
  { word: "de", start: 0.519, end: 0.659 },
  { word: "départ", start: 0.659, end: 1.179 },
  { word: "aligner", start: 1.500, end: 2.000 },
  { word: "des", start: 2.000, end: 2.259 },
  { word: "arbres,", start: 2.259, end: 2.799 },
  { word: "en", start: 2.799, end: 2.939 },
  { word: "ligne", start: 2.939, end: 3.159 },
  { word: "droite,", start: 3.159, end: 3.819 },
  { word: "face", start: 3.819, end: 4.039 },
  { word: "au", start: 4.039, end: 4.219 },
  { word: "sable.", start: 4.219, end: 4.644 },
  { word: "Mais", start: 5.199, end: 5.359 },
  { word: "dans", start: 5.359, end: 5.559 },
  { word: "le", start: 5.559, end: 5.739 },
  { word: "Sahel,", start: 5.739, end: 6.639 },
  { word: "près", start: 6.639, end: 6.879 },
  { word: "de", start: 6.879, end: 7.039 },
  { word: "huit", start: 7.039, end: 7.319 },
  { word: "arbres", start: 7.319, end: 7.699 },
  { word: "sur", start: 7.699, end: 7.940 },
  { word: "dix", start: 7.940, end: 8.359 },
  { word: "meurent,", start: 8.359, end: 8.960 },
  { word: "faute", start: 8.960, end: 9.199 },
  { word: "d'eau.", start: 9.199, end: 9.799 },
  { word: "Au", start: 10.340, end: 10.500 },
  { word: "Sénégal,", start: 10.500, end: 11.300 },
  { word: "sur", start: 11.300, end: 11.539 },
  { word: "trente-six", start: 11.539, end: 12.039 },
  { word: "zones", start: 12.039, end: 12.319 },
  { word: "plantées,", start: 12.319, end: 13.219 },
  { word: "une", start: 13.219, end: 13.439 },
  { word: "seule", start: 13.439, end: 13.799 },
  { word: "a", start: 13.799, end: 13.899 },
  { word: "vraiment", start: 13.899, end: 14.279 },
  { word: "reverdi.", start: 14.279, end: 16.119 },
  { word: "Les", start: 16.119, end: 16.260 },
  { word: "scientifiques", start: 16.260, end: 16.840 },
  { word: "sont", start: 16.840, end: 17.039 },
  { word: "durs", start: 17.039, end: 17.519 },
  { word: "sur", start: 17.579, end: 17.760 },
  { word: "le", start: 17.760, end: 17.920 },
  { word: "papier,", start: 17.920, end: 18.539 },
  { word: "cette", start: 18.539, end: 18.779 },
  { word: "idée", start: 18.779, end: 19.000 },
  { word: "n'avait", start: 19.000, end: 19.379 },
  { word: "aucune", start: 19.379, end: 19.779 },
  { word: "chance.", start: 19.779, end: 20.201 },
];

// ⛔ Trou de doctrine #1 : NE PAS grouper par silence auto. Le nouvel alignment (606f) a des gaps
//   inter-phrases TOUS < 0.8s (0.55s, 0.54s, 0.0s) -> le groupage par silence collait les 4 phrases
//   en un bloc illisible. On FORCE les frontieres par INDEX de mots (1er mot de chaque phrase) :
//   [L'idée...sable.] / [Mais...d'eau.] / [Au Senegal...reverdi.] / [Les scientifiques...chance.]
type Phrase = { words: Word[]; start: number; end: number };
const PHRASE_BREAKS = [12, 25, 36];
const buildPhrases = (words: Word[]): Phrase[] => {
  const phrases: Phrase[] = [];
  let current: Word[] = [];
  for (let i = 0; i < words.length; i++) {
    if (PHRASE_BREAKS.includes(i) && current.length) {
      phrases.push({
        words: [...current],
        start: current[0].start,
        end: current[current.length - 1].end,
      });
      current = [];
    }
    current.push(words[i]);
  }
  if (current.length) {
    phrases.push({
      words: [...current],
      start: current[0].start,
      end: current[current.length - 1].end,
    });
  }
  return phrases;
};
const B2_PHRASES: Phrase[] = buildPhrases(B2_WORDS);

// Sources timees (frames @30) sur les claims du nouveau texte FMNR-coherent :
//  - "8 sur 10 meurent" (Sahel) f211-276 -> Smithsonian / Yale E360
//  - "36 zones, une seule reverdi" (Senegal) f346-428 -> Land Use Policy 2025 / NPR
const SOURCES: Cue[] = [
  { start: 211, end: 300, text: "Smithsonian - Yale E360 (~80% morts)" },
  { start: 346, end: 470, text: "Land Use Policy 2025 - NPR (1/36 zones)" },
];

/* ------------------------------------------------------------------ */
/* ARBRES — geometrie reprise de idee1.svg, parametree par couleur.   */
/* Chaque arbre est dessine relatif a (0,0) ; le placement/scale est  */
/* applique par le <g transform> appelant. trunkStroke/branchStroke   */
/* permettent le cross-fade encre -> cendre (morts) ou encre -> vert. */
/* ------------------------------------------------------------------ */

// Arbre "mort/sec" (silhouette branchue, sans feuillage) — geometrie des 3 arbres du bas.
const DeadTreeShape: React.FC<{
  trunk: string;
  branch: string;
  trunkW: number;
  branchW: number;
}> = ({ trunk, branch, trunkW, branchW }) => (
  <>
    <path
      d="M0 0 C-8 -70 12 -145 0 -250"
      fill="none"
      stroke={trunk}
      strokeWidth={trunkW}
      strokeLinecap="round"
    />
    <path
      d="M0 -242 C-42 -285 -66 -325 -110 -360 M-42 -285 C-70 -288 -92 -302 -118 -325 M-62 -310 C-52 -340 -54 -370 -48 -392 M0 -250 C38 -298 70 -333 120 -366 M38 -298 C70 -294 98 -305 130 -326 M58 -320 C52 -350 60 -375 70 -402 M-2 -170 C-42 -195 -75 -215 -110 -236 M-45 -198 C-65 -188 -88 -184 -110 -182 M6 -155 C48 -182 78 -208 108 -242 M50 -185 C75 -175 102 -170 128 -170"
      fill="none"
      stroke={branch}
      strokeWidth={branchW}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M-3 0 C-40 26 -60 36 -98 50 M6 2 C42 23 74 35 112 42 M0 0 C-6 34 -18 55 -38 82"
      fill="none"
      stroke={branch}
      strokeWidth={branchW * 0.7}
      strokeLinecap="round"
    />
  </>
);

/* Houppier PLEIN parametre (cercles de feuillage) — sert aux 4 arbres a la NAISSANCE,
   pour qu'ils soient IDENTIQUES (meme feuillage plein). Pose par-dessus le tronc encre.
   leafFill = couleur unie du feuillage (vert tendre a la naissance, gris juste avant la chute). */
const LeafyCrownShape: React.FC<{ leafFill: string; leafStroke: string }> = ({
  leafFill,
  leafStroke,
}) => {
  const leafPos: [number, number, number][] = [
    [-78, -312, 42],
    [-40, -345, 47],
    [8, -335, 52],
    [54, -312, 48],
    [91, -348, 38],
    [-18, -285, 45],
    [35, -278, 42],
    [-95, -270, 30],
    [108, -280, 31],
  ];
  return (
    <>
      {/* meme tronc + branches que le survivant pour une silhouette identique a la naissance */}
      <path
        d="M0 0 C-10 -70 15 -135 4 -220"
        fill="none"
        stroke={ENCRE}
        strokeWidth={18}
        strokeLinecap="round"
      />
      <path
        d="M-2 -210 C-38 -255 -72 -285 -110 -305 M4 -214 C42 -260 84 -282 125 -312 M-15 -170 C-52 -185 -85 -205 -120 -232 M18 -165 C58 -190 94 -214 132 -245"
        fill="none"
        stroke="#5b3b24"
        strokeWidth={7}
        strokeLinecap="round"
      />
      {leafPos.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={leafFill} stroke={leafStroke} strokeWidth={2} />
      ))}
    </>
  );
};

/* Survivant : tronc + branches + feuillage (cercles).
   leafFill = "encre" (cercles fill creme/encre) ou "vert" (cercles verts). */
const SurvivorShape: React.FC<{
  trunk: string;
  branch: string;
  leaf: boolean; // true = feuillage vert vivant, false = feuillage encre (sec)
}> = ({ trunk, branch, leaf }) => {
  const leafColors = leaf
    ? ["#2fb84a", "#5fca5f", "#269c3c", "#37bf4e", "#64d35f", "#178033", "#4bc557", "#149038", "#38bc4c"]
    : Array(9).fill("#cdbd9a");
  const leafStroke = ENCRE;
  const leafPos: [number, number, number][] = [
    [-78, -312, 42],
    [-40, -345, 47],
    [8, -335, 52],
    [54, -312, 48],
    [91, -348, 38],
    [-18, -285, 45],
    [35, -278, 42],
    [-95, -270, 30],
    [108, -280, 31],
  ];
  return (
    <>
      <path
        d="M0 0 C-10 -70 15 -135 4 -220"
        fill="none"
        stroke={trunk}
        strokeWidth={18}
        strokeLinecap="round"
      />
      <path
        d="M-2 -210 C-38 -255 -72 -285 -110 -305 M4 -214 C42 -260 84 -282 125 -312 M-15 -170 C-52 -185 -85 -205 -120 -232 M18 -165 C58 -190 94 -214 132 -245"
        fill="none"
        stroke={branch}
        strokeWidth={7}
        strokeLinecap="round"
      />
      {leafPos.map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill={leafColors[i]}
          stroke={leafStroke}
          strokeWidth={2}
        />
      ))}
    </>
  );
};

/* feuilles qui tombent : positions de depart sur le feuillage des 3 arbres morts.
   tree = index de l'arbre (0,1,2) -> declenche avec la mort de CET arbre (cascade).
   sol = position de repos au sol (ou la feuille s'immobilise et reste). */
type Leaf = {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rot: number;
  drift: number;
  tree: number;
  solX: number;
  solY: number;
};
// feuilles ~2.5x plus grosses qu'avant (rx ~30-44 vs 12-18). Chaque arbre a 5 feuilles.
const FALLING_LEAVES: Leaf[] = [
  // arbre 1 (avant-plan bas-gauche, base ~y1500, feuillage haut ~y1200) — chute vers le sol ~y1540
  { x: 200, y: 1205, rx: 40, ry: 19, rot: -20, drift: -55, tree: 0, solX: 180, solY: 1548 },
  { x: 255, y: 1175, rx: 34, ry: 17, rot: 28, drift: 45, tree: 0, solX: 300, solY: 1562 },
  { x: 305, y: 1195, rx: 38, ry: 18, rot: 10, drift: -20, tree: 0, solX: 250, solY: 1535 },
  { x: 180, y: 1235, rx: 30, ry: 15, rot: 44, drift: 60, tree: 0, solX: 330, solY: 1556 },
  { x: 330, y: 1155, rx: 36, ry: 17, rot: -34, drift: -45, tree: 0, solX: 210, solY: 1572 },
  // arbre 2 (milieu, base ~y1278, feuillage haut ~y1000) — chute vers le sol ~y1318
  { x: 380, y: 1005, rx: 34, ry: 17, rot: -12, drift: -40, tree: 1, solX: 360, solY: 1322 },
  { x: 424, y: 1025, rx: 42, ry: 20, rot: 25, drift: 48, tree: 1, solX: 470, solY: 1338 },
  { x: 468, y: 985, rx: 31, ry: 15, rot: -45, drift: -55, tree: 1, solX: 400, solY: 1316 },
  { x: 510, y: 1015, rx: 38, ry: 18, rot: 14, drift: 35, tree: 1, solX: 520, solY: 1330 },
  { x: 440, y: 1040, rx: 30, ry: 15, rot: 52, drift: -25, tree: 1, solX: 420, solY: 1346 },
  // arbre 3 (fond, base ~y1038, feuillage haut ~y790) — chute vers le sol ~y1078
  { x: 542, y: 795, rx: 31, ry: 15, rot: 28, drift: 42, tree: 2, solX: 560, solY: 1082 },
  { x: 580, y: 775, rx: 38, ry: 18, rot: -20, drift: -38, tree: 2, solX: 520, solY: 1096 },
  { x: 628, y: 805, rx: 33, ry: 16, rot: 52, drift: 50, tree: 2, solX: 600, solY: 1074 },
  { x: 558, y: 820, rx: 30, ry: 15, rot: -12, drift: -30, tree: 2, solX: 540, solY: 1100 },
];

export const B2LigneBrisee: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* === CHANGEMENT 1 : PLUS DE CAMERA. Scene FIXE.
     Seule concession au raccord B3 : un tres leger fade global en toute fin. === */
  const endFade = interpolate(frame, [575, 606], [1, 0.82], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* === CRETE DIAGONALE (terrain) : se-trace 0-138f === */
  const crestDraw = interpolate(frame, [0, 138], [DASH, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* === CHANGEMENT 2 : SOLEIL EN ENCRE PUIS EMBRASEMENT RETARDE ===
     0-180f : disque pale/creme + hachures encre (discret, pas d'or, pas de glow).
     180-210f : s'embrase progressivement (or + glow + rayons or qui se mettent a tourner)
                = la secheresse qui frappe, juste AVANT la mort (cascade a 232f). Reste ardent ensuite. */
  const sunWarm = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sunPulse = 1 + 0.03 * Math.sin(frame / 9);
  // les rayons ne tournent qu'a partir de l'embrasement (avant : statiques en encre)
  const sunRot = Math.max(0, frame - 180) * 0.25;
  const SUN_CX = 540;
  const SUN_CY = 245;
  const SUN_R = 158;

  /* === MORT EN CASCADE EN 3 TEMPS (changement 1) ===
     Pour chaque arbre mourant : feuillu vert tendre -> feuillu GRIS (bref) -> les feuilles TOMBENT
     -> ALORS le tronc nu (DeadTreeShape) apparait. Le denuement est le RESULTAT de la chute.
        leafGreyOf : le feuillage plein vire du vert tendre au gris (0..1), tres rapide au debut.
        crownGoneOf : le houppier plein DISPARAIT a mesure que les feuilles tombent.
        barenessOf  : le tronc nu (branches nues) APPARAIT une fois les feuilles parties (retarde). */
  const deathOf = (i: number) =>
    interpolate(frame, [DEATH_FRAMES[i], DEATH_FRAMES[i] + DEATH_DUR], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  // temps 1 : vert tendre -> gris (rapide, 0->12f apres la mort)
  const leafGreyOf = (i: number) =>
    interpolate(frame, [DEATH_FRAMES[i], DEATH_FRAMES[i] + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  // temps 2 : le houppier plein gris se vide (les feuilles partent) ~ cale sur la chute (8->50f)
  const crownGoneOf = (i: number) =>
    interpolate(frame, [DEATH_FRAMES[i] + 8, DEATH_FRAMES[i] + 50], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  // temps 3 : le tronc nu apparait UNE FOIS les feuilles parties (40->70f, retarde)
  const barenessOf = (i: number) =>
    interpolate(frame, [DEATH_FRAMES[i] + 40, DEATH_FRAMES[i] + 70], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  /* === SOL CRAQUELE : se-trace par arbre, demarre avec la mort de l'arbre correspondant === */
  const crackDrawOf = (i: number) =>
    interpolate(frame, [DEATH_FRAMES[i] + 4, DEATH_FRAMES[i] + 60], [DASH, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  /* === CHANGEMENT 5 : SURVIVANT EN 2 TEMPS ===
     fausse-mort : grise legerement avec la cascade (~265f), reste en suspens jusqu'a 390f.
     reverdit : sursaut spring a 393f -> rejette le gris, explose en vert. */
  // ⚠️ Re-cale sur le nouvel audio (606f) : "une seule a vraiment reverdi" tombe a f428 (etait f393).
  const falseDeath = interpolate(frame, [265, 295, 423], [0, 0.42, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const revive = spring({
    frame: frame - 428,
    fps,
    config: { mass: 1, damping: 11, stiffness: 150 }, // un peu plus snappy pour le "sursaut"
  });
  // greenIn : le survivant passe du gris-encre (fausse mort) au vert vif a partir de 428f (sur "reverdi")
  const greenIn = interpolate(frame, [428, 458], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rootGrow = interpolate(frame, [431, 481], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowPulse = 0.45 + 0.2 * Math.sin(frame / 8);
  const breathe = 1 + 0.02 * Math.sin((frame - 458) / 11);

  /* placement des 4 arbres (repris de idee1.svg, ordre bas-gauche -> haut-droite) */
  const deadTrees = [
    { tx: 260, ty: 1500, s: 1.15, birthOrder: 0 }, // avant-plan bas-gauche (meurt 1er)
    { tx: 420, ty: 1278, s: 0.9, birthOrder: 1 }, // milieu (meurt 2e)
    { tx: 575, ty: 1038, s: 0.72, birthOrder: 2 }, // fond (meurt 3e)
  ];
  // survivant : haut-droite, pop a la naissance (0-138) comme les autres
  const survivor = { tx: 775, ty: 785, s: 0.78, birthOrder: 3 };

  // === CHANGEMENT 6 : FEUILLE VERTE UNIQUE accrochee au survivant, oscille au vent ===
  // garde un soupcon de vert meme en fausse-mort (clamp bas a 0.45 quand le reste grise).
  const leafSway = Math.sin(frame / 14) * 9; // oscillation lente au vent
  const leafSwayY = Math.sin(frame / 17 + 1) * 4;
  // vert de la feuille : leger soupcon en fausse-mort, plein quand le survivant reverdit
  const lonelyLeafGreen = Math.max(0.5, 1 - falseDeath * 0.55);

  /* ============ COUCHES TEXTE (par-dessus le SVG, frame-driven) ============
     Les sous-titres KARAOKE et les sources sont des <div> en position absolute
     dans l'AbsoluteFill (rendu net, hors viewBox SVG). Frame-driven pur
     (aucune CSS transition). Zones empilees, bas-centre :
       - SOUS-TITRES KARAOKE : bloc centre, Y ~1620-1790.
       - SOURCES             : centrees, SOUS le bloc sous-titre, Y ~1840.
     Un seul groupe-phrase + une seule source actifs a la fois. */
  const cueOpacity = (c: Cue, fadeIn: number, fadeOut: number) =>
    interpolate(
      frame,
      [c.start, c.start + fadeIn, c.end - fadeOut, c.end],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  // === SOUS-TITRES KARAOKE : frame -> secondes, on selectionne la phrase visible ===
  const narrationSec = frame / fps;
  // phrase visible : de son 1er mot jusqu'au start de la phrase suivante (pas de trou).
  const activePhraseIdx = (() => {
    for (let i = 0; i < B2_PHRASES.length; i++) {
      const p = B2_PHRASES[i];
      const nextStart = B2_PHRASES[i + 1]?.start ?? p.end + 0.6;
      // marge avant (apparait ~0.18s avant le 1er mot) et apres (reste ~0.5s)
      if (narrationSec >= p.start - 0.18 && narrationSec < nextStart) return i;
    }
    return -1;
  })();
  const activePhrase = activePhraseIdx >= 0 ? B2_PHRASES[activePhraseIdx] : null;
  // fade in/out de la phrase (en secondes) : ~0.25s d'apparition, ~0.3s de sortie
  const subOpacity = (() => {
    if (!activePhrase) return 0;
    const nextStart =
      B2_PHRASES[activePhraseIdx + 1]?.start ?? activePhrase.end + 0.6;
    const appearAt = activePhrase.start - 0.18;
    const fadeOutStart = nextStart - 0.3;
    return interpolate(
      narrationSec,
      [appearAt, appearAt + 0.25, fadeOutStart, nextStart],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  })();

  // source active (une seule) : fade ~10f
  const activeSrc = SOURCES.find((c) => frame >= c.start && frame <= c.end);
  const srcOpacity = activeSrc ? cueOpacity(activeSrc, 10, 10) : 0;

  return (
    <AbsoluteFill style={{ background: CREME }}>
      <Audio src={staticFile("audio/ggw-muraille-verte/narration-beat2.mp3")} />

      {/* ============ COUCHE SFX (passe finale, frame-driven via <Sequence from=>) ============
          Tous SOUS la narration (1.0). Le vent de fond = un seul <Audio> continu (0.15).
          Les 7 ponctuels sont declenches a une frame precise par une <Sequence>. */}
      {/* 1. VENT DE FOND — ambiance desert continue, toute la scene (pas de loop, dure 21s > 19s) */}
      <Audio src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-vent.mp3")} volume={0.15} />
      {/* 2. SOLEIL S'EMBRASE — f180 (~6s) */}
      <Sequence from={180} durationInFrames={180}>
        <Audio src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-soleil-embrase.mp3")} volume={0.35} />
      </Sequence>
      {/* 3. TENSION-PULSE — f222, juste avant la mort */}
      <Sequence from={222} durationInFrames={60}>
        <Audio src={staticFile("_shared/sfx/impact/tension-pulse.mp3")} volume={0.28} />
      </Sequence>
      {/* 4-5-6. CASCADE DE MORTS D'ARBRE — meme fichier, 3 frames, volumes decroissants */}
      <Sequence from={232} durationInFrames={45}>
        <Audio src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-arbre-meurt.mp3")} volume={0.40} />
      </Sequence>
      <Sequence from={245} durationInFrames={45}>
        <Audio src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-arbre-meurt.mp3")} volume={0.34} />
      </Sequence>
      <Sequence from={258} durationInFrames={45}>
        <Audio src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-arbre-meurt.mp3")} volume={0.30} />
      </Sequence>
      {/* 7. WIND-LEAVES — f238, les feuilles qui tombent (couvre la cascade) */}
      <Sequence from={238} durationInFrames={90}>
        <Audio src={staticFile("_shared/sfx/nature/wind-leaves.mp3")} volume={0.30} />
      </Sequence>
      {/* 8. GROWTH-POP — f428, le survivant explose en vert (REVERDIT) — re-cale audio 606f */}
      <Sequence from={428} durationInFrames={60}>
        <Audio src={staticFile("_shared/sfx/nature/growth-pop.mp3")} volume={0.45} />
      </Sequence>

      <svg viewBox="0 0 1080 1920" width="100%" height="100%" opacity={endFade}>
        {/* fond parchemin + cadre epure */}
        <rect width={1080} height={1920} fill={CREME} />
        <rect x={40} y={40} width={1000} height={1840} stroke={ENCRE} strokeWidth={1.5} fill="none" />
        <rect x={50} y={50} width={980} height={1820} stroke={ENCRE} strokeWidth={1} strokeDasharray="4 8" fill="none" />

        {/* ============ MONDE (FIXE — plus de translateY) ============ */}
        <g id="monde">

          {/* ---- SOLEIL : ENCRE 0-180f, puis EMBRASEMENT 180-210f (pilote par sunWarm) ---- */}
          <g id="le_soleil" transform={`translate(${SUN_CX * (1 - sunPulse)} ${SUN_CY * (1 - sunPulse)}) scale(${sunPulse})`}>
            {/* glow ardent (blur) — n'apparait qu'a l'embrasement */}
            <circle cx={SUN_CX} cy={SUN_CY} r={SUN_R * 1.15} fill={OR_GLOW} opacity={sunWarm * 0.5} style={{ filter: "blur(30px)" }} />
            {/* disque : creme pale (encre) -> or. Le fill or monte via fillOpacity. */}
            <circle cx={SUN_CX} cy={SUN_CY} r={SUN_R} fill="#ddd2b4" stroke={ENCRE} strokeWidth={4} />
            <circle cx={SUN_CX} cy={SUN_CY} r={SUN_R} fill={OR} fillOpacity={sunWarm} stroke="none" />
            {/* hachures internes : encre (chaleur retenue) -> or quand ca chauffe */}
            <path d="M460 142 L625 99 M420 205 L676 135 M395 270 L700 198 M430 345 L682 277 M485 402 L625 363" fill="none" stroke={sunWarm > 0.4 ? "#d99e2e" : "#8a7e63"} strokeWidth={2.5} opacity={0.45 + sunWarm * 0.15} strokeLinecap="round" />
            {/* couronnes encre (permanentes) + or (qui s'allume) */}
            <circle cx={SUN_CX} cy={SUN_CY} r={196} fill="none" stroke={ENCRE} strokeWidth={2} strokeDasharray="13 22" opacity={0.8} />
            <circle cx={SUN_CX} cy={SUN_CY} r={250} fill="none" stroke={OR} strokeWidth={1.4} strokeDasharray="1 12" opacity={sunWarm * 0.55} />
            {/* rayons : encre discrete 0-180f -> or ardent a l'embrasement (et se mettent a tourner) */}
            <g transform={`rotate(${sunRot} ${SUN_CX} ${SUN_CY})`}>
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                const r1 = 280, r2 = 340;
                const x1 = SUN_CX + Math.cos(a) * r1, y1 = SUN_CY + Math.sin(a) * r1;
                const x2 = SUN_CX + Math.cos(a) * r2, y2 = SUN_CY + Math.sin(a) * r2;
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={sunWarm > 0.3 ? OR : ENCRE} strokeWidth={sunWarm > 0.3 ? 3 : 2} strokeLinecap="round" opacity={0.3 + sunWarm * 0.55} />
                );
              })}
            </g>
          </g>

          {/* ---- CRETE DIAGONALE (terrain) : 3 lignes qui se tracent 0-138f ---- */}
          <g id="la_crete">
            <path d="M-40 450 C170 430 330 470 520 455 C720 438 905 472 1120 445" fill="none" stroke={ENCRE} strokeWidth={2.5} strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={crestDraw} />
            <path d="M-70 865 C130 775 300 825 505 895 C700 960 860 1010 1145 945" fill="none" stroke={ENCRE} strokeWidth={4} strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={crestDraw} />
            <path d="M-60 1330 C170 1220 375 1265 575 1248 C760 1232 910 1160 1130 1020" fill="none" stroke={ENCRE} strokeWidth={5} strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={crestDraw} />
            <path d="M160 620 C335 575 500 600 675 640 C790 668 925 660 1045 620" fill="none" stroke="#776f61" strokeWidth={1.5} strokeDasharray="16 22" strokeLinecap="round" opacity={0.75 * (1 - crestDraw / DASH)} />
            <path d="M25 1135 C210 1105 360 1138 535 1188 C700 1235 860 1285 1030 1260" fill="none" stroke="#776f61" strokeWidth={1.7} strokeDasharray="22 28" strokeLinecap="round" opacity={0.8 * (1 - crestDraw / DASH)} />
            <path d="M720 552 C820 655 910 755 1115 805" fill="none" stroke={ENCRE} strokeWidth={2} strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={crestDraw} />
            <path d="M330 1265 C500 1435 735 1590 1115 1695" fill="none" stroke={ENCRE} strokeWidth={3} strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={crestDraw} />
          </g>

          {/* ---- VENT (encre, permanent, leger fade-in) ---- */}
          <g id="le_vent" opacity={interpolate(frame, [40, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <path d="M115 705 C235 690 330 707 438 700" fill="none" stroke="#777066" strokeWidth={2} strokeLinecap="round" opacity={0.75} />
            <path d="M610 742 C710 720 825 726 952 738" fill="none" stroke="#777066" strokeWidth={2} strokeLinecap="round" opacity={0.75} />
            <path d="M70 1018 C210 1035 320 1025 455 1005" fill="none" stroke="#777066" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
            <path d="M560 1095 C700 1068 850 1080 1010 1115" fill="none" stroke="#777066" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
            <path d="M130 1512 C260 1488 390 1510 515 1485" fill="none" stroke="#777066" strokeWidth={2} strokeLinecap="round" opacity={0.65} />
            <path d="M690 1415 C790 1400 895 1420 1015 1392" fill="none" stroke="#777066" strokeWidth={2} strokeLinecap="round" opacity={0.65} />
          </g>

          {/* ---- SOL CRAQUELE sous chaque mort : se-trace avec la mort de l'arbre correspondant ---- */}
          {deadTrees.map((t, i) => {
            const d = deathOf(i);
            const ck = crackDrawOf(i);
            if (d < 0.01) return null;
            // craquelures relatives a la base de l'arbre (t.tx, t.ty), echelle ~scale de l'arbre
            return (
              <g key={`crack-${i}`} id={`sol_craquele_${i}`} opacity={d} transform={`translate(${t.tx} ${t.ty}) scale(${t.s})`}>
                <path d="M-46 32 C-15 -8 15 -40 52 -78" fill="none" stroke={CENDRE_D} strokeWidth={4} strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={ck} />
                <path d="M-2 -14 L-48 -40 M6 -25 L62 -42 M-20 10 L-70 38 M32 -60 L84 -86" fill="none" stroke={CENDRE_D} strokeWidth={2.6} strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={ck} />
              </g>
            );
          })}

          {/* ---- GLOW VERT derriere le survivant (apparait a REVERDIT, pulse) ---- */}
          {revive > 0.01 && (
            <circle
              cx={survivor.tx}
              cy={survivor.ty - 230 * survivor.s}
              r={180 * survivor.s * revive}
              fill={VERT}
              opacity={greenIn * glowPulse}
              style={{ filter: "blur(36px)" }}
            />
          )}

          {/* ---- LES 3 ARBRES MORTS : naissent FEUILLUS VERT TENDRE (identiques au survivant),
               puis EN CASCADE (232/245/258f) en 3 temps : vert tendre -> feuillu gris -> les feuilles
               tombent (houppier se vide) -> ALORS le tronc nu apparait. ---- */}
          <g id="les_3_arbres_morts">
            {deadTrees.map((t, i) => {
              const birth = 30 + t.birthOrder * 22; // bas-gauche -> haut-droite (avant-plan d'abord)
              const pop = spring({ frame: frame - birth, fps, config: { mass: 1, damping: 13, stiffness: 120 } });
              if (pop < 0.01) return null;
              const d = deathOf(i);
              const grey = leafGreyOf(i); // feuillage : vert tendre -> gris
              const crownGone = crownGoneOf(i); // houppier plein qui se vide (feuilles partent)
              const bare = barenessOf(i); // tronc nu qui apparait (retarde)
              const sway = Math.sin((frame - birth) / 19 + t.tx) * 1.2 * (1 - d * 0.85);
              // recroqueville leger a la mort : leger affaissement (scaleY) + descente
              const shrink = 1 - d * 0.06;
              const slump = d * 6;
              // couleur du feuillage plein : interpole vert tendre -> gris feuille
              const crownLeafFill = grey < 0.001 ? VERT_TENDRE : grey >= 0.999 ? GRIS_FEUILLE : `rgb(${Math.round(0x6f + (0x8f - 0x6f) * grey)},${Math.round(0xa8 + (0x8a - 0xa8) * grey)},${Math.round(0x5a + (0x7e - 0x5a) * grey)})`;
              const crownLeafStroke = grey > 0.5 ? CENDRE_D : VERT_TENDRE_D;
              return (
                <g key={i} transform={`translate(${t.tx} ${t.ty + slump}) scale(${t.s * pop})`}>
                  <g transform={`scale(1 ${shrink}) rotate(${sway})`}>
                    {/* ombre au sol (vert tendre tant que feuillu, vire au gris quand denude) */}
                    <ellipse cx={0} cy={14} rx={70} ry={18} fill={bare > 0.5 ? "#908979" : "#7a9560"} opacity={0.3} />
                    {/* TRONC NU (branches nues) — apparait UNE FOIS les feuilles parties (bareness, retarde) */}
                    <g opacity={bare}>
                      <DeadTreeShape trunk="#77736b" branch={CENDRE} trunkW={18} branchW={7} />
                    </g>
                    {/* HOUPPIER PLEIN — vert tendre a la naissance, grise (grey), puis se vide (crownGone) */}
                    <g opacity={1 - crownGone}>
                      <LeafyCrownShape leafFill={crownLeafFill} leafStroke={crownLeafStroke} />
                    </g>
                  </g>
                </g>
              );
            })}
          </g>

          {/* ---- PLUIE DE FEUILLES GROSSES (changement 3) : declenchee PAR ARBRE (cascade, changement 4).
               Chute ample : translateY + rotation continue + drift sinus + ralenti/repos au sol PERSISTANT. ---- */}
          <g id="les_feuilles_qui_tombent">
            {FALLING_LEAVES.map((lf, i) => {
              const start = DEATH_FRAMES[lf.tree] + (i % 5) * 4; // declenche avec la mort de SON arbre
              const local = frame - start;
              if (local < 0) return null;
              const FALL_DUR = 78;
              // progression de chute avec ralenti en fin (ease-out via points intermediaires)
              const p = interpolate(local, [0, 50, FALL_DUR], [0, 0.78, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              // trajectoire : du feuillage (lf.x,lf.y) vers le sol (lf.solX, lf.solY)
              const baseX = lf.x + (lf.solX - lf.x) * p;
              const baseY = lf.y + (lf.solY - lf.y) * p;
              // drift lateral en sinus (vrai mouvement de feuille), s'attenue en se posant
              const swing = lf.drift * Math.sin(local / 11) * (1 - p * 0.85);
              // leger rebond final (la feuille touche le sol et se stabilise)
              const settle = p > 0.9 ? Math.sin((local) / 4) * 2 * (1 - p) : 0;
              const cx = baseX + swing;
              const cy = baseY + settle;
              // rotation continue qui ralentit en se posant
              const spin = lf.rot + local * (lf.drift > 0 ? 3.2 : -3.2) * (1 - p * 0.8);
              // opacite : apparait puis RESTE (persistance au sol). Disparait seulement avec endFade global.
              const appear = interpolate(local, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              // couleur : feuille morte (gris-brun), legere variation
              const fill = i % 3 === 0 ? "#9a958a" : i % 3 === 1 ? "#8d8a82" : "#77756e";
              return (
                <ellipse
                  key={i}
                  cx={cx}
                  cy={cy}
                  rx={lf.rx}
                  ry={lf.ry}
                  fill={fill}
                  stroke={ENCRE}
                  strokeWidth={1.6}
                  opacity={appear * 0.92}
                  transform={`rotate(${spin} ${cx} ${cy})`}
                />
              );
            })}
          </g>

          {/* ---- L'ARBRE SURVIVANT : pop 0-138f, FAUSSE-MORT ~265f, REVERDIT (sursaut) a 393f ---- */}
          <g id="larbre_survivant_vert">
            {(() => {
              const birthInit = 30 + survivor.birthOrder * 22;
              const popInit = spring({ frame: frame - birthInit, fps, config: { mass: 1, damping: 13, stiffness: 120 } });
              if (popInit < 0.01) return null;
              // scale : pop initial, sursaut a REVERDIT (revive), puis respiration
              const reviveBoost = 1 + 0.15 * revive * (frame < 440 ? 1 : 0);
              const scaleFinal = survivor.s * popInit * (frame >= 423 ? breathe : 1) * reviveBoost;
              const sway = Math.sin((frame - birthInit) / 18) * 1.0;
              // CHANGEMENT 5 : le feuillage du survivant.
              // avant 393 : on melange encre-sec (greenIn=0) + un voile cendre (falseDeath) = "il grise comme les autres".
              // apres 393 : greenIn monte -> vert vif, le voile cendre disparait.
              return (
                <g transform={`translate(${survivor.tx} ${survivor.ty}) scale(${scaleFinal}) rotate(${sway})`}>
                  {/* racines qui s'enfoncent (scaleY depuis la base (0,0)) a REVERDIT */}
                  <g opacity={greenIn} transform={`scale(1 ${rootGrow})`}>
                    <path d="M0 0 C-30 40 -55 80 -70 140 M0 0 C25 45 48 90 60 150 M0 0 C-6 50 -8 110 -10 165" fill="none" stroke="#5b3b24" strokeWidth={6} strokeLinecap="round" />
                  </g>
                  {/* couche VERT TENDRE FEUILLU (etat de naissance) — IDENTIQUE aux 3 autres arbres.
                      visible avant REVERDIT. Il GARDE ses feuilles tout du long (ne se denude pas). */}
                  <g opacity={1 - greenIn}>
                    <LeafyCrownShape leafFill={VERT_TENDRE} leafStroke={VERT_TENDRE_D} />
                  </g>
                  {/* voile CENDRE (fausse mort) — grise LEGEREMENT le feuillage SANS le denuder
                      (le houppier garde sa forme pleine, il vire juste au cendre voile). */}
                  <g opacity={falseDeath * (1 - greenIn)}>
                    <LeafyCrownShape leafFill={CENDRE} leafStroke={CENDRE_D} />
                  </g>
                  {/* couche VERTE VIVE + glow (climax) — apparait au sursaut REVERDIT (plus eclatant que le tendre) */}
                  <g opacity={greenIn}>
                    <SurvivorShape trunk="#7b4b27" branch="#5b3b24" leaf={true} />
                  </g>

                  {/* CHANGEMENT 6 : LA FEUILLE VERTE UNIQUE — accrochee a la branche droite,
                      oscille au vent toute la scene, garde un soupcon de vert meme en fausse-mort. */}
                  <g transform={`translate(132 -245)`}>
                    {/* petit petiole reliant a la branche */}
                    <path d="M0 0 C10 8 18 16 26 22" fill="none" stroke="#5b3b24" strokeWidth={3} strokeLinecap="round" />
                    <g transform={`translate(${26 + leafSway} ${22 + leafSwayY}) rotate(${leafSway * 2})`}>
                      <ellipse cx={14} cy={0} rx={26} ry={13} fill={VERT} opacity={lonelyLeafGreen} stroke={ENCRE} strokeWidth={2} />
                      {/* nervure */}
                      <path d="M-10 0 L38 0" stroke={VERT_D} strokeWidth={2} opacity={lonelyLeafGreen} strokeLinecap="round" />
                    </g>
                  </g>
                </g>
              );
            })()}
          </g>

        </g>
        {/* ============ /MONDE ============ */}
      </svg>

      {/* ============ COUCHE SOUS-TITRES KARAOKE (bas CENTRE, Y ~1620-1790) ============
          Phrase visible avec highlight mot-a-mot : mot pas encore dit = encre PALE
          (opacity ~0.45) ; mot deja dit (narrationSec >= w.start) = encre PLEINE
          (opacity 1, plus gras) avec une touche vert DISCRETE sur le mot tout juste
          actif. Fond parchemin semi-transparent, centre. Frame-driven pur. */}
      {activePhrase && subOpacity > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1620,
            display: "flex",
            justifyContent: "center",
            opacity: subOpacity * endFade,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              maxWidth: 880,
              margin: "0 80px",
              padding: "18px 32px",
              borderRadius: 18,
              background: "rgba(232,220,192,0.72)",
              border: `1px solid rgba(43,33,23,0.18)`,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 37,
              lineHeight: 1.3,
              textAlign: "center",
              textWrap: "balance",
            }}
          >
            {activePhrase.words.map((w, i) => {
              const spoken = narrationSec >= w.start;
              // "tout juste actif" = mot en cours de prononciation (entre start et end)
              // -> recoit la touche vert discrete ; les mots deja passes restent encre plein.
              const active = narrationSec >= w.start && narrationSec <= w.end + 0.12;
              return (
                <span
                  key={i}
                  style={{
                    color: active ? VERT_D : ENCRE,
                    opacity: spoken ? 1 : 0.45,
                    fontWeight: spoken ? 800 : 600,
                    marginRight: 9,
                    display: "inline-block",
                  }}
                >
                  {w.word}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ============ COUCHE MICRO-SOURCES (SOUS le bloc sous-titre, CENTREE, Y ~1840) ============
          Repositionnee du coin bas-gauche vers sous le sous-titre, centree, plus
          grosse (~27px) et plus visible (opacity ~0.7). Encre italique discret,
          prefixe "src : ". Marge bas ~60px (1840 + ~40 hauteur < 1920). */}
      {activeSrc && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1840,
            display: "flex",
            justifyContent: "center",
            opacity: srcOpacity * 0.7 * endFade,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              maxWidth: 760,
              color: ENCRE,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 27,
              fontStyle: "italic",
              letterSpacing: 0.3,
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            src : {activeSrc.text}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default B2LigneBrisee;

/* ------------------------------------------------------------------ */
/* AJUSTEMENT KARAOKE (2 changements, demande Aziz) :                 */
/*  1. SOUS-TITRES KARAOKE mot-a-mot (pattern AtlasV2Subtitles adapte */
/*     en identite ENCRE/parchemin). 4 phrases groupees par silence   */
/*     (B2_WORDS / B2_PHRASES), un groupe visible a la fois (fade en   */
/*     secondes). Highlight frame-driven : narrationSec = frame/fps,   */
/*     compare au start de chaque mot. Mot PAS dit = encre pale        */
/*     (#2b2117 opacity 0.45, weight 600) ; mot DEJA dit = encre       */
/*     pleine (opacity 1, weight 800) ; mot en cours = touche vert     */
/*     DISCRETE (VERT_D #295c1c). Taille 37px (etait 44). Fond         */
/*     parchemin rgba(232,220,192,0.72) conserve, centre, top 1620.    */
/*     Accents FR a l'affichage ("Nigéria,", "Sénégal,").             */
/*  2. SOURCES repositionnees : du coin bas-GAUCHE -> SOUS le bloc     */
/*     sous-titre, CENTREES (top 1840, marge bas ~80px). Taille 27px   */
/*     (etait 20), opacity 0.7 (etait 0.5). Encre italique "src : ...".*/
/*  Animation (arbres/soleil/cascade/survivant/feuilles/dunes) inchangee.*/
/* ------------------------------------------------------------------ */
