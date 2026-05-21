import { AbsoluteFill, staticFile } from "remotion";
import { MapPlatV3, type CameraKeyframe } from "./MapPlatV3";
import { GlowingRegionOverlay } from "./GlowingRegionOverlay";
import { FlagPatternOverlay } from "./FlagPatternOverlay";

// Camera centered on Mali (Bamako approx)
const KEYFRAMES: CameraKeyframe[] = [
  { frame: 0,   lon: -3,  lat: 17, zoom: 4.2 },
  { frame: 120, lon: -3,  lat: 17, zoom: 4.5 },
  { frame: 240, lon: -3,  lat: 17, zoom: 4.5 },
];

// Mali flag : vert / jaune / rouge (vertical, from hoist to fly)
const MALI_FLAG_COLORS = ["#14B53A", "#FCD116", "#CE1126"];

export const MaliFlagTest: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#a8d4e8" }}>
      <MapPlatV3 keyframes={KEYFRAMES} startFrame={0} />
      <GlowingRegionOverlay
        geojsonPath={staticFile("geojson/mali.geojson")}
        keyframes={KEYFRAMES}
        startFrame={0}
        fadeInFrames={20}
        fillColor="#FFFFFF"
        fillOpacity={0}
        glowColor="#FFFFFF"
        borderColor="#FFFFFF"
      />
      <FlagPatternOverlay
        geojsonPath={staticFile("geojson/mali.geojson")}
        keyframes={KEYFRAMES}
        startFrame={30}
        fadeInFrames={6}
        flagColors={MALI_FLAG_COLORS}
        flagOrientation="vertical"
        opacity={0.85}
        bandStartFrames={[0, 30, 60]}
        bandFadeFrames={15}
      />
    </AbsoluteFill>
  );
};
