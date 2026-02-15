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

// Voice-over tracks - 4 acts matching BrutalistFinance scene timing (resserred)
// Voice: Chris (Lively Narrator), stability=0.0, style=0.8
// Script: DirtyBiology FR tone (casual, ironic)
// Durations from actual generated audio (ffprobe)
// SCENE_TIMING: Hook 0-520, Setup 520-1620, Mecanisme 1620-2820, RevealCta 2820-4220
export const VOICE_TRACKS: AudioTrack[] = [
  {
    name: "hook",
    src: "audio/brutalist-finance/hook.mp3",
    startFrame: 5, // Hook starts at 0
    durationInFrames: 429, // 14.32s actual
    volume: 1,
    fadeOutFrames: 5,
  },
  {
    name: "setup",
    src: "audio/brutalist-finance/setup.mp3",
    startFrame: 530, // Setup starts at 520
    durationInFrames: 981, // 32.72s actual
    volume: 1,
    fadeInFrames: 3,
    fadeOutFrames: 5,
  },
  {
    name: "mecanisme",
    src: "audio/brutalist-finance/mecanisme.mp3",
    startFrame: 1630, // Mecanisme starts at 1620
    durationInFrames: 1080, // 36.0s actual
    volume: 1,
    fadeInFrames: 3,
    fadeOutFrames: 5,
  },
  {
    name: "reveal-cta",
    src: "audio/brutalist-finance/reveal-cta.mp3",
    startFrame: 2830, // RevealCta starts at 2820
    durationInFrames: 1221, // 40.72s actual
    volume: 1,
    fadeInFrames: 3,
    fadeOutFrames: 15,
  },
];

// Sound effects - brutalist style: impact hits, glitch, counter ticks
// Using glitch sounds at act boundaries and impacts at key reveals
// Frame positions = local frame + act global offset
export const SFX_TRACKS: AudioTrack[] = [
  // Hook: x1.8 stamp (local frame 30)
  {
    name: "impact-x18",
    src: "audio/brutalist-finance/impact.mp3",
    startFrame: 30, // 30 + hookStart(0)
    durationInFrames: 45,
    volume: 0.7,
  },
  // Hook: counter start (local frame 100)
  {
    name: "counter-hook",
    src: "audio/brutalist-finance/counter-tick.mp3",
    startFrame: 100, // 100 + hookStart(0)
    durationInFrames: 60,
    volume: 0.3,
  },
  // Glitch: Hook -> Setup
  {
    name: "glitch-1",
    src: "audio/brutalist-finance/glitch.mp3",
    startFrame: 518, // hookEnd(520) - 2
    durationInFrames: 15,
    volume: 0.5,
  },
  // Setup: "SIGNE." stamp (local frame 600)
  {
    name: "impact-signe",
    src: "audio/brutalist-finance/impact.mp3",
    startFrame: 1120, // 600 + setupStart(520)
    durationInFrames: 45,
    volume: 0.6,
  },
  // Glitch: Setup -> Mecanisme
  {
    name: "glitch-2",
    src: "audio/brutalist-finance/glitch.mp3",
    startFrame: 1618, // setupEnd(1620) - 2
    durationInFrames: 15,
    volume: 0.6,
  },
  // Mecanisme: "58% POUR LA BANQUE" (local frame 340)
  {
    name: "impact-58pct",
    src: "audio/brutalist-finance/impact.mp3",
    startFrame: 1960, // 340 + mecanismeStart(1620)
    durationInFrames: 45,
    volume: 0.7,
  },
  // Mecanisme: cumulated interest counter (local frame 770)
  {
    name: "counter-interets",
    src: "audio/brutalist-finance/counter-tick.mp3",
    startFrame: 2390, // 770 + mecanismeStart(1620)
    durationInFrames: 70,
    volume: 0.35,
  },
  // Glitch: Mecanisme -> Reveal
  {
    name: "glitch-3",
    src: "audio/brutalist-finance/glitch.mp3",
    startFrame: 2818, // mecanismeEnd(2820) - 2
    durationInFrames: 15,
    volume: 0.7,
  },
  // Reveal: 576K counter (local frame 30)
  {
    name: "counter-576k",
    src: "audio/brutalist-finance/counter-tick.mp3",
    startFrame: 2850, // 30 + revealCtaStart(2820)
    durationInFrames: 60,
    volume: 0.35,
  },
  // Reveal: "80%" stamp (local frame 750)
  {
    name: "impact-80pct",
    src: "audio/brutalist-finance/impact.mp3",
    startFrame: 3570, // 750 + revealCtaStart(2820)
    durationInFrames: 45,
    volume: 0.8,
  },
  // CTA phase transition (hard cut to white, local frame 950)
  {
    name: "glitch-4",
    src: "audio/brutalist-finance/glitch.mp3",
    startFrame: 3770, // 950 + revealCtaStart(2820)
    durationInFrames: 15,
    volume: 0.5,
  },
];

// Background music - loops for full video duration (4220 frames / ~140s)
export const MUSIC_TRACKS: AudioTrack[] = [
  {
    name: "bg-music",
    src: "audio/brutalist-finance/bg-music.mp3",
    startFrame: 0,
    durationInFrames: 4220,
    volume: 0.18,
    fadeInFrames: 30,
    fadeOutFrames: 60,
    loop: true,
  },
];

export const ALL_TRACKS: AudioTrack[] = [
  ...MUSIC_TRACKS,
  ...VOICE_TRACKS,
  ...SFX_TRACKS,
];
