// ============================================================================================
// SCENE NARRATIVE — LE CREANCIER (2026-08-03)
// ============================================================================================
//
// POURQUOI CE FICHIER : premiere "vraie scene" du registre stick figure depuis sa mise en
// production (28/07) qui ne soit ni un banc d'essai de gestes isoles ni liee a un episode en
// cours (le Gazoduc a ete explicitement ECARTE pour un perso, cf. STICK-FIGURE-INDEX.md
// § PISTE ABANDONNEE — PERSONNAGE + CARTE). Sujet choisi : un rapport de force economique
// asymetrique (creancier / debiteur) — le registre le plus direct pour un sujet Souverain
// (dette souveraine, FMI, restructuration), sans dependre d'un pays precis.
//
// LE FILTRE DE SCENE (§ 4 de l'index) applique AVANT de coder :
//   - SOL ? OUI — rue/trottoir plat, aucune surface a inventer (eau, foule dense).
//   - GESTE DU CORPS, pas d'objet ? OUI — attendre, marcher, s'arreter, tendre la main VIDE
//     (exiger), incliner la tete (se soumettre). Aucun objet manipule -> aucune machine a etats
//     a construire, le point faible documente du registre (bras elastique du sac, piece qui
//     saute) ne s'applique pas ici.
//   - DECOR RENDU ET REGARDE ? Decor NEUF, minimal, construit et regarde ici-meme avant de
//     juger la scene finale (pas herite d'un proto GeminiRig jamais eprouve).
// -> 3/3, la scene est un bon banc d'essai.
//
// ASYMETRIE (brique validee, DuoAsymetrie16x9.tsx, portee ici a la main — PAS recablee sur le
// socle par decision Aziz, cf. index § chantiers ouverts pt.4) :
//   FORT (creancier)  = trait x1.28, encre PLEINE (ENCRE), posture droite, costume fonctionnaire.
//   FAIBLE (debiteur) = trait x0.74, encre TERNE (#9aa3b8), voute 8 deg, tenue civile simple.
// Aucun signal seul ne suffisait (cf. index) : c'est la COMBINAISON qui porte le rapport de force.
//
// MISE EN SCENE (trouvaille deja documentee, § VAGUE D) : "le fort ne suit jamais le partant du
// regard, il reste fixe" — ici retournee : c'est le FAIBLE qui reste fixe, tete basse, apres le
// depart du fort. Rester immobile plus fort que le regarder partir.
//
// TECHNIQUE : frame-driven, zero Math.random / setTimeout / CSS transition / @keyframes.
// ============================================================================================
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import {
  Figure,
  type Pose,
  type WalkParams,
  walkDistance,
  rad,
  NUIT,
  NUIT2,
  ENCRE,
} from "../../_shared/stick-figure-svg/StickFigure";

// --------------------------------------------------------------------------------------------
// TIMING — 4 beats, un seul enchainement, aucune boucle
// --------------------------------------------------------------------------------------------
const FPS = 30;
const T_ARRIVEE = 0;        // le creancier entre en marchant depuis le bord GAUCHE (cf. note
                             // orientation ci-dessous : le socle avance naturellement vers +x)
const T_ARRET = 90;         // il s'arrete face au debiteur (3s de marche)
const T_MAIN_TENDUE = 130;  // la main se tend, exige (1.33s d'approche + arret tenu)
const T_SOUMISSION = 190;   // le debiteur incline la tete (2s apres la main tendue)
const T_DEPART = 260;       // le creancier tourne les talons et repart (2.33s de tenue du silence)
const T_FIN = 340;          // le debiteur reste seul, immobile — 2.67s de plan tenu
export const CREANCIER_FRAMES = T_FIN;

// --------------------------------------------------------------------------------------------
// SOL + DECOR — facade institutionnelle minimale (porte + colonnes), rue nue
// --------------------------------------------------------------------------------------------
const SOL_Y = 760;
const PERSO_SCALE = 5.6;

const Decor: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NUIT2 }}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      {/* ciel plat, sans degrade — registre encre */}
      <rect x={0} y={0} width={1920} height={SOL_Y} fill={NUIT2} />
      {/* sol */}
      <rect x={0} y={SOL_Y} width={1920} height={1080 - SOL_Y} fill={NUIT} />
      <line x1={0} y1={SOL_Y} x2={1920} y2={SOL_Y} stroke={ENCRE} strokeWidth={2} opacity={0.35} />

      {/* facade institutionnelle, centree derriere le debiteur (a droite) — colonnes + fronton */}
      <g opacity={0.55}>
        <rect x={1240} y={SOL_Y - 340} width={400} height={340} fill="none" stroke={ENCRE} strokeWidth={3} />
        <polygon points="1220,760 1440,600 1660,760" fill="none" stroke={ENCRE} strokeWidth={3} strokeLinejoin="round" />
        {[1280, 1350, 1440, 1530, 1600].map((cx) => (
          <line key={cx} x1={cx} y1={SOL_Y - 300} x2={cx} y2={SOL_Y} stroke={ENCRE} strokeWidth={3} opacity={0.6} />
        ))}
        <rect x={1415} y={SOL_Y - 90} width={50} height={90} fill="none" stroke={ENCRE} strokeWidth={2.5} opacity={0.7} />
      </g>

      {/* marches devant la facade */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={1200 - i * 14} y={SOL_Y - i * 10 - 10} width={480 + i * 28} height={10} fill={NUIT} stroke={ENCRE} strokeWidth={1.5} opacity={0.4} />
      ))}
    </svg>
  </AbsoluteFill>
);

