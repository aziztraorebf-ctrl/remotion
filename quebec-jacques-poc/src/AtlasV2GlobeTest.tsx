import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import data from "./atlas-globe-data.json";

const COLORS = {
  bgTop: "#1A1F3A",
  bgBottom: "#2A1F2E",
  ocean: "#1F3855",
  oceanDeep: "#142840",
  land: "#C97D5A",
  landStroke: "#5A3A2A",
  maliFill: "#F5EBD8",
  maliStroke: "#3A2A18",
  empireGold: "#D4A574",
  empireGoldDeep: "#A87740",
  haloGold: "#D4A574",
  star: "#FFFFFF",
  cream: "#F2E5C8",
};

const STARS = Array.from({ length: 80 }, (_, i) => {
  const seed = i * 9301 + 49297;
  const r = (seed % 233280) / 233280;
  const r2 = ((seed * 7) % 233280) / 233280;
  const r3 = ((seed * 13) % 233280) / 233280;
  return {
    x: r * 720,
    y: r2 * 1280,
    size: 0.5 + r3 * 1.5,
    opacity: 0.3 + r3 * 0.6,
  };
});

const useStars = (frame: number) => {
  return STARS.map((s, i) => {
    const twinkle = 0.7 + 0.3 * Math.sin(frame * 0.05 + i * 0.7);
    return { ...s, opacity: s.opacity * twinkle };
  });
};

