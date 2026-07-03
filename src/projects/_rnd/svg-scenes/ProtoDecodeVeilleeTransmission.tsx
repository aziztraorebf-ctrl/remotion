/**
 * PROTOTYPE — "La veillee de la transmission" (registre decode/historique, sujet GENERIQUE — pas un
 * episode precis deja livre : ni Mansa Moussa, ni Empire du Ghana, ni Thiaroye, ni Peste 1347, ni
 * Hannibal, ni Shaka Zulu, ni Yaa Asantewaa). Un aine transmet un objet symbolique a un jeune, la nuit,
 * pres d'un feu. Teste PLUSIEURS briques du catalogue dans UNE scene continue :
 *   1. immobile-contemplatif (aine assis, respiration/regard, formule reprise de ProtoGeminiContemplatif)
 *   2. l'aine SE LEVE puis MARCHE (cycle walk-a/b repris tel quel de ProtoGeminiPoseBankWalk/BendPickup)
 *   3. offer/handoff (transfert d'objet main-a-main, formule + machine a etats reprises de
 *      ProtoGeminiHandoff.tsx — objet colle a la main REELLE, point de contact FIGE au HOLD)
 *   4. changement d'orientation en cours de plan : le jeune commence DOS ACTIF (silhouette de dos face
 *      au feu, cf. doctrine MISE-EN-SCENE-INFOGRAPHICS-SHOW "dos = encadrement solennel"), puis se
 *      retourne en 3/4 au moment du contact (registre dialogue/action, cf. meme doctrine "3/4 = defaut
 *      action humaine"). Le dos est simule ici en SILHOUETTE SIMPLIFIEE (buste sombre, pas de rig de
 *      jambes) — le jeune ne MARCHE jamais de dos, seulement assis puis debout sur place, donc pas
 *      concerne par la regle pro "pas de jambes dos/face a petite echelle" (aucune marche en dos ici).
 *   5. dolly-in simule : le groupe SVG entier grossit legerement (scale progressif, PAS de camera
 *      Remotion/CSS transform hors-rig) pour resserrer le cadre sur le moment de contact — technique
 *      econome "master shot" (un seul plan, le mouvement de cadre remplace un cut).
 *   6. decor qui VIT en continu (etoiles qui scintillent + feu qui vacille + fumee qui monte) pendant
 *      que les personnages sont quasi statiques — technique econome SimpleHistory (l'energie visuelle
 *      vient du decor, pas du corps qui bouge, cf. doctrine).
 *
 * Aucune nouvelle mecanique de membre inventee : marche = ProtoGeminiPoseBankWalk/BendPickup tel quel,
 * offer/handoff = ProtoGeminiHandoff tel quel (angles OFFER, computeFrontHandScene, point de contact
 * fige a fHold). Nouveaute reelle : (a) l'assis->debout (nouvelle pose, transition courte), (b) le
 * dos-actif du jeune (silhouette simplifiee, pas de rig complet — pas de marche en dos donc pas de
 * risque de jambes illisibles), (c) le dolly-in par scale de groupe, (d) le decor vivant (etoiles/feu).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const NIGHT_TOP = "#0d1b2a";
const NIGHT_BOTTOM = "#1b2a3f";
const INK = "#1A1A1A";

type LimbAngles = {
  torsoTilt: number;
  headTilt: number;
  hipXOffset: number; hipYOffset: number;
  armUpperFront: number; armLowerFront: number;
  armUpperBack: number; armLowerBack: number;
  legUpperFront: number; legLowerFront: number; footFront: number;
  legUpperBack: number; legLowerBack: number; footBack: number;
};

const BASE_HIP_Y = 340;

// ---- poses reprises telles quelles (ProtoGeminiHandoff / ProtoGeminiBendPickup) ----
const IDLE: LimbAngles = {
  torsoTilt: 0, headTilt: 0, hipXOffset: 0, hipYOffset: 0,
  armUpperFront: -5, armLowerFront: -5,
  armUpperBack: 5, armLowerBack: 5,
  legUpperFront: 0, legLowerFront: 0, footFront: 0,
  legUpperBack: 0, legLowerBack: 0, footBack: 0,
};
const WALK_A: LimbAngles = {
  torsoTilt: 0, headTilt: 0, hipXOffset: 0, hipYOffset: 0,
  armUpperFront: -45, armLowerFront: -15,
  armUpperBack: 45, armLowerBack: -15,
  legUpperFront: -35, legLowerFront: 50, footFront: 0,
  legUpperBack: 30, legLowerBack: 20, footBack: 0,
};
const WALK_B: LimbAngles = {
  torsoTilt: 0, headTilt: 0, hipXOffset: 0, hipYOffset: 0,
  armUpperFront: 45, armLowerFront: -15,
  armUpperBack: -45, armLowerBack: -15,
  legUpperFront: 30, legLowerFront: 20, footFront: 0,
  legUpperBack: -35, legLowerBack: 50, footBack: 0,
};
// OFFER — repris tel quel de ProtoGeminiOfferScene/ProtoGeminiHandoff (bras tendu horizontal, deja valide)
const OFFER: LimbAngles = {
  torsoTilt: 0, headTilt: 0, hipXOffset: 0, hipYOffset: 0,
  armUpperFront: -85, armLowerFront: 0,
  armUpperBack: 10, armLowerBack: -5,
  legUpperFront: 0, legLowerFront: 0, footFront: 0,
  legUpperBack: 0, legLowerBack: 0, footBack: 0,
};
// ASSIS — nouvelle pose (nouveaute reelle de ce proto). Angles VERIFIES par calcul trigonometrique
// EXACT de la matrice rotate() SVG (x'=x*cos(a)-y*sin(a), y'=x*sin(a)+y*cos(a) — deg positif =
// clockwise, y vers le bas) : genou = rot(0,110,upper), pied = genou + rot(0,90,upper+lower).
// upper=-85 -> genou VERS L'AVANT (x=+110, y=+10, a peine plus bas que la hanche) ; lower=+90
// (relatif) -> mollet REDESCEND a la verticale, pied au sol a (+102,+99) juste devant la hanche.
// La jambe EST correcte isolement (verifie sur un SVG standalone, rsvg-convert) — le vrai bug qui
// rendait la silhouette illisible etait ailleurs : les BRAS gardaient l'angle "pend le long du
// corps debout" (armUpperFront=-12, quasi vertical) alors que la hanche a translate de +90 vers le
// bas — le bras pendant descend alors PAR-DESSUS la cuisse repliee et la masque visuellement,
// silhouette confuse "bras et jambe superposes". Fix : bras reposant sur les genoux (avant-bras
// pres du genou avant, calcule comme la jambe : upper=-70, lower=10 -> main relative epaule
// (158,44), soit relative hanche (158,-91) = pres du dessus du genou, PAS le long du corps).
const ASSIS: LimbAngles = {
  torsoTilt: 0, headTilt: -6, hipXOffset: -10, hipYOffset: 90,
  armUpperFront: -70, armLowerFront: 10,
  armUpperBack: -60, armLowerBack: 5,
  legUpperFront: -85, legLowerFront: 90, footFront: 0,
  legUpperBack: -80, legLowerBack: 86, footBack: 0,
};

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerpAngles(a: LimbAngles, b: LimbAngles, t: number): LimbAngles {
  const out: Partial<LimbAngles> = {};
  (Object.keys(a) as (keyof LimbAngles)[]).forEach((k) => { out[k] = lerp(a[k], b[k], t); });
  return out as LimbAngles;
}
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const LegFront = ({ upper, lower, foot }: { upper: number; lower: number; foot: number }) => (
  <g transform={`rotate(${upper})`}>
    <path d="M -13,0 L 13,0 L 10,110 L -10,110 Z" fill="#2F4F4F" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, 110) rotate(${lower})`}>
      <path d="M -10,0 L 10,0 L 7,90 L -7,90 Z" fill="#2F4F4F" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <g transform={`translate(0, 90) rotate(${foot})`}>
        <path
          d="M -7,0 L 7,0 L 9,8 L 22,12 C 24,13 24,16 22,16 L -9,16 C -11,16 -11,12 -9,8 Z"
          fill="#8B5A2B" stroke={INK} strokeWidth={4} strokeLinejoin="round"
        />
        <path d="M -11,16 L 24,16 L 24,20 L -11,20 Z" fill="#3E2723" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  </g>
);

const ArmFree = ({ upper, lower }: { upper: number; lower: number }) => (
  <g transform={`rotate(${upper})`}>
    <path d="M -7,40 L 7,40 L 6,90 L -6,90 Z" fill="#8B5A2B" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -12,0 L 12,0 L 14,45 L -14,45 Z" fill="#6b3f2a" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, 90) rotate(${lower})`}>
      <path d="M -6,0 L 6,0 L 5,75 L -5,75 Z" fill="#8B5A2B" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <g transform="translate(0, 75)">
        <circle cx={0} cy={10} r={12} fill="#8B5A2B" stroke={INK} strokeWidth={4} />
      </g>
    </g>
  </g>
);

// Rig partage AINE/JEUNE-3quarter. Meme construction que ProtoGeminiBendPickup : groupe HANCHE ne
// fait que translate(), un sous-groupe SEPARE applique rotate(torsoTilt) au torse/bras/tete
// uniquement — les jambes restent enfants directs du groupe hanche.
// facing=1 -> regarde/marche vers la droite (aine). facing=-1 -> scale(-1,1), tout le rig se
// reflechit horizontalement (le jeune regarde vers la gauche, donc vers l'aine — son bras "avant"
// pointe alors a gauche automatiquement, sans recalculer d'angle separe). MEME principe que
// ProtoGeminiHandoff.GeminiRig — bug corrige ici : le 1er jet reutilisait ce rig SANS facing pour
// le jeune, les deux personnages tendaient donc le bras dans la MEME direction (jeune vers l'exterieur
// du cadre, jamais vers l'aine) au lieu de se faire face au moment du contact.
const AineRig: React.FC<{ a: LimbAngles; x: number; facing?: 1 | -1 }> = ({ a, x, facing = 1 }) => (
  <g transform={`translate(${x + a.hipXOffset * facing}, ${BASE_HIP_Y + a.hipYOffset}) scale(${facing}, 1)`}>
    <g transform={`rotate(${a.legUpperBack})`}>
      <LegFront upper={0} lower={a.legLowerBack} foot={a.footBack} />
    </g>
    <g transform={`rotate(${a.legUpperFront})`}>
      <LegFront upper={0} lower={a.legLowerFront} foot={a.footFront} />
    </g>

    <g transform={`rotate(${a.torsoTilt})`}>
      <g transform={`translate(0, -135) rotate(${a.armUpperBack})`}>
        <ArmFree upper={0} lower={a.armLowerBack} />
      </g>

      <path d="M -20,-135 C -20,-135 -25,-70 -18,0 L 18,0 C 25,-70 20,-135 20,-135 Z" fill="#8a6a4a" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -18,0 L 18,0 L 17,15 L -17,15 Z" fill="#2F4F4F" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <g transform={`translate(0, -135) rotate(${a.headTilt})`}>
        {/* bonnet/coiffe sobre (arrondi), pas le chapeau conique du planteur — differencie l'aine */}
        <path d="M -32,-58 Q 0,-95 32,-58 L 30,-45 Q 0,-58 -30,-45 Z" fill="#e0c98a" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <circle cx={0} cy={-45} r={28} fill="#6b4a30" stroke={INK} strokeWidth={4} />
        <circle cx={12} cy={-50} r={3} fill={INK} />
      </g>

      <g transform="translate(0, -135)">
        <ArmFree upper={a.armUpperFront} lower={a.armLowerFront} />
      </g>
    </g>
  </g>
);

