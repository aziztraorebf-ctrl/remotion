/**
 * PROTO SOUVERAIN — "La colonne qui part" (exode economique).
 *
 * INTENTION NARRATIVE : faire ressentir le depart force — la main-d'oeuvre qui quitte le village quand
 * la terre/la mine ne nourrit plus, un dernier regard vers ce qu'on laisse derriere soi.
 *
 * POURQUOI CETTE FORME (doctrine memory/doctrines/MISE-EN-SCENE-INFOGRAPHICS-SHOW.md) : la regle par
 * defaut interdit la marche complete en plan large — SAUF quand le deplacement LUI-MEME est le sujet
 * (colonne qui avance, exode). C'est exactement ce cas : la progression EST le message. Marche assumee
 * en plan large, en registre (3 personnages), consciemment CONTRE la regle par defaut mais ALIGNEE avec
 * son exception documentee.
 *
 * CHOREGRAPHIE (15s a 30fps = 450 frames) :
 *   1. [0-90]     Colonne de 3 silhouettes lointaines qui marchent de gauche a droite, registre (meme
 *                 geste decale en phase), echelle ~0.32 -> rig SIMPLIFIE (silhouette pleine + scale&bob,
 *                 PAS de jambes articulees a cette echelle — regle pro dos/face lointain de l'INDEX,
 *                 appliquee ici en profil car meme a cette echelle un cycle de jambes profil se voit,
 *                 mais on reste minimaliste : silhouette pleine, pas de rig complet, pour la lisibilite
 *                 en fond de plan pendant le dolly).
 *   2. [60-260]   DOLLY simule : le viewBox SVG se resserre progressivement (zoom-in) sur le personnage
 *                 de tete de colonne, qui grandit et passe au rig COMPLET (GeminiRig 3/4) des qu'il
 *                 franchit le seuil d'echelle -> transition register->premier plan sans cut.
 *   3. [260-320]  Le personnage de tete s'arrete, SE RETOURNE (changement de vue 3/4 -> DOS en cours de
 *                 plan, cross-fade court entre les 2 representations) pour un dernier regard vers le
 *                 village qu'il quitte (derriere, hors-cadre a gauche).
 *   4. [320-360]  HOLD dos, geste immobile-contemplatif (respiration legere), silhouette du village au
 *                 loin qui pulse doucement (derniere pensee).
 *   5. [360-450]  Se retourne a nouveau (dos -> 3/4), repart en marche, sort du cadre a droite avec le
 *                 reste de la colonne (qui a continue d'avancer en fond pendant la pause).
 *
 * REUTILISATION MECANIQUE (pas de reinvention) :
 *   - Marche (WALK_A/WALK_B, cycle 14f/demi-pas) : copiee telle quelle de ProtoGeminiHandoff/BendPickup.
 *   - Structure GeminiRig (hanche=translate seul, torse=sous-groupe rotate separe des jambes) : copiee
 *     de ProtoGeminiBendPickup (bug "jambes heritent du tilt torse" deja corrige la-bas, applique ici
 *     directement — jambes JAMAIS dans le meme <g> que le rotate(torsoTilt)).
 *   - Immobile-contemplatif (respiration sinusoidale legere) : copie de ProtoGeminiContemplatif.
 *   - Dolly (viewBox qui se resserre en fonction du frame) : nouvelle brique, mais simple interpolate()
 *     sur les 4 nombres du viewBox — aucune dependance externe.
 *   - Silhouette DOS : nouvelle brique minimale (pas de reference rig capsule cote Gemini pour le dos —
 *     comme cueillette-arbre en son temps, conçue de zero mais en respectant la regle documentee :
 *     dos = profondeur sur l'axe Y, piste X quasi fixe, PAS de mecanique laterale reutilisee a tort).
 *
 * BUGS CONNUS A SURVEILLER (documentes dans l'INDEX, verifies ici) :
 *   1. Bras charge qui herite du grand balancier de marche libre -> N/A ici (personnage ne porte rien).
 *   2. Membre qui herite a tort d'une rotation de groupe parent -> jambes du GeminiRig NE SONT PAS dans
 *      le <g rotate(torsoTilt)> (verifie en relisant la structure ci-dessous).
 *   3. Objet invisible par mauvais ordre de calque -> N/A ici (pas d'objet manipule dans cette scene).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const SKY_DAY = "#e8dcc0";
const SKY_DUSK = "#d9c19a";
const INK = "#2b2117";

// ============================================================================
// ANGLES DE POSE — repris tels quels des protos deja valides (aucun angle devine)
// ============================================================================
type LimbAngles = {
  torsoTilt: number;
  headTilt: number;
  hipYOffset: number;
  armUpperFront: number; armLowerFront: number;
  armUpperBack: number; armLowerBack: number;
  legUpperFront: number; legLowerFront: number; footFront: number;
  legUpperBack: number; legLowerBack: number; footBack: number;
};

const IDLE: LimbAngles = {
  torsoTilt: 0, headTilt: 0, hipYOffset: 0,
  armUpperFront: -5, armLowerFront: -5,
  armUpperBack: 5, armLowerBack: 5,
  legUpperFront: 0, legLowerFront: 0, footFront: 0,
  legUpperBack: 0, legLowerBack: 0, footBack: 0,
};
const WALK_A: LimbAngles = {
  torsoTilt: 0, headTilt: 0, hipYOffset: 0,
  armUpperFront: -45, armLowerFront: -15,
  armUpperBack: 45, armLowerBack: -15,
  legUpperFront: -35, legLowerFront: 50, footFront: 0,
  legUpperBack: 30, legLowerBack: 20, footBack: 0,
};
const WALK_B: LimbAngles = {
  torsoTilt: 0, headTilt: 0, hipYOffset: 0,
  armUpperFront: 45, armLowerFront: -15,
  armUpperBack: -45, armLowerBack: -15,
  legUpperFront: 30, legLowerFront: 20, footFront: 0,
  legUpperBack: -35, legLowerBack: 50, footBack: 0,
};
// tete legerement tournee, epaules qui se relachent -- pose "s'arrete, regarde en arriere" (transition
// vers dos), reprend le principe headTilt de ProtoGeminiContemplatif (tete relevee/tournee = -8 a -15)
const LOOKBACK: LimbAngles = {
  torsoTilt: -6, headTilt: -18, hipYOffset: 0,
  armUpperFront: -8, armLowerFront: -5,
  armUpperBack: 8, armLowerBack: 5,
  legUpperFront: 0, legLowerFront: 0, footFront: 0,
  legUpperBack: 0, legLowerBack: 0, footBack: 0,
};

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerpAngles(a: LimbAngles, b: LimbAngles, t: number): LimbAngles {
  const out: Partial<LimbAngles> = {};
  (Object.keys(a) as (keyof LimbAngles)[]).forEach((k) => { out[k] = lerp(a[k], b[k], t); });
  return out as LimbAngles;
}
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

const HALF_STEP = 14;
function walkCycle(frame: number, start: number): LimbAngles {
  const cf = Math.max(0, frame - start);
  const stepIndex = Math.floor(cf / HALF_STEP);
  const localT = (cf % HALF_STEP) / HALF_STEP;
  const from = stepIndex % 2 === 0 ? WALK_A : WALK_B;
  const to = stepIndex % 2 === 0 ? WALK_B : WALK_A;
  return lerpAngles(from, to, localT);
}

// ============================================================================
// RIG COMPLET (3/4 stylise) — structure copiee de ProtoGeminiBendPickup :
// le groupe HANCHE ne fait que TRANSLATE (pas de rotate) ; un SOUS-GROUPE separe
// applique rotate(torsoTilt) a torse+bras+tete SEULEMENT. Les jambes restent enfants
// directs du groupe hanche -> ne pivotent JAMAIS avec le torse (bug deja documente,
// verifie ici en relisant la hierarchie ci-dessous).
// ============================================================================
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
    <path d="M -12,0 L 12,0 L 14,45 L -14,45 Z" fill="#FFFDD0" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, 90) rotate(${lower})`}>
      <path d="M -6,0 L 6,0 L 5,75 L -5,75 Z" fill="#8B5A2B" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <g transform="translate(0, 75)">
        <circle cx={0} cy={10} r={12} fill="#8B5A2B" stroke={INK} strokeWidth={4} />
      </g>
    </g>
  </g>
);

const GeminiRig3Q: React.FC<{ a: LimbAngles; opacity: number }> = ({ a, opacity }) => (
  <g transform={`translate(0, ${a.hipYOffset})`} opacity={opacity}>
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
      <path d="M -20,-135 C -20,-135 -25,-70 -18,0 L 18,0 C 25,-70 20,-135 20,-135 Z" fill="#FFFDD0" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -18,0 L 18,0 L 17,15 L -17,15 Z" fill="#2F4F4F" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <g transform={`translate(0, -135) rotate(${a.headTilt})`}>
        <path d="M -50,-50 Q 0,-40 50,-50 L 0,-110 Z" fill="#D2B48C" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <circle cx={0} cy={-45} r={28} fill="#8B5A2B" stroke={INK} strokeWidth={4} />
        <circle cx={14} cy={-50} r={3} fill={INK} />
      </g>
      <g transform="translate(0, -135)">
        <ArmFree upper={a.armUpperFront} lower={a.armLowerFront} />
      </g>
    </g>
  </g>
);

// ============================================================================
// SILHOUETTE DOS (conçue de zero, pas de reference rig capsule cote Gemini pour cette vue —
// meme demarche que cueillette-arbre en son temps). Respecte la regle documentee : sur l'axe Y
// (profondeur), piste X quasi fixe, PAS de balancier lateral emprunte a la marche de profil.
// Le dos MASQUE bras/tete de face -> silhouette plus simple : chapeau vu de dessus (ellipse),
// epaules larges de dos, jambes = 2 pistes etroites qui montent/descendent legerement (bob),
// sans cycle de marche articule (le personnage est A L'ARRET dans cette vue, hold contemplatif).
// ============================================================================
const GeminiRigBack: React.FC<{ breath: number; opacity: number }> = ({ breath, opacity }) => (
  <g opacity={opacity}>
    {/* jambes : 2 pistes etroites, quasi fixes (personnage arrete) */}
    <path d="M -16,0 L -4,0 L -5,108 L -17,108 Z" fill="#2F4F4F" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M 4,0 L 16,0 L 17,108 L 5,108 Z" fill="#2F4F4F" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -17,108 L -5,108 L -6,196 L -18,196 Z" fill="#2F4F4F" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M 5,108 L 17,108 L 18,196 L 6,196 Z" fill="#2F4F4F" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -18,196 L -6,196 L -4,206 L 10,210 C 12,211 12,214 10,214 L -20,214 C -22,214 -22,210 -20,206 Z" fill="#3E2723" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M 6,196 L 18,196 L 20,206 C 22,210 22,214 20,214 L -10,214 L -4,206 Z" fill="#3E2723" stroke={INK} strokeWidth={4} strokeLinejoin="round" />

    {/* dos : trapeze large (epaules) -> hanches, un peu plus large que le torse 3/4 pour lire "de dos" */}
    <g transform={`translate(0, ${breath * 2})`}>
      <path d="M -34,-135 C -34,-135 -30,-70 -18,0 L 18,0 C 30,-70 34,-135 34,-135 Z" fill="#FFFDD0" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {/* bras : vus de dos, pendent le long du corps, tres discrets (pas de coude visible cote dos) */}
      <path d="M -34,-125 C -40,-90 -38,-40 -34,10 L -20,10 C -22,-40 -22,-90 -20,-125 Z" fill="#FFFDD0" stroke={INK} strokeWidth={3} strokeLinejoin="round" opacity={0.92} />
      <path d="M 34,-125 C 40,-90 38,-40 34,10 L 20,10 C 22,-40 22,-90 20,-125 Z" fill="#FFFDD0" stroke={INK} strokeWidth={3} strokeLinejoin="round" opacity={0.92} />
      {/* nuque + chapeau vu de 3/4-arriere (calotte + bord, pas de visage) */}
      <path d="M -46,-138 Q 0,-158 46,-138 Q 30,-190 0,-192 Q -30,-190 -46,-138 Z" fill="#D2B48C" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={0} cy={-148} r={26} fill="#8B5A2B" stroke={INK} strokeWidth={4} />
    </g>
  </g>
);

