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

// Blueprint: Alliance
//
// Deux personnages convergent depuis des directions opposées vers un point central.
// Walk animé pendant l'approche, idle à l'arrivée. Cercle doré pulsant + label accord.
//
// Sprites : frames individuels 128×128 PixelLab (6 frames de marche).
// Sprite A (Shaka) converge du nord-ouest. Sprite B (Warrior) converge du nord-est (flipped).
//
// Props:
//   meetSvgX/Y     — point de rencontre en espace SVG
//   labelText      — texte de l'accord
//   durationFrames — durée totale (défaut 150)
//   spriteADir     — dossier frames individuels sprite A
//   spriteBDir     — dossier frames individuels sprite B
//   spriteW        — largeur sprite (défaut 128)
//   spriteScale    — scale CSS (défaut 2.0)
//   camZoom        — zoom carte (défaut 2.0)
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

export const Alliance: React.FC<Props> = ({
  meetSvgX = 340,
  meetSvgY = 560,
  labelText = "Alliance conclue",
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

  const approachEnd = Math.floor(durationFrames * 0.6);
  const accordFrame = approachEnd + 8;

  // Sprite A : vient du nord-ouest
  const progressA = spring({
    frame,
    fps,
    config: { damping: 25, stiffness: 100, mass: 1 },
    from: 0,
    to: 1,
    durationInFrames: approachEnd,
  });

  // Sprite B : vient du nord-est, léger décalage
  const progressB = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 25, stiffness: 100, mass: 1 },
    from: 0,
    to: 1,
    durationInFrames: approachEnd,
  });

  const gapSvg = 18;

  // A vient du coin nord-ouest
  const posAX = interpolate(progressA, [0, 1], [meetSvgX - 120, meetSvgX - gapSvg]);
  const posAY = interpolate(progressA, [0, 1], [meetSvgY - 100, meetSvgY]);

  // B vient du coin nord-est
  const posBX = interpolate(progressB, [0, 1], [meetSvgX + 120, meetSvgX + gapSvg]);
  const posBY = interpolate(progressB, [0, 1], [meetSvgY - 100, meetSvgY]);

  // Hopping pendant l'approche
  const isMovingA = progressA < 0.92;
  const isMovingB = progressB < 0.92;
  const hopA = isMovingA ? Math.abs(Math.sin(frame * 0.4)) * 5 : 0;
  const hopB = isMovingB ? Math.abs(Math.sin(frame * 0.4 + 2)) * 5 : 0;

  // Walk cycle : frame 0 (idle) quand arrivé, sinon cycle 6 frames
  const walkFrameA = isMovingA ? Math.floor(frame / 6) % spriteFrameCount : 0;
  const walkFrameB = isMovingB ? Math.floor(frame / 6) % spriteFrameCount : 0;
  const frameIdxA = String(walkFrameA).padStart(3, "0");
  const frameIdxB = String(walkFrameB).padStart(3, "0");
  const srcA = staticFile(`${spriteADir}frame_${frameIdxA}.png`);
  const srcB = staticFile(`${spriteBDir}frame_${frameIdxB}.png`);

  // Zoom carte
  const cameraZoom = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 35, mass: 1 },
    from: 1.0,
    to: camZoom,
    durationInFrames: durationFrames,
  });

  const centerOffsetX = meetSvgX - ATLAS_SVG_W / 2;
  const centerOffsetY = meetSvgY - ATLAS_SVG_H / 2;

  // Conversion SVG → CSS
  const toCSSX = (svgX: number) =>
    ((svgX - meetSvgX) * cameraZoom + ATLAS_SVG_W / 2) * ATLAS_CSS_SCALE;
  const toCSSY = (svgY: number) =>
    ((svgY - meetSvgY) * cameraZoom + ATLAS_SVG_H / 2) * ATLAS_CSS_SCALE;

  const spritePxW = spriteW * spriteScale;
  const spritePxH = spriteW * spriteScale;

  // Icône accord : cercle doré pulsant qui grossit entre les deux personnages
  const accordProgress = spring({
    frame: Math.max(0, frame - accordFrame),
    fps,
    config: { damping: 15, stiffness: 200, mass: 1 },
    from: 0,
    to: 1,
    durationInFrames: 20,
  });
  const accordX = toCSSX(meetSvgX);
  const accordY = toCSSY(meetSvgY - 25);
  const accordR = accordProgress * 22;
  const accordPulse = 1 + Math.sin(frame * 0.15) * 0.08;

  const countries = (atlasData as any).mercWide.countries as { iso: string; d: string }[];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Carte */}
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
          {/* Pulse marker au point d'alliance */}
          <AtlasPulseMarker
            coord={[meetSvgX, meetSvgY]}
            beatStart={accordFrame}
            color="#E8C97D"
          />
          {/* Label accord — au-dessus des sprites */}
          <AtlasLabel
            text={labelText}
            coord={[meetSvgX, meetSvgY - 60]}
            appearAt={accordFrame + 5}
          />
        </svg>
      </AbsoluteFill>

      {/* Sprite A — Shaka, converge du nord-ouest */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: toCSSX(posAX) - spritePxW / 2,
            top: toCSSY(posAY) - spritePxH - hopA,
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

      {/* Sprite B — Warrior, converge du nord-est, retourné */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: toCSSX(posBX) - spritePxW / 2,
            top: toCSSY(posBY) - spritePxH - hopB,
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

      {/* Icône accord : cercle doré entre les deux persos */}
      {accordR > 0 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <svg
            style={{ position: "absolute", width: "100%", height: "100%" }}
            viewBox="0 0 1080 1920"
          >
            <circle
              cx={accordX}
              cy={accordY}
              r={accordR * accordPulse}
              fill="none"
              stroke="#E8C97D"
              strokeWidth={3}
              opacity={accordProgress * 0.9}
            />
            <circle
              cx={accordX}
              cy={accordY}
              r={(accordR * 0.5) * accordPulse}
              fill="#E8C97D"
              opacity={accordProgress * 0.6}
            />
          </svg>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
