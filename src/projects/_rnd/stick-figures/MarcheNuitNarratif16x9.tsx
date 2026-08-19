import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
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
  walkPhaseFromSteps,
} from "../../_shared/stick-figure-svg/StickFigure";
import { PersonnageRole, RoleTenue, CARNATIONS } from "../../_shared/stick-figure-svg/identite/Roles";

/**
 * "LE MARCHE DE NUIT" — VERSION NARRATIVE (2026-07-28)
 *
 * 3 ajouts demandes par Aziz, testes ENSEMBLE pour voir si l'ensemble tient :
 *
 * 1. ⭐ LES MARCHANDS SONT DE FACE. Le registre interdit la face EN MOUVEMENT (de face une stick
 *    figure ne peut que glisser) mais l'admet pour l'IMMOBILE — c'est exactement leur cas. Ils
 *    font desormais face a la rue au lieu de tourner le dos a la moitie des passants.
 *    Socle : <FigureFace>, acquis de GroupeFoule16x9.
 *
 * 2. ⭐ L'APPARITION DESSINEE. Un personnage CLE se trace trait par trait a son entree, puis part
 *    en marche. Technique : `strokeDashoffset` (fiche `svg-library/techniques/strokeDashoffset-
 *    drawing.md`). ⚠️ DASH sur-dimensionne, JAMAIS `getTotalLength` — piege deja grave :
 *    l'heuristique de longueur de path n'est jamais fiable.
 *    ⚠️ UN SEUL personnage se dessine : si tous le faisaient, l'effet ne designerait plus personne.
 *
 * 3. ⭐ LES BULLES. ⛔ REGLE MAINTENUE : une bulle ne doit JAMAIS repeter ce que dirait la voix
 *    off (doublon = anti-pattern grave). Ici elles portent l'AMBIANCE SONORE du lieu — les cris
 *    des marchands — soit precisement ce qu'une voix off narrative ne dit pas. Elles sont courtes,
 *    apparaissent AVEC le geste de heler, et disparaissent avec lui.
 *
 * ⛔ Registre : aucun visage, socle IMPORTE, frame-driven pur.
 */

export const MARCHE_NARRATIF_FRAMES = 660; // 22s @ 30fps

const W = 1920;
const H = 1080;
const INK = "#12100c";

const ETALS_X = [240, 908, 1580];
const SOL_MARCHAND = 768;
const SOL_PASSANT_FOND = 762;
const SOL_PASSANT_AVANT = 946;

// PERSPECTIVE UNIQUE — la taille DERIVE de la profondeur (cf. 17e piege : regler les scales
// a l'oeil produit des marchands geants au fond).
const Y_HORIZON = 700;
const Y_PROCHE = 1000;
const scaleAt = (solY: number) => {
  const t = Math.max(0, Math.min(1, (solY - Y_HORIZON) / (Y_PROCHE - Y_HORIZON)));
  return 1.35 + (2.3 - 1.35) * t;
};

