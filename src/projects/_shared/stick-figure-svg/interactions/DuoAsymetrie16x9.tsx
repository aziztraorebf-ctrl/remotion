// R&D VAGUE D — INTERACTIONS · LOT "LE DUO ASYMETRIQUE" (rapport de force entre 2 corps)
//
// QUESTION POSEE PAR AZIZ : jusqu'ici les 2 stick figures des lots "gestes" etaient IDENTIQUES —
// ca ne raconte qu'un echange NEUTRE. Pour nos sujets (un Etat face a une banque, un petit pays
// face a une grande puissance, un producteur face a un acheteur), l'ASYMETRIE EST SOUVENT LE
// PROPOS. Mot d'Aziz : "pour pas que ce soit juste deux bonshommes stick figure blancs".
//
// CRITERE ELIMINATOIRE (rappel) : "si tu ne peux pas l'animer aussi bien qu'on l'a anime sur le
// franc CFA, ce n'est pas la bonne voie". On juge le MOUVEMENT, jamais le dessin fige.
//
// ---------------------------------------------------------------------------------------------
// CE QUI EST REPRIS TEL QUEL DE GestesEchange16x9 (les 5 briques validees, cf. STICK-FIGURE-INDEX)
// ---------------------------------------------------------------------------------------------
// 1. Verrou pas/distance (le pas produit le deplacement, jamais l'inverse).
// 2. IK 2 segments pour les bras (solveArm) — la main vise une position MONDE, le coude se resout.
// 3. Objet/contact en lerp entre 2 points — jamais de saut de parent.
// 4. Poses-cles explicites pour les sequences longues (pas d'accumulation de spring qui derive).
// 5. Membre en UN SEUL path avec strokeLinejoin="round" (pas de pastille au coude/genou).
//
// ---------------------------------------------------------------------------------------------
// CE QUI EST NOUVEAU : L'ASYMETRIE
// ---------------------------------------------------------------------------------------------
// Le composant <Perso> gagne un objet `role` qui porte TOUT ce qui differencie 2 corps SANS
// quitter le registre stick figure : PAS de visage, PAS de detail anatomique.
//   - scale       : taille globale du perso (le plus lisible, mais lit "adulte/enfant" seul).
//   - strokeW     : epaisseur du trait (solide/lourd vs fragile) — INDEPENDANT de la taille.
//   - couleur     : teinte de l'encre (vif/franc vs terne/passe).
//   - voute       : angle de courbure permanente du haut du dos (posture, pas juste le lean
//                   ponctuel du geste — un biais qui reste meme au repos).
//   - accessoire  : "aucun" | "chapeau" | "attache-case" | "canne" — une ligne ou deux, jamais
//                   un dessin detaille.
// La PLANCHE COMPARATIVE isole chaque differenciateur (2 persos identiques sauf CE parametre) ;
// les 3 SCENES combinent le jeu complet pour verifier que la lecture "qui domine" reste claire
// EN MOUVEMENT, pas seulement en pose figee.
//
// CONTRAINTES : Remotion pur (useCurrentFrame/interpolate/spring), aucun Math.random, aucune CSS
// transition. Fond #182746, encre de base #f0e8d2, strokeLinecap round.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const NUIT = "#22345c";
const NUIT2 = "#182746";
const ENCRE = "#f0e8d2";
const ENCRE_TERNE = "#9aa3b8"; // encre passee, valeur nettement plus basse — pour le perso "faible"
const OR_CLAIR = "#d9a93a";

// ============================================================================================
// ECHELLE DE BASE — identique a GestesEchange (proportions du registre, non negociables)
// ============================================================================================
const TETE_Y = -66;
const TETE_R = 9;
const COU_Y = -58;
const HANCHE_Y = -26;
const EPAULE_Y = -52;
const JAMBE_L = 34;
const BRAS_L = 15.5;
const AVBRAS_L = 15.0;
const SOL_Y = 640;

const rad = (d: number) => (d * Math.PI) / 180;

// ============================================================================================
// VERROU PAS/DISTANCE — repris a l'identique (brique n°1 de l'index)
// ============================================================================================
const SWING_MARCHE = 17;
const PAS_L = 2 * JAMBE_L * Math.sin(rad(SWING_MARCHE));
const marche = (pas: number) => ({ walk: (pas / 2) % 1, dist: pas * PAS_L });

// ============================================================================================
// IK 2 SEGMENTS — repris a l'identique (brique n°2)
// ============================================================================================
const solveArm = (
  sx: number, sy: number, hx: number, hy: number, bend: number,
): { ex: number; ey: number; hx: number; hy: number; tendu: number } => {
  const dx = hx - sx;
  const dy = hy - sy;
  let dist = Math.sqrt(dx * dx + dy * dy);
  const maxReach = BRAS_L + AVBRAS_L - 0.001;
  const minReach = Math.abs(BRAS_L - AVBRAS_L) + 0.001;
  const tendu = Math.min(1, dist / maxReach);
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
  return { ex, ey, hx: cx, hy: cy, tendu };
};

