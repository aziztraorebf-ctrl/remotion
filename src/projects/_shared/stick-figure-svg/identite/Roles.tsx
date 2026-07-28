// SOCLE IDENTITE — ROLES + OBJETS MANIPULABLES
//
// Fusion de deux propositions issues d'un panel de 4 modeles (decision Aziz, 2026-07-26/27) :
//   BASE  — Fable 5 (scratchpad/panel-svg/fable-silhouettes.svg.txt) : vetements/coiffes/objets,
//           qualite de dessin et couleurs "remarquable, niveau tres professionnel".
//   GREFFE— Kimi K3 (scratchpad/panel-svg/kimi.txt) : la RELATION corps-objet — les personnages
//           TIENNENT VRAIMENT leur objet en main (bras qui descend et attrape, pas un objet pose
//           a cote). Repris ici : la geometrie du bras qui rejoint l'objet (hauteur/angle de la
//           main tenant pioche/panier/registre/houe), traduite en pose.hand1 du socle <Figure>.
//
// ⛔ Le squelette n'est PAS recopie ici : tout vient de StickFigure.tsx (Figure/Pose/Membre/
// walkDistance/solveArm/constantes). Ce fichier n'AJOUTE que des overlays positionnes par la
// geometrie du corps (meme technique que IdentiteV2_16x9.tsx :: bodyPoints/MotifOverlay).
//
// ⛔ REGLES D'IDENTITE (gravees, brief Aziz) : aucun visage, profil uniquement, remplissages
// plats sans degrade/filtre/ombre, un vetement n'est jamais dans la famille de teinte de la
// carnation qui le porte, un objet tenu PEND au bout de la main (anse/poignee en haut, masse en
// bas), jamais colle a la hanche. NO EMOJIS. Accents francais dans les strings affichees.
import React from "react";
import {
  Figure,
  Pose,
  rad,
  TORSO_LENGTH,
  HIP_Y_STANDING,
  WALK_DEFAULT,
  ARM_LENGTH_DEFAULT,
  type WalkParams,
} from "../StickFigure";

// ============================================================================================
// CARNATIONS — 5 teintes acquises (registre CFA), SANS lisere (retrait valide par Aziz).
// ============================================================================================
export const CARNATIONS = [
  { nom: "ambre clair", couleur: "#e8b98a" },
  { nom: "terre cuivrée", couleur: "#c98a55" },
  { nom: "brun chaud", couleur: "#9c6539" },
  { nom: "brun profond", couleur: "#6b4126" },
  { nom: "ébène (éclairci)", couleur: "#4a2e1c" },
] as const;

// ============================================================================================
// GEOMETRIE PARTAGEE — meme formule que Figure (StickFigure.tsx), recalculee ici a partir des
// CONSTANTES IMPORTEES pour poser les overlays exactement sur le corps que <Figure> dessine,
// frame pour frame (identique au motif bodyPoints() de IdentiteV2_16x9.tsx).
// ============================================================================================
export type BodyPoints = {
  hx: number; hy: number;      // hanche
  sx: number; sy: number;      // epaule (racine du buste, cote haut)
  headCx: number; headCy: number;
  torso: number;                // angle du buste (deg), lean + voute cumules par l'appelant
};

export const bodyPoints = (phase: number, p?: Partial<WalkParams>, torsoOverride?: number): BodyPoints => {
  const P = { ...WALK_DEFAULT, ...p };
  const a = phase * Math.PI * 2;
  const bob = Math.abs(Math.cos(a)) * P.bobAmp;
  const hx = 0;
  const hy = HIP_Y_STANDING - bob + P.hipDrop;
  const torso = torsoOverride !== undefined ? torsoOverride : P.lean;
  const sx = hx + Math.sin(rad(torso)) * TORSO_LENGTH;
  const sy = hy - Math.cos(rad(torso)) * TORSO_LENGTH;
  const headLen = 12;
  const headCx = sx + Math.sin(rad(torso)) * headLen + 3 * Math.cos(rad(torso));
  const headCy = sy - Math.cos(rad(torso)) * headLen + 3 * Math.sin(rad(torso));
  return { hx, hy, sx, sy, headCx, headCy, torso };
};

