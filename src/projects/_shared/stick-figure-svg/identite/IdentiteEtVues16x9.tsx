// R&D — DERNIERE BRIQUE (VAGUE C+B FUSIONNEES) — IDENTITE ET VUES
//
// QUESTION D'AZIZ : "vetements, accessoires, couleurs de peau differentes, accentuation des
// personnages" + "voir si on peut faire evoluer nos stick figures vers des personnages plus
// organiques, un peu plus detailles [...] tout en gardant la simplicite qui nous permet de
// les animer". Et : "peut-on faire une vue trois-quarts, une vue de dos ?"
//
// ⛔ CRITERE ELIMINATOIRE (inchange depuis le lot 1) : "si tu ne peux pas l'animer aussi bien
// qu'on l'a anime sur le franc CFA, ce n'est pas la bonne voie". On juge le MOUVEMENT, jamais
// le dessin fige — chaque niveau de detail et chaque vue est montre EN TRAIN DE MARCHER.
//
// ---------------------------------------------------------------------------------------------
// CE QUI EST REPRIS TEL QUEL (les briques validees, cf. STICK-FIGURE-INDEX.md)
// ---------------------------------------------------------------------------------------------
// 1. Verrou pas/distance (le pas produit le deplacement, jamais l'inverse) — repris de
//    DuoAsymetrie16x9 / GestesLocomotion16x9.
// 2. IK 2 segments pour les bras (solveArm) — repris a l'identique de DuoAsymetrie16x9.
// 3. Membre en UN SEUL path avec strokeLinejoin="round" (pas de pastille au coude).
// 4. Le systeme `role` (scale/strokeW/couleur/voute/accessoire) de DuoAsymetrie16x9 est le
//    point de depart du systeme d'identite ici etendu (carnation, vetement, niveau de detail).
//
// ---------------------------------------------------------------------------------------------
// CE QUI EST NOUVEAU
// ---------------------------------------------------------------------------------------------
// A. 4 NIVEAUX DE DETAIL (v0 trait nu -> v3 le plus detaille encore animable), tous en marche.
// B. CARNATION — palette de 5 teintes lisibles sur fond #182746, testee en silhouette ET en
//    marche, avec liseré de contour pour les tons les plus sombres (sinon ils se noient dans
//    le fond nuit).
// C. LES VUES — profil (acquis) vs trois-quarts (nouveau) vs dos (nouveau), chacune en marche,
//    verdict franc utilisable / a ecarter.
//
// ⛔ JAMAIS de visage expressif (yeux, bouche) — hors registre, deja ecarte en production.
// Remotion pur (useCurrentFrame/interpolate/spring), aucun Math.random, aucune CSS transition.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Sequence } from "remotion";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const rad = (d: number) => (d * Math.PI) / 180;

const NUIT = "#22345c";
const NUIT2 = "#182746";
const FOND = "#182746";
const ENCRE = "#f0e8d2";
const OR_CLAIR = "#d9a93a";

// ============================================================================================
// ECHELLE DE BASE — identique au registre (proportions non negociables)
// ============================================================================================
const TETE_R = 9;
const HANCHE_Y = -26;
const EPAULE_Y = -52;
const JAMBE_L = 34;
const BRAS_L = 15.5;
const AVBRAS_L = 15.0;
const SOL_Y = 640;

// ============================================================================================
// VERROU PAS/DISTANCE — repris a l'identique (brique n1)
// ============================================================================================
const SWING_MARCHE = 17;
const PAS_L = 2 * JAMBE_L * Math.sin(rad(SWING_MARCHE));
const marche = (pas: number) => ({ walk: (pas / 2) % 1, dist: pas * PAS_L });

// ============================================================================================
// IK 2 SEGMENTS — repris a l'identique (brique n2, convention DuoAsymetrie)
// ============================================================================================
const solveArm = (
  sx: number, sy: number, hx: number, hy: number, bend: number,
): { ex: number; ey: number; hx: number; hy: number } => {
  const dx = hx - sx;
  const dy = hy - sy;
  let dist = Math.sqrt(dx * dx + dy * dy);
  const maxReach = BRAS_L + AVBRAS_L - 0.001;
  const minReach = Math.abs(BRAS_L - AVBRAS_L) + 0.001;
  let cx = hx;
  let cy = hy;
  if (dist > maxReach) {
    cx = sx + (dx / dist) * maxReach;
    cy = sy + (dy / dist) * maxReach;
    dist = maxReach;
  } else if (dist < minReach) {
    cx = sx + (dx / (dist || 1)) * minReach;
    cy = sy + (dy / (dist || 1)) * minReach;
    dist = minReach;
  }
  const a = (BRAS_L * BRAS_L - AVBRAS_L * AVBRAS_L + dist * dist) / (2 * dist);
  const hSq = BRAS_L * BRAS_L - a * a;
  const h = Math.sqrt(Math.max(0, hSq));
  const ux = (cx - sx) / dist;
  const uy = (cy - sy) / dist;
  const px = sx + a * ux;
  const py = sy + a * uy;
  const ex = px + bend * h * -uy;
  const ey = py + bend * h * ux;
  return { ex, ey, hx: cx, hy: cy };
};

