// timing.ts — Hannibal : Traversée des Alpes
// Généré depuis ElevenLabs Forced Alignment + Whisper
// Audio: public/hannibal/audio/narration-v2.mp3
// Durée: 147.77s — loss=0.3396

export const FPS = 30;
export const AUDIO_DURATION_S = 147.77;
export const AUDIO_DURATION_FRAMES = Math.round(AUDIO_DURATION_S * FPS); // 4433

// Beat timestamps (seconds)
export const BEATS_S = {
  hook:  0.08,
  beat1: 7.50,
  beat2: 21.36,
  beat3: 51.52,
  beat4: 101.70,
  beat5: 122.62,
  end:   147.77,
};

// Beat frames (derived — never hardcode)
export const BEATS = {
  hook:  Math.round(BEATS_S.hook  * FPS), // 2
  beat1: Math.round(BEATS_S.beat1 * FPS), // 225
  beat2: Math.round(BEATS_S.beat2 * FPS), // 641
  beat3: Math.round(BEATS_S.beat3 * FPS), // 1546
  beat4: Math.round(BEATS_S.beat4 * FPS), // 3051
  beat5: Math.round(BEATS_S.beat5 * FPS), // 3679
  end:   Math.round(BEATS_S.end   * FPS), // 4433
};

// Beat durations in frames
export const DURATIONS = {
  hook:  BEATS.beat1 - BEATS.hook,   // 223 frames ~7.4s
  beat1: BEATS.beat2 - BEATS.beat1,  // 416 frames ~13.9s
  beat2: BEATS.beat3 - BEATS.beat2,  // 905 frames ~30.2s
  beat3: BEATS.beat4 - BEATS.beat3,  // 1505 frames ~50.2s
  beat4: BEATS.beat5 - BEATS.beat4,  // 628 frames ~20.9s
  beat5: BEATS.end   - BEATS.beat5,  // 754 frames ~25.2s
};
