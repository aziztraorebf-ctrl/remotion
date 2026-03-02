import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { W, H, GROUND_Y, enter, exit, StyleTitle } from "./ShowcaseShared";

const PX = 8; // pixel size in px

// Palette
const C = {
  TRANS: "transparent",
  SKY:   "#1a1a3e",
  SKY2:  "#0d0d2e",
  GND:   "#2a4a1a",
  GND2:  "#1a3a0a",
  MOON:  "#e8e0c0",
  STAR:  "#ffffff",
  // Warrior
  W_SKIN: "#d4a076",
  W_HAIR: "#2a1a08",
  W_ARM:  "#8a4a1a",
  W_LEG:  "#4a3a2a",
  W_BOOT: "#1a1008",
  W_BELT: "#6a3a10",
  W_EYE:  "#1a1008",
  W_SWORD:"#c8d0d8",
  W_GUARD:"#c8a040",
  // Mage
  M_ROBE: "#2a1a6a",
  M_ROBE2:"#3a2a8a",
  M_SKIN: "#e0c0a0",
  M_HAIR: "#4a1a0a",
  M_EYE:  "#c8a040",
  M_STAFF:"#6a3a10",
  M_GEM:  "#4a90e2",
  M_SPARKL:"#c8d0e8",
};

// Render a 2D pixel grid as divs
const PixelGrid: React.FC<{
  grid: string[][];
  x: number;
  y: number;
  scale?: number;
}> = ({ grid, x, y, scale = 1 }) => {
  const ps = PX * scale;
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {grid.map((row, ri) => (
        <div key={ri} style={{ display: "flex" }}>
          {row.map((col, ci) => (
            <div
              key={ci}
              style={{
                width: ps,
                height: ps,
                background: col === C.TRANS ? "transparent" : col,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// 16x24 warrior sprites (stand & walk)
const WARRIOR_STAND: string[][] = [
  [C.TRANS,C.TRANS,C.W_HAIR,C.W_HAIR,C.W_HAIR,C.W_HAIR,C.TRANS,C.TRANS],
  [C.TRANS,C.W_HAIR,C.W_SKIN,C.W_SKIN,C.W_SKIN,C.W_SKIN,C.W_HAIR,C.TRANS],
  [C.TRANS,C.W_HAIR,C.W_SKIN,C.W_EYE,C.W_SKIN,C.W_EYE,C.W_HAIR,C.TRANS],
  [C.TRANS,C.W_HAIR,C.W_SKIN,C.W_SKIN,C.W_SKIN,C.W_SKIN,C.W_HAIR,C.TRANS],
  [C.TRANS,C.TRANS,C.W_SKIN,C.W_SKIN,C.W_SKIN,C.W_SKIN,C.TRANS,C.TRANS],
  [C.TRANS,C.W_ARM, C.W_ARM, C.W_BELT,C.W_BELT,C.W_ARM, C.W_ARM,C.TRANS],
  [C.W_ARM, C.W_ARM,C.W_ARM, C.W_BELT,C.W_BELT,C.W_ARM, C.W_ARM,C.W_ARM],
  [C.W_ARM, C.W_ARM,C.W_ARM, C.W_BELT,C.W_BELT,C.W_ARM, C.W_ARM,C.W_ARM],
  [C.TRANS,C.W_SWORD,C.W_ARM,C.W_BELT,C.W_BELT,C.W_ARM,C.TRANS,C.TRANS],
  [C.TRANS,C.W_SWORD,C.W_ARM,C.W_ARM, C.W_ARM, C.W_ARM,C.TRANS,C.TRANS],
  [C.TRANS,C.W_GUARD,C.W_LEG,C.W_LEG, C.W_LEG, C.W_LEG,C.TRANS,C.TRANS],
  [C.TRANS,C.TRANS,C.W_LEG, C.W_LEG,  C.W_LEG, C.W_LEG,C.TRANS,C.TRANS],
  [C.TRANS,C.TRANS,C.W_LEG, C.W_LEG,  C.W_LEG, C.W_LEG,C.TRANS,C.TRANS],
  [C.TRANS,C.TRANS,C.W_BOOT,C.W_LEG,  C.W_LEG, C.W_BOOT,C.TRANS,C.TRANS],
  [C.TRANS,C.TRANS,C.W_BOOT,C.TRANS,  C.TRANS, C.W_BOOT,C.TRANS,C.TRANS],
];

// Walk frame: legs shifted
const WARRIOR_WALK: string[][] = [
  [C.TRANS,C.TRANS,C.W_HAIR,C.W_HAIR,C.W_HAIR,C.W_HAIR,C.TRANS,C.TRANS],
  [C.TRANS,C.W_HAIR,C.W_SKIN,C.W_SKIN,C.W_SKIN,C.W_SKIN,C.W_HAIR,C.TRANS],
  [C.TRANS,C.W_HAIR,C.W_SKIN,C.W_EYE,C.W_SKIN,C.W_EYE,C.W_HAIR,C.TRANS],
  [C.TRANS,C.W_HAIR,C.W_SKIN,C.W_SKIN,C.W_SKIN,C.W_SKIN,C.W_HAIR,C.TRANS],
  [C.TRANS,C.TRANS,C.W_SKIN,C.W_SKIN,C.W_SKIN,C.W_SKIN,C.TRANS,C.TRANS],
  [C.W_ARM, C.W_ARM,C.W_ARM, C.W_BELT,C.W_BELT,C.W_ARM, C.W_ARM,C.W_SWORD],
  [C.W_ARM, C.W_ARM,C.W_ARM, C.W_BELT,C.W_BELT,C.W_ARM, C.W_ARM,C.W_SWORD],
  [C.TRANS,C.W_ARM, C.W_ARM, C.W_BELT,C.W_BELT,C.W_ARM, C.W_ARM,C.TRANS],
  [C.TRANS,C.TRANS,C.W_ARM, C.W_ARM,  C.W_ARM, C.TRANS,C.TRANS,C.TRANS],
  [C.TRANS,C.TRANS,C.W_GUARD,C.W_GUARD,C.TRANS,C.TRANS,C.TRANS,C.TRANS],
  [C.TRANS,C.W_LEG, C.W_LEG, C.W_LEG, C.W_LEG, C.W_LEG,C.TRANS,C.TRANS],
  [C.W_LEG, C.W_LEG,C.TRANS, C.TRANS, C.W_LEG, C.W_LEG,C.TRANS,C.TRANS],
  [C.W_BOOT,C.W_LEG,C.TRANS, C.TRANS, C.TRANS, C.W_LEG,C.TRANS,C.TRANS],
  [C.W_BOOT,C.TRANS,C.TRANS, C.TRANS, C.TRANS, C.W_BOOT,C.TRANS,C.TRANS],
  [C.TRANS,C.TRANS,C.TRANS,  C.TRANS, C.TRANS, C.W_BOOT,C.TRANS,C.TRANS],
];

const MAGE_STAND: string[][] = [
  [C.TRANS,C.TRANS,C.M_HAIR,C.M_HAIR,C.M_HAIR,C.M_HAIR,C.TRANS,C.TRANS],
  [C.TRANS,C.M_HAIR,C.M_SKIN,C.M_SKIN,C.M_SKIN,C.M_SKIN,C.M_HAIR,C.TRANS],
  [C.TRANS,C.M_HAIR,C.M_SKIN,C.M_EYE,C.M_SKIN,C.M_EYE,C.M_HAIR,C.TRANS],
  [C.TRANS,C.M_HAIR,C.M_SKIN,C.M_SKIN,C.M_SKIN,C.M_SKIN,C.M_HAIR,C.TRANS],
  [C.TRANS,C.TRANS,C.M_ROBE,C.M_SKIN,C.M_SKIN,C.M_ROBE,C.TRANS,C.TRANS],
  [C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE],
  [C.M_ROBE2,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE2],
  [C.M_STAFF,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.TRANS],
  [C.M_STAFF,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.TRANS,C.TRANS],
  [C.M_GEM, C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.TRANS,C.TRANS,C.TRANS],
  [C.M_STAFF,C.M_ROBE2,C.M_ROBE2,C.M_ROBE2,C.M_ROBE2,C.TRANS,C.TRANS,C.TRANS],
  [C.TRANS,C.TRANS,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.TRANS,C.TRANS,C.TRANS],
  [C.TRANS,C.TRANS,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.TRANS,C.TRANS,C.TRANS],
  [C.TRANS,C.TRANS,C.M_HAIR,C.TRANS,C.M_HAIR,C.TRANS,C.TRANS,C.TRANS],
  [C.TRANS,C.TRANS,C.M_HAIR,C.TRANS,C.M_HAIR,C.TRANS,C.TRANS,C.TRANS],
];

const MAGE_WALK: string[][] = [
  [C.TRANS,C.TRANS,C.M_HAIR,C.M_HAIR,C.M_HAIR,C.M_HAIR,C.TRANS,C.TRANS],
  [C.TRANS,C.M_HAIR,C.M_SKIN,C.M_SKIN,C.M_SKIN,C.M_SKIN,C.M_HAIR,C.TRANS],
  [C.TRANS,C.M_HAIR,C.M_SKIN,C.M_EYE,C.M_SKIN,C.M_EYE,C.M_HAIR,C.TRANS],
  [C.TRANS,C.M_HAIR,C.M_SKIN,C.M_SKIN,C.M_SKIN,C.M_SKIN,C.M_HAIR,C.TRANS],
  [C.TRANS,C.TRANS,C.M_ROBE,C.M_SKIN,C.M_SKIN,C.M_ROBE,C.TRANS,C.TRANS],
  [C.TRANS,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.TRANS],
  [C.M_STAFF,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.TRANS],
  [C.M_STAFF,C.M_ROBE2,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.TRANS,C.TRANS],
  [C.M_GEM, C.M_ROBE2,C.M_ROBE,C.M_ROBE,C.M_ROBE,C.TRANS,C.TRANS,C.TRANS],
  [C.M_STAFF,C.TRANS,C.M_ROBE,C.M_ROBE,C.TRANS,C.TRANS,C.TRANS,C.TRANS],
  [C.TRANS,C.TRANS,C.M_ROBE2,C.M_ROBE2,C.TRANS,C.TRANS,C.TRANS,C.TRANS],
  [C.TRANS,C.M_ROBE,C.M_ROBE,C.TRANS,C.M_ROBE,C.M_ROBE,C.TRANS,C.TRANS],
  [C.M_HAIR,C.M_ROBE,C.TRANS,C.TRANS,C.TRANS,C.M_ROBE,C.M_HAIR,C.TRANS],
  [C.M_HAIR,C.TRANS,C.TRANS,C.TRANS,C.TRANS,C.TRANS,C.M_HAIR,C.TRANS],
  [C.TRANS,C.TRANS,C.TRANS,C.TRANS,C.TRANS,C.TRANS,C.TRANS,C.TRANS],
];

// Small pixel explosion: 4-6 colored pixels flying out
const PixelBurst: React.FC<{ x: number; y: number; frame: number; startFrame: number }> = ({
  x, y, frame, startFrame,
}) => {
  const f = frame - startFrame;
  if (f < 0 || f > 60) return null;
  const opacity = interpolate(f, [0, 8, 50, 60], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const dirs = [
    { dx: -3, dy: -4, col: "#FFD700" },
    { dx: 3, dy: -5, col: "#FF6622" },
    { dx: 5, dy: -2, col: C.M_GEM },
    { dx: -5, dy: -3, col: "#FF4444" },
    { dx: 0, dy: -6, col: C.M_SPARKL },
    { dx: 4, dy: 1, col: "#FFD700" },
  ];
  return (
    <div style={{ position: "absolute", opacity, pointerEvents: "none" }}>
      {dirs.map(({ dx, dy, col }, i) => {
        const speed = 3 + i * 0.4;
        const px = x + dx * f * speed * 0.06;
        const py = y + dy * f * speed * 0.06 + (f * f * 0.02);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: PX,
              height: PX,
              background: col,
            }}
          />
        );
      })}
    </div>
  );
};

export const S09PixelArt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = enter(frame, 0, 20);
  const sceneOpacity = frame >= 280 ? exit(frame, 280, 20) : bgOpacity;

  const SCALE = 4;
  const PS = PX * SCALE; // 32px per "pixel"
  const SPRITE_W = 8 * PS;   // 256px wide
  const SPRITE_H = 15 * PS;  // 480px tall
  const GY = GROUND_Y;

  // Warrior walks from left
  const warriorXbase = interpolate(frame, [15, 85], [80, 640], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const warriorX = frame >= 85 ? 640 : warriorXbase;

  // Mage walks from right
  const mageXbase = interpolate(frame, [28, 92], [W - 80 - SPRITE_W, W - 640 - SPRITE_W], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const mageX = frame >= 92 ? W - 640 - SPRITE_W : mageXbase;

  // Walk frame toggle every 8 frames
  const walkFrame = Math.floor(frame / 8) % 2;
  const warriorWalking = frame < 85;
  const mageWalking = frame < 92;
  const warriorSprite = warriorWalking && walkFrame === 1 ? WARRIOR_WALK : WARRIOR_STAND;
  const mageSprite = mageWalking && walkFrame === 1 ? MAGE_WALK : MAGE_STAND;

  // Attack animation at f140: warrior raises sword (use walk frame as "attack")
  const attacking = frame >= 140 && frame < 200;
  const finalWarriorSprite = attacking && Math.floor((frame - 140) / 6) % 2 === 1
    ? WARRIOR_WALK : warriorSprite;

  // Exclamation pixel above mage at f145
  const exclVisible = frame >= 145 && frame < 200;

  // Pixel burst at f148
  const burstVisible = frame >= 148;

  // Mage casts (swap sprite) at f155
  const casting = frame >= 155 && frame < 210;
  const finalMageSprite = casting && Math.floor((frame - 155) / 8) % 2 === 1
    ? MAGE_WALK : mageSprite;

  // Stars background
  const stars = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const seed = i * 5381;
      const sx = ((seed * 1103515245 + 12345) & 0x7fffffff) % W;
      const sy = ((seed * 1664525 + 1013904223) & 0x7fffffff) % (GROUND_Y - 80);
      return { x: sx, y: sy };
    });
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: sceneOpacity }}>
      {/* Sky background */}
      <div style={{ position: "absolute", inset: 0, background: C.SKY }} />

      {/* Stars */}
      {stars.map((s, i) => {
        const twinkle = 0.5 + Math.sin(frame * 0.06 + i * 0.9) * 0.3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: i % 3 === 0 ? PX : PX / 2,
              height: i % 3 === 0 ? PX : PX / 2,
              background: C.STAR,
              opacity: twinkle,
            }}
          />
        );
      })}

      {/* Moon (pixel moon) */}
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              position: "absolute",
              left: 1740 + c * PX * 2,
              top: 80 + r * PX * 2,
              width: PX * 2,
              height: PX * 2,
              background: r === 0 && c === 0 ? C.SKY : r === 0 && c === 3 ? C.SKY : C.MOON,
            }}
          />
        ))
      )}

      {/* Ground stripes */}
      {Array.from({ length: 2 }).map((_, r) => (
        <div
          key={r}
          style={{
            position: "absolute",
            left: 0,
            top: GY + r * PX * 2,
            width: W,
            height: PX * 2,
            background: r === 0 ? C.GND2 : C.GND,
          }}
        />
      ))}
      <div style={{ position: "absolute", left: 0, top: GY + PX * 4, width: W, height: H - GY - PX * 4, background: C.GND }} />

      {/* Warrior sprite */}
      <PixelGrid
        grid={finalWarriorSprite}
        x={warriorX}
        y={GY - SPRITE_H}
        scale={SCALE}
      />

      {/* Mage sprite (mirrored via CSS scaleX) */}
      <div
        style={{
          position: "absolute",
          left: mageX,
          top: GY - SPRITE_H,
          transform: "scaleX(-1)",
          transformOrigin: `${SPRITE_W / 2}px 0`,
        }}
      >
        <PixelGrid grid={finalMageSprite} x={0} y={0} scale={SCALE} />
      </div>

      {/* Exclamation mark ! (pixel style) */}
      {exclVisible && (
        <div
          style={{
            position: "absolute",
            left: mageX + SPRITE_W / 2 - PX,
            top: GY - SPRITE_H - PX * 8,
            fontSize: PX * 5,
            lineHeight: 1,
            fontFamily: "monospace",
            fontWeight: "bold",
            color: "#FFD700",
            imageRendering: "pixelated",
            opacity: 0.6 + Math.sin(frame * 0.4) * 0.3,
          }}
        >
          !
        </div>
      )}

      {/* Pixel burst at encounter */}
      {burstVisible && (
        <PixelBurst
          x={(warriorX + SPRITE_W + mageX) / 2}
          y={GY - SPRITE_H / 2}
          frame={frame}
          startFrame={148}
        />
      )}

      {/* Labels */}
      <div
        style={{
          position: "absolute",
          left: warriorX + SPRITE_W / 2,
          top: GY + PX * 4 + 4,
          transform: "translateX(-50%)",
          color: "#c8d0e8",
          fontFamily: "monospace",
          fontSize: 20,
          letterSpacing: 2,
          opacity: 0.7,
          imageRendering: "pixelated",
        }}
      >
        GUERRIER
      </div>
      <div
        style={{
          position: "absolute",
          left: mageX + SPRITE_W / 2,
          top: GY + PX * 4 + 4,
          transform: "translateX(-50%)",
          color: C.M_GEM,
          fontFamily: "monospace",
          fontSize: 20,
          letterSpacing: 2,
          opacity: 0.7,
        }}
      >
        SORCIER
      </div>

      <StyleTitle
        frame={frame}
        number="09"
        title="CSS Pixel Art"
        subtitle="Grille div-pixel, sprites 8x15, animations frame par frame"
        textColor="#c8d0e8"
        bgColor="rgba(13,13,46,0.92)"
      />
    </div>
  );
};
