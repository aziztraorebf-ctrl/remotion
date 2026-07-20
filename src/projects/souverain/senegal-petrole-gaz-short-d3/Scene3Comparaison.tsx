// Scene3Comparaison — Short Senegal Petrole Gaz D3 — CLIMAX (~25.44s -> ~76.58s narration)
//
// Climax narratif du script : INTOUCHABLE, ne jamais couper ni resumer. 3 pays, meme mecanisme
// repete (contour se dessine -> drapeau REMPLIT le contour exact, pattern CountryFlagFill/AES
// reveal, mais asset LOCAL staticFile au lieu de flagcdn reseau -> coffre-fort se verrouille ou
// reste ouvert -> verdict). Norvege/Botswana = coffre verrouille (reussite) ; Congo-Brazzaville =
// coffre ouvert/brise (echec), meme ressource, meme epoque, verdict oppose.
//
// Structure narrative (whisper-words-senegal-short.ts) :
//   NORVEGE   26.34s -> 42.32s : decouverte 1969 -> coffre verrouille -> "un des pays les plus riches"
//   CONGO     43.30s -> 53.96s : "a la meme epoque" -> sans coffre -> "aspire par une dette sans fond"
//   BOTSWANA  54.88s -> 67.02s : diamants 1966, meme regle stricte -> "stabilite durable"
//   PONT      68.00s -> 76.58s : "la trajectoire ne depend jamais de la ressource... des regles
//             verrouillees avant que l'argent n'arrive" -> sortie vers Beat 4 (FONSIS)
//
// Contour COLORE (retour Aziz, cf. liseré AES) — pas navy fin comme Beat 1/2, un liseré GOLD
// visible qui donne au contour sa propre presence avant meme le remplissage drapeau.
// Coffre-fort : ⛔ NE PLUS utiliser icons-coffre-gptsol.json (SVG plat GPT-5.6 Sol, aucune
// structure de groupe rig-first — porte et corps non separables, impossible a animer proprement).
// Retour Aziz (2e passe) : coffre CENTRAL/geant (au milieu du cadre, pas ancre au territoire) +
// animation reelle (porte qui pivote, dessin progressif) -> reconstruit en JSX pur (composant
// CoffreFortAnime plus bas), corps+porte en <g> separes avec pivot SVG natif rotate(angle,cx,cy)
// (pattern repris de EffetDomino.tsx, _shared/components/layouts/), piloté frame-driven.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, staticFile } from "remotion";
import { NORWAY_PATH, NORWAY_PATH_LEN, NORWAY_CENTROID } from "./norwayPath";
import { CONGO_PATH, CONGO_PATH_LEN, CONGO_CENTROID } from "./congoPath";
import { BOTSWANA_PATH, BOTSWANA_PATH_LEN, BOTSWANA_CENTROID } from "./botswanaPath";
import { WHISPER_WORDS } from "./whisper-words-senegal-short";
import { buildDisplayWords, type DispWord } from "../cacao-chocolat-short/audio/karaokeWords";

const W = 1080;
const H = 1920;

const PARCH = "#e4ddca";
const PARCH_DARK = "#d6cdb4";
const GRID = "#c2a96a";
const NAVY = "#16213a";
const GOLD = "#c8a951";
const GOLD_BRIGHT = "#e3c068";
const IVORY = "#f2ebd9";
const SLATE = "#8b9bb4";
const RED = "#7a1f1f";

// ── Calage frames @30fps, T_OFFSET=25.44s (fin de Scene2Paradoxe) ──
const T_OFFSET = 25.44;
const t2f = (abs: number) => Math.round((abs - T_OFFSET) * 30);

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── 3 pays : geometrie, calage temporel, verdict (coffre ferme/ouvert), couleur de verdict ──
type PaysVerdict = "verrouille" | "ouvert";

type PaysDef = {
  key: string;
  name: string;
  path: string;
  pathLen: number; // strokeDasharray reel du path — chaque pays a une longueur tres differente
  centroid: [number, number];
  flagCode: string;
  bbox: { x0: number; y0: number; x1: number; y1: number }; // bbox reelle mesuree (boite 900x700)
  fIn: number; // debut : contour se dessine
  fFlag: number; // drapeau remplit le contour
  fVerdictIcon: number; // coffre apparait
  fOut: number; // fin de ce pays (fade vers le suivant)
  verdict: PaysVerdict;
  yearText: string;
};

