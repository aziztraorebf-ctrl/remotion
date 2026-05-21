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
  AtlasPulseMarker,
} from "../../_shared/atlas-components";

// Blueprint: Zoom-révélation (Pull back)
//
// La caméra démarre sur un détail géographique précis (zoom élevé)
// et recule progressivement pour révéler la carte complète.
// Inverse du WalkToDestination — idéal pour les introductions de beat.
//
// Usage narratif: "On était ici... mais regardons ce qui s'est passé à cette échelle."
//
// Props:
//   poiSvgX/Y      — coordonnées SVG du détail initial (720×1280)
//   labelText      — texte du label au point de départ (optionnel)
//   durationFrames — durée totale (défaut 150 = 5s @30fps)
//   startZoom      — zoom initial sur le détail (défaut 4.0)
//   endZoom        — zoom final (défaut 1.0 = carte complète)
//   holdStartFrames — nombre de frames sur le détail avant pull-back (défaut 30)

interface Props {
  poiSvgX?: number;
  poiSvgY?: number;
  labelText?: string;
  durationFrames?: number;
  startZoom?: number;
  endZoom?: number;
  holdStartFrames?: number;
}

export const ZoomRevelation: React.FC<Props> = ({
  poiSvgX = 250,
  poiSvgY = 580,
  labelText = "Empire du Mali",
  durationFrames = 150,
  startZoom = 4.0,
  endZoom = 1.0,
  holdStartFrames = 20,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pullStartFrame = holdStartFrames;
  const pullEndFrame = durationFrames - 10;

  // Pull-back : zoom spring de startZoom → endZoom
  const cameraZoom = spring({
    frame: Math.max(0, frame - pullStartFrame),
    fps,
    config: { damping: 55, stiffness: 25, mass: 1.2 },
    from: startZoom,
    to: endZoom,
    durationInFrames: pullEndFrame - pullStartFrame,
  });

  // Le focus se recentre sur le centre de la carte au fur et à mesure
  const pullProgress = interpolate(
    frame,
    [pullStartFrame, pullEndFrame],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const centerOffsetX = interpolate(pullProgress, [0, 1], [poiSvgX - 360, 0]);
  const centerOffsetY = interpolate(pullProgress, [0, 1], [poiSvgY - 640, 0]);

  // Label : visible uniquement pendant le hold initial, disparaît avant le pull
  const labelVisible = frame < pullStartFrame + 10;
  const labelOpacity = interpolate(
    frame,
    [0, 5, pullStartFrame, pullStartFrame + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const countries = (atlasData as any).mercWide.countries as { iso: string; d: string }[];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill>
        <svg
          viewBox="0 0 720 1280"
          style={{ width: "100%", height: "100%" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <AtlasMercator
            countries={countries}
            scale={cameraZoom}
            driftX={0}
            driftY={0}
            centerOffsetX={centerOffsetX}
            centerOffsetY={centerOffsetY}
          />

          {/* Marqueur sur le détail — disparaît avec le label */}
          {labelVisible && (
            <g opacity={labelOpacity}>
              <AtlasPulseMarker
                coord={[poiSvgX, poiSvgY]}
                beatStart={0}
                color="#E8C97D"
              />
              <AtlasLabel
                text={labelText}
                coord={[poiSvgX, poiSvgY]}
                appearAt={0}
              />
            </g>
          )}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
