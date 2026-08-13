// R&D VAGUE 1 — LES GESTES · LOT "L'ECHANGE" (tendre la main / donner / recevoir)
//
// QUESTION POSEE : une stick figure de PROFIL marche remarquablement bien (prouve sur le beat 4 du
// Franc CFA, composant FunambuleProfil). Est-ce que le meme registre encaisse un GESTE D'ECHANGE
// entre DEUX corps — c'est-a-dire un geste qui exige un RACCORD (une main qui rencontre une autre
// main, un objet qui passe de l'une a l'autre sans sauter) ?
//
// CRITERE ELIMINATOIRE (mot d'Aziz) : "si tu ne peux pas l'animer aussi bien qu'on l'a anime sur le
// franc CFA, ce n'est pas la bonne voie". On juge le MOUVEMENT, jamais le dessin fige.
//
// ---------------------------------------------------------------------------------------------
// LES 3 DECISIONS TECHNIQUES QUI FONT QUE CA MARCHE (ou pas) — a lire avant de juger le rendu
// ---------------------------------------------------------------------------------------------
// 1. LE BRAS EST RESOLU EN IK, PAS ANIME PAR ANGLES.
//    Animer un bras par des angles d'epaule/coude force a deviner ou finit la main — et la main
//    finit alors DANS l'autre corps, ou 30px a cote de l'objet. Ici on fait l'inverse : on decide
//    la POSITION DE LA MAIN dans le monde, et on RESOUT les 2 segments (bras + avant-bras) par
//    trigonometrie. Consequence directe : la main est toujours exactement ou l'objet doit etre,
//    et le coude se plie tout seul de facon credible. C'est LA condition du raccord.
// 2. LE RACCORD DE L'OBJET N'EST PAS UN "SAUT DE PARENT".
//    L'objet n'est jamais "attache au perso A" puis "attache au perso B" (ce qui produit un saut
//    d'un pixel a l'autre au changement). Sa position est une INTERPOLATION CONTINUE entre la main
//    du donneur et la main du receveur : grip 0 = main A, grip 1 = main B. Au moment ou grip passe
//    de 0 a 1, les DEUX mains sont au meme endroit (les cibles IK convergent), donc l'objet ne
//    bouge pas d'un pixel pendant la prise. Le relais est invisible, c'est le but.
// 3. LES DEUX PERSOS PARTAGENT LA MEME ECHELLE ET LE MEME SOL.
//    Meme constante PERSO_H, meme ligne de sol SOL_Y, memes strokeWidth. Une difference d'echelle
//    entre deux corps qui se touchent detruit la lisibilite plus surement qu'un mauvais geste.
//
// ---------------------------------------------------------------------------------------------
// LE VRAI SUJET : LE MEME GESTE, 4 SENS DIFFERENTS
// ---------------------------------------------------------------------------------------------
// Le bras qui s'etend est identique dans les 4 variantes. Ce qui change le SENS n'est jamais le
// bras : c'est ce que fait LE RESTE DU CORPS pendant que le bras bouge.
//   V1 DONNER LIBREMENT      -> le donneur reste DROIT, le tronc ne bouge pas. Neutralite = don.
//   V2 RECEVOIR              -> le receveur AVANCE (deplacement reel du corps, pas juste le bras),
//                               prend, et RAMENE l'objet contre lui en reculant d'un pas.
//   V3 TENDRE SANS RECEVOIR  -> le bras reste tendu, l'autre ne bouge pas. La FATIGUE du bras
//                               (il descend tres lentement, il tremble) est le seul evenement.
//   V4 SE FAIRE DELESTER     -> le preneur avance SUR le donneur, le donneur RESISTE (son tronc
//                               est tire vers l'avant puis rebondit en arriere quand l'objet lache).
//                               C'est le contre-recul du corps qui dit "on m'a pris", pas le bras.
//
// CONTRAINTES : Remotion pur (useCurrentFrame/interpolate/spring), aucun Math.random, aucune CSS
// transition. Palette et traits repris a l'identique de la reference (fond #182746, encre #f0e8d2,
// strokeWidth 4.5 membres / 3.5-4 accessoires, strokeLinecap round).
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// Palette identique a la reference CFA
const NUIT = "#22345c";
const NUIT2 = "#182746";
const ENCRE = "#f0e8d2";
const OR_CLAIR = "#d9a93a";

// ============================================================================================
// ECHELLE — commune aux deux persos, non negociable (cf. decision technique n°3)
// ============================================================================================
// Sur la reference, le perso fait ~74px : tete a y=-66 (r=9) et pieds a y~+8 depuis son origine.
// On garde EXACTEMENT ces proportions ; l'origine du perso est posee sur le sol.
const TETE_Y = -66;      // centre de la tete
const TETE_R = 9;
const COU_Y = -58;       // haut du buste
const HANCHE_Y = -26;    // bas du buste / depart des jambes
const EPAULE_Y = -52;    // depart des bras
const JAMBE_L = 34;      // longueur de jambe (= la distance hanche -> sol)
const BRAS_L = 15.5;     // humerus
const AVBRAS_L = 15.0;   // avant-bras (portee totale du bras ~30.5px, soit ~40% de la hauteur)
const SOL_Y = 640;       // ligne de sol commune aux deux persos

const rad = (d: number) => (d * Math.PI) / 180;

// ============================================================================================
// ⭐ VERROU PAS/DISTANCE — correction du defaut n°1 signale par Aziz ("ils tremblent sur place")
// ============================================================================================
// DIAGNOSTIC : dans la 1ere version, la position x d'un perso qui se deplace venait d'un
// interpolate INDEPENDANT de la phase de marche `walk`. Les deux courbes n'ayant aucune raison
// de coincider, le pied POSE AU SOL continuait de glisser pendant son appui : patinage. A
// l'echelle x5, ce patinage ne se lit pas comme un glissement (trop petit) mais comme un
// TREMBLEMENT — le pied avance, recule, ravance de quelques pixels a chaque frame.
//
// LE MECANISME (repris de GestesLocomotion16x9, ou il est la decouverte du lot) : on n'interpole
// plus la distance, on interpole le NOMBRE DE PAS. La distance en decoule :
//        x(t) = x0 + (pas ecoules) * (longueur d'un pas)
// avec longueur d'un pas = 2 * JAMBE_L * sin(swingMax) = la vraie distance geometrique couverte
// par l'ouverture du ciseau des jambes. Le pied ne PEUT plus patiner : c'est le pas qui produit
// le deplacement, et non plus le deplacement qui accompagne vaguement un cycle de jambes.
//
// SWING_MARCHE doit rester EGAL a l'amplitude utilisee dans <Perso> (sin(a)*17), sinon le verrou
// est faux et le patinage revient silencieusement.
const SWING_MARCHE = 17;
const PAS_L = 2 * JAMBE_L * Math.sin(rad(SWING_MARCHE)); // ~19.88 px par pas

