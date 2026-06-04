// AtlasPixelChar — reusable PixelLab animated sprite on SVG map
// Walk cycle frames: characters/<name>/animations/<anim>/<dir>/frame_000.png
// Static fallback: characters/<name>/static-<dir>.png
// imageRendering: pixelated OBLIGATOIRE (validated 2026-05-01)

import { staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const WALK_FPS = 8;
const WALK_FRAMES = 6;

interface AtlasPixelCharProps {
  // Asset paths (relative to public/)
  charPath: string;        // e.g. "atlas-mansa-moussa/characters/mansa-moussa"
  animName: string;        // e.g. "walk_cycle" — folder name in animations/
  // Position
  x: number;
  y: number;
  // Display
  size?: number;           // display size in SVG units (default 64)
  direction?: "east" | "west" | "south" | "north";
  // Animation control
  animated?: boolean;      // true = walk cycle, false = static sprite
  appearAt?: number;       // visual frame when sprite appears (fade in)
  frameCount?: number;     // frames per walk cycle (default 6)
}

export const AtlasPixelChar: React.FC<AtlasPixelCharProps> = ({
  charPath,
  animName,
  x,
  y,
  size = 64,
  direction = "east",
  animated = true,
  appearAt = 0,
  frameCount = WALK_FRAMES,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in on appear
  const fadeIn = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 30, stiffness: 120 },
  });
  if (frame < appearAt) return null;

  // Walk cycle frame index
  const animFrame = animated
    ? Math.floor(((frame - appearAt) / fps) * WALK_FPS) % frameCount
    : 0;
  const frameStr = String(animFrame).padStart(3, "0");

  // Paths
  const animSrc = staticFile(
    `${charPath}/animations/${animName}/${direction}/frame_${frameStr}.png`
  );
  const staticSrc = staticFile(`${charPath}/static-${direction}.png`);

  // Flip west via transform (sprites are generated facing east)
  const flipTransform = direction === "west" ? `scale(-1, 1) translate(${-x * 2 - size} 0)` : "";

  return (
    <g opacity={fadeIn} transform={flipTransform}>
      <image
        href={animSrc}
        x={x - size / 2}
        y={y - size}
        width={size}
        height={size}
        style={{ imageRendering: "pixelated" } as React.CSSProperties}
        onError={() => {}}
      />
    </g>
  );
};

// Simplified static-only sprite (no animation, just a positioned image)
export const AtlasPixelStatic: React.FC<{
  charPath: string;
  direction?: "east" | "west" | "south" | "north";
  x: number;
  y: number;
  size?: number;
  appearAt?: number;
}> = ({ charPath, direction = "south", x, y, size = 64, appearAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 30, stiffness: 120 },
  });
  if (frame < appearAt) return null;

  const src = staticFile(`${charPath}/static-${direction}.png`);
  const flipTransform = direction === "west" ? `scale(-1, 1) translate(${-x * 2 - size} 0)` : "";

  return (
    <g opacity={fadeIn} transform={flipTransform}>
      <image
        href={src}
        x={x - size / 2}
        y={y - size}
        width={size}
        height={size}
        style={{ imageRendering: "pixelated" } as React.CSSProperties}
      />
    </g>
  );
};
