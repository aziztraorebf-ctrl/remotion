// Sonjata Papercraft — Full Short (hook + 10 scenes assembled)
// Total: ~151s (5s hook + 146s scenes 1-10)
// Hook: silent music (Option B), narration only, teases the "IL SE LEVE" climax
// Each scene has its own narration slice from sonjata-short-v2.mp3
// Background music: Minimax 2.6 Mande kora (Toumani Diabate style), starts at scene 1
//
// v4 corrections (2026-04-26):
//   - Scene 7 SFX fix : clip audio (SFX arc + chute Soumaoro) reinjected as separate Audio layer
//   - Scene 9 citation 3 : "aboli" -> "réduit par razzia" (historical accuracy, Kouroukan Fouga)
//   - Scene 10 timeline : "deux siècles" -> "cinq cent cinquante-quatre ans" (matches 1235->1789 on screen)
//   Audio correction file : sonjata-correction-s9s10.mp3 (11.68s, forced-alignment validated)
//
// NEXT SESSION UPDATE (2026-04-22) — Cesar injections pending audio recharge:
//   Hook v2 narration : "Il ne pouvait pas marcher. Il a fonde un empire plus grand que l'Europe medievale."
//   (remplace l'actuel "Cet enfant ne peut pas se lever. Il fondera un empire africain.")
//   Rationale : chiffre-choc + pont universel Europe = +15-20% retention 0-5s
//   CTA narration : voir SonjataCTA.tsx pour nouveau texte avec "tu" direct.

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SonjataCTA } from "./SonjataCTA";
import { Subtitles } from "./Subtitles";

const FPS = 30;
const MUSIC_VOLUME = 0.15; // ~ -16.5dB under narration
const FADE_IN_FRAMES = 2 * FPS;
const FADE_OUT_FRAMES = 2 * FPS;

// -- Hook (opening) --
const HOOK_DURATION_S = 5;
const HOOK_FRAMES = HOOK_DURATION_S * FPS;

// -- CTA (closing scene 11) --
const CTA_DURATION_S = 12.5;
const CTA_FRAMES = Math.round(CTA_DURATION_S * FPS); // 375

// -- Scene durations (from assembled clips) --
const SCENES = [
  { name: "scene1", file: "assets/sonjata-papercraft/clips/scene1-assembled.mp4", durationS: 12 },
  { name: "scene2", file: "assets/sonjata-papercraft/clips/scene2-assembled.mp4", durationS: 13 },
  { name: "scene3", file: "assets/sonjata-papercraft/clips/scene3-6panels-with-narration-v2.mp4", durationS: 13 },
  { name: "scene4", file: "assets/sonjata-papercraft/clips/scene4-final-keepandduck.mp4", durationS: 12 },
  { name: "scene5", file: "assets/sonjata-papercraft/clips/scene5-assembled.mp4", durationS: 13 },
  { name: "scene6", file: "assets/sonjata-papercraft/clips/scene6-assembled.mp4", durationS: 17 },
  // scene7 : 26s. SCENE7D etendu a 8s pour que "jamais" (108.22s master) se termine avant la fin du clip.
  { name: "scene7", file: "assets/sonjata-papercraft/clips/scene7-assembled.mp4", durationS: 26 },
  { name: "scene8", file: "assets/sonjata-papercraft/clips/scene8-assembled.mp4", durationS: 18 },
  { name: "scene9", file: "assets/sonjata-papercraft/clips/scene9-assembled.mp4", durationS: 8.8 },
  { name: "scene10", file: "assets/sonjata-papercraft/clips/scene10-assembled.mp4", durationS: 16 },
];

// Calculate start frames (scenes start AFTER the hook)
const sceneFrames = SCENES.map((s) => s.durationS * FPS);
const startFrames: number[] = [];
let cumulative = HOOK_FRAMES;
for (const f of sceneFrames) {
  startFrames.push(cumulative);
  cumulative += f;
}
const TOTAL_FRAMES = cumulative;
const SCENES_START_FRAME = HOOK_FRAMES;
const SCENES_DURATION = TOTAL_FRAMES - HOOK_FRAMES;

// CTA starts right after scene 10 ends
const CTA_START_FRAME = TOTAL_FRAMES;
const TOTAL_FRAMES_WITH_CTA = TOTAL_FRAMES + CTA_FRAMES;

