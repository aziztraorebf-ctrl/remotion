import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import atlasData from "../../_shared/atlas-v2-data.json";
import {
  AtlasMercator,
  AtlasLabel,
} from "../../_shared/atlas-components";

// Blueprint: Empire qui s'étend
//
// Le contour d'un empire (path SVG precompilé) se remplit progressivement
// sur la carte via une animation strokeDashoffset + fill opacity.
//
// Technique: strokeDasharray + strokeDashoffset pour le tracé du contour,
// puis fill opacity pour le remplissage.
//
// Note: les paths empire sont dans atlas-v2-data.json (mercWide.maliEmpire1300
// pour l'empire du Mali). À substituer selon l'épisode.
//
// Props:
//   cameraSvgX/Y   — centre de la caméra (point central de l'empire)
//   empireColor    — couleur de remplissage de l'empire
//   labelText      — nom de l'empire
//   durationFrames — durée totale (défaut 150)
//   camZoom        — zoom carte (défaut 1.8)
//   strokeDrawFrames — frames pour tracer le contour (défaut 90)
//   fillFadeFrames   — frames pour le fade du remplissage (défaut 40)

interface Props {
  cameraSvgX?: number;
  cameraSvgY?: number;
  empireColor?: string;
  labelText?: string;
  durationFrames?: number;
  camZoom?: number;
  strokeDrawFrames?: number;
  fillFadeFrames?: number;
}

export const EmpireExpansion: React.FC<Props> = ({
  cameraSvgX = 240,
  cameraSvgY = 580,
  empireColor = "#E8C97D",
  labelText = "Empire du Mali (1300)",
  durationFrames = 150,
  camZoom = 1.8,
  strokeDrawFrames = 90,
  fillFadeFrames = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Zoom carte
  const cameraZoom = spring({
    frame,
    fps,
    config: { damping: 70, stiffness: 40, mass: 1 },
    from: 1.0,
    to: camZoom,
    durationInFrames: 40,
  });

  const centerOffsetX = cameraSvgX - 360;
  const centerOffsetY = cameraSvgY - 640;

  // Tracé du contour : strokeDashoffset 1 → 0
  const strokeProgress = interpolate(frame, [10, strokeDrawFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Remplissage : fade après le tracé
  const fillProgress = interpolate(
    frame,
    [strokeDrawFrames, strokeDrawFrames + fillFadeFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Label après remplissage complet
  const labelFrame = strokeDrawFrames + fillFadeFrames + 5;

  // Path empire depuis les données — maliEmpire1300 est un string SVG direct (762 chars)
  const maliPath: string | null = (atlasData as any).mercWide?.maliEmpire1300 ?? null;

  // Longueur réelle du path Mali mesurée empiriquement (762 chars de path SVG)
  const pathLength = 762;
  const dashOffset = pathLength * (1 - strokeProgress);

  const countries = (atlasData as any).mercWide.countries as { iso: string; d: string }[];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill>
        <svg
          viewBox="0 0 720 1280"
          style={{ width: "100%", height: "100%" }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Fond carte */}
          <AtlasMercator
            countries={countries}
            scale={cameraZoom}
            driftX={0}
            driftY={0}
            centerOffsetX={centerOffsetX}
            centerOffsetY={centerOffsetY}
          />

          {/* Overlay empire — groupe transformé comme la carte */}
          <g
            transform={`translate(${360 - centerOffsetX} ${640 - centerOffsetY}) scale(${cameraZoom}) translate(-360 -640)`}
          >
            {maliPath ? (
              <>
                {/* Fill semi-transparent */}
                <path
                  d={maliPath}
                  fill={empireColor}
                  fillOpacity={fillProgress * 0.35}
                  stroke="none"
                />
                {/* Contour animé */}
                <path
                  d={maliPath}
                  fill="none"
                  stroke={empireColor}
                  strokeWidth={2}
                  strokeDasharray={pathLength}
                  strokeDashoffset={dashOffset}
                  strokeOpacity={0.9}
                />
              </>
            ) : (
              // Fallback si le path n'existe pas : cercle générique
              <circle
                cx={cameraSvgX}
                cy={cameraSvgY}
                r={60 * strokeProgress}
                fill={empireColor}
                fillOpacity={fillProgress * 0.3}
                stroke={empireColor}
                strokeWidth={2}
                strokeOpacity={0.9}
              />
            )}
          </g>

          {/* Label empire */}
          <AtlasLabel
            text={labelText}
            coord={[cameraSvgX, cameraSvgY - 50]}
            appearAt={labelFrame}
          />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
