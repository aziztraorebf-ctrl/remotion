// Atlas V2 Visual Vocabulary Demo (30s).
// 7 segments to lock down the visual language BEFORE Phase 3 batch production:
//   1) 0-4s   Drapeau hachure officiel multi-couleurs (vertical/horizontal selon pays)
//   2) 4-8s   Drapeau hachure subtil (opacity 0.5 sur fond terracotta)
//   3) 8-12s  Highlight progressif region (West Africa cascade)
//   4) 12-16s Halo lumineux pays (focus Mali drapeau plein + glow doree)
//   5) 16-20s Rotation 30deg + drapeaux subtle (combine mouvement + pattern)
//   6) 20-24s Mini-flags rectangulaires sur capitales (style infographie pro)
//   7) 24-30s Combo final (subtle + rotation + halo + mini-flags)
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasDefs,
  AtlasSubtleStars,
  atlasV2Data as data,
} from "./atlas-v2-components";
import {
  AtlasFlagDefs,
  AtlasMiniFlag,
  AFRICAN_FLAGS,
  getFlagFill,
} from "./atlas-v2-flags";

const FPS = 30;

// Segment boundaries in seconds
const SEG = {
  s1: 0,
  s2: 4,
  s3: 8,
  s4: 12,
  s5: 16,
  s6: 20,
  s7: 24,
  end: 30,
};

const f = (s: number) => s * FPS;

// West Africa countries for cascade highlight (segment 3)
const WEST_AFRICA = ["MLI", "SEN", "GIN", "CIV", "BFA", "GHA", "NGA", "NER", "TCD"];

const CountryLayer: React.FC<{
  countries: { iso: string; d: string }[];
  fillFn: (iso: string) => string;
  opacity?: number;
}> = ({ countries, fillFn, opacity = 1 }) => (
  <g opacity={opacity}>
    {countries.map((c) => (
      <path
        key={c.iso}
        d={c.d}
        fill={fillFn(c.iso)}
        stroke={ATLAS_COLORS.landStroke}
        strokeWidth="0.6"
        strokeOpacity="0.7"
      />
    ))}
  </g>
);

