// ============================================================
// PixelLab Configuration for Peste 1347 Project
//
// Central config for all PixelLab-generated assets.
// Enforces consistency: perspective, scale, palette, and style
// across all characters, tilesets, and map objects.
// ============================================================

// -- Pixel Scale Standard --
// All assets must respect this ratio for visual coherence.
// A 56px sprite at DISPLAY_SCALE = 4x renders at 224px on screen.
// At 1080p, a "human" character should occupy ~200-250px height.
export const PIXEL_SCALE = {
  SPRITE_SIZE: 56, // native px for characters
  DISPLAY_SCALE: 4, // nearest-neighbor upscale factor
  DISPLAY_HEIGHT: 224, // 56 * 4 = 224px on screen
  TILE_SIZE: 32, // native px for tileset tiles
  TILE_DISPLAY_SCALE: 4, // tiles render at 128px
  SCENE_SIZE: 400, // max PixelLab scene generation
  // Ratio: 32px tile = ~1m80 human height equivalent
  // So 56px character ~ correct proportion vs 32px architecture
} as const;

// -- Perspective Lock --
// EVERY prompt must include this perspective to prevent floating/mismatch.
export const PERSPECTIVE = {
  view: "low top-down" as const,
  direction: "south" as const,
  isometric: false,
  // All assets generated with this EXACT view.
  // Matches our existing Remotion scene camera angle.
} as const;

// -- Style Standards --
export const STYLE = {
  outline: "single color black outline" as const,
  shading: "medium shading" as const,
  detail: "medium detail" as const,
  proportions: "default" as const, // chibi | default | heroic | realistic
  // References: Children of Morta, Eastward, Wytchwood
} as const;

// -- Color Palette (extracted from test assets + theme.ts) --
// Injected into prompts via color_image or prompt suffix.
export const PALETTE = {
  // Skin tones (medieval European)
  skinLight: "#E8C8A0",
  skinMedium: "#C4956A",
  skinDark: "#8B6344",

  // Clothing (period-accurate, muted)
  clothBrown: "#5C3A1E",
  clothBeige: "#BFA67A",
  clothRed: "#8B2020",
  clothBlue: "#2B4570",
  clothGreen: "#3B5E3B",
  clothGray: "#5A5A5A",
  clothWhite: "#D4C8B0",

  // Environment
  cobblestone: "#6B6B6B",
  dirt: "#8B7355",
  wood: "#6B4226",
  stone: "#8B8B7A",
  thatch: "#A08050",

  // Atmosphere
  skyDay: "#87CEEB",
  skyDusk: "#CC7744",
  skyNight: "#0A0A1A",
  torchLight: "#FFB347",
} as const;

// -- Luminance Profiles (3 moods for the video) --
export const LUMINANCE = {
  // Segment 1-2: Life before plague
  alpha: {
    name: "Golden Hour",
    promptSuffix: "bright warm afternoon, golden hour light, high saturation, clear sky, warm ochre tones",
    backgroundTint: "rgba(255, 200, 100, 0.05)",
  },
  // Segment 3-4: Plague arrives
  miasme: {
    name: "Miasme",
    promptSuffix: "overcast sky, greenish tint, desaturated colors, sickly atmosphere, muted earth tones",
    backgroundTint: "rgba(100, 120, 80, 0.08)",
  },
  // Segment 5-7: Death and aftermath
  neant: {
    name: "Neant",
    promptSuffix: "pitch black night, flickering torchlight only, high contrast, deep shadows, cold blue undertones",
    backgroundTint: "rgba(0, 0, 30, 0.15)",
  },
} as const;

