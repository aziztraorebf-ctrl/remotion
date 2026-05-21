import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Lottie } from "@remotion/lottie";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crownData = require("./crown-pulse.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const iklwaData = require("./iklwa.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const arrowData = require("./arrow-pulse.json");

export const LOTTIE_TEST_FRAMES = 180;

export const LottieTest: React.FC = () => {
  const frame = useCurrentFrame();

  const mapOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const crownOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const iklwaOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1A0D0D" }}>
      <AbsoluteFill style={{ opacity: mapOpacity }}>
        <svg width="1080" height="1920" viewBox="0 0 1080 1920">
          <ellipse cx="540" cy="960" rx="280" ry="340" fill="#2A1A08" stroke="#5C3A1A" strokeWidth="2" />
          <ellipse cx="540" cy="960" rx="200" ry="240" fill="#3A2210" stroke="#8B5E2A" strokeWidth="1" opacity="0.6" />
        </svg>
      </AbsoluteFill>

      {/* Crown — center top of zone */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center", opacity: crownOpacity }}>
        <Lottie animationData={crownData} loop style={{ width: 160, height: 160 }} />
      </div>

      {/* Iklwa (épée stylisée) — left */}
      <div style={{ position: "absolute", left: 220, top: 950, opacity: iklwaOpacity }}>
        <Lottie animationData={iklwaData} loop style={{ width: 140, height: 230 }} />
      </div>

      {/* Arrow pulse (territoire conquis) — right */}
      <div style={{ position: "absolute", right: 220, top: 990, opacity: arrowOpacity }}>
        <Lottie animationData={arrowData} loop style={{ width: 160, height: 160 }} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1280, textAlign: "center", opacity: labelOpacity }}>
        <div style={{ color: "#D4A574", fontSize: 28, fontFamily: "serif", letterSpacing: 3 }}>Couronne · Iklwa · Pulse</div>
        <div style={{ color: "#8B5E2A", fontSize: 18, fontFamily: "serif", marginTop: 6 }}>3 icônes Lottie générées par Claude</div>
      </div>

      <div style={{ position: "absolute", bottom: 60, right: 60, color: "#5C3A1A", fontSize: 16, fontFamily: "monospace" }}>
        f{frame}
      </div>
    </AbsoluteFill>
  );
};
