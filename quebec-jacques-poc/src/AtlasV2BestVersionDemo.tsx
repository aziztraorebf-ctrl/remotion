// Best Version Demo V2 — corrections post-review Aziz
// Fixes : ocean couleur originale, drapeau Mali retire (degre or uniquement),
//   tilt UNIQUEMENT S1/S2/S3/S4 (desactive Hook + CTA), labels pays dans mercator transform,
//   CTA globe propre sans skew.
// 25s @ 30fps, pas d'audio.
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

export const ATLAS_V2_BEST_VERSION_DURATION = BEATS.end;

const SNAP_CONFIG  = { damping: 80, stiffness: 400 };
const PUNCH_CONFIG = { damping: 12, stiffness: 500 };


const BestScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inHook = frame < BEATS.crossfadeSnap;
  const inMerc = frame >= BEATS.crossfadeSnap && frame < BEATS.ctaStart;
  const inS3   = frame >= BEATS.s3Start && frame < BEATS.caireSnap;
  const inS4   = frame >= BEATS.caireSnap && frame < BEATS.ctaStart;
  const inCTA  = frame >= BEATS.ctaStart;

  // === CAMERA SNAPS ===
  const maliSnapT  = spring({ frame: frame - BEATS.maliSnap,  fps, config: SNAP_CONFIG });
  const tomboSnapT = spring({ frame: frame - BEATS.tomboSnap, fps, config: SNAP_CONFIG });
  const caireSnapT = spring({ frame: frame - BEATS.caireSnap, fps, config: SNAP_CONFIG });

  const tombouctou = data.mercWide.cities.Tombouctou as [number, number];
  const caire      = data.mercWide.cities.LeCaire    as [number, number];

  const tomboOffX = (tombouctou[0] - 360) * 0.65;
  const tomboOffY = (tombouctou[1] - 640) * 0.65;
  const caireOffX = (caire[0] - 360) * 0.8;
  const caireOffY = (caire[1] - 640) * 0.8;

  const mercScaleBase = 1.0 + 0.35 * maliSnapT + 0.25 * tomboSnapT;
  const camOffX = -50 * maliSnapT + tomboOffX * tomboSnapT;
  const camOffY =  80 * maliSnapT + tomboOffY * tomboSnapT;

  const camScale = inS4 ? 1.35 + 0.2 * caireSnapT : mercScaleBase;
  const finalOffX = inS4 ? caireOffX * caireSnapT : camOffX;
  const finalOffY = inS4 ? caireOffY * caireSnapT : camOffY;

  const driftX = Math.sin(frame * 0.014) * 3;
  const driftY = Math.cos(frame * 0.011) * 2;

  // === TILT — actif UNIQUEMENT pendant S1/S2/S3/S4 (pas Hook, pas CTA) ===
  // Rampe in apres crossfade, rampe out avant ctaStart
  const tiltActive = inMerc;
  const tiltRampIn = tiltActive
    ? interpolate(
        frame,
        [BEATS.maliSnap, BEATS.maliSnap + FPS * 1.5],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;
  const tiltRampOut = tiltActive
    ? interpolate(
        frame,
        [BEATS.ctaStart - FPS * 1.5, BEATS.ctaStart],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;
  const tiltStrength = Math.min(tiltRampIn, tiltRampOut);

  // S3 : tilt plus intense
  const tiltPeak = inS3 ? 28 : inS4 ? 24 : 20;
  const tiltDeg = tiltPeak * tiltStrength;

  // Skew + scaleY compression (simulation tilt 2D)
  const skewX  = tiltDeg * 0.15;
  const scaleY = 1 - tiltDeg * 0.008;

  // === GLOW EGYPTE (S4) ===
  const egyptGlow = inS4
    ? interpolate(frame, [BEATS.cartEffondre, BEATS.cartEffondre + FPS * 0.5], [0, 0.7], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      }) * (0.5 + 0.5 * Math.abs(Math.sin(frame * 0.12)))
    : 0;

  // === MALI FADE (Un seul homme) ===
  const maliFadeOut = interpolate(
    frame,
    [BEATS.cartUnSeul, BEATS.cartUnSeul + FPS * 0.8],
    [1, 0.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === GLOBE OPACITIES ===
  const globeOpacityHook = interpolate(frame, [BEATS.crossfadeSnap - 9, BEATS.crossfadeSnap], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globeOpacityCTA  = inCTA ? interpolate(frame, [BEATS.ctaStart, BEATS.ctaStart + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const globeOpacity = Math.max(globeOpacityHook, globeOpacityCTA);
  const mercOpacity  = interpolate(frame, [BEATS.crossfadeSnap - 6, BEATS.crossfadeSnap + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Mercator s'efface proprement avant CTA
  const mercFadeOut  = interpolate(frame, [BEATS.ctaStart - 9, BEATS.ctaStart], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mercFinal    = Math.min(mercOpacity, mercFadeOut);

  const mali  = data.mercWide.countries.find((c) => c.iso === "MLI");
  const egypt = data.mercWide.countries.find((c) => c.iso === "EGY");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI" && c.iso !== "EGY");

  const empireT = spring({ frame: frame - BEATS.empireSnap, fps, config: SNAP_CONFIG });
  const routeGlow = 0.5 + 0.5 * Math.abs(Math.sin(frame * 0.08));

return (
    <>
      {/* === DEFS SUPPLEMENTAIRES === */}
      <defs>
        <filter id="empireShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="6" stdDeviation="5" floodColor="#0A0A0A" floodOpacity="0.55" />
        </filter>
        <filter id="maliGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="bokehFar" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <linearGradient id="routeGoldBV" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#D4A574" stopOpacity="0.2" />
          <stop offset="50%"  stopColor="#F0C97A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#D4A574" stopOpacity="0.2" />
        </linearGradient>
        {/* Relief dégradé Mali — lumière venant du haut-gauche */}
        <linearGradient id="empireRelief" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%"   stopColor="#F5E8B0" stopOpacity="1" />
          <stop offset="35%"  stopColor="#D4A574" stopOpacity="1" />
          <stop offset="100%" stopColor="#9A6A38" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Fond ocean — couleur originale validée #3A5A7E */}
      <rect x="0" y="0" width="720" height="1280" fill="#1A1F3A" />
      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" opacity="0.5" />
      <AtlasSubtleStars opacity={0.65} />

      {/* GLOBE (Hook + CTA) — pas de tilt, propre */}
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

      {/* MERCATOR avec tilt uniquement S1-S4 */}
      {mercFinal > 0.01 && (
        <g opacity={mercFinal}>
          <g
            transform={`
              translate(${360 + driftX - finalOffX} ${640 + driftY - finalOffY})
              scale(${camScale} ${camScale * scaleY})
              skewX(${skewX})
              translate(${-360} ${-640})
            `}
          >
            {/* Tous les pays — couleur terracotta unie (version validee) */}
            {otherCountries.map((c) => (
              <path key={c.iso} d={c.d} fill={ATLAS_COLORS.land} stroke={ATLAS_COLORS.landStroke} strokeWidth="1.0" />
            ))}

            {/* Egypte */}
            {egypt && (
              <g>
                <path
                  d={egypt.d}
                  fill={inS4 ? getFlagFill("EGY", ATLAS_COLORS.egyptFill) : ATLAS_COLORS.egyptFill}
                  stroke={ATLAS_COLORS.empireOutlineDark}
                  strokeWidth="2"
                />
                {inS4 && (
                  <path d={egypt.d} fill="none" stroke="#DA0000" strokeWidth="6" opacity={egyptGlow} />
                )}
              </g>
            )}

            {/* Mali — dégradé doré relief (PAS de drapeau moderne) */}
            {mali && (
              <g opacity={maliFadeOut}>
                <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="16" opacity="0.18" />
                <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="7"  opacity="0.42" />
                <path d={mali.d} fill="url(#empireRelief)" stroke="#1A1A1A" strokeWidth="2.5" filter="url(#maliGlow)" />
              </g>
            )}

            {/* Empire 1300 — drop shadow + hachures */}
            {frame >= BEATS.empireSnap && data.mercWide.maliEmpire1300 && (
              <g opacity={empireT} filter="url(#empireShadow)">
                <path
                  d={data.mercWide.maliEmpire1300}
                  fill="url(#empireHatch)"
                  opacity="0.3"
                />
                <path
                  d={data.mercWide.maliEmpire1300}
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="2.5"
                  strokeDasharray="10 6"
                  opacity="0.8"
                />
              </g>
            )}

            {/* Route caravane or + glow (S3+) */}
            {frame >= BEATS.s3Start && (() => {
              const wp = data.mercWide.caravaneWaypoints;
              const points = [wp.Niani, wp.Tombouctou, wp.Sahara1, wp.Sahara2, wp.LeCaire, wp.Mecque] as [number, number][];
              const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
              return (
                <g>
                  <path d={d} fill="none" stroke="#F0C97A" strokeWidth="7" opacity={0.18 * routeGlow} strokeLinecap="round" />
                  <path d={d} fill="none" stroke="url(#routeGoldBV)" strokeWidth="2.5" strokeDasharray="12 6" strokeLinecap="round" opacity="0.92" />
                </g>
              );
            })()}

            {/* Pulse markers */}
            {frame >= BEATS.maliSnap && (
              <AtlasPulseMarker coord={data.mercWide.cities.Niani as [number, number]} beatStart={BEATS.maliSnap} color={ATLAS_COLORS.empireGold} />
            )}
            {frame >= BEATS.tomboSnap && (
              <AtlasPulseMarker coord={tombouctou} beatStart={BEATS.tomboSnap} color={ATLAS_COLORS.empireGold} />
            )}
            {frame >= BEATS.caireSnap && (
              <AtlasPulseMarker coord={caire} beatStart={BEATS.caireSnap} color={ATLAS_COLORS.empireGold} />
            )}

            {/* Labels villes */}
            {frame >= BEATS.maliSnap + 5 && (
              <AtlasLabel coord={data.mercWide.cities.Niani as [number, number]} text="MALI" appearAt={BEATS.maliSnap + 5} offsetY={-28} />
            )}
            {frame >= BEATS.tomboSnap + 5 && (
              <AtlasLabel coord={tombouctou} text="TOMBOUCTOU" appearAt={BEATS.tomboSnap + 5} offsetY={-28} />
            )}
            {frame >= BEATS.caireSnap + 5 && (
              <AtlasLabel coord={caire} text="LE CAIRE" appearAt={BEATS.caireSnap + 5} offsetY={-28} />
            )}

          </g>
        </g>
      )}

      {/* === CARTOUCHES — hors du tilt, restent droits === */}
      <AtlasCartouche
        appearAt={BEATS.titreHook}
        disappearAt={BEATS.crossfadeSnap}
        text="L'HOMME LE PLUS RICHE"
        subtext="DE L'HISTOIRE"
        x={360} y={640} fontSize={38}
      />
      <AtlasCartouche
        appearAt={BEATS.cartGrand}
        disappearAt={BEATS.tomboSnap}
        text="PLUS GRAND"
        subtext="QUE L'EUROPE OCCIDENTALE"
        x={360} y={1080} fontSize={38}
      />
      <AtlasCartouche
        appearAt={BEATS.cartBiblio}
        disappearAt={BEATS.cartSankore}
        text="+ DE BIBLIOTHEQUES"
        subtext="QUE PARIS"
        x={360} y={140} fontSize={28}
      />
      <AtlasCartouche
        appearAt={BEATS.cartSankore}
        disappearAt={BEATS.s3Start}
        text="UNIVERSITE DE SANKORE"
        subtext="25 000 ETUDIANTS"
        x={360} y={1080} fontSize={26}
      />
      <AtlasCartouche
        appearAt={BEATS.cartDouze}
        disappearAt={BEATS.cartHommes}
        text="DOUZE ANS"
        subtext="APRES SON COURONNEMENT"
        x={360} y={1080} fontSize={36}
      />
      <AtlasCartouche
        appearAt={BEATS.cartHommes}
        disappearAt={BEATS.cartChameaux}
        text="60 000 HOMMES"
        subtext="12 000 ESCLAVES"
        x={360} y={1080} fontSize={40}
      />
      <AtlasCartouche
        appearAt={BEATS.cartChameaux}
        disappearAt={BEATS.caireSnap}
        text="80 CHAMEAUX"
        subtext="150 KG D'OR CHACUN"
        x={360} y={1080} fontSize={40}
      />
      <AtlasCartouche
        appearAt={BEATS.cartEffondre}
        disappearAt={BEATS.cartUnSeul}
        text="L'ECONOMIE EGYPTIENNE"
        subtext="S'EFFONDRE"
        x={360} y={1080} fontSize={34}
      />
      <AtlasCartouche
        appearAt={BEATS.cartUnSeul}
        disappearAt={BEATS.ctaStart}
        text="UN SEUL HOMME."
        subtext="UN CONTINENT QUI S'EFFONDRE."
        x={360} y={1080} fontSize={36}
      />
      <AtlasCartouche
        appearAt={BEATS.ctaTitre}
        disappearAt={BEATS.end}
        text="MANSA MOUSSA"
        subtext="L'HOMME QUE L'HISTOIRE A OUBLIE"
        x={360} y={640} fontSize={40}
      />

      {/* Vignette */}
      <rect x="0" y="0" width="720" height="1280" fill="url(#vignette)" pointerEvents="none" />
    </>
  );
};

export const AtlasV2BestVersionDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgBottom }}>
      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <AtlasSharedDefs />
        <AtlasFlagDefs mode="official" bandWidth={14} />
        <BestScene />
      </svg>
    </AbsoluteFill>
  );
};
