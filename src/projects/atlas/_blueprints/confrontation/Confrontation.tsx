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
} from "../../_shared/atlas-components";

// Blueprint: Confrontation face-à-face
//
// Deux personnages arrivent depuis les bords gauche/droit de la carte,
// s'arrêtent au centre. Walk animé pendant l'approche, idle (frame 0) à l'arrivée.
//
// Sprites : frames individuels 128×128 (6 frames de marche PixelLab).
// Sprite A (Shaka) marche vers la droite. Sprite B (Warrior) marche vers la gauche (flipped).
//
// Props:
//   meetSvgX/Y      — point de rencontre en espace SVG (720×1280)
//   labelText       — texte qui apparaît au-dessus du point de rencontre
//   durationFrames  — durée totale (défaut 150 = 5s @30fps)
//   spriteADir      — dossier frames individuels sprite A (sans nom de frame)
//   spriteBDir      — dossier frames individuels sprite B
//   spriteW         — largeur en pixels (défaut 128)
//   spriteScale     — scale CSS (défaut 2.0)
//   camZoom         — niveau de zoom carte (défaut 2.0)
//   spriteFrameCount — nombre de frames walk (défaut 6)

interface Props {
  meetSvgX?: number;
  meetSvgY?: number;
  labelText?: string;
  durationFrames?: number;
  spriteADir?: string;
  spriteBDir?: string;
  spriteW?: number;
  spriteScale?: number;
  camZoom?: number;
  spriteFrameCount?: number;
}

const ATLAS_CSS_SCALE = 1.5;
const ATLAS_SVG_W = 720;
const ATLAS_SVG_H = 1280;

export const Confrontation: React.FC<Props> = ({
  meetSvgX = 360,
  meetSvgY = 520,
  labelText = "Confrontation",
  durationFrames = 150,
  spriteADir = "atlas-shaka-zulu/archive/shaka-walk-east/",
  spriteBDir = "atlas-shaka-zulu/archive/warrior-walk-east/",
  spriteW = 128,
  spriteScale = 2.0,
  camZoom = 2.2,
  spriteFrameCount = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Les deux sprites entrent pendant les 2/3 de la durée
  const approachEnd = Math.floor(durationFrames * 0.65);

  // Sprite A : entre depuis le bord gauche hors-cadre SVG
  const spriteAProgress = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 90, mass: 1 },
    from: 0,
    to: 1,
    durationInFrames: approachEnd,
  });

  // Sprite B : entre depuis le bord droit, léger décalage de 5 frames
  const spriteBProgress = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 22, stiffness: 90, mass: 1 },
    from: 0,
    to: 1,
    durationInFrames: approachEnd,
  });

  // Offset lateral : les sprites s'arrêtent à ~20px SVG de part et d'autre du point de rencontre
  const gapSvg = 20;

  // A vient de la gauche (startX très négatif)
  const spriteAX = interpolate(spriteAProgress, [0, 1], [-80, meetSvgX - gapSvg]);
  const spriteAY = meetSvgY;

  // B vient de la droite (startX très positif)
  const spriteBX = interpolate(spriteBProgress, [0, 1], [ATLAS_SVG_W + 80, meetSvgX + gapSvg]);
  const spriteBY = meetSvgY;

  // Hopping pendant l'approche
  const isMovingA = spriteAProgress < 0.95;
  const isMovingB = spriteBProgress < 0.95;
  const hopA = isMovingA ? Math.abs(Math.sin(frame * 0.4)) * 5 : 0;
  const hopB = isMovingB ? Math.abs(Math.sin(frame * 0.4 + 1)) * 5 : 0;

  // Walk cycle : frame 0 quand immobile, cycle de 6 frames sinon (5fps)
  const walkFrameA = isMovingA ? Math.floor(frame / 6) % spriteFrameCount : 0;
  const walkFrameB = isMovingB ? Math.floor(frame / 6) % spriteFrameCount : 0;
  const frameIdxA = String(walkFrameA).padStart(3, "0");
  const frameIdxB = String(walkFrameB).padStart(3, "0");
  const srcA = staticFile(`${spriteADir}frame_${frameIdxA}.png`);
  const srcB = staticFile(`${spriteBDir}frame_${frameIdxB}.png`);

  // La caméra zoome sur la zone de rencontre
  const cameraZoom = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 35, mass: 1 },
    from: 1.0,
    to: camZoom,
    durationInFrames: durationFrames,
  });

  // Label au-dessus du point de rencontre — apparaît après l'arrivée
  const labelFrame = approachEnd + 10;

  // Convertir position SVG → position CSS (avec zoom caméra)
  // AtlasMercator zoom via scale + centerOffset (focusX/Y sur meetSvgX/Y)
  const centerOffsetX = meetSvgX - ATLAS_SVG_W / 2;
  const centerOffsetY = meetSvgY - ATLAS_SVG_H / 2;

  // Conversion SVG → CSS pour sprites (math manuelle car svgToComp nécessite focusX/Y)
  const toCSSX = (svgX: number) =>
    ((svgX - meetSvgX) * cameraZoom + ATLAS_SVG_W / 2) * ATLAS_CSS_SCALE;
  const toCSSY = (svgY: number) =>
    ((svgY - meetSvgY) * cameraZoom + ATLAS_SVG_H / 2) * ATLAS_CSS_SCALE;

  const spritePxW = spriteW * spriteScale;
  const spritePxH = spriteW * spriteScale;

  const posAX = toCSSX(spriteAX);
  const posAY = toCSSY(spriteAY);
  const posBX = toCSSX(spriteBX);
  const posBY = toCSSY(spriteBY);

  const countries = (atlasData as any).mercWide.countries as { iso: string; d: string }[];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Carte zoomée sur la zone de rencontre */}
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

          {/* Label point de rencontre */}
          <AtlasLabel
            text={labelText}
            coord={[meetSvgX, meetSvgY - 30]}
            appearAt={labelFrame}
          />
        </svg>
      </AbsoluteFill>

      {/* Sprite A — Shaka, vient de gauche */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: posAX - spritePxW / 2,
            top: posAY - spritePxH - hopA,
          }}
        >
          <Img
            src={srcA}
            style={{
              width: spritePxW,
              height: spritePxH,
              imageRendering: "pixelated",
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Sprite B — Warrior, vient de droite, retourné horizontalement */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: posBX - spritePxW / 2,
            top: posBY - spritePxH - hopB,
            transform: "scaleX(-1)",
          }}
        >
          <Img
            src={srcB}
            style={{
              width: spritePxW,
              height: spritePxH,
              imageRendering: "pixelated",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
