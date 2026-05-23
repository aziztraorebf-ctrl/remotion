import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface PassationPerson {
  name: string;
  role: string;
  period: string;
}

export interface PassationPouvoirProps {
  outgoing?: PassationPerson;
  incoming?: PassationPerson;
  transitionYear?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const PHASE1_END = 60;
const PHASE2_START = 60;
const PHASE2_FLASH_START = 60;
const PHASE2_FLASH_MID = 70;
const PHASE2_FLASH_END = 80;
const PHASE3_START = 90;
const PHASE3_END = 150;
const TIMELINE_START = 160;

export const PassationPouvoir: React.FC<PassationPouvoirProps> = ({
  outgoing = { name: "MACKY SALL", role: "4e Président du Sénégal", period: "2012 - 2024" },
  incoming = { name: "BASSIROU DIOMAYE FAYE", role: "5e Président du Sénégal", period: "2024 - PRÉSENT" },
  transitionYear = "2024",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 — both appear
  const appearOp = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2 — divider pulse
  const dividerPulseSpring = spring({
    frame: Math.max(0, frame - PHASE2_START),
    fps,
    config: { damping: 10, mass: 1, stiffness: 100 },
  });
  const dividerOp = Math.min(1, dividerPulseSpring * 1.5);

  // Flash gold at center
  const flashR = interpolate(
    frame,
    [PHASE2_FLASH_START, PHASE2_FLASH_MID, PHASE2_FLASH_END],
    [0, 120, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const flashOp = interpolate(
    frame,
    [PHASE2_FLASH_START, PHASE2_FLASH_MID, PHASE2_FLASH_END],
    [0, 0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Year badge at flash peak
  const yearOp = interpolate(frame, [PHASE2_FLASH_MID - 5, PHASE2_FLASH_MID + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 3 — outgoing slides left and fades
  const outTx = interpolate(frame, [PHASE3_START, PHASE3_END], [0, -80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outOp = interpolate(frame, [PHASE3_START, PHASE3_END], [1, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 3 — incoming shifts toward center and scales up
  const inTx = interpolate(frame, [PHASE3_START, PHASE3_END], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const inScaleSpring = spring({
    frame: Math.max(0, frame - PHASE3_START),
    fps,
    config: { damping: 15, mass: 1, stiffness: 80 },
  });
  const inScale = interpolate(inScaleSpring, [0, 1], [1, 1.05]);

  // Timeline fade
  const timelineOp = interpolate(frame, [TIMELINE_START, TIMELINE_START + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const Silhouette = ({ cx, desaturated }: { cx: number; desaturated: boolean }) => {
    const headFill = desaturated ? "#666" : "url(#silGrad7)";
    const shoulderFill = desaturated ? "#555" : "url(#silGradShoulder7)";
    const outlineColor = desaturated ? "rgba(150,150,150,0.2)" : "rgba(74,158,255,0.2)";
    return (
      <g>
        <polygon
          points={`${cx - 200},800 ${cx - 80},500 ${cx + 80},500 ${cx + 200},800`}
          fill={shoulderFill}
        />
        <circle cx={cx} cy={380} r={90} fill={headFill} />
        <circle cx={cx} cy={380} r={90} fill="none" stroke={outlineColor} strokeWidth={2} />
        <rect x={cx - 30} y={460} width={60} height={45} fill={desaturated ? "#555" : "rgba(42,59,85,0.7)"} />
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="silGrad7" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3b55" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1a2535" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="silGradShoulder7" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3b55" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1a2535" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Central divider */}
        <line
          x1={960} y1={80} x2={960} y2={900}
          stroke="#c8a951" strokeWidth={2}
          opacity={dividerOp}
        />

        {/* Outgoing — left side */}
        <g opacity={appearOp * outOp} transform={`translate(${outTx}, 0)`}>
          <Silhouette cx={480} desaturated={true} />
          <text
            x={480} y={860}
            textAnchor="middle"
            style={{ fontFamily: FONT_MONO, fontSize: 42, fontWeight: "bold", fill: "#888888", letterSpacing: 2 }}
          >
            {outgoing.name}
          </text>
          <text
            x={480} y={900}
            textAnchor="middle"
            style={{ fontFamily: FONT_MONO, fontSize: 22, fill: "#666666" }}
          >
            {outgoing.role}
          </text>
          <text
            x={480} y={935}
            textAnchor="middle"
            style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: "bold", fill: "#888888", letterSpacing: 2 }}
          >
            {outgoing.period}
          </text>
        </g>

        {/* Incoming — right side */}
        <g
          opacity={appearOp}
          transform={`translate(${inTx}, 0) scale(${inScale}) translate(${-inTx * (inScale - 1)}, 0)`}
          style={{ transformOrigin: "1440px 540px" }}
        >
          <g transform={`translate(${inTx}, 0) scale(${inScale})`} style={{ transformOrigin: "1440px 540px" }}>
            <Silhouette cx={1440} desaturated={false} />
            <text
              x={1440} y={860}
              textAnchor="middle"
              style={{ fontFamily: FONT_MONO, fontSize: 42, fontWeight: "bold", fill: "#f2ebd9", letterSpacing: 2 }}
            >
              {incoming.name}
            </text>
            <text
              x={1440} y={900}
              textAnchor="middle"
              style={{ fontFamily: FONT_MONO, fontSize: 22, fill: "#c8a951" }}
            >
              {incoming.role}
            </text>
            <text
              x={1440} y={935}
              textAnchor="middle"
              style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: "bold", fill: "#4a9eff", letterSpacing: 2 }}
            >
              {incoming.period}
            </text>
          </g>
        </g>

        {/* Flash gold */}
        <circle cx={960} cy={480} r={flashR} fill="#c8a951" opacity={flashOp} />

        {/* Transition year badge */}
        {transitionYear && (
          <g opacity={yearOp}>
            <rect x={900} y={455} width={120} height={50} rx={4} fill="#1a2535" stroke="#c8a951" strokeWidth={2} />
            <text
              x={960} y={488}
              textAnchor="middle"
              style={{ fontFamily: FONT_MONO, fontSize: 28, fontWeight: "bold", fill: "#c8a951" }}
            >
              {transitionYear}
            </text>
          </g>
        )}

        {/* Timeline bar */}
        <g opacity={timelineOp}>
          <line
            x1={200} y1={990} x2={1720} y2={990}
            stroke="#f2ebd9" strokeWidth={2} opacity={0.4}
          />
          {/* Left date */}
          <text
            x={200} y={980}
            style={{ fontFamily: FONT_MONO, fontSize: 16, fill: "#888888", letterSpacing: 2 }}
          >
            DÉPART
          </text>
          {/* Right date */}
          <text
            x={1720} y={980}
            textAnchor="end"
            style={{ fontFamily: FONT_MONO, fontSize: 16, fill: "#4a9eff", letterSpacing: 2 }}
          >
            ARRIVÉE
          </text>
          {/* Arrow at center */}
          <polygon points="950,983 970,990 950,997" fill="#c8a951" />
        </g>

      </svg>
    </AbsoluteFill>
  );
};
