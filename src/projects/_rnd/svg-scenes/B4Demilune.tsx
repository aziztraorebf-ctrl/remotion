/**
 * B4Demilune — Beat 4 GGW "LE RETOURNEMENT / FMNR" (registre ENCRE NARRATIVE, anime).
 *
 * VRAIE reponse du beat : la REGENERATION NATURELLE ASSISTEE (FMNR) decouverte par l'agronome
 *   Tony Rinaudo au Niger des les annees 80. Le sol "mort" cachait une FORET SOUTERRAINE : des
 *   millions de SOUCHES encore vivantes. Il suffit de les PROTEGER et de les TAILLER pour qu'elles
 *   repoussent — SANS PLANTER. (Nom de fichier + export B4Demilune conserves : Root.tsx l'importe ainsi.)
 *
 * INTENTION : LE RETOURNEMENT / L'ESPOIR. "Ce qu'on croyait mort est vivant." Verbe : REVEILLER.
 *
 * ⛔ NOUVELLE IMAGE (v4, metaphore renforcee, validee Aziz) — DEUX PLANS FIXES, raccord par FADE
 *    (PAS de mouvement camera : un scale/translate global d'une scene SVG frontale la FAIT VALSER —
 *     acquis #5 PROUVE. Chaque plan est FRONTAL et IMMOBILE ; on passe de l'un a l'autre par cross-fade).
 *
 *   OPENING (f0 -> f170) "Mais la vraie reponse existait deja / des les annees 80, bien avant ce grand
 *     projet" : on MEUBLE le debut (avant, il etait vide). Le SOL MORT se trace (horizon, hachures ocre)
 *     + UNE souche grise coupee apparait au centre, isolee, abandonnee ("rien ne pousse ici"). Pose le decor.
 *
 *   PORTRAIT (f170 -> ~322) "un agronome, Tony Rinaudo" : la gravure encre de Rinaudo apparait PLEINE
 *     (fade + respiration) + cartouche colle dessous, tenue ~3s, puis se reduit en medaillon coin + s'estompe.
 *
 *   PLAN 1 — GROS PLAN D'UNE SOUCHE (f322 -> ~412) "Sous ce sol mort dormait une foret entiere" : un gros
 *     plan rapproche et LISIBLE d'une vraie souche coupee (cernes concentriques du bois, ecorce hachuree,
 *     tronc scie net), posee dans la terre. On DECOUVRE que le BOIS EST ENCORE VIVANT au BORD (cambium qui
 *     s'illumine en vert-terre = la vie cachee) + ses racines profondes vivantes se revelent. "Mort = vivant".
 *
 *   CROSS-FADE -> PLAN 2 — LE CHAMP (f412 -> ~480) "Des millions de souches encore vivantes" : plan large,
 *     un CHAMP de souches grises identiques (le sol "mort") -> une a une, leur COEUR vivant s'illumine en
 *     vert (cascade qui se propage) = l'echelle (millions) + le retournement "c'etait vivant tout ce temps".
 *
 *   GESTE FMNR (f483 -> 561) "qu'il suffisait de proteger et de tailler pour les faire repousser" : un REJET
 *     VERT perce du BORD de la souche heros (la ou le bois vit — PAS du centre comme un pot) + un HALO de
 *     PROTECTION discret se pose autour + 1-2 traits de TAILLE nets (on elague le superflu) -> le rejet
 *     GRANDIT (spring). Le SOIN se voit (protege + taille) SANS main humaine (proscrit : l'organique vivant).
 *
 *   "Pas besoin de planter" (f626-658) : on insiste — main+graine BARREE (aucune plantation).
 *
 *   CLIMAX (f680 -> 740) "La foret etait deja la, sous leurs pieds" : les souches deviennent des ARBRES
 *     VERTS pleins (cross-fade encre->vert, LeafyCrown) = une FORET ; les racines vivantes relient le tout
 *     sous terre. Derniere image qui RESTE et VIT (houppiers oscillent au vent leger).
 *
 * COULEUR TIMEE (acquis #3) : monde en ENCRE. VERT (#3e8f34) garde pour le CLIMAX (arbres). Vert-terre
 *   (#5d7d3a) discret sur le bois vivant / racines. OR (#d8a43a) possible sur "souches encore vivantes".
 *
 * GRAMMAIRE : spring pop / stroke-dashoffset / cross-fade opacite / clip-path ; clamp partout, frame-driven
 *   (zero CSS transition/keyframes/setTimeout/rAF) ; scenes SVG FIXES, raccord par fade. Objet inerte = fade.
 *
 * Composition 1080x1920 (9:16), 750 frames @30fps (24.985s). Audio : narration-beat4.mp3.
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
  Img,
  staticFile,
} from "remotion";

const CREME = "#e8dcc0";
const ENCRE = "#2b2117";
// JAUNE SOLEIL (finition Aziz) — le soleil colore + rayonne (coherent avec B5)
const JAUNE = "#e8b44a";
const JAUNE_D = "#b5862b";
const VERT = "#3e8f34"; // vert pousse / climax — vert du short (B2/B3/B5/B6)
const VERT_D = "#295c1c";
// VERT-TERRE discret = la vie cachee (cambium / racines), avant le climax (retenu)
const VERT_TERRE = "#5d7d3a";
// OR = touche sur "souches encore vivantes" (la vie endormie qui se reveille)
const OR = "#d8a43a";
// OCRE = sol mort/sec de surface (la cause/le point de depart, en echo B3)
const OCRE_TERRE = "#b5651d";

// grande valeur de dash pour le se-dessine (longueurs de path inconnues -> sur-dimensionne + clamp)
const DASH = 4200;

const clampI = (f: number, inR: [number, number], outR: [number, number]) =>
  interpolate(f, inR, outR, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// cross-fade lineaire encre->couleur (pour les bois/troncs qui reverdissent)
const mix = (t: number, from: number, to: number) =>
  Math.round(from + (to - from) * t);
const inkToColor = (t: number, r: number, g: number, b: number) =>
  t < 0.001
    ? ENCRE
    : `rgb(${mix(t, 0x2b, r)},${mix(t, 0x21, g)},${mix(t, 0x17, b)})`;

/* ============================================================================================
   HOUPPIER REVERDISSANT (cercles de feuillage + nervures). Pose au-dessus d'un tronc (cy<0).
   g = avancement vert 0..1. ============================================================================================ */
