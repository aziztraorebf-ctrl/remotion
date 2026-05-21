// S3 Expansion — Atlas Shaka Zulu
// Carte d3-geo reelle + 2 caravanes impi (nord + ouest) + bar chart 1500->50000
// Duree : 20.3s (frames 2195 -> 2804 globale, 0 -> 608 local)

import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import {
  AtlasMercator,
  AtlasCaravane,
  AtlasCartouche,
  AtlasDefs,
  estimateWaypointsLength,
} from "../../_shared/atlas-components";
import shakaData from "../../_shared/shaka-zulu-data.json";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

// Timing S3 (local frames)
const BARCHART_TRIGGER = 157;   // triggerFrame 2352 - startFrame 2195
const BARCHART_DURATION = 210;
const CINQUANTE_MILLE_LOCAL = 267; // startFrame 2462 - 2195
const CARTOUCHE_TRIGGER = 280;

export interface AtlasShakaS3ExpansionProps {
  durationFrames: number;
}

export const AtlasShakaS3Expansion: React.FC<AtlasShakaS3ExpansionProps> = ({
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera : zoom serre sur KwaZulu-Natal (2.5x) + pull-back progressif vers 1.8x
  // Centre de zoom : [420, 720] = region KwaZulu-Natal sur la carte 720x1280
  const camScale = interpolate(frame, [0, durationFrames], [2.5, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Decalage pour centrer KZN dans le viewport (point de la carte : ~420,720)
  // translateX = viewportCenterX - mapPointX * camScale
  const camX = 360 - 420 * camScale;
  const camY = 640 - 720 * camScale;

  // Drift subtil independant du zoom
  const driftX = Math.sin(frame * 0.010) * 4;
  const driftY = Math.cos(frame * 0.008) * 3;

  // Fade global
  const opacity = interpolate(
    frame,
    [0, 12, durationFrames - 12, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Contour pulse bordeaux sur ZAF — amplitude reduite (moins agressif que S1)
  const pulseT = (frame % (fps * 2.5)) / (fps * 2.5);
  const borderOpacity = 0.45 + 0.25 * Math.sin(pulseT * Math.PI * 2);
  const borderWidth = 2.0 + 1.5 * Math.sin(pulseT * Math.PI * 2);

  const expansion = shakaData.expansion;
  const countries = expansion.countries as { iso: string; d: string }[];
  const zafPath = countries.find((c) => c.iso === "ZAF")?.d ?? "";

  // Timing impi (local frames) — defini ici pour les calculs de couleur
  const IMPI_NORD_START = 60;
  const IMPI_NORD_END = 500;
  const IMPI_OUEST_START = 100;
  const IMPI_OUEST_END = 520;

  // Couleurs de base
  const OR_ZULU = "#C8A84B";
  const TERRACOTTA = "#C67B5A"; // couleur pays non-conquis

  // SWZ : deja territoire Zulu vassalise, s'illumine tot (impi nord t=0.10 -> frame 104)
  const swzT = interpolate(frame, [IMPI_NORD_START + 44, IMPI_NORD_START + 90], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // MOZ : conquis par impi nord au nord (t=0.40 -> frame 236, plein a t=0.75 -> frame 390)
  const mozT = interpolate(frame, [IMPI_NORD_START + 176, IMPI_NORD_START + 350], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Interpolation couleur terracotta -> or pour chaque pays
  function lerpColor(t: number): string {
    const r1 = 0xC6, g1 = 0x7B, b1 = 0x5A;
    const r2 = 0xC8, g2 = 0xA8, b2 = 0x4B;
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r},${g},${b})`;
  }

  const highlightFills: Record<string, string> = {
    ZAF: OR_ZULU,
    SWZ: lerpColor(swzT),
    LSO: lerpColor(swzT * 0.7), // LSO suit SWZ avec leger retard
    MOZ: lerpColor(mozT),
  };

  // Paths impi precalcules dans le JSON
  const impiPathNord = expansion.impiPathNord as string;
  const impiPathOuest = expansion.impiPathOuest as string;
  const waypointsNord = expansion.impiWaypointsNord as [number, number][];
  const waypointsOuest = expansion.impiWaypointsOuest as [number, number][];

  const pathLengthNord = estimateWaypointsLength(waypointsNord);
  const pathLengthOuest = estimateWaypointsLength(waypointsOuest);

  // Walk cycle frames PixelLab (6 frames east + north)
  const WALK_EAST = [
    "atlas-shaka-zulu/assets/warrior-walk-cycle/east/frame_000.png",
    "atlas-shaka-zulu/assets/warrior-walk-cycle/east/frame_001.png",
    "atlas-shaka-zulu/assets/warrior-walk-cycle/east/frame_002.png",
    "atlas-shaka-zulu/assets/warrior-walk-cycle/east/frame_003.png",
    "atlas-shaka-zulu/assets/warrior-walk-cycle/east/frame_004.png",
    "atlas-shaka-zulu/assets/warrior-walk-cycle/east/frame_005.png",
  ];
  const WALK_NORTH = [
    "atlas-shaka-zulu/assets/warrior-walk-cycle/north/frame_000.png",
    "atlas-shaka-zulu/assets/warrior-walk-cycle/north/frame_001.png",
    "atlas-shaka-zulu/assets/warrior-walk-cycle/north/frame_002.png",
    "atlas-shaka-zulu/assets/warrior-walk-cycle/north/frame_003.png",
    "atlas-shaka-zulu/assets/warrior-walk-cycle/north/frame_004.png",
    "atlas-shaka-zulu/assets/warrior-walk-cycle/north/frame_005.png",
  ];

  // Progression des impi pour overlay territoire (dashOffset = chemin revele)
  const tNord = interpolate(frame, [IMPI_NORD_START, IMPI_NORD_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tOuest = interpolate(frame, [IMPI_OUEST_START, IMPI_OUEST_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dashNord = pathLengthNord * (1 - tNord);
  const dashOuest = pathLengthOuest * (1 - tOuest);

  // Bar chart visibility
  const barchartVisible =
    frame >= BARCHART_TRIGGER && frame < BARCHART_TRIGGER + BARCHART_DURATION;
  const barchartLocal = frame - BARCHART_TRIGGER;

  const bar1816Width = interpolate(barchartLocal, [0, 25], [0, 1500 / 50000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bar1828Width = interpolate(barchartLocal, [50, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const statsLineT = spring({
    frame: Math.max(0, barchartLocal - 120),
    fps,
    config: { damping: 15, stiffness: 100 },
    from: 0,
    to: 1,
  });

  return (
    <AbsoluteFill style={{ background: "#1A1F3A", opacity }}>
      <svg
        width="720"
        height="1280"
        viewBox="0 0 720 1280"
        style={{ position: "absolute", inset: 0 }}
      >
        <AtlasDefs />
        <rect width="720" height="1280" fill="url(#bgGrad)" />

        {/* Groupe camera — zoom serre sur KwaZulu-Natal */}
        <g transform={`translate(${camX + driftX} ${camY + driftY}) scale(${camScale})`}>

          {/* Carte plate */}
          <AtlasMercator
            countries={countries}
            highlightIso={["ZAF", "SWZ", "LSO"]}
            highlightFills={highlightFills}
            scale={1}
            driftX={0}
            driftY={0}
          />

          {/* Contour pulse bordeaux ZAF */}
          {zafPath && (
            <path
              d={zafPath}
              fill="none"
              stroke={SHAKA_PALETTE.BORDEAUX}
              strokeWidth={borderWidth / camScale}
              strokeOpacity={borderOpacity}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* Chemins d'expansion — traces fins sous les sprites pour lisibilite */}
          <path d={impiPathNord} fill="none" stroke="#1A0A00" strokeWidth={4 / camScale} strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
          <path d={impiPathOuest} fill="none" stroke="#1A0A00" strokeWidth={4 / camScale} strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
          <path d={impiPathNord} fill="none" stroke="#D4A843" strokeWidth={2.5 / camScale} strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          <path d={impiPathOuest} fill="none" stroke="#D4A843" strokeWidth={2.5 / camScale} strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />

          {/* Impi nord — guerrier walk cycle nord (vers le nord) */}
          <AtlasCaravane
            startFrame={IMPI_NORD_START}
            endFrame={IMPI_NORD_END}
            pathD={impiPathNord}
            pathTotalLength={pathLengthNord}
            waypoints={waypointsNord}
            chibiSize={90}
            showHaloOnPath={false}
            hopAmplitude={3}
            walkFrames={WALK_NORTH}
            walkSpeed={6}
            tOffset={0}
          />

          {/* Impi ouest — guerrier walk cycle EST flippe horizontalement (vers la gauche) */}
          {/* Le flip est applique via transform sur le groupe autour du sprite */}
          <AtlasCaravane
            startFrame={IMPI_OUEST_START}
            endFrame={IMPI_OUEST_END}
            pathD={impiPathOuest}
            pathTotalLength={pathLengthOuest}
            waypoints={waypointsOuest}
            chibiSize={90}
            showHaloOnPath={false}
            hopAmplitude={3}
            walkFrames={WALK_EAST}
            walkSpeed={6}
            tOffset={0}
            flipX={true}
          />

        </g>

        {/* Cartouche "100 000 GUERRIERS" apres le climax */}
        <AtlasCartouche
          appearAt={CARTOUCHE_TRIGGER}
          disappearAt={durationFrames - 20}
          text="50 000 GUERRIERS"
          subtext="1828 — x33 en 12 ans"
          x={360}
          y={180}
          fontSize={34}
        />

        <rect width="720" height="1280" fill="url(#vignette)" />
      </svg>

      {/* Bar chart SVG overlay — pattern interrupt */}
      {barchartVisible && (
        <div style={{ position: "absolute", inset: 0 }}>
          <Sequence from={BARCHART_TRIGGER} durationInFrames={BARCHART_DURATION}>
            <AbsoluteFill
              style={{
                background: "rgba(13, 13, 13, 0.88)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <svg viewBox="0 0 720 1280" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <filter id="barGlow">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={SHAKA_PALETTE.OR} floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* Titre */}
                <text
                  x="360" y="480"
                  textAnchor="middle"
                  fontFamily={SHAKA_FONTS.TITRE}
                  fontSize="32"
                  fontWeight="700"
                  fill={SHAKA_PALETTE.PARCHEMIN}
                  letterSpacing="3"
                >
                  ARMÉE ZULU
                </text>

                {/* Label 1816 */}
                <text x="120" y="560" fontFamily={SHAKA_FONTS.TITRE} fontSize="26" fill={SHAKA_PALETTE.PARCHEMIN} opacity="0.8">
                  1816
                </text>
                <text x="120" y="590" fontFamily={SHAKA_FONTS.TITRE} fontSize="22" fill={SHAKA_PALETTE.OR} opacity="0.8">
                  1 500
                </text>
                {/* Bar 1816 */}
                <rect x="120" y="605" width="480" height="44" fill="#1A1A1A" rx="4" />
                <rect
                  x="120" y="605"
                  width={480 * bar1816Width}
                  height="44"
                  fill={SHAKA_PALETTE.OR}
                  rx="4"
                  filter="url(#barGlow)"
                />

                {/* Label 1828 */}
                <text x="120" y="700" fontFamily={SHAKA_FONTS.TITRE} fontSize="26" fill={SHAKA_PALETTE.PARCHEMIN} opacity="0.8">
                  1828
                </text>
                <text x="120" y="730" fontFamily={SHAKA_FONTS.TITRE} fontSize="22" fill={SHAKA_PALETTE.BORDEAUX} opacity={bar1828Width > 0 ? 1 : 0}>
                  50 000
                </text>
                {/* Bar 1828 */}
                <rect x="120" y="745" width="480" height="44" fill="#1A1A1A" rx="4" />
                <rect
                  x="120" y="745"
                  width={480 * bar1828Width}
                  height="44"
                  fill={SHAKA_PALETTE.BORDEAUX}
                  rx="4"
                />

                {/* Stats line "20% vs 5%" */}
                <g opacity={statsLineT} transform={`translate(0 ${(1 - statsLineT) * 20})`}>
                  <text
                    x="360" y="870"
                    textAnchor="middle"
                    fontFamily={SHAKA_FONTS.TITRE}
                    fontSize="34"
                    fontWeight="700"
                    fill={SHAKA_PALETTE.OR}
                    letterSpacing="2"
                  >
                    20 % aux armes
                  </text>
                  <text
                    x="360" y="910"
                    textAnchor="middle"
                    fontFamily={SHAKA_FONTS.CORPS}
                    fontSize="24"
                    fill={SHAKA_PALETTE.PARCHEMIN}
                    opacity="0.75"
                  >
                    vs 5 % en Europe
                  </text>
                </g>

                {/* Source */}
                <g opacity={statsLineT}>
                  <rect x="160" y="970" width="400" height="52" fill={SHAKA_PALETTE.PARCHEMIN} rx="5" opacity="0.12" />
                  <text
                    x="360" y="992"
                    textAnchor="middle"
                    fontFamily={SHAKA_FONTS.CORPS}
                    fontSize="17"
                    fill={SHAKA_PALETTE.PARCHEMIN}
                    opacity="0.55"
                    letterSpacing="1"
                  >
                    SOURCE
                  </text>
                  <text
                    x="360" y="1014"
                    textAnchor="middle"
                    fontFamily={SHAKA_FONTS.CORPS}
                    fontSize="17"
                    fill={SHAKA_PALETTE.PARCHEMIN}
                    opacity="0.55"
                    fontStyle="italic"
                  >
                    John Laband, Rope of Sand (1995)
                  </text>
                </g>
              </svg>
            </AbsoluteFill>
          </Sequence>
        </div>
      )}
    </AbsoluteFill>
  );
};
