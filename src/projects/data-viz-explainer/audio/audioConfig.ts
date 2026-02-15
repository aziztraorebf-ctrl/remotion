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

// Voice-over tracks - timed to match each act
// Audio durations: hook=8.0s, setup=23.9s, reveal=18.4s, cta=15.9s
// Voice: Chris (Lively Narrator), stability=0.0, style=0.8 for maximum expressiveness
// Script: provocative angle ("ta banque ne veut pas que tu voies...")
export const VOICE_TRACKS: AudioTrack[] = [
  {
    name: "hook",
    src: "audio/data-viz-explainer/hook.mp3",
    startFrame: 5, // Slight delay after visual start
    durationInFrames: 240, // ~8.0s
    volume: 1,
    fadeOutFrames: 5,
  },
  {
    name: "setup",
    src: "audio/data-viz-explainer/setup.mp3",
    startFrame: 255, // Act 2 starts at 250, small delay
    durationInFrames: 717, // ~23.9s
    volume: 1,
    fadeInFrames: 3,
    fadeOutFrames: 5,
  },
  {
    name: "reveal",
    src: "audio/data-viz-explainer/reveal.mp3",
    startFrame: 990, // Act 3 starts at 980, small delay
    durationInFrames: 553, // ~18.4s
    volume: 1,
    fadeInFrames: 3,
    fadeOutFrames: 5,
  },
  {
    name: "cta",
    src: "audio/data-viz-explainer/cta.mp3",
    startFrame: 1570, // Act 4 starts at 1560
    durationInFrames: 477, // ~15.9s
    volume: 1,
    fadeInFrames: 3,
    fadeOutFrames: 10,
  },
];

// Sound effects - punctuate key moments
// Act boundaries: Hook 0-250, Setup 250-980, Reveal 980-1560, CTA 1560-2100
export const SFX_TRACKS: AudioTrack[] = [
  {
    name: "whoosh-hook",
    src: "audio/data-viz-explainer/whoosh.mp3",
    startFrame: 53, // Just before x1.8 appears (frame 55 in hook)
    durationInFrames: 32,
    volume: 0.6,
  },
  {
    name: "impact-multiplier",
    src: "audio/data-viz-explainer/impact.mp3",
    startFrame: 55, // x1.8 reveal in hook
    durationInFrames: 46,
    volume: 0.7,
  },
  {
    name: "whoosh-transition-2",
    src: "audio/data-viz-explainer/whoosh.mp3",
    startFrame: 248, // Transition hook -> setup
    durationInFrames: 32,
    volume: 0.4,
  },
  {
    name: "counter-setup",
    src: "audio/data-viz-explainer/counter-tick.mp3",
    startFrame: 285, // Stat cards count up (setup, frame 35 local = 250+35)
    durationInFrames: 61,
    volume: 0.3,
  },
  {
    name: "whoosh-transition-3",
    src: "audio/data-viz-explainer/whoosh.mp3",
    startFrame: 978, // Transition setup -> reveal
    durationInFrames: 32,
    volume: 0.5,
  },
  {
    name: "impact-reveal",
    src: "audio/data-viz-explainer/impact.mp3",
    startFrame: 980, // Act 3 reveal moment
    durationInFrames: 46,
    volume: 0.8,
  },
  {
    name: "counter-reveal",
    src: "audio/data-viz-explainer/counter-tick.mp3",
    startFrame: 1070, // 612K counter ticks (reveal, frame 90 local = 980+90)
    durationInFrames: 61,
    volume: 0.35,
  },
  {
    name: "impact-punchline",
    src: "audio/data-viz-explainer/impact.mp3",
    startFrame: 1360, // Punchline stat (reveal, frame 380 local = 980+380)
    durationInFrames: 46,
    volume: 0.6,
  },
  {
    name: "whoosh-transition-4",
    src: "audio/data-viz-explainer/whoosh.mp3",
    startFrame: 1558, // Transition reveal -> CTA
    durationInFrames: 32,
    volume: 0.4,
  },
];

// Background music - loops for full duration, low volume under voice
export const MUSIC_TRACKS: AudioTrack[] = [
  {
    name: "bg-music",
    src: "audio/data-viz-explainer/bg-music.mp3",
    startFrame: 0,
    durationInFrames: 2100, // Full video (70s)
    volume: 0.22,
    fadeInFrames: 30,
    fadeOutFrames: 45,
    loop: true,
  },
];

export const ALL_TRACKS: AudioTrack[] = [
  ...MUSIC_TRACKS,
  ...VOICE_TRACKS,
  ...SFX_TRACKS,
];