const LEAF_POS: [number, number, number][] = [
  [-46, -250, 44],
  [-8, -284, 48],
  [34, -274, 50],
  [70, -244, 42],
  [-24, -224, 42],
  [38, -218, 40],
  [8, -256, 52],
  [-66, -226, 30],
  [92, -226, 28],
];
// ⛔ ANCIEN LeafyCrown (gros houppier d'arbre) retire du climax : Aziz a juge que les souches qui
//   deviennent des arbres geants flottants = faux + ressemblaient a des pots de plantes. Conserve au
//   cas ou (non utilise). La FMNR au depart = des REJETS sur des souches, pas une foret mature.
const LeafyCrown: React.FC<{ g: number }> = ({ g }) => {
  const fill = g < 0.5 ? CREME : VERT;
  const stroke = g > 0.5 ? VERT_D : ENCRE;
  return (
    <g opacity={g}>
      {LEAF_POS.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r * (0.6 + 0.4 * g)} fill={fill} stroke={stroke} strokeWidth={2.5} />
      ))}
    </g>
  );
};

/* ⭐ JEUNE POUSSE (le CLIMAX FMNR, valide Aziz) : la souche "morte" repart = une courte tige verte +
   3-4 PETITES FEUILLES qui s'ouvrent (PAS un arbre geant). g = avancement 0..1 (couleur+croissance).
   big = la souche HEROS pousse un peu plus haut (point focal, l'avenir suggere). Ancree au sommet
   de la souche (0,0 = haut du tronc scie). Balancement leger au vent quand etabli (sway). */
const SproutLeaves: React.FC<{ g: number; big?: boolean; sway?: number }> = ({ g, big = false, sway = 0 }) => {
  if (g <= 0.001) return null;
  const h = (big ? 132 : 78) * g; // hauteur de la tige (le heros monte plus haut)
  const lf = clampI(g, [0.35, 1], [0, 1]); // ouverture des feuilles (apres la tige)
  const leafFill = g > 0.55 ? VERT : CREME;
  // 4 feuilles : 2 paires opposees le long de la tige + 1 terminale
  return (
    <g transform={`rotate(${sway},0,0)`}>
      {/* tige */}
      <path d={`M0,0 C${4 * g},${-h * 0.4} ${-4 * g},${-h * 0.7} 0,${-h}`} fill="none" stroke={g > 0.5 ? VERT_D : ENCRE} strokeWidth={5} strokeLinecap="round" />
      {/* paire basse */}
      <path d={`M0,${-h * 0.42} C${-26 * lf},${-h * 0.42 - 8 * lf} ${-34 * lf},${-h * 0.55} ${-24 * lf},${-h * 0.62} C${-12 * lf},${-h * 0.56} ${-6 * lf},${-h * 0.48} 0,${-h * 0.42} Z`} fill={leafFill} stroke={VERT_D} strokeWidth={2.5} strokeLinejoin="round" opacity={lf} />
      <path d={`M0,${-h * 0.5} C${26 * lf},${-h * 0.5 - 8 * lf} ${34 * lf},${-h * 0.63} ${24 * lf},${-h * 0.7} C${12 * lf},${-h * 0.64} ${6 * lf},${-h * 0.56} 0,${-h * 0.5} Z`} fill={leafFill} stroke={VERT_D} strokeWidth={2.5} strokeLinejoin="round" opacity={lf} />
      {/* paire haute (heros : une 4e paire) */}
      {big && (
        <path d={`M0,${-h * 0.72} C${-22 * lf},${-h * 0.72 - 7 * lf} ${-30 * lf},${-h * 0.84} ${-20 * lf},${-h * 0.9} C${-10 * lf},${-h * 0.85} ${-5 * lf},${-h * 0.78} 0,${-h * 0.72} Z`} fill={leafFill} stroke={VERT_D} strokeWidth={2.5} strokeLinejoin="round" opacity={lf} />
      )}
      {/* feuille terminale (le bourgeon qui s'ouvre) */}
      <path d={`M0,${-h} C${-14 * lf},${-h - 4 * lf} ${-18 * lf},${-h - 18 * lf} 0,${-h - 26 * lf} C${18 * lf},${-h - 18 * lf} ${14 * lf},${-h - 4 * lf} 0,${-h} Z`} fill={leafFill} stroke={VERT_D} strokeWidth={2.5} strokeLinejoin="round" opacity={lf} />
    </g>
  );
};

/* ============================================================================================
   GROS PLAN D'UNE SOUCHE LISIBLE (PLAN 1 + climax central). Dessinee centree sur (0,0) = sommet
   scie au centre. Cernes concentriques, ecorce hachuree, bois vivant au BORD (cambium).
   ============================================================================================ */
// ⛔ ANTI-BARRIQUE : une VRAIE souche d'arbre coupe = LARGE et BASSE (pas un cylindre haut), flancs
//   IRREGULIERS et evases vers la base, sommet scie DOMINANT. (le pot/barrique = haut + flancs droits)
// disque scie (sommet) — large ellipse vue de 3/4, c'est l'element HERO du gros plan
const GP_TOP =
  "M-210,-6 C-206,-66 206,-66 210,-6 C206,52 -206,52 -210,-6 Z";
// flancs du tronc : COURTS et IRREGULIERS, evases vers le bas (racines apparentes), bosses d'ecorce
const GP_SIDE =
  "M-210,0 C-224,52 -208,108 -176,150 C-150,176 -120,184 -70,190 C-20,196 30,196 84,188 C140,178 180,158 200,120 C214,86 210,44 210,0";
// cernes concentriques du bois (ellipses emboitees, decentrees = coeur naturel)
const GP_RINGS = [
  "M-168,-6 C-166,-50 170,-50 172,-6 C170,40 -166,40 -168,-6 Z",
  "M-120,-10 C-118,-44 128,-44 130,-10 C128,30 -118,30 -120,-10 Z",
  "M-72,-8 C-70,-32 84,-32 86,-8 C84,16 -70,16 -72,-8 Z",
  "M-32,-12 C-30,-24 44,-24 46,-12 C44,4 -30,4 -32,-12 Z",
];
// stries radiales (rayons du bois) — partent du coeur decentre
const GP_RAYS =
  "M8,-44 L4,-22 M-92,-30 L-58,-16 M104,-30 L66,-16 M-150,-8 L-104,-4 M156,-8 L108,-4 M8,30 L4,14 M-60,28 L-36,14 M76,28 L48,14";
