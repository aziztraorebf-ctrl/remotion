import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  VILLAGE_DEFS,
  PLAN_CIEL,
  PLAN_OCEAN,
  PLAN_LOINTAIN,
  PLAN_VILLAGE,
  PLAN_SABLE,
  PLAN_PIROGUES,
  PLAN_AVANT,
  SUN_CX,
  SUN_GLOW_CY,
  SUN_CY,
  OCEAN_REFLECTS,
  BIRDS,
  PALM_TREES,
  WINDOWS,
} from "../fable-svg/villageParallaxeGroups";
import {
  Figure,
  Membre,
  solveArm,
  rad,
  ENCRE,
  LEG_LENGTH,
  TORSO_LENGTH,
  HIP_Y_STANDING,
  BRAS_L,
  AVBRAS_L,
} from "../../_shared/stick-figure-svg/StickFigure";

// ---------------------------------------------------------------------------
// LA PREMIERE VRAIE SCENE NARRATIVE STICK FIGURE — "LA DUREE"
//
// Sujet : un pecheur hale son filet, de l'aube a la nuit. Le geste ne change
// jamais ; c'est SON CORPS qui dit le temps qui passe (il se voute, ses appuis
// se resserrent, sa cadence tombe, ses pauses s'allongent).
//
// METHODE (decidee par Aziz) : REUTILISER un decor valide plutot que d'en
// dessiner un neuf, pour n'isoler qu'UNE inconnue — le personnage vit-il dans
// une scene ? Le decor est le village parallaxe (villageParallaxeGroups), repris
// PLAN PAR PLAN sans modifier un seul path. Le pecheur s'intercale entre le plan
// PIROGUES et le plan AVANT (le filet du premier plan devient l'objet de son
// travail) : c'est la profondeur du decor qui l'integre, pas un calque a part.
//
// CRITERE DE REUSSITE (starter) : la scene doit RACONTER — un AVANT et un APRES
// lisibles sans le son, et un personnage present pour une raison narrative.
//
// ⛔ Regles du registre respectees : profil uniquement · aucun visage · socle
// StickFigure.tsx IMPORTE (jamais recopie) · frame-driven pur (zero CSS/timeout).
// ---------------------------------------------------------------------------

export const PECHEUR_DUREE_FRAMES = 900; // 30s @ 30fps

const W = 1920;
const H = 1080;
const DUR = PECHEUR_DUREE_FRAMES;

const Inject: React.FC<{ html: string; transform?: string; opacity?: number }> = ({
  html,
  transform,
  opacity = 1,
}) => <g transform={transform} opacity={opacity} dangerouslySetInnerHTML={{ __html: html }} />;

// ===========================================================================
// LA FATIGUE — la variable narrative unique. 0 = aube, 1 = nuit.
// Elle n'est pas lineaire : on tient le matin (montee lente), on lache dans le
// dernier tiers (montee marquee). Meme forme de courbe que la tombee de nuit du
// decor, pour que le corps et le ciel racontent le MEME temps.
// ===========================================================================
const fatigueAt = (frame: number) =>
  interpolate(frame, [0, DUR * 0.3, DUR * 0.62, DUR], [0, 0.16, 0.52, 1], {
    extrapolateRight: "clamp",
  });

// ===========================================================================
// LE CYCLE DE HALAGE — l'horloge du geste.
// Le pecheur repete : SAISIR (bras tendus vers le filet) -> TIRER (il ramene en
// se calant sur ses jambes) -> RELACHER (il rend du mou et repart chercher).
// La duree d'un cycle s'ALLONGE avec la fatigue : c'est le premier signal du
// temps qui passe, avant meme la posture. Et la pause entre deux cycles grandit.
//
// On integre la cadence frame par frame (somme discrete) plutot que d'inverser
// une formule : la cadence varie continument, donc le nombre de cycles ecoules
// n'a pas de forme fermee simple. Cache par frame pour rester O(1) amorti.
// ===========================================================================
const CYCLE_F0 = 46;  // duree d'un cycle a l'aube (frames)
const CYCLE_F1 = 88;  // duree d'un cycle a la nuit — presque le double