export const SONJATA_SHORT_FULL_FRAMES = TOTAL_FRAMES_WITH_CTA;

// Music starts at scene 1 (Option B: hook is silent except narration) and continues through the CTA.
// Fade-in over 2s at start, fade-out over 2s at the very end (end of CTA).
const MUSIC_DURATION_FRAMES = SCENES_DURATION + CTA_FRAMES;
const musicVolume = (frame: number) => {
  const relativeFrame = frame; // frame inside <Sequence from={SCENES_START_FRAME}>, so 0-based
  const fadeIn = interpolate(
    relativeFrame,
    [0, FADE_IN_FRAMES],
    [0, MUSIC_VOLUME],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fadeOut = interpolate(
    relativeFrame,
    [MUSIC_DURATION_FRAMES - FADE_OUT_FRAMES, MUSIC_DURATION_FRAMES],
    [MUSIC_VOLUME, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return Math.min(fadeIn, fadeOut);
};

// Scene 1 narration fix : "laide" -> "bossue" (correction 2026-04-26)
// Master "laide." : 4.02s -> 4.70s. Duck master on that plage, inject "bossue." from correction clip.
// "bossue." in correction clip (sonjata-correction-laide.mp3) : 0.0s -> 0.64s (word generated alone)
// Bug 3 fix (2026-04-28): "laide" actually starts at 3.92s in master (Whisper word
// timestamps), not 4.02s as previously declared. Original code at 4.02s let 100ms of
// "laide" play before the duck. Fix at 4.12s let 200ms play (worse). Correct value
// is LAIDE_START_S = 3.92 (= end of "femme"). "femme" 3.70 -> 3.92, "laide" 3.92 -> 4.34.
const CORRECTION_LAIDE = "audio/sonjata-papercraft/sonjata-correction-laide.mp3";
const LAIDE_START_S = 3.92;
const LAIDE_END_S = 4.70;
const BOSSUE_DURATION_S = 0.64;

const LAIDE_START_FRAME = Math.round(LAIDE_START_S * FPS); // 118
const LAIDE_END_FRAME = Math.round(LAIDE_END_S * FPS);     // 141

// Scene1 master narration : 0s -> 12s. Duck "laide" plage, inject "bossue".
const NarrationScene1: React.FC = () => {
  const frame = useCurrentFrame();

  const laideDuck = interpolate(
    frame,
    [LAIDE_START_FRAME - 2, LAIDE_START_FRAME, LAIDE_END_FRAME, LAIDE_END_FRAME + 2],
    [1.0, 0.0, 0.0, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src={staticFile("audio/sonjata-papercraft/sonjata-short-v2.mp3")}
      startFrom={0}
      volume={laideDuck}
    />
  );
};

export const SonjataShortFull: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Hook: silent opening with narration-only teaser */}
      <Sequence from={0} durationInFrames={HOOK_FRAMES} premountFor={FPS}>
        <OffthreadVideo
          src={staticFile("assets/sonjata-papercraft/hook/hook-struggle-5s.mp4")}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Audio src={staticFile("audio/sonjata-papercraft/hook-narration.mp3")} />
      </Sequence>

      {/* 10 assembled scenes (each carries its own narration slice) */}
      {/* Scene narration boundaries in master (for subtitles synchronization) */}
      {SCENES.map((scene, i) => {
        // Audio fixes :
        //  - scene1 : muted + NarrationScene1 overlay (duck "laide" plage, inject "bossue" correction)
        //  - scene8 : Seedance a injecte un bruit de flute en fond (generate_audio ON) -> mute + overlay master
        const mute = scene.name === "scene1" || scene.name === "scene8";
        // Master narration timestamp where this scene's audio begins
        // Scene clips were assembled with the master narration aligned to start at scene begin
        const sceneNarrationStarts: Record<string, number> = {
          scene1: 0.0,
          scene2: 12.90,
          scene3: 26.20,
          scene4: 39.80,
          scene5: 52.94,
          scene6: 65.02,
          scene7: 83.94,
          scene8: 109.34,
          scene9: 121.00,
          scene10: 137.00,
        };
        const sceneNarrationEnds: Record<string, number> = {
          scene1: 12.90,
          scene2: 26.20,
          scene3: 39.80,
          scene4: 52.94,
          scene5: 65.02,
          scene6: 83.94,
          scene7: 108.22,
          scene8: 121.00,
          scene9: 137.00,
          scene10: 152.86,
        };
        const narrStart = sceneNarrationStarts[scene.name];
        const narrEnd = sceneNarrationEnds[scene.name];
        // Skip subtitles on scenes that already display their own on-screen text:
        //  - scene 9: shows the 3 Charte du Mande citations directly (would be doubled with subtitles)
        //  - scene 10: audio correction "deux siecles" -> "554 ans" mismatches Whisper transcript
        const showSubtitles = scene.name !== "scene10" && scene.name !== "scene9" && narrStart !== undefined;
        // Word overrides — applied to subtitle text (not audio):
        //  - GLOBAL: "Sunjata" -> "Sundiata" (correct historical spelling, all scenes)
        //  - SCENE 1: "l'aide" -> "bossue" (audio correction "laide" -> "bossue" was applied to scene 1 only)
        const globalOverrides: Record<string, string> = { sunjata: "Sundiata" };
        const scene1Override = scene.name === "scene1" ? { "l'aide": "bossue" } : {};
        const overrides = { ...globalOverrides, ...scene1Override };

        return (
          <Sequence
            key={scene.name}
            from={startFrames[i]}
            durationInFrames={sceneFrames[i]}
            premountFor={FPS}
          >
            <OffthreadVideo
              src={staticFile(scene.file)}
              muted={mute}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {showSubtitles && (
              <Subtitles
                sceneStartS={narrStart}
                sceneEndS={narrEnd}
                wordOverrides={overrides}
              />
            )}
          </Sequence>
        );
      })}

      {/* Scene 1 narration fix : "laide" -> "bossue". Clip muted, master reinjected with duck on laide plage. */}
      <Sequence from={startFrames[0]} durationInFrames={sceneFrames[0]} premountFor={FPS}>
        <NarrationScene1 />
      </Sequence>
      {/* "bossue." injection : starts at LAIDE_START_FRAME relative to scene1 start, plays from 0s */}
      <Sequence
        from={startFrames[0] + LAIDE_START_FRAME}
        durationInFrames={Math.round(BOSSUE_DURATION_S * FPS)}
        premountFor={FPS}
      >
        <Audio src={staticFile(CORRECTION_LAIDE)} />
      </Sequence>

      {/* Scene 8 narration fix : mute Seedance flute noise, overlay clean master narration */}
      {/* Scene 8 video time = 110s (frame 3300 with scene7 extended to 25s). Master narration scene 8 starts at 109.34s. */}
      {/* Offset: scene 8 starts 0.66s later than master -> start master at 109.34s + 0.66s = 110s to sync. */}
      {/* We use startFrom 109.34s and accept a tiny head offset so the narration aligns with scene 8 visuals. */}
      <Sequence
        from={startFrames[7]}
        durationInFrames={sceneFrames[7]}
        premountFor={FPS}
      >
        <Audio
          src={staticFile("audio/sonjata-papercraft/sonjata-short-v2.mp3")}
          startFrom={Math.round(109.34 * FPS)}
        />
      </Sequence>

      {/* Audio corrections for scenes 9 and 10 are handled inside SonjataScene9.tsx */}
      {/* and SonjataScene10.tsx respectively (volume duck on master + correction overlay). */}

      {/* Background music — starts at scene 1, plays through scenes + CTA, fades out over last 2s of CTA */}
      <Sequence from={SCENES_START_FRAME} durationInFrames={MUSIC_DURATION_FRAMES}>
        <Audio
          src={staticFile("audio/sonjata-papercraft/music-toumani.mp3")}
          volume={musicVolume}
        />
      </Sequence>

      {/* Scene 11 — CTA (10s) : Tu savais ? + Newsletter + Lien en bio */}
      <Sequence
        from={CTA_START_FRAME}
        durationInFrames={CTA_FRAMES}
        premountFor={FPS}
      >
        <SonjataCTA />
      </Sequence>

      {/* Subtitles handled per-scene above (each Sequence has its own Subtitles overlay with proper sceneStartS/EndS) */}
    </AbsoluteFill>
  );
};
