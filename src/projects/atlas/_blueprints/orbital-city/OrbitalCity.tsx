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

// Blueprint: Orbital city
//
// La caméra tourne lentement autour d'un point (POI) — effet "orbit" cinématique.
// Le zoom arrive d'abord sur le POI (spring), puis la rotation démarre.
// Un label et un marqueur pulsant apparaissent à mi-chemin.
//
// Technique: AtlasMercator accepte une prop `rotation` (degrees) + scale + centerOffset.
// L'orbit est simulé par un rotation SVG progressif autour du centre de la carte.
//
// Props:
//   poiSvgX/Y      — coordonnées SVG du POI cible (720×1280)
//   labelText      — texte du label
//   durationFrames — durée totale (défaut 150 = 5s @30fps)
//   orbitDegrees   — amplitude de rotation en degrés (défaut 8 = très subtil)
//   targetZoom     — zoom final sur le POI (défaut 2.5)

interface Props {
  poiSvgX?: number;
  poiSvgY?: number;
  labelText?: string;
  durationFrames?: number;
  orbitDegrees?: number;
  targetZoom?: number;
}

export const OrbitalCity: React.FC<Props> = ({
  poiSvgX = 328,
  poiSvgY = 570,
  labelText = "Tombouctou",
  durationFrames = 150,
  orbitDegrees = 8,
  targetZoom = 2.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: zoom vers le POI (30 frames)
  // Phase 2: orbit continu + label apparaît
  const zoomEndFrame = 30;

  const cameraZoom = spring({
    frame,
    fps,
    config: { damping: 60, stiffness: 50, mass: 1 },
    from: 1.0,
    to: targetZoom,
    durationInFrames: zoomEndFrame,
  });

  // Orbit : rotation qui commence après le zoom et oscille doucement
  // sin() progressif normalisé sur la durée restante
  const orbitProgress = interpolate(
    frame,
    [zoomEndFrame, durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const rotation = Math.sin(orbitProgress * Math.PI * 1.5) * orbitDegrees;

  // Dérive lente de la caméra — légère translation circulaire
  const driftX = Math.sin(orbitProgress * Math.PI) * 15;
  const driftY = Math.cos(orbitProgress * Math.PI * 0.7) * 8;

  const centerOffsetX = poiSvgX - 360;
  const centerOffsetY = poiSvgY - 640;

  // Label + pulse apparaissent après le zoom
  const labelFrame = zoomEndFrame + 5;

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
            driftX={driftX}
            driftY={driftY}
            centerOffsetX={centerOffsetX}
            centerOffsetY={centerOffsetY}
            rotation={rotation}
          />

          {/* Marqueur pulsant sur le POI */}
          <AtlasPulseMarker
            coord={[poiSvgX, poiSvgY]}
            beatStart={labelFrame}
            color="#E8C97D"
            ringInner={6}
            ringOuter={22}
          />

          {/* Label ville */}
          <AtlasLabel
            text={labelText}
            coord={[poiSvgX, poiSvgY]}
            appearAt={labelFrame}
          />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
