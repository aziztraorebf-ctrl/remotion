// Mini-test: Insert dataviz "Bar Chart Expeditions historiques" pour valider
// l'usage natif de Remotion pour comparaisons chiffrees (vs silhouettes proceduraux abandonnes).
// Pattern : carte -> wipe -> bar chart anime -> wipe -> carte (4s).
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
// DATA
// =============================================================================
interface ExpeditionBar {
  name: string;
  year: string;
  cost: number; // arbitrary unit (relative to Mansa Moussa = 100)
  highlight?: boolean;
}

const EXPEDITIONS: ExpeditionBar[] = [
  { name: "MARCO POLO", year: "1271", cost: 18 },
  { name: "VASCO DE GAMA", year: "1497", cost: 32 },
  { name: "COLOMB", year: "1492", cost: 22 },
  { name: "MANSA MOUSSA", year: "1324", cost: 100, highlight: true },
];

// =============================================================================
// MAIN COMPOSITION
// =============================================================================
export const AtlasV2InsertBarChartDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === Phase timing (5s total : 0.5s carte + 0.5s wipe + 3s scene + 0.5s wipe + 0.5s carte) ===
  const phaseMapEnd = fps * 0.5;
  const phaseWipeInEnd = fps * 1.0;
  const phaseSceneEnd = fps * 4.0; // 3s scene (au lieu de 2s)
  const phaseWipeOutEnd = fps * 4.5;

  const isMap = frame < phaseMapEnd || frame >= phaseWipeOutEnd;
  const isWipingIn = frame >= phaseMapEnd && frame < phaseWipeInEnd;
  const isScene = frame >= phaseWipeInEnd && frame < phaseSceneEnd;
  const isWipingOut = frame >= phaseSceneEnd && frame < phaseWipeOutEnd;

  // === Wipe progress ===
  const wipeInProgress = interpolate(
    frame,
    [phaseMapEnd, phaseWipeInEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const wipeOutProgress = interpolate(
    frame,
    [phaseSceneEnd, phaseWipeOutEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const wipeInY = interpolate(wipeInProgress, [0, 1], [0, 1280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wipeOutY = interpolate(wipeOutProgress, [0, 1], [0, 1280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === Scene local frame ===
  const sceneFrame = frame - phaseWipeInEnd;
  const sceneDuration = phaseSceneEnd - phaseWipeInEnd;

  // === Bar chart layout (FIX: barLeftX=230 pour eviter labels coupes a gauche) ===
  const chartTopY = 380;
  const barHeight = 60;
  const barGap = 28;
  const barLeftX = 230; // moved right to leave room for labels
  const barMaxWidth = 440; // shorter to fit (230 + 440 = 670, marge droite 50px)
  const labelFontSize = 22;
  const yearFontSize = 16;

  // === Title spring entry ===
  const titleSpring = spring({
    frame: sceneFrame - 5,
    fps,
    config: { damping: 16, stiffness: 180 },
  });

  // === Subtotal counter "12 TONNES D'OR" ===
  // Counter starts at scene start + 1.0s, runs for 0.8s
  const counterStartFrame = fps * 1.0;
  const counterDuration = fps * 0.8;
  const counterRaw = interpolate(
    sceneFrame,
    [counterStartFrame, counterStartFrame + counterDuration],
    [0, 12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const counterValue = sceneFrame >= counterStartFrame
    ? counterRaw.toFixed(1).replace(".", ",")
    : "0,0";

  // === Bottom cartouche fade ===
  const bottomFrame = sceneFrame - fps * 1.5;
  const bottomSpring = spring({
    frame: bottomFrame,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  // === Subtle drift for the map (kept consistent) ===
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
          {/* Glow filter for highlighted bar */}
          <filter id="goldGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* === MAP LAYER (always rendered behind) === */}
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
          {data.mercWide.maliEmpire1300 && (
            <g
              transform={`translate(${360 + driftX} ${640 + driftY}) scale(1) translate(${-360} ${-640})`}
            >
              <path
                d={data.mercWide.maliEmpire1300}
                fill="url(#empireHatch)"
                fillOpacity="0.85"
                stroke={ATLAS_COLORS.empireOutlineDark}
                strokeWidth="3"
                strokeOpacity="0.95"
                strokeLinejoin="round"
                strokeDasharray="10 5"
              />
            </g>
          )}
        </g>

        {/* === SCENE LAYER === */}
        {(isWipingIn || isScene || isWipingOut) && (
          <g clipPath="url(#sceneClipDynamic)">
            {/* Sombre background */}
            <rect x="0" y="0" width="720" height="1280" fill="#0F1530" />
            <AtlasSubtleStars opacity={0.45} />

            {/* === TITLE === */}
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
              {/* Underline */}
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

            {/* === BARS === */}
            {EXPEDITIONS.map((exp, i) => {
              // Each bar starts staggered by 0.18s, lasts 0.7s for fill
              const barStartFrame = 12 + i * 5;
              const barFillT = spring({
                frame: sceneFrame - barStartFrame,
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
              const labelColor = exp.highlight
                ? ATLAS_COLORS.cream
                : "#C4A88A";
              const labelOpacity = barFillT > 0.05 ? 1 : 0;

              // Pulse for highlighted bar (Mansa Moussa)
              const pulseAlpha = exp.highlight && barFillT > 0.95
                ? 0.4 + 0.4 * Math.abs(Math.sin((sceneFrame - barStartFrame) * 0.15))
                : 0;

              return (
                <g key={exp.name}>
                  {/* Highlight glow under bar */}
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

                  {/* Bar background track */}
                  <rect
                    x={barLeftX}
                    y={yTop}
                    width={barMaxWidth}
                    height={barHeight}
                    fill="#1A2245"
                    opacity="0.5"
                    rx="3"
                  />

                  {/* Bar fill */}
                  <rect
                    x={barLeftX}
                    y={yTop}
                    width={currentWidth}
                    height={barHeight}
                    fill={barColor}
                    rx="3"
                  />

                  {/* Highlight border */}
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

                  {/* Name label (left of bar) */}
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

                  {/* Year label (small, under name) */}
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

                  {/* Cost label (inside bar at end) */}
                  {barFillT > 0.4 && (
                    <text
                      x={barLeftX + currentWidth - 12}
                      y={yTop + barHeight / 2 + 7}
                      textAnchor="end"
                      fontFamily="Cormorant Garamond, serif"
                      fontSize={exp.highlight ? "26" : "20"}
                      fontWeight="700"
                      fill={exp.highlight ? "#1A1A1A" : "#FFE9C2"}
                      opacity={Math.min(1, (barFillT - 0.4) * 3)}
                    >
                      {exp.cost}%
                    </text>
                  )}
                </g>
              );
            })}

            {/* === COUNTER 12 TONNES D'OR (centered, smaller, lower) === */}
            {sceneFrame >= counterStartFrame && (
              <g
                transform={`translate(360 940)`}
                opacity={Math.min(1, (sceneFrame - counterStartFrame) / 8)}
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

            {/* === BOTTOM CARTOUCHE "60 000 + 12 000" (descendu pour ne pas chevaucher counter) === */}
            {bottomFrame > 0 && (
              <g
                transform={`translate(360 1200) scale(${0.85 + 0.15 * bottomSpring})`}
                opacity={bottomSpring}
              >
                <rect
                  x="-260"
                  y="-32"
                  width="520"
                  height="64"
                  fill={ATLAS_COLORS.cream}
                  stroke={ATLAS_COLORS.empireGold}
                  strokeWidth="2"
                  rx="6"
                />
                <text
                  x="0"
                  y="8"
                  textAnchor="middle"
                  fontFamily="Cormorant Garamond, serif"
                  fontSize="26"
                  fontWeight="700"
                  fill={ATLAS_COLORS.textInk}
                  letterSpacing="2"
                >
                  60 000 HOMMES + 12 000 ESCLAVES
                </text>
              </g>
            )}
          </g>
        )}

        {/* === WIPE GOLD BAR === */}
        {isWipingIn && (
          <rect
            x="0"
            y={wipeInY - 20}
            width="720"
            height="20"
            fill="url(#wipeGrad)"
            opacity="0.9"
          />
        )}
        {isWipingOut && (
          <rect
            x="0"
            y={wipeOutY - 20}
            width="720"
            height="20"
            fill="url(#wipeGrad)"
            opacity="0.9"
          />
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
            ? "Phase 1: carte (reference)"
            : isWipingIn
              ? "Phase 2: wipe -> dataviz"
              : isScene
                ? "Phase 3: bar chart natif Remotion"
                : isWipingOut
                  ? "Phase 4: wipe -> carte"
                  : "Phase 5: carte (retour)"}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

export const ATLAS_V2_INSERT_BARCHART_DEMO_DURATION = FPS * 5;
