/**
 * B5LaPreuve — Beat 5 GGW "LA PREUVE" (registre ENCRE NARRATIVE, anime).
 *
 * SUJET (FMNR pur, sans eau) : LA PREUVE que la regeneration naturelle (FMNR) marche a grande echelle.
 *   Au Niger, 200 millions d'arbres sont REVENUS (pas plantes — regeneres depuis les souches vivantes,
 *   suite du Beat 4) pour presque rien. Et avec eux reviennent l'OMBRE, des SOLS VIVANTS, et les RECOLTES
 *   qui repartent. ⛔ PLUS DE PUITS, PLUS DE CUVETTE demi-lune, PLUS DE filets d'eau, PLUS de "+17m" : ces
 *   elements relevaient d'une AUTRE technique (la demi-lune qui capte la pluie = Beat 4) et etaient
 *   factuellement faux pour ce beat. Le heros = LES ARBRES qui reviennent en nombre + ce qu'ils ramenent.
 *
 * INTENTION : PROUVER que ca marche a grande echelle. CLIMAX POSITIF (l'espoir chiffre, concret). Bascule
 *   vers l'ABONDANCE (la vie qui revient en masse : arbres -> sol vivant -> recoltes). Verbe : REVERDIR.
 *
 * GRAMMAIRE (identique hook + B2 + B3) : spring pop (la pousse jaillit) / stroke-dashoffset (se-dessine) /
 *   cross-fade opacite (encre <-> couleur) ; clamp partout, frame-driven uniquement (zero CSS transition/
 *   keyframes/setTimeout) ; scene SVG frontale FIXE (acquis #5 : pas de translate global qui fait valser).
 *
 * COULEUR — climax POSITIF d'ABONDANCE : le VERT VIE (#3e8f34) est le heros et entre GENEREUSEMENT (la
 *   preuve que ca marche). On garde une legere progression : arbres d'abord (vert) -> sol vivant (vert-terre,
 *   herbe) -> recoltes (vert-dore). Pas de munition gardee comme ailleurs : ici on assume l'abondance.
 *
 * CHOREGRAPHIE (cale sur l'audio reel, frames @30fps relatives au beat ; 424 frames / 14.118s) :
 *   - f3-24   "Le resultat ?" : installation, le sol encre + des souches qui attendent (continuite Beat 4).
 *   - f53-136 "Au Niger, deux cents millions d'arbres sont revenus." : DES ARBRES REVERDISSENT EN CASCADE
 *             g->centre->d + des silhouettes a l'horizon qui verdissent (suggere le NOMBRE/l'etendue, PAS un
 *             compteur). Le VERT entre. (modele B2/B3 TreeTrunk+LeafyCrown+Roots, encre->vert)
 *   - f153-190 "Pas plantes. Revenus." : on insiste sur la SOUCHE -> rejet -> arbre (revenus du vieux bois,
 *             pas plantes) ; les racines/souches restent visibles, virent en ocre-terre (ancre dans le sol).
 *   - f230-257 "Pour presque rien." : sobriete (cout derisoire) — pas de billet ; le geste reste sur les arbres.
 *   - f289-365 "Et avec eux, l'ombre, des sols vivants" : l'OMBRE douce apparait sous les arbres + le SOL mort
 *             passe en vert-terre vivant (herbe qui pousse au sol).
 *   - f377-421 "et les recoltes qui repartent." : des EPIS/cultures poussent au pied des arbres (vert-dore) =
 *             l'agriculture repart. CLIMAX d'abondance. Derniere image : terre vivante (arbres+sol+recoltes).
 *
 * Composition 1080x1920 (9:16), 424 frames @30fps (14.118s). Audio Beat 5 inclus.
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
// JAUNE SOLEIL — le soleil colore en jaune (les rayons tournent, on ajoute la couleur)
const JAUNE = "#e8b44a";
const JAUNE_D = "#b5862b";
// OCRE TERRE — les racines/souches virent en ocre apres le verdissement (couleur "terre" du short)
const OCRE_TERRE = "#b5651d";
// VERT VIE (heros du beat) — la regeneration naturelle
const VERT = "#3e8f34"; // vert vif (apogee vegetal)
const VERT_D = "#295c1c";
const VERT_TENDRE = "#6fa85a"; // vert tendre (jaillissement initial des pousses)
const VERT_TENDRE_D = "#4f7e3f";
// VERT-TERRE (sol vivant) — un vert un peu plus terreux pour le sol qui reverdit
const SOL_VIVANT = "#5e8a3a";
// VERT-DORE (les recoltes / epis) — l'agriculture qui repart
const DORE = "#c9a13b";
const DORE_D = "#977418";

// grande valeur de dash pour le se-dessine (longueurs de path inconnues -> sur-dimensionne + clamp)
const DASH = 4200;

const clampI = (
  f: number,
  inR: [number, number],
  outR: [number, number]
) =>
  interpolate(f, inR, outR, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/* ---------- SOUS-TITRES KARAOKE mot-a-mot (acquis #7, pattern B2/B3) ----------
   start/end = SECONDES (beat-relatif, 30fps, 424 frames) issus de beat5.alignment.json.
   Chiffres EN LETTRES ("deux cents millions"). Accents FR conserves. */
