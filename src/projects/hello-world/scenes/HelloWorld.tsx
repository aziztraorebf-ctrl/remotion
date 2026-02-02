import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  AbsoluteFill,
} from "remotion";
import { AudioLayer } from "../audio/AudioLayer";
import { StickFigure } from "../../../characters/StickFigure";
import { OutdoorBackground } from "../../../components/OutdoorBackground";
import { Sun } from "../../../components/Sun";
import { OrangeOrb } from "./OrangeOrb";
import { idle } from "../../../animations/idle";
import { reaction } from "../../../animations/reaction";
import { walking } from "../../../animations/walking";
import { waving } from "../../../animations/waving";
import { jumping } from "../../../animations/jumping";
import { AnimationPose } from "../../../animations/types";

const BASE_X = 500;
const BASE_Y = 500;

interface AnimatedBobProps {
  baseX: number;
  baseY: number;
  getAnimation: (frame: number, fps: number) => AnimationPose;
}

const AnimatedBob: React.FC<AnimatedBobProps> = ({
  baseX,
  baseY,
  getAnimation,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pose = getAnimation(frame, fps);

  return (
    <StickFigure
      x={baseX + pose.bodyX}
      y={baseY + pose.bodyY}
      expression={pose.expression}
      headTilt={pose.headTilt}
      leftArmRotation={pose.leftArmRotation}
      rightArmRotation={pose.rightArmRotation}
      leftLegRotation={pose.leftLegRotation}
      rightLegRotation={pose.rightLegRotation}
    />
  );
};

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();

  const walkEndX = BASE_X + 90 * 4;

  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <OutdoorBackground />
          <Sun />

          <OrangeOrb startFrame={70} cx={1300} cy={660} />

          {frame < 60 && (
            <Sequence from={0} durationInFrames={60} layout="none">
              <AnimatedBob
                baseX={BASE_X}
                baseY={BASE_Y}
                getAnimation={idle}
              />
            </Sequence>
          )}

          {frame >= 60 && frame < 120 && (
            <Sequence from={60} durationInFrames={60} layout="none">
              <AnimatedBob
                baseX={BASE_X}
                baseY={BASE_Y}
                getAnimation={reaction}
              />
            </Sequence>
          )}

          {frame >= 120 && frame < 210 && (
            <Sequence from={120} durationInFrames={90} layout="none">
              <AnimatedBob
                baseX={BASE_X}
                baseY={BASE_Y}
                getAnimation={(f, fps) =>
                  walking(f, fps, { pixelsPerFrame: 4, speed: 1 })
                }
              />
            </Sequence>
          )}

          {frame >= 210 && frame < 240 && (
            <Sequence from={210} durationInFrames={30} layout="none">
              <AnimatedBob
                baseX={walkEndX}
                baseY={BASE_Y}
                getAnimation={waving}
              />
            </Sequence>
          )}

          {frame >= 240 && (
            <Sequence from={240} durationInFrames={60} layout="none">
              <AnimatedBob
                baseX={walkEndX}
                baseY={BASE_Y}
                getAnimation={jumping}
              />
            </Sequence>
          )}
        </svg>
      </AbsoluteFill>

      <AudioLayer />
    </AbsoluteFill>
  );
};
