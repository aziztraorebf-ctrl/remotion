export type LevelConfig = {
  name: string;
  wpm: number;
  words: string[];
  accentColor: string;
  durationInSeconds: number;
  fontSize: number;
  successMessage: string;
};

export type SpeedReadingConfig = {
  title: string;
  subtitle: string;
  hookQuestion: string;
  levels: LevelConfig[];
  hookDurationInSeconds: number;
  countdownDurationInSeconds: number;
  transitionDurationInSeconds: number;
  outroDurationInSeconds: number;
  fps: number;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  flashThresholdWpm: number;
};