const cycleDurationAt = (f: number) => {
  const fat = fatigueAt(f);
  return CYCLE_F0 + (CYCLE_F1 - CYCLE_F0) * fat;
};

// progression cumulee en "nombre de cycles ecoules" a la frame f
const cyclesElapsed = (() => {
  const cache: number[] = [0];
  return (f: number): number => {
    for (let i = cache.length; i <= f; i++) {
      cache[i] = cache[i - 1] + 1 / cycleDurationAt(i - 1);
    }
    return cache[Math.max(0, Math.min(f, cache.length - 1))];
  };
})();

// ===========================================================================
// LA POSE DE HALAGE — on part de L'OBJET, pas des bras.
// ⛔ Regle du registre (INDEX § "MANIPULER UN OBJET") : decider la trajectoire de
// l'objet -> en deduire la position des mains -> resoudre les bras en IK. Animer
// les bras en esperant que le filet suive fait lacher l'outil.
// Ici l'objet est la CORDE du filet : on decide ou est la prise (gripX/gripY
// dans le repere local du perso), les deux mains s'y posent, les bras suivent.
// ===========================================================================
type Halage = {
  gripX: number;      // prise (repere local perso : x vers l'avant = vers le filet)
  gripY: number;
  torsoDeg: number;   // buste : negatif = incline en arriere (il contrepese la traction)
  hipY: number;
  legFront: number;   // jambe avant (calee vers le filet)
  legBack: number;    // jambe arriere (l'appui qui pousse)
  kneeFront: number;
  kneeBack: number;   // flexion de la jambe arriere (elle pousse)
  ropePull: number;   // 0..1 : combien de corde est deja ramenee (pour le mou du filet)
};

