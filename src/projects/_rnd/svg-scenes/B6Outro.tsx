/**
 * B6Outro — Beat 6 GGW "OUTRO + CTA" (registre ENCRE NARRATIVE, anime).
 *
 * CONCEPT (cible validee Aziz = "L'OPPOSITION VERTICALE", compo Gemini /tmp/ggw-cibles/b6-cible.svg) :
 *   une COUPE DE TERRE. EN HAUT (surface) : un MUR de 5 arbres MORTS alignes (le grand plan officiel
 *   qui a echoue, boucle avec le Beat 2) sur un sol CRAQUELE. EN PROFONDEUR : des BULBES DORMANTS
 *   (le savoir paysan qui dort sous nos pieds), une FISSURE (le chemin de l'eau/vie), une GOUTTE
 *   suspendue, et une POUSSE VIVANTE qui perce en bas (la vraie solution qui revient seule). En bas
 *   a droite, un SILLON en forme de "?" grave dans la terre = le CTA.
 *
 * INTENTION : CONCLURE / GRAVER la lecon (on ne combat pas le desert de front, on reveille la vie
 *   qui dort) + APPELER au commentaire. La derniere image (pousse verte + "?" grave) doit RESTER en tete.
 *
 * ⛔ PIEGE B6 (beat CONCEPTUEL) : risque MAX de schema/slide PowerPoint. L'opposition se lit par
 *   l'IMAGE (mur mort EN SURFACE vs vie EN PROFONDEUR, vertical), JAMAIS par fleche/colonne/croix/
 *   legende. Le CTA est un SILLON de terre creuse, PAS une bulle de chat UI.
 *
 * AJUSTEMENTS en code (Claude-editeur-SVG, demandes Aziz) :
 *   - LA FISSURE de la cible etait un gros path noir REMPLI (#2b2117) trop lourd pour le registre encre
 *     fin. REECRITE : un trait fin (stroke-width 5->3) qui SE CREUSE par stroke-dasharray (se trace en
 *     descendant a l'animation), au lieu d'etre un bloc noir d'emblee. + fines ramifications laterales.
 *   - les arbres morts naissent DRESSES (pop spring sequentiel, cascade) puis RESTENT (le mur reste,
 *     boucle B2) ; ils s'estompent (fade vertical du remplissage/opacite) sur "les grands plans".
 *
 * CHOREGRAPHIE — SCENE UNIQUE QUI SE RELIT, opposition verticale (frames @30fps, 600 frames / 20.0s) :
 *   - f0-68    "La lecon tient en une phrase :" INSTALLATION. La ligne de surface + la coupe de terre
 *              se tracent ; le sol craquele apparait ; le mur d'arbres MORTS se dresse (pop sequentiel, secs).
 *   - f70-156  "...bataille de front." L'ECHEC. Le mur reste, imposant mais mort ; touche OCRE-diagnostic
 *              (#b5651d) sur le sol craquele de SURFACE (echo B3 : la cause se colore quand on la nomme).
 *   - f191-256 "On reveille la vie qui dort deja dans la terre." LE RETOURNEMENT. Bascule du regard vers
 *              la PROFONDEUR : les bulbes_dormants se revelent (fade + pop cascade ~0.4s), la fissure se
 *              CREUSE en descendant (stroke-dashoffset), la goutte apparait suspendue. Encore en encre.
 *   - f256-371 (SILENCE ~4s : LA VIE QUI S'EVEILLE) — EXPLOITE (demande Aziz) : les graines (bulbes)
 *              PULSENT doucement et prennent une TOUCHE de vie-verte discrete (ce sont des graines vivantes
 *              qui dorment) ; une graine se DETACHE (la graine paysanne) et TOMBE vers la fissure pour
 *              preparer la pousse. Le silence devient un temps narratif (l'eveil sous terre), pas un vide.
 *   - f371-496 "...ce ne sont pas les grands plans internationaux..." le mur d'arbres morts (le "grand
 *              plan") PERD sa presence (fade vertical de son remplissage/opacite, du haut vers le bas =
 *              s'estompe) ; la vie souterraine gagne (les bulbes/fissure se renforcent legerement).
 *              Objet inerte -> FADE, JAMAIS glisser lateralement.
 *   - f499-562 "Ce sont les paysans." CLIMAX COULEUR. La goutte TOMBE (spring) dans la fissure -> la
 *              pousse PERCE et VERDIT (#3e8f34) : cross-fade encre->vert + leger glow + spring de croissance.
 *              La SEULE couleur vive = la vie qui revient = credit aux paysans.
 *   - f540-590 ⭐⭐ BOUCLER LA BOUCLE (climax emotionnel du short) : une RACINE/LIGNE couleur TERRE
 *              (#8a5a2c) REMONTE depuis la pousse verte vers les arbres morts du haut (montre la connexion
 *              sol->arbres : la vie remonte) -> les ARBRES MORTS du mur se COUVRENT DE FEUILLES VERTES
 *              (#3e8f34) : houppiers en cross-fade encre->vert, en cascade gauche->droite. Le grand plan
 *              echoue est rendu vivant par la graine paysanne. La vraie solution etait deja sous nos pieds.
 *   - f590-600 DERNIERE IMAGE QUI RESPIRE : le MUR D'ARBRES REVENU VIVANT (vert) + la pousse. Calme,
 *              conclusion. PAS de "?", PAS de CTA (retire — decide a l'assemblage). Le mur vert RESTE.
 *
 * GRAMMAIRE (identique hook + B2 + B3) : spring pop / stroke-dashoffset (se-creuse) / cross-fade opacite ;
 *   clamp partout, frame-driven (zero CSS transition/keyframes/setTimeout) ; scene FIXE (pas de translate
 *   global du monde). Raccord par fade.
 *
 * Composition 1080x1920 (9:16), 600 frames @30fps. Audio Beat 6 COUPE (narration-beat6-cut.mp3, apres
 *   "Ce sont les paysans" ~18.78s) : le CTA "Quel pays... commentaire" est retire du visuel ET de l'audio.
 *   PAS de musique (assemblage).
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
  staticFile,
} from "remotion";

const CREME = "#e8dcc0";
const ENCRE = "#2b2117";
// OCRE-diagnostic (repris B3) = la SEULE touche couleur de l'ECHEC (sol mort de surface).
const OCRE_TERRE = "#b5651d";
// VERT (repris B2/B3) = la SEULE couleur VIVE, gardee pour le CLIMAX (la pousse = la vie qui revient).
const VERT = "#3e8f34";
const VERT_D = "#295c1c";
// TERRE-VIVANTE (#8a5a2c) = la racine/ligne qui remonte du sol vers les arbres (connexion sol->arbres).
const TERRE_VIVE = "#8a5a2c";

// grande valeur de dash pour le se-creuse (longueurs de path inconnues -> sur-dimensionne + clamp)
const DASH = 4200;

const clampI = (f: number, inR: [number, number], outR: [number, number]) =>
  interpolate(f, inR, outR, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/* ---- HOUPPIER REVERDISSANT (adapte de B3Malentendu LeafyCrown) : cercles de feuillage + nervures.
   Pose au-dessus du tronc d'un arbre mort (coordonnees relatives a la base 0,0 de l'arbre, donc cy
   negatif = vers le haut). fill anime encre/creme->vert par cross-fade (greenWall). Compact (arbres
   du mur ~250px de haut). g = avancement vert 0..1. ---- */
