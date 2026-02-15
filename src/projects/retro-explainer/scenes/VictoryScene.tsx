import React from "react";
import { useVideoConfig } from "remotion";
import { VictoryScreen } from "../components/VictoryScreen";

export const VictoryScene: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <div style={{ width, height, position: "relative" }}>
      <VictoryScreen
        mainText="VICTOIRE !"
        subText="Des strategies existent pour battre le boss"
        ctaText=">> ANALYSE COMPLETE DANS LA DESCRIPTION <<"
      />
    </div>
  );
};