// ============================================================================================
// TRANSPORT FIDELE DE FABLE 5 — la source de verite (fable-silhouettes.svg.txt) dessine chaque
// tenue dans le MEME repere local que le socle : hanche (0,-26), epaule (1,-58)~(0,-58), tete
// r=9 centre (3,-66) — c'est le squelette de reference du panel Fable, quasi identique (au signe
// pres de l'axe x du buste) a celui de <Figure> (hanche (0,-26), TORSO_LENGTH=32, HEAD_RADIUS=9).
// busteXf() transporte un point ecrit dans le repere FABLE NON TOURNE (origine hanche, axes
// figes) vers le repere REEL du corps anime (rotation torso + bob + lean deja capitalises dans
// bp.hx/hy/sx/sy) : meme rotation que vetementBuste, mais point a point plutot que quadrilatere
// fige, pour recopier des PATHS COURBES (Q, arcs) sans les deformer en quadrilatere.
// ============================================================================================
const busteXf = (bp: BodyPoints) => {
  const { hx, hy, sx, sy } = bp;
  const dx = sx - hx, dy = sy - hy; // vecteur hanche->epaule, deja a TORSO_LENGTH
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len, uy = dy / len;       // axe longitudinal (vers l'epaule), unite = 1px
  const nx = -uy, ny = ux;                   // normale (vers l'avant du corps, +x local Fable)
  // fx,fy = coordonnees FABLE ABSOLUES (memes coordonnees que le fichier .svg.txt : hanche a
  // (0,-26), epaule a (1,-58)~(0,-58)). t=0 a la hanche, t=1 a l'epaule.
  return (fx: number, fy: number) => {
    const t = (fy - hy) / (sy - hy || -1);
    return { x: hx + ux * len * t + nx * fx, y: hy + uy * len * t + ny * fx };
  };
};

// CORRECTION D'ECHELLE TETE-BUSTE — Fable dessine son squelette de reference avec la tete a
// SEULEMENT 8 unites de l'epaule (epaule (1,-58) -> tete (3,-66)), alors que le socle anime
// (bodyPoints/Figure, cf. StickFigure.tsx) place la tete a 12 unites (headLen=12) : le squelette
// du socle a le cou 4 unites plus LONG que celui dessine par Fable. Consequence mesuree par
// calcul (pas au jugement) : un collier copie aux coordonnees Fable EXACTES (ex. haut de
// combinaison a y=-56.5) laisse un ecart visible de ~4.5-5 unites entre le bas du cercle tete et
// le haut du vetement -> tete qui "flotte". Le socle ne se modifie pas (verrou marche validee) ;
// on etend donc le bord SUPERIEUR (col) des vetements-buste de ce delta constant, mesure une
// fois pour les 4 roles (meme squelette) : NECK_EXTEND unites vers le haut (y plus negatif),
// pour que le col touche reellement le bas du cercle tete du socle. Le bas (ourlet) n'est PAS
// touche : seule la geometrie du col est corrigee, la forme/largeur Fable est preservee.
const NECK_EXTEND = 4.8;

// path Fable en paires (fx,fy) -> chaine "M x y L x y ..." transportee (segments droits uniquement,
// suffisant pour les quadrilateres de buste/hanche de Fable).
const pathBuste = (bp: BodyPoints, pts: [number, number][]): string => {
  const T = busteXf(bp);
  return pts.map((p, i) => {
    const q = T(p[0], p[1]);
    return `${i === 0 ? "M" : "L"} ${q.x} ${q.y}`;
  }).join(" ") + " Z";
};

// ============================================================================================
// TRANSPORT TETE — coiffes (casque/foulard/chapeau). Fable les dessine autour du centre tete fixe
// (3,-66) r=9, avec le MEME repere d'axes que le buste (aucune rotation propre : de profil, la
// tete suit juste le lean du buste, cf. formule headCx/headCy de bodyPoints/Figure). meme rotation
// que busteXf (torso), mais origine/echelle ancrees a la tete plutot qu'a la hanche — permet de
// recopier des courbes (Q) en gardant les POIGNEES de controle dans le meme repere que les points.
// ============================================================================================
const headXf = (bp: BodyPoints) => {
  const { hx, hy, sx, sy, headCx, headCy } = bp;
  const dx = sx - hx, dy = sy - hy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len, uy = dy / len;
  const nx = -uy, ny = ux;
  // Fable ancre au centre tete (3,-66) : fx,fy relatifs a CE point (pas absolus comme busteXf).
  // NB signe : uy est negatif (axe "vers l'epaule" pointe vers le haut), or fy positif doit
  // deplacer VERS LE BAS (convention SVG standard de Fable) -> on SOUSTRAIT uy*fy (verifie par
  // calcul : a lean=0, foulard fable(-7.5,-63.5) rel.(-10.5,2.5) doit redonner (-7.5,-63.5)).
  return (fx: number, fy: number) => ({ x: headCx + ux * fy + nx * fx, y: headCy - uy * fy + ny * fx });
};

