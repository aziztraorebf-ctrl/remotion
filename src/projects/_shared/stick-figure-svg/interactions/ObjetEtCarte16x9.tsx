// R&D VAGUE D — INTERACTIONS · LOT "PERSONNAGE + OBJET" (refonte, cf. verdict Aziz 2026-07-26)
//
// OBJECTIF REEL DU LOT (mot d'Aziz) : "pouvoir valider plusieurs mouvements d'un personnage qui
// manipule des objets [...] ça pourrait resservir plus tard comme base pour voir si c'est
// faisable." Ce fichier ne repare pas une pioche isolee : il PROUVE la brique "le personnage
// manipule un objet" — la main tient vraiment quelque chose, le corps agit avec.
//
// ⛔ PARTIE 2 (personnage + carte) SUPPRIMEE — decision definitive d'Aziz : "je ne vois pas trop
// le but d'utiliser des personnages comme ceux-ci pour les mettre sur une carte [...] Là où il
// fonctionne c'est de manière narrative, dans différentes scènes." Le lot est 100% objet.
//
// CRITERE ELIMINATOIRE (mot d'Aziz, repris de l'index) : "si tu ne peux pas l'animer aussi bien
// qu'on l'a anime sur le franc CFA, ce n'est pas la bonne voie." On juge le MOUVEMENT, jamais le
// dessin fige. Les briques de l'index REPRISES ICI (pas reinventees) : verrou pas/distance, objet
// en lerp(mainA,mainB), poses-cles explicites — cf. STICK-FIGURE-INDEX.md et GestesLocomotion16x9
// (moteur de marche + genou optionnel + placement de main par pose.hand1/hand2, la technique
// utilisee pour TOUTES les scenes ci-dessous). L'IK 2 segments de GestesEchange16x9 n'est PAS
// utilisee ici (cf. note apres le composant <Figure>) — le moteur mono-segment a suffi partout.
//
// ⭐ CE QUI A ETE CORRIGE (verifie par render + frames, pas par calcul seul — cf. index) :
//   1. LA PIECE — l'ancienne version appelait <Figure phase={0}>, ce qui annule le ciseau des
//      jambes (sin(0)=0 des deux cotes -> les 2 jambes se superposent en UNE SEULE ligne
//      verticale, exactement la regle dure de l'index violee). Refaite avec une vraie pose
//      DEBOUT (stance ecartee, hanche/epaule/tete normales) + les DEUX bras places par pose.hand,
//      exactement la technique deja validee sur le sac et la caisse. Plus de figure ad hoc.
//   2. L'OUTIL — l'ancienne version calculait la cible de MAIN independamment, puis dessinait le
//      manche depuis cette main : la main et l'outil pouvaient diverger (verifie a la frame :
//      l'outil tombait hors de portee, detache). Inversee : on decide la trajectoire du MANCHE
//      (angle + pivot), on EN DEDUIT les 2 points de prise, puis les mains sont posees
//      directement sur ces points (pose.hand1/hand2). L'outil ne peut plus se detacher, par
//      construction.
//   3. LE SAC — le geste s'arretait aussitot les genoux flechis (retour Aziz : "il aurait peut-
//      etre fallu qu'il depose le sac sur le sol et ensuite se relève"). Le debut du geste
//      (approche, main en arriere sur le sac, flexion des genoux) est INCHANGE — Aziz l'a valide
//      explicitement. On ajoute la suite : il pose le sac au sol, la main relache, il se releve.
//      Le sac reste au sol ensuite (objet inerte, ne bouge plus).
//   4. LA CAISSE — validee par Aziz ("ça a l'air le plus réussi"), NON TOUCHEE.
//   + 2 SCENES AJOUTEES pour elargir la preuve de la brique "manipuler" (cf. rapport en fin de
//     fichier pour la justification) : SOULEVER un objet lourd du sol, et MARTELER (2e outil,
//     geste de travail repete different de la pioche).
//
// REGLES DURES (rappel index) : la main doit TENIR l'objet (jamais flottant a cote) · un objet
// inerte ne glisse jamais seul (porte/pousse/tire/tombe verticalement) · verrou pas/distance des
// qu'un perso se deplace · bras jamais au-dela de ~97% de portee · membre en UN SEUL path.
//
// TECHNIQUE : Remotion frame-driven pur (useCurrentFrame/interpolate/spring), aucun
// Math.random, aucune CSS transition/keyframes/setTimeout/rAF. Fond #182746, 1920x1080, 30fps.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const rad = (d: number) => (d * Math.PI) / 180;

// Palette identique au registre (fond #182746 impose par le brief, reste = reference CFA)
const NUIT = "#22345c";
const NUIT2 = "#182746";
const ENCRE = "#f0e8d2";
const OR_CLAIR = "#d9a93a";
const CUIVRE = "#c17e3a";

// ============================================================================================
// MOTEUR DE MARCHE (repris de GestesLocomotion16x9 — verrou pas/distance + genou optionnel)
// ============================================================================================
const L = 34; // longueur de jambe de reference
const stepLength = (swingDeg: number) => 2 * L * Math.sin(rad(swingDeg));

type WalkParams = {
  swingMax: number;
  bobAmp: number;
  lean: number;
  hipDrop: number;
  armSwing: number;
};
const WALK_DEFAULT: WalkParams = { swingMax: 17, bobAmp: 2.5, lean: 0, hipDrop: 0, armSwing: 22 };

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
  leg1Knee?: number;
  leg2Knee?: number;
  hand1?: [number, number];
  hand2?: [number, number];
};