const DEAD_LEAF_POS: [number, number, number][] = [
  [-42, -262, 40],
  [-8, -290, 44],
  [30, -282, 44],
  [62, -256, 38],
  [-22, -238, 38],
  [34, -232, 36],
  [8, -266, 46],
  [-60, -240, 28],
  [82, -240, 26],
];
const ReverdantCrown: React.FC<{ g: number }> = ({ g }) => {
  // fill : creme (vide, invisible "feuillage absent") -> vert plein. opacite croit avec g.
  const fill = g < 0.5 ? CREME : VERT;
  const stroke = g > 0.5 ? VERT_D : ENCRE;
  return (
    <g opacity={g}>
      {DEAD_LEAF_POS.map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r * (0.6 + 0.4 * g)}
          fill={fill}
          stroke={stroke}
          strokeWidth={2.5}
        />
      ))}
      {/* nervures internes (texture feuillage) */}
      <path
        d="M-32 -262 C-2 -278 32 -274 62 -252 M-38 -238 C0 -220 46 -220 84 -240 M-14 -288 C14 -298 42 -294 68 -276"
        fill="none"
        stroke={stroke}
        strokeWidth={2.5}
        opacity={0.7 * g}
        strokeLinecap="round"
      />
    </g>
  );
};

/* ---------- SOUS-TITRES KARAOKE mot-a-mot (pattern B2/B3) ----------
   mot PAS dit = encre PALE (0.45) ; mot DEJA dit = encre PLEINE ; mot EN COURS = VERT (#3e8f34).
   start/end = SECONDES (beat-relatif, 30fps). Accents FR obligatoires. Chiffres en lettres (aucun ici). */
type Word = { word: string; start: number; end: number };
const B6_WORDS: Word[] = [
  { word: "La", start: 0.185, end: 0.245 },
  { word: "leçon", start: 0.305, end: 0.645 },
  { word: "tient", start: 0.705, end: 0.865 },
  { word: "en", start: 0.905, end: 1.005 },
  { word: "une", start: 1.045, end: 1.205 },
  { word: "phrase", start: 1.225, end: 1.585 },
  { word: "on", start: 2.325, end: 2.385 },
  { word: "n'arrête", start: 2.425, end: 2.745 },
  { word: "pas", start: 2.785, end: 2.905 },
  { word: "le", start: 2.945, end: 3.045 },
  { word: "désert", start: 3.085, end: 3.545 },
  { word: "en", start: 3.805, end: 3.865 },
  { word: "lui", start: 3.925, end: 4.025 },
  { word: "livrant", start: 4.065, end: 4.405 },
  { word: "bataille", start: 4.445, end: 4.745 },
  { word: "de", start: 4.785, end: 4.905 },
  { word: "front.", start: 4.965, end: 5.185 },
  { word: "On", start: 6.365, end: 6.445 },
  { word: "réveille", start: 6.505, end: 6.805 },
  { word: "la", start: 6.865, end: 6.985 },
  { word: "vie", start: 7.005, end: 7.165 },
  { word: "qui", start: 7.225, end: 7.305 },
  { word: "dort", start: 7.345, end: 7.485 },
  { word: "déjà", start: 7.565, end: 7.845 },
  { word: "dans", start: 7.885, end: 7.985 },
  { word: "la", start: 8.045, end: 8.165 },
  { word: "terre.", start: 8.225, end: 8.525 },
  { word: "Et", start: 12.365, end: 12.465 },
  { word: "ça,", start: 12.545, end: 12.665 },
  { word: "ce", start: 12.785, end: 12.865 },
  { word: "ne", start: 12.905, end: 12.965 },
  { word: "sont", start: 12.985, end: 13.165 },
  { word: "pas", start: 13.185, end: 13.285 },
  { word: "les", start: 13.325, end: 13.405 },
  { word: "grands", start: 13.425, end: 13.645 },
  { word: "plans", start: 13.665, end: 13.905 },
  { word: "internationaux", start: 13.945, end: 14.685 },
  { word: "qui", start: 14.745, end: 14.805 },
  { word: "l'ont", start: 14.825, end: 14.965 },
  { word: "compris", start: 15.005, end: 15.305 },
  { word: "en", start: 15.345, end: 15.405 },
  { word: "premier.", start: 15.465, end: 16.545 },
  { word: "Ce", start: 16.625, end: 16.745 },
  { word: "sont", start: 16.785, end: 16.885 },
  { word: "les", start: 16.945, end: 17.065 },
  { word: "paysans.", start: 17.105, end: 18.745 },
  // ⚠️ CTA "Quel pays... commentaire" RETIRE (demande Aziz) — du visuel ET de l'audio coupe.
];