// ============================================================================================
// MEMBRE EN UN SEUL PATH — repris a l'identique (brique n°6 / correction pastille au coude)
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
// ⭐ ROLE — le porteur de l'asymetrie. Chaque champ a une valeur neutre (= comportement identique
// a GestesEchange) pour que les scenes existantes restent un cas particulier de ce systeme.
// ============================================================================================
type Accessoire = "aucun" | "chapeau" | "attache-case" | "canne";

type Role = {
  scale: number;         // 1 = taille de reference. Applique en PLUS du zoom de scene (homothetie).
  strokeW: number;       // multiplicateur sur les epaisseurs de trait de reference (1 = 4.5/4.5/4/2)
  couleur: string;       // encre des membres/tete/buste
  voute: number;         // degres de courbure PERMANENTE du haut du dos (0 = droit comme la reference)
  accessoire: Accessoire;
};

const ROLE_NEUTRE: Role = { scale: 1, strokeW: 1, couleur: ENCRE, voute: 0, accessoire: "aucun" };

// Les 2 roles utilises dans les 3 scenes en situation : LE FORT / LE FAIBLE.
// Choix du differenciateur -> tranche a la fin du rapport (question principale d'Aziz).
// On COMBINE volontairement 3 signaux convergents (trait + couleur + posture) plutot qu'un seul :
// c'est la lecture "silhouette seule, sans contexte" qui doit marcher, meme en plan tres large
// ou aucun texte n'est lisible.
const ROLE_FORT: Role = {
  scale: 1.0, strokeW: 1.28, couleur: ENCRE, voute: 0, accessoire: "attache-case",
};
const ROLE_FAIBLE: Role = {
  scale: 0.86, strokeW: 0.74, couleur: ENCRE_TERNE, voute: 8, accessoire: "aucun",
};