// ecorce hachuree sur les flancs (fentes courtes, irregulieres = ecorce craquelee, pas des douves)
const GP_BARK =
  "M-176,30 C-184,80 -178,130 -160,166 M-120,42 C-128,90 -124,140 -110,176 M-58,50 C-64,100 -62,150 -54,186 M22,50 C26,100 24,150 16,186 M96,44 C104,92 100,142 84,176 M158,32 C168,80 164,130 142,166 M-90,60 C-94,100 -92,140 -82,170 M58,58 C62,100 60,142 50,176";
// racines profondes (partent de la base evasee du tronc vers le bas)
const GP_ROOTS =
  "M-150,180 C-200,260 -250,340 -284,470 M-70,190 C-100,300 -110,430 -120,580 M70,190 C104,300 116,430 128,580 M150,180 C208,260 264,340 300,470";
// zone de bois VIVANT = anneau-croissant sur le BORD du disque scie (cambium, juste sous l'ecorce).
//   fillRule=evenodd : le grand contour moins le contour interieur => un ANNEAU (le bord du bois qui vit).
const GP_CAMBIUM =
  "M-204,-6 C-200,-62 200,-62 204,-6 C200,48 -200,48 -204,-6 Z M-168,-6 C-166,-50 170,-50 172,-6 C170,40 -166,40 -168,-6 Z";

/* ============================================================================================
   PETITE SOUCHE (PLAN 2 — le champ). Vue frontale simple, tronc scie + coeur (revele vert).
   Relative a sa base (0,0) posee sur la ligne de sol. ============================================================================================ */
const FS_TRUNK =
  "M-40,0 C-44,-40 -38,-68 -28,-80 L28,-80 C40,-68 44,-40 40,0 Z";
const FS_RINGS =
  "M-20,-78 C-6,-86 10,-86 22,-78 M-26,-74 C-4,-88 14,-88 28,-74 M-10,-79 C0,-83 6,-83 12,-79";
const FS_CORE = "M-14,-79 C-2,-85 6,-85 14,-79 C8,-72 -8,-72 -14,-79 Z"; // coeur (cambium) revele vert
const FS_SHOOT = "M0,-78 C6,-110 0,-140 8,-176";
const FS_LEAF = "M8,-176 C-12,-184 -8,-202 6,-202 C16,-198 14,-184 8,-176 Z";

// disposition du CHAMP : 12 petites souches sur 3 rangs (perspective frontale, pas de profondeur 3D)
type FieldStump = { x: number; y: number; scale: number; order: number };
// order = ordre de la cascade verte au CLIMAX. Le rang AVANT (grand, dominant) reverdit EN PREMIER
//   (orders 0-3) pour que l'image de fin lise une FORET ; le fond reverdit ensuite (4-11). Le HERO
//   (x=540, rang avant) garde order 1 (le rejet FMNR vient de lui en amont).
const FIELD: FieldStump[] = [
  // rang du fond (haut, petites) — reverdit en DERNIER
  { x: 220, y: 980, scale: 0.62, order: 8 },
  { x: 430, y: 968, scale: 0.66, order: 6 },
  { x: 640, y: 974, scale: 0.6, order: 10 },
  { x: 860, y: 984, scale: 0.64, order: 7 },
  // rang median
  { x: 160, y: 1130, scale: 0.82, order: 5 },
  { x: 400, y: 1142, scale: 0.86, order: 4 },
  { x: 660, y: 1136, scale: 0.84, order: 5 },
  { x: 910, y: 1148, scale: 0.8, order: 9 },
  // rang avant (bas, grandes) — reverdit en PREMIER (le plus visible)
  { x: 250, y: 1320, scale: 1.05, order: 2 },
  { x: 540, y: 1336, scale: 1.12, order: 1 },
  { x: 820, y: 1316, scale: 1.04, order: 3 },
  { x: 110, y: 1300, scale: 0.92, order: 0 },
];

