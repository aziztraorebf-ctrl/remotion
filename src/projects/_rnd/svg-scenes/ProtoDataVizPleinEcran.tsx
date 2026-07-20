import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { GridBackground } from "../../_shared/components/GridBackground";
import { InkBarChart } from "../../_shared/components/InkBarChart";
import { InkDonutChart } from "../../_shared/components/InkDonutChart";
import { CounterEncre } from "../../_shared/components/CounterEncre";
import { DATAVIZ_BG, PARCH, PARCH_DIM } from "../../_shared/svg-library/palette";

export const PROTO_DATAVIZ_PLEIN_ECRAN_FRAMES = 180;

const BG = DATAVIZ_BG;

const CACAO_PRODUCTION_DATA = [
  { label: "Cote d'Ivoire", value: 2.2, color: "#e07a5f" },
  { label: "Ghana", value: 1.05, color: "#b5552f" },
  { label: "Indonesie", value: 0.74, color: "#8B5A2B" },
  { label: "Nigeria", value: 0.34, color: "#5e7245" },
  { label: "Cameroun", value: 0.29, color: "#3d8b6e" },
  { label: "Bresil", value: 0.27, color: "#d4a76a" },
  { label: "Equateur", value: 0.26, color: "#c68642" },
];

const CACAO_VALUE_SEGMENTS = [
  { label: "Planteurs", value: 0.06, color: "#8B5A2B" },
  { label: "Intermediaires", value: 0.08, color: "#5e7245" },
  { label: "Transformation", value: 0.35, color: "#e07a5f" },
  { label: "Marques & distrib.", value: 0.51, color: "#b5552f" },
];

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
            <InkBarChart
              x={280} y={240} w={1360} h={560}
              data={CACAO_PRODUCTION_DATA}
              maxValue={2.5}
              tickCount={5}
              topPadding={0}
              chartVerticalMargin={0}
              showValueLabels
              formatValue={(v) => v.toFixed(2)}
              startFrame={20}
              staggerFrames={6}
              frame={frame} fps={fps}
            />
            <text x={220} y={520} textAnchor="middle" fill={PARCH_DIM} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic"
              transform="rotate(-90, 220, 520)">
              Millions de tonnes
            </text>
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
            <InkDonutChart
              cx={960} cy={480} r={280}
              segments={CACAO_VALUE_SEGMENTS}
              labelStyle="leader"
              backgroundColor={BG}
              backgroundInset={3}
              innerRatio={0.52}
              segmentOpacity={0.8}
              segmentStrokeWidth={2.5}
              startFrame={10}
              springDamping={20}
              frame={frame - 60} fps={fps}
            />
            <text x={960} y={470} textAnchor="middle" fill={PARCH} fontSize={28} fontFamily="Georgia, serif" fontWeight="bold">
              6%
            </text>
            <text x={960} y={500} textAnchor="middle" fill={PARCH_DIM} fontSize={16} fontFamily="Georgia, serif" fontStyle="italic">
              pour les planteurs
            </text>
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
            <CounterEncre
              x={960} y={420}
              target={2200}
              variant="display"
              label="dollars par tonne de cacao"
              note="Le planteur en recoit moins de 130$"
              formatValue={(v) => v.toLocaleString("fr-FR")}
              startFrame={15}
              frame={frame - 120} fps={fps}
            />
            <text x={960} y={1040} textAnchor="middle" fill={PARCH_DIM} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic" opacity={0.5}>
              Source : Bourse de Londres, 2024
            </text>
          </g>
        )}

      </svg>
    </AbsoluteFill>
  );
};
