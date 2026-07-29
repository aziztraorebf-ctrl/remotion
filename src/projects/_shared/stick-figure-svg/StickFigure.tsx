// ============================================================================================
// SOCLE COMMUN — LE PERSONNAGE STICK FIGURE (extrait le 2026-07-26)
// ============================================================================================
//
// ⭐⭐ VOUS VOULEZ HABILLER UN PERSONNAGE (vetement, coiffe, accessoire, objet tenu) ?
//     -> ./habillage.ts      (bodyPoints + les 4 regles d'occlusion + l'ordre de rendu)
//     -> ./identite/Roles.tsx (4 roles DEJA FAITS + 7 objets + PersonnageRole cle en main)
//     ⛔ NE RECALCULEZ PAS hanche/epaule/tete a la main : `bodyPoints()` le fait deja, avec les
//        memes formules que <Figure>. Improviser coute cher — mesure le 2026-07-28 : un
//        vetement dessine "au juge" a avale le torse et les deux bras (occlusion), 3 tentatives
//        ratees pour un probleme deja resolu dans Roles.tsx.
//
// ⚠️ LIMITE CONNUE DU SOCLE — `BRAS_LAG` EST EXPORTE MAIS `Figure` NE L'APPLIQUE PAS.
//    Les bras automatiques valent -sin(a)*armSwing, avec le MEME `a` que les jambes : les deux
//    s'annulent donc simultanement 2x par cycle -> ~9% de chaque cycle en POSE DEGENEREE (le
//    personnage se lit comme un trait vertical surmonte d'une tete). Mesure 2026-07-28 : 62 a 84
//    frames sur 720 par marcheur. Parade cote APPELANT (ne pas modifier le socle sans revalider
//    les 6 planches) : passer arm1Deg/arm2Deg dephases de BRAS_LAG, en soustrayant le torso que
//    Figure ré-ajoute aux angles manuels. ⛔ NE PAS "corriger" par un plancher dur sur le swing :
//    ca ecrase l'oscillation des jambes et produit un glissement (anti-pattern deja documente).
//
// POURQUOI CE FICHIER EXISTE : les 6 planches R&D stick figure (gestes/, interactions/,
// identite/) sont 6 COPIES INDEPENDANTES du meme personnage — chaque agent a recopie les
// constantes au lieu d'importer un composant partage. Resultat : derive silencieuse (Aziz l'a
// detectee a l'oeil : "les personnages semblent marcher plus lentement, moins naturellement,
// le mouvement des bras n'est pas ce qu'il faudrait"), et un vrai bug (verrou pas/distance
// recopie sans tenir compte du facteur d'echelle -> marche sur place).
//
// CE FICHIER EST LA SOURCE UNIQUE pour tout NOUVEAU code stick figure. Les 6 planches
// existantes ne sont PAS recablees dessus (decision Aziz : validees et archivees, ne pas
// risquer de casser du valide pour un benefice invisible a l'ecran) — mais tout ce qui se code
// APRES ce jour doit importer d'ici.
//
// SOURCE FAISANT AUTORITE : gestes/GestesLocomotion16x9.tsx (validee par Aziz — "la marche
// fonctionne parfaitement bien, surtout la marche rapide avec le corps penche", "porter/
// pousser/tirer, impressionnantes, 100% satisfait"). Toute divergence entre fichiers a ete
// tranchee EN FAVEUR de Locomotion, SAUF le <Membre>/solveArm (voir § DIVERGENCES ci-dessous).
//
// --------------------------------------------------------------------------------------------
// CONVENTION D'ANGLE (LA regle a ne jamais casser — bug vecu 2x : mains 28px au-dessus de
// l'epaule, "oreilles de lapin", parce que deux fichiers du meme registre utilisaient 2
// conventions opposees) :
//
//     angle = 0   -> le membre PEND (verticale, vers le bas)
//     angle = 90  -> le membre est A L'HORIZONTALE, vers l'AVANT (sens de marche, +x local)
//     angle = 180 -> le membre est LEVE (verticale, vers le haut)
//
// Formule dans le repere local du perso (origine = hanche, y negatif = vers le haut, sol a
// y=0) : bout = origine + (sin(angle)*longueur, cos(angle)*longueur). C'est la convention de
// GestesLocomotion16x9 et de GroupeFoule16x9. GestesExpressifs16x9 utilise l'INVERSE
// (180 = leve devient bras vers le haut avec un signe different) — NE PAS COPIER cette
// convention-la dans du code nouveau.
//
// --------------------------------------------------------------------------------------------
// UNITE DU DEPLACEMENT ET PIEGE DU SCALE (le bug vecu qui motive ce paragraphe) :
//
// stepLength() rend une distance en UNITES LOCALES DU SQUELETTE (les memes unites que L, les
// memes que les coordonnees SVG internes a <Figure>). Le squelette de reference (L=34) a ete
// dessine pour un rendu ou <Figure> est utilisee SANS scale (scale=1) OU dont le deplacement
// x(t) est calcule dans le MEME repere que le scale applique au groupe SVG parent.
//
// Le bug concret : un fichier calculait PAS_L en unites locales (avec L=34, donc PAS_L≈19.88px)
// puis rendait le perso avec `scale(5)` sur le <g> englobant SANS multiplier PAS_L par ce
// meme 5 — le perso animait ses jambes a la bonne cadence, mais son delta-x-a-l'ecran restait
// 5x plus petit que ce que son pas balayait visuellement -> il patinait sur place.
//
// PARADE ADOPTEE ICI : stepLength() reste en unites LOCALES (elle ne connait pas le rendu), et
// walkDistance()/useWalkX() ci-dessous prennent un parametre `scale` EXPLICITE et OBLIGATOIRE
// (pas de valeur par defaut) pour calculer le deplacement A L'ECRAN. Impossible d'oublier le
// facteur d'echelle : si vous avez un <g scale(k)>, vous DEVEZ passer `scale: k` a walkDistance
// pour que le x que vous animez EN DEHORS du <g> (ou dans le meme repere que le <g>) corresponde
// a la vraie distance parcourue par le pas dessine DANDS <Figure>. Si vous animez x DANS le
// repere local (a l'interieur du <g scale(k)>, ce que fait GestesLocomotion16x9 lui-meme —
// Figure prend x/y en coordonnees DEJA a l'echelle 1 et applique scale a l'interieur de son
// propre <g>), passez scale: 1 (ou utilisez stepLength() directement, ce sont les memes unites).
// Dans le doute : le nombre de pixels que stepLength() rend DOIT correspondre au nombre de
// pixels que le x de votre <Figure x=... /> avance par pas — verifiez-le en superposant deux
// frames consecutives, jamais par le calcul seul (cf. § VERIFICATION plus bas).
//
// --------------------------------------------------------------------------------------------
// LES 5 BRIQUES DU SOCLE :
//   1. VERROU PAS/DISTANCE (stepLength) — la marche N'EST PAS un deplacement anime a cote d'un
//      cycle de jambes ; le deplacement est DERIVE du nombre de pas ecoules. Voir walkDistance().
//   2. IK 2 SEGMENTS (solveArm) — pour un bras qui doit ATTEINDRE un point precis (donner/
//      recevoir/porter), on resout l'angle du coude plutot que de le deviner. Absent de
//      GestesLocomotion16x9 (qui pilote les bras par angle direct, cf. Pose.arm1Deg) ; repris de
//      GestesEchange16x9 pour les cas ou une main doit toucher un point du monde.
//   3. LERP D'OBJET — un objet tenu (sac/caisse/corde) ne doit jamais "sauter" d'un parent a un
//      autre ; sa position est une interpolation continue entre 2 points d'ancrage (cf.
//      GestesEchange16x9 § "grip"). Pas encapsule ici (trop specifique au geste), mais le
//      principe doit etre suivi par tout code qui anime un objet tenu.
//   4. POSES-CLES > SPRINGS ACCUMULES — ne jamais sommer plusieurs springs sur le MEME angle
//      (ca derive et ne retombe jamais sur une silhouette propre). Definir des poses-cles
//      verifiees par calcul (Pose complets), puis interpoler/springer ENTRE elles
//      sequentiellement. Voir le motif dans GestesLocomotion16x9 § GESTE 3 (mix() sequentiel).
//   5. BRUIT DETERMINISTE — zero Math.random. Toute variation vient de l'index, de la frame, ou
//      d'un PRNG a graine fixe (cf. les etoiles de fond dans les planches).
//
// --------------------------------------------------------------------------------------------
// REGLES DURES (bugs deja vecus, a ne pas reproduire) :
//   - Epaisseurs ADDITIVES, jamais multiplicatives (multiplicateurs composes -> jusqu'a ~8x
//     l'epaisseur de base, masse informe). Si vous devez epaissir un trait, ADDITIONNEZ un delta
//     fixe, ne multipliez pas un strokeWidth par un autre facteur variable.
//   - Bras au repos SOLIDAIRE DU BOB de l'epaule (meme decalage vertical que l'epaule), sinon le
//     coude "vrille" en marchant (la distance epaule->cible oscille et traverse la butee de
//     l'IK). Voir backArm dans GestesEchange16x9.
//   - JAMAIS au-dela de ~97% de la portee max de l'IK (bras en butee = il glisse/tremble d'une
//     frame a l'autre). solveArm() clampe deja la cible sur le cercle de portee max — ne PAS
//     pousser une cible connue hors de portee sans marge.
//   - Plancher du swing de marche ~16 deg SOUS lequel les jambes se superposent (pose degeneree,
//     un marcheur en foule se lit comme un poteau immobile). ⚠️ NE JAMAIS implementer ca comme un
//     plancher DUR sur le swing (ecrase l'oscillation -> glissement, bug vecu et corrige). La
//     bonne parade est le DEPHASAGE bras/jambes : voir walkPose() / BRAS_LAG ci-dessous, repris
//     de GroupeFoule16x9.
//
// --------------------------------------------------------------------------------------------
// PROFIL UNIQUEMENT (decision d'Aziz, 2026-07-26) : "Mieux vaut garder les personnages juste de
// profil. De dos ne marche pas du tout. Profil et trois-quarts sont litteralement la meme chose,
// donc gardons le profil." Ce socle ne gere QUE <Figure> (profil, marche/gestes) et
// <FigureFace> (face, IMMOBILE uniquement — un acquis de GroupeFoule16x9, PAS pour marcher).
// N'implementez ni trois-quarts ni de-dos ici.
//
// --------------------------------------------------------------------------------------------
// TECHNIQUE : Remotion frame-driven (aucun Math.random, aucune CSS transition/setTimeout/
// @keyframes). Palette identique au registre CFA (fond nuit, encre claire, accents or/cuivre) —
// exportee ci-dessous mais libre a chaque planche de la surcharger via `color`.
import React from "react";

