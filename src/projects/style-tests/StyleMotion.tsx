import { useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";

// City data: [name, x%, y%] relative to 1920x1080 canvas
const CITIES: { name: string; x: number; y: number; delay: number }[] = [
  { name: "Venise",    x: 52.5, y: 52.0, delay: 0  },
  { name: "Florence",  x: 50.0, y: 56.0, delay: 8  },
  { name: "Marseille", x: 44.0, y: 57.0, delay: 16 },
  { name: "Paris",     x: 40.0, y: 43.0, delay: 24 },
  { name: "Barcelone", x: 38.0, y: 58.0, delay: 20 },
  { name: "Lyon",      x: 43.0, y: 50.0, delay: 18 },
  { name: "Bruges",    x: 41.0, y: 37.0, delay: 30 },
  { name: "Londres",   x: 37.0, y: 34.0, delay: 38 },
  { name: "Hambourg",  x: 50.0, y: 30.0, delay: 34 },
  { name: "Rome",      x: 52.0, y: 60.0, delay: 10 },
];

const PLAGUE_RED = "#8b0000";
const PLAGUE_RED_GLOW = "#c0000088";
const BACKGROUND = "#0a0a0a";
const TEXT_WHITE = "#f5f5f5";
const MAP_STROKE = "#2a2a2a";
const MAP_FILL = "#141414";

// Simplified Europe SVG paths (approximate coastal outline)
// Coordinates in a 400x380 viewBox, centered on Western Europe
const EUROPE_PATHS = [
  // Iberian Peninsula
  "M 100 220 L 95 190 L 80 175 L 85 155 L 100 145 L 120 140 L 140 135 L 155 140 L 165 150 L 170 165 L 175 180 L 170 195 L 160 205 L 145 215 L 130 225 Z",
  // France
  "M 155 140 L 170 130 L 185 120 L 200 115 L 215 118 L 225 128 L 220 140 L 215 155 L 205 165 L 190 170 L 175 180 L 170 165 L 165 150 Z",
  // British Isles (England + Scotland)
  "M 145 70 L 148 55 L 155 45 L 165 40 L 175 45 L 178 58 L 172 70 L 165 80 L 155 85 L 147 80 Z",
  "M 155 85 L 165 80 L 172 70 L 178 58 L 185 65 L 188 80 L 183 95 L 175 105 L 162 108 L 152 102 L 150 92 Z",
  // Scandinavia (simplified)
  "M 220 50 L 230 35 L 245 25 L 258 30 L 265 48 L 260 65 L 248 78 L 235 82 L 222 70 Z",
  "M 200 55 L 208 40 L 220 50 L 222 70 L 215 80 L 205 85 L 196 78 L 193 65 Z",
  // Germany / Central Europe
  "M 215 118 L 230 112 L 248 108 L 260 115 L 268 128 L 265 142 L 255 152 L 240 158 L 225 155 L 215 145 L 215 130 Z",
  // Italy
  "M 215 155 L 225 155 L 235 160 L 245 170 L 250 182 L 255 196 L 258 210 L 252 220 L 244 225 L 238 215 L 232 205 L 225 195 L 218 185 L 212 172 L 210 162 Z",
  // Balkans / Eastern Europe (simplified blob)
  "M 260 115 L 278 110 L 295 118 L 308 132 L 312 148 L 305 162 L 290 170 L 272 168 L 262 158 L 258 142 L 260 128 Z",
  // North Africa coast (simplified)
  "M 80 255 L 120 252 L 160 250 L 200 250 L 240 252 L 280 255 L 300 260 L 310 268 L 300 270 L 260 268 L 220 265 L 180 263 L 140 263 L 100 265 L 80 268 Z",
];

function PlaguePoint({
  x,
  y,
  delay,
  name,
}: {
  x: number;
  y: number;
  delay: number;
  name: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.8 },
    durationInFrames: 20,
  });

  // Pulsing oscillation
  const pulse = 1 + 0.18 * Math.sin((frame - delay) * 0.22);
  const scale = appear * pulse;

  // Glow opacity pulse
  const glowOpacity = appear * (0.5 + 0.3 * Math.sin((frame - delay) * 0.18 + 1));

  if (frame < delay) return null;

  const px = (x / 100) * 1920;
  const py = (y / 100) * 1080;

  return (
    <g>
      {/* Outer glow ring */}
      <circle
        cx={px}
        cy={py}
        r={22 * appear}
        fill="none"
        stroke={PLAGUE_RED}
        strokeWidth={1.5}
        opacity={glowOpacity * 0.6}
      />
      {/* Soft glow fill */}
      <circle
        cx={px}
        cy={py}
        r={16 * scale}
        fill={PLAGUE_RED_GLOW}
        opacity={glowOpacity}
      />
      {/* Core dot */}
      <circle
        cx={px}
        cy={py}
        r={8 * scale}
        fill={PLAGUE_RED}
        opacity={appear}
      />
      {/* City label */}
      <text
        x={px + 14}
        y={py - 10}
        fill={TEXT_WHITE}
        fontSize={18}
        fontFamily="'Arial Narrow', Arial, sans-serif"
        fontWeight="400"
        opacity={appear * 0.85}
        letterSpacing="0.08em"
      >
        {name.toUpperCase()}
      </text>
    </g>
  );
}

