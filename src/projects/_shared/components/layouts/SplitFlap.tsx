import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

// Rolling alphabet — deterministic, no Math.random
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .-";

export interface SplitFlapLine {
  text: string;
  startFrame: number;
  size?: "normal" | "large" | "xlarge";
}

export interface SplitFlapProps {
  header?: string;
  lines?: SplitFlapLine[];
  footer?: string;
  bgColor?: string;
}

const ROLL_DURATION = 20; // frames each cell rolls before locking

interface CellProps {
  targetChar: string;
  startFrame: number;
  colIndex: number;
  cellWidth: number;
  cellHeight: number;
  fontSize: number;
}

const SplitFlapCell: React.FC<CellProps> = ({
  targetChar,
  startFrame,
  colIndex,
  cellWidth,
  cellHeight,
  fontSize,
}) => {
  const frame = useCurrentFrame();

  const localFrame = frame - startFrame;
  const isRolling = localFrame >= 0 && localFrame < ROLL_DURATION;
  const isLocked = localFrame >= ROLL_DURATION;
  const isPending = localFrame < 0;

  // Determine displayed character
  let displayChar: string;
  if (isPending) {
    displayChar = " ";
  } else if (isRolling) {
    displayChar = ALPHA[(frame * 3 + colIndex * 7) % ALPHA.length];
  } else {
    displayChar = targetChar;
  }

  // Opacity transition: rolling = or, locked = ivory
  const lockFrame = startFrame + ROLL_DURATION;
  const rollingOpacity = interpolate(
    frame,
    [lockFrame - 5, lockFrame],
    [1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  const lockedOpacity = interpolate(
    frame,
    [lockFrame - 5, lockFrame],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Small entrance scale spring-like via interpolate
  const cellScale = interpolate(
    frame,
    [startFrame, startFrame + 6],
    [0.92, 1.0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const cellOpacity = interpolate(
    frame,
    [startFrame - 2, startFrame + 4],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <div
      style={{
        position: "relative",
        width: cellWidth,
        height: cellHeight,
        background: "#0a1628",
        border: "1.5px solid rgba(196,160,83,0.5)",
        borderRadius: 10,
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.6)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transform: `scale(${cellScale})`,
        opacity: cellOpacity,
      }}
    >
      {/* Top half shadow overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0))",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Rolling character (or color) */}
      {(isRolling || isPending) && (
        <span
          style={{
            fontFamily: "Cinzel, serif",
            fontSize,
            fontWeight: 700,
            color: "#c4a053",
            opacity: isRolling ? rollingOpacity : 0,
            position: "absolute",
            lineHeight: 1,
            userSelect: "none",
            letterSpacing: "0.05em",
          }}
        >
          {displayChar}
        </span>
      )}

      {/* Locked character (ivory color) */}
      <span
        style={{
          fontFamily: "Cinzel, serif",
          fontSize,
          fontWeight: 700,
          color: "#f2ebd9",
          opacity: isLocked ? lockedOpacity : 0,
          position: "absolute",
          lineHeight: 1,
          userSelect: "none",
          letterSpacing: "0.05em",
        }}
      >
        {targetChar}
      </span>

      {/* Horizontal split line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1.5,
          background: "rgba(196,160,83,0.6)",
          zIndex: 3,
          transform: "translateY(-50%)",
        }}
      />

      {/* Bottom half — slight darken for split effect */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "rgba(0,0,0,0.15)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  );
};

interface LineProps {
  line: SplitFlapLine;
}

const SplitFlapLineRow: React.FC<LineProps> = ({ line }) => {
  const { text, startFrame, size = "normal" } = line;
  const chars = text.split("");

  let cellWidth: number;
  let cellHeight: number;
  let fontSize: number;

  if (size === "xlarge") {
    cellWidth = 150;
    cellHeight = 180;
    fontSize = 72;
  } else if (size === "large") {
    cellWidth = 130;
    cellHeight = 156;
    fontSize = 52;
  } else {
    cellWidth = 116;
    cellHeight = 143;
    fontSize = 46;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {chars.map((char, colIndex) => {
        const cellStartFrame = startFrame + colIndex * 4;

        if (char === " ") {
          return (
            <div
              key={colIndex}
              style={{ width: cellWidth / 2, height: cellHeight }}
            />
          );
        }

        return (
          <SplitFlapCell
            key={colIndex}
            targetChar={char}
            startFrame={cellStartFrame}
            colIndex={colIndex}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            fontSize={fontSize}
          />
        );
      })}
    </div>
  );
};

export const SplitFlap: React.FC<SplitFlapProps> = ({
  header = "CHRONOLOGIE",
  lines = [
    { text: "MALI", startFrame: 20, size: "large" },
    { text: "1324", startFrame: 60, size: "xlarge" },
    { text: "AP JC", startFrame: 100, size: "normal" },
  ],
  footer = "EMPIRE MEDIEVAL",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();

  // Header fade in
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [0, 20], [-20, 0], {
    extrapolateRight: "clamp",
  });

  // Footer fade in
  const footerOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Dot grid pattern as radial dots
  const dots: React.ReactNode[] = [];
  const dotSpacing = 60;
  const cols = Math.ceil(1080 / dotSpacing) + 1;
  const rows = Math.ceil(1920 / dotSpacing) + 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={c * dotSpacing}
          cy={r * dotSpacing}
          r={1.5}
          fill="rgba(100,116,139,0.18)"
        />
      );
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Dot grid background */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        viewBox="0 0 1080 1920"
        preserveAspectRatio="xMidYMid slice"
      >
        {dots}
      </svg>

      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        {/* Decorative line above */}
        <div
          style={{
            width: 80,
            height: 2,
            background: "rgba(196,160,83,0.5)",
          }}
        />
        <span
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: 44,
            fontWeight: 700,
            color: "#c4a053",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          {header}
        </span>
        {/* Decorative line below */}
        <div
          style={{
            width: 80,
            height: 2,
            background: "rgba(196,160,83,0.5)",
          }}
        />
      </div>

      {/* Lines of cells — centered vertically between header and footer zones */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
        }}
      >
        {lines.map((line, i) => (
          <React.Fragment key={i}>
            {/* Separator gold between line 0 and line 1 */}
            {i === 1 && (
              <div
                style={{
                  width: 400,
                  height: 1,
                  background: "rgba(196,160,83,0.3)",
                  marginBottom: -28,
                  marginTop: -28,
                }}
              />
            )}
            <div
              style={{
                opacity: i === 2 ? 0.65 : 1,
              }}
            >
              <SplitFlapLineRow line={line} />
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: footerOpacity,
        }}
      >
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 24,
            color: "#64748b",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {footer}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export default SplitFlap;
