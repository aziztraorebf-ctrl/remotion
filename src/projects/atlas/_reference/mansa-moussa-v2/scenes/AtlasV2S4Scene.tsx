// S4 Consequence Scene - "Il distribue tellement d'or au Caire que l'economie egyptienne s'effondre."
// V2 FINITION : rythme rapide + tilt skewX peak 24deg + parallax + halo Mali continu
// Caire close-up + Egypte drapeau plein rouge dominant + medaillon Gizeh
// Pieces d'or qui tombent + fleches Mediterranee chute prix
// "Un seul homme." [serious] = transition vers CTA
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
  AtlasSubtleStars,
  AtlasCartouche,
  AtlasPulseMarker,
  AtlasLabel,
  atlasV2Data as data,
} from "../atlas-v2-components";
import { getFlagFill } from "../atlas-v2-flags";

const AFRICA_ISO = new Set([
  "DZA","AGO","BEN","BWA","BFA","BDI","CPV","CMR","CAF","TCD","COM","COD","COG","CIV","DJI",
  "EGY","GNQ","ERI","SWZ","ETH","GAB","GMB","GHA","GIN","GNB","KEN","LSO","LBR","LBY","MDG",
  "MWI","MLI","MRT","MUS","MAR","MOZ","NAM","NER","NGA","RWA","STP","SEN","SLE","SOM","ZAF",
  "SSD","SDN","TZA","TGO","TUN","UGA","ZMB","ZWE","SHN","REU","MYT","ESH",
]);

interface S4SceneProps {
  startFrame: number;
  endFrame: number;
  beats: {
    caireArrival: number;
    caireEffondre: number;
    douzeAnsChute: number;
    unSeulHomme: number;
    continentEffondre: number;
  };
  insertStart: number;
  insertEnd: number;
}

const SNAP_CONFIG = { damping: 80, stiffness: 400 };

