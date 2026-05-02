import { AbsoluteFill, Img } from "remotion";
import { ChapterNumber } from "./ChapterNumber";
import { QuebecFlagSilhouette } from "./QuebecFlagSilhouette";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const MAP_LON = -71;
const MAP_LAT = 53;
const MAP_ZOOM = 4.2;
const MAP_W = 1280;
const MAP_H = 720;

const mapboxStaticUrl = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${MAP_LON},${MAP_LAT},${MAP_ZOOM},0/${MAP_W}x${MAP_H}@2x?access_token=${MAPBOX_TOKEN}&attribution=false&logo=false`;

export const QuebecFrame1: React.FC = () => {
  if (!MAPBOX_TOKEN) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#222", color: "white", padding: 40, fontSize: 24 }}>
        REMOTION_MAPBOX_TOKEN env var manquante. Lance avec : REMOTION_MAPBOX_TOKEN=pk.xxx npm start
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#a8d4e8" }}>
      <Img src={mapboxStaticUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <QuebecFlagSilhouette mapLon={MAP_LON} mapLat={MAP_LAT} mapZoom={MAP_ZOOM} mapW={MAP_W} mapH={MAP_H} />
      <ChapterNumber n={1} />
    </AbsoluteFill>
  );
};
