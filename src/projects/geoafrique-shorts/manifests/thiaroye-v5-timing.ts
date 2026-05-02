/**
 * thiaroye-v5-timing.ts
 *
 * Frame-precise timing manifest for Thiaroye V5 Short (9:16, 30 FPS).
 *
 * Sources of truth:
 *  - Audio: public/audio/thiaroye-1944/thiaroye-v5-narration.mp3 (101.840s, ffprobe)
 *  - Forced alignment: public/audio/thiaroye-1944/thiaroye-v5-alignment.json
 *    (ElevenLabs word-level, 408 tokens, last word "bio." ends at 101.799s)
 *  - Clip durations: ffprobe on every file in public/assets/thiaroye-1944/
 *
 * Boundary policy (NON-NEGOTIABLE):
 *  - Absolute frame boundaries (start/end), never relative durations.
 *  - Each scene caps on a complete phrase. Silence between phrases is absorbed
 *    into the preceding scene (visual lingers during the dramatic pause).
 *  - All seconds derived from alignment.json word ends; frames = round(s * FPS).
 *
 * Phrase boundaries from alignment.json (ms-precise):
 *   HOOK end = "tombes au retour." closes at 4.219s; long pause to 5.259s
 *              (next word "Decembre"). HOOK occupies 0 -> 5.04 (matches clip).
 *   S1 end   = "leur solde." closes at 18.139s; "Thiaroye," starts 18.979s.
 *   S2 end   = "ne dorment plus." closes at 31.000s; "Premier" starts 31.979s.
 *   S3A end  = "ses propres soldats." closes at 40.119s; "Sur ceux" 40.939s.
 *   S3B end  = "...s'effacent." closes at 61.419s — wait, this is S4A end.
 *              S3B narrative ends right before S4A "Quatre-vingts morts"
 *              starts at 49.039s; preceded by long pause from 48.000s.
 *   S4A end  = "...s'effacent." closes at 61.419s; "Tu n'as" starts 62.099s.
 *   S4B end  = "verite." closes at 70.080s; "Quatre-vingts ans" 70.979s.
 *   S5A end  = "la justice tranche." closes at 82.279s; "L'Etat" 83.080s.
 *   S5B end  = "...encore." closes at 90.799s; "Ils ont libere" 91.439s.
 *   S6 narrative end = "...qui les oublie." closes at 93.659s; "Maintenant"
 *                      starts 94.439s. Split-screen + CTA overlays start here.
 *   END      = "lien en bio." ends at 101.799s; mp3 duration 101.840s.
 *
 * Clip vs window deltas (for documentation; freezes are handled at compose time):
 *   HOOK   window 5.04s  | clip 5.042s  | exact
 *   S1     window 13.10s | s1(7.059)+complement(6.042)=13.100s | exact
 *   S2     window 12.86s | clip 12.124s | freeze 0.74s tail
 *   S3A    window  9.12s | clip 10.054s | clip CUT to fit window (lose ~0.93s tail)
 *   S3B    window  7.88s | clip  7.059s | freeze 0.82s tail
 *   S4A    window 13.42s | clip 12.124s | freeze 1.30s tail
 *   S4B    window  8.66s | clip  7.059s | freeze 1.60s tail
 *   S5A    window 12.20s | clip 10.054s | freeze 2.15s tail (Biram contemplatif)
 *   S5B    window  9.16s | clip  7.059s | freeze 2.10s tail
 *   S6     window 10.40s | clip 10.054s | freeze 0.35s tail (covered by CTA overlay)
 *
 * Generated 2026-04-25 by storyboarder agent.
 */

// ----------------------------------------------------------------------------
// Composition constants
// ----------------------------------------------------------------------------

export const FPS = 30;
export const COMPOSITION_WIDTH = 1080;
export const COMPOSITION_HEIGHT = 1920;
export const TOTAL_DURATION_S = 98.16;
export const TOTAL_FRAMES = Math.round(TOTAL_DURATION_S * FPS); // 2945

const sToFrames = (s: number): number => Math.round(s * FPS);

