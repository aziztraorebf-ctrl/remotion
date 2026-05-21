import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const GOLD_DATA = [
  { year: 2010, price: 1224 },
  { year: 2011, price: 1571 },
  { year: 2012, price: 1668 },
  { year: 2013, price: 1411 },
  { year: 2014, price: 1266 },
  { year: 2015, price: 1160 },
  { year: 2016, price: 1250 },
  { year: 2017, price: 1257 },
  { year: 2018, price: 1268 },
  { year: 2019, price: 1393 },
  { year: 2020, price: 1769 },
  { year: 2021, price: 1798 },
  { year: 2022, price: 1800 },
  { year: 2023, price: 1940 },
  { year: 2024, price: 2386 },
  { year: 2025, price: 3200 },
  { year: 2026, price: 5089 },
];

const ROYALTIES_PCT = 5;
const CHART_PADDING = { top: 60, right: 80, bottom: 80, left: 90 };

export const GoldPriceCurve: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const chartW = width - CHART_PADDING.left - CHART_PADDING.right;
  const chartH = height - CHART_PADDING.top - CHART_PADDING.bottom;

  const minPrice = 1000;
  const maxPrice = 5500;

  const toX = (year: number) =>
    CHART_PADDING.left + ((year - 2010) / (2026 - 2010)) * chartW;

  const toY = (price: number) =>
    CHART_PADDING.top + chartH - ((price - minPrice) / (maxPrice - minPrice)) * chartH;

  // Animation : la courbe se dessine progressivement
  const drawProgress = interpolate(frame, [0, fps * 2.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Construire le path SVG animé
  const visibleCount = Math.max(2, Math.floor(drawProgress * GOLD_DATA.length));
  const visibleData = GOLD_DATA.slice(0, visibleCount);

  const pathD = visibleData
    .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(d.year)} ${toY(d.price)}`)
    .join(" ");

  // Ligne royalties plate
  const royaltiesY = toY(minPrice + (maxPrice - minPrice) * (ROYALTIES_PCT / 100) * 4);
  const royaltiesLabelOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Annotation $5000 finale
  const finalPointOpacity = interpolate(
    frame,
    [fps * 2.5, fps * 2.5 + 20],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const finalPulse = spring({
    frame: Math.max(0, frame - fps * 2.5),
    fps,
    config: { damping: 80, stiffness: 400 },
  });

  // Label "5% depuis 2010"
  const royaltiesLineY = CHART_PADDING.top + chartH * 0.82;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111111",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }}
    >
      {/* Titre */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: CHART_PADDING.left,
          fontSize: 28,
          fontWeight: 900,
          fontFamily: "Arial Black, sans-serif",
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        Prix de l'or ($/once)
      </div>

      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Axes */}
        <line
          x1={CHART_PADDING.left}
          y1={CHART_PADDING.top}
          x2={CHART_PADDING.left}
          y2={CHART_PADDING.top + chartH}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1.5}
        />
        <line
          x1={CHART_PADDING.left}
          y1={CHART_PADDING.top + chartH}
          x2={CHART_PADDING.left + chartW}
          y2={CHART_PADDING.top + chartH}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1.5}
        />

        {/* Labels années */}
        {[2010, 2014, 2018, 2022, 2026].map((year) => (
          <text
            key={year}
            x={toX(year)}
            y={CHART_PADDING.top + chartH + 30}
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize={18}
            fontFamily="Arial, sans-serif"
          >
            {year}
          </text>
        ))}

        {/* Labels prix */}
        {[1000, 2000, 3000, 4000, 5000].map((price) => (
          <g key={price}>
            <text
              x={CHART_PADDING.left - 12}
              y={toY(price) + 6}
              textAnchor="end"
              fill="rgba(255,255,255,0.35)"
              fontSize={16}
              fontFamily="Arial, sans-serif"
            >
              {price >= 1000 ? `${price / 1000}k` : price}
            </text>
            <line
              x1={CHART_PADDING.left}
              y1={toY(price)}
              x2={CHART_PADDING.left + chartW}
              y2={toY(price)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
              strokeDasharray="4 6"
            />
          </g>
        ))}

        {/* Zone sous la courbe */}
        {visibleData.length > 1 && (
          <path
            d={`${pathD} L ${toX(visibleData[visibleData.length - 1].year)} ${CHART_PADDING.top + chartH} L ${toX(2010)} ${CHART_PADDING.top + chartH} Z`}
            fill="url(#goldGradient)"
            opacity={0.25}
          />
        )}

        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Courbe prix or */}
        <path
          d={pathD}
          fill="none"
          stroke="#D4AF37"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Ligne royalties plate */}
        <line
          x1={CHART_PADDING.left}
          y1={royaltiesLineY}
          x2={CHART_PADDING.left + chartW}
          y2={royaltiesLineY}
          stroke="#CC0000"
          strokeWidth={2.5}
          strokeDasharray="8 5"
          opacity={royaltiesLabelOpacity}
        />

        {/* Label royalties */}
        <text
          x={CHART_PADDING.left + chartW - 10}
          y={royaltiesLineY - 10}
          textAnchor="end"
          fill="#CC0000"
          fontSize={20}
          fontWeight="bold"
          fontFamily="Arial Black, sans-serif"
          opacity={royaltiesLabelOpacity}
        >
          5% royalties — inchangé depuis 2010
        </text>

        {/* Point final $5089 */}
        {drawProgress >= 0.95 && (
          <g opacity={finalPointOpacity}>
            <circle
              cx={toX(2026)}
              cy={toY(5089)}
              r={10 * finalPulse}
              fill="#D4AF37"
              opacity={0.3}
            />
            <circle
              cx={toX(2026)}
              cy={toY(5089)}
              r={6}
              fill="#FFD700"
              stroke="#ffffff"
              strokeWidth={2}
            />
          </g>
        )}
      </svg>

      {/* Annotation $5 089 finale */}
      <div
        style={{
          position: "absolute",
          left: toX(2026) - 160,
          top: toY(5089) - 80,
          opacity: finalPointOpacity,
          backgroundColor: "rgba(0,0,0,0.85)",
          border: "2px solid #D4AF37",
          borderRadius: 8,
          padding: "10px 20px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            fontFamily: "Arial Black, sans-serif",
            color: "#D4AF37",
          }}
        >
          $5 089
        </div>
        <div
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Record historique — jan. 2026
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const GOLD_PRICE_CURVE_FRAMES = 150;
