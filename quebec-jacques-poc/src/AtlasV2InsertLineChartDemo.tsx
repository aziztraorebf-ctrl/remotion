// Mini-test: Insert dataviz "Line Chart - Chute prix de l'or 1324-1336"
// Pour Insert #3 (S4 narration "le prix de l'or chute pendant 12 ans")
// Pattern : carte -> wipe -> line chart anime -> wipe -> carte (8.5s total)
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasDefs,
  AtlasMercator,
  AtlasSubtleStars,
  atlasV2Data as data,
} from "./atlas-v2-components";

const FPS = 30;

// =============================================================================
// PRICE CURVE DATA (relative price index 100 = 1324, drops 50% over 12 years)
// =============================================================================
interface CurvePoint {
  year: number;
  price: number; // index, 100 = peak
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

// =============================================================================
// MAIN COMPOSITION
// =============================================================================
export const AtlasV2InsertLineChartDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === Phase timing (8.5s total) ===
  const phaseMapEnd = fps * 0.5;
  const phaseWipeInEnd = fps * 1.0;
  const phaseSceneEnd = fps * 7.5;
  const phaseWipeOutEnd = fps * 8.0;

  const isMap = frame < phaseMapEnd || frame >= phaseWipeOutEnd;
  const isWipingIn = frame >= phaseMapEnd && frame < phaseWipeInEnd;
  const isScene = frame >= phaseWipeInEnd && frame < phaseSceneEnd;
  const isWipingOut = frame >= phaseSceneEnd && frame < phaseWipeOutEnd;

