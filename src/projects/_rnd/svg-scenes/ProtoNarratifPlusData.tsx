import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { CargoVoyage16x9 } from "./CargoVoyage16x9";

const BG = "#0f1a2e";
const GRID_COLOR = "#1e2d47";
const INK = "#2b2117";
const PARCH = "#e8dcc0";
const PARCH_DIM = "#b0a58a";

export const PROTO_NARRATIF_PLUS_DATA_FRAMES = 420;

const GridBackground: React.FC = () => {
  const stepSmall = 30;
  const stepLarge = 150;
  const lines: React.ReactNode[] = [];
  for (let x = 0; x <= 1920; x += stepSmall) {
    const isLarge = x % stepLarge === 0;
    lines.push(
      <line key={`v${x}`} x1={x} y1={0} x2={x} y2={1080}
        stroke={GRID_COLOR} strokeWidth={isLarge ? 1 : 0.5} opacity={isLarge ? 0.6 : 0.3} />
    );
  }
  for (let y = 0; y <= 1080; y += stepSmall) {
    const isLarge = y % stepLarge === 0;
    lines.push(
      <line key={`h${y}`} x1={0} y1={y} x2={1920} y2={y}
        stroke={GRID_COLOR} strokeWidth={isLarge ? 1 : 0.5} opacity={isLarge ? 0.6 : 0.3} />
    );
  }
  return <g>{lines}</g>;
};

const DonutScene: React.FC<{ localFrame: number; fps: number }> = ({ localFrame, fps }) => {
  const segments = [
    { label: "Planteurs", pct: 0.06, color: "#8B5A2B" },
    { label: "Intermediaires", pct: 0.08, color: "#5e7245" },
    { label: "Transformation", pct: 0.35, color: "#e07a5f" },
    { label: "Marques & distrib.", pct: 0.51, color: "#b5552f" },
  ];

  const cx = 960;
  const cy = 500;
  const r = 260;
  const innerR = r * 0.52;
  const progress = spring({ frame: localFrame - 5, fps, config: { damping: 20, mass: 1.2 } });

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
        const labelOp = interpolate(localFrame, [40 + i * 10, 55 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
                fill={PARCH} fontSize={22} fontFamily="Georgia, serif" fontWeight="bold">
                {Math.round(seg.pct * 100)}%
              </text>
              <text x={lx} y={ly + 18} textAnchor={midAngle > Math.PI / 2 && midAngle < 3 * Math.PI / 2 ? "end" : "start"}
                fill={PARCH_DIM} fontSize={16} fontFamily="Georgia, serif" fontStyle="italic">
                {seg.label}
              </text>
            </g>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={innerR - 3} fill={BG} />
      <text x={cx} y={cy - 10} textAnchor="middle" fill={PARCH} fontSize={32} fontFamily="Georgia, serif" fontWeight="bold">
        6%
      </text>
      <text x={cx} y={cy + 22} textAnchor="middle" fill={PARCH_DIM} fontSize={16} fontFamily="Georgia, serif" fontStyle="italic">
        pour les planteurs
      </text>
    </g>
  );
};

const CARGO_END = 270;
const CROSSFADE = 30;
const DATA_START = CARGO_END - CROSSFADE;

export const ProtoNarratifPlusData: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cargoOpacity = frame < DATA_START ? 1 : interpolate(frame, [DATA_START, CARGO_END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dataOpacity = frame < DATA_START ? 0 : interpolate(frame, [DATA_START, CARGO_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const dataLocalFrame = Math.max(0, frame - DATA_START);

  const titleOp = interpolate(frame, [CARGO_END + 10, CARGO_END + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sourceOp = interpolate(frame, [CARGO_END + 60, CARGO_END + 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG }}>
      {frame < CARGO_END && (
        <AbsoluteFill style={{ opacity: cargoOpacity }}>
          <CargoVoyage16x9 />
        </AbsoluteFill>
      )}

      {frame >= DATA_START && (
        <AbsoluteFill style={{ opacity: dataOpacity }}>
          <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
            <GridBackground />
            <text x={960} y={90} textAnchor="middle" fill={PARCH} fontSize={38} fontFamily="Georgia, serif" fontWeight="bold" letterSpacing={3} opacity={titleOp}>
              QUI CAPTE LA VALEUR DU CACAO ?
            </text>
            <line x1={660} y1={108} x2={1260} y2={108} stroke={PARCH_DIM} strokeWidth={1} opacity={titleOp * 0.5} />
            <DonutScene localFrame={dataLocalFrame} fps={fps} />
            <text x={960} y={1040} textAnchor="middle" fill={PARCH_DIM} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic" opacity={sourceOp}>
              Source : Mighty Earth / ICCO, 2024
            </text>
          </svg>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