export const AtlasV2VocabDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous micro-drift (validated)
  const driftX = Math.sin(frame * 0.014) * 8;
  const driftY = Math.cos(frame * 0.011) * 5;

  // === Segment phase detection ===
  const t = frame / FPS;
  const inSeg = (start: number, end: number) => t >= start && t < end;

  // === Per-segment visibility (with crossfade buffer 0.5s) ===
  const fadeBuf = 0.5;
  const segOpacity = (start: number, end: number): number => {
    const fadeIn = interpolate(t, [start - fadeBuf, start], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(t, [end - fadeBuf, end], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return Math.min(fadeIn, fadeOut);
  };

  // === Camera moves ===
  // Segment 5: rotation 30deg
  const seg5Rotation = interpolate(t, [SEG.s5, SEG.s5 + 2, SEG.s6 - 0.5, SEG.s6], [0, 30, 30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Segment 7 combo : slow rotation + zoom
  const seg7Rotation = interpolate(t, [SEG.s7, SEG.s7 + 3, SEG.end - 1, SEG.end], [0, 15, 15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const seg7Scale = interpolate(t, [SEG.s7, SEG.s7 + 3, SEG.end], [1.0, 1.15, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotation = inSeg(SEG.s5, SEG.s6)
    ? seg5Rotation
    : inSeg(SEG.s7, SEG.end)
      ? seg7Rotation
      : 0;
  const scale = inSeg(SEG.s7, SEG.end) ? seg7Scale : 1;

  // === Segment 3 cascade timing ===
  const cascadePhase = (iso: string): number => {
    const idx = WEST_AFRICA.indexOf(iso);
    if (idx < 0) return 0;
    const cascadeStart = SEG.s3 + idx * 0.35;
    return interpolate(t, [cascadeStart, cascadeStart + 0.5], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  // === Fill functions per segment ===
  const fillTerracotta = (iso: string) => ATLAS_COLORS.land;
  const fillFlagOfficial = (iso: string) => getFlagFill(iso, ATLAS_COLORS.land);
  const fillFlagSubtle = (iso: string) =>
    AFRICAN_FLAGS[iso] ? `url(#flag-${iso})` : ATLAS_COLORS.land;

  // === Country group transform ===
  const cx = 360;
  const cy = 640;
  const transform = `translate(${cx + driftX} ${cy + driftY}) rotate(${rotation}) scale(${scale}) translate(${-cx} ${-cy})`;

  // === Mini-flag positions (mercWide projection cities) ===
  const miniFlagCapitals: { iso: string; key: keyof typeof data.mercWide.cities }[] = [
    { iso: "MLI", key: "Bamako" as never },
    { iso: "SEN", key: "Dakar" as never },
    { iso: "GIN", key: "Conakry" as never },
    { iso: "CIV", key: "Yamoussoukro" as never },
    { iso: "GHA", key: "Accra" as never },
    { iso: "NGA", key: "Abuja" as never },
    { iso: "ETH", key: "AddisAbeba" as never },
    { iso: "TCD", key: "NDjamena" as never },
    { iso: "NER", key: "Niamey" as never },
    { iso: "BFA", key: "Ouagadougou" as never },
    { iso: "CMR", key: "Yaounde" as never },
    { iso: "DZA", key: "Alger" as never },
    { iso: "TUN", key: "Tunis" as never },
    { iso: "LBY", key: "Tripoli" as never },
    { iso: "MAR", key: "Rabat" as never },
    { iso: "EGY", key: "LeCaire" as never },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgBottom }}>
      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <AtlasDefs />
        <AtlasFlagDefs mode="official" bandWidth={14} />
        <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
        <AtlasSubtleStars opacity={0.6} />

        {/* Common base ocean */}
        <g transform={transform}>
          <rect
            x="-300"
            y="-300"
            width="1320"
            height="1880"
            fill={ATLAS_COLORS.oceanDeep}
          />

          {/* Segment 1: Drapeau hachure officiel multi-couleurs (full opacity) */}
          {inSeg(SEG.s1 - 0.5, SEG.s2 + 0.5) && (
            <CountryLayer
              countries={data.mercWide.countries}
              fillFn={fillFlagOfficial}
              opacity={segOpacity(SEG.s1, SEG.s2)}
            />
          )}

          {/* Segment 2: Drapeau hachure subtil (terracotta base + flag overlay 50%) */}
          {inSeg(SEG.s2 - 0.5, SEG.s3 + 0.5) && (
            <>
              <CountryLayer
                countries={data.mercWide.countries}
                fillFn={fillTerracotta}
                opacity={segOpacity(SEG.s2, SEG.s3)}
              />
              <CountryLayer
                countries={data.mercWide.countries}
                fillFn={fillFlagSubtle}
                opacity={segOpacity(SEG.s2, SEG.s3) * 0.5}
              />
            </>
          )}

          {/* Segment 3: Cascade West Africa (terracotta base + per-country fade-in) */}
          {inSeg(SEG.s3 - 0.5, SEG.s4 + 0.5) && (
            <g opacity={segOpacity(SEG.s3, SEG.s4)}>
              <CountryLayer
                countries={data.mercWide.countries}
                fillFn={fillTerracotta}
              />
              {data.mercWide.countries
                .filter((c) => WEST_AFRICA.includes(c.iso))
                .map((c) => (
                  <path
                    key={`cascade-${c.iso}`}
                    d={c.d}
                    fill={getFlagFill(c.iso, ATLAS_COLORS.land)}
                    opacity={cascadePhase(c.iso)}
                    stroke={ATLAS_COLORS.landStroke}
                    strokeWidth="0.6"
                    strokeOpacity="0.7"
                  />
                ))}
            </g>
          )}

          {/* Segment 4: Halo Mali drapeau plein + glow doree, reste terracotta sombre */}
          {inSeg(SEG.s4 - 0.5, SEG.s5 + 0.5) && (
            <g opacity={segOpacity(SEG.s4, SEG.s5)}>
              <CountryLayer
                countries={data.mercWide.countries.filter((c) => c.iso !== "MLI")}
                fillFn={() => "#7A4530"}
                opacity={0.85}
              />
              {/* Mali halo glow */}
              {data.mercWide.countries
                .filter((c) => c.iso === "MLI")
                .map((c) => (
                  <g key={`mali-halo-${c.iso}`}>
                    <path
                      d={c.d}
                      fill="none"
                      stroke={ATLAS_COLORS.haloGold}
                      strokeWidth="14"
                      opacity="0.35"
                    />
                    <path
                      d={c.d}
                      fill="none"
                      stroke={ATLAS_COLORS.haloGold}
                      strokeWidth="6"
                      opacity="0.65"
                    />
                    <path
                      d={c.d}
                      fill={getFlagFill("MLI", ATLAS_COLORS.land)}
                      stroke={ATLAS_COLORS.empireOutlineDark}
                      strokeWidth="2"
                    />
                  </g>
                ))}
            </g>
          )}

          {/* Segment 5: Rotation + drapeaux subtle */}
          {inSeg(SEG.s5 - 0.5, SEG.s6 + 0.5) && (
            <>
              <CountryLayer
                countries={data.mercWide.countries}
                fillFn={fillTerracotta}
                opacity={segOpacity(SEG.s5, SEG.s6)}
              />
              <CountryLayer
                countries={data.mercWide.countries}
                fillFn={fillFlagSubtle}
                opacity={segOpacity(SEG.s5, SEG.s6) * 0.4}
              />
            </>
          )}

          {/* Segment 6: terracotta base + mini-flags overlay */}
          {inSeg(SEG.s6 - 0.5, SEG.s7 + 0.5) && (
            <CountryLayer
              countries={data.mercWide.countries}
              fillFn={fillTerracotta}
              opacity={segOpacity(SEG.s6, SEG.s7)}
            />
          )}

          {/* Segment 7: Combo final (subtle drapeaux + Mali glow + mini-flags via outer layer) */}
          {inSeg(SEG.s7 - 0.5, SEG.end + 0.5) && (
            <>
              <CountryLayer
                countries={data.mercWide.countries}
                fillFn={fillTerracotta}
                opacity={segOpacity(SEG.s7, SEG.end)}
              />
              <CountryLayer
                countries={data.mercWide.countries}
                fillFn={fillFlagSubtle}
                opacity={segOpacity(SEG.s7, SEG.end) * 0.35}
              />
              {/* Mali halo for combo */}
              {data.mercWide.countries
                .filter((c) => c.iso === "MLI")
                .map((c) => (
                  <g key={`mali-glow-combo-${c.iso}`}>
                    <path
                      d={c.d}
                      fill="none"
                      stroke={ATLAS_COLORS.haloGold}
                      strokeWidth="10"
                      opacity={segOpacity(SEG.s7, SEG.end) * 0.4}
                    />
                    <path
                      d={c.d}
                      fill={getFlagFill("MLI", ATLAS_COLORS.land)}
                      stroke={ATLAS_COLORS.empireOutlineDark}
                      strokeWidth="1.5"
                      opacity={segOpacity(SEG.s7, SEG.end)}
                    />
                  </g>
                ))}
            </>
          )}
        </g>

        {/* === MINI-FLAGS overlay (segments 6 + 7) — outside transform to keep upright === */}
        {(inSeg(SEG.s6 - 0.5, SEG.s7 + 0.5) || inSeg(SEG.s7 - 0.5, SEG.end + 0.5)) && (
          <g
            opacity={
              inSeg(SEG.s6, SEG.s7)
                ? segOpacity(SEG.s6, SEG.s7)
                : segOpacity(SEG.s7, SEG.end)
            }
          >
            {miniFlagCapitals.map((mf, i) => {
              const cityCoord = (data.mercWide.cities as unknown as Record<string, [number, number]>)[
                mf.key as string
              ];
              if (!cityCoord) return null;
              // Apply same transform as countries (so flags follow the rotation/zoom)
              const [rawX, rawY] = cityCoord;
              // Convert through rotation transform manually
              const rad = (rotation * Math.PI) / 180;
              const dx = rawX - cx;
              const dy = rawY - cy;
              const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
              const ry = dx * Math.sin(rad) + dy * Math.cos(rad);
              const finalX = cx + driftX + rx * scale;
              const finalY = cy + driftY + ry * scale;

              // Stagger appearance during segment 6
              const stagger = inSeg(SEG.s6, SEG.s7)
                ? interpolate(
                    t,
                    [SEG.s6 + i * 0.1, SEG.s6 + i * 0.1 + 0.3],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  )
                : 1;

              return (
                <g
                  key={`miniflag-${mf.iso}`}
                  opacity={stagger}
                  transform={`translate(${finalX} ${finalY}) scale(${stagger})`}
                >
                  <AtlasMiniFlag
                    iso={mf.iso}
                    x={0}
                    y={0}
                    width={28}
                    height={18}
                  />
                </g>
              );
            })}
          </g>
        )}

        <rect
          x="0"
          y="0"
          width="720"
          height="1280"
          fill="url(#vignette)"
          pointerEvents="none"
        />

        {/* Phase indicator */}
        <text
          x="20"
          y="40"
          fontFamily="monospace"
          fontSize="18"
          fill={ATLAS_COLORS.cream}
          opacity="0.75"
        >
          {inSeg(SEG.s1, SEG.s2)
            ? "1/7  Drapeau hachure officiel"
            : inSeg(SEG.s2, SEG.s3)
              ? "2/7  Drapeau subtle (filigrane)"
              : inSeg(SEG.s3, SEG.s4)
                ? "3/7  Cascade region West Africa"
                : inSeg(SEG.s4, SEG.s5)
                  ? "4/7  Focus Mali halo doree"
                  : inSeg(SEG.s5, SEG.s6)
                    ? "5/7  Rotation 30deg + drapeaux"
                    : inSeg(SEG.s6, SEG.s7)
                      ? "6/7  Mini-flags capitales"
                      : "7/7  Combo final (16 elements)"}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

export const ATLAS_V2_VOCAB_DEMO_DURATION = FPS * 30;
