// MOTEUR: objet/metaphore SVG + acteur stick-figure (registre personnage-vivant)
// ============================================================================================
// R&D — LA SCENE DE FABLE, ANIMEE (test de moteur, PAS une scene de production)
// ============================================================================================
// QUESTION POSEE : notre registre stick-figure tient-il EN MOUVEMENT dans un decor riche ?
//
// PARTAGE DU TRAVAIL (regle gravee dans STICK-FIGURE-INDEX.md § TEST A/B TRANCHE) :
//   "Le modele dessine le DECOR, NOUS animons les PERSONNAGES."
// -> le decor ci-dessous est le SVG de Fable transporte tel quel (memes paths, memes couleurs,
//    memes 3 groupes #fond / #plan-moyen / #avant-plan), seules quelques valeurs deviennent
//    fonction de la frame (palmes, miroitement, oiseaux, poissons de la claie).
// -> les 3 personnages ne sont PAS le SVG fige de Fable : ils sont RECONSTRUITS a chaque frame
//    par le socle <Figure> (StickFigure.tsx), habilles par les tenues EXACTES de Fable
//    (memes coordonnees, meme transport busteXf/headXf que identite/Roles.tsx).
//    Le SVG statique de Fable etait deja un port fidele du socle (meme hanche -26, meme buste
//    32, meme tete r=9) : le rebranchement est donc geometriquement neutre, il ne fait
//    qu'ajouter le temps.
//
// ⭐ LE VERROU PAS/DISTANCE (brique n°1) : le deplacement de la commercante est DERIVE du nombre
//    de pas ecoules via walkDistance(pas, swing, scale) — jamais un interpolate() de pixels.
//    swingMax est CONSTANT sur toute sa marche, donc l'appel sur le total est licite (cf. le
//    garde-fou "⛔⛔ SI swingDeg VARIE" en tete de walkDistance : ici il ne varie pas).
//
// TECHNIQUE : frame-driven strict. Aucun Math.random, aucune CSS transition, aucun setTimeout,
// aucun @keyframes, aucun requestAnimationFrame. Toute variation vient de la frame ou d'un
// dephasage a rapport irrationnel (phi, e, sqrt(2)).
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import {
  Figure,
  rad,
  stepLength,
  walkDistance,
  walkPhaseFromSteps,
  solveArm,
  HEAD_RADIUS,
  TORSO_LENGTH,
  HIP_Y_STANDING,
  WALK_DEFAULT,
  LEG_LENGTH,
  type WalkParams,
  type Pose,
} from "../../_shared/stick-figure-svg/StickFigure";
import { bodyPoints, type BodyPoints } from "../../_shared/stick-figure-svg/habillage";

export const PLAGE_FABLE_FRAMES = 300; // 10 s a 30 fps

// ============================================================================================
// DEPHASAGES IRRATIONNELS — jamais un offset simple (il retombe sur des postures identiques).
// ============================================================================================
const PHI = 1.6180339887;
const E = 2.718281828;
const SQRT2 = 1.4142135624;

// ============================================================================================
// PALETTE FABLE (reprise a l'identique du generateur)
// ============================================================================================
const CARN = {
  cuivre: "#c98a55",
  brunChaud: "#9c6539",
  brunProfond: "#6b4126",
};
const TEAL = "#2f9e9a", TEAL_S = "#1f6f6c";
const FUCHSIA = "#c2517f", FUCHSIA_S = "#8e3563";
const JAUNE = "#f2c53d";
const VERT = "#3f9e59", VERT_S = "#2b7040";
const PAILLE = "#e6c65a", PAILLE_S = "#b89a2e", RUBAN = "#2f6e4f";
const BLEU = "#3d6fb0", BLEU_S = "#2a4f80";

// ============================================================================================
// TRANSPORTS DE VETEMENT — copie conforme de identite/Roles.tsx (memes constantes, meme
// formule). Ne PAS "simplifier" : le t fixe (repere Fable) est le fix du bug "le vetement
// glisse le long du corps a chaque pas" (2026-07-29).
// ============================================================================================
const FABLE_HIP_Y = -26;
const FABLE_SHOULDER_Y = -58;
const NECK_EXTEND = 4.8;
const PAGNE_SUIVI_LEAN = 0.45;
const r2 = (n: number) => Math.round(n * 100) / 100;

const busteXf = (bp: BodyPoints) => {
  const { hx, hy, sx, sy } = bp;
  const dx = sx - hx, dy = sy - hy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len, uy = dy / len;
  const nx = -uy, ny = ux;
  return (fx: number, fy: number) => {
    const t = (fy - FABLE_HIP_Y) / (FABLE_SHOULDER_Y - FABLE_HIP_Y);
    return { x: hx + ux * len * t + nx * fx, y: hy + uy * len * t + ny * fx };
  };
};

const pathBuste = (bp: BodyPoints, pts: [number, number][]): string =>
  pts
    .map((p, i) => {
      const q = busteXf(bp)(p[0], p[1]);
      return `${i === 0 ? "M" : "L"} ${r2(q.x)} ${r2(q.y)}`;
    })
    .join(" ") + " Z";

const headXf = (bp: BodyPoints) => {
  const { hx, hy, sx, sy, headCx, headCy } = bp;
  const dx = sx - hx, dy = sy - hy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len, uy = dy / len;
  const nx = -uy, ny = ux;
  return (fx: number, fy: number) => ({
    x: headCx + ux * fy + nx * fx,
    y: headCy - uy * fy + ny * fx,
  });
};

type HeadCmd = { t: "M" | "L" | "Q"; p: [number, number]; c?: [number, number] };
const pathHead = (bp: BodyPoints, cmds: HeadCmd[], close = true): string => {
  const T = headXf(bp);
  const out: string[] = [];
  for (const cmd of cmds) {
    if (cmd.t === "Q" && cmd.c) {
      const c = T(cmd.c[0], cmd.c[1]);
      const p = T(cmd.p[0], cmd.p[1]);
      out.push(`Q ${r2(c.x)} ${r2(c.y)} ${r2(p.x)} ${r2(p.y)}`);
    } else {
      const p = T(cmd.p[0], cmd.p[1]);
      out.push(`${cmd.t} ${r2(p.x)} ${r2(p.y)}`);
    }
  }
  return out.join(" ") + (close ? " Z" : "");
};

// ============================================================================================
// TENUES DE FABLE (coordonnees EXACTES du generateur / de Roles.tsx)
// ============================================================================================
const Camisole: React.FC<{ bp: BodyPoints; fill: string; stroke: string }> = ({ bp, fill, stroke }) => (
  <path
    d={pathBuste(bp, [[-5, -56 - NECK_EXTEND], [7.5, -56 - NECK_EXTEND], [8.5, -31.5], [-6.5, -31.5]])}
    fill={fill} stroke={stroke} strokeWidth={1.2} strokeLinejoin="round"
  />
);

const Tunique: React.FC<{ bp: BodyPoints; fill: string; stroke: string }> = ({ bp, fill, stroke }) => (
  <path
    d={pathBuste(bp, [[-5, -56 - NECK_EXTEND], [7.5, -56 - NECK_EXTEND], [8, -28], [-6, -28]])}
    fill={fill} stroke={stroke} strokeWidth={1.2} strokeLinejoin="round"
  />
);