/* ⚠️ Trou de doctrine #1 : NE PAS grouper par silence auto. On FORCE les frontieres par INDEX de
   mots, sur les 7 segments du script. La phrase 4 ("Et ca...premier.", 15 mots) est SCINDEE en 2
   sur "qui" (index 37) pour la lisibilite -> 8 sous-titres. Verifie par print avant render. */
const PHRASE_BREAKS = [6, 17, 27, 37, 42];
type Phrase = { words: Word[]; start: number; end: number };
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
const B6_PHRASES: Phrase[] = buildPhrases(B6_WORDS);

/* ---- BULBES DORMANTS : positions/parametres (coupe de terre, profondeur). Repris de la cible.
   Chaque bulbe se revele en cascade (~0.4s d'intervalle) puis respire doucement (sin). ---- */
type Bulb = {
  tx: number;
  ty: number;
  rx: number;
  ry: number;
  seed: string;
  roots: string;
  veins: string;
  delay: number;
};
const BULBS: Bulb[] = [
  // Bulb 1 (gauche, ~y950)
  {
    tx: 250,
    ty: 950,
    rx: 55,
    ry: 40,
    seed: "M-30,0 C-30,-25 30,-25 40,0 C50,25 -30,25 -30,0 Z",
    roots:
      "M-30,0 C-60,10 -80,-20 -100,10 M-30,0 C-50,30 -70,30 -80,60 M40,0 C70,10 90,-10 120,0 M40,0 C60,20 70,40 100,50",
    veins: "M-20,-5 Q 5,-15 30,-2 M-20,5 Q 5,15 25,5",
    delay: 0,
  },
  // Bulb 2 (droite, ~y1150)
  {
    tx: 820,
    ty: 1150,
    rx: 45,
    ry: 65,
    seed: "M0,-40 C25,-40 25,40 0,50 C-25,40 -25,-40 0,-40 Z",
    roots:
      "M0,50 C10,80 -10,100 0,130 M0,50 C-20,70 -40,60 -60,90 M0,-40 C-10,-70 20,-90 10,-120 M0,-40 C30,-60 50,-50 70,-70",
    veins: "M-10,-20 Q 15,-10 10,-30 M-15,10 Q 15,20 10,0",
    delay: 12,
  },
  // Bulb 3 (centre profond, ~y1350)
  {
    tx: 350,
    ty: 1350,
    rx: 60,
    ry: 35,
    seed: "M-35,-10 C-10,-30 20,-30 40,-5 C60,20 10,25 -35,-10 Z",
    roots:
      "M-35,-10 C-60,-20 -80,0 -110,-10 M-35,-10 C-50,-30 -40,-60 -60,-80 M40,-5 C70,0 80,20 110,10 M40,-5 C50,25 70,40 90,60",
    veins: "M-20,-10 Q 5,-20 25,-10 M-10,0 Q 15,-10 20,5",
    delay: 24,
  },
];

/* ---- MUR D'ARBRES MORTS : 5 arbres secs alignes en surface (repris de la cible). Chaque arbre
   = tronc nu + branches mortes. Naissent en cascade (pop spring sequentiel), restent, puis
   s'estompent sur "les grands plans". Dessine relatif a sa base (0,0). ---- */
const DEAD_TREES: { x: number; y: number; trunk: string; branch: string; tip: string; delay: number }[] = [
  {
    x: 130,
    y: 540,
    trunk: "M0,0 C-5,-50 -10,-150 -5,-250",
    branch:
      "M-8,-100 C-30,-140 -50,-180 -70,-200 M-7,-160 C20,-200 40,-220 50,-260 M-6,-200 C-20,-230 -30,-260 -35,-290 M30,-220 C45,-230 60,-240 70,-260 M-40,-160 C-55,-170 -70,-175 -85,-180",
    tip: "M-5,-250 L-15,-280 M-5,-250 L10,-275 M-70,-200 L-90,-210 M50,-260 L60,-280",
    delay: 0,
  },
  {
    x: 330,
    y: 538,
    trunk: "M0,0 C2,-60 5,-140 0,-240",
    branch:
      "M2,-80 C30,-120 50,-160 65,-210 M1,-130 C-30,-170 -45,-210 -55,-250 M1,-180 C20,-210 35,-240 45,-280 M-20,-150 C-40,-155 -55,-160 -70,-170 M40,-160 C55,-170 70,-185 80,-200",
    tip: "M0,-240 L-10,-270 M0,-240 L15,-260 M65,-210 L80,-220 M-55,-250 L-65,-270",
    delay: 5,
  },
  {
    x: 530,
    y: 542,
    trunk: "M0,0 C-3,-50 -6,-150 0,-260",
    branch:
      "M-2,-90 C-35,-120 -55,-160 -65,-200 M-2,-140 C25,-170 45,-200 55,-240 M-1,-190 C-25,-220 -40,-260 -45,-300 M35,-180 C50,-190 70,-200 85,-220 M-45,-140 C-60,-145 -75,-155 -90,-170",
    tip: "M0,-260 L-15,-290 M0,-260 L15,-280 M-65,-200 L-85,-210 M55,-240 L70,-255",
    delay: 10,
  },
  {
    x: 730,
    y: 535,
    trunk: "M0,0 C5,-50 10,-130 5,-230",
    branch:
      "M4,-70 C30,-110 45,-150 55,-190 M5,-120 C-25,-160 -45,-200 -60,-240 M5,-170 C25,-200 40,-230 45,-270 M-35,-170 C-50,-180 -65,-190 -80,-210 M35,-130 C50,-140 65,-150 80,-165",
    tip: "M5,-230 L-5,-260 M5,-230 L20,-250 M55,-190 L75,-205 M-60,-240 L-75,-260",
    delay: 15,
  },
  {
    x: 930,
    y: 540,
    trunk: "M0,0 C-2,-60 -5,-140 -2,-250",
    branch:
      "M-1,-80 C-25,-120 -40,-160 -55,-210 M-2,-140 C25,-180 40,-220 50,-260 M-2,-200 C-20,-230 -35,-260 -45,-300 M35,-190 C50,-200 65,-215 75,-230 M-35,-140 C-50,-150 -65,-165 -80,-185",
    tip: "M-2,-250 L-15,-280 M-2,-250 L10,-275 M-55,-210 L-70,-230 M50,-260 L60,-285",
    delay: 20,
  },
];