// ============================================================================
// SILHOUETTE LOINTAINE (registre, colonne en fond de plan) — pas de jambes articulees a cette
// echelle (regle pro dos/face lointain de l'INDEX, appliquee ici par prudence meme en profil : a
// scale ~0.3 un cycle de jambes fin se perd, silhouette pleine + Scale&Bob suffit, "le cerveau du
// spectateur fait le reste"). Silhouette pleine encre, pas de details internes.
// ============================================================================
// IMPORTANT : y=550 = meme ligne de sol que le personnage de tete (voir <g translate(leadX,550)>
// plus bas) -- bug corrige : la 1ere version ne passait aucun Y, la silhouette restait collee au
// bord haut du viewBox (a des annees-lumiere du sol), donc quasi invisible/hors-cadre utile.
const FarSilhouette: React.FC<{ x: number; bobPhase: number; scale: number }> = ({ x, bobPhase, scale }) => {
  const bob = Math.sin(bobPhase) * 5;
  const legSwing = Math.sin(bobPhase) * 8;
  return (
    <g transform={`translate(${x}, ${550 + bob}) scale(${scale})`}>
      {/* silhouette pleine : tete + torse + 2 jambes ecartees en ciseau leger (pas de genou articule) */}
      <circle cx={0} cy={-190} r={22} fill={INK} opacity={0.85} />
      <path d="M -22,-165 Q 0,-175 22,-165 L 16,-20 L -16,-20 Z" fill={INK} opacity={0.85} />
      <path d={`M -14,-30 L 2,-30 L ${legSwing},60 L ${legSwing - 12},60 Z`} fill={INK} opacity={0.85} />
      <path d={`M 14,-30 L -2,-30 L ${-legSwing},60 L ${-legSwing + 12},60 Z`} fill={INK} opacity={0.85} />
    </g>
  );
};

