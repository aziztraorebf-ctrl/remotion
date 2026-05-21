import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Waypoint {
  id: string;
  label: string;
  x: number;
  y: number;
  state: "past" | "current" | "future";
  style: "filled" | "empty" | "ripple";
}

export interface PathPoint {
  x: number;
  y: number;
}

export interface MilitaryMarchLineProps {
  title: string;
  date: string;
  stat: string;
  iconEmoji: string;
  mapImageSrc: string;
  waypoints: Waypoint[];
  pathPoints: PathPoint[];
  startFrame?: number;
  durationFrames?: number;
  totalPathLength?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAP_WIDTH = 1080;
const MAP_HEIGHT = 1760;
const PANEL_HEIGHT = 160;
const LINE_COLOR = "#8B2020";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Converts normalised 0-1 path points to absolute SVG coordinates. */
function toAbsolutePoints(pts: PathPoint[]): Array<{ x: number; y: number }> {
  return pts.map((p) => ({ x: p.x * MAP_WIDTH, y: p.y * MAP_HEIGHT }));
}

/** Converts absolute points array to SVG polyline points string. */
function toPolylineString(abs: Array<{ x: number; y: number }>): string {
  return abs.map((p) => `${p.x},${p.y}`).join(" ");
}

/** Computes cumulative segment lengths for a polyline. */
function buildCumulativeLengths(
  abs: Array<{ x: number; y: number }>
): number[] {
  const lengths: number[] = [0];
  for (let i = 1; i < abs.length; i++) {
    const dx = abs[i].x - abs[i - 1].x;
    const dy = abs[i].y - abs[i - 1].y;
    lengths.push(lengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  return lengths;
}

/** Returns total polyline length from cumulative lengths array. */
function totalLengthFromCumulative(lengths: number[]): number {
  return lengths[lengths.length - 1] ?? 0;
}

/** Returns {x, y, rotation} for a given length along the polyline. */
function getPointAtLength(
  abs: Array<{ x: number; y: number }>,
  cumulative: number[],
  targetLength: number
): { x: number; y: number; rotation: number } {
  const total = totalLengthFromCumulative(cumulative);
  const clamped = Math.max(0, Math.min(total, targetLength));

  if (abs.length < 2) {
    return { x: abs[0]?.x ?? 0, y: abs[0]?.y ?? 0, rotation: 0 };
  }

  for (let i = 1; i < abs.length; i++) {
    if (clamped <= cumulative[i]) {
      const segStart = cumulative[i - 1];
      const segLen = cumulative[i] - segStart;
      const t = segLen > 0 ? (clamped - segStart) / segLen : 0;
      const x = abs[i - 1].x + t * (abs[i].x - abs[i - 1].x);
      const y = abs[i - 1].y + t * (abs[i].y - abs[i - 1].y);
      const dx = abs[i].x - abs[i - 1].x;
      const dy = abs[i].y - abs[i - 1].y;
      const rotation = (Math.atan2(dy, dx) * 180) / Math.PI;
      return { x, y, rotation };
    }
  }

  const last = abs[abs.length - 1];
  const prev = abs[abs.length - 2];
  const dx = last.x - prev.x;
  const dy = last.y - prev.y;
  return {
    x: last.x,
    y: last.y,
    rotation: (Math.atan2(dy, dx) * 180) / Math.PI,
  };
}

// ─── Waypoint renderer ────────────────────────────────────────────────────────

interface WaypointMarkProps {
  wp: Waypoint;
  frame: number;
  triggerFrame: number;
}

function WaypointMark({ wp, frame, triggerFrame }: WaypointMarkProps) {
  const appeared = frame >= triggerFrame;
  if (!appeared) return null;

  const localFrame = frame - triggerFrame;
  const isFuture = wp.state === "future";
  const labelFill = isFuture ? "#9a8a6a" : "#141c2e";

  let mark: React.ReactNode = null;

  if (wp.style === "filled") {
    mark = <circle r={14} fill={LINE_COLOR} />;
  } else if (wp.style === "empty") {
    mark = (
      <circle r={10} fill="none" stroke={LINE_COLOR} strokeWidth={2.5} />
    );
  } else if (wp.style === "ripple") {
    // Two pulsing rings using (localFrame * 1.5) % 30
    const t1 = (localFrame * 1.5) % 30;
    const t2 = ((localFrame * 1.5) + 15) % 30;
    const opacity1 = interpolate(t1, [0, 15, 30], [0.6, 0, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const opacity2 = interpolate(t2, [0, 15, 30], [0.6, 0, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const r1 = interpolate(t1, [0, 30], [14, 32], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const r2 = interpolate(t2, [0, 30], [14, 32], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    mark = (
      <>
        <circle r={r2} fill={LINE_COLOR} style={{ opacity: opacity2 }} />
        <circle r={r1} fill={LINE_COLOR} style={{ opacity: opacity1 }} />
        <circle r={10} fill={LINE_COLOR} />
      </>
    );
  }

  // Label placement: above waypoint by default
  const labelDy = -22;

  return (
    <g transform={`translate(${wp.x},${wp.y})`}>
      {mark}
      <text
        y={labelDy}
        textAnchor="middle"
        fontSize={28}
        fill={labelFill}
        fontWeight={700}
        letterSpacing={3}
        style={{ fontFamily: "Cinzel, serif" }}
      >
        {wp.label}
      </text>
    </g>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MilitaryMarchLine({
  title,
  date,
  stat,
  iconEmoji,
  mapImageSrc,
  waypoints,
  pathPoints,
  startFrame = 0,
  durationFrames = 150,
  totalPathLength = 2200,
}: MilitaryMarchLineProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pre-compute absolute points and cumulative lengths once per render
  const absPoints = toAbsolutePoints(pathPoints);
  const cumulative = buildCumulativeLengths(absPoints);
  const actualTotal =
    totalLengthFromCumulative(cumulative) || totalPathLength;

  // ── Dash-draw animation (frames startFrame → startFrame+90) ──────────────
  const drawEnd = startFrame + 90;
  const strokeDashoffset = interpolate(
    frame,
    [startFrame, drawEnd],
    [totalPathLength, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // ── Mobile icon position along path ──────────────────────────────────────
  const progressRatio = interpolate(
    frame,
    [startFrame, drawEnd],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  const iconLength = progressRatio * actualTotal;
  const iconPos = getPointAtLength(absPoints, cumulative, iconLength);

  // ── Bottom panel slide-up (spring from startFrame+100) ───────────────────
  const panelSpring = spring({
    frame: frame - (startFrame + 100),
    fps,
    config: { damping: 18, stiffness: 120 },
  });
  const panelTranslateY = interpolate(panelSpring, [0, 1], [PANEL_HEIGHT, 0]);

  // ── Waypoint trigger frames ───────────────────────────────────────────────
  const waypointTrigger = (index: number) => startFrame + 90 + index * 8;

  return (
    <AbsoluteFill className="bg-navy overflow-hidden">
      {/* Map image — fills top area above panel */}
      <div
        className="absolute top-0 left-0 w-full overflow-hidden"
        style={{ height: `calc(100% - ${PANEL_HEIGHT}px)` }}
      >
        <Img
          src={staticFile(mapImageSrc)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* SVG overlay: path line + icon + waypoints */}
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: `calc(100% - ${PANEL_HEIGHT}px)` }}
      >
        {/* Marching route — dashed polyline revealed via strokeDashoffset */}
        {absPoints.length >= 2 && (
          <polyline
            points={toPolylineString(absPoints)}
            stroke={LINE_COLOR}
            strokeWidth={5}
            strokeDasharray="12 10"
            fill="none"
            strokeLinecap="round"
            style={{ strokeDashoffset }}
          />
        )}

        {/* Mobile icon that travels along the path */}
        {absPoints.length >= 2 && frame >= startFrame && (
          <g
            transform={`translate(${iconPos.x - 24},${iconPos.y - 24}) rotate(${iconPos.rotation},24,24)`}
          >
            <text
              x={24}
              y={36}
              textAnchor="middle"
              fontSize={32}
            >
              {iconEmoji}
            </text>
          </g>
        )}

        {/* Waypoints */}
        {waypoints.map((wp, index) => (
          <WaypointMark
            key={wp.id}
            wp={wp}
            frame={frame}
            triggerFrame={waypointTrigger(index)}
          />
        ))}
      </svg>

      {/* Bottom info panel — slides up */}
      <div
        className="absolute bottom-0 left-0 w-full bg-navy flex items-center px-8"
        style={{
          height: PANEL_HEIGHT,
          transform: `translateY(${panelTranslateY}px)`,
        }}
      >
        {/* Left: title + date */}
        <div className="flex flex-col justify-center">
          <span
            className="text-ivory font-bold uppercase leading-none"
            style={{ fontFamily: "Cinzel, serif", fontSize: 52 }}
          >
            {title}
          </span>
          <span
            className="text-gold"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: 28 }}
          >
            {date}
          </span>
        </div>

        {/* Divider */}
        <div className="bg-gold self-center mx-8" style={{ width: 1, height: 80 }} />

        {/* Right: icon + stat */}
        <div className="flex items-center gap-4">
          <span style={{ fontSize: 48 }}>{iconEmoji}</span>
          <span
            className="text-ivory font-bold uppercase"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: 28 }}
          >
            {stat}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export default MilitaryMarchLine;
