import React from "react";
import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";

type ObjectState = {
  fromFrame: number;
  src: string;
};

type ObjectStateSwapProps = {
  states: ObjectState[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  crossfadeFrames?: number;
  filter?: string;
  imageRendering?: "pixelated" | "auto";
};

export const ObjectStateSwap: React.FC<ObjectStateSwapProps> = ({
  states,
  position,
  size,
  crossfadeFrames = 10,
  filter,
  imageRendering = "pixelated",
}) => {
  const frame = useCurrentFrame();

  if (states.length === 0) return null;

  return (
    <>
      {states.map((state, idx) => {
        const next = states[idx + 1];
        const startFrame = state.fromFrame;
        const endFrame = next ? next.fromFrame + crossfadeFrames : Infinity;

        let opacity = 0;
        if (frame < startFrame) {
          opacity = 0;
        } else if (frame < startFrame + crossfadeFrames && idx > 0) {
          opacity = interpolate(
            frame,
            [startFrame, startFrame + crossfadeFrames],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
        } else if (next && frame >= next.fromFrame && frame < next.fromFrame + crossfadeFrames) {
          opacity = interpolate(
            frame,
            [next.fromFrame, next.fromFrame + crossfadeFrames],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
        } else if (frame >= startFrame && frame < endFrame) {
          opacity = 1;
        } else {
          opacity = 0;
        }

        if (idx === 0 && frame < startFrame + crossfadeFrames) {
          opacity = 1;
        }

        if (opacity <= 0.001) return null;

        return (
          <Img
            key={idx}
            src={staticFile(state.src)}
            style={{
              position: "absolute",
              left: position.x - size.width / 2,
              top: position.y - size.height / 2,
              width: size.width,
              height: size.height,
              opacity,
              imageRendering,
              filter,
            }}
          />
        );
      })}
    </>
  );
};
