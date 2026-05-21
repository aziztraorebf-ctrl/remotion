// Mini-demo for Aziz: rotation + zoom + tilt-like effects on Atlas Mercator map.
// Purpose: validate camera language vocabulary BEFORE batch production.
// Duration: 8s (240 frames @ 30fps). No audio.
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
  AtlasEmpire,
  AtlasSubtleStars,
  AtlasLabel,
  AtlasPulseMarker,
  atlasV2Data as data,
} from "./atlas-v2-components";

const FPS = 30;

export const AtlasV2RotationDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A (0-2s): static initial frame, normal scale
  // Phase B (2-4s): zoom in toward Caire (Egypte)
  // Phase C (4-6s): rotate 45deg + slight tilt-like skew
  // Phase D (6-8s): rotate back + reset
  const phaseA_end = fps * 2;
  const phaseB_end = fps * 4;
  const phaseC_end = fps * 6;
  const phaseD_end = fps * 8;

  // Scale: 1.0 -> 1.6 -> 1.6 -> 1.0
  const scaleT1 = interpolate(frame, [0, phaseA_end], [1.0, 1.0], {
    extrapolateRight: "clamp",
  });
  const scaleT2 = interpolate(frame, [phaseA_end, phaseB_end], [1.0, 1.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scaleT3 = interpolate(frame, [phaseB_end, phaseC_end], [1.6, 1.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scaleT4 = interpolate(frame, [phaseC_end, phaseD_end], [1.6, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale =
    frame < phaseA_end
      ? scaleT1
      : frame < phaseB_end
        ? scaleT2
        : frame < phaseC_end
          ? scaleT3
          : scaleT4;

  // Rotation: 0 -> 0 -> 45 -> 0
  const rotation = interpolate(
    frame,
    [phaseB_end, phaseC_end, phaseD_end],
    [0, 45, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Center shift toward Caire (~430, 540 on mercWide projection)
  const caireCoord = data.mercWide.cities.LeCaire as [number, number];
  const offsetXToCaire = caireCoord[0] - 360;
  const offsetYToCaire = caireCoord[1] - 640;

  const centerOffsetX = interpolate(
    frame,
    [phaseA_end, phaseB_end],
    [0, offsetXToCaire],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const centerOffsetY = interpolate(
    frame,
    [phaseA_end, phaseB_end],
    [0, offsetYToCaire],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Continuous micro-drift (Aziz validated this on Iter2)
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
          scale={scale}
          centerOffsetX={centerOffsetX}
          centerOffsetY={centerOffsetY}
          rotation={rotation}
        />

        {/* Mali Empire 1300 with NEW outline noir mat */}
        {data.mercWide.maliEmpire1300 && (
          <g
            transform={`translate(${360 + driftX - centerOffsetX} ${640 + driftY - centerOffsetY}) rotate(${rotation}) scale(${scale}) translate(${-360} ${-640})`}
          >
            <AtlasEmpire pathD={data.mercWide.maliEmpire1300} outlineDark={true} />
          </g>
        )}

        {/* Demo labels with rotation - notice they rotate WITH the map */}
        <g
          transform={`translate(${360 + driftX - centerOffsetX} ${640 + driftY - centerOffsetY}) rotate(${rotation}) scale(${scale}) translate(${-360} ${-640})`}
        >
          <AtlasPulseMarker
            coord={caireCoord}
            beatStart={phaseA_end}
            color={ATLAS_COLORS.empireGold}
          />
          <AtlasLabel
            coord={caireCoord}
            text="LE CAIRE"
            appearAt={phaseA_end + 15}
          />
        </g>

        <rect
          x="0"
          y="0"
          width="720"
          height="1280"
          fill="url(#vignette)"
          pointerEvents="none"
        />

        {/* Phase indicator (debug) */}
        <text
          x="20"
          y="40"
          fontFamily="monospace"
          fontSize="20"
          fill={ATLAS_COLORS.cream}
          opacity="0.7"
        >
          {frame < phaseA_end
            ? "Phase A: static initial"
            : frame < phaseB_end
              ? "Phase B: zoom to Caire"
              : frame < phaseC_end
                ? "Phase C: rotate 45deg"
                : "Phase D: rotate back + zoom out"}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

export const ATLAS_V2_ROTATION_DEMO_DURATION = FPS * 8;