// ============================================================================================
// LE PERSONNAGE DE PROFIL — meme squelette que GestesEchange, + `role` pour l'asymetrie
// ============================================================================================
const Perso: React.FC<{
  x: number;
  y: number;
  face: 1 | -1;
  walk: number;
  handTarget: { x: number; y: number } | null;
  lean?: number;
  crouch?: number;
  opacity?: number;
  tremble?: number;
  frame?: number;
  bendDir?: 1 | -1;
  autreBrasY?: number;
  role?: Role;
}> = ({
  x, y, face, walk, handTarget, lean = 0, crouch = 0, opacity = 1, tremble = 0, frame = 0,
  bendDir = 1, autreBrasY = 0, role = ROLE_NEUTRE,
}) => {
  const a = walk * Math.PI * 2;
  const enMarche = walk !== 0;
  const STANCE = 7;
  const swing = enMarche ? Math.sin(a) * 17 : STANCE;
  const bob = enMarche ? Math.abs(Math.cos(a)) * 2.5 : 0;
  const drop = crouch * 7;

  const hipY = HANCHE_Y - bob + drop;
  const jl = JAMBE_L - drop;
  const j1x = Math.sin(rad(swing)) * jl;
  const j1y = hipY + Math.cos(rad(swing)) * jl;
  const j2x = Math.sin(rad(-swing)) * jl;
  const j2y = hipY + Math.cos(rad(-swing)) * jl;

  // ---- BUSTE : lean (ponctuel, le geste) + voute (permanente, la posture du role) s'additionnent ----
  const leanTotal = lean + role.voute;
  const leanR = rad(leanTotal);
  const bustLen = HANCHE_Y - COU_Y;
  const neckX = Math.sin(leanR) * bustLen;
  const neckY = hipY - Math.cos(leanR) * bustLen;
  const epLen = HANCHE_Y - EPAULE_Y;
  const shX = Math.sin(leanR) * epLen;
  const shY = hipY - Math.cos(leanR) * epLen;
  const teteLen = HANCHE_Y - TETE_Y;
  // la voute fait aussi legerement plonger la tete en avant (pas juste pivoter autour de la
  // hanche) : c'est ce qui distingue une POSTURE d'un simple lean ponctuel a l'oeil.
  const headX = Math.sin(leanR) * teteLen + 3 + role.voute * 0.18;
  const headY = hipY - Math.cos(leanR) * teteLen + role.voute * 0.10;

  const trembleY = tremble > 0.001 ? Math.sin(frame * 1.7) * 2.6 * tremble : 0;
  const trembleX = tremble > 0.001 ? Math.cos(frame * 2.3) * 1.4 * tremble : 0;
  const repos = { x: 5, y: EPAULE_Y + 26 };
  const tgt = handTarget ?? repos;
  const arm = solveArm(shX, shY, tgt.x + trembleX, tgt.y + trembleY, bendDir);

  const balanceBras = enMarche ? Math.sin(a) * 2.2 : 0;
  const backArm = solveArm(
    shX, shY,
    -2 + balanceBras,
    EPAULE_Y + 29.5 - bob + autreBrasY,
    1,
  );

  const wMembre = 4.5 * role.strokeW;
  const wBrasArriere = 4 * role.strokeW;
  const wBuste = 4.5 * role.strokeW;
  const wJambe = 4.5 * role.strokeW;
  const rTete = TETE_R * (0.92 + role.strokeW * 0.08); // la tete grossit tres legerement avec le trait

  return (
    <g transform={`translate(${x} ${y}) scale(${role.scale * face} ${role.scale})`} opacity={opacity}>
      {/* jambe arriere */}
      <line x1={0} y1={hipY} x2={j2x} y2={j2y} stroke={role.couleur} strokeWidth={wJambe} strokeLinecap="round" opacity={0.75} />
      {/* bras arriere */}
      <Membre ax={shX} ay={shY} bx={backArm.ex} by={backArm.ey} cx={backArm.hx} cy={backArm.hy}
        w={wBrasArriere} couleur={role.couleur} opacity={0.7} />
      {/* accessoire porte dans la main arriere : mallette qui pend du poignet, jamais un dessin detaille */}
      {role.accessoire === "attache-case" && (
        <rect
          x={backArm.hx - 6} y={backArm.hy + 1} width={12} height={9}
          fill="none" stroke={role.couleur} strokeWidth={2 * role.strokeW} rx={1}
        />
      )}
      {/* buste */}
      <line x1={0} y1={hipY} x2={neckX} y2={neckY} stroke={role.couleur} strokeWidth={wBuste} strokeLinecap="round" />
      {/* accessoire chapeau : un simple trait horizontal + bord, pose sur le haut de la tete */}
      {role.accessoire === "chapeau" && (
        <line
          x1={headX - rTete * 1.3} y1={headY - rTete - 2}
          x2={headX + rTete * 1.3} y2={headY - rTete - 2}
          stroke={role.couleur} strokeWidth={2.6 * role.strokeW} strokeLinecap="round"
        />
      )}
      {/* tete */}
      <circle cx={headX} cy={headY} r={rTete} fill={role.couleur} />
      {/* jambe avant */}
      <line x1={0} y1={hipY} x2={j1x} y2={j1y} stroke={role.couleur} strokeWidth={wJambe} strokeLinecap="round" />
      {/* accessoire canne : un trait du sol jusque dans la main avant, seulement si le bras la tient
          (bras a peu pres au repos, sinon la canne traverse le geste) */}
      {role.accessoire === "canne" && arm.tendu < 0.55 && (
        <line x1={arm.hx} y1={arm.hy} x2={arm.hx - 3} y2={0} stroke={role.couleur}
          strokeWidth={2.2 * role.strokeW} strokeLinecap="round" opacity={0.85} />
      )}
      {/* bras avant */}
      <Membre ax={shX} ay={shY} bx={arm.ex} by={arm.ey} cx={arm.hx} cy={arm.hy} w={wMembre} couleur={role.couleur} />
    </g>
  );
};

// Position MONDE de la main avant — doit rester le miroir exact du calcul interne de <Perso>
// (le scale du role s'applique aussi a la position de la main, sinon un objet/contact flotte).
const mainMonde = (
  px: number, py: number, face: 1 | -1, lean: number, crouch: number, walk: number,
  tgt: { x: number; y: number }, bendDir: 1 | -1, role: Role = ROLE_NEUTRE,
): { x: number; y: number } => {
  const a = walk * Math.PI * 2;
  const bob = walk !== 0 ? Math.abs(Math.cos(a)) * 2.5 : 0;
  const drop = crouch * 7;
  const hipY = HANCHE_Y - bob + drop;
  const leanR = rad(lean + role.voute);
  const epLen = HANCHE_Y - EPAULE_Y;
  const shX = Math.sin(leanR) * epLen;
  const shY = hipY - Math.cos(leanR) * epLen;
  const arm = solveArm(shX, shY, tgt.x, tgt.y, bendDir);
  return { x: px + face * role.scale * arm.hx, y: py + role.scale * arm.hy };
};

const REPOS_L = { x: 2, y: EPAULE_Y + 29.5 };

