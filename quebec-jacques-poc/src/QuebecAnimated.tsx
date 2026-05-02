import { AbsoluteFill, Img, useCurrentFrame, interpolate } from "remotion";
import { AnimatedSilhouette } from "./AnimatedSilhouette";
import { AnimatedChapterNumber } from "./AnimatedChapterNumber";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const TARGET_LON = -71;
const TARGET_LAT = 53;
const START_ZOOM = 2.5;
const END_ZOOM = 4.2;
const MAP_W = 1280;
const MAP_H = 720;

const ZOOM_STEPS = 15;

const buildMapboxUrl = (lon: number, lat: number, zoom: number) =>
  `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${lon.toFixed(4)},${lat.toFixed(4)},${zoom.toFixed(2)},0/${MAP_W}x${MAP_H}@2x?access_token=${MAPBOX_TOKEN}&attribution=false&logo=false`;

export const QuebecAnimated: React.FC = () => {
  const frame = useCurrentFrame();

  if (!MAPBOX_TOKEN) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#222", color: "white", padding: 40, fontSize: 24 }}>
        REMOTION_MAPBOX_TOKEN env var manquante.
      </AbsoluteFill>
    );
  }

  const zoomFrame = Math.min(frame, 30);
  const zoomProgress = zoomFrame / 30;
  const stepIndex = Math.min(Math.floor(zoomProgress * ZOOM_STEPS), ZOOM_STEPS - 1);
  const stepZoom = START_ZOOM + (END_ZOOM - START_ZOOM) * (stepIndex / (ZOOM_STEPS - 1));

  const currentZoom = frame < 30 ? stepZoom : END_ZOOM;
  const mapUrl = buildMapboxUrl(TARGET_LON, TARGET_LAT, currentZoom);

  const camScale = interpolate(frame, [0, 30], [1.1, 1.0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#a8d4e8", overflow: "hidden" }}>
      <Img
        src={mapUrl}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${camScale})`,
          transformOrigin: "center center",
        }}
      />

      {frame >= 30 && (
        <AnimatedSilhouette
          mapLon={TARGET_LON}
          mapLat={TARGET_LAT}
          mapZoom={END_ZOOM}
          mapW={MAP_W}
          mapH={MAP_H}
          drawStartFrame={30}
          drawDurationFrames={30}
          flagFadeStartFrame={60}
          flagFadeDurationFrames={20}
        />
      )}

      <AnimatedChapterNumber n={1} startFrame={90} />
    </AbsoluteFill>
  );
};
