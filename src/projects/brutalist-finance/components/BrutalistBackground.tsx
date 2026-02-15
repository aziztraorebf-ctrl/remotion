import React from "react";

interface BrutalistBackgroundProps {
  color: string;
}

export const BrutalistBackground: React.FC<BrutalistBackgroundProps> = ({
  color,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: color,
      }}
    />
  );
};
