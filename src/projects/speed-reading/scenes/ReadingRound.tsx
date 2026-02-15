import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { AbsoluteFill } from "remotion";
import { Background } from "../components/Background";
import { WordDisplay } from "../components/WordDisplay";
import { ProgressBar } from "../components/ProgressBar";
import { WpmIndicator } from "../components/WpmIndicator";
import { LevelTitle } from "../components/LevelTitle";
import { WordCounter } from "../components/WordCounter";
import { LevelConfig } from "../config/types";
import {
  getFramesPerWord,
  getCumulativeWordCount,
  speedReadingConfig,
} from "../config/speedReadingConfig";

type ReadingRoundProps = {
  level: LevelConfig;
  levelIndex: number;
  totalFrames: number;
};

export const ReadingRound: React.FC<ReadingRoundProps> = ({
  level,
  levelIndex,
  totalFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showFlash = level.wpm >= speedReadingConfig.flashThresholdWpm;

  // Calculate current word count for the counter
  const wordCount = getCumulativeWordCount(speedReadingConfig, levelIndex, frame);

  return (
    <AbsoluteFill>
      <Background />
      <WpmIndicator wpm={level.wpm} accentColor={level.accentColor} />
      <LevelTitle name={level.name} accentColor={level.accentColor} />
      <WordDisplay
        words={level.words}
        wpm={level.wpm}
        accentColor={level.accentColor}
        fontSize={level.fontSize}
        showFlash={showFlash}
      />
      <ProgressBar
        accentColor={level.accentColor}
        totalFrames={totalFrames}
      />
      <WordCounter count={wordCount} accentColor={level.accentColor} />
    </AbsoluteFill>
  );
};
