import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const FONT_FAMILY = "'Cinzel', serif";
const NORMAL_FONT_SIZE = 82;
const KEYWORD_FONT_SIZE = 210;
const GOLD_COLOR = "#e9d59e";

interface TypeRevealProps {
  textBefore?: string;
  keyword?: string;
  textAfter?: string;
  subtitle?: string;
  typeSpeed?: number;
}

export function TypeReveal({
  textBefore = "En 1885, l'Afrique fut ",
  keyword = "DIVISÉE",
  textAfter = " entre 14 puissances.",
  subtitle = "Conférence de Berlin, 1885",
  typeSpeed = 2,
}: TypeRevealProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalCharsTyped = Math.floor(frame / typeSpeed);
  const beforeLen = textBefore.length;
  const kwLen = keyword.length;

  const beforeChars = Math.min(totalCharsTyped, beforeLen);
  const kwChars = Math.max(0, Math.min(totalCharsTyped - beforeLen, kwLen));
  const afterChars = Math.max(0, totalCharsTyped - beforeLen - kwLen);

  const visibleBefore = textBefore.slice(0, beforeChars);
  const visibleKeyword = keyword.slice(0, kwChars);
  const visibleAfter = textAfter.slice(0, afterChars);

  // Keyword spring
  const keywordStartFrame = beforeLen * typeSpeed;
  const kwScale = spring({
    frame: frame - keywordStartFrame,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const keywordScale = interpolate(kwScale, [0, 1], [0.3, 1], { extrapolateRight: "clamp" });

  // Cursor blink
  const cursorOpacity = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

  // Subtitle fade
  const allChars = beforeLen + kwLen + textAfter.length;
  const doneFrame = allChars * typeSpeed + 15;
  const subtitleOpacity = interpolate(frame, [doneFrame, doneFrame + 20], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050A10",
        backgroundImage: "radial-gradient(circle at center, #111A28 0%, #050A10 70%)",
      }}
    >
      {/* Text zone — flex-wrap centré verticalement */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "center",
          flexWrap: "wrap",
          paddingLeft: 32,
          paddingRight: 32,
          gap: 0,
          lineHeight: 1.15,
        }}
      >
        {visibleBefore.length > 0 && (
          <span
            style={{
              fontSize: NORMAL_FONT_SIZE,
              fontFamily: FONT_FAMILY,
              color: "#fdf6e3",
              lineHeight: 1.2,
            }}
          >
            {visibleBefore}
          </span>
        )}

        {visibleKeyword.length > 0 && (
          <span
            style={{
              fontSize: KEYWORD_FONT_SIZE,
              fontFamily: FONT_FAMILY,
              fontWeight: 900,
              color: GOLD_COLOR,
              lineHeight: 1,
              transform: `scale(${keywordScale})`,
              display: "inline-block",
              transformOrigin: "center bottom",
              textShadow: `0 0 60px rgba(233,213,158,0.7), 0 0 20px rgba(233,213,158,0.5)`,
              marginLeft: 8,
              marginRight: 8,
            }}
          >
            {visibleKeyword}
          </span>
        )}

        {visibleAfter.length > 0 && (
          <span
            style={{
              fontSize: NORMAL_FONT_SIZE,
              fontFamily: FONT_FAMILY,
              color: "#fdf6e3",
              lineHeight: 1.2,
            }}
          >
            {visibleAfter}
          </span>
        )}

        {/* Cursor */}
        <span
          style={{
            display: "inline-block",
            backgroundColor: GOLD_COLOR,
            width: 5,
            height: NORMAL_FONT_SIZE,
            marginLeft: 6,
            verticalAlign: "middle",
            opacity: cursorOpacity,
            flexShrink: 0,
          }}
        />
      </div>

      {/* Bottom separator + subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          opacity: subtitleOpacity,
        }}
      >
        <div
          style={{
            width: 300,
            height: 1,
            backgroundColor: "#9a8a6a",
            opacity: 0.6,
          }}
        />
        <span
          style={{
            color: "#9a8a6a",
            fontSize: 32,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {subtitle}
        </span>
      </div>
    </AbsoluteFill>
  );
}
