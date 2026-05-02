// Insert Bar Chart "Expeditions les plus couteuses" - reusable inline component
// Based on AtlasV2InsertBarChartDemo (validated v2: labels right, counter resize, 10s).
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

interface InsertBarChartProps {
  startFrame: number;
  endFrame: number;
}

interface ExpeditionBar {
  name: string;
  year: string;
  cost: number;
  highlight?: boolean;
}

// Or transporte (estimations historiques, ordres de grandeur)
// Marco Polo : mission diplomatique, pas une expedition d'or transporte (~0t)
// Vasco de Gama : ~0.5t epices+or rapportes des Indes (retour 1499)
// Colomb : ~0.2t or des Antilles ramene en Espagne
// Mansa Moussa : 80 chameaux x 150kg = 12 tonnes (Al-Umari 1338, Ibn Battuta)
// Bar width est proportionnelle a 100 (Mansa Moussa = max visuel)
// L'affichage chiffre = vraies tonnes (pas %)
const EXPEDITIONS: ExpeditionBar[] = [
  { name: "MARCO POLO", year: "1271", cost: 0 },
  { name: "VASCO DE GAMA", year: "1497", cost: 4 },
  { name: "COLOMB", year: "1492", cost: 2 },
  { name: "MANSA MOUSSA", year: "1324", cost: 100, highlight: true },
];

const TONNES_LABEL: Record<string, string> = {
  "MARCO POLO": "~0 t",
  "VASCO DE GAMA": "~0,5 t",
  "COLOMB": "~0,2 t",
  "MANSA MOUSSA": "12 t",
};