// Construit un "d" a partir d'une liste de commandes deja en coordonnees Fable RELATIVES tete
// (fx,fy), chaque commande donnant son type ('M'|'L'|'Q') + ses points de controle. Pour 'Q', le
// premier point est la poignee, le second le point d'arrivee (meme ordre que le SVG source).
type Cmd = { t: "M" | "L"; p: [number, number] } | { t: "Q"; c: [number, number]; p: [number, number] };
const pathHead = (bp: BodyPoints, cmds: Cmd[], close = true): string => {
  const T = headXf(bp);
  const out: string[] = [];
  for (const cmd of cmds) {
    if (cmd.t === "Q") {
      const c = T(cmd.c[0], cmd.c[1]);
      const p = T(cmd.p[0], cmd.p[1]);
      out.push(`Q ${c.x} ${c.y} ${p.x} ${p.y}`);
    } else {
      const p = T(cmd.p[0], cmd.p[1]);
      out.push(`${cmd.t} ${p.x} ${p.y}`);
    }
  }
  return out.join(" ") + (close ? " Z" : "");
};

// ============================================================================================
// A. MINEUR — combinaison bleu ouvrier + bande jaune haute-visibilite (buste), casque a lampe
// (tete). Base Fable (couleurs/casque), greffe Kimi pour la pioche tenue en main.
// ============================================================================================
const BLEU_OUVRIER = "#3d6fb0";
const BLEU_OUVRIER_SOMBRE = "#2a4f80";
const JAUNE_SECU = "#f2c53d";
const JAUNE_SECU_SOMBRE = "#c79a1e";

export const RoleMineur: React.FC<{ bp: BodyPoints }> = ({ bp }) => {
  const T = headXf(bp);
  const lampe = T(15, -0.5); // point d'ancrage lampe, Fable ~ (18,-66) rel. tete (3,-66) -> fx=15,fy=0
  return (
    <>
      {/* COMBINAISON — quadrilatere EXACT de Fable (col->epaule->hanche->hanche->col), transporte
          via busteXf (attache buste : suit lean+bob). Coords Fable : M -5,-56.5 L 7.5,-56.5
          L 8.2,-42 L 7.2,-27 L -6.2,-27 L -5.6,-42 Z — col etire de NECK_EXTEND (cf. note) pour
          toucher la tete reelle du socle. */}
      <path
        d={pathBuste(bp, [
          [-5, -56.5 - NECK_EXTEND], [7.5, -56.5 - NECK_EXTEND],
          [8.2, -42], [7.2, -27], [-6.2, -27], [-5.6, -42],
        ])}
        fill={BLEU_OUVRIER} stroke={BLEU_OUVRIER_SOMBRE} strokeWidth={1.2} strokeLinejoin="round"
      />
      {/* bande haute-visibilite — Fable : M -5.7,-45.5 L 7.9,-45.5 L 7.8,-41.5 L -5.9,-41.5 Z */}
      <path
        d={pathBuste(bp, [[-5.7, -45.5], [7.9, -45.5], [7.8, -41.5], [-5.9, -41.5]])}
        fill={JAUNE_SECU}
      />
      {/* CASQUE — coque EXACTE Fable (rel. tete (3,-66)) : M -8,-67.5 Q -7.5,-79 3,-79.5
          Q 13.5,-79 14,-67.5 Z -> fx,fy = point-headCenter */}
      <path
        d={pathHead(bp, [
          { t: "M", p: [-11, -1.5] },
          { t: "Q", c: [-10.5, -13], p: [0, -13.5] },
          { t: "Q", c: [10.5, -13], p: [11, -1.5] },
        ])}
        fill={JAUNE_SECU} stroke={JAUNE_SECU_SOMBRE} strokeWidth={1.2} strokeLinejoin="round"
      />
      {/* arete sommitale (signature casque de chantier) — Fable : M -1,-79.4 Q 3,-81.4 7,-79.4
          L 6,-78 Q 3,-79.4 0,-78 Z */}
      <path
        d={pathHead(bp, [
          { t: "M", p: [-4, -13.4] },
          { t: "Q", c: [0, -15.4], p: [4, -13.4] },
          { t: "L", p: [3, -12] },
          { t: "Q", c: [0, -13.4], p: [-3, -12] },
        ])}
        fill={JAUNE_SECU_SOMBRE}
      />
      {/* visiere vers l'avant — Fable : M 12.5,-68 L 18,-66.6 Q 18.7,-65.2 17,-64.9 L 12.5,-65.6 Z */}
      <path
        d={pathHead(bp, [
          { t: "M", p: [9.5, -2] },
          { t: "L", p: [15, -0.6] },
          { t: "Q", c: [15.7, 0.8], p: [14, 1.1] },
          { t: "L", p: [9.5, 0.4] },
        ])}
        fill={JAUNE_SECU} stroke={JAUNE_SECU_SOMBRE} strokeWidth={1}
      />
      {/* lampe frontale sur la ligne de visiere (correction deja validee) */}
      <circle cx={lampe.x} cy={lampe.y} r={1.9} fill="#f5ead6" />
    </>
  );
};