type Word = { word: string; start: number; end: number };
const B5_WORDS: Word[] = [
  { word: "Le", start: 0.099, end: 0.179 },
  { word: "résultat", start: 0.219, end: 0.699 },
  { word: "?", start: 0.799, end: 0.799 },
  { word: "Au", start: 1.779, end: 1.819 },
  { word: "Niger,", start: 1.899, end: 2.319 },
  { word: "deux", start: 2.799, end: 2.879 },
  { word: "cents", start: 2.98, end: 3.079 },
  { word: "millions", start: 3.179, end: 3.399 },
  { word: "d'arbres", start: 3.46, end: 3.759 },
  { word: "sont", start: 3.799, end: 3.979 },
  { word: "revenus.", start: 4.059, end: 4.519 },
  { word: "Pas", start: 5.099, end: 5.239 },
  { word: "plantés.", start: 5.299, end: 5.679 },
  { word: "Revenus.", start: 6.339, end: 7.579 },
  { word: "Pour", start: 7.659, end: 7.839 },
  { word: "presque", start: 7.899, end: 8.26 },
  { word: "rien.", start: 8.319, end: 8.559 },
  { word: "Et", start: 9.619, end: 9.679 },
  { word: "avec", start: 9.739, end: 10.019 },
  { word: "eux,", start: 10.039, end: 10.179 },
  { word: "l'ombre,", start: 10.699, end: 11.319 },
  { word: "des", start: 11.399, end: 11.56 },
  { word: "sols", start: 11.599, end: 11.779 },
  { word: "vivants,", start: 11.84, end: 12.159 },
  { word: "et", start: 12.559, end: 12.639 },
  { word: "les", start: 12.679, end: 12.76 },
  { word: "récoltes", start: 12.819, end: 13.319 },
  { word: "qui", start: 13.359, end: 13.42 },
  { word: "repartent.", start: 13.519, end: 14.019 },
];

/* ⛔ KARAOKE (trou de doctrine #1) : NE PAS grouper par silence auto. On FORCE les frontieres par
   INDEX de mots (1er mot de chaque segment narratif). Les 6 segments du beat (FMNR) :
   (1) Le resultat ? [0] (2) Au Niger...revenus. [3] (3) Pas plantes. Revenus. [11]
   (4) Pour presque rien. [14] (5) Et avec eux, l'ombre, des sols vivants, [17] (6) et les recoltes qui repartent. [24]
   PHRASE_BREAKS = index du 1er mot de chaque NOUVELLE phrase (apres la 1ere). */
type Phrase = { words: Word[]; start: number; end: number };
const PHRASE_BREAKS = [3, 11, 14, 17, 24];
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
const B5_PHRASES: Phrase[] = buildPhrases(B5_WORDS);

