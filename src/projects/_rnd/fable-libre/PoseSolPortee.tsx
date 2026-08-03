// ============================================================================================
// PORTAGE DE P_SOL VERS <Stick> — LE PARAMETRE MANQUANT ETAIT `headTuck`  (2026-08-03)
// ============================================================================================
//
// ⛔ BANC D'ESSAI. Ce fichier ne touche NI au socle partage `_shared/stick-figure-svg/StickFigure.tsx`,
// NI aux planches validees. Il duplique volontairement le moteur <Stick> de
// `EnchainementGestesExpressifs.tsx` pour y ajouter UN degre de liberte, et le mesurer.
//
// --------------------------------------------------------------------------------------------
// CE QUI ETAIT FAUX DANS LES 2 ROUNDS PRECEDENTS
// --------------------------------------------------------------------------------------------
// Les 2 rounds ont cherche a INVENTER une pose "corps au sol" nativement en angles <Stick>, en
// prenant pour acquis le verdict du 1er portage : "P_SOL est insoluble, aucune position de coude
// ne degage la tete". Deux erreurs empilees, toutes deux levees ici PAR LA MESURE :
//
// 1. ⛔ LE PARAMETRE MANQUANT. <Figure> possede `headTuck` ("rentrer la tete = encaisser"), un
//    degre de liberte qui RAPPROCHE la tete de l'epaule sans toucher a l'angle du buste :
//        Figure : headLen = 12 - tuck * 7            (ligne 168 de GestesLocomotion16x9.tsx)
//    P_SOL l'utilise a 0.45, donc une tete a 8.85u de l'epaule au lieu de 12. <Stick> n'avait
//    AUCUN equivalent : sa tete etait clouee a 11u. C'est exactement ce qui manquait — en
//    rentrant la tete, on l'ecarte de la zone ou le coude doit se loger.
//
// 2. ⛔ LE CRITERE "13u" DU ROUND 2 ETAIT UNE MAUVAISE REGLE, MESURE A L'APPUI. Il exigeait
//    qu'aucun segment de bras ne passe a moins de ~13u du centre du crane. Or la pose P_SOL
//    VALIDEE EN PRODUCTION viole ce critere sur son propre moteur : chez <Figure>, le bras passe
//    a 3.31u (bras avant) et 2.38u (bras arriere) du centre de la tete — il la TRAVERSE. Et la
//    pose est validee. Le defaut vu au 1er render n'etait donc pas "un bras qui touche la tete",
//    c'etait LE COUDE plante sur le crane : une POINTE, qui referme la silhouette en losange.
//    Un trait droit qui passe derriere le disque de la tete ne se lit pas comme un artefact
//    (<Figure> n'a pas de coude du tout : un seul segment epaule->main).
//    ⭐ LE BON CRITERE EST DONC : distance COUDE <-> centre de tete (pas "chaque point de chaque
//    segment"). Les deux sont mesures ci-dessous, honnetement.
//
// --------------------------------------------------------------------------------------------
// LE PORTAGE, MESURE (script de geometrie rejouant les DEUX moteurs, avant tout render)
// --------------------------------------------------------------------------------------------
// La replique de <Figure> a d'abord ete validee contre le commentaire de P_SOL du fichier source :
//   attendu  hanche(0,-3) epaule(32,-3) tete(41,0) genou1(-17,-2) pied1(-34,-3) mains(+59/+60,-4/-1)
//   calcule  hanche(0,-3) epaule(32,-3) tete(40.85,0) genou1(-16.96,-1.81) pied1(-33.92,-3)
//            mains(59.98,-3.98)/(58.93,-1.12)
// -> la replique est fidele, les mesures qui suivent portent donc sur la vraie geometrie.
//
// P_SOL portee vers <Stick> par la methode `porterVersStick`/`ikStick` DEJA ECRITE ET DEJA
// REUSSIE pour P_CHUTE (recopiee ici sans modification de sa logique), sens de coude (+1,+1) :
//     ecart main1 0.00u · main2 0.00u · hanche 0.00u · epaule 0.00u
//     ecart tete 1.00u  <- EXACTEMENT l'ecart structurel de headLen entre les 2 moteurs
//                          (Stick 11u, Figure 12u). Constant sur P_CHUTE ET P_SOL : ce n'est pas
//                          une derive du portage, c'est une proportion differente des moteurs.
//     coude1 a 14.8u du centre de tete · coude2 a 14.2u   (crane 9u) -> LES DEUX DEGAGES
//     tension des bras 84% / 81%  (registre : ne jamais depasser 97%)
// A comparer au round 2, qui plafonnait a 11.3u / 12.5u SANS le tuck : c'est bien le tuck qui
// fait passer la pose de insoluble a soluble.
//
// ⚠️ LES 4 COMBINAISONS DE SENS DE COUDE ONT ETE MESUREES (pas choisies) :
//     (+1,+1) coudes 14.8 / 14.2   <- RETENUE
//     (+1,-1) coudes 14.8 / 10.0
//     (-1,+1) coudes  8.9 / 14.2
//     (-1,-1) coudes  8.9 / 10.0
// Seule (+1,+1) degage les DEUX coudes — la meme combinaison que pour P_CHUTE, ce qui est
// coherent (les deux poses ont les bras devant).
//
// --------------------------------------------------------------------------------------------
// ⚠️ CE QUI RESTE STRUCTUREL, ET DOIT ETRE DIT (ce n'est PAS un defaut du portage)
// --------------------------------------------------------------------------------------------
// 1. LE COUDE. <Figure> dessine le bras en UN SEUL segment de 28u ; <Stick> en DEUX (20+18=38u).
//    Pour une cible a ~31u, le bras de Stick DOIT se plier. Le portage place ce pli AU-DESSUS de
//    la tete (coude a (44.9,-13.9), tete a (39.85,0)) et non SUR elle : la silhouette lit comme un
//    bras replie apres l'encaissement, pas comme un losange ferme autour du crane (le defaut du
//    1er render). Verifie a l'oeil sur render full HD a PERSO_SCALE 2.6.
// 2. LES 2 BRAS SE SUPERPOSENT PRESQUE. Les mains sont a 3.05u l'une de l'autre — MESURE
//    IDENTIQUE CHEZ <Figure> (m1 59.98/-3.98 · m2 58.93/-1.12). C'est une caracteristique de la
//    pose VALIDEE elle-meme, transportee fidelement, pas un artefact. Consequence assumee : on ne
//    lit qu'un bras, donc la lecture "les DEUX mains ont amorti" se perd. Idem pour les jambes.
//    ⛔ Ne PAS "corriger" en ecartant les bras : ce serait inventer une pose.
// 3. ECART DE TETE 1.00u. Constant sur P_CHUTE ET P_SOL = la difference de headLen entre les
//    moteurs (11 vs 12), pas une derive. 2.6px a l'echelle d'usage.
//
// --------------------------------------------------------------------------------------------
// LA TRANSPOSITION DU TUCK — fidele, et RETROCOMPATIBLE
// --------------------------------------------------------------------------------------------
//   Figure : headLen = 12 - tuck*7 ; offset lateral 3 PERPENDICULAIRE au buste
//            (3*cos(torso), 3*sin(torso))
//   Stick  : headLen = 11 - tuck*7 ; meme offset perpendiculaire
// ⚠️ POINT TROUVE PAR LA MESURE, PAS ANTICIPE : le <Stick> d'origine ajoutait `+3` en X ABSOLU
// (`tx = sx + sin(teteA)*11 + 3`), pas perpendiculairement au buste. Debout la difference est
// nulle ; A PLAT (buste a 90 deg) elle place la tete 3u trop loin ET du mauvais cote. C'est un
// second facteur qui faussait le portage, independant du tuck.
// ⛔ RETROCOMPATIBILITE STRICTE : l'offset perpendiculaire n'est applique QUE si tuck != 0. A
// tuck = 0, la formule d'origine est rendue caractere pour caractere -> les 3 gestes herites
// (alerte / peur / reddition) sont bit-a-bit identiques. Verifie : ecart 0.000u a tuck=0.
//
// TECHNIQUE : frame-driven, zero Math.random, zero setTimeout / CSS transition / @keyframes.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const rad = (d: number) => (d * Math.PI) / 180;

