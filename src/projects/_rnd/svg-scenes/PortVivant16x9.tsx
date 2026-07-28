import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  PALETTE,
  COORDS,
  ECHELLE_PERSONNAGE,
  PLAN_CIEL,
  NUAGES,
  OISEAUX,
  PLAN_VILLE_LOINTAINE,
  PLAN_EAU,
  BAC_LOIN,
  VOILIER_LOIN,
  BOUEE_1,
  BOUEE_2,
  PIROGUE_LOIN,
  CHALUTIER,
  PONTON,
  PIROGUE_1,
  AMARRE_PIROGUE,
  QUAI_BORD,
  BITTE_1,
  BITTE_2,
  BITTE_3,
  AMARRE_CHALUTIER_AVANT,
  AMARRE_CHALUTIER_ARRIERE,
  PLAN_QUAI_SOL,
  HANGAR_A,
  PORTE_HANGAR_A,
  FENETRE_HANGAR_A_1,
  FENETRE_HANGAR_A_2,
  ENSEIGNE_HANGAR_A,
  LINGE,
  KIOSQUE,
  PALMIER_1,
  GRUE_2_MAT,
  GRUE_2_FLECHE,
  GRUE_2_CABLE,
  BRASERO,
  GRUE_1_MAT,
  GRUE_1_FLECHE,
  GRUE_1_CABLE,
  CONTENEUR,
  HANGAR_B,
  PORTE_HANGAR_B,
  FENETRE_HANGAR_B_1,
  LAMPADAIRE_1,
  LAMPADAIRE_2,
  VELO,
  PROPS_AVANT_GAUCHE,
  PROPS_AVANT_DROITE,
} from "./portDecorGroups";
import {
  Figure,
  walkDistance,
  walkPhaseFromSteps,
  LEG_LENGTH,
  TORSO_LENGTH,
  HEAD_RADIUS,
  HIP_Y_STANDING,
  ARM_LENGTH_DEFAULT,
  BRAS_LAG,
} from "../../_shared/stick-figure-svg/StickFigure";
// ⭐ LA BRIQUE D'HABILLAGE — geometrie partagee corps/vetement. Voir son en-tete pour les
// 4 regles d'occlusion et l'ordre de rendu obligatoire.
import { bodyPoints } from "../../_shared/stick-figure-svg/habillage";

// =============================================================================================
// LE PORT VIVANT — decor statique (Fable, fusionne) + animation maison.
//
// PARTAGE DES ROLES (teste et tranche le 2026-07-28) :
//   - le MODELE a dessine le decor (matiere statique, portDecorGroups.ts)
//   - NOUS animons : arc nuit->jour, parallaxe, grues, bateaux, personnages
//   - les PERSONNAGES viennent du socle stick figure valide (StickFigure.tsx), pas reinventes
//
// Frame-driven strict : useCurrentFrame + interpolate. Zero CSS transition, zero keyframes,
// zero setTimeout, zero SMIL.
// =============================================================================================

export const PORT_VIVANT_FRAMES = 720; // 24s @ 30fps

const W = 1920;
const H = 1080;
const DUR = PORT_VIVANT_FRAMES;

// ---------------------------------------------------------------------------------------------
// UTILITAIRES
// ---------------------------------------------------------------------------------------------

// Injection d'un groupe SVG statique dans un <g> qu'on peut animer (transform/opacity).
const Inject: React.FC<{
  html: string;
  transform?: string;
  opacity?: number;
}> = ({ html, transform, opacity = 1 }) => (
  <g transform={transform} opacity={opacity} dangerouslySetInnerHTML={{ __html: html }} />
);

// Melange 2 couleurs hex. t=0 -> a, t=1 -> b.
const mix = (a: string, b: string, t: number): string => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, t))));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

// ⭐ PERSPECTIVE : la taille DERIVE de la profondeur par UNE formule unique.
// Jamais un scale regle a l'oeil perso par perso (regle gravee : marchands geants au fond).
// h(y) = 180 + (y - 830) * 0.529, cale sur les 2 reperes du decor.
const hauteurAt = (yPieds: number): number =>
  ECHELLE_PERSONNAGE.fond.hauteurPx +
  (yPieds - ECHELLE_PERSONNAGE.fond.yPieds) * ECHELLE_PERSONNAGE.pente;

// Le squelette mesure LEG_LENGTH + TORSO_LENGTH + 2*HEAD_RADIUS en unites locales.
const HAUTEUR_SQUELETTE = LEG_LENGTH + TORSO_LENGTH + HEAD_RADIUS * 2;

// ⚠️ CORRECTION VUE AU RENDU : l'echelle exportee par le decor (270px a l'avant) donnait des
// personnages hauts comme une porte de hangar. Mesure sur le rendu : une porte fait ~200px,
// un docker doit faire ~60% de cette hauteur a l'avant. Facteur applique a TOUTE la formule
// pour que la perspective reste derivee d'une seule loi (jamais un scale par personnage).
const FACTEUR_TAILLE = 0.46;
const scaleAt = (yPieds: number): number =>
  (hauteurAt(yPieds) / HAUTEUR_SQUELETTE) * FACTEUR_TAILLE;