// ⭐⭐ PAGNE RACCOURCI — CORRECTION MESUREE, PAS UN CHOIX DE GOUT.
// Le pagne dessine par Fable descend a hanche+17 unites. La regle du registre (habillage.ts § 4)
// dit : "LA TUNIQUE NE DESCEND PAS SOUS ~hy+6. Plus bas, elle masque le ciseau des jambes — or le
// mouvement des jambes EST la lecture de la marche."
// Mesure sur le rendu v1 : a hanche+17, il ne restait que 35% de la jambe visible (de +17 a +26,
// le sol) et la commercante se lisait comme une COLONNE qui glisse, pas comme quelqu'un qui marche.
// C'est LA limite trouvee par ce test : un costume dessine pour une pose STATIQUE peut etre
// parfaitement beau et rendre la marche illisible des qu'on l'anime.
// Correction : ourlet remonte a +9 (compromis — la regle dit 6, mais a 6 le pagne devient une
// ceinture et on perd le vetement de Fable). Forme, couleurs et liseré jaune INCHANGES.
const PAGNE_OURLET = 9;
const PAGNE_LISERE = PAGNE_OURLET - 4;

const PagneTeal: React.FC<{ bp: BodyPoints }> = ({ bp }) => {
  const { hx, hy } = bp;
  const a = rad(bp.torso * PAGNE_SUIVI_LEAN);
  const P = (fx: number, fy: number) =>
    `${r2(hx + fx * Math.cos(a) - fy * Math.sin(a))} ${r2(hy + fx * Math.sin(a) + fy * Math.cos(a))}`;
  return (
    <>
      <path d={`M ${P(-6, -7)} L ${P(8, -7)} L ${P(10.2, PAGNE_OURLET)} L ${P(-8.4, PAGNE_OURLET)} Z`}
        fill={TEAL} stroke={TEAL_S} strokeWidth={1.2} strokeLinejoin="round" />
      <path d={`M ${P(-8, PAGNE_LISERE)} L ${P(9.8, PAGNE_LISERE)} L ${P(10.2, PAGNE_OURLET)} L ${P(-8.4, PAGNE_OURLET)} Z`}
        fill={JAUNE} />
    </>
  );
};

const FoulardTeal: React.FC<{ bp: BodyPoints }> = ({ bp }) => (
  <>
    <path d={pathHead(bp, [
      { t: "M", p: [-10.5, 2.5] },
      { t: "Q", c: [-10, -11.5], p: [0, -12] },
      { t: "Q", c: [10, -11.5], p: [10.5, 2.5] },
      { t: "Q", c: [5, -1], p: [0, -1.3] },
      { t: "Q", c: [-5, -1], p: [-10.5, 2.5] },
    ])} fill={TEAL} stroke={TEAL_S} strokeWidth={1.2} strokeLinejoin="round" />
    <path d={pathHead(bp, [
      { t: "M", p: [7, -9] }, { t: "Q", c: [9, -16], p: [13.5, -13.5] }, { t: "Q", c: [11.5, -9.5], p: [7, -9] },
    ])} fill={TEAL} stroke={TEAL_S} strokeWidth={1} />
    <path d={pathHead(bp, [
      { t: "M", p: [9.5, -7.5] }, { t: "Q", c: [14, -12.5], p: [16, -8.5] }, { t: "Q", c: [13, -6], p: [9.5, -7.5] },
    ])} fill={TEAL} stroke={TEAL_S} strokeWidth={1} />
  </>
);

const ChapeauPaille: React.FC<{ bp: BodyPoints }> = ({ bp }) => {
  const c = headXf(bp)(0, -5);
  return (
    <>
      <ellipse cx={r2(c.x)} cy={r2(c.y)} rx={16} ry={2.4} fill={PAILLE} stroke={PAILLE_S} strokeWidth={1.2} />
      <path d={pathHead(bp, [
        { t: "M", p: [-8, -7] }, { t: "Q", c: [-7, -15], p: [0, -15.5] }, { t: "Q", c: [7, -15], p: [8, -7] },
      ])} fill={PAILLE} stroke={PAILLE_S} strokeWidth={1.2} strokeLinejoin="round" />
      <path d={pathHead(bp, [
        { t: "M", p: [-7.8, -9.5] }, { t: "L", p: [7.8, -9.5] }, { t: "L", p: [8, -7] }, { t: "L", p: [-8, -7] },
      ])} fill={RUBAN} />
    </>
  );
};

// Le panier : dessine avec son POINT D'ACCROCHE en haut (anse) et sa masse en bas — regle
// d'identite gravee. Il est place AU BOUT DE LA MAIN, donc il suit la main sans calcul propre :
// c'est ce qui garantit qu'il ne "decolle" jamais.
const Panier: React.FC<{ main: { x: number; y: number } }> = ({ main }) => (
  <g transform={`translate(${r2(main.x)} ${r2(main.y)})`}>
    <path d="M -7.1,8.6 L 6.9,8.6 L 4.2,27.6 L -4.4,27.6 Z" fill="#b07a3f" strokeLinejoin="round" />
    <path d="M -6.6,8.6 Q 0,-8.6 6.4,8.6" fill="none" stroke="#8a5a2e" strokeWidth={2.6} strokeLinecap="round" />
    <path d="M -7.4,8.6 L 7.2,8.6" fill="none" stroke="#8a5a2e" strokeWidth={3} strokeLinecap="round" />
    <path d="M -4.5,12 L 4.6,12" stroke="#8a5a2e" strokeWidth={1.4} />
    <ellipse cx={-1.5} cy={6.6} rx={3.4} ry={2} fill="#c8ccd2" />
    <ellipse cx={2.5} cy={7} rx={3} ry={1.8} fill="#aeb4bd" />
  </g>
);

// ============================================================================================
// ASSEMBLAGE D'UN PERSONNAGE HABILLE — ORDRE DE RENDU OBLIGATOIRE (habillage.ts §
// ORDRE_HABILLAGE) : corps nu SANS bras avant -> vetements -> bras avant redessine -> tete.
// Le bras avant est redessine ICI avec la geometrie EXACTE du socle (recalculee par les memes
// formules), c'est la raison d'etre de la prop additive `hideArm1`.
// ============================================================================================
const ARM_LEN = 28;

