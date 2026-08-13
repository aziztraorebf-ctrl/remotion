// R&D VAGUE D — INTERACTIONS / LOT "LE GROUPE" (2026-07-26).
//
// POURQUOI : nos sujets parlent de populations, de pays, de collectifs. Un groupe de stick
// figures permet de montrer "beaucoup de gens" sans quitter le registre. Le piege principal :
// un groupe mal anime lit comme un copier-colle mecanique (tous synchrones = un seul objet
// duplique). Cette planche teste 3 scenes contre le critere eliminatoire du registre :
//
//   CRITERE : "si tu ne peux pas l'animer aussi bien qu'on l'a anime sur le CFA, ce n'est pas
//   la bonne voie" -> on juge le MOUVEMENT, jamais le dessin fige.
//
// BRIQUES REUTILISEES DE L'INDEX (STICK-FIGURE-INDEX.md) :
//   1. LE VERROU PAS/DISTANCE (GestesLocomotion16x9) : x = x0 + (pas ecoules) * stepLength.
//      Repris tel quel pour "le groupe qui marche" et "un qui se detache".
//   5. BRUIT DETERMINISTE (couches de sinus a rapports irrationnels + phases par index) :
//      repris et ETENDU au niveau du GROUPE — c'est la vraie question de ce lot : comment
//      desynchroniser N personnages sans Math.random.
//   Convention d'angle : IDENTIQUE a GestesLocomotion (0 = bras/jambe pendant, cos(angle) pour Y).
//   Membre en UN SEUL <line>/<path> (ici les segments sont simples, pas de genou necessaire :
//   aucune pose assise dans ce lot).
//
// ⭐ LA DECOUVERTE DE CE LOT : LA DESYNCHRONISATION PAR INDEX, PAS PAR PARAMETRE UNIQUE.
//   Un decalage de PHASE seul (offset temporel) ne suffit pas a lire comme "des individus" des
//   qu'on regarde une frame figee : a un instant t, plusieurs personnages a la meme cadence sur
//   une sinusoide simple retombent parfois dans des postures proches par hasard (aliasing visuel).
//   La solution qui tient : chaque personnage recoit un jeu de CONSTANTES DERIVEES DE SON INDEX
//   (pas juste sa phase) -- cadence de respiration, cadence de balancement du poids, ET decalage
//   de marche -- via des rapports irrationnels distincts (1.618, 2.718, 1.414...) multiplies par
//   l'index. Deux personnages voisins n'ont alors JAMAIS le meme rythme, meme approximativement.
//
// DETERMINISME : aucun Math.random. Toute variation vient de `i` (index du personnage) combine
// a des rapports irrationnels fixes, exactement comme la brique n°5 de l'index.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const rad = (d: number) => (d * Math.PI) / 180;

const NUIT = "#22345c";
const NUIT2 = "#182746";
const ENCRE = "#f0e8d2";
const OR_CLAIR = "#d9a93a";

export const GROUPE_FOULE_FRAMES = S(31); // 31s

// ============================================================================
// LE MOTEUR DE MARCHE — repris de GestesLocomotion16x9 (brique n°1, verrou pas/distance)
// ============================================================================
const L = 34;
const stepLength = (swingDeg: number) => 2 * L * Math.sin(rad(swingDeg));

type Pose = {
  hipY?: number;
  torsoDeg?: number;
  leg1Deg?: number;
  leg2Deg?: number;
  arm1Deg?: number;
  arm2Deg?: number;
  arm1Len?: number;
  arm2Len?: number;
  headTuck?: number;
};

type WalkParams = {
  swingMax: number;
  bobAmp: number;
  lean: number;
  hipDrop: number;
  armSwing: number;
};

const WALK_DEFAULT: WalkParams = { swingMax: 17, bobAmp: 2.5, lean: 0, hipDrop: 0, armSwing: 22 };