export const AtlasV2InsertBarChart: React.FC<InsertBarChartProps> = ({
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame >= endFrame) return null;

  const localFrame = frame - startFrame;

  // === Bar chart layout (from v2 fixes) ===
  const chartTopY = 380;
  const barHeight = 60;
  const barGap = 28;
  const barLeftX = 230;
  const barMaxWidth = 440;
  const labelFontSize = 22;
  const yearFontSize = 16;

  // === Animation timings (10s total scene, last ~4s = freeze for reading) ===
  const titleStart = 5;
  const counterStartFrame = fps * 1.2;
  const counterDuration = fps * 1.0;
  const cartoucheStartFrame = fps * 2.0;

  const titleSpring = spring({
    frame: localFrame - titleStart,
    fps,
    config: { damping: 16, stiffness: 180 },
  });

  const counterRaw = interpolate(
    localFrame,
    [counterStartFrame, counterStartFrame + counterDuration],
    [0, 12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const counterValue = localFrame >= counterStartFrame
    ? counterRaw.toFixed(1).replace(".", ",")
    : "0,0";

  const bottomFrame = localFrame - cartoucheStartFrame;
  const bottomSpring = spring({
    frame: bottomFrame,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  return (
    <>
      <rect x="0" y="0" width="720" height="1280" fill="#0F1530" />
      <AtlasSubtleStars opacity={0.45} />

      {/* TITLE */}
      <g
        opacity={titleSpring}
        transform={`translate(360 200) scale(${0.85 + 0.15 * titleSpring})`}
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
          EXPEDITIONS LES PLUS COUTEUSES
        </text>
        <text
          x="0"
          y="32"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontSize="22"
          fontWeight="500"
          fill={ATLAS_COLORS.empireGold}
          letterSpacing="2"
          opacity="0.85"
        >
          XIIIe — XVe SIECLE
        </text>
        <line
          x1="-160"
          y1="50"
          x2="160"
          y2="50"
          stroke={ATLAS_COLORS.empireGold}
          strokeWidth="2"
          opacity="0.55"
        />
      </g>

      {/* BARS */}
      {EXPEDITIONS.map((exp, i) => {
        const barStartFrame = 12 + i * 5;
        const barFillT = spring({
          frame: localFrame - barStartFrame,
          fps,
          config: { damping: 14, stiffness: 90 },
        });
        const fillRatio = exp.cost / 100;
        const targetWidth = barMaxWidth * fillRatio;
        const currentWidth = targetWidth * barFillT;
        const yTop = chartTopY + i * (barHeight + barGap);

        const barColor = exp.highlight
          ? ATLAS_COLORS.empireGold
          : "#7A5A3A";
        const labelColor = exp.highlight ? ATLAS_COLORS.cream : "#C4A88A";
        const labelOpacity = barFillT > 0.05 ? 1 : 0;

        const pulseAlpha = exp.highlight && barFillT > 0.95
          ? 0.4 + 0.4 * Math.abs(Math.sin((localFrame - barStartFrame) * 0.15))
          : 0;

        return (
          <g key={exp.name}>
            {exp.highlight && (
              <rect
                x={barLeftX - 6}
                y={yTop - 6}
                width={currentWidth + 12}
                height={barHeight + 12}
                fill={ATLAS_COLORS.empireGold}
                opacity={pulseAlpha * 0.4}
                rx="6"
              />
            )}

            <rect
              x={barLeftX}
              y={yTop}
              width={barMaxWidth}
              height={barHeight}
              fill="#1A2245"
              opacity="0.5"
              rx="3"
            />

            <rect
              x={barLeftX}
              y={yTop}
              width={currentWidth}
              height={barHeight}
              fill={barColor}
              rx="3"
            />

            {exp.highlight && (
              <rect
                x={barLeftX}
                y={yTop}
                width={currentWidth}
                height={barHeight}
                fill="none"
                stroke={ATLAS_COLORS.cream}
                strokeWidth="1.5"
                opacity={barFillT}
                rx="3"
              />
            )}

            <text
              x={barLeftX - 12}
              y={yTop + barHeight / 2 + 7}
              textAnchor="end"
              fontFamily="Cormorant Garamond, serif"
              fontSize={labelFontSize}
              fontWeight={exp.highlight ? "700" : "500"}
              fill={labelColor}
              opacity={labelOpacity}
            >
              {exp.name}
            </text>

            <text
              x={barLeftX - 12}
              y={yTop + barHeight / 2 + 28}
              textAnchor="end"
              fontFamily="Cormorant Garamond, serif"
              fontSize={yearFontSize}
              fontWeight="500"
              fill={labelColor}
              opacity={labelOpacity * 0.7}
            >
              {exp.year}
            </text>

            {barFillT > 0.4 && (
              <text
                x={
                  exp.cost < 8
                    ? barLeftX + Math.max(currentWidth, 30) + 10
                    : barLeftX + currentWidth - 12
                }
                y={yTop + barHeight / 2 + 7}
                textAnchor={exp.cost < 8 ? "start" : "end"}
                fontFamily="Cormorant Garamond, serif"
                fontSize={exp.highlight ? "26" : "20"}
                fontWeight="700"
                fill={
                  exp.highlight
                    ? "#1A1A1A"
                    : exp.cost < 8
                      ? ATLAS_COLORS.cream
                      : "#FFE9C2"
                }
                opacity={Math.min(1, (barFillT - 0.4) * 3)}
              >
                {TONNES_LABEL[exp.name]}
              </text>
            )}
          </g>
        );
      })}

      {/* COUNTER 12 TONNES D'OR */}
      {localFrame >= counterStartFrame && (
        <g
          transform={`translate(360 940)`}
          opacity={Math.min(1, (localFrame - counterStartFrame) / 8)}
        >
          <text
            x="0"
            y="-22"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="20"
            fontWeight="500"
            fill={ATLAS_COLORS.cream}
            letterSpacing="3"
            opacity="0.7"
          >
            TOTAL OR TRANSPORTE
          </text>
          <text
            x="0"
            y="36"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="76"
            fontWeight="700"
            fill={ATLAS_COLORS.empireGold}
            filter="url(#goldGlow)"
          >
            {counterValue}
          </text>
          <text
            x="0"
            y="68"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="26"
            fontWeight="700"
            fill={ATLAS_COLORS.cream}
            letterSpacing="3"
          >
            TONNES D'OR
          </text>
        </g>
      )}

      {/* CARTOUCHE BOTTOM SOURCES */}
      {bottomFrame > 0 && (
        <g
          transform={`translate(360 1080) scale(${0.85 + 0.15 * bottomSpring})`}
          opacity={bottomSpring}
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
            AL-UMARI · IBN BATTUTA
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
            ESTIMATIONS CONSERVATRICES
          </text>
        </g>
      )}
    </>
  );
};