export const B4Demilune: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // raccord vers B5 : leger fade global en toute fin (pas de mouvement, juste fade)
  const endFade = clampI(frame, [732, 750], [1, 0.94]);

  /* =================== COUCHE DE FOND PERMANENTE ===================
     Cadre + soleil discret. Le soleil respire. Ne s'arrete jamais. */
  const sunIn = clampI(frame, [0, 30], [0, 1]);
  const sunPulse = 1 + 0.02 * Math.sin(frame / 13);
  // soleil JAUNE qui rayonne (finition Aziz) : halo respirant + rayons qui pulsent/tournent lentement
  const sunRot = frame * 0.1;
  const rayPulse = 0.5 + 0.5 * Math.sin(frame / 11);
  const sunHaloR = 96 + 6 * Math.sin(frame / 17);

  /* =================== OPENING (f0 -> f170) : MEUBLER — sol mort + UNE souche isolee ===================
     "Mais la vraie reponse existait deja / des les annees 80, bien avant ce grand projet." */
  const openIn = clampI(frame, [8, 60], [0, 1]); // le sol mort se trace
  const openStumpPop = spring({
    frame: frame - 40,
    fps,
    config: { mass: 1, damping: 16, stiffness: 80 },
    durationInFrames: 40,
  }); // la souche grise isolee apparait
  // l'opening s'estompe quand le portrait arrive (f150-175)
  const openFade = 1 - clampI(frame, [150, 178], [0, 1]);

  /* =================== PORTRAIT (f170 -> ~322) ===================
     Plein centre (f170), tenu, puis medaillon coin haut-gauche + estompe. */
  const portraitIn = clampI(frame, [170, 200], [0, 1]);
  const toMedallion = clampI(frame, [288, 322], [0, 1]);
  const medallionFade = interpolate(frame, [322, 360, 400], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cartoucheIn = clampI(frame, [196, 222], [0, 1]);
  const cartoucheOut = 1 - clampI(frame, [288, 312], [0, 1]);
  const pW = interpolate(toMedallion, [0, 1], [560, 150]);
  const pCX = interpolate(toMedallion, [0, 1], [540, 175]);
  const pCY = interpolate(toMedallion, [0, 1], [560, 250]);
  const portraitBreath = 1 + 0.012 * Math.sin(frame / 17) * (1 - toMedallion);
  const portraitOpacity = portraitIn * (toMedallion < 1 ? 1 : medallionFade);

  /* =================== PLAN 1 — GROS PLAN D'UNE SOUCHE (f322 -> ~412) ===================
     "Sous ce sol mort dormait une foret entiere." Plan FIXE, frontal. */
  const plan1In = clampI(frame, [318, 352], [0, 1]); // fade-in plan 1
  const plan1Out = 1 - clampI(frame, [410, 440], [0, 1]); // cross-fade vers plan 2 (sortie nette)
  const plan1Op = plan1In * plan1Out;
  // gros plan : surface (sol mort) se-trace, cernes se-dessinent, puis le BOIS VIVANT (cambium) s'illumine
  const gpSurfaceDraw = clampI(frame, [324, 372], [DASH, 0]);
  const gpRingsDraw = clampI(frame, [340, 392], [DASH, 0]);
  const gpRootDraw = clampI(frame, [348, 405], [DASH, 0]);
  const gpCambiumLife = clampI(frame, [372, 410], [0, 1]); // le bord du bois est VIVANT (vert-terre)
  const gpRootLife = clampI(frame, [380, 412], [0, 1]);

  /* =================== PLAN 2 — LE CHAMP (f412 -> ~480) ===================
     "Des millions de souches encore vivantes." Plan large FIXE, frontal. */
  const plan2In = clampI(frame, [418, 458], [0, 1]); // cross-fade-in du champ
  // chaque souche revele son coeur vivant en cascade (vert), propagation
  const coreReveal = (order: number) =>
    clampI(frame, [444 + order * 7, 478 + order * 7], [0, 1]);
  const goldWave = (order: number) =>
    clampI(frame, [444 + order * 7, 474 + order * 7], [0, 1]) *
    (1 - clampI(frame, [600, 660], [0, 1])); // OR sur "souches vivantes", retire avant climax

  /* =================== GESTE FMNR (f483 -> 561) ===================
     "qu'il suffisait de proteger et de tailler pour les faire repousser."
     Sur la souche HEROS (au centre du champ, x=540). Rejet du BORD + halo protection + traits de taille. */
  const heroOrder = 1; // la grande souche centrale (x=540,y=1336)
  const protectIn = clampI(frame, [483, 522], [0, 1]); // halo de protection
  const tailleFlash =
    clampI(frame, [537, 552], [0, 1]) * (1 - clampI(frame, [552, 574], [0, 1])); // trait de taille net
  const shootGrow = spring({
    frame: frame - 516,
    fps,
    config: { mass: 1, damping: 14, stiffness: 88 },
    durationInFrames: 52,
  }); // le rejet jaillit du BORD de la souche heros

  /* =================== "Pas besoin de planter" (f626-658) =================== */
  const noPlantPulse = clampI(frame, [620, 650], [0, 1]);

  /* =================== CLIMAX (f680 -> 740) ===================
     "La foret etait deja la, sous leurs pieds." Les souches -> ARBRES VERTS pleins (cascade). */
  // cascade verte compressee : toutes les souches reverdissent AVANT la fin (max order 11 -> 666+44+44=754,
  //   on calе sur ~3.5px/order pour que la DERNIERE soit pleine vers f730 = "une foret", pas a moitie).
  const greenWave = (order: number) =>
    clampI(frame, [664 + order * 3.5, 664 + order * 3.5 + 42], [0, 1]);
  const aliveFinal = clampI(frame, [700, 730], [0, 1]);
  // reseau racinaire vivant sous le champ se-trace au climax (relie tout)
  const rootWebIn = clampI(frame, [664, 692], [0, 1]);
  const rootWebDraw = clampI(frame, [668, 724], [DASH, 0]);
  const rootWebGreen = clampI(frame, [692, 740], [0, 1]);

  /* ---------------- SOUS-TITRES KARAOKE (acquis #7) ---------------- */
  const narrationSec = frame / fps;

  return (
    <AbsoluteFill style={{ background: CREME }}>
      <Audio src={staticFile("audio/ggw-muraille-verte/narration-beat4.mp3")} />

      {/* ============ COUCHE SFX (frame-driven via <Sequence from=>) — tous sous la narration ============ */}
      <Audio
        src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-vent.mp3")}
        volume={0.12}
      />
      {/* f372 PLAN 1 : le bois vivant se revele (shimmer souterrain doux) */}
      <Sequence from={368} durationInFrames={70}>
        <Audio
          src={staticFile(
            "audio/ggw-muraille-verte/sfx/ggw-sfx-reveal-souterrain.mp3"
          )}
          volume={0.5}
        />
      </Sequence>
      {/* f444 PLAN 2 : la multitude qui s'eveille (re-emploi reveal, plus discret) */}
      <Sequence from={440} durationInFrames={70}>
        <Audio
          src={staticFile(
            "audio/ggw-muraille-verte/sfx/ggw-sfx-reveal-souterrain.mp3"
          )}
          volume={0.42}
        />
      </Sequence>
      {/* f537 "tailler" : le coup de taille (secateur sec) */}
      <Sequence from={537} durationInFrames={20}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-taille.mp3")}
          volume={0.6}
        />
      </Sequence>
      {/* f516 "...pour les faire repousser" : le rejet jaillit */}
      <Sequence from={516} durationInFrames={60}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-pousse.mp3")}
          volume={0.7}
        />
      </Sequence>
      {/* f664 "La foret etait deja la" : la foret revient */}
      <Sequence from={664} durationInFrames={60}>
        <Audio
          src={staticFile("audio/ggw-muraille-verte/sfx/ggw-sfx-eau-remonte.mp3")}
          volume={0.5}
        />
      </Sequence>

      {/* ============ FOND PARCHEMIN + CADRE + SOLEIL (couche permanente) ============ */}
      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        opacity={endFade}
        style={{ position: "absolute", inset: 0 }}
      >
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

        {/* ---- SOLEIL JAUNE qui RAYONNE (finition Aziz) : present toute la scene, autant le colorer +
             l'animer. Halo jaune respirant + disque jaune + rayons qui pulsent et tournent lentement. ---- */}
        <g
          id="soleil"
          opacity={sunIn}
          transform={`translate(${860 * (1 - sunPulse)} ${250 * (1 - sunPulse)}) scale(${sunPulse})`}
        >
          {/* halo jaune respirant */}
          <circle cx={860} cy={250} r={sunHaloR} fill={JAUNE} opacity={0.1 + 0.06 * rayPulse} />
          {/* anneau pointille */}
          <circle cx={860} cy={250} r={92} fill="none" stroke={JAUNE_D} strokeWidth={1.5} strokeDasharray="11 18" opacity={0.3 + 0.15 * rayPulse} />
          {/* disque jaune plein + contour ocre */}
          <circle cx={860} cy={250} r={64} fill={JAUNE} stroke={JAUNE_D} strokeWidth={4} />
          {/* rayons jaunes : 12 traits qui pulsent (longueur) et tournent tres lentement */}
          <g transform={`rotate(${sunRot} 860 250)`} stroke={JAUNE_D} strokeWidth={3.5} strokeLinecap="round" opacity={0.5 + 0.3 * rayPulse}>
            {Array.from({ length: 12 }).map((_, k) => {
              const a = (k * Math.PI * 2) / 12;
              const r0 = 76;
              const r1 = 76 + 22 + 14 * rayPulse;
              return (
                <line
                  key={k}
                  x1={860 + Math.cos(a) * r0}
                  y1={250 + Math.sin(a) * r0}
                  x2={860 + Math.cos(a) * r1}
                  y2={250 + Math.sin(a) * r1}
                />
              );
            })}
          </g>
        </g>

        {/* =========================================================================================
            OPENING (f0->170) — SOL MORT + UNE SOUCHE GRISE ISOLEE (meuble le debut, scene FIXE)
            ========================================================================================= */}
        {openFade > 0.001 && (
          <g id="opening" opacity={openFade}>
            {/* horizon / ligne de sol */}
            <path
              d="M90,1180 C 320,1170 560,1188 800,1176 C 920,1170 990,1182 1000,1178"
              fill="none"
              stroke={ENCRE}
              strokeWidth={4}
              strokeDasharray={DASH}
              strokeDashoffset={clampI(frame, [12, 64], [DASH, 0])}
              opacity={openIn}
            />
            {/* plaques de sol sec craquele (ocre discret) */}
            <g opacity={openIn * 0.85}>
              <g opacity={clampI(frame, [30, 80], [0, 0.42])}>
                <path d="M120,1184 L300,1178 L330,1150 L150,1156 Z" fill={OCRE_TERRE} stroke="none" />
                <path d="M420,1186 L640,1190 L660,1158 L440,1152 Z" fill={OCRE_TERRE} stroke="none" />
                <path d="M740,1182 L940,1176 L960,1150 L760,1154 Z" fill={OCRE_TERRE} stroke="none" />
              </g>
              <path
                d="M120,1184 L300,1178 L330,1150 L150,1156 Z M420,1186 L640,1190 L660,1158 L440,1152 Z M740,1182 L940,1176 L960,1150 L760,1154 Z"
                fill="none"
                stroke={ENCRE}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeDasharray={DASH}
                strokeDashoffset={clampI(frame, [26, 86], [DASH, 0])}
                opacity={0.8}
              />
              {/* hachures seches */}
              <path
                d="M200,1166 L212,1144 M380,1172 L392,1150 M560,1168 L572,1146 M820,1164 L832,1142"
                stroke={ENCRE}
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={clampI(frame, [40, 90], [0, 0.5])}
              />
            </g>
            {/* UNE souche grise coupee, isolee au centre (abandonnee) */}
            <g
              transform={`translate(540,1178) scale(${1.05 * openStumpPop})`}
              opacity={openStumpPop}
            >
              <path d={FS_TRUNK} fill={CREME} stroke={ENCRE} strokeWidth={5} strokeLinejoin="round" />
              <path d={FS_RINGS} fill="none" stroke={ENCRE} strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
              {/* ecorce sombre = morte en apparence */}
              <path
                d="M-30,-8 L-26,-72 M-8,-6 L-6,-76 M14,-8 L12,-74 M30,-10 L26,-66"
                fill="none"
                stroke={ENCRE}
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.55}
              />
            </g>
          </g>
        )}

        {/* =========================================================================================
            PLAN 1 — GROS PLAN D'UNE SOUCHE LISIBLE (f322->412, scene FIXE frontale)
            "Sous ce sol mort dormait une foret entiere" — on decouvre le bois VIVANT au bord.
            Centre du gros plan : (540, 980). ========================================================================================= */}
        {plan1Op > 0.001 && (
          <g id="plan1_gros_plan" opacity={plan1Op} transform="translate(540,980)">
            {/* ligne de surface (sol) qui coupe la souche */}
            <path
              d="M-470,12 C-260,4 -60,20 140,10 C320,2 440,16 470,10"
              fill="none"
              stroke={ENCRE}
              strokeWidth={4}
              strokeDasharray={DASH}
              strokeDashoffset={gpSurfaceDraw}
            />
            {/* plaques de sol mort autour (ocre discret) */}
            <g opacity={clampI(frame, [336, 392], [0, 0.4])}>
              <path d="M-470,14 L-280,8 L-260,-18 L-450,-12 Z" fill={OCRE_TERRE} stroke="none" />
              <path d="M260,12 L460,16 L470,-12 L280,-16 Z" fill={OCRE_TERRE} stroke="none" />
            </g>

            {/* RACINES profondes vivantes (se-tracent, puis teinte vert-terre = vie cachee) */}
            <path
              d={GP_ROOTS}
              fill="none"
              stroke={inkToColor(gpRootLife * 0.9, 0x5d, 0x7d, 0x3a)}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={DASH}
              strokeDashoffset={gpRootDraw}
              opacity={0.45 + 0.55 * clampI(frame, [348, 405], [0, 1])}
            />

            {/* FLANCS du tronc (ecorce) */}
            <path d={GP_SIDE} fill={CREME} stroke={ENCRE} strokeWidth={6} strokeLinejoin="round" />
            <path
              d={GP_BARK}
              fill="none"
              stroke={ENCRE}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.65}
              strokeDasharray={DASH}
              strokeDashoffset={clampI(frame, [344, 396], [DASH, 0])}
            />

            {/* DISQUE scie (sommet) */}
            <path d={GP_TOP} fill={CREME} stroke={ENCRE} strokeWidth={5} strokeLinejoin="round" />
            {/* CAMBIUM (bord du bois) qui s'illumine VIVANT (vert-terre) — anneau (evenodd) */}
            <path
              d={GP_CAMBIUM}
              fill={inkToColor(gpCambiumLife, 0x5d, 0x7d, 0x3a)}
              fillRule="evenodd"
              stroke="none"
              opacity={gpCambiumLife * 0.7}
            />
            {/* CERNES concentriques (se-dessinent) */}
            {GP_RINGS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={ENCRE}
                strokeWidth={2.5}
                strokeDasharray={DASH}
                strokeDashoffset={clampI(frame, [340 + i * 8, 388 + i * 8], [DASH, 0])}
                opacity={0.85}
              />
            ))}
            <path
              d={GP_RAYS}
              fill="none"
              stroke={ENCRE}
              strokeWidth={1.8}
              strokeLinecap="round"
              opacity={clampI(frame, [360, 400], [0, 0.6])}
            />
            {/* petite legende "vivante" : une pulsation verte sur le bord (le cambium respire) */}
            <path
              d={GP_CAMBIUM}
              fill="none"
              stroke={VERT_TERRE}
              strokeWidth={3}
              opacity={gpCambiumLife * 0.5 * (0.6 + 0.4 * Math.sin(frame / 9))}
            />
          </g>
        )}

        {/* =========================================================================================
            PLAN 2 — LE CHAMP DE SOUCHES (f412->750, scene FIXE frontale)
            "Des millions de souches encore vivantes" -> coeur vivant en cascade -> CLIMAX foret.
            ========================================================================================= */}
        {plan2In > 0.001 && (
          <g id="plan2_champ" opacity={plan2In}>
            {/* sol du champ (lignes d'horizon par rang, se-tracent au cross-fade) */}
            <path
              d="M70,1000 C 360,994 720,1004 1010,998 M70,1162 C 360,1156 720,1166 1010,1160 M70,1352 C 360,1346 720,1356 1010,1350"
              fill="none"
              stroke={ENCRE}
              strokeWidth={3}
              strokeDasharray={DASH}
              strokeDashoffset={clampI(frame, [418, 470], [DASH, 0])}
              opacity={0.5}
            />
            {/* hachures seches du sol (ocre discret) */}
            <g opacity={clampI(frame, [430, 480], [0, 0.32])}>
              {[300, 560, 800, 200, 700, 460].map((cx, i) => (
                <path
                  key={i}
                  d={`M${cx},${1090 + (i % 3) * 110} l14,-22`}
                  stroke={OCRE_TERRE}
                  strokeWidth={5}
                  strokeLinecap="round"
                />
              ))}
            </g>

            {/* RESEAU RACINAIRE vivant sous le champ — au CLIMAX il S'ILLUMINE EN VERT VIF (l'accent
                couleur, valide Aziz : "les racines des souches prennent vie de maniere vivide"). Halo
                vert dessous + trait plus epais quand la vie circule (rootWebGreen monte). */}
            <g id="reseau_racinaire" opacity={rootWebIn}>
              {/* halo vert (la vie qui pulse dans le reseau) */}
              <path
                d="M250,1380 C 380,1480 480,1440 540,1500 C 640,1580 760,1520 820,1560 M540,1500 C 440,1600 320,1640 250,1560 M540,1500 C 700,1660 760,1620 910,1600 M160,1420 C 300,1520 420,1500 540,1500"
                fill="none"
                stroke={VERT}
                strokeWidth={9}
                strokeLinecap="round"
                strokeDasharray={DASH}
                strokeDashoffset={rootWebDraw}
                opacity={rootWebGreen * (0.25 + 0.15 * Math.sin(frame / 9))}
              />
              {/* trait principal (encre -> vert vif) */}
              <path
                d="M250,1380 C 380,1480 480,1440 540,1500 C 640,1580 760,1520 820,1560 M540,1500 C 440,1600 320,1640 250,1560 M540,1500 C 700,1660 760,1620 910,1600 M160,1420 C 300,1520 420,1500 540,1500"
                fill="none"
                stroke={inkToColor(rootWebGreen, 0x3e, 0x8f, 0x34)}
                strokeWidth={3 + 2.5 * rootWebGreen}
                strokeLinecap="round"
                strokeDasharray={DASH}
                strokeDashoffset={rootWebDraw}
                opacity={0.6 + 0.3 * rootWebGreen}
              />
            </g>

            {/* LES SOUCHES DU CHAMP */}
            {FIELD.map((s, i) => {
              const isHero = s.order === heroOrder && s.x === 540;
              // apparition : pop a l'arrivee du champ (cascade legere)
              const pop = spring({
                frame: frame - (420 + s.order * 4),
                fps,
                config: { mass: 1, damping: 15, stiffness: 85 },
                durationInFrames: 30,
              });
              if (pop < 0.01) return null;
              const reveal = coreReveal(s.order); // coeur vivant vert
              const gold = goldWave(s.order); // touche OR "souches vivantes"
              const green = greenWave(s.order); // climax -> arbre vert plein
              const woodColor = green < 0.4 ? ENCRE : VERT_D;
              const coreColor =
                green > 0.01
                  ? inkToColor(green, 0x3e, 0x8f, 0x34)
                  : inkToColor(reveal, 0x3e, 0x8f, 0x34);

              return (
                <g
                  key={i}
                  transform={`translate(${s.x},${s.y}) scale(${s.scale * pop})`}
                >
                  {/* tronc scie — la souche RESTE visible au climax (c'est ELLE qui repart, pas un arbre
                      plaque). Le bois vire legerement vers le vivant (encre->vert fonce) mais reste plein. */}
                  <path
                    d={FS_TRUNK}
                    fill={CREME}
                    stroke={woodColor}
                    strokeWidth={5}
                    strokeLinejoin="round"
                    opacity={1}
                  />
                  <path
                    d={FS_RINGS}
                    fill="none"
                    stroke={woodColor}
                    strokeWidth={2}
                    strokeLinecap="round"
                    opacity={0.75}
                  />
                  {/* COEUR vivant (cambium) qui s'illumine vert = "c'etait vivant" */}
                  {reveal > 0.01 && (
                    <path
                      d={FS_CORE}
                      fill={coreColor}
                      stroke="none"
                      opacity={Math.max(reveal, green) * 0.9}
                    />
                  )}
                  {/* touche OR sur le coeur (la vie endormie qui se reveille) */}
                  {gold > 0.01 && (
                    <path
                      d={FS_CORE}
                      fill="none"
                      stroke={OR}
                      strokeWidth={3}
                      opacity={gold * 0.6}
                    />
                  )}

                  {/* GESTE FMNR sur la souche HEROS : halo protection + rejet du BORD + taille */}
                  {isHero && (
                    <>
                      {/* HALO de protection (on protege) */}
                      {protectIn > 0.01 && (
                        <circle
                          cx={0}
                          cy={-120}
                          r={150}
                          fill="none"
                          stroke={VERT}
                          strokeWidth={3}
                          strokeDasharray="14 12"
                          opacity={
                            protectIn *
                            0.5 *
                            (0.7 + 0.3 * Math.sin(frame / 9)) *
                            (1 - green * 0.6)
                          }
                        />
                      )}
                      {/* REJET qui perce du BORD du sommet scie (x=28, bois vivant) — PAS du centre.
                          Au CLIMAX le rejet s'efface (la couronne pleine prend le relais => pas de tige
                          maigre a cote du feuillage). */}
                      {shootGrow > 0.01 && green < 0.85 && (
                        <g
                          opacity={1 - green}
                          transform={`translate(0,-80) scale(1,${shootGrow}) translate(0,80) rotate(${aliveFinal * 1.5 * Math.sin(frame / 15)},28,-80)`}
                        >
                          <path
                            d={FS_SHOOT}
                            fill="none"
                            stroke={inkToColor(
                              clampI(frame, [524, 580], [0, 1]),
                              0x3e,
                              0x8f,
                              0x34
                            )}
                            strokeWidth={5}
                            strokeLinecap="round"
                          />
                          <path
                            d={FS_LEAF}
                            fill={
                              clampI(frame, [528, 580], [0, 1]) > 0.5
                                ? VERT
                                : CREME
                            }
                            stroke={VERT_D}
                            strokeWidth={2.5}
                            strokeLinejoin="round"
                          />
                        </g>
                      )}
                    </>
                  )}

                  {/* CLIMAX (valide Aziz) : la souche "morte" REPART en JEUNE POUSSE (courte tige + 3-4
                      petites feuilles), PAS un arbre geant. La souche HEROS (centre) pousse un peu plus
                      haut (big) = point focal, l'avenir suggere. Ancree au sommet du tronc scie (y=-78). */}
                  {green > 0.001 && (
                    <g transform="translate(0,-78)">
                      <SproutLeaves
                        g={green}
                        big={isHero}
                        sway={aliveFinal * 2 * Math.sin(frame / 16 + i * 0.7)}
                      />
                    </g>
                  )}
                </g>
              );
            })}

            {/* TRAIT DE TAILLE net sur la souche heros (f537 "tailler") — un rejet superflu coupe */}
            {tailleFlash > 0.01 && (
              <g opacity={tailleFlash} transform="translate(540,1336)">
                <path
                  d="M-38,-66 C-62,-84 -78,-104 -74,-122"
                  fill="none"
                  stroke={ENCRE}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <path
                  d="M-72,-120 L-90,-132 M-76,-112 L-94,-116"
                  stroke={ENCRE}
                  strokeWidth={2}
                  strokeLinecap="round"
                  opacity={0.8}
                />
              </g>
            )}

            {/* "PAS BESOIN DE PLANTER" : ANCIEN graphique graine-barree RETIRE (Aziz : "ne donne rien").
                Le message passe par l'image elle-meme — la pousse sort de la SOUCHE (du vieux bois), pas
                d'une graine plantee. Aucune icone necessaire. */}
          </g>
        )}
      </svg>

      {/* ============ PORTRAIT INCARNE (Tony Rinaudo) ============ */}
      {portraitOpacity > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: `${(pCX / 1080) * 100}%`,
            top: `${(pCY / 1920) * 100}%`,
            width: `${(pW / 1080) * 100}%`,
            transform: `translate(-50%, -50%) scale(${portraitBreath})`,
            opacity: portraitOpacity * endFade,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "relative",
              border: `3px solid ${ENCRE}`,
              boxShadow: `0 0 0 1px ${CREME}, 0 0 0 4px rgba(43,33,23,0.25)`,
              background: CREME,
              lineHeight: 0,
            }}
          >
            <Img
              src={staticFile("assets/ggw-muraille-verte/rinaudo-portrait-encre.png")}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      )}

      {/* ============ CARTOUCHE (sous le portrait) ============ */}
      {cartoucheIn * cartoucheOut > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1040,
            display: "flex",
            justifyContent: "center",
            opacity: cartoucheIn * cartoucheOut * endFade,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              maxWidth: 780,
              margin: "0 80px",
              padding: "20px 34px",
              background: "rgba(232,220,192,0.92)",
              border: `2px solid ${ENCRE}`,
              borderRadius: 8,
              boxShadow: `0 0 0 1px ${CREME}, 0 0 0 4px rgba(43,33,23,0.18)`,
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: ENCRE,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: 1 }}>
              TONY RINAUDO
            </div>
            <div
              style={{
                fontSize: 25,
                fontWeight: 600,
                opacity: 0.8,
                margin: "5px 0 9px",
                letterSpacing: 0.5,
                fontStyle: "italic",
              }}
            >
              « The Forest Maker »
            </div>
            <div style={{ fontSize: 27, lineHeight: 1.3 }}>
              il a relancé la régénération naturelle au Niger
            </div>
          </div>
        </div>
      )}

      {/* ============ SOUS-TITRES KARAOKE (acquis #7) ============ */}
      <KaraokeSubtitles narrationSec={narrationSec} endFade={endFade} />

      {/* ============ MICRO-SOURCES (acquis #8) ============ */}
      <MicroSources frame={frame} endFade={endFade} />
    </AbsoluteFill>
  );
};

