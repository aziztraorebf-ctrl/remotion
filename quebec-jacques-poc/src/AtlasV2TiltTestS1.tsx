// Tilt Test S1 — copie exacte de AtlasV2HookS1Test avec tilt/skew du BestVersionDemo
// But : comparer visuellement tilt ON vs tilt OFF a couleurs/mouvements identiques
// 19s @ 30fps (meme duree que HookS1Test valide)
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

// Duree identique a HookS1Test
export const ATLAS_V2_TILT_TEST_S1_DURATION = Math.round(19 * FPS);

// Timings reproduisant exactement le HookS1Test valide
const HOOK_DUR   = Math.round(4 * FPS);   // Hook 4s
const S1_DUR     = Math.round(15 * FPS);  // S1 15s

const TiltTestScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ===================================================================
  // HOOK (0-4s) — globe ortho identique a AtlasV2HookScene
  // ===================================================================
  const hookFrame = frame;
  const globeRotationHook = interpolate(hookFrame, [0, HOOK_DUR], [0, 5], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Titre hook
  const titreHookT = spring({ frame: hookFrame - 9, fps, config: { damping: 14, stiffness: 120 } });
  const cartoucheHookOpacity = frame < HOOK_DUR ? titreHookT : interpolate(frame, [HOOK_DUR - 9, HOOK_DUR + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ===================================================================
  // S1 (4-19s) — Mercator identique a AtlasV2S1Scene
  // ===================================================================
  const localFrame = frame - HOOK_DUR;
  const sceneDuration = S1_DUR;

  const crossfadeStart = fps * 2.0;
  const crossfadeEnd   = fps * 3.5;

  const globeOpacityS1 = interpolate(localFrame, [crossfadeStart, crossfadeEnd], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mercOpacity     = interpolate(localFrame, [crossfadeStart, crossfadeEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const globeRotationS1 = interpolate(localFrame, [0, sceneDuration], [5, 25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globeOpacity = frame < HOOK_DUR ? 1 : globeOpacityS1;
  const globeRotation = frame < HOOK_DUR ? globeRotationHook : globeRotationS1;

  // Camera mercator
  const driftX = Math.sin(frame * 0.014) * 8;
  const driftY = Math.cos(frame * 0.011) * 5;

  const mercScale = interpolate(localFrame, [crossfadeEnd, sceneDuration], [1.0, 1.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mercOffX  = interpolate(localFrame, [crossfadeEnd, sceneDuration], [0, -50],    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mercOffY  = interpolate(localFrame, [crossfadeEnd, sceneDuration], [0, 80],     { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const maliFlagOpacity = mercOpacity;

  const empireRevealAt = fps * 7.0;
  const empireT = spring({ frame: localFrame - empireRevealAt, fps, config: { damping: 16, stiffness: 80 } });

  const secretAt  = fps * 9.5;
  const secretGlow = localFrame > secretAt ? 0.3 + 0.4 * Math.abs(Math.sin((localFrame - secretAt) * 0.18)) : 0;

  const legendeEmpireAt  = fps * 7.5;
  const cartoucheGrandAt = fps * 11.0;

  const mali          = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");

  // ===================================================================
  // TILT — exactement la meme logique que BestVersionDemo
  // Rampe in a partir du maliSnap (fin crossfade S1), rampe out en fin de scene
  // ===================================================================
  const tiltRampStart = HOOK_DUR + crossfadeEnd;
  const tiltRampInEnd = tiltRampStart + FPS * 1.5;
  const sceneEnd      = ATLAS_V2_TILT_TEST_S1_DURATION;

  const tiltRampIn = interpolate(
    frame,
    [tiltRampStart, tiltRampInEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tiltRampOut = interpolate(
    frame,
    [sceneEnd - FPS * 1.5, sceneEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tiltStrength = frame >= tiltRampStart ? Math.min(tiltRampIn, tiltRampOut) : 0;

  const tiltDeg = 20 * tiltStrength;  // meme valeur que BestVersion S1/S2
  const skewX   = tiltDeg * 0.15;
  const scaleY  = 1 - tiltDeg * 0.008;

  // ===================================================================
  // LEGEND — meme composant inline
  // ===================================================================
  const legendAppeared = localFrame >= legendeEmpireAt;
  const legendT = legendAppeared ? spring({ frame: localFrame - legendeEmpireAt, fps, config: { damping: 14, stiffness: 200 } }) : 0;
  const legendScale = interpolate(legendT, [0, 1], [0.85, 1]);

  return (
    <>
      {/* Fond ocean carre — couleur validee #3A5A7E via gradient */}
      <rect x="0" y="0" width="720" height="1280" fill={ATLAS_COLORS.bgTop} />
      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" opacity="0.5" />
      <AtlasSubtleStars opacity={0.6} />

      {/* GLOBE (Hook phase + S1 crossfade out) */}
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

      {/* MERCATOR avec tilt applique — structure identique au BestVersionDemo */}
      {mercOpacity > 0.01 && (
        <g opacity={mercOpacity}>
          {/*
            Transform identique au BestVersionDemo :
            translate(cx+drift-offset) scale(camScale, camScale*scaleY) skewX(skewX) translate(-cx, -cy)
            Le skewX APRES scale = amplifie par scale → effet visible.
            Rect ocean #3A5A7E inclus dans ce groupe via un rect de fond explicite.
          */}
          <g
            transform={`
              translate(${360 + driftX - mercOffX} ${640 + driftY - mercOffY})
              scale(${mercScale} ${mercScale * scaleY})
              skewX(${skewX})
              translate(${-360} ${-640})
            `}
          >
            {/* Rect ocean explicite — meme valeur que AtlasMercator interne */}
            <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.ocean} />

            {/* Pays (tous sauf Mali) */}
            {otherCountries.map((c) => (
              <path key={c.iso} d={c.d} fill={ATLAS_COLORS.land} stroke={ATLAS_COLORS.landStroke} strokeWidth="0.6" strokeOpacity="0.7" />
            ))}

            {/* Mali drapeau plein + halo */}
            {mali && (
              <g opacity={maliFlagOpacity}>
                <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="14" opacity={0.25 + secretGlow * 0.4} />
                <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="6"  opacity={0.55 + secretGlow * 0.3} />
                <path d={mali.d} fill={getFlagFill("MLI", ATLAS_COLORS.maliFill)} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2.5" />
              </g>
            )}

            {/* Empire 1300 outline noir mat */}
            {data.mercWide.maliEmpire1300 && empireT > 0.05 && (
              <g opacity={empireT} transform={`scale(${empireT})`} style={{ transformOrigin: "center" }}>
                <AtlasEmpire
                  pathD={data.mercWide.maliEmpire1300}
                  outlineDark={true}
                  hatchOpacity={0.65 * empireT}
                />
              </g>
            )}

            {/* Pulse marker Mali */}
            {localFrame > crossfadeEnd && (
              <AtlasPulseMarker
                coord={data.mercWide.cities.Niani as [number, number]}
                beatStart={HOOK_DUR + crossfadeEnd}
                color={ATLAS_COLORS.empireGold}
              />
            )}
          </g>
        </g>
      )}

      {/* LEGENDE EMPIRE 1300 — hors tilt, reste droite */}
      {legendAppeared && (
        <g transform={`translate(360 140) scale(${legendScale})`} opacity={legendT}>
          <rect x="-220" y="-50" width="440" height="100" fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2.5" strokeDasharray="10 5" rx="8" />
          <text x="0" y="-8" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="20" fontWeight="700" fill={ATLAS_COLORS.textInk} letterSpacing="3">
            --- --- ---
          </text>
          <text x="0" y="22" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="18" fill={ATLAS_COLORS.textInk} letterSpacing="2">
            EMPIRE DU MALI 1300
          </text>
        </g>
      )}

      {/* CARTOUCHE Hook — hors tilt */}
      {frame < HOOK_DUR + 6 && cartoucheHookOpacity > 0.01 && (
        <g opacity={cartoucheHookOpacity}>
          <AtlasCartouche
            appearAt={9}
            disappearAt={9999}
            text="L'HOMME LE PLUS RICHE"
            subtext="DE L'HISTOIRE"
            x={360} y={640} fontSize={38}
          />
        </g>
      )}

      {/* CARTOUCHE "PLUS GRAND" — hors tilt */}
      <AtlasCartouche
        appearAt={HOOK_DUR + cartoucheGrandAt}
        disappearAt={ATLAS_V2_TILT_TEST_S1_DURATION}
        text="PLUS GRAND"
        subtext="QUE L'EUROPE OCCIDENTALE"
        x={360} y={1080} fontSize={42}
      />

      {/* Vignette */}
      <rect x="0" y="0" width="720" height="1280" fill="url(#vignette)" pointerEvents="none" />
    </>
  );
};

export const AtlasV2TiltTestS1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgTop }}>
    <svg
      viewBox="0 0 720 1280"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <AtlasSharedDefs />
      <AtlasFlagDefs mode="official" bandWidth={14} />
      <TiltTestScene />
    </svg>
  </AbsoluteFill>
);