// Position SCENE de la main avant (meme calcul trigonometrique que ProtoGeminiHandoff.computeFrontHandScene),
// avec le facing applique (scale(-1,1) reflechit X autour de x=0 local avant translate — meme ordre
// que le rig : translate(x + hipXOffset*facing) scale(facing,1)).
function computeFrontHandScene(a: LimbAngles, x: number, facing: 1 | -1 = 1) {
  const rot = (px: number, py: number, deg: number) => {
    const r = (deg * Math.PI) / 180;
    return [px * Math.cos(r) - py * Math.sin(r), px * Math.sin(r) + py * Math.cos(r)];
  };
  const hipY = BASE_HIP_Y + a.hipYOffset;
  const [sx, sy] = rot(0, -135, a.torsoTilt);
  const shX = sx, shY = hipY + sy;
  const [ux, uy] = rot(0, 90, a.torsoTilt + a.armUpperFront);
  const elbowX = shX + ux, elbowY = shY + uy;
  const [lx, ly] = rot(0, 75, a.torsoTilt + a.armUpperFront + a.armLowerFront);
  const localX = elbowX + lx, localY = elbowY + ly + 10;
  return { x: (x + a.hipXOffset * facing) + localX * facing, y: localY };
}

// ---- Le JEUNE : silhouette DOS ACTIF simplifiee (buste sombre, pas de rig de jambes articule —
// aucune marche en dos ici donc pas concerne par la regle "jambes dos/face illisibles a petite
// echelle" ; il est ASSIS puis DEBOUT SUR PLACE, jamais en deplacement). Se retourne en 3/4 au
// contact : simple crossfade dos -> 3/4 (le rig 3/4 reutilise AineRig avec une palette differente,
// facing miroir vers l'aine).
const JeuneDos: React.FC<{ opacity: number; standT: number }> = ({ opacity, standT }) => {
  // standT: 0 assis de dos, 1 debout de dos (leger redressement du buste, pas de jambes visibles —
  // silhouette assise = ellipse tassee, silhouette debout = ellipse elancee)
  const torsoH = lerp(95, 165, standT);
  const torsoY = lerp(60, -10, standT);
  return (
    <g opacity={opacity}>
      {/* jambes repliees (assis) qui disparaissent progressivement quand standT augmente */}
      <path
        d="M -30,120 Q -55,90 -40,40 L 40,40 Q 55,90 30,120 Z"
        fill="#12202f" opacity={1 - standT * 0.4}
      />
      <ellipse cx={0} cy={torsoY} rx={38} ry={torsoH / 2} fill="#0f1c29" stroke="#060d15" strokeWidth={3} />
      <circle cx={0} cy={torsoY - torsoH / 2 - 22} r={26} fill="#0f1c29" stroke="#060d15" strokeWidth={3} />
    </g>
  );
};

