export interface AudioTrack {
  name: string;
  src: string;
  startFrame: number;
  durationInFrames: number;
  volume: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
}

// Voice tracks - generous durations to let each MP3 play fully
export const VOICE_TRACKS: AudioTrack[] = [
  {
    name: "voice-idle",
    src: "audio/voice/voice-idle.mp3",
    startFrame: 5,
    durationInFrames: 75,
    volume: 1,
  },
  {
    name: "voice-reaction",
    src: "audio/voice/voice-reaction.mp3",
    startFrame: 65,
    durationInFrames: 70,
    volume: 1,
  },
  {
    name: "voice-walking",
    src: "audio/voice/voice-walking.mp3",
    startFrame: 125,
    durationInFrames: 85,
    volume: 1,
  },
  {
    name: "voice-waving",
    src: "audio/voice/voice-waving.mp3",
    startFrame: 212,
    durationInFrames: 35,
    volume: 1,
  },
  {
    name: "voice-jumping",
    src: "audio/voice/voice-jumping.mp3",
    startFrame: 245,
    durationInFrames: 55,
    volume: 1,
  },
];

// SFX tracks
export const SFX_TRACKS: AudioTrack[] = [
  {
    name: "sfx-ambiance",
    src: "audio/sfx/sfx-ambiance.mp3",
    startFrame: 0,
    durationInFrames: 300,
    volume: 0.12,
    fadeInFrames: 15,
    fadeOutFrames: 15,
  },
  {
    name: "sfx-music",
    src: "audio/sfx/sfx-music.mp3",
    startFrame: 0,
    durationInFrames: 300,
    volume: 0.18,
    fadeInFrames: 30,
    fadeOutFrames: 20,
  },
  {
    name: "sfx-surprise",
    src: "audio/sfx/sfx-surprise.mp3",
    startFrame: 62,
    durationInFrames: 30,
    volume: 0.5,
  },
  {
    name: "sfx-footsteps",
    src: "audio/sfx/sfx-footsteps.mp3",
    startFrame: 122,
    durationInFrames: 88,
    volume: 0.3,
    fadeInFrames: 5,
    fadeOutFrames: 10,
  },
  {
    name: "sfx-wave",
    src: "audio/sfx/sfx-wave.mp3",
    startFrame: 215,
    durationInFrames: 30,
    volume: 0.4,
  },
  {
    name: "sfx-jump",
    src: "audio/sfx/sfx-jump.mp3",
    startFrame: 248,
    durationInFrames: 45,
    volume: 0.4,
  },
];

export const ALL_TRACKS: AudioTrack[] = [...VOICE_TRACKS, ...SFX_TRACKS];
