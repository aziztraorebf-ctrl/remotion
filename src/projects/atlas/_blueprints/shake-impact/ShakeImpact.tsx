import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import atlasData from "../../_shared/atlas-v2-data.json";
import {
  AtlasMercator,
  AtlasLabel,
  AtlasPulseMarker,
} from "../../_shared/atlas-components";

// Blueprint: Shake d'impact
//
// Une secousse caméra violente au moment d'un événement narratif fort
// (chute d'un empire, victoire, bataille, catastrophe).
//
// Technique: offset aléatoire déterministe (sin multifréquence) sur driftX/Y.
//   - Phase 1: build-up (zoom progressif vers le POI)
//   - Phase 2: impact (shake intense, 6-8 frames)
//   - Phase 3: decay progressif du shake (amortissement)
//
// Props:
//   impactFrame    — frame déclenchant le shake (défaut 60 = 2s)
//   shakeMagnitude — amplitude px SVG du shake (défaut 12)
//   shakeDuration  — durée du shake en frames (défaut 24)
//   poiSvgX/Y      — coordonnées SVG du centre de l'impact
//   labelText      — texte qui apparaît après le shake
//   durationFrames — durée totale (défaut 150)
//   camZoom        — niveau de zoom (défaut 2.0)

interface Props {
  impactFrame?: number;
  shakeMagnitude?: number;
  shakeDuration?: number;
  poiSvgX?: number;
  poiSvgY?: number;
  labelText?: string;
  durationFrames?: number;
  camZoom?: number;
}

export const ShakeImpact: React.FC<Props> = ({
  impactFrame = 60,
  shakeMagnitude = 12,
  shakeDuration = 24,
  poiSvgX = 300,
  poiSvgY = 550,
  labelText = "Chute de Kumbi",
  durationFrames = 150,
  camZoom = 2.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shakeEnd = impactFrame + shakeDuration;
  const labelFrame = shakeEnd + 5;

  // Zoom vers le POI (arrive avant l'impact)
  const cameraZoom = spring({
    frame,
    fps,
    config: { damping: 60, stiffness: 40, mass: 1 },
    from: 1.2,
    to: camZoom,
    durationInFrames: impactFrame,
  });

  // Shake : amplitude décroissante après l'impact
  // Utilise sin multi-fréquence pour un shake chaotique mais déterministe
  const shakeAmplitude = (() => {
    if (frame < impactFrame) return 0;
    if (frame >= shakeEnd) return 0;
    const t = (frame - impactFrame) / shakeDuration;
    return shakeMagnitude * (1 - t) * (1 - t); // decay quadratique
  })();

  const shakeX =
    shakeAmplitude *
    (Math.sin(frame * 7.3) * 0.6 + Math.sin(frame * 13.1) * 0.4);
  const shakeY =
    shakeAmplitude *
    (Math.sin(frame * 9.7) * 0.5 + Math.sin(frame * 5.3) * 0.5);

  // Flash d'impact : blanc très bref (1-2 frames à l'impact)
  const flashOpacity = (() => {
    if (frame < impactFrame || frame >= impactFrame + 4) return 0;
    return interpolate(frame, [impactFrame, impactFrame + 2, impactFrame + 4], [0, 0.7, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  })();

  const centerOffsetX = poiSvgX - 360;
  const centerOffsetY = poiSvgY - 640;

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
            driftX={shakeX}
            driftY={shakeY}
            centerOffsetX={centerOffsetX}
            centerOffsetY={centerOffsetY}
          />

          {/* Marqueur pulsant au POI */}
          <AtlasPulseMarker
            coord={[poiSvgX, poiSvgY]}
            beatStart={0}
            color="#E8C97D"
          />

          {/* Label après le shake */}
          <AtlasLabel
            text={labelText}
            coord={[poiSvgX, poiSvgY]}
            appearAt={labelFrame}
          />
        </svg>
      </AbsoluteFill>

      {/* Flash d'impact — couche CSS blanche semi-transparente */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: `rgba(255, 200, 100, ${flashOpacity})`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
