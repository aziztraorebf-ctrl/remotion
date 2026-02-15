import React, { useMemo } from "react";
import {
  useCurrentFrame,
  interpolate,
  staticFile,
  Img,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont as loadPressStart2P } from "@remotion/google-fonts/PressStart2P";
import { GridSpritesheetAnimator } from "../components/GridSpritesheetAnimator";

const { fontFamily: pressStart } = loadPressStart2P();

// ============================================================
// PIXEL WORLD V4 - Camera Motion + Data Overlays + Narrative HUD
//
// 10 seconds @ 30fps = 300 frames
// Builds on V3 with 4 major additions:
//   1. Camera motion (zoom, variable scroll speed, pauses)
//   2. Data overlays (propagation chart, stat panels)
//   3. Narrative HUD (evolving, not static)
//   4. Reduced night filter (see actual decor colors)
//
// Camera timeline (300 frames / 10 seconds):
//   f0-60    : Slow pan right, gentle zoom-in (establishing shot)
//   f60-120  : Camera slows, zooms on buildings (focus moment)
//   f120-180 : Resume pan, data overlay slides in from right
//   f180-240 : Steady pan, HUD evolves (hearts drain, counter spikes)
//   f240-300 : Slow zoom-out to wide shot, final stat card
// ============================================================

const SCALE = 4;
const TILE = 16 * SCALE;

const TILES = {
  skyNight: "assets/peste-pixel/town/extracted/parallax-sky-night.png",
  skyDusk: "assets/peste-pixel/town/extracted/parallax-sky-dusk.png",
  ground: "assets/peste-pixel/town/extracted/ground-surface.png",
  wallWood: "assets/peste-pixel/town/extracted/wall-wood.png",
  wallStone: "assets/peste-pixel/town/extracted/wall-stone.png",
  roofWoodLarge: "assets/peste-pixel/town/extracted/roof-wood-large.png",
  roofPlaster: "assets/peste-pixel/town/extracted/roof-plaster.png",
  roofStoneLarge: "assets/peste-pixel/town/extracted/roof-stone.png",
  roofAframeWood: "assets/peste-pixel/town/extracted/roof-aframe-wood.png",
  roofAframePlaster: "assets/peste-pixel/town/extracted/roof-aframe-plaster.png",
  roofWoodDark: "assets/peste-pixel/town/extracted/roof-wood-dark.png",
  chimney: "assets/peste-pixel/town/extracted/chimney.png",
  doorWood: "assets/peste-pixel/town/extracted/door-wood.png",
  doorDark: "assets/peste-pixel/town/extracted/door-dark.png",
  doorStone: "assets/peste-pixel/town/extracted/door-stone.png",
  windowGrid: "assets/peste-pixel/town/extracted/window-grid.png",
  windowCrate: "assets/peste-pixel/town/extracted/window-crate.png",
  barrel1: "assets/peste-pixel/town/extracted/barrel-1.png",
  barrel2: "assets/peste-pixel/town/extracted/barrel-2.png",
  crate1: "assets/peste-pixel/town/extracted/crate-1.png",
  crate2: "assets/peste-pixel/town/extracted/crate-2.png",
  signPost: "assets/peste-pixel/town/extracted/sign-post.png",
  wagonCovered: "assets/peste-pixel/town/extracted/wagon-covered.png",
  cartOpen: "assets/peste-pixel/town/extracted/cart-open.png",
  marketStall: "assets/peste-pixel/town/extracted/market-stall.png",
  marketShelf: "assets/peste-pixel/town/extracted/market-shelf.png",
  towerWindow: "assets/peste-pixel/town/extracted/tower-window.png",
} as const;