const Perso: React.FC<{
  x: number; y: number; scale: number; flip?: boolean;
  phase: number; color: string;
  p?: Partial<WalkParams>; pose?: Pose;
  pagne?: (bp: BodyPoints) => React.ReactNode;
  buste?: (bp: BodyPoints) => React.ReactNode;
  coiffe?: (bp: BodyPoints) => React.ReactNode;
  objet?: (main: { x: number; y: number }, bp: BodyPoints) => React.ReactNode;
}> = ({ x, y, scale, flip = false, phase, color, p, pose = {}, pagne, buste, coiffe, objet }) => {
  const bp = bodyPoints(phase, p, pose.torsoDeg);
  // hipY force (pose manuelle) : bodyPoints ne le connait pas, on le reporte pour que les
  // vetements suivent le corps que <Figure> dessine reellement.
  const hy = pose.hipY !== undefined ? pose.hipY : bp.hy;
  const dHip = hy - bp.hy;
  const bpEff: BodyPoints = dHip === 0 ? bp : {
    ...bp, hy, sy: bp.sy + dHip, headCy: bp.headCy + dHip,
  };

  // Position de la main avant, avec la MEME formule que <Figure> (convention d'angle du socle :
  // 0 = le membre pend, 90 = a l'horizontale vers l'avant).
  const P = { ...WALK_DEFAULT, ...p };
  const a = phase * Math.PI * 2;
  const torso = bpEff.torso;
  const a1 = pose.arm1Deg !== undefined ? pose.arm1Deg + torso : -Math.sin(a) * P.armSwing;
  const armLen1 = pose.arm1Len ?? ARM_LEN;
  const main1 = pose.hand1
    ? { x: pose.hand1[0], y: pose.hand1[1] }
    : { x: bpEff.sx + Math.sin(rad(a1)) * armLen1, y: bpEff.sy + Math.cos(rad(a1)) * armLen1 };

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})${flip ? " scale(-1 1)" : ""}`}>
      {/* 1. le CORPS nu, bras avant omis (il repassera par-dessus le vetement) */}
      <Figure x={0} y={0} phase={phase} p={p} pose={pose} color={color} hideArm1 />
      {/* 1bis. ⭐ LE COU. <Figure> dessine le buste JUSQU'A L'EPAULE seulement, puis pose la tete
          12 unites plus haut : il reste donc un segment NU de ~3.4 unites (10px a scale 3) entre
          le bout du buste et le bord de la tete. Sur le SVG statique de Fable ca ne se voyait pas
          (la tete etait posee sur le col) ; des que le buste s'incline, le trou s'ouvre et la tete
          se lit comme DETACHEE (defaut vu au rendu v1 sur le pecheur penche a 32 deg).
          On comble avec un segment epaule->centre-tete de la couleur du corps, dessine AVANT le
          vetement pour que le col le recouvre normalement. Mesure : ecart ramene de 10.1px a 0. */}
      <line x1={bpEff.sx} y1={bpEff.sy} x2={bpEff.headCx} y2={bpEff.headCy}
        stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      {/* 2. les vetements recouvrent le corps */}
      {pagne?.(bpEff)}
      {buste?.(bpEff)}
      {/* 3. le bras AVANT, redessine par-dessus le vetement */}
      <line x1={bpEff.sx} y1={bpEff.sy} x2={main1.x} y2={main1.y}
        stroke={color} strokeWidth={4} strokeLinecap="round" />
      {/* 4. l'objet tenu, au bout de la main */}
      {objet?.(main1, bpEff)}
      {/* 5. la tete + la coiffe. <Figure> dessine deja la tete, mais elle est sous le vetement
             quand le col remonte : on la remet ici pour que le col ne mange pas le crane. */}
      <circle cx={bpEff.headCx} cy={bpEff.headCy} r={HEAD_RADIUS} fill={color} />
      {coiffe?.(bpEff)}
    </g>
  );
};

// ============================================================================================
// DECOR — LE SVG DE FABLE, TRANSPORTE TEL QUEL (3 groupes conserves).
// Les seuls ajouts : quelques valeurs deviennent fonction de `f` (la frame).
// ============================================================================================

// --- micro-vie : une palme qui oscille autour de son point d'attache -------------------------
// Le palmier de Fable dessine ses palmes en `q` RELATIF depuis le sommet du tronc : il suffit
// donc de faire pivoter chaque palme autour de ce sommet, la forme est preservee exactement.
const PALM_SPECS: [number, number, number, number][] = [
  [-46, -26, -78, -2], [-30, -40, -58, -34], [-6, -46, -18, -56],
  [12, -44, 32, -50], [30, -32, 62, -26], [42, -14, 80, 4], [8, -30, 14, -38],
];

const Palmier: React.FC<{
  x: number; yBase: number; hTrunk: number; leanX: number;
  scaleFronds?: number; dark?: boolean; f: number; seed: number;
}> = ({ x, yBase, hTrunk, leanX, scaleFronds = 1, dark = false, f, seed }) => {
  const topX = x + leanX, topY = yBase - hTrunk;
  const tc = dark ? "#5d3a26" : "#7a5232";
  const fc = dark ? "#27523f" : "#2f6e4f";
  // brise lente : chaque palme a sa propre periode (rapports irrationnels) et sa propre phase.
  const t = f / 30;
  return (
    <>
      <path
        d={`M ${x - 5} ${yBase} Q ${x + leanX * 0.35 - 4} ${yBase - hTrunk * 0.55} ${r2(topX - 2.5)} ${r2(topY)} L ${r2(topX + 2.5)} ${r2(topY)} Q ${x + leanX * 0.45 + 6} ${yBase - hTrunk * 0.5} ${x + 7} ${yBase} Z`}
        fill={tc}
      />
      {PALM_SPECS.map(([cx1, cy1, ex, ey], i) => {
        // amplitude FAIBLE (~2.2 deg) : une palme ne bat pas, elle respire.
        const ang =
          2.2 * Math.sin(t * (0.62 + i * 0.045) * PHI + i * SQRT2 + seed) +
          0.8 * Math.sin(t * 0.41 * E + i * PHI + seed * 2);
        return (
          <path
            key={i}
            transform={`rotate(${r2(ang)} ${r2(topX)} ${r2(topY)})`}
            d={`M ${r2(topX)} ${r2(topY)} q ${cx1 * scaleFronds} ${cy1 * scaleFronds} ${ex * scaleFronds} ${ey * scaleFronds}`}
            fill="none" stroke={fc} strokeWidth={7 * scaleFronds} strokeLinecap="round"
          />
        );
      })}
      <circle cx={r2(topX - 4)} cy={r2(topY + 6)} r={3.6} fill="#6b4126" />
      <circle cx={r2(topX + 4)} cy={r2(topY + 7)} r={3.6} fill="#6b4126" />
    </>
  );
};

const Fish: React.FC<{ x: number; y: number; len: number; color: string; rot?: number }> = ({
  x, y, len, color, rot = 0,
}) => {
  const h = len * 0.24;
  return (
    <g transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})`}>
      <path d={`M ${-len * 0.5},0 Q 0,${-h} ${len * 0.32},0 Q 0,${h} ${-len * 0.5},0 Z`} fill={color} />
      <path d={`M ${len * 0.3},0 L ${len * 0.52},${-h * 0.8} L ${len * 0.52},${h * 0.8} Z`} fill={color} />
    </g>
  );
};

const Crate: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <>
    <rect x={x} y={y} width={w} height={h} fill="#8a5a2e" stroke="#5d3a1e" strokeWidth={2.5} />
    {[1, 2].map((i) => (
      <line key={i} x1={x + 2} y1={r2(y + (h / 3) * i)} x2={x + w - 2} y2={r2(y + (h / 3) * i)}
        stroke="#5d3a1e" strokeWidth={2} />
    ))}
    <rect x={x} y={y} width={6} height={h} fill="#a06a38" />
    <rect x={x + w - 6} y={y} width={6} height={h} fill="#a06a38" />
  </>
);

const Pirogue: React.FC<{ id: string; x: number; y: number; w: number; base: string; stripes: string[] }> = ({
  id, x, y, w, base, stripes,
}) => {
  const hull =
    `M ${x} ${y - 60} C ${x + 0.1 * w} ${y - 18} ${x + 0.28 * w} ${y} ${x + 0.52 * w} ${y} ` +
    `C ${x + 0.76 * w} ${y} ${x + 0.92 * w} ${y - 16} ${x + w} ${y - 54} ` +
    `C ${x + 0.8 * w} ${y - 36} ${x + 0.62 * w} ${y - 33} ${x + 0.5 * w} ${y - 33} ` +
    `C ${x + 0.36 * w} ${y - 33} ${x + 0.15 * w} ${y - 38} ${x} ${y - 60} Z`;
  const gunwale =
    `M ${x} ${y - 60} C ${x + 0.15 * w} ${y - 38} ${x + 0.36 * w} ${y - 33} ${x + 0.5 * w} ${y - 33} ` +
    `C ${x + 0.62 * w} ${y - 33} ${x + 0.8 * w} ${y - 36} ${x + w} ${y - 54}`;
  return (
    <>
      <ellipse cx={x + w / 2} cy={y + 3} rx={w * 0.46} ry={7} fill="#96602f" />
      <clipPath id={id}><path d={hull} /></clipPath>
      <path d={hull} fill={base} />
      {stripes.map((s, i) => (
        <rect key={i} x={x} y={y - 26 + i * 8} width={w} height={7} fill={s} clipPath={`url(#${id})`} />
      ))}
      <path d={gunwale} fill="none" stroke="#4a2e1c" strokeWidth={3} />
      <path d={hull} fill="none" stroke="#4a2e1c" strokeWidth={2.5} strokeLinejoin="round" />
    </>
  );
};