// ============================================================================================
// PALETTE (reprise a l'identique des 6 planches — libre de surcharge via la prop `color`)
// ============================================================================================
export const NUIT = "#22345c";
export const NUIT2 = "#182746";
export const ENCRE = "#f0e8d2";
export const OR_CLAIR = "#d9a93a";
export const CUIVRE = "#c17e3a";

export const rad = (d: number) => (d * Math.PI) / 180;

// ============================================================================================
// SQUELETTE — constantes de reference (GestesLocomotion16x9, la version validee)
// ============================================================================================
// L = longueur de jambe. C'est LA constante d'echelle du personnage : tout le reste (bras,
// buste, tete) en decoule ou lui est proportionnel dans la reference.
export const LEG_LENGTH = 34;
export const TORSO_LENGTH = 32;   // hanche -> epaule
export const HEAD_RADIUS = 9;
export const ARM_LENGTH_DEFAULT = 28; // longueur de bras par defaut (poses a angle direct)
export const HIP_Y_STANDING = -26;    // hanche au repos, debout, sans bob ni hipDrop

// Constantes IK (bras en 2 segments — humerus + avant-bras), reprises de GestesEchange16x9.
// Portee totale ~30.5px, coherente avec ARM_LENGTH_DEFAULT (28) utilise par les poses a angle
// direct : les deux registres (angle direct / IK) restent visuellement proches.
export const BRAS_L = 15.5;   // humerus
export const AVBRAS_L = 15.0; // avant-bras