// Le personnage regarde vers la DROITE (le filet est a droite). L'axe +x local
// est donc le sens "vers le filet".
const halagePose = (u: number, fat: number): Halage => {
  // u dans [0,1[ : ou on en est dans le cycle.
  //
  // ⚠️ 4e PIEGE VECU (trouve par calcul, le plus structurel) : une premiere version
  // decoupait le cycle en SAISIR -> TIRER -> RELACHER. Mesure : phase(0.999)=0.000
  // mais phase(0)=1.000, soit un saut de 1.0 a CHAQUE boucle (18px de main). Cause
  // de fond, pas un reglage : "saisir" et "relacher" decrivaient LE MEME
  // mouvement (bras qui se detend vers le filet), donc le cycle relachait DEUX
  // fois et ne tendait qu'une seule. Un halage n'a que 2 temps.
  //
  // Decoupage correct, et la boucle se ferme d'elle-meme :
  //   0 -> PULL_END : TIRER (phase 0 -> 1, il ramene la corde contre lui)
  //   PULL_END -> 1 : RENDRE LE MOU + repos (phase 1 -> 0, il repart chercher loin)
  // A u=0 comme a u=1, phase=0 : le bras est tendu vers le filet. Continu.
  const PULL_END = 0.52;

  // amplitude du geste : avec la fatigue il tire MOINS loin et ramene MOINS pres
  const amp = 1 - 0.34 * fat;

  // ⚠️ PIEGE VECU (corrige par calcul avant rendu) : la portee du bras se mesure
  // depuis L'EPAULE, pas depuis la hanche qui est l'origine du repere local. Une
  // premiere version placait la prise a REACH_MAX du repere -> tension IK mesuree
  // a 1.32 (butee a 0.97) : le bras serait reste colle a son cercle max, donc
  // glissant et tremblant a chaque frame (INDEX § brique 2). On calcule donc la
  // prise EN COORDONNEES EPAULE, puis on la ramene dans le repere local.
  // 0.80 et non 0.89 : les deux mains sont ecartees de +5/-6 autour de la prise
  // (pour qu'on lise DEUX mains sur la corde) — cet ecart s'ajoute a la portee et
  // repassait en butee a 0.89. La marge absorbe le decalage des deux prises.
  const REACH_MAX = (BRAS_L + AVBRAS_L) * 0.80;

  let phase: number;   // 0 = bras tendus vers le filet, 1 = corde ramenee contre soi
  let effort: number;  // 0..1 : combien il force a cet instant (pilote le buste/appuis)

  if (u < PULL_END) {
    // TIRER : la phase de force. Attaque franche puis fin qui s'ecrase — on ne
    // ramene pas une corde a vitesse constante, ca demarre sec et ca s'epuise.
    const t = u / PULL_END;
    phase = Math.pow(t, 0.68);
    effort = Math.sin(Math.PI * Math.min(1, t * 1.12));
  } else {
    // RENDRE LE MOU : il relache, se redresse, et son bras repart chercher plus
    // loin sur le filet. Le mouvement de retour est PLUS LENT que la traction
    // (on ne rejette pas une corde d'un coup sec), d'ou le smoothstep sur toute
    // la phase — qui garantit aussi phase=0 pile au raccord.
    // La PAUSE se cree toute seule : le cycle entier s'allonge avec la fatigue,
    // donc ce retour occupe de plus en plus de temps reel.
    const t = (u - PULL_END) / (1 - PULL_END);
    phase = 1 - t * t * (3 - 2 * t);
    effort = 0;
  }

  // --- LE CORPS D'ABORD (l'epaule est le point d'ancrage des bras) ---
  // Il ne tire pas avec les bras : il se cale en arriere et pousse sur sa jambe
  // arriere. C'est ce contrepoids qui rend le poids credible.
  // ⚠️ Avec la fatigue, le buste ne se redresse plus completement au repos : c'est
  // LA lecture principale de la duree (voute residuelle de ~9deg a la nuit).
  // ⚠️ 3e PIEGE VECU (trouve par calcul) : additionner naivement la voute et le
  // recul de traction ANNULE la fatigue au moment le plus visible du geste
  // (mesure : torso = -0.4deg a la nuit pendant l'effort, alors que la voute
  // devrait etre a ~8.7deg). Le spectateur regarde justement la traction : si la
  // posture y redevient celle du matin, la duree ne se lit plus.
  // -> Le recul se prend SUR CE QUI RESTE de redressement, jamais sur la voute :
  //    la voute est un PLANCHER que l'effort ne peut pas effacer.
  // ⛔ 6e PIEGE — TROUVE EN REGARDANT 9 FRAMES CONSECUTIVES (pas une frame isolee,
  // pas le calcul). Symptome : pendant la traction le corps semblait FIGE, seul le
  // bras se repliait -> ca se lisait "un personnage immobile qui remue le bras",
  // pas "quelqu'un qui hale un filet lourd". Mesure : l'epaule ne se deplacait que
  // de 21px a l'ecran sur tout le geste. C'est le corps qui doit porter l'effort
  // (INDEX : "le poids doit se VOIR dans la posture"), le bras ne fait que suivre.
  // -> recul du buste 13 -> 26deg, flexion de hanche 3.5 -> 9px : l'epaule parcourt
  //    desormais ~45px, l'effort est lisible.
  const voute = 9 * fat;                          // voute permanente accumulee
  const marge = Math.max(0, 26 - voute);          // amplitude de recul encore disponible
  const contre = -marge * effort * (1 - 0.25 * fat);
  const torsoDeg0 = voute + contre;
  // il flechit sous l'effort, et s'affaisse un peu plus a mesure que le jour passe
  const hipY0 = HIP_Y_STANDING + 9 * effort + 3 * fat;

  // --- LA PRISE (l'objet, deduit du corps) ---
  // Coordonnees EN REPERE EPAULE (cf. piege ci-dessus), converties ensuite.
  // phase=0 : bras tendus vers le filet, prise loin et basse (devant lui).
  // phase=1 : corde ramenee contre lui, pres du buste.
  const shx = Math.sin(rad(torsoDeg0)) * TORSO_LENGTH;
  const shy = hipY0 - Math.cos(rad(torsoDeg0)) * TORSO_LENGTH;
  // loin : bras quasi tendu vers l'avant, legerement descendant
  const farA = rad(74);  // angle depuis la verticale descendante (74deg = vers l'avant, un peu bas)
  const nearA = rad(28); // pres : bras replie, main proche du buste
  const farR = REACH_MAX * amp;
  const nearR = REACH_MAX * 0.42;
  const gxFar = shx + Math.sin(farA) * farR;
  const gyFar = shy + Math.cos(farA) * farR;
  const gxNear = shx + Math.sin(nearA) * nearR;
  const gyNear = shy + Math.cos(nearA) * nearR;
  const gripX = gxFar + (gxNear - gxFar) * phase;
  const gripY = gyFar + (gyNear - gyFar) * phase;

  // --- LES APPUIS ---
  // jambe avant calee vers le filet, arriere qui pousse. Avec la fatigue l'ecart
  // se RESSERRE (il ne s'ancre plus dans le sable, il subit la traction).
  // Le TRANSFERT DE POIDS : en tirant il se rejette sur la jambe ARRIERE (elle se
  // plante et pousse), la jambe avant se tend en butoir. C'est le detail qui
  // transforme "il remue le bras" en "il tire contre une resistance".
  // Amplitudes tripees vs la 1re version, pour la meme raison que le buste.
  const spread = 1 - 0.3 * fat;
  const legFront = 20 * spread + 14 * effort;   // la jambe avant part en butoir
  const legBack = -25 * spread - 16 * effort;   // l'arriere se plante loin derriere
  const kneeFront = 8 * effort + 4 * fat;
  const kneeBack = 14 * effort;                 // l'arriere plie pour pousser

  return {
    gripX, gripY,
    torsoDeg: torsoDeg0,
    hipY: hipY0,
    legFront, legBack, kneeFront, kneeBack,
    ropePull: phase,
  };
};

