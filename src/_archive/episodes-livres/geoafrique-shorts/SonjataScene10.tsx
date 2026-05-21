// Scene 10 — Close + droits de l'homme (15.86s)
// 10A: Timeline 1235 vs 1789 (137.00-142.26s, 6s) — Remotion text animation
// 10B: Split vertical video — enfant rampant + roi debout (143.36-149.56s, 7s)
// 10C: Close signature (150.54-152.86s, 3s) — title + fade to black
// Total: 16s, narration continuous 137.00s - 152.86s

import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/CinzelDecorative";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";

const FPS = 30;

// -- Durations --
const SCENE10A_DURATION_S = 6;
const SCENE10A_FRAMES = SCENE10A_DURATION_S * FPS; // 180
const SCENE10B_DURATION_S = 7;
const SCENE10B_FRAMES = SCENE10B_DURATION_S * FPS; // 210
const SCENE10C_DURATION_S = 3;
const SCENE10C_FRAMES = SCENE10C_DURATION_S * FPS; // 90
const TOTAL_FRAMES = SCENE10A_FRAMES + SCENE10B_FRAMES + SCENE10C_FRAMES; // 480 = 16s

const START_10B = SCENE10A_FRAMES; // 180
const START_10C = START_10B + SCENE10B_FRAMES; // 390

// -- Fonts --
const { fontFamily: cinzelDeco } = loadFont();
const { fontFamily: cinzel } = loadCinzel();

// -- Assets --
const CLIP_SCENE2 = "assets/sonjata-papercraft/clips/scene2-humiliation-v2-13s.mp4";
const CLIP_SCENE8A = "assets/sonjata-papercraft/clips/scene8a-mansa-9s.mp4";
const NARRATION = "audio/sonjata-papercraft/sonjata-short-v2.mp3";

// -- Narration --
const NARRATION_START_S = 137.00;
const NARRATION_START_FRAMES = Math.round(NARRATION_START_S * FPS);
const NARRATION_END_RELATIVE_S = 152.86 - NARRATION_START_S; // 15.86s
const NARRATION_END_RELATIVE_FRAMES = Math.round(
  NARRATION_END_RELATIVE_S * FPS
);

// -- Start frames for split clips --
// Scene 2 frame 5 (matrone pointing) ~ frame 210 at source fps
const SCENE2_START_FRAME = Math.round(7.0 * FPS); // 7s into the clip
// Scene 8A frame 1 (scepter raised) ~ frame 10
const SCENE8A_START_FRAME = Math.round(0.3 * FPS); // 0.3s into the clip

export const SONJATA_SCENE10_FRAMES = TOTAL_FRAMES;