// ============================================================================================
// ⭐ BRIQUE 1 — LE VERROU PAS/DISTANCE (stepLength)
// ============================================================================================
// Distance horizontale (en UNITES LOCALES DU SQUELETTE, cf. § UNITE DU DEPLACEMENT en tete de
// fichier) couverte par UN pas complet, pour une ouverture de ciseau `swingDeg` donnee.
// Geometrie : a l'ecart maximal, un pied est a +sin(swing)*L, l'autre a -sin(swing)*L.
// L'ecart entre les deux pieds = 2*L*sin(swing) = exactement ce que le corps avance par pas.
export const stepLength = (swingDeg: number, legLength: number = LEG_LENGTH): number =>
  2 * legLength * Math.sin(rad(swingDeg));

// Distance totale parcourue par `pas` pas (peut etre non-entier — suit n'importe quelle courbe
// d'easing, la coherence pied/sol est garantie par construction quelle que soit l'acceleration).
// `scale` est OBLIGATOIRE et NON DEFAUTE : c'est le garde-fou anti-glissement (cf. § UNITE DU
// DEPLACEMENT). Passez 1 si vous animez x dans le meme repere local que <Figure>.
//
// ⛔⛔ SI `swingDeg` VARIE DANS LA SCENE : NE PAS APPELER CETTE FONCTION SUR LE TOTAL DES PAS.
// Elle multiplie `pas` par la longueur de pas correspondant au swingDeg PASSE — donc l'appeler
// avec (pasTotal, swingCourant) applique retroactivement la longueur de pas COURANTE a tous les
// pas deja faits. Si le pas RACCOURCIT (personnage qui peine, qui ralentit, qui se charge), les
// pas deja poses retrecissent apres coup et LE PERSONNAGE RECULE.
// Bug reel, vecu le 2026-07-29 sur PorteurCharge16x9 : 430px de recul, attrape PAR LE CALCUL
// avant le 1er rendu (au rendu il se serait vu comme "un glissement bizarre" sans cause claire).
//
//   ⛔ FAUX  : const x = x0 + walkDistance(pasTotal, swingCourant, scale);
//   ✅ JUSTE : integration incrementale — a chaque frame, le DELTA de pas avec le swing de CETTE
//              frame-la :   d += walkDistance(dPas, swingDeCetteFrame, scale);
//
// Formulation exacte du verrou : x derive des pas AU MOMENT OU ILS SONT FAITS.
// (Si swingDeg est CONSTANT sur toute la scene, l'appel sur le total reste correct.)
export const walkDistance = (pas: number, swingDeg: number, scale: number, legLength: number = LEG_LENGTH): number =>
  pas * stepLength(swingDeg, legLength) * scale;

