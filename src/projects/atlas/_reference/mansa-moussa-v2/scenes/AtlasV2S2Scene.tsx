// S2 Densite Cesar Scene - "La moitie de l'or qui circule. Tombouctou. Sankore."
// V2 FINITION : rythme rapide (stiffness:400) + tilt skewX + 4 fixes texte + icones Gemini
// Pattern reference : AtlasV2RhythmTiltDemo.tsx + S1 v3
// Icones livre + mosquee = images Gemini transparentes (NOT Iconify, choisi par Aziz)
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasEmpire,
  AtlasSubtleStars,
  AtlasCartouche,
  AtlasPulseMarker,
  AtlasLabel,
  atlasV2Data as data,
} from "../atlas-v2-components";
import { getFlagFill } from "../atlas-v2-flags";

interface S2SceneProps {
  startFrame: number;
  endFrame: number;
  moitieSerious: number;
  tombouctouAppears: number;
  sankoreAppears: number;
  insertStart: number;
  insertEnd: number;
}

const SNAP_CONFIG = { damping: 80, stiffness: 400 };
const POP_CONFIG = { damping: 14, stiffness: 300 };

// === ICON CARTOUCHE (livre OR mosquee) — image Gemini transparente sur fond cream ===
const IconCartouche: React.FC<{
  x: number;
  y: number;
  t: number;
  imageSrc: string;
  label: string;
}> = ({ x, y, t, imageSrc, label }) => {
  const s = interpolate(t, [0, 1], [0.6, 1]);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, t * 2)}>
      <rect
        x="-36"
        y="-50"
        width="72"
        height="64"
        rx="6"
        fill={ATLAS_COLORS.cream}
        stroke={ATLAS_COLORS.empireOutlineDark}
        strokeWidth="2"
      />
      <image
        href={imageSrc}
        x="-28"
        y="-46"
        width="56"
        height="48"
        preserveAspectRatio="xMidYMid meet"
      />
      <text
        x="0"
        y="9"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontSize="10"
        fontWeight="700"
        fill={ATLAS_COLORS.textInk}
        letterSpacing="1"
      >
        {label}
      </text>
    </g>
  );
};