// ----------------------------------------------------------------------------
// HOOK — paper-craft camp Thiaroye, narration "Ils ont libere la France..."
// ----------------------------------------------------------------------------

export const HOOK = {
  startFrame: 0,
  endFrame: sToFrames(5.04), // 151
  durationFrames: sToFrames(5.04), // 151
  startS: 0.0,
  endS: 5.04,
  videoFile: "assets/thiaroye-1944/hook/hook-thiaroye-CANONICAL.mp4",
  videoDurationS: 5.042, // ffprobe
  // SFX du clip hook coupe (muted) pour laisser place a la narration ElevenLabs.
  muteEmbeddedAudio: true,
} as const;

// ----------------------------------------------------------------------------
// SCENES — 8 narrative segments (5.04s -> 91.44s)
// ----------------------------------------------------------------------------

export type SceneFile = {
  src: string;
  /** Real ffprobe duration (s) of the source clip. */
  durationS: number;
  /** Optional crossfade with previous file inside the same scene (s). */
  crossfadeWithPreviousS?: number;
};

export type Scene = {
  id: string;
  title: string;
  /** Absolute composition frame where the scene starts. */
  startFrame: number;
  /** Absolute composition frame where the scene ends (= next scene start). */
  endFrame: number;
  durationFrames: number;
  startS: number;
  endS: number;
  /** Absolute seconds where the narration phrase for this scene begins. */
  narrationStartS: number;
  /** Absolute seconds where the narration phrase for this scene ends. */
  narrationEndS: number;
  /**
   * Source files played in order. If a single file is shorter than the scene
   * window, the LAST file freezes on its final frame for the remaining time
   * (handled in the Remotion composer with a frozen <Img> overlay or
   * playbackRate=0 trick). If a single file is longer than the window, it is
   * cut at scene end (Sequence durationInFrames < clip duration).
   */
  files: SceneFile[];
  /**
   * Optional crossfade with the PREVIOUS scene at scene-junction (s).
   * Used to soften Video-Extend micro-jumps. 0 = hard cut.
   */
  crossfadeWithPreviousS?: number;
  /** Notes for the composer agent. */
  notes?: string;
};