// ---- Decor qui vit : etoiles scintillantes + feu qui vacille + fumee qui monte ----
const Stars: React.FC<{ frame: number }> = ({ frame }) => {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        x: (i * 137) % 1000,
        y: (i * 71) % 260,
        phase: (i * 0.37) % (Math.PI * 2),
        r: 1 + (i % 3) * 0.6,
      })),
    []
  );
  return (
    <>
      {stars.map((s, i) => {
        const tw = 0.5 + 0.5 * Math.sin(frame / 40 + s.phase);
        return <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#f5f0e0" opacity={0.3 + tw * 0.6} />;
      })}
    </>
  );
};

const Campfire: React.FC<{ frame: number; x: number }> = ({ frame, x }) => {
  const flick1 = Math.sin(frame / 4.3) * 4;
  const flick2 = Math.sin(frame / 3.1 + 1.4) * 5;
  const flick3 = Math.sin(frame / 5.7 + 2.1) * 3;
  const smokeY = (frame * 0.6) % 140;
  const smokeOpacity = interpolate(smokeY, [0, 70, 140], [0.35, 0.18, 0]);
  return (
    <g transform={`translate(${x}, 500)`}>
      {/* fumee qui monte, boucle */}
      <ellipse cx={4} cy={-90 - smokeY} rx={14} ry={20} fill="#8a8a8a" opacity={smokeOpacity} />
      <ellipse cx={-2} cy={-60 - smokeY} rx={10} ry={16} fill="#8a8a8a" opacity={smokeOpacity * 0.7} />
      {/* buches */}
      <ellipse cx={0} cy={8} rx={38} ry={9} fill="#3a2416" stroke={INK} strokeWidth={2} />
      <ellipse cx={0} cy={2} rx={30} ry={7} fill="#4a2e1c" stroke={INK} strokeWidth={2} />
      {/* flammes (3 formes qui vacillent independamment) */}
      <path d={`M ${flick1},4 Q ${flick1 - 14},-30 ${flick1},-58 Q ${flick1 + 16},-30 ${flick1},4 Z`} fill="#f2a13c" opacity={0.9} />
      <path d={`M ${flick2 - 10},4 Q ${flick2 - 20},-16 ${flick2 - 8},-34 Q ${flick2},-16 ${flick2 - 10},4 Z`} fill="#f4c15a" opacity={0.85} />
      <path d={`M ${flick3 + 10},4 Q ${flick3 + 2},-18 ${flick3 + 12},-38 Q ${flick3 + 22},-18 ${flick3 + 10},4 Z`} fill="#e8842a" opacity={0.8} />
    </g>
  );
};