const cibleLocale = (px: number, face: 1 | -1, mondeX: number, mondeY: number) => ({
  x: face * (mondeX - px),
  y: mondeY - SOL_Y,
});

// ============================================================================================
// ETIQUETTE — sobre, Georgia serif, NETTEMENT plus petite que les persos (comme la reference)
// ============================================================================================
const Etiquette: React.FC<{ n: string; titre: string; sous: string; op: number }> = ({ n, titre, sous, op }) => (
  <g opacity={op}>
    <text x={W / 2} y={92} textAnchor="middle" fontFamily="Georgia, serif" fontSize={15} fill={OR_CLAIR}
      letterSpacing={6} opacity={0.7}>{n}</text>
    <text x={W / 2} y={130} textAnchor="middle" fontFamily="Georgia, serif" fontSize={27} fill={ENCRE}
      letterSpacing={3} opacity={0.92}>{titre}</text>
    <text x={W / 2} y={160} textAnchor="middle" fontFamily="Georgia, serif" fontSize={17} fill={ENCRE}
      letterSpacing={1} opacity={0.42} fontStyle="italic">{sous}</text>
  </g>
);

const Sol: React.FC<{ op: number; zoom: number; x1?: number; x2?: number }> = ({ op, zoom, x1 = 820, x2 = 1100 }) => (
  <line x1={x1} y1={SOL_Y} x2={x2} y2={SOL_Y} stroke={ENCRE} strokeWidth={2 / zoom}
    opacity={0.3 * op} strokeLinecap="round" />
);

// ============================================================================================
// PARTIE 1 — PLANCHE COMPARATIVE DES DIFFERENCIATEURS
// ============================================================================================
// Chaque panneau isole UN SEUL parametre (les deux persos sont identiques sauf celui-la), pose
// et immobiles (pas de geste — le sujet ici est "est-ce que la silhouette seule suffit a lire
// fort/faible", pas le mouvement). Idle discret (respiration) pour eviter le "personnage mort".
const ZOOM_PLANCHE = 3.1;

const useIdle = (f: number) => {
  const resp = Math.sin(f * (2 * Math.PI) / S(4.2));
  return resp;
};

// ⛔ CORRIGE apres 1er render : le titre/sous-titre du panneau etaient DANS le groupe zoome
// (scale ZOOM_PLANCHE) -> a x3.1 le texte etait projete hors du cadre visible (illisible/absent
// a l'ecran). Meme principe que l'Etiquette des scenes : le texte reste TOUJOURS a l'echelle 1,
// hors du groupe homothetique — seuls les corps sont zoomes.
const PanneauDiff: React.FC<{
  roleG: Role; roleD: Role; f: number; cx: number;
}> = ({ roleG, roleD, f, cx }) => {
  const resp = useIdle(f);
  const ecart = 70;
  const gx = cx - ecart / 2;
  const dx = cx + ecart / 2;
  return (
    <g>
      <Sol op={1} zoom={ZOOM_PLANCHE} x1={gx - 40} x2={dx + 40} />
      <Perso x={gx} y={SOL_Y} face={1} walk={0} handTarget={null} role={roleG} frame={f}
        autreBrasY={resp * 0.4} />
      <Perso x={dx} y={SOL_Y} face={-1} walk={0} handTarget={null} role={roleD} frame={f}
        autreBrasY={resp * 0.4} />
    </g>
  );
};

// etiquette du panneau, a l'echelle 1 (jamais dans le groupe zoome) — positionnee sous le
// bandeau "PARTIE 1" pour ne jamais le chevaucher.
const EtiquettePanneau: React.FC<{ titre: string; sous: string; op: number }> = ({ titre, sous, op }) => (
  <g opacity={op}>
    <text x={W / 2} y={288} textAnchor="middle" fontFamily="Georgia, serif" fontSize={22} fill={ENCRE}
      letterSpacing={2} opacity={0.9}>{titre}</text>
    <text x={W / 2} y={316} textAnchor="middle" fontFamily="Georgia, serif" fontSize={15} fill={ENCRE}
      letterSpacing={0.5} opacity={0.48} fontStyle="italic">{sous}</text>
  </g>
);