// La Figure — identique en geometrie a GestesLocomotion16x9 (meme convention d'angle : 0 = pend,
// cos(angle) pour Y). Simplifiee : pas de genou (aucune pose assise dans ce lot).
const Figure: React.FC<{
  x: number;
  y: number;
  phase: number;
  p?: Partial<WalkParams>;
  pose?: Pose;
  color?: string;
  opacity?: number;
  scale?: number;
  faceAvant?: boolean; // true = tourne vers la droite (defaut), false = vers la gauche (miroir)
}> = ({ x, y, phase, p, pose = {}, color = ENCRE, opacity = 1, scale = 1, faceAvant = true }) => {
  const P = { ...WALK_DEFAULT, ...p };
  const dir = faceAvant ? 1 : -1;
  const a = phase * Math.PI * 2;
  // ⚠️ DEFAUT CORRIGE 2x (vu au render, scene "exode") :
  //
  // 1re cause (reelle, gardee en memoire) : sin(a) et le contre-balancement des bras passaient
  // TOUS LES DEUX par 0 aux memes instants (2x par cycle, mi-foulee). Sur UN marcheur isole en
  // mouvement continu ca ne se voit jamais (transitoire, jamais fige). Mais avec PLUSIEURS
  // marcheurs a des phases independantes dans la MEME frame, une fraction d'entre eux tombe pres
  // de cette fenetre et le corps entier se lit comme un trait vertical -- pose degeneree.
  //
  // 1re "correction" (RETIREE, elle EST le bug rapporte par Aziz) : un plancher dur a 16deg sur
  // le swing lui-meme. Un plancher dur n'empeche pas seulement le passage par zero : il ECRASE
  // TOUTE L'OSCILLATION dans la zone basse (l'angle ne redescend jamais sous 16deg, sur peut-etre
  // 40% du cycle). Les jambes restent coincees pres de leur ecartement minimal au lieu de
  // balancer -> un perso qui translate avec des jambes figees = un glissement. Verifie par Aziz
  // au visionnage (frames a t=26.0/26.133/26.266s : le perso avance de plusieurs px, ecartement
  // des jambes quasi identique).
  //
  // VRAIE CORRECTION : swing redevient une oscillation PLEINE AMPLITUDE (sin(a) * swingMax, comme
  // GestesLocomotion16x9, la marche validee par Aziz). La pose degeneree est traitee en
  // DECORRELANT jambes et bras par un LEGER DEPHASAGE (les bras suivent les jambes avec un
  // retard, comme dans une vraie marche) au lieu de brider l'amplitude. Avec un dephasage BRAS_LAG
  // (0.35 rad = 20deg), sin(a) et sin(a - BRAS_LAG) ne s'annulent plus jamais simultanement : au
  // point milieu entre leurs 2 zeros (a = BRAS_LAG/2), les deux valent |sin(BRAS_LAG/2)| ~= 0.174
  // (17.4% de l'amplitude max chacun, DE SIGNE OPPOSE) -- c'est le minimum garanti d'ecart
  // simultane sur tout le cycle, verifie par calcul (script Python, valeurs exactes : a=0 ->
  // jambe=0/bras=-0.343 ; a=lag -> jambe=0.343/bras=0). Aucune fenetre du cycle ne voit plus les
  // 2 paires de membres au meme angle -- tout en preservant 100% du debattement des jambes.
  const swing = Math.sin(a) * P.swingMax;
  const BRAS_LAG = 0.35; // rad (~20deg) — retard des bras sur les jambes, evite l'annulation simultanee
  const sinASafe = Math.sin(a - BRAS_LAG);
  const bob = Math.abs(Math.cos(a)) * P.bobAmp;

  const hx = 0;
  const hy = pose.hipY !== undefined ? pose.hipY : -26 - bob + P.hipDrop;

  const l1 = pose.leg1Deg !== undefined ? pose.leg1Deg : swing;
  const l2 = pose.leg2Deg !== undefined ? pose.leg2Deg : -swing;
  const legLen = (deg: number) => {
    if (pose.leg1Deg !== undefined || pose.leg2Deg !== undefined) return L;
    const c = Math.cos(rad(deg));
    if (c < 0.2) return L;
    return Math.max(L * 0.72, Math.min(L * 1.06, -hy / c));
  };
  const L1 = legLen(l1);
  const L2 = legLen(l2);
  const j1x = hx + Math.sin(rad(l1)) * L1 * dir;
  const j1y = hy + Math.cos(rad(l1)) * L1;
  const j2x = hx + Math.sin(rad(l2)) * L2 * dir;
  const j2y = hy + Math.cos(rad(l2)) * L2;

  const torso = pose.torsoDeg !== undefined ? pose.torsoDeg : P.lean;
  const torsoLen = 32;
  const sx = hx + Math.sin(rad(torso)) * torsoLen * dir;
  const sy = hy - Math.cos(rad(torso)) * torsoLen;

  const tuck = pose.headTuck ?? 0;
  const headLen = 12 - tuck * 7;
  const headCx = sx + Math.sin(rad(torso)) * headLen * dir + 3 * Math.cos(rad(torso)) * dir;
  const headCy = sy - Math.cos(rad(torso)) * headLen + 3 * Math.sin(rad(torso));

  const armLen1 = pose.arm1Len ?? 28;
  const armLen2 = pose.arm2Len ?? 28;
  const manuel1 = pose.arm1Deg !== undefined;
  const manuel2 = pose.arm2Deg !== undefined;
  const a1 = manuel1 ? (pose.arm1Deg as number) + torso : -sinASafe * P.armSwing;
  const a2 = manuel2 ? (pose.arm2Deg as number) + torso : sinASafe * P.armSwing;
  const b1x = sx + Math.sin(rad(a1)) * armLen1 * dir;
  const b1y = sy + Math.cos(rad(a1)) * armLen1;
  const b2x = sx + Math.sin(rad(a2)) * armLen2 * dir;
  const b2y = sy + Math.cos(rad(a2)) * armLen2;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <line x1={hx} y1={hy} x2={j2x} y2={j2y} stroke={color} strokeWidth={4.5} strokeLinecap="round" opacity={0.75} />
      <line x1={sx} y1={sy} x2={b2x} y2={b2y} stroke={color} strokeWidth={4} strokeLinecap="round" opacity={0.75} />
      <line x1={hx} y1={hy} x2={sx} y2={sy} stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      <line x1={hx} y1={hy} x2={j1x} y2={j1y} stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      <line x1={sx} y1={sy} x2={b1x} y2={b1y} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <circle cx={headCx} cy={headCy} r={9} fill={color} />
    </g>
  );
};