export default function StyleMotion() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 20], [-24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Death counter
  const maxDeaths = 25_000_000;
  const counterStart = 10;
  const deaths = Math.round(
    interpolate(frame, [counterStart, durationInFrames - 10], [0, maxDeaths], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const counterOpacity = interpolate(frame, [counterStart, counterStart + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Format death count
  const formatDeaths = (n: number): string => {
    if (n >= 1_000_000) {
      return (n / 1_000_000).toFixed(1).replace(".", ",") + " M";
    }
    return n.toLocaleString("fr-FR");
  };

  // Map container: 960x760 viewBox on a 400x380 internal canvas, centered in 1920x1080
  const MAP_SCALE = 2.4;
  const MAP_OFFSET_X = 1920 / 2 - (400 * MAP_SCALE) / 2 + 40;
  const MAP_OFFSET_Y = 1080 / 2 - (380 * MAP_SCALE) / 2 + 40;

  // Subtle map entrance
  const mapOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background: BACKGROUND,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Arial Black', 'Arial Bold', Arial, sans-serif",
      }}
    >
      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 40%, rgba(0,0,0,0.72) 100%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Europe Map SVG */}
      <svg
        width={1920}
        height={1080}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: mapOpacity,
        }}
      >
        <defs>
          <filter id="mapBlur">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>

        {/* Map group: scaled and translated to center */}
        <g
          transform={`translate(${MAP_OFFSET_X}, ${MAP_OFFSET_Y}) scale(${MAP_SCALE})`}
          filter="url(#mapBlur)"
        >
          {EUROPE_PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill={MAP_FILL}
              stroke={MAP_STROKE}
              strokeWidth={0.8}
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* Plague points */}
        {CITIES.map((city) => (
          <PlaguePoint
            key={city.name}
            x={city.x}
            y={city.y}
            delay={city.delay}
            name={city.name}
          />
        ))}

        {/* Horizontal divider lines */}
        <line x1={100} y1={140} x2={1820} y2={140} stroke="#1e1e1e" strokeWidth={1} />
        <line x1={100} y1={940} x2={1820} y2={940} stroke="#1e1e1e" strokeWidth={1} />
      </svg>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: TEXT_WHITE,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          LA PESTE NOIRE
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: PLAGUE_RED,
            letterSpacing: "0.32em",
            marginTop: 10,
            fontFamily: "'Arial Narrow', Arial, sans-serif",
          }}
        >
          1347 - 1353
        </div>
      </div>

      {/* Death counter bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 68,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: counterOpacity,
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: "#666666",
            letterSpacing: "0.28em",
            marginBottom: 8,
            fontFamily: "'Arial Narrow', Arial, sans-serif",
          }}
        >
          MORTS ESTIMEES EN EUROPE
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 900,
            color: PLAGUE_RED,
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          {formatDeaths(deaths)}
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "#444444",
            letterSpacing: "0.22em",
            marginTop: 8,
            fontFamily: "'Arial Narrow', Arial, sans-serif",
          }}
        >
          PERSONNES
        </div>
      </div>

      {/* Side year marker */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          transformOrigin: "center center",
          opacity: titleOpacity * 0.4,
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: "0.35em",
            color: "#444444",
            fontFamily: "'Arial Narrow', Arial, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          PROPAGATION EST - OUEST
        </div>
      </div>
    </div>
  );
}
