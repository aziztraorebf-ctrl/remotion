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
const T_ARRIVEE = 0;         // le creancier entre en marchant depuis le bord GAUCHE (cf. note
                              // orientation ci-dessous : le socle avance naturellement vers +x)
const T_ARRET = 90;          // il s'arrete face au debiteur (3s de marche)
const T_MAIN_TENDUE = 130;   // la main se tend, exige (1.33s d'approche + arret tenu)
const T_SOUMISSION = 190;    // le debiteur incline la tete (2s apres la main tendue)
// ⭐ MISE EN SCENE CORRIGEE (retour Aziz 2026-08-04) : ils sortent l'un APRES l'autre, espaces —
// PAS ensemble, PAS a reculons. D'abord le DEBITEUR (brise, courbe) qui s'en va en marchant, en
// GARDANT sa posture voutee — c'est lui qui part, tete basse, sous nos yeux. Puis, une fois qu'il
// est sorti, le CREANCIER (qui etait reste immobile en position d'arret) repart a son tour, dans
// le MEME sens (+x, coherent avec l'orientation du socle) — il n'a jamais besoin de croiser le
// debiteur puisque celui-ci est deja hors-champ.
const T_DEBITEUR_PART = 220; // le debiteur se met en marche, courbe, peu apres la soumission
// ⭐ timings calcules (pas devines) via walkDistance : a la cadence lente du debiteur (0.62
// cycle/s, swing 12deg), il lui faut ~170 frames pour parcourir les 480px qui le separent du
// bord droit du cadre (1440 -> 1920) — donc T_CREANCIER_PART = T_DEBITEUR_PART + 170. Le
// creancier, plus rapide (1.1 cycle/s, swing 18deg), sort ensuite en ~90 frames (760px, de 1160
// a 1920) — donc T_FIN = T_CREANCIER_PART + 90 + marge.
const T_CREANCIER_PART = 390; // le creancier ne repart qu'UNE FOIS le debiteur hors du cadre
const T_FIN = 500;
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

// marche du debiteur, BRISEE : cadence lente, pas de moitie moindre — quelqu'un qui traine les
// pieds, pas quelqu'un qui s'enfuit. Deliberement plus lente que celle du creancier (WALK_CREANCIER).
const WALK_DEBITEUR: WalkParams = { swingMax: 12, bobAmp: 1.6, lean: 0, hipDrop: 0, armSwing: 10 };
const DEBITEUR_CADENCE = 0.62; // cycles/s — lent, traine les pieds
const DEBITEUR_X_SORTIE = 1920 + 80; // sort hors-champ a droite (continue au-dela de la facade)

const Debiteur: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame / FPS;

  // le tremblement ne commence QUE quand le creancier exige (T_ARRET), pas avant : posture
  // droite/calme jusque-la, puis nervosite croissante qui accompagne l'affaissement. S'attenue
  // une fois la marche de sortie engagee (on ne tremble pas en marchant, cf. registre : gestes du
  // CORPS ne se cumulent pas sans intention — ici l'intention change, de subir a partir).
  const envelopeTremble = interpolate(
    frame,
    [T_ARRET, T_ARRET + 40, T_SOUMISSION, T_DEBITEUR_PART],
    [0, 1, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const tremble = bruitDeterministe(t * 3.4, 2.2) * envelopeTremble;

  // inclinaison de tete + voute (soumission) : demarre a T_ARRET (le bras qui se leve), PLEINEMENT
  // installee a T_SOUMISSION, et RESTE (le debiteur part dans cet etat — brique n7, heritage de
  // pose : la marche de sortie herite de la voute, elle ne repart pas d'une pose neutre).
  const soumission = spring({
    frame: frame - T_ARRET,
    fps: FPS,
    durationInFrames: T_SOUMISSION - T_ARRET,
    config: { damping: 200, mass: 1.4 },
  });
  const headTuck = interpolate(soumission, [0, 1], [0, 0.62], { extrapolateRight: "clamp" });
  const torsoVoute = interpolate(soumission, [0, 1], [0, 14], { extrapolateRight: "clamp" });

  // -- MARCHE DE SORTIE (T_DEBITEUR_PART -> hors champ), verrou pas/distance (brique n1) --
  const enMarche = frame >= T_DEBITEUR_PART;
  const marcheFrame = Math.max(0, frame - T_DEBITEUR_PART);
  const tMarche = marcheFrame / FPS;
  const cyclesMarche = tMarche * DEBITEUR_CADENCE;
  const dMarche = walkDistance(cyclesMarche * 2, WALK_DEBITEUR.swingMax, PERSO_SCALE);
  const x = enMarche ? Math.min(DEBITEUR_X + dMarche, DEBITEUR_X_SORTIE) : DEBITEUR_X;
  const phase = enMarche ? cyclesMarche % 1 : 0.25;

  const pose: Pose = enMarche
    ? { torsoDeg: torsoVoute, headTuck } // en marche : SEULE la voute/tete est manuelle, les
                                          // jambes/bras redeviennent le cycle naturel de <Figure>
                                          // (sinon la marche ne peut pas s'exprimer, cf. socle)
    : {
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
          x={x / FAIBLE_STROKE_SCALE}
          y={SOL_Y / FAIBLE_STROKE_SCALE}
          phase={phase}
          p={WALK_DEBITEUR}
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

  // -- DEPART, CONTINUE tout droit vers la droite (T_CREANCIER_PART -> T_FIN) --
  // ⭐ retour Aziz (2026-08-04) : reculer pour sortir se lit mal ("a reculons"). Le socle ne sait
  // marcher que vers +x (profil unique) — la bonne logique n'est donc pas de rebrousser chemin,
  // mais de CONTINUER dans le meme sens. Et surtout : il ne repart QU'APRES que le debiteur soit
  // sorti (T_CREANCIER_PART > T_DEBITEUR_PART + duree de sa sortie) — l'un puis l'autre, jamais
  // ensemble, donc aucune collision/fusion des deux silhouettes possible.
  const departFrame = Math.max(0, frame - T_CREANCIER_PART);
  const tDepart = departFrame / FPS;
  const cyclesDepart = tDepart * CADENCE;
  const dDepart = walkDistance(cyclesDepart * 2, WALK_CREANCIER.swingMax, PERSO_SCALE);
  const xDepart = CREANCIER_X_ARRET + dDepart; // continue vers la droite, hors champ
  const departPhase = cyclesDepart % 1;
  const enDepart = frame >= T_CREANCIER_PART;

  const finalX = enDepart ? xDepart : x;

  // pose debout tenue entre T_ARRET et T_DEPART : bras qui monte vers l'horizontale (exiger,
  // paume ouverte). Verifie dans le socle (StickFigure.tsx ~L440-456) : arm1 est dessine EN
  // DERNIER (juste avant la tete), opacite pleine -> c'est le bras AVANT/visible. arm2 est
  // dessine en premier, opacite 0.75 -> le bras ARRIERE. C'est donc arm1 qui doit se lever
  // (retour Aziz : le bras leve doit se voir clairement, pas rester en retrait derriere le corps).
  const armDegExige = interpolate(armReach, [0, 1], [4, -78]);

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
