import { useCurrentFrame, interpolate } from "remotion";

const TOTAL_FRAMES = 150;

// Segment start/end frames for each draw-on element
const SEGMENTS = {
  ground: { start: 0, end: 20 },
  houseLeft: { start: 20, end: 60 },
  houseRight: { start: 60, end: 100 },
  character: { start: 100, end: 130 },
  text: { start: 130, end: 150 },
};

// Animate a path's stroke-dashoffset from pathLength to 0 (draw-on effect)
function useDrawOn(
  pathLength: number,
  startFrame: number,
  endFrame: number
): number {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return pathLength * (1 - progress);
}

// Ground component: simple horizontal line
function Ground() {
  const pathLength = 720;
  const dashOffset = useDrawOn(pathLength, SEGMENTS.ground.start, SEGMENTS.ground.end);

  return (
    <line
      x1="100"
      y1="620"
      x2="820"
      y2="626"
      stroke="#2c1810"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray={pathLength}
      strokeDashoffset={dashOffset}
    />
  );
}

// House rectangle body
function HouseBody({
  x,
  y,
  width,
  height,
  startFrame,
  endFrame,
  strokeWidth = 2.5,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  startFrame: number;
  endFrame: number;
  strokeWidth?: number;
}) {
  // Perimeter of rectangle
  const pathLength = 2 * (width + height);
  const dashOffset = useDrawOn(pathLength, startFrame, endFrame);

  const d = `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`;

  return (
    <path
      d={d}
      fill="none"
      stroke="#2c1810"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={pathLength}
      strokeDashoffset={dashOffset}
    />
  );
}

// House roof triangle
function HouseRoof({
  cx,
  baseY,
  width,
  height,
  startFrame,
  endFrame,
  strokeWidth = 2,
}: {
  cx: number;
  baseY: number;
  width: number;
  height: number;
  startFrame: number;
  endFrame: number;
  strokeWidth?: number;
}) {
  const leftX = cx - width / 2;
  const rightX = cx + width / 2;
  // Triangle perimeter (open bottom since it sits on the body)
  const side = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height, 2));
  const pathLength = side * 2 + width;
  const dashOffset = useDrawOn(pathLength, startFrame, endFrame);

  const d = `M ${leftX} ${baseY} L ${cx} ${baseY - height} L ${rightX} ${baseY} L ${leftX} ${baseY}`;

  return (
    <path
      d={d}
      fill="none"
      stroke="#2c1810"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={pathLength}
      strokeDashoffset={dashOffset}
    />
  );
}

// Left house: body + roof split across startFrame..endFrame
function HouseLeft() {
  const { start, end } = SEGMENTS.houseLeft;
  const midFrame = Math.round(start + (end - start) * 0.55);

  return (
    <>
      <HouseBody
        x={150}
        y={470}
        width={140}
        height={150}
        startFrame={start}
        endFrame={midFrame}
        strokeWidth={2.5}
      />
      <HouseRoof
        cx={220}
        baseY={470}
        width={160}
        height={70}
        startFrame={midFrame}
        endFrame={end}
        strokeWidth={2}
      />
    </>
  );
}

// Right house: slightly larger
function HouseRight() {
  const { start, end } = SEGMENTS.houseRight;
  const midFrame = Math.round(start + (end - start) * 0.55);

  return (
    <>
      <HouseBody
        x={540}
        y={440}
        width={165}
        height={180}
        startFrame={start}
        endFrame={midFrame}
        strokeWidth={3}
      />
      <HouseRoof
        cx={623}
        baseY={440}
        width={185}
        height={80}
        startFrame={midFrame}
        endFrame={end}
        strokeWidth={2.5}
      />
    </>
  );
}

// Simple stick-figure silhouette as a single path
function Character() {
  const { start, end } = SEGMENTS.character;
  // Head circle approximation via arc, then body + arms + legs
  // Using a rough SVG path that reads as a human silhouette
  const d = [
    // Head (small circle approximated with two arcs)
    "M 418 490",
    "a 14 14 0 1 1 0.01 0",
    // Neck + body
    "M 418 504",
    "L 418 560",
    // Arms
    "M 395 520 L 442 520",
    // Left leg
    "M 418 560 L 400 618",
    // Right leg
    "M 418 560 L 436 618",
  ].join(" ");

  // Approximate total path length for dasharray
  const pathLength = 320;
  const dashOffset = useDrawOn(pathLength, start, end);

  return (
    <path
      d={d}
      fill="none"
      stroke="#2c1810"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={pathLength}
      strokeDashoffset={dashOffset}
    />
  );
}

// "1347" text drawn via stroke animation
function YearText() {
  const frame = useCurrentFrame();
  const { start, end } = SEGMENTS.text;

  const opacity = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Clip rect to simulate left-to-right reveal (complements the opacity fade)
  const revealWidth = interpolate(frame, [start, end], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g opacity={opacity}>
      <clipPath id="textReveal">
        <rect x="310" y="50" width={revealWidth} height="120" />
      </clipPath>
      <text
        x="460"
        y="140"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="96"
        fontWeight="bold"
        fill="none"
        stroke="#2c1810"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath="url(#textReveal)"
        style={{ fontStyle: "italic" }}
      >
        1347
      </text>
    </g>
  );
}

export default function StyleSketch() {
  return (
    <div
      style={{
        width: 920,
        height: 720,
        background: "#faf0e6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Slight paper texture via box-shadow layers
        boxShadow: "inset 0 0 60px rgba(44,24,16,0.06)",
      }}
    >
      <svg
        width="920"
        height="720"
        viewBox="0 0 920 720"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <Ground />
        <HouseLeft />
        <HouseRight />
        <Character />
        <YearText />
      </svg>
    </div>
  );
}
