import { AbsoluteFill } from "remotion";

export const ChapterNumber: React.FC<{ n: number }> = ({ n }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        width={200}
        height={200}
        viewBox="0 0 200 200"
        style={{ position: "absolute", top: 20, left: 30 }}
      >
        <defs>
          <linearGradient id="redgrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff5a6e" />
            <stop offset="50%" stopColor="#e63946" />
            <stop offset="100%" stopColor="#a8232f" />
          </linearGradient>
          <filter id="numshadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="3" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <text
          x={100}
          y={155}
          textAnchor="middle"
          fontSize={170}
          fontWeight={900}
          fontFamily="Impact, 'Arial Black', sans-serif"
          fill="url(#redgrad)"
          stroke="#ffffff"
          strokeWidth={10}
          paintOrder="stroke fill"
          style={{ letterSpacing: -3, filter: "url(#numshadow)" }}
        >
          {n}
        </text>
        <text
          x={100}
          y={155}
          textAnchor="middle"
          fontSize={170}
          fontWeight={900}
          fontFamily="Impact, 'Arial Black', sans-serif"
          fill="none"
          stroke="#1d3557"
          strokeWidth={3}
          style={{ letterSpacing: -3 }}
        >
          {n}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
