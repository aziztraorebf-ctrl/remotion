import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { CargoVoyage16x9_LibreInspire } from "./CargoVoyage16x9_LibreInspire";
import { GridBackground } from "../../_shared/components/GridBackground";
import { InkDonutChart } from "../../_shared/components/InkDonutChart";
import { DATAVIZ_BG, PARCH, PARCH_DIM } from "../../_shared/svg-library/palette";

const BG = DATAVIZ_BG;

// CARGO_END cale APRES que la nuit soit installee (nightFade atteint 1 vers 680f dans le
// cargo, signature GeoAfrique apparait 500-560f) : couper plus tot tronquerait la scene de
// nuit/lune qu'Aziz a explicitement demande d'allonger le 2026-07-03 (voir CargoVoyage16x9_LibreInspire).
const CARGO_END = 690;
const CROSSFADE = 40;
const DATA_START = CARGO_END - CROSSFADE;

export const PROTO_NARRATIF_PLUS_DATA_FRAMES = CARGO_END + 240;

const CACAO_VALUE_SEGMENTS = [
  { label: "Planteurs", value: 0.06, color: "#8B5A2B" },
  { label: "Intermediaires", value: 0.08, color: "#5e7245" },
  { label: "Transformation", value: 0.35, color: "#e07a5f" },
  { label: "Marques & distrib.", value: 0.51, color: "#b5552f" },
];

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
          <CargoVoyage16x9_LibreInspire />
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
            <InkDonutChart
              cx={960} cy={500} r={260}
              segments={CACAO_VALUE_SEGMENTS}
              labelStyle="leader"
              backgroundColor={BG}
              backgroundInset={3}
              innerRatio={0.52}
              segmentOpacity={0.8}
              segmentStrokeWidth={2.5}
              startFrame={5}
              springDamping={20}
              frame={dataLocalFrame} fps={fps}
            />
            <text x={960} y={490} textAnchor="middle" fill={PARCH} fontSize={32} fontFamily="Georgia, serif" fontWeight="bold">
              6%
            </text>
            <text x={960} y={522} textAnchor="middle" fill={PARCH_DIM} fontSize={16} fontFamily="Georgia, serif" fontStyle="italic">
              pour les planteurs
            </text>
            <text x={960} y={1040} textAnchor="middle" fill={PARCH_DIM} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic" opacity={sourceOp}>
              Source : Mighty Earth / ICCO, 2024
            </text>
          </svg>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