// ⭐ CONVENTION D'ANGLE DE CE FICHIER (verifiee avant tout copier-coller, cf. piege de l'index) :
// c'est CELLE de GestesLocomotion16x9 : angle 0 = membre pendant (bras/jambe), mesure depuis la
// verticale descendante ; sin(angle) va vers l'avant (+x), cos(angle) va vers le bas (+y).
const Figure: React.FC<{
  x: number;
  y: number;
  phase: number;
  p?: Partial<WalkParams>;
  pose?: Pose;
  rotate?: number;
  color?: string;
  opacity?: number;
  scale?: number;
}> = ({ x, y, phase, p, pose = {}, rotate = 0, color = ENCRE, opacity = 1, scale = 1 }) => {
  const P = { ...WALK_DEFAULT, ...p };
  const a = phase * Math.PI * 2;
  const swing = Math.sin(a) * P.swingMax;
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
  const k1 = pose.leg1Knee ?? 0;
  const k2 = pose.leg2Knee ?? 0;
  const jambe = (deg: number, flex: number, len: number) => {
    if (flex === 0) {
      const ex = hx + Math.sin(rad(deg)) * len;
      const ey = hy + Math.cos(rad(deg)) * len;
      return { kx: ex, ky: ey, ex, ey, plie: false };
    }
    const kx = hx + Math.sin(rad(deg)) * (len / 2);
    const ky = hy + Math.cos(rad(deg)) * (len / 2);
    const ex = kx + Math.sin(rad(deg + flex)) * (len / 2);
    const ey = ky + Math.cos(rad(deg + flex)) * (len / 2);
    return { kx, ky, ex, ey, plie: true };
  };
  const J1 = jambe(l1, k1, L1);
  const J2 = jambe(l2, k2, L2);

  const torso = pose.torsoDeg !== undefined ? pose.torsoDeg : P.lean;
  const torsoLen = 32;
  const sx = hx + Math.sin(rad(torso)) * torsoLen;
  const sy = hy - Math.cos(rad(torso)) * torsoLen;

  const tuck = pose.headTuck ?? 0;
  const headLen = 12 - tuck * 7;
  const headCx = sx + Math.sin(rad(torso)) * headLen + 3 * Math.cos(rad(torso));
  const headCy = sy - Math.cos(rad(torso)) * headLen + 3 * Math.sin(rad(torso));

  const armLen1 = pose.arm1Len ?? 28;
  const armLen2 = pose.arm2Len ?? 28;
  const manuel1 = pose.arm1Deg !== undefined;
  const manuel2 = pose.arm2Deg !== undefined;
  const a1 = manuel1 ? (pose.arm1Deg as number) + torso : -Math.sin(a) * P.armSwing;
  const a2 = manuel2 ? (pose.arm2Deg as number) + torso : Math.sin(a) * P.armSwing;
  const b1x = pose.hand1 ? pose.hand1[0] : sx + Math.sin(rad(a1)) * armLen1;
  const b1y = pose.hand1 ? pose.hand1[1] : sy + Math.cos(rad(a1)) * armLen1;
  const b2x = pose.hand2 ? pose.hand2[0] : sx + Math.sin(rad(a2)) * armLen2;
  const b2y = pose.hand2 ? pose.hand2[1] : sy + Math.cos(rad(a2)) * armLen2;

  const posesManuelles = pose.hipY !== undefined;
  const bas = Math.max(J1.ey, J2.ey, J1.ky, J2.ky, sy, headCy + 9, b1y, b2y);
  const calage = posesManuelles && bas < 0 ? -bas : 0;

  return (
    <g transform={`translate(${x} ${y + calage}) scale(${scale}) rotate(${rotate})`} opacity={opacity}>
      <line x1={hx} y1={hy} x2={J2.kx} y2={J2.ky} stroke={color} strokeWidth={4.5} strokeLinecap="round" opacity={0.75} />
      {J2.plie && <line x1={J2.kx} y1={J2.ky} x2={J2.ex} y2={J2.ey} stroke={color} strokeWidth={4.5} strokeLinecap="round" opacity={0.75} />}
      <line x1={sx} y1={sy} x2={b2x} y2={b2y} stroke={color} strokeWidth={4} strokeLinecap="round" opacity={0.75} />
      <line x1={hx} y1={hy} x2={sx} y2={sy} stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      <line x1={hx} y1={hy} x2={J1.kx} y2={J1.ky} stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      {J1.plie && <line x1={J1.kx} y1={J1.ky} x2={J1.ex} y2={J1.ey} stroke={color} strokeWidth={4.5} strokeLinecap="round" />}
      <line x1={sx} y1={sy} x2={b1x} y2={b1y} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <circle cx={headCx} cy={headCy} r={9} fill={color} />
    </g>
  );
};

// ============================================================================================
// NOTE : ce fichier n'utilise PAS l'IK 2 segments (solveArm/Membre) de GestesEchange16x9 — le
// moteur <Figure> repris de GestesLocomotion place les mains directement via pose.hand1/hand2
// (un seul segment epaule->main), ce qui a suffi pour TOUTES les scenes ci-dessous (sac, piece,
// caisse, outil, marteau, soulever). C'est la meme technique deja validee sur porter/pousser/
// tirer dans GestesLocomotion16x9 — pas de brique reinventee, juste pas celle-la ici.
// ============================================================================================

// ============================================================================================
// ETIQUETTE — sobre, Georgia serif, comme la reference
// ============================================================================================
const Etiquette: React.FC<{ x: number; y: number; label: string; sub?: string; op?: number; color?: string }> = ({
  x, y, label, sub, op = 1, color = ENCRE,
}) => (
  <g opacity={op}>
    <text x={x} y={y} textAnchor="middle" fontFamily="Georgia, serif" fontSize={22} fill={color}
      letterSpacing={2.5} opacity={0.85}>{label}</text>
    {sub && (
      <text x={x} y={y + 24} textAnchor="middle" fontFamily="Georgia, serif" fontSize={15} fill={ENCRE}
        letterSpacing={1.2} opacity={0.42} fontStyle="italic">{sub}</text>
    )}
  </g>
);

const Sol: React.FC<{ y: number; x0: number; x1: number; op?: number }> = ({ y, x0, x1, op = 0.28 }) => (
  <line x1={x0} y1={y} x2={x1} y2={y} stroke={ENCRE} strokeWidth={1.6} opacity={op} />
);

const Etoiles: React.FC<{ seed: number; n: number; maxY?: number }> = ({ seed, n, maxY = H }) => {
  const stars = React.useMemo(() => {
    const a: { x: number; y: number; r: number; o: number }[] = [];
    let s = seed;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < n; i++) a.push({ x: rnd() * W, y: rnd() * maxY, r: rnd() * 1.3 + 0.4, o: rnd() * 0.28 + 0.1 });
    return a;
  }, [seed, n, maxY]);
  return <>{stars.map((st, i) => <circle key={i} cx={st.x} cy={st.y} r={st.r} fill={ENCRE} opacity={st.o} />)}</>;
};

// ================================================================================================
// PARTIE 1 — PERSONNAGE + OBJETS DE NOTRE UNIVERS ECONOMIQUE
// ================================================================================================