// 5 panneaux, un differenciateur a la fois — defilement horizontal lent pour que chacun soit
// vu plein cadre le temps de le juger (pas 5 vignettes minuscules cote a cote : illisible a
// l'echelle du critere n°1).
const DIFFERENCIATEURS: { titre: string; sous: string; roleG: Role; roleD: Role }[] = [
  {
    titre: "1 — LA TAILLE",
    sous: "le plus evident — risque de lire \"adulte / enfant\"",
    roleG: { ...ROLE_NEUTRE, scale: 1.0 },
    roleD: { ...ROLE_NEUTRE, scale: 0.72 },
  },
  {
    titre: "2 — L'EPAISSEUR DU TRAIT",
    sous: "meme taille — un trait epais = solide, un trait fin = fragile",
    roleG: { ...ROLE_NEUTRE, strokeW: 1.35 },
    roleD: { ...ROLE_NEUTRE, strokeW: 0.68 },
  },
  {
    titre: "3 — LA COULEUR / VALEUR",
    sous: "encre vive vs encre terne, meme silhouette",
    roleG: { ...ROLE_NEUTRE, couleur: ENCRE },
    roleD: { ...ROLE_NEUTRE, couleur: ENCRE_TERNE },
  },
  {
    titre: "4 — L'ACCESSOIRE MINIMAL",
    sous: "attache-case vs rien — sans visage, sans detail anatomique",
    roleG: { ...ROLE_NEUTRE, accessoire: "attache-case" },
    roleD: { ...ROLE_NEUTRE, accessoire: "aucun" },
  },
  {
    titre: "5 — LA POSTURE PERMANENTE",
    sous: "l'un droit, l'autre legerement voute — meme au repos",
    roleG: { ...ROLE_NEUTRE, voute: 0 },
    roleD: { ...ROLE_NEUTRE, voute: 9 },
  },
  {
    titre: "COMBINAISON RETENUE",
    sous: "trait + couleur + posture cumules — le duo utilise dans les 3 scenes",
    roleG: ROLE_FORT,
    roleD: ROLE_FAIBLE,
  },
];

const PlanchePanneau: React.FC<{ d: (typeof DIFFERENCIATEURS)[number]; dur: number }> = ({ d, dur }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 9, dur - 10, dur], [0, 1, 1, 0], clamp);
  return (
    <g opacity={op}>
      <EtiquettePanneau titre={d.titre} sous={d.sous} op={interpolate(f, [4, 16], [0, 1], clamp)} />
      <g transform={`translate(${960} ${SOL_Y - 83 / 2 - 30}) scale(${ZOOM_PLANCHE}) translate(${-960} ${-(SOL_Y - 83 / 2)})`}>
        <PanneauDiff roleG={d.roleG} roleD={d.roleD} f={f} cx={960} />
      </g>
    </g>
  );
};

// ============================================================================================
// PARTIE 2 — LES 3 SCENES EN SITUATION (le duo FORT / FAIBLE)
// ============================================================================================
const ZOOM_SCENE = 4.6;
const CX = 960;
const CY = SOL_Y - 83 / 2;
const RECENTRE_Y = 44;

// --------------------------------------------------------------------------------------------
// SCENE 1 — NEGOCIER : va-et-vient, l'un avance / l'autre tient sa position.
// --------------------------------------------------------------------------------------------
// PRINCIPE : le FORT (gauche) avance d'un pas ferme dans l'espace commun ; le FAIBLE (droite) NE
// RECULE PAS mais tient sa position avec un lean defensif — puis, sous la pression du 2e temps,
// cede un demi-pas. Le "qui domine" se lit dans QUI BOUGE L'AUTRE, jamais dans un signe explicite.
// Le bras du FORT reste ferme (avant-bras horizontal, geste qui pointe/tranche) ; le FAIBLE garde
// les bras plus bas (rien a opposer). Sequence en poses-cles (brique n°4) pour eviter la derive.
const NEGOCIER_ECART_0 = 90; // ecart de depart, large : on VOIT l'espace se reduire
const NEGOCIER_ECART_1 = 54; // ecart final, apres la cession du faible — meme valeur que GestesEchange

