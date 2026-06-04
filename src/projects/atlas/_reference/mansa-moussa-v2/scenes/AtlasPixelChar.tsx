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
  appearAt?: number;       // visual frame when sprite appears (fade in + guard)
  frameCount?: number;     // frames per walk cycle (default 6)
  // PLAY-ONCE : si false, l'anim joue UNE fois puis reste sur la derniere frame
  // (clamp au lieu de %). Pour un estoc/une mort qui ne doit PAS boucler. Defaut true.
  loop?: boolean;
  // Recale le compteur d'anim a un autre frame que appearAt (ex: l'attaque demarre
  // a `clash` alors que le fade-in/guard reste sur `march`). Defaut = appearAt.
  animStartAt?: number;
  // Flip horizontal SEULEMENT pour les persos generes face EST uniquement (ex: Hannibal).
  // PAR DEFAUT false : on charge la frame native de `direction`. La PLUPART des persos Atlas
  // (Mansa, Ghana berbere/sahelien) ont de VRAIES frames west/ -> les flipper = moonwalk
  // (le sprite regarde a droite en allant a gauche). Mettre true UNIQUEMENT si le perso n'a
  // pas de dossier west/ et qu'on veut deriver l'ouest depuis l'est.
  flipForWest?: boolean;
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
  flipForWest = false,
  loop = true,
  animStartAt,
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

  // Compteur d'anim : recale sur animStartAt si fourni (sinon appearAt).
  const cycleOrigin = animStartAt ?? appearAt;
  const rawAnimFrame = Math.floor(((frame - cycleOrigin) / fps) * WALK_FPS);
  // loop=true -> modulo (boucle) ; loop=false -> clamp a la derniere frame (play-once).
  const animFrame = !animated
    ? 0
    : loop
      ? ((rawAnimFrame % frameCount) + frameCount) % frameCount
      : Math.min(Math.max(0, rawAnimFrame), frameCount - 1);
  const frameStr = String(animFrame).padStart(3, "0");

  // Paths
  const animSrc = staticFile(
    `${charPath}/animations/${animName}/${direction}/frame_${frameStr}.png`
  );
  const staticSrc = staticFile(`${charPath}/static-${direction}.png`);

  // Flip horizontal : UNIQUEMENT si flipForWest=true (perso est-seulement). Sinon on
  // charge la frame native de `direction` (ex: frames west/ reelles pour Mansa) sans flip.
  // Miroir autour de l'axe x (point d'ancrage) pour ne pas deplacer le sprite.
  const flipTransform =
    flipForWest && direction === "west" ? `translate(${2 * x} 0) scale(-1 1)` : "";

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
  flipForWest?: boolean;
}> = ({ charPath, direction = "south", x, y, size = 64, appearAt = 0, flipForWest = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 30, stiffness: 120 },
  });
  if (frame < appearAt) return null;

  const src = staticFile(`${charPath}/static-${direction}.png`);
  // flip opt-in seulement (perso est-seulement) — voir AtlasPixelChar, fix moonwalk 2026-06-03
  const flipTransform =
    flipForWest && direction === "west" ? `translate(${2 * x} 0) scale(-1 1)` : "";

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