// ============================================================================================
// MEMBRE EN UN SEUL PATH — repris a l'identique (brique n6)
// ============================================================================================
const Membre: React.FC<{
  ax: number; ay: number; bx: number; by: number; cx: number; cy: number;
  w: number; couleur: string; opacity?: number;
}> = ({ ax, ay, bx, by, cx, cy, w, couleur, opacity = 1 }) => (
  <path
    d={`M ${ax} ${ay} L ${bx} ${by} L ${cx} ${cy}`}
    fill="none" stroke={couleur} strokeWidth={w}
    strokeLinecap="round" strokeLinejoin="round" opacity={opacity}
  />
);

// ============================================================================================
// A — NIVEAU DE DETAIL
// ============================================================================================
type Detail = 0 | 1 | 2 | 3;

// ============================================================================================
// B — CARNATION
// ============================================================================================
// 5 teintes couvrant une vraie plage de valeurs, choisies pour rester lisibles en SILHOUETTE
// sur le fond nuit #182746 (L de fond ~ 0.20). Les 2 teintes les plus sombres recoivent un
// liseré clair (pas un contour dur — une fine ligne a faible opacite) : sans lui, à 300-420px
// de haut la tete et les membres foncés se fondent presque dans le fond, la silhouette "troue".
// Les 3 teintes claires/moyennes n'en ont pas besoin (contraste déjà suffisant).
type Carnation = { nom: string; couleur: string; lisere: boolean };
const CARNATIONS: Carnation[] = [
  { nom: "ambre clair", couleur: "#e8b98a", lisere: false },
  { nom: "terre cuivrée", couleur: "#c98a55", lisere: false },
  { nom: "brun chaud", couleur: "#9c6539", lisere: false },
  { nom: "brun profond", couleur: "#6b4126", lisere: true },
  { nom: "ébène", couleur: "#3f2718", lisere: true },
];
const LISERE_COULEUR = "#e8d9b8"; // proche de ENCRE mais legerement plus chaud, ton "reflet"

// ============================================================================================
// VETEMENTS — role social minimal, une ligne, jamais un dessin detaille
// ============================================================================================
type Vetement = "aucun" | "manteau-mineur" | "tablier-commercante" | "costume-fonctionnaire" | "chapeau-agriculteur";

// ============================================================================================
// LE PERSONNAGE — squelette commun, pilote par (detail, carnation, vetement, vue)
// ============================================================================================
type Vue = "profil" | "troisQuarts" | "dos";

type PersoProps = {
  x: number;
  y: number;
  face: 1 | -1;      // sens de marche en profil/3-quarts (1 = vers la droite)
  walk: number;       // phase de marche [0,1), 0 = immobile en stance
  lean?: number;
  crouch?: number;
  opacity?: number;
  frame?: number;
  detail: Detail;
  carnation: Carnation;
  vetement?: Vetement;
  vue?: Vue;
  scale?: number;
};