const smooth = (t: number) => t * t * (3 - 2 * t);
const clampI = (f: number, i: [number, number], o: [number, number]) =>
  interpolate(f, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ===========================================================================
// LES MARCHANDS — DE FACE, immobiles, ils helent
// ===========================================================================
const PHI = 1.618033988;
const E = 2.718281828;
const SQRT2 = 1.414213562;
const DESYNC = [0, PHI, E];
const PERIODE = [196, 232, 214];

const MARCHANDS = [
  { role: "commercante" as const, carnation: 2, actif: true, cri: "Tomates fraiches !" },
  { role: "agriculteur" as const, carnation: 4, actif: true, cri: "Deux pour cent francs !" },
  { role: "fonctionnaire" as const, carnation: 1, actif: false, cri: "" },
];

const marchandAt = (frame: number, i: number) => {
  const p = PERIODE[i];
  const actif = MARCHANDS[i].actif;
  const t = ((frame + DESYNC[i] * 61) % p) / p;

  let leve = 0;   // 0..1 : a quel point le bras est leve
  if (t < 0.12) leve = smooth(t / 0.12);
  else if (t < 0.34) leve = 1;
  else if (t < 0.46) leve = 1 - smooth((t - 0.34) / 0.12);
  if (!actif) leve = 0;

  // l'agitation du bras pendant qu'il est en haut
  const agite = t >= 0.12 && t < 0.34 ? Math.sin(((t - 0.12) / 0.22) * Math.PI * 5) : 0;

  // ⭐ TRANSFERT DE POIDS lent (periode irrationnelle par marchand) : c'est ce qui evite le
  // fige-net SANS produire le bobbing rejete en vague D. Un transfert deplace le centre de
  // gravite, une respiration ne fait que vibrer.
  const appui = Math.sin((frame / (188 + i * 31)) * Math.PI * 2 + i * SQRT2);

  return { leve, agite, appui, crie: leve > 0.55 };
};

// La pose de face d'un marchand, derivee de son etat
const facePose = (m: ReturnType<typeof marchandAt>) => ({
  hipY: HIP_Y_STANDING + Math.abs(m.appui) * 0.7,
  // le buste s'incline LEGEREMENT du cote du poids : c'est le transfert d'appui
  torsoLean: m.appui * 2.2,
  headLean: m.appui * 1.4 + m.leve * 2,
  // ⭐ LE BRAS QUI HELE — convention FigureFace : 0 = pend, + = s'ecarte.
  arm1Deg: 4 + m.appui * 2,
  arm2Deg: m.leve * (118 + m.agite * 16),
  legSpread: 7,
  weightShift: m.appui,
});

// Conversion pose-de-face -> BodyPoints, avec les MEMES formules que <FigureFace> (StickFigure.tsx).
// C'est ce qui garantit que la tenue tombe exactement sur le corps, sans decalage.
const faceBodyPoints = (fp: ReturnType<typeof facePose>) => {
  const hx = fp.weightShift * 3;
  const hy = fp.hipY;
  const sx = hx + Math.sin(rad(fp.torsoLean)) * 32;
  const sy = hy - Math.cos(rad(fp.torsoLean)) * 32;
  return {
    hx, hy, sx, sy,
    headCx: sx + Math.sin(rad(fp.torsoLean + fp.headLean)) * 12,
    headCy: sy - Math.cos(rad(fp.torsoLean + fp.headLean)) * 12,
    torso: fp.torsoLean,
  };
};

// ===========================================================================
// LA BULLE — legere, sans portrait, ancree au-dessus du marchand
// ===========================================================================
// ⛔ Volontairement MINIMALE : pas de composant SpeechBubble existant ici, il est concu pour un
// portrait plein cadre (registre "citation"), pas pour une bulle d'ambiance de 3 mots.
const Bulle: React.FC<{ x: number; y: number; texte: string; k: number }> = ({ x, y, texte, k }) => {
  if (k < 0.02) return null;
  const w = 20 + texte.length * 10.5;
  const h = 46;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * k})`} opacity={k}>
      <path
        d={`M ${-w / 2} ${-h} h ${w} a 8 8 0 0 1 8 8 v ${h - 22} a 8 8 0 0 1 -8 8 h ${-w / 2 + 10}
            l -9 13 l -3 -13 h ${-w / 2 + 2} a 8 8 0 0 1 -8 -8 v ${-h + 22} a 8 8 0 0 1 8 -8 z`}
        fill="#f0e4cc" stroke={INK} strokeWidth={2} strokeLinejoin="round"
      />
      <text
        x={4} y={-h + 30} textAnchor="middle"
        fill={INK} fontFamily="Georgia, serif" fontSize={21} fontStyle="italic"
      >
        {texte}
      </text>
    </g>
  );
};

// ===========================================================================
// LES PASSANTS
// ===========================================================================
const PASSANTS = [
  { x0: -140,  vit: 0.74, sol: SOL_PASSANT_FOND,      versGauche: false, c: 4, role: null,          op: 0.5, swing: 18, lean: 2 },
  { x0: 2180,  vit: 1.32, sol: SOL_PASSANT_FOND - 6,  versGauche: true,  c: 2, role: null,          op: 0.5, swing: 21, lean: 5 },
  { x0: -860,  vit: 0.48, sol: SOL_PASSANT_AVANT - 22, versGauche: false, c: 3, role: "agriculteur", op: 1,  swing: 15, lean: 0 },
  { x0: 2260,  vit: 2.05, sol: SOL_PASSANT_AVANT,      versGauche: true,  c: 1, role: "commercante", op: 1,  swing: 24, lean: 8 },
] as const;

const passantAt = (frame: number, i: number) => {
  const P = PASSANTS[i];
  const scale = scaleAt(P.sol);
  const pasL = 2 * LEG_LENGTH * Math.sin(rad(P.swing)) * scale;
  const pas = frame * (P.vit / 30);
  const dir = P.versGauche ? -1 : 1;
  const xLocal = P.x0 + dir * pas * pasL;
  const span = 2600;
  const x = dir > 0
    ? ((xLocal + 400) % span + span) % span - 400
    : span - (((span - xLocal + 400) % span + span) % span) - 400;
  return { x, pas, scale, swing: P.swing, lean: P.lean, sol: P.sol,
           versGauche: P.versGauche, couleur: CARNATIONS[P.c].couleur, role: P.role, opacity: P.op };
};

// ===========================================================================
// ⭐ LE PERSONNAGE CLE — il SE DESSINE, puis il marche
// ===========================================================================
// ⚠️ xDepart/vit/part ne sont PAS choisis a l'oeil : balayage sur les 3 parametres pour
// maximiser la distance minimale aux autres passants du 1er plan (resultat : 380px, contre 2px
// au 1er jet ou le perso cle TRAVERSAIT la commercante).
const CLE = {
  apparait: 60,      // debut du trace
  dessine: 170,      // fin du trace : le corps est complet
  part: 280,         // il se met en marche
  sol: SOL_PASSANT_AVANT + 14,
  xDepart: 720,
  vit: 0.5,
  swing: 19,
  carnation: 0,
};

const DASH = 4200;   // sur-dimensionne : couvre toute longueur de path (piege getTotalLength)

// ⭐ LA POSE DE DEPART, derivee des MEMES formules que <Figure> (StickFigure.tsx). C'est ce qui
// garantit que le trace et le personnage anime coincident PIXEL POUR PIXEL au raccord.
// bobAmp = 0 des deux cotes -> la hanche est a HIP_Y_STANDING exactement.
const POSE0 = { leg1: 10, leg2: -12, torso: 4, arm1: 22, arm2: -20 };
const ARM_L = 28;
const P0 = (() => {
  const hy = HIP_Y_STANDING;
  // jambes : le socle adapte la longueur pour que le pied touche le sol (y=0)
  const legLen = (deg: number) => {
    const c = Math.cos(rad(deg));
    return c < 0.2 ? LEG_LENGTH : Math.max(LEG_LENGTH * 0.72, Math.min(LEG_LENGTH * 1.06, -hy / c));
  };
  const j1x = Math.sin(rad(POSE0.leg1)) * legLen(POSE0.leg1);
  const j2x = Math.sin(rad(POSE0.leg2)) * legLen(POSE0.leg2);
  const sx = Math.sin(rad(POSE0.torso)) * 32;
  const sy = hy - Math.cos(rad(POSE0.torso)) * 32;
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

const cleAt = (frame: number) => {
  const scale = scaleAt(CLE.sol);
  // le TRACE : 0 -> 1 pendant la phase de dessin
  const trace = clampI(frame, [CLE.apparait, CLE.dessine], [0, 1]);
  // la MARCHE : ne demarre qu'apres, et le verrou pas/distance s'applique comme pour tous
  const pasL = 2 * LEG_LENGTH * Math.sin(rad(CLE.swing)) * scale;
  const pas = Math.max(0, (frame - CLE.part)) * (CLE.vit / 30);
  const x = CLE.xDepart + pas * pasL;
  return { trace, pas, x, scale, marche: frame >= CLE.part };
};

// ---------------------------------------------------------------------------
export const MarcheNuitNarratif16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const cle = cleAt(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a2238" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />

        <g dangerouslySetInnerHTML={{ __html: PLAN_CIEL }} />
        <g dangerouslySetInnerHTML={{ __html: PLAN_VILLE }} />
        <g dangerouslySetInnerHTML={{ __html: PLAN_ETALS_FOND }} />

        {/* passants du fond, en silhouette derriere les etals */}
        {[0, 1].map((i) => {
          const p = passantAt(frame, i);
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

        <g dangerouslySetInnerHTML={{ __html: PLAN_ETALS }} />

        {/* ===== LES MARCHANDS — DE FACE, derriere leur comptoir ===== */}
        {ETALS_X.map((ex, i) => {
          const m = marchandAt(frame, i);
          const s = scaleAt(SOL_MARCHAND);
          return (
            <g key={`m${i}`} transform={`translate(${ex - 40} ${SOL_MARCHAND}) scale(${s})`}>
              {/* ⛔ DEFAUT DU 1er JET : <FigureFace> ne connait pas les roles, donc les marchands
                  etaient redevenus des stick figures NUES a cote de passants habilles — le defaut
                  qu'Aziz avait justement demande de corriger.
                  ⭐ FIX : `RoleTenue` ne prend que des BodyPoints (hanche/epaule/tete/angle). On
                  calcule donc les points DE FACE avec les memes formules que <FigureFace> et on
                  lui applique la tenue par-dessus. La tenue est agnostique a la vue. */}
              <FigureFace
                x={0} y={0}
                color={CARNATIONS[MARCHANDS[i].carnation].couleur}
                pose={facePose(m)}
              />
              <RoleTenue
                role={MARCHANDS[i].role}
                bp={faceBodyPoints(facePose(m))}
              />
            </g>
          );
        })}

        <g dangerouslySetInnerHTML={{ __html: PLAN_SOL }} />

        {/* ===== LES BULLES — au-dessus des marchands, avec le geste ===== */}
        {ETALS_X.map((ex, i) => {
          const m = marchandAt(frame, i);
          if (!MARCHANDS[i].cri) return null;
          // la bulle suit le GESTE : elle apparait quand le bras est haut, disparait avec lui
          const k = clampI(m.leve, [0.55, 0.95], [0, 1]);
          return (
            <Bulle key={`b${i}`} x={ex + 78} y={632} texte={MARCHANDS[i].cri} k={k} />
          );
        })}

        {/* ===== LES PASSANTS DE DEVANT ===== */}
        {[2, 3].map((i) => {
          const p = passantAt(frame, i);
          return (
            <g key={`a${i}`} transform={`translate(${p.x} ${p.sol}) scale(${p.versGauche ? -p.scale : p.scale} ${p.scale})`}>
              <PersonnageRole
                x={0} y={0} phase={walkPhaseFromSteps(p.pas)} scale={1}
                role={p.role!}
                couleur={p.couleur}
                p={{ swingMax: p.swing, bobAmp: 2.5, armSwing: 15 + p.swing * 0.35, lean: p.lean }}
                pose={{ torsoDeg: 4 + p.lean }}
                avecObjet={false}
              />
            </g>
          );
        })}

        {/* ===== ⭐ LE PERSONNAGE CLE — il se DESSINE, puis il marche =====
            Le trace se fait par strokeDashoffset sur un calque de traits qui EPOUSE la pose
            de depart. Une fois le trace acheve, on bascule sur le vrai <Figure> anime : le
            dessin n'est PAS anime, il ne fait qu'apparaitre — c'est la bascule qui doit etre
            invisible, donc les deux poses sont IDENTIQUES a l'instant du raccord. */}
        {frame >= CLE.apparait && (
          <g transform={`translate(${cle.x} ${CLE.sol}) scale(${cle.scale})`}>
            {cle.trace < 1 ? (
              // PHASE 1 — le corps s'ecrit trait par trait
              <g
                fill="none"
                stroke={CARNATIONS[CLE.carnation].couleur}
                strokeWidth={4.5}
                strokeLinecap="round"
                strokeDasharray={`${DASH}`}
                strokeDashoffset={(1 - cle.trace) * DASH}
                opacity={Math.min(1, cle.trace * 2.5)}
              >
                {/* ⛔ COORDONNEES CALCULEES, PAS DESSINEES A LA MAIN. Mesure du 1er jet : mon
                    trace code "au jugé" tombait 2.5 unites au-dessus du corps du socle (qui
                    applique son bob meme a phase 0), et ses pieds a y=5 au lieu de 0 -> le
                    personnage aurait SAUTE au moment du raccord trace->anime.
                    ⭐ REGLE : quand deux representations d'un meme objet doivent se raccorder,
                    elles doivent partager la MEME SOURCE GEOMETRIQUE. On derive donc les points
                    du trace des memes constantes que <Figure>, avec bobAmp=0 des deux cotes. */}
                <path d={`M 0 ${HIP_Y_STANDING} L ${P0.j1x} 0`} />
                <path d={`M 0 ${HIP_Y_STANDING} L ${P0.j2x} 0`} />
                <path d={`M 0 ${HIP_Y_STANDING} L ${P0.sx} ${P0.sy}`} />
                <path d={`M ${P0.sx} ${P0.sy} L ${P0.b1x} ${P0.b1y}`} />
                <path d={`M ${P0.sx} ${P0.sy} L ${P0.b2x} ${P0.b2y}`} />
                <circle cx={P0.hcx} cy={P0.hcy} r={9} />
              </g>
            ) : (
              // PHASE 2 — le vrai personnage anime prend le relais
              <Figure
                x={0} y={0}
                phase={cle.marche ? walkPhaseFromSteps(cle.pas) : 0}
                p={cle.marche
                  ? { swingMax: CLE.swing, bobAmp: 2.5, armSwing: 21 }
                  : { swingMax: 0, bobAmp: 0, armSwing: 0 }}
                color={CARNATIONS[CLE.carnation].couleur}
                pose={cle.marche
                  ? { torsoDeg: 4 }
                  : { torsoDeg: POSE0.torso, leg1Deg: POSE0.leg1, leg2Deg: POSE0.leg2,
                      arm1Deg: POSE0.arm1, arm2Deg: POSE0.arm2 }}
              />
            )}
          </g>
        )}

        <g dangerouslySetInnerHTML={{ __html: PLAN_AVANT }} />
      </svg>
    </AbsoluteFill>
  );
};

export default MarcheNuitNarratif16x9;
