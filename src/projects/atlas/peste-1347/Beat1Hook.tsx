import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AtlasEmpire, AtlasMercator } from "../_shared/atlas-components";
import pesteData from "../../../../public/atlas/peste-1347/geo/peste-map-data.json";
import { BEATS } from "./timing";

// ─── PALETTE ────────────────────────────────────────────────────────────────

const OCEAN = "#1a2744";
const MALI_GOLD = "#c8960c";
const PUNCHLINE_YELLOW = "#f0c040";
const TEXT_MUTED = "#c4a882";

const ISO_EUROPE = new Set([
  "GBR", "IRL", "FRA", "ESP", "PRT", "ITA", "CHE", "AUT", "DEU", "BEL",
  "NLD", "DNK", "SWE", "NOR", "POL", "CZE", "HUN", "ROU", "BGR", "HRV",
  "SRB", "GRC", "SVN", "UKR", "TUR", "FIN", "EST", "LVA", "LTU", "SVK",
  "MDA", "BLR", "RUS",
]);

const ISO_MALI_ZONE = new Set([
  "MLI", "SEN", "GMB", "GNB", "GIN", "BFA", "NER", "MRT",
]);

// ─── COMPOSANT ──────────────────────────────────────────────────────────────

export const Beat1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const data = pesteData.mercLarge;
  const W = pesteData.width;
  const H = pesteData.height;

  const beatStart = BEATS.HOOK_START;
  const beatEnd = BEATS.HOOK_END;
  const beatDur = beatEnd - beatStart;
  const localF = frame;

  // ── Fade in carte (0→30f)
  const mapOpacity = interpolate(localF, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Drift caméra — respiration lente
  const driftX = interpolate(localF, [0, beatDur], [0, -18], {
    extrapolateRight: "clamp",
  });
  const driftY = interpolate(localF, [0, beatDur], [0, -8], {
    extrapolateRight: "clamp",
  });
  const camScale = interpolate(localF, [0, beatDur], [1.0, 1.07], {
    extrapolateRight: "clamp",
  });

  // ── Europe : ease-in pour effet "catastrophe qui s'accélère" (f90→f160)
  const europeRevealRaw = interpolate(localF, [90, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const europeReveal = Easing.in(Easing.quad)(europeRevealRaw);

  const lerpColor = (t: number) => {
    const r1 = 0xc4, g1 = 0xa8, b1 = 0x82; // sable neutre
    const r2 = 0x6e, g2 = 0x2b, b2 = 0x18; // crimson
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r},${g},${b})`;
  };
  const europeColor = lerpColor(europeReveal);

  const statOpacity = interpolate(localF, [100, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Mali : invisible jusqu'à f175, apparaît avec la punchline
  const maliReveal = interpolate(localF, [175, 200], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const maliPulseStart = 180;
  const maliPulse = interpolate(
    localF,
    [maliPulseStart, maliPulseStart + 15, maliPulseStart + 30, maliPulseStart + 45],
    [0, 1, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Étiquette titre — or + fontSize 16 pour hiérarchie claire (Kimi fix)
  const labelOpacity = interpolate(localF, [15, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Punchline finale — fade in f175→f210
  const punchlineOpacity = interpolate(localF, [175, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── highlightFills dynamiques
  const highlightFills: Record<string, string> = {};
  ISO_EUROPE.forEach((iso) => { highlightFills[iso] = europeColor; });
  ISO_MALI_ZONE.forEach((iso) => { highlightFills[iso] = MALI_GOLD; });

  const STAT_X = W / 2;
  const STAT_Y = H * 0.31;

  return (
    <AbsoluteFill style={{ backgroundColor: OCEAN }}>
      <Audio
        src={staticFile("atlas/peste-1347/audio/narration-v1.mp3")}
        startFrom={beatStart}
        trimAfter={beatStart + beatDur}
        volume={1}
      />
      {/* Musique retirée des beats : posée en 1 piste continue au concat final
          (évite les coupures/raccords entre beats). */}

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ opacity: mapOpacity }}
      >
        <rect x={0} y={0} width={W} height={H} fill={OCEAN} />

        <AtlasMercator
          countries={data.countries}
          highlightFills={highlightFills}
          driftX={driftX}
          driftY={driftY}
          scale={camScale}
          width={W}
          height={H}
        />

        {/* Empire Mali — invisible jusqu'à la punchline */}
        {data.maliEmpire1300 && maliReveal > 0 && (
          <g opacity={maliReveal + maliPulse * 0.3}>
            <AtlasEmpire
              pathD={data.maliEmpire1300}
              outlineDark={false}
              hatchOpacity={0.4}
            />
          </g>
        )}

        {/* Étiquette titre — or, fontSize 16, dominant dès f15 (Kimi fix hiérarchie) */}
        <text
          x={W / 2}
          y={H * 0.07}
          textAnchor="middle"
          fill={MALI_GOLD}
          fillOpacity={labelOpacity}
          fontSize={16}
          fontFamily="Georgia, 'Times New Roman', serif"
          letterSpacing={3}
        >
          LA PESTE NOIRE · 1347
        </text>

        {/* Stat Europe — rect derrière + blanc pur (Kimi fix contraste) */}
        <g opacity={statOpacity}>
          {/* Fond semi-transparent pour détacher du fond carte */}
          <rect
            x={STAT_X - 110}
            y={STAT_Y - 36}
            width={220}
            height={58}
            rx={4}
            fill="#000000"
            fillOpacity={0.32}
          />
          {/* Ombre texte stat */}
          <text
            x={STAT_X + 1}
            y={STAT_Y + 1}
            textAnchor="middle"
            fill="#000000"
            fillOpacity={0.5}
            fontSize={34}
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="bold"
            letterSpacing={1}
          >
            − 50 %
          </text>
          {/* Stat blanc pur (Kimi fix contraste) */}
          <text
            x={STAT_X}
            y={STAT_Y}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={34}
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="bold"
            letterSpacing={1}
          >
            − 50 %
          </text>
          {/* Sous-label */}
          <text
            x={STAT_X}
            y={STAT_Y + 22}
            textAnchor="middle"
            fill={TEXT_MUTED}
            fontSize={13}
            fontFamily="Georgia, 'Times New Roman', serif"
            letterSpacing={2}
          >
            de la population européenne
          </text>
        </g>

        {/* Punchline finale — jaune vif distinct du Mali or */}
        <text
          x={W / 2}
          y={H * 0.88}
          textAnchor="middle"
          fill={PUNCHLINE_YELLOW}
          fillOpacity={punchlineOpacity}
          fontSize={18}
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic"
        >
          L&apos;Afrique subsaharienne, elle, continue.
        </text>
      </svg>
    </AbsoluteFill>
  );
};