// ------------------------------------------------------------------------------------------------
// 1a. LE SAC — porte sur l'epaule, marche, s'accroupit et le pose au sol (segment VALIDE par Aziz
// tel quel : "j'aime beaucoup comment il tend la main en arrière [...] le mouvement des genoux
// fléchis fonctionne extrêmement bien" — NON TOUCHE jusqu'a T_POSE inclus), PUIS SUITE AJOUTEE
// (defaut signale : "le mouvement se fige [...] il aurait peut-être fallu qu'il dépose le sac sur
// le sol et ensuite se relève") : la main relache completement, il se releve, le sac reste au sol
// (objet inerte, ne bouge plus tout seul une fois pose).
// ------------------------------------------------------------------------------------------------
const SceneSac: React.FC<{ frame: number; solY: number; x0: number; x1: number }> = ({ frame, solY, x0, x1 }) => {
  const t = frame / FPS;
  const T_MARCHE = 2.4;   // il marche, sac sur l'epaule
  const T_ARRET = 2.9;    // il s'arrete
  const T_POSE = 4.0;     // il s'accroupit et pose le sac (segment valide, inchange)
  const T_LACHE = 4.5;    // la main relache completement le sac
  const T_RELEVE = 5.6;   // il se releve, debout, mains libres
  const T_TENU = 7.0;     // temps de lecture, debout, sac au sol derriere lui

  const cad = 0.5;
  const swingMax = 15;
  const phase = Math.min(t, T_MARCHE) * cad % 1;
  const dist = Math.min(t, T_MARCHE) * cad * 2 * stepLength(swingMax);
  const xMarche = x0 + 90 + dist;

  const sAccroupi = spring({ frame: frame - S(T_POSE - 0.5), fps: FPS, config: { mass: 0.9, damping: 14, stiffness: 95 } });
  const accroupi = t >= T_POSE - 0.5 ? Math.min(1, sAccroupi) : 0;
  // ⭐ SUITE AJOUTEE : un 2e ressort, INDEPENDANT du premier (jamais additionne sur le meme angle,
  // cf. brique n°4 de l'index — poses-cles explicites). accroupi reste fige a 1 (le corps a fini
  // de descendre), et sRelever pilote SEUL la remontee, a partir de T_RELEVE.
  const sRelever = spring({ frame: frame - S(T_RELEVE), fps: FPS, config: { mass: 1.0, damping: 15, stiffness: 90 } });
  const relever = t >= T_RELEVE ? Math.min(1, sRelever) : 0;
  // ⛔ CORRIGE (verifie par render) : sans ce petit pas, le perso se relevait exactement A L'APLOMB
  // du sac qu'il vient de poser — le sac se lisait comme "flottant entre ses jambes" au lieu de
  // "pose a cote de lui". Un vrai geste de depot recule d'un demi-pas en se relevant. Distance
  // DERIVEE de la meme formule stepLength (verrou pas/distance, jamais un pixel choisi a la main).
  const PAS_RECUL = stepLength(swingMax) * 0.6;
  const x = xMarche - relever * PAS_RECUL;

  const lean = interpolate(relever, [0, 1], [-7, 0], clamp);
  const hipDrop = interpolate(accroupi, [0, 1], [4, 20], clamp) - relever * 20;
  const bob = t < T_ARRET ? Math.abs(Math.cos(phase * Math.PI * 2)) * 1.1 : 0;
  const hy = -26 - bob + hipDrop;
  const sxL = Math.sin(rad(lean)) * 32;
  const syL = hy - Math.cos(rad(lean)) * 32;

  // le sac descend AVEC la main (jamais detache en l'air) : quand accroupi=1 il touche le sol.
  const sacCxRepos = Math.sin(rad(-7)) * 32 - 20;
  const sacCyRepos = (-26 - Math.cos(rad(-7)) * 32) + 6;
  const sacR = 13;
  // position du sac au sol : UNE FOIS POSE IL NE BOUGE PLUS (objet inerte, meme quand le perso se
  // releve et s'eloigne du repere local) : on fige sa position MONDE des l'instant du contact —
  // EXACTEMENT le point tenu par la main pendant l'accroupissement (segment original, valide par
  // Aziz, non touche jusqu'ici).
  const sacCxSolLocal = 4;
  const sacCySolLocal = -sacR;
  const posé = accroupi >= 0.999 || t >= T_POSE + 0.02;
  const sacCx = posé ? sacCxSolLocal : interpolate(accroupi, [0, 1], [sacCxRepos, sacCxSolLocal], clamp);
  const sacCy = posé ? sacCySolLocal : interpolate(accroupi, [0, 1], [sacCyRepos, sacCySolLocal], clamp);
  // position MONDE du sac, figee au moment du contact (le perso, lui, va se relever, reculer d'un
  // pas et son repere local va remonter — le sac ne doit suivre NI l'un NI l'autre). On l'ancre a
  // `xMarche` (position d'arret, avant le pas de recul), jamais a `x` (qui inclut deja ce recul).
  const xSacMonde = xMarche;

  const pose: Pose | undefined = t >= T_ARRET
    ? relever > 0.01
      ? {
          // ⭐ SE RELEVER : poses-cles explicites (debout <- accroupi), le sac n'est plus dans la
          // main (main1 revient au repos), l'autre bras retombe aussi — plus rien a tenir.
          hipY: hy,
          torsoDeg: lean,
          leg1Deg: interpolate(relever, [0, 1], [34, 8], clamp),
          leg2Deg: interpolate(relever, [0, 1], [-20, -8], clamp),
          leg1Knee: interpolate(relever, [0, 1], [-74, 0], clamp),
          leg2Knee: interpolate(relever, [0, 1], [-50, 0], clamp),
          arm1Deg: interpolate(relever, [0, 1], [26, 6], clamp),
          arm1Len: 27,
          arm2Deg: interpolate(relever, [0, 1], [34, -6], clamp),
          arm2Len: 28,
        }
      : {
          // ⛔ BUG CORRIGE (verifie par render : les jambes restaient figees aux valeurs finales
          // du squat de t=2.9 a t=5.6, au lieu de suivre `accroupi` — la silhouette semblait
          // "coincee en pleine foulee"). Les angles doivent suivre le MEME ressort `accroupi` que
          // hipY/hipDrop (segment valide par Aziz, cf. entete) : c'est lui qui pilote toute la
          // descente, pas une valeur finale hardcodee.
          hipY: hy,
          torsoDeg: lean,
          leg1Deg: interpolate(accroupi, [0, 1], [8, 34], clamp),
          leg2Deg: interpolate(accroupi, [0, 1], [-8, -20], clamp),
          leg1Knee: interpolate(accroupi, [0, 1], [0, -74], clamp),
          leg2Knee: interpolate(accroupi, [0, 1], [0, -50], clamp),
          // la main tient le sac jusqu'a T_LACHE (interp locale, cible = position LOCALE du sac
          // par rapport au perso, qui est encore x==xSacMonde ici donc sacCx/sacCy sont valides
          // en repere local) puis relache : elle revient au repos SANS le sac.
          hand1: t < T_LACHE
            ? [sacCx + sacR * 0.35, sacCy - sacR * 0.5]
            : [
                interpolate(t, [T_LACHE, T_LACHE + 0.5], [sacCx + sacR * 0.35, 26], clamp),
                interpolate(t, [T_LACHE, T_LACHE + 0.5], [sacCy - sacR * 0.5, 24], clamp),
              ],
          arm2Deg: 34,
          arm2Len: 29,
        }
    : undefined;

  const relacheMain = interpolate(t, [T_POSE + 0.3, T_LACHE], [1, 0], clamp); // main garde un contact leger puis lache

  const fade = interpolate(t, [T_TENU, T_TENU + 0.8], [1, 1], clamp);

  return (
    <g opacity={fade}>
      <Sol y={solY} x0={x0} x1={x1} />
      {/* le sac : position MONDE fixe une fois pose (xSacMonde, sacCx/sacCy locaux au repere de
          pose initial) — reste immobile au sol meme quand le perso se releve et change de posture */}
      <g transform={`translate(${xSacMonde} ${solY})`}>
        <path
          d={`M ${sacCx - sacR} ${sacCy - sacR * 0.2}
              q ${-2} ${-sacR * 1.5} ${sacR} ${-sacR * 1.35}
              q ${sacR * 1.6} ${-0.5} ${sacR * 1.15} ${sacR * 1.2}
              q ${-0.5} ${sacR * 1.15} ${-sacR * 1.2} ${sacR * 0.95} z`}
          fill="none" stroke={CUIVRE} strokeWidth={3.4} strokeLinejoin="round" />
        {t < T_LACHE && (
          <line x1={sacCx + sacR * 0.5} y1={sacCy - sacR * 1.1} x2={sxL + 2} y2={syL + 3}
            stroke={CUIVRE} strokeWidth={2.4} strokeLinecap="round" opacity={0.85 * relacheMain} />
        )}
      </g>
      <Figure
        x={x} y={solY} phase={t < T_ARRET ? phase : 0}
        p={{ swingMax, bobAmp: 1.1, lean, hipDrop, armSwing: 9 }}
        pose={pose}
      />
    </g>
  );
};