// ============================================================================
// TIMELINE
// ============================================================================
const T = {
  colStart: 0,
  dollyStart: 60, dollyEnd: 220, // le viewBox se resserre progressivement
  leadWalkEnd: 235,
  stopEnd: 255,
  lookbackStart: 255, lookbackEnd: 275,
  turnToBackStart: 275, turnToBackEnd: 289, // cross-fade 3/4 -> dos (14f, resserre depuis 25f :
  // un fondu trop lent expose un chevauchement disgracieux entre 2 silhouettes de forme differente)
  holdBackEnd: 355,
  turnToFrontStart: 355, turnToFrontEnd: 369, // cross-fade dos -> 3/4 (meme duree resserree)
  repartEnterEnd: 392,
  repartEnd: 450,
};

export const PROTO_SOUVERAIN_SCENE_ORIGINALE_FRAMES = T.repartEnd + 15;

const VIEWBOX_WIDE = { x: 0, y: 0, w: 1920, h: 1080 };
// dolly resserre sur la tete de colonne (qui arrive vers x~1350 au moment du dolly) — cadrage
// buste/mi-cuisses resultant en fin de dolly (defaut doctrine mise-en-scene pour l'arret/dialogue).
const VIEWBOX_TIGHT = { x: 950, y: 120, w: 820, h: 462 };

