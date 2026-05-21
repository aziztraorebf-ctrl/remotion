import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const RING_SIZE = 880;
const RING_RADIUS = 390;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ~2450

export interface CountdownRevealProps {
  label: string;
  subLabel?: string;
  value: number;
  unit: string;
  contextText: string;
  accentColor?: string;
  trackColor?: string;
  fillDegrees?: number;
  startFrame: number;
  revealFrame: number;
}

export const CountdownReveal: React.FC<CountdownRevealProps> = ({
  label,
  subLabel,
  value,
  unit,
  contextText,
  accentColor = "#c8a951",
  trackColor = "#1a2535",
  fillDegrees = 340,
  startFrame,
  revealFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const finalOffset = CIRCUMFERENCE * (1 - fillDegrees / 360);

  // Arc fill animation
  const dashOffset = interpolate(
    frame,
    [startFrame, revealFrame],
    [CIRCUMFERENCE, finalOffset],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Count-up animation
  const displayValue = Math.round(
    interpolate(frame, [startFrame, revealFrame - 4], [0, value], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Label fade-in spring
  const labelSpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 80, stiffness: 60 },
  });
  const labelOpacity = labelSpring;
  const labelTranslateY = interpolate(labelSpring, [0, 1], [20, 0]);

  // Context fade-in spring (delayed by 15 frames)
  const contextSpring = spring({
    frame: frame - (startFrame + 15),
    fps,
    config: { damping: 80, stiffness: 50 },
  });
  const contextOpacity = contextSpring;
  const contextTranslateY = interpolate(contextSpring, [0, 1], [20, 0]);

  // Flash reveal at revealFrame
  const flashOpacity = interpolate(
    frame,
    [revealFrame - 1, revealFrame + 1, revealFrame + 4],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const contextLines = contextText.split("\n");

  const half = RING_SIZE / 2;

  return (
    <AbsoluteFill className="bg-navy-deep">

      {/* Label block — top */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center gap-2"
        style={{
          top: 120,
          opacity: labelOpacity,
          transform: `translateY(${labelTranslateY}px)`,
        }}
      >
        <span
          className="text-ivory font-bold uppercase tracking-widest"
          style={{ fontFamily: "Cinzel, serif", fontSize: 52 }}
        >
          {label}
        </span>
        {subLabel && (
          <span
            className="text-slate"
            style={{ fontFamily: "Cinzel, serif", fontSize: 40 }}
          >
            {subLabel}
          </span>
        )}
      </div>

      {/* Ring — centré verticalement sur l'écran */}
      <div
        className="absolute"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          top: "50%",
          left: "50%",
          transform: `translateX(-50%) translateY(-50%)`,
        }}
      >
        <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} width={RING_SIZE} height={RING_SIZE}>
          <circle cx={half} cy={half} r={RING_RADIUS} fill="none" stroke={trackColor} strokeWidth={32} />
          <circle
            cx={half} cy={half} r={RING_RADIUS}
            fill="none"
            stroke={accentColor}
            strokeWidth={32}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90, ${half}, ${half})`}
          />
        </svg>

        {/* Value overlay centré dans le ring */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ opacity: labelOpacity }}
        >
          <span
            className="text-ivory font-black leading-none"
            style={{ fontSize: 380, fontFamily: "'Nunito Sans', sans-serif", lineHeight: 0.9 }}
          >
            {displayValue}
          </span>
          <span
            className="text-gold font-bold"
            style={{ fontSize: 88, marginTop: 8, fontFamily: "'Nunito Sans', sans-serif" }}
          >
            {unit}
          </span>
        </div>
      </div>

      {/* Context block — bottom */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center text-center px-12"
        style={{
          bottom: 160,
          opacity: contextOpacity,
          transform: `translateY(${contextTranslateY}px)`,
        }}
      >
        {contextLines.map((line, i) => (
          <span
            key={i}
            className="block text-ivory"
            style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 48 }}
          >
            {line}
          </span>
        ))}
      </div>

      {/* Flash reveal — must be last child */}
      <AbsoluteFill className="bg-white pointer-events-none" style={{ opacity: flashOpacity }} />
    </AbsoluteFill>
  );
};
