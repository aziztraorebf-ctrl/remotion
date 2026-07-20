// Scene2Paradoxe — Short Senegal Petrole Gaz D3 — PARADOXE (~10.46s -> ~25.44s narration)
//
// V2 (retour Aziz + analyse Kimi/Gemini apres 1er test) :
//   - PAS de redessin de carte : continuite directe depuis la fin de Scene1Hook (rouge -> beige, meme
//     contour, pas de nouveau trace). Evite la redondance visuelle pointee par Aziz/Kimi/Gemini.
//   - Icones SVG blueprint (GPT-5.6 Sol, generees + validees Aziz) a la place des cercles generiques —
//     derrick Sangomar, torchere GTA, torchere pointillee Yakaar.
//   - Tuyaux animes (stroke-dashoffset) qui relient chaque gisement au 60% central : cree la RELATION
//     visuelle entre les elements (correction du "trop lineaire" — chaque element vivait isole avant).
//   - Jauge circulaire autour du 60% qui se remplit en meme temps que les tuyaux se tracent.
//
// Structure narrative (whisper-words-senegal-short.ts) :
//   "Le pays a mis la main sur trois gisements offshore" 10.46-12.96s : icones s'allument successivement
//   "L'État affirme toucher soixante pour cent des revenus" 13.64-16.44s : tuyaux + jauge + 60%
//   "Mais l'argent qui rentre ne garantit rien" 17.12-19.34s : le 60% se vide/s'estompe (fuite)
//   "Le vrai test... c'est le mécanisme qui capture cette richesse" 20.10-25.44s : rouage, pont Beat 3
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { SENEGAL_PATH, SENEGAL_PATH_LEN, SENEGAL_CENTROID } from "../../_proto-16-9/senegalPath";
import { WHISPER_WORDS } from "./whisper-words-senegal-short";
import { buildDisplayWords, type DispWord } from "../cacao-chocolat-short/audio/karaokeWords";
import ICONS_RAW from "./icons-gisements-gptsol.json";

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
const RED = "#7a1f1f"; // continuite depuis la fin de Scene1Hook
const OCRE_SETTLE = "#d2ad66"; // teinte de repos du fill carte — perceptible, distincte du fond PARCH

// ── Icones blueprint (GPT-5.6 Sol, validees Aziz) — SVG brut injecte via dangerouslySetInnerHTML ──
// FIX contraste (retour Aziz, session finale) : le trait principal etait en OR (#c8a951) sur fond
// PARCH (#e4ddca) — deux tons clairs proches en luminosite, le trait se noyait visuellement meme a
// grande taille (cause reelle des 3 rounds d'agrandissement precedents qui n'avaient pas suffi). On
// substitue le trait principal en NAVY (fonce, contraste fort sur parchemin/ocre) ; les accents deja
// en #16213a restent identiques (deja contrastes).
const ICONS_RAW_STR = JSON.stringify(ICONS_RAW);
const ICONS_HIGH_CONTRAST = JSON.parse(ICONS_RAW_STR.split("#c8a951").join("#16213a"));
const ICONS: Record<string, string> = ICONS_HIGH_CONTRAST.icons;

// ── Calage frames @30fps, T_OFFSET=9.6s (ce beat demarre a la fin du hook) ──
const T_OFFSET = 9.6;
const t2f = (abs: number) => Math.round((abs - T_OFFSET) * 30);

const F_FADE_IN = 0;                    // continuite rouge -> beige (PAS de redessin)
// FIX transition (retour Aziz + 2 agents creative-director convergents) : le mix RGB lineaire
// rouge->creme traversait une zone mauve/desaturee des le depart du fondu (cause verifiee : le canal
// R chute vite, G/B montent lentement, l'etat intermediaire est desature). Palier : le rouge reste
// FIGE et plein pendant F_RED_HOLD frames (aucune interpolation), PUIS le mix demarre seulement
// apres — supprime mecaniquement le chevauchement qui creait le mauve.
const F_RED_HOLD = 10;                  // ~0.33s, rouge plein fige (continuite franche avec Scene1Hook)
const F_COLOR_SETTLE = 32;              // fin du mix RGB (demarre a F_RED_HOLD)

const F_G1_IN = t2f(11.74);             // "trois" — Sangomar s'allume
const F_G2_IN = t2f(12.5);              // GTA s'allume
const F_G3_IN = t2f(13.1);              // Yakaar s'allume

