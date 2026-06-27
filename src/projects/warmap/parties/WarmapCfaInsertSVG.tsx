/**
 * WarmapCfaInsertSVG — SVG-insert "franc CFA" (War-Map Sahel AES), 16:9 1920x1080 @30fps.
 *
 * PHASE 2 (animation A->Z) de la cible validee par Aziz :
 *   out/_r-and-d/cfa-svg/CIBLE-FINALE-cfa-16x9.svg (version C "mix").
 * La cible SVG est inlinee en GROUPES NOMMES, chacun anime par frame (useCurrentFrame + spring/interpolate).
 * BLOC ISOLE pour comparatif futur — ne touche PAS aux fichiers de prod (Partie4Cout, moteur, p4-cfa).
 *
 * Audio segment narration-v5 : f11861->f12166 absolu = L0->L305 (~10.17s) + tail de respiration -> 330f.
 * Texte VO : « celle du franc CFA. Cette monnaie commune, toujours liee a Paris, circule encore dans les
 * trois pays, et rompre avec elle serait sans doute leur prochaine grande decision. »
 *
 * Choregraphie / colorisation / SFX : cf. brief Phase 2 (frames LOCALES @30fps). Aucune rupture accomplie
 * (l'AES n'a pas encore rompu — FACTS-CFA-2026). INTERDIT : CSS transition / setTimeout / @keyframes / rAF.
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  staticFile,
} from "remotion";

const FPS = 30;
const SEG_START_ABS = 11861; // f absolu du 1er mot ("franc")
const SEG_END_ABS = 12166; // f absolu de fin de "decision."
const TAIL = 25; // respiration finale
export const WARMAP_CFA_INSERT_FRAMES = SEG_END_ABS - SEG_START_ABS + TAIL; // 305 + 25 = 330

// ---- couleurs (cf. brief colorisation) ----
const ENCRE = "#4A2E1B";
const PARCHEMIN = "#F4EFE6";
const OR_CLAIR = "#E2B665";
const OR_SOMBRE = "#D4A352";
const ROUGE_SANG = "#8B1C1C";

// ---- helpers (zero CSS transition, tout via frame) ----
const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** tracage stroke : dashoffset interpole 1->0 = le trait se dessine */
const draw = (f: number, start: number, dur: number, dash = 1600): React.CSSProperties => ({
  strokeDasharray: dash,
  strokeDashoffset: dash * clampI(f, start, start + dur, 1, 0),
});

const Grp: React.FC<{
  id?: string;
  body: string;
  transform?: string;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ id, body, transform, opacity, style }) => (
  <g id={id} transform={transform} opacity={opacity} style={style} dangerouslySetInnerHTML={{ __html: body }} />
);

/* =======================================================================
   SVG INLINE — groupes nommes (copie de CIBLE-FINALE-cfa-16x9.svg).
   Chaque constante = le contenu d'un <g>. Le texte CFA gere a part (colorise).
   ======================================================================= */

// surfaces colorisables (sous le trait) — collines + or de la piece + corps cadenas + cartouches
const C_COLLINE1 = `<path d="M 0 1080 L 0 950 Q 250 820 550 950 L 550 1080 Z" fill="#E8DEC9" />`;
const C_COLLINE3 = `<path d="M 1450 1080 L 1450 950 Q 1700 820 1920 950 L 1920 1080 Z" fill="#E8DEC9" />`;
const C_COLLINE2 = `<path d="M 350 1080 L 350 920 Q 1050 780 1650 920 L 1650 1080 Z" fill="#DCCEB8" />`;
const C_PIECE_BASE = `<circle cx="1080" cy="560" r="280" fill="${OR_CLAIR}" />`;
const C_PIECE_CENTRE = `<circle cx="1080" cy="560" r="250" fill="${OR_SOMBRE}" />`;
const C_CADENAS_CORPS = `<rect x="935" y="410" width="290" height="250" rx="20" fill="#331F14" />`;
// EPURE (Aziz 2026-06-27) : UN seul cartouche, centre AU-DESSUS de la piece (x=1080, y~178), elargi (texte rentre).
const C_CARTOUCHE_HAUT = `<path d="M 838 146 L 1322 146 L 1350 180 L 1322 214 L 838 214 L 810 180 Z" fill="#E8DEC9" />`;