// Objet pioche — geometrie et point d'accroche MAIN = (0,0) repris EXACTEMENT de Kimi K3 (son
// dessin ou la main recouvre reellement le manche, cf. bras avant M2,-52 L13,-41 L22.1,-29.5),
// recentre pour que l'accroche tombe en (0,0). Couleurs Fable (frene pale + acier, jamais brun).
export const ObjetPioche: React.FC<{ main: { x: number; y: number }; angleDeg?: number }> = ({ main, angleDeg = 0 }) => (
  <g transform={`translate(${main.x} ${main.y}) rotate(${angleDeg})`}>
    <path d="M 3.9,15.5 L -5.1,-20.5" fill="none" stroke="#a08050" strokeWidth={3.2} strokeLinecap="round" />
    <path d="M -14.6,-16 Q -5.1,-26.5 4.4,-17" fill="none" stroke="#c8ccd2" strokeWidth={3.6} strokeLinecap="round" />
  </g>
);

// ============================================================================================
// B. COMMERCANTE — camisole fuchsia (buste) + pagne teal a lisiere or (hanche), foulard noue
// (tete). Base Fable. Objet : panier, anse en haut (Kimi : port a bout de bras, anse dans la main).
// ============================================================================================
const TEAL = "#2f9e9a";
const TEAL_SOMBRE = "#1f6f6c";
const FUCHSIA = "#c2517f";
const FUCHSIA_SOMBRE = "#8e3563";

export const RoleCommercante: React.FC<{ bp: BodyPoints }> = ({ bp }) => {
  const { hx, hy } = bp;
  return (
    <>
      {/* PAGNE — attache: hanche (repris de Fable, quadrilatere evase hx,hy-relatif : la taille
          nouee au-dessus de la hanche, l'ourlet s'evase au mollet). Pas de rotation avec le buste
          (une jupe suit le BASSIN, pas le lean du torse) — ancre directement sur hx,hy. */}
      <path d={`M ${hx - 6} ${hy - 7} L ${hx + 8} ${hy - 7} L ${hx + 11.5} ${hy + 17} L ${hx - 9.5} ${hy + 17} Z`}
        fill={TEAL} stroke={TEAL_SOMBRE} strokeWidth={1.2} strokeLinejoin="round" />
      <path d={`M ${hx - 9} ${hy + 13} L ${hx + 11} ${hy + 13} L ${hx + 11.5} ${hy + 17} L ${hx - 9.5} ${hy + 17} Z`}
        fill={JAUNE_SECU} />
      {/* CAMISOLE — quadrilatere EXACT Fable, attache: buste. Coords Fable :
          M -5,-56 L 7.5,-56 L 8.5,-31.5 L -6.5,-31.5 Z — col etire de NECK_EXTEND. */}
      <path
        d={pathBuste(bp, [
          [-5, -56 - NECK_EXTEND], [7.5, -56 - NECK_EXTEND], [8.5, -31.5], [-6.5, -31.5],
        ])}
        fill={FUCHSIA} stroke={FUCHSIA_SOMBRE} strokeWidth={1.2} strokeLinejoin="round"
      />
      {/* FOULARD NOUE — attache: tete, transport EXACT du moussor Fable (dome enveloppant a 2
          courbes Q + noeud releve a l'avant en 2 morceaux). Fable (rel. tete (3,-66)) :
          dome  M -7.5,-63.5 Q -7,-77.5 3,-78 Q 13,-77.5 13.5,-63.5 Q 8,-67 3,-67.3 Q -2,-67 -7.5,-63.5 Z
          noeud1 M 10,-75 Q 12,-82 16.5,-79.5 Q 14.5,-75.5 10,-75 Z
          noeud2 M 12.5,-73.5 Q 17,-78.5 19,-74.5 Q 16,-72 12.5,-73.5 Z */}
      <path
        d={pathHead(bp, [
          { t: "M", p: [-10.5, 2.5] },
          { t: "Q", c: [-10, -11.5], p: [0, -12] },
          { t: "Q", c: [10, -11.5], p: [10.5, 2.5] },
          { t: "Q", c: [5, -1], p: [0, -1.3] },
          { t: "Q", c: [-5, -1], p: [-10.5, 2.5] },
        ])}
        fill={TEAL} stroke={TEAL_SOMBRE} strokeWidth={1.2} strokeLinejoin="round"
      />
      <path
        d={pathHead(bp, [
          { t: "M", p: [7, -9] },
          { t: "Q", c: [9, -16], p: [13.5, -13.5] },
          { t: "Q", c: [11.5, -9.5], p: [7, -9] },
        ])}
        fill={TEAL} stroke={TEAL_SOMBRE} strokeWidth={1}
      />
      <path
        d={pathHead(bp, [
          { t: "M", p: [9.5, -7.5] },
          { t: "Q", c: [14, -12.5], p: [16, -8.5] },
          { t: "Q", c: [13, -6], p: [9.5, -7.5] },
        ])}
        fill={TEAL} stroke={TEAL_SOMBRE} strokeWidth={1}
      />
    </>
  );
};