// ===========================================================================
// LE PECHEUR — rendu. Le socle dessine le corps (jambes/buste/tete), et on
// redessine les DEUX bras par-dessus en IK vers la prise commune : les deux
// mains tiennent le MEME point de corde, ce que des angles directs ne savent pas
// garantir (brique 2 du socle).
// ===========================================================================
// ⛔ 5e PIEGE — CELUI QUE LE CALCUL NE POUVAIT PAS ATTRAPER (trouve en REGARDANT
// le rendu v1, cf. INDEX : "un geste ne se juge pas sur une frame" — mais un
// PLACEMENT, si). En v1 le pecheur etait a x=980, y=946 : pile devant la grande
// pirogue. Consequences vues a l'ecran, invisibles a la mesure :
//   (1) sa silhouette claire se noyait dans la coque claire (contraste nul la nuit),
//   (2) il masquait la pirogue, l'element le plus dessine du decor,
//   (3) sa corde se confondait avec la RAME peinte sur la coque,
//   (4) le filet qu'il est cense tirer etait a l'autre bout du cadre -> il ne
//       tirait visiblement rien, il "montrait" quelque chose.
// Regle a retenir : verifier ce qu'il y a DERRIERE et DEVANT le personnage avant
// de fixer sa position — le decor reutilise a deja ses zones occupees.
//
// v2 : il descend sur le sable libre, en bas a droite, DEVANT le filet du premier
// plan. Fond = sable uni sombre (contraste garanti jour ET nuit), sa corde part
// vers le filet qui est desormais juste derriere lui.
// ⚠️ v3 : descendu encore (1012 -> 1050) apres avoir REGARDE la v2. Sa tete
// arrivait pile sur la coque claire de la grande pirogue, qui avalait la
// silhouette (meme valeur claire sur claire). Sur le sable nu du premier plan,
// le contraste tient de jour comme de nuit. C'est le meme piege qu'en v1 :
// le decor reutilise a des zones deja occupees, et c'est le RENDU qui le dit.
const SCALE = 2.9;           // ~185px : il est plus pres de nous qu'en v1
const GROUND_Y = 1050;       // le sable nu, sous la ligne des coques
// ⚠️ Il est A GAUCHE du filet et tire vers la DROITE (le filet vient a lui depuis
// la droite du cadre). Verifie par calcul : le point d'attache du filet doit rester
// DEVANT ses mains (x local > 0) sur toute la duree malgre la derive de parallaxe
// du plan avant (0 -> -190px), sinon la corde partirait dans son dos.
const PECHEUR_X = 900;

