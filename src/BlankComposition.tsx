import { AbsoluteFill } from "remotion";

export const BlankComposition: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#87CEEB",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "#2d3436",
          fontSize: 80,
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
        }}
      >
        Remotion Setup OK
      </h1>
    </AbsoluteFill>
  );
};