// Panier — geometrie et accroche (sommet de l'anse) repris EXACTEMENT de Kimi K3 (bras avant
// M2,-52 L12.5,-41.5 L22.6,-34.6 : la main recouvre le sommet de l'anse), recentre en (0,0).
export const ObjetPanier: React.FC<{ main: { x: number; y: number }; angleDeg?: number }> = ({ main, angleDeg = 0 }) => (
  <g transform={`translate(${main.x} ${main.y}) rotate(${angleDeg})`}>
    <path d="M -7.1,8.6 L 6.9,8.6 L 4.2,27.6 L -4.4,27.6 Z" fill="#b07a3f" strokeLinejoin="round" />
    <path d="M -6.6,8.6 Q 0,-8.6 6.4,8.6" fill="none" stroke="#8a5a2e" strokeWidth={2.6} strokeLinecap="round" />
    <path d="M -7.4,8.6 L 7.2,8.6" fill="none" stroke="#8a5a2e" strokeWidth={3} strokeLinecap="round" />
  </g>
);

// ============================================================================================
// C. FONCTIONNAIRE / LE COSTUME — veste ardoise + chemise + cravate rouge (buste), tete nue.
// Base Fable. Objet : registre/dossier tenu par le bord superieur (Kimi : tenu par le haut, pend).
// ============================================================================================
const ARDOISE = "#6f84ad";
const ARDOISE_SOMBRE = "#4a5d85";
const BLANC_CHEMISE = "#eef2f7";
const ROUGE_CRAVATE = "#d5493a";

export const RoleFonctionnaire: React.FC<{ bp: BodyPoints }> = ({ bp }) => {
  return (
    <>
      {/* VESTE — quadrilatere EXACT Fable, ourlet SOUS la hanche (y=-22.5, cote de la hanche
          -26 : descend en dessous). Coords Fable : M -5.5,-56 L 7.5,-56 L 8.5,-22.5 L -6.5,-22.5 Z
          — col etire de NECK_EXTEND. */}
      <path
        d={pathBuste(bp, [
          [-5.5, -56 - NECK_EXTEND], [7.5, -56 - NECK_EXTEND], [8.5, -22.5], [-6.5, -22.5],
        ])}
        fill={ARDOISE} stroke={ARDOISE_SOMBRE} strokeWidth={1.2} strokeLinejoin="round"
      />
      {/* echancrure chemise — Fable : M 4.6,-56 L 7.5,-56 L 8.5,-33 L 5.6,-33 Z — col etire. */}
      <path
        d={pathBuste(bp, [
          [4.6, -56 - NECK_EXTEND], [7.5, -56 - NECK_EXTEND], [8.5, -33], [5.6, -33],
        ])}
        fill={BLANC_CHEMISE}
      />
      {/* cravate rouge, posee sur la chemise — Fable : M 5.8,-55 L 7.4,-55 L 8.1,-36 L 6.4,-36 Z
          — noeud remonte au col etire. */}
      <path
        d={pathBuste(bp, [
          [5.8, -55 - NECK_EXTEND], [7.4, -55 - NECK_EXTEND], [8.1, -36], [6.4, -36],
        ])}
        fill={ROUGE_CRAVATE}
      />
      {/* pointe de col — Fable : M 3.8,-56.5 L 7.8,-56.5 L 5.8,-52.5 Z — remontee avec le col. */}
      <path
        d={pathBuste(bp, [
          [3.8, -56.5 - NECK_EXTEND], [7.8, -56.5 - NECK_EXTEND], [5.8, -52.5 - NECK_EXTEND * 0.4],
        ])}
        fill={BLANC_CHEMISE}
      />
      {/* ligne de revers — Fable : M 4.4,-56 L 7.6,-44 (segment ouvert, pas de fermeture), point
          haut remonte avec le col. */}
      <path
        d={pathBuste(bp, [[4.4, -56 - NECK_EXTEND], [7.6, -44]]).replace(/ Z$/, "")}
        fill="none" stroke={ARDOISE_SOMBRE} strokeWidth={1.2} strokeLinecap="round"
      />
      {/* pochette — Fable : rect x=0.5 y=-49.5 width=2.8 height=2 -> 4 coins transportes */}
      <path
        d={pathBuste(bp, [[0.5, -49.5], [3.3, -49.5], [3.3, -47.5], [0.5, -47.5]])}
        fill={BLANC_CHEMISE}
      />
    </>
  );
};

// Registre — geometrie et accroche (bord superieur libre) repris EXACTEMENT de Kimi K3 (bras
// avant M2,-52 L11.5,-43 L21.5,-32.8 : la main recouvre le bord du dossier), recentre en (0,0).
export const ObjetRegistre: React.FC<{ main: { x: number; y: number }; angleDeg?: number }> = ({ main, angleDeg = 0 }) => (
  <g transform={`translate(${main.x} ${main.y}) rotate(${angleDeg})`}>
    <rect x={-6} y={-1.4} width={10.5} height={1.5} fill="#f2efe6" />
    <path d="M -8,-2 L -3.5,-2 L -3.5,0 L 5.5,0 L 5.5,16 L -8,16 Z" fill="#d9c9a8" strokeLinejoin="round" />
  </g>
);

