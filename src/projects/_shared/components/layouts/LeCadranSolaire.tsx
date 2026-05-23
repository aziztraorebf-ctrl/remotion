import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { getLength } from "@remotion/paths";

export interface SundialEvent {
  year: string;
  description: string;
  angle: number; // 0 = top, 90 = right, 180 = bottom, 270 = left
}

export interface LeCadranSolaireProps {
  events?: SundialEvent[];
  title?: string;
  bgColor?: string;
  startFrame?: number;
}

const DEFAULT_EVENTS: SundialEvent[] = [
  { year: "1960", description: "INDEPENDANCE", angle: 315 },
  { year: "1990", description: "DEMOCRATIE", angle: 0 },
  { year: "2014", description: "SANGOMAR", angle: 45 },
  { year: "2024", description: "PRODUCTION", angle: 90 },
  { year: "2035", description: "OBJECTIF", angle: 135 },
];

const DIAL_INTRO = 30;
const PAUSE_PER_EVENT = 45;
const NEEDLE_PATH = "M485,500 L500,120 L515,500 Z";
const CIRCLE_PATH = `M 500 150 A 350 350 0 1 1 499.9999 150`;

const SPRING_CONFIG = { damping: 18, stiffness: 100, mass: 1.2 };

export const LeCadranSolaire: React.FC<LeCadranSolaireProps> = ({
  events = DEFAULT_EVENTS,
  title,
  bgColor = "#1a2535",
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - startFrame;

  // --- Circle draw-on (frames 0-30) ---
  const circleLength = getLength(CIRCLE_PATH);
  const circleDashOffset = interpolate(
    localFrame,
    [0, DIAL_INTRO],
    [circleLength, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- Needle rotation via spring chain ---
  // The needle starts at events[0].angle (or 0 if none)
  // Then springs to each subsequent event angle in sequence.

  const getNeedleAngle = (): number => {
    if (events.length === 0) return 0;

    // Before intro ends, stay at events[0].angle
    if (localFrame < DIAL_INTRO) return events[0].angle;

    let currentAngle = events[0].angle;

    for (let i = 1; i < events.length; i++) {
      const jumpStart = DIAL_INTRO + (i - 1) * PAUSE_PER_EVENT;
      const jumpProgress = spring({
        frame: localFrame - jumpStart,
        fps,
        config: SPRING_CONFIG,
      });

      const prevAngle = events[i - 1].angle;
      const nextAngle = events[i].angle;

      // Compute shortest path delta in degrees
      let delta = nextAngle - prevAngle;
      // Normalize delta to [-180, 180] to always take the short arc
      while (delta > 180) delta -= 360;
      while (delta < -180) delta += 360;

      const segmentAngle = prevAngle + delta * jumpProgress;
      currentAngle = segmentAngle;

      // If spring has essentially settled (progress > 0.99) and next segment
      // hasn't started yet, freeze here
      if (localFrame < jumpStart + PAUSE_PER_EVENT || i === events.length - 1) {
        return currentAngle;
      }
    }

    return currentAngle;
  };

  const needleAngle = getNeedleAngle();

  // --- Active event index (closest angle to needle) ---
  const getActiveIndex = (): number => {
    let closestIdx = 0;
    let smallestDiff = Infinity;
    for (let i = 0; i < events.length; i++) {
      let diff = Math.abs(events[i].angle - needleAngle);
      if (diff > 180) diff = 360 - diff;
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestIdx = i;
      }
    }
    return closestIdx;
  };

  const activeIndex = getActiveIndex();

  // --- Glitch: 3-frame scramble when needle arrives on an event ---
  const isGlitching = (eventIndex: number): boolean => {
    const arrivalFrame =
      DIAL_INTRO + eventIndex * PAUSE_PER_EVENT;
    return localFrame >= arrivalFrame && localFrame < arrivalFrame + 3;
  };

  const glitchChar = (char: string, charIndex: number, eventIndex: number): string => {
    if (/[0-9]/.test(char)) {
      return String.fromCharCode(
        48 + ((localFrame * 13 + charIndex * 17 + eventIndex * 7) % 10)
      );
    }
    return char;
  };

  const renderYear = (event: SundialEvent, eventIndex: number): string => {
    if (isGlitching(eventIndex)) {
      return event.year
        .split("")
        .map((c, ci) => glitchChar(c, ci, eventIndex))
        .join("");
    }
    return event.year;
  };

  // --- 12 ticks (every 30 degrees) ---
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const tickAngle = i * 30;
    const rad = ((tickAngle - 90) * Math.PI) / 180;
    const isEventTick = events.some((e) => Math.abs(e.angle - tickAngle) < 1);
    const innerR = isEventTick ? 325 : 335;
    const outerR = 350;
    const x1 = 500 + Math.cos(rad) * innerR;
    const y1 = 500 + Math.sin(rad) * innerR;
    const x2 = 500 + Math.cos(rad) * outerR;
    const y2 = 500 + Math.sin(rad) * outerR;
    const tickAppear = interpolate(
      localFrame,
      [i * 3, i * 3 + 6],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return { x1, y1, x2, y2, isEventTick, opacity: tickAppear };
  });

  // --- Label positions ---
  const LABEL_RADIUS = 420;

  return (
    <AbsoluteFill style={{ background: bgColor, overflow: "hidden" }}>
      <svg
        viewBox="0 0 1000 1000"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Title */}
        {title && (
          <text
            x={500}
            y={80}
            textAnchor="middle"
            fill="#f2ebd9"
            fontFamily="Georgia, serif"
            fontSize={28}
            letterSpacing={4}
          >
            {title.toUpperCase()}
          </text>
        )}

        {/* Outer graduation ticks */}
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.isEventTick ? "#4a9eff" : "#f2ebd9"}
            strokeWidth={tick.isEventTick ? 2 : 1}
            opacity={tick.isEventTick ? tick.opacity : tick.opacity * 0.2}
          />
        ))}

        {/* Dial circle (draw-on) */}
        <circle
          cx={500}
          cy={500}
          r={350}
          fill="none"
          stroke="#4a9eff"
          strokeWidth={1.5}
          strokeDasharray={circleLength}
          strokeDashoffset={circleDashOffset}
        />

        {/* Event labels in orbit */}
        {events.map((event, i) => {
          const rad = ((event.angle - 90) * Math.PI) / 180;
          const lx = 500 + Math.cos(rad) * LABEL_RADIUS;
          const ly = 500 + Math.sin(rad) * LABEL_RADIUS;
          const isActive = i === activeIndex;

          // Labels appear after dial intro + their position in sequence
          const labelAppear = interpolate(
            localFrame,
            [DIAL_INTRO + i * 8, DIAL_INTRO + i * 8 + 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const yearText = renderYear(event, i);

          if (isActive) {
            // Active: gold background box, navy text
            const boxW = 120;
            const boxH = 52;
            return (
              <g key={i} opacity={labelAppear}>
                <rect
                  x={lx - boxW / 2}
                  y={ly - boxH / 2}
                  width={boxW}
                  height={boxH}
                  rx={4}
                  fill="#c8a951"
                />
                <text
                  x={lx}
                  y={ly - 6}
                  textAnchor="middle"
                  fill="#1a2535"
                  fontFamily="monospace"
                  fontSize={18}
                  fontWeight="bold"
                >
                  {yearText}
                </text>
                <text
                  x={lx}
                  y={ly + 14}
                  textAnchor="middle"
                  fill="#1a2535"
                  fontFamily="monospace"
                  fontSize={10}
                  letterSpacing={1}
                >
                  {event.description}
                </text>
              </g>
            );
          }

          // Inactive: ivory text, reduced opacity
          return (
            <g key={i} opacity={labelAppear * 0.5}>
              <text
                x={lx}
                y={ly - 6}
                textAnchor="middle"
                fill="#f2ebd9"
                fontFamily="monospace"
                fontSize={18}
                fontWeight="bold"
              >
                {yearText}
              </text>
              <text
                x={lx}
                y={ly + 14}
                textAnchor="middle"
                fill="#f2ebd9"
                fontFamily="monospace"
                fontSize={10}
                letterSpacing={1}
              >
                {event.description}
              </text>
            </g>
          );
        })}

        {/* Needle (rotates around center 500,500) */}
        <g
          transform={`rotate(${needleAngle}, 500, 500)`}
          opacity={interpolate(localFrame, [DIAL_INTRO - 5, DIAL_INTRO], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          <path d={NEEDLE_PATH} fill="#c8a951" />
        </g>

        {/* Center dot */}
        <circle cx={500} cy={500} r={12} fill="#c8a951" />
      </svg>
    </AbsoluteFill>
  );
};

export default LeCadranSolaire;