// -- Character Presets --
// Reusable character descriptions for consistent generation.
export const CHARACTER_PRESETS = {
  peasantMan: {
    description: "medieval european peasant man, 14th century, brown tunic, simple cloth pants, leather shoes",
    size: PIXEL_SCALE.SPRITE_SIZE,
    nDirections: 4,
  },
  peasantWoman: {
    description: "medieval european peasant woman, 14th century, long dress, head covering, carrying basket",
    size: PIXEL_SCALE.SPRITE_SIZE,
    nDirections: 4,
  },
  merchant: {
    description: "medieval merchant, 14th century, colorful surcoat, leather belt with pouches, fur-trimmed cap",
    size: PIXEL_SCALE.SPRITE_SIZE,
    nDirections: 4,
  },
  monk: {
    description: "franciscan monk, brown robe with rope belt, tonsured head, wooden cross necklace",
    size: PIXEL_SCALE.SPRITE_SIZE,
    nDirections: 4,
  },
  knight: {
    description: "medieval knight, chainmail armor, tabard with cross, sword at belt, helmet under arm",
    size: PIXEL_SCALE.SPRITE_SIZE,
    nDirections: 4,
  },
  plagueDoctor: {
    description: "plague doctor, long black robe, beaked mask filled with herbs, wide-brimmed hat, walking staff",
    size: PIXEL_SCALE.SPRITE_SIZE,
    nDirections: 4,
  },
  noble: {
    description: "medieval noble lord, rich velvet doublet, fur-lined cloak, gold chain, feathered hat",
    size: PIXEL_SCALE.SPRITE_SIZE,
    nDirections: 4,
  },
  child: {
    description: "medieval peasant child, simple tunic, barefoot, messy hair, small and short",
    size: PIXEL_SCALE.SPRITE_SIZE,
    nDirections: 4,
  },
} as const;

// -- Animation Presets --
// Actions to generate for each character type.
export const ANIMATION_PRESETS = {
  villagerIdle: { action: "standing idle, breathing gently, looking around" },
  villagerWalk: { action: "walking slowly forward, calm pace" },
  villagerRun: { action: "running away in fear, arms pumping" },
  villagerPanic: { action: "panicking, hands on head, looking around frantically" },
  villagerPointFinger: { action: "pointing finger accusingly, angry stance" },
  villagerHideFace: { action: "covering face with both hands, hunched over in grief" },
  villagerCollapse: { action: "falling to the ground, collapsing from illness" },
  villagerPray: { action: "kneeling in prayer, hands clasped together" },
  villagerCarry: { action: "carrying a heavy body, struggling under weight" },
} as const;

// -- Z-Layer Architecture --
// Remotion rendering order for the "sandwich" technique.
export const Z_LAYERS = {
  BACKGROUND: 0, // Ground tiles, distant buildings
  GROUND_PROPS: 1, // Wells, fountains, market stalls (base)
  CHARACTERS_FAR: 2, // NPCs in the back (Y < 50% of scene)
  CHARACTERS_MID: 3, // NPCs in the middle
  CHARACTERS_NEAR: 4, // NPCs in the front (Y > 50% of scene)
  FOREGROUND_PROPS: 5, // Cart tops, overhanging roofs, foreground objects
  DATA_OVERLAY: 6, // Remotion data viz, text, HUD elements
  POST_PROCESS: 7, // CRT, grain, vignette
} as const;

// -- Asset Paths --
export const PIXELLAB_ASSET_PATHS = {
  characters: "assets/peste-pixel/pixellab/characters",
  tilesets: "assets/peste-pixel/pixellab/tilesets",
  backgrounds: "assets/peste-pixel/pixellab/backgrounds",
  mapObjects: "assets/peste-pixel/pixellab/map-objects",
} as const;

// -- Asset Versioning --
// Convention: {name}_v{N}.png
// In Remotion, swap version by changing a single number.
// Never delete old versions -- keep for rollback.
export function assetPath(
  category: keyof typeof PIXELLAB_ASSET_PATHS,
  name: string,
  version: number = 1,
): string {
  return `${PIXELLAB_ASSET_PATHS[category]}/${name}_v${version}.png`;
}