const NUIT = "#22345c";
const NUIT2 = "#182746";
const ENCRE = "#f0e8d2";
const ENCRE_FAIBLE = "rgba(240,232,210,0.34)";

const PERSO_SCALE = 2.6;
const SOL_Y = 780;
const PERSO_X = W / 2;

const mix = (a: number, b: number, u: number) => a + (b - a) * u;

// ============================================================================================
// LE MOTEUR <Stick> + LE DEGRE DE LIBERTE `headTuck`
// ============================================================================================
type PoseStick = {
  bob: number;
  leanBuste: number;
  leanTete: number;
  headTuck: number; // ⭐ AJOUT : rentre la tete vers le buste. 0 = comportement d'origine EXACT.
  brasAvantAngle: number;
  brasArriereAngle: number;
  brasAvantCoude: number;
  brasArriereCoude: number;
  jambeAvant: number;
  jambeArriere: number;
  jambeAvantGenou: number;
  jambeArriereGenou: number;
  dx: number;
  dy: number;
  hancheY: number;
};

const POSE_NEUTRE: PoseStick = {
  bob: 0,
  leanBuste: 0,
  leanTete: 0,
  headTuck: 0,
  brasAvantAngle: 12,
  brasArriereAngle: -8,
  brasAvantCoude: 8,
  brasArriereCoude: 8,
  jambeAvant: 5,
  jambeArriere: -5,
  jambeAvantGenou: 0,
  jambeArriereGenou: 0,
  dx: 0,
  dy: 0,
  hancheY: -26,
};

