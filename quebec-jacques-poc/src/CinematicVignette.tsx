import { AbsoluteFill } from "remotion";

type Props = {
  intensity?: number;
};

export const CinematicVignette: React.FC<Props> = ({ intensity = 0.55 }) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        boxShadow: `inset 0 0 200px rgba(0,0,0,${intensity}), inset 0 0 80px rgba(0,0,0,${intensity * 0.5})`,
      }}
    />
  );
};