// --------------------------------------------------------------------------------------------
// #fond — ciel, mer, soleil, village. Vit par : miroitement du soleil + oiseaux qui derivent.
// --------------------------------------------------------------------------------------------
const STARS: [number, number, number][] = [
  [180, 60, 0.8], [420, 110, 0.5], [760, 45, 0.7], [1120, 90, 0.5],
  [1560, 55, 0.8], [1800, 130, 0.5], [980, 140, 0.4],
];
const GLITTER: [number, number, number, number][] = [
  [1332, 486, 96, 0.85], [1346, 505, 68, 0.7], [1324, 524, 112, 0.6], [1352, 545, 56, 0.5],
  [1330, 566, 100, 0.4], [1318, 590, 124, 0.32], [1342, 616, 76, 0.25],
];

const Fond: React.FC<{ f: number }> = ({ f }) => {
  const t = f / 30;
  return (
    <g id="fond">
      <rect x={0} y={0} width={1920} height={170} fill="#2b2a55" />
      <rect x={0} y={170} width={1920} height={120} fill="#4b3364" />
      <rect x={0} y={290} width={1920} height={105} fill="#8f4a63" />
      <rect x={0} y={395} width={1920} height={75} fill="#d07a4e" />
      {/* etoiles : scintillement tres lent, deterministe */}
      {STARS.map(([sx, sy, o], i) => (
        <circle key={i} cx={sx} cy={sy} r={2} fill="#f0e8d2"
          opacity={r2(o * (0.78 + 0.22 * Math.sin(t * 0.7 * PHI + i * E)))} />
      ))}
      <ellipse cx={330} cy={150} rx={180} ry={13} fill="#3a3566" />
      <ellipse cx={1490} cy={105} rx={150} ry={11} fill="#3a3566" />
      <ellipse cx={900} cy={235} rx={220} ry={14} fill="#5c3f70" />
      <ellipse cx={1700} cy={330} rx={190} ry={12} fill="#a25a68" />
      <ellipse cx={480} cy={345} rx={160} ry={11} fill="#a25a68" />
      <ellipse cx={1150} cy={425} rx={240} ry={12} fill="#de8f57" />
      <circle cx={1380} cy={470} r={78} fill="#f2c46b" opacity={0.25} />
      <circle cx={1380} cy={470} r={56} fill="#f6c96e" />
      {/* oiseaux : ils DERIVENT lentement vers la gauche + battent d'aile (la courbe s'aplatit) */}
      {([[560, 200, 1], [620, 232, 0.8], [1060, 175, 0.9]] as [number, number, number][]).map(
        ([bx0, by, s], i) => {
          const bx = bx0 - t * (7 + i * 2.5);
          const flap = 1 + 0.42 * Math.sin(t * (4.1 + i * 0.6) * PHI + i * SQRT2);
          const by2 = by + 3 * Math.sin(t * 0.8 * E + i * PHI);
          return (
            <path key={i}
              d={`M ${r2(bx - 14 * s)} ${r2(by2)} Q ${r2(bx - 6 * s)} ${r2(by2 - 9 * s * flap)} ${r2(bx)} ${r2(by2)} Q ${r2(bx + 6 * s)} ${r2(by2 - 9 * s * flap)} ${r2(bx + 14 * s)} ${r2(by2)}`}
              fill="none" stroke="#241f3d" strokeWidth={3 * s} strokeLinecap="round" />
          );
        },
      )}
      <rect x={0} y={470} width={1920} height={55} fill="#33556f" />
      <rect x={0} y={470} width={1920} height={14} fill="#d07a4e" opacity={0.35} />
      <rect x={0} y={525} width={1920} height={60} fill="#2c4963" />
      <rect x={0} y={585} width={1920} height={62} fill="#26405a" />
      {/* trainee du soleil : chaque barre ONDULE (largeur + x + opacite), periodes irrationnelles */}
      {GLITTER.map(([gx, gy, gw, go], i) => {
        const w = gw * (1 + 0.14 * Math.sin(t * (0.9 + i * 0.11) * PHI + i * E));
        const dx = 7 * Math.sin(t * (0.65 + i * 0.08) * SQRT2 + i * PHI);
        const op = go * (0.82 + 0.18 * Math.sin(t * 1.15 * E + i * SQRT2));
        return (
          <rect key={i} x={r2(gx + (gw - w) / 2 + dx)} y={gy} width={r2(w)} height={6} rx={3}
            fill="#f2c46b" opacity={r2(op)} />
        );
      })}
      <path d="M 0 470 L 0 428 L 60 428 L 60 414 L 96 414 L 96 430 L 170 430 L 170 408 L 196 396 L 222 408 L 222 434 L 300 434 L 300 420 L 344 420 L 344 440 L 430 452 L 470 470 Z" fill="#22304f" />
      <rect x={128} y={372} width={38} height={22} rx={6} fill="#22304f" />
      <line x1={134} y1={394} x2={130} y2={428} stroke="#22304f" strokeWidth={5} />
      <line x1={160} y1={394} x2={164} y2={428} stroke="#22304f" strokeWidth={5} />
      {([[72, 420], [186, 416], [310, 426], [246, 440]] as [number, number][]).map(([wx, wy], i) => (
        <rect key={i} x={wx} y={wy} width={5} height={5} fill="#f2c46b"
          opacity={r2(0.9 * (0.85 + 0.15 * Math.sin(t * 0.5 * PHI + i * E)))} />
      ))}
      {/* pirogues au large : tangage tres lent (ce sont des VEHICULES, elles ont le droit de bouger) */}
      <g transform={`translate(${r2(-t * 3.2)} ${r2(1.6 * Math.sin(t * 0.55 * PHI))}) rotate(${r2(0.9 * Math.sin(t * 0.55 * PHI))} 760 556)`}>
        <path d="M 720 560 Q 760 574 800 560 L 786 552 L 734 552 Z" fill="#1f2c4e" />
        <path d="M 758 552 L 758 496 L 726 552 Z" fill="#1f2c4e" />
      </g>
      <g transform={`translate(${r2(-t * 2.1)} ${r2(1.2 * Math.sin(t * 0.48 * E + 1.3))}) rotate(${r2(0.8 * Math.sin(t * 0.48 * E + 1.3))} 1038 520)`}>
        <path d="M 1010 522 Q 1038 532 1066 522 L 1056 516 L 1020 516 Z" fill="#1f2c4e" />
        <path d="M 1042 516 L 1042 478 L 1020 516 Z" fill="#1f2c4e" />
      </g>
      {/* ligne d'ecume : elle avance/recule tres legerement (la mer respire) */}
      <path
        transform={`translate(0 ${r2(2.4 * Math.sin(t * 0.5 * PHI))})`}
        d="M 0 647 Q 160 640 320 646 Q 480 652 640 645 Q 800 639 960 646 Q 1120 652 1280 645 Q 1440 639 1600 646 Q 1760 652 1920 645 L 1920 656 L 0 656 Z"
        fill="#e8dcc0" opacity={0.55}
      />
    </g>
  );
};