// Version DE FACE (immobile / attente) — bras/jambes symetriques autour de l'axe vertical,
// pas de "sens de marche". Reprend la regle du registre : de face on ne peut QUE etre immobile.
const FigureFace: React.FC<{
  x: number;
  y: number;
  pose: {
    hipY: number;
    torsoLean: number;   // inclinaison laterale du buste (deg, + = vers la droite)
    headLean: number;
    arm1Deg: number;     // bras GAUCHE (a l'ecran), 0 = pend, + = s'ecarte vers la gauche
    arm2Deg: number;     // bras DROIT, 0 = pend, + = s'ecarte vers la droite
    legSpread: number;   // ecart des pieds (px), poids reparti
    weightShift: number; // -1..1 : bassin decale sur une jambe (contrapposto)
  };
  color?: string;
  opacity?: number;
  scale?: number;
}> = ({ x, y, pose, color = ENCRE, opacity = 1, scale = 1 }) => {
  const hx = pose.weightShift * 3;
  const hy = pose.hipY;
  const torsoLen = 32;
  const sx = hx + Math.sin(rad(pose.torsoLean)) * torsoLen;
  const sy = hy - Math.cos(rad(pose.torsoLean)) * torsoLen;
  const headCx = sx + Math.sin(rad(pose.torsoLean + pose.headLean)) * 12;
  const headCy = sy - Math.cos(rad(pose.torsoLean + pose.headLean)) * 12;

  // jambes : ecartees symetriquement, la hanche s'appuie plus sur celle en compression
  const footL = -pose.legSpread - pose.weightShift * 2;
  const footR = pose.legSpread - pose.weightShift * 2;
  const legLenFor = (footX: number) => {
    const dx = footX - hx;
    const raw = Math.sqrt(dx * dx + (-hy) * (-hy));
    return raw;
  };
  const l1x = hx + footL, l1y = 0;
  const l2x = hx + footR, l2y = 0;

  // bras : angle depuis l'epaule, ecartement lateral pur (pas de sens de marche)
  const armLen = 27;
  const b1x = sx - Math.sin(rad(pose.arm1Deg)) * armLen;
  const b1y = sy + Math.cos(rad(pose.arm1Deg)) * armLen;
  const b2x = sx + Math.sin(rad(pose.arm2Deg)) * armLen;
  const b2y = sy + Math.cos(rad(pose.arm2Deg)) * armLen;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <line x1={hx} y1={hy} x2={l1x} y2={l1y} stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      <line x1={hx} y1={hy} x2={l2x} y2={l2y} stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      <line x1={hx} y1={hy} x2={sx} y2={sy} stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      <line x1={sx} y1={sy} x2={b1x} y2={b1y} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <line x1={sx} y1={sy} x2={b2x} y2={b2y} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <circle cx={headCx} cy={headCy} r={9} fill={color} />
    </g>
  );
};