const ORNEMENTS = `
  <rect x="30" y="30" width="1860" height="1020" fill="none" stroke="${ENCRE}" stroke-width="6" />
  <rect x="45" y="45" width="1830" height="990" fill="none" stroke="${ENCRE}" stroke-width="2" stroke-dasharray="12 12" />
  <path d="M 80 50 L 80 110 M 50 80 L 110 80" stroke="${ENCRE}" stroke-width="3" />
  <path d="M 1840 50 L 1840 110 M 1810 80 L 1870 80" stroke="${ENCRE}" stroke-width="3" />
  <path d="M 80 970 L 80 1030 M 50 1000 L 110 1000" stroke="${ENCRE}" stroke-width="3" />
  <path d="M 1840 970 L 1840 1030 M 1810 1000 L 1870 1000" stroke="${ENCRE}" stroke-width="3" />
  <g opacity="0.13" stroke="${ENCRE}" stroke-width="2" fill="none">
    <circle cx="320" cy="200" r="150" stroke-dasharray="6 12" />
    <circle cx="320" cy="200" r="250" stroke-dasharray="6 18" />
    <circle cx="1080" cy="560" r="380" stroke-dasharray="10 20" />
    <circle cx="1080" cy="560" r="520" stroke-dasharray="10 30" />
  </g>`;

// cartouche fait (cadre unique, au-dessus de la piece) — trace/fade independant
const CARTOUCHE_CADRES = `
  <path d="M 838 146 L 1322 146 L 1350 180 L 1322 214 L 838 214 L 810 180 Z" fill="none" stroke="${ENCRE}" stroke-width="4" />
  <path d="M 848 156 L 1312 156 L 1337 180 L 1312 204 L 848 204 L 823 180 Z" fill="none" stroke="${ENCRE}" stroke-width="1.5" stroke-dasharray="4 4" />`;

const SOL = `
  <path d="M 0 950 Q 250 820 550 950" fill="none" stroke="${ENCRE}" stroke-width="5" stroke-linecap="round" />
  <path d="M 1450 950 Q 1700 820 1920 950" fill="none" stroke="${ENCRE}" stroke-width="5" stroke-linecap="round" />
  <path d="M 350 920 Q 1050 780 1650 920" fill="none" stroke="${ENCRE}" stroke-width="7" stroke-linecap="round" />
  <path d="M 400 950 Q 1050 820 1600 950" fill="none" stroke="${ENCRE}" stroke-width="2" stroke-dasharray="12 12" opacity="0.6" />
  <path d="M 450 980 Q 1050 860 1550 980" fill="none" stroke="${ENCRE}" stroke-width="2" stroke-dasharray="8 16" opacity="0.4" />`;

// racines — chaque path tracee separement (cascade). Decoupe en 5 racines principales + 2 radicelles.
const RACINES_PATHS = [
  `<path d="M 1080 835 Q 1080 935 1080 1005" fill="none" stroke="${ENCRE}" stroke-width="14" stroke-linecap="round" opacity="0.92" />`,
  `<path d="M 1080 835 Q 1055 925 995 985" fill="none" stroke="${ENCRE}" stroke-width="11" stroke-linecap="round" opacity="0.9" />`,
  `<path d="M 1080 835 Q 1115 925 1180 985" fill="none" stroke="${ENCRE}" stroke-width="11" stroke-linecap="round" opacity="0.9" />`,
  `<path d="M 1080 835 Q 1000 905 920 950" fill="none" stroke="${ENCRE}" stroke-width="7" stroke-linecap="round" opacity="0.75" />`,
  `<path d="M 1080 835 Q 1160 905 1240 950" fill="none" stroke="${ENCRE}" stroke-width="7" stroke-linecap="round" opacity="0.75" />`,
  `<path d="M 1040 920 Q 1020 945 1000 965" fill="none" stroke="${ENCRE}" stroke-width="3" stroke-linecap="round" opacity="0.55" />`,
  `<path d="M 1120 920 Q 1140 945 1160 965" fill="none" stroke="${ENCRE}" stroke-width="3" stroke-linecap="round" opacity="0.55" />`,
];

