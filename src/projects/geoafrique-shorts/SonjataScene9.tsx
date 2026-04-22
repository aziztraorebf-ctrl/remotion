// Scene 9 — Citations Charte du Mande (7.58s)
// Remotion pur: parchment background + 3 citations (Cinzel Decorative) + Gemini symbols
// Narration: 128.08s - 135.66s
// Citation 1: "Toute vie est une vie." (128.08 - 129.18) + tree of life
// Citation 2: "Nul ne sera frappe sans raison." (130.04 - 132.82) + shield/hand
// Citation 3: "L'esclavage est aboli sur la terre du Mande." (132.90 - 135.66) + broken chains

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/CinzelDecorative";

const FPS = 30;

const TOTAL_DURATION_S = 8;
const TOTAL_FRAMES = TOTAL_DURATION_S * FPS; // 240

const { fontFamily } = loadFont();

// -- Narration timestamps (forced alignment) --
const NARRATION_START_S = 128.08;
const NARRATION_START_FRAMES = Math.round(NARRATION_START_S * FPS);
const NARRATION_END_RELATIVE_S = 135.66 - NARRATION_START_S;
const NARRATION_END_RELATIVE_FRAMES = Math.round(
  NARRATION_END_RELATIVE_S * FPS
);

// -- Citation appear times (relative to scene start) --
const CITATION_1_FRAME = 0;
const CITATION_2_FRAME = Math.round((130.04 - NARRATION_START_S) * FPS); // ~59
const CITATION_3_FRAME = Math.round((132.90 - NARRATION_START_S) * FPS); // ~145

// -- Assets --
const PARCHMENT_BG = "assets/sonjata-papercraft/clips/scene9-parchment-bg.png";
const SYMBOL_LIFE = "assets/sonjata-papercraft/clips/scene9-symbol-life.png";
const SYMBOL_JUSTICE =
  "assets/sonjata-papercraft/clips/scene9-symbol-justice.png";
const SYMBOL_FREEDOM =
  "assets/sonjata-papercraft/clips/scene9-symbol-freedom.png";
const SFX_QUILL = "assets/sonjata-papercraft/sfx/quill-writing.mp3";
const NARRATION = "audio/sonjata-papercraft/sonjata-short-v2.mp3";

export const SONJATA_SCENE9_FRAMES = TOTAL_FRAMES;

// Citation + symbol component
const Citation: React.FC<{
  text: string;
  appearFrame: number;
  yPosition: number;
  fontSize?: number;
  symbolSrc: string;
  symbolSize?: number;
  symbolYOffset?: number;
}> = ({
  text,
  appearFrame,
  yPosition,
  fontSize = 46,
  symbolSrc,
  symbolSize = 160,
  symbolYOffset = 90,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - appearFrame;
  if (localFrame < 0) return null;

  const textOpacity = spring({
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
    [25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Symbol appears 8 frames after text
  const symbolLocalFrame = localFrame - 8;
  const symbolOpacity =
    symbolLocalFrame < 0
      ? 0
      : spring({
          frame: symbolLocalFrame,
          fps,
          config: { damping: 25, stiffness: 70 },
        });

  const symbolScale =
    symbolLocalFrame < 0
      ? 0
      : interpolate(
          spring({
            frame: symbolLocalFrame,
            fps,
            config: { damping: 15, stiffness: 120 },
          }),
          [0, 1],
          [0.5, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

  return (
    <>
      {/* Citation text */}
      <div
        style={{
          position: "absolute",
          top: yPosition,
          left: 60,
          right: 60,
          opacity: textOpacity,
          transform: `translateY(${translateY}px)`,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize,
            fontWeight: 700,
            color: "#3D2B1F",
            lineHeight: 1.5,
            margin: 0,
            textShadow: "1px 1px 3px rgba(61, 43, 31, 0.25)",
            letterSpacing: "0.03em",
            whiteSpace: "pre-line",
          }}
        >
          {text}
        </p>
      </div>

      {/* Symbol below text */}
      <div
        style={{
          position: "absolute",
          top: yPosition + symbolYOffset,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: symbolOpacity,
          transform: `scale(${symbolScale})`,
        }}
      >
        <Img
          src={staticFile(symbolSrc)}
          style={{
            width: symbolSize,
            height: symbolSize,
            objectFit: "contain",
          }}
        />
      </div>
    </>
  );
};

// Narration with cutoff
const NarrationWithCutoff: React.FC = () => {
  const frame = useCurrentFrame();

  const volume = interpolate(
    frame,
    [NARRATION_END_RELATIVE_FRAMES - 3, NARRATION_END_RELATIVE_FRAMES],
    [1.0, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src={staticFile(NARRATION)}
      startFrom={NARRATION_START_FRAMES}
      volume={volume}
    />
  );
};

// Subtle Ken Burns zoom on parchment
const ParchmentBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, TOTAL_FRAMES], [1.0, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Img
        src={staticFile(PARCHMENT_BG)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const SonjataScene9: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#2A1F14" }}>
      <ParchmentBackground />

      {/* Citation 1: Toute vie est une vie + Tree of Life */}
      <Citation
        text={"\u00AB Toute vie est une vie. \u00BB"}
        appearFrame={CITATION_1_FRAME}
        yPosition={280}
        fontSize={52}
        symbolSrc={SYMBOL_LIFE}
        symbolSize={180}
        symbolYOffset={100}
      />

      {/* Citation 2: Nul ne sera frappe sans raison + Shield */}
      <Citation
        text={"\u00AB Nul ne sera frapp\u00E9\nsans raison. \u00BB"}
        appearFrame={CITATION_2_FRAME}
        yPosition={680}
        fontSize={46}
        symbolSrc={SYMBOL_JUSTICE}
        symbolSize={160}
        symbolYOffset={120}
      />

      {/* Citation 3: L'esclavage est aboli + Broken Chains */}
      <Citation
        text={
          "\u00AB L\u2019esclavage est aboli\nsur la terre du Mand\u00E9. \u00BB"
        }
        appearFrame={CITATION_3_FRAME}
        yPosition={1100}
        fontSize={44}
        symbolSrc={SYMBOL_FREEDOM}
        symbolSize={180}
        symbolYOffset={130}
      />

      {/* SFX: quill writing on each citation */}
      <Sequence from={CITATION_1_FRAME} durationInFrames={FPS * 2}>
        <Audio src={staticFile(SFX_QUILL)} volume={0.5} />
      </Sequence>
      <Sequence from={CITATION_2_FRAME} durationInFrames={FPS * 2}>
        <Audio src={staticFile(SFX_QUILL)} volume={0.5} />
      </Sequence>
      <Sequence from={CITATION_3_FRAME} durationInFrames={FPS * 2}>
        <Audio src={staticFile(SFX_QUILL)} volume={0.5} />
      </Sequence>

      {/* Narration */}
      <Sequence from={0} durationInFrames={TOTAL_FRAMES}>
        <NarrationWithCutoff />
      </Sequence>
    </AbsoluteFill>
  );
};