/* ============================================================================================
   SOUS-TITRES KARAOKE mot-a-mot (acquis #7) — pattern B3/B5/B6, identite encre.
   start/end = SECONDES (beat-relatif), issus de beat4.alignment.json. Chiffres en LETTRES.
   ============================================================================================ */
type Word = { word: string; start: number; end: number };
const B4_WORDS: Word[] = [
  { word: "Mais", start: 0.099, end: 0.199 },
  { word: "la", start: 0.219, end: 0.299 },
  { word: "vraie", start: 0.359, end: 0.539 },
  { word: "réponse", start: 0.599, end: 0.959 },
  { word: "existait", start: 0.979, end: 1.459 },
  { word: "déjà.", start: 1.519, end: 1.819 },
  { word: "Dès", start: 2.679, end: 2.779 },
  { word: "les", start: 2.819, end: 2.959 },
  { word: "années", start: 3.019, end: 3.22 },
  { word: "quatre-vingt,", start: 3.299, end: 3.719 },
  { word: "bien", start: 4.039, end: 4.219 },
  { word: "avant", start: 4.259, end: 4.48 },
  { word: "ce", start: 4.519, end: 4.639 },
  { word: "grand", start: 4.699, end: 4.859 },
  { word: "projet,", start: 4.94, end: 5.319 },
  { word: "un", start: 5.659, end: 5.759 },
  { word: "agronome,", start: 5.859, end: 6.399 },
  { word: "Tony", start: 6.659, end: 6.899 },
  { word: "Rinaudo,", start: 6.96, end: 7.419 },
  { word: "avait", start: 7.759, end: 7.939 },
  { word: "remarqué", start: 7.98, end: 8.359 },
  { word: "une", start: 8.399, end: 8.5 },
  { word: "chose", start: 8.539, end: 8.739 },
  { word: "que", start: 8.8, end: 8.88 },
  { word: "personne", start: 8.939, end: 9.22 },
  { word: "ne", start: 9.279, end: 9.359 },
  { word: "voyait.", start: 9.42, end: 9.759 },
  { word: "Sous", start: 10.979, end: 11.119 },
  { word: "ce", start: 11.179, end: 11.319 },
  { word: "sol", start: 11.359, end: 11.599 },
  { word: "mort", start: 11.659, end: 11.92 },
  { word: "dormait", start: 11.979, end: 12.279 },
  { word: "une", start: 12.3, end: 12.399 },
  { word: "forêt", start: 12.479, end: 12.699 },
  { word: "entière.", start: 12.739, end: 13.339 },
  { word: "Des", start: 14.019, end: 14.179 },
  { word: "millions", start: 14.219, end: 14.579 },
  { word: "de", start: 14.619, end: 14.759 },
  { word: "souches", start: 14.819, end: 15.019 },
  { word: "encore", start: 15.059, end: 15.319 },
  { word: "vivantes,", start: 15.38, end: 15.88 },
  { word: "qu'il", start: 16.1, end: 16.239 },
  { word: "suffisait", start: 16.279, end: 16.739 },
  { word: "de", start: 16.739, end: 16.859 },
  { word: "protéger", start: 16.899, end: 17.599 },
  { word: "et", start: 17.639, end: 17.699 },
  { word: "de", start: 17.739, end: 17.799 },
  { word: "tailler", start: 17.899, end: 18.219 },
  { word: "pour", start: 18.26, end: 18.34 },
  { word: "les", start: 18.399, end: 18.52 },
  { word: "faire", start: 18.559, end: 18.68 },
  { word: "repousser.", start: 18.699, end: 19.239 },
  { word: "Pas", start: 20.879, end: 21.0 },
  { word: "besoin", start: 21.039, end: 21.319 },
  { word: "de", start: 21.359, end: 21.399 },
  { word: "planter.", start: 21.5, end: 21.919 },
  { word: "La", start: 22.68, end: 22.739 },
  { word: "forêt", start: 22.859, end: 23.12 },
  { word: "était", start: 23.12, end: 23.34 },
  { word: "déjà", start: 23.379, end: 23.619 },
  { word: "là,", start: 23.699, end: 23.84 },
  { word: "sous", start: 24.319, end: 24.42 },
  { word: "leurs", start: 24.459, end: 24.6 },
  { word: "pieds.", start: 24.68, end: 24.899 },
];