// Phase de marche [0,1[ associee a `pas` pas ecoules (1 cycle = 2 pas).
export const walkPhaseFromSteps = (pas: number): number => (pas / 2) % 1;

// ============================================================================================
// ⭐ DEPHASAGE BRAS/JAMBES — parade au plancher dur (repris de GroupeFoule16x9)
// ============================================================================================
// Sans dephasage, sin(a) [jambes] et le contre-balancement des bras passent TOUS LES DEUX par 0
// aux memes instants (2x par cycle) : a cet instant precis, le corps entier se lit comme un
// trait vertical (jambes ET bras superposes) — pose degeneree, tres visible en foule (plusieurs
// marcheurs a phases independantes, une fraction tombe toujours pres de cette fenetre).
// Un plancher DUR sur le swing "corrige" ca en ECRASANT l'oscillation (jambes qui ne balancent
// plus -> glissement, bug vecu et corrige). La bonne parade : retarder les bras de BRAS_LAG
// radians sur les jambes. sin(a) et sin(a - BRAS_LAG) ne s'annulent plus jamais simultanement.
export const BRAS_LAG = 0.35; // rad (~20deg)

// ============================================================================================
// PARAMETRES DE MARCHE — mêmes noms/valeurs par defaut que GestesLocomotion16x9
// ============================================================================================
export type WalkParams = {
  swingMax: number;   // amplitude du ciseau (deg) — grand pas vs petit pas. Plancher conseille
                       // ~16deg (en dessous, cf. § REGLES DURES : utiliser BRAS_LAG, pas un clamp).
  bobAmp: number;      // amplitude du rebond vertical du bassin
  lean: number;        // inclinaison du buste (deg, + = penche en avant)
  hipDrop: number;     // abaissement de la hanche (px) — s'accroupir sous une charge
  armSwing: number;    // amplitude du balancement des bras (deg)
};

