import { AbsoluteFill, staticFile } from "remotion";
import { MapPlatV3, type CameraKeyframe } from "./MapPlatV3";
import { GlowingRegionOverlay } from "./GlowingRegionOverlay";

const KEYFRAMES: CameraKeyframe[] = [
  { frame: 0,   lon: -71, lat: 54, zoom: 3.8 },
  { frame: 120, lon: -71, lat: 54, zoom: 4.2 },
  { frame: 240, lon: -71, lat: 54, zoom: 4.2 },
];

export const GlowingQuebecTest: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#a8d4e8" }}>
      <MapPlatV3 keyframes={KEYFRAMES} startFrame={0} />
      <GlowingRegionOverlay
        geojsonPath={staticFile("geojson/quebec.geojson")}
        keyframes={KEYFRAMES}
        startFrame={0}
        fadeInFrames={20}
        fillColor="#FFFFFF"
        fillOpacity={0.18}
        fillBlendMode="overlay"
        glowColor="#FFFFFF"
        borderColor="#FFFFFF"
        pulse={false}
      />
    </AbsoluteFill>
  );
};