// bbox mesurees via le script d'extraction (bounds geoPath, boite 900x700) :
// Norvege (continent seul, Svalbard exclu) x[335.45,564.56] y[40,660] · Congo x[183.09,716.91] y[40,660] · Botswana x[153.52,746.48] y[40,660]
const PAYS: PaysDef[] = [
  {
    key: "norvege",
    name: "NORVÈGE",
    path: NORWAY_PATH,
    pathLen: NORWAY_PATH_LEN,
    centroid: NORWAY_CENTROID as [number, number],
    flagCode: "no",
    bbox: { x0: 335.45, y0: 40, x1: 564.56, y1: 660 },
    fIn: t2f(26.34),
    fFlag: t2f(27.6),
    fVerdictIcon: t2f(33.0),
    fOut: t2f(42.0), // panel totalement sorti (fadeout 22f) avant fIn Congo (43.3s) — evite le chevauchement
    verdict: "verrouille",
    yearText: "1969",
  },
  {
    key: "congo",
    name: "CONGO-BRAZZAVILLE",
    path: CONGO_PATH,
    pathLen: CONGO_PATH_LEN,
    centroid: CONGO_CENTROID as [number, number],
    flagCode: "cg",
    bbox: { x0: 183.09, y0: 40, x1: 716.91, y1: 660 },
    fIn: t2f(43.3),
    fFlag: t2f(44.5),
    fVerdictIcon: t2f(48.44),
    fOut: t2f(53.5), // idem : sorti avant fIn Botswana (54.88s)
    verdict: "ouvert",
    yearText: "MÊME ÉPOQUE",
  },
  {
    key: "botswana",
    name: "BOTSWANA",
    path: BOTSWANA_PATH,
    pathLen: BOTSWANA_PATH_LEN,
    centroid: BOTSWANA_CENTROID as [number, number],
    flagCode: "bw",
    bbox: { x0: 153.52, y0: 40, x1: 746.48, y1: 660 },
    fIn: t2f(54.88),
    fFlag: t2f(56.2),
    fVerdictIcon: t2f(60.32),
    fOut: t2f(67.3), // idem : sorti avant F_PONT_IN (68.0s)
    verdict: "verrouille",
    yearText: "1966 · DIAMANTS",
  },
];

const F_PONT_IN = t2f(68.0); // "La trajectoire d'un pays ne depend jamais..."
const F_PONT_LINE2 = t2f(72.24); // "Elle depend des regles verrouillees..."
const F_EXIT_START = t2f(75.6);
const F_TOTAL = t2f(76.58);

// Calage repris du meme pattern AES (fitExtent [[40,40],[860,660]] boite 900x700) que norwayPath/
// congoPath/botswanaPath — le plus contraignant des deux axes definit le scale (meme logique que
// MAP_SCALE de Scene1Hook/Scene2Paradoxe). Retour Aziz : le format 9:16 a beaucoup de hauteur libre —
// agrandir 2-3x (H*0.94) plutot que forcer une petite carte au milieu d'un cadre vide, y compris pour
// la Norvege fragmentee (Nord/Sud separes) : chaque masse devient grande et lisible individuellement.
function fitScale(bbox: { x0: number; y0: number; x1: number; y1: number }) {
  const bw = bbox.x1 - bbox.x0;
  const bh = bbox.y1 - bbox.y0;
  return Math.min((W * 0.9) / bw, (H * 0.94) / bh);
}

const GRID_STEP = 140;
const GRID_OFFSET_X = 30;
const GRID_OFFSET_Y = 20;

// ── Sous-titres karaoke (meme pattern que Scene1Hook/Scene2Paradoxe) ──
const SPELL_FIX: Record<string, string> = {};
const WORDS_FIXED = WHISPER_WORDS.map((w) => ({ ...w, word: SPELL_FIX[w.word] ?? w.word }));
const DISP: DispWord[] = buildDisplayWords(WORDS_FIXED);

type Phrase = { words: DispWord[]; start: number; end: number };
// Retour Aziz : MAX_WORDS=5 regroupait des mots a durees tres inegales (ex: "soixante-neuf,"
// dure 1.26s a lui seul, suivi de 4 mots courts rapproches) — le karaoke "rattrapait" plusieurs
// mots d'un coup en fin de phrase (effet "bloc qui claque"). Reduit a 3 pour ce beat (script riche
// en nombres composes en toutes lettres) — phrases plus courtes, rythme plus regulier.
const MAX_WORDS = 3;
const PAUSE_GAP = 0.42;

function buildPhrases(disp: DispWord[], windowStart: number, windowEnd: number): Phrase[] {
  const out: Phrase[] = [];
  let cur: DispWord[] = [];
  for (let i = 0; i < disp.length; i++) {
    const w = disp[i];
    if (!w.text || w.start < windowStart) continue;
    if (w.start >= windowEnd) break;
    cur.push(w);
    const next = disp[i + 1];
    const gap = next ? next.start - w.end : Infinity;
    if (cur.length >= MAX_WORDS || gap >= PAUSE_GAP || !next || next.start >= windowEnd) {
      out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
      cur = [];
    }
  }
  return out;
}
const PHRASES = buildPhrases(DISP, T_OFFSET, 76.58);

