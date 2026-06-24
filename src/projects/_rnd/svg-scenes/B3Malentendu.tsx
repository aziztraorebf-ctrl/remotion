/**
 * B3Malentendu — Beat 3 GGW "LE MALENTENDU" (registre ENCRE NARRATIVE, anime).
 *
 * CONCEPT (cible validee Aziz = "L'OMBRE QUI MENT", compo GPT + sol craquele Gemini greffe) :
 *   un arbre dont l'OMBRE forme une muraille fortifiee a creneaux = l'illusion qu'un MUR protege.
 *   Sous l'arbre, ses RACINES exposees plongent dans un SOL CRAQUELE = la terre deja morte, faute d'eau.
 *
 * INTENTION : LE RETOURNEMENT INTELLECTUEL. On s'est trompe d'ENNEMI. Le desert n'avance pas comme
 *   une armee qu'un mur arreterait ; la terre meurt SUR PLACE, faute d'eau. Planter des arbres assoiffes
 *   dans un sol mort ne pouvait pas tenir. Le sujet = le desespoir/l'erreur (PAS l'espoir = Beat 4).
 *
 * V2 — 5 AJUSTEMENTS (demande Aziz) :
 *   1. LE MUR RESTE TOUT DU LONG. Le mur (ombre-muraille) APPARAIT (f85-162, balayage depuis le pied
 *      de l'arbre) puis RESTE VISIBLE jusqu'a la fin. Il ne se desagrege plus. Sens : "malgre le mur,
 *      l'arbre meurt quand meme = le mur ne sert a rien". (SFX ggw-sfx-ombre-dissoute RETIRE.)
 *   2. OMBRE-MURAILLE ANCREE A L'ARBRE : nait par BALAYAGE (clip-path anime) depuis le pied de l'arbre
 *      vers les cotes -> on lit "c'est l'ombre QUI PART de l'arbre". Timing f85-162.
 *   3. CRAQUELURES OCRE/TERRE DE SIENNE BRULE (#b5651d) : la SEULE touche couleur-diagnostic. Le sol
 *      mort s'allume en ocre sur "la terre meurt sur place" (~f198-255). Pas l'arbre, ni le mur, ni le soleil.
 *   4. PARTICULES DE POUSSIERE qui s'elevent des craquelures a leur illumination (~f210-280), frame-driven,
 *      discretes (translateY haut + fade + drift) = la terre qui part en poussiere, "faute d'eau".
 *   5. SOUS-TITRES FIXES (plus de karaoke mot-a-mot) : phrase entiere par segment, fade in/out, bas zone
 *      safe ~y1620, ~37px Georgia, fond parchemin semi-transparent, chiffres en LETTRES, accents FR.
 *      Accent = VERT du Beat 2 (#3e8f34). Segment 4 scinde en 2 ("...sol deja mort," / "ca ne pouvait pas tenir.").
 *
 * CHOREGRAPHIE — SCENE UNIQUE QUI SE RELIT (cale sur les 4 segments audio, frames @30fps) :
 *   - f0-31   "on se trompait d'ennemi" : INSTALLATION. Monde encre, l'arbre VIVANT se trace, sol intact.
 *   - f85-162 "le desert n'avance pas comme une armee qu'un mur pourrait stopper" : LA FAUSSE IDEE.
 *             L'OMBRE-MURAILLE se PROJETTE depuis l'arbre (balayage, creneaux, hachures). Elle RESTE.
 *   - f198-284 "la terre meurt sur place, faute d'eau" : LE RETOURNEMENT. Le SOL CRAQUELE se REVELE
 *             et s'ILLUMINE d'OCRE (#b5651d) ; des particules de poussiere s'elevent. Le mur, lui, reste.
 *   - f325-453 "des arbres assoiffes dans un sol deja mort, ca ne pouvait pas tenir" : LE VERDICT.
 *             L'arbre s'AFFAISSE : feuillage grise, houppier se retracte, l'arbre penche. Le mur reste = inutile.
 *
 * GRAMMAIRE (identique hook + B2) : spring pop / stroke-dashoffset (se-dessine) / cross-fade opacite /
 *   clip-path anime ; clamp partout, frame-driven (zero CSS transition/keyframes/setTimeout) ;
 *   scene FIXE (pas de translate global du monde). Raccord par fade.
 *
 * Composition 1080x1920 (9:16), 468 frames @30fps (15.6s). Audio Beat 3 inclus.
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
const VERT_TENDRE = "#6fa85a"; // feuillage vivant (etat de naissance de l'arbre)
const VERT_TENDRE_D = "#4f7e3f";
const GRIS_FEUILLE = "#8f8a7e"; // feuillage qui grise a l'affaissement
const CENDRE_D = "#3a3a3a";
// AJUST 3 : OCRE/TERRE DE SIENNE BRULE = la SEULE touche couleur-diagnostic (sol desseche, mort de soif).
const OCRE_TERRE = "#b5651d"; // ocre terre de Sienne brule (demande Aziz, contraste net sur le creme)
const OCRE_TERRE_D = "#7a4011"; // version sombre (racines seches / contours)
// AJUST 5 : accent des sous-titres = VERT du Beat 2 (continuite visuelle).
const VERT = "#3e8f34"; // vert vif Beat 2
const VERT_D = "#295c1c"; // vert sombre Beat 2

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

/* ---------- SOUS-TITRES KARAOKE mot-a-mot (RETOUR au pattern Beat 2) ----------
   Chaque mot s'illumine au fil de la voix (suit la dictation), identite ENCRE/parchemin :
   mot PAS encore dit = encre PALE (#2b2117 opacity ~0.45) ; mot DEJA dit = encre PLEINE ;
   mot EN COURS = VERT (#3e8f34, le vert du Beat 2). Highlight frame-driven : narrationSec =
   frame/fps compare au start de chaque mot. Groupage par phrase (coupure sur silence),
   un groupe visible a la fois (fade in/out en secondes). Pattern repris d'B2LigneBrisee.tsx.
   start/end = SECONDES (beat-relatif, 30fps, 468 frames). Accents FR. */