export const SCENES: readonly Scene[] = [
  {
    id: "scene1",
    title: "Le Retour",
    startFrame: sToFrames(5.04), // 151
    endFrame: sToFrames(18.14), // 544
    durationFrames: sToFrames(18.14) - sToFrames(5.04), // 393
    startS: 5.04,
    endS: 18.14,
    narrationStartS: 5.259, // "Decembre"
    narrationEndS: 18.139, // "...leur solde."
    files: [
      {
        src: "assets/thiaroye-1944/clips/s1-retour-v5.mp4",
        durationS: 7.059,
      },
      {
        src: "assets/thiaroye-1944/scene1/scene1-complement-v1-r2v.mp4",
        durationS: 6.042,
        crossfadeWithPreviousS: 0.3, // soften junction inside scene1 (R2V continuation)
      },
    ],
    notes:
      "Two-clip concatenation: s1 (7.059) + complement (6.042) = 13.101s, " +
      "matches window 13.10s exactly. Internal crossfade 0.3s recommended.",
  },
  {
    id: "scene2",
    title: "La Revendication",
    startFrame: sToFrames(18.14), // 544
    endFrame: sToFrames(31.0), // 930
    durationFrames: sToFrames(31.0) - sToFrames(18.14), // 386
    startS: 18.14,
    endS: 31.0,
    narrationStartS: 18.979, // "Thiaroye,"
    narrationEndS: 31.0, // "...ne dorment plus."
    files: [
      {
        src: "assets/thiaroye-1944/clips-final/scene2-la-revendication-VALIDATED.mp4",
        durationS: 12.124,
      },
    ],
    notes:
      "Window 12.86s vs clip 12.124s -> freeze last frame for 0.74s. " +
      "VALIDATED file is original + Video Extend already concatenated upstream. " +
      "Optional 0.3s crossfade with previous scene (S1 complement -> S2).",
    crossfadeWithPreviousS: 0.3,
  },
  {
    id: "scene3a",
    title: "Le Massacre — Ordre et Feu",
    startFrame: sToFrames(31.0), // 930
    endFrame: sToFrames(40.12), // 1204
    durationFrames: sToFrames(40.12) - sToFrames(31.0), // 274
    startS: 31.0,
    endS: 40.12,
    narrationStartS: 31.979, // "Premier decembre"
    narrationEndS: 40.119, // "...ses propres soldats."
    files: [
      {
        src: "assets/thiaroye-1944/clips-final/scene3a-le-massacre-ordre-feu.mp4",
        durationS: 10.054,
      },
    ],
    notes:
      "CLIP IS LONGER THAN WINDOW (10.054s vs 9.12s). " +
      "Cut at scene end (Sequence durationInFrames=274 < clip 30fps frames). " +
      "Lose ~0.93s tail; verify via mini-render that the cut lands on a stable beat.",
  },
  {
    id: "scene3b",
    title: "Le Massacre — Aftermath",
    startFrame: sToFrames(40.12), // 1204
    endFrame: sToFrames(48.0), // 1440
    durationFrames: sToFrames(48.0) - sToFrames(40.12), // 236
    startS: 40.12,
    endS: 48.0,
    narrationStartS: 40.939, // "Sur ceux..."
    narrationEndS: 48.0, // last word before pause approx (see alignment)
    files: [
      {
        src: "assets/thiaroye-1944/clips-final/scene3b-le-massacre-aftermath.mp4",
        durationS: 7.059,
      },
    ],
    notes: "Window 7.88s vs clip 7.059s -> freeze 0.82s tail.",
  },
  {
    id: "scene4a",
    title: "Effacement — Archives",
    startFrame: sToFrames(48.0), // 1440
    endFrame: sToFrames(61.42), // 1843
    durationFrames: sToFrames(61.42) - sToFrames(48.0), // 403
    startS: 48.0,
    endS: 61.42,
    narrationStartS: 49.039, // "Quatre-vingts morts officiels"
    narrationEndS: 61.419, // "...s'effacent."
    files: [
      {
        src: "assets/thiaroye-1944/clips-final/scene4a-effacement-archives-VALIDATED.mp4",
        durationS: 12.124,
      },
    ],
    notes:
      "Window 13.42s vs clip 12.124s -> freeze 1.30s tail. " +
      "VALIDATED = original + Video Extend continuation already concatenated. " +
      "Optional 0.3s crossfade with previous scene (S3B -> S4A).",
    crossfadeWithPreviousS: 0.3,
  },
  {
    id: "scene4b",
    title: "Effacement — Tribunal / Photo dans les mains",
    startFrame: sToFrames(61.42), // 1843
    endFrame: sToFrames(70.08), // 2102
    durationFrames: sToFrames(70.08) - sToFrames(61.42), // 259
    startS: 61.42,
    endS: 70.08,
    narrationStartS: 62.099, // "Tu n'as jamais appris..."
    narrationEndS: 70.08, // "...verite."
    files: [
      {
        src: "assets/thiaroye-1944/clips-final/scene4b-effacement-tribunal.mp4",
        durationS: 7.059,
      },
    ],
    notes: "Window 8.66s vs clip 7.059s -> freeze 1.60s tail.",
  },
  {
    id: "scene5a",
    title: "Verite — Biram Senghor au Memorial",
    startFrame: sToFrames(70.08), // 2102
    endFrame: sToFrames(82.28), // 2468
    durationFrames: sToFrames(82.28) - sToFrames(70.08), // 366
    startS: 70.08,
    endS: 82.28,
    narrationStartS: 70.979, // "Quatre-vingts ans plus tard..."
    narrationEndS: 82.279, // "...la justice tranche."
    files: [
      {
        src: "assets/thiaroye-1944/clips-final/scene5a-verite-biram-senghor.mp4",
        durationS: 10.054,
      },
    ],
    notes:
      "FORMAT EXCEPTION: source clip is 834x1112 (4:3-ish), not 720x1280. " +
      "Recommended handling: crop centre to 720x960 then scale uniformly to " +
      "720x1280 (composer handles via CSS objectFit cover or transform). " +
      "Window 12.20s vs clip 10.054s -> freeze 2.15s tail (contemplative scene, " +
      "Biram in front of memorial wall — the freeze enhances the emotional beat).",
  },
  {
    id: "scene5b",
    title: "Verite — Nom sur la Pierre",
    startFrame: sToFrames(82.28), // 2468
    endFrame: sToFrames(86.10), // 2583
    durationFrames: sToFrames(86.10) - sToFrames(82.28), // 115
    startS: 82.28,
    endS: 86.10,
    narrationStartS: 83.08, // "L'Etat dissimule. Le tribunal..."
    narrationEndS: 85.10, // "...encore."
    files: [
      {
        src: "assets/thiaroye-1944/clips-final/scene5b-verite-nom-pierre.mp4",
        durationS: 7.059,
      },
    ],
    notes: "Window 9.16s vs clip 7.059s -> freeze 2.10s tail.",
  },
] as const;