const HALF_STEP = 14;
function walkCycle(frame: number, start: number): LimbAngles {
  const cf = frame - start;
  const stepIndex = Math.floor(cf / HALF_STEP);
  const localT = (cf % HALF_STEP) / HALF_STEP;
  const from = stepIndex % 2 === 0 ? WALK_A : WALK_B;
  const to = stepIndex % 2 === 0 ? WALK_B : WALK_A;
  return lerpAngles(from, to, localT);
}

// ---- Timeline ----
const T = {
  fadeEnd: 15,
  // aine assis-contemplatif (boucle respiration) au debut
  contemplStart: 0, contemplEnd: 60,
  // se leve
  standEnd: 90,
  // marche vers le jeune
  walkEnterEnd: 100, walkEnd: 175,
  // s'arrete, tend le bras (offer)
  offerEnd: 205,
  // le jeune se retourne (dos -> 3/4) pendant que l'aine tend le bras
  turnStart: 185, turnEnd: 215,
  // le jeune se leve (assis -> debout) en meme temps qu'il se retourne
  jeuneStandStart: 185, jeuneStandEnd: 218,
  // le jeune tend le bras en miroir (leger decalage, comme ProtoGeminiHandoff)
  jeuneOfferStart: 210, jeuneOfferEnd: 230,
  fHold: 245,
  fRelease: 260,
  retractEnd: 285,
  finalIdleEnd: 320,
};

