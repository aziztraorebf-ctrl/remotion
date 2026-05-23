import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface LeSceauProps {
  title?: string;
  subtitle?: string;
  institution?: string;
  date?: string;
  sealColor?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const outerCirclePath = "M 960 240 A 300 300 0 1 1 959.99 240";
const textCirclePath = "M 640 540 A 320 320 0 1 1 1280 540 A 320 320 0 1 1 640 540";
const starPath =
  "M 960 460 L 981 519 L 1040 540 L 981 561 L 960 620 L 939 561 L 880 540 L 939 519 Z";

const OUTER_CIRCUMFERENCE = 2 * Math.PI * 300;

export const LeSceau: React.FC<LeSceauProps> = ({
  title = "SANCTIONS ÉCONOMIQUES",
  subtitle = "COMMUNAUTÉ ÉCONOMIQUE DES ÉTATS DE L'AFRIQUE DE L'OUEST",
  institution = "CEDEAO",
  date = "JANVIER · 2024",
  sealColor = "#c8a951",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 2 — cercle draw-on (15→45)
  const circleProgress = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strokeDashoffset = OUTER_CIRCUMFERENCE * (1 - circleProgress);

  // Phase 3 — texte circulaire (45→75)
  const circularTextOpacity = interpolate(frame, [45, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 4 — symbole central spring pop (75→90)
  const symbolScale = spring({
    frame: frame - 75,
    fps,
    config: { damping: 12, stiffness: 150, mass: 1 },
  });

  // Phase 5 — impact stamp overshooting (90→110)
  const stampScale = spring({
    frame: frame - 90,
    fps,
    config: { damping: 8, stiffness: 200, mass: 1 },
  });
  const sealScale = frame < 90 ? symbolScale : interpolate(stampScale, [0, 1], [1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const impactScale = frame >= 90
    ? interpolate(
        spring({ frame: frame - 90, fps, config: { damping: 8, stiffness: 200, mass: 1 } }),
        [0, 1],
        [1.4, 1.0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : symbolScale;

  const impactRotation = frame >= 90
    ? interpolate(
        spring({ frame: frame - 90, fps, config: { damping: 10, stiffness: 180, mass: 1 } }),
        [0, 1],
        [-3, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  // Phase 6 — glitch title (110→113)
  const isGlitch = frame >= 110 && frame <= 113;
  const glitchOffset = isGlitch ? (frame % 2 === 0 ? 4 : -4) : 0;

  const titleOpacity = interpolate(frame, [110, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 7 — date fadeIn (113→140)
  const dateOpacity = interpolate(frame, [113, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sealTransform = `translate(960, 540) scale(${impactScale}) rotate(${impactRotation}) translate(-960, -540)`;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          <path id="textCircle" d={textCirclePath} />
        </defs>

        <g transform={sealTransform}>
          {/* Outer circle draw-on */}
          <circle
            cx={960}
            cy={540}
            r={300}
            fill={`rgba(200,169,81,0.08)`}
            stroke={sealColor}
            strokeWidth={2.5}
            strokeDasharray={OUTER_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "none" }}
          />

          {/* Inner circle */}
          <circle
            cx={960}
            cy={540}
            r={280}
            fill="none"
            stroke={sealColor}
            strokeWidth={1}
            strokeOpacity={circleProgress * 0.4}
          />

          {/* Circular text on path */}
          <text
            style={{
              fontFamily: FONT_MONO,
              fontSize: 18,
              letterSpacing: 12,
              fill: "#f2ebd9",
              opacity: circularTextOpacity,
              textTransform: "uppercase",
            }}
          >
            <textPath href="#textCircle" startOffset="5%">
              {subtitle.length > 60 ? subtitle.substring(0, 60) + "..." : subtitle}
            </textPath>
          </text>

          {/* Star symbol central — scales from 0 */}
          <g opacity={Math.min(symbolScale, 1)}>
            <path
              d={starPath}
              fill={sealColor}
              opacity={0.9}
              transform={`translate(960, 540) scale(${symbolScale * 0.8}) translate(-960, -540)`}
            />
          </g>

          {/* Decorative tick marks */}
          {Array.from({ length: 36 }, (_, i) => {
            const angle = (i * 10 * Math.PI) / 180;
            const r1 = 305;
            const r2 = i % 3 === 0 ? 320 : 312;
            const x1 = 960 + r1 * Math.cos(angle);
            const y1 = 540 + r1 * Math.sin(angle);
            const x2 = 960 + r2 * Math.cos(angle);
            const y2 = 540 + r2 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={sealColor}
                strokeWidth={i % 3 === 0 ? 2 : 1}
                opacity={circleProgress * 0.6}
              />
            );
          })}
        </g>
      </svg>

      {/* Title — glitch effect */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 48,
            letterSpacing: 8,
            color: sealColor,
            textTransform: "uppercase" as const,
            opacity: titleOpacity,
            transform: `translateX(${glitchOffset}px)`,
            marginTop: 80,
            textAlign: "center",
          }}
        >
          {title}
        </div>

        {/* Institution badge */}
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 22,
            letterSpacing: 10,
            color: "#f2ebd9",
            textTransform: "uppercase" as const,
            opacity: titleOpacity * 0.7,
            marginTop: 12,
            textAlign: "center",
          }}
        >
          {institution}
        </div>
      </AbsoluteFill>

      {/* Date — bottom */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: "0 60px 80px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 22,
            letterSpacing: 4,
            color: "#4a9eff",
            textTransform: "uppercase" as const,
            opacity: dateOpacity,
            textAlign: "center",
          }}
        >
          {date}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