const Pecheur: React.FC<{ frame: number; txAvant: number }> = ({ frame, txAvant }) => {
  const fat = fatigueAt(frame);
  const cyc = cyclesElapsed(frame);
  const u = cyc % 1;
  const P = halagePose(u, fat);

  // Le socle place la hanche a (0, hipY) et l'epaule au bout du buste. On
  // recalcule ici la MEME geometrie pour ancrer les bras (formule identique a
  // Figure : sx = sin(torso)*TORSO_LENGTH, sy = hipY - cos(torso)*TORSO_LENGTH).
  const sx = Math.sin(rad(P.torsoDeg)) * TORSO_LENGTH;
  const sy = P.hipY - Math.cos(rad(P.torsoDeg)) * TORSO_LENGTH;

  // Les deux mains vont au meme point (la corde), legerement decalees pour
  // qu'on lise deux mains et pas une seule : la main avant est plus loin sur la
  // corde que la main arriere (prise en alternance, comme un vrai halage).
  const h1: [number, number] = [P.gripX + 5, P.gripY - 1];
  const h2: [number, number] = [P.gripX - 6, P.gripY + 2];

  const armFront = solveArm(sx, sy, h1[0], h1[1], 1);
  const armBack = solveArm(sx, sy, h2[0], h2[1], 1);

  // la corde qu'il tient : de ses mains jusqu'au bord du filet. Son MOU depend de
  // ce qu'il a deja ramene (tendue en fin de traction, molle quand il rend).
  const ropeSag = 15 - 11 * P.ropePull;

  // Point d'attache sur le filet reel (coin gauche du maillage, PLAN_AVANT), amene
  // du repere SVG monde vers le repere local du perso : on retire l'origine du
  // groupe (PECHEUR_X, GROUND_Y), on ajoute la parallaxe du plan avant, puis on
  // divise par le scale du groupe.
  const NET_WORLD_X = 1196;
  const NET_WORLD_Y = 1000;
  const netX = (NET_WORLD_X + txAvant - PECHEUR_X) / SCALE;
  const netY = (NET_WORLD_Y - GROUND_Y) / SCALE;

  return (
    <g transform={`translate(${PECHEUR_X} ${GROUND_Y})`}>
      <g transform={`scale(${SCALE})`}>
        {/* ombre au sol : elle s'ETIRE avec la course du soleil (le temps qui passe
            se lit aussi par terre). Elle reste sous les pieds, jamais detachee. */}
        <ellipse
          cx={-6 - 30 * fat}
          cy={2}
          rx={26 + 34 * fat}
          ry={5}
          fill="#5e3a1e"
          opacity={0.34 - 0.12 * fat}
        />

        {/* LE CORPS — socle importe. hideArm1 : on redessine nous-memes les bras
            en IK par-dessus (ils doivent atteindre la corde, pas pendre). */}
        <Figure
          x={0}
          y={0}
          phase={0}
          hideArm1
          pose={{
            hipY: P.hipY,
            torsoDeg: P.torsoDeg,
            leg1Deg: P.legFront,
            leg2Deg: P.legBack,
            leg1Knee: P.kneeFront,
            leg2Knee: P.kneeBack,
            arm2Deg: 0,
            arm2Len: 0.001, // le bras arriere du socle est neutralise (redessine ci-dessous)
          }}
        />

        {/* LA CORDE tenue — dessinee AVANT les bras pour passer derriere les mains.
            Elle ne s'arrete plus dans le vide (v1) : elle rejoint le BORD REEL du
            filet du plan avant (son coin gauche est a x=1180 y=1004 dans le repere
            SVG, et il suit la parallaxe txAvant). On convertit ce point monde dans
            le repere local du perso pour que la corde soit vraiment attachee au
            filet, quelle que soit la derive de parallaxe. */}
        <path
          d={`M ${h2[0]} ${h2[1]}
              Q ${(h1[0] + netX) / 2 + 4} ${(h1[1] + netY) / 2 + ropeSag}
                ${netX} ${netY}`}
          fill="none"
          stroke="#7a4e26"
          strokeWidth={2.2}
          strokeLinecap="round"
          opacity={0.95}
        />

        {/* BRAS ARRIERE (opacite reduite = profondeur, comme le socle) */}
        <Membre
          ax={sx} ay={sy}
          bx={armBack.ex} by={armBack.ey}
          cx={armBack.hx} cy={armBack.hy}
          w={4} opacity={0.75}
        />
        {/* BRAS AVANT — devant tout */}
        <Membre
          ax={sx} ay={sy}
          bx={armFront.ex} by={armFront.ey}
          cx={armFront.hx} cy={armFront.hy}
          w={4}
        />
      </g>
    </g>
  );
};