type Word = { word: string; start: number; end: number };
const B3_WORDS: Word[] = [
  { word: "Parce", start: 0.124, end: 0.344 },
  { word: "qu'on", start: 0.364, end: 0.504 },
  { word: "se", start: 0.524, end: 0.644 },
  { word: "trompait", start: 0.684, end: 0.984 },
  { word: "d'ennemi.", start: 1.024, end: 1.583 },
  { word: "Le", start: 2.824, end: 2.904 },
  { word: "désert", start: 2.964, end: 3.284 },
  { word: "n'avance", start: 3.324, end: 3.644 },
  { word: "pas", start: 3.724, end: 3.804 },
  { word: "comme", start: 3.904, end: 4.044 },
  { word: "une", start: 4.064, end: 4.254 },
  { word: "armée", start: 4.264, end: 4.564 },
  { word: "qu'un", start: 4.584, end: 4.764 },
  { word: "mur", start: 4.804, end: 5.084 },
  { word: "pourrait", start: 5.104, end: 5.344 },
  { word: "stopper.", start: 5.404, end: 6.484 },
  { word: "La", start: 6.584, end: 6.704 },
  { word: "terre,", start: 6.764, end: 7.224 },
  { word: "elle,", start: 7.304, end: 7.484 },
  { word: "meurt", start: 7.944, end: 8.104 },
  { word: "sur", start: 8.164, end: 8.384 },
  { word: "place,", start: 8.404, end: 8.764 },
  { word: "faute", start: 9.144, end: 9.444 },
  { word: "d'eau.", start: 9.464, end: 10.784 },
  { word: "Et", start: 10.824, end: 10.924 },
  { word: "planter", start: 10.964, end: 11.214 },
  { word: "des", start: 11.284, end: 11.444 },
  { word: "arbres", start: 11.524, end: 11.854 },
  { word: "assoiffés", start: 11.904, end: 12.404 },
  { word: "dans", start: 12.444, end: 12.584 },
  { word: "un", start: 12.624, end: 12.684 },
  { word: "sol", start: 12.804, end: 13.044 },
  { word: "déjà", start: 13.084, end: 13.324 },
  { word: "mort,", start: 13.444, end: 13.684 },
  { word: "ça", start: 14.464, end: 14.524 },
  { word: "ne", start: 14.564, end: 14.664 },
  { word: "pouvait", start: 14.714, end: 14.924 },
  { word: "pas", start: 14.944, end: 15.104 },
  { word: "tenir.", start: 15.114, end: 15.564 },
];

