// Rhythm + Tilt Demo V2 — rythme rapide + tilt + 3 elements visuels sur carte
// 1. Route caravane qui se dessine (stroke-dashoffset)
// 2. Icones SVG sur Tombouctou (livre S2 + mosquee S2)
// 3. Fleches chute des prix Mediterranee (S4)
// 25s @ 30fps, pas d'audio
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
import { IconMosqueIconify, IconBookIconify, IconDiamondIconify } from "./atlas-iconify-icons";

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

export const ATLAS_V2_RHYTHM_TILT_DEMO_DURATION = BEATS.end;

const SNAP_CONFIG  = { damping: 80, stiffness: 400 };
const POP_CONFIG   = { damping: 14, stiffness: 300 };

// === ICONE LIVRE (Tombouctou / bibliotheques) — Iconify mdi:book-open-page-variant ===
const IconLivre: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const s = interpolate(t, [0, 1], [0.6, 1]);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, t * 2)}>
      {/* Fond cartouche cream */}
      <rect x="-32" y="-40" width="64" height="50" rx="6" fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2" />
      {/* Iconify livre */}
      <IconBookIconify x={0} y={-20} size={36} fill="#8B5A2B" />
      {/* Label */}
      <text x="0" y="3" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fontWeight="700" fill={ATLAS_COLORS.textInk} letterSpacing="1">BIBL.</text>
    </g>
  );
};

// === ICONE MOSQUEE (Tombouctou / Sankore) — Iconify mdi:mosque ===
const IconMosquee: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const s = interpolate(t, [0, 1], [0.6, 1]);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, t * 2)}>
      {/* Fond cartouche cream */}
      <rect x="-32" y="-50" width="64" height="60" rx="6" fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2" />
      {/* Iconify mosquee */}
      <IconMosqueIconify x={0} y={-22} size={44} fill="#3A2A18" />
      {/* Label */}
      <text x="0" y="3" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fontWeight="700" fill={ATLAS_COLORS.textInk} letterSpacing="1">SANKORE</text>
    </g>
  );
};

