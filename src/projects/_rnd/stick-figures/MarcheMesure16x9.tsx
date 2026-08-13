import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  Figure,
  Membre,
  solveArm,
  rad,
  TORSO_LENGTH,
  HIP_Y_STANDING,
  BRAS_L,
  AVBRAS_L,
  LEG_LENGTH,
  walkPhaseFromSteps,
} from "../../_shared/stick-figure-svg/StickFigure";
import { CARNATIONS } from "../../_shared/stick-figure-svg/identite/Roles";

/**
 * "LA MESURE" — banc d'essai de la MANIPULATION D'OBJET (2026-07-27)
 *
 * POURQUOI CETTE SCENE, ET PAS LA PECHE : la scene de peche a echoue comme banc d'essai parce
 * qu'elle cumulait 3 inconnues (pas de SOL + geste d'OBJET + decor herite non eprouve) — cf.
 * STICK-FIGURE-INDEX § LA REGLE DE COMPOSITION. Ici on n'en garde QU'UNE :
 *   - SOL PRESENT (acquis du village : le sol porte le personnage, ancrage par construction)
 *   - decor CODE ICI, simple, verifie (pas d'heritage d'une scene jamais rendue)
 *   - => la seule chose testee est L'OBJET QUI CHANGE D'ETAT ET DE CONTENANT.
 *
 * ⛔ LA LECON QUI MOTIVE TOUT LE FICHIER (bug vecu sur la peche, releve par Aziz) : le filet
 * recevait le nombre de poissons en permanence, donc IL NAISSAIT PLEIN — les poissons etaient
 * visibles avant meme le lancer. « On est loin de ce qu'il lance son filet et ramene des poissons,
 * car avant meme qu'il lance son filet, les poissons sont deja presents. »
 * -> ICI, LE GRAIN EST UNE MACHINE A ETATS EXPLICITE. A tout instant, chaque unite de grain est
 *    dans UN SEUL contenant (sac / mesure / panier), et la somme est CONSTANTE. Il est
 *    structurellement impossible que du grain apparaisse ou se duplique — c'est verifie par
 *    calcul avant rendu, pas constate a l'oeil apres.
 *
 * LE GESTE (celui qui manquait a la peche, cite par Aziz : « il se retournait, prenait un poisson
 * apres avoir ramene son filet et le mettait dans le panier derriere lui ») :
 *   PLONGER la mesure dans le sac -> la REMPLIR -> la SORTIR pleine -> PIVOTER vers le panier
 *   qui est DERRIERE -> VERSER -> revenir. x3, et la 3e fois le sac est presque vide.
 *
 * ⛔ Registre : profil uniquement, aucun visage, socle IMPORTE, frame-driven pur.
 */

// ⚠️ 900 et non 880 : la scene doit se terminer APRES `revient` du dernier cycle (860),
// sinon la derniere frame tombe en plein pivot — bug vu au rendu, le corps etait ecrase
// en trait vertical. On garde 40 frames de repos final, face au sac, bilan visible.
export const MARCHE_MESURE_FRAMES = 900; // 30s @ 30fps

const W = 1920;
const H = 1080;

// palette terre/marche, coherente avec le registre encre
const CIEL = "#e8dcc0";
const MUR = "#d9c9a4";
const SOL = "#c3a877";
const SOL_OMBRE = "#ab8f5f";
const INK = "#2b2117";
const TOILE = "#9c7f4e";
const GRAIN = "#d8a54a";

const smooth = (t: number) => t * t * (3 - 2 * t);

// ===========================================================================
// ⭐ LA MACHINE A ETATS DU GRAIN — le coeur du test
// ===========================================================================
// Le grain est une quantite CONSERVEE. A chaque frame on sait exactement combien
// il y en a dans chacun des 3 contenants, et sac+mesure+panier === TOTAL, toujours.
// C'est ce qui rend impossible le bug "l'objet nait plein".
const TOTAL = 12;            // unites de grain au depart, toutes dans le sac
const PAR_MESURE = 3;        // ce qu'une mesure contient quand elle est pleine

type Grain = { sac: number; mesure: number; panier: number };