// ----------------------------------------------------------------------------
// CTA — Scene 6 plein ecran (86.10s -> 89.08s) puis split-screen + texte CTA
//        (89.08s -> 98.16s)
// ----------------------------------------------------------------------------

export type CTATextLine = {
  /** Headline (e.g. "Tu savais ?"). */
  headline: string;
  /** Sub-text below the headline. */
  subtext: string;
  /** Seconds offset from CTA phase start (= 91.44s in absolute time). */
  appearAtS: number;
  /** Frame offset from CTA phase start. */
  appearAtFrame: number;
  /** Lucide icon hint for the composer. */
  icon: "Memorial" | "Bell" | "Link";
};

const CTA_START_S = 86.10;
const CTA_END_S = 98.16;
const SPLIT_START_S = 89.08; // narration "Maintenant," begins 89.079

export const CTA = {
  // Phase boundaries (absolute composition time)
  startFrame: sToFrames(CTA_START_S), // 2583
  endFrame: sToFrames(CTA_END_S), // 2945
  durationFrames: sToFrames(CTA_END_S) - sToFrames(CTA_START_S), // 362
  startS: CTA_START_S,
  endS: CTA_END_S,

  // Background full-screen Scene 6 plays for the entire CTA phase.
  scene6BackgroundFile:
    "assets/thiaroye-1944/clips-final/scene6-le-souvenir-cta.mp4",
  scene6DurationS: 10.054,

  // Narration "Ils ont libere un continent qui les oublie." plays during the
  // first ~2.2s of CTA (86.10 -> 88.28) over Scene 6 plein ecran.
  narrationFinalLineStartS: 86.099, // "Ils"
  narrationFinalLineEndS: 88.279, // "...oublie."

  // Split-screen + texte CTA overlay starts at 89.08s (relative frame 89).
  splitScreen: {
    startFrame: sToFrames(SPLIT_START_S), // 2672 (absolute)
    startFrameRelative: sToFrames(SPLIT_START_S - CTA_START_S), // 89 (from CTA start)
    durationFrames: sToFrames(CTA_END_S - SPLIT_START_S), // 273
    startS: SPLIT_START_S,
    endS: CTA_END_S,

    // Left half: scene 1 navire (loop or freeze on first frame).
    leftClip: "assets/thiaroye-1944/clips/s1-retour-v5.mp4",
    leftClipDurationS: 7.059,

    // Right half: continue Scene 6 (the same file as background).
    // Composer choice: re-render Scene 6 in right half from frame 0, OR
    // continue the running Scene 6 instance in right half (preferred —
    // single OffthreadVideo, masked).
    rightClip: "assets/thiaroye-1944/clips-final/scene6-le-souvenir-cta.mp4",
    rightClipDurationS: 10.054,

    // Vertical divider style — match Sonjata gold or adapt to Thiaroye palette.
    // Composer: see SonjataScene10.tsx -> SplitVertical for spring reveal pattern.
    dividerColor: "#D4A843", // gold (Sonjata) — Aziz to confirm or switch to ocre
    dividerWidthPx: 2,
  },

  // 3 cascaded text lines synced on narration "Maintenant tu sais... lien en bio".
  // appearAtS is relative to CTA phase start (91.44s).
  textLines: [
    {
      headline: "Tu savais ?",
      subtext: "300 tirailleurs sont tombes en 1944",
      // 91.44 + 0.20 = 91.64s absolute. Narration "Ils" starts 91.439, line 1
      // appears just after it begins.
      appearAtS: 0.2,
      appearAtFrame: sToFrames(0.2), // 6
      icon: "Memorial",
    },
    {
      headline: "Newsletter quotidienne",
      subtext: "l'actualite africaine sous un angle different",
      // 86.10 + 2.98 = 89.08s absolute (= split-screen start, narration "Maintenant").
      appearAtS: 2.98,
      appearAtFrame: sToFrames(2.98), // 89
      icon: "Bell",
    },
    {
      headline: "Lien en bio",
      subtext: "chaque matin, un regard different",
      // 86.10 + 11.32 = 97.42s absolute. Narration "Lien" starts 97.419s.
      appearAtS: 11.32,
      appearAtFrame: sToFrames(11.32), // 340
      icon: "Link",
    },
  ] as CTATextLine[],

  // Style hints for composer (reuse SonjataCTA.tsx pattern).
  style: {
    headlineFont: "Cinzel Decorative",
    subtextFont: "Cinzel",
    accentColor: "#D4A843", // gold
    backgroundColor: "#1A120B", // brun fonce — but we are over a video, use opacity panel
    panelOpacity: 0.55, // dark overlay panel behind text for legibility
  },
} as const;