const Etiquette: React.FC<{ x: number; y: number; label: string; sub?: string; op?: number }> = ({
  x, y, label, sub, op = 1,
}) => (
  <g opacity={op}>
    <text x={x} y={y} textAnchor="middle" fontFamily="Georgia, serif" fontSize={21} fill={ENCRE}
      letterSpacing={2.2} opacity={0.85}>{label}</text>
    {sub && (
      <text x={x} y={y + 23} textAnchor="middle" fontFamily="Georgia, serif" fontSize={14} fill={ENCRE}
        letterSpacing={1.2} opacity={0.42} fontStyle="italic">{sub}</text>
    )}
  </g>
);

const Sol: React.FC<{ y: number; x0: number; x1: number; op?: number }> = ({ y, x0, x1, op = 0.28 }) => (
  <line x1={x0} y1={y} x2={x1} y2={y} stroke={ENCRE} strokeWidth={1.6} opacity={op} />
);

// ============================================================================
// DESYNCHRONISATION PAR INDEX — la brique centrale de ce lot.
// ============================================================================
// 3 rapports irrationnels distincts, chacun assigne a UNE couche de mouvement. Multiplies par
// l'index du personnage, ils garantissent qu'aucun couple de personnages ne partage un rythme,
// meme approximativement, meme sur un groupe de 12.
const PHI = 1.618;   // nombre d'or — couche respiration
const E = 2.718;     // e — couche balancement du poids
const RAC2 = 1.4142; // racine de 2 — couche micro-ajustement / decalage de marche

// phase de respiration propre au personnage i : periode ET offset different de l'index.
const respPhaseFor = (i: number, ta: number) => {
  const periodeS = 3.6 + ((i * PHI) % 1) * 1.8; // 3.6s a 5.4s selon l'individu
  const offset = (i * PHI) % 1; // decalage de depart (0..1 de periode)
  return Math.sin((ta / S(periodeS) + offset) * Math.PI * 2);
};
// couche "balancement du poids", plus lente
const poidsPhaseFor = (i: number, ta: number) => {
  const periodeS = 7.5 + ((i * E) % 1) * 5.0; // 7.5s a 12.5s
  const offset = (i * E) % 1;
  return Math.sin((ta / S(periodeS) + offset) * Math.PI * 2) * 0.7
    + Math.sin((ta / S(periodeS * 1.7) + offset * 0.6) * Math.PI * 2) * 0.3;
};
// micro-ajustement bref et espace (tete qui tourne, poids qui change de jambe) — produit de 2
// sinus lents ecrete, comme la brique n°5 de l'index, mais avec des frequences DERIVEES DE i.
const microFor = (i: number, ta: number) => {
  const f1 = 0.021 + ((i * RAC2) % 1) * 0.011;
  const f2 = 0.0083 + ((i * PHI * RAC2) % 1) * 0.006;
  const seuil = 0.58 + ((i * E) % 1) * 0.12;
  return Math.max(0, Math.sin(ta * f1 + i) * Math.sin(ta * f2 + i * 0.5) - seuil) / (1 - seuil);
};

// ============================================================================
// SCENE 1 — LE GROUPE QUI ATTEND (debout, FIGE, postures diversifiees par index)
// ============================================================================
type Personnage = { xOff: number; scale: number; depth: number }; // depth 0 = premier plan

const GROUPE_ATTEND: Personnage[] = [
  { xOff: -280, scale: 1.0, depth: 0 },
  { xOff: -120, scale: 0.92, depth: 0.3 },
  { xOff: 40, scale: 1.05, depth: 0 },
  { xOff: 190, scale: 0.88, depth: 0.4 },
  { xOff: 330, scale: 0.97, depth: 0.15 },
];

