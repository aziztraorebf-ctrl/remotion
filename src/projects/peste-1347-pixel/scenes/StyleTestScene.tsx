import React from "react";
import { useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { PixelBackground } from "../components/PixelBackground";
import { CRTOverlay } from "../components/CRTOverlay";
import { TerminalEuropeMap } from "../components/TerminalEuropeMap";
import { TerminalTicker } from "../components/TerminalTicker";
import { PixelTypewriter } from "../components/PixelTypewriter";
import { HybridSceneTest } from "../components/HybridSceneTest";
import { COLORS, FONTS } from "../config/theme";

/**
 * Side-by-side test: Prototype A (SVG map, 100% code) vs Prototype B (hybrid AI bg)
 *
 * Structure:
 * - Frames 0-300 (10s): Prototype A - Terminal SVG Map
 * - Frames 300-600 (10s): Prototype B - Hybrid (AI background + overlays)
 */
export const StyleTestScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        backgroundColor: "#050505",
        overflow: "hidden",
      }}
    >
      {/* === PROTOTYPE A: SVG Terminal Map (frames 0-300, 10s) === */}
      {frame < 315 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: frame > 300 ? Math.max(0, 1 - (frame - 300) / 15) : 1,
          }}
        >
          {/* Grid background */}
          <PixelBackground>
            {/* Title */}
            <div
              style={{
                position: "absolute",
                top: 40,
                left: 60,
                zIndex: 20,
              }}
            >
              <PixelTypewriter
                text="OCTOBRE 1347"
                startFrame={10}
                charsPerFrame={0.5}
                font="title"
                fontSize={32}
                variant="terminal"
              />
            </div>

            {/* SVG Europe Map - slower draw (240 frames = 8s) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TerminalEuropeMap
                startFrame={5}
                drawDuration={240}
                width={1600}
                height={850}
              />
            </div>

            {/* Narrative text - appears later */}
            <div
              style={{
                position: "absolute",
                bottom: 60,
                left: 60,
                zIndex: 20,
              }}
            >
              <PixelTypewriter
                text="12 navires entrent dans le port de Messine..."
                startFrame={90}
                charsPerFrame={0.5}
                font="body"
                fontSize={32}
                variant="narrative"
              />
            </div>

            {/* Ticker */}
            <TerminalTicker />

            {/* CRT */}
            <CRTOverlay />
          </PixelBackground>
        </div>
      )}

      {/* === PROTOTYPE B: Hybrid AI Background (frames 300-600, 10s) === */}
      {frame >= 285 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: frame < 300 ? Math.max(0, (frame - 285) / 15) : 1,
          }}
        >
          <HybridSceneTest
            startFrame={300}
            backgroundSrc="assets/peste-pixel/backgrounds/carte-terminal-bg.jpg"
          />
          {/* CRT on top */}
          <CRTOverlay />
        </div>
      )}

      {/* Label showing which prototype is active */}
      <div
        style={{
          position: "absolute",
          top: 15,
          right: 30,
          zIndex: 50,
          fontFamily: FONTS.body,
          fontSize: 20,
          color: COLORS.terminalGreenDim,
          letterSpacing: 2,
        }}
      >
        {frame < 300 ? "PROTOTYPE A: 100% CODE" : "PROTOTYPE B: HYBRIDE"}
      </div>
    </div>
  );
};
