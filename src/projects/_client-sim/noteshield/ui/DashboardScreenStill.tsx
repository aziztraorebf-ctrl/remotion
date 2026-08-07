import React from "react";
import { AbsoluteFill } from "remotion";
import { DashboardScreen } from "./DashboardScreen";
import { LaptopMockup } from "./LaptopMockup";
import { NS_COLORS } from "./theme";

export const NS_DASHBOARD_FPS = 30;
export const NS_DASHBOARD_FRAMES = 1;

export const DashboardLowRiskStill: React.FC = () => (
  <AbsoluteFill>
    <DashboardScreen riskCase="low" />
  </AbsoluteFill>
);

export const DashboardHighRiskStill: React.FC = () => (
  <AbsoluteFill>
    <DashboardScreen riskCase="high" />
  </AbsoluteFill>
);

const LaptopStillFrame: React.FC<{ riskCase: "low" | "high" }> = ({ riskCase }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 40%, #0F1F38, ${NS_COLORS.navyDeep})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}
  >
    <LaptopMockup width={2500} screenContent={<DashboardScreen riskCase={riskCase} />} />
  </AbsoluteFill>
);

export const DashboardLowRiskLaptopStill: React.FC = () => <LaptopStillFrame riskCase="low" />;

export const DashboardHighRiskLaptopStill: React.FC = () => <LaptopStillFrame riskCase="high" />;