export const WALK_DEFAULT: WalkParams = { swingMax: 17, bobAmp: 2.5, lean: 0, hipDrop: 0, armSwing: 22 };

// ============================================================================================
// POSE — override manuel de toute articulation (etats non-locomoteurs : au sol, assis, etc.)
// ============================================================================================
// Repris tel quel de GestesLocomotion16x9 (source d'autorite). Le genou est OPTIONNEL et INERTE
// par defaut : sans leg1Knee/leg2Knee, la jambe reste UN SEUL segment rigide (comportement de
// marche historique inchange). Avec flexion, la jambe devient 2 os de longueur/2 chacun — c'est
// ce qui rend une assise geometriquement possible (cf. GestesLocomotion16x9 § GESTE 3).
export type Pose = {
  hipY?: number;       // position verticale de la hanche (defaut: -26 - bob - hipDrop)
  torsoDeg?: number;   // angle du buste par rapport a la verticale (0 = debout)
  leg1Deg?: number;    // angle jambe avant (0 = pendante a la verticale)
  leg2Deg?: number;
  arm1Deg?: number;    // bras avant : angle depuis l'epaule (0 = pendant) — convention en tete de fichier
  arm2Deg?: number;
  arm1Len?: number;
  arm2Len?: number;
  headTuck?: number;   // rentre la tete vers le buste (rentrer la tete = encaisser)
  leg1Knee?: number;   // flexion du genou avant (deg, 0 = jambe tendue) — optionnel, inerte par defaut
  leg2Knee?: number;
  // Cible de main (repere local du perso) : au lieu de deviner un angle de bras et d'esperer
  // qu'il tombe sur la cible, on donne le POINT que la main doit atteindre. Le bras s'y tend.
  // GAGNE sur arm1Deg/arm2Deg si fourni.
  hand1?: [number, number];
  hand2?: [number, number];
};

// ============================================================================================
// ⭐ BRIQUE 2 — IK 2 SEGMENTS (solveArm), pour un bras qui doit ATTEINDRE un point precis
// ============================================================================================
// Repris de GestesEchange16x9 — ABSENT de GestesLocomotion16x9 (qui pilote les bras par angle
// direct via Pose.arm1Deg/arm2Deg ou hand1/hand2 avec un modele plus simple, cf. Figure
// ci-dessous). Utilisez solveArm() quand la main doit toucher un objet/une autre main dans le
// MONDE, avec un coude qui se plie tout seul de facon credible (donner/recevoir/porter avec IK).
//
// On connait l'epaule (sx,sy) et la cible de la main (hx,hy). On cherche le coude.
// `bend` = +1 coude vers le bas (posture naturelle bras tendu vers l'avant), -1 vers le haut.
// Si la cible est hors de portee, on la ramene sur le cercle de portee max : le bras se tend
// completement au lieu de se disloquer (et le corps devra, lui, se pencher pour combler l'ecart).
export const solveArm = (
  sx: number, sy: number, hx: number, hy: number, bend: number,
  armL: number = BRAS_L, forearmL: number = AVBRAS_L,
): { ex: number; ey: number; hx: number; hy: number; tendu: number } => {
  const dx = hx - sx;
  const dy = hy - sy;
  let dist = Math.sqrt(dx * dx + dy * dy);
  const maxReach = armL + forearmL - 0.001;
  const minReach = Math.abs(armL - forearmL) + 0.001;
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
  const a = (armL * armL - forearmL * forearmL + dist * dist) / (2 * dist);
  const hSq = armL * armL - a * a;
  const h = Math.sqrt(Math.max(0, hSq));
  const ux = (cx - sx) / dist;
  const uy = (cy - sy) / dist;
  const px = sx + a * ux;
  const py = sy + a * uy;
  const ex = px + bend * h * -uy;
  const ey = py + bend * h * ux;
  return { ex, ey, hx: cx, hy: cy, tendu };
};

