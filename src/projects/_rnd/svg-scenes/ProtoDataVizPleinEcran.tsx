import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";

export const PROTO_DATAVIZ_PLEIN_ECRAN_FRAMES = 180;

const BG = "#0f1a2e";
const GRID = "#1e2d47";
const INK = "#2b2117";
const PARCH = "#e8dcc0";
const PARCH_DIM = "#b0a58a";

const GridBackground: React.FC = () => {
  const stepSmall = 30;
  const stepLarge = 150;
  const lines: React.ReactNode[] = [];

  for (let x = 0; x <= 1920; x += stepSmall) {
    const isLarge = x % stepLarge === 0;
    lines.push(
      <line key={`v${x}`} x1={x} y1={0} x2={x} y2={1080}
        stroke={GRID} strokeWidth={isLarge ? 1 : 0.5} opacity={isLarge ? 0.6 : 0.3} />
    );
  }
  for (let y = 0; y <= 1080; y += stepSmall) {
    const isLarge = y % stepLarge === 0;
    lines.push(
      <line key={`h${y}`} x1={0} y1={y} x2={1920} y2={y}
        stroke={GRID} strokeWidth={isLarge ? 1 : 0.5} opacity={isLarge ? 0.6 : 0.3} />
    );
  }

  return <g>{lines}</g>;
};

