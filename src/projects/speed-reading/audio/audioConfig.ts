import { speedReadingConfig, getTotalDurationInFrames } from "../config/speedReadingConfig";

export interface AudioTrack {
  name: string;
  src: string;
  startFrame: number;
  durationInFrames: number;
  volume: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  loop?: boolean;
}

const { fps, hookDurationInSeconds, countdownDurationInSeconds, transitionDurationInSeconds, levels } = speedReadingConfig;

// Build the timeline frame offsets for each section
function buildTimeline() {
  const timeline: {
    hookStart: number;
    sections: Array<{
      countdownStart: number;
      roundStart: number;
      roundEnd: number;
      transitionStart: number;
      transitionEnd: number;
    }>;
    outroStart: number;
  } = {
    hookStart: 0,
    sections: [],
    outroStart: 0,
  };

  let currentFrame = hookDurationInSeconds * fps;

  for (let i = 0; i < levels.length; i++) {
    const countdownStart = currentFrame;
    currentFrame += countdownDurationInSeconds * fps;

    const roundStart = currentFrame;
    currentFrame += levels[i].durationInSeconds * fps;
    const roundEnd = currentFrame;

    let transitionStart = currentFrame;
    let transitionEnd = currentFrame;

    if (i < levels.length - 1) {
      transitionStart = currentFrame;
      currentFrame += transitionDurationInSeconds * fps;
      transitionEnd = currentFrame;
    }

    timeline.sections.push({
      countdownStart,
      roundStart,
      roundEnd,
      transitionStart,
      transitionEnd,
    });
  }

  timeline.outroStart = currentFrame;
  return timeline;
}

const timeline = buildTimeline();
const totalDuration = getTotalDurationInFrames(speedReadingConfig);

const AUDIO_BASE = "audio/speed-reading";

// Level keys for mapping voice files
const levelKeys = ["warmup", "level1", "level2", "level3", "level4", "level5", "inhuman"];

// Voice tracks
const voiceTracks: AudioTrack[] = [
  // Hook voice
  {
    name: "voice-hook",
    src: `${AUDIO_BASE}/voice/voice-hook.mp3`,
    startFrame: 5,
    durationInFrames: hookDurationInSeconds * fps - 5,
    volume: 1,
  },
  // Outro voice
  {
    name: "voice-outro",
    src: `${AUDIO_BASE}/voice/voice-outro.mp3`,
    startFrame: timeline.outroStart + 10,
    durationInFrames: speedReadingConfig.outroDurationInSeconds * fps - 10,
    volume: 1,
  },
];

// Add intro and success voices for each level
for (let i = 0; i < levels.length; i++) {
  const section = timeline.sections[i];
  const key = levelKeys[i];

  // Intro voice during countdown
  voiceTracks.push({
    name: `voice-${key}-intro`,
    src: `${AUDIO_BASE}/voice/voice-${key}-intro.mp3`,
    startFrame: section.countdownStart + 5,
    durationInFrames: countdownDurationInSeconds * fps - 5,
    volume: 1,
  });

  // Success voice during transition (only for levels that have transitions)
  if (i < levels.length - 1 && levels[i].successMessage) {
    voiceTracks.push({
      name: `voice-${key}-success`,
      src: `${AUDIO_BASE}/voice/voice-${key}-success.mp3`,
      startFrame: section.transitionStart + 5,
      durationInFrames: transitionDurationInSeconds * fps - 5,
      volume: 1,
    });
  }
}

// SFX tracks
const sfxTracks: AudioTrack[] = [
  // Ambient drone - loops throughout the entire video at low volume
  {
    name: "sfx-ambient",
    src: `${AUDIO_BASE}/sfx/sfx-ambient.mp3`,
    startFrame: 0,
    durationInFrames: totalDuration,
    volume: 0.08,
    fadeInFrames: 30,
    fadeOutFrames: 30,
    loop: true,
  },
  // Whoosh during hook gauge animation
  {
    name: "sfx-whoosh",
    src: `${AUDIO_BASE}/sfx/sfx-whoosh.mp3`,
    startFrame: 2 * fps,
    durationInFrames: fps,
    volume: 0.4,
  },
];

// Add ding SFX at the start of each countdown (when 3-2-1 appears, at the 2s mark)
for (let i = 0; i < levels.length; i++) {
  const section = timeline.sections[i];
  sfxTracks.push({
    name: `sfx-ding-${levelKeys[i]}`,
    src: `${AUDIO_BASE}/sfx/sfx-ding.mp3`,
    startFrame: section.countdownStart + 2 * fps,
    durationInFrames: fps,
    volume: 0.5,
  });
}

export const ALL_TRACKS: AudioTrack[] = [...voiceTracks, ...sfxTracks];