const PIECE = `
  <circle cx="1080" cy="560" r="280" fill="none" stroke="${ENCRE}" stroke-width="8" />
  <circle cx="1080" cy="560" r="270" fill="none" stroke="${ENCRE}" stroke-width="20" stroke-dasharray="6 12" />
  <circle cx="1080" cy="560" r="250" fill="none" stroke="${ENCRE}" stroke-width="4" />
  <circle cx="1080" cy="560" r="240" fill="none" stroke="${ENCRE}" stroke-width="1" stroke-dasharray="4 8" />
  <g opacity="0.35" stroke="${ENCRE}" stroke-width="2">
    <line x1="1080" y1="320" x2="1080" y2="800" />
    <line x1="840" y1="560" x2="1320" y2="560" />
    <line x1="910" y1="390" x2="1250" y2="730" />
    <line x1="910" y1="730" x2="1250" y2="390" />
  </g>`;

// crenelage = anneau dash (3e cercle) — anime separement pour le "se grave" L0-L8
const PIECE_CRENELAGE = `<circle cx="1080" cy="560" r="270" fill="none" stroke="${ENCRE}" stroke-width="20" stroke-dasharray="6 12" />`;
const PIECE_ANNEAUX = `
  <circle cx="1080" cy="560" r="280" fill="none" stroke="${ENCRE}" stroke-width="8" />
  <circle cx="1080" cy="560" r="250" fill="none" stroke="${ENCRE}" stroke-width="4" />
  <circle cx="1080" cy="560" r="240" fill="none" stroke="${ENCRE}" stroke-width="1" stroke-dasharray="4 8" />
  <g opacity="0.35" stroke="${ENCRE}" stroke-width="2">
    <line x1="1080" y1="320" x2="1080" y2="800" />
    <line x1="840" y1="560" x2="1320" y2="560" />
    <line x1="910" y1="390" x2="1250" y2="730" />
    <line x1="910" y1="730" x2="1250" y2="390" />
  </g>`;

const PARIS = `
  <path d="M 200 150 L 410 150 L 432 182 L 410 214 L 200 214 L 178 182 Z" fill="${PARCHEMIN}" stroke="${ENCRE}" stroke-width="5" />
  <path d="M 212 162 L 398 162 L 415 182 L 398 202 L 212 202 L 195 182 Z" fill="none" stroke="${ENCRE}" stroke-width="1.5" stroke-dasharray="4 4" />`;

const FLEUR_DE_LYS = `
  <g transform="translate(305, 95) scale(1.0)">
    <path d="M 0 -40 Q 20 10 0 40 Q -20 10 0 -40 Z" fill="${ENCRE}" />
    <path d="M -5 0 Q -40 0 -50 25 Q -25 40 -5 25 Z" fill="${ENCRE}" />
    <path d="M 5 0 Q 40 0 50 25 Q 25 40 5 25 Z" fill="${ENCRE}" />
    <rect x="-15" y="25" width="30" height="8" rx="3" fill="${ROUGE_SANG}" />
    <path d="M 0 35 L -10 52 L 10 52 Z" fill="${ENCRE}" />
  </g>`;

// chaine = liste de maillons (profil/face) le long de la diagonale Paris -> cadenas, traces en cascade
const CHAINE_MAILLONS = [
  `<line x1="305" y1="230" x2="360" y2="240" stroke="${ENCRE}" stroke-width="22" stroke-linecap="round" />`,
  `<ellipse cx="395" cy="247" rx="20" ry="32" fill="none" stroke="${ENCRE}" stroke-width="16" transform="rotate(80 395 247)" />`,
  `<line x1="430" y1="254" x2="490" y2="265" stroke="${ENCRE}" stroke-width="22" stroke-linecap="round" />`,
  `<ellipse cx="525" cy="272" rx="20" ry="32" fill="none" stroke="${ENCRE}" stroke-width="16" transform="rotate(80 525 272)" />`,
  `<line x1="560" y1="278" x2="620" y2="289" stroke="${ENCRE}" stroke-width="22" stroke-linecap="round" />`,
  `<ellipse cx="655" cy="296" rx="20" ry="32" fill="none" stroke="${ENCRE}" stroke-width="16" transform="rotate(80 655 296)" />`,
  `<line x1="690" y1="302" x2="745" y2="312" stroke="${ENCRE}" stroke-width="22" stroke-linecap="round" />`,
  // (maillon 8 = rupture, groupe dedie)
  `<ellipse cx="915" cy="343" rx="20" ry="32" fill="none" stroke="${ENCRE}" stroke-width="16" transform="rotate(80 915 343)" />`,
  `<line x1="950" y1="349" x2="1005" y2="359" stroke="${ENCRE}" stroke-width="22" stroke-linecap="round" />`,
];