// MICRO-SOURCES (frames @30) — timee sur le claim chiffre FMNR du beat (acquis #8).
type Cue = { start: number; end: number; text: string };
const SOURCES: Cue[] = [
  // "Au Niger, 200M arbres sont revenus" (FMNR / regreening Niger)
  { start: 70, end: 200, text: "200M arbres regeneres, Niger - World Resources Institute" },
];

/* ---------------------------------------------------------------------------- */
/* ARBRE — modele REPRIS DE B2/B3 (coherence visuelle du short, acquis #1).      */
/* Tronc double trait + amorces de branches (TreeTrunk), houppier rond de        */
/* cercles de feuillage qu'on COLORE en cascade encre->vert (LeafyCrown), et     */
/* racines/souche exposees (Roots) — la pousse "revient des racines, pas plantee".*/
/* ---------------------------------------------------------------------------- */
const TreeTrunk: React.FC<{ trunk: string }> = ({ trunk }) => (
  <>
    {/* tronc double trait (repris B3) */}
    <path
      d="M0 0 C6 -60 3 -115 15 -170 C25 -217 25 -263 18 -305"
      fill="none"
      stroke={trunk}
      strokeWidth={12}
      strokeLinecap="round"
    />
    <path
      d="M35 0 C32 -64 38 -115 32 -175 C28 -227 37 -265 48 -305"
      fill="none"
      stroke={trunk}
      strokeWidth={7}
      strokeLinecap="round"
    />
    {/* amorces de branches vers le houppier */}
    <path
      d="M12 -165 C-20 -195 -45 -235 -68 -283 M38 -187 C78 -220 105 -257 138 -293 M22 -240 C-5 -270 -28 -300 -55 -335 M40 -245 C82 -267 115 -293 153 -323"
      fill="none"
      stroke={trunk}
      strokeWidth={5}
      strokeLinecap="round"
    />
  </>
);

// houppier rond plein (cercles de feuillage) — pose au-dessus du tronc, centre ~(20,-360)
const LEAF_POS: [number, number, number][] = [
  [-58, -360, 52],
  [-12, -392, 56],
  [38, -382, 58],
  [82, -352, 50],
  [-30, -330, 50],
  [40, -322, 48],
  [10, -360, 60],
  [-78, -335, 36],
  [108, -332, 34],
];
// growth (0..1) anime l'apparition des cercles en CASCADE interne (la vie qui gagne le houppier).
const LeafyCrown: React.FC<{ fill: string; stroke: string; growth: number }> = ({
  fill,
  stroke,
  growth,
}) => (
  <>
    {LEAF_POS.map(([cx, cy, r], i) => {
      const local = Math.max(0, growth - i * 0.05);
      const s = clampI(local, [0, 0.45], [0, 1]);
      if (s <= 0.001) return null;
      return (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r * s}
          fill={fill}
          stroke={stroke}
          strokeWidth={2.5}
        />
      );
    })}
    {/* nervures internes (texture feuillage, repris B3) — apparaissent une fois le houppier plein */}
    <path
      d="M-44 -360 C-4 -378 38 -372 78 -348 M-50 -332 C0 -312 60 -312 110 -336 M-20 -390 C16 -402 52 -398 88 -376"
      fill="none"
      stroke={stroke}
      strokeWidth={3}
      opacity={0.7 * clampI(growth, [0.6, 1], [0, 1])}
      strokeLinecap="round"
    />
  </>
);