// Groupage en phrases (par silence). Les 4 segments audio sont separes par ~1.2-1.4s
// de silence ; on coupe la phrase sur un gap > 0.8s. Le segment 4 (le plus long) se
// scinde naturellement sur le gap "mort," -> "ça" (~0.78s, sous le seuil) : on force
// donc une coupure supplementaire sur gap > 0.7s pour obtenir 5 groupes (anti-trop-long).
type Phrase = { words: Word[]; start: number; end: number };
// ⚠️ Le decoupage audio (4 segments narratifs) NE correspond PAS aux silences reels :
// gap apres "stopper." = 0.06s seulement -> un buildPhrases par silence collerait
// "Le desert...stopper." + "La terre...d'eau." + "Et planter...mort" en UN bloc illisible.
// -> on FORCE les frontieres par index de mots, sur les segments du script (5 sous-titres,
// segment 4 scinde sur "mort,"). Regle gravee : grouper sur le decoupage FOURNI, pas l'auto-silence.
const PHRASE_BREAKS = [5, 16, 24, 34]; // index du 1er mot de chaque nouvelle phrase
const buildPhrases = (words: Word[]): Phrase[] => {
  const phrases: Phrase[] = [];
  let current: Word[] = [];
  for (let i = 0; i < words.length; i++) {
    if (PHRASE_BREAKS.includes(i) && current.length) {
      phrases.push({ words: [...current], start: current[0].start, end: current[current.length - 1].end });
      current = [];
    }
    current.push(words[i]);
  }
  if (current.length) {
    phrases.push({ words: [...current], start: current[0].start, end: current[current.length - 1].end });
  }
  return phrases;
};
const B3_PHRASES: Phrase[] = buildPhrases(B3_WORDS);

// MICRO-SOURCES (frames @30) — American Scientist, timees sur les 2 claims du beat. (INCHANGE)
type Cue = { start: number; end: number; text: string };
const SOURCES: Cue[] = [
  // "le desert n'avance pas comme une armee" (~f85-162)
  { start: 92, end: 168, text: "American Scientist" },
  // "la terre meurt sur place, faute d'eau" (~f198-284)
  { start: 206, end: 290, text: "American Scientist" },
];

// AJUST 4 : particules de poussiere — positions de depart sur les craquelures du sol.
// Elles s'elevent (translateY vers le haut) + fade + drift lateral, frame-driven, discretes.
type Dust = { x: number; y: number; r: number; rise: number; drift: number; delay: number };
const DUST: Dust[] = [
  { x: 300, y: 1640, r: 5, rise: 220, drift: -40, delay: 0 },
  { x: 520, y: 1700, r: 6, rise: 260, drift: 30, delay: 8 },
  { x: 760, y: 1660, r: 5, rise: 230, drift: 45, delay: 4 },
  { x: 420, y: 1560, r: 4, rise: 200, drift: -25, delay: 14 },
  { x: 660, y: 1560, r: 4.5, rise: 210, drift: 20, delay: 18 },
  { x: 200, y: 1720, r: 5.5, rise: 250, drift: -35, delay: 22 },
  { x: 880, y: 1700, r: 4.5, rise: 240, drift: 38, delay: 10 },
  { x: 560, y: 1640, r: 5, rise: 270, drift: -15, delay: 28 },
];

