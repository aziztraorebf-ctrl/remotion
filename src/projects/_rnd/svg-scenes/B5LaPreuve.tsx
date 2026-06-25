/**
 * B5LaPreuve — Beat 5 GGW "LA PREUVE" (registre ENCRE NARRATIVE, anime).
 *
 * CIBLE validee Aziz (b5-cible.svg, 15 groupes) : 3 souches noueuses au centre qui REJETTENT du vert
 *   (regeneration naturelle), un PUITS en haut-droite ou l'eau REMONTE, une CUVETTE demi-lune en
 *   avant-plan (echo Beat 4) ou la pluie se retient.
 *   AJUSTEMENT AZIZ : le PUITS etait trop petit/timide alors qu'il porte le climax "+17m" -> AGRANDI
 *   en code (scale ~1.45 du groupe puits, ancre ~850/770, repositionne pour rester dans le cadre et
 *   porter visuellement la montee d'eau).
 *
 * INTENTION : PROUVER que la vraie solution marche a grande echelle. CLIMAX POSITIF du short — on
 *   bascule du desespoir des beats precedents (mur d'arbres mort, terre seche) vers l'ESPOIR concret
 *   et chiffre. Verbe : REVERDIR / FAIRE REMONTER LA VIE.
 *
 * GRAMMAIRE (identique hook + B2 + B3) : spring pop (la pousse jaillit) / stroke-dashoffset (se-dessine) /
 *   cross-fade opacite (encre <-> couleur) / clip-path anime (montee d'eau, balayage du vert) ; clamp
 *   partout, frame-driven uniquement (zero CSS transition/keyframes/setTimeout) ; scene SVG frontale FIXE
 *   (acquis #5 : pas de translate global qui fait valser). Raccord par fade.
 *
 * COULEUR (2 munitions, espacees, chacune un SENS et un TIMING — acquis #3) :
 *   - VERT VIE (#3e8f34 / tendre #6fa85a) : entre a f57 ("200M reviennent"), le feuillage jaillit des
 *     souches en CASCADE gauche->droite (~0.4s d'intervalle, acquis #6), s'intensifie jusqu'a l'apogee
 *     vegetal a f221-295 ("la nature les a fait revenir"). C'est la VIE qui revient du vieux bois.
 *   - BLEU EAU (#3a6b8c, encre-compatible) : RETENU jusqu'au climax. Entre d'abord en filets clairs
 *     bleu-gris tres pales f389-469 (l'eau qui s'ecoule sous terre vers le puits), PUIS sature a f486-526
 *     quand "l'eau remonte dans les puits" : le NIVEAU D'EAU monte (vrai niveau avec reflet, PAS une jauge),
 *     depasse les marques de secheresse, atteint le haut a f550-593 ("dix-sept metres"). 2e munition = climax.
 *
 * ⛔ PIEGE B5 (beat de CHIFFRES) : la montee d'eau dans le puits NE DOIT PAS ressembler a une jauge/
 *   thermometre/barre de progression. Traitee comme un VRAI niveau d'eau : ellipse de surface (perspective
 *   du puits), reflets clairs sur l'eau, ondulation sin, marques de secheresse (anciens niveaux) que l'eau
 *   DEPASSE. AUCUN compteur/chiffre affiche dans la scene (les chiffres sont a la voix + au karaoke).
 *
 * CHOREGRAPHIE (cale sur les 8 segments audio, frames @30fps relatives au beat — TIMER les gestes) :
 *   - f0-56   "Le resultat ?" : la cuvette_eau (reflet clair, pluie retenue) GRANDIT — encre/clair.
 *   - f57-138 "200M reviennent" : les 3 HOUPPIERS (modele B2/B3) REVERDISSENT en CASCADE g->centre->d ; VERT entre.
 *   - f159-203 "Aucune main..." : le vert gagne depuis les RACINES exposees (revenu du bois, pas plante) ; vert s'intensifie.
 *   - f221-295 "la nature les a fait revenir" : les 3 houppiers s'epanouissent en canopee pleine ; vert profond (apogee).
 *   - f296-334 "20$/hectare" : un BILLET stylise TOMBE (spring) pres de la cuvette PUIS se colore vert-dollar (l'argent).
 *   - f389-469 "les paysans creusent ces trous" : filets d'eau clairs s'ecoulent lateralement de la cuvette vers le puits, sous terre ; bleu-gris pale.
 *   - f486-526 "l'eau remonte dans les puits" : puits_eau MONTE du fond, depasse les marques ; BLEU sature (climax).
 *   - f550-593 "17 metres" : l'eau atteint le haut du puits (bleu sature) ; une GOUTTE retombe dans la cuvette -> cercle. Cut.
 *
 * Composition 1080x1920 (9:16), 596 frames @30fps (19.876s). Audio Beat 5 inclus.
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
// JAUNE SOLEIL (finition Aziz) — le soleil colore en jaune (les rayons tournent deja, on ajoute la couleur)
const JAUNE = "#e8b44a"; // jaune ambre chaud, encre-compatible (pas criard)
const JAUNE_D = "#b5862b"; // trait/contour du soleil
// OCRE TERRE (finition Aziz) — les racines passent en ocre apres le verdissement (couleur "terre" du short)
const OCRE_TERRE = "#b5651d";
// VERT VIE (1ere munition) — la regeneration naturelle
const VERT = "#3e8f34"; // vert vif (apogee vegetal)
const VERT_D = "#295c1c";
const VERT_TENDRE = "#6fa85a"; // vert tendre (jaillissement initial des pousses)
const VERT_TENDRE_D = "#4f7e3f";
// BLEU EAU (2e munition) — l'eau qui remonte, teinte encre-compatible (sobre, pas criarde)
const BLEU = "#3a6b8c"; // bleu eau sature (climax du puits)
const BLEU_CLAIR = "#6fa3bf"; // reflet clair de la surface de l'eau
const BLEU_PALE = "#8aa9b8"; // filets d'eau sous terre (bleu-gris tres pale)
// VERT-DOLLAR (le billet "20$/hectare") — vert billet, encre-compatible
const VERT_BILLET = "#3e8f34"; // vert billet (signale l'argent)
const VERT_BILLET_D = "#2c6526"; // traits/encre du billet une fois vert

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
   start/end = SECONDES (beat-relatif, 30fps, 596 frames) issus de narration.alignment.json
   filtre sur la fenetre 72.539->92.415s puis -72.539 (= secondes relatives au debut du beat).
   Chiffres EN LETTRES ("deux cents millions", "vingt", "dix-sept"). Accents FR conserves. */
