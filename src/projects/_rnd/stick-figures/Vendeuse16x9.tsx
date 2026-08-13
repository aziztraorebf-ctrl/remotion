import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import {
  DEFS,
  PLAN_CIEL,
  PLAN_VILLE,
  PLAN_ETALS_FOND,
  PLAN_ETALS,
  PLAN_SOL,
  PLAN_AVANT,
} from "./marcheNuitGroupsB";
import {
  Figure,
  rad,
  LEG_LENGTH,
  TORSO_LENGTH,
  HIP_Y_STANDING,
  walkPhaseFromSteps,
} from "../../_shared/stick-figure-svg/StickFigure";
import { RoleTenue, CARNATIONS, bodyPoints } from "../../_shared/stick-figure-svg/identite/Roles";
import { T, VENDEUSE_FRAMES, FPS, AMORCE } from "./vendeuseTiming";

/**
 * "LA VENDEUSE" — UN SEUL PERSONNAGE HEROS, 4 GESTES AMPLES (2026-07-28)
 *
 * ⭐ REFONTE APRES LE VERDICT D'AZIZ SUR `MarcheInformel16x9` — 4 constats, tous suivis :
 *
 * 1. ⛔ "l'apparition dessinee des personnages, ca ne semblait pas vraiment marcher, c'est plus
 *    problematique qu'autre chose" -> RETIREE. Analyse : le trace progressif est une GRAMMAIRE
 *    ENTIERE (whiteboard animation : tout est au trait, la main qui dessine est le sujet). Un
 *    trace isole sur un personnage pose dans un decor en APLATS fait cohabiter 2 grammaires
 *    contradictoires — le perso se lit comme un brouillon sur une image finie.
 *    Mot d'Aziz : "quand on dessine une scene, on la dessine VRAIMENT, les traits qui
 *    apparaissent". Exact — et c'est tout ou rien.
 *
 * 2. ⛔ LE BUG QU'AZIZ A TROUVE ET QUE MA VERIF PAR CALCUL A MANQUE : "l'homme est immobile, il
 *    glisse, la femme continue a marcher, elle le pousse". Cause : je faisais s'arreter Lui a
 *    168px D'ELLE — une cible MOBILE, puisqu'elle avancait encore. Il etait donc immobile ET
 *    pousse a chaque frame. Mon calcul validait "l'ecart de 168px tient jusqu'a la fin" sans voir
 *    que le MAINTENIR etait precisement le bug. Le calcul confirme ce qu'on lui demande.
 *    -> ⭐ REGLE : un point d'arret est une position du MONDE, jamais une distance a un mobile.
 *    Ici : un seul heros, donc plus aucune coordination possible = la classe de bug disparait.
 *
 * 3. ⛔ "le declencheur ne semblait pas envoyer grand chose" -> les 4 declencheurs portent
 *    desormais des gestes du CORPS ENTIER (marcher / s'asseoir / se relever + heler / repartir),
 *    ~5s chacun. Un declencheur ne vaut que par l'ampleur de ce qu'il declenche.
 *
 * 4. ⭐ "un ou deux personnages heros + un decor vivant avec des elements precis en arriere-plan"
 *    -> c'est la HIERARCHIE DE L'ATTENTION (staging, Thomas & Johnston) : une seule idee a la
 *    fois. Le decor vit par CYCLES D'AMBIANCE desynchronises (lanternes, silhouette lointaine) —
 *    des boucles qu'on ne remarque que si elles s'arretent. Le heros porte toute la narration.
 *
 * ⛔ Gestes du CORPS uniquement (marcher/s'asseoir/heler) — aucun geste d'OBJET : c'est de la
 * manipulation d'objet que viennent TOUS les bugs connus non corriges du registre.
 */

const W = 1920;
const H = 1080;

const SOL_HEROS = 952;
const scaleAt = (solY: number) => {
  const t = Math.max(0, Math.min(1, (solY - 700) / (1000 - 700)));
  return 1.35 + (2.3 - 1.35) * t;
};
const SCALE_HEROS = scaleAt(SOL_HEROS);