// ------------------------------------------------------------------------------------------------
// 1b. LA PIECE / LE JETON — donne, empoche, refuse, laisse tomber (4 micro-beats en boucle).
// Reprend le principe de l'objet en lerp(mainA, mainB) de GestesEchange : jamais reparente sans
// interpolation, la bascule se fait quand les deux points convergent.
//
// ⛔ REECRITE ENTIEREMENT (defaut n°1, le plus grave, signale par Aziz : "le personnage a même été
// dessiné à l'envers [...] le buste et la tête semblent dessinés vers le bas"). VERIFIE A LA FRAME
// (t=16s, crop zoome) : le personnage n'avait PAS DE JAMBES DU TOUT — un seul trait continu du
// buste au sol. CAUSE RACINE : l'ancien code appelait <Figure phase={0}>. Dans le moteur repris de
// GestesLocomotion, phase pilote le ciseau des jambes via swing = sin(phase*2π)*swingMax ; a
// phase=0, sin(0)=0 des DEUX cotes (l1=+swing, l2=-swing), donc les deux jambes tombent
// EXACTEMENT superposees en une seule ligne verticale — exactement la regle dure de l'index
// violee ("deux membres au meme angle = un seul trait"). Le bras, lui, etait dessine par-dessus
// via un <Membre> independant (MembreParDessus), sans jambes ni epaules coherentes en dessous :
// d'ou l'impression justifiee d'un corps "dessine a l'envers".
//
// CORRECTION : aucune figure ad hoc. On reutilise EXACTEMENT <Figure> (meme fonction que le sac
// et la caisse, deja valides), avec une vraie POSE DEBOUT explicite — jambes en stance ecartee
// (comme le STANCE=7° de GestesEchange, jamais phase=0 pur), et les DEUX bras places par
// pose.hand1/hand2 (la meme technique que "porter"/"pousser" dans GestesLocomotion). Le donneur
// est a droite (arm1 = bras avant = celui qui tend), le receveur a gauche est en miroir (on
// negatif les x locaux — ce moteur n'a pas de prop `face`, donc le mirroring est fait a la main
// sur les cibles, comme sur toutes les scenes 1a/1c/1d de ce fichier).
// ------------------------------------------------------------------------------------------------
const CYCLE_PIECE = S(7.5);
// expose au parent (etiquette hors-zoom) le meme decoupage temporel que le corps de la scene
export const piecePhaseLabel = (frame: number): string => {
  const t = (frame % CYCLE_PIECE) / FPS;
  return t < 2.1 ? "donnée puis empochée" : t < 4.3 ? "main tendue, refusée" : "laissée tomber";
};

// stance debout commune aux deux persos de cette scene (jambes ecartees, jamais superposees)
const STANCE_PIECE = 9;

const ScenePiece: React.FC<{ frame: number; solY: number; x0: number; x1: number }> = ({ frame, solY, x0, x1 }) => {
  const f = frame % CYCLE_PIECE;
  const t = f / FPS;
  const cx = (x0 + x1) / 2;
  // ⚠️ ECART repris de GestesEchange16x9 (54, deja valide par le calcul de portee du bras : bras
  // tendu a 89% de BRAS_L+AVBRAS_L, jamais en butee). Ici l'armature est mono-segment (armLen ~28,
  // pas de 2-os), donc la meme regle s'applique directement en distance : reach <= ~0.9*armLen.
  const ECART = 54;
  const GAUCHE_X = cx - ECART / 2;  // receveur (a gauche, tend la main vers la droite)
  const DROITE_X = cx + ECART / 2; // donneur (a droite, tend la main vers la gauche)
  // hauteur d'epaule de <Figure> avec hipY=-26 (defaut) et torsoDeg=0 : sy = hy - torsoLen = -58.
  // ⚠️ pose.hand1/hand2 sont des coordonnees LOCALES ABSOLUES (depuis l'origine du perso, PAS
  // depuis l'epaule) — piege verifie dans le code de <Figure> (b1x = pose.hand1[0] directement,
  // aucun offset ajoute). Toute cible doit donc deja inclure la hauteur d'epaule.
  const EPAULE_Y = -58;

  // === DONNEUR (droite) : bras qui tend une piece vers la gauche, puis retire ===
  const tendA = interpolate(t, [0.3, 1.1], [0, 1], { ...clamp, easing: (u) => 1 - (1 - u) ** 3 });
  const retireA = interpolate(t, [1.9, 2.6], [0, 1], clamp);
  const reposA: [number, number] = [-4, -30];                    // bras pend le long du corps (vers -x, avant)
  const cibleTendueA: [number, number] = [-(ECART / 2 - 4), EPAULE_Y + 4]; // tendu vers le milieu, hauteur d'epaule
  const extA = tendA * (1 - retireA);
  const handA: [number, number] = [
    interpolate(extA, [0, 1], [reposA[0], cibleTendueA[0]], clamp),
    interpolate(extA, [0, 1], [reposA[1], cibleTendueA[1]], clamp),
  ];

  // === RECEVEUR (gauche) : avance la main, empoche (T0.9-2.0), OU refuse (T2.6-4.4) ===
  const empocheB = interpolate(t, [1.0, 1.9], [0, 1], { ...clamp, easing: (u) => 1 - (1 - u) ** 3 });
  const versPocheB = interpolate(t, [2.0, 2.5], [0, 1], clamp);
  const refuseB = interpolate(t, [2.7, 3.5], [0, 1], { ...clamp, easing: (u) => 1 - (1 - u) ** 2 });
  const retireRefusB = interpolate(t, [3.9, 4.4], [0, 1], clamp);

  const reposB: [number, number] = [4, -30];                     // bras pend le long du corps (vers +x, avant)
  const cibleRencontreB: [number, number] = [ECART / 2 - 4, EPAULE_Y + 4]; // tendu vers le milieu
  const pocheB: [number, number] = [16, -12];                    // main vers la poche/ceinture (a hauteur de hanche)
  const repousseB: [number, number] = [30, -44];                 // paume levee, geste de refus (hauteur d'epaule)

  let handB: [number, number] = reposB;
  if (t < 2.6) {
    handB = [
      interpolate(empocheB, [0, 1], [reposB[0], cibleRencontreB[0]], clamp) * (1 - versPocheB) + pocheB[0] * versPocheB,
      interpolate(empocheB, [0, 1], [reposB[1], cibleRencontreB[1]], clamp) * (1 - versPocheB) + pocheB[1] * versPocheB,
    ];
  } else if (t < 4.5) {
    handB = [
      interpolate(refuseB * (1 - retireRefusB), [0, 1], [reposB[0], repousseB[0]], clamp),
      interpolate(refuseB * (1 - retireRefusB), [0, 1], [reposB[1], repousseB[1]], clamp),
    ];
  }

  // légère stance : jambes ecartees en permanence (jamais phase=0 pur -> jamais 2 jambes confondues)
  const poseA: Pose = { leg1Deg: STANCE_PIECE, leg2Deg: -STANCE_PIECE, hand1: handA, arm2Deg: -6, arm2Len: 27 };
  const poseB: Pose = { leg1Deg: STANCE_PIECE, leg2Deg: -STANCE_PIECE, hand1: handB, arm2Deg: 6, arm2Len: 27 };

  // positions MONDE des mains (pour placer la piece) — hand1/hand2 sont deja les coordonnees
  // locales FINALES (aucun offset d'epaule a rajouter, cf. remarque ci-dessus).
  const worldA = { x: DROITE_X + handA[0], y: solY + handA[1] };
  const worldB = { x: GAUCHE_X + handB[0], y: solY + handB[1] };

  // objet (piece) : phase 1 lerp main A(donneur) -> main B(receveur) -> poche. phase 2 : reste
  // pres de la main tendue de A (refus). phase 3 : tombe au sol en chute libre (objet inerte).
  let objX = worldA.x, objY = worldA.y, objOp = 1;
  if (t < 2.6) {
    const grip = interpolate(t, [1.85, 2.0], [0, 1], clamp);
    objX = worldA.x + (worldB.x - worldA.x) * grip;
    objY = worldA.y + (worldB.y - worldA.y) * grip;
  } else if (t < 4.5) {
    objX = worldA.x;
    objY = worldA.y;
    objOp = interpolate(t, [4.35, 4.6], [1, 0], clamp) || 1;
  } else if (t < 6.2) {
    const chuteT = interpolate(t, [4.5, 5.15], [0, 1], { ...clamp, easing: (u) => u * u });
    objX = worldA.x;
    objY = interpolate(chuteT, [0, 1], [worldA.y, solY - 2], clamp);
    objOp = interpolate(t, [4.5, 4.7], [0, 1], clamp);
  } else {
    objOp = interpolate(t, [6.2, 6.6], [1, 0], clamp);
  }

  return (
    <g>
      <Sol y={solY} x0={x0} x1={x1} />
      <Figure x={GAUCHE_X} y={solY} phase={0} pose={poseB} />
      <Figure x={DROITE_X} y={solY} phase={0} pose={poseA} />
      {objOp > 0.02 && (
        <circle cx={objX} cy={objY} r={6.5} fill={OR_CLAIR} stroke={OR_CLAIR} strokeWidth={1.5} opacity={objOp} />
      )}
    </g>
  );
};

