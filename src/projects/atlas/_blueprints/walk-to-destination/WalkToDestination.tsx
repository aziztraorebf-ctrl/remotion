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
  AtlasLabel,
  AtlasMercator,
  AtlasPulseMarker,
  getSpriteAnimFrame,
  getSpriteClipPath,
  svgToComp,
  ATLAS_CX,
  ATLAS_CY,
} from "../../_shared/atlas-components";
import type { AtlasCameraState } from "../../_shared/atlas-components";

// Blueprint: Walk-to-destination
//
// Un personnage marche d'un point A vers un point B sur la carte,
// pendant que la caméra zoom progressivement sur la destination.
//
// Deux modes de sprite :
//   - spriteSheet=true  : spritesheet horizontal N frames (ex: chameau 4f × 64px)
//   - spriteSheet=false : frames individuels nommés frame_000.png..frame_005.png (ex: Shaka 6f × 128px)
//
// Props:
//   startSvgX/Y    — coordonnées SVG du point de départ (espace 720×1280)
//   endSvgX/Y      — coordonnées SVG de la destination
//   labelText      — texte du label qui apparaît à l'arrivée
//   durationFrames — durée totale (défaut 150 = 5s @30fps)
//   spriteSrc      — chemin staticFile base (sheet) ou dossier/ (frames individuels)
//   spriteFrameW   — largeur d'un frame en pixels (défaut 128)
//   spriteScale    — scale CSS du sprite (défaut 2.4)
//   spriteFrameCount — nombre de frames dans le cycle (défaut 6)
//   spriteSheet    — true = sheet horizontal, false = frames individuels (défaut false)

interface Props {
  startSvgX?: number;
  startSvgY?: number;
  endSvgX?: number;
  endSvgY?: number;
  labelText?: string;
  durationFrames?: number;
  spriteSrc?: string;
  spriteFrameW?: number;
  spriteScale?: number;
  spriteFrameCount?: number;
  spriteSheet?: boolean;
}

export const WalkToDestination: React.FC<Props> = ({
  startSvgX = 150,
  startSvgY = 500,
  endSvgX = 290,
  endSvgY = 420,
  labelText = "Kumbi Saleh",
  durationFrames = 150,
  spriteSrc = "atlas-shaka-zulu/archive/shaka-walk-east/",
  spriteFrameW = 128,
  spriteScale = 2.4,
  spriteFrameCount = 6,
  spriteSheet = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const walkEndFrame = durationFrames - 30;

  // Progression de la marche (0 → 1 pendant les premières 4/5 de la durée)
  const walkProgress = interpolate(frame, [0, walkEndFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Position courante du sprite en espace SVG
  const spriteSvgX = interpolate(walkProgress, [0, 1], [startSvgX, endSvgX]);
  const spriteSvgY = interpolate(walkProgress, [0, 1], [startSvgY, endSvgY]);

  // Zoom caméra : part de 1.0 (vue large) et arrive à 2.8 (POI)
  const camZoom = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 40, mass: 1 },
    from: 1.0,
    to: 2.8,
    durationInFrames: durationFrames,
  });

  // Le centre de la caméra suit progressivement le sprite via centerOffset
  // AtlasMercator centré sur (cx, cy)=(360, 640). centerOffset déplace la vue.
  const camCenterOffsetX = interpolate(walkProgress, [0, 1], [0, endSvgX - ATLAS_CX]);
  const camCenterOffsetY = interpolate(walkProgress, [0, 1], [0, endSvgY - ATLAS_CY]);

  // Pour svgToComp, on construit un cam compatible
  const cam: AtlasCameraState = {
    focusX: ATLAS_CX + camCenterOffsetX,
    focusY: ATLAS_CY + camCenterOffsetY,
    camZoom,
    driftX: 0,
    driftY: 0,
  };

  // Position CSS du sprite via svgToComp
  const spritePos = svgToComp(spriteSvgX, spriteSvgY, cam);

  // Hopping sin() pour simuler la marche
  const hopY = frame < walkEndFrame ? Math.abs(Math.sin(frame * 0.35)) * 6 : 0;

  // Walk cycle — 5fps
  const animFrame = Math.floor(frame / 6) % spriteFrameCount;

  // Pour spritesheet : clipPath horizontal
  const clipPath = getSpriteClipPath(animFrame, spriteFrameCount);

  // Pour frames individuels : URL dynamique
  const frameIndex = String(animFrame).padStart(3, "0");
  const individualSrc = `${spriteSrc}frame_${frameIndex}.png`;

  const countries = (atlasData as any).mercWide.countries as { iso: string; d: string }[];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Carte de base */}
      <AbsoluteFill>
        <svg
          viewBox="0 0 720 1280"
          style={{ width: "100%", height: "100%" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <AtlasMercator
            countries={countries}
            scale={camZoom}
            driftX={0}
            driftY={0}
            centerOffsetX={camCenterOffsetX}
            centerOffsetY={camCenterOffsetY}
          />

          {/* Marqueur pulsant à la destination */}
          <AtlasPulseMarker
            coord={[endSvgX, endSvgY]}
            beatStart={0}
            color="#E8C97D"
          />

          {/* Label destination — apparaît à l'arrivée */}
          <AtlasLabel
            text={labelText}
            coord={[endSvgX, endSvgY]}
            appearAt={walkEndFrame}
          />
        </svg>
      </AbsoluteFill>

      {/* Sprite — couche CSS par-dessus la carte */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: spritePos.x - (spriteFrameW * spriteScale) / 2,
            top: spritePos.y - spriteFrameW * spriteScale - hopY,
            overflow: "hidden",
            width: spriteFrameW * spriteScale,
            height: spriteFrameW * spriteScale,
          }}
        >
          {spriteSheet ? (
            <Img
              src={staticFile(spriteSrc)}
              style={{
                width: spriteFrameW * spriteFrameCount * spriteScale,
                height: spriteFrameW * spriteScale,
                imageRendering: "pixelated",
                clipPath,
              }}
            />
          ) : (
            <Img
              src={staticFile(individualSrc)}
              style={{
                width: spriteFrameW * spriteScale,
                height: spriteFrameW * spriteScale,
                imageRendering: "pixelated",
              }}
            />
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