// Les 3 cycles. Chacun : plonger -> remplir -> sortir -> pivoter -> verser -> revenir
// ⚠️ CONTRAINTE DURE : `revient` doit valoir AU MOINS verse+46+30, sinon la phase de
// retour a une fenetre nulle ou negative et NE JOUE JAMAIS — la main reste figee sur la
// pose de versement puis se teleporte au repos au changement de cycle (mesure du bug :
// 54px de saut a f525, parce que verse+46 = 526 > revient = 525). Verifie par calcul.
const CYCLES = [
  { t0: 30,  plonge: 60,  remplit: 110, sort: 150, pivot: 195, verse: 235, revient: 320 },
  { t0: 330, plonge: 355, remplit: 400, sort: 435, pivot: 470, verse: 505, revient: 590 },
  { t0: 600, plonge: 620, remplit: 665, sort: 700, pivot: 735, verse: 770, revient: 860 },
];

// Etat du grain a une frame donnee — DERIVE, jamais stocke, donc jamais desynchronise.
const grainAt = (frame: number): Grain => {
  let sac = TOTAL;
  let panier = 0;
  let mesure = 0;
  for (const c of CYCLES) {
    if (frame >= c.remplit) {
      // le remplissage est acheve : le grain a QUITTE le sac
      const pris = Math.min(PAR_MESURE, sac);
      sac -= pris;
      mesure = pris;
    } else if (frame >= c.plonge) {
      // en cours de remplissage : le grain transite, il est compte dans la mesure
      const t = interpolate(frame, [c.plonge, c.remplit], [0, 1], { extrapolateRight: "clamp" });
      const pris = Math.min(PAR_MESURE, sac);
      const enCours = pris * smooth(t);
      sac -= enCours;
      mesure = enCours;
      break;
    }
    if (frame >= c.verse) {
      // le versement : la mesure se vide DANS le panier
      const t = interpolate(frame, [c.verse, c.verse + 34], [0, 1], { extrapolateRight: "clamp" });
      const verse = mesure * smooth(t);
      panier += verse;
      mesure -= verse;
    }
    if (frame < c.revient) break;
  }
  return { sac, mesure, panier };
};

// ===========================================================================
// LA POSE — l'OBJET d'abord (ou est la mesure), les mains suivent en IK.
// ===========================================================================
const REACH_MAX = (BRAS_L + AVBRAS_L) * 0.80;

// ⚠️ Cibles de main EN REPERE DU CORPS (pas en repere monde). Le sac est dessine 20 unites
// devant son poste de travail : sa main doit donc viser +20 en local, pas une autre valeur
// — sinon il puise a cote du sac (incoherence trouvee par calcul avant rendu).
const SAC_POS = { x: 20, y: -16 };      // ou sa main plonge (= l'ouverture du sac)
const PANIER_POS = { x: -20, y: -10 };  // ou sa main verse (= l'ouverture du panier)

type Etat = {
  mainX: number; mainY: number;   // la main qui tient la mesure
  torsoDeg: number;
  hipY: number;
  legFront: number; legBack: number;
  kneeFront: number; kneeBack: number;
  faceArriere: number;            // 0 = tourne vers le sac, 1 = tourne vers le panier
  mesureAngle: number;            // inclinaison de la mesure (elle se penche pour verser)
  mesureVisible: boolean;
  // ⭐ v2 — LE DEPLACEMENT REEL (remplace le flip)
  posX: number;                   // ou il se trouve dans la scene (unites locales)
  marche: boolean;                // true = il est en train de marcher (jambes en ciseau)
  pasEcoules: number;             // nombre de pas depuis le depart — pilote la phase de marche
};

