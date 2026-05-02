// GeoSprite — wrapper qui projette un sprite PixelLab a une coordonnee geo (lon/lat)
// vers une position pixel sur l'ecran via projection d3-geo.
//
// Idee Kimi Q2 : sprites comme acteurs spatiaux sur la carte, pas decoration.
//
// Usage :
//   const projection = d3.geoOrthographic().center([31, -28.5]).scale(1500).translate([960, 540]);
//   const [x, y] = projection([30.7, -28.1]); // Gqokli Hill
//   <img src={spritePath} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }} />

import { interpolate } from "remotion";

export type Coords = { lon: number; lat: number };
export type Projection = (coords: [number, number]) => [number, number] | null;

export function projectCoords(projection: Projection, coords: Coords): { x: number; y: number } | null {
  const result = projection([coords.lon, coords.lat]);
  if (!result) return null;
  return { x: result[0], y: result[1] };
}

// Interpole un sprite entre 2 coordonnees geo sur une plage de frames
export function interpolateGeoPosition(
  frame: number,
  startFrame: number,
  endFrame: number,
  projection: Projection,
  fromCoords: Coords,
  toCoords: Coords
): { x: number; y: number } | null {
  const t = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const lon = fromCoords.lon + (toCoords.lon - fromCoords.lon) * t;
  const lat = fromCoords.lat + (toCoords.lat - fromCoords.lat) * t;

  return projectCoords(projection, { lon, lat });
}

// Position le long d'un bezier path SVG via getPointAtLength
export function getPointOnPath(
  pathElement: SVGPathElement | null,
  t: number // 0 a 1
): { x: number; y: number } | null {
  if (!pathElement) return null;
  const length = pathElement.getTotalLength();
  const point = pathElement.getPointAtLength(length * t);
  return { x: point.x, y: point.y };
}