  // === Wipe progress ===
  const wipeInY = interpolate(
    frame,
    [phaseMapEnd, phaseWipeInEnd],
    [0, 1280],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const wipeOutY = interpolate(
    frame,
    [phaseSceneEnd, phaseWipeOutEnd],
    [0, 1280],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === Scene local frame ===
  const sceneFrame = frame - phaseWipeInEnd;

  // === Chart layout ===
  const chartLeftX = 110;
  const chartRightX = 640;
  const chartTopY = 480;
  const chartBottomY = 880;
  const chartW = chartRightX - chartLeftX;
  const chartH = chartBottomY - chartTopY;

  // Map data points to coords
  const xScale = (year: number): number => {
    const t = (year - 1324) / (1336 - 1324);
    return chartLeftX + t * chartW;
  };
  const yScale = (price: number): number => {
    const t = price / 100;
    return chartBottomY - t * chartH;
  };

  // === Animation timing ===
  // 0-0.5s : title spring
  // 0.5-1.5s : axes appear
  // 1.5-4.0s : line draws progressively (stroke-dashoffset)
  // 2.5-4.0s : counter "-50%" decrements 0% -> -50%
  // 4.0-5.0s : "12 ANS" cartouche appears
  // 5.0-6.5s : freeze (lecture)
  const titleStart = 5;
  const axesStart = 15;
  const lineStart = 45;
  const counterStart = 75;
  const counterEnd = 120;
  const cartoucheStart = 120;

  // === Title spring ===
  const titleT = spring({
    frame: sceneFrame - titleStart,
    fps,
    config: { damping: 16, stiffness: 180 },
  });

  // === Axes spring ===
  const axesT = spring({
    frame: sceneFrame - axesStart,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  // === Line draw progress (0-1) over the linePeriod ===
  const lineDuration = 75; // frames = 2.5s
  const lineProgress = interpolate(
    sceneFrame,
    [lineStart, lineStart + lineDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === Build smooth curve path (Catmull-Rom-ish via cubic Bezier) ===
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

  // Path total length (approx) for stroke-dashoffset
  const pathLength = (() => {
    let len = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1][0] - points[i][0];
      const dy = points[i + 1][1] - points[i][1];
      len += Math.sqrt(dx * dx + dy * dy);
    }
    return len * 1.15; // padding for bezier curves
  })();

  const dashOffset = pathLength * (1 - lineProgress);

  // === Current point along the line (for moving dot) ===
  const currentIdx = Math.min(
    points.length - 1,
    Math.floor(lineProgress * (points.length - 1))
  );
  const localT = lineProgress * (points.length - 1) - currentIdx;
  const dotX = points[currentIdx][0]
    + (points[Math.min(points.length - 1, currentIdx + 1)][0] - points[currentIdx][0]) * localT;
  const dotY = points[currentIdx][1]
    + (points[Math.min(points.length - 1, currentIdx + 1)][1] - points[currentIdx][1]) * localT;

  // === Counter -50% ===
  const counterRaw = interpolate(
    sceneFrame,
    [counterStart, counterEnd],
    [0, -50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const counterValue = sceneFrame >= counterStart ? Math.round(counterRaw) : 0;

  // === Cartouche "12 ANS" ===
  const cartoucheT = spring({
    frame: sceneFrame - cartoucheStart,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  // === Subtle drift for the map ===
  const driftX = Math.sin(frame * 0.014) * 8;
  const driftY = Math.cos(frame * 0.011) * 5;

  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgBottom }}>
      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <AtlasDefs />
        <defs>
          <linearGradient id="wipeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ATLAS_COLORS.empireGold} />
            <stop offset="100%" stopColor="#8B5A2B" />
          </linearGradient>
          <clipPath id="sceneClipDynamic">
            <rect
              x="0"
              y={isWipingOut ? wipeOutY : 0}
              width="720"
              height={isWipingIn ? wipeInY : isWipingOut ? 1280 - wipeOutY : 1280}
            />
          </clipPath>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ATLAS_COLORS.empireGold} />
            <stop offset="50%" stopColor="#E8703A" />
            <stop offset="100%" stopColor="#DA0000" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DA0000" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#DA0000" stopOpacity="0.0" />
          </linearGradient>
          <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* === MAP LAYER === */}
        <g>
          <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
          <AtlasSubtleStars opacity={0.6} />
          <AtlasMercator
            countries={data.mercWide.countries}
            highlightFills={{
              MLI: ATLAS_COLORS.maliFill,
              EGY: ATLAS_COLORS.egyptFill,
              SAU: ATLAS_COLORS.egyptFill,
            }}
            driftX={driftX}
            driftY={driftY}
            scale={1}
          />
        </g>

        {/* === SCENE LAYER === */}
        {(isWipingIn || isScene || isWipingOut) && (
          <g clipPath="url(#sceneClipDynamic)">
            <rect x="0" y="0" width="720" height="1280" fill="#0F1530" />
            <AtlasSubtleStars opacity={0.45} />

            {/* === TITLE === */}
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
                LE CAIRE — 1324 a 1336
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

            {/* === AXES === */}
            <g opacity={axesT}>
              {/* Y axis (left vertical) */}
              <line
                x1={chartLeftX}
                y1={chartTopY - 10}
                x2={chartLeftX}
                y2={chartBottomY + 10}
                stroke={ATLAS_COLORS.cream}
                strokeWidth="2"
                opacity="0.6"
              />
              {/* X axis (bottom horizontal) */}
              <line
                x1={chartLeftX - 10}
                y1={chartBottomY}
                x2={chartRightX + 10}
                y2={chartBottomY}
                stroke={ATLAS_COLORS.cream}
                strokeWidth="2"
                opacity="0.6"
              />
              {/* Y labels */}
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
              {/* X labels */}
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
              {/* Horizontal grid line at -50% */}
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

            {/* === LINE CHART === */}
            {lineProgress > 0 && (
              <g>
                {/* Area fill below line (revealed progressively) */}
                <path
                  d={`${curvePath} L${chartRightX},${chartBottomY} L${chartLeftX},${chartBottomY} Z`}
                  fill="url(#areaGrad)"
                  opacity={lineProgress * 0.8}
                  clipPath="url(#lineRevealClip)"
                />
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

                {/* Line glow */}
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
                {/* Line main (gradient gold->red) */}
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

                {/* Moving dot at current position */}
                {lineProgress < 1 && (
                  <g>
                    <circle
                      cx={dotX}
                      cy={dotY}
                      r="14"
                      fill="#DA0000"
                      opacity="0.4"
                    />
                    <circle
                      cx={dotX}
                      cy={dotY}
                      r="7"
                      fill={ATLAS_COLORS.empireGold}
                      stroke="#DA0000"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* Final dot at end (1336, 50%) */}
                {lineProgress >= 0.98 && (
                  <g>
                    <circle
                      cx={xScale(1336)}
                      cy={yScale(50)}
                      r="18"
                      fill="#DA0000"
                      opacity={0.3 + 0.3 * Math.abs(Math.sin(sceneFrame * 0.15))}
                    />
                    <circle
                      cx={xScale(1336)}
                      cy={yScale(50)}
                      r="9"
                      fill={ATLAS_COLORS.empireGold}
                      stroke="#DA0000"
                      strokeWidth="3"
                    />
                  </g>
                )}
              </g>
            )}

            {/* === COUNTER -50% (right side) === */}
            {sceneFrame >= counterStart && (
              <g
                transform="translate(540 410)"
                opacity={Math.min(1, (sceneFrame - counterStart) / 8)}
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

            {/* === CARTOUCHE BOTTOM "12 ANS" === */}
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
                  strokeWidth="3"
                  rx="8"
                />
                <text
                  x="0"
                  y="-2"
                  textAnchor="middle"
                  fontFamily="Cormorant Garamond, serif"
                  fontSize="32"
                  fontWeight="700"
                  fill={ATLAS_COLORS.textInk}
                  letterSpacing="2"
                >
                  12 ANS
                </text>
                <text
                  x="0"
                  y="28"
                  textAnchor="middle"
                  fontFamily="Cormorant Garamond, serif"
                  fontSize="22"
                  fontWeight="500"
                  fill={ATLAS_COLORS.textInk}
                  letterSpacing="2"
                  opacity="0.85"
                >
                  POUR S'EN REMETTRE
                </text>
              </g>
            )}
          </g>
        )}

        {/* === WIPE === */}
        {isWipingIn && (
          <rect x="0" y={wipeInY - 20} width="720" height="20" fill="url(#wipeGrad)" opacity="0.9" />
        )}
        {isWipingOut && (
          <rect x="0" y={wipeOutY - 20} width="720" height="20" fill="url(#wipeGrad)" opacity="0.9" />
        )}

        {/* Phase indicator */}
        <text
          x="20"
          y="40"
          fontFamily="monospace"
          fontSize="16"
          fill={ATLAS_COLORS.cream}
          opacity="0.65"
        >
          {isMap && frame < phaseMapEnd
            ? "P1 carte"
            : isWipingIn
              ? "P2 wipe"
              : isScene
                ? `P3 line chart - chute prix or (${(sceneFrame / fps).toFixed(1)}s)`
                : isWipingOut
                  ? "P4 wipe"
                  : "P5 carte"}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

export const ATLAS_V2_INSERT_LINECHART_DEMO_DURATION = FPS * 8.5;
