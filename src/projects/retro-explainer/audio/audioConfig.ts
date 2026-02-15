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

// SFX tracks for retro explainer
export const SFX_TRACKS: AudioTrack[] = [
  {
    name: "chiptune-loop",
    src: "audio/retro-explainer/sfx/chiptune-loop.mp3",
    startFrame: 0,
    durationInFrames: 1500, // Full video length
    volume: 0.15,
    fadeInFrames: 30,
    fadeOutFrames: 30,
    loop: true,
  },
  {
    name: "level-up-stage1",
    src: "audio/retro-explainer/sfx/level-up.mp3",
    startFrame: 0, // Adjusted at scene level
    durationInFrames: 90,
    volume: 0.5,
  },
  {
    name: "text-blip",
    src: "audio/retro-explainer/sfx/text-blip.mp3",
    startFrame: 0,
    durationInFrames: 30,
    volume: 0.2,
  },
  {
    name: "boss-alarm",
    src: "audio/retro-explainer/sfx/boss-alarm.mp3",
    startFrame: 0,
    durationInFrames: 90,
    volume: 0.6,
  },
  {
    name: "coin-collect",
    src: "audio/retro-explainer/sfx/coin-collect.mp3",
    startFrame: 0,
    durationInFrames: 30,
    volume: 0.4,
  },
  {
    name: "power-up",
    src: "audio/retro-explainer/sfx/power-up.mp3",
    startFrame: 0,
    durationInFrames: 60,
    volume: 0.4,
  },
];

// Voice tracks
export const VOICE_TRACKS: AudioTrack[] = [
  {
    name: "hook",
    src: "audio/retro-explainer/voice/hook.mp3",
    startFrame: 30, // After initial animation
    durationInFrames: 120,
    volume: 1,
  },
  {
    name: "stage1",
    src: "audio/retro-explainer/voice/stage1.mp3",
    startFrame: 210, // After transition
    durationInFrames: 120,
    volume: 1,
  },
  {
    name: "boss-intro",
    src: "audio/retro-explainer/voice/boss-intro.mp3",
    startFrame: 420,
    durationInFrames: 90,
    volume: 1,
  },
  {
    name: "reveal",
    src: "audio/retro-explainer/voice/reveal.mp3",
    startFrame: 570,
    durationInFrames: 150,
    volume: 1,
  },
  {
    name: "victory",
    src: "audio/retro-explainer/voice/victory.mp3",
    startFrame: 780,
    durationInFrames: 150,
    volume: 1,
  },
];

export const ALL_TRACKS: AudioTrack[] = [...SFX_TRACKS, ...VOICE_TRACKS];
