/**
 * ProtoGeminiPoseBankWalk — scene proto de test du rig FK Gemini (walk cycle interpolation).
 *
 * NOTE (2026-07-03) : le rig lui-meme (GeminiRig, LimbAngles, FaceExpression, FaceView,
 * WALK_A/WALK_B/IDLE, lerp/lerpAngles) a ete deplace vers
 * src/projects/_shared/personnage-vivant-svg/rig/GeminiRig.tsx (c'est un composant de
 * production reutilise par plusieurs scenes, pas du code jetable). Ce fichier ne garde que
 * la scene de demo proto elle-meme ; les symboles du rig sont re-exportes ci-dessous en
 * filet de securite temporaire pour ne rien casser.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  GeminiRig, WALK_A, WALK_B, IDLE, lerp, lerpAngles,
} from "../../_shared/personnage-vivant-svg/rig/GeminiRig";
import type { LimbAngles, FaceExpression, FaceView } from "../../_shared/personnage-vivant-svg/rig/GeminiRig";

export {
  GeminiRig, WALK_A, WALK_B, IDLE, lerp, lerpAngles,
} from "../../_shared/personnage-vivant-svg/rig/GeminiRig";
export type { LimbAngles, FaceExpression, FaceView } from "../../_shared/personnage-vivant-svg/rig/GeminiRig";

const PARCH = "#e8dcc0";

export const PROTO_GEMINI_POSE_BANK_WALK_FRAMES = 180;

export const ProtoGeminiPoseBankWalk: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const CYCLE_START = 20;
  const CYCLE_END = 140;
  const HALF_STEP = 14;
  let pose: LimbAngles;
  if (frame < CYCLE_START) {
    const t = interpolate(frame, [0, CYCLE_START], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(IDLE, WALK_A, t);
  } else if (frame < CYCLE_END) {
    const cf = frame - CYCLE_START;
    const stepIndex = Math.floor(cf / HALF_STEP);
    const localT = (cf % HALF_STEP) / HALF_STEP;
    const from = stepIndex % 2 === 0 ? WALK_A : WALK_B;
    const to = stepIndex % 2 === 0 ? WALK_B : WALK_A;
    pose = lerpAngles(from, to, localT);
  } else {
    const t = interpolate(frame, [CYCLE_END, CYCLE_END + 20], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(WALK_A, IDLE, t);
  }

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 26, color: "#2b2117", marginBottom: 20 }}>
          Test mouvement — rig FK Gemini 3.1 Pro (interpolation walk-a / walk-b, PAS un cut)
        </div>
        <svg width={500} height={750} viewBox="0 -60 400 600">
          <line x1={0} y1={500} x2={400} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
          <GeminiRig a={pose} face="neutral" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