export const B6Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // raccord : leger fade global en TOUTE fin (la scene respire ~3s sur le mur verdi avant ce fade).
  // duree 690f (23.0s) : +3s de respiration finale apres "Ce sont les paysans" (demande Aziz).
  const endFade = clampI(frame, [672, 690], [1, 0.94]);

  /* === f0-68 INSTALLATION === */
  // ligne de surface + coupe de terre : se-tracent f0-66
  const groundDraw = clampI(frame, [0, 66], [DASH, 0]);
  // sol craquele de surface : se-trace f14-66
  const crackDraw = clampI(frame, [14, 66], [DASH, 0]);
  // soleil/horizon discret : fade-in
  const surfIn = clampI(frame, [0, 30], [0, 1]);

  /* === f70-156 L'ECHEC === */
  // OCRE-diagnostic sur le sol de SURFACE (la cause se colore quand on la nomme "front") f78-150
  const ocreIn = clampI(frame, [78, 150], [0, 1]);

  /* === f191-256 LE RETOURNEMENT (profondeur) === */
  // la FISSURE se CREUSE en descendant (stroke-dashoffset) f196-262
  const fissureDraw = clampI(frame, [196, 262], [DASH, 0]);
  // la GOUTTE apparait suspendue f235-270
  const dropIn = clampI(frame, [235, 270], [0, 1]);
  // (les bulbes ont leur propre cascade ci-dessous, demarre f198)

  /* === f371-496 le mur d'arbres morts S'ESTOMPE (fade vertical) === */
  // opacite du remplissage/mur : 1 -> 0.32 (s'estompe, pas disparait : il reste fantome) f378-490
  const wallFade = clampI(frame, [378, 490], [1, 0.32]);
  // la vie souterraine se renforce legerement en miroir f380-496
  const lifeGain = clampI(frame, [380, 496], [0, 1]);

  /* === f256-371 SILENCE EXPLOITE (~8.5s->12.4s) : LE RESEAU RACINAIRE S'ILLUMINE ===
     Demande Aziz : meubler ce silence par une vraie animation souterraine. La vie qui dort
     sous la terre s'EVEILLE : les graines s'illuminent une a une (vert), et de chaque graine
     partent de fins FILAMENTS DE RACINES qui se TRACENT et relient les graines entre elles
     = un reseau vivant souterrain qui s'allume (comme un systeme nerveux qui se reveille).
     Puis la graine centrale tombe vers la fissure (prepare la pousse). */
  // touche de vie-verte sur les graines (elles sont vivantes) — PLUS MARQUEE (Aziz : trop subtil avant)
  const seedAlive = clampI(frame, [258, 320], [0, 1]);
  // pulse d'eveil par graine (cascade : la graine i s'illumine ~10f apres la precedente)
  const seedWake = (i: number) => clampI(frame, [262 + i * 14, 262 + i * 14 + 26], [0, 1]);
  // les FILAMENTS du reseau racinaire se tracent entre les graines f280-360 (se-creuse)
  const webDraw = clampI(frame, [280, 360], [DASH, 0]);
  // apparait f278, RESTE pendant le climax (le reseau vit), s'attenue un peu sous la racine montante.
  const webIn = clampI(frame, [278, 300], [0, 1]) * clampI(frame, [520, 560], [1, 0.5]);
  // la graine paysanne (bulbe 3, centre) se DETACHE et TOMBE vers la fissure f320 (spring) — apres l'eveil du reseau
  const seedFall = spring({
    frame: frame - 320,
    fps,
    config: { mass: 1, damping: 16, stiffness: 60 },
    durationInFrames: 60,
  });

  /* === f499-562 CLIMAX : goutte tombe -> pousse verdit === */
  // la goutte TOMBE (spring) f500 : descend de sa cavite (y~775) vers la fissure (y~1500+)
  const dropFall = spring({
    frame: frame - 500,
    fps,
    config: { mass: 1, damping: 13, stiffness: 70 },
    durationInFrames: 40,
  });
  // la pousse PERCE (spring de croissance) f512
  const sproutGrow = spring({
    frame: frame - 512,
    fps,
    config: { mass: 1, damping: 14, stiffness: 95 },
    durationInFrames: 46,
  });
  // la pousse VERDIT (cross-fade encre->vert) f518-560
  const greenIn = clampI(frame, [518, 560], [0, 1]);
  // glow de la pousse (respire au climax) f520+
  const sproutGlow = greenIn * (0.6 + 0.4 * Math.sin((frame - 520) / 9));

  /* === f532-590 ⭐⭐ BOUCLER LA BOUCLE : la racine remonte -> le mur reverdit ===
     Demarre PLUS TOT (f532, demande Aziz : a f560 les arbres n'etaient pas encore verts) pour
     qu'on SAVOURE le verdissement, qui se termine bien avant la respiration finale. */
  // la RACINE/LIGNE couleur TERRE remonte de la pousse (y~1530) vers les arbres (y~540) f528-580
  // se-trace EN MONTANT (stroke-dashoffset descend) — connexion sol->arbres
  const rootRise = clampI(frame, [528, 580], [DASH, 0]);
  const rootIn = clampI(frame, [528, 544], [0, 1]);
  // les ARBRES MORTS reverdissent (houppiers en cross-fade encre->vert), cascade gauche->droite.
  // i=0 f540->568 ... i=4 f568->596 : les 5 arbres pleinement verts vers f596, puis la fin respire (f596-690).
  const greenWall = (i: number) => clampI(frame, [540 + i * 7, 540 + i * 7 + 28], [0, 1]);

  /* === f594-690 DERNIERE IMAGE VIVANTE (~3s, demande Aziz : pas de statique) ===
     Le mur verdi RESTE, mais VIT : les houppiers verts oscillent au vent (sin dephase),
     la pousse respire, et la vie souterraine (graines, reseau) continue de pulser doucement.
     Une belle image de fin qui boucle en beaute, pas une image figee. */
  const aliveFinal = clampI(frame, [594, 620], [0, 1]); // la vie finale s'installe
  const windSway = Math.sin(frame / 16); // balancement lent au vent (les feuilles bougent)
  const sproutColor =
    greenIn < 0.001
      ? ENCRE
      : greenIn >= 0.999
      ? VERT
      : `rgb(${Math.round(0x2b + (0x3e - 0x2b) * greenIn)},${Math.round(
          0x21 + (0x8f - 0x21) * greenIn
        )},${Math.round(0x17 + (0x34 - 0x17) * greenIn)})`;

  /* ---------------- SOUS-TITRES KARAOKE (pattern B2/B3) ---------------- */
  const narrationSec = frame / fps;
  const activePhraseIdx = (() => {
    for (let i = 0; i < B6_PHRASES.length; i++) {
      const p = B6_PHRASES[i];
      const nextStart = B6_PHRASES[i + 1]?.start ?? p.end + 0.8;
      if (narrationSec >= p.start - 0.18 && narrationSec < nextStart) return i;
    }
    return -1;
  })();
  const activePhrase = activePhraseIdx >= 0 ? B6_PHRASES[activePhraseIdx] : null;
  const subOpacity = (() => {
    if (!activePhrase) return 0;
    const nextStart =
      B6_PHRASES[activePhraseIdx + 1]?.start ?? activePhrase.end + 0.8;
    const appearAt = activePhrase.start - 0.18;
    const fadeOutStart = nextStart - 0.3;
    return interpolate(
      narrationSec,
      [appearAt, appearAt + 0.25, fadeOutStart, nextStart],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  })();

  // position de la goutte (interpolee par dropFall : de la cavite vers la fissure profonde)
  const dropY = 775 + (1530 - 775) * dropFall;
  const dropX = 495 + 20 * dropFall; // derive vers le centre de la fissure

  return (
    <AbsoluteFill style={{ background: CREME }}>
      <Audio src={staticFile("audio/ggw-muraille-verte/narration-beat6-cut.mp3")} />

      {/* ============ COUCHE SFX (frame-driven via <Sequence from=>) — tous sous la narration ============ */}
      {/* vent de fond continu (ambiance) */}
      <Audio
        src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-vent.mp3")}
        volume={0.12}
      />
      {/* vent SEC sur les arbres morts (l'echec en surface) — f80 */}
      <Sequence from={80} durationInFrames={80}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-vent-sec.mp3")}
          volume={0.5}
        />
      </Sequence>
      {/* la fissure se creuse (la vie qui descend) — f196 */}
      <Sequence from={196} durationInFrames={70}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-fissure.mp3")}
          volume={0.42}
        />
      </Sequence>
      {/* la goutte tombe (climax, juste avant la pousse) — f500 */}
      <Sequence from={500} durationInFrames={26}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-goutte.mp3")}
          volume={0.55}
        />
      </Sequence>
      {/* la pousse perce et verdit — f513 */}
      <Sequence from={513} durationInFrames={50}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-pousse.mp3")}
          volume={0.55}
        />
      </Sequence>
      {/* la vie REMONTE vers les arbres (la racine monte, le mur reverdit) — f540 */}
      <Sequence from={540} durationInFrames={56}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-eau-remonte.mp3")}
          volume={0.5}
        />
      </Sequence>

      <svg viewBox="0 0 1080 1920" width="100%" height="100%" opacity={endFade}>
        {/* fond parchemin + cadre epure (identite short) */}
        <rect width={1080} height={1920} fill={CREME} />
        <rect
          x={40}
          y={40}
          width={1000}
          height={1840}
          stroke={ENCRE}
          strokeWidth={1.5}
          fill="none"
        />
        <rect
          x={50}
          y={50}
          width={980}
          height={1820}
          stroke={ENCRE}
          strokeWidth={1}
          strokeDasharray="4 8"
          fill="none"
        />

        {/* ============ MONDE (FIXE) ============ */}
        <g id="monde">
          {/* ---- COUPE DE TERRE : la ligne de surface (horizon) + strates + hachures profondes.
               Se-tracent f0-66. C'est le canevas vertical (surface en haut, profondeur en bas). ---- */}
          <g id="coupe_terre" opacity={surfIn}>
            {/* ligne de surface / horizon (separe SURFACE et PROFONDEUR) */}
            <path
              d="M0,540 C 200,535 400,545 600,538 C 800,530 1000,542 1080,535"
              fill="none"
              stroke={ENCRE}
              strokeWidth={4}
              strokeDasharray={DASH}
              strokeDashoffset={groundDraw}
            />
            {/* strates de profondeur (se-tracent) */}
            <path
              d="M0,650 Q 200,680 450,620 T 800,690 T 1080,640"
              stroke={ENCRE}
              strokeWidth={2}
              fill="none"
              strokeDasharray={DASH}
              strokeDashoffset={groundDraw}
              opacity={0.85}
            />
            <path
              d="M0,1050 Q 250,1090 500,1040 T 850,1100 T 1080,1060"
              stroke={ENCRE}
              strokeWidth={1.5}
              fill="none"
              strokeDasharray={DASH}
              strokeDashoffset={groundDraw}
              opacity={0.7}
            />
            <path
              d="M0,1650 Q 200,1680 450,1640 T 800,1700 T 1080,1660"
              stroke={ENCRE}
              strokeWidth={2}
              fill="none"
              strokeDasharray={DASH}
              strokeDashoffset={groundDraw}
              opacity={0.7}
            />
            {/* hachures gravees (texture terre profonde) — fade-in doux */}
            <path
              d="M100,700 L120,730 M150,710 L170,740 M120,750 L140,780 M850,850 L870,880 M900,830 L920,860 M200,1400 L230,1420 M250,1390 L280,1410 M900,1200 L910,1240 M960,1190 L970,1230"
              stroke={ENCRE}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={clampI(frame, [40, 90], [0, 0.55])}
            />
          </g>

          {/* ---- SOL CRAQUELE (surface, sous l'horizon) : plaques seches en perspective.
               Se-trace f14-66 ; s'allume en OCRE-diagnostic f78-150 (l'ECHEC de surface). ---- */}
          <g id="sol_craquele">
            {/* fonds de plaque ocre qui s'allument (la cause : sol mort de surface) */}
            <g opacity={ocreIn * 0.5}>
              <path d="M50,560 L150,580 L70,595 L160,545 L250,540 L280,565 L170,585 Z" fill={OCRE_TERRE} stroke="none" />
              <path d="M290,540 L380,542 L360,575 L285,570 L400,538 L510,545 L480,580 L380,580 Z" fill={OCRE_TERRE} stroke="none" />
              <path d="M525,542 L630,538 L650,570 L500,582 L650,538 L760,532 L780,560 L660,575 Z" fill={OCRE_TERRE} stroke="none" />
              <path d="M785,532 L890,535 L860,570 L790,565 L900,538 L1000,535 L1020,565 L880,575 Z" fill={OCRE_TERRE} stroke="none" />
            </g>
            {/* reseau de craquelures (encre) — se-trace */}
            <path
              d="M50,560 L120,550 L150,580 L70,595 Z M160,545 L250,540 L280,565 L170,585 Z M290,540 L380,542 L360,575 L285,570 Z M400,538 L510,545 L480,580 L380,580 Z M525,542 L630,538 L650,570 L500,582 Z M650,538 L760,532 L780,560 L660,575 Z M785,532 L890,535 L860,570 L790,565 Z M900,538 L1000,535 L1020,565 L880,575 Z"
              fill="none"
              stroke={ENCRE}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeDasharray={DASH}
              strokeDashoffset={crackDraw}
            />
            <path
              d="M30,550 L50,620 M145,555 L160,615 M275,545 L290,610 M390,545 L385,615 M515,545 L500,620 M640,540 L660,615 M775,535 L795,605 M895,540 L885,610"
              fill="none"
              stroke={ENCRE}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={DASH}
              strokeDashoffset={crackDraw}
              opacity={0.8}
            />
          </g>

          {/* ---- MUR D'ARBRES MORTS (surface) : 5 arbres secs. Naissent en cascade (pop spring),
               RESTENT (boucle B2 : le mur reste), puis S'ESTOMPENT (wallFade) sur "les grands plans".
               Objet inerte -> fade vertical, JAMAIS glisser. ---- */}
          <g id="mur_arbres_morts" opacity={surfIn}>
            {/* tranchee de plantation (la ligne stricte du plan officiel) */}
            <line
              x1={50}
              y1={540}
              x2={1030}
              y2={540}
              stroke={ENCRE}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="40 15"
              opacity={clampI(frame, [4, 40], [0, 1]) * wallFade}
            />
            {DEAD_TREES.map((t, i) => {
              // pop spring sequentiel (cascade ~0.4s) : l'arbre se dresse depuis sa base
              const pop = spring({
                frame: frame - (12 + t.delay),
                fps,
                config: { mass: 1, damping: 13, stiffness: 95 },
                durationInFrames: 30,
              });
              if (pop < 0.01) return null;
              // avancement vert de CET arbre (cascade gauche->droite au climax final)
              const g = greenWall(i);
              // l'arbre estompe (wallFade), mais REVIENT vivant quand il reverdit (g remonte l'opacite).
              // tronc/branches reverdissent aussi (encre->vert) en miroir du houppier.
              const treeOp = Math.max(wallFade, clampI(g, [0, 0.4], [wallFade, 1]));
              const woodColor = g < 0.4 ? ENCRE : VERT_D;
              return (
                <g
                  key={i}
                  transform={`translate(${t.x},${t.y}) scale(${pop})`}
                  opacity={treeOp}
                >
                  <path d={t.trunk} stroke={woodColor} strokeWidth={8} fill="none" strokeLinecap="round" />
                  <path d={t.branch} stroke={woodColor} strokeWidth={5} fill="none" strokeLinecap="round" />
                  <path d={t.tip} stroke={woodColor} strokeWidth={3} fill="none" strokeLinecap="round" />
                  {/* houppier reverdissant : invisible (g=0) tant qu'on n'a pas boucle la boucle.
                      Une fois vert, il OSCILLE au vent (la vie continue — image de fin non statique,
                      demande Aziz). Balancement dephase par arbre (i) autour du point d'attache du houppier. */}
                  {g > 0.001 && (
                    <g
                      transform={`rotate(${aliveFinal * g * 1.6 * Math.sin(frame / 16 + i * 0.7)},20,-260)`}
                    >
                      <ReverdantCrown g={g} />
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* ============ PROFONDEUR (la vie qui dort sous nos pieds) ============ */}

          {/* ---- LA FISSURE (AFFINEE) : le chemin de l'eau/vie qui descend. Reecrite en TRAIT FIN
               qui SE CREUSE (stroke-dashoffset) au lieu du gros path noir rempli de la cible.
               + fines ramifications laterales. lifeGain la renforce legerement apres f380. ---- */}
          <g id="la_fissure" opacity={clampI(frame, [196, 230], [0, 1])}>
            {/* trait principal de la fissure (descend du sous-sol vers la pousse) — se creuse */}
            <path
              d="M495,620 L500,720 L470,850 L505,1000 L480,1150 L515,1350 L500,1500"
              fill="none"
              stroke={ENCRE}
              strokeWidth={4 + 1.5 * lifeGain}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={DASH}
              strokeDashoffset={fissureDraw}
            />
            {/* fines ramifications laterales (le reseau de vie) — se creusent avec un leger retard */}
            <path
              d="M470,850 Q 420,880 380,860 M505,1000 Q 560,1030 610,1000 M480,1150 Q 430,1175 390,1150 M515,1350 Q 575,1375 630,1350"
              fill="none"
              stroke={ENCRE}
              strokeWidth={2 + lifeGain}
              strokeLinecap="round"
              strokeDasharray={DASH}
              strokeDashoffset={clampI(frame, [220, 285], [DASH, 0])}
              opacity={0.75}
            />
          </g>

          {/* ---- ⭐ RESEAU RACINAIRE QUI S'ILLUMINE (silence f280-360, demande Aziz) : de fins
               filaments relient les graines entre elles et a la fissure -> un reseau vivant
               souterrain qui s'allume en vert-terre (la vie qui dort sous nos pieds, partout,
               pas un seul point). Se-tracent (stroke-dashoffset), pulsent doucement. ---- */}
          <g id="reseau_racinaire" opacity={webIn * (0.5 + 0.5 * seedAlive)}>
            {/* filaments graine-a-graine + graine-a-fissure (le maillage vivant) */}
            <path
              d="M305,950 C 200,1020 260,1120 470,1000 M820,1150 C 650,1100 560,1040 505,1000 M350,1350 C 300,1230 420,1150 480,1100 M250,950 C 180,1080 220,1250 350,1350 M820,1150 C 720,1260 520,1320 410,1350"
              fill="none"
              stroke={TERRE_VIVE}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray={DASH}
              strokeDashoffset={webDraw}
              opacity={0.6 + 0.4 * Math.sin(frame / 10)}
            />
            {/* petits noeuds lumineux aux intersections (la vie qui pulse dans le reseau) */}
            {[
              [305, 950],
              [820, 1150],
              [350, 1350],
              [480, 1010],
            ].map(([cx, cy], i) => {
              const pulse = seedWake(i) * (0.5 + 0.5 * Math.sin(frame / 7 + i));
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={5 + 4 * pulse}
                  fill={VERT}
                  opacity={0.5 * pulse}
                />
              );
            })}
          </g>

          {/* ---- BULBES DORMANTS : le savoir paysan qui dort. Se revelent en cascade f198+
               (fade + pop), respirent doucement (sin), se renforcent apres f380 (lifeGain). ---- */}
          <g id="bulbes_dormants">
            {BULBS.map((b, i) => {
              const start = 198 + b.delay;
              const pop = spring({
                frame: frame - start,
                fps,
                config: { mass: 1, damping: 15, stiffness: 90 },
                durationInFrames: 34,
              });
              if (pop < 0.01) return null;
              // SILENCE EXPLOITE : eveil PLUS LISIBLE (demande Aziz : trop subtil avant). Chaque graine
              // s'eveille en cascade (seedWake), pulse plus fort, et reste vivante apres (lifeGain).
              const wake = seedWake(i);
              const awakeLevel = Math.max(wake, lifeGain * 0.6);
              const breathe =
                1 + (0.03 + 0.06 * awakeLevel) * Math.sin((frame - start) / 9 + i);
              const op = clampI(frame - start, [0, 18], [0, 1]) * (0.85 + 0.15 * lifeGain);
              // verdissement PLEIN de la graine (elle est vivante) — bien visible pendant l'eveil
              const greenLevel = Math.min(1, awakeLevel);
              const seedStroke =
                greenLevel < 0.01
                  ? ENCRE
                  : `rgb(${Math.round(0x2b + (0x3e - 0x2b) * greenLevel)},${Math.round(
                      0x21 + (0x8f - 0x21) * greenLevel
                    )},${Math.round(0x17 + (0x34 - 0x17) * greenLevel)})`;
              // halo vert qui pulse autour de la graine eveillee (la rend visible)
              const seedGlow = greenLevel * (0.5 + 0.5 * Math.sin((frame - start) / 8 + i));
              // BULB 3 (centre) NE TOMBE PLUS (demande Aziz) : elle restait verte puis se decrochait
              // et tombait -> donnait l'impression qu'elle MOURAIT sous terre alors que les 2 autres
              // restaient. Desormais les 3 graines restent vertes EN PLACE jusqu'a la fin (vie qui dort).
              const isFallingSeed = false;
              return (
                <g
                  key={i}
                  transform={`translate(${b.tx},${b.ty}) scale(${pop * breathe})`}
                  opacity={op}
                >
                  {/* cavite (creux dans la terre) */}
                  <ellipse
                    cx={0}
                    cy={0}
                    rx={b.rx}
                    ry={b.ry}
                    fill={CREME}
                    stroke={ENCRE}
                    strokeWidth={1.5}
                    strokeDasharray="5 3"
                  />
                  {/* racines anciennes */}
                  <path d={b.roots} stroke={ENCRE} strokeWidth={2.5} fill="none" strokeLinecap="round" />
                  {/* graine (la graine paysanne du centre se DETACHE et descend pendant le silence) */}
                  <g
                    transform={
                      isFallingSeed
                        ? `translate(${40 * seedFall},${180 * seedFall})`
                        : undefined
                    }
                    opacity={isFallingSeed ? clampI(seedFall, [0.85, 1], [1, 0]) : 1}
                  >
                    {/* halo vert qui pulse (l'eveil de la vie, bien visible) */}
                    {seedGlow > 0.01 && (
                      <ellipse
                        cx={0}
                        cy={0}
                        rx={b.rx * 1.5}
                        ry={b.ry * 1.5}
                        fill={VERT}
                        opacity={seedGlow * 0.22}
                      />
                    )}
                    <path
                      d={b.seed}
                      fill={greenLevel > 0.4 ? VERT : CREME}
                      stroke={seedStroke}
                      strokeWidth={4}
                    />
                    <path d={b.veins} stroke={greenLevel > 0.4 ? VERT_D : seedStroke} strokeWidth={1.5} fill="none" />
                  </g>
                </g>
              );
            })}
          </g>

          {/* ---- LA GOUTTE : suspendue dans une cavite au-dessus de la fissure (f235), respire
               pendant la tenue (silence f256-371), puis TOMBE au climax (f500, dropFall). ---- */}
          <g id="la_goutte" opacity={dropIn * (frame < 500 ? 1 : clampI(frame, [500, 540], [1, 0]))}>
            {/* cavite autour de la goutte (reste a sa place initiale) */}
            {frame < 510 && (
              <path
                d="M480,780 C480,750 510,750 510,780 C510,810 480,810 480,780 Z"
                fill={CREME}
                stroke={ENCRE}
                strokeWidth={2}
                strokeDasharray="4 2"
                opacity={dropIn * (frame < 500 ? 1 : clampI(frame, [500, 510], [1, 0]))}
              />
            )}
            {/* la goutte elle-meme (suspendue puis tombe). respiration verticale legere avant la chute */}
            <g
              transform={`translate(${frame < 500 ? 0 : dropX - 495},${
                frame < 500 ? 2 * Math.sin(frame / 13) : dropY - 780
              })`}
            >
              <path
                d="M495,790 C488,790 485,782 485,775 C485,765 495,755 495,755 C495,755 505,765 505,775 C505,782 502,790 495,790 Z"
                fill={frame >= 500 ? VERT : "none"}
                stroke={frame >= 500 ? VERT_D : ENCRE}
                strokeWidth={3}
              />
            </g>
          </g>

          {/* ---- LA POUSSE : perce et VERDIT au climax (f512+, sproutGrow + greenIn). La SEULE
               couleur VIVE. + glow respirant. Reste comme derniere image. ---- */}
          <g id="la_pousse" opacity={1}>
            {/* poche de terre + mottes (le sol qui s'ouvre) */}
            <path
              d="M400,1650 C 400,1520 580,1520 580,1650"
              fill="none"
              stroke={ENCRE}
              strokeWidth={3}
              strokeDasharray="10 5"
              opacity={clampI(frame, [480, 520], [0, 0.8])}
            />
            <path
              d="M450,1650 Q465,1630 480,1650 M495,1650 Q510,1620 530,1650"
              fill="none"
              stroke={ENCRE}
              strokeWidth={4}
              strokeLinecap="round"
              opacity={clampI(frame, [490, 525], [0, 1])}
            />
            {/* la pousse (tige + 3 feuilles), grandit depuis la base (ancre y=1650) */}
            {sproutGrow > 0.01 && (
              <g
                transform={`translate(0,1650) scale(1,${sproutGrow}) translate(0,-1650)`}
                style={{ transformOrigin: "490px 1650px" }}
              >
                {/* glow (cercle flou derriere la pousse, respire) */}
                <circle
                  cx={495}
                  cy={1545}
                  r={95}
                  fill={VERT}
                  opacity={sproutGlow * 0.16}
                />
                {/* tige */}
                <path
                  d="M490,1650 C490,1600 480,1580 500,1530"
                  stroke={sproutColor}
                  strokeWidth={6}
                  fill="none"
                  strokeLinecap="round"
                />
                {/* feuille gauche */}
                <path
                  d="M488,1580 C440,1570 430,1530 445,1520 C465,1510 480,1540 488,1580 Z"
                  fill={greenIn > 0.5 ? VERT : CREME}
                  stroke={sproutColor}
                  strokeWidth={4}
                  strokeLinejoin="round"
                />
                {/* feuille droite */}
                <path
                  d="M495,1560 C530,1540 550,1500 540,1485 C520,1470 500,1510 495,1560 Z"
                  fill={greenIn > 0.5 ? VERT : CREME}
                  stroke={sproutColor}
                  strokeWidth={4}
                  strokeLinejoin="round"
                />
                {/* feuille haut */}
                <path
                  d="M500,1530 C490,1490 510,1460 525,1460 C540,1460 530,1500 500,1530 Z"
                  fill={greenIn > 0.5 ? VERT : CREME}
                  stroke={sproutColor}
                  strokeWidth={4}
                  strokeLinejoin="round"
                />
                {/* nervures */}
                <path
                  d="M488,1580 C470,1560 455,1540 450,1535 M495,1560 C510,1530 525,1500 530,1495 M500,1530 C505,1500 515,1480 520,1470"
                  stroke={greenIn > 0.5 ? VERT_D : ENCRE}
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>

          {/* ---- ⭐⭐ RACINE-VIE QUI REMONTE : une ligne couleur TERRE (#8a5a2c) qui MONTE de la pousse
               verte (bas, y~1530) jusqu'aux arbres du mur (haut, y~560). Se-trace EN MONTANT
               (stroke-dashoffset). Montre la connexion sol->arbres : la vie remonte et fait reverdir
               le mur. C'est le PONT du climax emotionnel (boucler la boucle). ---- */}
          <g id="racine_remonte" opacity={rootIn}>
            {/* halo de la racine (la rend PLUS VISIBLE — demande Aziz) : trace plus epais et clair dessous */}
            <path
              d="M498,1525 C470,1380 520,1250 485,1100 C455,960 510,820 490,680 C480,610 495,575 500,548"
              fill="none"
              stroke={TERRE_VIVE}
              strokeWidth={13}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={DASH}
              strokeDashoffset={rootRise}
              opacity={0.28}
            />
            {/* tronc de racine principal (de la pousse vers la surface, serpente le long de la fissure) */}
            <path
              d="M498,1525 C470,1380 520,1250 485,1100 C455,960 510,820 490,680 C480,610 495,575 500,548"
              fill="none"
              stroke={TERRE_VIVE}
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={DASH}
              strokeDashoffset={rootRise}
            />
            {/* ramifications laterales (la vie se diffuse vers les arbres voisins) — se tracent ensuite */}
            <path
              d="M490,680 C400,660 280,620 150,560 M495,575 C620,560 760,545 930,548 M485,1100 C560,1080 640,1090 700,1060 M520,1250 C440,1235 360,1245 300,1215"
              fill="none"
              stroke={TERRE_VIVE}
              strokeWidth={4.5}
              strokeLinecap="round"
              strokeDasharray={DASH}
              strokeDashoffset={clampI(frame, [548, 582], [DASH, 0])}
              opacity={0.95}
            />
          </g>
        </g>
        {/* ============ /MONDE ============ */}
      </svg>

      {/* ============ SOUS-TITRES KARAOKE (bas centre, zone safe) ============ */}
      {activePhrase && subOpacity > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1660,
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
              background: "rgba(232,220,192,0.78)",
              border: "1px solid rgba(43,33,23,0.18)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 37,
              lineHeight: 1.3,
              textAlign: "center",
              textWrap: "balance",
            }}
          >
            {activePhrase.words.map((w, i) => {
              const spoken = narrationSec >= w.start;
              const active =
                narrationSec >= w.start && narrationSec <= w.end + 0.12;
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
    </AbsoluteFill>
  );
};

export default B6Outro;
