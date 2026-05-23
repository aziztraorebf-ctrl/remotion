import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface ChiffreChocProps {
  value?: string;
  prefix?: string;
  context1?: string;
  context2?: string;
  valueColor?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const PREFIX_IN = 10;
const VALUE_IN = 15;
const LINE_DRAW_START = 35;
const CONTEXT1_IN = 55;
const CONTEXT2_IN = 65;

const GRID_SPACING = 60;
const VALUE_X = 960;
const VALUE_Y = 480;
const LINE_Y = 560;
const LINE_X1 = 360;
const LINE_X2 = 1560;
const LINE_W = LINE_X2 - LINE_X1;
const CONTEXT1_Y = 620;
const CONTEXT2_Y = 670;

export const ChiffreChoc: React.FC<ChiffreChocProps> = ({
  value = "12.68B",
  prefix = "$",
  context1 = "TOTAL UNREPORTED LOSSES",
  context2 = "Across 4 major hedge funds in Q3",
  valueColor = "#c8a951",
  bgColor = "#1a2535",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const valueSpring = spring({
    frame: Math.max(0, frame - VALUE_IN),
    fps,
    config: { mass: 1, damping: 8, stiffness: 150 },
  });

  const prefixSpring = spring({
    frame: Math.max(0, frame - PREFIX_IN),
    fps,
    config: { mass: 1, damping: 12, stiffness: 120 },
  });
  const prefixOp = interpolate(frame, [PREFIX_IN, PREFIX_IN + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineW = interpolate(
    frame,
    [LINE_DRAW_START, LINE_DRAW_START + 20],
    [0, LINE_W],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const c1Spring = spring({
    frame: Math.max(0, frame - CONTEXT1_IN),
    fps,
    config: { mass: 1, damping: 14, stiffness: 100 },
  });
  const c1Ty = interpolate(c1Spring, [0, 1], [20, 0]);
  const c1Op = interpolate(frame, [CONTEXT1_IN, CONTEXT1_IN + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const c2Spring = spring({
    frame: Math.max(0, frame - CONTEXT2_IN),
    fps,
    config: { mass: 1, damping: 14, stiffness: 100 },
  });
  const c2Ty = interpolate(c2Spring, [0, 1], [20, 0]);
  const c2Op = interpolate(frame, [CONTEXT2_IN, CONTEXT2_IN + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gridLines: React.ReactNode[] = [];
  for (let x = 0; x < 1920; x += GRID_SPACING) {
    gridLines.push(
      <line key={`v${x}`} x1={x} y1={0} x2={x} y2={1080} stroke="rgba(242,235,217,0.06)" strokeWidth={1} />
    );
  }
  for (let y = 0; y < 1080; y += GRID_SPACING) {
    gridLines.push(
      <line key={`h${y}`} x1={0} y1={y} x2={1920} y2={y} stroke="rgba(242,235,217,0.06)" strokeWidth={1} />
    );
  }

  const VALUE_FS = 220;
  const PREFIX_FS = 100;
  const charWValue = VALUE_FS * 0.62;
  const charWPrefix = PREFIX_FS * 0.62;
  const valueTextW = value.length * charWValue;
  const prefixTextW = prefix ? prefix.length * charWPrefix : 0;
  const totalW = prefixTextW + valueTextW + (prefix ? 16 : 0);
  const prefixX = VALUE_X - totalW / 2 + prefixTextW / 2;
  const valueX = VALUE_X - totalW / 2 + prefixTextW + (prefix ? 16 : 0) + valueTextW / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>

        {/* Grid */}
        {gridLines}

        {/* Prefix */}
        {prefix && (
          <text
            x={prefixX}
            y={VALUE_Y}
            textAnchor="middle"
            opacity={prefixOp}
            style={{
              fontFamily: FONT_MONO,
              fontSize: PREFIX_FS,
              fontWeight: "bold",
              fill: valueColor,
              transform: `scale(${prefixSpring})`,
              transformOrigin: `${prefixX}px ${VALUE_Y}px`,
            }}
          >
            {prefix}
          </text>
        )}

        {/* Main value */}
        <text
          x={valueX}
          y={VALUE_Y}
          textAnchor="middle"
          style={{
            fontFamily: FONT_MONO,
            fontSize: VALUE_FS,
            fontWeight: "bold",
            fill: valueColor,
            transform: `scale(${valueSpring})`,
            transformOrigin: `${valueX}px ${VALUE_Y}px`,
          }}
        >
          {value}
        </text>

        {/* Separator line */}
        <line
          x1={LINE_X1}
          y1={LINE_Y}
          x2={LINE_X1 + lineW}
          y2={LINE_Y}
          stroke="#f2ebd9"
          strokeWidth={2}
        />

        {/* Context 1 */}
        <text
          x={VALUE_X}
          y={CONTEXT1_Y}
          textAnchor="middle"
          opacity={c1Op}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 36,
            fill: "#f2ebd9",
            letterSpacing: 6,
            transform: `translateY(${c1Ty}px)`,
          }}
        >
          {context1}
        </text>

        {/* Context 2 */}
        {context2 && (
          <text
            x={VALUE_X}
            y={CONTEXT2_Y}
            textAnchor="middle"
            opacity={c2Op * 0.7}
            style={{
              fontFamily: FONT_MONO,
              fontSize: 28,
              fill: "#f2ebd9",
              letterSpacing: 4,
              transform: `translateY(${c2Ty}px)`,
            }}
          >
            {context2}
          </text>
        )}

      </svg>
    </AbsoluteFill>
  );
};
