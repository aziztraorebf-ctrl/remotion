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
import { Pt, pointOnPath, bearingOnPath, sampleSvgPoints } from "./pathUtils";

// TEMPLATE: vehicle (motorcycle) moving along a route on a tilted vintage map.
// Reproduces the Fiverr "travel route map" premium look (animonpro/Heikal style)
// with a REAL Mapbox background (geographically true) + coded SVG sprite.
// Technique = AE null-on-path + auto-orient, ported to Remotion frame-driven.

// Route over the real Cape Town map background (percent of frame, on the FLAT map
// before tilt). Roughly Cape Town -> Stellenbosch -> inland.
// Tuned to the outdoors-v12 background: Cape Town -> Stellenbosch -> Worcester.
const ROUTE: Pt[] = [
  { x: 31, y: 55 },
  { x: 38, y: 53 },
  { x: 47, y: 53 },
  { x: 55, y: 47 },
  { x: 64, y: 42 },
  { x: 71, y: 38 },
];

const STOPS: { t: number; label: string; sub: string }[] = [
  { t: 0.0, label: "Cape Town", sub: "Western Cape" },
  { t: 0.55, label: "Stellenbosch", sub: "Winelands" },
  { t: 1.0, label: "Worcester", sub: "Breede Valley" },
];

const MAP_W = 1500;
const MAP_H = 1500;

const Motorcycle: React.FC<{ size?: number }> = ({ size = 64 }) => (
  // Simple top-down-ish 3/4 motorcycle silhouette, dark with a warm seat.
  <svg width={size} height={size} viewBox="0 0 100 100">
    <g stroke="#f5efe2" strokeWidth="1.5" strokeLinejoin="round">
      {/* wheels */}
      <circle cx="24" cy="52" r="15" fill="#141414" />
      <circle cx="24" cy="52" r="6" fill="#4a4a4a" stroke="none" />
      <circle cx="76" cy="52" r="15" fill="#141414" />
      <circle cx="76" cy="52" r="6" fill="#4a4a4a" stroke="none" />
      {/* frame */}
      <path d="M24 52 L46 40 L76 52" stroke="#1b1b1b" strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* tank / seat (warm red accent) */}
      <rect x="38" y="34" width="26" height="11" rx="5" fill="#b8341f" stroke="#7a1f12" />
      {/* handlebar */}
      <path d="M64 40 L82 33" stroke="#1b1b1b" strokeWidth="5" strokeLinecap="round" />
      {/* rider head */}
      <circle cx="50" cy="36" r="6" fill="#2b2b2b" />
    </g>
  </svg>
);

export const MotoVintageMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Progress along the route: ease-in-out across most of the clip, brief holds at stops.
  const travelEnd = durationInFrames - 18;
  const prog = interpolate(frame, [12, travelEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => x * x * (3 - 2 * x),
  });

  const pos = pointOnPath(ROUTE, prog);
  const heading = bearingOnPath(ROUTE, prog);

  // Trail draw-on: dasharray reveal proportional to progress.
  const trailPts = sampleSvgPoints(ROUTE, MAP_W, MAP_H, 140);
  const trailLen = 4200; // generous upper bound for dash length
  const dashOffset = trailLen * (1 - prog);

  // Tilt the whole flat map into 3D perspective (the AE "map on a table" look).
  const tilt = interpolate(frame, [0, 40], [62, 56], {
    extrapolateRight: "clamp",
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });
  // Slow push-in for life.
  const mapScale = interpolate(frame, [0, durationInFrames], [1.04, 1.14]);

  // Active stop label (nearest passed stop).
  const activeStop = [...STOPS].reverse().find((s) => prog >= s.t) ?? STOPS[0];
  const stopAppear = spring({
    frame: frame - 6,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#d9cdb8", overflow: "hidden" }}>
      {/* Tilted map plane (perspective wrapper) */}
      <AbsoluteFill
        style={{
          perspective: 1400,
          perspectiveOrigin: "50% 38%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: MAP_W,
            height: MAP_H,
            transform: `translate(-50%, -50%) rotateX(${tilt}deg) scale(${mapScale})`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Real Mapbox background, sepia-toned for the vintage feel (geo stays real) */}
          <Img
            src={staticFile("templates/travel-map/map-capetown.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "sepia(0.32) saturate(1.05) brightness(0.98) contrast(1.08)",
            }}
          />
          {/* Paper warm overlay */}
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(220,200,160,0) 40%, rgba(150,120,80,0.35) 100%)",
              mixBlendMode: "multiply",
            }}
          />

          {/* Route trail + traveled portion, drawn in map-plane coordinates */}
          <svg
            width={MAP_W}
            height={MAP_H}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            style={{ position: "absolute", inset: 0 }}
          >
            {/* faint full route */}
            <polyline
              points={trailPts}
              fill="none"
              stroke="#6b4a2b"
              strokeOpacity={0.28}
              strokeWidth={5}
              strokeDasharray="2 10"
              strokeLinecap="round"
            />
            {/* traveled (solid red, draws on) */}
            <polyline
              points={trailPts}
              fill="none"
              stroke="#b8341f"
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={trailLen}
              strokeDashoffset={dashOffset}
            />
            {/* stop dots */}
            {STOPS.map((s, i) => {
              const p = pointOnPath(ROUTE, s.t);
              return (
                <circle
                  key={i}
                  cx={(p.x / 100) * MAP_W}
                  cy={(p.y / 100) * MAP_H}
                  r={prog >= s.t ? 11 : 7}
                  fill={prog >= s.t ? "#b8341f" : "#fff"}
                  stroke="#3a2a18"
                  strokeWidth={3}
                />
              );
            })}
          </svg>

          {/* Motorcycle: counter-rotate the X-tilt so it reads as standing on the map,
              then orient along the path. Shadow stays on the plane. */}
          <div
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) rotateX(${-tilt}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              style={{
                transform: `rotate(${heading}deg)`,
                filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.45))",
              }}
            >
              {/* soft light disc behind the sprite (subtle, doesn't hide it) */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(255,252,244,0.55) 30%, rgba(255,252,244,0) 70%)",
                  transform: "translate(-50%,-50%)",
                  zIndex: 0,
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <Motorcycle size={150} />
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Location label (screen-space, like the Fiverr examples) */}
      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: 150,
          opacity: stopAppear,
          transform: `translateY(${(1 - stopAppear) * 20}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#1c1c1c",
            color: "#fff",
            fontFamily: "Georgia, serif",
            fontSize: 58,
            fontWeight: 700,
            padding: "10px 26px",
            letterSpacing: 1,
          }}
        >
          {activeStop.label}
        </div>
        <div
          style={{
            color: "#2a2a2a",
            fontFamily: "Georgia, serif",
            fontSize: 28,
            marginTop: 10,
            marginLeft: 4,
            fontStyle: "italic",
          }}
        >
          {activeStop.sub}
        </div>
      </div>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 320px rgba(40,30,15,0.55)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