const TILE_SIZES = {
  skyNight: { w: 480, h: 48 },
  skyDusk: { w: 480, h: 48 },
  ground: { w: 320, h: 32 },
  wallWood: { w: 160, h: 240 },
  wallStone: { w: 160, h: 240 },
  roofLarge: { w: 160, h: 104 },
  roofAframe: { w: 120, h: 104 },
  chimney: { w: 40, h: 104 },
  door: { w: 48, h: 48 },
  window: { w: 48, h: 48 },
  barrel: { w: 48, h: 48 },
  crate: { w: 48, h: 48 },
  signPost: { w: 48, h: 48 },
  wagonCovered: { w: 112, h: 80 },
  cartOpen: { w: 96, h: 48 },
  marketStall: { w: 128, h: 96 },
  marketShelf: { w: 96, h: 80 },
  towerWindow: { w: 80, h: 112 },
} as const;

const GROUND_H = TILE_SIZES.ground.h * SCALE; // 128px

// ============================================================
// CAMERA SYSTEM - variable speed, zoom, and offset
// ============================================================
function useCamera(frame: number, fps: number) {
  // --- Scroll speed: fast -> slow -> fast -> slow ---
  // Integrated scroll position (not just speed) to avoid jitter
  const scrollPos = interpolate(
    frame,
    [0, 60, 90, 120, 180, 240, 300],
    [0, 60, 72, 100, 250, 380, 430],
    { extrapolateRight: "clamp" }
  );

  // --- Zoom: 1.0 -> 1.12 (focus) -> 1.0 (wide) ---
  const zoom = interpolate(
    frame,
    [0, 60, 100, 120, 240, 300],
    [1.0, 1.0, 1.12, 1.12, 1.0, 0.98],
    { extrapolateRight: "clamp" }
  );

  // --- Vertical offset: slight tilt down during zoom, then back ---
  const offsetY = interpolate(
    frame,
    [0, 60, 100, 120, 240, 300],
    [0, 0, -30, -30, 0, 10],
    { extrapolateRight: "clamp" }
  );

  return { scrollPos, zoom, offsetY };
}