const F_PIPE_START = t2f(13.7);         // "L'État" — les tuyaux commencent a se tracer vers le centre
const F_PCT_IN = t2f(14.9);             // "soixante" — le 60% + jauge apparaissent
const F_PCT_SETTLE = t2f(16.44);        // "revenus." pose, tuyaux/jauge finis

const F_LEAK_START = t2f(17.26);        // "l'argent" — le 60% commence a se vider
const F_LEAK_END = t2f(19.34);          // "rien." vide

const F_MECHANISM_IN = t2f(21.68);      // "pétrole" (juste avant "c'est le mécanisme")
const F_EXIT_START = t2f(24.92);        // "richesse." — sortie vers Beat 3
const F_TOTAL = t2f(25.9);

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// Calage repris du VRAI code AES (aesGeo.ts getCamera/getTrioCamera), pas regle a l'oeil (retour Aziz) :
// fitExtent AES = [W*0.03,H*0.10] -> [W*0.97,H*0.80] (94% largeur, 70% hauteur) ; anchorY entre H*0.37
// et H*0.44. Bbox reelle SENEGAL_PATH (mesuree session) : largeur 820, hauteur 599 (repere local path).
// scale = min(W*0.94/820, H*0.70/599) = le plus contraignant des deux (ici la largeur, meme logique
// que trioZoom qui contraint sur le sens le plus large du sujet).
const MAP_SCALE = 1.24;
const MAP_X = W / 2 - SENEGAL_CENTROID[0] * MAP_SCALE;
// ancrage vertical descendu vers 0.44 (haut de la plage AES 0.37-0.44) — retour Aziz : carte trop
// haute en 0.38, la recentrer davantage vers le milieu de l'ecran.
const MAP_Y = H * 0.44 - SENEGAL_CENTROID[1] * MAP_SCALE;

const GRID_STEP = 140;
const GRID_OFFSET_X = 30;
const GRID_OFFSET_Y = 20;

// ── Gisements : coordonnees projetees dans le MEME repere que senegalPath.ts (boite 900x700,
// fitExtent [[40,40],[860,660]], verifie par comparaison de centroide — cf. session log).
// plaqueY = position ECRAN ABSOLUE (pas repere carte) de la plaque deportee, marge droite du cadre.
// Ordre nord->sud reel (GTA le plus au nord, Sangomar le plus au sud) pour que les leader lines ne
// se croisent jamais (retour analyse creative-director : Y des plaques suit Y des ancrages).
// x/y = position ICONE (legerement DECALEE de la position geo reelle pour eviter le chevauchement
// entre icones desormais rendues en GRAND FORMAT — retour Aziz : "decaler un peu, la leader line
// absorbe l'ecart"). Sangomar/Yakaar tres proches geographiquement (124 unites en y) ; ecartes ici
// a ~170 unites pour laisser respirer les icones agrandies (rayon ecran ~50px chacune). ──
const GISEMENTS = [
  { key: "sangomar", name: "SANGOMAR", sub: "Pétrole · Woodside", x: 140, y: 460, inFrame: F_G1_IN, plaqueY: 800 },
  { key: "gta", name: "GTA", sub: "Gaz · BP", x: 104.5, y: 140, inFrame: F_G2_IN, plaqueY: 540 },
  { key: "yakaar", name: "YAKAAR", sub: "Gaz · en suspens", x: 60, y: 290, inFrame: F_G3_IN, plaqueY: 670 },
];

// centre du pourcentage (dans le repere de la carte, avant transform global)
const PCT_CENTER = { x: SENEGAL_CENTROID[0], y: SENEGAL_CENTROID[1] + 52 };

// ── Sous-titres karaoke (meme pattern que Scene1Hook, fenetre 10.46s -> 25.9s) ──
const SPELL_FIX: Record<string, string> = {};
const WORDS_FIXED = WHISPER_WORDS.map((w) => ({ ...w, word: SPELL_FIX[w.word] ?? w.word }));
const DISP: DispWord[] = buildDisplayWords(WORDS_FIXED);

type Phrase = { words: DispWord[]; start: number; end: number };
const MAX_WORDS = 5;
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
const PHRASES = buildPhrases(DISP, T_OFFSET, 25.9);

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