// maillon de rupture (sous-elements animes individuellement)
const RUPTURE_MAILLON = `<ellipse cx="820" cy="327" rx="20" ry="34" fill="none" stroke="${ROUGE_SANG}" stroke-width="18" stroke-linecap="round" transform="rotate(80 820 327)" />`;
const RUPTURE_FISSURE = `<polyline points="808 312 822 322 813 332 830 344" fill="none" stroke="${PARCHEMIN}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />`;
const RUPTURE_FORCES = `
  <line x1="760" y1="327" x2="790" y2="327" stroke="${ROUGE_SANG}" stroke-width="5" stroke-linecap="round" />
  <line x1="850" y1="327" x2="880" y2="327" stroke="${ROUGE_SANG}" stroke-width="5" stroke-linecap="round" />`;

const CLE = `
  <line x1="245" y1="214" x2="245" y2="262" stroke="${ENCRE}" stroke-width="3" stroke-dasharray="3 4" opacity="0.6" />
  <circle cx="245" cy="276" r="13" fill="none" stroke="${ENCRE}" stroke-width="6" />
  <path d="M 245 292 C 272 292 290 310 290 328 C 290 346 264 356 245 356 C 226 356 200 346 200 328 C 200 310 218 292 245 292 Z" fill="${OR_SOMBRE}" stroke="${ENCRE}" stroke-width="7" />
  <circle cx="245" cy="326" r="9" fill="${PARCHEMIN}" stroke="${ENCRE}" stroke-width="4" />
  <line x1="245" y1="356" x2="245" y2="462" stroke="${ENCRE}" stroke-width="13" stroke-linecap="round" />
  <path d="M 245 418 L 290 418 L 290 458 L 272 458 L 272 440 L 281 440 L 281 431 L 245 431 Z" fill="${ENCRE}" />`;

// cadenas : armature/corps en encre + trou de serrure separe (colorise rouge a "rompre")
const CADENAS_CORPS = `
  <path d="M 1000 410 V 305 C 1000 248 1160 248 1160 305 V 410" fill="none" stroke="${ENCRE}" stroke-width="26" />
  <path d="M 1000 410 V 305 C 1000 248 1160 248 1160 305 V 410" fill="none" stroke="#8B6D55" stroke-width="10" />
  <rect x="935" y="410" width="290" height="250" rx="20" fill="none" stroke="${ENCRE}" stroke-width="14" />
  <rect x="955" y="430" width="250" height="210" rx="10" fill="none" stroke="${ENCRE}" stroke-width="4" />
  <rect x="925" y="415" width="310" height="34" rx="8" fill="${ENCRE}" />
  <rect x="925" y="621" width="310" height="34" rx="8" fill="${ENCRE}" />
  <circle cx="945" cy="432" r="6" fill="${PARCHEMIN}" opacity="0.5" />
  <circle cx="1215" cy="432" r="6" fill="${PARCHEMIN}" opacity="0.5" />
  <circle cx="945" cy="638" r="6" fill="${PARCHEMIN}" opacity="0.5" />
  <circle cx="1215" cy="638" r="6" fill="${PARCHEMIN}" opacity="0.5" />`;
const CADENAS_SERRURE = `<path d="M 1080 478 A 24 24 0 1 0 1056 517 L 1047 585 L 1113 585 L 1104 517 A 24 24 0 0 0 1080 478 Z" fill="${ROUGE_SANG}" stroke="#1A0F0A" stroke-width="6" stroke-linejoin="round" />`;