// --------------------------------------------------------------------------------------------
// #plan-moyen — sable, cabane, palmiers, pirogues au sec, claie, perso-3.
// --------------------------------------------------------------------------------------------
const PlanMoyen: React.FC<{ f: number }> = ({ f }) => {
  const t = f / 30;
  return (
    <g id="plan-moyen">
      <rect x={0} y={650} width={1920} height={285} fill="#c08a52" />
      {([[260, 730, 130], [780, 700, 100], [1500, 720, 150], [1080, 780, 120], [420, 860, 160], [1700, 860, 130]] as [number, number, number][]).map(
        ([ex, ey, rx], i) => <ellipse key={i} cx={ex} cy={ey} rx={rx} ry={rx * 0.18} fill="#b17a45" />,
      )}
      <g id="cabane">
        <rect x={80} y={640} width={196} height={112} fill="#8a5a2e" stroke="#5d3a1e" strokeWidth={2.5} />
        <line x1={80} y1={676} x2={276} y2={676} stroke="#5d3a1e" strokeWidth={2} />
        <line x1={80} y1={712} x2={276} y2={712} stroke="#5d3a1e" strokeWidth={2} />
        <path d="M 62 644 L 178 596 L 294 644 Z" fill="#c9a23f" stroke="#a5822a" strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M 62 644 L 294 644 L 288 654 L 68 654 Z" fill="#a5822a" />
        <rect x={206} y={682} width={44} height={70} fill="#4a2e1c" />
        {/* la fenetre allumee vacille tres legerement (lampe a petrole) */}
        <rect x={108} y={678} width={40} height={34} fill="#f2c46b" stroke="#5d3a1e" strokeWidth={3}
          opacity={r2(0.88 + 0.12 * Math.sin(t * 1.7 * PHI) * Math.sin(t * 0.9 * E))} />
        <line x1={128} y1={678} x2={128} y2={712} stroke="#5d3a1e" strokeWidth={2.5} />
      </g>
      <g id="palmier-1"><Palmier x={400} yBase={705} hTrunk={210} leanX={46} scaleFronds={1.15} f={f} seed={0} /></g>
      <g id="palmier-2"><Palmier x={1795} yBase={690} hTrunk={175} leanX={-40} scaleFronds={1} dark f={f} seed={2.4} /></g>
      <g id="pirogue-1"><Pirogue id="clipPir1" x={300} y={806} w={430} base="#e8dcc0" stripes={["#d5493a", "#2f9e9a", "#e6c65a"]} /></g>
      <g id="pirogue-2"><Pirogue id="clipPir2" x={1450} y={786} w={400} base="#7fb2c9" stripes={["#e6c65a", "#d5493a"]} /></g>
      <g id="claie">
        <line x1={905} y1={795} x2={935} y2={688} stroke="#6b4126" strokeWidth={7} strokeLinecap="round" />
        <line x1={965} y1={795} x2={935} y2={688} stroke="#6b4126" strokeWidth={7} strokeLinecap="round" />
        <line x1={1175} y1={795} x2={1205} y2={688} stroke="#6b4126" strokeWidth={7} strokeLinecap="round" />
        <line x1={1235} y1={795} x2={1205} y2={688} stroke="#6b4126" strokeWidth={7} strokeLinecap="round" />
        <line x1={920} y1={690} x2={1222} y2={690} stroke="#8a5a2e" strokeWidth={6} strokeLinecap="round" />
        {/* les poissons pendus BALANCENT autour de leur point d'accroche (la ficelle) */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const fx = 962 + i * 44;
          const ang = 3.4 * Math.sin(t * (1.05 + i * 0.07) * PHI + i * SQRT2) +
            1.2 * Math.sin(t * 0.73 * E + i * PHI);
          return (
            <g key={i} transform={`rotate(${r2(ang)} ${fx} 690)`}>
              <line x1={fx} y1={690} x2={fx} y2={706} stroke="#e6c65a" strokeWidth={2} />
              <Fish x={fx} y={722} len={34} color={i % 2 ? "#c8ccd2" : "#aeb4bd"} rot={90} />
            </g>
          );
        })}
      </g>
      <Perso3 f={f} />
    </g>
  );
};

// --------------------------------------------------------------------------------------------
// #avant-plan — sable proche, proue, caisses, filet, perso-1 et perso-2.
// --------------------------------------------------------------------------------------------
const AvantPlan: React.FC<{ f: number }> = ({ f }) => (
  <g id="avant-plan">
    <rect x={0} y={935} width={1920} height={145} fill="#aa6f3c" />
    {([[240, 1000, 150], [700, 1060, 170], [1500, 990, 140], [1050, 1070, 150]] as [number, number, number][]).map(
      ([ex, ey, rx], i) => <ellipse key={i} cx={ex} cy={ey} rx={rx} ry={rx * 0.16} fill="#9a6134" />,
    )}
    {[0, 1, 2, 3, 4].map((i) => (
      <ellipse key={i} cx={160 + i * 72} cy={1044 + (i % 2) * 8} rx={9} ry={4} fill="#96602f" />
    ))}
    <g id="proue">
      <clipPath id="clipProue"><path d="M 1596 1080 C 1622 1006 1688 946 1806 914 L 1920 900 L 1920 1080 Z" /></clipPath>
      <path d="M 1596 1080 C 1622 1006 1688 946 1806 914 L 1920 900 L 1920 1080 Z" fill="#e8dcc0" />
      <path d="M 1596 1080 C 1622 1006 1688 946 1806 914 L 1920 900 L 1920 926 L 1812 940 C 1706 970 1650 1020 1628 1080 Z" fill="#2a4f80" clipPath="url(#clipProue)" />
      <path d="M 1648 1080 C 1670 1026 1722 984 1826 956 L 1920 944 L 1920 962 L 1832 974 C 1742 1000 1696 1038 1678 1080 Z" fill="#d5493a" clipPath="url(#clipProue)" />
      <circle cx={1852} cy={1042} r={15} fill="#f0e8d2" clipPath="url(#clipProue)" />
      <circle cx={1852} cy={1042} r={7} fill="#22304f" clipPath="url(#clipProue)" />
      <path d="M 1596 1080 C 1622 1006 1688 946 1806 914 L 1920 900" fill="none" stroke="#4a2e1c" strokeWidth={4} />
    </g>
    <g id="pagaie">
      <line x1={1730} y1={948} x2={1656} y2={1078} stroke="#a08050" strokeWidth={7} strokeLinecap="round" />
      <ellipse cx={1742} cy={934} rx={12} ry={24} fill="#a08050" transform="rotate(28 1742 934)" />
    </g>
    <g id="caisses">
      <Crate x={994} y={985} w={124} h={56} />
      <Crate x={1002} y={936} w={108} h={49} />
      <Fish x={1032} y={934} len={40} color="#c8ccd2" rot={-8} />
      <Fish x={1070} y={930} len={36} color="#aeb4bd" rot={6} />
      <Fish x={1098} y={936} len={34} color="#c8ccd2" rot={-4} />
    </g>
    {/* le filet est solidaire des mains du pecheur : il est dessine DANS Perso2 (cf. plus bas) */}
    <Perso2 f={f} />
    <g id="corde">
      <circle cx={330} cy={1005} r={20} fill="none" stroke="#a08050" strokeWidth={6} />
      <circle cx={330} cy={1005} r={9} fill="none" stroke="#a08050" strokeWidth={5} />
    </g>
    <circle cx={806} cy={1042} r={5} fill="#e8dcc0" />
    <circle cx={842} cy={1056} r={4} fill="#e8dcc0" />
    <path d="M 890 1024 l 5 -12 l 5 12 l 12 2 l -9 8 l 3 13 l -11 -7 l -11 7 l 3 -13 l -9 -8 Z" fill="#d5493a" opacity={0.9} />
    <Perso1 f={f} />
  </g>
);

