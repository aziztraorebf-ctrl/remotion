import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { GeminiRig, IDLE, type LimbAngles } from "./ProtoGeminiPoseBankWalk";

export const PROTO_DATAVIZ_ENCRE_FRAMES = 210;

const BG = "#16213a";
const INK = "#2b2117";
const PARCH = "#e8dcc0";
const PARCH_DIM = "#d4c9a8";

const InkBarChart: React.FC<{ x: number; y: number; w: number; h: number; frame: number; fps: number }> = ({ x, y, w, h, frame, fps }) => {
  const data = [
    { label: "Ghana", value: 0.85, color: "#b5552f" },
    { label: "Cote d'Iv.", value: 1.0, color: "#e07a5f" },
    { label: "Nigeria", value: 0.35, color: "#5e7245" },
    { label: "Cameroun", value: 0.28, color: "#3d8b6e" },
    { label: "Equateur", value: 0.22, color: "#8B5A2B" },
  ];

  const barCount = data.length;
  const gap = 16;
  const barW = (w - gap * (barCount + 1)) / barCount;
  const chartTop = y + 50;
  const chartH = h - 70;

  return (
    <g>
      <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={PARCH_DIM} strokeWidth={2} strokeDasharray="6 4" />
      <line x1={x} y1={chartTop} x2={x} y2={y + h} stroke={PARCH_DIM} strokeWidth={2} strokeDasharray="6 4" />

      <text x={x + w / 2} y={y + 20} textAnchor="middle" fill={PARCH} fontSize={22} fontFamily="Georgia, serif" fontStyle="italic" letterSpacing={2}>
        Production de cacao (millions de tonnes)
      </text>

      {[0.25, 0.5, 0.75, 1.0].map((tick) => {
        const ty = y + h - tick * chartH;
        return (
          <g key={tick}>
            <line x1={x} y1={ty} x2={x + w} y2={ty} stroke={PARCH_DIM} strokeWidth={0.5} opacity={0.3} />
            <text x={x - 8} y={ty + 4} textAnchor="end" fill={PARCH_DIM} fontSize={11} fontFamily="Georgia, serif">
              {(tick * 2.2).toFixed(1)}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const barH = spring({ frame: frame - 15 - i * 8, fps, config: { damping: 12, mass: 0.8 } }) * d.value * chartH;
        const bx = x + gap + i * (barW + gap);
        const by = y + h - barH;

        return (
          <g key={i}>
            <rect x={bx} y={by} width={barW} height={barH} rx={4}
              fill={d.color} opacity={0.7}
              stroke={INK} strokeWidth={2}
            />
            {barH > 20 && (
              <>
                {Array.from({ length: Math.floor(barH / 12) }, (_, j) => (
                  <line key={j}
                    x1={bx + 4} y1={by + 8 + j * 12}
                    x2={bx + barW - 4} y2={by + 8 + j * 12}
                    stroke={INK} strokeWidth={0.5} opacity={0.15}
                  />
                ))}
              </>
            )}
            <text x={bx + barW / 2} y={y + h + 18} textAnchor="middle" fill={PARCH} fontSize={13} fontFamily="Georgia, serif">
              {d.label}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const CacaoPod: React.FC<{ cx: number; cy: number; scale?: number; rotation?: number }> = ({ cx, cy, scale = 1, rotation = 0 }) => (
  <g transform={`translate(${cx}, ${cy}) scale(${scale}) rotate(${rotation})`}>
    <ellipse cx={0} cy={0} rx={18} ry={28} fill="#b5552f" stroke={INK} strokeWidth={2} />
    <ellipse cx={0} cy={0} rx={14} ry={24} fill="none" stroke={INK} strokeWidth={1} opacity={0.3} />
    <line x1={0} y1={-24} x2={0} y2={24} stroke={INK} strokeWidth={1} opacity={0.3} />
    <line x1={-8} y1={-22} x2={-8} y2={22} stroke={INK} strokeWidth={0.7} opacity={0.2} />
    <line x1={8} y1={-22} x2={8} y2={22} stroke={INK} strokeWidth={0.7} opacity={0.2} />
    <path d={`M 0,-28 Q 6,-34 4,-40`} fill="none" stroke="#5e7245" strokeWidth={2} />
    <ellipse cx={3} cy={-38} rx={6} ry={4} fill="#5e7245" stroke={INK} strokeWidth={1} opacity={0.8} />
  </g>
);

const InkDonutChart: React.FC<{ cx: number; cy: number; r: number; frame: number; fps: number }> = ({ cx, cy, r, frame, fps }) => {
  const segments = [
    { label: "Planteurs", pct: 0.06, color: "#8B5A2B" },
    { label: "Transport", pct: 0.08, color: "#5e7245" },
    { label: "Transformation", pct: 0.35, color: "#e07a5f" },
    { label: "Distribution", pct: 0.51, color: "#b5552f" },
  ];

  const progress = spring({ frame: frame - 5, fps, config: { damping: 18, mass: 1.2 } });
  const innerR = r * 0.55;
  let cumAngle = -Math.PI / 2;

  return (
    <g>
      {segments.map((seg, i) => {
        const angle = seg.pct * 2 * Math.PI * progress;
        const startAngle = cumAngle;
        cumAngle += angle;
        const endAngle = cumAngle;

        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const ix1 = cx + innerR * Math.cos(endAngle);
        const iy1 = cy + innerR * Math.sin(endAngle);
        const ix2 = cx + innerR * Math.cos(startAngle);
        const iy2 = cy + innerR * Math.sin(startAngle);
        const largeArc = angle > Math.PI ? 1 : 0;

        const midAngle = (startAngle + endAngle) / 2;
        const labelR = r + 25;
        const lx = cx + labelR * Math.cos(midAngle);
        const ly = cy + labelR * Math.sin(midAngle);

        return (
          <g key={i}>
            <path
              d={`M ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${x2},${y2} L ${ix1},${iy1} A ${innerR},${innerR} 0 ${largeArc} 0 ${ix2},${iy2} Z`}
              fill={seg.color} opacity={0.75} stroke={INK} strokeWidth={2}
            />
            {progress > 0.8 && (
              <text x={lx} y={ly + 4} textAnchor="middle" fill={PARCH} fontSize={11} fontFamily="Georgia, serif">
                {seg.label} {Math.round(seg.pct * 100)}%
              </text>
            )}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={innerR - 2} fill={BG} />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={PARCH} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic">
        Repartition
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill={PARCH} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic">
        de la valeur
      </text>
    </g>
  );
};

const CounterEncre: React.FC<{ x: number; y: number; target: number; unit: string; label: string; frame: number; fps: number }> = ({ x, y, target, unit, label, frame, fps }) => {
  const progress = spring({ frame: frame - 10, fps, config: { damping: 15, mass: 1 } });
  const value = Math.round(target * progress);

  return (
    <g>
      <rect x={x - 70} y={y - 30} width={140} height={70} rx={8} fill="none" stroke={PARCH_DIM} strokeWidth={1.5} strokeDasharray="8 4" />
      <text x={x} y={y + 8} textAnchor="middle" fill={PARCH} fontSize={36} fontFamily="Georgia, serif" fontWeight="bold">
        {value}{unit}
      </text>
      <text x={x} y={y + 30} textAnchor="middle" fill={PARCH_DIM} fontSize={13} fontFamily="Georgia, serif" fontStyle="italic">
        {label}
      </text>
    </g>
  );
};

export const ProtoDataVizEncre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headTilt = interpolate(frame, [0, 100, 200], [0, 3, -1], { extrapolateRight: "clamp" });
  const pose: LimbAngles = { ...IDLE, hipX: 0, hipY: 0, headTilt, armUpperFront: -65, armLowerFront: -50 };

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>

        <text x={960} y={60} textAnchor="middle" fill={PARCH} fontSize={32} fontFamily="Georgia, serif" fontWeight="bold" letterSpacing={4} opacity={titleOp}>
          DE LA CABOSSE AU CHOCOLAT
        </text>
        <line x1={760} y1={75} x2={1160} y2={75} stroke={PARCH_DIM} strokeWidth={1} opacity={titleOp * 0.5} />

        <InkBarChart x={80} y={100} w={520} h={420} frame={frame} fps={fps} />

        <InkDonutChart cx={1500} cy={340} r={140} frame={frame} fps={fps} />

        <CounterEncre x={380} y={640} target={6} unit="%" label="pour les planteurs" frame={frame} fps={fps} />
        <CounterEncre x={620} y={640} target={45} unit="%" label="pour l'industrie" frame={frame} fps={fps} />

        <CacaoPod cx={200} cy={700} scale={1.2} rotation={-15} />
        <CacaoPod cx={260} cy={730} scale={0.9} rotation={10} />
        <CacaoPod cx={160} cy={750} scale={0.7} rotation={25} />

        <g transform="translate(870, 750) scale(1.8)">
          <GeminiRig a={pose} face="serious" faceView="profile"
            skinTone="#8B5A2B" clothesColor="#b5552f" pantsColor="#2F4F4F"
            hatType="conical" hatColor="#D2B48C" />
        </g>

        <text x={960} y={1050} textAnchor="middle" fill={PARCH_DIM} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic" opacity={0.6}>
          Data-Viz Encre — registre hybride Remotion + SVG personnage
        </text>
      </svg>
    </AbsoluteFill>
  );
};