// textes gravures (CFA gere a part pour le glow). PARIS / cartouches data.
const TXT_PARIS = `<text x="305" y="195" font-family="'Times New Roman', Times, serif" font-size="32" font-weight="bold" fill="${ENCRE}" text-anchor="middle" letter-spacing="6">PARIS</text>`;
// EPURE (Aziz 2026-06-27) : un seul cartouche, AU-DESSUS de la piece (centre x=1080). Garantie retiree.
const TXT_TAUX = `<text x="1080" y="190" font-family="'Times New Roman', Times, serif" font-size="40" font-weight="bold" fill="${ENCRE}" text-anchor="middle" letter-spacing="2">1 EURO = ~656 FCFA</text>`;

/* =======================================================================
   KARAOKE — mots LOCAUX (alignement indices 1934-1988, local = abs - 11861)
   start/end en SECONDES locales (frame/30). Accents FR conserves.
   ======================================================================= */
type Word = { word: string; start: number; end: number };
const W = (word: string, sf: number, ef: number): Word => ({ word, start: sf / FPS, end: ef / FPS });
// frames LOCALES (depuis le tableau d'alignement). "celle du" arrive juste avant le segment (L-13..L0).
const WORDS: Word[] = [
  W("celle", -13, -6),
  W("du", -5, -3),
  W("franc", 0, 6),
  W("CFA.", 8, 21),
  W("Cette", 54, 60),
  W("monnaie", 62, 69),
  W("commune,", 71, 90),
  W("toujours", 90, 101),
  W("liée", 102, 108),
  W("à", 110, 112),
  W("Paris,", 113, 137),
  W("circule", 139, 149),
  W("encore", 150, 158),
  W("dans", 159, 162),
  W("les", 163, 167),
  W("trois", 168, 175),
  W("pays,", 176, 184),
  W("et", 202, 205),
  W("rompre", 206, 215),
  W("avec", 216, 224),
  W("elle", 226, 230),
  W("serait", 234, 242),
  W("sans", 245, 249),
  W("doute", 249, 255),
  W("leur", 257, 262),
  W("prochaine", 263, 277),
  W("grande", 278, 287),
  W("décision.", 288, 305),
];
// PHRASE_BREAKS = index du 1er mot de chaque nouvelle phrase affichee (segmentation lisible, pas par silence).
// 4 segments : [celle du franc CFA.] [Cette monnaie commune, toujours liee a Paris,]
//              [circule encore dans les trois pays,] [et rompre... grande decision.]
const PHRASE_BREAKS = [4, 11, 17];
type Phrase = { words: Word[]; start: number; end: number };
const buildPhrases = (words: Word[]): Phrase[] => {
  const phrases: Phrase[] = [];
  let cur: Word[] = [];
  for (let i = 0; i < words.length; i++) {
    if (PHRASE_BREAKS.includes(i) && cur.length) {
      phrases.push({ words: [...cur], start: cur[0].start, end: cur[cur.length - 1].end });
      cur = [];
    }
    cur.push(words[i]);
  }
  if (cur.length) phrases.push({ words: [...cur], start: cur[0].start, end: cur[cur.length - 1].end });
  return phrases;
};
const PHRASES = buildPhrases(WORDS);

/* ======================================================================= */