/* ---------------------------------------------------------------------------- */
/* ARBRE — silhouette reprise de la cible GPT (tronc qui monte + houppier rond).*/
/* Dessine relatif a sa base (0,0). Le houppier plein (feuillage) est separe    */
/* pour pouvoir le verdir/griser/retracter. branchColor pilote le cross-fade.   */
/* ---------------------------------------------------------------------------- */
const TreeTrunk: React.FC<{ trunk: string }> = ({ trunk }) => (
  <>
    {/* tronc double trait (repris GPT) */}
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
const LeafyCrown: React.FC<{ fill: string; stroke: string }> = ({
  fill,
  stroke,
}) => (
  <>
    {LEAF_POS.map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={2.5} />
    ))}
    {/* nervures internes (texture feuillage, repris GPT) */}
    <path
      d="M-44 -360 C-4 -378 38 -372 78 -348 M-50 -332 C0 -312 60 -312 110 -336 M-20 -390 C16 -402 52 -398 88 -376"
      fill="none"
      stroke={stroke}
      strokeWidth={3}
      opacity={0.7}
      strokeLinecap="round"
    />
  </>
);

// racines exposees (s'etalent depuis la base 0,0 vers le sol craquele) — repris compo GPT
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

export const B3Malentendu: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // raccord : leger fade global en toute fin (acquis #5 : pas de mouvement, juste fade)
  const endFade = clampI(frame, [445, 468], [1, 0.85]);

  /* === SEGMENT 1 (f0-31) : INSTALLATION — le monde encre + l'arbre vivant se trace === */
  // horizon / dunes : se-tracent f0-60
  const groundDraw = clampI(frame, [0, 60], [DASH, 0]);
  // arbre : pop spring (tronc + houppier) f10->
  const treePop = spring({
    frame: frame - 10,
    fps,
    config: { mass: 1, damping: 14, stiffness: 110 },
  });
  // soleil discret : fade-in f0-30, reste en encre TOUT le beat (pas d'embrasement)
  const sunIn = clampI(frame, [0, 30], [0, 1]);
  const sunPulse = 1 + 0.02 * Math.sin(frame / 12);

  /* === SEGMENT 2 (f85-162) : LA FAUSSE IDEE — l'OMBRE-MURAILLE se projette (AJUST 1+2) ===
     AJUST 1 : le mur monte puis RESTE (plus de wallDissolve).
     AJUST 2 : il NAIT par BALAYAGE depuis le pied de l'arbre vers les cotes (clip-path anime). */
  // opacite globale de l'ombre (apparition f85-150, puis RESTE = 1 jusqu'a la fin)
  const wallRise = clampI(frame, [85, 150], [0, 1]);
  // balayage : largeur de revelation du clip-path, du pied de l'arbre vers les cotes (f85-162)
  const wallSweep = clampI(frame, [85, 162], [0, 1]);
  // hachures internes de l'ombre : se-tracent f100-160
  const wallHatchDraw = clampI(frame, [100, 160], [DASH, 0]);
  // demi-largeur revelee par le balayage (mur de x=310 a x=776, centre ~543, demi-largeur max ~240)
  const WALL_CX = 543;
  const sweepHalf = 248 * wallSweep;

  /* === SEGMENT 3 (f198-284) : LE RETOURNEMENT (le mur RESTE ; le sol se revele et s'illumine) === */
  // le SOL CRAQUELE se revele (se-trace) f205-280
  const crackDraw = clampI(frame, [205, 280], [DASH, 0]);
  // AJUST 3 : OCRE TERRE s'allume f198-255 = LA seule couleur (la vraie cause : la terre dessechee)
  const ocreIn = clampI(frame, [198, 255], [0, 1]);
  // racines exposees apparaissent (deja seches) f215-265
  const rootsIn = clampI(frame, [215, 265], [0, 1]);

  /* === SEGMENT 4 (f325-453) : LE VERDICT — l'arbre s'affaisse === */
  // feuillage grise f330-400
  const leafGrey = clampI(frame, [330, 400], [0, 1]);
  // houppier se retracte (scale) f345-430
  const crownShrink = clampI(frame, [345, 430], [1, 0.62]);
  // l'arbre penche (affaissement) f340-440
  const treeSlump = clampI(frame, [340, 440], [0, 7]);
  // racines se recroquevillent (scale vers la base) f350-440
  const rootsCurl = clampI(frame, [350, 440], [1, 0.7]);

  // couleur du feuillage : vert tendre -> gris (cross-fade pilote par leafGrey)
  const crownFill =
    leafGrey < 0.001
      ? VERT_TENDRE
      : leafGrey >= 0.999
      ? GRIS_FEUILLE
      : `rgb(${Math.round(0x6f + (0x8f - 0x6f) * leafGrey)},${Math.round(
          0xa8 + (0x8a - 0xa8) * leafGrey
        )},${Math.round(0x5a + (0x7e - 0x5a) * leafGrey)})`;
  const crownStroke = leafGrey > 0.5 ? CENDRE_D : VERT_TENDRE_D;

  // placement de l'arbre central (base au niveau du sol)
  const TREE = { tx: 530, ty: 1300, s: 1.0 };

  /* ---------------- SOUS-TITRES KARAOKE mot-a-mot (RETOUR Beat 2) ----------------
     frame -> secondes, on selectionne la PHRASE visible (un groupe a la fois) ;
     le highlight mot-a-mot se fait au render (narrationSec vs start/end de chaque mot). */
  const narrationSec = frame / fps;
  const activePhraseIdx = (() => {
    for (let i = 0; i < B3_PHRASES.length; i++) {
      const p = B3_PHRASES[i];
      const nextStart = B3_PHRASES[i + 1]?.start ?? p.end + 0.6;
      // marge avant (apparait ~0.18s avant le 1er mot) et apres (reste jusqu'au start suivant)
      if (narrationSec >= p.start - 0.18 && narrationSec < nextStart) return i;
    }
    return -1;
  })();
  const activePhrase = activePhraseIdx >= 0 ? B3_PHRASES[activePhraseIdx] : null;
  // fade in/out de la phrase (en secondes) : ~0.25s d'apparition, ~0.3s de sortie
  const subOpacity = (() => {
    if (!activePhrase) return 0;
    const nextStart =
      B3_PHRASES[activePhraseIdx + 1]?.start ?? activePhrase.end + 0.6;
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

  return (
    <AbsoluteFill style={{ background: CREME }}>
      <Audio src={staticFile("audio/ggw-muraille-verte/narration-beat3.mp3")} />

      {/* ============ COUCHE SFX (frame-driven via <Sequence from=>) — tous sous la narration ============ */}
      {/* vent de fond continu (ambiance desert) */}
      <Audio
        src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-vent.mp3")}
        volume={0.14}
      />
      {/* l'ombre-muraille se PROJETTE (la fausse idee monte) — f88 */}
      <Sequence from={88} durationInFrames={70}>
        <Audio
          src={staticFile("_shared/sfx/impact/tension-pulse.mp3")}
          volume={0.22}
        />
      </Sequence>
      {/* AJUST 1 : SFX ggw-sfx-ombre-dissoute RETIRE (le mur ne se desagrege plus). */}
      {/* le SOL CRAQUELE se revele (la vraie cause) — f206, fissure existante */}
      <Sequence from={206} durationInFrames={90}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-fissure.mp3")}
          volume={0.42}
        />
      </Sequence>
      {/* l'arbre meurt/s'affaisse (le verdict) — f330 */}
      <Sequence from={330} durationInFrames={60}>
        <Audio
          src={staticFile(
            "audio/ggw-muraille-verte/sfx/ggw-sfx-arbre-meurt.mp3"
          )}
          volume={0.34}
        />
      </Sequence>
      {/* feuilles seches au vent pendant l'affaissement — f338 */}
      <Sequence from={338} durationInFrames={90}>
        <Audio
          src={staticFile("_shared/sfx/nature/wind-leaves.mp3")}
          volume={0.24}
        />
      </Sequence>

      <svg viewBox="0 0 1080 1920" width="100%" height="100%" opacity={endFade}>
        <defs>
          {/* AJUST 2 : clip-path du balayage de l'ombre-muraille (revele du pied de l'arbre vers les cotes). */}
          <clipPath id="wallSweepClip">
            <rect
              x={WALL_CX - sweepHalf}
              y={1000}
              width={sweepHalf * 2}
              height={400}
            />
          </clipPath>
        </defs>

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
          {/* ---- SOLEIL : encre discret, fade-in, AUCUN embrasement (le sujet n'est pas le soleil) ---- */}
          <g
            id="soleil"
            opacity={sunIn * 0.85}
            transform={`translate(${250 * (1 - sunPulse)} ${300 * (1 - sunPulse)}) scale(${sunPulse})`}
          >
            <circle cx={250} cy={300} r={130} fill="none" stroke={ENCRE} strokeWidth={5} />
            <circle
              cx={250}
              cy={300}
              r={168}
              fill="none"
              stroke={ENCRE}
              strokeWidth={2}
              strokeDasharray="13 20"
              opacity={0.5}
            />
            <path
              d="M250 110 L250 150 M250 450 L250 490 M60 300 L100 300 M400 300 L440 300 M120 170 L148 198 M380 430 L352 402 M380 170 L352 198 M120 430 L148 402"
              stroke={ENCRE}
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.75}
            />
          </g>

          {/* ---- DUNES / HORIZON (encre, se-tracent f0-60) ---- */}
          <g id="dunes_horizon">
            <path
              d="M-40 760 C170 715 330 770 525 730 C720 690 900 745 1120 705"
              fill="none"
              stroke={ENCRE}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={DASH}
              strokeDashoffset={groundDraw}
            />
            <path
              d="M-40 900 C160 850 330 910 540 868 C740 828 905 885 1120 850"
              fill="none"
              stroke={ENCRE}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={DASH}
              strokeDashoffset={groundDraw}
            />
            <path
              d="M40 1020 C200 975 360 1030 520 990 C690 948 860 1000 1040 968"
              fill="none"
              stroke={ENCRE}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.7}
              strokeDasharray={DASH}
              strokeDashoffset={groundDraw}
            />
            {/* ligne de sol (base de l'arbre, ~y1300) */}
            <path
              d="M-40 1300 C200 1268 420 1312 600 1295 C800 1276 980 1300 1120 1282"
              fill="none"
              stroke={ENCRE}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={DASH}
              strokeDashoffset={groundDraw}
            />
          </g>

          {/* ---- OMBRE-MURAILLE (AJUST 1+2) : nait par BALAYAGE depuis le pied de l'arbre f85-162,
               puis RESTE VISIBLE jusqu'a la fin (ne se desagrege plus). C'est l'OMBRE de l'arbre qui
               forme un mur fortifie a creneaux (l'illusion qu'un mur protege) — et le mur reste INUTILE.
               wallRise = fade-in d'opacite globale ; le clip-path (wallSweepClip) revele le mur du
               centre/pied vers les cotes (on lit "l'ombre PART de l'arbre"). ---- */}
          <g id="ombre_muraille" opacity={wallRise * 0.95} clipPath="url(#wallSweepClip)">
            {/* corps de l'ombre (remplissage encre tres pale = ombre, pas un vrai mur) + creneaux en haut */}
            <path
              d="M310 1300
                 L310 1110 L310 1060 L360 1060 L360 1098 L412 1098 L412 1060 L464 1060 L464 1098 L516 1098 L516 1060 L568 1060 L568 1098 L620 1098 L620 1060 L672 1060 L672 1098 L724 1098 L724 1060 L776 1060 L776 1300 Z"
              fill={ENCRE}
              fillOpacity={0.1}
              stroke={ENCRE}
              strokeWidth={4}
              strokeLinejoin="round"
            />
            {/* hachures internes (texture maconnerie de l'ombre) — se-tracent */}
            <path
              d="M330 1130 L756 1130 M330 1175 L760 1175 M330 1220 L758 1220 M330 1265 L756 1265"
              fill="none"
              stroke={ENCRE}
              strokeWidth={2}
              opacity={0.4}
              strokeDasharray={DASH}
              strokeDashoffset={wallHatchDraw}
            />
            <path
              d="M360 1098 L640 1300 M464 1098 L724 1300 M568 1098 L776 1300 M310 1180 L470 1300"
              fill="none"
              stroke={ENCRE}
              strokeWidth={1.6}
              opacity={0.3}
              strokeDasharray={DASH}
              strokeDashoffset={wallHatchDraw}
            />
          </g>

          {/* ---- SOL CRAQUELE (greffe de la cible Gemini, plaques seches polygonales) ----
               AJUST 3 : se-trace f205-280 ; s'illumine en OCRE TERRE (#b5651d) f198-255
               (la SEULE couleur du beat = la vraie cause qui se colore quand on la nomme).
               Deux couches : (1) plaques en ocre qui s'allument, (2) reseau d'encre qui se trace. */}
          <g id="sol_craquele">
            {/* plaques ocre dessechees qui s'allument SOUS le reseau d'encre (fonds de plaque) */}
            <g opacity={ocreIn * 0.55}>
              <path
                d="M380 1400 L250 1395 L150 1430 L60 1500 L150 1620 L320 1640 L460 1560 L420 1450 Z"
                fill={OCRE_TERRE}
                stroke="none"
              />
              <path
                d="M460 1560 L600 1530 L760 1560 L850 1650 L760 1780 L560 1800 L450 1700 Z"
                fill={OCRE_TERRE}
                stroke="none"
              />
              <path
                d="M520 1410 L680 1390 L850 1420 L940 1500 L850 1560 L660 1540 L520 1500 Z"
                fill={OCRE_TERRE}
                stroke="none"
              />
              <path
                d="M150 1620 L60 1700 L120 1820 L300 1840 L320 1640 Z"
                fill={OCRE_TERRE}
                stroke="none"
              />
              <path
                d="M850 1560 L1000 1540 L1040 1660 L960 1790 L760 1780 L850 1650 Z"
                fill={OCRE_TERRE}
                stroke="none"
              />
            </g>
            {/* reseau de craquelures principal (encre) — se-trace */}
            <g>
              <path
                d="M530 1400 L500 1480 L530 1580 L490 1700 L540 1810 L500 1920"
                fill="none"
                stroke={ENCRE}
                strokeWidth={7}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={DASH}
                strokeDashoffset={crackDraw}
              />
              <path
                d="M500 1400 L400 1450 L360 1560 L220 1650 L190 1780 L60 1920"
                fill="none"
                stroke={ENCRE}
                strokeWidth={6}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={DASH}
                strokeDashoffset={crackDraw}
              />
              <path
                d="M560 1400 L660 1440 L730 1540 L880 1620 L930 1760 L1060 1920"
                fill="none"
                stroke={ENCRE}
                strokeWidth={7}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={DASH}
                strokeDashoffset={crackDraw}
              />
              <path
                d="M440 1410 L280 1400 L170 1440 L20 1395"
                fill="none"
                stroke={ENCRE}
                strokeWidth={5}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={DASH}
                strokeDashoffset={crackDraw}
              />
              <path
                d="M600 1410 L760 1390 L930 1420 L1080 1395"
                fill="none"
                stroke={ENCRE}
                strokeWidth={6}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={DASH}
                strokeDashoffset={crackDraw}
              />
            </g>
            {/* craquelures secondaires (encre, plus fines) — se-tracent un peu plus tard via le meme offset */}
            <g opacity={clampI(frame, [225, 270], [0, 1])}>
              <path
                d="M500 1480 L430 1520 L360 1560 M530 1580 L610 1610 L730 1540 M490 1700 L380 1730 L300 1840 M540 1810 L700 1830 L760 1920"
                fill="none"
                stroke={ENCRE}
                strokeWidth={4}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M280 1410 L220 1510 L210 1650 M730 1540 L800 1620 L870 1760 M400 1460 L450 1500 M660 1440 L600 1480"
                fill="none"
                stroke={ENCRE}
                strokeWidth={3}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M170 1450 L110 1560 L190 1640 M930 1430 L1010 1500 L960 1600 M120 1650 L60 1760 L160 1820 M960 1600 L1050 1640"
                fill="none"
                stroke={ENCRE}
                strokeWidth={2.4}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
            {/* petits eclats (impacts de secheresse) */}
            <path
              d="M420 1560 L450 1530 L440 1590 M520 1700 L500 1740 L545 1730 M620 1500 L590 1520"
              fill="none"
              stroke={ENCRE}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={clampI(frame, [240, 275], [0, 0.6])}
            />
          </g>

          {/* ---- AJUST 4 : PARTICULES DE POUSSIERE qui s'elevent des craquelures a leur illumination ----
               Frame-driven, discretes. Apparaissent ~f210-280 (avec l'ocre), montent (translateY haut),
               drift lateral, fade en montant = la terre qui part en poussiere, faute d'eau. */}
          <g id="poussiere">
            {DUST.map((d, i) => {
              const start = 210 + d.delay;
              const local = frame - start;
              if (local < 0) return null;
              const LIFE = 70;
              const p = interpolate(local, [0, LIFE], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              if (p >= 1) return null;
              const cy = d.y - d.rise * p; // monte
              const cx = d.x + d.drift * Math.sin(local / 16); // drift lateral
              // fade : apparait vite, disparait en montant
              const op = interpolate(p, [0, 0.15, 0.7, 1], [0, 0.5, 0.3, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const r = d.r * (1 - p * 0.4); // s'amenuise en montant
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={OCRE_TERRE}
                  opacity={op * ocreIn}
                />
              );
            })}
          </g>

          {/* ---- RACINES EXPOSEES (apparaissent f215-265, deja seches OCRE ; se recroquevillent au verdict) ---- */}
          <g
            id="racines"
            opacity={rootsIn}
            transform={`translate(${TREE.tx} ${TREE.ty}) scale(${TREE.s}) scale(${rootsCurl})`}
          >
            <Roots color={ocreIn > 0.3 ? OCRE_TERRE_D : ENCRE} />
          </g>

          {/* ---- L'ARBRE : vivant a l'installation (f10), s'affaisse au verdict (f330-440) ---- */}
          <g id="arbre">
            {treePop > 0.01 && (
              <g
                transform={`translate(${TREE.tx} ${TREE.ty}) scale(${TREE.s * treePop}) rotate(${treeSlump} 0 -300)`}
              >
                {/* tronc (encre/brun) */}
                <TreeTrunk trunk="#3a2a1a" />
                {/* houppier : vert tendre -> gris (leafGrey), se retracte (crownShrink) au verdict */}
                <g
                  transform={`translate(20 -55) scale(${crownShrink})`}
                  style={{ transformOrigin: "0px -305px" }}
                >
                  <LeafyCrown fill={crownFill} stroke={crownStroke} />
                </g>
              </g>
            )}
          </g>
        </g>
        {/* ============ /MONDE ============ */}
      </svg>

      {/* ============ SOUS-TITRES FIXES (AJUST 5 — bas centre, zone safe) ============
          Phrase entiere par segment, fade in/out (plus de karaoke mot-a-mot). Fond parchemin
          semi-transparent, Georgia ~37px, accents FR, chiffres en lettres. Le mot/groupe d'accent
          est colore en VERT du Beat 2 (#3e8f34) pour la continuite visuelle. */}
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
            {/* KARAOKE mot-a-mot (pattern Beat 2) : mot pas dit = encre pale ;
                mot deja dit = encre pleine ; mot EN COURS = VERT du Beat 2. */}
            {activePhrase.words.map((w, i) => {
              const spoken = narrationSec >= w.start;
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

      {/* ============ MICRO-SOURCES (sous le sous-titre, centree — INCHANGE) ============ */}
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

export default B3Malentendu;