// ============================================================================================
// ⭐ DIVERGENCE TRANCHEE — <Membre> en PATH UNIQUE (retenu depuis GestesEchange16x9, pas la
// version <line>+<line> de GestesLocomotion16x9)
// ============================================================================================
// GestesLocomotion16x9 dessine chaque segment de membre (jambe pliee, bras) en 2 <line>
// distinctes, chacune strokeLinecap="round". Au point de jonction (coude/genou), les deux
// capsules terminales rondes se superposent : quand le membre est PLIE (angle non nul entre les
// 2 segments), l'union des 2 demi-disques n'est plus alignee et dessine une PASTILLE pleine plus
// large que le trait — invisible a petite echelle, visible a grande echelle (bug rapporte par
// Aziz : "un cercle sur le bras"). GestesEchange16x9 corrige ce defaut REEL avec un <path>
// polyline UNIQUE (origine -> articulation -> extremite), strokeLinejoin="round". Le stroke est
// continu : plus aucune paire d'extremites ne peut se chevaucher, donc plus de pastille, quel
// que soit l'angle de flexion — et le rendu est identique (memes positions, meme epaisseur) dans
// le cas non-plie (segment droit). C'est une correction strictement additive : on la retient ICI
// dans le socle pour toute jambe/bras PLIE (genou ou coude visibles). Les segments RIGIDES
// (angle de flexion = 0, ex. jambe de marche sans genou) restent des <line> simples — identiques
// pixel pour pixel a GestesLocomotion16x9, donc la non-regression de la marche est garantie.
export const Membre: React.FC<{
  ax: number; ay: number;   // origine (epaule / hanche)
  bx: number; by: number;   // articulation (coude / genou)
  cx: number; cy: number;   // extremite (main / pied)
  w: number;
  color?: string;
  opacity?: number;
}> = ({ ax, ay, bx, by, cx, cy, w, color = ENCRE, opacity = 1 }) => (
  <path
    d={`M ${ax} ${ay} L ${bx} ${by} L ${cx} ${cy}`}
    fill="none" stroke={color} strokeWidth={w}
    strokeLinecap="round" strokeLinejoin="round" opacity={opacity}
  />
);