const smooth = (t: number) => t * t * (3 - 2 * t);
const clampI = (f: number, i: [number, number], o: [number, number]) =>
  interpolate(f, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ============================================================================================
// LA CAISSE — son siege. ⭐ Mot d'Aziz : "dans une vraie scene, dessiner un VRAI banc (ou autre
// mobilier reel) plutot que le banc-trait des protos". Une caisse de marchandise a sa place dans
// un marche ET la sureleve, ce qui rend l'assise lisible de loin.
// ============================================================================================
const CAISSE_X = 980;
// ⛔ HAUTEUR RESOLUE PAR BALAYAGE, PAS CHOISIE — et 2 erreurs successives attrapees par le calcul :
//   1er jet (46) : les pieds pendaient 29px au-dessus du sol, le perso lisait AVACHI EN TRAVERS de
//     la caisse, penche a ~40deg (vu au rendu). Cause : j'avais repris les angles de `P_ASSIS`
//     (GestesLocomotion) qui decrit une assise AU SOL (hipY -5), en me contentant de remonter hipY.
//   2e jet (34) : je croyais qu'une jambe pliee couvrait 2 x LEG_LENGTH. FAUX — le socle plie la
//     jambe en 2 os de LEG_LENGTH/2 CHACUN (StickFigure.tsx:352-363), donc son extension totale
//     reste LEG_LENGTH. Les pieds pendaient encore 17px, et les 2 jambes se confondaient (2.5px).
// ⭐ Resolu par balayage sur (hauteur, cuisse, flexion) sous 2 contraintes : pied a y=0 ET pied
// AVANCE devant le bassin. Seules les hauteurs <= 24 admettent une solution -> c'est un TABOURET
// BAS, ce qui est juste pour un etal de marche.
const CAISSE_H = 24;
const CAISSE_W = 72;

const Caisse: React.FC<{ x: number; solY: number; scale: number }> = ({ x, solY, scale }) => (
  <g transform={`translate(${x} ${solY}) scale(${scale})`}>
    {/* plateau */}
    <rect x={-CAISSE_W / 2} y={-CAISSE_H} width={CAISSE_W} height={CAISSE_H * 0.42}
          fill="#7a5530" stroke="#3d2a17" strokeWidth={2.2} rx={1.5} />
    {/* pieds : un tabouret bas, pas un bloc plein — plus lisible a cette hauteur */}
    <rect x={-CAISSE_W / 2 + 4} y={-CAISSE_H * 0.58} width={7} height={CAISSE_H * 0.58}
          fill="#5c3f22" stroke="#3d2a17" strokeWidth={1.8} />
    <rect x={CAISSE_W / 2 - 11} y={-CAISSE_H * 0.58} width={7} height={CAISSE_H * 0.58}
          fill="#5c3f22" stroke="#3d2a17" strokeWidth={1.8} />
    {/* barre d'entretoise */}
    <line x1={-CAISSE_W / 2 + 7} y1={-CAISSE_H * 0.2} x2={CAISSE_W / 2 - 7} y2={-CAISSE_H * 0.2}
          stroke="#3d2a17" strokeWidth={1.8} />
  </g>
);

// ============================================================================================
// LES CYCLES D'AMBIANCE — le decor VIT, sans jamais demander l'attention
// ============================================================================================
// ⭐ Principe repris de l'animation limitee : des boucles COURTES et DESYNCHRONISEES (periodes en
// rapports irrationnels, donc elles ne retombent jamais ensemble). On ne les remarque pas — c'est
// leur fonction. On remarquerait seulement leur ARRET.
// ⛔ Aucune n'est calee sur la voix : ce qui est cale sur la voix, c'est le HEROS et lui seul.
const PHI = 1.618033988;
const E = 2.718281828;

/** Les lanternes des etals respirent, chacune a son rythme. */
const LanterneGlow: React.FC<{ frame: number }> = ({ frame }) => {
  const points: [number, number, number][] = [
    [240, 636, 0], [760, 630, PHI], [1054, 632, E], [1496, 640, PHI * 2], [1900, 646, E * 1.4],
  ];
  return (
    <g>
      {points.map(([x, y, ph], i) => {
        const k = 0.5 + 0.5 * Math.sin(frame / (71 + i * 13) + ph * 3);
        return (
          <circle key={i} cx={x} cy={y} r={26 + k * 9}
                  fill="#ffd98a" opacity={0.05 + k * 0.07} />
        );
      })}
    </g>
  );
};

/** Une silhouette lointaine traverse, tres lentement, tres pale. Elle dit "le monde continue". */
const PassantLointain: React.FC<{ frame: number }> = ({ frame }) => {
  const SOL = 742;
  const s = scaleAt(SOL) * 0.82;
  const swing = 17;
  const pasL = 2 * LEG_LENGTH * Math.sin(rad(swing)) * s;
  const pas = frame * (0.52 / FPS);
  const span = 2500;
  const x = ((pas * pasL - 300) % span + span) % span - 300;
  return (
    <g opacity={0.3} transform={`translate(${x} ${SOL}) scale(${s})`}>
      <Figure x={0} y={0} phase={walkPhaseFromSteps(pas)}
              p={{ swingMax: swing, bobAmp: 2, armSwing: 20, lean: 2 }}
              color="#4a5878" />
    </g>
  );
};

// ============================================================================================
// ⭐ LE HEROS — 4 GESTES AMPLES, un par declencheur
// ============================================================================================
// ⛔ CALIBRE PAR LE CALCUL, PAS A L'OEIL : a vitesse humaine (~1 pas/s), traverser tout l'ecran
// prendrait ~17 s — plus que la narration entiere. Elle n'a donc PAS a traverser : elle entre par
// la gauche du cadre, a quelques pas de sa caisse. C'est assez pour lire "elle arrive", et ca
// garde une allure credible (le contraire — la faire courir — detruirait le geste).
const HERO = {
  carnation: 2,
  role: "commercante" as const,
  xEntree: 625,
  swing: 19,
  vit: 1.0,
};

/**
 * LA POSE ASSISE SUR UN SIEGE — DERIVEE PAR LE CALCUL, pas recopiee.
 *
 * ⛔ 1er jet RATE (vu au rendu) : j'avais repris tels quels les angles de `P_ASSIS`
 * (GestesLocomotion16x9 § GESTE 3) en me contentant de remonter `hipY`. Resultat : un personnage
 * AVACHI EN TRAVERS de la caisse, penche a ~40deg, la tete au niveau du plateau.
 * Cause : `P_ASSIS` decrit une assise AU SOL (hipY -5, cuisses ouvertes au-dela de 90deg pour
 * compenser le bassin bas). Changer la hauteur du bassin sans refaire les jambes casse tout.
 *
 * ⭐ ANGLES RESOLUS PAR BALAYAGE avec la formule EXACTE du socle (StickFigure.tsx:352-363), sous
 * 2 contraintes verifiees : (a) pied POSE au sol (|y| < 1px) et (b) pied AVANCE devant le bassin.
 * Resultat mesure — jambe1 : pied (21.8, -0.63) · jambe2 : pied (15.6, +0.97) · ecart entre les
 * 2 pieds = 6.4px (⛔ au-dessus du seuil de pose degeneree ou les jambes se confondent en 1 trait).
 */
const POSE_ASSISE = {
  hipY: -CAISSE_H,
  torsoDeg: 6,               // buste presque droit : elle est assise, pas effondree
  leg1Deg: 63, leg2Deg: 62,  // valeurs MESUREES, ne pas ajuster a l'oeil
  leg1Knee: -40, leg2Knee: -60,
  arm1Deg: 16, arm2Deg: 10,  // bras qui pendent le long du corps, au repos
  arm1Len: 28, arm2Len: 28,
};

const POSE_DEBOUT = {
  hipY: HIP_Y_STANDING,
  torsoDeg: 4,
  leg1Deg: 6, leg2Deg: -7,
  leg1Knee: 0, leg2Knee: 0,
  arm1Deg: 12, arm2Deg: -10,
  arm1Len: 28, arm2Len: 28,
};

type PoseK = typeof POSE_DEBOUT;
const mixPose = (A: PoseK, B: PoseK, u: number): PoseK => ({
  hipY: A.hipY + (B.hipY - A.hipY) * u,
  torsoDeg: A.torsoDeg + (B.torsoDeg - A.torsoDeg) * u,
  leg1Deg: A.leg1Deg + (B.leg1Deg - A.leg1Deg) * u,
  leg2Deg: A.leg2Deg + (B.leg2Deg - A.leg2Deg) * u,
  leg1Knee: A.leg1Knee + (B.leg1Knee - A.leg1Knee) * u,
  leg2Knee: A.leg2Knee + (B.leg2Knee - A.leg2Knee) * u,
  arm1Deg: A.arm1Deg + (B.arm1Deg - A.arm1Deg) * u,
  arm2Deg: A.arm2Deg + (B.arm2Deg - A.arm2Deg) * u,
  arm1Len: A.arm1Len + (B.arm1Len - A.arm1Len) * u,
  arm2Len: A.arm2Len + (B.arm2Len - A.arm2Len) * u,
});

/** Le nombre de pas necessaires pour aller de l'entree jusqu'a la caisse. */
const PAS_L = 2 * LEG_LENGTH * Math.sin(rad(HERO.swing)) * SCALE_HEROS;
const X_CAISSE_ARRET = CAISSE_X - 6; // ⭐ position du MONDE, jamais une distance a un mobile

export const Vendeuse16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------------------------------------
  // GESTE 1 — ELLE MARCHE (de l'entree jusqu'a sa caisse), sur "elle ARRIVE"
  // ---------------------------------------------------------------------------------------
  // ⛔ VERROU PAS/DISTANCE : le deplacement DERIVE du nombre de pas. Et elle s'arrete a une
  // ABSCISSE FIXE du decor — c'est la correction directe du bug de la scene precedente.
  // ⭐ Elle marche DES LA FRAME 0, avant que la voix ne commence (cf. AMORCE dans le timing) :
  // "elle arrive avant tout le monde" se joue en amont du mot, il le PONCTUE.
  // ⭐ DECELERATION PAR LA CADENCE (et non par l'amplitude du pas) : on veut que la distance
  // restante s'amortisse en douceur. On l'ecrit directement comme une trajectoire — la distance
  // parcourue suit un ease-out sur les derniers pas — plutot que d'integrer une vitesse frame par
  // frame (une recurrence casserait le rendu Remotion, qui recalcule chaque frame independamment).
  const DIST_TOTALE = X_CAISSE_ARRET - HERO.xEntree;
  const FREINAGE_D = PAS_L * 1.6;                    // longueur sur laquelle elle ralentit (calibree)
  const dLineaire = frame * (HERO.vit / FPS) * PAS_L; // distance si allure constante
  const dSeuil = DIST_TOTALE - FREINAGE_D;            // ou commence le freinage
  // ⚠️ Le freinage doit se TERMINER, pas tendre asymptotiquement vers la cible : un ease-out non
  // borne ne touche jamais l'arrivee (mesure : elle n'arrivait jamais, donc ne s'asseyait jamais).
  // On borne donc u a [0,1] : a u=1 le freinage est fini et la distance vaut exactement DIST_TOTALE.
  const uFrein = Math.max(0, Math.min(1, (dLineaire - dSeuil) / (FREINAGE_D * 2)));
  const parcouru =
    dLineaire <= dSeuil
      ? dLineaire
      // ease-out quadratique borne : vitesse continue a l'entree, nulle et ATTEINTE a la sortie.
      : dSeuil + FREINAGE_D * (1 - Math.pow(1 - uFrein, 2));

  const xLibre = HERO.xEntree + Math.min(parcouru, DIST_TOTALE);
  const arriveeCaisse = parcouru >= DIST_TOTALE - 0.5;
  const x = arriveeCaisse ? X_CAISSE_ARRET : xLibre;

  // ⛔⛔ GLISSADE — BUG VU PAR AZIZ ("elle glisse, elle ne marche pas, pas de vrai mouvement des
  // pieds"), CONFIRME PAR LA MESURE : de f180 a f220, les jambes balayaient 12px pendant que le
  // corps en parcourait 47.
  // CAUSE : mon freinage ECRASAIT `swingMax` (jusqu'a 0.25 x 19deg = 4.8deg, tres sous le plancher
  // de 16deg) tout en gardant PAS_L calcule sur les 19deg d'origine. Le verrou pas/distance etait
  // donc ROMPU : le nombre de pas ne correspondait plus a la distance dessinee par les jambes.
  // ⛔ C'est exactement l'anti-pattern que le socle documente : "NE JAMAIS implementer un plancher
  // sur le swing (ecrase l'oscillation -> glissement, bug vecu et corrige)".
  //
  // ⭐ FIX : le swing reste CONSTANT (l'amplitude du pas ne change pas quand on ralentit — dans la
  // vraie vie on fait des pas plus RARES, pas des pas rabougris). C'est la CADENCE qui ralentit.
  // Le verrou est donc integralement respecte : x derive toujours de pas x PAS_L, avec le meme
  // PAS_L que celui que les jambes dessinent.
  const resteAvantCaisse = X_CAISSE_ARRET - xLibre;
  const kFrein = Math.max(0, Math.min(1, resteAvantCaisse / (PAS_L * 2.5)));
  const amorti = smooth(kFrein);

  // ⭐ LA CADENCE ralentit : on integre une vitesse decroissante au lieu d'un temps lineaire.
  // (analytique : l'aire sous la courbe de vitesse ; pas de recurrence par frame)
  const pas = (x - HERO.xEntree) / PAS_L;

  // ---------------------------------------------------------------------------------------
  // GESTE 2 — ELLE S'ASSIED, sur "elle ATTEND"
  // ---------------------------------------------------------------------------------------
  // ⛔ POSES-CLES, jamais des springs accumules sur les memes angles (ils derivent et ne
  // retombent jamais sur une silhouette propre — brique 4 du socle). Un seul spring pilote un
  // parametre de MELANGE u entre 2 poses verifiees : a tout instant on est sur le segment entre
  // 2 silhouettes correctes, donc la derive est impossible.
  const uAssise = spring({
    frame: frame - T.attend,
    fps,
    config: { mass: 1.15, damping: 16, stiffness: 98 },
  });

  // ---------------------------------------------------------------------------------------
  // GESTE 3 — ELLE SE RELEVE ET HELE, sur "elle VEND"
  // ---------------------------------------------------------------------------------------
  const uDebout = spring({
    frame: frame - T.vend,
    fps,
    config: { mass: 1, damping: 15, stiffness: 110 },
  });
  // le bras se leve APRES que le corps soit remonte (sinon elle hele assise = illisible)
  const heleK = clampI(frame, [T.vend + 26, T.vend + 46], [0, 1]);
  const heleCycle = Math.sin((frame - T.vend) / 9) * heleK;

  // ---------------------------------------------------------------------------------------
  // GESTE 4 — ELLE REPART, sur "ce marche ne FERME jamais"
  // ---------------------------------------------------------------------------------------
  const pasDepart = Math.max(0, frame - T.ferme) * (HERO.vit * 0.82 / FPS);
  const xFinal = x + pasDepart * PAS_L;
  const partie = frame >= T.ferme;

  // ---------------------------------------------------------------------------------------
  // LA POSE RESULTANTE — une seule chaine, jamais 2 sources concurrentes
  // ---------------------------------------------------------------------------------------
  // assise = 0 avant "attend", monte a 1, redescend a 0 sur "vend"
  const assise = Math.max(0, uAssise - uDebout);
  // ⛔⛔ LA VRAIE CAUSE DE LA GLISSADE (bug vu par Aziz : "elle glisse, elle ne marche pas, il n'y
  // a pas de vrai mouvement des pieds"). Ma 1re hypothese (le swing ecrase par le freinage) etait
  // un defaut REEL et corrige, mais MINEUR — il ne touchait que les 40 dernieres frames.
  // Le vrai bug : `enMarche` exigeait `frame >= T.arrive`. Or T.arrive vaut 218 (le mot est
  // PRONONCE a la fin de son entree, c'est tout l'objet de l'amorce), alors qu'elle MARCHE DEPUIS
  // LA FRAME 0. Pendant les 7 premieres secondes — precisement les "4 a 5 premieres secondes"
  // signalees par Aziz — le corps avancait avec une pose STATIQUE : jambes figees en 2 traits
  // verticaux, aucun ciseau. Verifie sur 4 frames CONSECUTIVES (150/155/160/165) : la silhouette
  // des jambes etait rigoureusement identique pendant que x avancait.
  // ⭐ Elle marche des qu'elle n'est pas arrivee, point — l'entree ne depend d'aucun mot.
  // ⚠️ LECON : ne jamais conditionner une ANIMATION a un declencheur de VOIX quand le mouvement
  // commence avant lui. Le declencheur ponctue, il n'autorise pas.
  const enMarche = !arriveeCaisse || partie;
  const poseCourante = mixPose(POSE_DEBOUT, POSE_ASSISE, assise);

  // le bras qui hele s'ajoute PAR-DESSUS la pose, seulement debout et avant le depart
  const bras2 = partie
    ? poseCourante.arm2Deg
    : poseCourante.arm2Deg + heleK * (128 + heleCycle * 18);

  // ⛔ BUG TROUVE EN REGARDANT LE RENDU (elle semblait etre DE DOS, vetement plaque sur le corps) :
  // `bodyPoints()` ne connait QUE (phase, WalkParams, torsoOverride) — il IGNORE `hipY`. Il calcule
  // donc toujours une hanche DEBOUT (HIP_Y_STANDING). Assise, le corps descend mais la tenue
  // restait a hauteur debout : elle recouvrait le buste au mauvais endroit et masquait la
  // silhouette, ce qui se lisait comme un dos.
  // ⭐ FIX : on construit les BodyPoints A LA MAIN pour la pose assise, avec les MEMES formules
  // que bodyPoints() mais en partant du hipY REEL. RoleTenue ne prend que des BodyPoints, il est
  // agnostique a la pose — c'est a l'appelant de les fournir justes.
  // ⛔⛔ VETEMENT QUI REBONDIT — BUG VU PAR AZIZ ("le petit trapeze qui representait sa poitrine,
  // son vetement rose, bouge en meme temps... les vetements ne devraient pas bouger en meme temps
  // que le personnage").
  // CAUSE : `bodyPoints()` applique le BOB de marche a `hy`, et TOUS les vetements sont ancres sur
  // ce `hy` (pagne, camisole, foulard). Ils montaient/descendaient donc en bloc, a la MEME
  // amplitude que le corps — ce qui les fait lire comme une plaque rigide collee au personnage.
  // ⭐ FIX : le tissu a de l'INERTIE. Il ne peut pas etre totalement fixe (il est porte), mais il
  // ne suit pas le corps au pixel : il repond AMORTI et EN RETARD. On lui passe donc un bob reduit
  // et dephase d'un quart de cycle, au lieu du bob brut du squelette.
  // ⚠️ On ne touche PAS au socle : c'est l'appelant qui fournit les BodyPoints, RoleTenue les prend
  // tels quels. Aucune scene existante n'est affectee.
  const BOB_VETEMENT = 0.35;  // le tissu encaisse l'essentiel du rebond
  const RETARD_TISSU = 0.25;  // quart de cycle : le vetement retombe APRES le corps
  const phaseCorps = enMarche ? walkPhaseFromSteps(partie ? pas + pasDepart : pas) : 0;
  const bpMarche = bodyPoints(
    (phaseCorps + RETARD_TISSU) % 1,
    enMarche ? { swingMax: HERO.swing, bobAmp: 2.5 * BOB_VETEMENT, armSwing: 21 } : undefined,
    poseCourante.torsoDeg
  );
  const bpPose = (() => {
    const hy = poseCourante.hipY;
    const t = poseCourante.torsoDeg;
    const sx = Math.sin(rad(t)) * TORSO_LENGTH;
    const sy = hy - Math.cos(rad(t)) * TORSO_LENGTH;
    return {
      hx: 0, hy, sx, sy,
      headCx: sx + Math.sin(rad(t)) * 12 + 3 * Math.cos(rad(t)),
      headCy: sy - Math.cos(rad(t)) * 12 + 3 * Math.sin(rad(t)),
      torso: t,
    };
  })();
  // pendant l'assise (et la transition), la tenue suit la pose reelle ; en marche, elle suit le bob
  const bp = assise > 0.02 ? bpPose : bpMarche;

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a2238" }}>
      {/* la voix commence APRES l'amorce : elle est deja en train de marcher quand ca parle */}
      <Sequence from={AMORCE}>
        <Audio src={staticFile("_rnd/stick-figures/vendeuse/narration.mp3")} />
      </Sequence>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />

        <g dangerouslySetInnerHTML={{ __html: PLAN_CIEL }} />
        <g dangerouslySetInnerHTML={{ __html: PLAN_VILLE }} />
        <g dangerouslySetInnerHTML={{ __html: PLAN_ETALS_FOND }} />

        {/* ⭐ CYCLE D'AMBIANCE 1 — une silhouette lointaine traverse (le monde continue) */}
        <PassantLointain frame={frame} />

        <g dangerouslySetInnerHTML={{ __html: PLAN_ETALS }} />

        {/* ⭐ CYCLE D'AMBIANCE 2 — les lanternes respirent */}
        <LanterneGlow frame={frame} />

        <g dangerouslySetInnerHTML={{ __html: PLAN_SOL }} />

        {/* sa caisse : elle est la AVANT elle (c'est son emplacement, il l'attend) */}
        <Caisse x={CAISSE_X} solY={SOL_HEROS} scale={SCALE_HEROS} />

        {/* ===== ⭐ LE HEROS — seul au premier plan, il porte toute la narration =====
            Visible des la frame 0 : elle entre pendant l'amorce, avant la voix. */}
        {(
          <g transform={`translate(${partie ? xFinal : x} ${SOL_HEROS}) scale(${SCALE_HEROS})`}>
            {/* ORDRE DE RENDU (regle gravee, bug vecu "le corps traverse le vetement") :
                corps -> VETEMENT -> tete. Le bras avant est deja gere par le socle. */}
            <Figure
              x={0} y={0}
              phase={enMarche ? walkPhaseFromSteps(partie ? pas + pasDepart : pas) : 0}
              p={enMarche
                ? { swingMax: HERO.swing, bobAmp: 2.5, armSwing: 21 } // ⛔ swing CONSTANT (cf. glissade)
                : { swingMax: 0, bobAmp: 0, armSwing: 0 }}
              pose={enMarche && assise < 0.02
                ? { torsoDeg: poseCourante.torsoDeg }
                : {
                    hipY: poseCourante.hipY,
                    torsoDeg: poseCourante.torsoDeg,
                    leg1Deg: poseCourante.leg1Deg, leg2Deg: poseCourante.leg2Deg,
                    leg1Knee: poseCourante.leg1Knee, leg2Knee: poseCourante.leg2Knee,
                    arm1Deg: poseCourante.arm1Deg, arm2Deg: bras2,
                    arm1Len: poseCourante.arm1Len, arm2Len: poseCourante.arm2Len,
                  }}
              color={CARNATIONS[HERO.carnation].couleur}
            />
            <RoleTenue role={HERO.role} bp={bp} />
          </g>
        )}

        <g dangerouslySetInnerHTML={{ __html: PLAN_AVANT }} />
      </svg>
    </AbsoluteFill>
  );
};

export { VENDEUSE_FRAMES };
export default Vendeuse16x9;