// `frame` garde pour compatibilite d'appel (meme signature que les autres scenes) mais N'EST PLUS
// UTILISE : la scene est FIGEE (verdict Aziz), aucune pose ne depend plus du temps ecoule.
const SceneAttend: React.FC<{ frame: number; solY: number; cx: number }> = ({ solY, cx }) => {
  return (
    <g>
      <Sol y={solY} x0={cx - 420} x1={cx + 420} />
      {GROUPE_ATTEND.map((perso, i) => {
        // ⚠️ REVERT (verdict Aziz au 2e visionnage) : "quand un groupe est immobile, il est mieux
        // de le garder FIGE SANS MOUVEMENT, car rajouter du mouvement est bizarre. C'est un
        // mouvement de bobbing/oscillation qui marche un peu mal." Consigne precedente (amplifier
        // x4-5 la respiration/poids) etait mauvaise sur un GROUPE -- l'oscillation multiple se lit
        // comme un defaut technique, pas comme "vivant". Corrige : POSTURE STATIQUE (aucune
        // dependance a `frame`), mais DIFFERENTE par personnage -- la desync par index (phi/e/rac2)
        // est reutilisee ici non plus comme MOUVEMENT dans le temps, mais comme GENERATEUR DE POSE
        // FIGEE (chaque i tombe sur un jeu de constantes distinct). C'est la diversite des postures,
        // pas le mouvement, qui doit porter la vie du groupe (nuance Aziz : l'immobilite habitee
        // reste validee sur un perso SEUL -- gestes/GestesExpressifs -- mais pas sur N personnages
        // simultanes, ou les oscillations se lisent comme un bug d'affichage).
        //
        // Les memes rapports irrationnels (PHI/E/RAC2) generent une pose FIXE par index au lieu
        // d'une phase qui varie avec `ta` -- on echantillonne chaque fonction de phase a un temps
        // FICTIF derive de i (jamais de `frame`), ce qui donne un point fige different par
        // personnage tout en reutilisant exactement le meme calcul de mixage.
        const tFige = i * 733; // "instant" arbitraire deterministe, distinct par personnage
        const resp = respPhaseFor(i, tFige);
        const poids = poidsPhaseFor(i, tFige);
        const ajDos = microFor(i + 7, tFige * 1.13);
        const ajJambe = microFor(i + 13, tFige * 0.87);

        // orientation legerement differente par personnage (certains ne regardent pas pile
        // devant) : encore un decalage derive de i, jamais random.
        const orient = ((i * PHI) % 1 - 0.5) * 10; // -5..+5 deg

        // Coefficients de pose (grandeur d'une posture debout naturelle, PAS de mouvement dans le
        // temps -- retour aux ordres de grandeur d'avant l'amplification x4-5).
        const hipY = -26 + resp * 1.1 + poids * 0.9;
        const torsoLean = orient * 0.3 + resp * 0.7 + poids * 1.8 - ajDos * 2.8;
        const headLean = orient * 0.6 + resp * 0.9 - ajDos * 4.0;
        const arm1 = 6 + resp * 2.0 + poids * 1.4 + ajDos * 2.2;
        const arm2 = -6 - resp * 1.6 - poids * 1.1 - ajDos * 1.9;
        const legSpread = 9 + ajJambe * 3.5;
        const weightShift = Math.sign(poids) * Math.min(1, Math.abs(poids)) * 0.9 + ajJambe * 0.5;

        const depthFade = 1 - perso.depth * 0.35;
        const depthColor = perso.depth > 0.25 ? "#c9c0a6" : ENCRE; // plus pale = plus loin

        return (
          <FigureFace
            key={i}
            x={cx + perso.xOff}
            y={solY - perso.depth * 34}
            pose={{ hipY, torsoLean, headLean, arm1Deg: arm1, arm2Deg: arm2, legSpread, weightShift }}
            color={depthColor}
            opacity={depthFade}
            scale={perso.scale}
          />
        );
      })}
      <Etiquette x={cx} y={solY + 96} label="LE GROUPE QUI ATTEND" sub="postures figées, diversifiées par index (φ, e, √2)" />
    </g>
  );
};