// ============================================================================================
// D. AGRICULTEUR — tunique verte (buste), chapeau de paille large bord + ruban (tete). Base
// Fable. Objet : houe, manche long tenu a mi-hauteur (greffe Kimi : lame vers l'avant-bas).
// ============================================================================================
const VERT_TUNIQUE = "#3f9e59";
const VERT_TUNIQUE_SOMBRE = "#2b7040";
const PAILLE = "#e6c65a";
const PAILLE_SOMBRE = "#b89a2e";
const RUBAN_VERT = "#2f6e4f";

export const RoleAgriculteur: React.FC<{ bp: BodyPoints }> = ({ bp }) => {
  const T = headXf(bp);
  const bordCentre = T(0, -5); // Fable ellipse cx=3,cy=-71 rel. tete(3,-66) -> (0,-5)
  return (
    <>
      {/* TUNIQUE — quadrilatere EXACT Fable. Coords Fable : M -5,-56 L 7.5,-56 L 8,-28 L -6,-28 Z
          — col etire de NECK_EXTEND. */}
      <path
        d={pathBuste(bp, [
          [-5, -56 - NECK_EXTEND], [7.5, -56 - NECK_EXTEND], [8, -28], [-6, -28],
        ])}
        fill={VERT_TUNIQUE} stroke={VERT_TUNIQUE_SOMBRE} strokeWidth={1.2} strokeLinejoin="round"
      />
      {/* CHAPEAU DE PAILLE — large bord EXACT Fable (rx=16, deborde franchement de la tete r=9).
          Ellipse Fable : cx=3 cy=-71 rx=16 ry=2.4 -> rel. tete (0,-5). */}
      <ellipse cx={bordCentre.x} cy={bordCentre.y} rx={16} ry={2.4} fill={PAILLE} stroke={PAILLE_SOMBRE} strokeWidth={1.2} />
      {/* dome — Fable : M -5,-73 Q -4,-81 3,-81.5 Q 10,-81 11,-73 Z -> rel. tete (3,-66) */}
      <path
        d={pathHead(bp, [
          { t: "M", p: [-8, -7] },
          { t: "Q", c: [-7, -15], p: [0, -15.5] },
          { t: "Q", c: [7, -15], p: [8, -7] },
        ])}
        fill={PAILLE} stroke={PAILLE_SOMBRE} strokeWidth={1.2} strokeLinejoin="round"
      />
      {/* ruban vert fonce — isole la paille de la carnation. Fable :
          M -4.8,-75.5 L 10.8,-75.5 L 11,-73 L -5,-73 Z -> rel. tete (3,-66) */}
      <path
        d={pathHead(bp, [
          { t: "M", p: [-7.8, -9.5] },
          { t: "L", p: [7.8, -9.5] },
          { t: "L", p: [8, -7] },
          { t: "L", p: [-8, -7] },
        ])}
        fill={RUBAN_VERT}
      />
    </>
  );
};

// Houe — geometrie et accroche repris EXACTEMENT de Kimi K3 (bras avant M2,-52 L12.5,-42
// L21.4,-32.5 : la main recouvre le manche a mi-hauteur de port), recentre en (0,0).
export const ObjetHoue: React.FC<{ main: { x: number; y: number }; angleDeg?: number }> = ({ main, angleDeg = 0 }) => (
  <g transform={`translate(${main.x} ${main.y}) rotate(${angleDeg})`}>
    <path d="M -6.4,25.5 L 5.6,-22.5" fill="none" stroke="#a08050" strokeWidth={3.2} strokeLinecap="round" />
    <path d="M -7.6,24 L -5.2,27 L 3.1,29.3 L 1.8,25.5 Z" fill="#c8ccd2" strokeLinejoin="round" />
  </g>
);

// ============================================================================================
// OBJETS SUPPLEMENTAIRES (non attaches a un role fixe — brief demande sac/caisse en plus des 4
// objets tenus). Point d'accroche MAIN = (0,0), masse pend sous ce point (convention Fable/Kimi).
// ============================================================================================
export const ObjetSac: React.FC<{ main: { x: number; y: number }; angleDeg?: number }> = ({ main, angleDeg = 0 }) => (
  <g transform={`translate(${main.x} ${main.y}) rotate(${angleDeg})`}>
    <path d="M -2,1 Q 0,-1.5 2,1 L 2.8,3.4 L -2.8,3.4 Z" fill="#e4dfd0" stroke="#b9b29c" strokeWidth={1} />
    <path d="M -3,3.2 L 3,3.2 L 2.7,5.2 L -2.7,5.2 Z" fill="#30425f" />
    <path d="M -2.8,5 Q -9,7 -9.5,13 Q -9.5,19 -3,20 L 3,20 Q 9.5,19 9.5,13 Q 9,7 2.8,5 Z"
      fill="#e4dfd0" stroke="#b9b29c" strokeWidth={1.2} strokeLinejoin="round" />
    <path d="M -4,12 L 0,9.5 L 4,12 L 0,14.5 Z" fill="#d5493a" />
  </g>
);