const AINE_START_X = -260, AINE_STOP_X = 40;
const JEUNE_X = 340;
const DOLLY_START = 175, DOLLY_END = 245; // resserre le cadre pendant l'approche finale + contact

export const PROTO_DECODE_VEILLEE_TRANSMISSION_FRAMES = T.finalIdleEnd + 25;

export const ProtoDecodeVeilleeTransmission: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, T.fadeEnd], [0, 1], { extrapolateRight: "clamp" });

  // ---- Aine : assis-contemplatif -> se leve -> marche -> tend le bras -> retire -> idle ----
  const breathPhase = (frame / 120) * Math.PI * 2;
  const breath = Math.sin(breathPhase);
  const contemplPose: LimbAngles = {
    ...ASSIS,
    torsoTilt: ASSIS.torsoTilt + breath * 1.2,
    headTilt: ASSIS.headTilt + breath * 0.6,
    armUpperFront: ASSIS.armUpperFront + breath * 1.5,
    armUpperBack: ASSIS.armUpperBack - breath * 1.5,
  };

  let aineX = AINE_START_X;
  let aineLimb: LimbAngles;
  let aineLabel = "l'aine, assis, contemple le feu";

  if (frame < T.contemplEnd) {
    aineLimb = contemplPose;
  } else if (frame < T.standEnd) {
    const t = interpolate(frame, [T.contemplEnd, T.standEnd], [0, 1], { extrapolateRight: "clamp" });
    aineLimb = lerpAngles(ASSIS, IDLE, easeInOutCubic(t));
    aineLabel = "il se leve";
  } else if (frame < T.walkEnterEnd) {
    const t = interpolate(frame, [T.standEnd, T.walkEnterEnd], [0, 1], { extrapolateRight: "clamp" });
    aineLimb = lerpAngles(IDLE, WALK_A, easeInOutCubic(t));
    aineLabel = "il s'avance vers le jeune";
  } else if (frame < T.walkEnd) {
    aineLimb = walkCycle(frame, T.walkEnterEnd);
    aineX = interpolate(frame, [T.walkEnterEnd, T.walkEnd], [AINE_START_X, AINE_STOP_X], { extrapolateRight: "clamp" });
    aineLabel = "il s'avance vers le jeune";
  } else if (frame < T.offerEnd) {
    aineX = AINE_STOP_X;
    const t = interpolate(frame, [T.walkEnd, T.offerEnd], [0, 1], { extrapolateRight: "clamp" });
    aineLimb = lerpAngles(IDLE, OFFER, easeInOutCubic(t));
    aineLabel = "il tend l'objet";
  } else if (frame < T.fRelease) {
    aineX = AINE_STOP_X;
    aineLimb = OFFER;
    aineLabel = frame < T.fHold ? "il tend l'objet" : "contact — transmission";
  } else if (frame < T.retractEnd) {
    aineX = AINE_STOP_X;
    const t = interpolate(frame, [T.fRelease, T.retractEnd], [0, 1], { extrapolateRight: "clamp" });
    aineLimb = lerpAngles(OFFER, IDLE, easeInOutCubic(t));
    aineLabel = "il retire le bras";
  } else {
    aineX = AINE_STOP_X;
    aineLimb = IDLE;
    aineLabel = "la transmission est faite";
  }
  // freeze aineX une fois arrive (avant walkEnterEnd on est a AINE_START_X, entre les deux on
  // interpole ci-dessus, apres walkEnd on reste explicitement a AINE_STOP_X)
  if (frame < T.walkEnterEnd) aineX = AINE_START_X;

  // ---- Jeune : dos assis -> se retourne (dos->3/4) + se leve -> tend le bras en miroir ----
  const turnT = interpolate(frame, [T.turnStart, T.turnEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const jeuneStandT = interpolate(frame, [T.jeuneStandStart, T.jeuneStandEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dosOpacity = 1 - easeInOutCubic(turnT);
  const quarterOpacity = easeInOutCubic(turnT);

  let jeuneLimb: LimbAngles = lerpAngles(ASSIS, IDLE, jeuneStandT);
  if (frame >= T.jeuneOfferStart) {
    const t = interpolate(frame, [T.jeuneOfferStart, T.jeuneOfferEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    jeuneLimb = lerpAngles(lerpAngles(ASSIS, IDLE, jeuneStandT), OFFER, easeInOutCubic(t));
  }
  if (frame >= T.fRelease && frame < T.retractEnd) {
    const t = interpolate(frame, [T.fRelease, T.retractEnd], [0, 1], { extrapolateRight: "clamp" });
    jeuneLimb = lerpAngles(OFFER, IDLE, easeInOutCubic(t));
  } else if (frame >= T.retractEnd) {
    jeuneLimb = IDLE;
  }

  // ---- Objet transmis : machine a etats, colle a la main REELLE (jamais de glissade autonome),
  // point de contact FIGE au HOLD (calcule une seule fois, meme principe que ProtoGeminiHandoff).
  // Jeune = facing -1 (miroir, regarde/tend le bras vers la GAUCHE, donc vers l'aine) — BUG corrige
  // ici : le 1er jet appelait computeFrontHandScene sans facing pour le jeune, la main calculee
  // pointait donc vers la DROITE (hors champ), jamais vers le point de contact avec l'aine. ----
  const aineHandNow = computeFrontHandScene(aineLimb, aineX, 1);
  const jeuneHandNow = computeFrontHandScene(jeuneLimb, JEUNE_X, -1);
  const aineHandAtHold = computeFrontHandScene(OFFER, AINE_STOP_X, 1);
  const jeuneHandAtHold = computeFrontHandScene(OFFER, JEUNE_X, -1);
  const contactX = (aineHandAtHold.x + jeuneHandAtHold.x) / 2;
  const contactY = aineHandAtHold.y;

  let objX: number, objY: number;
  if (frame < T.contemplEnd) {
    // avant que l'aine se leve, l'objet est pose au sol pres de lui (pas encore en main)
    objX = AINE_START_X + 40; objY = 480;
  } else if (frame < T.fHold) {
    objX = aineHandNow.x; objY = aineHandNow.y;
  } else if (frame < T.fRelease) {
    objX = contactX; objY = contactY;
  } else {
    objX = jeuneHandNow.x; objY = jeuneHandNow.y;
  }

  // ---- Dolly-in simule : le groupe SVG entier grossit legerement pendant l'approche finale +
  // contact (resserre le cadre sur le moment cle, technique econome "master shot", pas de camera
  // Remotion — juste un scale progressif du groupe racine, autour du point de contact) ----
  const dollyT = interpolate(frame, [DOLLY_START, DOLLY_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dollyScale = 1 + easeInOutCubic(dollyT) * 0.18;
  const dollyOriginX = (AINE_STOP_X + JEUNE_X) / 2;
  const dollyOriginY = 300;

  const objLabel =
    frame < T.contemplEnd ? "" : frame < T.fHold ? "" : frame < T.fRelease ? "TRANSMISSION" : "";

  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ opacity: fade }}>
        <defs>
          <linearGradient id="veillee-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NIGHT_TOP} />
            <stop offset="100%" stopColor={NIGHT_BOTTOM} />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#veillee-sky)" />
        <g transform="translate(460, 40)">
          <Stars frame={frame} />
        </g>
        {/* ligne de sol */}
        <line x1={0} y1={870} x2={1920} y2={870} stroke="#3a4a5c" strokeWidth={2} opacity={0.4} />

        {/* groupe scene : dolly-in applique ICI (scale autour du point de contact) */}
        <g
          transform={`translate(960, 530) scale(${dollyScale}) translate(${-dollyOriginX}, ${-dollyOriginY})`}
        >
          <Campfire frame={frame} x={(AINE_STOP_X + JEUNE_X) / 2} />

          <AineRig a={aineLimb} x={aineX} facing={1} />

          {/* jeune : dos actif (fade out) superpose au 3/4 (fade in), meme position, crossfade au
              moment ou il se retourne. facing=-1 : le jeune regarde/tend le bras vers la GAUCHE
              (vers l'aine) — sans ce miroir les deux persos tendent le bras dans le meme sens et ne
              se rejoignent jamais (bug corrige, voir computeFrontHandScene ci-dessus). */}
          <g transform={`translate(${JEUNE_X}, ${BASE_HIP_Y + 130 - jeuneStandT * 130})`}>
            <JeuneDos opacity={dosOpacity} standT={jeuneStandT} />
          </g>
          <g opacity={quarterOpacity}>
            <AineRig
              a={{ ...jeuneLimb }}
              x={JEUNE_X}
              facing={-1}
            />
          </g>

          {/* objet transmis (petit sceau/collier symbolique) */}
          <ellipse cx={objX} cy={objY} rx={16} ry={12} fill="#c9a24a" stroke={INK} strokeWidth={3} />
        </g>

        {objLabel ? (
          <text x={960} y={140} textAnchor="middle" fontFamily="Georgia, serif" fontSize={30} fill="#e8dcc0" opacity={0.9}>
            {objLabel}
          </text>
        ) : null}

        <text x={960} y={1010} textAnchor="middle" fontFamily="Georgia, serif" fontSize={26} fill="#c9c2ae" opacity={0.85}>
          {aineLabel}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
