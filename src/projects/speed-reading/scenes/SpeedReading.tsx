import React from "react";
import { Series, AbsoluteFill } from "remotion";
import { HookScene } from "./HookScene";
import { ReadingRound } from "./ReadingRound";
import { TransitionScene } from "./TransitionScene";
import { OutroScene } from "./OutroScene";
import { Countdown } from "../components/Countdown";
import { Background } from "../components/Background";
import { AudioLayer } from "../audio/AudioLayer";
import { speedReadingConfig } from "../config/speedReadingConfig";

export const SpeedReading: React.FC = () => {
  const {
    fps,
    title,
    hookQuestion,
    hookDurationInSeconds,
    countdownDurationInSeconds,
    transitionDurationInSeconds,
    outroDurationInSeconds,
    levels,
  } = speedReadingConfig;

  const maxWpm = Math.max(...levels.map((l) => l.wpm));

  return (
    <AbsoluteFill>
      <Series>
        {/* Hook / Accroche */}
        <Series.Sequence durationInFrames={hookDurationInSeconds * fps}>
          <HookScene
            question={hookQuestion}
            title={title}
            maxWpm={maxWpm}
          />
        </Series.Sequence>

        {/* For each level: countdown + reading round + transition */}
        {levels.map((level, index) => (
          <React.Fragment key={level.name}>
            {/* Countdown before the level */}
            <Series.Sequence
              durationInFrames={countdownDurationInSeconds * fps}
            >
              <AbsoluteFill>
                <Background />
                <Countdown
                  accentColor={level.accentColor}
                  levelName={level.name}
                  wpm={level.wpm}
                />
              </AbsoluteFill>
            </Series.Sequence>

            {/* Reading round */}
            <Series.Sequence durationInFrames={level.durationInSeconds * fps}>
              <ReadingRound
                level={level}
                levelIndex={index}
                totalFrames={level.durationInSeconds * fps}
              />
            </Series.Sequence>

            {/* Transition after each level except the last */}
            {index < levels.length - 1 && level.successMessage && (
              <Series.Sequence
                durationInFrames={transitionDurationInSeconds * fps}
              >
                <TransitionScene
                  message={level.successMessage}
                  accentColor={level.accentColor}
                />
              </Series.Sequence>
            )}
          </React.Fragment>
        ))}

        {/* Outro */}
        <Series.Sequence durationInFrames={outroDurationInSeconds * fps}>
          <OutroScene />
        </Series.Sequence>
      </Series>
      <AudioLayer />
    </AbsoluteFill>
  );
};