// ============================================================================================
// ⭐ PERSO-1 — LA COMMERCANTE QUI ARRIVE (intention : ARRIVER, puis s'arreter)
// ============================================================================================
// Elle marche vers la droite et s'arrete pres des caisses. TOUT son deplacement vient du
// VERROU PAS/DISTANCE : on interpole un NOMBRE DE PAS, jamais des pixels.
const P1_SCALE = 3;
const P1_SWING = 17;              // constant sur toute la marche -> walkDistance sur le total est licite
const P1_WALK: Partial<WalkParams> = { swingMax: P1_SWING, bobAmp: 2.5, lean: 2, armSwing: 20 };
const P1_X0 = 300;                // depart, hors du champ d'interet, a gauche
const P1_Y = 1050;                // le sol sous ses pieds (avant-plan)
const P1_PAS_TOTAL = 4.6;         // nombre de pas parcourus avant l'arret
const P1_T_ARRET = 200;           // frame ou elle est completement arretee
// ⚠️ CADENCE — mesuree, pas choisie a l'oeil. Le socle a jambes RIGIDES fait toujours glisser
// legerement le pied d'appui (la geometrie du pied est un arc de sinus, la vitesse du corps est
// constante : les deux ne coincident qu'en un point). Mesure sur la marche NOMINALE deja validee
// par Aziz (scale=3, swing=17, cadence 0.036 pas/frame) : 5.0 px/frame de glissement. C'est le
// plancher du registre, pas un defaut de cette scene. Notre easing d'arrivee ne doit donc PAS
// depasser cette cadence de reference, sinon on AGGRAVE un defaut connu du socle.
// Exposant 1.35 : cadence de depart 0.0341 pas/frame -> sous la reference. (2.2 donnait 0.050.)
const P1_EASE_EXP = 1.35;
// distance couverte a l'ecran = pas x 2 x L x sin(swing) x scale
const P1_PAS_PX = stepLength(P1_SWING) * P1_SCALE; // ~59.6 px par pas

