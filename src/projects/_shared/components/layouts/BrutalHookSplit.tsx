/**
 * BrutalHookSplit — Template hook Souverain validé Silicon Savannah Beat1
 *
 * Structure :
 *   - Haut (PHOTO_RATIO %) : photo Ken Burns diagonal (zoom + drift latéral)
 *   - Bas (1 - PHOTO_RATIO) : fond sombre avec lignes typewriter + accent Bebas Neue
 *
 * Paramètres :
 *   - photoSrc        : chemin staticFile() vers la photo (objectFit cover)
 *   - bgSrc           : chemin staticFile() vers le background texture (optionnel)
 *   - lines           : tableau de lignes narration (null = spacer)
 *   - lineTriggers    : frame d'apparition de chaque ligne (même index que lines)
 *   - accentText      : texte Bebas Neue doré (ex: "LE KENYA.")
 *   - accentTrigger   : frame d'apparition de l'accent
 *   - sourceLabel     : texte source discret en bas (ex: "GSMA · WORLD BANK 2025")
 *   - tagLabel        : étiquette dorée en haut à gauche (ex: "KENYA · M-PESA")
 *   - accentColor     : couleur accent (défaut #FFB800)
 *   - photoRatio      : proportion photo/texte (défaut 0.55)
 *   - kenBurnsScale   : zoom final Ken Burns (défaut 1.15)
 *   - kenBurnsDriftX  : dérive latérale en % de largeur (défaut -0.04 = gauche)
 *   - kenBurnsDriftY  : dérive verticale en % hauteur photo (défaut -0.03 = haut)
 *   - duration        : durée totale en frames
 */

import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface BrutalHookSplitProps {
  photoSrc: string;
  bgSrc?: string;
  lines: (string | null)[];
  lineTriggers: number[];
  accentText: string;
  accentTrigger: number;
  sourceLabel?: string;
  tagLabel?: string;
  accentColor?: string;
  photoRatio?: number;
  kenBurnsScale?: number;
  kenBurnsDriftX?: number;
  kenBurnsDriftY?: number;
  duration: number;
}

const BG_DEFAULT = "#0a0a0a";

