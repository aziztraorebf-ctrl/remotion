import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import {
  DEFS,
  PLAN_CIEL,
  PLAN_VILLE,
  PLAN_ETALS_FOND,
  PLAN_ETALS,
  PLAN_SOL,
  PLAN_AVANT,
} from "./marcheNuitGroupsB";
import {
  Figure,
  FigureFace,
  rad,
  LEG_LENGTH,
  HIP_Y_STANDING,
  TORSO_LENGTH,
  walkPhaseFromSteps,
  stepLength,
  ENCRE,
} from "../../_shared/stick-figure-svg/StickFigure";
import {
  PersonnageRole,
  RoleTenue,
  CARNATIONS,
} from "../../_shared/stick-figure-svg/identite/Roles";
import { T, MARCHE_INFORMEL_FRAMES, FPS } from "./marcheInformelTiming";

/**
 * "LE MARCHE QUI N'EXISTE PAS" — LA PREMIERE SCENE STICK FIGURE PILOTEE PAR LA VOIX (2026-07-28)
 *
 * ⭐ CE QUI EST NEUF ICI, ET RIEN D'AUTRE : le TIMING.
 * Les 6 scenes precedentes avaient des frames choisies a la main (`T = { marcheIn0: 40 }`).
 * Ici tout vient de `marcheInformelTiming.ts`, lui-meme derive du forced-alignment de la
 * narration reellement generee. Un personnage entre QUAND LA VOIX LE NOMME.
 *
 * ⛔ Aucun geste nouveau n'est invente : on ne rejoue que des briques deja validees sur rendu
 * (marche verrouillee au pas, marchands de face qui helent, apparition dessinee, echange par
 * relais de mains). C'est deliberé — la seule inconnue de cette scene doit etre le pilotage
 * par la voix, pas un geste non prouve.
 *
 * FILTRE DE COMPOSITION (STICK-FIGURE-INDEX § regle de composition) : sol OUI (le decor porte
 * les personnages) · geste du CORPS OUI (marcher, heler, tendre la main) · decor RENDU ET
 * REGARDE OUI (marcheNuitGroupsB = candidat gagnant du test aveugle Fable vs Opus). 3/3.
 */

const W = 1920;
const H = 1080;

const ETALS_X = [240, 908, 1580];
const SOL_MARCHAND = 768;
const SOL_PASSANT_FOND = 762;
const SOL_PASSANT_AVANT = 946;

// PERSPECTIVE UNIQUE — la taille DERIVE de la profondeur (⛔ jamais un scale regle a l'oeil :
// piege mesure, marchands de 198px au fond contre 174px pour un perso 3x plus proche).
const Y_HORIZON = 700;
const Y_PROCHE = 1000;
const scaleAt = (solY: number) => {
  const t = Math.max(0, Math.min(1, (solY - Y_HORIZON) / (Y_PROCHE - Y_HORIZON)));
  return 1.35 + (2.3 - 1.35) * t;
};

