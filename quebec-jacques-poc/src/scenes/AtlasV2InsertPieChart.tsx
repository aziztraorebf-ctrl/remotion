// Insert Pie Chart "La moitie de l'or" - reusable component for inline use in main composition.
// Based on AtlasV2InsertPieChartDemo (validated).
// Wipe transitions are handled by the parent composition (or by a dedicated wipe layer).
// This component renders ONLY the dataviz scene content (no wipe).
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
import { getFlagFill } from "../atlas-v2-flags";

interface InsertPieChartProps {
  startFrame: number;
  endFrame: number;
}

const polarToCartesian = (
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
): [number, number] => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
};

const arcPath = (
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string => {
  const [sx, sy] = polarToCartesian(cx, cy, radius, endAngle);
  const [ex, ey] = polarToCartesian(cx, cy, radius, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M${cx},${cy} L${sx},${sy} A${radius},${radius} 0 ${largeArc} 0 ${ex},${ey} Z`;
};

export const AtlasV2InsertPieChart: React.FC<InsertPieChartProps> = ({
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame >= endFrame) return null;

  const localFrame = frame - startFrame;

  const pieCx = 360;
  const pieCy = 590;
  const pieRadius = 220;

  // Scaled timings for 10s total (was 6.5s scene in demo)
  // Allocate: 0.5s title + 1.5s circle + 1.5s split + 1s labels + 1s cartouche + 4.5s freeze
  const titleStart = 5;
  const circleStart = 18;
  const splitStart = 60;
  const labelsStart = 105;
  const cartoucheStart = 135;

  const titleT = spring({
    frame: localFrame - titleStart,
    fps,
    config: { damping: 16, stiffness: 180 },
  });
  const circleT = spring({
    frame: localFrame - circleStart,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const splitT = spring({
    frame: localFrame - splitStart,
    fps,
    config: { damping: 18, stiffness: 60 },
  });
  const labelsT = spring({
    frame: localFrame - labelsStart,
    fps,
    config: { damping: 16, stiffness: 180 },
  });
  const cartoucheT = spring({
    frame: localFrame - cartoucheStart,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  const splitOffset = splitT * 28;
  const rightOpacity = splitT;
  const pulseAlpha = splitT > 0.8
    ? 0.3 + 0.3 * Math.abs(Math.sin(localFrame * 0.12))
    : 0;

  const leftPath = arcPath(pieCx, pieCy, pieRadius, 180, 360);
  const rightPath = arcPath(pieCx + splitOffset, pieCy, pieRadius, 0, 180);

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
          fontSize="36"
          fontWeight="700"
          fill={ATLAS_COLORS.cream}
          letterSpacing="2"
        >
          L'OR EN CIRCULATION
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
          MONDE — XIVe SIECLE
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

      {/* PIE CHART */}
      <g
        transform={`translate(${pieCx} ${pieCy}) scale(${circleT}) translate(${-pieCx} ${-pieCy})`}
        opacity={circleT}
      >
        <circle
          cx={pieCx}
          cy={pieCy}
          r={pieRadius + 8}
          fill="none"
          stroke={ATLAS_COLORS.empireGold}
          strokeWidth="1.5"
          opacity="0.3"
        />

        {/* LEFT slice : Reste du monde */}
        <path d={leftPath} fill="url(#paleGoldGrad)" />
        <path
          d={leftPath}
          fill="none"
          stroke={ATLAS_COLORS.cream}
          strokeWidth="2"
          opacity="0.5"
        />

        {/* RIGHT slice : Mali */}
        <g>
          <path
            d={rightPath}
            fill={ATLAS_COLORS.empireGold}
            opacity={pulseAlpha * 0.6}
            filter="url(#goldGlow)"
          />
          <path d={rightPath} fill="url(#maliGoldGrad)" opacity={rightOpacity} />
          <path
            d={rightPath}
            fill={getFlagFill("MLI", ATLAS_COLORS.empireGold)}
            opacity={rightOpacity * 0.35}
          />
          <path
            d={rightPath}
            fill="none"
            stroke={ATLAS_COLORS.cream}
            strokeWidth="2.5"
            opacity={rightOpacity * 0.85}
          />
        </g>

        {/* Center divider before split */}
        {splitT < 0.3 && (
          <line
            x1={pieCx}
            y1={pieCy - pieRadius}
            x2={pieCx}
            y2={pieCy + pieRadius}
            stroke={ATLAS_COLORS.cream}
            strokeWidth="2.5"
            opacity={1 - splitT * 3}
          />
        )}

        {/* 50% labels */}
        {labelsT > 0.1 && (
          <>
            <text
              x={pieCx - 110}
              y={pieCy + 12}
              textAnchor="middle"
              fontFamily="Cormorant Garamond, serif"
              fontSize="48"
              fontWeight="700"
              fill={ATLAS_COLORS.cream}
              opacity={labelsT * 0.85}
            >
              50%
            </text>
            <text
              x={pieCx + 110 + splitOffset}
              y={pieCy + 12}
              textAnchor="middle"
              fontFamily="Cormorant Garamond, serif"
              fontSize="56"
              fontWeight="700"
              fill="#1A1A1A"
              opacity={labelsT}
            >
              50%
            </text>
          </>
        )}
      </g>

      {/* Side labels */}
      {labelsT > 0.05 && (
        <g opacity={labelsT}>
          <text
            x={pieCx - 240}
            y={pieCy - 240}
            textAnchor="start"
            fontFamily="Cormorant Garamond, serif"
            fontSize="22"
            fontWeight="600"
            fill={ATLAS_COLORS.cream}
            letterSpacing="2"
            opacity="0.85"
          >
            RESTE DU MONDE
          </text>
          <text
            x={pieCx + 240}
            y={pieCy - 240}
            textAnchor="end"
            fontFamily="Cormorant Garamond, serif"
            fontSize="28"
            fontWeight="700"
            fill={ATLAS_COLORS.empireGold}
            letterSpacing="2"
          >
            MALI
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
            strokeWidth="3"
            rx="8"
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
            IBN BATTUTA · AL-UMARI
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
            ESTIMATION CONSERVATRICE · XIVe SIECLE
          </text>
        </g>
      )}
    </>
  );
};