type Word = { word: string; start: number; end: number };
const B5_WORDS: Word[] = [
  { word: "Le", start: 0.061, end: 0.141 },
  { word: "résultat", start: 0.201, end: 0.681 },
  { word: "Au", start: 1.901, end: 1.981 },
  { word: "Niger,", start: 2.001, end: 2.501 },
  { word: "deux", start: 2.961, end: 3.041 },
  { word: "cents", start: 3.141, end: 3.251 },
  { word: "millions", start: 3.321, end: 3.641 },
  { word: "d'arbres", start: 3.661, end: 4.061 },
  { word: "reviennent.", start: 4.141, end: 4.601 },
  { word: "Aucune", start: 5.301, end: 5.641 },
  { word: "main", start: 5.701, end: 5.821 },
  { word: "ne", start: 5.861, end: 5.921 },
  { word: "les", start: 6.001, end: 6.121 },
  { word: "a", start: 6.141, end: 6.261 },
  { word: "plantés", start: 6.281, end: 6.601 },
  { word: "là.", start: 6.641, end: 6.761 },
  { word: "La", start: 7.381, end: 7.481 },
  { word: "nature", start: 7.521, end: 7.921 },
  { word: "les", start: 7.981, end: 8.121 },
  { word: "a", start: 8.181, end: 8.191 },
  { word: "fait", start: 8.261, end: 8.371 },
  { word: "revenir.", start: 8.441, end: 9.841 },
  { word: "Pour", start: 9.881, end: 10.071 },
  { word: "vingt", start: 10.101, end: 10.231 },
  { word: "dollars", start: 10.281, end: 10.561 },
  { word: "l'hectare.", start: 10.601, end: 11.141 },
  { word: "Et", start: 12.961, end: 13.021 },
  { word: "là", start: 13.081, end: 13.201 },
  { word: "où", start: 13.221, end: 13.301 },
  { word: "les", start: 13.341, end: 13.461 },
  { word: "paysans", start: 13.501, end: 13.751 },
  { word: "creusent", start: 13.941, end: 14.261 },
  { word: "ces", start: 14.301, end: 14.441 },
  { word: "trous", start: 14.481, end: 14.701 },
  { word: "qui", start: 14.761, end: 14.841 },
  { word: "retiennent", start: 14.901, end: 15.221 },
  { word: "la", start: 15.261, end: 15.381 },
  { word: "pluie,", start: 15.421, end: 15.641 },
  { word: "l'eau", start: 16.201, end: 16.401 },
  { word: "remonte", start: 16.461, end: 16.881 },
  { word: "dans", start: 16.941, end: 17.061 },
  { word: "les", start: 17.101, end: 17.191 },
  { word: "puits...", start: 17.301, end: 17.521 },
  { word: "parfois", start: 18.321, end: 18.681 },
  { word: "de", start: 18.921, end: 19.021 },
  { word: "dix-sept", start: 19.081, end: 19.401 },
  { word: "mètres.", start: 19.481, end: 19.781 },
];

/* ⛔ KARAOKE (trou de doctrine #1) : NE PAS grouper par silence auto. On FORCE les frontieres par
   INDEX de mots (1er mot de chaque segment narratif). Les 8 segments du script :
   (1) Le resultat ? [0] (2) Au Niger...reviennent. [2] (3) Aucune main...la. [9]
   (4) La nature...revenir. [16] (5) Pour vingt...hectare. [22] (6) Et la ou...pluie, [26]
   (7) l'eau remonte...puits... [38] (8) parfois...metres. [43].
   PHRASE_BREAKS = index du 1er mot de chaque NOUVELLE phrase (apres la 1ere). */