// Un cycle de marche complet = 2 pas. On pilote donc tout par un compteur de PAS continu :
//   walk (phase 0..1 pour <Perso>) = pas / 2
//   deplacement                    = pas * PAS_L
// `pas` peut etre non-entier et suivre n'importe quelle courbe d'easing : la coherence
// pied/sol est garantie par construction, quelle que soit l'acceleration.
const marche = (pas: number) => ({ walk: (pas / 2) % 1, dist: pas * PAS_L });

// ============================================================================================
// IK 2 SEGMENTS — c'est ce qui rend le raccord possible
// ============================================================================================
// On connait l'epaule (sx,sy) et la cible de la main (hx,hy). On cherche le coude.
// `bend` = +1 coude vers le bas (posture naturelle bras tendu vers l'avant), -1 vers le haut.
// Si la cible est hors de portee, on la ramene sur le cercle de portee max : le bras se tend
// completement au lieu de se disloquer (et le corps devra, lui, se pencher — cf. V4).
const solveArm = (
  sx: number, sy: number, hx: number, hy: number, bend: number,
): { ex: number; ey: number; hx: number; hy: number; tendu: number } => {
  const dx = hx - sx;
  const dy = hy - sy;
  let dist = Math.sqrt(dx * dx + dy * dy);
  const maxReach = BRAS_L + AVBRAS_L - 0.001;
  const minReach = Math.abs(BRAS_L - AVBRAS_L) + 0.001;
  // taux de tension du bras (0 = plie contre soi, 1 = completement tendu) — sert a la lisibilite
  const tendu = Math.min(1, dist / maxReach);
  let cx = hx;
  let cy = hy;
  if (dist > maxReach) {
    // hors de portee : la main se pose sur le cercle max, le bras est tendu a bloc
    cx = sx + (dx / dist) * maxReach;
    cy = sy + (dy / dist) * maxReach;
    dist = maxReach;
  } else if (dist < minReach) {
    cx = sx + (dx / (dist || 1)) * minReach;
    cy = sy + (dy / (dist || 1)) * minReach;
    dist = minReach;
  }
  // loi des cosinus : projection du coude sur l'axe epaule->main, puis ecart perpendiculaire
  const a = (BRAS_L * BRAS_L - AVBRAS_L * AVBRAS_L + dist * dist) / (2 * dist);
  const hSq = BRAS_L * BRAS_L - a * a;
  const h = Math.sqrt(Math.max(0, hSq));
  const ux = (cx - sx) / dist;
  const uy = (cy - sy) / dist;
  const px = sx + a * ux;
  const py = sy + a * uy;
  // perpendiculaire
  const ex = px + bend * h * -uy;
  const ey = py + bend * h * ux;
  return { ex, ey, hx: cx, hy: cy, tendu };
};

// ============================================================================================
// ⭐ MEMBRE ARTICULE — correction du defaut n°2 signale par Aziz ("un cercle sur le bras")
// ============================================================================================
// DIAGNOSTIC : ce n'etait pas un cercle DESSINE, c'etait LE COUDE. Le bras etait trace en DEUX
// <line> distinctes, chacune avec strokeLinecap="round" : chaque extremite est donc un
// DEMI-DISQUE de rayon strokeWidth/2. Au coude, la capsule terminale de l'humerus et la capsule
// initiale de l'avant-bras se superposent exactement au meme point ; quand le bras est plie, ces
// deux demi-disques ne sont plus alignes et leur union dessine une PASTILLE pleine, nettement
// plus large que le trait. Invisible a l'echelle 1, franchement visible a x5.
//
// SOLUTION RETENUE : un SEUL <path> polyline continu (epaule -> coude -> main) avec
// strokeLinejoin="round". Pourquoi celle-la plutot que les alternatives :
//   - reduire le strokeWidth de l'avant-bras -> le membre s'affine visiblement vers la main,
//     ce qui contredit la grammaire du registre (encre d'epaisseur constante) ;
//   - revoir la geometrie pour eviter les angles marques -> ce serait brider l'IK, or c'est
//     exactement l'IK qui rend possible le raccord main-a-main (decision technique n°1) ;
//   - le path unique ne coute rien, ne change AUCUNE position, et transforme la jointure en un
//     vrai coude lisse : le stroke est continu, il n'y a plus deux extremites qui se chevauchent,
//     donc plus rien qui puisse former une pastille, quel que soit l'angle de flexion.
// On garde strokeLinecap="round" pour les DEUX bouts libres (epaule et main) : la, l'arrondi est
// voulu — c'est ce qui donne l'epaule et la main.
const Membre: React.FC<{
  ax: number; ay: number;   // origine (epaule / hanche)
  bx: number; by: number;   // articulation (coude / genou)
  cx: number; cy: number;   // extremite (main / pied)
  w: number;
  opacity?: number;
}> = ({ ax, ay, bx, by, cx, cy, w, opacity = 1 }) => (
  <path
    d={`M ${ax} ${ay} L ${bx} ${by} L ${cx} ${cy}`}
    fill="none" stroke={ENCRE} strokeWidth={w}
    strokeLinecap="round" strokeLinejoin="round" opacity={opacity}
  />
);