const smooth = (t: number) => t * t * (3 - 2 * t);
const clampI = (f: number, i: [number, number], o: [number, number]) =>
  interpolate(f, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ============================================================================================
// ⭐ 1. LE DECOR SE REVELE — sur "ce marche N'EXISTE pas"
// ============================================================================================
// ⛔ DEFAUT DE LA v1, VU AU RENDU (le calcul ne pouvait pas l'attraper) : j'avais applique
// `strokeDashoffset` au decor, comme pour l'apparition dessinee d'un personnage. Ca ne trace
// RIEN ici — le decor de Fable est fait d'APLATS REMPLIS (`fill`), et un dash n'agit que sur les
// CONTOURS (`stroke`). Resultat : le marche apparaissait en simple fondu, tous les etals deja
// pleins des la mi-parcours.
// ⭐ REGLE A RETENIR : le trace progressif suppose un dessin AU TRAIT. Sur des aplats, il faut un
// autre geste. On revele donc par un MASQUE qui balaie de gauche a droite — le marche "s'ouvre"
// au lieu de s'ecrire, ce qui reste fidele a l'intention (la voix nie, l'image installe) et est
// honnete avec la matiere reelle du decor.
const REVEAL_ID = "marche-informel-reveal";

// ============================================================================================
// ⭐ 2. LES MARCHANDS DE FACE — ils ne helent QUE quand la voix parle d'eux
// ============================================================================================
const PHI = 1.618033988;
const E = 2.718281828;
const SQRT2 = 1.414213562;
const DESYNC = [0, PHI, E];
const PERIODE = [196, 232, 214];

const MARCHANDS = [
  { role: "commercante" as const, carnation: 2, actif: true },
  { role: "agriculteur" as const, carnation: 4, actif: true },
  { role: "fonctionnaire" as const, carnation: 1, actif: false },
];

const marchandAt = (frame: number, i: number) => {
  const p = PERIODE[i];
  // ⭐ PILOTE PAR LA VOIX : avant que la narration ne nomme "ces femmes", les marchands sont la
  // mais ne helent pas. Le geste ARRIVE sur le mot.
  const eveil = clampI(frame, [T.marchandsHelent, T.marchandsHelent + 24], [0, 1]);
  const t = ((frame + DESYNC[i] * 61) % p) / p;

  let leve = 0;
  if (t < 0.12) leve = smooth(t / 0.12);
  else if (t < 0.34) leve = 1;
  else if (t < 0.46) leve = 1 - smooth((t - 0.34) / 0.12);
  if (!MARCHANDS[i].actif) leve = 0;
  leve *= eveil;

  const agite = t >= 0.12 && t < 0.34 ? Math.sin(((t - 0.12) / 0.22) * Math.PI * 5) : 0;

  // ⭐ TRANSFERT DE POIDS lent (periode irrationnelle par marchand) : evite le fige-net SANS
  // produire le bobbing rejete en vague D. Un transfert deplace le centre de gravite ; une
  // respiration ne fait que vibrer (et se lit comme un defaut technique).
  const appui = Math.sin((frame / (188 + i * 31)) * Math.PI * 2 + i * SQRT2);

  return { leve, agite, appui };
};

const facePose = (m: ReturnType<typeof marchandAt>) => ({
  hipY: HIP_Y_STANDING + Math.abs(m.appui) * 0.7,
  torsoLean: m.appui * 2.2,
  headLean: m.appui * 1.4 + m.leve * 2,
  arm1Deg: 4 + m.appui * 2,
  arm2Deg: m.leve * (118 + m.agite * 16),
  legSpread: 7,
  weightShift: m.appui,
});

// Les MEMES formules que <FigureFace> — c'est ce qui garantit que la tenue tombe exactement sur
// le corps, sans decalage (RoleTenue ne prend que des BodyPoints, il est agnostique a la vue).
const faceBodyPoints = (fp: ReturnType<typeof facePose>) => {
  const hx = fp.weightShift * 3;
  const hy = fp.hipY;
  const sx = hx + Math.sin(rad(fp.torsoLean)) * TORSO_LENGTH;
  const sy = hy - Math.cos(rad(fp.torsoLean)) * TORSO_LENGTH;
  return {
    hx, hy, sx, sy,
    headCx: sx + Math.sin(rad(fp.torsoLean + fp.headLean)) * 12,
    headCy: sy - Math.cos(rad(fp.torsoLean + fp.headLean)) * 12,
    torso: fp.torsoLean,
  };
};

// ============================================================================================
// ⭐ 3. ELLE — sur "ELLE, elle vend des tomates depuis six heures"
// ============================================================================================
// Elle se DESSINE (le trace), puis elle marche. La bascule trace -> anime doit etre invisible :
// les deux representations partagent donc la MEME SOURCE GEOMETRIQUE (regle gravee — un trace
// dessine "au juge" tombait 2.5 unites au-dessus du corps du socle et le perso SAUTAIT).
const ELLE = {
  sol: SOL_PASSANT_AVANT + 14,
  xDepart: 660,
  vit: 0.5,
  swing: 19,
  carnation: 0,
  role: "commercante" as const,
};
const DUREE_TRACE = 46; // ~1.5s : le corps s'ecrit pendant que la voix finit "elle vend"
const DASH = 4200;

const POSE0 = { leg1: 10, leg2: -12, torso: 4, arm1: 22, arm2: -20 };
const ARM_L = 28;
const P0 = (() => {
  const hy = HIP_Y_STANDING;
  const legLen = (deg: number) => {
    const c = Math.cos(rad(deg));
    return c < 0.2 ? LEG_LENGTH : Math.max(LEG_LENGTH * 0.72, Math.min(LEG_LENGTH * 1.06, -hy / c));
  };
  const j1x = Math.sin(rad(POSE0.leg1)) * legLen(POSE0.leg1);
  const j2x = Math.sin(rad(POSE0.leg2)) * legLen(POSE0.leg2);
  const sx = Math.sin(rad(POSE0.torso)) * TORSO_LENGTH;
  const sy = hy - Math.cos(rad(POSE0.torso)) * TORSO_LENGTH;
  const hcx = sx + Math.sin(rad(POSE0.torso)) * 12 + 3 * Math.cos(rad(POSE0.torso));
  const hcy = sy - Math.cos(rad(POSE0.torso)) * 12 + 3 * Math.sin(rad(POSE0.torso));
  const a1 = POSE0.arm1 + POSE0.torso;
  const a2 = POSE0.arm2 + POSE0.torso;
  return {
    j1x, j2x, sx, sy, hcx, hcy,
    b1x: sx + Math.sin(rad(a1)) * ARM_L, b1y: sy + Math.cos(rad(a1)) * ARM_L,
    b2x: sx + Math.sin(rad(a2)) * ARM_L, b2y: sy + Math.cos(rad(a2)) * ARM_L,
  };
})();

const elleAt = (frame: number) => {
  const scale = scaleAt(ELLE.sol);
  const trace = clampI(frame, [T.elleEntre, T.elleEntre + DUREE_TRACE], [0, 1]);
  const depart = T.elleEntre + DUREE_TRACE;
  // ⛔ VERROU PAS/DISTANCE : c'est le pas qui produit le deplacement, jamais l'inverse.
  const pasL = 2 * LEG_LENGTH * Math.sin(rad(ELLE.swing)) * scale;
  const pas = Math.max(0, frame - depart) * (ELLE.vit / FPS);
  return { trace, pas, x: ELLE.xDepart + pas * pasL, scale, marche: frame >= depart };
};

// ============================================================================================
// ⭐ 4. LUI — sur "LUI, il achete ce soir ce qu'il revendra demain"
// ============================================================================================
// Il entre par la DROITE, marche vers elle, et S'ARRETE a sa hauteur : c'est le geste reel d'un
// acheteur. L'echange se lit par la PROXIMITE, pas par un objet qui vole.
//
// ⛔ DEFAUT ATTRAPE PAR LE CALCUL AVANT TOUT RENDU (et invisible a la lecture du code) : avec une
// vitesse constante, l'ecart minimal entre les deux etait de 348px atteint a la DERNIERE frame —
// ils ne se rencontraient jamais, et la phrase "il achete" restait sans image. Faire converger le
// croisement sur "millions" aurait exige vit=3.53 (un homme qui COURT, puis qui la depasse de
// 1945px). La vraie correction n'est pas d'accelerer : c'est de S'ARRETER.
//
// ⭐ Le verrou pas/distance rend l'arret gratuit et propre : on gele le COMPTEUR DE PAS, donc le
// corps s'immobilise avec sa position (pas de jambes qui continuent sur un corps arrete, pas de
// glissade). C'est exactement pourquoi la brique existe.
const LUI = {
  sol: SOL_PASSANT_AVANT + 6,
  xDepart: 2120,
  vit: 1.35,
  swing: 21,
  carnation: 3,
  role: "agriculteur" as const,
  /** distance a laquelle il s'arrete devant elle (portee d'echange credible) */
  ecartArret: 168,
};

/**
 * Frame a laquelle Lui rejoint Elle.
 * ⚠️ PAS analytique : Elle avance pendant qu'il approche, donc le point de rencontre depend des
 * DEUX trajectoires. On le resout une seule fois au chargement du module (pas par frame), en
 * balayant — c'est exact et ca evite une recurrence dans le rendu.
 */
const FRAME_ARRET = (() => {
  const scale = scaleAt(LUI.sol);
  const pasL = 2 * LEG_LENGTH * Math.sin(rad(LUI.swing)) * scale;
  for (let f = T.luiEntre; f < MARCHE_INFORMEL_FRAMES; f++) {
    const xLibre = LUI.xDepart - Math.max(0, f - T.luiEntre) * (LUI.vit / FPS) * pasL;
    if (xLibre <= elleAt(f).x + LUI.ecartArret) return f;
  }
  return MARCHE_INFORMEL_FRAMES; // jamais atteint : il n'arrive pas (defaut a voir au rendu)
})();

const luiAt = (frame: number, xElle: number) => {
  const scale = scaleAt(LUI.sol);
  const pasL = 2 * LEG_LENGTH * Math.sin(rad(LUI.swing)) * scale;
  const pasLibre = Math.max(0, frame - T.luiEntre) * (LUI.vit / FPS);
  const xLibre = LUI.xDepart - pasLibre * pasL;
  const xArret = xElle + LUI.ecartArret;

  // ⭐ DECELERATION : un arret net serait raide (et le swing tomberait d'un coup a zero, ce qui
  // se lit comme un bug d'affichage). Sur les derniers ~2.5 pas, on amortit — le pas raccourcit,
  // donc le corps ralentit TOUT SEUL, sans regler aucune vitesse a la main.
  const FREINAGE = pasL * 2.5;
  const reste = xLibre - xArret;
  const k = Math.max(0, Math.min(1, reste / FREINAGE)); // 1 = pleine allure, 0 = arrete
  const amorti = smooth(k);

  const arrete = reste <= 0;
  const x = arrete ? xArret : xArret + reste;
  // le nombre de pas suit la POSITION reelle (verrou pas/distance) : jamais un compteur separe
  const pas = (LUI.xDepart - x) / pasL;

  // ⛔ DEFAUT DE LA v1, VU AU RENDU : une fois arrive, il restait plante ~5s sans rien faire.
  // Un acheteur qui arrive doit ACHETER — sinon on retombe sur "du mouvement (ou de l'immobilite)
  // sans intention", que la regle du registre proscrit dans les deux sens.
  // ⭐ Il TEND LA MAIN vers elle : geste intentionnel sur place, deja valide en vague A
  // ("donner / recevoir / tendre la main"). Amorce des l'arret, tenu ensuite.
  const tend = arrete ? smooth(Math.max(0, Math.min(1, (frame - FRAME_ARRET) / 26))) : 0;

  return {
    pas, x, scale, arrete, amorti, tend,
    swing: LUI.swing * (0.34 + 0.66 * amorti), // les pas raccourcissent a l'approche
    visible: frame >= T.luiEntre,
  };
};

// ============================================================================================
// ⭐ 5. LA FOULE — sur "ils sont des MILLIONS a faire exactement ca"
// ============================================================================================
// Les passants de fond existent depuis le debut (le marche vit), mais la foule S'EPAISSIT sur le
// mot "millions" : de nouvelles silhouettes entrent en arriere-plan.
const PASSANTS = [
  { x0: -140,  vit: 0.74, sol: SOL_PASSANT_FOND,      versGauche: false, c: 4, op: 0.5, swing: 18, lean: 2, des: 0 },
  { x0: 2180,  vit: 1.32, sol: SOL_PASSANT_FOND - 6,  versGauche: true,  c: 2, op: 0.5, swing: 21, lean: 5, des: 0 },
  // ces 4 n'arrivent qu'avec "millions"
  { x0: -520,  vit: 0.88, sol: SOL_PASSANT_FOND + 8,  versGauche: false, c: 1, op: 0.42, swing: 19, lean: 3, des: 1 },
  { x0: 2320,  vit: 1.05, sol: SOL_PASSANT_FOND - 14, versGauche: true,  c: 3, op: 0.38, swing: 17, lean: 2, des: 1 },
  { x0: -980,  vit: 1.18, sol: SOL_PASSANT_FOND + 2,  versGauche: false, c: 0, op: 0.45, swing: 22, lean: 4, des: 1 },
  { x0: 2560,  vit: 0.69, sol: SOL_PASSANT_FOND + 14, versGauche: true,  c: 2, op: 0.34, swing: 16, lean: 1, des: 1 },
] as const;

const passantAt = (frame: number, i: number) => {
  const P = PASSANTS[i];
  const scale = scaleAt(P.sol);
  const pasL = 2 * LEG_LENGTH * Math.sin(rad(P.swing)) * scale;
  // les tardifs comptent leurs pas depuis LEUR entree, sinon ils apparaitraient deja au milieu
  const t0 = P.des === 1 ? T.fouleArrive : 0;
  const pas = Math.max(0, frame - t0) * (P.vit / FPS);
  const dir = P.versGauche ? -1 : 1;
  const xLocal = P.x0 + dir * pas * pasL;
  const span = 2600;
  const x = dir > 0
    ? ((xLocal + 400) % span + span) % span - 400
    : span - (((span - xLocal + 400) % span + span) % span) - 400;
  const apparu = P.des === 0 ? 1 : clampI(frame, [T.fouleArrive, T.fouleArrive + 30], [0, 1]);
  return { x, pas, scale, swing: P.swing, lean: P.lean, sol: P.sol,
           versGauche: P.versGauche, couleur: CARNATIONS[P.c].couleur, opacity: P.op * apparu };
};

// ============================================================================================
// ⭐ 6. L'EFFACEMENT — sur "et presque rien dans les STATISTIQUES"
// ============================================================================================
// Les gens s'effacent, le marche reste. C'est le propos de la scene tenu en une image : ce qui
// disparait, ce ne sont pas les etals, ce sont les PERSONNES — exactement ce que dit la voix.
const effacementAt = (frame: number) =>
  1 - clampI(frame, [T.effacement, T.effacement + 62], [0, 1]) * 0.88;

// ============================================================================================
// LA PLAQUE SOURCE — bas d'ecran, reserve aux SOURCES (jamais de sous-titre ici)
// ============================================================================================
// Format maison : "Nom source, perimetre", SANS le mot "Source:".
const PlaqueSource: React.FC<{ k: number }> = ({ k }) => {
  if (k < 0.02) return null;
  return (
    <g opacity={k} transform="translate(1560 1012)">
      <rect x={-236} y={-26} width={340} height={38} rx={5}
            fill="#101a2e" opacity={0.82} stroke="#c17e3a" strokeWidth={1.1} />
      <text x={-220} y={0} fill="#e6dcc2" fontFamily="Georgia, serif" fontSize={19}>
        OIT, Afrique de l&apos;Ouest
      </text>
    </g>
  );
};

// --------------------------------------------------------------------------------------------
export const MarcheInformel16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const elle = elleAt(frame);
  const lui = luiAt(frame, elle.x); // ⛔ il s'arrete PAR RAPPORT A ELLE, pas a une abscisse fixe

  // le decor s'ecrit entre "n'existe" et "officiellement"
  const traceDecor = clampI(frame, [T.marcheSecrit, T.marchePose], [0, 1]);
  const decorEcrit = traceDecor >= 1;
  const opGens = effacementAt(frame);
  // la plaque source arrive avec le chiffre dit ("neuf emplois sur dix") et reste
  const kPlaque = clampI(frame, [T.effacement - 96, T.effacement - 66], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a2238" }}>
      <Audio src={staticFile("_rnd/stick-figures/marche-informel/narration.mp3")} />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />

        {/* le ciel est la des le debut : c'est la NUIT qui accueille, le marche qui s'ecrit */}
        <g dangerouslySetInnerHTML={{ __html: PLAN_CIEL }} />

        {/* ===== LE DECOR — il se REVELE par balayage sur "n'existe pas" ===== */}
        {/* Le masque : un rectangle blanc qui s'elargit = la partie visible. Bord adouci par un
            degrade, sinon la limite se lit comme une barre verticale qui glisse. */}
        <defs>
          <linearGradient id={`${REVEAL_ID}-grad`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity={1} />
            <stop offset="82%" stopColor="#fff" stopOpacity={1} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <mask id={REVEAL_ID}>
            <rect x={0} y={0} width={W * traceDecor * 1.12} height={H} fill={`url(#${REVEAL_ID}-grad)`} />
          </mask>
        </defs>

        <g mask={decorEcrit ? undefined : `url(#${REVEAL_ID})`}>
          <g dangerouslySetInnerHTML={{ __html: PLAN_VILLE }} />
          <g dangerouslySetInnerHTML={{ __html: PLAN_ETALS_FOND }} />
        </g>

        {/* passants du fond, en silhouette derriere les etals.
            ⛔ DEFAUT VU AU RENDU v2 : ils marchaient dans le VIDE sur la partie du decor pas
            encore revelee (le balayage l'a rendu visible ; le faux "trace" de la v1 le masquait).
            ⭐ On leur applique LE MEME MASQUE qu'au decor : un personnage ne peut pas exister
            avant le lieu qui le porte. */}
        <g opacity={opGens} mask={decorEcrit ? undefined : `url(#${REVEAL_ID})`}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const p = passantAt(frame, i);
            if (p.opacity < 0.02) return null;
            return (
              <g key={`f${i}`} opacity={p.opacity}
                 transform={`translate(${p.x} ${p.sol}) scale(${p.versGauche ? -p.scale : p.scale} ${p.scale})`}>
                <Figure
                  x={0} y={0} phase={walkPhaseFromSteps(p.pas)}
                  p={{ swingMax: p.swing, bobAmp: 2.2, armSwing: 15 + p.swing * 0.3, lean: p.lean }}
                  color={p.couleur}
                />
              </g>
            );
          })}
        </g>

        <g mask={decorEcrit ? undefined : `url(#${REVEAL_ID})`}
           dangerouslySetInnerHTML={{ __html: PLAN_ETALS }} />

        {/* ===== LES MARCHANDS — DE FACE, ils helent quand la voix les nomme ===== */}
        <g opacity={opGens}>
          {ETALS_X.map((ex, i) => {
            const m = marchandAt(frame, i);
            const s = scaleAt(SOL_MARCHAND);
            const fp = facePose(m);
            // ⛔ apparition liee au decor : ils ne peuvent pas exister avant leur etal
            const k = clampI(frame, [T.marchePose - 20, T.marchePose + 16], [0, 1]);
            if (k < 0.02) return null;
            return (
              <g key={`m${i}`} opacity={k}
                 transform={`translate(${ex - 40} ${SOL_MARCHAND}) scale(${s})`}>
                <FigureFace
                  x={0} y={0}
                  color={CARNATIONS[MARCHANDS[i].carnation].couleur}
                  pose={fp}
                />
                <RoleTenue role={MARCHANDS[i].role} bp={faceBodyPoints(fp)} />
              </g>
            );
          })}
        </g>

        <g mask={decorEcrit ? undefined : `url(#${REVEAL_ID})`}
           dangerouslySetInnerHTML={{ __html: PLAN_SOL }} />

        {/* ===== LUI — entre par la droite sur "Lui, il achete" ===== */}
        {lui.visible && (
          <g opacity={opGens}>
            <g transform={`translate(${lui.x} ${LUI.sol}) scale(${-lui.scale} ${lui.scale})`}>
              <PersonnageRole
                x={0} y={0} phase={walkPhaseFromSteps(lui.pas)} scale={1}
                role={LUI.role}
                couleur={CARNATIONS[LUI.carnation].couleur}
                p={{ swingMax: lui.swing, bobAmp: 2.5 * (0.4 + 0.6 * lui.amorti),
                     armSwing: 15 + lui.swing * 0.35, lean: 4 * lui.amorti }}
                pose={{
                  torsoDeg: 8 - 4 * (1 - lui.amorti),
                  // ⭐ IL TEND LA MAIN une fois arrive. hand1 = cible MONDE, le coude se resout
                  // en IK. ⚠️ On vise ~89% de la portee (BRAS_L+AVBRAS_L = 30.5), JAMAIS la butee :
                  // un bras en butee ne tient pas sa pose, il glisse au moindre bob (regle gravee).
                  ...(lui.tend > 0.01
                    ? { hand1: [lui.tend * 19, HIP_Y_STANDING - 17 + lui.tend * 2] as [number, number] }
                    : {}),
                }}
                avecObjet={false}
              />
            </g>
          </g>
        )}

        {/* ===== ELLE — elle s'ECRIT sur son nom, puis elle marche =====
            La bascule trace -> anime est invisible parce que les deux poses sont IDENTIQUES a
            l'instant du raccord : les coordonnees du trace sont CALCULEES avec les formules du
            socle (bobAmp=0 des deux cotes), jamais dessinees a la main. */}
        {frame >= T.elleEntre && (
          <g opacity={opGens}>
            <g transform={`translate(${elle.x} ${ELLE.sol}) scale(${elle.scale})`}>
              {elle.trace < 1 ? (
                // ⛔ DEFAUT DE LA v1, VU AU RENDU : pendant tout son trace, Elle etait une stick
                // figure NUE au milieu de personnages habilles — exactement le defaut deja
                // signale par Aziz sur la scene precedente ("les marchands etaient redevenus des
                // stick figures nues a cote de passants habilles").
                // ⭐ FIX : le SQUELETTE s'ecrit d'abord (c'est le geste narratif : la voix la
                // nomme, l'image l'ecrit), puis sa TENUE se fond par-dessus sur la fin du trace.
                // Elle n'est donc jamais nue une fois entierement dessinee.
                <>
                  <g
                    fill="none"
                    stroke={CARNATIONS[ELLE.carnation].couleur}
                    strokeWidth={4.5}
                    strokeLinecap="round"
                    strokeDasharray={`${DASH}`}
                    strokeDashoffset={(1 - elle.trace) * DASH}
                    opacity={Math.min(1, elle.trace * 2.5)}
                  >
                    <path d={`M 0 ${HIP_Y_STANDING} L ${P0.j1x} 0`} />
                    <path d={`M 0 ${HIP_Y_STANDING} L ${P0.j2x} 0`} />
                    <path d={`M 0 ${HIP_Y_STANDING} L ${P0.sx} ${P0.sy}`} />
                    <path d={`M ${P0.sx} ${P0.sy} L ${P0.b1x} ${P0.b1y}`} />
                    <path d={`M ${P0.sx} ${P0.sy} L ${P0.b2x} ${P0.b2y}`} />
                    <circle cx={P0.hcx} cy={P0.hcy} r={9} />
                  </g>
                  {/* la tenue arrive sur le dernier tiers du trace — bp derive des MEMES
                      constantes que le trace (P0), donc elle tombe pile sur le corps */}
                  <g opacity={clampI(elle.trace, [0.62, 1], [0, 1])}>
                    <RoleTenue
                      role={ELLE.role}
                      bp={{
                        hx: 0, hy: HIP_Y_STANDING,
                        sx: P0.sx, sy: P0.sy,
                        headCx: P0.hcx, headCy: P0.hcy,
                        torso: POSE0.torso,
                      }}
                    />
                  </g>
                </>
              ) : (
                <PersonnageRole
                  x={0} y={0}
                  phase={elle.marche ? walkPhaseFromSteps(elle.pas) : 0}
                  scale={1}
                  role={ELLE.role}
                  couleur={CARNATIONS[ELLE.carnation].couleur}
                  p={elle.marche
                    ? { swingMax: ELLE.swing, bobAmp: 2.5, armSwing: 21 }
                    : { swingMax: 0, bobAmp: 0, armSwing: 0 }}
                  pose={elle.marche
                    ? { torsoDeg: 4 }
                    : { torsoDeg: POSE0.torso, leg1Deg: POSE0.leg1, leg2Deg: POSE0.leg2,
                        arm1Deg: POSE0.arm1, arm2Deg: POSE0.arm2 }}
                  avecObjet={false}
                />
              )}
            </g>
          </g>
        )}

        <g mask={decorEcrit ? undefined : `url(#${REVEAL_ID})`}
           dangerouslySetInnerHTML={{ __html: PLAN_AVANT }} />

        <PlaqueSource k={kPlaque} />
      </svg>
    </AbsoluteFill>
  );
};

export { MARCHE_INFORMEL_FRAMES };
export default MarcheInformel16x9;