/* ⛔ KARAOKE : frontieres FORCEES par INDEX de mots (1er mot de chaque segment). 9 segments :
   (1) Mais la vraie reponse existait deja. [0]
   (2) Des les annees quatre-vingt, bien avant ce grand projet, [6]
   (3) un agronome, Tony Rinaudo, [15]
   (4) avait remarque une chose que personne ne voyait. [19]
   (5) Sous ce sol mort dormait une foret entiere. [27]
   (6) Des millions de souches encore vivantes, [35]
   (7) qu'il suffisait de proteger et de tailler pour les faire repousser. [41]  (scinde sur "pour" idx 48)
   (8) Pas besoin de planter. [52]
   (9) La foret etait deja la, sous leurs pieds. [56] */
type Phrase = { words: Word[]; start: number; end: number };
const PHRASE_BREAKS = [6, 15, 19, 27, 35, 41, 48, 52, 56];
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
const B4_PHRASES: Phrase[] = buildPhrases(B4_WORDS);

const KaraokeSubtitles: React.FC<{ narrationSec: number; endFade: number }> = ({
  narrationSec,
  endFade,
}) => {
  const activePhraseIdx = (() => {
    for (let i = 0; i < B4_PHRASES.length; i++) {
      const p = B4_PHRASES[i];
      const nextStart = B4_PHRASES[i + 1]?.start ?? p.end + 0.8;
      if (narrationSec >= p.start - 0.18 && narrationSec < nextStart) return i;
    }
    return -1;
  })();
  if (activePhraseIdx < 0) return null;
  const activePhrase = B4_PHRASES[activePhraseIdx];
  const nextStart = B4_PHRASES[activePhraseIdx + 1]?.start ?? activePhrase.end + 0.8;
  const appearAt = activePhrase.start - 0.18;
  const fadeOutStart = nextStart - 0.3;
  const subOpacity = interpolate(
    narrationSec,
    [appearAt, appearAt + 0.25, fadeOutStart, nextStart],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (subOpacity < 0.001) return null;

  return (
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
  );
};

/* ============================================================================================
   MICRO-SOURCES (acquis #8) — discrete, centree, JAMAIS de carton. frames @30.
   ============================================================================================ */
type Cue = { start: number; end: number; text: string };
const SOURCES: Cue[] = [
  { start: 188, end: 300, text: "T. Rinaudo — FMNR, Niger · prix Right Livelihood 2018" },
  { start: 440, end: 510, text: "régénération naturelle assistée (FMNR), Sahel" },
];

const MicroSources: React.FC<{ frame: number; endFade: number }> = ({
  frame,
  endFade,
}) => {
  const activeSrc = SOURCES.find((c) => frame >= c.start && frame <= c.end);
  if (!activeSrc) return null;
  const srcOpacity = interpolate(
    frame,
    [activeSrc.start, activeSrc.start + 10, activeSrc.end - 10, activeSrc.end],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
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
          fontSize: 24,
          fontStyle: "italic",
          letterSpacing: 0.3,
          lineHeight: 1.2,
          textAlign: "center",
        }}
      >
        src : {activeSrc.text}
      </div>
    </div>
  );
};

export default B4Demilune;
