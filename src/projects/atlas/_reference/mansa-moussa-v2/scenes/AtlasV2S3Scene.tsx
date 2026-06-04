// S3 Climax Hadj Scene - port AtlasV2SceneS3Test Iter2 (validee Aziz + Gemini)
// V2 FINITION : ajustement rythme + tilt skewX peak 28deg + parallax + halo Mali continu
// Pattern reference : AtlasV2RhythmTiltDemo.tsx + S1/S2 v3
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
  AtlasEmpire,
  AtlasSubtleStars,
  AtlasPulseMarker,
  AtlasLabel,
  estimateWaypointsLength,
  atlasV2Data as data,
} from "../atlas-v2-components";
import { getFlagFill } from "../atlas-v2-flags";
import { AtlasPixelChar } from "./AtlasPixelChar";

interface S3SceneProps {
  startFrame: number;
  endFrame: number;
  beats: {
    climaxPivot: number;
    douzeCouronnement: number;
    mecqueDeparture: number;
    mecqueWord: number;
    soixanteHommes: number;
    douzeMille: number;
    chameaux: number;
  };
}

export const AtlasV2S3Scene: React.FC<S3SceneProps> = ({
  startFrame,
  endFrame,
  beats,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame >= endFrame) return null;

  const localFrame = frame - startFrame;

  // === Camera : phase A wide entry, phase B slight zoom, phase C wide pull-back ===
  const phaseA_end = fps * 6;
  const phaseB_end = fps * 12;

  // === Drift Ken Burns + parallax foreground ===
  const driftX = Math.sin(frame * 0.014) * 18;
  const driftY = Math.cos(frame * 0.011) * 10;
  const fgDriftX = Math.sin(frame * 0.014) * 22;
  const fgDriftY = Math.cos(frame * 0.011) * 13;
  const parallaxX = fgDriftX - driftX;
  const parallaxY = fgDriftY - driftY;

  const scale = localFrame < phaseA_end
    ? 1.0
    : localFrame < phaseB_end
      ? interpolate(localFrame, [phaseA_end, phaseB_end], [1.0, 1.18], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(localFrame, [phaseB_end, endFrame - startFrame], [1.18, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const centerOffsetX = interpolate(localFrame, [0, phaseB_end], [0, 60], {
    extrapolateRight: "clamp",
  });

  // === TILT (skewX + scaleY) — peak 28deg pour S3 climax ===
  // Tilt continu (suite de S2), avec breath +/-2deg
  const tiltPeak = 28;
  const tiltBreath = Math.sin(localFrame * 0.04) * 2;
  const tiltDeg = tiltPeak + tiltBreath;
  const skewX = tiltDeg * 0.15;
  const scaleY = 1 - tiltDeg * 0.008;

  // Caravane path
  const wp = data.mercWide.caravaneWaypoints;
  const waypoints: [number, number][] = [
    wp.Niani as [number, number],
    wp.Tombouctou as [number, number],
    wp.Sahara1 as [number, number],
    wp.Sahara2 as [number, number],
    wp.LeCaire as [number, number],
    wp.Sinai as [number, number],
    wp.Mecque as [number, number],
  ];
  const lenEstimate = estimateWaypointsLength(waypoints);

  // === PIXEL SPRITES — position sur waypoints ===
  // Trajet visuel : toute la duree de S3 (mecqueDeparture -> fin scene)
  // mecqueWord = beat narratif pour la pose royale, mais le trajet prend toute la scene
  const caravaneStart = beats.mecqueDeparture;
  const caravaneEnd = endFrame - Math.round(fps * 5); // arrive 5s avant fin S3
  // Pose royale : caravaneEnd -> fin scene (fade out inclus)
  const royalPoseEnd = endFrame;

  const getWaypointPos = (t: number): [number, number] => {
    const clampedT = Math.max(0, Math.min(1, t));
    const segmentT = clampedT * (waypoints.length - 1);
    const segIdx = Math.min(Math.floor(segmentT), waypoints.length - 2);
    const localT = segmentT - segIdx;
    const p1 = waypoints[segIdx];
    const p2 = waypoints[segIdx + 1];
    return [
      p1[0] + (p2[0] - p1[0]) * localT,
      p1[1] + (p2[1] - p1[1]) * localT,
    ];
  };

  // Mansa Moussa marche en tete
  const mansaT = interpolate(frame, [caravaneStart, caravaneEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const [mansaCx, mansaCy] = getWaypointPos(mansaT);

  // Chameau suit avec 0.06 de retard sur le path
  const [chameauCx, chameauCy] = getWaypointPos(mansaT - 0.06);

  // Soldat et porteur — espacement resserre pour rester dans le cadre camera
  const [soldatCx, soldatCy] = getWaypointPos(mansaT - 0.10);
  const [porteurCx, porteurCy] = getWaypointPos(mansaT - 0.14);

  // Pose royale apres caravaneEnd, fade out vers fin scene
  const atMecque = frame >= caravaneEnd;
  const spriteVisible = frame >= caravaneStart && frame < royalPoseEnd;
  const spriteOpacity = atMecque
    ? interpolate(frame, [caravaneEnd, royalPoseEnd], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      })
    : 1;

  // === CAMERA TRACK sur Mansa pendant la caravane ===
  // Zoom in au depart, maintien pendant trajet, pull-back apres pose royale
  // zoomInEnd = 3s apres depart, jamais depasse caravaneEnd
  const zoomInEnd = Math.min(caravaneStart + Math.round(fps * 3), caravaneEnd - 5);
  const camZoom = interpolate(
    frame,
    [caravaneStart, zoomInEnd, caravaneEnd, royalPoseEnd],
    [1.0, 2.0, 2.0, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tilt s'annule au zoom pour que les sprites restent lisibles en gros plan
  const effectiveTilt = interpolate(
    frame,
    [caravaneStart, zoomInEnd],
    [tiltDeg, 8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const skewXTrack = effectiveTilt * 0.15;
  const scaleYTrack = 1 - effectiveTilt * 0.008;

  // Camera suit Mansa en temps reel pendant le trajet, puis pull-back
  const activeCamX = atMecque
    ? interpolate(frame, [caravaneEnd, royalPoseEnd], [mansaCx, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : frame >= caravaneStart
      ? mansaCx
      : 360;
  const activeCamY = atMecque
    ? interpolate(frame, [caravaneEnd, royalPoseEnd], [mansaCy, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : frame >= caravaneStart
      ? mansaCy
      : 640;

  const tombouctou = data.mercWide.cities.Tombouctou as [number, number];
  const caire = data.mercWide.cities.LeCaire as [number, number];
  const mecque = data.mercWide.cities.Mecque as [number, number];

  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter(
    (c) => c.iso !== "MLI" && c.iso !== "EGY" && c.iso !== "SAU"
  );
  const egypt = data.mercWide.countries.find((c) => c.iso === "EGY");
  const saudi = data.mercWide.countries.find((c) => c.iso === "SAU");

  return (
    <>
      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.6} />

      <g
        transform={`
          translate(${360 + driftX - centerOffsetX} ${640 + driftY})
          scale(${scale * camZoom} ${scale * camZoom * scaleYTrack})
          skewX(${skewXTrack})
          translate(${-activeCamX} ${-activeCamY})
        `}
      >
        <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.oceanDeep} />

        {/* Other countries (terracotta uniforme) */}
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

        {/* Egypte + Arabie Saoudite (creme highlight pour route Hadj) */}
        {egypt && (
          <path
            d={egypt.d}
            fill={ATLAS_COLORS.egyptFill}
            stroke={ATLAS_COLORS.empireOutlineDark}
            strokeWidth="2"
          />
        )}
        {saudi && (
          <path
            d={saudi.d}
            fill={ATLAS_COLORS.egyptFill}
            stroke={ATLAS_COLORS.empireOutlineDark}
            strokeWidth="2"
          />
        )}

        {/* === FOREGROUND PARALLAX : Mali + Empire + caravane bougent un peu plus === */}
        <g transform={`translate(${parallaxX} ${parallaxY})`}>
          {/* Mali drapeau filigrane subtle + halo dore continu (signature) */}
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

          {/* Mali Empire 1300 (continue de S1/S2) */}
          {data.mercWide.maliEmpire1300 && (
            <AtlasEmpire pathD={data.mercWide.maliEmpire1300} outlineDark={true} />
          )}

          {/* Route caravane : path or anime (halo blanc + or) */}
          {frame >= caravaneStart && (() => {
            const pathT = interpolate(frame, [caravaneStart, beats.chameaux + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const dashOffset = lenEstimate * (1 - pathT);
            return (
              <g>
                <path
                  d={data.mercWide.caravaneSmooth}
                  fill="none"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="9"
                  strokeDasharray={lenEstimate}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={data.mercWide.caravaneSmooth}
                  fill="none"
                  stroke="#FFE9C2"
                  strokeWidth="7"
                  strokeDasharray={lenEstimate}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.35"
                />
                <path
                  d={data.mercWide.caravaneSmooth}
                  fill="none"
                  stroke={ATLAS_COLORS.empireGold}
                  strokeWidth="3.2"
                  strokeDasharray={lenEstimate}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })()}

          {/* Porteur — derriere le soldat */}
          {frame >= caravaneStart && spriteVisible && (
            <g opacity={spriteOpacity}>
              <AtlasPixelChar
                charPath="atlas-mansa-moussa/characters/porteur-mali"
                animName="walk_cycle"
                x={porteurCx}
                y={porteurCy}
                size={48}
                direction="east"
                animated={!atMecque}
                frameCount={6}
                appearAt={caravaneStart}
              />
            </g>
          )}

          {/* Soldat — entre chameau et mansa */}
          {frame >= caravaneStart && spriteVisible && (
            <g opacity={spriteOpacity}>
              <AtlasPixelChar
                charPath="atlas-mansa-moussa/characters/soldat-mali"
                animName="walk_cycle"
                x={soldatCx}
                y={soldatCy}
                size={48}
                direction="east"
                animated={!atMecque}
                frameCount={6}
                appearAt={caravaneStart}
              />
            </g>
          )}

          {/* Chameau — walk east pendant trajet, static apres mecqueWord, fade out */}
          {frame >= caravaneStart && spriteVisible && (
            <g opacity={spriteOpacity}>
              <AtlasPixelChar
                charPath="atlas-mansa-moussa/characters/chameau"
                animName="walk_cycle"
                x={chameauCx}
                y={chameauCy}
                size={48}
                direction="east"
                animated={!atMecque}
                frameCount={4}
                appearAt={caravaneStart}
              />
            </g>
          )}

          {/* Mansa Moussa — walk east pendant trajet, pose royale a La Mecque, fade out */}
          {frame >= caravaneStart && spriteVisible && (
            <g opacity={spriteOpacity}>
              <AtlasPixelChar
                charPath="atlas-mansa-moussa/characters/mansa-moussa"
                animName={atMecque ? "royal_pose" : "walk_cycle"}
                x={mansaCx}
                y={mansaCy}
                size={64}
                direction={atMecque ? "south" : "east"}
                animated={true}
                frameCount={atMecque ? 4 : 6}
                appearAt={caravaneStart}
              />
            </g>
          )}

          {/* Pulse markers + labels villes */}
          <AtlasPulseMarker
            coord={tombouctou}
            beatStart={startFrame}
            color={ATLAS_COLORS.empireGold}
          />
          <AtlasPulseMarker
            coord={caire}
            beatStart={beats.mecqueDeparture + 80}
            color={ATLAS_COLORS.empireGold}
          />
          <AtlasPulseMarker
            coord={mecque}
            beatStart={beats.mecqueWord}
            color={ATLAS_COLORS.empireGold}
          />

          <AtlasLabel
            coord={caire}
            text="LE CAIRE"
            appearAt={beats.mecqueDeparture + 80}
            offsetY={-32}
            fontSize={22}
          />
          <AtlasLabel
            coord={mecque}
            text="LA MECQUE"
            appearAt={beats.mecqueWord}
            offsetY={-32}
            fontSize={22}
          />
        </g>
      </g>

      {/* === SFX === */}
      <Sequence from={beats.mecqueDeparture}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/C-caravane-ink-draw.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={beats.douzeCouronnement - 5}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/D-cartouche-thud.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={beats.soixanteHommes - 5}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/D-cartouche-thud.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={beats.douzeMille - 5}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/D-cartouche-thud.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={beats.chameaux - 5}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/D-cartouche-thud.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={beats.mecqueWord}>
        <Audio src={staticFile("atlas-mansa-moussa/sfx/F-crowd-mecque.mp3")} volume={0.5} />
      </Sequence>

    </>
  );
};
