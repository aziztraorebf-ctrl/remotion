// Mini-test for Aziz: insert hors-carte "60 000 hommes" pattern.
// Purpose: validate "carte -> wipe -> scene animee -> wipe -> carte" workflow BEFORE Phase 3.
// Duration: 4s (120 frames @ 30fps).
import React from "react";
import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasDefs,
  AtlasMercator,
  AtlasSubtleStars,
  AtlasCartouche,
  atlasV2Data as data,
} from "./atlas-v2-components";

const FPS = 30;

// =============================================================================
// SILHOUETTE GENERATORS (procedural, seeded random)
// =============================================================================

// Pseudo-random seeded
const seededRand = (seed: number): number => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

// Generate ~N silhouettes in a viewBox area (rectangle around center)
interface SilhouetteSpec {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  appearOrder: number; // 0..1 for stagger
}

const generateCrowd = (
  count: number,
  cx: number,
  cy: number,
  spreadX: number,
  spreadY: number,
  seedOffset: number,
  scaleRange: [number, number] = [0.6, 1.0]
): SilhouetteSpec[] => {
  const out: SilhouetteSpec[] = [];
  for (let i = 0; i < count; i++) {
    const r1 = seededRand(i + seedOffset);
    const r2 = seededRand(i + seedOffset + 1000);
    const r3 = seededRand(i + seedOffset + 2000);
    const r4 = seededRand(i + seedOffset + 3000);
    const x = cx + (r1 - 0.5) * spreadX;
    const y = cy + (r2 - 0.5) * spreadY;
    const scale = scaleRange[0] + r3 * (scaleRange[1] - scaleRange[0]);
    const appearOrder = r4;
    out.push({ x, y, scale, opacity: 0.7 + r3 * 0.3, appearOrder });
  }
  return out;
};

// Tiny man silhouette path (8 wide, 16 tall, anchor at feet center)
const MAN_PATH =
  "M0,-16 a3,3 0 1,1 0.01,0 z M-2,-13 L2,-13 L3,-6 L2,-2 L2,0 L1,0 L1,-4 L-1,-4 L-1,0 L-2,0 L-2,-2 L-3,-6 Z";

// Tiny chained slave silhouette (similar to man + line connecting)
const SLAVE_PATH =
  "M0,-12 a2.5,2.5 0 1,1 0.01,0 z M-1.5,-10 L1.5,-10 L2,-5 L1.5,-2 L1.5,0 L0.8,0 L0.8,-3 L-0.8,-3 L-0.8,0 L-1.5,0 L-1.5,-2 L-2,-5 Z";

// Camel stylized path (12 wide, 14 tall)
const CAMEL_PATH =
  "M-6,-2 L-5,-7 L-3,-8 L-2,-7 L-1,-7 L0,-9 L2,-9 L2,-7 L4,-7 L5,-8 L6,-7 L6,-2 L5,-2 L5,0 L4,0 L4,-2 L-3,-2 L-3,0 L-4,0 L-4,-2 Z";

const Silhouette: React.FC<{
  spec: SilhouetteSpec;
  path: string;
  fill: string;
  globalProgress: number; // 0..1 cascade in
}> = ({ spec, path, fill, globalProgress }) => {
  // Stagger : silhouette appears when globalProgress > spec.appearOrder
  const localProgress = Math.max(0, Math.min(1, (globalProgress - spec.appearOrder) * 4));
  if (localProgress <= 0) return null;
  return (
    <g
      transform={`translate(${spec.x} ${spec.y}) scale(${spec.scale * localProgress})`}
      opacity={spec.opacity * localProgress}
    >
      <path d={path} fill={fill} />
    </g>
  );
};

// Connecting line between slaves (for "chained" effect)
const ChainLine: React.FC<{
  specs: SilhouetteSpec[];
  globalProgress: number;
  color: string;
}> = ({ specs, globalProgress, color }) => {
  // Connect every consecutive slave pair
  return (
    <g opacity={0.4}>
      {specs.slice(0, -1).map((spec, i) => {
        const next = specs[i + 1];
        const localProgress = Math.max(
          0,
          Math.min(1, (globalProgress - Math.max(spec.appearOrder, next.appearOrder)) * 4)
        );
        if (localProgress <= 0) return null;
        return (
          <line
            key={i}
            x1={spec.x}
            y1={spec.y - 6}
            x2={next.x}
            y2={next.y - 6}
            stroke={color}
            strokeWidth="0.5"
            opacity={localProgress * 0.5}
          />
        );
      })}
    </g>
  );
};

