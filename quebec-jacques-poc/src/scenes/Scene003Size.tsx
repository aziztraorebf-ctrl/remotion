import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const MAP_STATIC = (lon: number, lat: number, zoom: number) =>
  `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${lon},${lat},${zoom},0,0/1280x720?access_token=${MAPBOX_TOKEN}`;

interface AnimationEvent {
  triggerFrame: number;
  label: string;
  x: number;
  y: number;
  asset?: string;
  text?: string;
}

const ANIM_EVENTS: AnimationEvent[] = [
  { triggerFrame: 0,   label: "title",        x: 640, y: 60,  text: "Fait #1 : La Taille" },
  { triggerFrame: 50,  label: "km2",           x: 640, y: 140, text: "1 668 000 KM²" },
  { triggerFrame: 85,  label: "france",        x: 640, y: 240, text: "= 3× la France" },
  { triggerFrame: 110, label: "allemagne",     x: 200, y: 380, text: "+ l'Allemagne" },
  { triggerFrame: 125, label: "iran_pin",      x: 400, y: 380, asset: "iran-flag-pin.png" },
  { triggerFrame: 140, label: "libya_pin",     x: 580, y: 380, asset: "libya-flag-pin.png" },
  { triggerFrame: 165, label: "arrow",         x: 640, y: 480, asset: "distance-arrow.png", text: "2 000 KM" },
  { triggerFrame: 200, label: "montreal",      x: 300, y: 540, asset: "red-circle-marker.png", text: "Montréal" },
  { triggerFrame: 215, label: "nunavik",       x: 800, y: 180, asset: "red-circle-marker.png", text: "Nunavik" },
];

export const Scene003Size: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  const mapZoom = interpolate(localFrame, [0, 120, 180, 300], [3.5, 4.0, 4.5, 5.0], { extrapolateRight: "clamp" });
  const mapLat = interpolate(localFrame, [0, 300], [54, 50], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#89cff0" }}>
      {MAPBOX_TOKEN && (
        <img
          src={MAP_STATIC(-70, mapLat, mapZoom)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.15)",
      }} />

      {/* Chapter indicator */}
      <div style={{
        position: "absolute", top: 20, left: 20,
        backgroundColor: "#cc0000",
        color: "white",
        fontFamily: "Helvetica Neue, Arial, sans-serif",
        fontWeight: "900",
        fontSize: 32,
        padding: "4px 12px",
        border: "3px solid white",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.4)",
      }}>
        1
      </div>

      {/* Animated overlay elements */}
      {ANIM_EVENTS.map((event) => {
        const triggered = localFrame >= event.triggerFrame;
        const age = localFrame - event.triggerFrame;
        const scale = triggered
          ? spring({ frame: age, fps, config: { damping: 10, stiffness: 250, mass: 0.6 } })
          : 0;
        const opacity = interpolate(age, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        if (!triggered) return null;

        return (
          <div
            key={event.label}
            style={{
              position: "absolute",
              left: event.x,
              top: event.y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
            }}
          >
            {event.asset && (
              <Img
                src={staticFile(`assets/images/${event.asset}`)}
                style={{
                  width: event.label === "arrow" ? 200 : event.label.includes("_pin") ? 48 : 60,
                  height: event.label === "arrow" ? 50 : event.label.includes("_pin") ? 80 : 60,
                  objectFit: "contain",
                }}
              />
            )}
            {event.text && (
              <div style={{
                color: "white",
                fontFamily: "Helvetica Neue, Arial, sans-serif",
                fontWeight: "900",
                fontSize: event.label === "title" ? 52 : event.label === "km2" ? 44 : 32,
                textShadow: "2px 2px 6px rgba(0,0,0,0.9), -1px -1px 3px rgba(0,0,0,0.7)",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}>
                {event.text}
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