export const AtlasV2S2Scene: React.FC<S2SceneProps> = ({
  startFrame,
  endFrame,
  moitieSerious,
  tombouctouAppears,
  sankoreAppears,
  insertStart,
  insertEnd,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  if (frame < startFrame || frame >= endFrame) return null;

  // === BEATS LOCAUX (relatifs au start S2) ===
  // Segment A : startFrame -> insertStart (avant insert PieChart)
  // Segment B : insertEnd -> endFrame (apres insert)
  const tomboSnapFrame = tombouctouAppears - startFrame; // beat ou Tombo apparait
  const bookBeatFrame = tombouctouAppears + 5 - startFrame;
  const mosqueBeatFrame = sankoreAppears - startFrame;

  // === CAMERA SNAP TOMBOUCTOU (apres insert) ===
  const tomboSnapT = spring({
    frame: localFrame - tomboSnapFrame,
    fps,
    config: SNAP_CONFIG,
  });

  // === Drift continu Ken Burns ===
  const driftX = Math.sin(frame * 0.014) * 10;
  const driftY = Math.cos(frame * 0.011) * 7;
  const fgDriftX = Math.sin(frame * 0.014) * 13;
  const fgDriftY = Math.cos(frame * 0.011) * 9;
  const parallaxX = fgDriftX - driftX;
  const parallaxY = fgDriftY - driftY;

  // === CAMERA TARGET ===
  // Avant snap Tombouctou : on continue depuis fin S1 (camera centree Mali, scale ~1.30)
  // Apres snap : zoom plus serre vers Tombouctou (scale max 1.5 — fix pour pas couper Mali)
  const tombouctou = data.mercWide.cities.Tombouctou as [number, number];
  const tomboOffsetX = (tombouctou[0] - 360) * 0.65;
  const tomboOffsetY = (tombouctou[1] - 640) * 0.65;

  const camOffX = -50 * (1 - tomboSnapT) + tomboOffsetX * tomboSnapT;
  const camOffY = 80 * (1 - tomboSnapT) + tomboOffsetY * tomboSnapT;
  // Fix #4 : mercScale max 1.5 (au lieu de 1.85)
  const camScale = 1.30 + 0.20 * tomboSnapT;

  // === TILT (skewX + scaleY) — peak 20deg, breath +/-2deg ===
  // Tilt actif en continu pendant S2 (suite de S1)
  const tiltStrength = 1; // S2 commence apres S1, tilt deja en place
  const tiltPeak = 20;
  const tiltBreath = Math.sin(localFrame * 0.04) * 2;
  const tiltDeg = tiltPeak * tiltStrength + tiltBreath;
  const skewX = tiltDeg * 0.15;
  const scaleY = 1 - tiltDeg * 0.008;

  // === ICONES POP (livre + mosquee) ===
  const livreT = spring({
    frame: localFrame - bookBeatFrame,
    fps,
    config: POP_CONFIG,
  });
  const mosqueeT = spring({
    frame: localFrame - mosqueBeatFrame,
    fps,
    config: POP_CONFIG,
  });

  // === Vignette boost on "La moitie." [serious] ===
  const seriousOpacityBoost = interpolate(
    frame,
    [moitieSerious - 8, moitieSerious, moitieSerious + 30, moitieSerious + 45],
    [0, 0.25, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === DATA ===
  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");
  const djenne = data.mercWide.cities.Niani as [number, number];

  // Tombouctou icones positions (dans espace mercWide, avant transform camera)
  const tomboX = tombouctou[0];
  const tomboY = tombouctou[1] - 80;

  // Hide insert window content
  const inInsertWindow = frame >= insertStart && frame < insertEnd;

  return (
    <>
      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.6} />

      {/* MERCATOR LAYER (continue de S1) */}
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
          {/* Mali base + drapeau filigrane subtle 40% + halo dore continu (signature S1->S2) */}
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
              {/* Halo dore continu signature Mali — subtle, pas distrayant */}
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

          {/* Empire 1300 outline (continue de S1) */}
          {data.mercWide.maliEmpire1300 && (
            <AtlasEmpire
              pathD={data.mercWide.maliEmpire1300}
              outlineDark={true}
              hatchOpacity={0.55}
            />
          )}

          {/* Pulse markers Tombouctou + Djenne */}
          <AtlasPulseMarker
            coord={tombouctou}
            beatStart={tombouctouAppears}
            color={ATLAS_COLORS.empireGold}
          />
          <AtlasPulseMarker
            coord={djenne}
            beatStart={tombouctouAppears + fps * 0.5}
            color={ATLAS_COLORS.empireGold}
          />

          {/* Label Tombouctou — fix #3 : fontSize 22 (au lieu de 26) */}
          <AtlasLabel
            coord={tombouctou}
            text="TOMBOUCTOU"
            appearAt={tombouctouAppears + 10}
            offsetY={-32}
            fontSize={22}
          />

          {/* === ICONES TOMBOUCTOU (livre + mosquee, images Gemini) === */}
          {!inInsertWindow && livreT > 0.01 && (
            <IconCartouche
              x={tomboX - 50}
              y={tomboY}
              t={livreT}
              imageSrc={staticFile("atlas-mansa-moussa/assets/icon-book.png")}
              label="BIBL."
            />
          )}
          {!inInsertWindow && mosqueeT > 0.01 && (
            <IconCartouche
              x={tomboX + 50}
              y={tomboY}
              t={mosqueeT}
              imageSrc={staticFile("atlas-mansa-moussa/assets/icon-mosque.png")}
              label="SANKORE"
            />
          )}
        </g>
      </g>

      {/* === CARTOUCHES === */}
      {/* "+ DE BIBLIOTHEQUES QUE PARIS" — info non dite par la narration, garder */}
      <AtlasCartouche
        appearAt={tombouctouAppears + 5}
        disappearAt={sankoreAppears}
        text="+ DE BIBLIOTHEQUES"
        subtext="QUE PARIS A L'EPOQUE"
        x={360}
        y={140}
        fontSize={28}
      />

      {/* "25 000 ETUDIANTS" — cartouche micro-evenement gap sankoreAppears->climaxPivot (8.3s) */}
      <AtlasCartouche
        appearAt={sankoreAppears + 15}
        disappearAt={endFrame - 15}
        text="25 000 ETUDIANTS"
        subtext="A SANKORE"
        x={360}
        y={140}
        fontSize={28}
      />

      {/* Vignette boost on "La moitie." [serious] */}
      <rect
        x="0"
        y="0"
        width="720"
        height="1280"
        fill="url(#vignette)"
        opacity={seriousOpacityBoost}
        pointerEvents="none"
      />
    </>
  );
};