// ============================================================================================
// LE PERSONNAGE DE PROFIL — reprise stricte du registre FunambuleProfil + un bras pilotable
// ============================================================================================
// `face`: +1 regarde vers la droite, -1 vers la gauche. Le miroir est applique par un scale(-1,1)
// sur le groupe : les proportions restent rigoureusement identiques entre les deux persos.
// `handTarget`: cible de la main AVANT (dans l'espace LOCAL du perso, x positif = devant lui).
//   null => bras au repos le long du corps.
// `walk`: phase de marche 0..1 (comme la reference). 0 fige = debout.
// `lean`: inclinaison du buste en degres (+ = penche vers l'avant). C'est le porteur de sens.
// `crouch`: flexion des jambes (0..1), le corps s'abaisse — sert au corps qui encaisse (V4).
const Perso: React.FC<{
  x: number;
  y: number;
  face: 1 | -1;
  walk: number;
  handTarget: { x: number; y: number } | null;
  lean?: number;
  crouch?: number;
  opacity?: number;
  tremble?: number;         // amplitude du tremblement de la main (V3)
  frame?: number;
  bendDir?: 1 | -1;         // sens de flexion du coude
  autreBrasY?: number;      // decalage vertical de la main arriere (bras qui retient / equilibre)
}> = ({
  x, y, face, walk, handTarget, lean = 0, crouch = 0, opacity = 1, tremble = 0, frame = 0,
  bendDir = 1, autreBrasY = 0,
}) => {
  // ---- MARCHE : strictement le principe valide sur la reference ----
  const a = walk * Math.PI * 2;
  const enMarche = walk !== 0;
  // ⛔ CORRIGE apres 1er render : a l'arret (walk=0) le swing tombait a 0 et les DEUX jambes se
  // superposaient exactement -> le perso se lisait comme un simple poteau vertical, il perdait son
  // corps. Un personnage debout n'a pas les pieds joints : on garde une STANCE de 7 degres. C'est
  // ce qui fait qu'il "se tient" au lieu d'etre pose.
  const STANCE = 7;
  const swing = enMarche ? Math.sin(a) * 17 : STANCE;
  const bob = enMarche ? Math.abs(Math.cos(a)) * 2.5 : 0;
  const drop = crouch * 7; // les genoux plient -> tout le haut du corps descend

  const hipY = HANCHE_Y - bob + drop;
  // longueur de jambe raccourcie quand il flechit (sinon les pieds passent sous le sol)
  const jl = JAMBE_L - drop;
  const j1x = Math.sin(rad(swing)) * jl;
  const j1y = hipY + Math.cos(rad(swing)) * jl;
  const j2x = Math.sin(rad(-swing)) * jl;
  const j2y = hipY + Math.cos(rad(-swing)) * jl;

  // ---- BUSTE : il s'incline autour de la hanche. C'est lui qui porte le SENS du geste ----
  const leanR = rad(lean);
  const bustLen = HANCHE_Y - COU_Y; // positif (~32)
  const neckX = Math.sin(leanR) * bustLen;
  const neckY = hipY - Math.cos(leanR) * bustLen;
  // epaule et tete suivent rigidement l'inclinaison du buste (sinon la tete "flotte")
  const epLen = HANCHE_Y - EPAULE_Y;
  const shX = Math.sin(leanR) * epLen;
  const shY = hipY - Math.cos(leanR) * epLen;
  const teteLen = HANCHE_Y - TETE_Y;
  const headX = Math.sin(leanR) * teteLen + 3; // +3 = decalage avant du profil (cf. reference)
  const headY = hipY - Math.cos(leanR) * teteLen;

  // ---- BRAS AVANT : pilote par cible, resolu en IK ----
  const trembleY = tremble > 0.001 ? Math.sin(frame * 1.7) * 2.6 * tremble : 0;
  const trembleX = tremble > 0.001 ? Math.cos(frame * 2.3) * 1.4 * tremble : 0;
  const repos = { x: 5, y: EPAULE_Y + 26 }; // bras le long du corps, legerement devant
  const tgt = handTarget ?? repos;
  const arm = solveArm(shX, shY, tgt.x + trembleX, tgt.y + trembleY, bendDir);

  // ---- BRAS ARRIERE : contrepoids, plus faible opacite (profondeur, comme les 2 jambes) ----
  // ⛔ CORRIGE 2 FOIS. (a) la cible etait d'abord a x=-13, tres en arriere de l'epaule -> l'avant-bras
  // remontait en diagonale et croisait le bras avant : un X sur le torse.
  // (b) Puis, revele SEULEMENT une fois la scene agrandie x5 : avec bend=-1 le coude ressortait de
  // 6.4px PERPENDICULAIREMENT VERS L'ARRIERE (verifie par calcul) -> a l'ecran, deux moignons pales
  // pointant en arriere comme des ailes cassees. Invisible a 76px, grotesque a 415px.
  // Solution : bras quasi VERTICAL le long du corps (x=-2) et bend=+1 pour que le coude tombe vers
  // l'avant comme un vrai bras au repos. La fonction de profondeur (opacity 0.7) est conservee.
  // (meme correction de tension que REPOS_L : un bras au repos doit PENDRE, pas se plier en equerre)
  //
  // ⛔ CORRIGE 3e FOIS — DEFAUT B (retour Aziz : "quand il marche, le coude s'eloigne, il vrille").
  // CAUSE CONFIRMEE PAR LE CALCUL : l'epaule OSCILLE avec le bob de la marche, alors que la cible
  // etait un point FIXE en coordonnees locales. La distance epaule->cible variait donc de 2.5px
  // par cycle — et surtout elle balayait 96.9% -> 105.1% de la portee, c'est-a-dire qu'elle
  // TRAVERSAIT LA BUTEE DE L'IK deux fois par cycle. A chaque passage, le bras basculait entre
  // "clampe tendu" et "libre de se plier" : c'est cette discontinuite qui faisait sortir et
  // vibrer le coude. Ce n'etait pas un mouvement naturel, c'etait un artefact de l'IK.
  //
  // CORRECTION (piste a) : la cible devient SOLIDAIRE DU BOB (on lui applique le meme decalage
  // vertical qu'a l'epaule). La distance epaule->cible est alors RIGOUREUSEMENT CONSTANTE
  // (amplitude mesuree : 0.000px) -> le coude ne peut plus vriller, par construction.
  // Choix de la piste (a) plutot que (b, angle direct sans IK) : (a) est un changement d'une
  // ligne qui conserve exactement la silhouette de repos deja validee et le composant <Membre>,
  // alors que (b) imposerait de re-regler a la main l'angle de chaque bras au repos des 4
  // variantes. On garde donc l'IK, mais on lui donne un probleme stable a resoudre.
  //
  // On AJOUTE un balancement leger et voulu (+/-2.2px en X, oppose aux jambes comme un vrai bras
  // qui accompagne la marche). Verifie par calcul : la distance ne varie alors que de 0.30px et
  // reste a 96.7-97.7% de la portee — jamais en butee. Le bras vit sans que le coude sorte.
  const balanceBras = enMarche ? Math.sin(a) * 2.2 : 0;
  const backArm = solveArm(
    shX, shY,
    -2 + balanceBras,
    EPAULE_Y + 29.5 - bob + autreBrasY,  // <- suit le bob : distance epaule->cible constante
    1,
  );

  return (
    <g transform={`translate(${x} ${y}) scale(${face} 1)`} opacity={opacity}>
      {/* jambe arriere (profondeur : opacity 0.75, exactement comme la reference) */}
      <line x1={0} y1={hipY} x2={j2x} y2={j2y} stroke={ENCRE} strokeWidth={4.5} strokeLinecap="round" opacity={0.75} />
      {/* bras arriere — path unique : plus de pastille au coude (cf. <Membre>) */}
      <Membre ax={shX} ay={shY} bx={backArm.ex} by={backArm.ey} cx={backArm.hx} cy={backArm.hy}
        w={4} opacity={0.7} />
      {/* buste */}
      <line x1={0} y1={hipY} x2={neckX} y2={neckY} stroke={ENCRE} strokeWidth={4.5} strokeLinecap="round" />
      {/* tete */}
      <circle cx={headX} cy={headY} r={TETE_R} fill={ENCRE} />
      {/* jambe avant */}
      <line x1={0} y1={hipY} x2={j1x} y2={j1y} stroke={ENCRE} strokeWidth={4.5} strokeLinecap="round" />
      {/* bras avant : humerus + avant-bras en UN SEUL path (le coude est calcule, il se plie
          tout seul, et la jointure arrondie ne produit plus de pastille — cf. <Membre>) */}
      <Membre ax={shX} ay={shY} bx={arm.ex} by={arm.ey} cx={arm.hx} cy={arm.hy} w={4.5} />
    </g>
  );
};