// ⭐⭐ LE DEPLACEMENT — v2, apres retour d'Aziz sur la v1.
// ⛔ CE QUI ETAIT FAUX EN v1 (a ne jamais refaire) : le demi-tour etait un simple
// `scaleX(-1)`. Verdict d'Aziz : « on dirait que la solution que tu as utilisee a ete de
// faire tout simplement un flip du personnage. Ca se voit clairement qu'il n'y a pas
// vraiment de vrais mouvements de jambe [...] c'est un peu etrange quand on sait qu'on
// est capable de parfaitement faire marcher un personnage de droite a gauche. »
// Il avait raison sur toute la ligne : c'etait une FACILITE, pas une contrainte. La
// justification implicite (« les objets sont trop proches ») ne tenait pas — mesure
// faite depuis : 104 unites entre le sac et le panier, soit ~4 pas a swing 20deg.
// -> ICI il MARCHE vraiment, avec le VERROU PAS/DISTANCE du socle (brique 1) : c'est le
//    PAS qui produit le deplacement, jamais l'inverse. On interpole un NOMBRE DE PAS, et
//    x en decoule — donc les pieds ne patinent jamais, quelle que soit la cadence.
const SWING_MARCHE = 20;
const PAS_L = 2 * LEG_LENGTH * Math.sin(rad(SWING_MARCHE)); // 23.26 unites par pas

const X_SAC = 30;      // ou il se tient pour puiser
const X_PANIER = -42;  // ou il se tient pour verser
const NB_PAS = Math.abs(X_SAC - X_PANIER) / PAS_L; // ~3.1 pas