// ====== 10A: Timeline 1235 vs 1789 ======
const Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "1235" appears at frame 0 (with narration "douze cent trente-cinq")
  // Narration says 1235 at ~138.66-140.34 -> relative 1.66-3.34s -> frames 50-100
  const year1235Frame = Math.round((138.66 - NARRATION_START_S) * FPS); // ~50
  const year1789Frame = Math.round((141.74 - NARRATION_START_S) * FPS); // ~142 ("les Europeens")

  const opacity1235 = frame >= year1235Frame
    ? spring({ frame: frame - year1235Frame, fps, config: { damping: 30, stiffness: 80 } })
    : 0;

  const opacity1789 = frame >= year1789Frame
    ? spring({ frame: frame - year1789Frame, fps, config: { damping: 30, stiffness: 80 } })
    : 0;

  // Timeline bar grows between the two years
  const barProgress = frame >= year1789Frame
    ? spring({ frame: frame - year1789Frame, fps, config: { damping: 20, stiffness: 60 } })
    : 0;

  // "554 ans" label
  const labelOpacity = frame >= year1789Frame + 15
    ? spring({ frame: frame - (year1789Frame + 15), fps, config: { damping: 30, stiffness: 80 } })
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#2A1F14",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 1235 - left */}
      <div
        style={{
          position: "absolute",
          top: 700,
          left: 80,
          opacity: opacity1235,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: cinzelDeco,
            fontSize: 100,
            fontWeight: 700,
            color: "#D4A843",
            margin: 0,
            textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          1235
        </p>
        <p
          style={{
            fontFamily: cinzel,
            fontSize: 28,
            color: "#C4A265",
            margin: "10px 0 0 0",
            letterSpacing: "0.05em",
          }}
        >
          Charte du Mand&eacute;
        </p>
      </div>

      {/* Timeline bar */}
      <div
        style={{
          position: "absolute",
          top: 860,
          left: 140,
          right: 140,
          height: 4,
          backgroundColor: "rgba(212, 168, 67, 0.3)",
          borderRadius: 2,
        }}
      >
        <div
          style={{
            width: `${barProgress * 100}%`,
            height: "100%",
            backgroundColor: "#D4A843",
            borderRadius: 2,
          }}
        />
      </div>

      {/* 554 ans d'avance label */}
      <div
        style={{
          position: "absolute",
          top: 880,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: labelOpacity,
        }}
      >
        <p
          style={{
            fontFamily: cinzel,
            fontSize: 32,
            fontWeight: 700,
            color: "#D4A843",
            margin: 0,
            letterSpacing: "0.1em",
          }}
        >
          554 ans d&apos;avance
        </p>
      </div>

      {/* 1789 - right */}
      <div
        style={{
          position: "absolute",
          top: 700,
          right: 80,
          opacity: opacity1789,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: cinzelDeco,
            fontSize: 100,
            fontWeight: 700,
            color: "#8B7355",
            margin: 0,
            textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          1789
        </p>
        <p
          style={{
            fontFamily: cinzel,
            fontSize: 28,
            color: "#9B8B6B",
            margin: "10px 0 0 0",
            letterSpacing: "0.05em",
          }}
        >
          D&eacute;claration des Droits
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ====== 10B: Split vertical — enfant rampant | roi debout ======
const SplitVertical: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split reveal animation
  const splitReveal = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 60 },
  });

  // Divider line
  const dividerOpacity = interpolate(splitReveal, [0.5, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Left side: Scene 2 humiliation (enfant rampant) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          overflow: "hidden",
          transform: `translateX(${interpolate(splitReveal, [0, 1], [-540, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile(CLIP_SCENE2)}
          startFrom={SCENE2_START_FRAME}
          muted
          style={{
            width: "200%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      {/* Right side: Scene 8A Mansa (roi debout) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          overflow: "hidden",
          transform: `translateX(${interpolate(splitReveal, [0, 1], [540, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile(CLIP_SCENE8A)}
          startFrom={SCENE8A_START_FRAME}
          muted
          style={{
            width: "200%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "40% center",
            marginLeft: "-80%",
          }}
        />
      </div>

      {/* Center divider line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: 4,
          height: "100%",
          backgroundColor: "#D4A843",
          transform: "translateX(-50%)",
          opacity: dividerOpacity,
          boxShadow: "0 0 12px rgba(212, 168, 67, 0.6)",
        }}
      />
    </AbsoluteFill>
  );
};

// ====== 10C: Close signature ======
const CloseSignature: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 80 },
  });

  const titleScale = interpolate(
    spring({ frame, fps, config: { damping: 20, stiffness: 100 } }),
    [0, 1],
    [0.85, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade to black at end
  const fadeToBlack = interpolate(
    frame,
    [SCENE10C_FRAMES - 20, SCENE10C_FRAMES],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#1A120B" }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        <p
          style={{
            fontFamily: cinzelDeco,
            fontSize: 72,
            fontWeight: 700,
            color: "#D4A843",
            margin: 0,
            textAlign: "center",
            textShadow: "2px 2px 12px rgba(0,0,0,0.7)",
            letterSpacing: "0.05em",
          }}
        >
          Soundjata
        </p>
        <p
          style={{
            fontFamily: cinzelDeco,
            fontSize: 72,
            fontWeight: 700,
            color: "#D4A843",
            margin: "10px 0 0 0",
            textAlign: "center",
            textShadow: "2px 2px 12px rgba(0,0,0,0.7)",
            letterSpacing: "0.05em",
          }}
        >
          Keita
        </p>
        <div
          style={{
            width: 200,
            height: 3,
            backgroundColor: "#D4A843",
            margin: "30px 0",
            opacity: 0.6,
          }}
        />
        <p
          style={{
            fontFamily: cinzel,
            fontSize: 30,
            color: "#C4A265",
            margin: 0,
            textAlign: "center",
            letterSpacing: "0.15em",
          }}
        >
          H&Eacute;ROS OUBLI&Eacute;S
        </p>
      </AbsoluteFill>

      {/* Fade to black */}
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: fadeToBlack,
        }}
      />
    </AbsoluteFill>
  );
};

// correction audio: phrase 2 replaces "deux siècles avant les Européens"
const CORRECTION = "audio/sonjata-papercraft/sonjata-correction-s9s10.mp3";
const CORRECTION_P2_START_S = 5.440;
const CORRECTION_P2_END_S = 11.639;
// Bug 2 fix (2026-04-28): correction REPLACES full opening phrase, not just "deux siècles".
// Master says "ces mots furent prononcés en deux siècles" while correction says
// "Ces mots furent dit en 1235...". Both start with "ces mots furent" -> double voice.
// Duck must start at frame 0, not frame 50.
const DUCK_START = 0;
// Bug 4 fix (2026-04-28): DUCK_END was 202 frames (master 143.73s) which truncated
// "Un homme..." (master 143.18 -> 143.82s). Whisper word timestamps confirmed:
// phrase 1 master ends at 142.28s, silence 142.28-143.18s, "Un homme" starts 143.18s.
// Correction P2 ends at 6.2s (= scene10 frame 186 = master 143.20s relative to start),
// which aligns perfectly with master "Un homme" starting at 143.18s. So DUCK_END = 186.
const DUCK_END = 186;

// Narration with cutoff + duck on "deux siècles" plage (replaced by correction phrase 2)
const NarrationWithCutoff: React.FC = () => {
  const frame = useCurrentFrame();

  const endFade = interpolate(
    frame,
    [NARRATION_END_RELATIVE_FRAMES - 3, NARRATION_END_RELATIVE_FRAMES],
    [1.0, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Duck master during "deux siècles avant les Européens" (correction takes over)
  const p2Duck = interpolate(
    frame,
    [DUCK_START - 2, DUCK_START, DUCK_END, DUCK_END + 2],
    [1.0, 0.0, 0.0, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src={staticFile(NARRATION)}
      startFrom={NARRATION_START_FRAMES}
      volume={Math.min(endFade, p2Duck)}
    />
  );
};

export const SonjataScene10: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 10A: Timeline 1235 vs 1789 (frames 0-180) */}
      <Sequence from={0} durationInFrames={SCENE10A_FRAMES} premountFor={FPS}>
        <Timeline />
      </Sequence>

      {/* 10B: Split vertical (frames 180-390) */}
      <Sequence
        from={START_10B}
        durationInFrames={SCENE10B_FRAMES}
        premountFor={FPS}
      >
        <SplitVertical />
      </Sequence>

      {/* 10C: Close signature (frames 390-480) */}
      <Sequence
        from={START_10C}
        durationInFrames={SCENE10C_FRAMES}
        premountFor={FPS}
      >
        <CloseSignature />
      </Sequence>

      {/* Narration (master ducked during "deux siècles" plage) */}
      <Sequence from={0} durationInFrames={TOTAL_FRAMES}>
        <NarrationWithCutoff />
      </Sequence>

      {/* Correction phrase 2 : "cinq cent cinquante-quatre ans avant la Déclaration des Droits de l'Homme" */}
      {/* Starts at DUCK_START (same frame master is ducked), plays from 5.440s in correction file */}
      <Sequence
        from={DUCK_START}
        durationInFrames={Math.round((CORRECTION_P2_END_S - CORRECTION_P2_START_S) * FPS)}
      >
        <Audio
          src={staticFile(CORRECTION)}
          startFrom={Math.round(CORRECTION_P2_START_S * FPS)}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