export const ObjetCaisse: React.FC<{ main: { x: number; y: number }; angleDeg?: number }> = ({ main, angleDeg = 0 }) => (
  <g transform={`translate(${main.x} ${main.y}) rotate(${angleDeg})`}>
    <rect x={-11} y={0} width={22} height={16} fill="#3d6fb0" stroke="#2a4f80" strokeWidth={1.2} />
    <path d="M -11,0 L 11,0 L 11,2.6 L -11,2.6 Z" fill="#2a4f80" />
    <rect x={-3.5} y={0.6} width={7} height={1.5} rx={0.7} fill="#10192e" />
    <path d="M -11,7 L 11,7" stroke="#2a4f80" strokeWidth={1.2} fill="none" />
    <path d="M -11,11.5 L 11,11.5" stroke="#2a4f80" strokeWidth={1.2} fill="none" />
    <rect x={4.5} y={4} width={4.2} height={3} fill="#eef2f7" />
  </g>
);

export const ObjetJerrican: React.FC<{ main: { x: number; y: number }; angleDeg?: number }> = ({ main, angleDeg = 0 }) => (
  <g transform={`translate(${main.x} ${main.y}) rotate(${angleDeg})`}>
    <path d="M -3.5,3 L -3.5,1 Q -3.5,-0.8 -2,-0.8 L 2,-0.8 Q 3.5,-0.8 3.5,1 L 3.5,3"
      fill="none" stroke="#c79a1e" strokeWidth={2.2} strokeLinecap="round" />
    <rect x={4.6} y={0.6} width={3} height={2.6} fill="#c79a1e" />
    <rect x={-8} y={3} width={16} height={17} rx={2} fill="#f2c53d" stroke="#c79a1e" strokeWidth={1.2} />
    <path d="M -5,7.5 L 5,15.5" stroke="#c79a1e" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    <path d="M 5,7.5 L -5,15.5" stroke="#c79a1e" strokeWidth={1.5} fill="none" strokeLinecap="round" />
  </g>
);

// ============================================================================================
// TABLE DE MAPPING — role -> composant tenue + objet + point d'accroche main PAR DEFAUT (repere
// local du personnage, bras au repos). Greffe Kimi : ces coordonnees sont la ou la main DOIT
// atterrir pour que l'objet lise "tenu", pas "pose a cote" — a passer en pose.hand1 de <Figure>.
// ============================================================================================
export type RoleId = "mineur" | "commercante" | "fonctionnaire" | "agriculteur";

// Coordonnees Kimi K3 (meme repere hanche=-26/epaule=-52 que le socle) : point ou la main du
// bras AVANT recouvre l'objet, lu directement sur ses paths "bras avant" (ex mineur :
// M2,-52 L13,-41 L22,-29.5 -> la main est a (22,-29.5)). Distance epaule->main ~27-30, coherente
// avec ARM_LENGTH_DEFAULT=28 du socle -> l'arm "rigide" de <Figure> (pose.hand1) rejoint la
// cible sans s'etirer ni se comprimer de facon visible.
export const ROLE_MAIN_REPOS: Record<RoleId, { x: number; y: number; angleDeg: number }> = {
  mineur: { x: 22, y: -29.5, angleDeg: -8 },
  commercante: { x: 22.6, y: -34.6, angleDeg: 4 },
  fonctionnaire: { x: 21.5, y: -32.8, angleDeg: -3 },
  agriculteur: { x: 21.4, y: -32.5, angleDeg: -10 },
};

export const RoleTenue: React.FC<{ role: RoleId; bp: BodyPoints }> = ({ role, bp }) => {
  switch (role) {
    case "mineur": return <RoleMineur bp={bp} />;
    case "commercante": return <RoleCommercante bp={bp} />;
    case "fonctionnaire": return <RoleFonctionnaire bp={bp} />;
    case "agriculteur": return <RoleAgriculteur bp={bp} />;
  }
};

export const RoleObjet: React.FC<{ role: RoleId; main: { x: number; y: number }; angleDeg?: number }> = ({ role, main, angleDeg = 0 }) => {
  switch (role) {
    case "mineur": return <ObjetPioche main={main} angleDeg={angleDeg} />;
    case "commercante": return <ObjetPanier main={main} angleDeg={angleDeg} />;
    case "fonctionnaire": return <ObjetRegistre main={main} angleDeg={angleDeg} />;
    case "agriculteur": return <ObjetHoue main={main} angleDeg={angleDeg} />;
  }
};

