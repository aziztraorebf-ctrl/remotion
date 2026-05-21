// Palette transition helper — Atlas Shaka Zulu
// Interpolation HSL pour bascule or -> bordeaux (S4 a la mort de Nandi)
//
// Usage :
//   const color = paletteTransition(frame, 3225, 60, "#C8A84B", "#8B1A1A");

import { interpolate } from "remotion";

function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let hue = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hue = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: hue = (b - r) / d + 2; break;
      case b: hue = (r - g) / d + 4; break;
    }
    hue *= 60;
  }
  return [hue, s * 100, l * 100];
}

export function paletteTransition(
  frame: number,
  startFrame: number,
  durationFrames: number,
  fromHex: string,
  toHex: string
): string {
  const [h1, s1, l1] = hexToHsl(fromHex);
  const [h2, s2, l2] = hexToHsl(toHex);

  const t = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const h = h1 + (h2 - h1) * t;
  const s = s1 + (s2 - s1) * t;
  const l = l1 + (l2 - l1) * t;

  return `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`;
}

export function backgroundTransition(
  frame: number,
  triggerFrame: number,
  durationFrames: number,
  colorBefore: string,
  colorAfter: string
): string {
  return paletteTransition(frame, triggerFrame, durationFrames, colorBefore, colorAfter);
}
