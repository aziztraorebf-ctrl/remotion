// Travel-map path helpers — vehicle moving along a route, oriented by bearing.
// Pure geometry on screen-space waypoints (percent of frame). No Mapbox runtime.
// Mirrors the AE technique: null object follows a path, sprite parented + auto-orient.

export type Pt = { x: number; y: number }; // percent (0-100) of the frame

// Catmull-Rom -> smooth point along a polyline of waypoints. t in [0,1].
export function pointOnPath(pts: Pt[], t: number): Pt {
  if (pts.length < 2) return pts[0] ?? { x: 50, y: 50 };
  const clamped = Math.max(0, Math.min(1, t));
  const segCount = pts.length - 1;
  const scaled = clamped * segCount;
  const i = Math.min(Math.floor(scaled), segCount - 1);
  const localT = scaled - i;

  const p0 = pts[Math.max(0, i - 1)];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const p3 = pts[Math.min(pts.length - 1, i + 2)];

  const tt = localT * localT;
  const ttt = tt * localT;
  const q = (a: number, b: number, c: number, d: number) =>
    0.5 *
    (2 * b +
      (-a + c) * localT +
      (2 * a - 5 * b + 4 * c - d) * tt +
      (-a + 3 * b - 3 * c + d) * ttt);

  return { x: q(p0.x, p1.x, p2.x, p3.x), y: q(p0.y, p1.y, p2.y, p3.y) };
}

// Heading (deg) at t, derived from a small forward delta. 0 = pointing right (+x).
export function bearingOnPath(pts: Pt[], t: number): number {
  const eps = 0.004;
  const a = pointOnPath(pts, Math.max(0, t - eps));
  const b = pointOnPath(pts, Math.min(1, t + eps));
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

// Build an SVG polyline `points` string sampled along the smoothed path,
// for the "trail that draws itself" effect (stroke-dasharray reveal).
export function sampleSvgPoints(
  pts: Pt[],
  w: number,
  h: number,
  samples = 120
): string {
  const out: string[] = [];
  for (let s = 0; s <= samples; s++) {
    const p = pointOnPath(pts, s / samples);
    out.push(`${(p.x / 100) * w},${(p.y / 100) * h}`);
  }
  return out.join(" ");
}