// ----------------------------------------------------------------------------
// AUDIO
// ----------------------------------------------------------------------------

export const AUDIO = {
  /** Main narration ElevenLabs (FR). Plays from 0s, covers full duration. */
  narration: "audio/thiaroye-1944/thiaroye-v5-narration.mp3",
  narrationDurationS: 98.16,

  /**
   * Background music. Aziz to choose between variantes B (kora-ngoni) and
   * C (balafon-solo). Composer: read whichever file is symlinked or set the
   * choice here once Aziz confirms.
   *   Volume: 0.15-0.20 (vs narration 1.0)
   *   Fade-in: 2s from start
   *   Fade-out: 2s before end
   */
  music: "audio/thiaroye-1944/music-variantes/variante-C-balafon-solo.mp3", // Aziz validated C 2026-04-25
  musicVolume: 0.07,
  musicFadeInS: 2.0,
  musicFadeOutS: 2.0,

  /** Hook SFX is muted (clip's embedded audio not played). */
  hookSfx: null,
} as const;

// ----------------------------------------------------------------------------
// Console summary (frame-precise key landmarks)
// ----------------------------------------------------------------------------

if (typeof console !== "undefined" && process.env.NODE_ENV !== "production") {
  /* eslint-disable no-console */
  console.log("=== thiaroye-v5-timing.ts ===");
  console.log(
    `FPS=${FPS} | ${COMPOSITION_WIDTH}x${COMPOSITION_HEIGHT} | total=${TOTAL_FRAMES}f (${TOTAL_DURATION_S}s)`,
  );
  console.log(
    `HOOK   ${HOOK.startFrame.toString().padStart(4)} -> ${HOOK.endFrame.toString().padStart(4)} (${HOOK.startS}s -> ${HOOK.endS}s)`,
  );
  for (const s of SCENES) {
    console.log(
      `${s.id.padEnd(7)} ${s.startFrame.toString().padStart(4)} -> ${s.endFrame.toString().padStart(4)} (${s.startS}s -> ${s.endS}s) | ${s.title}`,
    );
  }
  console.log(
    `CTA    ${CTA.startFrame.toString().padStart(4)} -> ${CTA.endFrame.toString().padStart(4)} (${CTA.startS}s -> ${CTA.endS}s)`,
  );
  console.log(
    `  splitScreen starts @ frame ${CTA.splitScreen.startFrame} (relative ${CTA.splitScreen.startFrameRelative})`,
  );
  console.log(
    `  CTA text lines @ relative frames: ${CTA.textLines.map((l) => l.appearAtFrame).join(", ")}`,
  );
  console.log(`AUDIO  narration=${AUDIO.narration} music=${AUDIO.music}`);
  /* eslint-enable no-console */
}