// ------------------------------------------------------------------------------------------------
// 1c. LA CAISSE / LE CONTENEUR — poussee (verrou pas/distance + a-coups, repris tel quel du
// moteur de GestesLocomotion), puis OUVERTE (couvercle qui pivote, contenu qui apparait en fondu —
// jamais de glisse : l'ouverture est une rotation sur charniere).
// ------------------------------------------------------------------------------------------------
const SceneCaisse: React.FC<{ frame: number; solY: number; x0: number; x1: number }> = ({ frame, solY, x0, x1 }) => {
  const t = frame / FPS;
  const T_POUSSE = 3.2;
  const T_ARRET = 3.6;
  const T_OUVRE = 4.6;
  const T_FIN = 6.4;

  const cad = 0.42;
  const swingMax = 16;
  const phPo = Math.min(t, T_POUSSE) * cad % 1;
  const distPo = Math.min(t, T_POUSSE) * cad * 2 * stepLength(swingMax);
  const xPo = x0 + 70 + distPo;
  const aPo = phPo * Math.PI * 2;
  const acoup = t < T_POUSSE ? Math.max(0, Math.sin(aPo)) * 2.4 : 0;

  const CAISSE = 46;
  const caisseX = t < T_ARRET ? xPo + 52 + acoup : xPo + 52;
  const faceX = caisseX - CAISSE / 2 - xPo;

  const sOuvre = spring({ frame: frame - S(T_OUVRE), fps: FPS, config: { mass: 0.8, damping: 13, stiffness: 100 } });
  const ouvre = t >= T_OUVRE ? sOuvre : 0;
  // ⚠️ CORRIGE apres render : le pivot etait sur le coin SUPERIEUR GAUCHE avec un angle NEGATIF
  // (sens antihoraire), ce qui fait basculer le couvercle VERS LA GAUCHE — exactement du cote ou
  // se tient le personnage. Resultat : le couvercle traversait sa tete et son buste au lieu de
  // s'ecarter de lui. La charniere doit etre du cote OPPOSE au personnage (coin superieur droit)
  // et pivoter vers la droite (angle positif) : le couvercle s'ouvre a l'ecart du corps.
  const couvercleAngle = interpolate(ouvre, [0, 1], [0, 108], clamp);

  const contenuOp = interpolate(t, [T_OUVRE + 0.5, T_OUVRE + 1.0], [0, 1], clamp);

  const poseArret: Pose | undefined = t >= T_ARRET
    ? {
        hipY: -26 - 2,
        torsoDeg: t < T_OUVRE ? 30 : interpolate(ouvre, [0, 1], [30, 6], clamp),
        leg1Deg: 6, leg2Deg: -10,
        hand1: t < T_OUVRE ? [faceX, -CAISSE * 0.82] : [faceX + 6, -CAISSE * 1.02 + ouvre * -6],
        hand2: t < T_OUVRE ? [faceX - 2, -CAISSE * 0.5] : [faceX - 2, -CAISSE * 0.5],
      }
    : undefined;

  return (
    <g>
      <Sol y={solY} x0={x0} x1={x1} />
      <g transform={`translate(${caisseX} ${solY})`}>
        {/* corps de la caisse (fixe une fois arretee) */}
        <rect x={-CAISSE / 2} y={-CAISSE * 0.7} width={CAISSE} height={CAISSE * 0.7} fill="none"
          stroke={OR_CLAIR} strokeWidth={3.5} strokeLinejoin="round" />
        {/* contenu : un petit tas de traits, revele en fondu quand le couvercle se leve */}
        <g opacity={contenuOp}>
          <line x1={-CAISSE * 0.28} y1={-CAISSE * 0.15} x2={-CAISSE * 0.05} y2={-CAISSE * 0.15} stroke={OR_CLAIR} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={-CAISSE * 0.02} y1={-CAISSE * 0.2} x2={CAISSE * 0.2} y2={-CAISSE * 0.2} stroke={OR_CLAIR} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={-CAISSE * 0.15} y1={-CAISSE * 0.32} x2={CAISSE * 0.1} y2={-CAISSE * 0.32} stroke={OR_CLAIR} strokeWidth={2.5} strokeLinecap="round" />
        </g>
        {/* couvercle : pivote sur la charniere COTE DROIT (oppose au personnage, qui pousse
            depuis la gauche) — le couvercle s'ecarte donc de lui au lieu de traverser son corps */}
        <g transform={`translate(${CAISSE / 2} ${-CAISSE * 0.7}) rotate(${couvercleAngle})`}>
          <line x1={0} y1={0} x2={-CAISSE} y2={0} stroke={OR_CLAIR} strokeWidth={3.5} strokeLinecap="round" />
        </g>
      </g>
      <Figure
        x={xPo} y={solY} phase={t < T_ARRET ? phPo : 0}
        p={{ swingMax, bobAmp: 0.8, lean: 30, hipDrop: 3, armSwing: 0 }}
        pose={poseArret}
      />
    </g>
  );
};

