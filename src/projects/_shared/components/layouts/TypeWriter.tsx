import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export interface TypeLine {
  text: string;
  startFrame: number;
  size: "label" | "stat" | "context";
  speed?: number;
}

export interface TypeWriterProps {
  header?: string;
  lines?: TypeLine[];
  subtitle?: string;
}

const COLORS = {
  bg: "#0d1420",
  gold: "#c4a053",
  ivory: "#f2ebd9",
  slate: "#64748b",
};

const DEFAULT_LINES: TypeLine[] = [
  { text: "[ RAPPORT CONFIDENTIEL ]", startFrame: 10, size: "label", speed: 1 },
  { text: "$420 MILLIARDS", startFrame: 55, size: "stat", speed: 2 },
  { text: "EXTRAIT · 1960–2024", startFrame: 130, size: "context", speed: 1.5 },
];

function getVisibleText(text: string, startFrame: number, frame: number, speed: number = 2): string {
  if (frame < startFrame) return "";
  const charsVisible = Math.floor((frame - startFrame) / speed);
  return text.slice(0, Math.min(charsVisible, text.length));
}

function isTyping(text: string, startFrame: number, frame: number, speed: number = 2): boolean {
  return frame >= startFrame && frame < startFrame + text.length * speed;
}

function isComplete(text: string, startFrame: number, frame: number, speed: number = 2): boolean {
  return frame >= startFrame + text.length * speed;
}

function cursorVisible(frame: number): boolean {
  return Math.floor(frame / 4) % 2 === 0;
}

function getLineStyle(size: "label" | "stat" | "context"): React.CSSProperties {
  if (size === "label") {
    return {
      fontFamily: "IBM Plex Mono, monospace",
      fontSize: 34,
      color: COLORS.gold,
      letterSpacing: "0.15em",
      lineHeight: 1.2,
    };
  }
  if (size === "stat") {
    return {
      fontFamily: "Cinzel, serif",
      fontSize: 100,
      color: COLORS.ivory,
      lineHeight: 1,
    };
  }
  return {
    fontFamily: "IBM Plex Mono, monospace",
    fontSize: 30,
    color: COLORS.slate,
    letterSpacing: "0.12em",
    lineHeight: 1.2,
  };
}

interface TypeLineRowProps {
  line: TypeLine;
  frame: number;
  showCursor: boolean;
}

const TypeLineRow: React.FC<TypeLineRowProps> = ({ line, frame, showCursor }) => {
  const speed = line.speed ?? 2;
  const visible = getVisibleText(line.text, line.startFrame, frame, speed);
  const typing = isTyping(line.text, line.startFrame, frame, speed);
  const complete = isComplete(line.text, line.startFrame, frame, speed);

  const style = getLineStyle(line.size);

  const glowStyle: React.CSSProperties =
    line.size === "stat" && complete
      ? {
          textShadow:
            "0 0 80px rgba(196,160,83,0.6), 0 0 160px rgba(196,160,83,0.3)",
        }
      : {};

  const cursorStyle: React.CSSProperties = {
    ...style,
    color: COLORS.gold,
  };

  const showCursorHere = showCursor && typing && cursorVisible(frame);

  if (frame < line.startFrame) return null;

  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>
      <span style={{ ...style, ...glowStyle }}>{visible}</span>
      {showCursorHere && <span style={cursorStyle}>|</span>}
    </div>
  );
};

export const TypeWriter: React.FC<TypeWriterProps> = ({
  header = "DONNEES",
  lines = DEFAULT_LINES,
  subtitle = "AFRIQUE · RESSOURCES",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 80, stiffness: 50 },
  });

  const headerY = spring({
    frame,
    fps,
    from: -20,
    to: 0,
    config: { damping: 80, stiffness: 50 },
  });

  // Separator draw-in: frame 45 → 60
  const separatorProgress = interpolate(frame, [45, 60], [0, 800], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Find which line is currently typing to assign cursor
  const activeLineIndex = lines.reduce((acc, line, idx) => {
    const speed = line.speed ?? 2;
    if (isTyping(line.text, line.startFrame, frame, speed)) return idx;
    return acc;
  }, -1);

  // Dot grid background
  const dotGrid: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(circle, rgba(196,160,83,0.12) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
  };

  // Scanlines overlay
  const scanlines: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
    pointerEvents: "none",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Dot grid */}
      <div style={dotGrid} />

      {/* Scanlines */}
      <AbsoluteFill style={scanlines} />

      {/* Top header */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <span
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: 48,
            color: COLORS.gold,
            letterSpacing: "0.1em",
          }}
        >
          {header}
        </span>
      </div>

      {/* Center content block */}
      <div
        style={{
          position: "absolute",
          top: 200,
          bottom: 200,
          left: 100,
          right: 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Line 1 — label */}
        <TypeLineRow
          line={lines[0]}
          frame={frame}
          showCursor={activeLineIndex === 0}
        />

        {/* Separator */}
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <div
            style={{
              height: 1,
              width: separatorProgress,
              backgroundColor: COLORS.gold,
              opacity: 0.6,
            }}
          />
        </div>

        {/* Line 2 — stat */}
        {lines[1] && (
          <TypeLineRow
            line={lines[1]}
            frame={frame}
            showCursor={activeLineIndex === 1}
          />
        )}

        {/* Gap between stat and context */}
        <div style={{ height: 40 }} />

        {/* Line 3 — context */}
        {lines[2] && (
          <TypeLineRow
            line={lines[2]}
            frame={frame}
            showCursor={activeLineIndex === 2}
          />
        )}
      </div>

      {/* Bottom subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 24,
            color: COLORS.slate,
            letterSpacing: "0.1em",
          }}
        >
          {subtitle}
        </span>
      </div>
    </AbsoluteFill>
  );
};