export const ProtoSouverainSceneOriginale: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- Colonne lointaine : 2 suiveurs en registre, dephasage de marche + de position ----
  const colX = interpolate(frame, [T.colStart, T.repartEnd], [-200, 2500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const followers = [
    { dx: -140, dphase: 0 },
    { dx: -260, dphase: 1.3 },
  ];

  // ---- Fade d'entree ----
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // ---- DOLLY : interpolation du viewBox (zoom-in progressif, easeInOutCubic) ----
  const dollyT = easeInOutCubic(clamp01(interpolate(frame, [T.dollyStart, T.dollyEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  // apres le hold dos, on ELARGIT a nouveau pour laisser la colonne repartir en plan large (dolly-out)
  const dollyOutT = easeInOutCubic(clamp01(interpolate(frame, [T.turnToFrontStart, T.repartEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const vb = {
    x: lerp(lerp(VIEWBOX_WIDE.x, VIEWBOX_TIGHT.x, dollyT), VIEWBOX_WIDE.x, dollyOutT),
    y: lerp(lerp(VIEWBOX_WIDE.y, VIEWBOX_TIGHT.y, dollyT), VIEWBOX_WIDE.y, dollyOutT),
    w: lerp(lerp(VIEWBOX_WIDE.w, VIEWBOX_TIGHT.w, dollyT), VIEWBOX_WIDE.w, dollyOutT),
    h: lerp(lerp(VIEWBOX_WIDE.h, VIEWBOX_TIGHT.h, dollyT), VIEWBOX_WIDE.h, dollyOutT),
  };

  // ---- Personnage de tete de colonne : position + pose ----
  const leadX = interpolate(
    frame,
    [T.colStart, T.leadWalkEnd, T.stopEnd, T.repartEnterEnd, T.repartEnd],
    [-200, 1350, 1350, 1350, 2600],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  let leadPose: LimbAngles;
  let label: string;
  if (frame < T.leadWalkEnd) {
    leadPose = frame < T.colStart + 10
      ? lerpAngles(IDLE, WALK_A, clamp01(interpolate(frame, [T.colStart, T.colStart + 10], [0, 1])))
      : walkCycle(frame, T.colStart);
    label = "la colonne avance";
  } else if (frame < T.stopEnd) {
    const t = clamp01(interpolate(frame, [T.leadWalkEnd, T.stopEnd], [0, 1]));
    leadPose = lerpAngles(walkCycle(T.leadWalkEnd, T.colStart), IDLE, easeInOutCubic(t));
    label = "s'arrete";
  } else if (frame < T.lookbackEnd) {
    const t = clamp01(interpolate(frame, [T.lookbackStart, T.lookbackEnd], [0, 1]));
    leadPose = lerpAngles(IDLE, LOOKBACK, easeInOutCubic(t));
    label = "un dernier regard...";
  } else if (frame < T.holdBackEnd) {
    leadPose = LOOKBACK;
    label = frame < T.turnToBackEnd ? "se retourne" : "regarde le village qu'il quitte";
  } else if (frame < T.turnToFrontEnd) {
    const t = clamp01(interpolate(frame, [T.turnToFrontStart, T.turnToFrontEnd], [0, 1]));
    leadPose = lerpAngles(LOOKBACK, IDLE, easeInOutCubic(t));
    label = "se retourne vers la route";
  } else if (frame < T.repartEnterEnd) {
    const t = clamp01(interpolate(frame, [T.turnToFrontEnd, T.repartEnterEnd], [0, 1]));
    leadPose = lerpAngles(IDLE, WALK_A, easeInOutCubic(t));
    label = "repart";
  } else {
    leadPose = walkCycle(frame, T.repartEnterEnd);
    label = "la colonne continue";
  }

  // ---- Cross-fade 3/4 <-> DOS ----
  // "whip" : scaleX se resserre vers ~0.15 au pic de chaque transition (simule le personnage qui
  // pivote sur lui-meme, vu de profil au milieu du tour) puis se rouvre -- masque le chevauchement
  // brut entre les 2 silhouettes (formes differentes) qu'un simple fondu plat exposait crument.
  const toBackT = clamp01(interpolate(frame, [T.turnToBackStart, T.turnToBackEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const toFrontT = clamp01(interpolate(frame, [T.turnToFrontStart, T.turnToFrontEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const frontOpacity = 1 - toBackT + toFrontT;
  const backOpacity = 1 - frontOpacity;
  const whipPinch = (t: number) => 1 - Math.sin(t * Math.PI) * 0.85; // 1 -> ~0.15 -> 1
  const turnScaleX = frontOpacity > 0 && frontOpacity < 1
    ? whipPinch(toBackT)
    : backOpacity > 0 && backOpacity < 1
      ? whipPinch(toFrontT)
      : 1;

  // respiration du hold dos (reprise telle quelle de ProtoGeminiContemplatif)
  const breathPhase = (frame / 120) * Math.PI * 2;
  const breath = Math.sin(breathPhase);

  // ---- Village au loin (derriere, a gauche du cadrage large) : pulse doucement pendant le hold ----
  const villagePulse = 1 + Math.sin(frame / 25) * 0.04;
  const villageOpacity = interpolate(frame, [T.turnToBackStart, T.turnToBackEnd], [0.55, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---- Ciel : leger crepuscule pendant le hold contemplatif, retour jour au depart ----
  const duskT = interpolate(frame, [T.turnToBackEnd, T.holdBackEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const skyColor = duskT > 0 ? SKY_DUSK : SKY_DAY;

  return (
    <AbsoluteFill style={{ backgroundColor: skyColor }}>
      <div style={{ opacity: fadeIn, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: INK, marginBottom: 4 }}>
          La colonne qui part — exode economique, dolly + changement de vue 3/4 -&gt; dos
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#8a2b2b", marginBottom: 12 }}>{label}</div>
        <svg width={1400} height={787} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{ background: skyColor }}>
          <line x1={-300} y1={550} x2={2700} y2={550} stroke={INK} strokeWidth={2} opacity={0.25} />

          {/* village au loin : DERRIERE le point d'arret du lead (x=1350, cadrage dolly-tight
              centre sur x~950-1770), pose SUR la ligne de sol (y=550, toits vers le haut en y
              negatif) -- bug corrige : la 1ere version etait a x=-120 (hors du viewBox large qui
              commence a x=0) ET a y=430 sans rapport avec le sol a 550. */}
          <g transform={`translate(1180, 550) scale(${villagePulse})`} opacity={villageOpacity}>
            <path d="M -40,0 L -40,-50 L 0,-85 L 40,-50 L 40,0 Z" fill={INK} opacity={0.5} />
            <path d="M 60,0 L 60,-35 L 90,-60 L 120,-35 L 120,0 Z" fill={INK} opacity={0.4} />
          </g>

          {/* colonne : 2 suiveurs lointains (registre), toujours silhouette simplifiee */}
          {followers.map((f, i) => (
            <FarSilhouette key={i} x={colX + f.dx} bobPhase={colX / 14 + f.dphase} scale={0.3} />
          ))}

          {/* personnage de tete : translate a sa position, rig complet (3/4 <-> dos en whip-cross-fade) */}
          <g transform={`translate(${leadX}, 550) scale(${turnScaleX}, 1)`}>
            <GeminiRig3Q a={leadPose} opacity={frontOpacity} />
            <GeminiRigBack breath={breath} opacity={backOpacity} />
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