const chaine = (
  ox: number, oy: number, l1: number, l2: number, racineAngle: number, flexion: number,
): { mx: number; my: number; ex: number; ey: number } => {
  const a1 = rad(racineAngle);
  const mx = ox + Math.sin(a1) * l1;
  const my = oy + Math.cos(a1) * l1;
  const a2 = rad(racineAngle + flexion);
  const ex = mx + Math.sin(a2) * l2;
  const ey = my + Math.cos(a2) * l2;
  return { mx, my, ex, ey };
};

// ⭐ LA TETE — SEUL POINT MODIFIE DU MOTEUR.
// tuck = 0 -> formule d'origine STRICTEMENT identique (offset +3 en X absolu, longueur 11).
// tuck > 0 -> longueur raccourcie (11 - tuck*7, transposition de Figure) ET offset lateral
//             rendu PERPENDICULAIRE au buste, comme chez <Figure>.
const ancrageTete = (
  sx: number, sy: number, leanBuste: number, leanTete: number, tuck: number,
): { tx: number; ty: number } => {
  const teteA = rad(180 + leanBuste + leanTete);
  if (tuck === 0) {
    return { tx: sx + Math.sin(teteA) * 11 + 3, ty: sy + Math.cos(teteA) * 11 };
  }
  const len = 11 - tuck * 7;
  const perp = rad(-leanBuste); // -leanBuste == le torsoDeg de <Figure>
  return {
    tx: sx + Math.sin(teteA) * len + 3 * Math.cos(perp),
    ty: sy + Math.cos(teteA) * len + 3 * Math.sin(perp),
  };
};

const Stick: React.FC<{
  x: number; y: number; pose: PoseStick; opacity?: number; couleur?: string; scale?: number;
}> = ({ x, y, pose, opacity = 1, couleur = ENCRE, scale = 1 }) => {
  const p = pose;
  const hx = 0;
  const hy = p.hancheY - p.bob;
  const busteL = 32;
  const sx = hx + Math.sin(rad(180 + p.leanBuste)) * busteL;
  const sy = hy + Math.cos(rad(180 + p.leanBuste)) * busteL;
  const { tx, ty } = ancrageTete(sx, sy, p.leanBuste, p.leanTete, p.headTuck);

  const epX = sx + (hx - sx) * 0.12;
  const epY = sy + (hy - sy) * 0.12;
  const brasA = chaine(epX, epY, 20, 18, p.brasAvantAngle + p.leanBuste, p.brasAvantCoude);
  const brasB = chaine(epX, epY, 20, 18, -p.brasArriereAngle + p.leanBuste, -p.brasArriereCoude);

  const jbA = chaine(hx, hy, 17, 17, p.jambeAvant, p.jambeAvantGenou);
  const jbB = chaine(hx, hy, 17, 17, p.jambeArriere, p.jambeArriereGenou);

  const L = (a: number, b: number, c: number, d: number, w = 4.5, o = 1, key?: string) => (
    <line key={key} x1={a} y1={b} x2={c} y2={d} stroke={couleur} strokeWidth={w}
      strokeLinecap="round" opacity={o} />
  );

  return (
    <g transform={`translate(${x + p.dx * scale} ${y + p.dy * scale}) scale(${scale})`}
      opacity={opacity}>
      {L(hx, hy, jbB.mx, jbB.my, 4.5, 0.75, "jb1")}
      {L(jbB.mx, jbB.my, jbB.ex, jbB.ey, 4.5, 0.75, "jb2")}
      {L(epX, epY, brasB.mx, brasB.my, 4.2, 0.75, "brb1")}
      {L(brasB.mx, brasB.my, brasB.ex, brasB.ey, 4.2, 0.75, "brb2")}
      {L(hx, hy, sx, sy, 4.5, 1, "buste")}
      {L(hx, hy, jbA.mx, jbA.my, 4.5, 1, "ja1")}
      {L(jbA.mx, jbA.my, jbA.ex, jbA.ey, 4.5, 1, "ja2")}
      {L(epX, epY, brasA.mx, brasA.my, 4.2, 1, "bra1")}
      {L(brasA.mx, brasA.my, brasA.ex, brasA.ey, 4.2, 1, "bra2")}
      <circle cx={tx} cy={ty} r={9} fill={couleur} />
    </g>
  );
};