// ── Point d'ancrage geo (petit, fixe) + plaque DEPORTEE hors de la carte + leader line ──
// FIX lisibilite (retour Aziz + 2 agents creative-director convergents, pattern deja valide dans
// SceneGisementsV3.tsx/GeoCountryPlaque.tsx du beat long-form Mapbox) : le probleme n'etait pas
// seulement la TAILLE (3 tentatives d'agrandissement echouees) mais l'ESPACE — les 3 gisements sont
// tous dans la bande cotiere etroite du Senegal, il n'y a physiquement pas la place d'agrandir icone+
// cercle+label au meme point sans chevaucher le trace ou les gisements voisins. On separe : un point
// d'ancrage MINIMAL sur la carte (juste un repere geo) + la plaque (icone genereuse + texte lisible)
// DEPORTEE dans la marge laterale droite (espace vertical abondant, inutilise jusqu'ici), reliee par
// une ligne de rappel fine animee (meme mecanique stroke-dashoffset que les tuyaux).
const PLAQUE_X = 900; // marge droite du cadre 1080px — hors du tracé de la carte (bbox path x<860*1.24+MAP_X)

const GisementIcon: React.FC<{
  frame: number;
  fps: number;
  x: number; // position geo (decalee, cf. iconOffsetX/Y) sur la carte
  y: number;
  plaqueY: number; // position Y de la plaque dans la marge (coord ecran absolue)
  name: string;
  sub: string;
  iconSvg: string;
  inFrame: number;
}> = ({ frame, fps, x, y, plaqueY, name, sub, iconSvg, inFrame }) => {
  const local = frame - inFrame;
  if (local < -2) return null;
  const pop = spring({ fps, frame: Math.max(0, local), config: { damping: 12, stiffness: 200 } });
  const scale = interpolate(pop, [0, 1], [0.3, 1]);
  const iconOp = interpolate(local, [-2, 4], [0, 1], clamp);
  const plaqueOp = interpolate(local, [4, 12], [0, 1], clamp);
  const plaqueSlide = interpolate(
    spring({ fps, frame: Math.max(0, local - 4), config: { damping: 16, stiffness: 120 } }),
    [0, 1],
    [24, 0]
  );

  // FIX (retour Aziz, capture d'ecran) : l'icone SVG remplace le point — ELLE EST le marqueur
  // geographique, pas un ajout a cote. "Immense" = rayon source ~40 rendu a l'echelle 1 (pas reduit),
  // quitte a deborder un peu du territoire (decision Aziz : "on s'en fout que ce soit pas trop relatif").
  const iconScale = scale * 1.0;

  // Animation en boucle continue (retour Aziz + pattern AES) — pulse doux + glow, une fois posee.
  const loopT = local > 14 ? local - 14 : 0;
  const loopPulse = 1 + 0.05 * Math.sin(loopT * 0.1);
  const glowPulse = 0.4 + 0.2 * Math.sin(loopT * 0.12);

  return (
    <g>
      {/* anneau d'ancrage autour de l'icone. FIX (retour Aziz : "cercles dores invisibles") : avant =
          un seul trait OR clair (1.6px, opacite max 0.6) sur parchemin clair -> se noyait. Maintenant
          DOUBLE anneau : (1) anneau NAVY epais (3px, opacite pleine) = contraste fort sur parchemin,
          comme les icones ; (2) fin lisere OR qui PULSE par-dessus = garde l'accent dore vivant. */}
      <circle cx={x} cy={y} r={58 * scale} fill="none" stroke={NAVY} strokeWidth={3} opacity={iconOp} />
      <circle cx={x} cy={y} r={58 * scale} fill="none" stroke={GOLD_BRIGHT} strokeWidth={1.8} opacity={(0.5 + 0.4 * Math.sin(loopT * 0.12)) * iconOp} />

      {/* ICONE SVG EN GRAND, directement sur la carte — remplace le point d'ancrage (retour Aziz) */}
      <g
        opacity={iconOp}
        transform={`translate(${x},${y}) scale(${iconScale * loopPulse})`}
        dangerouslySetInnerHTML={{ __html: iconSvg }}
      />

      {/* leader line : icone -> plaque deportee (meme mecanique que les tuyaux) */}
      {(() => {
        const lx1 = x, ly1 = y;
        const lx2 = PLAQUE_X - 54, ly2 = plaqueY;
        const len = Math.hypot(lx2 - lx1, ly2 - ly1);
        const draw = interpolate(local, [2, 14], [0, 1], clamp);
        if (draw <= 0) return null;
        return (
          <line
            x1={lx1}
            y1={ly1}
            x2={lx2}
            y2={ly2}
            stroke={NAVY}
            strokeWidth={1.2}
            strokeDasharray={`3 3 ${len}`}
            strokeDashoffset={len * (1 - draw)}
            opacity={0.4 * plaqueOp}
          />
        );
      })()}

      {/* plaque deportee : TEXTE SEUL (l'icone est desormais sur la carte, pas dupliquee ici) */}
      <g opacity={plaqueOp} transform={`translate(${PLAQUE_X + plaqueSlide},${plaqueY})`}>
        <rect x={-54} y={-24} width={150} height={48} rx={10} fill={PARCH} stroke={NAVY} strokeWidth={2} />
        <text x={-40} y={-2} fontFamily="'IBM Plex Mono', monospace" fontSize={22} fontWeight={700} fill={NAVY} letterSpacing="0.03em">
          {name}
        </text>
        <text x={-40} y={16} fontFamily="'IBM Plex Mono', monospace" fontSize={15} fill={SLATE}>
          {sub}
        </text>
      </g>
    </g>
  );
};