// ===========================================================================
// LA SCENE
// ===========================================================================
export const PecheurDuree16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const fat = fatigueAt(frame);

  // --- PARALLAXE : reprise a l'identique du village (memes amplitudes) ---
  const prog = interpolate(frame, [0, DUR], [0, 1], { extrapolateRight: "clamp" });
  const txCiel = -prog * 22;
  const txLointain = -prog * 48;
  const txOcean = -prog * 70;
  const txVillage = -prog * 105;
  const txSable = -prog * 130;
  const txPirogues = -prog * 158;
  const txAvant = -prog * 190;

  // --- COUCHER DE SOLEIL : meme courbe que le decor d'origine ---
  const sunDrop = interpolate(frame, [0, DUR], [0, 175], { extrapolateRight: "clamp" });
  const sunGlowOp = interpolate(frame, [0, DUR * 0.7, DUR], [1, 0.8, 0.35], {
    extrapolateRight: "clamp",
  });
  const sunDiscOp = interpolate(frame, [0, DUR * 0.85, DUR], [1, 0.95, 0.7], {
    extrapolateRight: "clamp",
  });
  const nightOp = interpolate(frame, [0, DUR * 0.35, DUR * 0.7, DUR], [0, 0.12, 0.34, 0.55], {
    extrapolateRight: "clamp",
  });
  const windowGlow = interpolate(frame, [DUR * 0.32, DUR * 0.75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#16213a" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: VILLAGE_DEFS }} />

        {/* ============ CIEL + SOLEIL ============ */}
        <g transform={`translate(${txCiel} 0)`}>
          <g dangerouslySetInnerHTML={{ __html: PLAN_CIEL }} />
          <g transform={`translate(0 ${sunDrop})`}>
            <ellipse cx={SUN_CX} cy={SUN_GLOW_CY} rx={460} ry={330} fill="url(#gSunGlow)" opacity={sunGlowOp} />
            <circle cx={SUN_CX} cy={SUN_CY} r={95} fill="url(#gSun)" opacity={sunDiscOp} />
          </g>
        </g>

        {/* ============ OCEAN + REFLET ============ */}
        <g transform={`translate(${txOcean} 0)`}>
          <g dangerouslySetInnerHTML={{ __html: PLAN_OCEAN }} />
          <g transform={`translate(0 ${sunDrop * 0.55})`}>
            {OCEAN_REFLECTS.map((r, i) => {
              const wobble = Math.sin(frame / 14 + i * 0.9);
              const scaleX = 1 + 0.16 * wobble;
              const op = r.op * (0.78 + 0.22 * Math.sin(frame / 11 + i * 1.4)) * (1 - nightOp * 0.75);
              return (
                <ellipse
                  key={i}
                  cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry}
                  fill={r.fill}
                  opacity={Math.max(0, op)}
                  transform={`translate(${r.cx} ${r.cy}) scale(${scaleX} 1) translate(${-r.cx} ${-r.cy})`}
                />
              );
            })}
          </g>
        </g>

        {/* ============ LOINTAIN + OISEAUX ============ */}
        <g transform={`translate(${txLointain} 0)`}>
          <g dangerouslySetInnerHTML={{ __html: PLAN_LOINTAIN }} />
          {BIRDS.map((b, i) => {
            const drift = -(frame * (0.18 + i * 0.02));
            const bob = 6 * Math.sin(frame / 22 + i * 1.3);
            return (
              <use
                key={i}
                href="#bird"
                transform={`translate(${b.x + drift} ${b.y + bob}) scale(${b.scale})`}
                stroke="#4a3242" strokeWidth={3} fill="none"
              />
            );
          })}
        </g>

        {/* ============ VILLAGE + PALMIERS + FENETRES ============ */}
        <g transform={`translate(${txVillage} 0)`}>
          <g dangerouslySetInnerHTML={{ __html: PLAN_VILLAGE }} />
          {PALM_TREES.map((tree, ti) => {
            const sway = 2.6 * Math.sin(frame / 26 + ti * 0.8);
            return (
              <g key={ti} transform={`translate(${tree.px} ${tree.py})`}>
                <g transform={`rotate(${sway})`}>
                  {tree.fronds.map((f, fi) => (
                    <use key={fi} href="#frond" transform={`rotate(${f.rot}) scale(${f.scale})`} fill={f.fill} />
                  ))}
                </g>
              </g>
            );
          })}
          {WINDOWS.map((win, i) => {
            const cx = win.x + win.w / 2;
            const cy = win.y + win.h / 2;
            const flicker = 1 + 0.05 * windowGlow * Math.sin(frame / 7 + i * 2.1);
            const haloR = Math.max(win.w, win.h) * (0.9 + 0.5 * windowGlow);
            return (
              <g key={i}>
                <ellipse cx={cx} cy={cy} rx={haloR} ry={haloR * 0.8} fill="#ffdf9a" opacity={0.45 * windowGlow * flicker} />
                <rect x={win.x} y={win.y} width={win.w} height={win.h} fill={win.fill} opacity={(0.55 + 0.45 * windowGlow) * flicker} />
              </g>
            );
          })}
        </g>

        {/* ============ SABLE ============ */}
        <Inject html={PLAN_SABLE} transform={`translate(${txSable} 0)`} />

        {/* ============ PIROGUES ============ */}
        <Inject html={PLAN_PIROGUES} transform={`translate(${txPirogues} 0)`} />

        {/* ============ AVANT (le filet qu'il tire) ============ */}
        <Inject html={PLAN_AVANT} transform={`translate(${txAvant} 0)`} />

        {/* ============ ⭐ LE PECHEUR — sur le sable, DEVANT le filet ============ */}
        {/* Il est monte APRES le plan avant : il est l'element le plus proche de
            nous, et le filet qu'il hale part de ses mains vers l'arriere-plan.
            C'est ce qui rend le geste lisible — en v1 il etait derriere le filet
            et devant la pirogue, donc il ne tirait visiblement rien. */}
        <Pecheur frame={frame} txAvant={txAvant} />

        {/* ============ OVERLAY NUIT ============ */}
        <rect x={-200} y={-60} width={2320} height={1200} fill="url(#gNight)" opacity={nightOp} />

        {/* etoiles */}
        <g opacity={interpolate(frame, [DUR * 0.6, DUR], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          {STARS.map((s, i) => {
            const tw = 0.5 + 0.5 * Math.sin(frame / 9 + i * 1.7);
            return <circle key={i} cx={s.x + txCiel} cy={s.y} r={s.r} fill="#fff6d8" opacity={tw} />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const STARS: { x: number; y: number; r: number }[] = [
  { x: 240, y: 90, r: 2.2 },
  { x: 430, y: 150, r: 1.6 },
  { x: 610, y: 80, r: 2 },
  { x: 820, y: 130, r: 1.5 },
  { x: 1360, y: 100, r: 2.1 },
  { x: 1580, y: 160, r: 1.7 },
  { x: 1780, y: 90, r: 1.9 },
  { x: 1050, y: 70, r: 1.6 },
  { x: 1220, y: 180, r: 1.4 },
  { x: 340, y: 210, r: 1.5 },
];

export default PecheurDuree16x9;