// ============================================================================================
// ⭐⭐ LA FIGURE — PROFIL. Le composant central du socle. Geometrie IDENTIQUE, angle pour angle
// et pixel pour pixel, a GestesLocomotion16x9::Figure (la source d'autorite) — SEULE la
// jonction genou/coude PLIEE utilise desormais <Membre> (path unique) au lieu de 2 <line>
// (cf. § DIVERGENCE TRANCHEE ci-dessus). Le cas non-plie (jambe rigide, bras a angle direct
// sans genou) est un rendu <line> a l'identique : AUCUN pixel ne change pour la marche/poids/
// chute deja validees.
// ============================================================================================
// phase in [0,1[ = ou on en est dans le cycle de marche. 1 cycle = 2 pas.
// pose = override optionnel pour les etats non-locomoteurs (au sol, en train de se relever).
export const Figure: React.FC<{
  x: number;
  y: number;              // y = le SOL sous les pieds
  phase: number;
  p?: Partial<WalkParams>;
  pose?: Pose;
  rotate?: number;        // rotation globale du corps (chute)
  color?: string;
  opacity?: number;
  scale?: number;         // scale du <g> SVG local (n'affecte PAS stepLength/walkDistance —
                           // cf. § UNITE DU DEPLACEMENT en tete de fichier)
  legLength?: number;     // L — surcharge rare (garder LEG_LENGTH sauf besoin explicite)
  hideArm1?: boolean;     // ⛔ AJOUT ADDITIF (2026-07-27, brief habillage Roles.tsx) : omet le
                           // rendu du bras AVANT (ligne epaule->main1). Defaut false = comportement
                           // in change (les 6 planches existantes n'y touchent pas). Sert a un
                           // appelant qui redessine LUI-MEME le bras avant PAR-DESSUS un habillage
                           // (vetement), avec la MEME geometrie (sx,sy,b1x,b1y calcules ici) —
                           // evite que le corps entier passe devant le vetement (bug "on voit le
                           // corps a travers le vetement", cf. Roles.tsx::PersonnageRole).
}> = ({
  x, y, phase, p, pose = {}, rotate = 0, color = ENCRE, opacity = 1, scale = 1,
  legLength = LEG_LENGTH, hideArm1 = false,
}) => {
  const L = legLength;
  const P = { ...WALK_DEFAULT, ...p };
  const a = phase * Math.PI * 2;
  const swing = Math.sin(a) * P.swingMax;
  const bob = Math.abs(Math.cos(a)) * P.bobAmp;

  // hanche (repere local : y negatif = vers le haut, le sol est a y=0)
  const hx = 0;
  const hy = pose.hipY !== undefined ? pose.hipY : HIP_Y_STANDING - bob + P.hipDrop;

  // jambes en ciseau. Angle mesure depuis la verticale descendante. La longueur de jambe
  // s'ADAPTE pour que le pied touche TOUJOURS le sol (y=0) quel que soit le bob / le hipDrop :
  // on resout hy + cos(angle)*Leff = 0 -> Leff = -hy / cos(angle), borne pour rester credible.
  const l1 = pose.leg1Deg !== undefined ? pose.leg1Deg : swing;
  const l2 = pose.leg2Deg !== undefined ? pose.leg2Deg : -swing;
  const legLen = (deg: number) => {
    if (pose.leg1Deg !== undefined || pose.leg2Deg !== undefined) return L; // poses manuelles : longueur fixe
    const c = Math.cos(rad(deg));
    if (c < 0.2) return L;
    return Math.max(L * 0.72, Math.min(L * 1.06, -hy / c));
  };
  const L1 = legLen(l1);
  const L2 = legLen(l2);
  // Genou optionnel : sans flexion, on garde UN segment (hanche -> pied) — comportement
  // historique strictement identique. Avec flexion, la jambe devient 2 os de L/2 chacun.
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
  const j1x = J1.ex, j1y = J1.ey;
  const j2x = J2.ex, j2y = J2.ey;

  // buste : de la hanche vers l'epaule. lean incline tout le haut du corps.
  const torso = pose.torsoDeg !== undefined ? pose.torsoDeg : P.lean;
  const torsoLen = TORSO_LENGTH;
  const sx = hx + Math.sin(rad(torso)) * torsoLen;
  const sy = hy - Math.cos(rad(torso)) * torsoLen;

  // tete : dans le prolongement du buste, legerement en avant (sens de la marche)
  const tuck = pose.headTuck ?? 0;
  const headLen = 12 - tuck * 7;
  const headCx = sx + Math.sin(rad(torso)) * headLen + 3 * Math.cos(rad(torso));
  const headCy = sy - Math.cos(rad(torso)) * headLen + 3 * Math.sin(rad(torso));

  // bras : contre-balancement (oppose aux jambes) — c'est ce qui rend la marche "vivante".
  // Les bras pendent par rapport a la GRAVITE, pas par rapport au buste : ils s'ancrent a
  // l'epaule mais gardent leur reference verticale. Seules les poses MANUELLES (tenir un sac,
  // pousser une caisse) restent solidaires du buste, parce que la charge, elle, est bien tenue
  // dans le repere du corps.
  const armLen1 = pose.arm1Len ?? ARM_LENGTH_DEFAULT;
  const armLen2 = pose.arm2Len ?? ARM_LENGTH_DEFAULT;
  const manuel1 = pose.arm1Deg !== undefined;
  const manuel2 = pose.arm2Deg !== undefined;
  const a1 = manuel1 ? (pose.arm1Deg as number) + torso : -Math.sin(a) * P.armSwing;
  const a2 = manuel2 ? (pose.arm2Deg as number) + torso : Math.sin(a) * P.armSwing;
  // la cible de main, si fournie, GAGNE sur l'angle : la main se pose sur la charge.
  const b1x = pose.hand1 ? pose.hand1[0] : sx + Math.sin(rad(a1)) * armLen1;
  const b1y = pose.hand1 ? pose.hand1[1] : sy + Math.cos(rad(a1)) * armLen1;
  const b2x = pose.hand2 ? pose.hand2[0] : sx + Math.sin(rad(a2)) * armLen2;
  const b2y = pose.hand2 ? pose.hand2[1] : sy + Math.cos(rad(a2)) * armLen2;

  // CALAGE AU SOL : en pose couchee, le corps entier flotterait au-dessus de sa ligne de sol si
  // on restait ancre par la seule hanche (ce qui n'a de sens que debout). On mesure le point le
  // plus bas du corps et on decale tout pour qu'il repose exactement sur y=0.
  const posesManuelles = pose.hipY !== undefined;
  const bas = Math.max(j1y, j2y, J1.ky, J2.ky, sy, headCy + 9, b1y, b2y);
  const calage = posesManuelles && bas < 0 ? -bas : 0;

  return (
    <g transform={`translate(${x} ${y + calage}) scale(${scale}) rotate(${rotate})`} opacity={opacity}>
      {/* jambe arriere + bras arriere en premier (opacity 0.75 = profondeur) */}
      {J2.plie ? (
        <Membre ax={hx} ay={hy} bx={J2.kx} by={J2.ky} cx={j2x} cy={j2y} w={4.5} color={color} opacity={0.75} />
      ) : (
        <line x1={hx} y1={hy} x2={J2.kx} y2={J2.ky} stroke={color} strokeWidth={4.5} strokeLinecap="round" opacity={0.75} />
      )}
      <line x1={sx} y1={sy} x2={b2x} y2={b2y} stroke={color} strokeWidth={4} strokeLinecap="round" opacity={0.75} />
      {/* buste */}
      <line x1={hx} y1={hy} x2={sx} y2={sy} stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      {/* jambe avant + bras avant */}
      {J1.plie ? (
        <Membre ax={hx} ay={hy} bx={J1.kx} by={J1.ky} cx={j1x} cy={j1y} w={4.5} color={color} />
      ) : (
        <line x1={hx} y1={hy} x2={J1.kx} y2={J1.ky} stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      )}
      {!hideArm1 && (
        <line x1={sx} y1={sy} x2={b1x} y2={b1y} stroke={color} strokeWidth={4} strokeLinecap="round" />
      )}
      {/* tete */}
      <circle cx={headCx} cy={headCy} r={HEAD_RADIUS} fill={color} />
    </g>
  );
};

