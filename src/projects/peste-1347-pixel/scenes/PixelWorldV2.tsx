import React from "react";
import {
  useCurrentFrame,
  interpolate,
  staticFile,
  Img,
  useVideoConfig,
} from "remotion";
import { loadFont as loadPressStart2P } from "@remotion/google-fonts/PressStart2P";
import { GridSpritesheetAnimator } from "../components/GridSpritesheetAnimator";

const { fontFamily: pressStart } = loadPressStart2P();

// ============================================================
// PIXEL WORLD V2 - Proof of concept with REAL tilesets
//
// 10 seconds @ 30fps = 300 frames
// Built ENTIRELY from existing purchased assets:
//   - Mucho Pixels Medieval Town (tilesets, background parallax)
//   - Elthen Plague Doctor (animated walk)
//   - Elthen Peasants (static NPCs)
//   - Elthen Rats (animated run)
//   - Fire frames (animated)
//
// 9-layer compositing:
//   0: Sky parallax (slowest scroll)
//   1: Distant silhouettes parallax
//   2: Buildings (assembled from tiles)
//   3: Ground tiles
//   4: Props (barrels, cart, market stall)
//   5: NPCs (peasants, idle)
//   6: Main character (plague doctor, walking)
//   7: Rats (running across)
//   8: Fire FX
//   9: HUD + post-process
// ============================================================

const SCALE = 4; // 16px tiles -> 64px display (1920/64 = 30 tiles wide)
const TILE = 16 * SCALE; // 64px per tile

// -- Background parallax extraction --
// background.png is 480x320, 4 rows of 80px each:
//   Row 0 (y=0-79): Blue day - mountains + windmills
//   Row 1 (y=80-159): Orange sunset
//   Row 2 (y=160-239): Dark dusk with orange mountains
//   Row 3 (y=240-319): Night - dark silhouettes + moon
const BG_SRC = "assets/peste-pixel/town/background.png";
const BG_ROW_H = 80; // each row is 80px high
const BG_W = 480;

// -- Building assembly --
// We'll use CSS clip/crop to extract individual pieces from the spritesheets
// and position them as a composed scene

// -- Plague doctor: 480x192, visual inspection shows ~6 frames horizontal
// Let me use what works: 10 cols x 4 rows was wrong, it's 6 cols based on 80px width
const DOCTOR_SRC = "assets/peste-pixel/sprites/plague-doctor/plague-doctor.png";

