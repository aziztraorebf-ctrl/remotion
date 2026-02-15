import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../config/theme";
import { TICKER_MESSAGES } from "../config/ticker-data";
import { getSegment } from "../config/timing";

const TICKER_HEIGHT = 40;
const SCROLL_SPEED = 1.5; // px per frame

export const TerminalTicker: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const segment = getSegment(frame);
  const message = TICKER_MESSAGES[segment];

  // Repeat message to fill scrolling width
  const repeatedMessage = `${message}   ${message}   ${message}`;
  const offset = -(frame * SCROLL_SPEED) % (message.length * 10);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width,
        height: TICKER_HEIGHT,
        backgroundColor: COLORS.tickerBg,
        borderTop: `1px solid ${COLORS.tickerBorder}`,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 30,
      }}
    >
      {/* Fixed label */}
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 16,
          color: COLORS.terminalGreenDim,
          padding: "0 12px",
          whiteSpace: "nowrap",
          flexShrink: 0,
          borderRight: `1px solid ${COLORS.tickerBorder}`,
          height: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1,
        }}
      >
        [TERMINAL]
      </div>

      {/* Scrolling text */}
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 18,
          color: COLORS.terminalGreen,
          whiteSpace: "nowrap",
          transform: `translateX(${offset}px)`,
          paddingLeft: 20,
        }}
      >
        {repeatedMessage}
      </div>
    </div>
  );
};