// ============================================================================
// SCENE 2 — UN QUI SE DETACHE (le groupe reste, un seul s'avance)
// ============================================================================
const SceneDetache: React.FC<{ frame: number; solY: number; cx: number; fps: number }> = ({ frame, solY, cx }) => {
  const CYCLE = S(9.5);
  const f = frame % CYCLE;
  const T_DEPART = S(2.0);
  const T_ARRIVEE = S(7.2);

  // le groupe restant (4 personnages), immobile-habite, meme moteur que Scene 1 mais recale
  const RESTANTS: Personnage[] = [
    { xOff: -70, scale: 0.95, depth: 0.1 },
    { xOff: -160, scale: 0.9, depth: 0.25 },
    { xOff: -30, scale: 1.0, depth: 0 },
    { xOff: -220, scale: 0.85, depth: 0.4 },
  ];

  // le marcheur : phase 1 il est confondu dans le groupe (immobile, index 4 -> desync coherent
  // avec le reste), phase 2 il se met en marche et s'eloigne vers l'avant-scene (grossit = il
  // se rapproche, ou s'eloigne = il retrecit -- ici il AVANCE vers nous, donc grandit).
  const enMarche = f >= T_DEPART;
  const swingMax = 15;
  const cad = 0.62;
  const tMarche = enMarche ? (f - T_DEPART) / FPS : 0;
  const phase = (tMarche * cad) % 1;
  const dist = tMarche * cad * 2 * stepLength(swingMax);
  const distClamped = Math.min(dist, ((T_ARRIVEE - T_DEPART) / FPS) * cad * 2 * stepLength(swingMax));

  // avant de partir : position DANS le groupe, indistinct (meme echelle que les autres, x=0
  // relatif). Une fois parti : x et scale evoluent avec la progression du depart.
  const progression = interpolate(f, [T_DEPART, T_ARRIVEE], [0, 1], clamp);
  const xMarcheur = cx + 40 + distClamped * 3.1; // *3.1 = vitesse scenique (pas la vitesse des jambes)
  const scaleMarcheur = interpolate(progression, [0, 1], [0.95, 1.55], clamp);
  const yMarcheur = solY - progression * 26; // avance vers l'avant-scene = descend legerement (perspective simple)

  // idle du marcheur AVANT de partir (index 4, coherent avec la desync du groupe)
  const ta = frame;
  const respM = respPhaseFor(4, ta);
  const poidsM = poidsPhaseFor(4, ta);

  const fade = interpolate(f, [0, 10, CYCLE - 10, CYCLE - 1], [0, 1, 1, 0], clamp);

  return (
    <g opacity={fade}>
      <Sol y={solY} x0={cx - 380} x1={cx + 500} />
      {RESTANTS.map((perso, i) => {
        const resp = respPhaseFor(i, ta);
        const poids = poidsPhaseFor(i, ta);
        const ajTete = microFor(i + 20, ta);
        const hipY = -26 + resp * 1.1 + poids * 0.9;
        const torsoLean = resp * 0.6 + poids * 1.8;
        const headLean = resp * 0.9 - ajTete * 6
          // les restants tournent legerement la tete vers le marcheur qui part, une fois qu'il
          // est parti -- lisible narrativement (ils REGARDENT le detachement).
          + (enMarche ? interpolate(progression, [0, 0.3], [0, 5], clamp) : 0);
        const arm1 = 6 + resp * 2.0;
        const arm2 = -6 - resp * 1.6;
        const depthFade = 1 - perso.depth * 0.35;
        const depthColor = perso.depth > 0.25 ? "#c9c0a6" : ENCRE;
        return (
          <FigureFace
            key={i}
            x={cx + perso.xOff}
            y={solY - perso.depth * 34}
            pose={{ hipY, torsoLean, headLean, arm1Deg: arm1, arm2Deg: arm2, legSpread: 9, weightShift: poids * 0.4 }}
            color={depthColor}
            opacity={depthFade}
            scale={perso.scale}
          />
        );
      })}
      {/* le marcheur : FigureFace tant qu'il est dans le groupe (immobile), Figure de PROFIL des
          qu'il marche (regle du registre : de face on ne peut QUE etre immobile). */}
      {!enMarche ? (
        <FigureFace
          x={cx + 40}
          y={solY}
          pose={{
            hipY: -26 + respM * 1.1 + poidsM * 0.9,
            torsoLean: respM * 0.6 + poidsM * 1.8,
            headLean: respM * 0.9,
            arm1Deg: 6 + respM * 2.0,
            arm2Deg: -6 - respM * 1.6,
            legSpread: 9,
            weightShift: poidsM * 0.4,
          }}
          color={OR_CLAIR}
          scale={0.95}
        />
      ) : (
        <Figure x={xMarcheur} y={yMarcheur} phase={phase} p={{ swingMax, bobAmp: 2.2, armSwing: 20 }}
          color={OR_CLAIR} scale={scaleMarcheur} />
      )}
      <Etiquette x={cx + 80} y={solY + 96}
        label="UN QUI SE DÉTACHE"
        sub={enMarche ? "indistinct → seul et identifiable" : "encore confondu dans le groupe"} />
    </g>
  );
};

