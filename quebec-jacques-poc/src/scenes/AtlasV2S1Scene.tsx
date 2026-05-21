// S1 Setup Scene (4-19s) - "Mali. Empire du Mali. Plus grand que..."
// V2 FINITION : rythme rapide (stiffness:400) + tilt skewX + crossfade 6 frames
// Pattern reference : AtlasV2RhythmTiltDemo.tsx
import {
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasGlobe,
  AtlasEmpire,
  AtlasSubtleStars,
  AtlasCartouche,
  atlasV2Data as data,
} from "../atlas-v2-components";
import { getFlagFill } from "../atlas-v2-flags";

interface S1SceneProps {
  startFrame: number;
  endFrame: number;
}

const SNAP_CONFIG = { damping: 80, stiffness: 400 };

export const AtlasV2S1Scene: React.FC<S1SceneProps> = ({ startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || frame >= endFrame) return null;

  // === Crossfade rapide globe -> mercator (6 frames = 0.2s) ===
  const crossfadeSnap = 6;
  const globeOpacity = interpolate(
    localFrame,
    [0, crossfadeSnap],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const mercOpacity = interpolate(
    localFrame,
    [0, crossfadeSnap],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === Globe rotation finale (continues from hook, very brief) ===
  const globeRotation = interpolate(
    localFrame,
    [0, crossfadeSnap],
    [5, 8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === BEATS LOCAUX (relatifs a S1 start) ===
  // S1 dure ~15s. Beats principaux :
  //   maliSnap : juste apres crossfade (0.3s)
  //   empireSnap : sur "empire spread" narration (~7.2s relatif)
  //   secretReveal : ~11.7s relatif (pulse halo)
  //   cartoucheGrandAt : ~7s (PLUS GRAND QUE L'EUROPE)
  const maliSnapFrame = Math.round(0.3 * fps);
  const empireRevealFrame = Math.round(7.2 * fps);
  const secretAtFrame = Math.round(5.0 * fps);
  const cartoucheGrandAt = Math.round(7.0 * fps);
  const sceneDuration = endFrame - startFrame;


  // === CAMERA SNAP MALI ===
  const maliSnapT = spring({
    frame: localFrame - maliSnapFrame,
    fps,
    config: SNAP_CONFIG,
  });

  // === Ken Burns drift plus marque (8-10px au lieu de 3px) ===
  const driftX = Math.sin(frame * 0.014) * 10;
  const driftY = Math.cos(frame * 0.011) * 7;

  // === Parallax foreground drift (Mali + Empire bougent un peu plus) ===
  const fgDriftX = Math.sin(frame * 0.014) * 13;
  const fgDriftY = Math.cos(frame * 0.011) * 9;
  const parallaxX = fgDriftX - driftX;
  const parallaxY = fgDriftY - driftY;

  // Camera offset cible : centre vers Mali (-50, +80) snap
  const camOffX = -50 * maliSnapT;
  const camOffY = 80 * maliSnapT;

  // Slow continuous push-in TRES leger pour montrer tout le pointille Empire
  const pushInStart = maliSnapFrame + Math.round(fps * 0.8);
  const slowPushIn = interpolate(
    localFrame,
    [pushInStart, sceneDuration],
    [0, 0.05],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camScale = 1.0 + 0.25 * maliSnapT + slowPushIn;

  // === TILT (skewX + scaleY) avec respiration ===
  // Peak 20deg, rampe in 0.8s, puis oscillation +/-2deg pour effet "respire"
  const tiltRampIn = interpolate(
    localFrame,
    [maliSnapFrame, maliSnapFrame + Math.round(fps * 0.8)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tiltStrength = tiltRampIn;
  const tiltPeak = 20;
  const tiltBreath = Math.sin(localFrame * 0.04) * 2 * tiltRampIn;
  const tiltDeg = tiltPeak * tiltStrength + tiltBreath;
  const skewX = tiltDeg * 0.15;
  const scaleY = 1 - tiltDeg * 0.008;

  // === EMPIRE 1300 reveal (snap) ===
  const empireT = spring({
    frame: localFrame - empireRevealFrame,
    fps,
    config: SNAP_CONFIG,
  });

  // === SECRET halo pulse — visible mais pas distrayant ===
  const secretGlow = localFrame > secretAtFrame
    ? 0.3 + 0.3 * Math.abs(Math.sin((localFrame - secretAtFrame) * 0.16))
    : 0;

  // === LEGENDE EMPIRE timing ===
  const legendeEmpireAt = Math.round(7.5 * fps);

  // === DATA ===
  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");

  return (
    <>
      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.6} />

      {/* GLOBE LAYER (fades out fast) */}
      {globeOpacity > 0.01 && (
        <g opacity={globeOpacity}>
          <AtlasGlobe
            countries={data.ortho.countries}
            rotation={globeRotation}
            scale={1.15}
            showHalo={true}
          />
        </g>
      )}

      {/* MERCATOR LAYER (fades in fast + tilt + camera snap) */}
      {mercOpacity > 0.01 && (
        <g opacity={mercOpacity}>
          <g
            transform={`
              translate(${360 + driftX - camOffX} ${640 + driftY - camOffY})
              scale(${camScale} ${camScale * scaleY})
              skewX(${skewX})
              translate(${-360} ${-640})
            `}
          >
            {/* Ocean */}
            <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.ocean} />

            {/* Other countries */}
            {otherCountries.map((c) => (
              <path
                key={c.iso}
                d={c.d}
                fill={ATLAS_COLORS.land}
                stroke={ATLAS_COLORS.landStroke}
                strokeWidth="0.8"
                strokeOpacity="0.8"
              />
            ))}

            {/* === FOREGROUND PARALLAX : Mali + Empire bougent un peu plus === */}
            <g transform={`translate(${parallaxX} ${parallaxY})`}>
              {/* Mali drapeau plein */}
              {mali && (
                <path
                  d={mali.d}
                  fill={getFlagFill("MLI", ATLAS_COLORS.maliFill)}
                  stroke={ATLAS_COLORS.empireOutlineDark}
                  strokeWidth="2.5"
                />
              )}

              {/* Halos APRES le drapeau, opacite reduite pour pas distraire */}
              {mali && (
                <>
                  <path
                    d={mali.d}
                    fill="none"
                    stroke={ATLAS_COLORS.haloGold}
                    strokeWidth="20"
                    opacity={0.15 + secretGlow * 0.20}
                  />
                  <path
                    d={mali.d}
                    fill="none"
                    stroke={ATLAS_COLORS.haloGold}
                    strokeWidth="8"
                    opacity={0.30 + secretGlow * 0.25}
                  />
                </>
              )}

              {/* Empire 1300 outline noir mat (reveal snap) */}
              {data.mercWide.maliEmpire1300 && empireT > 0.05 && (
                <g opacity={empireT}>
                  <AtlasEmpire
                    pathD={data.mercWide.maliEmpire1300}
                    outlineDark={true}
                    hatchOpacity={0.65 * empireT}
                  />
                </g>
              )}

            </g>
          </g>
        </g>
      )}

      {/* === LEGENDE EMPIRE 1300 (hors tilt) === */}
      <AtlasEmpireLegend
        appearAt={legendeEmpireAt}
        localFrame={localFrame}
        fps={fps}
      />

      {/* === SFX === */}
      <Sequence from={startFrame + maliSnapFrame}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/A-mali-whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={startFrame + empireRevealFrame}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/B2-empire-reveal.mp3")} volume={0.5} />
      </Sequence>

    </>
  );
};

// ===============================================================
// AtlasEmpireLegend - cartouche specifique pour expliquer le pointille empire
// ===============================================================
const AtlasEmpireLegend: React.FC<{
  appearAt: number;
  localFrame: number;
  fps: number;
}> = ({ appearAt, localFrame, fps }) => {
  if (localFrame < appearAt) return null;
  const t = spring({
    frame: localFrame - appearAt,
    fps,
    config: { damping: 14, stiffness: 200 },
  });
  const scale = interpolate(t, [0, 1], [0.85, 1]);

  return (
    <g
      transform={`translate(360 150) scale(${scale})`}
      opacity={t}
    >
      <rect
        x="-260"
        y="-60"
        width="520"
        height="120"
        fill={ATLAS_COLORS.cream}
        stroke={ATLAS_COLORS.empireOutlineDark}
        strokeWidth="2.5"
        rx="8"
      />
      {/* Pointille echantillon a gauche du texte = lien visuel avec le polygone empire */}
      <rect
        x="-230"
        y="-22"
        width="64"
        height="44"
        fill="none"
        stroke={ATLAS_COLORS.empireOutlineDark}
        strokeWidth="3"
        strokeDasharray="8 4"
        rx="4"
      />
      <text
        x="-150"
        y="-14"
        textAnchor="start"
        fontFamily="Cormorant Garamond, serif"
        fontSize="30"
        fontWeight="700"
        fill={ATLAS_COLORS.textInk}
        letterSpacing="1"
      >
        EMPIRE DU MALI
      </text>
      <text
        x="-150"
        y="14"
        textAnchor="start"
        fontFamily="Cormorant Garamond, serif"
        fontSize="20"
        fontWeight="600"
        fill={ATLAS_COLORS.textInk}
        opacity="0.85"
      >
        au XIVe siecle
      </text>
      <text
        x="-150"
        y="38"
        textAnchor="start"
        fontFamily="Cormorant Garamond, serif"
        fontSize="15"
        fontWeight="500"
        fill={ATLAS_COLORS.textInk}
        opacity="0.65"
        fontStyle="italic"
      >
        (zone pointillee = frontieres historiques)
      </text>
    </g>
  );
};
