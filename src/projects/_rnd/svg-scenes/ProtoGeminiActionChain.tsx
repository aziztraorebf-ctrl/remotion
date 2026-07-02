/**
 * PROTOTYPE — enchainement idle -> marche -> arret -> marche -> idle sur le rig FK Gemini 3.1 Pro.
 * Suite de ProtoGeminiPoseBankWalk : verifie qu'une SEULE fonction de pose continue (comme computePose()
 * dans StickRig) tient sur un enchainement multi-segments, pas juste une marche isolee.
 *
 * ⛔ Version precedente incluait un accroupissement/ramassage (squat) — RETIRE (2026-07-02, retour Aziz) :
 * (1) genere par un appel Gemini SEPARE sans reference au personnage existant -> couleurs/proportions
 * incoherentes (peau/vetements/chapeau differents, visible a l'oeil) ; (2) notre propre decodage de studios
 * pro (MISE-EN-SCENE-INFOGRAPHICS-SHOW.md) montre que statique+marche est le registre DOMINANT, les actions
 * articulees au sol (ramasser, s'accroupir) sont rares en plan large — pas la priorite a optimiser.
 * Detail complet de l'historique squat (2 iterations d'echec + fix) : PERSONNAGE-VIVANT-INDEX.md.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const PARCH = "#e8dcc0";

export type LimbAngles = {
  torsoTilt: number;
  headTilt: number;
  armUpperFront: number; armLowerFront: number;
  armUpperBack: number; armLowerBack: number;
  legUpperFront: number; legLowerFront: number; footFront: number;
  legUpperBack: number; legLowerBack: number; footBack: number;
  hipX: number; hipY: number;
};

export const IDLE: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: -5, armLowerFront: 0,
  armUpperBack: 5, armLowerBack: 0,
  legUpperFront: 0, legLowerFront: 0, footFront: 0,
  legUpperBack: 0, legLowerBack: 0, footBack: 0,
  hipX: 200, hipY: 340,
};
const WALK_A: LimbAngles = {
  torsoTilt: 5, headTilt: -5,
  armUpperFront: -35, armLowerFront: -20,
  armUpperBack: 40, armLowerBack: -20,
  legUpperFront: -45, legLowerFront: 45, footFront: 0,
  legUpperBack: 30, legLowerBack: 0, footBack: 45,
  hipX: 200, hipY: 365,
};
const WALK_B: LimbAngles = {
  torsoTilt: 5, headTilt: -5,
  armUpperFront: 40, armLowerFront: -20,
  armUpperBack: -35, armLowerBack: -20,
  legUpperFront: 30, legLowerFront: 0, footFront: 45,
  legUpperBack: -45, legLowerBack: 45, footBack: 0,
  hipX: 200, hipY: 365,
};
export const WALK_A_EXPORT = WALK_A;
export const WALK_B_EXPORT = WALK_B;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function lerpAngles(a: LimbAngles, b: LimbAngles, t: number): LimbAngles {
  const out: Partial<LimbAngles> = {};
  (Object.keys(a) as (keyof LimbAngles)[]).forEach((k) => {
    out[k] = lerp(a[k], b[k], t);
  });
  return out as LimbAngles;
}

// Palette parametrable — meme geometrie de segments (structure rig inchangee), seules les couleurs varient.
// Teste la personnalisation par EDITION DE CODE (rapide, zero appel API) plutot que regenerer via Gemini,
// qui a produit des incoherences de personnage quand demande separement (voir squat, retire de ce fichier).
export type Palette = { skin: string; shirt: string; pants: string; hat: string; boot: string; ink: string };
export const PALETTE_DEFAULT: Palette = { skin: "#8B5A2B", shirt: "#FFFDD0", pants: "#2F4F4F", hat: "#D2B48C", boot: "#3E2723", ink: "#1A1A1A" };

const LegFront = ({ upper, lower, foot, p }: { upper: number; lower: number; foot: number; p: Palette }) => (
  <g transform={`rotate(${upper})`}>
    <path d="M -13,0 L 13,0 L 10,110 L -10,110 Z" fill={p.pants} stroke={p.ink} strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, 110) rotate(${lower})`}>
      <path d="M -10,0 L 10,0 L 7,90 L -7,90 Z" fill={p.pants} stroke={p.ink} strokeWidth={4} strokeLinejoin="round" />
      <g transform={`translate(0, 90) rotate(${foot})`}>
        <path
          d="M -7,0 L 7,0 L 9,8 L 22,12 C 24,13 24,16 22,16 L -9,16 C -11,16 -11,12 -9,8 Z"
          fill={p.skin} stroke={p.ink} strokeWidth={4} strokeLinejoin="round"
        />
        <path d="M -11,16 L 24,16 L 24,20 L -11,20 Z" fill={p.boot} stroke={p.ink} strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  </g>
);

const ArmFront = ({ upper, lower, p }: { upper: number; lower: number; p: Palette }) => (
  <g transform={`rotate(${upper})`}>
    <path d="M -7,40 L 7,40 L 6,90 L -6,90 Z" fill={p.skin} stroke={p.ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -12,0 L 12,0 L 14,45 L -14,45 Z" fill={p.shirt} stroke={p.ink} strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, 90) rotate(${lower})`}>
      <path d="M -6,0 L 6,0 L 5,75 L -5,75 Z" fill={p.skin} stroke={p.ink} strokeWidth={4} strokeLinejoin="round" />
      <g transform="translate(0, 75)">
        <circle cx={0} cy={10} r={12} fill={p.skin} stroke={p.ink} strokeWidth={4} />
      </g>
    </g>
  </g>
);

export const GeminiRig: React.FC<{ a: LimbAngles; palette?: Palette }> = ({ a, palette = PALETTE_DEFAULT }) => (
  <g transform={`translate(${a.hipX}, ${a.hipY}) rotate(${a.torsoTilt})`}>
    <g transform={`translate(0, -135) rotate(${a.armUpperBack})`}>
      <path d="M -7,40 L 7,40 L 6,90 L -6,90 Z" fill={palette.skin} stroke={palette.ink} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -12,0 L 12,0 L 14,45 L -14,45 Z" fill={palette.shirt} stroke={palette.ink} strokeWidth={4} strokeLinejoin="round" />
      <g transform={`translate(0, 90) rotate(${a.armLowerBack})`}>
        <path d="M -6,0 L 6,0 L 5,75 L -5,75 Z" fill={palette.skin} stroke={palette.ink} strokeWidth={4} strokeLinejoin="round" />
        <circle cx={0} cy={85} r={12} fill={palette.skin} stroke={palette.ink} strokeWidth={4} />
      </g>
    </g>
    <g transform={`rotate(${a.legUpperBack})`}>
      <LegFront upper={0} lower={a.legLowerBack} foot={a.footBack} p={palette} />
    </g>

    <path d="M -20,-135 C -20,-135 -25,-70 -18,0 L 18,0 C 25,-70 20,-135 20,-135 Z" fill={palette.shirt} stroke={palette.ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -18,0 L 18,0 L 17,15 L -17,15 Z" fill={palette.pants} stroke={palette.ink} strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, -135) rotate(${a.headTilt})`}>
      <path d="M -50,-50 Q 0,-40 50,-50 L 0,-110 Z" fill={palette.hat} stroke={palette.ink} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={0} cy={-45} r={28} fill={palette.skin} stroke={palette.ink} strokeWidth={4} />
      <circle cx={14} cy={-50} r={3} fill={palette.ink} />
    </g>

    <g transform={`rotate(${a.legUpperFront})`}>
      <LegFront upper={0} lower={a.legLowerFront} foot={a.footFront} p={palette} />
    </g>
    <g transform="translate(0, -135)">
      <ArmFront upper={a.armUpperFront} lower={a.armLowerFront} p={palette} />
    </g>
  </g>
);

// Timeline (30fps) : idle -> marche -> arret -> repart -> idle
const T = {
  fadeEnd: 15,
  walk1Start: 15,
  walk1End: 95,
  stopEnd: 115,
  walk2Start: 115,
  walk2End: 195,
  stopFinalEnd: 215,
};
const HALF_STEP = 14;

function walkCycle(frame: number, start: number, end: number): LimbAngles {
  const cf = frame - start;
  const stepIndex = Math.floor(cf / HALF_STEP);
  const localT = (cf % HALF_STEP) / HALF_STEP;
  const from = stepIndex % 2 === 0 ? WALK_A : WALK_B;
  const to = stepIndex % 2 === 0 ? WALK_B : WALK_A;
  return lerpAngles(from, to, localT);
}

export const PROTO_GEMINI_ACTION_CHAIN_FRAMES = T.stopFinalEnd + 20;

export const ProtoGeminiActionChain: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, T.fadeEnd], [0, 1], { extrapolateRight: "clamp" });

  let pose: LimbAngles;
  if (frame < T.fadeEnd) {
    pose = IDLE;
  } else if (frame < T.walk1End) {
    const enterT = interpolate(frame, [T.walk1Start, T.walk1Start + 10], [0, 1], { extrapolateRight: "clamp" });
    pose = frame < T.walk1Start + 10 ? lerpAngles(IDLE, WALK_A, enterT) : walkCycle(frame, T.walk1Start, T.walk1End);
  } else if (frame < T.stopEnd) {
    const t = interpolate(frame, [T.walk1End, T.stopEnd], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(WALK_A, IDLE, t);
  } else if (frame < T.walk2End) {
    const enterT = interpolate(frame, [T.walk2Start, T.walk2Start + 10], [0, 1], { extrapolateRight: "clamp" });
    pose = frame < T.walk2Start + 10 ? lerpAngles(IDLE, WALK_A, enterT) : walkCycle(frame, T.walk2Start, T.walk2End);
  } else if (frame < T.stopFinalEnd) {
    const t = interpolate(frame, [T.walk2End, T.stopFinalEnd], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(WALK_A, IDLE, t);
  } else {
    pose = IDLE;
  }

  const label =
    frame < T.walk1Start ? "idle" :
    frame < T.walk1End ? "marche" :
    frame < T.stopEnd ? "arret" :
    frame < T.walk2End ? "repart" :
    "arrive / idle";

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 26, color: "#2b2117", marginBottom: 4 }}>
          Chaine d&apos;actions — rig FK Gemini (idle -&gt; marche -&gt; arret -&gt; repart -&gt; idle)
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#8a2b2b", marginBottom: 16 }}>{label}</div>
        {/* viewBox elargi (etait "0 -60 400 600", coupait le pied avant en pleine foulee — legUpperFront
            va jusqu'a +-45deg, le pied sort largement de [0,400] en X) */}
        <svg width={600} height={750} viewBox="-100 -60 400 600">
          <line x1={-100} y1={500} x2={300} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
          <GeminiRig a={pose} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