// ---------------------------------------------------------------------------------------------
// LES MARCHEURS DU QUAI
//
// ⭐⭐ LE VERROU PAS/DISTANCE (brique n.1 du socle, la plus importante) :
// x = x0 + walkDistance(pas, swing, scale). C'est le PAS qui produit le deplacement.
// On interpole un NOMBRE DE PAS, jamais des pixels — donc les pieds ne patinent JAMAIS,
// quelle que soit la cadence. Un drapeau "marche" separe de la position = glissement garanti.
// ---------------------------------------------------------------------------------------------

type Marcheur = {
  id: string;
  yPieds: number;      // profondeur -> determine l'echelle ET la vitesse apparente
  xDepart: number;
  sens: 1 | -1;        // 1 = vers la droite, -1 = vers la gauche
  pasParSeconde: number;
  phase0: number;      // desynchronisation (rapports irrationnels, jamais un offset simple)
  swing: number;       // amplitude du ciseau (deg) — plancher dur 16deg
  couleur: string;
  charge?: boolean;    // porte quelque chose -> buste penche, pas plus courts
};

// Desynchronisation par rapports irrationnels (phi, e, sqrt2) : un offset simple retombe
// parfois sur des postures identiques par coincidence (regle gravee vague D).
const PHI = 1.618033988749;
const E = 2.718281828459;
const SQ2 = 1.414213562373;

const MARCHEURS: Marcheur[] = [
  // ⚠️ PROFONDEUR ETALEE (vu au rendu v2 : avec des yPieds tous entre 872 et 988, l'ecart de
  // hauteur n'etait que de 61px — la perspective ne se LISAIT pas, les persos du fond
  // paraissaient aussi grands que ceux de l'avant). La plage va desormais de 838 a 1010.
  // Fond du quai
  { id: "m1", yPieds: 842, xDepart: -80, sens: 1, pasParSeconde: 1.55, phase0: (PHI * 1) % 1, swing: 18, couleur: "#3d4a5c" },
  { id: "m2", yPieds: 852, xDepart: 1560, sens: -1, pasParSeconde: 1.40, phase0: (E * 1) % 1, swing: 17, couleur: "#44506a" },
  { id: "m7", yPieds: 846, xDepart: 760, sens: 1, pasParSeconde: 1.46, phase0: (PHI * 3) % 1, swing: 17, couleur: "#414d63" },
  // Milieu
  { id: "m3", yPieds: 908, xDepart: 320, sens: 1, pasParSeconde: 1.62, phase0: (SQ2 * 1) % 1, swing: 19, couleur: "#38445a" },
  { id: "m4", yPieds: 924, xDepart: 1840, sens: -1, pasParSeconde: 1.62, phase0: (PHI * 2) % 1, swing: 17, couleur: "#4a5468", charge: true },
  { id: "m8", yPieds: 916, xDepart: 1120, sens: -1, pasParSeconde: 1.52, phase0: (E * 3) % 1, swing: 18, couleur: "#3f4b60" },
  // Avant (grands, foulee large)
  // Swing reduit a l'avant : a grande echelle, 20deg donnait 70px/pas (le perso enjambait
  // au lieu de marcher). Trouve par le script de verification, invisible dans le code seul.
  { id: "m5", yPieds: 984, xDepart: -140, sens: 1, pasParSeconde: 1.72, phase0: (E * 2) % 1, swing: 16, couleur: "#333f52" },
  { id: "m6", yPieds: 1008, xDepart: 2040, sens: -1, pasParSeconde: 1.58, phase0: (SQ2 * 2) % 1, swing: 16, couleur: "#3b4759", charge: true },
];