const etatAt = (frame: number): Etat => {
  const repos: Etat = {
    mainX: 11, mainY: -33,
    torsoDeg: 4, hipY: HIP_Y_STANDING,
    legFront: 11, legBack: -13,
    kneeFront: 3, kneeBack: 0,
    faceArriere: 0, mesureAngle: 0, mesureVisible: true,
    posX: X_SAC, marche: false, pasEcoules: 0,
  };

  const c = CYCLES.find((c) => frame < c.revient) ?? CYCLES[CYCLES.length - 1];
  if (frame < c.t0) return repos;

  // --- 1. PLONGER : il se baisse, la mesure descend DANS le sac ---
  if (frame < c.remplit) {
    const t = smooth(interpolate(frame, [c.t0, c.remplit], [0, 1], { extrapolateRight: "clamp" }));
    return {
      ...repos,
      // il se penche vers le sac et flechit les genoux (le poids descend, pas juste le bras)
      torsoDeg: 4 + 26 * t,
      hipY: HIP_Y_STANDING + 11 * t,
      legFront: 11 + 8 * t,
      legBack: -13 - 6 * t,
      kneeFront: 3 + 16 * t,
      kneeBack: 10 * t,
      // ⚠️ part de la main de REPOS (11,-33) — la meme valeur que celle sur laquelle la
      // phase "revenir" du cycle precedent atterrit. Si les deux ne coincident pas, le
      // raccord entre 2 cycles saute (mesure du bug : 54px a l'ecran a f525).
      mainX: 11 + (SAC_POS.x - 11) * t,
      mainY: -33 + (SAC_POS.y - -33) * t,
      mesureAngle: 0,
    };
  }

  // --- 2. SORTIR la mesure pleine : il se redresse ---
  if (frame < c.sort) {
    const t = smooth(interpolate(frame, [c.remplit, c.sort], [0, 1], { extrapolateRight: "clamp" }));
    return {
      ...repos,
      torsoDeg: 30 - 24 * t,
      hipY: HIP_Y_STANDING + 11 - 9 * t,
      legFront: 19 - 7 * t,
      legBack: -19 + 5 * t,
      kneeFront: 19 - 15 * t,
      kneeBack: 10 - 9 * t,
      mainX: SAC_POS.x + (18 - SAC_POS.x) * t,
      mainY: SAC_POS.y + (-35 - SAC_POS.y) * t,
      mesureAngle: 0,
    };
  }

  // --- 3. SE RETOURNER, PUIS MARCHER jusqu'au panier ---
  // Le demi-tour est court (debut de phase), puis il MARCHE vraiment jusqu'au panier.
  if (frame < c.verse) {
    const t = interpolate(frame, [c.sort, c.verse], [0, 1], { extrapolateRight: "clamp" });
    const TOURNE = 0.24;                          // le demi-tour occupe le 1er quart
    const tourne = smooth(Math.min(1, t / TOURNE));
    const tMarche = smooth(Math.max(0, (t - TOURNE) / (1 - TOURNE)));
    // ⭐ VERROU PAS/DISTANCE : on interpole un NOMBRE DE PAS, x en decoule. Les pieds ne
    // patinent donc jamais, quelle que soit la courbe d'acceleration (brique 1 du socle).
    const pas = NB_PAS * tMarche;
    const posX = X_SAC + (X_PANIER - X_SAC) * (pas / NB_PAS);
    const enMarche = tMarche > 0.001 && tMarche < 0.999;
    return {
      ...repos,
      torsoDeg: 6 + (enMarche ? 3 : 0),           // il se penche un peu dans le sens de la marche
      hipY: HIP_Y_STANDING + 2,
      // ⚠️ a l'ARRET on impose les jambes ; EN MARCHE on laisse le socle les animer
      // (valeurs ignorees, cf. `marche` -> <Figure phase> plus bas).
      legFront: 13, legBack: -15,
      kneeFront: 0, kneeBack: 0,
      // la mesure est tenue pres du corps pendant le trajet (on ne marche pas bras tendu)
      mainX: 18 - 5 * tourne,
      mainY: -35 - 1 * tourne,
      faceArriere: tourne,
      mesureAngle: 0,
      posX,
      marche: enMarche,
      pasEcoules: pas,
    };
  }

  // --- 4. VERSER dans le panier ---
  if (frame < c.verse + 46) {
    const t = smooth(interpolate(frame, [c.verse, c.verse + 46], [0, 1], { extrapolateRight: "clamp" }));
    return {
      ...repos,
      torsoDeg: 6 + 14 * t,
      hipY: HIP_Y_STANDING + 2 + 4 * t,
      legFront: 13, legBack: -15,
      kneeFront: 4 + 5 * t, kneeBack: 2,
      // la main tend au-dessus du panier (repere retourne : x positif = vers le panier,
      // qui est a 20 unites devant lui une fois qu'il lui fait face)
      mainX: 13 + 7 * t,
      mainY: -36 + 10 * t,
      faceArriere: 1,
      mesureAngle: 118 * t,   // la mesure bascule : c'est ca qui fait couler le grain
      posX: X_PANIER,         // il est arrive : il verse SUR PLACE, devant le panier
      marche: false,
      pasEcoules: NB_PAS,
    };
  }

  // --- 5. REVENIR face au sac ---
  // ⚠️ La cible de main DOIT retomber sur celle du repos (14, -30), sinon le cycle
  // suivant repart d'ailleurs. Mesure du bug initial : main a x=30 en fin de retour
  // -> tension IK 1.167 (butee 0.97) et saut de 79px au raccord de cycle.
  // Il se redresse, se retourne, puis REMARCHE vers le sac (trajet inverse, meme verrou).
  const t = interpolate(frame, [c.verse + 46, c.revient], [0, 1], { extrapolateRight: "clamp" });
  const REDRESSE = 0.18;   // il finit de vider et se redresse
  const TOURNE2 = 0.38;    // puis il se retourne
  const redresse = smooth(Math.min(1, t / REDRESSE));
  const tourne = smooth(Math.max(0, Math.min(1, (t - REDRESSE) / (TOURNE2 - REDRESSE))));
  const tMarche = smooth(Math.max(0, (t - TOURNE2) / (1 - TOURNE2)));
  const pas = NB_PAS * tMarche;
  const posX = X_PANIER + (X_SAC - X_PANIER) * (pas / NB_PAS);
  const enMarche = tMarche > 0.001 && tMarche < 0.999;
  return {
    ...repos,
    torsoDeg: 20 - 16 * redresse + (enMarche ? 3 : 0),
    hipY: HIP_Y_STANDING + 6 - 6 * redresse,
    legFront: 13, legBack: -15,
    kneeFront: 9 - 9 * redresse, kneeBack: 0,
    mainX: 22 - 11 * redresse,   // -> 11 = la main de repos, exactement
    mainY: -26 - 7 * redresse,   // -> -33 = la main de repos, exactement
    faceArriere: 1 - tourne,     // il repasse face au sac
    mesureAngle: 118 * (1 - redresse),
    posX,
    marche: enMarche,
    pasEcoules: pas,
  };
};

// ===========================================================================
// LES OBJETS
// ===========================================================================