export const BrutalHookSplit: React.FC<BrutalHookSplitProps> = ({
  photoSrc,
  bgSrc,
  lines,
  lineTriggers,
  accentText,
  accentTrigger,
  sourceLabel,
  tagLabel,
  accentColor = "#FFB800",
  photoRatio = 0.55,
  kenBurnsScale = 1.15,
  kenBurnsDriftX = -0.04,
  kenBurnsDriftY = -0.03,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const PHOTO_H = Math.round(height * photoRatio);
  const TEXT_H = height - PHOTO_H;

  // Ken Burns diagonal
  const kbScale = interpolate(frame, [0, duration], [1.0, kenBurnsScale], {
    extrapolateRight: "clamp",
  });
  const kbX = interpolate(frame, [0, duration], [0, width * kenBurnsDriftX], {
    extrapolateRight: "clamp",
  });
  const kbY = interpolate(frame, [0, duration], [0, PHOTO_H * kenBurnsDriftY], {
    extrapolateRight: "clamp",
  });

  // Zone texte reveal
  const textReveal = spring({
    frame: frame - 8,
    fps,
    config: { damping: 120, stiffness: 60 },
    durationInFrames: 35,
  });
  const textY = interpolate(textReveal, [0, 1], [60, 0], { extrapolateRight: "clamp" });
  const textOpacity = interpolate(textReveal, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Tag reveal
  const tagProgress = spring({
    frame: frame - 4,
    fps,
    config: { damping: 200, stiffness: 120 },
    durationInFrames: 20,
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Background texture optionnel */}
      {bgSrc && (
        <Img
          src={bgSrc}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {/* Zone photo — Ken Burns diagonal dans overflow:hidden */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height: PHOTO_H,
          overflow: "hidden",
        }}
      >
        <Img
          src={photoSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${kbScale}) translate(${kbX}px, ${kbY}px)`,
            transformOrigin: "center center",
          }}
        />
        {/* Gradient bas photo → fond sombre */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 220,
            background: `linear-gradient(to bottom, transparent, ${BG_DEFAULT})`,
          }}
        />
      </div>

      {/* Tag étiquette en haut à gauche */}
      {tagLabel && (
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 0,
            background: accentColor,
            color: BG_DEFAULT,
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontSize: 32,
            letterSpacing: "0.25em",
            padding: "10px 40px 8px 40px",
            opacity: tagProgress,
          }}
        >
          {tagLabel}
        </div>
      )}

      {/* Zone texte bas — fond sombre, contenu ancré en bas */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: TEXT_H,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 60px 60px 60px",
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          overflow: "hidden",
        }}
      >
        {/* Lignes narration */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {lines.map((line, i) => {
            if (line === null) return <div key={i} style={{ height: 16 }} />;
            return (
              <TypeLine
                key={i}
                text={line}
                triggerFrame={lineTriggers[i]}
                frame={frame}
                fps={fps}
              />
            );
          })}
        </div>

        {/* Accent Bebas Neue */}
        <AccentLine
          text={accentText}
          triggerFrame={accentTrigger}
          frame={frame}
          fps={fps}
          color={accentColor}
        />

        {/* Barre dorée */}
        <SubBar frame={frame} fps={fps} triggerFrame={accentTrigger + 10} color={accentColor} />

        {/* Source discrète */}
        {sourceLabel && <SubLabel frame={frame} fps={fps} text={sourceLabel} triggerFrame={accentTrigger - 40} />}
      </div>
    </AbsoluteFill>
  );
};

// ── Ligne typewriter mot par mot ──
const TypeLine: React.FC<{
  text: string;
  triggerFrame: number;
  frame: number;
  fps: number;
}> = ({ text, triggerFrame, frame, fps }) => {
  const words = text.split(" ");
  const wordsVisible = Math.floor(Math.max(0, frame - triggerFrame) / 9);

  const entryP = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 120, stiffness: 90 },
    durationInFrames: 18,
  });
  const opacity = interpolate(entryP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(entryP, [0, 1], [14, 0], { extrapolateRight: "clamp" });

  if (frame < triggerFrame) return null;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: "'Inter', 'Arial', sans-serif",
        fontSize: 60,
        color: "#ffffff",
        fontWeight: 400,
        letterSpacing: "0.01em",
        lineHeight: 1.15,
      }}
    >
      {words.slice(0, wordsVisible).join(" ")}
    </div>
  );
};

// ── Accent Bebas Neue ──
const AccentLine: React.FC<{
  text: string;
  triggerFrame: number;
  frame: number;
  fps: number;
  color: string;
}> = ({ text, triggerFrame, frame, fps, color }) => {
  const p = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 120, stiffness: 80 },
    durationInFrames: 30,
  });
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(p, [0, 1], [40, 0], { extrapolateRight: "clamp" });

  if (frame < triggerFrame) return null;

  return (
    <div
      style={{
        color,
        fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
        fontSize: 128,
        lineHeight: 0.92,
        letterSpacing: "0.01em",
        textTransform: "uppercase",
        transform: `translateY(${translateY}px)`,
        opacity,
        marginTop: 8,
      }}
    >
      {text}
    </div>
  );
};

// ── Barre couleur accent ──
const SubBar: React.FC<{ frame: number; fps: number; triggerFrame: number; color: string }> = ({
  frame,
  fps,
  triggerFrame,
  color,
}) => {
  const p = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 200, stiffness: 120 },
    durationInFrames: 20,
  });
  const scaleX = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        width: 80,
        height: 6,
        background: color,
        marginTop: 24,
        transformOrigin: "left center",
        transform: `scaleX(${scaleX})`,
      }}
    />
  );
};

// ── Label source discret ──
const SubLabel: React.FC<{ frame: number; fps: number; text: string; triggerFrame: number }> = ({
  frame,
  fps,
  text,
  triggerFrame,
}) => {
  const p = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 120, stiffness: 60 },
    durationInFrames: 25,
  });
  const opacity = interpolate(p, [0, 1], [0, 0.5], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        marginTop: 20,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 22,
        color: "#ffffff",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        opacity,
      }}
    >
      {text}
    </div>
  );
};

export default BrutalHookSplit;