// === FLECHE VERS LE BAS (chute des prix) ===
const FlecheChute: React.FC<{ x: number; y: number; t: number; delay: number }> = ({ x, y, t, delay }) => {
  const localT = Math.max(0, t - delay);
  const opacity = interpolate(localT, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const bounce  = Math.abs(Math.sin(localT * 4)) * 4 * opacity;
  return (
    <g transform={`translate(${x} ${y + bounce})`} opacity={opacity}>
      {/* Fleche vers le bas */}
      <line x1="0" y1="-12" x2="0" y2="8" stroke="#DA0000" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="-5,4 5,4 0,14" fill="#DA0000" />
      {/* Petit signe moins = baisse */}
      <line x1="-6" y1="-18" x2="6" y2="-18" stroke="#DA0000" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
};

const RhythmTiltScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === PHASES ===
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

  const camScale  = inS4 ? 1.35 + 0.2 * caireSnapT : mercScaleBase;
  const finalOffX = inS4 ? caireOffX * caireSnapT : camOffX;
  const finalOffY = inS4 ? caireOffY * caireSnapT : camOffY;

  const driftX = Math.sin(frame * 0.014) * 3;
  const driftY = Math.cos(frame * 0.011) * 2;

  // === TILT ===
  const tiltRampIn  = interpolate(frame, [BEATS.maliSnap, BEATS.maliSnap + FPS * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tiltRampOut = interpolate(frame, [BEATS.ctaStart - FPS, BEATS.ctaStart], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tiltStrength = inMerc ? Math.min(tiltRampIn, tiltRampOut) : 0;
  const tiltPeak = inS4 ? 24 : inS3 ? 28 : 20;
  const tiltDeg  = tiltPeak * tiltStrength;
  const skewX    = tiltDeg * 0.15;
  const scaleY   = 1 - tiltDeg * 0.008;

  // === GLOW EGYPTE (S4) ===
  const egyptGlow = inS4
    ? interpolate(frame, [BEATS.cartEffondre, BEATS.cartEffondre + fps * 0.5], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      * (0.5 + 0.5 * Math.abs(Math.sin(frame * 0.12)))
    : 0;

  const maliFadeOut = interpolate(frame, [BEATS.cartUnSeul, BEATS.cartUnSeul + fps * 0.8], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // === GLOBE OPACITIES ===
  const globeOpacityHook = interpolate(frame, [BEATS.crossfadeSnap - 6, BEATS.crossfadeSnap], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globeOpacityCTA  = inCTA ? interpolate(frame, [BEATS.ctaStart, BEATS.ctaStart + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const globeOpacity = Math.max(globeOpacityHook, globeOpacityCTA);
  const mercOpacity  = interpolate(frame, [BEATS.crossfadeSnap - 3, BEATS.crossfadeSnap + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mercFadeOut  = interpolate(frame, [BEATS.ctaStart - 6, BEATS.ctaStart], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mercFinal    = Math.min(mercOpacity, mercFadeOut);

  const mali          = data.mercWide.countries.find((c) => c.iso === "MLI");
  const egypt         = data.mercWide.countries.find((c) => c.iso === "EGY");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI" && c.iso !== "EGY");

  const empireT = spring({ frame: frame - BEATS.empireSnap, fps, config: SNAP_CONFIG });

  // ===================================================================
  // 1. ROUTE CARAVANE — pointillee statique avec glow pulse
  // ===================================================================
  const wp = data.mercWide.caravaneWaypoints;
  const routePoints = [wp.Niani, wp.Tombouctou, wp.Sahara1, wp.Sahara2, wp.LeCaire, wp.Mecque] as [number, number][];
  const routeD = routePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

  // Glow pulse sur la route
  const routeGlow = 0.4 + 0.4 * Math.abs(Math.sin(frame * 0.1));

  // ===================================================================
  // 2. ICONES TOMBOUCTOU — livre (cartBiblio) + mosquee (cartSankore)
  // Coordonnees dans l'espace mercWide (avant transform camera)
  // ===================================================================
  // +6 frames de delai pour que le spring soit visible (pas frame=0)
  const livreT   = spring({ frame: frame - BEATS.cartBiblio - 6,  fps, config: POP_CONFIG });
  const mosqueeT = spring({ frame: frame - BEATS.cartSankore - 6, fps, config: POP_CONFIG });
  // Fade out les icones quand S3 commence (caravane prend le dessus)
  const iconesFadeOut = interpolate(frame, [BEATS.s3Start, BEATS.s3Start + FPS * 0.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Tombouctou en coordonnees mercWide — les icones flottent au-dessus
  const tomboX = tombouctou[0];
  const tomboY = tombouctou[1] - 80;  // au-dessus du label TOMBOUCTOU

  // ===================================================================
  // 3. FLECHES CHUTE PRIX MEDITERRANEE (S4 — cartEffondre)
  // Positions en coordonnees mercWide : points sur la Mediterranee
  // ===================================================================
  const flecchesT = interpolate(
    frame,
    [BEATS.cartEffondre, BEATS.cartEffondre + FPS * 1.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Points sur la Mediterranee (mercWide coords)
  const medPoints = [
    { x: 340, y: 500 }, // Italie/Genes
    { x: 370, y: 490 }, // Grece
    { x: 395, y: 495 }, // Turquie
    { x: 310, y: 505 }, // Espagne/Marseille
  ];

  return (
    <>
      {/* Fond */}
      <rect x="0" y="0" width="720" height="1280" fill={ATLAS_COLORS.bgTop} />
      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" opacity="0.5" />
      <AtlasSubtleStars opacity={0.65} />

      {/* GLOBE */}
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

      {/* MERCATOR + TILT */}
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
            {/* Ocean */}
            <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.ocean} />

            {/* Pays */}
            {otherCountries.map((c) => (
              <path key={c.iso} d={c.d} fill={ATLAS_COLORS.land} stroke={ATLAS_COLORS.landStroke} strokeWidth="0.8" strokeOpacity="0.8" />
            ))}

            {/* Egypte */}
            {(inS3 || inS4) && egypt && (
              <g>
                <path d={egypt.d} fill={inS4 ? getFlagFill("EGY", ATLAS_COLORS.egyptFill) : ATLAS_COLORS.egyptFill} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2" />
                {inS4 && <path d={egypt.d} fill="none" stroke="#DA0000" strokeWidth="6" opacity={egyptGlow} />}
              </g>
            )}

            {/* Mali */}
            {mali && (
              <g opacity={maliFadeOut}>
                <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="14" opacity="0.2" />
                <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="6"  opacity="0.5" />
                <path d={mali.d} fill={getFlagFill("MLI", ATLAS_COLORS.maliFill)} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2.5" />
              </g>
            )}

            {/* Empire 1300 */}
            {frame >= BEATS.empireSnap && data.mercWide.maliEmpire1300 && (
              <g opacity={empireT}>
                <AtlasEmpire pathD={data.mercWide.maliEmpire1300} outlineDark={true} hatchOpacity={0.65 * empireT} />
              </g>
            )}

            {/* ============================================================
                1. ROUTE CARAVANE — se dessine progressivement
                ============================================================ */}
            {frame >= BEATS.s3Start && (
              <g>
                {/* Halo glow pulse */}
                <path
                  d={routeD}
                  fill="none"
                  stroke="#F0C97A"
                  strokeWidth="8"
                  opacity={0.15 * routeGlow}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Ligne or pointillee statique */}
                <path
                  d={routeD}
                  fill="none"
                  stroke="#F0C97A"
                  strokeWidth="2.5"
                  strokeDasharray="12 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
              </g>
            )}

            {/* ============================================================
                2. ICONES TOMBOUCTOU
                ============================================================ */}
            {livreT > 0.01 && frame < BEATS.s3Start && (
              <g opacity={iconesFadeOut}>
                {/* Livre a gauche de Tombouctou, au-dessus */}
                <IconLivre x={tomboX - 40} y={tomboY} t={livreT} />
              </g>
            )}
            {mosqueeT > 0.01 && frame < BEATS.s3Start && (
              <g opacity={iconesFadeOut}>
                {/* Mosquee a droite de Tombouctou, au-dessus */}
                <IconMosquee x={tomboX + 40} y={tomboY} t={mosqueeT} />
              </g>
            )}

            {/* ============================================================
                3. FLECHES CHUTE PRIX MEDITERRANEE
                ============================================================ */}
            {inS4 && flecchesT > 0 && medPoints.map((pt, i) => (
              <FlecheChute key={i} x={pt.x} y={pt.y} t={flecchesT} delay={i * 0.15} />
            ))}

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

            {/* Labels */}
            {frame >= BEATS.maliSnap + 3 && (
              <AtlasLabel coord={data.mercWide.cities.Niani as [number, number]} text="MALI" appearAt={BEATS.maliSnap + 3} offsetY={-28} />
            )}
            {frame >= BEATS.tomboSnap + 3 && (
              <AtlasLabel coord={tombouctou} text="TOMBOUCTOU" appearAt={BEATS.tomboSnap + 3} offsetY={-28} />
            )}
            {frame >= BEATS.caireSnap + 3 && (
              <AtlasLabel coord={caire} text="LE CAIRE" appearAt={BEATS.caireSnap + 3} offsetY={-28} />
            )}

            {/* (pieces d'or deplacees hors du groupe tilt — voir bas du composant) */}
          </g>
        </g>
      )}

      {/* === CARTOUCHES — hors tilt === */}
      <AtlasCartouche appearAt={BEATS.titreHook} disappearAt={BEATS.crossfadeSnap}
        text="L'HOMME LE PLUS RICHE" subtext="DE L'HISTOIRE"
        x={360} y={640} fontSize={38} />

      <AtlasCartouche appearAt={BEATS.cartGrand} disappearAt={BEATS.tomboSnap}
        text="PLUS GRAND" subtext="QUE L'EUROPE OCCIDENTALE"
        x={360} y={1080} fontSize={38} />

      <AtlasCartouche appearAt={BEATS.cartBiblio} disappearAt={BEATS.cartSankore}
        text="+ DE BIBLIOTHEQUES" subtext="QUE PARIS"
        x={360} y={140} fontSize={28} />

      <AtlasCartouche appearAt={BEATS.cartSankore} disappearAt={BEATS.s3Start}
        text="UNIVERSITE DE SANKORE" subtext="25 000 ETUDIANTS"
        x={360} y={1080} fontSize={26} />

      <AtlasCartouche appearAt={BEATS.cartDouze} disappearAt={BEATS.cartHommes}
        text="DOUZE ANS" subtext="APRES SON COURONNEMENT"
        x={360} y={1080} fontSize={36} />

      <AtlasCartouche appearAt={BEATS.cartHommes} disappearAt={BEATS.cartChameaux}
        text="60 000 HOMMES" subtext="12 000 ESCLAVES"
        x={360} y={1080} fontSize={40} />

      <AtlasCartouche appearAt={BEATS.cartChameaux} disappearAt={BEATS.caireSnap}
        text="80 CHAMEAUX" subtext="150 KG D'OR CHACUN"
        x={360} y={1080} fontSize={40} />

      <AtlasCartouche appearAt={BEATS.cartEffondre} disappearAt={BEATS.cartUnSeul}
        text="L'ECONOMIE EGYPTIENNE" subtext="S'EFFONDRE"
        x={360} y={1080} fontSize={34} />

      <AtlasCartouche appearAt={BEATS.cartUnSeul} disappearAt={BEATS.ctaStart}
        text="UN SEUL HOMME." subtext="UN CONTINENT QUI S'EFFONDRE."
        x={360} y={1080} fontSize={36} />

      <AtlasCartouche appearAt={BEATS.ctaTitre} disappearAt={BEATS.end}
        text="MANSA MOUSSA" subtext="L'HOMME QUE L'HISTOIRE A OUBLIE"
        x={360} y={640} fontSize={40} />

      {/* === PIECES D'OR qui tombent (S4) — coordonnees ecran 720x1280 ===
           Hors du groupe tilt, centrees sur le drapeau Egypte au snap caire */}
      {inS4 && Array.from({ length: 14 }).map((_, i) => {
        const localFrame = frame - BEATS.caireSnap - i * 4;
        if (localFrame < 0) return null;
        const fallT = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 80 } });
        const opacity = interpolate(localFrame, [0, 5, 90, 110], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const xOffset = ((i % 6) - 2.5) * 60;
        const xCenter = 360 + xOffset + Math.sin(i * 1.7) * 40;
        const yStart = 150;
        const yEnd = 750;
        const y = yStart + (yEnd - yStart) * fallT;
        const rotation = localFrame * 10;
        return (
          <IconDiamondIconify
            key={`coin-${i}`}
            x={xCenter}
            y={y}
            size={36}
            fill={ATLAS_COLORS.empireGold}
            opacity={opacity}
            rotation={rotation}
          />
        );
      })}

      {/* Vignette */}
      <rect x="0" y="0" width="720" height="1280" fill="url(#vignette)" pointerEvents="none" />
    </>
  );
};

export const AtlasV2RhythmTiltDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgTop }}>
    <svg
      viewBox="0 0 720 1280"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <AtlasSharedDefs />
      <AtlasFlagDefs mode="official" bandWidth={14} />
      <RhythmTiltScene />
    </svg>
  </AbsoluteFill>
);