// Le tas de grain dans le sac : sa HAUTEUR suit la quantite restante.
const SacDeGrain: React.FC<{ reste: number }> = ({ reste }) => {
  const plein = reste / TOTAL;
  const hGrain = 4 + plein * 15;
  return (
    <g>
      {/* la toile du sac, affaissee */}
      <path
        d={`M -20 0 L -17 ${-16 - plein * 8} Q 0 ${-21 - plein * 11} 17 ${-16 - plein * 8} L 20 0 Z`}
        fill={TOILE} stroke={INK} strokeWidth={1.6} strokeLinejoin="round"
      />
      {/* le grain visible dans l'ouverture — DERIVE de la quantite, jamais fixe */}
      <path
        d={`M -15 ${-15 - plein * 8} Q 0 ${-15 - plein * 8 - hGrain} 15 ${-15 - plein * 8} Q 0 ${-11 - plein * 8} -15 ${-15 - plein * 8} Z`}
        fill={GRAIN} stroke={INK} strokeWidth={1.2}
      />
      <path d={`M -20 0 L 20 0`} stroke={INK} strokeWidth={1.6} />
    </g>
  );
};

// Le panier du client : le grain s'y accumule.
const PanierClient: React.FC<{ contenu: number }> = ({ contenu }) => {
  const rempli = contenu / TOTAL;
  return (
    <g>
      <path d="M -17 0 L -14 -17 L 14 -17 L 17 0 Z" fill="none" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      {/* tressage */}
      {[-11, -5.5, 0].map((y, i) => (
        <line key={i} x1={-15.5 + i * 0.6} y1={y} x2={15.5 - i * 0.6} y2={y} stroke={INK} strokeWidth={0.9} opacity={0.55} />
      ))}
      {/* LE GRAIN ACCUMULE — monte avec le contenu (0 au depart : le panier est VIDE) */}
      {rempli > 0.01 && (
        <path
          d={`M -13.5 -2 L ${-13.5 - 0} ${-2 - rempli * 17} Q 0 ${-6 - rempli * 20} 13.5 ${-2 - rempli * 17} L 13.5 -2 Z`}
          fill={GRAIN} stroke={INK} strokeWidth={1}
        />
      )}
    </g>
  );
};

// La mesure (le bol gradue). Son contenu est DERIVE de l'etat, et il se vide en versant.
const Mesure: React.FC<{ contenu: number; angleDeg: number }> = ({ contenu, angleDeg }) => {
  const plein = Math.max(0, Math.min(1, contenu / PAR_MESURE));
  return (
    <g transform={`rotate(${angleDeg})`}>
      <path d="M -9 -9 L -7 3 L 7 3 L 9 -9 Z" fill="none" stroke={INK} strokeWidth={1.7} strokeLinejoin="round" />
      {plein > 0.02 && (
        <path
          d={`M ${-9 + 1.4} ${-9 + (1 - plein) * 11} L -7.2 2 L 7.2 2 L ${9 - 1.4} ${-9 + (1 - plein) * 11} Z`}
          fill={GRAIN} stroke={INK} strokeWidth={0.9}
        />
      )}
    </g>
  );
};