const Perso: React.FC<PersoProps> = ({
  x, y, face, walk, lean = 0, crouch = 0, opacity = 1, frame = 0,
  detail, carnation, vetement = "aucun", vue = "profil", scale = 1,
}) => {
  const a = walk * Math.PI * 2;
  const enMarche = walk !== 0;
  const STANCE = 7;
  const swing = enMarche ? Math.sin(a) * 17 : STANCE;
  const bob = enMarche ? Math.abs(Math.cos(a)) * 2.5 : 0;
  const drop = crouch * 7;

  // --- PROJECTION SELON LA VUE ---
  // profil : le ciseau des jambes est plein (sin(swing)*L, comme le registre).
  // troisQuarts : le ciseau est PROJETE — la jambe qui va vers la camera parcourt un plus grand
  //   arc horizontal apparent que celle qui s'eloigne (perspective simplifiee par un facteur de
  //   compression different sur chaque jambe + un DECALAGE horizontal fixe entre les 2 hanches
  //   apparentes, ce qui donne l'epaisseur du corps en 3/4).
  // dos : ⚠️ REECRIT apres 1er render — la version initiale ne changeait que headX=0, le corps
  //   restait un profil pur (bras IK sur le cote, jambes qui se croisent en tranche) : ca ne se
  //   LIT PAS comme un dos, juste comme un profil immobile. Un dos VU DE DERRIERE a une signature
  //   propre : les 2 jambes s'ouvrent SYMETRIQUEMENT de part et d'autre de l'axe (pas une devant
  //   l'autre en tranche), les 2 EPAULES sont visibles cote a cote (largeur, pas profondeur), et
  //   les bras se balancent aussi symetriquement (gauche/droite), pas en avant/arriere IK.
  const PROJ3Q = 0.62; // compression horizontale de la jambe/bras "loin" en 3/4
  const OFFSET3Q = 5.2; // decalage entre hanche avant et hanche arriere en 3/4 (epaisseur du corps)
  const estDos = vue === "dos";

  const hipY = HANCHE_Y - bob + drop;
  const jl = JAMBE_L - drop;

  let j1x = Math.sin(rad(swing)) * jl;
  let j1y = hipY + Math.cos(rad(swing)) * jl;
  let j2x = Math.sin(rad(-swing)) * jl;
  let j2y = hipY + Math.cos(rad(-swing)) * jl;
  let hipOffsetX = 0; // decalage horizontal de la hanche arriere (epaisseur du corps en 3/4)

  if (vue === "troisQuarts") {
    // jambe avant (celle qui vient vers la camera) : arc plein. Jambe arriere : compressee.
    j1x = Math.sin(rad(swing)) * jl;
    j1y = hipY + Math.cos(rad(swing)) * jl;
    j2x = Math.sin(rad(-swing)) * jl * PROJ3Q;
    j2y = hipY + Math.cos(rad(-swing)) * jl;
    hipOffsetX = -OFFSET3Q; // la hanche arriere est decalee (elle est "derriere" le corps)
  } else if (estDos) {
    // DE DOS : les 2 jambes s'ouvrent SYMETRIQUEMENT (largeur d'epaule, pas de tranche profil).
    // Le swing pilote l'ECARTEMENT lateral (abs) au lieu du sens avant/arriere : une jambe
    // s'ecarte a gauche, l'autre a droite, en opposition de phase — c'est ce qui dit "on le voit
    // de dos en train de marcher" plutot que "il glisse immobile".
    const ecart = Math.abs(Math.sin(a)) * jl * 0.62;
    const avance = Math.cos(a) * jl * 0.18; // tres legere composante de profondeur (bob/genou)
    j1x = ecart;
    j1y = hipY + Math.sqrt(Math.max(0, jl * jl - ecart * ecart)) - avance * 0.3;
    j2x = -ecart;
    j2y = hipY + Math.sqrt(Math.max(0, jl * jl - ecart * ecart)) + avance * 0.3;
  }

  // --- BUSTE ---
  const leanR = rad(lean);
  const bustLen = HANCHE_Y - (-58); // hanche -> cou
  const neckX = estDos ? 0 : Math.sin(leanR) * bustLen;
  const neckY = hipY - Math.cos(leanR) * bustLen;
  const epLen = HANCHE_Y - EPAULE_Y;
  const shX = estDos ? 0 : Math.sin(leanR) * epLen;
  const shY = hipY - Math.cos(leanR) * epLen;
  const teteLen = HANCHE_Y - (-66);
  const headX = estDos ? 0 : Math.sin(leanR) * teteLen + (vue === "profil" ? 3 : 1.5);
  const headY = hipY - Math.cos(leanR) * teteLen;
  // largeur d'epaule visible de dos (les 2 epaules cote a cote, jamais visible de profil)
  const EPAULE_LARGEUR = 8.5;

  // --- BRAS : balancement de marche, oppose aux jambes ---
  // De dos : les bras se balancent LATERALEMENT (gauche/droite, en phase avec les jambes
  // opposees), jamais en profondeur (IK avant/arriere) — sinon on retombe dans une lecture profil.
  const balanceAvant = enMarche ? -Math.sin(a) * 24 : 6;
  const balanceArriere = enMarche ? Math.sin(a) * 24 : -6;
  const cibleAvant = estDos
    ? { x: EPAULE_LARGEUR + Math.sin(a) * 7, y: EPAULE_Y + 30 }
    : { x: 4 + Math.sin(rad(balanceAvant)) * 1, y: EPAULE_Y + 27 + Math.sin(rad(balanceAvant)) * 8 };
  const cibleArriere = estDos
    ? { x: -EPAULE_LARGEUR - Math.sin(a) * 7, y: EPAULE_Y + 30 }
    : { x: -4 + Math.sin(rad(balanceArriere)) * 1, y: EPAULE_Y + 27 + Math.sin(rad(balanceArriere)) * 8 };
  const shXAvant = estDos ? EPAULE_LARGEUR : shX;
  const shXArriere = estDos ? -EPAULE_LARGEUR : shX + hipOffsetX * 0.4;
  const armAvant = solveArm(shXAvant, shY, cibleAvant.x, cibleAvant.y, 1);
  const armArriere = solveArm(shXArriere, shY, cibleArriere.x + (estDos ? 0 : hipOffsetX * 0.4), cibleArriere.y, -1);

  const wMembreBase = 4.5;
  const wBrasArriereBase = 4;
  const wBusteBase = 4.5;
  const wJambeBase = 4.5;
  const rTete = TETE_R;
  const opActi = 1;
  const opProf = 0.72; // opacite du membre "loin" — profondeur

  const c = carnation.couleur;
  const cLisere = carnation.lisere;

  // --- LISERE (silhouette-contour) pour les carnations sombres — un trait fin, tres discret,
  // derriere chaque forme pleine (tete, buste), pour que la silhouette ne se fonde pas au fond.
  const Lisere: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    cLisere ? (
      <g stroke={LISERE_COULEUR} strokeOpacity={0.35} strokeWidth={1.1} fill="none">
        {children}
      </g>
    ) : null;

  // ==========================================================================================
  // v0 — TRAIT NU : rien de plus que le squelette (reference)
  // v1 — + mains/pieds suggeres (un point pour la main, un empattement pour le pied) + epaisseur
  //      de trait variable (jambes/buste plus epais que les avant-bras, comme un vrai corps)
  // v2 — + vetement minimal caracterisant un role (une ligne)
  // v3 — le plus detaille : v2 + volume de silhouette (buste/jambes en bande large semi-remplie
  //      au lieu d'un simple trait) SANS jamais quitter le squelette anime — la bande SUIT les
  //      memes points articules, donc elle ne peut jamais se detacher du mouvement.
  // ==========================================================================================
  // ⚠️ CORRIGE apres 1er render : les multiplicateurs de v3 (x2.35 buste, x1.85 jambe) PUIS le
  // vetement qui multipliait ENCORE par-dessus (x1.55) donnaient un trait a ~8x l'epaisseur de
  // base — une masse informe, sans plus aucun rapport avec un "vetement". Le corps epaissit
  // MODEREMENT (le buste et les cuisses lisent "un corps", pas un tube) et le vetement s'AJOUTE
  // en delta fixe (px), jamais en multiplicateur compose.
  const wMembre = detail >= 1 ? wMembreBase * 1.05 : wMembreBase;
  const wBrasArriere = detail >= 1 ? wBrasArriereBase * 1.05 : wBrasArriereBase;
  const wBuste = detail >= 3 ? wBusteBase * 1.55 : (detail >= 1 ? wBusteBase * 1.1 : wBusteBase);
  const wJambe = detail >= 3 ? wJambeBase * 1.4 : (detail >= 1 ? wJambeBase * 1.08 : wJambeBase);

  // --- pieds : empattement (v1+). Un petit segment perpendiculaire au bas de jambe, jamais un
  // pied articule (ca resterait dans le registre "suggere", pas dessine). Oriente selon `face`.
  const Pied: React.FC<{ px: number; py: number; angDeg: number }> = ({ px, py, angDeg }) => {
    if (detail < 1) return null;
    const foot = 6.5;
    const dirx = Math.cos(rad(angDeg));
    const diry = Math.sin(rad(angDeg));
    const fx = px + dirx * foot * face;
    const fy = py + diry * foot * 0.35;
    return (
      <line x1={px} y1={py} x2={fx} y2={fy} stroke={c} strokeWidth={wJambeBase * 0.85}
        strokeLinecap="round" opacity={0.95} />
    );
  };

  // --- mains : un point plein (v1+), rayon leger, memes proportions quel que soit le detail.
  const Main: React.FC<{ mx: number; my: number; op?: number }> = ({ mx, my, op = 1 }) => {
    if (detail < 1) return null;
    return <circle cx={mx} cy={my} r={3.1} fill={c} opacity={op} />;
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${face * scale} ${scale})`} opacity={opacity}>
      <Lisere>
        <circle cx={headX} cy={headY} r={rTete + 1} />
      </Lisere>

      {/* jambe arriere */}
      <line x1={hipOffsetX} y1={hipY} x2={j2x + hipOffsetX} y2={j2y} stroke={c} strokeWidth={wJambe}
        strokeLinecap="round" opacity={opProf} />
      <Pied px={j2x + hipOffsetX} py={j2y} angDeg={90} />
      {/* v2/v3 : bas de jambe habille (mineur/agriculteur portent une botte suggeree) */}
      {detail >= 2 && (vetement === "manteau-mineur") && (
        <line x1={j2x + hipOffsetX} y1={j2y - 8} x2={j2x + hipOffsetX} y2={j2y}
          stroke={c} strokeWidth={wJambe + 3} strokeLinecap="round" opacity={opProf * 0.9} />
      )}

      {/* bras arriere (de dos : c'est le bras GAUCHE du personnage, dessine derriere le buste) */}
      <Membre ax={shXArriere} ay={shY} bx={armArriere.ex} by={armArriere.ey}
        cx={armArriere.hx} cy={armArriere.hy} w={wBrasArriere} couleur={c} opacity={estDos ? 1 : opProf} />
      <Main mx={armArriere.hx} my={armArriere.hy} op={estDos ? 1 : opProf} />

      {/* buste — v3 : bande plus large, SUIT les 2 points hanche/epaule, jamais un volume libre.
          De dos : le buste est un TRAPEZE hanche->epaules (pas un simple trait), parce que la
          largeur d'epaule doit se voir — c'est LE signal qui dit "on regarde son dos". */}
      {estDos ? (
        <path
          d={`M ${hipOffsetX * 0.5 - wJambe * 0.3} ${hipY} L ${shXArriere} ${shY} L ${shXAvant} ${shY} L ${hipOffsetX * 0.5 + wJambe * 0.3} ${hipY} Z`}
          fill={c} opacity={1}
        />
      ) : (
        <line x1={hipOffsetX * 0.5} y1={hipY} x2={neckX + hipOffsetX * 0.5} y2={neckY}
          stroke={c} strokeWidth={wBuste} strokeLinecap="round" />
      )}

      {/* vetement — v2+, une ligne caracterisant le role, POSEE SUR le buste (memes points, donc
          ne peut jamais flotter/se detacher : elle suit x1/y1->x2/y2 du buste a chaque frame).
          ⚠️ CORRIGE : delta ADDITIF fixe (px), jamais un multiplicateur sur wBuste deja elargi —
          sinon la largeur compose et le vetement devient une masse informe (bug du 1er render). */}
      {detail >= 2 && vetement === "manteau-mineur" && (
        <line x1={hipOffsetX * 0.5} y1={hipY} x2={neckX + hipOffsetX * 0.5} y2={neckY - 2}
          stroke="#3a4a63" strokeWidth={wBuste + 4.5} strokeLinecap="round" opacity={0.88} />
      )}
      {detail >= 2 && vetement === "tablier-commercante" && (
        <line x1={hipOffsetX * 0.5} y1={hipY - (hipY - neckY) * 0.08}
          x2={neckX + hipOffsetX * 0.5} y2={neckY + (hipY - neckY) * 0.42}
          stroke={OR_CLAIR} strokeWidth={wBuste + 1.5} strokeLinecap="round" opacity={0.82} />
      )}
      {detail >= 2 && vetement === "costume-fonctionnaire" && (
        <line x1={hipOffsetX * 0.5} y1={hipY} x2={neckX + hipOffsetX * 0.5} y2={neckY}
          stroke="#1c2740" strokeWidth={wBuste + 5} strokeLinecap="round" opacity={0.9} />
      )}

      {/* chapeau — v2+, un trait horizontal pose sur le haut de la tete */}
      {detail >= 2 && (vetement === "chapeau-agriculteur" || vetement === "costume-fonctionnaire") && (
        <line
          x1={headX - rTete * (vetement === "chapeau-agriculteur" ? 1.9 : 1.2)}
          y1={headY - rTete - (vetement === "chapeau-agriculteur" ? 2.5 : 2)}
          x2={headX + rTete * (vetement === "chapeau-agriculteur" ? 1.9 : 1.2)}
          y2={headY - rTete - (vetement === "chapeau-agriculteur" ? 2.5 : 2)}
          stroke={vetement === "chapeau-agriculteur" ? "#8a6a3a" : "#1c2740"}
          strokeWidth={2.6} strokeLinecap="round"
        />
      )}

      {/* tete */}
      <circle cx={headX} cy={headY} r={rTete} fill={c} />

      {/* jambe avant */}
      <line x1={hipOffsetX} y1={hipY} x2={j1x + hipOffsetX} y2={j1y} stroke={c} strokeWidth={wJambe}
        strokeLinecap="round" opacity={opActi} />
      <Pied px={j1x + hipOffsetX} py={j1y} angDeg={90} />
      {detail >= 2 && vetement === "manteau-mineur" && (
        <line x1={j1x + hipOffsetX} y1={j1y - 8} x2={j1x + hipOffsetX} y2={j1y}
          stroke={c} strokeWidth={wJambe + 3} strokeLinecap="round" opacity={0.95} />
      )}

      {/* bras avant (de dos : bras DROIT du personnage) */}
      <Membre ax={shXAvant} ay={shY} bx={armAvant.ex} by={armAvant.ey} cx={armAvant.hx} cy={armAvant.hy}
        w={wMembre} couleur={c} />
      <Main mx={armAvant.hx} my={armAvant.hy} />
    </g>
  );
};

// ============================================================================================
// ETIQUETTE — sobre, Georgia serif, plus petite que les persos
// ============================================================================================
const Etiquette: React.FC<{ n: string; titre: string; sous: string; op: number }> = ({ n, titre, sous, op }) => (
  <g opacity={op}>
    <text x={W / 2} y={92} textAnchor="middle" fontFamily="Georgia, serif" fontSize={15} fill={OR_CLAIR}
      letterSpacing={6} opacity={0.7}>{n}</text>
    <text x={W / 2} y={130} textAnchor="middle" fontFamily="Georgia, serif" fontSize={26} fill={ENCRE}
      letterSpacing={3} opacity={0.92}>{titre}</text>
    <text x={W / 2} y={160} textAnchor="middle" fontFamily="Georgia, serif" fontSize={16} fill={ENCRE}
      letterSpacing={1} opacity={0.42} fontStyle="italic">{sous}</text>
  </g>
);

const LabelPerso: React.FC<{ x: number; y: number; texte: string; op: number }> = ({ x, y, texte, op }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="Georgia, serif" fontSize={14} fill={ENCRE}
    letterSpacing={0.8} opacity={0.55 * op}>{texte}</text>
);

const Sol: React.FC<{ x1: number; x2: number; y: number; op?: number }> = ({ x1, x2, y, op = 0.28 }) => (
  <line x1={x1} y1={y} x2={x2} y2={y} stroke={ENCRE} strokeWidth={1.6} opacity={op} />
);

// ============================================================================================
// MARCHEUR EN COULOIR — reutilise pour A et C : un perso qui boucle dans un couloir horizontal,
// le deplacement DERIVE de la phase (verrou pas/distance).
// ============================================================================================
const Marcheur: React.FC<{
  frame: number; couloir: [number, number]; y: number; cadence?: number;
  detail: Detail; carnation: Carnation; vetement?: Vetement; vue?: Vue; scaleP?: number;
}> = ({ frame, couloir, y, cadence = 0.62, detail, carnation, vetement, vue = "profil", scaleP = 1 }) => {
  const t = frame / FPS;
  const [c0, c1] = couloir;
  const largeur = c1 - c0;
  const phase = (t * cadence) % 1;
  // ⚠️ CORRIGE apres 1er render : PAS_L est calcule en unites LOCALES du squelette (avant scale).
  // Le perso est dessine avec `scale={scaleP}`, donc son deplacement a l'ECRAN doit etre dans
  // la MEME echelle, sinon les jambes s'ouvrent grand (correctement, en unites locales) mais le
  // corps ne traverse quasiment pas le couloir a l'ecran — lecture "il marche sur place", exactement
  // le defaut vu au premier rendu (verifie frame par frame, pas juste au calcul).
  const dist = t * cadence * 2 * PAS_L * scaleP;
  const x = c0 + (dist % (largeur + 70));
  const visible = x < c1 + 40;
  if (!visible) return null;
  return (
    <Perso x={x} y={y} face={1} walk={phase} detail={detail} carnation={carnation}
      vetement={vetement} vue={vue} frame={frame} scale={scaleP} />
  );
};

// ============================================================================================
// PARTIE A — L'ECHELLE DE DETAIL (4 niveaux, tous en marche)
// ============================================================================================
const NIVEAUX: { n: Detail; titre: string; sous: string }[] = [
  { n: 0, titre: "v0 — TRAIT NU", sous: "le squelette de référence, rien ajouté" },
  { n: 1, titre: "v1 — MAINS ET PIEDS SUGGÉRÉS", sous: "un point, un empattement · trait légèrement variable" },
  { n: 2, titre: "v2 — UN RÔLE SANS VISAGE", sous: "manteau, tablier, costume, chapeau — une ligne" },
  { n: 3, titre: "v3 — LA LIMITE ENCORE ANIMABLE", sous: "silhouette élargie, toujours pilotée par le squelette" },
];

const VETEMENTS_PAR_NIVEAU: Vetement[] = ["aucun", "aucun", "tablier-commercante", "manteau-mineur"];

const BandeDetail: React.FC<{ n: Detail; titre: string; sous: string; frame: number; y: number }> = ({
  n, titre, sous, frame, y,
}) => {
  const op = interpolate(frame, [0, 10], [0, 1], clamp);
  return (
    <g opacity={op}>
      <text x={170} y={y - 118} fontFamily="Georgia, serif" fontSize={19} fill={OR_CLAIR}
        letterSpacing={2.5} opacity={0.8}>{titre}</text>
      <text x={170} y={y - 96} fontFamily="Georgia, serif" fontSize={14} fill={ENCRE}
        letterSpacing={0.6} opacity={0.4} fontStyle="italic">{sous}</text>
      <Sol x1={170} x2={1850} y={y} />
      <Marcheur frame={frame} couloir={[220, 1800]} y={y} detail={n}
        carnation={CARNATIONS[1]} vetement={VETEMENTS_PAR_NIVEAU[n]} scaleP={2.55} />
    </g>
  );
};

const PARTIE_A_FRAMES = S(9.5);

const PartieA: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [230, 460, 690, 920];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <Etiquette n="PARTIE A" titre="L'ÉCHELLE DE DÉTAIL" sous="jusqu'où détailler sans casser la marche — 4 niveaux, côte à côte"
        op={interpolate(frame, [0, 14], [0, 1], clamp)} />
      {NIVEAUX.map((niv, i) => (
        <BandeDetail key={niv.n} n={niv.n} titre={niv.titre} sous={niv.sous} frame={frame} y={rows[i]} />
      ))}
    </svg>
  );
};

// ============================================================================================
// PARTIE B — LA CARNATION (palette testee en silhouette ET en marche)
// ============================================================================================
const PARTIE_B_FRAMES = S(9);

const PartieB: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 14], [0, 1], clamp);
  const y = 560;
  const n = CARNATIONS.length;
  const startX = 330;
  const spanX = 1260;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <Etiquette n="PARTIE B" titre="LA CARNATION" sous="5 teintes lisibles sur fond nuit — liseré pour les tons sombres"
        op={op} />
      <text x={W / 2} y={220} textAnchor="middle" fontFamily="Georgia, serif" fontSize={14} fill={ENCRE}
        letterSpacing={1} opacity={0.4 * op} fontStyle="italic">
        rôles distribués librement — aucun stéréotype de teinte
      </text>
      <Sol x1={200} x2={1720} y={y} />
      {CARNATIONS.map((c, i) => {
        const x = startX + (spanX / (n - 1)) * i;
        const phaseOffset = i * 0.31; // desync legere, chacun a sa propre phase de marche
        const phase = (((frame / FPS) * 0.5 + phaseOffset) % 1);
        return (
          <g key={c.nom}>
            <Perso x={x} y={y} face={1} walk={phase} detail={1} carnation={c} frame={frame} scale={2.55} />
            <LabelPerso x={x} y={y + 66} texte={c.nom} op={op} />
          </g>
        );
      })}
    </svg>
  );
};

// ============================================================================================
// PARTIE C — LES VUES : PROFIL vs TROIS-QUARTS vs DOS, chacune en marche
// ============================================================================================
const PARTIE_C_FRAMES = S(11);

const BandeVue: React.FC<{ titre: string; sous: string; vue: Vue; y: number; frame: number }> = ({
  titre, sous, vue, y, frame,
}) => {
  const op = interpolate(frame, [0, 10], [0, 1], clamp);
  const t = frame / FPS;
  const cadence = 0.6;

  if (vue === "dos") {
    // DE DOS : le personnage s'eloigne vers le fond du cadre. Le ciseau des jambes reste un
    // ciseau (vu par la tranche, comme un profil "aplati"), mais x n'avance quasi pas — on
    // simule l'eloignement par un scale tres progressif qui retrecit (il s'enfonce dans le
    // cadre) + une derive verticale infime vers la ligne d'horizon. Le verrou pas/distance
    // reste respecte : la PHASE avance a la meme cadence, donc les jambes s'ouvrent/se ferment
    // reellement, seule la traduction en deplacement ecran change de forme (profondeur, pas x).
    const phase = (t * cadence) % 1;
    const CYCLE = 6.4;
    const cyc = (t % CYCLE) / CYCLE;
    const eloignement = interpolate(cyc, [0, 1], [0, 1], clamp);
    const sc = 2.55 * (1 - eloignement * 0.22);
    const yy = y - eloignement * 26;
    return (
      <g opacity={op}>
        <text x={170} y={y - 118} fontFamily="Georgia, serif" fontSize={19} fill={OR_CLAIR}
          letterSpacing={2.5} opacity={0.8}>{titre}</text>
        <text x={170} y={y - 96} fontFamily="Georgia, serif" fontSize={14} fill={ENCRE}
          letterSpacing={0.6} opacity={0.4} fontStyle="italic">{sous}</text>
        <Sol x1={170} x2={1850} y={y} />
        <Perso x={960} y={yy} face={1} walk={phase} detail={1} carnation={CARNATIONS[2]} vue="dos"
          frame={frame} scale={sc} />
      </g>
    );
  }

  return (
    <g opacity={op}>
      <text x={170} y={y - 118} fontFamily="Georgia, serif" fontSize={19} fill={OR_CLAIR}
        letterSpacing={2.5} opacity={0.8}>{titre}</text>
      <text x={170} y={y - 96} fontFamily="Georgia, serif" fontSize={14} fill={ENCRE}
        letterSpacing={0.6} opacity={0.4} fontStyle="italic">{sous}</text>
      <Sol x1={170} x2={1850} y={y} />
      <Marcheur frame={frame} couloir={[220, 1800]} y={y} detail={1} carnation={CARNATIONS[2]}
        vue={vue} scaleP={2.55} />
    </g>
  );
};

const PartieC: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [280, 570, 860];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <Etiquette n="PARTIE C" titre="LES VUES" sous="profil (acquis) · trois-quarts · de dos — chacune en marche"
        op={interpolate(frame, [0, 14], [0, 1], clamp)} />
      <BandeVue titre="PROFIL" sous="acquis — marche naturelle" vue="profil" y={rows[0]} frame={frame} />
      <BandeVue titre="TROIS-QUARTS" sous="le ciseau projeté — teste ici" vue="troisQuarts" y={rows[1]} frame={frame} />
      <BandeVue titre="DE DOS" sous="regard partagé — s'éloigne vers le fond" vue="dos" y={rows[2]} frame={frame} />
    </svg>
  );
};

// ============================================================================================
// ASSEMBLAGE
// ============================================================================================
export const IDENTITE_ET_VUES_FRAMES = PARTIE_A_FRAMES + PARTIE_B_FRAMES + PARTIE_C_FRAMES;

export const IdentiteEtVues16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  void fps;

  const op = interpolate(frame, [0, 12, IDENTITE_ET_VUES_FRAMES - 14, IDENTITE_ET_VUES_FRAMES],
    [0, 1, 1, 0], clamp);

  const stars = React.useMemo(() => {
    const a: { x: number; y: number; r: number; o: number }[] = [];
    let s = 47;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 48; i++) {
      a.push({ x: rnd() * W, y: rnd() * H * 0.7, r: rnd() * 1.3 + 0.4, o: rnd() * 0.28 + 0.1 });
    }
    return a;
  }, []);

  const offB = PARTIE_A_FRAMES;
  const offC = PARTIE_A_FRAMES + PARTIE_B_FRAMES;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NUIT} 0%, ${NUIT2} 100%)`, opacity: op }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={ENCRE} opacity={s.o} />)}
        <text x={W / 2} y={1032} textAnchor="middle" fontFamily="Georgia, serif" fontSize={16} fill={ENCRE}
          letterSpacing={6} opacity={0.24}>IDENTITÉ ET VUES — LA DERNIÈRE BRIQUE : DÉTAIL, CARNATION, PERSPECTIVE</text>
      </svg>

      <Sequence from={0} durationInFrames={PARTIE_A_FRAMES}>
        <PartieA />
      </Sequence>
      <Sequence from={offB} durationInFrames={PARTIE_B_FRAMES}>
        <PartieB />
      </Sequence>
      <Sequence from={offC} durationInFrames={PARTIE_C_FRAMES}>
        <PartieC />
      </Sequence>
    </AbsoluteFill>
  );
};

export default IdentiteEtVues16x9;