type Phrase = { words: Word[]; start: number; end: number };
const PHRASE_BREAKS = [2, 9, 16, 22, 26, 38, 43];
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

// MICRO-LABEL CUVETTE (finition #4) — explique le trou demi-lune (echo Beat 4) pendant que la
// cuvette se remplit, AVANT que les sous-titres descendent en bas. Style micro-source discret.
type Cue = { start: number; end: number; text: string };
const CUVETTE_LABEL: Cue = { start: 12, end: 150, text: "la demi-lune retient la pluie" };

// MICRO-SOURCES (frames @30) — timees sur les 2 claims chiffres du beat (acquis #8).
const SOURCES: Cue[] = [
  // "Au Niger, 200M arbres reviennent... 20$/hectare" (regreening, Reij/World Resources Institute)
  { start: 70, end: 200, text: "C. Reij - World Resources Institute" },
  // "l'eau remonte dans les puits, +17m" (nappe phreatique, regreening Niger)
  { start: 492, end: 590, text: "USGS - Tougou / Niger regreening" },
];

/* ---------------------------------------------------------------------------- */
/* ARBRE — modele REPRIS DE B2/B3 (coherence visuelle du short, finition #1).    */
/* Tronc double trait + amorces de branches (TreeTrunk), houppier rond de        */
/* cercles de feuillage qu'on COLORE en cascade encre->vert (LeafyCrown), et     */
/* racines exposees (Roots) — ici la pousse "revient des racines, pas plantee".  */
/* Dessine relatif a sa base (0,0) au niveau du sol. Le houppier est separe pour */
/* pouvoir le verdir (cross-fade fill encre->vert pilote par chaque arbre).      */
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
      // chaque touffe pop en cascade (decalee par i) au sein du houppier
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

// racines exposees (s'etalent depuis la base 0,0 vers le sol) — "revenu des racines, pas plante"
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

