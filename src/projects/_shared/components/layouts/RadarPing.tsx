import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface RadarStat {
  value: string;
  label: string;
  angle: number;
  revealDelay: number;
  ringRadius?: number;
}

export interface RadarPingProps {
  title?: string;
  stats?: RadarStat[];
  startFrame?: number;
  durationFrames?: number;
}

const DEFAULT_STATS: RadarStat[] = [
  { value: "$2.3T", label: "EXTRAITS", angle: 195, revealDelay: 50, ringRadius: 390 },
  { value: "54",    label: "PAYS",     angle: 345, revealDelay: 65, ringRadius: 390 },
];

const CX = 540;
const CY = 960;
const MAX_PING_R = 420;
const PING_PERIOD = 90;
const PING_STAGGER = 20;

export const RadarPing: React.FC<RadarPingProps> = ({
  title = "RESSOURCES AFRICAINES",
  stats = DEFAULT_STATS,
  startFrame = 0,
  durationFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  // --- Persistent ring pulse (inner glow) ---
  const glowPulse = interpolate(relFrame % 60, [0, 30, 60], [1, 1.08, 1]);

  // --- Ping rings (2 rings, staggered) ---
  const pingRings = [0, PING_STAGGER].map((offset) => {
    const local = Math.max(0, relFrame - offset) % PING_PERIOD;
    const r = interpolate(local, [0, PING_PERIOD], [0, MAX_PING_R], {
      extrapolateRight: "clamp",
    });
    const opacity = interpolate(
      r,
      [0, MAX_PING_R * 0.3, MAX_PING_R],
      [0, 0.7, 0],
      { extrapolateRight: "clamp" }
    );
    return { r, opacity };
  });

  // --- Stat springs ---
  const statSprings = stats.map((stat) =>
    spring({
      fps,
      frame: relFrame - stat.revealDelay,
      config: { damping: 90, stiffness: 60, mass: 1 },
      durationInFrames: 40,
    })
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#060a10",
        backgroundImage:
          "radial-gradient(circle, rgba(200,169,81,0.08) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      {/* SVG layer — rings, center dot */}
      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#c8a951" stopOpacity="1" />
            <stop offset="40%" stopColor="#c8a951" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#c8a951" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="outerHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#c8a951" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c8a951" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Persistent rings — plus grands */}
        <circle cx={CX} cy={CY} r={250} stroke="#c8a951" strokeWidth={2.5} fill="none" opacity={0.7} />
        <circle cx={CX} cy={CY} r={400} stroke="#9a8a6a" strokeWidth={1.5} fill="none" opacity={0.35} />
        <circle cx={CX} cy={CY} r={520} stroke="#9a8a6a" strokeWidth={1} fill="none" opacity={0.18} />

        {/* Animated ping rings */}
        {pingRings.map((ring, i) => (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={ring.r}
            stroke="#c8a951"
            strokeWidth={1.5}
            fill="none"
            style={{ opacity: ring.opacity }}
          />
        ))}

        {/* Center dot — outer halo */}
        <circle cx={CX} cy={CY} r={60} fill="url(#outerHalo)" />
        {/* Center dot — inner glow (pulsing) */}
        <circle
          cx={CX}
          cy={CY}
          r={30 * glowPulse}
          fill="url(#centerGlow)"
        />
        {/* Center dot — solid core */}
        <circle cx={CX} cy={CY} r={12} fill="#c8a951" />
      </svg>

      {/* Vignette radiale pour assombrir les bords */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 30%, #060a10 90%)",
        }}
      />

      {/* Title + séparateur */}
      <div className="absolute left-0 right-0 flex flex-col items-center pointer-events-none" style={{ top: 140 }}>
        <p
          className="text-ivory font-light tracking-[0.12em] uppercase text-center"
          style={{ fontFamily: "'Cinzel', serif", fontSize: 44 }}
        >
          {title}
        </p>
        <div className="w-72 h-px bg-slate mt-5" style={{ opacity: 0.4 }} />
      </div>

      {/* Stats layer */}
      <AbsoluteFill className="pointer-events-none">
        {stats.map((stat, i) => {
          const radius = stat.ringRadius ?? 390;
          const rad = (stat.angle * Math.PI) / 180;
          const leftPct = ((CX + Math.cos(rad) * radius) / 1080) * 100;
          const topPct  = ((CY + Math.sin(rad) * radius) / 1920) * 100;
          const progress = statSprings[i];
          const opacity = interpolate(progress, [0, 1], [0, 1]);
          const translateY = interpolate(progress, [0, 1], [16, 0]);

          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: `translate(-50%, -50%) translateY(${translateY}px)`,
                opacity,
              }}
            >
              {/* Tiret doré vers le cercle (côté droit si stat gauche, gauche si stat droite) */}
              <div className="relative flex items-center">
                {stat.angle > 180 && (
                  <div className="bg-gold mr-3" style={{ width: 28, height: 2, opacity: 0.8 }} />
                )}
                <span
                  className="text-ivory font-bold leading-none text-center"
                  style={{ fontFamily: "'Cinzel', serif", fontSize: "96px" }}
                >
                  {stat.value}
                </span>
                {stat.angle <= 180 && (
                  <div className="bg-gold ml-3" style={{ width: 28, height: 2, opacity: 0.8 }} />
                )}
              </div>
              <span
                className="text-slate tracking-widest uppercase text-center mt-2"
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", fontSize: "22px" }}
              >
                {stat.label}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default RadarPing;