// ------------------------------------------------------------------------------------------------
// 1d. L'OUTIL (pioche) — le geste de travail repete.
//
// ⛔ REECRITE (defaut n°2, le plus signale par Aziz : "les bras du personnage semblent se
// détacher. L'outil n'atteint jamais vraiment le personnage avant de tomber"). VERIFIE PAR RENDER
// (frames a t=20.0/20.5/20.7s, zoomees) : au moment de la frappe, le fer de la pioche se
// retrouvait visiblement DETACHE, sous et a cote de la main. CAUSE RACINE : `handX` et `handY`
// etaient chacun un blend `leve*(1-frappe) + cible*frappe` calcule INDEPENDAMMENT sur chaque axe,
// avec des courbes d'interpolation differentes (`leve*(1-frappe)` sur x, `leve` seul sur y) — les
// deux composantes de la main ne suivaient donc PAS la meme trajectoire dans le temps, et le
// manche (positionne ENSUITE, en aval de handX/handY) heritait de cette incoherence.
//
// CORRECTION (methode demandee : manche d'abord, mains deduites) : on ne calcule plus une main
// puis un manche derriere elle. On decide la trajectoire du MANCHE — un point PIVOT (place a mi-
// hauteur du manche, entre les deux mains) et un ANGLE qui balaie de "leve derriere l'epaule" a
// "abattu devant, au sol" — puis on DEDUIT les 2 points de prise (main haute pres de la tete du
// manche, main basse plus loin vers le fer) le long de cet axe. Les mains ne peuvent plus quitter
// le manche : elles SONT des points du manche, par construction.
const SceneOutil: React.FC<{ frame: number; solY: number; x0: number; x1: number }> = ({ frame, solY, x0, x1 }) => {
  const cx = (x0 + x1) / 2;
  const CYCLE = S(1.7);
  const f = frame % CYCLE;
  const t = f / FPS;
  // 0 -> 0.55 leve (wind-up), 0.55 -> 0.7 frappe (vite), 0.7 -> 1.0 retour/repos bref
  const leve = interpolate(t, [0.05, 0.55], [0, 1], { ...clamp, easing: (u) => u * u });
  const frappe = interpolate(t, [0.55, 0.7], [0, 1], { ...clamp, easing: (u) => 1 - (1 - u) ** 2 });
  // progression UNIQUE du cycle (0 = repos bas, 1 = leve derriere, 2 = frappe au sol) : une seule
  // variable pilote TOUT (manche, mains, buste) — impossible que 2 axes divergent.
  const cycle = leve * (1 - frappe) + (1 + frappe) * frappe;

  // ⚠️ 2e CORRECTION (verifiee par render apres la 1ere) : un pivot FIXE pres de l'epaule + un
  // angle qui balaie ne peut PAS a la fois rester a portee de bras ET amener le fer au sol — la
  // geometrie l'interdit (calcule : meme a bras tendu a bloc, le fer restait a ~20px au-dessus du
  // sol, la pioche "frappait" en l'air pres de la tete). Un vrai coup de pioche n'est pas une
  // rotation autour d'un point fixe : le PIVOT LUI-MEME avance et descend pendant le coup (le
  // corps se penche, le bras se deploie). On definit donc 3 POSES-CLES explicites du manche
  // (pivot + fer), chacune verifiee par calcul (distance epaule->main plausible), et on fond
  // l'une dans l'autre selon `cycle` — exactement la brique n°4 de l'index (poses-cles explicites
  // > accumulation), appliquee ici a un OUTIL plutot qu'a un corps.
  //   REPOS  : manche vertical, fer deja pres du sol (pioche au repos, plantee/posee-tenue).
  //   LEVE   : manche derriere l'epaule, fer haut et en arriere (wind-up).
  //   FRAPPE : manche abattu, fer AU SOL devant le personnage (le coup a porte).
  const PIVOT_REPOS: [number, number] = [10, -30];
  const FER_REPOS: [number, number] = [14, -2];
  const PIVOT_LEVE: [number, number] = [-10, -60];
  const FER_LEVE: [number, number] = [-28, -95];
  const PIVOT_FRAPPE: [number, number] = [22, -35];
  const FER_FRAPPE: [number, number] = [34, -2];

  const lerp2 = (a: [number, number], b: [number, number], u: number): [number, number] => [
    a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u,
  ];
  const [pivotX, pivotY] = cycle <= 1 ? lerp2(PIVOT_REPOS, PIVOT_LEVE, cycle)
    : lerp2(PIVOT_LEVE, PIVOT_FRAPPE, (cycle - 1) ** 2);
  const [ferX, ferY] = cycle <= 1 ? lerp2(FER_REPOS, FER_LEVE, cycle)
    : lerp2(FER_LEVE, FER_FRAPPE, (cycle - 1) ** 2);

  // les 2 prises sont des points DU SEGMENT pivot->fer (fraction fixe le long de l'axe) : elles ne
  // peuvent structurellement pas se detacher du manche, quelle que soit la pose-cle active.
  const GRIP_HAUT = 0.15; // main arriere : pres du pivot
  const GRIP_BAS = 0.55;  // main avant : plus loin vers le fer — c'est elle qui guide le coup
  const handHautX = pivotX + (ferX - pivotX) * GRIP_HAUT;
  const handHautY = pivotY + (ferY - pivotY) * GRIP_HAUT;
  const handBasX = pivotX + (ferX - pivotX) * GRIP_BAS;
  const handBasY = pivotY + (ferY - pivotY) * GRIP_BAS;
  // direction du manche (pour orienter le trait perpendiculaire du fer)
  const dNorm = Math.max(1, Math.hypot(ferX - pivotX, ferY - pivotY));
  const dirX = (ferX - pivotX) / dNorm;
  const dirY = (ferY - pivotY) / dNorm;

  // buste : contrepoids du geste — recule pendant le lever, plonge dans le coup a la frappe
  // (meme grammaire que "pousser" dans GestesLocomotion : le buste dit l'effort).
  const torso = cycle <= 1
    ? interpolate(cycle, [0, 1], [0, -14], clamp)
    : interpolate(cycle, [1, 2], [-14, 24], { ...clamp, easing: (u) => u * u });

  const impactOp = interpolate(t, [0.68, 0.71, 0.95], [0, 1, 0], clamp);

  return (
    <g>
      <Sol y={solY} x0={x0} x1={x1} />
      {impactOp > 0.02 && [0, 1, 2, 3].map((i) => {
        const dir = i < 2 ? -1 : 1;
        const k = (i % 2);
        const len = 8 + k * 6;
        const px = cx + 26 + dir * (10 + k * 16);
        return (
          <line key={i} x1={px} y1={solY - 2} x2={px + dir * len} y2={solY - 6 - k * 3}
            stroke={ENCRE} strokeWidth={2} strokeLinecap="round" opacity={impactOp * (0.5 - k * 0.15)} />
        );
      })}
      {/* le manche + fer, tracés en PREMIER a partir du pivot — les mains iront ensuite se poser
          dessus, jamais l'inverse */}
      <g transform={`translate(${cx} ${solY})`}>
        <line x1={pivotX} y1={pivotY} x2={ferX} y2={ferY} stroke={CUIVRE} strokeWidth={3} strokeLinecap="round" />
        <line
          x1={ferX - dirY * 9} y1={ferY + dirX * 9}
          x2={ferX + dirY * 9} y2={ferY - dirX * 9}
          stroke={ENCRE} strokeWidth={3.5} strokeLinecap="round" opacity={0.9} />
      </g>
      <Figure
        x={cx} y={solY} phase={0}
        pose={{
          hipY: -26 + 2, torsoDeg: torso, leg1Deg: 12, leg2Deg: -14,
          // les 2 mains sont des POINTS DU MANCHE (deduits ci-dessus) : elles ne peuvent
          // structurellement pas s'en detacher, quel que soit l'instant du cycle. hand1/hand2
          // sont des coordonnees ABSOLUES (cf. <Figure>) : arm1Len/arm2Len n'ont ici aucun effet,
          // volontairement omis.
          hand1: [handBasX, handBasY],
          hand2: [handHautX, handHautY],
        }}
      />
    </g>
  );
};

