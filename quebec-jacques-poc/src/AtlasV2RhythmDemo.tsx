// Rhythm Demo - test rythme visuel rapide type Johnny Harris / Vox
// Memes composants, springs serres, beats camera par snap plutot que drift lent
// NO AUDIO - visuel seulement pour comparaison rythme
// 25s @ 30fps = 750 frames
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasGlobe,
  AtlasMercator,
  AtlasEmpire,
  AtlasSubtleStars,
  AtlasCartouche,
  AtlasPulseMarker,
  AtlasLabel,
  atlasV2Data as data,
} from "./atlas-v2-components";
import { AtlasFlagDefs } from "./atlas-v2-flags";
import { AtlasSharedDefs } from "./atlas-v2-shared-defs";
import { getFlagFill } from "./atlas-v2-flags";

const FPS = 30;
const snap = (s: number) => Math.round(s * FPS);

// === BEAT PLAN (25s total) ===
// [0-1s]   Hook : globe + titre pop
// [1-4s]   S1 snap : globe -> mercator en 0.2s, Mali snap, Empire reveal snap
// [4-5s]   Cartouche "PLUS GRAND QUE L'EUROPE" pop
// [5-8s]   S2 : zoom Tombouctou snap, cartouche bibliotheques pop
// [8-9s]   Cartouche "25 000 ETUDIANTS" punch
// [9-14s]  S3 : caravane route Mali->Mecque, 3 cartouches stats en rafale
// [14-17s] S4 : snap vers Caire, tilt, glow rouge, cartouche "S'EFFONDRE" punch
// [17-21s] S4 cont : "UN SEUL HOMME." cartouche dramatique
// [21-25s] CTA : globe retour + titre final

const BEATS = {
  globeStart:    snap(0),
  titreHook:     snap(0.3),
  crossfadeSnap: snap(1.0),
  maliSnap:      snap(1.3),
  empireSnap:    snap(2.2),
  cartGrand:     snap(4.0),
  tomboSnap:     snap(5.0),
  cartBiblio:    snap(5.8),
  cartSankore:   snap(8.0),
  s3Start:       snap(9.0),
  cartDouze:     snap(9.5),
  cartHommes:    snap(11.0),
  cartChameaux:  snap(12.5),
  caireSnap:     snap(14.0),
  cartEffondre:  snap(15.0),
  cartUnSeul:    snap(17.5),
  ctaStart:      snap(21.0),
  ctaTitre:      snap(21.5),
  end:           snap(25.0),
} as const;

export const ATLAS_V2_RHYTHM_DEMO_DURATION = BEATS.end;

// === Snap spring config (rapide et net) ===
const SNAP_CONFIG = { damping: 80, stiffness: 400 };
// === Punch spring config (cartouche pop) ===
const PUNCH_CONFIG = { damping: 12, stiffness: 500 };

const RhythmScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // =============================================
  // PHASE : quelle scene est active
  // =============================================
  const inHook   = frame < BEATS.crossfadeSnap;
  const inS1     = frame >= BEATS.crossfadeSnap && frame < BEATS.s3Start;
  const inS3     = frame >= BEATS.s3Start && frame < BEATS.caireSnap;
  const inS4     = frame >= BEATS.caireSnap && frame < BEATS.ctaStart;
  const inCTA    = frame >= BEATS.ctaStart;

  // =============================================
  // CAMERA SNAP vers Mali (S1)
  // =============================================
  const maliSnapT = spring({ frame: frame - BEATS.maliSnap, fps, config: SNAP_CONFIG });
  const mercScaleS1 = 1.0 + 0.35 * maliSnapT;
  const mercOffsetXS1 = -50 * maliSnapT;
  const mercOffsetYS1 = 80 * maliSnapT;

  // CAMERA SNAP vers Tombouctou (S2)
  const tombouctou = data.mercWide.cities.Tombouctou as [number, number];
  const tomboOffX = (tombouctou[0] - 360) * 0.65;
  const tomboOffY = (tombouctou[1] - 640) * 0.65;
  const tomboSnapT = spring({ frame: frame - BEATS.tomboSnap, fps, config: SNAP_CONFIG });
  const mercScaleS2 = mercScaleS1 + 0.25 * tomboSnapT;
  const mercOffsetXS2 = mercOffsetXS1 + tomboOffX * tomboSnapT;
  const mercOffsetYS2 = mercOffsetYS1 + tomboOffY * tomboSnapT;

  // CAMERA SNAP vers Caire (S4)
  const caire = data.mercWide.cities.LeCaire as [number, number];
  const caireOffX = (caire[0] - 360) * 0.8;
  const caireOffY = (caire[1] - 640) * 0.8;
  const caireSnapT = spring({ frame: frame - BEATS.caireSnap, fps, config: SNAP_CONFIG });
  const mercScaleS4 = 1.35 + 0.2 * caireSnapT;
  const mercOffsetXS4 = caireOffX * caireSnapT;
  const mercOffsetYS4 = caireOffY * caireSnapT;

  // CTA : retour global
  const ctaSnapT = spring({ frame: frame - BEATS.ctaStart, fps, config: SNAP_CONFIG });
  const mercScaleCTA = mercScaleS4 * (1 - ctaSnapT) + 1.0 * ctaSnapT;

  // === Scale et offset finaux selon phase ===
  const camScale = inHook ? 1.0
    : inS1 && frame < BEATS.tomboSnap ? mercScaleS1
    : inS1 ? mercScaleS2
    : inS3 ? mercScaleS2 + 0.08
    : inS4 ? mercScaleS4
    : mercScaleCTA;

  const camOffX = inHook ? 0
    : inS1 && frame < BEATS.tomboSnap ? mercOffsetXS1
    : inS1 ? mercOffsetXS2
    : inS3 ? mercOffsetXS2
    : inS4 ? mercOffsetXS4
    : 0;

  const camOffY = inHook ? 0
    : inS1 && frame < BEATS.tomboSnap ? mercOffsetYS1
    : inS1 ? mercOffsetYS2
    : inS3 ? mercOffsetYS2
    : inS4 ? mercOffsetYS4
    : 0;

  // Micro-drift (reduit vs original)
  const driftX = Math.sin(frame * 0.014) * 4;
  const driftY = Math.cos(frame * 0.011) * 3;

  // Tilt S4 (effondrement Egypte)
  const tiltDeg = interpolate(
    frame,
    [BEATS.cartEffondre, BEATS.cartEffondre + fps * 0.5],
    [0, 10],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bump scale sur chaque cartouche stat (S3)
  const bump = (beatFrame: number) => {
    const t = spring({ frame: frame - beatFrame, fps, config: PUNCH_CONFIG });
    return 1 + 0.04 * Math.sin(t * Math.PI);
  };
  const bumpScale = (inS3 || inS4)
    ? bump(BEATS.cartDouze) * bump(BEATS.cartHommes) * bump(BEATS.cartChameaux)
    : 1;

  // Glow rouge Egypte (S4)
  const egyptGlow = inS4
    ? interpolate(frame, [BEATS.cartEffondre, BEATS.cartEffondre + fps * 0.5], [0, 0.7], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      }) * (0.5 + 0.5 * Math.abs(Math.sin(frame * 0.12)))
    : 0;

  // Mali fade sur "UN SEUL HOMME" (S4 late)
  const maliFadeOut = interpolate(
    frame,
    [BEATS.cartUnSeul, BEATS.cartUnSeul + fps * 0.8],
    [1, 0.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Globe opacity (Hook et CTA)
  const globeOpacityHook = interpolate(
    frame,
    [BEATS.crossfadeSnap - 9, BEATS.crossfadeSnap],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const globeOpacityCTA = inCTA
    ? interpolate(frame, [BEATS.ctaStart, BEATS.ctaStart + 9], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      })
    : 0;
  const globeOpacity = Math.max(globeOpacityHook, globeOpacityCTA);

  const mercOpacity = interpolate(
    frame,
    [BEATS.crossfadeSnap - 6, BEATS.crossfadeSnap + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const egypt = data.mercWide.countries.find((c) => c.iso === "EGY");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI" && c.iso !== "EGY");

  return (
    <>
      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.6} />

      {/* GLOBE LAYER */}
      {globeOpacity > 0.01 && (
        <g opacity={globeOpacity}>
          <AtlasGlobe
            countries={data.ortho.countries}
            rotation={interpolate(frame, [0, BEATS.end], [0, 30], { extrapolateRight: "clamp" })}
            scale={1.15}
            showHalo={true}
          />
        </g>
      )}

      {/* MERCATOR LAYER */}
      {mercOpacity > 0.01 && (
        <g opacity={mercOpacity}>
          <g
            transform={`translate(${360 + driftX - camOffX} ${640 + driftY - camOffY}) rotate(${tiltDeg}) scale(${camScale * bumpScale}) translate(${-360} ${-640})`}
          >
            {/* Autres pays */}
            <AtlasMercator countries={otherCountries} />

            {/* Mali */}
            {mali && (
              <g opacity={maliFadeOut}>
                <path
                  d={mali.d}
                  fill="none"
                  stroke={ATLAS_COLORS.haloGold}
                  strokeWidth="14"
                  opacity={0.2}
                />
                <path
                  d={mali.d}
                  fill={getFlagFill("MLI", ATLAS_COLORS.maliFill)}
                  stroke={ATLAS_COLORS.empireOutlineDark}
                  strokeWidth="2.5"
                />
              </g>
            )}

            {/* Egypte (visible S3+S4) */}
            {(inS3 || inS4) && egypt && (
              <g>
                <path
                  d={egypt.d}
                  fill={inS4 ? getFlagFill("EGY", ATLAS_COLORS.egyptFill) : ATLAS_COLORS.egyptFill}
                  stroke={ATLAS_COLORS.empireOutlineDark}
                  strokeWidth="2"
                />
                {inS4 && (
                  <path
                    d={egypt.d}
                    fill="none"
                    stroke="#DA0000"
                    strokeWidth="6"
                    opacity={egyptGlow}
                  />
                )}
              </g>
            )}

            {/* Empire 1300 (S1+) */}
            {frame >= BEATS.empireSnap && data.mercWide.maliEmpire1300 && (
              <g
                opacity={spring({ frame: frame - BEATS.empireSnap, fps, config: SNAP_CONFIG })}
              >
                <AtlasEmpire
                  pathD={data.mercWide.maliEmpire1300}
                  outlineDark={true}
                  hatchOpacity={0.6}
                />
              </g>
            )}

            {/* Pulse markers */}
            {frame >= BEATS.maliSnap && (
              <AtlasPulseMarker
                coord={data.mercWide.cities.Niani as [number, number]}
                beatStart={BEATS.maliSnap}
                color={ATLAS_COLORS.empireGold}
              />
            )}
            {frame >= BEATS.tomboSnap && (
              <AtlasPulseMarker
                coord={tombouctou}
                beatStart={BEATS.tomboSnap}
                color={ATLAS_COLORS.empireGold}
              />
            )}
            {frame >= BEATS.caireSnap && (
              <AtlasPulseMarker
                coord={caire}
                beatStart={BEATS.caireSnap}
                color={ATLAS_COLORS.empireGold}
              />
            )}

            {/* Labels */}
            {frame >= BEATS.maliSnap + 5 && (
              <AtlasLabel
                coord={data.mercWide.cities.Niani as [number, number]}
                text="MALI"
                appearAt={BEATS.maliSnap + 5}
                offsetY={-28}
              />
            )}
            {frame >= BEATS.tomboSnap + 5 && (
              <AtlasLabel
                coord={tombouctou}
                text="TOMBOUCTOU"
                appearAt={BEATS.tomboSnap + 5}
                offsetY={-28}
              />
            )}
            {frame >= BEATS.caireSnap + 5 && (
              <AtlasLabel
                coord={caire}
                text="LE CAIRE"
                appearAt={BEATS.caireSnap + 5}
                offsetY={-28}
              />
            )}
          </g>
        </g>
      )}

      {/* === CARTOUCHES === */}

      {/* Hook titre */}
      <AtlasCartouche
        appearAt={BEATS.titreHook}
        disappearAt={BEATS.crossfadeSnap}
        text="L'HOMME LE PLUS RICHE"
        subtext="DE L'HISTOIRE"
        x={360}
        y={640}
        fontSize={38}
      />

      {/* S1 : PLUS GRAND QUE L'EUROPE */}
      <AtlasCartouche
        appearAt={BEATS.cartGrand}
        disappearAt={BEATS.tomboSnap}
        text="PLUS GRAND"
        subtext="QUE L'EUROPE OCCIDENTALE"
        x={360}
        y={1080}
        fontSize={38}
      />

      {/* S2 : BIBLIOTHEQUES */}
      <AtlasCartouche
        appearAt={BEATS.cartBiblio}
        disappearAt={BEATS.cartSankore}
        text="+ DE BIBLIOTHEQUES"
        subtext="QUE PARIS"
        x={360}
        y={140}
        fontSize={28}
      />

      {/* S2 : SANKORE */}
      <AtlasCartouche
        appearAt={BEATS.cartSankore}
        disappearAt={BEATS.s3Start}
        text="UNIVERSITE DE SANKORE"
        subtext="25 000 ETUDIANTS"
        x={360}
        y={1080}
        fontSize={26}
      />

      {/* S3 stats en rafale */}
      <AtlasCartouche
        appearAt={BEATS.cartDouze}
        disappearAt={BEATS.cartHommes}
        text="DOUZE ANS"
        subtext="APRES SON COURONNEMENT"
        x={360}
        y={1080}
        fontSize={36}
      />
      <AtlasCartouche
        appearAt={BEATS.cartHommes}
        disappearAt={BEATS.cartChameaux}
        text="60 000 HOMMES"
        subtext="12 000 ESCLAVES"
        x={360}
        y={1080}
        fontSize={40}
      />
      <AtlasCartouche
        appearAt={BEATS.cartChameaux}
        disappearAt={BEATS.caireSnap}
        text="80 CHAMEAUX"
        subtext="150 KG D'OR CHACUN"
        x={360}
        y={1080}
        fontSize={40}
      />

      {/* S4 */}
      <AtlasCartouche
        appearAt={BEATS.cartEffondre}
        disappearAt={BEATS.cartUnSeul}
        text="L'ECONOMIE EGYPTIENNE"
        subtext="S'EFFONDRE"
        x={360}
        y={1080}
        fontSize={34}
      />
      <AtlasCartouche
        appearAt={BEATS.cartUnSeul}
        disappearAt={BEATS.ctaStart}
        text="UN SEUL HOMME."
        subtext="UN CONTINENT QUI S'EFFONDRE."
        x={360}
        y={1080}
        fontSize={36}
      />

      {/* CTA */}
      <AtlasCartouche
        appearAt={BEATS.ctaTitre}
        disappearAt={BEATS.end}
        text="MANSA MOUSSA"
        subtext="L'HOMME QUE L'HISTOIRE A OUBLIE"
        x={360}
        y={640}
        fontSize={40}
      />

      {/* Vignette */}
      <rect
        x="0"
        y="0"
        width="720"
        height="1280"
        fill="url(#vignette)"
        pointerEvents="none"
      />
    </>
  );
};

export const AtlasV2RhythmDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgBottom }}>
      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <AtlasSharedDefs />
        <AtlasFlagDefs mode="official" bandWidth={14} />
        <RhythmScene />
      </svg>
    </AbsoluteFill>
  );
};