const BarChartFull: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const data = [
    { label: "Cote d'Ivoire", value: 2.2, color: "#e07a5f" },
    { label: "Ghana", value: 1.05, color: "#b5552f" },
    { label: "Indonesie", value: 0.74, color: "#8B5A2B" },
    { label: "Nigeria", value: 0.34, color: "#5e7245" },
    { label: "Cameroun", value: 0.29, color: "#3d8b6e" },
    { label: "Bresil", value: 0.27, color: "#d4a76a" },
    { label: "Equateur", value: 0.26, color: "#c68642" },
  ];

  const chartX = 280;
  const chartW = 1360;
  const chartY = 240;
  const chartH = 560;
  const barGap = 24;
  const barW = (chartW - barGap * (data.length + 1)) / data.length;
  const maxVal = 2.5;

  return (
    <g>
      {[0, 0.5, 1.0, 1.5, 2.0, 2.5].map((tick) => {
        const ty = chartY + chartH - (tick / maxVal) * chartH;
        return (
          <g key={tick}>
            <line x1={chartX - 10} y1={ty} x2={chartX + chartW} y2={ty}
              stroke={PARCH_DIM} strokeWidth={tick === 0 ? 1.5 : 0.7} opacity={tick === 0 ? 0.6 : 0.25}
              strokeDasharray={tick === 0 ? "none" : "6 6"} />
            <text x={chartX - 20} y={ty + 5} textAnchor="end" fill={PARCH_DIM} fontSize={16} fontFamily="Georgia, serif">
              {tick.toFixed(1)}
            </text>
          </g>
        );
      })}

      <text x={chartX - 60} y={chartY + chartH / 2} textAnchor="middle" fill={PARCH_DIM} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic"
        transform={`rotate(-90, ${chartX - 60}, ${chartY + chartH / 2})`}>
        Millions de tonnes
      </text>

      {data.map((d, i) => {
        const barH = spring({ frame: frame - 20 - i * 6, fps, config: { damping: 14, mass: 0.7 } }) * (d.value / maxVal) * chartH;
        const bx = chartX + barGap + i * (barW + barGap);
        const by = chartY + chartH - barH;

        const valueOp = interpolate(frame, [40 + i * 6, 55 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <g key={i}>
            <rect x={bx} y={by} width={barW} height={barH} rx={3}
              fill={d.color} opacity={0.8}
              stroke={INK} strokeWidth={2.5}
            />
            {barH > 30 && Array.from({ length: Math.floor(barH / 18) }, (_, j) => (
              <line key={j}
                x1={bx + 6} y1={by + 12 + j * 18}
                x2={bx + barW - 6} y2={by + 12 + j * 18}
                stroke={INK} strokeWidth={0.6} opacity={0.12}
              />
            ))}
            <text x={bx + barW / 2} y={chartY + chartH + 28} textAnchor="middle" fill={PARCH} fontSize={17} fontFamily="Georgia, serif">
              {d.label}
            </text>
            <text x={bx + barW / 2} y={by - 14} textAnchor="middle" fill={PARCH} fontSize={20} fontFamily="Georgia, serif" fontWeight="bold" opacity={valueOp}>
              {d.value.toFixed(2)}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const DonutFull: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const segments = [
    { label: "Planteurs", pct: 0.06, color: "#8B5A2B" },
    { label: "Intermediaires", pct: 0.08, color: "#5e7245" },
    { label: "Transformation", pct: 0.35, color: "#e07a5f" },
    { label: "Marques & distrib.", pct: 0.51, color: "#b5552f" },
  ];

  const cx = 960;
  const cy = 480;
  const r = 280;
  const innerR = r * 0.52;
  const progress = spring({ frame: frame - 10, fps, config: { damping: 20, mass: 1.2 } });

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
        const labelR = r + 40;
        const lx = cx + labelR * Math.cos(midAngle);
        const ly = cy + labelR * Math.sin(midAngle);

        const labelOp = interpolate(frame, [50 + i * 10, 65 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <g key={i}>
            <path
              d={`M ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${x2},${y2} L ${ix1},${iy1} A ${innerR},${innerR} 0 ${largeArc} 0 ${ix2},${iy2} Z`}
              fill={seg.color} opacity={0.8} stroke={INK} strokeWidth={2.5}
            />
            <g opacity={labelOp}>
              <line x1={cx + (r + 5) * Math.cos(midAngle)} y1={cy + (r + 5) * Math.sin(midAngle)}
                x2={lx} y2={ly} stroke={PARCH_DIM} strokeWidth={1} />
              <text x={lx} y={ly - 6} textAnchor={midAngle > Math.PI / 2 && midAngle < 3 * Math.PI / 2 ? "end" : "start"}
                fill={PARCH} fontSize={20} fontFamily="Georgia, serif" fontWeight="bold">
                {Math.round(seg.pct * 100)}%
              </text>
              <text x={lx} y={ly + 16} textAnchor={midAngle > Math.PI / 2 && midAngle < 3 * Math.PI / 2 ? "end" : "start"}
                fill={PARCH_DIM} fontSize={16} fontFamily="Georgia, serif" fontStyle="italic">
                {seg.label}
              </text>
            </g>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={innerR - 3} fill={BG} />
      <text x={cx} y={cy - 10} textAnchor="middle" fill={PARCH} fontSize={28} fontFamily="Georgia, serif" fontWeight="bold">
        6%
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill={PARCH_DIM} fontSize={16} fontFamily="Georgia, serif" fontStyle="italic">
        pour les planteurs
      </text>
    </g>
  );
};

const CounterFull: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const progress = spring({ frame: frame - 15, fps, config: { damping: 15, mass: 1 } });
  const value = Math.round(2200 * progress);

  const unitOp = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g>
      <text x={960} y={420} textAnchor="middle" fill={PARCH} fontSize={180} fontFamily="Georgia, serif" fontWeight="bold">
        {value.toLocaleString("fr-FR")}
      </text>
      <g opacity={unitOp}>
        <text x={960} y={500} textAnchor="middle" fill={PARCH_DIM} fontSize={36} fontFamily="Georgia, serif" fontStyle="italic">
          dollars par tonne de cacao
        </text>
        <line x1={700} y1={520} x2={1220} y2={520} stroke={PARCH_DIM} strokeWidth={1} opacity={0.4} />
        <text x={960} y={580} textAnchor="middle" fill="#e07a5f" fontSize={28} fontFamily="Georgia, serif">
          Le planteur en recoit moins de 130$
        </text>
      </g>
    </g>
  );
};

export const ProtoDataVizPleinEcran: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scene = Math.floor(frame / 60);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <GridBackground />

        {scene === 0 && (
          <g>
            <text x={960} y={140} textAnchor="middle" fill={PARCH} fontSize={38} fontFamily="Georgia, serif" fontWeight="bold" letterSpacing={3}>
              LES PLUS GRANDS PRODUCTEURS DE CACAO
            </text>
            <line x1={580} y1={158} x2={1340} y2={158} stroke={PARCH_DIM} strokeWidth={1} opacity={0.5} />
            <BarChartFull frame={frame} fps={fps} />
            <text x={960} y={1040} textAnchor="middle" fill={PARCH_DIM} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic" opacity={0.5}>
              Source : ICCO, 2024
            </text>
          </g>
        )}

        {scene === 1 && (
          <g>
            <text x={960} y={80} textAnchor="middle" fill={PARCH} fontSize={38} fontFamily="Georgia, serif" fontWeight="bold" letterSpacing={3}>
              QUI CAPTE LA VALEUR ?
            </text>
            <line x1={720} y1={98} x2={1200} y2={98} stroke={PARCH_DIM} strokeWidth={1} opacity={0.5} />
            <DonutFull frame={frame - 60} fps={fps} />
            <text x={960} y={1040} textAnchor="middle" fill={PARCH_DIM} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic" opacity={0.5}>
              Source : Mighty Earth, 2023
            </text>
          </g>
        )}

        {scene === 2 && (
          <g>
            <text x={960} y={200} textAnchor="middle" fill={PARCH_DIM} fontSize={24} fontFamily="Georgia, serif" fontStyle="italic" letterSpacing={2}>
              PRIX MONDIAL DU CACAO
            </text>
            <CounterFull frame={frame - 120} fps={fps} />
            <text x={960} y={1040} textAnchor="middle" fill={PARCH_DIM} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic" opacity={0.5}>
              Source : Bourse de Londres, 2024
            </text>
          </g>
        )}

      </svg>
    </AbsoluteFill>
  );
};