const KaraokeSubtitles: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const t = frame / fps + T_OFFSET;
  const phrase = PHRASES.find((p) => t >= p.start - 0.15 && t <= p.end + 0.35) ?? null;
  if (!phrase) return null;

  const opacity = interpolate(
    t,
    [phrase.start - 0.15, phrase.start + 0.08, phrase.end + 0.18, phrase.end + 0.35],
    [0, 1, 1, 0],
    clamp
  );
  if (opacity <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 140,
        transform: "translateX(-50%)",
        maxWidth: "90%",
        textAlign: "center",
        opacity,
        zIndex: 100,
        background: "rgba(11,18,32,0.72)",
        borderRadius: 16,
        padding: "14px 30px",
        boxShadow: "0 6px 26px rgba(0,0,0,0.5)",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          fontFamily: "'Bebas Neue','Impact',sans-serif",
          fontSize: 52,
          letterSpacing: 1.5,
          lineHeight: 1.1,
          textShadow: "0 2px 12px rgba(0,0,0,0.95)",
        }}
      >
        {phrase.words.map((w, i) => {
          const spoken = t >= w.start - 0.02;
          return (
            <span key={i} style={{ color: spoken ? GOLD_BRIGHT : IVORY, opacity: spoken ? 1 : 0.5, marginRight: 12 }}>
              {w.text}
            </span>
          );
        })}
      </span>
    </div>
  );
};

// ── Coffre-fort ANIME — JSX pur, geometrie CIRCULAIRE (2026-07-16, 4e passe) — Aziz a fourni 2
// references visuelles precises (icone plate + photo 3D d'un coffre bancaire) apres 3 tentatives
// rectangulaires ratees : la porte est un DISQUE (pas un rectangle) qui pivote sur un axe VERTICAL
// excentre sur son bord droit, et reste TOUJOURS a la meme hauteur Y — jamais de debordement
// vertical, jamais de detachement, exactement le "door swing" d'une vraie porte de coffre bancaire.
//
// Principe geometrique (verifie par calcul AVANT tout render, 2 iterations de calcul necessaires) :
// le CORPS est un disque FIXE de rayon COFFRE_INNER_R (couvre la cavite visible). La PORTE (fermee)
// = un disque IDENTIQUE, centre sur (0,0), qui couvre exactement la cavite. La charniere est un point
// FIXE sur le bord DROIT de ce disque (x=COFFRE_INNER_R, y=0). Quand la porte s'ouvre, ce n'est PAS
// son centre qui reste fixe (1ere version testee par calcul, ECHEC : donnait un disque trop petit qui
// ne couvre plus la cavite une fois "fermee") — c'est son BORD (la charniere) qui reste fixe, et le
// CENTRE du disque qui se deplace horizontalement pour compenser le retrecissement en largeur
// (centre_x = COFFRE_INNER_R * (1 - scaleX)). A scaleX=1 (fermee) : centre_x=0, couvre toute la
// cavite. A scaleX proche de 0 (ouverte) : centre_x -> COFFRE_INNER_R, le disque s'ecrase pile sur la
// charniere — jamais detache, jamais deborde verticalement (Y du centre = 0 en permanence).
const COFFRE_R = 105; // rayon du corps (anneau exterieur, cf. rendu)
const COFFRE_INNER_R = COFFRE_R * 0.78; // rayon de la cavite/porte (fermee, couvre exactement ce disque)
const DOOR_HINGE_X = COFFRE_INNER_R; // charniere = bord DROIT du disque-porte (fixe, jamais anime)