// ------------------------------------------------------------------------------------------------
// 1e. SOULEVER — un objet lourd depuis le sol jusqu'a hauteur de poitrine. AJOUTEE pour elargir la
// preuve de la brique "manipuler" (objectif reel du lot, cf. entete). Choisie parce qu'elle teste
// un cas different des 4 premieres : les DEUX mains empoignent le MEME objet (pas un objet tenu
// d'une main comme le sac, ni pousse comme la caisse), et l'effort se lit dans la MONTEE du poids
// depuis le sol — le marqueur inverse de "porter" (qui montre le poids DEJA en charge).
// ------------------------------------------------------------------------------------------------
const SceneSoulever: React.FC<{ frame: number; solY: number; x0: number; x1: number }> = ({ frame, solY, x0, x1 }) => {
  const cx = (x0 + x1) / 2;
  const t = frame / FPS;
  const T_APPROCHE = 1.0;   // il s'accroupit devant l'objet
  const T_SAISI = 1.5;      // mains posees sur l'objet, au sol
  const T_LEVE = 2.9;       // souleve jusqu'a hauteur de poitrine
  const T_TENU = 4.4;       // tenu, lecture

  const sAccroupi = spring({ frame: frame - S(T_APPROCHE), fps: FPS, config: { mass: 0.9, damping: 15, stiffness: 100 } });
  const accroupi = t >= T_APPROCHE ? Math.min(1, sAccroupi) : 0;
  const sLeve = spring({ frame: frame - S(T_SAISI), fps: FPS, config: { mass: 1.3, damping: 16, stiffness: 75 } });
  const leve = t >= T_SAISI ? Math.min(1, sLeve) : 0;

  // OBJET : une caisse compacte (meme grammaire graphique que SceneCaisse, en plus petit — c'est
  // un objet different tenu differemment, pas le meme accessoire redessine).
  const BLOC = 30;
  // position MONDE du bloc : au sol au debut, monte jusqu'a hauteur de poitrine avec le corps.
  const blocYSol = -BLOC / 2;         // pose au sol, centre a mi-hauteur du bloc
  const blocYPorte = -58;             // tenu a hauteur de poitrine une fois debout
  const blocY = interpolate(leve, [0, 1], [blocYSol, blocYPorte], clamp);
  const blocX = 2;

  // le corps : accroupi devant l'objet (genoux flechis, dos droit — pas le dos qui plie, c'est la
  // regle de securite du geste "lever" qui le distingue visuellement de "porter"), puis se
  // redresse EN GARDANT l'objet colle au corps (les mains ne le lachent jamais).
  const hipDrop = interpolate(accroupi, [0, 1], [0, 22], clamp) - leve * 22;
  const hy = -26 + hipDrop;
  const torso = interpolate(accroupi, [0, 1], [0, 4], clamp) * (1 - leve); // dos reste quasi droit
  const legFlex = interpolate(accroupi, [0, 1], [0, -70], clamp) * (1 - leve);

  const pose: Pose | undefined = t >= T_APPROCHE
    ? {
        hipY: hy,
        torsoDeg: torso,
        leg1Deg: interpolate(accroupi, [0, 1], [8, 32], clamp) * (1 - leve) + leve * 8,
        leg2Deg: interpolate(accroupi, [0, 1], [-8, -18], clamp) * (1 - leve) - leve * 8,
        leg1Knee: legFlex,
        leg2Knee: legFlex * 0.75,
        // les 2 mains empoignent le MEME objet, de part et d'autre (jamais une main flottante)
        hand1: [blocX + BLOC * 0.42, blocY],
        hand2: [blocX - BLOC * 0.42, blocY],
        arm1Len: 20, arm2Len: 20,
      }
    : undefined;

  return (
    <g>
      <Sol y={solY} x0={x0} x1={x1} />
      <g transform={`translate(${cx} ${solY})`}>
        <rect x={blocX - BLOC / 2} y={blocY - BLOC / 2} width={BLOC} height={BLOC} fill="none"
          stroke={OR_CLAIR} strokeWidth={3.2} strokeLinejoin="round" />
      </g>
      <Figure x={cx} y={solY} phase={0} pose={pose} />
    </g>
  );
};

// ------------------------------------------------------------------------------------------------
// 1f. MARTELER — 2e outil, geste de travail repete DIFFERENT de la pioche (frappe verticale courte
// et rapide, contre l'arc large de la pioche). AJOUTEE pour elargir la preuve : montre que la
// methode "manche d'abord, mains deduites" generalise a un 2e outil sans etre reecrite pour lui.
// ------------------------------------------------------------------------------------------------
const SceneMarteler: React.FC<{ frame: number; solY: number; x0: number; x1: number }> = ({ frame, solY, x0, x1 }) => {
  const cx = (x0 + x1) / 2;
  const CYCLE = S(0.85);
  const f = frame % CYCLE;
  const t = f / FPS;
  // cycle court et sec : leve (0->0.5), frappe (0.5->0.65), retour (0.65->1)
  const leve = interpolate(t, [0.02, 0.5], [0, 1], { ...clamp, easing: (u) => u * u });
  const frappe = interpolate(t, [0.5, 0.62], [0, 1], { ...clamp, easing: (u) => 1 - (1 - u) ** 2 });
  const cycle = leve * (1 - frappe) + (1 + frappe) * frappe;

  // ⚠️ MEME CORRECTION QUE LA PIOCHE (verifiee par calcul AVANT render cette fois, cf. le defaut
  // deja rencontre sur SceneOutil) : un pivot fixe + angle ne peut pas amener la tete du marteau
  // jusqu'a l'enclume (geometriquement hors de portee). 3 poses-cles explicites (pivot + tete),
  // la tete de FRAPPE posee directement AU NIVEAU DE L'ENCLUME (verifie par calcul ci-dessous).
  const PIVOT_REPOS: [number, number] = [6, -40];
  const TETE_REPOS: [number, number] = [10, -20];
  const PIVOT_LEVE: [number, number] = [-4, -58];
  const TETE_LEVE: [number, number] = [-10, -72];
  const PIVOT_FRAPPE: [number, number] = [14, -24];
  const TETE_FRAPPE: [number, number] = [20, -9]; // au niveau du sommet de l'enclume (y~-14 a -2)

  const lerp2 = (a: [number, number], b: [number, number], u: number): [number, number] => [
    a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u,
  ];
  const [pivotX, pivotY] = cycle <= 1 ? lerp2(PIVOT_REPOS, PIVOT_LEVE, cycle)
    : lerp2(PIVOT_LEVE, PIVOT_FRAPPE, (cycle - 1) ** 2);
  const [teteX, teteY] = cycle <= 1 ? lerp2(TETE_REPOS, TETE_LEVE, cycle)
    : lerp2(TETE_LEVE, TETE_FRAPPE, (cycle - 1) ** 2);

  // les 2 prises sont des points DU SEGMENT pivot->tete (jamais detachees du manche)
  const GRIP_HAUT = 0.1;  // main d'appui : pres du pivot
  const GRIP_BAS = 0.5;   // main dominante : au milieu du manche (prise courte, marteau)
  const handHautX = pivotX + (teteX - pivotX) * GRIP_HAUT;
  const handHautY = pivotY + (teteY - pivotY) * GRIP_HAUT;
  const handBasX = pivotX + (teteX - pivotX) * GRIP_BAS;
  const handBasY = pivotY + (teteY - pivotY) * GRIP_BAS;
  const dNorm = Math.max(1, Math.hypot(teteX - pivotX, teteY - pivotY));
  const dirX = (teteX - pivotX) / dNorm;
  const dirY = (teteY - pivotY) / dNorm;

  const torso = cycle <= 1
    ? interpolate(cycle, [0, 1], [0, -6], clamp)
    : interpolate(cycle, [1, 2], [-6, 10], { ...clamp, easing: (u) => u * u });

  // l'objet frappe : une enclume/pieu bas, fixe au sol — l'impact resonne dessus (pas de glisse)
  const ENCLUME_X = 22, ENCLUME_Y = -8;
  const impactOp = interpolate(t, [0.58, 0.61, 0.82], [0, 1, 0], clamp);

  return (
    <g>
      <Sol y={solY} x0={x0} x1={x1} />
      <g transform={`translate(${cx} ${solY})`}>
        <rect x={ENCLUME_X - 12} y={ENCLUME_Y - 6} width={24} height={12} fill="none"
          stroke={CUIVRE} strokeWidth={3} strokeLinejoin="round" />
      </g>
      {impactOp > 0.02 && [0, 1, 2].map((i) => {
        const dir = i < 1.5 ? -1 : 1;
        const k = i % 2;
        const len = 6 + k * 5;
        const px = cx + ENCLUME_X + dir * (8 + k * 10);
        return (
          <line key={i} x1={px} y1={solY + ENCLUME_Y - 4} x2={px + dir * len} y2={solY + ENCLUME_Y - 8 - k * 3}
            stroke={ENCRE} strokeWidth={2} strokeLinecap="round" opacity={impactOp * (0.5 - k * 0.15)} />
        );
      })}
      <g transform={`translate(${cx} ${solY})`}>
        <line x1={pivotX} y1={pivotY} x2={teteX} y2={teteY} stroke={CUIVRE} strokeWidth={2.6} strokeLinecap="round" />
        <line
          x1={teteX - dirY * 7} y1={teteY + dirX * 7}
          x2={teteX + dirY * 7} y2={teteY - dirX * 7}
          stroke={ENCRE} strokeWidth={4} strokeLinecap="round" opacity={0.9} />
      </g>
      <Figure
        x={cx} y={solY} phase={0}
        pose={{
          hipY: -26 + 2, torsoDeg: torso, leg1Deg: 10, leg2Deg: -12,
          hand1: [handBasX, handBasY],
          hand2: [handHautX, handHautY],
        }}
      />
    </g>
  );
};