export const B5LaPreuve: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // raccord vers B6 : leger fade global en toute fin (acquis #5 : pas de mouvement, juste fade)
  const endFade = clampI(frame, [575, 596], [1, 0.85]);

  /* === COUCHE DE FOND PERMANENTE (doctrine 2 couches) — ne s'arrete jamais === */
  // monde encre + cadre + horizon + souches se-tracent f0-70
  const worldDraw = clampI(frame, [0, 70], [DASH, 0]);
  // soleil discret (espoir, pas menace) : fade-in f0-30, pulse leger permanent (finition #3 : RAYONNE)
  const sunIn = clampI(frame, [0, 30], [0, 1]);
  const sunPulse = 1 + 0.02 * Math.sin(frame / 13);
  // finition #3 — soleil qui rayonne : halo respirant + rayons qui pulsent (longueur/opacite) et
  // tournent tres lentement. Subtil, dans le registre encre (pas criard). Demarre f0, ne s'arrete jamais.
  const sunRot = frame * 0.1; // rotation tres lente des rayons (deg)
  const rayPulse = 0.5 + 0.5 * Math.sin(frame / 11); // 0..1, allonge/raccourcit les rayons
  const rayLen = 30 + 14 * rayPulse; // longueur des rayons (encre)
  const rayOpacity = 0.45 + 0.3 * rayPulse; // opacite des rayons (respire)
  const haloR = 96 + 6 * Math.sin(frame / 17); // halo respirant autour du disque

  /* === f0-56 "Le resultat ?" : la cuvette retient la pluie (reflet clair qui grandit) === */
  // la surface d'eau de la cuvette grandit (echo Beat 4, pluie retenue) f0-56
  const cuvetteFill = clampI(frame, [6, 56], [0, 1]);
  const ripple = Math.sin(frame / 7); // ondulation douce de la surface

  /* === f57-138 "200M reviennent" : le houppier REVERDIT en CASCADE g->centre->d ===
     VERT entre ici (1ere munition). 3 arbres : gauche f57, centre f70, droite f84 (~0.4s).
     Le houppier passe d'encre/vide a vert tendre — la VIE qui revient gagne chaque arbre. */
  const TREE_BIRTH = [57, 70, 84]; // gauche, centre, droite (cascade)
  // growth de chaque houppier : se remplit (cercles pop) puis reste, jusqu'a l'apogee
  const crownGrowth = (i: number) =>
    clampI(frame, [TREE_BIRTH[i], TREE_BIRTH[i] + 70], [0, 1]);
  // pop spring du houppier (jaillit) — pilote l'apparition + le leger rebond d'echelle
  const treePop = (i: number) =>
    spring({
      frame: frame - TREE_BIRTH[i],
      fps,
      config: { mass: 1, damping: 13, stiffness: 120 },
    });

  /* === f221-295 "la nature les a fait revenir" : apogee vegetal (vert profond + canopee pleine) ===
     le feuillage passe du vert tendre au vert profond + leger gonflement (canopee qui s'epanouit). */
  const apogee = clampI(frame, [221, 295], [0, 1]);
  // couleur du feuillage : ENCRE (houppier mort/vide) -> vert tendre (reverdit) -> vert profond (apogee).
  // chaque arbre interpole entre vert tendre et vert profond via apogee ; la "naissance" du vert
  // est portee par crownGrowth (les cercles n'apparaissent qu'en reverdissant).
  const leafFill =
    apogee < 0.001
      ? VERT_TENDRE
      : apogee >= 0.999
      ? VERT
      : `rgb(${Math.round(0x6f + (0x3e - 0x6f) * apogee)},${Math.round(
          0xa8 + (0x8f - 0xa8) * apogee
        )},${Math.round(0x5a + (0x34 - 0x5a) * apogee)})`;
  const leafStroke = apogee > 0.5 ? VERT_D : VERT_TENDRE_D;
  const canopySwell = 1 + 0.06 * apogee; // la canopee gonfle legerement a l'apogee
  // balancement au vent (vie continue) une fois le feuillage la
  const leafSway = Math.sin(frame / 18) * 1.2;

  /* === f296-334 "20$/hectare" : un BILLET (rectangle stylise encre) TOMBE pres de la cuvette (finition #2) ===
     remplace la piece peu lisible. Tomber-sec spring (doctrine objet qui se plante), PUIS se COLORE en
     VERT-DOLLAR (le cout derisoire = l'argent). Plus lisible qu'une piece ronde. */
  const billetPop = spring({
    frame: frame - 300,
    fps,
    config: { mass: 1, damping: 12, stiffness: 95 },
  });
  // chute : du haut (y -180 relatif) vers le repos, avec rebond du spring
  const billetDrop = clampI(billetPop, [0, 1], [-180, 0]);
  // le billet se teinte de vert-dollar une fois pose (f316-334)
  const billetGreen = clampI(frame, [316, 334], [0, 1]);
  const billetFill =
    billetGreen < 0.001
      ? CREME
      : `rgb(${Math.round(0xe8 + (0xd6 - 0xe8) * billetGreen)},${Math.round(
          0xdc + (0xe8 - 0xdc) * billetGreen
        )},${Math.round(0xc0 + (0xcf - 0xc0) * billetGreen)})`; // creme -> vert-billet pale
  const billetInk = billetGreen > 0.5 ? VERT_BILLET_D : ENCRE;

  /* === f389-469 "les paysans creusent ces trous" : filets d'eau s'ecoulent cuvette -> puits (sous terre) ===
     bleu-gris pale ; les filets se-tracent lateralement (de la cuvette en avant-plan vers le puits haut-droite). */
  const flowDraw = clampI(frame, [389, 469], [DASH, 0]);
  const flowIn = clampI(frame, [389, 430], [0, 1]);

  /* === f486-526 "l'eau remonte dans les puits" : le NIVEAU D'EAU monte (vrai niveau, PAS jauge) ===
     2e munition couleur = BLEU sature. waterRise pilote la hauteur de la surface d'eau dans le puits. */
  const waterRise = clampI(frame, [486, 560], [0, 1]); // monte jusqu'a 17m a f560
  const bleuSat = clampI(frame, [486, 530], [0, 1]); // bleu pale -> sature

  /* === f550-593 "17 metres" : l'eau atteint le haut ; une GOUTTE retombe dans la cuvette -> cercle === */
  const dropFall = clampI(frame, [565, 588], [0, 1]); // la goutte tombe du bord du puits vers la cuvette
  const dropRing = clampI(frame, [584, 596], [0, 1]); // cercle d'impact dans la cuvette

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

  // finition #4 — opacite du micro-label de la cuvette (fade in/out doux, discret)
  const cuvetteLabelOpacity =
    frame >= CUVETTE_LABEL.start && frame <= CUVETTE_LABEL.end
      ? interpolate(
          frame,
          [
            CUVETTE_LABEL.start,
            CUVETTE_LABEL.start + 12,
            CUVETTE_LABEL.end - 18,
            CUVETTE_LABEL.end,
          ],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      : 0;

  const activeSrc = SOURCES.find((c) => frame >= c.start && frame <= c.end);
  const srcOpacity = activeSrc
    ? interpolate(
        frame,
        [activeSrc.start, activeSrc.start + 10, activeSrc.end - 10, activeSrc.end],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  /* === GEOMETRIE DU PUITS (AGRANDI x1.45, ancre ~850/770 — demande Aziz) ===
     Cible : groupe puits de x750-950 (corps), ellipse haute cy=680, base ~850, eau surface cy=820.
     On enveloppe TOUT le puits dans un <g> avec un scale autour de son centre pour l'agrandir, tout
     en restant dans le cadre (cadre interne ~x50-1030). Centre d'echelle = (850, 765). */
  // finition #5 — DECALER LE PUITS : il chevauchait l'arbre de droite. On le pousse legerement a
  // droite (CX 850 -> 905) et plus haut (echelle ancree plus haut via un translate vertical du <g>),
  // pour qu'il respire et ne telescope plus le houppier de droite. L'eau qui monte reste lisible.
  const PUITS_SCALE = 1.45;
  const PUITS_CX = 905; // pousse vers la droite (moins de chevauchement avec l'arbre droit)
  const PUITS_CY = 765;
  const PUITS_DY = -70; // remonte legerement tout le puits (respire au-dessus des arbres)
  // Repere d'eau interne (avant scale) : haut du puits ~y688 (sous l'anneau), fond ~y845.
  const WATER_TOP = 706; // niveau "17m" (haut) — garde une petite marge d'air sous l'anneau (Aziz)
  const WATER_BOTTOM = 842; // fond (niveau de secheresse de depart)
  const waterY = WATER_BOTTOM + (WATER_TOP - WATER_BOTTOM) * waterRise;
  const waterWobble = Math.sin(frame / 6) * 2.2 * (waterRise > 0.05 ? 1 : 0);

  // couleur de l'eau du puits : bleu pale -> bleu sature (climax)
  const waterFill =
    bleuSat < 0.001
      ? BLEU_PALE
      : bleuSat >= 0.999
      ? BLEU
      : `rgb(${Math.round(0x8a + (0x3a - 0x8a) * bleuSat)},${Math.round(
          0xa9 + (0x6b - 0xa9) * bleuSat
        )},${Math.round(0xb8 + (0x8c - 0xb8) * bleuSat)})`;

  // demi-largeur de l'ellipse d'eau a une hauteur donnee (le puits se retrecit vers le fond : ~95 en haut)
  const ellipseRx = 92;

  return (
    <AbsoluteFill style={{ background: CREME }}>
      <Audio src={staticFile("audio/ggw-muraille-verte/narration-beat5.mp3")} />

      {/* ============ COUCHE SFX (frame-driven via <Sequence from=>) — tous sous la narration ============ */}
      {/* vent de fond continu tres leger (ambiance, drone) */}
      <Audio
        src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-vent.mp3")}
        volume={0.12}
      />
      {/* f6 "Le resultat ?" : pluie douce qui se retient dans la cuvette (boostee, source faible) */}
      <Sequence from={6} durationInFrames={120}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-pluie-douce.mp3")}
          volume={0.9}
        />
      </Sequence>
      {/* f57 : le feuillage JAILLIT des souches (la pousse) — cascade */}
      <Sequence from={57} durationInFrames={90}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-pousse.mp3")}
          volume={0.85}
        />
      </Sequence>
      {/* f221 "la nature les a fait revenir" : 2e bouffee de pousse (apogee vegetal) */}
      <Sequence from={221} durationInFrames={90}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-pousse.mp3")}
          volume={0.6}
        />
      </Sequence>
      {/* f389 : les filets d'eau s'ecoulent sous terre vers le puits (eau douce, boostee) */}
      <Sequence from={389} durationInFrames={110}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-pluie-douce.mp3")}
          volume={0.55}
        />
      </Sequence>
      {/* f486 "l'eau remonte" : l'eau remonte dans le puits (climax sonore) */}
      <Sequence from={486} durationInFrames={90}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-eau-remonte.mp3")}
          volume={0.7}
        />
      </Sequence>
      {/* f566 "17 metres" : la goutte retombe dans la cuvette (boostee, source faible) */}
      <Sequence from={566} durationInFrames={28}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-goutte.mp3")}
          volume={0.95}
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
          {/* ---- SOLEIL QUI RAYONNE (finition #3) : encre discret (espoir, jamais embrase) ----
               halo respirant + rayons qui pulsent (longueur/opacite en sin) et tournent tres lentement.
               Subtil, registre encre. Demarre f0, ne s'arrete jamais (couche de fond permanente). */}
          <g
            id="soleil"
            opacity={sunIn * 0.8}
            transform={`translate(${220 * (1 - sunPulse)} ${280 * (1 - sunPulse)}) scale(${sunPulse})`}
          >
            {/* halo jaune respirant autour du disque (finition Aziz : soleil colore en jaune) */}
            <circle
              cx={220}
              cy={280}
              r={haloR}
              fill={JAUNE}
              stroke="none"
              opacity={0.1 + 0.06 * rayPulse}
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
            {/* disque jaune (rempli) + contour ocre */}
            <circle cx={220} cy={280} r={80} fill={JAUNE} stroke={JAUNE_D} strokeWidth={4} />
            {/* rayons jaunes : 12 traits qui pulsent (longueur/opacite) et tournent tres lentement */}
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

          {/* ---- HORIZON + SOL (encre, se-tracent f0-70) ---- */}
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

          {/* ---- FILETS D'EAU SOUS TERRE (f389-469) : s'ecoulent de la cuvette (avant-plan) vers le PUITS.
               bleu-gris pale, se-tracent lateralement. Rendu AVANT le puits/souches (sous terre). ---- */}
          {/* Finition Aziz : filets + points bleus PLUS VISIBLES (etaient trop pales/durs a voir).
              Bleu sature, traits plus epais, opacite plus forte, points plus gros. */}
          <g id="filets_eau" opacity={flowIn}>
            <path
              d="M520 1640 C560 1560 640 1480 720 1380 C780 1300 820 1180 850 1000"
              fill="none"
              stroke={BLEU}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={DASH}
              strokeDashoffset={flowDraw}
            />
            <path
              d="M460 1660 C420 1560 440 1440 540 1320 C640 1200 760 1080 850 940"
              fill="none"
              stroke={BLEU}
              strokeWidth={5}
              strokeLinecap="round"
              opacity={0.85}
              strokeDasharray={DASH}
              strokeDashoffset={flowDraw}
            />
            {/* points bleus qui descendent le long du filet (frame-driven) — PLUS GROS/VISIBLES */}
            {flowIn > 0.4 &&
              [0, 1, 2, 3].map((k) => {
                const ph = ((frame - 400) / 40 + k * 0.25) % 1;
                if (ph < 0) return null;
                return (
                  <circle
                    key={k}
                    cx={520 + (850 - 520) * ph}
                    cy={1640 + (1000 - 1640) * ph}
                    r={8}
                    fill={BLEU_CLAIR}
                    stroke={BLEU}
                    strokeWidth={1.5}
                    opacity={0.85 * flowIn}
                  />
                );
              })}
          </g>

          {/* ---- PUITS (AGRANDI x1.45, ancre 850/765 — demande Aziz) ----
               Repris de la cible (corps + anneau + hachures + niveau d'eau qui MONTE).
               L'eau = VRAI niveau (ellipse de surface + reflets + ondulation), PAS une jauge. */}
          <g
            id="puits"
            transform={`translate(0 ${PUITS_DY}) translate(${PUITS_CX} ${PUITS_CY}) scale(${PUITS_SCALE}) translate(${-850} ${-PUITS_CY})`}
            opacity={clampI(frame, [20, 60], [0, 1])}
          >
            {/* ---- EAU DU PUITS (sous les parois, clippee a l'interieur) ---- */}
            <defs>
              <clipPath id="puitsInner">
                {/* interieur du puits : trapeze entre les parois + base arrondie */}
                <path d="M758 688 L942 688 L935 845 A92 26 0 0 1 765 845 Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#puitsInner)">
              {/* colonne d'eau remplie du fond jusqu'a waterY */}
              <rect
                x={755}
                y={waterY}
                width={190}
                height={860 - waterY}
                fill={waterFill}
                opacity={0.85}
              />
              {/* surface d'eau (ellipse, perspective du puits) + reflet clair + ondulation */}
              <ellipse
                cx={850}
                cy={waterY + waterWobble}
                rx={ellipseRx}
                ry={24}
                fill={waterFill}
              />
              <ellipse
                cx={850}
                cy={waterY + waterWobble}
                rx={ellipseRx}
                ry={24}
                fill="none"
                stroke={BLEU_CLAIR}
                strokeWidth={3}
                opacity={0.8}
              />
              {/* reflets clairs sur la surface (2 arcs qui ondulent) */}
              <path
                d={`M790 ${waterY + waterWobble} Q850 ${waterY + waterWobble - 8} 910 ${waterY + waterWobble}`}
                fill="none"
                stroke={BLEU_CLAIR}
                strokeWidth={2.5}
                opacity={0.7 * waterRise}
              />
              <path
                d={`M810 ${waterY + 14 + waterWobble} Q850 ${waterY + 9 + waterWobble} 892 ${waterY + 14 + waterWobble}`}
                fill="none"
                stroke={BLEU_CLAIR}
                strokeWidth={1.8}
                opacity={0.5 * waterRise}
              />
            </g>

            {/* ---- MARQUES DE SECHERESSE (anciens niveaux bas) que l'eau DEPASSE en montant ---- */}
            <g opacity={clampI(frame, [60, 90], [0, 0.55])}>
              <path d="M765 800 L935 800" stroke={ENCRE} strokeWidth={1.5} strokeDasharray="6 10" opacity={waterY < 800 ? 0.9 : 0.35} />
              <path d="M768 760 L932 760" stroke={ENCRE} strokeWidth={1.5} strokeDasharray="6 10" opacity={waterY < 760 ? 0.9 : 0.35} />
            </g>

            {/* ---- PAROIS / STRUCTURE DU PUITS (encre, par-dessus l'eau) ---- */}
            <path
              d="M750 680 L750 850 A100 35 0 0 0 950 850 L950 680"
              fill="none"
              stroke={ENCRE}
              strokeWidth={5}
              strokeLinejoin="round"
            />
            {/* margelle (anneau du haut) */}
            <ellipse cx={850} cy={680} rx={100} ry={35} fill={CREME} stroke={ENCRE} strokeWidth={5} />
            <ellipse cx={850} cy={680} rx={78} ry={24} fill="none" stroke={ENCRE} strokeWidth={2} opacity={0.6} />
            {/* hachures de la pierre (texture maconnerie) */}
            <path
              d="M880 720 L880 845 M900 710 L900 842 M920 700 L920 835 M790 715 L790 840 M810 705 L810 838"
              fill="none"
              stroke={ENCRE}
              strokeWidth={1.5}
              opacity={0.45}
            />
            <path
              d="M760 740 Q850 750 940 730 M760 790 Q850 800 940 780"
              fill="none"
              stroke={ENCRE}
              strokeWidth={1.5}
              opacity={0.4}
            />
          </g>

          {/* ---- 3 ARBRES qui REVERDISSENT (modele B2/B3, finition #1) ----
               Tronc + houppier rond + racines exposees (revenu DES RACINES, pas plante). Le houppier
               passe d'encre (mort/vide) a VERT en cascade gauche->centre->droite f57/70/84 ; apogee
               vert profond f221-295. Les troncs+racines se-tracent d'abord (encre, f10-55), PUIS la vie
               (le vert) gagne le houppier. Memes positions que les 3 souches d'origine. ---- */}
          {[
            // [base x, base y, scale, leaf index, sway sign, swell extra]
            { tx: 235, ty: 1320, s: 0.66, i: 0, sway: 1, extra: 1 },
            { tx: 540, ty: 1345, s: 0.74, i: 1, sway: 0.6, extra: 1.04 }, // centre, le plus haut
            { tx: 832, ty: 1320, s: 0.64, i: 2, sway: -1, extra: 1 },
          ].map((t) => {
            const pop = treePop(t.i);
            const g = crownGrowth(t.i);
            // le tronc/racines apparaissent en encre des f10-55 ; le houppier ne pousse qu'avec g.
            const trunkOpacity = clampI(frame, [10, 55], [0, 1]);
            // le houppier prend un leger gonflement a l'apogee + balancement au vent (vie)
            const crownScale = Math.min(1, Math.max(0, pop)) * canopySwell * t.extra;
            return (
              <g key={t.i}>
                {/* racines + tronc (le vieux bois d'ou la vie repart). Finition Aziz : APRES le
                    verdissement, les racines virent en OCRE TERRE (la couleur "terre" du short) =
                    la vie ancree dans le sol. Cross-fade encre->ocre pilote par g (verdissement). */}
                <g
                  transform={`translate(${t.tx} ${t.ty}) scale(${t.s})`}
                  opacity={trunkOpacity}
                >
                  <Roots color={g > 0.5 ? OCRE_TERRE : ENCRE} />
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

          {/* ---- CUVETTE demi-lune (avant-plan, echo Beat 4) + EAU retenue (f0-56) ----
               reprise de la cible. La surface d'eau (cuvette_eau) GRANDIT (pluie retenue) + ondule. ---- */}
          <g id="cuvette" opacity={clampI(frame, [5, 45], [0, 1])}>
            <path
              d="M 120,1620 Q 540,2050 960,1620 Q 540,1860 120,1620 Z"
              fill={CREME}
              stroke={ENCRE}
              strokeWidth={4}
              strokeLinejoin="round"
            />
            {/* hachures du fond de cuvette (texture terre) */}
            <path
              d="M170 1670 Q180 1710 150 1730 M280 1770 Q290 1810 250 1840 M430 1850 Q440 1900 400 1930 M590 1870 Q590 1920 570 1960 M750 1810 Q740 1860 740 1890 M880 1700 Q870 1740 890 1760"
              fill="none"
              stroke={ENCRE}
              strokeWidth={1.5}
              opacity={0.45}
            />
            {/* EAU retenue (finition #4) : la pluie remplit la demi-lune. Corps d'eau visible (bleu-gris
                 encre-compatible) clippe dans le fond de la cuvette + surface qui grandit f0-56 + reflets
                 clairs qui ondulent -> on comprend que ce trou CAPTE LA PLUIE. */}
            <defs>
              <clipPath id="cuvetteInner">
                <path d="M 120,1620 Q 540,2050 960,1620 Q 540,1860 120,1620 Z" />
              </clipPath>
            </defs>
            <g opacity={cuvetteFill} clipPath="url(#cuvetteInner)">
              {/* corps d'eau retenu dans le creux (descend dans la cuvette) — bleu PLUS VISIBLE (Aziz) */}
              <path
                d={`M ${150 + (1 - cuvetteFill) * 220},${1652} Q 540,${1710 + ripple * 3} ${930 - (1 - cuvetteFill) * 220},${1652} Q 540,${1900} ${150 + (1 - cuvetteFill) * 220},${1652} Z`}
                fill={BLEU}
                opacity={0.78}
              />
              {/* surface d'eau (ellipse-bande) + bord clair (la ligne de flottaison) */}
              <path
                d={`M ${150 + (1 - cuvetteFill) * 220},${1652} Q 540,${1700 + ripple * 3} ${930 - (1 - cuvetteFill) * 220},${1652} Q 540,${1685 + ripple * 2} ${150 + (1 - cuvetteFill) * 220},${1652} Z`}
                fill={BLEU_CLAIR}
                opacity={0.85}
              />
              {/* reflets clairs qui ondulent sur la surface (lecture "eau") */}
              <path
                d={`M ${260},${1660 + ripple * 2} Q 540,${1688 + ripple * 2} ${820},${1660 + ripple * 2}`}
                fill="none"
                stroke={BLEU_CLAIR}
                strokeWidth={2.5}
                opacity={0.8}
              />
              <path
                d={`M ${360},${1700 - ripple * 2} Q 540,${1724 - ripple * 2} ${720},${1700 - ripple * 2}`}
                fill="none"
                stroke={BLEU_CLAIR}
                strokeWidth={1.8}
                opacity={0.55}
              />
            </g>
            {/* cercle d'impact de la goutte finale (f584+) */}
            {dropRing > 0.001 && (
              <>
                <ellipse
                  cx={540}
                  cy={1680}
                  rx={30 + 120 * dropRing}
                  ry={10 + 36 * dropRing}
                  fill="none"
                  stroke={BLEU_CLAIR}
                  strokeWidth={3}
                  opacity={(1 - dropRing) * 0.9}
                />
                <ellipse
                  cx={540}
                  cy={1680}
                  rx={15 + 70 * dropRing}
                  ry={5 + 22 * dropRing}
                  fill="none"
                  stroke={BLEU_CLAIR}
                  strokeWidth={2}
                  opacity={(1 - dropRing) * 0.7}
                />
              </>
            )}
          </g>

          {/* ---- LA GOUTTE finale (f565-588) : tombe du bord du puits vers la cuvette ----
               le puits decale/ancre (905,765 scale 1.45, remonte de 70), le bord est ~ (905, 586) a l'ecran.
               Elle tombe vers la cuvette (~540, 1670). Trajectoire simple, frame-driven. */}
          {dropFall > 0.001 && dropFall < 0.999 && (
            <circle
              cx={905 + (540 - 905) * dropFall}
              cy={586 + (1670 - 586) * (dropFall * dropFall)}
              r={9}
              fill={BLEU}
              opacity={0.9}
            />
          )}

          {/* ---- LE BILLET "20$/hectare" (f296-334, finition #2) : rectangle de billet stylise encre ----
               tombe-sec (spring) pres de la cuvette PUIS se colore VERT-DOLLAR (l'argent). Plus lisible
               qu'une piece. Pose a gauche, ~ (215, 1560). Dessine de face, legere perspective inclinee. */}
          {billetPop > 0.01 && (
            <g
              transform={`translate(215 ${1560 + billetDrop}) scale(${Math.min(1.08, billetPop)}) rotate(-7)`}
              opacity={clampI(frame, [296, 312], [0, 1])}
            >
              {/* corps du billet (rectangle large, coins legers) */}
              <rect x={-95} y={-50} width={190} height={100} rx={6} fill={billetFill} stroke={billetInk} strokeWidth={4} />
              {/* cadre interieur du billet */}
              <rect x={-80} y={-37} width={160} height={74} rx={4} fill="none" stroke={billetInk} strokeWidth={1.6} opacity={0.7} />
              {/* medaillon central (cercle ovale, comme un portrait/sceau de billet) */}
              <ellipse cx={0} cy={0} rx={26} ry={30} fill="none" stroke={billetInk} strokeWidth={2.2} opacity={0.8} />
              {/* signe dollar au centre (lisible : c'est de l'argent) */}
              <path
                d="M0 -18 L0 18 M-9 -11 C-9 -17 9 -17 9 -10 C9 -3 -9 -3 -9 4 C-9 11 9 11 9 5"
                fill="none"
                stroke={billetInk}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* lignes de guillochis (les fines lignes d'un billet) gauche/droite */}
              <path
                d="M-72 -22 L-40 -22 M-72 -10 L-40 -10 M-72 2 L-40 2 M-72 14 L-40 14 M-72 26 L-40 26"
                stroke={billetInk}
                strokeWidth={1.2}
                opacity={0.55}
              />
              <path
                d="M40 -22 L72 -22 M40 -10 L72 -10 M40 2 L72 2 M40 14 L72 14 M40 26 L72 26"
                stroke={billetInk}
                strokeWidth={1.2}
                opacity={0.55}
              />
            </g>
          )}
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

      {/* ============ MICRO-LABEL CUVETTE (finition #4) : explique le trou demi-lune ============
           place EN HAUT (sous le cadre), discret encre, pour NE PAS entrer en conflit avec les
           sous-titres (en bas ~y1620) ni les micro-sources. Visible pendant que la cuvette se remplit. */}
      {/* MICRO-LABEL CUVETTE RETIRE (demande Aziz) : la phrase "la demi-lune retient la pluie"
          en haut a cote du soleil n'avait pas de sens a cet endroit. La cuvette se lit par son
          eau bleue (rendue plus visible) + le geste des filets vers le puits. */}

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

export default B5LaPreuve;
