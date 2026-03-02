import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SideViewBackground, LANE_A_Y, LANE_B_Y, LANE_C_Y } from "../peste-1347-pixel/components/SideViewBackground";
import { PixelLabSprite } from "../peste-1347-pixel/components/PixelLabSprite";
import { SideViewDebugOverlay } from "../peste-1347-pixel/components/SideViewDebugOverlay";
import {
  computeAnchoredTop,
  computeDisplaySize,
  SIDEVIEW_LAYER_Z,
  wrapScreenX,
} from "../peste-1347-pixel/config/sideViewFoundation";
import { SIDEVIEW_CHARACTER_ASSETS } from "../peste-1347-pixel/config/sideViewAssets";

type CharacterId = keyof typeof SIDEVIEW_CHARACTER_ASSETS;

type PrototypeNpc = {
  id: string;
  characterId: CharacterId;
  laneY: number;
  startX: number;
  walkDir: -1 | 1;
  speed: number;
  scaleOverride?: number;
};

const NPCS: PrototypeNpc[] = [
  { id: "merchant-1", characterId: "merchant", laneY: LANE_A_Y, startX: 260, walkDir: 1, speed: 1.1 },
  { id: "monk-1", characterId: "monk", laneY: LANE_A_Y, startX: 1480, walkDir: -1, speed: 0.95 },
  { id: "peasant-man-1", characterId: "peasantMan", laneY: LANE_B_Y, startX: 860, walkDir: 1, speed: 1.25 },
  { id: "peasant-woman-1", characterId: "peasantWoman", laneY: LANE_C_Y, startX: 420, walkDir: 1, speed: 1.0 },
  { id: "merchant-2", characterId: "merchant", laneY: LANE_C_Y, startX: 1700, walkDir: -1, speed: 1.0 },
];

const SPRITE_FPS = 5;

const getSpeedMultiplier = (frame: number): number => {
  if (frame < 170) return 1;
  if (frame < 240) return interpolate(frame, [170, 240], [1, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return 0.2;
};

const getOpacity = (frame: number, durationInFrames: number): number => {
  return interpolate(frame, [0, 16, durationInFrames - 22, durationInFrames - 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

type PrototypeProps = {
  debug?: boolean;
};

export const SideViewPrototypeCodex: React.FC<PrototypeProps> = ({ debug = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const speedMult = getSpeedMultiplier(frame);
  const globalOpacity = getOpacity(frame, durationInFrames);
  const darkenOverlay = interpolate(frame, [220, durationInFrames - 1], [0, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const positioned = NPCS.map((npc) => {
    const asset = SIDEVIEW_CHARACTER_ASSETS[npc.characterId];
    const displaySize = computeDisplaySize(asset.nativeSize, npc.laneY, npc.scaleOverride);
    const traveled = frame * npc.speed * npc.walkDir * speedMult;
    const x = wrapScreenX(npc.startX + traveled);
    const top = computeAnchoredTop(npc.laneY, displaySize, asset.footAnchorY);
    return {
      npc,
      asset,
      x,
      displaySize,
      top,
      isWalking: speedMult > 0.25,
      footY: top + displaySize * asset.footAnchorY,
    };
  }).sort((a, b) => a.npc.laneY - b.npc.laneY);

  return (
    <AbsoluteFill style={{ backgroundColor: "#08080b", opacity: globalOpacity }}>
      <SideViewBackground
        localFrame={frame}
        totalDuration={durationInFrames}
        darkenOverlay={darkenOverlay}
        fadeInFrames={10}
      />

      {positioned.map(({ npc, asset, x, displaySize, top, isWalking }) => {
        const shadowW = Math.round(displaySize * 0.7);
        const shadowH = Math.round(displaySize * 0.12);
        return (
          <div
            key={npc.id}
            style={{
              position: "absolute",
              left: Math.round(x - displaySize / 2),
              top,
              zIndex: Math.round(npc.laneY),
              filter: "drop-shadow(0 0 3px rgba(0,0,0,0.95))",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: Math.round(displaySize * asset.footAnchorY) - Math.round(shadowH / 2),
                left: Math.round((displaySize - shadowW) / 2),
                width: shadowW,
                height: shadowH,
                background:
                  "radial-gradient(ellipse, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.1) 60%, transparent 80%)",
                borderRadius: "50%",
                filter: "blur(2px)",
              }}
            />
            <PixelLabSprite
              basePath={asset.basePath}
              animation={isWalking ? asset.defaultAnimation : undefined}
              direction={asset.direction}
              frameCount={asset.frameCount}
              frameRate={SPRITE_FPS}
              displaySize={displaySize}
              flipX={npc.walkDir === -1}
              loop
            />
          </div>
        );
      })}

      <AbsoluteFill style={{ zIndex: SIDEVIEW_LAYER_Z.textOverlay, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 34,
            color: "#f6e8bb",
            fontFamily: "monospace",
            fontSize: 24,
            letterSpacing: 1,
            textTransform: "uppercase",
            textShadow: "0 2px 4px rgba(0,0,0,0.6)",
          }}
        >
          SideView Prototype Codex V1
        </div>
      </AbsoluteFill>

      <SideViewDebugOverlay
        enabled={debug}
        npcs={positioned.map(({ npc, x, footY }) => ({
          id: npc.id,
          x,
          laneY: npc.laneY,
          footY,
          zIndex: Math.round(npc.laneY),
        }))}
      />
    </AbsoluteFill>
  );
};

