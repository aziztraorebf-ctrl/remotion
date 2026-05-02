// Insert Line Chart "Chute du prix de l'or" - reusable inline component for main composition.
// Based on AtlasV2InsertLineChartDemo (validated). Wipe handled by parent.
// Renders ONLY the dataviz scene content inside the SVG.
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasSubtleStars,
} from "../atlas-v2-components";

interface InsertLineChartProps {
  startFrame: number;
  endFrame: number;
}

interface CurvePoint {
  year: number;
  price: number;
}

const PRICE_DATA: CurvePoint[] = [
  { year: 1324, price: 100 },
  { year: 1325, price: 92 },
  { year: 1326, price: 85 },
  { year: 1327, price: 76 },
  { year: 1328, price: 68 },
  { year: 1329, price: 62 },
  { year: 1330, price: 58 },
  { year: 1331, price: 55 },
  { year: 1332, price: 53 },
  { year: 1333, price: 51 },
  { year: 1334, price: 50 },
  { year: 1335, price: 50 },
  { year: 1336, price: 50 },
];

export const AtlasV2InsertLineChart: React.FC<InsertLineChartProps> = ({
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame >= endFrame) return null;

  const localFrame = frame - startFrame;

  const chartLeftX = 110;
  const chartRightX = 640;
  const chartTopY = 480;
  const chartBottomY = 880;
  const chartW = chartRightX - chartLeftX;
  const chartH = chartBottomY - chartTopY;

  const xScale = (year: number): number => {
    const t = (year - 1324) / (1336 - 1324);
    return chartLeftX + t * chartW;
  };
  const yScale = (price: number): number => {
    const t = price / 100;
    return chartBottomY - t * chartH;
  };

  const titleStart = 5;
  const axesStart = 15;
  const lineStart = 45;
  const counterStart = 75;
  const counterEnd = 120;
  const cartoucheStart = 120;

  const titleT = spring({
    frame: localFrame - titleStart,
    fps,
    config: { damping: 16, stiffness: 180 },
  });
  const axesT = spring({
    frame: localFrame - axesStart,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  const lineDuration = 75;
  const lineProgress = interpolate(
    localFrame,
    [lineStart, lineStart + lineDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const points = PRICE_DATA.map((d) => [xScale(d.year), yScale(d.price)] as [number, number]);

  const curvePath = (() => {
    if (points.length < 2) return "";
    let d = `M${points[0][0]},${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
    }
    return d;
  })();

  const pathLength = (() => {
    let len = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1][0] - points[i][0];
      const dy = points[i + 1][1] - points[i][1];
      len += Math.sqrt(dx * dx + dy * dy);
    }
    return len * 1.15;
  })();

  const dashOffset = pathLength * (1 - lineProgress);

  const currentIdx = Math.min(
    points.length - 1,
    Math.floor(lineProgress * (points.length - 1))
  );
  const localT = lineProgress * (points.length - 1) - currentIdx;
  const dotX =
    points[currentIdx][0] +
    (points[Math.min(points.length - 1, currentIdx + 1)][0] - points[currentIdx][0]) * localT;
  const dotY =
    points[currentIdx][1] +
    (points[Math.min(points.length - 1, currentIdx + 1)][1] - points[currentIdx][1]) * localT;

  const counterRaw = interpolate(
    localFrame,
    [counterStart, counterEnd],
    [0, -50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const counterValue = localFrame >= counterStart ? Math.round(counterRaw) : 0;

  const cartoucheT = spring({
    frame: localFrame - cartoucheStart,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  return (
    <>
      <rect x="0" y="0" width="720" height="1280" fill="#0F1530" />
      <AtlasSubtleStars opacity={0.45} />

      {/* TITLE */}
      <g
        opacity={titleT}
        transform={`translate(360 240) scale(${0.85 + 0.15 * titleT})`}
      >
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontSize="34"
          fontWeight="700"
          fill={ATLAS_COLORS.cream}
          letterSpacing="2"
        >
          LE PRIX DE L'OR
        </text>
        <text
          x="0"
          y="36"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontSize="22"
          fontWeight="500"
          fill={ATLAS_COLORS.empireGold}
          letterSpacing="3"
          opacity="0.85"
        >
          LE CAIRE — 1324 A 1336
        </text>
        <line
          x1="-160"
          y1="56"
          x2="160"
          y2="56"
          stroke={ATLAS_COLORS.empireGold}
          strokeWidth="2"
          opacity="0.55"
        />
      </g>

      {/* AXES */}
      <g opacity={axesT}>
        <line
          x1={chartLeftX}
          y1={chartTopY - 10}
          x2={chartLeftX}
          y2={chartBottomY + 10}
          stroke={ATLAS_COLORS.cream}
          strokeWidth="2"
          opacity="0.6"
        />
        <line
          x1={chartLeftX - 10}
          y1={chartBottomY}
          x2={chartRightX + 10}
          y2={chartBottomY}
          stroke={ATLAS_COLORS.cream}
          strokeWidth="2"
          opacity="0.6"
        />
        <text
          x={chartLeftX - 16}
          y={yScale(100) + 6}
          textAnchor="end"
          fontFamily="Cormorant Garamond, serif"
          fontSize="20"
          fontWeight="600"
          fill={ATLAS_COLORS.cream}
          opacity="0.7"
        >
          100%
        </text>
        <text
          x={chartLeftX - 16}
          y={yScale(50) + 6}
          textAnchor="end"
          fontFamily="Cormorant Garamond, serif"
          fontSize="20"
          fontWeight="600"
          fill={ATLAS_COLORS.cream}
          opacity="0.7"
        >
          50%
        </text>
        <text
          x={xScale(1324)}
          y={chartBottomY + 32}
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontSize="20"
          fontWeight="600"
          fill={ATLAS_COLORS.cream}
          opacity="0.7"
        >
          1324
        </text>
        <text
          x={xScale(1336)}
          y={chartBottomY + 32}
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontSize="20"
          fontWeight="600"
          fill={ATLAS_COLORS.cream}
          opacity="0.7"
        >
          1336
        </text>
        <line
          x1={chartLeftX}
          y1={yScale(50)}
          x2={chartRightX}
          y2={yScale(50)}
          stroke={ATLAS_COLORS.cream}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.25"
        />
      </g>

      {/* LINE CHART */}
      {lineProgress > 0 && (
        <>
          <defs>
            <clipPath id="lineRevealClip">
              <rect
                x={chartLeftX}
                y={chartTopY - 20}
                width={chartW * lineProgress}
                height={chartH + 40}
              />
            </clipPath>
          </defs>
          <path
            d={`${curvePath} L${chartRightX},${chartBottomY} L${chartLeftX},${chartBottomY} Z`}
            fill="url(#areaGrad)"
            opacity={lineProgress * 0.8}
            clipPath="url(#lineRevealClip)"
          />
          <path
            d={curvePath}
            fill="none"
            stroke="#DA0000"
            strokeWidth="9"
            strokeDasharray={pathLength}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
            filter="url(#redGlow)"
          />
          <path
            d={curvePath}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="4.5"
            strokeDasharray={pathLength}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {lineProgress < 1 && (
            <>
              <circle cx={dotX} cy={dotY} r="14" fill="#DA0000" opacity="0.4" />
              <circle
                cx={dotX}
                cy={dotY}
                r="7"
                fill={ATLAS_COLORS.empireGold}
                stroke="#DA0000"
                strokeWidth="2"
              />
            </>
          )}
          {lineProgress >= 0.98 && (
            <>
              <circle
                cx={xScale(1336)}
                cy={yScale(50)}
                r="18"
                fill="#DA0000"
                opacity={0.3 + 0.3 * Math.abs(Math.sin(localFrame * 0.15))}
              />
              <circle
                cx={xScale(1336)}
                cy={yScale(50)}
                r="9"
                fill={ATLAS_COLORS.empireGold}
                stroke="#DA0000"
                strokeWidth="3"
              />
            </>
          )}
        </>
      )}

      {/* COUNTER -50% */}
      {localFrame >= counterStart && (
        <g
          transform="translate(540 410)"
          opacity={Math.min(1, (localFrame - counterStart) / 8)}
        >
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="68"
            fontWeight="700"
            fill="#DA0000"
            filter="url(#redGlow)"
          >
            {counterValue}%
          </text>
        </g>
      )}

      {/* CARTOUCHE BOTTOM */}
      {cartoucheT > 0.05 && (
        <g
          transform={`translate(360 1080) scale(${0.85 + 0.15 * cartoucheT})`}
          opacity={cartoucheT}
        >
          <rect
            x="-280"
            y="-40"
            width="560"
            height="80"
            fill={ATLAS_COLORS.cream}
            stroke={ATLAS_COLORS.empireGold}
            strokeWidth="2"
            rx="6"
          />
          <text
            x="0"
            y="-6"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="22"
            fontWeight="700"
            fill={ATLAS_COLORS.textInk}
            letterSpacing="2"
          >
            AL-UMARI 1338 · AL-MAQRIZI XVe
          </text>
          <text
            x="0"
            y="22"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="18"
            fontWeight="500"
            fill={ATLAS_COLORS.textInk}
            letterSpacing="2"
            opacity="0.80"
            fontStyle="italic"
          >
            DUREE DOCUMENTEE ~12 ANS
          </text>
        </g>
      )}
    </>
  );
};