// ── Tuyau anime reliant un gisement au centre (60%) ──
// Une fois trace, un flux (motif tirets courts) coule EN BOUCLE le long du tuyau vers le centre —
// idee retenue de l'analyse Kimi/Gemini (tri fait : GSAP/morphSVG ecartes, hors stack ; le PRINCIPE
// "liquide qui circule" reste applicable en Remotion pur via strokeDashoffset anime en boucle).
const Pipe: React.FC<{ frame: number; x1: number; y1: number; x2: number; y2: number; startFrame: number }> = ({
  frame,
  x1,
  y1,
  x2,
  y2,
  startFrame,
}) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const drawEnd = startFrame + 20;
  const draw = interpolate(frame, [startFrame, drawEnd], [0, 1], clamp);
  const op = interpolate(frame, [startFrame - 2, startFrame + 4], [0, 0.55], clamp);
  if (draw <= 0) return null;

  // flux en boucle : demarre une fois le tuyau trace, motif tirets qui defile vers le centre
  const flowT = frame > drawEnd ? frame - drawEnd : 0;
  const flowOffset = -((flowT * 1.4) % 24);

  return (
    <g opacity={op}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={GOLD}
        strokeWidth={1.5}
        strokeDasharray={`${len} ${len}`}
        strokeDashoffset={len * (1 - draw)}
      />
      {draw >= 1 && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={GOLD_BRIGHT}
          strokeWidth={2.2}
          strokeDasharray="3 21"
          strokeDashoffset={flowOffset}
          opacity={0.8}
        />
      )}
    </g>
  );
};