const Perso1: React.FC<{ f: number }> = ({ f }) => {
  // ⭐ On interpole le NOMBRE DE PAS (easing d'arrivee : elle ralentit puis se pose), et la
  // position en decoule. Les pieds ne peuvent PAS patiner : x et la phase du cycle sont deux
  // lectures de la MEME grandeur.
  const pas = interpolate(f, [0, P1_T_ARRET], [0, P1_PAS_TOTAL], {
    easing: (x) => 1 - Math.pow(1 - x, P1_EASE_EXP), // decelere en arrivant
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = P1_X0 + walkDistance(pas, P1_SWING, P1_SCALE);
  const phase = walkPhaseFromSteps(pas);

  // A l'arret, le swing residuel doit retomber a 0 sans ecraser l'oscillation pendant la marche :
  // on laisse la phase GELER (pas ne progresse plus) et on force une pose d'arret douce apres
  // T_ARRET. C'est un HERITAGE (brique n°7) : la pose d'arret part de la phase REELLE de fin.
  const phaseFin = walkPhaseFromSteps(P1_PAS_TOTAL);
  const arret = interpolate(f, [P1_T_ARRET - 22, P1_T_ARRET], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // jambes : on ramene le ciseau de fin vers la station debout (leger ecart, pas deux traits
  // superposes — cf. regle "deux membres au meme angle = un seul trait").
  const swingFin = Math.sin(phaseFin * Math.PI * 2) * P1_SWING;
  const l1 = swingFin * (1 - arret) + 6 * arret;
  const l2 = -swingFin * (1 - arret) - 5 * arret;

  // respiration une fois arretee (UN personnage seul : l'immobilite habitee est validee)
  const t = f / 30;
  const souffle = arret * 0.9 * Math.sin((t - P1_T_ARRET / 30) * 1.25 * PHI);

  const pose: Pose = {
    hand1: [16, -31], // le panier reste tenu a la MEME place dans le repere du corps -> il ne
                       // peut pas decoller de la main : il EST la main.
    arm2Deg: -24 * (1 - arret) + -14 * arret,
    ...(arret > 0
      ? { leg1Deg: l1, leg2Deg: l2, torsoDeg: 2 - souffle * 0.6 }
      : {}),
  };

  return (
    <Perso
      x={x} y={P1_Y} scale={P1_SCALE} phase={phase} color={CARN.cuivre}
      p={{ ...P1_WALK, bobAmp: 2.5 * (1 - arret) }}
      pose={pose}
      pagne={(bp) => <PagneTeal bp={bp} />}
      buste={(bp) => <Camisole bp={bp} fill={FUCHSIA} stroke={FUCHSIA_S} />}
      coiffe={(bp) => <FoulardTeal bp={bp} />}
      objet={(main) => <Panier main={main} />}
    />
  );
};

// ============================================================================================
// ⭐ PERSO-2 — LE PECHEUR QUI TRAVAILLE (intention : VIDER LE FILET, sur place)
// ============================================================================================
// Geste repete : le buste PLONGE vers les caisses puis se redresse, les bras accompagnent.
// ⛔ Aucune manipulation fine : le filet est DEJA en main. On anime le CORPS, et le filet suit
//    les mains (partir de l'OBJET, pas des bras — regle du registre).
const P2_X = 1262, P2_Y = 1035, P2_SCALE = 3;
const P2_CYCLE = 86; // frames par cycle de vidage (~2.9 s) — un geste de travail, pas un tic

/**
 * Fenetre a bords adoucis : 0 hors de [a,b], 1 au coeur, avec une rampe smoothstep de largeur
 * `ramp` a l'entree ET a la sortie. Evite qu'un effet (secousse, vibration) s'allume en escalier
 * — une discontinuite d'amplitude se lit comme un SAUT d'image, meme minuscule.
 */
const smoothWindow = (u: number, a: number, b: number, ramp: number): number => {
  const ss = (t: number) => {
    const c = Math.min(1, Math.max(0, t));
    return c * c * (3 - 2 * c);
  };
  return ss((u - a) / ramp) * ss((b - u) / ramp);
};

const perso2Pose = (f: number): { pose: Pose; bp: BodyPoints } => {
  // u in [0,1[ : ou on en est dans le cycle. Le geste n'est PAS un sinus pur : la descente est
  // plus lente que la remontee (on verse, on secoue, on se redresse).
  const u = ((f % P2_CYCLE) + P2_CYCLE) % P2_CYCLE / P2_CYCLE;
  // enveloppe : 0 = redresse, 1 = penche a fond sur la caisse
  const plonge =
    u < 0.45
      ? Math.pow(u / 0.45, 1.6)                       // il se penche (accelere)
      : u < 0.62
        ? 1                                            // il maintient, il secoue (voir shake)
        // ⛔ exposant 0.85 -> la remontee arrivait a u=1 avec une pente de -9.06 alors que la
        // descente repart a +0.014 : le buste s'ARRETAIT NET a chaque bouclage (2e cause du saut
        // signale par Aziz). Un exposant >1 fait mourir la vitesse en fin de course : les deux
        // bouts du cycle se raccordent maintenant a pente ~0.
        : Math.pow(1 - (u - 0.62) / 0.38, 1.7);        // il se redresse (decelere en fin)
  // secousse du filet pendant le maintien (2 sinus a rapport irrationnel, amplitude faible).
  // ⛔ BUG CORRIGE (repere par Aziz sur le rendu v3, 2026-08-18) : `inShake` etait un ESCALIER
  // (0 ou 1). La secousse apparaissait et disparaissait d'un coup a u=0.45 et u=0.62, et comme
  // elle est ajoutee au buste ET aux mains, TOUT le haut du corps sautait d'un cran a chaque
  // bascule. Le filet, dont la forme est recalculee depuis les mains, sautait avec — et comme
  // c'est un grand aplat clair de l'avant-plan, l'oeil lisait ca comme un tremblement de TOUTE
  // la scene (symptome percu a un endroit, cause a un autre).
  // ⭐ REGLE : une enveloppe d'effet ne s'allume JAMAIS en escalier — elle monte et redescend.
  const inShake = smoothWindow(u, 0.45, 0.62, 0.05);
  // ⛔ 2e CAUSE, trouvee par MESURE (pas au jugé) : adoucir les BORDS ne suffisait pas — au COEUR
  // de la fenetre, les frequences 0.9/0.55 faisaient varier le buste de 2.17 deg D'UNE FRAME A
  // L'AUTRE. A 30fps ce n'est plus une secousse, c'est une VIBRATION : c'est ce que Aziz decrivait
  // ("l'image saute quand il se penche"). Frequences divisees par ~4 et amplitudes reduites ->
  // 0.46 deg/frame max (mesure). Le geste reste lisible, le saut disparait.
  // ⭐ REGLE : une oscillation se juge sur sa VARIATION PAR FRAME, jamais sur son amplitude seule.
  const shake = inShake * (1.0 * Math.sin(u * P2_CYCLE * 0.22 * PHI) + 0.45 * Math.sin(u * P2_CYCLE * 0.14 * E));

  const torsoDeg = 12 + 20 * plonge + shake;
  // les jambes s'ecartent un peu plus quand il plonge (il cale son appui)
  const leg1Deg = 12 + 6 * plonge;
  const leg2Deg = -10 - 5 * plonge;
  // hanche : il descend legerement en se penchant (hipDrop), sans s'accroupir
  const hipDrop = 3.5 * plonge;

  // ⭐ LES MAINS : on decide OU VA LE FILET (l'objet d'abord), les bras suivent.
  // ⚠️ Cibles CALEES PAR MESURE sur la butee IK, pas choisies a l'oeil : avec [30,-44]/[22,-52]
  // la tension montait a 96.3% de la portee (limite dure 97%, cible ~89%) — un bras en butee
  // ne tient pas sa pose et tremble d'une frame a l'autre. Rapprochees de l'epaule jusqu'a
  // repasser sous 92% sur TOUT le cycle (verifie par le controle en bas de fichier).
  const h1: [number, number] = [26 + 4.5 * plonge, -44 + 9 * plonge + shake * 0.4];
  const h2: [number, number] = [19 + 3.5 * plonge, -51 + 10 * plonge + shake * 0.3];

  // hipDrop n'est PAS un champ de Pose (c'est un WalkParams) : on l'exprime directement en hipY,
  // ce qui est la seule facon pour <Figure> de le prendre en compte dans une pose manuelle.
  const pose: Pose = {
    torsoDeg, leg1Deg, leg2Deg,
    hipY: HIP_Y_STANDING - hipDrop,
    hand1: h1, hand2: h2,
  };
  const bp = bodyPoints(0, { bobAmp: 0, hipDrop }, torsoDeg);
  return { pose, bp: { ...bp, hy: HIP_Y_STANDING - hipDrop, sy: bp.sy, headCy: bp.headCy } };
};

const Perso2: React.FC<{ f: number }> = ({ f }) => {
  const { pose } = perso2Pose(f);
  const bp = bodyPoints(0, { bobAmp: 0 }, pose.torsoDeg);
  // hipY force -> on reporte le decalage sur epaule/tete (meme logique que <Perso>)
  const dHip = (pose.hipY as number) - bp.hy;
  const bpEff: BodyPoints = { ...bp, hy: pose.hipY as number, sy: bp.sy + dHip, headCy: bp.headCy + dHip };

  // mains en coordonnees MONDE (le groupe est flippe : x monde = P2_X - xlocal*scale)
  const h1 = pose.hand1 as [number, number];
  const h2 = pose.hand2 as [number, number];
  const w1 = { x: P2_X - h1[0] * P2_SCALE, y: P2_Y + h1[1] * P2_SCALE };
  const w2 = { x: P2_X - h2[0] * P2_SCALE, y: P2_Y + h2[1] * P2_SCALE };

  return (
    <>
      {/* le filet est dessine AVANT le pecheur : il pend entre ses mains et la caisse, donc il
          passe derriere lui. Il suit les mains a la frame pres. */}
      <Filet h1={w1} h2={w2} f={f} />
      <Perso
        x={P2_X} y={P2_Y} scale={P2_SCALE} flip phase={0} color={CARN.brunProfond}
        p={{ bobAmp: 0 }} pose={pose}
        buste={(b) => <Tunique bp={b} fill={BLEU} stroke={BLEU_S} />}
      />
    </>
  );
};

// Le filet : sa forme est RECALCULEE a partir de la position reelle des mains (il ne peut donc
// pas se detacher). Il se tend quand les mains montent, il s'affaisse quand elles descendent.
const Filet: React.FC<{ h1: { x: number; y: number }; h2: { x: number; y: number }; f: number }> = ({
  h1, h2, f,
}) => {
  const cx1 = 1002, cx2 = 1108, cy = 942;
  const t = f / 30;
  // affaissement : plus les mains sont hautes, plus la poche du filet pend (mou de la maille)
  const mou = interpolate(h1.y, [P2_Y - 44 * P2_SCALE, P2_Y - 30 * P2_SCALE], [30, 8], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const osc = 2.2 * Math.sin(t * 1.3 * PHI) + 0.9 * Math.sin(t * 0.8 * E);
  const region =
    `M ${r2(h1.x)} ${r2(h1.y)} L ${r2(h2.x)} ${r2(h2.y)} ` +
    `C ${cx2 + 30} ${r2(cy - 40 + mou * 0.4)} ${cx2 + 10} ${r2(cy - 18 + mou * 0.3)} ${cx2} ${cy} ` +
    `L ${cx1} ${cy} ` +
    `C ${cx1 + 40} ${r2(cy - 10 + mou * 0.2)} ${r2((cx1 + h1.x) / 2)} ${r2((cy + h1.y) / 2 + 26 + mou * 0.5 + osc)} ${r2(h1.x)} ${r2(h1.y)} Z`;
  const lines: React.ReactNode[] = [];
  for (let i = 1; i <= 4; i++) {
    const tt = i / 5;
    const sx = h1.x + (cx1 - h1.x) * tt + 18 * Math.sin(tt * Math.PI);
    const sy = h1.y + (cy - h1.y) * tt + (14 + mou * 0.35) * Math.sin(tt * Math.PI);
    const ex = h2.x + (cx2 - h2.x) * tt;
    const ey = h2.y + (cy - h2.y) * tt + (10 + mou * 0.25) * Math.sin(tt * Math.PI);
    lines.push(<line key={`a${i}`} x1={r2(sx)} y1={r2(sy)} x2={r2(ex)} y2={r2(ey)} stroke="#5e93ad" strokeWidth={1.6} />);
  }
  for (let i = 0; i <= 3; i++) {
    const tt = i / 3;
    const sx = h1.x + (h2.x - h1.x) * tt;
    const sy = h1.y + (h2.y - h1.y) * tt;
    const ex = cx1 + (cx2 - cx1) * tt;
    lines.push(<line key={`b${i}`} x1={r2(sx)} y1={r2(sy)} x2={r2(ex)} y2={cy} stroke="#5e93ad" strokeWidth={1.6} />);
  }
  return (
    <g id="filet">
      <path d={region} fill="#7fb2c9" opacity={0.4} />
      {lines}
    </g>
  );
};

// ============================================================================================
// ⭐ PERSO-3 — L'HOMME QUI ATTEND (intention : ATTENDRE — HIERARCHIE DE L'ATTENTION)
// ============================================================================================
// ⛔ Il ne doit PAS avoir la meme energie que les deux autres. Un seul foyer a la fois.
// Ce qu'il fait : un TRANSFERT DE POIDS tres lent (periode ~7 s, admis par le registre : il
// deplace le centre de gravite, il ne vibre pas) + une respiration a peine perceptible.
// Son baton reste plante dans le sol : c'est un APPUI, il ne suit pas la main, c'est la MAIN
// qui reste dessus.
const P3_X = 852, P3_Y = 795, P3_SCALE = 1.5;

const Perso3: React.FC<{ f: number }> = ({ f }) => {
  const t = f / 30;
  // transfert d'appui : periode ~7.4 s, amplitude minuscule
  const appui = Math.sin(t * (2 * Math.PI / 7.4));
  // respiration : periode ~4.6 s, amplitude sub-pixel a cette echelle
  const resp = Math.sin(t * (2 * Math.PI / 4.6) + PHI);

  const torsoDeg = -2 + 0.9 * appui;
  const hipY = HIP_Y_STANDING + 0.35 * resp; // il "respire" de 0.35 unite = 0.5px a l'ecran
  const pose: Pose = {
    hipY,
    torsoDeg,
    leg1Deg: 7 + 1.6 * appui,
    leg2Deg: -7 + 1.4 * appui,
    hand1: [15, -36 + 0.4 * resp], // la main reste sur le baton
    arm2Deg: -16 + 1.2 * appui,
  };

  return (
    <Perso
      x={P3_X} y={P3_Y} scale={P3_SCALE} flip phase={0} color={CARN.brunChaud}
      p={{ bobAmp: 0 }} pose={pose}
      buste={(bp) => <Tunique bp={bp} fill={VERT} stroke={VERT_S} />}
      coiffe={(bp) => <ChapeauPaille bp={bp} />}
      objet={(main) => (
        // le baton est PLANTE : son pied est au sol (y=0 local), sa tete est sous la main.
        <line x1={r2(main.x + 1)} y1={r2(main.y - 28)} x2={r2(main.x + 1)} y2={0}
          stroke="#a08050" strokeWidth={3.4} strokeLinecap="round" />
      )}
    />
  );
};

// ============================================================================================
// LA CAMERA — PARALLAXE REELLE ENTRE LES 3 PLANS
// ============================================================================================
// Une translation lente vers la gauche (la camera derive vers la droite du monde). Les 3 plans
// se deplacent a des VITESSES DIFFERENTES : c'est ca, la parallaxe. Le fond bouge le moins.
// ⛔ Amplitudes faibles : au-dela, le decor "glisse" et se lit comme un defaut, pas comme une
//    camera (regle projet : mouvement = intention, jamais glissement decoratif).
const CAM_FOND = 14;       // px sur 10 s
const CAM_MOYEN = 38;
const CAM_AVANT = 74;
// petit zoom d'accompagnement (tres leger) pour que la derive ne soit pas un simple slide
const ZOOM_AVANT = 0.012;

export const PlageFableAnimee16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // progression normalisee 0->1, ease-in-out doux (la camera demarre et finit posee)
  const u = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const ease = u * u * (3 - 2 * u); // smoothstep : pas de a-coup au demarrage ni a l'arret

  const dxFond = -CAM_FOND * ease;
  const dxMoyen = -CAM_MOYEN * ease;
  const dxAvant = -CAM_AVANT * ease;
  const zAvant = 1 + ZOOM_AVANT * ease;

  return (
    <AbsoluteFill style={{ backgroundColor: "#2b2a55" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {/* ⭐ PARALLAXE : 3 vitesses distinctes. On sur-dimensionne legerement chaque plan pour
            qu'aucun bord ne rentre dans le cadre pendant la derive. */}
        <g transform={`translate(${r2(dxFond)} 0) scale(1.02) translate(-19 -11)`}>
          <Fond f={frame} />
        </g>
        <g transform={`translate(${r2(dxMoyen)} 0) scale(1.03) translate(-29 -16)`}>
          <PlanMoyen f={frame} />
        </g>
        {/* ⛔⛔ NE JAMAIS ARRONDIR UN FACTEUR D'ECHELLE (bug trouve par MESURE, 2026-08-18).
            `r2(zAvant)` quantifiait le zoom a 0.01 -> multiplie par le bras de levier (~790px
            entre le pivot et le bord droit), chaque marche d'arrondi deplacait le bord de la
            pirogue d'un coup de 7.53 px EN UNE FRAME (mesure). C'est CE saut qu'Aziz voyait, et
            il n'avait rien a voir avec le pecheur : un aplat immobile de l'avant-plan sautait
            2 a 4x par seconde. Sans arrondi : 0.33 px/frame.
            ⭐ REGLE : arrondir une TRANSLATION est sans danger (1 px max) ; arrondir une ECHELLE
            (ou une rotation) est amplifie par la distance au pivot. */}
        <g transform={`translate(${r2(dxAvant)} 0) translate(960 1080) scale(${zAvant}) translate(-960 -1080)`}>
          <AvantPlan f={frame} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default PlageFableAnimee16x9;

// ============================================================================================
// CONTROLES DE COHERENCE (executes a l'import en dev — cout nul, zero effet de bord).
// Ils encodent les regles dures du socle pour qu'une derive future se voie tout de suite.
// ============================================================================================
if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
  // 1. VERROU PAS/DISTANCE : la distance parcourue DOIT valoir pas x PAS_L x scale.
  const dTotal = walkDistance(P1_PAS_TOTAL, P1_SWING, P1_SCALE);
  const attendu = P1_PAS_TOTAL * 2 * LEG_LENGTH * Math.sin(rad(P1_SWING)) * P1_SCALE;
  if (Math.abs(dTotal - attendu) > 1e-9) {
    console.error("[PlageFable] VERROU PAS/DISTANCE casse", dTotal, attendu);
  }
  // 1bis. OURLET : un vetement qui descend trop bas masque le ciseau des jambes (habillage.ts §4).
  // Seuil de la doctrine : ~hy+6. On tolere 9 ici (cf. commentaire de PagneTeal), jamais 17.
  if (PAGNE_OURLET > 10) {
    console.error(`[PlageFable] pagne trop long (${PAGNE_OURLET}) : il masque la marche`);
  }
  // 2. BUTEE IK : aucune cible de main ne doit depasser ~97% de la portee (viser ~89%).
  const PORTEE = 15.5 + 15.0;
  for (let f = 0; f < P2_CYCLE; f++) {
    const { pose } = perso2Pose(f);
    const bp = bodyPoints(0, { bobAmp: 0 }, pose.torsoDeg);
    const dHip = (pose.hipY as number) - bp.hy;
    const sx = bp.sx, sy = bp.sy + dHip;
    for (const h of [pose.hand1, pose.hand2] as [number, number][]) {
      const d = Math.hypot(h[0] - sx, h[1] - sy);
      if (d > PORTEE * 0.93) {
        console.error(`[PlageFable] perso-2 f=${f} main en BUTEE IK : ${d.toFixed(2)} / ${PORTEE}`);
      }
    }
  }
}
