// Sprite player — joue une animation PixelLab (walking/idle) en boucle
// Frame 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 0 -> 1 ... (loop)
//
// Structure attendue dans public/ :
//   <basePath>/<direction>/frame_000.png
//   <basePath>/<direction>/frame_001.png
//   ...

export interface SpritePlayerConfig {
  basePath: string;          // ex: "atlas-shaka-zulu/characters/shaka/animations/walking-ba529e39"
  direction: "south" | "east" | "north" | "west";
  totalFrames: number;       // 6 pour walking, 8 pour fight-stance-idle, etc.
  framesPerSpriteFrame: number; // ex: 4 = chaque sprite tient 4 frames Remotion (rapide=2, lent=8)
  startFrame?: number;       // frame Remotion ou demarre l'animation (defaut 0)
}

export function getSpriteFramePath(frame: number, config: SpritePlayerConfig): string {
  const { basePath, direction, totalFrames, framesPerSpriteFrame, startFrame = 0 } = config;
  const elapsed = Math.max(0, frame - startFrame);
  const spriteIndex = Math.floor(elapsed / framesPerSpriteFrame) % totalFrames;
  const padded = String(spriteIndex).padStart(3, "0");
  return `${basePath}/${direction}/frame_${padded}.png`;
}

// Helper alternatif : sequence de rotations (front->right->back->left) pour simuler rotation poignet
export function getRotationSequenceFrame(
  frame: number,
  basePath: string, // ex: "atlas-shaka-zulu/characters/warrior/rotations"
  sequence: ("south" | "east" | "north" | "west")[],
  framesPerStep: number,
  startFrame: number = 0
): string {
  const elapsed = Math.max(0, frame - startFrame);
  const idx = Math.floor(elapsed / framesPerStep) % sequence.length;
  return `${basePath}/${sequence[idx]}.png`;
}