const V_Negocier: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  // --- TEMPS 1 (0 -> 1.6s) : le fort avance d'1 pas ferme, le faible tient (immobile, lean arriere) ---
  const PAS_FORT_1 = 1.0;
  const avance1 = interpolate(f, [S(0.4), S(1.5)], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  // --- TEMPS 2 (2.2 -> 3.6s) : le fort insiste (2e pas), le faible cede un demi-pas en arriere ---
  const avance2 = interpolate(f, [S(2.3), S(3.4)], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const PAS_FORT_2 = 0.8;
  const cede = interpolate(f, [S(2.6), S(3.7)], [0, 1], { ...clamp, easing: (t) => t * t });
  const PAS_FAIBLE_CEDE = 0.7;
  // --- retour a distance neutre en fin de bloc (transition propre vers le panneau suivant) ---
  const retourF = interpolate(f, [S(4.3), S(5.2)], [0, 1], { ...clamp, easing: (t) => t * t });

  const pasFort = avance1 * PAS_FORT_1 + avance2 * PAS_FORT_2 - retourF * (PAS_FORT_1 + PAS_FORT_2);
  const pasFaible = cede * PAS_FAIBLE_CEDE - retourF * PAS_FAIBLE_CEDE;
  const mFort = marche(Math.abs(pasFort));
  const mFaible = marche(Math.abs(pasFaible));

  const fortDeplaceEn = (f > S(0.4) && f < S(1.5)) || (f > S(2.3) && f < S(3.4)) || (f > S(4.3) && f < S(5.2));
  const faibleDeplaceEn = (f > S(2.6) && f < S(3.7)) || (f > S(4.3) && f < S(5.2));
  const walkFort = fortDeplaceEn ? mFort.walk : 0;
  const walkFaible = faibleDeplaceEn ? mFaible.walk : 0;

  const gaucheX0 = CX - NEGOCIER_ECART_0 / 2;
  const droiteX0 = CX + NEGOCIER_ECART_0 / 2;
  // le fort avance vers la droite (signe +), le faible recule vers la droite lui aussi (cede du terrain)
  const fortX = gaucheX0 + Math.abs(pasFort) * PAS_L * Math.sign(pasFort || 1);
  const faibleX = droiteX0 + Math.abs(pasFaible) * PAS_L * Math.sign(pasFaible || 1);

  // bras du fort : ferme, pointe vers l'avant-bas (avant-bras quasi horizontal, geste qui tranche)
  const brasFort = interpolate(f, [S(0.5), S(1.3)], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const brasFort2 = interpolate(f, [S(2.4), S(3.1)], [0, 1], clamp);
  const brasFortRetour = interpolate(f, [S(4.3), S(5.0)], [0, 1], clamp);
  const cibleBrasFort = { x: 18, y: EPAULE_Y + 14 };
  const brasFortAmp = Math.max(brasFort * (1 - brasFort2 * 0 + brasFort2), brasFort) * (1 - brasFortRetour);
  const fortHand = {
    x: REPOS_L.x + (cibleBrasFort.x - REPOS_L.x) * Math.min(1, brasFortAmp),
    y: REPOS_L.y + (cibleBrasFort.y - REPOS_L.y) * Math.min(1, brasFortAmp),
  };

  // le faible : lean defensif des le debut (il tient), s'accentue legerement a la 2e poussee,
  // bras reste bas (rien a opposer) — le seul "mouvement de reponse" est corporel, pas gestuel.
  const leanFaible = -3 - interpolate(f, [S(0.4), S(1.4)], [0, 2.4], clamp)
    - interpolate(f, [S(2.3), S(3.3)], [0, 2.0], clamp) * (1 - retourF)
    + retourF * 5.4; // se redresse a la fin

  return (
    <>
      <Perso x={fortX} y={SOL_Y} face={1} walk={walkFort} handTarget={fortHand} lean={brasFortAmp * 3}
        role={ROLE_FORT} frame={f} />
      <Perso x={faibleX} y={SOL_Y} face={-1} walk={walkFaible} handTarget={null} lean={leanFaible}
        role={ROLE_FAIBLE} frame={f} />
    </>
  );
};

// --------------------------------------------------------------------------------------------
// SCENE 2 — L'UN PART, L'AUTRE RESTE : la separation.
// --------------------------------------------------------------------------------------------
// PRINCIPE : le FAIBLE (droite) sort du cadre en marchant (verrou pas/distance obligatoire — pas
// de glissement). Le FORT (gauche) RESTE, immobile — mais son immobilite doit etre HABITEE : une
// respiration lente + un tres leger reajustement de poids (repris en esprit de la brique
// "s'asseoir/attendre" du lot Expressifs, simplifie ici car le perso reste DEBOUT, pas assis).
// Le sens ("qui a le pouvoir de partir vs qui subit le depart") se lit dans l'ASYMETRIE du
// mouvement : un corps qui s'eloigne activement contre un corps figé qui regarde ce vide se
// creer — le fort ne le suit pas des yeux (aucune rotation), il reste de face a son point,
// ce qui est encore plus dur : il n'a pas besoin de suivre, il attend que ca revienne a lui.
const V_Separation: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const gaucheX = CX - 40; // le fort, position fixe pour toute la scene
  const droiteX0 = CX + 40;

  // le faible part vers la droite, hors du cadre de la scene zoomee (au-dela de ~+230 locale)
  const PAS_DEPART = 9.5;
  const depart = interpolate(f, [S(0.6), S(4.2)], [0, 1], { ...clamp, easing: (t) => t * (2 - t) });
  const mDep = marche(depart * PAS_DEPART);
  const enDeplacement = f > S(0.6) && f < S(4.2);
  const walkFaible = enDeplacement ? mDep.walk : 0;
  const faibleX = droiteX0 + depart * PAS_DEPART * PAS_L;
  const opFaible = interpolate(f, [S(3.6), S(4.4)], [1, 0], clamp); // s'estompe en sortant du cadre

  // le faible, avant de partir, a un tout petit temps d'hesitation (buste qui recule un souffle)
  // puis se detourne : le lean passe de 0 (face au fort) a une legere inclinaison "en marche"
  const hesite = interpolate(f, [S(0), S(0.6)], [0, 1], clamp);
  const leanFaible = -hesite * 2.5;

  // le fort : immobilite HABITEE. Respiration lente + un unique micro-reajustement de poids,
  // JAMAIS de repetition en boucle visible (periode longue, un seul evenement dans la duree du bloc).
  const resp = Math.sin(f * (2 * Math.PI) / S(4.4)) * 0.55; // respiration : leger bob du buste
  // le reajustement : un lean tres bref, une seule fois, autour de 3.0s (le vide est maintenant net)
  const reajust = spring({ frame: f - S(3.0), fps, config: { mass: 1.1, damping: 13, stiffness: 60 } });
  const leanFort = resp + (f >= S(3.0) ? Math.sin(reajust * Math.PI) * 2.2 : 0);

  return (
    <>
      <Perso x={gaucheX} y={SOL_Y} face={1} walk={0} handTarget={null} lean={leanFort}
        role={ROLE_FORT} frame={f} />
      <Perso x={faibleX} y={SOL_Y} face={-1} walk={walkFaible} handTarget={null} lean={leanFaible}
        role={ROLE_FAIBLE} opacity={opFaible} frame={f} />
    </>
  );
};

// --------------------------------------------------------------------------------------------
// SCENE 3 — IMPOSER / SE SOUMETTRE : occupation de l'espace, sans violence explicite.
// --------------------------------------------------------------------------------------------
// PRINCIPE : le FORT avance FRANCHEMENT dans l'espace du FAIBLE (verrou pas/distance, cadence
// plus dense que la scene 1 — l'intrusion est plus rapide, moins de retenue). Le FAIBLE recule
// d'abord d'un demi-pas (il cede du terrain), PUIS, une fois qu'il ne peut plus reculer sans
// sortir du cadre, il SE TASSE : voute qui s'accentue temporairement (par-dessus la voute
// permanente du role), tete qui plonge, bras qui remonte legerement pres du corps (repli, pas
// un geste de defense actif). Aucun contact, aucun coup : le rapport de force est entierement
// dans l'OCCUPATION DE L'ESPACE et la REDUCTION DE SILHOUETTE du faible.
const V_Imposer: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const gaucheX0 = CX - 100;
  const droiteX0 = CX + 40;

  const PAS_FORT = 3.2;
  const avanceFort = interpolate(f, [S(0.4), S(2.6)], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const mFort = marche(avanceFort * PAS_FORT);
  const enDeplacementFort = f > S(0.4) && f < S(2.6);
  const walkFort = enDeplacementFort ? mFort.walk : 0;
  const fortX = gaucheX0 + avanceFort * PAS_FORT * PAS_L;

  // le faible recule d'un demi-pas tot dans la scene (il cede tout de suite, pas de resistance)
  const PAS_FAIBLE = 0.9;
  const reculeFaible = interpolate(f, [S(0.9), S(1.8)], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const mFaible = marche(reculeFaible * PAS_FAIBLE);
  const enDeplacementFaible = f > S(0.9) && f < S(1.8);
  const walkFaible = enDeplacementFaible ? mFaible.walk : 0;
  const faibleX = droiteX0 + reculeFaible * PAS_FAIBLE * PAS_L;

  // le tassement : commence quand le fort est deja bien engage dans l'espace (2.0s), s'installe
  // sur ~1.4s et TIENT (pas de spring qui rebondit — se tasser ne rebondit pas, ca s'installe).
  const tassement = interpolate(f, [S(2.0), S(3.4)], [0, 1], { ...clamp, easing: (t) => t * t });
  const roleFaibleTasse: Role = { ...ROLE_FAIBLE, voute: ROLE_FAIBLE.voute + tassement * 13 };

  // bras du faible : remonte pres du corps pendant le tassement (repli, pas defense)
  const brasFaibleY = EPAULE_Y + 29.5 - tassement * 9;
  const faibleHand = tassement > 0.02 ? { x: 6 - tassement * 2, y: brasFaibleY } : null;

  // le fort garde une posture ferme et stable une fois arrive, un tout petit temps d'ancrage
  const ancrage = interpolate(f, [S(2.6), S(3.0)], [0, 1], clamp);

  return (
    <>
      <Perso x={fortX} y={SOL_Y} face={1} walk={walkFort} handTarget={null} lean={ancrage * 2}
        role={ROLE_FORT} frame={f} />
      <Perso x={faibleX} y={SOL_Y} face={-1} walk={walkFaible} handTarget={faibleHand}
        lean={-tassement * 3} role={roleFaibleTasse} frame={f} />
    </>
  );
};

// ============================================================================================
// ASSEMBLAGE
// ============================================================================================
type BlocScene = {
  n: string; titre: string; sous: string; dur: number;
  C: React.FC<{ f: number; fps: number }>;
};

const SCENES: BlocScene[] = [
  { n: "I", titre: "NÉGOCIER", sous: "l'un avance, l'autre tient — puis cède du terrain", dur: 5.6, C: V_Negocier },
  { n: "II", titre: "L'UN PART, L'AUTRE RESTE", sous: "la séparation — l'immobilité du fort est habitée", dur: 4.8, C: V_Separation },
  { n: "III", titre: "IMPOSER / SE SOUMETTRE", sous: "occupation de l'espace — le faible se tasse", dur: 4.2, C: V_Imposer },
];

const PLANCHE_DUR = 3.6; // par panneau de differenciateur

const BlocScene: React.FC<{ v: BlocScene; dur: number }> = ({ v, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = interpolate(f, [0, 9, dur - 10, dur], [0, 1, 1, 0], clamp);
  const C = v.C;
  return (
    <g opacity={op}>
      <Etiquette n={v.n} titre={v.titre} sous={v.sous} op={interpolate(f, [4, 16], [0, 1], clamp)} />
      <g transform={`translate(${CX} ${CY - RECENTRE_Y}) scale(${ZOOM_SCENE}) translate(${-CX} ${-CY})`}>
        <Sol op={1} zoom={ZOOM_SCENE} />
        <C f={f} fps={fps} />
      </g>
    </g>
  );
};

const OFFSETS_PLANCHE = DIFFERENCIATEURS.reduce<number[]>((acc, _d, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + S(PLANCHE_DUR));
  return acc;
}, []);
const PLANCHE_FRAMES = OFFSETS_PLANCHE[OFFSETS_PLANCHE.length - 1] + S(PLANCHE_DUR);

const OFFSETS_SCENES = SCENES.reduce<number[]>((acc, v, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + S(SCENES[i - 1].dur));
  return acc;
}, []);
const SCENES_FRAMES = OFFSETS_SCENES[OFFSETS_SCENES.length - 1] + S(SCENES[SCENES.length - 1].dur);

export const DUO_ASYMETRIE_FRAMES = PLANCHE_FRAMES + SCENES_FRAMES;

export const DuoAsymetrie16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 12, DUO_ASYMETRIE_FRAMES - 14, DUO_ASYMETRIE_FRAMES], [0, 1, 1, 0], clamp);

  const stars = React.useMemo(() => {
    const a: { x: number; y: number; r: number; o: number }[] = [];
    let s = 31;
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
          letterSpacing={7} opacity={0.26}>LE DUO ASYMÉTRIQUE — UN RAPPORT DE FORCE, PAS DEUX BONSHOMMES IDENTIQUES</text>
      </svg>

      {/* PARTIE 1 — planche comparative des differenciateurs */}
      <Sequence from={0} durationInFrames={PLANCHE_FRAMES}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
          <text x={W / 2} y={230} textAnchor="middle" fontFamily="Georgia, serif" fontSize={13} fill={OR_CLAIR}
            letterSpacing={5} opacity={0.55}>PARTIE 1 — LES DIFFÉRENCIATEURS TESTÉS</text>
          {DIFFERENCIATEURS.map((d, i) => (
            <Sequence key={d.titre} from={OFFSETS_PLANCHE[i]} durationInFrames={S(PLANCHE_DUR)} layout="none">
              <PlanchePanneau d={d} dur={S(PLANCHE_DUR)} />
            </Sequence>
          ))}
        </svg>
      </Sequence>

      {/* PARTIE 2 — les 3 scenes en situation */}
      <Sequence from={PLANCHE_FRAMES} durationInFrames={SCENES_FRAMES}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
          <text x={W / 2} y={230} textAnchor="middle" fontFamily="Georgia, serif" fontSize={13} fill={OR_CLAIR}
            letterSpacing={5} opacity={0.55}>PARTIE 2 — EN SITUATION</text>
          {SCENES.map((v, i) => (
            <Sequence key={v.n} from={OFFSETS_SCENES[i]} durationInFrames={S(v.dur)} layout="none">
              <BlocScene v={v} dur={S(v.dur)} />
            </Sequence>
          ))}
        </svg>
      </Sequence>
    </AbsoluteFill>
  );
};

export default DuoAsymetrie16x9;