// ============================================================
// Parallax Sky
// ============================================================
const ParallaxLayer: React.FC<{
  src: string;
  srcW: number;
  srcH: number;
  speed: number;
  y: number;
  opacity?: number;
  scrollPos: number;
}> = ({ src, srcW, srcH, speed, y, opacity = 1, scrollPos }) => {
  const displayW = srcW * SCALE;
  const displayH = srcH * SCALE;
  const scrollX = -(scrollPos * speed) % displayW;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: "100%",
        height: displayH,
        overflow: "hidden",
        opacity,
      }}
    >
      {[0, 1, 2].map((i) => (
        <Img
          key={i}
          src={staticFile(src)}
          style={{
            position: "absolute",
            left: scrollX + i * displayW,
            top: 0,
            width: displayW,
            height: displayH,
            imageRendering: "pixelated",
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// Ground
// ============================================================
const Ground: React.FC<{ scrollPos: number }> = ({ scrollPos }) => {
  const displayW = TILE_SIZES.ground.w * SCALE;
  const scrollX = -(scrollPos * 1.5) % displayW;
  const tilesNeeded = Math.ceil(1920 / displayW) + 2;

  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: GROUND_H + 20,
          backgroundColor: "#1A1520",
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: GROUND_H,
          overflow: "hidden",
          zIndex: 5,
        }}
      >
        {Array.from({ length: tilesNeeded }, (_, i) => (
          <Img
            key={i}
            src={staticFile(TILES.ground)}
            style={{
              position: "absolute",
              left: scrollX + i * displayW,
              bottom: 0,
              width: displayW,
              height: GROUND_H,
              imageRendering: "pixelated",
            }}
          />
        ))}
      </div>
    </>
  );
};

// ============================================================
// Building (same as V3)
// ============================================================
interface BuildingConfig {
  wall: "wood" | "stone";
  roof: "wood-large" | "plaster" | "stone" | "aframe-wood" | "aframe-plaster" | "wood-dark";
  door: "wood" | "dark" | "stone";
  windows: number;
  chimney?: boolean;
}

const BUILDING_PRESETS: BuildingConfig[] = [
  { wall: "wood", roof: "wood-large", door: "wood", windows: 2, chimney: true },
  { wall: "stone", roof: "stone", door: "stone", windows: 1 },
  { wall: "wood", roof: "plaster", door: "dark", windows: 2 },
  { wall: "stone", roof: "wood-dark", door: "stone", windows: 1, chimney: true },
  { wall: "wood", roof: "aframe-wood", door: "wood", windows: 0 },
];

const Building: React.FC<{
  x: number;
  preset: number;
  scrollPos: number;
}> = ({ x, preset, scrollPos }) => {
  const config = BUILDING_PRESETS[preset % BUILDING_PRESETS.length];
  const scrolledX = x - scrollPos * 1.5;

  const wallSrc = config.wall === "wood" ? TILES.wallWood : TILES.wallStone;
  const wallW = TILE_SIZES.wallWood.w * SCALE;
  const wallH = TILE_SIZES.wallWood.h * SCALE;

  const isAframe = config.roof.startsWith("aframe");
  const roofW = isAframe ? TILE_SIZES.roofAframe.w * SCALE : TILE_SIZES.roofLarge.w * SCALE;
  const roofH = isAframe ? TILE_SIZES.roofAframe.h * SCALE : TILE_SIZES.roofLarge.h * SCALE;

  const roofSrcMap: Record<string, string> = {
    "wood-large": TILES.roofWoodLarge,
    "plaster": TILES.roofPlaster,
    "stone": TILES.roofStoneLarge,
    "aframe-wood": TILES.roofAframeWood,
    "aframe-plaster": TILES.roofAframePlaster,
    "wood-dark": TILES.roofWoodDark,
  };
  const roofSrc = roofSrcMap[config.roof];

  const doorSrcMap: Record<string, string> = {
    wood: TILES.doorWood,
    dark: TILES.doorDark,
    stone: TILES.doorStone,
  };
  const doorSrc = doorSrcMap[config.door];
  const doorW = TILE_SIZES.door.w * SCALE;
  const doorH = TILE_SIZES.door.h * SCALE;

  const windowSrc = config.windows > 0 ? TILES.windowGrid : null;
  const windowW = TILE_SIZES.window.w * SCALE;
  const windowH = TILE_SIZES.window.h * SCALE;

  const visibleWallH = wallH * 0.50;
  const totalH = roofH + visibleWallH;

  return (
    <div
      style={{
        position: "absolute",
        left: scrolledX,
        bottom: GROUND_H - 16,
        width: wallW,
        height: totalH,
        zIndex: 8,
      }}
    >
      {/* Roof */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: (wallW - roofW) / 2,
          width: roofW,
          height: roofH,
        }}
      >
        <Img
          src={staticFile(roofSrc)}
          style={{ width: roofW, height: roofH, imageRendering: "pixelated" }}
        />
      </div>

      {/* Chimney */}
      {config.chimney && (
        <div
          style={{
            position: "absolute",
            top: -TILE_SIZES.chimney.h * SCALE * 0.3,
            right: wallW * 0.15,
            width: TILE_SIZES.chimney.w * SCALE,
            height: TILE_SIZES.chimney.h * SCALE,
          }}
        >
          <Img
            src={staticFile(TILES.chimney)}
            style={{
              width: TILE_SIZES.chimney.w * SCALE,
              height: TILE_SIZES.chimney.h * SCALE,
              imageRendering: "pixelated",
            }}
          />
        </div>
      )}

      {/* Wall */}
      <div
        style={{
          position: "absolute",
          top: roofH - 24,
          left: 0,
          width: wallW,
          height: visibleWallH,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(wallSrc)}
          style={{ width: wallW, height: wallH, imageRendering: "pixelated" }}
        />
      </div>

      {/* Door */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: (wallW - doorW) / 2,
          width: doorW,
          height: doorH,
        }}
      >
        <Img
          src={staticFile(doorSrc)}
          style={{ width: doorW, height: doorH, imageRendering: "pixelated" }}
        />
      </div>

      {/* Windows */}
      {windowSrc &&
        Array.from({ length: config.windows }, (_, i) => {
          const spacing = wallW / (config.windows + 1);
          const wx = spacing * (i + 1) - windowW / 2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: roofH + visibleWallH * 0.2,
                left: wx,
                width: windowW,
                height: windowH,
              }}
            >
              <Img
                src={staticFile(windowSrc)}
                style={{ width: windowW, height: windowH, imageRendering: "pixelated" }}
              />
            </div>
          );
        })}
    </div>
  );
};