// Le filet de grain qui COULE de la mesure vers le panier — visible seulement pendant le
// versement, et sa largeur suit le debit reel (la derivee de ce qui quitte la mesure).
const Coulee: React.FC<{ debit: number; from: { x: number; y: number }; to: { x: number; y: number } }> = ({
  debit, from, to,
}) => {
  if (debit < 0.01) return null;
  const w = 1 + debit * 2.6;
  return (
    <path
      d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${(from.y + to.y) / 2 + 3} ${to.x} ${to.y}`}
      fill="none" stroke={GRAIN} strokeWidth={w} strokeLinecap="round" opacity={0.92}
    />
  );
};

// ===========================================================================
// LA SCENE
// ===========================================================================
const PERSO_X = 980;
const SOL_Y = 812;
const PERSO_SCALE = 4.2;   // grand : on veut VOIR l'objet et le contenu (c'est le sujet)
const PEAU = CARNATIONS[2].couleur;

export const MarcheMesure16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const g = grainAt(frame);
  const st = etatAt(frame);
  const gPrev = grainAt(Math.max(0, frame - 1));
  // debit reel : ce qui a quitte la mesure depuis la frame precedente
  const debit = Math.max(0, gPrev.mesure - g.mesure) * 3;

  // ⛔ 10e PIEGE — VU AU RENDU : a la derniere frame, le personnage etait ECRASE EN UN
  // TRAIT VERTICAL. Cause : le retournement passe par scaleX = cos(pi*t), qui vaut
  // exactement 0 a mi-pivot ; si une frame tombe la (ou si la scene s'arrete la), le
  // corps a une largeur nulle. Deux parades cumulees :
  //   1. l'echelle ne descend jamais sous 0.12 en valeur absolue (le corps garde une
  //      epaisseur lisible meme au plus fort du pivot — a cette taille ca lit comme un
  //      profil tres serre, pas comme un bug) ;
  //   2. le pivot est rapide et ne s'attarde pas a mi-course (smoothstep -> le passage
  //      par 0 est traverse vite).
  const flipRaw = Math.cos(st.faceArriere * Math.PI);
  const flip = Math.sign(flipRaw || 1) * Math.max(0.12, Math.abs(flipRaw));

  // ⚠️ L'EPAULE doit etre calculee AVEC LE BOB quand il marche : le socle fait rebondir la
  // hanche (bobAmp) pendant la marche, et un bras ancre sur une epaule figee "vibre" par
  // rapport au corps (regle du socle : un bras au repos doit etre SOLIDAIRE du bob).
  const phaseMarche = st.marche ? walkPhaseFromSteps(st.pasEcoules) : 0;
  const bob = st.marche ? Math.abs(Math.cos(phaseMarche * Math.PI * 2)) * 2.5 : 0;
  const hipEff = st.marche ? HIP_Y_STANDING - bob : st.hipY;
  const sx = Math.sin(rad(st.torsoDeg)) * TORSO_LENGTH;
  const sy = hipEff - Math.cos(rad(st.torsoDeg)) * TORSO_LENGTH;
  // en marche, la main tient la mesure contre lui et SUIT le bob (pas de cible monde figee)
  const mainYEff = st.marche ? st.mainY - bob : st.mainY;
  const arm = solveArm(sx, sy, st.mainX, mainYEff, 1);

  return (
    <AbsoluteFill style={{ backgroundColor: CIEL }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {/* ===== LE DECOR — code ici, simple et verifie (pas d'heritage) ===== */}
        {/* mur de fond : donne une profondeur sans concurrencer le sujet */}
        <rect x={0} y={0} width={W} height={SOL_Y} fill={CIEL} />
        <rect x={0} y={318} width={W} height={SOL_Y - 318} fill={MUR} />
        <line x1={0} y1={318} x2={W} y2={318} stroke={INK} strokeWidth={2} opacity={0.18} />
        {/* quelques etals suggeres au fond (silhouettes, jamais detaillees : le sujet est devant) */}
        {[180, 470, 1460, 1740].map((x, i) => (
          <g key={i} opacity={0.16}>
            <rect x={x - 74} y={470 + (i % 2) * 26} width={148} height={10} fill={INK} />
            <line x1={x - 62} y1={480 + (i % 2) * 26} x2={x - 62} y2={SOL_Y} stroke={INK} strokeWidth={5} />
            <line x1={x + 62} y1={480 + (i % 2) * 26} x2={x + 62} y2={SOL_Y} stroke={INK} strokeWidth={5} />
            <path d={`M ${x - 90} ${470 + (i % 2) * 26} L ${x} ${430 + (i % 2) * 26} L ${x + 90} ${470 + (i % 2) * 26} Z`} fill={INK} />
          </g>
        ))}

        {/* ===== LE SOL — la condition n1 (cf. INDEX § REGLE DE COMPOSITION) ===== */}
        <rect x={0} y={SOL_Y} width={W} height={H - SOL_Y} fill={SOL} />
        <line x1={0} y1={SOL_Y} x2={W} y2={SOL_Y} stroke={INK} strokeWidth={2.5} opacity={0.5} />
        {[858, 918, 990, 1058].map((y, i) => (
          <path
            key={i}
            d={`M ${-40 + i * 30} ${y} Q ${W / 2} ${y - 7} ${W + 40} ${y}`}
            fill="none" stroke={SOL_OMBRE} strokeWidth={2} opacity={0.5}
          />
        ))}

        {/* ===== LE PERSONNAGE ET SES OBJETS ===== */}
        <g transform={`translate(${PERSO_X} ${SOL_Y})`}>
          <g transform={`scale(${PERSO_SCALE})`}>
            {/* LE SAC et LE PANIER sont poses AU SOL, dans le repere du MONDE — ils ne
                bougent pas quand le personnage marche. Places juste au-dela de ses deux
                postes de travail (X_SAC / X_PANIER) pour qu'il les atteigne bras tendu. */}
            <g transform={`translate(${X_SAC + 20} 0)`}>
              <SacDeGrain reste={g.sac} />
            </g>
            <g transform={`translate(${X_PANIER - 20} 0)`}>
              <PanierClient contenu={g.panier} />
            </g>

            {/* ombre portee : elle SUIT le personnage (sinon il marche hors de son ombre) */}
            <ellipse cx={st.posX} cy={1} rx={26} ry={3.2} fill={INK} opacity={0.17} />

            {/* LE CORPS — il se DEPLACE (translate posX) et se retourne sur ses appuis.
                ⛔ Le flip seul etait le defaut de la v1 : ici il ne fait que retourner le
                sens du profil, c'est la MARCHE (phase + posX) qui porte le deplacement. */}
            <g transform={`translate(${st.posX} 0) scale(${flip} 1)`}>
              <Figure
                x={0} y={0}
                // ⭐ EN MARCHE : on passe la PHASE (1 cycle = 2 pas) et on ne force PAS les
                // jambes -> le socle produit le ciseau valide. A L'ARRET : phase 0 + jambes
                // imposees (poses de travail : penche, verse, etc.).
                phase={st.marche ? walkPhaseFromSteps(st.pasEcoules) : 0}
                p={st.marche ? { swingMax: SWING_MARCHE, bobAmp: 2.5, armSwing: 20 } : undefined}
                hideArm1
                color={PEAU}
                pose={
                  st.marche
                    ? { torsoDeg: st.torsoDeg }
                    : {
                        hipY: st.hipY,
                        torsoDeg: st.torsoDeg,
                        leg1Deg: st.legFront,
                        leg2Deg: st.legBack,
                        leg1Knee: st.kneeFront,
                        leg2Knee: st.kneeBack,
                        arm2Deg: 0,
                        arm2Len: 0.001,
                      }
                }
              />
              {/* LA MESURE — tenue par la main, donc dans le repere du corps */}
              {st.mesureVisible && (
                <g transform={`translate(${st.mainX} ${mainYEff})`}>
                  <Mesure contenu={g.mesure} angleDeg={st.mesureAngle} />
                </g>
              )}
              {/* le bras qui la tient, par-dessus */}
              <Membre
                ax={sx} ay={sy} bx={arm.ex} by={arm.ey} cx={arm.hx} cy={arm.hy}
                w={4} color={PEAU}
              />
            </g>

            {/* LA COULEE de grain mesure -> panier. Elle vit dans le repere MONDE (elle relie
                un objet TENU a un objet POSE) : on convertit donc la position de la main
                (repere du corps, eventuellement retourne) en coordonnees monde. */}
            <Coulee
              debit={debit}
              from={{ x: st.posX + flip * (st.mainX + 6), y: mainYEff + 4 }}
              to={{ x: X_PANIER - 20, y: -14 }}
            />
          </g>
        </g>

        {/* ===== LE COMPTEUR DE VERITE (debug narratif) — montre que la quantite se CONSERVE.
            C'est la preuve visible qu'aucun grain n'apparait ni ne disparait. ===== */}
        <g opacity={0.75}>
          <text x={96} y={120} fill={INK} fontFamily="Georgia, serif" fontSize={26}>
            sac {g.sac.toFixed(1)}
          </text>
          <text x={96} y={158} fill={INK} fontFamily="Georgia, serif" fontSize={26}>
            mesure {g.mesure.toFixed(1)}
          </text>
          <text x={96} y={196} fill={INK} fontFamily="Georgia, serif" fontSize={26}>
            panier {g.panier.toFixed(1)}
          </text>
          <text x={96} y={240} fill={INK} fontFamily="Georgia, serif" fontSize={28} fontWeight="bold">
            total {(g.sac + g.mesure + g.panier).toFixed(1)} / {TOTAL}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default MarcheMesure16x9;