// --------------------------------------------------------------------------------------------
// LE DEBITEUR (FAIBLE) — attend DROIT, puis s'affaisse quand la main se tend (pas avant)
// --------------------------------------------------------------------------------------------
// ⭐ ORDRE CORRIGE (retour Aziz) : le debiteur doit etre DROIT tant que le creancier n'a pas
// commence a exiger. L'affaissement (voute + tete qui plonge + tremblement) demarre au moment
// ou le bras du creancier se leve (T_ARRET, cf. Creancier ci-dessous), pas des la frame 0.
const DEBITEUR_X = 1440; // a DROITE — le creancier entre par la gauche et vient vers lui
const FAIBLE_COLOR = "#9aa3b8";
const FAIBLE_STROKE_SCALE = 0.74; // brique asymetrie : trait plus fin

// bruit deterministe (brique n5) : 3 sinus a rapports irrationnels, jamais Math.random
const bruitDeterministe = (t: number, amp: number) =>
  amp * (Math.sin(t * 1) + Math.sin(t * 1.618 + 1.1) * 0.6 + Math.sin(t * 2.718 + 2.3) * 0.35) / 1.95;

const Debiteur: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame / FPS;

  // le tremblement ne commence QUE quand le creancier exige (T_ARRET), pas avant : posture
  // droite/calme jusque-la, puis nervosite croissante qui accompagne l'affaissement.
  const envelopeTremble = interpolate(frame, [T_ARRET, T_ARRET + 40, T_SOUMISSION], [0, 1, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tremble = bruitDeterministe(t * 3.4, 2.2) * envelopeTremble;

  // inclinaison de tete + voute (soumission) : demarre a T_ARRET (le bras qui se leve), pas a
  // T_SOUMISSION seul — T_SOUMISSION reste le point ou l'affaissement est PLEINEMENT installe.
  const soumission = spring({
    frame: frame - T_ARRET,
    fps: FPS,
    durationInFrames: T_SOUMISSION - T_ARRET,
    config: { damping: 200, mass: 1.4 },
  });
  const headTuck = interpolate(soumission, [0, 1], [0, 0.62], { extrapolateRight: "clamp" });
  const torsoVoute = interpolate(soumission, [0, 1], [0, 14], { extrapolateRight: "clamp" });

  const pose: Pose = {
    torsoDeg: torsoVoute + tremble * 0.4,
    leg1Deg: 2 + tremble * 0.3,
    leg2Deg: -2 - tremble * 0.3,
    arm1Deg: 4 + tremble * 0.6,
    arm2Deg: -4 - tremble * 0.6,
    headTuck,
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <g transform={`scale(${FAIBLE_STROKE_SCALE})`}>
        <Figure
          x={DEBITEUR_X / FAIBLE_STROKE_SCALE}
          y={SOL_Y / FAIBLE_STROKE_SCALE}
          phase={0.25}
          pose={pose}
          color={FAIBLE_COLOR}
          scale={PERSO_SCALE / FAIBLE_STROKE_SCALE}
        />
      </g>
    </svg>
  );
};

// --------------------------------------------------------------------------------------------
// LE CREANCIER (FORT) — entre par la GAUCHE, marche, s'arrete, tend la main vide, repart
// --------------------------------------------------------------------------------------------
// ⭐ ORIENTATION DU SOCLE (cause du "moonwalk" signale par Aziz) : <Figure> place la tete avec un
// offset +3*cos(torso) vers +x (StickFigure.tsx ~L410) — le personnage est concu pour AVANCER
// vers +x (la droite ecran). Faire decroitre x (comme la version precedente, qui le faisait
// entrer par la droite) revient a le faire progresser a REBOURS de sa propre orientation
// anatomique : la tete/le buste pointent dans un sens, le deplacement va dans l'autre — d'ou
// l'effet de trainee/moonwalk. FIX : le creancier entre par la GAUCHE et x CROIT jusqu'a l'arret.
const CREANCIER_X_DEPART = -80; // hors champ a gauche
const CREANCIER_X_ARRET = 1160; // s'arrete a distance de bras + marge, a gauche du debiteur (1440)
const FORT_STROKE_SCALE = 1.28;

const WALK_CREANCIER: WalkParams = { swingMax: 18, bobAmp: 2.3, lean: 4, hipDrop: 0, armSwing: 20 };

const CADENCE = 1.1; // cycles/s (1 cycle = 2 pas)

const Creancier: React.FC<{ frame: number }> = ({ frame }) => {
  // -- MARCHE (T_ARRIVEE -> T_ARRET), verrou pas/distance (brique n1) --
  // walkDistance() attend un nombre de PAS (1 cycle = 2 pas) — cf. pattern de reference
  // EnchainementGestesValides.tsx : walkDistance(tempsSecondes * cadence * 2, swing, scale).
  const marcheFrame = Math.min(frame, T_ARRET) - T_ARRIVEE;
  const tMarche = marcheFrame / FPS;
  const cyclesMarche = tMarche * CADENCE;
  const dParcouru = walkDistance(cyclesMarche * 2, WALK_CREANCIER.swingMax, PERSO_SCALE);
  const distanceTotale = CREANCIER_X_ARRET - CREANCIER_X_DEPART;
  const xMarche = CREANCIER_X_DEPART + Math.min(dParcouru, distanceTotale);
  const enMarche = frame < T_ARRET;
  const x = enMarche ? Math.min(xMarche, CREANCIER_X_ARRET) : CREANCIER_X_ARRET;
  const phase = cyclesMarche % 1; // fraction de cycle courante, pour <Figure>

  // -- MAIN TENDUE, exige (T_ARRET -> T_MAIN_TENDUE) --
  const tendreMain = spring({
    frame: frame - T_ARRET,
    fps: FPS,
    config: { damping: 200 },
    durationInFrames: T_MAIN_TENDUE - T_ARRET,
  });
  const armReach = interpolate(tendreMain, [0, 1], [0, 1]);

  // -- DEPART, repart par ou il est arrive (T_DEPART -> T_FIN) --
  const departFrame = Math.max(0, frame - T_DEPART);
  const tDepart = departFrame / FPS;
  const cyclesDepart = tDepart * CADENCE;
  const dDepart = walkDistance(cyclesDepart * 2, WALK_CREANCIER.swingMax, PERSO_SCALE);
  const xDepart = CREANCIER_X_ARRET - dDepart; // recule vers la gauche, hors champ
  const departPhase = cyclesDepart % 1;
  const enDepart = frame >= T_DEPART;

  const finalX = enDepart ? xDepart : x;

  // pose debout tenue entre T_ARRET et T_DEPART : bras qui monte vers l'horizontale (exiger,
  // paume ouverte). Verifie dans le socle (StickFigure.tsx ~L440-456) : arm1 est dessine EN
  // DERNIER (juste avant la tete), opacite pleine -> c'est le bras AVANT/visible. arm2 est
  // dessine en premier, opacite 0.75 -> le bras ARRIERE. C'est donc arm1 qui doit se lever
  // (retour Aziz : le bras leve doit se voir clairement, pas rester en retrait derriere le corps).
  const armDegExige = interpolate(armReach, [0, 1], [4, -78]);

  // NB mise en scene : le socle n'anime QUE le profil (decision Aziz, dos ecarte). "Tourner les
  // talons" reste donc visuellement un DEMI-TOUR non represente — on le joue plus simplement : le
  // creancier RECULE par ou il est venu (repart vers la gauche, hors champ), ce qui se lit deja
  // "il s'en va" sans avoir besoin d'un mirror qui casserait la geometrie du socle (facing unique).
  // ecart de jambes en position d'arret : le socle interdit deux membres au meme angle
  // ("un seul trait", regle dure du registre) — 9deg est un ecart d'arret stable et lisible,
  // largement au-dela du seuil de confusion visuelle.
  const poseArret: Pose = enMarche || enDepart
    ? {}
    : {
        torsoDeg: 2,
        arm1Deg: armDegExige,
        leg1Deg: 9,
        leg2Deg: -9,
      };

  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <g transform={`scale(${FORT_STROKE_SCALE})`}>
        <Figure
          x={finalX / FORT_STROKE_SCALE}
          y={SOL_Y / FORT_STROKE_SCALE}
          phase={enDepart ? departPhase : phase}
          p={WALK_CREANCIER}
          pose={poseArret}
          color={ENCRE}
          scale={PERSO_SCALE / FORT_STROKE_SCALE}
        />
      </g>
    </svg>
  );
};

// --------------------------------------------------------------------------------------------
// SCENE COMPLETE
// --------------------------------------------------------------------------------------------
export const SceneCreancier: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Decor />
      <Debiteur frame={frame} />
      <Creancier frame={frame} />
    </AbsoluteFill>
  );
};

export default SceneCreancier;