// ============================================================================================
// LE PORTAGE — `mainsDeFigure` / `ikStick` / `porterVersStick` RECOPIEES SANS CHANGEMENT DE LOGIQUE
// ============================================================================================
// Seul ajout : `headTuck` est transporte de la pose <Figure> vers la pose <Stick> (c'est lui le
// degre de liberte manquant). Aucun angle de bras n'est recopie ni retraduit : on transporte la
// POSITION de main (donnee geometrique) et on resout l'angle Stick par IK.
type PoseFigure = {
  hipY: number; torso: number;
  leg1: number; leg2: number; knee1: number; knee2: number;
  arm1: number; arm2: number; arm1Len: number; arm2Len: number;
  headTuck: number;
};

// ⛔ RECOPIEES de BandeChute (GestesLocomotion16x9), valeur pour valeur.
const P_CHUTE: PoseFigure = {
  hipY: -20, torso: 58, leg1: -30, leg2: -52, knee1: -14, knee2: 8,
  arm1: 74, arm2: 88, arm1Len: 29, arm2Len: 28, headTuck: 0.12,
};
// ⭐ P_SOL — REINTRODUITE. Le commentaire du fichier source la decrit ainsi : "A PLAT AU SOL,
// CONTACT FRANC. [...] Tout le corps repose sur la ligne de sol, les DEUX MAINS sont devant lui
// au sol (elles ont amorti), les jambes trainent derriere. Ce n'est plus un baton en l'air :
// c'est un corps a terre."
const P_SOL: PoseFigure = {
  hipY: -3, torso: 90, leg1: -86, leg2: -100, knee1: -8, knee2: 10,
  arm1: 2, arm2: -4, arm1Len: 28, arm2Len: 27, headTuck: 0.45,
};

const mainsDeFigure = (P: PoseFigure): { m1: [number, number]; m2: [number, number] } => {
  const hy = P.hipY;
  const sx = Math.sin(rad(P.torso)) * 32;
  const sy = hy - Math.cos(rad(P.torso)) * 32;
  const a1 = P.arm1 + P.torso;
  const a2 = P.arm2 + P.torso;
  return {
    m1: [sx + Math.sin(rad(a1)) * P.arm1Len, sy + Math.cos(rad(a1)) * P.arm1Len],
    m2: [sx + Math.sin(rad(a2)) * P.arm2Len, sy + Math.cos(rad(a2)) * P.arm2Len],
  };
};

const ikStick = (
  epX: number, epY: number, cx: number, cy: number, coudeSigne: number,
): { racine: number; flexion: number } => {
  const l1 = 20;
  const l2 = 18;
  const dx = cx - epX;
  const dy = cy - epY;
  let d = Math.hypot(dx, dy);
  d = Math.min(d, (l1 + l2) * 0.985);
  d = Math.max(d, Math.abs(l1 - l2) + 0.01);
  const base = (Math.atan2(dx, dy) * 180) / Math.PI;
  const cosA = Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)));
  const A = (Math.acos(cosA) * 180) / Math.PI;
  const cosB = Math.max(-1, Math.min(1, (l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2)));
  const B = 180 - (Math.acos(cosB) * 180) / Math.PI;
  return { racine: base + coudeSigne * A, flexion: -coudeSigne * B };
};