// racines/souche exposees (s'etalent depuis la base 0,0 vers le sol) — "revenu des racines, pas plante"
const Roots: React.FC<{ color: string }> = ({ color }) => (
  <path
    d="M0 0 C-40 50 -85 80 -150 120 C-205 154 -250 170 -320 196 M18 0 C-2 60 -10 120 -18 185 C-24 240 -30 290 -42 350 M30 0 C70 55 120 90 195 130 C255 162 300 178 365 205 M22 0 C50 60 95 110 160 160 C225 210 270 245 330 300"
    fill="none"
    stroke={color}
    strokeWidth={5}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

// SILHOUETTE D'ARBRE A L'HORIZON (suggere l'ETENDUE / le NOMBRE 200M) — petite, simple, se colore en vert
const HorizonTree: React.FC<{ x: number; y: number; s: number; fill: string; on: number }> = ({
  x,
  y,
  s,
  fill,
  on,
}) => {
  if (on <= 0.001) return null;
  const sc = s * clampI(on, [0, 0.5], [0, 1]);
  return (
    <g transform={`translate(${x} ${y}) scale(${sc})`} opacity={Math.min(1, on)}>
      {/* petit tronc */}
      <path d="M0 0 L1 -34" stroke={ENCRE} strokeWidth={6} strokeLinecap="round" fill="none" />
      {/* houppier (3 cercles) */}
      <circle cx={-12} cy={-44} r={18} fill={fill} stroke={VERT_D} strokeWidth={1.5} />
      <circle cx={12} cy={-46} r={20} fill={fill} stroke={VERT_D} strokeWidth={1.5} />
      <circle cx={0} cy={-58} r={19} fill={fill} stroke={VERT_D} strokeWidth={1.5} />
    </g>
  );
};

// EPI / CULTURE (les recoltes qui repartent) — tige verte + grains dores en haut
const CropStalk: React.FC<{ x: number; y: number; s: number; grow: number; sway: number }> = ({
  x,
  y,
  s,
  grow,
  sway,
}) => {
  if (grow <= 0.001) return null;
  const h = clampI(grow, [0, 1], [0, 1]); // 0..1 pousse
  const sc = s * clampI(grow, [0, 0.4], [0, 1]);
  return (
    <g transform={`translate(${x} ${y}) scale(${sc}) rotate(${sway} 0 0)`}>
      {/* tige (plus haute / plus genereuse — finition Aziz : recoltes plus marquees) */}
      <path
        d={`M0 0 L0 ${-120 * h}`}
        stroke={SOL_VIVANT}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      {/* feuilles le long de la tige */}
      <path
        d={`M0 ${-38 * h} C-28 ${-42 * h} -38 ${-66 * h} -32 ${-84 * h} M0 ${-56 * h} C28 ${-60 * h} 38 ${-84 * h} 32 ${-100 * h}`}
        stroke={SOL_VIVANT}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        opacity={clampI(grow, [0.4, 0.8], [0, 1])}
      />
      {/* epi (grains dores) en haut — PLUS GROS + barbes de ble (finition Aziz) */}
      <g opacity={clampI(grow, [0.55, 1], [0, 1])} transform={`translate(0 ${-120 * h})`}>
        {/* halo dore doux derriere l'epi (sensation de moisson qui brille) */}
        <ellipse cx={0} cy={-18} rx={24} ry={34} fill={DORE} opacity={0.22} />
        {/* corps de l'epi, plus gros */}
        <ellipse cx={0} cy={-18} rx={15} ry={28} fill={DORE} stroke={DORE_D} strokeWidth={2.5} />
        {/* grains (chevrons internes) */}
        <path
          d="M-9 -30 L-3 -24 M9 -30 L3 -24 M-10 -18 L-3 -12 M10 -18 L3 -12 M-9 -6 L-3 0 M9 -6 L3 0"
          stroke={DORE_D}
          strokeWidth={1.8}
          strokeLinecap="round"
          fill="none"
          opacity={0.85}
        />
        {/* barbes de ble (aretes qui rayonnent du sommet) */}
        <path
          d="M0 -46 L0 -62 M-5 -44 L-12 -58 M5 -44 L12 -58 M-9 -40 L-20 -50 M9 -40 L20 -50"
          stroke={DORE_D}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        />
      </g>
    </g>
  );
};

export const B5LaPreuve: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // raccord vers B6 : leger fade global en toute fin (acquis #5 : pas de mouvement, juste fade)
  const endFade = clampI(frame, [404, 424], [1, 0.85]);

  /* === COUCHE DE FOND PERMANENTE (doctrine 2 couches) — ne s'arrete jamais === */
  // monde encre + cadre + horizon + souches se-tracent f0-60
  const worldDraw = clampI(frame, [0, 60], [DASH, 0]);
  // soleil discret (espoir) : fade-in f0-30, pulse leger permanent (RAYONNE)
  const sunIn = clampI(frame, [0, 30], [0, 1]);
  const sunPulse = 1 + 0.02 * Math.sin(frame / 13);
  const sunRot = frame * 0.1;
  const rayPulse = 0.5 + 0.5 * Math.sin(frame / 11);
  const rayLen = 30 + 14 * rayPulse;
  const rayOpacity = 0.45 + 0.3 * rayPulse;
  const haloR = 96 + 6 * Math.sin(frame / 17);

  /* === f53-136 "200M arbres reviennent" : le houppier REVERDIT en CASCADE g->centre->d ===
     VERT entre ici (heros). 3 arbres : gauche f55, centre f70, droite f86 (~0.5s). */
  const TREE_BIRTH = [55, 70, 86]; // gauche, centre, droite (cascade)
  const crownGrowth = (i: number) =>
    clampI(frame, [TREE_BIRTH[i], TREE_BIRTH[i] + 60], [0, 1]);
  const treePop = (i: number) =>
    spring({
      frame: frame - TREE_BIRTH[i],
      fps,
      config: { mass: 1, damping: 13, stiffness: 120 },
    });

  // APOGEE vegetal : le feuillage passe du vert tendre au vert profond + leger gonflement
  const apogee = clampI(frame, [120, 200], [0, 1]);
  const leafFill =
    apogee < 0.001
      ? VERT_TENDRE
      : apogee >= 0.999
      ? VERT
      : `rgb(${Math.round(0x6f + (0x3e - 0x6f) * apogee)},${Math.round(
          0xa8 + (0x8f - 0xa8) * apogee
        )},${Math.round(0x5a + (0x34 - 0x5a) * apogee)})`;
  const leafStroke = apogee > 0.5 ? VERT_D : VERT_TENDRE_D;
  const canopySwell = 1 + 0.06 * apogee;
  const leafSway = Math.sin(frame / 18) * 1.2;

  // SILHOUETTES A L'HORIZON (l'etendue / le nombre 200M) : verdissent en vague f95-180
  const horizonOn = (k: number) => clampI(frame, [95 + k * 9, 95 + k * 9 + 45], [0, 1]);
  const horizonFill = (k: number) => {
    const a = clampI(frame, [150, 210], [0, 1]);
    return a < 0.001
      ? VERT_TENDRE
      : `rgb(${Math.round(0x6f + (0x3e - 0x6f) * a)},${Math.round(
          0xa8 + (0x8f - 0xa8) * a
        )},${Math.round(0x5a + (0x34 - 0x5a) * a)})`;
  };

  /* === f153-190 "Pas plantes. Revenus." : insister sur la SOUCHE / racines (revenu du bois) ===
     les racines virent en OCRE TERRE (ancre dans le sol) ; le verdissement est deja la, on souligne
     que c'est sorti du vieux bois. (pilote via rootsOcre) */
  const rootsOcre = clampI(frame, [155, 195], [0, 1]);

  /* === f289-365 "Et avec eux, l'ombre, des sols vivants" === */
  // OMBRE douce sous les arbres : apparait f289-330
  const shadowIn = clampI(frame, [289, 335], [0, 1]);
  // SOL VIVANT : le sol mort reverdit (touffes d'herbe au sol) f300-365
  const soilGreen = clampI(frame, [300, 365], [0, 1]);

  /* === f377-421 "et les recoltes qui repartent." : EPIS/cultures poussent au pied des arbres === */
  const cropGrow = (k: number) => clampI(frame, [377 + k * 5, 377 + k * 5 + 38], [0, 1]);
  const cropSway = (k: number) => Math.sin(frame / 14 + k) * 3;

  /* ---------------- SOUS-TITRES KARAOKE (acquis #7) : phrase visible + highlight mot-a-mot ------- */
  const narrationSec = frame / fps;
  const activePhraseIdx = (() => {
    for (let i = 0; i < B5_PHRASES.length; i++) {
      const p = B5_PHRASES[i];
      const nextStart = B5_PHRASES[i + 1]?.start ?? p.end + 0.6;
      if (narrationSec >= p.start - 0.18 && narrationSec < nextStart) return i;
    }
    return -1;
  })();
  const activePhrase = activePhraseIdx >= 0 ? B5_PHRASES[activePhraseIdx] : null;
  const subOpacity = (() => {
    if (!activePhrase) return 0;
    const nextStart =
      B5_PHRASES[activePhraseIdx + 1]?.start ?? activePhrase.end + 0.6;
    const appearAt = activePhrase.start - 0.18;
    const fadeOutStart = nextStart - 0.3;
    return interpolate(
      narrationSec,
      [appearAt, appearAt + 0.25, fadeOutStart, nextStart],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  })();

  const activeSrc = SOURCES.find((c) => frame >= c.start && frame <= c.end);
  const srcOpacity = activeSrc
    ? interpolate(
        frame,
        [activeSrc.start, activeSrc.start + 10, activeSrc.end - 10, activeSrc.end],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  // positions des 3 arbres (memes que l'ancienne version)
  const TREES = [
    { tx: 235, ty: 1320, s: 0.66, i: 0, sway: 1, extra: 1 },
    { tx: 540, ty: 1345, s: 0.74, i: 1, sway: 0.6, extra: 1.04 }, // centre, le plus haut
    { tx: 832, ty: 1320, s: 0.64, i: 2, sway: -1, extra: 1 },
  ];

  return (
    <AbsoluteFill style={{ background: CREME }}>
      <Audio src={staticFile("audio/ggw-muraille-verte/narration-beat5.mp3")} />

      {/* ============ COUCHE SFX (frame-driven via <Sequence from=>) — tous sous la narration ============ */}
      {/* vent de fond continu tres leger (ambiance, drone) */}
      <Audio
        src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-vent.mp3")}
        volume={0.12}
      />
      {/* f53 : le feuillage JAILLIT des souches (la pousse) — cascade des arbres qui reviennent */}
      <Sequence from={53} durationInFrames={90}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-pousse.mp3")}
          volume={0.85}
        />
      </Sequence>
      {/* f289 "Et avec eux..." : 2e bouffee de pousse (le sol vivant + les recoltes qui repartent) */}
      <Sequence from={289} durationInFrames={100}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-pousse.mp3")}
          volume={0.6}
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
          {/* ---- SOLEIL QUI RAYONNE : jaune doux (espoir, climax positif) ---- */}
          <g
            id="soleil"
            opacity={sunIn * 0.85}
            transform={`translate(${220 * (1 - sunPulse)} ${280 * (1 - sunPulse)}) scale(${sunPulse})`}
          >
            <circle
              cx={220}
              cy={280}
              r={haloR}
              fill={JAUNE}
              stroke="none"
              opacity={0.12 + 0.06 * rayPulse}
            />
            <circle
              cx={220}
              cy={280}
              r={haloR}
              fill="none"
              stroke={JAUNE_D}
              strokeWidth={1.2}
              opacity={0.2 + 0.12 * rayPulse}
            />
            <circle cx={220} cy={280} r={80} fill={JAUNE} stroke={JAUNE_D} strokeWidth={4} />
            <g
              transform={`rotate(${sunRot} 220 280)`}
              stroke={JAUNE_D}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={rayOpacity}
            >
              {Array.from({ length: 12 }).map((_, k) => {
                const a = (k * Math.PI * 2) / 12;
                const x0 = 220 + Math.cos(a) * 92;
                const y0 = 280 + Math.sin(a) * 92;
                const x1 = 220 + Math.cos(a) * (92 + rayLen);
                const y1 = 280 + Math.sin(a) * (92 + rayLen);
                return <line key={k} x1={x0} y1={y0} x2={x1} y2={y1} />;
              })}
            </g>
          </g>

          {/* ---- HORIZON + SOL (encre, se-tracent f0-60) ---- */}
          <g id="horizon_sol">
            <path
              d="M40 750 Q250 730 450 760 T850 740 T1040 755"
              fill="none"
              stroke={ENCRE}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={DASH}
              strokeDashoffset={worldDraw}
            />
            <path
              d="M40 820 Q300 790 550 830 T1040 810"
              fill="none"
              stroke={ENCRE}
              strokeWidth={2}
              opacity={0.7}
              strokeDasharray={DASH}
              strokeDashoffset={worldDraw}
            />
            <path
              d="M40 1030 Q350 1000 700 1050 T1040 1020"
              fill="none"
              stroke={ENCRE}
              strokeWidth={2}
              opacity={0.6}
              strokeDasharray={DASH}
              strokeDashoffset={worldDraw}
            />
            <path
              d="M40 1280 Q250 1260 500 1300 T1040 1270"
              fill="none"
              stroke={ENCRE}
              strokeWidth={2}
              opacity={0.55}
              strokeDasharray={DASH}
              strokeDashoffset={worldDraw}
            />
          </g>

          {/* ---- SILHOUETTES D'ARBRES A L'HORIZON (l'etendue / le nombre 200M) ----
               petites, alignees sur la ligne d'horizon (~y745), verdissent en vague f95-180.
               Suggere que les arbres reviennent EN MASSE, pas un compteur. ---- */}
          <g id="horizon_trees">
            {[
              { x: 120, y: 748, s: 0.7 },
              { x: 360, y: 742, s: 0.62 },
              { x: 470, y: 750, s: 0.55 },
              { x: 660, y: 740, s: 0.66 },
              { x: 780, y: 746, s: 0.5 },
              { x: 960, y: 750, s: 0.72 },
            ].map((h, k) => (
              <HorizonTree
                key={k}
                x={h.x}
                y={h.y}
                s={h.s}
                fill={horizonFill(k)}
                on={horizonOn(k)}
              />
            ))}
          </g>

          {/* ---- OMBRE douce sous les arbres (f289-335) : "l'ombre" qui revient avec les arbres ----
               ellipse encre tres pale au sol, sous chaque houppier. ---- */}
          <g id="ombres" opacity={shadowIn * 0.22}>
            {TREES.map((t) => (
              <ellipse
                key={t.i}
                cx={t.tx + 15}
                cy={t.ty + 12}
                rx={150 * t.s}
                ry={34 * t.s}
                fill={ENCRE}
              />
            ))}
          </g>

          {/* ---- SOL QUI SE PROPAGE EN VERT (finition Aziz) : une vague verte qui RECONQUIERT la terre
               morte, partant du centre (pied des arbres) et gagnant les bords. On VOIT la vie reprendre
               le terrain, pas juste apparaitre. La demi-largeur de la bande croit avec soilGreen. ---- */}
          {soilGreen > 0.01 && (() => {
            const spread = clampI(soilGreen, [0, 1], [120, 620]); // demi-largeur gagnee depuis le centre (x=540)
            const topY = 1455; // ligne haute du sol vivant
            const botY = 1640;
            return (
              <g id="sol_vague_verte" opacity={soilGreen * 0.55}>
                {/* bande verte au sol, bord ondule, centree x=540, qui s'elargit */}
                <path
                  d={`M${540 - spread} ${botY}
                      L${540 - spread} ${topY + 14}
                      Q${540 - spread * 0.6} ${topY - 6} ${540 - spread * 0.25} ${topY + 8}
                      Q540 ${topY - 4} ${540 + spread * 0.25} ${topY + 8}
                      Q${540 + spread * 0.6} ${topY - 6} ${540 + spread} ${topY + 14}
                      L${540 + spread} ${botY} Z`}
                  fill={SOL_VIVANT}
                />
              </g>
            );
          })()}

          {/* ---- SOL VIVANT (f300-365) : le sol mort reverdit — touffes d'herbe entre les arbres ---- */}
          <g id="sol_vivant" opacity={soilGreen}>
            {[
              [150, 1480],
              [380, 1500],
              [640, 1490],
              [900, 1485],
              [270, 1560],
              [520, 1575],
              [760, 1560],
              [1000, 1540],
            ].map(([gx, gy], k) => {
              const gh = clampI(soilGreen, [k * 0.05, k * 0.05 + 0.4], [0, 1]);
              if (gh <= 0.01) return null;
              return (
                <path
                  key={k}
                  d={`M${gx} ${gy} C${gx - 10} ${gy - 28 * gh} ${gx - 14} ${gy - 40 * gh} ${gx - 10} ${gy - 50 * gh} M${gx + 4} ${gy} C${gx + 6} ${gy - 30 * gh} ${gx + 4} ${gy - 44 * gh} ${gx + 10} ${gy - 56 * gh} M${gx + 12} ${gy} C${gx + 22} ${gy - 26 * gh} ${gx + 28} ${gy - 38 * gh} ${gx + 26} ${gy - 48 * gh}`}
                  stroke={SOL_VIVANT}
                  strokeWidth={4}
                  strokeLinecap="round"
                  fill="none"
                />
              );
            })}
          </g>

          {/* ---- 3 ARBRES qui REVERDISSENT (modele B2/B3, acquis #1) ----
               Tronc + houppier rond + souche/racines exposees (revenu DES RACINES, pas plante). Le
               houppier passe d'encre (vide) a VERT en cascade g->centre->d f55/70/86 ; apogee vert
               profond f120-200. Les troncs+racines se-tracent d'abord (encre, f10-50), puis le vert. ---- */}
          {TREES.map((t) => {
            const pop = treePop(t.i);
            const g = crownGrowth(t.i);
            const trunkOpacity = clampI(frame, [10, 50], [0, 1]);
            const crownScale = Math.min(1, Math.max(0, pop)) * canopySwell * t.extra;
            return (
              <g key={t.i}>
                {/* souche/racines (le vieux bois d'ou la vie repart). Apres le verdissement, les
                    racines virent en OCRE TERRE (la vie ancree dans le sol, "revenus pas plantes"). */}
                <g
                  transform={`translate(${t.tx} ${t.ty}) scale(${t.s})`}
                  opacity={trunkOpacity}
                >
                  <Roots color={rootsOcre > 0.5 ? OCRE_TERRE : ENCRE} />
                  <TreeTrunk trunk={ENCRE} />
                </g>
                {/* houppier qui REVERDIT (apparait + se colore via crownGrowth/leafFill) */}
                {g > 0.001 && (
                  <g
                    transform={`translate(${t.tx} ${t.ty}) scale(${t.s * crownScale}) rotate(${leafSway * t.sway} 20 -360)`}
                  >
                    <LeafyCrown fill={leafFill} stroke={leafStroke} growth={g} />
                  </g>
                )}
              </g>
            );
          })}

          {/* ---- RECOLTES (f377-421) : epis/cultures qui poussent au pied des arbres (vert-dore) ----
               l'agriculture qui repart = climax d'abondance. Plantes en bandes entre/sous les arbres. ---- */}
          <g id="recoltes">
            {[
              { x: 330, y: 1505, s: 1.25 },
              { x: 405, y: 1525, s: 1.05 },
              { x: 615, y: 1510, s: 1.2 },
              { x: 690, y: 1530, s: 1.0 },
              { x: 460, y: 1565, s: 1.35 },
              { x: 545, y: 1580, s: 1.15 },
              { x: 765, y: 1560, s: 1.18 },
              { x: 240, y: 1550, s: 1.1 },
              { x: 870, y: 1545, s: 1.05 },
              { x: 150, y: 1535, s: 1.0 },
            ].map((c, k) => (
              <CropStalk
                key={k}
                x={c.x}
                y={c.y}
                s={c.s}
                grow={cropGrow(k)}
                sway={cropSway(k)}
              />
            ))}
          </g>
        </g>
        {/* ============ /MONDE ============ */}
      </svg>

      {/* ============ SOUS-TITRES KARAOKE (bas centre, zone safe — acquis #7) ============ */}
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
              const active = narrationSec >= w.start && narrationSec <= w.end + 0.12;
              return (
                <span
                  key={i}
                  style={{
                    // mot en cours = touche VERTE (la vie qui revient = registre du beat)
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

      {/* ============ MICRO-SOURCES (sous le sous-titre, centree — acquis #8) ============ */}
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
              maxWidth: 820,
              color: ENCRE,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 26,
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

export default B5LaPreuve;