export const AtlasV2GlobeTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const orthoEnd = fps * 3;
  const transitionEnd = fps * 4.5;
  const zoomEnd = fps * 7;

  const phase = frame < orthoEnd ? "ortho" : frame < transitionEnd ? "transition" : "merc";

  const orthoRotateOffset = interpolate(frame, [0, orthoEnd], [0, 8], {
    extrapolateRight: "clamp",
  });

  const orthoToMercProgress = interpolate(
    frame,
    [orthoEnd, transitionEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const mercFrame = Math.max(0, frame - transitionEnd);
  const mercZoomT = spring({
    frame: mercFrame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 1 },
  });
  const mercZoom = interpolate(mercZoomT, [0, 1], [0.85, 1.05]);
  const mercDriftX = Math.sin((frame - transitionEnd) * 0.015) * 8;
  const mercDriftY = Math.cos((frame - transitionEnd) * 0.012) * 5;

  const empireRevealT = interpolate(
    frame,
    [zoomEnd, fps * 8.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const tombouctouPulseStart = fps * 8.8;
  let tombouctouPulse = 0;
  if (frame > tombouctouPulseStart) {
    const t = (frame - tombouctouPulseStart) / fps;
    tombouctouPulse = Math.max(0, 1 - (t % 1.2) / 1.2);
  }

  const orthoOpacity = interpolate(
    frame,
    [orthoEnd - 5, transitionEnd - 5],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const mercOpacity = interpolate(
    frame,
    [orthoEnd, transitionEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const stars = useStars(frame);

  const orthoCenterX = 360;
  const orthoCenterY = 640;
  const orthoRadius = 280;

  const mali = data.mercator.countries.find((c) => c.iso === "MLI");
  const tombouctou = data.mercator.cities.Tombouctou as [number, number];

  return (
    <AbsoluteFill>
      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <radialGradient id="bgGradient" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor={COLORS.bgTop} />
            <stop offset="100%" stopColor={COLORS.bgBottom} />
          </radialGradient>

          <radialGradient id="haloGradient" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor={COLORS.haloGold} stopOpacity="0" />
            <stop offset="68%" stopColor={COLORS.haloGold} stopOpacity="0.35" />
            <stop offset="80%" stopColor={COLORS.haloGold} stopOpacity="0.12" />
            <stop offset="100%" stopColor={COLORS.haloGold} stopOpacity="0" />
          </radialGradient>

          <radialGradient id="oceanGradient" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor={COLORS.ocean} />
            <stop offset="100%" stopColor={COLORS.oceanDeep} />
          </radialGradient>

          <radialGradient id="globeShadow" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="80%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
          </radialGradient>

          <pattern
            id="empireHatch"
            patternUnits="userSpaceOnUse"
            width="6"
            height="6"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke={COLORS.empireGold}
              strokeWidth="1.6"
              opacity="0.7"
            />
          </pattern>

          <radialGradient id="vignette" cx="50%" cy="50%" r="60%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="720" height="1280" fill="url(#bgGradient)" />

        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.size}
            fill={COLORS.star}
            opacity={s.opacity * (phase === "merc" ? 0 : 1)}
          />
        ))}

        {orthoOpacity > 0.01 && (
          <g
            opacity={orthoOpacity}
            transform={`translate(${orthoCenterX} ${orthoCenterY}) scale(${1 + orthoToMercProgress * 0.4}) translate(${-orthoCenterX} ${-orthoCenterY})`}
          >
            <circle
              cx={orthoCenterX}
              cy={orthoCenterY}
              r={orthoRadius * 1.55}
              fill="url(#haloGradient)"
            />
            <circle
              cx={orthoCenterX}
              cy={orthoCenterY}
              r={orthoRadius}
              fill="url(#oceanGradient)"
            />
            <g
              transform={`translate(${orthoCenterX} ${orthoCenterY}) rotate(${orthoRotateOffset}) translate(${-orthoCenterX} ${-orthoCenterY})`}
            >
              {data.ortho.countries.map((c) => (
                <path
                  key={c.iso}
                  d={c.d}
                  fill={c.iso === "MLI" ? COLORS.maliFill : COLORS.land}
                  stroke={c.iso === "MLI" ? COLORS.maliStroke : COLORS.landStroke}
                  strokeWidth={c.iso === "MLI" ? 1.4 : 0.6}
                  strokeOpacity="0.7"
                />
              ))}
            </g>
            <circle
              cx={orthoCenterX}
              cy={orthoCenterY}
              r={orthoRadius}
              fill="url(#globeShadow)"
              pointerEvents="none"
            />
          </g>
        )}

        {mercOpacity > 0.01 && (
          <g opacity={mercOpacity}>
            <g
              transform={`translate(${360 + mercDriftX} ${640 + mercDriftY}) scale(${mercZoom}) translate(${-360} ${-640})`}
            >
              <rect
                x="-200"
                y="-200"
                width="1120"
                height="1680"
                fill={COLORS.oceanDeep}
              />
              {data.mercator.countries.map((c) => (
                <path
                  key={c.iso}
                  d={c.d}
                  fill={c.iso === "MLI" ? COLORS.maliFill : COLORS.land}
                  stroke={c.iso === "MLI" ? COLORS.maliStroke : COLORS.landStroke}
                  strokeWidth={c.iso === "MLI" ? 1.8 : 0.7}
                  strokeOpacity="0.75"
                />
              ))}

              {data.mercator.maliEmpire1300 && empireRevealT > 0 && (
                <path
                  d={data.mercator.maliEmpire1300}
                  fill="url(#empireHatch)"
                  fillOpacity={empireRevealT * 0.85}
                  stroke={COLORS.empireGold}
                  strokeWidth="2.6"
                  strokeDasharray="9000"
                  strokeDashoffset={9000 * (1 - empireRevealT)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {mali && (
                <path
                  d={mali.d}
                  fill="none"
                  stroke={COLORS.maliStroke}
                  strokeWidth="2.2"
                  strokeOpacity="0.95"
                />
              )}

              {tombouctouPulse > 0 && (
                <g>
                  <circle
                    cx={tombouctou[0]}
                    cy={tombouctou[1]}
                    r={4 + tombouctouPulse * 22}
                    fill="none"
                    stroke={COLORS.empireGold}
                    strokeWidth="2.5"
                    opacity={1 - tombouctouPulse}
                  />
                  <circle
                    cx={tombouctou[0]}
                    cy={tombouctou[1]}
                    r="4"
                    fill={COLORS.empireGold}
                    stroke={COLORS.maliStroke}
                    strokeWidth="0.8"
                  />
                </g>
              )}
            </g>
          </g>
        )}

        <rect
          x="0"
          y="0"
          width="720"
          height="1280"
          fill="url(#vignette)"
          pointerEvents="none"
        />
      </svg>
    </AbsoluteFill>
  );
};
