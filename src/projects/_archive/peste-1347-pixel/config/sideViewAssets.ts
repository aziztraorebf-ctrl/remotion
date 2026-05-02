import { SIDEVIEW_LAYER_Z } from "./sideViewFoundation";

const SIDEVIEW_BASE = "assets/peste-pixel/pixellab/side-view";

export interface SideViewCharacterAsset {
  id: string;
  basePath: string;
  nativeSize: number;
  defaultAnimation: string;
  frameCount: number;
  direction: "east" | "west" | "north" | "south";
  footAnchorY: number;
}

export const SIDEVIEW_CHARACTER_ASSETS: Record<string, SideViewCharacterAsset> = {
  merchant: {
    id: "merchant",
    basePath: `${SIDEVIEW_BASE}/characters/merchant-side`,
    nativeSize: 64,
    defaultAnimation: "walking",
    frameCount: 6,
    direction: "east",
    footAnchorY: 0.875,
  },
  monk: {
    id: "monk",
    basePath: `${SIDEVIEW_BASE}/characters/monk-side`,
    nativeSize: 64,
    defaultAnimation: "walking",
    frameCount: 6,
    direction: "east",
    footAnchorY: 0.875,
  },
  peasantMan: {
    id: "peasantMan",
    basePath: `${SIDEVIEW_BASE}/characters/peasant-man-side`,
    nativeSize: 64,
    defaultAnimation: "walking",
    frameCount: 6,
    direction: "east",
    footAnchorY: 0.875,
  },
  peasantWoman: {
    id: "peasantWoman",
    basePath: `${SIDEVIEW_BASE}/characters/peasant-woman-side`,
    nativeSize: 64,
    defaultAnimation: "walking",
    frameCount: 6,
    direction: "east",
    footAnchorY: 0.875,
  },
  child: {
    id: "child",
    basePath: `${SIDEVIEW_BASE}/characters/child-side`,
    nativeSize: 64,
    defaultAnimation: "walking",
    frameCount: 6,
    direction: "east",
    footAnchorY: 0.875,
  },
} as const;

export const SIDEVIEW_BACKGROUND_ASSETS = {
  buildings: [
    `${SIDEVIEW_BASE}/buildings/house-timbered.png`,
    `${SIDEVIEW_BASE}/buildings/church.png`,
    `${SIDEVIEW_BASE}/buildings/inn.png`,
    `${SIDEVIEW_BASE}/buildings/house-timbered.png`,
    `${SIDEVIEW_BASE}/buildings/church.png`,
  ],
  cobblestoneTile:
    `${SIDEVIEW_BASE}/tilesets/cobblestone-street/cobblestone-flat.png`,
  layerZ: SIDEVIEW_LAYER_Z,
} as const;