const porterVersStick = (P: PoseFigure): PoseStick => {
  const leanBuste = -P.torso;
  const hancheY = P.hipY;
  const hx = 0;
  const hy = hancheY;
  const sx = hx + Math.sin(rad(180 + leanBuste)) * 32;
  const sy = hy + Math.cos(rad(180 + leanBuste)) * 32;
  const epX = sx + (hx - sx) * 0.12;
  const epY = sy + (hy - sy) * 0.12;
  const { m1, m2 } = mainsDeFigure(P);
  // ⭐ (+1, +1) : RESOLU par mesure des 4 combinaisons, pas choisi (cf. en-tete).
  const k1 = ikStick(epX, epY, m1[0], m1[1], 1);
  const k2 = ikStick(epX, epY, m2[0], m2[1], 1);
  return {
    ...POSE_NEUTRE,
    hancheY,
    leanBuste,
    leanTete: 0,
    headTuck: P.headTuck, // ⭐ LE DEGRE DE LIBERTE PORTE
    jambeAvant: P.leg1,
    jambeArriere: P.leg2,
    jambeAvantGenou: P.knee1,
    jambeArriereGenou: P.knee2,
    brasAvantAngle: k1.racine - leanBuste,
    brasAvantCoude: k1.flexion,
    brasArriereAngle: -(k2.racine - leanBuste),
    brasArriereCoude: -k2.flexion,
    bob: 0,
    dx: 0,
    dy: 0,
  };
};

export const K_CHUTE = porterVersStick(P_CHUTE);
export const K_SOL = porterVersStick(P_SOL);

export const mixPose = (A: PoseStick, B: PoseStick, u: number): PoseStick => ({
  bob: mix(A.bob, B.bob, u),
  leanBuste: mix(A.leanBuste, B.leanBuste, u),
  leanTete: mix(A.leanTete, B.leanTete, u),
  headTuck: mix(A.headTuck, B.headTuck, u),
  brasAvantAngle: mix(A.brasAvantAngle, B.brasAvantAngle, u),
  brasArriereAngle: mix(A.brasArriereAngle, B.brasArriereAngle, u),
  brasAvantCoude: mix(A.brasAvantCoude, B.brasAvantCoude, u),
  brasArriereCoude: mix(A.brasArriereCoude, B.brasArriereCoude, u),
  jambeAvant: mix(A.jambeAvant, B.jambeAvant, u),
  jambeArriere: mix(A.jambeArriere, B.jambeArriere, u),
  jambeAvantGenou: mix(A.jambeAvantGenou, B.jambeAvantGenou, u),
  jambeArriereGenou: mix(A.jambeArriereGenou, B.jambeArriereGenou, u),
  dx: mix(A.dx, B.dx, u),
  dy: mix(A.dy, B.dy, u),
  hancheY: mix(A.hancheY, B.hancheY, u),
});

export { Stick, POSE_NEUTRE, PERSO_SCALE, SOL_Y, PERSO_X, W, H, FPS, S, clamp, ENCRE,
  ENCRE_FAIBLE, NUIT, NUIT2 };
export type { PoseStick };

// ============================================================================================
// LA PLANCHE DE VERIFICATION — 3 etats cote a cote, a l'echelle d'usage
// ============================================================================================
// ⛔ Ce n'est PAS une scene : c'est un instrument de mesure visuelle. Les 3 colonnes montrent
// P_CHUTE (deja portee et validee), la TRANSITION a mi-course, et P_SOL (la nouveauté). Chacune
// sur SA propre ligne de sol, pour verifier a l'oeil que le corps repose dessus.
export const PoseSolPortee: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // le fondu sequentiel du geste valide : P_CHUTE puis P_SOL (meme mecanique que BandeChute)
  const chute = spring({ frame, fps, config: { mass: 2.2, damping: 20, stiffness: 62 } });
  const versSol = interpolate(chute, [0.4, 1], [0, 1], clamp);
  const anime = mixPose(K_CHUTE, K_SOL, versSol);

  const colonnes: { x: number; pose: PoseStick; label: string }[] = [
    { x: 340, pose: K_CHUTE, label: "P_CHUTE (deja porte)" },
    { x: 960, pose: anime, label: "TRANSITION (animee)" },
    { x: 1580, pose: K_SOL, label: "P_SOL (porte, headTuck 0.45)" },
  ];

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 40%, ${NUIT} 0%, ${NUIT2} 100%)`,
    }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {colonnes.map((c) => (
          <g key={c.label}>
            <line x1={c.x - 260} y1={SOL_Y} x2={c.x + 260} y2={SOL_Y}
              stroke={ENCRE_FAIBLE} strokeWidth={2} />
            <Stick x={c.x} y={SOL_Y} pose={c.pose} scale={PERSO_SCALE} />
            <text x={c.x} y={SOL_Y + 120} textAnchor="middle" fontFamily="Georgia, serif"
              fontSize={22} fill={ENCRE} opacity={0.7} letterSpacing={1.5}>{c.label}</text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export default PoseSolPortee;