const Marcheurs: React.FC<{ frame: number; teinte: number }> = ({ frame, teinte }) => {
  const t = frame / 30; // secondes

  return (
    <g id="MARCHEURS">
      {MARCHEURS.map((m) => {
        const sc = scaleAt(m.yPieds);

        // Le nombre de pas ecoules est la SEULE variable temporelle du marcheur.
        const pas = m.phase0 * 2 + t * m.pasParSeconde;

        // La phase de marche DERIVE du nombre de pas (1 cycle = 2 pas).
        const phase = walkPhaseFromSteps(pas);

        // La position DERIVE du nombre de pas. Aucun px anime a la main.
        const dist = walkDistance(pas, m.swing, sc);
        let x = m.xDepart + m.sens * dist;

        // Rebouclage HORS CHAMP : quand un marcheur sort, il rentre de l'autre cote.
        // ⚠️ VU AU RENDU : avec une marge de 260px, le quai se VIDAIT par moments (2 marcheurs
        // sur 6 dans le cadre). Marge resserree = les marcheurs reviennent plus vite, la
        // presence reste continue. (C'est le defaut n.2 releve par Aziz sur MarcheNuitVivant :
        // "le premier plan se vide quand les rythmes de marche sont tres differents".)
        const marge = 90;
        const span = W + marge * 2;
        if (m.sens === 1) {
          x = ((x + marge) % span + span) % span - marge;
        } else {
          x = W + marge - ((((W + marge - x) % span) + span) % span);
        }

        // ⛔⛔ BUG CORRIGE (marcheurs qui degeneraient en TRAIT VERTICAL) :
        // le socle EXPORTE et DOCUMENTE BRAS_LAG, mais <Figure> ne l'applique PAS en interne :
        // ses bras automatiques valent -sin(a)*armSwing, avec le MEME `a` que les jambes
        // (sin(a)*swingMax). Les deux s'annulent donc EXACTEMENT aux memes instants, 2x par
        // cycle : a ce moment-la jambes et bras sont tous verticaux et le marcheur se lit comme
        // un poteau surmonte d'une tete. Mesure : ~9% de chaque cycle est degenere (|swing|<3deg
        // ET |bras|<3deg). Avec 8 marcheurs a phases independantes, il y en a quasi toujours un
        // dans la fenetre — exactement le symptome observe.
        // PARADE = celle que le socle prescrit : DEPHASER les bras de BRAS_LAG (surtout PAS un
        // plancher dur sur le swing, l'anti-pattern documente qui ecrase l'oscillation et
        // produit un glissement). Comme on ne modifie pas le socle, on pilote les bras
        // explicitement via arm1Deg/arm2Deg, avec la formule du socle decalee de BRAS_LAG.
        // ⚠️ <Figure> AJOUTE `torso` a tout angle de bras manuel : on le SOUSTRAIT ici pour que
        // l'addition du socle retombe exactement sur l'angle voulu (sinon le personnage charge,
        // qui a torsoDeg=9, verrait ses bras derailler de 9deg).
        // Mesure apres correction : 0% de poses degenerees.
        const aMarche = phase * Math.PI * 2;
        const armSwingM = m.charge ? 10 : 22;
        const torsoM = m.charge ? 9 : 0;
        const armLag = -Math.sin(aMarche - BRAS_LAG) * armSwingM;

        // ⚠️ CAS PARTICULIER DU PERSONNAGE CHARGE : ses bras oscillent peu (armSwing 10, il
        // porte). Le seul dephasage ne suffit alors pas — mesure : 28 a 38 frames encore
        // degenerees sur 720. La parade n'est PAS d'augmenter son swing (ca contredirait la
        // charge, et resterait imparfait) : c'est de lui donner la pose de quelqu'un qui PORTE.
        // Un porteur tient ses bras EN AVANT, il ne les laisse pas pendre : un offset constant
        // les sort de la verticale en permanence. Mesure apres : 0 frame degeneree.
        const portAvant = m.charge ? 14 : 0;

        // Le personnage charge se penche et rentre la tete : la charge se lit dans le CORPS.
        const pose = {
          ...(m.charge ? { torsoDeg: 9, headTuck: 1.5 } : {}),
          arm1Deg: armLag + portAvant - torsoM,
          arm2Deg: -armLag + portAvant - torsoM,
        };

        // Les personnages du fond sont plus pales (perspective atmospherique).
        const fondT = interpolate(m.yPieds, [860, 990], [0.42, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const couleur = mix(m.couleur, PALETTE.VILLE_PROCHE, fondT * (1 - teinte * 0.5));

        // ⛔ BUG CORRIGE (releve par Aziz sur la v3) : le socle dessine une figure de profil
        // orientee vers la DROITE. Rendre la distance negative faisait AVANCER le corps vers la
        // gauche sans le retourner — les marcheurs "reculaient". Il faut MIROITER le corps.
        // Le miroir se fait autour de x (le perso est dessine en repere local centre sur x).
        const miroir = m.sens === -1;

        const figure = (
          <Figure
            x={miroir ? 0 : x}
            y={m.yPieds}
            phase={phase}
            scale={sc}
            color={couleur}
            p={{
              swingMax: m.swing,
              bobAmp: m.charge ? 1.8 : 2.5,
              lean: m.charge ? 6 : 0,
              hipDrop: m.charge ? 2 : 0,
              armSwing: m.charge ? 10 : 22,
            }}
            pose={pose}
          />
        );

        // Pour le sens -1 : on translate a x, puis on inverse l'axe X. La figure est rendue en
        // x=0 dans ce repere local, donc elle apparait bien a la position x, mais retournee.
        return miroir ? (
          <g key={m.id} transform={`translate(${x} 0) scale(-1 1)`}>
            {figure}
          </g>
        ) : (
          <g key={m.id}>{figure}</g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------
// ⭐ LE HEROS — hierarchie figurant/personnage
//
// Procede narratif classique (figuration au theatre, hierarchie de traitement en animation) :
// le NIVEAU DE DETAIL signale l'importance narrative. L'oeil suit ce qui est le plus defini.
//   - les FIGURANTS (Marcheurs ci-dessus) : silhouettes anonymes, boucles repetees
//   - le HEROS : habille, trait plus epais, et surtout un geste SINGULIER qui ne boucle pas
//
// ⚠️ GARDE-FOU : le heros doit rester plus defini que les figurants MAIS PAS plus que le decor,
// sinon il se decolle et lit comme un sticker pose dessus (piege du perso 2D riche sur fond plat).
// Ici : meme squelette valide (donc meme qualite de marche), habillage en aplats de la meme
// famille chromatique que le decor.
// ---------------------------------------------------------------------------------------------

const HEROS_Y = 996;          // premier plan, mais dans la bande de circulation
const HEROS_SWING = 16;
const HEROS_PAS_S = 1.5;
const HEROS_X0 = 250;
const ARRET_DEB = 8.5;        // s — il commence a ralentir
const ARRET_FIN = 15.5;       // s — il repart

// ⭐ UNE SEULE source de verite pour l'etat du heros a l'instant t.
// Le corps ET l'habillage la consomment : impossible qu'ils divergent (l'habillage qui
// "flotte" a cote du corps est le bug classique de ce genre de greffe).
const etatHeros = (frame: number) => {
  const t = frame / 30;
  const sc = scaleAt(HEROS_Y);

  // Le nombre de pas se FIGE pendant l'arret. Comme x derive des pas (verrou pas/distance),
  // le heros ne peut pas glisser pendant qu'il est immobile.
  let pas: number;
  if (t < ARRET_DEB) {
    pas = t * HEROS_PAS_S;
  } else if (t < ARRET_FIN) {
    const d = Math.min(1, (t - ARRET_DEB) / 1.1); // deceleration douce
    pas = ARRET_DEB * HEROS_PAS_S + (1 - (1 - d) * (1 - d)) * 0.9;
  } else {
    const d = Math.min(1, (t - ARRET_FIN) / 1.3); // reprise progressive
    pas = ARRET_DEB * HEROS_PAS_S + 0.9 + d * (t - ARRET_FIN) * HEROS_PAS_S;
  }

  const arret = t >= ARRET_DEB + 1.1 && t <= ARRET_FIN;
  const phase = walkPhaseFromSteps(pas);

  // ⚠️ LE BOB N'EST PAS CALCULE ICI. Il l'etait avant (dupliquant la formule du socle), ce qui
  // creait DEUX endroits a garder synchrones. Il est desormais calcule une seule fois, dans
  // ancragesHeros(), a partir de la phase — corps et habillage en heritent ensemble.
  return {
    sc,
    pas,
    arret,
    phase,
    x: HEROS_X0 + walkDistance(pas, HEROS_SWING, sc),
  };
};

// ⭐⭐ LA GEOMETRIE DU HEROS — UNE SEULE FONCTION, consommee par le corps ET par l'habillage.
// Reprise LITTERALE de StickFigure::Figure (memes formules, memes constantes, meme ordre) :
// c'est la seule facon d'avoir la garantie que le vetement ne peut pas diverger du squelette.
// Elle rend les points d'ancrage DANS LE REPERE LOCAL DE <Figure> (origine = le sol sous les
// pieds, y negatif vers le haut) — exactement le repere dans lequel l'habillage est dessine.
type AncragesHeros = {
  hx: number; hy: number;   // hanche
  sx: number; sy: number;   // epaule
  cx: number; cy: number;   // centre de la tete
  b1x: number; b1y: number; // main AVANT (bras redessine par-dessus le vetement)
  torsoDeg: number;
};

// ⭐ CONSOMME LA BRIQUE PARTAGEE `bodyPoints` (_shared/stick-figure-svg/habillage.ts) au lieu de
// recalculer hanche/epaule/tete. C'est la regle : une seule source de verite geometrique pour
// le corps ET ses overlays. On n'ajoute ici que ce qui est specifique au heros — la main du
// bras AVANT, qu'on redessine par-dessus le vetement.
const ancragesHeros = (
  phase: number,
  bobAmp: number,
  armSwing: number,
  pose?: { torsoDeg?: number; headTuck?: number; arm1Deg?: number },
): AncragesHeros => {
  const r = (d: number) => (d * Math.PI) / 180;
  const a = phase * Math.PI * 2;
  const torsoDeg = pose?.torsoDeg ?? 0;

  // hanche / epaule / tete : LA BRIQUE, pas un recalcul maison.
  const bp = bodyPoints(phase, { bobAmp, lean: 0, hipDrop: 0 }, torsoDeg);

  // headTuck n'est pas gere par bodyPoints (il est propre aux poses non-locomotrices) :
  // on ne l'applique que s'il est demande, avec la formule du socle.
  const tuck = pose?.headTuck ?? 0;
  let { headCx: cx, headCy: cy } = bp;
  if (tuck !== 0) {
    const headLen = 12 - tuck * 7;
    cx = bp.sx + Math.sin(r(torsoDeg)) * headLen + 3 * Math.cos(r(torsoDeg));
    cy = bp.sy - Math.cos(r(torsoDeg)) * headLen + 3 * Math.sin(r(torsoDeg));
  }

  // Bras AVANT : meme regle que le socle (angle manuel + torso, sinon contre-balancement
  // DEPHASE de BRAS_LAG — cf. le bug du trait vertical documente plus bas sur les figurants).
  const a1 = pose?.arm1Deg !== undefined
    ? pose.arm1Deg + torsoDeg
    : -Math.sin(a - BRAS_LAG) * armSwing;
  const b1x = bp.sx + Math.sin(r(a1)) * ARM_LENGTH_DEFAULT;
  const b1y = bp.sy + Math.cos(r(a1)) * ARM_LENGTH_DEFAULT;

  return { hx: bp.hx, hy: bp.hy, sx: bp.sx, sy: bp.sy, cx, cy, b1x, b1y, torsoDeg };
};

// L'habillage, dessine dans le repere local de <Figure> a partir des ancrages ci-dessus.
// ⚠️ Il ne recalcule RIEN : il consomme la geometrie du corps. Aucune coordonnee devinee.
const Habillage: React.FC<{ g: AncragesHeros; couleurCorps: string }> = ({ g, couleurCorps }) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const { hx, hy, sx, sy, cx, cy, b1x, b1y, torsoDeg } = g;

  // Normale au buste (largeur du vetement, perpendiculaire au torse).
  const nx = Math.cos(r(torsoDeg));
  const ny = Math.sin(r(torsoDeg));

  // ⛔ LARGEURS RESSERREES (bug vu au rendu v6 : a l'echelle du heros — sc=1.47 — une tunique
  // de +-7.5/+-10 unites locales faisait 22 a 29px a l'ecran pour un buste de 6.6px et des bras
  // de 5.9px d'epaisseur. Elle AVALAIT integralement le torse et les DEUX bras : il ne restait
  // que la tete en haut et les jambes en bas, ce qui se lisait comme un 2e personnage fantome.
  // Mesure du rendu : ZERO pixel de corps entre y=904 et y=972. La tunique doit habiller le
  // buste, pas s'y substituer.)
  const largeurEpaule = 5.2;
  const largeurHanche = 7.2;
  // La tunique s'arrete a mi-cuisse : plus bas, elle masquerait le ciseau des jambes et la
  // marche deviendrait illisible (le mouvement des jambes EST la lecture de la marche).
  const basY = hy + 6;
  const bx = hx + Math.sin(r(torsoDeg)) * -6;

  // ⚠️ VU AU RENDU : la ligne du buste s'arrete a l'epaule, et la tete flotte ~15px plus haut
  // (c'est la geometrie normale du socle : il n'y a pas de "cou" dessine). Avec une tunique dont
  // le bord haut est plat et pile sur l'epaule, ce vide se lisait comme un decrochage entre la
  // tete et le vetement. On fait donc remonter le col LEGEREMENT au-dessus de la ligne d'epaule,
  // le long de l'axe du buste : le vetement enveloppe la base du cou, comme un vrai col.
  const colRemontee = 4;
  const colX = sx + Math.sin(r(torsoDeg)) * colRemontee;
  const colY = sy - Math.cos(r(torsoDeg)) * colRemontee;

  return (
    <g>
      {/* Tunique : trapeze col -> mi-cuisse, oriente par le buste. */}
      <path
        d={`M ${colX - nx * largeurEpaule} ${colY - ny * largeurEpaule}
            L ${colX + nx * largeurEpaule} ${colY + ny * largeurEpaule}
            L ${bx + nx * largeurHanche} ${basY + ny * largeurHanche}
            L ${bx - nx * largeurHanche} ${basY - ny * largeurHanche} Z`}
        fill="#b8623c"
        opacity={0.94}
      />
      {/* Ceinture sur la ligne de hanche (largeur alignee sur celle de la tunique). */}
      <line
        x1={hx - nx * 7.4}
        y1={hy - ny * 7.4}
        x2={hx + nx * 7.4}
        y2={hy + ny * 7.4}
        stroke="#7c3f26"
        strokeWidth={3.2}
      />
      {/* ⭐ LE BRAS AVANT EST REDESSINE PAR-DESSUS LE VETEMENT, avec la geometrie EXACTE que
          <Figure hideArm1> vient d'omettre (c'est precisement l'usage prevu par le socle).
          Sans ca, le bras passe DERRIERE la tunique et le personnage parait manchot. */}
      <line
        x1={sx} y1={sy} x2={b1x} y2={b1y}
        stroke={couleurCorps} strokeWidth={4} strokeLinecap="round"
      />
      {/* Couvre-chef : bord ellipse + calotte, cales sur le CENTRE DE TETE reel. */}
      <ellipse cx={cx} cy={cy - HEAD_RADIUS + 1.5} rx={11} ry={1.8} fill="#c9a03e" />
      <path
        d={`M ${cx - 7.5} ${cy - HEAD_RADIUS + 1.5}
            q 7.5 -6.5 15 0 Z`}
        fill="#c9a03e"
      />
    </g>
  );
};

const HEROS_ENCRE = "#2b3348";

const HerosComplet: React.FC<{ frame: number }> = ({ frame }) => {
  const { sc, phase, x, arret } = etatHeros(frame);

  // Pendant l'arret : pose-cle explicite et STABLE (jamais une somme de ressorts qui derive).
  // Il se redresse et regarde le fleuve — c'est le geste SINGULIER qui le distingue des
  // figurants, dont les boucles se repetent.
  const pose = arret
    ? { torsoDeg: -2, headTuck: -1, arm1Deg: 12, arm2Deg: -6, leg1Deg: 5, leg2Deg: -5 }
    : undefined;

  const bobAmp = arret ? 0 : 2.4;
  const armSwing = arret ? 0 : 20;

  // Bras DEPHASES de BRAS_LAG, comme les figurants (meme parade au trait vertical). En marche,
  // on impose les angles explicitement pour que le bras AVANT redessine par <Habillage> et le
  // bras ARRIERE dessine par <Figure> restent rigoureusement coherents entre eux.
  const aH = phase * Math.PI * 2;
  const armLagH = -Math.sin(aH - BRAS_LAG) * armSwing;
  const poseFigure = arret
    ? pose
    : { arm1Deg: armLagH, arm2Deg: -armLagH };

  // ⭐⭐ UNE SEULE SOURCE GEOMETRIQUE pour le corps ET le vetement.
  const g = ancragesHeros(phase, bobAmp, armSwing, poseFigure);

  return (
    // ⭐⭐ UN SEUL <g> PARTAGE : corps et habillage vivent dans le MEME repere local, pose par
    // le MEME transform. Deux <g> paralleles (l'ancienne version) etaient deja numeriquement
    // identiques, mais rien ne l'imposait structurellement — un futur ajustement sur l'un
    // (calage au sol, rotation, pivot) aurait silencieusement decolle l'autre. Ici, c'est
    // impossible par construction : il n'y a plus qu'un seul repere a decaler.
    <g transform={`translate(${x} ${HEROS_Y}) scale(${sc})`}>
      {/* LE CORPS : meme socle valide que les figurants (donc meme qualite de marche), mais
          encre plus dense — premier niveau de la hierarchie de traitement.
          x=0/y=0/scale=1 : le placement est deja porte par le <g> partage ci-dessus.
          hideArm1 : le bras AVANT est omis ici et redessine PAR-DESSUS la tunique par
          <Habillage> avec la geometrie identique (usage explicitement prevu par le socle). */}
      <Figure
        x={0}
        y={0}
        phase={phase}
        scale={1}
        color={HEROS_ENCRE}
        p={{ swingMax: HEROS_SWING, bobAmp, armSwing }}
        pose={poseFigure}
        hideArm1
      />
      {/* ⭐⭐ L'HABILLAGE CONSOMME LA GEOMETRIE DU CORPS — il ne la redevine pas.
          Regle gravee : deux representations d'un meme corps partagent la MEME source
          geometrique — on ne dessine JAMAIS le vetement a des coordonnees devinees. */}
      <Habillage g={g} couleurCorps={HEROS_ENCRE} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------
// LA SCENE
// ---------------------------------------------------------------------------------------------

export const PortVivant16x9: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- ARC TEMPOREL : nuit -> aube -> plein jour ----
  // dawn: 0 = nuit noire, 1 = plein jour. Strictement monotone (le soleil ne redescend pas).
  const dawn = interpolate(frame, [0, 150, 430, 600], [0, 0.12, 0.72, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Voile de nuit pose PAR-DESSUS toute la scene (assombrit sans repeindre chaque forme).
  const nuitOp = interpolate(dawn, [0, 0.45, 1], [0.78, 0.34, 0], { extrapolateRight: "clamp" });

  // Lueur chaude de l'aube : monte puis redescend quand le jour est franc.
  const aubeOp = interpolate(dawn, [0, 0.3, 0.62, 1], [0, 0.46, 0.3, 0], { extrapolateRight: "clamp" });

  // ---- PARALLAXE : derive laterale lente, vitesse croissante du fond vers l'avant ----
  const prog = interpolate(frame, [0, DUR], [0, 1], { extrapolateRight: "clamp" });
  const txCiel = -prog * 16;
  const txVille = -prog * 38;
  const txEau = -prog * 62;
  const txQuaiFond = -prog * 96;
  const txBatiments = -prog * 118;
  const txAvant = -prog * 168;

  // Respiration camera : leger dezoom, la scene "s'ouvre" avec le jour.
  const camScale = interpolate(frame, [0, DUR], [1.032, 1.0], { extrapolateRight: "clamp" });

  // ---- LES GRUES : cycle de levage (fleche qui balaie + cable qui monte/descend) ----
  // Rotation de la fleche autour de son pivot exporte par le decor.
  const g1 = COORDS.grues.grue1.pivotFleche;
  const g2 = COORDS.grues.grue2.pivotFleche;
  // La grue ne travaille qu'une fois le jour leve : avant, le port dort.
  const travail = interpolate(dawn, [0.18, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const grue1Deg = Math.sin((frame / 186) * Math.PI * 2) * 7.5 * travail;
  const grue2Deg = Math.sin((frame / 240) * Math.PI * 2 + 1.1) * 6.0 * travail;
  // Le cable descend et remonte (levage). Amplitude en px, pas de rotation.
  const cable1Y = (1 - Math.cos((frame / 186) * Math.PI * 2)) * 26 * travail;
  const cable2Y = (1 - Math.cos((frame / 240) * Math.PI * 2 + 1.1)) * 20 * travail;

  // ---- LES LUMIERES : allumees la nuit, eteintes au jour ----
  // Les fenetres s'eteignent en VAGUES decalees (pas toutes ensemble).
  const lumiere = (retard: number): number =>
    interpolate(dawn, [0.28 + retard, 0.58 + retard], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // ⭐ LE BRASERO S'ETEINT AU LEVER DU JOUR (defaut releve par Aziz sur la scene precedente :
  // les braseros restaient allumes en plein jour). Un feu qu'on n'entretient plus retombe.
  const braseroVie = interpolate(dawn, [0.34, 0.68], [1, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Vacillement de la flamme : 3 sinus a rapports irrationnels (bruit deterministe).
  const flamme =
    0.72 +
    0.16 * Math.sin(frame / 3.1) +
    0.08 * Math.sin(frame / (3.1 * PHI) + 1.3) +
    0.05 * Math.sin(frame / (3.1 * E) + 2.7);

  // ---- L'EAU : les bateaux tanguent, jamais ils ne glissent sans raison ----
  // Le chalutier est AMARRE : il tangue sur place (roulis), il ne se deplace pas.
  const roulisChalutier = Math.sin(frame / 47) * 0.85 + Math.sin(frame / (47 * PHI)) * 0.35;
  const roulisPirogue = Math.sin(frame / 38 + 0.8) * 1.4;
  // Le voilier et le bac, eux, NAVIGUENT (vehicules : le glissement est credible).
  const voilierX = interpolate(frame, [0, DUR], [0, 148], { extrapolateRight: "clamp" });
  const bacX = interpolate(frame, [0, DUR], [0, -96], { extrapolateRight: "clamp" });

  // ---- LES OISEAUX : derivent et battent des ailes, plus actifs au lever du jour ----
  const oiseauxX = Math.sin(frame / 120) * 30 + prog * 64;
  const oiseauxY = Math.sin(frame / 86 + 1.4) * 9;
  const oiseauxOp = interpolate(dawn, [0.1, 0.45], [0.25, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---- LES NUAGES : derive tres lente, independante de la parallaxe ----
  const nuagesX = prog * 54;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.CIEL_BAS }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
        {/* Le degrade du ciel est declare a l'interieur de PLAN_CIEL — pas de <defs> global. */}

        {/* La camera transforme le CONTENU, jamais le viewBox (regle gravee). */}
        <g transform={`translate(${W / 2} ${H / 2}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`}>
          {/* ---------- PLAN 1 : CIEL ---------- */}
          <Inject html={PLAN_CIEL} transform={`translate(${txCiel} 0)`} />
          <Inject html={NUAGES} transform={`translate(${txCiel + nuagesX} 0)`} opacity={0.55 + dawn * 0.45} />

          {/* ---------- PLAN 2 : VILLE LOINTAINE ---------- */}
          <Inject html={PLAN_VILLE_LOINTAINE} transform={`translate(${txVille} 0)`} />
          <Inject
            html={OISEAUX}
            transform={`translate(${txVille + oiseauxX} ${oiseauxY})`}
            opacity={oiseauxOp}
          />

          {/* ---------- PLAN 3 : EAU + ce qui flotte ---------- */}
          <Inject html={PLAN_EAU} transform={`translate(${txEau} 0)`} />
          <Inject html={BAC_LOIN} transform={`translate(${txEau + bacX} 0)`} />
          <Inject html={VOILIER_LOIN} transform={`translate(${txEau + voilierX} 0)`} />
          <Inject html={BOUEE_2} transform={`translate(${txEau} ${Math.sin(frame / 41) * 2.2})`} />
          <Inject html={PIROGUE_LOIN} transform={`translate(${txEau} ${Math.sin(frame / 44 + 2) * 2})`} />
          <Inject html={BOUEE_1} transform={`translate(${txEau} ${Math.sin(frame / 36 + 1) * 2.4})`} />

          {/* Le chalutier est AMARRE : roulis sur place autour de sa ligne de flottaison. */}
          <Inject
            html={CHALUTIER}
            transform={`translate(${txQuaiFond} 0) rotate(${roulisChalutier} 1080 700)`}
          />
          <Inject html={PONTON} transform={`translate(${txQuaiFond} 0)`} />
          <Inject
            html={PIROGUE_1}
            transform={`translate(${txQuaiFond} 0) rotate(${roulisPirogue} 1140 710)`}
          />
          <Inject html={AMARRE_PIROGUE} transform={`translate(${txQuaiFond} 0)`} />

          {/* ---------- PLAN 4 : BORD DE QUAI ---------- */}
          <Inject html={QUAI_BORD} transform={`translate(${txQuaiFond} 0)`} />
          <Inject html={BITTE_1} transform={`translate(${txQuaiFond} 0)`} />
          <Inject html={BITTE_2} transform={`translate(${txQuaiFond} 0)`} />
          <Inject html={BITTE_3} transform={`translate(${txQuaiFond} 0)`} />
          <Inject html={AMARRE_CHALUTIER_AVANT} transform={`translate(${txQuaiFond} 0)`} />
          <Inject html={AMARRE_CHALUTIER_ARRIERE} transform={`translate(${txQuaiFond} 0)`} />

          {/* ---------- PLAN 5 : SOL DU QUAI ---------- */}
          <Inject html={PLAN_QUAI_SOL} transform={`translate(${txBatiments} 0)`} />

          {/* ---------- PLAN 6 : BATIMENTS ET MACHINES ---------- */}
          <g transform={`translate(${txBatiments} 0)`}>
            <Inject html={HANGAR_A} />
            <Inject html={PORTE_HANGAR_A} />
            {/* Les fenetres s'allument/s'eteignent en vagues decalees. */}
            <Inject html={FENETRE_HANGAR_A_1} opacity={0.25 + lumiere(0) * 0.75} />
            <Inject html={FENETRE_HANGAR_A_2} opacity={0.25 + lumiere(0.07) * 0.75} />
            <Inject html={ENSEIGNE_HANGAR_A} />
            <Inject html={LINGE} transform={`rotate(${Math.sin(frame / 58) * 0.7} 470 520)`} />
            <Inject html={KIOSQUE} />
            {/* Le palmier balance : c'est du vegetal, il est cense bouger. */}
            <Inject html={PALMIER_1} transform={`rotate(${Math.sin(frame / 64) * 1.1} 700 800)`} />

            {/* GRUE 2 : mat fixe, fleche qui pivote, cable qui leve. */}
            <Inject html={GRUE_2_MAT} />
            <Inject html={GRUE_2_FLECHE} transform={`rotate(${grue2Deg} ${g2.x} ${g2.y})`} />
            <Inject html={GRUE_2_CABLE} transform={`rotate(${grue2Deg} ${g2.x} ${g2.y}) translate(0 ${cable2Y})`} />

            {/* BRASERO : structure fixe, braise qui vacille puis s'eteint au jour. */}
            <Inject html={BRASERO} />

            {/* GRUE 1 : idem, cycle plus long. */}
            <Inject html={GRUE_1_MAT} />
            <Inject html={GRUE_1_FLECHE} transform={`rotate(${grue1Deg} ${g1.x} ${g1.y})`} />
            <Inject html={GRUE_1_CABLE} transform={`rotate(${grue1Deg} ${g1.x} ${g1.y}) translate(0 ${cable1Y})`} />

            <Inject html={CONTENEUR} />
            <Inject html={HANGAR_B} />
            <Inject html={PORTE_HANGAR_B} />
            <Inject html={FENETRE_HANGAR_B_1} opacity={0.25 + lumiere(0.14) * 0.75} />
            <Inject html={LAMPADAIRE_2} />
            <Inject html={LAMPADAIRE_1} />
            <Inject html={VELO} />
          </g>

          {/* ---------- LES HALOS DES LAMPADAIRES (nuit seulement) ---------- */}
          <g transform={`translate(${txBatiments} 0)`} opacity={lumiere(0.02)}>
            <ellipse cx={1526} cy={433} rx={62} ry={46} fill="#f6dfa4" opacity={0.24} />
            <ellipse cx={162} cy={439} rx={62} ry={46} fill="#f6dfa4" opacity={0.24} />
            <ellipse cx={1526} cy={860} rx={150} ry={30} fill="#f6dfa4" opacity={0.1} />
            <ellipse cx={162} cy={866} rx={150} ry={30} fill="#f6dfa4" opacity={0.1} />
          </g>

          {/* ---------- LA FLAMME DU BRASERO ---------- */}
          {/* Structure dessinee par le decor ; la flamme est a NOUS (elle vit). */}
          <g transform={`translate(${txBatiments} 0)`} opacity={braseroVie}>
            <ellipse cx={912} cy={766} rx={26 * flamme} ry={17 * flamme} fill="#e88b3a" opacity={0.36} />
            <path
              d={`M 906 770 q ${-3 * flamme} ${-11 * flamme} 2 ${-17 * flamme} q ${4 * flamme} ${7 * flamme} ${5 * flamme} ${2 * flamme} q ${2 * flamme} ${6 * flamme} -1 ${13 * flamme} Z`}
              fill="#f0a23e"
            />
            <path
              d={`M 915 770 q ${-2 * flamme} ${-8 * flamme} 1 ${-12 * flamme} q ${3 * flamme} ${5 * flamme} ${4 * flamme} ${1 * flamme} q ${1 * flamme} ${4 * flamme} -1 ${10 * flamme} Z`}
              fill="#f6c65e"
            />
          </g>

          {/* ---------- LES PERSONNAGES (socle stick figure valide) ---------- */}
          {/* Poses SUR le sol du quai, dans la bande de circulation degagee du decor. */}
          <g transform={`translate(${txBatiments} 0)`}>
            {/* Les FIGURANTS d'abord (ils passent derriere le heros). */}
            <Marcheurs frame={frame} teinte={dawn} />
            {/* Puis le HEROS, dessine PAR-DESSUS : il est au premier plan de la bande. */}
            <HerosComplet frame={frame} />
          </g>

          {/* ---------- PLAN 7 : AVANT-PLAN (passe DEVANT les personnages) ---------- */}
          <Inject html={PROPS_AVANT_GAUCHE} transform={`translate(${txAvant} 0)`} />
          <Inject html={PROPS_AVANT_DROITE} transform={`translate(${txAvant} 0)`} />

          {/* ---------- LES VOILES DE LUMIERE (par-dessus tout) ---------- */}
          {/* Nuit : bleu profond. Aube : lueur chaude. Les deux se croisent. */}
          <rect x={0} y={0} width={W} height={H} fill="#14213f" opacity={nuitOp} />
          <rect x={0} y={0} width={W} height={H} fill="#e8975a" opacity={aubeOp * 0.22} />
          {/* Le soleil bas de l'aube eclaire l'HORIZON SEUL, jamais toute la scene.
              ⚠️ VU AU RENDU v2 : une ellipse de 190px de rayon a 0.42 d'opacite delavait le
              port entier (le quai virait au gris-beige). Resserree sur la bande d'horizon. */}
          <ellipse
            cx={W * 0.52}
            cy={COORDS.horizonY - 30}
            rx={W * 0.34}
            ry={86}
            fill="#f6c98a"
            opacity={aubeOp * 0.3}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default PortVivant16x9;