const CoffreFortAnime: React.FC<{
  frame: number;
  fps: number;
  cx: number;
  cy: number;
  fIn: number; // debut : corps se dessine
  fCloseStart: number | null; // debut de la fermeture de la porte (Norvege/Botswana). null = reste ouvert (Congo)
  showDiamonds: boolean; // Botswana : diamants visibles quand la porte est ouverte
  showGoldBars: boolean; // Norvege : lingots+pieces d'or visibles quand la porte est ouverte
  scale: number;
}> = ({ frame, fps, cx, cy, fIn, fCloseStart, showDiamonds, showGoldBars, scale }) => {
  const local = frame - fIn;
  if (local < -2) return null;

  // corps : dessin progressif (stroke-dashoffset), meme mecanique que le contour des pays.
  const bodyDrawLen = 660; // perimetre du cercle (2*pi*105 ~= 660)
  const bodyDrawT = interpolate(local, [0, 46], [0, 1], clamp);
  const bodyOp = interpolate(local, [-2, 6], [0, 1], clamp);

  // pop d'entree global (scale), adouci.
  const popSpring = spring({ fps, frame: Math.max(0, local), config: { damping: 16, stiffness: 80 } });
  const popScale = interpolate(popSpring, [0, 1], [0.4, 1]);

  // porte : VISIBLE DES LE DEBUT (calee sur bodyOp), ouverte par defaut, se ferme a partir de
  // fCloseStart si defini. Congo (fCloseStart=null) : reste ouverte en permanence.
  const closeLocal = fCloseStart !== null ? frame - fCloseStart : null;
  const doorCloseT =
    closeLocal !== null ? interpolate(closeLocal, [0, 22], [0, 1], clamp) : 0;
  // scaleX du disque-porte : 0.06 (ouverte, quasi sur la tranche) -> 1 (fermee, disque plein couvrant
  // la cavite). Le BORD DROIT du disque (charniere, x=DOOR_HINGE_X) reste fixe -- c'est le CENTRE du
  // disque qui se deplace en x pour compenser (cf. doorCenterX ci-dessous), pas l'inverse (1ere
  // version testee et invalidee par calcul : centre fixe -> disque trop petit une fois "fermee",
  // ne couvrait plus la cavite). Le Y du centre reste 0 en permanence quel que soit scaleX -- garantit
  // structurellement l'absence de debordement vertical.
  const doorScaleX = interpolate(doorCloseT, [0, 1], [0.06, 1], clamp);
  const doorCenterX = DOOR_HINGE_X * (1 - doorScaleX);
  const doorOp = bodyOp;

  // cadran : tourne (verrouillage) juste apres la fermeture complete de la porte
  const lockLocal = closeLocal !== null ? closeLocal - 24 : null;
  const lockRotation =
    lockLocal !== null ? interpolate(lockLocal, [0, 16], [0, 360], clamp) : 0;
  const isLocked = closeLocal !== null && doorCloseT >= 1;

  // contenu interieur (diamants OU lingots) : visible seulement porte ouverte, disparait a la fermeture
  const contentOp = (showDiamonds || showGoldBars) ? interpolate(doorCloseT, [0, 0.3], [1, 0], clamp) * bodyOp : 0;

  const strokeCol = isLocked ? GOLD_BRIGHT : IVORY;
  const doorR = COFFRE_INNER_R; // rayon du disque-porte = rayon de la cavite (couvre exactement, fermee)

  return (
    <g transform={`translate(${cx},${cy}) scale(${scale * popScale})`} opacity={bodyOp}>
      {/* halo respirant */}
      <circle
        r={COFFRE_R * 1.3}
        fill="none"
        stroke={isLocked ? GOLD_BRIGHT : RED}
        strokeWidth={2.5}
        strokeDasharray="10 12"
        opacity={0.4 + 0.12 * Math.sin(local * 0.07)}
      />

      {/* CORPS — un seul disque FIXE, jamais anime, centre sur (0,0). Fond visible = la CAVITE elle-meme
          (contenu pose dessus quand la porte est ouverte, pas de rectangle interieur separe). */}
      <circle r={COFFRE_R} fill={NAVY} stroke={GOLD} strokeWidth={3} />
      <circle r={COFFRE_R * 0.78} fill="#111a30" stroke={GOLD} strokeWidth={2} />
      <g fill={GOLD_BRIGHT} stroke={NAVY} strokeWidth={1.5}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * 45 * Math.PI) / 180;
          return <circle key={i} cx={COFFRE_R * 0.93 * Math.cos(a)} cy={COFFRE_R * 0.93 * Math.sin(a)} r={4} />;
        })}
      </g>

      {/* contour dessin progressif du corps — overlay anime par-dessus le fill plein */}
      <circle
        r={COFFRE_R}
        fill="none"
        stroke={IVORY}
        strokeWidth={2.5}
        strokeDasharray={bodyDrawLen}
        strokeDashoffset={bodyDrawLen * (1 - bodyDrawT)}
      />

      {/* contenu interieur (visible porte ouverte, centre du corps, derriere la porte) */}
      {showDiamonds && contentOp > 0.01 && (
        <g transform="scale(1.5)" opacity={contentOp}>
          <g transform="translate(-15, -10) scale(1.2)"><polygon points="0,-12 6,-6 2,-2 0,-4" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="6,-6 12,0 4,0 2,-2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="12,0 6,6 2,2 4,0" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="6,6 0,12 0,4 2,2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="0,12 -6,6 -2,2 0,4" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="-6,6 -12,0 -4,0 -2,2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="-12,0 -6,-6 -2,-2 -4,0" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="-6,-6 0,-12 0,-4 -2,-2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="0,-4 2,-2 4,0 2,2 0,4 -2,2 -4,0 -2,-2" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="-1,-2.5 1,-2.5 0.5,-1 -0.5,-1" fill="#ffffff"/></g>
          <g transform="translate(15, 12) scale(0.9) rotate(25)"><polygon points="0,-12 6,-6 2,-2 0,-4" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="6,-6 12,0 4,0 2,-2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="12,0 6,6 2,2 4,0" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="6,6 0,12 0,4 2,2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="0,12 -6,6 -2,2 0,4" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="-6,6 -12,0 -4,0 -2,2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="-12,0 -6,-6 -2,-2 -4,0" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="-6,-6 0,-12 0,-4 -2,-2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="0,-4 2,-2 4,0 2,2 0,4 -2,2 -4,0 -2,-2" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="-1,-2.5 1,-2.5 0.5,-1 -0.5,-1" fill="#ffffff"/></g>
          <g transform="translate(-5, 18) scale(0.6) rotate(-15)"><polygon points="0,-12 6,-6 2,-2 0,-4" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="6,-6 12,0 4,0 2,-2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="12,0 6,6 2,2 4,0" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="6,6 0,12 0,4 2,2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="0,12 -6,6 -2,2 0,4" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="-6,6 -12,0 -4,0 -2,2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="-12,0 -6,-6 -2,-2 -4,0" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="-6,-6 0,-12 0,-4 -2,-2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="0,-4 2,-2 4,0 2,2 0,4 -2,2 -4,0 -2,-2" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/></g>
          <g transform="translate(8, -15) scale(0.75) rotate(40)"><polygon points="0,-12 6,-6 2,-2 0,-4" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="6,-6 12,0 4,0 2,-2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="12,0 6,6 2,2 4,0" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="6,6 0,12 0,4 2,2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="0,12 -6,6 -2,2 0,4" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="-6,6 -12,0 -4,0 -2,2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="-12,0 -6,-6 -2,-2 -4,0" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="-6,-6 0,-12 0,-4 -2,-2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="0,-4 2,-2 4,0 2,2 0,4 -2,2 -4,0 -2,-2" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/></g>
          <g transform="translate(20, 0) scale(0.5) rotate(10)"><polygon points="0,-12 6,-6 2,-2 0,-4" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="6,-6 12,0 4,0 2,-2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="12,0 6,6 2,2 4,0" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="6,6 0,12 0,4 2,2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="0,12 -6,6 -2,2 0,4" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="-6,6 -12,0 -4,0 -2,2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="-12,0 -6,-6 -2,-2 -4,0" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/><polygon points="-6,-6 0,-12 0,-4 -2,-2" fill="#b8c9d9" stroke={IVORY} strokeWidth={0.5}/><polygon points="0,-4 2,-2 4,0 2,2 0,4 -2,2 -4,0 -2,-2" fill="#eaf2f8" stroke={IVORY} strokeWidth={0.5}/></g>
        </g>
      )}
      {showGoldBars && contentOp > 0.01 && (
        <g transform="scale(1.5)" opacity={contentOp}>
          <g transform="translate(-8, 16)"><polygon points="-14,-6 14,-6 9,-10 -9,-10" fill={GOLD_BRIGHT} stroke="#9c7f3f" strokeWidth={0.5}/><polygon points="-14,-6 14,-6 18,6 -18,6" fill={GOLD} stroke="#9c7f3f" strokeWidth={0.5}/><polygon points="14,-6 18,6 13,2 9,-10" fill="#9c7f3f" stroke="#6e5a2e" strokeWidth={0.5}/></g>
          <g transform="translate(-4, 4)"><polygon points="-13,-6 13,-6 8.5,-10 -8.5,-10" fill={GOLD_BRIGHT} stroke="#9c7f3f" strokeWidth={0.5}/><polygon points="-13,-6 13,-6 17,6 -17,6" fill={GOLD} stroke="#9c7f3f" strokeWidth={0.5}/><polygon points="13,-6 17,6 12,2 8.5,-10" fill="#9c7f3f" stroke="#6e5a2e" strokeWidth={0.5}/></g>
          <g transform="translate(0, -8)"><polygon points="-12,-6 12,-6 8,-10 -8,-10" fill={GOLD_BRIGHT} stroke="#9c7f3f" strokeWidth={0.5}/><polygon points="-12,-6 12,-6 16,6 -16,6" fill={GOLD} stroke="#9c7f3f" strokeWidth={0.5}/><polygon points="12,-6 16,6 11,2 8,-10" fill="#9c7f3f" stroke="#6e5a2e" strokeWidth={0.5}/></g>
          <g transform="translate(-24, 22)"><circle cx={0} cy={0} r={6} fill={GOLD} stroke={GOLD_BRIGHT} strokeWidth={1.5}/><polygon points="0,-3.5 1,-1 3.5,-0.8 1.5,0.8 2,3.5 0,1.5 -2,3.5 -1.5,0.8 -3.5,-0.8 -1,-1" fill="#9c7f3f"/></g>
          <g transform="translate(22, 24) scale(0.85)"><circle cx={0} cy={0} r={6} fill={GOLD} stroke={GOLD_BRIGHT} strokeWidth={1.5}/><polygon points="0,-3.5 1,-1 3.5,-0.8 1.5,0.8 2,3.5 0,1.5 -2,3.5 -1.5,0.8 -3.5,-0.8 -1,-1" fill="#9c7f3f"/></g>
          <g transform="translate(20, -18) scale(0.65)"><circle cx={0} cy={0} r={6} fill={GOLD} stroke={GOLD_BRIGHT} strokeWidth={1.5}/><polygon points="0,-3.5 1,-1 3.5,-0.8 1.5,0.8 2,3.5 0,1.5 -2,3.5 -1.5,0.8 -3.5,-0.8 -1,-1" fill="#9c7f3f"/></g>
        </g>
      )}

      {/* PORTE — disque dessine centre sur (0,0) (PAS sur DOOR_HINGE_X — piege verifie et corrige par
          calcul : dessiner a DOOR_HINGE_X en plus du transform double-decalait le disque). Le transform
          translate(H,0) scale(sx,1) translate(-H,0) envoie le centre (0,0) vers x=H*(1-sx) -- a sx=1
          (fermee) le disque atterrit exactement sur (0,0), couvrant toute la cavite ; a sx proche de 0
          (ouverte) il atterrit sur (H,0) = la charniere, ecrase en largeur (vue "sur la tranche",
          exactement les references Aziz). Le bord DROIT du disque (x=H a sx=1, x=H aussi a sx=0 par
          construction du calcul) reste EXACTEMENT fixe sur la charniere a tout scaleX -- verifie par
          calcul avant render, pas juste visuellement. Y ne bouge jamais : zero debordement vertical. */}
      {doorOp > 0.01 && (
        <g
          opacity={doorOp}
          transform={`translate(${DOOR_HINGE_X},0) scale(${doorScaleX},1) translate(${-DOOR_HINGE_X},0)`}
        >
          <circle cx={0} cy={0} r={doorR} fill={NAVY} stroke={strokeCol} strokeWidth={3.5} />
          <circle cx={0} cy={0} r={doorR * 0.9} fill="#1b2947" stroke={IVORY} strokeWidth={2} />
          <g fill={GOLD_BRIGHT} stroke={NAVY} strokeWidth={1.5}>
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * 45 * Math.PI) / 180;
              return <circle key={i} cx={doorR * 0.93 * Math.cos(a)} cy={doorR * 0.93 * Math.sin(a)} r={4} />;
            })}
          </g>
          {/* cadran : centre du disque-porte (0,0 dans ce repere), tourne au verrouillage independamment
              de l'ouverture */}
          <g transform={`rotate(${lockRotation})`}>
            <circle r={38} fill="#111a30" stroke={GOLD} strokeWidth={3} />
            <circle r={31} fill={NAVY} stroke={IVORY} strokeWidth={2} />
            <g stroke={GOLD_BRIGHT} strokeWidth={2}>
              {Array.from({ length: 12 }, (_, i) => (
                <line key={i} x1={0} y1={-28} x2={0} y2={-35} transform={`rotate(${i * 30})`} />
              ))}
            </g>
            <circle r={11} fill={GOLD} stroke={IVORY} strokeWidth={2.5} />
            <circle r={4} fill={NAVY} stroke={IVORY} strokeWidth={2} />
            <path d="M0-11L-3-19H3Z" fill={GOLD_BRIGHT} stroke={NAVY} strokeWidth={1} />
          </g>
        </g>
      )}

      {/* charniere fixe visible sur le bord droit du corps, PILE sur le cercle a cette abscisse
          (y = sqrt(R^2 - DOOR_HINGE_X^2), verifie par calcul, PAS une valeur arbitraire) — ne bouge
          jamais, ancrage visuel permanent de la porte a tout angle/scaleX. */}
      <g fill={GOLD} stroke={IVORY} strokeWidth={2}>
        <rect x={DOOR_HINGE_X - 6} y={-Math.sqrt(COFFRE_R ** 2 - DOOR_HINGE_X ** 2) - 13} width={12} height={26} rx={4} />
        <rect x={DOOR_HINGE_X - 6} y={Math.sqrt(COFFRE_R ** 2 - DOOR_HINGE_X ** 2) - 13} width={12} height={26} rx={4} />
      </g>
    </g>
  );
};

