import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../config/theme";
import { PLAGUE_DATA } from "../config/data";

interface PixelEuropeMapProps {
  startFrame: number;
  drawDuration: number;
  width?: number;
  height?: number;
}

// Simplified Europe as a boolean grid (1 = land, 0 = sea)
// ~60 columns x 40 rows, each cell = 8px block
// Covers roughly lon -10 to 40, lat 35 to 65
export const GRID_COLS = 60;
export const GRID_ROWS = 40;
export const CELL_SIZE = 8;

// Simplified Europe silhouette - rows from top (north) to bottom (south)
// Each string is a row of 60 chars: "." = sea, "#" = land
const EUROPE_MAP: string[] = [
  // Row 0-4: Scandinavia / Iceland
  "............................................................",
  "..........................####................................",
  "........................######.................##..............",
  "........................#######................###.............",
  ".......................########.................##.............",
  // Row 5-9: Norway/Sweden/Finland, UK, Baltic
  ".......................#########.............#####.............",
  "......................##########.............######............",
  ".....................###########..............#####............",
  "..........##........############..............####.............",
  "..........###......#############...............###.............",
  // Row 10-14: UK, Denmark, Poland, Russia
  ".........####.....##############...............###.............",
  ".........####....####.##########................##.............",
  "..........###....###...#########..............####.............",
  "..........##....####...##########............#####.............",
  "...............#####....#########...........######.............",
  // Row 15-19: France, Germany, Poland, Ukraine
  "..............######....##########.........########............",
  ".............#######.....##########.......#########............",
  "............########.....###########.....##########............",
  "............########......###########...###########............",
  "...........#########......#########################............",
  // Row 20-24: France, Alps, Romania, Black Sea
  "...........#########.......########################...........",
  "..........##########........#######################...........",
  "..........##########.........######################...........",
  "..........###########........#####################............",
  "...........##########.........###################..............",
  // Row 25-29: Spain, Italy, Balkans, Turkey
  "...........###########.........####.###########................",
  "............##########..........###..##########................",
  ".............#########...........##...########.................",
  "..............########...........##....#######..........###....",
  "...............#######...........#.....######..........####....",
  // Row 30-34: Southern Spain, Southern Italy, Greece, Turkey
  "................######..........##......####...........####....",
  ".................#####..........#.......###............###.....",
  "..................####..........#........##............##......",
  "...................###.....................#.....................",
  "....................##............................................",
  // Row 35-39: Mediterranean islands, North Africa coast
  "....................#.............................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
];

// Convert lat/lon to grid coordinates
// lat goes 65 (top/north) to 35 (bottom/south) -- use increasing inputRange
export const latLonToGrid = (
  lat: number,
  lon: number
): { col: number; row: number } => {
  const col = Math.round(interpolate(lon, [-10, 40], [0, GRID_COLS - 1]));
  const row = Math.round(interpolate(lat, [35, 65], [GRID_ROWS - 1, 0]));
  return {
    col: Math.max(0, Math.min(GRID_COLS - 1, col)),
    row: Math.max(0, Math.min(GRID_ROWS - 1, row)),
  };
};

export const PixelEuropeMap: React.FC<PixelEuropeMapProps> = ({
  startFrame,
  drawDuration,
  width = 1200,
  height = 800,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = Math.max(0, frame - startFrame);

  // Draw progress: reveal land cells progressively
  const drawProgress = interpolate(
    elapsed,
    [0, drawDuration * 0.6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pre-compute land cells with their reveal order
  const landCells = useMemo(() => {
    const cells: { row: number; col: number; order: number }[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      const rowStr = EUROPE_MAP[r] || "";
      for (let c = 0; c < GRID_COLS; c++) {
        if (rowStr[c] === "#") {
          // Reveal from center outward (distance from center of Europe)
          const centerR = 18;
          const centerC = 30;
          const dist = Math.sqrt((r - centerR) ** 2 + (c - centerC) ** 2);
          cells.push({ row: r, col: c, order: dist });
        }
      }
    }
    // Sort by distance from center
    cells.sort((a, b) => a.order - b.order);
    return cells;
  }, []);

  const totalCells = landCells.length;
  const visibleCount = Math.floor(drawProgress * totalCells);

  // City positions and infection timing
  const cities = useMemo(() => {
    return PLAGUE_DATA.map((point) => {
      const { col, row } = latLonToGrid(point.lat, point.lon);
      // Cities appear progressively during the draw
      const cityDelay = (point.day / 900) * drawDuration;
      return {
        ...point,
        col,
        row,
        appearFrame: startFrame + cityDelay,
      };
    });
  }, [startFrame, drawDuration]);

  // Scale to fit container
  const mapPixelWidth = GRID_COLS * CELL_SIZE;
  const mapPixelHeight = GRID_ROWS * CELL_SIZE;
  const scale = Math.min(width / mapPixelWidth, height / mapPixelHeight);
  const offsetX = (width - mapPixelWidth * scale) / 2;
  const offsetY = (height - mapPixelHeight * scale) / 2;

  if (elapsed <= 0) return null;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ imageRendering: "pixelated" }}
      >
        {/* Land cells */}
        {landCells.slice(0, visibleCount).map((cell, i) => {
          // Check if this cell is near an infected city
          let isInfected = false;
          for (const city of cities) {
            if (frame < city.appearFrame) continue;
            const dist = Math.abs(cell.row - city.row) + Math.abs(cell.col - city.col);
            const infectionSpread = interpolate(
              frame - city.appearFrame,
              [0, 60],
              [0, 4],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            if (dist <= infectionSpread) {
              isInfected = true;
              break;
            }
          }

          return (
            <rect
              key={`${cell.row}-${cell.col}`}
              x={offsetX + cell.col * CELL_SIZE * scale}
              y={offsetY + cell.row * CELL_SIZE * scale}
              width={CELL_SIZE * scale}
              height={CELL_SIZE * scale}
              fill={isInfected ? COLORS.infectionRed : COLORS.mapLand}
              stroke={COLORS.mapBorder}
              strokeWidth={0.5}
              opacity={isInfected ? 0.9 : 0.7}
            />
          );
        })}

        {/* City markers */}
        {cities.map((city) => {
          if (frame < city.appearFrame) return null;

          const pulse = Math.sin(frame * 0.1) * 0.15 + 0.85;
          const cityScale = spring({
            frame: frame - city.appearFrame,
            fps,
            config: { mass: 0.5, damping: 12, stiffness: 200 },
          });

          const cx = offsetX + city.col * CELL_SIZE * scale + (CELL_SIZE * scale) / 2;
          const cy = offsetY + city.row * CELL_SIZE * scale + (CELL_SIZE * scale) / 2;

          return (
            <g key={city.city}>
              {/* Glow */}
              <circle
                cx={cx}
                cy={cy}
                r={12 * scale * cityScale}
                fill={COLORS.infectionRed}
                opacity={0.2 * pulse}
              />
              {/* Dot */}
              <rect
                x={cx - 3 * scale * cityScale}
                y={cy - 3 * scale * cityScale}
                width={6 * scale * cityScale}
                height={6 * scale * cityScale}
                fill={COLORS.plagueRed}
                opacity={pulse}
              />
              {/* City name */}
              <text
                x={cx}
                y={cy - 12 * scale}
                textAnchor="middle"
                fontFamily={FONTS.body}
                fontSize={14 * scale}
                fill={COLORS.terminalGreen}
                opacity={cityScale * 0.8}
                style={{ textShadow: "0 0 6px rgba(0,255,65,0.3)" } as React.CSSProperties}
              >
                {city.city}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
