// ThiaroyeShortV5 — Final Short composition (9:16, 30 FPS, 101.84s)
//
// Structure:
//   0.00s -  5.04s : HOOK (paper-craft camp Thiaroye, narration "Ils ont libere la France...")
//   5.04s - 91.44s : 8 narrative scenes (Seedance/Video Extend clips, all muted)
//  91.44s - 94.44s : Scene 6 plein ecran (clip background, narration "Ils ont libere un continent qui les oublie.")
//  94.44s -101.84s : Scene 6 background CONTINUES + split-screen overlay (Scene 1 / Scene 6) + CTA cascaded text
//
// Audio:
//   - Narration ElevenLabs : 0 -> 101.84s (full coverage, volume 1.0)
//   - Music variante B (kora-ngoni) : starts at frame 0 with 2s fade-in, 2s fade-out, volume 0.18
//   - All video clips muted (audio comes only from narration + music)
//
// Source of truth: src/projects/geoafrique-shorts/manifests/thiaroye-v5-timing.ts
// Audio-derived timing: every from / durationInFrames is computed from the timing manifest.

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/CinzelDecorative";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import {
  AUDIO,
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
  CTA,
  FPS,
  HOOK,
  SCENES,
  TOTAL_FRAMES,
} from "./manifests/thiaroye-v5-timing";
import { Subtitles } from "./Subtitles";
import { WHISPER_WORDS_THIAROYE } from "./whisper-words-thiaroye";

// ----------------------------------------------------------------------------
// Fonts (loaded at module import, async-ready by render time via premountFor)
// ----------------------------------------------------------------------------

const { fontFamily: cinzelDeco } = loadFont();
const { fontFamily: cinzel } = loadCinzel();

// ----------------------------------------------------------------------------
// Constants exported for Root.tsx
// ----------------------------------------------------------------------------

export const THIAROYE_V5_FRAMES = TOTAL_FRAMES;
export const THIAROYE_V5_WIDTH = COMPOSITION_WIDTH;
export const THIAROYE_V5_HEIGHT = COMPOSITION_HEIGHT;
export const THIAROYE_V5_FPS = FPS;

// ----------------------------------------------------------------------------
// Asset path overrides
//
// The timing manifest references "audio/thiaroye-1944/music-variantes/B.mp3"
// but the actual file on disk is "variante-C-balafon-solo.mp3". Aziz validated
// variante C (balafon solo) over B (kora-ngoni) on 2026-04-25.
// ----------------------------------------------------------------------------

const MUSIC_PATH = "audio/thiaroye-1944/music-variantes/variante-C-balafon-solo.mp3";

// Hook SFX track : keep-and-duck (full volume during silence, ducked when narration starts).
// Extracted from hook-thiaroye-9x16.mp4 (original hook with ambient camp + rifle SFX).
const HOOK_SFX_PATH = "audio/thiaroye-1944/hook-sfx.aac";

// Scene1 complement SFX : harbor/ocean ambiance on the Video Extend portion (no embedded audio).
// ElevenLabs sound-generation v2 — port calme, vagues contre coque, mouettes, cordes.
const SCENE1_COMPLEMENT_SFX = "audio/thiaroye-1944/sfx-ocean-port-v2.mp3";

// ----------------------------------------------------------------------------
// Hook SFX volume : keep-and-duck
// Full volume (0.8) at start, ducks to 0.15 once narration kicks in (~frame 2).
// Narration starts at 0.08s = frame 2. We fade from 0.8 -> 0.15 between frames 2-8.
// ----------------------------------------------------------------------------