// ── Un pays complet : contour se dessine -> drapeau remplit le contour exact -> coffre -> verdict ──
const PaysPanel: React.FC<{ frame: number; fps: number; def: PaysDef }> = ({ frame, fps, def }) => {
  const local = frame - def.fIn;
  const localOut = frame - def.fOut;
  if (local < -2 || localOut > 14) return null;

  const scale = fitScale(def.bbox);
  const bboxCx = (def.bbox.x0 + def.bbox.x1) / 2;
  const bboxCy = (def.bbox.y0 + def.bbox.y1) / 2;
  const mapX = W / 2 - bboxCx * scale;
  const mapY = H * 0.52 - bboxCy * scale;

  // panneau entier : fade in doux, fade out COMPLET avant l'entree du pays suivant (marge de 22-30f
  // reservee entre fOut et le fIn suivant — cf. retour Aziz, chevauchement Norvege/Congo corrige)
  const panelIn = interpolate(local, [0, 10], [0, 1], clamp);
  const panelOut = interpolate(localOut, [0, 14], [1, 0], clamp);
  const panelOp = Math.min(panelIn, panelOut);
  if (panelOp <= 0.001) return null;

  // contour : trace anime (stroke-dashoffset). pathLen REEL par pays (pas une constante partagee —
  // la Norvege fragmentee (27076) est ~9x plus longue que le Botswana compact (3080), un drawLen
  // fixe laissait le tracé de la Norvege visiblement incomplet). Duree du tracé proportionnelle a la
  // longueur du path (sinon la Norvege semble "sauter" d'un coup), plafonnee pour ne pas mordre sur
  // fFlag (drapeau doit arriver une fois le tracé fini, cf. fenetre fIn->fFlag de chaque pays).
  const drawLen = def.pathLen * 1.05;
  const drawDur = Math.min(34, Math.max(18, Math.round(def.pathLen / 500)));
  const drawT = interpolate(local, [0, drawDur], [0, 1], clamp);

  // drapeau : remplit le contour exact une fois le trace fini
  const flagLocal = frame - def.fFlag;
  const flagOp = interpolate(flagLocal, [0, 14], [0, 1], clamp);
  const flagScale = spring({ fps, frame: Math.max(0, flagLocal), config: { damping: 14, stiffness: 110 } });

  // nom du pays + annee, en tete de panneau
  const nameOp = interpolate(local, [2, 10], [0, 1], clamp);

  const clipId = `s3flag-clip-${def.key}`;
  // Coffre CENTRE DE L'ECRAN (retour Aziz, 2e passe : "au milieu, la ou la fleche pointe" —
  // pas ancre au territoire du pays) — element geant qui devient le sujet principal du moment,
  // la carte devient arriere-plan/contexte. Meme position pour les 3 pays (coherence de lecture).
  const coffreCx = W / 2;
  const coffreCy = H * 0.5;
  const coffreScaleGlobal = 1.16; // reduit ~25% vs v4 (1.55) — retour Aziz, coffre juge trop gros a l'ecran
  // fermeture de la porte SEULEMENT pour Norvege/Botswana (verrouille) — Congo reste ouvert en
  // permanence (coherent avec "sans coffre verrouille, cet argent s'evapore"). +46 (pas +30) : laisse
  // le temps a la porte de finir son fade-in (doorOp termine a local=36, cf. CoffreFortAnime) avant de
  // commencer a se refermer — a +30 la fermeture demarrait AVANT la fin du fade-in (doorOp encore a
  // ~0.4), rendant la porte semi-transparente et lue a tort comme grise/desaturee (bug de timing
  // decouvert au render de verification, pas un bug de couleur).
  const fCloseStart = def.verdict === "verrouille" ? def.fVerdictIcon + 46 : null;

  return (
    <AbsoluteFill style={{ opacity: panelOp }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id={clipId}>
            <path d={def.path} />
          </clipPath>
        </defs>

        {/* CARTE — dessinee AVANT le bandeau titre (z-order, cf. plus bas) et avant le coffre-fort
            (le coffre se detache par son propre disque navy plein, pas par un fondu de la carte). */}
        <g transform={`translate(${mapX},${mapY}) scale(${scale})`}>
          {/* contour COLORE gold — liseré visible avant meme le remplissage drapeau (retour Aziz) */}
          <path
            d={def.path}
            fill="none"
            stroke={GOLD}
            strokeWidth={5 / scale}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={drawLen}
            strokeDashoffset={drawLen * (1 - drawT)}
          />
          {/* liseré interne fin navy, contraste sur le gold une fois trace */}
          <path
            d={def.path}
            fill="none"
            stroke={NAVY}
            strokeWidth={1.4 / scale}
            opacity={drawT >= 1 ? 0.5 : 0}
          />

          {/* drapeau REMPLIT le contour exact — asset local staticFile, pas de fetch reseau (headless-safe) */}
          {flagOp > 0.01 && (
            <g
              opacity={flagOp}
              style={{ transformOrigin: `${def.centroid[0]}px ${def.centroid[1]}px` }}
              transform={`scale(${flagScale})`}
            >
              <g clipPath={`url(#${clipId})`}>
                <image
                  href={staticFile(`_shared/flags/${def.flagCode}.png`)}
                  x={def.bbox.x0}
                  y={def.bbox.y0}
                  width={def.bbox.x1 - def.bbox.x0}
                  height={def.bbox.y1 - def.bbox.y0}
                  preserveAspectRatio="xMidYMid slice"
                />
              </g>
            </g>
          )}
        </g>

        {/* coffre-fort ANIME — centre du cadre, geant (retour Aziz 2e passe), SVG rig-first Sol
            (corps/porte/cadran reellement imbriques), dessin progressif + porte qui pivote et se
            ferme + verrou qui tourne (Norvege/Botswana). Contenu visible porte ouverte : diamants
            (Botswana) ou lingots+pieces d'or (Norvege, fonds souverain petrolier — retour Aziz). Congo :
            reste ouvert en permanence, jamais verrouille, jamais de contenu (coffre absent du recit). */}
        <CoffreFortAnime
          frame={frame}
          fps={fps}
          cx={coffreCx}
          cy={coffreCy}
          fIn={def.fVerdictIcon}
          fCloseStart={fCloseStart}
          showDiamonds={def.key === "botswana"}
          showGoldBars={def.key === "norvege"}
          scale={coffreScaleGlobal}
        />

        {/* nom du pays + annee — DERNIER dans l'ordre SVG = TOUJOURS au-dessus de la carte, meme
            quand un pays (Norvege fragmentee) deborde jusqu'en haut du cadre (retour Aziz, capture
            mobile : la pointe nord recouvrait le titre avant ce fix de z-order). Fond du bandeau a
            opacite PLEINE et INDEPENDANTE du fondu de texte (nameOp) — sinon le rect lui-meme
            devient semi-transparent pendant l'entree et laisse voir la carte au travers (2e bug
            verifie sur render reel : un "fantome" rouge de la Norvege restait visible sous le titre). */}
        <rect x={0} y={0} width={W} height={168} fill={PARCH} />
        <g opacity={nameOp}>
          <text x={W / 2} y={100} textAnchor="middle" fontFamily="'Bebas Neue','Impact',sans-serif" fontSize={64} letterSpacing={3} fill={NAVY}>
            {def.name}
          </text>
          <text x={W / 2} y={144} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize={24} letterSpacing={2} fill={SLATE}>
            {def.yearText}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ── Pont de sortie : "la trajectoire ne depend jamais de la ressource... des regles verrouillees" ──
// Retour Aziz (capture d'ecran) : texte juge minuscule (beaucoup d'espace vide autour) + apparition
// en bloc jugee trop abrupte. Fix : +50% taille (44->66px) + effet TYPEWRITER (caracteres reveles
// un par un via slice(), piloté frame par frame — jamais de CSS animation/@keyframes, regle du
// projet). Fond parchemin/grille inchange (continuite de registre deja tranchee plus tot).
const LINE1_A = "LA TRAJECTOIRE NE DÉPEND";
const LINE1_B = "JAMAIS DE LA RESSOURCE";
const LINE2_A = "DES RÈGLES VERROUILLÉES";
const LINE2_B = "AVANT QUE L'ARGENT N'ARRIVE";

// vitesse du typewriter : ~1.6 caracteres/frame (rapide mais lisible en gros caracteres)
const CHARS_PER_FRAME = 1.6;

function typewriterSlice(text: string, local: number, startFrame: number): string {
  const chars = Math.max(0, Math.floor((local - startFrame) * CHARS_PER_FRAME));
  return text.slice(0, chars);
}

const PontSortie: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - F_PONT_IN;
  if (local < -2) return null;

  const line1Op = interpolate(local, [0, 6], [0, 1], clamp);
  const line2Local = frame - F_PONT_LINE2;
  const line2Op = interpolate(line2Local, [0, 6], [0, 1], clamp);
  const exitOp = interpolate(frame, [F_EXIT_START, F_TOTAL], [1, 0], clamp);
  const overallOp = Math.min(Math.max(line1Op, line2Op), exitOp);
  if (overallOp <= 0.001) return null;

  // typewriter : ligne A puis ligne B de chaque bloc, decalees pour lire naturellement
  const l1a = typewriterSlice(LINE1_A, local, 0);
  const l1b = typewriterSlice(LINE1_B, local, LINE1_A.length / CHARS_PER_FRAME + 4);
  const l2a = typewriterSlice(LINE2_A, line2Local, 0);
  const l2b = typewriterSlice(LINE2_B, line2Local, LINE2_A.length / CHARS_PER_FRAME + 4);

  // curseur clignotant sur le dernier bloc en cours de frappe
  const blink = Math.floor(frame / 8) % 2 === 0;
  const line1Done = l1b.length >= LINE1_B.length;
  const line2Done = l2b.length >= LINE2_B.length;

  return (
    <AbsoluteFill style={{ opacity: overallOp, alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "90%", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'Bebas Neue','Impact',sans-serif",
            fontSize: 66,
            letterSpacing: 1.5,
            lineHeight: 1.25,
            color: NAVY,
            opacity: line1Op,
            textShadow: "0 2px 10px rgba(0,0,0,0.15)",
            minHeight: 66 * 1.25 * 2,
          }}
        >
          {l1a}
          {l1a.length >= LINE1_A.length ? <br /> : null}
          {l1b}
          {!line1Done && line1Op > 0.5 && blink ? <span style={{ opacity: 0.7 }}>|</span> : null}
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: "'Bebas Neue','Impact',sans-serif",
            fontSize: 66,
            letterSpacing: 1.5,
            lineHeight: 1.25,
            color: GOLD_BRIGHT,
            opacity: line2Op,
            background: NAVY,
            borderRadius: 18,
            padding: "14px 30px",
            display: "inline-block",
            minHeight: line2Op > 0.01 ? undefined : 0,
          }}
        >
          {l2a}
          {l2a.length >= LINE2_A.length ? <br /> : null}
          {l2b}
          {!line2Done && line2Op > 0.5 && blink ? <span style={{ opacity: 0.7 }}>|</span> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene3Comparaison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridV = Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_X + i * GRID_STEP);
  const gridH = Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_Y + i * GRID_STEP);

  const exitFade = interpolate(frame, [F_EXIT_START, F_TOTAL], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: PARCH, opacity: exitFade }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="s3paperTex">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="11" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.07" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>
        <rect width={W} height={H} fill={PARCH_DARK} filter="url(#s3paperTex)" opacity={0.4} />
        <g stroke={GRID} strokeWidth={1.4} opacity={0.6}>
          {gridV.map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />
          ))}
          {gridH.map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />
          ))}
        </g>
      </svg>

      {PAYS.map((def) => (
        <PaysPanel key={def.key} frame={frame} fps={fps} def={def} />
      ))}

      <PontSortie frame={frame} />

      <KaraokeSubtitles frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

export default Scene3Comparaison;