// Position MONDE de la main avant d'un perso, pour un lean/crouch/cible donnes.
// Doit refleter EXACTEMENT le calcul interne de <Perso> — sinon l'objet flotte a cote de la main.
const mainMonde = (
  px: number, py: number, face: 1 | -1, lean: number, crouch: number, walk: number,
  tgt: { x: number; y: number }, bendDir: 1 | -1,
): { x: number; y: number } => {
  // ⚠️ Ce calcul doit rester le MIROIR EXACT de celui de <Perso>. Toute divergence (un bob oublie,
  // un lean non repercute) fait flotter l'objet a cote de la main au lieu de dedans.
  const a = walk * Math.PI * 2;
  const bob = walk !== 0 ? Math.abs(Math.cos(a)) * 2.5 : 0;
  const drop = crouch * 7;
  const hipY = HANCHE_Y - bob + drop;
  const leanR = rad(lean);
  const epLen = HANCHE_Y - EPAULE_Y;
  const shX = Math.sin(leanR) * epLen;
  const shY = hipY - Math.cos(leanR) * epLen;
  const arm = solveArm(shX, shY, tgt.x, tgt.y, bendDir);
  return { x: px + face * arm.hx, y: py + arm.hy };
};

// ============================================================================================
// L'OBJET — volontairement pauvre (un disque = une piece). Le sujet est le geste, pas l'objet.
// ============================================================================================
const Objet: React.FC<{ x: number; y: number; spin?: number; opacity?: number; glow?: number }> = ({
  x, y, spin = 0, opacity = 1, glow = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${spin})`} opacity={opacity}>
    <circle
      cx={0} cy={0} r={7.5} fill={OR_CLAIR} stroke={OR_CLAIR} strokeWidth={2}
      style={{ filter: glow > 0.02 ? `drop-shadow(0 0 ${8 * glow}px ${OR_CLAIR})` : undefined }}
    />
  </g>
);

// ============================================================================================
// ETIQUETTE — sobre, Georgia serif, comme la reference
// ============================================================================================
// ⛔ CORRIGE (retour Aziz sur le 1er render) : le titre etait a fontSize=44 pour un personnage de
// ~76 unites SVG -> LE LIBELLE FAISAIT PRESQUE LA TAILLE DU PERSONNAGE. La composition disait
// "le texte est le sujet, le geste est une note de bas de page". Or ce lot se juge sur le GESTE.
// Le texte redescend donc au rang de LEGENDE : titre 28, intention 18, remontes en haut du cadre.
const Etiquette: React.FC<{ n: string; titre: string; sous: string; op: number }> = ({ n, titre, sous, op }) => (
  <g opacity={op}>
    <text x={W / 2} y={92} textAnchor="middle" fontFamily="Georgia, serif" fontSize={16} fill={OR_CLAIR}
      letterSpacing={6} opacity={0.7}>{n}</text>
    <text x={W / 2} y={130} textAnchor="middle" fontFamily="Georgia, serif" fontSize={28} fill={ENCRE}
      letterSpacing={3} opacity={0.9}>{titre}</text>
    <text x={W / 2} y={160} textAnchor="middle" fontFamily="Georgia, serif" fontSize={18} fill={ENCRE}
      letterSpacing={1} opacity={0.42} fontStyle="italic">{sous}</text>
  </g>
);

// Sol commun : un simple trait, il ancre les deux corps a la meme hauteur (decision n°3)
// strokeWidth divise par ZOOM : le trait est DANS le groupe agrandi, sans compensation il
// deviendrait une barre epaisse et ecraserait les persos.
const Sol: React.FC<{ op: number }> = ({ op }) => (
  <line x1={860} y1={SOL_Y} x2={1060} y2={SOL_Y} stroke={ENCRE} strokeWidth={2 / ZOOM}
    opacity={0.3 * op} strokeLinecap="round" />
);

// ============================================================================================
// CADRAGE — HOMOTHETIE PURE (correction du 1er render)
// ============================================================================================
// Constat Aziz, verifie : le duo occupait un ruban de ~200px au centre de 1920, soit ~10% du
// cadre, et le perso faisait ~76 unites SVG. A cette echelle, le tremblement de 7px, le
// contre-recul de 11 degres et le micro-relachement d'epaule sont litteralement INVISIBLES.
// J'avais donc juge mes animations dans le CODE au lieu de les juger A L'ECRAN — erreur de
// methode : un geste qu'on ne peut pas voir ne peut pas etre declare lisible.
//
// CORRECTION : on englobe la scene dans un scale autour du centre du duo. C'est une HOMOTHETIE
// PURE — aucune proportion interne du corps, aucun ECART, aucune portee de bras n'est recalculee.
// L'anatomie et la contrainte ECART <= 2*(BRAS_L+AVBRAS_L) restent rigoureusement intactes.
// perso = 83 unites SVG de haut -> a ZOOM 5 il fait 415px a l'ecran (cible 380-450).
const ZOOM = 5;
const CX = 960;                 // centre horizontal du duo
const CY = SOL_Y - 83 / 2;      // centre vertical du perso (mi-hauteur du corps)
// on remonte legerement le duo pour laisser respirer la legende en haut du cadre
const RECENTRE_Y = 44;

// ============================================================================================
// GEOMETRIE DE SCENE — les deux persos se font face, ecart calcule
// ============================================================================================
// L'ecart entre les deux corps est choisi pour que, bras tendus, les deux mains se rejoignent
// EXACTEMENT au milieu. Portee du bras ~30.5px depuis l'epaule ; on laisse une marge pour que le
// geste reste un geste (bras pas bloque a fond) et que la main n'entre jamais dans l'autre corps.
// ⛔ ERREUR CORRIGEE (verifiee par calcul apres 1er render, pas devinee) : la 1ere version posait
// les corps a 160px d'ecart alors que la portee d'un bras est de BRAS_L+AVBRAS_L = 30.5px. Chaque
// bras devait donc couvrir 80px : impossible. L'IK clampait silencieusement la main sur son cercle
// de portee max, et l'objet TRAVERSAIT ~100px de vide entre deux mains qui ne se touchaient jamais.
// C'est precisement l'echec de raccord a eviter. La contrainte est arithmetique, pas esthetique :
//        ECART <= 2 * (BRAS_L + AVBRAS_L) - marge
// Valeurs calculees (dist epaule->milieu vs portee 30.5) : ecart 46 -> bras tendu a 77% ; 54 -> 89% ;
// 58 -> 96% ; 62 -> HORS PORTEE. On retient 54 : les bras se lisent comme franchement TENDUS (le
// geste existe) sans jamais toucher la butee de l'IK, et les deux corps gardent une distance de
// vis-a-vis — a 46 les tetes se frolaient et la scene se lisait comme un aparte, pas comme un
// echange entre deux parties.
const ECART = 54;
const GAUCHE_X = 960 - ECART / 2;
const DROITE_X = 960 + ECART / 2;
const MILIEU_X = (GAUCHE_X + DROITE_X) / 2;   // = 960, le point de rencontre
// ⛔ CORRIGE apres render : a +4 l'objet se retrouvait a hauteur de ventre et se lisait comme
// "pose entre eux" plutot que "tenu". On remonte l'echange a hauteur d'epaule (-2) : c'est la
// hauteur a laquelle on tend reellement quelque chose a quelqu'un.
const MAIN_Y = SOL_Y + EPAULE_Y - 2;          // hauteur de l'echange, a hauteur d'epaule

// cible LOCALE (repere du perso, x = devant lui) pour une position MONDE voulue de la main
const cibleLocale = (px: number, face: 1 | -1, mondeX: number, mondeY: number) => ({
  x: face * (mondeX - px),
  y: mondeY - SOL_Y,
});

// ⛔ CORRIGE apres agrandissement x5 : a {x:5, y:EPAULE+26} le bras au repos n'etait tendu qu'a
// 87%, ce qui projetait le coude 7.6 unites sur le cote = 38px A L'ECRAN. Resultat : un bras plie
// en equerre qui se lisait comme un poing leve, pas comme un bras au repos. On le fait PENDRE
// (97% tendu) : le coude rentre, le bras tombe le long du corps.
const REPOS_L = { x: 2, y: EPAULE_Y + 29.5 };   // bras qui pend le long du corps

// ============================================================================================
// VARIANTE 1 — DONNER LIBREMENT
// ============================================================================================
// PRINCIPE : le donneur reste DROIT (lean = 0 en permanence). Le bras s'etend, la main arrive au
// milieu, l'objet passe, le bras revient. Le receveur avance juste la main, sans avancer le corps.
// Le fait que le tronc du donneur ne bouge PAS est ce qui dit "il donne" : rien ne le contraint,
// rien ne le retient. Le seul accent est un tres leger relachement d'epaule apres la remise.
const V1: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  // 0.0 bras au repos | 0.4 le bras part | 1.4 la main est au milieu | 1.9 relais
  // 2.4 le receveur ramene | 3.0 le donneur redescend le bras
  const tend = interpolate(f, [S(0.4), S(1.5)], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const retire = interpolate(f, [S(2.3), S(3.3)], [0, 1], { ...clamp, easing: (t) => t * t });
  const ext = tend * (1 - retire);

  // main du DONNEUR : du repos vers le milieu
  const dHandLocal = {
    x: interpolate(ext, [0, 1], [REPOS_L.x, cibleLocale(GAUCHE_X, 1, MILIEU_X, MAIN_Y).x], clamp),
    y: interpolate(ext, [0, 1], [REPOS_L.y, cibleLocale(GAUCHE_X, 1, MILIEU_X, MAIN_Y).y], clamp),
  };
  // main du RECEVEUR : elle vient a la rencontre, un peu plus tard (il attend qu'on lui tende)
  const rTend = interpolate(f, [S(1.0), S(1.9)], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const rRamene = interpolate(f, [S(2.35), S(3.2)], [0, 1], { ...clamp, easing: (t) => t * t });
  const rTargetX = interpolate(rRamene, [0, 1], [cibleLocale(DROITE_X, -1, MILIEU_X, MAIN_Y).x, REPOS_L.x + 4], clamp);
  const rTargetY = interpolate(rRamene, [0, 1], [cibleLocale(DROITE_X, -1, MILIEU_X, MAIN_Y).y, EPAULE_Y + 14], clamp);
  const rHandLocal = {
    x: interpolate(rTend, [0, 1], [REPOS_L.x, rTargetX], clamp),
    y: interpolate(rTend, [0, 1], [REPOS_L.y, rTargetY], clamp),
  };

  // positions MONDE reelles des deux mains
  const mainD = mainMonde(GAUCHE_X, SOL_Y, 1, 0, 0, 0, dHandLocal, 1);
  const mainR = mainMonde(DROITE_X, SOL_Y, -1, 0, 0, 0, rHandLocal, 1);
  // RELAIS : grip 0 -> l'objet est dans la main du donneur ; 1 -> dans celle du receveur.
  // La bascule se fait sur 6 frames, PENDANT que les deux mains sont au meme point : aucun saut.
  const grip = interpolate(f, [S(1.9), S(2.1)], [0, 1], clamp);
  const objX = mainD.x + (mainR.x - mainD.x) * grip;
  const objY = mainD.y + (mainR.y - mainD.y) * grip;

  // micro-relachement d'epaule du donneur apres la remise (il a lache, son corps se detend)
  const relache = spring({ frame: f - S(2.1), fps, config: { mass: 0.8, damping: 12, stiffness: 90 } });
  const leanD = f >= S(2.1) ? relache * 1.6 : 0;

  return (
    <>
      <Perso x={GAUCHE_X} y={SOL_Y} face={1} walk={0} handTarget={dHandLocal} lean={leanD} frame={f} />
      <Perso x={DROITE_X} y={SOL_Y} face={-1} walk={0} handTarget={rHandLocal} lean={0} frame={f} />
      <Objet x={objX} y={objY} glow={interpolate(f, [S(1.75), S(2.1), S(2.6)], [0, 0.9, 0], clamp)} />
    </>
  );
};

// ============================================================================================
// VARIANTE 2 — RECEVOIR
// ============================================================================================
// PRINCIPE : ici le sujet n'est pas le donneur (il est passif, bras deja tendu des le depart) —
// c'est le RECEVEUR. Et un receveur ne tend pas seulement la main : IL AVANCE. Le corps entier
// se deplace de ~34px vers le donneur (marche reelle, ciseau des jambes), prend, PUIS RECULE en
// ramenant l'objet contre son buste. Le retour vers soi est le geste qui signe "recevoir" :
// l'objet finit COLLE au corps, pas tendu dans le vide.
const V2: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  // le donneur est deja la, bras tendu, immobile : il PROPOSE, il n'agit pas
  const dHandLocal = cibleLocale(GAUCHE_X, 1, MILIEU_X - 6, MAIN_Y);

  // ⛔ CORRIGE (defaut n°1, retour Aziz "ils tremblent / ils ont du mal a faire les pas") :
  // avant, rX venait d'un interpolate en PIXELS et walkR d'un cycle independant `% 1`. Les deux
  // etant decouples, le pied d'appui glissait -> patinage lu comme tremblement a x5.
  // Maintenant on interpole un NOMBRE DE PAS, et la position en decoule (verrou pas/distance).
  //   aller  : 2.5 pas = 49.7px de retrait comble  (il arrive pile a DROITE_X)
  //   retour : 2.0 pas = 39.8px de recul
  // Les pas sont ENTIERS-et-demi pour que le cycle se termine sur un appui franc, jamais au
  // milieu d'une enjambee.
  const PAS_ALLER = 2.5;
  const PAS_RETOUR = 2.0;
  // ⛔ 2e correction, DEFAUT PREEXISTANT trouve en verifiant le verrou par le calcul (il n'a pas
  // ete introduit par le passage au verrou — l'ancienne formule `46 * (1 - avance)` posait elle
  // aussi le receveur exactement a DROITE_X a l'arrivee). A cette position, la distance
  // epaule->cible vaut 33.1 pour une portee de 30.5 : le bras etait DEMANDE A 108%, donc l'IK
  // clampait silencieusement la main sur son cercle de portee max. Un bras bloque en butee ne
  // "tient" pas une pose, il colle a une contrainte — et le moindre mouvement du bassin (le bob)
  // le fait glisser le long du cercle. C'est la 2e source du tremblement signale par Aziz, celle
  // qui subsiste QUAND LE BRAS EST TENDU IMMOBILE.
  // Le receveur vise MILIEU_X - 6 (cible decalee vers le donneur) : il doit donc s'arreter 6px
  // PLUS PRES que DROITE_X, pas plus loin. Resolu par balayage : rX = DROITE_X - 6 donne 89% de
  // tension — exactement la valeur deja validee sur la V1 et la V4. Bras franchement tendu, mais
  // jamais en butee.
  const ARRET_R = -6;
  const avance = interpolate(f, [S(0.3), S(1.5)], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const recule = interpolate(f, [S(2.35), S(3.5)], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  // compteur de pas continu : il monte pendant l'aller, puis repart pendant le retour.
  // Le SENS de marche differe (il avance vers la gauche, il recule vers la droite) mais la phase
  // continue de progresser : on ne remet jamais le compteur a zero en cours de scene, sinon la
  // jambe sauterait d'une pose a l'autre.
  const pasR = avance * PAS_ALLER + recule * PAS_RETOUR;
  const mR = marche(pasR);
  // aller : les 2.5 pas sont parcourus en entier (le verrou est exact), et c'est le POINT DE
  // DEPART qui est recule de ARRET_R — ainsi le nombre de pas reste rond et l'arrivee tombe a
  // DROITE_X + ARRET_R, hors butee de l'IK.
  const rX = DROITE_X + ARRET_R + PAS_ALLER * PAS_L - avance * PAS_ALLER * PAS_L
    + recule * PAS_RETOUR * PAS_L;
  // il ne "marche" (jambes en ciseau) que pendant qu'il se deplace reellement ; a l'arret la
  // phase est figee a 0 -> <Perso> retombe sur sa STANCE de 7 deg, pieds plantes, zero micro-mvt.
  const enDeplacement = (f > S(0.3) && f < S(1.5)) || (f > S(2.35) && f < S(3.5));
  const walkR = enDeplacement ? mR.walk : 0;

  // la main du receveur : vers le milieu, puis RETOUR CONTRE LE BUSTE (le geste de "prendre pour soi")
  const rTend = interpolate(f, [S(0.6), S(1.7)], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const versSoi = interpolate(f, [S(2.3), S(3.2)], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const cibleRencontre = cibleLocale(rX, -1, MILIEU_X - 6, MAIN_Y);
  // ⛔ CORRIGE apres render : a x=9 la main "contre soi" passait DERRIERE l'axe du corps (le perso
  // regarde vers la gauche), et l'objet se retrouvait dessine du mauvais cote du buste, comme s'il
  // flottait dans son dos. On garde la main franchement DEVANT le torse (x=17) : l'objet reste du
  // cote visible, serre contre la poitrine, ce qui est exactement le geste de "prendre pour soi".
  const cibleContreSoi = { x: 17, y: EPAULE_Y + 12 }; // main serree contre la poitrine
  const rHandLocal = {
    x: interpolate(rTend, [0, 1], [REPOS_L.x, cibleRencontre.x], clamp) * (1 - versSoi) + cibleContreSoi.x * versSoi,
    y: interpolate(rTend, [0, 1], [REPOS_L.y, cibleRencontre.y], clamp) * (1 - versSoi) + cibleContreSoi.y * versSoi,
  };

  const mainD = mainMonde(GAUCHE_X, SOL_Y, 1, 0, 0, 0, dHandLocal, 1);
  const mainR = mainMonde(rX, SOL_Y, -1, 0, 0, walkR, rHandLocal, 1);
  const grip = interpolate(f, [S(1.85), S(2.05)], [0, 1], clamp);
  const objX = mainD.x + (mainR.x - mainD.x) * grip;
  const objY = mainD.y + (mainR.y - mainD.y) * grip;

  // le donneur baisse le bras une fois delivre (il n'a plus rien a tenir)
  const dBaisse = interpolate(f, [S(2.5), S(3.4)], [0, 1], { ...clamp, easing: (t) => t * t });
  const dFinal = {
    x: dHandLocal.x * (1 - dBaisse) + REPOS_L.x * dBaisse,
    y: dHandLocal.y * (1 - dBaisse) + REPOS_L.y * dBaisse,
  };

  // petit encaissement du receveur au moment de la prise (le poids arrive dans la main)
  const encaisse = spring({ frame: f - S(2.0), fps, config: { mass: 1, damping: 10, stiffness: 130 } });
  const crouchR = f >= S(2.0) ? Math.max(0, Math.sin(encaisse * Math.PI) * 0.35) : 0;

  return (
    <>
      <Perso x={GAUCHE_X} y={SOL_Y} face={1} walk={0} handTarget={dFinal} lean={0} frame={f} />
      <Perso x={rX} y={SOL_Y} face={-1} walk={walkR} handTarget={rHandLocal} lean={versSoi * -3} crouch={crouchR} frame={f} />
      <Objet x={objX} y={objY} glow={interpolate(f, [S(1.7), S(2.05), S(2.7)], [0, 0.9, 0], clamp)} />
    </>
  );
};

// ============================================================================================
// VARIANTE 3 — TENDRE LA MAIN SANS RIEN RECEVOIR
// ============================================================================================
// PRINCIPE : la variante la plus forte narrativement, et la plus dure a animer — parce que le
// sujet est L'ABSENCE d'evenement. Il n'y a pas de geste a reussir : il y a une DUREE a tenir.
// Ce qui la fait exister :
//   a) le bras monte NET (l'espoir est franc), puis PLUS RIEN pendant plus de 2 secondes ;
//   b) la fatigue : la main descend tres lentement (7px sur 3s) — trop lent pour etre vu frame a
//      frame, assez pour etre ressenti sur la duree ;
//   c) le tremblement s'installe progressivement (tenir un bras tendu coute) ;
//   d) l'autre perso ne fait RIEN. Pas de refus, pas de recul : il regarde ailleurs (sa tete est
//      son seul mouvement, un tres lent detournement). L'indifference se lit mieux que le refus.
//   e) a la fin le bras retombe, seul, sans qu'aucun objet ne soit jamais apparu.
const V3: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const monte = spring({ frame: f - S(0.3), fps, config: { mass: 0.9, damping: 14, stiffness: 110 } });
  // l'attente : de 1.2s a 4.2s, le bras est tendu et il ne se passe rien
  const fatigue = interpolate(f, [S(1.3), S(4.3)], [0, 1], clamp);
  const abandon = interpolate(f, [S(4.4), S(5.4)], [0, 1], { ...clamp, easing: (t) => t * t * t });

  const cible = cibleLocale(GAUCHE_X, 1, MILIEU_X + 6, MAIN_Y);
  const tendu = {
    x: cible.x,
    y: cible.y + fatigue * 7,   // (b) la main descend imperceptiblement
  };
  const dHandLocal = {
    x: (REPOS_L.x + (tendu.x - REPOS_L.x) * monte) * (1 - abandon) + REPOS_L.x * abandon,
    y: (REPOS_L.y + (tendu.y - REPOS_L.y) * monte) * (1 - abandon) + REPOS_L.y * abandon,
  };
  // (c) le tremblement s'installe seulement une fois le bras tendu, et croit avec la fatigue
  // ⛔ CORRIGE — DEFAUT A (retour Aziz : "la main tendue tremble enormement, elle n'est pas nette").
  // CAUSE MESUREE : l'amplitude (1.15) etait appliquee a la CIBLE de la main, or le bras est
  // quasi tendu -> l'IK AMPLIFIE le moindre deplacement de cible. Mesure sur frames consecutives :
  // la main se deplacait de 4.55 unites SVG entre 2 frames, soit 22.8 px A L'ECRAN a l'echelle x5.
  // Ce n'est pas une main qui fatigue, c'est une main qui bat l'air.
  //
  // CORRECTION EN DEUX TEMPS :
  //  1. AMPLITUDE divisee par 5 (1.15 -> 0.23) : ramene le deplacement a ~4.4 px/frame a l'ecran,
  //     une vibration fine et perceptible au lieu d'un battement.
  //  2. APPARITION TARDIVE : le tremblement ne suit plus `fatigue` (qui demarre des 1.3s) mais sa
  //     propre courbe, qui ne demarre qu'a 2.4s et monte en quadratique (t^2). Consequence : quand
  //     le bras se tend, il est NET ET DROIT — exactement ce que demande Aziz ; la fatigue n'est
  //     plus l'etat permanent du bras mais un evenement tardif et progressif.
  //     (1ere tentative en cubique t^3 : mesure au render = tremblement invisible jusqu'a 4.0s,
  //     donc lisible sur 0.3s seulement avant que le bras ne retombe. La quadratique le rend
  //     perceptible sur les ~1.5 dernieres secondes, ce qui est la duree ou l'attente pese.)
  const fatigueTremble = interpolate(f, [S(2.4), S(4.3)], [0, 1], { ...clamp, easing: (t) => t * t });
  const tremble = monte * fatigueTremble * (1 - abandon) * 0.30;
  // le corps du demandeur se penche tres legerement vers l'avant pendant l'attente (il insiste)
  const leanD = monte * (1 - abandon) * (1.5 + fatigue * 2.5);

  // (d) l'autre : immobile. Son unique mouvement est un lent detournement de la tete, obtenu
  // en inclinant son buste de 4 degres EN ARRIERE — a cette echelle c'est tout ce qui se lit,
  // et ca suffit a dire "il se retire de l'echange".
  const detourne = interpolate(f, [S(1.6), S(3.4)], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });

  return (
    <>
      <Perso x={GAUCHE_X} y={SOL_Y} face={1} walk={0} handTarget={dHandLocal} lean={leanD}
        tremble={tremble} frame={f} />
      {/* ⛔ CORRIGE apres agrandissement : avec handTarget={null} le bras au repos suivait
          l'inclinaison du buste et son avant-bras remontait vers l'avant -> lu comme une main
          levee (donc une reaction), alors que TOUT le sens de la variante est qu'il ne reagit
          PAS. On lui impose une cible de main qui PEND franchement, contre-compensee de
          l'inclinaison du buste : quoi qu'il fasse, son bras reste mort le long du corps. */}
      <Perso x={DROITE_X} y={SOL_Y} face={-1} walk={0}
        handTarget={{ x: 2 + 4 * detourne, y: EPAULE_Y + 29.5 }} lean={-4 * detourne} frame={f} />
      {/* AUCUN OBJET. C'est le point : le cadre reste vide entre les deux mains. */}
    </>
  );
};

// ============================================================================================
// VARIANTE 4 — SE FAIRE DELESTER (donner a contrecoeur)
// ============================================================================================
// PRINCIPE : le bras est le MEME que dans la V1. Absolument rien n'y est change. Ce qui bascule
// le sens est entierement dans le TRONC et dans le TIMING :
//   - le porteur tient l'objet CONTRE LUI (pas tendu) : il ne propose pas, il garde ;
//   - le preneur AVANCE sur lui (le deplacement est agressif : rapide, il ne s'arrete pas a
//     distance polie, il entre dans l'espace de l'autre) ;
//   - la PRISE : la main du preneur se ferme sur l'objet et TIRE. Pendant ~0.5s le porteur est
//     TIRE VERS L'AVANT (son buste s'incline de 11 degres, son corps glisse de 8px) : c'est la
//     resistance, le seul moment ou l'on voit que ce n'est pas un don ;
//   - LE LACHER : quand l'objet part, le porteur REBONDIT en arriere (spring). Ce contre-recul
//     est LE signe qu'il retenait. Un don ne produit jamais de contre-recul.
//   - il reste ensuite la main ouverte dans le vide, une seconde de trop.
const V4: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  // le preneur fond sur le porteur. Il part de loin et vient COLLER l'autre — il finit plus pres
  // que la distance polie de la V2, c'est cette intrusion qui est agressive.
  // ⛔ CORRIGE (defaut n°1) : meme verrou pas/distance que la V2. Avant, pX etait un interpolate
  // en pixels et walkP un cycle independant a cadence differente (0.5s) : le decouplage etait
  // encore PIRE ici que dans la V2, donc le tremblement plus visible.
  //   fonce  : 2.5 pas = 49.7px -> il arrive 8px plus pres que la distance polie (intrusion)
  //   repart : 3.5 pas = 69.6px -> il s'en va franchement
  const PAS_FONCE = 2.5;
  const PAS_REPART = 3.5;
  const INTRUSION = 8;
  const fonce = interpolate(f, [S(0.5), S(1.6)], [0, 1], { ...clamp, easing: (t) => t * t });
  const repart = interpolate(f, [S(2.7), S(4.0)], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const pasP = fonce * PAS_FONCE + repart * PAS_REPART;
  const mP = marche(pasP);
  const pX = DROITE_X + PAS_FONCE * PAS_L - fonce * (PAS_FONCE * PAS_L + INTRUSION)
    + repart * PAS_REPART * PAS_L;
  const enDeplacement = (f > S(0.5) && f < S(1.6)) || (f > S(2.7) && f < S(4.0));
  const walkP = enDeplacement ? mP.walk : 0;

  // === LE PORTEUR : il TIENT l'objet contre lui ===
  const gardeLocal = { x: 12, y: EPAULE_Y + 15 };  // main pres du corps = possession
  // le tir : de 1.75 a 2.3 le preneur tire, l'objet resiste puis lache a 2.3
  const tir = interpolate(f, [S(1.75), S(2.3)], [0, 1], { ...clamp, easing: (t) => t * t });
  const lache = f >= S(2.3);
  // pendant le tir, la main du porteur est ARRACHEE vers l'avant (elle suit l'objet malgre lui)
  const cibleTiree = cibleLocale(GAUCHE_X, 1, MILIEU_X - 4, MAIN_Y - 2);
  const relache = spring({ frame: f - S(2.3), fps, config: { mass: 1, damping: 8, stiffness: 120 } });
  // apres le lacher, la main reste ouverte dans le vide, puis retombe tres tard (1s de trop)
  const retombe = interpolate(f, [S(3.6), S(4.6)], [0, 1], { ...clamp, easing: (t) => t * t });
  const dRaw = {
    x: gardeLocal.x + (cibleTiree.x - gardeLocal.x) * tir,
    y: gardeLocal.y + (cibleTiree.y - gardeLocal.y) * tir,
  };
  const dHandLocal = {
    x: dRaw.x * (1 - retombe) + REPOS_L.x * retombe,
    y: dRaw.y * (1 - retombe) + REPOS_L.y * retombe,
  };

  // === LA RESISTANCE PUIS LE CONTRE-RECUL : c'est ca, tout le sens de la variante ===
  // tire vers l'avant pendant le tir (+11 deg), puis rebond arriere amorti au lacher.
  const leanTire = tir * 11;
  const rebond = lache ? Math.exp(-relache * 3.2) * Math.sin(relache * 13) * 15 : 0;
  const leanPorteur = leanTire * (1 - Math.min(1, relache * 1.4)) - rebond;
  // son corps entier glisse de 8px vers le preneur pendant le tir, puis revient
  const dX = GAUCHE_X + 8 * tir * (1 - Math.min(1, relache * 1.2));

  // === LE PRENEUR : sa main va CHERCHER l'objet dans la main du porteur ===
  const attrape = interpolate(f, [S(1.0), S(1.75)], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  // pendant le tir, sa main recule en tirant (elle ramene vers lui)
  const tireVersSoi = interpolate(f, [S(1.75), S(2.55)], [0, 1], { ...clamp, easing: (t) => t * t });
  const empoigne = cibleLocale(pX, -1, MILIEU_X - 8, MAIN_Y - 2); // il va CHEZ l'autre
  const versSoiP = { x: 17, y: EPAULE_Y + 13 }; // devant le torse (cf. correction V2)
  const pMid = {
    x: REPOS_L.x + (empoigne.x - REPOS_L.x) * attrape,
    y: REPOS_L.y + (empoigne.y - REPOS_L.y) * attrape,
  };
  const pHandLocal = {
    x: pMid.x * (1 - tireVersSoi) + versSoiP.x * tireVersSoi,
    y: pMid.y * (1 - tireVersSoi) + versSoiP.y * tireVersSoi,
  };
  // le preneur se penche en avant pendant qu'il tire (il met du corps dedans), puis se redresse
  const leanPreneur = tir * 8 * (1 - tireVersSoi * 0.7);

  // === L'OBJET : le relais est ici DISPUTE, mais reste continu ===
  // grip passe de 0 a 1 exactement a l'instant du lacher (2.3s). Avant, l'objet est dans la main
  // du porteur qui se fait tirer : il bouge donc DEJA, mais avec le corps du porteur — c'est ca
  // qui rend le tir lisible.
  const mainPorteur = mainMonde(dX, SOL_Y, 1, leanPorteur, 0, 0, dHandLocal, 1);
  const mainPreneur = mainMonde(pX, SOL_Y, -1, leanPreneur, 0, walkP, pHandLocal, 1);
  const grip = interpolate(f, [S(2.28), S(2.42)], [0, 1], clamp);
  const objX = mainPorteur.x + (mainPreneur.x - mainPorteur.x) * grip;
  const objY = mainPorteur.y + (mainPreneur.y - mainPorteur.y) * grip;
  // l'objet vibre pendant le tir (les deux mains dessus) — deterministe, pas de random
  const dispute = tir * (1 - grip);
  const vib = dispute > 0.02 ? Math.sin(f * 3.1) * 2.2 * dispute : 0;

  return (
    <>
      <Perso x={dX} y={SOL_Y} face={1} walk={0} handTarget={dHandLocal} lean={leanPorteur} frame={f} />
      <Perso x={pX} y={SOL_Y} face={-1} walk={walkP} handTarget={pHandLocal} lean={leanPreneur} frame={f} />
      <Objet x={objX + vib} y={objY} glow={interpolate(f, [S(2.0), S(2.35), S(3.0)], [0, 1, 0], clamp)} />
    </>
  );
};

// ============================================================================================
// PLANCHE COMPARATIVE
// ============================================================================================
const VARIANTES: {
  n: string; titre: string; sous: string; dur: number;
  C: React.FC<{ f: number; fps: number }>;
}[] = [
  { n: "I", titre: "DONNER LIBREMENT", sous: "le corps ne bouge pas — rien ne le retient", dur: 5.0, C: V1 },
  { n: "II", titre: "RECEVOIR", sous: "il avance, il prend, il ramène vers soi", dur: 5.4, C: V2 },
  { n: "III", titre: "TENDRE LA MAIN SANS RECEVOIR", sous: "l'attente qui dure — aucun objet n'arrive", dur: 6.6, C: V3 },
  { n: "IV", titre: "SE FAIRE DÉLESTER", sous: "le corps résiste, puis rebondit quand ça lâche", dur: 5.6, C: V4 },
];

const OFFSETS = VARIANTES.reduce<number[]>((acc, v, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + S(VARIANTES[i - 1].dur));
  return acc;
}, []);

export const GESTES_ECHANGE_FRAMES =
  OFFSETS[OFFSETS.length - 1] + S(VARIANTES[VARIANTES.length - 1].dur);

const Bloc: React.FC<{ v: (typeof VARIANTES)[number]; dur: number }> = ({ v, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // fondu d'entree/sortie court : on ne perd pas de temps de lecture du geste
  const op = interpolate(f, [0, 9, dur - 10, dur], [0, 1, 1, 0], clamp);
  const C = v.C;
  return (
    <g opacity={op}>
      {/* la legende reste a l'echelle 1 (hors du groupe zoome) : c'est une LEGENDE, pas le sujet */}
      <Etiquette n={v.n} titre={v.titre} sous={v.sous} op={interpolate(f, [4, 16], [0, 1], clamp)} />
      {/* LE GESTE, agrandi par homothetie pure autour du centre du duo */}
      <g transform={`translate(${CX} ${CY - RECENTRE_Y}) scale(${ZOOM}) translate(${-CX} ${-CY})`}>
        <Sol op={1} />
        <C f={f} fps={fps} />
      </g>
    </g>
  );
};

export const GestesEchange16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 12, GESTES_ECHANGE_FRAMES - 14, GESTES_ECHANGE_FRAMES], [0, 1, 1, 0], clamp);

  // etoiles discretes, meme registre que la reference (seed fixe = deterministe)
  const stars = React.useMemo(() => {
    const a: { x: number; y: number; r: number; o: number }[] = [];
    let s = 17;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 44; i++) {
      a.push({ x: rnd() * W, y: rnd() * H * 0.72, r: rnd() * 1.3 + 0.4, o: rnd() * 0.3 + 0.12 });
    }
    return a;
  }, []);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, ${NUIT} 0%, ${NUIT2} 100%)`, opacity: op }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={ENCRE} opacity={s.o} />)}
        <text x={W / 2} y={1032} textAnchor="middle" fontFamily="Georgia, serif" fontSize={17} fill={ENCRE}
          letterSpacing={7} opacity={0.26}>L'ÉCHANGE — UN GESTE, QUATRE SENS</text>
      </svg>
      {VARIANTES.map((v, i) => (
        <Sequence key={v.n} from={OFFSETS[i]} durationInFrames={S(v.dur)}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
            <Bloc v={v} dur={S(v.dur)} />
          </svg>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export default GestesEchange16x9;
