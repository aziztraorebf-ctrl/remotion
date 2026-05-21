import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface PulseNumberProps {
  topLabel?: string;
  value?: string;
  subtitle?: string;
}

const CX = 540;
const CY = 960;
const MAX_RING_RADIUS = 750;
const RING_PERIOD = 120;
const RING_STAGGER = 40;

export const PulseNumber: React.FC<PulseNumberProps> = ({
  topLabel = "MILLIARDS EXTRAITS",
  value = "$2.3T",
  subtitle = "depuis 1960",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Heartbeat pulse ---
  const sinePulse = Math.sin((frame / 45) * Math.PI * 2);
  const pulseScale = interpolate(sinePulse, [-1, 1], [1, 1.04], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const haloOpacity = interpolate(sinePulse, [-1, 1], [0.4, 0.9], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // --- Entry spring (starts at frame 5) ---
  const entryProgress = spring({
    fps,
    frame: frame - 5,
    config: { damping: 12, stiffness: 90 },
    durationInFrames: 40,
  });
  const entryOpacity = interpolate(entryProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const entryScale = interpolate(entryProgress, [0, 1], [0.5, 1], {
    extrapolateRight: "clamp",
  });

  // --- Label entry spring (slight delay) ---
  const labelProgress = spring({
    fps,
    frame: frame - 15,
    config: { damping: 18, stiffness: 70 },
    durationInFrames: 35,
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // --- Expanding rings (3 rings, staggered) ---
  const rings = [0, 1, 2].map((i) => {
    const localFrame = Math.max(0, frame - i * RING_STAGGER);
    const progress = (localFrame % RING_PERIOD) / RING_PERIOD;
    const radius = interpolate(progress, [0, 1], [0, MAX_RING_RADIUS / 540], {
      extrapolateRight: "clamp",
    }) * 540;
    const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.6, 0.4, 0], {
      extrapolateRight: "clamp",
    });
    return { radius, opacity };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0C121A",
        backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* SVG rings layer — behind everything */}
      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Expanding rings */}
        {rings.map((ring, i) => (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={ring.radius}
            stroke="#c8a951"
            strokeWidth={2}
            fill="none"
            style={{ opacity: ring.opacity }}
          />
        ))}
        {/* Subtle static rings */}
        <circle
          cx={CX}
          cy={CY}
          r={280}
          stroke="#9d8c61"
          strokeWidth={1.5}
          fill="none"
          opacity={0.4}
        />
        <circle
          cx={CX}
          cy={CY}
          r={480}
          stroke="#9d8c61"
          strokeWidth={1}
          fill="none"
          opacity={0.25}
        />
      </svg>

      {/* Vignette — douce */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Top label */}
      <div
        className="absolute left-0 right-0 uppercase font-bold text-center tracking-[0.25em]"
        style={{
          top: 260,
          fontSize: 48,
          fontFamily: "'Inter', sans-serif",
          color: "#9d8c61",
          opacity: labelOpacity,
        }}
      >
        {topLabel}
      </div>

      {/* Central number — halo (behind) */}
      <div
        className="absolute left-0 right-0 flex justify-center items-center pointer-events-none"
        style={{ top: 0, bottom: 0 }}
        aria-hidden
      >
        <div
          className="text-center font-black text-ivory"
          style={{
            fontSize: 340,
            fontFamily: "'IBM Plex Mono', monospace",
            lineHeight: 1,
            opacity: haloOpacity * entryOpacity,
            filter: "blur(60px)",
            textShadow: "0 0 80px rgba(200,169,81,0.9)",
            transform: `scale(${pulseScale * entryScale})`,
            color: "rgba(200, 169, 81, 0.5)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {value}
        </div>
      </div>

      {/* Central number — main */}
      <div
        className="absolute left-0 right-0 flex justify-center items-center"
        style={{ top: 0, bottom: 0 }}
      >
        <div
          className="text-center font-black text-ivory"
          style={{
            fontSize: 340,
            fontFamily: "'IBM Plex Mono', monospace",
            lineHeight: 1,
            opacity: entryOpacity,
            transform: `scale(${pulseScale * entryScale})`,
            textShadow: "0 0 20px rgba(255,235,180,0.4), 0 0 60px rgba(255,235,180,0.15)",
          }}
        >
          {value}
        </div>
      </div>

      {/* Bottom separator + subtitle */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ top: 1640, opacity: labelOpacity }}
      >
        <div
          style={{ width: 250, height: 1.5, backgroundColor: "#C4A661", opacity: 0.8 }}
        />
        <div
          className="text-center mt-6"
          style={{
            fontSize: 52,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.1em",
            color: "#C4A661",
            opacity: 0.85,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default PulseNumber;
