import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { GeminiRig, IDLE, type LimbAngles } from "../../_shared/personnage-vivant-svg/rig/GeminiRig";
import { InkBarChart } from "../../_shared/components/InkBarChart";
import { InkDonutChart } from "../../_shared/components/InkDonutChart";
import { CounterEncre } from "../../_shared/components/CounterEncre";
import { NARRATIVE_BG, INK, PARCH, PARCH_DIM } from "../../_shared/svg-library/palette";

export const PROTO_DATAVIZ_ENCRE_FRAMES = 210;

const BG = NARRATIVE_BG;

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

const CACAO_BAR_DATA = [
  { label: "Ghana", value: 0.85, color: "#b5552f" },
  { label: "Cote d'Iv.", value: 1.0, color: "#e07a5f" },
  { label: "Nigeria", value: 0.35, color: "#5e7245" },
  { label: "Cameroun", value: 0.28, color: "#3d8b6e" },
  { label: "Equateur", value: 0.22, color: "#8B5A2B" },
];

const CACAO_DONUT_SEGMENTS = [
  { label: "Planteurs", value: 0.06, color: "#8B5A2B" },
  { label: "Transport", value: 0.08, color: "#5e7245" },
  { label: "Transformation", value: 0.35, color: "#e07a5f" },
  { label: "Distribution", value: 0.51, color: "#b5552f" },
];

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

        <InkBarChart
          x={80} y={100} w={520} h={420}
          data={CACAO_BAR_DATA}
          title="Production de cacao (millions de tonnes)"
          maxValue={1.0}
          tickLabelScale={2.2}
          formatTick={(v) => v.toFixed(1)}
          frame={frame} fps={fps}
        />

        <InkDonutChart
          cx={1500} cy={340} r={140}
          segments={CACAO_DONUT_SEGMENTS}
          labelStyle="inline"
          backgroundColor={BG}
          centerText={{ line1: "Repartition", line2: "de la valeur" }}
          frame={frame} fps={fps}
        />

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