// ============================================================================
// SCENE 3 — LE GROUPE QUI MARCHE ENSEMBLE (exode) — cadences ET phases decalees + profondeur
// ============================================================================
type MarcheurExode = { rangee: number; ordre: number; depth: number };

// 3 rangees (premier plan / milieu / lointain), plusieurs marcheurs par rangee -> suggere le
// nombre sans surcharger le premier plan. Positions de depart etalees (pas alignees en grille).
const construireExode = (n: number): MarcheurExode[] => {
  const arr: MarcheurExode[] = [];
  for (let i = 0; i < n; i++) {
    const depth = (i * PHI) % 1; // 0..1, deterministe, bien reparti (suite dorée)
    const rangee = depth < 0.33 ? 0 : depth < 0.66 ? 1 : 2;
    arr.push({ rangee, ordre: i, depth });
  }
  return arr;
};

const SceneExode: React.FC<{ frame: number; solY: number; cx: number; n: number; label: string; sub: string }> = ({
  frame, solY, cx, n, label, sub,
}) => {
  const marcheurs = React.useMemo(() => construireExode(n), [n]);
  const t = frame / FPS;
  const couloirDemi = 480;

  return (
    <g>
      {/* 3 lignes de sol, une par rangee de profondeur (donne la perspective) */}
      <Sol y={solY - 40} x0={cx - couloirDemi} x1={cx + couloirDemi} op={0.14} />
      <Sol y={solY - 18} x0={cx - couloirDemi} x1={cx + couloirDemi} op={0.2} />
      <Sol y={solY} x0={cx - couloirDemi} x1={cx + couloirDemi} op={0.28} />

      {marcheurs.map((m) => {
        const i = m.ordre;
        // cadence ET amplitude legerement decalees par individu (RAC2-derive) : un groupe qui
        // marche "ensemble" n'a jamais une cadence identique au metronome pres dans la vraie vie.
        const cad = 0.68 + ((i * RAC2) % 1 - 0.5) * 0.12; // 0.62 .. 0.74 Hz
        const swingMax = 16.5 + ((i * PHI) % 1 - 0.5) * 3; // 15 .. 18 deg (jamais sous le plancher 16)
        const offsetPhase = (i * E) % 1; // decalage de DEPART du cycle (pas juste un lag de x)

        const phase = (t * cad + offsetPhase) % 1;
        const dist = (t * cad + offsetPhase) * 2 * stepLength(swingMax);

        // rangee -> echelle + palissade horizontale + y (plus loin = plus petit, plus haut, plus pale)
        const rangeeCfg = [
          { scale: 1.0, yOff: 0, colorFar: false, largeurCouloir: 900, vitesse: 1.0 },
          { scale: 0.68, yOff: -46, colorFar: true, largeurCouloir: 760, vitesse: 0.62 },
          { scale: 0.46, yOff: -82, colorFar: true, largeurCouloir: 640, vitesse: 0.4 },
        ][m.rangee];

        // x etale sur la largeur du couloir de la rangee, boucle en douceur (module sur la
        // distance, verrou pas/distance preserve : c'est toujours le pas qui produit l'avance).
        const xBase = ((i * 191) % rangeeCfg.largeurCouloir) - rangeeCfg.largeurCouloir / 2;
        const xLoop = ((dist * rangeeCfg.vitesse) % (rangeeCfg.largeurCouloir + 140));
        // reboucle proprement dans le couloir (modulo centre)
        const xWrapped = cx + (((xBase + xLoop + rangeeCfg.largeurCouloir / 2) % (rangeeCfg.largeurCouloir + 140)) - rangeeCfg.largeurCouloir / 2 - 70);

        const y = solY + rangeeCfg.yOff;
        const color = rangeeCfg.colorFar ? "#9aa4c4" : ENCRE;
        const opacity = rangeeCfg.colorFar ? 0.55 + rangeeCfg.scale * 0.3 : 1;

        return (
          <Figure
            key={i}
            x={xWrapped}
            y={y}
            phase={phase}
            p={{ swingMax, bobAmp: 2.2 + ((i * PHI) % 1) * 0.8, armSwing: 20 }}
            color={color}
            opacity={opacity}
            scale={rangeeCfg.scale}
          />
        );
      })}
      <Etiquette x={cx} y={solY + 60} label={label} sub={sub} />
    </g>
  );
};

