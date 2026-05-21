import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import quebecGeo from "./quebec.geojson.json";

type Props = {
  mapLon: number;
  mapLat: number;
  mapZoom: number;
  mapW: number;
  mapH: number;
  drawStartFrame: number;
  drawDurationFrames: number;
  flagFadeStartFrame: number;
  flagFadeDurationFrames: number;
};

const lonLatToWorldPx = (lon: number, lat: number, zoom: number) => {
  const tileSize = 512;
  const scale = tileSize * Math.pow(2, zoom);
  const x = ((lon + 180) / 360) * scale;
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
  return { x, y };
};

const projectToCanvas = (lon: number, lat: number, p: { mapLon: number; mapLat: number; mapZoom: number; mapW: number; mapH: number }): [number, number] => {
  const center = lonLatToWorldPx(p.mapLon, p.mapLat, p.mapZoom);
  const point = lonLatToWorldPx(lon, lat, p.mapZoom);
  return [p.mapW / 2 + (point.x - center.x), p.mapH / 2 + (point.y - center.y)];
};

const fleurDeLysPath = "M2309 1622v-129h-115c0-66 32-130 66-150 20-17 65-25 104-5 51 29 54 113 28 151 243-45 219-280 136-365-67-69-140-79-196-58-128 46-214 199-218 427h-67c0-207 36-273 130-534 48-123 19-275-65-415-31-50-69-95-112-144-43 49-81 94-112 144-84 140-113 292-65 415 94 261 130 327 130 534h-67c-4-228-90-381-218-427-56-21-129-11-196 58-83 85-107 320 136 365-26-38-23-122 28-151 39-20 84-12 104 5 34 20 66 84 66 150h-115v129h239c-3 67-39 119-106 148 8 28 49 85 105 81 11 60 21 94 71 149 50-55 60-89 71-149 56 4 97-53 105-81-67-29-103-81-106-148z";

export const AnimatedSilhouette: React.FC<Props> = (props) => {
  const frame = useCurrentFrame();
  const geom = quebecGeo.geometry as { type: string; coordinates: number[][][][] };

  const allPaths: string[] = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  if (geom.type === "MultiPolygon") {
    for (const polygon of geom.coordinates) {
      for (const ring of polygon) {
        const segs = ring.map(([lon, lat], i) => {
          const [x, y] = projectToCanvas(lon, lat, props);
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        });
        allPaths.push(segs.join(" ") + " Z");
      }
    }
  }

  const fullPath = allPaths.join(" ");
  const flagX = minX, flagY = minY, flagW = maxX - minX, flagH = maxY - minY;

  const drawProgress = interpolate(
    frame,
    [props.drawStartFrame, props.drawStartFrame + props.drawDurationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const flagOpacity = interpolate(
    frame,
    [props.flagFadeStartFrame, props.flagFadeStartFrame + props.flagFadeDurationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const pathLength = 8000;
  const dashOffset = pathLength * (1 - drawProgress);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={props.mapW} height={props.mapH} style={{ width: "100%", height: "100%" }} viewBox={`0 0 ${props.mapW} ${props.mapH}`}>
        <defs>
          <clipPath id="qc-clip-anim">
            <path d={fullPath} />
          </clipPath>
        </defs>

        <g clipPath="url(#qc-clip-anim)" opacity={flagOpacity}>
          <rect x={flagX} y={flagY} width={flagW} height={flagH} fill="#003da5" />
          <rect x={flagX + flagW * 0.41} y={flagY} width={flagW * 0.18} height={flagH} fill="white" />
          <rect x={flagX} y={flagY + flagH * 0.41} width={flagW} height={flagH * 0.18} fill="white" />
          <svg x={flagX} y={flagY} width={flagW} height={flagH} viewBox="0 0 9600 6400" preserveAspectRatio="none">
            <path fill="#fff" d={fleurDeLysPath} />
            <g transform="translate(5600 0)"><path fill="#fff" d={fleurDeLysPath} /></g>
            <g transform="translate(0 4000)">
              <path fill="#fff" d={fleurDeLysPath} />
              <g transform="translate(5600 0)"><path fill="#fff" d={fleurDeLysPath} /></g>
            </g>
          </svg>
        </g>

        <path
          d={fullPath}
          fill="none"
          stroke="white"
          strokeWidth={3}
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
        />
      </svg>
    </AbsoluteFill>
  );
};
