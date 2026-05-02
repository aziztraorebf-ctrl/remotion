// Mini-test: Insert dataviz "Pie Chart - La moitie de l'or mondial"
// Pour Insert #1 (S2 narration "la moitie de l'or qui circule")
// Pattern : carte -> wipe -> pie chart anime -> wipe -> carte (8.5s total)
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
import { AtlasFlagDefs, getFlagFill } from "./atlas-v2-flags";

const FPS = 30;

// =============================================================================
// PIE SLICE PATH GENERATOR
// =============================================================================
// Creates an SVG arc path for a pie slice
// startAngle/endAngle in degrees, 0 = top (12 o'clock), clockwise
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

// =============================================================================
// MAIN COMPOSITION
// =============================================================================
export const AtlasV2InsertPieChartDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === Phase timing (8.5s total : 0.5 carte + 0.5 wipe + 6.5 scene + 0.5 wipe + 0.5 carte) ===
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

  // === Pie chart layout ===
  const pieCx = 360;
  const pieCy = 590;
  const pieRadius = 220;

  // === Animation timing within scene ===
  // 0-0.5s   : title spring
  // 0.5-2.0s : pie circle appears (whole circle as "100%" gold pale)
  // 2.0-3.5s : split open (right slice rotates out + becomes gold eclatant + Mali flag)
  // 3.5-4.5s : labels appear (RESTE DU MONDE 50% / MALI 50%)
  // 4.5-5.5s : cartouche bottom "LA MOITIE DE L'OR MONDIAL"
  // 5.5-6.5s : freeze (lecture)
  const titleStart = 5;
  const circleStart = 15;
  const splitStart = 60;
  const labelsStart = 105;
  const cartoucheStart = 135;

  // === Title spring ===
  const titleT = spring({
    frame: sceneFrame - titleStart,
    fps,
    config: { damping: 16, stiffness: 180 },
  });

  // === Circle appears (scale spring) ===
  const circleT = spring({
    frame: sceneFrame - circleStart,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // === Split animation (right hemisphere rotates out) ===
  const splitT = spring({
    frame: sceneFrame - splitStart,
    fps,
    config: { damping: 18, stiffness: 60 },
  });
  // Right slice gets pulled apart by ~25px
  const splitOffset = splitT * 28;
  // Right slice color shifts from pale to gold eclatant
  const rightOpacity = splitT;

  // === Labels ===
  const labelsT = spring({
    frame: sceneFrame - labelsStart,
    fps,
    config: { damping: 16, stiffness: 180 },
  });

  // === Cartouche ===
  const cartoucheT = spring({
    frame: sceneFrame - cartoucheStart,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  // === Mali pulse glow on right slice (after split) ===
  const pulseAlpha = splitT > 0.8
    ? 0.3 + 0.3 * Math.abs(Math.sin((sceneFrame - splitStart) * 0.12))
    : 0;

  // === Subtle drift for the map ===
  const driftX = Math.sin(frame * 0.014) * 8;
  const driftY = Math.cos(frame * 0.011) * 5;

  // === Pie slices ===
  // Left slice : -90 to +90 degrees in CW (top to bottom going left)
  // Right slice : +90 to +270 (or -90 to +90 going right)
  // Easier : we use 2 separate paths
  // Left = 180° to 360° (left half)
  // Right = 0° to 180° (right half)
  const leftPath = arcPath(pieCx, pieCy, pieRadius, 180, 360);
  const rightPath = arcPath(pieCx + splitOffset, pieCy, pieRadius, 0, 180);

  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgBottom }}>
      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <AtlasDefs />
        <AtlasFlagDefs mode="official" bandWidth={14} />
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
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Radial gradient for "Mali gold eclatant" inner */}
          <radialGradient id="maliGoldGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FFE9A8" />
            <stop offset="100%" stopColor={ATLAS_COLORS.empireGold} />
          </radialGradient>
          <radialGradient id="paleGoldGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#7A6A4A" />
            <stop offset="100%" stopColor="#5A4A33" />
          </radialGradient>
        </defs>

        {/* === MAP LAYER (always behind) === */}
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

            {/* === PIE CHART === */}
            <g
              transform={`translate(${pieCx} ${pieCy}) scale(${circleT}) translate(${-pieCx} ${-pieCy})`}
              opacity={circleT}
            >
              {/* Outer ring (subtle decorative) */}
              <circle
                cx={pieCx}
                cy={pieCy}
                r={pieRadius + 8}
                fill="none"
                stroke={ATLAS_COLORS.empireGold}
                strokeWidth="1.5"
                opacity="0.3"
              />

              {/* LEFT slice : "Reste du monde" - pale gold */}
              <path d={leftPath} fill="url(#paleGoldGrad)" />
              <path
                d={leftPath}
                fill="none"
                stroke={ATLAS_COLORS.cream}
                strokeWidth="2"
                opacity="0.5"
              />

              {/* RIGHT slice : "Mali" - gold eclatant + flag overlay */}
              <g transform={`translate(${0} 0)`}>
                {/* Glow halo around right slice */}
                <path
                  d={rightPath}
                  fill={ATLAS_COLORS.empireGold}
                  opacity={pulseAlpha * 0.6}
                  filter="url(#goldGlow)"
                />
                <path d={rightPath} fill="url(#maliGoldGrad)" opacity={rightOpacity} />
                {/* Mali flag overlay subtle */}
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

              {/* Center divider line (vertical, before split) */}
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

              {/* 50% labels INSIDE slices */}
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

            {/* === LABELS LEFT/RIGHT (Reste du monde / Mali) === */}
            {labelsT > 0.05 && (
              <g opacity={labelsT}>
                {/* Left label */}
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
                {/* Right label */}
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

            {/* === CARTOUCHE BOTTOM === */}
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
                  fontSize="28"
                  fontWeight="700"
                  fill={ATLAS_COLORS.textInk}
                  letterSpacing="2"
                >
                  LA MOITIE DE L'OR
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
                  QUI CIRCULE DANS LE MONDE
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
                ? `P3 pie chart - moitie de l'or (${(sceneFrame / fps).toFixed(1)}s)`
                : isWipingOut
                  ? "P4 wipe"
                  : "P5 carte"}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

export const ATLAS_V2_INSERT_PIECHART_DEMO_DURATION = FPS * 8.5;