// ============================================================================
// LA PLANCHE
// ============================================================================
export const GroupeFoule16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const op = interpolate(frame, [0, 12, GROUPE_FOULE_FRAMES - 14, GROUPE_FOULE_FRAMES],
    [0, 1, 1, 0], clamp);

  const stars = React.useMemo(() => {
    const a: { x: number; y: number; r: number; o: number }[] = [];
    let s = 17;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 55; i++) {
      a.push({ x: rnd() * W, y: rnd() * H, r: rnd() * 1.3 + 0.4, o: rnd() * 0.28 + 0.1 });
    }
    return a;
  }, []);

  const SOL_1 = 300;
  const SOL_2 = 620;
  const SOL_3 = 960;

  const b1 = interpolate(frame, [0, 20], [0, 1], clamp);
  const b2 = interpolate(frame, [S(0.5), S(1.2)], [0, 1], clamp);
  const b3 = interpolate(frame, [S(1.0), S(1.8)], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NUIT} 0%, ${NUIT2} 100%)`, opacity: op }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={ENCRE} opacity={s.o} />)}

        <text x={70} y={62} fontFamily="Georgia, serif" fontSize={26} fill={ENCRE} letterSpacing={4}
          opacity={0.7}>R&amp;D — INTERACTIONS : LE GROUPE</text>
        <text x={70} y={92} fontFamily="Georgia, serif" fontSize={15} fill={ENCRE} letterSpacing={1.6}
          opacity={0.36} fontStyle="italic">
          désynchronisation par index (φ, e, √2) — jamais Math.random
        </text>
        <line x1={70} y1={112} x2={1850} y2={112} stroke={ENCRE} strokeWidth={1} opacity={0.16} />

        <g opacity={b1}>
          <text x={70} y={SOL_1 - 150} fontFamily="Georgia, serif" fontSize={19} fill={OR_CLAIR}
            letterSpacing={3.5} opacity={0.75}>1 · LE GROUPE QUI ATTEND</text>
          <SceneAttend frame={frame} solY={SOL_1} cx={W / 2} />
        </g>

        <g opacity={b2}>
          <text x={70} y={SOL_2 - 150} fontFamily="Georgia, serif" fontSize={19} fill={OR_CLAIR}
            letterSpacing={3.5} opacity={0.75}>2 · UN QUI SE DÉTACHE</text>
          <SceneDetache frame={frame} solY={SOL_2} cx={W / 2 - 60} fps={fps} />
        </g>

        <g opacity={b3}>
          <text x={70} y={SOL_3 - 200} fontFamily="Georgia, serif" fontSize={19} fill={OR_CLAIR}
            letterSpacing={3.5} opacity={0.75}>3 · LE GROUPE QUI MARCHE ENSEMBLE</text>
          <SceneExode frame={frame} solY={SOL_3 - 90} cx={W / 2 - 380} n={5}
            label="EXODE — 5 PERSONNAGES" sub="cadence et phase décalées par individu" />
          <SceneExode frame={frame} solY={SOL_3 + 40} cx={W / 2 + 420} n={12}
            label="EXODE — 12 PERSONNAGES (test de charge)" sub="3 rangées de profondeur, plus petit/pâle en arrière-plan" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default GroupeFoule16x9;
