import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import africaData from "./africa-svg-data.json";

const PARCHMENT_BG = "#E8D9B5";
const PARCHMENT_DARK = "#C4A66B";
const INK_DARK = "#3A2A18";
const INDIGO = "#1F2A4A";
const GOLD = "#D4A574";
const TERRACOTTA = "#A85A3A";
const CREAM = "#F2E5C8";

interface CameraState {
  zoom: number;
  cx: number;
  cy: number;
}

const useCamera = (): CameraState => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase1End = fps * 1.5;
  const phase2End = fps * 4;
  const phase3End = fps * 6;

  if (frame < phase1End) {
    const t = spring({
      frame,
      fps,
      config: { damping: 16, stiffness: 80, mass: 1 },
    });
    return {
      zoom: interpolate(t, [0, 1], [1.0, 1.0]),
      cx: 360,
      cy: 640,
    };
  }
  if (frame < phase2End) {
    const t = spring({
      frame: frame - phase1End,
      fps,
      config: { damping: 18, stiffness: 90 },
    });
    return {
      zoom: interpolate(t, [0, 1], [1.0, 2.4]),
      cx: interpolate(t, [0, 1], [360, 260]),
      cy: interpolate(t, [0, 1], [640, 670]),
    };
  }
  const driftFrame = frame - phase2End;
  const driftT = interpolate(driftFrame, [0, fps * 2], [0, 1], {
    extrapolateRight: "clamp",
  });
  return {
    zoom: interpolate(driftT, [0, 1], [2.4, 2.55]),
    cx: interpolate(driftT, [0, 1], [260, 250]),
    cy: interpolate(driftT, [0, 1], [670, 660]),
  };
};

const empireRevealProgress = (frame: number, fps: number): number => {
  const start = fps * 2.0;
  const end = fps * 3.5;
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const tombouctouPulse = (frame: number, fps: number): number => {
  const start = fps * 4.2;
  if (frame < start) return 0;
  const t = (frame - start) / fps;
  return Math.max(0, 1 - (t % 1));
};

const useViewBox = (cam: CameraState): string => {
  const w = africaData.width / cam.zoom;
  const h = africaData.height / cam.zoom;
  const x = cam.cx - w / 2;
  const y = cam.cy - h / 2;
  return `${x} ${y} ${w} ${h}`;
};

export const AtlasV2VectorTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCamera();
  const viewBox = useViewBox(cam);
  const empireT = empireRevealProgress(frame, fps);
  const pulseT = tombouctouPulse(frame, fps);

  const tombouctou = africaData.cities.Tombouctou as [number, number];

  return (
    <AbsoluteFill style={{ backgroundColor: PARCHMENT_BG }}>
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <pattern
            id="hatching"
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
              stroke={GOLD}
              strokeWidth="1.6"
              opacity="0.55"
            />
          </pattern>

          <radialGradient id="vignette" cx="50%" cy="50%" r="55%">
            <stop offset="60%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
          </radialGradient>
        </defs>

        <rect
          x="0"
          y="0"
          width={africaData.width}
          height={africaData.height}
          fill={PARCHMENT_BG}
        />

        {africaData.countries.map((c) => (
          <path
            key={c.iso}
            d={c.d}
            fill={CREAM}
            stroke={INK_DARK}
            strokeWidth="0.6"
            strokeOpacity="0.55"
          />
        ))}

        {(() => {
          const path = africaData.maliEmpire1300;
          if (!path) return null;
          const approxLen = 8500;
          const dashOffset = approxLen * (1 - empireT);
          return (
            <path
              d={path}
              fill="url(#hatching)"
              fillOpacity={empireT * 0.85}
              stroke={GOLD}
              strokeWidth="2.2"
              strokeDasharray={approxLen}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })()}

        {(() => {
          const mali = africaData.countries.find((c) => c.iso === "MLI");
          if (!mali) return null;
          return (
            <path
              d={mali.d}
              fill="none"
              stroke={INDIGO}
              strokeWidth="1.6"
              strokeOpacity="0.85"
            />
          );
        })()}

        {pulseT > 0 && (
          <g>
            <circle
              cx={tombouctou[0]}
              cy={tombouctou[1]}
              r={4 + pulseT * 18}
              fill="none"
              stroke={GOLD}
              strokeWidth="2"
              opacity={1 - pulseT}
            />
            <circle
              cx={tombouctou[0]}
              cy={tombouctou[1]}
              r="3.5"
              fill={GOLD}
            />
          </g>
        )}

        <rect
          x="0"
          y="0"
          width={africaData.width}
          height={africaData.height}
          fill="url(#vignette)"
          pointerEvents="none"
        />
      </svg>
    </AbsoluteFill>
  );
};
