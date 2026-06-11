import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";
import { Pt, pointOnPath, sampleSvgPoints } from "./pathUtils";

// TEMPLATE: cinematic satellite travel map with a side HUD (distance / deadline /
// temperature / altitude). Reproduces the animonpro "Tuba City" rally look with a
// REAL Mapbox satellite background. Frame-driven, no Mapbox runtime.

const ROUTE: Pt[] = [
  { x: 22, y: 78 },
  { x: 32, y: 70 },
  { x: 41, y: 64 },
  { x: 47, y: 52 },
  { x: 55, y: 45 },
  { x: 63, y: 34 },
];

const DEST = { label: "TUBA CITY", region: "ARIZONA" };
const MAP_W = 1600;
const MAP_H = 1600;

const HudRow: React.FC<{ label: string; value: string; appear: number }> = ({
  label,
  value,
  appear,
}) => (
  <div
    style={{
      opacity: appear,
      transform: `translateX(${(1 - appear) * 24}px)`,
      marginBottom: 30,
    }}
  >
    <div
      style={{
        color: "rgba(255,255,255,0.7)",
        fontFamily: "Arial, sans-serif",
        fontSize: 22,
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
    <div
      style={{
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 40,
        fontWeight: 700,
        textShadow: "0 2px 8px rgba(0,0,0,0.6)",
      }}
    >
      {value}
    </div>
  </div>
);

export const SatelliteTravelMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const travelEnd = durationInFrames - 24;
  const prog = interpolate(frame, [14, travelEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => x * x * (3 - 2 * x),
  });

  const pos = pointOnPath(ROUTE, prog);
  const trailPts = sampleSvgPoints(ROUTE, MAP_W, MAP_H, 140);
  const trailLen = 4600;
  const dashOffset = trailLen * (1 - prog);

  // Gentle aerial tilt + slow push toward the destination.
  const tilt = interpolate(frame, [0, 50], [40, 34], {
    extrapolateRight: "clamp",
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });
  const scale = interpolate(frame, [0, durationInFrames], [1.08, 1.22]);

  // Live HUD values, counting toward the destination.
  const distance = Math.round(interpolate(prog, [0, 1], [819, 0]));
  const deadline = Math.max(0, 9 - Math.round(prog * 9));
  const temp = Math.round(interpolate(prog, [0, 1], [-1, 4]));
  const altitude = Math.round(interpolate(prog, [0, 1], [1706, 2240]));

  const hud = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 200 } });

  const labelAppear = spring({ frame: frame - 20, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0f14", overflow: "hidden" }}>
      {/* Tilted satellite plane */}
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 30%" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "52%",
            width: MAP_W,
            height: MAP_H,
            transform: `translate(-50%, -50%) rotateX(${tilt}deg) scale(${scale})`,
            transformStyle: "preserve-3d",
          }}
        >
          <Img
            src={staticFile("templates/travel-map/sat-arizona.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "saturate(1.1) contrast(1.06)",
            }}
          />
          {/* atmospheric haze toward the horizon */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(to top, rgba(180,210,225,0) 45%, rgba(190,215,230,0.55) 100%)",
            }}
          />

          <svg
            width={MAP_W}
            height={MAP_H}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            style={{ position: "absolute", inset: 0 }}
          >
            <polyline
              points={trailPts}
              fill="none"
              stroke="#ffffff"
              strokeOpacity={0.25}
              strokeWidth={5}
              strokeDasharray="3 12"
              strokeLinecap="round"
            />
            <polyline
              points={trailPts}
              fill="none"
              stroke="#e23b2e"
              strokeWidth={9}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={trailLen}
              strokeDashoffset={dashOffset}
              style={{ filter: "drop-shadow(0 0 6px rgba(226,59,46,0.7))" }}
            />
          </svg>

          {/* Position marker (pin) — counter-tilt so it stands up */}
          <div
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -100%) rotateX(${-tilt}deg)`,
            }}
          >
            <svg width="64" height="84" viewBox="0 0 46 60" style={{ filter: "drop-shadow(0 4px 5px rgba(0,0,0,0.5))" }}>
              <path
                d="M23 2 C11 2 2 11 2 23 C2 38 23 58 23 58 C23 58 44 38 44 23 C44 11 35 2 23 2 Z"
                fill="#e23b2e"
                stroke="#fff"
                strokeWidth="3"
              />
              <circle cx="23" cy="22" r="7" fill="#fff" />
            </svg>
          </div>
        </div>
      </AbsoluteFill>

      {/* Destination label (bottom-left, like the rally HUD) */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 120,
          opacity: labelAppear,
          transform: `translateY(${(1 - labelAppear) * 18}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#e23b2e",
            color: "#fff",
            fontFamily: "Arial, sans-serif",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 3,
            padding: "5px 14px",
            marginBottom: 8,
          }}
        >
          {DEST.region}
        </div>
        <div
          style={{
            color: "#fff",
            fontFamily: "Arial, sans-serif",
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: 2,
            textShadow: "0 3px 16px rgba(0,0,0,0.7)",
            lineHeight: 1,
          }}
        >
          {DEST.label}
        </div>
      </div>

      {/* Right-side HUD */}
      <div style={{ position: "absolute", right: 90, top: 200, width: 360 }}>
        <HudRow label="Distance to goal" value={`${distance} km`} appear={hud(30)} />
        <HudRow label="Time to deadline" value={`${deadline} h`} appear={hud(40)} />
        <HudRow label="Temperature" value={`${temp} °C`} appear={hud(50)} />
        <div
          style={{
            opacity: hud(60),
            borderTop: "1px solid rgba(255,255,255,0.4)",
            paddingTop: 18,
            marginTop: 6,
            color: "#fff",
            fontFamily: "Arial, sans-serif",
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          ▲ {altitude} m
        </div>
      </div>

      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 280px rgba(0,0,0,0.5)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
