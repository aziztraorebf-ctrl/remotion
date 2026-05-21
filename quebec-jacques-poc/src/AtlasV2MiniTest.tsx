import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";

const SatelliteBase: React.FC = () => {
  const frame = useCurrentFrame();
  const slowZoom = interpolate(frame, [0, 90], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${slowZoom})` }}>
      <Img
        src={staticFile("test-westafrica-tilted.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
};

const ParchmentLayer: React.FC<{ opacity: number }> = ({ opacity }) => (
  <Img
    src={staticFile("textures/parchment-mande.png")}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      mixBlendMode: "multiply",
      opacity,
      pointerEvents: "none",
    }}
  />
);

export const AtlasV2MiniTestNoOverlay: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F1E3D", isolation: "isolate" }}>
      <SatelliteBase />
    </AbsoluteFill>
  );
};

export const AtlasV2MiniTestParchment30: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F1E3D", isolation: "isolate" }}>
      <SatelliteBase />
      <ParchmentLayer opacity={0.3} />
    </AbsoluteFill>
  );
};

export const AtlasV2MiniTest: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F1E3D", isolation: "isolate" }}>
      <SatelliteBase />
      <ParchmentLayer opacity={0.5} />
    </AbsoluteFill>
  );
};

export const AtlasV2MiniTestParchment70: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F1E3D", isolation: "isolate" }}>
      <SatelliteBase />
      <ParchmentLayer opacity={0.7} />
    </AbsoluteFill>
  );
};

export const AtlasV2MiniTestParchmentScreen: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F1E3D", isolation: "isolate" }}>
      <SatelliteBase />
      <Img
        src={staticFile("textures/parchment-mande.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          mixBlendMode: "screen",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const AtlasV2MiniTestSepiaFilter: React.FC = () => {
  const frame = useCurrentFrame();
  const slowZoom = interpolate(frame, [0, 90], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F1E3D", isolation: "isolate" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${slowZoom})`,
          filter: "sepia(0.55) saturate(1.15) contrast(1.05) hue-rotate(-8deg)",
        }}
      >
        <Img
          src={staticFile("test-westafrica-tilted.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const AtlasV2MiniTestSepiaPlusGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const slowZoom = interpolate(frame, [0, 90], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F1E3D", isolation: "isolate" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${slowZoom})`,
          filter: "sepia(0.55) saturate(1.15) contrast(1.05) hue-rotate(-8deg)",
        }}
      >
        <Img
          src={staticFile("test-westafrica-tilted.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <Img
        src={staticFile("textures/parchment-mande.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          mixBlendMode: "multiply",
          opacity: 0.25,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const AtlasV2MiniTestSepiaStrong: React.FC = () => {
  const frame = useCurrentFrame();
  const slowZoom = interpolate(frame, [0, 90], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F1E3D", isolation: "isolate" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${slowZoom})`,
          filter: "sepia(0.85) saturate(1.3) contrast(1.1) hue-rotate(-12deg) brightness(0.95)",
        }}
      >
        <Img
          src={staticFile("test-westafrica-tilted.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <Img
        src={staticFile("textures/parchment-mande.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          mixBlendMode: "multiply",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const AtlasV2MiniTestParchmentOverlay: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F1E3D", isolation: "isolate" }}>
      <SatelliteBase />
      <Img
        src={staticFile("textures/parchment-mande.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          mixBlendMode: "overlay",
          opacity: 0.7,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