// ============================================================
// Props
// ============================================================
const Prop: React.FC<{
  src: string;
  w: number;
  h: number;
  x: number;
  bottomOffset?: number;
  scrollPos: number;
  zIndex?: number;
}> = ({ src, w, h, x, bottomOffset = 0, scrollPos, zIndex = 10 }) => {
  const displayW = w * SCALE;
  const displayH = h * SCALE;
  const scrolledX = x - scrollPos * 1.5;

  return (
    <div
      style={{
        position: "absolute",
        left: scrolledX,
        bottom: GROUND_H + bottomOffset,
        width: displayW,
        height: displayH,
        zIndex,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{ width: displayW, height: displayH, imageRendering: "pixelated" }}
      />
    </div>
  );
};

// ============================================================
// Peasant NPC
// ============================================================
const PeasantNPC: React.FC<{
  x: number;
  row: number;
  col: number;
  frame: number;
  scrollPos: number;
  flipX?: boolean;
  displayScale?: number;
}> = ({ x, row, col, frame, scrollPos, flipX = false, displayScale = 4 }) => {
  const scrolledX = x - scrollPos * 1.5;
  const bob = Math.sin((frame + col * 50 + row * 30) * 0.08) * 3;
  const frameW = 64;
  const frameH = 48;

  return (
    <div
      style={{
        position: "absolute",
        left: scrolledX,
        bottom: GROUND_H + bob - 8,
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
// Running Rats
// ============================================================
const RunningRats: React.FC<{ frame: number; scrollPos: number }> = ({
  frame,
  scrollPos,
}) => {
  const rats = useMemo(
    () => [
      { startX: -100, yOff: -20, speed: 4.2, delay: 15 },
      { startX: -180, yOff: -5, speed: 3.6, delay: 40 },
      { startX: -60, yOff: -35, speed: 4.8, delay: 60 },
      { startX: -220, yOff: -15, speed: 3.3, delay: 85 },
      { startX: -140, yOff: -8, speed: 3.9, delay: 110 },
      { startX: -300, yOff: -28, speed: 4.4, delay: 140 },
    ],
    []
  );

  return (
    <>
      {rats.map((rat, i) => {
        const elapsed = Math.max(0, frame - rat.delay);
        if (elapsed <= 0) return null;
        const rx = rat.startX + elapsed * rat.speed;
        if (rx > 2100) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: rx,
              bottom: GROUND_H + rat.yOff,
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
// Fire FX
// ============================================================
const FireFX: React.FC<{
  x: number;
  bottomOffset: number;
  frame: number;
  scrollPos: number;
  variant?: number;
  size?: number;
}> = ({ x, bottomOffset, frame, scrollPos, variant = 1, size = 3 }) => {
  const scrolledX = x - scrollPos * 1.5;
  const spriteIndex = (Math.floor(frame / 5) % 8) + 1;
  const path = `assets/peste-pixel/fire/red/Group 4 - ${variant}/Group 4 - ${variant}_${spriteIndex}.png`;

  return (
    <div
      style={{
        position: "absolute",
        left: scrolledX,
        bottom: GROUND_H + bottomOffset,
        zIndex: 15,
      }}
    >
      <Img
        src={staticFile(path)}
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
// DATA OVERLAY: Propagation chart (slide-in from right)
// Shows death toll progression across Europe 1347-1351
// ============================================================
const PropagationChart: React.FC<{ frame: number }> = ({ frame }) => {
  // Visible from f120 to f260
  const slideIn = interpolate(frame, [120, 145], [400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideOut = interpolate(frame, [250, 270], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const xOffset = slideIn + slideOut;

  const opacity = interpolate(frame, [120, 140, 255, 270], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < 118 || frame > 275) return null;

  // Data points: year -> millions dead (cumulative)
  const dataPoints = [
    { year: 1347, deaths: 0, label: "1347" },
    { year: 1348, deaths: 8, label: "1348" },
    { year: 1349, deaths: 17, label: "1349" },
    { year: 1350, deaths: 22, label: "1350" },
    { year: 1351, deaths: 25, label: "1351" },
  ];

  // Animate fill based on frame
  const chartProgress = interpolate(frame, [140, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chartW = 320;
  const chartH = 160;
  const padL = 40;
  const padR = 10;
  const padT = 10;
  const padB = 24;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  return (
    <div
      style={{
        position: "absolute",
        right: 32,
        bottom: 180,
        width: chartW,
        zIndex: 45,
        opacity,
        transform: `translateX(${xOffset}px)`,
      }}
    >
      {/* Panel background */}
      <div
        style={{
          backgroundColor: "rgba(10, 8, 20, 0.88)",
          border: "2px solid #D4A017",
          padding: 0,
          imageRendering: "pixelated",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            backgroundColor: "rgba(212, 160, 23, 0.15)",
            borderBottom: "1px solid #D4A017",
            padding: "6px 10px",
            fontFamily: pressStart,
            fontSize: 7,
            color: "#D4A017",
            letterSpacing: 1,
          }}
        >
          PROPAGATION DE LA PESTE
        </div>

        {/* Chart area */}
        <div style={{ padding: "8px 10px" }}>
          <svg width={chartW - 20} height={chartH} viewBox={`0 0 ${chartW} ${chartH}`}>
            {/* Grid lines */}
            {[0, 5, 10, 15, 20, 25].map((v) => {
              const y = padT + plotH - (v / 25) * plotH;
              return (
                <line
                  key={v}
                  x1={padL}
                  y1={y}
                  x2={padL + plotW}
                  y2={y}
                  stroke="rgba(212,160,23,0.15)"
                  strokeWidth={1}
                />
              );
            })}

            {/* Y-axis labels */}
            {[0, 10, 25].map((v) => {
              const y = padT + plotH - (v / 25) * plotH;
              return (
                <text
                  key={v}
                  x={padL - 4}
                  y={y + 3}
                  textAnchor="end"
                  fill="#888"
                  fontSize={7}
                  fontFamily={pressStart}
                >
                  {v}M
                </text>
              );
            })}

            {/* Animated line + fill */}
            {(() => {
              const visibleCount = Math.min(
                dataPoints.length,
                Math.floor(chartProgress * dataPoints.length) + 1
              );
              const pts = dataPoints.slice(0, visibleCount).map((dp, idx) => {
                const px = padL + (idx / (dataPoints.length - 1)) * plotW;
                const py = padT + plotH - (dp.deaths / 25) * plotH;
                return { x: px, y: py, label: dp.label, deaths: dp.deaths };
              });

              if (pts.length < 2) return null;

              const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
              const fillPath =
                linePath +
                ` L${pts[pts.length - 1].x},${padT + plotH} L${pts[0].x},${padT + plotH} Z`;

              return (
                <>
                  <path d={fillPath} fill="rgba(230,57,70,0.2)" />
                  <path d={linePath} fill="none" stroke="#E63946" strokeWidth={2} />
                  {pts.map((p, i) => (
                    <React.Fragment key={i}>
                      <circle cx={p.x} cy={p.y} r={3} fill="#E63946" />
                      <text
                        x={p.x}
                        y={padT + plotH + 14}
                        textAnchor="middle"
                        fill="#888"
                        fontSize={6}
                        fontFamily={pressStart}
                      >
                        {p.label}
                      </text>
                    </React.Fragment>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>

        {/* Footer stat */}
        <div
          style={{
            borderTop: "1px solid rgba(212,160,23,0.3)",
            padding: "5px 10px",
            fontFamily: pressStart,
            fontSize: 6,
            color: "#888",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>EUROPE</span>
          <span style={{ color: "#E63946" }}>
            ~25M MORTS EN 4 ANS
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// DATA OVERLAY: Population stat card (appears at end)
// ============================================================
const PopulationCard: React.FC<{ frame: number }> = ({ frame }) => {
  // Visible f240-300
  const opacity = interpolate(frame, [240, 258, 290, 300], [0, 1, 1, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slideUp = interpolate(frame, [240, 260], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < 238) return null;

  const percentage = Math.floor(
    interpolate(frame, [258, 290], [0, 60], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 140,
        transform: `translateX(-50%) translateY(${slideUp}px)`,
        zIndex: 45,
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(10, 8, 20, 0.92)",
          border: "2px solid #E63946",
          padding: "14px 28px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: pressStart,
            fontSize: 8,
            color: "#888",
            marginBottom: 8,
            letterSpacing: 1,
          }}
        >
          POPULATION EUROPEENNE
        </div>

        {/* Percentage bar */}
        <div
          style={{
            width: 260,
            height: 18,
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(230,57,70,0.4)",
            position: "relative",
            marginBottom: 8,
          }}
        >
          {/* "Before" portion */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "100%",
              backgroundColor: "rgba(212,160,23,0.25)",
            }}
          />
          {/* "Dead" portion - fills from left */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${percentage}%`,
              backgroundColor: "rgba(230,57,70,0.7)",
              transition: "width 0.1s linear",
            }}
          />
          {/* Label inside bar */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: pressStart,
              fontSize: 7,
              color: "#fff",
              textShadow: "1px 1px 0 #000",
            }}
          >
            {percentage > 5 && `${percentage}% DECIMEE`}
          </div>
        </div>

        <div
          style={{
            fontFamily: pressStart,
            fontSize: 20,
            color: "#E63946",
            textShadow: "0 0 12px rgba(230,57,70,0.4)",
          }}
        >
          -{percentage}%
        </div>
        <div
          style={{
            fontFamily: pressStart,
            fontSize: 6,
            color: "#666",
            marginTop: 4,
          }}
        >
          1347 - 1351
        </div>
      </div>
    </div>
  );
};

// ============================================================
// NARRATIVE HUD - Evolves over time (not static)
//
// Timeline:
//   f0-60   : Title + full hearts (calm)
//   f60-120 : Heart drains to 3 -> 2 (tension rises)
//   f120-180: Counter accelerates, alert text appears
//   f180-240: Hearts at 1, warning pulse, "CRITICAL" label
//   f240-300: Hearts at 0, game-over style flicker
// ============================================================
const NarrativeHUD: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Hearts: 4 -> 3 at f70, -> 2 at f130, -> 1 at f190, -> 0 at f260
  const heartsAlive =
    frame < 70 ? 4 : frame < 130 ? 3 : frame < 190 ? 2 : frame < 260 ? 1 : 0;

  // Death counter - accelerates over time
  const deathCount = Math.floor(
    interpolate(
      frame,
      [0, 60, 120, 180, 240, 300],
      [0, 800000, 4000000, 12000000, 20000000, 25000000],
      { extrapolateRight: "clamp" }
    )
  );
  const formatted = deathCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Status text evolves
  const statusText =
    frame < 70
      ? "EXPLORATION"
      : frame < 130
        ? "CONTAMINATION"
        : frame < 190
          ? "PROPAGATION"
          : frame < 260
            ? "EFFONDREMENT"
            : "DEVASTATION";

  const statusColor =
    frame < 70
      ? "#4A9"
      : frame < 130
        ? "#D4A017"
        : frame < 190
          ? "#E68A00"
          : "#E63946";

  // Warning pulse for critical state
  const showWarning = frame >= 180;
  const warningPulse = showWarning
    ? 0.5 + Math.sin(frame * 0.2) * 0.5
    : 0;

  // Counter flash when accelerating
  const counterColor = frame < 120 ? "#ccc" : frame < 240 ? "#E68A00" : "#E63946";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        opacity,
        zIndex: 50,
      }}
    >
      {/* Left: Hearts + Status */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                fontFamily: pressStart,
                fontSize: 14,
                color: i < heartsAlive ? "#E63946" : "#333",
                textShadow:
                  i < heartsAlive
                    ? "0 0 8px rgba(230,57,70,0.4)"
                    : "none",
                opacity: i === heartsAlive && frame % 10 < 5 ? 0.5 : 1,
              }}
            >
              {i < heartsAlive ? "\u2665" : "\u2661"}
            </span>
          ))}
        </div>
        <span
          style={{
            fontFamily: pressStart,
            fontSize: 7,
            color: statusColor,
            letterSpacing: 1,
            textShadow: "1px 1px 0 #000",
          }}
        >
          {statusText}
        </span>
      </div>

      {/* Center: Title */}
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontFamily: pressStart,
            fontSize: 10,
            color: "#D4A017",
            textShadow: "1px 1px 0 #000, -1px -1px 0 #000",
            letterSpacing: 1,
          }}
        >
          PESTE NOIRE - 1347
        </span>
        {/* Warning line */}
        {showWarning && (
          <div
            style={{
              fontFamily: pressStart,
              fontSize: 6,
              color: "#E63946",
              marginTop: 2,
              opacity: warningPulse,
              letterSpacing: 2,
            }}
          >
            !!! ALERTE CRITIQUE !!!
          </div>
        )}
      </div>

      {/* Right: Death counter */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
        <span
          style={{
            fontFamily: pressStart,
            fontSize: 7,
            color: "#888",
            textShadow: "1px 1px 0 #000",
          }}
        >
          MORTS
        </span>
        <span
          style={{
            fontFamily: pressStart,
            fontSize: 12,
            color: counterColor,
            textShadow: `1px 1px 0 #000${frame >= 240 ? ", 0 0 8px rgba(230,57,70,0.5)" : ""}`,
          }}
        >
          {formatted}
        </span>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPOSITION
// ============================================================
export const PixelWorldV4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { scrollPos, zoom, offsetY } = useCamera(frame, fps);

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#060610",
      }}
    >
      {/* Camera wrapper - applies zoom and vertical offset */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoom}) translateY(${offsetY}px)`,
          transformOrigin: "center 65%",
        }}
      >
        {/* === LAYER 0: Night sky === */}
        <ParallaxLayer
          src={TILES.skyNight}
          srcW={TILE_SIZES.skyNight.w}
          srcH={TILE_SIZES.skyNight.h}
          speed={0.2}
          y={0}
          scrollPos={scrollPos}
        />

        {/* === LAYER 1: Dusk mountains === */}
        <ParallaxLayer
          src={TILES.skyDusk}
          srcW={TILE_SIZES.skyDusk.w}
          srcH={TILE_SIZES.skyDusk.h}
          speed={0.5}
          y={TILE_SIZES.skyNight.h * SCALE - 20}
          opacity={0.35}
          scrollPos={scrollPos}
        />

        {/* Dark backdrop for building zone */}
        <div
          style={{
            position: "absolute",
            top: TILE_SIZES.skyNight.h * SCALE,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(180deg, #060610 0%, #0A0A18 30%, #0E0B14 100%)",
            zIndex: 1,
          }}
        />

        {/* === LAYER 2: Buildings === */}
        <Building x={50} preset={0} scrollPos={scrollPos} />
        <Building x={680} preset={1} scrollPos={scrollPos} />
        <Building x={1250} preset={2} scrollPos={scrollPos} />
        <Building x={1800} preset={3} scrollPos={scrollPos} />
        <Building x={2350} preset={4} scrollPos={scrollPos} />
        <Building x={2800} preset={0} scrollPos={scrollPos} />

        {/* === LAYER 3: Ground === */}
        <Ground scrollPos={scrollPos} />

        {/* === LAYER 4: Props === */}
        <Prop src={TILES.barrel1} w={TILE_SIZES.barrel.w} h={TILE_SIZES.barrel.h} x={560} bottomOffset={-8} scrollPos={scrollPos} />
        <Prop src={TILES.crate1} w={TILE_SIZES.crate.w} h={TILE_SIZES.crate.h} x={610} bottomOffset={-8} scrollPos={scrollPos} />
        <Prop src={TILES.signPost} w={TILE_SIZES.signPost.w} h={TILE_SIZES.signPost.h} x={1120} bottomOffset={-4} scrollPos={scrollPos} />
        <Prop src={TILES.barrel2} w={TILE_SIZES.barrel.w} h={TILE_SIZES.barrel.h} x={1170} bottomOffset={-8} scrollPos={scrollPos} />
        <Prop src={TILES.wagonCovered} w={TILE_SIZES.wagonCovered.w} h={TILE_SIZES.wagonCovered.h} x={1650} bottomOffset={-4} scrollPos={scrollPos} zIndex={12} />
        <Prop src={TILES.barrel1} w={TILE_SIZES.barrel.w} h={TILE_SIZES.barrel.h} x={2250} bottomOffset={-8} scrollPos={scrollPos} />
        <Prop src={TILES.crate2} w={TILE_SIZES.crate.w} h={TILE_SIZES.crate.h} x={2300} bottomOffset={-8} scrollPos={scrollPos} />

        {/* === LAYER 5: NPCs === */}
        <PeasantNPC x={570} row={0} col={0} frame={frame} scrollPos={scrollPos} />
        <PeasantNPC x={620} row={1} col={1} frame={frame} scrollPos={scrollPos} flipX />
        <PeasantNPC x={1100} row={2} col={2} frame={frame} scrollPos={scrollPos} />
        <PeasantNPC x={1580} row={3} col={0} frame={frame} scrollPos={scrollPos} flipX />
        <PeasantNPC x={2200} row={0} col={3} frame={frame} scrollPos={scrollPos} />
        <PeasantNPC x={2700} row={1} col={2} frame={frame} scrollPos={scrollPos} flipX />

        {/* === LAYER 6: Rats === */}
        <RunningRats frame={frame} scrollPos={scrollPos} />

        {/* === LAYER 7: Fire FX === */}
        <FireFX x={540} bottomOffset={50} frame={frame} scrollPos={scrollPos} variant={1} size={3} />
        <FireFX x={1140} bottomOffset={0} frame={frame} scrollPos={scrollPos} variant={2} size={4} />
        <FireFX x={1720} bottomOffset={0} frame={frame} scrollPos={scrollPos} variant={3} size={3} />

        {/* === LAYER 8: REDUCED Night atmosphere === */}
        {/* Fog - same as V3 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            pointerEvents: "none",
            background: `radial-gradient(ellipse at ${50 + Math.sin(frame * 0.015) * 8}% 65%, rgba(40,30,20,0.12) 0%, transparent 70%)`,
          }}
        />

        {/* Night filter REDUCED: 0.35 -> 0.18 (Aziz wants to see decor colors) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 31,
            pointerEvents: "none",
            backgroundColor: "rgba(10, 15, 40, 0.18)",
            mixBlendMode: "multiply",
          }}
        />

        {/* Fire warmth glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 32,
            pointerEvents: "none",
            background: "radial-gradient(ellipse at 50% 85%, rgba(180,80,20,0.08) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* === OUTSIDE camera wrapper: HUD + overlays (fixed position) === */}

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 55,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Scanlines - subtle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 56,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px)",
          mixBlendMode: "multiply",
        }}
      />

      {/* === Data Overlays === */}
      <PropagationChart frame={frame} />
      <PopulationCard frame={frame} />

      {/* === Narrative HUD === */}
      <NarrativeHUD frame={frame} />
    </div>
  );
};