export const ROLE_LABEL: Record<RoleId, string> = {
  mineur: "LE MINEUR",
  commercante: "LA COMMERÇANTE",
  fonctionnaire: "LE FONCTIONNAIRE",
  agriculteur: "L'AGRICULTEUR",
};

// ============================================================================================
// PERSONNAGE COMPLET — ORDRE ARRIERE -> AVANT CORRIGE (2026-07-27, defaut visuel constate par
// Aziz : "on voit le corps du stick figure A TRAVERS le vetement").
//
// L'ordre precedent (tenue -> objet -> Figure ENTIERE) plaçait TOUT le corps (buste, jambes,
// bras arriere ET avant, tete) PAR-DESSUS le vetement -> le vetement semblait derriere le
// personnage. Seul le bras AVANT doit passer devant le vetement (pour lire "tenir" un objet) —
// pas le buste ni les jambes.
//
// Nouvel ordre (arriere -> avant) :
//   1. Figure du socle SANS le bras avant (hideArm1, ajout additif au socle, cf. StickFigure.tsx)
//      -> dessine bras arriere + jambes + buste + tete, dans cet ordre (deja correct au socle).
//   2. TENUE (vetement) -> recouvre le buste/jambes/tete nus du socle.
//   3. OBJET tenu (si avecObjet) -> pose sous la main, avant que la main ne le recouvre.
//   4. BRAS AVANT redessine ICI, PAR-DESSUS tenue+objet -> passe devant, comme la vraie anatomie
//      (un bras qui tient un objet est DEVANT le torse habille). Meme geometrie EXACTE que le
//      socle (sx,sy = epaule via bodyPoints ; b1x,b1y = pose.hand1 si fourni, sinon la meme
//      formule d'angle de marche que Figure — cf. StickFigure.tsx lignes ~379-387).
// ============================================================================================
export const PersonnageRole: React.FC<{
  x: number; y: number; phase: number; scale: number;
  role: RoleId;
  couleur: string;
  frame?: number;
  p?: Partial<WalkParams>;
  pose?: Pose;
  avecObjet?: boolean; // defaut true (comportement production inchange) ; false = bras au repos
                        // normal de <Figure>, sans objet tenu (planche de demo tenue seule).
}> = ({ x, y, phase, scale, role, couleur, p, pose, avecObjet = true }) => {
  const P = { ...WALK_DEFAULT, ...p };
  const torsoOverride = pose?.torsoDeg !== undefined ? pose.torsoDeg : P.lean;
  const bp = bodyPoints(phase, p, torsoOverride);
  const repos = ROLE_MAIN_REPOS[role];
  const mergedPose: Pose = avecObjet ? { hand1: [repos.x, repos.y], ...pose } : { ...pose };

  // Bras avant : MEME formule que Figure (StickFigure.tsx) pour la main, afin que le bras
  // redessine ici tombe pixel pour pixel au meme endroit que celui que <Figure hideArm1> a omis.
  // sx,sy = epaule -> deja fourni par bodyPoints (bp), identique au calcul interne de Figure.
  const a = phase * Math.PI * 2;
  const armLen1 = mergedPose.arm1Len ?? ARM_LENGTH_DEFAULT;
  const manuel1 = mergedPose.arm1Deg !== undefined;
  const a1 = manuel1 ? (mergedPose.arm1Deg as number) + bp.torso : -Math.sin(a) * P.armSwing;
  const b1x = mergedPose.hand1 ? mergedPose.hand1[0] : bp.sx + Math.sin(rad(a1)) * armLen1;
  const b1y = mergedPose.hand1 ? mergedPose.hand1[1] : bp.sy + Math.cos(rad(a1)) * armLen1;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* 1. CORPS NU (socle), bras avant omis -> jambes/buste/tete dessines dans l'ordre du socle */}
      <Figure x={0} y={0} phase={phase} p={p} pose={mergedPose} color={couleur} scale={1} hideArm1 />
      {/* 2. TENUE — recouvre le corps nu (buste + tete/coiffe) */}
      <RoleTenue role={role} bp={bp} />
      {/* 3. OBJET tenu, sous la main -> le bras avant (etape 4) le recouvrira visuellement.
          Omis si avecObjet=false (simplification demo : juger la tenue seule). */}
      {avecObjet && <RoleObjet role={role} main={{ x: repos.x, y: repos.y }} angleDeg={repos.angleDeg} />}
      {/* 4. BRAS AVANT, PAR-DESSUS tenue+objet — meme geometrie que le socle (voir b1x/b1y ci-dessus) */}
      <line x1={bp.sx} y1={bp.sy} x2={b1x} y2={b1y} stroke={couleur} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

export default PersonnageRole;