// ⚠️ HOMOTHETIE PAR SCENE (correction apres 1er render) : le moteur Figure dessine a taille
// "reelle" du registre (~74px de haut, cf. reference CFA) — exactement ce qui est demande pour
// juger le MOUVEMENT a l'echelle d'usage du registre (marche, IK, genou). Mais le brief demande le
// PERSONNAGE a l'ecran a 300-420px : on n'agrandit donc pas le moteur, on zoome la SCENE, centree
// sur le duo perso+objet (meme principe que ZOOM=5 dans GestesEchange16x9 — homothetie pure,
// aucune proportion interne recalculee). ZOOM_OBJ=3.6 -> perso a ~74*3.6=266px + marge de marche,
// dans la cible 300-420 une fois le mouvement (bras/jambes ecartes) pris en compte. 6 SCENES en
// GRILLE 3 colonnes x 2 rangees (et non plus 4 en ligne) : 6 manipulations elargissent la preuve
// du lot (cf. entete) et une seule ligne de 1920px n'offre plus assez d'espace sans chevauchement.
const ZOOM_OBJ = 3.6;
const SceneZoom: React.FC<{ cx: number; cy: number; children: React.ReactNode }> = ({ cx, cy, children }) => (
  <g transform={`translate(${cx} ${cy}) scale(${ZOOM_OBJ}) translate(${-cx} ${-cy})`}>{children}</g>
);

// grille 3 colonnes (centres a 320 / 960 / 1600) x 2 rangees (sol a 430 / 900)
const COL = [320, 960, 1600];
const SOL_R1 = 430;
const SOL_R2 = 900;

const PartieObjets: React.FC<{ frame: number }> = ({ frame }) => {
  const DUR = OBJET_ET_CARTE_FRAMES;
  const op = interpolate(frame, [0, 14, DUR - 14, DUR], [0, 1, 1, 0], clamp);
  return (
    <g opacity={op}>
      <text x={70} y={62} fontFamily="Georgia, serif" fontSize={25} fill={ENCRE} letterSpacing={4} opacity={0.7}>
        R&amp;D — INTERACTIONS · LE PERSONNAGE ET L&apos;OBJET
      </text>
      <text x={70} y={92} fontFamily="Georgia, serif" fontSize={15} fill={ENCRE} letterSpacing={1.4} opacity={0.36} fontStyle="italic">
        objets minimalistes, même encre que le personnage — un objet inerte ne glisse jamais seul, la main le tient toujours
      </text>
      <line x1={70} y1={112} x2={1850} y2={112} stroke={ENCRE} strokeWidth={1} opacity={0.16} />

      {/* ===== RANGEE 1 ===== */}
      <SceneZoom cx={COL[0]} cy={SOL_R1}>
        <SceneSac frame={frame} solY={SOL_R1} x0={COL[0] - 135} x1={COL[0] + 135} />
      </SceneZoom>
      <SceneZoom cx={COL[1]} cy={SOL_R1}>
        <ScenePiece frame={frame} solY={SOL_R1} x0={COL[1] - 120} x1={COL[1] + 120} />
      </SceneZoom>
      <SceneZoom cx={COL[2]} cy={SOL_R1}>
        <SceneCaisse frame={frame} solY={SOL_R1} x0={COL[2] - 135} x1={COL[2] + 135} />
      </SceneZoom>
      <Etiquette x={COL[0]} y={SOL_R1 + 96} label="LE SAC" sub="porté, posé au sol, puis il se relève" />
      <Etiquette x={COL[1]} y={SOL_R1 + 96} label="LA PIÈCE" sub={piecePhaseLabel(frame)} />
      <Etiquette x={COL[2]} y={SOL_R1 + 96} label="LA CAISSE" sub="poussée par à-coups, puis ouverte" />

      {/* ===== RANGEE 2 ===== */}
      <SceneZoom cx={COL[0]} cy={SOL_R2}>
        <SceneOutil frame={frame} solY={SOL_R2} x0={COL[0] - 60} x1={COL[0] + 60} />
      </SceneZoom>
      <SceneZoom cx={COL[1]} cy={SOL_R2}>
        <SceneSoulever frame={frame} solY={SOL_R2} x0={COL[1] - 90} x1={COL[1] + 90} />
      </SceneZoom>
      <SceneZoom cx={COL[2]} cy={SOL_R2}>
        <SceneMarteler frame={frame} solY={SOL_R2} x0={COL[2] - 60} x1={COL[2] + 60} />
      </SceneZoom>
      <Etiquette x={COL[0]} y={SOL_R2 + 96} label="L'OUTIL (PIOCHE)" sub="manche solidaire des 2 mains — jamais détaché" />
      <Etiquette x={COL[1]} y={SOL_R2 + 96} label="SOULEVER" sub="un objet lourd, du sol à la poitrine" />
      <Etiquette x={COL[2]} y={SOL_R2 + 96} label="MARTELER" sub="2e outil, frappe courte et sèche" />
    </g>
  );
};

// ================================================================================================
// LA PLANCHE — une seule partie (objets), fond commun + etoiles. Partie carte SUPPRIMEE (cf. entete).
// ================================================================================================
export const OBJET_ET_CARTE_FRAMES = S(30);

export const ObjetEtCarte16x9: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();
  const opGlobal = interpolate(frame, [0, 10, OBJET_ET_CARTE_FRAMES - 12, OBJET_ET_CARTE_FRAMES], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NUIT} 0%, ${NUIT2} 100%)`, opacity: opGlobal }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <Etoiles seed={23} n={50} />
        <PartieObjets frame={frame} />
      </svg>
    </AbsoluteFill>
  );
};

export default ObjetEtCarte16x9;