// =============================================================================
// MAIN COMPOSITION
// =============================================================================

export const AtlasV2Insert60000Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === Phase timing (frames) ===
  const phaseMapEnd = fps * 0.5; // 0-0.5s : carte
  const phaseWipeInEnd = fps * 1.0; // 0.5-1.0s : wipe to scene
  const phaseSceneEnd = fps * 3.0; // 1.0-3.0s : scene animee
  const phaseWipeOutEnd = fps * 3.5; // 3.0-3.5s : wipe to carte
  const phaseEndEnd = fps * 4.0; // 3.5-4.0s : carte

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

  // === Scene global progress (0..1 during phaseScene) ===
  const sceneFrame = frame - phaseWipeInEnd;
  const sceneDuration = phaseSceneEnd - phaseWipeInEnd;
  const sceneProgress = sceneFrame / sceneDuration;

  // === Camera "pull-back" scale during scene ===
  const cameraScale = interpolate(
    sceneFrame,
    [0, sceneDuration * 0.4, sceneDuration],
    [1.3, 0.6, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === Caravane chibi position (slight left-to-right) ===
  const chibiX = interpolate(
    sceneFrame,
    [0, sceneDuration],
    [200, 280],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const chibiHopY = Math.abs(Math.sin(frame * 0.4)) * 5;

  // === Generate the 3 layers (proceduraly seeded) ===
  // Layer 1: 600 silhouettes hommes (representing "60 000")
  // Spread across a wide area behind/around the chibi
  const layer1Specs = React.useMemo(
    () => generateCrowd(600, 360, 700, 700, 400, 1000, [0.5, 0.9]),
    []
  );

  // Layer 2: 200 silhouettes esclaves (representing "12 000")
  // Tighter formation in a band below
  const layer2Specs = React.useMemo(
    () => generateCrowd(200, 360, 950, 600, 120, 5000, [0.4, 0.7]),
    []
  );

  // Layer 3: 30 chameaux (representing "80 chameaux")
  // Single line above
  const layer3Specs = React.useMemo(() => {
    const specs: SilhouetteSpec[] = [];
    for (let i = 0; i < 30; i++) {
      specs.push({
        x: 100 + i * 18,
        y: 400 + Math.sin(i * 0.5) * 8,
        scale: 0.9,
        opacity: 0.85,
        appearOrder: i / 30,
      });
    }
    return specs;
  }, []);

  // === Cartouches timing (relative to scene start) ===
  const c1At = phaseWipeInEnd + fps * 0.2; // "60 000"
  const c2At = phaseWipeInEnd + fps * 0.9; // "12 000"
  const c3At = phaseWipeInEnd + fps * 1.5; // "80 x 150 KG = 12 TONNES D'OR"

  // === Wipe mask Y position (top->bottom curtain) ===
  const wipeInY = interpolate(wipeInProgress, [0, 1], [0, 1280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wipeOutY = interpolate(wipeOutProgress, [0, 1], [0, 1280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === Subtle drift for the scene ===
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
          {/* Vignette darker for the scene (pull-back focus) */}
          <radialGradient id="sceneVignette" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
          </radialGradient>
          {/* Wipe gradient for transitions */}
          <linearGradient id="wipeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ATLAS_COLORS.empireGold} />
            <stop offset="100%" stopColor="#8B5A2B" />
          </linearGradient>
          {/* ClipPath for scene reveal (wipe-in: shows top, wipe-out: shows bottom) */}
          <clipPath id="sceneClipDynamic">
            <rect
              x="0"
              y={isWipingOut ? wipeOutY : 0}
              width="720"
              height={isWipingIn ? wipeInY : isWipingOut ? 1280 - wipeOutY : 1280}
            />
          </clipPath>
        </defs>

        {/* === MAP LAYER (always rendered, hidden by wipe during scene) === */}
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
          {/* Mali Empire 1300 outline noir mat */}
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

        {/* === SCENE LAYER (visible only after wipe in, hidden by wipe out) === */}
        {/* Strategy : render scene ALWAYS during phases 2-4, but mask the part not yet revealed (wipe-in)
            or already covered (wipe-out) with a black rect overlay. Avoids clipPath ordering issues. */}
        {(isWipingIn || isScene || isWipingOut) && (
          <g clipPath="url(#sceneClipDynamic)">
            {/* Scene background : terracotta sombre + etoiles */}
            <rect
              x="0"
              y="0"
              width="720"
              height="1280"
              fill={ATLAS_COLORS.bgBottom}
            />
            <rect
              x="0"
              y="0"
              width="720"
              height="1280"
              fill="url(#bgGrad)"
              opacity="0.85"
            />
            <AtlasSubtleStars opacity={0.4} />

            {/* Scene content with camera pull-back */}
            <g
              transform={`translate(${360 + driftX} ${640 + driftY}) scale(${cameraScale}) translate(${-360} ${-640})`}
            >
              {/* Layer 3 : Chameaux (back row, top) */}
              <g>
                {layer3Specs.map((spec, i) => (
                  <Silhouette
                    key={`camel-${i}`}
                    spec={spec}
                    path={CAMEL_PATH}
                    fill={ATLAS_COLORS.empireGold}
                    globalProgress={Math.max(0, sceneProgress * 1.5 - 0.5)}
                  />
                ))}
              </g>

              {/* Layer 1 : 600 silhouettes hommes (60 000) */}
              <g>
                {layer1Specs.map((spec, i) => (
                  <Silhouette
                    key={`man-${i}`}
                    spec={spec}
                    path={MAN_PATH}
                    fill={ATLAS_COLORS.cream}
                    globalProgress={Math.min(1, sceneProgress * 1.3)}
                  />
                ))}
              </g>

              {/* Layer 2 : 200 silhouettes esclaves chained (12 000) */}
              <g>
                {layer2Specs.map((spec, i) => (
                  <Silhouette
                    key={`slave-${i}`}
                    spec={spec}
                    path={SLAVE_PATH}
                    fill="#8B6F47"
                    globalProgress={Math.max(0, sceneProgress * 1.5 - 0.3)}
                  />
                ))}
                <ChainLine
                  specs={layer2Specs.slice(0, 30)}
                  globalProgress={Math.max(0, sceneProgress * 1.5 - 0.3)}
                  color="#5A3A2A"
                />
              </g>

              {/* Caravane chibi MAIN (centered, larger) */}
              <g
                transform={`translate(${chibiX} ${600 + chibiHopY}) scale(0.85)`}
              >
                <image
                  href={staticFile("atlas-mansa-moussa/v2/chibi/caravane-A.png")}
                  x={-50}
                  y={-100}
                  width={100}
                  height={100}
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            </g>

            {/* Scene vignette */}
            <rect
              x="0"
              y="0"
              width="720"
              height="1280"
              fill="url(#sceneVignette)"
              pointerEvents="none"
            />
          </g>
        )}

        {/* === WIPE GOLD BARS (visible during transitions) === */}
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

        {/* === CARTOUCHES (rendered ABOVE scene only when scene is visible) === */}
        {(isScene || isWipingOut) && (
          <>
            <AtlasCartouche
              appearAt={c1At}
              disappearAt={c2At + fps * 0.3}
              text="60 000"
              subtext="HOMMES"
              x={360}
              y={140}
              fontSize={56}
            />
            <AtlasCartouche
              appearAt={c2At}
              disappearAt={c3At + fps * 0.3}
              text="12 000"
              subtext="ESCLAVES"
              x={360}
              y={1080}
              fontSize={56}
            />
            <AtlasCartouche
              appearAt={c3At}
              disappearAt={phaseSceneEnd}
              text="12 TONNES D'OR"
              subtext="80 CHAMEAUX x 150 KG"
              x={360}
              y={1140}
              fontSize={42}
            />
          </>
        )}

        {/* Phase indicator (debug) */}
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
              ? "Phase 2: wipe -> scene"
              : isScene
                ? "Phase 3: scene hors-carte (60 000 / 12 000 / 12 tonnes)"
                : isWipingOut
                  ? "Phase 4: wipe -> carte"
                  : "Phase 5: carte (retour)"}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

export const ATLAS_V2_INSERT_60000_DEMO_DURATION = FPS * 4;