const hookSfxVolume = (frame: number): number => {
  return interpolate(frame, [0, 2, 8], [0.8, 0.8, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// ----------------------------------------------------------------------------
// Music volume curve : fade-in 2s, fade-out 2s, plateau at musicVolume
// ----------------------------------------------------------------------------

const FADE_IN_FRAMES = Math.round(AUDIO.musicFadeInS * FPS);
const FADE_OUT_FRAMES = Math.round(AUDIO.musicFadeOutS * FPS);
const MUSIC_PLATEAU = AUDIO.musicVolume;

const musicVolume = (frame: number): number => {
  const fadeIn = interpolate(
    frame,
    [0, FADE_IN_FRAMES],
    [0, MUSIC_PLATEAU],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fadeOut = interpolate(
    frame,
    [TOTAL_FRAMES - FADE_OUT_FRAMES, TOTAL_FRAMES],
    [MUSIC_PLATEAU, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return Math.min(fadeIn, fadeOut);
};

// ----------------------------------------------------------------------------
// SVG Icons (reused from SonjataCTA pattern, gold accent)
// ----------------------------------------------------------------------------

const MemorialIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    {/* Heart-shaped commemorative icon */}
    <path
      d="M22 36L19.3 33.5C10 25.2 4 19.7 4 13C4 7.5 8.5 3 14 3C17.1 3 20.1 4.5 22 6.9C23.9 4.5 26.9 3 30 3C35.5 3 40 7.5 40 13C40 19.7 34 25.2 24.7 33.5L22 36Z"
      stroke="#D4A843"
      strokeWidth="2.5"
      fill="#D4A843"
      fillOpacity="0.15"
    />
  </svg>
);

const BellIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <path
      d="M22 4C22 4 14 4 14 14V24L10 28V30H34V28L30 24V14C30 4 22 4 22 4Z"
      stroke="#D4A843"
      strokeWidth="2.5"
      strokeLinejoin="round"
      fill="#D4A843"
      fillOpacity="0.15"
    />
    <path
      d="M18 30C18 32.2 19.8 34 22 34C24.2 34 26 32.2 26 30"
      stroke="#D4A843"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="22" cy="8" r="2" fill="#D4A843" />
  </svg>
);

const LinkIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect
      x="8"
      y="10"
      width="28"
      height="20"
      rx="3"
      stroke="#D4A843"
      strokeWidth="2.5"
      fill="#D4A843"
      fillOpacity="0.15"
    />
    <path
      d="M8 16L22 24L36 16"
      stroke="#D4A843"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const iconFor = (name: "Memorial" | "Bell" | "Link"): React.ReactNode => {
  if (name === "Memorial") return <MemorialIcon />;
  if (name === "Bell") return <BellIcon />;
  return <LinkIcon />;
};

// ----------------------------------------------------------------------------
// SplitVertical — adapter from SonjataScene10 pattern
// Left half: Scene 1 (s1-retour-v5.mp4)
// Right half: Scene 6 (continues the same file the background uses)
// Spring reveal from -540 / +540, gold divider with shadow.
// ----------------------------------------------------------------------------

const SplitVertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const splitReveal = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 60 },
  });

  const dividerOpacity = interpolate(splitReveal, [0.5, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftTranslate = interpolate(splitReveal, [0, 1], [-540, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rightTranslate = interpolate(splitReveal, [0, 1], [540, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Left half: Scene 1 navire arrivant */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          overflow: "hidden",
          transform: `translateX(${leftTranslate}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile(CTA.splitScreen.leftClip)}
          muted
          style={{
            width: "200%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      {/* Right half: Scene 6 continued (same file as background, restarts here) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          overflow: "hidden",
          transform: `translateX(${rightTranslate}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile(CTA.splitScreen.rightClip)}
          muted
          style={{
            width: "200%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            marginLeft: "-100%",
          }}
        />
      </div>

      {/* Center vertical divider */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: CTA.splitScreen.dividerWidthPx,
          height: "100%",
          backgroundColor: CTA.splitScreen.dividerColor,
          transform: "translateX(-50%)",
          opacity: dividerOpacity,
          boxShadow: "0 0 12px rgba(212, 168, 67, 0.6)",
        }}
      />
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------------------
// ThiaroyeCTALine — single text line with cascade reveal (spring fade + slide)
// ----------------------------------------------------------------------------

const ThiaroyeCTALine: React.FC<{
  headline: string;
  subtext: string;
  appearFrame: number;
  yPosition: number;
  icon: React.ReactNode;
  fontSize?: number;
}> = ({ headline, subtext, appearFrame, yPosition, icon, fontSize = 42 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - appearFrame;
  if (localFrame < 0) return null;

  const opacity = spring({
    frame: localFrame,
    fps,
    config: { damping: 30, stiffness: 80 },
  });

  const translateY = interpolate(
    spring({
      frame: localFrame,
      fps,
      config: { damping: 20, stiffness: 100 },
    }),
    [0, 1],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: yPosition,
        left: 60,
        right: 60,
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {icon}
      <p
        style={{
          fontFamily: cinzelDeco,
          fontSize,
          fontWeight: 700,
          color: CTA.style.accentColor,
          margin: 0,
          textAlign: "center",
          lineHeight: 1.4,
          textShadow: "2px 2px 8px rgba(0,0,0,0.85)",
        }}
      >
        {headline}
      </p>
      <p
        style={{
          fontFamily: cinzel,
          fontSize: 26,
          color: "#E8D9A8",
          margin: 0,
          textAlign: "center",
          letterSpacing: "0.06em",
          lineHeight: 1.3,
          textShadow: "2px 2px 6px rgba(0,0,0,0.85)",
        }}
      >
        {subtext}
      </p>
    </div>
  );
};

// ----------------------------------------------------------------------------
// ThiaroyeCTA — text overlay with 3 cascaded lines + dark legibility panel
// Drawn ON TOP of the split-screen (no own background — split-screen is the bg).
// ----------------------------------------------------------------------------

const Y_LINE_1 = 380;
const Y_LINE_2 = 780;
const Y_LINE_3 = 1280;

const ThiaroyeCTA: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle dark panel behind the text for legibility (fades in over 0.5s)
  const panelOpacity = interpolate(frame, [0, 15], [0, CTA.style.panelOpacity], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Dark legibility gradient panel (top + bottom darkened for text readability) */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(26,18,11,0.65) 0%, rgba(26,18,11,0.25) 35%, rgba(26,18,11,0.25) 65%, rgba(26,18,11,0.85) 100%)",
          opacity: panelOpacity,
        }}
      />

      {CTA.textLines.map((line, i) => {
        const yPositions = [Y_LINE_1, Y_LINE_2, Y_LINE_3];
        const fontSizes = [44, 40, 38];
        return (
          <ThiaroyeCTALine
            key={i}
            headline={line.headline}
            subtext={line.subtext}
            appearFrame={line.appearAtFrame}
            yPosition={yPositions[i]}
            icon={iconFor(line.icon)}
            fontSize={fontSizes[i]}
          />
        );
      })}

      {/* Signature — centered between Newsletter (Y~780) and Lien en bio (Y~1280) */}
      <div
        style={{
          position: "absolute",
          top: 1060,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [0, 20], [0, 1.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <p
          style={{
            fontFamily: cinzelDeco,
            fontSize: 40,
            fontWeight: 700,
            color: "#D4A843",
            margin: 0,
            letterSpacing: "0.12em",
            textShadow: "2px 2px 8px rgba(0,0,0,0.85)",
          }}
        >
          {"Héros Oublié"}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------------------
// CROSSFADE_FRAMES — duration of fade-to-black at scene junctions (both sides).
// 8 frames = ~0.27s at 30fps. Adjust here to tune all transitions at once.
// ----------------------------------------------------------------------------

const CROSSFADE_FRAMES = 8;

// ----------------------------------------------------------------------------
// SFX volume levels per scene (ducked under narration at 1.0).
// Scenes not listed here stay muted. Scene3a louder for dramatic impact.
// Volume ramps with the visual fade-in/fade-out (synchronized).
// ----------------------------------------------------------------------------

const SFX_VOLUMES: Record<string, number> = {
  scene1: 0.42,  // Le Retour — ambiance quai/navire (premier clip seulement)
  scene3a: 0.40, // Le Massacre — tirs : impact dramatique fort (inchange)
  scene3b: 0.45, // Le Massacre — aftermath : ambiance sourde
  scene4a: 0.45, // Effacement — archives : frottement papier/documents
  scene4b: 0.42, // Effacement — bruits de papier legers
  scene5a: 0.45, // Verite — Biram Senghor : ambiance contemplative
};

// ----------------------------------------------------------------------------
// SceneVideo — single-file or two-file scene with optional internal concat
// Handles freeze-on-last-frame implicitly by setting Sequence durationInFrames
// >= clip duration (Remotion freezes naturally at end of OffthreadVideo).
// ----------------------------------------------------------------------------

const SceneVideo: React.FC<{ scene: (typeof SCENES)[number] }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const totalFrames = scene.durationFrames;

  // Crossfade opacity: fade-in first CROSSFADE_FRAMES, fade-out last CROSSFADE_FRAMES.
  const opacity = interpolate(
    frame,
    [0, CROSSFADE_FRAMES, totalFrames - CROSSFADE_FRAMES, totalFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const peakSfxVolume = SFX_VOLUMES[scene.id] ?? 0;
  const hasSfx = peakSfxVolume > 0;

  // SFX volume mirrors the visual fade curve — rises and falls with the image.
  const sfxVolume = (f: number): number =>
    interpolate(
      f,
      [0, CROSSFADE_FRAMES, totalFrames - CROSSFADE_FRAMES, totalFrames],
      [0, peakSfxVolume, peakSfxVolume, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  // Single file: render straight, freeze handled by Sequence outliving clip.
  if (scene.files.length === 1) {
    return (
      <AbsoluteFill style={{ opacity }}>
        <OffthreadVideo
          src={staticFile(scene.files[0].src)}
          muted={!hasSfx}
          volume={hasSfx ? sfxVolume : undefined}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
    );
  }

  // Two-file concat: first clip may have SFX, second clip (Video Extend) stays muted.
  const firstClipFrames = Math.round(scene.files[0].durationS * FPS);
  const firstClipSfxVolume = (f: number): number =>
    interpolate(
      f,
      [0, CROSSFADE_FRAMES, firstClipFrames],
      [0, peakSfxVolume, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  return (
    <AbsoluteFill style={{ opacity }}>
      <Sequence from={0} durationInFrames={firstClipFrames} premountFor={FPS}>
        <OffthreadVideo
          src={staticFile(scene.files[0].src)}
          muted={!hasSfx}
          volume={hasSfx ? firstClipSfxVolume : undefined}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Sequence>
      <Sequence
        from={firstClipFrames}
        durationInFrames={scene.durationFrames - firstClipFrames}
        premountFor={FPS}
      >
        <OffthreadVideo
          src={staticFile(scene.files[1].src)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Ocean port ambiance on Video Extend complement (no embedded audio) */}
        {scene.id === "scene1" && (
          <Audio
            src={staticFile(SCENE1_COMPLEMENT_SFX)}
            volume={(f) =>
              interpolate(
                f,
                [0, CROSSFADE_FRAMES, scene.durationFrames - firstClipFrames - CROSSFADE_FRAMES, scene.durationFrames - firstClipFrames],
                [0, 0.35, 0.35, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )
            }
          />
        )}
      </Sequence>
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------------------
// Main composition
// ----------------------------------------------------------------------------

export const ThiaroyeShortV5: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* HOOK — 0 -> 5.04s, video paper-craft camp Thiaroye, MUTED */}
      <Sequence
        from={HOOK.startFrame}
        durationInFrames={HOOK.durationFrames}
        premountFor={FPS}
      >
        <OffthreadVideo
          src={staticFile(HOOK.videoFile)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Sequence>

      {/* 8 narrative scenes — 5.04s -> 91.44s, all muted */}
      {SCENES.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationFrames}
          premountFor={FPS}
        >
          <SceneVideo scene={scene} />
        </Sequence>
      ))}

      {/* CTA phase — 91.44s -> 101.84s. Scene 6 plein ecran in background for the
          entire phase. Split-screen + texte CTA overlay starts at 94.44s
          (relative frame 90 from CTA start). */}
      <Sequence
        from={CTA.startFrame}
        durationInFrames={CTA.durationFrames}
        premountFor={FPS}
      >
        {/* Background : Scene 6 plein ecran (continues from frame 0 of the clip).
            This gives ~3s of plein ecran before the split-screen reveals. */}
        <OffthreadVideo
          src={staticFile(CTA.scene6BackgroundFile)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Split-screen + CTA text overlay starts at relative frame 90 (= 94.44s
            absolute, syncs with narration "Maintenant,"). */}
        <Sequence
          from={CTA.splitScreen.startFrameRelative}
          durationInFrames={CTA.splitScreen.durationFrames}
          premountFor={FPS}
        >
          <SplitVertical />
          <ThiaroyeCTA />
        </Sequence>
      </Sequence>

      {/* Audio tracks — narration full duration + music with fade in/out */}
      <Audio
        src={staticFile(AUDIO.narration)}
        volume={1.0}
      />
      <Audio
        src={staticFile(MUSIC_PATH)}
        volume={musicVolume}
      />

      {/* Hook SFX — ambient camp + rifle click, keep-and-duck under narration */}
      <Sequence from={HOOK.startFrame} durationInFrames={HOOK.durationFrames}>
        <Audio
          src={staticFile(HOOK_SFX_PATH)}
          volume={hookSfxVolume}
        />
      </Sequence>

      {/* Subtitles karaoke (rouge sang Thiaroye) — couvre toute la composition,
          mais s'arrete avant le CTA pour ne pas masquer les textes overlay. */}
      <Sequence from={0} durationInFrames={CTA.startFrame}>
        <Subtitles
          sceneStartS={0}
          sceneEndS={CTA.startS}
          highlightColor="#E63946"
          words={WHISPER_WORDS_THIAROYE}
          bottomOffset={220}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
