/**
 * PROTOTYPE — test de MOUVEMENT sur la banque de poses GPT-5.5 (text-to-SVG, 2026-07-02), en CUT SEC.
 * Contrairement a Gemini (rig FK imbrique translate+rotate), GPT a produit des paths en coordonnees
 * ABSOLUES sans hierarchie de joints -> aucune interpolation d'angle possible, seul un cut entre les 4
 * SVG bruts est faisable. Meme rythme de cut que le test Gemini pour comparaison directe.
 * SVG sources : public/_rnd/gpt-pose-bank/{idle,walk-a,walk-b,bend-reach}.svg (copies de out/_rnd/pose-bank-test/gpt-pose*.svg).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, staticFile } from "remotion";

const PARCH = "#e8dcc0";
const HALF_STEP = 14;
const CYCLE_START = 20;
const CYCLE_END = 140;

export const PROTO_GPT_POSE_BANK_WALK_FRAMES = 180;

export const ProtoGptPoseBankWalk: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  let src = "idle.svg";
  if (frame >= CYCLE_START && frame < CYCLE_END) {
    const cf = frame - CYCLE_START;
    const stepIndex = Math.floor(cf / HALF_STEP);
    src = stepIndex % 2 === 0 ? "walk-a.svg" : "walk-b.svg";
  } else if (frame >= CYCLE_END) {
    src = "idle.svg";
  }

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 26, color: "#2b2117", marginBottom: 20 }}>
          Test mouvement — CUT SEC GPT-5.5 (pas de hierarchie de joints, paths absolus)
        </div>
        {/* key force un remount DOM a chaque changement de pose — sans ca, Remotion peut capturer
            l'ancienne image encore affichee (le <img> est reconcilie comme le meme noeud par React). */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img key={src} src={staticFile(`_rnd/gpt-pose-bank/${src}`)} width={500} height={750} />
      </div>
    </AbsoluteFill>
  );
};
