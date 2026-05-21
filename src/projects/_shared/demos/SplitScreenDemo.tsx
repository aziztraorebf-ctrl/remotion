/**
 * SplitScreen Demo V2 — vraies images, sans labels
 *
 * Phase A (f0-120)   — stacked : terrain B&W (haut) vs portrait leader (bas)
 * Phase B (f120-240) — split   : illustration mine (gauche) vs niger-portrait (droite)
 * Phase C (f240-360) — reveal  : storyboard s3-nationalisation-split (gauche) revele portrait-f (droite)
 */

import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { SplitScreen } from "../components/inserts/SplitScreen";

const PHASE_DUR = 120;
const FADE = 12;
export const SPLIT_SCREEN_DEMO_FRAMES = PHASE_DUR * 3;

const phaseOpacity = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, start + FADE, end - FADE, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const imgFull: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const SplitScreenDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const phases = Array.from({ length: 3 }, (_, i) => ({
    start: PHASE_DUR * i,
    end: PHASE_DUR * (i + 1),
  }));

  const lf = (i: number) => Math.max(0, frame - phases[i].start);

  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>

      {/* Phase A — stacked : terrain B&W haut / portrait leader bas */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[0].start, phases[0].end) }}>
        <SplitScreen
          layout="stacked"
          separatorColor="#f5d547"
          separatorSize={3}
          leftPanel={
            <Img
              src={staticFile("_shared/brutal-headline-assets/terrain-bw.png")}
              style={{ ...imgFull, objectPosition: "center 30%" }}
            />
          }
          rightPanel={
            <Img
              src={staticFile("_shared/flags-portraits/leaders/leader-portrait-editorial.png")}
              style={{ ...imgFull, objectPosition: "center top" }}
            />
          }
          key={`a-${lf(0)}`}
        />
      </AbsoluteFill>

      {/* Phase B — split cote a cote : illustration mine / niger-portrait */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[1].start, phases[1].end) }}>
        <SplitScreen
          layout="split"
          separatorColor="#c8972b"
          separatorSize={4}
          leftPanel={
            <Img
              src={staticFile("_shared/brutal-headline-assets/illustration-stylisee.png")}
              style={{ ...imgFull, objectPosition: "center 20%" }}
            />
          }
          rightPanel={
            <Img
              src={staticFile("_shared/flags-portraits/countries/niger-portrait.png")}
              style={imgFull}
            />
          }
          key={`b-${lf(1)}`}
        />
      </AbsoluteFill>

      {/* Phase C — reveal : storyboard nationalisation / portrait-f */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[2].start, phases[2].end) }}>
        <SplitScreen
          layout="reveal"
          revealFrame={45}
          separatorColor="#ffffff"
          separatorSize={2}
          leftPanel={
            <Img
              src={staticFile("souverain/niger-uranium/assets/storyboard/s3-nationalisation-split.png")}
              style={imgFull}
            />
          }
          rightPanel={
            <Img
              src={staticFile("_shared/flags-portraits/leaders/leader-portrait-f-editorial.png")}
              style={{ ...imgFull, objectPosition: "center top" }}
            />
          }
          key={`c-${lf(2)}`}
        />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