export const WarmapCfaInsertSVG: React.FC = () => {
  const f = useCurrentFrame(); // f LOCAL (0 = "franc")
  const { fps } = useVideoConfig();
  const t = f / fps; // secondes locales (pour karaoke)

  /* ---- AMBIANT (continu) : la piece respire (oscillation douce ±1.2%) ---- */
  const breathe = 1 + 0.012 * Math.sin((f - 9) / (2 * fps) * Math.PI * 2);

  /* ---- L0-L8 : la piece CFA se GRAVE (spring scale depuis le centre) + crenelage se trace ---- */
  const graveSpring = spring({ frame: f, fps, config: { damping: 11, stiffness: 120 }, durationInFrames: 14 });
  const pieceScale = 0.4 + 0.6 * graveSpring; // 0.4 -> 1.0
  const orOp = clampI(f, 0, 8); // l'or arrive des L0-L8 (= valeur metal)
  const anneauxOp = clampI(f, 0, 6);
  const crenelageStyle = draw(f, 2, 10, 1750); // crenelage se trace

  /* ---- L54-L71 : cartouches data se tracent/fade-in + cadenas settle (1 cran) ---- */
  const cartoucheOp = clampI(f, 54, 71);
  const tauxOp = clampI(f, 56, 72);
  const cadenasSettle = spring({ frame: f - 54, fps, config: { damping: 14, stiffness: 90 }, durationInFrames: 16 });
  const cadenasPresence = 0.55 + 0.45 * (f >= 54 ? cadenasSettle : 0);

  /* ---- L87-L113 : "toujours liee a Paris" — Paris+lys s'affirment, cle apparait, chaine se TRACE ---- */
  const parisOp = clampI(f, 87, 105);
  const lysSpring = spring({ frame: f - 90, fps, config: { damping: 12, stiffness: 130 }, durationInFrames: 18 });
  const lysScale = f >= 90 ? 0.6 + 0.4 * lysSpring : 0;
  const lysOp = clampI(f, 90, 105);
  const cleOp = clampI(f, 95, 115);
  const parisTxtOp = clampI(f, 90, 105);
  // chaine : maillons traces en cascade de Paris (L92) vers le cadenas (~L130). 9 maillons.
  const chaineStart = 92;
  const chainePerMaillon = 4.2;
  // snap a l'arrivee : leger pop du dernier maillon
  const chaineSnap = spring({ frame: f - (chaineStart + 9 * chainePerMaillon), fps, config: { damping: 8, stiffness: 220 }, durationInFrames: 10 });

  /* ---- L139-L176 : "circule dans les trois pays" — collines en cascade + racines se tracent + piece PULSE ---- */
  const colline2Op = clampI(f, 139, 158); // colline centrale d'abord (la plus grande)
  const colline1Op = clampI(f, 151, 170);
  const colline3Op = clampI(f, 163, 182);
  // teinte terre : les collines passent de pale a chaud (renforcement opacite couleur)
  const collineWarm = clampI(f, 145, 185, 0.7, 1);
  // racines se tracent vers le sol (cascade), demarrage ~L145
  const racineStart = 145;
  const racinePerPath = 4.5;
  // piece PULSE une fois (scale 1 -> 1.03 -> 1) autour de L165
  const pulse = f >= 160 && f <= 178 ? 0.03 * Math.sin(clampI(f, 160, 178, 0, 1) * Math.PI) : 0;

  /* ---- L206-L226 : "rompre avec elle" — TENSION sur le maillon de rupture (NE BRISE PAS) ---- */
  const tensionOn = clampI(f, 206, 226);
  // vibration translate ±3px (s'apaise apres L226 jusque ~L263)
  const vibAmp = interpolate(f, [206, 226, 263], [0, 3, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vibX = vibAmp * Math.sin(f * 1.9);
  const vibY = vibAmp * 0.5 * Math.cos(f * 2.3);
  const glow1Op = interpolate(f, [206, 226, 330], [0, 0.28, 0.22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow2Op = interpolate(f, [206, 226, 330], [0, 0.36, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const maillonRougeOp = clampI(f, 200, 222); // le maillon faible passe en rouge sang quand on dit "rompre"
  // fissure naissante : se trace a "rompre" puis FIGEE a mi-course (ne se complete jamais)
  const fissureStyle = draw(f, 210, 30, 120);
  const fissureFreeze = clampI(f, 210, 248, 0, 0.5); // s'arrete a 50% (figee mi-course)
  const fissureOp = clampI(f, 210, 224);
  // trou de serrure du cadenas vire au rouge plus intense au mot "rompre"
  const serrureGlow = 0.85 + 0.15 * (f >= 206 ? Math.sin((f - 206) / 8) * clampI(f, 206, 240) : 0);

  /* ---- L263-L330 : PLATEAU suspendu. Vibration apaisee, maillon TIENT, fissure figee. Question ouverte. ---- */
  // (tout en ease-out via interpolate ci-dessus; respiration lente continue via breathe)

  /* ---- karaoke phrase active ---- */
  const activePhrase = PHRASES.find((p) => t >= p.start - 0.25 && t <= p.end + 0.5);
  const subOpacity = activePhrase
    ? clampI(t, activePhrase.start - 0.2, activePhrase.start + 0.1) *
      clampI(t, activePhrase.end + 0.15, activePhrase.end + 0.45, 1, 0)
    : 0;
  // tail : fondu doux global du tout petit a la fin (juste les sous-titres se retirent)
  const endFade = clampI(f, WARMAP_CFA_INSERT_FRAMES - 12, WARMAP_CFA_INSERT_FRAMES - 2, 1, 0);

  return (
    <AbsoluteFill style={{ backgroundColor: PARCHEMIN }}>
      {/* === AUDIO segment narration (synchrone) === */}
      <Audio
        src={staticFile("_shared/audio/sahel-warmap/narration-v5-expressive.mp3")}
        startFrom={SEG_START_ABS}
        endAt={SEG_END_ABS + TAIL}
      />

      {/* === SFX sobres (sous la voix) === */}
      {/* ping/clic a la gravure de la piece (L0) */}
      <Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} startFrom={0} volume={0.4} />
      {/* leger ink/whoosh au tracage de la chaine (L87) */}
      <Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} startFrom={0} playbackRate={1} volume={(fr) => clampI(fr, 86, 92, 0, 0.32) * clampI(fr, 120, 135, 1, 0)} />
      {/* tension-drone bas montant vers "rompre" (L206), pas de SFX de rupture (le maillon tient) */}
      <Audio src={staticFile("_shared/sfx/warmap/tension-drone.mp3")} startFrom={0} volume={(fr) => interpolate(fr, [188, 226, 300, 330], [0, 0.3, 0.22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {/* ============ COULEURS (surfaces colorisables, sous le trait) ============ */}
        {/* collines : s'allument en cascade L139-L176, teinte terre renforcee */}
        <g opacity={collineWarm}>
          <Grp body={C_COLLINE2} opacity={colline2Op} />
          <Grp body={C_COLLINE1} opacity={colline1Op} />
          <Grp body={C_COLLINE3} opacity={colline3Op} />
        </g>
        {/* or de la piece (= valeur metal, des L0-L8) — suit le scale de gravure */}
        <g
          transform={`translate(1080 560) scale(${pieceScale * breathe * (1 + pulse)}) translate(-1080 -560)`}
        >
          <Grp body={C_PIECE_BASE} opacity={orOp} />
          <Grp body={C_PIECE_CENTRE} opacity={orOp} />
        </g>
        {/* corps cadenas (encre sombre) + cartouches data (parchemin sous le trait) */}
        <Grp body={C_CADENAS_CORPS} opacity={cadenasPresence * 0.9} />
        <Grp body={C_CARTOUCHE_HAUT} opacity={cartoucheOp} />

        {/* ============ ORNEMENTS (cadre War-Map) — present des le debut, fade-in rapide ============ */}
        <Grp body={ORNEMENTS} opacity={clampI(f, 0, 14, 0.0, 1)} />

        {/* ============ SOL (3 reliefs) — fade-in avec les collines ============ */}
        <Grp body={SOL} opacity={clampI(f, 130, 160)} />

        {/* ============ PIECE CFA (trait) — se grave L0-L8 (scale + crenelage), respire ensuite ============ */}
        <g
          transform={`translate(1080 560) scale(${pieceScale * breathe * (1 + pulse)}) translate(-1080 -560)`}
        >
          <Grp body={PIECE_ANNEAUX} opacity={anneauxOp} />
          <g opacity={anneauxOp} style={crenelageStyle} dangerouslySetInnerHTML={{ __html: PIECE_CRENELAGE }} />
          {/* texte CFA grave RETIRE (epure, decision Aziz 2026-06-27) : le cadenas le masquait + inutile. */}
        </g>

        {/* ============ RACINES — se tracent en cascade vers le sol (L145+) ============ */}
        {RACINES_PATHS.map((p, i) => (
          <g
            key={`rac-${i}`}
            style={draw(f, racineStart + i * racinePerPath, 22, 360)}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}

        {/* ============ CARTOUCHES data (cadres + textes) ============ */}
        <Grp body={CARTOUCHE_CADRES} opacity={cartoucheOp} />
        <Grp body={TXT_TAUX} opacity={tauxOp} />

        {/* ============ PARIS + FLEUR DE LYS + texte PARIS ============ */}
        <Grp body={PARIS} opacity={parisOp} />
        <g opacity={lysOp} transform={`translate(305 95) scale(${lysScale}) translate(-305 -95)`}>
          <g dangerouslySetInnerHTML={{ __html: FLEUR_DE_LYS }} />
        </g>
        <Grp body={TXT_PARIS} opacity={parisTxtOp} />

        {/* ============ CLE (pendue sous Paris, hors de portee) ============ */}
        <Grp body={CLE} opacity={cleOp} />

        {/* ============ CHAINE — maillons traces en cascade Paris -> cadenas (L92+) ============ */}
        {CHAINE_MAILLONS.map((m, i) => {
          const isLast = i === CHAINE_MAILLONS.length - 1;
          const localSnap = isLast && f >= chaineStart + 9 * chainePerMaillon ? 1 + 0.12 * (1 - chaineSnap) : 1;
          return (
            <g
              key={`mail-${i}`}
              style={draw(f, chaineStart + i * chainePerMaillon, 8, 120)}
              transform={isLast ? `translate(977 359) scale(${localSnap}) translate(-977 -359)` : undefined}
              dangerouslySetInnerHTML={{ __html: m }}
            />
          );
        })}

        {/* ============ CADENAS (corps trait + serrure rouge) ============ */}
        <Grp body={CADENAS_CORPS} opacity={cadenasPresence} />
        <Grp body={CADENAS_SERRURE} opacity={cadenasPresence * serrureGlow} />

        {/* ============ MAILLON DE RUPTURE — tension a "rompre", NE SE BRISE PAS ============ */}
        <g transform={`translate(${vibX} ${vibY})`}>
          {/* halos de tension */}
          <circle cx={820} cy={327} r={70} fill={ROUGE_SANG} opacity={glow1Op} />
          <circle cx={820} cy={327} r={45} fill={ROUGE_SANG} opacity={glow2Op} />
          {/* lignes de force d'etirement */}
          <Grp body={RUPTURE_FORCES} opacity={tensionOn} />
          {/* le maillon faible (rouge sang) — TIENT */}
          <Grp body={RUPTURE_MAILLON} opacity={maillonRougeOp} />
          {/* fissure naissante : tracee mi-course puis FIGEE (jamais complete) */}
          <g
            opacity={fissureOp}
            style={{ strokeDasharray: 120, strokeDashoffset: 120 * (1 - fissureFreeze) }}
            dangerouslySetInnerHTML={{ __html: RUPTURE_FISSURE }}
          />
        </g>
      </svg>

      {/* ============ SOUS-TITRES KARAOKE (bas centre, zone safe Y>=850) ============ */}
      {activePhrase && subOpacity > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 890,
            display: "flex",
            justifyContent: "center",
            opacity: subOpacity * endFade,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              maxWidth: 1300,
              margin: "0 100px",
              padding: "16px 40px",
              borderRadius: 16,
              background: "rgba(232,220,192,0.78)",
              border: "1px solid rgba(43,33,23,0.18)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 40,
              lineHeight: 1.3,
              textAlign: "center",
              textWrap: "balance",
            }}
          >
            {activePhrase.words.map((w, i) => {
              const spoken = t >= w.start;
              const active = t >= w.start && t <= w.end + 0.12;
              // "rompre" prend la touche ROUGE SANG (couleur-diagnostic, raccord visuel avec la rupture)
              const isRompre = w.word.startsWith("rompre");
              const activeColor = isRompre ? ROUGE_SANG : "#7A4A1E";
              return (
                <span
                  key={i}
                  style={{
                    color: active ? activeColor : ENCRE,
                    opacity: spoken ? 1 : 0.42,
                    fontWeight: spoken ? 800 : 600,
                    marginRight: 11,
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

export default WarmapCfaInsertSVG;