// ============================================================
// Parallax Sky Layer - tiles horizontally, scrolls slowly
// Uses row 3 (night) from background.png
// ============================================================
const ParallaxSky: React.FC<{ frame: number; row: number; speed: number; opacity?: number; y?: number }> = ({
  frame,
  row,
  speed,
  opacity = 1,
  y = 0,
}) => {
  const scrollX = -(frame * speed) % (BG_W * SCALE);

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: 1920 + BG_W * SCALE,
        height: BG_ROW_H * SCALE,
        overflow: "hidden",
        opacity,
        imageRendering: "pixelated",
      }}
    >
      {/* Tile the row 3 times to cover scroll */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: scrollX + i * BG_W * SCALE,
            top: 0,
            width: BG_W * SCALE,
            height: BG_ROW_H * SCALE,
            backgroundImage: `url(${staticFile(BG_SRC)})`,
            backgroundPosition: `0 ${-(row * BG_ROW_H * SCALE)}px`,
            backgroundSize: `${BG_W * SCALE}px ${320 * SCALE}px`,
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated",
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// Ground layer - tiles the stone ground horizontally
// ground.png: 320x112, tile size 16x16
// We use the top portion (stone/brick platform)
// ============================================================
const GroundLayer: React.FC<{ frame: number }> = ({ frame }) => {
  const scrollX = -(frame * 1.5) % (320 * SCALE);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: 1920 + 320 * SCALE,
        height: 112 * SCALE,
        overflow: "hidden",
        imageRendering: "pixelated",
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <Img
          key={i}
          src={staticFile("assets/peste-pixel/town/ground.png")}
          style={{
            position: "absolute",
            left: scrollX + i * 320 * SCALE,
            bottom: 0,
            width: 320 * SCALE,
            height: 112 * SCALE,
            imageRendering: "pixelated",
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// Building - assembled from rooftop + exterior + door tiles
// Each building is positioned absolutely
// ============================================================
const Building: React.FC<{
  x: number;
  variant: "wood" | "stone";
  frame: number;
  scrollSpeed: number;
}> = ({ x, variant, frame, scrollSpeed }) => {
  const scrollX = x - frame * scrollSpeed;

  // Building exterior: 320x288
  // Left half (0-160px) = wood walls, Right half (160-320) = stone walls
  const extSrc = "assets/peste-pixel/town/building exterior.png";
  const roofSrc = "assets/peste-pixel/town/rooftops.png";
  const doorSrc = "assets/peste-pixel/town/doors and windows.png";

  const wallClipX = variant === "wood" ? 0 : 160;
  const wallW = 160;
  const wallH = 288;

  // Rooftops: 480x416
  // Row 0: large peaked roofs, Row 2-3: A-frame roofs
  // Use A-frame (row 2, starting at y~208): ~160px wide, ~104px tall
  const roofY = variant === "wood" ? 0 : 104;
  const roofW = 160;
  const roofH = 104;

  return (
    <div
      style={{
        position: "absolute",
        left: scrollX,
        bottom: 112 * SCALE - 20,
        zIndex: 8,
        imageRendering: "pixelated",
      }}
    >
      {/* Roof */}
      <div
        style={{
          width: roofW * SCALE,
          height: roofH * SCALE,
          overflow: "hidden",
          backgroundImage: `url(${staticFile(roofSrc)})`,
          backgroundPosition: `0 ${-roofY * SCALE}px`,
          backgroundSize: `${480 * SCALE}px ${416 * SCALE}px`,
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      />
      {/* Wall */}
      <div
        style={{
          width: wallW * SCALE,
          height: (wallH - 100) * SCALE,
          overflow: "hidden",
          backgroundImage: `url(${staticFile(extSrc)})`,
          backgroundPosition: `${-wallClipX * SCALE}px 0`,
          backgroundSize: `${320 * SCALE}px ${wallH * SCALE}px`,
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
          marginTop: -8,
        }}
      />
      {/* Door */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 40 * SCALE,
          width: 48 * SCALE,
          height: 80 * SCALE,
          overflow: "hidden",
          backgroundImage: `url(${staticFile(doorSrc)})`,
          backgroundPosition: `0 ${-140 * SCALE}px`,
          backgroundSize: `${192 * SCALE}px ${223 * SCALE}px`,
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};

// ============================================================
// Prop - barrel, crate, sign, etc.
// ============================================================
const Prop: React.FC<{
  src: string;
  clipX: number;
  clipY: number;
  w: number;
  h: number;
  sheetW: number;
  sheetH: number;
  x: number;
  bottomOffset: number;
  scrollSpeed: number;
  frame: number;
}> = ({ src, clipX, clipY, w, h, sheetW, sheetH, x, bottomOffset, scrollSpeed, frame }) => {
  const scrolledX = x - frame * scrollSpeed;

  return (
    <div
      style={{
        position: "absolute",
        left: scrolledX,
        bottom: 112 * SCALE + bottomOffset,
        width: w * SCALE,
        height: h * SCALE,
        overflow: "hidden",
        backgroundImage: `url(${staticFile(src)})`,
        backgroundPosition: `${-clipX * SCALE}px ${-clipY * SCALE}px`,
        backgroundSize: `${sheetW * SCALE}px ${sheetH * SCALE}px`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        zIndex: 10,
      }}
    />
  );
};

// ============================================================
// Cart (chariot) - full sprite from carriages
// ============================================================
const Cart: React.FC<{ x: number; frame: number; scrollSpeed: number }> = ({
  x,
  frame,
  scrollSpeed,
}) => {
  const scrolledX = x - frame * scrollSpeed;

  return (
    <div
      style={{
        position: "absolute",
        left: scrolledX,
        bottom: 112 * SCALE - 10,
        zIndex: 11,
        imageRendering: "pixelated",
      }}
    >
      <Img
        src={staticFile("assets/peste-pixel/town/carriages and carts.png")}
        style={{
          width: 192 * SCALE * 0.6,
          height: 176 * SCALE * 0.6,
          imageRendering: "pixelated",
          // Show just the covered wagon (top-left portion)
          objectFit: "none",
          objectPosition: `0 0`,
        }}
      />
    </div>
  );
};

// ============================================================
// Animated fire using our existing frames
// ============================================================
const Fire: React.FC<{ x: number; y: number; frame: number; variant?: number; size?: number }> = ({
  x,
  y,
  frame,
  variant = 1,
  size = 3,
}) => {
  const frameRate = 5;
  const spriteIndex = (Math.floor(frame / frameRate) % 8) + 1;
  const basePath = `assets/peste-pixel/fire/red/Group 4 - ${variant}`;
  const framePath = `${basePath}/Group 4 - ${variant}_${spriteIndex}.png`;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: y,
        zIndex: 15,
        imageRendering: "pixelated",
      }}
    >
      <Img
        src={staticFile(framePath)}
        style={{
          width: 32 * size,
          height: 48 * size,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};

// ============================================================
// Walking Plague Doctor - uses existing spritesheet
// 480x192, 6 frames of 80x192 (based on measured width/visible frames)
// Row 0 seems to have idle+walk combined
// ============================================================
const WalkingPlagueDoctor: React.FC<{ frame: number }> = ({ frame }) => {
  // Walk from off-screen left to center
  const x = interpolate(frame, [0, 280], [-200, 600], {
    extrapolateRight: "clamp",
  });
  const bob = Math.sin(frame * 0.35) * 4;

  const opacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sprite: 480px wide / 6 frames = 80px per frame
  const frameW = 80;
  const frameH = 48; // visible character height (top portion of 192px sheet)
  const displayScale = 5;
  const spriteFrame = Math.floor(frame / 6) % 6;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: 112 * SCALE + bob - 20,
        opacity,
        zIndex: 22,
        width: frameW * displayScale,
        height: 192 * displayScale,
        overflow: "hidden",
        imageRendering: "pixelated",
        backgroundImage: `url(${staticFile(DOCTOR_SRC)})`,
        backgroundPosition: `${-spriteFrame * frameW * displayScale}px 0`,
        backgroundSize: `${480 * displayScale}px ${192 * displayScale}px`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

// ============================================================
// Static Peasant NPC
// peasants.png: 512x384
// Individual peasant ~64x48 or similar, arranged in grid
// ============================================================
const PeasantNPC: React.FC<{
  x: number;
  row: number;
  col: number;
  frame: number;
  scrollSpeed: number;
  flipX?: boolean;
}> = ({ x, row, col, frame, scrollSpeed, flipX = false }) => {
  const scrolledX = x - frame * scrollSpeed;
  const bob = Math.sin((frame + col * 50) * 0.1) * 2;

  const frameW = 64;
  const frameH = 48;
  const displayScale = 4;

  return (
    <div
      style={{
        position: "absolute",
        left: scrolledX,
        bottom: 112 * SCALE + bob - 15,
        zIndex: 18,
        width: frameW * displayScale,
        height: frameH * displayScale,
        overflow: "hidden",
        imageRendering: "pixelated",
        transform: flipX ? "scaleX(-1)" : undefined,
        backgroundImage: `url(${staticFile("assets/peste-pixel/sprites/peasants/peasants.png")})`,
        backgroundPosition: `${-col * frameW * displayScale}px ${-row * frameH * displayScale}px`,
        backgroundSize: `${512 * displayScale}px ${384 * displayScale}px`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

// ============================================================
// Running rats using GridSpritesheetAnimator
// ============================================================
const RunningRats: React.FC<{ frame: number }> = ({ frame }) => {
  const rats = [
    { startX: -100, y: 112 * SCALE - 30, speed: 4.0, delay: 20 },
    { startX: -160, y: 112 * SCALE - 15, speed: 3.5, delay: 35 },
    { startX: -80, y: 112 * SCALE - 45, speed: 4.5, delay: 50 },
    { startX: -200, y: 112 * SCALE - 25, speed: 3.2, delay: 70 },
    { startX: -130, y: 112 * SCALE - 10, speed: 3.8, delay: 100 },
  ];

  return (
    <>
      {rats.map((rat, i) => {
        const elapsed = Math.max(0, frame - rat.delay);
        if (elapsed <= 0) return null;
        const rx = rat.startX + elapsed * rat.speed;
        if (rx > 2000) return null;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: rx,
              bottom: rat.y,
              zIndex: 14,
            }}
          >
            <GridSpritesheetAnimator
              src="assets/peste-pixel/sprites/rats/rats.png"
              cols={5}
              rows={8}
              frameWidth={32}
              frameHeight={32}
              displayWidth={32 * 3}
              displayHeight={32 * 3}
              startRow={0}
              frameCount={5}
              frameRate={3}
              loop
            />
          </div>
        );
      })}
    </>
  );
};

// ============================================================
// Minimal HUD
// ============================================================
const MinimalHUD: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "10px 24px",
        opacity,
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", gap: 5 }}>
        {[true, true, true, false].map((full, i) => (
          <span
            key={i}
            style={{
              fontFamily: pressStart,
              fontSize: 18,
              color: full ? "#E63946" : "#444",
              textShadow: full ? "0 0 6px rgba(230,57,70,0.5)" : "none",
            }}
          >
            {full ? "\u2665" : "\u2661"}
          </span>
        ))}
      </div>
      <span
        style={{
          fontFamily: pressStart,
          fontSize: 11,
          color: "#D4A017",
          textShadow: "1px 1px 0 #000",
        }}
      >
        PESTE NOIRE - 1347
      </span>
      <span
        style={{
          fontFamily: pressStart,
          fontSize: 13,
          color: "#ccc",
          textShadow: "1px 1px 0 #000",
        }}
      >
        {"\u2620"} x{Math.floor(interpolate(frame, [0, 300], [25000000, 25000047], { extrapolateRight: "clamp" }))}
      </span>
    </div>
  );
};

// ============================================================
// Night fog/atmosphere overlay
// ============================================================
const NightFog: React.FC<{ frame: number }> = ({ frame }) => {
  const drift = Math.sin(frame * 0.02) * 50;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        pointerEvents: "none",
        background: `radial-gradient(ellipse at ${50 + drift * 0.1}% 70%, rgba(80, 90, 40, 0.12) 0%, transparent 60%)`,
      }}
    />
  );
};

// ============================================================
// MAIN COMPOSITION
// ============================================================
export const PixelWorldV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Global scroll speed for the "camera pan"
  const SCROLL = 1.5;

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0B0B15",
      }}
    >
      {/* LAYER 0: Sky - night (row 3), slowest parallax */}
      <ParallaxSky frame={frame} row={3} speed={0.3} y={0} />

      {/* LAYER 1: Distant mountains/silhouettes (row 2, dusk) - medium parallax */}
      <ParallaxSky frame={frame} row={2} speed={0.6} y={80} opacity={0.7} />

      {/* LAYER 2: Buildings */}
      <Building x={100} variant="wood" frame={frame} scrollSpeed={SCROLL} />
      <Building x={800} variant="stone" frame={frame} scrollSpeed={SCROLL} />
      <Building x={1400} variant="wood" frame={frame} scrollSpeed={SCROLL} />
      <Building x={2000} variant="stone" frame={frame} scrollSpeed={SCROLL} />

      {/* LAYER 3: Ground tiles */}
      <GroundLayer frame={frame} />

      {/* LAYER 4: Props */}
      {/* Barrel clusters */}
      <Prop
        src="assets/peste-pixel/town/signs barrels and crates.png"
        clipX={0} clipY={160} w={48} h={48}
        sheetW={96} sheetH={416}
        x={500} bottomOffset={-15}
        scrollSpeed={SCROLL} frame={frame}
      />
      <Prop
        src="assets/peste-pixel/town/signs barrels and crates.png"
        clipX={0} clipY={210} w={48} h={40}
        sheetW={96} sheetH={416}
        x={520} bottomOffset={-15}
        scrollSpeed={SCROLL} frame={frame}
      />
      {/* Market stall */}
      <Prop
        src="assets/peste-pixel/town/marketplace.png"
        clipX={128} clipY={0} w={128} h={127}
        sheetW={256} sheetH={127}
        x={1100} bottomOffset={-10}
        scrollSpeed={SCROLL} frame={frame}
      />

      {/* Cart (plague cart) */}
      <div
        style={{
          position: "absolute",
          left: 1700 - frame * SCROLL,
          bottom: 112 * SCALE - 10,
          zIndex: 11,
          imageRendering: "pixelated",
        }}
      >
        <div
          style={{
            width: 100 * SCALE,
            height: 60 * SCALE,
            overflow: "hidden",
            backgroundImage: `url(${staticFile("assets/peste-pixel/town/carriages and carts.png")})`,
            backgroundPosition: "0 0",
            backgroundSize: `${192 * SCALE}px ${176 * SCALE}px`,
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated",
          }}
        />
      </div>

      {/* LAYER 5: Peasant NPCs (static but bobbing) */}
      <PeasantNPC x={650} row={0} col={0} frame={frame} scrollSpeed={SCROLL} />
      <PeasantNPC x={950} row={1} col={1} frame={frame} scrollSpeed={SCROLL} flipX />
      <PeasantNPC x={1250} row={2} col={0} frame={frame} scrollSpeed={SCROLL} />
      <PeasantNPC x={1600} row={0} col={2} frame={frame} scrollSpeed={SCROLL} flipX />

      {/* LAYER 6: Plague Doctor - walks independently of scroll */}
      <WalkingPlagueDoctor frame={frame} />

      {/* LAYER 7: Rats */}
      <RunningRats frame={frame} />

      {/* LAYER 8: Fire FX */}
      <Fire x={780 - frame * SCROLL} y={112 * SCALE + 60} frame={frame} variant={1} size={4} />
      <Fire x={1420 - frame * SCROLL} y={112 * SCALE + 80} frame={frame} variant={2} size={3} />
      <Fire x={2050 - frame * SCROLL} y={112 * SCALE + 50} frame={frame} variant={3} size={5} />

      {/* LAYER 9: Atmosphere */}
      <NightFog frame={frame} />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 55,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Subtle scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 60,
          pointerEvents: "none",
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 4px)",
          mixBlendMode: "multiply",
        }}
      />

      {/* HUD */}
      <MinimalHUD frame={frame} />
    </div>
  );
};