export const Scene2Paradoxe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Continuite rouge -> beige (PAS de redessin de carte) ──
  // FIX contraste (retour Aziz + analyse Kimi/Gemini vs AES) : le remplissage doit rester PERCEPTIBLE
  // tout du long (pas fondre dans le fond parchemin une fois la transition finie) — sinon la carte
  // retombe en "contour presque vide", le defaut de contraste pointe par les 2 IA. On garde le fond
  // clair (continuite Beat 1/video longue) mais le FILL de la carte se stabilise sur un ocre doux,
  // jamais sur la couleur du fond lui-meme.
  // FIX flash mauve (retour Aziz, 2 agents creative-director convergents) : palier rouge fige
  // (F_FADE_IN -> F_RED_HOLD, colorT=0) PUIS mix RGB seul (F_RED_HOLD -> F_COLOR_SETTLE).
  const colorT = interpolate(frame, [F_RED_HOLD, F_COLOR_SETTLE], [0, 1], clamp);
  const mapFill = mix(RED, OCRE_SETTLE, colorT); // le fill de la fin du hook s'eclaircit vers un ocre doux, PAS vers PARCH
  // FIX (retour Aziz, capture d'ecran) : SEULE la carte doit heriter du rouge de la fin du hook — le
  // FOND (grille, texture papier) est deja dans son etat normal PARCH des la frame 0, il ne suit plus
  // colorT. Avant ce fix, tout l'ecran etait rouge au depart (bgColor suivait la meme transition que
  // mapFill), ce qui n'avait pas de sens visuellement — seul le territoire porte la memoire du hook.
  const bgColor = PARCH;

  // ── HACHURES DU TERRITOIRE (60% des revenus) — remplace jauge circulaire + chiffre flottant ──
  // FIX (retour Aziz + 2 agents creative-director convergents, pattern deja valide dans l'AES
  // ResourcesRevealSVG9x16.tsx "res9-hatch") : le territoire lui-meme porte l'info, pas un widget a
  // cote. Wipe bas->haut jusqu'a 60% de la hauteur du path, puis "fuite" = le niveau redescend de
  // facon IRREGULIERE (pas un simple fade) sur la phrase "l'argent qui rentre ne garantit rien".
  // FIX (retour Aziz : "ralentir pour qu'on ait le temps de voir le remplissage") : la montee etait
  // sur F_PIPE_START->F_PCT_SETTLE (~2.7s). Etalee jusqu'a F_LEAK_START-8 (~3.3s, toute la fenetre
  // avant la fuite) pour un remplissage plus progressif et lisible.
  const hatchRiseT = interpolate(frame, [F_PIPE_START, F_LEAK_START - 8], [0, 1], clamp);
  const hatchLeakT = interpolate(frame, [F_LEAK_START, F_LEAK_END], [0, 1], clamp);
  // niveau cible : monte a 0.60 puis redescend vers 0.22 (fuite partielle, pas totale — reste un
  // residu visible, coherent avec "il y a de vrais garde-fous" du script complet plus loin dans la video)
  const hatchLevel = interpolate(hatchRiseT, [0, 1], [0, 0.6]) - interpolate(hatchLeakT, [0, 1], [0, 0.38]);
  const hatchOp = interpolate(frame, [F_PIPE_START - 2, F_PIPE_START + 8], [0, 1], clamp);

  // mecanisme abstrait (rouage) qui prend le relais en sortie, pont vers Beat 3
  const mechIn = interpolate(frame, [F_MECHANISM_IN, F_MECHANISM_IN + 20], [0, 1], clamp);
  const exitFade = interpolate(frame, [F_EXIT_START, F_TOTAL], [1, 0], clamp);
  const mapFadeOut = interpolate(frame, [F_MECHANISM_IN, F_MECHANISM_IN + 24], [1, 0.25], clamp);

  const gridV = Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_X + i * GRID_STEP);
  const gridH = Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_Y + i * GRID_STEP);

  const centerX = MAP_X + SENEGAL_CENTROID[0] * MAP_SCALE;
  const centerY = MAP_Y + PCT_CENTER.y * MAP_SCALE;

  return (
    <AbsoluteFill style={{ background: bgColor, opacity: exitFade }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="s2paperTex">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="7" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.07" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
          {/* hachures 60% des revenus — pattern repris de ResourcesRevealSVG9x16.tsx (AES, deja
              valide Aziz), transposees au registre Souverain (or sur ocre au lieu de noir sur couleur) */}
          {/* FIX visibilite (retour Aziz : "60% un peu invisible") : hachures DENSIFIEES (width 10->7)
              + opacite MONTEE (0.5->0.8) + trait un peu plus epais (2.2->2.6) -> le remplissage se voit
              nettement sur l'ocre. */}
          <pattern id="s2hatch60" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke={NAVY} strokeWidth={2.6} opacity={0.8} />
          </pattern>
          <clipPath id="s2senegalClip">
            <path d={SENEGAL_PATH} />
          </clipPath>
        </defs>

        {/* FIX (retour Aziz) : le fond (texture + grille) est stable des la frame 0, INDEPENDANT de
            colorT — seule la carte hérite de la transition rouge, le fond n'a jamais ete rouge. */}
        <rect width={W} height={H} fill={PARCH_DARK} filter="url(#s2paperTex)" opacity={0.4} />

        <g stroke={GRID} strokeWidth={1.4} opacity={0.6}>
          {gridV.map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />
          ))}
          {gridH.map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />
          ))}
        </g>

        {/* CARTE — MEME contour que Scene1Hook, PAS de redessin. Le fill s'eclaircit (rouge -> beige). */}
        <g transform={`translate(${MAP_X},${MAP_Y}) scale(${MAP_SCALE})`} opacity={mapFadeOut}>
          <path d={SENEGAL_PATH} fill={mapFill} opacity={0.65} />

          {/* hachures 60% des revenus — clippees au contour EXACT du Senegal (pas d'approximation
              rectangulaire), wipe bas->haut. Bbox reelle mesuree : y in [50.464, 649.536], hauteur 599. */}
          {hatchOp > 0.01 && hatchLevel > 0.001 && (
            <g clipPath="url(#s2senegalClip)" opacity={hatchOp}>
              <rect
                x={0}
                y={649.536 - 599 * Math.max(0, hatchLevel)}
                width={900}
                height={599 * Math.max(0, hatchLevel) + 10}
                fill="url(#s2hatch60)"
              />
              {/* ligne de niveau qui respire (marque le sommet du remplissage) */}
              <line
                x1={0}
                y1={649.536 - 599 * Math.max(0, hatchLevel)}
                x2={900}
                y2={649.536 - 599 * Math.max(0, hatchLevel)}
                stroke={GOLD_BRIGHT}
                strokeWidth={2.5}
                opacity={0.7 + 0.15 * Math.sin(frame * 0.15)}
              />
            </g>
          )}

          <path d={SENEGAL_PATH} fill="none" stroke={NAVY} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />

          {/* tuyaux gisement -> centre (60%), tracage anime */}
          {GISEMENTS.map((g) => (
            <Pipe
              key={`pipe-${g.key}`}
              frame={frame}
              x1={g.x}
              y1={g.y}
              x2={PCT_CENTER.x}
              y2={PCT_CENTER.y}
              startFrame={F_PIPE_START}
            />
          ))}
        </g>

        {/* Plaques gisement DEPORTEES : coord. ECRAN ABSOLUES (hors du groupe transforme de la carte),
            point d'ancrage converti via MAP_X/MAP_Y/MAP_SCALE — cf. fix lisibilite retour Aziz. */}
        {GISEMENTS.map((g) => (
          <GisementIcon
            key={g.key}
            frame={frame}
            fps={fps}
            x={MAP_X + g.x * MAP_SCALE}
            y={MAP_Y + g.y * MAP_SCALE}
            plaqueY={g.plaqueY}
            name={g.name}
            sub={g.sub}
            iconSvg={ICONS[g.key]}
            inFrame={g.inFrame}
          />
        ))}
      </svg>

      {/* "Le mecanisme qui capture la richesse" — FIX V2 (retour Aziz, capture d'ecran : le mecanisme
          etait "minuscule" et "ne semble pas faire de sens"). On reutilise l'icone "mecanisme" deja
          validee (meme modele que les 3 gisements) mais on le rend BEAUCOUP plus imposant (rayon
          quasi double) et on renforce son ancrage visuel : halo large + rayons qui rejoignent le bord
          du cercle interieur (evoque un centre de controle relie a un reseau), positionne au point de
          CONVERGENCE DES TUYAUX (centerX/centerY = PCT_CENTER, etabli depuis 8s) — pas un objet isole. */}
      {mechIn > 0.01 && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: mechIn, pointerEvents: "none" }}>
          <g transform={`translate(${centerX},${centerY})`}>
            {/* halo large qui respire — ancrage visuel fort, bien plus present que V1 */}
            <circle
              r={128}
              fill="none"
              stroke={GOLD}
              strokeWidth={1.4}
              strokeDasharray="6 8"
              opacity={(0.3 + 0.12 * Math.sin((frame - F_MECHANISM_IN) * 0.1)) * interpolate(frame, [F_MECHANISM_IN, F_MECHANISM_IN + 12], [0, 1], clamp)}
            />
            {/* fond plein DOUBLE (vs V1 r=46) — meme principe que les icones gisement : fond opaque pour trancher */}
            <circle r={92} fill={PARCH} stroke={NAVY} strokeWidth={3} opacity={interpolate(frame, [F_MECHANISM_IN, F_MECHANISM_IN + 10], [0, 1], clamp)} />
            <circle
              r={104}
              fill="none"
              stroke={GOLD}
              strokeWidth={2.2}
              opacity={(0.5 + 0.2 * Math.sin((frame - F_MECHANISM_IN) * 0.12)) * interpolate(frame, [F_MECHANISM_IN, F_MECHANISM_IN + 10], [0, 1], clamp)}
            />
            {/* icone rouage DOUBLE (vs V1 scale~1) — remplit vraiment le cercle, lisible et imposant */}
            <g
              transform={`scale(${2.2 * interpolate(frame, [F_MECHANISM_IN + 4, F_MECHANISM_IN + 18], [0.3, 1], clamp)}) rotate(${(frame - F_MECHANISM_IN) * 0.9})`}
              opacity={interpolate(frame, [F_MECHANISM_IN + 4, F_MECHANISM_IN + 14], [0, 1], clamp)}
              dangerouslySetInnerHTML={{ __html: ICONS["mecanisme"] }}
            />
          </g>
        </svg>
      )}

      <KaraokeSubtitles frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// Interpole 2 couleurs hex.
function mix(a: string, b: string, t: number): string {
  const pa = hex(a), pb = hex(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function hex(h: string): [number, number, number] {
  const s = h.replace("#", "");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

export default Scene2Paradoxe;