// === FLECHE VERS LE BAS (chute des prix) ===
const FlecheChute: React.FC<{ x: number; y: number; t: number; delay: number }> = ({
  x,
  y,
  t,
  delay,
}) => {
  const localT = Math.max(0, t - delay);
  const opacity = interpolate(localT, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const bounce = Math.abs(Math.sin(localT * 4)) * 4 * opacity;
  return (
    <g transform={`translate(${x} ${y + bounce})`} opacity={opacity}>
      <line x1="0" y1="-12" x2="0" y2="8" stroke="#DA0000" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="-5,4 5,4 0,14" fill="#DA0000" />
      <line x1="-6" y1="-18" x2="6" y2="-18" stroke="#DA0000" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
};

// === PIECE D'OR (cercle dore qui tombe) ===
const PieceOr: React.FC<{
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
}> = ({ x, y, size, rotation, opacity }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation})`} opacity={opacity}>
    <circle r={size} fill={ATLAS_COLORS.empireGold} stroke="#8B5A2B" strokeWidth="1.5" />
    <circle r={size * 0.6} fill="none" stroke="#8B5A2B" strokeWidth="0.8" opacity="0.8" />
    <text
      y={size * 0.3}
      textAnchor="middle"
      fontSize={size * 0.7}
      fontWeight="900"
      fill="#8B5A2B"
      fontFamily="serif"
    >
      *
    </text>
  </g>
);

export const AtlasV2S4Scene: React.FC<S4SceneProps> = ({
  startFrame,
  endFrame,
  beats,
  insertStart,
  insertEnd,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  if (frame < startFrame || frame >= endFrame) return null;

  const inInsertWindow = frame >= insertStart && frame < insertEnd;

  // === Camera : snap vers Caire (stiffness 400) ===
  const caire = data.mercWide.cities.LeCaire as [number, number];
  const caireOffsetX = (caire[0] - 360) * 0.8;
  const caireOffsetY = (caire[1] - 640) * 0.8;

  const caireSnapT = spring({
    frame: frame - beats.caireArrival,
    fps,
    config: SNAP_CONFIG,
  });

  // === Drift Ken Burns + parallax foreground ===
  const driftX = Math.sin(frame * 0.014) * 10;
  const driftY = Math.cos(frame * 0.011) * 7;
  const fgDriftX = Math.sin(frame * 0.014) * 13;
  const fgDriftY = Math.cos(frame * 0.011) * 9;
  const parallaxX = fgDriftX - driftX;
  const parallaxY = fgDriftY - driftY;

  // Camera offset cible : centre vers Caire snap
  const camOffX = caireOffsetX * caireSnapT;
  const camOffY = caireOffsetY * caireSnapT;

  // Scale : 1.0 -> 1.4 sur snap, puis +0.1 sur "s'effondre"
  const scaleBoost = interpolate(
    frame,
    [beats.caireEffondre, beats.caireEffondre + fps * 1.5],
    [0, 0.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camScale = 1.0 + 0.4 * caireSnapT + scaleBoost;

  // === Bump scale on caireArrival pulse ===
  const bumpFrame = frame - beats.caireArrival;
  const bumpT =
    bumpFrame >= 0 && bumpFrame < fps * 1.2
      ? spring({ frame: bumpFrame, fps, config: { damping: 8, stiffness: 180 } })
      : 0;
  const bumpScale = 1 + 0.06 * Math.sin(bumpT * Math.PI);

  // === TILT (skewX + scaleY) — peak 24deg pour S4 ===
  // Tilt continu (suite de S3) avec breath +/-2deg, peak monte sur "s'effondre"
  const tiltStrength = 1;
  const tiltPeak = 24;
  const tiltBoost = interpolate(
    frame,
    [beats.caireEffondre, beats.caireEffondre + fps * 1.5],
    [0, 4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tiltBreath = Math.sin(localFrame * 0.04) * 2;
  const tiltDeg = tiltPeak * tiltStrength + tiltBreath + tiltBoost;
  const skewX = tiltDeg * 0.15;
  const scaleY = 1 - tiltDeg * 0.008;

  // === Glow rouge Egypte ===
  const egyptGlow = interpolate(
    frame,
    [beats.caireEffondre, beats.caireEffondre + fps * 0.8],
    [0, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) * (0.5 + 0.5 * Math.abs(Math.sin(frame * 0.1)));

  // === Grisaillement mondial sur "Un seul homme" (0=terracotta, 1=gris) ===
  // Mali reste or — c'est lui qui a cause ca. Tous les autres pays virent au gris.
  const grisailleT = interpolate(
    frame,
    [beats.unSeulHomme, beats.unSeulHomme + fps * 1.2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Interpolation couleur terracotta -> gris (#C97D5A -> #8A8A8A)
  const r = Math.round(201 + (138 - 201) * grisailleT);
  const g = Math.round(125 + (138 - 125) * grisailleT);
  const b = Math.round(90 + (138 - 90) * grisailleT);
  const grisailleColor = `rgb(${r},${g},${b})`;

  // === DATA ===
  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const egypt = data.mercWide.countries.find((c) => c.iso === "EGY");
  const africaOthers = data.mercWide.countries.filter(
    (c) => c.iso !== "MLI" && c.iso !== "EGY" && AFRICA_ISO.has(c.iso)
  );
  const nonAfricaCountries = data.mercWide.countries.filter(
    (c) => c.iso !== "MLI" && c.iso !== "EGY" && !AFRICA_ISO.has(c.iso)
  );

  return (
    <>
      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.6} />

      {/* MERCATOR LAYER (continue de S3) */}
      <g
        transform={`
          translate(${360 + driftX - camOffX} ${640 + driftY - camOffY})
          scale(${camScale * bumpScale} ${camScale * bumpScale * scaleY})
          skewX(${skewX})
          translate(${-360} ${-640})
        `}
      >
        {/* Ocean */}
        <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.ocean} />

        {/* Non-Africa countries — couleur fixe, pas de grisaille */}
        {nonAfricaCountries.map((c) => (
          <path
            key={c.iso}
            d={c.d}
            fill={ATLAS_COLORS.land}
            stroke={ATLAS_COLORS.landStroke}
            strokeWidth="0.8"
            strokeOpacity="0.8"
          />
        ))}

        {/* Africa others (hors Mali + Egypte) — virent au gris sur "Un seul homme" */}
        {africaOthers.map((c) => (
          <path
            key={c.iso}
            d={c.d}
            fill={grisailleColor}
            stroke={ATLAS_COLORS.landStroke}
            strokeWidth="0.8"
            strokeOpacity="0.8"
          />
        ))}

        {/* === FOREGROUND PARALLAX : Mali + Egypte bougent un peu plus === */}
        <g transform={`translate(${parallaxX} ${parallaxY})`}>
          {/* Egypte drapeau plein dominant rouge */}
          {egypt && (
            <g>
              <path
                d={egypt.d}
                fill={getFlagFill("EGY", ATLAS_COLORS.egyptFill)}
                stroke={ATLAS_COLORS.empireOutlineDark}
                strokeWidth="2.5"
              />
              {/* Glow rouge sur l'effondrement */}
              <path
                d={egypt.d}
                fill="none"
                stroke="#DA0000"
                strokeWidth="6"
                opacity={egyptGlow}
              />
            </g>
          )}

          {/* Mali drapeau — reste brillant, c'est lui qui a cause la crise */}
          {mali && (
            <g>
              <path
                d={mali.d}
                fill={ATLAS_COLORS.maliFill}
                stroke={ATLAS_COLORS.empireOutlineDark}
                strokeWidth="2"
              />
              <path
                d={mali.d}
                fill={getFlagFill("MLI", ATLAS_COLORS.maliFill)}
                opacity={0.4}
                stroke="none"
              />
              {/* Halo dore continu */}
              <path
                d={mali.d}
                fill="none"
                stroke={ATLAS_COLORS.haloGold}
                strokeWidth="14"
                opacity={0.12}
              />
              <path
                d={mali.d}
                fill="none"
                stroke={ATLAS_COLORS.haloGold}
                strokeWidth="6"
                opacity={0.22}
              />
            </g>
          )}

          {/* Pulse marker Le Caire */}
          <AtlasPulseMarker
            coord={caire}
            beatStart={beats.caireArrival}
            color={ATLAS_COLORS.empireGold}
          />

          {/* Label LE CAIRE */}
          <AtlasLabel
            coord={caire}
            text="LE CAIRE"
            appearAt={beats.caireArrival + 8}
            offsetY={-32}
            fontSize={22}
          />

          {/* Medaillon Gizeh — au-dessus du Caire, dans le groupe tilt/camera */}
          {frame >= beats.caireArrival && (() => {
            const medalT = spring({
              frame: frame - beats.caireArrival,
              fps,
              config: { damping: 14, stiffness: 100 },
            });
            const mx = caire[0] + 60;
            const my = caire[1] - 90;
            return (
              <g transform={`translate(${mx} ${my}) scale(${medalT})`} opacity={medalT}>
                <defs>
                  <clipPath id="medalClip">
                    <circle cx="0" cy="0" r="52" />
                  </clipPath>
                </defs>
                <circle cx="0" cy="0" r="58" fill={ATLAS_COLORS.empireGold} opacity="0.15" />
                <image
                  href={staticFile("atlas-mansa-moussa/assets/gizeh-medallion.png")}
                  x="-52"
                  y="-52"
                  width="104"
                  height="104"
                  clipPath="url(#medalClip)"
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="52"
                  fill="none"
                  stroke={ATLAS_COLORS.empireGold}
                  strokeWidth="2"
                  opacity="0.7"
                />
              </g>
            );
          })()}

          {/* fleches supprimees */}
        </g>
      </g>

      {/* === PIECES D'OR qui tombent (HORS tilt — coordonnees ecran 720x1280) === */}
      {frame >= beats.caireArrival &&
        !inInsertWindow &&
        Array.from({ length: 14 }).map((_, i) => {
          const localF = frame - beats.caireArrival - i * 4;
          if (localF < 0) return null;
          const fallT = spring({ frame: localF, fps, config: { damping: 12, stiffness: 80 } });
          const opacity =
            interpolate(localF, [0, 5, 90, 110], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) * 0.85;
          const xOffset = ((i % 6) - 2.5) * 60;
          const xCenter = 360 + xOffset + Math.sin(i * 1.7) * 40;
          const yStart = 150;
          const yEnd = 750;
          const y = yStart + (yEnd - yStart) * fallT;
          const rotation = localF * 10;
          const size = 14 + (i % 3) * 4;
          return (
            <PieceOr
              key={`coin-${i}`}
              x={xCenter}
              y={y}
              size={size}
              rotation={rotation}
              opacity={opacity}
            />
          );
        })}

      {/* Medaillon Gizeh positionne dans le groupe tilt/camera — voir foreground parallax ci-dessus */}

      {/* "12 ANS" — cartouche micro-evenement gap douzeAnsChute->insert3Start (3.8s) */}
      {!inInsertWindow && (
        <AtlasCartouche
          appearAt={beats.douzeAnsChute + 20}
          disappearAt={insertStart - 5}
          text="12 ANS"
          subtext="DE KRACH DE L'OR"
          x={360}
          y={980}
          fontSize={34}
        />
      )}

      {/* === SFX === */}
      <Sequence from={beats.caireEffondre}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/E-coins-caire.mp3")} volume={0.65} />
      </Sequence>

    </>
  );
};