// ============================================================================================
// FIGURE DE FACE — IMMOBILE UNIQUEMENT (acquis de GroupeFoule16x9). PAS pour marcher : de face,
// le registre ne sait QUE etre immobile/en attente (decision Aziz : de dos ne marche pas du
// tout, profil = trois-quarts, donc on ne code que profil + face-immobile).
// ============================================================================================
export type FacePose = {
  hipY: number;
  torsoLean: number;   // inclinaison laterale du buste (deg, + = vers la droite a l'ecran)
  headLean: number;
  arm1Deg: number;     // bras GAUCHE (a l'ecran), 0 = pend, + = s'ecarte vers la gauche
  arm2Deg: number;     // bras DROIT, 0 = pend, + = s'ecarte vers la droite
  legSpread: number;   // ecart des pieds (px), poids reparti
  weightShift: number; // -1..1 : bassin decale sur une jambe (contrapposto)
};

export const FigureFace: React.FC<{
  x: number;
  y: number;
  pose: FacePose;
  color?: string;
  opacity?: number;
  scale?: number;
}> = ({ x, y, pose, color = ENCRE, opacity = 1, scale = 1 }) => {
  const hx = pose.weightShift * 3;
  const hy = pose.hipY;
  const torsoLen = TORSO_LENGTH;
  const sx = hx + Math.sin(rad(pose.torsoLean)) * torsoLen;
  const sy = hy - Math.cos(rad(pose.torsoLean)) * torsoLen;
  const headCx = sx + Math.sin(rad(pose.torsoLean + pose.headLean)) * 12;
  const headCy = sy - Math.cos(rad(pose.torsoLean + pose.headLean)) * 12;

  const footL = -pose.legSpread - pose.weightShift * 2;
  const footR = pose.legSpread - pose.weightShift * 2;
  const l1x = hx + footL, l1y = 0;
  const l2x = hx + footR, l2y = 0;

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
      <circle cx={headCx} cy={headCy} r={HEAD_RADIUS} fill={color} />
    </g>
  );
};

export default Figure;
